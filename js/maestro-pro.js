// ============================================
// MAESTRO PRO v1.0 — Herramientas Complementarias
// 51 tools: Matemáticas · Eléctrico · HVAC · Refrig · NEC · Seguridad
// Complementario a HVAC Tools — NO duplica
// Bilingual (ES/EN), offline, Nivel 33 · ACVOLT Tech School
// ============================================

(function() {
  'use strict';

  // ── Tool Registry (51 tools) ──────────────────────────────────
  // impl:true = working calculator in Phase 1A. impl:false = coming soon.
  var TOOLS = [
    // Matemáticas y Construcción (20)
    { id:'fractions',      cat:'math', icon:'¾',   name:{es:'Fracciones',en:'Fractions'},             desc:{es:'Decimal ↔ fracción 1/16"',en:'Decimal ↔ fraction 1/16"'},         impl:true },
    { id:'fracCalc',       cat:'math', icon:'±',   name:{es:'Suma de Fracciones',en:'Fraction Math'}, desc:{es:'Suma, resta, ×',en:'Add, sub, multiply'},                        impl:true  },
    { id:'tapeMeasure',    cat:'math', icon:'📏',  name:{es:'Cinta de Medir',en:'Tape Measure'},      desc:{es:'Leer 1/16", cuartos',en:'Read 1/16", quarters'},                 impl:true  },
    { id:'plumbBob',       cat:'math', icon:'🎯',  name:{es:'Plomada',en:'Plumb Bob'},                desc:{es:'Verticalidad',en:'Verticality'},                                 impl:false },
    { id:'levels',         cat:'math', icon:'⚖️', name:{es:'Niveles',en:'Levels'},                   desc:{es:'Torpedo, 2\', 4\', láser',en:'Torpedo, 2\', 4\', laser'},        impl:false },
    { id:'pythagorean',    cat:'math', icon:'△',   name:{es:'Pitágoras 3-4-5',en:'Pythagorean 3-4-5'},desc:{es:'Cuadrar esquinas',en:'Square corners'},                          impl:true },
    { id:'unitConverter',  cat:'math', icon:'🔢',  name:{es:'Conversor Universal',en:'Unit Converter'},desc:{es:'30+ unidades',en:'30+ units'},                                   impl:true  },
    { id:'areas',          cat:'math', icon:'◱',   name:{es:'Áreas',en:'Areas'},                      desc:{es:'Rect, círculo, triángulo',en:'Rect, circle, triangle'},          impl:true  },
    { id:'volumes',        cat:'math', icon:'🧊',  name:{es:'Volúmenes',en:'Volumes'},                desc:{es:'Cubo, cilindro, cono',en:'Cube, cylinder, cone'},                impl:true  },
    { id:'planScales',     cat:'math', icon:'📐',  name:{es:'Escalas de Planos',en:'Plan Scales'},    desc:{es:'1/4"=1\', 1/8"=1\'',en:'1/4"=1\', 1/8"=1\''},                    impl:false },
    { id:'percentages',    cat:'math', icon:'%',   name:{es:'Porcentajes',en:'Percentages'},          desc:{es:'Descuentos, markup',en:'Discounts, markup'},                     impl:false },
    { id:'wasteFactor',    cat:'math', icon:'♻️', name:{es:'Waste Factor',en:'Waste Factor'},        desc:{es:'Material con desperdicio',en:'Material with waste'},             impl:true  },
    { id:'rightTri',       cat:'math', icon:'◿',   name:{es:'Triángulo Rectángulo',en:'Right Triangle'},desc:{es:'Resolver con trig',en:'Solve with trig'},                        impl:true  },
    { id:'riseRun',         cat:'math', icon:'↗',   name:{es:'Rise / Run / Pitch',en:'Rise / Run / Pitch'},desc:{es:'Pendiente de techo',en:'Roof pitch / slope'},                 impl:true  },
    { id:'offsetCalc',     cat:'math', icon:'⤴',   name:{es:'Offset para Dobleces',en:'Offset Bends'},desc:{es:'Cortes para tubo/conduit',en:'Cuts for pipe/conduit'},            impl:false },
    { id:'pipeBend',       cat:'math', icon:'↩',   name:{es:'Dobleces de Tubo',en:'Pipe Bend'},       desc:{es:'Multiplier + shrink',en:'Multiplier + shrink'},                  impl:false },
    { id:'linearQty',      cat:'math', icon:'≡',   name:{es:'Estimador de Cantidad',en:'Quantity Estimator'},desc:{es:'LF, SF, CF material',en:'LF, SF, CF material'},              impl:false },
    { id:'angleConv',      cat:'math', icon:'∠',   name:{es:'Ángulos',en:'Angle Tools'},              desc:{es:'Grados, rad, brújula',en:'Deg, rad, compass'},                   impl:true  },
    { id:'circleCalc',     cat:'math', icon:'○',   name:{es:'Círculo',en:'Circle'},                  desc:{es:'Circunf, arco, sector',en:'Circumf, arc, sector'},               impl:true  },
    { id:'trigSolver',     cat:'math', icon:'sin', name:{es:'Sen / Cos / Tan',en:'Sin / Cos / Tan'}, desc:{es:'Solver trigonométrico',en:'Trig solver'},                        impl:true  },
    // Math · appended new ids from math2.js
    { id:'rafterLen',          cat:'math', icon:'⟋',   name:{es:'Rafter Común/Hip',en:'Common / Hip Rafter'}, desc:{es:'Ancho + pitch → largo',en:'Width + pitch → length'},                  impl:true },
    { id:'stairsCalc',         cat:'math', icon:'📶',  name:{es:'Escaleras (IRC)',en:'Stairs (IRC)'},          desc:{es:'Rise/run · R311.7',en:'Rise/run · R311.7'},                         impl:true },
    { id:'ladderAngle',        cat:'math', icon:'🪜',  name:{es:'Escalera · 4:1',en:'Ladder · 4:1'},          desc:{es:'OSHA 1926.1053',en:'OSHA 1926.1053'},                               impl:true },
    { id:'pipeVelocity',       cat:'math', icon:'🌊',  name:{es:'Velocidad en Tubería',en:'Pipe Velocity'},    desc:{es:'GPM + Ø → ft/s',en:'GPM + Ø → ft/s'},                                impl:true },
    { id:'ductEquivalent',     cat:'math', icon:'◯▭',  name:{es:'Ducto Equivalente',en:'Equivalent Round Duct'}, desc:{es:'Rect → round (ASHRAE 35B)',en:'Rect → round (ASHRAE 35B)'},      impl:true },
    { id:'ductVelocityPressure',cat:'math', icon:'↕💨', name:{es:'VP ↔ FPM',en:'VP ↔ FPM'},                     desc:{es:'V = 4005·√VP',en:'V = 4005·√VP'},                                    impl:true },
    { id:'cfmPerSqft',         cat:'math', icon:'🏢',  name:{es:'CFM / ft² (ASHRAE 62.1)',en:'CFM / ft² (ASHRAE 62.1)'}, desc:{es:'Ra + Rp OA rates',en:'Ra + Rp OA rates'},                 impl:true },
    { id:'sqftPerTon',         cat:'math', icon:'📐❄', name:{es:'ft² / Ton',en:'sq ft / Ton'},                 desc:{es:'Pre-check Manual J',en:'Manual J pre-check'},                       impl:true },

    // Eléctrico Avanzado (21)
    { id:'motorFLC3ph',    cat:'elec', icon:'⚙',   name:{es:'Motor FLC 3φ',en:'Motor FLC 3φ'},        desc:{es:'NEC Table 430.250',en:'NEC Table 430.250'},                      impl:false },
    { id:'motorFLC1ph',    cat:'elec', icon:'⚙',   name:{es:'Motor FLC 1φ',en:'Motor FLC 1φ'},        desc:{es:'NEC Table 430.248',en:'NEC Table 430.248'},                      impl:false },
    { id:'lockedRotor',    cat:'elec', icon:'🔒',  name:{es:'Locked-Rotor',en:'Locked-Rotor'},        desc:{es:'NEC 430.251',en:'NEC 430.251'},                                  impl:false },
    { id:'transformerKVA', cat:'elec', icon:'↗',   name:{es:'Transformer kVA',en:'Transformer kVA'},  desc:{es:'Primario, secundario',en:'Primary, secondary'},                  impl:false },
    { id:'boxFill',        cat:'elec', icon:'📦',  name:{es:'Box Fill',en:'Box Fill'},                desc:{es:'NEC 314.16',en:'NEC 314.16'},                                    impl:false },
    { id:'powerFactor',    cat:'elec', icon:'cos', name:{es:'Factor de Potencia',en:'Power Factor'},  desc:{es:'PF + kVAR correction',en:'PF + kVAR correction'},                impl:false },
    { id:'serviceComm',    cat:'elec', icon:'🏢',  name:{es:'Service Comercial',en:'Service Load Comm.'},desc:{es:'NEC 220 comercial',en:'NEC 220 commercial'},                   impl:false },
    { id:'groundingAWG',   cat:'elec', icon:'⏚',   name:{es:'Grounding AWG',en:'Grounding AWG'},      desc:{es:'NEC 250.122',en:'NEC 250.122'},                                  impl:false },
    { id:'bondingJumper',  cat:'elec', icon:'🔗',  name:{es:'Bonding Jumper',en:'Bonding Jumper'},    desc:{es:'NEC 250.102',en:'NEC 250.102'},                                  impl:false },
    { id:'seriesParallel', cat:'elec', icon:'—◯—', name:{es:'Serie / Paralelo',en:'Series / Parallel'},desc:{es:'R, V, I calc',en:'R, V, I calc'},                                impl:false },
    { id:'powerTriangle',  cat:'elec', icon:'△',   name:{es:'Power Triangle',en:'Power Triangle'},    desc:{es:'kW, kVAR, kVA, PF',en:'kW, kVAR, kVA, PF'},                      impl:false },
    { id:'voltageDrop',    cat:'elec', icon:'▽V',  name:{es:'Caída de Voltaje',en:'Voltage Drop'},    desc:{es:'NEC Chap.9 Tabla 8',en:'NEC Chap.9 Table 8'},                    impl:false },
    { id:'conduitFill',    cat:'elec', icon:'▓',   name:{es:'Llenado de Conduit',en:'Conduit Fill'}, desc:{es:'EMT/PVC/RMC 40%',en:'EMT/PVC/RMC 40%'},                          impl:false },
    { id:'wireAmpacity',   cat:'elec', icon:'∿',   name:{es:'Ampacidad Conductor',en:'Wire Ampacity'},desc:{es:'NEC 310.16',en:'NEC 310.16'},                                    impl:false },
    { id:'motorBreaker',   cat:'elec', icon:'🛡',   name:{es:'Breaker para Motor',en:'Motor Breaker'},desc:{es:'NEC 430.52 sizing',en:'NEC 430.52 sizing'},                      impl:false },
    { id:'ohmsLaw',        cat:'elec', icon:'Ω',   name:{es:'Ley de Ohm',en:'Ohm\'s Law'},           desc:{es:'V / I / R solver',en:'V / I / R solver'},                        impl:false },
    { id:'wattsLaw',       cat:'elec', icon:'W',   name:{es:'Ley de Watt',en:'Watt\'s Law'},         desc:{es:'P / V / I solver',en:'P / V / I solver'},                        impl:false },
    { id:'runCap',         cat:'elec', icon:'μF',  name:{es:'Capacitor Run',en:'Run Capacitor'},     desc:{es:'MFD + tolerancia',en:'MFD + tolerance'},                          impl:false },
    { id:'startCap',       cat:'elec', icon:'⚡+',  name:{es:'Capacitor Start',en:'Start Capacitor'}, desc:{es:'Selección por HP',en:'Sizing by HP'},                            impl:false },
    { id:'kwHpConv',       cat:'elec', icon:'⇄kW',name:{es:'kW ↔ HP ↔ BHP',en:'kW ↔ HP ↔ BHP'},    desc:{es:'Con eficiencia',en:'With efficiency'},                           impl:false },
    { id:'genSize',        cat:'elec', icon:'🔌',  name:{es:'Generador Sizing',en:'Generator Sizing'},desc:{es:'Residencial/comercial',en:'Residential/commercial'},             impl:false },

    // HVAC Complementario (19)
    { id:'manualJSimple',  cat:'hvac', icon:'🏠',  name:{es:'Manual J Simple',en:'Manual J Simple'},  desc:{es:'Carga térmica sin IA',en:'Thermal load (no AI)'},                impl:false },
    { id:'seerEerCop',     cat:'hvac', icon:'📊',  name:{es:'SEER/EER/COP',en:'SEER/EER/COP'},        desc:{es:'Converter eficiencia',en:'Efficiency converter'},                impl:false },
    { id:'seer2hspf2',     cat:'hvac', icon:'23',  name:{es:'SEER2 / HSPF2',en:'SEER2 / HSPF2'},      desc:{es:'Nuevos estándares',en:'New standards'},                          impl:false },
    { id:'deltaT',         cat:'hvac', icon:'ΔT',  name:{es:'Delta T',en:'Delta T'},                  desc:{es:'Supply vs return',en:'Supply vs return'},                        impl:true },
    { id:'shr',            cat:'hvac', icon:'SHR', name:{es:'Sensible Heat Ratio',en:'Sensible Heat Ratio'},desc:{es:'Sensible/total',en:'Sensible/total'},                        impl:false },
    { id:'cfmPerTon',      cat:'hvac', icon:'💨',  name:{es:'CFM per Ton',en:'CFM per Ton'},          desc:{es:'350-400 estándar',en:'350-400 standard'},                        impl:true  },
    { id:'balancePoint',   cat:'hvac', icon:'🔥',  name:{es:'Balance Point',en:'Balance Point'},      desc:{es:'Heat pump vs aux',en:'Heat pump vs aux'},                        impl:false },
    { id:'defrostCycle',   cat:'hvac', icon:'❄',   name:{es:'Defrost Cycle',en:'Defrost Cycle'},      desc:{es:'Tiempo óptimo',en:'Optimal timing'},                             impl:false },
    { id:'humidifierSize', cat:'hvac', icon:'💧',  name:{es:'Humidifier Size',en:'Humidifier Size'},  desc:{es:'Capacidad por espacio',en:'Capacity per space'},                 impl:false },
    { id:'staticPressure', cat:'hvac', icon:'↕',   name:{es:'Static Pressure',en:'Static Pressure'}, desc:{es:'ESP / TESP',en:'ESP / TESP'},                                    impl:false },
    { id:'ductSize',       cat:'hvac', icon:'▭',   name:{es:'Duct Sizing',en:'Duct Sizing'},         desc:{es:'Equal friction',en:'Equal friction'},                            impl:false },
    { id:'ductVelocity',   cat:'hvac', icon:'🌀',  name:{es:'Velocidad de Ducto',en:'Duct Velocity'},desc:{es:'FPM por sección',en:'FPM per section'},                          impl:false },
    { id:'fanLaws',        cat:'hvac', icon:'💨¹²³',name:{es:'Fan Laws',en:'Fan Laws'},              desc:{es:'CFM, SP, HP vs RPM',en:'CFM, SP, HP vs RPM'},                     impl:false },
    { id:'psychro',        cat:'hvac', icon:'🌡💧',name:{es:'Psicrometría',en:'Psychrometrics'},    desc:{es:'DB/WB → RH/h/dew',en:'DB/WB → RH/h/dew'},                        impl:false },
    { id:'mixedAir',       cat:'hvac', icon:'⇌',   name:{es:'Mixed Air Temp',en:'Mixed Air Temp'},   desc:{es:'Return + OA blend',en:'Return + OA blend'},                      impl:false },
    { id:'airChanges',     cat:'hvac', icon:'♺',   name:{es:'ACH / Room CFM',en:'ACH / Room CFM'},   desc:{es:'Cambios por hora',en:'Air changes/hour'},                        impl:false },
    { id:'condensate',     cat:'hvac', icon:'💧↓', name:{es:'Condensado',en:'Condensate Rate'},      desc:{es:'Gal/hr + slope',en:'Gal/hr + slope'},                            impl:false },
    { id:'tonBtu',         cat:'hvac', icon:'⇄',   name:{es:'Ton ↔ BTU ↔ kW',en:'Ton ↔ BTU ↔ kW'}, desc:{es:'Converter capacidad',en:'Capacity converter'},                 impl:false },
    { id:'heatStrip',      cat:'hvac', icon:'🔥⚡',name:{es:'Heat Strip Sizing',en:'Heat Strip Sizing'},desc:{es:'kW + breaker',en:'kW + breaker'},                              impl:false },

    // Refrigeración Diagnóstica (16)
    { id:'evacuation',     cat:'refrig', icon:'🧪', name:{es:'Evacuación',en:'Evacuation'},           desc:{es:'Micrones + tiempo',en:'Microns + time'},                         impl:false },
    { id:'a2lLimits',      cat:'refrig', icon:'⚠',  name:{es:'A2L Charge Limits',en:'A2L Charge Limits'},desc:{es:'NFPA/IEC por m³',en:'NFPA/IEC per m³'},                          impl:false },
    { id:'leakRateEPA',    cat:'refrig', icon:'💨', name:{es:'Leak Rate EPA',en:'Leak Rate EPA'},     desc:{es:'Rate anual permitido',en:'Annual allowed rate'},                 impl:false },
    { id:'opPressures',    cat:'refrig', icon:'📈', name:{es:'Operating Pressures',en:'Operating Pressures'},desc:{es:'Típicas por refrigerante',en:'Typical per refrigerant'},       impl:false },
    { id:'diagByPress',    cat:'refrig', icon:'🔍', name:{es:'Diagnosis by Press',en:'Diagnosis by Press'},desc:{es:'High/Low → problema',en:'High/Low → fault'},                    impl:false },
    { id:'txvVsCap',       cat:'refrig', icon:'⇄',  name:{es:'TXV vs Cap Tube',en:'TXV vs Cap Tube'}, desc:{es:'Comparación metering',en:'Metering comparison'},                 impl:false },
    { id:'superheat',      cat:'refrig', icon:'↑°', name:{es:'Superheat Medido',en:'Measured Superheat'},desc:{es:'Actual vs objetivo',en:'Actual vs target'},                     impl:false },
    { id:'subcooling',     cat:'refrig', icon:'↓°', name:{es:'Subcooling',en:'Subcooling'},          desc:{es:'Líquido cond',en:'Liquid line'},                                 impl:false },
    { id:'targetSH',       cat:'refrig', icon:'🎯', name:{es:'Target Superheat',en:'Target Superheat'},desc:{es:'Por WB/DB TXV',en:'Per WB/DB TXV'},                             impl:false },
    { id:'ptChart',        cat:'refrig', icon:'📋', name:{es:'PT Chart',en:'PT Chart'},              desc:{es:'12 refrigerantes',en:'12 refrigerants'},                         impl:false },
    { id:'lineSize',       cat:'refrig', icon:'▬',  name:{es:'Line Sizing',en:'Line Sizing'},        desc:{es:'Suct/Liq/Disch',en:'Suct/Liq/Disch'},                            impl:false },
    { id:'chargeByWeight', cat:'refrig', icon:'⚖',  name:{es:'Charge by Weight',en:'Charge by Weight'},desc:{es:'Por longitud de línea',en:'By line length'},                    impl:false },
    { id:'compRatio',      cat:'refrig', icon:'÷',  name:{es:'Compression Ratio',en:'Compression Ratio'},desc:{es:'PabsD / PabsS',en:'PabsD / PabsS'},                           impl:false },
    { id:'massFlow',       cat:'refrig', icon:'ṁ',  name:{es:'Mass Flow',en:'Mass Flow'},            desc:{es:'lb/hr + kg/s',en:'lb/hr + kg/s'},                                impl:false },
    { id:'copEer',         cat:'refrig', icon:'Ec', name:{es:'COP ↔ EER',en:'COP ↔ EER'},           desc:{es:'Eficiencia convert',en:'Efficiency convert'},                    impl:false },
    { id:'oilTrap',        cat:'refrig', icon:'⎯',  name:{es:'Oil Trap / P-Trap',en:'Oil Trap / P-Trap'},desc:{es:'Rise + doble trap',en:'Rise + double trap'},                   impl:false },

    // NEC / Normativa (11)
    { id:'necFinder',      cat:'nec', icon:'🔍',  name:{es:'NEC Article Finder',en:'NEC Article Finder'},desc:{es:'Situación → artículo',en:'Situation → article'},                impl:false },
    { id:'nec23to26',      cat:'nec', icon:'📅',  name:{es:'NEC 2023 → 2026',en:'NEC 2023 → 2026'},  desc:{es:'Cambios del código',en:'Code changes'},                          impl:false },
    { id:'epa608Selector', cat:'nec', icon:'📋',  name:{es:'EPA 608 Selector',en:'EPA 608 Selector'},desc:{es:'Qué tipo por equipo',en:'Which type per unit'},                 impl:false },
    { id:'ventA2L',        cat:'nec', icon:'🌬️',name:{es:'Ventilación A2L',en:'A2L Ventilation'},  desc:{es:'Requisitos por volumen',en:'Requirements per volume'},           impl:false },
    { id:'workingClr',     cat:'nec', icon:'📏',  name:{es:'Working Clearances',en:'Working Clearances'},desc:{es:'NEC 110.26',en:'NEC 110.26'},                                    impl:false },
    { id:'condDerate',     cat:'nec', icon:'↘',   name:{es:'Conductor Derating',en:'Conductor Derating'},desc:{es:'Temp + fill 310.15',en:'Temp + fill 310.15'},                 impl:false },
    { id:'gfciAfci',       cat:'nec', icon:'⚡!', name:{es:'GFCI / AFCI',en:'GFCI / AFCI'},         desc:{es:'NEC 210.8 / 210.12',en:'NEC 210.8 / 210.12'},                   impl:false },
    { id:'groundElec',     cat:'nec', icon:'⏚⏚', name:{es:'Grounding Electrode',en:'Grounding Electrode'},desc:{es:'NEC 250.50–250.68',en:'NEC 250.50–250.68'},                impl:false },
    { id:'serviceRes',     cat:'nec', icon:'🏠',  name:{es:'Service Residencial',en:'Residential Service'},desc:{es:'NEC 220.82 / .83',en:'NEC 220.82 / .83'},                   impl:false },
    { id:'evCharger',      cat:'nec', icon:'🚗⚡',name:{es:'EV Charger Load',en:'EV Charger Load'}, desc:{es:'NEC 625',en:'NEC 625'},                                          impl:false },
    { id:'demandFactor',   cat:'nec', icon:'%',   name:{es:'Demand Factors',en:'Demand Factors'},   desc:{es:'Por ocupación',en:'Per occupancy'},                              impl:false },

    // Seguridad (14)
    { id:'arcFlash',       cat:'safe', icon:'⚡',  name:{es:'Arc Flash Boundary',en:'Arc Flash Boundary'},desc:{es:'NFPA 70E simplified',en:'NFPA 70E simplified'},                impl:false },
    { id:'loto',           cat:'safe', icon:'🔒', name:{es:'LOTO Checklist',en:'LOTO Checklist'},    desc:{es:'Lockout/Tagout',en:'Lockout/Tagout'},                            impl:false },
    { id:'ppePorTarea',    cat:'safe', icon:'🦺', name:{es:'EPP por Tarea',en:'PPE per Task'},       desc:{es:'Protección según trabajo',en:'Protection per task'},             impl:false },
    { id:'firstAidElec',   cat:'safe', icon:'➕', name:{es:'First Aid Eléctrico',en:'Electric First Aid'},desc:{es:'Primeros auxilios shock',en:'Shock first aid'},                 impl:false },
    { id:'firstAidRefrig', cat:'safe', icon:'➕', name:{es:'First Aid Refrig',en:'Refrig First Aid'},desc:{es:'Exposición refrigerante',en:'Refrigerant exposure'},             impl:false },
    { id:'firstAidBurns',  cat:'safe', icon:'🔥', name:{es:'First Aid Quemaduras',en:'Burn First Aid'},desc:{es:'Térmicas y químicas',en:'Thermal & chemical'},                    impl:false },
    { id:'confinedSpace',  cat:'safe', icon:'📦', name:{es:'Confined Space',en:'Confined Space'},    desc:{es:'Checklist espacio confinado',en:'Confined space checklist'},     impl:false },
    { id:'ladderSafety',   cat:'safe', icon:'🪜', name:{es:'Ladder Safety',en:'Ladder Safety'},      desc:{es:'Checklist de escalera',en:'Ladder checklist'},                   impl:false },
    { id:'jsaBuilder',     cat:'safe', icon:'📝',  name:{es:'Job Safety Analysis',en:'Job Safety Analysis'},desc:{es:'JSA por tarea',en:'JSA per task'},                          impl:false },
    { id:'fallProt',       cat:'safe', icon:'🪂',  name:{es:'Fall Protection',en:'Fall Protection'}, desc:{es:'Swing + clearance',en:'Swing + clearance'},                       impl:false },
    { id:'hotWork',        cat:'safe', icon:'🔥⚠',name:{es:'Hot Work Permit',en:'Hot Work Permit'}, desc:{es:'Soldadura/brazing',en:'Welding/brazing'},                         impl:false },
    { id:'sdsLookup',      cat:'safe', icon:'📄',  name:{es:'SDS HVAC',en:'SDS HVAC'},              desc:{es:'Químicos comunes',en:'Common chemicals'},                         impl:false },
    { id:'heatStress',     cat:'safe', icon:'🌡🥵',name:{es:'Heat Stress WBGT',en:'Heat Stress WBGT'},desc:{es:'Límite OSHA',en:'OSHA limits'},                                   impl:false },
    { id:'coldStress',     cat:'safe', icon:'🥶',  name:{es:'Cold Stress',en:'Cold Stress'},         desc:{es:'Wind chill',en:'Wind chill'},                                     impl:false },

    // Energy Code (Title 24, ASHRAE, IECC)
    { id:'ashrae621',    cat:'energy', icon:'💨',  name:{es:'ASHRAE 62.1 OA',en:'ASHRAE 62.1 OA'}, desc:{es:'CFM por persona + por ft²',en:'CFM per person + per ft²'}, impl:true },
    { id:'ashrae622',    cat:'energy', icon:'🏠',  name:{es:'ASHRAE 62.2 Residencial',en:'ASHRAE 62.2 Residential'}, desc:{es:'MVHR whole-house CFM',en:'MVHR whole-house CFM'}, impl:true },
    { id:'ashrae901Eff', cat:'energy', icon:'⚡',  name:{es:'ASHRAE 90.1 Eficiencia',en:'ASHRAE 90.1 Min Efficiency'}, desc:{es:'AFUE/SEER/IEER/COP mínimos',en:'AFUE/SEER/IEER/COP minimums'}, impl:true },
    { id:'title24Hvac',  cat:'energy', icon:'☀️',  name:{es:'Title 24 Part 6',en:'Title 24 Part 6'}, desc:{es:'CA HVAC prescriptivo',en:'CA HVAC prescriptive'}, impl:true },
    { id:'ductLeakage',  cat:'energy', icon:'🔍',  name:{es:'Duct Leakage HERS',en:'HERS Duct Leakage'}, desc:{es:'6% total, 4% a exterior',en:'6% total, 4% to outdoors'}, impl:true },
    { id:'refCharge',    cat:'energy', icon:'🧪',  name:{es:'Refrigerant Charge HERS',en:'HERS Refrigerant Charge'}, desc:{es:'Superheat / subcool verification',en:'Superheat / subcool verification'}, impl:true },
    { id:'iecc402',      cat:'energy', icon:'🏘',   name:{es:'IECC 402 Envelope',en:'IECC 402 Envelope'}, desc:{es:'U-factor por zona climática',en:'U-factor by climate zone'}, impl:true },
    { id:'economizer',   cat:'energy', icon:'❄️',  name:{es:'Economizer Required',en:'Economizer Required?'}, desc:{es:'T24 140.4 · cuándo requerido',en:'T24 140.4 · when required'}, impl:true },
    { id:'demandResp',   cat:'energy', icon:'📡',  name:{es:'Demand Response',en:'Demand Response'}, desc:{es:'T24 120.2 · CTA-2045',en:'T24 120.2 · CTA-2045'}, impl:true },
    { id:'capacityRatio',cat:'energy', icon:'⚖️',  name:{es:'Capacity Ratio',en:'Capacity Ratio'}, desc:{es:'Installed/Design — T24 150.1',en:'Installed/Design — T24 150.1'}, impl:true },

    // Mechanical Code (IMC / UMC / IFGC)
    { id:'ductSizeEF',    cat:'mech', icon:'🌀',  name:{es:'Sizing de Ducto (EF)',en:'Duct Sizing (Equal Friction)'}, desc:{es:'Equal friction 0.08–0.1"wc/100ft',en:'Equal friction 0.08–0.1"wc/100ft'}, impl:true },
    { id:'gasPipeSize',   cat:'mech', icon:'🔥',  name:{es:'Gas Pipe Sizing',en:'Gas Pipe Sizing'}, desc:{es:'IFGC 402 · Sch 40, CSST',en:'IFGC 402 · Sch 40, CSST'}, impl:true },
    { id:'combAir',       cat:'mech', icon:'💨',  name:{es:'Aire de Combustión',en:'Combustion Air'}, desc:{es:'IFGC 304 · Direct, indirect, confined',en:'IFGC 304 · Direct, indirect, confined'}, impl:true },
    { id:'ventTableB',    cat:'mech', icon:'🏭',  name:{es:'Venting B-Vent',en:'B-Vent Sizing'}, desc:{es:'NFPA 54 Cat I venting tables',en:'NFPA 54 Cat I venting tables'}, impl:true },
    { id:'chimneySize',   cat:'mech', icon:'🏛',  name:{es:'Chimenea',en:'Chimney Sizing'}, desc:{es:'Masonry chimney sizing',en:'Masonry chimney sizing'}, impl:true },
    { id:'exhaustCFM',    cat:'mech', icon:'🌬',  name:{es:'CFM de Extracción',en:'Exhaust CFM'}, desc:{es:'IMC 403 · por ocupación',en:'IMC 403 · by occupancy'}, impl:true },
    { id:'hoodType1',     cat:'mech', icon:'🍳',  name:{es:'Campana Tipo I',en:'Type I Hood'}, desc:{es:'IMC 507 · CFM por equipo',en:'IMC 507 · CFM by equipment'}, impl:true },
    { id:'clearances',    cat:'mech', icon:'📏',  name:{es:'Clearances a Combustibles',en:'Clearances to Combustibles'}, desc:{es:'IMC 308 · Furnaces, vents',en:'IMC 308 · Furnaces, vents'}, impl:true },
    { id:'staticPressureMech',cat:'mech', icon:'📉',  name:{es:'Presión Estática Total',en:'Total External Static'}, desc:{es:'TESP, fittings, loss',en:'TESP, fittings, loss'}, impl:true },
    { id:'condensateMech',cat:'mech', icon:'💧',  name:{es:'Drenaje Condensado',en:'Condensate Drain'}, desc:{es:'IMC 307 · trap, slope, size',en:'IMC 307 · trap, slope, size'}, impl:true }
  ];

  var CATEGORIES = {
    all:   { labelES:'Todo',         labelEN:'All',        emoji:'◆' },
    math:  { labelES:'Matemáticas',  labelEN:'Math',       emoji:'📐', accent:'#C9A961' },
    elec:  { labelES:'Eléctrico',    labelEN:'Electrical', emoji:'⚡', accent:'#2563EB' },
    hvac:  { labelES:'HVAC',         labelEN:'HVAC',       emoji:'❄️', accent:'#16A34A' },
    refrig:{ labelES:'Refrig',       labelEN:'Refrig',     emoji:'🧊', accent:'#0891B2' },
    mech:  { labelES:'Mecánico',     labelEN:'Mechanical', emoji:'🔧', accent:'#7C3AED' },
    nec:   { labelES:'NEC',          labelEN:'NEC',        emoji:'📘', accent:'#DC2626' },
    safe:  { labelES:'Seguridad',    labelEN:'Safety',     emoji:'🛡️', accent:'#EA580C' },
    energy:{ labelES:'Energía',      labelEN:'Energy Code',  emoji:'🌿', accent:'#059669' }
  };

  // ── State ───────────────────────────────────────────────────────
  var state = {
    view: 'home',       // 'home' | 'calc'
    currentTool: null,
    activeCat: 'all',
    searchQuery: '',
    inputs: {}          // per-tool input cache
  };

  // ── i18n ────────────────────────────────────────────────────────
  function _regI18n() {
    if (typeof window._addTranslations !== 'function') return;
    window._addTranslations({
      mp_card_title: { es:'Maestro Pro™', en:'Maestro Pro™' },
      mp_card_sub:   { es:'Matemáticas · Eléctrico · HVAC · NEC · Seguridad', en:'Math · Electrical · HVAC · NEC · Safety' },
      mp_title:      { es:'Maestro Pro™', en:'Maestro Pro™' },
      mp_hero_badge: { es:'PARTE DEL SISTEMA · 100% OFFLINE', en:'PART OF THE SYSTEM · 100% OFFLINE' },
      mp_hero_sub:   { es:'Matemáticas, fórmulas, normativa y herramientas complementarias', en:'Math, formulas, code & complementary tools' },
      mp_hero_tag:   { es:'MUST READ · MUST HAVE · NIVEL 33', en:'MUST READ · MUST HAVE · LEVEL 33' },
      mp_complement: { es:'¿Estás en el field? Usa Herramientas HVAC para gauges, PT charts y diagnóstico. Maestro Pro es para matemáticas, normativa y aprendizaje.',
                       en:'In the field? Use HVAC Tools for gauges, PT charts and diagnostics. Maestro Pro is for math, code and learning.' },
      mp_search:     { es:'Buscar calculadora, fórmula, artículo NEC…', en:'Search calculator, formula, NEC article…' },
      mp_no_results: { es:'Sin resultados para tu búsqueda.', en:'No results found.' },
      mp_coming_soon:{ es:'Próximamente', en:'Coming soon' },
      mp_coming_soon_body:{ es:'Esta herramienta está en camino. Por ahora, explora las que ya funcionan en el home.', en:'This tool is on the way. Explore the working ones on the home screen for now.' },
      mp_back:       { es:'Volver', en:'Back' },
      mp_cat_math:   { es:'Matemáticas y Construcción', en:'Math & Construction' },
      mp_cat_elec:   { es:'Eléctrico Avanzado', en:'Advanced Electrical' },
      mp_cat_elec_sub:{ es:'(complementa Herramientas HVAC)', en:'(complements HVAC Tools)' },
      mp_cat_hvac:   { es:'HVAC Complementario', en:'Complementary HVAC' },
      mp_cat_hvac_sub:{ es:'(complementa Herramientas HVAC)', en:'(complements HVAC Tools)' },
      mp_cat_refrig: { es:'Refrigeración Diagnóstica', en:'Diagnostic Refrigeration' },
      mp_cat_refrig_sub:{ es:'(complementa Herramientas HVAC)', en:'(complements HVAC Tools)' },
      mp_cat_nec:    { es:'NEC / Normativa', en:'NEC / Code' },
      mp_cat_safe:   { es:'Seguridad', en:'Safety' },
      mp_tools:      { es:'herramientas', en:'tools' },
      mp_footer_title:{ es:'51 herramientas complementarias', en:'51 complementary tools' },
      mp_footer_sub: { es:'Matemáticas · Eléctrico · HVAC · Refrigeración · NEC · Seguridad', en:'Math · Electrical · HVAC · Refrigeration · NEC · Safety' },
      mp_footer_ecosystem:{ es:'Parte del ecosistema MAESTRO HVACR · Nivel 33', en:'Part of the MAESTRO HVACR ecosystem · Level 33' },
      mp_footer_field:{ es:'Si estás midiendo en el field → abre Herramientas HVAC', en:'Measuring in the field → open HVAC Tools' },
      // Calculators
      mp_inputs:     { es:'Entradas', en:'Inputs' },
      mp_result:     { es:'Resultado', en:'Result' },
      mp_field_case: { es:'CASO REAL DEL FIELD', en:'REAL FIELD CASE' },
      mp_tip_chaka:  { es:'TIP CHAKA', en:'CHAKA TIP' },
      // Fractions
      mp_fr_title:   { es:'Fracciones', en:'Fractions' },
      mp_fr_sub:     { es:'Decimal ↔ fracción con precisión 1/16"', en:'Decimal ↔ fraction with 1/16" precision' },
      mp_fr_lbl:     { es:'Decimal', en:'Decimal' },
      mp_fr_unit:    { es:'pulgadas', en:'inches' },
      mp_fr_res_lbl: { es:'Fracción equivalente', en:'Equivalent fraction' },
      mp_fr_prec:    { es:'Precisión 1/16"', en:'Precision 1/16"' },
      mp_fr_in_8:    { es:'En 1/8"', en:'In 1/8"' },
      mp_fr_in_32:   { es:'En 1/32"', en:'In 1/32"' },
      mp_fr_table:   { es:'Tabla Rápida del Oficio', en:'Trade Quick Reference' },
      mp_fr_case:    { es:'Midiendo conduit EMT con cinta, tu calculadora dice <strong>3.375"</strong>. Tu cinta está en fracciones → <strong>3 3/8"</strong>. Regla: multiplica el decimal × 16 y tienes dieciseisavos. 0.375 × 16 = 6/16 = <strong>3/8"</strong>.',
                       en:'Measuring EMT conduit with a tape, the calc says <strong>3.375"</strong>. Your tape is in fractions → <strong>3 3/8"</strong>. Rule: multiply decimal × 16 for sixteenths. 0.375 × 16 = 6/16 = <strong>3/8"</strong>.' },
      mp_fr_tip:     { es:'Memoriza solo 4 decimales: <strong>0.125=1/8</strong>, <strong>0.25=1/4</strong>, <strong>0.375=3/8</strong>, <strong>0.5=1/2</strong>. Con esos armas cualquier fracción mental en segundos.',
                       en:'Memorize just 4: <strong>0.125=1/8</strong>, <strong>0.25=1/4</strong>, <strong>0.375=3/8</strong>, <strong>0.5=1/2</strong>. With those you can build any fraction in seconds.' },
      // Pythagorean
      mp_pt_title:   { es:'Pitágoras 3-4-5', en:'Pythagorean 3-4-5' },
      mp_pt_sub:     { es:'Cuadrar esquinas en construcción', en:'Square construction corners' },
      mp_pt_a:       { es:'Lado A (horizontal)', en:'Side A (horizontal)' },
      mp_pt_b:       { es:'Lado B (vertical)', en:'Side B (vertical)' },
      mp_pt_ft:      { es:'pies', en:'feet' },
      mp_pt_res_lbl: { es:'Diagonal (hipotenusa)', en:'Diagonal (hypotenuse)' },
      mp_pt_inches:  { es:'En pulgadas', en:'In inches' },
      mp_pt_square:  { es:'Ángulo recto si mide', en:'Right angle if measures' },
      mp_pt_case:    { es:'Instalas un pad cuadrado para condensador. Mides <strong>3 pies</strong> un lado y <strong>4 pies</strong> el perpendicular. Si la diagonal mide exactamente <strong>5 pies</strong>, tu esquina está a 90°. Si no, rota hasta que dé 5\'. Regla 3-4-5.',
                       en:'Installing a square condenser pad. You measure <strong>3 ft</strong> one side and <strong>4 ft</strong> the perpendicular. If the diagonal is exactly <strong>5 ft</strong>, your corner is 90°. Otherwise rotate until it hits 5\'. 3-4-5 rule.' },
      mp_pt_tip:     { es:'Escalas válidas: <strong>3-4-5</strong>, <strong>6-8-10</strong>, <strong>9-12-15</strong>, <strong>12-16-20</strong> pies. Todos triángulos rectángulos perfectos. Para pads chicos usa pulgadas; para grandes usa pies.',
                       en:'Valid scales: <strong>3-4-5</strong>, <strong>6-8-10</strong>, <strong>9-12-15</strong>, <strong>12-16-20</strong>. All perfect right triangles. For small pads use inches; for large, feet.' },
      // Delta T
      mp_dt_title:   { es:'Delta T (ΔT)', en:'Delta T (ΔT)' },
      mp_dt_sub:     { es:'Supply vs return — rango normal 14-22°F', en:'Supply vs return — normal 14-22°F' },
      mp_dt_supply:  { es:'Supply (aire frío)', en:'Supply (cold air)' },
      mp_dt_return:  { es:'Return (aire que regresa)', en:'Return (air coming back)' },
      mp_dt_f:       { es:'°F', en:'°F' },
      mp_dt_res_lbl: { es:'Delta T', en:'Delta T' },
      mp_dt_status:  { es:'Estado', en:'Status' },
      mp_dt_range:   { es:'Rango normal', en:'Normal range' },
      mp_dt_normal:  { es:'Normal', en:'Normal' },
      mp_dt_low:     { es:'BAJO — revisa airflow o posible low charge', en:'LOW — check airflow or low charge' },
      mp_dt_high:    { es:'ALTO — revisa airflow o sobre-carga', en:'HIGH — check airflow or overcharge' },
      mp_dt_case:    { es:'A/C residencial: Supply = <strong>58°F</strong>, Return = <strong>75°F</strong>. ΔT = <strong>17°F</strong> — dentro de rango. Si ΔT < 14°F revisa filtro/coil/airflow. Si > 22°F revisa carga de refrigerante.',
                       en:'Residential A/C: Supply = <strong>58°F</strong>, Return = <strong>75°F</strong>. ΔT = <strong>17°F</strong> — within range. If ΔT < 14°F check filter/coil/airflow. If > 22°F check refrigerant charge.' },
      mp_dt_tip:     { es:'En climas húmedos (Miami, Houston) apunta a <strong>14-17°F</strong>. En secos (Phoenix) apunta a <strong>18-22°F</strong>. Siempre mide a 15 min de operación continua, no cuando acabas de prender.',
                       en:'Humid climates (Miami, Houston) aim for <strong>14-17°F</strong>. Dry (Phoenix) aim for <strong>18-22°F</strong>. Always measure after 15 min of continuous run, not right at startup.' }
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────
  function t(key, fb) {
    if (typeof window._t === 'function') return window._t(key, fb);
    return fb || key;
  }
  function currentLang() {
    try { return (localStorage.getItem('maestro_lang') || 'es'); } catch(_e) { return 'es'; }
  }
  function getName(tool) { return tool.name[currentLang()] || tool.name.es; }
  function getDesc(tool) { return tool.desc[currentLang()] || tool.desc.es; }
  function getCatLabel(catId) {
    var c = CATEGORIES[catId];
    if (!c) return catId;
    return currentLang() === 'en' ? c.labelEN : c.labelES;
  }

  function decToFrac(decimal, precision) {
    precision = precision || 16;
    if (isNaN(decimal)) return '—';
    var negative = decimal < 0;
    decimal = Math.abs(decimal);
    var whole = Math.floor(decimal);
    var remainder = decimal - whole;
    var numerator = Math.round(remainder * precision);
    var denominator = precision;
    if (numerator === 0) return (negative ? '-' : '') + whole + '"';
    if (numerator === denominator) return (negative ? '-' : '') + (whole + 1) + '"';
    var gcd = function(a, b){ return b ? gcd(b, a % b) : a; };
    var div = gcd(numerator, denominator);
    numerator /= div; denominator /= div;
    var sign = negative ? '-' : '';
    if (whole > 0) return sign + whole + ' ' + numerator + '/' + denominator + '"';
    return sign + numerator + '/' + denominator + '"';
  }

  // ── Styles ──────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('mpStyles')) return;
    var css = [
      '#maestroProScreen{background:#F5F5F5;min-height:100vh;}',
      '#maestroProScreen *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}',
      '#maestroProScreen .mp-root{font-family:-apple-system,BlinkMacSystemFont,Inter,Roboto,sans-serif;color:#0A0A0A;}',
      // Header
      '#maestroProScreen .mp-header{background:#fff;padding:14px 16px;border-bottom:3px solid #C9A961;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,0.04);}',
      '#maestroProScreen .mp-back-btn{min-width:40px;height:40px;background:#F5F5F5;border:none;border-radius:50%;font-size:20px;color:#1B2845;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;}',
      '#maestroProScreen .mp-back-btn:active{background:#E0E0E0;}',
      '#maestroProScreen .mp-header-title{font-size:15px;font-weight:700;color:#0A0A0A;flex:1;}',
      '#maestroProScreen .mp-header-sub{font-size:10.5px;color:#666;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;}',
      // Hero
      '#maestroProScreen .mp-hero{background:linear-gradient(135deg,#0A0A0A 0%,#1B2845 100%);color:#fff;padding:26px 20px;position:relative;overflow:hidden;}',
      '#maestroProScreen .mp-hero::before{content:"";position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:#C9A961;opacity:0.1;border-radius:50%;}',
      '#maestroProScreen .mp-hero-content{position:relative;z-index:1;}',
      '#maestroProScreen .mp-hero-badge{display:inline-block;background:#C9A961;color:#0A0A0A;font-size:10px;font-weight:800;padding:4px 10px;border-radius:4px;letter-spacing:0.1em;margin-bottom:12px;}',
      '#maestroProScreen .mp-hero-title{font-size:30px;font-weight:900;letter-spacing:-0.02em;line-height:1.05;color:#fff;}',
      '#maestroProScreen .mp-hero-title .mp-gold{color:#C9A961;}',
      '#maestroProScreen .mp-hero-sub{font-size:13px;opacity:0.88;margin-top:8px;line-height:1.45;color:#fff;}',
      '#maestroProScreen .mp-hero-tag{font-size:13px;color:#E8C97A;margin-top:12px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;}',
      // Complement bar
      '#maestroProScreen .mp-complement-bar{background:#FFFBEB;border-bottom:1px solid #FEF3C7;padding:12px 16px;font-size:13px;color:#1B2845;font-weight:700;line-height:1.5;display:flex;align-items:flex-start;gap:8px;}',
      '#maestroProScreen .mp-complement-bar strong{color:#0A0A0A;font-weight:900;}',
      // Search
      '#maestroProScreen .mp-search-wrap{background:#fff;padding:10px 16px;border-bottom:1px solid #E0E0E0;}',
      '#maestroProScreen .mp-search-input{width:100%;padding:11px 15px 11px 40px;border:1px solid #E0E0E0;border-radius:10px;font-size:14px;background:#F5F5F5 url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 16 16\' fill=\'none\'><circle cx=\'7\' cy=\'7\' r=\'5\' stroke=\'%23666\' stroke-width=\'1.5\'/><path d=\'M11 11l3 3\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\'/></svg>") no-repeat 14px center;color:#0A0A0A;font-weight:500;outline:none;}',
      '#maestroProScreen .mp-search-input:focus{border-color:#C9A961;background-color:#fff;}',
      // Tabs
      '#maestroProScreen .mp-tabs{background:#fff;padding:8px 12px 0;display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid #E0E0E0;-webkit-overflow-scrolling:touch;scrollbar-width:none;}',
      '#maestroProScreen .mp-tabs::-webkit-scrollbar{display:none;}',
      '#maestroProScreen .mp-tab{flex-shrink:0;padding:10px 14px;background:none;border:none;font-size:12.5px;font-weight:600;color:#666;cursor:pointer;border-bottom:3px solid transparent;white-space:nowrap;}',
      '#maestroProScreen .mp-tab.active{color:#1B2845;border-bottom-color:#C9A961;}',
      // Content
      '#maestroProScreen .mp-content{padding:16px;max-width:1200px;margin:0 auto;padding-bottom:calc(160px + env(safe-area-inset-bottom,0px));}',
      // Category
      '#maestroProScreen .mp-cat-section{margin-bottom:24px;}',
      '#maestroProScreen .mp-cat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 4px;gap:10px;}',
      '#maestroProScreen .mp-cat-title{font-size:13px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#1B2845;}',
      '#maestroProScreen .mp-cat-title .mp-cat-sub{font-weight:600;color:#555;text-transform:none;letter-spacing:0;margin-left:6px;font-size:12px;}',
      '#maestroProScreen .mp-cat-count{font-size:12px;color:#1B2845;background:#E0E0E0;padding:3px 10px;border-radius:10px;font-weight:800;white-space:nowrap;}',
      // Tools grid
      '#maestroProScreen .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px;}',
      '@media (min-width:768px){#maestroProScreen .mp-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;}}',
      // Tool card
      '#maestroProScreen .mp-tool{background:#fff;border:1px solid #E0E0E0;border-radius:14px;padding:14px 12px;cursor:pointer;transition:transform 0.12s,background 0.12s;position:relative;min-height:110px;}',
      '#maestroProScreen .mp-tool:active{transform:scale(0.97);background:#F5F5F5;}',
      '#maestroProScreen .mp-tool.cat-math{border-top:3px solid #C9A961;}',
      '#maestroProScreen .mp-tool.cat-elec{border-top:3px solid #2563EB;}',
      '#maestroProScreen .mp-tool.cat-hvac{border-top:3px solid #16A34A;}',
      '#maestroProScreen .mp-tool.cat-refrig{border-top:3px solid #0891B2;}',
      '#maestroProScreen .mp-tool.cat-nec{border-top:3px solid #DC2626;}',
      '#maestroProScreen .mp-tool.cat-safe{border-top:3px solid #EA580C;}',
      '#maestroProScreen .mp-tool.coming-soon{opacity:0.72;}',
      '#maestroProScreen .mp-tool-ic{width:36px;height:36px;border-radius:8px;background:#F5F5F5;display:flex;align-items:center;justify-content:center;margin-bottom:8px;font-size:20px;font-weight:700;color:#1B2845;}',
      '#maestroProScreen .mp-tool-name{font-size:14px;font-weight:900;color:#0A0A0A;line-height:1.2;margin-bottom:4px;}',
      '#maestroProScreen .mp-tool-desc{font-size:13px;color:#1B2845;line-height:1.4;font-weight:600;}',
      '#maestroProScreen .mp-tool-tag{position:absolute;top:9px;right:9px;font-size:11px;font-weight:900;letter-spacing:0.08em;padding:3px 7px;border-radius:4px;text-transform:uppercase;}',
      '#maestroProScreen .mp-tag-math{background:#FEF3C7;color:#92400E;}',
      '#maestroProScreen .mp-tag-elec{background:#DBEAFE;color:#1E40AF;}',
      '#maestroProScreen .mp-tag-hvac{background:#DCFCE7;color:#166534;}',
      '#maestroProScreen .mp-tag-refrig{background:#CFFAFE;color:#155E75;}',
      '#maestroProScreen .mp-tag-nec{background:#FEE2E2;color:#991B1B;}',
      '#maestroProScreen .mp-tag-safe{background:#FFEDD5;color:#9A3412;}',
      '#maestroProScreen .mp-tool-soon{position:absolute;top:9px;left:9px;background:#1B2845;color:#E8C97A;font-size:11px;font-weight:900;padding:3px 7px;border-radius:4px;letter-spacing:0.08em;text-transform:uppercase;}',
      // Calc view
      '#maestroProScreen .mp-calc{padding:0;}',
      '#maestroProScreen .mp-calc-head{background:#fff;border-radius:14px;padding:18px;margin-bottom:14px;display:flex;align-items:center;gap:14px;border:1px solid #E0E0E0;}',
      '#maestroProScreen .mp-calc-ic{width:54px;height:54px;border-radius:12px;background:#1B2845;color:#C9A961;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;flex-shrink:0;}',
      '#maestroProScreen .mp-calc-title{font-size:19px;font-weight:800;color:#0A0A0A;line-height:1.15;}',
      '#maestroProScreen .mp-calc-sub{font-size:13px;color:#1B2845;margin-top:4px;font-weight:600;}',
      // Section card
      '#maestroProScreen .mp-sec{background:#fff;border-radius:14px;padding:18px;margin-bottom:14px;border:1px solid #E0E0E0;}',
      '#maestroProScreen .mp-sec-lbl{font-size:13px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#1B2845;margin-bottom:12px;}',
      '#maestroProScreen .mp-sec-lbl .dot{color:#C9A961;}',
      // Inputs
      '#maestroProScreen .mp-ig{margin-bottom:12px;}',
      '#maestroProScreen .mp-lbl{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;color:#0A0A0A;margin-bottom:5px;}',
      '#maestroProScreen .mp-unit{font-size:12px;color:#1B2845;font-weight:700;}',
      '#maestroProScreen .mp-in{width:100%;padding:13px 15px;border:2px solid #E0E0E0;border-radius:10px;font-size:16px;font-weight:600;background:#F5F5F5;color:#0A0A0A;-webkit-appearance:none;appearance:none;outline:none;min-height:48px;}',
      '#maestroProScreen .mp-in:focus{border-color:#C9A961;background:#fff;}',
      // Result panel
      '#maestroProScreen .mp-res{background:linear-gradient(135deg,#0A0A0A 0%,#1B2845 100%);color:#fff;border-radius:14px;padding:20px;margin-bottom:14px;position:relative;overflow:hidden;}',
      '#maestroProScreen .mp-res::before{content:"";position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:#C9A961;opacity:0.1;border-radius:50%;}',
      '#maestroProScreen .mp-res-lbl{font-size:13px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#E8C97A !important;margin-bottom:12px;position:relative;}',
      '#maestroProScreen .mp-res-main{font-size:42px;font-weight:900;color:#fff !important;line-height:1;letter-spacing:-0.02em;margin-bottom:4px;position:relative;}',
      '#maestroProScreen .mp-res-unit{font-size:18px;font-weight:800;color:#E8C97A !important;margin-left:6px;}',
      '#maestroProScreen .mp-res-desc{font-size:13px;font-weight:700;color:#FFFFFF !important;margin-bottom:14px;position:relative;}',
      '#maestroProScreen .mp-res-grid{border-top:1px solid rgba(255,255,255,0.25);padding-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative;}',
      '#maestroProScreen .mp-res-item{font-size:13px;font-weight:700;color:#E2E8F0 !important;}',
      '#maestroProScreen .mp-res-val{font-size:16px;font-weight:900;color:#fff !important;margin-top:3px;}',
      // Example card
      '#maestroProScreen .mp-ex{background:#FFFBEB;border:1px solid #FEF3C7;border-left:4px solid #C9A961;border-radius:10px;padding:14px 16px;margin-bottom:14px;}',
      '#maestroProScreen .mp-ex-lbl{font-size:13px;font-weight:900;letter-spacing:0.12em;color:#1B2845;text-transform:uppercase;margin-bottom:8px;}',
      '#maestroProScreen .mp-ex-txt{font-size:14px;line-height:1.55;color:#111111;font-weight:600;}',
      '#maestroProScreen .mp-ex-txt strong{color:#0A0A0A;font-weight:900;}',
      // Tip
      '#maestroProScreen .mp-tip{background:#1B2845;color:#fff;border-radius:10px;padding:14px 16px;margin-bottom:14px;}',
      '#maestroProScreen .mp-tip-lbl{font-size:13px;font-weight:900;letter-spacing:0.14em;color:#E8C97A !important;margin-bottom:8px;text-transform:uppercase;}',
      '#maestroProScreen .mp-tip-txt{font-size:14px;line-height:1.5;color:#FFFFFF !important;font-weight:600;}',
      '#maestroProScreen .mp-tip-txt strong{color:#E8C97A !important;font-weight:900;}',
      // Table quick-ref
      '#maestroProScreen .mp-qr{font-size:14px;line-height:1.9;color:#111111;font-weight:600;}',
      '#maestroProScreen .mp-qr strong{color:#0A0A0A;font-weight:900;}',
      // Footer
      '#maestroProScreen .mp-footer{background:#1B2845;color:#fff;border-radius:14px;padding:22px 20px;margin:20px 0 10px;text-align:center;}',
      '#maestroProScreen .mp-footer-tag{font-size:13px;color:#E8C97A !important;letter-spacing:0.15em;font-weight:900;margin-bottom:10px;text-transform:uppercase;}',
      '#maestroProScreen .mp-footer-title{font-size:14px;line-height:1.5;color:#fff !important;margin-bottom:10px;font-weight:700;}',
      '#maestroProScreen .mp-footer-title strong{color:#fff !important;font-weight:900;}',
      '#maestroProScreen .mp-footer-sub{font-size:13px;color:#E2E8F0 !important;font-weight:600;}',
      '#maestroProScreen .mp-footer-eco{font-size:13px;color:#E8C97A !important;font-weight:800;margin-bottom:6px;}',
      // Empty state
      '#maestroProScreen .mp-empty{padding:40px 20px;text-align:center;color:#1B2845;font-size:15px;font-weight:700;}'
    ].join('\n');
    var el = document.createElement('style');
    el.id = 'mpStyles';
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ── HTML escape ─────────────────────────────────────────────────
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // ── Home view ───────────────────────────────────────────────────
  function renderHome() {
    var lang = currentLang();
    var q = (state.searchQuery || '').trim().toLowerCase();
    var filterCat = state.activeCat;

    function matches(tool) {
      if (filterCat !== 'all' && tool.cat !== filterCat) return false;
      if (!q) return true;
      var hay = (getName(tool) + ' ' + getDesc(tool) + ' ' + tool.id).toLowerCase();
      return hay.indexOf(q) !== -1;
    }

    var catsOrder = ['math','elec','hvac','refrig','nec','safe'];
    var subNotes = { elec:'mp_cat_elec_sub', hvac:'mp_cat_hvac_sub', refrig:'mp_cat_refrig_sub' };
    var catTitleKeys = { math:'mp_cat_math', elec:'mp_cat_elec', hvac:'mp_cat_hvac', refrig:'mp_cat_refrig', nec:'mp_cat_nec', safe:'mp_cat_safe' };

    var sectionsHTML = '';
    var totalShown = 0;

    for (var ci = 0; ci < catsOrder.length; ci++) {
      var catId = catsOrder[ci];
      var catTools = TOOLS.filter(function(tool){ return tool.cat === catId && matches(tool); });
      if (catTools.length === 0) continue;
      totalShown += catTools.length;

      var subNote = subNotes[catId] ? '<span class="mp-cat-sub">' + esc(t(subNotes[catId], '')) + '</span>' : '';

      sectionsHTML += '<div class="mp-cat-section">' +
        '<div class="mp-cat-header">' +
          '<div class="mp-cat-title">' + CATEGORIES[catId].emoji + ' ' + esc(t(catTitleKeys[catId], getCatLabel(catId))) + subNote + '</div>' +
          '<div class="mp-cat-count">' + catTools.length + ' ' + esc(t('mp_tools','tools')) + '</div>' +
        '</div>' +
        '<div class="mp-grid">';

      for (var i = 0; i < catTools.length; i++) {
        var tool = catTools[i];
        var comingSoonTag = tool.impl ? '' : '<span class="mp-tool-soon">' + esc(t('mp_coming_soon','Pronto')) + '</span>';
        var tagCls = 'mp-tag-' + tool.cat;
        var tagLbl = tool.cat === 'math' ? 'MATH' : tool.cat === 'elec' ? 'ELEC' : tool.cat === 'hvac' ? 'HVAC' : tool.cat === 'refrig' ? 'REFRIG' : tool.cat === 'nec' ? 'NEC' : 'SAFETY';
        sectionsHTML += '<div class="mp-tool cat-' + tool.cat + (tool.impl ? '' : ' coming-soon') + '" data-tool="' + esc(tool.id) + '">' +
          '<span class="mp-tool-tag ' + tagCls + '">' + tagLbl + '</span>' +
          comingSoonTag +
          '<div class="mp-tool-ic">' + esc(tool.icon) + '</div>' +
          '<div class="mp-tool-name">' + esc(getName(tool)) + '</div>' +
          '<div class="mp-tool-desc">' + esc(getDesc(tool)) + '</div>' +
        '</div>';
      }
      sectionsHTML += '</div></div>';
    }

    if (totalShown === 0) {
      sectionsHTML = '<div class="mp-empty">' + esc(t('mp_no_results','Sin resultados.')) + '</div>';
    }

    // Tabs
    var tabs = ['all'].concat(catsOrder);
    var tabsHTML = '';
    for (var ti = 0; ti < tabs.length; ti++) {
      var tid = tabs[ti];
      var cc = CATEGORIES[tid];
      var tlabel = (tid === 'all') ? (lang === 'en' ? 'All' : 'Todo') : (cc.emoji + ' ' + getCatLabel(tid));
      tabsHTML += '<button class="mp-tab' + (state.activeCat === tid ? ' active' : '') + '" data-tab="' + tid + '">' + esc(tlabel) + '</button>';
    }

    var heroTitle = (lang === 'en') ? 'MAESTRO <span class="mp-gold">PRO™</span>' : 'MAESTRO <span class="mp-gold">PRO™</span>';

    return '' +
      '<div class="mp-header">' +
        '<button class="mp-back-btn" data-act="back">←</button>' +
        '<div>' +
          '<div class="mp-header-title" data-i18n="mp_title">Maestro Pro™</div>' +
        '</div>' +
      '</div>' +
      '<div class="mp-hero">' +
        '<div class="mp-hero-content">' +
          '<div class="mp-hero-badge" data-i18n="mp_hero_badge">' + esc(t('mp_hero_badge','PARTE DEL SISTEMA · 100% OFFLINE')) + '</div>' +
          '<div class="mp-hero-title">' + heroTitle + '</div>' +
          '<div class="mp-hero-sub" data-i18n="mp_hero_sub">' + esc(t('mp_hero_sub','')) + '</div>' +
          '<div class="mp-hero-tag" data-i18n="mp_hero_tag">' + esc(t('mp_hero_tag','')) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mp-complement-bar">' +
        '<span style="font-size:15px;flex-shrink:0;">💡</span>' +
        '<span data-i18n="mp_complement">' + esc(t('mp_complement','')) + '</span>' +
      '</div>' +
      '<div class="mp-search-wrap">' +
        '<input type="text" class="mp-search-input" placeholder="' + esc(t('mp_search','Buscar…')) + '" data-act="search" value="' + esc(state.searchQuery) + '" />' +
      '</div>' +
      '<div class="mp-tabs">' + tabsHTML + '</div>' +
      '<div class="mp-content">' +
        sectionsHTML +
        '<div class="mp-footer">' +
          '<div class="mp-footer-tag">◆ MAESTRO PRO™</div>' +
          '<div class="mp-footer-title"><strong>' + esc(t('mp_footer_title','51 herramientas complementarias')) + '</strong><br>' + esc(t('mp_footer_sub','')) + '</div>' +
          '<div class="mp-footer-eco">' + esc(t('mp_footer_ecosystem','')) + '</div>' +
          '<div class="mp-footer-sub">' + esc(t('mp_footer_field','')) + '</div>' +
        '</div>' +
      '</div>';
  }

  // ── Calculator: Fractions ───────────────────────────────────────
  function renderFractions() {
    var dec = (state.inputs.fractions && state.inputs.fractions.dec != null) ? state.inputs.fractions.dec : 3.375;
    var frac16 = decToFrac(dec, 16);
    var frac8  = decToFrac(dec, 8);
    var frac32 = decToFrac(dec, 32);
    return renderCalcShell('fractions', 'mp_fr_title', 'mp_fr_sub', '¾',
      // Inputs
      '<div class="mp-sec">' +
        '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
        '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_fr_lbl','Decimal')) + '</span><span class="mp-unit">' + esc(t('mp_fr_unit','pulgadas')) + '</span></div>' +
          '<input type="number" class="mp-in" data-in="fractions.dec" value="' + dec + '" step="0.0625" />' +
        '</div>' +
      '</div>' +
      // Result
      '<div class="mp-res">' +
        '<div class="mp-res-lbl">◆ ' + esc(t('mp_fr_res_lbl','Fracción equivalente')) + '</div>' +
        '<div class="mp-res-main">' + esc(frac16) + '</div>' +
        '<div class="mp-res-desc">' + esc(t('mp_fr_prec','Precisión 1/16"')) + '</div>' +
        '<div class="mp-res-grid">' +
          '<div><div class="mp-res-item">' + esc(t('mp_fr_in_8','En 1/8"')) + '</div><div class="mp-res-val">' + esc(frac8) + '</div></div>' +
          '<div><div class="mp-res-item">' + esc(t('mp_fr_in_32','En 1/32"')) + '</div><div class="mp-res-val">' + esc(frac32) + '</div></div>' +
        '</div>' +
      '</div>' +
      // Quick table
      '<div class="mp-sec">' +
        '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_fr_table','Tabla Rápida')) + '</div>' +
        '<div class="mp-qr">' +
          '<div><strong>1/16"</strong> = 0.0625"</div>' +
          '<div><strong>1/8"</strong> = 0.125"</div>' +
          '<div><strong>3/16"</strong> = 0.1875"</div>' +
          '<div><strong>1/4"</strong> = 0.25"</div>' +
          '<div><strong>3/8"</strong> = 0.375"</div>' +
          '<div><strong>1/2"</strong> = 0.5"</div>' +
          '<div><strong>5/8"</strong> = 0.625"</div>' +
          '<div><strong>3/4"</strong> = 0.75"</div>' +
          '<div><strong>7/8"</strong> = 0.875"</div>' +
        '</div>' +
      '</div>' +
      // Example + tip
      exampleTip('mp_fr_case', 'mp_fr_tip')
    );
  }

  // ── Calculator: Pythagorean ─────────────────────────────────────
  function renderPythagorean() {
    var a = (state.inputs.pythagorean && state.inputs.pythagorean.a != null) ? +state.inputs.pythagorean.a : 3;
    var b = (state.inputs.pythagorean && state.inputs.pythagorean.b != null) ? +state.inputs.pythagorean.b : 4;
    var c = Math.sqrt(a*a + b*b);
    var cStr = (Math.abs(c - Math.round(c)) < 0.005) ? String(Math.round(c)) : c.toFixed(2);
    var inches = c * 12;
    var inStr = inches.toFixed(1);
    return renderCalcShell('pythagorean', 'mp_pt_title', 'mp_pt_sub', '△',
      '<div class="mp-sec">' +
        '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
        '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_pt_a','Lado A')) + '</span><span class="mp-unit">' + esc(t('mp_pt_ft','pies')) + '</span></div>' +
          '<input type="number" class="mp-in" data-in="pythagorean.a" value="' + a + '" step="0.5" />' +
        '</div>' +
        '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_pt_b','Lado B')) + '</span><span class="mp-unit">' + esc(t('mp_pt_ft','pies')) + '</span></div>' +
          '<input type="number" class="mp-in" data-in="pythagorean.b" value="' + b + '" step="0.5" />' +
        '</div>' +
      '</div>' +
      '<div class="mp-res">' +
        '<div class="mp-res-lbl">◆ ' + esc(t('mp_pt_res_lbl','Diagonal')) + '</div>' +
        '<div class="mp-res-main">' + esc(cStr) + '<span class="mp-res-unit">' + esc(t('mp_pt_ft','pies')) + '</span></div>' +
        '<div class="mp-res-desc">C = √(A² + B²) = √(' + (a*a) + ' + ' + (b*b) + ') = √' + (a*a + b*b) + '</div>' +
        '<div class="mp-res-grid">' +
          '<div><div class="mp-res-item">' + esc(t('mp_pt_inches','En pulgadas')) + '</div><div class="mp-res-val">' + esc(inStr) + '"</div></div>' +
          '<div><div class="mp-res-item">' + esc(t('mp_pt_square','Recto si mide')) + '</div><div class="mp-res-val">' + esc(cStr) + '\'</div></div>' +
        '</div>' +
      '</div>' +
      exampleTip('mp_pt_case', 'mp_pt_tip')
    );
  }

  // ── Calculator: Delta T ─────────────────────────────────────────
  function renderDeltaT() {
    var supply = (state.inputs.deltaT && state.inputs.deltaT.supply != null) ? +state.inputs.deltaT.supply : 58;
    var ret = (state.inputs.deltaT && state.inputs.deltaT.ret != null) ? +state.inputs.deltaT.ret : 75;
    var dt = ret - supply;
    var statusKey, statusColor;
    if (dt < 14) { statusKey = 'mp_dt_low'; statusColor = '#F87171'; }
    else if (dt > 22) { statusKey = 'mp_dt_high'; statusColor = '#FBBF24'; }
    else { statusKey = 'mp_dt_normal'; statusColor = '#4ADE80'; }
    return renderCalcShell('deltaT', 'mp_dt_title', 'mp_dt_sub', 'ΔT',
      '<div class="mp-sec">' +
        '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
        '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_dt_supply','Supply')) + '</span><span class="mp-unit">°F</span></div>' +
          '<input type="number" class="mp-in" data-in="deltaT.supply" value="' + supply + '" step="1" />' +
        '</div>' +
        '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_dt_return','Return')) + '</span><span class="mp-unit">°F</span></div>' +
          '<input type="number" class="mp-in" data-in="deltaT.ret" value="' + ret + '" step="1" />' +
        '</div>' +
      '</div>' +
      '<div class="mp-res">' +
        '<div class="mp-res-lbl">◆ ' + esc(t('mp_dt_res_lbl','Delta T')) + '</div>' +
        '<div class="mp-res-main">' + (dt > 0 ? '+' : '') + dt.toFixed(1) + '<span class="mp-res-unit">°F</span></div>' +
        '<div class="mp-res-desc" style="color:' + statusColor + ' !important;font-weight:600;">' + esc(t(statusKey, '')) + '</div>' +
        '<div class="mp-res-grid">' +
          '<div><div class="mp-res-item">' + esc(t('mp_dt_range','Rango normal')) + '</div><div class="mp-res-val">14–22°F</div></div>' +
          '<div><div class="mp-res-item">' + esc(t('mp_dt_status','Estado')) + '</div><div class="mp-res-val" style="color:' + statusColor + ' !important;">' + (dt >= 14 && dt <= 22 ? '✓' : '⚠') + '</div></div>' +
        '</div>' +
      '</div>' +
      exampleTip('mp_dt_case', 'mp_dt_tip')
    );
  }

  // ── Coming soon view ────────────────────────────────────────────
  function renderComingSoon(tool) {
    return renderCalcShell(tool.id, null, null, tool.icon,
      '<div class="mp-sec">' +
        '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_coming_soon','Próximamente')) + '</div>' +
        '<div style="font-size:14px;line-height:1.6;color:#44403C;">' +
          esc(t('mp_coming_soon_body','Esta herramienta está en camino.')) +
        '</div>' +
      '</div>',
      getName(tool), getDesc(tool)
    );
  }

  // ── Calc shell ──────────────────────────────────────────────────
  function renderCalcShell(id, titleKey, subKey, icon, body, titleOverride, subOverride) {
    var title = titleOverride || (titleKey ? t(titleKey, '') : '');
    var sub = subOverride || (subKey ? t(subKey, '') : '');
    return '' +
      '<div class="mp-header">' +
        '<button class="mp-back-btn" data-act="back">←</button>' +
        '<div class="mp-header-title">' + esc(title) + '</div>' +
      '</div>' +
      '<div class="mp-content mp-calc">' +
        '<div class="mp-calc-head">' +
          '<div class="mp-calc-ic">' + esc(icon || '◆') + '</div>' +
          '<div>' +
            '<div class="mp-calc-title">' + esc(title) + '</div>' +
            '<div class="mp-calc-sub">' + esc(sub) + '</div>' +
          '</div>' +
        '</div>' +
        body +
      '</div>';
  }

  function exampleTip(caseKey, tipKey) {
    return '' +
      '<div class="mp-ex">' +
        '<div class="mp-ex-lbl">' + esc(t('mp_field_case','Caso real')) + '</div>' +
        '<div class="mp-ex-txt">' + t(caseKey, '') + '</div>' +
      '</div>' +
      '<div class="mp-tip">' +
        '<div class="mp-tip-lbl">🔥 ' + esc(t('mp_tip_chaka','Tip Chaka')) + '</div>' +
        '<div class="mp-tip-txt">' + t(tipKey, '') + '</div>' +
      '</div>';
  }

  // ── Plugin helpers exposed to category modules ──────────────────
  window.MP_HELPERS = {
    t: t,
    esc: esc,
    exampleTip: exampleTip,
    renderCalcShell: renderCalcShell,
    state: state,
    getCatLabel: getCatLabel,
    currentLang: currentLang
  };

  // ── Calc dispatch ───────────────────────────────────────────────
  function renderCalcById(id) {
    if (id === 'fractions')   return renderFractions();
    if (id === 'pythagorean') return renderPythagorean();
    if (id === 'deltaT')      return renderDeltaT();
    // Plugin calculators registered by category modules (mp-calcs/*.js)
    if (window.MP_CALCS && window.MP_CALCS[id] && typeof window.MP_CALCS[id].render === 'function') {
      var tool2 = TOOLS.filter(function(tt){ return tt.id === id; })[0];
      if (!tool2) return '<div class="mp-empty">Tool not found.</div>';
      var body = window.MP_CALCS[id].render(state, window.MP_HELPERS);
      return renderCalcShell(id, null, null, tool2.icon, body, getName(tool2), getDesc(tool2));
    }
    var tool = TOOLS.filter(function(tt){ return tt.id === id; })[0];
    if (!tool) return '<div class="mp-empty">Tool not found.</div>';
    return renderComingSoon(tool);
  }

  // Dynamically flip tool.impl when a plugin registers
  function syncImplFromPlugins() {
    if (!window.MP_CALCS) return;
    for (var i = 0; i < TOOLS.length; i++) {
      if (window.MP_CALCS[TOOLS[i].id]) TOOLS[i].impl = true;
    }
  }
  // Register any i18n exposed by plugins
  function registerPluginI18n() {
    if (!window.MP_CALCS || typeof window._addTranslations !== 'function') return;
    for (var id in window.MP_CALCS) {
      if (window.MP_CALCS[id] && window.MP_CALCS[id].i18n) {
        try { window._addTranslations(window.MP_CALCS[id].i18n); } catch(_e) {}
      }
    }
  }

  // ── Main render ─────────────────────────────────────────────────
  function render() {
    var root = document.getElementById('maestroProScreen');
    if (!root) return;
    var inner = root.querySelector('.mp-root');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'mp-root';
      root.appendChild(inner);
    }
    inner.innerHTML = (state.view === 'home') ? renderHome() : renderCalcById(state.currentTool);

    if (typeof window._translateDOM === 'function') {
      try { window._translateDOM(inner); } catch(_e) {}
    }
    bindInner(inner);
  }

  // ── Event binding ───────────────────────────────────────────────
  function bindInner(root) {
    // Back button
    var backs = root.querySelectorAll('[data-act="back"]');
    for (var i = 0; i < backs.length; i++) {
      backs[i].addEventListener('click', handleBack);
    }
    // Tool cards
    var tools = root.querySelectorAll('[data-tool]');
    for (var j = 0; j < tools.length; j++) {
      tools[j].addEventListener('click', onToolClick);
    }
    // Tabs
    var tabs = root.querySelectorAll('[data-tab]');
    for (var k = 0; k < tabs.length; k++) {
      tabs[k].addEventListener('click', onTabClick);
    }
    // Search
    var search = root.querySelector('[data-act="search"]');
    if (search) {
      search.addEventListener('input', onSearch);
    }
    // Inputs
    var inputs = root.querySelectorAll('[data-in]');
    for (var m = 0; m < inputs.length; m++) {
      inputs[m].addEventListener('input', onInputChange);
    }
  }

  function onToolClick(e) {
    var id = e.currentTarget.getAttribute('data-tool');
    if (!id) return;
    state.currentTool = id;
    state.view = 'calc';
    render();
    scrollTop();
  }

  function onTabClick(e) {
    var cat = e.currentTarget.getAttribute('data-tab');
    if (!cat) return;
    state.activeCat = cat;
    render();
  }

  function onSearch(e) {
    state.searchQuery = e.target.value || '';
    // Only re-render the content area to preserve focus on the search input
    var sel = document.activeElement;
    var cursor = (sel && sel.tagName === 'INPUT') ? sel.selectionStart : null;
    render();
    // Restore focus
    var newSearch = document.querySelector('#maestroProScreen [data-act="search"]');
    if (newSearch) {
      newSearch.focus();
      if (cursor != null) {
        try { newSearch.setSelectionRange(cursor, cursor); } catch(_e) {}
      }
    }
  }

  function onInputChange(e) {
    var path = e.currentTarget.getAttribute('data-in');
    if (!path) return;
    var parts = path.split('.');
    if (parts.length !== 2) return;
    var toolKey = parts[0], field = parts[1];
    if (!state.inputs[toolKey]) state.inputs[toolKey] = {};
    state.inputs[toolKey][field] = e.target.value;
    // Re-render calc view (preserve focus on this input)
    var activeName = e.currentTarget.getAttribute('data-in');
    var cursor = e.target.selectionStart;
    render();
    var newInput = document.querySelector('#maestroProScreen [data-in="' + activeName + '"]');
    if (newInput) {
      newInput.focus();
      if (cursor != null && newInput.type !== 'number') {
        try { newInput.setSelectionRange(cursor, cursor); } catch(_e) {}
      }
    }
  }

  function handleBack() {
    if (state.view === 'calc') {
      state.view = 'home';
      state.currentTool = null;
      render();
      scrollTop();
    } else if (typeof window.showScreen === 'function') {
      window.showScreen('dashboardScreen');
    } else if (typeof window.goBack === 'function') {
      window.goBack();
    }
  }

  function scrollTop() {
    try {
      var root = document.getElementById('maestroProScreen');
      if (root) root.scrollTop = 0;
      window.scrollTo(0, 0);
    } catch(_e) {}
  }

  // ── Init ───────────────────────────────────────────────────────
  window.initMaestroPro = function() {
    _regI18n();
    registerPluginI18n();
    syncImplFromPlugins();
    injectStyles();
    // Reset to home each time it opens
    state.view = 'home';
    state.currentTool = null;
    state.activeCat = 'all';
    state.searchQuery = '';
    render();
    scrollTop();
  };

})();
