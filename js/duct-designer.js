// ============================================
// DUCT DESIGNER v3 — Pizarra de Ductos
// Floor plan (walls/doors/windows) + Blower
// Supply/Return duct system with real-time
// velocity tracking as you extend ducts
// ============================================

(function() {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────
  var GRID_SIZE = 20;
  var COLORS = {
    bg: '#FFF8DC',           // Vanilla / cornsilk
    grid: 'rgba(0,0,0,0.06)',
    gridMajor: 'rgba(0,0,0,0.12)',
    draw: '#1e40af',
    duct: '#16a34a',
    equipment: '#b45309',
    text: '#0F0F0F',
    supply: '#dc2626',
    return_: '#2563eb',
    fitting: '#7c3aed',
    fittingBad: '#dc2626',
    wall: '#0F0F0F',
    wallFill: '#3D3D3A',
    door: '#92400e',
    window_: '#0891b2',
    blowerSupply: '#dc2626',
    blowerReturn: '#2563eb',
    supplyDuct: '#dc2626',
    returnDuct: '#2563eb',
    livePreview: 'rgba(22,163,74,0.5)',
    labelBg: 'rgba(255,255,255,0.92)',
    labelBorder: 'rgba(0,0,0,0.12)'
  };

  var WALL_THICKNESS = 6;
  var _lastDuctCFM = 0; // Remember last CFM for continuous chaining

  // ── Audio Feedback (Web Audio API) ─────────────────────────────
  var _audioCtx = null;
  function _getAudio() {
    if (!_audioCtx) try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    return _audioCtx;
  }

  function _playBuzzer() {
    var ctx = _getAudio(); if (!ctx) return;
    try {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 200;
      g.gain.value = 0.25;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(function() { o.frequency.value = 150; }, 150);
      setTimeout(function() { o.stop(); }, 350);
    } catch(e) {}
  }

  function _playSuccess() {
    var ctx = _getAudio(); if (!ctx) return;
    try {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.value = 0.15;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(function() { o.frequency.value = 1320; }, 80);
      setTimeout(function() { o.stop(); }, 180);
    } catch(e) {}
  }

  // ── Duct Sizing Math ───────────────────────────────────────────
  // Q ≈ 3.40 × D^2.5 × √(Δp) — empirical fit to ASHRAE friction chart
  var ROUND_SIZES = [4,5,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
  var FRICTION_RATES = [
    { val: 0.05, label: '0.05' },
    { val: 0.08, label: '0.08' },
    { val: 0.10, label: '0.10' }
  ];

  function _calcRoundCFM(dia, fr) {
    var cfm = 3.40 * Math.pow(dia, 2.5) * Math.sqrt(fr);
    var area = Math.PI * Math.pow(dia / 24, 2);
    var vel = Math.round(cfm / area);
    return { cfm: Math.round(cfm), vel: vel };
  }

  // Rectangular equivalent diameter: D_eq = 1.3 × (a×b)^0.625 / (a+b)^0.25
  function _rectEquivDia(w, h) {
    return 1.3 * Math.pow(w * h, 0.625) / Math.pow(w + h, 0.25);
  }

  function _calcDuctSize(cfm, isCommercial) {
    var targetVel = isCommercial ? 1200 : 900;
    var areaNeeded = cfm / targetVel;
    var diameter = Math.sqrt(4 * areaNeeded / Math.PI) * 12;
    var bestRound = ROUND_SIZES[0];
    for (var i = 0; i < ROUND_SIZES.length; i++) {
      if (ROUND_SIZES[i] >= diameter) { bestRound = ROUND_SIZES[i]; break; }
      bestRound = ROUND_SIZES[i];
    }
    var actualArea = Math.PI * Math.pow(bestRound / 24, 2);
    var actualVel = Math.round(cfm / actualArea);

    // Find closest rectangular equivalent from RECT_COMMON
    var bestRect = null;
    for (var j = 0; j < RECT_COMMON.length; j++) {
      var eq = _rectEquivDia(RECT_COMMON[j][0], RECT_COMMON[j][1]);
      if (eq >= bestRound * 0.9) { bestRect = RECT_COMMON[j]; break; }
    }

    return {
      roundDia: bestRound,
      roundLabel: bestRound + '"ø',
      rectLabel: bestRect ? bestRect[0] + 'x' + bestRect[1] + '"' : '—',
      velocity: actualVel,
      status: actualVel <= (isCommercial ? 1500 : 1000) ? 'ok' : actualVel <= (isCommercial ? 2000 : 1200) ? 'warn' : 'high'
    };
  }

  // ── Rectangular Duct Sizes ─────────────────────────────────────
  var RECT_COMMON = [
    [8,6],[8,8],[10,6],[10,8],[10,10],
    [12,6],[12,8],[12,10],[12,12],
    [14,8],[14,10],[14,12],[14,14],
    [16,8],[16,10],[16,12],[16,14],[16,16],
    [18,10],[18,12],[18,14],[18,16],[18,18],
    [20,10],[20,12],[20,14],[20,16],[20,18],[20,20],
    [22,12],[22,14],[22,16],[22,18],[22,20],[22,22],
    [24,12],[24,14],[24,16],[24,18],[24,20],[24,24],
    [26,14],[26,16],[26,18],[26,20],[26,24],
    [28,14],[28,16],[28,18],[28,20],[28,24],[28,28],
    [30,16],[30,18],[30,20],[30,24],[30,30],
    [36,18],[36,20],[36,24],[36,30],[36,36],
    [42,24],[42,30],[48,24],[48,30],[48,36]
  ];

  // ── Fitting Types with Equivalent Lengths (ft) ─────────────────
  var FITTING_TYPES = [
    { id:'elbow90', es:'Codo 90° Radio', en:'90° Radius Elbow', icon:'↩',
      el:{4:5,5:6,6:7,7:8,8:10,9:11,10:12,12:15,14:17,16:20,18:22,20:25,22:27,24:30,26:33,28:35,30:38,36:45}},
    { id:'elbow90m', es:'Codo 90° Miter', en:'90° Mitered Elbow', icon:'⊾',
      el:{4:10,5:12,6:14,7:16,8:20,9:22,10:24,12:30,14:35,16:40,18:45,20:50,22:55,24:60,26:65,28:70,30:75,36:90}},
    { id:'elbow45', es:'Codo 45°', en:'45° Elbow', icon:'↗',
      el:{4:3,5:4,6:4,7:5,8:6,9:7,10:7,12:9,14:10,16:12,18:13,20:15,22:16,24:18,26:20,28:21,30:23,36:27}},
    { id:'tee', es:'Tee Ramal', en:'Tee Branch', icon:'⊤',
      el:{4:10,5:13,6:15,7:17,8:20,9:23,10:25,12:30,14:35,16:40,18:45,20:50,22:55,24:65,26:70,28:75,30:80,36:95}},
    { id:'wye', es:'Wye 45°', en:'45° Wye', icon:'Y',
      el:{4:5,5:6,6:7,7:8,8:10,9:11,10:12,12:15,14:18,16:20,18:23,20:25,22:28,24:30,26:33,28:35,30:38,36:45}},
    { id:'transition', es:'Transición', en:'Transition', icon:'▷',
      el:{4:3,5:3,6:4,7:4,8:5,9:5,10:6,12:7,14:8,16:10,18:11,20:12,22:14,24:15,26:17,28:18,30:20,36:24}},
    { id:'boot_supply', es:'Boot Suministro', en:'Supply Boot', icon:'⬒',
      el:{4:30,5:32,6:35,7:37,8:40,10:45,12:50,14:55,16:60}},
    { id:'boot_return', es:'Boot Retorno', en:'Return Boot', icon:'⬓',
      el:{8:15,10:18,12:20,14:22,16:25,18:28,20:30,24:35}},
    { id:'takeoff', es:'Takeoff', en:'Takeoff', icon:'⊥',
      el:{4:10,5:11,6:12,7:13,8:15,9:16,10:18,12:20,14:22,16:25}},
    { id:'offset', es:'Offset', en:'Offset', icon:'⇗',
      el:{4:5,5:6,6:7,7:8,8:10,9:11,10:12,12:15,14:17,16:20,18:22,20:25,24:30}},
    { id:'endcap', es:'Tapa Final', en:'End Cap', icon:'⊡',
      el:{4:2,5:2,6:3,7:3,8:3,9:4,10:4,12:5,14:5,16:6,18:6,20:7,24:8}}
  ];

  // ── Register Data — Manual T ───────────────────────────────────
  var SUPPLY_REGISTERS = [
    { size:'4×10', cfm:[25,75], throw:[2,4], nc:20 },
    { size:'4×12', cfm:[35,100], throw:[2,5], nc:22 },
    { size:'6×4', cfm:[40,80], throw:[2,5], nc:25 },
    { size:'6×10', cfm:[50,125], throw:[3,6], nc:25 },
    { size:'6×12', cfm:[60,150], throw:[3,7], nc:27 },
    { size:'6×14', cfm:[75,175], throw:[4,8], nc:28 },
    { size:'8×4', cfm:[60,120], throw:[3,7], nc:28 },
    { size:'8×6', cfm:[75,160], throw:[4,8], nc:28 },
    { size:'10×4', cfm:[80,150], throw:[4,8], nc:30 },
    { size:'10×6', cfm:[100,200], throw:[5,10], nc:30 },
    { size:'10×8', cfm:[125,250], throw:[6,12], nc:32 },
    { size:'12×4', cfm:[100,180], throw:[5,9], nc:32 },
    { size:'12×6', cfm:[130,250], throw:[6,12], nc:35 },
    { size:'12×8', cfm:[170,330], throw:[7,14], nc:35 },
    { size:'14×6', cfm:[160,300], throw:[7,14], nc:35 },
    { size:'14×8', cfm:[200,400], throw:[8,16], nc:37 },
    { size:'16×8', cfm:[250,500], throw:[10,20], nc:38 },
    { size:'18×8', cfm:[300,550], throw:[11,22], nc:40 },
    { size:'20×8', cfm:[350,600], throw:[12,25], nc:40 },
    { size:'24×8', cfm:[400,800], throw:[15,30], nc:42 },
    { size:'24×10', cfm:[500,1000], throw:[18,35], nc:44 },
    { size:'30×10', cfm:[600,1200], throw:[20,40], nc:45 },
    { size:'36×12', cfm:[800,1600], throw:[25,50], nc:48 }
  ];

  var RETURN_GRILLES = [
    { size:'12×6', cfm:[80,160], freeArea:75, maxVel:400 },
    { size:'12×12', cfm:[150,300], freeArea:75, maxVel:400 },
    { size:'14×6', cfm:[100,200], freeArea:75, maxVel:400 },
    { size:'14×14', cfm:[200,400], freeArea:75, maxVel:400 },
    { size:'16×8', cfm:[150,300], freeArea:75, maxVel:400 },
    { size:'16×16', cfm:[300,500], freeArea:75, maxVel:400 },
    { size:'20×14', cfm:[350,550], freeArea:75, maxVel:400 },
    { size:'20×20', cfm:[500,800], freeArea:75, maxVel:400 },
    { size:'24×18', cfm:[550,900], freeArea:75, maxVel:400 },
    { size:'24×24', cfm:[700,1200], freeArea:75, maxVel:400 },
    { size:'30×18', cfm:[700,1100], freeArea:75, maxVel:400 },
    { size:'30×24', cfm:[900,1500], freeArea:75, maxVel:400 },
    { size:'30×30', cfm:[1100,1800], freeArea:75, maxVel:400 },
    { size:'36×24', cfm:[1100,1800], freeArea:75, maxVel:400 },
    { size:'36×36', cfm:[1600,2600], freeArea:75, maxVel:400 }
  ];

  // ── Manual Q — Commercial Duct Design Reference ────────────────
  var MQ_VELOCITY = [
    { es:'Ducto Principal Supply', en:'Main Supply Duct', max:1200, rec:'1000-1200' },
    { es:'Ducto Principal Return', en:'Main Return Duct', max:1000, rec:'800-1000' },
    { es:'Ramal Supply', en:'Branch Supply', max:1000, rec:'600-900' },
    { es:'Ramal Return', en:'Branch Return', max:800, rec:'600-800' },
    { es:'Riser / Vertical', en:'Riser / Vertical', max:1500, rec:'1000-1500' },
    { es:'Registro Supply', en:'Supply Register Face', max:700, rec:'500-700' },
    { es:'Rejilla Return', en:'Return Grille Face', max:500, rec:'300-500' },
    { es:'Filtro', en:'Filter Face', max:400, rec:'300-400' },
    { es:'Damper', en:'Damper', max:1500, rec:'1000-1500' },
    { es:'Louver Exterior', en:'Outdoor Louver', max:500, rec:'400-500' }
  ];

  var MQ_FRICTION = [
    { es:'Residencial', en:'Residential', rate:'0.08', note_es:'Casas — diseño estándar', note_en:'Homes — standard design' },
    { es:'Comercial Bajo Ruido', en:'Low-Noise Commercial', rate:'0.05-0.06', note_es:'Hospitales, oficinas, iglesias', note_en:'Hospitals, offices, churches' },
    { es:'Comercial Estándar', en:'Standard Commercial', rate:'0.08-0.10', note_es:'Tiendas, escuelas, restaurantes', note_en:'Retail, schools, restaurants' },
    { es:'Industrial', en:'Industrial', rate:'0.10-0.15', note_es:'Fábricas, almacenes, talleres', note_en:'Factories, warehouses, shops' }
  ];

  var MQ_DUCT_CLASS = [
    { cls:'½"', psi:'0 – ½" wc', es:'Residencial, flex duct', en:'Residential, flex duct' },
    { cls:'1"', psi:'½ – 1" wc', es:'Comercial pequeño', en:'Small commercial' },
    { cls:'2"', psi:'1 – 2" wc', es:'Comercial medio', en:'Medium commercial' },
    { cls:'3"', psi:'2 – 3" wc', es:'Comercial grande', en:'Large commercial' },
    { cls:'4"', psi:'3 – 4" wc', es:'VAV, alta velocidad', en:'VAV, high velocity' },
    { cls:'6"', psi:'4 – 6" wc', es:'Industrial', en:'Industrial' },
    { cls:'10"', psi:'6 – 10" wc', es:'Industrial pesado', en:'Heavy industrial' }
  ];

  var MQ_TONS_CFM = [
    { tons:1.5, btu:18000, cfm:600 },
    { tons:2, btu:24000, cfm:800 },
    { tons:2.5, btu:30000, cfm:1000 },
    { tons:3, btu:36000, cfm:1200 },
    { tons:3.5, btu:42000, cfm:1400 },
    { tons:4, btu:48000, cfm:1600 },
    { tons:5, btu:60000, cfm:2000 },
    { tons:6, btu:72000, cfm:2400 },
    { tons:7.5, btu:90000, cfm:3000 },
    { tons:10, btu:120000, cfm:4000 },
    { tons:12.5, btu:150000, cfm:5000 },
    { tons:15, btu:180000, cfm:6000 },
    { tons:20, btu:240000, cfm:8000 },
    { tons:25, btu:300000, cfm:10000 }
  ];

  // ── Equipment Types ────────────────────────────────────────────
  var EQUIP_TYPES = {
    ah:      { label:'AH', es:'Air Handler', en:'Air Handler', color:'#f59e0b', w:60, h:40 },
    cu:      { label:'CU', es:'Condensador', en:'Condenser', color:'#ef4444', w:50, h:50 },
    furnace: { label:'FN', es:'Furnace', en:'Furnace', color:'#f97316', w:50, h:60 },
    sr:      { label:'SR', es:'Supply', en:'Supply Register', color:'#ef4444', w:30, h:20 },
    rg:      { label:'RG', es:'Return', en:'Return Grille', color:'#3b82f6', w:40, h:30 },
    trunk:   { label:'T', es:'Trunk', en:'Trunk Duct', color:'#22c55e', w:80, h:20 },
    branch:  { label:'B', es:'Branch', en:'Branch Duct', color:'#14b8a6', w:50, h:14 },
    ms:      { label:'MS', es:'Mini Split', en:'Mini Split', color:'#8b5cf6', w:60, h:20 }
  };

  // ── State ──────────────────────────────────────────────────────
  var _canvas, _ctx;
  var _tool = 'draw'; // draw | equipment | duct | measure | eraser | pan | fitting | wall | door | window_ | room | blower
  var _equipType = 'ah';
  var _fittingType = 'elbow90';
  var _fittingSize = 8;
  var _drawing = false;
  var _paths = [];
  var _currentPath = null;
  var _ductStart = null;
  var _ductStartSide = null; // 'supply' | 'return' | null
  var _wallStart = null;
  var _measureStart = null;
  var _livePos = null; // cursor pos during duct placement for live preview
  var _offsetX = 0, _offsetY = 0, _scale = 1;
  var _lastPinchDist = 0;
  var _panStartX = 0, _panStartY = 0;
  var _isPanning = false;
  var _undoStack = [];
  var _systemCFM = 1200;
  var _isEN = false;
  var _totalEL = 0;
  var _wallThickPx = WALL_THICKNESS;

  // Drag & drop state
  var _dragIdx = -1;          // Index of object being dragged in _paths
  var _isDragging = false;
  var _dragOffX = 0, _dragOffY = 0; // Offset from object center to grab point
  var _longPressTimer = null;
  var _longPressPos = null;
  var _dragEndpoint = null;   // { idx, which: 'start'|'end' } for duct endpoint drag
  var _dragFromPalette = null; // { type, data } for palette-to-canvas drag
  var _dragPalettePos = null;  // Current screen position of palette drag ghost

  function _lang() {
    return (typeof window._lang !== 'undefined' && window._lang === 'en') ? 'en' : 'es';
  }

  // ── Canvas Helpers ─────────────────────────────────────────────
  function _getCanvasXY(e) {
    var rect = _canvas.getBoundingClientRect();
    var touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left - _offsetX) / _scale,
      y: (touch.clientY - rect.top - _offsetY) / _scale
    };
  }

  function _resizeCanvas() {
    var container = _canvas.parentElement;
    _canvas.width = container.clientWidth;
    _canvas.height = container.clientHeight;
    _render();
  }

  // ── Hit Testing for Drag & Drop ─────────────────────────────────
  function _hitTestObject(x, y) {
    // Returns { idx, type } of the topmost object at (x,y), or null
    for (var i = _paths.length - 1; i >= 0; i--) {
      var obj = _paths[i];
      if (obj.type === 'equip') {
        var eq = EQUIP_TYPES[obj.kind] || EQUIP_TYPES.ah;
        var ew = (obj.rotation === 90 ? eq.h : eq.w) / 2 + 8;
        var eh = (obj.rotation === 90 ? eq.w : eq.h) / 2 + 8;
        if (Math.abs(x - obj.x) < ew && Math.abs(y - obj.y) < eh) return { idx: i, type: 'equip' };
      } else if (obj.type === 'blower') {
        var bw = (obj.rotation === 90 ? 50 : 70) / 2 + 8;
        var bh = (obj.rotation === 90 ? 70 : 50) / 2 + 8;
        if (Math.abs(x - obj.x) < bw && Math.abs(y - obj.y) < bh) return { idx: i, type: 'blower' };
      } else if (obj.type === 'fitting') {
        if (Math.abs(x - obj.x) < 18 && Math.abs(y - obj.y) < 18) return { idx: i, type: 'fitting' };
      } else if (obj.type === 'room') {
        if (Math.abs(x - obj.x) < 30 && Math.abs(y - obj.y) < 18) return { idx: i, type: 'room' };
      } else if (obj.type === 'label') {
        if (Math.abs(x - obj.x) < 30 && Math.abs(y - obj.y) < 14) return { idx: i, type: 'label' };
      } else if (obj.type === 'door') {
        if (Math.abs(x - obj.x) < 22 && Math.abs(y - obj.y) < 22) return { idx: i, type: 'door' };
      } else if (obj.type === 'window') {
        if (Math.abs(x - obj.x) < 24 && Math.abs(y - obj.y) < 12) return { idx: i, type: 'window' };
      }
    }
    return null;
  }

  function _hitTestDuctEndpoint(x, y) {
    // Returns { idx, which: 'start'|'end' } if near a duct endpoint
    var threshold = 12;
    for (var i = _paths.length - 1; i >= 0; i--) {
      var obj = _paths[i];
      if (obj.type !== 'ductline') continue;
      var d2 = Math.sqrt(Math.pow(x - obj.x2, 2) + Math.pow(y - obj.y2, 2));
      if (d2 < threshold) return { idx: i, which: 'end' };
      var d1 = Math.sqrt(Math.pow(x - obj.x1, 2) + Math.pow(y - obj.y1, 2));
      if (d1 < threshold) return { idx: i, which: 'start' };
    }
    return null;
  }

  function _hitTestDuctSegment(x, y) {
    // Returns { idx } if near a duct line segment (for moving the whole duct)
    var threshold = 12;
    for (var i = _paths.length - 1; i >= 0; i--) {
      var obj = _paths[i];
      if (obj.type !== 'ductline') continue;
      // Point-to-segment distance
      var dx = obj.x2 - obj.x1, dy = obj.y2 - obj.y1;
      var lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;
      var t = Math.max(0, Math.min(1, ((x - obj.x1) * dx + (y - obj.y1) * dy) / lenSq));
      var px = obj.x1 + t * dx, py = obj.y1 + t * dy;
      var d = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
      if (d < threshold) return { idx: i, type: 'ductline' };
    }
    return null;
  }

  function _hitTestWall(x, y) {
    var threshold = 10;
    for (var i = _paths.length - 1; i >= 0; i--) {
      var obj = _paths[i];
      if (obj.type !== 'wall') continue;
      var dx = obj.x2 - obj.x1, dy = obj.y2 - obj.y1;
      var lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;
      var t = Math.max(0, Math.min(1, ((x - obj.x1) * dx + (y - obj.y1) * dy) / lenSq));
      var px = obj.x1 + t * dx, py = obj.y1 + t * dy;
      var d = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
      if (d < threshold) return { idx: i, type: 'wall' };
    }
    return null;
  }

  // ── Fitting Helpers ────────────────────────────────────────────
  function _getFittingDef(id) {
    for (var i = 0; i < FITTING_TYPES.length; i++) {
      if (FITTING_TYPES[i].id === id) return FITTING_TYPES[i];
    }
    return FITTING_TYPES[0];
  }

  function _getFittingEL(id, size) {
    var def = _getFittingDef(id);
    if (def.el[size]) return def.el[size];
    // Find nearest size
    var keys = Object.keys(def.el).map(Number).sort(function(a,b){return a-b;});
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] >= size) return def.el[keys[i]];
    }
    return def.el[keys[keys.length - 1]] || 0;
  }

  function _findNearestDuct(x, y, maxDist) {
    var best = null, bestD = maxDist || 40;
    for (var i = 0; i < _paths.length; i++) {
      var obj = _paths[i];
      if (obj.type !== 'ductline') continue;
      // Check distance to endpoints
      var d1 = Math.sqrt(Math.pow(x - obj.x1, 2) + Math.pow(y - obj.y1, 2));
      var d2 = Math.sqrt(Math.pow(x - obj.x2, 2) + Math.pow(y - obj.y2, 2));
      // Check distance to midpoint too
      var mx = (obj.x1 + obj.x2) / 2, my = (obj.y1 + obj.y2) / 2;
      var dm = Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2));
      var minD = Math.min(d1, d2, dm);
      if (minD < bestD) { bestD = minD; best = obj; }
    }
    return best;
  }

  function _extractDuctDia(sizeStr) {
    // Parse "10"ø / 12x8"" → round diameter
    if (!sizeStr) return 0;
    var m = sizeStr.match(/(\d+)"ø/);
    if (m) return parseInt(m[1]);
    return 0;
  }

  function _recalcTotalEL() {
    _totalEL = 0;
    for (var i = 0; i < _paths.length; i++) {
      if (_paths[i].type === 'fitting' && _paths[i].el) {
        _totalEL += _paths[i].el;
      }
    }
    // Update hint bar
    var hint = document.getElementById('ddHint');
    if (hint && _totalEL > 0) {
      hint.textContent = (_isEN ? 'Total Equivalent Length: ' : 'Longitud Equivalente Total: ') + _totalEL + ' ft';
    }
  }

  // ── Render ─────────────────────────────────────────────────────
  function _render() {
    if (!_ctx) return;
    var w = _canvas.width, h = _canvas.height;
    _ctx.clearRect(0, 0, w, h);

    _ctx.fillStyle = COLORS.bg;
    _ctx.fillRect(0, 0, w, h);

    _ctx.save();
    _ctx.translate(_offsetX, _offsetY);
    _ctx.scale(_scale, _scale);

    // Grid
    var gridStep = GRID_SIZE;
    var startX = Math.floor(-_offsetX / _scale / gridStep) * gridStep;
    var startY = Math.floor(-_offsetY / _scale / gridStep) * gridStep;
    var endX = startX + w / _scale + gridStep * 2;
    var endY = startY + h / _scale + gridStep * 2;

    _ctx.lineWidth = 0.5;
    for (var gx = startX; gx < endX; gx += gridStep) {
      _ctx.strokeStyle = (gx % (gridStep * 5) === 0) ? COLORS.gridMajor : COLORS.grid;
      _ctx.beginPath(); _ctx.moveTo(gx, startY); _ctx.lineTo(gx, endY); _ctx.stroke();
    }
    for (var gy = startY; gy < endY; gy += gridStep) {
      _ctx.strokeStyle = (gy % (gridStep * 5) === 0) ? COLORS.gridMajor : COLORS.grid;
      _ctx.beginPath(); _ctx.moveTo(startX, gy); _ctx.lineTo(endX, gy); _ctx.stroke();
    }

    // Draw all objects
    for (var i = 0; i < _paths.length; i++) {
      var obj = _paths[i];
      if (obj.type === 'wall') _drawWall(obj);
      else if (obj.type === 'door') _drawDoor(obj);
      else if (obj.type === 'window') _drawWindow(obj);
      else if (obj.type === 'room') _drawRoom(obj);
      else if (obj.type === 'path') _drawPath(obj);
      else if (obj.type === 'equip') _drawEquip(obj);
      else if (obj.type === 'blower') _drawBlower(obj);
      else if (obj.type === 'ductline') _drawDuctLine(obj);
      else if (obj.type === 'label') _drawLabel(obj);
      else if (obj.type === 'fitting') _drawFitting(obj);
    }

    // Current drawing path
    if (_currentPath && _currentPath.type === 'path' && _currentPath.points.length > 1) {
      _drawPath(_currentPath);
    }

    // Duct start indicator
    if (_ductStart) {
      _ctx.beginPath();
      _ctx.arc(_ductStart.x, _ductStart.y, 7, 0, Math.PI * 2);
      _ctx.fillStyle = _ductStartSide === 'supply' ? 'rgba(220,38,38,0.3)' : _ductStartSide === 'return' ? 'rgba(37,99,235,0.3)' : 'rgba(22,163,74,0.3)';
      _ctx.fill();
      _ctx.strokeStyle = _ductStartSide === 'supply' ? '#dc2626' : _ductStartSide === 'return' ? '#2563eb' : '#16a34a';
      _ctx.lineWidth = 2.5; _ctx.stroke();
    }

    // Measure start indicator
    if (_measureStart) {
      _ctx.beginPath();
      _ctx.arc(_measureStart.x, _measureStart.y, 6, 0, Math.PI * 2);
      _ctx.fillStyle = 'rgba(146,64,14,0.3)';
      _ctx.fill();
      _ctx.strokeStyle = '#92400e'; _ctx.lineWidth = 2; _ctx.stroke();
    }

    // Wall start indicator
    if (_wallStart) {
      _ctx.beginPath();
      _ctx.arc(_wallStart.x, _wallStart.y, 5, 0, Math.PI * 2);
      _ctx.fillStyle = 'rgba(51,65,85,0.3)';
      _ctx.fill();
      _ctx.strokeStyle = '#0F0F0F'; _ctx.lineWidth = 2; _ctx.stroke();
    }

    // Live duct preview (real-time velocity while extending)
    if (_ductStart && _livePos) {
      var isSupply = _ductStartSide === 'supply';
      var isReturn = _ductStartSide === 'return';
      var previewColor = isSupply ? COLORS.supplyDuct : isReturn ? COLORS.returnDuct : '#22c55e';

      // Preview line
      _ctx.beginPath();
      _ctx.moveTo(_ductStart.x, _ductStart.y);
      _ctx.lineTo(_livePos.x, _livePos.y);
      _ctx.strokeStyle = previewColor + '88';
      _ctx.lineWidth = 4;
      _ctx.setLineDash([8, 6]);
      _ctx.lineCap = 'round';
      _ctx.stroke();
      _ctx.setLineDash([]);

      // Calculate live stats
      var ldx = _livePos.x - _ductStart.x, ldy = _livePos.y - _ductStart.y;
      var liveDist = Math.sqrt(ldx * ldx + ldy * ldy) / GRID_SIZE;
      var liveDistRound = Math.round(liveDist);

      var blower = _findBlower();
      var liveCFM = blower ? (blower.cfm || _systemCFM) : _systemCFM;
      var liveSizing = _calcDuctSize(liveCFM, false);
      var cumDist = _getCumulativeDist(_ductStart.x, _ductStart.y, _ductStartSide) + liveDistRound;
      var liveVel = _calcLiveVelocity(liveCFM, cumDist, liveSizing.roundDia);

      // Floating info box at cursor
      var fx = _livePos.x, fy = _livePos.y - 50;
      var statusColor = liveVel.status === 'ok' ? '#4ade80' : liveVel.status === 'warn' ? '#fbbf24' : '#f87171';

      // Friction rate for preview
      var liveFR = (0.08 * Math.pow(liveVel.velocity / 900, 1.82)).toFixed(2);

      _ctx.fillStyle = COLORS.labelBg;
      _ctx.beginPath(); _ctx.roundRect(fx - 70, fy - 36, 140, 72, 8); _ctx.fill();
      _ctx.strokeStyle = previewColor;
      _ctx.lineWidth = 2; _ctx.stroke();

      _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
      // Side label
      if (isSupply || isReturn) {
        _ctx.fillStyle = previewColor;
        _ctx.font = 'bold 8px Inter, sans-serif';
        _ctx.fillText(isSupply ? '● SUPPLY' : '● RETURN', fx, fy - 28);
      }
      // Duct size
      _ctx.fillStyle = '#15803d';
      _ctx.font = 'bold 11px Inter, sans-serif';
      _ctx.fillText(liveSizing.roundLabel + ' | ' + liveCFM + ' CFM', fx, fy - 15);
      // Velocity
      _ctx.fillStyle = statusColor;
      _ctx.font = 'bold 11px Inter, sans-serif';
      _ctx.fillText(liveVel.velocity + ' FPM', fx, fy - 1);
      // Distance + FR
      _ctx.fillStyle = '#57574F';
      _ctx.font = '9px Inter, sans-serif';
      _ctx.fillText(liveDistRound + ' ft · FR ' + liveFR, fx, fy + 12);
      // Budget
      _ctx.fillStyle = '#92400e';
      _ctx.font = 'bold 8px Inter, sans-serif';
      _ctx.fillText((_isEN ? 'Budget: ' : 'Presupuesto: ') + liveVel.budgetPct + '%', fx, fy + 24);
      // Budget bar
      var barW = 110, barH = 4;
      _ctx.fillStyle = 'rgba(0,0,0,0.08)';
      _ctx.beginPath(); _ctx.roundRect(fx - barW / 2, fy + 30, barW, barH, 2); _ctx.fill();
      var fillW = Math.min(barW, barW * liveVel.budgetPct / 100);
      _ctx.fillStyle = statusColor;
      _ctx.beginPath(); _ctx.roundRect(fx - barW / 2, fy + 30, fillW, barH, 2); _ctx.fill();
    }

    // Drag selection highlight
    if (_isDragging && _dragIdx >= 0 && _dragIdx < _paths.length) {
      var dObj = _paths[_dragIdx];
      _ctx.save();
      _ctx.strokeStyle = '#3b82f6';
      _ctx.lineWidth = 2;
      _ctx.setLineDash([5, 3]);
      if (dObj.type === 'ductline') {
        _ctx.beginPath();
        _ctx.moveTo(dObj.x1, dObj.y1);
        _ctx.lineTo(dObj.x2, dObj.y2);
        _ctx.stroke();
      } else if (dObj.type === 'wall') {
        _ctx.beginPath();
        _ctx.moveTo(dObj.x1, dObj.y1);
        _ctx.lineTo(dObj.x2, dObj.y2);
        _ctx.stroke();
      } else if (dObj.x !== undefined && dObj.y !== undefined) {
        _ctx.beginPath();
        _ctx.arc(dObj.x, dObj.y, 20, 0, Math.PI * 2);
        _ctx.stroke();
      }
      _ctx.setLineDash([]);
      _ctx.restore();
    }

    // Duct endpoint drag highlight
    if (_isDragging && _dragEndpoint) {
      var deObj = _paths[_dragEndpoint.idx];
      if (deObj) {
        var epx = _dragEndpoint.which === 'end' ? deObj.x2 : deObj.x1;
        var epy = _dragEndpoint.which === 'end' ? deObj.y2 : deObj.y1;
        _ctx.beginPath();
        _ctx.arc(epx, epy, 8, 0, Math.PI * 2);
        _ctx.fillStyle = 'rgba(59,130,246,0.3)';
        _ctx.fill();
        _ctx.strokeStyle = '#3b82f6';
        _ctx.lineWidth = 2; _ctx.stroke();
      }
    }

    // Wall preview
    if (_wallStart && _livePos) {
      _ctx.beginPath();
      _ctx.moveTo(_wallStart.x, _wallStart.y);
      _ctx.lineTo(_livePos.x, _livePos.y);
      _ctx.strokeStyle = 'rgba(51,65,85,0.5)';
      _ctx.lineWidth = _wallThickPx;
      _ctx.setLineDash([6, 4]);
      _ctx.lineCap = 'round';
      _ctx.stroke();
      _ctx.setLineDash([]);
      // Distance
      var wdx = _livePos.x - _wallStart.x, wdy = _livePos.y - _wallStart.y;
      var wDist = Math.round(Math.sqrt(wdx * wdx + wdy * wdy) / GRID_SIZE);
      if (wDist > 0) {
        var wmx = (_wallStart.x + _livePos.x) / 2, wmy = (_wallStart.y + _livePos.y) / 2;
        _ctx.fillStyle = '#0F0F0F';
        _ctx.font = 'bold 10px Inter, sans-serif';
        _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
        _ctx.fillText(wDist + '\'', wmx, wmy - 12);
      }
    }

    _ctx.restore();
  }

  function _drawPath(obj) {
    if (obj.points.length < 2) return;
    _ctx.beginPath();
    _ctx.moveTo(obj.points[0].x, obj.points[0].y);
    for (var j = 1; j < obj.points.length; j++) {
      _ctx.lineTo(obj.points[j].x, obj.points[j].y);
    }
    _ctx.strokeStyle = obj.color || COLORS.draw;
    _ctx.lineWidth = obj.width || 2;
    _ctx.lineCap = 'round'; _ctx.lineJoin = 'round';
    _ctx.stroke();
  }

  function _drawEquip(obj) {
    var eq = EQUIP_TYPES[obj.kind] || EQUIP_TYPES.ah;
    var rot = obj.rotation || 0;
    var ew = rot === 90 ? eq.h : eq.w;
    var eh = rot === 90 ? eq.w : eq.h;
    var hw = ew / 2, hh = eh / 2;

    _ctx.save();
    _ctx.translate(obj.x, obj.y);

    // Box
    _ctx.fillStyle = '#fff';
    _ctx.strokeStyle = eq.color;
    _ctx.lineWidth = 2;
    _ctx.beginPath();
    _ctx.roundRect(-hw, -hh, ew, eh, 4);
    _ctx.fill(); _ctx.stroke();

    // Rotation indicator
    if (rot === 90) {
      _ctx.fillStyle = 'rgba(0,0,0,0.25)';
      _ctx.font = '8px Inter, sans-serif';
      _ctx.textAlign = 'right';
      _ctx.fillText('↻', hw - 2, -hh + 9);
    }

    // Label
    _ctx.fillStyle = eq.color;
    _ctx.font = 'bold 12px Inter, sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText(eq.label, 0, 0);

    // Sub-label (CFM or custom)
    if (obj.label) {
      _ctx.fillStyle = '#3D3D3A';
      _ctx.font = '9px Inter, sans-serif';
      _ctx.fillText(obj.label, 0, hh + 10);
    }

    _ctx.restore();
  }

  function _drawDuctLine(obj) {
    _ctx.beginPath();
    _ctx.moveTo(obj.x1, obj.y1); _ctx.lineTo(obj.x2, obj.y2);
    var ductColor = obj.ductSide === 'supply' ? COLORS.supplyDuct : obj.ductSide === 'return' ? COLORS.returnDuct : (obj.cfm > 400 ? '#22c55e' : '#14b8a6');
    _ctx.strokeStyle = ductColor;
    _ctx.lineWidth = Math.max(3, Math.min(12, obj.cfm / 100));
    _ctx.lineCap = 'round'; _ctx.stroke();

    var mx = (obj.x1 + obj.x2) / 2, my = (obj.y1 + obj.y2) / 2;
    var dx = obj.x2 - obj.x1, dy = obj.y2 - obj.y1;
    var distFt = Math.round(Math.sqrt(dx * dx + dy * dy) / GRID_SIZE);

    // Friction rate estimate: FR ≈ 0.08 × (V/900)^1.82
    var frRate = obj.velocity ? (0.08 * Math.pow(obj.velocity / 900, 1.82)).toFixed(2) : '0.08';

    // Endpoint data bubble (at midpoint)
    var boxH = obj.ductSide ? 64 : 54;
    _ctx.fillStyle = COLORS.labelBg;
    _ctx.beginPath(); _ctx.roundRect(mx - 58, my - boxH / 2, 116, boxH, 6); _ctx.fill();
    _ctx.strokeStyle = ductColor; _ctx.lineWidth = 1.5; _ctx.stroke();

    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    var labelY = my - boxH / 2 + 8;
    // Side label
    if (obj.ductSide) {
      _ctx.fillStyle = ductColor;
      _ctx.font = 'bold 8px Inter, sans-serif';
      _ctx.fillText(obj.ductSide === 'supply' ? '● SUPPLY' : '● RETURN', mx, labelY);
      labelY += 11;
    }
    _ctx.fillStyle = '#15803d';
    _ctx.font = 'bold 11px Inter, sans-serif';
    _ctx.fillText(obj.size || '—', mx, labelY);
    _ctx.fillStyle = '#0F0F0F';
    _ctx.font = '9px Inter, sans-serif';
    _ctx.fillText(obj.cfm + ' CFM · ' + (obj.velocity || '—') + ' FPM', mx, labelY + 13);
    _ctx.fillStyle = '#92400e';
    _ctx.font = 'bold 8px Inter, sans-serif';
    _ctx.fillText(distFt + ' ft · FR ' + frRate, mx, labelY + 24);

    // Endpoint dot (for chaining/branching)
    _ctx.beginPath();
    _ctx.arc(obj.x2, obj.y2, 5, 0, Math.PI * 2);
    _ctx.fillStyle = ductColor;
    _ctx.fill();
    _ctx.strokeStyle = '#fff';
    _ctx.lineWidth = 1.5;
    _ctx.stroke();
  }

  function _drawLabel(obj) {
    _ctx.fillStyle = COLORS.labelBg;
    _ctx.font = 'bold 11px Inter, sans-serif';
    var tw = _ctx.measureText(obj.text).width + 12;
    _ctx.beginPath(); _ctx.roundRect(obj.x - tw / 2, obj.y - 10, tw, 20, 4); _ctx.fill();
    _ctx.strokeStyle = COLORS.labelBorder; _ctx.lineWidth = 1; _ctx.stroke();
    _ctx.fillStyle = '#0F0F0F';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText(obj.text, obj.x, obj.y);
  }

  function _drawFitting(obj) {
    var def = _getFittingDef(obj.kind);
    var isValid = obj.valid !== false;
    var baseColor = isValid ? COLORS.fitting : COLORS.fittingBad;
    var r = 14;

    _ctx.save();
    _ctx.translate(obj.x, obj.y);
    if (obj.rotation) _ctx.rotate(obj.rotation * Math.PI / 180);

    // Circle background
    _ctx.beginPath();
    _ctx.arc(0, 0, r, 0, Math.PI * 2);
    _ctx.fillStyle = '#fff';
    _ctx.fill();
    _ctx.strokeStyle = baseColor;
    _ctx.lineWidth = 2;
    _ctx.stroke();

    // Icon
    _ctx.fillStyle = baseColor;
    _ctx.font = 'bold 14px Inter, sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText(def.icon, 0, 0);

    _ctx.restore();

    // EL label below
    var elStr = obj.el + ' ft EL';
    _ctx.fillStyle = COLORS.labelBg;
    var ltw = _ctx.measureText(elStr).width + 10;
    _ctx.beginPath(); _ctx.roundRect(obj.x - ltw / 2, obj.y + r + 2, ltw, 16, 3); _ctx.fill();
    _ctx.strokeStyle = COLORS.labelBorder; _ctx.lineWidth = 0.5; _ctx.stroke();
    _ctx.fillStyle = isValid ? '#6d28d9' : '#dc2626';
    _ctx.font = 'bold 9px Inter, sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText(elStr, obj.x, obj.y + r + 10);

    // Size label
    _ctx.fillStyle = '#57574F';
    _ctx.font = '8px Inter, sans-serif';
    _ctx.fillText(obj.size + '"', obj.x, obj.y - r - 6);

    // Invalid marker
    if (!isValid) {
      _ctx.fillStyle = '#f87171';
      _ctx.font = 'bold 10px Inter, sans-serif';
      _ctx.fillText('⚠', obj.x + r + 4, obj.y - r + 2);
    }
  }

  // ── Floor Plan Drawing ──────────────────────────────────────────
  function _drawWall(obj) {
    var dx = obj.x2 - obj.x1, dy = obj.y2 - obj.y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    var nx = -dy / len * _wallThickPx / 2;
    var ny = dx / len * _wallThickPx / 2;

    _ctx.fillStyle = COLORS.wallFill;
    _ctx.beginPath();
    _ctx.moveTo(obj.x1 + nx, obj.y1 + ny);
    _ctx.lineTo(obj.x2 + nx, obj.y2 + ny);
    _ctx.lineTo(obj.x2 - nx, obj.y2 - ny);
    _ctx.lineTo(obj.x1 - nx, obj.y1 - ny);
    _ctx.closePath();
    _ctx.fill();

    _ctx.strokeStyle = COLORS.wall;
    _ctx.lineWidth = 1;
    _ctx.stroke();

    // Distance label
    var distFt = Math.round(len / GRID_SIZE);
    if (distFt > 1) {
      var mx = (obj.x1 + obj.x2) / 2, my = (obj.y1 + obj.y2) / 2;
      _ctx.fillStyle = '#57574F';
      _ctx.font = 'bold 9px Inter, sans-serif';
      _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
      _ctx.fillText(distFt + '\'', mx, my - _wallThickPx - 5);
    }
  }

  function _drawDoor(obj) {
    var w = obj.width || 36; // pixels (~1.8ft)
    var hw = w / 2;
    _ctx.save();
    _ctx.translate(obj.x, obj.y);
    if (obj.rotation) _ctx.rotate(obj.rotation * Math.PI / 180);

    // Gap (clear wall)
    _ctx.fillStyle = COLORS.bg;
    _ctx.fillRect(-hw, -_wallThickPx, w, _wallThickPx * 2);

    // Door swing arc
    _ctx.beginPath();
    _ctx.arc(-hw, 0, w, 0, -Math.PI / 2, true);
    _ctx.strokeStyle = COLORS.door;
    _ctx.lineWidth = 1;
    _ctx.setLineDash([3, 3]);
    _ctx.stroke();
    _ctx.setLineDash([]);

    // Door leaf
    _ctx.beginPath();
    _ctx.moveTo(-hw, 0);
    _ctx.lineTo(-hw, -w);
    _ctx.strokeStyle = COLORS.door;
    _ctx.lineWidth = 2;
    _ctx.stroke();

    // Label
    _ctx.fillStyle = COLORS.door;
    _ctx.font = 'bold 8px Inter, sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText('D', 0, _wallThickPx + 8);

    _ctx.restore();
  }

  function _drawWindow(obj) {
    var w = obj.width || 40;
    var hw = w / 2;
    _ctx.save();
    _ctx.translate(obj.x, obj.y);
    if (obj.rotation) _ctx.rotate(obj.rotation * Math.PI / 180);

    // Window double-line
    _ctx.strokeStyle = COLORS.window_;
    _ctx.lineWidth = 2;
    _ctx.beginPath();
    _ctx.moveTo(-hw, -2); _ctx.lineTo(hw, -2);
    _ctx.stroke();
    _ctx.beginPath();
    _ctx.moveTo(-hw, 2); _ctx.lineTo(hw, 2);
    _ctx.stroke();

    // End ticks
    _ctx.lineWidth = 1.5;
    _ctx.beginPath();
    _ctx.moveTo(-hw, -5); _ctx.lineTo(-hw, 5);
    _ctx.moveTo(hw, -5); _ctx.lineTo(hw, 5);
    _ctx.stroke();

    // Label
    _ctx.fillStyle = COLORS.window_;
    _ctx.font = 'bold 7px Inter, sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText('W', 0, 10);

    _ctx.restore();
  }

  function _drawRoom(obj) {
    _ctx.fillStyle = 'rgba(255,248,220,0.7)';
    _ctx.font = 'bold 13px Inter, sans-serif';
    var tw = _ctx.measureText(obj.text).width + 16;
    _ctx.beginPath(); _ctx.roundRect(obj.x - tw / 2, obj.y - 10, tw, 24, 6); _ctx.fill();
    _ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    _ctx.lineWidth = 1;
    _ctx.stroke();
    _ctx.fillStyle = '#0F0F0F';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText(obj.text, obj.x, obj.y + 1);
  }

  function _drawBlower(obj) {
    var rot = obj.rotation || 0;
    var bw = 70, bh = 50;
    if (rot === 90) { bw = 50; bh = 70; }
    var hw = bw / 2, hh = bh / 2;

    _ctx.save();
    _ctx.translate(obj.x, obj.y);

    // Main body
    _ctx.fillStyle = '#fff';
    _ctx.strokeStyle = '#b45309';
    _ctx.lineWidth = 2.5;
    _ctx.beginPath(); _ctx.roundRect(-hw, -hh, bw, bh, 6); _ctx.fill(); _ctx.stroke();

    // FRONT side (Supply) — right side (or bottom if rotated)
    var frontLabel, backLabel;
    if (rot === 90) {
      // Front = bottom
      _ctx.fillStyle = 'rgba(239,68,68,0.2)';
      _ctx.fillRect(-hw + 2, hh - 10, bw - 4, 8);
      _ctx.fillStyle = COLORS.blowerSupply;
      _ctx.font = 'bold 7px Inter, sans-serif';
      _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
      _ctx.fillText('SUPPLY →', 0, hh - 6);
      // Back = top
      _ctx.fillStyle = 'rgba(59,130,246,0.2)';
      _ctx.fillRect(-hw + 2, -hh + 2, bw - 4, 8);
      _ctx.fillStyle = COLORS.blowerReturn;
      _ctx.fillText('← RETURN', 0, -hh + 6);
    } else {
      // Front = right
      _ctx.fillStyle = 'rgba(239,68,68,0.2)';
      _ctx.fillRect(hw - 12, -hh + 2, 10, bh - 4);
      _ctx.save();
      _ctx.translate(hw - 7, 0);
      _ctx.rotate(Math.PI / 2);
      _ctx.fillStyle = COLORS.blowerSupply;
      _ctx.font = 'bold 6px Inter, sans-serif';
      _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
      _ctx.fillText('SUPPLY', 0, 0);
      _ctx.restore();
      // Back = left
      _ctx.fillStyle = 'rgba(59,130,246,0.2)';
      _ctx.fillRect(-hw + 2, -hh + 2, 10, bh - 4);
      _ctx.save();
      _ctx.translate(-hw + 7, 0);
      _ctx.rotate(-Math.PI / 2);
      _ctx.fillStyle = COLORS.blowerReturn;
      _ctx.font = 'bold 6px Inter, sans-serif';
      _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
      _ctx.fillText('RETURN', 0, 0);
      _ctx.restore();
    }

    // Center label
    _ctx.fillStyle = '#0F0F0F';
    _ctx.font = 'bold 12px Inter, sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText('BLW', 0, -4);

    // CFM sub-label
    if (obj.cfm) {
      _ctx.fillStyle = '#b45309';
      _ctx.font = 'bold 9px Inter, sans-serif';
      _ctx.fillText(obj.cfm + ' CFM', 0, 9);
    }

    // Label below
    if (obj.label) {
      _ctx.fillStyle = '#57574F';
      _ctx.font = '8px Inter, sans-serif';
      _ctx.fillText(obj.label, 0, hh + 10);
    }

    _ctx.restore();
  }

  // ── Blower Detection ───────────────────────────────────────────
  function _findBlower() {
    for (var i = _paths.length - 1; i >= 0; i--) {
      if (_paths[i].type === 'blower') return _paths[i];
    }
    return null;
  }

  function _getBlowerSide(blower, x, y) {
    if (!blower) return null;
    var rot = blower.rotation || 0;
    var dx = x - blower.x, dy = y - blower.y;
    if (rot === 90) {
      // Front=bottom, Back=top
      if (dy > 10) return 'supply';
      if (dy < -10) return 'return';
    } else {
      // Front=right, Back=left
      if (dx > 10) return 'supply';
      if (dx < -10) return 'return';
    }
    return null;
  }

  function _getCumulativeDist(x, y, side) {
    // Sum distances of all connected duct segments of the same side
    var total = 0;
    for (var i = 0; i < _paths.length; i++) {
      var d = _paths[i];
      if (d.type === 'ductline' && d.ductSide === side) {
        var ddx = d.x2 - d.x1, ddy = d.y2 - d.y1;
        total += Math.sqrt(ddx * ddx + ddy * ddy) / GRID_SIZE;
      }
    }
    return Math.round(total);
  }

  function _calcLiveVelocity(cfm, distFt, ductDia) {
    // Simplified: velocity stays constant in the duct (CFM/Area)
    // But friction loss increases with distance
    // Available static pressure = total - friction_used
    // Friction per ft at 0.08 rate ≈ 0.0008 in.wc/ft
    var area = Math.PI * Math.pow(ductDia / 24, 2);
    var velocity = Math.round(cfm / area);
    var frictionUsed = distFt * 0.0008; // in.wc
    var totalAvailable = 0.50; // typical residential 0.5 in.wc
    var budgetPct = Math.round((frictionUsed / totalAvailable) * 100);
    return {
      velocity: velocity,
      frictionUsed: frictionUsed.toFixed(3),
      budgetPct: Math.min(budgetPct, 999),
      status: budgetPct <= 60 ? 'ok' : budgetPct <= 85 ? 'warn' : 'high'
    };
  }

  // ── Endpoint Snapping (for branching / Tee) ─────────────────────
  function _snapToDuctEndpoint(x, y, maxDist) {
    var best = null, bestD = maxDist || 25;
    for (var i = 0; i < _paths.length; i++) {
      var obj = _paths[i];
      if (obj.type !== 'ductline') continue;
      // Check endpoint 2 (where duct ends — more natural for branching)
      var d2 = Math.sqrt(Math.pow(x - obj.x2, 2) + Math.pow(y - obj.y2, 2));
      if (d2 < bestD) { bestD = d2; best = { pos: { x: obj.x2, y: obj.y2 }, side: obj.ductSide, parentCFM: obj.cfm }; }
      // Also check endpoint 1
      var d1 = Math.sqrt(Math.pow(x - obj.x1, 2) + Math.pow(y - obj.y1, 2));
      if (d1 < bestD) { bestD = d1; best = { pos: { x: obj.x1, y: obj.y1 }, side: obj.ductSide, parentCFM: obj.cfm }; }
    }
    return best;
  }

  // ── Touch / Mouse Handlers (with Drag & Drop) ─────────────────
  function _cancelLongPress() {
    if (_longPressTimer) { clearTimeout(_longPressTimer); _longPressTimer = null; }
    _longPressPos = null;
  }

  function _startDragObject(idx, pos) {
    _undoStack.push(JSON.parse(JSON.stringify(_paths)));
    _dragIdx = idx;
    _isDragging = true;
    var obj = _paths[idx];
    if (obj.x !== undefined) {
      _dragOffX = pos.x - obj.x;
      _dragOffY = pos.y - obj.y;
    } else if (obj.x1 !== undefined) {
      // For walls and ductlines: offset from midpoint
      var mx = (obj.x1 + obj.x2) / 2, my = (obj.y1 + obj.y2) / 2;
      _dragOffX = pos.x - mx;
      _dragOffY = pos.y - my;
    }
    _render();
  }

  function _startDragEndpoint(epHit, pos) {
    _undoStack.push(JSON.parse(JSON.stringify(_paths)));
    _dragEndpoint = epHit;
    _isDragging = true;
    _render();
  }

  function _onPointerDown(e) {
    e.preventDefault();
    _cancelLongPress();

    // Pinch zoom
    if (e.touches && e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      _lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      _isPanning = false;
      return;
    }

    var pos = _getCanvasXY(e);

    // ─── Check for DRAG on any tool (long-press starts drag) ───
    // On pan tool, immediate drag; on other tools, use long-press
    if (_tool === 'pan') {
      // Check duct endpoints first (highest priority for precision editing)
      var epHit = _hitTestDuctEndpoint(pos.x, pos.y);
      if (epHit) { _startDragEndpoint(epHit, pos); return; }

      // Check discrete objects
      var objHit = _hitTestObject(pos.x, pos.y);
      if (objHit) {
        // Quick tap = rotate (equip/blower), long hold or move = drag
        _longPressPos = pos;
        _longPressTimer = setTimeout(function() {
          _startDragObject(objHit.idx, pos);
          _showToast(_isEN ? 'Dragging...' : 'Arrastrando...', '#3b82f6');
        }, 250);
        // Also store the hit so we can detect movement before timer fires
        _dragIdx = objHit.idx;
        return;
      }

      // Check ducts and walls for dragging
      var ductHit = _hitTestDuctSegment(pos.x, pos.y);
      if (ductHit) {
        _longPressPos = pos;
        _longPressTimer = setTimeout(function() {
          _startDragObject(ductHit.idx, pos);
        }, 250);
        _dragIdx = ductHit.idx;
        return;
      }
      var wallHit = _hitTestWall(pos.x, pos.y);
      if (wallHit) {
        _longPressPos = pos;
        _longPressTimer = setTimeout(function() {
          _startDragObject(wallHit.idx, pos);
        }, 250);
        _dragIdx = wallHit.idx;
        return;
      }

      // No object hit — do normal pan
      _isPanning = true;
      var t = e.touches ? e.touches[0] : e;
      _panStartX = t.clientX - _offsetX;
      _panStartY = t.clientY - _offsetY;
      return;
    }

    // ─── Non-pan tools: long-press to drag ANY object ───
    var anyHit = _hitTestObject(pos.x, pos.y) || _hitTestDuctEndpoint(pos.x, pos.y);
    if (!anyHit) anyHit = _hitTestDuctSegment(pos.x, pos.y) || _hitTestWall(pos.x, pos.y);

    if (anyHit && _tool !== 'draw' && _tool !== 'eraser') {
      _longPressPos = pos;
      var hitRef = anyHit;
      _longPressTimer = setTimeout(function() {
        if (hitRef.which) {
          // It's an endpoint hit
          _startDragEndpoint(hitRef, pos);
        } else {
          _startDragObject(hitRef.idx, pos);
        }
        _showToast(_isEN ? 'Dragging...' : 'Arrastrando...', '#3b82f6');
      }, 350);
    }

    // ─── Normal tool actions ───
    if (_tool === 'draw' || _tool === 'eraser') {
      _drawing = true;
      _currentPath = {
        type: 'path',
        points: [pos],
        color: _tool === 'eraser' ? '#FFF8DC' : COLORS.draw,
        width: _tool === 'eraser' ? 20 : 2
      };
    } else if (_tool === 'equipment') {
      // Tap on existing to rotate, otherwise place new
      var eqTap = _hitTestObject(pos.x, pos.y);
      if (eqTap && (_paths[eqTap.idx].type === 'equip' || _paths[eqTap.idx].type === 'blower')) {
        _undoStack.push(JSON.parse(JSON.stringify(_paths)));
        _paths[eqTap.idx].rotation = _paths[eqTap.idx].rotation === 90 ? 0 : 90;
        _render(); _saveState(); return;
      }
      var sx = Math.round(pos.x / GRID_SIZE) * GRID_SIZE;
      var sy = Math.round(pos.y / GRID_SIZE) * GRID_SIZE;
      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({ type: 'equip', x: sx, y: sy, kind: _equipType, label: '', rotation: 0 });
      _render(); _saveState();
    } else if (_tool === 'duct') {
      var snap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };

      // Snap to existing duct endpoint for branching
      var snapped = _snapToDuctEndpoint(snap.x, snap.y, 25);
      if (snapped) { snap = snapped.pos; }

      if (!_ductStart) {
        _ductStart = snap;
        _livePos = null;
        var blwr = _findBlower();
        _ductStartSide = blwr ? _getBlowerSide(blwr, snap.x, snap.y) : null;
        if (!_ductStartSide && snapped && snapped.side) {
          _ductStartSide = snapped.side;
        }
        if (_ductStartSide) {
          _showToast(_ductStartSide === 'supply' ? '● SUPPLY' : '● RETURN', _ductStartSide === 'supply' ? COLORS.supplyDuct : COLORS.returnDuct);
        }
        _render();
      } else {
        _livePos = null;
        _showCFMInput(_ductStart, snap);
      }
    } else if (_tool === 'measure') {
      var msnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      if (!_measureStart) {
        _measureStart = msnap;
        _render();
      } else {
        var mdx = msnap.x - _measureStart.x, mdy = msnap.y - _measureStart.y;
        var mDist = Math.round(Math.sqrt(mdx * mdx + mdy * mdy) / GRID_SIZE);
        var midX = (_measureStart.x + msnap.x) / 2, midY = (_measureStart.y + msnap.y) / 2;
        _undoStack.push(JSON.parse(JSON.stringify(_paths)));
        _paths.push({ type: 'label', x: midX, y: midY, text: mDist + ' ft' });
        _measureStart = null;
        _render(); _saveState();
      }
    } else if (_tool === 'fitting') {
      var fsnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      _placeFitting(fsnap);
    } else if (_tool === 'wall') {
      var wsnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      if (!_wallStart) {
        _wallStart = wsnap;
        _livePos = null;
        _render();
      } else {
        _undoStack.push(JSON.parse(JSON.stringify(_paths)));
        _paths.push({ type: 'wall', x1: _wallStart.x, y1: _wallStart.y, x2: wsnap.x, y2: wsnap.y });
        _wallStart = wsnap;
        _livePos = null;
        _render(); _saveState();
      }
    } else if (_tool === 'door') {
      var dsnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      var nearWall = _findNearestWall(dsnap.x, dsnap.y);
      var doorRot = nearWall ? _getWallAngle(nearWall) : 0;
      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({ type: 'door', x: dsnap.x, y: dsnap.y, width: 36, rotation: doorRot });
      _render(); _saveState();
    } else if (_tool === 'window_') {
      var wnsnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      var nearWall2 = _findNearestWall(wnsnap.x, wnsnap.y);
      var winRot = nearWall2 ? _getWallAngle(nearWall2) : 0;
      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({ type: 'window', x: wnsnap.x, y: wnsnap.y, width: 40, rotation: winRot });
      _render(); _saveState();
    } else if (_tool === 'room') {
      var rsnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      _showRoomNameInput(rsnap);
    } else if (_tool === 'blower') {
      // Tap existing blower to rotate
      var blwTap = _hitTestObject(pos.x, pos.y);
      if (blwTap && _paths[blwTap.idx].type === 'blower') {
        _undoStack.push(JSON.parse(JSON.stringify(_paths)));
        _paths[blwTap.idx].rotation = _paths[blwTap.idx].rotation === 90 ? 0 : 90;
        _render(); _saveState(); return;
      }
      var bsnap = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      _showBlowerSetup(bsnap);
    }
  }

  function _onPointerMove(e) {
    e.preventDefault();

    // Pinch zoom
    if (e.touches && e.touches.length === 2) {
      _cancelLongPress();
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (_lastPinchDist > 0) {
        var zoomDelta = dist / _lastPinchDist;
        _scale = Math.max(0.3, Math.min(3, _scale * zoomDelta));
      }
      _lastPinchDist = dist;
      _render(); return;
    }

    var pos = _getCanvasXY(e);

    // Cancel long-press if moved too far (to allow normal pan/scroll)
    if (_longPressPos && !_isDragging) {
      var lpDist = Math.sqrt(Math.pow(pos.x - _longPressPos.x, 2) + Math.pow(pos.y - _longPressPos.y, 2));
      if (lpDist > 8) {
        _cancelLongPress();
        // If on pan tool, start panning instead
        if (_tool === 'pan' && !_isPanning) {
          _dragIdx = -1;
          _isPanning = true;
          var tt = e.touches ? e.touches[0] : e;
          _panStartX = tt.clientX - _offsetX;
          _panStartY = tt.clientY - _offsetY;
        }
      }
    }

    // ─── Active drag of duct endpoint ───
    if (_isDragging && _dragEndpoint) {
      var snapX = Math.round(pos.x / GRID_SIZE) * GRID_SIZE;
      var snapY = Math.round(pos.y / GRID_SIZE) * GRID_SIZE;
      var dObj = _paths[_dragEndpoint.idx];
      if (dObj) {
        if (_dragEndpoint.which === 'end') {
          dObj.x2 = snapX; dObj.y2 = snapY;
        } else {
          dObj.x1 = snapX; dObj.y1 = snapY;
        }
        // Recalculate duct properties
        var ddx = dObj.x2 - dObj.x1, ddy = dObj.y2 - dObj.y1;
        var newDist = Math.sqrt(ddx * ddx + ddy * ddy) / GRID_SIZE;
        if (dObj.cfm && newDist > 0) {
          var sizing = _calcDuctSize(dObj.cfm, false);
          var area = Math.PI * Math.pow(sizing.roundDia / 24, 2);
          dObj.velocity = Math.round(dObj.cfm / area);
          dObj.size = sizing.roundLabel;
        }
      }
      _render(); return;
    }

    // ─── Active drag of object ───
    if (_isDragging && _dragIdx >= 0) {
      var snapX2 = Math.round(pos.x / GRID_SIZE) * GRID_SIZE;
      var snapY2 = Math.round(pos.y / GRID_SIZE) * GRID_SIZE;
      var dObj2 = _paths[_dragIdx];
      if (dObj2.x !== undefined) {
        dObj2.x = Math.round((pos.x - _dragOffX) / GRID_SIZE) * GRID_SIZE;
        dObj2.y = Math.round((pos.y - _dragOffY) / GRID_SIZE) * GRID_SIZE;
      } else if (dObj2.x1 !== undefined) {
        // Move entire wall/duct segment
        var mx = (dObj2.x1 + dObj2.x2) / 2, my = (dObj2.y1 + dObj2.y2) / 2;
        var newMx = Math.round((pos.x - _dragOffX) / GRID_SIZE) * GRID_SIZE;
        var newMy = Math.round((pos.y - _dragOffY) / GRID_SIZE) * GRID_SIZE;
        var deltaX = newMx - mx, deltaY = newMy - my;
        dObj2.x1 += deltaX; dObj2.y1 += deltaY;
        dObj2.x2 += deltaX; dObj2.y2 += deltaY;
      }
      _render(); return;
    }

    // ─── Palette drag ghost (rendered as HTML overlay) ───
    if (_dragFromPalette) {
      var touch = e.touches ? e.touches[0] : e;
      _dragPalettePos = { clientX: touch.clientX, clientY: touch.clientY };
      var ghost = document.getElementById('ddDragGhost');
      if (ghost) {
        ghost.style.left = (touch.clientX - 20) + 'px';
        ghost.style.top = (touch.clientY - 20) + 'px';
      }
      return;
    }

    if (_isPanning) {
      var t = e.touches ? e.touches[0] : e;
      _offsetX = t.clientX - _panStartX;
      _offsetY = t.clientY - _panStartY;
      _render(); return;
    }

    // Live preview for duct and wall tools
    if ((_tool === 'duct' && _ductStart) || (_tool === 'wall' && _wallStart)) {
      _livePos = { x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE };
      _render();
      return;
    }
    if (!_drawing || !_currentPath) return;
    _currentPath.points.push(pos);
    _render();
  }

  function _onPointerUp(e) {
    _cancelLongPress();

    // ─── Finish palette drag ───
    if (_dragFromPalette && _dragPalettePos) {
      var ghost = document.getElementById('ddDragGhost');
      if (ghost) ghost.remove();

      // Convert screen coords to canvas coords
      var rect = _canvas.getBoundingClientRect();
      var cx = (_dragPalettePos.clientX - rect.left - _offsetX) / _scale;
      var cy = (_dragPalettePos.clientY - rect.top - _offsetY) / _scale;
      var snapX = Math.round(cx / GRID_SIZE) * GRID_SIZE;
      var snapY = Math.round(cy / GRID_SIZE) * GRID_SIZE;

      // Only place if dropped on canvas
      if (_dragPalettePos.clientX >= rect.left && _dragPalettePos.clientX <= rect.right &&
          _dragPalettePos.clientY >= rect.top && _dragPalettePos.clientY <= rect.bottom) {
        _undoStack.push(JSON.parse(JSON.stringify(_paths)));
        if (_dragFromPalette.type === 'fitting') {
          _paths.push({
            type: 'fitting', x: snapX, y: snapY,
            fittingType: _dragFromPalette.data.id,
            fittingSize: _fittingSize,
            el: _getFittingEL(_dragFromPalette.data.id, _fittingSize),
            valid: true
          });
          _totalEL += _getFittingEL(_dragFromPalette.data.id, _fittingSize);
          _playChime();
        } else if (_dragFromPalette.type === 'equip') {
          _paths.push({ type: 'equip', x: snapX, y: snapY, kind: _dragFromPalette.data.kind, label: '', rotation: 0 });
        }
        _render(); _saveState();
        _showToast(_isEN ? 'Dropped!' : '¡Colocado!', '#22c55e');
      }

      _dragFromPalette = null;
      _dragPalettePos = null;
      return;
    }

    // ─── Finish object drag ───
    if (_isDragging) {
      _isDragging = false;
      // Snap final position to grid
      if (_dragIdx >= 0 && _paths[_dragIdx]) {
        var fObj = _paths[_dragIdx];
        if (fObj.x !== undefined) {
          fObj.x = Math.round(fObj.x / GRID_SIZE) * GRID_SIZE;
          fObj.y = Math.round(fObj.y / GRID_SIZE) * GRID_SIZE;
        } else if (fObj.x1 !== undefined) {
          fObj.x1 = Math.round(fObj.x1 / GRID_SIZE) * GRID_SIZE;
          fObj.y1 = Math.round(fObj.y1 / GRID_SIZE) * GRID_SIZE;
          fObj.x2 = Math.round(fObj.x2 / GRID_SIZE) * GRID_SIZE;
          fObj.y2 = Math.round(fObj.y2 / GRID_SIZE) * GRID_SIZE;
        }
      }
      if (_dragEndpoint && _paths[_dragEndpoint.idx]) {
        var deObj = _paths[_dragEndpoint.idx];
        deObj.x1 = Math.round(deObj.x1 / GRID_SIZE) * GRID_SIZE;
        deObj.y1 = Math.round(deObj.y1 / GRID_SIZE) * GRID_SIZE;
        deObj.x2 = Math.round(deObj.x2 / GRID_SIZE) * GRID_SIZE;
        deObj.y2 = Math.round(deObj.y2 / GRID_SIZE) * GRID_SIZE;
      }
      _dragIdx = -1;
      _dragEndpoint = null;
      _render(); _saveState();
      return;
    }

    // ─── Quick tap on pan tool = rotate equipment/blower ───
    if (_tool === 'pan' && _dragIdx >= 0 && !_isDragging) {
      var tapObj = _paths[_dragIdx];
      if (tapObj && (tapObj.type === 'equip' || tapObj.type === 'blower')) {
        _undoStack.push(JSON.parse(JSON.stringify(_paths)));
        tapObj.rotation = tapObj.rotation === 90 ? 0 : 90;
        _render(); _saveState();
      }
      _dragIdx = -1;
      return;
    }

    _dragIdx = -1;
    if (_isPanning) { _isPanning = false; return; }
    _lastPinchDist = 0;
    if (!_drawing || !_currentPath) return;
    _drawing = false;
    if (_currentPath.points.length > 1) {
      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push(_currentPath);
      _saveState();
    }
    _currentPath = null;
    _render();
  }

  // ── Fitting Placement & Validation ─────────────────────────────
  function _placeFitting(pos) {
    var el = _getFittingEL(_fittingType, _fittingSize);
    var nearDuct = _findNearestDuct(pos.x, pos.y, 60);
    var valid = true;

    if (nearDuct) {
      var ductDia = _extractDuctDia(nearDuct.size);
      if (ductDia > 0 && Math.abs(ductDia - _fittingSize) > 4) {
        // Fitting size doesn't match duct — invalid
        valid = false;
        _playBuzzer();
      } else {
        _playSuccess();
      }
    }

    _undoStack.push(JSON.parse(JSON.stringify(_paths)));
    _paths.push({
      type: 'fitting',
      x: pos.x, y: pos.y,
      kind: _fittingType,
      size: _fittingSize,
      el: el,
      rotation: 0,
      valid: valid
    });
    _recalcTotalEL();
    _render(); _saveState();

    // Show EL popup
    var def = _getFittingDef(_fittingType);
    var name = _isEN ? def.en : def.es;
    var msg = valid
      ? (name + ' ' + _fittingSize + '" → +' + el + ' ft EL')
      : (name + ' ' + _fittingSize + '" ⚠ ' + (_isEN ? 'SIZE MISMATCH! +' : '¡TAMAÑO INCORRECTO! +') + el + ' ft EL');
    _showToast(msg, valid ? '#a78bfa' : '#f87171');
  }

  function _showToast(msg, color) {
    var existing = document.getElementById('ddToast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'ddToast';
    toast.style.cssText = 'position:fixed;top:120px;left:50%;transform:translateX(-50%);z-index:99999;padding:10px 20px;border-radius:10px;background:rgba(255,255,255,0.97);border:1.5px solid ' + color + ';color:' + color + ';font-size:12px;font-weight:700;white-space:nowrap;pointer-events:none;transition:opacity 0.5s;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.opacity = '0'; }, 1800);
    setTimeout(function() { toast.remove(); }, 2400);
  }

  // ── Wall Helpers ───────────────────────────────────────────────
  function _findNearestWall(x, y) {
    var best = null, bestD = 30;
    for (var i = 0; i < _paths.length; i++) {
      if (_paths[i].type !== 'wall') continue;
      var w = _paths[i];
      // Point-to-segment distance
      var dx = w.x2 - w.x1, dy = w.y2 - w.y1;
      var lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;
      var t = Math.max(0, Math.min(1, ((x - w.x1) * dx + (y - w.y1) * dy) / lenSq));
      var px = w.x1 + t * dx, py = w.y1 + t * dy;
      var d = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
      if (d < bestD) { bestD = d; best = w; }
    }
    return best;
  }

  function _getWallAngle(wall) {
    return Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1) * 180 / Math.PI;
  }

  // ── Room Name Input ────────────────────────────────────────────
  function _showRoomNameInput(pos) {
    var overlay = document.createElement('div');
    overlay.id = 'ddRoomOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';

    var rooms = _isEN
      ? ['Living Room','Kitchen','Master Bedroom','Bedroom 2','Bedroom 3','Bathroom','Hallway','Garage','Laundry','Dining Room','Office','Closet']
      : ['Sala','Cocina','Recámara Principal','Recámara 2','Recámara 3','Baño','Pasillo','Garaje','Lavandería','Comedor','Oficina','Clóset'];

    var h = '<div style="background:#fff;border-radius:16px;padding:20px;max-width:360px;width:100%;border:1.5px solid rgba(0,0,0,0.12);">';
    h += '<h3 style="color:#0F0F0F;font-size:14px;font-weight:800;margin:0 0 10px;display:flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-7 9 7v12a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9 21v-8h6v8"/></svg> ' + (_isEN ? 'Room Name' : 'Nombre del Cuarto') + '</h3>';

    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">';
    for (var ri = 0; ri < rooms.length; ri++) {
      h += '<button onclick="document.getElementById(\'ddRoomInput\').value=\'' + rooms[ri] + '\'" style="padding:6px 10px;border-radius:6px;border:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.04);color:#111111;font-size:12px;font-weight:600;cursor:pointer;">' + rooms[ri] + '</button>';
    }
    h += '</div>';

    h += '<input id="ddRoomInput" type="text" placeholder="' + (_isEN ? 'Room name...' : 'Nombre del cuarto...') + '" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:14px;outline:none;font-family:inherit;margin-bottom:12px;box-sizing:border-box;" />';

    h += '<div style="display:flex;gap:8px;">';
    h += '<button id="ddRoomCancel" style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:13px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Cancel' : 'Cancelar') + '</button>';
    h += '<button id="ddRoomOk" style="flex:1;padding:10px;border-radius:10px;border:none;background:linear-gradient(135deg,#38bdf8,#0284c7);color:#fff;font-size:13px;font-weight:700;cursor:pointer;">OK</button>';
    h += '</div></div>';

    overlay.innerHTML = h;
    document.body.appendChild(overlay);
    document.getElementById('ddRoomInput').focus();

    // Close on backdrop tap (outside dialog)
    overlay.addEventListener('click', function(ev) {
      if (ev.target === overlay) overlay.remove();
    });
    overlay.addEventListener('touchend', function(ev) {
      if (ev.target === overlay) overlay.remove();
    });

    var cancelBtn = document.getElementById('ddRoomCancel');
    var okBtn = document.getElementById('ddRoomOk');

    function closeRoom() { overlay.remove(); }
    function confirmRoom() {
      var name = document.getElementById('ddRoomInput').value.trim();
      if (!name) { overlay.remove(); return; }
      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({ type: 'room', x: pos.x, y: pos.y, text: name });
      overlay.remove();
      _render(); _saveState();
    }

    cancelBtn.onclick = closeRoom;
    cancelBtn.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); closeRoom(); });
    okBtn.onclick = confirmRoom;
    okBtn.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); confirmRoom(); });
  }

  // ── Blower Setup ───────────────────────────────────────────────
  function _showBlowerSetup(pos) {
    var overlay = document.createElement('div');
    overlay.id = 'ddBlowerOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';

    // Check if blower already exists
    var existing = _findBlower();

    var h = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:380px;width:100%;border:1.5px solid rgba(245,158,11,0.3);">';
    h += '<h3 style="color:#b45309;font-size:16px;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:6px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 10c-2-3-5-3-5-3"/><path d="M14 12c3-2 3-5 3-5"/><path d="M12 14c2 3 5 3 5 3"/><path d="M10 12c-3 2-3 5-3 5"/></svg> ' + (_isEN ? 'Blower / Air Handler Setup' : 'Configuración del Blower') + '</h3>';
    h += '<div style="color:#111111;font-size:10px;margin-bottom:14px;">';
    h += _isEN ? 'Supply ducts connect from FRONT (right). Return ducts from BACK (left).' : 'Ductos de suministro se conectan al FRENTE (derecha). Ductos de retorno ATRÁS (izquierda).';
    h += '</div>';

    if (existing) {
      h += '<div style="padding:8px 12px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:8px;margin-bottom:12px;color:#fbbf24;font-size:11px;font-weight:600;">⚠ ' + (_isEN ? 'A blower already exists. This will add another one.' : 'Ya existe un blower. Esto agregará otro.') + '</div>';
    }

    // Tonnage
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">' + (_isEN ? 'System Tonnage' : 'Tonelaje del Sistema') + '</label>';
    h += '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">';
    var bTons = [1.5,2,2.5,3,3.5,4,5,7.5,10,12.5,15,20];
    for (var bt = 0; bt < bTons.length; bt++) {
      h += '<button onclick="document.getElementById(\'ddBlwTon\').value=' + bTons[bt] + ';document.getElementById(\'ddBlwCFM\').value=' + Math.round(bTons[bt] * 400) + '" style="padding:5px 8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.04);color:#111111;font-size:12px;font-weight:700;cursor:pointer;">' + bTons[bt] + 'T</button>';
    }
    h += '</div>';
    h += '<input id="ddBlwTon" type="number" value="3" min="1" max="30" step="0.5" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:16px;font-weight:700;text-align:center;outline:none;font-family:inherit;margin-bottom:10px;box-sizing:border-box;" oninput="document.getElementById(\'ddBlwCFM\').value=Math.round(this.value*400)" />';

    // CFM
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">CFM (' + (_isEN ? 'total system airflow' : 'flujo de aire total del sistema') + ')</label>';
    h += '<input id="ddBlwCFM" type="number" value="1200" min="200" max="20000" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:16px;font-weight:700;text-align:center;outline:none;font-family:inherit;margin-bottom:10px;box-sizing:border-box;" />';

    // Orientation
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">' + (_isEN ? 'Orientation' : 'Orientación') + '</label>';
    h += '<div style="display:flex;gap:8px;margin-bottom:10px;">';
    h += '<button id="ddBlwH" onclick="document.getElementById(\'ddBlwRot\').value=0;this.style.borderColor=\'#f59e0b\';this.style.color=\'#92400e\';document.getElementById(\'ddBlwV\').style.borderColor=\'rgba(0,0,0,0.12)\';document.getElementById(\'ddBlwV\').style.color=\'#57574F\'" style="flex:1;padding:10px;border-radius:10px;border:2px solid #f59e0b;background:transparent;color:#92400e;font-size:12px;font-weight:700;cursor:pointer;">➡ ' + (_isEN ? 'Horizontal' : 'Horizontal') + '</button>';
    h += '<button id="ddBlwV" onclick="document.getElementById(\'ddBlwRot\').value=90;this.style.borderColor=\'#f59e0b\';this.style.color=\'#92400e\';document.getElementById(\'ddBlwH\').style.borderColor=\'rgba(0,0,0,0.12)\';document.getElementById(\'ddBlwH\').style.color=\'#57574F\'" style="flex:1;padding:10px;border-radius:10px;border:2px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:12px;font-weight:700;cursor:pointer;">⬇ ' + (_isEN ? 'Vertical' : 'Vertical') + '</button>';
    h += '</div>';
    h += '<input id="ddBlwRot" type="hidden" value="0" />';

    // Label
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">' + (_isEN ? 'Label (optional)' : 'Etiqueta (opcional)') + '</label>';
    h += '<input id="ddBlwLabel" type="text" placeholder="' + (_isEN ? 'e.g. Carrier FB4CNF036' : 'ej. Carrier FB4CNF036') + '" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:13px;outline:none;font-family:inherit;margin-bottom:14px;box-sizing:border-box;" />';

    // How it works
    h += '<div style="padding:10px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:8px;margin-bottom:14px;font-size:10px;color:#3D3D3A;line-height:1.6;">';
    h += '<div style="color:#4ade80;font-weight:700;margin-bottom:4px;">' + (_isEN ? 'HOW TO USE' : 'CÓMO FUNCIONA') + ':</div>';
    h += '1. ' + (_isEN ? 'Place blower on floor plan' : 'Coloca el blower en el plano') + '<br>';
    h += '2. ' + (_isEN ? 'Select Duct tool, click on FRONT (red) for supply' : 'Selecciona Ducto, toca el FRENTE (rojo) para supply') + '<br>';
    h += '3. ' + (_isEN ? 'Extend duct — velocity updates in REAL TIME' : 'Extiende el ducto — velocidad se actualiza en TIEMPO REAL') + '<br>';
    h += '4. ' + (_isEN ? 'Click on BACK (blue) for return ducts' : 'Toca ATRÁS (azul) para ductos de retorno') + '<br>';
    h += '5. ' + (_isEN ? 'Watch the pressure budget as you extend!' : '¡Observa el presupuesto de presión mientras extiendes!') + '</div>';

    h += '<div style="display:flex;gap:8px;">';
    h += '<button id="ddBlwCancel" style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:14px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Cancel' : 'Cancelar') + '</button>';
    h += '<button id="ddBlwOk" style="flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:14px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Place Blower' : 'Colocar Blower') + '</button>';
    h += '</div></div>';

    overlay.innerHTML = h;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) overlay.remove(); });
    overlay.addEventListener('touchend', function(ev) { if (ev.target === overlay) overlay.remove(); });

    function closeBlw() { overlay.remove(); }
    function confirmBlw() {
      var ton = parseFloat(document.getElementById('ddBlwTon').value) || 3;
      var cfm = parseInt(document.getElementById('ddBlwCFM').value) || Math.round(ton * 400);
      var rot = parseInt(document.getElementById('ddBlwRot').value) || 0;
      var lbl = document.getElementById('ddBlwLabel').value.trim() || (ton + 'T');

      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({ type: 'blower', x: pos.x, y: pos.y, rotation: rot, cfm: cfm, label: lbl });
      _systemCFM = cfm;
      overlay.remove();
      _render(); _saveState();
      _showToast((_isEN ? 'Blower placed: ' : 'Blower colocado: ') + ton + 'T / ' + cfm + ' CFM', '#f59e0b');
    }

    var blwCancel = document.getElementById('ddBlwCancel');
    var blwOk = document.getElementById('ddBlwOk');
    blwCancel.onclick = closeBlw;
    blwCancel.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); closeBlw(); });
    blwOk.onclick = confirmBlw;
    blwOk.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); confirmBlw(); });
  }

  // ── CFM Input Modal ────────────────────────────────────────────
  function _showCFMInput(start, end) {
    var overlay = document.createElement('div');
    overlay.id = 'ddCfmOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';

    var dx = end.x - start.x, dy = end.y - start.y;
    var distFt = Math.round(Math.sqrt(dx * dx + dy * dy) / GRID_SIZE);

    // Auto-detect side and CFM from blower
    var _side = _ductStartSide;
    var blwr2 = _findBlower();
    var defaultCFM = _lastDuctCFM || (blwr2 ? (blwr2.cfm || _systemCFM) : 400);
    var sideColor = _side === 'supply' ? '#ef4444' : _side === 'return' ? '#3b82f6' : '#4ade80';
    var sideLabel = _side === 'supply' ? '● SUPPLY' : _side === 'return' ? '● RETURN' : '';

    var h = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:360px;width:100%;border:1.5px solid ' + sideColor + '44;">';
    h += '<h3 style="color:' + sideColor + ';font-size:16px;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:6px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + sideColor + '" stroke-width="2" stroke-linecap="round"><path d="M4 8h16v8H4z"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="2" y1="7" x2="2" y2="17"/><line x1="22" y1="7" x2="22" y2="17"/></svg> ' + (_isEN ? 'Duct Run' : 'Tramo de Ducto') + '</h3>';
    if (sideLabel) {
      h += '<div style="color:' + sideColor + ';font-size:11px;font-weight:800;margin-bottom:4px;">' + sideLabel + '</div>';
    }
    h += '<div style="color:#3D3D3A;font-size:12px;margin-bottom:16px;">' + (_isEN ? 'Distance: ~' : 'Distancia: ~') + distFt + ' ft</div>';

    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">CFM</label>';
    h += '<input id="ddCfmVal" type="number" value="' + defaultCFM + '" min="50" max="10000" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:18px;font-weight:700;text-align:center;outline:none;font-family:inherit;margin-bottom:12px;box-sizing:border-box;" />';

    h += '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">';
    var qc = [100,150,250,400,600,800,1200,2000];
    for (var q = 0; q < qc.length; q++) {
      h += '<button onclick="document.getElementById(\'ddCfmVal\').value=' + qc[q] + '" style="flex:1;min-width:40px;padding:7px 4px;border-radius:8px;border:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.04);color:#111111;font-size:11px;font-weight:700;cursor:pointer;">' + qc[q] + '</button>';
    }
    h += '</div>';

    // Residential / Commercial toggle
    h += '<div style="display:flex;gap:8px;margin-bottom:12px;">';
    h += '<button id="ddCfmRes" onclick="window._ddCfmComm=false;this.style.borderColor=\'#22c55e\';this.style.color=\'#16a34a\';document.getElementById(\'ddCfmCommBtn\').style.borderColor=\'rgba(0,0,0,0.12)\';document.getElementById(\'ddCfmCommBtn\').style.color=\'#57574F\'" style="flex:1;padding:8px;border-radius:8px;border:2px solid #22c55e;background:transparent;color:#16a34a;font-size:11px;font-weight:700;cursor:pointer;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-7 9 7v12a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9 21v-8h6v8"/></svg> Res 900FPM</button>';
    h += '<button id="ddCfmCommBtn" onclick="window._ddCfmComm=true;this.style.borderColor=\'#3b82f6\';this.style.color=\'#2563eb\';document.getElementById(\'ddCfmRes\').style.borderColor=\'rgba(0,0,0,0.12)\';document.getElementById(\'ddCfmRes\').style.color=\'#57574F\'" style="flex:1;padding:8px;border-radius:8px;border:2px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:11px;font-weight:700;cursor:pointer;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="8" y1="4" x2="8" y2="20"/></svg> Comm 1200FPM</button>';
    h += '</div>';

    h += '<div style="display:flex;gap:8px;">';
    h += '<button id="ddCfmCancel" style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:14px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Cancel' : 'Cancelar') + '</button>';
    h += '<button id="ddCfmOk" style="flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:14px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Add Duct' : 'Agregar Ducto') + '</button>';
    h += '</div></div>';

    overlay.innerHTML = h;
    document.body.appendChild(overlay);
    window._ddCfmComm = false;

    document.getElementById('ddCfmVal').focus();
    document.getElementById('ddCfmVal').select();

    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) { overlay.remove(); _render(); } });
    overlay.addEventListener('touchend', function(ev) { if (ev.target === overlay) { overlay.remove(); _render(); } });

    function closeCfm() { overlay.remove(); _render(); }
    function confirmCfm() {
      var cfm = parseInt(document.getElementById('ddCfmVal').value) || 400;
      var sizing = _calcDuctSize(cfm, window._ddCfmComm);
      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({
        type: 'ductline',
        x1: start.x, y1: start.y, x2: end.x, y2: end.y,
        cfm: cfm,
        size: sizing.roundLabel + ' / ' + sizing.rectLabel,
        velocity: sizing.velocity,
        ductSide: _side || null
      });
      _lastDuctCFM = cfm;
      _ductStart = { x: end.x, y: end.y };
      _livePos = null;
      overlay.remove();
      _render(); _saveState();
      _showToast((_isEN ? 'Duct placed — tap next point to extend, or switch tool' : 'Ducto colocado — toca el siguiente punto para extender, o cambia herramienta'), '#15803d');
    }

    var cfmCancel = document.getElementById('ddCfmCancel');
    var cfmOk = document.getElementById('ddCfmOk');
    cfmCancel.onclick = closeCfm;
    cfmCancel.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); closeCfm(); });
    cfmOk.onclick = confirmCfm;
    cfmOk.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); confirmCfm(); });
  }

  // ── Equipment Import from Install Checklist ────────────────────
  function _showImportEquip() {
    var overlay = document.createElement('div');
    overlay.id = 'ddImportOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';

    // Try to find equipment data from install checklist
    var date = new Date().toISOString().split('T')[0];
    var eqData = null;
    try { eqData = JSON.parse(localStorage.getItem('pdc_equip_' + date) || 'null'); } catch(e) {}

    var h = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:400px;width:100%;border:1.5px solid rgba(245,158,11,0.3);max-height:80vh;overflow-y:auto;">';
    h += '<h3 style="color:#b45309;font-size:16px;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:6px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="7" cy="15" r="1.5" fill="#b45309"/><circle cx="12" cy="15" r="1.5" fill="#b45309"/><path d="M17 13v4"/></svg> ' + (_isEN ? 'Import Equipment' : 'Importar Equipo') + '</h3>';
    h += '<div style="color:#111111;font-size:11px;margin-bottom:16px;">' + (_isEN ? 'From install checklist or manual entry' : 'Desde lista de instalación o entrada manual') + '</div>';

    if (eqData && (eqData.model || eqData.tonnage)) {
      h += '<div style="padding:12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;margin-bottom:14px;">';
      h += '<div style="font-size:10px;font-weight:700;color:rgba(245,158,11,0.7);margin-bottom:6px;">' + (_isEN ? 'FROM TODAY\'S INSTALL CHECKLIST' : 'DE LA LISTA DE INSTALACIÓN DE HOY') + '</div>';
      if (eqData.model) h += '<div style="color:#0F0F0F;font-size:13px;font-weight:700;">' + eqData.model + '</div>';
      if (eqData.tonnage) h += '<div style="color:#fbbf24;font-size:12px;margin-top:2px;">' + eqData.tonnage + '</div>';
      if (eqData.type) h += '<div style="color:#111111;font-size:11px;margin-top:2px;">' + eqData.type.replace(/_/g, ' ') + '</div>';
      h += '</div>';
    }

    // Tonnage selector
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">' + (_isEN ? 'Tonnage' : 'Tonelaje') + '</label>';
    var defaultTon = '';
    if (eqData && eqData.tonnage) {
      var tm = eqData.tonnage.match(/(\d+\.?\d*)/);
      if (tm) defaultTon = tm[1];
    }
    h += '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">';
    var tons = [1.5, 2, 2.5, 3, 3.5, 4, 5, 7.5, 10, 15, 20, 25];
    for (var t = 0; t < tons.length; t++) {
      var sel = (defaultTon && parseFloat(defaultTon) === tons[t]);
      h += '<button onclick="document.getElementById(\'ddImpTon\').value=' + tons[t] + '" style="padding:6px 10px;border-radius:6px;border:1px solid ' + (sel ? '#f59e0b' : 'rgba(0,0,0,0.12)') + ';background:' + (sel ? 'rgba(245,158,11,0.12)' : 'rgba(0,0,0,0.04)') + ';color:' + (sel ? '#92400e' : '#57574F') + ';font-size:11px;font-weight:700;cursor:pointer;">' + tons[t] + 'T</button>';
    }
    h += '</div>';
    h += '<input id="ddImpTon" type="number" value="' + (defaultTon || '3') + '" min="1" max="30" step="0.5" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:16px;font-weight:700;text-align:center;outline:none;font-family:inherit;margin-bottom:12px;box-sizing:border-box;" />';

    // Equipment type
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">' + (_isEN ? 'Equipment Type' : 'Tipo de Equipo') + '</label>';
    h += '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;">';
    var impTypes = [
      { id: 'ah', label: 'Air Handler' },
      { id: 'furnace', label: 'Furnace' },
      { id: 'cu', label: (_isEN ? 'Condenser' : 'Condensador') },
      { id: 'ms', label: 'Mini Split' }
    ];
    for (var it = 0; it < impTypes.length; it++) {
      var ieq = EQUIP_TYPES[impTypes[it].id];
      h += '<button onclick="document.getElementById(\'ddImpType\').value=\'' + impTypes[it].id + '\';var bs=this.parentElement.querySelectorAll(\'button\');for(var i=0;i<bs.length;i++){bs[i].style.borderColor=\'rgba(0,0,0,0.12)\';bs[i].style.color=\'#57574F\'};this.style.borderColor=\'' + ieq.color + '\';this.style.color=\'' + ieq.color + '\'" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (it === 0 ? ieq.color : 'rgba(0,0,0,0.12)') + ';background:transparent;color:' + (it === 0 ? ieq.color : '#57574F') + ';font-size:11px;font-weight:700;cursor:pointer;">' + ieq.label + ' ' + impTypes[it].label + '</button>';
    }
    h += '</div>';
    h += '<input id="ddImpType" type="hidden" value="ah" />';

    // Model label
    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">' + (_isEN ? 'Label (optional)' : 'Etiqueta (opcional)') + '</label>';
    h += '<input id="ddImpLabel" type="text" value="' + ((eqData && eqData.model) || '').replace(/"/g, '&quot;') + '" placeholder="' + (_isEN ? 'e.g. Carrier 24ACC636' : 'ej. Carrier 24ACC636') + '" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:13px;outline:none;font-family:inherit;margin-bottom:14px;box-sizing:border-box;" />';

    h += '<div style="display:flex;gap:8px;">';
    h += '<button id="ddImpCancel" style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:14px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Cancel' : 'Cancelar') + '</button>';
    h += '<button id="ddImpOk" style="flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:14px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Place on Board' : 'Colocar en Pizarra') + '</button>';
    h += '</div></div>';

    overlay.innerHTML = h;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) overlay.remove(); });
    overlay.addEventListener('touchend', function(ev) { if (ev.target === overlay) overlay.remove(); });

    function closeImp() { overlay.remove(); }
    function confirmImp() {
      var ton = parseFloat(document.getElementById('ddImpTon').value) || 3;
      var cfm = Math.round(ton * 400);
      var eType = document.getElementById('ddImpType').value || 'ah';
      var lbl = (document.getElementById('ddImpLabel').value || (ton + 'T')) + ' · ' + cfm + ' CFM';

      var cx = (_canvas.width / 2 - _offsetX) / _scale;
      var cy = (_canvas.height / 2 - _offsetY) / _scale;
      cx = Math.round(cx / GRID_SIZE) * GRID_SIZE;
      cy = Math.round(cy / GRID_SIZE) * GRID_SIZE;

      _undoStack.push(JSON.parse(JSON.stringify(_paths)));
      _paths.push({ type: 'equip', x: cx, y: cy, kind: eType, label: lbl, rotation: 0 });
      _systemCFM = cfm;
      overlay.remove();
      _render(); _saveState();
      _showToast((_isEN ? 'Equipment placed: ' : 'Equipo colocado: ') + ton + 'T / ' + cfm + ' CFM', '#f59e0b');
    }

    var impCancel = document.getElementById('ddImpCancel');
    var impOk = document.getElementById('ddImpOk');
    impCancel.onclick = closeImp;
    impCancel.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); closeImp(); });
    impOk.onclick = confirmImp;
    impOk.addEventListener('touchend', function(ev) { ev.preventDefault(); ev.stopPropagation(); confirmImp(); });
  }

  // ── Reference Panel — Tabbed UI ────────────────────────────────
  function _showReferencePanel() {
    var existing = document.getElementById('ddRefPanel');
    if (existing) { existing.remove(); return; }

    var panel = document.createElement('div');
    panel.id = 'ddRefPanel';
    panel.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#FFF8DC;border-top:2px solid #15803d;border-radius:20px 20px 0 0;padding:0;max-height:70vh;display:flex;flex-direction:column;box-shadow:0 -4px 20px rgba(0,0,0,0.15);';

    var h = '';
    // Header
    h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px 0;">';
    h += '<h3 style="color:#15803d;font-size:15px;font-weight:800;margin:0;display:flex;align-items:center;gap:6px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round"><path d="M21 3L3 21"/><path d="M21 3h-6"/><path d="M21 3v6"/><path d="M3 21h6"/><path d="M3 21v-6"/><circle cx="12" cy="12" r="1" fill="#15803d"/></svg> ' + (_isEN ? 'HVAC Reference' : 'Referencia HVAC') + '</h3>';
    h += '<button onclick="document.getElementById(\'ddRefPanel\').remove()" style="background:rgba(0,0,0,0.06);border:none;border-radius:8px;padding:6px 12px;color:#3D3D3A;font-size:14px;cursor:pointer;">✕</button>';
    h += '</div>';

    // Tabs
    h += '<div id="ddRefTabs" style="display:flex;gap:0;padding:10px 14px 0;overflow-x:auto;-webkit-overflow-scrolling:touch;flex-shrink:0;">';
    var tabs = [
      { id: 'ducts', label: _isEN ? 'Ducts' : 'Ductos', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 8h16v8H4z"/><line x1="2" y1="7" x2="2" y2="17"/><line x1="22" y1="7" x2="22" y2="17"/></svg>' },
      { id: 'fittings', label: 'Fittings', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v8a8 8 0 008 8h8"/><path d="M4 8h4"/><path d="M16 20v-4"/></svg>' },
      { id: 'registers', label: _isEN ? 'Registers' : 'Registros', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>' },
      { id: 'manualq', label: 'Manual Q', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="8" y1="4" x2="8" y2="20"/></svg>' },
      { id: 'calc', label: _isEN ? 'Calculator' : 'Calculadora', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><rect x="7" y="5" width="10" height="5" rx="1"/><circle cx="8" cy="14" r="0.8" fill="currentColor"/><circle cx="12" cy="14" r="0.8" fill="currentColor"/><circle cx="16" cy="14" r="0.8" fill="currentColor"/><circle cx="8" cy="18" r="0.8" fill="currentColor"/><circle cx="12" cy="18" r="0.8" fill="currentColor"/><circle cx="16" cy="18" r="0.8" fill="currentColor"/></svg>' }
    ];
    for (var ti = 0; ti < tabs.length; ti++) {
      var isFirst = ti === 0;
      h += '<button class="dd-ref-tab" data-tab="' + tabs[ti].id + '" onclick="window._ddSwitchTab(\'' + tabs[ti].id + '\')" style="flex-shrink:0;padding:8px 14px;border:none;border-bottom:2px solid ' + (isFirst ? '#15803d' : 'transparent') + ';background:transparent;color:' + (isFirst ? '#15803d' : '#57574F') + ';font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">' + tabs[ti].icon + ' ' + tabs[ti].label + '</button>';
    }
    h += '</div>';

    // Content area
    h += '<div id="ddRefContent" style="flex:1;overflow-y:auto;padding:14px 16px 20px;-webkit-overflow-scrolling:touch;"></div>';

    panel.innerHTML = h;
    document.body.appendChild(panel);

    // Show first tab
    _renderRefTab('ducts');
  }

  window._ddSwitchTab = function(tabId) {
    var tabs = document.querySelectorAll('.dd-ref-tab');
    for (var i = 0; i < tabs.length; i++) {
      var isActive = tabs[i].getAttribute('data-tab') === tabId;
      tabs[i].style.borderBottomColor = isActive ? '#15803d' : 'transparent';
      tabs[i].style.color = isActive ? '#15803d' : '#57574F';
    }
    _renderRefTab(tabId);
  };

  function _renderRefTab(tabId) {
    var el = document.getElementById('ddRefContent');
    if (!el) return;

    if (tabId === 'ducts') el.innerHTML = _buildDuctsTab();
    else if (tabId === 'fittings') el.innerHTML = _buildFittingsTab();
    else if (tabId === 'registers') el.innerHTML = _buildRegistersTab();
    else if (tabId === 'manualq') el.innerHTML = _buildManualQTab();
    else if (tabId === 'calc') el.innerHTML = _buildCalcTab();
  }

  // ── Tab: Ducts ─────────────────────────────────────────────────
  function _buildDuctsTab() {
    var h = '';

    // Sub-tabs: Round | Rectangular | Square
    h += '<div style="display:flex;gap:6px;margin-bottom:12px;">';
    h += '<button id="ddDuctRound" onclick="window._ddDuctSub(\'round\')" style="flex:1;padding:8px;border-radius:8px;border:2px solid #15803d;background:transparent;color:#15803d;font-size:11px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Round' : 'Redondo') + '</button>';
    h += '<button id="ddDuctRect" onclick="window._ddDuctSub(\'rect\')" style="flex:1;padding:8px;border-radius:8px;border:2px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:11px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Rectangular' : 'Rectangular') + '</button>';
    h += '<button id="ddDuctSquare" onclick="window._ddDuctSub(\'square\')" style="flex:1;padding:8px;border-radius:8px;border:2px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:11px;font-weight:700;cursor:pointer;">' + (_isEN ? 'Square' : 'Cuadrado') + '</button>';
    h += '</div>';

    h += '<div id="ddDuctSubContent"></div>';

    // Trigger round by default after DOM update
    setTimeout(function() { window._ddDuctSub('round'); }, 10);
    return h;
  }

  window._ddDuctSub = function(sub) {
    var el = document.getElementById('ddDuctSubContent');
    if (!el) return;
    // Update sub-tab buttons
    var ids = ['ddDuctRound', 'ddDuctRect', 'ddDuctSquare'];
    var active = sub === 'round' ? 0 : sub === 'rect' ? 1 : 2;
    for (var i = 0; i < ids.length; i++) {
      var btn = document.getElementById(ids[i]);
      if (btn) {
        btn.style.borderColor = i === active ? '#15803d' : 'rgba(0,0,0,0.12)';
        btn.style.color = i === active ? '#15803d' : '#57574F';
      }
    }

    var h = '';
    var thStyle = 'padding:6px 4px;font-size:13px;font-weight:700;color:#111111;text-align:center;border-bottom:1px solid rgba(0,0,0,0.08);';
    var tdStyle = 'padding:6px 4px;font-size:14px;color:#111111;text-align:center;border-bottom:1px solid rgba(0,0,0,0.06);';

    if (sub === 'round') {
      h += '<div style="font-size:11px;color:#3D3D3A;margin-bottom:8px;">' + (_isEN ? 'Round duct: CFM & velocity at 3 friction rates (in.wc/100ft)' : 'Ducto redondo: CFM y velocidad a 3 tasas de fricción (in.wc/100ft)') + '</div>';
      h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">';
      h += '<table style="width:100%;border-collapse:collapse;min-width:400px;">';
      h += '<tr><th style="' + thStyle + '">' + (_isEN ? 'Dia' : 'Diám') + '</th><th style="' + thStyle + '">Area ft²</th>';
      for (var fi = 0; fi < FRICTION_RATES.length; fi++) {
        h += '<th colspan="2" style="' + thStyle + 'color:#4ade80;">' + FRICTION_RATES[fi].label + '</th>';
      }
      h += '</tr>';
      h += '<tr><th style="' + thStyle + '"></th><th style="' + thStyle + '"></th>';
      for (var fi2 = 0; fi2 < FRICTION_RATES.length; fi2++) {
        h += '<th style="' + thStyle + '">CFM</th><th style="' + thStyle + '">FPM</th>';
      }
      h += '</tr>';

      for (var ri = 0; ri < ROUND_SIZES.length; ri++) {
        var d = ROUND_SIZES[ri];
        var area = (Math.PI * Math.pow(d / 24, 2)).toFixed(3);
        var bg = ri % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
        h += '<tr style="' + bg + '">';
        h += '<td style="' + tdStyle + 'color:#4ade80;font-weight:700;">' + d + '"</td>';
        h += '<td style="' + tdStyle + 'color:rgba(200,220,240,0.6);">' + area + '</td>';
        for (var fj = 0; fj < FRICTION_RATES.length; fj++) {
          var calc = _calcRoundCFM(d, FRICTION_RATES[fj].val);
          var vc = calc.vel <= 1000 ? 'rgba(200,220,240,0.7)' : calc.vel <= 1500 ? '#fbbf24' : '#f87171';
          h += '<td style="' + tdStyle + 'color:#3D3D3A;font-weight:600;">' + calc.cfm + '</td>';
          h += '<td style="' + tdStyle + 'color:' + vc + ';">' + calc.vel + '</td>';
        }
        h += '</tr>';
      }
      h += '</table></div>';

    } else if (sub === 'rect') {
      h += '<div style="font-size:11px;color:#3D3D3A;margin-bottom:8px;">' + (_isEN ? 'Rectangular duct: equivalent round diameter, CFM at 0.08 friction' : 'Ducto rectangular: diámetro equivalente redondo, CFM a fricción 0.08') + '</div>';
      h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">';
      h += '<table style="width:100%;border-collapse:collapse;min-width:320px;">';
      h += '<tr><th style="' + thStyle + '">' + (_isEN ? 'Size W×H' : 'Tamaño W×H') + '</th><th style="' + thStyle + '">D eq"</th><th style="' + thStyle + '">CFM @0.08</th><th style="' + thStyle + '">FPM</th></tr>';

      for (var rci = 0; rci < RECT_COMMON.length; rci++) {
        var rw = RECT_COMMON[rci][0], rh = RECT_COMMON[rci][1];
        if (rw === rh) continue; // Skip square — shown in square tab
        var deq = _rectEquivDia(rw, rh);
        var rcCalc = _calcRoundCFM(deq, 0.08);
        var bg2 = rci % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
        h += '<tr style="' + bg2 + '">';
        h += '<td style="' + tdStyle + 'color:#111111;font-weight:700;">' + rw + '×' + rh + '"</td>';
        h += '<td style="' + tdStyle + 'color:rgba(200,220,240,0.6);">' + deq.toFixed(1) + '"</td>';
        h += '<td style="' + tdStyle + 'color:#3D3D3A;font-weight:600;">' + rcCalc.cfm + '</td>';
        var vc2 = rcCalc.vel <= 1000 ? 'rgba(200,220,240,0.7)' : rcCalc.vel <= 1500 ? '#fbbf24' : '#f87171';
        h += '<td style="' + tdStyle + 'color:' + vc2 + ';">' + rcCalc.vel + '</td>';
        h += '</tr>';
      }
      h += '</table></div>';

    } else { // square
      h += '<div style="font-size:11px;color:#3D3D3A;margin-bottom:8px;">' + (_isEN ? 'Square duct: equivalent diameter, CFM at 0.08 friction' : 'Ducto cuadrado: diámetro equivalente, CFM a fricción 0.08') + '</div>';
      h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">';
      h += '<table style="width:100%;border-collapse:collapse;">';
      h += '<tr><th style="' + thStyle + '">' + (_isEN ? 'Size' : 'Tamaño') + '</th><th style="' + thStyle + '">D eq"</th><th style="' + thStyle + '">Area ft²</th><th style="' + thStyle + '">CFM @0.08</th><th style="' + thStyle + '">FPM</th></tr>';

      var sqSizes = [6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
      for (var si = 0; si < sqSizes.length; si++) {
        var s = sqSizes[si];
        var sDeq = _rectEquivDia(s, s);
        var sArea = (s * s / 144).toFixed(2);
        var sCalc = _calcRoundCFM(sDeq, 0.08);
        var bg3 = si % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
        h += '<tr style="' + bg3 + '">';
        h += '<td style="' + tdStyle + 'color:#111111;font-weight:700;">' + s + '×' + s + '"</td>';
        h += '<td style="' + tdStyle + 'color:rgba(200,220,240,0.6);">' + sDeq.toFixed(1) + '"</td>';
        h += '<td style="' + tdStyle + 'color:rgba(200,220,240,0.5);">' + sArea + '</td>';
        h += '<td style="' + tdStyle + 'color:#3D3D3A;font-weight:600;">' + sCalc.cfm + '</td>';
        var vc3 = sCalc.vel <= 1000 ? 'rgba(200,220,240,0.7)' : sCalc.vel <= 1500 ? '#fbbf24' : '#f87171';
        h += '<td style="' + tdStyle + 'color:' + vc3 + ';">' + sCalc.vel + '</td>';
        h += '</tr>';
      }
      h += '</table></div>';
    }

    el.innerHTML = h;
  };

  // ── Tab: Fittings ──────────────────────────────────────────────
  function _buildFittingsTab() {
    var h = '';
    h += '<div style="font-size:11px;color:#3D3D3A;margin-bottom:10px;">' + (_isEN ? 'Tap a fitting to select it, then place on the board. Equivalent length in feet.' : 'Toca un fitting para seleccionarlo, luego colócalo en la pizarra. Longitud equivalente en pies.') + '</div>';

    // Fitting size selector
    h += '<div style="margin-bottom:10px;">';
    h += '<div style="font-size:10px;font-weight:700;color:#111111;margin-bottom:4px;">' + (_isEN ? 'FITTING SIZE' : 'TAMAÑO DEL FITTING') + '</div>';
    h += '<div style="display:flex;gap:4px;flex-wrap:wrap;">';
    var fSizes = [4,5,6,7,8,9,10,12,14,16,18,20,24,30,36];
    for (var fs = 0; fs < fSizes.length; fs++) {
      var isSel = fSizes[fs] === _fittingSize;
      h += '<button onclick="window._ddSetFitSize(' + fSizes[fs] + ')" style="padding:5px 8px;border-radius:6px;border:1px solid ' + (isSel ? '#7c3aed' : 'rgba(0,0,0,0.1)') + ';background:' + (isSel ? 'rgba(124,58,237,0.1)' : 'rgba(0,0,0,0.03)') + ';color:' + (isSel ? '#6d28d9' : '#57574F') + ';font-size:12px;font-weight:700;cursor:pointer;">' + fSizes[fs] + '"</button>';
    }
    h += '</div></div>';

    // Fitting cards
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    for (var fi = 0; fi < FITTING_TYPES.length; fi++) {
      var ft = FITTING_TYPES[fi];
      var el = _getFittingEL(ft.id, _fittingSize);
      var isCur = ft.id === _fittingType;
      h += '<button onclick="window._ddSelectFitting(\'' + ft.id + '\')" style="padding:10px 8px;border-radius:10px;border:1.5px solid ' + (isCur ? '#7c3aed' : 'rgba(0,0,0,0.1)') + ';background:' + (isCur ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.02)') + ';cursor:pointer;text-align:left;">';
      h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
      h += '<span style="font-size:18px;">' + ft.icon + '</span>';
      h += '<span style="color:' + (isCur ? '#c4b5fd' : 'rgba(200,220,240,0.8)') + ';font-size:11px;font-weight:700;">' + (_isEN ? ft.en : ft.es) + '</span>';
      h += '</div>';
      h += '<div style="color:#a78bfa;font-size:13px;font-weight:800;">' + el + ' ft</div>';
      h += '<div style="color:#111111;font-size:9px;">' + (_isEN ? 'EL @ ' : 'LE @ ') + _fittingSize + '"</div>';
      h += '</button>';
    }
    h += '</div>';

    // Full EL Table
    h += '<div style="margin-top:14px;"><div style="font-size:11px;font-weight:700;color:#3D3D3A;margin-bottom:6px;">' + (_isEN ? 'EQUIVALENT LENGTH TABLE (ft)' : 'TABLA DE LONGITUD EQUIVALENTE (ft)') + '</div>';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">';
    var thS = 'padding:5px 3px;font-size:13px;font-weight:700;color:#111111;text-align:center;border-bottom:1px solid rgba(0,0,0,0.08);';
    var tdS = 'padding:6px 4px;font-size:14px;text-align:center;border-bottom:1px solid rgba(0,0,0,0.06);color:#111111;';
    h += '<table style="width:100%;border-collapse:collapse;min-width:500px;">';
    h += '<tr><th style="' + thS + 'text-align:left;">Fitting</th>';
    var elSizes = [4,6,8,10,12,14,16,18,20,24,30,36];
    for (var es = 0; es < elSizes.length; es++) {
      h += '<th style="' + thS + '">' + elSizes[es] + '"</th>';
    }
    h += '</tr>';

    for (var fti = 0; fti < FITTING_TYPES.length; fti++) {
      var ftd = FITTING_TYPES[fti];
      var bg4 = fti % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
      h += '<tr style="' + bg4 + '"><td style="' + tdS + 'text-align:left;color:#c4b5fd;font-weight:600;white-space:nowrap;">' + ftd.icon + ' ' + (_isEN ? ftd.en : ftd.es) + '</td>';
      for (var es2 = 0; es2 < elSizes.length; es2++) {
        var v = ftd.el[elSizes[es2]];
        h += '<td style="' + tdS + '">' + (v || '—') + '</td>';
      }
      h += '</tr>';
    }
    h += '</table></div></div>';

    return h;
  }

  window._ddSetFitSize = function(size) {
    _fittingSize = size;
    _renderRefTab('fittings');
  };

  window._ddSelectFitting = function(id) {
    _fittingType = id;
    _tool = 'fitting';
    _setTool('fitting');
    // Close panel
    var panel = document.getElementById('ddRefPanel');
    if (panel) panel.remove();
    _showToast((_isEN ? 'Fitting: ' : 'Fitting: ') + (_isEN ? _getFittingDef(id).en : _getFittingDef(id).es) + ' ' + _fittingSize + '"', '#a78bfa');
  };

  // ── Tab: Registers (Manual T) ──────────────────────────────────
  function _buildRegistersTab() {
    var h = '';
    var thS = 'padding:6px 4px;font-size:13px;font-weight:700;color:#111111;text-align:center;border-bottom:1px solid rgba(0,0,0,0.08);';
    var tdS = 'padding:6px 4px;font-size:14px;text-align:center;border-bottom:1px solid rgba(0,0,0,0.06);color:#111111;';

    // Supply Registers
    h += '<div style="font-size:12px;font-weight:800;color:#ef4444;margin-bottom:6px;">📘 MANUAL T — ' + (_isEN ? 'Supply Registers' : 'Registros de Suministro') + '</div>';
    h += '<div style="font-size:13px;color:#111111;margin-bottom:8px;">' + (_isEN ? 'Select register size based on CFM and throw distance needed' : 'Selecciona el tamaño del registro según CFM y distancia de tiro necesaria') + '</div>';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:16px;">';
    h += '<table style="width:100%;border-collapse:collapse;min-width:380px;">';
    h += '<tr><th style="' + thS + '">' + (_isEN ? 'Size' : 'Tamaño') + '</th><th style="' + thS + '">CFM Min</th><th style="' + thS + '">CFM Max</th><th style="' + thS + '">' + (_isEN ? 'Throw Min' : 'Tiro Min') + '</th><th style="' + thS + '">' + (_isEN ? 'Throw Max' : 'Tiro Max') + '</th><th style="' + thS + '">NC</th></tr>';

    for (var sr = 0; sr < SUPPLY_REGISTERS.length; sr++) {
      var reg = SUPPLY_REGISTERS[sr];
      var bg = sr % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
      h += '<tr style="' + bg + '">';
      h += '<td style="' + tdS + 'color:#ef4444;font-weight:700;">' + reg.size + '"</td>';
      h += '<td style="' + tdS + '">' + reg.cfm[0] + '</td>';
      h += '<td style="' + tdS + 'font-weight:600;">' + reg.cfm[1] + '</td>';
      h += '<td style="' + tdS + '">' + reg.throw[0] + ' ft</td>';
      h += '<td style="' + tdS + '">' + reg.throw[1] + ' ft</td>';
      h += '<td style="' + tdS + 'color:' + (reg.nc <= 30 ? 'rgba(200,220,240,0.6)' : reg.nc <= 40 ? '#fbbf24' : '#f87171') + ';">' + reg.nc + '</td>';
      h += '</tr>';
    }
    h += '</table></div>';

    // Return Grilles
    h += '<div style="font-size:12px;font-weight:800;color:#3b82f6;margin-bottom:6px;">📘 MANUAL T — ' + (_isEN ? 'Return Grilles' : 'Rejillas de Retorno') + '</div>';
    h += '<div style="font-size:13px;color:#111111;margin-bottom:8px;">' + (_isEN ? 'Size return grille so face velocity ≤ 400 FPM to minimize noise' : 'El tamaño de la rejilla de retorno debe mantener velocidad facial ≤ 400 FPM para minimizar ruido') + '</div>';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">';
    h += '<table style="width:100%;border-collapse:collapse;min-width:320px;">';
    h += '<tr><th style="' + thS + '">' + (_isEN ? 'Size' : 'Tamaño') + '</th><th style="' + thS + '">CFM Min</th><th style="' + thS + '">CFM Max</th><th style="' + thS + '">' + (_isEN ? 'Free Area' : 'Área Libre') + '</th><th style="' + thS + '">' + (_isEN ? 'Max Vel' : 'Vel Máx') + '</th></tr>';

    for (var rg = 0; rg < RETURN_GRILLES.length; rg++) {
      var gr = RETURN_GRILLES[rg];
      var bg2 = rg % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
      h += '<tr style="' + bg2 + '">';
      h += '<td style="' + tdS + 'color:#111111;font-weight:700;">' + gr.size + '"</td>';
      h += '<td style="' + tdS + '">' + gr.cfm[0] + '</td>';
      h += '<td style="' + tdS + 'font-weight:600;">' + gr.cfm[1] + '</td>';
      h += '<td style="' + tdS + '">' + gr.freeArea + '%</td>';
      h += '<td style="' + tdS + '">' + gr.maxVel + ' FPM</td>';
      h += '</tr>';
    }
    h += '</table></div>';

    // Noise criteria reference
    h += '<div style="margin-top:14px;padding:12px;background:rgba(0,0,0,0.03);border-radius:10px;border:1px solid rgba(0,0,0,0.08);">';
    h += '<div style="font-size:10px;font-weight:700;color:#111111;margin-bottom:6px;">' + (_isEN ? 'NOISE CRITERIA (NC) GUIDE' : 'GUÍA CRITERIO DE RUIDO (NC)') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px;">';
    var ncData = [
      { range: 'NC 20-25', use: _isEN ? 'Bedrooms, churches' : 'Dormitorios, iglesias' },
      { range: 'NC 25-30', use: _isEN ? 'Living rooms, offices' : 'Salas, oficinas' },
      { range: 'NC 30-35', use: _isEN ? 'Retail, classrooms' : 'Tiendas, aulas' },
      { range: 'NC 35-40', use: _isEN ? 'Restaurants, lobbies' : 'Restaurantes, lobbies' },
      { range: 'NC 40-45', use: _isEN ? 'Kitchens, workshops' : 'Cocinas, talleres' },
      { range: 'NC 45+', use: _isEN ? 'Mechanical rooms' : 'Cuartos mecánicos' }
    ];
    for (var nc = 0; nc < ncData.length; nc++) {
      h += '<div style="color:#fbbf24;font-weight:700;padding:2px 0;">' + ncData[nc].range + '</div>';
      h += '<div style="color:rgba(200,220,240,0.6);padding:2px 0;">' + ncData[nc].use + '</div>';
    }
    h += '</div></div>';

    return h;
  }

  // ── Tab: Manual Q (Commercial) ─────────────────────────────────
  function _buildManualQTab() {
    var h = '';
    var thS = 'padding:6px 4px;font-size:13px;font-weight:700;color:#111111;text-align:center;border-bottom:1px solid rgba(0,0,0,0.08);';
    var tdS = 'padding:6px 4px;font-size:14px;text-align:center;border-bottom:1px solid rgba(0,0,0,0.06);color:#111111;';

    h += '<div style="font-size:12px;font-weight:800;color:#111111;margin-bottom:4px;">📘 MANUAL Q — ' + (_isEN ? 'Commercial Duct Design' : 'Diseño de Ductos Comercial') + '</div>';
    h += '<div style="font-size:13px;color:#111111;margin-bottom:12px;">ACCA Manual Q — ' + (_isEN ? 'Low Pressure, Low Velocity Duct System Design' : 'Diseño de Sistemas de Ductos de Baja Presión y Baja Velocidad') + '</div>';

    // Tonnage → CFM reference
    h += '<div style="font-size:11px;font-weight:700;color:#3D3D3A;margin-bottom:6px;">' + (_isEN ? 'TONNAGE → CFM (400 CFM/Ton)' : 'TONELAJE → CFM (400 CFM/Ton)') + '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px;margin-bottom:14px;">';
    for (var tc = 0; tc < MQ_TONS_CFM.length; tc++) {
      var tcr = MQ_TONS_CFM[tc];
      h += '<div style="padding:8px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:8px;text-align:center;">';
      h += '<div style="font-size:14px;font-weight:800;color:#111111;">' + tcr.tons + 'T</div>';
      h += '<div style="font-size:10px;color:rgba(200,220,240,0.6);">' + tcr.btu.toLocaleString() + ' BTU</div>';
      h += '<div style="font-size:11px;font-weight:700;color:#0F0F0F;">' + tcr.cfm.toLocaleString() + ' CFM</div>';
      h += '</div>';
    }
    h += '</div>';

    // Velocity limits
    h += '<div style="font-size:11px;font-weight:700;color:#3D3D3A;margin-bottom:6px;">' + (_isEN ? 'VELOCITY LIMITS BY LOCATION' : 'LÍMITES DE VELOCIDAD POR UBICACIÓN') + '</div>';
    h += '<div style="overflow-x:auto;margin-bottom:14px;">';
    h += '<table style="width:100%;border-collapse:collapse;">';
    h += '<tr><th style="' + thS + 'text-align:left;">' + (_isEN ? 'Location' : 'Ubicación') + '</th><th style="' + thS + '">' + (_isEN ? 'Max FPM' : 'Máx FPM') + '</th><th style="' + thS + '">' + (_isEN ? 'Recommended' : 'Recomendado') + '</th></tr>';
    for (var mv = 0; mv < MQ_VELOCITY.length; mv++) {
      var vel = MQ_VELOCITY[mv];
      var bg = mv % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
      h += '<tr style="' + bg + '">';
      h += '<td style="' + tdS + 'text-align:left;color:#3D3D3A;font-weight:600;">' + (_isEN ? vel.en : vel.es) + '</td>';
      h += '<td style="' + tdS + 'color:#fbbf24;font-weight:700;">' + vel.max + '</td>';
      h += '<td style="' + tdS + 'color:#4ade80;">' + vel.rec + '</td>';
      h += '</tr>';
    }
    h += '</table></div>';

    // Friction rate design
    h += '<div style="font-size:11px;font-weight:700;color:#3D3D3A;margin-bottom:6px;">' + (_isEN ? 'DESIGN FRICTION RATE (in.wc / 100ft)' : 'TASA DE FRICCIÓN DE DISEÑO (in.wc / 100ft)') + '</div>';
    h += '<div style="display:grid;gap:6px;margin-bottom:14px;">';
    for (var mf = 0; mf < MQ_FRICTION.length; mf++) {
      var fr = MQ_FRICTION[mf];
      h += '<div style="padding:10px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);border-radius:8px;display:flex;justify-content:space-between;align-items:center;">';
      h += '<div><div style="color:#3D3D3A;font-weight:700;font-size:11px;">' + (_isEN ? fr.en : fr.es) + '</div><div style="color:#111111;font-size:9px;">' + (_isEN ? fr.note_en : fr.note_es) + '</div></div>';
      h += '<div style="color:#4ade80;font-weight:800;font-size:14px;">' + fr.rate + '</div>';
      h += '</div>';
    }
    h += '</div>';

    // Duct class
    h += '<div style="font-size:11px;font-weight:700;color:#3D3D3A;margin-bottom:6px;">' + (_isEN ? 'DUCT PRESSURE CLASS (SMACNA)' : 'CLASE DE PRESIÓN DE DUCTO (SMACNA)') + '</div>';
    h += '<div style="overflow-x:auto;">';
    h += '<table style="width:100%;border-collapse:collapse;">';
    h += '<tr><th style="' + thS + '">' + (_isEN ? 'Class' : 'Clase') + '</th><th style="' + thS + '">' + (_isEN ? 'Pressure' : 'Presión') + '</th><th style="' + thS + '">' + (_isEN ? 'Application' : 'Aplicación') + '</th></tr>';
    for (var dc = 0; dc < MQ_DUCT_CLASS.length; dc++) {
      var dcr = MQ_DUCT_CLASS[dc];
      var bg2 = dc % 2 === 0 ? '' : 'background:rgba(0,0,0,0.03);';
      h += '<tr style="' + bg2 + '">';
      h += '<td style="' + tdS + 'color:#fbbf24;font-weight:700;">' + dcr.cls + '</td>';
      h += '<td style="' + tdS + '">' + dcr.psi + '</td>';
      h += '<td style="' + tdS + 'text-align:left;">' + (_isEN ? dcr.en : dcr.es) + '</td>';
      h += '</tr>';
    }
    h += '</table></div>';

    // Key formulas
    h += '<div style="margin-top:14px;padding:12px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:10px;">';
    h += '<div style="font-size:10px;font-weight:700;color:#111111;margin-bottom:6px;">' + (_isEN ? 'KEY FORMULAS' : 'FÓRMULAS CLAVE') + '</div>';
    h += '<div style="font-size:10px;color:#3D3D3A;line-height:1.8;font-family:monospace;">';
    h += 'CFM = Velocity (FPM) × Area (ft²)<br>';
    h += 'Area = π × (D/24)² ft²<br>';
    h += 'D_eq = 1.3 × (W×H)^0.625 / (W+H)^0.25<br>';
    h += 'TEL = ' + (_isEN ? 'Straight + Σ Fitting EL' : 'Recto + Σ EL de Fittings') + '<br>';
    h += 'CFM/Ton ≈ 400 (' + (_isEN ? 'standard' : 'estándar') + ')<br>';
    h += '1 Ton = 12,000 BTU/h';
    h += '</div></div>';

    return h;
  }

  // ── Tab: Calculator ────────────────────────────────────────────
  function _buildCalcTab() {
    var h = '';

    h += '<label style="font-size:11px;font-weight:700;color:#3D3D3A;display:block;margin-bottom:4px;">CFM</label>';
    h += '<input id="ddCalcCFM" type="number" value="400" min="50" max="10000" oninput="window._ddUpdateCalc()" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid rgba(0,0,0,0.12);background:#f8f6f0;color:#0F0F0F;font-size:16px;font-weight:700;text-align:center;outline:none;font-family:inherit;box-sizing:border-box;" />';

    h += '<div style="display:flex;gap:6px;margin:10px 0;flex-wrap:wrap;">';
    var quickCFMs = [100,150,200,250,300,400,500,600,800,1000,1200,1600,2000,3000];
    for (var q = 0; q < quickCFMs.length; q++) {
      h += '<button onclick="document.getElementById(\'ddCalcCFM\').value=' + quickCFMs[q] + ';window._ddUpdateCalc()" style="padding:5px 8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.04);color:#111111;font-size:12px;font-weight:700;cursor:pointer;">' + quickCFMs[q] + '</button>';
    }
    h += '</div>';

    h += '<div style="display:flex;gap:8px;margin-bottom:12px;">';
    h += '<button id="ddCalcRes" onclick="window._ddCalcType=\'res\';window._ddUpdateCalc();this.style.borderColor=\'#22c55e\';this.style.color=\'#16a34a\';document.getElementById(\'ddCalcComm\').style.borderColor=\'rgba(0,0,0,0.12)\';document.getElementById(\'ddCalcComm\').style.color=\'#57574F\'" style="flex:1;padding:10px;border-radius:10px;border:2px solid #22c55e;background:transparent;color:#16a34a;font-size:12px;font-weight:700;cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-7 9 7v12a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9 21v-8h6v8"/></svg> Residencial</button>';
    h += '<button id="ddCalcComm" onclick="window._ddCalcType=\'comm\';window._ddUpdateCalc();this.style.borderColor=\'#3b82f6\';this.style.color=\'#2563eb\';document.getElementById(\'ddCalcRes\').style.borderColor=\'rgba(0,0,0,0.12)\';document.getElementById(\'ddCalcRes\').style.color=\'#57574F\'" style="flex:1;padding:10px;border-radius:10px;border:2px solid rgba(0,0,0,0.12);background:transparent;color:#111111;font-size:12px;font-weight:700;cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="8" y1="4" x2="8" y2="20"/></svg> Comercial</button>';
    h += '</div>';

    h += '<div id="ddCalcResults"></div>';

    window._ddCalcType = 'res';
    setTimeout(function() { window._ddUpdateCalc(); }, 10);
    return h;
  }

  window._ddUpdateCalc = function() {
    var cfm = parseInt((document.getElementById('ddCalcCFM') || {}).value) || 400;
    var isComm = window._ddCalcType === 'comm';
    var result = _calcDuctSize(cfm, isComm);
    var el = document.getElementById('ddCalcResults');
    if (!el) return;

    var velColor = result.status === 'ok' ? '#4ade80' : result.status === 'warn' ? '#fbbf24' : '#f87171';
    var velLabel = result.status === 'ok' ? 'OK' : result.status === 'warn' ? (_isEN ? 'CAUTION' : 'PRECAUCIÓN') : (_isEN ? 'TOO HIGH' : 'MUY ALTA');

    var h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">';
    h += '<div style="text-align:center;padding:12px;background:rgba(34,197,94,0.08);border-radius:10px;border:1px solid rgba(34,197,94,0.2);"><div style="font-size:10px;color:#3D3D3A;font-weight:700;margin-bottom:4px;">' + (_isEN ? 'ROUND DUCT' : 'DUCTO REDONDO') + '</div><div style="font-size:24px;font-weight:800;color:#4ade80;">' + result.roundLabel + '</div></div>';
    h += '<div style="text-align:center;padding:12px;background:rgba(59,130,246,0.08);border-radius:10px;border:1px solid rgba(59,130,246,0.2);"><div style="font-size:10px;color:#3D3D3A;font-weight:700;margin-bottom:4px;">' + (_isEN ? 'RECTANGULAR' : 'RECTANGULAR') + '</div><div style="font-size:24px;font-weight:800;color:#111111;">' + result.rectLabel + '</div></div>';
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">';
    h += '<div style="text-align:center;padding:12px;background:rgba(0,0,0,0.03);border-radius:10px;border:1px solid rgba(0,0,0,0.08);"><div style="font-size:10px;color:#3D3D3A;font-weight:700;margin-bottom:4px;">VELOCITY</div><div style="font-size:20px;font-weight:800;color:' + velColor + ';">' + result.velocity + ' <span style="font-size:12px;">FPM</span></div><div style="font-size:9px;font-weight:700;color:' + velColor + ';margin-top:2px;">' + velLabel + '</div></div>';
    h += '<div style="text-align:center;padding:12px;background:rgba(0,0,0,0.03);border-radius:10px;border:1px solid rgba(0,0,0,0.08);"><div style="font-size:10px;color:#3D3D3A;font-weight:700;margin-bottom:4px;">CFM</div><div style="font-size:20px;font-weight:800;color:#0F0F0F;">' + cfm + '</div><div style="font-size:9px;color:#111111;margin-top:2px;">' + (isComm ? '1200 FPM target' : '900 FPM target') + '</div></div>';
    h += '</div>';

    // Quick reference table
    h += '<div style="font-size:11px;font-weight:700;color:#3D3D3A;margin-bottom:6px;">' + (_isEN ? 'Quick Reference' : 'Referencia Rápida') + '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;font-size:10px;">';
    h += '<div style="color:#111111;font-weight:700;padding:4px;">CFM</div><div style="color:#111111;font-weight:700;padding:4px;">' + (_isEN ? 'Round' : 'Redondo') + '</div><div style="color:#111111;font-weight:700;padding:4px;">Rect</div><div style="color:#111111;font-weight:700;padding:4px;">FPM</div>';
    var refCFMs = [100,150,200,300,400,600,800,1000,1200,1600,2000,3000];
    for (var r = 0; r < refCFMs.length; r++) {
      var ref = _calcDuctSize(refCFMs[r], isComm);
      var rc = ref.status === 'ok' ? 'rgba(200,220,240,0.7)' : ref.status === 'warn' ? '#fbbf24' : '#f87171';
      var hl = refCFMs[r] === cfm ? 'background:rgba(34,197,94,0.1);' : '';
      h += '<div style="padding:4px;color:#3D3D3A;' + hl + '">' + refCFMs[r] + '</div>';
      h += '<div style="padding:4px;color:#4ade80;font-weight:700;' + hl + '">' + ref.roundLabel + '</div>';
      h += '<div style="padding:4px;color:#111111;' + hl + '">' + ref.rectLabel + '</div>';
      h += '<div style="padding:4px;color:' + rc + ';' + hl + '">' + ref.velocity + '</div>';
    }
    h += '</div>';

    el.innerHTML = h;
  };

  // ── Persistence ────────────────────────────────────────────────
  function _saveState() {
    try {
      var date = new Date().toISOString().split('T')[0];
      localStorage.setItem('dd_paths_' + date, JSON.stringify(_paths));
    } catch(e) {}
  }

  function _loadState() {
    try {
      var date = new Date().toISOString().split('T')[0];
      var saved = localStorage.getItem('dd_paths_' + date);
      if (saved) {
        _paths = JSON.parse(saved);
        _recalcTotalEL();
      }
    } catch(e) {}
  }

  // ── Tool Selection ─────────────────────────────────────────────
  function _setTool(toolName) {
    _tool = toolName;
    _ductStart = null;
    _ductStartSide = null;
    _wallStart = null;
    _measureStart = null;
    _livePos = null;
    _currentPath = null;
    _drawing = false;

    var btns = document.querySelectorAll('.dd-tool-btn');
    for (var i = 0; i < btns.length; i++) {
      var isActive = btns[i].getAttribute('data-tool') === toolName;
      btns[i].style.borderColor = isActive ? '#1e40af' : 'rgba(0,0,0,0.15)';
      btns[i].style.background = isActive ? 'rgba(30,64,175,0.1)' : '#fff';
      btns[i].style.color = isActive ? '#1e40af' : '#3D3D3A';
    }

    // Show/hide fitting palette
    var fitPal = document.getElementById('ddFitPalette');
    if (fitPal) fitPal.style.display = toolName === 'fitting' ? 'flex' : 'none';
    // Show/hide equip palette
    var eqPal = document.getElementById('ddEquipPalette');
    if (eqPal) eqPal.style.display = toolName === 'equipment' ? 'flex' : 'none';

    // Update hint
    var hint = document.getElementById('ddHint');
    if (hint) {
      var hints = {
        wall: _isEN ? 'Tap start → end to draw walls. Tap again to continue.' : 'Toca inicio → fin para dibujar paredes. Toca de nuevo para continuar.',
        door: _isEN ? 'Tap on a wall to place a door' : 'Toca en una pared para colocar puerta',
        window_: _isEN ? 'Tap on a wall to place a window' : 'Toca en una pared para colocar ventana',
        room: _isEN ? 'Tap to label a room' : 'Toca para etiquetar un cuarto',
        blower: _isEN ? 'Tap to place blower. FRONT=Supply, BACK=Return.' : 'Toca para colocar blower. FRENTE=Supply, ATRÁS=Return.',
        draw: _isEN ? 'Draw freely on the board' : 'Dibuja libremente en la pizarra',
        equipment: _isEN ? 'Tap to place. Hold to drag existing. Hold palette button to drag.' : 'Toca para colocar. Mantén presionado para mover. Mantén botón para arrastrar.',
        duct: _isEN ? 'Tap near blower FRONT for supply, BACK for return. Hold endpoint to resize.' : 'Toca cerca del FRENTE del blower para supply, ATRÁS para return. Mantén endpoint para redimensionar.',
        measure: _isEN ? 'Tap two points to measure distance' : 'Toca dos puntos para medir distancia',
        eraser: _isEN ? 'Draw over objects to erase' : 'Dibuja sobre objetos para borrar',
        pan: _isEN ? 'Drag to pan. Tap object to rotate. Hold to drag & drop.' : 'Arrastra para mover. Toca objeto para rotar. Mantén presionado para arrastrar.',
        fitting: _isEN ? 'Tap to place. Hold palette button to drag onto board.' : 'Toca para colocar. Mantén botón del palette para arrastrar a pizarra.'
      };
      hint.textContent = hints[toolName] || '';
      if (_totalEL > 0) {
        hint.textContent += ' | Total EL: ' + _totalEL + ' ft';
      }
    }

    _render();
  }

  function _setEquipType(type) {
    _equipType = type;
    _tool = 'equipment';
    _setTool('equipment');
    var eqBtns = document.querySelectorAll('.dd-eq-btn');
    for (var i = 0; i < eqBtns.length; i++) {
      var isActive = eqBtns[i].getAttribute('data-eq') === type;
      eqBtns[i].style.borderColor = isActive ? '#b45309' : 'rgba(0,0,0,0.12)';
      eqBtns[i].style.color = isActive ? '#92400e' : '#57574F';
    }
  }

  function _setFittingTypeFromPalette(id) {
    _fittingType = id;
    var fitBtns = document.querySelectorAll('.dd-fit-btn');
    for (var i = 0; i < fitBtns.length; i++) {
      var isActive = fitBtns[i].getAttribute('data-fit') === id;
      fitBtns[i].style.borderColor = isActive ? '#7c3aed' : 'rgba(0,0,0,0.12)';
      fitBtns[i].style.color = isActive ? '#6d28d9' : '#57574F';
    }
  }

  // ── Undo / Clear ───────────────────────────────────────────────
  function _undo() {
    if (_undoStack.length > 0) {
      _paths = _undoStack.pop();
      _recalcTotalEL();
      _render(); _saveState();
    }
  }

  function _clearAll() {
    var _ask = (window.MaestroDialog && window.MaestroDialog.confirm)
      ? window.MaestroDialog.confirm({
          title: _isEN ? 'Clear board' : 'Borrar pizarra',
          message: _isEN ? 'This will erase your entire design. This cannot be undone.' : 'Esto borrará todo tu diseño. No se puede deshacer.',
          okText: _isEN ? 'Clear' : 'Borrar',
          cancelText: _isEN ? 'Cancel' : 'Cancelar',
          destructive: true,
          kind: 'warning'
        })
      : Promise.resolve(confirm(_isEN ? 'Clear the entire board?' : '¿Borrar toda la pizarra?'));
    _ask.then(function(ok) {
      if (!ok) return;
      _doClearAll();
    });
  }
  function _doClearAll() {
    _undoStack = [];
    _paths = [];
    _totalEL = 0;
    _lastDuctCFM = 0;
    _ductStart = null;
    _ductStartSide = null;
    _wallStart = null;
    _measureStart = null;
    _livePos = null;
    _currentPath = null;
    _drawing = false;
    _isDragging = false;
    _dragIdx = -1;
    _dragEndpoint = null;
    _dragFromPalette = null;
    _render(); _saveState();
  }

  function _goBack() {
    // Restore floating dashboard elements before leaving
    var ids = ['dashProfileAvatar','dashMicBtn','dashXpBadge','clasesVivoFloatingBtn','streakBadge','dashRadioWidget','dashRadioCall','dashPodcastPill'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) el.style.display = '';
    }
    showScreen('dashboardScreen');
  }

  // ── Init ───────────────────────────────────────────────────────
  window.initDuctDesigner = function() {
    var screen = document.getElementById('ductDesignerScreen');
    if (!screen) return;

    _isEN = _lang() === 'en';

    // Hide floating dashboard elements that overlap the toolbar
    var _floatingIds = ['dashProfileAvatar','dashMicBtn','dashXpBadge','clasesVivoFloatingBtn','streakBadge','dashRadioWidget','dashRadioCall','dashPodcastPill'];
    for (var fi = 0; fi < _floatingIds.length; fi++) {
      var el = document.getElementById(_floatingIds[fi]);
      if (el) el.style.display = 'none';
    }

    var h = '';

    // Header bar
    h += '<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f5f0d0;border-bottom:2px solid #d4c98a;">';
    h += '<div onclick="window._ddGoBack()" style="width:32px;height:32px;border-radius:8px;background:#e8e0b8;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></div>';
    h += '<div style="flex:1;"><div style="color:#0F0F0F;font-size:15px;font-weight:800;display:flex;align-items:center;gap:6px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round"><path d="M2 22L22 2M14 2h8v8M8 22H2v-6"/></svg>' + (_isEN ? 'Duct Designer' : 'Pizarra de Ductos') + '</div></div>';
    h += '<button onclick="window._ddImport()" style="padding:6px 10px;border-radius:8px;border:1px solid #b45309;background:rgba(180,83,9,0.08);color:#92400e;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:3px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>' + (_isEN ? 'Import' : 'Importar') + '</button>';
    h += '<button onclick="window._ddUndo()" style="padding:6px 10px;border-radius:8px;border:1px solid #E7E5DE;background:rgba(0,0,0,0.04);color:#3D3D3A;font-size:11px;font-weight:700;cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 10h10a5 5 0 015 5v0a5 5 0 01-5 5H8M3 10l4-4M3 10l4 4"/></svg></button>';
    h += '<button onclick="window._ddClear()" style="padding:6px 10px;border-radius:8px;border:1px solid #dc2626;background:rgba(220,38,38,0.06);color:#dc2626;font-size:11px;font-weight:700;cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M5 6l1 14h12l1-14"/></svg></button>';
    h += '</div>';

    // Tool bar
    h += '<div style="display:flex;gap:4px;padding:8px 10px;background:#f0ead0;border-bottom:1px solid #d4c98a;overflow-x:auto;-webkit-overflow-scrolling:touch;">';
    var tools = [
      { id:'wall', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="22" height="18" rx="1"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="1" y1="17" x2="23" y2="17"/><line x1="8" y1="3" x2="8" y2="10"/><line x1="16" y1="3" x2="16" y2="10"/><line x1="12" y1="10" x2="12" y2="17"/><line x1="5" y1="17" x2="5" y2="21"/><line x1="19" y1="17" x2="19" y2="21"/></svg>', label:_isEN?'Wall':'Pared' },
      { id:'door', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 2h14a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M9 2v20"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>', label:_isEN?'Door':'Puerta' },
      { id:'window_', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>', label:_isEN?'Window':'Ventana' },
      { id:'room', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-7 9 7v12a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9 21v-8h6v8"/></svg>', label:_isEN?'Room':'Cuarto' },
      { id:'blower', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 10c-2-3-5-3-5-3"/><path d="M14 12c3-2 3-5 3-5"/><path d="M12 14c2 3 5 3 5 3"/><path d="M10 12c-3 2-3 5-3 5"/></svg>', label:'Blower' },
      { id:'duct', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16v8H4z"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="2" y1="7" x2="2" y2="17"/><line x1="22" y1="7" x2="22" y2="17"/></svg>', label:_isEN?'Duct':'Ducto' },
      { id:'fitting', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v8a8 8 0 008 8h8"/><path d="M4 8h4"/><path d="M16 20v-4"/></svg>', label:'Fitting' },
      { id:'equipment', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="7" cy="15" r="1.5" fill="currentColor"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/><path d="M17 13v4"/></svg>', label:_isEN?'Equip':'Equipo' },
      { id:'draw', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4L7 21H3v-4L17 3z"/><path d="M14 6l4 4"/></svg>', label:_isEN?'Draw':'Dibujar' },
      { id:'measure', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 4h20v16H2z"/><line x1="6" y1="4" x2="6" y2="8"/><line x1="10" y1="4" x2="10" y2="10"/><line x1="14" y1="4" x2="14" y2="8"/><line x1="18" y1="4" x2="18" y2="10"/></svg>', label:_isEN?'Measure':'Medir' },
      { id:'eraser', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16l10-10 8 8-4 6z"/><path d="M6 13l8 8"/></svg>', label:_isEN?'Erase':'Borrar' },
      { id:'pan', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 00-4 0"/><path d="M14 10V4a2 2 0 00-4 0v7"/><path d="M10 10.5V8a2 2 0 00-4 0v6"/><path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2a8 8 0 01-6-2.7L3.7 16A2 2 0 016 13l2 2"/></svg>', label:_isEN?'Pan':'Mover' }
    ];
    for (var t = 0; t < tools.length; t++) {
      var isDefault = tools[t].id === 'wall';
      h += '<button class="dd-tool-btn" data-tool="' + tools[t].id + '" onclick="window._ddSetTool(\'' + tools[t].id + '\')" style="flex-shrink:0;padding:6px 10px;border-radius:8px;border:1.5px solid ' + (isDefault ? '#1e40af' : 'rgba(0,0,0,0.15)') + ';background:' + (isDefault ? 'rgba(30,64,175,0.1)' : '#fff') + ';color:' + (isDefault ? '#1e40af' : '#3D3D3A') + ';font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">' + tools[t].icon + ' ' + tools[t].label + '</button>';
    }
    // Reference button
    h += '<button onclick="window._ddShowRef()" style="flex-shrink:0;padding:6px 10px;border-radius:8px;border:1.5px solid #15803d;background:rgba(22,128,61,0.08);color:#15803d;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 3L3 21"/><path d="M21 3h-6"/><path d="M21 3v6"/><path d="M3 21h6"/><path d="M3 21v-6"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg> ' + (_isEN ? 'Reference' : 'Referencia') + '</button>';
    h += '</div>';

    // Equipment palette
    h += '<div id="ddEquipPalette" style="display:none;gap:4px;padding:6px 10px;background:#f5f0d0;border-bottom:1px solid #d4c98a;overflow-x:auto;-webkit-overflow-scrolling:touch;">';
    var eqKeys = ['ah','cu','furnace','sr','rg','trunk','branch','ms'];
    for (var ek = 0; ek < eqKeys.length; ek++) {
      var eq = EQUIP_TYPES[eqKeys[ek]];
      h += '<button class="dd-eq-btn" data-eq="' + eqKeys[ek] + '" onclick="window._ddSetEquip(\'' + eqKeys[ek] + '\')" style="flex-shrink:0;padding:5px 8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12);background:#fff;color:#111111;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;"><span style="color:' + eq.color + ';">' + eq.label + '</span> ' + (_isEN ? eq.en : eq.es) + '</button>';
    }
    h += '</div>';

    // Fitting palette
    h += '<div id="ddFitPalette" style="display:none;gap:4px;padding:6px 10px;background:#f5f0d0;border-bottom:1px solid #d4c98a;overflow-x:auto;-webkit-overflow-scrolling:touch;align-items:center;">';
    // Size selector
    h += '<select onchange="window._ddFitPalSize(this.value)" style="padding:4px 6px;border-radius:6px;border:1px solid rgba(167,139,250,0.3);background:rgba(167,139,250,0.1);color:#c4b5fd;font-size:10px;font-weight:700;font-family:inherit;flex-shrink:0;">';
    var palSizes = [4,5,6,7,8,9,10,12,14,16,18,20,24,30,36];
    for (var ps = 0; ps < palSizes.length; ps++) {
      h += '<option value="' + palSizes[ps] + '"' + (palSizes[ps] === 8 ? ' selected' : '') + '>' + palSizes[ps] + '"</option>';
    }
    h += '</select>';
    for (var fi = 0; fi < FITTING_TYPES.length; fi++) {
      var ft = FITTING_TYPES[fi];
      h += '<button class="dd-fit-btn" data-fit="' + ft.id + '" onclick="window._ddSetFitPal(\'' + ft.id + '\')" style="flex-shrink:0;padding:4px 8px;border-radius:6px;border:1px solid ' + (fi === 0 ? '#7c3aed' : 'rgba(0,0,0,0.12)') + ';background:#fff;color:' + (fi === 0 ? '#6d28d9' : '#57574F') + ';font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">' + ft.icon + ' ' + (_isEN ? ft.en : ft.es).substring(0, 12) + '</button>';
    }
    h += '</div>';

    // Canvas
    h += '<div id="ddCanvasContainer" style="flex:1;position:relative;overflow:hidden;touch-action:none;">';
    h += '<canvas id="ddCanvas" style="display:block;touch-action:none;"></canvas>';
    h += '</div>';

    // Hint bar with EL total
    h += '<div style="padding:6px 14px;background:#e8e0b8;border-top:1px solid #d4c98a;text-align:center;">';
    h += '<span id="ddHint" style="font-size:13px;color:#111111;font-weight:600;">' + (_isEN ? '1. Draw walls → 2. Place blower → 3. Extend supply/return ducts' : '1. Dibuja paredes → 2. Coloca blower → 3. Extiende ductos supply/return') + '</span>';
    h += '</div>';

    screen.style.display = 'flex';
    screen.style.flexDirection = 'column';
    screen.style.height = '100vh';
    screen.style.background = COLORS.bg;
    screen.innerHTML = h;

    // Init canvas
    _canvas = document.getElementById('ddCanvas');
    _ctx = _canvas.getContext('2d');

    _loadState();
    _resizeCanvas();
    window.addEventListener('resize', _resizeCanvas);

    // Events
    _canvas.addEventListener('mousedown', _onPointerDown);
    _canvas.addEventListener('mousemove', _onPointerMove);
    _canvas.addEventListener('mouseup', _onPointerUp);
    _canvas.addEventListener('mouseleave', _onPointerUp);
    _canvas.addEventListener('touchstart', _onPointerDown, { passive: false });
    _canvas.addEventListener('touchmove', _onPointerMove, { passive: false });
    _canvas.addEventListener('touchend', _onPointerUp);
    _canvas.addEventListener('touchcancel', _onPointerUp);

    _canvas.addEventListener('wheel', function(e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      _scale = Math.max(0.3, Math.min(3, _scale * delta));
      _render();
    }, { passive: false });

    // Also listen for pointer events on document for palette drags that leave the canvas
    document.addEventListener('mousemove', function(e) {
      if (_dragFromPalette) _onPointerMove(e);
    });
    document.addEventListener('mouseup', function(e) {
      if (_dragFromPalette || _isDragging) _onPointerUp(e);
    });
    document.addEventListener('touchmove', function(e) {
      if (_dragFromPalette) { e.preventDefault(); _onPointerMove(e); }
    }, { passive: false });
    document.addEventListener('touchend', function(e) {
      if (_dragFromPalette) _onPointerUp(e);
    });

    // Setup palette drag listeners
    _setupPaletteDrag();
  };

  // ── Palette Drag Setup ─────────────────────────────────────────
  function _setupPaletteDrag() {
    // Make fitting palette buttons draggable
    var fitBtns = document.querySelectorAll('.dd-fit-btn');
    for (var i = 0; i < fitBtns.length; i++) {
      _attachPaletteDrag(fitBtns[i], 'fitting');
    }
    // Make equipment palette buttons draggable
    var eqBtns = document.querySelectorAll('.dd-eq-btn');
    for (var j = 0; j < eqBtns.length; j++) {
      _attachPaletteDrag(eqBtns[j], 'equip');
    }
  }

  function _attachPaletteDrag(btn, type) {
    var startX, startY, holdTimer, moved;

    function onStart(e) {
      var touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      moved = false;

      holdTimer = setTimeout(function() {
        // Start palette drag
        var data = {};
        if (type === 'fitting') {
          var fitId = btn.getAttribute('data-fit');
          data = { id: fitId };
        } else {
          var eqKind = btn.getAttribute('data-eq');
          data = { kind: eqKind };
        }
        _dragFromPalette = { type: type, data: data };
        _dragPalettePos = { clientX: startX, clientY: startY };

        // Create ghost element
        var ghost = document.createElement('div');
        ghost.id = 'ddDragGhost';
        ghost.style.cssText = 'position:fixed;z-index:100000;pointer-events:none;padding:8px 12px;border-radius:10px;background:rgba(59,130,246,0.9);color:#fff;font-size:11px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.3);white-space:nowrap;transform:scale(1.1);';
        ghost.innerHTML = type === 'fitting' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M4 4v8a8 8 0 008 8h8"/></svg> Fitting' : btn.textContent.trim().substring(0, 15);
        ghost.style.left = (startX - 20) + 'px';
        ghost.style.top = (startY - 20) + 'px';
        document.body.appendChild(ghost);

        // Vibrate feedback if supported
        if (navigator.vibrate) navigator.vibrate(30);
        moved = true;
      }, 300);
    }

    function onMove(e) {
      if (!holdTimer && !_dragFromPalette) return;
      var touch = e.touches ? e.touches[0] : e;
      var dist = Math.sqrt(Math.pow(touch.clientX - startX, 2) + Math.pow(touch.clientY - startY, 2));
      if (dist > 8 && holdTimer) {
        clearTimeout(holdTimer); holdTimer = null;
      }
    }

    function onEnd() {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    }

    btn.addEventListener('touchstart', onStart, { passive: true });
    btn.addEventListener('touchmove', onMove, { passive: true });
    btn.addEventListener('touchend', onEnd);
    btn.addEventListener('mousedown', onStart);
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseup', onEnd);
  }

  // ── Global Refs ────────────────────────────────────────────────
  window._ddSetTool = function(t) { if (t === 'wall' && _wallStart && _tool === 'wall') { _wallStart = null; _livePos = null; _render(); return; } _setTool(t); };
  window._ddSetEquip = _setEquipType;
  window._ddSetFitPal = _setFittingTypeFromPalette;
  window._ddFitPalSize = function(v) { _fittingSize = parseInt(v) || 8; };
  window._ddUndo = _undo;
  window._ddClear = _clearAll;
  window._ddGoBack = _goBack;
  window._ddShowRef = _showReferencePanel;
  window._ddImport = _showImportEquip;

})();
