// Maestro HVACR Service Worker — v7.0 push handler
// No caching (avoids the "Service Worker context closed" crash from v6.81).
// Purpose: receive Web Push events and show high-priority notifications.

self.addEventListener('install', function(event) { self.skipWaiting(); });

self.addEventListener('activate', function(event) {
  // Clear any legacy caches left behind by older SW versions, then take control.
  event.waitUntil(
    caches.keys()
      .then(function(keys) { return Promise.all(keys.map(function(k) { return caches.delete(k); })); })
      .then(function() { return self.clients.claim(); })
      .catch(function() {})
  );
});

// No fetch handler — browser handles all network directly.

self.addEventListener('message', function(event) {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// ============================================================
// PUSH — receive server push and show a high-priority notification.
// Payload shape (from send-push-notification Edge Function):
//   { title, body, url, tag, icon, badge, sound, vibrate, requireInteraction }
// VIP live-class alerts should set requireInteraction=true so the banner
// stays until the user taps it, and sound to a short loud clip URL.
// ============================================================
self.addEventListener('push', function(event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_e) {
    try { data = { title: 'Maestro HVACR', body: event.data ? event.data.text() : '' }; } catch (__e) {}
  }

  var title = data.title || '🔴 Maestro HVACR';
  var options = {
    body: data.body || '',
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    image: data.image || undefined,
    tag: data.tag || 'maestro-push',
    renotify: true,
    requireInteraction: data.requireInteraction !== false, // default TRUE for VIP alerts
    vibrate: data.vibrate || [300, 100, 300, 100, 600],
    timestamp: Date.now(),
    data: {
      url: data.url || '/',
      sound: data.sound || null,
      type: data.type || 'generic'
    }
  };

  // When the app happens to be open, also post a message so the client can
  // play an in-tab loud sound + show the big banner (the notification on its
  // own uses the OS sound, which is quieter and not customizable on most browsers).
  var notify = self.registration.showNotification(title, options);
  var fanout = self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then(function(clients) {
      clients.forEach(function(c) {
        try { c.postMessage({ type: 'MAESTRO_PUSH', payload: data }); } catch (_e) {}
      });
    });

  event.waitUntil(Promise.all([notify, fanout]));
});

// Clicking the notification focuses or opens the target URL.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clients) {
        for (var i = 0; i < clients.length; i++) {
          var c = clients[i];
          if (c.url && c.focus) {
            try { c.postMessage({ type: 'MAESTRO_NOTIFICATION_CLICK', url: url }); } catch (_e) {}
            c.focus();
            if ('navigate' in c) { try { c.navigate(url); } catch (_e) {} }
            return;
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      })
  );
});
