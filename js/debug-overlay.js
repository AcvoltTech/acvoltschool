/**
 * Maestro Debug Overlay — on-screen error reporter for iOS WKWebView testing
 *
 * Captures JS errors, unhandled promise rejections, console.error, and fetch
 * failures. Renders them in a floating red/gold card pinned bottom-right so
 * Mario can screenshot whatever broke on whichever modal is open.
 *
 * Activation gate: only in iOS native WKWebView (detected via
 * window.webkit.messageHandlers). Does NOT run in Safari mobile or desktop
 * browsers — keeps the public site clean.
 *
 * Manual API (for testing from Safari devtools attached to WKWebView):
 *   MaestroDbg.log("hello")   — add a manual entry
 *   MaestroDbg.clear()        — wipe all errors
 *   MaestroDbg.list()         — return captured errors
 *   MaestroDbg.force()        — force-enable even outside WKWebView
 */
(function() {
  'use strict';

  var FORCE_KEY = '_maestro_dbg_force';

  // ─── HARD KILL on production hostnames ─────────────────────────────────
  // Real students were seeing the overlay over the login button (legacy
  // FORCE_KEY = '1' from older debug sessions). Even if forced, never run
  // on prod. Auto-clear the flag so it doesn't keep haunting devices that
  // had it set. Allow only on local + Cloudflare preview builds.
  var PROD_HOSTS = [
    'acvoltschool.com', 'www.acvoltschool.com',
    'maestrohvacr.com', 'www.maestrohvacr.com',
  ];
  if (PROD_HOSTS.indexOf(window.location.hostname) >= 0) {
    try { localStorage.removeItem(FORCE_KEY); } catch (_e) {}
    return;
  }

  var isWKWebView = !!(window.webkit && window.webkit.messageHandlers);
  var forced = false;
  try { forced = localStorage.getItem(FORCE_KEY) === '1'; } catch (_e) {}
  if (!isWKWebView && !forced) {
    // Still expose force() so a dev can flip it from the console.
    window.MaestroDbg = {
      force: function() {
        try { localStorage.setItem(FORCE_KEY, '1'); } catch (_e) {}
        location.reload();
      }
    };
    return;
  }

  var MAX_ERRORS = 25;
  var errors = [];
  var panel = null;
  var expanded = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function currentScreen() {
    // Priority: visible modal > active .screen > active .app-frame
    var modal = document.querySelector('.modal-backdrop:not([style*="display:none"]):not([style*="display: none"]), [role="dialog"]:not([hidden])');
    if (modal && modal.offsetParent !== null) return '#' + (modal.id || 'modal') + ' (modal)';
    var frame = document.querySelector('.app-frame[style*="display:flex"], .app-frame[style*="display: flex"], .app-frame:not([style*="display:none"]):not([style*="display: none"])');
    var frameId = frame ? frame.id : '';
    var sel = frameId ? '.screen.active, #' + frameId + ' .screen:not([style*="display:none"])' : '.screen.active';
    var screen = document.querySelector(sel);
    var screenId = screen ? screen.id : '';
    if (screenId) return '#' + screenId + (frameId ? ' in #' + frameId : '');
    if (frameId) return '#' + frameId;
    return '(ninguna)';
  }

  function addError(kind, msg, src, line) {
    var entry = {
      t: new Date().toLocaleTimeString('es-MX', { hour12: false }),
      screen: currentScreen(),
      kind: kind,
      msg: String(msg || '').slice(0, 400),
      src: src ? String(src).split('/').pop() : '',
      line: line || ''
    };
    errors.unshift(entry);
    if (errors.length > MAX_ERRORS) errors.pop();
    render();
  }

  function ensurePanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.id = 'maestroDebugOverlay';
    panel.style.cssText = [
      'position:fixed',
      'right:10px',
      'bottom:84px',
      'z-index:2147483647',
      'max-width:320px',
      'max-height:65vh',
      'overflow-y:auto',
      'background:#CC0000',
      'color:#FFFFFF',
      'border:2px solid #FFD700',
      'border-radius:12px',
      'padding:10px 12px',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-size:13px',
      'font-weight:700',
      'line-height:1.35',
      'box-shadow:0 6px 20px rgba(204,0,0,0.65),0 0 0 1px rgba(0,0,0,0.35)',
      'cursor:pointer',
      'display:none',
      '-webkit-user-select:text',
      'user-select:text'
    ].join(';');
    panel.addEventListener('click', function(ev) {
      ev.stopPropagation();
      var t = ev.target;
      if (t && t.getAttribute && t.getAttribute('data-dbg-action') === 'clear') {
        errors = []; expanded = false; render();
        return;
      }
      expanded = !expanded;
      render();
    });
    document.body.appendChild(panel);
  }

  function render() {
    ensurePanel();
    if (errors.length === 0) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    if (!expanded) {
      var top = errors[0];
      panel.innerHTML =
        '<div style="font-size:11px;font-weight:800;letter-spacing:0.4px;text-transform:uppercase;color:#FFD700;margin-bottom:4px;">' +
          '\u26A0 ' + errors.length + ' ERROR' + (errors.length > 1 ? 'ES' : '') + ' \u00B7 ' + esc(top.screen) +
        '</div>' +
        '<div style="color:#FFFFFF;font-size:13px;font-weight:700;">' + esc(top.msg) + '</div>' +
        (top.src ? '<div style="font-size:10px;color:#FFD700;margin-top:4px;">' + esc(top.src) + ':' + esc(top.line) + '</div>' : '') +
        '<div style="font-size:10px;color:#FFE082;margin-top:6px;font-weight:600;">Toca para ver los ' + errors.length + ' errores</div>';
    } else {
      var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
        '<span style="font-size:11px;font-weight:800;letter-spacing:0.4px;text-transform:uppercase;color:#FFD700;">\u26A0 ' + errors.length + ' errores</span>' +
        '<span data-dbg-action="clear" style="background:#FFFFFF;color:#CC0000;padding:3px 10px;border-radius:12px;font-size:10px;font-weight:800;text-transform:uppercase;">Limpiar</span>' +
        '</div>';
      errors.forEach(function(e) {
        html += '<div style="background:rgba(0,0,0,0.30);padding:6px 8px;border-radius:7px;margin-bottom:5px;font-size:12px;font-weight:600;color:#FFFFFF;">' +
          '<div style="font-size:10px;color:#FFD700;font-weight:800;">' + esc(e.t) + ' \u00B7 ' + esc(e.kind) + ' \u00B7 ' + esc(e.screen) + '</div>' +
          '<div style="margin-top:2px;">' + esc(e.msg) + '</div>';
        if (e.src) html += '<div style="font-size:10px;color:#FFE082;margin-top:2px;">' + esc(e.src) + ':' + esc(e.line) + '</div>';
        html += '</div>';
      });
      panel.innerHTML = html;
    }
  }

  window.addEventListener('error', function(ev) {
    if (ev.message) addError('JS', ev.message, ev.filename, ev.lineno);
  });

  window.addEventListener('unhandledrejection', function(ev) {
    var r = ev.reason;
    var msg = (r && (r.message || (typeof r === 'string' ? r : ''))) || 'Promise rejection';
    addError('Promise', msg, '', '');
  });

  var origErr = console.error;
  console.error = function() {
    try {
      var parts = [];
      for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (a instanceof Error) parts.push(a.message);
        else if (a && typeof a === 'object') {
          try { parts.push(JSON.stringify(a).slice(0, 200)); } catch (_e2) { parts.push('[obj]'); }
        } else parts.push(String(a));
      }
      addError('console', parts.join(' '), '', '');
    } catch (_e) {}
    return origErr.apply(console, arguments);
  };

  var origFetch = window.fetch;
  if (origFetch) {
    window.fetch = function(url, opts) {
      var label = typeof url === 'string' ? url : (url && url.url) || '';
      return origFetch.apply(this, arguments).then(function(r) {
        if (!r.ok) addError('HTTP ' + r.status, r.statusText + ' \u2190 ' + label.slice(0, 120), '', '');
        return r;
      }).catch(function(err) {
        addError('Fetch', ((err && err.message) || 'network error') + ' \u2190 ' + label.slice(0, 120), '', '');
        throw err;
      });
    };
  }

  window.MaestroDbg = {
    log: function(msg) { addError('manual', msg, '', ''); },
    clear: function() { errors = []; expanded = false; render(); },
    list: function() { return errors.slice(); },
    force: function() {
      try { localStorage.setItem(FORCE_KEY, '1'); } catch (_e) {}
      location.reload();
    },
    unforce: function() {
      try { localStorage.removeItem(FORCE_KEY); } catch (_e) {}
      location.reload();
    }
  };

  // Heartbeat: fire one info entry on load so Mario can confirm the overlay
  // is alive even when no real JS error occurred. Tap "Limpiar" to dismiss.
  setTimeout(function() {
    var v = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '?';
    addError('info', 'Debug overlay activo (' + v + ') — toca para expandir', '', '');
  }, 500);
})();
