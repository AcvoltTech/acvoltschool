// C-20 HVAC — CSLB Study Questions (150)
// Generated from public CSLB content outline. NOT actual exam questions.
window.CONTRACTOR_QUESTIONS_C20 = [
  // ============================================================
  // CÁLCULO DE CARGA (MANUAL J) — ~15% (23 preguntas)
  // ============================================================
  {
    id: "c20-001",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "¿Qué procedimiento residencial reconoce el CSLB y la California Energy Commission para calcular la carga de enfriamiento/calefacción?",
    options: {
      a: "ACCA Manual J 8th edition (load calculation)",
      b: "ASHRAE Handbook of Fundamentals Ch. 17",
      c: "SMACNA HVAC Systems Duct Design Manual",
      d: "NFPA 90B Warm Air Heating Standard"
    },
    correct: "a",
    explanation: "Manual J 8th edition de ACCA es el estándar reconocido por Title 24 y por el CSLB para heat load residencial. ASHRAE se usa más en comercial, y SMACNA es para ductos.",
    reference: "ACCA Manual J 8th ed.; Title 24 §150.0(h)"
  },
  {
    id: "c20-002",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "En Manual J, ¿qué representa el CLTD cuando se calcula ganancia de calor por techo o pared?",
    options: {
      a: "Cooling Load Temperature Difference",
      b: "Calculated Latent Thermal Demand",
      c: "Ceiling Load Transfer Differential",
      d: "Climate Load Thermal Deviation"
    },
    correct: "a",
    explanation: "CLTD (Cooling Load Temperature Difference) es un delta T efectivo que toma en cuenta la masa térmica y el retraso solar. Se multiplica por U-value y área para sacar BTU/h.",
    reference: "ACCA Manual J 8th ed., Appendix A"
  },
  {
    id: "c20-003",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Una pared de 200 ft² con U-value de 0.08 BTU/h·ft²·°F y CLTD de 20°F, ¿cuánta ganancia de calor sensible aporta?",
    options: {
      a: "320 BTU/h (Q = U × A × CLTD)",
      b: "160 BTU/h (usando la mitad del área)",
      c: "800 BTU/h (duplicando el CLTD)",
      d: "1,600 BTU/h (sumando latente estimado)"
    },
    correct: "a",
    explanation: "Q = U × A × CLTD = 0.08 × 200 × 20 = 320 BTU/h. Es la fórmula básica de ganancia por conducción en Manual J.",
    reference: "ACCA Manual J 8th ed., §A2"
  },
  {
    id: "c20-004",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Para una casa en Fresno CA (zona climática 13), ¿qué design temperature de verano (1% outdoor) usa Manual J aproximadamente?",
    options: {
      a: "101°F DB / 70°F WB (CZ13 diseño)",
      b: "85°F DB / 65°F WB (zona costera)",
      c: "115°F DB / 78°F WB (desértico)",
      d: "95°F DB / 75°F WB (valle central)"
    },
    correct: "a",
    explanation: "Fresno CA tiene un outdoor design de ~101°F DB y 70°F WB al 1%. Usar temperaturas infladas resulta en equipo sobredimensionado y mala dehumidification.",
    reference: "ACCA Manual J 8th ed., Tabla 1A; CEC CZ13"
  },
  {
    id: "c20-005",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "La carga sensible de una casa es 24,000 BTU/h y la latente 6,000 BTU/h. ¿Cuál es el Sensible Heat Ratio (SHR)?",
    options: {
      a: "0.80 (SHR típico zona seca)",
      b: "0.75 (SHR clima mixto)",
      c: "0.25 (latente sobre total)",
      d: "1.20 (suma invertida BTU)"
    },
    correct: "a",
    explanation: "SHR = Qsensible / Qtotal = 24,000 / (24,000 + 6,000) = 24,000 / 30,000 = 0.80. Un SHR de 0.80 es típico en clima seco de California.",
    reference: "ACCA Manual J 8th ed., §3; ASHRAE Handbook Fundamentals"
  },
  {
    id: "c20-006",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "hard",
    question: "Casa de 2,000 ft² en zona 12, con carga total de 28,000 BTU/h cooling. Si el contratista instala 4 tons (48,000 BTU/h), ¿qué problema espera el inspector Title 24?",
    options: {
      a: "Oversizing causa ciclos cortos y mal control de humedad",
      b: "Undersizing — no enfría en día pico de diseño",
      c: "Aumenta el SEER2 nominal de placa del sistema",
      d: "Mejora la remoción latente por mayor tiempo de coil"
    },
    correct: "a",
    explanation: "Oversizing por encima del 115% de Manual J es violación de Title 24 y provoca short cycling, mal control de humedad y desgaste del compressor. La regla es sizing lo más cercano a la carga real.",
    reference: "Title 24 §150.0(h)3; ACCA Manual S"
  },
  {
    id: "c20-007",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "¿Qué documento ACCA se usa para seleccionar el equipo después de terminar Manual J?",
    options: {
      a: "Manual S (Equipment Selection)",
      b: "Manual D (Duct Design Residential)",
      c: "Manual T (Air Distribution Basics)",
      d: "Manual RS (Residential System)"
    },
    correct: "a",
    explanation: "Manual S convierte los BTU/h de Manual J en una selección real de equipo usando performance data del fabricante a las condiciones de diseño locales.",
    reference: "ACCA Manual S"
  },
  {
    id: "c20-008",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Una ventana de 20 ft² sur sin sombra tiene HTM (heat transfer multiplier) de 45 BTU/h·ft². ¿Cuánto aporta a la carga de cooling?",
    options: {
      a: "900 BTU/h (Q = HTM × área)",
      b: "225 BTU/h (usando 25% del HTM)",
      c: "65 BTU/h (solo conducción U-val)",
      d: "2,250 BTU/h (HTM con factor solar)"
    },
    correct: "a",
    explanation: "Q = HTM × A = 45 × 20 = 900 BTU/h. El HTM ya combina conducción y solar gain para esa orientación y glazing.",
    reference: "ACCA Manual J 8th ed., Worksheet F"
  },
  {
    id: "c20-009",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Para infiltración residencial en Manual J, ¿qué método numérico usa la 8th edition?",
    options: {
      a: "AIM-2 (Alberta Infiltration Model revisado)",
      b: "ACH natural promedio × volumen del espacio",
      c: "Blower door result como única entrada",
      d: "Tabla fija de 0.5 ACH para todas las casas"
    },
    correct: "a",
    explanation: "Manual J 8th ed. usa el modelo AIM-2 que considera altura, exposición al viento, y tightness class. Reemplazó el viejo método de ACH promedio.",
    reference: "ACCA Manual J 8th ed., §5"
  },
  {
    id: "c20-010",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "La carga latente por persona en una casa residencial según Manual J es aproximadamente:",
    options: {
      a: "200 BTU/h latentes por ocupante sedentario",
      b: "600 BTU/h latentes por ocupante activo",
      c: "50 BTU/h latentes (ocupante dormido)",
      d: "1,200 BTU/h latentes (actividad pesada)"
    },
    correct: "a",
    explanation: "Manual J asigna 230 BTU/h sensibles y 200 BTU/h latentes por ocupante sedentario. En escenarios de actividad ligera se ajusta hacia arriba.",
    reference: "ACCA Manual J 8th ed., Tabla 4A"
  },
  {
    id: "c20-011",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "¿Qué factor NO se considera en Manual J residencial?",
    options: {
      a: "Color del carro estacionado en la cochera",
      b: "Orientación de ventanas (N/S/E/W)",
      c: "U-value de paredes exteriores",
      d: "Infiltración con método AIM-2"
    },
    correct: "a",
    explanation: "Manual J considera envolvente, fenestration, infiltración, ocupantes y cargas internas. El contenido de la cochera no es parte del cálculo de la envelope térmica.",
    reference: "ACCA Manual J 8th ed., §1"
  },
  {
    id: "c20-012",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "hard",
    question: "Una casa en zona 10 tiene carga de heating de 36,000 BTU/h a 32°F outdoor. Si el balance point deseado con bomba de calor es 35°F, ¿qué tamaño mínimo de heat pump (en tons nominal) se requiere usando capacidad aprox de 85% a 35°F?",
    options: {
      a: "Aproximadamente 3.5 tons (~42,000 BTU/h)",
      b: "Aproximadamente 2.0 tons (~24,000 BTU/h)",
      c: "Exactamente 3.0 tons (~36,000 BTU/h)",
      d: "Aproximadamente 5.0 tons (~60,000 BTU/h)"
    },
    correct: "a",
    explanation: "Si necesitas ~36,000 BTU/h en el punto de balance y el equipo entrega ~85% de su nominal a esa temp, tamaño ≈ 36,000/0.85 ≈ 42,350 BTU/h ≈ 3.5 tons. Se verifica con performance data del fabricante.",
    reference: "ACCA Manual S §3; Manual J 8th ed."
  },
  {
    id: "c20-013",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "¿Cuál es la unidad estándar de capacidad HVAC residencial en EE. UU.?",
    options: {
      a: "BTU/h (capacidad térmica)",
      b: "Watts eléctricos consumidos",
      c: "Kilocalorías por segundo",
      d: "CFM (pies cúbicos/minuto)"
    },
    correct: "a",
    explanation: "BTU/h es la unidad base. 12,000 BTU/h = 1 ton de refrigeración. CFM mide flujo de aire, no capacidad térmica.",
    reference: "ASHRAE Handbook Fundamentals; ARI 210/240"
  },
  {
    id: "c20-014",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Para convertir 4 tons de cooling a BTU/h:",
    options: {
      a: "48,000 BTU/h (4 × 12,000)",
      b: "36,000 BTU/h (3 tons en BTU)",
      c: "60,000 BTU/h (5 tons en BTU)",
      d: "40,000 BTU/h (4 × 10,000)"
    },
    correct: "a",
    explanation: "1 ton = 12,000 BTU/h. 4 × 12,000 = 48,000 BTU/h. Esta conversión viene de la energía para derretir 1 ton de hielo en 24 h.",
    reference: "ASHRAE Handbook Fundamentals §1"
  },
  {
    id: "c20-015",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Manual J recomienda NO usar qué método rápido para sizing residencial:",
    options: {
      a: "Rule-of-thumb de 400-600 ft² por ton nominal",
      b: "Cálculo formal room-by-room de ACCA",
      c: "Modelo AIM-2 para infiltración precisa",
      d: "Performance data por Manual S del OEM"
    },
    correct: "a",
    explanation: "Los rules-of-thumb de ft²/ton producen oversizing crónico. Title 24 exige un cálculo formal Manual J, no una regla de dedo.",
    reference: "Title 24 §150.0(h); ACCA Manual J §1"
  },
  {
    id: "c20-016",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "La carga total de una cocina añade aprox cuánto calor sensible por appliances residenciales en Manual J:",
    options: {
      a: "1,200 BTU/h default fijo por cocina",
      b: "50 BTU/h por ft² de área cocina",
      c: "12,000 BTU/h por refrigerador grande",
      d: "No se agrega ninguna carga"
    },
    correct: "a",
    explanation: "Manual J asigna 1,200 BTU/h sensibles de cocina para casa típica (appliance default). Se ajusta si hay range eléctrico grande o varios appliances.",
    reference: "ACCA Manual J 8th ed., Tabla 4B"
  },
  {
    id: "c20-017",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Un cuarto de 150 ft² con carga sensible de 3,600 BTU/h necesita cuántos CFM a ΔT de 20°F por la coil?",
    options: {
      a: "~167 CFM (usando constante 1.08)",
      b: "~100 CFM (fórmula con 1.80)",
      c: "~300 CFM (ignorando ΔT delta)",
      d: "~50 CFM (usando 4.5 constante)"
    },
    correct: "a",
    explanation: "CFM = Qsensible / (1.08 × ΔT) = 3,600 / (1.08 × 20) = 167 CFM. La constante 1.08 viene del producto de densidad × calor específico del aire estándar.",
    reference: "ACCA Manual D §2; ASHRAE Fundamentals"
  },
  {
    id: "c20-018",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "hard",
    question: "Una pared de 1,000 ft² tiene R-13 batts. U-value efectivo con framing factor 23% es aprox 0.091. Con CLTD 25°F, ¿cuál es la ganancia?",
    options: {
      a: "~2,275 BTU/h (Q = U·A·CLTD)",
      b: "~1,000 BTU/h (usando R-13 puro)",
      c: "~325 BTU/h (sin framing factor)",
      d: "~10,000 BTU/h (CLTD × factor)"
    },
    correct: "a",
    explanation: "Q = U × A × CLTD = 0.091 × 1,000 × 25 = 2,275 BTU/h. El framing factor baja el R nominal porque los studs de madera conducen más que el insulation.",
    reference: "ACCA Manual J 8th ed., Tabla 4A; ASHRAE Fundamentals"
  },
  {
    id: "c20-019",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "¿Qué es 'design temperature difference' (DTD) en heating Manual J?",
    options: {
      a: "Indoor setpoint menos outdoor 99% winter",
      b: "Diferencia entre supply y return del aire",
      c: "Outdoor máximo menos indoor setpoint",
      d: "Delta de temperatura a través del coil"
    },
    correct: "a",
    explanation: "DTD de heating = indoor design (p.ej. 70°F) − outdoor 99% (p.ej. 35°F en zona costera CA) = 35°F. Esa es la ΔT para cálculos de conducción.",
    reference: "ACCA Manual J 8th ed., §2"
  },
  {
    id: "c20-020",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Para un duct loss de 15% en attic unconditioned, Manual J agrega cuánto a la carga calculada del espacio:",
    options: {
      a: "Multiplicar carga del espacio por ~1.15",
      b: "Sumar 500 BTU/h fijos por run de ducto",
      c: "Dividir la carga del espacio entre 0.85",
      d: "Ambas A y C son equivalentes numéricamente"
    },
    correct: "d",
    explanation: "Un duct loss del 15% significa que solo 85% del aire entregado es útil, así que la carga del equipo sube. Multiplicar por 1.15 o dividir entre 0.85 da resultados muy cercanos (1.176 vs 1.15), ambos aceptados como ajuste de duct loss.",
    reference: "ACCA Manual J 8th ed., §7; Manual D §4"
  },
  {
    id: "c20-021",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "medium",
    question: "Una ventana de doble panel low-E tiene U ≈ 0.30 y SHGC ≈ 0.25. Para 30 ft² orientación oeste con 150 BTU/h·ft² solar incidente:",
    options: {
      a: "Ganancia solar ≈ 1,125 BTU/h (A·SHGC·I)",
      b: "Ganancia solar ≈ 4,500 BTU/h (sin SHGC)",
      c: "Ganancia solar ≈ 225 BTU/h (solo U·A·ΔT)",
      d: "Ganancia solar ≈ 9 BTU/h (división errada)"
    },
    correct: "a",
    explanation: "Q_solar = A × SHGC × Solar_incident = 30 × 0.25 × 150 = 1,125 BTU/h. Por eso low-E SHGC bajo reduce carga oeste tanto en Title 24.",
    reference: "ACCA Manual J 8th ed., Tabla 3D; Title 24 Part 6"
  },
  {
    id: "c20-022",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "hard",
    question: "Calculando heating: casa con 35°F DTD, envelope total UA = 400 BTU/h·°F, infiltración 0.35 ACH en 16,000 ft³. ¿Cuál es la carga total approx (despreciar ductwork)?",
    options: {
      a: "~17,500 BTU/h (conducción + infiltración)",
      b: "~14,000 BTU/h (solo conducción UA·ΔT)",
      c: "~30,000 BTU/h (infiltración mal calculada)",
      d: "~8,000 BTU/h (UA reducido 50% err)"
    },
    correct: "a",
    explanation: "Conducción = UA × ΔT = 400 × 35 = 14,000 BTU/h. Infiltración CFM = 0.35×16,000/60 = 93 CFM; Qinf = 1.08 × 93 × 35 ≈ 3,520 BTU/h. Total ≈ 17,520 BTU/h.",
    reference: "ACCA Manual J 8th ed., §4 y §5"
  },
  {
    id: "c20-023",
    category: "Cálculo de Carga (Manual J)",
    difficulty: "easy",
    question: "El propósito principal de Manual J es:",
    options: {
      a: "Calcular carga real room-by-room para sizing",
      b: "Diseñar el ductwork supply y return",
      c: "Seleccionar el tipo de refrigerante A2L",
      d: "Calcular el SEER2 nominal del equipo"
    },
    correct: "a",
    explanation: "Manual J entrega carga por cuarto y total de la casa. Luego Manual S selecciona equipo y Manual D diseña ductos — los tres forman la trilogía ACCA.",
    reference: "ACCA Manual J 8th ed., Introduction"
  },

  // ============================================================
  // CICLO DE REFRIGERACIÓN — ~15% (23 preguntas)
  // ============================================================
  {
    id: "c20-024",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "¿Cuáles son los cuatro componentes principales del ciclo de refrigeración por compresión de vapor?",
    options: {
      a: "Compressor, condenser, metering device, evaporator",
      b: "Pump, fan-coil unit, damper, duct silencer",
      c: "Motor run cap, contactor, transformer, fuse",
      d: "Burner, heat exchanger, flue pipe, draft inducer"
    },
    correct: "a",
    explanation: "El compressor eleva presión, el condenser rechaza calor, el metering device baja presión, y el evaporator absorbe calor. Todo el resto son accesorios de control.",
    reference: "ASHRAE Handbook Refrigeration; EPA 608 Core"
  },
  {
    id: "c20-025",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "En un sistema con R-410A operando con presión de succión de 118 psig y temperatura de línea de succión de 55°F, ¿cuál es el superheat?",
    options: {
      a: "15°F (55°F menos 40°F saturación)",
      b: "20°F (usando sat de 35°F R-22)",
      c: "10°F (saturación sobrestimada)",
      d: "25°F (restando 30°F de líquido)"
    },
    correct: "a",
    explanation: "A 118 psig el R-410A tiene una saturation temperature de 40°F. Superheat = 55°F − 40°F = 15°F. Este es un superheat típico para un TXV bien cargado.",
    reference: "P/T chart R-410A; ACCA Manual SH"
  },
  {
    id: "c20-026",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Sistema R-410A con presión de liquid line de 400 psig y temperatura de liquid 105°F. ¿Cuál es el subcooling?",
    options: {
      a: "15°F (120°F sat menos 105°F líq)",
      b: "10°F (usando sat 115°F erróneo)",
      c: "20°F (usando sat 125°F high-side)",
      d: "5°F (sat mal leída para R-32)"
    },
    correct: "a",
    explanation: "A 400 psig R-410A satura aproximadamente a 120°F. Subcool = 120 − 105 = 15°F. Es lo que busca un sistema TXV cargado correctamente.",
    reference: "P/T chart R-410A; manufacturer charging specs"
  },
  {
    id: "c20-027",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "Un TXV controla principalmente:",
    options: {
      a: "Superheat a la salida del evaporator",
      b: "Subcooling a la salida del condenser",
      c: "Presión de descarga del compressor",
      d: "Velocidad del blower en el air handler"
    },
    correct: "a",
    explanation: "El bulb sensor del TXV mide temperatura de suction y modula el flujo para mantener superheat estable (típicamente 8-12°F). No controla subcool directamente.",
    reference: "Sporlan TXV Bulletin 10-9; ACCA Manual SH"
  },
  {
    id: "c20-028",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Si un sistema tiene superheat bajo (3°F) y subcool alto (20°F) en un TXV system, lo más probable es:",
    options: {
      a: "Sobrecarga (overcharge) de refrigerante",
      b: "Undercharge severo de refrigerante",
      c: "TXV cerrado o bulb perdió carga",
      d: "Filter-drier tapado con restricción"
    },
    correct: "a",
    explanation: "Exceso de refrigerante inunda el condenser (sube subcool) y también baja el superheat porque llega líquido casi al final del evaporator. Recuperar y pesar la carga correcta.",
    reference: "ACCA Manual SH; EPA 608"
  },
  {
    id: "c20-029",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Un sistema con R-410A muestra low suction (95 psig) y low discharge (280 psig). El superheat es 25°F. El problema más probable:",
    options: {
      a: "Undercharge (posible leak en sistema)",
      b: "Overcharge con líquido en suction",
      c: "Compressor de mayor capacidad que coil",
      d: "Fan motor de condenser trabado OFF"
    },
    correct: "a",
    explanation: "Presiones bajas con superheat alto y subcool bajo son síntoma clásico de falta de carga. Hay que buscar leak antes de añadir refrigerante.",
    reference: "EPA 608 Type II; ACCA Manual SH"
  },
  {
    id: "c20-030",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "¿Qué refrigerante es un HFC que NO daña la capa de ozono pero tiene GWP alto?",
    options: {
      a: "R-410A (HFC, ODP=0, GWP ~2088)",
      b: "R-22 (HCFC, phase-out finalizado)",
      c: "R-11 (CFC, prohibido hace décadas)",
      d: "R-12 (CFC automotriz antiguo)"
    },
    correct: "a",
    explanation: "R-410A es HFC (ODP = 0) pero tiene GWP ~2088. Por eso AIM Act está haciendo phase-down hacia R-32 y R-454B. R-22 es HCFC (ya prohibido para nueva producción).",
    reference: "EPA 40 CFR Part 82; AIM Act"
  },
  {
    id: "c20-031",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "R-22 fue prohibido para producción e importación en EE. UU. a partir de:",
    options: {
      a: "1 de enero de 2020 (Montreal Protocol)",
      b: "1 de enero de 2010 (fase inicial HCFC)",
      c: "1 de enero de 2030 (fecha propuesta)",
      d: "1 de enero de 2015 (fase intermedia)"
    },
    correct: "a",
    explanation: "Bajo el Montreal Protocol y EPA, la producción e importación de R-22 virgen terminó el 1/1/2020. Solo se puede usar reclaimed/recovered.",
    reference: "EPA 40 CFR Part 82 Subpart A"
  },
  {
    id: "c20-032",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "Para trabajar con appliances de HVAC que contengan refrigerante, ¿qué certificación exige la EPA?",
    options: {
      a: "EPA Section 608 Technician Certification",
      b: "NATE Core Certification (ANSI acredit.)",
      c: "OSHA 10 Construction Industry Training",
      d: "HVAC Excellence Heat Pump Specialty"
    },
    correct: "a",
    explanation: "EPA 608 es obligatoria federal. Type I es appliances pequeños, Type II high-pressure (split AC), Type III low-pressure (chillers), Universal cubre todo.",
    reference: "EPA 40 CFR Part 82 Subpart F"
  },
  {
    id: "c20-033",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Antes de abrir un sistema sellado para reparación, un técnico debe:",
    options: {
      a: "Recuperar el refrigerante a niveles de vacío EPA",
      b: "Ventilar el refrigerante al exterior del edificio",
      c: "Calentarlo para evaporarlo rápidamente y purgar",
      d: "Abrirlo en un ambiente frío para baja presión"
    },
    correct: "a",
    explanation: "EPA prohíbe venting intencional desde 1992. Recovery a niveles específicos (0-10 in Hg para HP pequeño, hasta 15 in Hg para grande) es obligatorio.",
    reference: "EPA 40 CFR §82.156; Clean Air Act §608"
  },
  {
    id: "c20-034",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Un sistema R-410A de 3 tons debe tener aproximadamente qué charge por línea de 25 ft (3/8 liquid line) según el manufacturer típico:",
    options: {
      a: "~0.6 oz/ft adicional arriba de 15 ft base",
      b: "2 lb fijos por toda la lineset",
      c: "No se ajusta carga por largo de línea",
      d: "~10 oz/ft en toda línea líquida"
    },
    correct: "a",
    explanation: "La mayoría de fabricantes especifican ~0.6 oz/ft adicional de 3/8\" liquid line arriba de 15 ft base. Siempre revisar la etiqueta del equipo porque varía por modelo.",
    reference: "Typical OEM install manual (Carrier/Trane/Lennox)"
  },
  {
    id: "c20-035",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "El recovery cylinder reutilizable para refrigerante recuperado debe:",
    options: {
      a: "Cumplir DOT 4BA/4BW, Y-gray con tope amarillo",
      b: "Ser cilindro desechable de un solo uso",
      c: "Estar pintado de rojo (solo gases tóxicos)",
      d: "No requiere etiqueta DOT específica"
    },
    correct: "a",
    explanation: "DOT specs 4BA/4BW son las aprobadas para recovery. El color estándar (AHRI) es gray body / yellow top (Y-gray). Se debe llenar máx 80% para permitir expansión.",
    reference: "DOT 49 CFR §178.37; AHRI Guideline K"
  },
  {
    id: "c20-036",
    category: "Ciclo de Refrigeración",
    difficulty: "hard",
    question: "Sistema R-410A: presión de descarga 450 psig, líquido a 125°F, succión 120 psig, línea de succión 48°F. Evaluar:",
    options: {
      a: "Subcool ~7°F y superheat ~7°F — posible overcharge leve",
      b: "Subcool 15°F y superheat 15°F — operación ideal",
      c: "Subcool 0°F y superheat 0°F — inundación total",
      d: "Subcool 30°F y superheat 30°F — sistema limpio"
    },
    correct: "a",
    explanation: "A 450 psig R-410A satura ~132°F, subcool = 132-125 = 7°F (bajo). A 120 psig satura ~41°F, superheat = 48-41 = 7°F (bajo). Ambos bajos sugieren leve overcharge o problema de airflow en evaporator.",
    reference: "P/T chart R-410A; ACCA Manual SH"
  },
  {
    id: "c20-037",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "¿Qué refrigerante nuevo A2L está reemplazando R-410A en residencial split?",
    options: {
      a: "R-454B y R-32 (A2L, bajo GWP)",
      b: "R-11 (CFC low-pressure antiguo)",
      c: "R-502 (mezcla supermercado vieja)",
      d: "R-134a (HFC auto y baja temp)"
    },
    correct: "a",
    explanation: "Bajo AIM Act, fabricantes transicionan a R-32 y R-454B (A2L = mildly flammable, bajo GWP ~466-675). Aplica desde 2025 en equipo nuevo residencial.",
    reference: "EPA AIM Act; ASHRAE 34; UL 60335-2-40"
  },
  {
    id: "c20-038",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "La función del filter-drier es:",
    options: {
      a: "Absorber humedad y filtrar partículas sólidas",
      b: "Aumentar la presión de succión al compressor",
      c: "Reducir superheat antes del evaporator entry",
      d: "Convertir vapor refrigerante en líquido denso"
    },
    correct: "a",
    explanation: "El filter-drier tiene desiccant (molecular sieve) para absorber humedad y fieltro para atrapar metal/partículas. Es crítico cambiarlo al abrir sistema.",
    reference: "ASHRAE Handbook Refrigeration Ch.6; OEM install manuals"
  },
  {
    id: "c20-039",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Nitrógeno seco se usa durante brazing del cobre para:",
    options: {
      a: "Prevenir oxidación interna (cascarilla negra)",
      b: "Bajar el punto de fusión de la soldadura",
      c: "Acelerar enfriamiento de las conexiones",
      d: "Aumentar la presión del sistema sellado"
    },
    correct: "a",
    explanation: "Flowing N2 a ~2-5 CFH durante brazing impide formación de óxido de cobre negro interno, que luego tapa TXV/orifice y contamina el aceite.",
    reference: "ACR Handbook; OEM install guides"
  },
  {
    id: "c20-040",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Después de brazing las líneas, ¿a qué nivel debe evacuarse el sistema antes de liberar refrigerante?",
    options: {
      a: "500 microns o menos con decay test sostenido",
      b: "500 psig de presión positiva mantenida",
      c: "30 in Hg medido con gauge analog",
      d: "No se requiere vacío si cargó por peso"
    },
    correct: "a",
    explanation: "La norma industry (y la mayoría de OEMs) es 500 microns con decay test. A esa presión el agua ha vaporizado y se remueve. Analog gauges no miden microns.",
    reference: "ACCA Quality Installation 5; AHRI Guideline K"
  },
  {
    id: "c20-041",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "Una unidad de 3 tons R-410A con saturation suction de 40°F y condensing de 125°F tiene approximadamente qué COP cooling ideal (reversible Carnot)?",
    options: {
      a: "~5.9 (ratio Carnot ideal teórico)",
      b: "~1.0 (sistema con pérdidas totales)",
      c: "~12 (imposible fuera de cero absoluto)",
      d: "~20 (no alcanzable térmicamente)"
    },
    correct: "a",
    explanation: "COP_Carnot = T_cold / (T_hot - T_cold) en Rankine = 500 / (585 - 500) = 500/85 ≈ 5.88. Sistemas reales llegan a ~3-4 por irreversibilidades.",
    reference: "ASHRAE Fundamentals Ch.1; thermodynamics texts"
  },
  {
    id: "c20-042",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "El oil en el compressor circula con el refrigerante porque:",
    options: {
      a: "Es miscible y lubrica donde pasa por el sistema",
      b: "Se separa totalmente en el oil separator upstream",
      c: "Se evapora en el condenser y vuelve como vapor",
      d: "Funciona como un refrigerante secundario paralelo"
    },
    correct: "a",
    explanation: "POE oil con R-410A y mineral/alkyl benzene con R-22 son miscibles en rangos normales. Un oil trap mal diseñado o suction riser mal dimensionado puede atrapar oil y dañar compressor.",
    reference: "ASHRAE Handbook Refrigeration Ch.12"
  },
  {
    id: "c20-043",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "POE oil se usa con R-410A porque:",
    options: {
      a: "Mineral oil no es miscible con HFC modernos",
      b: "POE es más barato que el mineral o alkylbenzene",
      c: "Aguanta más temperatura que cualquier mineral oil",
      d: "Se vaporiza más fácil en el evaporator de baja"
    },
    correct: "a",
    explanation: "Mineral oil no se mezcla con HFCs, lo que causaría logging en el evaporator. POE (polyolester) sí es miscible con R-410A/R-32/R-454B. POE es muy higroscópico, por eso vacío profundo es crítico.",
    reference: "ASHRAE Handbook Refrigeration Ch.12; ARI 700"
  },
  {
    id: "c20-044",
    category: "Ciclo de Refrigeración",
    difficulty: "hard",
    question: "Sistema R-410A con approach de 10°F en condenser (outdoor 95°F) y evaporator saturation 40°F indoor 75°F. La TD del evaporator es:",
    options: {
      a: "35°F (return 75°F menos sat 40°F)",
      b: "10°F (restando approach al sat)",
      c: "55°F (usando DB outdoor 95°F)",
      d: "5°F (confundiendo TD con approach)"
    },
    correct: "a",
    explanation: "TD evap = return air − sat suction = 75 − 40 = 35°F. Una TD de 30-35°F es normal en AC residencial. TD mucho más alta sugiere low airflow, más baja sugiere overcharge.",
    reference: "ACCA Manual SH; EPA 608 Type II"
  },
  {
    id: "c20-045",
    category: "Ciclo de Refrigeración",
    difficulty: "medium",
    question: "En un sistema con orifice fijo (piston), la carga se verifica con:",
    options: {
      a: "Superheat target según tabla del OEM (DB/WB)",
      b: "Subcooling únicamente (como en TXV system)",
      c: "Peso exacto sin verificar superheat o subcool",
      d: "Presión estática del blower en inches water"
    },
    correct: "a",
    explanation: "Piston systems no tienen control activo, así que la carga se ajusta por superheat target que depende de outdoor DB y indoor WB (tabla del fabricante). TXV systems se cargan por subcool.",
    reference: "OEM charging charts; ACCA Manual SH"
  },
  {
    id: "c20-046",
    category: "Ciclo de Refrigeración",
    difficulty: "easy",
    question: "'Non-condensables' en un sistema de refrigeración son:",
    options: {
      a: "Aire u otros gases que no condensan al P-T normal",
      b: "Humedad líquida acumulada en el accumulator",
      c: "Oil (POE o mineral) que circula con refrigerante",
      d: "Cobre disuelto desde brazing mal ejecutado"
    },
    correct: "a",
    explanation: "Aire atrapado sube la presión de descarga, baja la eficiencia y se acumula arriba del condenser. Se elimina con vacío profundo o, en sistemas grandes, con purger.",
    reference: "ASHRAE Handbook Refrigeration Ch.1"
  },

  // ============================================================
  // DISEÑO DE DUCTOS (MANUAL D) — ~12% (18 preguntas)
  // ============================================================
  {
    id: "c20-047",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "easy",
    question: "¿Qué procedimiento ACCA se usa para diseñar ductos residenciales?",
    options: {
      a: "Manual D (Residential Duct Systems)",
      b: "Manual J (Residential Load Calc)",
      c: "Manual S (Equipment Selection)",
      d: "Manual RS (Residential System)"
    },
    correct: "a",
    explanation: "Manual D de ACCA es el estándar para diseño de ductos residenciales usando método de fricción equal o velocity reduction. Title 24 lo referencia para QI.",
    reference: "ACCA Manual D; Title 24 JA1"
  },
  {
    id: "c20-048",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Un blower residencial está rated a 0.5 in w.c. de external static pressure. Después de restar coil, filtro y registers, ¿cuál es la available static pressure (ASP) típica?",
    options: {
      a: "~0.10-0.15 in w.c. (después de componentes)",
      b: "0.50 in w.c. (todo el TESP disponible)",
      c: "1.00 in w.c. (doble del TESP nominal)",
      d: "0.00 in w.c. (blower completamente saturado)"
    },
    correct: "a",
    explanation: "Manual D toma el total ESP y resta componentes (coil ~0.10-0.25, filter ~0.10, registers ~0.03-0.05) quedando solo ~0.10-0.15 para ductos y fittings. De ahí sale la friction rate.",
    reference: "ACCA Manual D §2"
  },
  {
    id: "c20-049",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Si ASP = 0.10 in w.c. y la equivalent length (EL) del run más largo es 200 ft, ¿cuál es la friction rate (FR) de diseño por 100 ft?",
    options: {
      a: "0.05 in w.c./100 ft (FR = ASP×100/EL)",
      b: "0.10 in w.c./100 ft (igual al ASP)",
      c: "0.20 in w.c./100 ft (doble del valor)",
      d: "0.50 in w.c./100 ft (confunde ESP total)"
    },
    correct: "a",
    explanation: "FR = ASP × 100 / EL = 0.10 × 100 / 200 = 0.05 in w.c./100 ft. Luego se usa un ductulator para encontrar el diámetro que cumpla ese FR para el CFM requerido.",
    reference: "ACCA Manual D §3"
  },
  {
    id: "c20-050",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Para 400 CFM a friction rate 0.08 in/100 ft, ¿qué diámetro aproximado de ducto flexible se necesita?",
    options: {
      a: "10 pulgadas (por ductulator flex)",
      b: "6 pulgadas (subdimensionado ruidoso)",
      c: "14 pulgadas (sobredimensionado caro)",
      d: "4 pulgadas (muy alta velocidad)"
    },
    correct: "a",
    explanation: "Con ductulator: 400 CFM @ 0.08 FR en flex da aprox 10\". Un 8\" daría velocidad alta y ruido; un 12\" sería oversized. Flex penaliza por rugosidad vs metal.",
    reference: "ACCA Manual D; ASHRAE Duct Fitting DB"
  },
  {
    id: "c20-051",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "easy",
    question: "La velocidad máxima recomendada en ducto principal de supply residencial para evitar ruido es aproximadamente:",
    options: {
      a: "~900 FPM (rango residencial 700-1000)",
      b: "2,500 FPM (valor comercial en trunk)",
      c: "5,000 FPM (solo industrial/plenum)",
      d: "~200 FPM (velocidad de branch final)"
    },
    correct: "a",
    explanation: "Manual D recomienda 700-900 FPM en trunk residencial para mantener niveles de ruido aceptables. Comercial tolera 1500-2000 FPM en ductos bien aislados.",
    reference: "ACCA Manual D §4; ASHRAE Ch.21"
  },
  {
    id: "c20-052",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Un register con 100 CFM y una velocidad meta de 500 FPM requiere qué free area mínima?",
    options: {
      a: "0.20 ft² (~29 in², área = CFM/FPM)",
      b: "2.00 ft² (muy sobredimensionado)",
      c: "0.05 ft² (confundiendo unidades)",
      d: "5.00 ft² (fuera de proporción)"
    },
    correct: "a",
    explanation: "Area = CFM / Velocity = 100 / 500 = 0.2 ft² = 28.8 in² de free area. Para un grille con 75% free, necesitas ~38 in² (p. ej. 6×8 o 4×10).",
    reference: "ACCA Manual T; ASHRAE Ch.21"
  },
  {
    id: "c20-053",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Un 90° standard elbow (medium radius) tiene una equivalent length aproximada de:",
    options: {
      a: "10-15 ft (round smooth mid radius)",
      b: "1 ft (válido solo para straight duct)",
      c: "50 ft (exagera la pérdida fitting)",
      d: "100 ft (fuera de rango realista)"
    },
    correct: "a",
    explanation: "En Manual D Appendix 3, un 90° round smooth tiene EL ~10-15 ft. Elbows de flex mal soportados suman más. Por eso cada fitting suma a la equivalent length del run.",
    reference: "ACCA Manual D Appendix 3"
  },
  {
    id: "c20-054",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "hard",
    question: "Casa con 1,600 CFM total de supply. El return duct se diseña a 1,400 CFM para balance. A 700 FPM, ¿qué tamaño de return rectangular duct (aspect 2:1) necesitas?",
    options: {
      a: "~14x28 in (≈2.72 ft² aspect 2:1)",
      b: "~6x12 in (área 0.5 ft² insuficiente)",
      c: "~4x8 in (muy chico, velocidad alta)",
      d: "~24x48 in (oversized consumiendo espacio)"
    },
    correct: "a",
    explanation: "Area = 1400/700 = 2 ft² = 288 in². Con aspect 2:1 → lado corto × 2·lado corto = 288, lado corto ≈ 12\", así que 12×24\" o 14×22\" redondeado. Una opción más conservadora 14×28\" baja velocidad aún más. La respuesta A es razonable para baja velocidad.",
    reference: "ACCA Manual D §4; ductulator"
  },
  {
    id: "c20-055",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "easy",
    question: "Flex duct debe instalarse:",
    options: {
      a: "Totalmente estirado (tenso) y bien soportado",
      b: "Con pandeos suaves para absorber vibración",
      c: "Arrugado levemente para amortiguar ruido",
      d: "Con curvas cerradas de 180° sin soporte"
    },
    correct: "a",
    explanation: "Flex mal estirado o con dobleces agudos triplica la pérdida friccional. Title 24 y Manual D exigen pulled tight con soportes cada 4 ft máx.",
    reference: "ACCA Manual D §4; Title 24 JA1.1"
  },
  {
    id: "c20-056",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Title 24 exige para ductos en attic unconditioned un R-value mínimo de:",
    options: {
      a: "R-8 (attic unconditioned estándar)",
      b: "R-4.2 (valor antiguo pre Title 24)",
      c: "R-2 (insulation mínima legacy)",
      d: "Sin aislamiento (solo residencial)"
    },
    correct: "a",
    explanation: "Title 24 §150.0(m) requiere R-8 en attic unconditioned. R-6 aplica en ciertos casos crawlspace. Esto reduce duct loss y cumple con el new construction standard.",
    reference: "Title 24 §150.0(m)"
  },
  {
    id: "c20-057",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "HERS duct leakage test en California exige para sistema nuevo no exceder:",
    options: {
      a: "5% del nominal airflow (sistema nuevo)",
      b: "20% del nominal (valor demasiado alto)",
      c: "Cualquier valor sin límite establecido",
      d: "50% del nominal (sin prueba HERS)"
    },
    correct: "a",
    explanation: "Title 24 exige que los sistemas nuevos pasen HERS duct test ≤5% leakage to outside, o 10% si aplica alteration. Pruebas con duct blaster @ 25 Pa.",
    reference: "Title 24 §150.0(m)11; RA3.1.4"
  },
  {
    id: "c20-058",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "El Total External Static Pressure (TESP) de un sistema residencial se mide:",
    options: {
      a: "Supply + return plenum como valores absolutos separados",
      b: "Entre supply y return al mismo tiempo (diferencial)",
      c: "En el condenser outdoor con manifold gauges",
      d: "En la salida del register más lejano del blower"
    },
    correct: "b",
    explanation: "TESP = |supply static| + |return static| medidos entre el blower y el coil (no incluyendo el coil). Probes magnehelic o manómetro diferencial. TESP > nameplate es red flag.",
    reference: "NCI airflow training; ACCA Manual D §6"
  },
  {
    id: "c20-059",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "easy",
    question: "Un sistema de 3 tons necesita aproximadamente qué CFM de airflow nominal?",
    options: {
      a: "~1,200 CFM (a 400 CFM/ton nominal)",
      b: "~600 CFM (sólo 200 CFM/ton erróneo)",
      c: "~2,400 CFM (a 800 CFM/ton duplicado)",
      d: "~3,600 CFM (a 1,200 CFM/ton exceso)"
    },
    correct: "a",
    explanation: "La regla estándar AC residencial es 350-450 CFM/ton. 3 tons × 400 = 1,200 CFM. Heat pumps a veces piden 425-450 CFM/ton para capacidad de heating.",
    reference: "ACCA Manual D §1; OEM specs"
  },
  {
    id: "c20-060",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Un return grille undersized causa:",
    options: {
      a: "Alta static, bajo airflow y posible coil congelado",
      b: "Mejor filtración por mayor velocidad de aire",
      c: "Mayor capacidad sensible en el equipo total",
      d: "Menor consumo eléctrico por reducción blower"
    },
    correct: "a",
    explanation: "Return chico sube resistencia, baja CFM, baja el saturation del evap y puede congelar la coil. Título por el side de muchos callbacks por airflow.",
    reference: "ACCA Manual D §4; NCI"
  },
  {
    id: "c20-061",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Un branch de supply de 8\" round a un cuarto con 120 CFM tiene velocidad aproximada:",
    options: {
      a: "~345 FPM (CFM/área, razonable branch)",
      b: "~1,000 FPM (confunde branch con trunk)",
      c: "~50 FPM (muy baja para branch activo)",
      d: "~3,000 FPM (fuera de rango residencial)"
    },
    correct: "a",
    explanation: "Area 8\" round = π·(4)² = 50.27 in² = 0.349 ft². Velocidad = 120 / 0.349 ≈ 344 FPM. Es velocidad apropiada branch residencial.",
    reference: "ASHRAE Duct Fitting DB; ACCA Manual D"
  },
  {
    id: "c20-062",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "hard",
    question: "Un duct run tiene 40 ft de flex, 2 elbows (15 ft EL c/u), 1 boot (35 ft EL), 1 register (10 ft EL). La total equivalent length (TEL) es:",
    options: {
      a: "~125 ft (40+30+35+10 ≈ 115, redondeo)",
      b: "~40 ft (solo el duct físico sin fittings)",
      c: "~200 ft (sobre-sumando fittings dobles)",
      d: "~75 ft (olvidando incluir boot y register)"
    },
    correct: "a",
    explanation: "TEL = 40 (duct) + 2×15 (elbows) + 35 (boot) + 10 (register) = 40+30+35+10 = 115 ft. Redondeado a ≈125 considerando entrada del supply plenum (tap).",
    reference: "ACCA Manual D Appendix 3"
  },
  {
    id: "c20-063",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "El 'worst-case run' en Manual D es el que:",
    options: {
      a: "Tiene la mayor TEL, define friction rate de diseño",
      b: "Tiene el menor CFM de todos los supply runs",
      c: "Es el más corto de toda la distribución supply",
      d: "Tiene más elbows pero menor CFM de destino"
    },
    correct: "a",
    explanation: "FR design = ASP × 100 / TEL_longest. Todos los demás runs se balancean con dampers o más pequeños. Es la base del método equal friction modificado.",
    reference: "ACCA Manual D §3"
  },
  {
    id: "c20-064",
    category: "Diseño de Ductos (Manual D)",
    difficulty: "medium",
    question: "Cuando se instalan ductos metálicos, las juntas transversales deben sellarse con:",
    options: {
      a: "Mastic UL 181 A/B o tape listado UL 181",
      b: "Cualquier duct tape gris de ferretería",
      c: "Cinta adhesiva de papel para enmascarar",
      d: "Silicona blanca de uso general RTV"
    },
    correct: "a",
    explanation: "UL 181 es el standard para sealants de HVAC. 'Duct tape' común falla por UV/temp y no cumple. Mastic aplicado con mesh es lo más durable.",
    reference: "UL 181; CMC §603; Title 24 §150.0(m)"
  },

  // ============================================================
  // ELÉCTRICO HVAC — ~12% (18 preguntas)
  // ============================================================
  {
    id: "c20-065",
    category: "Eléctrico HVAC",
    difficulty: "easy",
    question: "En la nameplate de un condenser, MCA significa:",
    options: {
      a: "Minimum Circuit Ampacity",
      b: "Maximum Continuous Amperage",
      c: "Motor Control Amperage Rating",
      d: "Main Circuit Adjustment Rating"
    },
    correct: "a",
    explanation: "MCA es el calibre mínimo del wire que soporta el equipo (125% del FLA del compressor mayor + 100% de los demás). Define el wire sizing.",
    reference: "NEC 440.32; UL 1995"
  },
  {
    id: "c20-066",
    category: "Eléctrico HVAC",
    difficulty: "easy",
    question: "MOP en la nameplate significa:",
    options: {
      a: "Maximum Overcurrent Protection",
      b: "Motor Operating Power factor",
      c: "Minimum Operating Pressure range",
      d: "Main Operating Protocol setting"
    },
    correct: "a",
    explanation: "MOP es el tamaño máximo del breaker o fuse permitido. NUNCA exceder el MOP — pone en riesgo la integridad del circuito y viola el listing UL.",
    reference: "NEC 440.22; UL 1995"
  },
  {
    id: "c20-067",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Nameplate: MCA 22A, MOP 35A. ¿Qué combinación cumple NEC?",
    options: {
      a: "#10 AWG Cu THHN con breaker de 30A (NEC)",
      b: "#12 AWG Cu THHN con breaker de 40A (MOP)",
      c: "#14 AWG Cu THHN con breaker de 30A (MCA)",
      d: "#10 AWG Cu THHN con breaker de 50A (MOP)"
    },
    correct: "a",
    explanation: "#10 Cu THHN tiene ampacity 30A @ 75°C columna (suficiente para MCA 22A). Breaker 30A ≤ MOP 35A. Ambas condiciones cumplen. #12 máx 20A no cubre 22A MCA.",
    reference: "NEC 310.16; NEC 240.4"
  },
  {
    id: "c20-068",
    category: "Eléctrico HVAC",
    difficulty: "easy",
    question: "Según NEC, el condenser outdoor de AC residencial requiere un disconnect:",
    options: {
      a: "A la vista (≤50 ft) y readily accessible",
      b: "Solo si la unidad está a más de 100 ft",
      c: "Únicamente en equipo comercial 3-phase",
      d: "No es obligatorio en sistemas residencial"
    },
    correct: "a",
    explanation: "NEC 440.14 requiere disconnect 'within sight and readily accessible' del equipo de AC. 'Within sight' = ≤50 ft y visible. Se instala normalmente en la pared junto al condenser.",
    reference: "NEC 440.14"
  },
  {
    id: "c20-069",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Un condenser de 240V 30A FLA requiere wire THHN Cu en conduit. Ampacity Table 310.16 @ 75°C para:",
    options: {
      a: "#8 AWG Cu = 50A — adecuado con MCA 37.5A",
      b: "#14 AWG Cu = 20A — adecuado para 30A FLA",
      c: "#18 AWG Cu = 14A — adecuado en conduit EMT",
      d: "#6 AWG Cu obligatorio (overkill normativo)"
    },
    correct: "a",
    explanation: "MCA = 30 × 1.25 = 37.5A (redondeando). #10 Cu @ 75°C = 35A (justo por debajo); #8 Cu = 50A sobra pero es la elección segura. Checa voltage drop en runs largos.",
    reference: "NEC 310.16; NEC 440.32"
  },
  {
    id: "c20-070",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Voltage drop máximo recomendado en circuitos de equipos HVAC (NEC informational):",
    options: {
      a: "3% en branch y 5% combinado feeder+branch",
      b: "10% en branch (valor muy alto no aceptado)",
      c: "0% (imposible lograr en la práctica real)",
      d: "25% máximo (fuera de cualquier norma)"
    },
    correct: "a",
    explanation: "NEC 210.19 informational recomienda 3% en branch y 5% en combinado. Voltage bajo daña compressors por alta corriente y reduce torque de motores.",
    reference: "NEC 210.19(A) Informational Note"
  },
  {
    id: "c20-071",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Un ECM motor de blower de ½ HP consume aproximadamente:",
    options: {
      a: "~4-5 A @ 120V carga normal (~500 W)",
      b: "~20 A @ 120V (LRA no continua nominal)",
      c: "~0.5 A @ 120V (muy bajo para ½ HP)",
      d: "~15 A @ 240V (aplicación comercial 3ph)"
    },
    correct: "a",
    explanation: "½ HP × 746 W ÷ ~0.75 eficiencia ≈ 500 W, a 120V ≈ 4.2 A. ECM es más eficiente que PSC, pero mismo current range.",
    reference: "NEC 430.248; OEM motor specs"
  },
  {
    id: "c20-072",
    category: "Eléctrico HVAC",
    difficulty: "easy",
    question: "La clase de motor overload típica para compressor hermético es:",
    options: {
      a: "Inherent interno (bimetal) o Class 10 externo",
      b: "Fuse de 100A dedicado en disconnect outdoor",
      c: "No requiere protección por ser sellado hermético",
      d: "GFCI únicamente en el branch del compressor"
    },
    correct: "a",
    explanation: "Compressors herméticos usan overload interno (bi-metal) o externos clase 10. NEC 440.52 exige protección individual para cada compressor y fan motor.",
    reference: "NEC 440.52"
  },
  {
    id: "c20-073",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Un capacitor dual (run) 45/5 µF 440V sirve para:",
    options: {
      a: "45 µF al compressor (HERM) y 5 µF al fan",
      b: "45 µF al fan motor y 5 µF al compressor",
      c: "Ambos terminales al compressor (mayor torque)",
      d: "Solo al startup del compressor por unos ciclos"
    },
    correct: "a",
    explanation: "El dual cap tiene HERM (compressor) con el valor grande y FAN con el pequeño. C es común. 440V es el rating mínimo y es intercambiable con 370V solo upgrade, no downgrade.",
    reference: "Motor capacitor install guide; EASA"
  },
  {
    id: "c20-074",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Un hard-start kit (start capacitor + potential relay) se usa para:",
    options: {
      a: "Mejorar starting torque con voltage bajo o duro",
      b: "Aumentar el SEER2 nominal del equipo instalado",
      c: "Reemplazar el run capacitor en forma definitiva",
      d: "Reducir el amperaje nominal del compressor run"
    },
    correct: "a",
    explanation: "Hard-start añade capacitancia momentánea al startup para dar torque extra. Potential relay lo desconecta al llegar a ~75% de RPM. Útil cuando voltage drop o baja calidad.",
    reference: "EASA motor guide; manufacturer app notes"
  },
  {
    id: "c20-075",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Un contactor single-pole en 240V con una pata no switcheada es aceptable cuando:",
    options: {
      a: "No se recomienda; industry/OEMs modernos piden DP",
      b: "Siempre es aceptable en cualquier residencial CA",
      c: "Solo si el service panel tiene breakers HACR-rated",
      d: "Solo cuando el circuito opera a 120V single-phase"
    },
    correct: "a",
    explanation: "Single-pole contactors dejan una pata hot aunque el contactor abra — peligroso para service. Industry best practice y muchos fabricantes ahora especifican DP. Algunos códigos locales lo exigen.",
    reference: "NEC 404.2; OEM service bulletins"
  },
  {
    id: "c20-076",
    category: "Eléctrico HVAC",
    difficulty: "hard",
    question: "Un condenser 208/230V tiene MCA 28A y MOP 45A. Instalas #10 Cu THHN con breaker 40A. ¿Cumple?",
    options: {
      a: "Sí: #10 = 35A > MCA 28A y 40A ≤ MOP 45A",
      b: "No: breaker muy pequeño para wire #10 Cu",
      c: "No: #10 está subsized para el MCA nominal",
      d: "Solo cumple si se agrega GFCI en el disconnect"
    },
    correct: "a",
    explanation: "#10 THHN @ 75°C = 35A, arriba del MCA 28A (correcto). Breaker 40A no excede MOP 45A y es el estándar más cercano. Cumple NEC 440.",
    reference: "NEC 310.16; NEC 440.22; NEC 440.32"
  },
  {
    id: "c20-077",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Bonding del disconnect del condenser debe conectarse a:",
    options: {
      a: "Equipment grounding conductor (EGC) al service",
      b: "Solo al neutral en el panel principal de la casa",
      c: "Cold water pipe (método legacy pre-2008 NEC)",
      d: "No requiere bonding si usa conduit metálico EMT"
    },
    correct: "a",
    explanation: "El EGC va desde el disconnect hasta el main service panel por conduit metálico o conductor dedicado. Sin bonding adecuado, una falla no despeja y queda frame energizado.",
    reference: "NEC 250.118; NEC 250.122"
  },
  {
    id: "c20-078",
    category: "Eléctrico HVAC",
    difficulty: "easy",
    question: "El transformer 24V de control en un furnace residencial es típicamente:",
    options: {
      a: "40 VA Class 2, 120V primario / 24V secundario",
      b: "500 VA industrial (muy grande para furnace)",
      c: "240V secundario (voltaje de línea alta fase)",
      d: "No existe transformer (los controles son DC)"
    },
    correct: "a",
    explanation: "40 VA Class 2 es standard en furnaces. Si el sistema tiene muchos accesorios (humidifier, dampers), puede requerirse 75 VA. Class 2 limita risk de shock y fire.",
    reference: "NEC 725; UL 1585"
  },
  {
    id: "c20-079",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Thermostat wire 18/8 de control debe tenderse:",
    options: {
      a: "Separado de power; Class 2 no se mezcla con Class 1",
      b: "Junto con 120/240V en el mismo conduit compartido",
      c: "Sin protección mecánica (libre por el attic)",
      d: "En conduit EMT rígido obligatorio en residencial"
    },
    correct: "a",
    explanation: "NEC 725.136 prohíbe mezclar Class 2 con Class 1 o power en el mismo raceway o caja (salvo separaciones listadas). Thermostat wire comunmente corre por dentro de paredes sin conduit en residencial.",
    reference: "NEC 725.136"
  },
  {
    id: "c20-080",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Para un heat pump package 5-ton 240V con electric heat 10 kW strip, la carga total approx:",
    options: {
      a: "Compressor ~28A + strip ~42A = ~70A total",
      b: "Solo 10A totales entre compressor y strip",
      c: "~200A (sobreestimando corriente continua)",
      d: "No se suman ambas cargas por operar alternas"
    },
    correct: "a",
    explanation: "Strip 10kW/240V = 41.7A. Compressor 5-ton ~26-30A FLA. No operan simultáneamente en todos los modos (segundaria stage), pero NEC exige sumar por carga máxima. MOP típico 70-80A.",
    reference: "NEC 440; NEC 424.3"
  },
  {
    id: "c20-081",
    category: "Eléctrico HVAC",
    difficulty: "medium",
    question: "Para instalar electric resistance strip heat, NEC exige:",
    options: {
      a: "Sub-dividir cargas >48A en circuitos con OCPD",
      b: "Un solo breaker de 200A para todo el strip heat",
      c: "Sin disconnect local cerca del air handler",
      d: "Aplica únicamente a cooling, no a resistance heat"
    },
    correct: "a",
    explanation: "NEC 424.22(B) requiere sub-dividir resistance heat en circuitos de ≤48A, cada uno con su overcurrent protection. Esto es por el factor continuous load de los elements.",
    reference: "NEC 424.22(B)"
  },
  {
    id: "c20-082",
    category: "Eléctrico HVAC",
    difficulty: "hard",
    question: "Un furnace gas con blower 1/3 HP ECM y ignitor requiere circuito dedicado de:",
    options: {
      a: "120V 15A dedicado cumple (NEC 422.12)",
      b: "240V 40A dedicado (sobredimensionado grave)",
      c: "120V 50A dedicado (fuera del rango típico)",
      d: "480V trifásico dedicado (solo industrial)"
    },
    correct: "a",
    explanation: "Blower ECM 1/3 HP (~3A) + ignitor (~4A transitorio) + controles: total normal <8A. 15A dedicado (con NEC 422.12 required dedicated) cumple holgadamente.",
    reference: "NEC 422.12; NEC 430.248"
  },

  // ============================================================
  // GAS Y VENTING — ~10% (15 preguntas)
  // ============================================================
  {
    id: "c20-083",
    category: "Gas y Venting",
    difficulty: "easy",
    question: "El código base para gas piping residencial en California es:",
    options: {
      a: "California Plumbing Code Part 5 + NFPA 54",
      b: "NEC Article 250 (grounding del gas piping)",
      c: "UL 507 (fans y air movers en HVAC)",
      d: "ASHRAE 62.2 (ventilation residencial)"
    },
    correct: "a",
    explanation: "California Mechanical Code y Plumbing Code adoptan NFPA 54 (National Fuel Gas Code) para gas piping, sizing y venting. El UMC no aplica en CA (se usa CMC).",
    reference: "CMC §1208; CPC Part 5; NFPA 54"
  },
  {
    id: "c20-084",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Una sala de mecánicos tiene un furnace 80k BTU/h. Combustion air requerido (método standard): 50 ft³ por 1000 BTU/h requiere:",
    options: {
      a: "Volumen ≥ 4,000 ft³ o aperturas adicionales",
      b: "Cualquier tamaño de cuarto es aceptable",
      c: "2,000 ft³ mínimo del cuarto mecánico",
      d: "10,000 ft³ (sobreestima el método std)"
    },
    correct: "a",
    explanation: "NFPA 54 método standard: 50 ft³ por 1000 BTU/h. 80,000 / 1000 × 50 = 4,000 ft³. Si cuarto es menor, hay que traer outdoor air con aperturas dimensionadas.",
    reference: "NFPA 54 §9.3; CMC §701"
  },
  {
    id: "c20-085",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Para un category I atmospheric furnace, el vent size mínimo se calcula con:",
    options: {
      a: "Tablas NFPA 54 por input, altura, lateral, conector",
      b: "Regla general de 3\" para todo furnace residencial",
      c: "Mismo tamaño que la gas line de suministro",
      d: "Rule of thumb de 1 in² por cada kW de input"
    },
    correct: "a",
    explanation: "NFPA 54 Tabla 13 (single wall) y 13.1 (Type B) dan capacidades por altura y run lateral. Undersized vent = spillage de CO y backdraft.",
    reference: "NFPA 54 §13; GAMA venting tables"
  },
  {
    id: "c20-086",
    category: "Gas y Venting",
    difficulty: "easy",
    question: "Un Cat IV (sealed combustion condensing furnace) ventea con:",
    options: {
      a: "PVC/CPVC/PP listado por temp y OEM aprobado",
      b: "Type B galvanized double-wall tradicional",
      c: "Single-wall galvanized con clearance 6 in",
      d: "Masonry flue con terracotta liner tradicional"
    },
    correct: "a",
    explanation: "Condensing units (AFUE 90+) bajan la temp de flue ~100-130°F y son condensing. PVC/CPVC/polypropylene listados son válidos. Type B no es válido porque se satura condensado y corroe.",
    reference: "NFPA 54 §12; OEM install guide"
  },
  {
    id: "c20-087",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "CMC y NFPA 54 exigen que el vent terminal de Cat IV esté a distancia mínima de una ventana operable:",
    options: {
      a: "4 ft horizontal/abajo y 1 ft arriba mínimo",
      b: "Cualquier distancia es aceptable si está sealed",
      c: "50 ft mínimo (fuera de proporción residencial)",
      d: "Pegado a la ventana (nunca permitido por NFPA)"
    },
    correct: "a",
    explanation: "NFPA 54 §12.9 exige 4 ft hor/abajo y 1 ft arriba de operable opening, 12 in del grade, 3 ft arriba de forced-air inlets dentro de 10 ft. Evita recirculación de CO.",
    reference: "NFPA 54 §12.9; CMC §802"
  },
  {
    id: "c20-088",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Un furnace de 100,000 BTU/h usando natural gas (~1,000 BTU/ft³) consume aproximadamente:",
    options: {
      a: "100 CFH (input dividido por heating value)",
      b: "10 CFH (factor de 10x demasiado bajo)",
      c: "1,000 CFH (factor de 10x demasiado alto)",
      d: "10,000 CFH (fuera de rango residencial)"
    },
    correct: "a",
    explanation: "CFH = Input / heating value = 100,000 / 1,000 = 100 CFH. Esto se usa para sizing de gas line (NFPA 54 Tabla 6.2). Propano ~2,500 BTU/ft³ consume menos CFH.",
    reference: "NFPA 54 §6; CMC §1208"
  },
  {
    id: "c20-089",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Gas pipe sizing: run de 60 ft con 100 CFH de demanda usando Schedule 40 black iron a 0.5 in w.c. drop requiere diámetro mínimo de:",
    options: {
      a: "¾\" (capacidad ~146 CFH @ 60 ft NFPA)",
      b: "½\" (capacidad ~70 CFH @ 60 ft insuficiente)",
      c: "¼\" (inadecuada para cualquier gas residencial)",
      d: "2\" (sobredimensionada fuera de rango normal)"
    },
    correct: "a",
    explanation: "Con tabla de NFPA 54 (natural gas, 0.5 in w.c., Sch 40), ¾\" a 60 ft soporta ~146 CFH > 100 requerido. ½\" a 60 ft ≈ 70 CFH, insuficiente.",
    reference: "NFPA 54 Tabla 6.2(a)"
  },
  {
    id: "c20-090",
    category: "Gas y Venting",
    difficulty: "easy",
    question: "El gas shut-off valve del furnace debe estar:",
    options: {
      a: "A la vista, accesible, dentro de 6 ft del appliance",
      b: "Únicamente en el medidor de la compañía del gas",
      c: "Oculto en el attic fuera del alcance sin tools",
      d: "No requerido en furnaces modernos listados UL"
    },
    correct: "a",
    explanation: "NFPA 54 §9.6.1 y CMC §1211 piden valve de paso 'in the same room' del appliance, dentro de 6 ft, accesible sin herramienta. Es obligatorio para service/shutoff.",
    reference: "NFPA 54 §9.6; CMC §1211"
  },
  {
    id: "c20-091",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Sediment trap (drip leg) en gas piping debe:",
    options: {
      a: "Instalarse upstream del appliance (excepto ranges/dryers listados)",
      b: "Ser opcional siempre, decisión del instalador local",
      c: "Usarse únicamente en instalaciones con propano líquido",
      d: "Instalarse downstream del regulator final appliance"
    },
    correct: "a",
    explanation: "NFPA 54 §8.1.2 obliga sediment trap inmediatamente antes del control valve. Unos ranges/dryers vienen con trap interno listado. Atrapa debris y condensado.",
    reference: "NFPA 54 §8.1.2"
  },
  {
    id: "c20-092",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Al terminar instalación de gas, la prueba de fuga se hace con:",
    options: {
      a: "Aire o N2 a ≥1.5× WP operativo o 3 psig mín",
      b: "Gas natural real abierto desde el medidor",
      c: "Agua bombeada a alta presión en el piping",
      d: "Propano líquido del tanque del suministro"
    },
    correct: "a",
    explanation: "CMC/NFPA 54 exige presurizar con aire/N2. Mínimo 3 psig por 10 min para detectar fugas antes de abrir gas. Jamás con flama abierta, jamás con gas real.",
    reference: "NFPA 54 §8.2; CMC §1214"
  },
  {
    id: "c20-093",
    category: "Gas y Venting",
    difficulty: "easy",
    question: "Manifold pressure típica de un furnace natural gas single-stage:",
    options: {
      a: "~3.5 in w.c. (natural gas single-stage)",
      b: "~10 psig (demasiado alto para manifold)",
      c: "~1 in w.c. (muy baja para manifold gas)",
      d: "~11 in w.c. (valor típico de propano)"
    },
    correct: "a",
    explanation: "Natural gas manifold: ~3.5 in w.c. a la flama. Propano: ~10-11 in w.c. Línea de servicio: ~7 in w.c. antes del regulator del appliance. Alto manifold = sobrefuego = CO.",
    reference: "NFPA 54; OEM install manuals"
  },
  {
    id: "c20-094",
    category: "Gas y Venting",
    difficulty: "hard",
    question: "Combustion analysis después del startup: un furnace mostrando 150 ppm CO air-free en flue y O2 7% indica:",
    options: {
      a: "CO alto; ajustar gas rate y revisar heat exchanger",
      b: "Operación normal dentro de todos los parámetros",
      c: "Exceso de aire de combustión (overcombustion)",
      d: "No requiere apagar ni corregir; reportar nada"
    },
    correct: "a",
    explanation: "CO < 100 ppm air-free es el máx industry-accepted. 150 ppm indica combustión incompleta: sobrefuego, insuficiente combustion air, o heat exchanger cracked. No dejar running sin resolver.",
    reference: "ANSI Z21.47; ACCA 5 QI; combustion analyzer manuals"
  },
  {
    id: "c20-095",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Un furnace 80% AFUE natural-draft (Cat I) debe conectarse a flue:",
    options: {
      a: "Type B double-wall vertical con draft hood",
      b: "PVC schedule 40 (solo válido para Cat IV)",
      c: "Cualquier material disponible en la jurisdicción",
      d: "Single-wall flexible (no permitido como flue)"
    },
    correct: "a",
    explanation: "Cat I ~400-480°F flue. Type B es el estándar por seguridad y clearance reducido. PVC fallaría por temperatura. Single-wall solo permitido en el connector dentro de la misma habitación con clearances.",
    reference: "NFPA 54 §13; CMC §802"
  },
  {
    id: "c20-096",
    category: "Gas y Venting",
    difficulty: "medium",
    question: "Clearance lateral del single-wall vent connector a combustible según NFPA 54 básico:",
    options: {
      a: "6 in (reducible con protection listada)",
      b: "0 in (pegado al material combustible)",
      c: "12 in (para single-wall sin reducción)",
      d: "36 in (solo aplica appliance industrial)"
    },
    correct: "a",
    explanation: "Single-wall connector = 6 in clearance a combustible. Se puede reducir con placa protectora listada (p.ej. 1 in con sheet metal + aire). Type B connector = 1 in clearance standard.",
    reference: "NFPA 54 §13.2; CMC Tabla 802.7"
  },
  {
    id: "c20-097",
    category: "Gas y Venting",
    difficulty: "easy",
    question: "CSST (corrugated stainless steel tubing) requiere bonding según NFPA 54 porque:",
    options: {
      a: "Puede ser perforado por rayos sin bonding directo",
      b: "Es magnético y conduce cargas parasíticas al piping",
      c: "Conduce electricidad DC al chasis del appliance",
      d: "No requiere bonding en instalaciones residenciales"
    },
    correct: "a",
    explanation: "Incidentes de lightning causando perforación/fuego llevaron a requisito de bonding con #6 Cu directamente al grounding electrode system, separado del EGC de rama.",
    reference: "NFPA 54 §7.13; NEC 250.104(B)"
  },

  // ============================================================
  // INSTALACIÓN Y STARTUP — ~12% (18 preguntas)
  // ============================================================
  {
    id: "c20-098",
    category: "Instalación y Startup",
    difficulty: "easy",
    question: "Antes de energizar un condenser split nuevo, la secuencia correcta es:",
    options: {
      a: "Pressure test N2, evacuar 500 μ, liberar, energizar",
      b: "Energizar primero y luego hacer el vacío correspondiente",
      c: "Abrir las service valves sin hacer vacío previamente",
      d: "Purgar el sistema con refrigerante para barrer humedad"
    },
    correct: "a",
    explanation: "Secuencia Manual SC / ACCA QI: N2 leak test → triple evacuation o hasta 500 μ con decay → abrir service valves → energizar → verificar superheat/subcool.",
    reference: "ACCA 5 QI; AHRI Guideline K"
  },
  {
    id: "c20-099",
    category: "Instalación y Startup",
    difficulty: "easy",
    question: "La prueba de presión para leak check de un split R-410A se hace típicamente con:",
    options: {
      a: "N2 seco a ~500 psig, sin exceder low-side design",
      b: "R-410A puro del cilindro cargando directo al sistema",
      c: "Aire comprimido del shop con compressor eléctrico",
      d: "Oxígeno puro de cilindro (prohibido por combustión)"
    },
    correct: "a",
    explanation: "N2 es inerte, seco, barato. ~500 psig detecta fugas que pegan al ojo por sonido/bubble. Nunca O2 (combustión con oil) ni aire (humedad). Revisar siempre max test pressure del equipo.",
    reference: "ACCA 5 QI; OEM install manuals"
  },
  {
    id: "c20-100",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "El nivel de vacío 500 microns representa aproximadamente:",
    options: {
      a: "~29.92 in Hg menos 0.02 (0.5 mmHg absoluto)",
      b: "0 in Hg (presión atmosférica de referencia)",
      c: "30 psig positivos sobre la presión atmosférica",
      d: "Vacío perfecto absoluto (físicamente imposible)"
    },
    correct: "a",
    explanation: "500 microns = 0.5 mmHg absoluto ≈ 29.92 − 0.02 in Hg. Es 99.93% vacío, suficiente para evaporar agua líquida a temperatura ambiente.",
    reference: "ACCA QI; vacuum gauge manuals (Appion)"
  },
  {
    id: "c20-101",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "Durante evacuation, el vacío sube a 2,000 microns y se estabiliza. Lo más probable es:",
    options: {
      a: "Humedad residual evaporando dentro del sistema",
      b: "Vacío completamente terminado y sistema listo",
      c: "Leak grande en el sistema sellado (sin pausa)",
      d: "Compressor corriendo durante evacuation (err)"
    },
    correct: "a",
    explanation: "Si sube y se estabiliza, normalmente hay humedad. Si sigue subiendo sin estabilizarse, es leak. Continuar pumping y calentar ligeramente el sistema ayuda.",
    reference: "AHRI Guideline K; vacuum pump manuals"
  },
  {
    id: "c20-102",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "Al comisionar un AC residencial, el airflow se debe medir con:",
    options: {
      a: "Flow hood, TrueFlow grid o pitot traverse medido",
      b: "A ojo por la velocidad del aire visible del register",
      c: "Velocímetro de rotación del blower wheel únicamente",
      d: "Amp clamp midiendo corriente del blower motor"
    },
    correct: "a",
    explanation: "ACCA 5 QI exige airflow medido, no calculado. Flow hood en registers, TrueFlow plate en return, o pitot traverse en duct straight run. Temperatura split es insuficiente sola.",
    reference: "ACCA 5 QI; NCI training"
  },
  {
    id: "c20-103",
    category: "Instalación y Startup",
    difficulty: "easy",
    question: "Título 24 requiere HERS verification para:",
    options: {
      a: "Duct leakage, refrigerant charge/airflow (o FCCV)",
      b: "Solo duct leakage, sin revisar charge ni airflow",
      c: "Nada en residencial; HERS es solo commercial new",
      d: "Únicamente en instalaciones comerciales NC"
    },
    correct: "a",
    explanation: "Title 24 requiere HERS-III para QA. Items típicos: duct leakage, refrigerant charge (CA charge indicator o QM), airflow, fan watt draw. Climate zones calientes tienen más requisitos.",
    reference: "Title 24 §150.0(m); RA3"
  },
  {
    id: "c20-104",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "Antes de recoger la carga de un sistema existente para reemplazo, EPA exige:",
    options: {
      a: "Máquina recovery certificada AHRI 740 y cilindro DOT",
      b: "Ventear al exterior del edificio en área abierta (ilegal)",
      c: "Solo cerrar válvulas service y liberar al ambiente",
      d: "Puede usarse el compressor del sistema como bomba"
    },
    correct: "a",
    explanation: "EPA §608 exige recovery equipment certificado AHRI 740 para HFC/HCFC. Ventear es multa severa ($44,539/día por violación).",
    reference: "EPA 40 CFR §82.156; AHRI 740"
  },
  {
    id: "c20-105",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "El condenser pad debe:",
    options: {
      a: "Nivelado, firme, 2-4 in sobre grade, clearances OEM",
      b: "Pegado a la pared de la casa sin clearance indicado",
      c: "Enterrado en grass o tierra para reducir ruido",
      d: "Inclinado 15° hacia afuera para drenaje del agua"
    },
    correct: "a",
    explanation: "Manual de OEM típico pide pad nivelado, 2-4\" sobre grade (evitar snow/lluvia), clearances (12-36\" según modelo) a pared y a otros condensers para evitar recirculación de aire.",
    reference: "OEM install manuals; CMC §303"
  },
  {
    id: "c20-106",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "En zona sísmica (California), el furnace en attic debe:",
    options: {
      a: "Llevar seismic strapping, platform y walkway reglamentarios",
      b: "Apoyado en el ceiling joist sin restricción sísmica formal",
      c: "Sin restricción (aplica solo a water heaters en CA)",
      d: "Anclado al roof sheathing con tornillos plásticos UV"
    },
    correct: "a",
    explanation: "CMC §304 y §305 exigen seismic restraint. Furnace en attic necesita platform sólida, walkway ≥24\" ancho, luz, y switch de servicio cerca.",
    reference: "CMC §304, §305"
  },
  {
    id: "c20-107",
    category: "Instalación y Startup",
    difficulty: "easy",
    question: "Un condensate drain de un evaporator en attic requiere:",
    options: {
      a: "Primary drain + secondary overflow pan con float switch",
      b: "Solo primary drain (sin backup over living space)",
      c: "Ningún drenaje específico si es attic unconditioned",
      d: "Tubing transparente al piso (solo visual inspection)"
    },
    correct: "a",
    explanation: "CMC §310 exige secondary drain o pan con float switch cuando el equipo está en plano sobre living space. El switch apaga el sistema si primary se tapa.",
    reference: "CMC §310"
  },
  {
    id: "c20-108",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "Una condensate trap del evaporator es necesaria porque:",
    options: {
      a: "El blower genera negative pressure que impide drain",
      b: "Por decoración del instalador (no funcional real)",
      c: "Reducir el ruido del drain en el gotero del pan",
      d: "Aumentar CFM del blower en modo cooling activo"
    },
    correct: "a",
    explanation: "La succión del blower succiona agua up y aire atravesando el drain. El p-trap crea sello hidráulico. Profundidad del trap ~2× ESP del sistema.",
    reference: "OEM install manuals; CMC §310"
  },
  {
    id: "c20-109",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "Un contractor instala un heat pump 3.5-ton pero Manual J pide 3-ton. Impacto:",
    options: {
      a: "Short-cycling, mala dehumidification y posible reject HERS",
      b: "Mejor performance (más capacidad = mejor desempeño real)",
      c: "Mayor SEER2 de placa del sistema por mayor size",
      d: "Sin impacto; oversize ~15% es siempre aceptable Title 24"
    },
    correct: "a",
    explanation: "Oversize ≥115% de Manual J viola Title 24/Manual S. Short-cycling desgasta compressor, mal humidity control, mayor consumo. HERS lo reporta.",
    reference: "Title 24 §150.0(h); ACCA Manual S"
  },
  {
    id: "c20-110",
    category: "Instalación y Startup",
    difficulty: "easy",
    question: "Para lineset entre condenser y air handler, el insulation debe:",
    options: {
      a: "Cubrir suction, espesor adecuado y protegido UV outdoor",
      b: "Solo la liquid line (suction no requiere insulation)",
      c: "No requiere ningún insulation en residencial moderno",
      d: "Ser opcional en suction (solo recomendada en commercial)"
    },
    correct: "a",
    explanation: "Insulation cerrada-cel en suction previene condensado y pérdidas. Expuesta a sol necesita UV jacket o paintado con UV coat. Liquid line se aisla si pasa por unconditioned space.",
    reference: "Title 24 §150.0(j); ASHRAE 90.1"
  },
  {
    id: "c20-111",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "El torque de flare connections (SAE) en lineset se debe ajustar con:",
    options: {
      a: "Torque wrench calibrado a spec OEM (3/8\" ~35 ft-lb)",
      b: "Apriete fuerte con llave ajustable hasta sentir resistencia",
      c: "Solo a mano sin herramienta (flare self-sealing)",
      d: "Hasta que la conexión brinque o el metal fluya visible"
    },
    correct: "a",
    explanation: "Overtorquing raja el flare, undertorquing fuga. OEM especifica por tamaño (p.ej. 1/4\" ~12 ft-lb, 3/8\" ~35 ft-lb, 5/8\" ~60 ft-lb). Torque wrench obligatorio.",
    reference: "SAE J513; OEM service manuals"
  },
  {
    id: "c20-112",
    category: "Instalación y Startup",
    difficulty: "hard",
    question: "Un startup checklist ACCA 5 QI requiere documentar:",
    options: {
      a: "Superheat, subcool, CFM, TESP, voltage, gas, CO",
      b: "Solo las presiones de suction y discharge del sistema",
      c: "Ningún dato; startup es visual y sin documentation",
      d: "Solo la temperatura del supply air en el register main"
    },
    correct: "a",
    explanation: "ACCA 5 QI §6 Commissioning pide data sheet completa. HERS verifica muchos de estos parámetros. Sin documentation, el equipo no está comisionado formalmente.",
    reference: "ACCA 5 QI; Title 24 RA3"
  },
  {
    id: "c20-113",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "CA Charge Indicator Display (CID) method se usa para:",
    options: {
      a: "Verificar refrigerant charge sin gauges (Title 24 HERS)",
      b: "Medir airflow por los registers después del startup",
      c: "Medir CO en el flue del furnace atmospheric draft",
      d: "Programar el termostato smart con setpoints por zona"
    },
    correct: "a",
    explanation: "Title 24 permite CID (onboard sensors que reportan OK/NOT) o Standard Charge Verification como alternativa a Manual Charge Verification. Menos invasivo, más consistente.",
    reference: "Title 24 RA3.2; CEC Reference Appendices"
  },
  {
    id: "c20-114",
    category: "Instalación y Startup",
    difficulty: "medium",
    question: "Un furnace nuevo en garage debe tener el burner elevado:",
    options: {
      a: "≥18 in del floor (vapores flamables), excepto FVIR",
      b: "Al nivel del piso (residencial sin restricción)",
      c: "6 in sobre el floor (valor no acorde con código)",
      d: "4 ft sobre el floor (exageradamente alto)"
    },
    correct: "a",
    explanation: "CMC §308 / NFPA 54 exigen 18 in para igniciones no-FVIR (flammable vapor ignition resistant). Appliances FVIR listados pueden ir al piso.",
    reference: "CMC §308; NFPA 54 §9.1.11"
  },
  {
    id: "c20-115",
    category: "Instalación y Startup",
    difficulty: "easy",
    question: "Un condenser no debe instalarse directamente debajo de:",
    options: {
      a: "Un snow/ice drip line del techo sin protección shield",
      b: "Un árbol grande (la sombra ayuda al performance)",
      c: "Un porch techado con clearances OEM cumplidos",
      d: "Cerca de una ventana (a la distancia OEM típica)"
    },
    correct: "a",
    explanation: "Hielo y nieve cayendo dañan el coil y el fan. OEM piden legs elevados y fuera de drip line. Sombra sí ayuda (reduce condensing temp) siempre que no restrinja airflow.",
    reference: "OEM install manuals"
  },

  // ============================================================
  // CÓDIGOS (CMC, UMC, TITLE 24) — ~12% (18 preguntas)
  // ============================================================
  {
    id: "c20-116",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "El código mecánico estatal de California está basado en:",
    options: {
      a: "Uniform Mechanical Code (IAPMO) con amendments CA",
      b: "International Mechanical Code sin amendments estatales",
      c: "ASHRAE 62.2 solamente (ventilation residencial)",
      d: "OSHA Part 1910 (solo aplica a safety laboral)"
    },
    correct: "a",
    explanation: "California adopta el UMC con amendments como CMC (Title 24 Part 4). El estado no usa IMC. El ciclo de adopción es cada 3 años (edición 2022 actual en uso).",
    reference: "California Building Standards Commission; Title 24 Part 4"
  },
  {
    id: "c20-117",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "Title 24 Part 6 se conoce como:",
    options: {
      a: "California Energy Code / Building Energy Standards",
      b: "California Fire Code (incendios y life-safety)",
      c: "CalGreen (sustainability parts Title 24 Part 11)",
      d: "California Plumbing Code (Title 24 Part 5)"
    },
    correct: "a",
    explanation: "Part 6 es el energy code con prescriptive y performance paths. Part 11 es CalGreen (sustainability). Part 4 es CMC.",
    reference: "Title 24 Part 6"
  },
  {
    id: "c20-118",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "ASHRAE 62.2 ventilation residencial pide aproximadamente:",
    options: {
      a: "7.5 CFM/persona + 3 CFM/100 ft² (Qtot fórmula)",
      b: "100 CFM fijos para toda la casa sin fórmula",
      c: "Sin ventilación mecánica en cualquier residencial",
      d: "500 CFM continuos siempre (fuera de rango real)"
    },
    correct: "a",
    explanation: "62.2-2019 fórmula Qtot = 0.03·CFA + 7.5·(Nbr+1). La versión CA adoptada exige mechanical ventilation para casas tight post-2013.",
    reference: "ASHRAE 62.2; Title 24 §150.0(o)"
  },
  {
    id: "c20-119",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Bathroom exhaust fan continuo mínimo según Title 24/ASHRAE 62.2:",
    options: {
      a: "20 CFM continuo o 50 CFM intermitente",
      b: "5 CFM continuo (insuficiente por norma)",
      c: "500 CFM continuo (muy arriba de norma)",
      d: "0 CFM (no se requiere fan en bathroom)"
    },
    correct: "a",
    explanation: "62.2 pide 20 CFM continuo o 50 CFM demand-controlled. HERS verifica fan watts y flow medido (CFM real en la grille).",
    reference: "ASHRAE 62.2 §5; Title 24 §150.0(o)"
  },
  {
    id: "c20-120",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "CalGreen requiere para casas nuevas que el HVAC:",
    options: {
      a: "Ducts tested, commissioning y Manual J/S/D documentados",
      b: "Sin requisitos adicionales; solo lo mínimo federal DOE",
      c: "Solo Manual J (sin equipment selection Manual S)",
      d: "Solo Manual S (sin residential load calc Manual J)"
    },
    correct: "a",
    explanation: "CalGreen Part 11 §4.507 pide HVAC diseñado por ACCA Manual J/S/D, installation verified por HERS. Duct testing mandatorio.",
    reference: "Title 24 Part 11 §4.507"
  },
  {
    id: "c20-121",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "Permits para HVAC en California son emitidos por:",
    options: {
      a: "La jurisdicción local (city/county building dept.)",
      b: "CSLB (licenses, pero no emite building permits)",
      c: "CEC (escribe Title 24 pero no emite permits)",
      d: "CARB (regula emissions, no emite building permit)"
    },
    correct: "a",
    explanation: "Permits son locales. CSLB licencia al contractor, CEC escribe Title 24, CARB regula emissions/refrigerants, pero el permit sale del AHJ (local building dept).",
    reference: "California Health & Safety §17922; CMC §104"
  },
  {
    id: "c20-122",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Para alterations residenciales (changeout) Title 24 generalmente exige:",
    options: {
      a: "Duct leakage test y refrigerant charge HERS verif",
      b: "Nada especial (cambiar equipo no dispara HERS)",
      c: "Solo un nuevo breaker en el panel eléctrico",
      d: "Solo un nuevo termostato programable sin HERS"
    },
    correct: "a",
    explanation: "Cambio de AC/heat pump/furnace que afecta ductos dispara HERS duct leakage y (en cooling) refrigerant charge verification. Hay exenciones limitadas para sistemas mínimos o zonas frías.",
    reference: "Title 24 §150.2(b); RA3"
  },
  {
    id: "c20-123",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Zona climática 13 (Fresno) tiene cooling design outdoor approx:",
    options: {
      a: "~101°F DB / 70°F WB (design 1% CEC)",
      b: "~85°F DB / 65°F WB (zona costera baja)",
      c: "~70°F DB / 60°F WB (fuera de rango CZ13)",
      d: "~110°F DB / 78°F WB (exagera el design)"
    },
    correct: "a",
    explanation: "CEC Climate Zone 13 incluye Fresno/Hanford. 1% cooling design ~101°F DB, 70°F WB. Heating 99% ~30°F DB. Critical para sizing y selection.",
    reference: "CEC Climate Zone Descriptions; Title 24"
  },
  {
    id: "c20-124",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "Un changeout de condenser con air handler existente (unmatched) requiere:",
    options: {
      a: "Verificar AHRI match y cumplir Title 24 efficiency",
      b: "Ninguna verificación de match si mismo refrigerante",
      c: "Cambiar breaker siempre (no es requisito match)",
      d: "Reemplazar toda la ductería sin más análisis"
    },
    correct: "a",
    explanation: "Title 24 y CSLB exigen combinaciones AHRI-rated. Matcheo incorrecto baja SEER nominal y pone en riesgo warranty. Sistemas unmatched a menudo no cumplen standards.",
    reference: "Title 24 §150.1; AHRI 210/240"
  },
  {
    id: "c20-125",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Clearance al condenser para service según CMC típico:",
    options: {
      a: "30 in working space al frente + clearances OEM",
      b: "0 in (pegado al muro sin espacio de servicio)",
      c: "10 ft al frente (fuera de proporción residencial)",
      d: "6 in al frente (insuficiente para service work)"
    },
    correct: "a",
    explanation: "CMC §303.7 exige 30 in x 30 in x 6 ft working space al frente, más clearances del OEM (coil airflow). Violación común cuando hay fencing o equipment cerca.",
    reference: "CMC §303.7; OEM install"
  },
  {
    id: "c20-126",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Un furnace ≥65,000 BTU/h requiere platform y walkway en attic por:",
    options: {
      a: "CMC §304.3 (walkway 24 in, luz, switch servicio)",
      b: "Solo es recomendación (nunca se exige en CA)",
      c: "NFPA 70 (aplica a eléctrico, no a walkway)",
      d: "Ninguna regla específica residencial actual CA"
    },
    correct: "a",
    explanation: "CMC §304.3: walkway 24 in wide y solid floor. §305: luz controlada con switch cerca del access, service receptacle 15A/120V dentro de 25 ft.",
    reference: "CMC §304; §305"
  },
  {
    id: "c20-127",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Commercial kitchen exhaust hood (type I) requiere según CMC:",
    options: {
      a: "Duct liquid-tight welded acero, clearances, makeup air",
      b: "Duct de aluminio con sellos tipo mastic industrial",
      c: "Duct de PVC schedule 40 (solo condensing Cat IV)",
      d: "Sin requisitos especiales en restaurant residencial"
    },
    correct: "a",
    explanation: "CMC §507 obliga acero 16 ga min, continuous welded, liquid-tight, clearances a combustible 18 in (reducibles con fire-rated wrap). Makeup air igual al exhaust.",
    reference: "CMC §507-510"
  },
  {
    id: "c20-128",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "Smoke/fire dampers en ductos se requieren en:",
    options: {
      a: "Penetraciones de fire-rated walls/floors (CBC §717)",
      b: "Cualquier ducto residencial sin importar separación",
      c: "Nunca (dampers no se exigen en CA building code)",
      d: "Solo en attic unconditioned (lugar incorrecto)"
    },
    correct: "a",
    explanation: "CBC §717 y CMC §605 especifican fire/smoke dampers donde el ducto cruza construcción fire-rated. Commercial y multifamily son los escenarios comunes.",
    reference: "CBC §717; CMC §605"
  },
  {
    id: "c20-129",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "AFUE mínimo de furnace residencial non-weatherized en CA:",
    options: {
      a: "80% federal; reach codes locales piden 90%+ gas",
      b: "60% (valor obsoleto pre-1992 federal DOE std)",
      c: "75% (valor intermedio no vigente en ningún código)",
      d: "100% (físicamente imposible en combustión gas)"
    },
    correct: "a",
    explanation: "Federal DOE mínimo 80% AFUE. CA Title 24 y reach codes locales (e.g. Berkeley, San José) empujan heat pumps o condensing >90%. Verificar reach code local.",
    reference: "DOE 10 CFR §430; Title 24 §150.0(g)"
  },
  {
    id: "c20-130",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "SEER2 mínimo federal para split AC en south/southwest region (incluye CA):",
    options: {
      a: "14.3 SEER2 (equivale ~15 SEER legacy rating)",
      b: "10.0 SEER legacy (regla anterior a 2006 DOE)",
      c: "25.0 SEER2 (fuera de rango mínimo split nuevo)",
      d: "8.0 SEER2 (muy bajo, no existe en regla actual)"
    },
    correct: "a",
    explanation: "DOE 2023 standards: south region split ≥14.3 SEER2 (equivale a ~14.5-15 SEER legacy). Heat pumps 14.3 SEER2 / 7.5 HSPF2 national.",
    reference: "DOE 10 CFR §430 (2023)"
  },
  {
    id: "c20-131",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "Residential new construction en CZ 12 (Sacramento) bajo Title 24 2022 típicamente requiere:",
    options: {
      a: "Heat pump o gas alta eficiencia, PV, vent mecánica",
      b: "Furnace 60% AFUE (obsoleto, no cumple DOE/CA)",
      c: "Sin ventilation mecánica (ASHRAE 62.2 obliga)",
      d: "Natural draft atmospheric (no cumple Title 24 2022)"
    },
    correct: "a",
    explanation: "Title 24 2022 empuja electrification: heat pump es baseline efficient, PV obligatorio, ventilation mecánica, ducts tested. Para gas, requiere alta efficiency.",
    reference: "Title 24 2022 §150.1; CEC Residential ACM"
  },
  {
    id: "c20-132",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "medium",
    question: "CSLB C-20 license cubre:",
    options: {
      a: "Warm-air heating, ventilating y AC con ductos/controles",
      b: "Solo refrigeración comercial (en realidad es C-38)",
      c: "Plomería residencial y commercial (en realidad C-36)",
      d: "Eléctrico general residencial (en realidad C-10)"
    },
    correct: "a",
    explanation: "B&P Code §7058 y CCR §832.20 definen C-20 como warm-air heating, ventilating, AC — ductos, controles, equipo. Refrigeración comercial es C-38. Plumbing es C-36.",
    reference: "B&P Code §7058; CCR Title 16 §832.20"
  },
  {
    id: "c20-133",
    category: "Códigos (CMC, UMC, Title 24)",
    difficulty: "easy",
    question: "Cap economic value sin license en CA para trabajo individual:",
    options: {
      a: "<$500 materiales+labor, con disclosure al cliente",
      b: "<$10,000 (muy arriba del límite legal real)",
      c: "<$1,000,000 (fuera de rango exemption CA)",
      d: "Cualquier monto (falso; hay cap de $500)"
    },
    correct: "a",
    explanation: "B&P §7048 exempta trabajos <$500 si incluye materials + labor y el cliente sabe que no hay license. No aplica cuando trabajo requiere permit.",
    reference: "B&P Code §7048"
  },

  // ============================================================
  // TROUBLESHOOTING — ~12% (17 preguntas)
  // ============================================================
  {
    id: "c20-134",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "AC no enfría. Gauges: suction 75 psig, discharge 250 psig (R-410A). Superheat 35°F. Diagnóstico más probable:",
    options: {
      a: "Undercharge severo (leak search antes de cargar)",
      b: "Overcharge (superheat bajo y subcool alto serían)",
      c: "Compressor quemado internamente sin compresión",
      d: "Termostato malo o con programación incorrecta"
    },
    correct: "a",
    explanation: "Presiones bajas y superheat alto = falta de refrigerante. 75 psig R-410A = ~22°F saturated, muy bajo. Antes de cargar: leak search obligatorio por EPA.",
    reference: "ACCA Manual SH; EPA 608"
  },
  {
    id: "c20-135",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Evaporator coil congelado. Causas comunes en orden de probabilidad:",
    options: {
      a: "Low airflow > low charge > termostato mal ajustado",
      b: "Overcharge de refrigerante siempre causa congelación",
      c: "Breaker tripped (apagaría todo; coil no congelaría)",
      d: "Fan motor del condenser malo (no causa freeze evap)"
    },
    correct: "a",
    explanation: "80% de frozen coils son airflow. Cambiar filter, checar blower speed, return sizing, dirty coil. Low charge también baja saturation pero es 2nd más común. Descongelar antes de diagnosticar.",
    reference: "ACCA Manual SH; NCI"
  },
  {
    id: "c20-136",
    category: "Troubleshooting",
    difficulty: "easy",
    question: "Compressor tripea overload después de 5 min. Amp clamp muestra 2× FLA. Causa probable:",
    options: {
      a: "Dirty condenser, fan malo, o sobrecarga de refrigerante",
      b: "Furnace mal configurado (no afecta al compressor AC)",
      c: "Termostato con batería baja (no causa amps altos)",
      d: "Filter-drier nuevo (reduce corriente, no la sube)"
    },
    correct: "a",
    explanation: "Amps alto = baja capacidad de rechazar calor. Dirty coil o fan lento suben head pressure y current. Overcharge también. Siempre medir delta T y head pressure.",
    reference: "EASA motor troubleshooting"
  },
  {
    id: "c20-137",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Furnace no enciende. 24V en R, 24V en W, pero no hay flama. Lo próximo a revisar:",
    options: {
      a: "Safety string: pressure, rollout, limit switch e igniter",
      b: "Capacitor del condenser (no aplica al furnace heat)",
      c: "Termostato en modo cooling (W energizado = heat call)",
      d: "Refrigerant charge (no tiene relación con ignition)"
    },
    correct: "a",
    explanation: "Si W llega al gas valve y no enciende, revisa la safety chain: pressure switch cerrado, limits OK, rollout OK, igniter energizando. Con multímetro en modo AC rastrea el 24V.",
    reference: "OEM service manuals; combustion flow"
  },
  {
    id: "c20-138",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Blower corre pero no hay aire en registers. Causa más probable:",
    options: {
      a: "Duct desconectado en attic o evap congelado bloqueando",
      b: "Compressor malo (no afecta air flow a los registers)",
      c: "Thermostat off (apagaría blower; aquí corre OK)",
      d: "Breaker tripped (apagaría blower; aquí corre OK)"
    },
    correct: "a",
    explanation: "Blower corre → poder eléctrico OK. Sin flow = obstrucción: flex colapsed, duct disconnected, coil congelado, filter completamente plugged. Inspeccionar físicamente.",
    reference: "Field diagnostics; ACCA QI"
  },
  {
    id: "c20-139",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "AC corre pero casa no enfría. Supply 58°F, return 78°F (ΔT=20°F). CFM adecuado. Diagnóstico:",
    options: {
      a: "Equipo OK — carga mayor a capacidad (envolvente)",
      b: "Low charge (ΔT 20°F indica carga correcta, no low)",
      c: "Undersized (posible, pero revisar insulation primero)",
      d: "Frozen coil (ΔT 20°F indica que no está congelada)"
    },
    correct: "a",
    explanation: "ΔT 20°F y airflow correcto indica equipment performance OK. Si no enfría la casa, es carga real excediendo capacidad: leak en envolvente, ductos sin insulation, sizing original malo.",
    reference: "ACCA Manual SH; Manual J"
  },
  {
    id: "c20-140",
    category: "Troubleshooting",
    difficulty: "hard",
    question: "Heat pump en cooling: suction 110 psig, discharge 500 psig outdoor 95°F. Superheat 5°F, subcool 25°F. Diagnóstico:",
    options: {
      a: "Overcharge significativo (subcool alto, superheat bajo)",
      b: "Undercharge (daría subcool bajo, no alto como aquí)",
      c: "Fan condenser OK (no explica head 500 psig subido)",
      d: "Operación normal (500 psig y subcool 25°F no son OK)"
    },
    correct: "a",
    explanation: "Subcool 25°F es alto (normal 10-15°F) y superheat 5°F es bajo — ambos indican exceso de refrigerante. Head alta (500 psig) también. Recuperar carga exceso.",
    reference: "ACCA Manual SH; OEM"
  },
  {
    id: "c20-141",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Un condenser hace ruido fuerte después de 2 años. Fan blade balanceado, motor OK. Causa posible:",
    options: {
      a: "Compressor interno: bearing, slug líquido o valves",
      b: "Solo airflow (airflow OK no causa ruido compressor)",
      c: "Disconnect suelto (no genera ruido mecánico fuerte)",
      d: "Capacitor bloated (haría run erratic, no ruido fuerte)"
    },
    correct: "a",
    explanation: "Ruido nuevo del compressor indica problema interno: liquid slugging al startup, válvulas rotas, rodamiento. Amp clamp y suction superheat ayudan diagnosticar. Reemplazo muchas veces.",
    reference: "EASA compressor troubleshooting"
  },
  {
    id: "c20-142",
    category: "Troubleshooting",
    difficulty: "easy",
    question: "Thermostat no energiza. Primer check:",
    options: {
      a: "24V entre R y C en sub-base; fuse 3A del control board",
      b: "Condenser breaker (no aplica; thermostat es 24V class 2)",
      c: "Gas valve (sin 24V de thermostat no se activa el valve)",
      d: "Filter (filter sucio no afecta la energía del thermostat)"
    },
    correct: "a",
    explanation: "Sin 24V no funciona nada. Medir R-C. Si no hay, revisar transformer secondary, fuse del board (3-5A), y wiring. Doorbell transformer del thermostat a veces está mal.",
    reference: "OEM furnace manuals; control diagrams"
  },
  {
    id: "c20-143",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Sistema short-cycles cada 2 min. Posibles causas:",
    options: {
      a: "Oversizing, low-pressure cut-out, flame sensor, tstat",
      b: "Sistema sobredimensionado (válido, pero hay más causas)",
      c: "Thermostat con anticipator mal ajustado (legacy only)",
      d: "Todas las anteriores (cualquiera puede causar cycling)"
    },
    correct: "d",
    explanation: "Short cycling viene de muchos ángulos: equipo muy grande (no debe pasar), safeties tripping, flame sensor contaminado (ignition lockouts), thermostat mal calibrado. Diagnosticar por cuando apaga.",
    reference: "Manual SH; OEM"
  },
  {
    id: "c20-144",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Delta T en cooling de 25°F con airflow correcto sugiere:",
    options: {
      a: "Low airflow local (filter) o evap empezando a congelar",
      b: "Operación normal (ΔT normal es 16-22°F, 25°F es alto)",
      c: "Overcharge (daría ΔT bajo, no alto como el caso)",
      d: "Leak (leak baja charge y reduce ΔT, no lo sube)"
    },
    correct: "a",
    explanation: "ΔT normal AC 16-22°F. 25°F muy alto = airflow bajo (filter obstruido, blower speed baja, evap congelando). Empieza a congelar si baja mucho la saturation del evaporator.",
    reference: "ACCA Manual SH; NCI airflow"
  },
  {
    id: "c20-145",
    category: "Troubleshooting",
    difficulty: "hard",
    question: "Un furnace cicla en safety limit repetidamente. Flue temp 650°F, return 70°F, supply 180°F, airflow medido 800 CFM en sistema 80k BTU/h. Problem:",
    options: {
      a: "Temperature rise 110°F (normal 40-70°F); airflow bajo",
      b: "Operación normal (rise 110°F está fuera de OEM spec)",
      c: "Return too cold (70°F es estándar return temp usual)",
      d: "Flue normal (flue 650°F es alto, pero rise es el issue)"
    },
    correct: "a",
    explanation: "Rise = 180-70 = 110°F, muy arriba del range 40-70°F que indica el nameplate. Airflow bajo sobrecalenta el heat exchanger → limit trip. Subir blower speed y/o revisar ductos.",
    reference: "OEM rise table; ACCA QI"
  },
  {
    id: "c20-146",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Compressor con alta temperatura de line de descarga (>225°F R-410A) indica:",
    options: {
      a: "Bajo refrigerante, alta head o compressor failure interno",
      b: "Operación normal (>225°F está arriba de rango safe)",
      c: "Overcharge severo (daría discharge baja, no alta)",
      d: "Low voltage único problema (también causa, pero no único)"
    },
    correct: "a",
    explanation: "Discharge line normal <200-220°F. Arriba de eso: refrigerante bajo (poor cooling del compressor), dirty condenser (head alta), o mechanical failure. Sobre 250°F breakdown del oil POE.",
    reference: "ASHRAE Handbook; OEM compressor specs"
  },
  {
    id: "c20-147",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Alta humedad indoor (65% RH) con AC corriendo normal. Causa más probable:",
    options: {
      a: "Oversizing (short cycle, no remueve latente), fan on",
      b: "Undersizing (correría continuo y removería más humedad)",
      c: "Filter nuevo (filter nuevo mejora flow, no sube humedad)",
      d: "Termostato digital (tipo tstat no causa humedad alta)"
    },
    correct: "a",
    explanation: "Oversized AC cools rápido pero no corre lo suficiente para remover humedad. Fan 'on' evapora condensado de la coil back al space. Fix: fan auto, sizing correcto, variable speed blower.",
    reference: "ACCA Manual J; Title 24"
  },
  {
    id: "c20-148",
    category: "Troubleshooting",
    difficulty: "medium",
    question: "Condenser fan no gira pero compressor corre 30s y tripea overload. Primer paso:",
    options: {
      a: "Checar capacitor del fan (bloated/open) y voltaje al motor",
      b: "Reemplazar el compressor (overkill sin diagnóstico)",
      c: "Cambiar refrigerante (no relacionado con fan parado)",
      d: "Revisar furnace (no relacionado con fan del condenser)"
    },
    correct: "a",
    explanation: "Cap bloated/open es cause #1 de fan no spinning. Verificar uF con meter (vs nameplate). Si cap OK, medir voltage al motor y probar motor. Sin fan, head pressure mata compressor rápido.",
    reference: "EASA motor; OEM service"
  },
  {
    id: "c20-149",
    category: "Troubleshooting",
    difficulty: "easy",
    question: "Heat pump en defrost cycle: qué síntomas esperas:",
    options: {
      a: "Reversing valve cambia, outdoor fan off, strip heat, steam",
      b: "Sistema apagado totalmente durante el defrost cycle",
      c: "Solo outdoor fan encendido (compressor off en defrost)",
      d: "Compressor off (en realidad corre en cooling durante def)"
    },
    correct: "a",
    explanation: "Defrost: reversing valve a cooling mode, outdoor fan stops (para subir temp coil), strip heat energiza para tempering supply, el condenser outdoor calienta y derrite frost → steam visible.",
    reference: "OEM heat pump sequence; ACCA Manual H"
  },
  {
    id: "c20-150",
    category: "Troubleshooting",
    difficulty: "hard",
    question: "Comercial RTU 10-ton con economizer no entra en economizer a 60°F outdoor y 75°F return. Posible causa (modo cooling call):",
    options: {
      a: "Sensor OA fault, setpoint mal, o damper actuator atascado",
      b: "Sistema normal (60°F y 75°F sí cumplen criterio economiz)",
      c: "Refrigerant charge (no afecta operación del economizer)",
      d: "Compressor pequeño (irrelevante para damper economizer)"
    },
    correct: "a",
    explanation: "A 60°F OAT vs 75°F return, economizer debería abrir (diferencia >2°F enthalpy/dry bulb). Check sensor calibration, controller setpoint (<65°F CA Title 24), linkage del damper, actuator 24V.",
    reference: "Title 24 §120.2; ASHRAE 90.1; OEM economizer guide"
  }
];
