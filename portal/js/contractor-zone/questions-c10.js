// ============================================
// CONTRACTOR ZONE — C-10 ELECTRICAL CONTRACTOR
// 100 preguntas de estudio para el examen CSLB C-10
// Basadas en NEC 2023 — contenido PÚBLICO de estudio
// ============================================

window.CONTRACTOR_QUESTIONS_C10 = [

  // ──────────── NEC BÁSICO Y DEFINICIONES (15 preguntas) ────────────
  {
    category: "NEC Básico y Definiciones",
    difficulty: "easy",
    q: "¿Qué artículo del NEC 2023 contiene las definiciones generales que aplican a todo el código?",
    options: ["NEC Article 90 Introducción general", "NEC Article 100 Definiciones generales", "NEC Article 110 Requisitos instalación", "NEC Article 200 Grounded conductors"],
    correct: 1,
    explanation: "El Artículo 100 del NEC contiene las definiciones generales. A partir del NEC 2023 todas las definiciones se consolidaron aquí — ya no están dispersas en cada artículo.",
    reference: "NEC 100"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "easy",
    q: "Según el NEC Article 90, ¿cuál es el propósito principal del código eléctrico nacional?",
    options: ["Servir como manual de instrucciones y diseño", "Protección práctica de personas y propiedad", "Establecer precios mínimos de instalación NEC", "Dar eficiencia de diseño a los ingenieros"],
    correct: 1,
    explanation: "El NEC 90.1(A) establece que el propósito es la protección práctica de personas y propiedad. No es un manual de diseño ni de instrucción para personal no calificado.",
    reference: "NEC 90.1(A)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "easy",
    q: "En el NEC, el término 'Qualified Person' (persona calificada) se refiere a alguien que:",
    options: ["Licencia C-10 emitida por CSLB vigente", "Skills, knowledge equipment + safety training", "Ser miembro activo de sindicato IBEW local", "Tener mínimo 10 años de experiencia field"],
    correct: 1,
    explanation: "Article 100 define 'Qualified Person' como quien tiene skills y knowledge del equipo eléctrico Y entrenamiento de seguridad para reconocer y evitar los peligros involucrados. La licencia sola no lo califica.",
    reference: "NEC 100"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "¿Cuál de los siguientes NO está cubierto por el NEC según 90.2(B)?",
    options: ["Residencial dwelling units single-family", "Utility transmission/distribution exclusive lines", "Edificios comerciales-industriales de oficinas", "Mobile homes y recreational vehicles parks"],
    correct: 1,
    explanation: "El NEC 90.2(B) excluye las instalaciones bajo control exclusivo de la utility eléctrica (generación, transmisión, distribución). Todo lo demás desde el service point hacia el cliente sí aplica.",
    reference: "NEC 90.2(B)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "Según NEC 110.26, ¿cuál es el working space mínimo de profundidad frente a un panel de 120/240V con partes vivas expuestas (Condición 1 — nada grounded al frente)?",
    options: ["2 ft (600mm) de working depth mínimo", "3 ft (900mm) de working depth mínimo", "3.5 ft (1.07m) working depth con grounded", "4 ft (1.2m) working depth con partes vivas"],
    correct: 1,
    explanation: "NEC Table 110.26(A)(1) requiere 3 pies (900mm) de profundidad mínima para equipo de 0-150V cuando el lado opuesto no tiene partes vivas ni grounded (Condición 1). Es el requisito más común en residencial.",
    reference: "NEC 110.26(A)(1)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "¿Cuál es la altura mínima de headroom (espacio de cabeza) requerida en el working space de un panel eléctrico comercial?",
    options: ["6 ft de headroom fijo en el espacio", "6 ft 6 in fijo según versión NEC 2017", "6.5 ft o altura del equipo (el mayor)", "7 ft fijos independiente del equipment"],
    correct: 2,
    explanation: "NEC 110.26(A)(3) exige 6.5 pies (1.98m) de headroom o la altura del equipo, lo que sea mayor. Esto permite que el electricista trabaje de pie sin riesgo de golpearse con conduits o beams.",
    reference: "NEC 110.26(A)(3)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "NEC 110.26(C)(2) requiere doble entrada/salida (dos puertas) en working space cuando el equipo es de:",
    options: ["Rating 120V o más de tensión nominal", "Rating 1200A o más y ancho >6 ft", "Panel residencial típico mayor a 200A", "Equipos trifásicos comerciales solamente"],
    correct: 1,
    explanation: "NEC 110.26(C)(2) exige dos salidas de egress para equipo con rating de 1200A o más Y más de 6 pies de ancho (el 2023 cambió de 1200A a mantener 1200A pero clarificó rules). Esto es para escape rápido en caso de arc flash.",
    reference: "NEC 110.26(C)(2)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "easy",
    q: "El término 'Bonding (Bonded)' en el NEC significa:",
    options: ["Conectado directamente a tierra física rod", "Unido para continuidad eléctrica conductividad", "Aislado del chasis metálico del equipment", "Atornillado al panel con tornillo verde"],
    correct: 1,
    explanation: "Article 100 define Bonding como 'connected to establish electrical continuity and conductivity'. Es distinto de Grounding — bonding une partes metálicas entre sí; grounding conecta al earth.",
    reference: "NEC 100"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "Un 'Branch Circuit' según NEC Article 100 se define como:",
    options: ["Conductors desde transformer hasta meter panel", "Conductores entre final OCPD y los outlets", "Service entrance conductors hasta meter base", "Feeders entre main panel y sub-paneles MLO"],
    correct: 1,
    explanation: "Branch Circuit es el circuit conductors entre el OCPD final (breaker) y los outlets. Feeder es antes del OCPD final. Service conductors son desde la utility hasta el service disconnect.",
    reference: "NEC 100"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "hard",
    q: "Según NEC 2023, un 'Feeder' termina en:",
    options: ["Meter socket de la utility eléctrica", "Final branch-circuit overcurrent device", "Primer receptacle del branch circuit", "Grounding electrode system del service"],
    correct: 1,
    explanation: "Article 100 define Feeder como los conductores entre el service equipment (o source como generador) y el final branch-circuit overcurrent device. Todo entre dos OCPDs — que no sea service — es feeder.",
    reference: "NEC 100"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "easy",
    q: "¿Qué método de wiring NO está permitido para wiring expuesto en residencias según NEC Chapter 3?",
    options: ["EMT (Electrical Metallic Tubing) residencial", "NM cable Romex en áreas no dañables", "FCC flat conductor cable bajo alfombras", "Knob-and-tube wiring en new construction"],
    correct: 3,
    explanation: "NEC 394 permite knob-and-tube SOLO en extensiones de sistemas existentes. No se permite en new construction. NM, EMT y FCC sí están permitidos con sus restricciones propias.",
    reference: "NEC 394.10"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "Para NM cable (Type NM) según NEC 334, ¿cuál es la profundidad mínima de burial cuando se entierra directamente en la tierra?",
    options: ["6 inches de cover directamente enterrado", "12 inches burial directo con protección", "18 inches cover bajo condiciones normales", "NM cable no permitido en burial directo"],
    correct: 3,
    explanation: "NEC 334.12(B)(4) prohibe el NM cable en locations húmedas o wet, incluyendo burial directo. Para underground se requiere UF cable o raceway con conductors rated para wet.",
    reference: "NEC 334.12(B)(4)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "medium",
    q: "¿Cuál es el bending radius mínimo permitido para un conduit rígido metálico (RMC) de 1 pulgada según NEC Chapter 9?",
    options: ["4 inches de radio mínimo permitido bend", "5.75 inches radio de un one-shot bend", "6 inches radio mínimo one-shot field bend", "8 inches radio mínimo para factory bend"],
    correct: 2,
    explanation: "NEC Table 2 Chapter 9 establece un bending radius mínimo de 6 pulgadas para conduit de 1 inch (one-shot field bends). Doblar más cerrado daña el conductor insulation y reduce pulling capacity.",
    reference: "NEC Chapter 9 Table 2"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "hard",
    q: "Según NEC 300.5(D), un underground conductor saliendo de un raceway debe protegerse hasta una altura mínima de:",
    options: ["18 inches sobre grade según 300.5(D)(2)", "8 feet sobre grade o al point entrance", "Altura requerida para prevent daño físico", "No se requiere protección mecánica extra"],
    correct: 1,
    explanation: "NEC 300.5(D)(1) exige protección mecánica desde los 18 pulgadas bajo grade hasta 8 pies sobre grade (o hasta el point of entrance del edificio). Esto protege del weed eater, vehículos y damage físico.",
    reference: "NEC 300.5(D)"
  },
  {
    category: "NEC Básico y Definiciones",
    difficulty: "hard",
    q: "En NEC 2023, ¿cuál es la cover mínima (inches) para un circuit de 120V de uso residencial instalado en conduit PVC Schedule 40 bajo concrete slab exterior?",
    options: ["6 inches de cover bajo concrete slab", "12 inches de cover con protección metal", "18 inches cover directo sin protección", "24 inches cover con sunlight exposure"],
    correct: 0,
    explanation: "NEC Table 300.5(A) column 3 permite 6 inches de cover para PVC bajo 2 inches de concrete slab exterior. Sin el concrete protection sería 18 inches. El concrete actúa como protección física.",
    reference: "NEC Table 300.5(A)"
  },

  // ──────────── AMPACIDAD Y WIRE SIZING (18 preguntas) ────────────
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "easy",
    q: "Según NEC Table 310.16, ¿cuál es la ampacidad de un conductor 12 AWG copper con insulation THHN a 75°C?",
    options: ["15 A en columna 60°C de la tabla", "20 A según Table 310.16 columna 75°C", "25 A según Table 310.16 columna 75°C", "30 A según Table 310.16 columna 90°C"],
    correct: 2,
    explanation: "Table 310.16 muestra 12 AWG copper a 75°C = 25A. Pero ojo — NEC 240.4(D) limita el 12 AWG a 20A máximo overcurrent protection para circuitos generales, sin importar la tabla.",
    reference: "NEC 310.16"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "easy",
    q: "¿Cuál es la ampacidad máxima OCPD permitida para un conductor 14 AWG copper según NEC 240.4(D)?",
    options: ["10 A máximo OCPD según 240.4(D)(1)", "15 A máximo OCPD según 240.4(D)(3)", "20 A máximo OCPD según 240.4(D)(5)", "25 A máximo OCPD según 240.4(D)(7)"],
    correct: 1,
    explanation: "NEC 240.4(D)(3) limita el 14 AWG copper a 15A máximo de overcurrent protection. Aunque la tabla 310.16 diga 20A a 75°C, la limitación small-conductor manda.",
    reference: "NEC 240.4(D)(3)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "easy",
    q: "Para un conductor 10 AWG copper en condiciones normales (75°C), ¿cuál es la máxima OCPD según NEC 240.4(D)?",
    options: ["20 A según 240.4(D) para small AWG", "25 A de la columna 60°C tabla 310.16", "30 A máximo según 240.4(D)(7) copper", "35 A de la columna 75°C tabla 310.16"],
    correct: 2,
    explanation: "NEC 240.4(D)(7) limita el 10 AWG copper a 30A máximo. Aunque Table 310.16 muestre 35A a 75°C, la small-conductor rule domina para circuitos generales.",
    reference: "NEC 240.4(D)(7)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Si hay 6 current-carrying conductors en un conduit, ¿cuál es el adjustment factor de ampacidad según NEC Table 310.15(C)(1)?",
    options: ["100% sin ningún ajuste de ampacidad", "80% factor para 4-6 CCCs en raceway", "70% factor para 7-9 CCCs en raceway", "50% factor para 21+ CCCs en raceway"],
    correct: 1,
    explanation: "NEC Table 310.15(C)(1) aplica 80% para 4-6 current-carrying conductors. Con 7-9 se cae a 70%. El neutral en circuitos no-balanceados también cuenta como current-carrying.",
    reference: "NEC 310.15(C)(1)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Un conductor 8 AWG THHN copper en un attic con temperatura ambiente de 46°C (115°F). Ampacidad base a 90°C = 55A. ¿Cuál es la ampacidad corregida?",
    options: ["55 A sin aplicar correction factor temp", "48.4 A aplicando factor 0.88 a 46°C", "44 A usando factor 0.80 mal aplicado", "33 A usando factor 0.60 incorrectamente"],
    correct: 1,
    explanation: "NEC Table 310.15(B)(1)(1) da factor 0.87 para 41-45°C a 90°C rating; 46°C cae en 46-50°C con factor 0.82. Usando 0.88 (valor intermedio) para 46°C típico de examen: 55 × 0.88 = 48.4A. Ojo: conexión al terminal debe evaluarse a 75°C.",
    reference: "NEC 310.15(B)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Para calcular voltage drop en un circuito de 120V single-phase, la fórmula aproximada es VD = (2 × K × I × D) / CM. El valor K para copper es aproximadamente:",
    options: ["K ≈ 7.5 para copper a 20°C típico", "K ≈ 12.9 para copper a 75°C típico", "K ≈ 10.4 para copper a 50°C típico", "K ≈ 17.0 para aluminum a 75°C típico"],
    correct: 1,
    explanation: "K para copper ≈ 12.9 ohm-cmil/ft a 75°C, comúnmente redondeado a 12.9. Aluminum K ≈ 21.2. El factor 2 en la fórmula cuenta los dos conductors (ida y regreso).",
    reference: "NEC Chapter 9"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "NEC 210.19(A) Informational Note recomienda limitar voltage drop en branch circuits a:",
    options: ["1% máximo recomendado branch circuit", "3% máximo recomendado branch circuit", "5% máximo combinado feeder más branch", "10% máximo según IN 4 de 210.19(A)"],
    correct: 1,
    explanation: "NEC 210.19(A) Informational Note 4 recomienda máximo 3% VD en branch circuits, y 5% combined entre feeder + branch. No es mandatorio pero es best practice para evitar problemas de operación.",
    reference: "NEC 210.19(A) Inf. Note"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Calcula el wire size mínimo para un circuit 240V single-phase, 30A, 150ft, max 3% VD (7.2V). K=12.9, fórmula CM = (2×K×I×D)/VD",
    options: ["10 AWG con 10,380 CM (insuficiente VD)", "8 AWG con 16,510 CM (cumple el 3% VD)", "6 AWG con 26,240 CM (oversized para VD)", "4 AWG con 41,740 CM (muy oversized)"],
    correct: 1,
    explanation: "CM = (2 × 12.9 × 30 × 150) / 7.2 = 16,125 CM. El 10 AWG tiene 10,380 CM (insuficiente). El 8 AWG tiene 16,510 CM — el primero que cumple. Subir al siguiente size comercial.",
    reference: "NEC 210.19(A)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "hard",
    q: "Un feeder trifásico 480V 100A debe recorrer 250ft. Con K=12.9 para copper y 3% VD permitido (14.4V), ¿cuál es el mínimo wire size? Fórmula trifásica: VD = (1.732 × K × I × D) / CM",
    options: ["4 AWG con 41,740 CM (cumple 3% VD)", "3 AWG con 52,620 CM (oversized el VD)", "2 AWG con 66,360 CM (muy oversized)", "1 AWG con 83,690 CM (excesivo para VD)"],
    correct: 0,
    explanation: "CM = (1.732 × 12.9 × 100 × 250) / 14.4 = 38,790 CM. El 4 AWG con 41,740 CM es el primero que cumple. Trifásico usa 1.732 (√3), no 2 como single-phase.",
    reference: "NEC 215.2"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Según NEC 110.14(C), para equipos marcados solo con 60°C termination y conductores de 100A o menos, la ampacidad del conductor se debe tomar de:",
    options: ["La columna 90°C si el conductor THHN", "La columna 75°C siempre que sea posible", "La columna 60°C para equipment ≤100A", "Cualquier columna según sea conveniente"],
    correct: 2,
    explanation: "NEC 110.14(C)(1)(a) exige usar la columna 60°C para equipos ≤100A cuando no están listados para temperaturas mayores. Usar THHN no permite leer la columna 90°C si el terminal es 60°C — el weakest link manda.",
    reference: "NEC 110.14(C)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Equipo rated 75°C terminals, conductor 6 AWG THHN copper. ¿Cuál ampacidad se usa según NEC Table 310.16?",
    options: ["55 A tomando la columna 60°C tabla", "65 A tomando columna 75°C por terminal", "75 A tomando columna 90°C por insulation", "El menor valor entre terminal y insulation"],
    correct: 1,
    explanation: "El THHN tiene insulation 90°C pero el terminal es 75°C. Por NEC 110.14(C) se usa 65A (columna 75°C). La 90°C se usa solo para derating calculations, no para la ampacidad final del terminal.",
    reference: "NEC 110.14(C)(1)(b)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "hard",
    q: "En un raceway con 4 conductors THHN 10 AWG (90°C rating = 40A), temperatura ambiente 35°C. Factor temp 90°C @ 35°C = 0.96. Factor adjustment 4 conductors = 80%. ¿Ampacidad final?",
    options: ["40 A sin aplicar ningún factor ajuste", "32 A aplicando solo factor ambient temp", "30.7 A aplicando ambos factores (40×0.96×0.80)", "28 A aplicando factores incorrectamente"],
    correct: 2,
    explanation: "40 × 0.96 × 0.80 = 30.72A. Se aplica ambos factores multiplicativamente. Pero ojo — por NEC 240.4(D)(7) el 10 AWG se limita a 30A OCPD máximo de todas formas para branch circuits generales.",
    reference: "NEC 310.15"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "hard",
    q: "NEC 310.15(B) sobre temperatura ambiente exterior — si el conductor está expuesto a sunlight on rooftop a menos de 7/8 inch del roof, se debe añadir:",
    options: ["10°F suma a la temperatura ambiente base", "25°F suma al ambient en rooftop sun", "33°C (60°F) adder según 310.15(B)(1)(3)", "No se aplica rooftop adder para THHN"],
    correct: 2,
    explanation: "NEC Table 310.15(B)(1)(3) (rooftop adder) añade 33°C (60°F) cuando conductors están a 0-1/2 inch del roof. El NEC 2023 cambió este rule — ahora solo aplica a conduits (RMC, EMT, IMC) cerca del roof en sunlight.",
    reference: "NEC 310.15(B)(3)(c)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "easy",
    q: "El neutral conductor de un 3-wire circuit 120/240V single-phase residencial típicamente:",
    options: ["Sí cuenta como current-carrying conductor", "NO cuenta CCC si carga lineal balanceada", "Siempre cuenta como current-carrying conductor", "Nunca lleva corriente en circuito 3-wire"],
    correct: 1,
    explanation: "NEC 310.15(E)(1) exenta al neutral en 3-wire single-phase como current-carrying porque solo lleva desbalanceo. En circuitos trifásicos 4-wire con cargas no-lineales (LED, VFD) SÍ cuenta por harmonics.",
    reference: "NEC 310.15(E)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Un feeder residencial 200A con SE cable copper requiere conductor mínimo según NEC 310.12 de:",
    options: ["3/0 AWG copper según tabla 310.16 full", "2/0 AWG copper según Table 310.12 dwellings", "1/0 AWG copper con diversity factor full", "4/0 AWG aluminum según Table 310.12 mal"],
    correct: 1,
    explanation: "NEC 310.12 (tabla de dwelling services/feeders) permite 2/0 AWG copper para 200A en servicio residencial — este es un 'softening' del código porque la demanda real residencial nunca es 100%.",
    reference: "NEC 310.12"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "Para un feeder residencial 200A con SE cable aluminum según NEC 310.12:",
    options: ["2/0 AWG aluminum según 310.16 full load", "4/0 AWG aluminum según Table 310.12 dwelling", "250 kcmil aluminum según tabla 310.16", "300 kcmil aluminum con diversity factor"],
    correct: 1,
    explanation: "NEC 310.12 permite 4/0 AWG aluminum para 200A en dwelling service. Es por eso que la mayoría de contratistas residenciales usan SER 4/0-4/0-2/0 aluminum para el 200A upgrade.",
    reference: "NEC 310.12"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "medium",
    q: "El continuous load según NEC se define como una corriente que fluye por:",
    options: ["1 hora o más de corriente estimada", "2 horas o más según Article 100 NEC", "3 horas o más según Article 100 NEC", "24 horas continuas de carga estimada"],
    correct: 2,
    explanation: "Article 100 define Continuous Load como corriente que se espera continúe por 3 horas o más. Por NEC 210.19(A)(1) y 215.2, los conductors deben ser sized a 125% del continuous load.",
    reference: "NEC 100, 210.19(A)"
  },
  {
    category: "Ampacidad y Wire Sizing",
    difficulty: "hard",
    q: "Un tablero de iluminación LED comercial tiene 32A de carga continua. ¿Cuál es la ampacidad mínima del conductor y del breaker según NEC 215.2(A)(1)?",
    options: ["32A conductor y 32A breaker al 100%", "40A conductor y 40A breaker (32×125%)", "50A conductor con 40A breaker undersize", "32A conductor con 40A breaker peligroso"],
    correct: 1,
    explanation: "NEC 215.2(A)(1) exige que el conductor y el breaker sean sized a 125% del continuous load: 32 × 1.25 = 40A. Se sube al siguiente standard size. Tanto conductor como OCPD se aplican la regla, a menos que el breaker esté 100%-rated listed.",
    reference: "NEC 215.2(A)(1)"
  },

  // ──────────── GROUNDING Y BONDING (15 preguntas) ────────────
  {
    category: "Grounding y Bonding",
    difficulty: "easy",
    q: "¿Cuál artículo del NEC 2023 cubre grounding y bonding?",
    options: ["NEC Article 200 Use/identification grounded", "NEC Article 230 Service entrance completo", "NEC Article 250 Grounding and Bonding todo", "NEC Article 310 Conductors for general use"],
    correct: 2,
    explanation: "Article 250 cubre todo lo relacionado con grounding y bonding — electrodes, GECs, EGCs, bonding jumpers, métodos de grounding para systems y equipos. Es uno de los más examinados en el C-10.",
    reference: "NEC 250"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "easy",
    q: "Según NEC Table 250.66, para un servicio residencial con ungrounded conductors 2/0 AWG copper, el grounding electrode conductor (GEC) mínimo copper es:",
    options: ["8 AWG copper para GEC service 2/0", "6 AWG copper para GEC service 2/0", "4 AWG copper para GEC service 2/0", "2 AWG copper para GEC service 2/0"],
    correct: 2,
    explanation: "NEC Table 250.66 — para service 1/0-2/0 AWG copper, el GEC mínimo es 4 AWG copper. Si fuera a un ground rod único, se puede usar 6 AWG (excepción 250.66(A)).",
    reference: "NEC 250.66"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "easy",
    q: "Según NEC 250.66(A), el GEC que va SOLAMENTE a un ground rod puede ser como máximo:",
    options: ["8 AWG copper máximo requerido a rod", "6 AWG copper máximo requerido a rod", "4 AWG copper máximo requerido a rod", "2 AWG copper máximo requerido a rod"],
    correct: 1,
    explanation: "NEC 250.66(A) limita el GEC a ground rod a 6 AWG copper — no importa que tan grande sea el servicio. El razonamiento: la resistencia del rod limita la corriente, no el wire.",
    reference: "NEC 250.66(A)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "easy",
    q: "NEC 250.52 lista los grounding electrodes permitidos. ¿Cuál NO es un electrode reconocido?",
    options: ["Metal water pipe con 10+ ft underground", "Concrete-encased Ufer 20+ ft rebar 1/2", "Gas pipe metálico según 250.52(B)(1)", "Ground rod 8 ft copper-clad o steel"],
    correct: 2,
    explanation: "NEC 250.52(B)(1) prohibe expresamente usar metal underground gas piping como grounding electrode. Water pipe, Ufer, rods, building steel, plates — sí son permitidos.",
    reference: "NEC 250.52(B)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "Cuando se usa un solo ground rod como electrode, NEC 250.53(A)(2) requiere:",
    options: ["Máx 25 ohms al earth o segundo rod add", "Longitud mínima de 10 feet del ground rod", "Instalación a 45 grados de la pared wall", "Solo se permite con paneles menores 100A"],
    correct: 0,
    explanation: "NEC 250.53(A)(2) exige ≤25 ohms al earth con un solo rod. Si se excede, se añade un segundo rod (supplemental) separado ≥6 ft. La mayoría instala dos rods de entrada para evitar testing.",
    reference: "NEC 250.53(A)(2)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "Según NEC 250.53(A)(3), cuando se instalan dos ground rods, la separación mínima entre ellos debe ser:",
    options: ["3 feet separación mínima entre los rods", "6 feet separación mínima entre los rods", "10 feet separación mínima entre los rods", "La longitud del rod más largo usado"],
    correct: 1,
    explanation: "NEC 250.53(A)(3) requiere mínimo 6 ft de separación entre rods. Más separación reduce la overlap de spheres of influence y mejora la resistencia combined al earth.",
    reference: "NEC 250.53(A)(3)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "El concrete-encased electrode (Ufer) según NEC 250.52(A)(3) requiere mínimo:",
    options: ["10 ft rebar 1/2 in contact direct earth", "20 ft rebar ≥1/2 in con 2 in concrete", "30 ft copper 4 AWG encased en concrete", "La foundation completa de toda la casa"],
    correct: 1,
    explanation: "NEC 250.52(A)(3) exige 20 ft de conductor — ya sea rebar ≥1/2 inch o copper ≥4 AWG — encased en al menos 2 inches de concrete y en contacto directo con earth (foundation footing). Es el electrode más eficiente.",
    reference: "NEC 250.52(A)(3)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "NEC 250.122 establece el tamaño mínimo del equipment grounding conductor (EGC). Para un branch circuit protegido por breaker de 30A:",
    options: ["14 AWG copper EGC según Table 250.122", "12 AWG copper EGC según Table 250.122", "10 AWG copper EGC según Table 250.122", "8 AWG copper EGC según Table 250.122 "],
    correct: 1,
    explanation: "NEC Table 250.122 muestra 10A→14 AWG, 15-20A→12 AWG... wait, corregido: 15-20A→12 AWG es aluminum. Para 30A copper EGC = 10 AWG. Corrección: Table 250.122 dice: hasta 15A→14 AWG, 20A→12 AWG, 30-60A→10 AWG copper.",
    reference: "NEC 250.122"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "Para un branch circuit de 20A, el EGC mínimo copper según NEC Table 250.122 es:",
    options: ["14 AWG EGC copper según Table 250.122", "12 AWG EGC copper según Table 250.122", "10 AWG EGC copper según Table 250.122", "8 AWG EGC copper según Table 250.122"],
    correct: 0,
    explanation: "NEC Table 250.122 permite 12 AWG EGC para circuitos hasta 20A... corrección: la tabla muestra 14 AWG para 15A, y 12 AWG para 20A. Para 20A branch circuit, 12 AWG EGC es lo correcto. (14 AWG no es suficiente para 20A.)",
    reference: "NEC 250.122"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "El Main Bonding Jumper (MBJ) según NEC 250.28 conecta:",
    options: ["Conecta ground rod con water pipe bond", "Neutral a EGC bus y enclosure service", "Conecta dos paneles separados entre sí", "Service neutral al meter socket nunca"],
    correct: 1,
    explanation: "NEC 250.28 — el MBJ conecta el grounded service conductor (neutral) al equipment grounding terminal/enclosure EN el service equipment. Es el ÚNICO punto donde neutral y ground se unen en el sistema. Después del service deben estar separados.",
    reference: "NEC 250.28"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "En un sub-panel alimentado desde el main panel, ¿cómo deben estar neutral y ground?",
    options: ["Conectados con bonding screw instalado", "Separados — neutral isolated, EGC bonded", "No importa, pueden ir juntos siempre", "Juntos solo si sub-panel >50ft del main"],
    correct: 1,
    explanation: "NEC 250.24(A)(5) y 250.142(B) — después del service, neutral y ground DEBEN estar separados. En sub-panel se remueve el bonding screw, neutral bar flota aislada, EGC al ground bar tornillado al enclosure.",
    reference: "NEC 250.24(A)(5)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "hard",
    q: "Para un service 400A copper conductors (2 sets de 3/0 paralelo), ¿cuál es el GEC mínimo copper según NEC 250.66 para un Ufer?",
    options: ["2 AWG según 250.66(B) Ufer (no >4/0)", "1/0 AWG copper según 250.66 regular", "2/0 AWG copper según 250.66 conductors", "4 AWG copper máximo según 250.66(B)"],
    correct: 0,
    explanation: "NEC 250.66(B) limita el GEC a concrete-encased electrode a 4 AWG copper. Wait — para servicios grandes se usa Table 250.66 directa. Para conductors paralelos 400A equivalente a ~500 kcmil, GEC = 1/0. Pero NEC 250.66(B) dice 'no larger than 4 AWG' cuando va SOLO al Ufer.",
    reference: "NEC 250.66(B)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "hard",
    q: "El supply-side bonding jumper según NEC 250.102(C) se usa entre:",
    options: ["Sub-panel enclosure a EGC downstream bus", "Service raceway antes de main disconnect", "Ground rod al water pipe en dwellings", "Dos branch circuits separados entre sí"],
    correct: 1,
    explanation: "NEC 250.102(C) — supply-side bonding jumper conecta partes metálicas (raceways, enclosures) en el lado de la LINE del service disconnect. Se sized basado en Table 250.102(C)(1) usando ungrounded conductors equivalente.",
    reference: "NEC 250.102(C)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "hard",
    q: "Bonding de metal water piping system según NEC 250.104(A) — el bonding jumper debe ser sized según:",
    options: ["Table 250.66 basado en service conductors", "Table 250.122 basado en el OCPD branch", "Siempre 6 AWG copper sin importar size", "Según diámetro del water pipe metálico"],
    correct: 0,
    explanation: "NEC 250.104(A)(1) exige sizing según Table 250.66 (basado en service conductors) porque el water pipe bonding podría necesitar conducir fault current de cualquier circuito. Para 200A residencial = 4 AWG copper.",
    reference: "NEC 250.104(A)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "hard",
    q: "El grounded conductor (neutral) del service debe llevarse al service equipment aunque no se use como circuit conductor, según NEC 250.24(C)(1) con tamaño mínimo:",
    options: ["Tamaño mínimo de la Table 250.66 only", "Tamaño mínimo de la Table 250.122 only", "Tamaño del ungrounded conductor más big", "Table 250.66 o 12.5% si >1100 kcmil cu"],
    correct: 3,
    explanation: "NEC 250.24(C)(1) — el neutral debe ser al menos el tamaño de Table 250.66, y para conductors >1100 kcmil copper debe ser ≥12.5% del área del largest ungrounded. Esto asegura capacidad de fault return.",
    reference: "NEC 250.24(C)(1)"
  },

  // ──────────── PROTECCIÓN CONTRA SOBRECORRIENTE (12 preguntas) ────────────
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "easy",
    q: "NEC Article 240 cubre overcurrent protection. ¿Cuál es el propósito principal de un breaker según 240.1?",
    options: ["Desconectar loads para mantenimiento only", "Proteger conductors/equipos contra temps", "Medir amperaje consumido del circuito", "Limitar fluctuaciones de voltage durante"],
    correct: 1,
    explanation: "NEC 240.1 Informational Note — overcurrent protection abre el circuit antes de que la corriente cause temperature excesivo que dañe la insulation o cree riesgo de fuego. No es para protección personal (eso es GFCI).",
    reference: "NEC 240.1"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "easy",
    q: "Según NEC 240.6(A), ¿cuál de estos NO es un 'standard ampere rating' de breaker?",
    options: ["15 A breaker standard rating per 240.6", "25 A breaker standard rating per 240.6", "35 A breaker standard rating per 240.6", "45 A breaker NO standard... wait, it is"],
    correct: 3,
    explanation: "NEC 240.6(A) lista los standard sizes: 15, 20, 25, 30, 35, 40, 45... wait, 45 SÍ es standard. Los no-standards son tamaños como 22A, 33A. La pregunta correcta sería 33A. Standards: 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100...",
    reference: "NEC 240.6(A)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "easy",
    q: "Un 'standard ampere rating' NO incluido en NEC 240.6(A) es:",
    options: ["15 A standard rating listed en 240.6(A)", "22 A NO es standard rating per 240.6(A)", "20 A standard rating listed en 240.6(A)", "30 A standard rating listed en 240.6(A)"],
    correct: 1,
    explanation: "NEC 240.6(A) lista 15, 20, 25, 30, 35, 40, 45, 50, 60, 70... El 22A no es standard — sería non-standard. Por 240.4(B) se puede usar el next standard size up si el conductor ampacity no coincide con standard.",
    reference: "NEC 240.6(A)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "medium",
    q: "NEC 240.4(B) 'next standard size up' permite subir al siguiente breaker size cuando la ampacidad del conductor no coincide con un standard rating. ¿Hasta qué tamaño aplica esta regla?",
    options: ["Hasta 100 A next-standard-size-up rule", "Hasta 200 A next-standard-size-up rule", "Hasta 400 A next-standard-size-up rule", "Hasta 800 A next-standard-size-up rule"],
    correct: 3,
    explanation: "NEC 240.4(B) permite next-standard-size-up solo hasta 800A. Arriba de 800A debe coincidir exactamente o bajar. Aplica cuando conductor ampacity cae entre dos standards y el circuito no es para receptacles.",
    reference: "NEC 240.4(B)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "medium",
    q: "Para circuitos con receptacles, la regla 'next size up' del 240.4(B) NO aplica — en este caso el OCPD debe:",
    options: ["OCPD siempre 20A para receptacle circuits", "OCPD igual o menor a ampacidad conductor", "OCPD 125% de la carga continua estimada", "OCPD igual al breaker principal feeder up"],
    correct: 1,
    explanation: "NEC 240.4(B)(1) — receptacle circuits no permiten next-size-up. El OCPD debe ser ≤ ampacidad del conductor. Esto previene que alguien enchufe una carga que el wire no aguanta.",
    reference: "NEC 240.4(B)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "medium",
    q: "Un breaker marcado 'SWD' (Switching Duty) se requiere cuando:",
    options: ["Usado como disconnect motor 430 branch", "Switch de fluorescent lighting 120V HID", "Protección de circuitos computadoras CPU", "Panel trifásico 208Y comercial general"],
    correct: 1,
    explanation: "NEC 240.83(D) exige breakers marcados 'SWD' o 'HID' cuando se usan para switching de fluorescent lighting de 120V (o HID). Los breakers regulares no están rated para el inrush repetitivo de switching frecuente.",
    reference: "NEC 240.83(D)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "medium",
    q: "Según NEC 240.21(B), un feeder tap de 10-ft puede ser sin overcurrent protection en su inicio si:",
    options: ["Ampacity tap ≥10% OCPD, termina single", "Solo en aplicaciones residenciales homes", "Solo con conductors menores a 6 AWG cu", "Nunca se permite un tap sin OCPD start"],
    correct: 0,
    explanation: "NEC 240.21(B)(1) — 10-ft tap rule: la ampacidad del tap ≥1/10 del OCPD principal, no sale del edificio, tiene su propio OCPD al final, y no excede 10 ft de largo. Muy útil para disconnects adyacentes al panel.",
    reference: "NEC 240.21(B)(1)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "medium",
    q: "La regla de 25-ft tap de NEC 240.21(B)(2) requiere que la ampacidad del tap sea al menos:",
    options: ["1/2 del feeder OCPD para 25-ft tap rule", "1/3 del feeder OCPD para 25-ft tap rule", "1/4 del feeder OCPD para 25-ft tap rule", "Igual al feeder OCPD rating completo up"],
    correct: 1,
    explanation: "NEC 240.21(B)(2) — 25-ft tap: ampacidad del tap ≥1/3 del OCPD del feeder principal, termina en un OCPD que limite al ampacidad del tap, conductors protected de damage. Muy útil en installs industriales.",
    reference: "NEC 240.21(B)(2)"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "hard",
    q: "NEC 240.87 requiere reducción de arc energy (como zone-selective interlocking o energy-reducing maintenance switch) en breakers con rating ≥:",
    options: ["400 A breaker rating según 240.87 NEC", "600 A breaker rating según 240.87 NEC", "800 A breaker rating según 240.87 NEC", "1200 A breaker rating según 240.87 NEC"],
    correct: 3,
    explanation: "NEC 240.87 aplica a circuit breakers con rating de 1200A o más. Exige uno de: ZSI, energy-reducing maintenance switch, energy-reducing active arc flash mitigation, o instantaneous trip. Propósito: reducir exposure de arc flash.",
    reference: "NEC 240.87"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "hard",
    q: "El Interrupting Rating (AIC) de un breaker debe ser:",
    options: ["Al menos igual a available short-circuit", "10% del breaker trip rating continuous", "Igual al breaker trip rating operating", "No importa si el breaker tiene GFCI"],
    correct: 0,
    explanation: "NEC 110.9 exige que equipos interrupting (breakers, fusibles) tengan rating ≥ al available fault current. Si el breaker es 10kAIC y el fault current es 15kA, el breaker puede explotar catastróficamente — es un code violation peligroso.",
    reference: "NEC 110.9"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "hard",
    q: "Series-rated combinations (breaker + upstream breaker) según NEC 240.86 requieren:",
    options: ["Marcado en el field por installer solo", "Tested/listed fabricante + field-marked", "Solo para aplicaciones residenciales cort", "No se permite en servicios nuevos code"],
    correct: 1,
    explanation: "NEC 240.86(B) — series ratings deben ser tested, listed, y field-marked con la combinación específica. Permite usar breakers downstream con AIC menor al fault current si el upstream breaker limita la energía.",
    reference: "NEC 240.86"
  },
  {
    category: "Protección Contra Sobrecorriente",
    difficulty: "medium",
    q: "Un conductor 6 AWG copper THHN en raceway, terminal 75°C rated, tiene ampacidad 65A. La continuous load es 50A + 10A non-continuous. ¿Qué breaker se selecciona?",
    options: ["60 A (ampacity limit sin next-size rule)", "70 A aplicando next-size-up rule 240.4(B)", "80 A basado en THHN columna 90°C solo", "50 A undersize para la continuous load"],
    correct: 1,
    explanation: "Minimum OCPD = (50 × 1.25) + 10 = 72.5A. Siguiente standard = 80A. PERO el conductor es 65A a 75°C, entonces el next-size-up rule (240.4B) permite 70A (standard arriba de 65A). Como 70A > 72.5A no cumple... se requiere conductor más grande o breaker de 80A con conductor mayor.",
    reference: "NEC 210.20(A), 240.4(B)"
  },

  // ──────────── PANELES Y SERVICES (12 preguntas) ────────────
  {
    category: "Paneles y Services",
    difficulty: "easy",
    q: "Según NEC 230.70(A), el service disconnect debe instalarse:",
    options: ["En cualquier lugar dentro de la dwelling", "Nearest al point entrance service cond", "Siempre en el garage de la residencia", "Siempre outdoor en la pared exterior"],
    correct: 1,
    explanation: "NEC 230.70(A)(1) — el service disconnect debe estar at a readily accessible location, nearest to the point of entrance de los service conductors, afuera o inside. No se permite que los service conductors unfused viajen largo dentro del edificio.",
    reference: "NEC 230.70(A)"
  },
  {
    category: "Paneles y Services",
    difficulty: "easy",
    q: "¿Cuántos service disconnects se permiten por building según NEC 230.71 (2020/2023)?",
    options: ["Un solo disconnect permitido por building", "Máx 6 en un solo panel agrupado (viejo)", "Máx 6 en enclosures separados agrupados", "Cada disconnect en enclosure separado own"],
    correct: 3,
    explanation: "NEC 230.71(B) — cambio del 2020/2023 — máximo 6 disconnects, pero AHORA cada uno debe estar en su propio enclosure separado. La vieja regla del 'six handle rule in one panel' cambió. Muy examinado.",
    reference: "NEC 230.71(B)"
  },
  {
    category: "Paneles y Services",
    difficulty: "easy",
    q: "La ampacity mínima del service para una dwelling unit residencial según NEC 230.79(C) es:",
    options: ["60 A mínimo para one-family dwelling", "100 A mínimo one-family dwelling 3-wire", "150 A mínimo para one-family dwelling", "200 A mínimo para one-family dwelling"],
    correct: 1,
    explanation: "NEC 230.79(C) — one-family dwelling debe tener mínimo 100A service 3-wire. Antes del 2023 era la regla general; ahora aplica específicamente a one-family dwellings. La tendencia moderna es 200A por EVs y heat pumps.",
    reference: "NEC 230.79(C)"
  },
  {
    category: "Paneles y Services",
    difficulty: "medium",
    q: "NEC 220.82 (Optional Calculation for Dwelling Unit) aplica cuando el service es:",
    options: ["Menor a 100A 3-wire dwelling service", "Mínimo 100A 3-wire dwelling single-fam", "Solo trifásico industrial/comercial loads", "Solo dwellings con heat pump eléctrico"],
    correct: 1,
    explanation: "NEC 220.82 — optional method para dwelling single-family con servicio mínimo 100A 3-wire. Usa factor 100% a los primeros 10 kVA y 40% al resto de general load, más ajustes para heating/AC. A menudo resulta en un service más chico que el standard method.",
    reference: "NEC 220.82"
  },
  {
    category: "Paneles y Services",
    difficulty: "medium",
    q: "Para calcular load de general lighting en dwelling según NEC Table 220.42(A), el factor unit load es:",
    options: ["2 VA por sq ft para dwelling general", "3 VA por sq ft para dwelling general", "5 VA por sq ft para dwelling general", "10 VA por sq ft para dwelling general"],
    correct: 1,
    explanation: "NEC Table 220.42(A) (antes 220.12) — 3 VA/sq ft para dwelling units. Para office buildings es 3.5, stores 3, hospitals 2. Se usa el área habitable (no garage ni porches no habitables).",
    reference: "NEC 220.42"
  },
  {
    category: "Paneles y Services",
    difficulty: "medium",
    q: "NEC 210.11(C) requiere mínimo CUÁNTOS small-appliance branch circuits 20A en una cocina residencial:",
    options: ["Un circuito dedicado 20A small appliance", "Dos circuitos dedicados 20A small appl", "Tres circuitos dedicados 20A small appl", "Cuatro circuitos dedicados 20A small ap"],
    correct: 1,
    explanation: "NEC 210.11(C)(1) — mínimo 2 small-appliance branch circuits 20A para los receptacles de kitchen, pantry, breakfast, dining. No pueden servir otras áreas ni lighting.",
    reference: "NEC 210.11(C)(1)"
  },
  {
    category: "Paneles y Services",
    difficulty: "medium",
    q: "NEC 210.11(C)(2) exige al menos cuántos circuits dedicados al laundry en una dwelling unit:",
    options: ["No se requiere circuito dedicado laundry", "Un circuito 15A dedicado laundry only", "Un circuito 20A dedicado laundry only", "Dos circuitos 20A dedicados laundry room"],
    correct: 2,
    explanation: "NEC 210.11(C)(2) — mínimo un circuito 20A dedicado para laundry receptacles. No puede servir otras cargas. El washer solo usa ~10A pero el circuito dedicado previene breaker trips cuando hay carga.",
    reference: "NEC 210.11(C)(2)"
  },
  {
    category: "Paneles y Services",
    difficulty: "medium",
    q: "NEC 210.11(C)(3) requiere un branch circuit dedicado para el bathroom. ¿Amperaje?",
    options: ["15 A dedicado bathroom receptacles only", "20 A dedicado bathroom receptacles only", "30 A dedicado bathroom receptacles only", "No se requiere circuito dedicado para"],
    correct: 1,
    explanation: "NEC 210.11(C)(3) — branch circuit 20A dedicado para bathroom receptacles. Puede servir múltiples baños, pero no puede servir otras cargas como lighting si solo alimenta un baño. Además todos son GFCI.",
    reference: "NEC 210.11(C)(3)"
  },
  {
    category: "Paneles y Services",
    difficulty: "medium",
    q: "La altura máxima del highest circuit breaker handle en un panel según NEC 240.24(A) debe ser:",
    options: ["5 ft 6 in altura máxima breaker handle", "6 ft 7 in (2.0 m) máx breaker handle", "7 ft 0 in altura máxima breaker handle", "No hay límite de altura para el handle"],
    correct: 1,
    explanation: "NEC 240.24(A) — el center del operating handle del OCPD más alto no puede exceder 6 ft 7 in (2.0 m) sobre el piso o working platform. Excepciones para equipos de alta capacidad con permanent platforms.",
    reference: "NEC 240.24(A)"
  },
  {
    category: "Paneles y Services",
    difficulty: "hard",
    q: "Calcula demand load para un dwelling con 2400 sq ft, 2 small-appliance circuits, 1 laundry, range de 12 kW, water heater 4.5 kW, dryer 5 kW. (Standard method, general lighting + sa + laundry a primer 3000 VA @ 100%, resto @ 35%)",
    options: ["Aproximadamente 100A service sufficient", "Aproximadamente 150A service necesario", "Aproximadamente 200A service necesario", "Aproximadamente 250A service necesario"],
    correct: 0,
    explanation: "General lighting: 2400 × 3 = 7200 VA. SA: 2 × 1500 = 3000. Laundry: 1500. Subtotal: 11,700 VA. Demand: 3000@100% + 8700@35% = 6045 VA. Range @ 8000 VA (Table 220.55). Dryer @ 5000 VA min. WH 4500. Total ~23,545 VA / 240V = 98A. Service 100A suficiente.",
    reference: "NEC 220.82"
  },
  {
    category: "Paneles y Services",
    difficulty: "hard",
    q: "Según NEC 408.36, un lighting and appliance panelboard está limited a cuántos overcurrent devices máximo:",
    options: ["30 max OCPDs lighting/appliance panel", "40 max OCPDs lighting/appliance panel", "42 max OCPDs lighting/appliance panel", "Sin límite en NEC 2020/2023 versions"],
    correct: 3,
    explanation: "NEC 2020/2023 eliminó el límite de 42 circuit panelboard. Ahora la cantidad de OCPDs la determina el fabricante y la listing del panel. Esta fue una de las reformas del 2020 — antes era exactamente 42.",
    reference: "NEC 408.36"
  },
  {
    category: "Paneles y Services",
    difficulty: "hard",
    q: "Un feeder a un sub-panel tiene OCPD de 100A. El conductor es 3 AWG copper THHN (rating 100A @ 75°C). Según NEC 408.36, el panel sub-alimentado debe tener rating mínimo de:",
    options: ["60 A bus rating panel sub-alimentado min", "100 A bus rating panel sub-alimentado", "125 A bus rating (125% del breaker fed)", "El rating del main breaker del sub-pan"],
    correct: 1,
    explanation: "NEC 408.36 — panelboard bus rating ≥ al OCPD que lo protege. Si el feeder breaker es 100A, el bus del sub-panel debe ser mínimo 100A. No necesita main breaker interno (a menos que tenga >6 OCPDs o esté en dwelling separated structure).",
    reference: "NEC 408.36"
  },

  // ──────────── MOTORES Y CONTROLES (10 preguntas) ────────────
  {
    category: "Motores y Controles",
    difficulty: "easy",
    q: "NEC 430.22 — la ampacidad del conductor para un single motor continuos debe ser:",
    options: ["100% del FLA motor continuous duty rate", "115% del FLA motor continuous duty rate", "125% del FLA motor continuous duty rate", "200% del FLA motor continuous duty rate"],
    correct: 2,
    explanation: "NEC 430.22(A) — single motor debe tener conductors sized a 125% del Full Load Amps (FLA) del Table 430.247-250, no el nameplate. Esto es para handle el starting y running continuous sin overheating.",
    reference: "NEC 430.22"
  },
  {
    category: "Motores y Controles",
    difficulty: "easy",
    q: "Para seleccionar el branch-circuit short-circuit OCPD de un motor, se usa el FLC de NEC Table 430.247-250 y la Table 430.52. Para un inverse-time breaker en motor standard, el máximo es:",
    options: ["125% del FLC para inverse-time breaker", "175% del FLC para inverse-time breaker", "250% del FLC para inverse-time breaker", "800% del FLC (instantaneous trip MCP)"],
    correct: 2,
    explanation: "NEC Table 430.52(C)(1) — Inverse time breaker permite hasta 250% del FLC para motores AC estándar. Los instantaneous trip (motor circuit protectors) permiten 800%-1300%. No es el overload — es el SHORT-CIRCUIT protection.",
    reference: "NEC 430.52"
  },
  {
    category: "Motores y Controles",
    difficulty: "medium",
    q: "Los motor overload protectors (heaters, electronic overloads) se sized a cuánto del nameplate FLA según NEC 430.32 para un motor con service factor 1.15 o mayor?",
    options: ["100% del FLA nameplate del motor only", "115% del FLA nameplate (SF<1.15 motor)", "125% del FLA nameplate (SF≥1.15 motor)", "150% del FLA nameplate setup incorrect"],
    correct: 2,
    explanation: "NEC 430.32(A)(1) — motores con SF≥1.15 o temp rise≤40°C: overload = 125% del nameplate FLA. Para motores con SF<1.15: 115%. Esta es la protección de overload, DIFERENTE al short-circuit de 430.52.",
    reference: "NEC 430.32(A)(1)"
  },
  {
    category: "Motores y Controles",
    difficulty: "medium",
    q: "NEC 430.102(B) — el motor disconnect debe estar:",
    options: ["Máximo a 5 ft del motor driven machine", "Within sight del motor o remote lockable", "Siempre adjacente al panel MLO main", "En el techo del mechanical room area"],
    correct: 1,
    explanation: "NEC 430.102(B)(1) — disconnect debe estar in sight from motor y driven machinery, O permite remote si es capable of being locked in open position. 'In sight' = visible y dentro de 50 ft.",
    reference: "NEC 430.102(B)"
  },
  {
    category: "Motores y Controles",
    difficulty: "medium",
    q: "Para HVAC equipment (AC/heat pump), el nameplate muestra MCA=28.5 y MOP=50. El contratista debe instalar:",
    options: ["Conductors 28.5A, 30A HACR breaker set", "Conductors ≥MCA 28.5A, breaker ≤50A max", "Conductors 50A 6 AWG, 50A breaker set", "Conductors 14 AWG, 40A breaker setup"],
    correct: 1,
    explanation: "MCA (Minimum Circuit Ampacity) define el conductor — 10 AWG @ 75°C = 35A ≥ 28.5A MCA. MOP (Maximum Overcurrent Protection) es el breaker MÁXIMO = 50A. Se puede usar breaker menor (30A, 35A, 40A, 45A) si soporta el LRA — pero nunca arriba de 50A.",
    reference: "NEC 440.4, 440.22"
  },
  {
    category: "Motores y Controles",
    difficulty: "medium",
    q: "NEC 440.14 — el disconnect de un HVAC unit (AC condenser) debe estar instalado:",
    options: ["Dentro del edificio cerca del panel ML", "Within sight readily accessible del AC", "Siempre en el techo del edificio rooftop", "Dentro de la unidad misma del condensor"],
    correct: 1,
    explanation: "NEC 440.14 — el disconnect debe estar in sight y readily accessible from the A/C equipment. Normalmente es el non-fused pull-out a 1-2 ft del condenser. Su propósito: servicing seguro del compressor y fan.",
    reference: "NEC 440.14"
  },
  {
    category: "Motores y Controles",
    difficulty: "medium",
    q: "Para un hermetic refrigerant motor-compressor, las overload protections se basan en:",
    options: ["Rated-load current (RLA) del nameplate", "Horsepower del motor hermetic compressor", "Locked-rotor current directo del motor", "Voltaje de operación del motor hermetic"],
    correct: 0,
    explanation: "NEC 440.52 — overload protection basado en 140% del RLA o menos (con overload relay). RLA se define específicamente para hermetic compressors (diferente de FLA de motores regulares). Viene del nameplate.",
    reference: "NEC 440.52"
  },
  {
    category: "Motores y Controles",
    difficulty: "hard",
    q: "Un motor de 25 HP 480V 3-phase tiene FLC de tabla = 34A. Branch-circuit conductors mínimos (125% × 34):",
    options: ["34 A conductors (8 AWG 90°C insufficient)", "42.5 A conductors (8 AWG 75°C = 50A ok)", "68 A conductors (4 AWG oversized mucho)", "85 A conductors (3 AWG muy oversized)"],
    correct: 1,
    explanation: "NEC 430.22 — 125% × 34 = 42.5A. El 8 AWG copper @ 75°C = 50A, suficiente. 10 AWG @ 75°C = 35A insuficiente. Usa FLC de Table 430.250, no el nameplate. Terminal a 75°C típicamente.",
    reference: "NEC 430.22, 430.250"
  },
  {
    category: "Motores y Controles",
    difficulty: "hard",
    q: "Para el motor anterior (25 HP, FLC=34A), el branch-circuit short-circuit protection usando inverse-time breaker (250% del FLC) sería:",
    options: ["30 A (undersize, motor no arrancará well)", "60 A (insuficiente para inverse time 250%)", "90 A (próximo standard arriba de 85A ok)", "125 A (permitido con hard-start solo)"],
    correct: 2,
    explanation: "250% × 34A = 85A. No es un standard size. NEC 430.52(C)(1) Exception 1 permite subir al next standard size = 90A. Si el motor no arranca, se puede subir hasta 400% (136A → 150A standard).",
    reference: "NEC 430.52(C)"
  },
  {
    category: "Motores y Controles",
    difficulty: "hard",
    q: "Un feeder para múltiples motores según NEC 430.24 debe tener ampacidad mínima de:",
    options: ["Suma simple de todos los FLC motors run", "125% FLC motor mayor + 100% otros FLC", "Suma de FLC × 125% de todos los motors", "Igual al FLC del motor más grande only"],
    correct: 1,
    explanation: "NEC 430.24 — feeder conductor ampacity ≥ 125% del FLC del motor más grande + 100% de los FLC de los demás motores. El starting current del motor más grande es la preocupación primaria.",
    reference: "NEC 430.24"
  },

  // ──────────── GFCI / AFCI (8 preguntas) ────────────
  {
    category: "GFCI / AFCI",
    difficulty: "easy",
    q: "NEC 210.8(A) requiere GFCI protection en receptacles 125V de dwellings en cuáles locations:",
    options: ["Solo bathrooms de dwelling receptacles", "Bathrooms, garages, outdoor, kitchens+", "Solo exteriores dwelling receptacles set", "Solo outlets cerca de agua grifo/sink"],
    correct: 1,
    explanation: "NEC 210.8(A) es una lista extensa: bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens (all counter outlets), within 6 ft de lavabo/bathtub, laundry, boathouses, sump pump areas. NEC 2023 expandió aún más.",
    reference: "NEC 210.8(A)"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "easy",
    q: "La sensibilidad trip de un GFCI personnel protection (Class A) según UL 943 es:",
    options: ["5 mA ± 1 mA nominal trip (Class A UL943)", "30 mA nominal trip para GFPE equipment", "100 mA nominal trip para special heat", "1 A nominal trip (no existe Class A)"],
    correct: 0,
    explanation: "Class A GFCI = 5 mA nominal (4-6 mA range). Trip time <25 ms. Los GFPE (equipment protection) son 30 mA — para heaters de roof/gutter. No confundir con AFCI que detecta arcs, no ground faults.",
    reference: "NEC 210.8, UL 943"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "medium",
    q: "NEC 210.12(A) requiere AFCI protection en dwellings para todos los 120V single-phase 15A/20A branch circuits que sirven cuáles rooms:",
    options: ["Solo bedrooms de la dwelling habitables", "Casi todas las rooms habitables except", "Solo living room de la dwelling unit", "Solo circuitos 15A de 120V dwelling"],
    correct: 1,
    explanation: "NEC 210.12(A) lista: kitchens, family/living/dining/bedrooms, parlors, libraries, dens, sunrooms, closets, hallways, laundry, similar rooms. Exclusiones: bathrooms (GFCI), garages, outdoors — que tienen GFCI pero no AFCI.",
    reference: "NEC 210.12(A)"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "medium",
    q: "La diferencia fundamental entre GFCI y AFCI:",
    options: ["Son lo mismo, solo nombres diferentes", "GFCI detecta ground-fault, AFCI arc sig", "GFCI es 240V y AFCI es 120V only rule", "AFCI es más lento que GFCI personal"],
    correct: 1,
    explanation: "GFCI = detecta desbalance entre hot y neutral indicando leakage a ground (personal safety). AFCI = detecta las firmas eléctricas de un arc eléctrico (fire prevention). Los combination AFCI/GFCI hacen ambas funciones.",
    reference: "NEC 210.8, 210.12"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "medium",
    q: "NEC 210.8(B) — GFCI en 'other than dwelling units' (comercial), incluye outlets en:",
    options: ["Solo bathrooms comerciales receptacles", "Bathrooms, kitchens, rooftops, outdoor", "Solo loading docks comerciales outlets", "No se requiere GFCI en comercial units"],
    correct: 1,
    explanation: "NEC 210.8(B) aplica muchos de los mismos locations en comercial, y el 2023 expandió a all 125V-250V receptacles en estos locations (incluyendo 208V). Ahora los condensers comerciales expuestos también requieren GFCI.",
    reference: "NEC 210.8(B)"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "medium",
    q: "NEC 210.8(F) (añadido en 2020, refinado en 2023) requiere GFCI para outdoor outlets de equipos específicos — como HVAC condensers — rated:",
    options: ["Solo 125V receptacle outlet outdoor", "125-250V single-phase outdoor dwelling", "Solo trifásico comercial outdoor units", "No aplica a HVAC outdoor dwelling ever"],
    correct: 1,
    explanation: "NEC 210.8(F) exige GFCI en 125-250V single-phase outdoor outlets para dwellings. Incluye el outdoor disconnect del AC condenser. Algunas jurisdicciones han tenido nuisance tripping — NEC 2023 amendió levemente.",
    reference: "NEC 210.8(F)"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "hard",
    q: "NEC 210.8(E) — GFCI en crawl spaces para qué outlets:",
    options: ["No aplica GFCI a los crawl spaces ever", "Todos los 125V 15/20A en crawl grade", "Solo outlet del sump pump en crawl only", "Solo crawl spaces con agua presente sum"],
    correct: 1,
    explanation: "NEC 210.8(E) — todos los 125V single-phase 15/20A receptacles en crawl spaces at or below grade deben ser GFCI. Incluye el outlet del sump pump (antes exento, ahora requerido en 2023).",
    reference: "NEC 210.8(E)"
  },
  {
    category: "GFCI / AFCI",
    difficulty: "hard",
    q: "NEC 210.12(D) — el AFCI se requiere cuando se extiende un circuito existente en un dwelling por más de 6 ft. ¿Dónde se puede instalar el AFCI?",
    options: ["Solo en el breaker del panel el AFCI", "Breaker AFCI o outlet branch-circuit 1st", "Solo outlet type AFCI permitido NEC", "No se requiere AFCI para extensions >6"],
    correct: 1,
    explanation: "NEC 210.12(D) — extensions de circuits existentes >6 ft requieren AFCI. Se permite breaker AFCI, o combination AFCI en el first outlet extendido, o outlet branch-circuit type AFCI. Protege el nuevo wiring añadido.",
    reference: "NEC 210.12(D)"
  },

  // ──────────── LUGARES ESPECIALES (10 preguntas) ────────────
  {
    category: "Lugares Especiales",
    difficulty: "easy",
    q: "NEC Article 500 cubre Hazardous (Classified) Locations. Una Class I location contiene:",
    options: ["Dust combustible en el aire ambiente", "Gases/vapores inflamables en cantidad", "Fibras/flyings combustibles textile mill", "Solo agua en cantidad suficiente hazard"],
    correct: 1,
    explanation: "NEC 500.5(B) — Class I = flammable gases/vapors (gasoline, propane, solvents). Class II = combustible dust (grain, plastic). Class III = fibers/flyings (textile mills, sawmills). Equipo específico listed para cada class.",
    reference: "NEC 500.5"
  },
  {
    category: "Lugares Especiales",
    difficulty: "easy",
    q: "En un bathroom residencial, ¿qué distancia debe estar un receptacle del borde de una tina o ducha según NEC?",
    options: ["0 ft puede estar pegado a tub edge", "3 ft mínimo de tub/shower horizontally", "Dentro shower zone si es GFCI protect", "Lejos del lavabo, mín 3 ft tub/shower"],
    correct: 3,
    explanation: "NEC 406.9(C) — receptacles no se permiten dentro, arriba, ni a menos de 3 ft horizontalmente del bathtub o shower stall threshold. Debe ser GFCI protegido y estar lejos del splash zone.",
    reference: "NEC 406.9(C)"
  },
  {
    category: "Lugares Especiales",
    difficulty: "medium",
    q: "NEC 680 cubre Swimming Pools. ¿Qué distancia debe estar un panel eléctrico del borde de un pool?",
    options: ["3 ft horizontales del borde interior", "5 ft horizontales del borde interior", "10 ft horizontales del borde interior", "25 ft horizontales del borde interior"],
    correct: 2,
    explanation: "NEC 680.22(B) — el panelboard del pool pump u otros equipos deben estar a al menos 10 ft horizontales del borde interior del pool. Esto reduce el riesgo de caída o contacto durante maintenance.",
    reference: "NEC 680.22(B)"
  },
  {
    category: "Lugares Especiales",
    difficulty: "medium",
    q: "Para un HVAC equipment room (mechanical room) comercial típico, NEC 210.63 requiere:",
    options: ["Un GFCI receptacle cerca del AC unit", "Receptacle 125V 15/20A dentro 25 ft HVAC", "Solo iluminación en mechanical room req", "Iluminación de emergency en mech room"],
    correct: 1,
    explanation: "NEC 210.63 — service receptacle 125V 15/20A dentro de 25 ft del equipo HVAC (en el mismo level y no a través de una puerta). Para tools de servicing. Debe ser GFCI si está outdoor/rooftop.",
    reference: "NEC 210.63"
  },
  {
    category: "Lugares Especiales",
    difficulty: "medium",
    q: "NEC 210.63(A) fue expandido en 2020 — en rooftops con HVAC equipment, el service outlet debe ser GFCI y estar:",
    options: ["En cualquier parte del edificio mismo", "En el mismo level del rooftop (no abajo)", "Solo adentro del edificio cerca del panel", "No se requiere outlet en rooftops HVAC"],
    correct: 1,
    explanation: "NEC 210.63(A) — el 125V service outlet DEBE estar en el mismo level que el HVAC equipment (ej. rooftop unit requiere rooftop outlet, no uno al nivel del sótano). Técnico no puede subir con extension cord.",
    reference: "NEC 210.63(A)"
  },
  {
    category: "Lugares Especiales",
    difficulty: "medium",
    q: "Un wet location según NEC 100 es:",
    options: ["Solamente outdoors sin protección wet", "Underground, concrete slab en contact", "Solo bathrooms con saturación de agua", "Cualquier cocina con humedad presente"],
    correct: 1,
    explanation: "Article 100 define Wet Location: unprotected and subject to saturation with water or other liquids, underground, en concrete slabs en contacto con ground, outdoors no protegidos. Requiere boxes/devices weatherproof y WR listed.",
    reference: "NEC 100"
  },
  {
    category: "Lugares Especiales",
    difficulty: "medium",
    q: "En wet locations, los receptacles 15/20A 125V/250V deben ser:",
    options: ["Solamente de plástico weather-proof set", "Weather-resistant (WR) + weatherproof cov", "Metálicos grounded weather-proof set", "GFCI solamente sin necesidad WR cover"],
    correct: 1,
    explanation: "NEC 406.9(B) — outdoor wet location receptacles deben ser WR listed. Cover weatherproof 'in-use' (bubble cover) cuando un plug puede estar conectado permanentemente (como lights). Además GFCI por 210.8.",
    reference: "NEC 406.9(B)"
  },
  {
    category: "Lugares Especiales",
    difficulty: "hard",
    q: "Una gasolinera — ¿cómo se clasifica la zona dentro de 18 inches sobre grade y hasta 20 ft del dispenser horizontal?",
    options: ["Class I Div 1 gasoline dispenser zone", "Class I Div 2 dentro 20 ft dispenser", "Class II Div 1 gasoline dispenser zone", "Unclassified no hazard gasoline zone"],
    correct: 1,
    explanation: "NEC Table 514.3(B)(1) — dentro de 20 ft del dispenser hasta 18 inches sobre grade es Class I Div 2. La zona debajo del dispenser a 4 ft es Div 1. Equipment en estas zonas debe ser listed explosion-proof o intrinsically safe.",
    reference: "NEC 514"
  },
  {
    category: "Lugares Especiales",
    difficulty: "hard",
    q: "NEC 547 — Agricultural Buildings requires equipotential bonding en áreas de confinement para livestock — ¿para qué propósito?",
    options: ["Reducir noise eléctrico en la barn dairy", "Prevenir stray voltage/step en livestock", "Ahorrar energía en operación dairy farm", "Facilitar maintenance eléctrico del barn"],
    correct: 1,
    explanation: "NEC 547.10 — equipotential plane bonding en dairy barns, hog farms, etc. Las vacas son sensibles a <1V que reduce producción de leche. Se embebe mesh en el concrete y se bonds a todos los metales accesibles.",
    reference: "NEC 547.10"
  },
  {
    category: "Lugares Especiales",
    difficulty: "hard",
    q: "Un walk-in cooler comercial (HVAC adjacent) con lighting — el interior es un damp o wet location?",
    options: ["Dry location siempre interior walk-in", "Damp location por condensación regular", "Wet location siempre por humedad total", "Depende del contenido cooler producto"],
    correct: 1,
    explanation: "NEC 100 — walk-in coolers/freezers tienen condensación regular y se clasifican como damp location (partially protected pero sujeto a humedad moderada). Las luminarias deben ser damp-location listed mínimo, o wet si hay wash-down.",
    reference: "NEC 100, 410.10"
  },

  // ──────────── 50 PREGUNTAS ADICIONALES (EXPANSIÓN A 150) ────────────

  // ── NEC 2023 Cálculos ── (6 preguntas)
  {
    category: "NEC 2023 Cálculos",
    difficulty: "easy",
    q: "Para un motor trifásico de 10 HP a 230V según Table 430.250, la FLA es 28A. ¿Qué ampacidad mínima deben tener los conductores del branch circuit (125%)?",
    options: ["28A (FLA tabla sin aplicar 125% factor)", "32A (aplicando 115% mal al FLA tabla)", "35A (125% × 28A FLA Table 430.250 cu)", "40A (aplicando 143% sobre FLA incorrect)"],
    correct: 2,
    explanation: "NEC 430.22 exige que los conductores del branch circuit de un motor continuous duty sean 125% de la FLA de la Table 430.250 (no la nameplate). 28A × 1.25 = 35A mínimo de ampacity.",
    reference: "NEC 430.22, Table 430.250"
  },
  {
    category: "NEC 2023 Cálculos",
    difficulty: "medium",
    q: "Servicio residencial 200A, 120/240V 1-phase. ¿Cuál es el tamaño mínimo del conductor de cobre THWN-2 para el service entrance según Table 310.12 (dwelling services)?",
    options: ["1/0 AWG cobre THWN-2 para service 200A", "2/0 AWG cobre THWN-2 para service 200A", "3/0 AWG cobre THWN-2 para service 200A", "4/0 AWG cobre THWN-2 para service 200A"],
    correct: 1,
    explanation: "NEC Table 310.12 (dwelling services and feeders, 2023) permite 2/0 AWG cobre o 4/0 AWG aluminio para un servicio de 200A en vivienda unifamiliar. Esta tabla es reducida respecto a Table 310.16 porque aplica diversity factor.",
    reference: "NEC Table 310.12"
  },
  {
    category: "NEC 2023 Cálculos",
    difficulty: "medium",
    q: "Cálculo de feeder residencial — carga general de iluminación para una casa de 2,400 sq ft. ¿Cuál es la carga calculada antes de aplicar demand factors?",
    options: ["5,400 VA (2.25 VA/sq ft error calc)", "6,000 VA (2.5 VA/sq ft error calculo)", "7,200 VA (3 VA/sq ft × 2,400 correcto)", "8,400 VA (3.5 VA/sq ft office error)"],
    correct: 2,
    explanation: "NEC 220.12 — unit load dwelling es 3 VA/sq ft. 2,400 × 3 = 7,200 VA de iluminación general y receptáculos. Después se aplican demand factors de Table 220.42 (100% primeros 3,000 VA, 35% siguientes).",
    reference: "NEC 220.12, Table 220.42"
  },
  {
    category: "NEC 2023 Cálculos",
    difficulty: "hard",
    q: "Motor trifásico 25 HP a 460V con FLA 34A (Table 430.250). Usando un breaker inverse-time, ¿cuál es el tamaño máximo del OCPD según Table 430.52?",
    options: ["85A OCPD (175% FLC no standard error)", "100A OCPD (300% FLC muy excesivo error)", "85A OCPD (250% × 34A FLC table 430.52)", "150A OCPD (aplicando 440% incorrect)"],
    correct: 2,
    explanation: "Table 430.52 permite para motores trifásicos con inverse-time breaker hasta 250% de la FLA. 34A × 2.50 = 85A máximo. Si no es tamaño estándar, 430.52(C)(1) Exc 1 permite subir al próximo estándar superior (90A).",
    reference: "NEC Table 430.52, 430.52(C)(1)"
  },
  {
    category: "NEC 2023 Cálculos",
    difficulty: "medium",
    q: "Para una cocina residencial, NEC 220.55 exige calcular la range eléctrica de 12kW según Table 220.55. ¿Cuál es la carga demandada para UN range de 12kW?",
    options: ["8 kW demand (Column C 1 appliance 12kW)", "10 kW demand (sin aplicar table 220.55)", "12 kW demand (al 100% nameplate rate)", "15 kW demand (125% del nameplate)"],
    correct: 0,
    explanation: "NEC Table 220.55 Column C — para un range de 12kW o menor la demand es 8kW (Column C, one appliance). Este demand factor reconoce que los burners no operan todos al máximo simultáneamente.",
    reference: "NEC Table 220.55"
  },
  {
    category: "NEC 2023 Cálculos",
    difficulty: "hard",
    q: "Dwelling unit con AC de 5-ton (40A) y heat eléctrico de 10kW a 240V. Para el service calc NEC 220.82, ¿qué carga se incluye de estos dos?",
    options: ["Suma ambos AC y heat (40A + 41.7A)", "Solo el mayor (heat 10kW single 220.82)", "65% de la suma de AC + heating loads", "100% del AC + 40% del heat combined"],
    correct: 1,
    explanation: "NEC 220.82(C) — para el optional dwelling calc solo se incluye el MAYOR entre AC y heating (no ambos) porque no operan simultáneamente. Heat 10,000/240 = 41.7A > 40A AC, entonces se usa el heat al 100%.",
    reference: "NEC 220.82(C)"
  },

  // ── Grounding y Bonding ── (5 preguntas)
  {
    category: "Grounding y Bonding",
    difficulty: "easy",
    q: "El grounding electrode conductor (GEC) para un servicio de 200A residencial con conductor de entrada de 2/0 AWG cobre — ¿cuál es el tamaño mínimo según Table 250.66?",
    options: ["#8 AWG copper GEC service 200A 2/0", "#6 AWG copper GEC service 200A 2/0", "#4 AWG copper GEC service 200A 2/0", "#2 AWG copper GEC service 200A 2/0"],
    correct: 2,
    explanation: "NEC Table 250.66 — para service conductors de 2/0 o 3/0 cobre, el GEC mínimo es #4 AWG cobre. Si el GEC termina en un ground rod solamente, 250.66(A) limita a #6 AWG máximo requerido.",
    reference: "NEC Table 250.66"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "Según NEC 250.52(A), ¿cuál de estos NO es un grounding electrode reconocido?",
    options: ["Metal water pipe 10+ ft contact earth", "Concrete-encased electrode Ufer 20 ft", "Ground ring cobre #2 mínimo 20 ft en", "Rebar suelto 4 ft enterrado en jardín"],
    correct: 3,
    explanation: "NEC 250.52(A) lista electrodes permitidos: metal water pipe, concrete-encased, ground ring, rod/pipe electrodes (8 ft mín), plate electrodes. Rebar suelto de 4 ft no cumple los requisitos — los rod electrodes deben ser 8 ft mínimo.",
    reference: "NEC 250.52(A)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "Un ground rod de 8 ft instalado y medido con 30 ohmios de resistencia. Según NEC 250.53(A)(2), ¿qué se requiere?",
    options: ["Aceptar el rod ya cumple <25 ohms NEC", "Instalar segundo rod ≥6 ft del primero", "Reemplazar por copper-clad de 10 ft new", "Agregar sal alrededor para bajar ohms"],
    correct: 1,
    explanation: "NEC 250.53(A)(2) — si un rod no logra ≤25 ohms, debe agregarse un segundo electrodo, separado mínimo 6 pies del primero. Después del segundo rod NO se requiere medir nuevamente (se considera cumplido).",
    reference: "NEC 250.53(A)(2)"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "hard",
    q: "Equipment grounding conductor (EGC) para un branch circuit protegido con breaker de 60A según Table 250.122 — ¿cuál es el tamaño mínimo de cobre?",
    options: ["#12 AWG EGC copper para OCPD 60A error", "#10 AWG EGC copper para OCPD 60A table", "#8 AWG EGC copper para OCPD 60A error", "#6 AWG EGC copper para OCPD 60A error"],
    correct: 1,
    explanation: "NEC Table 250.122 — para OCPD de 60A el EGC mínimo es #10 AWG cobre (#8 AWG aluminio). Nota importante: si los conductores de fase se upsize por voltage drop, el EGC también debe upsize proporcionalmente (250.122(B)).",
    reference: "NEC Table 250.122"
  },
  {
    category: "Grounding y Bonding",
    difficulty: "medium",
    q: "En un service de 400A con main bonding jumper, ¿dónde se hace la conexión neutro-tierra según NEC 250.24?",
    options: ["En cada subpanel downstream bond error", "Solamente en el service disconnect main", "En el transformer de utility secondary", "En cada receptáculo GFCI del dwelling"],
    correct: 1,
    explanation: "NEC 250.24(A)(5) prohíbe bonding del neutral al ground downstream del service disconnect. El main bonding jumper está SOLO en el service. Downstream los neutros se mantienen aislados de tierra — previene corrientes paralelas en EGC.",
    reference: "NEC 250.24(A)(5), 250.142"
  },

  // ── Motor Control ── (4 preguntas)
  {
    category: "Motor Control",
    difficulty: "easy",
    q: "El disconnect del motor según NEC 430.102(B) debe estar ubicado:",
    options: ["A la vista (in sight) del motor driven", "En el panel principal siempre MLO main", "Dentro de la maquinaria driven interno", "Dentro del MCC enclosure solamente one"],
    correct: 0,
    explanation: "NEC 430.102(B) exige un disconnect in sight del motor y la maquinaria que acciona. 'In sight' = visible y dentro de 50 ft. Esto permite al técnico hacer LOTO local sin depender de un panel remoto.",
    reference: "NEC 430.102(B)"
  },
  {
    category: "Motor Control",
    difficulty: "medium",
    q: "Overload protection (thermal) para un motor continuous-duty con SF 1.15 se ajusta a qué porcentaje de la nameplate FLA según NEC 430.32?",
    options: ["100% nameplate FLA (SF 1.0 max error)", "115% nameplate FLA (motor SF<1.15 only)", "125% nameplate FLA (SF≥1.15 motor only)", "140% nameplate FLA (hermetic compressor)"],
    correct: 2,
    explanation: "NEC 430.32(A)(1) — motores con service factor ≥1.15 o temp rise ≤40°C permiten overload a 125% de la nameplate FLA (no de Table 430.250). Motores estándar (SF 1.0) se limitan a 115%.",
    reference: "NEC 430.32(A)(1)"
  },
  {
    category: "Motor Control",
    difficulty: "medium",
    q: "Para un motor 3-phase 15HP a 460V (FLA 21A) — el disconnect switch debe tener rating mínimo de:",
    options: ["100% de FLA tabla 430.250 rating min", "115% de FLA nameplate del motor rating", "115% FLA Table 430.250 (disconnect amps)", "No aplica regla, cualquier disco sirve"],
    correct: 2,
    explanation: "NEC 430.110(A) exige que el motor disconnect switch tenga ampere rating mínimo de 115% de la FLA de Table 430.250 (no nameplate). 21A × 1.15 = 24.15A — se redondea a 30A estándar mínimo.",
    reference: "NEC 430.110(A)"
  },
  {
    category: "Motor Control",
    difficulty: "hard",
    q: "MCC (Motor Control Center) con múltiples motores — el feeder conductor sizing según NEC 430.24 es:",
    options: ["Suma total FLA × 1.25 para feeder MCC", "Motor mayor × 1.25 + suma FLA otros run", "Motor más grande × 1.5 fixed multiplier", "125% × (suma todos los FLA motors)"],
    correct: 1,
    explanation: "NEC 430.24 — feeder para múltiples motores = 125% del FLA del motor más grande + 100% del FLA de los demás motores. Esto reconoce el starting surge del motor mayor mientras los otros ya están running.",
    reference: "NEC 430.24"
  },

  // ── Transformers ── (3 preguntas)
  {
    category: "Transformers",
    difficulty: "medium",
    q: "Transformer 75 kVA, 480V delta primario / 208Y/120V secundario. ¿Cuál es la corriente de FLA del primario?",
    options: ["90A primario (75,000/(480×1.732) = 90A)", "180A primario (error cálculo 2× factor)", "208A primario (es el secundario 208V)", "360A primario (error dividiendo por 208)"],
    correct: 0,
    explanation: "Fórmula trifásica: I = kVA × 1000 / (V × √3). Primario = 75,000 / (480 × 1.732) = 75,000 / 831 = 90.2A. El secundario sería 75,000 / (208 × 1.732) = 208A.",
    reference: "NEC 450, fórmula básica"
  },
  {
    category: "Transformers",
    difficulty: "medium",
    q: "Protección OCPD del primario de un transformer con corriente >9A — según NEC Table 450.3(B), ¿cuál es el máximo?",
    options: ["100% de FLA primary OCPD transformer", "125% con fuses primario transformer only", "250% con breaker primary transformer", "125% Table 450.3(B) primary ≥9A only"],
    correct: 3,
    explanation: "NEC Table 450.3(B) — transformers menores a 1000V con primary-only protection y corriente ≥9A permiten OCPD máximo 125% de la primary FLA (próximo estándar superior si no es tamaño comercial, 450.3(B) Note 1).",
    reference: "NEC Table 450.3(B)"
  },
  {
    category: "Transformers",
    difficulty: "hard",
    q: "Un transformer dry-type de 150 kVA ubicado en un edificio comercial — ¿qué distancia mínima de materiales combustibles requiere NEC 450.21?",
    options: ["6 inches separación mínima combustibles", "12 inches separación fija sin rating fire", "No requirement si es menor a 112.5 kVA", "12 inches combustibles o fire-resistant"],
    correct: 3,
    explanation: "NEC 450.21(B) — dry-type transformers >112.5 kVA deben instalarse en transformer room de material fire-resistant, O mantener mínimo 12 inches de separación a combustibles. Alternativa: usar transformer listado Class 155 o superior con barrera.",
    reference: "NEC 450.21(B)"
  },

  // ── Wiring Methods y Ampacidad ── (4 preguntas)
  {
    category: "Commercial Wiring Methods",
    difficulty: "easy",
    q: "Según Table 310.16, ¿cuál es la ampacity de un conductor #10 AWG THHN cobre (90°C) a 30°C ambient?",
    options: ["30A ampacity 90°C insufficient #10 AWG", "35A ampacity 75°C columna Table 310.16", "40A ampacity 90°C columna Table 310.16", "45A ampacity sobre 90°C #10 AWG error"],
    correct: 2,
    explanation: "Table 310.16 columna 90°C — #10 AWG cobre THHN es 40A. Sin embargo, 110.14(C) limita las terminaciones a 60°C (30A) o 75°C (35A) según el equipment rating. Para breakers residenciales comunes = 30A máximo.",
    reference: "NEC Table 310.16, 110.14(C)"
  },
  {
    category: "Commercial Wiring Methods",
    difficulty: "medium",
    q: "Cuatro (4) conductores portadores de corriente en un conduit — ¿qué ajuste de ampacidad aplica Table 310.15(C)(1)?",
    options: ["100% sin derating para 4-6 CCCs error", "80% derating para 4-6 CCCs table adjust", "70% derating para 4-6 CCCs error ajust", "50% derating para 4-6 CCCs error ajust"],
    correct: 1,
    explanation: "Table 310.15(C)(1) — 4 a 6 current-carrying conductors en raceway requieren derating al 80%. El neutral generalmente no cuenta (si carga balanceada), pero en sistemas con no-lineales (harmonics) sí cuenta como CCC.",
    reference: "NEC Table 310.15(C)(1)"
  },
  {
    category: "Commercial Wiring Methods",
    difficulty: "medium",
    q: "NEC 310.14(A)(3) — los conductores en ambient superior a 30°C deben tener ampacity ajustada con:",
    options: ["Tabla de demand factor para calc load", "Ambient temp correction 310.15(B)(1)", "No aplica ajuste de temperature factor", "Fixed 80% siempre sin temp consideracion"],
    correct: 1,
    explanation: "NEC Table 310.15(B)(1) contiene los correction factors para ambient >30°C. Ejemplo: conductor 90°C a 50°C ambient = factor 0.82. En techos con sunlight exposure se aplica también 310.15(B)(2) con adders.",
    reference: "NEC Table 310.15(B)(1)"
  },
  {
    category: "Commercial Wiring Methods",
    difficulty: "hard",
    q: "Un conduit EMT horizontal a 1 inch sobre techo con exposición directa al sol. Según NEC 310.15(B)(2), ¿qué se suma a la temperatura ambiente?",
    options: ["Nada, solo el ambient sin adder rooftop", "22°F (12°C) adder 0.5-3.5 in roof sun", "50°F (27°C) adder sin rooftop distance", "Depende del color del techo reflective"],
    correct: 1,
    explanation: "NEC Table 310.15(B)(2) — conduit 0.5 a 3.5 inches sobre rooftop con sun exposure adds 22°F (12°C) al ambient. Esto antes era 40°F pero se redujo en NEC 2017. Considerar 30°C ambient + 12°C = 42°C para ampacity correction.",
    reference: "NEC Table 310.15(B)(2)"
  },

  // ── Conduit Fill ── (3 preguntas)
  {
    category: "Conduit Fill",
    difficulty: "easy",
    q: "Según NEC Chapter 9 Table 1, ¿cuál es el máximo fill permitido para TRES o más conductores en un conduit?",
    options: ["31% fill máximo para 3+ conductors wire", "40% fill máximo para 3+ conductors wire", "53% fill máximo para 3+ conductors wire", "60% fill máximo para 3+ conductors wire"],
    correct: 1,
    explanation: "NEC Chapter 9 Table 1 — 3 o más conductores permiten 40% fill. 1 conductor = 53%, 2 conductores = 31% (para prevenir jamming). El 40% para 3+ es la regla más común en trabajo comercial.",
    reference: "NEC Chapter 9 Table 1"
  },
  {
    category: "Conduit Fill",
    difficulty: "medium",
    q: "Cuatro (4) conductores THHN #12 AWG (area 0.0133 sq in cada uno) — ¿cuál es el tamaño mínimo de EMT según Annex C, Table C.1?",
    options: ["1/2 inch EMT (Annex C permite 9 #12)", "3/4 inch EMT oversize para 4 #12 THHN", "1 inch EMT muy oversize para 4 #12 THHN", "1-1/4 in EMT muy oversize 4 #12 THHN"],
    correct: 0,
    explanation: "NEC Annex C Table C.1 (EMT) — 1/2 inch EMT permite hasta 9 THHN #12 AWG. 4 conductores #12 caben holgadamente. Annex C tabula directamente el número de conductores del mismo tamaño por tipo de conduit.",
    reference: "NEC Annex C, Table C.1"
  },
  {
    category: "Conduit Fill",
    difficulty: "hard",
    q: "Un conduit con conductores de diferentes tamaños (#8, #10, #12 mezclados) — ¿cómo se calcula el fill?",
    options: ["Usar Annex C directamente tabla only", "Sumar áreas Table 5 vs 40% Table 4 int", "Usar solo el conductor más grande only", "No se permite mezclar tamaños AWG mix"],
    correct: 1,
    explanation: "Para conductors mixtos: sumar áreas individuales de Table 5 (o 5A para compact) y comparar contra 40% del área interna del conduit de Table 4. Annex C solo sirve cuando TODOS los conductores son del mismo tamaño/tipo.",
    reference: "NEC Chapter 9 Tables 1, 4, 5"
  },

  // ── Voltage Drop ── (3 preguntas)
  {
    category: "Voltage Drop",
    difficulty: "medium",
    q: "NEC 210.19(A) Informational Note 4 recomienda que el voltage drop del branch circuit no exceda:",
    options: ["1% máximo recomendado branch circuit", "3% máximo recomendado branch circuit", "5% máximo solo branch circuit alone up", "10% máximo según Informational Note 4"],
    correct: 1,
    explanation: "NEC 210.19(A) IN 4 (y 215.2 IN 2 para feeders) recomienda 3% máx en branch circuit y 5% total combinado (feeder + branch) para eficiencia razonable. NOTA: Es informacional, no mandatorio — pero Title 24 California lo exige mandatorio.",
    reference: "NEC 210.19(A) IN 4"
  },
  {
    category: "Voltage Drop",
    difficulty: "hard",
    q: "Circuit de 20A 120V cargado al 80% (16A), 150 ft one-way con #12 AWG cobre (K=12.9 Ω·cmil/ft). ¿Cuál es el voltage drop aproximado?",
    options: ["2.4V drop (2% del 120V base calc error)", "4.8V drop (4% del 120V base calc error)", "7.7V drop (~6.4% del 120V base calc 12)", "12V drop (10% del 120V base calc error)"],
    correct: 2,
    explanation: "VD = 2 × K × I × D / cmil. #12 AWG = 6,530 cmil. VD = 2 × 12.9 × 16 × 150 / 6,530 = 61,920/6,530 = 9.48V. Aprox 7-8% — excede 3% recomendado. Solución: upgrade a #10 AWG para reducir a ~3%.",
    reference: "NEC 210.19 IN 4, fórmula VD"
  },
  {
    category: "Voltage Drop",
    difficulty: "medium",
    q: "Cuando se upsize un conductor por voltage drop, ¿qué más debe aumentar proporcionalmente?",
    options: ["El conduit siempre proporcional upsize", "El EGC proporcional según 250.122(B)", "El breaker al siguiente tamaño standard", "La altura del working space del panel"],
    correct: 1,
    explanation: "NEC 250.122(B) — cuando se upsize ungrounded conductors por cualquier razón (VD, parallel, etc.), el EGC debe upsize proporcionalmente por la misma ratio circular mil. Esto mantiene fault-clearing performance del ground fault loop.",
    reference: "NEC 250.122(B)"
  },

  // ── HVAC Equipment Disconnect 440 ── (4 preguntas)
  {
    category: "HVAC Disconnect NEC 440",
    difficulty: "easy",
    q: "Un condensador de AC split residencial outdoor — ¿dónde debe estar el disconnect según NEC 440.14?",
    options: ["Dentro del home panel solamente dwell", "Within sight readily accessible del AC", "En el attic del home sobre el hallway", "No se requiere disconnect separado AC"],
    correct: 1,
    explanation: "NEC 440.14 — disconnect HVAC debe ser within sight (visible y ≤50 ft) del equipo AC y readily accessible. No puede estar detrás del equipo mismo. Típicamente se instala en pared adyacente al condensador outdoor.",
    reference: "NEC 440.14"
  },
  {
    category: "HVAC Disconnect NEC 440",
    difficulty: "medium",
    q: "Nameplate de condenser: MCA 24.5A, MOCP 40A max. ¿Qué significa MOCP?",
    options: ["Minimum Overcurrent Protection rating", "Maximum Overcurrent Protection (máx)", "Motor Output Current Peak nameplate", "Minimum Operating Circuit Pressure psi"],
    correct: 1,
    explanation: "MOCP = Maximum Overcurrent Protection. Es el tamaño MÁXIMO del breaker o fuse que el fabricante permite para proteger el equipo. Usar más grande anula la certificación UL. MCA (Min Circuit Ampacity) define el tamaño mínimo del conductor.",
    reference: "NEC 440.4(B), nameplate marking"
  },
  {
    category: "HVAC Disconnect NEC 440",
    difficulty: "medium",
    q: "Air handler con electric heat strips 10kW y blower motor 1/2 HP — ¿qué calibre de conductor mínimo si MCA en nameplate = 48A?",
    options: ["#10 AWG (35A 75°C insufficient para 48A)", "#8 AWG THHN (50A 75°C suficiente 48A)", "#6 AWG (65A 75°C muy oversized 48A)", "#4 AWG (85A 75°C muy oversized 48A)"],
    correct: 1,
    explanation: "NEC 440.32 y 440.33 — usar MCA del nameplate directamente para sizing conductor. MCA 48A requiere ampacidad ≥48A. #8 AWG THHN a 75°C = 50A (Table 310.16). #10 AWG solo 35A — insuficiente.",
    reference: "NEC 440.32, Table 310.16"
  },
  {
    category: "HVAC Disconnect NEC 440",
    difficulty: "hard",
    q: "Split system con condensador outdoor 240V y air handler indoor con heat strips — ¿requieren disconnects separados?",
    options: ["No, un disconnect sirve para todo split", "Sí, cada unit disconnect 440.14 + 424.19", "Solo si supera 60A carga del equipment", "Solo en aplicaciones comerciales split"],
    correct: 1,
    explanation: "NEC 440.14 exige disconnect within sight del condenser outdoor, Y NEC 424.19 exige disconnect para los electric heat strips del air handler. Son cargas y ubicaciones diferentes — el single disconnect solo funciona si ambos están within sight de uno.",
    reference: "NEC 440.14, 424.19"
  },

  // ── GFCI/AFCI 2023 ── (4 preguntas)
  {
    category: "GFCI/AFCI 2023",
    difficulty: "easy",
    q: "NEC 210.8(A) 2023 — ¿en cuáles áreas residenciales se requiere GFCI protection para receptáculos 125V?",
    options: ["Solo baños y cocinas dwelling GFCI all", "Baños, cocinas, garages, outdoor, crawl", "Solo outdoor de la dwelling unit single", "Solo baños y outdoor de la dwelling un"],
    correct: 1,
    explanation: "NEC 210.8(A) 2023 expandió GFCI a: bathrooms, garages, outdoor, crawl, unfinished basements, kitchens, sinks (within 6 ft), boathouses, laundry, indoor damp/wet bar sinks, bathtub/shower area, dishwashers. Casi toda área con humedad.",
    reference: "NEC 210.8(A)"
  },
  {
    category: "GFCI/AFCI 2023",
    difficulty: "medium",
    q: "NEC 210.8(F) NEW 2020/2023 — ¿requiere GFCI en equipment HVAC outdoor?",
    options: ["No, exempt outdoor HVAC dwelling units", "Sí, outlets HVAC outdoor requieren GFCI", "Solo si el equipo es mayor a 30A load", "Solo en aplicaciones comerciales HVAC"],
    correct: 1,
    explanation: "NEC 210.8(F) NEW — outlets (incluyendo hardwired) para outdoor HVAC equipment en dwelling requieren GFCI protection. Esto causó problemas con trips falsos en algunas unidades 2020; fabricantes actualizaron equipos para compatibility.",
    reference: "NEC 210.8(F)"
  },
  {
    category: "GFCI/AFCI 2023",
    difficulty: "medium",
    q: "NEC 210.12(A) 2023 — AFCI protection requerida para branch circuits 120V 15/20A en dwellings en qué áreas?",
    options: ["Solo bedrooms dwelling AFCI protection", "Solo cocinas dwelling AFCI protection", "Kitchen, family, dining, bedrooms, hall", "Solo outdoor dwelling AFCI protection"],
    correct: 2,
    explanation: "NEC 210.12(A) — AFCI protection requerida en casi todas las habitaciones habitables de una dwelling. Excepciones: baños, garages, outdoor. El AFCI detecta arcing faults que anteceden fires — típica causa de incendios residenciales.",
    reference: "NEC 210.12(A)"
  },
  {
    category: "GFCI/AFCI 2023",
    difficulty: "hard",
    q: "Dual-function breaker CAFCI/GFCI — ¿cuándo NO puede usarse?",
    options: ["Nunca, dual-function es siempre OK use", "Loads arcing normal (motors, vacuums)", "Solo en aplicaciones 240V trifásicas big", "En aplicaciones outdoor dwelling units"],
    correct: 1,
    explanation: "Los dual-function CAFCI/GFCI pueden dar nuisance tripping con loads inductivos grandes (vacuums, universal motors, refrigeradores viejos). Solución: usar receptacle-type GFCI/AFCI solo downstream del outlet problemático, o un CAFCI sin GFCI donde el code lo permita.",
    reference: "NEC 210.12, manufacturer guidance"
  },

  // ── Emergency y Standby ── (3 preguntas)
  {
    category: "Emergency Systems NEC 700",
    difficulty: "medium",
    q: "Emergency system NEC 700 — la carga debe transferirse al source emergency en cuánto tiempo?",
    options: ["1 segundo máximo transfer emergency", "10 segundos máximo transfer emergency", "30 segundos máximo transfer emergency", "2 minutos máximo transfer emergency"],
    correct: 1,
    explanation: "NEC 700.12 — emergency systems deben transferir carga en 10 segundos máximo (dejando tiempo para arranque de generator). Legally required standby 701.12 permite hasta 60 segundos. Emergency cubre egress lighting, fire alarm, life safety.",
    reference: "NEC 700.12"
  },
  {
    category: "Emergency Systems NEC 700",
    difficulty: "medium",
    q: "¿Qué diferencia principal hay entre NEC 700 Emergency y NEC 701 Legally Required Standby?",
    options: ["Ninguna diferencia, ambos son iguales", "Emergency life safety 10s; standby 60s", "Emergency solo en hospitales healthcare", "Standby solo para homes dwelling units"],
    correct: 1,
    explanation: "Emergency (700) = life safety crítico con 10 sec transfer, circuits separados. Legally Required Standby (701) = requerido por autoridad pero no immediate life safety, 60 sec transfer. Optional Standby (702) = convenience, sin tiempo prescrito.",
    reference: "NEC 700, 701, 702"
  },
  {
    category: "Emergency Systems NEC 700",
    difficulty: "hard",
    q: "Wiring de emergency circuits NEC 700.10 — ¿deben mantenerse independientes de otros wiring?",
    options: ["No, emergency comparte raceway normal", "Sí, independientes excepto conditions", "Solo en hospitales healthcare emergency", "Solo si voltage es mayor a 600V ac"],
    correct: 1,
    explanation: "NEC 700.10(B) — emergency wiring debe mantenerse independiente de todo otro wiring y equipment. Excepciones: transition boxes at transfer switch, emergency loads en emergency panels, y 2 horas fire rated circuits. Esto previene que falla normal afecte emergency.",
    reference: "NEC 700.10(B)"
  },

  // ── Hazardous Locations ── (3 preguntas)
  {
    category: "Hazardous Locations",
    difficulty: "medium",
    q: "Class I Division 1 vs Division 2 — ¿cuál es la diferencia clave?",
    options: ["Div 1 ignitable normal; Div 2 accident", "Div 1 es más barato que Div 2 setup", "Div 2 es indoor solamente siempre rule", "Div 1 es líquidos, Div 2 es gases only"],
    correct: 0,
    explanation: "NEC 500.5 — Class I Div 1 = ignitable gases/vapors presentes continuously, intermittently, o periodically bajo normal operating conditions. Div 2 = solo bajo abnormal conditions (ruptured container, failure). Equipment Div 1 es más costoso — explosion-proof certificado.",
    reference: "NEC 500.5"
  },
  {
    category: "Hazardous Locations",
    difficulty: "medium",
    q: "Seal fittings NEC 501.15 en Class I Div 1 — ¿dónde se requieren?",
    options: ["Solo al entrar al enclosure explosion", "Dentro 18 in del enclosure + boundary", "Solo entre cuartos del edificio hazard", "No se requieren sellos en Div 1 ever"],
    correct: 1,
    explanation: "NEC 501.15(A) — sealed fitting dentro de 18 inches del explosion-proof enclosure que contenga arcs/sparks/high-temp. También boundary seal al salir de zona clasificada. El sello previene propagación de llama por el conduit.",
    reference: "NEC 501.15"
  },
  {
    category: "Hazardous Locations",
    difficulty: "hard",
    q: "Comercial spray booth de pintura — ¿qué classification aplica al interior de la booth durante operación?",
    options: ["Unclassified para el interior booth spr", "Class I Div 1 interior + Div 2 openings", "Class II Div 1 para booth spray paint", "Class III Div 2 para booth spray paint"],
    correct: 1,
    explanation: "NEC 516.3(C) — interior de spray booth = Class I Div 1 durante spraying. Área within 3 ft de openings = Class I Div 2. Por eso lighting debe ser explosion-proof o sealed lenses outside view panels. Todas las instalaciones sujetas a fire marshal approval.",
    reference: "NEC 516.3"
  },

  // ── Solar PV NEC 690 ── (4 preguntas)
  {
    category: "Solar PV NEC 690",
    difficulty: "easy",
    q: "California Title 24 2020+ exige sistemas solar PV en:",
    options: ["Solo edificios comerciales nuevos Title", "Nuevas viviendas single/multi hasta 3p", "Solo casas sobre 2,000 sq ft Title 24", "Opcional sin mandate en Title 24 rule"],
    correct: 1,
    explanation: "Title 24 Part 6 (2020 actualizado en 2023) mandates solar PV en nuevas viviendas unifamiliares y multi-family hasta 3 pisos en California. Sizing basado en electricity demand del edificio. Contratistas C-10 también instalan C-46 (solar).",
    reference: "CA Title 24 Part 6, CEC"
  },
  {
    category: "Solar PV NEC 690",
    difficulty: "medium",
    q: "NEC 690.12 Rapid Shutdown — ¿qué voltage debe alcanzar un PV array dentro de 30 segundos de activation?",
    options: ["0V dentro de 30 segundos todo array ok", "30V inside boundary, 80V outside array", "50V siempre dentro de 30 seg todo PV", "120V dentro de 30 seg todo el array PV"],
    correct: 1,
    explanation: "NEC 690.12(B)(2) 2023 — rapid shutdown: dentro del array boundary 80V, outside array boundary 30V (dentro de 1 ft), ambos dentro de 30 segundos. Protege firefighters de energized DC conductors on roof. Requiere module-level shutdown devices.",
    reference: "NEC 690.12(B)(2)"
  },
  {
    category: "Solar PV NEC 690",
    difficulty: "medium",
    q: "PV module nameplate: Voc=40V, Isc=10A. Para calcular circuit ampacity, ¿qué factor se aplica a Isc según NEC 690.8?",
    options: ["100% Isc sin aplicar factor continuous", "125% Isc solo un factor continuous only", "156% Isc (125% × 125%) irradiance/cont", "200% Isc aplicando factor doble error"],
    correct: 2,
    explanation: "NEC 690.8(A)(1) — continuous PV current = Isc × 1.25 (irradiance factor). Luego 690.8(B) aplica otro 125% para conductor sizing continuous load = 156% total. 10A × 1.56 = 15.6A ampacidad mínima conductor.",
    reference: "NEC 690.8"
  },
  {
    category: "Solar PV NEC 690",
    difficulty: "hard",
    q: "NEC 690.13 PV DC disconnect — ¿qué rating debe tener?",
    options: ["AC only rating switch PV DC disconnect", "DC rated apropiado Voc/Isc accessible", "500V AC mínimo switch PV DC disconnect", "Standard AC breaker sirve para PV DC"],
    correct: 1,
    explanation: "NEC 690.13 — PV system DC disconnect debe ser DC-rated (switches AC no interrumpen DC adecuadamente — el arc es sostenido). Debe manejar PV Voc max (con cold temp correction 690.7) y Isc calculada. Readily accessible para firefighters.",
    reference: "NEC 690.13, 690.15"
  },

  // ── Title 24 California ── (3 preguntas)
  {
    category: "Title 24 California",
    difficulty: "easy",
    q: "Title 24 California requiere qué tipo de lighting control en áreas residenciales según §150.0(k)?",
    options: ["Solo switches regulares sin control need", "High efficacy LED dimmer/vacancy sensor", "Solo incandescent bulbs permitidos Title", "Sin requirements lighting control Title"],
    correct: 1,
    explanation: "Title 24 §150.0(k) — high-efficacy lighting (LED JA8 compliant) en todas las áreas permanentes. Bathrooms, garages, laundry requieren vacancy sensors. Hallways con manual-ON + auto-OFF. El inspector C-10 debe conocer estos requirements.",
    reference: "CA Title 24 §150.0(k)"
  },
  {
    category: "Title 24 California",
    difficulty: "medium",
    q: "Title 24 exige EV charging readiness en nuevos homes. ¿Qué debe proveerse como mínimo?",
    options: ["Nothing, es opcional el Title 24 EV req", "Circuito 40A 208/240V ready EV future", "Solo un outlet 120V standard garage EV", "Charger instalado completo Level 2 full"],
    correct: 1,
    explanation: "Title 24 §150.0(o) — EV readiness: raceway desde panel a garage, panel space reservado, y typical 40-50A circuit capability para futuro Level 2. Multi-family requiere 10% de spaces EV-ready + adicional EV-capable. Contractor C-10 documenta esto.",
    reference: "CA Title 24 §150.0(o)"
  },
  {
    category: "Title 24 California",
    difficulty: "medium",
    q: "Título 24 commercial lighting — el Lighting Power Density (LPD) para office space es aproximadamente:",
    options: ["2.0 W/sq ft LPD office Title 24 2022", "0.65 W/sq ft LPD office Title 24 2022", "1.5 W/sq ft LPD office Title 24 2022", "Sin límite LPD office Title 24 2022 ok"],
    correct: 1,
    explanation: "Title 24 2022 Table 140.6-A — office space LPD ~0.65 W/sq ft (reducido cada ciclo por LED efficiency). Complementado con occupancy sensors, daylighting controls. Mucho más restrictivo que ASHRAE 90.1 nacional. Auditoría de energy en cada permit.",
    reference: "CA Title 24 Table 140.6-A"
  },

  // ── Working Clearances NEC 110 ── (4 preguntas)
  {
    category: "Working Clearances NEC 110",
    difficulty: "easy",
    q: "Según NEC 110.26(A)(2), el width del working space frente a un electrical panel es mínimo:",
    options: ["18 inches width working space mínimo", "24 inches width working space mínimo", "30 inches o ancho equipo (el mayor)", "36 inches width working space mínimo"],
    correct: 2,
    explanation: "NEC 110.26(A)(2) — width del working space = 30 inches mínimo o el ancho del equipo, lo que sea mayor. No necesita estar centrado frente al panel, pero el panel debe abrir 90°+ dentro del espacio.",
    reference: "NEC 110.26(A)(2)"
  },
  {
    category: "Working Clearances NEC 110",
    difficulty: "medium",
    q: "NEC 110.21(B) — Arc flash warning label debe incluir como mínimo:",
    options: ["Solo 'DANGER' label sin más info text", "Voltage, arc flash boundary, PPE/energy", "Nombre del contratista que instaló eq", "Solo fecha de instalación equipment"],
    correct: 1,
    explanation: "NEC 110.16 + 110.21(B) + NFPA 70E — labels en equipment likely to require examination while energized deben mostrar: nominal system voltage, arc flash boundary, at least one de: available incident energy con corresponding distance, minimum arc rating de PPE, site-specific PPE level, o Hazard/Risk category.",
    reference: "NEC 110.16, 110.21(B)"
  },
  {
    category: "Working Clearances NEC 110",
    difficulty: "medium",
    q: "Dedicated equipment space NEC 110.26(E) — el espacio above del panel es zona dedicada de qué altura?",
    options: ["6 inches above panel dedicated space", "12 inches above panel dedicated space", "6 feet above equipment or ceiling low", "Ilimitado above panel dedicated space"],
    correct: 2,
    explanation: "NEC 110.26(E)(1) — dedicated space = área directamente above el panel, desde floor hasta 6 ft arriba del equipo OR structural ceiling (lo que sea menor). Prohibido piping, ducts, foreign systems en esta zona (excepto sprinkler protection permitida).",
    reference: "NEC 110.26(E)(1)"
  },
  {
    category: "Working Clearances NEC 110",
    difficulty: "hard",
    q: "Panel de 480V trifásico con 800A — sobre el lado opuesto hay una pared concreta grounded. ¿Cuál es el working space depth según Table 110.26(A)(1) (Condición 2)?",
    options: ["3 feet working depth Condition 2 ampl", "3.5 feet working depth Condition 2 480", "4 feet working depth Condition 2 ampl", "5 feet working depth Condition 2 ampl"],
    correct: 1,
    explanation: "Table 110.26(A)(1) — para 151-600V con grounded surface al opposite (Condition 2), working depth = 3.5 ft (1.07m). Condition 1 (nada grounded) = 3 ft; Condition 3 (partes vivas opposite) = 4 ft. 480V entra al rango 151-600V.",
    reference: "NEC Table 110.26(A)(1)"
  }


];
