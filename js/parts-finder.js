/**
 * Parts Finder v2 — Busqueda chaka de equipos HVAC, manuales, partes y specs
 * Internal DB first → AI fallback → In-app web search (no sale de la app)
 */
(function() {
  'use strict';

  var BG = '#FFFFFF';
  var ACCENT = '#111111';
  var TEXT = '#111111';
  var MUTED = '#111111';
  var _searchTimeout = null;
  var _activeFilter = 'todos';

  // ── Data from parts-finder-data.js ──
  var BRANDS = window.PF_BRANDS || [];
  var EQUIPMENT_DB = window.PF_EQUIPMENT || [];
  var COMPRESSOR_DB = window.PF_COMPRESSORS || [];
  var COMMON_PARTS = window.PF_PARTS || {};

  // ── Init ──
  window.initPartsFinder = function() {
    var s = document.getElementById('partsFinderScreen');
    if (!s) return;
    if (window.Gamification) window.Gamification.recordToolUse('parts_finder');
    _render(s);
  };

  // ── Fuzzy match: split query into words, ALL must match somewhere ──
  function _fuzzy(text, query) {
    var words = query.toLowerCase().split(/\s+/);
    var t = text.toLowerCase();
    for (var i = 0; i < words.length; i++) {
      if (words[i] && t.indexOf(words[i]) === -1) return false;
    }
    return true;
  }

  // ── Main render ──
  function _render(s) {
    var h = '<div style="background:' + BG + ';min-height:100vh;color:' + TEXT + ';display:flex;flex-direction:column;">';

    // Header (respeta safe-area en iPhone/iPad — evita que los iconos queden debajo del notch)
    h += '<div style="position:sticky;top:0;z-index:20;background:' + BG + ';border-bottom:1px solid rgba(34,197,94,0.15);padding:calc(12px + env(safe-area-inset-top, 0px)) 12px 8px;">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<button onclick="showScreen(\'dashboardScreen\')" style="background:rgba(34,197,94,0.12);border:none;color:' + ACCENT + ';width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    var _tp = window._tp = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    h += '<div style="flex:1;"><div style="font-size:17px;font-weight:800;color:#111111;">' + _tp('pf_title', 'Busqueda de Partes') + '</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';font-weight:500;">' + EQUIPMENT_DB.length + ' ' + _tp('pf_equipment_count', 'equipos') + ' \u00B7 ' + COMPRESSOR_DB.length + ' ' + _tp('pf_compressors_count', 'compresores') + ' \u00B7 ' + Object.keys(COMMON_PARTS).length + ' ' + _tp('pf_parts_count', 'partes') + '</div></div></div>';

    // Search bar
    h += '<div style="position:relative;margin-bottom:8px;">';
    h += '<input type="text" id="pfSearch" placeholder="' + _tp('pf_search_placeholder', 'Modelo, marca, parte, manual...') + '" oninput="window._pfOnSearch()" style="width:100%;padding:14px 44px 14px 42px;border:2px solid rgba(34,197,94,0.3);border-radius:14px;background:rgba(34,197,94,0.08);color:#111111;font-size:15px;font-weight:600;outline:none;box-sizing:border-box;transition:border-color .2s;" onfocus="this.style.borderColor=\'rgba(34,197,94,0.6)\'" onblur="this.style.borderColor=\'rgba(34,197,94,0.3)\'" />';
    h += '<svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:' + ACCENT + ';" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    h += '<button id="pfClear" onclick="window._pfClearSearch()" style="display:none;position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.06);border:none;color:#111111;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;line-height:28px;text-align:center;">\u2715</button>';
    h += '</div>';

    // Filter tabs
    h += '<div id="pfFilters" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;">';
    var filters = [
      { id: 'todos', label: _tp('pf_filter_all', 'Todos'), icon: '\uD83D\uDD0D' },
      { id: 'compresores', label: _tp('pf_filter_compressors', 'Compresores'), icon: '\u2699\uFE0F' },
      { id: 'equipos', label: _tp('pf_filter_equipment', 'Equipos'), icon: '\u2744\uFE0F' },
      { id: 'partes', label: _tp('pf_filter_parts', 'Partes'), icon: '\uD83D\uDD27' },
      { id: 'furnace', label: _tp('pf_filter_furnaces', 'Furnaces'), icon: '\uD83D\uDD25' },
      { id: 'minisplit', label: _tp('pf_filter_minisplits', 'Mini Splits'), icon: '\uD83C\uDF2C\uFE0F' },
      { id: 'agua', label: _tp('pf_filter_water', 'Agua'), icon: '\uD83D\uDCA7' }
    ];
    for (var fi = 0; fi < filters.length; fi++) {
      var f = filters[fi];
      var isActive = f.id === 'todos';
      h += '<button data-filter="' + f.id + '" onclick="window._pfSetFilter(\'' + f.id + '\')" style="flex:0 0 auto;white-space:nowrap;padding:7px 14px;border-radius:20px;border:1px solid ' + (isActive ? 'rgba(34,197,94,0.5)' : 'rgba(0,0,0,0.06)') + ';background:' + (isActive ? 'rgba(34,197,94,0.15)' : 'rgba(0,0,0,0.02)') + ';color:#111111;font-size:13px;font-weight:' + (isActive ? '800' : '600') + ';cursor:pointer;transition:all .15s;line-height:1;">' + f.icon + ' ' + f.label + '</button>';
    }
    h += '</div>';
    h += '</div>'; // end sticky header

    // Content
    h += '<div id="pfContent" style="flex:1;overflow-y:auto;padding:12px;"></div>';

    // No iframe overlay — external links open in new tab (most sites block iframes)

    h += '</div>';
    s.innerHTML = h;

    _renderHome();
  }

  // ── Filter handler ──
  window._pfSetFilter = function(filterId) {
    _activeFilter = filterId;
    // Update tab styles
    var btns = document.querySelectorAll('#pfFilters button');
    for (var i = 0; i < btns.length; i++) {
      var isActive = btns[i].getAttribute('data-filter') === filterId;
      btns[i].style.borderColor = isActive ? 'rgba(34,197,94,0.5)' : 'rgba(0,0,0,0.06)';
      btns[i].style.background = isActive ? 'rgba(34,197,94,0.15)' : 'rgba(0,0,0,0.02)';
      btns[i].style.color = isActive ? ACCENT : '#6b7280';
    }
    // Re-run search or show filtered home
    var input = document.getElementById('pfSearch');
    var q = (input ? input.value : '').trim().toLowerCase();
    if (q.length >= 2) { _doSearch(q); }
    else { _renderHome(); }
  };

  // ── Clear search ──
  window._pfClearSearch = function() {
    var input = document.getElementById('pfSearch');
    if (input) input.value = '';
    var btn = document.getElementById('pfClear');
    if (btn) btn.style.display = 'none';
    _renderHome();
  };

  // ── External web search — opens in new tab (sites block iframes) ──
  window._pfOpenWeb = function(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ── Home view ──
  function _renderHome() {
    var c = document.getElementById('pfContent');
    if (!c) return;
    var h = '';

    // If filter is active (not "todos"), show filtered view
    if (_activeFilter !== 'todos') {
      h += _renderFilteredHome();
      c.innerHTML = h;
      return;
    }

    // Brands grid
    h += '<div style="margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:700;color:#111111;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">' + _tp('pf_brands', 'Marcas') + '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">';
    for (var i = 0; i < BRANDS.length; i++) {
      var b = BRANDS[i];
      var mono = b.mono || (b.name || '??').substring(0, 2).toUpperCase();
      var hue = b.hue || '#334155';
      h += '<button onclick="window._pfFilterBrand(\'' + b.name + '\')" style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:10px 6px;cursor:pointer;text-align:center;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 1px 2px rgba(17,17,17,0.04);">';
      h += '<div style="width:32px;height:32px;border-radius:8px;background:' + hue + ';color:#FFFFFF;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;letter-spacing:0.5px;">' + mono + '</div>';
      h += '<div style="font-size:10px;color:#0F0F0F;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;">' + b.name + '</div>';
      h += '</button>';
    }
    h += '</div></div>';

    // Quick search chips
    h += '<div style="margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:700;color:#111111;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">' + _tp('pf_quick_search', 'Busqueda Rapida') + '</div>';
    var suggestions = ['Compresor', 'ZP', 'ZR', 'R-410A', 'R-22', 'Capacitor', 'Contactor', 'Fan Motor', 'TXV', 'Filter Drier', 'Hard Start', 'Scroll', 'Furnace', 'Mini Split', 'Tankless', 'Boiler', 'Thermostat', 'ECM Motor'];
    h += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';
    for (var si = 0; si < suggestions.length; si++) {
      h += '<button onclick="window._pfQuickSearch(\'' + suggestions[si] + '\')" style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:20px;padding:5px 10px;color:' + ACCENT + ';font-size:13px;font-weight:600;cursor:pointer;">' + suggestions[si] + '</button>';
    }
    h += '</div></div>';

    // Top compressors preview
    h += '<div style="margin-bottom:16px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    h += '<div style="font-size:12px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.5px;">\u2699\uFE0F ' + _tp('pf_popular_compressors', 'Compresores Populares') + '</div>';
    h += '<button onclick="window._pfSetFilter(\'compresores\')" style="background:none;border:none;color:#111111;font-size:13px;font-weight:600;cursor:pointer;">' + _tp('pf_view_all', 'Ver todos') + ' \u2192</button>';
    h += '</div>';
    var topComps = COMPRESSOR_DB.filter(function(c) { return c.refrigerant === 'R-410A' && c.voltage.indexOf('/1/') !== -1; }).slice(0, 4);
    for (var ci = 0; ci < topComps.length; ci++) {
      var comp = topComps[ci];
      h += '<div onclick="window._pfShowCompressor(\'' + _esc(comp.model) + '\')" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;margin-bottom:5px;cursor:pointer;">';
      h += '<div><div style="color:#111111;font-size:12px;font-weight:700;">' + _esc(comp.model) + '</div>';
      h += '<div style="color:#111111;font-size:13px;">' + _esc(comp.brand) + ' \u00B7 ' + comp.tons + 'T \u00B7 ' + _esc(comp.refrigerant) + '</div></div>';
      h += '<div style="color:#111111;font-size:15px;font-weight:800;">' + comp.tons + 'T</div>';
      h += '</div>';
    }
    h += '</div>';

    c.innerHTML = h;
  }

  // ── Filtered home (when a filter tab is active) ──
  function _renderFilteredHome() {
    var h = '';
    if (_activeFilter === 'compresores') {
      h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px;">\u2699\uFE0F ' + _tp('pf_all_compressors', 'Todos los Compresores') + ' (' + COMPRESSOR_DB.length + ')</div>';
      for (var i = 0; i < COMPRESSOR_DB.length; i++) h += _renderCompressorCard(COMPRESSOR_DB[i]);
    } else if (_activeFilter === 'equipos') {
      var eqs = EQUIPMENT_DB.filter(function(e) { return e.type.indexOf('Condensadora') !== -1 || e.type.indexOf('Bomba') !== -1; });
      h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px;">\u2744\uFE0F ' + _tp('pf_condensers_heat_pumps', 'Condensadoras & Bombas de Calor') + ' (' + eqs.length + ')</div>';
      for (var i = 0; i < eqs.length; i++) h += _renderEquipmentCard(eqs[i]);
    } else if (_activeFilter === 'partes') {
      h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px;">\uD83D\uDD27 ' + _tp('pf_all_parts', 'Todas las Partes') + ' (' + Object.keys(COMMON_PARTS).length + ')</div>';
      var pns = Object.keys(COMMON_PARTS);
      for (var i = 0; i < pns.length; i++) h += _renderPartRow(pns[i], COMMON_PARTS[pns[i]]);
    } else if (_activeFilter === 'furnace') {
      var furn = EQUIPMENT_DB.filter(function(e) { return e.type.indexOf('Furnace') !== -1; });
      h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px;">\uD83D\uDD25 ' + _tp('pf_gas_furnaces', 'Gas Furnaces') + ' (' + furn.length + ')</div>';
      for (var i = 0; i < furn.length; i++) h += _renderEquipmentCard(furn[i]);
    } else if (_activeFilter === 'minisplit') {
      var ms = EQUIPMENT_DB.filter(function(e) { return e.type.indexOf('Mini Split') !== -1; });
      h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px;">\uD83C\uDF2C\uFE0F ' + _tp('pf_filter_minisplits', 'Mini Splits') + ' (' + ms.length + ')</div>';
      for (var i = 0; i < ms.length; i++) h += _renderEquipmentCard(ms[i]);
    } else if (_activeFilter === 'agua') {
      var agua = EQUIPMENT_DB.filter(function(e) { return e.circuit === 'agua'; });
      h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px;">\uD83D\uDCA7 ' + _tp('pf_water_equipment', 'Equipos de Agua') + ' (' + agua.length + ')</div>';
      for (var i = 0; i < agua.length; i++) h += _renderEquipmentCard(agua[i]);
      // Also show water parts
      var pns = Object.keys(COMMON_PARTS);
      var waterParts = pns.filter(function(pn) { return COMMON_PARTS[pn].circuit === 'agua'; });
      if (waterParts.length > 0) {
        h += '<div style="font-size:13px;font-weight:700;color:#111111;margin:16px 0 8px;">\uD83D\uDD27 ' + _tp('pf_water_parts', 'Partes de Agua') + ' (' + waterParts.length + ')</div>';
        for (var i = 0; i < waterParts.length; i++) h += _renderPartRow(waterParts[i], COMMON_PARTS[waterParts[i]]);
      }
    }
    return h;
  }

  // ── Part row renderer ──
  function _renderPartRow(pn, pp) {
    var circuitColors = { electricidad: '#111827', refrigeracion: '#111827', airflow: '#111827', agua: '#111827' };
    var cc = circuitColors[pp.circuit] || '#6b7280';
    var h = '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.04);border-radius:8px;margin-bottom:5px;cursor:pointer;" onclick="window._pfShowPart(\'' + _esc(pn) + '\')">';
    h += '<div style="flex:1;min-width:0;"><div style="color:#111111;font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + _esc(pn) + '</div>';
    h += '<div style="display:flex;align-items:center;gap:6px;margin-top:2px;">';
    h += '<span style="color:#111111;font-size:13px;">' + _esc(pp.part) + '</span>';
    h += '<span style="background:' + cc + '22;color:' + cc + ';font-size:8px;font-weight:700;padding:1px 6px;border-radius:4px;text-transform:uppercase;">' + _esc(pp.circuit || '') + '</span>';
    h += '</div></div>';
    h += '<div style="color:' + ACCENT + ';font-size:12px;font-weight:700;white-space:nowrap;margin-left:8px;">' + _esc(pp.price) + '</div>';
    h += '</div>';
    return h;
  }

  // ── Search handler ──
  window._pfOnSearch = function() {
    clearTimeout(_searchTimeout);
    _searchTimeout = setTimeout(function() {
      var input = document.getElementById('pfSearch');
      var query = (input ? input.value : '').trim();
      var btn = document.getElementById('pfClear');
      if (btn) btn.style.display = query.length > 0 ? 'block' : 'none';
      if (query.length < 2) { _renderHome(); return; }
      _doSearch(query.toLowerCase());
    }, 250);
  };

  window._pfQuickSearch = function(term) {
    var input = document.getElementById('pfSearch');
    if (input) input.value = term;
    var btn = document.getElementById('pfClear');
    if (btn) btn.style.display = 'block';
    _doSearch(term.toLowerCase());
  };

  window._pfFilterBrand = function(brand) {
    var input = document.getElementById('pfSearch');
    if (input) input.value = brand;
    var btn = document.getElementById('pfClear');
    if (btn) btn.style.display = 'block';
    _doSearch(brand.toLowerCase());
  };

  // ── Main search logic ──
  function _doSearch(query) {
    var c = document.getElementById('pfContent');
    if (!c) return;

    // Build searchable string for each item and fuzzy match
    var compResults = (_activeFilter === 'todos' || _activeFilter === 'compresores') ? COMPRESSOR_DB.filter(function(comp) {
      var haystack = [comp.model, comp.brand, comp.type, comp.refrigerant, comp.usedIn.join(' '), comp.xref.join(' ')].join(' ');
      return _fuzzy(haystack, query) || query === 'compresor' || query === 'compressor';
    }) : [];

    var eqResults = (_activeFilter === 'todos' || _activeFilter === 'equipos' || _activeFilter === 'furnace' || _activeFilter === 'minisplit' || _activeFilter === 'agua') ? EQUIPMENT_DB.filter(function(eq) {
      var haystack = [eq.model, eq.brand, eq.type, eq.refrigerant || '', eq.circuit || '', eq.compressor || ''].join(' ');
      if (!_fuzzy(haystack, query)) return false;
      // Apply filter
      if (_activeFilter === 'furnace') return eq.type.indexOf('Furnace') !== -1;
      if (_activeFilter === 'minisplit') return eq.type.indexOf('Mini Split') !== -1;
      if (_activeFilter === 'agua') return eq.circuit === 'agua';
      return true;
    }) : [];

    var partNames = Object.keys(COMMON_PARTS);
    var partResults = (_activeFilter === 'todos' || _activeFilter === 'partes' || _activeFilter === 'agua') ? partNames.filter(function(pn) {
      var pp = COMMON_PARTS[pn];
      var haystack = [pn, pp.part, pp.circuit || ''].join(' ');
      if (!_fuzzy(haystack, query)) return false;
      if (_activeFilter === 'agua') return pp.circuit === 'agua';
      return true;
    }) : [];

    var totalResults = compResults.length + eqResults.length + partResults.length;
    var h = '';

    // Results count bar
    if (totalResults > 0) {
      h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
      h += '<div style="color:#111111;font-size:13px;font-weight:700;">' + totalResults + ' ' + (totalResults !== 1 ? _tp('pf_results_plural', 'resultados') : _tp('pf_result_singular', 'resultado')) + ' ' + _tp('pf_results_for', 'para') + ' "' + _esc(query) + '"</div>';
      h += '</div>';
    }

    // No results → AI + in-app external search
    if (totalResults === 0) {
      h += _renderNoResults(query);
      c.innerHTML = h;
      return;
    }

    // Compressor results
    if (compResults.length > 0) {
      h += '<div style="font-size:12px;font-weight:700;color:#111111;margin-bottom:6px;text-transform:uppercase;">\u2699\uFE0F ' + _tp('pf_filter_compressors', 'Compresores') + ' (' + compResults.length + ')</div>';
      for (var ci = 0; ci < Math.min(compResults.length, 20); ci++) h += _renderCompressorCard(compResults[ci]);
      if (compResults.length > 20) h += '<div style="color:#111111;font-size:13px;text-align:center;padding:8px;">+' + (compResults.length - 20) + ' ' + _tp('pf_more_refine', 'mas... refina tu busqueda') + '</div>';
    }

    // Equipment results
    if (eqResults.length > 0) {
      h += '<div style="font-size:12px;font-weight:700;color:#111111;margin:12px 0 6px;text-transform:uppercase;">' + _tp('pf_filter_equipment', 'Equipos') + ' (' + eqResults.length + ')</div>';
      for (var i = 0; i < Math.min(eqResults.length, 20); i++) h += _renderEquipmentCard(eqResults[i]);
      if (eqResults.length > 20) h += '<div style="color:#111111;font-size:13px;text-align:center;padding:8px;">+' + (eqResults.length - 20) + ' ' + _tp('pf_more_refine', 'mas... refina tu busqueda') + '</div>';
    }

    // Part results
    if (partResults.length > 0) {
      h += '<div style="font-size:12px;font-weight:700;color:#111111;margin:12px 0 6px;text-transform:uppercase;">' + _tp('pf_filter_parts', 'Partes') + ' (' + partResults.length + ')</div>';
      for (var pi = 0; pi < partResults.length; pi++) h += _renderPartRow(partResults[pi], COMMON_PARTS[partResults[pi]]);
    }

    // Even with results, offer external search at the bottom
    h += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(0,0,0,0.04);">';
    h += '<div style="font-size:13px;color:#111111;font-weight:600;margin-bottom:8px;text-transform:uppercase;">' + _tp('pf_not_found_what_looking', 'No encontraste lo que buscas?') + '</div>';
    h += _renderExternalButtons(query);
    h += '</div>';

    c.innerHTML = h;
  }

  // ── No results view ──
  function _renderNoResults(query) {
    var h = '<div style="text-align:center;padding:30px 16px;">';
    h += '<div style="font-size:48px;margin-bottom:8px;">\uD83D\uDD0D</div>';
    h += '<div style="color:#111111;font-size:16px;font-weight:700;margin-bottom:4px;">"' + _esc(query) + '"</div>';
    h += '<div style="color:#111111;font-size:12px;margin-bottom:20px;">' + _tp('pf_not_found_local', 'No encontrado en la base de datos local') + '</div>';

    // AI as primary fallback — big prominent button
    h += '<div style="margin-bottom:12px;">';
    h += '<button onclick="window._pfAskAI(\'' + _esc(query) + '\',\'\')" style="width:100%;padding:16px;background:linear-gradient(135deg,rgba(168,85,247,0.2),rgba(139,92,246,0.15));border:1px solid rgba(168,85,247,0.4);border-radius:14px;color:#111111;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">';
    h += '<span style="font-size:20px;">\uD83E\uDD16</span> ' + _tp('pf_ask_maestro_ai', 'Preguntar a Maestro Mario AI') + '</button>';
    h += '</div>';

    // External search buttons (in-app)
    h += '<div style="font-size:13px;color:#111111;font-weight:600;margin-bottom:8px;text-transform:uppercase;">' + _tp('pf_search_web', 'Buscar en la web (sin salir de la app)') + '</div>';
    h += _renderExternalButtons(query);
    h += '</div>';
    return h;
  }

  // ── External search buttons (open in-app browser) ──
  function _renderExternalButtons(query) {
    var eq = encodeURIComponent(query);
    var h = '<div style="display:flex;flex-direction:column;gap:6px;">';
    // Google manual search
    h += '<button onclick="window._pfOpenWeb(\'https://www.google.com/search?q=' + eq + '+HVAC+manual+specs+PDF\',\'Google: ' + _esc(query) + '\')" style="width:100%;padding:12px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:10px;color:#111111;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">';
    h += '<span>\uD83C\uDF10</span> ' + _tp('pf_search_google_manual', 'Buscar manual en Google') + '</button>';
    // HVAC Parts Shop
    h += '<button onclick="window._pfOpenWeb(\'https://www.hvacpartsshop.com/search?q=' + eq + '\',\'HVAC Parts Shop: ' + _esc(query) + '\')" style="width:100%;padding:12px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:10px;color:#22c55e;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">';
    h += '<span>\uD83D\uDED2</span> ' + _tp('pf_search_hvac_parts_shop', 'Buscar parte en HVAC Parts Shop') + '</button>';
    // Amazon — hidden on iOS App Store per Apple 3.1.1
    if (!window.isIOSAppStore) {
      h += '<button onclick="window._pfOpenWeb(\'https://www.amazon.com/s?k=' + eq + '+HVAC\',\'Amazon: ' + _esc(query) + '\')" style="width:100%;padding:12px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);border-radius:10px;color:#fbbf24;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">';
      h += '<span>\uD83D\uDCE6</span> ' + _tp('pf_search_amazon', 'Buscar en Amazon') + '</button>';
    }
    h += '</div>';
    return h;
  }

  // ── Render compressor card ──
  function _renderCompressorCard(comp) {
    var h = '<div style="padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:12px;margin-bottom:8px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">';
    h += '<div><div style="color:#111111;font-size:14px;font-weight:800;">' + _esc(comp.model) + '</div>';
    h += '<div style="color:#111111;font-size:13px;font-weight:700;">' + _esc(comp.brand) + ' \u00B7 ' + _esc(comp.type) + '</div></div>';
    h += '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:3px 8px;text-align:center;">';
    h += '<div style="color:#111111;font-size:15px;font-weight:800;">' + comp.tons + '</div>';
    h += '<div style="color:#111111;font-size:7px;font-weight:600;">TON</div></div></div>';

    // Specs grid
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">';
    h += _specBox('\u2744\uFE0F Ref', comp.refrigerant, '#111827');
    h += _specBox('\uD83D\uDD25 BTU', (comp.btu / 1000) + 'K', '#111827');
    h += _specBox('\u26A1 V', comp.voltage, '#111827');
    h += _specBox('RLA', comp.rla + 'A', '#111827');
    h += _specBox('LRA', comp.lra + 'A', '#111827');
    h += _specBox(_tp('pf_oil', 'Aceite'), comp.oilOz + 'oz', '#6b7280');
    h += _specBox('Succ', comp.suction, '#111827');
    h += _specBox('Liq', comp.liquid, '#111827');
    h += _specBox('Oil', comp.oil, '#6b7280');
    h += '</div>';

    // Used in
    if (comp.usedIn && comp.usedIn.length > 0) {
      h += '<div style="margin-bottom:6px;display:flex;flex-wrap:wrap;gap:3px;align-items:center;">';
      h += '<span style="color:#111111;font-size:8px;font-weight:700;">' + _tp('pf_used_in', 'USADO EN:') + '</span>';
      for (var ui = 0; ui < comp.usedIn.length; ui++) {
        h += '<span style="background:rgba(0,0,0,0.02);border:1px solid rgba(59,130,246,0.25);border-radius:4px;padding:1px 6px;color:#111111;font-size:9px;font-weight:600;">' + _esc(comp.usedIn[ui]) + '</span>';
      }
      h += '</div>';
    }

    // Cross reference
    if (comp.xref && comp.xref.length > 0) {
      h += '<div style="background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:8px;padding:6px 8px;margin-bottom:6px;">';
      h += '<div style="font-size:8px;color:#111111;font-weight:700;text-transform:uppercase;margin-bottom:3px;">\uD83D\uDD04 Cross Reference</div>';
      for (var xi = 0; xi < comp.xref.length; xi++) {
        h += '<button onclick="window._pfQuickSearch(\'' + _esc(comp.xref[xi]) + '\')" style="display:inline-block;margin:2px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:6px;padding:4px 8px;color:#fbbf24;font-size:13px;font-weight:700;cursor:pointer;">' + _esc(comp.xref[xi]) + ' \u2192</button>';
      }
      h += '</div>';
    }

    // Action buttons
    h += '<div style="display:flex;gap:6px;">';
    h += '<button onclick="window._pfAskAIComp(\'' + _esc(comp.model) + '\',\'' + _esc(comp.brand) + '\',\'' + _esc(comp.refrigerant) + '\',' + comp.tons + ')" style="flex:1;padding:8px;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:8px;color:#111111;font-size:13px;font-weight:700;cursor:pointer;">\uD83E\uDD16 IA</button>';
    h += '<button onclick="window._pfOpenWeb(\'https://www.google.com/search?q=' + encodeURIComponent(comp.model + ' ' + comp.brand + ' compressor specs') + '\',\'' + _esc(comp.model) + '\')" style="flex:1;padding:8px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:8px;color:#111111;font-size:13px;font-weight:700;cursor:pointer;">\uD83C\uDF10 Web</button>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  window._pfShowCompressor = function(model) {
    var input = document.getElementById('pfSearch');
    if (input) input.value = model;
    var btn = document.getElementById('pfClear');
    if (btn) btn.style.display = 'block';
    _doSearch(model.toLowerCase());
  };

  window._pfAskAIComp = function(model, brand, ref, tons) {
    if (typeof openMarioV2 === 'function') {
      window._marioPrePrompt = _tp('pf_ai_compressor_prompt', 'Soy tecnico HVAC y necesito informacion sobre el compresor') + ' ' + brand + ' modelo ' + model + ' (' + tons + ' ton, ' + ref + ').\n\n' + _tp('pf_ai_compressor_questions', 'Dime:\n1. Especificaciones completas\n2. Problemas comunes y sintomas de falla\n3. Como diagnosticar si esta fallando (amperaje, ohms, temperaturas)\n4. Compresores compatibles de reemplazo (cross reference)\n5. Procedimiento de cambio paso a paso\n6. Tipo y cantidad de aceite al reemplazar\n7. Capacitor recomendado');
      openMarioV2();
    }
  };

  // ── Render equipment card ──
  function _renderEquipmentCard(eq) {
    var h = '<div style="padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.05);border-radius:12px;margin-bottom:8px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">';
    h += '<div><div style="color:#111111;font-size:13px;font-weight:800;">' + _esc(eq.model) + '</div>';
    h += '<div style="color:' + ACCENT + ';font-size:13px;font-weight:700;">' + _esc(eq.brand) + ' \u00B7 ' + _esc(eq.type) + '</div></div>';
    if (eq.tons > 0) {
      h += '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:3px 8px;text-align:center;">';
      h += '<div style="color:' + ACCENT + ';font-size:15px;font-weight:800;">' + eq.tons + '</div>';
      h += '<div style="color:#111111;font-size:7px;font-weight:600;">TON</div></div>';
    }
    h += '</div>';

    // Specs
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">';
    if (eq.refrigerant && eq.refrigerant !== 'N/A') h += _specBox('\u2744\uFE0F Ref', eq.refrigerant, '#111827');
    if (eq.seer > 0) h += _specBox('SEER', eq.seer.toString(), '#111827');
    if (eq.btu > 0) h += _specBox('BTU', (eq.btu / 1000) + 'K', '#111827');
    if (eq.afue > 0) h += _specBox('AFUE', eq.afue + '%', '#111827');
    if (eq.gpm > 0) h += _specBox('GPM', eq.gpm.toString(), '#111827');
    if (eq.uef > 0) h += _specBox('UEF', eq.uef.toString(), '#111827');
    if (eq.galones > 0) h += _specBox('GAL', eq.galones.toString(), '#111827');
    if (eq.compressor && eq.compressor !== 'N/A') h += _specBox(_tp('pf_compressor', 'Compresor'), eq.compressor, '#111827');
    if (eq.voltage) h += _specBox(_tp('pf_voltage', 'Voltaje'), eq.voltage, '#111827');
    if (eq.rla > 0) h += _specBox('RLA/LRA', eq.rla + '/' + eq.lra, '#111827');
    if (eq.oil && eq.oil !== 'N/A') h += _specBox(_tp('pf_oil', 'Aceite'), eq.oil + (eq.oilOz ? ' ' + eq.oilOz + 'oz' : ''), '#6b7280');
    if (eq.metering && eq.metering !== 'N/A') h += _specBox('Metering', eq.metering, '#111827');
    if (eq.blower) h += _specBox('Blower', eq.blower, '#111827');
    h += '</div>';

    // Actions
    h += '<div style="display:flex;gap:6px;">';
    h += '<button onclick="window._pfAskAI(\'' + _esc(eq.model) + '\',\'' + _esc(eq.brand) + '\')" style="flex:1;padding:8px;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:8px;color:#111111;font-size:13px;font-weight:700;cursor:pointer;">\uD83E\uDD16 IA</button>';
    h += '<button onclick="window._pfOpenWeb(\'https://www.google.com/search?q=' + encodeURIComponent(eq.brand + ' ' + eq.model + ' manual specs PDF') + '\',\'' + _esc(eq.model) + ' Manual\')" style="flex:1;padding:8px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:8px;color:#111111;font-size:13px;font-weight:700;cursor:pointer;">\uD83D\uDCC4 Manual</button>';
    h += '<button onclick="window._pfOpenWeb(\'https://www.google.com/search?q=' + encodeURIComponent(eq.brand + ' ' + eq.model + ' parts list') + '\',\'' + _esc(eq.model) + ' Parts\')" style="flex:1;padding:8px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:8px;color:#22c55e;font-size:13px;font-weight:700;cursor:pointer;">\uD83D\uDD27 ' + _tp('pf_filter_parts', 'Partes') + '</button>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  function _specBox(label, value, color) {
    return '<div style="background:rgba(0,0,0,0.02);border-radius:6px;padding:5px 6px;text-align:center;">' +
      '<div style="color:#111111;font-size:7px;font-weight:600;text-transform:uppercase;">' + label + '</div>' +
      '<div style="color:' + color + ';font-size:10px;font-weight:700;word-break:break-all;line-height:1.2;">' + _esc(value) + '</div></div>';
  }

  window._pfAskAI = function(model, brand) {
    if (typeof openMarioV2 === 'function') {
      window._marioPrePrompt = _tp('pf_ai_equipment_prompt', 'Dame toda la informacion tecnica que sepas sobre el equipo') + ' ' + brand + ' ' + _tp('pf_ai_model', 'modelo') + ' ' + model + '. ' + _tp('pf_ai_equipment_include', 'Incluye: specs, partes comunes que fallan, troubleshooting tips, y partes de reemplazo recomendadas.');
      openMarioV2();
    }
  };

  window._pfShowPart = function(partName) {
    var pp = COMMON_PARTS[partName];
    if (!pp) return;
    if (typeof openMarioV2 === 'function') {
      window._marioPrePrompt = _tp('pf_ai_part_prompt', 'Necesito informacion sobre la parte HVAC:') + ' ' + partName + ' (Part# ' + pp.part + '). ' + _tp('pf_ai_part_questions', 'Dime: donde se usa?, como saber si esta fallando?, como reemplazarla?, y que alternativas compatibles existen?');
      openMarioV2();
    }
  };

  function _esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
})();
