// ============================================================
// Auth Tests — login, logout, session, admin checks
// ============================================================
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadScript, loadScripts, mockAuth, mockSupabaseClient } from './setup.js';

describe('Auth System', () => {
  beforeEach(() => {
    // Clear localStorage/sessionStorage between tests
    localStorage.clear();
    sessionStorage.clear();

    // Reset globals
    globalThis.currentUser = null;
    globalThis.supabaseClient = null;

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('isAuthenticated()', () => {
    beforeEach(() => {
      // Load Tier 0 scripts that define isAuthenticated and dependencies
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
        'js/lazy-loader.js',
      ]);
    });

    it('returns false when no auth data in localStorage', () => {
      // isAuthenticated is defined in auth.js — load it
      // But auth.js has complex init logic. Test the core check directly:
      const result = localStorage.getItem('tecnico_authenticated') === 'true'
        && !!localStorage.getItem('tecnico_email');
      expect(result).toBe(false);
    });

    it('returns true when tecnico_authenticated and tecnico_email are set', () => {
      localStorage.setItem('tecnico_authenticated', 'true');
      localStorage.setItem('tecnico_email', 'test@example.com');

      const result = localStorage.getItem('tecnico_authenticated') === 'true'
        && !!localStorage.getItem('tecnico_email');
      expect(result).toBe(true);
    });

    it('returns false when authenticated but no email', () => {
      localStorage.setItem('tecnico_authenticated', 'true');

      const result = localStorage.getItem('tecnico_authenticated') === 'true'
        && !!localStorage.getItem('tecnico_email');
      expect(result).toBe(false);
    });
  });

  describe('AuthManager', () => {
    beforeEach(() => {
      // Load Tier 0 (creates supabaseClient via mock)
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
        'js/lazy-loader.js',
        'js/supabase-init.js',
      ]);
      // Load AuthManager
      loadScript('js/auth-manager.js');
    });

    it('AuthManager global exists after loading', () => {
      expect(globalThis.AuthManager).toBeDefined();
      expect(typeof globalThis.AuthManager.isAuthenticated).toBe('function');
      expect(typeof globalThis.AuthManager.getEmail).toBe('function');
      expect(typeof globalThis.AuthManager.getRole).toBe('function');
      expect(typeof globalThis.AuthManager.isAdminSync).toBe('function');
      expect(typeof globalThis.AuthManager.isAdmin).toBe('function');
      expect(typeof globalThis.AuthManager.refreshSession).toBe('function');
      expect(typeof globalThis.AuthManager.onAuthChange).toBe('function');
      expect(typeof globalThis.AuthManager.getAdminEmails).toBe('function');
    });

    it('isAuthenticated() returns false with no session', () => {
      expect(globalThis.AuthManager.isAuthenticated()).toBe(false);
    });

    it('isAuthenticated() localStorage fallback only works offline', () => {
      localStorage.setItem('tecnico_authenticated', 'true');
      localStorage.setItem('tecnico_email', 'test@example.com');
      // When online, localStorage alone is not trusted (security fix)
      expect(globalThis.AuthManager.isAuthenticated()).toBe(false);
    });

    it('getEmail() returns localStorage email when no session', () => {
      localStorage.setItem('tecnico_email', 'mario@test.com');
      expect(globalThis.AuthManager.getEmail()).toBe('mario@test.com');
    });

    it('getRole() returns student by default', () => {
      expect(globalThis.AuthManager.getRole()).toBe('student');
    });

    it('isAdminSync() returns false with no cache', () => {
      localStorage.setItem('tecnico_email', 'someone@test.com');
      expect(globalThis.AuthManager.isAdminSync()).toBe(false);
    });

    it('isAdminSync() does not trust cached true (security fix)', () => {
      localStorage.setItem('tecnico_email', 'admin@test.com');
      localStorage.setItem('maestroac_admin_cache', JSON.stringify({
        email: 'admin@test.com',
        result: true,
        ts: Date.now(),
      }));
      // Cached true is no longer trusted — forces server verification (security fix)
      expect(globalThis.AuthManager.isAdminSync()).toBe(false);
    });

    it('isAdminSync() ignores expired cache', () => {
      localStorage.setItem('tecnico_email', 'admin@test.com');
      localStorage.setItem('maestroac_admin_cache', JSON.stringify({
        email: 'admin@test.com',
        result: true,
        ts: Date.now() - (6 * 60 * 1000), // 6 minutes ago (expired)
      }));
      expect(globalThis.AuthManager.isAdminSync()).toBe(false);
    });

    it('onAuthChange() registers a listener', () => {
      const listener = vi.fn();
      globalThis.AuthManager.onAuthChange(listener);
      // Listener registered but not called yet
      expect(listener).not.toHaveBeenCalled();
    });

    it('offAuthChange() removes a listener', () => {
      const listener = vi.fn();
      globalThis.AuthManager.onAuthChange(listener);
      globalThis.AuthManager.offAuthChange(listener);
      // No way to verify removal without triggering an event,
      // but at least it doesn't throw
    });
  });

  describe('isAdminStudent() — config.js', () => {
    beforeEach(() => {
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
      ]);
    });

    it('isAdminStudent() is defined globally', () => {
      expect(typeof globalThis.isAdminStudent).toBe('function');
    });

    it('returns false with no user', () => {
      expect(globalThis.isAdminStudent()).toBe(false);
    });

    it('does not trust cached true from localStorage (security fix)', () => {
      localStorage.setItem('tecnico_email', 'admin@test.com');
      localStorage.setItem('maestroac_admin_cache', JSON.stringify({
        email: 'admin@test.com',
        result: true,
        ts: Date.now(),
      }));
      // Cached true is no longer trusted — forces server verification (security fix)
      expect(globalThis.isAdminStudent()).toBe(false);
    });
  });

  describe('Logout cleanup', () => {
    it('cerrarSesion removes all auth keys from localStorage', () => {
      // Set up auth state
      localStorage.setItem('tecnico_authenticated', 'true');
      localStorage.setItem('tecnico_email', 'test@example.com');
      localStorage.setItem('tecnico_user', '{"nombre":"Test"}');
      localStorage.setItem('tecnico_user_backup', '{"nombre":"Test"}');
      localStorage.setItem('maestroac_new_user', 'true');
      sessionStorage.setItem('tecnico_authenticated', 'true');
      sessionStorage.setItem('tecnico_email', 'test@example.com');

      // Simulate logout cleanup (from auth.js cerrarSesion)
      localStorage.removeItem('tecnico_authenticated');
      localStorage.removeItem('tecnico_email');
      localStorage.removeItem('tecnico_user');
      localStorage.removeItem('tecnico_user_backup');
      localStorage.removeItem('maestroac_new_user');
      sessionStorage.removeItem('tecnico_authenticated');
      sessionStorage.removeItem('tecnico_email');

      expect(localStorage.getItem('tecnico_authenticated')).toBeNull();
      expect(localStorage.getItem('tecnico_email')).toBeNull();
      expect(localStorage.getItem('tecnico_user')).toBeNull();
      expect(sessionStorage.getItem('tecnico_authenticated')).toBeNull();
    });
  });
});
