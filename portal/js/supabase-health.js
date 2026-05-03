/**
 * MaestroAC — Supabase Health Monitor & Graceful Degradation
 * Monitors Supabase availability and automatically switches between
 * online/degraded/offline modes with transparent data sync.
 */
(function() {
  'use strict';

  // === CONFIG ===
  var SB_URL = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var SB_KEY = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
  var HEALTH_CHECK_INTERVAL = 30000;
  var HEALTH_CHECK_TIMEOUT = 5000;
  var MAX_FAILURES = 3;
  var SYNC_QUEUE_KEY = 'maestroac_sync_queue';
  var HEALTH_STATE_KEY = 'maestroac_health_state';
  var CACHE_PREFIX = 'maestroac_cache_';

  // === STATE ===
  var state = {
    mode: 'online',
    consecutiveFailures: 0,
    lastSuccessfulCheck: Date.now(),
    checkInterval: null,
    listeners: [],
    syncInProgress: false
  };

  // === HEALTH CHECK ===
  function checkHealth() {
    var controller = null;
    var timeoutId = null;

    try {
      controller = new AbortController();
      timeoutId = setTimeout(function() { controller.abort(); }, HEALTH_CHECK_TIMEOUT);
    } catch(e) {
      // AbortController not supported — fallback
      controller = null;
    }

    var fetchOpts = {
      method: 'GET',
      headers: { 'apikey': SB_KEY }
    };
    if (controller) fetchOpts.signal = controller.signal;

    return fetch(SB_URL + '/auth/v1/settings', fetchOpts).then(function(response) {
      if (timeoutId) clearTimeout(timeoutId);
      if (response.ok || response.status === 200) {
        onHealthy();
        return true;
      }
      onUnhealthy('HTTP ' + response.status);
      return false;
    }).catch(function(error) {
      if (timeoutId) clearTimeout(timeoutId);
      onUnhealthy(error.message || 'Network error');
      return false;
    });
  }

  function onHealthy() {
    state.consecutiveFailures = 0;
    state.lastSuccessfulCheck = Date.now();

    if (state.mode !== 'online') {
      var previousMode = state.mode;
      state.mode = 'online';
      saveState();
      notifyListeners('online', previousMode);
      console.log('[HealthMonitor] Supabase ONLINE — restaurando servicio completo');
      processSyncQueue();
      hideOfflineBanner();
    }
  }

  function onUnhealthy(reason) {
    state.consecutiveFailures++;
    console.warn('[HealthMonitor] Health check failed (' + state.consecutiveFailures + '/' + MAX_FAILURES + '): ' + reason);

    if (state.consecutiveFailures >= MAX_FAILURES && state.mode !== 'offline') {
      var previousMode = state.mode;
      state.mode = 'offline';
      saveState();
      notifyListeners('offline', previousMode);
      console.error('[HealthMonitor] Supabase OFFLINE — activando modo sin conexion');
      showOfflineBanner();
    } else if (state.consecutiveFailures >= 1 && state.mode === 'online') {
      state.mode = 'degraded';
      saveState();
      notifyListeners('degraded', 'online');
      console.warn('[HealthMonitor] Modo degradado — servicio intermitente');
    }
  }

  // === OFFLINE BANNER ===
  function showOfflineBanner() {
    if (document.getElementById('maestroac-offline-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'maestroac-offline-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(135deg,#ff6b35,#f7c948);color:#1a1a2e;padding:12px 20px;text-align:center;font-family:Arial,sans-serif;font-weight:bold;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;gap:10px;';
    banner.innerHTML = '<span style="font-size:18px;">&#9889;</span> Modo sin conexion — Tu progreso se guardara localmente y se sincronizara automaticamente <span style="font-size:18px;">&#9889;</span>';
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.paddingTop = banner.offsetHeight + 'px';
  }

  function hideOfflineBanner() {
    var banner = document.getElementById('maestroac-offline-banner');
    if (banner) {
      banner.remove();
      document.body.style.paddingTop = '';
    }
  }

  // === SYNC QUEUE ===
  function queueOperation(operation) {
    var queue = getQueue();
    queue.push({
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      operation: operation
    });
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch(e) { /* storage full */ }
    console.log('[SyncQueue] Operacion encolada. Total en cola: ' + queue.length);
  }

  function getQueue() {
    try {
      return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    } catch(e) {
      return [];
    }
  }

  function processSyncQueue() {
    if (state.syncInProgress || state.mode !== 'online') return;

    var queue = getQueue();
    if (queue.length === 0) return;

    state.syncInProgress = true;
    console.log('[SyncQueue] Sincronizando ' + queue.length + ' operaciones pendientes...');

    var remaining = [];
    var chain = Promise.resolve();

    queue.forEach(function(item) {
      chain = chain.then(function() {
        return executeOperation(item.operation).then(function() {
          console.log('[SyncQueue] Operacion sincronizada: ' + item.operation.type);
        }).catch(function(e) {
          console.warn('[SyncQueue] Fallo al sincronizar, reintentando despues: ' + e.message);
          remaining.push(item);
        });
      });
    });

    chain.then(function() {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
      state.syncInProgress = false;
      if (remaining.length === 0) {
        console.log('[SyncQueue] Todas las operaciones sincronizadas');
        notifyListeners('synced', 'online');
      }
    });
  }

  function executeOperation(op) {
    if (!window.supabaseClient) return Promise.reject(new Error('Supabase client not available'));

    var result;
    switch(op.type) {
      case 'upsert':
        result = window.supabaseClient.from(op.table).upsert(op.data);
        break;
      case 'insert':
        result = window.supabaseClient.from(op.table).insert(op.data);
        break;
      case 'update':
        var query = window.supabaseClient.from(op.table).update(op.data);
        if (op.match) {
          for (var key in op.match) {
            query = query.eq(key, op.match[key]);
          }
        }
        result = query;
        break;
      default:
        return Promise.reject(new Error('Unknown operation type: ' + op.type));
    }

    return result.then(function(res) {
      if (res.error) throw res.error;
    });
  }

  // === LOCAL DATA CACHE ===
  var DataCache = {
    set: function(key, data, ttlMinutes) {
      var entry = {
        data: data,
        timestamp: Date.now(),
        ttl: (ttlMinutes || 60) * 60 * 1000
      };
      try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch(e) {
        DataCache.cleanup();
        try {
          localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
        } catch(e2) { /* give up */ }
      }
    },

    get: function(key) {
      try {
        var raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        var entry = JSON.parse(raw);
        if (Date.now() - entry.timestamp > entry.ttl) {
          localStorage.removeItem(CACHE_PREFIX + key);
          return null;
        }
        return entry.data;
      } catch(e) {
        return null;
      }
    },

    remove: function(key) {
      localStorage.removeItem(CACHE_PREFIX + key);
    },

    cleanup: function() {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(CACHE_PREFIX) === 0) keys.push(k);
      }
      var entries = keys.map(function(k) {
        try {
          var e = JSON.parse(localStorage.getItem(k));
          return { key: k, timestamp: e.timestamp || 0 };
        } catch(e) {
          return { key: k, timestamp: 0 };
        }
      }).sort(function(a, b) { return a.timestamp - b.timestamp; });

      var removeCount = Math.ceil(entries.length / 2);
      for (var i = 0; i < removeCount; i++) {
        localStorage.removeItem(entries[i].key);
      }
    }
  };

  // === RESILIENT DATA WRAPPER ===
  window.MaestroData = {
    fetch: function(table, query) {
      var cacheKey = table + '_' + JSON.stringify(query || {});

      if (state.mode === 'online' || state.mode === 'degraded') {
        var q = window.supabaseClient.from(table).select((query && query.select) || '*');
        if (query && query.eq) {
          for (var k in query.eq) { q = q.eq(k, query.eq[k]); }
        }
        if (query && query.limit) q = q.limit(query.limit);
        if (query && query.order) q = q.order(query.order.column, { ascending: query.order.ascending });

        return q.then(function(result) {
          if (result.error) throw result.error;
          DataCache.set(cacheKey, result.data, 120);
          return { data: result.data, source: 'live' };
        }).catch(function(e) {
          console.warn('[MaestroData] Fetch failed, trying cache: ' + e.message);
          var cached = DataCache.get(cacheKey);
          if (cached) return { data: cached, source: 'cache' };
          return { data: null, source: 'unavailable', error: 'No data available offline' };
        });
      }

      var cached = DataCache.get(cacheKey);
      if (cached) return Promise.resolve({ data: cached, source: 'cache' });
      return Promise.resolve({ data: null, source: 'unavailable', error: 'No data available offline' });
    },

    save: function(table, data, match) {
      if (state.mode === 'online') {
        var op;
        if (match) {
          var q = window.supabaseClient.from(table).update(data);
          for (var k in match) { q = q.eq(k, match[k]); }
          op = q;
        } else {
          op = window.supabaseClient.from(table).upsert(data);
        }

        return op.then(function(result) {
          if (result.error) throw result.error;
          return { success: true, source: 'live' };
        }).catch(function(e) {
          console.warn('[MaestroData] Save failed, queuing: ' + e.message);
          queueOperation({
            type: match ? 'update' : 'upsert',
            table: table,
            data: data,
            match: match || null
          });
          return { success: true, source: 'queued' };
        });
      }

      queueOperation({
        type: match ? 'update' : 'upsert',
        table: table,
        data: data,
        match: match || null
      });
      return Promise.resolve({ success: true, source: 'queued' });
    },

    getMode: function() { return state.mode; },
    canWrite: function() { return state.mode === 'online'; },
    getPendingCount: function() { return getQueue().length; },
    forceCheck: function() { return checkHealth(); }
  };

  // === EVENT SYSTEM ===
  function notifyListeners(newMode, previousMode) {
    state.listeners.forEach(function(cb) {
      try { cb(newMode, previousMode); } catch(e) { /* ignore */ }
    });
    try {
      window.dispatchEvent(new CustomEvent('maestroac:connection', {
        detail: { mode: newMode, previous: previousMode, pending: getQueue().length }
      }));
    } catch(e) { /* CustomEvent not supported */ }
  }

  // === STATE PERSISTENCE ===
  function saveState() {
    try {
      localStorage.setItem(HEALTH_STATE_KEY, JSON.stringify({
        mode: state.mode,
        lastCheck: Date.now(),
        consecutiveFailures: state.consecutiveFailures
      }));
    } catch(e) { /* storage full */ }
  }

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(HEALTH_STATE_KEY));
      if (saved && Date.now() - saved.lastCheck < 300000) {
        state.mode = saved.mode;
        state.consecutiveFailures = saved.consecutiveFailures;
      }
    } catch(e) { /* ignore */ }
  }

  // === BROWSER EVENTS ===
  window.addEventListener('online', function() {
    console.log('[HealthMonitor] Browser went online, checking Supabase...');
    checkHealth();
  });

  window.addEventListener('offline', function() {
    var prev = state.mode;
    state.mode = 'offline';
    state.consecutiveFailures = MAX_FAILURES;
    saveState();
    notifyListeners('offline', prev);
    showOfflineBanner();
  });

  // === INIT ===
  function init() {
    loadState();
    checkHealth();
    state.checkInterval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);

    setTimeout(function() {
      if (state.mode === 'online') processSyncQueue();
    }, 5000);

    console.log('[HealthMonitor] Initialized — mode: ' + state.mode);
  }

  // === PUBLIC API ===
  window.SupabaseHealth = {
    check: checkHealth,
    getMode: function() { return state.mode; },
    onStatusChange: function(callback) { state.listeners.push(callback); },
    queueOperation: queueOperation,
    processSyncQueue: processSyncQueue,
    DataCache: DataCache
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
