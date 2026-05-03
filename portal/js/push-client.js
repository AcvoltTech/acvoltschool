// push-client.js — listens for Service Worker push notifications while the
// app is in the foreground, plays a loud attention tone using Web Audio (no
// external MP3 needed), and shows a big in-app banner. Required because:
//   - The OS notification sound is limited/silent in many browsers.
//   - When the tab is focused, some OSes skip the notification entirely.
// Paired with /sw.js (push + notificationclick handlers post to us).

(function(){
  'use strict';

  // Respect user mute preference (admin dashboard can toggle this)
  function _soundMuted() { return localStorage.getItem('maestro_push_muted') === 'true'; }

  // Synthesize a loud 3-beep attention tone via Web Audio API.
  // No sound file shipped — tone is built from oscillators on demand.
  function _playAlertTone() {
    if (_soundMuted()) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      // Resume in case it starts suspended (mobile browsers)
      if (ctx.state === 'suspended' && ctx.resume) { ctx.resume().catch(function(){}); }

      function beep(freq, startAt, durSec) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
        // Quick attack / release so the beep is crisp
        gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
        gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + startAt + 0.02);
        gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + startAt + durSec);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + startAt);
        osc.stop(ctx.currentTime + startAt + durSec + 0.05);
      }

      // 3 ascending beeps (880 → 1175 → 1568 Hz), 180ms each, 80ms gaps.
      beep(880,  0.00, 0.18);
      beep(1175, 0.28, 0.18);
      beep(1568, 0.56, 0.30);

      // Stop context after the tone finishes so we don't keep audio session open.
      setTimeout(function() { try { ctx.close(); } catch(_e) {} }, 1200);
    } catch (_e) { console.warn('[Push] tone play failed:', _e && _e.message); }
  }

  // Also try vibration in case tone is muted (Android + some iOS PWA)
  function _vibrate() {
    try { if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 600]); } catch (_e) {}
  }

  // In-app big banner shown when push arrives while app is open.
  // Big enough to be unmissable, dismissable with tap, links to the URL in payload.
  function _showBigBanner(payload) {
    try {
      var existing = document.getElementById('maestroPushBanner');
      if (existing) existing.remove();

      var banner = document.createElement('div');
      banner.id = 'maestroPushBanner';
      banner.setAttribute('role', 'alert');
      banner.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:100000',
        'background:linear-gradient(135deg,#dc2626 0%,#ef4444 60%,#f87171 100%)',
        'color:#fff', 'padding:16px 18px', 'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
        'font-family:\'Inter\',sans-serif', 'animation:maestroPushSlide 0.35s ease-out',
        'display:flex', 'align-items:center', 'gap:12px',
        'cursor:pointer', '-webkit-tap-highlight-color:transparent'
      ].join(';');
      banner.innerHTML = [
        '<div style="font-size:32px;line-height:1;">🔴</div>',
        '<div style="flex:1;min-width:0;">',
          '<div style="font-size:16px;font-weight:900;letter-spacing:0.3px;margin-bottom:2px;">',
            (payload && payload.title ? _escape(payload.title) : '¡Clase EN VIVO!'),
          '</div>',
          '<div style="font-size:13px;font-weight:500;opacity:0.95;line-height:1.35;">',
            (payload && payload.body ? _escape(payload.body) : 'Maestro Mario está transmitiendo ahora'),
          '</div>',
        '</div>',
        '<button aria-label="Cerrar" id="maestroPushBannerX" style="background:rgba(0,0,0,0.25);border:none;color:#fff;width:32px;height:32px;border-radius:16px;font-size:18px;cursor:pointer;flex-shrink:0;">×</button>'
      ].join('');

      // Inject animation keyframes once
      if (!document.getElementById('maestroPushStyle')) {
        var style = document.createElement('style');
        style.id = 'maestroPushStyle';
        style.textContent = '@keyframes maestroPushSlide{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}';
        document.head.appendChild(style);
      }

      document.body.appendChild(banner);

      // Dismiss on X click — stopPropagation so it doesn't also navigate.
      var xBtn = banner.querySelector('#maestroPushBannerX');
      if (xBtn) xBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        banner.remove();
      });

      // Body click navigates to the stream URL in payload (if any).
      banner.addEventListener('click', function() {
        var target = payload && payload.url;
        if (target && target !== window.location.pathname + window.location.hash) {
          try { window.location.href = target; } catch (_e) {}
        }
        banner.remove();
      });

      // Auto-dismiss after 30s so the banner doesn't linger forever.
      setTimeout(function() { try { banner.remove(); } catch(_e) {} }, 30000);
    } catch (_e) { console.warn('[Push] banner render failed:', _e && _e.message); }
  }

  function _escape(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Wire up: listen for SW postMessage and run loud alert
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function(event) {
      var d = event && event.data;
      if (!d || !d.type) return;
      if (d.type === 'MAESTRO_PUSH') {
        _playAlertTone();
        _vibrate();
        _showBigBanner(d.payload || {});
      } else if (d.type === 'MAESTRO_NOTIFICATION_CLICK') {
        // User tapped notification from system tray — focus and navigate.
        if (d.url) { try { window.location.href = d.url; } catch (_e) {} }
      }
    });
  }

  // Expose small admin helpers
  window.MaestroPushClient = {
    playAlertTone: _playAlertTone,
    showBigBanner: _showBigBanner,
    setMuted: function(muted) { localStorage.setItem('maestro_push_muted', muted ? 'true' : 'false'); },
    isMuted: _soundMuted
  };
})();
