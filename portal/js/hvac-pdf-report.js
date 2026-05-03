/**
 * HVAC PDF Report Generator v1.0
 * Generates professional PDF reports from HVAC tool readings
 * Uses jsPDF + AutoTable
 */
(function() {
  'use strict';

  var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

  var BRAND_COLOR = [255, 107, 53]; // ACVOLT orange
  var DARK_BG = [10, 22, 40];
  var HEADER_BG = [15, 30, 55];
  var TEXT_LIGHT = [226, 232, 240];
  var GREEN = [34, 197, 94];
  var BLUE = [59, 130, 246];
  var MUTED = [100, 116, 139];

  // ============================
  // HELPERS
  // ============================
  function _getVal(id) {
    var el = document.getElementById(id);
    return el ? (el.textContent || el.innerText || '').trim() : '--';
  }

  function _getInputVal(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function _getUserName() {
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      return u.nombre || u.name || u.email || _tc('hp_technician', 'Técnico HVAC');
    } catch(e) { return _tc('hp_technician', 'Técnico HVAC'); }
  }

  function _getUserEmail() {
    return localStorage.getItem('tecnico_email') || '';
  }

  function _formatDate() {
    var d = new Date();
    var meses_es = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var meses_en = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var meses = (typeof _lang !== 'undefined' && _lang === 'en') ? meses_en : meses_es;
    var h = d.getHours(), m = d.getMinutes(), ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    var sep = (typeof _lang !== 'undefined' && _lang === 'en') ? ', ' : ' de ';
    return d.getDate() + sep + meses[d.getMonth()] + ', ' + d.getFullYear() + ' — ' + h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  function _addHeader(doc, title, subtitle) {
    // Dark header bar
    doc.setFillColor(DARK_BG[0], DARK_BG[1], DARK_BG[2]);
    doc.rect(0, 0, 210, 38, 'F');

    // Orange accent line
    doc.setFillColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
    doc.rect(0, 38, 210, 1.5, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('MAESTRO HVACR', 15, 14);

    // Subtitle (tool name)
    doc.setFontSize(11);
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
    doc.text(title, 15, 22);

    // Subtitle desc
    if (subtitle) {
      doc.setFontSize(8);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(subtitle, 15, 28);
    }

    // Date right-aligned
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(_formatDate(), 195, 14, { align: 'right' });

    // Technician
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(_tc('hp_technician_label', 'Técnico') + ': ' + _getUserName(), 195, 22, { align: 'right' });

    // Weather data if available
    var MW = window.MaestroWeather;
    if (MW && MW.ready) {
      doc.text(Math.round(MW.tempF) + '°F · ' + MW.rhPct + '% RH · ' + MW.elevationFt + ' ft elev' + (MW.city ? ' · ' + MW.city : ''), 195, 28, { align: 'right' });
    }

    return 45; // next Y position
  }

  function _addFooter(doc) {
    var pageCount = doc.internal.getNumberOfPages();
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(_tc('hp_footer_generated', 'Generado por Maestro HVACR') + ' — maestrohvacr.com — ' + _tc('hp_footer_professional', 'Reporte profesional HVAC'), 105, 290, { align: 'center' });
      doc.text(_tc('hp_page', 'Página') + ' ' + i + ' ' + _tc('hp_of', 'de') + ' ' + pageCount, 195, 290, { align: 'right' });
    }
  }

  function _sectionTitle(doc, y, text) {
    doc.setFillColor(HEADER_BG[0], HEADER_BG[1], HEADER_BG[2]);
    doc.rect(15, y - 5, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
    doc.text(text, 18, y);
    return y + 10;
  }

  function _dataRow(doc, y, label, value, unit) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(String(value) + (unit ? ' ' + unit : ''), 100, y);
    return y + 6;
  }

  function _bigResult(doc, y, label, value, unit) {
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(15, y - 5, 180, 16, 3, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(label, 20, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
    doc.text(String(value) + (unit ? ' ' + unit : ''), 195, y + 5, { align: 'right' });
    return y + 20;
  }

  // ============================
  // TAB 0: VANE ANEMOMETER REPORT
  // ============================
  function _reportVane(doc) {
    var y = _addHeader(doc, 'VANE ANEMOMETER REPORT', 'Testing Air & Balancing — ' + _tc('hp_vane_instrument', 'Instrumento Tipo Paletas (Testo 417)'));

    y = _sectionTitle(doc, y, _tc('hp_register_config', 'CONFIGURACIÓN DEL REGISTRO'));
    y = _dataRow(doc, y, _tc('hp_width', 'Ancho') + ' (W):', _getInputVal('vnW') || '--', 'in');
    y = _dataRow(doc, y, _tc('hp_height', 'Alto') + ' (H):', _getInputVal('vnH') || '--', 'in');
    y = _dataRow(doc, y, 'Free Area Factor (Ak):', _getInputVal('vnAkSlider') || '--', '%');

    var areaEl = document.getElementById('vnAreaDisp');
    if (areaEl) {
      y = _dataRow(doc, y, _tc('hp_area', 'Área') + ':', areaEl.textContent.trim(), '');
    }

    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_velocity_readings', 'LECTURAS DE VELOCIDAD') + ' (FPM)');

    // Collect readings from inputs
    var readings = [];
    for (var i = 0; i < 10; i++) {
      var el = document.getElementById('vnR' + i);
      if (el && parseFloat(el.value) > 0) readings.push([_tc('hp_reading', 'Lectura') + ' ' + (i + 1), el.value + ' FPM']);
    }
    if (readings.length > 0) {
      doc.autoTable({
        startY: y,
        head: [[_tc('hp_point', 'Punto'), _tc('hp_velocity', 'Velocidad')]],
        body: readings,
        theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 20, right: 20 },
        tableWidth: 80
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    y = _sectionTitle(doc, y, _tc('hp_statistics', 'ESTADÍSTICAS'));
    y = _dataRow(doc, y, _tc('hp_minimum', 'Mínimo') + ':', _getVal('vnMin'), 'FPM');
    y = _dataRow(doc, y, _tc('hp_maximum', 'Máximo') + ':', _getVal('vnMax'), 'FPM');
    y = _dataRow(doc, y, _tc('hp_average', 'Promedio') + ':', _getVal('vnAvg'), 'FPM');
    y = _dataRow(doc, y, _tc('hp_std_deviation', 'Desviación Std') + ':', _getVal('vnStd'), 'FPM');

    y += 4;
    y = _bigResult(doc, y, _tc('hp_cfm_calculated', 'CFM CALCULADO'), _getVal('vnCFM'), 'CFM');
  }

  // ============================
  // TAB 1: HOT WIRE REPORT
  // ============================
  function _reportHotWire(doc) {
    var y = _addHeader(doc, 'HOT WIRE ANEMOMETER REPORT', 'Testing Air & Balancing — ' + _tc('hp_thermal_anemometer', 'Anemómetro Térmico'));

    // Determine mode
    var isFree = document.getElementById('hwFreeCFM') !== null;
    y = _dataRow(doc, y, _tc('hp_mode', 'Modo') + ':', isFree ? 'Free Area' : 'In-Duct Traverse', '');
    y = _dataRow(doc, y, _tc('hp_temperature', 'Temperatura') + ':', _getVal('hwTempV'), '');

    if (isFree) {
      y += 4;
      y = _sectionTitle(doc, y, 'FREE AREA — ' + _tc('hp_readings', 'LECTURAS'));
      var readings = [];
      for (var i = 0; i < 10; i++) {
        var el = document.getElementById('hwFRi' + i);
        if (el && parseFloat(el.value) > 0) readings.push([_tc('hp_reading', 'Lectura') + ' ' + (i + 1), el.value + ' FPM']);
      }
      if (readings.length > 0) {
        doc.autoTable({
          startY: y, head: [[_tc('hp_point', 'Punto'), _tc('hp_velocity', 'Velocidad')]], body: readings, theme: 'grid',
          headStyles: { fillColor: HEADER_BG, textColor: [255, 255, 255], fontSize: 8 },
          bodyStyles: { fontSize: 8 }, margin: { left: 20, right: 20 }, tableWidth: 80
        });
        y = doc.lastAutoTable.finalY + 8;
      }
      y = _bigResult(doc, y, _tc('hp_cfm_calculated', 'CFM CALCULADO'), _getVal('hwFreeCFM'), 'CFM');
    } else {
      y += 4;
      y = _sectionTitle(doc, y, 'TRAVERSE — ' + _tc('hp_results', 'RESULTADOS'));
      y = _dataRow(doc, y, _tc('hp_points_measured', 'Puntos medidos') + ':', _getVal('hwTMeas'), '');
      y = _dataRow(doc, y, _tc('hp_avg_velocity', 'Velocidad promedio') + ':', _getVal('hwTAvgV'), 'FPM');
      y += 4;
      y = _bigResult(doc, y, _tc('hp_cfm_calculated', 'CFM CALCULADO'), _getVal('hwTCFM'), 'CFM');
    }
  }

  // ============================
  // TAB 2: FLOWHOOD REPORT
  // ============================
  function _reportFlowhood(doc) {
    var y = _addHeader(doc, 'FLOWHOOD / CAPTURE HOOD REPORT', 'Testing Air & Balancing — ' + _tc('hp_balometer', 'Balómetro') + ' (Alnor EBT731)');

    y = _sectionTitle(doc, y, _tc('hp_configuration', 'CONFIGURACIÓN'));
    y = _dataRow(doc, y, _tc('hp_hood_size', 'Tamaño Hood') + ':', (document.getElementById('fhHoodA') || {}).textContent || '4 ft²', '');
    y = _dataRow(doc, y, 'K-Factor:', _getVal('fhKV'), '');

    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_instrument_readings', 'LECTURAS DEL INSTRUMENTO'));
    y = _dataRow(doc, y, 'CFM:', _getVal('fhDvCFM'), 'CFM');
    y = _dataRow(doc, y, _tc('hp_velocity', 'Velocidad') + ':', _getVal('fhDvFPM'), 'FPM');
    y = _dataRow(doc, y, 'Temp. Dry Bulb:', _getVal('fhDvTemp'), '°F');
    y = _dataRow(doc, y, _tc('hp_relative_humidity', 'Humedad Relativa') + ':', _getVal('fhDvRH'), '%');
    y = _dataRow(doc, y, 'Wet Bulb:', _getVal('fhDvWB'), '°F');
    y = _dataRow(doc, y, 'Dew Point:', _getVal('fhDvDP'), '°F');

    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_psychrometric_results', 'RESULTADOS PSICROMÉTRICOS'));
    y = _dataRow(doc, y, 'Wet Bulb:', _getVal('fhWB'), '°F');
    y = _dataRow(doc, y, 'Dew Point:', _getVal('fhDP'), '°F');
    y = _dataRow(doc, y, 'Velocity:', _getVal('fhVel'), 'FPM');

    var corrEl = document.getElementById('fhCorrCFM');
    if (corrEl && corrEl.textContent.trim()) {
      y += 4;
      y = _bigResult(doc, y, _tc('hp_cfm_corrected', 'CFM CORREGIDO'), corrEl.textContent.trim(), '');
    }
  }

  // ============================
  // TAB 3: PITOT TUBE REPORT
  // ============================
  function _reportPitot(doc) {
    var y = _addHeader(doc, 'PITOT TUBE + MANOMETER REPORT', 'Testing Air & Balancing — ' + _tc('hp_pitot_tube', 'Tubo Pitot') + ' (Velocity Pressure → CFM)');

    var isSingle = document.getElementById('ptCFM') !== null;
    y = _dataRow(doc, y, _tc('hp_mode', 'Modo') + ':', isSingle ? 'Single Point' : 'Traverse', '');

    // Density correction
    var MW = window.MaestroWeather;
    if (MW && MW.ready) {
      var df = MW.getDensityFactor();
      y = _dataRow(doc, y, _tc('hp_air_density_factor', 'Factor densidad aire') + ':', df.toFixed(3), '(vs std 70°F/sea level)');
    }

    if (isSingle) {
      y += 4;
      y = _sectionTitle(doc, y, _tc('hp_single_point_reading', 'LECTURA SINGLE POINT'));
      y = _dataRow(doc, y, 'Velocity Pressure (VP):', _getVal('ptDvVP'), 'in.WC');
      y = _dataRow(doc, y, 'Velocity:', _getVal('ptDvVel'), 'FPM');
      y = _dataRow(doc, y, 'Duct Area:', (document.getElementById('ptAreaD') || {}).textContent || '--', '');
      y += 4;
      y = _bigResult(doc, y, _tc('hp_cfm_calculated', 'CFM CALCULADO'), _getVal('ptCFM'), 'CFM');
    } else {
      y += 4;
      y = _sectionTitle(doc, y, 'TRAVERSE — ' + _tc('hp_results', 'RESULTADOS'));
      y = _dataRow(doc, y, _tc('hp_points_measured', 'Puntos medidos') + ':', _getVal('ptTMeas'), '');
      y = _dataRow(doc, y, _tc('hp_avg_velocity', 'Velocidad promedio') + ':', _getVal('ptTAvgV'), 'FPM');
      y += 4;
      y = _bigResult(doc, y, _tc('hp_cfm_calculated', 'CFM CALCULADO'), _getVal('ptTCFM'), 'CFM');
    }

    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_reference', 'REFERENCIA'));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('V = 4005 × √VP  |  CFM = V × Area  |  Total P = Static P + Velocity P', 20, y);
  }

  // ============================
  // TAB 4: BALANCE REPORT
  // ============================
  function _reportBalance(doc) {
    var y = _addHeader(doc, 'REGISTER BALANCING REPORT', 'Testing Air & Balancing — ' + _tc('hp_system_register_balance', 'Balance de Registros del Sistema'));

    y = _sectionTitle(doc, y, _tc('hp_system_config', 'CONFIGURACIÓN DEL SISTEMA'));
    y = _dataRow(doc, y, _tc('hp_system_total_cfm', 'CFM Total Sistema') + ':', _getVal('anBalTotalVal'), 'CFM');
    y = _dataRow(doc, y, _tc('hp_registers', 'Registros') + ':', _getVal('anBalCountVal'), '');

    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_registers', 'REGISTROS'));

    // Build table from register inputs
    var rows = [];
    var count = parseInt(_getVal('anBalCountVal')) || 4;
    for (var i = 0; i < count; i++) {
      var name = _getInputVal('anBalName' + i) || _tc('hp_register', 'Registro') + ' ' + (i + 1);
      var req = _getInputVal('anBalReq' + i) || '--';
      var meas = _getInputVal('anBalMeas' + i) || '--';
      var dev = _getVal('anBalDev' + i);
      rows.push([name, req, meas, dev]);
    }

    if (rows.length > 0) {
      doc.autoTable({
        startY: y,
        head: [[_tc('hp_room_register', 'Cuarto/Registro'), _tc('hp_cfm_required', 'CFM Requerido'), _tc('hp_cfm_measured', 'CFM Medido'), _tc('hp_deviation', 'Desviación')]],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 35, halign: 'center' },
          2: { cellWidth: 35, halign: 'center' },
          3: { cellWidth: 35, halign: 'center' }
        },
        margin: { left: 20, right: 20 }
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    y = _bigResult(doc, y, 'BALANCE SCORE', _getVal('anBalScoreLCD'), '%');

    var statusEl = document.getElementById('anBalScoreStatus');
    if (statusEl) {
      y = _dataRow(doc, y, _tc('hp_status', 'Estado') + ':', statusEl.textContent.trim(), '');
    }
  }

  // ============================
  // TAB 5: TEMP / BTU REPORT
  // ============================
  function _reportTempBTU(doc) {
    var y = _addHeader(doc, 'TEMPERATURE / BTU / TONNAGE REPORT', _tc('hp_thermal_analysis', 'Análisis Térmico del Sistema HVAC'));

    y = _sectionTitle(doc, y, _tc('hp_temperatures', 'TEMPERATURAS'));
    y = _dataRow(doc, y, 'Supply Temperature:', _getVal('anTempSupVal'), '');
    y = _dataRow(doc, y, 'Return Temperature:', _getVal('anTempRetVal'), '');

    y += 4;
    y = _sectionTitle(doc, y, 'AIRFLOW');
    y = _dataRow(doc, y, _tc('hp_system_cfm', 'CFM del Sistema') + ':', _getVal('anTempCFMVal'), '');

    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_results', 'RESULTADOS'));
    y = _bigResult(doc, y, 'DELTA T (ΔT)', _getVal('anTempDT'), '°F');
    y = _bigResult(doc, y, 'BTU/h', _getVal('anTempBTU'), '');
    y = _bigResult(doc, y, 'TONNAGE', _getVal('anTempTons'), 'Tons');

    var statusEl = document.getElementById('anTempDTStatus');
    if (statusEl && statusEl.textContent.trim()) {
      y += 2;
      y = _dataRow(doc, y, _tc('hp_status', 'Estado') + ' ΔT:', statusEl.textContent.trim(), '');
    }

    y += 6;
    y = _sectionTitle(doc, y, _tc('hp_formulas', 'FÓRMULAS'));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('BTU/h = CFM × 1.08 × ΔT   |   Tons = BTU/h ÷ 12,000   |   ASHRAE: ~400 CFM/ton', 20, y);
  }

  // ============================
  // PAGE BREAK HELPER
  // ============================
  function _checkPage(doc, y, needed) {
    if (y + needed > 275) { doc.addPage(); return 15; }
    return y;
  }

  // ============================
  // TOOL REPORTER FUNCTIONS (13 tools)
  // ============================

  // 1. SUPERHEAT / SUBCOOLING
  function _reportSHSC(doc) {
    var y = _addHeader(doc, 'SUPERHEAT / SUBCOOLING REPORT', _tc('hp_superheat_subcooling', 'Recalentamiento y Subenfriamiento'));
    var ref = _getInputVal('htSHRef') || 'R-410A';
    y = _sectionTitle(doc, y, _tc('hp_configuration', 'CONFIGURACIÓN'));
    y = _dataRow(doc, y, _tc('hp_refrigerant', 'Refrigerante') + ':', ref, '');
    y += 4;
    y = _sectionTitle(doc, y, 'SUPERHEAT (' + _tc('hp_superheat', 'RECALENTAMIENTO') + ')');
    y = _dataRow(doc, y, _tc('hp_suction_pressure', 'Presion succion') + ':', _getInputVal('htSHPres') || '--', 'psig');
    y = _dataRow(doc, y, _tc('hp_suction_line_temp', 'Temp linea succion') + ':', _getInputVal('htSHTemp') || '--', 'F');
    y = _bigResult(doc, y, 'SUPERHEAT', _getVal('htSHResult'), '');
    var shDet = _getVal('htSHDetail');
    if (shDet && shDet !== '--') y = _dataRow(doc, y, _tc('hp_detail', 'Detalle') + ':', shDet, '');
    y += 4;
    y = _sectionTitle(doc, y, 'SUBCOOLING (' + _tc('hp_subcooling', 'SUBENFRIAMIENTO') + ')');
    y = _dataRow(doc, y, _tc('hp_liquid_pressure', 'Presion liquido') + ':', _getInputVal('htSCPres') || '--', 'psig');
    y = _dataRow(doc, y, _tc('hp_liquid_line_temp', 'Temp linea liquido') + ':', _getInputVal('htSCTemp') || '--', 'F');
    y = _bigResult(doc, y, 'SUBCOOLING', _getVal('htSCResult'), '');
    var scDet = _getVal('htSCDetail');
    if (scDet && scDet !== '--') y = _dataRow(doc, y, _tc('hp_detail', 'Detalle') + ':', scDet, '');
    y += 6;
    y = _sectionTitle(doc, y, _tc('hp_normal_ranges', 'RANGOS NORMALES'));
    y = _dataRow(doc, y, 'SH (TXV):', '8-12', 'F');
    y = _dataRow(doc, y, 'SH (Piston/Cap):', '10-20', 'F');
    y = _dataRow(doc, y, 'SC (TXV):', '8-14', 'F');
    y = _dataRow(doc, y, 'SC (Piston):', '5-10', 'F');
  }

  // 2. DUCTULATOR
  function _reportDuctulator(doc) {
    var y = _addHeader(doc, 'DUCTULATOR REPORT', 'CFM to Duct Size + Friction Rate');
    y = _sectionTitle(doc, y, _tc('hp_cfm_to_duct_size', 'CFM A TAMAÑO DE DUCTO'));
    y = _dataRow(doc, y, 'CFM:', _getInputVal('htDuctCFM') || '--', '');
    var velEl = document.getElementById('htDuctVel');
    y = _dataRow(doc, y, _tc('hp_target_velocity', 'Velocidad objetivo') + ':', velEl ? velEl.options[velEl.selectedIndex].text : '--', '');
    var ductRes = _getVal('htDuctResult');
    if (ductRes && ductRes !== '--') {
      var m = ductRes.match(/(\d+)"/);
      if (m) y = _bigResult(doc, y, _tc('hp_round_duct', 'DUCTO REDONDO'), m[1], 'in');
    }
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_rect_equivalent', 'EQUIVALENTE RECTANGULAR'));
    y = _dataRow(doc, y, _tc('hp_width', 'Ancho') + ':', _getInputVal('htDuctW') || '--', 'in');
    y = _dataRow(doc, y, _tc('hp_height', 'Alto') + ':', _getInputVal('htDuctH') || '--', 'in');
    y = _dataRow(doc, y, _tc('hp_round_equiv', 'Equiv. redondo') + ':', _getVal('htDuctEqR'), '');
    y += 4;
    y = _sectionTitle(doc, y, 'FRICTION RATE');
    y = _dataRow(doc, y, 'A.S.P.:', _getInputVal('htFRASP') || '--', 'inWC');
    y = _dataRow(doc, y, 'T.E.L.:', _getInputVal('htFRTEL') || '--', 'ft');
    var frRes = _getVal('htFRResult');
    if (frRes && frRes !== '--') {
      var frM = frRes.match(/([\d.]+)/);
      if (frM) y = _bigResult(doc, y, 'FRICTION RATE', frM[1], 'in.wg/100ft');
    }
  }

  // 3. CONDUIT FILL
  function _reportConduitFill(doc) {
    var y = _addHeader(doc, 'CONDUIT FILL REPORT', 'NEC Conduit Fill Calculation');
    y = _sectionTitle(doc, y, _tc('hp_configuration', 'CONFIGURACIÓN'));
    var cfType = _getInputVal('htCFType') || 'EMT';
    var cfSize = _getInputVal('htCFSize') || '3/4';
    y = _dataRow(doc, y, _tc('hp_conduit_type', 'Tipo conduit') + ':', cfType, '');
    y = _dataRow(doc, y, _tc('hp_size', 'Tamaño') + ':', cfSize, 'in');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_cables', 'CABLES'));
    var wires = window._cfWires || [];
    var rows = [];
    for (var i = 0; i < wires.length; i++) {
      rows.push([wires[i].gauge + ' AWG', String(wires[i].qty)]);
    }
    if (rows.length > 0) {
      doc.autoTable({
        startY: y, head: [[_tc('hp_gauge', 'Calibre'), _tc('hp_quantity', 'Cantidad')]], body: rows, theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 8 }, margin: { left: 20, right: 20 }, tableWidth: 80
      });
      y = doc.lastAutoTable.finalY + 8;
    }
    y = _sectionTitle(doc, y, _tc('hp_result', 'RESULTADO'));
    var cfRes = _getVal('htCFResult');
    var passMatch = cfRes.match(/(PASA|NO PASA|PASS|FAIL)/);
    var pctMatch = cfRes.match(/([\d.]+)%/);
    if (passMatch) y = _bigResult(doc, y, _tc('hp_status', 'Estado'), passMatch[1], '');
    if (pctMatch) y = _dataRow(doc, y, _tc('hp_fill', 'Llenado') + ':', pctMatch[1], '%');
  }

  // 4. WIRE SIZING
  function _reportWireSizing(doc) {
    var y = _addHeader(doc, 'WIRE SIZING / VOLTAGE DROP REPORT', _tc('hp_wire_selector_nec', 'Selector de cable NEC + caida de voltaje'));
    y = _sectionTitle(doc, y, _tc('hp_parameters', 'PARÁMETROS'));
    y = _dataRow(doc, y, 'Amperes:', _getInputVal('htWSAmps') || '--', 'A');
    y = _dataRow(doc, y, _tc('hp_distance', 'Distancia') + ':', _getInputVal('htWSDist') || '--', 'ft');
    var voltEl = document.getElementById('htWSVolt');
    y = _dataRow(doc, y, _tc('hp_voltage', 'Voltaje') + ':', voltEl ? voltEl.options[voltEl.selectedIndex].text : '--', '');
    y = _dataRow(doc, y, 'Max V-Drop:', _getInputVal('htWSMaxDrop') || '3', '%');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_result', 'RESULTADO'));
    var wsRes = _getVal('htWSResult');
    var awgMatch = wsRes.match(/([\d/]+)\s*AWG/);
    if (awgMatch) y = _bigResult(doc, y, _tc('hp_recommended_wire', 'CABLE RECOMENDADO'), awgMatch[1], 'AWG');
    var dropMatch = wsRes.match(/([\d.]+)%/);
    if (dropMatch) y = _dataRow(doc, y, _tc('hp_voltage_drop', 'Caida de voltaje') + ':', dropMatch[1], '%');
    var vLoadMatch = wsRes.match(/carga:\s*([\d.]+)/i);
    if (vLoadMatch) y = _dataRow(doc, y, _tc('hp_voltage_at_load', 'Voltaje en carga') + ':', vLoadMatch[1], 'V');
  }

  // 5. POWER WHEEL
  function _reportPowerWheel(doc) {
    var y = _addHeader(doc, 'POWER WHEEL REPORT', "Ley de Ohm — V, I, R, P");
    y = _sectionTitle(doc, y, _tc('hp_calculated_values', 'VALORES CALCULADOS'));
    y = _bigResult(doc, y, _tc('hp_voltage', 'VOLTAJE') + ' (V)', _getInputVal('htPWV') || '--', 'V');
    y = _bigResult(doc, y, _tc('hp_current', 'CORRIENTE') + ' (I)', _getInputVal('htPWI') || '--', 'A');
    y = _bigResult(doc, y, _tc('hp_resistance', 'RESISTENCIA') + ' (R)', _getInputVal('htPWR') || '--', 'Ohm');
    y = _bigResult(doc, y, _tc('hp_power', 'POTENCIA') + ' (P)', _getInputVal('htPWP') || '--', 'W');
    y += 6;
    y = _sectionTitle(doc, y, _tc('hp_reference_formulas', 'FORMULAS DE REFERENCIA'));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('V = I x R  |  P = V x I  |  P = I^2 x R  |  P = V^2 / R', 20, y);
  }

  // 6. SYSTEM ANALYZER
  function _reportSysAnalyzer(doc) {
    var y = _addHeader(doc, 'SYSTEM PERFORMANCE ANALYZER', _tc('hp_complete_system_analysis', 'Analisis completo del sistema HVAC'));
    y = _sectionTitle(doc, y, _tc('hp_configuration', 'CONFIGURACIÓN'));
    y = _dataRow(doc, y, _tc('hp_refrigerant', 'Refrigerante') + ':', _getInputVal('htSARef') || '--', '');
    var meterEl = document.getElementById('htSAMeter');
    y = _dataRow(doc, y, 'Metering device:', meterEl ? meterEl.options[meterEl.selectedIndex].text : '--', '');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_system_readings', 'LECTURAS DEL SISTEMA'));
    y = _dataRow(doc, y, _tc('hp_suction_pressure', 'Presion succion') + ':', _getInputVal('htSASucP') || '--', 'psig');
    y = _dataRow(doc, y, _tc('hp_discharge_pressure', 'Presion descarga') + ':', _getInputVal('htSADisP') || '--', 'psig');
    y = _dataRow(doc, y, _tc('hp_suction_line_temp', 'Temp linea succion') + ':', _getInputVal('htSASucT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_liquid_line_temp', 'Temp linea liquido') + ':', _getInputVal('htSALiqT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_outdoor_temp', 'Temp exterior') + ':', _getInputVal('htSAOutT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_indoor_temp', 'Temp interior') + ':', _getInputVal('htSAInT') || '--', 'F');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_analysis_results', 'RESULTADOS DEL ANALISIS'));
    // Extract metrics from the results div
    var resEl = document.getElementById('htSAResults');
    if (resEl) {
      var boxes = resEl.querySelectorAll('div[style*="text-align:center"]');
      for (var i = 0; i < boxes.length; i++) {
        var labels = boxes[i].querySelectorAll('div');
        if (labels.length >= 2) {
          var lbl = (labels[0].textContent || '').trim();
          var val = (labels[1].textContent || '').trim();
          if (lbl && val) { y = _dataRow(doc, y, lbl + ':', val, ''); }
        }
      }
    }
  }

  // 7. PSYCHROMETRIC CHART
  function _reportPsychart(doc) {
    var y = _addHeader(doc, 'PSYCHROMETRIC CHART REPORT', _tc('hp_moist_air_properties', 'Propiedades del aire humedo'));
    y = _sectionTitle(doc, y, _tc('hp_inputs', 'ENTRADAS'));
    y = _dataRow(doc, y, 'Dry Bulb:', _getInputVal('htPsyDB') || '--', 'F');
    y = _dataRow(doc, y, 'Wet Bulb:', _getInputVal('htPsyWB') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_relative_humidity', 'Humedad Relativa') + ':', _getInputVal('htPsyRH') || '--', '%');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_calculated_properties', 'PROPIEDADES CALCULADAS'));
    var resEl = document.getElementById('htPsyResults');
    if (resEl) {
      var boxes = resEl.querySelectorAll('div[style*="text-align:center"]');
      for (var i = 0; i < boxes.length; i++) {
        var labels = boxes[i].querySelectorAll('div');
        if (labels.length >= 2) {
          var lbl = (labels[0].textContent || '').trim();
          var val = (labels[1].textContent || '').trim();
          if (lbl && val) { y = _dataRow(doc, y, lbl + ':', val, ''); }
        }
      }
    }
  }

  // 8. CARGA TERMICA (Manual J)
  function _reportCargaTermica(doc) {
    var y = _addHeader(doc, 'HVAC EQUIPMENT SIZING REPORT', 'Manual J Room-by-Room');
    var d = window._htCTData;
    if (!d) { y = _dataRow(doc, y, _tc('hp_no_data', 'Sin datos.'), _tc('hp_calculate_first', 'Calcule primero.'), ''); return; }
    y = _sectionTitle(doc, y, _tc('hp_project_parameters', 'PARAMETROS DEL PROYECTO'));
    y = _dataRow(doc, y, _tc('hp_total_area', 'Area total') + ':', d.totalSqft + ' sqft', '');
    y = _dataRow(doc, y, _tc('hp_floors', 'Pisos') + ':', String(d.stories || 1), '');
    y = _dataRow(doc, y, _tc('hp_design_outdoor_temp', 'Temp exterior diseño') + ':', d.outdoor + ' F', '');
    y = _dataRow(doc, y, _tc('hp_indoor_temp', 'Temp interior') + ':', d.indoor + ' F', '');
    y = _dataRow(doc, y, 'Wet bulb:', d.wetBulb + ' F', '');
    y = _dataRow(doc, y, _tc('hp_walls', 'Paredes') + ':', d.wallType + ' (R-' + d.wallR + ')', '');
    y = _dataRow(doc, y, _tc('hp_roof', 'Techo') + ':', d.roofType + ' (R-' + d.roofR + ')', '');
    y = _dataRow(doc, y, _tc('hp_windows', 'Ventanas') + ':', d.winType, '');
    y = _dataRow(doc, y, _tc('hp_tightness', 'Hermeticidad') + ':', d.tightness + ' (' + d.ach + ' ACH)', '');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_global_result', 'RESULTADO GLOBAL'));
    y = _bigResult(doc, y, _tc('hp_total_load', 'CARGA TOTAL'), Math.round(d.totalBTU).toLocaleString(), 'BTU/hr');
    y = _bigResult(doc, y, _tc('hp_tons', 'TONELADAS'), d.tons.toFixed(1), 'Ton');
    y = _dataRow(doc, y, _tc('hp_sensible', 'Sensible') + ':', Math.round(d.sensBTU).toLocaleString(), 'BTU/hr');
    y = _dataRow(doc, y, _tc('hp_latent', 'Latente') + ':', Math.round(d.latBTU).toLocaleString(), 'BTU/hr');
    y = _dataRow(doc, y, 'SHR:', (d.shr * 100).toFixed(0), '%');
    y = _dataRow(doc, y, _tc('hp_recommended_equipment', 'Equipo recomendado') + ':', d.recTon + ' Ton', '');
    y = _dataRow(doc, y, _tc('hp_safety_factor', 'Factor seguridad') + ':', ((d.safety - 1) * 100).toFixed(0) + '%', '');
    // Room-by-room table
    y = _checkPage(doc, y, 40);
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_room_breakdown', 'DESGLOSE POR HABITACION'));
    if (d.roomResults && d.roomResults.length > 0) {
      var rows = [];
      for (var i = 0; i < d.roomResults.length; i++) {
        var rr = d.roomResults[i];
        var pct = d.totalBTU > 0 ? (rr.totalBTU * d.safety / d.totalBTU * 100) : 0;
        rows.push([
          rr.name || 'Room ' + (i+1),
          String(rr.sqft || ''),
          Math.round(rr.totalSens * d.safety).toLocaleString(),
          Math.round(rr.totalLat * d.safety).toLocaleString(),
          Math.round(rr.totalBTU * d.safety).toLocaleString(),
          (rr.shr * 100).toFixed(0) + '%',
          Math.round(rr.cfm || 0) + '',
          pct.toFixed(0) + '%'
        ]);
      }
      doc.autoTable({
        startY: y,
        head: [[_tc('hp_room', 'Habitacion'), 'SqFt', _tc('hp_sensible', 'Sensible'), _tc('hp_latent', 'Latente'), 'Total', 'SHR', 'CFM', '%']],
        body: rows, theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [255, 255, 255], fontSize: 7 },
        bodyStyles: { fontSize: 7 }, margin: { left: 15, right: 15 },
        columnStyles: { 0: { cellWidth: 30 } }
      });
    }
  }

  // 9. WALK-IN SIZING
  function _reportWalkin(doc) {
    var r = window._htWILastResult || {};
    var isFreezer = r.isFreezer || (window._htWIType === 'freezer');
    var y = _addHeader(doc, 'WALK-IN SIZING PRO \u2014 ' + (r.appType || '').toUpperCase(), _tc('hp_commercial_refrigeration', 'Calculo de refrigeracion comercial') + ' \u2022 Base ASHRAE');
    y = _sectionTitle(doc, y, _tc('hp_dimensions', 'DIMENSIONES'));
    y = _dataRow(doc, y, _tc('hp_length', 'Largo') + ':', (r.L || _getInputVal('htWILength') || '--'), 'ft');
    y = _dataRow(doc, y, _tc('hp_width', 'Ancho') + ':', (r.W || _getInputVal('htWIWidth') || '--'), 'ft');
    y = _dataRow(doc, y, _tc('hp_height', 'Alto') + ':', (r.H || _getInputVal('htWIHeight') || '--'), 'ft');
    if (r.volume) y = _dataRow(doc, y, _tc('hp_volume', 'Volumen') + ':', Math.round(r.volume), 'ft3');
    if (r.totalSA) y = _dataRow(doc, y, _tc('hp_surface', 'Superficie') + ':', Math.round(r.totalSA), 'ft2');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_conditions', 'CONDICIONES'));
    y = _dataRow(doc, y, _tc('hp_indoor_temp', 'Temp interior') + ':', r.tempIn || _getInputVal('htWITempIn') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_ambient_temp', 'Temp ambiente') + ':', r.tempAmb || _getInputVal('htWITempAmb') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_insulation', 'Aislamiento') + ':', 'R-' + (r.rValue || _getInputVal('htWIRValue') || '--'), '');
    y = _dataRow(doc, y, _tc('hp_evap_td', 'TD Evaporador') + ':', r.td || '--', 'F');
    y = _dataRow(doc, y, 'Coil Temp:', r.coilTemp != null ? r.coilTemp : '--', 'F');
    var doorEl = document.getElementById('htWIDoor');
    y = _dataRow(doc, y, _tc('hp_door_usage', 'Uso de puerta') + ':', doorEl ? doorEl.options[doorEl.selectedIndex].text : '--', '');
    if (r.glassOn) {
      y = _dataRow(doc, y, _tc('hp_glass_doors', 'Puertas vidrio') + ':', r.glassDoorArea ? Math.round(r.glassDoorArea) + ' ft2' : _tc('yes', 'Sí'), '');
    }
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_results', 'RESULTADOS'));
    if (r.btuHr) {
      y = _bigResult(doc, y, _tc('hp_total_load', 'CARGA TOTAL'), Math.round(r.btuHr).toLocaleString() + ' BTU/hr', ''); y = _checkPage(doc, y, 25);
      y = _bigResult(doc, y, _tc('hp_tons', 'TONELADAS'), r.tons ? r.tons.toFixed(2) + ' Ton' : '--', ''); y = _checkPage(doc, y, 25);
      y = _bigResult(doc, y, _tc('hp_compressor', 'COMPRESOR'), r.hp ? r.hp.toFixed(1) + ' HP' : '--', ''); y = _checkPage(doc, y, 25);
      y = _bigResult(doc, y, _tc('hp_evaporator', 'EVAPORADOR'), r.evapBTU ? Math.round(r.evapBTU).toLocaleString() + ' BTU' : '--', ''); y = _checkPage(doc, y, 25);
    }
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_btu_breakdown', 'DESGLOSE BTU/24hr'));
    y = _checkPage(doc, y, 80);
    if (r.panelTransLoad != null) y = _dataRow(doc, y, _tc('hp_panel_transmission', 'Trans. paneles') + ':', Math.round(r.panelTransLoad).toLocaleString(), 'BTU');
    if (r.glassTransLoad) y = _dataRow(doc, y, _tc('hp_glass_transmission', 'Trans. vidrio') + ':', Math.round(r.glassTransLoad).toLocaleString(), 'BTU');
    if (r.infiltrationLoad != null) y = _dataRow(doc, y, _tc('hp_infiltration', 'Infiltracion') + ':', Math.round(r.infiltrationLoad).toLocaleString(), 'BTU');
    if (r.totalProductLoad != null) y = _dataRow(doc, y, _tc('hp_product', 'Producto') + ':', Math.round(r.totalProductLoad).toLocaleString(), 'BTU');
    if (r.totalRespLoad) y = _dataRow(doc, y, _tc('hp_respiration', 'Respiracion') + ':', Math.round(r.totalRespLoad).toLocaleString(), 'BTU');
    if (r.lightLoad != null) y = _dataRow(doc, y, _tc('hp_lighting', 'Iluminacion') + ':', Math.round(r.lightLoad).toLocaleString(), 'BTU');
    if (r.motorLoad != null) y = _dataRow(doc, y, _tc('hp_evap_motors', 'Motores evap') + ':', Math.round(r.motorLoad).toLocaleString(), 'BTU');
    if (r.miscLoad != null) y = _dataRow(doc, y, _tc('hp_miscellaneous', 'Miscelaneo') + ':', Math.round(r.miscLoad).toLocaleString(), 'BTU');
    if (r.totalDaily) y = _dataRow(doc, y, 'TOTAL (c/10% SF):', Math.round(r.totalDaily).toLocaleString(), 'BTU');
    // Product details
    if (r.productDetails && r.productDetails.length > 0) {
      y += 4;
      y = _sectionTitle(doc, y, _tc('hp_product_detail', 'DETALLE POR PRODUCTO'));
      y = _checkPage(doc, y, 15 * r.productDetails.length);
      for (var i = 0; i < r.productDetails.length; i++) {
        var pd = r.productDetails[i];
        y = _dataRow(doc, y, pd.name + ' (' + pd.lbs + ' lbs):', pd.btu.toLocaleString(), 'BTU');
      }
    }
  }

  // 10. REFRIGERANT CHARGE
  function _reportRefCharge(doc) {
    var y = _addHeader(doc, 'REFRIGERANT CHARGE REPORT', _tc('hp_charge_recovery_calc', 'Calculo de carga + recuperacion'));
    y = _sectionTitle(doc, y, _tc('hp_system_data', 'DATOS DEL SISTEMA'));
    var sysEl = document.getElementById('htRCSysType');
    y = _dataRow(doc, y, _tc('hp_system_type', 'Tipo sistema') + ':', sysEl ? sysEl.options[sysEl.selectedIndex].text : '--', '');
    y = _dataRow(doc, y, _tc('hp_tonnage', 'Tonelaje') + ':', _getInputVal('htRCTons') || '--', 'Ton');
    y = _dataRow(doc, y, _tc('hp_refrigerant', 'Refrigerante') + ':', _getInputVal('htRCRef') || '--', '');
    y = _dataRow(doc, y, _tc('hp_liquid_lineset', 'Lineset liquido') + ':', _getInputVal('htRCLineL') || '--', 'ft');
    var diaEl = document.getElementById('htRCDiaL');
    y = _dataRow(doc, y, _tc('hp_liquid_diameter', 'Diametro liquido') + ':', diaEl ? diaEl.options[diaEl.selectedIndex].text : '--', '');
    y = _dataRow(doc, y, _tc('hp_factory_charge_includes', 'Carga fabrica incluye') + ':', _getInputVal('htRCFactory') || '--', 'ft');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_charge_result', 'RESULTADO CARGA'));
    var chargeEl = document.getElementById('htRCChargeResult');
    if (chargeEl && chargeEl.innerHTML.length > 10) {
      var boxes = chargeEl.querySelectorAll('div[style*="text-align:center"]');
      for (var i = 0; i < boxes.length; i++) {
        var labels = boxes[i].querySelectorAll('div');
        if (labels.length >= 2) {
          var lbl = (labels[0].textContent || '').trim();
          var val = (labels[1].textContent || '').trim();
          if (lbl && val) { y = _bigResult(doc, y, lbl, val, ''); }
        }
      }
    }
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_recovery_data', 'DATOS RECUPERACION'));
    y = _dataRow(doc, y, _tc('hp_system_charge', 'Carga sistema') + ':', _getInputVal('htRCRecLbs') || '--', 'lbs');
    var cylEl = document.getElementById('htRCCylinder');
    y = _dataRow(doc, y, _tc('hp_cylinder', 'Cilindro') + ':', cylEl ? cylEl.options[cylEl.selectedIndex].text : '--', '');
    y = _dataRow(doc, y, _tc('hp_already_in_cylinder', 'Ya en cilindro') + ':', _getInputVal('htRCCylUsed') || '0', 'lbs');
  }

  // 11. LINE SIZING
  function _reportLineSize(doc) {
    var y = _addHeader(doc, 'REFRIGERANT LINE SIZING REPORT', _tc('hp_piping_by_capacity', 'Tuberia por capacidad del sistema'));
    y = _sectionTitle(doc, y, _tc('hp_parameters', 'PARÁMETROS'));
    y = _dataRow(doc, y, _tc('hp_refrigerant', 'Refrigerante') + ':', _getInputVal('htLSRef') || '--', '');
    y = _dataRow(doc, y, _tc('hp_capacity', 'Capacidad') + ':', _getInputVal('htLSTons') || '--', 'Ton');
    y = _dataRow(doc, y, _tc('hp_equiv_length', 'Longitud equiv.') + ':', _getInputVal('htLSLength') || '--', 'ft');
    y = _dataRow(doc, y, _tc('hp_condensing_temp', 'Temp condensacion') + ':', _getInputVal('htLSCondT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_evaporating_temp', 'Temp evaporacion') + ':', _getInputVal('htLSEvapT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_vertical_rise', 'Elevacion vertical') + ':', _getInputVal('htLSRise') || '0', 'ft');
    y += 4;
    y = _sectionTitle(doc, y, 'LINE SIZING ' + _tc('hp_result', 'RESULTADO'));
    var resEl = document.getElementById('htLSResult');
    if (resEl) {
      var sections = resEl.querySelectorAll('div[style*="text-align:center"]');
      for (var i = 0; i < sections.length; i++) {
        var divs = sections[i].querySelectorAll('div');
        if (divs.length >= 2) {
          var lbl = (divs[0].textContent || '').trim();
          var val = (divs[1].textContent || '').trim();
          if (lbl && val) { y = _bigResult(doc, y, lbl, val, ''); }
        }
      }
    }
  }

  // 12. MANIFOLD DIAGNOSTICS
  function _reportManifold(doc) {
    var y = _addHeader(doc, 'MANIFOLD DIAGNOSTICS REPORT', _tc('hp_realtime_diag_station', 'Estacion de diagnostico HVACR en tiempo real'));
    var ref = _getInputVal('htMfRef') || 'R-410A';
    var sysType = window._htMfSysType || 'ac';
    var md = window._htMfMeteringDevice || 'txv';
    var sysLabels = { ac: 'A/C Central', mini: 'Mini Split', hp: 'Heat Pump', mt: 'Refrig. M/T', lt: 'Freezer/L.T.', ptac: 'PTAC/Package' };
    y = _sectionTitle(doc, y, _tc('hp_configuration', 'CONFIGURACIÓN'));
    y = _dataRow(doc, y, _tc('hp_system_type', 'Tipo sistema') + ':', sysLabels[sysType] || sysType, '');
    y = _dataRow(doc, y, _tc('hp_refrigerant', 'Refrigerante') + ':', ref, '');
    y = _dataRow(doc, y, 'Metering device:', md.toUpperCase(), '');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_pressures', 'PRESIONES'));
    y = _dataRow(doc, y, 'Low side:', _getInputVal('htMfLoInput') || '--', 'psig');
    y = _dataRow(doc, y, 'High side:', _getInputVal('htMfHiInput') || '--', 'psig');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_temperatures', 'TEMPERATURAS'));
    y = _dataRow(doc, y, _tc('hp_suction_line', 'Linea succion') + ':', _getInputVal('htMfSucT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_liquid_line', 'Linea liquido') + ':', _getInputVal('htMfLiqT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_outdoor_temp', 'Temp exterior') + ':', _getInputVal('htMfOutT') || '--', 'F');
    y = _dataRow(doc, y, _tc('hp_indoor_temp', 'Temp interior') + ':', _getInputVal('htMfInT') || '--', 'F');
    y = _dataRow(doc, y, 'Temp supply:', _getInputVal('htMfSupT') || '--', 'F');
    y += 4;
    // Analysis metrics
    y = _checkPage(doc, y, 50);
    y = _sectionTitle(doc, y, _tc('hp_system_analysis', 'ANALISIS DEL SISTEMA'));
    var analysisEl = document.getElementById('htMfAnalysis');
    if (analysisEl) {
      var boxes = analysisEl.querySelectorAll('div[style*="text-align:center"]');
      for (var i = 0; i < boxes.length; i++) {
        var divs = boxes[i].querySelectorAll('div');
        if (divs.length >= 2) {
          var lbl = (divs[0].textContent || '').trim();
          var val = (divs[1].textContent || '').trim();
          if (lbl && val && val !== '--') { y = _dataRow(doc, y, lbl + ':', val, ''); y = _checkPage(doc, y, 10); }
        }
      }
    }
    // Diagnostics
    var diagEl = document.getElementById('htMfDiag');
    if (diagEl && diagEl.textContent.trim().length > 20) {
      y = _checkPage(doc, y, 30);
      y += 4;
      y = _sectionTitle(doc, y, _tc('hp_realtime_diagnostics', 'DIAGNOSTICO EN TIEMPO REAL'));
      var items = diagEl.querySelectorAll('div[style*="display:flex"]');
      for (var i = 0; i < items.length; i++) {
        var txt = (items[i].textContent || '').trim();
        if (txt.length > 3) {
          y = _checkPage(doc, y, 10);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          var lines = doc.splitTextToSize(txt, 170);
          doc.text(lines, 20, y);
          y += lines.length * 4 + 2;
        }
      }
    }
  }

  // 13. MULTIMETER
  function _reportMultimeter(doc) {
    var mode = window._htMMMode || 'off';
    var comp = window._htMMComponent || 'comp';
    var compLabels = {comp:_tc('hp_compressor', 'Compresor'),condFan:'Condenser Fan',blower:'Blower',contactor:'Contactor',transformer:_tc('hp_transformer', 'Transformador'),capacitor:_tc('hp_capacitor', 'Capacitor')};
    var modeLabels = {off:_tc('hp_off', 'Apagado'),vac:_tc('hp_voltage_ac', 'Voltaje AC'),vdc:_tc('hp_voltage_dc', 'Voltaje DC'),aac:_tc('hp_amperage_ac', 'Amperaje AC'),ohm:_tc('hp_resistance', 'Resistencia'),uf:_tc('hp_capacitance', 'Capacitancia'),hz:_tc('hp_frequency', 'Frecuencia'),watt:_tc('hp_power', 'Potencia'),ua:'Micro Amps',diode:_tc('hp_diode_test', 'Diodo Test'),cont:_tc('hp_continuity', 'Continuidad'),mohm:'Insulation',temp:_tc('hp_temperature', 'Temperatura'),ph3:_tc('hp_three_phase', 'Trifasico')};
    var y = _addHeader(doc, 'MULTIMETER REPORT', 'Fieldpiece SC680 - ' + (modeLabels[mode] || mode));
    y = _sectionTitle(doc, y, _tc('hp_configuration', 'CONFIGURACIÓN'));
    y = _dataRow(doc, y, _tc('hp_mode', 'Modo') + ':', modeLabels[mode] || mode, '');
    y = _dataRow(doc, y, _tc('hp_component', 'Componente') + ':', compLabels[comp] || comp, '');
    y += 4;
    y = _sectionTitle(doc, y, _tc('hp_main_reading', 'LECTURA PRINCIPAL'));
    y = _bigResult(doc, y, modeLabels[mode] || 'VALOR', _getVal('htMMVal'), '');
    y += 4;
    // All stored data
    var data = window._htMMData || {};
    var dataKeys = Object.keys(data);
    if (dataKeys.length > 0) {
      y = _sectionTitle(doc, y, _tc('hp_recorded_measurements', 'MEDICIONES REGISTRADAS'));
      var labels = {mmVrated:'V Nameplate',mmVmeas:'V '+_tc('hp_measured', 'Medido'),mmV24:'Control 24V',mmVdc:'V DC',mmRLA:'RLA',mmLRA:'LRA',mmAMeas:'A '+_tc('hp_measured', 'Medido'),mmInrush:'In-Rush',mmCS:'C-S Ohm',mmCR:'C-R Ohm',mmSR:'S-R Ohm',mmOhms:'General Ohm',mmCapR:'Cap Comp Rated uF',mmCapM:'Cap Comp '+_tc('hp_measured', 'Medido')+' uF',mmCapFR:'Cap Fan Rated uF',mmCapFM:'Cap Fan '+_tc('hp_measured', 'Medido')+' uF',mmFreq:_tc('hp_frequency', 'Frecuencia')+' Hz',mmDuty:'Duty %',mmWV:'Watts V',mmWA:'Watts A',mmWPF:'Power Factor',mmWPh:_tc('hp_phases', 'Fases'),mmUA:'Flame Sensor uA',mmDiode:'Forward V',mmCont:'Cont Ohm',mmMeg:'MegOhm',mmTemp1:'T1 F',mmTemp2:'T2 F',mmL12:'L1-L2 V',mmL23:'L2-L3 V',mmL13:'L1-L3 V',mmA1:'L1 A',mmA2:'L2 A',mmA3:'L3 A',mmPF:'PF',mmVsrc:'V Panel',mmVload:'V '+_tc('hp_equipment', 'Equipo')};
      for (var i = 0; i < dataKeys.length; i++) {
        var k = dataKeys[i];
        y = _dataRow(doc, y, (labels[k] || k) + ':', String(data[k]), '');
        y = _checkPage(doc, y, 10);
      }
    }
    // Diagnostics
    var diagEl = document.getElementById('htMMDiag');
    if (diagEl && diagEl.textContent.trim().length > 5) {
      y = _checkPage(doc, y, 30);
      y += 4;
      y = _sectionTitle(doc, y, _tc('hp_diagnostics', 'DIAGNOSTICO'));
      var items = diagEl.querySelectorAll('div[style*="display:flex"]');
      for (var i = 0; i < items.length; i++) {
        var txt = (items[i].textContent || '').trim();
        if (txt.length > 3) {
          y = _checkPage(doc, y, 10);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          var lines = doc.splitTextToSize(txt, 170);
          doc.text(lines, 20, y);
          y += lines.length * 4 + 2;
        }
      }
    }
  }

  // ============================
  // ELECTRICAL LOAD CALCULATION PRO — PDF Report
  // ============================
  function _reportElecLoad(doc) {
    var R = window._htELLastResult;
    if (!R) {
      var y = _addHeader(doc, 'ELECTRICAL LOAD REPORT', 'No calculation data — run calculator first');
      return;
    }
    // Page 1: Summary
    var y = _addHeader(doc, 'ELECTRICAL LOAD CALCULATION PRO', 'NEC Article 220 · Full Dwelling Analysis');
    y = _sectionTitle(doc, y, 'DWELLING INFORMATION');
    y = _dataRow(doc, y, 'Square Footage:', String(R.sqft) + ' sq ft', '');
    y = _dataRow(doc, y, 'Voltage:', R.voltage + 'V', '');
    y = _dataRow(doc, y, 'Bedrooms / Bathrooms:', R.bedrooms + ' / ' + R.bathrooms, '');
    if (R.dwelling) y = _dataRow(doc, y, 'Dwelling Type:', R.dwelling, '');
    y += 4;
    y = _sectionTitle(doc, y, 'NEC 220 STANDARD METHOD');
    y = _dataRow(doc, y, 'General Lighting:', Math.round(R.lightingVA) + ' VA', R.sqft + ' sqft × 3 VA');
    y = _dataRow(doc, y, 'Small Appliance:', Math.round(R.smallAppVA) + ' VA', '');
    y = _dataRow(doc, y, 'Laundry:', Math.round(R.laundryVA) + ' VA', '');
    y = _dataRow(doc, y, 'General Subtotal:', Math.round(R.genSubtotal) + ' VA', '');
    y = _dataRow(doc, y, 'After Demand (220.42):', Math.round(R.genDemand) + ' W', '');
    if (R.rangeDemandW > 0) y = _dataRow(doc, y, 'Range/Oven (220.55):', Math.round(R.rangeDemandW) + ' W', '');
    if (R.dryerDemandW > 0) y = _dataRow(doc, y, 'Dryer (220.54):', Math.round(R.dryerDemandW) + ' W', 'min 5kW');
    y = _dataRow(doc, y, 'HVAC — ' + R.hvacWinner + ' (220.60):', Math.round(R.hvacW) + ' W', '');
    y = _dataRow(doc, y, 'Fixed Appliances' + (R.fixed75 ? ' (75%)' : '') + ':', Math.round(R.fixedDemand) + ' W', '');
    if (R.specialTotal > 0) y = _dataRow(doc, y, 'Special Loads:', Math.round(R.specialTotal) + ' W', '');
    y += 2;
    y = _bigResult(doc, y, 'TOTAL DEMAND (Standard)', Math.round(R.totalStd).toLocaleString() + ' W', R.ampsStd.toFixed(1) + 'A');
    y += 4;
    y = _checkPage(doc, y, 30);
    y = _sectionTitle(doc, y, 'NEC 220 OPTIONAL METHOD (220.82/83)');
    y = _bigResult(doc, y, 'TOTAL DEMAND (Optional)', Math.round(R.optDemand).toLocaleString() + ' W', R.ampsOpt.toFixed(1) + 'A');
    y = _dataRow(doc, y, 'Method Used:', R.useMethod + ' (lower value)', '');
    y += 4;
    y = _checkPage(doc, y, 30);
    y = _sectionTitle(doc, y, 'SERVICE ENTRANCE (NEC 310.12)');
    y = _dataRow(doc, y, 'Service Size:', R.serviceSize + 'A @ ' + R.voltage + 'V', '');
    y = _dataRow(doc, y, 'Neutral Load:', R.neutralAmps.toFixed(1) + 'A', 'NEC 220.61');
    y = _dataRow(doc, y, 'Copper Conductor:', R.svcCond.cu + ' AWG', 'THWN-2');
    y = _dataRow(doc, y, 'Aluminum Conductor:', R.svcCond.al + ' AWG', 'THWN-2');
    y += 4;
    y = _checkPage(doc, y, 30);
    y = _sectionTitle(doc, y, 'GROUNDING SYSTEM (NEC 250)');
    y = _dataRow(doc, y, 'GEC Copper (250.66):', R.gec.cu + ' AWG', '');
    y = _dataRow(doc, y, 'GEC Aluminum (250.66):', R.gec.al + ' AWG', '');
    y = _dataRow(doc, y, 'EGC Copper (250.122):', R.egc.cu + ' AWG', '');
    y = _dataRow(doc, y, 'EGC Aluminum (250.122):', R.egc.al + ' AWG', '');
    y = _dataRow(doc, y, 'Bonding Jumper:', 'Same as GEC', '');
    // Solar
    if (R.solar) {
      y += 4;
      y = _checkPage(doc, y, 20);
      y = _sectionTitle(doc, y, 'SOLAR PV (NEC 690/705 · Title 24)');
      y = _dataRow(doc, y, 'System Size:', R.solar.kw + ' kW', '');
      if (R.solar.battery) y = _dataRow(doc, y, 'Battery Storage:', R.solar.battKWH + ' kWh', '');
      var t24 = (R.sqft * 0.554 / 1000) + 1.784;
      var bc = (R.solar.battery && R.solar.battKWH >= 7.5) ? 0.75 : 1.0;
      y = _dataRow(doc, y, 'Title 24 Required:', (t24 * bc).toFixed(2) + ' kW', '');
      var maxBrk = (R.serviceSize * 1.2) - R.serviceSize;
      y = _dataRow(doc, y, '120% Bus Rule Max:', maxBrk.toFixed(0) + 'A', '');
    }
    // Generator
    if (R.generator) {
      y += 4;
      y = _checkPage(doc, y, 15);
      y = _sectionTitle(doc, y, 'STANDBY GENERATOR (NEC 702)');
      y = _dataRow(doc, y, 'Generator:', R.generator.kw + ' kW', '');
      y = _dataRow(doc, y, 'Transfer Switch:', R.generator.transfer ? (R.generator.type === 'auto' ? 'Automatic' : 'Manual') + ' ' + R.generator.amps + 'A' : 'None', '');
    }
    // Page 2: Branch circuits
    if (R.circuits && R.circuits.length > 0) {
      doc.addPage();
      y = 15;
      y = _sectionTitle(doc, y, 'BRANCH CIRCUIT SCHEDULE (' + R.circuits.length + ' circuits)');
      // Table header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      var cols = [20, 75, 90, 105, 125, 145, 165];
      var headers = ['Circuit', 'V', 'Brk', 'Wire', 'Prot', 'NEC', 'Watts'];
      for (var hi = 0; hi < headers.length; hi++) doc.text(headers[hi], cols[hi], y);
      y += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      for (var ci = 0; ci < R.circuits.length; ci++) {
        y = _checkPage(doc, y, 6);
        var c = R.circuits[ci];
        doc.setTextColor(60, 60, 60);
        doc.text(String(c.name || '').substring(0, 25), cols[0], y);
        doc.text(String(c.v), cols[1], y);
        doc.text(c.brk + 'A', cols[2], y);
        doc.text(String(c.wire), cols[3], y);
        doc.text(String(c.prot), cols[4], y);
        doc.text(String(c.nec), cols[5], y);
        doc.text(String(c.w), cols[6], y);
        y += 5;
      }
      // Panel summary
      y += 4;
      var totalSpaces = 0;
      for (var si = 0; si < R.circuits.length; si++) totalSpaces += R.circuits[si].v === 240 ? 2 : 1;
      var panelSize = totalSpaces <= 20 ? 20 : totalSpaces <= 30 ? 30 : totalSpaces <= 40 ? 40 : 42;
      y = _dataRow(doc, y, 'Total Breaker Spaces:', totalSpaces + '', '');
      y = _dataRow(doc, y, 'Recommended Panel:', panelSize + '-space', '');
      y = _dataRow(doc, y, 'Main Breaker:', R.serviceSize + 'A', '');
    }
    // NEC reference footer
    y = _checkPage(doc, y, 20);
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    var refs = 'NEC References: 220.12, 220.42, 220.52, 220.53, 220.54, 220.55, 220.60, 220.61, 220.82/83, 250.66, 250.122, 310.12, 314.16';
    if (R.solar) refs += ', 690, 705.12(B)(2)';
    if (R.generator) refs += ', 702';
    var refLines = doc.splitTextToSize(refs, 170);
    doc.text(refLines, 20, y);
  }

  // ============================
  // MAIN EXPORT FUNCTIONS (dual dispatch: number for anemometer tabs, string for tools)
  // ============================
  var TAB_NAMES = ['Vane Anemometer', 'Hot Wire', 'Flowhood', 'Pitot Tube', 'Balance', 'Temp-BTU'];
  var TAB_REPORTERS = [_reportVane, _reportHotWire, _reportFlowhood, _reportPitot, _reportBalance, _reportTempBTU];

  var TOOL_REPORTERS = {
    'shsc':        { fn: _reportSHSC,        name: 'Superheat-Subcooling' },
    'ductulator':  { fn: _reportDuctulator,   name: 'Ductulator' },
    'conduitfill': { fn: _reportConduitFill,  name: 'Conduit Fill' },
    'wiresizing':  { fn: _reportWireSizing,   name: 'Wire Sizing' },
    'powerwheel':  { fn: _reportPowerWheel,   name: 'Power Wheel' },
    'sysanalyzer': { fn: _reportSysAnalyzer,  name: 'System Analyzer' },
    'psychart':    { fn: _reportPsychart,     name: 'Psychrometric Chart' },
    'carga':       { fn: _reportCargaTermica, name: 'HVAC Equipment Sizing' },
    'walkin':      { fn: _reportWalkin,       name: 'Walk-in Sizing' },
    'refcharge':   { fn: _reportRefCharge,    name: 'Refrigerant Charge' },
    'linesize':    { fn: _reportLineSize,     name: 'Line Sizing' },
    'manifold':    { fn: _reportManifold,     name: 'Manifold Diagnostics' },
    'multimeter':  { fn: _reportMultimeter,   name: 'Multimeter' },
    'elecload':    { fn: _reportElecLoad,    name: 'Electrical Load Calculator' }
  };

  function _getReportName(key) {
    if (typeof key === 'number') return TAB_NAMES[key] || 'Report';
    return TOOL_REPORTERS[key] ? TOOL_REPORTERS[key].name : 'Report';
  }

  function _generateReport(key) {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
      var _msg = _tc('hp_loading_pdf', 'Cargando libreria PDF... intenta de nuevo en 2 segundos.'); if (typeof window.showToast === 'function') window.showToast(_msg); else window.MaestroDialog.alert({title: '', message: _msg, kind: 'info'});
      return;
    }
    var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });

    if (typeof key === 'number') {
      TAB_REPORTERS[key](doc);
    } else if (TOOL_REPORTERS[key]) {
      TOOL_REPORTERS[key].fn(doc);
    }
    _addFooter(doc);
    return doc;
  }

  // Download PDF
  window.hvacPdfDownload = function(key) {
    var doc = _generateReport(key);
    if (!doc) return;
    var name = 'ACVOLT-Report-' + _getReportName(key).replace(/\s+/g, '-') + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(name);
  };

  // Share PDF (Web Share API)
  window.hvacPdfShare = function(key) {
    var doc = _generateReport(key);
    if (!doc) return;
    var blob = doc.output('blob');
    var rName = _getReportName(key);
    var name = 'ACVOLT-Report-' + rName.replace(/\s+/g, '-') + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
    var file = new File([blob], name, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: _tc('hp_share_title', 'Reporte HVAC') + ' — Maestro HVACR',
        text: _tc('hp_share_report_of', 'Reporte de') + ' ' + rName + ' ' + _tc('hp_share_generated_by', 'generado por Maestro HVACR')
      }).catch(function(e) {
        console.log('[PDF] Share cancelled:', e);
        doc.save(name);
      });
    } else {
      doc.save(name);
    }
  };

  // Print PDF (opens in new tab for printing or saving to Files)
  window.hvacPdfPrint = function(key) {
    var doc = _generateReport(key);
    if (!doc) return;
    var blob = doc.output('blob');
    var url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
  };

  // Get the action bar HTML for embedding in tools
  window.hvacPdfBar = function(key) {
    var arg = typeof key === 'number' ? key : "'" + key + "'";
    return '<div style="background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(34,197,94,0.05));border:1px solid rgba(59,130,246,0.15);border-radius:12px;padding:12px;margin-top:12px;">' +
      '<div style="text-align:center;font-size:13px;font-weight:800;color:#111111;margin-bottom:8px;letter-spacing:1px;">\uD83D\uDCC4 ' + _tc('hp_pdf_report', 'REPORTE PDF') + '</div>' +
      '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">' +
      '<button onclick="hvacPdfDownload(' + arg + ')" style="flex:1;min-width:90px;max-width:130px;padding:10px 8px;border-radius:10px;border:1.5px solid rgba(59,130,246,0.45);background:rgba(59,130,246,0.12);color:#111111;font-weight:800;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">' +
      '\uD83D\uDCBE ' + _tc('hp_save', 'Guardar') + '</button>' +
      '<button onclick="hvacPdfPrint(' + arg + ')" style="flex:1;min-width:90px;max-width:130px;padding:10px 8px;border-radius:10px;border:1.5px solid rgba(168,85,247,0.45);background:rgba(168,85,247,0.12);color:#111111;font-weight:800;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">' +
      '\uD83D\uDDA8\uFE0F ' + _tc('hp_print', 'Imprimir') + '</button>' +
      '<button onclick="hvacPdfShare(' + arg + ')" style="flex:1;min-width:90px;max-width:130px;padding:10px 8px;border-radius:10px;border:1.5px solid rgba(34,197,94,0.45);background:rgba(34,197,94,0.12);color:#111111;font-weight:800;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">' +
      '\uD83D\uDCE4 ' + _tc('hp_share', 'Compartir') + '</button>' +
    '</div></div>';
  };

})();
