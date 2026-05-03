/* ===================================================================
   Analytics Tracker — lightweight event tracking for admin analytics
   Tracks: screen views, session start/end, feature usage
   Data stored in analytics_events table via Supabase
   =================================================================== */

var MaestroAnalytics = (function() {
  'use strict';

  var _sessionId = null;
  var _queue = [];
  var _flushing = false;
  var _flushTimer = null;
  var FLUSH_INTERVAL = 30000; // flush every 30s
  var BATCH_SIZE = 20;

  function _getEmail() {
    if (typeof AuthManager !== 'undefined' && AuthManager.getEmail) return AuthManager.getEmail();
    return localStorage.getItem('tecnico_email') || null;
  }

  function _initSession() {
    _sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    _track('session_start', null);
  }

  function _track(event, screen, meta) {
    _queue.push({
      event: event,
      screen: screen || null,
      user_email: _getEmail(),
      metadata: meta || {},
      session_id: _sessionId,
      created_at: new Date().toISOString()
    });

    // Auto-flush when batch is full
    if (_queue.length >= BATCH_SIZE) _flush();
  }

  async function _flush() {
    if (_flushing || _queue.length === 0) return;
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

    _flushing = true;
    var batch = _queue.splice(0, BATCH_SIZE);

    try {
      await supabaseClient.from('analytics_events').insert(batch);
    } catch (e) {
      // Re-queue on failure (drop if queue is too large)
      if (_queue.length < 200) {
        _queue = batch.concat(_queue);
      }
    } finally {
      _flushing = false;
    }
  }

  function _startFlushTimer() {
    if (_flushTimer) return;
    _flushTimer = setInterval(_flush, FLUSH_INTERVAL);
  }

  // Flush on page hide (tab close, navigation away)
  function _onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      _track('session_pause', null);
      _flush();
    } else if (document.visibilityState === 'visible') {
      _track('session_resume', null);
    }
  }

  // Init
  function init() {
    _initSession();
    _startFlushTimer();
    document.addEventListener('visibilitychange', _onVisibilityChange);
  }

  return {
    init: init,
    trackScreen: function(screenId) { _track('screen_view', screenId); },
    trackFeature: function(feature, meta) { _track('feature_use', null, Object.assign({ feature: feature }, meta || {})); },
    flush: _flush
  };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { MaestroAnalytics.init(); });
} else {
  MaestroAnalytics.init();
}
