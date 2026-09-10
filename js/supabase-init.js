    // ─── Admin Bearer helper (FIX 2026-06-24) ───────────────────────────────
    // Las edge functions admin (users-data, admin-data, admin-payments,
    // get-stripe-data) se endurecieron en la auditoría de venta: ahora EXIGEN
    // el JWT real del admin (verifyAdminAuth → auth.getUser). Mandar el anon key
    // como Bearer daba 401 "Invalid or expired authentication token" (a Manuel
    // se le borraba/​no guardaba el trabajo). Este helper devuelve el access_token
    // de la sesión activa; si no hay sesión (contexto anónimo), cae al anon key
    // (mismo comportamiento de antes para llamadas públicas).
    window.getAdminBearer = async function () {
      try {
        var sc = window.supabaseClient;
        if (sc && sc.auth && sc.auth.getSession) {
          var s = await sc.auth.getSession();
          var t = s && s.data && s.data.session && s.data.session.access_token;
          if (t) return t;
        }
      } catch (_) {}
      return (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
    };

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
          headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + (await window.getAdminBearer()) },
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
    function _adminEmail() {
      try { return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; }
      catch (_) { return ''; }
    }
    // admin_list capaba en 1000 filas (default de PostgREST): pedir limit:5000 era mentira,
    // la edge devolvía a lo mucho 1000 → el CRM sólo veía ~1000 de 7000+ técnicos (Mario
    // 2026-07-12: "mis registros de usuarios no aparecen en el CRM"). Cuando el caller pide
    // la lista COMPLETA (limit grande/ausente, sin offset propio), paginamos solo de 1000 en
    // 1000 hasta vaciar y devolvemos TODO. Los que piden un preview chico (ej. limit:10) o ya
    // paginan a mano (offset presente) NO se tocan — mismo shape { data: [...] }. Va en tier0 (garantizado
    // activo) además del helper lazy users-data-client.js.
    async function _adminListAllPages(action, params) {
      var PAGE = 1000, all = [], seen = Object.create(null), offset = 0, guard = 0;
      while (guard++ < 100) {
        var pageBody = Object.assign({ admin_email: _adminEmail() }, params, { offset: offset, limit: PAGE });
        var resp = await window._usersData(action, pageBody);
        if (resp && resp.error) {
          if (all.length === 0) return resp;
          try { console.warn('[usersDataAdmin] paginado corto en offset', offset, resp.error); } catch (_) {}
          break;
        }
        var batch = (resp && resp.data) || [];
        var added = 0;
        for (var i = 0; i < batch.length; i++) {
          var row = batch[i];
          // dedup por id o email — RED DE SEGURIDAD: si la edge ignorara offset y repitiera
          // la 1ª página, added=0 en la 2ª y cortamos (jamás duplicamos ni loopeamos 100 veces).
          var kk = row && (row.id != null ? 'i' + row.id : (row.email ? 'e' + String(row.email).toLowerCase() : null));
          if (kk == null) { all.push(row); added++; continue; }
          if (!seen[kk]) { seen[kk] = 1; all.push(row); added++; }
        }
        if (batch.length < PAGE) break; // última página
        if (added === 0) break;         // la edge no avanzó → no repetir
        offset += PAGE;
      }
      return { data: all, ok: true };
    }
    window.usersDataAdmin = function(action, params) {
      params = params || {};
      var lim = params.limit;
      if (action === 'admin_list' && params.offset == null && (lim == null || lim >= 1000)) {
        return _adminListAllPages(action, params);
      }
      return window._usersData(action, Object.assign({ admin_email: _adminEmail() }, params));
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
          // 🔴 Mismo patrón: _usersData JAMÁS truena, devuelve { error }. Sin leerlo,
          // el nombre/teléfono/ciudad que el técnico acaba de corregir se perdía en
          // silencio y "se me regresó mi nombre" la siguiente vez que abría el app.
          var upRes = await window._usersData('upsert_self', { email: emailKey, data: updateFields });
          if (upRes && upRes.error) console.warn('[Registro] users.upsert_self NO guardó los datos de ' + emailKey + ': ' + (upRes.error.message || upRes.error), upRes.error);
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

    // 🔴 RAÍZ: supabase-js NUNCA truena. Un upsert rechazado (RLS, columna que no
    // existe, red) DEVUELVE { data:null, error:{...} } y la promesa se resuelve
    // NORMAL. Por eso el `try/catch` que envolvía este Promise.all era CÓDIGO
    // MUERTO: no se ejecutó jamás. Este es EL camino donde se persiste el avance
    // del estudiante (niveles completados, aciertos) — se daba por guardado y se
    // quedaba nada más en el teléfono. Ese es el clásico "mi progreso se borró"
    // al reinstalar el app o cambiar de teléfono.
    // 🪤 `user_progress` SOLO tiene (id, user_id, nivel, completed, score, total,
    // porcentaje, fecha_inicio, fecha_completado) — NO hay `created_at`. Mandar
    // una columna que no existe = 400 de PostgREST, y antes de este arreglo era
    // invisible. Aquí NO ponemos toast a propósito (esto corre en segundo plano y
    // no debe interrumpir al estudiante), pero sí deja rastro en consola y ahora
    // DEVUELVE LA VERDAD para que quien llame deje de fingir que se guardó.
    async function supabaseSaveProgress(progressData) {
      if (!supabaseClient || !isOnline || !supabaseUserId) return { ok: false, guardados: 0, fallidos: 0, motivo: 'sin-sesion' };
      var niveles = Object.entries(progressData || {});
      var resultados = await Promise.all(niveles.map(async function (par) {
        var nivel = par[0], data = par[1] || {};
        var porcentaje = data.total > 0 ? ((data.score / data.total) * 100).toFixed(2) : 0;
        try {
          var res = await supabaseClient.from('user_progress').upsert({
            user_id: supabaseUserId, nivel: nivel, completed: data.completed, score: data.score,
            total: data.total, porcentaje: porcentaje,
            fecha_completado: data.completed >= data.total ? new Date().toISOString() : null
          }, { onConflict: 'user_id,nivel' });
          if (res && res.error) {
            console.warn('[Progreso] user_progress NO guardó el nivel "' + nivel + '" (user ' + supabaseUserId + '): ' + (res.error.message || res.error), res.error);
            return false;
          }
          return true;
        } catch (e) {
          // Sólo cae aquí una falla real de red; el rechazo del servidor viene en res.error.
          console.warn('[Progreso] user_progress falló de red en el nivel "' + nivel + '":', (e && e.message) || e);
          return false;
        }
      }));
      var guardados = resultados.filter(Boolean).length;
      var fallidos = resultados.length - guardados;
      if (fallidos) console.warn('[Progreso] ' + fallidos + ' de ' + resultados.length + ' niveles NO llegaron al servidor (user ' + supabaseUserId + ')');
      return { ok: fallidos === 0, guardados: guardados, fallidos: fallidos };
    }

    // Guarda el cert vía edge function save-certificate (service role, salta RLS).
    // El RLS lockdown de marzo bloqueó las escrituras directas del cliente a
    // `certificates`, así que desde marzo los certs NO se respaldaban. Mario 2026-06-05.
    function _certEdgeEmail() {
      try { return (typeof currentUser !== 'undefined' && currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; }
    }
    function _certEdgeKey() { return (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || '')); }
    function _certEdgeUrl() { return (window.SUPABASE_URL || (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co')) + '/functions/v1/save-certificate'; }

    async function supabaseSaveCertificate(cert) {
      try {
        var email = _certEdgeEmail();
        if (!email || !cert) return;
        var key = _certEdgeKey();
        var res = await fetch(_certEdgeUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ action: 'save', email: email, certs: [cert] })
        });
        // 🔴 Antes solo había el `if (res.ok)`: SIN `else`. Un 401/403/500 de la
        // edge se descartaba entero. El diploma se veía en el teléfono y jamás
        // quedaba en el servidor — reinstalas el app y desapareció.
        if (res.ok) {
          console.log('[Cert] Saved to Supabase (edge):', cert.nivel || cert.level || cert.levelId);
        } else {
          var _cuerpo = '';
          try { _cuerpo = (await res.text()).slice(0, 200); } catch (e2) { console.warn('[Cert] no se pudo leer la respuesta de error:', e2.message || e2); }
          console.warn('[Cert] el servidor NO guardó el certificado:', res.status, _cuerpo, { nivel: cert.nivel || cert.level || cert.levelId });
        }
      } catch (e) { console.error('Supabase save certificate error:', e); }
    }

    // Sincroniza los certificados con el servidor: SUBE los del teléfono (respaldo)
    // y BAJA los del servidor, fusionando en localStorage (aditivo, nunca borra).
    // Así reaparecen y quedan respaldados. Idempotente. Mario 2026-06-05.
    window.maestroSyncCerts = async function () {
      try {
        var email = _certEdgeEmail();
        if (!email) return;
        var key = _certEdgeKey(), url = _certEdgeUrl();
        var local = [];
        try { local = JSON.parse(localStorage.getItem('tecnico_certificates') || '[]'); } catch (_) { local = []; }
        // 1) Subir los locales (respaldo).
        if (local.length) {
          // 🔴 Este `.catch(function () {})` estaba VACÍO y es el respaldo de los
          // DIPLOMAS. Si fallaba, los certificados del teléfono nunca subían al
          // servidor y nadie —ni el estudiante ni nosotros— se enteraba: el día
          // que reinstala el app o cambia de teléfono, sus diplomas ya no están.
          // Es el swallow más caro del repo. No hay toast a propósito: esto corre
          // en segundo plano al abrir el app y no debe interrumpir; pero SÍ deja
          // rastro para poder medirlo.
          await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': 'Bearer ' + key },
            body: JSON.stringify({ action: 'save', email: email, certs: local }) })
            .then(function (r0) {
              if (!r0.ok) console.warn('[Cert] el respaldo de certificados NO subió:', r0.status, { email: email, cuantos: local.length });
            })
            .catch(function (e0) { console.warn('[Cert] no se pudo subir el respaldo de certificados:', (e0 && e0.message) || e0, { email: email, cuantos: local.length }); });
        }
        // 2) Bajar los del servidor.
        var r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ action: 'list', email: email }) });
        var data = await r.json().catch(function () { return {}; });
        var server = (data && data.certificates) || [];
        if (!server.length) return;
        // 3) Fusionar (aditivo: agrega los del servidor que no estén local).
        var have = {};
        local.forEach(function (c) { have[c.nivel || c.level || c.levelId] = true; });
        var added = 0;
        server.forEach(function (c) {
          if (!have[c.nivel]) {
            local.push({ level: c.nivel, nivel: c.nivel, score: c.score, totalQuestions: c.total_questions, percentage: c.porcentaje, certificateNumber: c.certificate_number, certificateId: c.certificate_number, date: c.fecha_obtenido, dateRaw: c.fecha_obtenido });
            added++;
          }
        });
        if (added) {
          localStorage.setItem('tecnico_certificates', JSON.stringify(local));
          localStorage.setItem('tecnico_certificates_backup', JSON.stringify(local));
          if (typeof certificates !== 'undefined') certificates = local;
          if (typeof renderLevels === 'function') { try { renderLevels(); } catch (_) {} }
        }
      } catch (e) { console.warn('[Cert] sync error:', e && e.message); }
    };

    // 🪤 ¿El servidor rechazó porque la columna NO existe? PostgREST lo dice con
    // PGRST204 ("Could not find the 'x' column") o con el 42703 de Postgres.
    function _esColumnaDesconocida(err) {
      if (!err) return false;
      var code = String(err.code || '');
      if (code === 'PGRST204' || code === '42703') return true;
      var msg = String(err.message || '');
      return /could not find the .* column|column .* does not exist/i.test(msg);
    }

    // Un solo insert normalizado: si supabase-js truena de red lo convertimos en
    // { error } para que TODO el camino se lea igual (nunca con try/catch mudo).
    async function _insertQuizAttempt(insertData) {
      try {
        var res = await supabaseClient.from('quiz_attempts').insert(insertData);
        return res || {};
      } catch (e) {
        return { error: { message: (e && e.message) || String(e) } };
      }
    }

    // 🔴 RAÍZ DOBLE en esta función.
    // (1) supabase-js NUNCA truena: el insert devolvía { error } y el `try/catch`
    //     ni se enteraba. El examen se veía calificado en la pantalla del
    //     estudiante y JAMÁS llegaba al servidor: "hice el examen y no aparece".
    // 🪤 (2) Encima mandaba `server_verified`, columna que NO EXISTE en
    //     `quiz_attempts` (id, user_id, nivel, total_questions, correct_answers,
    //     wrong_answers, porcentaje, tiempo_segundos, aprobado, fecha, app), y
    //     `serverVerified` SIEMPRE llega como número desde certificates.js — o
    //     sea que TODOS los inserts se caían con 400. Medido 2026-09-10: la tabla
    //     no recibe una sola fila desde el 19-mar-2026 (44 filas en total),
    //     mientras `user_progress` sigue creciendo. Por eso el historial de
    //     exámenes y el conteo del leaderboard llevan medio año congelados.
    // Arreglo: si el rechazo es por columna desconocida, reintentamos SIN ella
    // (el examen sí se guarda) y lo gritamos en consola. El día que la columna
    // exista, el primer intento pasa y vuelve el rastro de auditoría.
    // Sin toast: es guardado en segundo plano, pero devuelve la verdad.
    async function supabaseSaveQuizAttempt(attemptData) {
      if (!supabaseClient || !isOnline || !supabaseUserId) return { ok: false, motivo: 'sin-sesion' };
      var insertData = {
        user_id: supabaseUserId, nivel: attemptData.nivel, total_questions: attemptData.totalQuestions,
        correct_answers: attemptData.correctAnswers, wrong_answers: attemptData.wrongAnswers,
        porcentaje: attemptData.porcentaje, tiempo_segundos: attemptData.tiempoSegundos || null,
        aprobado: attemptData.aprobado
      };
      var conAuditoria = (typeof attemptData.serverVerified === 'number');
      if (conAuditoria) insertData.server_verified = attemptData.serverVerified;

      var res = await _insertQuizAttempt(insertData);
      if (res.error && conAuditoria && _esColumnaDesconocida(res.error)) {
        console.warn('[Examen] quiz_attempts no tiene la columna server_verified — reintentando SIN el rastro de auditoría para no perder el examen:', res.error.message || res.error);
        delete insertData.server_verified;
        res = await _insertQuizAttempt(insertData);
      }
      if (res.error) {
        console.warn('[Examen] quiz_attempts NO guardó el intento (user ' + supabaseUserId + ', nivel ' + attemptData.nivel + '): ' + (res.error.message || res.error), res.error);
        return { ok: false, error: res.error };
      }
      return { ok: true };
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
        // 🔴 El resultado se tiraba a la basura: si la edge rechazaba, el técnico
        // subía de nivel en la pantalla y al recargar seguía en el nivel viejo.
        var res = await window._usersData('update_self_level', { email: email, nivel_actual: nivel });
        if (res && res.error) { console.warn('[Nivel] update_self_level NO guardó el nivel "' + nivel + '" de ' + email + ': ' + (res.error.message || res.error), res.error); return false; }
        return true;
      } catch (e) { console.error('Supabase update nivel error:', e); return false; }
    }

    async function supabaseLoadUserData() {
      if (!supabaseClient || !isOnline || !supabaseUserId) return null;
      try {
        const [progressRes, certsRes] = await Promise.all([
          supabaseClient.from('user_progress').select('*').eq('user_id', supabaseUserId),
          supabaseClient.from('certificates').select('*').eq('user_id', supabaseUserId)
        ]);
        // 🔴 Un select rechazado (RLS) también devuelve { data:null, error } sin
        // tronar: sin leer `.error` se veía idéntico a "este técnico no tiene nada"
        // y el app le mostraba el progreso VACÍO como si nunca hubiera estudiado.
        if (progressRes && progressRes.error) console.warn('[Progreso] no se pudo LEER user_progress (user ' + supabaseUserId + '): ' + (progressRes.error.message || progressRes.error), progressRes.error);
        if (certsRes && certsRes.error) console.warn('[Cert] no se pudo LEER certificates (user ' + supabaseUserId + '): ' + (certsRes.error.message || certsRes.error), certsRes.error);
        return { progress: progressRes.data, certificates: certsRes.data, error: (progressRes && progressRes.error) || (certsRes && certsRes.error) || null };
      } catch (e) { console.error('Supabase load error:', e); return null; }
    }

    // 🔴 Antes SIEMPRE imprimía "Synced to Supabase ✅" aunque nada se hubiera
    // guardado — mentirle a la consola es cómo pasaron meses sin que nadie viera
    // el problema. Ahora el ✅ sólo sale cuando el servidor de verdad confirmó.
    async function syncToSupabase() {
      if (!supabaseClient || !isOnline || !supabaseUserId) return { ok: false, motivo: 'sin-sesion' };
      try {
        var resProg = await supabaseSaveProgress(progress);
        await Promise.all(certificates.map(cert => supabaseSaveCertificate(cert)));
        if (resProg && resProg.ok === false) {
          console.warn('[MaestroAC] Sync INCOMPLETO: ' + resProg.fallidos + ' niveles de progreso no llegaron al servidor');
          return { ok: false, progreso: resProg };
        }
        console.log('[MaestroAC] Synced to Supabase ✅');
        return { ok: true, progreso: resProg };
      } catch (e) { console.error('Sync error:', e); return { ok: false, error: e }; }
    }
