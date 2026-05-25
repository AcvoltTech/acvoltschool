    // Free native app — currentMembership global stub so all code paths
    // that reference the old membership system resolve to an active state.
    var currentMembership = { activa: true, tipo: 'native_app_free', amount: 0, fecha_inicio: '' };
    window.currentMembership = currentMembership;

    // ── iOS App Store failsafe detection ──────────────────────────
    // Redundant with ios-app-store.js — ensures the flag is set even
    // if the build pipeline skips ios-app-store.js for any reason.
    (function() {
      if (window.isIOSAppStore) return; // already set
      try {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var c = cookies[i].trim();
          if (c.indexOf('app-platform=') === 0) {
            if (decodeURIComponent(c.substring('app-platform='.length)) === 'iOS App Store') {
              window.isIOSAppStore = true;
              return;
            }
          }
        }
      } catch(e) {}
      try { if (navigator.userAgent.indexOf('PWAShell') !== -1) window.isIOSAppStore = true; } catch(e) {}
    })();

    // ============================================
    // ADMIN EMAIL HELPER — used by all edge function calls
    // ============================================
    function getAdminEmail() {
      var email = sessionStorage.getItem('admin_email')
        || (typeof currentUser !== 'undefined' && currentUser && currentUser.email ? currentUser.email : '')
        || localStorage.getItem('tecnico_email')
        || '';
      if (!email) {
        // Fallback: parse stored user JSON
        try {
          var u = JSON.parse(localStorage.getItem('tecnico_user') || 'null');
          if (u && u.email) email = u.email;
        } catch(e) { console.warn('[Config]', e.message || e); }
      }
      if (!email) {
        // Fallback: check maestroac_users map
        try {
          var users = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
          var keys = Object.keys(users);
          if (keys.length > 0) email = keys[0]; // first registered email
        } catch(e) { console.warn('[Config]', e.message || e); }
      }
      if (email) {
        // Persist for future calls
        sessionStorage.setItem('admin_email', email);
      }
      return email;
    }

    // ============================================
    // WHATSAPP GROUP (auto-join after payment)
    // ============================================
    const WHATSAPP_GROUP = 'https://wa.me/19096390448?text=Hola%2C%20acabo%20de%20hacer%20mi%20pago%20en%20ACVOLT';

    // ============================================
    // STRIPE PAYMENT LINKS — Centralized checkout URLs
    // ============================================
    const STRIPE_LINKS = {
      principiante: 'https://buy.stripe.com/9B6cN52rB6tagjd1nV3sI04',
      intermedio: 'https://buy.stripe.com/7sYcN5d6feZG3wr2rZ3sI0e',
      avanzado: 'https://buy.stripe.com/6oU28r3vF5p6aYTaYv3sI0d',
      annual: 'https://buy.stripe.com/3cIbJ1eaj2cUff96If3sI0g',
      monthly: 'https://buy.stripe.com/fZu5kD9U32cU1ojaYv3sI07',
      epa608: 'https://buy.stripe.com/00w8wPd6f6taff92rZ3sI0f',
      osha: 'https://buy.stripe.com/6oU7sL0jt4l2ff97Mj3sI09',
      a2l: 'https://buy.stripe.com/9B63cveajdVCd71giP3sI08',
      calefaccion: 'https://buy.stripe.com/aFadR9gircRygjd8Qn3sI0c',
      hvaccore: 'https://buy.stripe.com/5kQ8wP3vF18Qeb5aYv3sI0a',
      hvacr: 'https://buy.stripe.com/4gMbJ18PZ9Fmgjd9Ur3sI0b',
      certificates_unlock: 'https://buy.stripe.com/bJecN5c2bcRy1oj0jR3sI05',
      credential: 'https://buy.stripe.com/8x200j1nxaJq4AvgiP3sI06',
      ai_premium: 'https://buy.stripe.com/bJecN54zJ8Bic2X6If3sI0h',
      ai_mario: 'https://buy.stripe.com/bJecN54zJ8Bic2X6If3sI0h',
      v2_mario: 'https://buy.stripe.com/bJecN54zJ8Bic2X6If3sI0h',
      video_tutoriales: 'https://buy.stripe.com/7sYeVd1nx18Qeb52rZ3sI0i',
      soporte_1on1: 'https://buy.stripe.com/5kQ3cv4zJg3K9UP4A73sI0j',
      membership_usa: 'https://buy.stripe.com/eVqfZh6HRaJq8QLaYv3sI0k',
      membership_latam: 'https://buy.stripe.com/3cI8wP7LV6taff94A73sI0l',
      clases_en_vivo: 'https://buy.stripe.com/9B6cN52rB6tagjd1nV3sI04',
      clases_vip: 'https://buy.stripe.com/7sYcN5d6feZG3wr2rZ3sI0e',
      subscribe_20: 'https://buy.stripe.com/aEUfZz8jL3Oo7RKeVi',
      return_full: 'https://buy.stripe.com/9AQeVv2Zr8eI5JCeVg'
    };

    // ============================================
    // MEMBERSHIP TIER LEVEL — determines user access level
    // 0=free, 2=paid, 3=acceso_completo/CRM, 4=admin
    // ============================================
    function getMembershipTierLevel() {
      // Admin = tier 4
      if (typeof isAdminStudent === 'function' && isAdminStudent()) return 4;

      var email = (localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
      if (!email) return 0;

      // Grandfathered students (before April 3, 2026) = tier 3
      var fechaReg = localStorage.getItem('maestroac_fecha_registro_' + email);
      if (fechaReg && fechaReg < '2026-04-03') return 3;

      // CRM group acceso_completo = tier 3
      var acceso = localStorage.getItem('maestroac_acceso_completo_' + email);
      if (acceso === 'true') return 3;

      // CRM groups check
      try {
        var groups = JSON.parse(localStorage.getItem('maestroac_student_groups_' + email) || '[]');
        if (groups.indexOf('bloqueado') !== -1) return 0;
      } catch(e) {}

      // Active paid membership = tier 2
      if (window.currentMembership && window.currentMembership.activa && window.currentMembership.amount > 0) return 2;

      // Check memberships table cache
      try {
        var mem = JSON.parse(localStorage.getItem('maestroac_membership_' + email) || 'null');
        if (mem && mem.activa && mem.amount > 0) return 2;
      } catch(e) {}

      return 0;
    }
    window.getMembershipTierLevel = getMembershipTierLevel;

    // ============================================
    // WEB ACCESS GATE — Block non-paid users on web
    // Native app users always pass. Grandfathered + paid pass.
    // Everyone else sees "Download the app" blocker.
    // ============================================
    function _checkWebAccessGate(email, callback) {
      // Native app → always pass
      if (window.isIOSAppStore || window.isAndroidApp || window.isAndroidPlayStore) {
        if (callback) callback();
        return;
      }
      // PWA standalone → pass (installed app)
      try {
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
          if (callback) callback();
          return;
        }
      } catch(e) {}
      // iOS WKWebView → pass
      if (window.webkit && window.webkit.messageHandlers) {
        if (callback) callback();
        return;
      }
      // Admin → pass
      if (typeof isAdminStudent === 'function' && isAdminStudent()) {
        if (callback) callback();
        return;
      }
      // Check tier — grandfathered (3+), paid (2+), admin (4) all pass
      var tier = getMembershipTierLevel();
      if (tier >= 2) {
        if (callback) callback();
        return;
      }
      // Tier might not be loaded yet (async CRM fetch). Wait for it.
      email = (email || '').toLowerCase().trim();
      var _checkAsync = function() {
        // Re-check fecha_registro from localStorage (set by preloadStudentCRMGroups)
        var fechaReg = localStorage.getItem('maestroac_fecha_registro_' + email);
        if (fechaReg && fechaReg < '2026-04-03') { if (callback) callback(); return; }
        // Re-check acceso_completo
        var acceso = localStorage.getItem('maestroac_acceso_completo_' + email);
        if (acceso === 'true') { if (callback) callback(); return; }
        // Re-check membership
        var tier2 = getMembershipTierLevel();
        if (tier2 >= 2) { if (callback) callback(); return; }
        // BLOCKED — show download app screen
        _showWebBlockedScreen();
      };
      // Give preloadStudentCRMGroups time to fetch
      setTimeout(_checkAsync, 2500);
    }
    window._checkWebAccessGate = _checkWebAccessGate;

    function _showWebBlockedScreen() {
      // Remove any existing gate
      var existing = document.getElementById('webAccessGate');
      if (existing) existing.remove();

      var overlay = document.createElement('div');
      overlay.id = 'webAccessGate';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#0a1628;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;';
      overlay.innerHTML =
        '<div style="max-width:400px;width:100%;text-align:center;">' +
          '<div style="font-size:64px;margin-bottom:16px;">📱</div>' +
          '<div style="font-size:22px;font-weight:900;color:#fff;margin-bottom:8px;">Descarga la App</div>' +
          '<div style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:24px;">' +
            'Para acceder a Maestro HVACR desde el navegador necesitas una membresía activa.<br><br>' +
            'Descarga la app gratis o suscríbete para continuar.' +
          '</div>' +
          '<a href="https://play.google.com/store/apps/details?id=com.maestromario.twa" target="_blank" ' +
            'style="display:block;background:#34A853;color:#fff;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:10px;">' +
            '▶ Google Play (Android)' +
          '</a>' +
          '<a href="https://apps.apple.com/app/maestro-hvacr/id6744396653" target="_blank" ' +
            'style="display:block;background:#007AFF;color:#fff;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:10px;">' +
            ' App Store (iPhone)' +
          '</a>' +
          '<div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;">' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:10px;">¿Ya eres miembro?</div>' +
            '<a href="https://maestrohvacr.com/#membershipScreen" ' +
              'style="color:#f59e0b;font-size:13px;font-weight:600;text-decoration:none;">Suscríbete aquí →</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    window._showWebBlockedScreen = _showWebBlockedScreen;

    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

    // ============================================
    // PRELOAD CRM STUDENT GROUPS (called from auth.js after login)
    // Fetches student's CRM groups from Supabase and caches in localStorage
    // ============================================
    function preloadStudentCRMGroups(email) {
      if (!email) return Promise.resolve();
      email = email.toLowerCase().trim();
      if (typeof supabaseClient === 'undefined' || !supabaseClient) return Promise.resolve();

      // Load CRM groups AND acceso_completo in parallel
      var groupsPromise = supabaseClient.from('zoom_recordings').select('data').eq('id', 'student_groups').maybeSingle()
        .then(function(res) {
          if (res.data && res.data.data) {
            try {
              var all = JSON.parse(res.data.data);
              localStorage.setItem('maestroac_student_groups', JSON.stringify(all));
              var found = all.find(function(s) { return s.email && s.email.toLowerCase() === email; });
              if (found && found.groups && found.groups.length > 0) {
                localStorage.setItem('maestroac_student_groups_' + email, JSON.stringify(found.groups));
              }
            } catch(e) { console.warn('[Config] CRM groups parse error:', e); }
          }
        })
        .catch(function(e) { console.warn('[Config] CRM groups preload error:', e); });

      var accesoPromise = usersDataSelf('get_self', { email: email, fields: ['acceso_completo','fecha_registro'] })
        .then(function(res) {
          if (res.data) {
            localStorage.setItem('maestroac_acceso_completo_' + email, res.data.acceso_completo === true ? 'true' : 'false');
            if (res.data.fecha_registro) {
              localStorage.setItem('maestroac_fecha_registro_' + email, res.data.fecha_registro);
            }
          }
        })
        .catch(function(e) { console.warn('[Config] acceso_completo preload error:', e); });

      return Promise.all([groupsPromise, accesoPromise]);
    }

    // Auto-preload on app start if user is logged in — try immediately and retry after supabase init
    (function _autoPreload() {
      var _autoEmail = (localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
      if (!_autoEmail) return;
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        preloadStudentCRMGroups(_autoEmail);
      } else {
        // Supabase not ready yet — retry every 500ms up to 10 times
        var _retries = 0;
        var _iv = setInterval(function() {
          _retries++;
          if ((typeof supabaseClient !== 'undefined' && supabaseClient) || _retries > 10) {
            clearInterval(_iv);
            if (typeof supabaseClient !== 'undefined' && supabaseClient) preloadStudentCRMGroups(_autoEmail);
          }
        }, 500);
      }
    })();

    // ============================================
    // ID VERIFICATION — Grace period cutoff date
    // After this date, users without approved ID cannot access tier 2+ content
    // ============================================
    const ID_REQUIRED_AFTER = '2026-04-05';

    // ============================================
    // BLACKLIST — Permanently blocked users (Multiverse/Espinosa incident 2026-03-12)
    // ============================================
    var BLACKLISTED_EMAILS = [
      'andresespinosa.multiverse@gmail.com',
      'multiverse.gt@gmail.com',
      'apps.multiverse@gmail.com',
      'aespinosa.inventabto@gmail.com',
      'andrerc17@hotmail.es',
      'andrerc17@gmail.com',
      'andrec17@gmail.com',
      'andrerc59@gmail.com',
      'math12euru@gmail.com',
      'prueba@prueba.com'
    ];
    var BLACKLISTED_PATTERNS = ['multiverse', 'espinosa.multiverse', 'urrutia.multiverse'];

    function isBlacklisted(email) {
      if (!email) return false;
      var e = email.toLowerCase().trim();
      if (BLACKLISTED_EMAILS.indexOf(e) !== -1) return true;
      for (var i = 0; i < BLACKLISTED_PATTERNS.length; i++) {
        if (e.indexOf(BLACKLISTED_PATTERNS[i]) !== -1) return true;
      }
      return false;
    }

    // ============================================
    // ADMIN INFILTRADO — DB-backed with localStorage cache + offline fallback
    // ============================================
    const ADMIN_FALLBACK_EMAILS = []; // Removed hardcoded emails — DB-only via admin_staff table
    var _adminCache = { email: '', result: false, ts: 0 };
    var _ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    function isAdminStudent() {
      // Delegate to AuthManager if available (single source of truth)
      if (typeof AuthManager !== 'undefined') {
        return AuthManager.isAdminSync();
      }

      // Fallback: original logic (pre-AuthManager)
      var email = (currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || '';
      email = email.toLowerCase().trim();
      if (!email) return false;

      // Check localStorage cache first (sync)
      if (_adminCache.email === email && (Date.now() - _adminCache.ts) < _ADMIN_CACHE_TTL) {
        return _adminCache.result;
      }

      // Try reading from localStorage persisted cache
      try {
        var cached = JSON.parse(localStorage.getItem('maestroac_admin_cache') || '{}');
        if (cached.email === email && cached.ts && (Date.now() - cached.ts) < _ADMIN_CACHE_TTL) {
          _adminCache = cached;
          // Trigger background refresh
          _refreshAdminStatus(email);
          return cached.result;
        }
      } catch(e) { console.warn('[Config]', e.message || e); }

      // Fallback to hardcoded list (offline resilience)
      var fallbackResult = ADMIN_FALLBACK_EMAILS.includes(email);

      // Trigger async DB check in background
      _refreshAdminStatus(email);

      return fallbackResult;
    }

    function _refreshAdminStatus(email) {
      if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
      supabaseClient.rpc('is_admin_student', { p_email: email }).then(function(res) {
        if (res.error) { console.warn('[Admin] RPC error:', res.error.message); return; }
        var result = !!res.data;
        _adminCache = { email: email, result: result, ts: Date.now() };
        try { localStorage.setItem('maestroac_admin_cache', JSON.stringify(_adminCache)); } catch(e) { console.warn('[Config]', e.message || e); }
      }).catch(function() { /* silently use fallback */ });
    }

    // ============================================
    // SUPABASE CONFIGURATION
    // ============================================
    const SUPABASE_URL = 'https://htklsowiyjwsjnacnvnr.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2xzb3dpeWp3c2puYWNudm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjIwMjQsImV4cCI6MjA4NjAzODAyNH0.6A3F7MI4YJEMo98b4Zfzao9p_hMh2T0ha0dRJ4SUhv0';
    const CF_FALLBACK_URL = 'https://maestroac-fallback.acvolt.workers.dev';

    // ============================================
    // GOOGLE DRIVE CONFIGURATION (Auto-upload recordings)
    // ============================================
    const GOOGLE_CLIENT_ID = '602367869215-ahtck6fgu9gvb0aka82mq0avlq8pq87q.apps.googleusercontent.com';
    const GOOGLE_DRIVE_FOLDER_NAME = 'MaestroAC Grabaciones';
    const GOOGLE_DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.file';

    var supabaseClient = window.supabaseClient || null;
    window.supabaseClient = supabaseClient;
    
    // Initialize Supabase with retry logic

    // State
    var currentUser = null;
    var currentLevel = null;
    var currentQuestions = [];
    var currentQuestionIndex = 0;
    var liveClasses = [];

    // === HTML SANITIZATION UTILITIES ===
    function _escHtml(s) {
      if (!s) return '';
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
    }
    // Strip all HTML tags — returns plain text only
    function _stripHtml(s) {
      if (!s) return '';
      return String(s).replace(/<[^>]*>/g, '');
    }
    // Sanitize HTML — allow safe tags only (b, strong, em, i, br, span, p, div)
    // Strips event handlers (onclick, onerror, etc.), script tags, and dangerous attrs
    function _sanitizeHtml(s) {
      if (!s) return '';
      s = String(s);
      // Remove script/style/iframe/object/embed tags and contents
      s = s.replace(/<(script|style|iframe|object|embed|form|input|textarea|select|button)[^>]*>[\s\S]*?<\/\1>/gi, '');
      s = s.replace(/<(script|style|iframe|object|embed|form|input|textarea|select|button)[^>]*\/?>/gi, '');
      // Remove event handlers and javascript: URLs
      s = s.replace(/\s+on\w+\s*=\s*(['"]?).*?\1/gi, '');
      s = s.replace(/javascript\s*:/gi, '');
      return s;
    }

    // === NOTIFICATION SYSTEM (defined in notification block below ~line 24139) ===

    let correctAnswers = 0;
    let serverVerifiedCount = 0; // Track how many quiz answers were verified server-side
    let startTime = null;
    let certificates = []; // Array to store earned certificates
    let previousScreen = 'dashboardScreen'; // Track previous screen for navigation
    
    // Tracking de estado de preguntas (estilo examen real)
    let questionStatus = {}; // {index: 'answered'|'flagged'|'unanswered'}
    
    let progress = {
      principiante: { completed: 0, total: 700, score: 0 },
      intermedio: { completed: 0, total: 700, score: 0 },
      avanzado: { completed: 0, total: 700, score: 0 },
      elite: { completed: 0, total: 700, score: 0 },
      platino: { completed: 0, total: 700, score: 0 }
    };

    // Last activity tracking object - persisted to track user's most recent activity
    let lastActivity = null;

    // Last quiz state - persisted to enable exact resume from question view
    // Contains: levelId, category, questionIndex, totalQuestions, routePath, updatedAt
    // Also stores shuffledQuestionIds to restore exact question order on resume
    let lastQuizState = null;

    // Questions bank - loaded on demand from questions.js
    var questions = {};

    // ============================================
    // APPOINTMENT MODAL — Hacer Cita
    // ============================================
    function openAppointmentModal() {
      // Generate next 14 days for date options
      var dateOptions = '';
      for (var d = 1; d <= 14; d++) {
        var dt = new Date();
        dt.setDate(dt.getDate() + d);
        var dayName = dt.toLocaleDateString('es-US', { weekday: 'short', month: 'short', day: 'numeric' });
        var val = dt.toISOString().split('T')[0];
        dateOptions += '<option value="' + val + '">' + dayName + '</option>';
      }

      var m = document.createElement('div');
      m.id = 'appointmentModal';
      m.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.94);display:flex;align-items:center;justify-content:center;z-index:99999;padding:12px;overflow-y:auto;';
      m.innerHTML = '<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:24px;max-width:440px;width:100%;text-align:center;border:2px solid #0d9488;max-height:90vh;overflow-y:auto;">' +

        '<div style="font-size:40px;margin-bottom:6px;">📅</div>' +
        '<h2 style="color:#2dd4bf;margin-bottom:4px;font-size:20px;">' + _tc('appt_title', 'Agenda tu Visita') + '</h2>' +
        '<p style="color:#94a3b8;font-size:12px;margin-bottom:16px;">' + _tc('appt_subtitle', 'Conoce nuestras instalaciones y habla con un asesor') + '</p>' +

        // Form
        '<div style="text-align:left;">' +
          '<label style="color:#94a3b8;font-size:11px;font-weight:600;display:block;margin-bottom:4px;">' + _tc('appt_name', 'Nombre Completo *') + '</label>' +
          '<input id="apptName" type="text" placeholder="' + _tc('appt_your_name', 'Tu nombre') + '" style="width:100%;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;padding:12px;font-size:14px;margin-bottom:12px;box-sizing:border-box;">' +

          '<label style="color:#94a3b8;font-size:11px;font-weight:600;display:block;margin-bottom:4px;">' + _tc('appt_phone', 'Teléfono *') + '</label>' +
          '<input id="apptPhone" type="tel" placeholder="(714) 555-0000" style="width:100%;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;padding:12px;font-size:14px;margin-bottom:12px;box-sizing:border-box;">' +

          '<label style="color:#94a3b8;font-size:11px;font-weight:600;display:block;margin-bottom:4px;">' + _tc('appt_email', 'Email (opcional)') + '</label>' +
          '<input id="apptEmail" type="email" placeholder="tu@email.com" style="width:100%;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;padding:12px;font-size:14px;margin-bottom:12px;box-sizing:border-box;">' +

          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">' +
            '<div>' +
              '<label style="color:#94a3b8;font-size:11px;font-weight:600;display:block;margin-bottom:4px;">' + _tc('appt_date', 'Fecha Preferida *') + '</label>' +
              '<select id="apptDate" style="width:100%;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;padding:12px;font-size:14px;box-sizing:border-box;">' +
                dateOptions +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label style="color:#94a3b8;font-size:11px;font-weight:600;display:block;margin-bottom:4px;">' + _tc('appt_time', 'Hora Preferida *') + '</label>' +
              '<select id="apptTime" style="width:100%;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;padding:12px;font-size:14px;box-sizing:border-box;">' +
                '<option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>' +
                '<option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>' +
                '<option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>' +
                '<option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>' +
                '<option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>' +
                '<option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>' +
                '<option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>' +
                '<option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>' +
              '</select>' +
            '</div>' +
          '</div>' +

          '<label style="color:#94a3b8;font-size:11px;font-weight:600;display:block;margin-bottom:4px;">' + _tc('appt_notes', 'Notas (opcional)') + '</label>' +
          '<textarea id="apptNotes" placeholder="' + _tc('appt_notes_placeholder', '¿Qué te interesa saber?') + '" rows="2" style="width:100%;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;padding:12px;font-size:14px;margin-bottom:16px;box-sizing:border-box;resize:none;font-family:inherit;"></textarea>' +
        '</div>' +

        '<button id="apptSubmitBtn" onclick="submitAppointment();" style="display:block;width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#0d9488,#14b8a6);color:white;box-sizing:border-box;margin-bottom:8px;">' + _tc('appt_submit', 'Agendar Cita') + '</button>' +
        '<p style="color:#64748b;font-size:10px;margin-bottom:10px;">' + _tc('appt_advisor_confirm', 'Un asesor se comunicará contigo para confirmar') + '</p>' +
        '<button onclick="document.getElementById(\'appointmentModal\').remove();" style="width:100%;padding:10px;border:none;border-radius:10px;font-size:13px;cursor:pointer;background:rgba(255,255,255,0.1);color:#94a3b8;">' + _tc('close', 'Cerrar') + '</button>' +
      '</div>';
      document.body.appendChild(m);
    }

    async function submitAppointment() {
      var name = document.getElementById('apptName').value.trim();
      var phone = document.getElementById('apptPhone').value.trim();
      var email = document.getElementById('apptEmail').value.trim();
      var date = document.getElementById('apptDate').value;
      var time = document.getElementById('apptTime').value;
      var notes = document.getElementById('apptNotes').value.trim();

      if (!name) { window.showToast(_tc('appt_enter_name', 'Por favor ingresa tu nombre'), 'warning'); return; }
      if (!phone) { window.showToast(_tc('appt_enter_phone', 'Por favor ingresa tu teléfono'), 'warning'); return; }

      var btn = document.getElementById('apptSubmitBtn');
      if (window.BtnLoading) window.BtnLoading.start(btn, _tc('appt_scheduling', 'Agendando...'));

      try {
        var SB_URL_VAL = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
        var res = await fetch(SB_URL_VAL + '/functions/v1/manage-appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            visitor_name: name,
            visitor_phone: phone,
            visitor_email: email || null,
            preferred_date: date,
            preferred_time: time,
            notes: notes || null
          })
        });
        var data = await res.json();
        if (data.error) throw new Error(data.error);

        // Show success and redirect to plans modal
        var modal = document.getElementById('appointmentModal');
        if (modal) {
          modal.querySelector('div').innerHTML =
            '<div style="padding:40px 20px;text-align:center;">' +
              '<div style="font-size:60px;margin-bottom:12px;">✅</div>' +
              '<h2 style="color:#22c55e;margin-bottom:8px;font-size:20px;">' + _tc('appt_success', '¡Cita Agendada!') + '</h2>' +
              '<p style="color:#e2e8f0;font-size:14px;margin-bottom:4px;">' + _tc('appt_thanks', 'Gracias') + ' <strong>' + _escHtml(name) + '</strong></p>' +
              '<p style="color:#94a3b8;font-size:12px;margin-bottom:16px;"><strong style="color:#60a5fa;">' + _escHtml(data.assigned_to || '') + '</strong> ' + _tc('appt_advisor_will_contact', 'se comunicará contigo para confirmar.') + '</p>' +
              '<div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:10px;padding:12px;margin-bottom:20px;text-align:left;color:#94a3b8;font-size:12px;">' +
                '📅 ' + _escHtml(date) + '<br>🕐 ' + _escHtml(time) + '<br>📞 ' + _escHtml(phone) +
              '</div>' +
              '<button onclick="document.getElementById(\'appointmentModal\').remove();" style="width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;box-sizing:border-box;margin-bottom:8px;">' + _tc('close', 'Cerrar') + '</button>' +
            '</div>';
        }
      } catch(e) {
        window.MaestroDialog.alert({title: 'Error', message: _tc('appt_error_scheduling', 'Error agendando cita') + ': ' + (e.message || e) + '\n\n' + _tc('appt_contact_acvolt', 'Contacta a ACVOLT: (714) 709-3942'), kind: 'error'});
      } finally {
        if (window.BtnLoading) window.BtnLoading.stop(btn);
      }
    }

    // ============================================
    // SCHOOL TOUR MODAL — 3D Video of Facilities
    // ============================================
    function openSchoolTourModal() {
      var m = document.createElement('div');
      m.id = 'schoolTourModal';
      m.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.94);display:flex;align-items:center;justify-content:center;z-index:99999;padding:12px;overflow-y:auto;';
      m.innerHTML = '<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:24px;max-width:520px;width:100%;text-align:center;border:2px solid #3b82f6;max-height:90vh;overflow-y:auto;">' +

        // Header
        '<div style="font-size:40px;margin-bottom:6px;">🏫</div>' +
        '<h2 style="color:#60a5fa;margin-bottom:4px;font-size:20px;">' + _tc('tour_title', 'Conoce ACVOLT Tech School') + '</h2>' +
        '<p style="color:#94a3b8;font-size:12px;margin-bottom:16px;">' + _tc('tour_subtitle', 'Instalaciones de primer nivel para tu entrenamiento HVAC') + '</p>' +


        // School Info
        '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;margin-bottom:16px;text-align:left;">' +
          '<div style="color:#e2e8f0;font-size:13px;font-weight:700;margin-bottom:8px;">' + _tc('tour_what_find', 'Lo que encontrarás en ACVOLT:') + '</div>' +
          '<div style="color:#94a3b8;font-size:11px;line-height:1.7;">' +
            '&#8226; ' + _tc('tour_lab', 'Laboratorio completo de HVAC con equipos reales') + '<br>' +
            '&#8226; ' + _tc('tour_handson', 'Práctica hands-on desde el primer día') + '<br>' +
            '&#8226; ' + _tc('tour_professional_tools', 'Herramientas profesionales disponibles') + '<br>' +
            '&#8226; ' + _tc('tour_instructors', 'Instructores certificados con experiencia en campo') + '<br>' +
            '&#8226; ' + _tc('tour_spanish', 'Clases en español — ambiente familiar') + '<br>' +
            '&#8226; ' + _tc('tour_location', 'Ubicación: Anaheim, California') +
          '</div>' +
        '</div>' +

        // Schedule Info
        '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;margin-bottom:20px;text-align:left;">' +
          '<div style="color:#e2e8f0;font-size:13px;font-weight:700;margin-bottom:8px;">' + _tc('tour_schedule_title', 'Horarios de Clases:') + '</div>' +
          '<div style="color:#94a3b8;font-size:11px;line-height:1.7;">' +
            '📅 <strong style="color:#c4b5fd;">' + _tc('tour_schedule_tue_wed', 'Martes y Miércoles') + '</strong> — 6:00pm a 10:00pm<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + _tc('tour_schedule_ac_refrig', 'AC y Refrigeración (Hybrid)') + '<br>' +
            '📅 <strong style="color:#c4b5fd;">' + _tc('tour_schedule_sat_sun', 'Sábado y Domingo') + '</strong> — 7:00am a 11:00am<br>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + _tc('tour_schedule_trinity', 'La Trinidad del Oficio (HVAC + Plomería + Electricidad)') +
          '</div>' +
        '</div>' +

        // CTA Buttons
        '<button onclick="document.getElementById(\'schoolTourModal\').remove();" style="width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;box-sizing:border-box;margin-bottom:8px;">' + _tc('close', 'Cerrar') + '</button>' +
      '</div>';
      document.body.appendChild(m);
    }

    // ============================================
    // ACVOLT.SCHOOL — Login Modal
    // ============================================
    var _acvoltSchoolAuthURL = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co') + '/functions/v1/acvolt-school-auth';

    function showAcvoltSchoolModal() {
      // Clon: single $59.99 purchase unlocks everything — always go straight to content.
      if (typeof showScreen === 'function') { showScreen('acvoltCertScreen'); return; }
      var m = document.createElement('div');
      m.id = 'acvoltSchoolModal';
      m.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;overflow-y:auto;';
      m.innerHTML = '<div style="background:linear-gradient(135deg,#1a5276,#154360);border-radius:20px;padding:25px;max-width:380px;width:100%;text-align:center;border:2px solid #f59e0b;">' +
        '<div style="width:70px;height:70px;border-radius:50%;background:#fff;margin:0 auto 12px;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
          '<img src="acvolt-school-logo.jpg" alt="ACVOLT School" style="width:100%;height:100%;object-fit:contain;">' +
        '</div>' +
        '<h2 style="color:#f59e0b;margin-bottom:4px;font-size:20px;">Acvolt.school</h2>' +
        '<p style="color:#e2e8f0;font-size:12px;margin-bottom:16px;">' + _tc('acvolt_use_credentials', 'Usa tu usuario o email y contrasena de Maestro HVACR') + '</p>' +
        // Login form
        '<div id="acvoltLoginForm">' +
          '<input id="acvoltUser" type="text" placeholder="' + _tc('acvolt_user_or_email', 'Usuario o Email') + '" style="width:100%;padding:12px;border:1px solid #E7E5DE;border-radius:10px;font-size:14px;margin-bottom:8px;background:#FFFFFF;color:#0F0F0F;box-sizing:border-box;" autocomplete="username">' +
          '<input id="acvoltPass" type="password" placeholder="' + _tc('acvolt_password', 'Contrasena') + '" style="width:100%;padding:12px;border:1px solid #E7E5DE;border-radius:10px;font-size:14px;margin-bottom:8px;background:#FFFFFF;color:#0F0F0F;box-sizing:border-box;" autocomplete="current-password">' +
          '<div id="acvoltLoginError" style="display:none;color:#ef4444;font-size:12px;margin-bottom:8px;"></div>' +
          '<button onclick="acvoltSchoolLogin();" id="acvoltLoginBtn" style="width:100%;padding:13px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;margin-bottom:10px;">' + _tc('acvolt_enter', 'Entrar') + '</button>' +
          '<button onclick="acvoltShowReset();" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:12px;cursor:pointer;background:rgba(239,68,68,0.15);border:1px solid #ef4444;color:#ef4444;margin-bottom:10px;">' + _tc('acvolt_forgot_password', 'Olvide mi contrasena') + '</button>' +
        '</div>' +
        // Reset form (hidden)
        '<div id="acvoltResetForm" style="display:none;">' +
          '<p style="color:#e2e8f0;font-size:12px;margin-bottom:10px;">' + _tc('acvolt_reset_desc', 'Escribe tu email para resetear tu contrasena') + '</p>' +
          '<input id="acvoltResetEmail" type="email" placeholder="' + _tc('acvolt_your_email', 'Tu email de Maestro HVACR') + '" style="width:100%;padding:12px;border:1px solid #E7E5DE;border-radius:10px;font-size:14px;margin-bottom:8px;background:#FFFFFF;color:#0F0F0F;box-sizing:border-box;">' +
          '<div id="acvoltResetMsg" style="display:none;font-size:12px;margin-bottom:8px;"></div>' +
          '<button onclick="acvoltSchoolReset();" id="acvoltResetBtn" style="width:100%;padding:13px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#ef4444,#dc2626);color:white;margin-bottom:10px;">' + _tc('acvolt_reset_password', 'Resetear Contrasena') + '</button>' +
          '<button onclick="acvoltShowLogin();" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:12px;cursor:pointer;background:rgba(255,255,255,0.1);color:#94a3b8;margin-bottom:10px;">' + _tc('acvolt_back_login', 'Volver al Login') + '</button>' +
        '</div>' +
        '<button onclick="document.getElementById(\'acvoltSchoolModal\').remove();" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:13px;cursor:pointer;background:rgba(255,255,255,0.1);color:#64748b;">' + _tc('close', 'Cerrar') + '</button>' +
      '</div>';
      document.body.appendChild(m);
      // Focus username
      setTimeout(function() { var el = document.getElementById('acvoltUser'); if (el) el.focus(); }, 200);
      // Enter key support
      m.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var loginForm = document.getElementById('acvoltLoginForm');
          var resetForm = document.getElementById('acvoltResetForm');
          if (loginForm && loginForm.style.display !== 'none') acvoltSchoolLogin();
          else if (resetForm && resetForm.style.display !== 'none') acvoltSchoolReset();
        }
      });
    }

    function acvoltShowReset() {
      var lf = document.getElementById('acvoltLoginForm');
      var rf = document.getElementById('acvoltResetForm');
      if (lf) lf.style.display = 'none';
      if (rf) rf.style.display = 'block';
      var el = document.getElementById('acvoltResetEmail');
      if (el) el.focus();
    }

    function acvoltShowLogin() {
      var lf = document.getElementById('acvoltLoginForm');
      var rf = document.getElementById('acvoltResetForm');
      if (lf) lf.style.display = 'block';
      if (rf) rf.style.display = 'none';
    }

    function acvoltSchoolLogin() {
      var user = (document.getElementById('acvoltUser') || {}).value || '';
      var pass = (document.getElementById('acvoltPass') || {}).value || '';
      var errEl = document.getElementById('acvoltLoginError');
      var btn = document.getElementById('acvoltLoginBtn');
      if (!user || !pass) { if (errEl) { errEl.textContent = _tc('acvolt_write_credentials', 'Escribe tu usuario y contrasena'); errEl.style.display = 'block'; } return; }
      if (btn) { btn.disabled = true; btn.textContent = _tc('acvolt_verifying', 'Verificando...'); }
      if (errEl) errEl.style.display = 'none';

      fetch(_acvoltSchoolAuthURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: user, password: pass })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) {
          if (errEl) { errEl.textContent = data.error; errEl.style.display = 'block'; }
          if (btn) { btn.disabled = false; btn.textContent = _tc('acvolt_enter', 'Entrar'); }
          return;
        }
        // Success — store session and navigate
        localStorage.setItem('acvolt_school_session', JSON.stringify(data));
        var modal = document.getElementById('acvoltSchoolModal');
        if (modal) modal.remove();
        // Navigate to acvoltCertScreen
        if (typeof showScreen === 'function') showScreen('acvoltCertScreen');
        var nombre = data.profile ? ((data.profile.name || '') + ' ' + (data.profile.lastname || '')).trim() : (data.user && data.user.name ? data.user.name : _tc('student', 'Estudiante'));
        window.showToast(_tc('acvolt_welcome', 'Bienvenido') + ', ' + nombre + '! ' + _tc('acvolt_lessons_completed', 'lecciones completadas') + ': ' + (data.lessons_completed || 0), 'success');
      })
      .catch(function(e) {
        if (errEl) { errEl.textContent = _tc('acvolt_connection_error', 'Error de conexion. Intenta de nuevo.'); errEl.style.display = 'block'; }
        if (btn) { btn.disabled = false; btn.textContent = _tc('acvolt_enter', 'Entrar'); }
      });
    }

    function acvoltSchoolReset() {
      var email = (document.getElementById('acvoltResetEmail') || {}).value || '';
      var msgEl = document.getElementById('acvoltResetMsg');
      var btn = document.getElementById('acvoltResetBtn');
      if (!email) { if (msgEl) { msgEl.textContent = _tc('acvolt_write_email', 'Escribe tu email'); msgEl.style.color = '#ef4444'; msgEl.style.display = 'block'; } return; }
      if (btn) { btn.disabled = true; btn.textContent = _tc('acvolt_resetting', 'Reseteando...'); }
      if (msgEl) msgEl.style.display = 'none';

      fetch(_acvoltSchoolAuthURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password', email: email })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) {
          if (msgEl) { msgEl.textContent = data.error; msgEl.style.color = '#ef4444'; msgEl.style.display = 'block'; }
          if (btn) { btn.disabled = false; btn.textContent = _tc('acvolt_reset_password', 'Resetear Contrasena'); }
          return;
        }
        // Show temporary password
        if (msgEl) {
          msgEl.innerHTML = '<strong style="color:#2ecc71;">✅ ' + _escHtml(data.message || _tc('acvolt_password_reset', 'Contrasena reseteada')) + '</strong><br><span style="color:#94a3b8;">' + _tc('acvolt_check_email', 'Revisa tu correo para la contrasena temporal.') + '</span>';
          msgEl.style.color = '#2ecc71';
          msgEl.style.display = 'block';
        }
        if (btn) { btn.style.display = 'none'; }
      })
      .catch(function(e) {
        if (msgEl) { msgEl.textContent = _tc('acvolt_connection_error', 'Error de conexion. Intenta de nuevo.'); msgEl.style.color = '#ef4444'; msgEl.style.display = 'block'; }
        if (btn) { btn.disabled = false; btn.textContent = _tc('acvolt_reset_password', 'Resetear Contrasena'); }
      });
    }
