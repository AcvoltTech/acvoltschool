// ============================================
// ERROR TRACKING — Global error capture + reporting
// ============================================
(function() {
  'use strict';

  var MAX_ERRORS_PER_SESSION = 50;
  var QUEUE_KEY = 'maestroac_error_queue';
  var errorCount = 0;
  var endpoint = null; // Set after config.js loads
  var _backoffMs = 1000; // exponential backoff starting at 1s
  var _lastSendTime = 0;
  var _rateLimitWindow = 2000; // min ms between sends

  function getEndpoint() {
    if (endpoint) return endpoint;
    // SUPABASE_URL is defined in config.js which loads after this file
    if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) {
      endpoint = SUPABASE_URL + '/functions/v1/log-error';
    }
    return endpoint;
  }

  function getUserEmail() {
    try {
      if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) return currentUser.email;
      return localStorage.getItem('tecnico_email') || '';
    } catch(e) { return ''; }
  }

  function sendError(errorData) {
    if (errorCount >= MAX_ERRORS_PER_SESSION) return;
    errorCount++;

    var payload = {
      message: errorData.message || 'Unknown error',
      stack: errorData.stack || '',
      url: errorData.url || window.location.href,
      user_email: errorData.user_email || getUserEmail(),
      user_agent: navigator.userAgent,
      metadata: errorData.metadata || {}
    };

    var ep = getEndpoint();
    if (!ep || !navigator.onLine) {
      queueError(payload);
      return;
    }

    // Rate limiting — don't flood the endpoint
    var now = Date.now();
    if (now - _lastSendTime < _rateLimitWindow) {
      queueError(payload);
      return;
    }
    _lastSendTime = now;

    fetch(ep, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function(res) {
      if (res.ok) { _backoffMs = 1000; } // reset on success
      else { _scheduleRetry(payload); }
    }).catch(function() {
      _scheduleRetry(payload);
    });
  }

  function _scheduleRetry(payload) {
    _backoffMs = Math.min(_backoffMs * 2, 60000); // max 60s
    setTimeout(function() {
      var ep = getEndpoint();
      if (ep && navigator.onLine) {
        fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(function() { queueError(payload); });
      } else {
        queueError(payload);
      }
    }, _backoffMs);
  }

  function queueError(payload) {
    try {
      var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      if (queue.length >= MAX_ERRORS_PER_SESSION) return;
      queue.push(payload);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch(e) { /* localStorage full or unavailable */ }
  }

  function flushQueue() {
    var ep = getEndpoint();
    if (!ep) return;
    try {
      var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      if (queue.length === 0) return;
      localStorage.removeItem(QUEUE_KEY);
      queue.forEach(function(payload) {
        fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(function() { /* silently drop on flush failure */ });
      });
    } catch(e) { /* ignore */ }
  }

  // Known harmless errors to ignore (Supabase internals, SW lifecycle)
  var _ignorePatterns = [
    'Lock was stolen',
    'Failed to update a ServiceWorker',
    'Failed to execute \'subscribe\' on \'PushManager\'',
    'The operation was aborted',
    'Previous session ended without clean close',
    'Main thread blocked for'
  ];

  function _isIgnored(msg) {
    if (!msg) return false;
    for (var i = 0; i < _ignorePatterns.length; i++) {
      if (msg.indexOf(_ignorePatterns[i]) !== -1) return true;
    }
    return false;
  }

  // Global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    var msg = String(message);
    if (_isIgnored(msg)) return;
    sendError({
      message: msg,
      stack: error && error.stack ? error.stack : (source + ':' + lineno + ':' + colno),
      url: source || window.location.href,
      metadata: { type: 'onerror', lineno: lineno, colno: colno }
    });
  };

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(event) {
    var reason = event.reason;
    var msg = reason && reason.message ? reason.message : String(reason);
    if (_isIgnored(msg)) return;
    sendError({
      message: msg,
      stack: reason && reason.stack ? reason.stack : '',
      metadata: { type: 'unhandledrejection' }
    });
  });

  // Flush queued errors when back online
  window.addEventListener('online', flushQueue);

  // Flush on load (in case errors were queued while offline)
  if (document.readyState === 'complete') {
    setTimeout(flushQueue, 3000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(flushQueue, 3000);
    });
  }

  // ========== USER-FACING ERROR TOAST ==========
  var _toastContainer = null;
  var _toastTimer = null;

  function showErrorToast(msg, duration) {
    if (!_toastContainer) {
      _toastContainer = document.createElement('div');
      _toastContainer.id = 'maestroErrorToast';
      _toastContainer.setAttribute('role', 'alert');
      _toastContainer.setAttribute('aria-live', 'assertive');
      _toastContainer.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:99999;max-width:90%;pointer-events:none;display:flex;flex-direction:column;gap:8px;align-items:center;';
      document.body.appendChild(_toastContainer);
    }
    var toast = document.createElement('div');
    toast.style.cssText = 'background:#FFFFFF;color:#0F0F0F;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);border:1px solid #E7E5DE;border-left:4px solid #DC2626;pointer-events:auto;opacity:0;transition:opacity 0.3s;max-width:360px;text-align:center;';
    toast.textContent = msg || (typeof _t === 'function' ? _t('error_something_wrong', 'Algo salió mal. Intenta de nuevo.') : 'Algo salió mal. Intenta de nuevo.');
    _toastContainer.appendChild(toast);
    requestAnimationFrame(function() { toast.style.opacity = '1'; });
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
    }, duration || 4000);
  }

  // Expose for manual error reporting + toast
  window.MaestroErrorTracker = { sendError: sendError, toast: showErrorToast };
})();
