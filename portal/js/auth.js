
    // ─── Local users-data helper (for Batch 3 of Phase 2 RLS Sprint B) ───
    // Defined inline because auth.js is tier 1 and runs BEFORE the lazy-loaded
    // users-data-client.js. Same wire format, just scoped to this file.
    async function _audUsersData(action, params) {
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
    }

    // ============ ADMIN DIRECT ACCESS VIA URL HASH ============
    // Allows admin access via maestrohvacr.com/#admin
    (function _detectAdminHash() {
      var h = (window.location.hash || '').replace('#', '').toLowerCase();
      if (h === 'admin' || h === 'adminloginscreen') {
        localStorage.setItem('maestroac_goto_screen', 'adminLoginScreen');
      }
    })();

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
            const _ud_userRows = await _audUsersData('get_self', { email: email }); const userRows = _ud_userRows.data ? [_ud_userRows.data] : [];
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
      if (window.BtnLoading) window.BtnLoading.start(_loginBtn, 'Entrando...');
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
          _audUsersData('get_self', { email: email, fields: ['acceso_completo'] }).then(function(res) { res = { data: res.data ? [res.data] : [] };
            var rows = res.data || [];
            if (rows.length > 0) {
              localStorage.setItem('maestroac_acceso_completo_' + email, rows[0].acceso_completo === true ? 'true' : 'false');
            }
          }).catch(function() {});
        } else {
          // Try loading from Supabase users table
          try {
            const _ud_userRows = await _audUsersData('get_self', { email: email }); const userRows = _ud_userRows.data ? [_ud_userRows.data] : [];
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
        if (typeof checkOnboardingGate === 'function') {
          checkOnboardingGate(_authPostLogin);
        } else {
          _authPostLogin();
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
                  var _ud__bgUserRows = await _audUsersData('get_self', { email: _bgEmail, fields: ["photo_url","technician_number","technician_number_date","student_id","student_id_date"] }); var _bgUserRows = _ud__bgUserRows.data ? [_ud__bgUserRows.data] : [];
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
            'js/users-data-client.js',
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
      if (window.BtnLoading) window.BtnLoading.start(_regBtn, 'Creando cuenta...');
      try {
        // Register with Supabase Auth (email confirmation disabled)
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: pass
        });

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

        // Save minimal data to users table
        try {
          await _audUsersData('upsert_self', {
            email: email,
            data: { nombre: tempName, fecha_registro: new Date().toISOString() }
          });

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
        localStorage.removeItem('maestroac_is_admin');
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
      if (!email) return;
      var _email = email.toLowerCase().trim();
      var _found = false;

      function _showLinks() {
        if (_found) return;
        _found = true;
        var links = document.querySelectorAll('.admin-only-link');
        for (var i = 0; i < links.length; i++) {
          links[i].style.display = '';
        }
        localStorage.setItem('maestroac_is_admin', 'true');
        console.log('[MaestroAC] Admin links revealed for:', _email);
      }

      // Fast path: check cached admin status first
      if (localStorage.getItem('maestroac_is_admin') === 'true') {
        _showLinks();
      }

      // Also verify from DB (async) — updates cache
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('admin_staff')
          .select('email')
          .ilike('email', _email)
          .eq('activo', true)
          .limit(1)
          .then(function(res) {
            if (res.data && res.data.length > 0) _showLinks();
          }).catch(function() {});

        supabaseClient.from('admin_students')
          .select('email')
          .ilike('email', _email)
          .limit(1)
          .then(function(res) {
            if (res.data && res.data.length > 0) _showLinks();
          }).catch(function() {});
      }
    }
    window.revealAdminLinksIfStaff = revealAdminLinksIfStaff;

    // Delete Account (Apple App Store requirement — account deletion)
    async function confirmarEliminarCuenta() {
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
      try {
        if (supabaseClient && email) {
          // Delete user data from the users table
          await _audUsersData('self_delete', { email: email });
          console.log('[MaestroAC] User data deleted from Supabase for:', email);
        }
      } catch(e) {
        console.warn('[MaestroAC] Error deleting user data:', e);
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

    // ============ ADMIN AUTH GUARD ============
    // Used by navigation.js:1778 to gate adminDashboardScreen + adminTechnicianProfileScreen.
    // True when a successful handleAdminLogin has populated sessionStorage.
    function isAdminAuthenticated() {
      try { return sessionStorage.getItem('admin_authenticated') === 'true'; } catch(e) { return false; }
    }
    window.isAdminAuthenticated = isAdminAuthenticated;

    // ============ ADMIN LOGIN HANDLER ============
    // Wired from #adminLoginForm. Uses handleAdminLoginSecure (hash-passwords.js)
    // which is lazy-loaded when adminLoginScreen opens (SCREEN_SCRIPTS[adminLoginScreen]).
    async function handleAdminLogin(event) {
      if (event && event.preventDefault) event.preventDefault();
      var userInput = document.getElementById('adminLoginUser');
      var pwdInput = document.getElementById('adminLoginPassword');
      var errEl = document.getElementById('adminLoginError');
      var email = (userInput && userInput.value || '').trim().toLowerCase();
      var password = pwdInput && pwdInput.value || '';
      if (errEl) errEl.style.display = 'none';
      if (!email || !password) {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = _t('admin_login_error_invalid', 'Credenciales de administrador incorrectas'); }
        return false;
      }
      function showErr(msg) {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = msg; }
      }
      if (typeof handleAdminLoginSecure !== 'function') {
        // hash-passwords.js should be lazy-loaded when adminLoginScreen opens; try to load it now.
        if (window.MaestroLoader) {
          try { await MaestroLoader.load(['js/admin/hash-passwords.js']); } catch(e) {}
        }
      }
      if (typeof handleAdminLoginSecure !== 'function') {
        showErr(_t('adm_hp_no_connection', 'Sin conexión'));
        return false;
      }
      try {
        // Try by email first (input treated as email)
        var admin = await handleAdminLoginSecure(email, password);

        // If that failed and input doesn't look like an email, try by username
        if (!admin && email.indexOf('@') === -1 && supabaseClient && typeof hashPasswordLegacy === 'function') {
          var legacyHash = await hashPasswordLegacy(password);
          var { data: usernameRows } = await supabaseClient.rpc('admin_login', {
            p_username: email,
            p_password_hash: legacyHash
          });
          admin = usernameRows && usernameRows.length > 0 ? usernameRows[0] : null;
        }

        if (!admin) {
          showErr(_t('admin_login_error_invalid', 'Credenciales de administrador incorrectas'));
          return false;
        }
        var adminEmail = admin.email || email;
        // Set window._adminSession — required by pipeline.js isAdminAuthenticated()
        // which guards adminDashboardScreen. Without this the navigation guard
        // kicks the admin back to adminLoginScreen right after a successful login.
        try {
          window._adminSession = {
            email: adminEmail,
            role: admin.rol || admin.role || 'staff',
            id: admin.id || null,
            nombre: admin.nombre || admin.name || email.split('@')[0]
          };
        } catch(e) {}
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_email', adminEmail);
        sessionStorage.setItem('admin_role', admin.rol || admin.role || 'staff');
        sessionStorage.setItem('admin_name', admin.nombre || admin.name || email.split('@')[0]);
        if (admin.id) sessionStorage.setItem('admin_id', String(admin.id));
        try { window.currentAdminRole = admin.rol || admin.role || 'staff'; } catch(e) {}
        try { window.currentAdminName = admin.nombre || admin.name || email.split('@')[0]; } catch(e) {}
        if (pwdInput) pwdInput.value = '';
        showScreen('adminDashboardScreen');
        return false;
      } catch (e) {
        console.warn('[Auth] Admin login error:', e && e.message || e);
        showErr(_t('admin_login_error_invalid', 'Credenciales de administrador incorrectas'));
        return false;
      }
    }
    window.handleAdminLogin = handleAdminLogin;

    // ============ ADMIN LOGOUT ============
    function adminLogout() {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_email');
      sessionStorage.removeItem('admin_role');
      showScreen('dashboardScreen');
    }
    window.adminLogout = adminLogout;

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
          redirectTo: 'https://maestrohvacr.com'
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
    window.sendMagicLink = sendMagicLink;

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
        // Guard: if recovery session is missing/expired, updateUser returns
        // "Auth session missing!" which is opaque to the user. Detect early
        // and show the actionable "request new email" message instead.
        var preCheck = await supabaseClient.auth.getSession();
        if (!preCheck || !preCheck.data || !preCheck.data.session) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.style.background = 'rgba(231,76,60,0.1)';
          msgDiv.textContent = '❌ Tu sesión de recuperación expiró. Pide un nuevo link desde "¿Olvidaste tu contraseña?".';
          return;
        }
        var { data, error } = await supabaseClient.auth.updateUser({ password: newPass });
        if (error) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.style.background = 'rgba(231,76,60,0.1)';
          var friendly = /session.*missing|JWT|expired/i.test(error.message)
            ? 'Tu sesión de recuperación expiró. Pide un nuevo link desde "¿Olvidaste tu contraseña?".'
            : error.message;
          msgDiv.textContent = '❌ Error: ' + friendly;
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
