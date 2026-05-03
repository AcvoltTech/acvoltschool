// ============================================
// AUDIT LOG — Track admin actions
// ============================================
(function() {
  'use strict';

  var QUEUE_KEY = 'maestroac_audit_queue';

  function getActorEmail() {
    try {
      if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) return currentUser.email;
      return localStorage.getItem('tecnico_email') || 'unknown';
    } catch(e) { return 'unknown'; }
  }

  function auditLog(action, details) {
    var entry = {
      actor_email: getActorEmail(),
      action: action,
      details: details || {}
    };

    // Try to insert directly via supabaseClient
    if (typeof supabaseClient !== 'undefined' && supabaseClient && navigator.onLine) {
      supabaseClient.from('audit_log').insert(entry).then(function(result) {
        if (result.error) {
          console.warn('[AuditLog] Insert failed, queuing:', result.error.message);
          queueEntry(entry);
        }
      }).catch(function() {
        queueEntry(entry);
      });
    } else {
      queueEntry(entry);
    }
  }

  function queueEntry(entry) {
    try {
      var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      if (queue.length >= 200) queue.shift(); // Keep max 200 queued
      queue.push(entry);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch(e) { /* localStorage full */ }
  }

  function flushQueue() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient || !navigator.onLine) return;
    try {
      var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      if (queue.length === 0) return;
      // Insert all queued entries
      supabaseClient.from('audit_log').insert(queue).then(function(result) {
        if (result.error) {
          console.warn('[AuditLog] Flush failed:', result.error.message);
        } else {
          localStorage.removeItem(QUEUE_KEY);
        }
      }).catch(function() { /* silently drop */ });
    } catch(e) { /* ignore */ }
  }

  // Flush when online
  window.addEventListener('online', flushQueue);
  window.addEventListener('load', function() {
    setTimeout(flushQueue, 5000);
  });

  // Expose globally
  window.auditLog = auditLog;
})();
