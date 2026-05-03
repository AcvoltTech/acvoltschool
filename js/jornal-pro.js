// ============================================
// JORNAL PRO — Maestro HVACR
// Premium mileage tracker + hours clock + earnings dashboard
// For HVAC contractors / technicians
// GPS auto-detect trips, manual trips, clock in/out shifts,
// daily/weekly/monthly stats, IRS deduction, CSV export.
// PWA foreground-only (no bg geolocation).
// ============================================

(function() {
  'use strict';

  // Premium alert helper — falls back to native if MaestroDialog missing.
  function _alert(message, kind) {
    try {
      if (window.MaestroDialog && window.MaestroDialog.alert) {
        return window.MaestroDialog.alert({ message: message, kind: kind || 'info' });
      }
    } catch(e) {}
    try { window.alert(message); } catch(e) {}
  }

  // ── Storage keys ──────────────────────────────
  var KEY_SETTINGS = 'jornal_pro_settings';
  var KEY_TRIPS    = 'jornal_pro_trips';
  var KEY_SHIFTS   = 'jornal_pro_shifts';
  var KEY_STATE    = 'jornal_pro_state';

  // ── Defaults ──────────────────────────────────
  var DEFAULT_SETTINGS = {
    hourlyRate: 45,
    dailyGoal: 400,
    mpg: 15,
    gasPrice: 4.50,
    irsRate: 67 // cents per mile, 2026
  };

  // ── In-memory runtime state ───────────────────
  var _view = 'dashboard'; // dashboard | trips | shifts | settings | export
  var _tripFilter = 'today';   // today | week | month | all
  var _shiftFilter = 'today';
  var _geoWatchId = null;
  var _speedBuffer = [];       // {ts, speedMph}
  var _lastPingForDist = null; // {lat,lng,ts}
  var _tickTimer = null;
  var _geoDenied = false;

  // ── LocalStorage helpers ──────────────────────
  function _loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      var v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch(e) { return fallback; }
  }
  function _saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  function _getSettings() {
    var s = _loadJSON(KEY_SETTINGS, null);
    if (!s || typeof s !== 'object') s = {};
    // Fill in missing fields from defaults
    for (var k in DEFAULT_SETTINGS) {
      if (s[k] == null || isNaN(parseFloat(s[k]))) s[k] = DEFAULT_SETTINGS[k];
      else s[k] = parseFloat(s[k]);
    }
    return s;
  }
  function _saveSettings(s) { _saveJSON(KEY_SETTINGS, s); }

  function _getTrips()  { var a = _loadJSON(KEY_TRIPS, []);  return Array.isArray(a) ? a : []; }
  function _saveTrips(a){ _saveJSON(KEY_TRIPS, a); }
  function _getShifts() { var a = _loadJSON(KEY_SHIFTS, []); return Array.isArray(a) ? a : []; }
  function _saveShifts(a){ _saveJSON(KEY_SHIFTS, a); }

  function _getAppState() {
    var s = _loadJSON(KEY_STATE, null);
    // autoTrack defaults FALSE — watchPosition() on init crashes iOS WKWebView
    // when the host app Info.plist lacks NSLocationWhenInUseUsageDescription.
    // User turns it on with the ON/OFF toggle in the dashboard.
    if (!s || typeof s !== 'object') s = { activeTrip: null, activeShift: null, autoTrack: false };
    if (s.autoTrack == null) s.autoTrack = false;
    // One-time migration — existing users had autoTrack=true persisted from before
    // this fix. Flip it off so they don't crash on next open.
    try {
      if (s.autoTrack && !localStorage.getItem('jornal_pro_geo_migrated')) {
        s.autoTrack = false;
        _saveJSON(KEY_STATE, s);
        localStorage.setItem('jornal_pro_geo_migrated', '1');
      }
    } catch(e) {}
    return s;
  }
  function _saveAppState(s) { _saveJSON(KEY_STATE, s); }

  // ── Utilities ─────────────────────────────────
  function _esc(s) {
    if (s == null) return '';
    var d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  function _jpHaversine(lat1, lon1, lat2, lon2) {
    var R = 3958.8; // miles
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
            Math.sin(dLon/2)*Math.sin(dLon/2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function _uid() {
    return 'jp_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*1e6).toString(36);
  }

  function _fmtMoney(v) {
    if (v == null || isNaN(v)) v = 0;
    return '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }
  function _fmtMiles(v) {
    if (v == null || isNaN(v)) v = 0;
    return Number(v).toLocaleString('en-US', { minimumFractionDigits:1, maximumFractionDigits:1 }) + ' mi';
  }
  function _fmtDurHM(ms) {
    if (!ms || ms < 0) ms = 0;
    var mins = Math.floor(ms / 60000);
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    if (h === 0) return m + 'm';
    return h + 'h ' + (m < 10 ? '0'+m : m) + 'm';
  }
  function _fmtHMS(ms) {
    if (!ms || ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    function pad(n){ return n < 10 ? '0'+n : ''+n; }
    return pad(h) + ':' + pad(m) + ':' + pad(sec);
  }
  function _fmtTime(ts) {
    if (!ts) return '—';
    try {
      var d = new Date(ts);
      var h = d.getHours();
      var m = d.getMinutes();
      var ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12; if (h === 0) h = 12;
      return h + ':' + (m < 10 ? '0'+m : m) + ' ' + ap;
    } catch(e) { return '—'; }
  }
  function _fmtDate(ts) {
    if (!ts) return '—';
    try {
      var d = new Date(ts);
      var mm = d.getMonth() + 1;
      var dd = d.getDate();
      var yy = String(d.getFullYear()).slice(2);
      return mm + '/' + dd + '/' + yy;
    } catch(e) { return '—'; }
  }

  function _dayStart(ts) {
    var d = new Date(ts);
    d.setHours(0,0,0,0);
    return d.getTime();
  }
  function _dayEnd(ts) {
    var d = new Date(ts);
    d.setHours(23,59,59,999);
    return d.getTime();
  }
  function _nowDayStart(){ return _dayStart(Date.now()); }
  function _nowWeekStart(){ return _nowDayStart() - 6 * 24 * 3600 * 1000; }
  function _nowMonthStart(){ return _nowDayStart() - 29 * 24 * 3600 * 1000; }

  function _filterByRange(arr, startKey, range) {
    var now = Date.now();
    var from;
    if (range === 'today') from = _nowDayStart();
    else if (range === 'week')  from = _nowWeekStart();
    else if (range === 'month') from = _nowMonthStart();
    else from = 0;
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var ts = arr[i][startKey];
      if (ts != null && ts >= from && ts <= now) out.push(arr[i]);
    }
    return out;
  }

  // ── Screen container ──────────────────────────
  function _jpEnsureScreen() {
    var s = document.getElementById('jornalProScreen');
    if (!s) {
      s = document.createElement('section');
      s.id = 'jornalProScreen';
      s.className = 'screen';
      var container = document.querySelector('.app-inner') || document.querySelector('.app-frame') || document.body;
      container.appendChild(s);
    }
    return s;
  }

  // ── Header (premium navy-gold) ────────────────
  function _header(title) {
    var btnStyle = 'background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:1.5px solid #F5D58A;color:#1B1306;padding:9px 15px;border-radius:10px;font-size:13px;font-weight:900;letter-spacing:0.3px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.35);';
    var h = '';
    h += '<div style="position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:10px;padding:14px 14px;padding-top:calc(14px + env(safe-area-inset-top,0px));background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border-bottom:3px solid #C9A961;box-shadow:0 3px 10px rgba(0,0,0,0.4);">';
    h += '<button onclick="_jpBack()" style="'+btnStyle+'">&larr; Volver</button>';
    h += '<div style="flex:1;color:#FFFFFF;font-size:16px;font-weight:900;letter-spacing:0.3px;line-height:1.2;text-shadow:0 1px 2px rgba(0,0,0,0.5);">📓 '+_esc(title)+'</div>';
    return h + '</div>';
  }

  function _tabs() {
    var tabs = [
      { id:'dashboard', label:'Dashboard', icon:'📊' },
      { id:'trips',     label:'Viajes',    icon:'🚗' },
      { id:'shifts',    label:'Horas',     icon:'⏱' },
      { id:'settings',  label:'Ajustes',   icon:'⚙️' },
      { id:'export',    label:'Exportar',  icon:'📤' }
    ];
    var h = '<div style="display:flex;gap:6px;padding:10px 12px 4px;overflow-x:auto;background:#0F1D32;border-bottom:1px solid #1B2845;-webkit-overflow-scrolling:touch;">';
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var active = _view === t.id;
      var bg = active
        ? 'linear-gradient(135deg,#E8C97A 0%,#C9A961 100%)'
        : 'linear-gradient(135deg,#1B2845 0%,#2A3A60 100%)';
      var color = active ? '#1B1306' : '#FFFFFF';
      var border = active ? '#F5D58A' : '#3A4E7C';
      h += '<button onclick="_jpNav(\''+t.id+'\')" style="flex:0 0 auto;padding:9px 13px;background:'+bg+';border:1.5px solid '+border+';border-radius:10px;color:'+color+';font-size:12px;font-weight:900;letter-spacing:0.3px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);">'+t.icon+' '+t.label+'</button>';
    }
    h += '</div>';
    return h;
  }

  // ═══════════════════════════════════════════════
  // GEOLOCATION
  // ═══════════════════════════════════════════════
  function _jpStartGeo() {
    if (!navigator.geolocation || !navigator.geolocation.watchPosition) {
      _geoDenied = true;
      return;
    }
    if (_geoWatchId != null) return;
    try {
      _geoWatchId = navigator.geolocation.watchPosition(
        _onGeoSuccess,
        _onGeoError,
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );
    } catch(e) { _geoDenied = true; }
  }

  function _jpStopGeo() {
    if (_geoWatchId != null && navigator.geolocation && navigator.geolocation.clearWatch) {
      try { navigator.geolocation.clearWatch(_geoWatchId); } catch(e) {}
    }
    _geoWatchId = null;
    _speedBuffer = [];
    _lastPingForDist = null;
  }

  function _onGeoError(err) {
    if (err && (err.code === 1 || err.PERMISSION_DENIED === 1)) {
      _geoDenied = true;
    }
    // Non-fatal — dashboard will show fallback
  }

  function _onGeoSuccess(pos) {
    if (!pos || !pos.coords) return;
    var c = pos.coords;
    if (c.accuracy != null && c.accuracy > 50) return; // too inaccurate
    var now = (pos.timestamp || Date.now());
    var speedMs = (c.speed != null && !isNaN(c.speed)) ? c.speed : 0;
    var speedMph = speedMs * 2.23694;
    if (speedMph < 0) speedMph = 0;

    _speedBuffer.push({ ts: now, mph: speedMph });
    // Keep only last 4 minutes
    var cutoff = now - 4 * 60 * 1000;
    while (_speedBuffer.length > 0 && _speedBuffer[0].ts < cutoff) _speedBuffer.shift();

    var st = _getAppState();
    var autoTrack = !!st.autoTrack;

    // If active trip — append ping + accumulate distance
    if (st.activeTrip) {
      var prev = _lastPingForDist;
      if (prev && now - prev.ts >= 1000) {
        var d = _jpHaversine(prev.lat, prev.lng, c.latitude, c.longitude);
        if (!isNaN(d) && d < 5) { // guard against GPS jump > 5mi in one ping
          st.activeTrip.distanceMi = (st.activeTrip.distanceMi || 0) + d;
        }
      }
      _lastPingForDist = { lat: c.latitude, lng: c.longitude, ts: now };
      if (!st.activeTrip.pings) st.activeTrip.pings = [];
      // Cap stored pings (memory sanity)
      if (st.activeTrip.pings.length < 5000) {
        st.activeTrip.pings.push({ lat: c.latitude, lng: c.longitude, ts: now, speed: speedMph });
      }
      _saveAppState(st);

      // Auto-end when < 1 mph for 3 minutes
      if (autoTrack && !st.activeTrip.manual) {
        if (_sustainedBelow(1, 3 * 60 * 1000)) {
          _jpEndTripInternal(true);
        }
      }
      return;
    }

    // No active trip — consider auto-start
    if (autoTrack && !_geoDenied) {
      if (_sustainedAbove(5, 30 * 1000)) {
        _jpStartTripInternal(true);
        _lastPingForDist = { lat: c.latitude, lng: c.longitude, ts: now };
      }
    }
  }

  function _sustainedAbove(mph, durMs) {
    if (_speedBuffer.length < 2) return false;
    var end = _speedBuffer[_speedBuffer.length - 1].ts;
    var start = end - durMs;
    var found = false;
    for (var i = _speedBuffer.length - 1; i >= 0; i--) {
      var s = _speedBuffer[i];
      if (s.ts < start) { found = true; break; }
      if (s.mph < mph) return false;
    }
    return found;
  }
  function _sustainedBelow(mph, durMs) {
    if (_speedBuffer.length < 2) return false;
    var end = _speedBuffer[_speedBuffer.length - 1].ts;
    var start = end - durMs;
    var found = false;
    for (var i = _speedBuffer.length - 1; i >= 0; i--) {
      var s = _speedBuffer[i];
      if (s.ts < start) { found = true; break; }
      if (s.mph >= mph) return false;
    }
    return found;
  }

  // ═══════════════════════════════════════════════
  // TRIPS
  // ═══════════════════════════════════════════════
  function _jpStartTripInternal(isAuto) {
    var st = _getAppState();
    if (st.activeTrip) return;
    st.activeTrip = {
      id: _uid(),
      startTs: Date.now(),
      endTs: null,
      distanceMi: 0,
      category: 'Trabajo',
      manual: !isAuto,
      pings: []
    };
    _saveAppState(st);
    _lastPingForDist = null;
    _render();
  }

  function _jpEndTripInternal(isAuto) {
    var st = _getAppState();
    if (!st.activeTrip) return;
    var trip = st.activeTrip;
    trip.endTs = Date.now();
    var trips = _getTrips();
    trips.unshift({
      id: trip.id,
      startTs: trip.startTs,
      endTs: trip.endTs,
      distanceMi: Math.round((trip.distanceMi || 0) * 100) / 100,
      category: trip.category || 'Trabajo',
      manual: !!trip.manual,
      pings: _downsamplePings(trip.pings || [], 200)
    });
    _saveTrips(trips);
    st.activeTrip = null;
    _saveAppState(st);
    _lastPingForDist = null;
    _render();
  }

  // Evenly-spaced downsample that keeps start + end + ~target points.
  // Replaces the old "if > 200, drop everything" behavior that nuked long trips.
  function _downsamplePings(pings, target) {
    if (!pings || pings.length <= target) return pings || [];
    var out = [];
    var step = (pings.length - 1) / (target - 1);
    for (var i = 0; i < target; i++) {
      out.push(pings[Math.round(i * step)]);
    }
    return out;
  }

  window._jpStartTrip = function() { _jpStartTripInternal(false); };
  window._jpEndTrip = function()   { _jpEndTripInternal(false); };

  window._jpSetTripCategory = function(cat) {
    var st = _getAppState();
    if (!st.activeTrip) return;
    st.activeTrip.category = cat;
    _saveAppState(st);
    _render();
  };

  window._jpUpdateTripCategory = function(id, cat) {
    var trips = _getTrips();
    for (var i = 0; i < trips.length; i++) {
      if (trips[i].id === id) { trips[i].category = cat; break; }
    }
    _saveTrips(trips);
    _render();
  };

  window._jpDeleteTrip = function(id) {
    if (!confirm('¿Borrar este viaje?')) return;
    var trips = _getTrips();
    var out = [];
    for (var i = 0; i < trips.length; i++) if (trips[i].id !== id) out.push(trips[i]);
    _saveTrips(out);
    _render();
  };

  window._jpAddManualTrip = function() {
    var miStr = prompt('Millas del viaje (ej: 12.4):');
    if (miStr == null) return;
    var mi = parseFloat(miStr);
    if (isNaN(mi) || mi <= 0) { _alert('Millas inválidas', 'warning'); return; }
    var catStr = prompt('Categoría: 1=Trabajo, 2=Personal, 3=Commute', '1');
    var cat = 'Trabajo';
    if (catStr === '2') cat = 'Personal';
    else if (catStr === '3') cat = 'Commute';
    var now = Date.now();
    var trips = _getTrips();
    trips.unshift({
      id: _uid(),
      startTs: now - 30 * 60 * 1000,
      endTs: now,
      distanceMi: Math.round(mi * 100) / 100,
      category: cat,
      manual: true,
      pings: []
    });
    _saveTrips(trips);
    _render();
  };

  // ═══════════════════════════════════════════════
  // MAP (Leaflet + OpenStreetMap, lazy-loaded)
  // ═══════════════════════════════════════════════
  var _leafletReady = false;
  var _leafletLoading = null;
  var _mapInst = null;
  var _mapLiveTimer = null;

  function _loadLeaflet() {
    if (_leafletReady) return Promise.resolve();
    if (_leafletLoading) return _leafletLoading;
    _leafletLoading = new Promise(function(resolve, reject) {
      // CSS
      if (!document.getElementById('jpLeafletCss')) {
        var link = document.createElement('link');
        link.id = 'jpLeafletCss';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        link.integrity = 'sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==';
        link.crossOrigin = 'anonymous';
        link.referrerPolicy = 'no-referrer';
        document.head.appendChild(link);
      }
      // JS
      if (window.L && window.L.map) {
        _leafletReady = true;
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      s.integrity = 'sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==';
      s.crossOrigin = 'anonymous';
      s.referrerPolicy = 'no-referrer';
      s.onload = function() {
        _leafletReady = true;
        resolve();
      };
      s.onerror = function() {
        _leafletLoading = null;
        reject(new Error('No se pudo cargar el mapa'));
      };
      document.head.appendChild(s);
    });
    return _leafletLoading;
  }

  function _avgSpeed(pings) {
    if (!pings || pings.length === 0) return 0;
    var sum = 0, n = 0;
    for (var i = 0; i < pings.length; i++) {
      var sp = pings[i].speed;
      if (sp != null && !isNaN(sp) && sp > 0) { sum += sp; n++; }
    }
    return n > 0 ? sum / n : 0;
  }

  function _buildMapOverlay(trip, isLive) {
    var existing = document.getElementById('jpMapOverlay');
    if (existing) existing.parentNode.removeChild(existing);

    var overlay = document.createElement('div');
    overlay.id = 'jpMapOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;background:#0F1D32;';

    var dur = (trip.endTs || Date.now()) - (trip.startTs || Date.now());
    var avg = _avgSpeed(trip.pings);

    var header = '';
    header += '<div style="position:relative;z-index:2;padding:14px 14px;padding-top:calc(14px + env(safe-area-inset-top,0px));background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border-bottom:3px solid #C9A961;box-shadow:0 3px 10px rgba(0,0,0,0.4);">';
    header += '<div style="display:flex;align-items:center;gap:10px;">';
    header += '<button onclick="_jpCloseMap()" style="background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:1.5px solid #F5D58A;color:#1B1306;padding:9px 15px;border-radius:10px;font-size:13px;font-weight:900;letter-spacing:0.3px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.35);">&larr; Cerrar</button>';
    header += '<div style="flex:1;color:#FFFFFF;font-size:16px;font-weight:900;letter-spacing:0.3px;text-shadow:0 1px 2px rgba(0,0,0,0.5);">🗺 '+(isLive ? 'Ruta en vivo' : 'Ruta del viaje')+'</div>';
    header += '</div>';
    header += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">';
    header += '<div style="flex:1;min-width:0;padding:8px 10px;background:rgba(0,0,0,0.25);border:1px solid rgba(201,169,97,0.4);border-radius:9px;"><div style="color:#C9A961;font-size:9px;font-weight:900;letter-spacing:1px;">MILLAS</div><div style="color:#FFFFFF;font-size:15px;font-weight:900;margin-top:2px;">'+_fmtMiles(trip.distanceMi || 0)+'</div></div>';
    header += '<div style="flex:1;min-width:0;padding:8px 10px;background:rgba(0,0,0,0.25);border:1px solid rgba(201,169,97,0.4);border-radius:9px;"><div style="color:#C9A961;font-size:9px;font-weight:900;letter-spacing:1px;">TIEMPO</div><div style="color:#FFFFFF;font-size:15px;font-weight:900;margin-top:2px;">'+_fmtDurHM(dur)+'</div></div>';
    header += '<div style="flex:1;min-width:0;padding:8px 10px;background:rgba(0,0,0,0.25);border:1px solid rgba(201,169,97,0.4);border-radius:9px;"><div style="color:#C9A961;font-size:9px;font-weight:900;letter-spacing:1px;">PROMEDIO</div><div style="color:#FFFFFF;font-size:15px;font-weight:900;margin-top:2px;">'+avg.toFixed(0)+' mph</div></div>';
    header += '</div>';
    header += '</div>';

    var loadingHtml = '<div id="jpMapLoading" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#0F1D32;z-index:1;">'
      + '<div style="width:42px;height:42px;border:4px solid rgba(201,169,97,0.2);border-top-color:#E8C97A;border-radius:50%;animation:jpMapSpin 0.9s linear infinite;"></div>'
      + '<div style="color:#E8C97A;font-size:13px;font-weight:800;letter-spacing:1.2px;">CARGANDO MAPA…</div>'
      + '<style>@keyframes jpMapSpin{to{transform:rotate(360deg)}}</style>'
      + '</div>';
    overlay.innerHTML = header + '<div id="jpMapCanvas" style="flex:1;width:100%;background:#0F1D32;position:relative;">' + loadingHtml + '</div>';

    var frame = document.querySelector('.app-inner') || document.querySelector('.app-frame') || document.body;
    frame.appendChild(overlay);
    return overlay;
  }

  function _renderRoute(trip, isLive) {
    var canvas = document.getElementById('jpMapCanvas');
    if (!canvas || !window.L) return;

    // Tear down prior instance
    if (_mapInst) {
      try { _mapInst.remove(); } catch(e) {}
      _mapInst = null;
    }

    var pts = [];
    if (trip.pings) {
      for (var i = 0; i < trip.pings.length; i++) {
        var p = trip.pings[i];
        if (p && typeof p.lat === 'number' && typeof p.lng === 'number') {
          pts.push([p.lat, p.lng]);
        }
      }
    }
    var loadingEl = document.getElementById('jpMapLoading');
    if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);

    if (pts.length < 2) {
      canvas.innerHTML = '<div style="padding:40px 20px;text-align:center;color:#E0E7F2;font-size:13px;font-weight:600;">No hay datos de ruta suficientes para este viaje.</div>';
      return;
    }

    var map = window.L.map(canvas, { zoomControl: true, attributionControl: true });
    _mapInst = map;
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var line = window.L.polyline(pts, { color: '#E8C97A', weight: 5, opacity: 0.9 }).addTo(map);
    window.L.circleMarker(pts[0], { radius: 8, color: '#10B981', fillColor: '#10B981', fillOpacity: 1, weight: 3 })
      .addTo(map).bindPopup('Inicio');
    window.L.circleMarker(pts[pts.length - 1], { radius: 8, color: '#EF4444', fillColor: '#EF4444', fillOpacity: 1, weight: 3 })
      .addTo(map).bindPopup(isLive ? 'Ubicación actual' : 'Fin');

    map.fitBounds(line.getBounds(), { padding: [24, 24] });

    // Live updates
    if (isLive) {
      if (_mapLiveTimer) clearInterval(_mapLiveTimer);
      _mapLiveTimer = setInterval(function() {
        if (!document.getElementById('jpMapOverlay')) {
          clearInterval(_mapLiveTimer);
          _mapLiveTimer = null;
          return;
        }
        var st = _getAppState();
        if (!st.activeTrip || !st.activeTrip.pings || st.activeTrip.pings.length < 2) return;
        var last = st.activeTrip.pings[st.activeTrip.pings.length - 1];
        if (!last || typeof last.lat !== 'number') return;
        var latlng = [last.lat, last.lng];
        // Extend polyline only if moved
        var cur = line.getLatLngs();
        var lastCur = cur[cur.length - 1];
        if (!lastCur || lastCur.lat !== last.lat || lastCur.lng !== last.lng) {
          line.addLatLng(latlng);
          map.panTo(latlng);
        }
      }, 3000);
    }
  }

  window._jpOpenMap = function(tripId) {
    var trip;
    var isLive = false;
    if (tripId === '__live__') {
      var st = _getAppState();
      trip = st.activeTrip;
      isLive = true;
    } else {
      var trips = _getTrips();
      for (var i = 0; i < trips.length; i++) {
        if (trips[i].id === tripId) { trip = trips[i]; break; }
      }
    }
    if (!trip) { _alert('No se encontró el viaje.', 'warning'); return; }
    if (!trip.pings || trip.pings.length < 2) {
      _alert('Este viaje no tiene datos de ruta (GPS no estaba activo o no se capturaron puntos).', 'info');
      return;
    }

    _buildMapOverlay(trip, isLive);

    _loadLeaflet().then(function() {
      _renderRoute(trip, isLive);
    }).catch(function(e) {
      var canvas = document.getElementById('jpMapCanvas');
      if (canvas) canvas.innerHTML = '<div style="padding:40px 20px;text-align:center;color:#FCA5A5;font-size:13px;font-weight:700;">No se pudo cargar el mapa. Verifica tu conexión.</div>';
    });
  };

  window._jpCloseMap = function() {
    if (_mapLiveTimer) { clearInterval(_mapLiveTimer); _mapLiveTimer = null; }
    if (_mapInst) { try { _mapInst.remove(); } catch(e) {} _mapInst = null; }
    var ov = document.getElementById('jpMapOverlay');
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  };

  // ═══════════════════════════════════════════════
  // SHIFTS (clock in / out)
  // ═══════════════════════════════════════════════
  window._jpClockIn = function() {
    var st = _getAppState();
    if (st.activeShift) return;
    var jobName = prompt('Nombre del trabajo (opcional):', '') || '';
    st.activeShift = {
      id: _uid(),
      clockInTs: Date.now(),
      clockOutTs: null,
      breaks: [],
      jobName: jobName,
      breakOpen: false
    };
    _saveAppState(st);
    _render();
  };

  window._jpClockOut = function() {
    var st = _getAppState();
    if (!st.activeShift) return;
    var sh = st.activeShift;
    // Close open break if any
    if (sh.breakOpen && sh.breaks && sh.breaks.length > 0) {
      var lastB = sh.breaks[sh.breaks.length - 1];
      if (!lastB.endTs) lastB.endTs = Date.now();
      sh.breakOpen = false;
    }
    sh.clockOutTs = Date.now();
    var shifts = _getShifts();
    shifts.unshift({
      id: sh.id,
      clockInTs: sh.clockInTs,
      clockOutTs: sh.clockOutTs,
      breaks: sh.breaks || [],
      jobName: sh.jobName || ''
    });
    _saveShifts(shifts);
    st.activeShift = null;
    _saveAppState(st);
    _render();
  };

  window._jpToggleBreak = function() {
    var st = _getAppState();
    if (!st.activeShift) return;
    var sh = st.activeShift;
    if (!sh.breaks) sh.breaks = [];
    if (sh.breakOpen) {
      // Ending a break — no modal, just close
      if (sh.breaks.length > 0) sh.breaks[sh.breaks.length - 1].endTs = Date.now();
      sh.breakOpen = false;
      _saveAppState(st);
      _render();
    } else {
      // Starting a break — ask why first
      _jpOpenBreakReasonModal();
    }
  };

  // ── Break reason modal ─────────────────────────
  // Grouped by section. Personal = life stuff. Trabajo = HVAC job incidents.
  var BREAK_REASON_GROUPS = [
    {
      title: '👤 PERSONAL',
      reasons: [
        { id: 'comida',   emoji: '🍔', label: 'Comida' },
        { id: 'bano',     emoji: '🚻', label: 'Baño' },
        { id: 'llamada',  emoji: '📞', label: 'Llamada' },
        { id: 'familia',  emoji: '🏠', label: 'Familia' },
        { id: 'medico',   emoji: '🏥', label: 'Médico' },
        { id: 'recado',   emoji: '🛒', label: 'Recado' }
      ]
    },
    {
      title: '🔧 TRABAJO / INCIDENTES',
      reasons: [
        { id: 'carro',       emoji: '🚗', label: 'Carro averiado' },
        { id: 'material',    emoji: '📦', label: 'Falta material' },
        { id: 'supply',      emoji: '🏪', label: 'Supply house' },
        { id: 'cancelo',     emoji: '❌', label: 'Cliente canceló' },
        { id: 'no_llego',    emoji: '👻', label: 'Cliente no llegó' },
        { id: 'esperando',   emoji: '⏳', label: 'Esperando cliente' },
        { id: 'herramienta', emoji: '🔧', label: 'Herramienta' },
        { id: 'clima',       emoji: '🌧', label: 'Clima' },
        { id: 'autoriz',     emoji: '💬', label: 'Autorización' },
        { id: 'papeleo',     emoji: '📋', label: 'Papeleo' },
        { id: 'junta',       emoji: '🧑‍💼', label: 'Junta / Oficina' },
        { id: 'gasolina',    emoji: '⛽', label: 'Gasolina' }
      ]
    }
  ];

  function _jpReasonLabel(id) {
    for (var g = 0; g < BREAK_REASON_GROUPS.length; g++) {
      var rs = BREAK_REASON_GROUPS[g].reasons;
      for (var i = 0; i < rs.length; i++) if (rs[i].id === id) return rs[i].label;
    }
    return null;
  }

  function _jpOpenBreakReasonModal() {
    var existing = document.getElementById('jpBreakModal');
    if (existing) existing.parentNode.removeChild(existing);

    var overlay = document.createElement('div');
    overlay.id = 'jpBreakModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.65);padding:0;';

    var h = '';
    h += '<div style="width:100%;max-width:540px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 100%);border-top:3px solid #C9A961;border-radius:20px 20px 0 0;padding:18px 16px 30px;padding-bottom:calc(30px + env(safe-area-inset-bottom,0px));box-shadow:0 -8px 30px rgba(0,0,0,0.6);max-height:92vh;overflow-y:auto;">';
    h += '<div style="width:46px;height:5px;background:#3A4E7C;border-radius:3px;margin:0 auto 12px;"></div>';
    h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.8px;text-align:center;">⏸ PAUSAR HORAS</div>';
    h += '<div style="color:#FFFFFF;font-size:18px;font-weight:900;text-align:center;margin-top:5px;">¿Por qué pausas?</div>';
    h += '<div style="color:#CBD5E1;font-size:13px;font-weight:600;text-align:center;margin-top:5px;">Elige una razón para tu registro</div>';

    for (var gi = 0; gi < BREAK_REASON_GROUPS.length; gi++) {
      var g = BREAK_REASON_GROUPS[gi];
      h += '<div style="margin-top:16px;color:#C9A961;font-size:10px;font-weight:900;letter-spacing:1.4px;padding:0 2px;">'+g.title+'</div>';
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
      for (var ri = 0; ri < g.reasons.length; ri++) {
        var r = g.reasons[ri];
        h += '<button onclick="_jpPickBreakReason(\''+r.id+'\')" style="padding:12px 8px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #3A4E7C;border-radius:12px;color:#FFFFFF;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;">';
        h += '<div style="font-size:24px;line-height:1;">'+r.emoji+'</div>';
        h += '<div style="font-size:12px;font-weight:900;letter-spacing:0.2px;text-align:center;line-height:1.2;">'+r.label+'</div>';
        h += '</button>';
      }
      h += '</div>';
    }

    // "Otro" section — free text
    h += '<div style="margin-top:16px;color:#C9A961;font-size:10px;font-weight:900;letter-spacing:1.4px;padding:0 2px;">✏️ OTRO</div>';
    h += '<div style="margin-top:8px;">';
    h += '<input id="jpBreakOtroInput" type="text" placeholder="Escribe la razón..." maxlength="60" style="width:100%;padding:13px 14px;background:#0F1D32;border:2px solid #3A4E7C;border-radius:11px;color:#FFFFFF;font-size:15px;font-weight:700;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor=\'#C9A961\';" />';
    h += '<button onclick="_jpConfirmOtro()" style="width:100%;margin-top:10px;padding:13px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:11px;color:#1B1306;font-size:14px;font-weight:900;letter-spacing:0.6px;cursor:pointer;">CONFIRMAR CON TEXTO</button>';
    h += '</div>';

    h += '<button onclick="_jpCloseBreakModal()" style="width:100%;margin-top:14px;padding:13px;background:transparent;border:1.5px solid #4A5F8C;border-radius:11px;color:#E2E8F0;font-size:14px;font-weight:800;cursor:pointer;">Cancelar</button>';
    h += '</div>';

    overlay.innerHTML = h;
    var frame = document.querySelector('.app-inner') || document.querySelector('.app-frame') || document.body;
    frame.appendChild(overlay);
  }

  window._jpPickBreakReason = function(id) {
    var reason = _jpReasonLabel(id);
    _jpStartBreakWithReason(reason || 'Descanso');
  };

  window._jpConfirmOtro = function() {
    var inp = document.getElementById('jpBreakOtroInput');
    var txt = inp && inp.value ? String(inp.value).trim() : '';
    if (!txt) { _alert('Escribe una razón o elige una de las opciones.', 'warning'); return; }
    _jpStartBreakWithReason(txt.slice(0, 60));
  };

  window._jpCloseBreakModal = function() {
    var ov = document.getElementById('jpBreakModal');
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  };

  function _jpStartBreakWithReason(reason) {
    var st = _getAppState();
    if (!st.activeShift) { _jpCloseBreakModal(); return; }
    var sh = st.activeShift;
    if (!sh.breaks) sh.breaks = [];
    if (sh.breakOpen) { _jpCloseBreakModal(); return; } // safety — already paused
    sh.breaks.push({ startTs: Date.now(), endTs: null, reason: reason });
    sh.breakOpen = true;
    _saveAppState(st);
    _jpCloseBreakModal();
    _render();
  }

  window._jpDeleteShift = function(id) {
    if (!confirm('¿Borrar este turno?')) return;
    var shifts = _getShifts();
    var out = [];
    for (var i = 0; i < shifts.length; i++) if (shifts[i].id !== id) out.push(shifts[i]);
    _saveShifts(out);
    _render();
  };

  function _shiftNetMs(sh) {
    var start = sh.clockInTs;
    var end = sh.clockOutTs || Date.now();
    var total = end - start;
    var brk = 0;
    if (sh.breaks && sh.breaks.length) {
      for (var i = 0; i < sh.breaks.length; i++) {
        var b = sh.breaks[i];
        var bEnd = b.endTs || Date.now();
        brk += Math.max(0, bEnd - b.startTs);
      }
    }
    return Math.max(0, total - brk);
  }

  // ═══════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════
  window._jpSettings = function(field, value) {
    var s = _getSettings();
    var v = parseFloat(value);
    if (!isNaN(v) && v >= 0) s[field] = v;
    _saveSettings(s);
    _render();
  };

  window._jpToggleAutoTrack = function() {
    var st = _getAppState();
    st.autoTrack = !st.autoTrack;
    _saveAppState(st);
    if (st.autoTrack) _jpStartGeo();
    _render();
  };

  // ═══════════════════════════════════════════════
  // NAV
  // ═══════════════════════════════════════════════
  window._jpNav = function(view) {
    try { if (typeof window._jpCloseMap === 'function') window._jpCloseMap(); } catch(e) {}
    _view = view || 'dashboard';
    _render();
    try {
      var root = document.getElementById('jornalProScreen');
      if (root) root.scrollTop = 0;
      window.scrollTo(0, 0);
    } catch(e) {}
  };

  window._jpBack = function() {
    try { if (typeof window._jpCloseMap === 'function') window._jpCloseMap(); } catch(e) {}
    _stopTick();
    if (typeof window.showScreen === 'function') {
      window.showScreen('dashboardScreen');
    } else if (typeof window.goBack === 'function') {
      window.goBack();
    }
  };

  window._jpFilter = function(kind, range) {
    if (kind === 'trips') _tripFilter = range;
    else if (kind === 'shifts') _shiftFilter = range;
    _render();
  };

  // ═══════════════════════════════════════════════
  // EXPORT (CSV)
  // ═══════════════════════════════════════════════
  function _csvEscape(v) {
    if (v == null) return '';
    var s = String(v);
    if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  window._jpExportCSV = function(kind) {
    var settings = _getSettings();
    var rows = [];
    var name;
    if (kind === 'shifts') {
      name = 'jornal_pro_shifts_' + _ymd() + '.csv';
      rows.push(['date','clock_in','clock_out','duration_hrs','hourly_rate','earned','job_name','break_reasons'].join(','));
      var shifts = _getShifts();
      for (var i = 0; i < shifts.length; i++) {
        var s = shifts[i];
        var hrs = _shiftNetMs(s) / 3600000;
        var earned = hrs * settings.hourlyRate;
        var brkSummary = '';
        if (s.breaks && s.breaks.length) {
          var parts = [];
          for (var bi = 0; bi < s.breaks.length; bi++) {
            var b = s.breaks[bi];
            var bd = (b.endTs || b.startTs) - b.startTs;
            var bm = Math.max(0, Math.round(bd / 60000));
            parts.push((b.reason || 'Descanso') + ' (' + bm + 'm)');
          }
          brkSummary = parts.join('; ');
        }
        rows.push([
          _csvEscape(_fmtDate(s.clockInTs)),
          _csvEscape(_fmtTime(s.clockInTs)),
          _csvEscape(_fmtTime(s.clockOutTs)),
          _csvEscape(hrs.toFixed(2)),
          _csvEscape(settings.hourlyRate.toFixed(2)),
          _csvEscape(earned.toFixed(2)),
          _csvEscape(s.jobName || ''),
          _csvEscape(brkSummary)
        ].join(','));
      }
    } else {
      name = 'jornal_pro_trips_' + _ymd() + '.csv';
      rows.push(['date','start_time','end_time','distance_mi','duration_min','category','deductible_amt'].join(','));
      var trips = _getTrips();
      for (var j = 0; j < trips.length; j++) {
        var t = trips[j];
        var dur = t.endTs && t.startTs ? (t.endTs - t.startTs) / 60000 : 0;
        var deduct = (t.category === 'Trabajo') ? (t.distanceMi || 0) * (settings.irsRate / 100) : 0;
        rows.push([
          _csvEscape(_fmtDate(t.startTs)),
          _csvEscape(_fmtTime(t.startTs)),
          _csvEscape(_fmtTime(t.endTs)),
          _csvEscape((t.distanceMi || 0).toFixed(2)),
          _csvEscape(dur.toFixed(1)),
          _csvEscape(t.category || 'Trabajo'),
          _csvEscape(deduct.toFixed(2))
        ].join(','));
      }
    }
    var csv = rows.join('\n');
    _downloadBlob(csv, name, 'text/csv;charset=utf-8');
  };

  function _ymd() {
    var d = new Date();
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    return d.getFullYear() + '-' + (mm<10?'0':'') + mm + '-' + (dd<10?'0':'') + dd;
  }

  function _downloadBlob(content, filename, mime) {
    try {
      var blob = new Blob([content], { type: mime || 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){
        try { document.body.removeChild(a); } catch(e) {}
        try { URL.revokeObjectURL(url); } catch(e) {}
      }, 500);
    } catch(e) {
      _alert('No se pudo descargar el archivo.', 'error');
    }
  }

  // ═══════════════════════════════════════════════
  // DASHBOARD STATS
  // ═══════════════════════════════════════════════
  function _statsForRange(from) {
    var settings = _getSettings();
    var trips = _getTrips();
    var shifts = _getShifts();
    var now = Date.now();

    var workMi = 0, totalMi = 0;
    for (var i = 0; i < trips.length; i++) {
      var t = trips[i];
      if (t.startTs == null || t.startTs < from) continue;
      var d = t.distanceMi || 0;
      totalMi += d;
      if (t.category === 'Trabajo') workMi += d;
    }

    var workedMs = 0;
    for (var j = 0; j < shifts.length; j++) {
      var s = shifts[j];
      if (s.clockInTs == null || s.clockInTs < from) continue;
      workedMs += _shiftNetMs(s);
    }

    // Include live active shift if it overlaps the range
    var st = _getAppState();
    if (st.activeShift && st.activeShift.clockInTs >= from) {
      workedMs += _shiftNetMs(st.activeShift);
    }
    // Include live active trip
    if (st.activeTrip && st.activeTrip.startTs >= from) {
      var d2 = st.activeTrip.distanceMi || 0;
      totalMi += d2;
      if (st.activeTrip.category === 'Trabajo') workMi += d2;
    }

    var hours = workedMs / 3600000;
    var earned = hours * settings.hourlyRate;
    var gasCost = (settings.mpg > 0 ? (totalMi / settings.mpg) : 0) * settings.gasPrice;
    var net = earned - gasCost;
    var irsDeduction = workMi * (settings.irsRate / 100);
    return {
      workMi: workMi,
      totalMi: totalMi,
      workedMs: workedMs,
      hours: hours,
      earned: earned,
      gasCost: gasCost,
      net: net,
      irsDeduction: irsDeduction,
      settings: settings
    };
  }

  // ═══════════════════════════════════════════════
  // RENDER — DASHBOARD
  // ═══════════════════════════════════════════════
  function _renderDashboard() {
    var st = _getAppState();
    var settings = _getSettings();
    var today = _statsForRange(_nowDayStart());
    var week = _statsForRange(_nowWeekStart());
    var month = _statsForRange(_nowMonthStart());

    var pctGoal = settings.dailyGoal > 0 ? Math.min(100, Math.round(today.earned / settings.dailyGoal * 100)) : 0;
    var goalColor = pctGoal >= 90 ? '#10B981' : pctGoal >= 50 ? '#F59E0B' : '#EF4444';
    var goalBg = pctGoal >= 90
      ? 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)'
      : pctGoal >= 50
      ? 'linear-gradient(135deg,#78350F 0%,#92400E 55%,#B45309 100%)'
      : 'linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)';

    var h = '';

    // Live trip banner
    if (st.activeTrip) {
      var tripMs = Date.now() - st.activeTrip.startTs;
      h += '<div style="margin:12px 14px 0;padding:14px 16px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:14px;box-shadow:0 6px 18px rgba(5,150,105,0.35);">';
      h += '<div style="display:flex;align-items:center;gap:10px;">';
      h += '<div style="width:12px;height:12px;border-radius:50%;background:#6EE7B7;box-shadow:0 0 0 0 rgba(110,231,183,0.7);animation:jpPulse 1.5s infinite;"></div>';
      h += '<div style="color:#D1FAE5;font-size:11px;font-weight:900;letter-spacing:1.5px;">🚗 VIAJE EN PROGRESO'+(st.activeTrip.manual ? ' · MANUAL' : ' · AUTO')+'</div>';
      h += '</div>';
      h += '<div style="color:#FFFFFF;font-size:22px;font-weight:900;margin-top:8px;letter-spacing:-0.01em;">'+_fmtMiles(st.activeTrip.distanceMi || 0)+' · <span data-jp-live="trip">'+_fmtHMS(tripMs)+'</span></div>';
      h += '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">';
      var cats = ['Trabajo','Personal','Commute'];
      for (var ci = 0; ci < cats.length; ci++) {
        var c = cats[ci];
        var active = (st.activeTrip.category || 'Trabajo') === c;
        h += '<button onclick="_jpSetTripCategory(\''+c+'\')" style="padding:6px 11px;background:'+(active?'#FFFFFF':'rgba(0,0,0,0.25)')+';border:1.5px solid '+(active?'#FFFFFF':'rgba(255,255,255,0.35)')+';border-radius:8px;color:'+(active?'#065F46':'#FFFFFF')+';font-size:12px;font-weight:900;cursor:pointer;">'+c+'</button>';
      }
      h += '</div>';
      h += '<div style="margin-top:12px;display:flex;gap:8px;">';
      var liveHasPings = st.activeTrip.pings && st.activeTrip.pings.length >= 2;
      if (liveHasPings) {
        h += '<button onclick="_jpOpenMap(\'__live__\')" style="flex:0 0 auto;padding:13px 16px;background:linear-gradient(135deg,#1B2845,#2A3A60);border:2px solid #3A4E7C;border-radius:11px;color:#FFFFFF;font-size:14px;font-weight:900;cursor:pointer;">🗺</button>';
      }
      h += '<button onclick="_jpEndTrip()" style="flex:1;padding:13px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:11px;color:#1B1306;font-size:14px;font-weight:900;letter-spacing:0.6px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.4);">TERMINAR VIAJE</button>';
      h += '</div>';
      h += '</div>';
    }

    // Live shift banner
    if (st.activeShift) {
      var shiftMs = _shiftNetMs(st.activeShift);
      var shiftEarned = (shiftMs / 3600000) * settings.hourlyRate;
      h += '<div style="margin:12px 14px 0;padding:14px 16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,0.4);">';
      h += '<div style="display:flex;align-items:center;gap:10px;">';
      h += '<div style="width:12px;height:12px;border-radius:50%;background:#E8C97A;box-shadow:0 0 0 0 rgba(232,201,122,0.7);animation:jpPulse 1.5s infinite;"></div>';
      var liveBreakLabel = 'TRABAJANDO';
      if (st.activeShift.breakOpen && st.activeShift.breaks && st.activeShift.breaks.length) {
        var lb = st.activeShift.breaks[st.activeShift.breaks.length - 1];
        liveBreakLabel = 'EN DESCANSO' + (lb && lb.reason ? ' · ' + _esc(lb.reason).toUpperCase() : '');
      }
      h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.5px;">⏱ PONCHADO · '+liveBreakLabel+'</div>';
      h += '</div>';
      h += '<div style="color:#FFFFFF;font-size:22px;font-weight:900;margin-top:8px;letter-spacing:-0.01em;"><span data-jp-live="shift">'+_fmtHMS(shiftMs)+'</span> · '+_fmtMoney(shiftEarned)+'</div>';
      if (st.activeShift.jobName) {
        h += '<div style="color:#E0E7F2;font-size:12px;font-weight:700;margin-top:4px;">Job: '+_esc(st.activeShift.jobName)+'</div>';
      }
      h += '<div style="margin-top:10px;display:flex;gap:8px;">';
      h += '<button onclick="_jpToggleBreak()" style="flex:1;padding:11px;background:linear-gradient(135deg,#78350F,#B45309);border:2px solid #F59E0B;border-radius:10px;color:#FFFFFF;font-size:13px;font-weight:900;cursor:pointer;">'+(st.activeShift.breakOpen ? '▶ Continuar' : '⏸ Descanso')+'</button>';
      h += '<button onclick="_jpClockOut()" style="flex:1;padding:11px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:10px;color:#1B1306;font-size:13px;font-weight:900;cursor:pointer;">PONCHAR SALIDA</button>';
      h += '</div>';
      h += '</div>';
    }

    // Action buttons — clock in + start trip (when none active)
    h += '<div style="padding:14px 14px 0;">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    if (!st.activeShift) {
      h += '<button onclick="_jpClockIn()" style="padding:18px 14px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:14px;color:#FFFFFF;font-size:14px;font-weight:900;letter-spacing:0.4px;cursor:pointer;box-shadow:0 4px 14px rgba(5,150,105,0.3);"><div style="font-size:28px;">⏱</div><div style="margin-top:4px;">PONCHAR ENTRADA</div></button>';
    } else {
      h += '<button onclick="_jpNav(\'shifts\')" style="padding:18px 14px;background:linear-gradient(135deg,#1B2845,#2A3A60);border:2px solid #3A4E7C;border-radius:14px;color:#FFFFFF;font-size:13px;font-weight:800;cursor:pointer;"><div style="font-size:22px;">⏱</div><div style="margin-top:4px;">Ver turnos</div></button>';
    }
    if (!st.activeTrip) {
      h += '<button onclick="_jpStartTrip()" style="padding:18px 14px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;color:#FFFFFF;font-size:14px;font-weight:900;letter-spacing:0.4px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.35);"><div style="font-size:28px;">🚗</div><div style="margin-top:4px;">EMPEZAR VIAJE</div></button>';
    } else {
      h += '<button onclick="_jpEndTrip()" style="padding:18px 14px;background:linear-gradient(135deg,#7F1D1D,#B91C1C);border:2px solid #FCA5A5;border-radius:14px;color:#FFFFFF;font-size:14px;font-weight:900;cursor:pointer;"><div style="font-size:28px;">⏹</div><div style="margin-top:4px;">TERMINAR VIAJE</div></button>';
    }
    h += '</div>';
    h += '</div>';

    // Geo warning
    if (_geoDenied) {
      h += '<div style="margin:12px 14px 0;padding:12px 14px;background:linear-gradient(135deg,#78350F 0%,#5C2810 100%);border:2px solid #F59E0B;border-radius:12px;">';
      h += '<div style="color:#FDE68A;font-size:11px;font-weight:900;letter-spacing:1.2px;">⚠️ GPS NO DISPONIBLE</div>';
      h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;margin-top:5px;line-height:1.5;">Activa permisos de ubicación o usa el botón <b>EMPEZAR VIAJE</b> manualmente. Nota: PWA rastrea solo cuando la app está abierta.</div>';
      h += '</div>';
    } else if (!st.autoTrack) {
      h += '<div style="margin:12px 14px 0;padding:10px 14px;background:#1B2845;border:1.5px solid #3A4E7C;border-radius:10px;display:flex;align-items:center;gap:10px;">';
      h += '<div style="color:#FFFFFF;font-size:12px;font-weight:700;flex:1;">Auto-detección GPS: <span style="color:#E8C97A;font-weight:900;">APAGADA</span></div>';
      h += '<button onclick="_jpToggleAutoTrack()" style="padding:6px 11px;background:linear-gradient(135deg,#065F46,#059669);border:1.5px solid #34D399;border-radius:8px;color:#FFFFFF;font-size:11px;font-weight:900;cursor:pointer;">Activar</button>';
      h += '</div>';
    }

    // TODAY card grid
    h += '<div style="padding:16px 14px 0;"><div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.8px;margin-bottom:10px;">📊 HOY</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    h += _dashCard('⏱', 'Horas trabajadas', _fmtDurHM(today.workedMs), 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)', '#34D399', '#D1FAE5');
    h += _dashCard('🚗', 'Millas de trabajo', _fmtMiles(today.workMi), 'linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%)', '#C9A961', '#E8C97A');
    h += _dashCard('💵', 'Ganado', _fmtMoney(today.earned), 'linear-gradient(135deg,#8B6B20 0%,#A88A42 55%,#C9A961 100%)', '#E8C97A', '#FFF4D6');
    h += _dashCard('⛽', 'Gasto gasolina', _fmtMoney(today.gasCost), 'linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)', '#FCA5A5', '#FECACA');
    h += '</div>';

    // Goal progress
    h += '<div style="margin-top:12px;padding:16px;background:'+goalBg+';border:2px solid '+goalColor+';border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
    h += '<div style="color:#FFFFFF;font-size:12px;font-weight:900;letter-spacing:1.2px;">🎯 META DEL DÍA</div>';
    h += '<div style="color:#FFFFFF;font-size:11px;font-weight:800;">'+pctGoal+'%</div>';
    h += '</div>';
    h += '<div style="color:#FFFFFF;font-size:20px;font-weight:900;margin-top:6px;letter-spacing:-0.01em;">'+_fmtMoney(today.earned)+' <span style="color:rgba(255,255,255,0.7);font-size:14px;font-weight:700;">de '+_fmtMoney(settings.dailyGoal)+'</span></div>';
    h += '<div style="margin-top:10px;height:10px;background:rgba(0,0,0,0.35);border-radius:5px;overflow:hidden;"><div style="height:100%;width:'+pctGoal+'%;background:#FFFFFF;"></div></div>';
    h += '</div>';

    // Net + IRS
    h += '<div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    h += _dashCard('💰', '$ Neto hoy', _fmtMoney(today.net), 'linear-gradient(135deg,#0F766E 0%,#0D9488 55%,#14B8A6 100%)', '#2DD4BF', '#CCFBF1');
    h += _dashCard('📑', 'Deducción IRS', _fmtMoney(today.irsDeduction), 'linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%)', '#C9A961', '#FFF4D6');
    h += '</div>';
    h += '</div>';

    // WEEK summary
    h += '<div style="padding:16px 14px 0;">';
    h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.8px;margin-bottom:10px;">📅 ÚLTIMOS 7 DÍAS</div>';
    h += '<div style="padding:14px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;">';
    h += _miniRow('Horas', _fmtDurHM(week.workedMs));
    h += _miniRow('Millas trabajo', _fmtMiles(week.workMi));
    h += _miniRow('Ganado', _fmtMoney(week.earned));
    h += _miniRow('Gasolina', _fmtMoney(week.gasCost));
    h += _miniRow('Neto', _fmtMoney(week.net), true);
    h += _miniRow('Deducción IRS', _fmtMoney(week.irsDeduction));
    h += '</div></div>';

    // MONTH summary
    h += '<div style="padding:16px 14px 0;">';
    h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.8px;margin-bottom:10px;">📆 ÚLTIMOS 30 DÍAS</div>';
    h += '<div style="padding:14px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:14px;">';
    h += _miniRow('Horas', _fmtDurHM(month.workedMs), false, '#D1FAE5');
    h += _miniRow('Millas trabajo', _fmtMiles(month.workMi), false, '#D1FAE5');
    h += _miniRow('Ganado', _fmtMoney(month.earned), false, '#D1FAE5');
    h += _miniRow('Gasolina', _fmtMoney(month.gasCost), false, '#D1FAE5');
    h += _miniRow('Neto', _fmtMoney(month.net), true, '#FFFFFF');
    h += _miniRow('Deducción IRS', _fmtMoney(month.irsDeduction), false, '#D1FAE5');
    h += '</div></div>';

    return h;
  }

  function _dashCard(icon, label, value, bg, border, labelColor) {
    var h = '';
    h += '<div style="padding:14px 13px;background:'+bg+';border:2px solid '+border+';border-radius:13px;box-shadow:0 3px 12px rgba(0,0,0,0.3);">';
    h += '<div style="font-size:22px;line-height:1;">'+icon+'</div>';
    h += '<div style="color:'+(labelColor||'#FFFFFF')+';font-size:10px;font-weight:900;letter-spacing:1px;margin-top:6px;">'+label.toUpperCase()+'</div>';
    h += '<div style="color:#FFFFFF;font-size:18px;font-weight:900;margin-top:4px;letter-spacing:-0.01em;line-height:1.1;">'+value+'</div>';
    h += '</div>';
    return h;
  }

  function _miniRow(label, value, bold, color) {
    color = color || '#FFFFFF';
    var fw = bold ? '900' : '700';
    var fs = bold ? '16px' : '14px';
    return '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:5px 0;'+(bold?'border-top:1px solid rgba(255,255,255,0.15);margin-top:6px;padding-top:10px;':'')+'"><span style="color:'+color+';font-size:13px;font-weight:700;opacity:0.9;">'+label+'</span><span style="color:#FFFFFF;font-size:'+fs+';font-weight:'+fw+';">'+value+'</span></div>';
  }

  // ═══════════════════════════════════════════════
  // RENDER — TRIPS
  // ═══════════════════════════════════════════════
  function _renderTrips() {
    var settings = _getSettings();
    var trips = _getTrips();
    var filtered = _filterByRange(trips, 'startTs', _tripFilter);

    var totalMi = 0, workMi = 0;
    for (var i = 0; i < filtered.length; i++) {
      totalMi += filtered[i].distanceMi || 0;
      if (filtered[i].category === 'Trabajo') workMi += filtered[i].distanceMi || 0;
    }
    var deduction = workMi * (settings.irsRate / 100);

    var h = '';
    h += '<div style="padding:14px 14px 0;">';

    // Filters
    h += '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">';
    var ranges = [['today','Hoy'],['week','Semana'],['month','Mes'],['all','Todo']];
    for (var r = 0; r < ranges.length; r++) {
      var active = _tripFilter === ranges[r][0];
      var bg = active ? 'linear-gradient(135deg,#E8C97A,#C9A961)' : '#1B2845';
      var col = active ? '#1B1306' : '#FFFFFF';
      var bd = active ? '#F5D58A' : '#3A4E7C';
      h += '<button onclick="_jpFilter(\'trips\',\''+ranges[r][0]+'\')" style="flex:1;padding:9px;background:'+bg+';border:1.5px solid '+bd+';border-radius:9px;color:'+col+';font-size:12px;font-weight:900;cursor:pointer;">'+ranges[r][1]+'</button>';
    }
    h += '</div>';

    // Summary
    h += '<div style="padding:14px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
    h += '<div style="display:flex;gap:14px;flex-wrap:wrap;">';
    h += '<div style="flex:1;min-width:90px;"><div style="color:#C9A961;font-size:10px;font-weight:900;letter-spacing:1.2px;">TOTAL</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:3px;">'+_fmtMiles(totalMi)+'</div></div>';
    h += '<div style="flex:1;min-width:90px;"><div style="color:#C9A961;font-size:10px;font-weight:900;letter-spacing:1.2px;">TRABAJO</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:3px;">'+_fmtMiles(workMi)+'</div></div>';
    h += '<div style="flex:1;min-width:90px;"><div style="color:#C9A961;font-size:10px;font-weight:900;letter-spacing:1.2px;">DEDUCCIÓN</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:3px;">'+_fmtMoney(deduction)+'</div></div>';
    h += '</div></div>';

    // Add manual trip button
    h += '<button onclick="_jpAddManualTrip()" style="width:100%;margin-top:12px;padding:12px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:12px;color:#FFFFFF;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 3px 10px rgba(5,150,105,0.3);">+ AGREGAR VIAJE MANUAL</button>';

    // List
    h += '<div style="margin-top:14px;display:grid;gap:10px;">';
    if (filtered.length === 0) {
      h += '<div style="padding:26px 16px;text-align:center;background:#1B2845;border:1.5px dashed #3A4E7C;border-radius:12px;color:#E0E7F2;font-size:13px;font-weight:600;">No hay viajes en este rango. Manéjate y captúralos automático, o usa el botón manual.</div>';
    } else {
      for (var t = 0; t < filtered.length; t++) {
        var trip = filtered[t];
        var dur = trip.endTs && trip.startTs ? trip.endTs - trip.startTs : 0;
        var catBg = trip.category === 'Trabajo'
          ? 'linear-gradient(135deg,#065F46,#059669)'
          : trip.category === 'Personal'
          ? 'linear-gradient(135deg,#7F1D1D,#B91C1C)'
          : 'linear-gradient(135deg,#1B2845,#3A4E7C)';
        var catBorder = trip.category === 'Trabajo' ? '#34D399' : trip.category === 'Personal' ? '#FCA5A5' : '#C9A961';
        var deduct = (trip.category === 'Trabajo') ? (trip.distanceMi || 0) * (settings.irsRate / 100) : 0;

        h += '<div style="padding:14px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:1.5px solid #3A4E7C;border-radius:12px;">';
        h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">';
        h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:17px;font-weight:900;">'+_fmtMiles(trip.distanceMi || 0)+'</div>';
        h += '<div style="color:#E0E7F2;font-size:12px;font-weight:700;margin-top:3px;">'+_fmtDate(trip.startTs)+' · '+_fmtTime(trip.startTs)+' → '+_fmtTime(trip.endTs)+' · '+_fmtDurHM(dur)+'</div>';
        if (deduct > 0) {
          h += '<div style="color:#E8C97A;font-size:12px;font-weight:900;margin-top:4px;">📑 Deducción: '+_fmtMoney(deduct)+'</div>';
        }
        h += '</div>';
        h += '<span style="padding:5px 10px;background:'+catBg+';border:1.5px solid '+catBorder+';border-radius:8px;color:#FFFFFF;font-size:10px;font-weight:900;letter-spacing:0.8px;">'+(trip.category||'Trabajo').toUpperCase()+'</span>';
        h += '</div>';
        // Change category + map + delete
        h += '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">';
        var cats2 = ['Trabajo','Personal','Commute'];
        for (var ci2 = 0; ci2 < cats2.length; ci2++) {
          var cv = cats2[ci2];
          var aa = (trip.category || 'Trabajo') === cv;
          h += '<button onclick="_jpUpdateTripCategory(\''+trip.id+'\',\''+cv+'\')" style="flex:1;padding:7px 6px;background:'+(aa?'#E8C97A':'#0F1D32')+';border:1px solid '+(aa?'#F5D58A':'#3A4E7C')+';border-radius:7px;color:'+(aa?'#1B1306':'#E0E7F2')+';font-size:11px;font-weight:'+(aa?'900':'700')+';cursor:pointer;">'+cv+'</button>';
        }
        var hasRoute = trip.pings && trip.pings.length >= 2;
        if (hasRoute) {
          h += '<button onclick="_jpOpenMap(\''+trip.id+'\')" style="padding:7px 11px;background:linear-gradient(135deg,#065F46,#059669);border:1px solid #34D399;border-radius:7px;color:#FFFFFF;font-size:11px;font-weight:900;cursor:pointer;">🗺 Mapa</button>';
        }
        h += '<button onclick="_jpDeleteTrip(\''+trip.id+'\')" style="padding:7px 11px;background:linear-gradient(135deg,#7F1D1D,#B91C1C);border:1px solid #FCA5A5;border-radius:7px;color:#FFFFFF;font-size:11px;font-weight:900;cursor:pointer;">🗑</button>';
        h += '</div>';
        h += '</div>';
      }
    }
    h += '</div>';
    h += '</div>';
    return h;
  }

  // ═══════════════════════════════════════════════
  // RENDER — SHIFTS
  // ═══════════════════════════════════════════════
  function _renderShifts() {
    var settings = _getSettings();
    var shifts = _getShifts();
    var filtered = _filterByRange(shifts, 'clockInTs', _shiftFilter);

    var totalMs = 0;
    for (var i = 0; i < filtered.length; i++) totalMs += _shiftNetMs(filtered[i]);
    var earned = (totalMs / 3600000) * settings.hourlyRate;

    var h = '';
    h += '<div style="padding:14px 14px 0;">';

    // Filters
    h += '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">';
    var ranges = [['today','Hoy'],['week','Semana'],['month','Mes'],['all','Todo']];
    for (var r = 0; r < ranges.length; r++) {
      var active = _shiftFilter === ranges[r][0];
      var bg = active ? 'linear-gradient(135deg,#E8C97A,#C9A961)' : '#1B2845';
      var col = active ? '#1B1306' : '#FFFFFF';
      var bd = active ? '#F5D58A' : '#3A4E7C';
      h += '<button onclick="_jpFilter(\'shifts\',\''+ranges[r][0]+'\')" style="flex:1;padding:9px;background:'+bg+';border:1.5px solid '+bd+';border-radius:9px;color:'+col+';font-size:12px;font-weight:900;cursor:pointer;">'+ranges[r][1]+'</button>';
    }
    h += '</div>';

    // Summary
    h += '<div style="padding:14px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:14px;box-shadow:0 4px 14px rgba(5,150,105,0.3);">';
    h += '<div style="display:flex;gap:14px;flex-wrap:wrap;">';
    h += '<div style="flex:1;min-width:90px;"><div style="color:#D1FAE5;font-size:10px;font-weight:900;letter-spacing:1.2px;">HORAS</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:3px;">'+_fmtDurHM(totalMs)+'</div></div>';
    h += '<div style="flex:1;min-width:90px;"><div style="color:#D1FAE5;font-size:10px;font-weight:900;letter-spacing:1.2px;">GANADO</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:3px;">'+_fmtMoney(earned)+'</div></div>';
    h += '<div style="flex:1;min-width:90px;"><div style="color:#D1FAE5;font-size:10px;font-weight:900;letter-spacing:1.2px;">RATE</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:3px;">'+_fmtMoney(settings.hourlyRate)+'/hr</div></div>';
    h += '</div></div>';

    // List
    h += '<div style="margin-top:14px;display:grid;gap:10px;">';
    if (filtered.length === 0) {
      h += '<div style="padding:26px 16px;text-align:center;background:#1B2845;border:1.5px dashed #3A4E7C;border-radius:12px;color:#E0E7F2;font-size:13px;font-weight:600;">No hay turnos en este rango. Usa "Ponchar entrada" cuando arranques el día.</div>';
    } else {
      for (var s = 0; s < filtered.length; s++) {
        var sh = filtered[s];
        var netMs = _shiftNetMs(sh);
        var gross = sh.clockOutTs ? sh.clockOutTs - sh.clockInTs : 0;
        var brkCount = sh.breaks ? sh.breaks.length : 0;
        var earn = (netMs / 3600000) * settings.hourlyRate;

        h += '<div style="padding:14px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:1.5px solid #3A4E7C;border-radius:12px;">';
        h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">';
        h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:17px;font-weight:900;">'+_fmtDurHM(netMs)+' · '+_fmtMoney(earn)+'</div>';
        h += '<div style="color:#E0E7F2;font-size:12px;font-weight:700;margin-top:3px;">'+_fmtDate(sh.clockInTs)+' · '+_fmtTime(sh.clockInTs)+' → '+_fmtTime(sh.clockOutTs)+'</div>';
        if (sh.jobName) h += '<div style="color:#E8C97A;font-size:12px;font-weight:800;margin-top:3px;">Job: '+_esc(sh.jobName)+'</div>';
        if (brkCount > 0) {
          h += '<div style="color:#94A3B8;font-size:11px;font-weight:700;margin-top:3px;">'+brkCount+' descanso'+(brkCount===1?'':'s')+' · bruto '+_fmtDurHM(gross)+'</div>';
          h += '<div style="margin-top:6px;display:flex;flex-direction:column;gap:4px;">';
          for (var bi = 0; bi < sh.breaks.length; bi++) {
            var brk = sh.breaks[bi];
            var brkDur = (brk.endTs || Date.now()) - brk.startTs;
            var brkLbl = brk.reason ? _esc(brk.reason) : 'Descanso';
            h += '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:5px 9px;background:#0F1D32;border:1px solid #3A4E7C;border-radius:7px;">';
            h += '<span style="color:#E0E7F2;font-size:11px;font-weight:700;">⏸ '+brkLbl+'</span>';
            h += '<span style="color:#94A3B8;font-size:11px;font-weight:700;">'+_fmtDurHM(brkDur)+'</span>';
            h += '</div>';
          }
          h += '</div>';
        }
        h += '</div>';
        h += '<button onclick="_jpDeleteShift(\''+sh.id+'\')" style="padding:7px 11px;background:linear-gradient(135deg,#7F1D1D,#B91C1C);border:1px solid #FCA5A5;border-radius:7px;color:#FFFFFF;font-size:11px;font-weight:900;cursor:pointer;">🗑</button>';
        h += '</div></div>';
      }
    }
    h += '</div>';
    h += '</div>';
    return h;
  }

  // ═══════════════════════════════════════════════
  // RENDER — SETTINGS
  // ═══════════════════════════════════════════════
  function _renderSettings() {
    var s = _getSettings();
    var st = _getAppState();

    var h = '';
    h += '<div style="padding:14px 14px 0;">';

    h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.8px;margin-bottom:10px;">⚙️ AJUSTES</div>';

    h += _settingField('hourlyRate',  '💵 Tarifa por hora',      '$/hora',       s.hourlyRate,  '0.01');
    h += _settingField('dailyGoal',   '🎯 Meta diaria',          '$',            s.dailyGoal,   '1');
    h += _settingField('mpg',         '🚚 MPG del vehículo',     'millas/galón', s.mpg,         '0.1');
    h += _settingField('gasPrice',    '⛽ Precio gasolina',       '$/galón',      s.gasPrice,    '0.01');
    h += _settingField('irsRate',     '📑 Tasa IRS (2026)',      '¢/milla',      s.irsRate,     '0.1');

    // Auto-track toggle
    h += '<div style="margin-top:14px;padding:14px 16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:12px;display:flex;align-items:center;gap:12px;">';
    h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:14px;font-weight:900;">🛰 Auto-detección GPS</div>';
    h += '<div style="color:#E0E7F2;font-size:11px;font-weight:600;margin-top:3px;line-height:1.4;">Detecta viajes automáticamente con velocidad > 5 mph. Solo funciona con la app abierta.</div></div>';
    var onLabel = st.autoTrack ? 'ON' : 'OFF';
    var onBg = st.autoTrack ? 'linear-gradient(135deg,#065F46,#059669)' : 'linear-gradient(135deg,#7F1D1D,#B91C1C)';
    var onBd = st.autoTrack ? '#34D399' : '#FCA5A5';
    h += '<button onclick="_jpToggleAutoTrack()" style="padding:10px 16px;background:'+onBg+';border:2px solid '+onBd+';border-radius:10px;color:#FFFFFF;font-size:13px;font-weight:900;cursor:pointer;min-width:64px;">'+onLabel+'</button>';
    h += '</div>';

    // Estimates
    var est = s.hourlyRate * 8;
    h += '<div style="margin-top:14px;padding:14px;background:linear-gradient(135deg,#8B6B20 0%,#A88A42 55%,#C9A961 100%);border:2px solid #E8C97A;border-radius:12px;">';
    h += '<div style="color:#1B1306;font-size:11px;font-weight:900;letter-spacing:1.2px;">💡 ESTIMADO</div>';
    h += '<div style="color:#1B1306;font-size:15px;font-weight:800;margin-top:5px;line-height:1.5;">8 hrs a '+_fmtMoney(s.hourlyRate)+'/hr = <b>'+_fmtMoney(est)+'</b><br/>100 mi trabajo × '+s.irsRate+'¢ = <b>'+_fmtMoney(100 * s.irsRate / 100)+'</b> deducción</div>';
    h += '</div>';

    // Danger zone
    h += '<div style="margin-top:24px;padding:14px 16px;background:linear-gradient(135deg,#450a0a 0%,#7F1D1D 100%);border:1.5px solid #991B1B;border-radius:12px;">';
    h += '<div style="color:#FCA5A5;font-size:11px;font-weight:900;letter-spacing:1.2px;">⚠️ ZONA PELIGROSA</div>';
    h += '<button onclick="_jpClearAll()" style="margin-top:10px;width:100%;padding:11px;background:linear-gradient(135deg,#7F1D1D,#B91C1C);border:1.5px solid #FCA5A5;border-radius:10px;color:#FFFFFF;font-size:12px;font-weight:900;cursor:pointer;">Borrar todos los datos</button>';
    h += '</div>';

    h += '</div>';
    return h;
  }

  function _settingField(field, label, suffix, value, step) {
    var h = '';
    h += '<div style="margin-bottom:10px;padding:14px 16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:1.5px solid #3A4E7C;border-radius:12px;">';
    h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1px;">'+label+'</div>';
    h += '<div style="display:flex;align-items:center;gap:8px;margin-top:6px;">';
    h += '<input type="number" step="'+step+'" value="'+value+'" onchange="_jpSettings(\''+field+'\', this.value)" style="flex:1;padding:11px 13px;background:#0F1D32;border:2px solid #3A4E7C;border-radius:9px;color:#FFFFFF;font-size:16px;font-weight:900;outline:none;-webkit-appearance:none;" />';
    h += '<span style="color:#E0E7F2;font-size:12px;font-weight:800;min-width:70px;">'+suffix+'</span>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  window._jpClearAll = function() {
    if (!confirm('¿Seguro? Esto borra TODOS los viajes, turnos y ajustes. No se puede deshacer.')) return;
    try {
      localStorage.removeItem(KEY_SETTINGS);
      localStorage.removeItem(KEY_TRIPS);
      localStorage.removeItem(KEY_SHIFTS);
      localStorage.removeItem(KEY_STATE);
    } catch(e) {}
    _alert('Datos borrados.', 'success');
    _view = 'dashboard';
    _render();
  };

  // ═══════════════════════════════════════════════
  // RENDER — EXPORT
  // ═══════════════════════════════════════════════
  function _renderExport() {
    var trips = _getTrips();
    var shifts = _getShifts();
    var h = '';
    h += '<div style="padding:14px 14px 0;">';
    h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.8px;margin-bottom:10px;">📤 EXPORTAR CSV</div>';
    h += '<div style="color:#E0E7F2;font-size:13px;font-weight:600;line-height:1.5;margin-bottom:14px;">Descarga tus registros como CSV para Excel, QuickBooks o tu contador. Categoría "Trabajo" incluye la deducción IRS automática.</div>';

    h += '<div style="padding:16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;margin-bottom:12px;">';
    h += '<div style="display:flex;align-items:center;gap:12px;">';
    h += '<div style="font-size:30px;">🚗</div>';
    h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:15px;font-weight:900;">Viajes (mileage)</div>';
    h += '<div style="color:#E0E7F2;font-size:12px;font-weight:700;margin-top:3px;">'+trips.length+' viajes · fecha, millas, categoría, deducción</div></div>';
    h += '</div>';
    h += '<button onclick="_jpExportCSV(\'trips\')" style="margin-top:12px;width:100%;padding:12px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:10px;color:#1B1306;font-size:13px;font-weight:900;letter-spacing:0.5px;cursor:pointer;">DESCARGAR CSV DE VIAJES</button>';
    h += '</div>';

    h += '<div style="padding:16px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:14px;">';
    h += '<div style="display:flex;align-items:center;gap:12px;">';
    h += '<div style="font-size:30px;">⏱</div>';
    h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:15px;font-weight:900;">Turnos (horas)</div>';
    h += '<div style="color:#D1FAE5;font-size:12px;font-weight:700;margin-top:3px;">'+shifts.length+' turnos · clock-in/out, duración, ganado</div></div>';
    h += '</div>';
    h += '<button onclick="_jpExportCSV(\'shifts\')" style="margin-top:12px;width:100%;padding:12px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:10px;color:#1B1306;font-size:13px;font-weight:900;letter-spacing:0.5px;cursor:pointer;">DESCARGAR CSV DE TURNOS</button>';
    h += '</div>';

    h += '<div style="margin-top:16px;padding:12px 14px;background:#1B2845;border:1.5px solid #3A4E7C;border-radius:10px;">';
    h += '<div style="color:#94A3B8;font-size:11px;font-weight:700;line-height:1.5;">💡 Tip: usa la categoría "Trabajo" consistentemente — es lo que determina la deducción de millas deducibles según el IRS (tasa '+_getSettings().irsRate+'¢/mi para 2026).</div>';
    h += '</div>';

    h += '</div>';
    return h;
  }

  // ═══════════════════════════════════════════════
  // STYLES (injected once)
  // ═══════════════════════════════════════════════
  function _injectStyles() {
    if (document.getElementById('jpStyles')) return;
    var st = document.createElement('style');
    st.id = 'jpStyles';
    st.textContent = '' +
      '@keyframes jpPulse { 0% { box-shadow:0 0 0 0 rgba(110,231,183,0.6);} 70% { box-shadow:0 0 0 12px rgba(110,231,183,0);} 100% { box-shadow:0 0 0 0 rgba(110,231,183,0);} }' +
      '#jornalProScreen input[type=number]::-webkit-inner-spin-button, #jornalProScreen input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }' +
      '#jornalProScreen input[type=number] { -moz-appearance:textfield; }';
    document.head.appendChild(st);
  }

  // ═══════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════
  function _render() {
    var screen = _jpEnsureScreen();
    var body;
    try {
      if (_view === 'trips')         body = _renderTrips();
      else if (_view === 'shifts')   body = _renderShifts();
      else if (_view === 'settings') body = _renderSettings();
      else if (_view === 'export')   body = _renderExport();
      else                           body = _renderDashboard();
    } catch(e) {
      body = '<div style="padding:24px;color:#fff;background:#7a1d1d;font-size:13px;">Error: ' + _esc(String(e && e.message || e)) + '</div>';
    }

    var shell = '';
    shell += _header('Jornal Pro');
    shell += _tabs();
    shell += '<div style="padding-bottom:200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 130px);">';
    shell += body;
    shell += '</div>';
    screen.innerHTML = shell;
  }

  // ═══════════════════════════════════════════════
  // LIVE TICK — refresh timers on dashboard
  // ═══════════════════════════════════════════════
  function _stopTick() {
    if (_tickTimer) { clearInterval(_tickTimer); _tickTimer = null; }
  }

  function _startTick() {
    if (_tickTimer) return;
    _tickTimer = setInterval(function(){
      var screen = document.getElementById('jornalProScreen');
      if (!screen || screen.style.display === 'none' || screen.offsetParent === null) return;
      if (_view !== 'dashboard') return;
      var st = _getAppState();
      if (st.activeTrip) {
        var el1 = screen.querySelector('[data-jp-live="trip"]');
        if (el1) el1.textContent = _fmtHMS(Date.now() - st.activeTrip.startTs);
      }
      if (st.activeShift) {
        var el2 = screen.querySelector('[data-jp-live="shift"]');
        if (el2) el2.textContent = _fmtHMS(_shiftNetMs(st.activeShift));
      }
    }, 1000);
  }

  // ═══════════════════════════════════════════════
  // ENTRY POINT
  // ═══════════════════════════════════════════════
  // Render-only — safe to call repeatedly (e.g. from navigation lazy-load hook).
  // Does NOT call showScreen, so it cannot recurse back into the navigator.
  window.initJornalPro = function() {
    _injectStyles();
    _jpEnsureScreen();
    if (_view !== 'trips' && _view !== 'shifts' && _view !== 'settings' && _view !== 'export') {
      _view = 'dashboard';
    }
    _render();
    _startTick();
    var st = _getAppState();
    if (st.autoTrack) _jpStartGeo();
  };

  // Entry point used by the dashboard tile — renders then navigates once.
  window.openJornalPro = function() {
    try { window.initJornalPro(); } catch(e) {}
    if (typeof window.showScreen === 'function') {
      try { window.showScreen('jornalProScreen'); } catch(e) {}
    }
  };

})();
