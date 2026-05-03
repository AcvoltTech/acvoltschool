// C-38 Refrigeration Contractor - California CSLB Study Questions
// Study material based on the public CSLB content outline.
// NOT reproductions of confidential exam content.
// Spanish (Chicano/Mexican refrigeration tech tone). English tech terms allowed.

window.CONTRACTOR_QUESTIONS_C38 = [
  // ===================== CICLO COMERCIAL (20) =====================
  {
    id: "c38-001",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "¿Cuáles son los 4 componentes básicos del ciclo de refrigeración por compresión de vapor?",
    options: {
      a: "Compresor, condensador, metering device, evaporador",
      b: "Compresor, receiver, filter drier y acumulador de succión",
      c: "Condensador, bomba circuladora, fan motor y evaporador",
      d: "Compresor, accumulator, sight glass y muffler de descarga"
    },
    correct: "a",
    explanation: "El ciclo básico de compresión de vapor siempre lleva compresor, condensador, dispositivo de expansión (TXV/orificio/cap tube) y evaporador. Los demás componentes son accesorios del sistema.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2 - Fundamentals of Refrigeration"
  },
  {
    id: "c38-002",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "En el lado de baja presión del sistema, ¿qué estado tiene el refrigerante a la salida del evaporador en condiciones normales?",
    options: {
      a: "Líquido subenfriado a ~10°F real",
      b: "Vapor saturado con arrastre gotas",
      c: "Vapor sobrecalentado (superheated)",
      d: "Mezcla bifásica líquido y gas 50/50"
    },
    correct: "c",
    explanation: "A la salida del evaporador el refrigerante debe estar como vapor sobrecalentado (típicamente 8-12°F de superheat) para proteger al compresor contra slugging de líquido.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2"
  },
  {
    id: "c38-003",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "En un walk-in cooler operando con R-448A a 20°F SST, ¿cuál es aproximadamente la presión de succión (saturación)?",
    options: {
      a: "~15 psig (bubble)",
      b: "~28 psig (bubble)",
      c: "~45 psig (bubble)",
      d: "~62 psig (bubble)"
    },
    correct: "c",
    explanation: "R-448A a 20°F tiene una presión de saturación cercana a 44-46 psig (bubble point). Es una tabla PT que el técnico debe dominar para diagnóstico de superheat/subcooling.",
    reference: "Honeywell Solstice N40 (R-448A) PT Chart"
  },
  {
    id: "c38-004",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "¿Cuál es la función principal del subcooling (subenfriamiento) en la línea de líquido?",
    options: {
      a: "Elevar la presión de succión del compresor reciprocante",
      b: "Evitar flash gas antes del metering device y mejorar capacidad",
      c: "Reducir el consumo eléctrico del fan motor del condensador",
      d: "Aumentar el superheat de succión para proteger el compresor"
    },
    correct: "b",
    explanation: "El subcooling asegura que solo llegue líquido (sin flash gas) al TXV, lo que mantiene la capacidad de refrigeración y evita starvation del evaporador. Típicamente 10-15°F de subcooling.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2 - Liquid Subcooling"
  },
  {
    id: "c38-005",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "¿Qué unidad equivale a una tonelada de refrigeración?",
    options: {
      a: "10,000 BTU/h",
      b: "12,000 BTU/h",
      c: "15,000 BTU/h",
      d: "24,000 BTU/h"
    },
    correct: "b",
    explanation: "Una tonelada de refrigeración = 12,000 BTU/h = 288,000 BTU/día, que es la energía para derretir 1 tonelada corta de hielo a 32°F en 24 horas.",
    reference: "ASHRAE Fundamentals Handbook, Ch. 1"
  },
  {
    id: "c38-006",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "Un walk-in freezer de 3 toneladas de carga térmica, ¿cuántos BTU/h debe rechazar el condensador aproximadamente? (Asume HRR ~1.25)",
    options: {
      a: "36,000 BTU/h",
      b: "45,000 BTU/h",
      c: "60,000 BTU/h",
      d: "72,000 BTU/h"
    },
    correct: "b",
    explanation: "El Heat Rejection Ratio (HRR) para aplicaciones low-temp ronda 1.25-1.35. 3 ton × 12,000 BTU/h = 36,000 BTU/h × 1.25 = 45,000 BTU/h de rechazo de calor en el condensador.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 - Condensers"
  },
  {
    id: "c38-007",
    category: "Ciclo Comercial",
    difficulty: "hard",
    question: "En un ciclo con R-404A, SST = -20°F y SDT = 110°F. ¿Cuál es aproximadamente la relación de compresión (CR)?",
    options: {
      a: "~3.5:1 (low CR)",
      b: "~5.2:1 (medium)",
      c: "~7.8:1 (típico)",
      d: "~12:1 (extremo)"
    },
    correct: "c",
    explanation: "R-404A a -20°F ≈ 16 psig (30.7 psia) y a 110°F ≈ 263 psig (277.7 psia). CR = 277.7/30.7 ≈ 9.0, pero con las correcciones típicas ronda 7.8-9:1. Relaciones >10:1 requieren two-stage o cascada.",
    reference: "Copeland Application Engineering Bulletin AE-1161"
  },
  {
    id: "c38-008",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "¿Cuál es la temperatura típica de diseño de un medium-temp walk-in cooler?",
    options: {
      a: "-10°F a 0°F",
      b: "15°F a 25°F",
      c: "35°F a 40°F",
      d: "55°F a 65°F"
    },
    correct: "c",
    explanation: "Walk-in coolers (medium-temp) operan típicamente entre 35-40°F para productos frescos (carnes, lácteos, produce). Los freezers operan entre -10°F y 0°F.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Walk-In Coolers"
  },
  {
    id: "c38-009",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "Si un sistema tiene alto superheat y bajo subcooling simultáneamente, la causa más probable es:",
    options: {
      a: "Sobrecarga severa de refrigerante virgen",
      b: "Bajo nivel de refrigerante (undercharge)",
      c: "Fan motor del condensador aire trabado",
      d: "TXV sobre-alimentando el coil evaporador"
    },
    correct: "b",
    explanation: "Alto superheat + bajo subcooling = sistema con poca carga. No hay suficiente refrigerante para mantener líquido en el condensador ni para alimentar bien el evaporador.",
    reference: "ACCA Technician Reference - Charging"
  },
  {
    id: "c38-010",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "¿Qué componente del ciclo controla el flujo de refrigerante hacia el evaporador basado en superheat?",
    options: {
      a: "EPR (Evaporator Pressure Reg.)",
      b: "Thermostatic Expansion Valve (TXV)",
      c: "Solenoid valve normalmente cerrada",
      d: "Crankcase Pressure Regulator (CPR)"
    },
    correct: "b",
    explanation: "La TXV mide el superheat mediante su bulbo sensor en la succión del evaporador y modula el flujo de refrigerante. El EPR regula presión del evaporador, no superheat.",
    reference: "Sporlan Bulletin 10-9 - Thermostatic Expansion Valves"
  },
  {
    id: "c38-011",
    category: "Ciclo Comercial",
    difficulty: "hard",
    question: "Un evaporador tiene TD (temperature difference) de 20°F y está a 20°F SST. ¿Cuál es la temperatura del aire de entrada (entering air)?",
    options: {
      a: "0°F (TD invertido)",
      b: "20°F (igual al SST)",
      c: "40°F (SST más TD)",
      d: "60°F (TD muy alto)"
    },
    correct: "c",
    explanation: "TD = Temp aire entrada - SST. Si SST=20°F y TD=20°F, aire entrada = 40°F. Para walk-in coolers se usa TD de 10°F (alta humedad), para freezers típicamente 10-15°F.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14 - Evaporators"
  },
  {
    id: "c38-012",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "El receiver en un sistema de refrigeración sirve para:",
    options: {
      a: "Filtrar humedad y particulado del refrigerante líquido",
      b: "Almacenar el refrigerante líquido y permitir pump-down",
      c: "Separar el aceite del refrigerante en línea de descarga",
      d: "Elevar la presión de succión en aplicaciones de low-temp"
    },
    correct: "b",
    explanation: "El receiver almacena el refrigerante líquido entre el condensador y el metering device, permite pump-down para servicio y compensa variaciones de carga del sistema.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 1 - System Practices"
  },
  {
    id: "c38-013",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "En un sistema con economizer (subcooler de intercambio), ¿qué se mejora principalmente?",
    options: {
      a: "La tasa y duración del ciclo de defrost con gas caliente",
      b: "El EER/COP del sistema al aumentar la capacidad neta",
      c: "La lubricación del crankcase en aplicaciones low-temp -40°F",
      d: "El control de humedad relativa interna del cuarto frío"
    },
    correct: "b",
    explanation: "El economizer subenfría el líquido usando vapor de succión o una línea derivada, aumentando el efecto refrigerante neto sin aumentar proporcionalmente el trabajo del compresor. Típico en scroll y screw low-temp.",
    reference: "Copeland AE-1248 - Economized Scroll Compressors"
  },
  {
    id: "c38-014",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "¿Qué es el SDT (Saturated Discharge Temperature)?",
    options: {
      a: "La temperatura real medida en la línea de descarga caliente",
      b: "Temperatura de saturación correspondiente a la presión de descarga",
      c: "La temperatura máxima permitida del oil sump del compresor",
      d: "Temperatura del aire ambiente que entra al condensador aire"
    },
    correct: "b",
    explanation: "SDT es la temperatura de condensación determinada por la presión de descarga usando la tabla PT del refrigerante. Es diferente a la temperatura real de la línea de descarga (que es sobrecalentada).",
    reference: "ASHRAE Refrigeration Handbook, Terminology"
  },
  {
    id: "c38-015",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "¿Cuál es el propósito del filter drier en línea de líquido?",
    options: {
      a: "Regular la presión del condensador en invierno",
      b: "Remover humedad y particulado del refrigerante",
      c: "Almacenar refrigerante líquido sobrante del ciclo",
      d: "Indicar el nivel de aceite dentro del crankcase"
    },
    correct: "b",
    explanation: "El filter drier usa desecante (molecular sieve/activated alumina) para remover humedad y filtrar partículas metálicas o sludge. Debe cambiarse después de cualquier apertura del sistema.",
    reference: "Sporlan Bulletin 40-10 - Liquid Line Filter Driers"
  },
  {
    id: "c38-016",
    category: "Ciclo Comercial",
    difficulty: "hard",
    question: "Un sistema R-407A tiene glide de aproximadamente ¿cuántos °F entre bubble y dew point?",
    options: {
      a: "0°F (azeótropo puro)",
      b: "2-3°F (near-azeotr.)",
      c: "8-10°F (zeotrópico)",
      d: "25-30°F (alto glide)"
    },
    correct: "c",
    explanation: "R-407A es una mezcla zeotrópica con glide de ~8-10°F. Esto obliga a cargar siempre en líquido y considerar el glide al calcular superheat/subcooling (usar dew point para superheat, bubble para subcooling).",
    reference: "ASHRAE Refrigeration Handbook, Ch. 29 - Refrigerants"
  },
  {
    id: "c38-017",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "¿Qué problema causa operar un compresor con relación de compresión mayor a 10:1 por tiempo prolongado?",
    options: {
      a: "Baja discharge temp, que protege al compresor del daño",
      b: "Sobrecalentamiento discharge, breakdown aceite y daño válvulas",
      c: "Solo reduce ligeramente la eficiencia volumétrica del ciclo",
      d: "Congelación rápida del evaporador por alto flujo másico"
    },
    correct: "b",
    explanation: "CR >10:1 eleva la discharge temp sobre 225°F, degrada el aceite (carbonización), daña las válvulas y quema el motor. Para low-temp se usa two-stage o cascada CO2/NH3.",
    reference: "Copeland AE-1161 Refrigeration Compressor Compression Ratio"
  },
  {
    id: "c38-018",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "La línea de succión aislada sirve para:",
    options: {
      a: "Aumentar la capacidad neta de refrigeración del evaporador",
      b: "Prevenir sweating y ganancia de calor hacia el refrigerante frío",
      c: "Silenciar el compresor reciprocante y reducir la vibración",
      d: "Proteger la tubería de cobre contra radiación UV solar directa"
    },
    correct: "b",
    explanation: "La línea de succión corre fría (sobre todo en low-temp) y sin aislamiento sudaría/condensaría agua y ganaría calor, reduciendo capacidad. Se usa Armaflex o equivalente cerrado de células.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 1 - Piping"
  },
  {
    id: "c38-019",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "El sight glass con indicador de humedad cambia de color. Verde típicamente indica:",
    options: {
      a: "Sistema con humedad alta (wet)",
      b: "Sistema seco y sin humedad (dry)",
      c: "Baja carga y presencia de flash",
      d: "Exceso de aceite POE en líquido"
    },
    correct: "b",
    explanation: "Verde = seco (dry), amarillo = húmedo (wet). Si el sight glass indica humedad, hay que cambiar el filter drier y evacuar correctamente a 500 microns o menos.",
    reference: "Sporlan Moisture Indicators Bulletin"
  },
  {
    id: "c38-020",
    category: "Ciclo Comercial",
    difficulty: "hard",
    question: "En un sistema two-stage con intercooler, ¿cuál es el propósito principal del intercooler?",
    options: {
      a: "Calentar el refrigerante entre primera y segunda etapa del compresor",
      b: "Desuperheat del gas de primera etapa y subenfriar líquido para mejorar COP",
      c: "Filtrar humedad y sludge del refrigerante entre etapas de compresión",
      d: "Generar el hot gas necesario para ciclo de defrost en evaporador low-temp"
    },
    correct: "b",
    explanation: "El intercooler enfría el discharge de la primera etapa antes de entrar a la segunda (reduce discharge temp final) y subenfría el líquido que va al evaporador. Clave en aplicaciones -40°F y menos.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2 - Multistage Systems"
  },

  // ===================== WALK-INS Y CUARTOS FRÍOS (15) =====================
  {
    id: "c38-021",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "easy",
    question: "¿Cuál es el valor R mínimo típico para paneles de walk-in freezer según DOE?",
    options: {
      a: "R-13 (paneles delgados)",
      b: "R-19 (insuficiente DOE)",
      c: "R-32 (mínimo freezer)",
      d: "R-60 (techo muy alto)"
    },
    correct: "c",
    explanation: "DOE 10 CFR 431.306 exige paneles con R-32 mínimo para freezers y R-25 para coolers. El polyurethane foam típico da ~R-8 por pulgada, por eso freezers usan paneles de 4-5 pulgadas.",
    reference: "10 CFR 431.306 - Walk-In Coolers/Freezers Energy Conservation"
  },
  {
    id: "c38-022",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "easy",
    question: "La función del vapor barrier (barrera de vapor) en un walk-in es:",
    options: {
      a: "Evitar que el vapor de agua migre hacia el panel de foam",
      b: "Impermeabilizar el piso para facilitar la limpieza sanitaria",
      c: "Separar refrigerantes incompatibles en tubería ACR del rack",
      d: "Filtrar el aire de entrada durante cada apertura de puerta"
    },
    correct: "a",
    explanation: "El vapor barrier (polietileno/foil) evita que el vapor de agua migre al interior del panel, donde se condensaría y arruinaría el R-value. Se instala siempre en el lado caliente del aislamiento.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Walk-Ins"
  },
  {
    id: "c38-023",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "Para un walk-in freezer de 12x14x10 ft, carga promedio de 30 BTU/h por ft² de superficie externa, ¿cuál es la carga aproximada de transmisión?",
    options: {
      a: "~9,000 BTU/h",
      b: "~22,000 BTU/h",
      c: "~45,000 BTU/h",
      d: "~90,000 BTU/h"
    },
    correct: "b",
    explanation: "Superficie total ≈ 2(12×14)+2(12×10)+2(14×10)=336+240+280=856 ft². × 30 BTU/h/ft² ≈ 25,680 BTU/h. Es una aproximación para load estimation; el cálculo exacto usa U×A×ΔT.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Load Calculation"
  },
  {
    id: "c38-024",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "¿Qué accesorio es requerido en la puerta de un walk-in freezer para evitar vacío al cerrar?",
    options: {
      a: "Door frame heater perimetral 120V",
      b: "Pressure relief port (vent eléctric)",
      c: "Automatic door closer hidráulico HD",
      d: "Kick plate de acero inoxidable 304"
    },
    correct: "b",
    explanation: "Al cerrar la puerta el aire frío se contrae y crea vacío que impide abrir la puerta. El vent (también llamado pressure relief port) con calentador equiliza la presión. Es obligatorio en freezers.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Doors"
  },
  {
    id: "c38-025",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "easy",
    question: "Los calentadores perimetrales (frame heaters) de la puerta de walk-in freezer sirven para:",
    options: {
      a: "Calentar el interior del cuarto frío en invierno",
      b: "Evitar que se congele el gasket contra el marco",
      c: "Ahorrar energía durante operación del condensador",
      d: "Iluminar el interior cuando abre la puerta del walk-in"
    },
    correct: "b",
    explanation: "Los frame/perimeter heaters mantienen el marco sobre el punto de rocío para que el gasket no se pegue al frame congelado. Sin ellos la puerta no abre o rompe el empaque.",
    reference: "Kolpak/Bally Walk-In Engineering Data"
  },
  {
    id: "c38-026",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "Según DOE, los motores de fans de evaporador menores de 1 HP en walk-ins deben ser:",
    options: {
      a: "Shaded pole de 1/20 HP estándar",
      b: "PSC (Permanent Split Capacitor)",
      c: "ECM o motor de alta eficiencia",
      d: "Split-phase con arranque capacitor"
    },
    correct: "c",
    explanation: "DOE 10 CFR 431 exige ECM (electronically commutated motors) o equivalente de alta eficiencia para fans de evaporador y condensador < 1 HP en walk-ins. Los shaded pole están prohibidos.",
    reference: "10 CFR 431.306(a)(2)"
  },
  {
    id: "c38-027",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "hard",
    question: "Un walk-in cooler de 500 ft² con 6 personas/día de uso (traffic load), ¿aproximadamente cuánta carga adicional por infiltración hay que agregar?",
    options: {
      a: "Despreciable, no se calcula en load",
      b: "~500-1,500 BTU/h según uso diario",
      c: "~10,000 BTU/h como mínimo fijo hr",
      d: "Igual que la carga de transmisión"
    },
    correct: "b",
    explanation: "La infiltración por apertura de puerta se calcula con factor de aperturas por día y volumen del cuarto. Típicamente 10-30% de la carga total; strip curtains la reducen hasta 50%.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Infiltration Load"
  },
  {
    id: "c38-028",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "easy",
    question: "El piso de un walk-in freezer sobre slab debe tener:",
    options: {
      a: "Ningún aislamiento bajo slab; el concreto puro basta para freezer",
      b: "Aislamiento rígido + heater strip o tubería glicol anti-frost heave",
      c: "Solo un liner plástico de 6 mil y membrana impermeable encima",
      d: "Ventilación activa bajo el slab con ductos y fan de reciclo de aire"
    },
    correct: "b",
    explanation: "Freezers sobre slab requieren aislamiento bajo el piso Y un sistema anti-frost heave (heater strip eléctrico o tubería con glicol) porque el suelo debajo puede congelarse y levantar el concreto.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Floor Construction"
  },
  {
    id: "c38-029",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "¿Cuál es la TD típica recomendada para un evaporador en un walk-in cooler para mantener alta humedad (produce)?",
    options: {
      a: "5°F (muy bajo)",
      b: "8-10°F (alta RH)",
      c: "15-18°F (medio)",
      d: "25°F (muy seco)"
    },
    correct: "b",
    explanation: "Para mantener humedad alta (85-90% RH) en produce coolers se usa TD bajo (8-10°F). TD alto seca más el producto porque el coil está más frío y condensa más agua del aire.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14 - Evaporator Selection"
  },
  {
    id: "c38-030",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "easy",
    question: "¿Qué tipo de iluminación se usa típicamente dentro de walk-in freezers?",
    options: {
      a: "Incandescente estándar de 100 W",
      b: "LED con driver low-temp rated",
      c: "Lámpara sodio de alta presión",
      d: "Halógenas MR16 de bajo voltaje"
    },
    correct: "b",
    explanation: "LEDs certificados para baja temperatura son requeridos por DOE y son estándar en walk-ins por eficiencia y durabilidad. Las fluorescentes/incandescentes son ineficientes a -10°F.",
    reference: "10 CFR 431.306 - Walk-In Lighting Requirements"
  },
  {
    id: "c38-031",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "El air curtain o strip curtain en puerta de walk-in reduce la infiltración aproximadamente:",
    options: {
      a: "~10% (muy insuficient)",
      b: "~25% (marginal y bajo)",
      c: "~50-70% (efectivo real)",
      d: "~95% (valor irrealista)"
    },
    correct: "c",
    explanation: "Strip curtains bien mantenidos reducen 50-70% de infiltración. Air curtains activos pueden dar similar reducción sin bloquear paso de montacargas. Son código en muchas jurisdicciones.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Infiltration Reduction"
  },
  {
    id: "c38-032",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "hard",
    question: "Se diseña un walk-in con capacidad de pull-down de 40°F a 35°F en 24 horas con 2,000 lb de producto. Si el cp del producto = 0.8 BTU/lb°F, ¿cuál es la carga de product pull-down por hora?",
    options: {
      a: "~333 BTU/h de pull-down",
      b: "~667 BTU/h de pull-down",
      c: "~1,000 BTU/h de pull-down",
      d: "~5,000 BTU/h de pull-down"
    },
    correct: "a",
    explanation: "Q = m × cp × ΔT = 2000 × 0.8 × 5 = 8,000 BTU total. Dividido entre 24 h = 333 BTU/h. Se agrega a la carga de transmisión, infiltración, personas, luces y motores para total design load.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Product Load"
  },
  {
    id: "c38-033",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "¿Qué material de panel es más común en walk-ins modernos por su R-value y estabilidad?",
    options: {
      a: "Fiberglass batt en cavidad de panel metálico",
      b: "Polystyrene EPS expandido de baja densidad",
      c: "Polyurethane o polyisocyanurate foam-in-place",
      d: "Lana mineral de roca con barrera de vapor foil"
    },
    correct: "c",
    explanation: "Polyurethane y polyiso foam-in-place dan R-7 a R-8 por pulgada y excelente adhesión al metal del panel. Son el estándar en walk-ins NSF-approved modernos.",
    reference: "NSF/ANSI 7 - Commercial Refrigerators & Freezers"
  },
  {
    id: "c38-034",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "easy",
    question: "Los walk-ins que almacenan productos NSF deben tener interior:",
    options: {
      a: "Cualquier material liso aprobado localmente por el inspector",
      b: "Stainless steel, galvanizado esmaltado o aluminio NSF-7 food-grade",
      c: "Madera tratada con sellador epóxico resistente a la humedad",
      d: "FRP exterior solamente, dejando el interior con panel metálico"
    },
    correct: "b",
    explanation: "NSF/ANSI 7 exige superficies lisas, no-porosas, fáciles de limpiar. Stainless steel, galvanizado con pintura epóxica, aluminio y FRP aprobado son materiales comunes.",
    reference: "NSF/ANSI 7"
  },
  {
    id: "c38-035",
    category: "Walk-ins y Cuartos Fríos",
    difficulty: "medium",
    question: "En California, los walk-ins comerciales deben cumplir con Title 24 Parte 6. Una de sus exigencias es:",
    options: {
      a: "Solo se permiten equipos importados certificados en fábrica extranjera",
      b: "Auto-closers en puertas, floating head pressure, ECM evaporator fans",
      c: "Prohibición total de R-404A en cualquier sistema comercial de retail",
      d: "Uso exclusivo de amoníaco R-717 en sistemas de supermercado nuevos"
    },
    correct: "b",
    explanation: "Title 24 Parte 6 exige automatic door closers, strip curtains en puertas frecuentes, floating head pressure control, ECM fans y lighting eficiente para walk-ins comerciales nuevos.",
    reference: "California Title 24, Part 6 §120.6 Covered Processes"
  },

  // ===================== REFRIGERANTES COMERCIALES (15) =====================
  {
    id: "c38-036",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "R-404A tiene GWP de aproximadamente:",
    options: {
      a: "GWP ~1 (CO2 natural)",
      b: "GWP ~675 (R-32 puro)",
      c: "GWP ~1,430 (R-134a)",
      d: "GWP ~3,922 (R-404A)"
    },
    correct: "d",
    explanation: "R-404A tiene GWP de 3,922 (AR4), lo cual lo convierte en objetivo de phase-down bajo AIM Act y SNAP. Por eso se está reemplazando con R-448A/449A (GWP ~1,300) o CO2.",
    reference: "EPA SNAP Rule + AIM Act HFC Phase-Down Schedule"
  },
  {
    id: "c38-037",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "R-744 es el designación ASHRAE de:",
    options: {
      a: "Propano natural (R-290)",
      b: "Dióxido de carbono (CO2)",
      c: "Amoníaco anhidro (NH3)",
      d: "Isobutano (R-600a HC)"
    },
    correct: "b",
    explanation: "R-744 es CO2. Tiene GWP=1, ODP=0, es natural y no tóxico pero opera a muy alta presión (crítica a 87.8°F/1,055 psig). Usado en transcritical booster racks y cascadas.",
    reference: "ASHRAE 34 - Designation & Safety Classification"
  },
  {
    id: "c38-038",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "R-717 (amoníaco) tiene clasificación de seguridad ASHRAE 34:",
    options: {
      a: "A1 (no tóxico, no inflamable tipo)",
      b: "A2L (no tóxico, ligera inflamación)",
      c: "B2L (tóxico, levemente inflamable)",
      d: "A3 (no tóxico y muy inflamable HC)"
    },
    correct: "c",
    explanation: "R-717 (NH3) es B2L: tóxico (B) y levemente inflamable (2L). Por eso se usa en salas de máquinas ventiladas, con detección y licencia especial (PSM/RMP si >10,000 lb).",
    reference: "ASHRAE 34 + OSHA 29 CFR 1910.119 PSM"
  },
  {
    id: "c38-039",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "R-448A y R-449A son reemplazos de R-404A. ¿Cuál es su GWP aproximado?",
    options: {
      a: "GWP ~150 (tipo HFO puro)",
      b: "GWP ~675 (tipo R-32 puro)",
      c: "GWP ~1,300-1,400 (blend)",
      d: "GWP ~3,900 (tipo R-404A)"
    },
    correct: "c",
    explanation: "R-448A (Solstice N40) GWP=1,387; R-449A (Opteon XP40) GWP=1,397. Ambos son blends zeotrópicos A1 con glide ~8°F y capacidad/eficiencia similar a R-404A.",
    reference: "Honeywell + Chemours Refrigerant Data Sheets"
  },
  {
    id: "c38-040",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "Al cargar un refrigerante zeotrópico como R-407A o R-448A, debes cargar:",
    options: {
      a: "Siempre en fase vapor para evitar slugging en el compresor hermético",
      b: "Siempre en fase líquida para mantener la composición del blend zeotrópico",
      c: "Mitad líquido y mitad vapor alternando por el puerto de servicio bajo",
      d: "No importa la fase porque los blends modernos funcionan como azeótropos"
    },
    correct: "b",
    explanation: "Los blends zeotrópicos se fraccionan si cargas en gas (los componentes más volátiles salen primero del cilindro). Siempre cargar líquido con válvula flash si entra al lado de baja.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 29 - Refrigerant Charging"
  },
  {
    id: "c38-041",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "En un sistema transcritical CO2, la presión de descarga en verano puede alcanzar:",
    options: {
      a: "~300 psig (muy baja típ)",
      b: "~700 psig (subcrítica)",
      c: "~1,400-1,700 psig (norm)",
      d: "~3,000 psig (irrealista)"
    },
    correct: "c",
    explanation: "CO2 transcritical opera arriba del punto crítico (87.8°F/1055 psig). En modo verano el gas cooler puede ver 1,300-1,700 psig. Todos los componentes son rated 130 bar o más.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 - Carbon Dioxide Systems"
  },
  {
    id: "c38-042",
    category: "Refrigerantes Comerciales",
    difficulty: "hard",
    question: "Según SNAP/AIM Act, la fabricación de equipos comerciales retail food con R-404A está restringida desde:",
    options: {
      a: "2010 (por Protocolo de Montreal)",
      b: "2016-2017 (SNAP Rule 20/21 EPA)",
      c: "2030 (AIM Act fase final HFC)",
      d: "Todavía permitida sin restricción"
    },
    correct: "b",
    explanation: "SNAP Rule 20 (2016) y Rule 21 eliminaron R-404A para supermarket racks y condensing units nuevos. AIM Act 2024/2025 aplica límites GWP<150 para stand-alones y <300 para remote condensing units.",
    reference: "EPA SNAP Rules 20, 21 + AIM Act Technology Transitions Rule"
  },
  {
    id: "c38-043",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "El aceite compatible con R-448A/R-449A en nuevos sistemas es:",
    options: {
      a: "Aceite mineral nafténico tipo 3GS SUS",
      b: "Alkylbenzene AB sintético grado ACSR",
      c: "POE (polyol ester ISO VG 32 o 68)",
      d: "PAG (polyalkylene glycol automotriz)"
    },
    correct: "c",
    explanation: "Refrigerantes HFC/HFO como R-448A/449A requieren POE por miscibilidad. POE es higroscópico—hay que minimizar exposición al aire y evacuar bien el sistema (<500 microns).",
    reference: "Copeland AE-1368 - POE Oils"
  },
  {
    id: "c38-044",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "¿Cuál es el límite de exposición (AEGL-2) de NH3 para 60 minutos?",
    options: {
      a: "5 ppm (umbral olor típico NH3)",
      b: "25 ppm (PEL-TWA OSHA para NH3)",
      c: "160 ppm (AEGL-2 EPA 60 min)",
      d: "2,700 ppm (letal a 60 min NH3)"
    },
    correct: "c",
    explanation: "AEGL-2 (serious effects) para NH3 a 60 min = 160 ppm. PEL-TWA OSHA = 25 ppm. IDLH = 300 ppm. Por eso salas NH3 llevan detección con alarma a 25 ppm y evacuación a 150 ppm.",
    reference: "EPA AEGL + OSHA PEL 29 CFR 1910.1000"
  },
  {
    id: "c38-045",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "En un sistema cascada CO2/NH3, el CO2 opera en el circuito:",
    options: {
      a: "De alta temperatura (condensador final al ambiente)",
      b: "De baja temperatura (evaporadores del supermercado)",
      c: "CO2 no se usa nunca en cascada, solo transcritical",
      d: "En ambos circuitos indistintamente según la carga"
    },
    correct: "b",
    explanation: "En cascada NH3/CO2, NH3 hace el high-stage (rechaza calor al ambiente), y CO2 hace el low-stage dentro del supermercado/planta. Ventaja: menos carga NH3 en zonas de personal.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 - Cascade Systems"
  },
  {
    id: "c38-046",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "El color del cilindro de R-404A según AHRI es:",
    options: {
      a: "Verde claro (R-22 HCFC)",
      b: "Naranja (R-404A HFC)",
      c: "Azul claro (R-134a HFC)",
      d: "Rosa (R-410A HFC A1)"
    },
    correct: "b",
    explanation: "AHRI Guideline N asigna naranja a R-404A. R-410A = rosa, R-22 = verde claro, R-134a = azul claro, R-448A = verde oliva/tan, R-449A = verde.",
    reference: "AHRI Guideline N - Assignment of Refrigerant Container Colors"
  },
  {
    id: "c38-047",
    category: "Refrigerantes Comerciales",
    difficulty: "hard",
    question: "Un sistema con 50 lb de R-404A tuvo una fuga y perdió 15 lb en 30 días. ¿Excede el leak rate anual máximo permitido por EPA?",
    options: {
      a: "No excede, queda por debajo del 10% anual comercial",
      b: "Sí, calculado anualizado ~360% excede el 20% comercial",
      c: "No aplica porque la regla exige más de 50 lb de carga",
      d: "Sí excede pero solo el 5% residencial del 40 CFR 82"
    },
    correct: "b",
    explanation: "15/50 = 30% en 30 días × 12 = anualizado 360%. EPA 40 CFR 82 Subpart F exige reparación en 30 días si excede 20% anual (comercial) o 35% (industrial). Hay que reparar y verificar con leak test.",
    reference: "EPA 40 CFR 82 Subpart F §82.157 Leak Repair"
  },
  {
    id: "c38-048",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "¿Cuál es la presión mínima de trabajo de una línea de líquido típica en sistema R-410A?",
    options: {
      a: "~150 psig (muy bajo)",
      b: "~300 psig (insuficient)",
      c: "~500 psig o más (OK)",
      d: "~50 psig (succión low)"
    },
    correct: "c",
    explanation: "R-410A opera cerca de 450 psig en condensación; tubería ACR y componentes deben estar rated para al menos 500+ psig. El CMC §1108 y ASHRAE 15 exigen rating según lado alto/bajo.",
    reference: "CMC §1108 + ASHRAE 15 - Safety Standard for Refrigeration Systems"
  },
  {
    id: "c38-049",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "CO2 como refrigerante R-744 tiene punto triple a -69.8°F / 75.1 psig. ¿Qué significa esto para el técnico?",
    options: {
      a: "Nada relevante, es solo un dato académico de la tabla PT",
      b: "Abajo de 75 psig el CO2 forma hielo seco y tapa el sistema",
      c: "Que el sistema debe operar siempre muy cerca del punto triple",
      d: "Que el CO2 no es viable como refrigerante comercial moderno"
    },
    correct: "b",
    explanation: "Si la presión cae bajo el punto triple (durante servicio o fuga), el CO2 sólido (hielo seco) se forma y tapa válvulas. Por eso los racks CO2 llevan standby condensing o venting controlado.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 - CO2 Properties"
  },
  {
    id: "c38-050",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "La Regla de SNAP EPA prohíbe R-404A en equipos retail food nuevos, pero permite su uso para:",
    options: {
      a: "Instalaciones completamente nuevas de racks comerciales retail",
      b: "Servicio de equipos existentes (con reciclado o virgen disponible)",
      c: "Exportación solamente a países sin phase-down de HFC activo",
      d: "Nunca, está totalmente prohibido bajo la AIM Act y SNAP Rule 21"
    },
    correct: "b",
    explanation: "El phase-down regula producción/importación de virgen pero permite el servicio de sistemas existentes, priorizando reciclado/reclamado. Los técnicos necesitan EPA 608 Type II para manejarlo.",
    reference: "EPA AIM Act + 40 CFR 84 Technology Transitions"
  },

  // ===================== COMPRESORES (12) =====================
  {
    id: "c38-051",
    category: "Compresores",
    difficulty: "easy",
    question: "¿Qué compresor es más común en walk-ins pequeños y medianos por su eficiencia y bajo costo?",
    options: {
      a: "Scroll hermético Copeland ZB",
      b: "Reciprocating hermético R22",
      c: "Screw industrial de 50 HP",
      d: "Centrífugo con impeller 15T"
    },
    correct: "a",
    explanation: "Scroll hermético (Copeland, Danfoss, Bitzer) domina 1-15 HP por alta eficiencia, pocas partes móviles y operación silenciosa. Reciprocating todavía se usa en low-temp específico.",
    reference: "Copeland Scroll Application Guide"
  },
  {
    id: "c38-052",
    category: "Compresores",
    difficulty: "medium",
    question: "La diferencia principal entre un compresor hermético y uno semi-hermético es:",
    options: {
      a: "Hermético usa aceite POE y el semi no lo necesita",
      b: "Semi-hermético se abre a reparar, hermético sellado",
      c: "Hermético siempre trifásico, semi siempre monofásico",
      d: "Semi-hermético sin motor interno, usa belt externo"
    },
    correct: "b",
    explanation: "Semi-hermético tiene bolted head/cylinder head para acceder a reed valves, pistones y unloaders. Hermético está welded y no es reparable—se reemplaza completo en falla.",
    reference: "Copeland AE-1001 Compressor Fundamentals"
  },
  {
    id: "c38-053",
    category: "Compresores",
    difficulty: "medium",
    question: "Un compresor semi-hermético tiene desplazamiento de 30 CFH a 1,750 RPM. ¿Cuánto desplaza en CFM?",
    options: {
      a: "0.5 CFM (CFH/60 real)",
      b: "30 CFM (igual que CFH)",
      c: "1,800 CFM (CFH × 60)",
      d: "52,500 CFM (CFH × RPM)"
    },
    correct: "a",
    explanation: "CFH = pies cúbicos por HORA. CFM = CFH/60 = 30/60 = 0.5 CFM. Es desplazamiento volumétrico, no flujo másico (depende del refrigerante y condiciones).",
    reference: "Unit Conversion - ASHRAE Fundamentals Handbook"
  },
  {
    id: "c38-054",
    category: "Compresores",
    difficulty: "hard",
    question: "Un compresor Bitzer 4DC-7.2Y tiene desplazamiento de 22.3 m³/h a 1,450 RPM. A 50°F SST con R-448A, su capacidad es ~7.2 HP equivalente. Si opera a 60 Hz (1,750 RPM), ¿cómo cambia aproximadamente el desplazamiento?",
    options: {
      a: "Disminuye 20% por la pérdida mecánica",
      b: "Aumenta ~20% proporcional al RPM motor",
      c: "No cambia, el diseño fijo lo limita",
      d: "Se duplica por el ratio de las etapas"
    },
    correct: "b",
    explanation: "Desplazamiento ∝ RPM. 1,750/1,450 = 1.207, es decir ~20% más. Hay que confirmar que el motor soporta la potencia extra y que la capacidad no exceda el condensador.",
    reference: "Bitzer Software + Product Information KP-100-7"
  },
  {
    id: "c38-055",
    category: "Compresores",
    difficulty: "easy",
    question: "¿Qué es un compresor scroll digital?",
    options: {
      a: "Un scroll con pantalla LCD integrada al gabinete",
      b: "Un scroll que modula por separación cíclica de scrolls",
      c: "Un scroll conectado a internet vía módulo Modbus",
      d: "Un scroll de dos etapas con economizer de líquido"
    },
    correct: "b",
    explanation: "El scroll digital (Copeland Digital Scroll) modula capacidad 10-100% mediante un solenoide que separa las scrolls durante un ciclo de 15-20 s. Permite match load sin VFD.",
    reference: "Copeland AE-1319 Digital Scroll Compressor"
  },
  {
    id: "c38-056",
    category: "Compresores",
    difficulty: "medium",
    question: "Los compresores de tornillo (screw) se usan típicamente en:",
    options: {
      a: "Reach-ins chicos de 1 a 3 HP en tiendas",
      b: "Industrial grande arriba de 50 HP y racks",
      c: "Refrigeradores domésticos y freezers caseros",
      d: "Ventilación residencial y mini-split 2 ton"
    },
    correct: "b",
    explanation: "Screw compressors dominan arriba de 50 HP en NH3 industrial, racks grandes y plantas de procesos. Ventajas: modulación continua con slide valve, pocas partes móviles, alta confiabilidad.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2 - Screw Compressors"
  },
  {
    id: "c38-057",
    category: "Compresores",
    difficulty: "medium",
    question: "El crankcase heater se usa para:",
    options: {
      a: "Calentar el cuarto cuando el equipo está parado",
      b: "Evaporar refrigerante migrado al aceite en off-cycle",
      c: "Calentar refrigerante del condensador en clima frío",
      d: "Precalentar el motor eléctrico del compresor scroll"
    },
    correct: "b",
    explanation: "Durante off-cycle el refrigerante migra al aceite del crankcase. Al arrancar, baja presión → el refrigerante se evapora violentamente (foaming) y el compresor pierde lubricación. El heater evita esto.",
    reference: "Copeland AE-1106 Compressor Crankcase Heaters"
  },
  {
    id: "c38-058",
    category: "Compresores",
    difficulty: "easy",
    question: "El pump-down control apaga el compresor por:",
    options: {
      a: "Alta presión del condensador sobre 400 psig",
      b: "Baja presión tras cerrar solenoide de líquido",
      c: "Baja temperatura del cuarto abajo de los 28°F",
      d: "Alta temperatura de descarga sobre los 275°F"
    },
    correct: "b",
    explanation: "Cuando el termostato se satisface, cierra el liquid line solenoid. El compresor sigue corriendo hasta que el low pressure switch lo apaga—así evacua todo el refrigerante del evaporador y evita migración al crankcase.",
    reference: "Sporlan Bulletin 30-10 Pump-Down Control"
  },
  {
    id: "c38-059",
    category: "Compresores",
    difficulty: "medium",
    question: "¿Qué protección monitorea la temperatura de descarga en compresores scroll Copeland ZF/ZB?",
    options: {
      a: "Pressure switch solo de baja, diferencial fijo",
      b: "DTC integrado de discharge, trip cerca de 275°F",
      c: "Oil pressure switch a 9 psi neto por 90 segundos",
      d: "Fusible térmico fijo de 150°F no rearmable"
    },
    correct: "b",
    explanation: "Los scroll low/medium-temp Copeland llevan DTC integrado. A ~275°F de discharge el termostato abre y protege las scrolls de carbonización del aceite. Causas comunes: bajo refrigerante, alto CR.",
    reference: "Copeland AE-1343 ZF/ZB Scroll Compressors"
  },
  {
    id: "c38-060",
    category: "Compresores",
    difficulty: "hard",
    question: "En un compresor reciprocating semi-hermético, la capacidad puede modularse con:",
    options: {
      a: "Timer del thermostat ciclando cada cinco minutos off",
      b: "Cylinder unloaders desactivan pistones con solenoide",
      c: "Cambio manual de belts y polea mayor para bajar RPM",
      d: "Agregar refrigerante al receiver para reducir la carga"
    },
    correct: "b",
    explanation: "Los cylinder unloaders mantienen abierta la válvula de succión de uno o más cilindros, reduciendo capacidad en steps (50%, 66%, 75%). Usado en 4, 6 y 8 cilindros. Común en racks grandes.",
    reference: "Bitzer Octagon Series Technical Information"
  },
  {
    id: "c38-061",
    category: "Compresores",
    difficulty: "medium",
    question: "Un compresor con corriente de bloqueo (locked rotor) está sacando LRA constante. La causa más probable es:",
    options: {
      a: "Bajo voltaje o fallo mecánico seized internally",
      b: "Demasiado refrigerante con slugging de líquido",
      c: "Filter drier tapado en la línea de succión",
      d: "Fan del condensador ruidoso con vibración"
    },
    correct: "a",
    explanation: "LRA continua = el motor no arranca. Causas: bajo voltaje (<10% de nameplate), capacitor dañado, contactor con un polo perdido, mecánicamente trabado (slugging pasado, oil lockup o bearing seize).",
    reference: "Copeland AE-1102 Motor Protection"
  },
  {
    id: "c38-062",
    category: "Compresores",
    difficulty: "medium",
    question: "El oil pressure safety switch en compresores semi-herméticos se trip si la diferencial baja de:",
    options: {
      a: "5 psi neto por más de 2 minutos seguidos",
      b: "9-12 psi diferencial por 90-120 segundos",
      c: "50 psi inmediatamente sin retraso alguno",
      d: "0 psi absoluto medido contra atmósfera"
    },
    correct: "b",
    explanation: "OPS mide diferencial oil-suction. Trip típico: 9 psi net por 90-120 s (para permitir arranque). Causas: bajo nivel aceite, bomba aceite desgastada, succión baja extrema, refrigerante diluyendo aceite.",
    reference: "Copeland AE-1106 + Bitzer Technical Docs"
  },

  // ===================== SISTEMAS DE DEFROST (10) =====================
  {
    id: "c38-063",
    category: "Sistemas de Defrost",
    difficulty: "easy",
    question: "¿Qué método de defrost usa el gas caliente de descarga del compresor invirtiendo temporalmente el flujo?",
    options: {
      a: "Off-cycle defrost con fans del evaporador corriendo",
      b: "Electric defrost con resistencias eléctricas de 10 kW",
      c: "Hot gas defrost con válvula de 3 vías redirigiendo",
      d: "Air defrost por convección natural del aire cuarto"
    },
    correct: "c",
    explanation: "Hot gas defrost redirige el discharge gas al evaporador vía válvulas de 3 vías/solenoides. Es muy rápido (5-10 min) y eficiente porque usa calor rechazado. Estándar en racks y NH3 industrial.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14 - Defrost Methods"
  },
  {
    id: "c38-064",
    category: "Sistemas de Defrost",
    difficulty: "easy",
    question: "Off-cycle defrost funciona cuando:",
    options: {
      a: "El compresor está prendido en alta capacidad modulada",
      b: "SST sube de 32°F y fans siguen corriendo para derretir hielo",
      c: "Se inyecta agua caliente al coil desde bomba circuladora",
      d: "Se usan resistencias eléctricas entre las aletas del coil"
    },
    correct: "b",
    explanation: "Off-cycle (air defrost) solo sirve para medium-temp (cuartos >35°F). El compresor se apaga, los fans siguen circulando aire del cuarto sobre el coil y derriten la escarcha. Ahorra energía.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14"
  },
  {
    id: "c38-065",
    category: "Sistemas de Defrost",
    difficulty: "medium",
    question: "¿Por qué se usa defrost termination por temperatura en vez de solo por tiempo?",
    options: {
      a: "Porque los sensores por tiempo salen más baratos",
      b: "Para terminar cuando el coil ya esté libre de hielo",
      c: "Para activar fan con retraso después del defrost",
      d: "No es necesario, el timer fail-safe es suficiente"
    },
    correct: "b",
    explanation: "Defrost termination por temp (klixon en coil o header a ~55-60°F) detecta que ya se fue el hielo y termina el ciclo. Evita calentar innecesariamente el cuarto y gastar energía.",
    reference: "Heatcraft Engineering Manual - Defrost Controls"
  },
  {
    id: "c38-066",
    category: "Sistemas de Defrost",
    difficulty: "medium",
    question: "El fan delay después del defrost:",
    options: {
      a: "Es innecesario y solo encarece el costo del controller",
      b: "Retrasa arranque del fan hasta que coil vuelva a enfriar",
      c: "Apaga el fan permanentemente hasta siguiente defrost",
      d: "Solo aplica a fans del condensador, nunca a evaporador"
    },
    correct: "b",
    explanation: "Si los fans arrancan inmediatamente después del defrost, soplan el agua residual y vapor hacia el cuarto, saturando el producto y formando hielo nuevo. El fan delay termostato cierra a ~25-30°F SST.",
    reference: "Heatcraft Engineering Manual"
  },
  {
    id: "c38-067",
    category: "Sistemas de Defrost",
    difficulty: "hard",
    question: "Un walk-in freezer tiene 4 defrost cycles/día de 30 min cada uno. Si en vez de electric defrost (10 kW) se usa hot gas defrost (2 kW de energía neta por ciclo), el ahorro diario es aproximadamente:",
    options: {
      a: "Aproximadamente 2 kWh al día",
      b: "Aproximadamente 8 kWh al día",
      c: "Aproximadamente 16 kWh al día",
      d: "Aproximadamente 40 kWh al día"
    },
    correct: "c",
    explanation: "Electric: 10 kW × 0.5 h × 4 = 20 kWh. Hot gas: 2 kW × 0.5 × 4 = 4 kWh. Ahorro = 16 kWh/día × 365 = ~5,840 kWh/año. Razón por la que hot gas es estándar en racks grandes.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14 - Defrost Energy"
  },
  {
    id: "c38-068",
    category: "Sistemas de Defrost",
    difficulty: "medium",
    question: "Los drain pan heaters durante defrost sirven para:",
    options: {
      a: "Calentar el aire del cuarto durante el ciclo",
      b: "Evitar que agua drenada se congele en bandeja",
      c: "Aumentar la capacidad neta del evaporador frío",
      d: "Generar alarma visual si hay fallo del defrost"
    },
    correct: "b",
    explanation: "En freezers la bandeja y la línea de drain vuelven a quedar por debajo de 32°F rápido después del defrost. Sin heaters el agua se recongela y causa que el coil se inunde de hielo en el próximo ciclo.",
    reference: "Heatcraft Engineering Manual - Drain Line Heat"
  },
  {
    id: "c38-069",
    category: "Sistemas de Defrost",
    difficulty: "easy",
    question: "¿Cuántos defrost cycles típicos requiere un walk-in freezer al día?",
    options: {
      a: "1-2 ciclos por día típicos",
      b: "4-6 ciclos por día típicos",
      c: "12-15 ciclos por día típicos",
      d: "Ningún ciclo, no se requiere"
    },
    correct: "b",
    explanation: "Típicamente 4-6 ciclos de 20-45 min, programados según humedad y uso. Walk-ins con puerta que abre mucho pueden requerir más. Defrost on-demand (sensor de hielo) optimiza el número.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14"
  },
  {
    id: "c38-070",
    category: "Sistemas de Defrost",
    difficulty: "medium",
    question: "Un coil de evaporador tarda 30 min en defrost pero termina por tiempo (fail-safe) cada vez. ¿Qué indica?",
    options: {
      a: "Funcionando normal, es esperado con escarcha alta",
      b: "Defrost termination switch fallando, sin contacto",
      c: "Hay demasiado refrigerante cargado en el sistema",
      d: "El termostato principal del cuarto mal calibrado"
    },
    correct: "b",
    explanation: "Si cada defrost termina por fail-safe (timer), el termination stat nunca sensa >55°F. Verificar contacto físico con el coil, cable cortado o stat abierto. Desperdicia energía y calienta el cuarto.",
    reference: "Heatcraft Engineering Troubleshooting Guide"
  },
  {
    id: "c38-071",
    category: "Sistemas de Defrost",
    difficulty: "medium",
    question: "En hot gas defrost para racks grandes, qué válvula principal dirige el gas al evaporador:",
    options: {
      a: "EPR valve de succión del evaporador",
      b: "3-way defrost valve o solenoid header",
      c: "TXV con bulbo remoto en la succión",
      d: "Crankcase pressure regulator KVR tipo"
    },
    correct: "b",
    explanation: "Las 3-way defrost valves (Sporlan, Parker) redirigen gas caliente al suction header del evaporador durante defrost. También se bloquea la línea de líquido vía solenoid LLS. Coordinado por el controller del rack.",
    reference: "Sporlan Bulletin 90-30 Defrost Valves"
  },
  {
    id: "c38-072",
    category: "Sistemas de Defrost",
    difficulty: "hard",
    question: "Durante hot gas defrost ocurre 'liquid floodback' si:",
    options: {
      a: "El gas de descarga tiene mucho superheat y no se condensa",
      b: "El gas se condensa en evaporador frío y vuelve como líquido",
      c: "El fan del evaporador está prendido durante el ciclo",
      d: "El drain está tapado y el agua se regresa al coil frío"
    },
    correct: "b",
    explanation: "El hot gas se condensa rápidamente en el coil frío; si no hay suction accumulator o defrost relief valve, el líquido puede regresar al compresor y causar slugging. Diseño requiere timing y hardware correctos.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 14 - Hot Gas Defrost Design"
  },

  // ===================== EPA 608 TIPO II (10) =====================
  {
    id: "c38-073",
    category: "EPA 608 Tipo II",
    difficulty: "easy",
    question: "Para trabajar con equipo de alta presión en refrigeración comercial (walk-ins, racks), se requiere certificación EPA 608:",
    options: {
      a: "Type I, solo small appliances",
      b: "Type II, high pressure commercial",
      c: "Type III, low pressure chillers",
      d: "No se requiere certificación EPA"
    },
    correct: "b",
    explanation: "EPA 608 Type II cubre equipos de alta presión (R-22, R-404A, R-448A, R-410A, etc.). Type I = small appliance (<5 lb), Type III = low-pressure chillers (R-123). Universal = todas.",
    reference: "EPA 40 CFR 82 Subpart F §82.161 Technician Certification"
  },
  {
    id: "c38-074",
    category: "EPA 608 Tipo II",
    difficulty: "easy",
    question: "¿Qué nivel de vacío requiere EPA para recovery de refrigerantes HFC de sistemas de alta presión >200 lb con ningún isolation valve?",
    options: {
      a: "0 psig medido en manifold",
      b: "4 inHg de vacío medido",
      c: "10 inHg de vacío medido",
      d: "15 inHg de vacío medido"
    },
    correct: "c",
    explanation: "EPA 40 CFR 82 Subpart F Apéndice C tabla: recovery de HFC >200 lb = 10 inHg. Para <200 lb = 0 psig. CFC/HCFC tienen requerimientos más estrictos.",
    reference: "EPA 40 CFR 82 Subpart F Apéndice C"
  },
  {
    id: "c38-075",
    category: "EPA 608 Tipo II",
    difficulty: "medium",
    question: "Venteo intencional de refrigerante HFC a la atmósfera:",
    options: {
      a: "Permitido si es menos de 1 lb por evento documentado",
      b: "Prohibido por Clean Air Act 608, multa $44,539/día",
      c: "Legal en emergencias de vida o explosión inminente",
      d: "Solo prohibido para CFCs y HCFCs, no para HFCs"
    },
    correct: "b",
    explanation: "Section 608 prohíbe venting de CFC, HCFC, HFC y ahora muchos HFO reemplazos. Multa hasta ~$44,539/día (ajustado por inflación) + criminal prosecution. Permitidos: purge de nitrógeno o venteos de minimal quantities durante recovery.",
    reference: "Clean Air Act §608 + 40 CFR 82.154"
  },
  {
    id: "c38-076",
    category: "EPA 608 Tipo II",
    difficulty: "medium",
    question: "El leak repair requirement de EPA aplica a equipos con carga de:",
    options: {
      a: "Equipos chicos con carga menor a 5 lb totales",
      b: "Equipos intermedios entre 5 y 50 lb de carga",
      c: "50+ lb con leak rate arriba del trigger por clase",
      d: "Solo equipos industriales grandes arriba de 500 lb"
    },
    correct: "c",
    explanation: "40 CFR 82.157 aplica a equipos con carga full ≥50 lb. Si el annualized leak rate excede el umbral, hay que reparar en 30 días e verificar con leak test. Records se mantienen 3 años.",
    reference: "EPA 40 CFR 82.157"
  },
  {
    id: "c38-077",
    category: "EPA 608 Tipo II",
    difficulty: "easy",
    question: "Los técnicos EPA 608 deben mantener records de ventas de refrigerante por:",
    options: {
      a: "1 año desde la venta",
      b: "3 años desde la venta",
      c: "5 años desde la venta",
      d: "10 años desde la venta"
    },
    correct: "b",
    explanation: "EPA requiere records de venta/distribución de refrigerantes por 3 años. Incluye fecha, cantidad, identidad del comprador certificado (número EPA) y refrigerante.",
    reference: "EPA 40 CFR 82.166 Recordkeeping"
  },
  {
    id: "c38-078",
    category: "EPA 608 Tipo II",
    difficulty: "medium",
    question: "Las máquinas de recovery vendidas después de 1993 deben alcanzar:",
    options: {
      a: "Cualquier nivel de vacío, no hay requisito mínimo",
      b: "Niveles específicos por refrigerante, cert AHRI/UL",
      c: "Solo 0 psig, igual a presión atmosférica local",
      d: "1 atmósfera absoluta medida en puerto de servicio"
    },
    correct: "b",
    explanation: "Equipos post-1993 deben estar certificados según §82.158 y tabla correspondiente. Para HFC alta presión el nivel depende del tipo (cilindro de recovery pasivo vs máquina activa) y tamaño del sistema.",
    reference: "EPA 40 CFR 82.158"
  },
  {
    id: "c38-079",
    category: "EPA 608 Tipo II",
    difficulty: "hard",
    question: "Un supermercado tiene un rack con carga de 1,500 lb R-448A. En un año reportó 450 lb de leak. ¿Cuál es el leak rate anual y qué exige EPA?",
    options: {
      a: "30% anual, no requiere acción ni plan de reparación",
      b: "30% anual, excede trigger: reparar en 30 días + plan",
      c: "3% anual, está bien y sin obligación de inspecciones",
      d: "300% anual ilegal, con multa penal automática EPA"
    },
    correct: "b",
    explanation: "450/1,500 = 30%. El trigger para retail food es 30% (comercial 20%). En el umbral, EPA exige reparación en 30 días, verificación con leak test y mandatory leak inspections según carga.",
    reference: "EPA 40 CFR 82.157 + AIM Act Leak Repair Rule"
  },
  {
    id: "c38-080",
    category: "EPA 608 Tipo II",
    difficulty: "medium",
    question: "Para reclamar refrigerante (reclaim), se debe limpiar al nivel de:",
    options: {
      a: "AHRI-700, pureza equivalente a refrigerante virgen",
      b: "10% de humedad residual permitida en el cilindro",
      c: "Cualquier nivel de pureza tras recovery básico",
      d: "50% de pureza mínima según estándar voluntario"
    },
    correct: "a",
    explanation: "Reclaim = procesar a especificación AHRI-700 (equivalente a refrigerante virgen). Debe hacerse por reclaimer certificado por EPA. Recovery + recycle en campo NO califica como reclaim.",
    reference: "EPA 40 CFR 82.164 + AHRI 700"
  },
  {
    id: "c38-081",
    category: "EPA 608 Tipo II",
    difficulty: "easy",
    question: "Los cilindros DOT de recovery deben estar pintados:",
    options: {
      a: "De cualquier color según preferencia del técnico",
      b: "Gris con tapa amarilla, estándar DOT de recovery",
      c: "Rojos con franja blanca, solo para R-22 virgen",
      d: "Negros con blanco, solo para CO2 transcritical"
    },
    correct: "b",
    explanation: "DOT 4BA/4BW cilindros de recovery (refillable) son gris con tapa amarilla. No confundir con cilindros one-time-use de refrigerante virgen (colores AHRI). Llenar max 80% por peso.",
    reference: "DOT 49 CFR + AHRI Guideline N"
  },
  {
    id: "c38-082",
    category: "EPA 608 Tipo II",
    difficulty: "medium",
    question: "Bajo el AIM Act, el uso de R-404A en equipos nuevos retail food refrigeration systems con carga ≥200 lb está:",
    options: {
      a: "Permitido sin restricciones de GWP aplicables",
      b: "Limitado a GWP <150 en nuevos supermercados",
      c: "Solo restringido a residencial, comercial libre",
      d: "Libre hasta 2050 bajo exenciones agrícolas"
    },
    correct: "b",
    explanation: "AIM Act Technology Transitions Rule limita nuevos sistemas retail food centralized ≥200 lb a GWP <150 (2027). Por eso nuevas plazas están poniendo R-744 (CO2) transcritical o R-454A/R-455A.",
    reference: "EPA AIM Act Technology Transitions Final Rule 2023"
  },

  // ===================== SUPERMARKET RACKS (10) =====================
  {
    id: "c38-083",
    category: "Supermarket Racks",
    difficulty: "easy",
    question: "Un parallel rack system tiene múltiples compresores compartiendo:",
    options: {
      a: "Un solo evaporador con distribuidor de líquido",
      b: "Suction y discharge headers comunes a varias cajas",
      c: "Solo la bomba de agua del loop de condensación",
      d: "Nada, son circuitos completamente independientes"
    },
    correct: "b",
    explanation: "Rack paralelo comparte suction y discharge manifolds. Los compresores se encienden/apagan para matching load. Cada caja/coil tiene su liquid line solenoid y EPR o TEV para temperatura individual.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15 - Retail Food Refrigeration"
  },
  {
    id: "c38-084",
    category: "Supermarket Racks",
    difficulty: "medium",
    question: "En un rack típico, los dos circuitos de temperatura son:",
    options: {
      a: "Solo low-temp a -25°F SST para freezers",
      b: "Low-temp -25°F SST y medium-temp +20°F SST",
      c: "Solo high-temp arriba 40°F SST nominal",
      d: "Cuatro circuitos siempre, sin variación"
    },
    correct: "b",
    explanation: "Rack low-temp opera alrededor -25°F SST para freezers/ice cream. Medium-temp (~+20°F SST) sirve cajas de carnes, deli, lácteos, produce. Cada uno con su manifold y controller.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15"
  },
  {
    id: "c38-085",
    category: "Supermarket Racks",
    difficulty: "medium",
    question: "El EPR (Evaporator Pressure Regulator) valve mantiene:",
    options: {
      a: "Presión de descarga constante al condensador",
      b: "Presión mínima de evaporación para no congelar",
      c: "Presión de aceite del compresor semi-hermético",
      d: "Flujo de agua hacia el water-cooled condenser"
    },
    correct: "b",
    explanation: "El EPR (ORIT, ORI) está en la succión de cajas de medium-temp que comparten rack con otras más frías. Limita presión mínima del evaporador individual para evitar que la caja de produce se congele.",
    reference: "Sporlan Bulletin 90-20 EPR Valves"
  },
  {
    id: "c38-086",
    category: "Supermarket Racks",
    difficulty: "easy",
    question: "Floating head pressure control ahorra energía al:",
    options: {
      a: "Fijar la presión de descarga alta en todo momento",
      b: "Dejar bajar SDT en clima frío, reduce CR y watts",
      c: "Cerrar los evaporadores por alta humedad ambiente",
      d: "Aumentar subcooling con inyección líquida al rack"
    },
    correct: "b",
    explanation: "En vez de mantener SDT fijo a 105°F, se deja bajar con el clima (mínimo limitado por TXV capacity o MOP). Cada grado de SDT menos ahorra ~2% de energía del compresor. Requerido por Title 24 en CA.",
    reference: "California Title 24 §120.6 + ASHRAE 90.1"
  },
  {
    id: "c38-087",
    category: "Supermarket Racks",
    difficulty: "hard",
    question: "Un rack medium-temp tiene 6 compresores de 10 HP. La carga del día baja al 20%. Con paralelización + VFD en el lead compressor, ¿cómo opera óptimamente?",
    options: {
      a: "Los 6 compresores prendidos al 100% de capacidad",
      b: "1 compresor con VFD al 20% y los demás apagados",
      c: "3 compresores al 50% con ciclado cada 10 minutos",
      d: "Los 6 compresores al 3.3% con cylinder unloaders"
    },
    correct: "b",
    explanation: "Racks modernos usan VFD en el lead compressor para modulación fina y apagan los demás hasta que suba la carga. Minimiza cycling, iguala capacidad a la demanda y mejora eficiencia a parcial load.",
    reference: "Emerson E2/E3 + Danfoss AK-PC Rack Controllers"
  },
  {
    id: "c38-088",
    category: "Supermarket Racks",
    difficulty: "medium",
    question: "Las cajas de display tienen anti-sweat heaters en los frames. Bajo Title 24 deben:",
    options: {
      a: "Correr siempre al 100% durante las horas de tienda",
      b: "Modular con sensor de dew point para evitar sudado",
      c: "Apagarse permanentemente durante toda la temporada",
      d: "Ser térmicamente independientes del rack controller"
    },
    correct: "b",
    explanation: "Title 24 y ASHRAE 90.1 exigen anti-sweat heater controls que modulen basados en humedad de tienda. Puede ahorrar 50-70% vs. control on/off fijo.",
    reference: "California Title 24 Part 6 §120.6(c)"
  },
  {
    id: "c38-089",
    category: "Supermarket Racks",
    difficulty: "medium",
    question: "El heat reclaim en un rack supermercado se usa para:",
    options: {
      a: "Nada, es totalmente opcional sin beneficio real",
      b: "Usar calor de descarga para calefacción o agua",
      c: "Enfriar el condensador por debajo de ambiente",
      d: "Calentar el evaporador durante el ciclo frío"
    },
    correct: "b",
    explanation: "Heat reclaim desvía parte del discharge gas a un coil/intercambiador en el RTU o en un tanque para hot water. Ahorra gas/electricidad de calefacción. Requiere válvulas 3-way y controles integrados.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15 - Heat Recovery"
  },
  {
    id: "c38-090",
    category: "Supermarket Racks",
    difficulty: "easy",
    question: "Un rack CO2 transcritical booster tiene:",
    options: {
      a: "Un solo compresor grande de doble efecto transcrítico",
      b: "Dos etapas: LT boosters descargan al suction de MT",
      c: "Solo evaporadores sin compresión mecánica interna",
      d: "No usa compresores, solo diferencias de gravedad"
    },
    correct: "b",
    explanation: "En booster CO2, los LT compressors comprimen de ~-30°F a ~+20°F (suction MT). Los MT compressors llevan al gas cooler transcritical (>87.8°F / 1,055 psig). Eficiente en climas fríos.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 - CO2 Transcritical"
  },
  {
    id: "c38-091",
    category: "Supermarket Racks",
    difficulty: "hard",
    question: "Un rack tiene liquid line solenoid valves para cada caja. Si uno falla cerrado, ¿qué pasa?",
    options: {
      a: "Nada, el rack compensa automáticamente con reserva",
      b: "La caja sin líquido sube de temperatura y alarma",
      c: "El rack entero se apaga por protección general",
      d: "Explota el receiver por sobrepresión mecánica"
    },
    correct: "b",
    explanation: "El LLS cerrado corta flujo a ese coil. El evaporador se vacía, superheat se dispara, y la caja individual sube de temperatura. El controller alarma por high product temp. Verificar coil LLS, cable y controller output.",
    reference: "Emerson/Danfoss Rack Controller Troubleshooting"
  },
  {
    id: "c38-092",
    category: "Supermarket Racks",
    difficulty: "medium",
    question: "Mechanical subcooling en racks grandes se logra con:",
    options: {
      a: "Agua fría de torre de enfriamiento en serie al rack",
      b: "Ciclo aux que subcool el líquido aumentando capacidad",
      c: "Solo con un condensador de mayor tamaño y aletas",
      d: "Ventiladores extra agregados al condenser coil fan"
    },
    correct: "b",
    explanation: "Mechanical subcooler es un ciclo aux (a veces glicol o CO2 secondary) que subcool el líquido a ~45°F. Aumenta capacidad neta y permite floating head más agresivo. Común en racks de supermercado grandes.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15 - Mechanical Subcooling"
  },

  // ===================== TROUBLESHOOTING COMERCIAL (8) =====================
  {
    id: "c38-093",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "Una walk-in freezer tiene temperatura alta pero el compresor corre constante, la succión baja mucho (-5 psig con R-448A) y el evaporador está lleno de hielo. Causa más probable:",
    options: {
      a: "Sobrecarga de refrigerante con slugging de líquido",
      b: "Defrost fallando por timer, heaters o termination",
      c: "Condensador sucio con aletas tapadas de grasa",
      d: "TXV mal calibrada con superheat ajustado bajo"
    },
    correct: "b",
    explanation: "Coil lleno de hielo = flujo de aire bloqueado → succión colapsa, sin transferencia de calor. Checar: clock del defrost, resistencias (ohmeter), termination stat, contactor de defrost, drain line congelado.",
    reference: "Heatcraft Troubleshooting Guide"
  },
  {
    id: "c38-094",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "High head pressure y high liquid line temperature en un día de 95°F. Primera revisión:",
    options: {
      a: "Condensador sucio o fan del condensador sin girar",
      b: "Cambiar el compresor completo por uno de más HP",
      c: "Bajar el refrigerante sacando carga por el liquid",
      d: "Apagar el termostato del cuarto por unos minutos"
    },
    correct: "a",
    explanation: "High head = condensador no rechaza calor eficientemente. Chequear: coil sucio (lavar), fan blade/motor, capacitor del fan motor, head pressure control que restrinja fan en frío (falla en caliente).",
    reference: "ACCA Technician Reference - Condenser Troubleshooting"
  },
  {
    id: "c38-095",
    category: "Troubleshooting Comercial",
    difficulty: "hard",
    question: "Compresor scroll Copeland ZB cycling por discharge temperature cutoff. Con R-448A, SST=20°F y SDT=115°F. Superheat=35°F, subcooling=3°F. Diagnóstico:",
    options: {
      a: "Sobrecarga de refrigerante con subcooling alto",
      b: "Bajo refrigerante, alto superheat y DTC trip",
      c: "Problema eléctrico con capacitor de arranque",
      d: "Aire en el sistema generando presión parcial"
    },
    correct: "b",
    explanation: "Bajo subcooling (3°F) + alto superheat (35°F) = undercharge. El compresor trabaja duro con poca mass flow, se sobrecalienta y trip el DTC. Leak check, reparar, evacuar y cargar por peso + verificar.",
    reference: "Copeland AE-1343 + Troubleshooting Low-Temp Scrolls"
  },
  {
    id: "c38-096",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "Un ice machine comercial produce hielo lechoso/nublado. Causa típica:",
    options: {
      a: "Exceso de agua en la bandeja durante harvest",
      b: "Agua con minerales o freeze cycle muy corto",
      c: "Refrigerante contaminado con humedad residual",
      d: "Solo cosmético, sin impacto en la calidad"
    },
    correct: "b",
    explanation: "Hielo nublado = agua con minerales (hard water) o tiempo de freeze insuficiente que no permite que las impurezas sean rechazadas por la placa. Water filter + ajuste de freeze/harvest cycle según fabricante.",
    reference: "Manitowoc/Scotsman Service Manuals"
  },
  {
    id: "c38-097",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "Un walk-in cooler tiene producto congelado a pesar de que el termostato está en 38°F. Causa probable:",
    options: {
      a: "TXV starving por filter drier tapado en líquido",
      b: "EPR fallada abierta o coil TD alto congelando",
      c: "Exceso de humedad en el cuarto por puerta abierta",
      d: "Condensador sucio bajando la capacidad nominal"
    },
    correct: "b",
    explanation: "Con TD de 10°F y SST ~28°F, el coil debe estar a 28°F. Si la EPR falla o el sistema sobrealimenta, SST puede caer a 15-20°F y congelar producto próximo al return. También verificar distribución de aire.",
    reference: "Sporlan Bulletin 90-20 EPR + Heatcraft Engineering"
  },
  {
    id: "c38-098",
    category: "Troubleshooting Comercial",
    difficulty: "hard",
    question: "Fuga intermitente en una line de líquido de rack CO2 transcritical. Mejor método de detección:",
    options: {
      a: "Jabón convencional sobre juntas a presión normal",
      b: "Detector infrared para CO2 y test a 1,740 psig",
      c: "Lámpara UV con trazador fluorescente estándar",
      d: "Oído solamente a oídas contra la línea de gas"
    },
    correct: "b",
    explanation: "CO2 no se detecta con halide detectors estándar de HFC. Usar detector infrared CO2 o bubble test con jabón especial a test pressure (1.5x MWP lado alto). OP debe tener standby refrigeration para evitar hielo seco.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 + ANSI/IIAR 2"
  },
  {
    id: "c38-099",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "Un compresor semi-hermético tiene aceite muy bajo en el sight glass pero no hay fuga visible. Causa más probable:",
    options: {
      a: "Consumo normal del compresor durante la carga",
      b: "Oil logging por líneas mal dimensionadas al coil",
      c: "Oil pump rota internamente dentro del crankcase",
      d: "Capacitor malo del motor principal del compresor"
    },
    correct: "b",
    explanation: "El aceite debe regresar al compresor vía suction. Si las líneas tienen velocity insuficiente (especialmente verticals risers con load parcial), el aceite se atrapa en el evaporador. Rediseñar con double risers o adjust line sizing.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 1 - Oil Return in Piping"
  },
  {
    id: "c38-100",
    category: "Troubleshooting Comercial",
    difficulty: "hard",
    question: "Un rack tiene alarma de high discharge pressure y el floating head pressure controller no está bajando los fans. Ambient=75°F, SDT=125°F. ¿Primer paso?",
    options: {
      a: "Cambiar el receiver por uno de mayor capacidad",
      b: "Verificar fan staging VFD, coil y setpoint floating",
      c: "Agregar refrigerante extra al receiver principal",
      d: "Apagar todo el rack y esperar a que ambient baje"
    },
    correct: "b",
    explanation: "A 75°F ambient el SDT debería ser ~90-95°F con floating head. 125°F indica: fans apagados por controller, coil sucio, relay del fan fallando, o setpoint min programado muy alto. Checar EMS logs y outputs.",
    reference: "Emerson E2/E3 Rack Controller Manual + Danfoss AK-PC"
  },
  // ===================== EXPANSIÓN 101-150 =====================
  {
    id: "c38-101",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "En un sistema de refrigeración de dos etapas (two-stage), ¿qué componente conecta las dos etapas?",
    options: {
      a: "Filter drier doble con sight glass",
      b: "Intercooler o flash tank entre etapas",
      c: "TXV balanceado externamente MOP",
      d: "Accumulator de succión con heater"
    },
    correct: "b",
    explanation: "Los sistemas de dos etapas usan un intercooler (o flash intercooler/open intercooler) entre la etapa de baja y alta. Esto baja la temperatura del gas de descarga de la primera etapa y mejora la eficiencia a bajas temperaturas (<-30°F SST).",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2 - Multistage Systems"
  },
  {
    id: "c38-102",
    category: "Ciclo Comercial",
    difficulty: "medium",
    question: "En un sistema cascade con R-744 (CO2) en la etapa baja y R-134a en la alta, ¿dónde ocurre el intercambio de calor entre refrigerantes?",
    options: {
      a: "En el receiver de alta presión del rack comercial",
      b: "En el cascade heat exchanger entre CO2 y R-134a",
      c: "En el economizer de la etapa alta con flash tank",
      d: "En el desobrecalentador aguas abajo de descarga"
    },
    correct: "b",
    explanation: "En un cascade, el condensador de la etapa baja (CO2) y el evaporador de la etapa alta (R-134a) son el mismo intercambiador de calor. El CO2 rechaza calor al R-134a a una temperatura intermedia (~20°F), permitiendo aplicaciones de -40°F o más frías.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 48 - CO2 in Commercial Refrigeration"
  },
  {
    id: "c38-103",
    category: "Ciclo Comercial",
    difficulty: "hard",
    question: "Un sistema transcritical de CO2 (R-744) opera arriba del punto crítico (87.8°F/1070 psia). ¿Qué reemplaza al condensador en operación transcrítica?",
    options: {
      a: "Un evaporador secundario de alta presión",
      b: "Un gas cooler donde CO2 solo se enfría",
      c: "Un receiver presurizado de media etapa",
      d: "Un economizer de alta presión cerrado"
    },
    correct: "b",
    explanation: "En modo transcrítico (típico en climas cálidos), el CO2 sale del compresor como fluido supercrítico. No condensa, solo se enfría sensiblemente en un gas cooler. La presión de descarga debe controlarse con una válvula de alta presión para optimizar COP.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 - CO2 Transcritical Systems"
  },
  {
    id: "c38-104",
    category: "Walk-ins and Reach-ins",
    difficulty: "easy",
    question: "¿Cuál es el valor R típico mínimo requerido para paneles de walk-in cooler según Title 24?",
    options: {
      a: "R-10 mínimo panel",
      b: "R-19 mínimo panel",
      c: "R-25 mínimo panel",
      d: "R-40 mínimo panel"
    },
    correct: "c",
    explanation: "California Title 24 y los estándares federales DOE requieren R-25 mínimo para paneles de walk-in cooler (arriba de 32°F) y R-32 para walk-in freezers. La mayoría de paneles estructurales de 4\" de poliuretano cumplen R-25+.",
    reference: "Title 24 Part 6 + 10 CFR 431.306 Walk-in Cooler Standards"
  },
  {
    id: "c38-105",
    category: "Walk-ins and Reach-ins",
    difficulty: "medium",
    question: "¿Cuál es la función de la barrera de vapor (vapor barrier) en un walk-in freezer?",
    options: {
      a: "Evitar fuga de refrigerante por paneles estructurales del walk-in freezer",
      b: "Impedir que la humedad migre y condense dentro del aislamiento del panel",
      c: "Reducir la transmisión de ruido del evaporador hacia el exterior del box",
      d: "Proteger contra propagación de incendios entre zonas del cuarto frío"
    },
    correct: "b",
    explanation: "La barrera de vapor debe ir en el LADO CÁLIDO del aislamiento (exterior en freezer). Si la humedad migra al panel, condensa y se congela, destruyendo el valor R y causando corrosión estructural. Sellar TODAS las penetraciones con mastic apropiado.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 23 - Refrigerated Facility Design"
  },
  {
    id: "c38-106",
    category: "Walk-ins and Reach-ins",
    difficulty: "medium",
    question: "En un walk-in freezer con piso, ¿por qué se requieren calentadores de piso (under-floor heaters)?",
    options: {
      a: "Para derretir hielo que entra con producto nuevo al box",
      b: "Para evitar frost heave que levanta y quiebra la losa",
      c: "Para calentar el producto almacenado en pallets bajos",
      d: "Para ahorrar energía durante el ciclo de defrost activo"
    },
    correct: "b",
    explanation: "Sin calentadores bajo la losa, el suelo debajo del freezer puede congelarse progresivamente. El agua en el suelo se expande al congelarse (frost heave) y levanta/quiebra el piso. Se instalan cables eléctricos o tubería glicol debajo para mantener >35°F.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 23 - Floor Heating"
  },
  {
    id: "c38-107",
    category: "Walk-ins and Reach-ins",
    difficulty: "easy",
    question: "¿Qué dispositivo de seguridad es obligatorio en la puerta interior de un walk-in cooler/freezer?",
    options: {
      a: "Un timer de defrost programable con memoria",
      b: "Un mecanismo de liberación interior contra atrapamiento",
      c: "Una cerradura de llave con cilindro anti-vandalismo",
      d: "Un sensor de movimiento con alarma audible remota"
    },
    correct: "b",
    explanation: "Código requiere que TODO walk-in tenga un mecanismo de apertura desde el interior, aunque la puerta esté cerrada con llave desde afuera. Esto previene atrapamiento mortal. También se requiere una luz indicadora y alarma interior audible.",
    reference: "OSHA 29 CFR 1910 + UMC 1104"
  },
  {
    id: "c38-108",
    category: "Walk-ins and Reach-ins",
    difficulty: "hard",
    question: "Al calcular carga térmica de un walk-in cooler, ¿qué componente representa típicamente el mayor porcentaje de la carga en un cooler de bebidas con alta rotación?",
    options: {
      a: "Carga de transmisión por paredes y techo del box",
      b: "Carga del producto en pull-down desde temperatura ambiente",
      c: "Infiltración por aperturas de puerta más carga del producto",
      d: "Calor de motores de evaporadores y luces internas LED"
    },
    correct: "c",
    explanation: "En coolers de alta rotación (p.ej. beer cave), la infiltración por puertas puede representar 30-50% de la carga total, más la carga del producto entrando caliente. El método de ASHRAE usa air-change method o door-opening method para cuantificar.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Load Calculations"
  },
  {
    id: "c38-109",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "¿Qué refrigerante reemplaza directamente al R-404A en muchas aplicaciones comerciales nuevas (lower GWP)?",
    options: {
      a: "R-22 HCFC recargado",
      b: "R-448A o R-449A HFO",
      c: "R-12 CFC virgen",
      d: "R-134a HFC puro"
    },
    correct: "b",
    explanation: "R-448A (Solstice N40) y R-449A (Opteon XP40) son mezclas HFO/HFC diseñadas para reemplazar R-404A con GWP ~1400 vs 3922. Se usan en supermercados nuevos y retrofits. R-404A está siendo phase-down bajo AIM Act.",
    reference: "EPA SNAP + AIM Act 2020"
  },
  {
    id: "c38-110",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "¿Qué característica importante tiene el R-744 (CO2) respecto a la presión de operación?",
    options: {
      a: "Opera a presiones muy bajas cercanas al vacío profundo constante",
      b: "Opera a presiones altas de 400 a 1500 psig con componentes rated",
      c: "Opera a la misma presión de succión y descarga que el R-22",
      d: "Es un refrigerante de muy baja presión similar al R-123 chiller"
    },
    correct: "b",
    explanation: "CO2 opera con presiones mucho más altas que los HFCs: succión ~300-400 psig, descarga hasta 1500+ psig en modo transcrítico. Requiere tubería, válvulas, y componentes rated para alta presión. A favor: GWP=1, no tóxico, barato.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 3 + ANSI/IIAR CO2 Handbook"
  },
  {
    id: "c38-111",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "El R-717 (amoniaco/NH3) se usa en refrigeración industrial. ¿Qué grupo de seguridad le asigna ASHRAE 34?",
    options: {
      a: "A1 baja toxicidad y no flamable",
      b: "A2L baja toxicidad levemente flamable",
      c: "B2L alta toxicidad levemente flamable",
      d: "A3 baja toxicidad altamente flamable"
    },
    correct: "c",
    explanation: "NH3 es clasificado B2L: alta toxicidad (B) y levemente flamable (2L). Por eso requiere detectores de gas, ventilación mecánica, y cumplimiento de IIAR 2/PSM/RMP cuando excede umbrales. Pero es excelente termodinámicamente (COP alto, GWP=0, ODP=0).",
    reference: "ASHRAE 34-2022 + ANSI/IIAR 2"
  },
  {
    id: "c38-112",
    category: "Refrigerantes Comerciales",
    difficulty: "hard",
    question: "Un sistema de amoniaco industrial con más de 10,000 lb de NH3 cae bajo qué regulación federal:",
    options: {
      a: "Solo EPA 608 certification del técnico",
      b: "OSHA PSM 29 CFR 1910.119 más EPA RMP",
      c: "Solo EPA SNAP listing del refrigerante",
      d: "NFPA 70 eléctrico y nada más aplicable"
    },
    correct: "b",
    explanation: "NH3 ≥10,000 lb triggerea OSHA PSM y EPA Risk Management Plan. Exigen process hazard analysis, mechanical integrity program, MOC, incident investigation, emergency response, y RMP submittal a EPA cada 5 años. IIAR 2/6/7/8/9 dan los detalles técnicos.",
    reference: "29 CFR 1910.119 + 40 CFR 68 + ANSI/IIAR 2"
  },
  {
    id: "c38-113",
    category: "Refrigerantes Comerciales",
    difficulty: "easy",
    question: "R-448A y R-449A son mezclas zeotrópicas. ¿Qué significa esto para el técnico?",
    options: {
      a: "No se pueden recargar después de una fuga mayor",
      b: "Tienen glide bubble/dew y se cargan en fase líquida",
      c: "Son azeotrópicas como el R-502 y no separan fase",
      d: "No requieren consulta de tabla PT en el servicio"
    },
    correct: "b",
    explanation: "Las mezclas zeotrópicas (400 series) tienen glide: bubble y dew point difieren. Siempre cargar en fase líquida para mantener la composición. Para superheat usar dew point; para subcooling usar bubble point. El glide en R-448A es ~5-6°F.",
    reference: "Honeywell/Chemours refrigerant handling guides"
  },
  {
    id: "c38-114",
    category: "Compresores",
    difficulty: "easy",
    question: "Un compresor semi-hermético se diferencia del hermético en que:",
    options: {
      a: "No usa aceite de lubricación en el cárter",
      b: "Puede abrirse para servicio de válvulas y bobinas",
      c: "Es mucho más pequeño que el equivalente hermético",
      d: "Funciona sin refrigerante durante el arranque inicial"
    },
    correct: "b",
    explanation: "Semi-hermético tiene culatas y cabezales atornillados, permitiendo servicio interno (cambio de rings, válvulas, bobina del motor). Hermético está soldado/welded shut, si falla se reemplaza completo. Común en rack systems comerciales (Copeland Discus, Bitzer).",
    reference: "ASHRAE Refrigeration Handbook, Ch. 38 - Compressors"
  },
  {
    id: "c38-115",
    category: "Compresores",
    difficulty: "medium",
    question: "En un rack de supermercado con 4 compresores paralelos, ¿cuál es la ventaja operativa principal?",
    options: {
      a: "Usa menos refrigerante total en el sistema completo por diseño",
      b: "Capacidad modulante por staging que mejora la eficiencia part-load",
      c: "Reduce el costo inicial de instalación del equipo significativamente",
      d: "No necesita condensador remoto común ni coil de rechazo de calor"
    },
    correct: "b",
    explanation: "Un rack paralelo permite staging: cuando baja la carga, el controller apaga compresores. Part-load efficiency mejora dramáticamente vs un compresor grande. Típicamente 1 de los compresores es variable speed (VFD) para modulación fina.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 2 + CTA-2045/EMS"
  },
  {
    id: "c38-116",
    category: "Compresores",
    difficulty: "medium",
    question: "Un compresor de tornillo (screw) se usa típicamente en qué rango de capacidad:",
    options: {
      a: "Menos de 1 TR pequeños fractional",
      b: "De 1 a 5 TR aplicaciones ligeras",
      c: "De 50 a 1500 TR industria grande",
      d: "Solo para A/C residencial split"
    },
    correct: "c",
    explanation: "Los screw compressors dominan en refrigeración industrial grande: cold storage, plants de amoniaco, chillers de proceso. Son eficientes a alta capacidad, permiten slide valve para modulación de 10-100%, y toleran líquido mejor que reciprocantes.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 38 - Screw Compressors"
  },
  {
    id: "c38-117",
    category: "Compresores",
    difficulty: "hard",
    question: "Al arrancar un compresor semi-hermético después de servicio, ¿qué procedimiento protege contra slugging de aceite/refrigerante líquido?",
    options: {
      a: "Arrancar con pressure switches bypasseados por el técnico de campo",
      b: "Energizar crankcase heater 8 a 24h antes y hacer pump-down previo",
      c: "Agregar aceite extra POE tipo 3MAF hasta media mirilla del cárter",
      d: "Arrancar en vacío profundo tras barrido con nitrógeno presurizado"
    },
    correct: "b",
    explanation: "El crankcase heater mantiene el aceite caliente para que el refrigerante migrado se evapore antes del arranque. Sin esto, el líquido/espuma del cárter entra a las válvulas y las rompe en el primer stroke. Verificar también suction/discharge service valves abiertas.",
    reference: "Copeland Application Engineering Bulletin AE-1105"
  },
  {
    id: "c38-118",
    category: "Defrost Systems",
    difficulty: "easy",
    question: "Un walk-in cooler arriba de 35°F box temp típicamente no necesita defrost activo porque:",
    options: {
      a: "El evaporador nunca acumula escarcha visible por diseño",
      b: "Supera 32°F durante el off-cycle y derrite el hielo natural",
      c: "Usa hot gas defrost constante durante operación continua",
      d: "No tiene evaporador sino un chiller de placas solamente"
    },
    correct: "b",
    explanation: "En coolers >35°F, con el compresor apagado y fans corriendo, el coil sube arriba de 32°F y la escarcha derrite (off-cycle o air defrost). Esto NO sirve en freezers, que requieren electric o hot gas defrost porque el coil nunca alcanza 32°F en operación.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 - Defrost"
  },
  {
    id: "c38-119",
    category: "Defrost Systems",
    difficulty: "medium",
    question: "En defrost eléctrico de un walk-in freezer, ¿qué termina el ciclo primero típicamente: tiempo o temperatura?",
    options: {
      a: "Solo tiempo del timer fijo en cada ciclo",
      b: "Timer inicia y clixon termina a 55 a 60°F",
      c: "Solo presión de succión en el manifold",
      d: "Solo humedad relativa del aire en el box"
    },
    correct: "b",
    explanation: "Best practice: timer inicia el defrost, pero un termostato de terminación (defrost klixon en el coil) corta cuando sube a ~55-60°F, indicando que el hielo ya derritió. El tiempo es fail-safe backup (fail-safe terminate ~30-45 min). Así se evita sobrecalentar box.",
    reference: "Paragon/Grasslin defrost timer manuals + ASHRAE"
  },
  {
    id: "c38-120",
    category: "Defrost Systems",
    difficulty: "hard",
    question: "En hot gas defrost en un rack de supermercado, ¿cómo se dirige el gas caliente al evaporador a defrost?",
    options: {
      a: "Solo por la línea de succión revertiendo flujo normal",
      b: "Solenoide 3-vías en descarga manda hot gas al caso en defrost",
      c: "Se apaga todo el rack de compresores para permitir el defrost",
      d: "Con un calentador externo de tipo cinturón eléctrico en el coil"
    },
    correct: "b",
    explanation: "Hot gas defrost reversa parcialmente el flujo: gas de descarga entra al evaporador del caso en defrost (antes el lado de líquido) donde condensa, derritiendo hielo. El condensado sale por una check valve de defrost. Es más rápido y eficiente que electric pero requiere más plomería/controles.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15 - Supermarket Systems"
  },
  {
    id: "c38-121",
    category: "Defrost Systems",
    difficulty: "medium",
    question: "Un sistema con demand defrost (vs time-initiated) usa qué criterio para iniciar el ciclo:",
    options: {
      a: "Solo cada 6 horas con un intervalo fijo programado",
      b: "Delta-P o delta-T del aire que indica obstrucción real",
      c: "Presión de descarga del compresor en cada fin de ciclo",
      d: "Consumo eléctrico del compresor medido por transformador"
    },
    correct: "b",
    explanation: "Demand defrost mide la obstrucción real del coil (differential pressure o temperature split air-to-refrigerant) y solo defrosteas cuando hay suficiente escarcha. Ahorra energía 15-30% vs timed defrost que a veces defrostea sin necesidad.",
    reference: "Title 24 Part 6 + ASHRAE 90.1 Commercial Refrigeration"
  },
  {
    id: "c38-122",
    category: "EPA 608 Comercial",
    difficulty: "easy",
    question: "¿Qué certificación EPA 608 se requiere para trabajar en sistemas de alta presión arriba de 5 lb de carga (la mayoría comercial)?",
    options: {
      a: "Solamente Tipo I small",
      b: "Tipo II o Universal",
      c: "Solo Universal full set",
      d: "Ninguna certificación"
    },
    correct: "b",
    explanation: "EPA 608 Tipo II cubre equipos de alta presión (>5 lb) que es la mayoría de refrigeración comercial (walk-ins, rack systems, reach-ins). Universal cubre I+II+III. Tipo III es solo para low-pressure chillers (p.ej. R-123).",
    reference: "40 CFR §82.161"
  },
  {
    id: "c38-123",
    category: "EPA 608 Comercial",
    difficulty: "medium",
    question: "Según 40 CFR §82.157, un sistema comercial (>50 lb) con leak rate ¿arriba de qué porcentaje anual requiere reparación obligatoria?",
    options: {
      a: "5% anual en comercial ligero",
      b: "10% anual para comercial típico",
      c: "20% anual para todos los casos",
      d: "35% anual solo industrial PSM"
    },
    correct: "b",
    explanation: "Trigger rates para leak repair (modificados por la regla de 2016): 20% comercial, 30% industrial process, 10% comfort cooling. Refrigeración comercial (rack de super, walk-in grande) = 20%. Al excederse, se requiere reparar en 30 días o retirar equipo.",
    reference: "40 CFR §82.157 - Leak Repair Requirements"
  },
  {
    id: "c38-124",
    category: "EPA 608 Comercial",
    difficulty: "medium",
    question: "Al evacuar un sistema comercial de alta presión >200 lb antes de apertura mayor, ¿qué vacío final requiere EPA 608?",
    options: {
      a: "0 inHg vacío en presión atmosférica local",
      b: "15 inHg vacío con bomba de simple etapa",
      c: "10 mm Hg absoluto para equipo más de 200 lb",
      d: "29.92 inHg sin importar tamaño del sistema"
    },
    correct: "c",
    explanation: "Tabla de evacuación EPA 608: equipo de alta presión >200 lb debe llegar a 10 mm Hg absoluto (≈29.5 inHg). Menos de 200 lb = 4 inHg vacío. Para refrigerantes de muy alta presión (R-410A, R-744) la tabla tiene requerimientos específicos.",
    reference: "40 CFR §82.157 Appendix B - Evacuation Requirements"
  },
  {
    id: "c38-125",
    category: "EPA 608 Comercial",
    difficulty: "hard",
    question: "Un técnico recupera refrigerante para venta o reutilización en otro equipo. ¿Qué nivel de procesamiento requiere EPA?",
    options: {
      a: "Recovery simple a tanque DOT para reventa",
      b: "Reclaim a AHRI 700 en un centro certificado",
      c: "Solo filtrado con drier y sight glass nuevo",
      d: "No aplica regulación a refrigerante recuperado"
    },
    correct: "b",
    explanation: "Recovery = sacar refrigerante. Recycle = limpiar básico (puede reusarse solo con mismo owner/site). Reclaim = procesamiento a virgin specs AHRI 700 en planta certificada, único permitido para reventa/cross-ownership. Confundir esto es violación 608.",
    reference: "40 CFR §82.152 + AHRI Standard 700"
  },
  {
    id: "c38-126",
    category: "Supermarket Rack Systems",
    difficulty: "easy",
    question: "¿Qué es una EPR valve en un rack de supermercado?",
    options: {
      a: "Evaporator Pressure Regulator que mantiene SST mínimo en cada caso individual",
      b: "Electronic Pressure Reducer controla la alta presión del gas cooler rack",
      c: "Emergency Power Relay de respaldo que energiza los solenoides del sistema",
      d: "Expansion Pressure Reset modula la presión aguas arriba del TXV balanceado"
    },
    correct: "a",
    explanation: "EPR valves (p.ej. Sporlan ORIT, Parker A9) se instalan en la succión de cada caso. Mantienen su SST individual aunque el rack corra a presión más baja para el caso más frío. Por ejemplo, un meat case a 28°F SST mientras el rack corre a 15°F para otro caso.",
    reference: "Sporlan Bulletin 90-10 + ASHRAE Refrigeration Ch. 15"
  },
  {
    id: "c38-127",
    category: "Supermarket Rack Systems",
    difficulty: "medium",
    question: "En un rack con floating suction pressure, ¿qué logra subir la presión de succión cuando la carga es baja?",
    options: {
      a: "Aumenta el consumo eléctrico del compresor",
      b: "Mejora COP al reducir el pressure ratio real",
      c: "Daña el compresor por golpe de líquido súbito",
      d: "Es ilegal bajo el código Title 24 de California"
    },
    correct: "b",
    explanation: "Floating suction: el controller sube el setpoint de succión cuando los casos no demandan máxima capacidad (p.ej. de noche). Menos pressure ratio = menos consumo. Puede ahorrar 5-15% de energía. Requiere EPR en cada caso y EMS avanzado.",
    reference: "ASHRAE 90.1 + Title 24 Part 6 Commercial Refrigeration"
  },
  {
    id: "c38-128",
    category: "Supermarket Rack Systems",
    difficulty: "hard",
    question: "Un rack low-temp (LT) y uno medium-temp (MT) comparten el mismo condensador remoto. Observas que el LT tiene high discharge. Posible causa relacionada al MT:",
    options: {
      a: "El MT jamás puede afectar al LT porque son circuitos independientes",
      b: "Si el MT tiene head pressure alto, el condensador común eleva al LT",
      c: "Solo el cableado eléctrico compartido entre racks causa esa condición",
      d: "El receiver del LT falla automáticamente cerrando la línea de líquido"
    },
    correct: "b",
    explanation: "Cuando racks comparten condensador (split condenser circuits en mismo coil), problemas de condensación elevan SDT para ambos. Revisa: fans funcionando, coil limpio, cargas correctas, floating head pressure setpoints, y que el receiver no esté sobre-lleno. Aislar por manifold gauges en cada rack.",
    reference: "Hussmann/Hill Phoenix Rack System Application Guide"
  },
  {
    id: "c38-129",
    category: "Troubleshooting Comercial",
    difficulty: "easy",
    question: "Un evaporador en un walk-in freezer tiene escarcha en la mitad superior pero no en la inferior. Causa más probable:",
    options: {
      a: "Exceso de refrigerante en el evaporador del walk-in",
      b: "Evaporador starved por TXV o filter drier tapado ΔP",
      c: "Fan motor demasiado grande para la carga del coil",
      d: "Normal cuando el compresor termina el pump-down cycle"
    },
    correct: "b",
    explanation: "Escarcha parcial (solo en entrada del coil) indica starvation: no llega suficiente refrigerante líquido para mojar todo el coil. Checar subcooling, filter drier ΔP, TXV superheat, carga, y flash gas en sight glass. Superheat alto = starved.",
    reference: "Sporlan Bulletin 10-9 TXV Troubleshooting"
  },
  {
    id: "c38-130",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "Un compresor comercial tiene liquid slugging audible (knocking) al arrancar. ¿Primera acción correctiva?",
    options: {
      a: "Cargar más refrigerante hasta llenar el receiver alto",
      b: "Verificar crankcase heater y energizar 12-24h previo al arranque",
      c: "Cambiar el compresor inmediatamente sin diagnóstico de causa raíz",
      d: "Subir el superheat a 30°F ajustando el TXV con la carga normal"
    },
    correct: "b",
    explanation: "Slugging al arranque = refrigerante migró al cárter durante off-cycle (más frío que el evaporador). El crankcase heater evita esto. Si el heater está quemado o sin energía, el refrigerante se mezcla con aceite y slugea al arrancar. Instalar pump-down cycle también ayuda.",
    reference: "Copeland AE-1105 + Bitzer Service Manual"
  },
  {
    id: "c38-131",
    category: "Troubleshooting Comercial",
    difficulty: "hard",
    question: "Un caso de carne (meat case) tiene product temperature 42°F pero discharge air 28°F. El producto debería estar a 34°F. Causa más probable:",
    options: {
      a: "Exceso de capacidad de refrigeración en el caso",
      b: "Air curtain pobre o return bloqueado por overstocking",
      c: "TXV congelado con hielo en el bulbo del sensor remoto",
      d: "Compresor grande que sobrecarga el condensador común"
    },
    correct: "b",
    explanation: "Discharge air frío pero producto caliente = problema de distribución, no de capacidad. Verifica: loaded below load-line, return grilles no bloqueados, honeycomb/air curtain intacto, fans operando, y que no haya producto caliente recién metido. Merchandisers requieren load-line discipline.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15 + NSF 7"
  },
  {
    id: "c38-132",
    category: "Troubleshooting Comercial",
    difficulty: "medium",
    question: "Un flooded evaporator (con accumulator grande) tiene baja capacidad. Observas sight glass de succión con aceite espumoso denso. ¿Problema probable?",
    options: {
      a: "Falta aceite en el cárter del compresor reciprocante",
      b: "Exceso de aceite acumulado que reduce transferencia en coil",
      c: "Refrigerante incorrecto cargado tras la última fuga reparada",
      d: "Válvula de servicio cerrada limitando el flujo de líquido total"
    },
    correct: "b",
    explanation: "Flooded evaporators son trampas de aceite. Si se sobrecarga aceite o el oil return (bleed line/oil still) no funciona, el aceite se queda en el coil y recubre las paredes, destruyendo U-value. Medir nivel en accumulator y remover exceso. Verificar oil separator si existe.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 1 - Oil Management"
  },
  {
    id: "c38-133",
    category: "Troubleshooting Comercial",
    difficulty: "easy",
    question: "¿Qué problema sugiere un sight glass de líquido con burbujas continuas a carga estable?",
    options: {
      a: "Normal en operación steady-state con full load",
      b: "Flash gas por undercharge o filter drier tapado",
      c: "Exceso de aceite POE en la línea de líquido alta",
      d: "Contaminación por aire no condensable en el receiver"
    },
    correct: "b",
    explanation: "Burbujas continuas en sight glass a steady-state = flash gas. Causas: undercharge (falta refrigerante), restricción aguas arriba (filter-drier sucio), o pérdida de subcooling (ambient alto, coil de condensador sucio). Confirmar con subcooling medido en la línea de líquido.",
    reference: "Sporlan Catalog 200 + ASHRAE"
  },
  {
    id: "c38-134",
    category: "Ice Machines",
    difficulty: "easy",
    question: "¿Qué tipo de máquina de hielo produce cubos cristalinos y transparentes?",
    options: {
      a: "Flake ice tipo escama fina molida rápido",
      b: "Cube ice spray-over o cell por capas de agua",
      c: "Nugget ice molido opaco tipo Sonic food",
      d: "Dry ice en pastilla de CO2 sólido directo"
    },
    correct: "b",
    explanation: "Cube ice se forma por capas sucesivas de agua sobre un evaporador refrigerado, lo cual expulsa impurezas y deja hielo claro/lento en derretir. Flake y nugget se forman por congelación rápida + raspado, son opacos y derriten más rápido pero son fáciles de masticar/transportar.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 43 - Ice Manufacture"
  },
  {
    id: "c38-135",
    category: "Ice Machines",
    difficulty: "medium",
    question: "Una máquina de hielo tiene producción reducida y el agua huele/sabe mal. ¿Primera acción de mantenimiento?",
    options: {
      a: "Cambiar el compresor del ice machine inmediatamente",
      b: "Reemplazar filtro agua y sanitizar el evaporador con descaler",
      c: "Subir la carga de refrigerante para mejorar la producción diaria",
      d: "Cambiar el refrigerante a un HFO de menor GWP para mejor sabor"
    },
    correct: "b",
    explanation: "Los ice machines requieren mantenimiento regular de calidad de agua: filtro de sedimento/carbón, descale (nickel-safe de-scaler) y sanitize. Mineral buildup en evaporador reduce heat transfer y contamina el hielo. NSF requiere protocolo de limpieza documentado.",
    reference: "Manitowoc/Hoshizaki Service Manual + NSF/ANSI 12"
  },
  {
    id: "c38-136",
    category: "Ice Machines",
    difficulty: "hard",
    question: "Al dimensionar una máquina de hielo para un restaurante, ¿qué factor de derate típico se aplica por ambient y water temp?",
    options: {
      a: "Ninguno, usar el rating nominal AHRI como valor final",
      b: "Capacity cae 25-40% entre AHRI y peor caso en cocina",
      c: "Solo 5% de derate fijo sin importar la temperatura real",
      d: "Se duplica en verano por la alta demanda del restaurante"
    },
    correct: "b",
    explanation: "Ratings AHRI se dan a 70°F/50°F. Un kitchen típico a 90°F ambient + 80°F water puede reducir capacidad 30-40%. Siempre consultar la performance curve del fabricante al dimensionar. Regla general: sobredimensionar 20% sobre el peak demand.",
    reference: "AHRI 810 Ice Machine Standard + ASHRAE Ch. 43"
  },
  {
    id: "c38-137",
    category: "Heat Reclaim",
    difficulty: "medium",
    question: "En un supermercado, el heat reclaim típicamente se usa para:",
    options: {
      a: "Calentar el refrigerante en la línea de succión baja",
      b: "Calentar agua sanitaria o aire usando el calor de descarga",
      c: "Aumentar la presión del compresor para mejorar el COP total",
      d: "Derretir escarcha en el condensador remoto durante invierno"
    },
    correct: "b",
    explanation: "Heat reclaim intercambia calor del gas de descarga (a 150-220°F) con agua o aire antes de condensar. Recupera energía que se perdería al ambient y calienta el edificio o produce DHW gratis. Requiere coil de heat reclaim, 3-way valve, y controles para no comprometer condensación.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 15 + Title 24 Part 6"
  },
  {
    id: "c38-138",
    category: "Heat Reclaim",
    difficulty: "hard",
    question: "Al instalar heat reclaim en un rack, ¿qué precaución es crítica?",
    options: {
      a: "Ninguna, la instalación es plug-and-play sin ajustes",
      b: "Mantener head pressure sobre el mínimo SCT al TXV",
      c: "Solo agregar válvulas manuales de servicio en el coil",
      d: "No importa el subcooling porque la 3-vía autorregula"
    },
    correct: "b",
    explanation: "Cuando el heat reclaim coil absorbe demasiado calor, el condensador ve menos carga y la presión cae. Si baja del mínimo operativo, TXV starvea. Se instala head pressure control (fan cycling o VFD) con setpoint para mantener SCT mínimo aun con full reclaim activo.",
    reference: "Sporlan ORD/ORI + ASHRAE Refrigeration Ch. 15"
  },
  {
    id: "c38-139",
    category: "P-H Diagrams",
    difficulty: "medium",
    question: "En un diagrama presión-entalpía (P-h), ¿qué representa la línea horizontal en el tope del ciclo básico?",
    options: {
      a: "Compresión isentrópica en el lado alto",
      b: "Rechazo de calor isobárico en condensador",
      c: "Expansión isentálpica en el metering device",
      d: "Evaporación isobárica del refrigerante frío"
    },
    correct: "b",
    explanation: "En P-h, el condensador es la línea horizontal superior (presión alta constante), donde el refrigerante desuperheaters, condensa (cruza el dome) y subcooling (sale del dome al líquido). La entalpía cae porque rechaza calor al ambiente.",
    reference: "ASHRAE Fundamentals Handbook, Ch. 1"
  },
  {
    id: "c38-140",
    category: "P-H Diagrams",
    difficulty: "hard",
    question: "En un P-h diagram de R-448A, si el punto de salida del evaporador está dentro del dome (wet), ¿qué indica para el sistema real?",
    options: {
      a: "Operación correcta con superheat nominal de 10°F",
      b: "Evaporador inundado con líquido al compresor slugging",
      c: "Falta refrigerante y hay flash gas aguas arriba del TXV",
      d: "Compresor muy grande para la carga térmica del evaporador"
    },
    correct: "b",
    explanation: "Salida del evaporador debe estar a la derecha del dome (vapor sobrecalentado). Dentro del dome = mezcla líquido/vapor = flooded = superheat cero = slugging inminente. Causa: TXV mal ajustado abierto, MOP wrong, overcharge, o bulb del TXV mal ubicada/mal insulada.",
    reference: "Sporlan Bulletin 10-9 + ASHRAE Ch. 2"
  },
  {
    id: "c38-141",
    category: "Sizing Comercial",
    difficulty: "easy",
    question: "Para línea de succión de cobre en R-448A, ¿qué rango de velocidad se recomienda típicamente para garantizar oil return?",
    options: {
      a: "100 ft/min máximo en cualquier sección",
      b: "500 fpm mínimo vertical y 700-4000 horizontal",
      c: "10,000 ft/min constantes en todo el tendido",
      d: "No importa la velocidad en ningún tramo de cobre"
    },
    correct: "b",
    explanation: "Oil return requiere velocity mínima: ~500-700 fpm en vertical risers (para arrastrar aceite arriba contra la gravedad), hasta 4000 fpm horizontal. Exceder 4000 fpm genera ruido y pressure drop excesivo. Dimensiones dependen de load, SST, y longitud.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 1 - Pipe Sizing"
  },
  {
    id: "c38-142",
    category: "Sizing Comercial",
    difficulty: "medium",
    question: "Al dimensionar una línea de líquido larga vertical hacia abajo (20 ft drop), ¿qué factor adicional debe considerarse?",
    options: {
      a: "Ninguno porque la línea corta es despreciable",
      b: "Head estático suma subcooling si baja o flash si sube",
      c: "El cobre se oxida internamente por la velocidad baja",
      d: "El refrigerante se congela por el delta-T hidrostático"
    },
    correct: "b",
    explanation: "Líquido vertical: bajando, gana presión por columna hidrostática (~0.5 psi/ft para R-448A) = más subcooling efectivo. Subiendo, pierde presión; si excede subcooling, forma flash gas antes del TXV. Siempre verificar en design largo con elevation change.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 1"
  },
  {
    id: "c38-143",
    category: "Sizing Comercial",
    difficulty: "hard",
    question: "Para un walk-in cooler 10×12×10 ft, temp 35°F, uso moderado, infiltración típica, ¿cuál es un tonelaje de arranque razonable (regla rápida)?",
    options: {
      a: "0.2 TR con 15 BTU/h por cu-ft",
      b: "1 a 1.5 TR con 50-80 BTU/h cu-ft",
      c: "5 TR con 250 BTU/h por cu-ft alto",
      d: "10 TR con 500 BTU/h por cu-ft full"
    },
    correct: "b",
    explanation: "Regla rápida: volumen × 50-80 BTU/h por cu-ft para cooler moderado. 10×12×10 = 1200 cu-ft × 65 avg = ~78,000 BTU/h ≈ 6.5 kBTU/h... espera, 78k/12k ≈ 1.3 TR. Verificar siempre con load calc real (paredes, producto, infiltración, lights, motors). No es sustituto de heat load software.",
    reference: "ASHRAE Refrigeration Handbook, Ch. 24 + Heatcraft Engineering Manual"
  },
  {
    id: "c38-144",
    category: "Sizing Comercial",
    difficulty: "medium",
    question: "Título 24 Part 6 requiere en walk-ins nuevos qué eficiencia mínima para condensing units:",
    options: {
      a: "Ninguna exigencia federal sobre eficiencia de equipo",
      b: "AWEF mínimo por tipo cooler/freezer y capacidad nominal",
      c: "Solo SEER 13 nominal igual que el split residencial",
      d: "COP 10 mínimo medido en condiciones AHRI de prueba"
    },
    correct: "b",
    explanation: "Title 24 + DOE rules imponen AWEF mínimo (varía por cooler/freezer y capacidad). Equipo reciprocante más antiguo puede no cumplir; scroll con floating head, ECM fans, y controles de eficiencia son necesarios. Las unidades nuevas muestran AWEF en nameplate.",
    reference: "Title 24 Part 6 + 10 CFR 431.306"
  },
  {
    id: "c38-145",
    category: "Ciclo Comercial",
    difficulty: "easy",
    question: "En refrigeración comercial, el término 'pump-down cycle' se refiere a:",
    options: {
      a: "Desconectar el sistema por completo del servicio",
      b: "Solenoide de líquido cierra y compresor bombea al receiver",
      c: "Limpiar el aceite sucio del cárter con desengrasante",
      d: "Cargar refrigerante virgen tras un servicio de reemplazo"
    },
    correct: "b",
    explanation: "Pump-down: cuando termostato satisface, cierra solenoid en línea de líquido. El compresor sigue hasta que low-pressure switch corta, dejando el low-side con poco refrigerante. Previene migración al cárter en off-cycle. Estándar en equipos comerciales.",
    reference: "Copeland AE-1105 + Sporlan Bulletin 30-10"
  },
  {
    id: "c38-146",
    category: "Compresores",
    difficulty: "medium",
    question: "Un compresor reciprocante semi-hermético muestra discharge temp 240°F con SCT 110°F y SST 20°F. ¿Diagnóstico?",
    options: {
      a: "Normal para R-448A a esas condiciones operativas",
      b: "Discharge elevada por superheat alto o válvulas rotas",
      c: "Compresor nuevo corriendo dentro del break-in inicial",
      d: "Refrigerante en exceso cargado sobre el sight glass lleno"
    },
    correct: "b",
    explanation: "Para R-448A a SST 20°F y SCT 110°F, discharge típico ~180-210°F. 240°F indica problema: revisar superheat (alto sobrecalienta), return gas cooling al motor (en semi-hermético el suction enfría bobinas), válvulas de descarga fugando (recirculation interna), o incorrect refrigerant.",
    reference: "Bitzer/Copeland Application Manual + ASHRAE"
  },
  {
    id: "c38-147",
    category: "Defrost Systems",
    difficulty: "easy",
    question: "Durante defrost eléctrico, ¿deben los fans del evaporador correr o pararse?",
    options: {
      a: "Correr siempre al 100% durante defrost eléctrico",
      b: "Parar con fan delay y reinician tras termostato",
      c: "Correr al doble de velocidad para ventilar el coil",
      d: "Correr a media velocidad en modo de baja frecuencia"
    },
    correct: "b",
    explanation: "Durante defrost, los fans se apagan (defrost termination + fan delay control). Correrían calentando el box. Tras el defrost, se espera que el coil baje a <25°F antes de reiniciar fans (fan delay), evitando vapor caliente al box. El timer incluye esta lógica.",
    reference: "Paragon defrost timer + Heatcraft Engineering"
  },
  {
    id: "c38-148",
    category: "Supermarket Rack Systems",
    difficulty: "medium",
    question: "En un rack con oil separator a la salida del manifold de descarga, ¿qué hace la línea de retorno de aceite?",
    options: {
      a: "Va directamente al condensador remoto compartido del rack",
      b: "Regresa al oil reservoir común que alimenta cada compresor",
      c: "Va a drenaje externo tipo sumidero de mantenimiento normal",
      d: "Alimenta el TXV de cada caso como lubricante del mecanismo"
    },
    correct: "b",
    explanation: "En racks multi-compresor, un oil separator captura aceite del discharge, manda al oil reservoir común. Desde ahí, cada compresor tiene un oil level regulator (Sporlan OLR, AC&R) que mantiene nivel en el cárter. Esto iguala aceite entre compresores y previene starvation.",
    reference: "Sporlan OLR Bulletin + Hussmann Rack Manual"
  },
  {
    id: "c38-149",
    category: "Refrigerantes Comerciales",
    difficulty: "medium",
    question: "Bajo el AIM Act de 2020, ¿qué acción regulatoria afecta al R-404A y R-507A en aplicaciones comerciales nuevas?",
    options: {
      a: "Sin cambios regulatorios bajo la ley federal vigente 2020",
      b: "Phase-down progresivo prohibiendo equipo nuevo con alto GWP",
      c: "Son ahora ilegales de fabricar y vender en cualquier mercado",
      d: "Solo afecta residencial no comercial bajo el mandato SNAP EPA"
    },
    correct: "b",
    explanation: "El AIM Act autoriza a EPA un phase-down 85% de HFCs para 2036. Reglas Technology Transitions prohíben equipo nuevo con HFCs alto GWP por sector/fecha (supermercados, walk-ins, vending, etc.). Servicio a equipos existentes sigue permitido pero con oferta limitada. Transitar a lower-GWP es estrategia clave.",
    reference: "AIM Act 2020 + EPA 40 CFR 84 Technology Transitions"
  },
  {
    id: "c38-150",
    category: "Troubleshooting Comercial",
    difficulty: "hard",
    question: "Un rack CO2 transcritical muestra alarma de alta presión de gas cooler (1600 psig) con ambient 100°F. El high-pressure valve (HPV) no está modulando. ¿Diagnóstico primario?",
    options: {
      a: "Agregar CO2 al receiver hasta llenar sight glass",
      b: "HPV atorada o mal programada no modula la presión",
      c: "Cambiar todo el rack de compresores por uno nuevo",
      d: "Apagar los fans del gas cooler para aislar la falla"
    },
    correct: "b",
    explanation: "En transcritical CO2 a ambient alto, la HPV controla la presión de gas cooler para optimizar COP. Si falla cerrada, presión se dispara a relief (~1740 psig). Checar: output del controller, stepper motor/coil, alimentación, feedback del transducer, y setpoint del optimal pressure curve. Danfoss EKE/CoreSense docs.",
    reference: "Danfoss CO2 Transcritical Manual + ASHRAE Ch. 48"
  }
];
