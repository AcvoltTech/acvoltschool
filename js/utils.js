// Error handlers removed — error-tracking.js provides full error capture + Supabase reporting.
// This file previously overwrote the error-tracking.js handlers, breaking error reporting.

/**
 * window.showToast(msg, kind)
 * Premium iOS-style toast: bottom pill, blur, spring entry, swipe-down-to-dismiss,
 * auto-close ~3.2s. Fires Haptics.success/error/warning/light in sync.
 *   kind: 'info' (default) | 'success' | 'error' | 'warning'
 */
(function() {
  'use strict';
  var WRAP_ID = 'mxToastWrap';
  var DURATION_MS = 3200;

  function ensureWrap() {
    var w = document.getElementById(WRAP_ID);
    if (w) return w;
    w = document.createElement('div');
    w.id = WRAP_ID;
    w.className = 'mx-toast-wrap';
    document.body.appendChild(w);
    return w;
  }

  function iconFor(kind) {
    if (kind === 'success') return '✅';
    if (kind === 'error')   return '⚠️';
    if (kind === 'warning') return '⚠️';
    return 'ℹ️';
  }

  window.showToast = function(msg, kind) {
    try {
      var k = (typeof kind === 'string' && /^(success|error|warning|info)$/.test(kind)) ? kind : 'info';
      var wrap = ensureWrap();
      var t = document.createElement('div');
      t.className = 'mx-toast ' + k;
      var safe = String(msg || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      t.innerHTML = '<span class="mx-toast-ic">' + iconFor(k) + '</span><span>' + safe + '</span>';
      wrap.appendChild(t);

      try {
        if (window.Haptics) {
          if (k === 'success') window.Haptics.success();
          else if (k === 'error') window.Haptics.error();
          else if (k === 'warning') window.Haptics.warning();
          else window.Haptics.light();
        }
      } catch (e) {}

      requestAnimationFrame(function() {
        requestAnimationFrame(function() { t.classList.add('in'); });
      });

      var startY = null;
      t.addEventListener('touchstart', function(e) {
        startY = (e.touches && e.touches[0]) ? e.touches[0].clientY : null;
      }, { passive: true });
      t.addEventListener('touchmove', function(e) {
        if (startY == null || !e.touches || !e.touches[0]) return;
        var dy = e.touches[0].clientY - startY;
        if (dy > 0) t.style.transform = 'translateY(' + dy + 'px)';
      }, { passive: true });
      t.addEventListener('touchend', function(e) {
        if (startY == null) return;
        var ey = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : startY;
        var dy = ey - startY;
        startY = null;
        if (dy > 40) dismiss();
        else t.style.transform = '';
      }, { passive: true });

      function dismiss() {
        t.classList.remove('in');
        t.classList.add('out');
        setTimeout(function() { try { t.remove(); } catch (e) {} }, 360);
      }
      setTimeout(dismiss, DURATION_MS);
      t.addEventListener('click', dismiss);
      return t;
    } catch (e) {
      try { console.warn('[toast]', msg, e); } catch (_) {}
      return null;
    }
  };

  /**
   * window.Skeleton — reusable shimmer loaders
   *   Skeleton.listCard(container, count)   → stacked card skeletons
   *   Skeleton.listRow(container, count)    → avatar + 2-line rows
   *   Skeleton.clear(container)             → empty the container
   */
  window.Skeleton = {
    listCard: function(container, count) {
      if (!container) return;
      var n = count || 4;
      var h = '';
      for (var i = 0; i < n; i++) h += '<div class="sk sk-card"></div>';
      container.innerHTML = h;
    },
    listRow: function(container, count) {
      if (!container) return;
      var n = count || 5;
      var h = '';
      for (var i = 0; i < n; i++) {
        h += '<div class="sk-row">'
           +   '<div class="sk sk-circle"></div>'
           +   '<div class="sk-body">'
           +     '<div class="sk sk-line md"></div>'
           +     '<div class="sk sk-line sm"></div>'
           +   '</div>'
           + '</div>';
      }
      container.innerHTML = h;
    },
    clear: function(container) {
      if (container) container.innerHTML = '';
    }
  };

  /**
   * window.MaestroDialog — premium blur-backed alert/confirm
   *   alert({title, message, okText, kind})  → Promise resolves true on OK
   *   confirm({title, message, okText, cancelText, kind, destructive}) → Promise resolves true on OK, false on cancel
   *   kind: 'info' (default) | 'success' | 'warning' | 'error'
   *   destructive: true → OK button rendered in red
   * Replaces native alert()/confirm() which look cheap on iOS.
   */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function _dialog(opts, type) {
    return new Promise(function(resolve) {
      try {
        var o = opts || {};
        var isConfirm = (type === 'confirm');
        var title = o.title || '';
        var message = o.message || '';
        var okText = o.okText || 'OK';
        var cancelText = o.cancelText || 'Cancelar';
        var kind = /^(info|success|warning|error)$/.test(o.kind) ? o.kind : 'info';
        var destructive = !!o.destructive;

        var overlay = document.createElement('div');
        overlay.className = 'mx-dlg-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        var iconMap = { info:'ℹ️', success:'✅', warning:'⚠️', error:'⚠️' };
        var ic = iconMap[kind] || 'ℹ️';

        var btnsHtml = isConfirm
          ? '<button class="mx-dlg-btn mx-dlg-btn-secondary" data-action="cancel">' + esc(cancelText) + '</button>'
            + '<button class="mx-dlg-btn mx-dlg-btn-primary' + (destructive ? ' mx-dlg-btn-destructive' : '') + '" data-action="ok">' + esc(okText) + '</button>'
          : '<button class="mx-dlg-btn mx-dlg-btn-primary" data-action="ok">' + esc(okText) + '</button>';

        overlay.innerHTML =
          '<div class="mx-dlg-card mx-dlg-' + kind + '">' +
            '<div class="mx-dlg-ic">' + ic + '</div>' +
            (title ? '<div class="mx-dlg-title">' + esc(title) + '</div>' : '') +
            '<div class="mx-dlg-msg">' + esc(message) + '</div>' +
            '<div class="mx-dlg-btns">' + btnsHtml + '</div>' +
          '</div>';

        document.body.appendChild(overlay);

        try {
          if (window.Haptics) {
            if (kind === 'error') window.Haptics.error();
            else if (kind === 'warning' || destructive) window.Haptics.warning();
            else window.Haptics.light();
          }
        } catch (_) {}

        requestAnimationFrame(function() {
          requestAnimationFrame(function() { overlay.classList.add('in'); });
        });

        function close(result) {
          overlay.classList.remove('in');
          overlay.classList.add('out');
          setTimeout(function() { try { overlay.remove(); } catch (_) {} resolve(result); }, 220);
        }

        overlay.addEventListener('click', function(e) {
          if (e.target === overlay && !isConfirm) { close(true); return; }
          var btn = e.target.closest('[data-action]');
          if (!btn) return;
          var act = btn.getAttribute('data-action');
          try { if (window.Haptics) window.Haptics.selection(); } catch (_) {}
          close(act === 'ok');
        });

        function onKey(e) {
          if (e.key === 'Escape') { document.removeEventListener('keydown', onKey); close(false); }
          else if (e.key === 'Enter') { document.removeEventListener('keydown', onKey); close(true); }
        }
        document.addEventListener('keydown', onKey);
      } catch (e) {
        try { console.warn('[MaestroDialog]', e); } catch (_) {}
        resolve(isConfirm ? window.confirm(opts && opts.message || '') : true);
      }
    });
  }

  window.MaestroDialog = {
    alert: function(opts) { return _dialog(opts, 'alert'); },
    confirm: function(opts) { return _dialog(opts, 'confirm'); }
  };

  /**
   * window.BtnLoading — inline spinner + disabled state for async button clicks.
   * Usage:
   *   BtnLoading.start(btn, 'Guardando...');
   *   await doThing();
   *   BtnLoading.stop(btn);
   */
  window.BtnLoading = {
    start: function(btn, text) {
      if (!btn) return;
      if (btn.dataset.loading === '1') return;
      btn.dataset.loading = '1';
      btn.dataset.origHtml = btn.innerHTML;
      btn.dataset.origDisabled = btn.disabled ? '1' : '0';
      btn.disabled = true;
      btn.classList.add('is-loading');
      var label = typeof text === 'string' ? text : '';
      btn.innerHTML = '<span class="mx-btn-spin" aria-hidden="true"></span>' + (label ? '<span style="margin-left:8px;">' + esc(label) + '</span>' : '');
    },
    stop: function(btn) {
      if (!btn || btn.dataset.loading !== '1') return;
      btn.disabled = (btn.dataset.origDisabled === '1');
      if (typeof btn.dataset.origHtml === 'string') btn.innerHTML = btn.dataset.origHtml;
      btn.classList.remove('is-loading');
      delete btn.dataset.loading;
      delete btn.dataset.origHtml;
      delete btn.dataset.origDisabled;
    }
  };
})();
