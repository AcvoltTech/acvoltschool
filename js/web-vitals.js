// Web Vitals — Lightweight LCP, CLS, INP tracking
// Reports to Supabase error endpoint with type 'web-vital'
(function() {
  'use strict';
  var reported = {};

  function report(name, value) {
    if (reported[name]) return;
    reported[name] = true;
    var rating = name === 'LCP' ? (value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor')
               : name === 'CLS' ? (value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor')
               : name === 'INP' ? (value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor')
               : 'unknown';
    console.log('[WebVitals]', name + ':', Math.round(value * 100) / 100, '(' + rating + ')');
    // Report via error tracker endpoint (reuse existing infra)
    if (typeof SUPABASE_URL !== 'undefined' && navigator.onLine) {
      fetch(SUPABASE_URL + '/functions/v1/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'web-vital:' + name,
          stack: '',
          url: window.location.href,
          user_email: localStorage.getItem('tecnico_email') || '',
          user_agent: navigator.userAgent,
          metadata: { type: 'web-vital', metric: name, value: Math.round(value * 100) / 100, rating: rating }
        })
      }).catch(function() {});
    }
  }

  // LCP — Largest Contentful Paint
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      var lcpObs = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        if (entries.length > 0) {
          report('LCP', entries[entries.length - 1].startTime);
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
      // Report LCP on page hide (final value)
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') lcpObs.takeRecords().forEach(function(e) { report('LCP', e.startTime); });
      }, { once: true });
    } catch(e) { console.warn('[WebVitals]', e.message || e); }

    // CLS — Cumulative Layout Shift
    try {
      var clsValue = 0;
      var clsObs = new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        });
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') report('CLS', clsValue);
      }, { once: true });
    } catch(e) { console.warn('[WebVitals]', e.message || e); }

    // INP — Interaction to Next Paint
    try {
      var inpMax = 0;
      var inpObs = new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          if (entry.duration > inpMax) inpMax = entry.duration;
        });
      });
      inpObs.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden' && inpMax > 0) report('INP', inpMax);
      }, { once: true });
    } catch(e) { console.warn('[WebVitals]', e.message || e); }

    // FCP — First Contentful Paint (bonus)
    try {
      var fcpObs = new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          if (entry.name === 'first-contentful-paint') report('FCP', entry.startTime);
        });
      });
      fcpObs.observe({ type: 'paint', buffered: true });
    } catch(e) { console.warn('[WebVitals]', e.message || e); }
  }
})();
