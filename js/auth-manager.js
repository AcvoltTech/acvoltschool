// ============================================================
// AuthManager — Single source of truth for authentication
// Wraps Supabase Auth with real session validation,
// visibility-change refresh, centralized admin check, and roles.
// ============================================================

var AuthManager = (function() {
  'use strict';

  // ── Private state ──
  var _session = null;
  var _user = null;
  var _role = 'student'; // 'student' | 'admin' | 'instructor'
  var _adminChecked = false;
  var _adminResult = false;
  var _adminTs = 0;
  var _listeners = [];
  var _initialized = false;
  var _refreshing = false;
  var _supabaseConnected = false;

  var ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  var SESSION_REFRESH_DEBOUNCE = 2000; // 2s debounce on visibility change
  var _lastRefreshTs = 0;

  // ── Helpers ──

  function _getSupabase() {
    return (typeof supabaseClient !== 'undefined' && supabaseClient) ? supabaseClient : null;
  }

  function _notifyListeners(event) {
    for (var i = 0; i < _listeners.length; i++) {
      try { _listeners[i](event, _user, _role); } catch(e) {
        console.warn('[AuthManager] Listener error:', e);
      }
    }
  }

  function _updateRole() {
    // Admin check: session-based admin auth (admin_staff) takes priority
    if (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) {
      _role = 'admin';
      return;
    }
    // Then check admin student status (DB-backed)
    if (_adminChecked && _adminResult) {
      _role = 'admin';
      return;
    }
    // Future: instructor role will come from user profile / instructor table
    _role = 'student';
  }

  // ── Admin check (DB-backed, no hardcoded emails) ──

  function _checkAdminAsync(email) {
    var sb = _getSupabase();
    if (!sb || !email) return;

    sb.rpc('is_admin_student', { p_email: email }).then(function(res) {
      if (res.error) {
        console.warn('[AuthManager] Admin RPC error:', res.error.message);
        return;
      }
      _adminResult = !!res.data;
      _adminChecked = true;
      _adminTs = Date.now();

      // Update caches (stay compatible with config.js cache)
      var cacheObj = { email: email, result: _adminResult, ts: _adminTs };
      try {
        localStorage.setItem('maestroac_admin_cache', JSON.stringify(cacheObj));
      } catch(e) { console.warn('[AuthManager]', e.message || e); }

      // Update role after admin check resolves
      var prevRole = _role;
      _updateRole();
      if (_role !== prevRole) {
        _notifyListeners('ROLE_CHANGED');
      }
    }).catch(function() { /* silently use cached */ });
  }

  // ── Public API ──

  return {
    /**
     * Initialize AuthManager. Call once after supabaseClient is ready.
     * Sets up session, visibility-change refresh, and auth state listener.
     */
    init: function() {
      if (_initialized) return;
      _initialized = true;

      var self = this;

      // Refresh session when user returns from background
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState !== 'visible') return;
        // Debounce: don't refresh if we just did
        if (Date.now() - _lastRefreshTs < SESSION_REFRESH_DEBOUNCE) return;
        self.refreshSession();
        // Device guard — check if this device was kicked while tab was hidden
        try {
          var dgEmail = localStorage.getItem('tecnico_email') || '';
          if (dgEmail && typeof DeviceGuard !== 'undefined') DeviceGuard.checkDevice(dgEmail);
        } catch(e) { /* fail-open */ }
      });

      // Connect to Supabase (may be ready now or later via retry)
      self._connectSupabase();
    },

    /**
     * Internal: connect to Supabase auth. Safe to call multiple times —
     * only the first successful connection sets up listeners.
     * Called by init() and can be called again when Supabase connects on retry.
     */
    _connectSupabase: function() {
      var self = this;
      var sb = _getSupabase();

      if (!sb) {
        // Supabase not ready yet — poll until it is (matches supabase-init.js retry pattern)
        var _pollInterval = setInterval(function() {
          var sb2 = _getSupabase();
          if (sb2) {
            clearInterval(_pollInterval);
            self._connectSupabase();
          }
        }, 2000);
        // Stop polling after 30s to avoid memory leaks
        setTimeout(function() { clearInterval(_pollInterval); }, 30000);
        return;
      }

      // Already connected — skip
      if (_supabaseConnected) return;
      _supabaseConnected = true;

      // Recover session from Supabase (real validation, not localStorage)
      sb.auth.getSession().then(function(result) {
        var session = result.data ? result.data.session : null;
        _session = session;
        _user = session ? session.user : null;
        if (_user) {
          _checkAdminAsync(_user.email);
        }
        _updateRole();
        console.log('[AuthManager] Initialized — user:', _user ? 'authenticated' : 'none');
      }).catch(function(e) {
        console.warn('[AuthManager] getSession error:', e);
      });

      // Listen for Supabase auth state changes
      sb.auth.onAuthStateChange(function(event, session) {
        _session = session;
        _user = session ? session.user : null;

        if (event === 'SIGNED_IN' && _user) {
          _checkAdminAsync(_user.email);
        }
        if (event === 'SIGNED_OUT') {
          _adminChecked = false;
          _adminResult = false;
          _role = 'student';
        }

        _updateRole();
        _notifyListeners(event);
      });
    },

    /**
     * Refresh session from Supabase (real server validation).
     * Called automatically on visibility change and can be called manually.
     * Returns promise resolving to the session or null.
     */
    refreshSession: function() {
      if (_refreshing) return Promise.resolve(_session);
      var sb = _getSupabase();
      if (!sb) return Promise.resolve(null);

      _refreshing = true;
      _lastRefreshTs = Date.now();

      return sb.auth.getSession().then(function(result) {
        _refreshing = false;
        var session = result.data ? result.data.session : null;
        var hadUser = !!_user;
        _session = session;
        _user = session ? session.user : null;

        // If session expired while in background, notify
        if (hadUser && !_user) {
          _updateRole();
          _notifyListeners('SESSION_EXPIRED');
        }

        return session;
      }).catch(function(e) {
        _refreshing = false;
        console.warn('[AuthManager] Session refresh failed:', e);
        return null;
      });
    },

    /**
     * Is the user authenticated? Based on real Supabase session,
     * with localStorage fallback for offline/pre-init.
     */
    isAuthenticated: function() {
      // Primary: real session (trusted)
      if (_session && _user) return true;
      // Fallback: localStorage only when offline (reduces attack surface)
      // localStorage can be tampered, so only trust when no network is available
      if (!navigator.onLine && localStorage.getItem('tecnico_authenticated') === 'true'
        && !!localStorage.getItem('tecnico_email')) {
        return true;
      }
      return false;
    },

    /**
     * Get the current user's email.
     */
    getEmail: function() {
      if (_user && _user.email) return _user.email;
      return localStorage.getItem('tecnico_email') || '';
    },

    /**
     * Get the current Supabase session object.
     */
    getSession: function() {
      return _session;
    },

    /**
     * Get the current Supabase user object.
     */
    getUser: function() {
      return _user;
    },

    /**
     * Synchronous admin check (from cache).
     * Returns immediately using cached admin status.
     * Triggers background refresh if cache is stale.
     */
    isAdminSync: function() {
      var email = this.getEmail().toLowerCase().trim();
      if (!email) return false;

      // Check memory cache
      if (_adminChecked && (Date.now() - _adminTs) < ADMIN_CACHE_TTL) {
        return _adminResult;
      }

      // Check localStorage cache (read-only, never trust for granting admin)
      // localStorage can be tampered — only use cached result to return false (deny),
      // never to grant admin from cache alone. Always verify server-side.
      try {
        var cached = JSON.parse(localStorage.getItem('maestroac_admin_cache') || '{}');
        if (cached.email === email && cached.ts && (Date.now() - cached.ts) < ADMIN_CACHE_TTL) {
          if (!cached.result) {
            // Safe to trust cached "not admin" — still triggers background refresh
            _adminResult = false;
            _adminChecked = true;
            _adminTs = cached.ts;
            _checkAdminAsync(email);
            return false;
          }
          // Cached "is admin" — don't trust, force server verification
          // Return false until server confirms (prevents localStorage injection)
        }
      } catch(e) { console.warn('[AuthManager]', e.message || e); }

      // No trusted cache — trigger async check, return false for now
      _checkAdminAsync(email);
      return false;
    },

    /**
     * Async admin check (waits for DB response).
     * Returns a promise resolving to boolean.
     */
    isAdmin: function() {
      var email = this.getEmail().toLowerCase().trim();
      if (!email) return Promise.resolve(false);

      // Use cache if fresh
      if (_adminChecked && (Date.now() - _adminTs) < ADMIN_CACHE_TTL) {
        return Promise.resolve(_adminResult);
      }

      var sb = _getSupabase();
      if (!sb) return Promise.resolve(false);

      return sb.rpc('is_admin_student', { p_email: email }).then(function(res) {
        if (res.error) return false;
        _adminResult = !!res.data;
        _adminChecked = true;
        _adminTs = Date.now();
        try {
          localStorage.setItem('maestroac_admin_cache', JSON.stringify({
            email: email, result: _adminResult, ts: _adminTs
          }));
        } catch(e) { console.warn('[AuthManager]', e.message || e); }
        _updateRole();
        return _adminResult;
      }).catch(function() {
        return false;
      });
    },

    /**
     * Get the current user's role: 'student', 'admin', or 'instructor'.
     */
    getRole: function() {
      _updateRole();
      return _role;
    },

    /**
     * Subscribe to auth state changes.
     * Callback receives (event, user, role).
     * Events: SIGNED_IN, SIGNED_OUT, SESSION_EXPIRED, ROLE_CHANGED,
     *         TOKEN_REFRESHED, PASSWORD_RECOVERY
     */
    onAuthChange: function(callback) {
      if (typeof callback === 'function') {
        _listeners.push(callback);
      }
    },

    /**
     * Remove an auth change listener.
     */
    offAuthChange: function(callback) {
      _listeners = _listeners.filter(function(cb) { return cb !== callback; });
    },

    /**
     * Get admin staff emails from the database.
     * Used by features that need to notify admins (e.g., group chat push).
     * Returns a promise resolving to an array of email strings.
     */
    getAdminEmails: function() {
      var sb = _getSupabase();
      if (!sb) return Promise.resolve([]);

      return sb.from('admin_staff')
        .select('email')
        .eq('activo', true)
        .then(function(res) {
          if (res.error || !res.data) return [];
          return res.data.map(function(row) { return row.email.toLowerCase(); });
        }).catch(function() {
          return [];
        });
    }
  };
})();

// Auto-initialize: supabaseClient is set by Tier 0 (supabase-init.js)
// This defer script runs after Tier 0 completes
AuthManager.init();
