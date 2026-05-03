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


