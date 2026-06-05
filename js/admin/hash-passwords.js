    if (typeof _addTranslations === 'function') _addTranslations({
      adm_hp_no_connection: { es: 'Sin conexión', en: 'No connection' },
    });

    // ==================== #14 HASH PASSWORDS ADMIN ====================
    // PBKDF2 hash function (WebCrypto API — 100,000 iterations)
    async function hashPasswordPBKDF2(password, salt) {
      var enc = new TextEncoder();
      var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
      var bits = await crypto.subtle.deriveBits({
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      }, keyMaterial, 256);
      var hashArray = Array.from(new Uint8Array(bits));
      return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    // Legacy SHA-256 hash (for backward compatibility during migration)
    async function hashPasswordLegacy(password) {
      var encoder = new TextEncoder();
      var data = encoder.encode(password + '_maestroac_salt_2026');
      var hashBuffer = await crypto.subtle.digest('SHA-256', data);
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    // Main hashPassword — uses PBKDF2 with per-user salt (email)
    async function hashPassword(password, userEmail) {
      if (userEmail) {
        return 'pbkdf2:' + await hashPasswordPBKDF2(password, 'acvolt_' + userEmail.toLowerCase());
      }
      // Fallback to legacy for callers that don't pass email
      return await hashPasswordLegacy(password);
    }
    
    // Override admin login to use hashed passwords
    var _originalAdminLogin = (typeof handleAdminLogin === 'function') ? handleAdminLogin : null;
    
    async function handleAdminLoginSecure(email, password) {
      if (!supabaseClient) { alert(_t('adm_hp_no_connection')); return false; }
      var lowerEmail = email.toLowerCase();

      // 1. Try PBKDF2 hash first (new format)
      var pbkdf2Hash = 'pbkdf2:' + await hashPasswordPBKDF2(password, 'acvolt_' + lowerEmail);
      var { data: adminRows } = await supabaseClient.rpc('admin_login_by_email', {
        p_email: lowerEmail,
        p_password_hash: pbkdf2Hash
      });
      var admin = adminRows && adminRows.length > 0 ? adminRows[0] : null;
      if (admin) return admin;

      // 2. Try legacy SHA-256 hash (migration path)
      var legacyHash = await hashPasswordLegacy(password);
      var { data: legacyRows } = await supabaseClient.rpc('admin_login_by_email', {
        p_email: lowerEmail,
        p_password_hash: legacyHash
      });
      var legacyAdmin = legacyRows && legacyRows.length > 0 ? legacyRows[0] : null;
      if (legacyAdmin) {
        // Auto-migrate from SHA-256 to PBKDF2
        try {
          await supabaseClient.rpc('migrate_admin_password', {
            p_staff_id: legacyAdmin.id,
            p_password_hash: pbkdf2Hash,
            p_clear_plain: true
          });
          console.log('[Security] Migrated to PBKDF2 for admin user');
        } catch(e) { console.log('[Hash] PBKDF2 migration error'); }
        return legacyAdmin;
      }

      // Both PBKDF2 and legacy SHA-256 failed — password is wrong or account needs reset
      console.log('[Security] Admin login failed for:', lowerEmail);
      return null;
    }

    // Form handler for admin login screen
    async function handleAdminLogin(event) {
      event.preventDefault();
      var user = document.getElementById('adminLoginUser').value.trim();
      var pass = document.getElementById('adminLoginPassword').value;
      var errorDiv = document.getElementById('adminLoginError');
      if (!user || !pass) { errorDiv.classList.add('show'); return false; }

      var staff = null;
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
          // Prefer secure login (PBKDF2 → SHA-256 legacy)
          if (typeof handleAdminLoginSecure === 'function') {
            staff = await handleAdminLoginSecure(user, pass);
          }
          // Fallback: legacy admin_login RPC by username
          if (!staff && typeof hashPassword === 'function') {
            var hashedPwd = await hashPassword(pass);
            var { data: staffRows } = await supabaseClient.rpc('admin_login', {
              p_username: user,
              p_password_hash: hashedPwd
            });
            staff = staffRows && staffRows.length > 0 ? staffRows[0] : null;
          }
          if (staff) {
            var staffEmail = staff.email || localStorage.getItem('tecnico_email') || '';
            // Store admin session
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_role', staff.rol || 'master');
            localStorage.setItem('admin_name', staff.nombre || user);
            localStorage.setItem('admin_email', staffEmail);
            localStorage.setItem('admin_login_ts', String(Date.now()));
            window._adminSession = { email: staffEmail, role: staff.rol || 'master', name: staff.nombre || user, id: staff.id };
            if (staffEmail) localStorage.setItem('tecnico_email', staffEmail);
            // Update last login
            try { await supabaseClient.rpc('update_admin_last_login', { p_staff_id: staff.id }); } catch(e) {}
            errorDiv.classList.remove('show');
            if (typeof showScreen === 'function') showScreen('adminDashboardScreen');
            return false;
          }
        } catch(e) { console.log('[Admin] Login error:', e); }
      }
      errorDiv.classList.add('show');
      return false;
    }

    // Restore admin session from sessionStorage on page load
    (function _restoreAdminSession() {
      if (localStorage.getItem('admin_authenticated') === 'true') {
        window._adminSession = {
          email: localStorage.getItem('admin_email') || '',
          role: localStorage.getItem('admin_role') || 'master',
          name: localStorage.getItem('admin_name') || 'Admin'
        };
      }
    })();

    // isAdminAuthenticated — checks window._adminSession or supabase auth session
    if (typeof isAdminAuthenticated !== 'function') {
      window.isAdminAuthenticated = function isAdminAuthenticated() {
        if (window._adminSession && window._adminSession.email) return true;
        if (localStorage.getItem('admin_authenticated') === 'true') return true;
        try {
          if (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth) {
            var s = supabaseClient.auth._session;
            if (s && s.user && s.user.email) return true;
          }
        } catch(e) {}
        return false;
      };
    }

