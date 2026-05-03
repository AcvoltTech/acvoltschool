if (typeof _addTranslations === 'function') _addTranslations({
  mnav_open_menu: { es: 'Abrir menú', en: 'Open menu' },
});

/**
 * CRM Mobile Navigation
 * Adds a hamburger menu button on screens <= 900px to toggle the sidebar.
 * Uses INLINE STYLES for max reliability on iOS Safari.
 */
(function () {
  'use strict';

  /* ── CSS injected at runtime ─────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent =
    '.crm-mobile-hamburger{' +
      'display:none;background:none;border:none;color:#1a1d21;' +
      'font-size:28px;cursor:pointer;padding:8px 12px;border-radius:8px;' +
      'line-height:1;margin-right:8px;transition:background 0.2s;' +
      '-webkit-tap-highlight-color:transparent;' +
    '}' +
    '.crm-mobile-hamburger:hover{background:#f8f9fb;}' +
    '.crm-sidebar-overlay{' +
      'display:none;position:fixed;top:0;left:0;right:0;bottom:0;' +
      'background:rgba(0,0,0,0.55);z-index:9998;' +
    '}' +
    '.crm-sidebar-overlay.active{display:block;}' +
    '@media(max-width:900px){' +
      '.crm-mobile-hamburger{display:inline-flex;align-items:center;justify-content:center;}' +
    '}' +
    '@media(max-width:1199px) and (max-height:500px) and (orientation:landscape){' +
      '.crm-mobile-hamburger{display:inline-flex !important;align-items:center;justify-content:center;}' +
    '}';
  document.head.appendChild(style);

  /* ── Wait for the DOM to be ready ──────────────────────────── */
  function init() {
    var topbar = document.querySelector('.crm-topbar');
    var sidebar = document.getElementById('crmSidebar');
    if (!topbar || !sidebar) {
      /* Retry once after 500ms in case DOM was not ready */
      setTimeout(function() {
        topbar = document.querySelector('.crm-topbar');
        sidebar = document.getElementById('crmSidebar');
        if (topbar && sidebar) setup(topbar, sidebar);
      }, 500);
      return;
    }
    setup(topbar, sidebar);
  }

  function setup(topbar, sidebar) {
    /* Prevent double-init */
    if (topbar.querySelector('.crm-mobile-hamburger')) return;

    /* Create hamburger button */
    var btn = document.createElement('button');
    btn.className = 'crm-mobile-hamburger';
    btn.setAttribute('aria-label', _t('mnav_open_menu'));
    btn.innerHTML = '&#9776;';
    topbar.insertBefore(btn, topbar.firstChild);

    /* Create overlay — appended to BODY (outside any scroll container) */
    var overlay = document.createElement('div');
    overlay.className = 'crm-sidebar-overlay';
    document.body.appendChild(overlay);

    var isOpen = false;
    var _sidebarOriginalParent = sidebar.parentElement;
    var _sidebarOriginalNext = sidebar.nextSibling;

    /* ── Open: move to body + inline styles for iOS Safari fix ── */
    function openSidebar() {
      isOpen = true;
      // Move sidebar to document.body — fixes iOS Safari bug where
      // position:fixed inside another position:fixed with overflow:hidden
      // blocks scrolling entirely. This has been the recurring iPhone issue.
      if (sidebar.parentElement !== document.body) {
        _sidebarOriginalParent = sidebar.parentElement;
        _sidebarOriginalNext = sidebar.nextSibling;
        document.body.appendChild(sidebar);
      }
      // Use flex layout to preserve sidebar structure (logo + nav + user)
      sidebar.style.cssText =
        'display:flex !important;' +
        'flex-direction:column !important;' +
        'position:fixed !important;' +
        'top:0 !important;left:0 !important;bottom:0 !important;' +
        'width:270px !important;' +
        'height:100vh !important;height:100dvh !important;' +
        'z-index:9999 !important;' +
        'background:#ffffff !important;' +
        'overflow-y:auto !important;' +
        '-webkit-overflow-scrolling:touch !important;' +
        'overscroll-behavior-y:contain !important;' +
        'box-shadow:4px 0 24px rgba(0,0,0,0.25) !important;' +
        'transition:none !important;transform:none !important;' +
        'touch-action:pan-y !important;';
      // Nav section fills available space, scrolls within sidebar
      var navEl = sidebar.querySelector('.crm-sidebar-nav') || sidebar.querySelector('.sidebar-nav');
      if (navEl) {
        navEl.style.cssText = 'flex:1 !important;overflow-y:auto !important;-webkit-overflow-scrolling:touch !important;';
      }
      overlay.classList.add('active');
      btn.innerHTML = '&#10005;';
    }

    /* ── Close: move sidebar back + clear inline styles ── */
    function closeSidebar() {
      isOpen = false;
      sidebar.style.cssText = '';
      var navEl = sidebar.querySelector('.crm-sidebar-nav') || sidebar.querySelector('.sidebar-nav');
      if (navEl) navEl.style.cssText = '';
      sidebar.classList.remove('crm-sidebar-open');
      overlay.classList.remove('active');
      btn.innerHTML = '&#9776;';
      // Move sidebar back to original parent
      if (sidebar.parentElement === document.body && _sidebarOriginalParent) {
        if (_sidebarOriginalNext && _sidebarOriginalNext.parentElement === _sidebarOriginalParent) {
          _sidebarOriginalParent.insertBefore(sidebar, _sidebarOriginalNext);
        } else {
          _sidebarOriginalParent.appendChild(sidebar);
        }
      }
    }

    /* ── Event listeners ─────────────────────────────────────── */
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    overlay.addEventListener('click', closeSidebar);

    /* Close sidebar when a nav item is clicked */
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('.crm-sidebar-item')) {
        closeSidebar();
      }
    });

    /* Close sidebar on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeSidebar();
    });

    /* Close sidebar if window resizes above the breakpoint (except landscape phones) */
    window.addEventListener('resize', function () {
      var isLandscapePhone = window.innerWidth <= 1199 && window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
      if (window.innerWidth > 900 && !isLandscapePhone && isOpen) closeSidebar();
    });
  }

  /* Run init when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
