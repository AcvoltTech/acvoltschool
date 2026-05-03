// ============================================================
// Payment Tests — Stripe links integrity, checkout configuration
// ============================================================
import { describe, it, expect, beforeEach } from 'vitest';
import { loadScripts } from './setup.js';

describe('Payment System', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    globalThis.currentUser = null;
    globalThis.supabaseClient = null;
  });

  describe('STRIPE_LINKS', () => {
    beforeEach(() => {
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
      ]);
    });

    it('STRIPE_LINKS is defined globally', () => {
      expect(globalThis.STRIPE_LINKS).toBeDefined();
      expect(typeof globalThis.STRIPE_LINKS).toBe('object');
    });

    it('has all required membership plan links', () => {
      const required = ['principiante', 'intermedio', 'avanzado'];
      for (const plan of required) {
        expect(globalThis.STRIPE_LINKS[plan]).toBeDefined();
        expect(globalThis.STRIPE_LINKS[plan]).toMatch(/^https:\/\/buy\.stripe\.com\//);
      }
    });

    it('has all required app access links', () => {
      const required = ['annual', 'monthly'];
      for (const plan of required) {
        expect(globalThis.STRIPE_LINKS[plan]).toBeDefined();
        expect(globalThis.STRIPE_LINKS[plan]).toMatch(/^https:\/\/buy\.stripe\.com\//);
      }
    });

    it('has all required certification exam links', () => {
      const required = ['epa608', 'osha', 'a2l', 'calefaccion', 'hvaccore', 'hvacr'];
      for (const exam of required) {
        expect(globalThis.STRIPE_LINKS[exam]).toBeDefined();
        expect(globalThis.STRIPE_LINKS[exam]).toMatch(/^https:\/\/buy\.stripe\.com\//);
      }
    });

    it('has all required product links', () => {
      const required = ['certificates_unlock', 'credential', 'ai_premium', 'video_tutoriales'];
      for (const product of required) {
        expect(globalThis.STRIPE_LINKS[product]).toBeDefined();
        expect(globalThis.STRIPE_LINKS[product]).toMatch(/^https:\/\/buy\.stripe\.com\//);
      }
    });

    it('has downgrade recovery links', () => {
      expect(globalThis.STRIPE_LINKS.subscribe_20).toBeDefined();
      expect(globalThis.STRIPE_LINKS.return_full).toBeDefined();
    });

    it('all links use HTTPS', () => {
      for (const [key, url] of Object.entries(globalThis.STRIPE_LINKS)) {
        expect(url).toMatch(/^https:\/\//);
      }
    });

    it('no link is empty or undefined', () => {
      for (const [key, url] of Object.entries(globalThis.STRIPE_LINKS)) {
        expect(url).toBeTruthy();
        expect(url.length).toBeGreaterThan(10);
      }
    });

    it('has exactly 24 payment links', () => {
      expect(Object.keys(globalThis.STRIPE_LINKS).length).toBe(24);
    });
  });

  describe('Supabase Configuration', () => {
    beforeEach(() => {
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
      ]);
    });

    it('SUPABASE_URL is defined and valid', () => {
      expect(globalThis.SUPABASE_URL).toBeDefined();
      expect(globalThis.SUPABASE_URL).toMatch(/^https:\/\/.*\.supabase\.co$/);
    });

    it('SUPABASE_KEY is defined and is a JWT', () => {
      expect(globalThis.SUPABASE_KEY).toBeDefined();
      // JWT has 3 parts separated by dots
      const parts = globalThis.SUPABASE_KEY.split('.');
      expect(parts.length).toBe(3);
    });
  });
});
