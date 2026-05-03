// Weather + DateTime Widget for Dashboard v2.0
// Uses Open-Meteo (free, no API key) + browser Geolocation
// Exposes window.MaestroWeather for HVAC tool sync
(function() {
  'use strict';

  var CACHE_KEY = 'maestro_weather_v2';
  var CACHE_TTL = 10 * 60 * 1000; // 10 min — shorter so location refreshes as the user moves
  var _timerInterval = null;

  // ===== GLOBAL DATA — accessible by all HVAC tools =====
  window.MaestroWeather = {
    ready: false,
    tempF: null,          // Current outdoor temperature °F
    rhPct: null,          // Relative humidity %
    elevationFt: null,    // Elevation in feet above sea level
    pressureHpa: null,    // Surface pressure hPa
    windMph: null,        // Wind speed mph
    windDir: null,        // Wind direction degrees
    weatherCode: null,    // WMO weather code
    city: '',
    lat: null,
    lon: null,
    // Air density correction factor for Pitot tube
    // Standard: 70°F (530°R), 29.92 in.Hg (sea level)
    // Factor = sqrt( (T_standard / T_actual) × (P_actual / P_standard) )
    getDensityFactor: function() {
      if (!this.tempF || !this.pressureHpa) return 1.0;
      var tActualR = this.tempF + 459.67;  // °F → Rankine
      var tStdR = 70 + 459.67;             // 70°F standard
      var pActualInHg = this.pressureHpa * 0.02953;  // hPa → in.Hg
      var pStdInHg = 29.92;
      return Math.sqrt((tStdR / tActualR) * (pActualInHg / pStdInHg));
    },
    // Corrected Pitot velocity: V = 4005 × √VP × densityFactor
    getCorrectedVelocity: function(vp) {
      return 4005 * Math.sqrt(vp) * this.getDensityFactor();
    }
  };

  // WMO weather code → emoji + label (Spanish)
  var WMO = {
    0: ['☀️','Despejado'], 1: ['🌤️','Mayormente despejado'], 2: ['⛅','Parcialmente nublado'], 3: ['☁️','Nublado'],
    45: ['🌫️','Neblina'], 48: ['🌫️','Neblina helada'],
    51: ['🌦️','Llovizna leve'], 53: ['🌦️','Llovizna'], 55: ['🌧️','Llovizna fuerte'],
    56: ['🌧️','Llovizna helada'], 57: ['🌧️','Llovizna helada fuerte'],
    61: ['🌧️','Lluvia leve'], 63: ['🌧️','Lluvia'], 65: ['🌧️','Lluvia fuerte'],
    66: ['🌧️','Lluvia helada'], 67: ['🌧️','Lluvia helada fuerte'],
    71: ['🌨️','Nieve leve'], 73: ['🌨️','Nieve'], 75: ['❄️','Nieve fuerte'],
    77: ['❄️','Granizo fino'],
    80: ['🌦️','Chubascos leves'], 81: ['🌧️','Chubascos'], 82: ['⛈️','Chubascos fuertes'],
    85: ['🌨️','Nieve leve'], 86: ['❄️','Nieve fuerte'],
    95: ['⛈️','Tormenta'], 96: ['⛈️','Tormenta con granizo'], 99: ['⛈️','Tormenta severa']
  };

  var NIGHT_OVERRIDE = { 0: '🌙', 1: '🌙', 2: '☁️' };

  function _getWmoInfo(code, isDay) {
    var info = WMO[code] || ['🌡️', 'N/A'];
    var emoji = info[0];
    if (!isDay && NIGHT_OVERRIDE[code] !== undefined) emoji = NIGHT_OVERRIDE[code];
    return { emoji: emoji, label: info[1] };
  }

  var DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  function _formatDateTime(d) {
    var dia = DIAS[d.getDay()];
    var mes = MESES[d.getMonth()];
    var num = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    var mm = m < 10 ? '0' + m : m;
    return dia + ' ' + num + ' ' + mes + ' · ' + h12 + ':' + mm + ' ' + ampm;
  }

  function _getCached() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.ts > CACHE_TTL) return null;
      return data;
    } catch(e) { return null; }
  }

  function _setCache(data) {
    try {
      data.ts = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  function _reverseGeocode(lat, lon) {
    // Primary: bigdatacloud (fast, no key). Fallback: OpenStreetMap Nominatim.
    var bdc = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=es';
    return fetch(bdc).then(function(r) { return r.json(); }).then(function(d) {
      if (!d) return '';
      var city = d.locality || d.city || d.principalSubdivision || '';
      var state = d.principalSubdivisionCode ? d.principalSubdivisionCode.replace(/^US-/, '') : '';
      if (city && state) return city + ', ' + state;
      return city || d.countryName || '';
    }).catch(function() { return ''; })
    .then(function(primary) {
      if (primary) return primary;
      // Fallback to Nominatim when BDC returns empty
      var nom = 'https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json&addressdetails=1&zoom=10&accept-language=es';
      return fetch(nom).then(function(r) { return r.json(); }).then(function(d) {
        if (!d || !d.address) return '';
        var a = d.address;
        var city = a.city || a.town || a.village || a.hamlet || a.suburb || a.county || '';
        var state = a['ISO3166-2-lvl4'] ? a['ISO3166-2-lvl4'].replace(/^US-/, '') : (a.state || '');
        if (city && state) return city + ', ' + state;
        return city || state || '';
      }).catch(function() { return ''; });
    })
    .then(function(result) {
      console.log('[Weather] City resolved:', result || '(empty)');
      return result;
    });
  }

  function _fetchWeather(lat, lon) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat +
              '&longitude=' + lon +
              '&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code,is_day' +
              '&temperature_unit=fahrenheit&wind_speed_unit=mph';
    return fetch(url).then(function(r) { return r.json(); });
  }

  function _fetchElevation(lat, lon) {
    return fetch('https://api.open-meteo.com/v1/elevation?latitude=' + lat + '&longitude=' + lon)
      .then(function(r) { return r.json(); })
      .then(function(d) { return (d && d.elevation && d.elevation[0]) ? d.elevation[0] : 0; })
      .catch(function() { return 0; });
  }

  function _updateGlobals(current, elevM, city, lat, lon) {
    var MW = window.MaestroWeather;
    MW.tempF = current.temperature_2m;
    MW.rhPct = current.relative_humidity_2m;
    MW.pressureHpa = current.surface_pressure;
    MW.windMph = current.wind_speed_10m;
    MW.windDir = current.wind_direction_10m;
    MW.weatherCode = current.weather_code;
    MW.elevationFt = Math.round(elevM * 3.28084); // meters → feet
    MW.city = city;
    MW.lat = lat;
    MW.lon = lon;
    MW.ready = true;
    console.log('[Weather] Synced — ' + Math.round(MW.tempF) + '°F, ' + MW.rhPct + '% RH, ' + MW.elevationFt + ' ft elev, ' + MW.pressureHpa + ' hPa');
  }

  function _updateClock() {
    var el = document.getElementById('ww-datetime');
    if (!el) {
      if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
      return;
    }
    el.textContent = _formatDateTime(new Date());
  }

  function _renderWidget(container, current, elevFt, city) {
    var temp = Math.round(current.temperature_2m);
    var rh = current.relative_humidity_2m;
    var wmo = _getWmoInfo(current.weather_code, current.is_day);

    var wind = Math.round(current.wind_speed_10m);
    container.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;-webkit-font-smoothing:antialiased;">' +
        '<span style="font-size:15px;">' + wmo.emoji + '</span>' +
        '<span style="font-size:13px;font-weight:800;color:#ffffff;">' + temp + '°F</span>' +
        '<span style="color:rgba(255,255,255,0.4);font-weight:700;">·</span>' +
        '<span style="font-size:12px;font-weight:700;color:#ffffff;">💧 ' + rh + '%</span>' +
        '<span style="color:rgba(255,255,255,0.4);font-weight:700;">·</span>' +
        '<span style="font-size:12px;font-weight:700;color:#ffffff;">⛰️ ' + elevFt + ' ft</span>' +
        '<span style="color:rgba(255,255,255,0.4);font-weight:700;">·</span>' +
        '<span style="font-size:12px;font-weight:700;color:#ffffff;">📍 ' + (city || 'Ubicación') + '</span>' +
        (wind ? '<span style="color:rgba(255,255,255,0.4);font-weight:700;">·</span><span style="font-size:12px;font-weight:700;color:#ffffff;">💨 ' + wind + ' mph</span>' : '') +
      '</div>';

    container.style.display = 'block';
  }

  function _showError(container) {
    container.innerHTML =
      '<div style="text-align:center;font-size:12px;font-weight:700;color:#ffffff;-webkit-font-smoothing:antialiased;">🌡️ Permite ubicación para ver el clima</div>';
    container.style.display = 'block';
  }

  // Apple Guideline 5.1.1: do NOT auto-trigger geolocation. Show a tap-to-enable
  // placeholder until the user explicitly requests local weather.
  function _renderTapToEnable(container) {
    container.innerHTML =
      '<div id="weatherEnableBtn" role="button" tabindex="0" style="cursor:pointer;text-align:center;font-size:12px;font-weight:700;color:#ffffff;-webkit-font-smoothing:antialiased;padding:6px 10px;background:rgba(255,255,255,0.08);border-radius:8px;">🌡️ Toca para ver el clima local</div>';
    container.style.display = 'block';
    var btn = document.getElementById('weatherEnableBtn');
    if (btn) {
      var _start = function() {
        var msg = '¿Permitir ubicación?\n\nSolo la usamos para mostrarte el clima, humedad y presión del aire donde estás trabajando — útil para cálculos de supercalentamiento/subenfriamiento. No se comparte con nadie.';
        if (!confirm(msg)) return;
        _fetchLocationAndWeather(container);
      };
      btn.addEventListener('click', _start);
      btn.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _start(); } });
    }
  }

  function _fetchLocationAndWeather(container) {
    if (!navigator.geolocation) { _showError(container); return; }
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude.toFixed(4);
        var lon = pos.coords.longitude.toFixed(4);

        Promise.all([
          _fetchWeather(lat, lon),
          _fetchElevation(lat, lon),
          _reverseGeocode(lat, lon)
        ]).then(function(results) {
          var weatherData = results[0];
          var elevM = results[1];
          var city = results[2] || '';

          if (weatherData && weatherData.current) {
            _setCache({ current: weatherData.current, elevM: elevM, city: city, lat: lat, lon: lon });
            _updateGlobals(weatherData.current, elevM, city, lat, lon);
            _renderWidget(container, weatherData.current, window.MaestroWeather.elevationFt, city);
          } else {
            _showError(container);
          }
        }).catch(function(err) {
          console.warn('[Weather] Fetch error:', err);
          _showError(container);
        });
      },
      function() {
        _showError(container);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  // Entry point — called from dashboard load. Does NOT auto-request location.
  window.initWeatherWidget = function() {
    var container = document.getElementById('weatherWidget');
    if (!container) return;

    if (_timerInterval) clearInterval(_timerInterval);
    _timerInterval = setInterval(_updateClock, 30000);

    // Use cached location silently (no new permission prompt)
    var cached = _getCached();
    if (cached && cached.current) {
      _updateGlobals(cached.current, cached.elevM || 0, cached.city || '', cached.lat, cached.lon);
      _renderWidget(container, cached.current, window.MaestroWeather.elevationFt, cached.city || '');
      return;
    }

    // No cache — show tap-to-enable placeholder; user must opt in explicitly
    _renderTapToEnable(container);
  };
})();
