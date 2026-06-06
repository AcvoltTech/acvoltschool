// MaestroLoader — On-demand script & CSS loader
// Tier 3/4 scripts are NOT in index.html; loaded here when needed.
window.MaestroLoader = {
  _loaded: {},
  _loading: {},
  _v: 'v438',

  _bust: function(url) {
    var sep = url.indexOf('?') === -1 ? '?' : '&';
    return url + sep + '_cb=' + this._v;
  },

  load: function(scripts) {
    if (typeof scripts === 'string') scripts = [scripts];
    var self = this;
    var promises = scripts.map(function(src) { return self._loadOne(src); });
    return Promise.all(promises);
  },

  _loadOne: function(src) {
    if (this._loaded[src]) return Promise.resolve();
    if (this._loading[src]) return this._loading[src];
    var self = this;
    this._loading[src] = new Promise(function(resolve) {
      var s = document.createElement('script');
      s.src = self._bust(src);
      s.onload = function() {
        self._loaded[src] = true;
        delete self._loading[src];
        window.dispatchEvent(new CustomEvent('maestro:loaded', { detail: src }));
        resolve();
      };
      s.onerror = function() {
        console.warn('[MaestroLoader] Script tag failed, retrying via fetch:', src);
        // Retry: fetch with no-cache to bypass SW and browser cache, then inject as Blob
        fetch(self._bust(src), { cache: 'no-store' }).then(function(r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          var ct = r.headers.get('content-type') || '';
          if (ct.indexOf('text/html') !== -1) throw new Error('Got HTML instead of JS for ' + src);
          return r.text();
        }).then(function(code) {
          if (code.length > 0 && code.trimStart().charAt(0) === '<') throw new Error('Response is HTML for ' + src);
          var blob = new Blob([code], { type: 'application/javascript' });
          var s2 = document.createElement('script');
          s2.src = URL.createObjectURL(blob);
          s2.onload = function() {
            URL.revokeObjectURL(s2.src);
            self._loaded[src] = true;
            delete self._loading[src];
            window.dispatchEvent(new CustomEvent('maestro:loaded', { detail: src }));
            resolve();
          };
          s2.onerror = function() {
            URL.revokeObjectURL(s2.src);
            delete self._loading[src];
            console.error('[MaestroLoader] Blob fallback also failed:', src);
            if (window.MaestroErrorTracker && window.MaestroErrorTracker.toast) {
              window.MaestroErrorTracker.toast('Error cargando módulo. Verifica tu conexión.');
            }
            resolve();
          };
          document.head.appendChild(s2);
        }).catch(function(e) {
          delete self._loading[src];
          console.error('[MaestroLoader] Fetch fallback failed:', src, e);
          if (window.MaestroErrorTracker && window.MaestroErrorTracker.toast) {
            window.MaestroErrorTracker.toast('Error cargando módulo. Verifica tu conexión.');
          }
          resolve();
        });
      };
      document.head.appendChild(s);
    });
    return this._loading[src];
  },

  loadCSS: function(href) {
    if (this._loaded[href]) return;
    this._loaded[href] = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = this._bust(href);
    l.onerror = function() { this.remove(); };
    document.head.appendChild(l);
  }
};
