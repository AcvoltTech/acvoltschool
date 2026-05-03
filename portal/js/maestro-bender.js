// ============================================
// MAESTRO BENDER v1.0 — Conduit Bending Calculator
// 10 bend calculators + references + NEC + safety
// Free, offline, bilingual (ES/EN), no paywall.
// Nivel 33 · ACVOLT Tech School
// ============================================

(function() {
  'use strict';

  // ── Constants ─────────────────────────────────────────────────
  var MULTIPLIERS = { 10: 6.0, 22.5: 2.6, 30: 2.0, 45: 1.414, 60: 1.155 };
  var SHRINK_PER_INCH = { 10: 0.0625, 22.5: 0.1875, 30: 0.25, 45: 0.375, 60: 0.5 };
  var TAKE_UP = { '1/2': 5, '3/4': 6, '1': 8, '1-1/4': 11, '1-1/2': 14, '2': 16 };
  var SADDLE_3PT = {
    22.5: { multiplier: 2.5, shrinkPerInch: 0.1875 },
    30:   { multiplier: 2.0, shrinkPerInch: 0.25 }
  };
  var CONDUIT_SIZES = [
    { nominal: '1/2',   odIn: 0.706, idIn: 0.622, wtPerFt: 0.28, minRadius: 4 },
    { nominal: '3/4',   odIn: 0.922, idIn: 0.824, wtPerFt: 0.44, minRadius: 4.5 },
    { nominal: '1',     odIn: 1.163, idIn: 1.049, wtPerFt: 0.65, minRadius: 5.75 },
    { nominal: '1-1/4', odIn: 1.510, idIn: 1.380, wtPerFt: 0.96, minRadius: 7.25 },
    { nominal: '1-1/2', odIn: 1.740, idIn: 1.610, wtPerFt: 1.11, minRadius: 8.25 },
    { nominal: '2',     odIn: 2.197, idIn: 2.067, wtPerFt: 1.34, minRadius: 9.5 },
    { nominal: '2-1/2', odIn: 2.875, idIn: 2.731, wtPerFt: 2.16, minRadius: 10.5 },
    { nominal: '3',     odIn: 3.500, idIn: 3.356, wtPerFt: 2.62, minRadius: 13 },
    { nominal: '3-1/2', odIn: 4.000, idIn: 3.834, wtPerFt: 3.30, minRadius: 15 },
    { nominal: '4',     odIn: 4.500, idIn: 4.334, wtPerFt: 3.86, minRadius: 16 }
  ];

  // ── i18n: register bilingual strings ───────────────────────────
  function _regI18n() {
    if (typeof window._addTranslations !== 'function') return;
    window._addTranslations({
      mb_title: { es: 'Maestro Bender', en: 'Maestro Bender' },
      mb_subtitle: { es: 'Calculadora profesional de doblado de tubo conduit', en: 'Professional conduit bending calculator' },
      mb_tagline: { es: 'La referencia en español para el oficio', en: 'The Spanish-language reference for the trade' },
      mb_free_badge: { es: 'GRATIS · SIN PUBLICIDAD', en: 'FREE · NO ADS' },
      mb_back: { es: 'Volver', en: 'Back' },
      mb_menu: { es: 'Menú', en: 'Menu' },
      mb_card_title: { es: 'Maestro Bender', en: 'Maestro Bender' },
      mb_card_sub: { es: 'Doblado de conduit · 10 calculadoras · NEC', en: 'Conduit bending · 10 calculators · NEC' },
      // Sidebar sections
      mb_sec_welcome: { es: 'Bienvenida', en: 'Welcome' },
      mb_sec_calcs: { es: 'Calculadoras', en: 'Calculators' },
      mb_sec_refs: { es: 'Referencias', en: 'References' },
      mb_sec_norm: { es: 'Normativa', en: 'Code / NEC' },
      mb_sec_extras: { es: 'Extras', en: 'Extras' },
      mb_sec_exit: { es: 'Salida', en: 'Exit' },
      // Welcome items
      mb_about: { es: 'Acerca de', en: 'About' },
      mb_prefs: { es: 'Preferencias', en: 'Preferences' },
      mb_start: { es: 'Primeros Pasos', en: 'Getting Started' },
      // Calculators
      mb_stub90: { es: 'Stub 90°', en: 'Stub 90°' },
      mb_offset: { es: 'Offset / Rodado', en: 'Offset / Rolling' },
      mb_saddle3: { es: 'Saddle 3 Puntos', en: '3-Point Saddle' },
      mb_saddle4: { es: 'Saddle 4 Puntos', en: '4-Point Saddle' },
      mb_parallel: { es: 'Paralelos', en: 'Parallel / Concentric' },
      mb_segment: { es: 'Segmento (Curva)', en: 'Segment Bend' },
      mb_compound: { es: 'Compound 90°', en: 'Compound 90°' },
      mb_gain: { es: 'Gain y Take-up', en: 'Gain & Take-up' },
      mb_kick: { es: 'Kick', en: 'Kick' },
      mb_b2b: { es: 'Back-to-Back 90°', en: 'Back-to-Back 90°' },
      // References
      mb_ref_layout: { es: 'Layout de Conduit', en: 'Conduit Layout' },
      mb_ref_sizes: { es: 'Peso y Tamaños', en: 'Weight & Sizes' },
      mb_ref_radius: { es: 'Radio y Gain', en: 'Radius & Gain' },
      mb_ref_frac: { es: 'Fracciones', en: 'Fractions' },
      mb_ref_trig: { es: 'Trigonometría', en: 'Trigonometry' },
      mb_ref_level: { es: 'Nivel', en: 'Level' },
      mb_ref_tapes: { es: 'Cintas y Niveles', en: 'Tapes & Levels' },
      // Normative
      mb_nec_req: { es: 'Requisitos NEC', en: 'NEC Requirements' },
      mb_nec_terms: { es: 'Términos Importantes', en: 'Key Terms' },
      mb_nec_elec: { es: 'Términos Electricista', en: 'Electrician Terms' },
      mb_nec_methods: { es: 'Métodos de Doblado', en: 'Bending Methods' },
      mb_nec_faq: { es: 'Preguntas Frecuentes', en: 'FAQ' },
      mb_nec_safety: { es: 'Manual de Seguridad', en: 'Safety Manual' },
      // Extras
      mb_ext_videos: { es: 'Videos del Maestro', en: 'Maestro Videos' },
      mb_ext_quiz: { es: 'Quiz de Doblado', en: 'Bending Quiz' },
      mb_ext_prog: { es: 'Mi Progreso', en: 'My Progress' },
      mb_exit_back: { es: 'Volver a MAESTRO HVACR', en: 'Back to MAESTRO HVACR' },
      // Labels
      mb_results: { es: 'Medidas de Marcado en el Conduit', en: 'Conduit Marking Measurements' },
      mb_tips: { es: 'Tips del Maestro', en: 'Maestro Tips' },
      mb_example: { es: 'Ejemplo resuelto', en: 'Worked example' },
      mb_video_soon: { es: 'Video explicativo próximamente', en: 'Explainer video coming soon' },
      mb_invalid: { es: 'Doblez no posible con estos ajustes', en: 'Bend not possible with these settings' },
      mb_stub_len: { es: 'Largo del stub', en: 'Stub length' },
      mb_emt_size: { es: 'Tamaño EMT', en: 'EMT size' },
      mb_take_up: { es: 'Take-up', en: 'Take-up' },
      mb_mark_from_end: { es: 'Marca desde el extremo', en: 'Mark from end' },
      mb_height: { es: 'Altura del obstáculo', en: 'Obstacle height' },
      mb_depth: { es: 'Profundidad (para rodado)', en: 'Depth (for rolling)' },
      mb_distance: { es: 'Distancia al obstáculo', en: 'Distance to obstacle' },
      mb_angle: { es: 'Ángulo de doblez', en: 'Bend angle' },
      mb_multiplier: { es: 'Multiplier', en: 'Multiplier' },
      mb_shrink: { es: 'Shrink total', en: 'Total shrink' },
      mb_between_marks: { es: 'Distancia entre marcas', en: 'Distance between marks' },
      mb_mark1: { es: 'Marca 1 (desde coupling)', en: 'Mark 1 (from coupling)' },
      mb_mark2: { es: 'Marca 2 (desde coupling)', en: 'Mark 2 (from coupling)' },
      mb_rotation: { es: 'Rotación del tubo', en: 'Conduit rotation' },
      mb_side_angle: { es: 'Ángulo lateral', en: 'Side angle' },
      mb_center_angle: { es: 'Ángulo central', en: 'Center angle' },
      mb_center_mark: { es: 'Marca central', en: 'Center mark' },
      mb_left_mark: { es: 'Marca izquierda', en: 'Left mark' },
      mb_right_mark: { es: 'Marca derecha', en: 'Right mark' },
      mb_width: { es: 'Ancho del obstáculo', en: 'Obstacle width' },
      mb_mark3: { es: 'Marca 3', en: 'Mark 3' },
      mb_mark4: { es: 'Marca 4', en: 'Mark 4' },
      mb_center_obst: { es: 'Centro del obstáculo', en: 'Center of obstacle' },
      mb_spacing: { es: 'Separación entre conduits', en: 'Conduit spacing' },
      mb_count: { es: 'Número de conduits', en: 'Number of conduits' },
      mb_base_height: { es: 'Altura del offset base', en: 'Base offset height' },
      mb_base_distance: { es: 'Distancia base', en: 'Base distance' },
      mb_radius: { es: 'Radio', en: 'Radius' },
      mb_num_bends: { es: 'Número de dobleces', en: 'Number of bends' },
      mb_total_angle: { es: 'Ángulo total', en: 'Total angle' },
      mb_angle_per: { es: 'Ángulo por segmento', en: 'Angle per segment' },
      mb_dist_between_bends: { es: 'Distancia entre dobleces', en: 'Distance between bends' },
      mb_total_length: { es: 'Longitud total', en: 'Total length' },
      mb_first_mark: { es: 'Primera marca (desde coupling)', en: 'First mark (from coupling)' },
      mb_b2b_dist: { es: 'Distancia entre espaldas', en: 'Back-to-back distance' },
      mb_gain_label: { es: 'Gain (ganancia)', en: 'Gain' },
      mb_about_body: {
        es: 'Maestro Bender™ es la referencia en español para electricistas que doblan conduit en el campo. Calculadoras profesionales, tips del maestro, normativa NEC y fracciones — todo offline y gratis.',
        en: 'Maestro Bender™ is the Spanish-language reference for electricians bending conduit in the field. Professional calculators, maestro tips, NEC code and fractions — offline and free.'
      },
      mb_prefs_emt: { es: 'EMT predeterminado', en: 'Default EMT' },
      mb_prefs_units: { es: 'Unidades', en: 'Units' },
      mb_prefs_imperial: { es: 'Pulgadas (imperial)', en: 'Inches (imperial)' },
      mb_prefs_metric: { es: 'Centímetros (métrico)', en: 'Centimeters (metric)' },
      mb_prefs_saved: { es: 'Preferencias guardadas', en: 'Preferences saved' },
      mb_frac_title: { es: 'Conversor Decimal ↔ Fracción', en: 'Decimal ↔ Fraction Converter' },
      mb_frac_dec: { es: 'Decimal (ej: 6.75)', en: 'Decimal (e.g. 6.75)' },
      mb_frac_frac: { es: 'Fracción (ej: 6 3/4)', en: 'Fraction (e.g. 6 3/4)' },
      mb_saddle3_side_opt: { es: 'Usa 22.5° (multiplier 2.5) ó 30° (multiplier 2.0)', en: 'Use 22.5° (multiplier 2.5) or 30° (multiplier 2.0)' },
      mb_safety_title: { es: 'Manual de Seguridad · Electricista', en: 'Safety Manual · Electrician' },
      // Result labels / table headers / extras
      mb_arc_length: { es: 'Longitud de arco', en: 'Arc length' },
      mb_straight_equiv: { es: 'Equivalente recto', en: 'Straight equivalent' },
      mb_conduit_n: { es: 'Conduit', en: 'Conduit' },
      mb_tbl_nominal: { es: 'Nominal', en: 'Nominal' },
      mb_tbl_od: { es: 'OD', en: 'OD' },
      mb_tbl_id: { es: 'ID', en: 'ID' },
      mb_tbl_weight: { es: 'Peso', en: 'Weight' },
      mb_tbl_min_r: { es: 'Radio Mín.', en: 'Min R' },
      mb_tbl_min_dia: { es: 'Diámetro Mín.', en: 'Min Diameter' },
      mb_mt_hand_h: { es: 'Dobladora manual', en: 'Hand bender' },
      mb_mt_mech_h: { es: 'Mecánica / Chicago', en: 'Mechanical / Chicago' },
      mb_mt_hyd_h: { es: 'Hidráulica / Eléctrica', en: 'Hydraulic / Electric' },
      mb_mt_seg_h: { es: 'Doblado por segmentos', en: 'Segment bending' },
      mb_level_33: { es: 'Nivel 33', en: 'Level 33' }
    });
  }

  // ── Translation helper (bilingual fallback) ────────────────────
  // Local _t(k, fb) per project spec — thin wrapper over window._t.
  function _t(k, fb) {
    try {
      if (typeof window._t === 'function') {
        var v = window._t(k, null);
        if (v != null && v !== k) return v;
      }
    } catch(e){}
    return fb;
  }
  function T(key, fbEs, fbEn) {
    try {
      if (typeof window._t === 'function') {
        var v = window._t(key, null);
        if (v != null && v !== key) return v;
      }
    } catch(e){}
    var lang = (window._lang || window.lang || 'es');
    return lang === 'en' && fbEn ? fbEn : (fbEs || key);
  }

  // ── State ──────────────────────────────────────────────────────
  var state = {
    currentSection: 'home',
    currentBend: null,
    inputs: {},
    preferences: { defaultEmtSize: '1/2', units: 'imperial' },
    sidebarOpen: false
  };

  function _loadPrefs() {
    try {
      var raw = localStorage.getItem('mb_prefs');
      if (raw) state.preferences = Object.assign({}, state.preferences, JSON.parse(raw));
    } catch(e){}
  }
  function _savePrefs() {
    try { localStorage.setItem('mb_prefs', JSON.stringify(state.preferences)); } catch(e){}
  }

  // ── Utilities ──────────────────────────────────────────────────
  function decToFrac(decimal, precision) {
    precision = precision || 16;
    if (decimal == null || isNaN(decimal)) return '—';
    var neg = decimal < 0;
    decimal = Math.abs(decimal);
    var whole = Math.floor(decimal);
    var remainder = decimal - whole;
    var numerator = Math.round(remainder * precision);
    var sign = neg ? '−' : '';
    if (numerator === 0) return sign + whole + '"';
    if (numerator === precision) return sign + (whole + 1) + '"';
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    var g = gcd(numerator, precision);
    var n = numerator / g, d = precision / g;
    return sign + (whole > 0 ? whole + ' ' + n + '/' + d + '"' : n + '/' + d + '"');
  }
  function fracToDec(str) {
    if (str == null) return NaN;
    str = (str + '').replace('"', '').trim();
    if (!str) return NaN;
    if (!isNaN(parseFloat(str)) && !str.includes('/')) return parseFloat(str);
    var parts = str.split(/\s+/);
    if (parts.length === 2) {
      var whole = parseFloat(parts[0]);
      var fp = parts[1].split('/').map(Number);
      if (fp.length === 2 && fp[1]) return whole + (fp[0] / fp[1]);
    }
    var fp2 = str.split('/').map(Number);
    if (fp2.length === 2 && fp2[1]) return fp2[0] / fp2[1];
    return NaN;
  }
  function fmt(v) {
    if (v == null || isNaN(v)) return '—';
    // Round to nearest 1/16" first so the feet/inches split is consistent with
    // the displayed fraction (avoids 11 11/16" that would round up to 12").
    var precision = 16;
    v = Math.round(v * precision) / precision;
    if (Math.abs(v) < 12) return decToFrac(v, precision);
    var neg = v < 0;
    v = Math.abs(v);
    var feet = Math.floor(v / 12);
    var remInches = v - feet * 12;
    var sign = neg ? '−' : '';
    if (remInches === 0) return sign + feet + "'";
    return sign + feet + "' " + decToFrac(remInches, precision);
  }
  function round2(v) {
    if (v == null || isNaN(v)) return '—';
    return Math.round(v * 100) / 100;
  }

  // ── Calculators ────────────────────────────────────────────────
  var calc = {
    stub90: function(i) {
      var takeUp = (i.manualTakeUp != null && i.manualTakeUp !== '') ? +i.manualTakeUp : TAKE_UP[i.emtSize];
      if (takeUp == null || isNaN(takeUp)) return null;
      var markFromEnd = +i.stubLength - takeUp;
      return { markFromEnd: markFromEnd, takeUp: takeUp };
    },
    offset: function(i) {
      var h = +i.height, d = +i.depth || 0, dist = +i.distance, a = +i.angle;
      if (h <= 0 || !MULTIPLIERS[a] || dist < 0) return null;
      var m = MULTIPLIERS[a];
      var spi = SHRINK_PER_INCH[a];
      var actualOffset = d > 0 ? Math.sqrt(h*h + d*d) : h;
      var between = actualOffset * m;
      var shrink = actualOffset * spi;
      var rotation = d > 0 ? Math.atan2(d, h) * 180 / Math.PI : 0;
      // Master Bender convention: "Distance to obstacle" = distance to where the
      // conduit needs to clear. Mark 1 is set back by the ground projection of
      // the sloped section so the offset reaches its full rise AT that point.
      var horizRise = actualOffset / Math.tan(a * Math.PI / 180);
      var mark1 = dist - horizRise;
      if (mark1 < 0) return null;
      return {
        multiplier: m,
        distanceBetweenMarks: between,
        shrinkTotal: shrink,
        mark1FromCoupling: mark1,
        mark2FromCoupling: mark1 + between,
        rotationAngle: rotation,
        handOrder: '2↓ — 1↓',
        flowOrder: '↓1 — ↓2'
      };
    },
    saddle3: function(i) {
      var h = +i.height, dist = +i.distance, sa = +i.sideAngle;
      if (h <= 0 || !SADDLE_3PT[sa]) return null;
      var c = SADDLE_3PT[sa];
      var side = h * c.multiplier;
      return {
        centerMark: dist,
        leftMark: dist - side,
        rightMark: dist + side,
        shrinkTotal: h * c.shrinkPerInch,
        centerAngle: sa * 2,
        sideAngle: sa,
        handOrder: '↓2↓ — ↓1 — 3↓',
        flowOrder: '↓1 — ↓2 — ↓3'
      };
    },
    saddle4: function(i) {
      var h = +i.height, w = +i.width, dist = +i.distance, a = +i.angle;
      if (h <= 0 || w <= 0 || !MULTIPLIERS[a]) return null;
      var m = MULTIPLIERS[a];
      var spacing = h * m;
      // Industry convention: "Distance to obstacle" = distance from coupling to
      // the LEFT edge of the obstacle on the ground. Mark 1 is set back by the
      // horizontal projection of the rising leg so the conduit reaches the top
      // of the obstacle exactly at that edge.
      var horizRise = h / Math.tan(a * Math.PI / 180);
      var mark1 = dist - horizRise;
      if (mark1 < 0) return null;
      return {
        mark1: mark1,
        mark2: mark1 + spacing,
        mark3: mark1 + spacing + w,
        mark4: mark1 + spacing + w + spacing,
        shrinkTotal: h * SHRINK_PER_INCH[a] * 2,
        centerOfObstacle: mark1 + spacing + (w / 2),
        handOrder: '2↓ — 1↓ — ↓3 — ↓4',
        flowOrder: '↓1 — ↓2 — ↓3 — ↓4'
      };
    },
    parallel: function(i) {
      var sp = +i.spacing, a = +i.angle, n = +i.count, bh = +i.baseHeight;
      if (!MULTIPLIERS[a] || n < 2 || bh <= 0) return null;
      var m = MULTIPLIERS[a];
      var add = sp / Math.tan((a / 2) * Math.PI / 180);
      var conduits = [];
      for (var k = 1; k < n; k++) {
        conduits.push({
          conduitNumber: k + 1,
          additionalOffset: add * k,
          totalDistanceBetweenMarks: (bh * m) + (add * k)
        });
      }
      return { baseDistance: bh * m, conduits: conduits, additional: add };
    },
    segment: function(i) {
      var r = +i.radius, n = +i.numberOfBends, ta = +i.totalAngle;
      if (r <= 0 || n < 1 || ta <= 0) return null;
      var anglePer = ta / n;
      var rad = anglePer * Math.PI / 180;
      var between = 2 * r * Math.sin(rad / 2);
      return {
        anglePerSegment: anglePer,
        distanceBetweenBends: between,
        totalLength: between * n,
        firstMarkFromCoupling: between / 2
      };
    },
    compound90: function(i) {
      var sh = +i.stubHeight, oh = +i.offsetHeight, od = +i.offsetDistance, oa = +i.offsetAngle, emt = i.emtSize;
      var tu = TAKE_UP[emt];
      if (sh <= 0 || oh <= 0 || !MULTIPLIERS[oa] || tu == null) return null;
      var m = MULTIPLIERS[oa];
      var between = oh * m;
      // Master Bender convention for the offset portion: mark 1 is set back by
      // the ground projection of the sloped section so the offset clears at od.
      var horizRise = oh / Math.tan(oa * Math.PI / 180);
      var mark1 = od - horizRise;
      if (mark1 < 0) return null;
      return {
        offsetMark1: mark1,
        offsetMark2: mark1 + between,
        offsetBetween: between,
        offsetShrink: oh * SHRINK_PER_INCH[oa],
        stubMarkFromEnd: sh - tu,
        rotationBetween: 90,
        takeUp: tu
      };
    },
    gainTakeUp: function(radius, angle) {
      var rad = angle * Math.PI / 180;
      var arc = radius * rad;
      var straight = 2 * radius * Math.tan(rad / 2);
      return {
        arcLength: arc,
        straightEquivalent: straight,
        gain: straight - arc,
        takeUp: (radius + 1) * Math.tan(rad / 2)
      };
    },
    kick: function(i) {
      var h = +i.height, a = +i.angle;
      if (h <= 0 || !MULTIPLIERS[a]) return null;
      return {
        markFromEnd: h * MULTIPLIERS[a],
        shrink: h * SHRINK_PER_INCH[a]
      };
    },
    backToBack: function(i) {
      var dist = +i.backToBackDistance, tu = TAKE_UP[i.emtSize];
      if (dist <= 0 || tu == null) return null;
      return {
        mark1FromEnd: tu,
        mark2FromEnd: dist + tu,
        distanceBetweenMarks: dist
      };
    }
  };

  // ── Default inputs per calculator ──────────────────────────────
  var DEFAULTS = {
    stub90:    { stubLength: 12,  emtSize: '1/2', manualTakeUp: '' },
    offset:    { height: 3, depth: 0, distance: 12, angle: 30 },
    saddle3:   { height: 2, distance: 20, sideAngle: 22.5 },
    saddle4:   { height: 2, width: 4, distance: 20, angle: 22.5 },
    parallel:  { spacing: 1.25, angle: 30, count: 3, baseHeight: 3 },
    segment:   { radius: 24, numberOfBends: 6, totalAngle: 90 },
    compound90:{ stubHeight: 36, offsetHeight: 2, offsetDistance: 20, offsetAngle: 30, emtSize: '1/2' },
    gainTakeUp:{ radius: 4, angle: 90 },
    kick:      { height: 2, angle: 30 },
    backToBack:{ backToBackDistance: 24, emtSize: '1/2' }
  };

  // ── Tips (bilingual) ───────────────────────────────────────────
  var TIPS = {
    stub90: {
      es: [
        'Marca siempre desde el extremo del tubo, no desde la parte doblada.',
        'Verifica el take-up de tu dobladora específica — puede variar ±¼" según el modelo.',
        'Si el stub queda más corto de lo esperado, probablemente sobreestimaste el take-up.',
        'Usa nivel torpedo en el stub para confirmar que quedó plomo.',
        'El símbolo "STUBS 5 TO" en la dobladora indica la marca de inicio del 90°.'
      ],
      en: [
        'Always mark from the end of the tube, not from the bent section.',
        'Verify your bender\'s specific take-up — it can vary ±¼" by model.',
        'If the stub is shorter than expected, you likely overestimated take-up.',
        'Use a torpedo level on the stub to confirm it\'s plumb.',
        'The "STUBS 5 TO" symbol on the bender marks the start of the 90°.'
      ]
    },
    offset: {
      es: [
        'Siempre marca del mismo lado del tubo para mantener el offset en el mismo plano.',
        'Verifica el ángulo con transportador, no confíes solo en la dobladora.',
        'A 30° el cálculo es más fácil (multiplier = 2), úsalo cuando puedas.',
        'Suma el shrink a la medida original antes de hacer las marcas.',
        'Si el tubo queda torcido, probablemente rotaste la dobladora entre el 1er y 2do doblez.'
      ],
      en: [
        'Always mark on the same side of the tube to keep the offset in one plane.',
        'Verify the angle with a protractor — don\'t trust the bender alone.',
        'At 30° the math is easier (multiplier = 2), use it when you can.',
        'Add the shrink to the original measurement before making marks.',
        'If the tube ends up twisted, you probably rotated the bender between the two bends.'
      ]
    },
    saddle3: {
      es: [
        'El punto central se alinea con el notch de la dobladora (rim notch).',
        'La regla: ángulo central = 2× ángulo lateral. 22.5° laterales → 45° central.',
        'Dobla el central primero, después los laterales.',
        'Verifica que los tres dobleces queden en el mismo plano con una regla recta.',
        'Para obstáculos menores a 3", considera un offset simple en lugar de saddle.'
      ],
      en: [
        'The center point aligns with the bender rim notch.',
        'Rule: center angle = 2× side angle. 22.5° sides → 45° center.',
        'Bend the center first, then the sides.',
        'Check that all three bends are in the same plane with a straight edge.',
        'For obstacles under 3", consider a simple offset instead of a saddle.'
      ]
    },
    saddle4: {
      es: [
        'El saddle de 4 es básicamente dos offsets espejeados con el ancho del obstáculo entre ellos.',
        'Mide con cuidado el ancho del obstáculo — un error aquí se propaga a todas las marcas.',
        'Dobla primero los dos del centro, después los exteriores.',
        'Recuerda que el shrink se duplica porque tienes dos offsets.',
        'Para obstáculos muy anchos, un saddle de 4 es mejor que uno de 3 muy estirado.'
      ],
      en: [
        'A 4-point saddle is essentially two mirrored offsets with the obstacle width between.',
        'Measure the obstacle width carefully — errors here propagate to every mark.',
        'Bend the two center bends first, then the outer ones.',
        'Remember shrink is doubled because you have two offsets.',
        'For very wide obstacles, a 4-point is better than a stretched 3-point.'
      ]
    },
    parallel: {
      es: [
        'Los conduits paralelos necesitan offsets concéntricos — el exterior recorre un radio mayor.',
        'Mantén la separación constante con abrazaderas espaciadoras.',
        'Dobla el conduit interior (más corto) primero, luego úsalo como referencia.',
        'Marca ambos conduits al mismo tiempo antes de doblar para evitar errores.',
        'Separación 1¼" es estándar para EMT ½" lado a lado.'
      ],
      en: [
        'Parallel conduits need concentric offsets — the outer one travels a larger radius.',
        'Keep spacing constant with spacer clamps.',
        'Bend the inner (shorter) conduit first, use it as a reference.',
        'Mark both conduits simultaneously before bending to avoid errors.',
        '1¼" spacing is standard for ½" EMT side-by-side.'
      ]
    },
    segment: {
      es: [
        'Más dobleces = curva más suave, pero más trabajo.',
        'Para un arco de 90° con radio grande, 5-8 segmentos se ven casi continuos.',
        'Verifica el radio con una plantilla o compás antes de doblar.',
        'Se usa cuando necesitas un radio mayor al que tu dobladora puede hacer de una sola vez.',
        'Común en instalaciones industriales con tuberías paralelas de radio grande.'
      ],
      en: [
        'More bends = smoother curve, but more work.',
        'For a 90° arc with a large radius, 5-8 segments look nearly continuous.',
        'Verify the radius with a template or compass before bending.',
        'Used when you need a larger radius than your bender can make in one shot.',
        'Common in industrial installs with parallel large-radius runs.'
      ]
    },
    compound90: {
      es: [
        'Un compound 90° es un 90° con offset incorporado — útil cuando hay un obstáculo en el camino.',
        'Dobla el offset primero, luego el 90°.',
        'La rotación del tubo entre los dos dobleces es crítica — marca con referencia visual.',
        'Verifica que el 90° final queda en el plano correcto con un nivel.',
        'Si puedes evitarlo con otro ruteo, considéralo — este doblez es complejo.'
      ],
      en: [
        'A compound 90° is a 90° with a built-in offset — useful when there\'s an obstacle on the way.',
        'Bend the offset first, then the 90°.',
        'Rotation between the two bends is critical — mark a visual reference.',
        'Check the final 90° sits in the right plane with a level.',
        'If re-routing is an option, consider it — this bend is complex.'
      ]
    },
    gainTakeUp: {
      es: [
        'Take-up es cuánto "come" la dobladora al hacer un 90° — se resta de la medida total.',
        'Gain es la diferencia entre el desarrollo recto y el arco real — el arco es más corto.',
        'El take-up varía por marca/modelo — no asumas que es universal.',
        'Calibra tu dobladora midiendo un stub conocido si sospechas desviación.',
        'Gain es importante en tubos muy cortos o cálculos de desarrollo exacto.'
      ],
      en: [
        'Take-up is how much the bender "eats" making a 90° — subtracted from the total.',
        'Gain is the difference between straight layout and the actual arc — the arc is shorter.',
        'Take-up varies by make/model — never assume it\'s universal.',
        'Calibrate your bender by measuring a known stub if you suspect drift.',
        'Gain matters on very short tubes or exact-development calculations.'
      ]
    },
    kick: {
      es: [
        'El kick es simplemente un cambio de dirección menor a 90° — un solo doblez.',
        'Útil para alinear conduit con una caja que no está perfectamente alineada.',
        'Calcula igual que un offset pero con un solo doblez.',
        'Ángulos comunes: 15°, 22.5°, 30°, 45°.',
        'Verifica que el kick queda plomo después de doblar.'
      ],
      en: [
        'A kick is simply a direction change under 90° — one single bend.',
        'Useful to align conduit with a box that isn\'t perfectly aligned.',
        'Calculate like an offset but with one bend.',
        'Common angles: 15°, 22.5°, 30°, 45°.',
        'Verify the kick is plumb after bending.'
      ]
    },
    backToBack: {
      es: [
        'Back-to-back = dos 90° con distancia específica entre las espaldas (parte exterior).',
        'Marca la primera ubicación al take-up desde un extremo.',
        'La segunda marca va a la distancia deseada más el take-up.',
        'Común en cajas dobles o distribución simétrica.',
        'Dobla los dos 90° en la misma dirección para que queden paralelos.'
      ],
      en: [
        'Back-to-back = two 90°s with a specified distance between the backs (outer).',
        'Mark the first location at the take-up from one end.',
        'The second mark is at the desired distance plus take-up.',
        'Common in double boxes or symmetric distribution.',
        'Bend both 90°s in the same direction so they\'re parallel.'
      ]
    }
  };

  // ── Worked examples (bilingual HTML) ───────────────────────────
  var EXAMPLES = {
    stub90: {
      es: 'Stub de 12" con EMT ½" (dobladora Klein). Take-up = 5", marca = 12 − 5 = <strong>7"</strong> desde el extremo.',
      en: '12" stub with ½" EMT (Klein bender). Take-up = 5", mark = 12 − 5 = <strong>7"</strong> from the end.'
    },
    offset: {
      es: 'Rodear viga de 3" con EMT ½" a 30°. Multiplier = 2, distancia entre marcas = 3 × 2 = <strong>6"</strong>. Shrink = ¼" × 3 = <strong>¾"</strong>.',
      en: 'Go around a 3" beam with ½" EMT at 30°. Multiplier = 2, between marks = 3 × 2 = <strong>6"</strong>. Shrink = ¼" × 3 = <strong>¾"</strong>.'
    },
    saddle3: {
      es: 'Cruzar tubería de 2" con saddle 3 puntos a 22.5°/45°. Marcas laterales a 2 × 2.5 = <strong>5"</strong> de la central. Central 45°, laterales 22.5°.',
      en: 'Cross a 2" pipe with 3-point saddle at 22.5°/45°. Side marks at 2 × 2.5 = <strong>5"</strong> from center. Center 45°, sides 22.5°.'
    },
    saddle4: {
      es: 'Cruzar viga de 4" ancho × 2" alto a 22.5°. Multiplier = 2.6. Offset spacing = 2 × 2.6 = <strong>5.2"</strong>. Marcas: 0, 5.2", 9.2", 14.4".',
      en: '4"-wide × 2"-tall beam at 22.5°. Multiplier = 2.6. Offset spacing = 2 × 2.6 = <strong>5.2"</strong>. Marks: 0, 5.2", 9.2", 14.4".'
    },
    parallel: {
      es: '3 conduits EMT ½" paralelos con separación 1¼", offset 3" a 30°. Conduit 1: 6". Conduit 2: +2.17". Conduit 3: +4.33".',
      en: '3 ½" EMT parallel conduits, 1¼" spacing, 3" offset at 30°. Conduit 1: 6". Conduit 2: +2.17". Conduit 3: +4.33".'
    },
    segment: {
      es: 'Curva de 90° con radio 24", 6 segmentos. Ángulo/segmento = 15°. Distancia = 2 × 24 × sin(7.5°) ≈ <strong>6.27"</strong>.',
      en: '90° curve, 24" radius, 6 segments. Angle/segment = 15°. Distance = 2 × 24 × sin(7.5°) ≈ <strong>6.27"</strong>.'
    },
    compound90: {
      es: '90° a 36" con offset 2" a los 20" para esquivar tubo. Offset a 30° → 4" entre marcas. Rota 90°. Stub = 36 − 5 = <strong>31"</strong>.',
      en: '90° at 36" with 2" offset at 20" to clear a pipe. Offset at 30° → 4" between marks. Rotate 90°. Stub = 36 − 5 = <strong>31"</strong>.'
    },
    gainTakeUp: {
      es: 'EMT ½" (radio ≈ 4"), doblez 90°. Take-up ≈ 5". Gain ≈ 2.3" (el arco es 2.3" más corto que el desarrollo recto).',
      en: '½" EMT (radius ≈ 4"), 90° bend. Take-up ≈ 5". Gain ≈ 2.3" (arc is 2.3" shorter than straight layout).'
    },
    kick: {
      es: 'Kick de 2" a 30° para alinear con caja. Marca = 2 × 2 = <strong>4"</strong>. Shrink = ¼" × 2 = ½".',
      en: '2" kick at 30° to align with a box. Mark = 2 × 2 = <strong>4"</strong>. Shrink = ¼" × 2 = ½".'
    },
    backToBack: {
      es: '24" entre espaldas, EMT ½". Marca 1 = <strong>5"</strong> desde el extremo. Marca 2 = 24 + 5 = <strong>29"</strong>.',
      en: '24" back-to-back, ½" EMT. Mark 1 = <strong>5"</strong> from end. Mark 2 = 24 + 5 = <strong>29"</strong>.'
    }
  };

  // ── SVG Icons ──────────────────────────────────────────────────
  function icon(type, size) {
    size = size || 44;
    var s = 'stroke="#0A0A0A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
    var dots = 'fill="#1B2845"';
    var body;
    switch (type) {
      case 'stub90':
        body = '<path d="M10 60 L55 60 Q65 60 65 50 L65 15" '+s+'/>'; break;
      case 'offset':
        body = '<path d="M10 60 L30 60 L40 40 L60 40 L70 20" '+s+'/><circle cx="30" cy="60" r="3" '+dots+'/><circle cx="40" cy="40" r="3" '+dots+'/>'; break;
      case 'saddle3':
        body = '<path d="M10 60 L25 60 L35 35 L45 35 L55 60 L70 60" '+s+'/><rect x="32" y="38" width="16" height="22" fill="#E0E0E0" stroke="#1B2845" stroke-width="1"/>'; break;
      case 'saddle4':
        body = '<path d="M8 60 L20 60 L28 40 L52 40 L60 60 L72 60" '+s+'/><rect x="25" y="42" width="30" height="18" fill="#E0E0E0" stroke="#1B2845" stroke-width="1"/>'; break;
      case 'parallel':
        body = '<path d="M10 65 L25 65 L35 48 L55 48 L65 31" '+s.replace('3','2.5')+'/><path d="M10 58 L27 58 L37 43 L57 43 L67 28" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6"/><path d="M10 51 L29 51 L39 38 L59 38 L69 25" stroke="#C9A961" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6"/>'; break;
      case 'segment':
        body = '<path d="M10 60 L20 58 L30 52 L40 42 L50 30 L60 18" '+s+'/><circle cx="20" cy="58" r="2" fill="#C9A961"/><circle cx="30" cy="52" r="2" fill="#C9A961"/><circle cx="40" cy="42" r="2" fill="#C9A961"/><circle cx="50" cy="30" r="2" fill="#C9A961"/>'; break;
      case 'compound90':
        body = '<path d="M15 65 L40 65 Q50 65 50 55 L50 35 L60 25" '+s+'/>'; break;
      case 'gainTakeUp':
        body = '<path d="M15 65 L45 65 Q60 65 60 50 L60 20" '+s+'/><line x1="15" y1="72" x2="45" y2="72" stroke="#C9A961" stroke-width="1.5" stroke-dasharray="3,2"/>'; break;
      case 'kick':
        body = '<path d="M10 60 L40 60 L70 35" '+s+'/><circle cx="40" cy="60" r="3" '+dots+'/>'; break;
      case 'backToBack':
        body = '<path d="M10 60 Q18 60 18 52 L18 25" '+s+'/><path d="M62 25 L62 52 Q62 60 70 60" '+s+'/><line x1="18" y1="25" x2="62" y2="25" '+s+'/>'; break;
      default:
        body = '<rect x="10" y="10" width="60" height="60" fill="none" '+s+'/>';
    }
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 80 80">'+body+'</svg>';
  }

  // ── Calculator card metadata ───────────────────────────────────
  var CALC_META = [
    { id: 'stub90',     key: 'mb_stub90',   descEs: 'Doblez de 90° a una altura',         descEn: '90° bend to a height',            badge: 'basic' },
    { id: 'offset',     key: 'mb_offset',   descEs: 'Dos dobleces para rodear',           descEn: 'Two bends to go around',          badge: 'basic' },
    { id: 'saddle3',    key: 'mb_saddle3',  descEs: 'Cruzar obstáculo (silla)',           descEn: 'Cross an obstacle (saddle)',      badge: 'inter' },
    { id: 'saddle4',    key: 'mb_saddle4',  descEs: 'Silla para obstáculo ancho',         descEn: 'Saddle for wide obstacle',        badge: 'adv'   },
    { id: 'parallel',   key: 'mb_parallel', descEs: 'Offsets concéntricos',               descEn: 'Concentric offsets',              badge: 'adv'   },
    { id: 'segment',    key: 'mb_segment',  descEs: 'Curva con múltiples dobleces',       descEn: 'Curve with multiple bends',       badge: 'adv'   },
    { id: 'compound90', key: 'mb_compound', descEs: '90° con offset incorporado',         descEn: '90° with built-in offset',        badge: 'adv'   },
    { id: 'gainTakeUp', key: 'mb_gain',     descEs: 'Ganancia y deducción',               descEn: 'Gain and take-up',                badge: 'inter' },
    { id: 'kick',       key: 'mb_kick',     descEs: 'Cambio de dirección <90°',           descEn: 'Direction change <90°',           badge: 'basic' },
    { id: 'backToBack', key: 'mb_b2b',      descEs: 'Dos 90° con distancia fija',         descEn: 'Two 90°s with fixed distance',    badge: 'inter' }
  ];

  // ── CSS injection ──────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('mb-styles')) return;
    var css = [
      '#maestroBenderScreen{background:#FAFAF7 !important;color:#0F0F0F;padding:0 !important;}',
      '#mainAppFrame #maestroBenderScreen.active{background:#FAFAF7 !important;}',
      '.mb-root{display:flex;min-height:calc(100vh - env(safe-area-inset-top,0px) - 60px);max-width:100%;}',
      '.mb-layout{display:flex;width:100%;background:#FAFAF7;}',
      '.mb-sidebar{width:260px;background:#FFFFFF;border-right:1px solid #E7E5DE;overflow-y:auto;flex-shrink:0;padding-bottom:24px;}',
      '.mb-main{flex:1;min-width:0;overflow-y:auto;background:#FAFAF7;}',
      '.mb-top{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#FFFFFF;border-bottom:1px solid #E7E5DE;position:sticky;top:0;z-index:10;}',
      '.mb-top-btn{width:34px;height:34px;border-radius:10px;background:#F3F1EA;border:1px solid #E7E5DE;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;font-weight:700;color:#0F0F0F;box-shadow:0 1px 2px rgba(0,0,0,0.06);}',
      '.mb-top-btn:hover{background:#EAE8E1;}',
      '.mb-top-titlewrap{flex:1;min-width:0;line-height:1.15;}',
      '.mb-top-title{font-size:15px;font-weight:800;color:#0F0F0F;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.mb-top-sub{font-size:10px;font-weight:700;color:#C9A961;text-transform:uppercase;letter-spacing:0.08em;}',
      '.mb-top-help{width:32px;height:32px;border-radius:50%;background:#F3F1EA;border:1px solid #E7E5DE;cursor:pointer;font-weight:800;color:#6B6B66;}',
      '.mb-sb-head{padding:16px 14px;border-bottom:2px solid #C9A961;position:sticky;top:0;background:#FFFFFF;z-index:5;}',
      '.mb-sb-brand{font-size:14px;font-weight:800;letter-spacing:-0.01em;color:#0F0F0F;display:flex;align-items:center;gap:8px;}',
      '.mb-sb-dot{width:9px;height:9px;background:#C9A961;border-radius:50%;}',
      '.mb-sb-sub{font-size:9px;color:#6B6B66;margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;}',
      '.mb-sb-sec{padding:12px 0 4px;}',
      '.mb-sb-label{font-size:9px;font-weight:700;color:#6B6B66;padding:4px 14px;letter-spacing:0.1em;text-transform:uppercase;}',
      '.mb-sb-item{display:flex;align-items:center;gap:10px;padding:8px 14px;font-size:13px;font-weight:500;color:#0F0F0F;cursor:pointer;border-left:3px solid transparent;-webkit-tap-highlight-color:transparent;}',
      '.mb-sb-item:hover{background:#F3F1EA;}',
      '.mb-sb-item.active{background:#F3F1EA;border-left-color:#C9A961;font-weight:700;}',
      '.mb-sb-ico{width:18px;height:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;}',
      '.mb-body{padding:20px 18px calc(160px + env(safe-area-inset-bottom,0px));}',
      '.mb-hero{background:linear-gradient(135deg,#FFFFFF 0%,#F9F6EE 100%);border:1px solid #E7E5DE;border-radius:16px;padding:22px 22px;margin-bottom:18px;position:relative;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);}',
      '.mb-hero::before{content:"";position:absolute;top:-30px;right:-30px;width:140px;height:140px;background:#C9A961;opacity:0.08;border-radius:50%;}',
      '.mb-hero h1{font-size:24px;font-weight:800;letter-spacing:-0.02em;line-height:1.1;color:#0F0F0F;}',
      '.mb-hero h1 .accent{color:#C9A961;}',
      '.mb-hero-sub{font-size:13px;color:#6B6B66;margin-top:6px;font-weight:500;}',
      '.mb-hero-badge{display:inline-block;background:#0F0F0F;color:#FFFFFF;font-size:9px;font-weight:800;letter-spacing:0.1em;padding:5px 10px;border-radius:4px;margin-top:10px;}',
      '.mb-grid-label{font-size:10px;font-weight:700;color:#6B6B66;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;}',
      '.mb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px;margin-bottom:24px;}',
      '.mb-card{background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:14px 10px;cursor:pointer;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.04);transition:transform 0.15s,box-shadow 0.2s;-webkit-tap-highlight-color:transparent;}',
      '.mb-card:hover{box-shadow:0 6px 18px rgba(0,0,0,0.08);transform:translateY(-2px);border-color:#1B2845;}',
      '.mb-card-ico{width:56px;height:56px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;background:#F5F5F5;border-radius:10px;}',
      '.mb-card-title{font-size:13px;font-weight:800;color:#1B2845;margin-bottom:3px;}',
      '.mb-card-desc{font-size:10px;color:#6B6B66;line-height:1.35;min-height:28px;font-weight:500;}',
      '.mb-card-badge{display:inline-block;font-size:8px;font-weight:800;padding:2px 6px;border-radius:3px;margin-top:6px;letter-spacing:0.05em;}',
      '.mb-bb-basic{background:#DCFCE7;color:#166534;}',
      '.mb-bb-inter{background:#FEF3C7;color:#92400E;}',
      '.mb-bb-adv{background:#FEE2E2;color:#991B1B;}',
      '.mb-calc{background:#FFFFFF;border:1px solid #E7E5DE;border-radius:16px;overflow:hidden;margin-bottom:18px;box-shadow:0 1px 3px rgba(0,0,0,0.04);}',
      '.mb-calc-head{padding:16px 18px;background:#F9F6EE;border-bottom:1px solid #E7E5DE;display:flex;align-items:center;gap:12px;}',
      '.mb-calc-head-ico{width:44px;height:44px;background:#FFFFFF;border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid #E7E5DE;flex-shrink:0;}',
      '.mb-calc-title{font-size:16px;font-weight:800;color:#1B2845;}',
      '.mb-calc-sub{font-size:11px;color:#6B6B66;font-weight:500;margin-top:2px;}',
      '.mb-inputs{padding:18px;background:#F9F9F6;border-bottom:1px solid #E7E5DE;}',
      '.mb-input-row{margin-bottom:14px;}',
      '#maestroBenderScreen .mb-input-label{display:flex;justify-content:space-between;align-items:center;font-size:14px !important;font-weight:800 !important;color:#0a1628 !important;margin-bottom:8px;}',
      '#maestroBenderScreen .mb-input-label span{color:#0a1628 !important;}',
      '#maestroBenderScreen .mb-input-value{color:#0a1628 !important;font-weight:900 !important;font-size:17px !important;background:#FFFFFF;padding:2px 8px;border-radius:6px;border:2px solid #C9A961;}',
      '.mb-slider-row{display:grid;grid-template-columns:1fr 76px;gap:8px;align-items:center;}',
      '#maestroBenderScreen .mb-slider{-webkit-appearance:none;appearance:none;width:100%;height:8px;background:linear-gradient(90deg,#1B2845 0%,#1B2845 var(--fill,50%),#E0DED7 var(--fill,50%),#E0DED7 100%);border-radius:4px;outline:none;cursor:pointer;}',
      '#maestroBenderScreen .mb-slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;background:#C9A961;border:3px solid #1B2845;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);}',
      '#maestroBenderScreen .mb-slider::-moz-range-thumb{width:22px;height:22px;background:#C9A961;border:3px solid #1B2845;border-radius:50%;cursor:pointer;}',
      '.mb-pm{display:flex;gap:4px;}',
      '.mb-pm-btn{flex:1;height:30px;background:#FFFFFF;border:1px solid #E7E5DE;border-radius:6px;cursor:pointer;font-weight:800;color:#1B2845;font-size:14px;-webkit-tap-highlight-color:transparent;}',
      '.mb-pm-btn:active{background:#F3F1EA;}',
      '#maestroBenderScreen .mb-select,#maestroBenderScreen select.mb-select,#maestroBenderScreen input.mb-select{width:100%;padding:10px 12px;border:2px solid #C9A961 !important;border-radius:8px;background:#FFFFFF !important;font-size:17px !important;font-weight:900 !important;color:#0a1628 !important;-webkit-text-fill-color:#0a1628 !important;appearance:auto;-webkit-appearance:menulist;opacity:1 !important;}',
      '#maestroBenderScreen .mb-select option{color:#0a1628 !important;background:#FFFFFF !important;font-weight:700;}',
      '#maestroBenderScreen .mb-results{background:#1B2845 !important;color:#FFFFFF !important;padding:0;border-radius:12px;overflow:hidden;}',
      '#maestroBenderScreen .mb-res-title{padding:14px 18px !important;text-align:center;border-bottom:1px solid rgba(201,169,97,0.25);font-size:12px !important;font-weight:900 !important;letter-spacing:0.1em;text-transform:uppercase;color:#FFFFFF !important;background:rgba(0,0,0,0.15);}',
      '#maestroBenderScreen .mb-res-grp{padding:16px 18px !important;border-bottom:1px solid rgba(255,255,255,0.12);}',
      '#maestroBenderScreen .mb-res-grp:last-child{border-bottom:none;}',
      '#maestroBenderScreen .mb-res-grp-title{font-size:11px !important;color:#C9A961 !important;margin-bottom:8px;font-weight:800 !important;letter-spacing:0.06em;text-transform:uppercase;}',
      '#maestroBenderScreen .mb-res-grp-title strong{color:#FFFFFF !important;}',
      '#maestroBenderScreen .mb-res-item{display:flex;justify-content:space-between;align-items:center;padding:6px 0 !important;font-size:14px !important;color:#FFFFFF !important;font-weight:600;gap:12px;}',
      '#maestroBenderScreen .mb-res-item .dots{color:#FFFFFF !important;opacity:1 !important;font-weight:700;}',
      '#maestroBenderScreen .mb-res-value{font-weight:900 !important;color:#C9A961 !important;font-size:15px !important;white-space:nowrap;}',
      '.mb-res-invalid{padding:18px;color:#F59E0B;font-size:13px;text-align:center;font-weight:600;}',
      '.mb-tips-box{padding:18px;background:#FFFFFF;border-top:3px solid #C9A961;}',
      '.mb-tips-title{font-size:11px;font-weight:800;text-transform:uppercase;color:#1B2845;margin-bottom:10px;letter-spacing:0.1em;}',
      '.mb-tip{padding:8px 0;font-size:13px;color:#0F0F0F;display:flex;gap:10px;border-bottom:1px dashed #E7E5DE;font-weight:500;line-height:1.45;}',
      '.mb-tip:last-child{border-bottom:none;}',
      '.mb-tip-num{color:#C9A961;font-weight:800;flex-shrink:0;font-size:13px;}',
      '.mb-example{padding:14px 18px;background:#FFFBEB;border-left:4px solid #C9A961;font-size:13px;line-height:1.6;color:#0F0F0F;font-weight:500;}',
      '.mb-example strong{color:#0F0F0F;font-weight:800;}',
      '.mb-video{background:linear-gradient(135deg,#0A0A0A 0%,#1B2845 100%);padding:28px;text-align:center;color:#FFFFFF;}',
      '.mb-play{width:48px;height:48px;margin:0 auto 8px;border:2px solid #C9A961;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);}',
      '.mb-video-lbl{font-size:12px;font-weight:700;}',
      '.mb-video-hint{font-size:10px;color:#C9A961;margin-top:3px;}',
      '.mb-section{background:#FFFFFF;border:1px solid #E7E5DE;border-radius:14px;padding:18px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.03);}',
      '.mb-section h2{font-size:18px;font-weight:800;color:#1B2845;margin-bottom:10px;letter-spacing:-0.01em;}',
      '.mb-section h3{font-size:14px;font-weight:800;color:#1B2845;margin-top:12px;margin-bottom:6px;}',
      '.mb-section p,.mb-section li{font-size:13px;color:#0F0F0F;line-height:1.55;font-weight:500;}',
      '.mb-section ul{padding-left:20px;margin:6px 0;}',
      '.mb-section li{margin-bottom:4px;}',
      '.mb-table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}',
      '.mb-table th,.mb-table td{padding:7px 8px;text-align:left;border-bottom:1px solid #E7E5DE;color:#0F0F0F;}',
      '.mb-table th{background:#F9F6EE;font-weight:800;color:#1B2845;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;}',
      '.mb-table td{font-weight:500;}',
      '.mb-nec{border-left:4px solid #C9A961;background:#FFFBEB;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:8px;}',
      '.mb-nec-code{font-size:10px;font-weight:800;color:#92400E;letter-spacing:0.08em;text-transform:uppercase;}',
      '.mb-nec-ttl{font-size:14px;font-weight:800;color:#1B2845;margin:2px 0 4px;}',
      '.mb-nec-body{font-size:12px;color:#0F0F0F;line-height:1.5;font-weight:500;}',
      '.mb-warn{background:#FEE2E2;border-left:4px solid #DC2626;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:8px;color:#7F1D1D;font-size:13px;line-height:1.55;font-weight:500;}',
      '.mb-hambtn{display:none;}',
      '@media (max-width:760px){',
      '.mb-sidebar{position:fixed;top:0;bottom:0;left:-280px;width:280px;z-index:100;transition:left 0.2s;box-shadow:4px 0 16px rgba(0,0,0,0.15);}',
      '.mb-sidebar.open{left:0;}',
      '.mb-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99;}',
      '.mb-backdrop.open{display:block;}',
      '.mb-hambtn{display:flex;}',
      '.mb-body{padding:14px 12px calc(160px + env(safe-area-inset-bottom,0px));}',
      '.mb-grid{grid-template-columns:repeat(2,1fr);gap:8px;}',
      '.mb-card{padding:10px 8px;}',
      '.mb-card-ico{width:48px;height:48px;margin-bottom:6px;}',
      '.mb-card-title{font-size:13px;}',
      '.mb-card-desc{font-size:11px;min-height:28px;line-height:1.35;}',
      '.mb-hero{padding:18px;}',
      '.mb-hero h1{font-size:20px;}',
      '}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = 'mb-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ── Sidebar rendering ──────────────────────────────────────────
  function sidebarHTML() {
    var items = [
      { label: T('mb_sec_welcome','Bienvenida','Welcome'), group: [
        { id: 'about',  ico: 'ℹ️', lbl: T('mb_about','Acerca de','About') },
        { id: 'prefs',  ico: '⚙️', lbl: T('mb_prefs','Preferencias','Preferences') },
        { id: 'start',  ico: '📘', lbl: T('mb_start','Primeros Pasos','Getting Started') }
      ]},
      { label: T('mb_sec_calcs','Calculadoras','Calculators'), group: CALC_META.map(function(c) {
        return { id: 'calc:'+c.id, ico: '✎', lbl: T(c.key, c.descEs, c.descEn) };
      })},
      { label: T('mb_sec_refs','Referencias','References'), group: [
        { id: 'ref:sizes',  ico: '📏', lbl: T('mb_ref_sizes','Peso y Tamaños','Weight & Sizes') },
        { id: 'ref:radius', ico: '⊙',  lbl: T('mb_ref_radius','Radio y Gain','Radius & Gain') },
        { id: 'ref:frac',   ico: '¾',  lbl: T('mb_ref_frac','Fracciones','Fractions') },
        { id: 'ref:trig',   ico: '△',  lbl: T('mb_ref_trig','Trigonometría','Trigonometry') },
        { id: 'ref:layout', ico: '📐', lbl: T('mb_ref_layout','Layout de Conduit','Conduit Layout') }
      ]},
      { label: T('mb_sec_norm','Normativa','Code / NEC'), group: [
        { id: 'nec:req',     ico: '📘', lbl: T('mb_nec_req','Requisitos NEC','NEC Requirements') },
        { id: 'nec:terms',   ico: '📘', lbl: T('mb_nec_terms','Términos Importantes','Key Terms') },
        { id: 'nec:elec',    ico: '📘', lbl: T('mb_nec_elec','Términos Electricista','Electrician Terms') },
        { id: 'nec:methods', ico: '📘', lbl: T('mb_nec_methods','Métodos de Doblado','Bending Methods') },
        { id: 'nec:faq',     ico: '❓', lbl: T('mb_nec_faq','Preguntas Frecuentes','FAQ') },
        { id: 'nec:safety',  ico: '⚠️', lbl: T('mb_nec_safety','Manual de Seguridad','Safety Manual') }
      ]}
    ];
    var html = '<div class="mb-sb-head">';
    html += '<div class="mb-sb-brand"><span class="mb-sb-dot"></span>MAESTRO BENDER™</div>';
    html += '<div class="mb-sb-sub">Nivel 33 · ACVOLT</div>';
    html += '</div>';
    items.forEach(function(sec) {
      html += '<div class="mb-sb-sec"><div class="mb-sb-label">'+sec.label+'</div>';
      sec.group.forEach(function(it) {
        var active = (state.currentSection === it.id) ? ' active' : '';
        html += '<div class="mb-sb-item'+active+'" data-go="'+it.id+'"><span class="mb-sb-ico">'+it.ico+'</span><span>'+it.lbl+'</span></div>';
      });
      html += '</div>';
    });
    html += '<div class="mb-sb-sec"><div class="mb-sb-label">'+T('mb_sec_exit','Salida','Exit')+'</div>';
    var isHome = (!state.currentSection || state.currentSection === 'home');
    var exitLbl = isHome
      ? T('mb_exit_dashboard','Volver al Dashboard','Back to Dashboard')
      : T('mb_exit_home','Volver a Maestro Bender','Back to Maestro Bender');
    html += '<div class="mb-sb-item" data-go="exit"><span class="mb-sb-ico">↩</span><span>'+exitLbl+'</span></div>';
    html += '</div>';
    return html;
  }

  // ── Home page ──────────────────────────────────────────────────
  function renderHome() {
    var html = '<div class="mb-hero">';
    html += '<h1>MAESTRO <span class="accent">BENDER™</span></h1>';
    html += '<div class="mb-hero-sub">'+T('mb_subtitle')+' · '+T('mb_tagline')+'</div>';
    html += '<div class="mb-hero-badge">◆ '+T('mb_free_badge')+'</div>';
    html += '</div>';
    html += '<div class="mb-grid-label">◆ '+T('mb_sec_calcs')+'</div>';
    html += '<div class="mb-grid">';
    CALC_META.forEach(function(c) {
      var badgeCls = c.badge === 'basic' ? 'mb-bb-basic' : (c.badge === 'inter' ? 'mb-bb-inter' : 'mb-bb-adv');
      var badgeTxt = c.badge === 'basic' ? T('mb_badge_basic','BÁSICO','BASIC')
                  : c.badge === 'inter' ? T('mb_badge_inter','INTERMEDIO','INTERMEDIATE')
                  : T('mb_badge_adv','AVANZADO','ADVANCED');
      html += '<div class="mb-card" data-go="calc:'+c.id+'">';
      html += '<div class="mb-card-ico">'+icon(c.id, 42)+'</div>';
      html += '<div class="mb-card-title">'+T(c.key)+'</div>';
      html += '<div class="mb-card-desc">'+T('mb_desc_'+c.id, c.descEs, c.descEn)+'</div>';
      html += '<div class="mb-card-badge '+badgeCls+'">'+badgeTxt+'</div>';
      html += '</div>';
    });
    html += '</div>';
    // Quick ref cards
    html += '<div class="mb-grid-label">◆ '+T('mb_sec_refs')+' & '+T('mb_sec_norm')+'</div>';
    html += '<div class="mb-grid">';
    [
      { id: 'ref:sizes',   k: 'mb_ref_sizes'   },
      { id: 'ref:frac',    k: 'mb_ref_frac'    },
      { id: 'ref:trig',    k: 'mb_ref_trig'    },
      { id: 'ref:radius',  k: 'mb_ref_radius'  },
      { id: 'nec:req',     k: 'mb_nec_req'     },
      { id: 'nec:safety',  k: 'mb_nec_safety'  }
    ].forEach(function(r) {
      html += '<div class="mb-card" data-go="'+r.id+'">';
      html += '<div class="mb-card-ico" style="background:#F9F6EE;font-size:28px;">📘</div>';
      html += '<div class="mb-card-title">'+T(r.k)+'</div>';
      html += '<div class="mb-card-desc"></div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  // ── Calculator page ────────────────────────────────────────────
  function inputsUI(id) {
    var v = state.inputs[id] || Object.assign({}, DEFAULTS[id]);
    state.inputs[id] = v;
    function slider(field, label, min, max, step, unit) {
      unit = unit || '';
      var unitAttr = unit.replace(/"/g, '&quot;');
      var cur = v[field];
      var pct = max > min ? ((cur - min) / (max - min) * 100) : 0;
      return '<div class="mb-input-row">'
        + '<div class="mb-input-label"><span>'+label+'</span><span class="mb-input-value" data-f="'+field+'-val">'+cur+unit+'</span></div>'
        + '<div class="mb-slider-row">'
        + '<input type="range" class="mb-slider" min="'+min+'" max="'+max+'" step="'+step+'" value="'+cur+'" data-input="'+field+'" data-unit="'+unitAttr+'" style="--fill:'+pct+'%;">'
        + '<div class="mb-pm"><button class="mb-pm-btn" data-pm="-1" data-f="'+field+'">−</button><button class="mb-pm-btn" data-pm="1" data-f="'+field+'">+</button></div>'
        + '</div></div>';
    }
    function select(field, label, options) {
      var cur = v[field];
      var opts = options.map(function(o) {
        var sel = (o.value+'') === (cur+'') ? ' selected' : '';
        return '<option value="'+o.value+'"'+sel+'>'+o.label+'</option>';
      }).join('');
      return '<div class="mb-input-row">'
        + '<div class="mb-input-label"><span>'+label+'</span></div>'
        + '<select class="mb-select" data-input="'+field+'" data-select="1">'+opts+'</select>'
        + '</div>';
    }
    var emtOpts = Object.keys(TAKE_UP).map(function(s){ return { value: s, label: s + '"' }; });
    var angle5Opts = [10,22.5,30,45,60].map(function(a){ return { value: a, label: a+'°' }; });
    var angleFullOpts = [10,15,22.5,30,45,60,90,180,360].map(function(a){ return { value: a, label: a+'°' }; });
    switch (id) {
      case 'stub90':
        return slider('stubLength', T('mb_stub_len'), 1, 96, 1, '"')
             + select('emtSize', T('mb_emt_size'), emtOpts);
      case 'offset':
        return slider('height', T('mb_height'), 0.5, 36, 0.25, '"')
             + slider('depth', T('mb_depth'), 0, 36, 0.25, '"')
             + slider('distance', T('mb_distance'), 0, 96, 1, '"')
             + select('angle', T('mb_angle'), angle5Opts);
      case 'saddle3':
        return slider('height', T('mb_height'), 0.5, 12, 0.25, '"')
             + slider('distance', T('mb_distance'), 1, 96, 1, '"')
             + select('sideAngle', T('mb_side_angle'), [{value:22.5,label:'22.5°'},{value:30,label:'30°'}]);
      case 'saddle4':
        return slider('height', T('mb_height'), 0.5, 12, 0.25, '"')
             + slider('width', T('mb_width'), 1, 48, 0.5, '"')
             + slider('distance', T('mb_distance'), 1, 96, 1, '"')
             + select('angle', T('mb_angle'), angle5Opts);
      case 'parallel':
        return slider('baseHeight', T('mb_base_height'), 0.5, 24, 0.25, '"')
             + slider('spacing', T('mb_spacing'), 0.5, 6, 0.25, '"')
             + slider('count', T('mb_count'), 2, 8, 1, '')
             + select('angle', T('mb_angle'), angle5Opts);
      case 'segment':
        return slider('radius', T('mb_radius'), 4, 120, 1, '"')
             + slider('numberOfBends', T('mb_num_bends'), 2, 20, 1, '')
             + select('totalAngle', T('mb_total_angle'), angleFullOpts);
      case 'compound90':
        return slider('stubHeight', T('mb_stub_len'), 6, 96, 1, '"')
             + slider('offsetHeight', T('mb_height'), 0.5, 24, 0.25, '"')
             + slider('offsetDistance', T('mb_distance'), 0, 72, 1, '"')
             + select('offsetAngle', T('mb_angle'), angle5Opts)
             + select('emtSize', T('mb_emt_size'), emtOpts);
      case 'gainTakeUp':
        return slider('radius', T('mb_radius'), 1, 48, 0.5, '"')
             + select('angle', T('mb_angle'), angleFullOpts);
      case 'kick':
        return slider('height', T('mb_height'), 0.5, 24, 0.25, '"')
             + select('angle', T('mb_angle'), angle5Opts);
      case 'backToBack':
        return slider('backToBackDistance', T('mb_b2b_dist'), 3, 96, 1, '"')
             + select('emtSize', T('mb_emt_size'), emtOpts);
    }
    return '';
  }

  function resultsUI(id) {
    var v = state.inputs[id];
    var r;
    if (id === 'gainTakeUp') {
      r = calc.gainTakeUp(+v.radius, +v.angle);
    } else {
      r = calc[id](v);
    }
    if (!r) return '<div class="mb-res-invalid">⚠ '+T('mb_invalid')+'</div>';
    function row(lbl, val) {
      return '<div class="mb-res-item"><span class="dots">'+lbl+'</span><span class="mb-res-value">'+val+'</span></div>';
    }
    var html = '';
    switch (id) {
      case 'stub90':
        html += row(T('mb_mark_from_end'), fmt(r.markFromEnd));
        html += row(T('mb_take_up'), fmt(r.takeUp));
        break;
      case 'offset':
        html += '<div class="mb-res-grp-title">'+T('mb_multiplier')+': <strong>'+r.multiplier+'</strong></div>';
        html += row(T('mb_between_marks'), fmt(r.distanceBetweenMarks));
        html += row(T('mb_shrink'), fmt(r.shrinkTotal));
        html += row(T('mb_mark1'), fmt(r.mark1FromCoupling));
        html += row(T('mb_mark2'), fmt(r.mark2FromCoupling));
        if (r.rotationAngle > 0) html += row(T('mb_rotation'), round2(r.rotationAngle)+'°');
        break;
      case 'saddle3':
        html += row(T('mb_center_mark'), fmt(r.centerMark));
        html += row(T('mb_left_mark'), fmt(r.leftMark));
        html += row(T('mb_right_mark'), fmt(r.rightMark));
        html += row(T('mb_shrink'), fmt(r.shrinkTotal));
        html += row(T('mb_center_angle'), r.centerAngle+'°');
        html += row(T('mb_side_angle'), r.sideAngle+'°');
        break;
      case 'saddle4':
        html += row(T('mb_mark1'), fmt(r.mark1));
        html += row(T('mb_mark2'), fmt(r.mark2));
        html += row(T('mb_mark3'), fmt(r.mark3));
        html += row(T('mb_mark4'), fmt(r.mark4));
        html += row(T('mb_shrink'), fmt(r.shrinkTotal));
        html += row(T('mb_center_obst'), fmt(r.centerOfObstacle));
        break;
      case 'parallel':
        html += row(T('mb_base_distance'), fmt(r.baseDistance));
        r.conduits.forEach(function(c) {
          html += row(T('mb_conduit_n','Conduit','Conduit')+' '+c.conduitNumber+' (+)', fmt(c.additionalOffset));
        });
        break;
      case 'segment':
        html += row(T('mb_angle_per'), round2(r.anglePerSegment)+'°');
        html += row(T('mb_dist_between_bends'), fmt(r.distanceBetweenBends));
        html += row(T('mb_total_length'), fmt(r.totalLength));
        html += row(T('mb_first_mark'), fmt(r.firstMarkFromCoupling));
        break;
      case 'compound90':
        html += row(T('mb_mark1')+' (offset)', fmt(r.offsetMark1));
        html += row(T('mb_mark2')+' (offset)', fmt(r.offsetMark2));
        html += row(T('mb_between_marks')+' (offset)', fmt(r.offsetBetween));
        html += row(T('mb_shrink')+' (offset)', fmt(r.offsetShrink));
        html += row(T('mb_mark_from_end')+' (90°)', fmt(r.stubMarkFromEnd));
        html += row(T('mb_rotation'), r.rotationBetween+'°');
        html += row(T('mb_take_up'), fmt(r.takeUp));
        break;
      case 'gainTakeUp':
        html += row(T('mb_gain_label'), fmt(r.gain));
        html += row(T('mb_take_up'), fmt(r.takeUp));
        html += row(T('mb_arc_length','Longitud de arco','Arc length'), fmt(r.arcLength));
        html += row(T('mb_straight_equiv','Equivalente recto','Straight equivalent'), fmt(r.straightEquivalent));
        break;
      case 'kick':
        html += row(T('mb_mark_from_end'), fmt(r.markFromEnd));
        html += row(T('mb_shrink'), fmt(r.shrink));
        break;
      case 'backToBack':
        html += row(T('mb_mark1'), fmt(r.mark1FromEnd));
        html += row(T('mb_mark2'), fmt(r.mark2FromEnd));
        html += row(T('mb_between_marks'), fmt(r.distanceBetweenMarks));
        break;
    }
    return '<div class="mb-res-grp">'+html+'</div>';
  }

  function renderCalc(id) {
    var meta = CALC_META.filter(function(c){ return c.id === id; })[0];
    if (!meta) return renderHome();
    var tips = (TIPS[id] || { es: [], en: [] });
    var ex = EXAMPLES[id] || { es: '', en: '' };
    var lang = (window._lang || 'es');
    var tipList = tips[lang] || tips.es;
    var exText = ex[lang] || ex.es;
    var html = '<div class="mb-calc">';
    html += '<div class="mb-calc-head"><div class="mb-calc-head-ico">'+icon(id, 32)+'</div>';
    html += '<div><div class="mb-calc-title">'+T(meta.key)+'</div><div class="mb-calc-sub">'+T('mb_desc_'+id, meta.descEs, meta.descEn)+'</div></div></div>';
    html += '<div class="mb-video"><div class="mb-play"><svg width="18" height="18" viewBox="0 0 20 20"><polygon points="6,4 6,16 16,10" fill="#FFFFFF"/></svg></div>';
    html += '<div class="mb-video-lbl">'+T('mb_video_soon')+'</div>';
    html += '<div class="mb-video-hint">◆ Maestro HVACR · Nivel 33</div></div>';
    html += '<div class="mb-inputs" data-calc="'+id+'">'+inputsUI(id)+'</div>';
    html += '<div class="mb-results"><div class="mb-res-title">◆ '+T('mb_results')+'</div>';
    html += '<div class="mb-res-body">'+resultsUI(id)+'</div></div>';
    if (exText) html += '<div class="mb-example"><strong>'+T('mb_example')+':</strong> '+exText+'</div>';
    html += '<div class="mb-tips-box"><div class="mb-tips-title">◆ '+T('mb_tips')+' · Nivel 33</div>';
    tipList.forEach(function(t, idx) {
      var num = (idx + 1) < 10 ? '0' + (idx + 1) : '' + (idx + 1);
      html += '<div class="mb-tip"><span class="mb-tip-num">'+num+'</span><span>'+t+'</span></div>';
    });
    html += '</div>';
    html += '</div>';
    return html;
  }

  // ── Reference sections ─────────────────────────────────────────
  function renderRef(id) {
    if (id === 'sizes') {
      var rows = CONDUIT_SIZES.map(function(c) {
        return '<tr><td><strong>'+c.nominal+'"</strong></td><td>'+c.odIn+'"</td><td>'+c.idIn+'"</td><td>'+c.wtPerFt+' lb/ft</td><td>'+c.minRadius+'"</td></tr>';
      }).join('');
      return '<div class="mb-section"><h2>📏 '+T('mb_ref_sizes')+'</h2>'
        + '<p>'+T('mb_sizes_intro','Dimensiones estándar EMT con radios mínimos de doblez según NEC Chapter 9, Table 2.','Standard EMT dimensions with minimum bending radii per NEC Chapter 9, Table 2.')+'</p>'
        + '<table class="mb-table"><thead><tr><th>'+T('mb_tbl_nominal','Nominal','Nominal')+'</th><th>'+T('mb_tbl_od','OD','OD')+'</th><th>'+T('mb_tbl_id','ID','ID')+'</th><th>'+T('mb_tbl_weight','Peso','Weight')+'</th><th>'+T('mb_tbl_min_r','Radio Mín.','Min R')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
    }
    if (id === 'frac') {
      return '<div class="mb-section"><h2>¾ '+T('mb_frac_title')+'</h2>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;">'
        + '<div><label style="font-size:12px;font-weight:700;color:#1B2845;">'+T('mb_frac_dec')+'</label>'
        + '<input id="mb-frac-dec" type="text" class="mb-select" placeholder="6.75" style="margin-top:5px;"></div>'
        + '<div><label style="font-size:12px;font-weight:700;color:#1B2845;">'+T('mb_frac_frac')+'</label>'
        + '<input id="mb-frac-frac" type="text" class="mb-select" placeholder="6 3/4" style="margin-top:5px;"></div>'
        + '</div><div id="mb-frac-out" style="margin-top:14px;padding:12px;background:#FFFBEB;border-left:4px solid #C9A961;border-radius:0 8px 8px 0;font-size:14px;color:#0F0F0F;">→ —</div>'
        + '</div>';
    }
    if (id === 'trig') {
      var angles = [10, 22.5, 30, 45, 60, 90];
      var r = angles.map(function(a) {
        var rad = a * Math.PI/180;
        var sn = Math.sin(rad), cs = Math.cos(rad), tn = Math.tan(rad);
        return '<tr><td><strong>'+a+'°</strong></td><td>'+sn.toFixed(4)+'</td><td>'+cs.toFixed(4)+'</td><td>'+(a===90?'∞':tn.toFixed(4))+'</td><td>'+(sn?(1/sn).toFixed(4):'∞')+'</td><td>'+(cs?(1/cs).toFixed(4):'∞')+'</td></tr>';
      }).join('');
      return '<div class="mb-section"><h2>△ '+T('mb_ref_trig')+'</h2>'
        + '<p>'+T('mb_trig_intro','El multiplier usado en offsets es precisamente el cosecante del ángulo. csc(30°) = 1/sin(30°) = 1/0.5 = 2. Por eso multiplicamos la altura del offset por 2 cuando doblamos a 30°.','The offset multiplier is exactly the cosecant of the angle. csc(30°) = 1/sin(30°) = 1/0.5 = 2. That is why we multiply offset height by 2 when bending at 30°.')+'</p>'
        + '<table class="mb-table"><thead><tr><th>°</th><th>sin</th><th>cos</th><th>tan</th><th>csc</th><th>sec</th></tr></thead><tbody>'+r+'</tbody></table></div>';
    }
    if (id === 'radius') {
      var rows = CONDUIT_SIZES.map(function(c) {
        return '<tr><td><strong>'+c.nominal+'"</strong></td><td>'+c.minRadius+'"</td><td>'+(c.minRadius*2).toFixed(1)+'"</td></tr>';
      }).join('');
      return '<div class="mb-section"><h2>⊙ '+T('mb_ref_radius')+'</h2>'
        + '<p>'+T('mb_radius_intro','Radios mínimos de doblez según tamaño de conduit. Por debajo de estos radios, el conductor puede sufrir daño o el conduit aplastarse.','Minimum bending radii per conduit size. Below these radii, the conductor can be damaged or the conduit crushed.')+'</p>'
        + '<table class="mb-table"><thead><tr><th>'+T('mb_tbl_nominal','Nominal','Nominal')+'</th><th>'+T('mb_tbl_min_r','Radio Mín.','Min R')+'</th><th>'+T('mb_tbl_min_dia','Diámetro Mín.','Min Diameter')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
    }
    if (id === 'layout') {
      return '<div class="mb-section"><h2>📐 '+T('mb_ref_layout')+'</h2>'
        + '<h3>'+T('mb_layout_planning','Planeación del recorrido','Route planning')+'</h3>'
        + '<ul><li>'+T('mb_layout_1','Mapea primero con tiza o cinta antes de cortar tubo.','Map the route with chalk or tape before cutting tube.')+'</li>'
        + '<li>'+T('mb_layout_2','Marca ubicaciones de cajas, pulls y cambios de dirección.','Mark box, pull and direction-change locations.')+'</li>'
        + '<li>'+T('mb_layout_3','Respeta la regla NEC 358.26: máximo 360° de dobleces entre pulls.','Respect NEC 358.26: maximum 360° of bends between pulls.')+'</li>'
        + '<li>'+T('mb_layout_4','Soportes cada 10 pies máximo (NEC 300.11) y dentro de 3 pies de cada caja.','Supports every 10 feet max (NEC 300.11) and within 3 feet of each box.')+'</li></ul></div>';
    }
    return renderHome();
  }

  // ── Normative / NEC ────────────────────────────────────────────
  var NEC_ARTICLES_ES = [
    { code: 'NEC 358', ttl: 'EMT (Electrical Metallic Tubing)', body: 'Requisitos para EMT: usos permitidos, soportes cada 10 pies máximo, conexiones a cajas. No permitido en lugares con daño físico severo salvo protección.' },
    { code: 'NEC 342', ttl: 'IMC (Intermediate Metal Conduit)', body: 'IMC es más grueso que EMT, permitido en exteriores y ubicaciones corrosivas con protección adecuada.' },
    { code: 'NEC 344', ttl: 'RMC (Rigid Metal Conduit)', body: 'El más grueso y resistente. Permitido en todas las ubicaciones. Requiere reamar después de cortar.' },
    { code: 'NEC 352', ttl: 'PVC Rígido', body: 'Conduit plástico. Requiere conductor de tierra separado. Considera expansión térmica.' },
    { code: 'NEC Ch.9 T.2', ttl: 'Radio Mínimo de Doblez', body: 'Radios mínimos según tamaño de conduit para evitar aplastamiento o daño al conductor.' },
    { code: 'NEC 300.11', ttl: 'Soportes de Conduit', body: 'El conduit debe estar soportado independientemente — no puede colgar de cajas o dispositivos.' },
    { code: 'NEC 314.28', ttl: 'Pull Boxes', body: 'Requerido para conduits 4" o mayores, o cuando excedes 360° de bends entre pulls.' },
    { code: 'NEC 358.26', ttl: 'Máximo 360° entre pulls', body: 'No puedes tener más de 360° total de dobleces entre dos puntos de acceso (boxes, pulls). Esto previene daño al conductor al jalarlo.' }
  ];
  var NEC_ARTICLES_EN = [
    { code: 'NEC 358', ttl: 'EMT (Electrical Metallic Tubing)', body: 'EMT requirements: permitted uses, supports every 10 feet max, box connections. Not allowed in severe physical-damage areas without protection.' },
    { code: 'NEC 342', ttl: 'IMC (Intermediate Metal Conduit)', body: 'IMC is thicker than EMT, allowed outdoors and in corrosive locations with adequate protection.' },
    { code: 'NEC 344', ttl: 'RMC (Rigid Metal Conduit)', body: 'The thickest and toughest. Allowed in all locations. Must be reamed after cutting.' },
    { code: 'NEC 352', ttl: 'PVC Conduit', body: 'Plastic conduit. Requires a separate equipment ground. Account for thermal expansion.' },
    { code: 'NEC Ch.9 T.2', ttl: 'Minimum Bending Radius', body: 'Minimum radii by conduit size to avoid conductor damage or tube crush.' },
    { code: 'NEC 300.11', ttl: 'Conduit Support', body: 'Conduit must be independently supported — it cannot hang off boxes or devices.' },
    { code: 'NEC 314.28', ttl: 'Pull Boxes', body: 'Required for conduits 4" or larger, or when you exceed 360° of bends between pulls.' },
    { code: 'NEC 358.26', ttl: 'Max 360° between pulls', body: 'You cannot have more than 360° total of bends between two access points. Prevents conductor damage when pulling.' }
  ];

  var TERMS_ES = [
    ['Stub', 'El tramo doblado de 90° que queda perpendicular al tubo principal.'],
    ['Take-up', 'Cantidad que la dobladora "consume" al hacer un doblez — se resta de la medida total.'],
    ['Gain', 'Diferencia entre el largo recto y el arco real — el arco es más corto.'],
    ['Shrink', 'Acortamiento del tubo al hacer un offset. Varía con el ángulo.'],
    ['Saddle', '"Silla" — tres o cuatro dobleces para cruzar un obstáculo sin desviarse del recorrido.'],
    ['Offset', 'Dos dobleces iguales para rodear un obstáculo y volver al mismo plano.'],
    ['Kick', 'Cambio de dirección menor a 90° con un solo doblez.'],
    ['Rim notch', 'Marca en la dobladora que indica el centro del doblez — útil para saddles.'],
    ['Coupling', 'Acople entre dos tramos de conduit.'],
    ['Reaming', 'Quitar las rebabas del interior de un corte para no dañar conductores.']
  ];
  var TERMS_EN = [
    ['Stub', 'The 90° bent leg left perpendicular to the main run.'],
    ['Take-up', 'Amount the bender "eats" in a bend — subtracted from the total measurement.'],
    ['Gain', 'Difference between straight layout and the actual arc — arc is shorter.'],
    ['Shrink', 'Tube shortening when making an offset. Varies with angle.'],
    ['Saddle', 'Three or four bends to cross an obstacle without deviating from the route.'],
    ['Offset', 'Two equal bends to go around an obstacle and return to the same plane.'],
    ['Kick', 'Direction change under 90° with a single bend.'],
    ['Rim notch', 'Mark on the bender indicating the center of the bend — useful for saddles.'],
    ['Coupling', 'Joint between two conduit sections.'],
    ['Reaming', 'Removing burrs from inside a cut so conductors are not damaged.']
  ];

  var ELEC_TERMS_ES = [
    ['AHJ', 'Authority Having Jurisdiction — inspector local que aplica el código.'],
    ['Conductor', 'Cable eléctrico que transporta corriente.'],
    ['Ground', 'Tierra — camino de baja impedancia de regreso a la fuente.'],
    ['Box fill', 'Cálculo del volumen ocupado en una caja (NEC 314.16).'],
    ['Pull string', 'Cuerda jalable dejada dentro del conduit para jalar cables después.'],
    ['Derating', 'Reducción de la capacidad de corriente cuando hay múltiples conductores o alta temperatura.']
  ];
  var ELEC_TERMS_EN = [
    ['AHJ', 'Authority Having Jurisdiction — the local inspector enforcing the code.'],
    ['Conductor', 'Current-carrying wire.'],
    ['Ground', 'Low-impedance return path to source.'],
    ['Box fill', 'Calculation of box volume usage (NEC 314.16).'],
    ['Pull string', 'Pulling rope left inside conduit to pull cables later.'],
    ['Derating', 'Ampacity reduction with multiple conductors or high temperature.']
  ];

  function renderNec(id) {
    var lang = (window._lang || 'es');
    if (id === 'req') {
      var list = lang === 'en' ? NEC_ARTICLES_EN : NEC_ARTICLES_ES;
      var html = '<div class="mb-section"><h2>📘 '+T('mb_nec_req')+'</h2>';
      list.forEach(function(a) {
        html += '<div class="mb-nec"><div class="mb-nec-code">'+a.code+'</div><div class="mb-nec-ttl">'+a.ttl+'</div><div class="mb-nec-body">'+a.body+'</div></div>';
      });
      html += '</div>';
      return html;
    }
    if (id === 'terms') {
      var list = lang === 'en' ? TERMS_EN : TERMS_ES;
      var rows = list.map(function(t){ return '<tr><td><strong>'+t[0]+'</strong></td><td>'+t[1]+'</td></tr>'; }).join('');
      return '<div class="mb-section"><h2>📘 '+T('mb_nec_terms')+'</h2><table class="mb-table"><tbody>'+rows+'</tbody></table></div>';
    }
    if (id === 'elec') {
      var list = lang === 'en' ? ELEC_TERMS_EN : ELEC_TERMS_ES;
      var rows = list.map(function(t){ return '<tr><td><strong>'+t[0]+'</strong></td><td>'+t[1]+'</td></tr>'; }).join('');
      return '<div class="mb-section"><h2>📘 '+T('mb_nec_elec')+'</h2><table class="mb-table"><tbody>'+rows+'</tbody></table></div>';
    }
    if (id === 'methods') {
      return '<div class="mb-section"><h2>📘 '+T('mb_nec_methods')+'</h2>'
        + '<h3>'+T('mb_mt_hand_h','Dobladora manual','Hand bender')+'</h3><p>'+T('mb_mt_hand','Dobladora manual — la más común para EMT ½" y ¾". Pedal contra el piso, palanca hacia arriba.','Manual bender — most common for ½" and ¾" EMT. Foot on the shoe, lever pulled up.')+'</p>'
        + '<h3>'+T('mb_mt_mech_h','Mecánica / Chicago','Mechanical / Chicago')+'</h3><p>'+T('mb_mt_mech','Dobladora mecánica de cremallera — para ¾" a 1¼". Ventaja mecánica mayor.','Mechanical ratchet bender — for ¾" to 1¼". Higher mechanical advantage.')+'</p>'
        + '<h3>'+T('mb_mt_hyd_h','Hidráulica / Eléctrica','Hydraulic / Electric')+'</h3><p>'+T('mb_mt_hyd','Hidráulica o eléctrica — para 1¼" y mayores. Más preciso, elimina fatiga.','Hydraulic or electric — for 1¼" and larger. More accurate, eliminates fatigue.')+'</p>'
        + '<h3>'+T('mb_mt_seg_h','Doblado por segmentos','Segment bending')+'</h3><p>'+T('mb_mt_seg','Para radios mayores al que la dobladora puede hacer de una vez — múltiples dobleces pequeños.','For radii larger than the bender can make in one shot — multiple small bends.')+'</p></div>';
    }
    if (id === 'faq') {
      var faqs = lang === 'en' ? [
        ['Why is my stub short?', 'Most likely you over-estimated take-up, or the bender has drift. Measure a known 12" stub to calibrate.'],
        ['What angle is easiest for offsets?', '30° — multiplier is exactly 2, shrink is ¼" per inch. Easy mental math on the job.'],
        ['Can I re-bend a kinked tube?', 'No. Kinked EMT fails NEC — replace it. A conductor pulled through kinked conduit can be damaged.'],
        ['How do I prevent dog-legs?', 'Mark both sides of the bend point. Keep the bender on the ground, push the handle straight up — no sideways pressure.']
      ] : [
        ['¿Por qué mi stub sale corto?', 'Probablemente sobreestimaste el take-up, o la dobladora tiene drift. Mide un stub conocido de 12" para calibrar.'],
        ['¿Qué ángulo es más fácil para offsets?', '30° — multiplier es exactamente 2, shrink es ¼" por pulgada. Matemática mental fácil en el campo.'],
        ['¿Puedo volver a doblar un tubo con kink?', 'No. El EMT aplastado no cumple NEC — reemplázalo. Un conductor jalado por conduit aplastado se daña.'],
        ['¿Cómo evito dog-legs (dobleces torcidos)?', 'Marca ambos lados del punto de doblez. Mantén la dobladora en el piso y empuja la palanca recto hacia arriba — sin presión lateral.']
      ];
      var html = '<div class="mb-section"><h2>❓ '+T('mb_nec_faq')+'</h2>';
      faqs.forEach(function(q){
        html += '<h3>'+q[0]+'</h3><p>'+q[1]+'</p>';
      });
      html += '</div>';
      return html;
    }
    if (id === 'safety') {
      var rules = lang === 'en' ? [
        'Always de-energize circuits before working — lockout/tagout per OSHA 1910.147.',
        'Wear safety glasses — burrs fly when cutting EMT.',
        'Use leather gloves when handling freshly cut conduit.',
        'Never stand on the bender — foot on the shoe only, weight on your other foot.',
        'Ream the inside of every cut before pulling wire — sharp edges cut insulation.',
        'Never pull conduit by the conductor — use a fish tape or pull rope.',
        'Keep the work area clean — conduit offcuts roll and cause slips.',
        'Inspect your bender before each use — cracked shoe = broken wrist.',
        'When in doubt about a bend exceeding 360°, add a pull box — NEC 358.26.',
        'Respect the minimum bending radius — a kinked tube is a failed inspection.'
      ] : [
        'Siempre corta la energía antes de trabajar — lockout/tagout según OSHA 1910.147.',
        'Usa lentes de seguridad — las rebabas vuelan al cortar EMT.',
        'Usa guantes de cuero al manejar conduit recién cortado.',
        'Nunca te pares en la dobladora — solo el pie en el shoe, el peso en el otro pie.',
        'Rima el interior de cada corte antes de jalar cable — los filos cortan el aislante.',
        'Nunca jales conduit por el conductor — usa fish tape o cuerda de tiro.',
        'Mantén el área de trabajo limpia — los pedazos de conduit ruedan y causan caídas.',
        'Inspecciona tu dobladora antes de cada uso — shoe rajado = muñeca rota.',
        'Si hay duda sobre exceder 360° de dobleces, agrega un pull box — NEC 358.26.',
        'Respeta el radio mínimo de doblez — un tubo con kink es inspección reprobada.'
      ];
      var html = '<div class="mb-section"><h2>⚠️ '+T('mb_nec_safety')+'</h2>';
      rules.forEach(function(r){ html += '<div class="mb-warn">◆ '+r+'</div>'; });
      html += '</div>';
      return html;
    }
    return renderHome();
  }

  // ── Welcome pages ──────────────────────────────────────────────
  function renderAbout() {
    return '<div class="mb-section"><h2>ℹ️ '+T('mb_about')+'</h2>'
      + '<p>'+T('mb_about_body')+'</p>'
      + '<h3>Nivel 33 · ACVOLT Tech School</h3>'
      + '<p>'+T('mb_about_level','Maestro Bender™ es parte del ecosistema Maestro HVACR. Sin publicidad, sin suscripción. Funciona offline.','Maestro Bender™ is part of the Maestro HVACR ecosystem. No ads, no subscription. Works offline.')+'</p>'
      + '</div>';
  }

  function renderPrefs() {
    var emtOpts = Object.keys(TAKE_UP).map(function(s){
      var sel = (s === state.preferences.defaultEmtSize) ? ' selected' : '';
      return '<option value="'+s+'"'+sel+'>'+s+'"</option>';
    }).join('');
    return '<div class="mb-section"><h2>⚙️ '+T('mb_prefs')+'</h2>'
      + '<div class="mb-input-row"><div class="mb-input-label"><span>'+T('mb_prefs_emt')+'</span></div>'
      + '<select class="mb-select" id="mb-pref-emt">'+emtOpts+'</select></div>'
      + '<div class="mb-input-row"><div class="mb-input-label"><span>'+T('mb_prefs_units')+'</span></div>'
      + '<select class="mb-select" id="mb-pref-units">'
      + '<option value="imperial"'+(state.preferences.units==='imperial'?' selected':'')+'>'+T('mb_prefs_imperial')+'</option>'
      + '<option value="metric"'+(state.preferences.units==='metric'?' selected':'')+'>'+T('mb_prefs_metric')+'</option>'
      + '</select></div>'
      + '<button class="mb-pm-btn" id="mb-save-prefs" style="flex:none;width:100%;height:38px;background:#1B2845;color:#FFFFFF;font-size:13px;margin-top:8px;">💾 '+T('mb_prefs_save','Guardar preferencias','Save preferences')+'</button>'
      + '<div id="mb-prefs-msg" style="margin-top:8px;font-size:12px;color:#16A34A;font-weight:700;display:none;">✓ '+T('mb_prefs_saved')+'</div>'
      + '</div>';
  }

  function renderStart() {
    return '<div class="mb-section"><h2>📘 '+T('mb_start')+'</h2>'
      + '<ol style="padding-left:20px;">'
      + '<li style="margin-bottom:8px;"><strong>'+T('mb_s1_ttl','Elige la calculadora','Pick the calculator')+':</strong> '+T('mb_s1_body','desde el sidebar o desde las tarjetas del inicio.','from the sidebar or the home cards.')+'</li>'
      + '<li style="margin-bottom:8px;"><strong>'+T('mb_s2_ttl','Ajusta los inputs','Adjust the inputs')+':</strong> '+T('mb_s2_body','usa los sliders o los botones +/−. Los resultados se actualizan en tiempo real.','use sliders or +/− buttons. Results update in real time.')+'</li>'
      + '<li style="margin-bottom:8px;"><strong>'+T('mb_s3_ttl','Lee los tips del maestro','Read the maestro tips')+':</strong> '+T('mb_s3_body','5 tips específicos por calculadora. Están al final de cada pantalla.','5 specific tips per calculator at the bottom of each screen.')+'</li>'
      + '<li style="margin-bottom:8px;"><strong>'+T('mb_s4_ttl','Marca y dobla','Mark and bend')+':</strong> '+T('mb_s4_body','usa un Sharpie permanente. Marca ambos lados del punto de doblez.','use a permanent Sharpie. Mark both sides of the bend point.')+'</li>'
      + '</ol></div>';
  }

  // ── Main render dispatch ───────────────────────────────────────
  function renderMain() {
    var id = state.currentSection;
    if (id === 'home' || !id) return renderHome();
    if (id === 'about') return renderAbout();
    if (id === 'prefs') return renderPrefs();
    if (id === 'start') return renderStart();
    if (id.indexOf('calc:') === 0) return renderCalc(id.slice(5));
    if (id.indexOf('ref:') === 0) return renderRef(id.slice(4));
    if (id.indexOf('nec:') === 0) return renderNec(id.slice(4));
    return renderHome();
  }

  function sectionTitle() {
    var id = state.currentSection;
    if (id === 'home' || !id) return 'MAESTRO BENDER™';
    if (id === 'about') return T('mb_about');
    if (id === 'prefs') return T('mb_prefs');
    if (id === 'start') return T('mb_start');
    if (id.indexOf('calc:') === 0) {
      var m = CALC_META.filter(function(c){ return c.id === id.slice(5); })[0];
      return m ? T(m.key) : 'MAESTRO BENDER™';
    }
    if (id.indexOf('ref:') === 0) {
      var map = { sizes: 'mb_ref_sizes', radius: 'mb_ref_radius', frac: 'mb_ref_frac', trig: 'mb_ref_trig', layout: 'mb_ref_layout' };
      return T(map[id.slice(4)] || 'mb_sec_refs');
    }
    if (id.indexOf('nec:') === 0) {
      var map = { req: 'mb_nec_req', terms: 'mb_nec_terms', elec: 'mb_nec_elec', methods: 'mb_nec_methods', faq: 'mb_nec_faq', safety: 'mb_nec_safety' };
      return T(map[id.slice(4)] || 'mb_sec_norm');
    }
    return 'MAESTRO BENDER™';
  }

  // ── Full render ────────────────────────────────────────────────
  function render() {
    var screen = document.getElementById('maestroBenderScreen');
    if (!screen) return;
    var html = '<div class="mb-layout">';
    html += '<div class="mb-backdrop" data-role="backdrop"'+(state.sidebarOpen?' class="mb-backdrop open"':'')+'></div>';
    html += '<aside class="mb-sidebar'+(state.sidebarOpen?' open':'')+'" data-role="sidebar">'+sidebarHTML()+'</aside>';
    html += '<main class="mb-main">';
    var isHomeView = (!state.currentSection || state.currentSection === 'home');
    var topTitle = isHomeView ? 'Maestro Bender' : sectionTitle();
    var topSub = isHomeView ? '' : '<div class="mb-top-sub">Maestro Bender</div>';
    html += '<div class="mb-top">';
    html += '<button class="mb-top-btn mb-hambtn" data-role="hamburger" aria-label="'+T('mb_menu')+'">☰</button>';
    html += '<button class="mb-top-btn" data-go="exit" aria-label="'+T('mb_back')+'">←</button>';
    html += '<div class="mb-top-titlewrap">'+topSub+'<div class="mb-top-title">'+topTitle+'</div></div>';
    html += '<button class="mb-top-help" data-go="about" aria-label="help">?</button>';
    html += '</div>';
    html += '<div class="mb-body">'+renderMain()+'</div>';
    html += '</main></div>';
    screen.innerHTML = html;
    _bind(screen);
    if (typeof window._translateDOM === 'function') window._translateDOM(screen);
  }

  // ── Event wiring ───────────────────────────────────────────────
  function _bind(root) {
    root.addEventListener('click', function(e) {
      var t = e.target;
      while (t && t !== root) {
        if (t.dataset && t.dataset.go) {
          var id = t.dataset.go;
          if (id === 'exit') {
            if (state.currentSection && state.currentSection !== 'home') {
              state.currentSection = 'home';
              if (window.innerWidth < 760) state.sidebarOpen = false;
              render();
              var mh = document.querySelector('#maestroBenderScreen .mb-main');
              if (mh) mh.scrollTop = 0;
            } else if (typeof window.showScreen === 'function') {
              window.showScreen('dashboardScreen');
            } else if (typeof window.goBack === 'function') {
              window.goBack();
            }
            return;
          }
          state.currentSection = id;
          if (window.innerWidth < 760) state.sidebarOpen = false;
          render();
          var main = document.querySelector('#maestroBenderScreen .mb-main');
          if (main) main.scrollTop = 0;
          return;
        }
        if (t.dataset && t.dataset.role === 'hamburger') {
          state.sidebarOpen = !state.sidebarOpen;
          var sb = root.querySelector('[data-role="sidebar"]');
          var bd = root.querySelector('[data-role="backdrop"]');
          if (sb) sb.classList.toggle('open', state.sidebarOpen);
          if (bd) bd.classList.toggle('open', state.sidebarOpen);
          return;
        }
        if (t.dataset && t.dataset.role === 'backdrop') {
          state.sidebarOpen = false;
          var sb2 = root.querySelector('[data-role="sidebar"]');
          var bd2 = root.querySelector('[data-role="backdrop"]');
          if (sb2) sb2.classList.remove('open');
          if (bd2) bd2.classList.remove('open');
          return;
        }
        if (t.dataset && t.dataset.pm && t.dataset.f) {
          var delta = parseFloat(t.dataset.pm);
          var field = t.dataset.f;
          var wrap = t.closest('.mb-inputs');
          if (!wrap) return;
          var calcId = wrap.dataset.calc;
          var slider = wrap.querySelector('[data-input="'+field+'"]');
          if (!slider) return;
          var step = parseFloat(slider.step) || 1;
          var newVal = Math.max(+slider.min, Math.min(+slider.max, (+slider.value) + (delta * step)));
          slider.value = newVal;
          state.inputs[calcId][field] = newVal;
          _updateInputDisplay(wrap, field, newVal, slider.dataset.unit || '');
          _refreshResults(calcId);
          return;
        }
        if (t.id === 'mb-save-prefs') {
          var emt = document.getElementById('mb-pref-emt');
          var units = document.getElementById('mb-pref-units');
          if (emt) state.preferences.defaultEmtSize = emt.value;
          if (units) state.preferences.units = units.value;
          _savePrefs();
          var msg = document.getElementById('mb-prefs-msg');
          if (msg) { msg.style.display = 'block'; setTimeout(function(){ msg.style.display = 'none'; }, 1800); }
          return;
        }
        t = t.parentNode;
      }
    });
    root.addEventListener('input', function(e) {
      var t = e.target;
      if (t.classList && t.classList.contains('mb-slider')) {
        var field = t.dataset.input;
        var wrap = t.closest('.mb-inputs');
        if (!wrap) return;
        var calcId = wrap.dataset.calc;
        state.inputs[calcId][field] = +t.value;
        var mn = +t.min, mx = +t.max, v = +t.value;
        var pct = mx > mn ? ((v - mn) / (mx - mn) * 100) : 0;
        t.style.setProperty('--fill', pct + '%');
        _updateInputDisplay(wrap, field, t.value, t.dataset.unit || '');
        _refreshResults(calcId);
      }
      if (t.id === 'mb-frac-dec') {
        var out = document.getElementById('mb-frac-out');
        if (out) out.innerHTML = '→ <strong>'+decToFrac(parseFloat(t.value), 16)+'</strong>';
      }
      if (t.id === 'mb-frac-frac') {
        var out2 = document.getElementById('mb-frac-out');
        if (out2) {
          var d = fracToDec(t.value);
          out2.innerHTML = isNaN(d) ? '→ —' : '→ <strong>'+d.toFixed(4)+'"</strong>';
        }
      }
    });
    root.addEventListener('change', function(e) {
      var t = e.target;
      if (t.tagName === 'SELECT' && t.dataset.input) {
        var field = t.dataset.input;
        var wrap = t.closest('.mb-inputs');
        if (!wrap) return;
        var calcId = wrap.dataset.calc;
        state.inputs[calcId][field] = t.value;
        _refreshResults(calcId);
      }
    });
  }

  function _updateInputDisplay(wrap, field, val, unit) {
    var disp = wrap.querySelector('[data-f="'+field+'-val"]');
    if (disp) disp.textContent = val + (unit || '');
  }
  function _refreshResults(calcId) {
    var body = document.querySelector('#maestroBenderScreen .mb-res-body');
    if (body) body.innerHTML = resultsUI(calcId);
  }

  // ── Public API ─────────────────────────────────────────────────
  window.initMaestroBender = function() {
    _regI18n();
    _loadPrefs();
    injectStyles();
    var screen = document.getElementById('maestroBenderScreen');
    if (!screen) return;
    // Reset to home each open so state is predictable
    if (!screen._mbMounted) {
      screen._mbMounted = true;
      state.currentSection = 'home';
      state.sidebarOpen = false;
    }
    render();
    // Re-render on language change
    if (!window._mbLangHook) {
      window._mbLangHook = true;
      window.addEventListener('maestro:langchange', function() {
        if (document.getElementById('maestroBenderScreen') && document.getElementById('maestroBenderScreen').offsetParent !== null) {
          render();
        }
      });
    }
  };

})();
