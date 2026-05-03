// ============================================
// DESAFÍO MAESTROAC — Gamified Quiz Progression
// Student: progression map + quiz engine + certificates
// 5 corridas × 5 niveles = 25 certificates
// ============================================

(function() {
  'use strict';
  var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

  function _alert(message, kind) {
    try {
      if (window.MaestroDialog && window.MaestroDialog.alert) {
        return window.MaestroDialog.alert({ message: message, kind: kind || 'info' });
      }
    } catch(e) {}
    try { window.alert(message); } catch(e) {}
  }

  // --- Desafio bilingual helper: returns English field when _lang=en ---
  var _dq = function(q, f) {
    if (typeof window._lang !== 'undefined' && window._lang === 'en') {
      var enField = f + '_en';
      if (q[enField] !== undefined) return q[enField];
      if (f === 'q' && q.question_en) return q.question_en;
    }
    return q[f];
  };

  // --- CONSTANTS ---
  var _td = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
  var CORRIDAS = [
    { id: 1, nombre: _td('ds_apprentice', 'Aprendiz'), icon: '🟢', color: '#22c55e', colorDark: '#166534' },
    { id: 2, nombre: _td('ds_perf_tech', 'Técnico en Desempeño'), icon: '🔵', color: '#3b82f6', colorDark: '#1e3a8a' },
    { id: 3, nombre: _td('ds_adv_tech', 'Técnico Avanzado'), icon: '🟣', color: '#8b5cf6', colorDark: '#4c1d95' },
    { id: 4, nombre: _td('ds_specialist', 'Técnico Especialista'), icon: '🟠', color: '#f59e0b', colorDark: '#92400e' },
    { id: 5, nombre: _td('ds_platinum', 'Técnico Platino'), icon: '🏆', color: '#ffd700', colorDark: '#78350f' }
  ];

  var LEVEL_SIZES = [50, 100, 150, 200, 250];
  var PASS_PERCENT = 70;

  // Category difficulty tiers — easy first, hard last
  // Level 1 draws from tier 1, Level 2 from tier 1-2, etc.
  var CATEGORY_TIERS = {
    // Tier 1 — Fundamentals (Level 1)
    'Herramientas': 1, 'Seguridad': 1, 'Instalación': 1,
    'Herramientas Experto': 1, 'Seguridad Completa': 1,
    // Tier 2 — Core skills (Level 2)
    'Electricidad': 2, 'Tubería': 2, 'Soldadura': 2,
    'Principios Refrigeración': 2, 'Refrigeración': 2, 'Calefacción': 2,
    'Motores Eléctricos': 2, 'Ductos y Flujo de Aire': 2,
    'Tubería y Soldadura': 2, 'Refrigerantes': 2,
    // Tier 3 — Intermediate (Level 3)
    'Mantenimiento': 3, 'Controles': 3, 'Controles y Componentes': 3,
    'Vacío': 3, 'Compresores': 3, 'Bombas de Calor': 3,
    'Mini-Split/Ductless': 3, 'Válvulas y Accesorios': 3,
    'Manejo de Refrigerantes': 3, 'Eficiencia': 3, 'Eficiencia Energética': 3,
    'Tablas PT y Presiones': 3, 'Sistemas': 3,
    // Tier 4 — Advanced (Level 4)
    'Diagnóstico': 4, 'Troubleshooting': 4, 'Recovery': 4,
    'Fórmulas y Cálculos': 4, 'Psicrometría': 4,
    'Electricidad Avanzada': 4, 'Diagnóstico Avanzado': 4,
    'Diagnóstico con Instrumentos': 4, 'Controles Experto': 4,
    'Sistemas Comerciales': 4, 'Residencial Avanzado': 4,
    'Comercial Avanzado': 4, 'Diseño de Sistemas': 4,
    // Tier 5 — Expert/Certification (Level 5)
    'EPA 608': 5, 'OSHA': 5, 'OSHA 30': 5, 'Códigos y Seguridad': 5,
    'Técnico Avanzado': 5, 'Escenario Integrado': 5,
    'Industrial': 5, 'Equipos Específicos': 5, 'Códigos y Permisos': 5,
    'Mantenimiento Comercial': 5, 'Códigos': 5
  };

  // Friendly tier names for study screen
  var TIER_NAMES = {
    1: _td('ds_tier1', 'Fundamentos y Herramientas'),
    2: _td('ds_tier2', 'Electricidad, Tubería y Refrigeración'),
    3: _td('ds_tier3', 'Controles, Mantenimiento y Componentes'),
    4: _td('ds_tier4', 'Diagnóstico y Cálculos Avanzados'),
    5: _td('ds_tier5', 'Certificaciones y Sistemas Especializados')
  };

  // Motivational phrases — Maestro Mario Coach Mode
  var CORRECT_PHRASES = {
    low:  [_t('ds_correct_1','¡Bien hecho!'), _t('ds_correct_2','¡Correcto!'), _t('ds_correct_3','¡Así se hace!'), _t('ds_correct_4','¡Eso es!')],
    mid:  [_t('ds_correct_5','¡Excelente!'), _t('ds_correct_6','¡Muy bien!'), _t('ds_correct_7','¡Perfecto!'), _t('ds_correct_8','¡Sigue así!'), _t('ds_correct_9','¡Gran respuesta!')],
    high: [_t('ds_correct_10','¡Impresionante!'), _t('ds_correct_11','¡Nivel de experto!'), _t('ds_correct_12','¡Racha imparable!'), _t('ds_correct_13','¡Dominas el tema!')]
  };

  var WRONG_PHRASES = [
    _t('ds_wrong_1','No te preocupes, la próxima es tuya'),
    _t('ds_wrong_2','Así se aprende, sigue adelante'),
    _t('ds_wrong_3','Ánimo, vas por buen camino'),
    _t('ds_wrong_4','Revisa el tema y lo dominas'),
    _t('ds_wrong_5','No fue esta vez, pero sigues en la pelea'),
    _t('ds_wrong_6','El error es parte del aprendizaje')
  ];

  var MILESTONE_MESSAGES = {
    25:  _td('ds_milestone_25', '¡Ya llevas un cuarto, buen ritmo!'),
    50:  _td('ds_milestone_50', '¡Mitad del camino, sigue así!'),
    75:  _td('ds_milestone_75', '¡El certificado está cerca!'),
    90:  _td('ds_milestone_90', '¡Ya casi terminas, no aflojes!')
  };

  var QUOTES = [
    // --- El Arte de la Guerra — Sun Tzu ---
    { text: _t('ds_quote_1','Cada batalla se gana antes de pelearla.'), author: 'Sun Tzu — El Arte de la Guerra' },
    { text: _t('ds_quote_2','Conoce a tu enemigo y conócete a ti mismo y en cien batallas no serás derrotado.'), author: 'Sun Tzu — El Arte de la Guerra' },
    { text: _t('ds_quote_3','En medio del caos, también hay oportunidad.'), author: 'Sun Tzu — El Arte de la Guerra' },
    { text: _t('ds_quote_4','El supremo arte de la guerra es someter al enemigo sin luchar.'), author: 'Sun Tzu — El Arte de la Guerra' },
    { text: _t('ds_quote_5','Las oportunidades se multiplican a medida que se aprovechan.'), author: 'Sun Tzu — El Arte de la Guerra' },
    { text: _t('ds_quote_6','El guerrero victorioso primero gana y después va a la guerra. El guerrero derrotado primero va a la guerra y después busca ganar.'), author: 'Sun Tzu — El Arte de la Guerra' },
    // --- Marco Aurelio — Meditaciones ---
    { text: _t('ds_quote_7','El verdadero poder reside en la calma interior.'), author: 'Marco Aurelio — Meditaciones' },
    { text: _t('ds_quote_8','El obstáculo es el camino.'), author: 'Marco Aurelio — Meditaciones' },
    { text: _t('ds_quote_9','No pierdas más tiempo discutiendo lo que debe ser un buen hombre. Sé uno.'), author: 'Marco Aurelio — Meditaciones' },
    { text: _t('ds_quote_10','La felicidad de tu vida depende de la calidad de tus pensamientos.'), author: 'Marco Aurelio — Meditaciones' },
    { text: _t('ds_quote_11','El impedimento a la acción avanza la acción. Lo que se interpone en el camino se convierte en el camino.'), author: 'Marco Aurelio — Meditaciones' },
    { text: _t('ds_quote_12','Tienes poder sobre tu mente, no sobre los eventos externos. Entiende esto y encontrarás la fuerza.'), author: 'Marco Aurelio — Meditaciones' },
    // --- Las 48 Leyes del Poder — Robert Greene ---
    { text: _t('ds_quote_13','Nunca opaques al maestro. Haz que los que están arriba se sientan superiores.'), author: 'Robert Greene — 48 Leyes del Poder' },
    { text: _t('ds_quote_14','Concéntrate en el resultado final, no en los obstáculos del camino.'), author: 'Robert Greene — 48 Leyes del Poder' },
    { text: _t('ds_quote_15','Cuando pidas ayuda, apela al interés propio de la gente, nunca a su piedad.'), author: 'Robert Greene — 48 Leyes del Poder' },
    { text: _t('ds_quote_16','Usa la ausencia selectiva para aumentar el respeto y el honor.'), author: 'Robert Greene — 48 Leyes del Poder' },
    { text: _t('ds_quote_17','Planifica hasta el final. El final es todo.'), author: 'Robert Greene — 48 Leyes del Poder' },
    { text: _t('ds_quote_18','Domina el arte de la oportunidad. Nunca te apresures, la paciencia es poder.'), author: 'Robert Greene — 48 Leyes del Poder' },
    { text: _t('ds_quote_19','Aprende a mantener a la gente dependiente de ti.'), author: 'Robert Greene — 48 Leyes del Poder' },
    // --- Maquiavelo — El Príncipe ---
    { text: _t('ds_quote_20','Es mejor ser temido que amado, si no se puede ser ambas cosas.'), author: 'Maquiavelo — El Príncipe' },
    { text: _t('ds_quote_21','Nunca se intente ganar por fuerza lo que se puede ganar por engaño.'), author: 'Maquiavelo — El Príncipe' },
    { text: _t('ds_quote_22','Los hombres ofenden antes al que aman que al que temen.'), author: 'Maquiavelo — El Príncipe' },
    // --- Grandes líderes y pensadores ---
    { text: _t('ds_quote_23','El que domina a otros es fuerte; el que se domina a sí mismo es poderoso.'), author: 'Lao Tzu — Tao Te Ching' },
    { text: _t('ds_quote_24','La disciplina es el puente entre metas y logros.'), author: 'Jim Rohn' },
    { text: _t('ds_quote_25','La victoria pertenece al más perseverante.'), author: 'Napoleón Bonaparte' },
    { text: _t('ds_quote_26','Lo que no te mata te hace más fuerte.'), author: 'Nietzsche' },
    { text: _t('ds_quote_27','El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor de continuar.'), author: 'Winston Churchill' },
    { text: _t('ds_quote_28','La excelencia no es un acto, sino un hábito.'), author: 'Aristóteles' },
    { text: _t('ds_quote_29','La suerte favorece a la mente preparada.'), author: 'Louis Pasteur' },
    { text: _t('ds_quote_30','No cuentes los días, haz que los días cuenten.'), author: 'Muhammad Ali' },
    { text: _t('ds_quote_31','El secreto de salir adelante es comenzar.'), author: 'Mark Twain' },
    { text: _t('ds_quote_32','El hombre que mueve montañas comienza cargando pequeñas piedras.'), author: 'Confucio' },
    { text: _t('ds_quote_33','La mejor venganza es un éxito masivo.'), author: 'Frank Sinatra' },
    { text: _t('ds_quote_34','Trabaja en silencio, deja que tu éxito haga el ruido.'), author: 'Frank Ocean' },
    { text: _t('ds_quote_35','El dolor que sientes hoy será la fuerza que sentirás mañana.'), author: 'Anónimo' },
    { text: _t('ds_quote_36','Cree que puedes y ya estás a medio camino.'), author: 'Theodore Roosevelt' },
    { text: _t('ds_quote_37','Haz lo que temes y la muerte del miedo es segura.'), author: 'Ralph Waldo Emerson' },
    { text: _t('ds_quote_38','Un técnico preparado vale más que diez con suerte.'), author: 'Maestro Mario' },
    { text: _t('ds_quote_39','El conocimiento es tu herramienta más poderosa. Úsala.'), author: 'Maestro Mario' },
    { text: _t('ds_quote_40','Cada pregunta que dominas es un paso más hacia tu certificado.'), author: 'Maestro Mario' }
  ];

  // --- STATE ---
  var _dsProgress = [];      // Array from Supabase desafio_progress
  var _dsQuestions = [];      // Current quiz questions
  var _dsCurrentIdx = 0;      // Current question index
  var _dsCorrect = 0;         // Correct answers count
  var _dsAnswers = [];         // Array of { selected, correct, isCorrect }
  var _dsCorrida = 0;         // Current corrida (1-5)
  var _dsNivel = 0;           // Current nivel (1-5)
  var _dsStreak = 0;          // Current correct streak
  var _dsStartTime = 0;       // Quiz start timestamp
  var _dsQuoteIdx = 0;        // Next quote to show
  var _dsLastCert = null;     // Last earned level cert data for printing
  var _dsCorridaCert = null;  // Corrida title cert data (requires payment)
  var _dsMilestones = {};     // Track shown milestones
  var _dsTimer = null;        // Per-question countdown interval
  var _dsTimeLeft = 60;       // Seconds left for current question (1 min per question)
  var _dsAnswered = false;    // Whether current question is answered

  // Mario idle chatter — shown while student is thinking
  var MARIO_IDLE = [
    'Piénsale bien, no hay prisa...',
    'Lee todas las opciones con calma',
    'Tú sabes esto, confía en tu instinto',
    'Confía en tu conocimiento, técnico',
    'Tienes un minuto, úsalo con sabiduría',
    'Concéntrate, como guerrero antes de la batalla',
    'Recuerda lo que estudiaste',
    'Analiza cada opción, elimina las que no cuadran',
    'Piensa como técnico de campo',
    'Elimina las que no son y quédate con la mejor',
    'Como dice Sun Tzu: la paciencia es la clave de la victoria',
    'Marco Aurelio decía: la mente adaptada es inquebrantable',
    'Recuerda: cada pregunta correcta te acerca al certificado',
    'Un buen técnico siempre analiza antes de actuar',
    'Respira, piensa, responde. Ese es el orden'
  ];

  var MARIO_TIMEOUT = [
    'Se acabó el tiempo, a la siguiente',
    'No alcanzaste a responder, sigamos',
    'El reloj no espera, siguiente'
  ];

  // --- INIT ---
  window.initDesafio = async function() {
    var screen = document.getElementById('desafioScreen');
    if (!screen) return;

    // Ensure question bank is loaded for corridas 2-3
    if (typeof loadQuestions === 'function') {
      try { await loadQuestions(); } catch(e) { console.warn('[Desafio]', e.message || e); }
    }

    var email = localStorage.getItem('tecnico_email');
    if (!email || !supabaseClient) {
      _dsProgress = [];
      _dsRenderMap();
      return;
    }

    try {
      var res = await supabaseClient.from('desafio_progress')
        .select('*').eq('user_email', email);
      _dsProgress = res.data || [];
    } catch(e) {
      console.warn('[Desafío] Error loading progress:', e);
      _dsProgress = [];
    }

    _dsRenderMap();
  };

  // --- PROGRESSION MAP ---
  function _dsRenderMap() {
    var screen = document.getElementById('desafioScreen');
    if (!screen) return;

    var userName = 'Técnico';
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      if (u.nombre) userName = u.nombre.split(' ')[0];
    } catch(e) { console.warn('[Desafio]', e.message || e); }

    var totalCerts = _dsProgress.filter(function(p) { return p.porcentaje >= PASS_PERCENT; }).length;
    var currentCorrida = _dsGetCurrentCorrida();

    var html = '<div class="ds-map">';

    // Header
    html += '<div class="ds-header">' +
      '<div class="ds-header-info">' +
        '<div class="ds-header-name">¡Hola, ' + _dsEsc(userName) + '!</div>' +
        '<div class="ds-header-stats">' +
          '<span class="ds-stat">🏅 ' + totalCerts + ' certificado' + (totalCerts !== 1 ? 's' : '') + '</span>' +
          '<span class="ds-stat">🎯 Corrida ' + currentCorrida + '</span>' +
        '</div>' +
      '</div>' +
      (totalCerts > 0 ? '<button onclick="_dsShowMyCerts()" style="margin-top:12px;padding:10px 24px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;font-weight:700;font-size:14px;border:none;border-radius:10px;cursor:pointer;letter-spacing:0.5px;">🏅 Ver Mis Certificados</button>' : '') +
    '</div>';

    // Corridas
    CORRIDAS.forEach(function(c) {
      var isLocked = c.locked && !(typeof isAdminStudent === 'function' && isAdminStudent());
      var corridaProgress = _dsProgress.filter(function(p) { return p.corrida === c.id; });
      var completedLevels = corridaProgress.filter(function(p) { return p.porcentaje >= PASS_PERCENT; }).length;
      var corridaComplete = completedLevels >= 5;

      html += '<div class="ds-corrida' + (isLocked ? ' ds-locked' : '') + (corridaComplete ? ' ds-complete' : '') + '" style="--corrida-color:' + c.color + ';--corrida-dark:' + c.colorDark + ';">';

      // Corrida header
      html += '<div class="ds-corrida-header">' +
        '<div class="ds-corrida-icon">' + c.icon + '</div>' +
        '<div class="ds-corrida-info">' +
          '<div class="ds-corrida-name">Corrida ' + c.id + ': ' + c.nombre + '</div>' +
          '<div class="ds-corrida-sub">' + (isLocked ? '🔒 Próximamente' : completedLevels + '/5 niveles completados') + '</div>' +
        '</div>' +
        (corridaComplete ? '<div class="ds-corrida-badge">✅</div>' : '') +
      '</div>';

      if (!isLocked) {
        // Level badges
        html += '<div class="ds-levels">';
        for (var n = 1; n <= 5; n++) {
          var lp = corridaProgress.find(function(p) { return p.nivel === n; });
          var passed = lp && lp.porcentaje >= PASS_PERCENT;
          var attempted = !!lp;
          var available = _dsIsLevelAvailable(c.id, n);
          var qCount = _dsGetLevelQuestionCount(c.id, n);

          var levelClass = 'ds-level';
          if (passed) levelClass += ' ds-level-passed';
          else if (available) levelClass += ' ds-level-available';
          else levelClass += ' ds-level-locked';

          html += '<div class="' + levelClass + '">';
          html += '<div class="ds-level-num">Nivel ' + n + '</div>';
          html += '<div class="ds-level-count">' + qCount + ' preguntas</div>';

          if (passed) {
            html += '<div class="ds-level-star">★</div>';
            html += '<div class="ds-level-score">' + Math.round(lp.porcentaje) + '%</div>';
          } else if (available) {
            html += '<button class="ds-btn-comenzar" onclick="_dsStartLevel(' + c.id + ',' + n + ')">COMENZAR</button>';
          } else {
            html += '<div class="ds-level-lock">🔒</div>';
          }

          html += '</div>';
        }
        html += '</div>';
      }

      html += '</div>';
    });

    html += '</div>';
    screen.innerHTML = '<div class="sticky-nav-bar sticky-nav-bar--light">' +
      '<button class="btn-nav-back" onclick="showScreen(\'dashboardScreen\')">← Volver</button>' +
      '<span class="nav-bar-title">Desafío Maestro HVACR</span>' +
    '</div>' + html;

    _dsInjectStyles();

    // Show floating Mario on the map
    var mapPhrases = [
      'Bienvenido al Desafío',
      'Elige tu nivel para comenzar',
      'Los certificados te esperan',
      'Aquí se forman los mejores técnicos',
      'Demuestra lo que sabes',
      'Cada nivel te prepara mejor',
      'Arriba los técnicos de verdad',
      'Yo creo en ti, tú puedes'
    ];
    _dsStartMarioTalking(mapPhrases, null);
  }

  // --- LEVEL AVAILABILITY ---
  function _dsIsLevelAvailable(corrida, nivel) {
    // Admin override — staff (admin_staff table) can hit any level for QA/repro
    // without grinding through previous levels. Mirrors the corrida-lock bypass
    // already in _dsRenderMap; per-level gate also needs to honor admin role.
    if (typeof isAdminStudent === 'function' && isAdminStudent()) return true;
    // Clon $59.99 unlocks ALL corridas — no gating.
    if (corrida === 1 && nivel === 1) return true; // Always free
    if (nivel === 1) {
      // First level of corrida: available if previous corrida complete
      var prevCorridaLevels = _dsProgress.filter(function(p) { return p.corrida === corrida - 1 && p.porcentaje >= PASS_PERCENT; });
      return prevCorridaLevels.length >= 5;
    }
    // Other levels: previous level in same corrida must be passed
    var prev = _dsProgress.find(function(p) { return p.corrida === corrida && p.nivel === nivel - 1 && p.porcentaje >= PASS_PERCENT; });
    return !!prev;
  }

  function _dsGetCurrentCorrida() {
    for (var c = 1; c <= 5; c++) {
      var completed = _dsProgress.filter(function(p) { return p.corrida === c && p.porcentaje >= PASS_PERCENT; }).length;
      if (completed < 5) return c;
    }
    return 5;
  }

  // --- QUESTION POOL ---
  function _dsGetAllQuestions() {
    if (typeof questions === 'undefined') return [];
    var all = [];
    var keys = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
    keys.forEach(function(k) {
      if (questions[k]) all = all.concat(questions[k]);
    });
    return all;
  }

  function _dsGetCategoryTier(cat) {
    return CATEGORY_TIERS[cat] || 3; // default to tier 3 if unknown
  }

  function _dsGetCorridaPool(corrida) {
    // Corrida 1: use dedicated new questions from DESAFIO_C1
    if (corrida === 1 && typeof DESAFIO_C1 !== 'undefined') {
      var pool = [];
      for (var n = 1; n <= 5; n++) {
        var key = 'nivel' + n;
        if (DESAFIO_C1[key]) pool = pool.concat(DESAFIO_C1[key]);
      }
      return pool;
    }
    // Corridas 2-3: fallback to old question bank
    var all = _dsGetAllQuestions();
    var pool;
    if (corrida === 2) pool = all.slice(750, 1500);
    else if (corrida === 3) pool = all.slice(1500);
    else return [];

    pool.sort(function(a, b) {
      return _dsGetCategoryTier(a.category) - _dsGetCategoryTier(b.category);
    });
    return pool;
  }

  function _dsGetLevelQuestionCount(corrida, nivel) {
    // Corrida 1: return actual per-level array length (matches _dsGetLevelQuestions)
    if (corrida === 1 && typeof DESAFIO_C1 !== 'undefined') {
      var key = 'nivel' + nivel;
      return (DESAFIO_C1[key] || []).length;
    }
    var pool = _dsGetCorridaPool(corrida);
    var offset = 0;
    for (var i = 0; i < nivel - 1; i++) {
      offset += Math.min(LEVEL_SIZES[i], pool.length - offset);
    }
    return Math.min(LEVEL_SIZES[nivel - 1], pool.length - offset);
  }

  function _dsGetLevelQuestions(corrida, nivel) {
    // Corrida 1: pull directly from DESAFIO_C1.nivelN
    if (corrida === 1 && typeof DESAFIO_C1 !== 'undefined') {
      var key = 'nivel' + nivel;
      return (DESAFIO_C1[key] || []).slice();
    }
    // Fallback for corridas 2-3
    var pool = _dsGetCorridaPool(corrida);
    var offset = 0;
    for (var i = 0; i < nivel - 1; i++) {
      offset += Math.min(LEVEL_SIZES[i], pool.length - offset);
    }
    var count = Math.min(LEVEL_SIZES[nivel - 1], pool.length - offset);
    return pool.slice(offset, offset + count);
  }

  function _dsGetQuestions(corrida, nivel) {
    var subset = _dsGetLevelQuestions(corrida, nivel);
    // Tag each question with its ORIGINAL index BEFORE shuffling
    // so the server can match it to the correct answer key
    for (var oi = 0; oi < subset.length; oi++) { subset[oi]._origIdx = oi; }
    // Seeded shuffle based on email for consistency
    var email = localStorage.getItem('tecnico_email') || 'guest';
    return _dsSeededShuffle(subset, email + '-c' + corrida + 'n' + nivel);
  }

  // Get categories + counts for a level (for study screen)
  function _dsGetLevelCategories(corrida, nivel) {
    var qs = _dsGetLevelQuestions(corrida, nivel);
    var cats = {};
    qs.forEach(function(q) {
      var c = q.category || 'General';
      if (!cats[c]) cats[c] = { name: c, tier: _dsGetCategoryTier(c), questions: [] };
      cats[c].questions.push(q);
    });
    // Sort by tier
    return Object.values(cats).sort(function(a, b) { return a.tier - b.tier; });
  }

  function _dsSeededShuffle(arr, seed) {
    var a = arr.slice();
    var h = 0;
    for (var i = 0; i < seed.length; i++) {
      h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    }
    // Simple seeded PRNG (mulberry32)
    var t = Math.abs(h) + 0x6D2B79F5;
    function rand() {
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // --- START LEVEL (shows study prep first) ---
  window._dsStartLevel = function(corrida, nivel) {
    if (!_dsIsLevelAvailable(corrida, nivel)) return;
    _dsCorrida = corrida;
    _dsNivel = nivel;
    // Show study prep screen before quiz
    _dsShowStudyPrep(corrida, nivel);
  };

  // Actually launch quiz after study prep
  function _dsLaunchQuiz() {
    var rawQuestions = _dsGetQuestions(_dsCorrida, _dsNivel);
    // Strip correct answer and explanation from test-mode questions (server-side scoring)
    _dsQuestions = rawQuestions.map(function(q, i) {
      return { category: q.category, q: q.q, options: q.options.slice(), _idx: q._origIdx !== undefined ? q._origIdx : i, explanation: q.explanation || '', question_en: q.question_en, options_en: q.options_en ? q.options_en.slice() : undefined, explanation_en: q.explanation_en };
      // _idx = ORIGINAL index before shuffle — matches server's DESAFIO_ANSWERS key
    });
    _dsCurrentIdx = 0;
    _dsCorrect = 0;
    _dsIncorrect = 0;
    _dsPoints = 0;
    _dsAnswers = [];
    _dsStreak = 0;
    _dsStartTime = Date.now();
    _dsQuoteIdx = Math.floor(Math.random() * QUOTES.length);
    _dsMilestones = {};
    _dsAnswered = false;
    if (_dsTimer) clearInterval(_dsTimer);
    _dsTimer = null;

    if (_dsQuestions.length === 0) {
      _alert(_tc('ds_no_questions', 'No hay preguntas disponibles para este nivel.'), 'warning');
      return;
    }

    showScreen('desafioQuizScreen');
    // Epic welcome from Mario before first question
    _dsShowWelcome(function() {
      _dsRenderQuestion();
    });
  }

  function _dsShowWelcome(onDone) {
    var screen = document.getElementById('desafioQuizScreen');
    if (!screen) { onDone(); return; }

    var userName = 'Técnico';
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      if (u.nombre) userName = u.nombre.split(' ')[0];
    } catch(e) { console.warn('[Desafio]', e.message || e); }

    var corridaName = CORRIDAS[_dsCorrida - 1].nombre;
    var totalQ = _dsQuestions.length;

    var welcomeMsg = '¡Bienvenido al Desafío, ' + userName + '! Corrida ' + _dsCorrida + ', Nivel ' + _dsNivel + '. Son ' + totalQ + ' preguntas. Con 70 por ciento pasas y te doy tu certificado. ¿Estás listo? ¡Vamos pues!';

    var html = '<div class="ds-welcome-overlay">' +
      '<div class="ds-welcome-card">' +
        '<div class="ds-welcome-mario">' +
          '<img src="mario-black.jpg" alt="Mario" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'👨‍🏫\'" style="width:120px;height:120px;border-radius:50%;border:4px solid #f59e0b;object-fit:cover;">' +
        '</div>' +
        '<div class="ds-welcome-title">DESAFÍO MAESTROAC</div>' +
        '<div class="ds-welcome-sub">' + corridaName + ' — Nivel ' + _dsNivel + ' · ' + totalQ + ' preguntas</div>' +
        '<div class="ds-welcome-bubble" id="dsWelcomeBubble">' +
          '<p style="margin:0 0 8px;">¡Bienvenido, <strong>' + _dsEsc(userName) + '</strong>!</p>' +
          '<p style="margin:0 0 8px;">Con <strong>70%</strong> pasas y te doy tu <strong>certificado</strong>.</p>' +
          '<p style="margin:0;font-size:20px;font-weight:900;">¿Estás listo? ¡VAMOS PUES! 🔥</p>' +
        '</div>' +
        '<div class="ds-welcome-quote">"' + QUOTES[_dsQuoteIdx % QUOTES.length].text + '"<br><span style="color:#f59e0b;">— ' + QUOTES[_dsQuoteIdx % QUOTES.length].author + '</span></div>' +
        '<button class="ds-btn-ready ds-welcome-btn" id="dsWelcomeBtn" onclick="document.querySelector(\'.ds-welcome-overlay\').remove();">¡VAMOS! 🔥</button>' +
      '</div>' +
    '</div>';

    // Inject welcome styles
    if (!document.getElementById('dsWelcomeStyles')) {
      var style = document.createElement('style');
      style.id = 'dsWelcomeStyles';
      style.textContent =
        '.ds-welcome-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:dsFadeIn 0.5s ease;}' +
        '.ds-welcome-card{background:linear-gradient(135deg,#0f172a,#1e293b);border:2px solid rgba(245,158,11,0.5);border-radius:24px;padding:32px 24px;text-align:center;max-width:420px;width:100%;box-shadow:0 0 60px rgba(245,158,11,0.2);animation:dsScaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1);}' +
        '.ds-welcome-mario{margin-bottom:16px;}' +
        '.ds-welcome-title{font-size:28px;font-weight:900;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px;letter-spacing:1px;}' +
        '.ds-welcome-sub{font-size:15px;color:#cbd5e1;margin-bottom:20px;}' +
        '.ds-welcome-bubble{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:18px;color:#f0f4fa;font-size:16px;line-height:1.6;margin-bottom:16px;}' +
        '.ds-welcome-quote{font-size:14px;color:#e2e8f0;font-style:italic;margin-bottom:20px;line-height:1.5;padding:0 10px;}' +
        '.ds-welcome-btn{font-size:22px !important;padding:20px !important;}' +
        '@keyframes dsFadeIn{from{opacity:0}to{opacity:1}}' +
        '@keyframes dsScaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}';
      document.head.appendChild(style);
    }

    screen.innerHTML = html;

    // Mario speaks the welcome message
    _dsMarioSpeak(welcomeMsg);

    // When they click the button, start the quiz
    var btn = document.getElementById('dsWelcomeBtn');
    if (btn) {
      btn.onclick = function() {
        var overlay = document.querySelector('.ds-welcome-overlay');
        if (overlay) overlay.remove();
        onDone();
      };
    }

    // Auto-proceed after 8 seconds if they don't click (so it doesn't block)
    setTimeout(function() {
      var overlay = document.querySelector('.ds-welcome-overlay');
      if (overlay) {
        overlay.remove();
        onDone();
      }
    }, 12000);
  }
  window._dsLaunchQuiz = _dsLaunchQuiz;

  // --- STUDY PREP SCREEN ---
  function _dsShowStudyPrep(corrida, nivel) {
    var screen = document.getElementById('desafioQuizScreen');
    if (!screen) { showScreen('desafioQuizScreen'); screen = document.getElementById('desafioQuizScreen'); }
    showScreen('desafioQuizScreen');

    var categories = _dsGetLevelCategories(corrida, nivel);
    var corridaName = CORRIDAS[corrida - 1].nombre;
    var totalQ = _dsGetLevelQuestionCount(corrida, nivel);

    var marioIntros = [
      'Antes de empezar, te recomiendo estudiar estas categorías. Cuando estés listo, comenzamos.',
      'No te lances sin prepararte. Revisa estos temas primero y cuando te sientas seguro, arrancamos.',
      'Un buen técnico siempre estudia antes de un examen. Revisa este material y cuando estés listo, iniciamos.'
    ];

    var html = '<div class="ds-study-prep">';

    // Header
    html += '<div class="ds-study-header">' +
      '<button class="ds-quiz-back" onclick="showScreen(\'desafioScreen\')" style="position:absolute;left:12px;top:12px;">← Volver</button>' +
      '<div class="ds-study-title">📚 Preparación — Nivel ' + nivel + '</div>' +
      '<div class="ds-study-subtitle">' + corridaName + ' · ' + totalQ + ' preguntas</div>' +
    '</div>';

    // Mario intro
    html += '<div class="ds-mario-coach" style="margin:16px 0;">' +
      '<div class="ds-mario-float">' +
        '<img src="mario-black.jpg" alt="Mario" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'👨‍🏫\'">' +
      '</div>' +
      '<div class="ds-mario-bubble">' + _dsRandPick(marioIntros) + '</div>' +
    '</div>';

    // START button at top
    html += '<button class="ds-btn-ready" onclick="_dsLaunchQuiz()">¡ESTOY LISTO! INICIAR DESAFÍO 🔥</button>';

    // Categories with expandable questions
    html += '<div class="ds-study-cats">';
    categories.forEach(function(cat, ci) {
      var tierLabel = TIER_NAMES[cat.tier] || '';
      html += '<div class="ds-study-cat">' +
        '<div class="ds-study-cat-header" onclick="this.parentElement.classList.toggle(\'ds-cat-open\')">' +
          '<div class="ds-study-cat-info">' +
            '<span class="ds-study-cat-icon" style="color:#ffffff;">' + _dsCatIcon(cat.tier) + '</span>' +
            '<span class="ds-study-cat-name" style="color:#ffffff;font-weight:800;font-size:16px;">' + _dsEsc(cat.name) + '</span>' +
            '<span class="ds-study-cat-count" style="color:#ffffff;font-weight:800;">' + cat.questions.length + ' preg.</span>' +
          '</div>' +
          '<span class="ds-study-cat-arrow" style="color:#a5b4fc;">▶</span>' +
        '</div>' +
        '<div class="ds-study-cat-body">' +
        '<div class="ds-study-resources">' +
          _dsGetResourceLinks(cat.name) +
        '</div>';

      cat.questions.forEach(function(q, qi) {
        var letters = ['A', 'B', 'C', 'D'];
        html += '<div class="ds-study-q">' +
          '<div class="ds-study-q-text">' + (qi + 1) + '. ' + _dsEsc(_dq(q,'q')) + '</div>' +
          '<div class="ds-study-q-opts">';
        _dq(q,'options').forEach(function(opt, oi) {
          html += '<div class="ds-study-q-opt' + (oi === q.correct ? ' ds-study-correct' : '') + '">' +
            '<span class="ds-study-q-letter">' + letters[oi] + '</span> ' + _dsEsc(opt) +
          '</div>';
        });
        html += '</div>';
        if (_dq(q,'explanation')) {
          html += '<div class="ds-study-q-explain">💡 ' + _dsEsc(_dq(q,'explanation')) + '</div>';
        }
        html += '</div>';
      });

      html += '</div></div>';
    });
    html += '</div>';

    // START button at bottom too
    html += '<button class="ds-btn-ready" onclick="_dsLaunchQuiz()" style="margin-top:20px;">¡ESTOY LISTO! INICIAR DESAFÍO 🔥</button>';

    html += '</div>';
    screen.innerHTML = html;

    _dsInjectStudyStyles();

    // Show floating Mario talking during study prep
    var studyPhrases = [
      'Estudia bien cada tema',
      'El que estudia, aprueba',
      'Prepárate, que viene fuerte',
      'Lee cada pregunta con cuidado',
      'Ojo con las respuestas capciosas',
      'Tú puedes con esto',
      'El conocimiento es poder',
      'Un técnico preparado vale doble',
      'No te saltes ninguna categoría',
      'Cuando estés listo, presiona iniciar'
    ];
    _dsStartMarioTalking(studyPhrases, null);
  }

  function _dsCatIcon(tier) {
    var icons = { 1: '🔧', 2: '⚡', 3: '🔩', 4: '📊', 5: '🏅' };
    return icons[tier] || '📋';
  }

  // Credible resource links per category
  var CATEGORY_RESOURCES = {
    'Herramientas':             [{ label: '🔧 Guía de Herramientas HVAC', url: 'https://www.achrnews.com/topics/2767-tools' }],
    'Herramientas Experto':     [{ label: '🔧 Herramientas Avanzadas', url: 'https://www.achrnews.com/topics/2767-tools' }],
    'Seguridad':                [{ label: '🛡️ OSHA — Seguridad HVAC', url: 'https://www.osha.gov/heating-ventilation-air-conditioning' }],
    'Seguridad Completa':       [{ label: '🛡️ OSHA — Seguridad HVAC', url: 'https://www.osha.gov/heating-ventilation-air-conditioning' }],
    'Instalación':              [{ label: '📖 Manual de Instalación Carrier', url: 'https://www.carrier.com/residential/en/us/resources/' }],
    'Electricidad':             [{ label: '⚡ Fundamentos Eléctricos HVAC', url: 'https://www.achrnews.com/topics/2649-electrical' }],
    'Electricidad Avanzada':    [{ label: '⚡ Electricidad Avanzada HVAC', url: 'https://www.achrnews.com/topics/2649-electrical' }],
    'Tubería':                  [{ label: '🔩 Guía de Tubería HVAC/R', url: 'https://www.achrnews.com/topics/2762-piping' }],
    'Tubería y Soldadura':      [{ label: '🔩 Tubería y Soldadura', url: 'https://www.achrnews.com/topics/2762-piping' }],
    'Soldadura':                [{ label: '🔥 Técnicas de Soldadura HVAC', url: 'https://www.achrnews.com/topics/2762-piping' }],
    'Principios Refrigeración': [{ label: '❄️ Fundamentos de Refrigeración', url: 'https://www.danfoss.com/en-us/about-danfoss/our-businesses/cooling/refrigeration-cycle/' }],
    'Refrigeración':            [{ label: '❄️ Ciclo de Refrigeración — Danfoss', url: 'https://www.danfoss.com/en-us/about-danfoss/our-businesses/cooling/refrigeration-cycle/' }],
    'Refrigerantes':            [{ label: '❄️ Guía de Refrigerantes — EPA', url: 'https://www.epa.gov/snap/substitutes-residential-and-light-commercial-ac-and-heat-pumps' }],
    'Manejo de Refrigerantes':  [{ label: '❄️ Manejo de Refrigerantes — EPA', url: 'https://www.epa.gov/section608' }],
    'Calefacción':              [{ label: '🔥 Sistemas de Calefacción', url: 'https://www.energy.gov/energysaver/heat-and-cool' }],
    'Motores Eléctricos':       [{ label: '⚙️ Motores HVAC — ACHR News', url: 'https://www.achrnews.com/topics/2736-motors' }],
    'Ductos y Flujo de Aire':   [{ label: '💨 Diseño de Ductos — ACCA', url: 'https://www.acca.org/standards/manuals/manual-d' }],
    'Mantenimiento':            [{ label: '🔧 Mantenimiento Preventivo', url: 'https://www.energy.gov/energysaver/maintaining-your-air-conditioner' }],
    'Mantenimiento Comercial':  [{ label: '🔧 Mantenimiento Comercial', url: 'https://www.achrnews.com/topics/2732-maintenance' }],
    'Controles':                [{ label: '🎛️ Controles HVAC', url: 'https://www.achrnews.com/topics/2653-controls' }],
    'Controles y Componentes':  [{ label: '🎛️ Controles y Componentes', url: 'https://www.achrnews.com/topics/2653-controls' }],
    'Controles Experto':        [{ label: '🎛️ Controles Avanzados', url: 'https://www.achrnews.com/topics/2653-controls' }],
    'Vacío':                    [{ label: '🔬 Procedimientos de Vacío', url: 'https://www.achrnews.com/topics/2775-vacuum' }],
    'Compresores':              [{ label: '⚙️ Tipos de Compresores', url: 'https://www.danfoss.com/en-us/products/dcs/compressors/' }],
    'Bombas de Calor':          [{ label: '🔄 Bombas de Calor — Energy.gov', url: 'https://www.energy.gov/energysaver/heat-pump-systems' }],
    'Mini-Split/Ductless':      [{ label: '❄️ Mini-Split — Energy.gov', url: 'https://www.energy.gov/energysaver/ductless-mini-split-air-conditioners' }],
    'Válvulas y Accesorios':    [{ label: '🔩 Válvulas HVAC — Danfoss', url: 'https://www.danfoss.com/en-us/products/dcs/valves/' }],
    'Eficiencia':               [{ label: '📊 Eficiencia — Energy Star', url: 'https://www.energystar.gov/products/heating_cooling' }],
    'Eficiencia Energética':    [{ label: '📊 Eficiencia — Energy Star', url: 'https://www.energystar.gov/products/heating_cooling' }],
    'Tablas PT y Presiones':    [{ label: '📋 Tablas PT — HVAC School', url: 'https://hvacrschool.com/pt-chart/' }],
    'Sistemas':                 [{ label: '🏗️ Sistemas HVAC — ASHRAE', url: 'https://www.ashrae.org/technical-resources' }],
    'Sistemas Comerciales':     [{ label: '🏢 Sistemas Comerciales — ASHRAE', url: 'https://www.ashrae.org/technical-resources' }],
    'Diagnóstico':              [{ label: '🔍 Diagnóstico HVAC', url: 'https://www.achrnews.com/topics/2659-diagnostics' }],
    'Diagnóstico Avanzado':     [{ label: '🔍 Diagnóstico Avanzado', url: 'https://www.achrnews.com/topics/2659-diagnostics' }],
    'Diagnóstico con Instrumentos': [{ label: '🔍 Instrumentos de Diagnóstico', url: 'https://www.achrnews.com/topics/2659-diagnostics' }],
    'Troubleshooting':          [{ label: '🔍 Troubleshooting HVAC', url: 'https://www.achrnews.com/topics/2773-troubleshooting' }],
    'Recovery':                 [{ label: '♻️ Recovery de Refrigerantes — EPA', url: 'https://www.epa.gov/section608/refrigerant-recovery-and-recycling-equipment' }],
    'Fórmulas y Cálculos':     [{ label: '🔢 Fórmulas HVAC — Engineer Reference', url: 'https://www.engineeringtoolbox.com/hvac-systems-t_48.html' }],
    'Psicrometría':             [{ label: '🌡️ Carta Psicrométrica', url: 'https://www.engineeringtoolbox.com/psychrometric-chart-d_816.html' }],
    'Diseño de Sistemas':       [{ label: '📐 Diseño — Manual J (ACCA)', url: 'https://www.acca.org/standards/manuals/manual-j' }],
    'Residencial Avanzado':     [{ label: '🏠 Residencial — Energy.gov', url: 'https://www.energy.gov/energysaver/home-cooling-systems' }],
    'Comercial Avanzado':       [{ label: '🏢 Comercial — ASHRAE', url: 'https://www.ashrae.org/technical-resources' }],
    'EPA 608':                  [{ label: '📜 EPA Section 608 — Oficial', url: 'https://www.epa.gov/section608' }],
    'OSHA':                     [{ label: '🛡️ OSHA — Estándares', url: 'https://www.osha.gov/heating-ventilation-air-conditioning' }],
    'OSHA 30':                  [{ label: '🛡️ OSHA 30 — Construcción', url: 'https://www.osha.gov/training/outreach/construction' }],
    'Códigos y Seguridad':      [{ label: '📜 Códigos Mecánicos — ICC', url: 'https://www.iccsafe.org/products-and-services/i-codes/2021-i-codes/imc/' }],
    'Códigos y Permisos':       [{ label: '📜 Códigos y Permisos — ICC', url: 'https://www.iccsafe.org/products-and-services/i-codes/2021-i-codes/imc/' }],
    'Códigos':                  [{ label: '📜 Códigos Mecánicos — ICC', url: 'https://www.iccsafe.org/products-and-services/i-codes/2021-i-codes/imc/' }],
    'Técnico Avanzado':         [{ label: '🏅 Recursos Técnicos — ASHRAE', url: 'https://www.ashrae.org/technical-resources' }],
    'Escenario Integrado':      [{ label: '🏗️ Escenarios HVAC — ACHR News', url: 'https://www.achrnews.com/topics/2767-tools' }],
    'Industrial':               [{ label: '🏭 HVAC Industrial — ASHRAE', url: 'https://www.ashrae.org/technical-resources' }],
    'Equipos Específicos':      [{ label: '⚙️ Equipos — Carrier', url: 'https://www.carrier.com/residential/en/us/products/' }]
  };

  function _dsGetResourceLinks(catName) {
    var resources = CATEGORY_RESOURCES[catName];
    if (!resources) {
      // Fallback: search ACHR News (credible HVAC trade publication)
      return '<a href="https://www.achrnews.com/search?q=' + encodeURIComponent(catName) + '" target="_blank" rel="noopener" class="ds-res-btn ds-res-img">' +
        '📖 Buscar en ACHR News: ' + _dsEsc(catName) + '</a>';
    }
    var html = '';
    resources.forEach(function(r) {
      html += '<a href="' + r.url + '" target="_blank" rel="noopener" class="ds-res-btn ds-res-img">' + r.label + '</a>';
    });
    return html;
  }

  function _dsInjectStudyStyles() {
    if (document.getElementById('dsStudyStyles')) return;
    var style = document.createElement('style');
    style.id = 'dsStudyStyles';
    style.textContent =
      '.ds-study-prep{padding:0 0 40px;max-width:650px;margin:0 auto;}' +
      '.ds-study-header{text-align:center;padding:20px 0 10px;position:relative;}' +
      '.ds-study-title{font-size:20px;font-weight:800;color:#f0f4fa;}' +
      '.ds-study-subtitle{font-size:14px;color:#cbd5e1;margin-top:4px;}' +
      '.ds-btn-ready{display:block;width:100%;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border:none;border-radius:14px;padding:18px;font-size:18px;font-weight:900;cursor:pointer;letter-spacing:0.5px;animation:dsPulse 2s ease-in-out infinite;margin:12px 0;}' +
      '.ds-study-cats{margin-top:16px;}' +
      '.ds-study-cat{background:rgba(14,30,56,0.72);border:1px solid rgba(99,102,241,0.28);border-radius:12px;margin-bottom:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.35);}' +
      '.ds-study-cat-header{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;cursor:pointer;transition:background 0.15s;}' +
      '.ds-study-cat-header:hover{background:rgba(99,102,241,0.10);}' +
      '.ds-study-cat-info{display:flex;align-items:center;gap:12px;flex:1;min-width:0;}' +
      '.ds-study-cat-icon{font-size:20px;flex-shrink:0;}' +
      '.ds-study-cat-name{font-size:16px;font-weight:800;color:#ffffff !important;letter-spacing:0.2px;}' +
      '.ds-study-cat-count{font-size:12px;font-weight:800;color:#ffffff !important;background:rgba(99,102,241,0.45);padding:4px 12px;border-radius:12px;border:1px solid rgba(165,180,252,0.40);flex-shrink:0;letter-spacing:0.3px;}' +
      '.ds-study-cat-arrow{color:#a5b4fc;font-size:16px;font-weight:700;transition:transform 0.2s;flex-shrink:0;margin-left:8px;}' +
      '.ds-cat-open .ds-study-cat-arrow{transform:rotate(90deg);}' +
      '.ds-study-cat-body{display:none;padding:0 16px 16px;border-top:1px solid rgba(255,255,255,0.06);}' +
      '.ds-cat-open .ds-study-cat-body{display:block;}' +
      '.ds-study-q{margin:14px 0;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.04);}' +
      '.ds-study-q:last-child{border-bottom:none;padding-bottom:0;}' +
      '.ds-study-q-text{font-size:14px;font-weight:600;color:#e2e8f0;line-height:1.5;margin-bottom:8px;}' +
      '.ds-study-q-opts{display:flex;flex-direction:column;gap:4px;margin-bottom:6px;}' +
      '.ds-study-q-opt{font-size:14px;color:#e2e8f0;padding:6px 10px;border-radius:6px;line-height:1.4;}' +
      '.ds-study-q-opt.ds-study-correct{background:rgba(34,197,94,0.12);color:#22c55e;font-weight:600;border:1px solid rgba(34,197,94,0.25);}' +
      '.ds-study-q-letter{font-weight:700;color:#cbd5e1;margin-right:4px;}' +
      '.ds-study-correct .ds-study-q-letter{color:#22c55e;}' +
      '.ds-study-q-explain{font-size:13px;color:#a78bfa;line-height:1.5;font-style:italic;padding:6px 10px;background:rgba(139,92,246,0.06);border-radius:6px;}' +
      '.ds-study-resources{display:flex;gap:8px;padding:12px 0 8px;flex-wrap:wrap;}' +
      '.ds-res-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;transition:transform 0.15s,box-shadow 0.15s;}' +
      '.ds-res-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.3);}' +
      '.ds-res-img{background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;border:1px solid rgba(99,102,241,0.4);}';
    document.head.appendChild(style);
  }

  // --- QUIZ ENGINE (layout matches game-mode.html) ---
  var _dsIncorrect = 0;
  var _dsPoints = 0;

  function _dsRenderQuestion() {
    var screen = document.getElementById('desafioQuizScreen');
    if (!screen) return;

    // Stop previous timer
    if (_dsTimer) clearInterval(_dsTimer);
    _dsAnswered = false;
    _dsTimeLeft = 60;

    var q = _dsQuestions[_dsCurrentIdx];
    var corridaName = CORRIDAS[_dsCorrida - 1].nombre.toUpperCase();
    var total = _dsQuestions.length;
    var pct = Math.round((_dsCurrentIdx / total) * 100);
    _dsIncorrect = _dsAnswers.filter(function(a) { return !a.isCorrect; }).length;

    var html = '<div class="ds-quiz">';

    // Back arrow + Title header
    html += '<div class="ds-quiz-top">' +
      '<button class="ds-quiz-back" onclick="_dsConfirmExit()">←</button>' +
      '<div class="ds-quiz-top-info">' +
        '<div class="ds-quiz-corrida">' + corridaName + '</div>' +
        '<div class="ds-quiz-level-sub">' + _dsEsc(q.category || '') + '</div>' +
      '</div>' +
    '</div>';

    // Progress bar (thin)
    html += '<div class="ds-progress-bar"><div class="ds-progress-fill" style="width:' + pct + '%"></div></div>';

    // Stats bar — PUNTOS | CORRECTAS | INCORRECTAS | RACHA
    html += '<div class="ds-stats-bar">' +
      '<div class="ds-stat-item"><div class="ds-stat-label">PUNTOS</div><div class="ds-stat-val ds-stat-orange">' + _dsPoints + '</div></div>' +
      '<div class="ds-stat-item"><div class="ds-stat-label">CORRECTAS</div><div class="ds-stat-val ds-stat-green">' + _dsCorrect + '</div></div>' +
      '<div class="ds-stat-item"><div class="ds-stat-label">INCORRECTAS</div><div class="ds-stat-val ds-stat-red">' + _dsIncorrect + '</div></div>' +
      '<div class="ds-stat-item"><div class="ds-stat-label">RACHA</div><div class="ds-stat-val ds-stat-purple">' + _dsStreak + '</div></div>' +
    '</div>';

    // MARIO AVATAR centered
    html += '<div class="ds-mario-center">' +
      '<div class="ds-mario-avatar-big">' +
        '<img src="mario-black.jpg" alt="Mario" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'👨‍🏫\'">' +
      '</div>' +
    '</div>';

    // CIRCULAR TIMER centered
    html += '<div class="ds-timer-circle" id="dsTimerCircle">' +
      '<svg width="70" height="70" viewBox="0 0 70 70">' +
        '<circle cx="35" cy="35" r="30" stroke="rgba(255,255,255,0.08)" stroke-width="5" fill="none"/>' +
        '<circle id="dsTimerRing" cx="35" cy="35" r="30" stroke="#22c55e" stroke-width="5" fill="none" ' +
          'stroke-dasharray="188.5" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 35 35)" style="transition:stroke-dashoffset 1s linear;"/>' +
      '</svg>' +
      '<div class="ds-timer-num" id="dsTimerNum">60</div>' +
    '</div>';

    // MARIO SPEECH BUBBLE — full width dark bar
    html += '<div class="ds-mario-speech" id="dsMarioCoach">' +
      '<span id="dsMarioBubble">' + _dsRandPick(MARIO_IDLE) + '</span>' +
    '</div>';

    // Category + Question number
    html += '<div class="ds-question">' +
      '<div class="ds-q-category">' + _dsEsc(q.category || '') + '</div>' +
      '<div class="ds-q-count">Pregunta ' + (_dsCurrentIdx + 1) + ' de ' + total + '</div>' +
      '<div class="ds-q-text">' + _dsEsc(_dq(q,'q')) + '</div>' +
    '</div>';

    // Options
    html += '<div class="ds-options">';
    var letters = ['A', 'B', 'C', 'D'];
    _dq(q,'options').forEach(function(opt, idx) {
      html += '<button class="ds-option" data-idx="' + idx + '" onclick="_dsSelectAnswer(' + idx + ')">' +
        '<span class="ds-opt-letter">' + letters[idx] + '</span>' +
        '<span class="ds-opt-text">' + _dsEsc(opt) + '</span>' +
      '</button>';
    });
    html += '</div>';

    // Feedback area (hidden initially)
    html += '<div class="ds-feedback" id="dsFeedback" style="display:none;"></div>';

    // Next button (hidden initially)
    html += '<div class="ds-next-wrap" id="dsNextWrap" style="display:none;">' +
      '<button class="ds-btn-next" onclick="_dsNextQuestion()">Siguiente →</button>' +
    '</div>';

    // Bottom toast (hidden)
    html += '<div class="ds-toast" id="dsToast" style="display:none;"></div>';

    html += '</div>';
    screen.innerHTML = html;

    // Start 60-second countdown
    _dsStartTimer();
    // Hide floating Mario during quiz — it covers the Next button
    _dsHideFloatingMario();

    // Mario says ONE short phrase — varies each question, no voice (text only)
    var _dsQuestionPhrases = [
      _tc('ds_phrase_1', 'Piénsale bien'), _tc('ds_phrase_2', 'Tú sabes esto'), _tc('ds_phrase_3', 'Lee todas las opciones'),
      _tc('ds_phrase_4', 'Confía en tu instinto'), _tc('ds_phrase_5', 'Analiza cada opción'), _tc('ds_phrase_6', 'Elimina las que no son'),
      _tc('ds_phrase_7', 'Tienes un minuto'), _tc('ds_phrase_8', 'No te apures'), _tc('ds_phrase_9', 'Recuerda lo que estudiaste'),
      _tc('ds_phrase_10', 'Piensa como técnico'), _tc('ds_phrase_11', 'Tómate tu tiempo'), _tc('ds_phrase_12', 'Vamos bien')
    ];
    var _bubble = document.getElementById('dsMarioBubble');
    if (_bubble) _bubble.textContent = _dsQuestionPhrases[_dsCurrentIdx % _dsQuestionPhrases.length];
  }

  // --- TICK-TOCK SOUND (Web Audio API — no external file needed) ---
  var _dsTickCtx = null;
  function _dsPlayTick() {
    try {
      if (!_dsTickCtx) _dsTickCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = _dsTickCtx.createOscillator();
      var gain = _dsTickCtx.createGain();
      osc.connect(gain);
      gain.connect(_dsTickCtx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = 0.08;
      osc.start();
      osc.stop(_dsTickCtx.currentTime + 0.05);
    } catch(e) { console.warn('[Desafio]', e.message || e); }
  }
  function _dsPlayTickUrgent() {
    try {
      if (!_dsTickCtx) _dsTickCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = _dsTickCtx.createOscillator();
      var gain = _dsTickCtx.createGain();
      osc.connect(gain);
      gain.connect(_dsTickCtx.destination);
      osc.frequency.value = 1200;
      osc.type = 'square';
      gain.gain.value = 0.12;
      osc.start();
      osc.stop(_dsTickCtx.currentTime + 0.06);
    } catch(e) { console.warn('[Desafio]', e.message || e); }
  }

  // --- TIMER (circular ring like game-mode.html) ---
  function _dsStartTimer() {
    _dsTimeLeft = 60;
    var ring = document.getElementById('dsTimerRing');
    var num = document.getElementById('dsTimerNum');
    var circle = document.getElementById('dsTimerCircle');
    var circumference = 188.5; // 2 * PI * 30
    if (ring) { ring.style.strokeDashoffset = '0'; ring.style.stroke = '#22c55e'; }
    if (num) num.textContent = '60';

    _dsTimer = setInterval(function() {
      if (_dsAnswered) { clearInterval(_dsTimer); return; }
      _dsTimeLeft--;
      if (num) num.textContent = _dsTimeLeft;
      if (ring) {
        var offset = circumference * (1 - _dsTimeLeft / 60);
        ring.style.strokeDashoffset = offset;
        if (_dsTimeLeft <= 10) { ring.style.stroke = '#ef4444'; if (circle) circle.classList.add('ds-timer-pulse'); }
        else if (_dsTimeLeft <= 20) ring.style.stroke = '#f59e0b';
        else ring.style.stroke = '#22c55e';
      }
      // Tick-tock sound
      if (_dsTimeLeft <= 15) _dsPlayTickUrgent();
      else if (_dsTimeLeft <= 30) _dsPlayTick();
      // Mario only warns at 15 seconds
      if (_dsTimeLeft === 15) _dsMarioSay('¡Te quedan 15 segundos!');
      if (_dsTimeLeft <= 0) {
        clearInterval(_dsTimer);
        _dsTimeUp();
      }
    }, 1000);
  }

  function _dsTimeUp() {
    if (_dsAnswered) return;
    _dsAnswered = true;

    var q = _dsQuestions[_dsCurrentIdx];
    var total = _dsQuestions.length;

    // Disable all options
    var options = document.querySelectorAll('.ds-option');
    options.forEach(function(btn) {
      btn.onclick = null;
      btn.style.pointerEvents = 'none';
    });

    // Mario timeout message
    _dsMarioSay(_dsRandPick(MARIO_TIMEOUT));

    // Helper to show timeout UI once we know the correct answer
    function _showTimeoutResult(correctIdx, explanation) {
      _dsAnswers.push({ selected: -1, correct: correctIdx, isCorrect: false });

      // Highlight correct answer
      if (correctIdx >= 0) {
        var opts = document.querySelectorAll('.ds-option');
        opts.forEach(function(btn) {
          var bIdx = parseInt(btn.getAttribute('data-idx'));
          if (bIdx === correctIdx) btn.classList.add('ds-opt-correct');
        });
      }

      var fb = document.getElementById('dsFeedback');
      if (fb) {
        fb.className = 'ds-feedback ds-fb-wrong';
        fb.innerHTML = '<div class="ds-fb-phrase" style="color:#ef4444;">' + (typeof _t === 'function' ? _t('ds_time_up') : '⏰ ¡Se acabó el tiempo!') + '</div>' +
          (explanation ? '<div class="ds-fb-explain">' + _dsEsc(explanation) + '</div>' : '');
        fb.style.display = 'block';
      }

      var nw = document.getElementById('dsNextWrap');
      if (nw) {
        nw.style.display = 'flex';
        if (_dsCurrentIdx >= total - 1) {
          nw.innerHTML = '<button class="ds-btn-next ds-btn-finish" onclick="_dsFinishLevel()">' + _tc('ds_view_results', 'Ver Resultados 🏆') + '</button>';
        }
      }
    }

    // Call server to get correct answer (send selectedAnswer: -1 for timeout)
    var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : (typeof SB_URL !== 'undefined' ? SB_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');

    fetch(sbUrl + '/functions/v1/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sbKey, 'apikey': sbKey },
      body: JSON.stringify({
        system: 'desafio',
        corrida: _dsCorrida || 1,
        nivel: _dsNivel,
        questionIndex: q._idx !== undefined ? q._idx : _dsCurrentIdx,
        selectedAnswer: -1
      })
    }).then(function(r) {
      // Same guard as the answer handler: non-2xx must throw so we use the fallback
      if (!r.ok) throw new Error('verify-answer HTTP ' + r.status);
      return r.json();
    }).then(function(res) {
      if (!res || typeof res.correctIndex !== 'number') {
        throw new Error('verify-answer malformed response');
      }
      _showTimeoutResult(res.correctIndex, '');
    }).catch(function(err) {
      console.warn('[Desafio] Server verify failed on timeout, using client fallback:', err);
      var fallback = _dsFallbackCorrect(_dsCorrida, _dsNivel, q._idx !== undefined ? q._idx : _dsCurrentIdx);
      if (fallback) {
        var _toExp = (typeof window._lang !== 'undefined' && window._lang === 'en' && fallback.explanation_en) ? fallback.explanation_en : fallback.explanation;
        _showTimeoutResult(fallback.correct, _toExp);
      } else {
        _showTimeoutResult(-1, '');
      }
    });
  }

  // --- MARIO CHATTER (disabled — Mario only speaks at key moments) ---
  var _dsMarioInterval = null;
  function _dsMarioChatter() {
    // No-op: Mario stays quiet during questions to let student concentrate
    if (_dsMarioInterval) clearInterval(_dsMarioInterval);
  }

  // --- MARIO TTS (Text-to-Speech) via ElevenLabs ---
  var _dsMarioAudio = null;
  var _dsMarioAudioUrl = null;
  function _dsMarioSpeak(msg) {
    if (!msg || msg.length < 2) return;
    if (typeof spk === 'function') { spk(msg); return; }
    // Fallback: call tutor-ia-voice directly using global config
    var SB = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : (typeof SB_URL !== 'undefined' ? SB_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');
    var KEY = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');
    fetch(SB + '/functions/v1/tutor-ia-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY, 'apikey': KEY },
      body: JSON.stringify({ text: msg.substring(0, 2000) })
    })
    .then(function(r) { if (!r.ok) throw new Error('Voice error'); return r.blob(); })
    .then(function(b) {
      if (b.size < 100) return;
      if (_dsMarioAudioUrl) { try { URL.revokeObjectURL(_dsMarioAudioUrl); } catch(e) { console.warn('[Desafio]', e.message || e); } }
      _dsMarioAudioUrl = URL.createObjectURL(b);
      if (!_dsMarioAudio) _dsMarioAudio = new Audio();
      _dsMarioAudio.src = _dsMarioAudioUrl;
      _dsMarioAudio.play().catch(function(e) { console.log('Mario voice play failed:', e); });
      _dsMarioAudio.onended = function() { try { URL.revokeObjectURL(_dsMarioAudioUrl); } catch(e) { console.warn('[Desafio]', e.message || e); } _dsMarioAudioUrl = null; };
    })
    .catch(function(e) { console.log('Mario voice error:', e); });
  }

  function _dsMarioSay(msg) {
    // Update floating Mario (always visible)
    _dsMarioFloat_Say(msg);
    // Speak out loud
    _dsMarioSpeak(msg);
    // Also update inline bubble if it exists
    var bubble = document.getElementById('dsMarioBubble');
    if (bubble) {
      bubble.style.animation = 'none';
      bubble.offsetHeight;
      bubble.textContent = msg;
      bubble.style.animation = 'dsMarioPop 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    }
    // No border/shadow flash — prevents screen blinking
  }

  // --- Client-side fallback: look up correct answer from original question bank ---
  function _dsFallbackCorrect(corrida, nivel, questionIndex) {
    // Use ORIGINAL (un-shuffled) array — questionIndex is the original index
    var rawQ = _dsGetLevelQuestions(corrida, nivel);
    if (questionIndex >= 0 && questionIndex < rawQ.length) {
      var rq = rawQ[questionIndex];
      return { correct: rq.correct, explanation: rq.explanation || '', explanation_en: rq.explanation_en };
    }
    return null;
  }

  // --- Process answer result (shared by server response and client fallback) ---
  function _dsProcessAnswerResult(idx, isCorrect, correctIdx, explanation, total) {
    var q = _dsQuestions[_dsCurrentIdx];

    if (isCorrect) {
      _dsCorrect++;
      _dsStreak++;
      if (window.Gamification) window.Gamification.recordAnswer('desafio', 'c' + (_dsCorrida || 1) + '_n' + (_dsNivel || 1), true);
      // Points: base 100 + time bonus + streak bonus
      var timeBonus = _dsTimeLeft * 5;
      var streakBonus = Math.min(_dsStreak, 10) * 20;
      _dsPoints += 100 + timeBonus + streakBonus;
    } else {
      _dsStreak = 0;
      if (window.Gamification) window.Gamification.recordAnswer('desafio', 'c' + (_dsCorrida || 1) + '_n' + (_dsNivel || 1), false);
    }

    _dsAnswers.push({ selected: idx, correct: correctIdx, isCorrect: isCorrect });

    // Highlight correct/wrong options
    var options = document.querySelectorAll('.ds-option');
    options.forEach(function(btn) {
      btn.onclick = null;
      btn.style.pointerEvents = 'none';
      var bIdx = parseInt(btn.getAttribute('data-idx'));
      if (bIdx === correctIdx) {
        btn.classList.add('ds-opt-correct');
      } else if (bIdx === idx && !isCorrect) {
        btn.classList.add('ds-opt-wrong');
      }
    });

    // Show feedback
    var fb = document.getElementById('dsFeedback');
    if (fb) {
      var phrase = '';
      if (isCorrect) {
        if (_dsStreak >= 5) phrase = _dsRandPick(CORRECT_PHRASES.high);
        else if (_dsStreak >= 3) phrase = _dsRandPick(CORRECT_PHRASES.mid);
        else phrase = _dsRandPick(CORRECT_PHRASES.low);
        fb.className = 'ds-feedback ds-fb-correct';
        fb.innerHTML = '<div class="ds-fb-phrase ds-fb-bounce">' + phrase + '</div>' +
          (explanation ? '<div class="ds-fb-explain">' + _dsEsc(explanation) + '</div>' : '');
        _dsMarioSay(phrase);
      } else {
        phrase = _dsRandPick(WRONG_PHRASES);
        fb.className = 'ds-feedback ds-fb-wrong';
        fb.innerHTML = '<div class="ds-fb-phrase">' + phrase + '</div>' +
          (explanation ? '<div class="ds-fb-explain">' + _dsEsc(explanation) + '</div>' : '');
        _dsMarioSay(phrase);
      }
      fb.style.display = 'block';
    }

    // Show next button
    var nw = document.getElementById('dsNextWrap');
    if (nw) {
      nw.style.display = 'flex';
      if (_dsCurrentIdx >= total - 1) {
        nw.innerHTML = '<button class="ds-btn-next ds-btn-finish" onclick="_dsFinishLevel()">' + _tc('ds_view_results', 'Ver Resultados 🏆') + '</button>';
      }
    }

    // Update score in header
    var scoreEl = document.querySelector('.ds-quiz-score');
    if (scoreEl) scoreEl.textContent = _dsCorrect + '✓';

    // Check milestones
    var progressPct = Math.round(((_dsCurrentIdx + 1) / total) * 100);
    _dsCheckMilestone(progressPct);

    // Visual quote overlay every 10 questions
    if ((_dsCurrentIdx + 1) % 10 === 0 && _dsCurrentIdx < total - 1) {
      _dsShowQuote();
    }
    // Mario speaks a book quote every 5 answers (after the correct/wrong phrase)
    if ((_dsCurrentIdx + 1) % 5 === 0 && _dsCurrentIdx < total - 1) {
      var bq = QUOTES[(_dsQuoteIdx + _dsCurrentIdx) % QUOTES.length];
      setTimeout(function() { _dsMarioSpeak(bq.text + '. ' + bq.author); }, 3000);
    }
  }

  window._dsSelectAnswer = function(idx) {
    if (_dsAnswered) return; // Prevent double-answer
    _dsAnswered = true;
    if (_dsTimer) { clearInterval(_dsTimer); _dsTimer = null; }
    if (_dsMarioInterval) clearInterval(_dsMarioInterval);

    var q = _dsQuestions[_dsCurrentIdx];
    var total = _dsQuestions.length;

    // Disable all option buttons while waiting for server
    var btns = document.querySelectorAll('.ds-option');
    btns.forEach(function(b) { b.disabled = true; b.style.pointerEvents = 'none'; b.onclick = null; });

    // Resolve Supabase URL and key
    var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : (typeof SB_URL !== 'undefined' ? SB_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');

    // Capture current question index before async (guards against race conditions)
    var capturedIdx = _dsCurrentIdx;
    var capturedTimeLeft = _dsTimeLeft;

    fetch(sbUrl + '/functions/v1/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sbKey, 'apikey': sbKey },
      body: JSON.stringify({
        system: 'desafio',
        corrida: _dsCorrida || 1,
        nivel: _dsNivel,
        questionIndex: q._idx !== undefined ? q._idx : capturedIdx,
        selectedAnswer: idx
      })
    }).then(function(r) {
      // Guard: if server returned non-2xx (e.g. "Corrida 2 not available yet"),
      // throw so we fall through to the client-side fallback below. Without this
      // guard the response body is read as { error: "..." } and isCorrect ends
      // up undefined → every answer scored as wrong (Corrida 2+ regression).
      if (!r.ok) throw new Error('verify-answer HTTP ' + r.status);
      return r.json();
    }).then(function(res) {
      // Defensive: if the body is { error } even with 200, also fall back.
      if (!res || typeof res.isCorrect !== 'boolean' || typeof res.correctIndex !== 'number') {
        throw new Error('verify-answer malformed response');
      }
      var isCorrect = res.isCorrect;
      var correctIdx = res.correctIndex;
      // Use client-side explanation since server does not return it
      var _expQ = _dsQuestions[capturedIdx];
      _dsProcessAnswerResult(idx, isCorrect, correctIdx, _expQ ? _dq(_expQ, 'explanation') || '' : '', total);
    }).catch(function(err) {
      // Fallback: if Edge Function fails, use client-side (graceful degradation)
      console.warn('[Desafio] Server verify failed, using client fallback:', err);
      var fallback = _dsFallbackCorrect(_dsCorrida, _dsNivel, q._idx !== undefined ? q._idx : capturedIdx);
      if (fallback) {
        var isCorrect = idx === fallback.correct;
        var _fbExp = (typeof window._lang !== 'undefined' && window._lang === 'en' && fallback.explanation_en) ? fallback.explanation_en : fallback.explanation;
        _dsProcessAnswerResult(idx, isCorrect, fallback.correct, _fbExp, total);
      } else {
        // Last resort: cannot verify — mark as incorrect, move on
        _dsProcessAnswerResult(idx, false, -1, '', total);
      }
    });
  };

  window._dsNextQuestion = function() {
    _dsCurrentIdx++;
    try {
      var totalAnswered = parseInt(localStorage.getItem('desafio_total_answered') || '0', 10) + 1;
      localStorage.setItem('desafio_total_answered', String(totalAnswered));
      if (totalAnswered > 50 && typeof requirePremium === 'function' && !requirePremium('desafio-full')) {
        return;
      }
    } catch(_e) {}
    if (_dsCurrentIdx < _dsQuestions.length) {
      _dsRenderQuestion();
    }
  };

  window._dsConfirmExit = function() {
    var overlay = document.createElement('div');
    overlay.className = 'ds-exit-overlay';
    overlay.innerHTML = '<div class="ds-exit-modal">' +
      '<div class="ds-exit-title">¿Salir del Desafío?</div>' +
      '<div class="ds-exit-text">Tu progreso en este nivel se perderá.</div>' +
      '<div class="ds-exit-btns">' +
        '<button class="ds-exit-stay" onclick="this.closest(\'.ds-exit-overlay\').remove()">Seguir</button>' +
        '<button class="ds-exit-leave" onclick="this.closest(\'.ds-exit-overlay\').remove();showScreen(\'desafioScreen\')">Salir</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);
  };

  // --- MILESTONES ---
  function _dsCheckMilestone(pct) {
    var thresholds = [25, 50, 75, 90];
    thresholds.forEach(function(t) {
      if (pct >= t && !_dsMilestones[t]) {
        _dsMilestones[t] = true;
        _dsShowMilestone(MILESTONE_MESSAGES[t]);
      }
    });
  }

  function _dsShowMilestone(msg) {
    var banner = document.createElement('div');
    banner.className = 'ds-milestone';
    banner.innerHTML = '<div class="ds-milestone-avatar"><img src="mario-black.jpg" alt="Mario" onerror="this.parentElement.textContent=\'👨‍🏫\'"></div>' +
      '<div class="ds-milestone-text">' + msg + '</div>';
    var screen = document.getElementById('desafioQuizScreen');
    if (screen) screen.appendChild(banner);
    setTimeout(function() { banner.classList.add('ds-milestone-show'); }, 50);
    setTimeout(function() {
      banner.classList.remove('ds-milestone-show');
      setTimeout(function() { if (banner.parentNode) banner.remove(); }, 400);
    }, 3000);
  }

  function _dsShowQuote() {
    var q = QUOTES[_dsQuoteIdx % QUOTES.length];
    _dsQuoteIdx++;
    var overlay = document.createElement('div');
    overlay.className = 'ds-quote-overlay';
    overlay.innerHTML = '<div class="ds-quote-card">' +
      '<div class="ds-quote-text">"' + q.text + '"</div>' +
      '<div class="ds-quote-author">— ' + q.author + '</div>' +
    '</div>';
    overlay.onclick = function() { overlay.remove(); };
    var screen = document.getElementById('desafioQuizScreen');
    if (screen) screen.appendChild(overlay);
    setTimeout(function() { overlay.classList.add('ds-quote-show'); }, 50);
    setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 6000);
    // Mario SPEAKS the quote out loud
    _dsMarioSpeak(q.text + '. ' + q.author);
  }

  // --- FINISH LEVEL ---
  window._dsFinishLevel = async function() {
    var total = _dsQuestions.length;
    var pct = Math.round((_dsCorrect / total) * 100 * 100) / 100;
    if (window.Gamification) window.Gamification.checkPerfectQuiz(_dsCorrect, total);
    var passed = pct >= PASS_PERCENT;
    var elapsed = Math.round((Date.now() - _dsStartTime) / 1000);
    var certId = null;

    if (passed) {
      certId = 'DESAFIO-C' + _dsCorrida + 'N' + _dsNivel + '-' +
        new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
        Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    // Save to Supabase
    var email = localStorage.getItem('tecnico_email');
    if (email && supabaseClient) {
      try {
        await supabaseClient.from('desafio_progress').upsert({
          user_email: email,
          corrida: _dsCorrida,
          nivel: _dsNivel,
          total_questions: total,
          correct_answers: _dsCorrect,
          porcentaje: pct,
          tiempo_segundos: elapsed,
          certificate_id: certId
        }, { onConflict: 'user_email,corrida,nivel' });
      } catch(e) {
        console.warn('[Desafío] Error saving progress:', e);
      }
    }

    // Update local progress
    var existing = _dsProgress.findIndex(function(p) { return p.corrida === _dsCorrida && p.nivel === _dsNivel; });
    var record = {
      user_email: email, corrida: _dsCorrida, nivel: _dsNivel,
      total_questions: total, correct_answers: _dsCorrect,
      porcentaje: pct, tiempo_segundos: elapsed, certificate_id: certId
    };
    if (existing >= 0) _dsProgress[existing] = record;
    else _dsProgress.push(record);

    // Check if entire corrida is complete
    var corridaComplete = _dsProgress.filter(function(p) {
      return p.corrida === _dsCorrida && p.porcentaje >= PASS_PERCENT;
    }).length >= 5;

    // Show results
    _dsShowResults(pct, passed, certId, corridaComplete, total, elapsed);
  };

  // --- RESULTS & CELEBRATION ---
  function _dsShowResults(pct, passed, certId, corridaComplete, total, elapsed) {
    var screen = document.getElementById('desafioQuizScreen');
    if (!screen) return;

    var corridaName = CORRIDAS[_dsCorrida - 1].nombre;
    var userName = 'Técnico HVAC';
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      if (u.nombre) userName = u.nombre;
    } catch(e) { console.warn('[Desafio]', e.message || e); }

    var html = '<div class="ds-results">';

    if (passed) {
      // CONFETTI
      html += '<div class="ds-confetti-container">';
      for (var i = 0; i < 40; i++) {
        var colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#ffd700'];
        var color = colors[i % colors.length];
        var left = Math.random() * 100;
        var delay = Math.random() * 2;
        var size = 6 + Math.random() * 8;
        html += '<div class="ds-confetti" style="left:' + left + '%;animation-delay:' + delay + 's;background:' + color + ';width:' + size + 'px;height:' + size + 'px;"></div>';
      }
      html += '</div>';

      // Success
      html += '<div class="ds-result-icon ds-result-bounce">🎉</div>';
      html += '<div class="ds-result-title">¡¡¡FELICIDADES!!!</div>';

      // Mario avatar + message
      html += '<div class="ds-mario-msg">' +
        '<div class="ds-mario-avatar"><img src="mario-black.jpg" alt="Mario" onerror="this.parentElement.textContent=\'👨‍🏫\'"></div>' +
        '<div class="ds-mario-text">¡Lo lograste! ¡Sabía que podías! Tu siguiente nivel está listo...</div>' +
      '</div>';

      // Score circle
      html += '<div class="ds-score-circle">' +
        '<svg width="160" height="160"><circle cx="80" cy="80" r="70" stroke="#1e293b" stroke-width="10" fill="none"/>' +
        '<circle cx="80" cy="80" r="70" stroke="' + (pct >= 90 ? '#22c55e' : '#3b82f6') + '" stroke-width="10" fill="none" ' +
        'stroke-dasharray="440" stroke-dashoffset="' + Math.round(440 * (1 - pct / 100)) + '" stroke-linecap="round" transform="rotate(-90 80 80)"/>' +
        '</svg><div class="ds-score-text"><div class="ds-score-val">' + Math.round(pct) + '%</div><div class="ds-score-label">Puntuación</div></div></div>';

      // Stats
      html += '<div class="ds-result-stats">' +
        '<div class="ds-rstat"><div class="ds-rstat-val">' + _dsCorrect + '/' + total + '</div><div class="ds-rstat-label">Correctas</div></div>' +
        '<div class="ds-rstat"><div class="ds-rstat-val">' + _dsFormatTime(elapsed) + '</div><div class="ds-rstat-label">Tiempo</div></div>' +
      '</div>';

      // Certificate
      if (certId) {
        // Format date for printable certificate (e.g. "16 de marzo de 2026")
        var _meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        var _now = new Date();
        var certDate = _now.getDate() + ' de ' + _meses[_now.getMonth()] + ' de ' + _now.getFullYear();
        // Map corrida to certificate level IDs (color keys used by executeCertPrint)
        var _nivelIds = ['principiante','intermedio','avanzado','elite','platino'];
        var certLevelId = _nivelIds[_dsCorrida - 1] || 'principiante';
        var certLevelName = corridaName + ' — Nivel ' + _dsNivel;
        // Store for print handler
        _dsLastCert = {
          levelId: certLevelId,
          levelName: certLevelName,
          levelIcon: CORRIDAS[_dsCorrida - 1].icon,
          userName: userName,
          score: Math.round(pct),
          date: certDate,
          certId: certId
        };

        var _isPreCert = _dsCorrida < 5; // Corridas 1-4 = Pre-Certificate, only 5th is official
        var _certLabel = _isPreCert ? 'Pre-Certificado' : 'Certificado';
        html += '<div class="ds-cert-card">' +
          '<div class="ds-cert-title">🏅 ' + _certLabel + ' Obtenido</div>' +
          (_isPreCert ? '<div style="font-size:12px;font-weight:700;color:#fcd34d;margin-bottom:8px;line-height:1.4;">⚠️ PRE-CERTIFICATE — No válido hasta alcanzar el quinto nivel</div>' : '') +
          '<div class="ds-cert-name">' + _dsEsc(userName) + '</div>' +
          '<div class="ds-cert-detail">Corrida ' + _dsCorrida + ': ' + corridaName + ' — Nivel ' + _dsNivel + '</div>' +
          '<div class="ds-cert-id">ID: ' + certId + '</div>' +
          '<div class="ds-cert-share">' +
            '<button class="ds-share-btn ds-share-wa" onclick="_dsShareCert(\'whatsapp\',\'' + certId + '\')">WhatsApp</button>' +
            '<button class="ds-share-btn ds-share-fb" onclick="_dsShareCert(\'facebook\',\'' + certId + '\')">Facebook</button>' +
            '<button class="ds-share-btn ds-share-tw" onclick="_dsShareCert(\'twitter\',\'' + certId + '\')">Twitter</button>' +
            '<button class="ds-share-btn ds-share-cp" onclick="_dsCopyCert(\'' + certId + '\')">Copiar Link</button>' +
          '</div>' +
          '<button onclick="_dsPrintLevelCert()" style="margin-top:10px;width:100%;padding:12px 16px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;font-size:14px;border:none;border-radius:10px;cursor:pointer;letter-spacing:0.5px;">🖨️ Imprimir ' + _certLabel + ' de Nivel</button>' +
        '</div>';
      }

      // Corrida complete mega celebration + TITLE certificate
      if (corridaComplete) {
        // Store corrida title cert data
        _dsCorridaCert = {
          levelId: _nivelIds[_dsCorrida - 1] || 'principiante',
          levelName: corridaName,
          levelIcon: CORRIDAS[_dsCorrida - 1].icon,
          userName: userName,
          score: Math.round(pct),
          date: certDate,
          certId: 'TITULO-C' + _dsCorrida + '-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).substr(2,6).toUpperCase()
        };
        html += '<div class="ds-corrida-complete">' +
          '<div class="ds-cc-icon ds-glow">' + CORRIDAS[_dsCorrida - 1].icon + '</div>' +
          '<div class="ds-cc-title">¡COMPLETASTE LA CORRIDA!</div>' +
          '<div class="ds-cc-subtitle">Ahora eres ' + corridaName + '</div>' +
          '<div class="ds-cc-text">¿Listo para el siguiente desafío?</div>' +
          '<button onclick="_dsPrintTitleCert()" style="margin-top:14px;width:100%;padding:14px 16px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;font-weight:700;font-size:15px;border:none;border-radius:10px;cursor:pointer;letter-spacing:0.5px;">🏅 Imprimir Certificado Oficial: ' + _dsEsc(corridaName) + '</button>' +
        '</div>';
      }

    } else {
      // FAILED — encouraging
      html += '<div class="ds-result-icon">💪</div>';
      html += '<div class="ds-result-title ds-result-retry-title">¡Casi lo logras!</div>';

      html += '<div class="ds-mario-msg">' +
        '<div class="ds-mario-avatar"><img src="mario-black.jpg" alt="Mario" onerror="this.parentElement.textContent=\'👨‍🏫\'"></div>' +
        '<div class="ds-mario-text">¡Casi lo logras! Estuviste a punto... ¡Inténtalo de nuevo, yo creo en ti!</div>' +
      '</div>';

      html += '<div class="ds-score-circle">' +
        '<svg width="160" height="160"><circle cx="80" cy="80" r="70" stroke="#1e293b" stroke-width="10" fill="none"/>' +
        '<circle cx="80" cy="80" r="70" stroke="#f59e0b" stroke-width="10" fill="none" ' +
        'stroke-dasharray="440" stroke-dashoffset="' + Math.round(440 * (1 - pct / 100)) + '" stroke-linecap="round" transform="rotate(-90 80 80)"/>' +
        '</svg><div class="ds-score-text"><div class="ds-score-val">' + Math.round(pct) + '%</div><div class="ds-score-label">Necesitas ' + PASS_PERCENT + '%</div></div></div>';

      html += '<div class="ds-result-stats">' +
        '<div class="ds-rstat"><div class="ds-rstat-val">' + _dsCorrect + '/' + total + '</div><div class="ds-rstat-label">Correctas</div></div>' +
        '<div class="ds-rstat"><div class="ds-rstat-val">' + _dsFormatTime(elapsed) + '</div><div class="ds-rstat-label">Tiempo</div></div>' +
      '</div>';

      // Review wrong answers
      var wrongCount = _dsAnswers.filter(function(a) { return !a.isCorrect; }).length;
      html += '<div class="ds-review-note">Tuviste ' + wrongCount + ' respuesta' + (wrongCount !== 1 ? 's' : '') + ' incorrecta' + (wrongCount !== 1 ? 's' : '') + '. ¡Revisa y vuelve a intentar!</div>';

      html += '<button class="ds-btn-retry" onclick="_dsStartLevel(' + _dsCorrida + ',' + _dsNivel + ')">INTENTAR DE NUEVO 🔄</button>';
    }

    // Back to map
    html += '<button class="ds-btn-back" onclick="showScreen(\'desafioScreen\')">← Volver al Mapa</button>';
    html += '</div>';

    screen.innerHTML = html;
  }

  // --- SHARE ---
  window._dsShareCert = function(platform, certId) {
    var _shareLabel = 'certificado';
    var text = '¡Acabo de obtener mi ' + _shareLabel + ' Desafío Maestro HVACR! 🏅 Corrida ' + _dsCorrida + ', Nivel ' + _dsNivel + '. ID: ' + certId + ' ¡Entrena en la app! 👉 maestrohvacr.com';
    var encoded = encodeURIComponent(text);
    var url = '';
    if (platform === 'whatsapp') url = 'https://wa.me/?text=' + encoded;
    else if (platform === 'facebook') url = 'https://www.facebook.com/sharer/sharer.php?quote=' + encoded;
    else if (platform === 'twitter') url = 'https://twitter.com/intent/tweet?text=' + encoded;
    if (url) window.open(url, '_blank');
  };

  window._dsCopyCert = function(certId) {
    var text = 'Certificado Desafío Maestro HVACR - ID: ' + certId + ' - maestrohvacr.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() { _alert(typeof _t === 'function' ? _t('ds_link_copied') : '¡Link copiado!', 'success'); });
    } else {
      prompt(_t('ds_copy_link_prompt', 'Copia este link:'), text);
    }
  };

  // --- PRINT LEVEL CERTIFICATE (FREE — no payment gate) ---
  window._dsPrintLevelCert = function() {
    if (!_dsLastCert) { _alert(_tc('ds_no_cert_to_print', 'No hay certificado para imprimir'), 'warning'); return; }
    var c = _dsLastCert;
    if (typeof executeCertPrint !== 'function') {
      _alert(typeof _t === 'function' ? _t('ds_cert_not_available') : 'Sistema de certificados no disponible. Recarga la página e intenta de nuevo.', 'error');
      return;
    }
    var isOnlineCert = _dsCorrida < 5;
    if (isOnlineCert) {
      executeCertPrint(c.levelId, 'Certificado en Línea: ' + c.levelName, c.levelIcon, c.userName, c.score, c.date, c.certId);
    } else {
      executeCertPrint(c.levelId, c.levelName, c.levelIcon, c.userName, c.score, c.date, c.certId);
    }
  };

  // --- PRINT TITLE CERTIFICATE ---
  window._dsPrintTitleCert = function() {
    if (!_dsCorridaCert) { _alert(typeof _t === 'function' ? _t('ds_no_title_cert') : 'No hay certificado de título para imprimir', 'warning'); return; }
    var c = _dsCorridaCert;
    if (typeof executeCertPrint !== 'function') {
      _alert(typeof _t === 'function' ? _t('ds_cert_not_available') : 'Sistema de certificados no disponible. Recarga la página e intenta de nuevo.', 'error');
      return;
    }
    executeCertPrint(c.levelId, 'Certificación: ' + c.levelName, c.levelIcon, c.userName, c.score, c.date, c.certId);
  };

  // --- UTILITIES ---
  function _dsRandPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function _dsEsc(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function _dsFormatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // --- FLOATING MARIO (persistent, never destroyed by innerHTML) ---
  var _marioFloatEl = null;
  var _marioFloatInterval = null;

  function _dsShowFloatingMario() {
    if (_marioFloatEl) { _marioFloatEl.style.display = 'flex'; return; }
    // Inject CSS once
    if (!document.getElementById('dsMarioFloatCSS')) {
      var css = document.createElement('style');
      css.id = 'dsMarioFloatCSS';
      css.textContent =
        '#dsMarioFloat{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:10px;' +
          'background:linear-gradient(135deg,rgba(15,23,42,0.97),rgba(30,41,59,0.97));border:2px solid rgba(243,156,18,0.6);' +
          'border-radius:50px;padding:8px 18px 8px 8px;box-shadow:0 4px 24px rgba(0,0,0,0.5),0 0 20px rgba(243,156,18,0.2);' +
          'max-width:92vw;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:border-color 0.3s,box-shadow 0.3s;}' +
        '#dsMarioFloat .mf-avatar{width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid #f39c12;flex-shrink:0;' +
          'box-shadow:0 0 12px rgba(243,156,18,0.4);animation:dsMfGlow 2s ease-in-out infinite alternate;}' +
        '#dsMarioFloat .mf-avatar img{width:100%;height:100%;object-fit:cover;}' +
        '#dsMarioFloat .mf-text{font-size:14px;font-weight:800;color:#fde68a;line-height:1.3;text-shadow:0 1px 3px rgba(0,0,0,0.4);max-width:260px;}' +
        '@keyframes dsMfGlow{0%{box-shadow:0 0 8px rgba(243,156,18,0.3)}100%{box-shadow:0 0 20px rgba(243,156,18,0.6)}}' +
        '@keyframes dsMfPop{0%{transform:scale(0.8);opacity:0}40%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}';
      document.head.appendChild(css);
    }
    // Create element
    _marioFloatEl = document.createElement('div');
    _marioFloatEl.id = 'dsMarioFloat';
    _marioFloatEl.innerHTML =
      '<div class="mf-avatar"><img src="mario-black.jpg" alt="Mario" onerror="this.parentElement.textContent=\'👨‍🏫\'"></div>' +
      '<div class="mf-text" id="dsMarioFloatText">Bienvenido al Desafío</div>';
    document.body.appendChild(_marioFloatEl);
  }

  function _dsHideFloatingMario() {
    if (_marioFloatEl) _marioFloatEl.style.display = 'none';
    if (_marioFloatInterval) { clearInterval(_marioFloatInterval); _marioFloatInterval = null; }
  }

  function _dsMarioFloat_Say(msg) {
    var el = document.getElementById('dsMarioFloatText');
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight;
    el.textContent = msg;
    // No border pulse or inline bubble animation — prevents screen blinking
  }

  function _dsStartMarioTalking(phrases, urgentPhrases) {
    _dsShowFloatingMario();
    // Only used for study prep screen — no interval chatter during quiz
    if (_marioFloatInterval) clearInterval(_marioFloatInterval);
    _marioFloatInterval = setInterval(function() {
      if (_dsAnswered) return;
      var msg = _dsRandPick(phrases);
      _dsMarioFloat_Say(msg);
    }, 10000);
  }

  // --- STYLES ---
  function _dsInjectStyles() {
    if (document.getElementById('dsStyles')) return;
    var style = document.createElement('style');
    style.id = 'dsStyles';
    style.textContent =
      /* Map styles */
      '.ds-map{padding:0 0 30px;}' +
      '.ds-header{background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:20px;margin-bottom:16px;text-align:center;}' +
      '.ds-header-name{font-size:20px;font-weight:800;color:#f0f4fa;margin-bottom:6px;}' +
      '.ds-header-stats{display:flex;justify-content:center;gap:16px;}' +
      '.ds-stat{background:rgba(255,255,255,0.12);padding:4px 12px;border-radius:20px;font-size:14px;color:#e2e8f0;font-weight:700;}' +

      /* Corrida card */
      '.ds-corrida{background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:18px;margin-bottom:12px;border:2px solid rgba(255,255,255,0.06);}' +
      '.ds-corrida.ds-locked{opacity:0.5;filter:grayscale(0.6);}' +
      '.ds-corrida.ds-complete{border-color:var(--corrida-color);}' +
      '.ds-corrida-header{display:flex;align-items:center;gap:12px;margin-bottom:14px;}' +
      '.ds-corrida-icon{font-size:28px;}' +
      '.ds-corrida-name{font-size:16px;font-weight:700;color:#f0f4fa;}' +
      '.ds-corrida-sub{font-size:13px;color:#cbd5e1;margin-top:2px;}' +
      '.ds-corrida-badge{font-size:24px;}' +
      '.ds-corrida-info{flex:1;}' +

      /* Level badges */
      '.ds-levels{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;}' +
      '@media(max-width:480px){.ds-levels{grid-template-columns:repeat(3,1fr);}}' +
      '.ds-level{background:rgba(255,255,255,0.04);border-radius:12px;padding:12px 8px;text-align:center;border:2px solid transparent;transition:all 0.2s;}' +
      '.ds-level-num{font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:4px;}' +
      '.ds-level-count{font-size:13px;color:#cbd5e1;margin-bottom:8px;}' +
      '.ds-level-passed{border-color:var(--corrida-color);background:rgba(255,255,255,0.06);}' +
      '.ds-level-star{font-size:24px;color:#ffd700;}' +
      '.ds-level-score{font-size:12px;color:#22c55e;font-weight:700;}' +
      '.ds-level-available{border-color:var(--corrida-color);box-shadow:0 0 12px rgba(59,130,246,0.3);}' +
      '.ds-level-lock{font-size:18px;opacity:0.4;}' +
      '.ds-btn-comenzar{background:var(--corrida-color);color:#fff;border:none;border-radius:8px;padding:8px 4px;font-size:11px;font-weight:800;cursor:pointer;width:100%;animation:dsPulse 2s ease-in-out infinite;}' +
      '@keyframes dsPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}' +

      /* Quiz styles — matches game-mode.html layout */
      '.ds-quiz{padding:0 0 30px;max-width:600px;margin:0 auto;}' +

      /* Top header: back arrow + title */
      '.ds-quiz-top{display:flex;align-items:center;gap:12px;padding:12px 0;}' +
      '.ds-quiz-back{background:rgba(255,255,255,0.12);border:none;color:#e2e8f0;width:36px;height:36px;border-radius:10px;font-size:18px;cursor:pointer;flex-shrink:0;}' +
      '.ds-quiz-top-info{flex:1;text-align:center;}' +
      '.ds-quiz-corrida{font-size:18px;font-weight:900;color:#f39c12;letter-spacing:2px;}' +
      '.ds-quiz-level-sub{font-size:13px;color:#cbd5e1;margin-top:2px;}' +

      /* Progress bar */
      '.ds-progress-bar{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin:0 0 12px;overflow:hidden;}' +
      '.ds-progress-fill{height:100%;background:linear-gradient(90deg,#3b82f6,#8b5cf6);border-radius:2px;transition:width 0.3s;}' +

      /* Stats bar */
      '.ds-stats-bar{display:flex;justify-content:space-around;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 8px;margin-bottom:16px;}' +
      '.ds-stat-item{text-align:center;flex:1;}' +
      '.ds-stat-label{font-size:11px;font-weight:800;color:#cbd5e1;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}' +
      '.ds-stat-val{font-size:22px;font-weight:900;}' +
      '.ds-stat-orange{color:#f59e0b;}' +
      '.ds-stat-green{color:#22c55e;}' +
      '.ds-stat-red{color:#ef4444;}' +
      '.ds-stat-purple{color:#8b5cf6;}' +

      /* Mario avatar centered */
      '.ds-mario-center{display:flex;justify-content:center;margin-bottom:8px;}' +
      '.ds-mario-avatar-big{width:70px;height:70px;border-radius:50%;overflow:hidden;border:3px solid #f39c12;box-shadow:0 0 24px rgba(243,156,18,0.5);animation:dsMarioGlow 2s ease-in-out infinite alternate;}' +
      '.ds-mario-avatar-big img{width:100%;height:100%;object-fit:cover;}' +
      '@keyframes dsMarioGlow{from{box-shadow:0 0 12px rgba(243,156,18,0.4)}to{box-shadow:0 0 30px rgba(243,156,18,0.7)}}' +

      /* Circular timer */
      '.ds-timer-circle{position:relative;display:flex;justify-content:center;align-items:center;margin:8px auto 12px;width:70px;height:70px;}' +
      '.ds-timer-circle svg{position:absolute;top:0;left:0;}' +
      '.ds-timer-num{font-size:24px;font-weight:900;color:#f0f4fa;z-index:1;font-variant-numeric:tabular-nums;}' +
      '.ds-timer-pulse{animation:dsTimerPulse 0.5s ease-in-out infinite;}' +
      '@keyframes dsTimerPulse{0%,100%{opacity:1}50%{opacity:0.4}}' +

      /* Mario speech bubble — prominent orange-tinted bar */
      '.ds-mario-speech{background:linear-gradient(135deg,rgba(243,156,18,0.2),rgba(245,130,32,0.12));border:2px solid rgba(243,156,18,0.4);border-radius:14px;padding:14px 20px;margin-bottom:16px;text-align:center;min-height:50px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 0 15px rgba(243,156,18,0.15);}' +
      '.ds-mario-speech::before{content:"🗣️";position:absolute;left:14px;font-size:20px;}' +
      '#dsMarioBubble{font-size:17px;font-weight:800;color:#fde68a;line-height:1.4;text-shadow:0 1px 3px rgba(0,0,0,0.3);padding:0 20px;display:inline-block;}' +
      '@keyframes dsMarioPop{0%{transform:scale(0.7);opacity:0}30%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}' +

      /* Mario coach (used in study prep) */
      '.ds-mario-coach{display:flex;align-items:center;gap:14px;margin-bottom:16px;padding:14px 18px;background:linear-gradient(135deg,rgba(243,156,18,0.18),rgba(245,130,32,0.08));border:2px solid rgba(243,156,18,0.4);border-radius:16px;position:relative;overflow:hidden;}' +
      '.ds-mario-float{width:60px;height:60px;border-radius:50%;overflow:hidden;border:3px solid #f39c12;flex-shrink:0;box-shadow:0 0 20px rgba(243,156,18,0.5);}' +
      '.ds-mario-float img{width:100%;height:100%;object-fit:cover;}' +
      '.ds-mario-bubble{flex:1;font-size:16px;font-weight:800;color:#fde68a;line-height:1.4;text-shadow:0 1px 4px rgba(0,0,0,0.3);}' +

      '.ds-question{margin-bottom:20px;}' +
      '.ds-q-category{font-size:12px;color:#8b5cf6;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;}' +
      '.ds-q-count{font-size:13px;color:#cbd5e1;margin-bottom:10px;}' +
      '.ds-q-text{font-size:17px;color:#f0f4fa;font-weight:700;line-height:1.5;}' +

      '.ds-options{display:flex;flex-direction:column;gap:10px;margin-bottom:16px;}' +
      '.ds-option{display:flex;align-items:flex-start;gap:12px;background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 16px;text-align:left;cursor:pointer;transition:all 0.15s;color:#e2e8f0;font-size:14px;line-height:1.4;}' +
      '.ds-option:active{transform:scale(0.98);}' +
      '.ds-opt-letter{background:rgba(255,255,255,0.12);color:#ffffff;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;}' +
      '.ds-opt-text{flex:1;padding-top:3px;}' +
      '.ds-opt-correct{border-color:#22c55e!important;background:rgba(34,197,94,0.1)!important;}' +
      '.ds-opt-correct .ds-opt-letter{background:#22c55e;color:#fff;}' +
      '.ds-opt-wrong{border-color:#ef4444!important;background:rgba(239,68,68,0.1)!important;}' +
      '.ds-opt-wrong .ds-opt-letter{background:#ef4444;color:#fff;}' +

      /* Feedback */
      '.ds-feedback{border-radius:12px;padding:16px;margin-bottom:12px;animation:dsFadeIn 0.3s;}' +
      '.ds-fb-correct{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);}' +
      '.ds-fb-wrong{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);}' +
      '.ds-fb-phrase{font-size:18px;font-weight:800;margin-bottom:8px;}' +
      '.ds-fb-correct .ds-fb-phrase{color:#22c55e;}' +
      '.ds-fb-wrong .ds-fb-phrase{color:#f59e0b;}' +
      '.ds-fb-explain{font-size:14px;color:#e2e8f0;line-height:1.5;}' +
      '.ds-fb-bounce{animation:dsBounce 0.4s ease;}' +
      '@keyframes dsBounce{0%{transform:scale(0.5);opacity:0}50%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}' +
      '@keyframes dsFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +

      '.ds-next-wrap{display:flex;justify-content:center;padding:8px 0;}' +
      '.ds-btn-next{background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;border:none;border-radius:12px;padding:14px 40px;font-size:16px;font-weight:700;cursor:pointer;transition:transform 0.1s;}' +
      '.ds-btn-next:active{transform:scale(0.97);}' +
      '.ds-btn-finish{background:linear-gradient(135deg,#f59e0b,#ef4444)!important;}' +

      /* Bottom toast */
      '.ds-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 24px;border-radius:30px;font-size:14px;font-weight:700;z-index:1000;display:flex;align-items:center;gap:8px;animation:dsFadeIn 0.3s;box-shadow:0 4px 20px rgba(0,0,0,0.3);}' +
      '.ds-toast-correct{background:rgba(34,197,94,0.9);color:#fff;}' +
      '.ds-toast-wrong{background:rgba(239,68,68,0.9);color:#fff;}' +

      /* Milestone */
      '.ds-milestone{position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-100px);background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(243,156,18,0.4);border-radius:16px;padding:14px 20px;display:flex;align-items:center;gap:12px;z-index:1000;transition:transform 0.4s ease;box-shadow:0 8px 32px rgba(0,0,0,0.5);max-width:90%;}' +
      '.ds-milestone-show{transform:translateX(-50%) translateY(0);}' +
      '.ds-milestone-avatar{width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid #f39c12;flex-shrink:0;}' +
      '.ds-milestone-avatar img{width:100%;height:100%;object-fit:cover;}' +
      '.ds-milestone-text{color:#fde68a;font-size:14px;font-weight:700;line-height:1.3;}' +

      /* Quote overlay */
      '.ds-quote-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.4s;cursor:pointer;}' +
      '.ds-quote-show{opacity:1;}' +
      '.ds-quote-card{background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:30px 24px;max-width:360px;text-align:center;margin:0 20px;}' +
      '.ds-quote-text{font-size:16px;color:#e2e8f0;font-style:italic;line-height:1.6;margin-bottom:12px;}' +
      '.ds-quote-author{font-size:13px;color:#8b5cf6;font-weight:600;}' +

      /* Exit modal */
      '.ds-exit-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;}' +
      '.ds-exit-modal{background:#1e293b;border-radius:16px;padding:24px;max-width:320px;text-align:center;margin:0 20px;}' +
      '.ds-exit-title{font-size:18px;font-weight:700;color:#f0f4fa;margin-bottom:8px;}' +
      '.ds-exit-text{font-size:15px;color:#e2e8f0;margin-bottom:20px;}' +
      '.ds-exit-btns{display:flex;gap:10px;justify-content:center;}' +
      '.ds-exit-stay{background:#3b82f6;color:#fff;border:none;border-radius:10px;padding:10px 24px;font-weight:700;cursor:pointer;}' +
      '.ds-exit-leave{background:rgba(255,255,255,0.12);color:#e2e8f0;border:none;border-radius:10px;padding:10px 24px;font-weight:700;cursor:pointer;}' +

      /* Results */
      '.ds-results{text-align:center;padding:20px 0 40px;position:relative;overflow:hidden;}' +
      '.ds-result-icon{font-size:60px;margin-bottom:8px;}' +
      '.ds-result-bounce{animation:dsBounce 0.6s ease;}' +
      '.ds-result-title{font-size:28px;font-weight:900;color:#ffd700;margin-bottom:16px;}' +
      '.ds-result-retry-title{color:#f59e0b;}' +

      '.ds-mario-msg{display:flex;align-items:center;gap:12px;background:rgba(243,156,18,0.08);border:1px solid rgba(243,156,18,0.2);border-radius:14px;padding:14px;margin:0 auto 20px;max-width:400px;text-align:left;}' +
      '.ds-mario-avatar{width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid #f39c12;flex-shrink:0;}' +
      '.ds-mario-avatar img{width:100%;height:100%;object-fit:cover;}' +
      '.ds-mario-text{color:#fde68a;font-size:14px;font-weight:600;line-height:1.4;}' +

      '.ds-score-circle{position:relative;display:inline-block;margin:16px 0;}' +
      '.ds-score-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}' +
      '.ds-score-val{font-size:36px;font-weight:900;color:#f0f4fa;}' +
      '.ds-score-label{font-size:13px;color:#cbd5e1;}' +

      '.ds-result-stats{display:flex;justify-content:center;gap:24px;margin:16px 0;}' +
      '.ds-rstat{text-align:center;}' +
      '.ds-rstat-val{font-size:20px;font-weight:700;color:#f0f4fa;}' +
      '.ds-rstat-label{font-size:13px;color:#cbd5e1;}' +

      /* Certificate card */
      '.ds-cert-card{background:linear-gradient(135deg,#0f172a,#1e293b);border:2px solid #ffd700;border-radius:16px;padding:20px;margin:20px auto;max-width:380px;}' +
      '.ds-cert-title{font-size:18px;font-weight:800;color:#ffd700;margin-bottom:10px;}' +
      '.ds-cert-name{font-size:16px;font-weight:700;color:#f0f4fa;margin-bottom:4px;}' +
      '.ds-cert-detail{font-size:14px;color:#e2e8f0;margin-bottom:4px;}' +
      '.ds-cert-id{font-size:13px;color:#cbd5e1;font-family:monospace;margin-bottom:14px;}' +
      '.ds-cert-share{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}' +
      '.ds-share-btn{border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;color:#fff;}' +
      '.ds-share-wa{background:#25D366;}.ds-share-fb{background:#1877F2;}.ds-share-tw{background:#1DA1F2;}.ds-share-cp{background:#64748b;}' +

      /* Corrida complete */
      '.ds-corrida-complete{background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(245,158,11,0.05));border:2px solid rgba(255,215,0,0.3);border-radius:16px;padding:24px;margin:20px auto;max-width:380px;}' +
      '.ds-cc-icon{font-size:48px;margin-bottom:8px;}' +
      '.ds-glow{animation:dsGlow 1.5s ease-in-out infinite alternate;}' +
      '@keyframes dsGlow{from{filter:drop-shadow(0 0 8px rgba(255,215,0,0.4))}to{filter:drop-shadow(0 0 20px rgba(255,215,0,0.8))}}' +
      '.ds-cc-title{font-size:22px;font-weight:900;color:#ffd700;}' +
      '.ds-cc-subtitle{font-size:16px;color:#f0f4fa;font-weight:600;margin:4px 0;}' +
      '.ds-cc-text{font-size:15px;color:#e2e8f0;margin-top:8px;}' +

      '.ds-review-note{background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.45);border-radius:10px;padding:12px;margin:16px auto;max-width:380px;font-size:14px;font-weight:600;color:#fde68a;line-height:1.5;}' +
      '.ds-btn-retry{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border:none;border-radius:12px;padding:16px 40px;font-size:18px;font-weight:800;cursor:pointer;margin:16px 0;animation:dsPulse 2s ease-in-out infinite;}' +
      '.ds-btn-back{display:inline-block;background:rgba(255,255,255,0.12);color:#e2e8f0;border:none;border-radius:10px;padding:12px 30px;font-size:14px;font-weight:700;cursor:pointer;margin-top:12px;}' +

      /* Confetti */
      '.ds-confetti-container{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:1;}' +
      '.ds-confetti{position:absolute;top:-10px;border-radius:2px;animation:dsConfettiFall 3s ease-in forwards;}' +
      '@keyframes dsConfettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}' +

      '';
    document.head.appendChild(style);
  }

  // Auto-inject styles on load
  _dsInjectStyles();

  // Expose cleanup function so navigation.js can stop Mario when leaving Desafío
  window._dsStopMario = function() {
    _dsHideFloatingMario();
    if (_dsMarioAudio) { try { _dsMarioAudio.pause(); _dsMarioAudio.src = ''; } catch(e) { console.warn('[Desafio]', e.message || e); } }
    if (_dsMarioAudioUrl) { try { URL.revokeObjectURL(_dsMarioAudioUrl); } catch(e) { console.warn('[Desafio]', e.message || e); } _dsMarioAudioUrl = null; }
    if (_dsMarioInterval) { clearInterval(_dsMarioInterval); _dsMarioInterval = null; }
  };

  // Cleanup timer + audio when leaving Desafío screens
  window._dsCleanup = function() {
    if (_dsTimer) { clearInterval(_dsTimer); _dsTimer = null; }
    if (_marioFloatInterval) { clearInterval(_marioFloatInterval); _marioFloatInterval = null; }
    window._dsStopMario();
  };

  // --- MY CERTIFICATES GALLERY ---
  window._dsShowMyCerts = async function() {
    var screen = document.getElementById('desafioScreen');
    if (!screen) return;

    var email = localStorage.getItem('tecnico_email');
    if (!email || !supabaseClient) return;

    // Show loading
    screen.innerHTML = '<div class="sticky-nav-bar sticky-nav-bar--light">' +
      '<button class="btn-nav-back" onclick="_dsBackToMap()">← Volver</button>' +
      '<span class="nav-bar-title">Mis Certificados</span>' +
    '</div>' +
    '<div style="color:#e2e8f0;padding:60px 20px;text-align:center;font-size:15px;">Cargando certificados...</div>';

    // Fetch all passed levels
    var res;
    try {
      res = await supabaseClient.from('desafio_progress')
        .select('corrida,nivel,porcentaje,certificate_id,completed_at,tiempo_segundos')
        .eq('user_email', email)
        .not('certificate_id', 'is', null)
        .gte('porcentaje', 70)
        .order('corrida', { ascending: true });
    } catch(e) {
      screen.innerHTML = '<div class="sticky-nav-bar sticky-nav-bar--light">' +
        '<button class="btn-nav-back" onclick="_dsBackToMap()">← Volver</button>' +
        '<span class="nav-bar-title">Mis Certificados</span>' +
      '</div>' +
      '<div style="color:#ef4444;padding:60px 20px;text-align:center;">Error al cargar certificados</div>';
      return;
    }

    var certs = (res.data || []).sort(function(a, b) {
      return a.corrida !== b.corrida ? a.corrida - b.corrida : a.nivel - b.nivel;
    });

    // Get user name
    var userName = 'Técnico HVAC';
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      if (u.nombre) userName = u.nombre;
    } catch(e) { console.warn('[Desafio]', e.message || e); }

    var _meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var _nivelIds = ['principiante','intermedio','avanzado','elite','platino'];

    var html = '<div style="padding:16px 16px 40px;">';

    // Header summary
    html += '<div style="text-align:center;margin-bottom:20px;">' +
      '<div style="font-size:48px;margin-bottom:8px;">🏅</div>' +
      '<div style="color:#FFD700;font-size:22px;font-weight:800;">' + certs.length + ' Certificado' + (certs.length !== 1 ? 's' : '') + ' Obtenido' + (certs.length !== 1 ? 's' : '') + '</div>' +
      '<div style="color:#e2e8f0;font-size:14px;margin-top:4px;">Desafío Maestro HVACR</div>' +
    '</div>';

    if (certs.length === 0) {
      html += '<div style="text-align:center;padding:40px 20px;color:#e2e8f0;font-size:15px;">' +
        'Aún no tienes certificados. ¡Completa niveles con 70% o más para ganarlos!' +
      '</div>';
    } else {
      // Group by corrida
      var grouped = {};
      certs.forEach(function(c) {
        if (!grouped[c.corrida]) grouped[c.corrida] = [];
        grouped[c.corrida].push(c);
      });

      Object.keys(grouped).forEach(function(corridaId) {
        var cId = parseInt(corridaId);
        var corridaInfo = CORRIDAS[cId - 1];
        var corridaCerts = grouped[corridaId];
        var corridaComplete = corridaCerts.length >= 5;

        html += '<div style="margin-bottom:20px;">';
        html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 14px;background:linear-gradient(135deg,' + corridaInfo.colorDark + ',' + corridaInfo.colorDark + '88);border-radius:12px;border:1px solid ' + corridaInfo.color + '44;">';
        html += '<span style="font-size:24px;">' + corridaInfo.icon + '</span>';
        html += '<div style="flex:1;"><div style="color:' + corridaInfo.color + ';font-weight:700;font-size:15px;">Corrida ' + cId + ': ' + corridaInfo.nombre + '</div>';
        html += '<div style="color:#e2e8f0;font-size:13px;">' + corridaCerts.length + '/5 niveles aprobados</div></div>';
        if (corridaComplete) html += '<span style="font-size:20px;">✅</span>';
        html += '</div>';

        corridaCerts.forEach(function(cert) {
          // Format date
          var certDate = '';
          if (cert.completed_at) {
            var d = new Date(cert.completed_at);
            certDate = d.getDate() + ' de ' + _meses[d.getMonth()] + ' de ' + d.getFullYear();
          }

          html += '<div class="ds-cert-card" style="margin:0 0 12px;">';
          html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
          html += '<div class="ds-cert-title" style="margin:0;">🏅 Nivel ' + cert.nivel + '</div>';
          html += '<div style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;">' + Math.round(cert.porcentaje) + '%</div>';
          html += '</div>';
          html += '<div class="ds-cert-name">' + _dsEsc(userName) + '</div>';
          html += '<div class="ds-cert-detail">Corrida ' + cId + ': ' + corridaInfo.nombre + ' — Nivel ' + cert.nivel + '</div>';
          if (certDate) html += '<div class="ds-cert-detail" style="font-size:12px;">Fecha: ' + certDate + '</div>';
          html += '<div class="ds-cert-id">ID: ' + cert.certificate_id + '</div>';

          // Action buttons
          html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">';
          // Print button
          var printData = JSON.stringify({
            levelId: _nivelIds[cId - 1] || 'principiante',
            levelName: corridaInfo.nombre + ' — Nivel ' + cert.nivel,
            levelIcon: corridaInfo.icon,
            userName: userName,
            score: Math.round(cert.porcentaje),
            date: certDate,
            certId: cert.certificate_id
          }).replace(/'/g, "\\'").replace(/"/g, '&quot;');

          html += '<button onclick="_dsPrintFromGallery(this)" data-cert="' + printData + '" style="flex:1;min-width:120px;padding:10px 14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;font-size:13px;border:none;border-radius:8px;cursor:pointer;">🖨️ Imprimir</button>';

          // Share buttons
          html += '<button class="ds-share-btn ds-share-wa" onclick="_dsShareFromGallery(\'whatsapp\',' + cId + ',' + cert.nivel + ',\'' + cert.certificate_id + '\')" style="flex:1;min-width:80px;">WhatsApp</button>';
          html += '<button class="ds-share-btn ds-share-cp" onclick="_dsCopyCert(\'' + cert.certificate_id + '\')" style="flex:1;min-width:80px;">Copiar Link</button>';
          html += '</div>';

          html += '</div>';
        });

        html += '</div>';
      });
    }

    html += '</div>';

    screen.innerHTML = '<div class="sticky-nav-bar sticky-nav-bar--light">' +
      '<button class="btn-nav-back" onclick="_dsBackToMap()">← Volver</button>' +
      '<span class="nav-bar-title">🏅 Mis Certificados</span>' +
    '</div>' + html;
  };

  // Back to map from certificates gallery
  window._dsBackToMap = function() {
    _dsRenderMap();
  };

  // Print from gallery
  window._dsPrintFromGallery = function(btn) {
    try {
      var data = JSON.parse(btn.getAttribute('data-cert').replace(/&quot;/g, '"'));
      if (typeof executeCertPrint === 'function') {
        executeCertPrint(data.levelId, data.levelName, data.levelIcon, data.userName, data.score, data.date, data.certId);
      } else {
        _alert(typeof _t === 'function' ? _t('ds_cert_not_available') : 'Sistema de certificados no disponible. Recarga la página e intenta de nuevo.', 'error');
      }
    } catch(e) {
      console.error('[Desafío] Error printing from gallery:', e);
      _alert(typeof _t === 'function' ? _t('ds_print_error') : 'Error al imprimir. Recarga la página e intenta de nuevo.', 'error');
    }
  };

  // Share from gallery
  window._dsShareFromGallery = function(platform, corrida, nivel, certId) {
    var text = '¡Acabo de obtener mi certificado Desafío Maestro HVACR! 🏅 Corrida ' + corrida + ', Nivel ' + nivel + '. ID: ' + certId + ' ¡Entrena en la app! 👉 maestrohvacr.com';
    var encoded = encodeURIComponent(text);
    var url = '';
    if (platform === 'whatsapp') url = 'https://wa.me/?text=' + encoded;
    else if (platform === 'facebook') url = 'https://www.facebook.com/sharer/sharer.php?quote=' + encoded;
    else if (platform === 'twitter') url = 'https://twitter.com/intent/tweet?text=' + encoded;
    if (url) window.open(url, '_blank');
  };

  // --- CERTIFICATE NOTIFICATION POPUP (one-time per cert) ---
  var CORRIDA_NAMES = ['Aprendiz', 'Técnico en Desempeño', 'Técnico Avanzado', 'Técnico Especialista', 'Técnico Platino'];
  var CORRIDA_ICONS = ['🟢', '🔵', '🟣', '🟠', '🏆'];

  window._dsCheckCertNotifications = async function() {
    var email = localStorage.getItem('tecnico_email');
    if (!email || !supabaseClient) return;

    // Get all passed levels with certificates
    var res;
    try {
      res = await supabaseClient.from('desafio_progress')
        .select('corrida,nivel,porcentaje,certificate_id,completed_at')
        .eq('user_email', email)
        .not('certificate_id', 'is', null)
        .gte('porcentaje', PASS_PERCENT);
    } catch(e) { return; }

    var certs = res.data || [];
    if (certs.length === 0) return;

    // Check which ones the user has already seen
    var seenKey = 'maestroac_cert_seen_' + email.replace(/[^a-z0-9]/gi, '_');
    var seen = [];
    try { seen = JSON.parse(localStorage.getItem(seenKey) || '[]'); } catch(e) { seen = []; }

    var unseen = certs.filter(function(c) { return seen.indexOf(c.certificate_id) === -1; });
    if (unseen.length === 0) return;

    // Get student name
    var userName = 'Técnico';
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      if (u.nombre) userName = u.nombre.split(' ')[0];
    } catch(e) { console.warn('[Desafio]', e.message || e); }

    // Build popup
    var overlay = document.createElement('div');
    overlay.id = 'dsCertNotifOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;animation:dsCertFadeIn .4s ease;';

    var html = '<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:28px 24px;max-width:440px;width:100%;text-align:center;border:2px solid #FFD700;max-height:90vh;overflow-y:auto;position:relative;">';

    // Confetti dots
    html += '<div style="position:absolute;top:0;left:0;right:0;height:60px;overflow:hidden;pointer-events:none;">';
    for (var i = 0; i < 20; i++) {
      var colors = ['#FFD700','#22c55e','#3b82f6','#f59e0b','#ec4899','#8b5cf6'];
      html += '<div style="position:absolute;width:6px;height:6px;border-radius:50%;background:' + colors[i % colors.length] + ';left:' + (Math.random()*100) + '%;top:' + (Math.random()*60) + 'px;opacity:0.7;"></div>';
    }
    html += '</div>';

    html += '<div style="font-size:50px;margin-bottom:8px;">🏅</div>';
    html += '<div style="color:#FFD700;font-size:22px;font-weight:800;margin-bottom:4px;">¡' + _dsEsc(userName) + '!</div>';

    if (unseen.length === 1) {
      var c = unseen[0];
      html += '<div style="color:#e2e8f0;font-size:15px;margin-bottom:16px;">¡Tienes un certificado listo!</div>';
      html += '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.25);border-radius:12px;padding:16px;margin-bottom:16px;">';
      html += '<div style="font-size:28px;margin-bottom:4px;">' + (CORRIDA_ICONS[c.corrida - 1] || '🏅') + '</div>';
      html += '<div style="color:#FFD700;font-weight:700;font-size:16px;">Corrida ' + c.corrida + ': ' + (CORRIDA_NAMES[c.corrida - 1] || '') + '</div>';
      html += '<div style="color:#e2e8f0;font-size:14px;">Nivel ' + c.nivel + ' — ' + Math.round(c.porcentaje) + '%</div>';
      html += '</div>';
    } else {
      html += '<div style="color:#e2e8f0;font-size:15px;margin-bottom:16px;">¡Tienes <strong style="color:#FFD700;">' + unseen.length + ' certificados</strong> listos!</div>';
      html += '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">';
      unseen.forEach(function(c) {
        html += '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:12px;text-align:left;">';
        html += '<div style="font-size:24px;">' + (CORRIDA_ICONS[c.corrida - 1] || '🏅') + '</div>';
        html += '<div><div style="color:#FFD700;font-weight:700;font-size:14px;">C' + c.corrida + ': ' + (CORRIDA_NAMES[c.corrida - 1] || '') + ' — Nivel ' + c.nivel + '</div>';
        html += '<div style="color:#e2e8f0;font-size:13px;">' + Math.round(c.porcentaje) + '% de puntuación</div></div>';
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<div style="color:#e2e8f0;font-size:14px;margin-bottom:16px;">Puedes imprimir y compartir tus certificados de nivel desde el <strong style="color:#ffffff;">Desafío Maestro HVACR</strong></div>';

    // Buttons
    html += '<button id="dsCertNotifGoBtn" style="width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;margin-bottom:8px;">🎯 Ir al Desafío</button>';
    html += '<button id="dsCertNotifCloseBtn" style="width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;cursor:pointer;background:rgba(255,255,255,0.12);color:#e2e8f0;">Después</button>';

    html += '</div>';
    overlay.innerHTML = html;

    // Inject animation CSS
    if (!document.getElementById('dsCertNotifCSS')) {
      var style = document.createElement('style');
      style.id = 'dsCertNotifCSS';
      style.textContent = '@keyframes dsCertFadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    // Mark all as seen
    unseen.forEach(function(c) { seen.push(c.certificate_id); });
    localStorage.setItem(seenKey, JSON.stringify(seen));

    // Event handlers
    document.getElementById('dsCertNotifGoBtn').addEventListener('click', function() {
      overlay.remove();
      if (typeof showScreen === 'function') showScreen('desafioScreen');
      if (typeof loadDesafio === 'function') loadDesafio();
    });
    document.getElementById('dsCertNotifCloseBtn').addEventListener('click', function() {
      overlay.remove();
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
  };

})();
