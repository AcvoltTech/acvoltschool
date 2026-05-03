    // ─── users-data helper available before lazy-loaded users-data-client.js ───
    // Tier 0 file, runs at bootstrap. Defines window._usersData for any tier
    // 0/1 caller (auth.js, supabase-init.js itself) that needs to query the
    // locked-down `users` table via the users-data edge function.
    window._usersData = async function(action, params) {
      try {
        var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
        var sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
        var body = Object.assign({ action: action }, params || {});
        var resp = await fetch(sbUrl + '/functions/v1/users-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey },
          body: JSON.stringify(body),
        });
        var json = await resp.json().catch(function(){ return {}; });
        if (!resp.ok && !json.error) json.error = 'HTTP ' + resp.status;
        return json;
      } catch (e) { return { error: (e && e.message) || 'fetch failed' }; }
    };

    // PRODUCTION FIX 2026-04-26: previous refactor (Sprint B) introduced calls
    // to usersDataSelf/usersDataAdmin from non-admin code paths. Those helpers
    // were originally lazy-loaded via js/users-data-client.js (only loaded
    // after admin login), so non-admin users hit "ReferenceError: Can't find
    // variable: usersDataSelf". Expose them eagerly on window from tier 0
    // here so every code path has them available the moment Supabase init runs.
    window.usersDataSelf = window._usersData;
    window.usersDataAdmin = function(action, params) {
      var adminEmail = '';
      try {
        adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
      } catch (_) {}
      return window._usersData(action, Object.assign({ admin_email: adminEmail }, params || {}));
    };

    function initSupabase() {
      if (window.supabase) {
        supabaseClient = window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
        console.log('[MaestroAC] Supabase connected ✅');
        var failBanner = document.getElementById('supabaseFailBanner');
        if (failBanner) failBanner.style.display = 'none';
        // Register auth state listener
        supabaseClient.auth.onAuthStateChange(function(event, session) {
            console.log('[MaestroAC] Auth event:', event);
            if (event === 'PASSWORD_RECOVERY') {
                showScreen('loginScreen');
                var loginCard = document.querySelector('#loginScreen .card');
                if (loginCard) loginCard.style.display = 'none';
                var resetBox = document.getElementById('resetPasswordBox');
                if (resetBox) resetBox.style.display = 'block';
                var registerBtn = document.querySelector('#loginScreen .btn-secondary[onclick*="registerScreen"]');
                if (registerBtn) registerBtn.parentElement.style.display = 'none';
            }
            if (event === 'SIGNED_IN' && session) {
                // Skip auto-login during password recovery flow — otherwise the
                // recovery session triggers SIGNED_IN, we mark the user as
                // authenticated, and they bypass the reset form.
                if (window._isRecoveryFlow) {
                    console.log('[MaestroAC] SIGNED_IN ignored during recovery flow');
                } else {
                    localStorage.setItem('tecnico_authenticated', 'true');
                    localStorage.setItem('tecnico_email', session.user.email);
                }
            }
            if (event === 'SIGNED_OUT') {
                localStorage.removeItem('tecnico_authenticated');
                localStorage.removeItem('tecnico_email');
            }
        });
        return true;
      }
      return false;
    }
    
    // Safe init wrapper that catches errors and guarantees a screen shows
    function _safeInit() {
      try {
        init().catch(function(e) {
          console.error('[MaestroAC] init() async error:', e);
          if (!document.querySelector('.screen.active')) showScreen('loginScreen');
        });
      } catch(e) {
        console.error('[MaestroAC] init() sync error:', e);
        if (!document.querySelector('.screen.active')) showScreen('loginScreen');
      }
    }

    // Try to init immediately
    if (!initSupabase()) {
      // Progressive retry: 3s, 6s, 12s
      var _retryDelays = [3000, 6000, 12000];
      var _retryIdx = 0;
      function _retrySupabase() {
        if (supabaseClient) return; // already connected
        if (_retryIdx >= _retryDelays.length) {
          console.warn('[MaestroAC] Supabase unavailable after ' + _retryDelays.length + ' retries — showing login');
          if (!document.querySelector('.screen.active')) showScreen('loginScreen');
          return;
        }
        var delay = _retryDelays[_retryIdx++];
        console.warn('[MaestroAC] Supabase not ready, retrying in ' + (delay/1000) + 's...');
        setTimeout(function() {
          if (!supabaseClient && initSupabase()) {
            console.log('[MaestroAC] Supabase connected on retry ' + _retryIdx + ' ✅');
            if (document.querySelector('#loginScreen.active')) {
              _safeInit();
            }
          } else if (!supabaseClient) {
            _retrySupabase();
          }
        }, delay);
      }
      _retrySupabase();
    } else {
      // Supabase connected on first try — run init
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { _safeInit(); });
      } else {
        _safeInit();
      }
    }
    let supabaseUserId = null;
    let isOnline = navigator.onLine;

    window.addEventListener('online', () => { isOnline = true; syncToSupabase(); });
    window.addEventListener('offline', () => { isOnline = false; });

    // Auth state change listener — registered inside initSupabase()

    // ============================================
    // SUPABASE DATABASE LAYER
    // ============================================
    async function supabaseRegisterUser(userData) {
      if (!supabaseClient || !isOnline) return null;
      try {
        var emailKey = (userData.email || '').toLowerCase();
        var existingRes = await window._usersData('get_self', { email: emailKey, fields: ['id'] });
        var existing = existingRes.data ? [existingRes.data] : [];
        if (existing.length > 0) {
          supabaseUserId = existing[0].id;
          window.supabaseUserId = supabaseUserId;
          var updateFields = { ultimo_acceso: new Date().toISOString() };
          if (userData.nombre) updateFields.nombre = userData.nombre;
          if (userData.telefono) updateFields.telefono = userData.telefono;
          if (userData.ciudad) updateFields.ciudad = userData.ciudad;
          if (userData.estado) updateFields.estado = userData.estado;
          if (userData.experiencia) updateFields.experiencia = userData.experiencia;
          // epa, osha, hvace are admin-writable only — skipped here intentionally
          // (cert claims need verification, not self-claim — see Sprint B notes)
          await window._usersData('upsert_self', { email: emailKey, data: updateFields });
          return supabaseUserId;
        }
        var registerRes = await window._usersData('upsert_self', {
          email: emailKey,
          data: {
            nombre: userData.nombre || '',
            telefono: userData.telefono || ''
          }
        });
        if (registerRes.error) { console.error('Supabase register error:', registerRes.error); return null; }
        supabaseUserId = registerRes.data && registerRes.data.id;
        window.supabaseUserId = supabaseUserId;
        return supabaseUserId;
      } catch (e) { console.error('Supabase register exception:', e); return null; }
    }

    async function supabaseSaveProgress(progressData) {
      if (!supabaseClient || !isOnline || !supabaseUserId) return;
      try {
        await Promise.all(Object.entries(progressData).map(([nivel, data]) => {
          const porcentaje = data.total > 0 ? ((data.score / data.total) * 100).toFixed(2) : 0;
          return supabaseClient.from('user_progress').upsert({
            user_id: supabaseUserId, nivel, completed: data.completed, score: data.score,
            total: data.total, porcentaje, fecha_completado: data.completed >= data.total ? new Date().toISOString() : null
          }, { onConflict: 'user_id,nivel' });
        }));
      } catch (e) { console.error('Supabase save progress error:', e); }
    }

    async function supabaseSaveCertificate(cert) {
      if (!supabaseClient || !isOnline || !supabaseUserId) return;
      try {
        var nivel = cert.nivel || cert.level || cert.levelId;
        await supabaseClient.from('certificates').upsert({
          user_id: supabaseUserId,
          nivel: nivel,
          score: cert.score || 0,
          total_questions: cert.totalQuestions || cert.total_questions || 0,
          porcentaje: cert.percentage || cert.porcentaje || cert.score || 0,
          certificate_number: cert.certificateNumber || cert.certificateId || null,
          fecha_obtenido: cert.dateRaw || cert.date || new Date().toISOString()
        }, { onConflict: 'user_id,nivel', ignoreDuplicates: false });
        console.log('[Cert] Saved to Supabase:', nivel);
      } catch (e) { console.error('Supabase save certificate error:', e); }
    }

    async function supabaseSaveQuizAttempt(attemptData) {
      if (!supabaseClient || !isOnline || !supabaseUserId) return;
      try {
        var insertData = {
          user_id: supabaseUserId, nivel: attemptData.nivel, total_questions: attemptData.totalQuestions,
          correct_answers: attemptData.correctAnswers, wrong_answers: attemptData.wrongAnswers,
          porcentaje: attemptData.porcentaje, tiempo_segundos: attemptData.tiempoSegundos || null,
          aprobado: attemptData.aprobado
        };
        // Include server-verified count if available (for audit trail)
        if (typeof attemptData.serverVerified === 'number') {
          insertData.server_verified = attemptData.serverVerified;
        }
        await supabaseClient.from('quiz_attempts').insert(insertData);
      } catch (e) { console.error('Supabase save quiz attempt error:', e); }
    }

    async function supabaseSaveTechnicianNumber(techNumber, techDate) {
      if (!supabaseClient) { console.warn('[TechNum] No supabaseClient'); return; }
      try {
        var email = (currentUser && currentUser.email) ? currentUser.email : localStorage.getItem('tecnico_email');
        if (!email) { console.warn('[TechNum] No email available'); return; }
        // Save using upsert via edge function (handles both update + insert path)
        var res = await window._usersData('upsert_self', {
          email: email,
          data: {
            technician_number: techNumber,
            technician_number_date: techDate,
            nombre: (currentUser && currentUser.nombre) || email.split('@')[0]
          }
        });
        if (res.error) {
          console.error('[TechNum] Upsert error:', res.error);
        } else {
          console.log('[TechNum] Saved successfully:', res.data && res.data.technician_number);
        }
      } catch (e) { console.error('[TechNum] Save exception:', e); }
    }

    async function supabaseUpdateNivel(nivel) {
      if (!supabaseClient || !isOnline) return;
      try {
        var email = (currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || '';
        if (!email) return;
        await window._usersData('update_self_level', { email: email, nivel_actual: nivel });
      } catch (e) { console.error('Supabase update nivel error:', e); }
    }

    async function supabaseLoadUserData() {
      if (!supabaseClient || !isOnline || !supabaseUserId) return null;
      try {
        const [progressRes, certsRes] = await Promise.all([
          supabaseClient.from('user_progress').select('*').eq('user_id', supabaseUserId),
          supabaseClient.from('certificates').select('*').eq('user_id', supabaseUserId)
        ]);
        return { progress: progressRes.data, certificates: certsRes.data };
      } catch (e) { console.error('Supabase load error:', e); return null; }
    }

    async function syncToSupabase() {
      if (!supabaseClient || !isOnline || !supabaseUserId) return;
      try {
        await Promise.all([
          supabaseSaveProgress(progress),
          ...certificates.map(cert => supabaseSaveCertificate(cert))
        ]);
        console.log('[MaestroAC] Synced to Supabase ✅');
      } catch (e) { console.error('Sync error:', e); }
    }
