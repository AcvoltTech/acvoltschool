// Maestro Pro · NEC / Normativa calculators
(function(){
  'use strict';
  window.MP_CALCS = window.MP_CALCS || {};
  var h = function(){ return window.MP_HELPERS || {}; };
  function esc(s){ var H=h(); return H.esc?H.esc(s):String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(k,fb){ var H=h(); return H.t?H.t(k,fb):(fb||k); }
  function exampleTip(caseKey,tipKey){ var H=h(); return H.exampleTip?H.exampleTip(caseKey,tipKey):''; }
  function lang(){ var H=h(); return (H.currentLang==='function'?H.currentLang():H.currentLang)||'es'; }
  function pick(obj){ var L=lang(); return obj && (obj[L]||obj.es||obj.en||'') || ''; }

  // ───────────────────────────────────────────────────────────────
  // NEC Article Index (for finder) — 45+ HVAC/electrical entries
  // ───────────────────────────────────────────────────────────────
  var NEC_INDEX = [
    { art:'110.14',  title:{es:'Conexiones eléctricas (par de torque)',en:'Electrical connections (torque)'},     sum:{es:'Pares de torque obligatorios en terminales; usar valores del fabricante o tabla 110.14(D).',en:'Mandatory torque values at terminations; follow manufacturer or Table 110.14(D).'},                                    kw:'torque,terminations,lugs,conexiones,par,apriete' },
    { art:'110.16',  title:{es:'Advertencia de arco eléctrico (arc-flash)',en:'Arc-flash hazard warning label'},  sum:{es:'Etiqueta permanente de peligro arc-flash requerida en equipos comerciales/industriales.',en:'Permanent arc-flash hazard label required on commercial/industrial equipment.'},                                   kw:'arc flash,arco,etiqueta,label,warning,advertencia' },
    { art:'110.26',  title:{es:'Espacios de trabajo alrededor de equipos',en:'Working space about equipment'},    sum:{es:'Profundidad, ancho (30" o equipo) y altura (6.5 ft / 2023: hasta 2023 top).',en:'Depth, 30"/equipment width, 6.5 ft headroom (2023 changes).'},                                                                kw:'working space,clearance,espacio,trabajo,110.26' },
    { art:'210.8',   title:{es:'GFCI — personal',en:'GFCI — personnel protection'},                               sum:{es:'Requisitos GFCI para receptáculos exteriores, baños, HVAC en techo, equipo mecánico.',en:'GFCI required outdoors, bathrooms, rooftop HVAC, mechanical equipment.'},                                               kw:'GFCI,ground fault,falla tierra,rooftop,mechanical,techo' },
    { art:'210.12',  title:{es:'AFCI — protección contra arcos',en:'AFCI — arc-fault protection'},                sum:{es:'AFCI requerido en áreas residenciales; expansión en 2023/2026.',en:'AFCI required in dwelling areas; expanded in 2023/2026.'},                                                                                 kw:'AFCI,arc fault,arco,residencial,dwelling' },
    { art:'210.52',  title:{es:'Receptáculos en viviendas',en:'Dwelling receptacle outlets'},                     sum:{es:'Espaciamiento de tomas en hogares; cocina, baño, lavadero.',en:'Spacing of receptacles in dwellings; kitchen, bath, laundry.'},                                                                                 kw:'receptacle,receptáculo,outlet,tomacorriente,dwelling' },
    { art:'210.63',  title:{es:'Receptáculo de servicio para HVAC',en:'Service receptacle for HVAC equipment'},    sum:{es:'Receptáculo 125V 15/20A a 25 ft del equipo HVAC en techo, ático o crawlspace.',en:'125V 15/20A receptacle within 25 ft of HVAC on rooftops, attics, crawlspaces.'},                                             kw:'service receptacle,HVAC,rooftop,techo,25ft,attic' },
    { art:'210.70',  title:{es:'Iluminación — requisitos',en:'Lighting outlet requirements'},                     sum:{es:'Luminarias requeridas en áreas habitables y mecánicas.',en:'Required lighting outlets in habitable and mechanical spaces.'},                                                                                  kw:'lighting,iluminación,light outlet' },
    { art:'215.2',   title:{es:'Ampacidad mínima de alimentador',en:'Minimum feeder ampacity'},                   sum:{es:'Cálculo de ampacidad para alimentadores generales.',en:'Feeder ampacity sizing rules.'},                                                                                                                        kw:'feeder,alimentador,ampacity,ampacidad' },
    { art:'220.82',  title:{es:'Cálculo de carga dwelling (opcional)',en:'Dwelling optional load calc'},          sum:{es:'Método opcional para calcular demanda total residencial.',en:'Optional calculation for total residential demand.'},                                                                                             kw:'load calc,cálculo,carga,dwelling,residencial' },
    { art:'230.67',  title:{es:'Protección contra sobretensión (SPD)',en:'Surge-protective device (SPD)'},        sum:{es:'SPD Tipo 1/2 obligatorio en servicios dwelling desde NEC 2020; re-enfatizado 2023.',en:'Type 1/2 SPD required at dwelling services since 2020; reinforced 2023.'},                                                  kw:'SPD,surge,sobretensión,transient,Tipo 1,Type 2' },
    { art:'230.85',  title:{es:'Desconexión de emergencia (dwelling)',en:'Emergency disconnect'},                  sum:{es:'Desconexión accesible al exterior para primer-respondedores; expansión en 2023.',en:'Outside-accessible emergency disconnect; expanded 2023.'},                                                                  kw:'emergency,disconnect,emergencia,desconexión,service' },
    { art:'240.4',   title:{es:'Protección contra sobrecorriente de conductores',en:'Conductor overcurrent prot.'}, sum:{es:'Ampacidad vs. OCPD; regla de redondeo y tap.',en:'Ampacity vs. OCPD sizing; round-up and tap rules.'},                                                                                                         kw:'overcurrent,OCPD,breaker,tap,sobrecorriente,240.4' },
    { art:'240.6',   title:{es:'Valores estándar de breakers y fusibles',en:'Std breaker/fuse ratings'},          sum:{es:'Lista de amperajes estándar 15–6000A.',en:'Standard 15–6000A rating ladder.'},                                                                                                                                kw:'breaker,fuse,standard,ratings,amperaje' },
    { art:'250.66',  title:{es:'GEC — tamaño',en:'Grounding electrode conductor size'},                           sum:{es:'Tabla 250.66 para tamaño del GEC según conductor de servicio.',en:'Table 250.66 GEC sizing by service conductor.'},                                                                                              kw:'GEC,grounding,electrode,tierra,aterrizaje,250.66' },
    { art:'250.102', title:{es:'Jumpers equipotenciales',en:'Bonding jumpers'},                                   sum:{es:'Tamaño y uso de bonding jumpers principales y del equipo.',en:'Main and equipment bonding jumper sizing.'},                                                                                                      kw:'bonding,jumper,equipotencial,enlace' },
    { art:'250.122', title:{es:'Tamaño mínimo del EGC',en:'Min equipment grounding conductor size'},              sum:{es:'Tabla 250.122 según OCPD del circuito.',en:'Table 250.122 sized by circuit OCPD.'},                                                                                                                              kw:'grounding,EGC,aterrizaje,tierra,250.122' },
    { art:'300.5',   title:{es:'Profundidad de canalizaciones enterradas',en:'Underground raceway cover depth'},    sum:{es:'Tabla 300.5 — profundidad mínima según tipo y tensión.',en:'Table 300.5 min cover by method and voltage.'},                                                                                                    kw:'underground,enterrado,depth,profundidad,cover' },
    { art:'300.11',  title:{es:'Soporte de cables y canalizaciones',en:'Securing and supporting'},                 sum:{es:'Soportes cada X pies según método; no colgar de ducto HVAC.',en:'Support spacing by method; do not hang from HVAC duct.'},                                                                                    kw:'support,soporte,strap,duct,colgar' },
    { art:'310.16',  title:{es:'Ampacidad de conductores (tabla)',en:'Conductor ampacity table'},                  sum:{es:'Tabla 310.16 ampacidad por tipo de aislamiento.',en:'Table 310.16 ampacity by insulation type.'},                                                                                                               kw:'ampacity,310.16,conductor,THHN,XHHW,cable' },
    { art:'310.15',  title:{es:'Ajustes por temperatura/agrupamiento',en:'Ampacity adjustments'},                 sum:{es:'Factores por temperatura ambiente y >3 conductores portadores.',en:'Ambient temp and >3 current-carrying conductor adjustment factors.'},                                                                       kw:'adjustment,ajuste,ambient,temperature,conductors,derate' },
    { art:'312.2',   title:{es:'Gabinetes exteriores — condensación',en:'Outdoor enclosures — damp/wet'},         sum:{es:'NEMA 3R mínimo afuera; sellar entradas.',en:'NEMA 3R minimum outdoors; seal entries.'},                                                                                                                          kw:'enclosure,outdoor,NEMA 3R,gabinete,exterior' },
    { art:'314.16',  title:{es:'Llenado de caja (box fill)',en:'Box fill calculation'},                           sum:{es:'Cálculo volumétrico de conductores, devices y clamps.',en:'Volumetric fill for conductors, devices, clamps.'},                                                                                                  kw:'box fill,caja,llenado,314.16,volume' },
    { art:'334.10',  title:{es:'Usos permitidos de NM cable (Romex)',en:'NM cable permitted uses'},                sum:{es:'Cable NM sólo en ciertos tipos de construcción; no expuesto al clima.',en:'NM only in certain construction types; not in wet.'},                                                                                kw:'NM,Romex,nonmetallic,cable' },
    { art:'344',     title:{es:'Conduit rígido de metal (RMC)',en:'Rigid Metal Conduit'},                         sum:{es:'Instalación, dobleces, soportes para RMC.',en:'Install, bend, and support rules for RMC.'},                                                                                                                      kw:'RMC,rigid,conduit,metal' },
    { art:'358',     title:{es:'EMT (Electrical Metallic Tubing)',en:'Electrical Metallic Tubing'},                sum:{es:'Instalación EMT; soportes ≤10 ft; no permitido en atmósferas corrosivas sin protección.',en:'EMT install; supports ≤10 ft; not in corrosive areas w/o coating.'},                                                kw:'EMT,conduit,tubing,metal,358' },
    { art:'356',     title:{es:'LFNC (conduit no-metálico flexible)',en:'LFNC flexible nonmetallic'},              sum:{es:'Conduit flexible líquido-tight para conexión final al equipo HVAC.',en:'Liquid-tight flexible conduit for HVAC final whip.'},                                                                                    kw:'LFNC,liquid tight,flexible,whip,HVAC' },
    { art:'400.7',   title:{es:'Usos permitidos de cables flexibles',en:'Flexible cord permitted uses'},           sum:{es:'Dónde se permite uso de cable flexible / whip.',en:'Where flexible cords are allowed.'},                                                                                                                          kw:'cord,flexible,whip,cable' },
    { art:'404',     title:{es:'Interruptores (switches)',en:'Switches'},                                          sum:{es:'Reglas para switches de pared, snap, motor control.',en:'Wall, snap, and motor-control switch rules.'},                                                                                                           kw:'switch,interruptor,snap,wall' },
    { art:'406',     title:{es:'Receptáculos y tapas',en:'Receptacles and cord connectors'},                      sum:{es:'TR, WR, USB; requisitos de tapas in-use.',en:'TR, WR, USB; in-use covers required.'},                                                                                                                           kw:'receptacle,cover,TR,WR,tamper,weather' },
    { art:'408.4',   title:{es:'Directorio de circuitos en panel',en:'Panelboard circuit directory'},              sum:{es:'Directorio legible y específico en la puerta del panel.',en:'Legible, specific panel directory.'},                                                                                                                kw:'panel,directory,panelboard,directorio' },
    { art:'422.12',  title:{es:'Dedicado para equipos centrales de calefacción',en:'Central heating dedicated circuit'}, sum:{es:'Circuito individual para equipo central de calefacción; sólo accesorios permitidos.',en:'Individual branch circuit for central heating; only listed accessories permitted.'},                       kw:'heating,dedicated,furnace,422.12,calefacción' },
    { art:'422.31',  title:{es:'Desconexión de electrodomésticos',en:'Appliance disconnect'},                      sum:{es:'Desconexión visible o breaker con lockout para electrodomésticos permanentes.',en:'Within-sight disconnect or lockable OCPD for permanent appliances.'},                                                        kw:'disconnect,appliance,desconexión,lockout' },
    { art:'424.19',  title:{es:'Desconexión de equipos de calefacción fija',en:'Fixed-heating disconnecting means'}, sum:{es:'Desconexión a la vista del equipo y sus controles.',en:'Disconnect within sight of heating equipment and controls.'},                                                                                         kw:'heating,disconnect,fixed,electric heat' },
    { art:'430.22',  title:{es:'Ampacidad del conductor del motor (125%)',en:'Motor conductor ampacity (125%)'},   sum:{es:'Conductor del motor = 125% de la FLC a plena carga.',en:'Motor branch conductor = 125% of motor FLC.'},                                                                                                          kw:'motor,125%,FLC,ampacity,conductor' },
    { art:'430.32',  title:{es:'Protección contra sobrecarga del motor',en:'Motor overload protection'},          sum:{es:'115%/125% del FLA según factor de servicio.',en:'115%/125% of FLA based on service factor.'},                                                                                                                    kw:'motor,overload,sobrecarga,430.32,SF' },
    { art:'430.52',  title:{es:'Protección de cortocircuito del motor',en:'Motor branch-circuit SC protection'},   sum:{es:'Tabla 430.52 para OCPD (inverse-time/instantáneo/dual).',en:'Table 430.52 for OCPD sizing (inverse-time/instant/dual).'},                                                                                         kw:'motor,short circuit,OCPD,breaker,430.52' },
    { art:'430.102', title:{es:'Desconexión del motor a la vista',en:'Motor disconnect within sight'},            sum:{es:'Desconexión del controlador y del motor a la vista (≤50 ft).',en:'Disconnect within sight of controller and motor (≤50 ft).'},                                                                                    kw:'motor,disconnect,within sight,vista,430.102' },
    { art:'430.110', title:{es:'Capacidad amp mínima de desconexión del motor',en:'Motor disconnect min ampere'},  sum:{es:'Desconexión = 115% del FLC del motor.',en:'Disconnect rated ≥115% of motor FLC.'},                                                                                                                               kw:'motor,disconnect,ampere,430.110' },
    { art:'430.250', title:{es:'FLC motor trifásico (tabla)',en:'3-phase motor FLC table'},                       sum:{es:'Tabla FLC para motores trifásicos 1/2–500 HP.',en:'FLC table for 3-phase motors ½–500 HP.'},                                                                                                                      kw:'motor,FLC,trifásico,3-phase,table,430.250' },
    { art:'430.248', title:{es:'FLC motor monofásico',en:'Single-phase motor FLC'},                                sum:{es:'Tabla FLC para motores 115/230 V monofásicos.',en:'FLC table for 115/230 V 1-phase motors.'},                                                                                                                    kw:'motor,FLC,monofásico,single phase,115V,230V' },
    { art:'440.14',  title:{es:'Desconexión de A/C y refrigeración',en:'A/C and refrigeration disconnect'},        sum:{es:'Desconexión a la vista y accesible del equipo HACR.',en:'Within-sight, readily accessible HACR disconnect.'},                                                                                                    kw:'AC,disconnect,HACR,condensing,refrigeration,440.14' },
    { art:'440.22',  title:{es:'MOCP / MCA en equipo HACR',en:'MOCP / MCA for HACR'},                              sum:{es:'Máximo OCPD = MOCP de la placa; conductor mínimo = MCA.',en:'Max OCPD = MOCP on nameplate; min conductor = MCA.'},                                                                                                kw:'MOCP,MCA,HACR,condensing,nameplate,440.22' },
    { art:'440.32',  title:{es:'Ampacidad del conductor hermético',en:'Hermetic motor conductor ampacity'},        sum:{es:'125% del RLA del compresor hermético.',en:'125% of hermetic compressor RLA.'},                                                                                                                                  kw:'hermetic,compressor,RLA,125%,440.32' },
    { art:'450.3',   title:{es:'Protección del transformador',en:'Transformer overcurrent protection'},            sum:{es:'Tabla 450.3(B) — protección primaria/secundaria.',en:'Table 450.3(B) primary/secondary protection.'},                                                                                                             kw:'transformer,transformador,OCPD,450.3,primary,secondary' },
    { art:'450.21',  title:{es:'Transformadores interiores',en:'Indoor dry transformers'},                        sum:{es:'Separación y ventilación para transformadores interiores.',en:'Clearance and ventilation for indoor dry transformers.'},                                                                                           kw:'transformer,indoor,dry,ventilation' },
    { art:'460',     title:{es:'Capacitores',en:'Capacitors'},                                                    sum:{es:'Capacitores de corrección PF; descarga en 60s.',en:'PF-correction capacitors; discharge in 60s.'},                                                                                                                kw:'capacitor,power factor,PF,discharge' },
    { art:'480',     title:{es:'Baterías estacionarias',en:'Stationary storage batteries'},                        sum:{es:'UPS y backup; ventilación y separación.',en:'UPS and backup; ventilation and clearance.'},                                                                                                                       kw:'battery,UPS,backup,storage' },
    { art:'625',     title:{es:'Cargadores de vehículos eléctricos (EVSE)',en:'Electric vehicle charging (EVSE)'}, sum:{es:'EVSE nivel 1/2/3; 240.85, 625.40 — circuito dedicado.',en:'EVSE level 1/2/3; 625.40 dedicated branch circuit.'},                                                                                                   kw:'EV,EVSE,charger,cargador,625,vehículo' },
    { art:'645',     title:{es:'Centros de datos (IT rooms)',en:'IT equipment rooms'},                            sum:{es:'Salas de TI y sus desconexiones dedicadas.',en:'IT rooms and dedicated disconnects.'},                                                                                                                           kw:'data center,IT,645,computer' },
    { art:'670',     title:{es:'Maquinaria industrial (NFPA 79)',en:'Industrial machinery (NFPA 79)'},             sum:{es:'Placa de datos; coordinación con NFPA 79.',en:'Nameplate data; coordinate with NFPA 79.'},                                                                                                                       kw:'industrial machinery,NFPA 79,670' },
    { art:'690',     title:{es:'Sistemas fotovoltaicos',en:'Photovoltaic systems'},                               sum:{es:'PV rapid shutdown (690.12); límites de tensión DC.',en:'PV rapid shutdown (690.12); DC voltage limits.'},                                                                                                         kw:'PV,solar,rapid shutdown,fotovoltaico,690' },
    { art:'700',     title:{es:'Sistemas de emergencia',en:'Emergency systems'},                                   sum:{es:'Alimentación de emergencia para cargas life-safety.',en:'Emergency power for life-safety loads.'},                                                                                                                 kw:'emergency,generator,life safety,emergencia' }
  ];

  // ───────────────────────────────────────────────────────────────
  // 2023 → 2026 NEC Changes (HVAC-relevant)
  // ───────────────────────────────────────────────────────────────
  var NEC_CHANGES = [
    { art:'210.8',   cat:{es:'GFCI',en:'GFCI'},               what:{es:'Expansión GFCI a más receptáculos de cocina comercial y laundry; circuitos 240V ≤60A de equipo específico.',en:'GFCI expanded to more commercial-kitchen, laundry receptacles; 240V ≤60A specific-equipment circuits.'}, impact:{es:'Mini-splits 240V, bombas, y mini-fridges comerciales ahora requieren GFCI.',en:'240V mini-splits, pumps, and commercial mini-fridges now need GFCI.'} },
    { art:'210.12',  cat:{es:'AFCI',en:'AFCI'},               what:{es:'AFCI extendido a circuitos dwelling previamente exentos; combinación con GFCI (DFCI) promovida.',en:'AFCI extended to dwelling circuits previously exempt; DFCI (combo AFCI+GFCI) encouraged.'}, impact:{es:'Furnace y mini-split residencial en áreas habitables ahora requieren AFCI.',en:'Residential furnaces and mini-splits in habitable spaces now need AFCI.'} },
    { art:'210.63',  cat:{es:'HVAC service outlet',en:'HVAC service outlet'}, what:{es:'Confirmación de GFCI para receptáculo de servicio HVAC; distancia de 25 ft mantenida.',en:'Confirms GFCI for HVAC service receptacle; keeps 25 ft rule.'}, impact:{es:'Todos los receptáculos de servicio en techo/ático/crawl → GFCI obligatorio.',en:'All rooftop/attic/crawl service receptacles → GFCI required.'} },
    { art:'230.85',  cat:{es:'Emergency disconnect',en:'Emergency disconnect'}, what:{es:'Emergency disconnect también en dúplex, town-homes y estructuras accesorias; etiqueta "EMERGENCY DISCONNECT" estandarizada.',en:'Emergency disconnect extended to duplex, town-homes, accessory structures; standardized label.'}, impact:{es:'Cambios de service + HVAC en estas estructuras requieren disco exterior rotulado.',en:'Service/HVAC changes on these structures need labeled outdoor disco.'} },
    { art:'230.67',  cat:{es:'SPD',en:'SPD'},                what:{es:'SPD Tipo 1/2 obligatorio también en reemplazo de servicio dwelling y algunos paneles critical-ops.',en:'Type 1/2 SPD now required at dwelling service replacements and some critical-ops panels.'}, impact:{es:'Cada cambio de panel dwelling lleva un SPD ahora.',en:'Every dwelling panel swap gets an SPD now.'} },
    { art:'240.67',  cat:{es:'Arc energy reduction',en:'Arc energy reduction'}, what:{es:'Sistemas ≥1200A requieren reducción de energía de arco (ARS) documentada.',en:'Systems ≥1200A require documented arc-energy reduction.'}, impact:{es:'Service de edificios comerciales → estudio ARS por ingeniero.',en:'Commercial building services → engineered ARS study.'} },
    { art:'250.114', cat:{es:'Cord-and-plug grounding',en:'Cord-and-plug grounding'}, what:{es:'Ampliación de equipos que deben tener aterrizaje por cordón.',en:'More cord-and-plug equipment required to be grounded.'}, impact:{es:'Mini-splits portátiles y window-units comerciales → enchufe aterrizado.',en:'Portable mini-splits and commercial window units → grounded plug.'} },
    { art:'406.9',   cat:{es:'Wet-location receptacles',en:'Wet-location receptacles'}, what:{es:'Cubiertas "in-use" extra-duty obligatorias en más ubicaciones exteriores.',en:'Extra-duty "in-use" covers required in more outdoor locations.'}, impact:{es:'Receptáculos cerca de condensing units → in-use cover obligatorio.',en:'Receptacles near condensing units → in-use cover required.'} },
    { art:'440.11',  cat:{es:'A2L refrigerant',en:'A2L refrigerant'}, what:{es:'Reglas de ignición para equipo con refrigerante A2L — alambrado y terminaciones cerradas sin chispas.',en:'Ignition rules for A2L-refrigerant equipment — spark-free wiring / terminations.'}, impact:{es:'R-454B/R-32 — sellar terminales, usar dispositivos listados sin chispa.',en:'R-454B/R-32 — seal terminals, use listed spark-free devices.'} },
    { art:'625.40',  cat:{es:'EV chargers',en:'EV chargers'},  what:{es:'EVSE requiere circuito dedicado; panel EV con provisión de espacio futuro.',en:'EVSE requires dedicated branch circuit; EV-ready panel provisions.'}, impact:{es:'Nuevas casas → panel listo para EV (ampere y espacio).',en:'New homes → EV-ready panel (ampere and space).'} },
    { art:'210.52(C)', cat:{es:'240V kitchen',en:'240V kitchen'}, what:{es:'Receptáculo 240V requerido para cocinas eléctricas en nuevas construcciones dwelling.',en:'240V range receptacle required for electric-ready new dwellings.'}, impact:{es:'Electrificación — coordinar panel y carga con HVAC eléctrico.',en:'Electrification — coordinate panel/load with electric HVAC.'} },
    { art:'110.26',  cat:{es:'Working space',en:'Working space'}, what:{es:'Altura mínima de headroom reforzada a 6.5 ft ó altura del equipo (la mayor); 2023 aclara equipos grandes.',en:'Headroom reinforced to 6.5 ft or equipment height (greater); 2023 clarifies large equipment.'}, impact:{es:'Roof-top units altos necesitan más claro arriba del panel de control.',en:'Tall RTUs need more clearance above control panel.'} },
    { art:'445',     cat:{es:'Generators',en:'Generators'}, what:{es:'Generadores residenciales de respaldo: requisitos de etiquetado y anti-backfeed reforzados.',en:'Residential standby generators: labeling and anti-backfeed rules strengthened.'}, impact:{es:'Instalaciones con generadores + HVAC dual-fuel → interlock obligatorio.',en:'Generator + dual-fuel HVAC installs → interlock required.'} },
    { art:'690.12',  cat:{es:'PV rapid shutdown',en:'PV rapid shutdown'}, what:{es:'Rapid-shutdown aplicado a sistemas PV-HVAC híbridos para seguridad de bomberos.',en:'Rapid-shutdown extended to hybrid PV-HVAC systems for firefighter safety.'}, impact:{es:'Solar heat pumps → rapid-shutdown a nivel de módulo.',en:'Solar heat pumps → module-level rapid shutdown.'} },
    { art:'422.16',  cat:{es:'Range hood / HVAC cord',en:'Range hood / HVAC cord'}, what:{es:'Uso permitido de cordón ampliado para range hoods y ciertos equipos HVAC listados.',en:'Cord-and-plug use expanded for range hoods and certain listed HVAC equipment.'}, impact:{es:'Más instalaciones con cordón flexible listadas por UL.',en:'More UL-listed cord-and-plug HVAC installs.'} }
  ];

  // ───────────────────────────────────────────────────────────────
  // EPA 608 Certification types
  // ───────────────────────────────────────────────────────────────
  var EPA_TYPES = {
    small:    { type:'I',  name:{es:'Tipo I — Pequeños electrodomésticos',en:'Type I — Small appliances'},    covers:{es:'Equipos sellados en fábrica con <5 lb de refrigerante: refrigeradores domésticos, congeladores, A/C de ventana, deshumidificadores.',en:'Factory-sealed <5 lb refrigerant: household fridges, freezers, window A/Cs, dehumidifiers.'} },
    high:     { type:'II', name:{es:'Tipo II — Alta presión',en:'Type II — High pressure'},                   covers:{es:'Sistemas de alta presión: split residencial/comercial, heat pumps, supermercados, refrigeración comercial. La mayoría del HVAC residencial cae aquí.',en:'High-pressure systems: residential/commercial split, heat pumps, supermarket, commercial refrigeration. Most residential HVAC.'} },
    low:      { type:'III',name:{es:'Tipo III — Baja presión',en:'Type III — Low pressure'},                  covers:{es:'Chillers de baja presión (R-11, R-123): enfriadoras centrífugas grandes.',en:'Low-pressure chillers (R-11, R-123): large centrifugal chillers.'} },
    universal:{ type:'U',  name:{es:'Universal — Cubre todos los tipos',en:'Universal — Covers all'},          covers:{es:'Combina Tipo I + II + III. Requerido si se trabaja en diversos tipos de equipo.',en:'Combines Type I + II + III. Required for mixed equipment work.'} }
  };

  // ───────────────────────────────────────────────────────────────
  // A2L Refrigerant data (IEC 60335-2-40 RCL / LFL)
  // ───────────────────────────────────────────────────────────────
  // LFL in kg/m3, RCL (Refrigerant Concentration Limit) in kg/m3
  var A2L_REFRIG = {
    'R-32':     { name:'R-32',     lfl:0.307, rcl:0.061, a:1.6, gwp:675,   type:'A2L' },
    'R-454B':   { name:'R-454B',   lfl:0.295, rcl:0.058, a:1.6, gwp:466,   type:'A2L' },
    'R-1234yf': { name:'R-1234yf', lfl:0.289, rcl:0.058, a:1.6, gwp:4,     type:'A2L' },
    'R-1234ze': { name:'R-1234ze', lfl:0.303, rcl:0.061, a:1.6, gwp:7,     type:'A2L' },
    'R-452B':   { name:'R-452B',   lfl:0.294, rcl:0.059, a:1.6, gwp:698,   type:'A2L' }
  };

  // ───────────────────────────────────────────────────────────────
  // 110.26 Working Clearance table (feet)
  // ───────────────────────────────────────────────────────────────
  // Voltage ranges × Condition 1/2/3
  var CLR_TABLE = {
    '0-150':   { 1:3.0, 2:3.0, 3:3.0 },
    '151-600': { 1:3.0, 2:3.5, 3:4.0 },
    '601-1000':{ 1:3.0, 2:4.0, 3:5.0 }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 1: NEC Article Finder
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['necFinder'] = {
    i18n: {
      mp_nf_title:       { es:'Buscador de artículos NEC',           en:'NEC Article Finder' },
      mp_nf_sub:         { es:'45+ artículos HVAC/eléctrico indexados', en:'45+ HVAC/electrical articles indexed' },
      mp_nf_search_lbl:  { es:'Buscar por palabra clave o número',   en:'Search keyword or article #' },
      mp_nf_search_ph:   { es:'ej: motor FLC, GFCI, 110.26, A2L…',   en:'e.g. motor FLC, GFCI, 110.26, A2L…' },
      mp_nf_results_lbl: { es:'Resultados',                           en:'Results' },
      mp_nf_no_match:    { es:'Sin coincidencias — prueba otra palabra clave.', en:'No matches — try another keyword.' },
      mp_nf_showing:     { es:'Mostrando',                            en:'Showing' },
      mp_nf_of:          { es:'de',                                   en:'of' },
      mp_nf_articles:    { es:'artículos',                            en:'articles' },
      mp_nf_hint:        { es:'Consejo: NEC 2023 es la edición de referencia; 2026 aún se publica por estado.', en:'Tip: NEC 2023 is the reference edition; 2026 adoption varies by state.' },
      mp_nf_case:        { es:'Técnico busca "qué código cubre disconnect de AC en techo"; escribe "AC disconnect" y el buscador muestra 440.14 con resumen y alcance.', en:'Tech searches "what code covers rooftop AC disconnect"; types "AC disconnect" → finder shows 440.14 with summary and scope.' },
      mp_nf_tip:         { es:'Antes de citar un artículo al inspector, abre el NEC físico o la app NFPA LiNK para confirmar el texto literal — aquí damos el índice, no el texto.', en:'Before citing an article to the inspector, open the physical NEC or NFPA LiNK app to confirm verbatim text — this is an index, not the text.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.necFinder) || {};
      var q = (s.q || '').toString().toLowerCase().trim();
      var matches = NEC_INDEX.filter(function(r){
        if (!q) return true;
        if (r.art.toLowerCase().indexOf(q) >= 0) return true;
        if (r.kw.toLowerCase().indexOf(q) >= 0) return true;
        if (pick(r.title).toLowerCase().indexOf(q) >= 0) return true;
        if (pick(r.sum).toLowerCase().indexOf(q) >= 0) return true;
        return false;
      });
      var shown = matches.slice(0, 25);

      var list = '';
      if (matches.length === 0) {
        list = '<div class="mp-res-desc" style="color:#111 !important;font-weight:600;">' + esc(t('mp_nf_no_match','Sin coincidencias.')) + '</div>';
      } else {
        list = shown.map(function(r){
          return '<div style="padding:10px 12px;margin:6px 0;background:#fff;border-left:3px solid #0EA5E9;border-radius:6px;">' +
            '<div style="display:flex;align-items:baseline;gap:8px;">' +
              '<span style="font-weight:700;color:#0369A1;font-size:14px;">NEC ' + esc(r.art) + '</span>' +
              '<span style="font-weight:600;color:#111;font-size:13px;">' + esc(pick(r.title)) + '</span>' +
            '</div>' +
            '<div style="font-size:12.5px;color:#111;line-height:1.45;margin-top:4px;">' + esc(pick(r.sum)) + '</div>' +
          '</div>';
        }).join('');
      }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'necFinder', 'mp_nf_title', 'mp_nf_sub', '§',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_nf_search_lbl','Buscar')) + '</span><span class="mp-unit">keyword / #</span></div>' +
            '<input type="text" class="mp-in" data-in="necFinder.q" value="' + esc(s.q || '') + '" placeholder="' + esc(t('mp_nf_search_ph','motor FLC, GFCI, 110.26…')) + '" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_nf_results_lbl','Resultados')) + '</div>' +
          '<div class="mp-res-main">' + shown.length + '<span class="mp-res-unit">/ ' + NEC_INDEX.length + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_nf_showing','Mostrando')) + ' ' + shown.length + ' ' + esc(t('mp_nf_of','de')) + ' ' + matches.length + ' ' + esc(t('mp_nf_articles','artículos')) + '.</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_nf_results_lbl','Resultados')) + '</div>' +
          list +
          '<div style="margin-top:10px;font-size:12px;color:#111;">' + esc(t('mp_nf_hint','')) + '</div>' +
        '</div>' +
        exampleTip('mp_nf_case','mp_nf_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 2: NEC 2023 → 2026 Key Changes
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['nec23to26'] = {
    i18n: {
      mp_c26_title:   { es:'NEC 2023 → 2026 · Cambios clave',        en:'NEC 2023 → 2026 · Key changes' },
      mp_c26_sub:     { es:'15 cambios con impacto HVAC',            en:'15 HVAC-impact changes' },
      mp_c26_filter:  { es:'Filtrar por categoría',                  en:'Filter by category' },
      mp_c26_all:     { es:'Todos',                                  en:'All' },
      mp_c26_count:   { es:'Cambios mostrados',                      en:'Changes shown' },
      mp_c26_what:    { es:'Qué cambió',                             en:'What changed' },
      mp_c26_impact:  { es:'Impacto HVAC',                           en:'HVAC impact' },
      mp_c26_note:    { es:'La adopción varía por estado; consulta AHJ local antes de aplicar.', en:'Adoption varies by state; check local AHJ before applying.' },
      mp_c26_case:    { es:'Inspector pide panel SPD en cambio de service dwelling — NEC 2023 230.67 ya lo exige, re-confirmado 2026.', en:'Inspector requires SPD on dwelling service swap — 2023 230.67 already mandates; 2026 reconfirms.' },
      mp_c26_tip:     { es:'Quota SPD, GFCI 240V, emergency disconnect y AFCI expandido en cada cambio de panel dwelling — son los 4 cambios que más pica el inspector.', en:'Quote SPD, 240V GFCI, emergency disconnect and expanded AFCI in every dwelling panel swap — top 4 inspector hits.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.nec23to26) || {};
      var f = (s.filter || 'all').toLowerCase();

      var cats = {};
      NEC_CHANGES.forEach(function(r){ cats[pick(r.cat)] = true; });
      var catKeys = ['all'].concat(Object.keys(cats));

      var filtered = NEC_CHANGES.filter(function(r){
        return f === 'all' || pick(r.cat).toLowerCase() === f;
      });

      var opts = catKeys.map(function(k){
        var label = k === 'all' ? t('mp_c26_all','Todos') : k;
        return '<option value="' + esc(k.toLowerCase()) + '"' + (f === k.toLowerCase() ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('');

      var rows = filtered.map(function(r){
        return '<div style="padding:11px 12px;margin:7px 0;background:#fff;border-left:3px solid #F97316;border-radius:6px;">' +
          '<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">' +
            '<span style="font-weight:700;color:#9A3412;font-size:13px;">NEC ' + esc(r.art) + '</span>' +
            '<span style="font-size:11px;padding:2px 7px;background:#FED7AA;color:#9A3412;border-radius:999px;font-weight:600;">' + esc(pick(r.cat)) + '</span>' +
          '</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.5;margin-top:6px;"><strong>' + esc(t('mp_c26_what','Qué cambió')) + ':</strong> ' + esc(pick(r.what)) + '</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.5;margin-top:4px;"><strong>' + esc(t('mp_c26_impact','Impacto HVAC')) + ':</strong> ' + esc(pick(r.impact)) + '</div>' +
        '</div>';
      }).join('');

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'nec23to26', 'mp_c26_title', 'mp_c26_sub', '⇢',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_c26_filter','Filtrar por categoría')) + '</span><span class="mp-unit">filter</span></div>' +
            '<select class="mp-in" data-in="nec23to26.filter">' + opts + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_c26_count','Cambios mostrados')) + '</div>' +
          '<div class="mp-res-main">' + filtered.length + '<span class="mp-res-unit">/ ' + NEC_CHANGES.length + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_c26_note','')) + '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 2023 → 2026</div>' +
          rows +
        '</div>' +
        exampleTip('mp_c26_case','mp_c26_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 3: EPA 608 Certification Selector
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['epa608Selector'] = {
    i18n: {
      mp_epa_title:  { es:'Selector EPA 608',                          en:'EPA 608 Certification Picker' },
      mp_epa_sub:    { es:'¿Qué tipo de certificación necesito?',      en:'Which cert type do I need?' },
      mp_epa_eq_lbl: { es:'Tipo de equipo',                            en:'Equipment type' },
      mp_epa_small:  { es:'Pequeños electrodomésticos (<5 lb sellado)', en:'Small appliances (<5 lb sealed)' },
      mp_epa_high:   { es:'Alta presión (split res/com, heat pump)',   en:'High pressure (res/com split, heat pump)' },
      mp_epa_low:    { es:'Baja presión (chillers R-11/R-123)',        en:'Low pressure (chillers R-11/R-123)' },
      mp_epa_uni:    { es:'Múltiples tipos / Universal',                en:'Multiple types / Universal' },
      mp_epa_res:    { es:'Certificación requerida',                    en:'Required certification' },
      mp_epa_covers: { es:'Cubre',                                      en:'Covers' },
      mp_epa_exam:   { es:'Examen',                                     en:'Exam' },
      mp_epa_exam_c: { es:'Núcleo (Core) + sección específica, ~25 preguntas/sección, 70% para aprobar.', en:'Core + type section, ~25 q/section, 70% to pass.' },
      mp_epa_life:   { es:'Vigencia',                                   en:'Validity' },
      mp_epa_life_v: { es:'De por vida (no expira)',                    en:'Lifetime (no expiry)' },
      mp_epa_case:   { es:'Técnico junior trabaja sólo ventana y mini-fridge → Tipo I es suficiente. Al agregar splits residenciales, necesita Tipo II o Universal.', en:'Junior tech only services window A/Cs and mini-fridges → Type I is enough. Adding residential splits requires Type II or Universal.' },
      mp_epa_tip:    { es:'Ve directo por el Universal. Cuesta más, pero la carta de trabajo se abre a cualquier equipo y nunca caduca.', en:'Go straight for Universal. Costs more, but opens up every equipment type and never expires.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.epa608Selector) || {};
      var eq = s.eq || 'high';
      var info = EPA_TYPES[eq] || EPA_TYPES.high;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'epa608Selector', 'mp_epa_title', 'mp_epa_sub', '♻',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_epa_eq_lbl','Tipo de equipo')) + '</span><span class="mp-unit">type</span></div>' +
            '<select class="mp-in" data-in="epa608Selector.eq">' +
              '<option value="small"' + (eq==='small'?' selected':'') + '>' + esc(t('mp_epa_small','')) + '</option>' +
              '<option value="high"' + (eq==='high'?' selected':'') + '>' + esc(t('mp_epa_high','')) + '</option>' +
              '<option value="low"' + (eq==='low'?' selected':'') + '>' + esc(t('mp_epa_low','')) + '</option>' +
              '<option value="universal"' + (eq==='universal'?' selected':'') + '>' + esc(t('mp_epa_uni','')) + '</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_epa_res','Certificación requerida')) + '</div>' +
          '<div class="mp-res-main">' + esc(info.type) + '<span class="mp-res-unit">EPA 608</span></div>' +
          '<div class="mp-res-desc" style="color:#111 !important;font-weight:600;">' + esc(pick(info.name)) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_epa_exam','Examen')) + '</div><div class="mp-res-val" style="font-size:12px;">' + esc(t('mp_epa_exam_c','')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_epa_life','Vigencia')) + '</div><div class="mp-res-val">' + esc(t('mp_epa_life_v','De por vida')) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_epa_covers','Cubre')) + '</div>' +
          '<div style="font-size:13px;color:#111;line-height:1.55;">' + esc(pick(info.covers)) + '</div>' +
        '</div>' +
        exampleTip('mp_epa_case','mp_epa_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 4: A2L Ventilation (IEC 60335-2-40)
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['ventA2L'] = {
    i18n: {
      mp_v2l_title:   { es:'Ventilación A2L · IEC 60335-2-40',          en:'A2L Ventilation · IEC 60335-2-40' },
      mp_v2l_sub:     { es:'Cálculo de CFM mínimo y concentración máx.', en:'Min CFM and max concentration calc' },
      mp_v2l_ref:     { es:'Refrigerante',                              en:'Refrigerant' },
      mp_v2l_chg:     { es:'Carga',                                     en:'Charge' },
      mp_v2l_vol:     { es:'Volumen del cuarto',                        en:'Room volume' },
      mp_v2l_conc:    { es:'Concentración si se libera',                en:'Concentration if released' },
      mp_v2l_rcl:     { es:'Límite RCL',                                en:'RCL limit' },
      mp_v2l_lfl:     { es:'25% LFL',                                   en:'25% LFL' },
      mp_v2l_status:  { es:'Estado',                                    en:'Status' },
      mp_v2l_ok:      { es:'OK — Sin ventilación continua requerida',   en:'OK — No continuous ventilation required' },
      mp_v2l_rcl_bad: { es:'Excede RCL — ventilación continua requerida', en:'Exceeds RCL — continuous ventilation required' },
      mp_v2l_lfl_bad: { es:'PELIGRO — concentración cerca de LFL',      en:'DANGER — concentration near LFL' },
      mp_v2l_cfm:     { es:'CFM continuo requerido',                    en:'Continuous CFM required' },
      mp_v2l_cfm_ok:  { es:'No requerido',                              en:'Not required' },
      mp_v2l_note:    { es:'Regla de IEC 60335-2-40: concentración máxima tras liberación total < 0.25 × LFL. Si la carga supera el límite, usa ventilación mecánica continua o reduce la carga.', en:'IEC 60335-2-40 rule: max concentration after full release < 0.25 × LFL. If charge exceeds limit, use continuous mechanical ventilation or reduce charge.' },
      mp_v2l_case:    { es:'Mini-split R-32 de 2.5 kg instalado en cuarto de 20 m³ → concentración 0.125 kg/m³, supera RCL 0.061 → requiere ventilación mecánica o división del circuito.', en:'2.5 kg R-32 mini-split in 20 m³ room → 0.125 kg/m³, exceeds RCL 0.061 → mechanical ventilation or circuit split required.' },
      mp_v2l_tip:     { es:'Antes de decidir, mide el cuarto con láser: no confíes en los planos. Y si es cuarto dormitorio, aplica RCL, no LFL — el margen es mucho más estricto.', en:'Measure the room with a laser before deciding: do not trust drawings. Bedrooms apply RCL, not LFL — margin is much tighter.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.ventA2L) || {};
      var refKey = s.ref || 'R-32';
      var ref = A2L_REFRIG[refKey] || A2L_REFRIG['R-32'];
      var charge = (s.charge != null && !isNaN(+s.charge)) ? +s.charge : 2.5;
      var vol = (s.vol != null && !isNaN(+s.vol)) ? +s.vol : 20;
      if (vol <= 0) vol = 1;
      var conc = charge / vol;                   // kg/m3
      var rcl = ref.rcl;
      var lfl25 = 0.25 * ref.lfl;
      var status, statusColor, cfm = 0;
      if (conc <= rcl) {
        status = 'mp_v2l_ok'; statusColor = '#16A34A';
      } else if (conc >= lfl25) {
        status = 'mp_v2l_lfl_bad'; statusColor = '#DC2626';
      } else {
        status = 'mp_v2l_rcl_bad'; statusColor = '#F97316';
      }
      // Continuous ventilation target: dilute to RCL assuming full release over 1 hour exchange
      if (conc > rcl) {
        // Volume of air (m3) needed to dilute charge to RCL: V_req = charge / RCL
        var vReq = charge / rcl;  // m3 per release
        // Assume release event dispersed over 4 minutes (conservative IEC default)
        var m3_per_min = vReq / 4;
        cfm = m3_per_min * 35.3147;   // m3/min → CFM
        cfm = Math.max(50, Math.ceil(cfm));
      }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'ventA2L', 'mp_v2l_title', 'mp_v2l_sub', '☢',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_v2l_ref','Refrigerante')) + '</span><span class="mp-unit">A2L</span></div>' +
            '<select class="mp-in" data-in="ventA2L.ref">' +
              Object.keys(A2L_REFRIG).map(function(k){ return '<option value="' + esc(k) + '"' + (refKey===k?' selected':'') + '>' + esc(A2L_REFRIG[k].name) + ' (GWP ' + A2L_REFRIG[k].gwp + ')</option>'; }).join('') +
            '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_v2l_chg','Carga')) + '</span><span class="mp-unit">kg</span></div>' +
            '<input type="number" class="mp-in" data-in="ventA2L.charge" value="' + charge + '" step="0.1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_v2l_vol','Volumen del cuarto')) + '</span><span class="mp-unit">m³</span></div>' +
            '<input type="number" class="mp-in" data-in="ventA2L.vol" value="' + vol + '" step="1" min="1" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_v2l_conc','Concentración si se libera')) + '</div>' +
          '<div class="mp-res-main">' + conc.toFixed(3) + '<span class="mp-res-unit">kg/m³</span></div>' +
          '<div class="mp-res-desc" style="color:' + statusColor + ' !important;font-weight:700;">' + esc(t(status,'')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_v2l_rcl','RCL')) + '</div><div class="mp-res-val">' + rcl.toFixed(3) + ' kg/m³</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_v2l_lfl','25% LFL')) + '</div><div class="mp-res-val">' + lfl25.toFixed(3) + ' kg/m³</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_v2l_cfm','CFM continuo requerido')) + '</div><div class="mp-res-val" style="color:' + (cfm > 0 ? '#DC2626' : '#16A34A') + ' !important;">' + (cfm > 0 ? cfm + ' CFM' : esc(t('mp_v2l_cfm_ok','No requerido'))) + '</div></div>' +
            '<div><div class="mp-res-item">LFL</div><div class="mp-res-val">' + ref.lfl.toFixed(3) + ' kg/m³</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> IEC 60335-2-40</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_v2l_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_v2l_case','mp_v2l_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 5: NEC 110.26 Working Clearances
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['workingClr'] = {
    i18n: {
      mp_wc_title:   { es:'NEC 110.26 · Espacios de trabajo',           en:'NEC 110.26 · Working Clearances' },
      mp_wc_sub:     { es:'Profundidad · ancho · altura mínima',        en:'Depth · width · headroom' },
      mp_wc_v:       { es:'Tensión nominal',                            en:'Nominal voltage' },
      mp_wc_cond:    { es:'Condición',                                  en:'Condition' },
      mp_wc_c1:      { es:'Cond. 1 — pared opuesta no viva ni conductiva', en:'Cond. 1 — opposite side ungrounded/non-conductive' },
      mp_wc_c2:      { es:'Cond. 2 — superficie aterrizada al frente',   en:'Cond. 2 — grounded surface opposite' },
      mp_wc_c3:      { es:'Cond. 3 — partes vivas expuestas al frente',  en:'Cond. 3 — exposed live parts opposite' },
      mp_wc_depth:   { es:'Profundidad mínima',                         en:'Minimum depth' },
      mp_wc_width:   { es:'Ancho mínimo',                               en:'Minimum width' },
      mp_wc_width_v: { es:'76 cm (30") o el ancho del equipo — el mayor', en:'30" (76 cm) or equipment width — greater' },
      mp_wc_head:    { es:'Altura mínima (headroom)',                   en:'Minimum headroom' },
      mp_wc_head_v:  { es:'1.98 m (6.5 ft) o altura del equipo — el mayor (NEC 2023 cambio)', en:'6.5 ft (1.98 m) or equipment height — greater (NEC 2023 change)' },
      mp_wc_door:    { es:'Requisito de puerta',                        en:'Entrance/exit door' },
      mp_wc_door_v:  { es:'Equipo ≥1200A y ≥1.8 m de ancho → 2 puertas con panic hardware (110.26(C)(2))', en:'Equipment ≥1200A and ≥6 ft wide → 2 egress doors with panic hardware (110.26(C)(2))' },
      mp_wc_case:    { es:'Panel de 480V 3Ø frente a reja aterrizada de chiller → Cond. 2, necesita 3.5 ft (1.07 m) claro.', en:'480V 3Ø panel facing grounded chiller fence → Cond. 2, needs 3.5 ft (1.07 m) clear.' },
      mp_wc_tip:     { es:'Si el inspector encuentra una escoba, cable de extensión o cajas de filtros dentro del working space, te marca falla — el espacio debe estar VACÍO, permanente.', en:'If the inspector finds a broom, extension cord or filter boxes inside working space, it fails — space must be EMPTY, permanently.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.workingClr) || {};
      var v = s.v || '151-600';
      var cond = +(s.cond || 1);
      if (cond < 1) cond = 1; if (cond > 3) cond = 3;
      var tbl = CLR_TABLE[v] || CLR_TABLE['151-600'];
      var depthFt = tbl[cond];
      var depthM = (depthFt * 0.3048).toFixed(2);

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'workingClr', 'mp_wc_title', 'mp_wc_sub', '◫',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_wc_v','Tensión nominal')) + '</span><span class="mp-unit">V</span></div>' +
            '<select class="mp-in" data-in="workingClr.v">' +
              '<option value="0-150"' + (v==='0-150'?' selected':'') + '>0–150 V</option>' +
              '<option value="151-600"' + (v==='151-600'?' selected':'') + '>151–600 V</option>' +
              '<option value="601-1000"' + (v==='601-1000'?' selected':'') + '>601–1000 V</option>' +
            '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_wc_cond','Condición')) + '</span><span class="mp-unit">1 / 2 / 3</span></div>' +
            '<select class="mp-in" data-in="workingClr.cond">' +
              '<option value="1"' + (cond===1?' selected':'') + '>' + esc(t('mp_wc_c1','')) + '</option>' +
              '<option value="2"' + (cond===2?' selected':'') + '>' + esc(t('mp_wc_c2','')) + '</option>' +
              '<option value="3"' + (cond===3?' selected':'') + '>' + esc(t('mp_wc_c3','')) + '</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_wc_depth','Profundidad mínima')) + '</div>' +
          '<div class="mp-res-main">' + depthFt.toFixed(1) + '<span class="mp-res-unit">ft</span></div>' +
          '<div class="mp-res-desc">= ' + depthM + ' m · NEC Table 110.26(A)(1)</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_wc_width','Ancho mínimo')) + '</div><div class="mp-res-val" style="font-size:12px;">' + esc(t('mp_wc_width_v','30"')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_wc_head','Altura mínima')) + '</div><div class="mp-res-val" style="font-size:12px;">' + esc(t('mp_wc_head_v','6.5 ft')) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_wc_door','Puerta')) + '</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_wc_door_v','')) + '</div>' +
        '</div>' +
        exampleTip('mp_wc_case','mp_wc_tip')
      );
    }
  };

})();
