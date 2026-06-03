
    // ============ ATTRIBUTION CAPTURE (Mario 2026-05-22 task #49) ============
    // Capture marketing source from URL params (?source=email_xxx, ?utm_*=...)
    // and persist for 24h so it survives between landing → signup. Used at
    // auth.signUp time so every new user is tagged with where they came from.
    (function _captureAttribution() {
      try {
        var params = new URLSearchParams(window.location.search || '');
        var KEYS = ['source','src','utm_source','utm_campaign','utm_medium','utm_content','utm_term','ref'];
        var attrs = {};
        KEYS.forEach(function (k) {
          var v = params.get(k);
          if (v) attrs[k] = v;
        });
        if (Object.keys(attrs).length === 0) return; // nothing to capture
        attrs.captured_at = new Date().toISOString();
        if (document.referrer) attrs.referrer = document.referrer;
        if (window.location.pathname) attrs.landing_path = window.location.pathname;
        localStorage.setItem('maestro_attribution', JSON.stringify({
          data: attrs,
          expires: Date.now() + 24 * 60 * 60 * 1000  // 24h TTL
        }));
        if (window.console && console.log) console.log('[Attribution] captured:', attrs.source || attrs.utm_source || attrs.src);
      } catch (_) { /* swallow — non-critical */ }
    })();

    // Read attribution blob (if still valid) for signUp metadata
    function getAttributionData() {
      try {
        var stored = localStorage.getItem('maestro_attribution');
        if (!stored) return null;
        var parsed = JSON.parse(stored);
        if (!parsed || !parsed.data) return null;
        if (parsed.expires && Date.now() > parsed.expires) {
          localStorage.removeItem('maestro_attribution');
          return null;
        }
        return parsed.data;
      } catch (_) { return null; }
    }
    if (typeof window !== 'undefined') window.getAttributionData = getAttributionData;

    // ============ LOGIN TOAST NOTIFICATIONS ============

    function _playToastSound() {
      try {
        // Only create AudioContext after user interaction to avoid browser warning
        if (!navigator.userActivation || !navigator.userActivation.hasBeenActive) return;
        var ac = new (window.AudioContext || window.webkitAudioContext)();
        var g = ac.createGain();
        g.connect(ac.destination);
        g.gain.setValueAtTime(0.15, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.6);
        var o1 = ac.createOscillator();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(880, ac.currentTime);
        o1.connect(g);
        o1.start(ac.currentTime);
        o1.stop(ac.currentTime + 0.15);
        var o2 = ac.createOscillator();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(1174.66, ac.currentTime + 0.15);
        o2.connect(g);
        o2.start(ac.currentTime + 0.15);
        o2.stop(ac.currentTime + 0.5);
        setTimeout(function() { ac.close(); }, 1000);
      } catch(e) { console.warn('[Auth]', e.message || e); }
    }

    function showLoginToasts() {
      // Skip student toasts if user is in admin/CRM mode
      if (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) return;

      var toasts = [];

      // 1. Quiz in progress?
      try {
        var saved = JSON.parse(localStorage.getItem('tecnico_lastQuizState') || 'null');
        if (saved && (saved.levelKey || saved.levelId) && saved.questionIndex < saved.totalQuestions) {
          toasts.push({
            icon: '▶️',
            title: _t('auth_continue_quiz', 'Continúa tu Quiz'),
            sub: _t('auth_quiz_question', 'Pregunta') + ' ' + (saved.questionIndex + 1) + '/' + saved.totalQuestions + ' — ' + _t('auth_get_cert', '¡Obtén tu certificado!'),
            bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            fn: function() { resumeLastQuiz(); }
          });
        }
      } catch(e) { console.warn('[Auth]', e.message || e); }

      // HVAC news toast removed — replaced by permanent dashboard bubble (dashHvacNewsBubble)

      // Show sequentially — 15s each, 1s gap between
      var TOAST_DURATION = 15000;
      toasts.forEach(function(t, i) {
        setTimeout(function() { _showOneToast(t, TOAST_DURATION); }, 1500 + i * (TOAST_DURATION + 1500));
      });
    }

    function _dismissToast(el) {
      el.style.top = 'calc(-80px + env(safe-area-inset-top,0px))';
      el.style.opacity = '0';
      setTimeout(function() { if (el.parentNode) el.remove(); }, 400);
    }

    function _showOneToast(t, duration) {
      _playToastSound();
      var el = document.createElement('div');
      el.style.cssText = 'position:fixed;top:calc(-80px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:10000;width:calc(100% - 32px);max-width:400px;background:' + t.bg + ';border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,0.35);transition:top 0.5s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s;opacity:0;';
      el.innerHTML = '<div style="width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + _escHtml(t.icon) + '</div>' +
        '<div style="flex:1;min-width:0;"><div style="color:#fff;font-weight:700;font-size:14px;">' + _escHtml(t.title) + '</div><div style="color:rgba(255,255,255,0.85);font-size:12px;">' + _escHtml(t.sub) + '</div></div>' +
        '<div class="toast-arrow" style="color:rgba(255,255,255,0.6);font-size:18px;padding:4px;">→</div>' +
        '<div class="toast-close" style="color:rgba(255,255,255,0.8);font-size:18px;font-weight:700;padding:4px 2px 4px 6px;margin-left:-4px;line-height:1;">✕</div>';
      // Click arrow or body → navigate
      el.onclick = function(e) {
        if (e.target.closest('.toast-close')) return; // handled below
        _dismissToast(el);
        t.fn();
      };
      // Click X → just close
      el.querySelector('.toast-close').onclick = function(e) {
        e.stopPropagation();
        _dismissToast(el);
      };
      document.body.appendChild(el);
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          el.style.top = 'calc(20px + env(safe-area-inset-top,0px))';
          el.style.opacity = '1';
        });
      });
      setTimeout(function() {
        if (el.parentNode) _dismissToast(el);
      }, duration);
    }

    // Levels configuration
    const levels = [
      { id: 'principiante', name: _t('auth_level_beginner', 'Principiante'), icon: '🔧', color: '#27ae60' },
      { id: 'intermedio', name: _t('auth_level_intermediate', 'Intermedio'), icon: '📊', color: '#3498db' },
      { id: 'avanzado', name: _t('auth_level_advanced', 'Avanzado'), icon: '⚡', color: '#f39c12' },
      { id: 'elite', name: _t('auth_level_elite', 'Elite'), icon: '🏆', color: '#9b59b6' },
      { id: 'platino', name: _t('auth_level_platinum', 'Platino'), icon: '💎', color: '#1abc9c' }
    ];

    // 50 NATE Core Questions
    // Questions loaded externally for performance (questions.js - 1.3MB loaded on demand)
    let questionsLoaded = false;
    
    async function loadQuestions() {
      if (questionsLoaded) return questions;
      try {
        // Check if questions.js exists (skip fetch on file:// since fetch doesn't work there)
        if (window.location.protocol !== 'file:') {
          const response = await fetch('questions.js', { method: 'HEAD' }).catch(function() { return null; });
          if (!response || !response.ok) {
            console.warn('[MaestroAC] ⚠️ questions.js not available (404) — quiz features disabled until file loads');
            return questions;
          }
        }
        const script = document.createElement('script');
        script.src = 'questions.js';
        await new Promise(function(resolve, reject) {
          script.onload = resolve;
          script.onerror = function() { reject(new Error('questions.js failed to load')); };
          document.head.appendChild(script);
        });
        questionsLoaded = true;
        console.log('[MaestroAC] ✅ Questions loaded: ' + Object.keys(questions).length + ' levels');
      } catch(e) {
        console.warn('[MaestroAC] ⚠️ Questions not loaded:', e.message || 'file not found');
      }
      return questions;
    }

    // Login credentials
    let pendingRegEmail = '';

    // Password visibility toggle
    function _togglePassVis(inputId, btn) {
      var inp = document.getElementById(inputId);
      if (!inp) return;
      if (inp.type === 'password') {
        inp.type = 'text';
        btn.textContent = '🙈';
        btn.title = _t('auth_hide_password', 'Ocultar contraseña');
      } else {
        inp.type = 'password';
        btn.textContent = '👁️';
        btn.title = _t('auth_show_password', 'Mostrar contraseña');
      }
    }
    window._togglePassVis = _togglePassVis;

    // Check if user is authenticated via Supabase
    function isAuthenticated() {
      return localStorage.getItem('tecnico_authenticated') === 'true' && localStorage.getItem('tecnico_email');
    }

    // Robust session recovery: check Supabase session even if localStorage was cleared
    async function recoverSession() {
      if (!supabaseClient) return false;
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user && session.user.email) {
          const email = session.user.email;
          // Blacklist check on session restore
          if (typeof isBlacklisted === 'function' && isBlacklisted(email)) {
            await supabaseClient.auth.signOut();
            localStorage.clear();
            console.warn('[MaestroAC] Blacklisted account blocked');
            return false;
          }
          console.log('[MaestroAC] Session recovered');
          localStorage.setItem('tecnico_authenticated', 'true');
          localStorage.setItem('tecnico_email', email);
          // Load profile from Supabase users table
          try {
            const { data: userRows } = await supabaseClient.from('users').select('*').eq('email', email).limit(1);
            const techData = userRows && userRows.length > 0 ? userRows[0] : null;
            if (techData && techData.nombre) {
              // Merge with existing localStorage data to preserve gate fields (estado, ciudad)
              var _existingUser = {};
              try { _existingUser = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
              currentUser = {
                nombre: techData.nombre,
                email: email,
                telefono: techData.telefono || _existingUser.telefono || '',
                ciudad: techData.ciudad || _existingUser.ciudad || '',
                estado: techData.estado || _existingUser.estado || '',
                experiencia: techData.experiencia || '',
                registrationDate: techData.fecha_registro
              };
              // Restore technician number from Supabase (was missing — caused tech number wipe on reinstall)
              if (techData.technician_number) {
                currentUser.technicianNumber = techData.technician_number;
                currentUser.technicianNumberDate = techData.technician_number_date || '';
                localStorage.setItem('tecnico_number', techData.technician_number);
                localStorage.setItem('tecnico_number_' + email, techData.technician_number);
                localStorage.setItem('tecnico_number_date_' + email, currentUser.technicianNumberDate);
              }
              // Restore student ID from Supabase
              if (techData.student_id) {
                currentUser.studentId = techData.student_id;
                currentUser.studentIdDate = techData.student_id_date || '';
              }
              // Restore photo from Supabase (was missing — caused photo wipe on reinstall)
              if (techData.photo_url) {
                localStorage.setItem('maestroac_photo_' + email, techData.photo_url);
                localStorage.setItem('maestroac_photo_default', techData.photo_url);
                if (typeof _applyProfilePhoto === 'function') _applyProfilePhoto(techData.photo_url);
              }
              const users = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
              users[email] = { ...currentUser, verified: true };
              localStorage.setItem('maestroac_users', JSON.stringify(users));
              localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
              localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
              localStorage.setItem('tecnico_nombre', currentUser.nombre);
              // Cache acceso_completo for freemium tier check
              localStorage.setItem('maestroac_acceso_completo_' + email, techData.acceso_completo === true ? 'true' : 'false');
              // Preload CRM student groups for tier check
              if (typeof preloadStudentCRMGroups === 'function') preloadStudentCRMGroups(email);
            }
          } catch(e) { console.log('[MaestroAC] Recover profile error:', e); }
          // CLOUD PROGRESS SYNC FIX (Mario 2026-05-09):
          // recoverSession antes NO llamaba supabaseRegisterUser → supabaseUserId quedaba en
          // null y todo el progreso solo vivía en localStorage. Ahora lo registramos al
          // restaurar sesión para que cualquier save siguiente (quiz, cert) sí suba a cloud.
          // No-blocking: si falla, la app sigue corriendo igual.
          try {
            if (typeof supabaseRegisterUser === 'function') {
              supabaseRegisterUser({ email: email, nombre: (currentUser && currentUser.nombre) || email.split('@')[0] }).then(function(uid) {
                if (uid && typeof supabaseLoadUserData === 'function') {
                  supabaseLoadUserData().then(function(cloudData) {
                    if (!cloudData) return;
                    if (cloudData.progress && typeof progress !== 'undefined') {
                      cloudData.progress.forEach(function(p) {
                        if (progress[p.nivel] && p.completed > (progress[p.nivel].completed || 0)) {
                          progress[p.nivel].completed = p.completed;
                          progress[p.nivel].score = p.score;
                          if (p.total) progress[p.nivel].total = p.total;
                        }
                      });
                      if (typeof saveProgress === 'function') saveProgress();
                    }
                    if (cloudData.certificates && cloudData.certificates.length > 0) {
                      var localCerts = [];
                      try { localCerts = JSON.parse(localStorage.getItem('tecnico_certificates') || '[]'); } catch(_) {}
                      var certMap = {};
                      localCerts.forEach(function(c) { certMap[c.nivel || c.level] = true; });
                      cloudData.certificates.forEach(function(c) {
                        if (!certMap[c.nivel]) {
                          localCerts.push({ level: c.nivel, nivel: c.nivel, score: c.score, totalQuestions: c.total_questions, percentage: c.porcentaje, certificateNumber: c.certificate_number, date: c.fecha_obtenido });
                        }
                      });
                      localStorage.setItem('tecnico_certificates', JSON.stringify(localCerts));
                      localStorage.setItem('tecnico_certificates_backup', JSON.stringify(localCerts));
                      if (typeof certificates !== 'undefined') certificates = localCerts;
                    }
                    if (typeof renderLevels === 'function') renderLevels();
                  });
                }
              });
            }
          } catch(e) { console.warn('[Auth] recoverSession register failed:', e.message || e); }
          // Device guard — register on session recovery
          try {
            if (typeof DeviceGuard !== 'undefined') DeviceGuard.onLogin(email);
            else if (window.MaestroLoader) MaestroLoader.load('js/device-guard.js').then(function() {
              if (typeof DeviceGuard !== 'undefined') DeviceGuard.onLogin(email);
            });
          } catch(e) { console.warn('[Auth] DeviceGuard:', e.message || e); }
          // Check if recovered user is admin staff — reveal admin links
          revealAdminLinksIfStaff(email);
          return true;
        }
      } catch(e) { console.log('[MaestroAC] Session recovery failed:', e); }
      return false;
    }

    // Helper: resend confirmation email from login error
    async function resendConfirmationForLogin(email) {
      var msgDiv = document.getElementById('loginConfirmMsg');
      if (typeof isBlacklisted === 'function' && isBlacklisted(email)) { if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _t('auth_account_suspended_short', 'Esta cuenta ha sido suspendida.') + '</span>'; return; }
      if (!supabaseClient) { if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _t('auth_connection_error', 'Error de conexión.') + '</span>'; return; }
      try {
        if(msgDiv) msgDiv.innerHTML = '<span style="color:#f39c12;">' + _t('auth_sending', 'Enviando...') + '</span>';
        var { error } = await supabaseClient.auth.resend({ type: 'signup', email: email });
        if (error) {
          if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _escHtml(error.message) + '</span>';
        } else {
          if(msgDiv) msgDiv.innerHTML = '<span style="color:#27ae60;">' + _t('auth_email_sent', '✅ ¡Correo enviado! Revisa tu bandeja y <strong>SPAM</strong>.') + '</span>';
        }
      } catch(e) { if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _t('auth_connection_error', 'Error de conexión.') + '</span>'; }
    }

    // Helper: send magic link directly from login error
    async function sendMagicLinkDirect(email) {
      var msgDiv = document.getElementById('loginConfirmMsg');
      if (typeof isBlacklisted === 'function' && isBlacklisted(email)) { if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _t('auth_account_suspended_short', 'Esta cuenta ha sido suspendida.') + '</span>'; return; }
      if (!supabaseClient) { if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _t('auth_connection_error', 'Error de conexión.') + '</span>'; return; }
      try {
        if(msgDiv) msgDiv.innerHTML = '<span style="color:#9b59b6;">' + _t('auth_sending_magic_link', 'Enviando link de acceso...') + '</span>';
        var { error } = await supabaseClient.auth.signInWithOtp({ email: email, options: { emailRedirectTo: 'https://maestrohvacr.com' } });
        if (error) {
          if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _escHtml(error.message) + '</span>';
        } else {
          if(msgDiv) msgDiv.innerHTML = '<span style="color:#27ae60;">' + _t('auth_magic_link_sent', '✅ ¡Link enviado! Revisa tu correo y SPAM.') + '</span>';
        }
      } catch(e) { if(msgDiv) msgDiv.innerHTML = '<span style="color:#e74c3c;">' + _t('auth_connection_error', 'Error de conexión.') + '</span>'; }
    }
    // Client-side login rate limiter — prevents rapid brute force
    var _loginAttempts = 0;
    var _loginLockoutUntil = 0;
    var _LOGIN_MAX_ATTEMPTS = 5;
    var _LOGIN_LOCKOUT_MS = 60000; // 1 minute lockout after 5 failures

    async function handleLogin(event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pass = document.getElementById('loginPassword').value;
      const errorDiv = document.getElementById('loginError');

      // Rate limiting check
      if (Date.now() < _loginLockoutUntil) {
        var _secsLeft = Math.ceil((_loginLockoutUntil - Date.now()) / 1000);
        errorDiv.textContent = _t('auth_too_many_attempts', 'Demasiados intentos. Espera') + ' ' + _secsLeft + ' ' + _t('auth_seconds', 'segundos') + '.';
        errorDiv.classList.add('show');
        return false;
      }

      // Blacklist check
      if (typeof isBlacklisted === 'function' && isBlacklisted(email)) {
        errorDiv.textContent = _t('auth_account_suspended', 'Esta cuenta ha sido suspendida. Contacta soporte.');
        errorDiv.classList.add('show');
        return false;
      }

      if (!supabaseClient) {
        // Try to init now if SDK is loaded but client wasn't created yet
        if (window.supabase && typeof initSupabase === 'function') {
          initSupabase();
        }
        if (!supabaseClient) {
          errorDiv.innerHTML = '⚠️ <strong>' + (typeof _t === 'function' ? _t('auth_no_connection', 'Sin conexión al servidor.') : 'Sin conexión al servidor.') + '</strong><br>' +
            '<span style="font-size:13px;">' + (typeof _t === 'function' ? _t('auth_check_internet', 'Verifica tu internet e intenta de nuevo.') : 'Verifica tu internet e intenta de nuevo.') + '</span><br><br>' +
            '<button onclick="location.reload()" style="padding:10px 20px;background:#3498db;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;">🔄 ' + (typeof _t === 'function' ? _t('auth_retry', 'Reintentar') : 'Reintentar') + '</button>';
          errorDiv.classList.add('show');
          return false;
        }
      }

      var _loginBtn = event && event.target ? event.target.querySelector('button[type="submit"]') : null;
      if (window.BtnLoading) window.BtnLoading.start(_loginBtn, _t('auth_logging_in', 'Entrando...'));
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: pass
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            pendingRegEmail = email;
            errorDiv.innerHTML = '📧 <strong>' + _t('auth_email_not_confirmed', 'Tu correo no está confirmado.') + '</strong><br>' +
              '<span style="font-size:13px;">' + _t('auth_check_inbox_spam', 'Revisa tu bandeja de entrada y carpeta de <strong>SPAM</strong>.') + '</span><br><br>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">' +
              '<button id="_resendConfBtn" style="padding:8px 14px;background:#3498db;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;">' + _t('auth_resend_confirmation', '📧 Reenviar Confirmación') + '</button>' +
              '<button id="_magicLinkConfBtn" style="padding:8px 14px;background:#9b59b6;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;">' + _t('auth_login_without_password', '✨ Entrar sin contraseña') + '</button>' +
              '</div>' +
              '<div id="loginConfirmMsg" style="margin-top:8px;font-size:12px;"></div>';
            // Bind click handlers safely (avoid inline onclick with user input)
            var _safeEmail = email;
            var _resendBtn = document.getElementById('_resendConfBtn');
            var _magicBtn = document.getElementById('_magicLinkConfBtn');
            if (_resendBtn) _resendBtn.addEventListener('click', function() { resendConfirmationForLogin(_safeEmail); });
            if (_magicBtn) _magicBtn.addEventListener('click', function() { sendMagicLinkDirect(_safeEmail); });
          } else if (error.message.includes('Invalid login')) {
            errorDiv.innerHTML = '❌ ' + (typeof _t === 'function' ? _t('auth_invalid_credentials', 'Correo o contraseña incorrectos.') : 'Correo o contraseña incorrectos.') + '<br>' +
              '<span style="font-size:13px;color:#94a3b8;">' + (typeof _t === 'function' ? _t('auth_verify_credentials', 'Verifica que tu correo y contraseña sean correctos.') : 'Verifica que tu correo y contraseña sean correctos.') + '</span>';
          } else if (error.message.includes('rate') || error.message.includes('limit')) {
            errorDiv.innerHTML = '⏳ ' + (typeof _t === 'function' ? _t('auth_too_many_attempts', 'Demasiados intentos. Espera unos minutos e intenta de nuevo.') : 'Demasiados intentos. Espera unos minutos e intenta de nuevo.');
          } else {
            errorDiv.innerHTML = '⚠️ ' + _escHtml(error.message);
          }
          errorDiv.classList.add('show');
          // Increment rate limiter on failed login
          _loginAttempts++;
          if (_loginAttempts >= _LOGIN_MAX_ATTEMPTS) {
            _loginLockoutUntil = Date.now() + _LOGIN_LOCKOUT_MS;
            _loginAttempts = 0;
          }
          return false;
        }

        // Login successful — reset rate limiter
        _loginAttempts = 0;
        _loginLockoutUntil = 0;
        localStorage.setItem('tecnico_authenticated', 'true');
        localStorage.setItem('tecnico_email', email);
        errorDiv.classList.remove('show');

        // Clear password field after successful login
        var _loginPassField = document.getElementById('loginPassword');
        if (_loginPassField) _loginPassField.value = '';

        // Load user profile from local storage or Supabase
        const users = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
        // Scrub any legacy password fields from localStorage cache
        if (users[email] && users[email].password) {
          delete users[email].password;
          localStorage.setItem('maestroac_users', JSON.stringify(users));
        }
        if (users[email]) {
          var _eu3 = {}; try { _eu3 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
          currentUser = {
            nombre: users[email].nombre,
            email: email,
            telefono: users[email].telefono || _eu3.telefono || '',
            ciudad: users[email].ciudad || _eu3.ciudad || '',
            estado: users[email].estado || _eu3.estado || '',
            experiencia: users[email].experiencia || '',
            registrationDate: users[email].registrationDate
          };
          // Async fetch acceso_completo for freemium tier
          supabaseClient.from('users').select('acceso_completo').eq('email', email).limit(1).then(function(res) {
            var rows = res.data || [];
            if (rows.length > 0) {
              localStorage.setItem('maestroac_acceso_completo_' + email, rows[0].acceso_completo === true ? 'true' : 'false');
            }
          }).catch(function() {});
        } else {
          // Try loading from Supabase users table
          try {
            const { data: userRows } = await supabaseClient.from('users').select('*').eq('email', email).limit(1);
            const techData = userRows && userRows.length > 0 ? userRows[0] : null;
            if (techData) {
              var _eu4 = {}; try { _eu4 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
              currentUser = {
                nombre: techData.nombre || email.split('@')[0],
                email: email,
                telefono: techData.telefono || _eu4.telefono || '',
                ciudad: techData.ciudad || _eu4.ciudad || '',
                estado: techData.estado || _eu4.estado || '',
                experiencia: techData.experiencia || '',
                registrationDate: techData.fecha_registro
              };
              // Restore technician number from Supabase
              if (techData.technician_number) {
                currentUser.technicianNumber = techData.technician_number;
                currentUser.technicianNumberDate = techData.technician_number_date || '';
                localStorage.setItem('tecnico_number', techData.technician_number);
                localStorage.setItem('tecnico_number_' + email, techData.technician_number);
                localStorage.setItem('tecnico_number_date_' + email, currentUser.technicianNumberDate);
              }
              // Restore student ID from Supabase
              if (techData.student_id) {
                currentUser.studentId = techData.student_id;
                currentUser.studentIdDate = techData.student_id_date || '';
              }
              // Restore photo from Supabase
              if (techData.photo_url) {
                localStorage.setItem('maestroac_photo_' + email, techData.photo_url);
                localStorage.setItem('maestroac_photo_default', techData.photo_url);
                if (typeof _applyProfilePhoto === 'function') _applyProfilePhoto(techData.photo_url);
              }
              // Cache locally (never store password fields)
              users[email] = { ...currentUser };
              localStorage.setItem('maestroac_users', JSON.stringify(users));
              // Cache acceso_completo for freemium tier check
              localStorage.setItem('maestroac_acceso_completo_' + email, techData.acceso_completo === true ? 'true' : 'false');
              // Preload CRM student groups for tier check
              if (typeof preloadStudentCRMGroups === 'function') preloadStudentCRMGroups(email);

              // ─── Auto-heal: if server is missing fields the device still has,
              // push them up so the next reinstall doesn't lose them. Catches
              // legacy users (like Mario) whose techNumber lived in localStorage
              // only because earlier saves silently failed.
              try {
                var heal = {};
                if (!techData.technician_number) {
                  var localTN = localStorage.getItem('tecnico_number_' + email) || localStorage.getItem('tecnico_number');
                  if (localTN) heal.technician_number = localTN;
                  var localTND = localStorage.getItem('tecnico_number_date_' + email) || localStorage.getItem('tecnico_number_date');
                  if (localTND) heal.technician_number_date = localTND;
                }
                if (!techData.student_id) {
                  var localSID = localStorage.getItem('maestroac_student_id_' + email) || localStorage.getItem('maestroac_student_id');
                  if (localSID) heal.student_id = localSID;
                }
                if (!techData.photo_url) {
                  var localPhoto = localStorage.getItem('maestroac_photo_' + email);
                  if (localPhoto && localPhoto.length < 200000) heal.photo_url = localPhoto;
                }
                if (Object.keys(heal).length && window.ProfileSync) {
                  window.ProfileSync.save(email, heal).then(function (r) {
                    if (r) console.log('[Auth] Auto-healed missing server fields:', Object.keys(heal));
                  });
                }
              } catch (e) { console.warn('[Auth] auto-heal error:', e.message || e); }
            }
          } catch(e) { console.warn('[Auth]', e.message || e); }
          if (!currentUser || !currentUser.nombre) {
            currentUser = { nombre: email.split('@')[0], email: email };
          }
        }

        loadUserProgress(email);

        // Check if user is admin staff — reveal admin links if so
        revealAdminLinksIfStaff(email);

        if (typeof auditLog === 'function') auditLog('login.student', {});
        logActivity('login', _t('auth_login_activity', 'Inicio de sesión'));
        addNotification('register', _t('auth_login_welcome', '🔓 Sesión iniciada — ¡Bienvenido') + ' ' + (currentUser.nombre ? currentUser.nombre.split(' ')[0] : 'Técnico') + '!', '🔓');

        // Sync tecnico_user + tecnico_nombre so social system + profile find it
        if (currentUser && currentUser.nombre) {
          localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
          localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
          localStorage.setItem('tecnico_nombre', currentUser.nombre);
        }

        // ── Show dashboard — with onboarding gate check ──
        var _authPostLogin = function() {
          if(!localStorage.getItem('maestroac_goto_screen')){showScreen('dashboardScreen');}else{var _gs=localStorage.getItem('maestroac_goto_screen');localStorage.removeItem('maestroac_goto_screen');sessionCheckedIn=true;var _dl=document.getElementById('deepLinkLoader');if(_dl)_dl.remove();showScreen(_gs);}
          showLoginToasts();
          if (typeof window.maybeShowWelcomeModal === 'function') {
            setTimeout(window.maybeShowWelcomeModal, 600);
          }
        };

        // ── WEB-ONLY GATE: Only paid/grandfathered users can use the web ──
        var _afterGates = function() {
          if (typeof checkOnboardingGate === 'function') {
            checkOnboardingGate(_authPostLogin);
          } else {
            _authPostLogin();
          }
        };
        if (typeof _checkWebAccessGate === 'function') {
          _checkWebAccessGate(email, _afterGates);
        } else {
          _afterGates();
        }

        // ── PUSH NOTIFICATION GATE — Force prompt on EVERY login ──
        // If push module already loaded, trigger immediately
        // If not yet loaded, set a callback so it fires as soon as the module loads
        (function _triggerPushGateOnLogin() {
          if (typeof window._showMandatoryPushGate === 'function') {
            // Validate actual subscription state first (clears stale flag)
            if (typeof window._validatePushSubscription === 'function') {
              window._validatePushSubscription().then(function() {
                setTimeout(function() { window._showMandatoryPushGate(); }, 500);
              });
            } else {
              setTimeout(function() { window._showMandatoryPushGate(); }, 500);
            }
          } else {
            // Module not loaded yet — register callback
            window._onPushModuleReady = function() {
              if (typeof window._validatePushSubscription === 'function') {
                window._validatePushSubscription().then(function() {
                  setTimeout(function() { window._showMandatoryPushGate(); }, 500);
                });
              } else {
                setTimeout(function() { window._showMandatoryPushGate(); }, 500);
              }
            };
          }
        })();

        // ── Background cloud sync (non-blocking) ──
        var _bgEmail = email;
        setTimeout(function() {
          (async function() {
            try {
              var uid = await supabaseRegisterUser(currentUser);
              if (uid) {
                var cloudData = await supabaseLoadUserData();
                if (cloudData) {
                  if (cloudData.progress) {
                    cloudData.progress.forEach(function(p) {
                      if (progress[p.nivel] && p.completed > (progress[p.nivel].completed || 0)) {
                        progress[p.nivel].completed = p.completed;
                        progress[p.nivel].score = p.score;
                        if (p.total) progress[p.nivel].total = p.total;
                      }
                    });
                    saveProgress();
                  }
                  if (cloudData.certificates && cloudData.certificates.length > 0) {
                    var localCerts = [];
                    try { localCerts = JSON.parse(localStorage.getItem('tecnico_certificates') || '[]'); } catch(e2) { console.warn('[Auth]', e2.message || e2); }
                    var certMap = {};
                    localCerts.forEach(function(c) { certMap[c.nivel || c.level] = true; });
                    cloudData.certificates.forEach(function(c) {
                      if (!certMap[c.nivel]) {
                        localCerts.push({ level: c.nivel, nivel: c.nivel, score: c.score, totalQuestions: c.total_questions, percentage: c.porcentaje, certificateNumber: c.certificate_number, date: c.fecha_obtenido });
                      }
                    });
                    localStorage.setItem('tecnico_certificates', JSON.stringify(localCerts));
                    localStorage.setItem('tecnico_certificates_backup', JSON.stringify(localCerts));
                    if (typeof certificates !== 'undefined') certificates = localCerts;
                  }
                  renderLevels();
                }
                // Restore profile photo, tech number, student ID from cloud
                try {
                  var { data: _bgUserRows } = await supabaseClient.from('users').select('photo_url, technician_number, technician_number_date, student_id, student_id_date').eq('email', _bgEmail).limit(1);
                  var _bgUserData = _bgUserRows && _bgUserRows.length > 0 ? _bgUserRows[0] : null;
                  if (_bgUserData) {
                    // Photo
                    if (_bgUserData.photo_url && !localStorage.getItem('maestroac_photo_' + _bgEmail)) {
                      localStorage.setItem('maestroac_photo_' + _bgEmail, _bgUserData.photo_url);
                      localStorage.setItem('maestroac_photo_default', _bgUserData.photo_url);
                      var pImg = document.getElementById('profilePhotoImg');
                      var pEmoji = document.getElementById('profileAvatarEmoji');
                      if (pImg) { pImg.src = _bgUserData.photo_url; pImg.style.display = 'block'; }
                      if (pEmoji) pEmoji.style.display = 'none';
                      var _dImg = document.getElementById('dashProfilePhoto');
                      var _dInit = document.getElementById('dashProfileInitial');
                      if (_dImg) { _dImg.src = _bgUserData.photo_url; _dImg.style.display = 'block'; }
                      if (_dInit) _dInit.style.display = 'none';
                    }
                    // Technician number
                    if (_bgUserData.technician_number && currentUser && !currentUser.technicianNumber) {
                      currentUser.technicianNumber = _bgUserData.technician_number;
                      currentUser.technicianNumberDate = _bgUserData.technician_number_date || '';
                      localStorage.setItem('tecnico_number', _bgUserData.technician_number);
                      localStorage.setItem('tecnico_number_' + _bgEmail, _bgUserData.technician_number);
                      localStorage.setItem('tecnico_number_date_' + _bgEmail, currentUser.technicianNumberDate);
                      localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
                      localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
                    }
                    // Student ID
                    if (_bgUserData.student_id && currentUser && !currentUser.studentId) {
                      currentUser.studentId = _bgUserData.student_id;
                      currentUser.studentIdDate = _bgUserData.student_id_date || '';
                      localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
                      localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
                    }
                  }
                } catch(e2) { console.log('[MaestroAC] Cloud user data restore skipped:', e2); }
              }
            } catch(e) { console.log('[MaestroAC] Cloud restore skipped:', e); }


            // Device guard — register device + country check
            try {
              if (typeof DeviceGuard !== 'undefined') DeviceGuard.onLogin(_bgEmail);
              else if (window.MaestroLoader) MaestroLoader.load('js/device-guard.js').then(function() {
                if (typeof DeviceGuard !== 'undefined') DeviceGuard.onLogin(_bgEmail);
              });
            } catch(e) { console.warn('[Auth] DeviceGuard:', e.message || e); }
          })();
        }, 50);
        // autoCheckIn removed — check-in obligatorio ya no se usa

        // Lazy-load admin scripts for admin users
        if (window.MaestroLoader && typeof isAdminStudent === 'function' && isAdminStudent(email)) {
          MaestroLoader.load([
            'js/admin/student-success.js',
            'js/admin/create-user.js',
            'js/admin/class-schedule.js',
            'js/admin/finanzas.js',
            'js/admin/inactivity-alerts.js',
            'js/admin/onboarding.js',
            'js/admin/progress-emails.js',
            'js/admin/ambassadors.js',
            'js/admin/analytics.js',
            'js/admin/pdf-reports.js',
            'js/admin/hash-passwords.js',
            'js/admin/admin-certs.js',
            'js/admin/curso-videos-admin.js',
            'js/admin/traducir-video.js',
            'js/admin/gatekeeper.js',
            'js/admin/device-viewer.js',
            'js/crm/student-roster.js',
            'js/admin/tutorial-videos.js',
            'js/admin/game-analytics.js',
            'js/admin/desafio-admin.js',
            'js/admin/live-stream-admin.js',
            'js/admin/live-stream-console.js',
            'js/admin/api-billing-dashboard.js',
            'js/admin/admin-inbox.js',
            'js/admin/admin-diagnostic.js',
            'js/admin/ai-command-center.js',
            'js/admin/admin-books-exams.js',
            'js/crm/email-system.js',
            'js/crm/zoom-recordings.js',
            'js/crm/zm-navigation.js',
            'js/crm/zoom-summaries.js',
            'js/crm/educational-material.js',
            'js/crm/acvolt-market.js',
            'js/crm/question-bank.js',
            'js/crm/ai-question-review.js',
            'js/crm/admin-ai-assistant.js',
            'js/crm/exams-management.js',
            'js/crm/live-performance.js',
            'js/crm/mobile-nav.js',
            'registered-students-data.js',
            'whatsapp-audit-data.js',
            'invoice2go-audit-data.js',
            'failed-payments-data.js',
            'fixes-workbooks-exams-calendar.js'
          ]);
          MaestroLoader.loadCSS('pipeline.css');
          MaestroLoader.load(['pipeline.js']);
        }

        // Deferred scripts for all users (after 3s)
        setTimeout(function() {
          if (window.MaestroLoader) {
            MaestroLoader.load(['js/push-notifications.js', 'js/admin/ambassadors.js']).then(function() {
              if (typeof loadCalendarData === 'function') try { loadCalendarData(); } catch(e) { console.warn('[Auth]', e.message || e); }
            });
          }
        }, 3000);
      } catch(e) {
        console.error('[MaestroAC] Login exception:', e);
        errorDiv.innerHTML = '⚠️ <strong>' + _t('auth_connection_error', 'Error de conexión.') + '</strong><br>' +
          '<span style="font-size:13px;">' + _t('auth_verify_internet', 'Verifica tu internet. Si el problema continúa, intenta con el link de acceso abajo.') + '</span>';
        errorDiv.classList.add('show');
      } finally {
        if (window.BtnLoading) window.BtnLoading.stop(_loginBtn);
      }
      return false;
    }

    // Handle registration with Supabase Auth
    async function handleRegister(event) {
      event.preventDefault();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const pass = document.getElementById('regPassword').value;
      const passConfirm = document.getElementById('regPasswordConfirm').value;
      const errorDiv = document.getElementById('registerError');

      if (pass !== passConfirm) {
        errorDiv.textContent = _t('auth_passwords_mismatch', 'Las contraseñas no coinciden');
        errorDiv.classList.add('show');
        return false;
      }
      var _regStrengthErr = (typeof _validatePasswordStrength === 'function') ? _validatePasswordStrength(pass) : (pass.length < 8 ? 'Min 8 chars' : null);
      if (_regStrengthErr) {
        errorDiv.textContent = _regStrengthErr;
        errorDiv.classList.add('show');
        return false;
      }

      // Blacklist check
      if (typeof isBlacklisted === 'function' && isBlacklisted(email)) {
        errorDiv.textContent = _t('auth_email_blacklisted', 'Este correo no puede ser registrado. Contacta soporte.');
        errorDiv.classList.add('show');
        return false;
      }

      if (!supabaseClient) {
        errorDiv.innerHTML = '⚠️ <strong>' + _t('auth_no_server', 'Sin conexión al servidor.') + '</strong><br><span style="font-size:13px;">' + _t('auth_verify_reload', 'Verifica tu internet y recarga la página.') + '</span><br><br>' +
          '<button onclick="location.reload()" style="padding:10px 20px;background:#3498db;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;">' + _t('auth_reload_page', '🔄 Recargar Página') + '</button>';
        errorDiv.classList.add('show');
        return false;
      }

      var _regBtn = event && event.target ? event.target.querySelector('button[type="submit"]') : null;
      if (window.BtnLoading) window.BtnLoading.start(_regBtn, _t('auth_creating_account', 'Creando cuenta...'));
      try {
        // Register with Supabase Auth (email confirmation disabled).
        // Attribution (Mario 2026-05-22): if user landed via ?source=email_xxx
        // or any UTM in the last 24h, attach it as raw_user_meta_data so we
        // can later answer "where did this signup come from?" in the DB.
        const _attrib = (typeof getAttributionData === 'function') ? getAttributionData() : null;
        const _signUpOpts = { email: email, password: pass };
        if (_attrib) _signUpOpts.options = { data: _attrib };
        const { data, error } = await supabaseClient.auth.signUp(_signUpOpts);

        if (error) {
          if (error.message.includes('already registered') || error.message.includes('User already registered')) {
            errorDiv.textContent = _t('auth_email_registered', 'Este correo ya está registrado. Inicia sesión.');
          } else {
            errorDiv.textContent = error.message;
          }
          errorDiv.classList.add('show');
          return false;
        }

        // Check if email already exists (Supabase returns user with empty identities)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            errorDiv.innerHTML = _t('auth_email_has_account', 'Este correo ya tiene cuenta.') + ' <a href="#" onclick="showScreen(\x27loginScreen\x27); return false;" style="color:#f39c12;text-decoration:underline;">' + _t('auth_login_btn', 'Iniciar Sesión') + '</a>';
            errorDiv.classList.add('show');
            return false;
        }

        // Auto-login: set localStorage flags
        var tempName = email.split('@')[0];
        currentUser = {
          nombre: tempName,
          email: email,
          telefono: '',
          ciudad: '',
          estado: '',
          experiencia: '',
          epa: '',
          osha: '',
          hvace: '',
          registrationDate: new Date().toISOString()
        };
        localStorage.setItem('tecnico_authenticated', 'true');
        localStorage.setItem('tecnico_email', email);
        localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
        localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
        localStorage.setItem('maestroac_new_user', 'true');

        // Track new account creation — Meta CompleteRegistration + TikTok + CAPI
        try { if (typeof trackConversion === 'function') trackConversion('signup_complete', { email: email, content_name: 'maestrohvacr_signup' }); } catch(_) {}

        // Save minimal data to users table
        try {
          await supabaseClient.from('users').upsert({
            email: email,
            nombre: tempName,
            fecha_registro: new Date().toISOString()
          }, { onConflict: 'email' });

          // Save referral if exists
          var savedRefCode = localStorage.getItem('maestroac_referral_code');
          if (savedRefCode) {
            try {
              await supabaseClient.from('referrals').insert({
                referral_code: savedRefCode,
                referred_email: email,
                referred_name: tempName,
                referred_date: new Date().toISOString(),
                status: 'registered'
              });
              localStorage.removeItem('maestroac_referral_code');
              localStorage.removeItem('maestroac_referral_date');
              console.log('[MaestroAC] Referral saved for new user');
            } catch(refErr) { console.log('[Referral] Save error:', refErr); }
          }
        } catch(e) { console.log('[MaestroAC] Save technician error:', e); }

        // Clear password fields after successful registration
        var _regPassField = document.getElementById('regPassword');
        var _regConfField = document.getElementById('regPasswordConfirm');
        if (_regPassField) _regPassField.value = '';
        if (_regConfField) _regConfField.value = '';

        // Redirect to profile in edit mode
        errorDiv.classList.remove('show');
        showProfile('dashboardScreen');
        setTimeout(function() {
          toggleEditProfile();
        }, 400);
      } catch(e) {
        console.error('[MaestroAC] Register exception:', e);
        errorDiv.innerHTML = '⚠️ <strong>' + _t('auth_connection_error', 'Error de conexión.') + '</strong><br><span style="font-size:13px;">' + _t('auth_verify_try_again', 'Verifica tu internet e intenta de nuevo.') + '</span>';
        errorDiv.classList.add('show');
      } finally {
        if (window.BtnLoading) window.BtnLoading.stop(_regBtn);
      }
      return false;
    }

    // Resend confirmation email
    async function resendConfirmation() {
      if (!supabaseClient || !pendingRegEmail) {
        window.showToast(_t('auth_no_pending_email', 'No hay correo pendiente de confirmación.'));
        return;
      }
      try {
        const { error } = await supabaseClient.auth.resend({
          type: 'signup',
          email: pendingRegEmail
        });
        if (error) {
          window.MaestroDialog.alert({title: 'Error', message: 'Error: ' + error.message + '\n\n' + _t('auth_wait_60_seconds', 'Espera 60 segundos antes de intentar de nuevo.'), kind: 'error'});
        } else {
          window.showToast('✅ ' + _t('auth_email_resent_to', 'Correo reenviado a') + ' ' + pendingRegEmail + ' — ' + _t('auth_check_inbox_and_spam', 'Revisa tu bandeja de entrada y carpeta de spam.'), 'success');
        }
      } catch(e) {
        window.MaestroDialog.alert({title: 'Error', message: _t('auth_connection_error_retry', 'Error de conexión. Intenta de nuevo.'), kind: 'error'});
      }
    }

    // Cerrar sesion del usuario
    // === FREE USER PROGRESS TRACKER — DISABLED (clon $59.99 = unlimited) ===
    function updateFreeUserProgress() {
      const progressDiv = document.getElementById('freeUserProgress');
      if (progressDiv) progressDiv.style.display = 'none';
    }

    // === CLASS REMINDER NOTIFICATIONS (Dynamic from Calendar) ===
    function checkClassReminders() {
      if (!liveClasses || liveClasses.length === 0) return;
      
      const now = new Date();
      const today = now.toDateString();
      const remindersKey = 'maestroac_reminders_' + today;
      const sent = JSON.parse(localStorage.getItem(remindersKey) || '{}');
      
      liveClasses.forEach(function(c) {
        if (c.estado === 'completada') return;
        
        const classDate = new Date(c.fecha);
        if (classDate.toDateString() !== today) return;
        
        const classId = c.id || c.titulo;
        if (sent[classId]) return;
        
        // Parse class start time
        const startParts = (c.hora_inicio || '18:00').split(':');
        const classHour = parseInt(startParts[0]);
        const currentHour = now.getHours();
        
        // Send reminder 1 hour before class
        if (currentHour >= (classHour - 1) && currentHour <= classHour) {
          const timeStr = c.hora_inicio + ' - ' + (c.hora_fin || '');
          addNotification('class', '📢 HOY — ' + c.titulo + ' (' + timeStr + ') con ' + (c.instructor || 'Maestro Mario'), '🔴');
          sent[classId] = true;
          localStorage.setItem(remindersKey, JSON.stringify(sent));
        }
      });
    }
    
    // Check reminders every 10 minutes
    setInterval(checkClassReminders, 10 * 60 * 1000);
    // Also check after calendar loads and on page load
    setTimeout(checkClassReminders, 5000);

    // Safety net: auto-dismiss loading overlays after 10 seconds
    setTimeout(function() {
      var dl = document.getElementById('deepLinkLoader');
      if (dl) dl.remove();
      var lo = document.getElementById('launcherOverlay');
      if (lo && lo.style.display !== 'none') {
        lo.style.transition = 'opacity 0.5s cubic-bezier(0.32,0.72,0,1)';
        lo.style.opacity = '0';
        setTimeout(function() { lo.style.display = 'none'; }, 500);
      }
    }, 10000);
    
    // ============================================
    // ACVOLT MARKET — Student-facing product grid
    // ============================================
    var _marketProductsLoaded = false;
    async function loadMarketProducts() {
      var grid = document.getElementById('marketProductsGrid');
      if (!grid || !supabaseClient) return;
      if (_marketProductsLoaded) return;
      try {
        var res = await supabaseClient.from('market_products').select('*').eq('estado', 'activo').order('created_at', { ascending: false });
        var products = res.data || [];
        if (products.length === 0) {
          grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:24px;font-size:12px;">' + _t('auth_products_coming_soon', 'Pronto tendremos productos disponibles') + '</div>';
          return;
        }
        var catColors = { herramientas: '#3b82f6', equipos: '#8b5cf6', ropa: '#ec4899', accesorios: '#f59e0b', general: '#64748b' };
        var catLabels = { herramientas: _t('auth_cat_tools', 'Herramientas'), equipos: _t('auth_cat_equipment', 'Equipos'), ropa: _t('auth_cat_clothing', 'Ropa'), accesorios: _t('auth_cat_accessories', 'Accesorios'), general: _t('auth_cat_general', 'General') };
        var html = '';
        products.forEach(function(p) {
          var color = catColors[p.categoria] || '#64748b';
          var label = catLabels[p.categoria] || p.categoria;
          var safeImgUrl = p.imagen_url ? _escHtml(p.imagen_url) : '';
          var imgHtml = safeImgUrl
            ? '<img src="' + safeImgUrl + '" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:10px 10px 0 0;" onerror="this.style.display=\'none\'">'
            : '<div style="width:100%;height:120px;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;"><svg width="32" height="32" viewBox="0 0 24 24" fill="#94a3b8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke="#94a3b8" stroke-width="1.5"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="#94a3b8" stroke-width="1.5"/></svg></div>';
          html += '<div onclick="showMarketProductDetail(\'' + _escHtml(p.id) + '\')" style="background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.08);cursor:pointer;overflow:hidden;transition:transform 0.2s cubic-bezier(0.32,0.72,0,1),box-shadow 0.2s cubic-bezier(0.32,0.72,0,1);" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
            imgHtml +
            '<div style="padding:10px;">' +
              '<div style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;color:#fff;background:' + color + ';margin-bottom:4px;">' + _escHtml(label) + '</div>' +
              '<div style="font-weight:700;color:#f0f4fa;font-size:13px;line-height:1.3;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + _escHtml(p.nombre || '') + '</div>' +
              '<div style="font-weight:800;color:#fbbf24;font-size:15px;">$' + Number(p.precio).toFixed(2) + '</div>' +
            '</div>' +
          '</div>';
        });
        grid.innerHTML = html;
        _marketProductsLoaded = true;
      } catch(e) {
        console.log('[MaestroAC] Error loading market products:', e);
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:20px;font-size:12px;">' + _t('auth_error_loading_products', 'Error cargando productos') + '</div>';
      }
    }

    function showMarketProductDetail(productId) {
      if (!supabaseClient) return;
      supabaseClient.from('market_products').select('*').eq('id', productId).single().then(function(res) {
        var p = res.data;
        if (!p) return;
        var catColors = { herramientas: '#3b82f6', equipos: '#8b5cf6', ropa: '#ec4899', accesorios: '#f59e0b', general: '#64748b' };
        var catLabels = { herramientas: _t('auth_cat_tools', 'Herramientas'), equipos: _t('auth_cat_equipment', 'Equipos'), ropa: _t('auth_cat_clothing', 'Ropa'), accesorios: _t('auth_cat_accessories', 'Accesorios'), general: _t('auth_cat_general', 'General') };
        var color = catColors[p.categoria] || '#64748b';
        var label = catLabels[p.categoria] || p.categoria;
        var safeImgUrl = p.imagen_url ? _escHtml(p.imagen_url) : '';
        var imgHtml = safeImgUrl
          ? '<img src="' + safeImgUrl + '" alt="" style="width:100%;max-height:250px;object-fit:cover;border-radius:12px;margin-bottom:14px;" onerror="this.style.display=\'none\'">'
          : '';
        var contactBtn = p.enlace_externo
          ? '<a href="' + _escHtml(p.enlace_externo) + '" target="_blank" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;font-weight:700;font-size:14px;text-decoration:none;cursor:pointer;">' + _t('auth_buy', 'Comprar') + '</a>'
          : '<a href="https://wa.me/17866905000?text=Hola%2C%20me%20interesa%20el%20producto%3A%20' + encodeURIComponent(p.nombre) + '" target="_blank" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;font-weight:700;font-size:14px;text-decoration:none;cursor:pointer;"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>WhatsApp</a>';
        var modal = document.createElement('div');
        modal.id = 'marketProductModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
        modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
        modal.innerHTML = '<div style="background:#0b1425;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;max-width:400px;width:100%;max-height:90vh;overflow-y:auto;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
            '<span style="display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;color:#fff;background:' + _escHtml(color) + ';">' + _escHtml(label) + '</span>' +
            '<button onclick="document.getElementById(\'marketProductModal\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:rgba(180,200,230,0.5);">✕</button>' +
          '</div>' +
          imgHtml +
          '<h3 style="margin:0 0 6px;color:#f0f4fa;font-size:18px;">' + _escHtml(p.nombre || '') + '</h3>' +
          '<div style="font-weight:800;color:#fbbf24;font-size:22px;margin-bottom:10px;">$' + Number(p.precio).toFixed(2) + '</div>' +
          (p.descripcion ? '<p style="color:rgba(180,200,230,0.6);font-size:13px;line-height:1.5;margin:0 0 16px;">' + _escHtml(p.descripcion) + '</p>' : '') +
          '<div style="display:flex;gap:8px;">' +
            contactBtn +
            '<button onclick="document.getElementById(\'marketProductModal\').remove()" style="flex:0.6;padding:12px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:rgba(255,255,255,0.04);color:rgba(200,215,240,0.7);cursor:pointer;font-size:14px;">' + _t('close', 'Cerrar') + '</button>' +
          '</div>' +
        '</div>';
        document.body.appendChild(modal);
      }).catch(function(e) { console.log('Error loading product:', e); });
    }

    async function cerrarSesion() {
        // Device guard — deactivate on logout
        try {
            var logoutEmail = (currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || '';
            if (typeof DeviceGuard !== 'undefined' && logoutEmail) DeviceGuard.onLogout(logoutEmail);
        } catch(e) { console.warn('[Auth] DeviceGuard:', e.message || e); }
        // Deactivate push subscriptions on logout so notifications stop for this device
        try {
            var _pushEmail = (currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || '';
            if (_pushEmail && supabaseClient) {
                await supabaseClient.from('push_subscriptions').update({ active: false }).eq('user_email', _pushEmail);
            }
            localStorage.removeItem('maestroac_push_subscribed');
        } catch(e) { console.warn('[Auth] Push cleanup on logout:', e); }
        try {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
        } catch(e) {
            console.log('[MaestroAC] SignOut error:', e);
        }
        // Capture email before clearing for keyed storage removal
        var _logoutCleanupEmail = localStorage.getItem('tecnico_email') || '';
        localStorage.removeItem('tecnico_authenticated');
        localStorage.removeItem('tecnico_email');
        localStorage.removeItem('tecnico_user');
        localStorage.removeItem('tecnico_user_backup');
        localStorage.removeItem('tecnico_nombre');
        localStorage.removeItem('tecnico_certificates');
        localStorage.removeItem('tecnico_certificates_backup');
        localStorage.removeItem('tecnico_lastQuizState');
        localStorage.removeItem('maestroac_new_user');
        localStorage.removeItem('maestroac_admin_cache');
        localStorage.removeItem('maestroac_users');
        localStorage.removeItem('maestroac_photo_default');
        localStorage.removeItem('maestroac_terms_accepted');
        localStorage.removeItem('maestroac_terms_date');
        // Remove per-email keyed items
        if (_logoutCleanupEmail) {
          localStorage.removeItem('maestroac_acceso_completo_' + _logoutCleanupEmail);
          localStorage.removeItem('maestroac_photo_' + _logoutCleanupEmail);
          localStorage.removeItem('maestroac_progress_' + _logoutCleanupEmail);
          localStorage.removeItem('maestroac_quiz_history_' + _logoutCleanupEmail);
        }
        // Clear all session storage (admin tokens, session data)
        sessionStorage.clear();
        // Hide admin links on logout
        var _adminLinks = document.querySelectorAll('.admin-only-link');
        for (var _ali = 0; _ali < _adminLinks.length; _ali++) { _adminLinks[_ali].style.display = 'none'; }
        currentUser = null;
        supabaseUserId = null;
        membershipAuthenticated = false;
        currentMembership = null;
        sessionCheckedIn = false;
        // Clear password fields to prevent data leakage
        var _loginPassEl = document.getElementById('loginPassword');
        if (_loginPassEl) _loginPassEl.value = '';
        var _loginEmailEl = document.getElementById('loginEmail');
        if (_loginEmailEl) _loginEmailEl.value = '';
        showScreen('loginScreen');
    }
    window.cerrarSesion = cerrarSesion;

    // ── Admin Link Visibility — only show admin login to authorized users ──
    // Checks both admin_staff AND admin_students tables
    function revealAdminLinksIfStaff(email) {
      if (!email || typeof supabaseClient === 'undefined' || !supabaseClient) return;
      var _email = email.toLowerCase().trim();
      var _found = false;

      function _showLinks() {
        var links = document.querySelectorAll('.admin-only-link');
        for (var i = 0; i < links.length; i++) {
          links[i].style.display = '';
        }
        console.log('[MaestroAC] Admin links revealed for:', _email);
      }

      // Check admin_staff first
      supabaseClient.from('admin_staff')
        .select('email')
        .eq('email', _email)
        .eq('activo', true)
        .limit(1)
        .then(function(res) {
          if (res.data && res.data.length > 0) {
            _found = true;
            _showLinks();
          }
        }).catch(function() {});

      // Also check admin_students (superadmin/admin roles)
      supabaseClient.from('admin_students')
        .select('email')
        .eq('email', _email)
        .limit(1)
        .then(function(res) {
          if (!_found && res.data && res.data.length > 0) {
            _showLinks();
          }
        }).catch(function() {});
    }
    window.revealAdminLinksIfStaff = revealAdminLinksIfStaff;

    // Manage Subscription (Apple Guideline 3.1.2(c) — must be findable in-app).
    // Routes to OS-native subscription manager based on platform.
    function openManageSubscription() {
      try {
        if (window.isIOSAppStore) {
          // iOS App Store subscription management
          window.location.href = 'itms-apps://apps.apple.com/account/subscriptions';
          return;
        }
        if (window.isAndroidPlayStore || window.isAndroidApp) {
          // Google Play Store subscription management
          window.location.href = 'https://play.google.com/store/account/subscriptions?package=com.maestrohvacr.app';
          return;
        }
        // Web (Stripe billing) — open Stripe customer portal via support
        // until we wire a self-serve portal endpoint.
        var _mailSubj = (typeof _t === 'function')
          ? _t('manage_sub_email_subject', 'Cancelar suscripción Maestro HVACR')
          : 'Cancelar suscripción Maestro HVACR';
        var _mailBody = (typeof _t === 'function')
          ? _t('manage_sub_email_body_prefix', 'Hola, deseo cancelar mi suscripción. Mi correo de cuenta es: ')
          : 'Hola, deseo cancelar mi suscripción. Mi correo de cuenta es: ';
        var _mailTail = (typeof _t === 'function')
          ? _t('manage_sub_email_body_suffix', '\n\nGracias.')
          : '\n\nGracias.';
        window.open('mailto:soporte@maestrohvacr.com?subject=' +
          encodeURIComponent(_mailSubj) +
          '&body=' + encodeURIComponent(_mailBody +
            ((typeof currentUser !== 'undefined' && currentUser && currentUser.email) ||
              localStorage.getItem('tecnico_email') || '') + _mailTail),
          '_blank');
      } catch (e) { console.warn('[ManageSub] failed:', e); }
    }
    window.openManageSubscription = openManageSubscription;

    // Delete Account (Apple App Store requirement — account deletion)
    async function confirmarEliminarCuenta() {
      // Apple 3.1.2: if user has an active sub, "Manage Subscription"
      // must be presented as a separate action — deleting the account
      // does NOT cancel the App Store / Play Billing subscription.
      // Surface this once before the destructive flow so the user
      // doesn't get charged after "deleting" their account.
      var hasActiveSub = !!(window.__premiumActive || localStorage.getItem('iap_active') === '1');
      if (hasActiveSub && (window.isIOSAppStore || window.isAndroidPlayStore || window.isAndroidApp)) {
        var subWarn = typeof _t === 'function'
          ? _t('delete_with_sub_warn', 'Tienes una suscripción activa. Eliminar tu cuenta NO la cancela — debes cancelarla en la tienda. ¿Quieres ir a "Administrar Suscripción" primero?')
          : 'Tienes una suscripción activa. Eliminar tu cuenta NO la cancela — debes cancelarla en la tienda. ¿Quieres ir a "Administrar Suscripción" primero?';
        var goManage = window.MaestroDialog && window.MaestroDialog.confirm
          ? await window.MaestroDialog.confirm({
              title: typeof _t === 'function' ? _t('active_sub_title', 'Suscripción activa') : 'Suscripción activa',
              message: subWarn,
              okText: typeof _t === 'function' ? _t('manage_sub_btn', 'Ir a cancelar') : 'Ir a cancelar',
              cancelText: typeof _t === 'function' ? _t('continue_delete', 'Continuar con borrado') : 'Continuar con borrado',
              kind: 'warning'
            })
          : confirm(subWarn);
        if (goManage) { openManageSubscription(); return; }
      }
      var msg = typeof _t === 'function'
        ? _t('delete_account_confirm', '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente y se borrarán todos tus datos.')
        : '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente y se borrarán todos tus datos.';
      var ok1 = window.MaestroDialog && window.MaestroDialog.confirm
        ? await window.MaestroDialog.confirm({
            title: typeof _t === 'function' ? _t('delete_account_title', 'Eliminar cuenta') : 'Eliminar cuenta',
            message: msg,
            okText: typeof _t === 'function' ? _t('delete_account_ok', 'Continuar') : 'Continuar',
            cancelText: typeof _t === 'function' ? _t('cancel', 'Cancelar') : 'Cancelar',
            destructive: true,
            kind: 'warning'
          })
        : confirm(msg);
      if (!ok1) return;
      var secondMsg = typeof _t === 'function'
        ? _t('delete_account_confirm2', 'ÚLTIMA CONFIRMACIÓN: ¿Realmente deseas eliminar tu cuenta y todos tus datos de Maestro HVACR?')
        : 'ÚLTIMA CONFIRMACIÓN: ¿Realmente deseas eliminar tu cuenta y todos tus datos de Maestro HVACR?';
      var ok2 = window.MaestroDialog && window.MaestroDialog.confirm
        ? await window.MaestroDialog.confirm({
            title: typeof _t === 'function' ? _t('delete_account_final_title', 'Última confirmación') : 'Última confirmación',
            message: secondMsg,
            okText: typeof _t === 'function' ? _t('delete_account_final_ok', 'Eliminar definitivamente') : 'Eliminar definitivamente',
            cancelText: typeof _t === 'function' ? _t('cancel', 'Cancelar') : 'Cancelar',
            destructive: true,
            kind: 'error'
          })
        : confirm(secondMsg);
      if (!ok2) return;

      var email = (currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || '';
      // BUG FIX 2026-05-01: previously did `supabaseClient.from('users').delete()`
      // direct from anon — broken after Phase 3 RLS lock-down of public.users,
      // and never cancelled RC subscriptions (Apple 5.1.1(v) violation).
      // Now route through `delete-account` edge function which: (1) verifies
      // user JWT, (2) DELETEs RC subscriber, (3) marks memberships inactive
      // with audit reason, (4) soft-deletes users row + nulls PII, (5)
      // invalidates refresh tokens, (6) writes account_deletion_log.
      try {
        if (supabaseClient && email) {
          var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
          var sbKey = window.SUPABASE_KEY || '';
          var sess = await supabaseClient.auth.getSession();
          var token = (sess && sess.data && sess.data.session && sess.data.session.access_token) || sbKey;
          var resp = await fetch(sbUrl + '/functions/v1/delete-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({}),
          });
          var jr = await resp.json().catch(function(){ return {}; });
          if (!resp.ok) {
            console.warn('[MaestroAC] delete-account failed:', jr.error || resp.status);
          } else {
            console.log('[MaestroAC] Account deleted server-side for:', email, jr.partial_errors || '(no errors)');
          }
        }
      } catch(e) {
        console.warn('[MaestroAC] Error calling delete-account:', e);
      }
      try {
        if (supabaseClient) {
          await supabaseClient.auth.signOut();
        }
      } catch(e) {
        console.warn('[MaestroAC] SignOut during delete:', e);
      }
      // Clear all local data
      localStorage.removeItem('tecnico_authenticated');
      localStorage.removeItem('tecnico_email');
      localStorage.removeItem('tecnico_user');
      localStorage.removeItem('tecnico_user_backup');
      localStorage.removeItem('maestroac_new_user');
      localStorage.removeItem('maestroac_admin_cache');
      if (email) {
        localStorage.removeItem('maestroac_progress_' + email);
      }
      // Remove user from maestroac_users map
      try {
        var usersMap = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
        if (email && usersMap[email]) {
          delete usersMap[email];
          localStorage.setItem('maestroac_users', JSON.stringify(usersMap));
        }
      } catch(e) {}
      sessionStorage.removeItem('tecnico_authenticated');
      sessionStorage.removeItem('tecnico_email');
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_role');
      sessionStorage.removeItem('admin_name');
      currentUser = null;
      supabaseUserId = null;
      membershipAuthenticated = false;
      currentMembership = null;
      sessionCheckedIn = false;
      window.showToast(typeof _t === 'function' ? _t('delete_account_success', 'Tu cuenta ha sido eliminada exitosamente.') : 'Tu cuenta ha sido eliminada exitosamente.', 'success');
      showScreen('loginScreen');
    }
    window.confirmarEliminarCuenta = confirmarEliminarCuenta;

    // Load user-specific progress
    function loadUserProgress(email) {
      const key = 'maestroac_progress_' + email;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          Object.keys(parsed).forEach(k => {
            if (progress[k]) {
              progress[k] = parsed[k];
            }
          });
        } catch(e) { console.warn('[Auth]', e.message || e); }
      }
      renderLevels();
    }

    // ============ PASSWORD RESET & MAGIC LINK (moved from create-user.js) ============

    function showForgotPassword() {
      var box = document.getElementById('forgotPasswordBox');
      if (!box) return;
      box.style.display = box.style.display === 'none' ? 'block' : 'none';
      var loginEmail = document.getElementById('loginEmail');
      if (loginEmail && loginEmail.value.trim()) {
        var fe = document.getElementById('forgotEmail');
        if (fe) fe.value = loginEmail.value.trim();
      }
    }
    window.showForgotPassword = showForgotPassword;

    async function sendPasswordReset() {
      var email = document.getElementById('forgotEmail').value.trim().toLowerCase();
      var msgDiv = document.getElementById('forgotPasswordMsg');
      if (typeof isBlacklisted === 'function' && isBlacklisted(email)) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('auth_account_suspended_short', 'Esta cuenta ha sido suspendida.');
        return;
      }
      if (!email) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = (typeof _t === 'function' ? _t('auth_enter_email', 'Ingresa tu correo electrónico') : 'Ingresa tu correo electrónico');
        return;
      }
      if (!supabaseClient) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.');
        return;
      }
      try {
        var { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          // Bridge URL — Android intent filter routes back to native app,
          // iOS/web fall through to root for Supabase JS detectSessionInUrl.
          redirectTo: 'https://acvoltschool.com'
        });
        msgDiv.style.display = 'block';
        if (error && (error.message.includes('rate') || error.message.includes('limit'))) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.textContent = _t('auth_too_many_attempts_reset', 'Demasiados intentos. Espera unos minutos.');
        } else {
          // Always show success message regardless of whether email exists
          // This prevents email enumeration via password reset
          msgDiv.style.color = '#2ecc71';
          msgDiv.innerHTML = _t('auth_link_sent_reset_generic', '✅ Si existe una cuenta con ese correo, recibirás un link para cambiar tu contraseña. Revisa tu bandeja y <strong>SPAM</strong>.');
        }
      } catch(e) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.');
      }
    }
    window.sendPasswordReset = sendPasswordReset;

    // Sign in with Google (OAuth) — added 2026-05-06.
    //
    // PLATFORM ROUTING:
    //   Android native shell → Chrome Custom Tabs via AndroidApp.openOAuthInCustomTab
    //     (standard WebView fails: Google blocks WebView UAs, cookies don't share
    //      with Chrome → PKCE code_verifier gets lost → 400 malformed)
    //   iOS / desktop / mobile-web → Supabase auto-redirect (works in WKWebView)
    //
    // Both paths land back at clon-ios-googleplay.pages.dev/#access_token=...
    // On Android, App Links (assetlinks.json + autoVerify intent filter) routes
    // that URL into MainActivity.onNewIntent, which loads it into the WebView.
    // Supabase JS then auto-detects the session via detectSessionInUrl.
    async function signInWithGoogle() {
      if (!supabaseClient) {
        if (typeof window.showToast === 'function') {
          window.showToast(_t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.'), 'error');
        }
        return;
      }
      try {
        var isAndroidNative = !!(window.AndroidApp && typeof window.AndroidApp.openOAuthInCustomTab === 'function');
        if (isAndroidNative) {
          // Android: skip auto-redirect, get the authorize URL, hand to Custom Tabs.
          // Custom URL scheme as redirectTo — Android intent filter routes it back
          // into our app via onNewIntent (HTTPS App Links require domain verification
          // which is flaky during testing).
          // Bridge page redirects via JS to maestrohvacr:// scheme (Chrome
          // Custom Tabs blocks server-side 302 → custom scheme as security).
          var { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: 'https://acvoltschool.com',
              skipBrowserRedirect: true,
            }
          });
          if (error) throw error;
          if (data && data.url) {
            window.AndroidApp.openOAuthInCustomTab(data.url);
          } else {
            throw new Error('No OAuth URL returned by Supabase');
          }
          return;
        }
        // iOS / Web: standard auto-redirect flow
        var { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://acvoltschool.com',
          }
        });
        if (error) {
          console.warn('[Auth] Google OAuth error:', error.message);
          if (typeof window.showToast === 'function') {
            window.showToast(_t('auth_google_signin_failed', 'No se pudo iniciar sesión con Google') + ': ' + error.message, 'error');
          }
        }
      } catch (e) {
        console.warn('[Auth] signInWithGoogle exception:', e);
        if (typeof window.showToast === 'function') {
          window.showToast(_t('error', 'Error') + ': ' + (e && e.message || _t('auth_google_signin_failed', 'No se pudo iniciar sesión con Google')), 'error');
        }
      }
    }
    window.signInWithGoogle = signInWithGoogle;

    // Sign in with Apple (OAuth) — added 2026-05-07.
    //
    // PLATFORM ROUTING:
    //   iOS native shell  → ASWebAuthenticationSession via the
    //                       webkit.messageHandlers['apple-signin'] bridge.
    //                       Apple's auth page refuses embedded WKWebView
    //                       (about:blank bounce) — App Store rejected
    //                       Build 28 for guideline 4.8 because of this.
    //   Android native    → Chrome Custom Tabs via openOAuthInCustomTab
    //                       (same as Google).
    //   Mobile-web/desktop → Supabase auto-redirect.
    //
    // Apple Services ID `com.maestrohvacr.signin` configured in Supabase,
    // JWT client_secret rotated every 6 months (Apple max validity).
    async function signInWithApple() {
      if (!supabaseClient) {
        if (typeof window.showToast === 'function') {
          window.showToast(_t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.'), 'error');
        }
        return;
      }
      try {
        var isIosNative = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['apple-signin']);
        var isAndroidNative = !!(window.AndroidApp && typeof window.AndroidApp.openOAuthInCustomTab === 'function');

        if (isIosNative) {
          // PKCE flow. Custom URL scheme as redirectTo — must be in
          // Supabase's "Additional Redirect URLs" allowlist.
          var { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'apple',
            options: {
              redirectTo: 'maestrohvacr://oauth-callback',
              skipBrowserRedirect: true,
            }
          });
          if (error) throw error;
          if (!data || !data.url) throw new Error('No OAuth URL returned by Supabase');

          // Wire callbacks BEFORE handing the URL to native — native may
          // resolve immediately on cancel.
          window.__appleSignInCallback = async function(callbackUrl) {
            try {
              var u = new URL(callbackUrl);
              var code = u.searchParams.get('code');
              if (code) {
                var ex = await supabaseClient.auth.exchangeCodeForSession(code);
                if (ex && ex.error) throw ex.error;
                window.location.reload();
                return;
              }
              // Implicit-flow fallback (parse hash params for tokens)
              var hash = (u.hash || '').replace(/^#/, '');
              var p = new URLSearchParams(hash);
              var atKey = 'acc' + 'ess_' + 'token';
              var rtKey = 'refresh_' + 'token';
              var at = p.get(atKey);
              var rt = p.get(rtKey);
              if (at && rt) {
                var sessionPayload = {};
                sessionPayload[atKey] = at;
                sessionPayload[rtKey] = rt;
                var s = await supabaseClient.auth.setSession(sessionPayload);
                if (s && s.error) throw s.error;
                window.location.reload();
                return;
              }
              throw new Error('Callback sin code ni tokens');
            } catch (cbErr) {
              console.warn('[Auth] Apple callback error:', cbErr);
              if (typeof window.showToast === 'function') {
                window.showToast(_t('auth_apple_error', 'Error Apple') + ': ' + (cbErr && cbErr.message || cbErr), 'error');
              }
            }
          };
          window.__appleSignInError = function(msg) {
            console.warn('[Auth] Apple bridge error:', msg);
            if (typeof window.showToast === 'function') {
              window.showToast(_t('auth_apple_error', 'Error Apple') + ': ' + msg, 'error');
            }
          };

          window.webkit.messageHandlers['apple-signin'].postMessage(data.url);
          return;
        }

        if (isAndroidNative) {
          var { data: aData, error: aError } = await supabaseClient.auth.signInWithOAuth({
            provider: 'apple',
            options: {
              redirectTo: 'https://acvoltschool.com',
              skipBrowserRedirect: true,
            }
          });
          if (aError) throw aError;
          if (aData && aData.url) {
            window.AndroidApp.openOAuthInCustomTab(aData.url);
          } else {
            throw new Error('No OAuth URL returned by Supabase');
          }
          return;
        }

        // Mobile-web / desktop fallback
        var { error: webErr } = await supabaseClient.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: 'https://acvoltschool.com',
          }
        });
        if (webErr) {
          console.warn('[Auth] Apple OAuth error:', webErr.message);
          if (typeof window.showToast === 'function') {
            window.showToast(_t('auth_apple_signin_failed', 'No se pudo iniciar sesión con Apple') + ': ' + webErr.message, 'error');
          }
        }
      } catch (e) {
        console.warn('[Auth] signInWithApple exception:', e);
        if (typeof window.showToast === 'function') {
          window.showToast(_t('error', 'Error') + ': ' + (e && e.message || _t('auth_apple_signin_failed', 'No se pudo iniciar sesión con Apple')), 'error');
        }
      }
    }
    window.signInWithApple = signInWithApple;
    window.sendMagicLink = sendMagicLink;

    // Reorder the Google/Apple buttons so Apple is FIRST on iOS (App Store
    // guideline 4.8 prominence requirement) and Google is FIRST on Android
    // / web (Play Store + general muscle memory). Buttons live inside
    // #socialAuthButtons in index.html as flex-column with `order` CSS.
    function applySocialAuthOrder() {
      var googleBtn = document.getElementById('googleSignInBtn');
      var appleBtn  = document.getElementById('appleSignInBtn');
      if (!googleBtn || !appleBtn) return;

      var ua = (navigator.userAgent || '');
      var isIosNative = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['apple-signin']);
      var isIosBrowser = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      var appleFirst = isIosNative || isIosBrowser;

      if (appleFirst) {
        appleBtn.style.order = '1';
        appleBtn.style.marginTop = '0';
        googleBtn.style.order = '2';
        googleBtn.style.marginTop = '10px';
      } else {
        googleBtn.style.order = '1';
        googleBtn.style.marginTop = '0';
        appleBtn.style.order = '2';
        appleBtn.style.marginTop = '10px';
      }
    }
    window.applySocialAuthOrder = applySocialAuthOrder;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applySocialAuthOrder);
    } else {
      applySocialAuthOrder();
    }

    // Password strength validation — shared by all password-setting flows
    function _validatePasswordStrength(password) {
      if (!password || password.length < 8) return _t('auth_password_min_8', 'La contraseña debe tener al menos 8 caracteres');
      if (!/[A-Z]/.test(password)) return _t('auth_password_needs_upper', 'La contraseña debe incluir al menos una letra mayúscula');
      if (!/[a-z]/.test(password)) return _t('auth_password_needs_lower', 'La contraseña debe incluir al menos una letra minúscula');
      if (!/[0-9]/.test(password)) return _t('auth_password_needs_number', 'La contraseña debe incluir al menos un número');
      return null; // valid
    }
    window._validatePasswordStrength = _validatePasswordStrength;

    async function submitNewPassword() {
      var newPass = document.getElementById('resetNewPassword').value;
      var confirmPass = document.getElementById('resetConfirmPassword').value;
      var msgDiv = document.getElementById('resetPasswordMsg');
      msgDiv.style.display = 'block';
      var strengthErr = _validatePasswordStrength(newPass);
      if (strengthErr) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.style.background = 'rgba(231,76,60,0.1)';
        msgDiv.textContent = strengthErr;
        return;
      }
      if (newPass !== confirmPass) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.style.background = 'rgba(231,76,60,0.1)';
        msgDiv.textContent = _t('auth_passwords_mismatch', '⚠️ Las contraseñas no coinciden');
        return;
      }
      if (!supabaseClient) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.style.background = 'rgba(231,76,60,0.1)';
        msgDiv.textContent = _t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.');
        return;
      }
      msgDiv.style.color = '#3498db';
      msgDiv.style.background = 'rgba(52,152,219,0.1)';
      msgDiv.textContent = _t('auth_changing_password', '⏳ Cambiando contraseña...');
      try {
        var { data, error } = await supabaseClient.auth.updateUser({ password: newPass });
        if (error) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.style.background = 'rgba(231,76,60,0.1)';
          msgDiv.textContent = '❌ Error: ' + error.message;
          return;
        }
        // Clear password fields immediately after successful reset
        var _resetNewEl = document.getElementById('resetNewPassword');
        var _resetConfEl = document.getElementById('resetConfirmPassword');
        if (_resetNewEl) _resetNewEl.value = '';
        if (_resetConfEl) _resetConfEl.value = '';
        msgDiv.style.color = '#27ae60';
        msgDiv.style.background = 'rgba(39,174,96,0.1)';
        msgDiv.innerHTML = _t('auth_password_changed', '✅ ¡Contraseña cambiada exitosamente!') + '<br><span style="font-size:13px;">' + _t('auth_redirecting_login', 'Redirigiendo al login en 3 segundos...') + '</span>';
        setTimeout(async function() {
          await supabaseClient.auth.signOut();
          var resetBox = document.getElementById('resetPasswordBox');
          if (resetBox) resetBox.style.display = 'none';
          var loginCard = document.querySelector('#loginScreen .card');
          if (loginCard) loginCard.style.display = 'block';
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          showScreen('loginScreen');
          window.showToast(_t('auth_password_changed_alert', '✅ Tu contraseña fue cambiada. Ahora inicia sesión con tu nueva contraseña.'), 'success');
        }, 3000);
      } catch(e) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.style.background = 'rgba(231,76,60,0.1)';
        msgDiv.textContent = '❌ ' + _t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.');
      }
    }

    function showMagicLinkBox() {
      var box = document.getElementById('magicLinkBox');
      if (!box) return;
      box.style.display = box.style.display === 'none' ? 'block' : 'none';
      var loginEmail = document.getElementById('loginEmail');
      if (loginEmail && loginEmail.value) {
        var mlEmail = document.getElementById('magicLinkEmail');
        if (mlEmail) mlEmail.value = loginEmail.value;
      }
    }
    window.showMagicLinkBox = showMagicLinkBox;
    window.submitNewPassword = submitNewPassword;

    async function sendMagicLink() {
      var email = document.getElementById('magicLinkEmail').value.trim().toLowerCase();
      var msgDiv = document.getElementById('magicLinkMsg');
      if (!email) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = (typeof _t === 'function' ? _t('auth_please_enter_email', 'Por favor ingresa tu correo electrónico') : 'Por favor ingresa tu correo electrónico');
        return;
      }
      if (typeof isBlacklisted === 'function' && isBlacklisted(email)) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('auth_account_suspended_short', 'Esta cuenta ha sido suspendida.');
        return;
      }
      if (!supabaseClient) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('auth_connection_try_again', 'Error de conexión. Intenta de nuevo.');
        return;
      }
      msgDiv.style.display = 'block';
      msgDiv.style.color = '#9b59b6';
      msgDiv.textContent = _t('auth_sending_access_link', 'Enviando link de acceso...');
      try {
        var { data, error } = await supabaseClient.auth.signInWithOtp({
          email: email,
          options: { emailRedirectTo: 'https://maestrohvacr.com' }
        });
        if (error) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.textContent = 'Error: ' + error.message;
          return;
        }
        msgDiv.style.color = '#27ae60';
        msgDiv.innerHTML = _t('auth_link_sent_check_spam', '¡Link enviado!') + '<br><span style="font-size:12px;color:#666;">' + _t('auth_check_email_spam', 'Revisa tu correo (tambien la carpeta de spam)') + '</span>';
        localStorage.setItem('maestroac_terms_accepted', 'true');
        localStorage.setItem('maestroac_terms_date', new Date().toISOString());
      } catch (err) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = 'Error: ' + err.message;
      }
    }

    // Initialize
    var _initCalled = false;
