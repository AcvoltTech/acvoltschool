// ================================================================
// BLE Manager — Bluetooth bridge for HVAC tools (Fieldpiece, etc.)
// iOS: native bridge via WKWebView (BLEManager.swift)
// Android/Web: Web Bluetooth API fallback (navigator.bluetooth)
// ================================================================
(function() {
  'use strict';

  // ── Detection ──
  var _isNative = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['ble-scan']);
  var _hasWebBluetooth = !_isNative && !!navigator.bluetooth;
  var _ua = (navigator.userAgent || '').toLowerCase();
  var _isAndroid = _ua.indexOf('android') !== -1;
  var _isIOS = /iphone|ipad|ipod/.test(_ua);
  var _isChromeAndroid = _isAndroid && /chrome\//.test(_ua) && !/samsungbrowser|firefox|opr\//.test(_ua);
  var _isSamsungBrowser = /samsungbrowser/.test(_ua);
  var _isFirefoxAndroid = _isAndroid && /firefox/.test(_ua);
  // True when running in our Play Store Android app (bridge injected by MainActivity.kt)
  var _isAndroidApp = !!window.isAndroidApp;
  var _devices = {};
  var _connected = null;         // latest connected device (backward compat)
  var _connectedDevices = {};    // all connected devices by UUID (multi-connection)
  var _scanning = false;
  var _beaconMode = false;       // true when any beacon device is active
  var _bleState = 'unknown';
  var _listeners = {};
  var _liveData = {};

  // Web Bluetooth state
  var _webBTDevice = null;
  var _webBTServer = null;
  var _webBTCharacteristics = [];

  // Connection timeout (15s) and reconnection config
  var _CONNECTION_TIMEOUT_MS = 15000;
  var _RECONNECT_MAX_RETRIES = 3;
  var _RECONNECT_DELAY_MS = 2000;
  var _reconnectAttempts = 0;
  var _reconnectTimer = null;
  var _lastConnectedDeviceId = null;

  // Native scan timeout (30s) to prevent battery drain
  var _SCAN_TIMEOUT_MS = 30000;
  var _scanTimeoutTimer = null;

  // Known HVAC tool name prefixes for Web Bluetooth filter
  var _knownToolPrefixes = ['T557','T550','Testo','testo','Fieldpiece','FP-','JL3','JL2','SMAN','SRS','SDP','Mastercool','Yellow Jacket','YJ-','Supco'];

  // Testo 557s confirmed UUIDs
  var TESTO_DATA_SERVICE = '0000fff0-0000-1000-8000-00805f9b34fb';
  var TESTO_WRITE_CHAR   = '0000fff1-0000-1000-8000-00805f9b34fb';
  var TESTO_NOTIFY_CHAR  = '0000fff2-0000-1000-8000-00805f9b34fb';
  var TESTO_PROP_SVC1    = 'd0611e78-bbb4-4591-a5f8-487910ae4366';
  var TESTO_PROP_CHAR1   = '8667556c-9a37-4c91-84ed-54ee27d90049';
  var TESTO_PROP_SVC2    = '9fa480e0-4967-4542-9390-d343dc5d04ae';
  var TESTO_PROP_CHAR2   = 'af0badb1-5b99-43cd-917a-a77bc549e3cc';

  // Device info
  var _deviceInfo = {};

  // ── Send command to native (iOS only) ──
  function _send(name, body) {
    if (!_isNative) return;
    try {
      window.webkit.messageHandlers[name].postMessage(body || '');
    } catch(e) {
      console.warn('[BLE] Native bridge error:', e);
    }
  }

  // ── Event system ──
  function _on(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
  }

  function _off(event, fn) {
    if (!_listeners[event]) return;
    _listeners[event] = _listeners[event].filter(function(f) { return f !== fn; });
  }

  function _emit(event, data) {
    if (!_listeners[event]) return;
    _listeners[event].forEach(function(fn) {
      try { fn(data); } catch(e) { console.error('[BLE] Listener error:', e); }
    });
  }

  // ── Listen for native events (iOS bridge) ──
  function _listenNative(eventName, handler) {
    window.addEventListener(eventName, function(e) {
      handler(e.detail || {});
    });
  }

  // Device found
  _listenNative('ble-device-found', function(d) {
    _devices[d.uuid] = d;
    _emit('device', d);
  });

  // Scanning state
  _listenNative('ble-scanning', function(d) {
    _scanning = !!d.scanning;
    _emit('scanning', _scanning);
  });

  // Connected
  _listenNative('ble-connected', function(d) {
    _connected = d;
    if (d.uuid) _connectedDevices[d.uuid] = d;
    _emit('connected', d);
  });

  // Connecting
  _listenNative('ble-connecting', function(d) {
    _emit('connecting', d);
  });

  // Disconnected
  _listenNative('ble-disconnected', function(d) {
    if (d.uuid) delete _connectedDevices[d.uuid];
    // Only clear _connected if this was the active device
    if (_connected && _connected.uuid === d.uuid) {
      var remaining = Object.keys(_connectedDevices);
      _connected = remaining.length > 0 ? _connectedDevices[remaining[0]] : null;
    }
    // Don't wipe _liveData — other devices may still be sending data
    _emit('disconnected', d);
  });

  // BLE state change
  _listenNative('ble-state', function(d) {
    _bleState = d.state || 'unknown';
    _emit('state', d);
  });

  // Services discovered
  _listenNative('ble-services', function(d) {
    _emit('services', d);
  });

  // Characteristics discovered
  _listenNative('ble-characteristics', function(d) {
    _emit('characteristics', d);
  });

  // Live data from sensors (GATT)
  // Native bridge sends raw bytes — parse them through _parseCharValue like Web Bluetooth
  // Fix #3: Wrap in try/catch to prevent malformed native BLE packets from crashing
  _listenNative('ble-data', function(d) {
    try {
      // Fieldpiece beacons: old Swift parses natively and sends pre-decoded
      // fields (source/probeCategory/dryBulbF/voltageAC/...) with NO
      // characteristicUUID. Forward directly so _fpAggregateAndDisplay sees it.
      if (d.source === 'fieldpiece' || d.probeCategory) {
        if (!d.timestamp) d.timestamp = Date.now();
        if (!d._uuid && d.uuid) d._uuid = d.uuid;
        if (d.uuid) _liveData['beacon_' + d.uuid] = d;
        _emit('data', d);
        return;
      }
      if (d.bytes && d.bytes.length > 0 && d.characteristicUUID) {
        var buffer = new ArrayBuffer(d.bytes.length);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < d.bytes.length; i++) view[i] = d.bytes[i];
        var parsed = _parseCharValue(new DataView(buffer), d.characteristicUUID);
        parsed.serviceUUID = d.serviceUUID || '';
        _liveData[d.characteristicUUID] = parsed;
        _emit('data', parsed);
      } else if (d.characteristicUUID) {
        _liveData[d.characteristicUUID] = d;
        _emit('data', d);
      }
    } catch(e) {
      console.warn('[BLE] Native data parse error:', e.message);
    }
  });

  // Beacon advertisement data (Fieldpiece FP-424B, JL3, SC680 — no GATT connection needed)
  // Native bridge sends raw manufacturer bytes — parse them for sensor values
  // Fix #3: Wrap in try/catch to prevent malformed beacon data from crashing
  _listenNative('ble-beacon-data', function(d) {
    try {
    var parsed = null;
    // Swift sends raw bytes as `manufacturerBytes` (not `bytes`). Accept both.
    var rawBytes = (d.bytes && d.bytes.length > 0) ? d.bytes
                 : (d.manufacturerBytes && d.manufacturerBytes.length > 0) ? d.manufacturerBytes
                 : null;
    if (rawBytes && rawBytes.length > 0) {
      // Fieldpiece signature: first two bytes are "FP" (0x46 0x50).
      var hasFP = rawBytes.length >= 4 && rawBytes[0] === 0x46 && rawBytes[1] === 0x50;
      if (hasFP || _isFieldpieceBeacon(d.name)) {
        parsed = _parseFieldpieceBeacon(rawBytes, d.uuid, d.name);
      } else {
        var buffer = new ArrayBuffer(rawBytes.length);
        var view = new Uint8Array(buffer);
        for (var j = 0; j < rawBytes.length; j++) view[j] = rawBytes[j];
        parsed = _parseCharValue(new DataView(buffer), 'beacon_' + d.uuid);
        parsed.uuid = d.uuid;
        parsed.name = d.name;
      }
    }

    // Merge raw event (uuid/name/rssi) on top but let parsed rich fields win
    // for anything the event explicitly lacks. Swift only sends raw bytes now,
    // so parsed is authoritative for probeCategory / sensor values.
    var out = parsed ? Object.assign({}, d, parsed) : d;
    if (!out._uuid && out.uuid) out._uuid = out.uuid;

    _liveData['beacon_' + d.uuid] = out;
    _emit('beacon', out);
    _emit('data', out);
    } catch(e) {
      console.warn('[BLE] Beacon data parse error:', e.message);
    }
  });

  // Device info (manufacturer, model, serial — identifies N/A devices)
  _listenNative('ble-device-info', function(d) {
    _deviceInfo[d.field] = d.value;
    _emit('device-info', d);
    console.log('[BLE] Device Info:', d.field, '=', d.value);
  });

  // Errors
  _listenNative('ble-error', function(d) {
    _emit('error', d);
    console.warn('[BLE] Error:', d.message);
  });

  // ================================================================
  // Web Bluetooth API — Android / Chrome / PWA fallback
  // ================================================================

  function _isKnownTool(name) {
    if (!name) return false;
    for (var i = 0; i < _knownToolPrefixes.length; i++) {
      if (name.indexOf(_knownToolPrefixes[i]) === 0) return true;
    }
    return false;
  }

  // R-410A saturation temp lookup (PSI → °F) for superheat/subcooling
  var _r410aTable = [
    [0,-69.9],[10,-55.3],[20,-43.4],[30,-33.5],[40,-25],[50,-17.4],[60,-10.6],
    [70,-4.4],[80,1.4],[90,6.7],[100,11.7],[110,16.4],[118,20],[120,20.9],
    [130,25.1],[140,29.2],[150,33.1],[160,36.8],[170,40.4],[180,43.8],
    [190,47.2],[200,50.4],[210,53.5],[220,56.5],[230,59.4],[240,62.3],
    [250,65],[260,67.7],[270,70.3],[280,72.9],[290,75.4],[300,77.8],
    [320,82.5],[340,87],[360,91.3],[380,95.5],[400,99.5],[420,103.4],
    [440,107.2],[460,110.9],[480,114.5],[500,118],[550,126.5],[600,134.5],
    [650,142.1],[700,149.3]
  ];

  function _satTempR410A(psi) {
    if (psi < _r410aTable[0][0] || psi > _r410aTable[_r410aTable.length-1][0]) return null;
    for (var i = 0; i < _r410aTable.length - 1; i++) {
      if (psi >= _r410aTable[i][0] && psi <= _r410aTable[i+1][0]) {
        var ratio = (psi - _r410aTable[i][0]) / (_r410aTable[i+1][0] - _r410aTable[i][0]);
        return Math.round((_r410aTable[i][1] + ratio * (_r410aTable[i+1][1] - _r410aTable[i][1])) * 10) / 10;
      }
    }
    return null;
  }

  // Fix #9: Bounds checking — clamp sensor values to physically possible ranges
  function _sanitizeSensorValue(val, min, max) {
    if (val === undefined || val === null || !isFinite(val)) return undefined;
    if (val < min || val > max) return undefined;
    return Math.round(val * 10) / 10;
  }

  // Sensor value physical limits
  var _LIMITS = {
    psi: { min: -15, max: 900 },       // HVAC refrigerant pressures
    tempF: { min: -80, max: 500 },      // Temperature in Fahrenheit
    tempC: { min: -62, max: 260 },      // Temperature in Celsius
    rh: { min: 0, max: 100 },           // Relative humidity %
    coPPM: { min: 0, max: 9999 },       // CO parts per million
    bar: { min: -1.5, max: 62 },        // Pressure in bar
    battery: { min: 0, max: 100 }       // Battery percentage
  };

  // Parse BLE characteristic value — Testo-aware + Fieldpiece fallback
  // Fix #3: Wrapped in try/catch to prevent malformed BLE packets from crashing
  function _parseCharValue(dataView, charUUID) {
    var result = { characteristicUUID: charUUID, raw: [], timestamp: Date.now() };

    // Guard against null/empty DataView
    if (!dataView || typeof dataView.byteLength !== 'number') {
      result.format = 'invalid';
      result.error = 'null or invalid DataView';
      return result;
    }

    var len = dataView.byteLength;
    if (len === 0) {
      result.format = 'empty';
      return result;
    }

    // Limit processing to reasonable packet sizes (prevent DoS on huge data)
    if (len > 512) {
      result.format = 'oversized';
      result.error = 'packet too large: ' + len + ' bytes';
      return result;
    }

    try {
    // Copy raw bytes + hex
    var hexParts = [];
    for (var i = 0; i < len; i++) {
      var b = dataView.getUint8(i);
      result.raw.push(b);
      hexParts.push(('0' + b.toString(16)).slice(-2));
    }
    result.hex = hexParts.join(' ');

    // ── Is this a Testo FFF2 characteristic? ──
    var isTesto = charUUID === TESTO_NOTIFY_CHAR || charUUID === 'fff2' || charUUID === 'FFF2';

    // ── Attempt 1: UTF-8 text (Testo sends text values) ──
    try {
      var decoder = new TextDecoder('utf-8');
      var text = decoder.decode(dataView.buffer);
      if (text && /^[\x20-\x7E\r\n;:.,\-+]+$/.test(text)) {
        result.utf8 = text.trim();
        // Semicolon-separated: "HP:345.2;LP:68.5;T1:42.3;T2:15.7"
        if (text.indexOf(';') !== -1 || text.indexOf(':') !== -1) {
          var parts = text.split(';');
          for (var p = 0; p < parts.length; p++) {
            var kv = parts[p].split(':');
            if (kv.length === 2) {
              var key = kv[0].trim().toLowerCase();
              var val = parseFloat(kv[1].trim());
              if (!isNaN(val)) result[key] = val;
            }
          }
          if (result.hp !== undefined) result.highPSI = result.hp;
          if (result.lp !== undefined) result.lowPSI = result.lp;
          if (result.t1 !== undefined) result.temp1F = result.t1;
          if (result.t2 !== undefined) result.temp2F = result.t2;
          if (result.sh !== undefined) result.superheat = result.sh;
          if (result.sc !== undefined) result.subcooling = result.sc;
          return result;
        }
        var numVal = parseFloat(result.utf8);
        if (!isNaN(numVal)) { result.value = numVal; }
      }
    } catch(e) {}

    // ── Attempt 2: 4 × float32 (16 bytes) — HP, LP, T1, T2 in PSI/°F ──
    if (len >= 16) {
      var f1 = dataView.getFloat32(0, true);
      var f2 = dataView.getFloat32(4, true);
      var f3 = dataView.getFloat32(8, true);
      var f4 = dataView.getFloat32(12, true);
      if (isFinite(f1) && isFinite(f2) && isFinite(f3) && isFinite(f4)) {
        if (f1 >= -15 && f1 <= 800 && f2 >= -15 && f2 <= 800 && f3 >= -50 && f3 <= 400 && f4 >= -50 && f4 <= 400) {
          result.highPSI = Math.round(f1 * 10) / 10;
          result.lowPSI = Math.round(f2 * 10) / 10;
          result.temp1F = Math.round(f3 * 10) / 10;
          result.temp2F = Math.round(f4 * 10) / 10;
          result.format = 'float32x4';
          var satH = _satTempR410A(f1), satL = _satTempR410A(f2);
          if (satH !== null && satL !== null) {
            result.superheat = Math.round((f3 - satL) * 10) / 10;
            result.subcooling = Math.round((satH - f4) * 10) / 10;
          }
          return result;
        }
        // Maybe bar → PSI (1 bar = 14.5038 PSI)
        if (f1 >= -1.5 && f1 <= 55 && f2 >= -1.5 && f2 <= 55) {
          var hpPSI = f1 * 14.5038, lpPSI = f2 * 14.5038;
          var t1C = f3, t2C = f4;
          if (t1C >= -40 && t1C <= 200 && t2C >= -40 && t2C <= 200) {
            result.highPSI = Math.round(hpPSI * 10) / 10;
            result.lowPSI = Math.round(lpPSI * 10) / 10;
            result.highBar = Math.round(f1 * 100) / 100;
            result.lowBar = Math.round(f2 * 100) / 100;
            result.temp1F = Math.round((t1C * 9 / 5 + 32) * 10) / 10;
            result.temp2F = Math.round((t2C * 9 / 5 + 32) * 10) / 10;
            result.format = 'bar_float32x4';
            var satHb = _satTempR410A(hpPSI), satLb = _satTempR410A(lpPSI);
            if (satHb !== null && satLb !== null) {
              result.superheat = Math.round((result.temp1F - satLb) * 10) / 10;
              result.subcooling = Math.round((satHb - result.temp2F) * 10) / 10;
            }
            return result;
          }
        }
      }
    }

    // ── Attempt 3: header + 4 × int16 (9 bytes) ──
    if (len >= 9) {
      var off = 1;
      var hp16 = dataView.getInt16(off, true);
      var lp16 = dataView.getInt16(off+2, true);
      var t1_16 = dataView.getInt16(off+4, true);
      var t2_16 = dataView.getInt16(off+6, true);
      var hp = hp16/10, lp = lp16/10, t1 = t1_16/10, t2 = t2_16/10;
      if (hp >= -15 && hp <= 800 && lp >= -15 && lp <= 800 && t1 >= -50 && t1 <= 400 && t2 >= -50 && t2 <= 400) {
        result.highPSI = Math.round(hp*10)/10; result.lowPSI = Math.round(lp*10)/10;
        result.temp1F = Math.round(t1*10)/10; result.temp2F = Math.round(t2*10)/10;
        result.format = 'int16x4_offset1'; result.header = dataView.getUint8(0);
        var satH3 = _satTempR410A(hp), satL3 = _satTempR410A(lp);
        if (satH3 !== null && satL3 !== null) { result.superheat = Math.round((t1-satL3)*10)/10; result.subcooling = Math.round((satH3-t2)*10)/10; }
        return result;
      }
    }

    // ── Attempt 4: 4 × int16 no header (8 bytes) ──
    if (len >= 8) {
      var hp16b = dataView.getInt16(0, true), lp16b = dataView.getInt16(2, true);
      var t1_16b = dataView.getInt16(4, true), t2_16b = dataView.getInt16(6, true);
      var hpb = hp16b/10, lpb = lp16b/10, t1b = t1_16b/10, t2b = t2_16b/10;
      if (hpb >= -15 && hpb <= 800 && lpb >= -15 && lpb <= 800 && t1b >= -50 && t1b <= 400 && t2b >= -50 && t2b <= 400) {
        result.highPSI = Math.round(hpb*10)/10; result.lowPSI = Math.round(lpb*10)/10;
        result.temp1F = Math.round(t1b*10)/10; result.temp2F = Math.round(t2b*10)/10;
        result.format = 'int16x4';
        var satH4 = _satTempR410A(hpb), satL4 = _satTempR410A(lpb);
        if (satH4 !== null && satL4 !== null) { result.superheat = Math.round((t1b-satL4)*10)/10; result.subcooling = Math.round((satH4-t2b)*10)/10; }
        return result;
      }
    }

    // ── Fallback: generic int16 temp + float32 pressure (Fieldpiece) ──
    if (len >= 2) {
      var int16 = dataView.getInt16(0, true);
      var tempC = int16 / 10.0;
      result.int16 = int16;
      result.tempC = Math.round(tempC * 10) / 10;
      result.tempF = Math.round((tempC * 9 / 5 + 32) * 10) / 10;
    }
    if (len >= 4) {
      try {
        var f32 = dataView.getFloat32(0, true);
        if (isFinite(f32)) result.float32 = Math.round(f32 * 10) / 10;
      } catch(e) {}
    }
    result.format = 'generic';

    } catch(parseError) {
      // Fix #3: Catch any DataView access errors from malformed BLE packets
      console.warn('[BLE] Parse error on characteristic', charUUID, ':', parseError.message);
      result.format = 'parse_error';
      result.error = parseError.message;
    }

    // Fix #9: Final sanitization — clamp all sensor values to physical limits
    if (result.highPSI !== undefined) result.highPSI = _sanitizeSensorValue(result.highPSI, _LIMITS.psi.min, _LIMITS.psi.max);
    if (result.lowPSI !== undefined) result.lowPSI = _sanitizeSensorValue(result.lowPSI, _LIMITS.psi.min, _LIMITS.psi.max);
    if (result.temp1F !== undefined) result.temp1F = _sanitizeSensorValue(result.temp1F, _LIMITS.tempF.min, _LIMITS.tempF.max);
    if (result.temp2F !== undefined) result.temp2F = _sanitizeSensorValue(result.temp2F, _LIMITS.tempF.min, _LIMITS.tempF.max);
    if (result.tempF !== undefined) result.tempF = _sanitizeSensorValue(result.tempF, _LIMITS.tempF.min, _LIMITS.tempF.max);
    if (result.tempC !== undefined) result.tempC = _sanitizeSensorValue(result.tempC, _LIMITS.tempC.min, _LIMITS.tempC.max);
    if (result.superheat !== undefined && (result.superheat < -30 || result.superheat > 100 || !isFinite(result.superheat))) result.superheat = undefined;
    if (result.subcooling !== undefined && (result.subcooling < -30 || result.subcooling > 80 || !isFinite(result.subcooling))) result.subcooling = undefined;

    return result;
  }

  // Detect Fieldpiece beacon-style devices (broadcast data, no GATT).
  // Covers all common Fieldpiece tool prefixes: FP-, Fieldpiece, SC (multimeter),
  // SM (manifold), SDP (static pressure), JL (psychrometer), SR (scale), SRL,
  // SRH, SPK, SDMN, ST (temp probe), STA, STC. Falls back to substring match
  // so variant names like "Fieldpiece SC680" or "SM480V-1234" still resolve.
  function _isFieldpieceBeacon(name) {
    if (!name) return false;
    var n = String(name);
    if (/Fieldpiece/i.test(n)) return true;
    // Prefix match (case-sensitive — Fieldpiece advertises uppercase models)
    if (/^(FP-|SC|SM|SDP|JL|SR|SRL|SRH|SPK|SDMN|ST|STA|STC|SOX|SIG)/.test(n)) return true;
    return false;
  }

  // Parse Fieldpiece proprietary beacon manufacturer data
  // Protocol: [companyID(2)] [FPBK(4)] [model(2)] [unit(2)] [packetType(1)] [payload...]
  // Packet 0x21 = sensor data (CO ppm, temperature)
  // Packet 0x22 = status (battery, alarm)
  // Output matches _fpAggregateAndDisplay format: source='fieldpiece', probeCategory, etc.
  // Full Fieldpiece beacon parser — ported from Swift BLEManager.parseFieldpieceBeacon
  // Byte 0-1: 46 50 "FP"  |  Byte 2: deviceClass  |  Byte 3: deviceType
  function _parseFieldpieceBeacon(bytes, uuid, name) {
    var result = {
      source: 'fieldpiece',
      format: 'fieldpiece_beacon',
      timestamp: Date.now(),
      uuid: uuid,
      _uuid: uuid,
      name: name || '',
      probeName: name || 'Fieldpiece',
      probeCategory: 'unknown',
      _lastSeen: Date.now(),
      _stale: false
    };

    var hexParts = [];
    for (var h = 0; h < bytes.length; h++) hexParts.push(('0' + bytes[h].toString(16)).slice(-2));
    result.hex = hexParts.join(' ');
    result.raw = bytes;
    result.manufacturerBytes = bytes;
    result.rawLength = bytes.length;

    if (bytes.length < 15) return result;

    // Verify "FP" signature
    if (bytes[0] !== 0x46 || bytes[1] !== 0x50) {
      console.log('[BLE] Non-FP beacon bytes:', result.hex);
      return result;
    }

    var deviceClass = bytes[2];
    var deviceType = bytes[3];
    result.deviceClass = deviceClass;
    result.deviceType = deviceType;

    // Device type mapping
    if (deviceClass === 0x42 && deviceType === 0x47) {
      result.probeName = 'JL3PR'; result.probeCategory = 'pressure';
    } else if (deviceClass === 0x42 && deviceType === 0x46) {
      result.probeName = 'JL3PC'; result.probeCategory = 'pipeclamp';
    } else if (deviceClass === 0x42 && deviceType === 0x48) {
      result.probeName = 'JL3RH'; result.probeCategory = 'psychrometer';
    } else if (deviceClass === 0x43 && deviceType === 0x42) {
      result.probeName = 'SC680'; result.probeCategory = 'multimeter';
    } else if (deviceClass === 0x42 && deviceType === 0x54) {
      result.probeName = 'SM480V'; result.probeCategory = 'manifold';
    } else if (deviceClass === 0x42 && deviceType === 0x58) {
      result.probeName = 'FP4258'; result.probeCategory = 'staticpressure';
    } else if (deviceClass === 0x42 && deviceType === 0x4F) {
      result.probeName = 'SRS3'; result.probeCategory = 'scale';
    } else {
      result.probeName = 'FP-' + ('0' + deviceClass.toString(16)).slice(-2).toUpperCase() +
                                 ('0' + deviceType.toString(16)).slice(-2).toUpperCase();
    }

    result.firmware = bytes[4] + '.' + bytes[5];
    result.deviceId = (bytes[6] << 8) | bytes[7];
    result.deviceIdStr = ('0' + bytes[6].toString(16)).slice(-2).toUpperCase() +
                        ('0' + bytes[7].toString(16)).slice(-2).toUpperCase();

    // Common LE uint16 at bytes 13-14
    var raw13_14 = (bytes[14] << 8) | bytes[13];
    result.raw13_14 = raw13_14;

    // ── JL3PR: pressure ──
    if (deviceClass === 0x42 && deviceType === 0x47) {
      result.rawPressure1 = raw13_14;
      if (bytes.length >= 17) {
        var kPaRaw = (bytes[16] << 8) | bytes[15];
        result.pressureKpa = kPaRaw;
        result.pressurePSI = Math.round((kPaRaw / 6.895) * 10) / 10;
      }
      if (bytes.length >= 19) result.rawReading2 = (bytes[18] << 8) | bytes[17];
      if (bytes.length >= 21) result.rawReading3 = (bytes[20] << 8) | bytes[19];
      if (bytes.length >= 23) result.battery = bytes[22];

    // ── JL3PC: pipe clamp ──
    } else if (deviceClass === 0x42 && deviceType === 0x46) {
      result.temperatureF = Math.round((raw13_14 / 10.0) * 10) / 10;

    // ── JL3RH: psychrometer ──
    } else if (deviceClass === 0x42 && deviceType === 0x48) {
      result.dryBulbF = Math.round((raw13_14 / 10.0) * 10) / 10;
      result.temperatureF = result.dryBulbF;
      if (bytes.length >= 17) {
        var wetRaw = (bytes[16] << 8) | bytes[15];
        result.wetBulbF = Math.round((wetRaw / 10.0) * 10) / 10;
      }
      if (bytes.length >= 19) {
        var dewRaw = (bytes[18] << 8) | bytes[17];
        result.dewPointF = Math.round((dewRaw / 10.0) * 10) / 10;
      }
      if (bytes.length >= 21) {
        var rhRaw = (bytes[20] << 8) | bytes[19];
        result.relativeHumidity = Math.round((rhRaw / 10.0) * 10) / 10;
      }
      if (bytes.length >= 25) result.battery = bytes[24];

    // ── SC680 multimeter (class=0x43) ──
    } else if (deviceClass === 0x43) {
      result.meterRaw = raw13_14;
      var modesCH1 = { 0x02:'VAC', 0x07:'VDC', 0x09:'Hz', 0x0E:'uF', 0x10:'Ohms', 0x14:'Temp', 0x1A:'PF' };
      var modesCH2 = { 0x03:'Amps_AC', 0x05:'uA', 0x0C:'VAC', 0x13:'Temp_Sub', 0x19:'Watts' };

      if (bytes.length >= 17) {
        var range1 = bytes[15];
        var mode1 = bytes[16];
        var isOL = (raw13_14 === 0x7FFF);
        var divisor = Math.pow(10, range1);
        var realValue = isOL ? 0 : raw13_14 / divisor;
        var modeStr = modesCH1[mode1] || 'Unknown';
        result.meterMode = modeStr;
        result.meterRange = range1;
        result.meterIsOL = isOL;
        result.meterValue = isOL ? 'OL' : realValue;

        if (!isOL) {
          if (mode1 === 0x02) { result.voltageAC = Math.round(realValue * 10) / 10; result.meterUnit = 'VAC'; }
          else if (mode1 === 0x07) { result.voltageDC = Math.round(realValue * 1000) / 1000; result.meterUnit = 'VDC'; }
          else if (mode1 === 0x09) { result.frequencyHz = Math.round(realValue * 100) / 100; result.meterUnit = 'Hz'; }
          else if (mode1 === 0x0E) { result.capacitanceUF = Math.round(realValue * 1000) / 1000; result.meterUnit = 'µF'; }
          else if (mode1 === 0x10) {
            if (raw13_14 === 0) { result.resistanceOhms = 'Open'; result.meterValue = 'Open'; }
            else result.resistanceOhms = Math.round(realValue * 100) / 100;
            result.meterUnit = 'Ω';
          }
          else if (mode1 === 0x14) { result.temperatureF = Math.round(realValue * 10) / 10; result.meterUnit = '°F'; }
          else if (mode1 === 0x1A) { result.powerFactor = Math.round(realValue * 10) / 10; result.meterUnit = '%'; }
          else { result.meterUnit = '?'; }
        }
      }

      if (bytes.length >= 23) {
        var raw2 = (bytes[20] << 8) | bytes[19];
        var range2 = bytes[21];
        var mode2 = bytes[22];
        var isOL2 = (raw2 === 0x7FFF);
        var divisor2 = Math.pow(10, range2);
        var realValue2 = isOL2 ? 0 : raw2 / divisor2;
        var mode2Str = modesCH2[mode2] || '';
        result.ch2Raw = raw2;
        result.ch2Mode = mode2Str;
        result.ch2Range = range2;
        result.ch2IsOL = isOL2;

        if (mode2Str && !isOL2 && raw2 !== 0) {
          result.ch2Value = realValue2;
          if (mode2 === 0x03) { result.ampsAC = Math.round(realValue2 * 100) / 100; result.ch2Unit = 'A'; }
          else if (mode2 === 0x05) {
            var signed2 = raw2 > 32767 ? raw2 - 65536 : raw2;
            result.microAmps = signed2 / divisor2; result.ch2Unit = 'µA';
          }
          else if (mode2 === 0x0C) { result.ch2VoltageAC = Math.round(realValue2 * 10) / 10; result.ch2Unit = 'VAC'; }
          else if (mode2 === 0x19) { result.watts = Math.round(realValue2 * 10) / 10; result.ch2Unit = 'W'; }
        }

        if (bytes.length >= 17 && bytes[16] === 0x14 && !isOL2 && raw2 !== 0x7FFF) {
          result.temperatureF_CH2 = Math.round((raw2 / divisor2) * 10) / 10;
        }
      }

    // ── SM480V manifold ──
    } else if (deviceClass === 0x42 && deviceType === 0x54) {
      var lpRaw = (bytes[9] << 8) | bytes[8];
      result.lowPSI = Math.round((lpRaw / 10.0) * 10) / 10;
      if (bytes.length >= 12) {
        var hpRaw = (bytes[11] << 8) | bytes[10];
        result.highPSI = Math.round((hpRaw / 10.0) * 10) / 10;
      }
      if (bytes.length >= 14) {
        var stRaw = (bytes[13] << 8) | bytes[12]; if (stRaw > 32767) stRaw -= 65536;
        result.suctionTempF = Math.round((stRaw / 10.0) * 10) / 10;
      }
      if (bytes.length >= 16) {
        var ltRaw = (bytes[15] << 8) | bytes[14]; if (ltRaw > 32767) ltRaw -= 65536;
        result.liquidTempF = Math.round((ltRaw / 10.0) * 10) / 10;
      }

    // ── FP-4258 static pressure ──
    } else if (deviceClass === 0x42 && deviceType === 0x58) {
      if (bytes.length >= 10) {
        var supRaw = (bytes[9] << 8) | bytes[8];
        result.supplyInWC = Math.round((supRaw / 100.0) * 100) / 100;
      }
      if (bytes.length >= 12) {
        var retRaw = (bytes[11] << 8) | bytes[10];
        result.returnInWC = Math.round((retRaw / 100.0) * 100) / 100;
      }
      result.totalESP = Math.round((raw13_14 / 100.0) * 100) / 100;
      if (bytes.length >= 15) result.battery = bytes[14];

    // ── SRS3 scale ──
    } else if (deviceClass === 0x42 && deviceType === 0x4F) {
      if (bytes.length >= 12) {
        var wRaw = (bytes[11] << 8) | bytes[10];
        result.weightRaw = wRaw;
        result.weightLbs = Math.round((wRaw / 100.0) * 100) / 100;
        result.weightOz = Math.round((wRaw / 100.0 * 16.0) * 10) / 10;
      }
      result.tareRaw = raw13_14;
      if (bytes.length >= 16) {
        var tgtRaw = (bytes[15] << 8) | bytes[14];
        if (tgtRaw !== 0xFFFF) result.chargeTargetLbs = Math.round((tgtRaw / 100.0) * 100) / 100;
        result.chargeTargetRaw = tgtRaw;
      }
      if (bytes.length >= 17) result.battery = bytes[16];
    }

    if (bytes.length > 13) {
      var pay = [];
      for (var p = 13; p < bytes.length; p++) pay.push(('0' + bytes[p].toString(16)).slice(-2));
      result.payloadHex = pay.join(' ');
    }

    if (result.temperatureF !== undefined)
      result.temperatureF = _sanitizeSensorValue(result.temperatureF, _LIMITS.tempF.min, _LIMITS.tempF.max);
    if (result.battery !== undefined && (result.battery < 0 || result.battery > 100))
      result.battery = undefined;

    console.log('[BLE] FP ' + result.probeName + ' #' + result.deviceIdStr + ' cat=' + result.probeCategory +
      (result.pressurePSI !== undefined ? ' PSI=' + result.pressurePSI : '') +
      (result.dryBulbF !== undefined ? ' DB=' + result.dryBulbF : '') +
      (result.relativeHumidity !== undefined ? ' RH=' + result.relativeHumidity : '') +
      (result.meterMode ? ' mode=' + result.meterMode + ' val=' + result.meterValue : '') +
      (result.lowPSI !== undefined ? ' LP=' + result.lowPSI + ' HP=' + result.highPSI : ''));

    return result;
  }

  // Web Bluetooth: scan (opens browser picker)
  function _webBTScan() {
    if (!navigator.bluetooth) {
      _emit('error', { message: 'Web Bluetooth no disponible en este navegador' });
      return;
    }

    _devices = {};
    _scanning = true;
    _emit('scanning', true);

    // Build name prefix filters for known HVAC tools
    var filters = _knownToolPrefixes.map(function(p) { return { namePrefix: p }; });
    // Also accept devices advertising Testo services (catches N/A devices)
    filters.push({ services: [TESTO_DATA_SERVICE] });

    navigator.bluetooth.requestDevice({
      filters: filters,
      optionalServices: [TESTO_DATA_SERVICE, TESTO_PROP_SVC1, TESTO_PROP_SVC2, 'device_information']
    }).then(function(device) {
      _scanning = false;
      _emit('scanning', false);

      var devInfo = {
        uuid: device.id,
        name: device.name || 'Unknown',
        rssi: -1, // Web Bluetooth doesn't expose RSSI during scan
        isKnownTool: _isKnownTool(device.name)
      };
      _devices[device.id] = devInfo;
      _emit('device', devInfo);

      // Listen for disconnect — sync _connectedDevices and attempt auto-reconnect
      device.addEventListener('gattserverdisconnected', function() {
        console.log('[BLE-Web] Device disconnected:', device.name || device.id);
        // Clean up characteristic listeners
        _webBTCharacteristics.forEach(function(char) {
          if (char._bleHandler) {
            char.removeEventListener('characteristicvaluechanged', char._bleHandler);
            delete char._bleHandler;
          }
        });
        _webBTServer = null;
        _webBTCharacteristics = [];
        // Sync _connectedDevices state (Fix #8: was only clearing _connected)
        if (device.id) delete _connectedDevices[device.id];
        var remaining = Object.keys(_connectedDevices);
        _connected = remaining.length > 0 ? _connectedDevices[remaining[0]] : null;
        _emit('disconnected', { uuid: device.id, name: device.name });

        // Auto-reconnect if disconnect was unexpected (Fix #2)
        if (_lastConnectedDeviceId === device.id && _reconnectAttempts < _RECONNECT_MAX_RETRIES) {
          _reconnectAttempts++;
          console.log('[BLE-Web] Auto-reconnect attempt', _reconnectAttempts, 'of', _RECONNECT_MAX_RETRIES);
          _emit('connecting', { uuid: device.id, name: device.name, reconnect: true });
          _reconnectTimer = setTimeout(function() {
            if (_webBTDevice && _webBTDevice.gatt && !_webBTDevice.gatt.connected) {
              _webBTConnect(device.id);
            }
          }, _RECONNECT_DELAY_MS * _reconnectAttempts);
        }
      });

      _webBTDevice = device;

    }).catch(function(err) {
      _scanning = false;
      _emit('scanning', false);
      // User cancelled picker — not a real error
      if (err.name === 'NotFoundError' || err.message.indexOf('cancelled') !== -1) {
        console.log('[BLE-Web] User cancelled device picker');
        return;
      }
      // Fix #10: Specific permission error messages for scan
      var msg = 'Error de búsqueda: ';
      if (err.name === 'SecurityError') {
        msg = 'Bluetooth requiere una conexi\u00F3n segura (HTTPS). No disponible en HTTP.';
      } else if (err.name === 'NotAllowedError') {
        msg = 'Permiso de Bluetooth denegado. Habilita Bluetooth en configuraci\u00F3n del navegador.';
      } else {
        msg += err.message;
      }
      _emit('error', { message: msg, errorName: err.name });
    });
  }

  // Known GATT service UUIDs for HVAC tools (Fix #6: validate discovered services)
  var _knownServiceUUIDs = [
    TESTO_DATA_SERVICE, TESTO_PROP_SVC1, TESTO_PROP_SVC2,
    'device_information',         // standard BLE Device Information Service
    '0000180a-0000-1000-8000-00805f9b34fb', // Device Information (full form)
    '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
    '00001800-0000-1000-8000-00805f9b34fb', // Generic Access
    '00001801-0000-1000-8000-00805f9b34fb'  // Generic Attribute
  ];

  function _isKnownServiceUUID(uuid) {
    if (!uuid) return false;
    var lower = uuid.toLowerCase();
    for (var i = 0; i < _knownServiceUUIDs.length; i++) {
      if (lower === _knownServiceUUIDs[i].toLowerCase()) return true;
    }
    // Accept any standard BLE service (0000xxxx-0000-1000-8000-00805f9b34fb)
    if (/^0000[0-9a-f]{4}-0000-1000-8000-00805f9b34fb$/.test(lower)) return true;
    // Accept vendor-specific 128-bit UUIDs (non-standard) — tools like Fieldpiece use custom UUIDs
    return true;
  }

  // Web Bluetooth: connect — with timeout, UUID validation, and permission error handling
  function _webBTConnect(deviceId) {
    var device = _webBTDevice;
    if (!device || device.id !== deviceId) {
      _emit('error', { message: 'Device not found. Scan again.' });
      return;
    }

    _emit('connecting', { uuid: device.id, name: device.name });

    // Fix #1: Connection timeout — reject if GATT connect takes too long
    var connectTimedOut = false;
    var connectTimeout = setTimeout(function() {
      connectTimedOut = true;
      console.warn('[BLE-Web] Connection timeout after', _CONNECTION_TIMEOUT_MS, 'ms');
      _emit('error', { message: 'Conexi\u00F3n timeout. El dispositivo no responde.' });
      _emit('disconnected', { uuid: device.id, name: device.name, reason: 'timeout' });
      // Try to disconnect cleanly if partially connected
      try { if (device.gatt.connected) device.gatt.disconnect(); } catch(e) {}
    }, _CONNECTION_TIMEOUT_MS);

    device.gatt.connect().then(function(server) {
      if (connectTimedOut) return; // Ignore if already timed out
      clearTimeout(connectTimeout);
      _webBTServer = server;
      var connInfo = { uuid: device.id, name: device.name || 'HVAC Tool' };
      _connected = connInfo;
      _connectedDevices[device.id] = connInfo;
      _lastConnectedDeviceId = device.id;
      _reconnectAttempts = 0; // Reset reconnect counter on successful connect
      _emit('connected', _connected);

      // Discover services
      return server.getPrimaryServices();
    }).then(function(services) {
      if (connectTimedOut || !services) return;

      // Fix #6: Log and filter discovered services
      var serviceUUIDs = services.map(function(s) { return s.uuid; });
      console.log('[BLE-Web] Discovered services:', serviceUUIDs.join(', '));
      _emit('services', { services: serviceUUIDs });

      // For each service, discover characteristics and subscribe to notify
      var charPromises = services.map(function(service) {
        return service.getCharacteristics().then(function(chars) {
          chars.forEach(function(char) {
            _webBTCharacteristics.push(char);
            _emit('characteristics', {
              serviceUUID: service.uuid,
              characteristicUUID: char.uuid,
              properties: {
                read: char.properties.read,
                write: char.properties.write,
                notify: char.properties.notify,
                indicate: char.properties.indicate
              }
            });

            // Subscribe to notifications/indications for live data
            if (char.properties.notify || char.properties.indicate) {
              char.startNotifications().then(function() {
                // Store handler reference for cleanup on disconnect (prevents memory leak)
                var handler = function(event) {
                  try {
                    var value = event.target.value; // DataView
                    // Fix #3: Guard against null/invalid DataView from malformed BLE packets
                    if (!value || value.byteLength === 0) return;
                    var parsed = _parseCharValue(value, char.uuid);
                    _liveData[char.uuid] = parsed;
                    _emit('data', parsed);
                  } catch(parseErr) {
                    console.warn('[BLE-Web] Data parse error:', parseErr.message);
                  }
                };
                char._bleHandler = handler;
                char.addEventListener('characteristicvaluechanged', handler);
                console.log('[BLE-Web] Subscribed to', char.uuid);
              }).catch(function(e) {
                console.warn('[BLE-Web] Notify subscribe failed:', char.uuid, e.message);
              });
            }
          });
        }).catch(function(charErr) {
          console.warn('[BLE-Web] Characteristic discovery failed for service', service.uuid, ':', charErr.message);
        });
      });

      return Promise.all(charPromises);
    }).catch(function(err) {
      clearTimeout(connectTimeout);
      if (connectTimedOut) return;

      // Fix #10: Handle specific Web Bluetooth permission/security errors gracefully
      var msg = 'Error de conexi\u00F3n: ';
      if (err.name === 'SecurityError') {
        msg = 'Error de permisos: Bluetooth requiere HTTPS y permisos del navegador.';
      } else if (err.name === 'NotAllowedError') {
        msg = 'Permiso denegado: Habilita Bluetooth en la configuraci\u00F3n del navegador.';
      } else if (err.name === 'NetworkError') {
        msg = 'Error de red Bluetooth: Aseg\u00FArate que el dispositivo est\u00E9 encendido y cerca.';
      } else if (err.name === 'NotFoundError') {
        msg = 'Dispositivo no encontrado. Intenta buscar de nuevo.';
      } else {
        msg += err.message;
      }
      console.warn('[BLE-Web] Connect error:', err.name, err.message);
      _emit('error', { message: msg, errorName: err.name });
    });
  }

  // Web Bluetooth: disconnect — clean up listeners to prevent memory leaks
  function _webBTDisconnect() {
    var disconnectedId = _webBTDevice ? _webBTDevice.id : null;
    // Remove characteristicvaluechanged listeners before clearing
    _webBTCharacteristics.forEach(function(char) {
      if (char._bleHandler) {
        char.removeEventListener('characteristicvaluechanged', char._bleHandler);
        delete char._bleHandler;
      }
      // Stop notifications if active
      if (char.properties && (char.properties.notify || char.properties.indicate)) {
        try { char.stopNotifications().catch(function() {}); } catch(e) {}
      }
    });
    if (_webBTDevice && _webBTDevice.gatt.connected) {
      try { _webBTDevice.gatt.disconnect(); } catch(e) {}
    }
    _webBTDevice = null;
    _webBTServer = null;
    _webBTCharacteristics = [];
    // Fix #8: Sync _connectedDevices when Web BT disconnects
    if (disconnectedId) delete _connectedDevices[disconnectedId];
    var remaining = Object.keys(_connectedDevices);
    _connected = remaining.length > 0 ? _connectedDevices[remaining[0]] : null;
    _liveData = {};
    _emit('disconnected', { uuid: disconnectedId });
  }

  // Web Bluetooth: check state
  function _webBTRequestState() {
    if (!navigator.bluetooth) {
      _bleState = 'unsupported';
      _emit('state', { state: 'unsupported' });
      return;
    }
    navigator.bluetooth.getAvailability().then(function(available) {
      _bleState = available ? 'poweredOn' : 'poweredOff';
      _emit('state', { state: _bleState });
    }).catch(function() {
      _bleState = 'unknown';
      _emit('state', { state: 'unknown' });
    });
  }

  // ── Public API ──
  window.MaestroBLE = {
    // Check if BLE is available (native iOS OR Web Bluetooth)
    isAvailable: function() { return _isNative || _hasWebBluetooth; },

    // Which mode? 'native' (iOS/Android app), 'web' (Web Bluetooth), or 'none'
    getMode: function() {
      if (_isNative) return 'native';
      if (_hasWebBluetooth) return 'web';
      return 'none';
    },

    // Environment diagnostic — tells user WHY BLE may be limited and what to do.
    // Returns { title, message, action, actionUrl, platform }
    getDiagnostic: function() {
      if (_isNative) {
        return {
          title: 'Bluetooth listo',
          message: _isAndroidApp
            ? 'App Maestro HVACR para Android — soporte completo de Fieldpiece + Testo.'
            : 'App nativa — soporte completo de Fieldpiece + Testo.',
          action: null,
          platform: _isAndroidApp ? 'android-native' : 'ios-native'
        };
      }
      if (_isAndroid && !_hasWebBluetooth) {
        if (_isSamsungBrowser || _isFirefoxAndroid) {
          return {
            title: 'Navegador no compatible',
            message: 'Samsung Internet y Firefox no soportan Bluetooth. Abre esta p\u00E1gina en Chrome para Android.',
            action: 'Abrir en Chrome',
            actionUrl: 'intent://maestrohvacr.com#Intent;scheme=https;package=com.android.chrome;end',
            platform: 'android-browser-unsupported'
          };
        }
        return {
          title: 'Bluetooth no disponible',
          message: 'Tu navegador no expone Bluetooth. La app Maestro HVACR para Android llega a Play Store pronto con soporte completo.',
          action: 'Instalar Chrome',
          actionUrl: 'https://play.google.com/store/apps/details?id=com.android.chrome',
          platform: 'android-no-webble'
        };
      }
      if (_isAndroid && _hasWebBluetooth) {
        return {
          title: 'Fieldpiece no funciona por navegador',
          message: 'Chrome Android tiene Bluetooth web, pero NO puede leer los beacons Fieldpiece (SC680, SM480V, JL3RH, FP4258). Los detectas pero nunca conectan \u2014 es limitaci\u00F3n del navegador. La app Maestro HVACR para Android llega a Play Store pronto con soporte completo.',
          action: null,
          platform: 'android-webble'
        };
      }
      if (_isIOS && !_isNative) {
        return {
          title: 'Abre la app iOS',
          message: 'Safari no soporta Bluetooth. Descarga Maestro HVACR en la App Store.',
          action: 'App Store',
          actionUrl: 'https://apps.apple.com/app/maestro-hvacr/id0',
          platform: 'ios-safari'
        };
      }
      if (!_hasWebBluetooth) {
        return {
          title: 'Navegador no compatible',
          message: 'Usa Chrome, Edge u Opera en escritorio para Bluetooth web.',
          action: null,
          platform: 'desktop-no-webble'
        };
      }
      return {
        title: 'Bluetooth web',
        message: 'Activa Bluetooth + Ubicaci\u00F3n y toca Buscar Herramientas.',
        action: null,
        platform: 'desktop-webble'
      };
    },

    isAndroid: function() { return _isAndroid; },
    isIOS: function() { return _isIOS; },

    // Get Bluetooth state
    getState: function() { return _bleState; },

    // Request current state
    requestState: function() {
      if (_isNative) { _send('ble-state'); }
      else if (_hasWebBluetooth) { _webBTRequestState(); }
    },

    // Start scanning for HVAC tools
    // Beacon-aware: Fieldpiece tools (FP-*) are advertising-only beacons, so scan
    // must stay open long enough to discover all 15+ and then the 9s beacon rescan
    // timer keeps data flowing. No 30s auto-stop (was killing multi-device flow).
    scan: function() {
      _devices = {};
      if (_isNative) {
        _send('ble-scan');
      }
      else if (_hasWebBluetooth) { _webBTScan(); }
    },

    // Stop scanning
    stopScan: function() {
      // Clear scan timeout timer
      if (_scanTimeoutTimer) { clearTimeout(_scanTimeoutTimer); _scanTimeoutTimer = null; }
      if (_isNative) { _send('ble-stop-scan'); }
      // Web Bluetooth scan is a one-shot picker — no stop needed
      _scanning = false;
      _emit('scanning', false);
    },

    // Enable beacon mode without name-based detection. Use this when linking
    // multiple Fieldpiece tools at once — it starts the scan + 9s rescan timer
    // so every advertising beacon keeps flowing data in parallel, instead of
    // connecting each UUID one-by-one (which caused tools to drop each other).
    enableBeaconMode: function() {
      if (!_isNative) return;
      _beaconMode = true;
      if (!_scanning) { _send('ble-scan'); }
      if (!window._bleBeaconRescanTimer) {
        window._bleBeaconRescanTimer = setInterval(function() {
          if (!_beaconMode) { clearInterval(window._bleBeaconRescanTimer); window._bleBeaconRescanTimer = null; return; }
          _send('ble-scan');
        }, 9000);
      }
      console.log('[BLE] Beacon mode enabled (multi-device rescan active)');
    },

    // Connect to device by UUID
    connect: function(uuid) {
      // Check if this is a Fieldpiece beacon — use beacon mode, not GATT.
      // Accept beacon match via _devices OR _fpDevices (some beacons never
      // fire ble-device-found, only ble-beacon-data — _fpDevices has them).
      var dev = _devices[uuid];
      var fpEntry = window._fpDevices ? window._fpDevices[uuid] : null;
      var isBeacon = _isNative && (
        (dev && _isFieldpieceBeacon(dev.name)) ||
        (fpEntry && (fpEntry.source === 'fieldpiece' || _isFieldpieceBeacon(fpEntry.name)))
      );
      if (isBeacon) {
        _beaconMode = true;
        var beaconName = (dev && dev.name) || (fpEntry && fpEntry.name) || 'Fieldpiece';
        var beaconDev = { uuid: uuid, name: beaconName, rssi: (dev && dev.rssi) };
        // Preserve earlier connected singleton so the first tool keeps its
        // "Conectado" UI badge — multi-device state lives in _connectedDevices.
        if (!_connected) _connected = beaconDev;
        _connectedDevices[uuid] = beaconDev;
        _emit('connected', beaconDev);
        console.log('[BLE] Fieldpiece beacon connected (beacon mode):', beaconName);
        // Keep scanning for beacon data — restart if not already scanning
        if (!_scanning) { _send('ble-scan'); }
        // Start auto-rescan if not already running
        if (!window._bleBeaconRescanTimer) {
          window._bleBeaconRescanTimer = setInterval(function() {
            if (!_beaconMode) { clearInterval(window._bleBeaconRescanTimer); window._bleBeaconRescanTimer = null; return; }
            _send('ble-scan');
          }, 9000);
        }
        return;
      }
      if (_isNative) { _send('ble-connect', uuid); }
      else if (_hasWebBluetooth) { _webBTConnect(uuid); }
    },

    // Disconnect device(s) — pass UUID for one, or omit for all
    disconnect: function(uuid) {
      // Cancel any pending reconnection (user-initiated disconnect = intentional)
      _lastConnectedDeviceId = null;
      _reconnectAttempts = _RECONNECT_MAX_RETRIES; // Prevent auto-reconnect
      if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }

      if (uuid) {
        // Disconnect specific device
        if (_connectedDevices[uuid]) {
          delete _connectedDevices[uuid];
          if (_connected && _connected.uuid === uuid) {
            var remaining = Object.keys(_connectedDevices);
            _connected = remaining.length > 0 ? _connectedDevices[remaining[0]] : null;
          }
          if (_isNative) { _send('ble-disconnect', uuid); }
          // Fix #4: If disconnecting the web BT device, clean up properly
          if (_hasWebBluetooth && _webBTDevice && _webBTDevice.id === uuid) {
            _webBTDisconnect();
            return; // _webBTDisconnect already emits 'disconnected'
          }
          _emit('disconnected', { uuid: uuid });
        }
        return;
      }
      // Disconnect ALL
      _beaconMode = false;
      if (window._bleBeaconRescanTimer) { clearInterval(window._bleBeaconRescanTimer); window._bleBeaconRescanTimer = null; }
      _connectedDevices = {};
      _connected = null;
      _liveData = {};
      if (_isNative) { _send('ble-disconnect'); }
      else if (_hasWebBluetooth) { _webBTDisconnect(); }
      _emit('disconnected', {});
    },

    // Get all discovered devices
    getDevices: function() { return Object.values(_devices); },

    // Get connected device info (latest, for backward compat)
    getConnected: function() { return _connected; },

    // Get ALL connected devices { uuid: deviceInfo, ... }
    getConnectedDevices: function() { return _connectedDevices; },

    // Count of connected devices
    getConnectedCount: function() { return Object.keys(_connectedDevices).length; },

    // Is currently scanning?
    isScanning: function() { return _scanning; },

    // Get latest live data for a characteristic
    getLiveData: function(charUUID) { return charUUID ? _liveData[charUUID] : _liveData; },

    // Get device info (manufacturer, model, serial)
    getDeviceInfo: function() { return _deviceInfo; },

    // Event listeners
    on: _on,
    off: _off
  };

  var _mode = _isNative ? 'Native iOS' : (_hasWebBluetooth ? 'Web Bluetooth (Android/Chrome)' : 'Not available');
  console.log('[BLE] MaestroBLE initialized. Mode:', _mode);

  // ================================================================
  // BLE TOOLBAR — Universal widget for any herramienta screen
  // Call MaestroBLE.showToolbar(containerId) to inject into any tool
  // ================================================================
  var _toolbarListeners = [];

  function _createToolbar(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return null;

    // Don't duplicate
    if (container.querySelector('.ble-toolbar')) return container.querySelector('.ble-toolbar');

    var bar = document.createElement('div');
    bar.className = 'ble-toolbar';
    bar.style.cssText = 'background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.9));border:1px solid rgba(255,107,53,0.3);border-radius:12px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;';

    if (!_isNative && !_hasWebBluetooth) {
      bar.innerHTML = '<span style="color:#64748b;font-size:11px;">📡 Bluetooth no disponible en este navegador</span>';
      container.insertBefore(bar, container.firstChild);
      return bar;
    }

    _renderToolbarContent(bar);
    container.insertBefore(bar, container.firstChild);

    // Listen for connection changes
    var onConnected = function(d) { _renderToolbarConnected(bar, d); };
    var onDisconnected = function() { _renderToolbarContent(bar); };
    var onData = function(d) { _renderToolbarData(bar, d); };

    _on('connected', onConnected);
    _on('disconnected', onDisconnected);
    _on('data', onData);

    _toolbarListeners.push({ connected: onConnected, disconnected: onDisconnected, data: onData });

    return bar;
  }

  function _renderToolbarContent(bar) {
    if (_connected) {
      _renderToolbarConnected(bar, _connected);
      return;
    }
    bar.innerHTML =
      '<span style="font-size:16px;">📡</span>' +
      '<span style="color:#94a3b8;font-size:12px;flex:1;">Sin herramienta conectada</span>' +
      '<button onclick="MaestroBLE._quickConnect()" style="background:linear-gradient(135deg,#FF6B35,#e55a2b);color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">Conectar</button>';
  }

  function _renderToolbarConnected(bar, d) {
    bar.innerHTML =
      '<span style="font-size:16px;">🔗</span>' +
      '<span style="color:#4ade80;font-size:12px;font-weight:600;flex:1;">' + (d.name || 'Herramienta') + ' conectada</span>' +
      '<div id="bleToolbarReadings" style="display:flex;gap:8px;flex-wrap:wrap;"></div>' +
      '<button onclick="MaestroBLE.disconnect()" style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.3);padding:4px 10px;border-radius:6px;font-size:10px;cursor:pointer;">✕</button>';
  }

  function _renderToolbarData(bar, d) {
    var readings = bar.querySelector('#bleToolbarReadings');
    if (!readings) return;

    var items = [];

    // Fieldpiece CO analyzer: coPPM + temperature
    if (d.coPPM !== undefined) {
      var coColor = d.coPPM > 35 ? '#f87171' : d.coPPM > 9 ? '#fbbf24' : '#4ade80';
      var coBg = d.coPPM > 35 ? 'rgba(248,113,113,0.15)' : d.coPPM > 9 ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)';
      items.push('<span style="background:' + coBg + ';color:' + coColor + ';padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">CO ' + d.coPPM + ' ppm</span>');
    }
    if (d.battery !== undefined) {
      items.push('<span style="background:rgba(148,163,184,0.15);color:#94a3b8;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">🔋 ' + d.battery + '%</span>');
    }

    // Testo 557s: highPSI, lowPSI, superheat, subcooling
    if (d.highPSI !== undefined) {
      items.push('<span style="background:rgba(255,107,53,0.15);color:#FF6B35;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">HP ' + parseFloat(d.highPSI).toFixed(0) + '</span>');
    }
    if (d.lowPSI !== undefined) {
      items.push('<span style="background:rgba(34,211,238,0.15);color:#22d3ee;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">LP ' + parseFloat(d.lowPSI).toFixed(0) + '</span>');
    }
    if (d.superheat !== undefined) {
      items.push('<span style="background:rgba(34,211,238,0.15);color:#22d3ee;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">SH ' + parseFloat(d.superheat).toFixed(1) + '°</span>');
    }
    if (d.subcooling !== undefined) {
      items.push('<span style="background:rgba(74,222,128,0.15);color:#4ade80;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">SC ' + parseFloat(d.subcooling).toFixed(1) + '°</span>');
    }

    // Generic fallback: tempF, float32
    if (items.length === 0) {
      if (d.tempF !== undefined && d.tempF !== null) {
        items.push('<span style="background:rgba(34,211,238,0.15);color:#22d3ee;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">' + parseFloat(d.tempF).toFixed(1) + '°F</span>');
      }
      if (d.float32 !== undefined && d.float32 > 0 && d.float32 < 1000) {
        items.push('<span style="background:rgba(255,107,53,0.15);color:#FF6B35;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">' + parseFloat(d.float32).toFixed(1) + ' PSI</span>');
      }
    }
    // Fieldpiece beacon tempF alongside CO reading
    if (d.coPPM !== undefined && d.tempF !== undefined) {
      items.push('<span style="background:rgba(34,211,238,0.15);color:#22d3ee;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">' + parseFloat(d.tempF).toFixed(1) + '°F</span>');
    }

    if (items.length > 0) {
      readings.innerHTML = items.join('');
    }
  }

  // Quick connect: scan and auto-connect
  // iOS native: scans for 8s, auto-connects to first known tool
  // Web Bluetooth: opens picker, auto-connects after selection
  // Fieldpiece beacon devices: keep scanning (they broadcast, no GATT)
  window.MaestroBLE._quickConnect = function() {
    if (!_isNative && !_hasWebBluetooth) return;

    MaestroBLE.scan();

    // Auto-connect after device is found/picked
    var _autoConnectHandler = function(d) {
      // Web Bluetooth: always connect (user already picked the device)
      // Native iOS: only auto-connect known tools
      if (_hasWebBluetooth || d.isKnownTool) {
        _off('device', _autoConnectHandler);

        // Fieldpiece beacon devices: DON'T stop scanning, DON'T try GATT connect
        // These devices broadcast sensor data via advertisements — keep scanning to receive it
        if (_isNative && _isFieldpieceBeacon(d.name)) {
          MaestroBLE.connect(d.uuid);  // connect() handles beacon mode internally
          return;
        }

        // Normal GATT device: connect (scanning continues for other devices)
        MaestroBLE.connect(d.uuid);
      }
    };
    _on('device', _autoConnectHandler);
    // Stop auto-connect after 8s if nothing found (native only)
    if (_isNative) {
      setTimeout(function() { _off('device', _autoConnectHandler); }, 8000);
    }
  };

  // ── _fpDevices aggregator — populates window._fpDevices for navigation.js BLE bars ──
  // navigation.js reads window._fpDevices to display sensor data in tool screens.
  // Without this aggregator, BLE data events arrive but the UI never sees them.
  if (!window._fpDevices) window._fpDevices = {};

  var _FP_STALE_MS = 8000; // mark device stale after 8 seconds of no data

  _on('data', function(d) {
    if (!d) return;
    var uid = d._uuid || d.uuid;
    if (!uid) return;
    // Store/update device data in _fpDevices for navigation.js consumption
    d._lastSeen = Date.now();
    d._stale = false;
    window._fpDevices[uid] = d;
  });

  // Staleness check — mark devices stale if no data received within threshold
  setInterval(function() {
    var now = Date.now();
    for (var uid in window._fpDevices) {
      var d = window._fpDevices[uid];
      if (d._lastSeen && (now - d._lastSeen) > _FP_STALE_MS) {
        d._stale = true;
      }
    }
  }, 2000);

  // Clean up all timers on page unload to prevent battery drain
  window.addEventListener('beforeunload', function() {
    if (window._bleBeaconRescanTimer) {
      clearInterval(window._bleBeaconRescanTimer);
      window._bleBeaconRescanTimer = null;
    }
    if (_scanTimeoutTimer) { clearTimeout(_scanTimeoutTimer); _scanTimeoutTimer = null; }
    if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
  });

  // Public toolbar API
  window.MaestroBLE.showToolbar = _createToolbar;

  window.MaestroBLE.removeToolbar = function(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var bar = container.querySelector('.ble-toolbar');
    if (bar) bar.remove();
    // Clean up listeners
    _toolbarListeners.forEach(function(l) {
      _off('connected', l.connected);
      _off('disconnected', l.disconnected);
      _off('data', l.data);
    });
    _toolbarListeners = [];
  };
})();
