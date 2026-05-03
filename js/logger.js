// ============================================
// PRODUCTION LOGGER — Suppress console noise in production
// ============================================
// Wraps console.log/warn/error. In production (GitHub Pages),
// only errors are shown. In dev (localhost), everything passes through.
(function() {
  'use strict';

  var isDev = /localhost|127\.0\.0\.1|\.local/.test(window.location.hostname);
  var _log = console.log.bind(console);
  var _warn = console.warn.bind(console);
  var _error = console.error.bind(console);

  // Production logger — suppresses log/warn, keeps error
  window.MaestroLog = {
    log: isDev ? _log : function() {},
    warn: isDev ? _warn : function() {},
    error: _error, // always show errors
    debug: isDev ? _log : function() {},
    isDev: isDev
  };

  // In production, suppress console.log and console.warn
  if (!isDev) {
    console.log = function() {};
    console.warn = function() {};
    // console.error is always kept
  }
})();
