/**
 * App-wide Sunlight Legibility
 * Injects a single <style id="appLegibilityCss"> that overrides faded inline
 * color and small inline font-size values across every .screen, so HVAC techs
 * can read the UI in direct sunlight.
 *
 * Scoped exclusions:
 *   - .ble-bar-wrap and descendants      (dark-themed BLE bar)
 *   - .htKeepColor and descendants       (semantic color escape hatch)
 *   - inline background:#0f172a / rgba(15,23,42,...) (dark-themed screens)
 *   - .toast, .modal-dark, [class*="dark-theme"]
 *
 * This file is loaded in Tier 1 (after tier0 basics, before feature screens).
 */
(function() {
  'use strict';

  // Faded hex colors used throughout inline styles — each one gets forced to #111.
  var FADED_COLORS = [
    '#4b5563', '#6b7280',
    '#8E8E93', '#8e8e93',
    '#94a3b8', '#64748b', '#9ca3af',
    '#cbd5e1', '#d1d5db', '#e5e7eb',
    '#3C3C43', '#3c3c43',
    '#111827',
    '#1C1C1E', '#1c1c1e',
    '#475569', '#374151', '#334155',
    '#60a5fa', '#93c5fd', '#c084fc', '#d8b4fe',
    '#a1a1aa', '#a3a3a3',
    '#AEAEB2', '#aeaeb2'
  ];

  // Exclusion chain — applied to every selector that targets inline-styled elements.
  // Keeps dark-themed regions and opt-out classes untouched.
  var EX = [
    ':not(.ble-bar-wrap)',
    ':not(.ble-bar-wrap *)',
    ':not(.htKeepColor)',
    ':not(.htKeepColor *)',
    ':not(.toast)',
    ':not(.toast *)',
    ':not(.modal-dark)',
    ':not(.modal-dark *)',
    ':not([class*="dark-theme"])',
    ':not([class*="dark-theme"] *)',
    // Known dark-themed screens — their designs rely on light text on dark bg.
    ':not(#hvacFeedScreen)',
    ':not(#hvacFeedScreen *)',
    ':not(#hvacFeedFrame)',
    ':not(#hvacFeedFrame *)',
    ':not(#desafioScreen)',
    ':not(#desafioScreen *)',
    ':not(#desafioQuizScreen)',
    ':not(#desafioQuizScreen *)',
    ':not([style*="background:#0f172a"])',
    ':not([style*="background: #0f172a"])',
    ':not([style*="background:#0f172a"] *)',
    ':not([style*="background: #0f172a"] *)',
    ':not([style*="background:#040d1a"])',
    ':not([style*="background: #040d1a"])',
    ':not([style*="background:#040d1a"] *)',
    ':not([style*="background: #040d1a"] *)',
    ':not([style*="rgba(15,23,42"])',
    ':not([style*="rgba(15, 23, 42"])',
    ':not([style*="rgba(15,23,42"] *)',
    ':not([style*="rgba(15, 23, 42"] *)'
  ].join('');

  function sel(inner) {
    // body-wide scope so every .screen is covered, with exclusions appended.
    return 'body ' + inner + EX;
  }

  function buildCss() {
    // The app is dark-themed now (.app-inner background:#040d1a). Forcing text
    // to #111 creates dark-on-dark across every screen. Source files already
    // use high-contrast colors on their own backgrounds — we only enforce a
    // minimum font-size floor for sunlight readability. Color overrides removed.
    var fontRules = '';
    for (var fs = 7; fs <= 12; fs++) {
      fontRules += sel('[style*="font-size:' + fs + 'px"]') + ',' +
                   sel('[style*="font-size: ' + fs + 'px"]') +
                   '{font-size:13px !important;}';
    }
    var tableRules = 'body table:not(.ble-bar-wrap table):not(.htKeepColor table)' +
                     '{font-size:14px !important;}';
    return fontRules + tableRules;
  }

  function _ensureAppLegibility() {
    try {
      if (!document || !document.head) return;
      if (document.getElementById('appLegibilityCss')) return;
      var style = document.createElement('style');
      style.id = 'appLegibilityCss';
      style.textContent = buildCss();
      document.head.appendChild(style);
    } catch (_e) { /* no-op: legibility is best-effort */ }
  }

  window._ensureAppLegibility = _ensureAppLegibility;

  // Run as soon as <head> exists. If the script somehow loads before DOM is ready,
  // defer to DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _ensureAppLegibility, { once: true });
  } else {
    _ensureAppLegibility();
  }
})();
