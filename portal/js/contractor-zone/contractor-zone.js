// ============================================
// ZONA DE CONTRATISTAS — Maestro HVACR
// Prep CSLB Licenses (Law, C-20, C-10, C-38)
// + Business Academy shell (12 bloques)
// + Calculadora "¿Estás haciendo dinero?"
// Tier: $99.99/mo (contractor+)
// ============================================

(function() {
  'use strict';

  // ── Exam registry ─────────────────────────────
  var EXAMS = {
    law: { id:'law', name:'California Law & Business', icon:'⚖️', bank:'CONTRACTOR_QUESTIONS_LAW', color:'#FFE9B0', borderColor:'#E8C97A', bgColor:'linear-gradient(135deg,#8B6B20 0%,#6B4E1A 100%)', passScore:73, mockSize:115, mockMinutes:210 },
    c20: { id:'c20', name:'C-20 HVAC', icon:'❄️', bank:'CONTRACTOR_QUESTIONS_C20', color:'#E0F2FE', borderColor:'#7DD3FC', bgColor:'linear-gradient(135deg,#0C4A6E 0%,#082F4D 100%)', passScore:73, mockSize:115, mockMinutes:210 },
    c38: { id:'c38', name:'C-38 Refrigeration', icon:'🧊', bank:'CONTRACTOR_QUESTIONS_C38', color:'#DBEAFE', borderColor:'#60A5FA', bgColor:'linear-gradient(135deg,#1E3A8A 0%,#152C6D 100%)', passScore:73, mockSize:100, mockMinutes:180 },
    c10: { id:'c10', name:'C-10 Electrical', icon:'⚡', bank:'CONTRACTOR_QUESTIONS_C10', color:'#FEF3C7', borderColor:'#F59E0B', bgColor:'linear-gradient(135deg,#78350F 0%,#5C2810 100%)', passScore:73, mockSize:100, mockMinutes:180 }
  };

  // ── 12 Business Academy bloques (from ACVOLT Business Academy) ─
  var BLOQUES = [
    { n:1,  title:'Fundamentos Técnicos',     sub:'Manual J/S/D, BPI, dealer',          icon:'📐', status:'active' },
    { n:2,  title:'Legal y Compliance',       sub:'CSLB, bond, seguros, permits',       icon:'⚖️', status:'active' },
    { n:3,  title:'Contratos y Cobranza',     sub:'Residencial, comercial, liens',      icon:'📝', status:'active' },
    { n:4,  title:'Finanzas y Cash Flow',     sub:'QuickBooks, payroll, crédito',       icon:'💰', status:'active' },
    { n:5,  title:'Contratación y Filtrado',  sub:'OSHA 10, EPA 608, E-Verify',         icon:'🔍', status:'active' },
    { n:6,  title:'Empleados: Legal',         sub:'W2 vs 1099, AB5, at-will',           icon:'👥', status:'active' },
    { n:7,  title:'Beneficios y Retención',   sub:'Health, 401k, PTO, cultura',         icon:'🎯', status:'active' },
    { n:8,  title:'Seguridad y OSHA',         sub:'Toolbox talks, multas, PPE',         icon:'🦺', status:'active' },
    { n:9,  title:'EPA, Código, Drogas',      sub:'Section 608, NEC, drug testing',     icon:'🌿', status:'active' },
    { n:10, title:'Pricing y Ventas',         sub:'Markup, flat rate, ¿haces dinero?',  icon:'💵', status:'active' },
    { n:11, title:'Marketing y Membresías',   sub:'Branding, financing, referrals',     icon:'📣', status:'active' },
    { n:12, title:'Crecimiento y Exit',       sub:'Escalar, valuación, legado',         icon:'🚀', status:'active' },
    { n:13, title:'Solar y Backup',           sub:'PV, grid-tie, off-grid, gens',       icon:'☀️', status:'active' }
  ];

  // ── State ─────────────────────────────────────
  var _state = {
    mode: 'hub',         // hub, examMenu, practice, flashcards, mock, mockResult, calc, academy, cslbKit, templates, templateEditor
    examId: null,
    questions: [],
    index: 0,
    correct: 0,
    wrong: 0,
    answered: false,
    selected: null,
    flashFlipped: false,
    mockAnswers: [],
    mockStart: null,
    mockEnd: null,
    mockTimer: null,
    mockFinished: false,
    bloqueN: null,
    kitExpandedPhase: null,
    kitExpandedStep: null,
    templateId: null,
    templateValues: {}
  };

  // ── Helpers ───────────────────────────────────
  function _esc(s) { if (s == null) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }
  function _t(k, fb) { try { if (typeof window._t === 'function') { var v = window._t(k, null); if (v != null && v !== k) return v; } } catch(e) {} return fb; }
  function _shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // Normalize question format (handles both {q,options:[]} and {question,options:{a,b,c,d}})
  function _normalizeQ(q, examId, idx) {
    var text = q.question || q.q || '';
    var opts = [];
    var correctIdx = 0;
    if (Array.isArray(q.options)) {
      opts = q.options.slice();
      correctIdx = typeof q.correct === 'number' ? q.correct : 0;
    } else if (q.options && typeof q.options === 'object') {
      var keys = ['a','b','c','d'];
      for (var i = 0; i < keys.length; i++) opts.push(q.options[keys[i]] || '');
      correctIdx = keys.indexOf(String(q.correct || 'a').toLowerCase());
      if (correctIdx < 0) correctIdx = 0;
    }
    return {
      id: q.id || (examId + '-' + (idx + 1)),
      category: q.category || q.categoria || '',
      difficulty: q.difficulty || 'medium',
      question: text,
      options: opts,
      correct: correctIdx,
      explanation: q.explanation || q.explicacion || '',
      reference: q.reference || q.ref || ''
    };
  }

  function _getBank(examId) {
    var cfg = EXAMS[examId];
    if (!cfg) return [];
    var raw = window[cfg.bank];
    if (!Array.isArray(raw)) return [];
    var out = [];
    for (var i = 0; i < raw.length; i++) out.push(_normalizeQ(raw[i], examId, i));
    return out;
  }

  function _progKey(examId) { return 'cz_progress_' + examId; }
  function _getProgress(examId) {
    try { return JSON.parse(localStorage.getItem(_progKey(examId))) || { attempted:0, correct:0, byCategory:{}, mockScores:[] }; }
    catch(e) { return { attempted:0, correct:0, byCategory:{}, mockScores:[] }; }
  }
  function _saveProgress(examId, p) { try { localStorage.setItem(_progKey(examId), JSON.stringify(p)); } catch(e) {} }

  // ── Translations ──────────────────────────────
  var _i18nRegistered = false;
  function _regI18n() {
    if (_i18nRegistered) return;
    if (typeof window._addTranslations !== 'function') return;
    _i18nRegistered = true;
    window._addTranslations({
      cz_title: { es: 'Zona de Contratistas', en: 'Contractor Zone' },
      cz_card_title: { es: 'Zona de Contratistas', en: 'Contractor Zone' },
      cz_card_sub: { es: '603 preguntas · Law/C-20/C-10/C-38 · 12 Bloques · CSLB Kit · Calculadora', en: '603 questions · Law/C-20/C-10/C-38 · 12 Modules · CSLB Kit · Calculator' },
      cz_card_badge_new: { es: 'NUEVO', en: 'NEW' },
      cz_back: { es: 'Volver', en: 'Back' },
      cz_tagline: { es: 'De técnico a contratista — el camino completo', en: 'From tech to contractor — the full path' },
      cz_sec_prep: { es: '📘 Prep de Licencia CSLB', en: '📘 CSLB License Prep' },
      cz_sec_calc: { es: '🧮 Calculadoras', en: '🧮 Calculators' },
      cz_sec_acad: { es: '🏢 Business Academy', en: '🏢 Business Academy' },
      cz_practice: { es: 'Practicar', en: 'Practice' },
      cz_flash: { es: 'Flashcards', en: 'Flashcards' },
      cz_mock: { es: 'Examen Simulado', en: 'Mock Exam' },
      cz_soon: { es: 'Próximamente', en: 'Coming Soon' },
      cz_disclaimer: {
        es: 'Preguntas de estudio basadas en los content outlines públicos de CSLB. NO son las preguntas reales del examen. Estudiar con este banco no garantiza aprobar.',
        en: 'Study questions based on public CSLB content outlines. NOT actual exam questions. Studying does not guarantee passing.'
      }
    });
  }

  // ═══════════════════════════════════════════════
  // MAIN DISPATCHER
  // ═══════════════════════════════════════════════
  window.initContractorZone = function() {
    _regI18n();
    var screen = document.getElementById('contractorZoneScreen');
    if (!screen) return;
    _state.mode = 'hub';
    _render(screen);
  };

  function _render(screen) {
    if (_state.mode === 'hub') return _renderHub(screen);
    if (_state.mode === 'examMenu') return _renderExamMenu(screen);
    if (_state.mode === 'practice') return _renderPractice(screen);
    if (_state.mode === 'flashcards') return _renderFlashcards(screen);
    if (_state.mode === 'mock') return _renderMock(screen);
    if (_state.mode === 'mockResult') return _renderMockResult(screen);
    if (_state.mode === 'calc') return _renderCalculator(screen);
    if (_state.mode === 'academy') return _renderAcademy(screen);
    if (_state.mode === 'academyBloque') return _renderAcademyBloque(screen);
    if (_state.mode === 'cslbKit') return _renderCslbKit(screen);
    if (_state.mode === 'templates') return _renderTemplates(screen);
    if (_state.mode === 'templateEditor') return _renderTemplateEditor(screen);
  }

  // ═══════════════════════════════════════════════
  // HUB — Main landing
  // ═══════════════════════════════════════════════
  function _renderHub(screen) {
    var h = '';
    h += _header(_t('cz_title','Zona de Contratistas'), null, true);
    h += '<div style="padding:16px 14px 200px;background:#0a1628;min-height:calc(100vh - 70px);">';

    // Hero tagline — SOLID gold gradient, premium
    h += '<div style="margin:0 0 22px;padding:20px 22px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 55%,#A88A42 100%);border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.25);">';
    h += '<div style="color:#0a1628;font-size:11px;font-weight:900;letter-spacing:1.8px;">CAMINO AL CONTRATISTA</div>';
    h += '<div style="color:#0a1628;font-size:19px;font-weight:900;margin-top:7px;line-height:1.3;letter-spacing:-0.01em;">'+_t('cz_tagline','De técnico a contratista — el camino completo')+'</div>';
    h += '</div>';

    // Section: Prep de Licencia
    h += '<div style="color:#FFFFFF;font-size:17px;font-weight:900;margin:22px 0 12px;letter-spacing:-0.01em;">'+_t('cz_sec_prep','📘 Prep de Licencia CSLB')+'</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:11px;">';
    var order = ['law','c20','c38','c10'];
    for (var i = 0; i < order.length; i++) {
      var e = EXAMS[order[i]];
      var prog = _getProgress(e.id);
      var bank = _getBank(e.id);
      var pctSeen = bank.length > 0 ? Math.min(100, Math.round(prog.attempted / bank.length * 100)) : 0;
      h += '<div onclick="_czNav(\'examMenu\',\''+e.id+'\')" style="cursor:pointer;padding:16px 14px;background:'+e.bgColor+';border:2px solid '+e.borderColor+';border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += '<div style="font-size:30px;line-height:1;">'+e.icon+'</div>';
      h += '<div style="color:#FFFFFF;font-size:14px;font-weight:900;margin-top:8px;line-height:1.25;">'+_esc(e.name)+'</div>';
      h += '<div style="color:'+e.color+';font-size:12px;font-weight:800;margin-top:4px;">'+bank.length+' preguntas</div>';
      h += '<div style="margin-top:10px;height:6px;background:rgba(0,0,0,0.35);border-radius:3px;overflow:hidden;"><div style="height:100%;width:'+pctSeen+'%;background:'+e.borderColor+';"></div></div>';
      h += '<div style="color:#FFFFFF;font-size:12px;font-weight:700;margin-top:6px;">'+prog.attempted+' / '+bank.length+' vistas</div>';
      h += '</div>';
    }
    h += '</div>';

    // Section: Calculadora — SOLID emerald
    h += '<div style="color:#FFFFFF;font-size:17px;font-weight:900;margin:26px 0 12px;letter-spacing:-0.01em;">'+_t('cz_sec_calc','🧮 Calculadoras')+'</div>';
    h += '<div onclick="_czNav(\'calc\')" style="cursor:pointer;padding:18px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #10B981;border-radius:14px;display:flex;align-items:center;gap:14px;box-shadow:0 6px 20px rgba(5,150,105,0.3);">';
    h += '<div style="font-size:34px;">💰</div>';
    h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:16px;font-weight:900;letter-spacing:-0.01em;">¿Estás haciendo dinero?</div>';
    h += '<div style="color:#BBF7D0;font-size:13px;font-weight:700;margin-top:4px;">Calcula tu ganancia real por job — overhead incluido</div></div>';
    h += '<div style="color:#FFFFFF;font-size:24px;font-weight:900;">›</div>';
    h += '</div>';

    // Jornal Pro tile moved to main dashboard (R-22 green pill between lang toggle and weather)

    // Section: CSLB Application Kit — SOLID gold
    h += '<div style="color:#FFFFFF;font-size:17px;font-weight:900;margin:26px 0 12px;letter-spacing:-0.01em;">🗂️ CSLB Application Kit</div>';
    var _kitPctHub = _kitProgressPct();
    h += '<div onclick="_czOpenCslbKit()" style="cursor:pointer;padding:18px;background:linear-gradient(135deg,#8B6B20 0%,#A88A42 55%,#C9A961 100%);border:2px solid #E8C97A;border-radius:14px;box-shadow:0 6px 20px rgba(201,169,97,0.3);">';
    h += '<div style="display:flex;align-items:center;gap:14px;">';
    h += '<div style="font-size:34px;">🗂️</div>';
    h += '<div style="flex:1;min-width:0;">';
    h += '<div style="color:#FFFFFF;font-size:16px;font-weight:900;line-height:1.25;letter-spacing:-0.01em;">CSLB Application Kit</div>';
    h += '<div style="color:#FFF4D6;font-size:13px;font-weight:700;margin-top:4px;line-height:1.35;">De aplicación a licencia — 6 fases, paso a paso</div>';
    h += '</div>';
    h += '<div style="color:#FFFFFF;font-size:24px;font-weight:900;">›</div>';
    h += '</div>';
    h += '<div style="margin-top:14px;display:flex;align-items:center;gap:10px;">';
    h += '<div style="flex:1;height:8px;background:rgba(0,0,0,0.35);border-radius:4px;overflow:hidden;"><div style="height:100%;width:'+_kitPctHub+'%;background:#FFFFFF;"></div></div>';
    h += '<div style="color:#FFFFFF;font-size:12px;font-weight:900;">'+_kitPctHub+'% completado</div>';
    h += '</div>';
    h += '</div>';

    // Section: Plantillas de Contratos — SOLID teal
    h += '<div style="color:#FFFFFF;font-size:17px;font-weight:900;margin:26px 0 12px;letter-spacing:-0.01em;">📄 Plantillas de Contratos</div>';
    h += '<div onclick="_czNav(\'templates\')" style="cursor:pointer;padding:18px;background:linear-gradient(135deg,#0F766E 0%,#0D9488 55%,#14B8A6 100%);border:2px solid #2DD4BF;border-radius:14px;display:flex;align-items:center;gap:14px;box-shadow:0 6px 20px rgba(20,184,166,0.3);">';
    h += '<div style="font-size:34px;">📄</div>';
    h += '<div style="flex:1;min-width:0;">';
    h += '<div style="color:#FFFFFF;font-size:16px;font-weight:900;line-height:1.25;letter-spacing:-0.01em;">Plantillas de Contratos</div>';
    h += '<div style="color:#CCFBF1;font-size:13px;font-weight:700;margin-top:4px;line-height:1.35;">5 plantillas CA-compliant listas para imprimir</div>';
    h += '</div>';
    h += '<div style="color:#FFFFFF;font-size:24px;font-weight:900;">›</div>';
    h += '</div>';

    // Section: Business Academy — SOLID deep navy with gold trim
    h += '<div style="color:#FFFFFF;font-size:17px;font-weight:900;margin:26px 0 12px;letter-spacing:-0.01em;">'+_t('cz_sec_acad','🏢 Business Academy')+'</div>';
    h += '<div style="color:#E8C97A;font-size:13px;font-weight:700;margin:0 0 12px;">12 bloques · 52 semanas · el programa completo del dueño</div>';
    h += '<div onclick="_czNav(\'academy\')" style="cursor:pointer;padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;display:flex;align-items:center;gap:14px;box-shadow:0 6px 20px rgba(27,40,69,0.5);">';
    h += '<div style="font-size:32px;">🏛️</div>';
    h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:16px;font-weight:900;letter-spacing:-0.01em;">Ver los 12 bloques</div>';
    h += '<div style="color:#E8C97A;font-size:13px;font-weight:700;margin-top:4px;">Del técnico auto-empleado al dueño de empresa</div></div>';
    h += '<div style="color:#E8C97A;font-size:24px;font-weight:900;">›</div>';
    h += '</div>';

    // Disclaimer — SOLID amber
    h += '<div style="margin-top:24px;padding:14px 16px;background:linear-gradient(135deg,#78350F 0%,#5C2810 100%);border:2px solid #F59E0B;border-radius:12px;">';
    h += '<div style="color:#FDE68A;font-size:11px;font-weight:900;letter-spacing:1.2px;">⚠️ AVISO LEGAL</div>';
    h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;margin-top:5px;line-height:1.5;">'+_esc(_t('cz_disclaimer','Preguntas de estudio basadas en los content outlines públicos de CSLB. NO son las preguntas reales del examen. Estudiar con este banco no garantiza aprobar.'))+'</div>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  // ═══════════════════════════════════════════════
  // EXAM MENU — Choose study mode
  // ═══════════════════════════════════════════════
  function _renderExamMenu(screen) {
    var e = EXAMS[_state.examId];
    if (!e) { _state.mode = 'hub'; return _render(screen); }
    var bank = _getBank(e.id);
    var prog = _getProgress(e.id);
    var bestMock = prog.mockScores && prog.mockScores.length > 0 ? Math.max.apply(null, prog.mockScores.map(function(s){return s.pct;})) : null;

    var h = '';
    h += _header(e.name, 'hub', false);
    h += '<div style="padding:16px 14px 200px;background:#0a1628;min-height:calc(100vh - 70px);">';

    // Hero — SOLID exam-color gradient
    h += '<div style="padding:20px;background:'+e.bgColor+';border:2px solid '+e.borderColor+';border-radius:16px;box-shadow:0 8px 28px rgba(0,0,0,0.35);">';
    h += '<div style="font-size:42px;line-height:1;">'+e.icon+'</div>';
    h += '<div style="color:#FFFFFF;font-size:20px;font-weight:900;margin-top:8px;letter-spacing:-0.01em;">'+_esc(e.name)+'</div>';
    h += '<div style="display:flex;gap:18px;margin-top:14px;flex-wrap:wrap;">';
    h += '<div><div style="color:'+e.color+';font-size:10px;font-weight:900;letter-spacing:1.2px;">BANCO</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;">'+bank.length+'</div></div>';
    h += '<div><div style="color:'+e.color+';font-size:10px;font-weight:900;letter-spacing:1.2px;">EXAMEN</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;">'+e.mockSize+' Qs</div></div>';
    h += '<div><div style="color:'+e.color+';font-size:10px;font-weight:900;letter-spacing:1.2px;">TIEMPO</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;">'+Math.round(e.mockMinutes/60*10)/10+' hr</div></div>';
    h += '<div><div style="color:'+e.color+';font-size:10px;font-weight:900;letter-spacing:1.2px;">PASAR</div><div style="color:#FFFFFF;font-size:19px;font-weight:900;">'+e.passScore+'%</div></div>';
    h += '</div>';
    if (bestMock != null) {
      h += '<div style="margin-top:12px;padding:10px 12px;background:rgba(0,0,0,0.4);border-radius:8px;"><span style="color:'+e.color+';font-size:12px;font-weight:900;">MEJOR MOCK:</span> <span style="color:#FFFFFF;font-size:15px;font-weight:900;">'+bestMock+'%</span></div>';
    }
    h += '</div>';

    // Mode cards
    h += '<div style="margin-top:14px;display:grid;gap:10px;">';
    h += _modeCard('practice', '🎯', 'Practicar', 'Pregunta por pregunta con explicación y código', e.color);
    h += _modeCard('flashcards', '🃏', 'Flashcards', 'Memoriza códigos, fechas y montos clave', e.color);
    h += _modeCard('mock', '📝', 'Examen Simulado', e.mockSize+' preguntas · '+Math.round(e.mockMinutes/60*10)/10+' hr · '+e.passScore+'% pasar', e.color);
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  function _modeCard(mode, icon, title, sub, color) {
    return '<div onclick="_czNav(\''+mode+'\')" style="cursor:pointer;padding:16px 18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid '+color+';border-radius:12px;display:flex;align-items:center;gap:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">'+
      '<div style="font-size:32px;line-height:1;">'+icon+'</div>'+
      '<div style="flex:1;"><div style="color:#FFFFFF;font-size:16px;font-weight:900;letter-spacing:-0.01em;">'+title+'</div>'+
      '<div style="color:#E0E7F2;font-size:13px;font-weight:600;margin-top:4px;line-height:1.4;">'+_esc(sub)+'</div></div>'+
      '<div style="color:'+color+';font-size:26px;font-weight:900;">›</div></div>';
  }

  // ═══════════════════════════════════════════════
  // PRACTICE MODE
  // ═══════════════════════════════════════════════
  function _startPractice() {
    var bank = _getBank(_state.examId);
    _state.questions = _shuffle(bank);
    _state.index = 0;
    _state.correct = 0;
    _state.wrong = 0;
    _state.answered = false;
    _state.selected = null;
  }

  function _renderPractice(screen) {
    if (_state.questions.length === 0) _startPractice();
    var e = EXAMS[_state.examId];
    var q = _state.questions[_state.index];
    if (!q) { _state.mode = 'examMenu'; return _render(screen); }

    var h = '';
    h += _header('Practicar — '+e.name, 'examMenu', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    // Progress bar
    var pct = Math.round(((_state.index + (_state.answered ? 1 : 0)) / _state.questions.length) * 100);
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">';
    h += '<div style="flex:1;height:10px;background:#1B2845;border:1px solid #3A4E7C;border-radius:5px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#C9A961,#F5D58A);transition:width 0.25s;"></div></div>';
    h += '<div style="color:#F5D58A;font-size:13px;font-weight:900;">'+(_state.index+1)+' / '+_state.questions.length+'</div>';
    h += '</div>';
    h += '<div style="display:flex;gap:12px;margin-bottom:14px;">';
    h += '<div style="flex:1;padding:12px 10px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:10px;text-align:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);"><div style="color:#D1FAE5;font-size:11px;font-weight:900;letter-spacing:0.5px;">CORRECTAS</div><div style="color:#FFFFFF;font-size:20px;font-weight:900;margin-top:2px;">'+_state.correct+'</div></div>';
    h += '<div style="flex:1;padding:12px 10px;background:linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%);border:2px solid #FCA5A5;border-radius:10px;text-align:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);"><div style="color:#FECACA;font-size:11px;font-weight:900;letter-spacing:0.5px;">ERRADAS</div><div style="color:#FFFFFF;font-size:20px;font-weight:900;margin-top:2px;">'+_state.wrong+'</div></div>';
    h += '</div>';

    // Category + difficulty tag
    h += '<div style="margin-bottom:12px;">';
    h += '<span style="display:inline-block;padding:6px 10px;background:'+e.bgColor+';border:1.5px solid '+e.borderColor+';border-radius:7px;color:#FFFFFF;font-size:11px;font-weight:900;letter-spacing:0.5px;">'+_esc(q.category)+'</span>';
    var diffBg = q.difficulty === 'easy' ? 'linear-gradient(135deg,#065F46,#059669)' : q.difficulty === 'hard' ? 'linear-gradient(135deg,#7F1D1D,#B91C1C)' : 'linear-gradient(135deg,#78350F,#B45309)';
    h += '<span style="display:inline-block;margin-left:8px;padding:6px 10px;background:'+diffBg+';border-radius:7px;color:#FFFFFF;font-size:11px;font-weight:900;">'+(q.difficulty||'medium').toUpperCase()+'</span>';
    h += '</div>';

    // Question
    h += '<div style="padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;color:#FFFFFF;font-size:16px;font-weight:700;line-height:1.5;box-shadow:0 4px 14px rgba(0,0,0,0.35);">'+_esc(q.question)+'</div>';

    // Options
    h += '<div style="margin-top:14px;display:grid;gap:10px;">';
    for (var i = 0; i < q.options.length; i++) {
      var letter = String.fromCharCode(65 + i);
      var bg = 'linear-gradient(135deg,#1E293B 0%,#334155 100%)', border = '#64748B', color = '#FFFFFF', letterBg = '#0F172A';
      if (_state.answered) {
        if (i === q.correct) { bg = 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)'; border = '#34D399'; color = '#FFFFFF'; letterBg = '#064E3B'; }
        else if (i === _state.selected) { bg = 'linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)'; border = '#FCA5A5'; color = '#FFFFFF'; letterBg = '#450A0A'; }
      }
      var onclick = _state.answered ? '' : ' onclick="_czAnswer('+i+')"';
      var cursor = _state.answered ? 'default' : 'pointer';
      h += '<div'+onclick+' style="cursor:'+cursor+';padding:14px 16px;background:'+bg+';border:2px solid '+border+';border-radius:12px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 3px 10px rgba(0,0,0,0.25);">';
      h += '<div style="width:32px;height:32px;border-radius:50%;background:'+letterBg+';color:#FFFFFF;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid '+border+';">'+letter+'</div>';
      h += '<div style="flex:1;color:'+color+';font-size:15px;font-weight:700;line-height:1.45;">'+_esc(q.options[i])+'</div>';
      h += '</div>';
    }
    h += '</div>';

    // Explanation (after answering)
    if (_state.answered) {
      var isCorrect = _state.selected === q.correct;
      var boxBg = isCorrect ? 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)' : 'linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)';
      var boxBorder = isCorrect ? '#34D399' : '#FCA5A5';
      var boxIcon = isCorrect ? '✓ CORRECTO' : '✗ INCORRECTO';
      h += '<div style="margin-top:16px;padding:16px 18px;background:'+boxBg+';border:2px solid '+boxBorder+';border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
      h += '<div style="color:#FFFFFF;font-size:14px;font-weight:900;letter-spacing:1px;">'+boxIcon+'</div>';
      if (q.explanation) h += '<div style="color:#FFFFFF;font-size:14px;font-weight:600;margin-top:10px;line-height:1.55;">'+_esc(q.explanation)+'</div>';
      if (q.reference) h += '<div style="color:#FEF3C7;font-size:12px;font-weight:900;margin-top:10px;letter-spacing:0.5px;background:rgba(0,0,0,0.25);padding:6px 10px;border-radius:6px;display:inline-block;">📖 '+_esc(q.reference)+'</div>';
      h += '</div>';
      h += '<button onclick="_czNext()" style="margin-top:16px;width:100%;padding:16px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:12px;color:#1B1306;font-size:15px;font-weight:900;letter-spacing:0.8px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.4);">SIGUIENTE PREGUNTA →</button>';
    }

    h += '</div>';
    screen.innerHTML = h;
  }

  window._czAnswer = function(idx) {
    if (_state.answered) return;
    _state.answered = true;
    _state.selected = idx;
    var q = _state.questions[_state.index];
    if (idx === q.correct) _state.correct++;
    else _state.wrong++;

    // Persist progress
    var prog = _getProgress(_state.examId);
    prog.attempted = (prog.attempted || 0) + 1;
    if (idx === q.correct) prog.correct = (prog.correct || 0) + 1;
    prog.byCategory = prog.byCategory || {};
    var cat = q.category || 'otro';
    if (!prog.byCategory[cat]) prog.byCategory[cat] = { attempted:0, correct:0 };
    prog.byCategory[cat].attempted++;
    if (idx === q.correct) prog.byCategory[cat].correct++;
    _saveProgress(_state.examId, prog);

    _render(document.getElementById('contractorZoneScreen'));
  };

  window._czNext = function() {
    _state.index++;
    _state.answered = false;
    _state.selected = null;
    if (_state.index >= _state.questions.length) _state.index = 0;
    _render(document.getElementById('contractorZoneScreen'));
  };

  // ═══════════════════════════════════════════════
  // FLASHCARDS
  // ═══════════════════════════════════════════════
  function _startFlashcards() {
    var bank = _getBank(_state.examId);
    _state.questions = _shuffle(bank);
    _state.index = 0;
    _state.flashFlipped = false;
  }

  function _renderFlashcards(screen) {
    if (_state.questions.length === 0) _startFlashcards();
    var e = EXAMS[_state.examId];
    var q = _state.questions[_state.index];
    if (!q) { _state.mode = 'examMenu'; return _render(screen); }

    var h = '';
    h += _header('Flashcards — '+e.name, 'examMenu', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
    h += '<div style="color:#FFFFFF;font-size:13px;font-weight:800;">Carta '+(_state.index+1)+' de '+_state.questions.length+'</div>';
    h += '<div style="padding:6px 10px;background:'+e.bgColor+';border:1.5px solid '+e.borderColor+';border-radius:7px;color:#FFFFFF;font-size:11px;font-weight:900;letter-spacing:0.5px;">'+_esc(q.category)+'</div>';
    h += '</div>';

    // Flashcard — SOLID exam-color bg (no nested gradient)
    h += '<div onclick="_czFlip()" style="cursor:pointer;min-height:280px;padding:24px;background:'+e.bgColor+';border:3px solid '+e.borderColor+';border-radius:18px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,0.45);">';
    if (!_state.flashFlipped) {
      h += '<div style="color:'+e.color+';font-size:12px;font-weight:900;letter-spacing:1.8px;margin-bottom:12px;background:rgba(0,0,0,0.3);padding:5px 12px;border-radius:6px;">PREGUNTA</div>';
      h += '<div style="color:#FFFFFF;font-size:17px;font-weight:700;line-height:1.55;text-shadow:0 1px 2px rgba(0,0,0,0.5);">'+_esc(q.question)+'</div>';
      h += '<div style="color:#FFE9B0;font-size:12px;font-weight:800;margin-top:22px;background:rgba(0,0,0,0.3);padding:6px 12px;border-radius:8px;">👆 Toca para ver la respuesta</div>';
    } else {
      h += '<div style="color:#FFFFFF;font-size:12px;font-weight:900;letter-spacing:1.8px;margin-bottom:12px;background:linear-gradient(135deg,#065F46,#059669);padding:5px 12px;border-radius:6px;">✓ RESPUESTA CORRECTA</div>';
      var letter = String.fromCharCode(65 + q.correct);
      h += '<div style="color:#FFFFFF;font-size:17px;font-weight:700;line-height:1.55;text-shadow:0 1px 2px rgba(0,0,0,0.5);"><span style="color:#FFE9B0;font-weight:900;font-size:20px;">'+letter+'.</span> '+_esc(q.options[q.correct])+'</div>';
      if (q.explanation) h += '<div style="color:#FFFFFF;font-size:14px;font-weight:600;margin-top:16px;line-height:1.55;background:rgba(0,0,0,0.28);padding:12px 14px;border-radius:10px;">'+_esc(q.explanation)+'</div>';
      if (q.reference) h += '<div style="color:#FEF3C7;font-size:12px;font-weight:900;margin-top:12px;letter-spacing:0.5px;background:rgba(0,0,0,0.3);padding:6px 10px;border-radius:6px;">📖 '+_esc(q.reference)+'</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:18px;display:flex;gap:10px;">';
    h += '<button onclick="_czFlashPrev()" style="flex:1;padding:16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:12px;color:#FFFFFF;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.3);">← Anterior</button>';
    h += '<button onclick="_czFlashNext()" style="flex:1;padding:16px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:12px;color:#1B1306;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.4);">Siguiente →</button>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  window._czFlip = function() { _state.flashFlipped = !_state.flashFlipped; _render(document.getElementById('contractorZoneScreen')); };
  window._czFlashNext = function() { _state.index = (_state.index + 1) % _state.questions.length; _state.flashFlipped = false; _render(document.getElementById('contractorZoneScreen')); };
  window._czFlashPrev = function() { _state.index = (_state.index - 1 + _state.questions.length) % _state.questions.length; _state.flashFlipped = false; _render(document.getElementById('contractorZoneScreen')); };

  // ═══════════════════════════════════════════════
  // MOCK EXAM (timed)
  // ═══════════════════════════════════════════════
  function _startMock() {
    var e = EXAMS[_state.examId];
    var bank = _getBank(_state.examId);
    _state.questions = _shuffle(bank).slice(0, Math.min(e.mockSize, bank.length));
    _state.index = 0;
    _state.mockAnswers = new Array(_state.questions.length).fill(-1);
    _state.mockStart = Date.now();
    _state.mockEnd = _state.mockStart + (e.mockMinutes * 60 * 1000);
    _state.mockFinished = false;
    if (_state.mockTimer) clearInterval(_state.mockTimer);
    _state.mockTimer = setInterval(function() {
      if (_state.mockFinished) return;
      if (Date.now() >= _state.mockEnd) { _submitMock(); return; }
      var el = document.getElementById('czMockTimer');
      if (el) el.textContent = _fmtTimer(Math.max(0, _state.mockEnd - Date.now()));
    }, 1000);
  }

  function _fmtTimer(ms) {
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    function p(n) { return n < 10 ? '0'+n : ''+n; }
    return (h > 0 ? p(h)+':' : '') + p(m) + ':' + p(s);
  }

  function _renderMock(screen) {
    if (_state.questions.length === 0) _startMock();
    var e = EXAMS[_state.examId];
    var q = _state.questions[_state.index];
    if (!q) { _submitMock(); return; }

    var h = '';
    h += _header('Examen — '+e.name, 'examMenu', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    // Timer + progress
    h += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:14px 16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid '+e.borderColor+';border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
    h += '<div style="font-size:26px;">⏱️</div>';
    h += '<div style="flex:1;"><div style="color:#FFE9B0;font-size:11px;font-weight:900;letter-spacing:1px;">TIEMPO RESTANTE</div><div id="czMockTimer" style="color:#FFFFFF;font-size:20px;font-weight:900;font-family:monospace;text-shadow:0 1px 2px rgba(0,0,0,0.5);">'+_fmtTimer(Math.max(0, _state.mockEnd - Date.now()))+'</div></div>';
    h += '<button onclick="_czSubmitMock()" style="padding:10px 14px;background:linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%);border:2px solid #FCA5A5;border-radius:10px;color:#FFFFFF;font-size:12px;font-weight:900;cursor:pointer;letter-spacing:0.5px;box-shadow:0 3px 10px rgba(0,0,0,0.3);">TERMINAR</button>';
    h += '</div>';

    // Progress
    var answered = _state.mockAnswers.filter(function(x){return x >= 0;}).length;
    var pct = Math.round(answered / _state.questions.length * 100);
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">';
    h += '<div style="flex:1;height:10px;background:#1B2845;border:1px solid #3A4E7C;border-radius:5px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#C9A961,#F5D58A);"></div></div>';
    h += '<div style="color:#F5D58A;font-size:13px;font-weight:900;">'+(_state.index+1)+' / '+_state.questions.length+'</div>';
    h += '</div>';

    // Question
    h += '<div style="padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;color:#FFFFFF;font-size:16px;font-weight:700;line-height:1.5;box-shadow:0 4px 14px rgba(0,0,0,0.35);">'+_esc(q.question)+'</div>';

    // Options
    h += '<div style="margin-top:14px;display:grid;gap:10px;">';
    var selIdx = _state.mockAnswers[_state.index];
    for (var i = 0; i < q.options.length; i++) {
      var letter = String.fromCharCode(65 + i);
      var bg = 'linear-gradient(135deg,#1E293B 0%,#334155 100%)', border = '#64748B', color = '#FFFFFF', letterBg = '#0F172A';
      if (i === selIdx) { bg = e.bgColor; border = e.borderColor; color = '#FFFFFF'; letterBg = 'rgba(0,0,0,0.45)'; }
      h += '<div onclick="_czMockSelect('+i+')" style="cursor:pointer;padding:14px 16px;background:'+bg+';border:2px solid '+border+';border-radius:12px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 3px 10px rgba(0,0,0,0.25);">';
      h += '<div style="width:32px;height:32px;border-radius:50%;background:'+letterBg+';color:#FFFFFF;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid '+border+';">'+letter+'</div>';
      h += '<div style="flex:1;color:'+color+';font-size:15px;font-weight:700;line-height:1.45;">'+_esc(q.options[i])+'</div>';
      h += '</div>';
    }
    h += '</div>';

    // Nav
    h += '<div style="margin-top:18px;display:flex;gap:10px;">';
    var prevDisabled = _state.index === 0;
    h += '<button onclick="_czMockPrev()" '+(prevDisabled?'disabled':'')+' style="flex:1;padding:16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:12px;color:#FFFFFF;font-size:14px;font-weight:900;cursor:'+(prevDisabled?'not-allowed':'pointer')+';opacity:'+(prevDisabled?'0.4':'1')+';box-shadow:0 3px 10px rgba(0,0,0,0.3);">← Anterior</button>';
    var isLast = _state.index === _state.questions.length - 1;
    h += '<button onclick="'+(isLast ? '_czSubmitMock()' : '_czMockNext()')+'" style="flex:1;padding:16px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:12px;color:#1B1306;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.4);">'+(isLast ? 'ENVIAR →' : 'Siguiente →')+'</button>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  window._czMockSelect = function(i) { _state.mockAnswers[_state.index] = i; _render(document.getElementById('contractorZoneScreen')); };
  window._czMockNext = function() { if (_state.index < _state.questions.length - 1) { _state.index++; _render(document.getElementById('contractorZoneScreen')); } };
  window._czMockPrev = function() { if (_state.index > 0) { _state.index--; _render(document.getElementById('contractorZoneScreen')); } };
  window._czSubmitMock = function() { _submitMock(); };

  function _submitMock() {
    var e = EXAMS[_state.examId];
    _state.mockFinished = true;
    if (_state.mockTimer) { clearInterval(_state.mockTimer); _state.mockTimer = null; }
    var correct = 0;
    var byCategory = {};
    for (var i = 0; i < _state.questions.length; i++) {
      var q = _state.questions[i];
      var a = _state.mockAnswers[i];
      var c = q.category || 'otro';
      if (!byCategory[c]) byCategory[c] = { attempted:0, correct:0 };
      byCategory[c].attempted++;
      if (a === q.correct) { correct++; byCategory[c].correct++; }
    }
    var pct = Math.round(correct / _state.questions.length * 100);
    var prog = _getProgress(_state.examId);
    prog.mockScores = prog.mockScores || [];
    prog.mockScores.push({ pct: pct, correct: correct, total: _state.questions.length, date: new Date().toISOString(), byCategory: byCategory });
    if (prog.mockScores.length > 20) prog.mockScores = prog.mockScores.slice(-20);
    _saveProgress(_state.examId, prog);
    _state.mockResult = { pct: pct, correct: correct, total: _state.questions.length, byCategory: byCategory };
    _state.mode = 'mockResult';
    _render(document.getElementById('contractorZoneScreen'));
  }

  function _renderMockResult(screen) {
    var e = EXAMS[_state.examId];
    var r = _state.mockResult || { pct:0, correct:0, total:0, byCategory:{} };
    var passed = r.pct >= e.passScore;

    var h = '';
    h += _header('Resultado', 'examMenu', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    // Verdict
    var vBg = passed ? 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)' : 'linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)';
    var vBorder = passed ? '#34D399' : '#FCA5A5';
    h += '<div style="padding:26px 22px;background:'+vBg+';border:3px solid '+vBorder+';border-radius:18px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,0.45);">';
    h += '<div style="font-size:56px;">'+(passed?'🎉':'📚')+'</div>';
    h += '<div style="color:#FFFFFF;font-size:14px;font-weight:900;letter-spacing:2px;margin-top:8px;background:rgba(0,0,0,0.3);display:inline-block;padding:6px 14px;border-radius:8px;">'+(passed?'¡APROBADO!':'NECESITAS MÁS PRÁCTICA')+'</div>';
    h += '<div style="color:#FFFFFF;font-size:56px;font-weight:900;margin-top:12px;text-shadow:0 2px 4px rgba(0,0,0,0.5);">'+r.pct+'%</div>';
    h += '<div style="color:#FFFFFF;font-size:15px;font-weight:800;margin-top:6px;">'+r.correct+' de '+r.total+' correctas</div>';
    h += '<div style="color:#FFE9B0;font-size:12px;font-weight:900;margin-top:8px;letter-spacing:0.5px;">Mínimo para aprobar: '+e.passScore+'%</div>';
    h += '</div>';

    // By category
    h += '<div style="margin-top:20px;padding:20px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
    h += '<div style="color:#FFE9B0;font-size:14px;font-weight:900;margin-bottom:14px;letter-spacing:0.8px;">📊 POR CATEGORÍA</div>';
    var cats = Object.keys(r.byCategory);
    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i], cr = r.byCategory[cat];
      var cpct = Math.round(cr.correct / cr.attempted * 100);
      var catColor = cpct >= e.passScore ? '#34D399' : cpct >= 50 ? '#FDE047' : '#FCA5A5';
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;"><span style="color:#FFFFFF;">'+_esc(cat)+'</span><span style="color:'+catColor+';">'+cr.correct+'/'+cr.attempted+' · '+cpct+'%</span></div>';
      h += '<div style="margin-top:6px;height:8px;background:#0F1D32;border:1px solid #3A4E7C;border-radius:4px;overflow:hidden;"><div style="height:100%;width:'+cpct+'%;background:'+catColor+';"></div></div>';
      h += '</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:20px;display:grid;gap:12px;">';
    h += '<button onclick="_czNav(\'mock\')" style="padding:16px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:12px;color:#1B1306;font-size:15px;font-weight:900;cursor:pointer;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(0,0,0,0.4);">🔄 NUEVO EXAMEN</button>';
    h += '<button onclick="_czNav(\'practice\')" style="padding:16px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:12px;color:#FFFFFF;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.35);">🎯 Practicar Áreas Débiles</button>';
    h += '<button onclick="_czNav(\'examMenu\')" style="padding:14px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:1.5px solid #C9A961;border-radius:10px;color:#FFE9B0;font-size:13px;font-weight:800;cursor:pointer;">← Volver al menú</button>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  // ═══════════════════════════════════════════════
  // CALCULADORA "¿ESTÁS HACIENDO DINERO?"
  // ═══════════════════════════════════════════════
  var _calcDefaults = {
    ticket: 8500,        // Lo que cobras al cliente
    material: 3200,      // Costo de equipo + material
    laborHours: 14,      // Horas de mano de obra real
    laborRate: 35,       // $/hr del técnico
    laborBurden: 28,     // % extra por workers comp + taxes
    permit: 250,         // Permits
    hers: 150,           // HERS rating
    jobsPerMonth: 8,     // Jobs por mes
    // Overhead mensual:
    cslbAnnual: 435,     // CSLB annual
    bondAnnual: 200,     // Bond annual
    glMonthly: 200,      // General Liability
    wcMonthly: 300,      // Workers Comp (base fee)
    truckMonthly: 800,   // Truck + gas + insurance
    phoneMonthly: 150,   // Phone + software
    rentMonthly: 0,      // Shop/office rent (opt)
    accountingMonthly: 150, // QuickBooks + CPA
    otherMonthly: 200    // Advertising + misc
  };

  function _getCalcState() {
    try {
      var s = JSON.parse(localStorage.getItem('cz_calc_state'));
      if (s && typeof s === 'object') return Object.assign({}, _calcDefaults, s);
    } catch(e) {}
    return Object.assign({}, _calcDefaults);
  }

  function _saveCalcState(s) { try { localStorage.setItem('cz_calc_state', JSON.stringify(s)); } catch(e) {} }

  function _calcResult(s) {
    var revenue = +s.ticket || 0;
    var material = +s.material || 0;
    var labor = (+s.laborHours || 0) * (+s.laborRate || 0) * (1 + (+s.laborBurden || 0) / 100);
    var permits = (+s.permit || 0) + (+s.hers || 0);

    // Monthly overhead total
    var monthlyOverhead = (+s.cslbAnnual / 12) + (+s.bondAnnual / 12) + (+s.glMonthly) + (+s.wcMonthly) +
                          (+s.truckMonthly) + (+s.phoneMonthly) + (+s.rentMonthly) + (+s.accountingMonthly) + (+s.otherMonthly);
    var overheadPerJob = monthlyOverhead / (Math.max(1, +s.jobsPerMonth));

    var totalCost = material + labor + permits + overheadPerJob;
    var profit = revenue - totalCost;
    var margin = revenue > 0 ? (profit / revenue * 100) : 0;
    var effectiveHourly = (+s.laborHours > 0) ? (profit / +s.laborHours) : 0;
    var markupOnMaterial = material > 0 ? (revenue / material) : 0;

    var verdict = 'red', verdictText = 'PIERDES DINERO', verdictEmoji = '🚨';
    if (margin >= 25) { verdict = 'green'; verdictText = 'EXCELENTE MARGEN'; verdictEmoji = '🔥'; }
    else if (margin >= 15) { verdict = 'gold'; verdictText = 'MARGEN SALUDABLE'; verdictEmoji = '✅'; }
    else if (margin >= 8) { verdict = 'yellow'; verdictText = 'MARGEN AJUSTADO'; verdictEmoji = '⚠️'; }
    else if (margin >= 0) { verdict = 'orange'; verdictText = 'CASI NO GANAS'; verdictEmoji = '😬'; }

    return {
      revenue: revenue, material: material, labor: labor, permits: permits,
      monthlyOverhead: monthlyOverhead, overheadPerJob: overheadPerJob,
      totalCost: totalCost, profit: profit, margin: margin,
      effectiveHourly: effectiveHourly, markupOnMaterial: markupOnMaterial,
      verdict: verdict, verdictText: verdictText, verdictEmoji: verdictEmoji
    };
  }

  function _fmt$(n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function _fmtPct(n) { return (Math.round(n * 10) / 10) + '%'; }

  function _renderCalculator(screen) {
    var s = _getCalcState();
    var r = _calcResult(s);

    var vColors = {
      green: { bg:'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)', border:'#10B981', fg:'#BBF7D0' },
      gold:  { bg:'linear-gradient(135deg,#8B6B20 0%,#A88A42 55%,#C9A961 100%)', border:'#E8C97A', fg:'#FEF3C7' },
      yellow:{ bg:'linear-gradient(135deg,#854D0E 0%,#A16207 55%,#CA8A04 100%)', border:'#FDE047', fg:'#FEF9C3' },
      orange:{ bg:'linear-gradient(135deg,#7C2D12 0%,#9A3412 55%,#C2410C 100%)', border:'#FB923C', fg:'#FED7AA' },
      red:   { bg:'linear-gradient(135deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)', border:'#F87171', fg:'#FECACA' }
    };
    var vc = vColors[r.verdict];

    var h = '';
    h += _header('¿Estás haciendo dinero?', 'hub', false);
    h += '<div style="padding:16px 14px 200px;background:#0a1628;min-height:calc(100vh - 70px);">';

    // Verdict hero — SOLID verdict color
    h += '<div style="padding:24px 18px;background:'+vc.bg+';border:2px solid '+vc.border+';border-radius:18px;text-align:center;box-shadow:0 8px 28px rgba(0,0,0,0.35);">';
    h += '<div style="font-size:48px;line-height:1;">'+r.verdictEmoji+'</div>';
    h += '<div style="color:'+vc.fg+';font-size:12px;font-weight:900;letter-spacing:2.2px;margin-top:6px;">'+r.verdictText+'</div>';
    h += '<div style="color:#FFFFFF;font-size:46px;font-weight:900;margin-top:10px;letter-spacing:-0.02em;">'+_fmt$(r.profit)+'</div>';
    h += '<div style="color:#FFFFFF;font-size:14px;font-weight:700;margin-top:4px;">Ganancia neta real · Margen '+_fmtPct(r.margin)+'</div>';
    h += '<div style="color:'+vc.fg+';font-size:13px;font-weight:700;margin-top:8px;">Tarifa efectiva por hora: <span style="color:#FFFFFF;font-weight:900;">'+_fmt$(r.effectiveHourly)+'</span></div>';
    h += '</div>';

    // Key breakdown — SOLID navy
    h += '<div style="margin-top:18px;padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
    h += '<div style="color:#F5F1E8;font-size:13px;font-weight:900;margin-bottom:12px;letter-spacing:0.5px;">💰 DESGLOSE DEL JOB</div>';
    h += _breakdownRow('Cobras al cliente', _fmt$(r.revenue), '#86efac', true);
    h += _breakdownRow('− Material', _fmt$(r.material), '#fca5a5');
    h += _breakdownRow('− Mano de obra (+' + s.laborBurden + '% carga)', _fmt$(r.labor), '#fca5a5');
    h += _breakdownRow('− Permits + HERS', _fmt$(r.permits), '#fca5a5');
    h += _breakdownRow('− Overhead prorrateado', _fmt$(r.overheadPerJob), '#fca5a5');
    h += '<div style="margin-top:10px;padding-top:10px;border-top:1.5px dashed rgba(255,255,255,0.15);">';
    h += _breakdownRow('GANANCIA NETA', _fmt$(r.profit), vc.fg, true);
    h += '</div>';
    h += '</div>';

    // Overhead detail
    h += '<div style="margin-top:16px;padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
    h += '<div style="color:#F5F1E8;font-size:13px;font-weight:900;margin-bottom:4px;letter-spacing:0.5px;">🧾 OVERHEAD MENSUAL</div>';
    h += '<div style="color:#DCE5F0;font-size:12px;font-weight:600;margin-bottom:10px;line-height:1.4;">Prorrateado entre '+s.jobsPerMonth+' jobs = '+_fmt$(r.overheadPerJob)+' por job</div>';
    h += _breakdownRow('CSLB licencia ($'+s.cslbAnnual+'/año ÷ 12)', _fmt$(s.cslbAnnual/12), '#F5F1E8');
    h += _breakdownRow('Bond ($'+s.bondAnnual+'/año ÷ 12)', _fmt$(s.bondAnnual/12), '#F5F1E8');
    h += _breakdownRow('GL insurance', _fmt$(s.glMonthly), '#F5F1E8');
    h += _breakdownRow('Workers comp (base)', _fmt$(s.wcMonthly), '#F5F1E8');
    h += _breakdownRow('Truck + gas + seguro', _fmt$(s.truckMonthly), '#F5F1E8');
    h += _breakdownRow('Teléfono + software', _fmt$(s.phoneMonthly), '#F5F1E8');
    if (+s.rentMonthly > 0) h += _breakdownRow('Shop/oficina', _fmt$(s.rentMonthly), '#F5F1E8');
    h += _breakdownRow('QuickBooks + CPA', _fmt$(s.accountingMonthly), '#F5F1E8');
    h += _breakdownRow('Publicidad + otros', _fmt$(s.otherMonthly), '#F5F1E8');
    h += '<div style="margin-top:10px;padding-top:10px;border-top:1.5px dashed rgba(255,255,255,0.15);">';
    h += _breakdownRow('TOTAL / MES', _fmt$(r.monthlyOverhead), '#C9A961', true);
    h += '</div>';
    h += '</div>';

    // Inputs
    h += '<div style="margin-top:16px;padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
    h += '<div style="color:#F5F1E8;font-size:13px;font-weight:900;margin-bottom:12px;letter-spacing:0.5px;">📝 EL JOB</div>';
    h += _calcInput('ticket', 'Cobras al cliente ($)', s.ticket, 'Lo que facturas');
    h += _calcInput('material', 'Costo material ($)', s.material, 'Equipo + refrigerante + cobre + accesorios');
    h += _calcInput('laborHours', 'Horas de mano de obra', s.laborHours, 'Horas reales, incluye diagnosis + startup');
    h += _calcInput('laborRate', 'Rate del técnico ($/hr)', s.laborRate, 'Lo que pagas al técnico');
    h += _calcInput('laborBurden', 'Carga laboral (%)', s.laborBurden, 'WC + taxes + beneficios (típico 25-35%)');
    h += _calcInput('permit', 'Permit ($)', s.permit, 'Costo del permit de ciudad');
    h += _calcInput('hers', 'HERS rating ($)', s.hers, 'Si aplica en CA (changeouts)');
    h += _calcInput('jobsPerMonth', 'Jobs por mes', s.jobsPerMonth, 'Cuántos trabajos haces al mes');
    h += '</div>';

    h += '<div style="margin-top:16px;padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
    h += '<div style="color:#F5F1E8;font-size:13px;font-weight:900;margin-bottom:12px;letter-spacing:0.5px;">🏢 OVERHEAD MENSUAL</div>';
    h += _calcInput('cslbAnnual', 'CSLB licencia ($/año)', s.cslbAnnual, 'Típico: $450');
    h += _calcInput('bondAnnual', 'Contractor bond ($/año)', s.bondAnnual, 'Típico: $200 ($25k bond)');
    h += _calcInput('glMonthly', 'General Liability ($/mes)', s.glMonthly, 'Típico: $150-$350');
    h += _calcInput('wcMonthly', 'Workers Comp ($/mes)', s.wcMonthly, 'Varía según nómina');
    h += _calcInput('truckMonthly', 'Truck + gas + seguro ($/mes)', s.truckMonthly, 'Pago, combustible, seguro comercial');
    h += _calcInput('phoneMonthly', 'Teléfono + software ($/mes)', s.phoneMonthly, 'Plan + CRM + apps');
    h += _calcInput('rentMonthly', 'Shop/oficina ($/mes)', s.rentMonthly, 'Renta (0 si trabajas de casa)');
    h += _calcInput('accountingMonthly', 'Contador + QuickBooks ($/mes)', s.accountingMonthly, 'CPA y software contable');
    h += _calcInput('otherMonthly', 'Publicidad + otros ($/mes)', s.otherMonthly, 'Marketing, uniformes, herramientas');
    h += '</div>';

    // Coaching note — SOLID gold
    h += '<div style="margin-top:18px;padding:16px 18px;background:linear-gradient(135deg,#8B6B20 0%,#A88A42 55%,#C9A961 100%);border:2px solid #E8C97A;border-radius:12px;box-shadow:0 4px 14px rgba(201,169,97,0.25);">';
    h += '<div style="color:#0a1628;font-size:11px;font-weight:900;letter-spacing:1.2px;">💡 COACHING DE MARIO</div>';
    h += '<div style="color:#0a1628;font-size:14px;font-weight:700;margin-top:6px;line-height:1.55;">'+_coachingText(r)+'</div>';
    h += '</div>';

    h += '<button onclick="_czCalcReset()" style="margin-top:18px;width:100%;padding:14px;background:linear-gradient(135deg,#7F1D1D 0%,#991B1B 100%);border:2px solid #F87171;border-radius:10px;color:#FFFFFF;font-size:13px;font-weight:900;cursor:pointer;letter-spacing:0.5px;">Restaurar valores por defecto</button>';

    h += '</div>';
    screen.innerHTML = h;
  }

  function _coachingText(r) {
    if (r.verdict === 'red') return 'Estás perdiendo dinero en cada job. Sube el precio o baja los costos — el overhead te está comiendo vivo. Revisa los números antes de aceptar el siguiente job.';
    if (r.verdict === 'orange') return 'Apenas sobrevives. Un callback, un tool quemado o un cliente que no paga y quedas en rojo. Necesitas mínimo 15-20% de margen para tener espacio.';
    if (r.verdict === 'yellow') return 'Margen ajustado. Funciona pero no crece. Si quieres empleados, otro truck, o tiempo libre — necesitas 20%+ de margen. Revisa pricing.';
    if (r.verdict === 'gold') return 'Margen saludable. Puedes reinvertir en la empresa y dormir tranquilo. Mantén ese precio y enfócate en volumen + retención.';
    return '¡Excelente! Márgenes así permiten crecer con equipo, herramientas y marketing. Protege el precio, no regales la experiencia.';
  }

  function _breakdownRow(label, value, color, bold) {
    var weight = bold ? '900' : '600';
    var size = bold ? '15px' : '13px';
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;"><span style="color:#F5F1E8;font-size:'+size+';font-weight:'+weight+';">'+label+'</span><span style="color:'+color+';font-size:'+size+';font-weight:'+weight+';font-family:monospace;">'+value+'</span></div>';
  }

  function _calcInput(field, label, value, hint) {
    var h = '<div style="margin-bottom:12px;">';
    h += '<div style="color:#F5F1E8;font-size:12px;font-weight:700;margin-bottom:3px;">'+label+'</div>';
    h += '<input type="number" inputmode="decimal" value="'+value+'" onchange="_czCalcUpdate(\''+field+'\',this.value)" style="width:100%;padding:10px 12px;background:#0a1628;border:1.5px solid rgba(255,255,255,0.12);border-radius:10px;color:#F5F1E8;font-size:15px;font-weight:700;font-family:monospace;box-sizing:border-box;">';
    if (hint) h += '<div style="color:#DCE5F0;font-size:12px;font-weight:500;margin-top:4px;line-height:1.4;">'+hint+'</div>';
    h += '</div>';
    return h;
  }

  window._czCalcUpdate = function(field, val) {
    var s = _getCalcState();
    var n = parseFloat(val);
    if (isNaN(n)) n = 0;
    s[field] = n;
    _saveCalcState(s);
    _render(document.getElementById('contractorZoneScreen'));
  };

  window._czCalcReset = function() {
    if (!confirm('¿Restaurar valores por defecto?')) return;
    try { localStorage.removeItem('cz_calc_state'); } catch(e) {}
    _render(document.getElementById('contractorZoneScreen'));
  };

  // ═══════════════════════════════════════════════
  // ACADEMY SHELL (12 bloques)
  // ═══════════════════════════════════════════════
  function _renderAcademy(screen) {
    var h = '';
    h += _header('Business Academy', 'hub', false);
    h += '<div style="padding:16px 14px 200px;background:#0a1628;min-height:calc(100vh - 70px);">';

    // Hero — SOLID gold
    h += '<div style="padding:22px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 55%,#A88A42 100%);border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,0.35);">';
    h += '<div style="color:#0a1628;font-size:11px;font-weight:900;letter-spacing:1.8px;">ACVOLT BUSINESS ACADEMY</div>';
    h += '<div style="color:#0a1628;font-size:20px;font-weight:900;margin-top:7px;line-height:1.25;letter-spacing:-0.01em;">12 bloques · 52 semanas</div>';
    h += '<div style="color:#1B2845;font-size:14px;font-weight:700;margin-top:6px;line-height:1.5;">Del técnico auto-empleado al dueño que deja la empresa. Pricing abre primero con la calculadora — los demás bloques se liberan semanalmente.</div>';
    h += '</div>';

    // 12 bloques grid — SOLID colors
    h += '<div style="margin-top:20px;display:grid;grid-template-columns:repeat(2,1fr);gap:11px;">';
    for (var i = 0; i < BLOQUES.length; i++) {
      var b = BLOQUES[i];
      var isActive = b.status === 'active';
      var bg = isActive ? 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)' : 'linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%)';
      var border = isActive ? '#10B981' : '#C9A961';
      var opacity = isActive ? '1' : '0.85';
      var badge = isActive ? '<div style="position:absolute;top:9px;right:9px;padding:4px 9px;background:#FFFFFF;color:#065F46;font-size:10px;font-weight:900;letter-spacing:0.6px;border-radius:5px;">ABIERTO</div>'
                           : '<div style="position:absolute;top:9px;right:9px;padding:4px 9px;background:rgba(0,0,0,0.55);color:#FFFFFF;font-size:10px;font-weight:900;letter-spacing:0.6px;border-radius:5px;">🔒 '+(i+1)*1+' SEM</div>';
      var click = '';
      if (isActive) click = ' onclick="_czOpenBloque('+b.n+')"';
      h += '<div'+click+' style="position:relative;cursor:'+(isActive?'pointer':'default')+';padding:16px 14px;background:'+bg+';border:2px solid '+border+';border-radius:14px;opacity:'+opacity+';box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += badge;
      h += '<div style="font-size:30px;line-height:1;">'+b.icon+'</div>';
      h += '<div style="color:#E8C97A;font-size:11px;font-weight:900;letter-spacing:1.2px;margin-top:10px;">BLOQUE '+b.n+'</div>';
      h += '<div style="color:#FFFFFF;font-size:14px;font-weight:900;margin-top:4px;line-height:1.25;letter-spacing:-0.01em;">'+_esc(b.title)+'</div>';
      h += '<div style="color:#E0E7F2;font-size:12px;font-weight:600;margin-top:4px;line-height:1.4;">'+_esc(b.sub)+'</div>';
      h += '</div>';
    }
    h += '</div>';

    // Live program — SOLID cyan
    h += '<div style="margin-top:22px;padding:18px;background:linear-gradient(135deg,#0C4A6E 0%,#0369A1 55%,#0284C7 100%);border:2px solid #38BDF8;border-radius:12px;text-align:center;box-shadow:0 6px 20px rgba(3,105,161,0.3);">';
    h += '<div style="color:#BAE6FD;font-size:11px;font-weight:900;letter-spacing:1.2px;">📣 PROGRAMA EN VIVO</div>';
    h += '<div style="color:#FFFFFF;font-size:14px;font-weight:700;margin-top:6px;line-height:1.5;">La versión presencial del Business Academy son 52 sábados en ACVOLT Tech School, San Bernardino. 208 horas de instrucción, invitados especiales, materiales impresos. Llama al <b style="color:#FDE68A;">(909) 824-4849</b>.</div>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  // ═══════════════════════════════════════════════
  // ACADEMY BLOQUE DETAIL
  // ═══════════════════════════════════════════════
  function _getBloqueContent(n) {
    try { return window['CONTRACTOR_BLOQUE_' + n] || null; } catch(e) { return null; }
  }

  window._czOpenBloque = function(n) {
    _state.bloqueN = n;
    _state.mode = 'academyBloque';
    var screen = document.getElementById('contractorZoneScreen');
    if (screen) _render(screen);
    try { if (typeof window.scrollTo === 'function') window.scrollTo(0, 0); } catch(e) {}
  };

  function _renderAcademyBloque(screen) {
    var n = _state.bloqueN;
    var meta = null;
    for (var i = 0; i < BLOQUES.length; i++) { if (BLOQUES[i].n === n) { meta = BLOQUES[i]; break; } }
    if (!meta) { _state.mode = 'academy'; return _renderAcademy(screen); }

    var content = _getBloqueContent(n);
    var h = '';
    h += _header('Bloque ' + n + ' · ' + meta.title, 'academy', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    if (!content) {
      h += '<div style="padding:28px 20px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #C9A961;border-radius:14px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += '<div style="font-size:36px;margin-bottom:10px;">'+(meta.icon||'📚')+'</div>';
      h += '<div style="color:#FFFFFF;font-size:15px;font-weight:800;line-height:1.5;">Cargando contenido del bloque…</div>';
      h += '<div style="color:#FFE9B0;font-size:13px;font-weight:600;margin-top:8px;line-height:1.5;">Si este mensaje no desaparece, cierra y vuelve a abrir la Academia.</div>';
      h += '</div>';
      h += '</div>';
      screen.innerHTML = h;
      return;
    }

    // Hero — SOLID gold
    h += '<div style="padding:22px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 55%,#A88A42 100%);border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,0.45);">';
    h += '<div style="font-size:40px;">'+(meta.icon||'📚')+'</div>';
    h += '<div style="color:#1B1306;font-size:12px;font-weight:900;letter-spacing:1.8px;margin-top:10px;">🎓 BLOQUE '+n+'</div>';
    h += '<div style="color:#1B1306;font-size:21px;font-weight:900;margin-top:5px;line-height:1.25;">'+_esc(content.title||meta.title)+'</div>';
    if (content.tagline) h += '<div style="color:#1B1306;font-size:15px;font-weight:700;margin-top:10px;line-height:1.5;background:rgba(27,19,6,0.2);padding:8px 12px;border-radius:8px;">'+_esc(content.tagline)+'</div>';
    h += '</div>';

    if (content.intro) {
      h += '<div style="margin-top:18px;padding:18px 20px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;color:#FFFFFF;font-size:15px;font-weight:600;line-height:1.65;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += content.intro;
      h += '</div>';
    }

    // Bloque 10 calculator CTA — SOLID emerald
    if (n === 10) {
      h += '<div onclick="_czNav(\'calc\')" style="margin-top:18px;cursor:pointer;padding:18px 20px;background:linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%);border:2px solid #34D399;border-radius:14px;display:flex;align-items:center;gap:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
      h += '<div style="font-size:36px;">💰</div>';
      h += '<div style="flex:1;"><div style="color:#FFFFFF;font-size:15px;font-weight:900;">Abrir Calculadora</div>';
      h += '<div style="color:#D1FAE5;font-size:13px;font-weight:700;margin-top:4px;">¿Estás haciendo dinero? Calcula tu ganancia real por job</div></div>';
      h += '<div style="color:#FFFFFF;font-size:26px;font-weight:900;">›</div>';
      h += '</div>';
    }

    // Sections
    if (Array.isArray(content.sections)) {
      for (var s = 0; s < content.sections.length; s++) {
        var sec = content.sections[s];
        h += '<div style="margin-top:20px;padding:18px 20px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
        h += '<div style="color:#FFE9B0;font-size:11px;font-weight:900;letter-spacing:1.5px;background:rgba(0,0,0,0.3);display:inline-block;padding:4px 10px;border-radius:6px;">SECCIÓN '+(s+1)+'</div>';
        h += '<div style="color:#FFFFFF;font-size:18px;font-weight:900;margin-top:8px;line-height:1.3;">'+_esc(sec.heading||'')+'</div>';

        if (sec.body) {
          h += '<div style="margin-top:14px;color:#FFFFFF;font-size:15px;font-weight:600;line-height:1.75;">';
          h += sec.body;
          h += '</div>';
        }

        if (Array.isArray(sec.keyPoints) && sec.keyPoints.length) {
          h += '<div style="margin-top:14px;padding:14px 16px;background:linear-gradient(135deg,#065F46 0%,#047857 100%);border:1.5px solid #34D399;border-radius:10px;">';
          h += '<div style="color:#D1FAE5;font-size:12px;font-weight:900;letter-spacing:1.2px;margin-bottom:8px;">✓ PUNTOS CLAVE</div>';
          h += '<ul style="margin:0;padding-left:20px;color:#FFFFFF;font-size:14px;font-weight:600;line-height:1.6;">';
          for (var k = 0; k < sec.keyPoints.length; k++) h += '<li style="margin:5px 0;">'+_esc(sec.keyPoints[k])+'</li>';
          h += '</ul></div>';
        }

        if (sec.realTalk) {
          h += '<div style="margin-top:14px;padding:14px 16px;background:linear-gradient(135deg,#78350F 0%,#92400E 100%);border:1.5px solid #FBBF24;border-radius:10px;">';
          h += '<div style="color:#FDE68A;font-size:11px;font-weight:900;letter-spacing:1.2px;margin-bottom:6px;">🔥 REAL TALK</div>';
          h += '<div style="color:#FFFFFF;font-size:14px;font-weight:700;font-style:italic;line-height:1.6;">'+_esc(sec.realTalk)+'</div>';
          h += '</div>';
        }

        if (Array.isArray(sec.checklist) && sec.checklist.length) {
          h += '<div style="margin-top:14px;padding:14px 16px;background:linear-gradient(135deg,#0C4A6E 0%,#075985 100%);border:1.5px solid #38BDF8;border-radius:10px;">';
          h += '<div style="color:#BAE6FD;font-size:12px;font-weight:900;letter-spacing:1.2px;margin-bottom:10px;">📋 CHECKLIST</div>';
          for (var c = 0; c < sec.checklist.length; c++) {
            var it = sec.checklist[c];
            h += '<div style="display:flex;gap:12px;align-items:flex-start;margin:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;line-height:1.6;">';
            h += '<span style="color:#38BDF8;font-weight:900;flex-shrink:0;font-size:16px;">☐</span>';
            h += '<div style="flex:1;"><div>'+_esc(it.item||'')+'</div>';
            if (it.note) h += '<div style="color:#BAE6FD;font-size:12px;font-weight:600;margin-top:3px;font-style:italic;">'+_esc(it.note)+'</div>';
            h += '</div></div>';
          }
          h += '</div>';
        }

        if (Array.isArray(sec.commonMistakes) && sec.commonMistakes.length) {
          h += '<div style="margin-top:14px;padding:14px 16px;background:linear-gradient(135deg,#7F1D1D 0%,#991B1B 100%);border:1.5px solid #FCA5A5;border-radius:10px;">';
          h += '<div style="color:#FECACA;font-size:12px;font-weight:900;letter-spacing:1.2px;margin-bottom:8px;">⚠️ ERRORES COMUNES</div>';
          h += '<ul style="margin:0;padding-left:20px;color:#FFFFFF;font-size:14px;font-weight:600;line-height:1.6;">';
          for (var m = 0; m < sec.commonMistakes.length; m++) h += '<li style="margin:5px 0;">'+_esc(sec.commonMistakes[m])+'</li>';
          h += '</ul></div>';
        }

        h += '</div>';
      }
    }

    // Resources
    if (Array.isArray(content.resources) && content.resources.length) {
      h += '<div style="margin-top:22px;padding:18px 20px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += '<div style="color:#FFE9B0;font-size:13px;font-weight:900;letter-spacing:1.2px;margin-bottom:12px;">🔗 RECURSOS</div>';
      for (var r = 0; r < content.resources.length; r++) {
        var res = content.resources[r];
        h += '<a href="'+_esc(res.url||'#')+'" target="_blank" rel="noopener" style="display:block;padding:12px 14px;margin:8px 0;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:1.5px solid #F5D58A;border-radius:10px;color:#1B1306;font-size:14px;font-weight:900;text-decoration:none;line-height:1.4;">';
        h += '→ '+_esc(res.label||res.url||'Enlace');
        h += '</a>';
      }
      h += '</div>';
    }

    // Glossary
    if (Array.isArray(content.glossary) && content.glossary.length) {
      h += '<div style="margin-top:20px;padding:18px 20px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #C9A961;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += '<div style="color:#FFE9B0;font-size:13px;font-weight:900;letter-spacing:1.2px;margin-bottom:12px;">📖 GLOSARIO</div>';
      for (var g = 0; g < content.glossary.length; g++) {
        var gl = content.glossary[g];
        h += '<div style="padding:10px 0;border-bottom:1.5px solid rgba(201,169,97,0.25);">';
        h += '<div style="color:#FFE9B0;font-size:14px;font-weight:900;">'+_esc(gl.term||'')+'</div>';
        h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;margin-top:4px;line-height:1.55;">'+_esc(gl.def||'')+'</div>';
        h += '</div>';
      }
      h += '</div>';
    }

    // Footer CTA — solid gold
    h += '<div style="margin-top:22px;padding:16px 18px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:2px solid #F5D58A;border-radius:12px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
    h += '<div style="color:#1B1306;font-size:12px;font-weight:900;letter-spacing:1px;">📣 VERSIÓN PRESENCIAL</div>';
    h += '<div style="color:#1B1306;font-size:13px;font-weight:700;margin-top:6px;line-height:1.5;">52 sábados en ACVOLT Tech School, San Bernardino. Llama al <b>(909) 824-4849</b>.</div>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  // ═══════════════════════════════════════════════
  // NAVIGATION CONTROLLER
  // ═══════════════════════════════════════════════
  window._czNav = function(mode, examId) {
    var screen = document.getElementById('contractorZoneScreen');
    if (!screen) return;
    if (examId) _state.examId = examId;
    if (mode === 'practice') _startPractice();
    else if (mode === 'flashcards') _startFlashcards();
    else if (mode === 'mock') _startMock();
    else if (mode === 'hub') { _state.examId = null; _state.questions = []; }
    _state.mode = mode;
    _render(screen);
    try { if (typeof window.scrollTo === 'function') window.scrollTo(0, 0); } catch(e) {}
  };

  // ═══════════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════════
  function _header(title, backMode, isRoot) {
    var backHtml;
    var btnStyle = 'background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:1.5px solid #F5D58A;color:#1B1306;padding:9px 15px;border-radius:10px;font-size:13px;font-weight:900;letter-spacing:0.3px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.35);';
    if (isRoot) {
      backHtml = '<button onclick="showScreen(\'dashboardScreen\')" style="'+btnStyle+'">&larr; '+_t('cz_back','Volver')+'</button>';
    } else {
      backHtml = '<button onclick="_czNav(\''+backMode+'\')" style="'+btnStyle+'">&larr; '+_t('cz_back','Volver')+'</button>';
    }
    var h = '';
    h += '<div style="position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:10px;padding:14px 14px;padding-top:calc(14px + env(safe-area-inset-top,0px));background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border-bottom:3px solid #C9A961;box-shadow:0 3px 10px rgba(0,0,0,0.4);">';
    h += backHtml;
    h += '<div style="flex:1;color:#FFFFFF;font-size:16px;font-weight:900;letter-spacing:0.3px;line-height:1.2;text-shadow:0 1px 2px rgba(0,0,0,0.5);">🏛️ '+_esc(title)+'</div>';
    h += '</div>';
    return h;
  }

  // ═══════════════════════════════════════════════
  // CSLB APPLICATION KIT — Step-by-step accordion
  // ═══════════════════════════════════════════════
  function _kitUserId() {
    try {
      if (window.currentUser && window.currentUser.id) return String(window.currentUser.id);
      var u = JSON.parse(localStorage.getItem('maestroUser') || 'null');
      if (u && u.id) return String(u.id);
    } catch(e) {}
    return 'anon';
  }
  function _kitKey() { return 'cz_cslb_kit_' + _kitUserId(); }
  function _kitGetState() {
    try { return JSON.parse(localStorage.getItem(_kitKey())) || { checked: {} }; }
    catch(e) { return { checked: {} }; }
  }
  function _kitSaveState(s) { try { localStorage.setItem(_kitKey(), JSON.stringify(s)); } catch(e) {} }
  function _kitAllSteps() {
    var kit = window.CONTRACTOR_CSLB_KIT;
    if (!kit || !kit.phases) return [];
    var out = [];
    for (var i = 0; i < kit.phases.length; i++) {
      var ph = kit.phases[i];
      for (var j = 0; j < ph.steps.length; j++) out.push(ph.steps[j]);
    }
    return out;
  }
  function _kitProgressPct() {
    var steps = _kitAllSteps();
    if (steps.length === 0) return 0;
    var s = _kitGetState();
    var done = 0;
    for (var i = 0; i < steps.length; i++) if (s.checked[steps[i].id]) done++;
    return Math.round(done / steps.length * 100);
  }
  function _kitPhaseStats(phase) {
    var s = _kitGetState();
    var done = 0;
    for (var i = 0; i < phase.steps.length; i++) if (s.checked[phase.steps[i].id]) done++;
    return { done: done, total: phase.steps.length };
  }

  function _renderCslbKit(screen) {
    var kit = window.CONTRACTOR_CSLB_KIT;
    if (!kit || !kit.phases) {
      screen.innerHTML = _header('CSLB Application Kit', 'hub', false) +
        '<div style="padding:40px 20px;text-align:center;background:linear-gradient(180deg,#0a1628,#050c16);min-height:calc(100vh - 70px);">'+
        '<div style="color:#F5F1E8;font-size:15px;font-weight:700;">Cargando datos del kit…</div>'+
        '<div style="color:#DCE5F0;font-size:12px;font-weight:600;margin-top:8px;">Si este mensaje persiste, recarga la pantalla.</div>'+
        '</div>';
      return;
    }

    var st = _kitGetState();
    var overallPct = _kitProgressPct();
    var totalSteps = _kitAllSteps().length;
    var doneSteps = 0;
    for (var k in st.checked) if (st.checked[k]) doneSteps++;

    var h = '';
    h += _header(kit.title, 'hub', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    // Hero — SOLID premium gold
    h += '<div style="padding:22px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 55%,#A88A42 100%);border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,0.45);">';
    h += '<div style="color:#1B1306;font-size:12px;font-weight:900;letter-spacing:1.8px;">🏛️ KIT DE APLICACIÓN CSLB</div>';
    h += '<div style="color:#1B1306;font-size:19px;font-weight:900;margin-top:7px;line-height:1.3;">'+_esc(kit.subtitle)+'</div>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:18px;margin-top:16px;">';
    h += '<div style="background:rgba(27,19,6,0.25);padding:8px 12px;border-radius:8px;"><div style="color:#1B1306;font-size:11px;font-weight:900;letter-spacing:0.8px;">⏱️ TIEMPO TOTAL</div><div style="color:#1B1306;font-size:15px;font-weight:900;margin-top:3px;">'+_esc(kit.totalWeeks)+'</div></div>';
    h += '<div style="background:rgba(27,19,6,0.25);padding:8px 12px;border-radius:8px;"><div style="color:#1B1306;font-size:11px;font-weight:900;letter-spacing:0.8px;">💰 COSTO TOTAL</div><div style="color:#1B1306;font-size:15px;font-weight:900;margin-top:3px;">'+_esc(kit.totalCost)+'</div></div>';
    h += '</div>';
    // Overall progress
    h += '<div style="margin-top:16px;background:rgba(27,19,6,0.25);padding:12px 14px;border-radius:10px;">';
    h += '<div style="display:flex;align-items:center;gap:12px;">';
    h += '<div style="flex:1;height:12px;background:#1B1306;border-radius:6px;overflow:hidden;"><div style="height:100%;width:'+overallPct+'%;background:linear-gradient(90deg,#FFFFFF,#FEF3C7);transition:width 0.25s;"></div></div>';
    h += '<div style="color:#1B1306;font-size:16px;font-weight:900;">'+overallPct+'%</div>';
    h += '</div>';
    h += '<div style="color:#1B1306;font-size:12px;font-weight:900;margin-top:8px;">✓ '+doneSteps+' de '+totalSteps+' pasos completados</div>';
    h += '</div>';
    h += '</div>';

    // Phases accordion
    h += '<div style="margin-top:18px;display:grid;gap:14px;">';
    for (var i = 0; i < kit.phases.length; i++) {
      var phase = kit.phases[i];
      var stats = _kitPhaseStats(phase);
      var phaseOpen = _state.kitExpandedPhase === phase.id;
      var phasePct = stats.total > 0 ? Math.round(stats.done / stats.total * 100) : 0;
      var pColor = phase.color || '#C9A961';
      var complete = stats.done === stats.total;
      var phaseBg = complete ? 'linear-gradient(135deg,#065F46 0%,#047857 55%,#059669 100%)' : 'linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%)';
      var phaseBorder = complete ? '#34D399' : pColor;

      h += '<div style="background:'+phaseBg+';border:2px solid '+phaseBorder+';border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.35);">';
      // Phase header (clickable)
      h += '<div onclick="_czKitTogglePhase(\''+phase.id+'\')" style="cursor:pointer;padding:16px 18px;display:flex;align-items:center;gap:14px;">';
      h += '<div style="width:48px;height:48px;border-radius:12px;background:rgba(0,0,0,0.35);border:2px solid '+pColor+';display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">'+phase.icon+'</div>';
      h += '<div style="flex:1;min-width:0;">';
      h += '<div style="color:#FFFFFF;font-size:15px;font-weight:900;line-height:1.25;">'+_esc(phase.title)+'</div>';
      h += '<div style="color:'+pColor+';font-size:12px;font-weight:800;margin-top:4px;">'+_esc(phase.timeline)+' · '+stats.done+'/'+stats.total+' pasos'+(complete ? ' ✓' : '')+'</div>';
      h += '<div style="margin-top:8px;height:6px;background:rgba(0,0,0,0.3);border-radius:3px;overflow:hidden;"><div style="height:100%;width:'+phasePct+'%;background:'+pColor+';"></div></div>';
      h += '</div>';
      h += '<div style="color:'+pColor+';font-size:22px;font-weight:900;flex-shrink:0;">'+(phaseOpen ? '▾' : '▸')+'</div>';
      h += '</div>';

      // Expanded steps
      if (phaseOpen) {
        h += '<div style="border-top:2px solid rgba(201,169,97,0.35);padding:10px 12px 14px;background:rgba(0,0,0,0.2);">';
        for (var j = 0; j < phase.steps.length; j++) {
          var step = phase.steps[j];
          var checked = !!st.checked[step.id];
          var stepOpen = _state.kitExpandedStep === step.id;
          var sbg = checked ? 'linear-gradient(135deg,#064E3B 0%,#065F46 100%)' : 'linear-gradient(135deg,#0F1D32 0%,#1B2845 100%)';
          var sborder = checked ? '#34D399' : '#3A4E7C';

          h += '<div style="margin-top:10px;background:'+sbg+';border:1.5px solid '+sborder+';border-radius:10px;overflow:hidden;">';
          h += '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 14px;">';
          // Checkbox
          h += '<div onclick="event.stopPropagation();_czToggleKitStep(\''+step.id+'\')" style="cursor:pointer;flex-shrink:0;margin-top:1px;width:24px;height:24px;border-radius:6px;border:2.5px solid '+(checked ? '#34D399' : '#C9A961')+';background:'+(checked ? '#34D399' : 'transparent')+';display:flex;align-items:center;justify-content:center;color:#0a1628;font-size:15px;font-weight:900;">'+(checked ? '✓' : '')+'</div>';
          // Label
          h += '<div onclick="_czKitToggleStep(\''+step.id+'\')" style="cursor:pointer;flex:1;min-width:0;">';
          h += '<div style="color:#FFFFFF;font-size:14px;font-weight:700;line-height:1.4;'+(checked ? 'opacity:0.7;text-decoration:line-through;' : '')+'">'+_esc(step.label)+'</div>';
          if (step.details || (step.links && step.links.length)) {
            h += '<div style="color:'+pColor+';font-size:11px;font-weight:900;margin-top:5px;letter-spacing:0.5px;">'+(stepOpen ? '▾ Ocultar detalles' : '▸ Ver detalles')+'</div>';
          }
          h += '</div>';
          h += '</div>';
          // Details
          if (stepOpen) {
            h += '<div style="padding:0 14px 14px 46px;">';
            if (step.details) {
              h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;line-height:1.6;padding:12px 14px;background:rgba(0,0,0,0.35);border:1.5px solid '+pColor+';border-radius:8px;">'+step.details+'</div>';
            }
            if (step.links && step.links.length) {
              h += '<div style="margin-top:12px;display:grid;gap:8px;">';
              for (var L = 0; L < step.links.length; L++) {
                var ln = step.links[L];
                h += '<a href="'+_esc(ln.url)+'" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:linear-gradient(135deg,#E8C97A 0%,#C9A961 100%);border:1.5px solid #F5D58A;border-radius:8px;color:#1B1306;font-size:13px;font-weight:900;text-decoration:none;">🔗 '+_esc(ln.label)+'</a>';
              }
              h += '</div>';
            }
            h += '</div>';
          }
          h += '</div>';
        }
        h += '</div>';
      }
      h += '</div>';
    }
    h += '</div>';

    // Disclaimer — solid amber
    h += '<div style="margin-top:22px;padding:14px 16px;background:linear-gradient(135deg,#78350F 0%,#92400E 55%,#B45309 100%);border:2px solid #FBBF24;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
    h += '<div style="color:#FDE68A;font-size:12px;font-weight:900;letter-spacing:1px;">⚠️ AVISO</div>';
    h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;margin-top:6px;line-height:1.5;">Esta guía resume el proceso público de CSLB. Fees, formularios y políticas pueden cambiar — verifica siempre en <b style="color:#FDE68A;">cslb.ca.gov</b> antes de enviar.</div>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  window._czOpenCslbKit = function() {
    var screen = document.getElementById('contractorZoneScreen');
    if (!screen) return;
    _state.mode = 'cslbKit';
    // Auto-expand first phase if none expanded
    if (!_state.kitExpandedPhase && window.CONTRACTOR_CSLB_KIT && window.CONTRACTOR_CSLB_KIT.phases && window.CONTRACTOR_CSLB_KIT.phases.length) {
      _state.kitExpandedPhase = window.CONTRACTOR_CSLB_KIT.phases[0].id;
    }
    _render(screen);
    try { if (typeof window.scrollTo === 'function') window.scrollTo(0, 0); } catch(e) {}
  };

  window._czKitTogglePhase = function(phaseId) {
    _state.kitExpandedPhase = (_state.kitExpandedPhase === phaseId) ? null : phaseId;
    _state.kitExpandedStep = null;
    _render(document.getElementById('contractorZoneScreen'));
  };

  window._czKitToggleStep = function(stepId) {
    _state.kitExpandedStep = (_state.kitExpandedStep === stepId) ? null : stepId;
    _render(document.getElementById('contractorZoneScreen'));
  };

  window._czToggleKitStep = function(stepId) {
    var s = _kitGetState();
    s.checked = s.checked || {};
    s.checked[stepId] = !s.checked[stepId];
    _kitSaveState(s);
    _render(document.getElementById('contractorZoneScreen'));
  };

  // ═══════════════════════════════════════════════
  // PLANTILLAS DE CONTRATOS — Template picker + editor
  // ═══════════════════════════════════════════════
  function _tplList() {
    return Array.isArray(window.CONTRACTOR_TEMPLATES) ? window.CONTRACTOR_TEMPLATES : [];
  }
  function _tplById(id) {
    var list = _tplList();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function _tplKey(id) { return 'cz_template_' + id; }
  function _tplLoadValues(id) {
    try { return JSON.parse(localStorage.getItem(_tplKey(id))) || {}; }
    catch(e) { return {}; }
  }
  function _tplSaveValues(id, values) {
    try { localStorage.setItem(_tplKey(id), JSON.stringify(values || {})); } catch(e) {}
  }
  // Shared business profile keys (auto-populate across all templates)
  var _TPL_SHARED_KEYS = ['license_num','business_name','business_address','business_phone','business_email'];
  function _tplGetShared() {
    var out = {};
    var list = _tplList();
    for (var k = 0; k < _TPL_SHARED_KEYS.length; k++) {
      var key = _TPL_SHARED_KEYS[k];
      for (var i = 0; i < list.length; i++) {
        var v = _tplLoadValues(list[i].id);
        if (v && v[key] != null && String(v[key]).trim() !== '') { out[key] = v[key]; break; }
      }
    }
    return out;
  }
  function _tplSeedDefaults(tpl) {
    var out = {};
    if (!tpl || !tpl.fields) return out;
    for (var i = 0; i < tpl.fields.length; i++) {
      var f = tpl.fields[i];
      if (f.defaultValue != null) out[f.id] = f.defaultValue;
    }
    return out;
  }

  function _renderTemplates(screen) {
    var list = _tplList();
    var h = '';
    h += _header('Plantillas de Contratos', 'hub', false);
    h += '<div style="padding:16px 14px 200px;background:#0a1628;min-height:calc(100vh - 70px);">';

    // Hero — SOLID teal
    h += '<div style="padding:22px;background:linear-gradient(135deg,#0F766E 0%,#0D9488 55%,#14B8A6 100%);border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,0.35);">';
    h += '<div style="color:#CCFBF1;font-size:11px;font-weight:900;letter-spacing:1.8px;">PLANTILLAS CA-COMPLIANT</div>';
    h += '<div style="color:#FFFFFF;font-size:19px;font-weight:900;margin-top:7px;line-height:1.3;letter-spacing:-0.01em;">5 contratos listos para imprimir — §7159 / §7018 / §7159.5</div>';
    h += '<div style="color:#E6FFFA;font-size:13px;font-weight:600;margin-top:8px;line-height:1.5;">Llena los campos, da Vista Previa, imprime o guarda como PDF desde tu navegador.</div>';
    h += '</div>';

    if (list.length === 0) {
      h += '<div style="margin-top:16px;padding:18px;background:linear-gradient(135deg,#78350F 0%,#5C2810 100%);border:2px solid #F59E0B;border-radius:10px;color:#FFFFFF;font-size:14px;font-weight:700;">Cargando plantillas…</div>';
      h += '</div>';
      screen.innerHTML = h;
      return;
    }

    // Template cards — SOLID navy with teal accent
    h += '<div style="margin-top:18px;display:grid;gap:12px;">';
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      h += '<div onclick="_czOpenTemplate(\''+_esc(t.id)+'\')" style="cursor:pointer;padding:18px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%);border:2px solid #2DD4BF;border-radius:14px;display:flex;align-items:flex-start;gap:14px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">';
      h += '<div style="font-size:32px;line-height:1;flex-shrink:0;">'+_esc(t.icon||'📄')+'</div>';
      h += '<div style="flex:1;min-width:0;">';
      h += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">';
      h += '<div style="color:#FFFFFF;font-size:15px;font-weight:900;line-height:1.25;letter-spacing:-0.01em;">'+_esc(t.title)+'</div>';
      h += '<span style="padding:3px 8px;background:#0F766E;border:1px solid #2DD4BF;border-radius:6px;color:#CCFBF1;font-size:10px;font-weight:900;letter-spacing:0.5px;">'+_esc(t.category||'')+'</span>';
      h += '</div>';
      h += '<div style="color:#E0E7F2;font-size:13px;font-weight:600;margin-top:7px;line-height:1.45;">'+_esc(t.description||'')+'</div>';
      h += '</div>';
      h += '<div style="color:#5EEAD4;font-size:26px;font-weight:900;flex-shrink:0;">›</div>';
      h += '</div>';
    }
    h += '</div>';

    // Disclaimer — SOLID amber
    h += '<div style="margin-top:22px;padding:14px 16px;background:linear-gradient(135deg,#78350F 0%,#5C2810 100%);border:2px solid #F59E0B;border-radius:12px;">';
    h += '<div style="color:#FDE68A;font-size:11px;font-weight:900;letter-spacing:1.2px;">⚠️ AVISO LEGAL</div>';
    h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;margin-top:5px;line-height:1.5;">Plantillas de referencia basadas en California Business & Professions Code §7159, §7018 y §7159.5. Revisa con tu abogado antes de usar en producción. El cumplimiento final es responsabilidad del contratista.</div>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  function _renderTemplateEditor(screen) {
    var tpl = _tplById(_state.templateId);
    if (!tpl) { _state.mode = 'templates'; return _render(screen); }
    var values = _state.templateValues || {};

    var h = '';
    h += _header(tpl.title, 'templates', false);
    h += '<div style="padding:16px 14px 200px;background:linear-gradient(180deg,#0F1D32 0%,#0A1628 60%,#050C16 100%);min-height:calc(100vh - 70px);">';

    // Hero — SOLID teal
    h += '<div style="padding:18px 20px;background:linear-gradient(135deg,#0F766E 0%,#0D9488 55%,#14B8A6 100%);border:2px solid #5EEAD4;border-radius:14px;display:flex;align-items:center;gap:14px;box-shadow:0 6px 20px rgba(0,0,0,0.4);">';
    h += '<div style="font-size:34px;">'+_esc(tpl.icon||'📄')+'</div>';
    h += '<div style="flex:1;min-width:0;">';
    h += '<div style="color:#FFFFFF;font-size:16px;font-weight:900;line-height:1.25;text-shadow:0 1px 2px rgba(0,0,0,0.4);">'+_esc(tpl.title)+'</div>';
    h += '<div style="color:#CCFBF1;font-size:12px;font-weight:700;margin-top:4px;">'+_esc(tpl.description||'')+'</div>';
    h += '</div>';
    h += '</div>';

    h += '<div style="margin-top:18px;display:grid;gap:12px;">';
    for (var i = 0; i < tpl.fields.length; i++) {
      var f = tpl.fields[i];
      var curVal = values[f.id] != null ? values[f.id] : '';
      var req = f.required ? ' <span style="color:#FCA5A5;font-weight:900;">*</span>' : '';
      var labelHtml = '<label style="display:block;color:#FFE9B0;font-size:13px;font-weight:900;margin-bottom:6px;letter-spacing:0.3px;">'+_esc(f.label)+req+'</label>';

      h += '<div style="padding:14px 16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:1.5px solid #5EEAD4;border-radius:10px;box-shadow:0 3px 10px rgba(0,0,0,0.25);">';
      h += labelHtml;

      if (f.type === 'textarea') {
        h += '<textarea onchange="_czTemplateChange(\''+_esc(f.id)+'\', this.value)" rows="3" placeholder="'+_esc(f.placeholder||'')+'" style="width:100%;padding:12px 14px;background:#0F1D32;border:1.5px solid #3A4E7C;border-radius:8px;color:#FFFFFF;font-size:14px;font-weight:600;font-family:inherit;box-sizing:border-box;resize:vertical;">'+_esc(curVal)+'</textarea>';
      } else if (f.type === 'checkbox') {
        var checked = curVal ? 'checked' : '';
        h += '<label style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#0F1D32;border:1.5px solid #3A4E7C;border-radius:8px;cursor:pointer;">';
        h += '<input type="checkbox" '+checked+' onchange="_czTemplateChange(\''+_esc(f.id)+'\', this.checked)" style="width:22px;height:22px;accent-color:#14B8A6;cursor:pointer;">';
        h += '<span style="color:#FFFFFF;font-size:14px;font-weight:700;">Sí</span>';
        h += '</label>';
      } else {
        var inputType = f.type === 'date' ? 'date' : (f.type === 'money' ? 'number' : 'text');
        var extra = f.type === 'money' ? ' step="0.01" min="0"' : '';
        h += '<input type="'+inputType+'"'+extra+' value="'+_esc(curVal)+'" onchange="_czTemplateChange(\''+_esc(f.id)+'\', this.value)" placeholder="'+_esc(f.placeholder||'')+'" style="width:100%;padding:12px 14px;background:#0F1D32;border:1.5px solid #3A4E7C;border-radius:8px;color:#FFFFFF;font-size:14px;font-weight:600;box-sizing:border-box;">';
      }
      h += '</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:22px;display:grid;gap:12px;">';
    h += '<button onclick="_czTemplatePreview()" style="padding:18px;background:linear-gradient(135deg,#0F766E 0%,#0D9488 55%,#14B8A6 100%);border:2px solid #5EEAD4;border-radius:12px;color:#FFFFFF;font-size:15px;font-weight:900;letter-spacing:0.8px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,0.45);">👁️ VISTA PREVIA · IMPRIMIR · PDF</button>';
    h += '<button onclick="_czTemplateClear()" style="padding:14px;background:linear-gradient(135deg,#7F1D1D 0%,#991B1B 100%);border:2px solid #FCA5A5;border-radius:10px;color:#FFFFFF;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.3);">🗑️ Limpiar campos</button>';
    h += '</div>';

    h += '<div style="margin-top:18px;padding:14px 16px;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #5EEAD4;border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,0.3);">';
    h += '<div style="color:#5EEAD4;font-size:12px;font-weight:900;letter-spacing:1px;">💾 GUARDADO AUTOMÁTICO</div>';
    h += '<div style="color:#FFFFFF;font-size:13px;font-weight:600;margin-top:6px;line-height:1.55;">Tus datos se guardan en este dispositivo. El # de licencia, nombre y dirección de tu empresa se reutilizan automáticamente en las 5 plantillas.</div>';
    h += '</div>';

    h += '</div>';
    screen.innerHTML = h;
  }

  window._czOpenTemplate = function(id) {
    var tpl = _tplById(id);
    if (!tpl) return;
    _state.templateId = id;
    var merged = {};
    var defaults = _tplSeedDefaults(tpl);
    for (var k in defaults) merged[k] = defaults[k];
    var shared = _tplGetShared();
    for (var k2 in shared) merged[k2] = shared[k2];
    var saved = _tplLoadValues(id);
    for (var k3 in saved) merged[k3] = saved[k3];
    _state.templateValues = merged;
    _state.mode = 'templateEditor';
    _render(document.getElementById('contractorZoneScreen'));
    try { if (typeof window.scrollTo === 'function') window.scrollTo(0, 0); } catch(e) {}
  };

  window._czTemplateChange = function(fieldId, value) {
    if (!_state.templateId) return;
    _state.templateValues = _state.templateValues || {};
    _state.templateValues[fieldId] = value;
    _tplSaveValues(_state.templateId, _state.templateValues);
    if (_TPL_SHARED_KEYS.indexOf(fieldId) >= 0) {
      var list = _tplList();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === _state.templateId) continue;
        var v = _tplLoadValues(list[i].id);
        v[fieldId] = value;
        _tplSaveValues(list[i].id, v);
      }
    }
  };

  window._czTemplatePreview = function() {
    var tpl = _tplById(_state.templateId);
    if (!tpl) return;
    var values = _state.templateValues || {};
    var html;
    try { html = tpl.render(values); }
    catch(e) { alert('Error generando vista previa: ' + e.message); return; }
    var w;
    try { w = window.open('', '_blank', 'width=900,height=1100'); } catch(e) { w = null; }
    if (!w) { alert('El navegador bloqueó la ventana emergente. Habilita pop-ups e intenta de nuevo.'); return; }
    try {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch(e) { alert('Error abriendo vista previa: ' + e.message); }
  };

  window._czTemplateClear = function() {
    if (!_state.templateId) return;
    if (typeof confirm === 'function' && !confirm('¿Limpiar los campos de esta plantilla? Tus datos compartidos (licencia, empresa) permanecerán.')) return;
    var tpl = _tplById(_state.templateId);
    var shared = _tplGetShared();
    var defaults = _tplSeedDefaults(tpl);
    var merged = {};
    for (var k in defaults) merged[k] = defaults[k];
    for (var k2 in shared) merged[k2] = shared[k2];
    _state.templateValues = merged;
    _tplSaveValues(_state.templateId, merged);
    _render(document.getElementById('contractorZoneScreen'));
  };

})();
