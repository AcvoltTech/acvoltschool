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

    // 🔴 RAÍZ (10-sep-2026): supabase-js NO LANZA. Un insert rechazado (RLS, columna
    // inexistente, 400) regresa {data:null, error:{...}} y se resuelve normal, así que
    // este `catch` era CÓDIGO MUERTO: nunca corrió, y el re-encolado de abajo tampoco.
    // Cada lote fallido se perdía en silencio — y estos son los eventos con los que se
    // mide el DAU (`analytics_events` con event='session_start'). Un día entero de uso
    // real podía desaparecer del tablero sin una sola línea en consola.
    // 🪤 Las columnas REALES de la tabla son: event, screen, user_email, metadata,
    // session_id, created_at. NO existe `event_name` ni `user_id`: si alguien renombra
    // un campo aquí, PostgREST devuelve 400 y —antes de este arreglo— el app seguía
    // tan campante reportando cero problemas.
    var res = null;
    try {
      res = await supabaseClient.from('analytics_events').insert(batch);
    } catch (e) {
      // Solo cae aquí por un fallo de red duro (fetch abortado / sin conexión).
      res = { error: { message: (e && e.message) || 'fallo de red' } };
    }

    if (res && res.error) {
      console.warn('[Analytics] lote de ' + batch.length + ' eventos RECHAZADO: ' +
                   (res.error.message || 'error desconocido') + ' — se reintenta en el próximo flush', res.error);
      // Re-encolar (se descarta solo si la cola ya creció demasiado).
      if (_queue.length < 200) _queue = batch.concat(_queue);
    }

    _flushing = false;
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
