/**
 * Haptics — WKWebView → Taptic Engine bridge with navigator.vibrate fallback.
 * Loaded in Tier 0 so every other module can call window.Haptics.*.
 *
 * To enable Taptic on iOS, the native wrapper must register a
 * WKScriptMessageHandler named "haptic" that reads { style: string }
 * and maps it to UIImpactFeedbackGenerator / UISelectionFeedbackGenerator /
 * UINotificationFeedbackGenerator. Android wrapper can map the same messages
 * to HapticFeedbackConstants.
 *
 * API:
 *   Haptics.light()     — row tap, toggle flip
 *   Haptics.medium()    — primary button, card open
 *   Haptics.heavy()     — destructive / commit
 *   Haptics.selection() — scrolling through options
 *   Haptics.success()   — form submit ok, correct answer
 *   Haptics.warning()   — validation warning
 *   Haptics.error()     — failed action, wrong answer
 *
 * Any element with [data-haptic] or .btn or .primary auto-fires `light`
 * on pointerdown. Add [data-haptic="success"] for custom style.
 */
(function() {
  'use strict';
  var last = 0;
  var MIN_GAP_MS = 40; // debounce — prevents double-fire on double-tap

  function bridge() {
    try {
      return (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.haptic) || null;
    } catch (e) { return null; }
  }

  function fire(style) {
    var now = Date.now();
    if (now - last < MIN_GAP_MS) return;
    last = now;
    try {
      var b = bridge();
      if (b) { b.postMessage({ style: style || 'light' }); return; }
      if (navigator.vibrate) {
        var ms = 6;
        if (style === 'medium' || style === 'selection') ms = 10;
        else if (style === 'heavy' || style === 'error') ms = 18;
        else if (style === 'success') ms = [6, 40, 6];
        else if (style === 'warning') ms = [10, 50, 10];
        navigator.vibrate(ms);
      }
    } catch (e) {}
  }

  window.Haptics = {
    light:     function() { fire('light'); },
    medium:    function() { fire('medium'); },
    heavy:     function() { fire('heavy'); },
    selection: function() { fire('selection'); },
    success:   function() { fire('success'); },
    warning:   function() { fire('warning'); },
    error:     function() { fire('error'); }
  };

  // Auto-wire: any [data-haptic], .btn, .btn-primary fires light on press.
  // Cards on the dashboard are excluded so the owner's home page behaves exactly as before.
  document.addEventListener('pointerdown', function(ev) {
    var el = ev.target && ev.target.closest && ev.target.closest('[data-haptic], .btn, .btn-primary, .btn-secondary, .back-btn');
    if (!el) return;
    if (el.closest('#dashboardScreen')) return;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    var style = el.getAttribute('data-haptic') || 'light';
    fire(style);
  }, { passive: true, capture: true });
})();
