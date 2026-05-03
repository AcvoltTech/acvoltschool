// ============================================
// EARLY INIT — Offline detection + delegated event listeners
// Extracted from inline <script> for CSP compliance
// ============================================

// Global offline/online detection
(function(){
  function showOffline() { document.getElementById('offlineBanner').style.display = 'block'; }
  function hideOffline() { document.getElementById('offlineBanner').style.display = 'none'; }
  window.addEventListener('offline', showOffline);
  window.addEventListener('online', function() { hideOffline(); });
  if (!navigator.onLine) showOffline();
  // Check if Supabase loaded
  setTimeout(function() {
    if (!window.supabase) {
      document.getElementById('supabaseFailBanner').style.display = 'block';
      console.error('[MaestroAC] Supabase library failed to load!');
    }
  }, 5000);
})();

// Service Worker registration — required for Web Push (VIP live-class alerts).
// Skip on iOS WKWebView native shell; that path needs APNs instead of Web Push.
(function(){
  if (!('serviceWorker' in navigator)) return;
  var _isIOSNative = !!(window.webkit && window.webkit.messageHandlers);
  if (_isIOSNative) return;
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      console.log('[SW] registered', reg.scope);
    }).catch(function(e) { console.warn('[SW] register failed:', e && e.message); });
  });
})();

// Password visibility toggle — delegated (replaces inline onclick)
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.pass-toggle-btn');
  if (!btn) return;
  var targetId = btn.getAttribute('data-target');
  if (targetId && typeof _togglePassVis === 'function') _togglePassVis(targetId, btn);
});

// Keyboard accessibility — make all data-nav elements focusable and keyboard-operable
document.addEventListener('DOMContentLoaded', function() {
  var navEls = document.querySelectorAll('[data-nav]:not(a):not(button)');
  for (var i = 0; i < navEls.length; i++) {
    if (!navEls[i].hasAttribute('tabindex')) navEls[i].setAttribute('tabindex', '0');
    if (!navEls[i].hasAttribute('role')) navEls[i].setAttribute('role', 'button');
  }
});

// Keyboard activation for data-nav elements (Enter/Space)
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  var el = e.target.closest('[data-nav]');
  if (!el) return;
  e.preventDefault();
  el.click();
});

// window.goBack — pops one level off the navigation stack maintained by
// showScreen(). Back buttons call this instead of the hardcoded data-nav
// target, so the user returns to the *previous bubble* instead of being
// dumped on the dashboard.
window.goBack = function() {
  try {
    var stack = window._navStack || ['dashboardScreen'];
    if (stack.length > 1) {
      var target = stack[stack.length - 2];
      if (typeof showScreen === 'function') { showScreen(target); return; }
    }
  } catch (e) {}
  if (typeof showScreen === 'function') showScreen('dashboardScreen');
};

// Detect "back" buttons: class-based or data-back="true".
function _isBackButton(el) {
  if (!el) return false;
  if (el.hasAttribute('data-back')) return true;
  var cn = (el.className && typeof el.className === 'string') ? el.className : '';
  if (/\b(btn-nav-back|back-btn|back-home-btn|btn-back)\b/.test(cn)) return true;
  return false;
}

// Navigation — delegated listener for data-nav attributes.
// Back buttons (detected above) use goBack() → previous bubble.
// Regular buttons go to their explicit data-nav target.
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-nav]');
  if (!el) return;
  if (el.hasAttribute('data-stop')) e.stopPropagation();
  var screen = el.getAttribute('data-nav');
  if (typeof showScreen !== 'function') return;
  e.preventDefault();
  if (_isBackButton(el)) {
    window.goBack();
  } else {
    showScreen(screen);
  }
  if (el.hasAttribute('data-vod') && typeof lsSwitchTab === 'function') {
    setTimeout(function(){ lsSwitchTab('vod'); }, 300);
  }
});
