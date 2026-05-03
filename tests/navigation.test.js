// ============================================================
// Navigation Tests — showScreen, SCREEN_SCRIPTS, lazy loading
// ============================================================
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadScripts } from './setup.js';

describe('Navigation System', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    globalThis.currentUser = null;
    globalThis.supabaseClient = null;

    // Create minimal DOM structure that navigation.js expects
    document.body.innerHTML = `
      <div class="screen active" id="loginScreen"></div>
      <div class="screen" id="dashboardScreen"></div>
      <div class="screen" id="desafioScreen"></div>
      <div class="screen" id="techChatScreen"></div>
      <div class="screen" id="liveStreamingScreen"></div>
      <div class="screen" id="groupChatsScreen"></div>
      <div class="screen" id="adminDashboardScreen"></div>
      <div class="screen" id="miPerfilScreen"></div>
      <meta name="theme-color" content="#040d1a">
    `;

    vi.clearAllMocks();
  });

  describe('SCREEN_SCRIPTS mapping', () => {
    beforeEach(() => {
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
        'js/lazy-loader.js',
        'js/supabase-init.js',
      ]);
      // navigation.js defines SCREEN_SCRIPTS and showScreen
      loadScripts(['js/navigation.js']);
    });

    it('SCREEN_SCRIPTS is defined globally', () => {
      expect(globalThis.SCREEN_SCRIPTS).toBeDefined();
      expect(typeof globalThis.SCREEN_SCRIPTS).toBe('object');
    });

    it('has mappings for all critical screens', () => {
      const criticalScreens = [
        'desafioScreen',
        'techChatScreen',
        'liveStreamingScreen',
        'groupChatsScreen',
        'adminDashboardScreen',
        'miPerfilScreen',
      ];
      for (const screen of criticalScreens) {
        expect(globalThis.SCREEN_SCRIPTS[screen]).toBeDefined();
      }
    });

    it('desafio screens load the correct scripts', () => {
      const scripts = globalThis.SCREEN_SCRIPTS.desafioScreen;
      expect(scripts).toContain('js/desafio-questions-c1.js');
      expect(scripts).toContain('js/desafio.js');
      expect(scripts).toContain('js/ai-maestro-mario.js');
    });

    it('group chats loads correct scripts', () => {
      const scripts = globalThis.SCREEN_SCRIPTS.groupChatsScreen;
      expect(scripts).toContain('js/group-chats.js');
    });

    it('admin screens use _admin bundle marker', () => {
      expect(globalThis.SCREEN_SCRIPTS.adminDashboardScreen).toBe('_admin');
      expect(globalThis.SCREEN_SCRIPTS.adminTechnicianProfileScreen).toBe('_admin');
    });

    it('no screen references a non-existent script path', () => {
      const fs = require('fs');
      const path = require('path');
      const ROOT = path.resolve(__dirname, '..');

      for (const [screen, scripts] of Object.entries(globalThis.SCREEN_SCRIPTS)) {
        if (scripts === '_admin') continue;
        for (const script of scripts) {
          const exists = fs.existsSync(path.join(ROOT, script));
          expect(exists, `${script} referenced by ${screen} should exist`).toBe(true);
        }
      }
    });
  });

  describe('MaestroLoader', () => {
    beforeEach(() => {
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
        'js/lazy-loader.js',
      ]);
    });

    it('MaestroLoader is defined globally', () => {
      expect(globalThis.MaestroLoader).toBeDefined();
      expect(typeof globalThis.MaestroLoader.load).toBe('function');
      expect(typeof globalThis.MaestroLoader.loadCSS).toBe('function');
    });

    it('tracks loaded scripts to prevent double-loading', () => {
      // Internal _loaded map starts empty
      expect(globalThis.MaestroLoader._loaded).toBeDefined();
      expect(typeof globalThis.MaestroLoader._loaded).toBe('object');
    });

    it('has a cache-busting version string', () => {
      expect(globalThis.MaestroLoader._v).toBeDefined();
      expect(globalThis.MaestroLoader._v.length).toBeGreaterThan(0);
    });
  });

  describe('showScreen()', () => {
    beforeEach(() => {
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
        'js/lazy-loader.js',
        'js/supabase-init.js',
      ]);
      // Stub functions that showScreen calls
      globalThis.loadProgress = vi.fn();
      globalThis.loadVideoProgress = vi.fn();
      globalThis.renderLevels = vi.fn();
      globalThis.previousScreen = null;
      globalThis.studyTimerInterval = undefined;
      globalThis.updateBottomNav = vi.fn();
      loadScripts(['js/navigation.js']);
    });

    it('showScreen is defined globally', () => {
      expect(typeof globalThis.showScreen).toBe('function');
    });

    it('redirects levelsScreen to desafioScreen', () => {
      // showScreen('levelsScreen') should redirect to desafioScreen
      // We can verify by checking which screen becomes active
      globalThis.showScreen('levelsScreen');
      const desafio = document.getElementById('desafioScreen');
      expect(desafio.classList.contains('active')).toBe(true);
    });
  });

  describe('updateBottomNav()', () => {
    beforeEach(() => {
      document.body.innerHTML += `
        <nav class="mobile-bottom-nav" id="mobileBottomNav">
          <button class="bnav-item active" data-screen="dashboardScreen"></button>
          <button class="bnav-item" data-screen="studentExamsScreen"></button>
          <button class="bnav-item" data-screen="miPerfilScreen"></button>
        </nav>
      `;
      loadScripts([
        'js/error-tracking.js',
        'js/logger.js',
        'js/utils.js',
        'js/config.js',
        'js/lazy-loader.js',
        'js/supabase-init.js',
        'js/navigation.js',
      ]);
    });

    it('updateBottomNav() is defined globally', () => {
      expect(typeof globalThis.updateBottomNav).toBe('function');
    });

    it('sets active class on matching nav item', () => {
      globalThis.updateBottomNav('miPerfilScreen');
      const items = document.querySelectorAll('.bnav-item');
      expect(items[0].classList.contains('active')).toBe(false); // dashboard
      expect(items[2].classList.contains('active')).toBe(true);  // perfil
    });
  });
});
