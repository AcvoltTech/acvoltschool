// ============================================
// DESAFÍO MAESTROAC — CORRIDA 1 "APRENDIZ"
// 750 preguntas 100% nuevas y capciosas
// ============================================

var DESAFIO_C1 = {

// ─── NIVEL 1: Instrumentos, Mediciones, Teoría del Calor y Seguridad (50 preguntas) ───
nivel1: [
  // Instrumentos de medición variados — CÓMO se usan
  {
    category: "Instrumentos",
    q: "¿Cuál es la diferencia entre el manómetro compuesto (azul) y el manómetro de presión (rojo) en un manifold?",
    options: ["El azul mide solo presión positiva y el rojo mide solo vacío", "El azul mide presión y vacío, el rojo solo mide presión positiva", "El azul mide temperatura y el rojo mide presión del sistema", "El rojo mide presión y vacío, el azul solo mide presión positiva"],
    correct: 1,
    explanation: "El compound gauge (azul) lee presión Y vacío (retro de 0). El rojo solo lee presión positiva alta."
  ,
    question_en: "What is the difference between the compound gauge (blue) and the pressure gauge (red) on a manifold?",
    options_en: ["The blue measures only positive pressure and the red measures only vacuum", "The blue measures pressure and vacuum, the red only measures positive pressure", "The blue measures temperature and the red measures system pressure", "The red measures pressure and vacuum, the blue only measures positive pressure"],
    explanation_en: "The compound gauge (blue) reads both pressure AND vacuum (below 0). The red gauge only reads positive high pressure."
  },
  {
    category: "Instrumentos",
    q: "Para medir la corriente de un compresor SIN desconectar cables, ¿qué instrumento se usa?",
    options: ["Multímetro digital con puntas en serie al circuito", "Amperímetro de gancho (clamp meter) alrededor del cable", "Megóhmetro de aislamiento con puntas en los terminales", "Osciloscopio con sonda de corriente capacitiva conectada"],
    correct: 1,
    explanation: "El clamp meter mide corriente por inducción electromagnética rodeando UN solo conductor sin desconectar."
  ,
    question_en: "To measure the current of a compressor WITHOUT disconnecting wires, what instrument is used?",
    options_en: ["Digital multimeter with probes in series with the circuit", "Clamp meter (clamp-on ammeter) around the cable", "Insulation megohmmeter with probes on the terminals", "Oscilloscope with capacitive current probe connected"],
    explanation_en: "The clamp meter measures current by electromagnetic induction around ONE single conductor without disconnecting."
  },
  {
    category: "Instrumentos",
    q: "Al usar un multímetro para medir voltaje AC en un circuito de 240V, ¿cómo se conectan las puntas?",
    options: ["Las dos puntas en el mismo cable de línea L1 lado", "Una punta en L1 y la otra en L2 en paralelo al circuito", "Las dos puntas en serie con la carga del motor compresor", "Una punta en el cable y la otra flotando sin conexión"],
    correct: 1,
    explanation: "Voltaje se mide en PARALELO — una punta en cada línea (L1 y L2) para leer la diferencia de potencial."
  ,
    question_en: "When using a multimeter to measure AC voltage on a 240V circuit, how are the probes connected?",
    options_en: ["Both probes on the same line cable L1 side", "One probe on L1 and the other on L2 in parallel with the circuit", "Both probes in series with the compressor motor load", "One probe on the cable and the other floating with no connection"],
    explanation_en: "Voltage is measured in PARALLEL — one probe on each line (L1 and L2) to read the potential difference."
  },
  {
    category: "Instrumentos",
    q: "¿Cuál es la diferencia entre medir resistencia (ohmios) y medir continuidad en un multímetro?",
    options: ["No hay diferencia, ambos miden exactamente lo mismo siempre", "Continuidad solo da tono audible, resistencia da valor numérico", "Resistencia solo funciona en AC y continuidad solo en DC", "Continuidad mide voltaje y resistencia mide corriente flujo"],
    correct: 1,
    explanation: "Continuidad emite un tono si la resistencia es cercana a 0Ω (circuito cerrado). Ohmios da el valor exacto."
  ,
    question_en: "What is the difference between measuring resistance (ohms) and measuring continuity on a multimeter?",
    options_en: ["There is no difference, both measure exactly the same thing always", "Continuity only gives an audible tone, resistance gives a numeric value", "Resistance only works in AC and continuity only in DC", "Continuity measures voltage and resistance measures current flow"],
    explanation_en: "Continuity emits a tone if resistance is close to 0 ohms (closed circuit). Ohms gives the exact value."
  },
  {
    category: "Instrumentos",
    q: "¿Por qué un multímetro True RMS da lecturas más precisas que uno promediador en un motor con VFD?",
    options: ["Porque True RMS cuesta más dinero y tiene mejor pantalla", "Porque True RMS calcula la raíz cuadrada media de ondas distorsionadas", "Porque True RMS solo funciona en corriente directa DC perfecta", "Porque True RMS mide frecuencia y voltaje al mismo tiempo exacto"],
    correct: 1,
    explanation: "Los VFD producen ondas no sinusoidales. True RMS calcula con precisión mientras un promediador se equivoca hasta 40%."
  ,
    question_en: "Why does a True RMS multimeter give more accurate readings than an averaging one on a motor with VFD?",
    options_en: ["Because True RMS costs more money and has a better display", "Because True RMS calculates the root mean square of distorted waveforms", "Because True RMS only works on perfect DC direct current", "Because True RMS measures frequency and voltage at the exact same time"],
    explanation_en: "VFDs produce non-sinusoidal waveforms. True RMS calculates accurately while an averaging meter can be off by up to 40%."
  },
  {
    category: "Instrumentos",
    q: "¿Qué mide un megóhmetro (Megger) que un multímetro estándar NO puede medir?",
    options: ["La corriente de arranque del motor del compresor grande", "La resistencia de aislamiento de devanados a voltaje alto", "La capacitancia de un capacitor de arranque en microfaradios", "La frecuencia de la señal eléctrica en hertz del circuito"],
    correct: 1,
    explanation: "El Megger aplica 500-1000V para medir resistencia de aislamiento en megaohmios — busca fugas a tierra en devanados."
  ,
    question_en: "What does a megohmmeter (Megger) measure that a standard multimeter CANNOT measure?",
    options_en: ["The starting current of the large compressor motor", "The insulation resistance of windings at high voltage", "The capacitance of a start capacitor in microfarads", "The frequency of the electrical signal in hertz of the circuit"],
    explanation_en: "The Megger applies 500-1000V to measure insulation resistance in megohms — it looks for ground faults in windings."
  },
  {
    category: "Instrumentos",
    q: "Un técnico mide 0 voltios entre L1 y L2 en el disconnect de la condensadora. ¿Qué concluye?",
    options: ["El circuito tiene voltaje normal y el medidor está malo", "No hay voltaje — el breaker está abierto o el cable cortado", "El voltaje es demasiado bajo para que el medidor lo detecte", "Debe cambiar a modo de corriente AC para leer correctamente"],
    correct: 1,
    explanation: "0V entre L1 y L2 = no hay energía. Verificar breaker principal, fusibles y cableado."
  ,
    question_en: "A technician measures 0 volts between L1 and L2 at the condenser disconnect. What does he conclude?",
    options_en: ["The circuit has normal voltage and the meter is bad", "There is no voltage — the breaker is open or the wire is cut", "The voltage is too low for the meter to detect it", "He should switch to AC current mode to read correctly"],
    explanation_en: "0V between L1 and L2 = no power. Check the main breaker, fuses, and wiring."
  },
  {
    category: "Instrumentos",
    q: "¿Para qué sirve la función de capacitancia (μF) en un multímetro al diagnosticar HVAC?",
    options: ["Para medir el voltaje almacenado en el capacitor cargado", "Para verificar si el capacitor de marcha está dentro de rango", "Para medir la corriente que consume el capacitor al arrancar", "Para determinar la velocidad de rotación del motor eléctrico"],
    correct: 1,
    explanation: "Se mide μF para verificar que el capacitor está dentro de su tolerancia (±6%). Fuera de rango = reemplazar."
  ,
    question_en: "What is the capacitance (uF) function on a multimeter used for when diagnosing HVAC?",
    options_en: ["To measure the voltage stored in the charged capacitor", "To verify if the run capacitor is within range", "To measure the current the capacitor draws at startup", "To determine the rotation speed of the electric motor"],
    explanation_en: "Microfarads are measured to verify the capacitor is within its tolerance (+/-6%). Out of range = replace."
  },
  {
    category: "Instrumentos",
    q: "¿Qué indica la lectura 'OL' en un multímetro cuando está en modo de resistencia (ohmios)?",
    options: ["Overload — hay demasiada corriente y puede dañar el medidor", "Over Limit — circuito abierto o resistencia infinita sin conexión", "Online — el medidor está conectado a Bluetooth correctamente", "Optimal Level — la resistencia está en el rango perfecto ideal"],
    correct: 1,
    explanation: "OL en ohmios = circuito abierto. No hay continuidad entre las puntas — cable roto o devanado abierto."
  ,
    question_en: "What does the 'OL' reading on a multimeter indicate when in resistance (ohms) mode?",
    options_en: ["Overload — there is too much current and may damage the meter", "Over Limit — open circuit or infinite resistance with no connection", "Online — the meter is connected to Bluetooth correctly", "Optimal Level — the resistance is in the perfect ideal range"],
    explanation_en: "OL in ohms = open circuit. There is no continuity between the probes — broken wire or open winding."
  },
  {
    category: "Instrumentos",
    q: "¿Por qué NUNCA debes medir resistencia en un circuito que está energizado con voltaje?",
    options: ["Porque la lectura de resistencia será más precisa con energía", "Porque puedes quemar el fusible del medidor o dañarlo seriamente", "Porque la resistencia solo se mide en circuitos de corriente DC", "Porque el circuito energizado aumenta la resistencia artificialmente"],
    correct: 1,
    explanation: "Medir ohmios con voltaje presente puede destruir el circuito interno del medidor. Siempre des-energizar primero."
  ,
    question_en: "Why should you NEVER measure resistance on an energized circuit with voltage?",
    options_en: ["Because the resistance reading will be more accurate with power", "Because you can blow the meter fuse or seriously damage it", "Because resistance can only be measured on DC current circuits", "Because the energized circuit artificially increases resistance"],
    explanation_en: "Measuring ohms with voltage present can destroy the meter's internal circuitry. Always de-energize first."
  },
  {
    category: "Instrumentos",
    q: "Al medir la presión de succión con el manifold, ¿a qué puerto de la condensadora se conecta la manguera azul?",
    options: ["Al puerto de servicio de la línea de líquido pequeña", "Al puerto de servicio de la línea de succión grande", "Al puerto de descarga del compresor directamente", "Al puerto del filtro secador en la línea de líquido"],
    correct: 1,
    explanation: "Manguera azul (baja) = puerto de succión (tubo grande). Manguera roja (alta) = puerto de líquido o descarga."
  ,
    question_en: "When measuring suction pressure with the manifold, to which port on the condenser is the blue hose connected?",
    options_en: ["To the service port on the small liquid line", "To the service port on the large suction line", "To the compressor discharge port directly", "To the filter drier port on the liquid line"],
    explanation_en: "Blue hose (low side) = suction port (large tube). Red hose (high side) = liquid port or discharge."
  },
  {
    category: "Instrumentos",
    q: "¿Qué instrumento digital reemplaza al manifold análogo y permite medir presiones con más precisión?",
    options: ["Termómetro infrarrojo digital sin contacto portátil", "Manifold digital con transductores de presión electrónicos", "Anemómetro de hilo caliente para medir flujo de aire CFM", "Detector ultrasónico de fugas por frecuencia de sonido"],
    correct: 1,
    explanation: "Los manifolds digitales (como Fieldpiece SMAN o Testo) usan transductores electrónicos con resolución de 0.1 psi."
  ,
    question_en: "What digital instrument replaces the analog manifold and allows measuring pressures with more precision?",
    options_en: ["Portable non-contact digital infrared thermometer", "Digital manifold with electronic pressure transducers", "Hot-wire anemometer for measuring airflow in CFM", "Ultrasonic leak detector by sound frequency"],
    explanation_en: "Digital manifolds (like Fieldpiece SMAN or Testo) use electronic transducers with 0.1 psi resolution."
  },
  {
    category: "Instrumentos",
    q: "¿Cómo se usa un termómetro infrarrojo correctamente para medir temperatura en una tubería de cobre?",
    options: ["Se apunta a cualquier distancia, la lectura es siempre igual", "Se apunta de cerca perpendicular a la superficie ajustando emisividad", "Se coloca en contacto directo con la tubería por 10 segundos", "Se apunta al aire alrededor de la tubería para medir ambiente"],
    correct: 1,
    explanation: "El IR se apunta de cerca y perpendicular. En cobre pulido se debe ajustar emisividad (~0.07) o usar cinta eléctrica."
  ,
    question_en: "How is an infrared thermometer correctly used to measure temperature on a copper pipe?",
    options_en: ["Aim from any distance, the reading is always the same", "Aim close and perpendicular to the surface, adjusting emissivity", "Place in direct contact with the pipe for 10 seconds", "Aim at the air around the pipe to measure ambient"],
    explanation_en: "The IR is aimed close and perpendicular. On polished copper, emissivity must be adjusted (~0.07) or use electrical tape."
  },
  {
    category: "Instrumentos",
    q: "¿Por qué un termómetro de contacto tipo K (pipe clamp) es más confiable que un infrarrojo en tuberías?",
    options: ["Porque el infrarrojo es más caro y menos preciso siempre", "Porque el contacto no se afecta por emisividad ni reflejos metal", "Porque el infrarrojo no funciona en temperaturas bajo cero grados", "Porque el contacto mide presión y temperatura al mismo tiempo"],
    correct: 1,
    explanation: "Las superficies metálicas pulidas reflejan IR dando lecturas falsas. El termopar de contacto lee directamente."
  ,
    question_en: "Why is a type K contact thermometer (pipe clamp) more reliable than an infrared on pipes?",
    options_en: ["Because the infrared is more expensive and always less accurate", "Because the contact type is not affected by emissivity or metal reflections", "Because the infrared does not work at temperatures below zero degrees", "Because the contact type measures pressure and temperature at the same time"],
    explanation_en: "Polished metal surfaces reflect IR giving false readings. The contact thermocouple reads directly."
  },
  {
    category: "Instrumentos",
    q: "¿Qué mide un psicrómetro y para qué lo usa un técnico HVAC?",
    options: ["Mide la presión del refrigerante en el lado de alta del sistema", "Mide la temperatura de bulbo seco y húmedo para calcular humedad", "Mide la velocidad del aire en los ductos de suministro en CFM", "Mide el nivel de monóxido de carbono en los gases de combustión"],
    correct: 1,
    explanation: "El psicrómetro mide bulbo seco y húmedo para calcular humedad relativa, punto de rocío y entalpía."
  ,
    question_en: "What does a psychrometer measure and why does an HVAC technician use it?",
    options_en: ["Measures the refrigerant pressure on the high side of the system", "Measures dry bulb and wet bulb temperature to calculate humidity", "Measures the air velocity in the supply ducts in CFM", "Measures the carbon monoxide level in combustion gases"],
    explanation_en: "The psychrometer measures dry bulb and wet bulb to calculate relative humidity, dew point, and enthalpy."
  },
  // Flexómetro y medidas
  {
    category: "Mediciones",
    q: "En un flexómetro estándar, ¿cuántos dieciseisavos (1/16) hay en una pulgada completa?",
    options: ["08 marcas de dieciseisavos en una pulgada completa", "12 marcas de dieciseisavos en una pulgada completa", "16 marcas de dieciseisavos en una pulgada completa", "32 marcas de dieciseisavos en una pulgada completa"],
    correct: 2,
    explanation: "Una pulgada se divide en 16 partes iguales (1/16\"). 8/16 = 1/2\", 4/16 = 1/4\", etc."
  ,
    question_en: "On a standard tape measure, how many sixteenths (1/16) are in one full inch?",
    options_en: ["08 sixteenth marks in one full inch", "12 sixteenth marks in one full inch", "16 sixteenth marks in one full inch", "32 sixteenth marks in one full inch"],
    explanation_en: "One inch is divided into 16 equal parts (1/16\"). 8/16 = 1/2\", 4/16 = 1/4\", etc."
  },
  {
    category: "Mediciones",
    q: "¿A cuántas pulgadas equivale la medida de 3/4 de pulgada en el flexómetro?",
    options: ["Equivale a 8/16 de pulgada o la marca entre 1/2 y 1 entera", "Equivale a 12/16 de pulgada o tres marcas antes de 1 entera", "Equivale a 4/16 de pulgada o la primera marca grande visible", "Equivale a 14/16 de pulgada o casi una pulgada completa"],
    correct: 1,
    explanation: "3/4\" = 12/16\". En el flexómetro es la tercera marca grande, tres cuartos del camino a la siguiente pulgada."
  ,
    question_en: "How many inches does the measurement of 3/4 of an inch equal on the tape measure?",
    options_en: ["Equals 8/16 of an inch or the mark between 1/2 and 1 full", "Equals 12/16 of an inch or three marks before 1 full", "Equals 4/16 of an inch or the first large visible mark", "Equals 14/16 of an inch or almost one complete inch"],
    explanation_en: "3/4\" = 12/16\". On the tape measure it is the third large mark, three-quarters of the way to the next inch."
  },
  {
    category: "Mediciones",
    q: "Un técnico necesita medir 18 5/8 pulgadas de tubo de cobre. ¿Dónde cae esa medida en el flexómetro?",
    options: ["En la marca de 18 pulgadas con 4/16 adicionales del borde", "En la marca de 18 pulgadas con 10/16 adicionales del borde", "En la marca de 18 pulgadas con 8/16 adicionales del borde", "En la marca de 18 pulgadas con 12/16 adicionales del borde"],
    correct: 1,
    explanation: "5/8\" = 10/16\". Es la marca que está entre 1/2\" (8/16) y 3/4\" (12/16) después de la marca 18."
  ,
    question_en: "A technician needs to measure 18 5/8 inches of copper tube. Where does that measurement fall on the tape measure?",
    options_en: ["At the 18-inch mark with 4/16 additional from the edge", "At the 18-inch mark with 10/16 additional from the edge", "At the 18-inch mark with 8/16 additional from the edge", "At the 18-inch mark with 12/16 additional from the edge"],
    explanation_en: "5/8\" = 10/16\". It is the mark between 1/2\" (8/16) and 3/4\" (12/16) after the 18-inch mark."
  },
  {
    category: "Mediciones",
    q: "¿Por qué el gancho metálico del flexómetro se mueve ligeramente hacia dentro y fuera?",
    options: ["Porque está roto y necesita reparación o reemplazo nuevo", "Para compensar su propio grosor en medidas internas y externas", "Porque el fabricante lo diseñó flojo para que sea más flexible", "Para que sea más fácil engancharlo en superficies redondas"],
    correct: 1,
    explanation: "El gancho se mueve exactamente su grosor: se jala para medidas externas, se empuja para internas. Así siempre es preciso."
  ,
    question_en: "Why does the metal hook on a tape measure move slightly in and out?",
    options_en: ["Because it is broken and needs repair or new replacement", "To compensate for its own thickness in inside and outside measurements", "Because the manufacturer designed it loose to be more flexible", "To make it easier to hook onto round surfaces"],
    explanation_en: "The hook moves exactly its thickness: it pulls out for outside measurements, pushes in for inside measurements. This ensures it is always accurate."
  },
  {
    category: "Mediciones",
    q: "¿Cuántos pies tiene una medida de 54 pulgadas de largo en total?",
    options: ["3 pies y 6 pulgadas de largo equivalente total", "4 pies y 6 pulgadas de largo equivalente total", "4 pies y 2 pulgadas de largo equivalente total", "5 pies y 4 pulgadas de largo equivalente total"],
    correct: 1,
    explanation: "54 ÷ 12 = 4 pies con 6 pulgadas sobrantes. 4 × 12 = 48, y 54 - 48 = 6."
  ,
    question_en: "How many feet does a measurement of 54 inches total?",
    options_en: ["3 feet and 6 inches total equivalent length", "4 feet and 6 inches total equivalent length", "4 feet and 2 inches total equivalent length", "5 feet and 4 inches total equivalent length"],
    explanation_en: "54 / 12 = 4 feet with 6 inches remaining. 4 x 12 = 48, and 54 - 48 = 6."
  },
  // Teoría del calor, calor y materia, leyes de los gases
  {
    category: "Teoría del Calor",
    q: "¿Cuáles son las tres formas en que el calor se transfiere de un lugar a otro?",
    options: ["Evaporación, condensación y compresión del refrigerante", "Conducción, convección y radiación de energía térmica", "Presión, temperatura y volumen de un gas ideal cerrado", "Fusión, ebullición y sublimación de la materia sólida"],
    correct: 1,
    explanation: "Conducción (contacto), convección (movimiento de fluido), radiación (ondas electromagnéticas)."
  ,
    question_en: "What are the three ways heat transfers from one place to another?",
    options_en: ["Evaporation, condensation, and compression of the refrigerant", "Conduction, convection, and radiation of thermal energy", "Pressure, temperature, and volume of a closed ideal gas", "Melting, boiling, and sublimation of solid matter"],
    explanation_en: "Conduction (contact), convection (fluid movement), radiation (electromagnetic waves)."
  },
  {
    category: "Teoría del Calor",
    q: "¿Qué es la conducción térmica y cuál es un ejemplo en HVAC?",
    options: ["Calor moviéndose por movimiento de aire circulante en ductos", "Calor transfiriéndose por contacto directo entre materiales sólidos", "Calor viajando por ondas electromagnéticas desde el sol al techo", "Calor generado por la compresión del refrigerante en el compresor"],
    correct: 1,
    explanation: "Conducción = calor a través de sólidos por contacto. Ejemplo: calor pasando del refrigerante al tubo de cobre."
  ,
    question_en: "What is thermal conduction and what is an example in HVAC?",
    options_en: ["Heat moving by circulating air movement in ducts", "Heat transferring by direct contact between solid materials", "Heat traveling by electromagnetic waves from the sun to the roof", "Heat generated by compression of refrigerant in the compressor"],
    explanation_en: "Conduction = heat through solids by contact. Example: heat passing from refrigerant to the copper tube."
  },
  {
    category: "Teoría del Calor",
    q: "¿Qué es el calor latente y por qué es importante en refrigeración?",
    options: ["El calor que cambia la temperatura de un material sólido", "El calor que cambia el estado sin cambiar la temperatura del gas", "El calor que se pierde al ambiente por las paredes del ducto", "El calor que genera el motor del compresor por fricción interna"],
    correct: 1,
    explanation: "Calor latente = energía para cambiar de estado (líquido→gas). Es lo que permite al refrigerante absorber MUCHO calor."
  ,
    question_en: "What is latent heat and why is it important in refrigeration?",
    options_en: ["The heat that changes the temperature of a solid material", "The heat that changes state without changing the temperature of the gas", "The heat lost to the environment through duct walls", "The heat generated by the compressor motor through internal friction"],
    explanation_en: "Latent heat = energy to change state (liquid to gas). This is what allows refrigerant to absorb a LOT of heat."
  },
  {
    category: "Teoría del Calor",
    q: "¿Cuál es la diferencia entre calor sensible y calor latente?",
    options: ["Sensible se siente con la mano, latente no se puede sentir", "Sensible cambia temperatura medible, latente cambia estado físico", "Sensible es calor del sol, latente es calor del refrigerante gas", "No hay diferencia real, son dos nombres para lo mismo exacto"],
    correct: 1,
    explanation: "Sensible = cambia temperatura (se mide con termómetro). Latente = cambia estado (líquido↔gas) a temperatura constante."
  ,
    question_en: "What is the difference between sensible heat and latent heat?",
    options_en: ["Sensible can be felt by hand, latent cannot be felt", "Sensible changes measurable temperature, latent changes physical state", "Sensible is heat from the sun, latent is heat from gas refrigerant", "There is no real difference, they are two names for the exact same thing"],
    explanation_en: "Sensible = changes temperature (measured with a thermometer). Latent = changes state (liquid to gas) at constant temperature."
  },
  {
    category: "Teoría del Calor",
    q: "¿Cuántas BTU se necesitan para elevar 1 libra de agua en 1 grado Fahrenheit?",
    options: ["0.5 BTU por libra por grado Fahrenheit de temperatura", "1.0 BTU por libra por grado Fahrenheit de temperatura", "2.0 BTU por libra por grado Fahrenheit de temperatura", "5.0 BTU por libra por grado Fahrenheit de temperatura"],
    correct: 1,
    explanation: "1 BTU = energía para elevar 1 libra de agua 1°F. Es la unidad fundamental de calor en HVAC."
  ,
    question_en: "How many BTUs are needed to raise 1 pound of water by 1 degree Fahrenheit?",
    options_en: ["0.5 BTU per pound per degree Fahrenheit of temperature", "1.0 BTU per pound per degree Fahrenheit of temperature", "2.0 BTU per pound per degree Fahrenheit of temperature", "5.0 BTU per pound per degree Fahrenheit of temperature"],
    explanation_en: "1 BTU = the energy to raise 1 pound of water by 1 degree F. It is the fundamental unit of heat in HVAC."
  },
  {
    category: "Teoría del Calor",
    q: "¿Cuántas BTU de calor latente se necesitan para evaporar 1 libra de agua a 212°F?",
    options: ["0,180 BTU de calor latente por libra de agua evaporada", "0,540 BTU de calor latente por libra de agua evaporada", "0,970 BTU de calor latente por libra de agua evaporada", "1,200 BTU de calor latente por libra de agua evaporada"],
    correct: 2,
    explanation: "Se necesitan 970 BTU para evaporar 1 libra de agua a 212°F. Esa es la enorme capacidad del calor latente."
  ,
    question_en: "How many BTUs of latent heat are needed to evaporate 1 pound of water at 212 degrees F?",
    options_en: ["180 BTU of latent heat per pound of water evaporated", "540 BTU of latent heat per pound of water evaporated", "970 BTU of latent heat per pound of water evaporated", "1,200 BTU of latent heat per pound of water evaporated"],
    explanation_en: "It takes 970 BTU to evaporate 1 pound of water at 212 degrees F. That is the enormous capacity of latent heat."
  },
  {
    category: "Teoría del Calor",
    q: "¿A qué temperatura hierve el agua al nivel del mar en grados Fahrenheit?",
    options: ["100 grados Fahrenheit al nivel del mar estándar", "180 grados Fahrenheit al nivel del mar estándar", "212 grados Fahrenheit al nivel del mar estándar", "250 grados Fahrenheit al nivel del mar estándar"],
    correct: 2,
    explanation: "El agua hierve a 212°F (100°C) al nivel del mar a presión atmosférica de 14.7 psi."
  ,
    question_en: "At what temperature does water boil at sea level in degrees Fahrenheit?",
    options_en: ["100 degrees Fahrenheit at standard sea level", "180 degrees Fahrenheit at standard sea level", "212 degrees Fahrenheit at standard sea level", "250 degrees Fahrenheit at standard sea level"],
    explanation_en: "Water boils at 212 degrees F (100 degrees C) at sea level at atmospheric pressure of 14.7 psi."
  },
  {
    category: "Leyes de los Gases",
    q: "Según la Ley de Boyle, si la presión de un gas se duplica y la temperatura no cambia, el volumen:",
    options: ["Se duplica proporcionalmente a la presión nueva del gas", "Se reduce a la mitad inversamente proporcional a presión", "Permanece igual sin cambio alguno por la presión nueva", "Se reduce a un cuarto del volumen original del gas frío"],
    correct: 1,
    explanation: "Ley de Boyle: P₁V₁ = P₂V₂ (a temp constante). Doble presión = mitad de volumen."
  ,
    question_en: "According to Boyle's Law, if the pressure of a gas doubles and the temperature stays the same, the volume:",
    options_en: ["Doubles proportionally to the new gas pressure", "Is reduced to half, inversely proportional to pressure", "Remains the same with no change from the new pressure", "Is reduced to one quarter of the original cold gas volume"],
    explanation_en: "Boyle's Law: P1V1 = P2V2 (at constant temp). Double pressure = half the volume."
  },
  {
    category: "Leyes de los Gases",
    q: "Según la Ley de Charles, si la temperatura de un gas aumenta y la presión no cambia, el volumen:",
    options: ["Disminuye proporcionalmente a la temperatura del gas frío", "Aumenta proporcionalmente a la temperatura del gas caliente", "Permanece igual sin importar el cambio de temperatura total", "Se duplica solo si la temperatura aumenta exactamente al doble"],
    correct: 1,
    explanation: "Ley de Charles: V₁/T₁ = V₂/T₂ (a presión constante). Mayor temperatura = mayor volumen."
  ,
    question_en: "According to Charles's Law, if the temperature of a gas increases and the pressure stays the same, the volume:",
    options_en: ["Decreases proportionally to the cold gas temperature", "Increases proportionally to the hot gas temperature", "Remains the same regardless of the total temperature change", "Doubles only if the temperature increases exactly to double"],
    explanation_en: "Charles's Law: V1/T1 = V2/T2 (at constant pressure). Higher temperature = greater volume."
  },
  {
    category: "Leyes de los Gases",
    q: "Según la Ley de Gay-Lussac, si la temperatura de un gas sube en un recipiente rígido cerrado:",
    options: ["La presión baja porque el gas se expande dentro del tanque", "La presión sube proporcionalmente al aumento de temperatura", "La presión no cambia porque el volumen es fijo y constante", "El gas se condensa a líquido por la presión del recipiente"],
    correct: 1,
    explanation: "Gay-Lussac: P₁/T₁ = P₂/T₂ (a volumen constante). Más calor en recipiente cerrado = más presión."
  ,
    question_en: "According to Gay-Lussac's Law, if the temperature of a gas rises in a closed rigid container:",
    options_en: ["The pressure drops because the gas expands inside the tank", "The pressure rises proportionally to the temperature increase", "The pressure does not change because the volume is fixed and constant", "The gas condenses to liquid from the container pressure"],
    explanation_en: "Gay-Lussac: P1/T1 = P2/T2 (at constant volume). More heat in a closed container = more pressure."
  },
  {
    category: "Leyes de los Gases",
    q: "¿Por qué un cilindro de refrigerante tiene mayor presión cuando está en un camión caliente al sol?",
    options: ["Porque el sol carga eléctricamente el refrigerante del cilindro", "Porque la Ley de Gay-Lussac dice que más calor igual más presión", "Porque el refrigerante se evapora y escapa del cilindro cerrado", "Porque el metal del cilindro se expande y comprime al refrigerante"],
    correct: 1,
    explanation: "Volumen fijo (cilindro) + aumento de temperatura = aumento de presión. Gay-Lussac en acción."
  ,
    question_en: "Why does a refrigerant cylinder have higher pressure when sitting in a hot truck in the sun?",
    options_en: ["Because the sun electrically charges the refrigerant in the cylinder", "Because Gay-Lussac's Law says more heat equals more pressure", "Because the refrigerant evaporates and escapes from the sealed cylinder", "Because the cylinder metal expands and compresses the refrigerant"],
    explanation_en: "Fixed volume (cylinder) + temperature increase = pressure increase. Gay-Lussac's Law in action."
  },
  {
    category: "Leyes de los Gases",
    q: "La presión atmosférica a nivel del mar es de 14.696 psi. ¿Qué efecto tiene en el punto de ebullición del agua?",
    options: ["No tiene ningún efecto en el punto de ebullición del agua", "Determina que el agua hierva a 212°F a esa presión exacta", "Hace que el agua hierva a una temperatura mayor de 250°F", "Hace que el agua hierva a temperatura menor que 100°F frío"],
    correct: 1,
    explanation: "A 14.7 psi, el agua hierve a 212°F. A menor presión (altitud), hierve a menor temperatura."
  ,
    question_en: "Atmospheric pressure at sea level is 14.696 psi. What effect does it have on the boiling point of water?",
    options_en: ["It has no effect on the boiling point of water", "It determines that water boils at 212 degrees F at that exact pressure", "It makes water boil at a higher temperature of 250 degrees F", "It makes water boil at a temperature lower than 100 degrees F cold"],
    explanation_en: "At 14.7 psi, water boils at 212 degrees F. At lower pressure (altitude), it boils at a lower temperature."
  },
  {
    category: "Teoría del Calor",
    q: "¿Cuáles son los tres estados de la materia y en qué orden tienen más energía?",
    options: ["Gas, líquido, sólido — de mayor a menor energía total", "Sólido, gas, líquido — de mayor a menor energía total", "Líquido, sólido, gas — de mayor a menor energía total", "Sólido, líquido, gas — de menor a mayor energía total"],
    correct: 3,
    explanation: "Sólido (menor energía) → Líquido → Gas (mayor energía). Agregar calor mueve materia hacia estado gaseoso."
  ,
    question_en: "What are the three states of matter and in what order do they have the most energy?",
    options_en: ["Gas, liquid, solid — from highest to lowest total energy", "Solid, gas, liquid — from highest to lowest total energy", "Liquid, solid, gas — from highest to lowest total energy", "Solid, liquid, gas — from lowest to highest total energy"],
    explanation_en: "Solid (lowest energy) -> Liquid -> Gas (highest energy). Adding heat moves matter toward the gaseous state."
  },
  {
    category: "Teoría del Calor",
    q: "¿Por qué el refrigerante puede absorber calor del aire interior aunque el aire ya se sienta fresco?",
    options: ["Porque el refrigerante es más caliente que el aire del cuarto", "Porque el refrigerante está más frío que el aire y el calor fluye natural", "Porque el compresor fuerza al calor a moverse contra su flujo normal", "Porque el ventilador empuja el frío del refrigerante hacia el cuarto"],
    correct: 1,
    explanation: "El calor siempre fluye de mayor a menor temperatura. El refrigerante a ~40°F absorbe calor del aire a ~75°F."
  ,
    question_en: "Why can the refrigerant absorb heat from indoor air even though the air already feels cool?",
    options_en: ["Because the refrigerant is hotter than the room air", "Because the refrigerant is colder than the air and heat flows naturally", "Because the compressor forces heat to move against its natural flow", "Because the fan pushes the cold from the refrigerant toward the room"],
    explanation_en: "Heat always flows from higher to lower temperature. Refrigerant at ~40 degrees F absorbs heat from air at ~75 degrees F."
  },
  {
    category: "Teoría del Calor",
    q: "¿Qué es el punto de rocío (dew point) y por qué le importa al técnico HVAC?",
    options: ["La temperatura a la que el compresor alcanza máxima presión", "La temperatura a la que el vapor de agua del aire se condensa", "La presión a la que el refrigerante cambia de gas a líquido", "La velocidad a la que el aire pasa por el evaporador del equipo"],
    correct: 1,
    explanation: "El dew point es la temperatura donde el aire no puede sostener más humedad y se forma condensación."
  ,
    question_en: "What is the dew point and why does it matter to an HVAC technician?",
    options_en: ["The temperature at which the compressor reaches maximum pressure", "The temperature at which water vapor in the air condenses", "The pressure at which the refrigerant changes from gas to liquid", "The speed at which air passes through the equipment's evaporator"],
    explanation_en: "The dew point is the temperature where air can no longer hold moisture and condensation forms."
  },
  // Seguridad esencial
  {
    category: "Seguridad",
    q: "¿Cuál es el PRIMER paso antes de trabajar en cualquier equipo eléctrico HVAC?",
    options: ["Medir el voltaje para confirmar que hay energía activa", "Lockout/Tagout — desconectar y bloquear la fuente de energía", "Verificar las presiones de refrigerante con el manifold puesto", "Revisar el termostato para confirmar que pide enfriamiento"],
    correct: 1,
    explanation: "LOTO (Lockout/Tagout) es el primer paso OBLIGATORIO. Desconectar, bloquear y verificar con medidor antes de tocar."
  ,
    question_en: "What is the FIRST step before working on any electrical HVAC equipment?",
    options_en: ["Measure voltage to confirm there is active power", "Lockout/Tagout — disconnect and lock out the power source", "Check refrigerant pressures with the manifold connected", "Check the thermostat to confirm it is calling for cooling"],
    explanation_en: "LOTO (Lockout/Tagout) is the MANDATORY first step. Disconnect, lock out, and verify with a meter before touching."
  },
  {
    category: "Seguridad",
    q: "¿Qué tipo de extintor se usa para un fuego en un equipo eléctrico energizado?",
    options: ["Tipo A para materiales combustibles sólidos como madera", "Tipo B para líquidos inflamables como gasolina o aceite", "Tipo C para equipos eléctricos con corriente activa presente", "Tipo D para metales combustibles como magnesio o titanio"],
    correct: 2,
    explanation: "Tipo C es para fuegos eléctricos. NUNCA usar agua en equipo energizado — riesgo de electrocución."
  ,
    question_en: "What type of fire extinguisher is used for a fire in energized electrical equipment?",
    options_en: ["Type A for solid combustible materials like wood", "Type B for flammable liquids like gasoline or oil", "Type C for electrical equipment with active current present", "Type D for combustible metals like magnesium or titanium"],
    explanation_en: "Type C is for electrical fires. NEVER use water on energized equipment — risk of electrocution."
  },
  {
    category: "Seguridad",
    q: "Si el refrigerante líquido toca tu piel, ¿qué tipo de lesión causa?",
    options: ["Quemadura térmica por calor intenso del refrigerante", "Quemadura por congelamiento instantáneo de la piel frostbite", "Irritación química leve que desaparece en pocos minutos", "Reacción alérgica que requiere antihistamínicos orales solos"],
    correct: 1,
    explanation: "El refrigerante líquido se evapora a -40°F o menos, causando frostbite instantáneo al contacto con la piel."
  ,
    question_en: "If liquid refrigerant touches your skin, what type of injury does it cause?",
    options_en: ["Thermal burn from intense heat of the refrigerant", "Instant frostbite burn from freezing of the skin", "Mild chemical irritation that disappears in a few minutes", "Allergic reaction requiring only oral antihistamines"],
    explanation_en: "Liquid refrigerant evaporates at -40 degrees F or less, causing instant frostbite on contact with the skin."
  },
  {
    category: "Seguridad",
    q: "¿Cuál es la altura mínima donde OSHA requiere protección contra caídas en construcción?",
    options: ["04 pies sobre el nivel del suelo o plataforma base", "06 pies sobre el nivel del suelo o plataforma base", "08 pies sobre el nivel del suelo o plataforma base", "10 pies sobre el nivel del suelo o plataforma base"],
    correct: 1,
    explanation: "OSHA 1926.501 requiere protección contra caídas a 6 pies o más en la industria de construcción."
  ,
    question_en: "What is the minimum height where OSHA requires fall protection in construction?",
    options_en: ["04 feet above ground level or base platform", "06 feet above ground level or base platform", "08 feet above ground level or base platform", "10 feet above ground level or base platform"],
    explanation_en: "OSHA 1926.501 requires fall protection at 6 feet or more in the construction industry."
  },
  {
    category: "Seguridad",
    q: "¿Por qué los refrigerantes son peligrosos en espacios confinados sin ventilación?",
    options: ["Porque son altamente inflamables y pueden explotar con una chispa", "Porque son más pesados que el aire y desplazan el oxígeno respirable", "Porque producen gases tóxicos que causan envenenamiento inmediato", "Porque generan electricidad estática que puede causar cortocircuito"],
    correct: 1,
    explanation: "Los refrigerantes HFC son más pesados que el aire, desplazan el oxígeno y pueden causar asfixia sin previo aviso."
  ,
    question_en: "Why are refrigerants dangerous in confined spaces without ventilation?",
    options_en: ["Because they are highly flammable and can explode with a spark", "Because they are heavier than air and displace breathable oxygen", "Because they produce toxic gases that cause immediate poisoning", "Because they generate static electricity that can cause a short circuit"],
    explanation_en: "HFC refrigerants are heavier than air, displace oxygen, and can cause asphyxiation without warning."
  },
  {
    category: "Seguridad",
    q: "Si hueles a huevos podridos cerca de un horno de gas, ¿qué debes hacer INMEDIATAMENTE?",
    options: ["Buscar la fuga con un encendedor o fósforo para verificar", "Evacuar el área sin usar interruptores y llamar a la compañía gas", "Abrir las ventanas y ajustar la válvula de gas a posición piloto", "Encender el ventilador del horno para dispersar el gas rápidamente"],
    correct: 1,
    explanation: "El olor es mercaptano añadido al gas natural. Evacuar SIN operar ningún interruptor eléctrico y llamar a la compañía."
  ,
    question_en: "If you smell rotten eggs near a gas furnace, what should you do IMMEDIATELY?",
    options_en: ["Look for the leak with a lighter or match to verify", "Evacuate the area without using switches and call the gas company", "Open the windows and adjust the gas valve to pilot position", "Turn on the furnace fan to disperse the gas quickly"],
    explanation_en: "The odor is mercaptan added to natural gas. Evacuate WITHOUT operating any electrical switch and call the gas company."
  },
  {
    category: "Seguridad",
    q: "¿Cuántos voltios de corriente alterna pueden ser potencialmente letales para un ser humano?",
    options: ["Se necesitan mínimo 120 voltios para causar un daño mortal", "Tan solo 50 voltios AC pueden ser letales en condiciones húmedas", "Se necesitan mínimo 240 voltios para causar un daño mortal", "Solo voltajes mayores a 480 voltios son considerados peligrosos"],
    correct: 1,
    explanation: "Tan poco como 50V AC pueden matar dependiendo de humedad, contacto y la ruta de la corriente por el cuerpo."
  ,
    question_en: "How many volts of alternating current can potentially be lethal to a human being?",
    options_en: ["A minimum of 120 volts is needed to cause fatal harm", "As little as 50 volts AC can be lethal under wet conditions", "A minimum of 240 volts is needed to cause fatal harm", "Only voltages greater than 480 volts are considered dangerous"],
    explanation_en: "As little as 50V AC can kill depending on moisture, contact, and the current path through the body."
  },
  {
    category: "Seguridad",
    q: "¿Qué debe sobresalir una escalera de extensión por encima del punto de apoyo en el techo?",
    options: ["1 pie por encima del borde del techo como regla mínima", "3 pies por encima del borde del techo como regla mínima", "5 pies por encima del borde del techo como regla mínima", "No necesita sobresalir si está bien apoyada contra la pared"],
    correct: 1,
    explanation: "OSHA requiere que la escalera sobresalga 3 pies (36 pulgadas) sobre el punto de desembarque."
  ,
    question_en: "How far must an extension ladder extend above the roof support point?",
    options_en: ["1 foot above the roof edge as a minimum rule", "3 feet above the roof edge as a minimum rule", "5 feet above the roof edge as a minimum rule", "It does not need to extend if it is well supported against the wall"],
    explanation_en: "OSHA requires the ladder to extend 3 feet (36 inches) above the landing point."
  },
  {
    category: "Instrumentos",
    q: "¿Qué herramienta se usa para detectar fugas de refrigerante en uniones soldadas?",
    options: ["Multímetro digital en modo de voltaje AC", "Detector electrónico de fugas de refrigerante", "Termómetro infrarrojo apuntando a la unión", "Manómetro de alta presión conectado al sistema"],
    correct: 1,
    explanation: "El detector electrónico de fugas detecta moléculas de refrigerante en el aire. También se usa jabón de burbujas como método visual."
  ,
    question_en: "What tool is used to detect refrigerant leaks at soldered joints?",
    options_en: ["Digital multimeter in AC voltage mode", "Electronic refrigerant leak detector", "Infrared thermometer pointing at the joint", "High pressure gauge connected to the system"],
    explanation_en: "The electronic leak detector detects refrigerant molecules in the air. Soap bubbles are also used as a visual method."
  },
  {
    category: "Instrumentos",
    q: "¿Para qué se usa una bomba de vacío en un sistema de refrigeración?",
    options: ["Para cargar refrigerante más rápido al sistema", "Para evacuar humedad y aire no condensable del sistema", "Para aumentar la presión del lado de alta del sistema", "Para medir la temperatura del evaporador con precisión"],
    correct: 1,
    explanation: "La bomba de vacío remueve humedad y aire. La humedad causa ácidos y el aire no condensable aumenta presiones."
  ,
    question_en: "What is a vacuum pump used for in a refrigeration system?",
    options_en: ["To charge refrigerant faster into the system", "To evacuate moisture and non-condensable air from the system", "To increase the high-side pressure of the system", "To measure evaporator temperature with precision"],
    explanation_en: "The vacuum pump removes moisture and air. Moisture causes acids and non-condensable air increases pressures."
  },
  {
    category: "Instrumentos",
    q: "¿Qué indica un micron gauge durante la evacuación de un sistema?",
    options: ["La temperatura interna del compresor en grados", "El nivel de vacío profundo en micrones de mercurio", "La cantidad de refrigerante que queda en el sistema", "La velocidad del flujo de aire en los ductos"],
    correct: 1,
    explanation: "El micron gauge mide vacío profundo. Se necesitan 500 micrones o menos para una evacuación adecuada según estándares."
  ,
    question_en: "What does a micron gauge indicate during evacuation of a system?",
    options_en: ["The internal temperature of the compressor in degrees", "The deep vacuum level in microns of mercury", "The amount of refrigerant remaining in the system", "The airflow speed in the ducts"],
    explanation_en: "The micron gauge measures deep vacuum. 500 microns or less is needed for a proper evacuation per standards."
  },
  {
    category: "Teoría del Calor",
    q: "¿Qué significa BTU y qué mide en HVAC?",
    options: ["British Thermal Unit — mide la cantidad de calor necesaria para subir 1°F a 1 libra de agua", "Basic Temperature Unit — mide la temperatura máxima del sistema", "Boiler Transfer Unit — mide la eficiencia de una caldera", "Balanced Thermal Usage — mide el balance de calor en un edificio"],
    correct: 0,
    explanation: "BTU = British Thermal Unit. Es la cantidad de calor para elevar 1 libra de agua 1 grado Fahrenheit. Base de todos los cálculos HVAC."
  ,
    question_en: "What does BTU mean and what does it measure in HVAC?",
    options_en: ["British Thermal Unit — measures the amount of heat needed to raise 1 lb of water by 1 degree F", "Basic Temperature Unit — measures the maximum system temperature", "Boiler Transfer Unit — measures the efficiency of a boiler", "Balanced Thermal Usage — measures the heat balance in a building"],
    explanation_en: "BTU = British Thermal Unit. It is the amount of heat to raise 1 pound of water by 1 degree Fahrenheit. The basis of all HVAC calculations."
  },
  {
    category: "Teoría del Calor",
    q: "¿Cuál es la diferencia entre calor sensible y calor latente?",
    options: ["Sensible cambia temperatura, latente cambia estado sin cambiar temperatura", "Latente cambia temperatura, sensible cambia estado físico de la materia", "No hay diferencia, ambos términos significan exactamente lo mismo", "Sensible solo aplica a líquidos y latente solo aplica a gases"],
    correct: 0,
    explanation: "Calor sensible = cambio de temperatura medible con termómetro. Calor latente = cambio de estado (líquido a vapor) sin cambio de temperatura."
  ,
    question_en: "What is the difference between sensible heat and latent heat?",
    options_en: ["Sensible changes temperature, latent changes state without changing temperature", "Latent changes temperature, sensible changes the physical state of matter", "There is no difference, both terms mean exactly the same thing", "Sensible only applies to liquids and latent only applies to gases"],
    explanation_en: "Sensible heat = measurable temperature change with a thermometer. Latent heat = change of state (liquid to vapor) with no temperature change."
  },
  {
    category: "Seguridad",
    q: "¿Qué equipo de protección personal es obligatorio al trabajar con refrigerantes?",
    options: ["Solo casco de construcción y chaleco reflectante", "Guantes resistentes a químicos y gafas de seguridad como mínimo", "Solo botas con punta de acero y cinturón de herramientas", "No se requiere EPP especial para manejar refrigerantes"],
    correct: 1,
    explanation: "Los refrigerantes causan quemaduras por congelación al contacto con la piel. Guantes y gafas son el EPP mínimo según OSHA."
  ,
    question_en: "What personal protective equipment is mandatory when working with refrigerants?",
    options_en: ["Only a hard hat and reflective vest", "Chemical-resistant gloves and safety goggles at minimum", "Only steel-toe boots and a tool belt", "No special PPE is required for handling refrigerants"],
    explanation_en: "Refrigerants cause frostbite burns on skin contact. Gloves and goggles are the minimum PPE per OSHA."
  },
  {
    category: "Seguridad",
    q: "¿Por qué nunca se debe ventilar refrigerante a la atmósfera intencionalmente?",
    options: ["Porque el refrigerante es inflamable y puede causar explosiones", "Porque viola la Sección 608 de la EPA con multas de hasta $44,539 por día", "Porque el refrigerante pierde sus propiedades al contacto con el aire", "Porque el refrigerante se solidifica y tapa los ductos de ventilación"],
    correct: 1,
    explanation: "La EPA Sección 608 prohíbe la ventilación intencional. Las multas pueden ser de hasta $44,539 por día por violación."
  ,
    question_en: "Why should refrigerant never be intentionally vented to the atmosphere?",
    options_en: ["Because refrigerant is flammable and can cause explosions", "Because it violates EPA Section 608 with fines up to $44,539 per day", "Because refrigerant loses its properties upon contact with air", "Because refrigerant solidifies and clogs the ventilation ducts"],
    explanation_en: "EPA Section 608 prohibits intentional venting. Fines can be up to $44,539 per day per violation."
  }
],

// ─── NIVEL 2: Fasteners, Soldering, Brazing, Leak Testing (100 preguntas) ───
nivel2: [
  // ── Fasteners y sus herramientas (~35 preguntas) ──
  {
    category: "Fasteners",
    q: "¿Qué tipo de tornillo tiene cabeza hexagonal con arandela integrada y se usa comúnmente para fijar lámina de ducto?",
    options: ["Tornillo de máquina Phillips estándar", "Tornillo autoroscante tipo hex washer", "Tornillo de cabeza Allen embutida plana", "Tornillo de cabeza Torx de seguridad T25"],
    correct: 1,
    explanation: "Los hex washer head self-tapping screws son el estándar para unir lámina de ducto metálico."
  ,
    question_en: "What type of screw has a hex head with an integrated washer and is commonly used to fasten duct sheet metal?",
    options_en: ["Standard Phillips machine screw", "Self-tapping hex washer head screw", "Flat socket head Allen screw", "T25 Torx security head screw"],
    explanation_en: "Hex washer head self-tapping screws are the standard for joining metal ductwork sheet metal."
  },
  {
    category: "Fasteners",
    q: "¿Cuál es la diferencia principal entre un tornillo autoroscante y un tornillo autorroscante (self-drilling)?",
    options: ["El autoroscante es más largo que el autorroscante", "El autorroscante tiene punta de broca integrada", "El autoroscante es solo para madera exclusivamente", "El autorroscante solo funciona en plásticos blandos"],
    correct: 1,
    explanation: "Self-drilling (TEK screws) tienen punta de broca que perfora y rosca en un solo paso."
  ,
    question_en: "What is the main difference between a self-tapping screw and a self-drilling screw?",
    options_en: ["The self-tapping screw is longer than the self-drilling one", "The self-drilling screw has an integrated drill-point tip", "The self-tapping is only for wood exclusively", "The self-drilling only works on soft plastics"],
    explanation_en: "Self-drilling (TEK screws) have a drill-point tip that drills and taps in a single step."
  },
  {
    category: "Fasteners",
    q: "¿Qué herramienta se usa para instalar rivets pop en una junta de ducto de lámina galvanizada?",
    options: ["Pistola de tornillos inalámbrica estándar", "Remachadora manual o neumática de rivets", "Martillo de bola y punzón de centrado", "Soldadora de punto por resistencia eléctrica"],
    correct: 1,
    explanation: "La remachadora (rivet gun) tira del mandril expandiendo el rivet para una unión permanente."
  ,
    question_en: "What tool is used to install pop rivets on a galvanized sheet metal duct joint?",
    options_en: ["Standard cordless screw gun", "Manual or pneumatic rivet gun", "Ball-peen hammer and center punch", "Electric resistance spot welder"],
    explanation_en: "The rivet gun pulls the mandrel, expanding the rivet for a permanent joint."
  },
  {
    category: "Fasteners",
    q: "Un tornillo TEK #8 × 1/2\" con punta #2 es adecuado para penetrar lámina de hasta qué calibre?",
    options: ["Calibre 28 a 22 solamente ligero", "Calibre 22 a 18 de espesor medio", "Calibre 18 a 14 de espesor grueso", "Calibre 14 a 10 de espesor pesado"],
    correct: 1,
    explanation: "La punta #2 de TEK está diseñada para perforar lámina de calibre 22 a 18 (espesor medio)."
  ,
    question_en: "A #8 x 1/2\" TEK screw with a #2 point is suitable for penetrating sheet metal up to what gauge?",
    options_en: ["Gauge 28 to 22 only, lightweight", "Gauge 22 to 18, medium thickness", "Gauge 18 to 14, heavy thickness", "Gauge 14 to 10, extra heavy"],
    explanation_en: "The #2 TEK point is designed to drill through 22 to 18 gauge sheet metal (medium thickness)."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de anclaje se usa para fijar una base de condensadora en una losa de concreto?",
    options: ["Tornillo para madera cabeza Phillips", "Anclaje de expansión tipo wedge o sleeve", "Remache pop de aluminio de 3/16 pulgada", "Tornillo autoroscante punta de broca TEK"],
    correct: 1,
    explanation: "Los anclajes de expansión (wedge/sleeve anchors) se expanden dentro del concreto para fijación permanente."
  ,
    question_en: "What type of anchor is used to secure a condenser base to a concrete slab?",
    options_en: ["Phillips head wood screw", "Wedge or sleeve expansion anchor", "3/16 inch aluminum pop rivet", "TEK drill-point self-tapping screw"],
    explanation_en: "Expansion anchors (wedge/sleeve anchors) expand inside the concrete for permanent fastening."
  },
  {
    category: "Fasteners",
    q: "¿Qué herramienta eléctrica es necesaria para instalar anclajes de expansión en concreto?",
    options: ["Taladro estándar con broca de acero HSS", "Rotomartillo con broca de carburo de tungsteno", "Destornillador de impacto con punta Phillips", "Sierra caladora con hoja para mampostería dura"],
    correct: 1,
    explanation: "El rotomartillo (hammer drill) con broca de carburo perfora concreto con percusión y rotación."
  ,
    question_en: "What power tool is needed to install expansion anchors in concrete?",
    options_en: ["Standard drill with HSS steel bit", "Hammer drill with tungsten carbide bit", "Impact driver with Phillips bit", "Jigsaw with masonry blade"],
    explanation_en: "The hammer drill with carbide bit drills concrete with percussion and rotation."
  },
  {
    category: "Fasteners",
    q: "¿Cuál es el propósito de una arandela de neopreno en un tornillo para techo de lámina?",
    options: ["Aumentar la fuerza de sujeción del tornillo", "Sellar contra infiltración de agua de lluvia", "Evitar que el tornillo se oxide rápidamente", "Reducir la vibración del equipo montado arriba"],
    correct: 1,
    explanation: "La arandela de neopreno sella el punto de penetración para evitar filtraciones de agua."
  ,
    question_en: "What is the purpose of a neoprene washer on a screw for sheet metal roofing?",
    options_en: ["To increase the fastening strength of the screw", "To seal against rainwater infiltration", "To prevent the screw from rusting quickly", "To reduce vibration of the equipment mounted above"],
    explanation_en: "The neoprene washer seals the penetration point to prevent water leaks."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de tuerca se usa con varilla roscada para colgar ductos del techo en una instalación comercial?",
    options: ["Tuerca de mariposa para ajuste manual rápido", "Tuerca hexagonal con arandela plana y de presión", "Tuerca de seguridad con inserto de plástico nylon", "Tuerca ciega o de capuchón para acabado estético"],
    correct: 1,
    explanation: "Tuerca hexagonal con arandela plana (distribuye carga) y de presión (anti-vibración) es el estándar."
  ,
    question_en: "What type of nut is used with threaded rod to hang ducts from the ceiling in a commercial installation?",
    options_en: ["Wing nut for quick manual adjustment", "Hex nut with flat washer and lock washer", "Nylon insert lock nut for security", "Acorn cap nut for aesthetic finish"],
    explanation_en: "Hex nut with flat washer (distributes load) and lock washer (anti-vibration) is the standard."
  },
  {
    category: "Fasteners",
    q: "¿Qué calibre de varilla roscada se usa típicamente para colgar ductos rectangulares de hasta 48 pulgadas?",
    options: ["Varilla roscada de 1/4 de pulgada diámetro", "Varilla roscada de 3/8 de pulgada diámetro", "Varilla roscada de 1/2 de pulgada diámetro", "Varilla roscada de 5/8 de pulgada diámetro"],
    correct: 1,
    explanation: "Varilla de 3/8\" es el estándar para ductos medianos. Ductos más grandes requieren 1/2\" o más."
  ,
    question_en: "What gauge of threaded rod is typically used to hang rectangular ducts up to 48 inches?",
    options_en: ["1/4 inch diameter threaded rod", "3/8 inch diameter threaded rod", "1/2 inch diameter threaded rod", "5/8 inch diameter threaded rod"],
    explanation_en: "3/8\" rod is the standard for medium-sized ducts. Larger ducts require 1/2\" or more."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de abrazadera se usa para fijar tubo de cobre de 3/4\" a una pared de madera?",
    options: ["Abrazadera de tubo tipo clevis de acero", "Abrazadera de cobre tipo media luna con clavo", "Abrazadera de manguera tipo worm gear ajustable", "Abrazadera de PVC tipo omega con tornillo pasante"],
    correct: 1,
    explanation: "Las abrazaderas de media luna (half clamp) de cobre son el estándar para fijar tubo de cobre a madera."
  ,
    question_en: "What type of clamp is used to secure 3/4\" copper tubing to a wood wall?",
    options_en: ["Clevis-type steel pipe clamp", "Copper half-moon clamp with nail", "Worm gear adjustable hose clamp", "PVC omega clamp with through bolt"],
    explanation_en: "Copper half clamps are the standard for securing copper tubing to wood."
  },
  {
    category: "Fasteners",
    q: "¿Por qué NO se deben usar tornillos que penetren hacia el interior del ducto de suministro de aire?",
    options: ["Porque los tornillos se oxidan con el aire frío", "Porque las puntas atrapan pelusa y reducen flujo", "Porque los tornillos conducen electricidad al ducto", "Porque los tornillos debilitan la estructura del ducto"],
    correct: 1,
    explanation: "Las puntas que sobresalen dentro del ducto atrapan polvo, pelusa y crean turbulencia que reduce flujo."
  ,
    question_en: "Why should screws NOT penetrate into the interior of a supply air duct?",
    options_en: ["Because the screws rust from the cold air", "Because the tips trap lint and reduce airflow", "Because the screws conduct electricity to the duct", "Because the screws weaken the duct structure"],
    explanation_en: "Tips protruding inside the duct trap dust, lint, and create turbulence that reduces airflow."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de tornillo se usa para fijar un panel de acceso en un air handler de lámina galvanizada?",
    options: ["Tornillo de cabeza hexagonal lag bolt de 3 pulgadas", "Tornillo autoroscante de cabeza hex 1/4 × 3/4 pulg", "Tornillo para concreto tipo Tapcon de cabeza plana", "Tornillo para drywall cabeza trompeta fosfatizado"],
    correct: 1,
    explanation: "Tornillos autoroscantes hex washer cortos son estándar para paneles de lámina en air handlers."
  ,
    question_en: "What type of screw is used to fasten an access panel on a galvanized sheet metal air handler?",
    options_en: ["3-inch hex head lag bolt", "1/4 x 3/4 inch hex washer head self-tapping screw", "Tapcon flat head concrete screw", "Phosphated drywall bugle head screw"],
    explanation_en: "Short hex washer self-tapping screws are the standard for sheet metal panels on air handlers."
  },
  {
    category: "Fasteners",
    q: "¿Cuál es la ventaja de un toggle bolt sobre un anclaje plástico para montar un mini split en drywall?",
    options: ["El toggle bolt es más económico por unidad", "El toggle bolt soporta mucho más peso en drywall", "El toggle bolt no necesita hacer agujero previo", "El toggle bolt se puede reutilizar fácilmente otra vez"],
    correct: 1,
    explanation: "Los toggle bolts soportan 50+ lbs en drywall vs 10-15 lbs de un anclaje plástico."
  ,
    question_en: "What is the advantage of a toggle bolt over a plastic anchor for mounting a mini split on drywall?",
    options_en: ["The toggle bolt is more economical per unit", "The toggle bolt supports much more weight in drywall", "The toggle bolt does not need a pre-drilled hole", "The toggle bolt can be easily reused again"],
    explanation_en: "Toggle bolts support 50+ lbs in drywall vs 10-15 lbs for a plastic anchor."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de broca se necesita para perforar un agujero en una viga de acero tipo I-beam?",
    options: ["Broca de carburo para concreto y mampostería", "Broca de cobalto o HSS para metal ferroso", "Broca de pala para madera de alta velocidad", "Broca de diamante para cerámica y porcelana"],
    correct: 1,
    explanation: "Brocas de cobalto o HSS (High Speed Steel) están diseñadas para cortar acero estructural."
  ,
    question_en: "What type of drill bit is needed to drill a hole in a steel I-beam?",
    options_en: ["Carbide bit for concrete and masonry", "Cobalt or HSS bit for ferrous metal", "High-speed wood spade bit", "Diamond bit for ceramic and porcelain"],
    explanation_en: "Cobalt or HSS (High Speed Steel) bits are designed for cutting structural steel."
  },
  {
    category: "Fasteners",
    q: "¿Para qué sirve una tuerca Unistrut (spring nut) en instalaciones de soporte de equipos HVAC?",
    options: ["Para fijar tuberías de PVC al techo de concreto", "Para deslizar y fijar en canal Unistrut sin tornillos", "Para sellar penetraciones en paredes cortafuego", "Para conectar cables eléctricos a tierra del equipo"],
    correct: 1,
    explanation: "Las spring nuts se deslizan dentro del canal Unistrut y se fijan con tornillo sin necesidad de perforar."
  ,
    question_en: "What is a Unistrut spring nut used for in HVAC equipment support installations?",
    options_en: ["To fasten PVC pipes to a concrete ceiling", "To slide into and fasten on Unistrut channel without drilling", "To seal penetrations in firewall partitions", "To connect electrical ground cables to equipment"],
    explanation_en: "Spring nuts slide inside the Unistrut channel and lock with a bolt without the need to drill."
  },
  {
    category: "Fasteners",
    q: "¿Qué tamaño de punta Phillips es el más común para tornillos autoroscantes de HVAC #8 y #10?",
    options: ["Punta Phillips número 1 la más pequeña", "Punta Phillips número 2 la más estándar", "Punta Phillips número 3 la más grande común", "Punta Phillips número 0 de precisión mini"],
    correct: 1,
    explanation: "Phillips #2 es el tamaño estándar para la mayoría de tornillos #8 y #10 en HVAC."
  ,
    question_en: "What size Phillips tip is the most common for #8 and #10 HVAC self-tapping screws?",
    options_en: ["Phillips number 1, the smallest", "Phillips number 2, the most standard", "Phillips number 3, the largest common", "Phillips number 0, mini precision"],
    explanation_en: "Phillips #2 is the standard size for most #8 and #10 screws in HVAC."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de clavo se usa con pistola neumática para fijar tira de clavado (furring strip) a concreto?",
    options: ["Clavo común de acero con cabeza redonda 3 pulg", "Clavo de concreto hardened tipo ramset con pólvora", "Clavo de acabado sin cabeza para molduras de madera", "Clavo galvanizado para techado con cabeza ancha plana"],
    correct: 1,
    explanation: "Los clavos hardened tipo Ramset (powder-actuated) penetran concreto mediante cartucho de pólvora."
  ,
    question_en: "What type of nail is used with a powder-actuated gun to fasten furring strips to concrete?",
    options_en: ["Common steel nail with round head 3 inches", "Hardened concrete nail, Ramset type with powder charge", "Finishing nail without head for wood trim", "Galvanized roofing nail with wide flat head"],
    explanation_en: "Hardened Ramset-type (powder-actuated) nails penetrate concrete via a powder cartridge."
  },
  {
    category: "Fasteners",
    q: "¿Qué tornillo es el correcto para fijar una ménsula de condensadora a un muro de block de concreto?",
    options: ["Tornillo para madera de 3 pulgadas zincado", "Tornillo Tapcon para concreto con broca de carburo", "Tornillo drywall de rosca fina fosfatizado negro", "Tornillo de máquina con tuerca hexagonal estándar"],
    correct: 1,
    explanation: "Los Tapcon son tornillos específicos para concreto/block que roscan directamente en el material."
  ,
    question_en: "What screw is correct for fastening a condenser bracket to a concrete block wall?",
    options_en: ["3-inch zinc-plated wood screw", "Tapcon concrete screw with carbide drill bit", "Fine-thread phosphated black drywall screw", "Machine screw with standard hex nut"],
    explanation_en: "Tapcon screws are specifically designed for concrete/block and thread directly into the material."
  },
  {
    category: "Fasteners",
    q: "¿Cuál es el torque recomendado para apretar una conexión flare de 3/8\" en refrigeración?",
    options: ["10 a 15 libras-pie de torque estándar", "15 a 20 libras-pie de torque estándar", "25 a 30 libras-pie de torque estándar", "33 a 38 libras-pie de torque estándar"],
    correct: 2,
    explanation: "Para flare de 3/8\", el torque recomendado es aproximadamente 25-30 ft-lbs para un sello adecuado."
  ,
    question_en: "What is the recommended torque for tightening a 3/8\" flare connection in refrigeration?",
    options_en: ["10 to 15 foot-pounds of standard torque", "15 to 20 foot-pounds of standard torque", "25 to 30 foot-pounds of standard torque", "33 to 38 foot-pounds of standard torque"],
    explanation_en: "For a 3/8\" flare, the recommended torque is approximately 25-30 ft-lbs for a proper seal."
  },
  {
    category: "Fasteners",
    q: "¿Qué herramienta se usa para cortar varilla roscada de 3/8\" al largo necesario para colgar ductos?",
    options: ["Sierra circular con disco de metal abrasivo", "Sierra recíproca o cortadora de varilla roscada", "Tijeras de aviación para lámina de calibre fino", "Cortador de tubo de cobre tipo rodillo estándar"],
    correct: 1,
    explanation: "La sierra recíproca (reciprocating/Sawzall) con hoja de metal corta varilla roscada eficientemente."
  ,
    question_en: "What tool is used to cut 3/8\" threaded rod to the required length for hanging ducts?",
    options_en: ["Circular saw with abrasive metal-cutting disc", "Reciprocating saw or threaded rod cutter", "Aviation snips for thin gauge sheet metal", "Standard roller-type copper tube cutter"],
    explanation_en: "The reciprocating saw (Sawzall) with a metal blade cuts threaded rod efficiently."
  },
  // ── Soldering y Brazing (~35 preguntas) ──
  {
    category: "Soldadura",
    q: "¿Cuál es la temperatura mínima aproximada para que la soldadura de plata (brazing) funda correctamente?",
    options: ["450 grados Fahrenheit de temperatura", "840 grados Fahrenheit de temperatura", "1100 grados Fahrenheit de temperatura", "1500 grados Fahrenheit de temperatura"],
    correct: 2,
    explanation: "El brazing con aleación de plata funde por encima de 1100°F (593°C). Por debajo de 840°F es soldering."
  ,
    question_en: "What is the approximate minimum temperature for silver brazing alloy to melt correctly?",
    options_en: ["450 degrees Fahrenheit", "840 degrees Fahrenheit", "1100 degrees Fahrenheit", "1500 degrees Fahrenheit"],
    explanation_en: "Brazing with silver alloy melts above 1100 degrees F (593 degrees C). Below 840 degrees F is soldering."
  },
  {
    category: "Soldadura",
    q: "¿Cuál es la diferencia técnica entre soldering y brazing según la temperatura?",
    options: ["Soldering es arriba de 840°F y brazing abajo", "Soldering es abajo de 840°F y brazing arriba", "No hay diferencia, son el mismo proceso exacto", "Soldering usa gas MAP y brazing usa propano solo"],
    correct: 1,
    explanation: "Soldering = por debajo de 840°F (450°C). Brazing = por encima de 840°F. La temperatura define el proceso."
  ,
    question_en: "What is the technical difference between soldering and brazing based on temperature?",
    options_en: ["Soldering is above 840 degrees F and brazing is below", "Soldering is below 840 degrees F and brazing is above", "There is no difference, they are the exact same process", "Soldering uses MAP gas and brazing uses propane only"],
    explanation_en: "Soldering = below 840 degrees F (450 degrees C). Brazing = above 840 degrees F. Temperature defines the process."
  },
  {
    category: "Soldadura",
    q: "¿Qué gas combustible con oxígeno produce la llama más caliente para brazing de cobre en HVAC?",
    options: ["Propano con oxígeno llega a 3,600°F máximo", "MAP/Pro con oxígeno llega a 3,730°F máximo", "Acetileno con oxígeno llega a 5,600°F máximo", "Butano con oxígeno llega a 3,200°F máximo"],
    correct: 2,
    explanation: "Acetileno + oxígeno = 5,600°F, la llama más caliente disponible para brazing."
  ,
    question_en: "What fuel gas with oxygen produces the hottest flame for HVAC copper brazing?",
    options_en: ["Propane with oxygen reaches 3,600 degrees F maximum", "MAP/Pro with oxygen reaches 3,730 degrees F maximum", "Acetylene with oxygen reaches 5,600 degrees F maximum", "Butane with oxygen reaches 3,200 degrees F maximum"],
    explanation_en: "Acetylene + oxygen = 5,600 degrees F, the hottest flame available for brazing."
  },
  {
    category: "Soldadura",
    q: "¿Por qué se debe fluir nitrógeno dentro del tubo de cobre mientras se realiza brazing?",
    options: ["Para enfriar el tubo y evitar sobrecalentamiento", "Para prevenir oxidación interior (escama de cobre)", "Para detectar fugas mientras se suelda la unión", "Para aumentar la presión y expandir la conexión"],
    correct: 1,
    explanation: "El nitrógeno desplaza el oxígeno interno previniendo la formación de óxido de cobre (escama negra)."
  ,
    question_en: "Why must nitrogen be flowed inside the copper tube while brazing?",
    options_en: ["To cool the tube and prevent overheating", "To prevent internal oxidation (copper scale)", "To detect leaks while soldering the joint", "To increase pressure and expand the connection"],
    explanation_en: "Nitrogen displaces internal oxygen, preventing the formation of copper oxide (black scale)."
  },
  {
    category: "Soldadura",
    q: "La escama de óxido de cobre que se forma al soldar sin nitrógeno puede causar:",
    options: ["Mayor resistencia estructural en la junta soldada", "Obstrucción de válvulas y restricción de flujo", "Mejor adherencia de la soldadura al tubo cobre", "Aumento en la conductividad térmica del sistema"],
    correct: 1,
    explanation: "La escama se desprende y obstruye válvulas de expansión, filtros y capilares del sistema."
  ,
    question_en: "Copper oxide scale that forms when soldering without nitrogen can cause:",
    options_en: ["Greater structural strength in the soldered joint", "Obstruction of valves and restriction of flow", "Better adhesion of the solder to the copper tube", "Increased thermal conductivity of the system"],
    explanation_en: "The scale breaks loose and obstructs expansion valves, filters, and capillary tubes in the system."
  },
  {
    category: "Soldadura",
    q: "¿Qué tipo de aleación de soldadura se usa comúnmente para brazing de cobre a cobre en refrigeración?",
    options: ["Estaño-plomo 50/50 con núcleo de resina", "BCuP-6 (Sil-Fos) con 6% de contenido plata", "Aluminio-silicio 4047 para uniones de aluminio", "Acero inoxidable 309L con fundente especial"],
    correct: 1,
    explanation: "BCuP-6 (Sil-Fos) es la aleación estándar para cobre-cobre en refrigeración. No necesita fundente."
  ,
    question_en: "What type of brazing alloy is commonly used for copper-to-copper joints in refrigeration?",
    options_en: ["50/50 tin-lead with rosin core", "BCuP-6 (Sil-Fos) with 6% silver content", "4047 aluminum-silicon for aluminum joints", "309L stainless steel with special flux"],
    explanation_en: "BCuP-6 (Sil-Fos) is the standard alloy for copper-to-copper in refrigeration. No flux is required."
  },
  {
    category: "Soldadura",
    q: "¿Cuándo es NECESARIO usar fundente (flux) al soldar tuberías de cobre en refrigeración?",
    options: ["Siempre en toda unión de cobre con cobre", "Solo cuando se une cobre con latón o bronce", "Solo cuando la temperatura excede los 2000°F", "Nunca se usa fundente en tuberías de refrigeración"],
    correct: 1,
    explanation: "Cobre-cobre con Sil-Fos no necesita fundente. Pero cobre-latón o cobre-bronce sí requiere fundente."
  ,
    question_en: "When is flux REQUIRED when soldering copper piping in refrigeration?",
    options_en: ["Always on every copper-to-copper joint", "Only when joining copper to brass or bronze", "Only when the temperature exceeds 2000 degrees F", "Flux is never used on refrigeration piping"],
    explanation_en: "Copper-to-copper with Sil-Fos does not need flux. But copper-to-brass or copper-to-bronze requires flux."
  },
  {
    category: "Soldadura",
    q: "¿Cuál es el espacio (gap) ideal entre el tubo y el fitting para que la soldadura fluya por capilaridad?",
    options: ["0.000 a 0.001 pulgadas de espacio libre", "0.001 a 0.006 pulgadas de espacio libre", "0.010 a 0.020 pulgadas de espacio libre", "0.025 a 0.050 pulgadas de espacio libre"],
    correct: 1,
    explanation: "La acción capilar funciona óptimamente con un gap de 0.001–0.006\" entre tubo y fitting."
  ,
    question_en: "What is the ideal gap between the tube and the fitting for solder to flow by capillary action?",
    options_en: ["0.000 to 0.001 inches of clearance", "0.001 to 0.006 inches of clearance", "0.010 to 0.020 inches of clearance", "0.025 to 0.050 inches of clearance"],
    explanation_en: "Capillary action works optimally with a gap of 0.001-0.006\" between tube and fitting."
  },
  {
    category: "Soldadura",
    q: "¿Qué color de llama indica la temperatura correcta para brazing con oxiacetileno?",
    options: ["Llama amarilla brillante con punta anaranjada", "Llama azul con cono interior bien definido", "Llama roja oscura con chispas intermitentes", "Llama verde con bordes blancos luminosos"],
    correct: 1,
    explanation: "Una llama neutra azul con cono interior definido indica la mezcla y temperatura correcta."
  ,
    question_en: "What flame color indicates the correct temperature for brazing with oxy-acetylene?",
    options_en: ["Bright yellow flame with orange tip", "Blue flame with a well-defined inner cone", "Dark red flame with intermittent sparks", "Green flame with bright white edges"],
    explanation_en: "A neutral blue flame with a defined inner cone indicates the correct mixture and temperature."
  },
  {
    category: "Soldadura",
    q: "¿Por qué se debe calentar el fitting (hembra) y no el tubo (macho) al aplicar soldadura?",
    options: ["Porque el fitting es más delgado que el tubo", "Porque el calor se transfiere al tubo y jala la soldadura", "Porque el tubo se derrite más fácil que el fitting", "Porque el fitting tiene una capa de protección especial"],
    correct: 1,
    explanation: "Al calentar el fitting, el calor se conduce al tubo y la capilaridad jala la soldadura hacia dentro de la junta."
  ,
    question_en: "Why should the fitting (female) be heated and not the tube (male) when applying solder?",
    options_en: ["Because the fitting is thinner than the tube", "Because the heat transfers to the tube and draws solder in", "Because the tube melts easier than the fitting", "Because the fitting has a special protective coating"],
    explanation_en: "When the fitting is heated, heat conducts to the tube and capillary action draws solder into the joint."
  },
  {
    category: "Soldadura",
    q: "¿Cuál es el flujo de nitrógeno recomendado al purgar durante brazing de tuberías de cobre?",
    options: ["1 a 3 CFH de flujo de nitrógeno constante", "3 a 5 CFH de flujo de nitrógeno constante", "10 a 15 CFH de flujo de nitrógeno constante", "20 a 25 CFH de flujo de nitrógeno constante"],
    correct: 0,
    explanation: "Un flujo bajo de 1–3 CFH es suficiente para desplazar el oxígeno sin crear presión excesiva."
  ,
    question_en: "What is the recommended nitrogen flow rate for purging during copper pipe brazing?",
    options_en: ["1 to 3 CFH of constant nitrogen flow", "3 to 5 CFH of constant nitrogen flow", "10 to 15 CFH of constant nitrogen flow", "20 to 25 CFH of constant nitrogen flow"],
    explanation_en: "A low flow of 1-3 CFH is sufficient to displace oxygen without creating excessive pressure."
  },
  {
    category: "Soldadura",
    q: "¿Cuánto debe insertarse el tubo dentro del fitting antes de soldar para una junta correcta?",
    options: ["Hasta que toque el fondo del fitting tope", "La mitad de la profundidad del fitting copa", "Solo 1/4 de pulgada dentro del fitting copa", "No importa la profundidad de la inserción tubo"],
    correct: 0,
    explanation: "El tubo debe insertarse completamente hasta tocar el fondo (stop) del fitting para máxima superficie de contacto."
  ,
    question_en: "How far should the tube be inserted into the fitting before soldering for a proper joint?",
    options_en: ["Until it touches the bottom stop of the fitting", "Halfway into the fitting cup depth", "Only 1/4 inch into the fitting cup", "The insertion depth does not matter"],
    explanation_en: "The tube must be fully inserted until it touches the stop of the fitting for maximum contact surface area."
  },
  {
    category: "Soldadura",
    q: "¿Qué peligro existe si se sobrecalienta una unión de cobre durante el brazing con acetileno?",
    options: ["La soldadura fluye mejor y sella más rápido", "El cobre se quema, se vuelve poroso y se debilita", "El nitrógeno interior se convierte en gas tóxico", "El fitting se expande y el tubo sella sin soldadura"],
    correct: 1,
    explanation: "Sobrecalentar quema el cobre creando porosidad, debilitando la junta y causando fugas futuras."
  ,
    question_en: "What danger exists if a copper joint is overheated during brazing with acetylene?",
    options_en: ["The solder flows better and seals faster", "The copper burns, becomes porous, and weakens", "The nitrogen inside converts to toxic gas", "The fitting expands and the tube seals without solder"],
    explanation_en: "Overheating burns the copper, creating porosity, weakening the joint, and causing future leaks."
  },
  {
    category: "Soldadura",
    q: "¿Qué precaución se debe tomar al soldar cerca de materiales combustibles como madera o aislamiento?",
    options: ["Soldar más rápido para reducir la exposición", "Usar una tela ignífuga (fire cloth) como barrera", "Mojar la madera con agua antes de comenzar", "No es necesaria ninguna precaución adicional"],
    correct: 1,
    explanation: "Siempre colocar tela ignífuga (fire cloth/blanket) entre la llama y materiales combustibles."
  ,
    question_en: "What precaution must be taken when soldering near combustible materials like wood or insulation?",
    options_en: ["Solder faster to reduce exposure time", "Use a fire-resistant cloth (fire cloth) as a barrier", "Wet the wood with water before starting", "No additional precautions are necessary"],
    explanation_en: "Always place a fire cloth/blanket between the flame and combustible materials."
  },
  {
    category: "Soldadura",
    q: "Al soldar una línea de líquido de 3/8\" a un fitting de cobre, ¿qué diámetro de varilla Sil-Fos se recomienda?",
    options: ["Varilla de 1/16 de pulgada de diámetro fino", "Varilla de 3/32 de pulgada de diámetro medio", "Varilla de 1/4 de pulgada de diámetro grueso", "Varilla de 3/8 de pulgada de diámetro extra"],
    correct: 1,
    explanation: "Para tuberías de 3/8\", la varilla de 3/32\" es el diámetro estándar que fluye bien por capilaridad."
  ,
    question_en: "When soldering a 3/8\" liquid line to a copper fitting, what diameter Sil-Fos rod is recommended?",
    options_en: ["1/16 inch diameter thin rod", "3/32 inch diameter medium rod", "1/4 inch diameter thick rod", "3/8 inch diameter extra rod"],
    explanation_en: "For 3/8\" piping, the 3/32\" rod is the standard diameter that flows well by capillary action."
  },
  {
    category: "Soldadura",
    q: "¿Qué debe hacer el técnico si la soldadura forma una bola y no fluye hacia dentro de la junta?",
    options: ["Agregar más soldadura hasta que penetre al fin", "El cobre no está suficientemente caliente aún", "Cambiar a una varilla de soldadura más gruesa", "Soplar aire comprimido para forzar la soldadura"],
    correct: 1,
    explanation: "Si la soldadura forma bolita, el metal base no alcanzó la temperatura necesaria para capilaridad."
  ,
    question_en: "What should the technician do if the solder forms a ball and does not flow into the joint?",
    options_en: ["Add more solder until it finally penetrates", "The copper is not hot enough yet", "Switch to a thicker solder rod", "Blow compressed air to force the solder in"],
    explanation_en: "If the solder balls up, the base metal has not reached the temperature needed for capillary action."
  },
  {
    category: "Soldadura",
    q: "¿Cuál es la presión correcta del regulador de acetileno para brazing de tuberías HVAC típicas?",
    options: ["1 a 3 psi en el regulador de acetileno", "5 a 7 psi en el regulador de acetileno", "10 a 15 psi en el regulador de acetileno", "20 a 25 psi en el regulador de acetileno"],
    correct: 1,
    explanation: "5–7 psi es el rango típico para brazing HVAC. Nunca exceder 15 psi por riesgo de explosión."
  ,
    question_en: "What is the correct acetylene regulator pressure for typical HVAC pipe brazing?",
    options_en: ["1 to 3 psi on the acetylene regulator", "5 to 7 psi on the acetylene regulator", "10 to 15 psi on the acetylene regulator", "20 to 25 psi on the acetylene regulator"],
    explanation_en: "5-7 psi is the typical range for HVAC brazing. Never exceed 15 psi due to explosion risk."
  },
  {
    category: "Soldadura",
    q: "¿Por qué NUNCA se debe usar soldadura con contenido de plomo en tuberías de agua potable?",
    options: ["Porque el plomo debilita la junta de cobre a largo plazo", "Porque el plomo contamina el agua y causa envenenamiento", "Porque el plomo no adhiere bien al cobre húmedo", "Porque el plomo requiere temperaturas demasiado altas"],
    correct: 1,
    explanation: "El plomo es tóxico. La EPA prohíbe soldadura con plomo en sistemas de agua potable desde 1986."
  ,
    question_en: "Why should lead-containing solder NEVER be used on potable water piping?",
    options_en: ["Because lead weakens the copper joint long-term", "Because lead contaminates the water and causes poisoning", "Because lead does not adhere well to wet copper", "Because lead requires excessively high temperatures"],
    explanation_en: "Lead is toxic. The EPA has prohibited lead solder in potable water systems since 1986."
  },
  {
    category: "Soldadura",
    q: "Al terminar una soldadura, ¿cómo se debe enfriar la junta de cobre correctamente?",
    options: ["Sumergir en agua fría inmediatamente después", "Dejar enfriar naturalmente al aire sin forzar", "Soplar con aire comprimido para enfriar rápido", "Aplicar hielo directamente sobre la junta caliente"],
    correct: 1,
    explanation: "Enfriar bruscamente puede causar estrés térmico y grietas. Siempre dejar enfriar al aire naturalmente."
  ,
    question_en: "After finishing a solder joint, how should the copper joint be cooled properly?",
    options_en: ["Submerge in cold water immediately after", "Allow it to cool naturally in air without forcing", "Blow with compressed air to cool quickly", "Apply ice directly on the hot joint"],
    explanation_en: "Rapid cooling can cause thermal stress and cracks. Always let it cool naturally in air."
  },
  // ── Leak Testing (~30 preguntas) ──
  {
    category: "Leak Testing",
    q: "¿Cuál es la presión recomendada de nitrógeno para una prueba de fugas en un sistema de R-410A nuevo?",
    options: ["150 psi de presión de prueba con nitrógeno", "300 psi de presión de prueba con nitrógeno", "500 psi de presión de prueba con nitrógeno", "750 psi de presión de prueba con nitrógeno"],
    correct: 2,
    explanation: "Para R-410A se prueba a ~500 psi ya que la presión de trabajo del sistema es alta (400+ psi)."
  ,
    question_en: "What is the recommended nitrogen pressure for a leak test on a new R-410A system?",
    options_en: ["150 psi nitrogen test pressure", "300 psi nitrogen test pressure", "500 psi nitrogen test pressure", "750 psi nitrogen test pressure"],
    explanation_en: "For R-410A, testing is done at ~500 psi since the system's working pressure is high (400+ psi)."
  },
  {
    category: "Leak Testing",
    q: "¿Qué método de detección de fugas usa burbujas para identificar el punto exacto de la fuga?",
    options: ["Detector electrónico de halógenos refrigerante", "Solución de jabón o espuma aplicada en juntas", "Lámpara ultravioleta con tinte fluorescente UV", "Manómetro de presión estática de nitrógeno seco"],
    correct: 1,
    explanation: "La solución jabonosa crea burbujas visibles exactamente donde el gas escapa de la junta."
  ,
    question_en: "What leak detection method uses bubbles to identify the exact point of the leak?",
    options_en: ["Electronic halogen refrigerant detector", "Soap solution or foam applied on joints", "UV lamp with fluorescent UV dye", "Static nitrogen pressure manometer"],
    explanation_en: "The soap solution creates visible bubbles exactly where gas escapes from the joint."
  },
  {
    category: "Leak Testing",
    q: "¿Cuánto tiempo mínimo se debe mantener la presión de nitrógeno para una prueba de fugas válida?",
    options: ["5 minutos de observación del manómetro", "15 minutos de observación del manómetro", "30 minutos de observación del manómetro", "24 horas de observación del manómetro"],
    correct: 2,
    explanation: "Mínimo 30 minutos observando que la presión no baje. Muchos códigos piden 24 horas para sistemas nuevos."
  ,
    question_en: "What is the minimum time nitrogen pressure must be held for a valid leak test?",
    options_en: ["5 minutes of gauge observation", "15 minutes of gauge observation", "30 minutes of gauge observation", "24 hours of gauge observation"],
    explanation_en: "Minimum 30 minutes observing that pressure does not drop. Many codes require 24 hours for new systems."
  },
  {
    category: "Leak Testing",
    q: "Un detector electrónico de fugas con sensibilidad de 0.1 oz/año puede detectar fugas que:",
    options: ["Solo son visibles a simple vista como burbuja", "Son extremadamente pequeñas e invisibles al ojo", "Solo ocurren cuando el sistema está apagado frío", "Solo se presentan en tuberías mayores a 2 pulgadas"],
    correct: 1,
    explanation: "Los detectores electrónicos modernos detectan fugas microscópicas de 0.1 oz/año, invisibles para métodos básicos."
  ,
    question_en: "An electronic leak detector with a sensitivity of 0.1 oz/year can detect leaks that:",
    options_en: ["Are only visible to the naked eye as a bubble", "Are extremely small and invisible to the eye", "Only occur when the system is off and cold", "Only occur in piping larger than 2 inches"],
    explanation_en: "Modern electronic detectors detect microscopic leaks of 0.1 oz/year, invisible to basic methods."
  },
  {
    category: "Leak Testing",
    q: "¿Qué tipo de detector electrónico es el más sensible para detectar fugas de refrigerantes HFC?",
    options: ["Detector de diodo calentado tipo halógeno viejo", "Detector de sensor infrarrojo de alta sensibilidad", "Detector de corona tipo llama con propano encendido", "Detector ultrasónico de frecuencia audible estándar"],
    correct: 1,
    explanation: "Los detectores infrarrojos son los más sensibles y estables para HFC como R-410A y R-134a."
  ,
    question_en: "What type of electronic detector is the most sensitive for detecting HFC refrigerant leaks?",
    options_en: ["Old heated-diode halogen type detector", "High-sensitivity infrared sensor detector", "Corona-type flame detector with lit propane", "Standard audible frequency ultrasonic detector"],
    explanation_en: "Infrared detectors are the most sensitive and stable for HFC like R-410A and R-134a."
  },
  {
    category: "Leak Testing",
    q: "¿Por qué se debe presurizar PRIMERO con una pequeña cantidad de refrigerante antes del nitrógeno al buscar fugas?",
    options: ["Para lubricar las juntas y válvulas del sistema", "Para que el detector electrónico tenga gas que detectar", "Para calentar el sistema antes de la prueba de presión", "Para verificar que el compresor funciona correctamente"],
    correct: 1,
    explanation: "El nitrógeno es indetectable. Se agrega un trace de refrigerante para que el detector lo identifique."
  ,
    question_en: "Why should a small amount of refrigerant be pressurized FIRST before nitrogen when searching for leaks?",
    options_en: ["To lubricate the system joints and valves", "So the electronic detector has gas to detect", "To heat the system before the pressure test", "To verify that the compressor works correctly"],
    explanation_en: "Nitrogen is undetectable. A trace of refrigerant is added so the detector can identify it."
  },
  {
    category: "Leak Testing",
    q: "Si durante una prueba de presión el manómetro baja 5 psi en 30 minutos, ¿qué indica?",
    options: ["La prueba pasó — 5 psi es variación normal térmica", "El sistema tiene una fuga que debe encontrarse y reparar", "El manómetro está descalibrado y necesita reemplazo", "La temperatura ambiente causó la caída de presión únicamente"],
    correct: 1,
    explanation: "Una caída de 5 psi en 30 min indica fuga. Los cambios por temperatura son de ~1-2 psi en ese periodo."
  ,
    question_en: "If the gauge drops 5 psi in 30 minutes during a pressure test, what does it indicate?",
    options_en: ["The test passed — 5 psi is normal thermal variation", "The system has a leak that must be found and repaired", "The gauge is out of calibration and needs replacement", "The ambient temperature caused the pressure drop only"],
    explanation_en: "A 5 psi drop in 30 min indicates a leak. Temperature changes account for only ~1-2 psi in that period."
  },
  {
    category: "Leak Testing",
    q: "¿Qué es el standing pressure test y cuánto tiempo debe durar para un sistema residencial nuevo?",
    options: ["Presurizar y soltar 3 veces en 10 minutos total", "Mantener presión constante mínimo 24 horas observando", "Subir y bajar la presión cada hora durante 8 horas", "Aplicar vacío profundo durante 30 minutos solamente"],
    correct: 1,
    explanation: "El standing pressure test mantiene presión constante por 24 horas para confirmar hermeticidad total."
  ,
    question_en: "What is the standing pressure test and how long should it last for a new residential system?",
    options_en: ["Pressurize and release 3 times in 10 minutes total", "Maintain constant pressure for a minimum of 24 hours while observing", "Raise and lower pressure every hour for 8 hours", "Apply deep vacuum for 30 minutes only"],
    explanation_en: "The standing pressure test maintains constant pressure for 24 hours to confirm total tightness."
  },
  {
    category: "Leak Testing",
    q: "¿Dónde es MÁS probable encontrar una fuga en un sistema de refrigeración recién instalado?",
    options: ["En el centro de los tubos de cobre rectos", "En las juntas soldadas y conexiones flare nuevas", "En el cuerpo del compresor hermético sellado", "En la placa del evaporador de aluminio interior"],
    correct: 1,
    explanation: "Las soldaduras y flares recién hechos son los puntos más probables de fuga en instalación nueva."
  ,
    question_en: "Where is a leak MOST likely to be found in a newly installed refrigeration system?",
    options_en: ["In the center of the straight copper tubes", "At soldered joints and new flare connections", "In the body of the sealed hermetic compressor", "On the interior aluminum evaporator plate"],
    explanation_en: "Newly made solder joints and flare connections are the most likely leak points in a new installation."
  },
  {
    category: "Leak Testing",
    q: "¿Cuál es el método correcto para presurizar un sistema con nitrógeno para prueba de fugas?",
    options: ["Abrir la válvula del tanque completamente de golpe", "Subir la presión gradualmente con regulador controlado", "Llenar primero el lado de alta y luego el bajo", "Conectar el nitrógeno directamente sin regulador válvula"],
    correct: 1,
    explanation: "SIEMPRE usar regulador y subir presión gradualmente para evitar shock de presión en componentes."
  ,
    question_en: "What is the correct method to pressurize a system with nitrogen for leak testing?",
    options_en: ["Open the tank valve completely at once", "Raise pressure gradually with a controlled regulator", "Fill the high side first then the low side", "Connect nitrogen directly without a regulator valve"],
    explanation_en: "ALWAYS use a regulator and raise pressure gradually to avoid pressure shock on components."
  },
  {
    category: "Leak Testing",
    q: "¿Qué componente del sistema NUNCA debe presurizarse a más de 150 psi durante una prueba?",
    options: ["El condensador del lado de alta presión", "El compresor scroll hermético del sistema AC", "La válvula de servicio de la línea de succión", "Los transductores de presión o presostatos frágiles"],
    correct: 3,
    explanation: "Los presostatos y transductores tienen límites de presión bajos y pueden dañarse con presión de prueba alta."
  ,
    question_en: "What system component should NEVER be pressurized above 150 psi during a test?",
    options_en: ["The high-pressure side condenser", "The system's hermetic scroll compressor", "The suction line service valve", "Fragile pressure transducers or pressure switches"],
    explanation_en: "Pressure switches and transducers have low pressure limits and can be damaged by high test pressure."
  },
  {
    category: "Leak Testing",
    q: "¿Qué ventaja tiene el tinte UV sobre el detector electrónico para encontrar fugas?",
    options: ["El tinte UV es más sensible que el electrónico", "El tinte UV marca la ubicación exacta permanentemente", "El tinte UV funciona sin presión en el sistema AC", "El tinte UV detecta fugas en tuberías de agua también"],
    correct: 1,
    explanation: "El tinte UV deja marca visible fluorescente exactamente donde está la fuga, incluso fugas intermitentes."
  ,
    question_en: "What advantage does UV dye have over an electronic detector for finding leaks?",
    options_en: ["UV dye is more sensitive than the electronic detector", "UV dye marks the exact location permanently", "UV dye works without pressure in the AC system", "UV dye detects leaks in water piping too"],
    explanation_en: "UV dye leaves a visible fluorescent mark exactly where the leak is, even for intermittent leaks."
  },
  {
    category: "Leak Testing",
    q: "¿Qué se debe hacer si se encuentra una fuga en una soldadura durante la prueba de presión?",
    options: ["Agregar más soldadura encima de la junta vieja", "Despresurizar, limpiar, recalentar y resoldar la junta", "Apretar la junta con una llave hasta que selle mejor", "Aplicar sellador epóxico sobre la soldadura con fuga"],
    correct: 1,
    explanation: "Se debe despresurizar completamente, limpiar la junta, y resoldar correctamente. Nunca parchar."
  ,
    question_en: "What should be done if a leak is found in a solder joint during a pressure test?",
    options_en: ["Add more solder on top of the old joint", "Depressurize, clean, reheat, and re-solder the joint", "Tighten the joint with a wrench until it seals better", "Apply epoxy sealant over the leaking solder joint"],
    explanation_en: "You must fully depressurize, clean the joint, and re-solder correctly. Never patch."
  },
  {
    category: "Leak Testing",
    q: "Un sistema pierde 2 psi de presión durante la noche pero la temperatura bajó 15°F. ¿Qué haces?",
    options: ["El sistema tiene una fuga lenta, buscar con jabón", "Calcular la caída por temperatura antes de concluir fuga", "Agregar más nitrógeno y repetir la prueba otra vez", "Reemplazar el manómetro por uno digital más preciso"],
    correct: 1,
    explanation: "Los cambios de temperatura afectan la presión (Ley de Gay-Lussac). Se debe compensar antes de declarar fuga."
  ,
    question_en: "A system loses 2 psi of pressure overnight but the temperature dropped 15 degrees F. What do you do?",
    options_en: ["The system has a slow leak, search with soap", "Calculate the drop due to temperature before concluding a leak", "Add more nitrogen and repeat the test again", "Replace the gauge with a more accurate digital one"],
    explanation_en: "Temperature changes affect pressure (Gay-Lussac's Law). You must compensate before declaring a leak."
  },
  {
    category: "Leak Testing",
    q: "¿Por qué es importante buscar fugas con el sistema presurizado y NO en vacío?",
    options: ["Porque el vacío destruye los componentes internos", "Porque la presión empuja gas hacia afuera haciéndola detectable", "Porque el vacío congela las tuberías de cobre del sistema", "Porque la presión calienta el gas y es más fácil de oler"],
    correct: 1,
    explanation: "Bajo presión, el gas escapa hacia afuera donde puede detectarse. En vacío, el aire entra y no se nota."
  ,
    question_en: "Why is it important to search for leaks with the system pressurized and NOT under vacuum?",
    options_en: ["Because vacuum destroys internal components", "Because pressure pushes gas outward making it detectable", "Because vacuum freezes the copper piping in the system", "Because pressure heats the gas and it is easier to smell"],
    explanation_en: "Under pressure, gas escapes outward where it can be detected. Under vacuum, air enters and is not noticeable."
  },
  {
    category: "Leak Testing",
    q: "¿Cuál es la tasa máxima de fuga anual permitida por EPA para un sistema comercial de refrigeración?",
    options: ["5% de la carga total de refrigerante por año", "10% de la carga total de refrigerante por año", "20% de la carga total de refrigerante por año", "30% de la carga total de refrigerante por año"],
    correct: 2,
    explanation: "EPA permite máximo 20% para equipos comerciales y 30% para confort (AC) antes de requerir reparación."
  ,
    question_en: "What is the maximum annual leak rate allowed by EPA for a commercial refrigeration system?",
    options_en: ["5% of total refrigerant charge per year", "10% of total refrigerant charge per year", "20% of total refrigerant charge per year", "30% of total refrigerant charge per year"],
    explanation_en: "EPA allows a maximum of 20% for commercial equipment and 30% for comfort (AC) before requiring repair."
  },
  {
    category: "Leak Testing",
    q: "¿Qué herramienta se usa para encontrar fugas en la válvula Schrader de la línea de servicio?",
    options: ["Manómetro digital conectado a la válvula directamente", "Gota de aceite o jabón aplicada sobre el pin central", "Termómetro infrarrojo apuntando a la válvula Schrader", "Amperímetro de gancho midiendo la corriente del sistema"],
    correct: 1,
    explanation: "Una gota de jabón sobre el pin Schrader revela burbujas si hay fuga en el sello interno."
  ,
    question_en: "What tool is used to find leaks in the Schrader valve of the service line?",
    options_en: ["Digital gauge connected directly to the valve", "A drop of oil or soap applied over the center pin", "Infrared thermometer pointed at the Schrader valve", "Clamp ammeter measuring the system current"],
    explanation_en: "A drop of soap over the Schrader pin reveals bubbles if there is a leak in the internal seal."
  },
  {
    category: "Leak Testing",
    q: "Después de reparar una fuga y antes de cargar refrigerante, ¿qué proceso es obligatorio?",
    options: ["Presurizar el sistema con refrigerante a baja presión", "Evacuar el sistema con bomba de vacío hasta 500 micrones", "Encender el compresor para circular aceite lubricante", "Conectar el detector electrónico para verificar de nuevo"],
    correct: 1,
    explanation: "Después de reparar, se debe evacuar a 500 micrones o menos para remover aire y humedad."
  ,
    question_en: "After repairing a leak and before charging refrigerant, what process is mandatory?",
    options_en: ["Pressurize the system with refrigerant at low pressure", "Evacuate the system with a vacuum pump to 500 microns", "Start the compressor to circulate lubricating oil", "Connect the electronic detector to verify again"],
    explanation_en: "After repair, the system must be evacuated to 500 microns or less to remove air and moisture."
  },
  {
    category: "Leak Testing",
    q: "¿Cuál es la diferencia entre una prueba de fugas con presión positiva y una prueba de decay?",
    options: ["Son exactamente el mismo proceso con diferente nombre", "La prueba de decay mide la caída de presión en el tiempo", "La prueba positiva usa vacío y la de decay usa presión", "La prueba de decay solo se aplica en sistemas de agua"],
    correct: 1,
    explanation: "La prueba de decay (pressure decay) presuriza y monitorea si la presión decae con el tiempo, indicando fuga."
  ,
    question_en: "What is the difference between a positive pressure leak test and a decay test?",
    options_en: ["They are exactly the same process with different names", "The decay test measures the pressure drop over time", "The positive test uses vacuum and the decay test uses pressure", "The decay test only applies to water systems"],
    explanation_en: "The pressure decay test pressurizes and monitors if pressure decays over time, indicating a leak."
  },
  {
    category: "Leak Testing",
    q: "¿Por qué se recomienda usar nitrógeno libre de oxígeno (OFN) y no aire comprimido para pruebas?",
    options: ["El aire comprimido es más caro que el nitrógeno seco", "El aire tiene humedad y oxígeno que contaminan el sistema", "El aire comprimido no alcanza suficiente presión de prueba", "El nitrógeno es más pesado y detecta fugas más fácilmente"],
    correct: 1,
    explanation: "El aire contiene humedad y oxígeno que causan corrosión y ácidos dentro del sistema de refrigeración."
  ,
    question_en: "Why is it recommended to use oxygen-free nitrogen (OFN) and not compressed air for testing?",
    options_en: ["Compressed air is more expensive than dry nitrogen", "Air has moisture and oxygen that contaminate the system", "Compressed air cannot reach sufficient test pressure", "Nitrogen is heavier and detects leaks more easily"],
    explanation_en: "Air contains moisture and oxygen that cause corrosion and acids inside the refrigeration system."
  },
  {
    category: "Leak Testing",
    q: "Si un técnico escucha un silbido en una conexión flare presurizada con nitrógeno, ¿qué indica?",
    options: ["El nitrógeno está fluyendo correctamente por el sistema", "Hay una fuga significativa en esa conexión flare apretada", "El regulador del tanque de nitrógeno necesita ajuste fino", "La válvula de servicio está abierta correctamente como debe"],
    correct: 1,
    explanation: "Un silbido audible indica una fuga grande. Se debe despresurizar, reapretar o rehacer el flare."
  ,
    question_en: "If a technician hears a hissing sound at a pressurized flare connection with nitrogen, what does it indicate?",
    options_en: ["The nitrogen is flowing correctly through the system", "There is a significant leak at that tightened flare connection", "The nitrogen tank regulator needs fine adjustment", "The service valve is correctly open as it should be"],
    explanation_en: "An audible hissing indicates a large leak. Depressurize, re-tighten, or redo the flare."
  },
  // ── Preguntas adicionales: Fasteners, Soldering, Brazing, Leak Testing, Tuberías, Herramientas ──
  {
    category: "Fasteners",
    q: "¿Qué ventaja tiene un tornillo de cabeza hexagonal sobre uno Phillips para ductos de metal?",
    options: ["Se puede apretar con los dedos sin herramienta alguna", "Permite mayor torque sin deslizarse de la cabeza hex", "Es más barato que cualquier otro tipo de tornillo", "Solo se usa en ductos de plástico flexible residencial"],
    correct: 1,
    explanation: "La cabeza hexagonal permite aplicar más torque con dado o llave sin que la herramienta se resbale, a diferencia del Phillips que se 'strip' fácilmente."
  ,
    question_en: "What advantage does a hex head screw have over a Phillips screw for metal ductwork?",
    options_en: ["It can be tightened by hand without any tools", "It allows higher torque without slipping off the hex head", "It is cheaper than any other type of screw", "It is only used on flexible plastic residential duct"],
    explanation_en: "The hex head allows more torque with a socket or wrench without the tool slipping, unlike Phillips which strips easily."
  },
  {
    category: "Fasteners",
    q: "¿Por qué se usan arandelas de neopreno en tornillos que penetran lámina de ducto expuesta a la intemperie?",
    options: ["Para reducir la vibración del ducto durante operación", "Para sellar el orificio y prevenir entrada de agua lluvia", "Para aumentar la resistencia eléctrica del tornillo metal", "Para que el tornillo no se oxide internamente con el tiempo"],
    correct: 1,
    explanation: "Las arandelas de neopreno crean un sello impermeable alrededor del tornillo, evitando infiltración de agua en ductos exteriores."
  ,
    question_en: "Why are neoprene washers used on screws that penetrate duct sheet metal exposed to weather?",
    options_en: ["To reduce duct vibration during operation", "To seal the hole and prevent rainwater entry", "To increase the electrical resistance of the metal screw", "So the screw does not rust internally over time"],
    explanation_en: "Neoprene washers create a watertight seal around the screw, preventing water infiltration in outdoor ducts."
  },
  {
    category: "Fasteners",
    q: "¿Cuál es el riesgo de usar anclajes de expansión en concreto que no ha curado completamente?",
    options: ["El anclaje se expande demasiado y rompe el concreto débil", "El concreto seca más rápido por el calor del anclaje metal", "El anclaje se corroe inmediatamente por la humedad del cemento", "No hay ningún riesgo, los anclajes funcionan igual en concreto verde"],
    correct: 0,
    explanation: "El concreto sin curar no tiene la resistencia compresiva necesaria. La expansión del anclaje puede fracturar el concreto, causando falla de soporte."
  ,
    question_en: "What is the risk of using expansion anchors in concrete that has not fully cured?",
    options_en: ["The anchor expands too much and cracks the weak concrete", "The concrete dries faster from the heat of the metal anchor", "The anchor corrodes immediately from the moisture in the cement", "There is no risk; anchors work the same in green concrete"],
    explanation_en: "Uncured concrete does not have the compressive strength needed. Anchor expansion can fracture the concrete, causing support failure."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de remache es más apropiado para unir dos piezas de ducto de aluminio?",
    options: ["Remache de acero inoxidable con mandril de aluminio puro", "Remache de aluminio con mandril de aluminio para evitar corrosión", "Remache de cobre con mandril de bronce para mejor sellado", "Remache de hierro negro con mandril de acero galvanizado"],
    correct: 1,
    explanation: "Se debe usar remache del mismo metal (aluminio-aluminio) para evitar corrosión galvánica entre metales diferentes."
  ,
    question_en: "What type of rivet is most appropriate for joining two pieces of aluminum ductwork?",
    options_en: ["Stainless steel rivet with pure aluminum mandrel", "Aluminum rivet with aluminum mandrel to avoid corrosion", "Copper rivet with bronze mandrel for better sealing", "Black iron rivet with galvanized steel mandrel"],
    explanation_en: "Use a rivet of the same metal (aluminum-aluminum) to avoid galvanic corrosion between different metals."
  },
  {
    category: "Fasteners",
    q: "¿Cada cuántos pies se deben colocar soportes para tubería de cobre horizontal de 7/8 pulgada?",
    options: ["Cada 2 pies de distancia máxima entre soportes fijos", "Cada 4 pies de distancia máxima entre soportes fijos", "Cada 6 pies de distancia máxima entre soportes fijos", "Cada 10 pies de distancia máxima entre soportes fijos"],
    correct: 2,
    explanation: "Para tubería de cobre de 7/8\" horizontal, el código requiere soportes cada 6 pies máximo para prevenir pandeo."
  ,
    question_en: "How often must supports be placed for 7/8 inch horizontal copper tubing?",
    options_en: ["Every 2 feet maximum distance between fixed supports", "Every 4 feet maximum distance between fixed supports", "Every 6 feet maximum distance between fixed supports", "Every 10 feet maximum distance between fixed supports"],
    explanation_en: "For 7/8\" horizontal copper pipe, code requires supports every 6 feet maximum to prevent sagging."
  },
  {
    category: "Fasteners",
    q: "¿Qué tipo de abrazadera se recomienda para sostener tubería de refrigerante contra vibración del compresor?",
    options: ["Abrazadera rígida de acero soldada directamente al tubo", "Abrazadera con aislador de goma para absorber vibración", "Abrazadera de plástico zip tie apretada al máximo posible", "Cinta adhesiva de aluminio envuelta firmemente alrededor del tubo"],
    correct: 1,
    explanation: "Las abrazaderas con aislador de goma absorben la vibración del compresor, previniendo fatiga y fractura del tubo de cobre."
  ,
    question_en: "What type of clamp is recommended for supporting refrigerant tubing against compressor vibration?",
    options_en: ["Rigid steel clamp welded directly to the tube", "Clamp with rubber isolator to absorb vibration", "Tight maximum plastic zip tie clamp", "Aluminum adhesive tape wrapped firmly around the tube"],
    explanation_en: "Clamps with rubber isolators absorb compressor vibration, preventing fatigue and fracture of the copper tube."
  },
  {
    category: "Soldering",
    q: "¿Qué sucede si aplicas demasiado flux al soldar una unión de cobre?",
    options: ["La soldadura fluye mejor y la unión queda más fuerte", "El exceso de flux puede quedar atrapado y causar corrosión interna", "El flux extra se evapora completamente sin dejar ningún residuo", "La tubería se derrite más rápido por el exceso de químicos"],
    correct: 1,
    explanation: "El flux atrapado dentro de la unión es corrosivo. Con el tiempo erosiona el cobre desde adentro, causando fugas."
  ,
    question_en: "What happens if you apply too much flux when soldering a copper joint?",
    options_en: ["The solder flows better and the joint is stronger", "Excess flux can become trapped and cause internal corrosion", "Extra flux evaporates completely without leaving any residue", "The pipe melts faster from the excess chemicals"],
    explanation_en: "Trapped flux inside the joint is corrosive. Over time it erodes the copper from the inside, causing leaks."
  },
  {
    category: "Soldering",
    q: "¿Por qué se debe calentar el tubo hembra (fitting) y no el tubo macho al soldar cobre?",
    options: ["Porque el tubo macho es más grueso y no necesita calor directo", "Porque el calor del fitting se transfiere al tubo y atrae la soldadura", "Porque calentar el macho derrite el flux antes de que funcione bien", "Porque el código prohíbe calentar directamente el tubo exterior macho"],
    correct: 1,
    explanation: "Al calentar el fitting, la acción capilar atrae la soldadura hacia adentro de la unión. Si calientas el tubo, la soldadura se aleja."
  ,
    question_en: "Why should the female tube (fitting) be heated and not the male tube when soldering copper?",
    options_en: ["Because the male tube is thicker and does not need direct heat", "Because heat from the fitting transfers to the tube and attracts the solder", "Because heating the male melts the flux before it can work properly", "Because code prohibits heating the outer male tube directly"],
    explanation_en: "When heating the fitting, capillary action draws solder into the joint. If you heat the tube, solder moves away."
  },
  {
    category: "Soldering",
    q: "¿Cuál es la temperatura aproximada de fusión de la soldadura sin plomo (lead-free) usada en plomería?",
    options: ["250 grados Fahrenheit de temperatura de fusión aproximada", "450 grados Fahrenheit de temperatura de fusión aproximada", "600 grados Fahrenheit de temperatura de fusión aproximada", "900 grados Fahrenheit de temperatura de fusión aproximada"],
    correct: 1,
    explanation: "La soldadura sin plomo (95/5 o similar) funde alrededor de 450°F. Es más alta que la soldadura con plomo (361°F)."
  ,
    question_en: "What is the approximate melting temperature of lead-free solder used in plumbing?",
    options_en: ["250 degrees Fahrenheit melting temperature approximately", "450 degrees Fahrenheit melting temperature approximately", "600 degrees Fahrenheit melting temperature approximately", "900 degrees Fahrenheit melting temperature approximately"],
    explanation_en: "Lead-free solder (95/5 or similar) melts at around 450 degrees F. This is higher than leaded solder (361 degrees F)."
  },
  {
    category: "Soldering",
    q: "¿Cómo se identifica visualmente una unión de soldadura 'fría' o defectuosa?",
    options: ["La unión se ve brillante y lisa con superficie uniforme plateada", "La unión se ve opaca, granulosa y con grumos irregulares", "La unión cambia de color a verde brillante inmediatamente después", "La unión produce un sonido hueco al golpearla con un destornillador"],
    correct: 1,
    explanation: "Una soldadura fría tiene apariencia opaca y granulosa porque el metal no fluyó correctamente. Una buena soldadura se ve lisa y brillante."
  ,
    question_en: "How do you visually identify a 'cold' or defective solder joint?",
    options_en: ["The joint looks shiny and smooth with a uniform silver surface", "The joint looks dull, grainy, and with irregular lumps", "The joint immediately turns bright green after cooling", "The joint produces a hollow sound when tapped with a screwdriver"],
    explanation_en: "A cold solder joint has a dull and grainy appearance because the metal did not flow properly. A good joint looks smooth and shiny."
  },
  {
    category: "Soldering",
    q: "¿Qué profundidad debe penetrar el tubo dentro del fitting para una unión de soldadura correcta?",
    options: ["Hasta la mitad de la copa del fitting como máximo", "Hasta el tope de la copa del fitting completamente insertado", "Solo un cuarto de pulgada dentro del fitting es suficiente", "No importa la profundidad siempre que haya soldadura visible"],
    correct: 1,
    explanation: "El tubo debe insertarse completamente hasta el tope del fitting para maximizar el área de contacto y la resistencia de la unión."
  ,
    question_en: "How deep must the tube penetrate inside the fitting for a correct solder joint?",
    options_en: ["Halfway into the fitting cup at most", "All the way to the stop of the fitting cup, fully inserted", "Only one quarter inch inside the fitting is enough", "Depth does not matter as long as solder is visible"],
    explanation_en: "The tube must be fully inserted to the stop of the fitting to maximize contact area and joint strength."
  },
  {
    category: "Soldering",
    q: "¿Por qué es importante purgar con nitrógeno mientras se suelda o braza tubería de refrigeración?",
    options: ["Para enfriar la tubería y evitar que se derrita el cobre", "Para prevenir oxidación interna que contamina el sistema refrigerante", "Para aumentar la presión y que la soldadura penetre más profundo", "Para detectar fugas mientras se realiza la soldadura del tubo"],
    correct: 1,
    explanation: "Sin purga de nitrógeno, el calor crea escamas de óxido dentro del tubo que contaminan el aceite y tapan válvulas del sistema."
  ,
    question_en: "Why is it important to purge with nitrogen while soldering or brazing refrigeration piping?",
    options_en: ["To cool the piping and prevent the copper from melting", "To prevent internal oxidation that contaminates the refrigerant system", "To increase pressure so the solder penetrates deeper", "To detect leaks while performing the tube soldering"],
    explanation_en: "Without nitrogen purging, heat creates oxide scale inside the tube that contaminates oil and clogs system valves."
  },
  {
    category: "Brazing",
    q: "¿A qué temperatura aproximada funde la aleación de plata al 15% usada en brazing de refrigeración?",
    options: ["800 grados Fahrenheit es la temperatura de fusión aproximada", "1200 grados Fahrenheit es la temperatura de fusión aproximada", "1600 grados Fahrenheit es la temperatura de fusión aproximada", "2000 grados Fahrenheit es la temperatura de fusión aproximada"],
    correct: 1,
    explanation: "Las aleaciones de plata al 15% (como Sil-Fos 15) funden alrededor de 1190-1300°F, mucho más alto que la soldadura blanda."
  ,
    question_en: "At what approximate temperature does 15% silver alloy used in refrigeration brazing melt?",
    options_en: ["800 degrees Fahrenheit approximate melting temperature", "1200 degrees Fahrenheit approximate melting temperature", "1600 degrees Fahrenheit approximate melting temperature", "2000 degrees Fahrenheit approximate melting temperature"],
    explanation_en: "15% silver alloys (like Sil-Fos 15) melt at around 1190-1300 degrees F, much higher than soft solder."
  },
  {
    category: "Brazing",
    q: "¿Cuándo se requiere flux adicional al brazar tubería de cobre con aleación BCuP (cobre-fósforo)?",
    options: ["Siempre se necesita flux con cualquier tipo de aleación BCuP", "Solo cuando se braza cobre con latón o bronce, no cobre a cobre", "Nunca se usa flux con aleaciones BCuP bajo ninguna circunstancia", "Solo cuando la temperatura ambiente es menor a 50 grados Fahrenheit"],
    correct: 1,
    explanation: "Las aleaciones BCuP son auto-fluxing en uniones cobre-cobre. Se necesita flux solo cuando se conecta cobre con latón, bronce u otro metal."
  ,
    question_en: "When is additional flux required when brazing copper tubing with BCuP (copper-phosphorus) alloy?",
    options_en: ["Flux is always needed with any type of BCuP alloy", "Only when brazing copper to brass or bronze, not copper to copper", "Flux is never used with BCuP alloys under any circumstances", "Only when ambient temperature is below 50 degrees Fahrenheit"],
    explanation_en: "BCuP alloys are self-fluxing on copper-to-copper joints. Flux is needed only when connecting copper to brass, bronze, or another metal."
  },
  {
    category: "Brazing",
    q: "¿Qué color de llama de acetileno indica la mezcla correcta para brazing de refrigeración?",
    options: ["Llama amarilla brillante con mucho humo negro de carbono", "Llama azul neutral con cono interior bien definido y estable", "Llama verde fosforescente que indica temperatura máxima del gas", "Llama roja oscura con chispas que indica exceso de oxígeno puro"],
    correct: 1,
    explanation: "La llama neutral (azul con cono definido) tiene la proporción correcta de oxígeno/acetileno. Ni oxidante ni carburante."
  ,
    question_en: "What acetylene flame color indicates the correct mixture for refrigeration brazing?",
    options_en: ["Bright yellow flame with lots of black carbon smoke", "Blue neutral flame with a well-defined, stable inner cone", "Green phosphorescent flame indicating maximum gas temperature", "Dark red flame with sparks indicating excess pure oxygen"],
    explanation_en: "The neutral flame (blue with defined cone) has the correct oxygen/acetylene ratio. Neither oxidizing nor carburizing."
  },
  {
    category: "Brazing",
    q: "¿Por qué se envuelve un trapo mojado en válvulas de servicio al brazar cerca de ellas?",
    options: ["Para lubricar la válvula y que no se trabe durante el brazado", "Para proteger los sellos internos de la válvula del calor excesivo", "Para crear vapor que ayuda al flux a funcionar más efectivamente", "Para marcar visualmente dónde no se debe aplicar llama directa"],
    correct: 1,
    explanation: "Los sellos de neopreno/teflón dentro de las válvulas se dañan con calor. El trapo mojado actúa como disipador térmico protector."
  ,
    question_en: "Why is a wet rag wrapped around service valves when brazing near them?",
    options_en: ["To lubricate the valve so it does not seize during brazing", "To protect the internal seals of the valve from excessive heat", "To create steam that helps the flux work more effectively", "To visually mark where flame should not be applied directly"],
    explanation_en: "Neoprene/Teflon seals inside valves are damaged by heat. The wet rag acts as a thermal heat sink protector."
  },
  {
    category: "Brazing",
    q: "¿Cuál es el espacio capilar ideal entre el tubo y el fitting para brazado óptimo?",
    options: ["0.000 a 0.001 pulgadas de espacio sin holgura alguna entre piezas", "0.001 a 0.005 pulgadas de espacio capilar entre las superficies", "0.010 a 0.020 pulgadas de espacio amplio para que fluya material", "0.050 a 0.100 pulgadas de espacio grande para máxima penetración"],
    correct: 1,
    explanation: "El espacio capilar de 0.001-0.005\" permite que la acción capilar distribuya uniformemente el material de brazado en toda la unión."
  ,
    question_en: "What is the ideal capillary gap between the tube and fitting for optimal brazing?",
    options_en: ["0.000 to 0.001 inches of clearance with no gap between pieces", "0.001 to 0.005 inches of capillary space between surfaces", "0.010 to 0.020 inches of wide space for material flow", "0.050 to 0.100 inches of large space for maximum penetration"],
    explanation_en: "A capillary gap of 0.001-0.005\" allows capillary action to uniformly distribute brazing material throughout the joint."
  },
  {
    category: "Brazing",
    q: "¿Qué defecto causa mover la llama demasiado rápido durante el proceso de brazing?",
    options: ["El tubo se sobrecalienta y pierde toda su rigidez estructural", "El material de aporte no fluye completamente dejando vacíos internos", "El flux se activa prematuramente creando gases atrapados en unión", "La tubería se expande tanto que el fitting se desprende solo"],
    correct: 1,
    explanation: "Mover la llama rápido crea calentamiento desigual. El material de aporte fluye solo hacia las zonas calientes, dejando vacíos que causan fugas."
  ,
    question_en: "What defect is caused by moving the flame too quickly during the brazing process?",
    options_en: ["The tube overheats and loses all its structural rigidity", "The filler metal does not flow completely, leaving internal voids", "The flux activates prematurely creating trapped gases in the joint", "The tube expands so much that the fitting comes off by itself"],
    explanation_en: "Moving the flame quickly creates uneven heating. Filler metal flows only to hot zones, leaving voids that cause leaks."
  },
  {
    category: "Leak Testing",
    q: "¿A qué presión máxima se debe presurizar un sistema de R-410A con nitrógeno para prueba de fugas?",
    options: ["150 psi de presión máxima de prueba con nitrógeno seco", "300 psi de presión máxima de prueba con nitrógeno seco", "535 psi de presión máxima de prueba con nitrógeno seco", "750 psi de presión máxima de prueba con nitrógeno seco"],
    correct: 2,
    explanation: "Para R-410A, la presión de prueba es típicamente 535 psi (presión de diseño del lado alto). Nunca exceder la presión de prueba del fabricante."
  ,
    question_en: "What is the maximum nitrogen pressure for leak testing an R-410A system?",
    options_en: ["150 psi maximum nitrogen test pressure", "300 psi maximum nitrogen test pressure", "535 psi maximum nitrogen test pressure", "750 psi maximum nitrogen test pressure"],
    explanation_en: "For R-410A, the test pressure is typically 535 psi (high-side design pressure). Never exceed the manufacturer's test pressure."
  },
  {
    category: "Leak Testing",
    q: "¿Por qué NUNCA se debe usar oxígeno comprimido para presurizar un sistema de refrigeración?",
    options: ["Porque el oxígeno es demasiado caro para usar en pruebas de fugas", "Porque el oxígeno con aceite puede explotar violentamente bajo presión", "Porque el oxígeno contamina el refrigerante cambiando su composición", "Porque el tanque de oxígeno es muy pesado para llevar al trabajo"],
    correct: 1,
    explanation: "El oxígeno bajo presión con aceite mineral del compresor puede causar una explosión violenta. Solo se usa nitrógeno seco (OFN)."
  ,
    question_en: "Why should compressed oxygen NEVER be used to pressurize a refrigeration system?",
    options_en: ["Because oxygen is too expensive to use for leak tests", "Because oxygen with oil can explode violently under pressure", "Because oxygen contaminates the refrigerant changing its composition", "Because the oxygen tank is too heavy to carry to the job"],
    explanation_en: "Oxygen under pressure with compressor mineral oil can cause a violent explosion. Only dry nitrogen (OFN) is used."
  },
  {
    category: "Leak Testing",
    q: "¿Cuál es la ventaja del tinte UV sobre las burbujas de jabón para detectar fugas pequeñas?",
    options: ["El tinte UV es más barato que el jabón para detección de fugas", "El tinte UV detecta fugas microscópicas que el jabón no puede mostrar", "El tinte UV repara automáticamente las fugas pequeñas que encuentra", "El tinte UV solo funciona en sistemas de R-22 no en R-410A"],
    correct: 1,
    explanation: "El tinte UV circula con el aceite y revela fugas microscópicas con luz ultravioleta que las burbujas de jabón no pueden detectar."
  ,
    question_en: "What is the advantage of UV dye over soap bubbles for detecting small leaks?",
    options_en: ["UV dye is cheaper than soap for leak detection", "UV dye detects microscopic leaks that soap cannot show", "UV dye automatically repairs the small leaks it finds", "UV dye only works on R-22 systems not on R-410A"],
    explanation_en: "UV dye circulates with the oil and reveals microscopic leaks under UV light that soap bubbles cannot detect."
  },
  {
    category: "Leak Testing",
    q: "¿Cómo afecta la temperatura ambiente a la lectura de presión durante una prueba de fugas con nitrógeno?",
    options: ["La temperatura no tiene ningún efecto en la presión del nitrógeno", "Al subir la temperatura la presión sube sin que haya fuga real", "Al subir la temperatura la presión baja indicando una fuga falsa", "La presión se mantiene constante sin importar cambios de temperatura"],
    correct: 1,
    explanation: "Por la ley de Gay-Lussac, la presión del gas aumenta con la temperatura. Un aumento de temperatura puede dar lectura más alta sin fuga."
  ,
    question_en: "How does ambient temperature affect the pressure reading during a nitrogen leak test?",
    options_en: ["Temperature has no effect on nitrogen pressure", "As temperature rises, pressure rises without there being a real leak", "As temperature rises, pressure drops indicating a false leak", "Pressure stays constant regardless of temperature changes"],
    explanation_en: "By Gay-Lussac's law, gas pressure increases with temperature. A temperature rise can give a higher reading without a leak."
  },
  {
    category: "Leak Testing",
    q: "¿Cuánto tiempo mínimo debe mantenerse la presión en una prueba de fugas estándar residencial?",
    options: ["5 minutos es suficiente para confirmar que no hay fugas", "15 minutos es el tiempo mínimo para prueba de fugas rápida", "30 minutos es el mínimo pero 24 horas es lo ideal por estándar", "Solo 1 minuto basta si la presión no baja inmediatamente visible"],
    correct: 2,
    explanation: "Se recomienda un mínimo de 30 minutos, pero una prueba de 24 horas es ideal para detectar fugas lentas que no son evidentes rápidamente."
  ,
    question_en: "What is the minimum time pressure must be held in a standard residential leak test?",
    options_en: ["5 minutes is enough to confirm no leaks", "15 minutes is the minimum time for a quick leak test", "30 minutes is the minimum but 24 hours is ideal per standard", "Only 1 minute is enough if pressure does not drop immediately"],
    explanation_en: "A minimum of 30 minutes is recommended, but a 24-hour test is ideal for detecting slow leaks that are not immediately evident."
  },
  {
    category: "Leak Testing",
    q: "¿Qué puede causar una lectura falsa positiva en un detector electrónico de fugas de refrigerante?",
    options: ["Usar baterías nuevas recién instaladas en el detector electrónico", "Vapores de limpiadores, solventes o pinturas cerca del área de prueba", "Tener el detector calibrado correctamente según el manual del fabricante", "Realizar la prueba en un día soleado con buena ventilación exterior"],
    correct: 1,
    explanation: "Los detectores electrónicos pueden dar falsos positivos con vapores de solventes, pinturas, adhesivos y otros químicos volátiles."
  ,
    question_en: "What can cause a false positive reading on an electronic refrigerant leak detector?",
    options_en: ["Using freshly installed new batteries in the electronic detector", "Vapors from cleaners, solvents, or paints near the test area", "Having the detector correctly calibrated per the manufacturer's manual", "Performing the test on a sunny day with good outdoor ventilation"],
    explanation_en: "Electronic detectors can give false positives from solvent, paint, adhesive, and other volatile chemical vapors."
  },
  {
    category: "Tuberías",
    q: "¿Por qué es importante escariar (ream) el interior del tubo de cobre después de cortarlo?",
    options: ["Para que el tubo se vea más limpio y profesional por dentro", "Para remover la rebaba que restringe flujo y atrapa contaminantes", "Para expandir el diámetro interno y aumentar el flujo de refrigerante", "Para crear una superficie rugosa que ayude al flux a adherirse mejor"],
    correct: 1,
    explanation: "La rebaba interna restringe el flujo, atrapa partículas y puede desprenderse contaminando válvulas TXV y compresores."
  ,
    question_en: "Why is it important to ream the inside of copper tubing after cutting it?",
    options_en: ["So the tube looks cleaner and more professional inside", "To remove the burr that restricts flow and traps contaminants", "To expand the internal diameter and increase refrigerant flow", "To create a rough surface that helps flux adhere better"],
    explanation_en: "The internal burr restricts flow, traps particles, and can break loose contaminating TXV valves and compressors."
  },
  {
    category: "Tuberías",
    q: "¿Por qué se deben mantener los extremos de la tubería de cobre sellados hasta el momento de la instalación?",
    options: ["Para mantener el precio de reventa del material de cobre alto", "Para prevenir entrada de humedad, suciedad y contaminantes al interior", "Para que el tubo mantenga su color brillante y no se opaque verde", "Para evitar que insectos hagan nido dentro de la tubería de cobre"],
    correct: 1,
    explanation: "La humedad y suciedad dentro del tubo contaminan el sistema. Se sellan con tapones o cinta hasta el momento de conectar."
  ,
    question_en: "Why must the ends of copper tubing be kept sealed until the moment of installation?",
    options_en: ["To maintain the high resale price of the copper material", "To prevent moisture, dirt, and contaminants from entering inside", "So the tube keeps its bright color and does not turn green", "To prevent insects from nesting inside the copper tubing"],
    explanation_en: "Moisture and dirt inside the tube contaminate the system. Seal with caps or tape until the moment of connection."
  },
  {
    category: "Tuberías",
    q: "¿Cuál es el radio mínimo de curvatura para doblar tubo de cobre de 3/8 sin que se aplaste?",
    options: ["El radio mínimo es igual al diámetro del tubo sin más margen", "El radio mínimo es 5 veces el diámetro externo del tubo de cobre", "El radio mínimo es 10 veces el diámetro externo para evitar aplastamiento", "No hay radio mínimo, se puede doblar en ángulo recto sin problemas"],
    correct: 1,
    explanation: "El radio mínimo recomendado es 5 veces el diámetro externo. Menor radio causa aplastamiento, restricción de flujo y posible fractura."
  ,
    question_en: "What is the minimum bend radius for bending 3/8 inch copper tube without crushing it?",
    options_en: ["Minimum radius equals the tube diameter with no extra margin", "Minimum radius is 5 times the outside diameter of the copper tube", "Minimum radius is 10 times the outside diameter to avoid crushing", "There is no minimum radius; it can be bent at a right angle without problems"],
    explanation_en: "The recommended minimum radius is 5 times the outside diameter. A smaller radius causes crushing, flow restriction, and possible fracture."
  },
  {
    category: "Tuberías",
    q: "¿Qué indica una mancha verde en la superficie exterior de una tubería de cobre instalada?",
    options: ["La tubería fue fabricada con cobre reciclado de baja calidad total", "Corrosión por exposición a humedad y posible fuga lenta de refrigerante", "El tubo fue tratado con un protector químico de fábrica verde", "La pintura del techo gotea sobre el tubo y le da color verde claro"],
    correct: 1,
    explanation: "La pátina verde (cardenillo) indica oxidación del cobre por humedad. En líneas de refrigeración puede señalar una fuga de aceite."
  ,
    question_en: "What does a green stain on the exterior surface of installed copper tubing indicate?",
    options_en: ["The tubing was manufactured with recycled low-quality copper", "Corrosion from moisture exposure and possible slow refrigerant leak", "The tube was treated with a factory-applied green protective chemical", "Ceiling paint drips onto the tube giving it a light green color"],
    explanation_en: "The green patina (verdigris) indicates copper oxidation from moisture. On refrigerant lines it may signal an oil leak."
  },
  {
    category: "Tuberías",
    q: "¿Por qué la línea de succión (tubo grande) se instala debajo de la línea de líquido (tubo pequeño)?",
    options: ["Para que se vea más estético en la instalación exterior visible", "Para que si la línea de líquido gotea no moje la succión fría", "Para facilitar el acceso de servicio al tubo más grande primero", "Porque el tubo grande es más pesado y debe ir abajo por gravedad"],
    correct: 1,
    explanation: "Si la línea de líquido desarrolla condensación o fuga, el goteo no cae sobre la línea de succión evitando problemas térmicos."
  ,
    question_en: "Why is the suction line (large tube) installed below the liquid line (small tube)?",
    options_en: ["For a more aesthetic look in the visible exterior installation", "So that if the liquid line drips it does not wet the cold suction line", "To facilitate service access to the larger tube first", "Because the large tube is heavier and must go below due to gravity"],
    explanation_en: "If the liquid line develops condensation or a leak, dripping does not fall on the suction line, avoiding thermal issues."
  },
  {
    category: "Tuberías",
    q: "¿Para qué sirve una trampa de aceite (oil trap) en la línea de succión de un sistema con compresor en el sótano?",
    options: ["Para filtrar impurezas sólidas del refrigerante que regresa al compresor", "Para asegurar el retorno de aceite al compresor cuando sube vertical", "Para reducir el ruido de la tubería cuando el refrigerante fluye rápido", "Para evitar que el refrigerante líquido llegue directamente al compresor"],
    correct: 1,
    explanation: "En risers verticales largos, la trampa de aceite asegura que el aceite lubricante suba y regrese al compresor por velocidad del gas."
  ,
    question_en: "What is an oil trap on the suction line used for in a system with the compressor in the basement?",
    options_en: ["To filter solid impurities from the refrigerant returning to the compressor", "To ensure oil return to the compressor when it must travel up vertically", "To reduce pipe noise when refrigerant flows at high speed", "To prevent liquid refrigerant from reaching the compressor directly"],
    explanation_en: "On long vertical risers, the oil trap ensures lubricating oil climbs back to the compressor via gas velocity."
  },
  {
    category: "Herramientas",
    q: "¿Cuál es la diferencia entre una herramienta de swaging y una de expanding?",
    options: ["El swaging reduce el diámetro y el expanding lo agranda uniformemente", "El swaging expande un extremo para conexión sin fitting de acople", "El expanding es solo para tubería de plástico PVC no para cobre", "No hay diferencia, son dos nombres para la misma herramienta exacta"],
    correct: 1,
    explanation: "El swaging expande un extremo del tubo para que otro tubo del mismo diámetro entre directamente, eliminando la necesidad de un fitting."
  ,
    question_en: "What is the difference between a swaging tool and an expanding tool?",
    options_en: ["Swaging reduces the diameter and expanding enlarges it uniformly", "Swaging expands one end for connection without a coupling fitting", "Expanding is only for PVC plastic pipe, not for copper", "There is no difference; they are two names for the exact same tool"],
    explanation_en: "Swaging expands one end of the tube so another tube of the same diameter enters directly, eliminating the need for a fitting."
  },
  {
    category: "Herramientas",
    q: "¿Por qué un cortador rotativo es preferible a una sierra para cortar tubería de cobre de refrigeración?",
    options: ["Porque la sierra es más cara que el cortador rotativo de tubo", "Porque el cortador produce un corte limpio sin virutas que contaminen", "Porque la sierra no puede cortar cobre ya que es muy blando total", "Porque el cortador rotativo funciona con batería y es más portátil"],
    correct: 1,
    explanation: "El cortador rotativo produce un corte limpio sin virutas metálicas. La sierra genera partículas que pueden contaminar el sistema."
  ,
    question_en: "Why is a rotary cutter preferable to a saw for cutting refrigeration copper tubing?",
    options_en: ["Because the saw is more expensive than the rotary tube cutter", "Because the cutter produces a clean cut without chips that contaminate", "Because the saw cannot cut copper since it is too soft", "Because the rotary cutter runs on battery and is more portable"],
    explanation_en: "The rotary cutter produces a clean cut without metal shavings. A saw generates particles that can contaminate the system."
  },
  {
    category: "Herramientas",
    q: "¿Para qué sirve el gauge de profundidad en un kit de flare para tubería de cobre?",
    options: ["Para medir la longitud total del tubo antes de hacer el corte", "Para asegurar que el tubo sobresale la cantidad correcta del bloque", "Para verificar el diámetro interno del tubo después del escariado", "Para calibrar la presión del torque aplicado al fitting de flare"],
    correct: 1,
    explanation: "El gauge asegura que el tubo sobresalga correctamente del bloque de flare. Mucho o poco tubo resulta en un flare defectuoso con fugas."
  ,
    question_en: "What is the depth gauge in a copper tube flaring kit used for?",
    options_en: ["To measure the total tube length before making the cut", "To ensure the tube protrudes the correct amount from the block", "To verify the tube's internal diameter after reaming", "To calibrate the torque pressure applied to the flare fitting"],
    explanation_en: "The gauge ensures the tube protrudes correctly from the flare block. Too much or too little tube results in a defective leaky flare."
  },
  {
    category: "Herramientas",
    q: "¿Qué tipo de regulador se debe usar en un tanque de nitrógeno para pruebas de presión?",
    options: ["Regulador estándar de oxígeno con manómetro de baja presión", "Regulador de alta presión específico para nitrógeno con dos etapas", "Regulador de propano adaptado con fitting de rosca CGA-580", "No se necesita regulador, se abre la válvula del tanque directamente"],
    correct: 1,
    explanation: "Se necesita un regulador de nitrógeno de alta presión (CGA-580) con dos etapas para controlar la presión de salida con precisión."
  ,
    question_en: "What type of regulator should be used on a nitrogen tank for pressure testing?",
    options_en: ["Standard oxygen regulator with low-pressure gauge", "High-pressure nitrogen-specific regulator with two stages", "Propane regulator adapted with CGA-580 thread fitting", "No regulator is needed; open the tank valve directly"],
    explanation_en: "A high-pressure nitrogen regulator (CGA-580) with two stages is needed to precisely control output pressure."
  },
  {
    category: "Herramientas",
    q: "¿Qué herramienta se usa para verificar el torque correcto al apretar conexiones de flare?",
    options: ["Llave ajustable (crescent wrench) apretando a mano firme suficiente", "Torquímetro calibrado según especificaciones del fabricante del equipo", "Pinzas de presión (vise grips) apretando hasta que no gire más", "Llave de impacto neumática a máxima velocidad para sellado seguro"],
    correct: 1,
    explanation: "El torquímetro asegura el apriete exacto especificado. Poco torque causa fugas; demasiado daña el asiento del flare."
  ,
    question_en: "What tool is used to verify correct torque when tightening flare connections?",
    options_en: ["Adjustable wrench (crescent wrench) hand-tightened firmly enough", "Torque wrench calibrated per equipment manufacturer specifications", "Vise grips (locking pliers) tightened until it stops turning", "Pneumatic impact wrench at maximum speed for a secure seal"],
    explanation_en: "The torque wrench ensures the exact specified tightening. Too little torque causes leaks; too much damages the flare seat."
  },
  {
    category: "Herramientas",
    q: "¿Cuál es el tamaño mínimo recomendado de bomba de vacío para un sistema split residencial de 3 toneladas?",
    options: ["1 CFM es suficiente para cualquier sistema residencial básico", "4 CFM mínimo para evacuar eficientemente un sistema de 3 toneladas", "10 CFM que es el estándar para todos los trabajos de HVAC", "20 CFM porque mientras más grande más rápido termina el vacío"],
    correct: 1,
    explanation: "Se recomienda mínimo 4 CFM para sistemas residenciales. Una bomba más pequeña tardará excesivamente en alcanzar el vacío requerido."
  ,
    question_en: "What is the minimum recommended vacuum pump size for a 3-ton residential split system?",
    options_en: ["1 CFM is enough for any basic residential system", "4 CFM minimum to efficiently evacuate a 3-ton system", "10 CFM which is the standard for all HVAC jobs", "20 CFM because the bigger the pump the faster the vacuum"],
    explanation_en: "A minimum of 4 CFM is recommended for residential systems. A smaller pump will take excessively long to reach the required vacuum."
  },
  {
    category: "Herramientas",
    q: "¿Qué herramienta mide específicamente la profundidad de vacío en micrones durante evacuación?",
    options: ["El manómetro compuesto del manifold de servicio estándar azul", "Un micrómetro digital conectado directamente al sistema de vacío", "Un medidor de micrones (micron gauge) digital de alta precisión", "El termómetro infrarrojo apuntando a la bomba de vacío motor"],
    correct: 2,
    explanation: "El micron gauge digital es el único instrumento que mide con precisión el nivel de vacío profundo en micrones. El manifold no tiene suficiente precisión."
  ,
    question_en: "What tool specifically measures vacuum depth in microns during evacuation?",
    options_en: ["The compound gauge on the standard blue service manifold", "A digital micrometer connected directly to the vacuum system", "A high-precision digital micron gauge", "An infrared thermometer pointed at the vacuum pump motor"],
    explanation_en: "The digital micron gauge is the only instrument that precisely measures deep vacuum level in microns. The manifold lacks sufficient precision."
  },
  {
    category: "Leak Testing",
    q: "¿Cuál es la ventaja de una prueba de presión con nitrógeno sobre una prueba de vacío para detectar fugas?",
    options: ["La prueba de vacío es siempre superior a la presión con nitrógeno", "La presión positiva con nitrógeno detecta fugas más rápido que el vacío", "No hay diferencia entre presión positiva y vacío para detección fugas", "La prueba de vacío usa menos equipo y es más económica en general"],
    correct: 1,
    explanation: "La presión positiva empuja gas hacia afuera por las fugas, haciéndolas detectables con jabón o detector. El vacío solo muestra si el sistema mantiene, sin localizar la fuga."
  ,
    question_en: "What is the advantage of a nitrogen pressure test over a vacuum test for detecting leaks?",
    options_en: ["A vacuum test is always superior to nitrogen pressure", "Positive nitrogen pressure detects leaks faster than vacuum", "There is no difference between positive pressure and vacuum for leak detection", "A vacuum test uses less equipment and is more economical overall"],
    explanation_en: "Positive pressure pushes gas outward through leaks, making them detectable with soap or a detector. Vacuum only shows if the system holds, without locating the leak."
  },
  {
    category: "Leak Testing",
    q: "¿Qué tasa de fuga anual de refrigerante requiere reparación obligatoria según la EPA para sistemas comerciales?",
    options: ["Cualquier cantidad detectable de fuga requiere reparación inmediata", "Más del 20% de la carga total perdida en un periodo de doce meses", "Más del 50% de la carga total perdida en un periodo de doce meses", "Solo si se pierde el 100% de la carga completa del sistema total"],
    correct: 1,
    explanation: "La EPA requiere reparar fugas en equipos comerciales que excedan 20% de pérdida anual (30% para equipos de confort con >50 lbs)."
  ,
    question_en: "What annual refrigerant leak rate requires mandatory repair per EPA for commercial systems?",
    options_en: ["Any detectable amount of leakage requires immediate repair", "More than 20% of total charge lost within a twelve-month period", "More than 50% of total charge lost within a twelve-month period", "Only if 100% of the complete system charge is lost entirely"],
    explanation_en: "The EPA requires leak repair in commercial equipment exceeding 20% annual loss (30% for comfort equipment with >50 lbs)."
  },
  {
    category: "Tuberías",
    q: "¿Qué tipo de tubo de cobre viene en rollos y se usa comúnmente para líneas de refrigerante residencial?",
    options: ["Tipo L rígido que viene en tramos rectos de 10 pies cada uno", "Tipo ACR suave recocido que viene en rollos de 25 o 50 pies", "Tipo K extra pesado que se usa exclusivamente bajo tierra enterrado", "Tipo M delgado que es solo para agua potable residencial interior"],
    correct: 1,
    explanation: "El tubo ACR (Air Conditioning Refrigeration) viene recocido en rollos, limpio y sellado, específicamente para líneas de refrigerante."
  ,
    question_en: "What type of copper tube comes in coils and is commonly used for residential refrigerant lines?",
    options_en: ["Type L rigid that comes in 10-foot straight lengths", "Type ACR soft annealed that comes in 25 or 50-foot coils", "Type K extra heavy used exclusively underground buried", "Type M thin that is only for interior residential potable water"],
    explanation_en: "ACR (Air Conditioning Refrigeration) tube comes annealed in coils, clean and sealed, specifically for refrigerant lines."
  }
],

// ─── NIVEL 3: Electricidad, Controles Eléctricos/Fluidos/Temperatura (150 preguntas) ───
nivel3: [
  // ── Electricidad y Magnetismo (~40 preguntas) ──
  {
    category: "Electricidad",
    q: "¿Cuál es la ley que establece que el voltaje es igual a la corriente multiplicada por la resistencia?",
    options: ["Ley de Kirchhoff de corrientes en nodo", "Ley de Ohm de circuitos eléctricos básicos", "Ley de Faraday de inducción electromagnética", "Ley de Coulomb de cargas electrostáticas"],
    correct: 1,
    explanation: "Ley de Ohm: V = I × R. Voltaje (V) = Corriente (I) × Resistencia (R)."
  ,
    question_en: "What law states that voltage equals current multiplied by resistance?",
    options_en: ["Kirchhoff's current law at a node", "Ohm's Law for basic electrical circuits", "Faraday's law of electromagnetic induction", "Coulomb's law of electrostatic charges"],
    explanation_en: "Ohm's Law: V = I x R. Voltage (V) = Current (I) x Resistance (R)."
  },
  {
    category: "Electricidad",
    q: "Si un motor de compresor consume 20 amperios a 240 voltios, ¿cuántos watts de potencia consume?",
    options: ["2,400 watts de potencia eléctrica total", "4,800 watts de potencia eléctrica total", "1,200 watts de potencia eléctrica total", "3,600 watts de potencia eléctrica total"],
    correct: 1,
    explanation: "P = V × I. 240V × 20A = 4,800W. En monofásico, Watts = Volts × Amps."
  ,
    question_en: "If a compressor motor draws 20 amps at 240 volts, how many watts of power does it consume?",
    options_en: ["2,400 watts of total electrical power", "4,800 watts of total electrical power", "1,200 watts of total electrical power", "3,600 watts of total electrical power"],
    explanation_en: "P = V x I. 240V x 20A = 4,800W. In single phase, Watts = Volts x Amps."
  },
  {
    category: "Electricidad",
    q: "¿Qué sucede con la corriente en un circuito si la resistencia se duplica y el voltaje permanece igual?",
    options: ["La corriente se duplica proporcionalmente", "La corriente se reduce a la mitad exactamente", "La corriente permanece igual sin cambio alguno", "La corriente se reduce a un cuarto del original"],
    correct: 1,
    explanation: "Por Ley de Ohm: I = V/R. Si R se duplica, I se reduce a la mitad."
  ,
    question_en: "What happens to the current in a circuit if the resistance doubles and voltage stays the same?",
    options_en: ["The current doubles proportionally", "The current is reduced to exactly half", "The current remains the same without any change", "The current is reduced to one quarter of the original"],
    explanation_en: "By Ohm's Law: I = V/R. If R doubles, I is cut in half."
  },
  {
    category: "Electricidad",
    q: "En un circuito en serie con tres resistencias de 10Ω cada una, ¿cuál es la resistencia total?",
    options: ["3.33 ohmios de resistencia total en serie", "10.0 ohmios de resistencia total en serie", "30.0 ohmios de resistencia total en serie", "90.0 ohmios de resistencia total en serie"],
    correct: 2,
    explanation: "En serie: Rtotal = R1 + R2 + R3 = 10 + 10 + 10 = 30Ω."
  ,
    question_en: "In a series circuit with three 10-ohm resistors, what is the total resistance?",
    options_en: ["3.33 ohms total series resistance", "10.0 ohms total series resistance", "30.0 ohms total series resistance", "90.0 ohms total series resistance"],
    explanation_en: "In series: Rtotal = R1 + R2 + R3 = 10 + 10 + 10 = 30 ohms."
  },
  {
    category: "Electricidad",
    q: "En un circuito en paralelo con dos resistencias de 20Ω cada una, ¿cuál es la resistencia total?",
    options: ["40.0 ohmios de resistencia total en paralelo", "20.0 ohmios de resistencia total en paralelo", "10.0 ohmios de resistencia total en paralelo", "05.0 ohmios de resistencia total en paralelo"],
    correct: 2,
    explanation: "En paralelo con resistencias iguales: Rtotal = R/n = 20/2 = 10Ω."
  ,
    question_en: "In a parallel circuit with two 20-ohm resistors, what is the total resistance?",
    options_en: ["40.0 ohms total parallel resistance", "20.0 ohms total parallel resistance", "10.0 ohms total parallel resistance", "05.0 ohms total parallel resistance"],
    explanation_en: "In parallel with equal resistors: Rtotal = R/n = 20/2 = 10 ohms."
  },
  {
    category: "Electricidad",
    q: "¿Qué instrumento se usa para medir la resistencia de aislamiento de un devanado de motor eléctrico?",
    options: ["Multímetro digital en modo de resistencia ohms", "Megóhmetro o Megger de alto voltaje de prueba", "Amperímetro de gancho en modo de corriente AC", "Osciloscopio digital de dos canales de medición"],
    correct: 1,
    explanation: "El megóhmetro aplica alto voltaje (500V+) para medir resistencia de aislamiento en megaohmios."
  ,
    question_en: "What instrument is used to measure the insulation resistance of an electric motor winding?",
    options_en: ["Digital multimeter in ohms resistance mode", "Megohmmeter or Megger with high test voltage", "Clamp-on ammeter in AC current mode", "Two-channel digital oscilloscope"],
    explanation_en: "The megohmmeter applies high voltage (500V+) to measure insulation resistance in megohms."
  },
  {
    category: "Electricidad",
    q: "¿Cuál es el voltaje estándar de una línea monofásica residencial en Estados Unidos?",
    options: ["120/208 voltios monofásico residencial", "120/240 voltios monofásico residencial", "208/230 voltios monofásico residencial", "277/480 voltios monofásico residencial"],
    correct: 1,
    explanation: "Residencial USA estándar es 120/240V monofásico con centro de neutro del transformador."
  ,
    question_en: "What is the standard single-phase residential line voltage in the United States?",
    options_en: ["120/208 volts single-phase residential", "120/240 volts single-phase residential", "208/230 volts single-phase residential", "277/480 volts single-phase residential"],
    explanation_en: "Standard US residential is 120/240V single-phase with center-tapped neutral transformer."
  },
  {
    category: "Electricidad",
    q: "¿Qué componente protege el circuito del compresor contra sobrecarga de corriente excesiva?",
    options: ["El capacitor de arranque del motor compresor", "El protector de sobrecarga térmico o breaker", "El contactor de la línea de alta tensión AC", "El transformador reductor de voltaje 24 voltios"],
    correct: 1,
    explanation: "El protector de sobrecarga (overload) abre el circuito cuando la corriente excede el límite seguro."
  ,
    question_en: "What component protects the compressor circuit against excessive current overload?",
    options_en: ["The compressor motor start capacitor", "The thermal overload protector or breaker", "The high-voltage AC line contactor", "The 24-volt step-down transformer"],
    explanation_en: "The overload protector opens the circuit when current exceeds the safe limit."
  },
  {
    category: "Electricidad",
    q: "Un capacitor de marcha de 45 μF tiene una tolerancia de ±6%. ¿Cuál es el rango aceptable?",
    options: ["40.5 a 49.5 microfaradios de capacitancia", "42.3 a 47.7 microfaradios de capacitancia", "43.0 a 47.0 microfaradios de capacitancia", "44.0 a 46.0 microfaradios de capacitancia"],
    correct: 1,
    explanation: "45 × 0.06 = 2.7. Rango: 45 - 2.7 = 42.3 hasta 45 + 2.7 = 47.7 μF."
  ,
    question_en: "A 45 uF run capacitor has a tolerance of +/-6%. What is the acceptable range?",
    options_en: ["40.5 to 49.5 microfarads of capacitance", "42.3 to 47.7 microfarads of capacitance", "43.0 to 47.0 microfarads of capacitance", "44.0 to 46.0 microfarads of capacitance"],
    explanation_en: "45 x 0.06 = 2.7. Range: 45 - 2.7 = 42.3 to 45 + 2.7 = 47.7 uF."
  },
  {
    category: "Electricidad",
    q: "¿Cuál es la diferencia entre un capacitor de arranque y uno de marcha en un motor monofásico?",
    options: ["El de arranque tiene menos microfaradios que el de marcha", "El de arranque tiene más microfaradios y opera brevemente", "El de arranque funciona continuamente y el de marcha no", "No hay diferencia, son intercambiables entre sí siempre"],
    correct: 1,
    explanation: "El capacitor de arranque tiene más μF (88-108 etc.) y opera solo segundos. El de marcha (5-80 μF) opera continuamente."
  ,
    question_en: "What is the difference between a start capacitor and a run capacitor in a single-phase motor?",
    options_en: ["The start capacitor has fewer microfarads than the run capacitor", "The start capacitor has more microfarads and operates briefly", "The start capacitor runs continuously and the run capacitor does not", "There is no difference; they are interchangeable with each other always"],
    explanation_en: "The start capacitor has more uF (88-108 etc.) and operates only seconds. The run capacitor (5-80 uF) operates continuously."
  },
  {
    category: "Electricidad",
    q: "¿Qué es un cortocircuito (short circuit) en un motor eléctrico HVAC?",
    options: ["Un circuito con muy poca corriente fluyendo", "Una conexión directa que bypasea la resistencia normal", "Un circuito abierto sin flujo de corriente eléctrica", "Una condición normal de operación del motor eléctrico"],
    correct: 1,
    explanation: "Un cortocircuito es una conexión de baja resistencia que permite flujo excesivo de corriente."
  ,
    question_en: "What is a short circuit in an HVAC electric motor?",
    options_en: ["A circuit with very little current flowing", "A direct connection that bypasses normal resistance", "An open circuit with no electrical current flow", "A normal operating condition of the electric motor"],
    explanation_en: "A short circuit is a low-resistance connection that allows excessive current flow."
  },
  {
    category: "Electricidad",
    q: "¿Cuántos watts equivalen a un caballo de fuerza (HP) en un motor eléctrico?",
    options: ["550 watts equivalen a un caballo de fuerza", "746 watts equivalen a un caballo de fuerza", "960 watts equivalen a un caballo de fuerza", "1000 watts equivalen a un caballo de fuerza"],
    correct: 1,
    explanation: "1 HP = 746 watts. Esta es la conversión estándar de potencia mecánica a eléctrica."
  ,
    question_en: "How many watts equal one horsepower (HP) in an electric motor?",
    options_en: ["550 watts equal one horsepower", "746 watts equal one horsepower", "960 watts equal one horsepower", "1000 watts equal one horsepower"],
    explanation_en: "1 HP = 746 watts. This is the standard conversion from mechanical to electrical power."
  },
  {
    category: "Electricidad",
    q: "Si un breaker de 30 amperios se dispara repetidamente en un circuito de condensadora, ¿qué indica?",
    options: ["El breaker es demasiado grande para el circuito", "El circuito está consumiendo más de 30 amperios", "El voltaje de suministro es demasiado alto del normal", "La condensadora necesita un capacitor de arranque nuevo"],
    correct: 1,
    explanation: "Un breaker que se dispara indica que la corriente excede su rating. Puede ser motor en corto, compresor trabado, etc."
  ,
    question_en: "If a 30-amp breaker trips repeatedly on a condenser circuit, what does it indicate?",
    options_en: ["The breaker is too large for the circuit", "The circuit is drawing more than 30 amps", "The supply voltage is too high above normal", "The condenser needs a new start capacitor"],
    explanation_en: "A tripping breaker indicates current exceeds its rating. Could be a shorted motor, locked rotor compressor, etc."
  },
  {
    category: "Electricidad",
    q: "¿Cuál es la función del transformador en el sistema de control de un aire acondicionado residencial?",
    options: ["Aumentar el voltaje de 120V a 240V para el compresor", "Reducir el voltaje de 240V a 24V para los controles", "Convertir corriente alterna AC a corriente directa DC", "Almacenar energía para el arranque del motor ventilador"],
    correct: 1,
    explanation: "El transformador reduce 240V (o 120V) a 24V AC para el circuito de control (termostato, contactor)."
  ,
    question_en: "What is the function of the transformer in a residential air conditioner's control system?",
    options_en: ["To increase voltage from 120V to 240V for the compressor", "To reduce voltage from 240V to 24V for the controls", "To convert AC alternating current to DC direct current", "To store energy for the fan motor startup"],
    explanation_en: "The transformer steps down 240V (or 120V) to 24V AC for the control circuit (thermostat, contactor)."
  },
  {
    category: "Electricidad",
    q: "¿Qué mide el amperaje de rotor bloqueado (LRA) de un compresor?",
    options: ["La corriente cuando el compresor opera a carga normal", "La corriente máxima al arranque con rotor detenido", "La corriente mínima en condiciones de baja temperatura", "La corriente de la bobina del contactor de arranque"],
    correct: 1,
    explanation: "LRA (Locked Rotor Amps) es la corriente pico que el motor consume al arrancar antes de girar."
  ,
    question_en: "What does the locked rotor amperage (LRA) of a compressor measure?",
    options_en: ["The current when the compressor operates at normal load", "The maximum current at startup with a stalled rotor", "The minimum current at low temperature conditions", "The current of the contactor start coil"],
    explanation_en: "LRA (Locked Rotor Amps) is the peak current the motor draws at startup before it begins to turn."
  },
  {
    category: "Electricidad",
    q: "¿Qué es el FLA (Full Load Amps) indicado en la placa de datos de un compresor?",
    options: ["La corriente al arrancar el motor desde parado", "La corriente máxima en operación normal a plena carga", "La corriente mínima en condiciones de vacío sin carga", "La corriente que consume el ventilador del condensador"],
    correct: 1,
    explanation: "FLA es la corriente nominal que el compresor consume operando a su capacidad máxima de diseño."
  ,
    question_en: "What is the FLA (Full Load Amps) indicated on a compressor data plate?",
    options_en: ["The current when starting the motor from a standstill", "The maximum current in normal operation at full load", "The minimum current under no-load vacuum conditions", "The current drawn by the condenser fan motor"],
    explanation_en: "FLA is the nominal current the compressor draws operating at its maximum design capacity."
  },
  {
    category: "Electricidad",
    q: "Si mides 0 voltios entre R y C en un compresor monofásico, ¿qué terminal podría estar abierta?",
    options: ["La terminal S (Start) del devanado de arranque", "La terminal C (Common) que es punto común a ambos", "La terminal R (Run) del devanado de marcha principal", "Ninguna terminal, 0V entre R y C es lectura normal"],
    correct: 1,
    explanation: "Si mides 0V entre R y C, el devanado de marcha está intacto. Si tuvieras OL, C estaría abierta."
  ,
    question_en: "If you measure 0 volts between R and C on a single-phase compressor, which terminal could be open?",
    options_en: ["The S (Start) terminal of the start winding", "The C (Common) terminal which is common to both", "The R (Run) terminal of the main run winding", "No terminal; 0V between R and C is a normal reading"],
    explanation_en: "If you read 0V between R and C, the run winding is intact. If you had OL, C would be open."
  },
  {
    category: "Electricidad",
    q: "¿Qué tipo de corriente produce un generador con un imán girando dentro de una bobina?",
    options: ["Corriente directa DC de voltaje constante", "Corriente alterna AC de voltaje sinusoidal", "Corriente pulsante DC de medio ciclo positivo", "Corriente estática de alto voltaje descarga"],
    correct: 1,
    explanation: "Un imán rotando en una bobina genera corriente alterna (AC) por inducción electromagnética (Ley de Faraday)."
  ,
    question_en: "What type of current does a generator produce with a magnet spinning inside a coil?",
    options_en: ["DC direct current at constant voltage", "AC alternating current at sinusoidal voltage", "Pulsating DC current of half positive cycle", "High-voltage static discharge current"],
    explanation_en: "A magnet rotating in a coil generates alternating current (AC) by electromagnetic induction (Faraday's Law)."
  },
  {
    category: "Electricidad",
    q: "¿Qué establece la Ley de Kirchhoff de voltajes en un circuito eléctrico cerrado?",
    options: ["La corriente total que entra es igual a la que sale", "La suma de voltajes en un lazo cerrado es igual a cero", "La potencia consumida es igual al voltaje por corriente", "La resistencia total es la suma de todas las resistencias"],
    correct: 1,
    explanation: "KVL: La suma algebraica de todos los voltajes en un lazo cerrado siempre es igual a cero."
  ,
    question_en: "What does Kirchhoff's Voltage Law establish for a closed electrical circuit?",
    options_en: ["The total current entering equals the current leaving", "The sum of voltages in a closed loop equals zero", "The power consumed equals voltage times current", "The total resistance is the sum of all resistances"],
    explanation_en: "KVL: The algebraic sum of all voltages in a closed loop always equals zero."
  },
  {
    category: "Electricidad",
    q: "¿Cuántos amperios fluyen por un elemento calefactor de 5,000 watts conectado a 240 voltios?",
    options: ["10.4 amperios de corriente eléctrica fluyen", "20.8 amperios de corriente eléctrica fluyen", "31.2 amperios de corriente eléctrica fluyen", "41.6 amperios de corriente eléctrica fluyen"],
    correct: 1,
    explanation: "I = P/V = 5,000W / 240V = 20.83A."
  ,
    question_en: "How many amps flow through a 5,000 watt heating element connected to 240 volts?",
    options_en: ["10.4 amps of electrical current flow", "20.8 amps of electrical current flow", "31.2 amps of electrical current flow", "41.6 amps of electrical current flow"],
    explanation_en: "I = P/V = 5,000W / 240V = 20.83A."
  },
  {
    category: "Electricidad",
    q: "¿Qué sucede con la resistencia de un conductor de cobre cuando su temperatura aumenta?",
    options: ["La resistencia disminuye proporcionalmente a la temperatura", "La resistencia aumenta proporcionalmente a la temperatura", "La resistencia permanece constante sin importar la temp", "La resistencia se vuelve cero a temperaturas muy altas"],
    correct: 1,
    explanation: "El cobre tiene coeficiente de temperatura positivo: más caliente = más resistencia."
  ,
    question_en: "What happens to the resistance of a copper conductor when its temperature increases?",
    options_en: ["Resistance decreases proportionally to temperature", "Resistance increases proportionally to temperature", "Resistance remains constant regardless of temperature", "Resistance becomes zero at very high temperatures"],
    explanation_en: "Copper has a positive temperature coefficient: hotter = more resistance."
  },
  {
    category: "Electricidad",
    q: "¿Qué calibre de cable se requiere para un circuito de 30 amperios a una distancia de 50 pies?",
    options: ["Cable calibre 14 AWG de cobre THHN aislado", "Cable calibre 12 AWG de cobre THHN aislado", "Cable calibre 10 AWG de cobre THHN aislado", "Cable calibre 08 AWG de cobre THHN aislado"],
    correct: 2,
    explanation: "Para 30A se necesita mínimo calibre 10 AWG. A 50 pies no hay caída significativa."
  ,
    question_en: "What wire gauge is required for a 30-amp circuit at a distance of 50 feet?",
    options_en: ["14 AWG copper THHN insulated cable", "12 AWG copper THHN insulated cable", "10 AWG copper THHN insulated cable", "08 AWG copper THHN insulated cable"],
    explanation_en: "For 30A, a minimum of 10 AWG is needed. At 50 feet there is no significant voltage drop."
  },
  {
    category: "Electricidad",
    q: "¿Cuál es la caída de voltaje máxima recomendada por NEC para un circuito de alimentación?",
    options: ["1% de caída de voltaje máxima recomendada", "3% de caída de voltaje máxima recomendada", "5% de caída de voltaje máxima recomendada", "8% de caída de voltaje máxima recomendada"],
    correct: 1,
    explanation: "NEC recomienda máximo 3% de caída en el circuito alimentador y 5% total incluyendo ramal."
  ,
    question_en: "What is the maximum recommended voltage drop per NEC for a feeder circuit?",
    options_en: ["1% maximum recommended voltage drop", "3% maximum recommended voltage drop", "5% maximum recommended voltage drop", "8% maximum recommended voltage drop"],
    explanation_en: "NEC recommends a maximum 3% drop on the feeder circuit and 5% total including the branch."
  },
  {
    category: "Electricidad",
    q: "Un motor monofásico de 1 HP a 240V tiene un FLA de aproximadamente:",
    options: ["3.1 amperios de corriente a plena carga", "5.0 amperios de corriente a plena carga", "8.0 amperios de corriente a plena carga", "10.0 amperios de corriente a plena carga"],
    correct: 1,
    explanation: "Un motor de 1HP a 240V consume aproximadamente 5A FLA según tablas NEC."
  ,
    question_en: "A 1 HP single-phase motor at 240V has an FLA of approximately:",
    options_en: ["3.1 amps at full load current", "5.0 amps at full load current", "8.0 amps at full load current", "10.0 amps at full load current"],
    explanation_en: "A 1HP motor at 240V draws approximately 5A FLA per NEC tables."
  },
  {
    category: "Electricidad",
    q: "¿Qué instrumento se usa para medir el factor de potencia en un sistema HVAC trifásico?",
    options: ["Multímetro digital con función de voltaje AC", "Analizador de potencia o power quality meter", "Termómetro infrarrojo de medición sin contacto", "Detector de fugas electrónico de refrigerante"],
    correct: 1,
    explanation: "Un analizador de potencia mide watts reales, VA reactivos y calcula el factor de potencia."
  ,
    question_en: "What instrument is used to measure power factor in a three-phase HVAC system?",
    options_en: ["Digital multimeter with AC voltage function", "Power analyzer or power quality meter", "Non-contact infrared measurement thermometer", "Electronic refrigerant leak detector"],
    explanation_en: "A power analyzer measures real watts, reactive VA, and calculates the power factor."
  },
  {
    category: "Electricidad",
    q: "Si un sistema trifásico 208V pierde una fase, el motor del compresor:",
    options: ["Opera normalmente sin ningún problema visible", "Se sobrecalienta y eventualmente se quema dañado", "Aumenta su eficiencia por usar menos energía total", "Se apaga instantáneamente sin causar ningún daño"],
    correct: 1,
    explanation: "Single-phasing causa que el motor intente operar en dos fases, aumentando corriente y sobrecalentándose."
  ,
    question_en: "If a three-phase 208V system loses one phase, the compressor motor:",
    options_en: ["Operates normally without any visible problem", "Overheats and eventually burns out damaged", "Increases its efficiency by using less total energy", "Shuts off instantly without causing any damage"],
    explanation_en: "Single-phasing causes the motor to try to operate on two phases, increasing current and overheating."
  },
  {
    category: "Electricidad",
    q: "¿Cuál es la función de un relay de falta de fase en un sistema trifásico comercial?",
    options: ["Aumentar el voltaje cuando una fase baja de nivel", "Apagar el sistema cuando detecta pérdida de una fase", "Balancear la corriente entre las tres fases del motor", "Convertir trifásico a monofásico para el compresor"],
    correct: 1,
    explanation: "El relay de falta de fase protege motores apagando el sistema al detectar pérdida o desbalance de fase."
  ,
    question_en: "What is the function of a phase-loss relay in a commercial three-phase system?",
    options_en: ["To increase voltage when a phase drops in level", "To shut down the system when it detects loss of a phase", "To balance the current between the three motor phases", "To convert three-phase to single-phase for the compressor"],
    explanation_en: "The phase-loss relay protects motors by shutting down the system when it detects phase loss or imbalance."
  },
  {
    category: "Electricidad",
    q: "¿Qué mide un amperímetro de gancho (clamp meter) sin necesidad de desconectar cables?",
    options: ["El voltaje entre dos conductores del circuito AC", "La corriente que fluye por un conductor individual", "La resistencia del aislamiento del cable medido hoy", "La frecuencia de la señal eléctrica en el conductor"],
    correct: 1,
    explanation: "El clamp meter mide corriente por inducción electromagnética alrededor de un solo conductor."
  ,
    question_en: "What does a clamp meter measure without needing to disconnect wires?",
    options_en: ["The voltage between two circuit conductors", "The current flowing through an individual conductor", "The insulation resistance of the measured cable", "The frequency of the electrical signal in the conductor"],
    explanation_en: "The clamp meter measures current by electromagnetic induction around a single conductor."
  },
  {
    category: "Electricidad",
    q: "Si la lectura de amperaje de un compresor es 25% mayor que su FLA, ¿qué podría indicar?",
    options: ["El compresor está operando en condición perfecta", "El compresor está sobrecargado o tiene un problema", "El capacitor de marcha está sobredimensionado grande", "El voltaje de suministro es demasiado alto del normal"],
    correct: 1,
    explanation: "Corriente 25% sobre FLA indica sobrecarga, posible restricción, carga térmica excesiva o problema mecánico."
  ,
    question_en: "If a compressor's amperage reading is 25% higher than its FLA, what could it indicate?",
    options_en: ["The compressor is operating in perfect condition", "The compressor is overloaded or has a problem", "The run capacitor is oversized too large", "The supply voltage is too high above normal"],
    explanation_en: "Current 25% over FLA indicates overload, possible restriction, excessive thermal load, or a mechanical problem."
  },
  {
    category: "Electricidad",
    q: "¿Cuántas fases tiene el suministro eléctrico típico de un edificio comercial?",
    options: ["Una fase monofásica de 120/240 voltios estándar", "Dos fases bifásicas de 120/208 voltios estándar", "Tres fases trifásicas de 208 o 480 voltios estándar", "Cuatro fases polifásicas de 600 voltios industriales"],
    correct: 2,
    explanation: "Edificios comerciales típicamente reciben suministro trifásico de 208V o 480V."
  ,
    question_en: "How many phases does the typical electrical supply to a commercial building have?",
    options_en: ["Single-phase 120/240 volt standard", "Two-phase 120/208 volt standard", "Three-phase 208 or 480 volt standard", "Four-phase 600 volt industrial polyphase"],
    explanation_en: "Commercial buildings typically receive three-phase power at 208V or 480V."
  },
  // ── Controles Eléctricos (~40 preguntas) ──
  {
    category: "Controles Eléctricos",
    q: "¿Cuál es la función principal de un contactor en el circuito de una condensadora?",
    options: ["Regular el voltaje que llega al motor del compresor", "Abrir y cerrar el circuito de potencia al compresor", "Medir la corriente que consume el motor del ventilador", "Almacenar energía para el arranque del motor compresor"],
    correct: 1,
    explanation: "El contactor es un interruptor electromagnético que conecta/desconecta la alimentación al compresor."
  ,
    question_en: "What is the main function of a contactor in a condenser unit circuit?",
    options_en: ["To regulate the voltage reaching the compressor motor", "To open and close the power circuit to the compressor", "To measure the current drawn by the fan motor", "To store energy for the compressor motor startup"],
    explanation_en: "The contactor is an electromagnetic switch that connects/disconnects power to the compressor."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Qué voltaje típico energiza la bobina de un contactor en una condensadora residencial?",
    options: ["120 voltios AC de la línea de alimentación", "024 voltios AC del circuito de control bajo", "240 voltios AC de la línea de alimentación", "012 voltios DC de la batería de respaldo"],
    correct: 1,
    explanation: "La bobina del contactor opera a 24V AC, controlada por el termostato a través del circuito de control."
  ,
    question_en: "What voltage typically energizes the contactor coil in a residential condenser?",
    options_en: ["120 volts AC from the power line", "24 volts AC from the low-voltage control circuit", "240 volts AC from the power line", "12 volts DC from the backup battery"],
    explanation_en: "The contactor coil operates at 24V AC, controlled by the thermostat through the control circuit."
  },
  {
    category: "Controles Eléctricos",
    q: "Si la bobina de un contactor está quemada, ¿qué síntoma presenta el sistema de aire acondicionado?",
    options: ["El compresor arranca pero el ventilador no funciona", "El compresor no arranca aunque el termostato pida frío", "El compresor arranca y no se detiene nunca continuamente", "El ventilador funciona pero sopla aire caliente solamente"],
    correct: 1,
    explanation: "Sin bobina, el contactor no cierra sus contactos y no hay energía al compresor ni ventilador."
  ,
    question_en: "If a contactor's coil is burned, what symptom does the air conditioning system present?",
    options_en: ["The compressor starts but the fan does not work", "The compressor does not start even though the thermostat calls for cooling", "The compressor starts and never stops running continuously", "The fan works but only blows warm air"],
    explanation_en: "Without a coil, the contactor cannot close its contacts and there is no power to the compressor or fan."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Qué componente desconecta el compresor si la presión de descarga es peligrosamente alta?",
    options: ["El presostato de baja presión del lado de succión", "El presostato de alta presión del lado de descarga", "El termostato de ambiente interior de la habitación", "El capacitor de marcha del motor del compresor usado"],
    correct: 1,
    explanation: "El presostato de alta presión (HPS) abre el circuito cuando la presión de descarga excede el límite seguro."
  ,
    question_en: "What component disconnects the compressor if discharge pressure is dangerously high?",
    options_en: ["The low-pressure switch on the suction side", "The high-pressure switch on the discharge side", "The indoor room thermostat", "The compressor motor run capacitor"],
    explanation_en: "The high-pressure switch (HPS) opens the circuit when discharge pressure exceeds the safe limit."
  },
  {
    category: "Controles Eléctricos",
    q: "¿A qué presión típica se abre el presostato de alta presión en un sistema de R-410A?",
    options: ["250 psi de presión en el lado de descarga", "350 psi de presión en el lado de descarga", "610 psi de presión en el lado de descarga", "800 psi de presión en el lado de descarga"],
    correct: 2,
    explanation: "Para R-410A, el HPS se abre típicamente a ~610 psi ya que las presiones normales son 300-400 psi."
  ,
    question_en: "At what typical pressure does the high-pressure switch open on an R-410A system?",
    options_en: ["250 psi discharge side pressure", "350 psi discharge side pressure", "610 psi discharge side pressure", "800 psi discharge side pressure"],
    explanation_en: "For R-410A, the HPS typically opens at ~610 psi since normal pressures are 300-400 psi."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Qué es un relay de tiempo de anti-cortociclo (short-cycle timer) y para qué sirve?",
    options: ["Protege el termostato contra sobrecalentamiento excesivo", "Evita que el compresor arranque muy rápido tras apagarse", "Aumenta la velocidad del ventilador durante el deshielo", "Reduce el voltaje de arranque para proteger el capacitor"],
    correct: 1,
    explanation: "El timer anti-cortociclo fuerza un delay de 5 min entre arranques para proteger el compresor."
  ,
    question_en: "What is a short-cycle timer relay and what is it used for?",
    options_en: ["It protects the thermostat against excessive overheating", "It prevents the compressor from restarting too quickly after shutting off", "It increases the fan speed during the defrost cycle", "It reduces the starting voltage to protect the capacitor"],
    explanation_en: "The anti-short-cycle timer forces a 5-minute delay between starts to protect the compressor."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Cuántos cables conectan típicamente un termostato básico de frío/calor a la unidad interior?",
    options: ["2 cables: R (power) y W (calor) solamente", "4 cables: R, G, Y, W para todas las funciones", "6 cables: R, C, G, Y, W, O para todas funciones", "8 cables: R, C, G, Y, W, O, B, E para todo equipo"],
    correct: 1,
    explanation: "Un termostato básico de frío/calor usa 4 cables: R (24V), G (fan), Y (frío), W (calor)."
  ,
    question_en: "How many wires typically connect a basic heat/cool thermostat to the indoor unit?",
    options_en: ["2 wires: R (power) and W (heat) only", "4 wires: R, G, Y, W for all functions", "6 wires: R, C, G, Y, W, O for all functions", "8 wires: R, C, G, Y, W, O, B, E for all equipment"],
    explanation_en: "A basic heat/cool thermostat uses 4 wires: R (24V), G (fan), Y (cool), W (heat)."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Qué terminal del termostato energiza el contactor de la condensadora cuando pide enfriamiento?",
    options: ["Terminal W de calor del termostato de control", "Terminal Y de frío del termostato de control bajo", "Terminal G de ventilador del termostato de control", "Terminal C de común del termostato de control bajo"],
    correct: 1,
    explanation: "Y (Yellow) es la terminal que activa el contactor de la condensadora para enfriamiento."
  ,
    question_en: "Which thermostat terminal energizes the condenser contactor when calling for cooling?",
    options_en: ["Terminal W for heat on the control thermostat", "Terminal Y for cooling on the low-voltage control thermostat", "Terminal G for fan on the control thermostat", "Terminal C for common on the low-voltage control thermostat"],
    explanation_en: "Y (Yellow) is the terminal that activates the condenser contactor for cooling."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Qué sucede si se hace un puente (jumper) entre R y Y en la bornera del air handler?",
    options: ["El ventilador interior se enciende en velocidad baja", "La condensadora se activa continuamente sin termostato", "El calefactor eléctrico se enciende a máxima potencia", "El sistema entra en modo de deshielo de emergencia ahora"],
    correct: 1,
    explanation: "Puentear R a Y envía 24V al contactor de la condensadora, encendiéndola sin importar el termostato."
  ,
    question_en: "What happens if a jumper is placed between R and Y at the air handler terminal strip?",
    options_en: ["The indoor fan turns on at low speed", "The condenser activates continuously without the thermostat", "The electric heater turns on at maximum power", "The system enters emergency defrost mode now"],
    explanation_en: "Jumping R to Y sends 24V to the condenser contactor, turning it on regardless of the thermostat."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Cuál es la función del relay de fan en un sistema de calefacción con horno de gas residencial?",
    options: ["Encender el ventilador cuando el intercambiador calienta", "Apagar el quemador cuando la temperatura es muy alta", "Regular la velocidad del motor del ventilador del horno", "Abrir la válvula de gas cuando el termostato pide calor"],
    correct: 0,
    explanation: "El fan relay enciende el ventilador cuando el plenum alcanza temperatura, distribuyendo aire caliente."
  ,
    question_en: "What is the function of the fan relay in a residential gas furnace heating system?",
    options_en: ["To turn on the fan when the heat exchanger warms up", "To shut off the burner when temperature is too high", "To regulate the furnace fan motor speed", "To open the gas valve when the thermostat calls for heat"],
    explanation_en: "The fan relay turns on the blower when the plenum reaches temperature, distributing warm air."
  },
  {
    category: "Controles Eléctricos",
    q: "Un relay SPDT (Single Pole Double Throw) tiene cuántas terminales de conexión?",
    options: ["2 terminales: una entrada y una salida directa", "3 terminales: un común, un NO y un NC de contacto", "4 terminales: dos entradas y dos salidas directas", "5 terminales: dos comunes y tres posiciones de salida"],
    correct: 1,
    explanation: "SPDT tiene 3 terminales: Common (C), Normally Open (NO), y Normally Closed (NC)."
  ,
    question_en: "An SPDT (Single Pole Double Throw) relay has how many connection terminals?",
    options_en: ["2 terminals: one input and one direct output", "3 terminals: one common, one NO and one NC contact", "4 terminals: two inputs and two direct outputs", "5 terminals: two commons and three output positions"],
    explanation_en: "SPDT has 3 terminals: Common (C), Normally Open (NO), and Normally Closed (NC)."
  },
  {
    category: "Controles Eléctricos",
    q: "¿Qué componente electrónico reemplaza al contactor mecánico en sistemas inverter modernos?",
    options: ["Un transformador de voltaje variable bidireccional", "Un módulo de potencia con transistores IGBT semicond", "Un capacitor de arranque de alta capacitancia ajustable", "Un relay electromagnético de múltiples polos de contacto"],
    correct: 1,
    explanation: "Los IGBT (Insulated Gate Bipolar Transistors) controlan la potencia en compresores inverter sin contactos mecánicos."
  ,
    question_en: "What electronic component replaces the mechanical contactor in modern inverter systems?",
    options_en: ["A variable bidirectional voltage transformer", "A power module with IGBT semiconductor transistors", "An adjustable high-capacitance start capacitor", "A multi-pole electromagnetic contact relay"],
    explanation_en: "IGBTs (Insulated Gate Bipolar Transistors) control power in inverter compressors without mechanical contacts."
  },
  // ── Controles de Fluidos (~35 preguntas) ──
  {
    category: "Controles de Fluidos",
    q: "¿Cuál es la función principal de la válvula de expansión termostática (TXV) en el sistema?",
    options: ["Comprimir el refrigerante de baja a alta presión", "Regular el flujo de refrigerante al evaporador según carga", "Condensar el refrigerante gaseoso a estado líquido frío", "Filtrar las impurezas y humedad del refrigerante sucio"],
    correct: 1,
    explanation: "La TXV regula el flujo de refrigerante al evaporador para mantener el sobrecalentamiento correcto."
  ,
    question_en: "What is the main function of the thermostatic expansion valve (TXV) in the system?",
    options_en: ["To compress the refrigerant from low to high pressure", "To regulate refrigerant flow to the evaporator according to load", "To condense the gaseous refrigerant to cold liquid state", "To filter impurities and moisture from the dirty refrigerant"],
    explanation_en: "The TXV regulates refrigerant flow to the evaporator to maintain proper superheat."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Qué mide el bulbo sensor de una TXV para regular el flujo de refrigerante al evaporador?",
    options: ["La presión de descarga del compresor lado de alta", "La temperatura de la línea de succión del evaporador", "La temperatura del aire de retorno entrando al equipo", "La presión del líquido antes de la válvula de expansión"],
    correct: 1,
    explanation: "El bulbo sensor mide la temperatura de la línea de succión para calcular el sobrecalentamiento."
  ,
    question_en: "What does the sensing bulb of a TXV measure to regulate refrigerant flow to the evaporator?",
    options_en: ["The compressor discharge pressure on the high side", "The temperature of the evaporator suction line", "The return air temperature entering the equipment", "The liquid pressure before the expansion valve"],
    explanation_en: "The sensing bulb measures suction line temperature to calculate superheat."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Dónde se monta el bulbo sensor de la TXV en la línea de succión del evaporador?",
    options: ["En la parte inferior del tubo a las 6 en punto", "En la parte superior del tubo entre las 10 y 2 posición", "Dentro del tubo de succión sumergido en refrigerante", "En la línea de líquido antes del filtro secador central"],
    correct: 1,
    explanation: "El bulbo se monta entre las 10 y 2 (arriba) del tubo de succión para evitar lecturas falsas por aceite."
  ,
    question_en: "Where is the TXV sensing bulb mounted on the evaporator suction line?",
    options_en: ["At the bottom of the tube at the 6 o'clock position", "At the top of the tube between the 10 and 2 o'clock position", "Inside the suction tube submerged in refrigerant", "On the liquid line before the central filter drier"],
    explanation_en: "The bulb is mounted between 10 and 2 o'clock (top) of the suction tube to avoid false readings from oil."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Qué es el sobrecalentamiento (superheat) en un evaporador y cuál es su rango normal?",
    options: ["La diferencia entre presión alta y baja: 50-80 psi", "La temperatura del gas sobre su punto de ebullición: 8-14°F", "La temperatura del líquido bajo su punto de condensación 5°F", "La diferencia de temperatura entre entrada y salida: 20°F"],
    correct: 1,
    explanation: "Superheat = temp. succión - temp. saturación. Rango normal: 8-14°F en la salida del evaporador."
  ,
    question_en: "What is superheat in an evaporator and what is its normal range?",
    options_en: ["The difference between high and low pressure: 50-80 psi", "The gas temperature above its boiling point: 8-14 degrees F", "The liquid temperature below its condensation point: 5 degrees F", "The temperature difference between inlet and outlet: 20 degrees F"],
    explanation_en: "Superheat = suction temp - saturation temp. Normal range: 8-14 degrees F at the evaporator outlet."
  },
  {
    category: "Controles de Fluidos",
    q: "Si el sobrecalentamiento de un evaporador es de 3°F, ¿qué está sucediendo?",
    options: ["El evaporador está funcionando perfectamente normal ideal", "El evaporador está sobrealimentado con refrigerante líquido", "El evaporador está subalimentado y necesita más refrigerante", "La TXV está completamente cerrada sin flujo de refrigerante"],
    correct: 1,
    explanation: "3°F de superheat es demasiado bajo = líquido llegando al compresor (floodback), riesgo de daño."
  ,
    question_en: "If the evaporator superheat is 3 degrees F, what is happening?",
    options_en: ["The evaporator is working perfectly normally ideal", "The evaporator is overfed with liquid refrigerant", "The evaporator is underfed and needs more refrigerant", "The TXV is completely closed with no refrigerant flow"],
    explanation_en: "3 degrees F superheat is too low = liquid reaching the compressor (floodback), risk of damage."
  },
  {
    category: "Controles de Fluidos",
    q: "Si el sobrecalentamiento es de 30°F en el evaporador, ¿qué podría estar mal?",
    options: ["La TXV está dejando pasar demasiado refrigerante", "La TXV está restringida o la carga de refrigerante es baja", "El condensador está sucio y bloqueando el flujo de aire", "El compresor está funcionando con eficiencia máxima total"],
    correct: 1,
    explanation: "30°F superheat = insuficiente refrigerante en el evaporador. TXV restringida, carga baja, o restricción."
  ,
    question_en: "If the superheat is 30 degrees F at the evaporator, what could be wrong?",
    options_en: ["The TXV is letting too much refrigerant through", "The TXV is restricted or the refrigerant charge is low", "The condenser is dirty and blocking airflow", "The compressor is operating at maximum total efficiency"],
    explanation_en: "30 degrees F superheat = insufficient refrigerant in the evaporator. TXV restricted, low charge, or restriction."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Cuál es la función del tubo capilar como dispositivo de expansión?",
    options: ["Comprimir el gas refrigerante a alta presión caliente", "Reducir la presión del refrigerante por restricción de flujo", "Almacenar refrigerante líquido en el receptor del sistema", "Separar el aceite del refrigerante en la línea de succión"],
    correct: 1,
    explanation: "El tubo capilar es un tubo largo y delgado que reduce la presión por fricción, sin partes móviles."
  ,
    question_en: "What is the function of the capillary tube as an expansion device?",
    options_en: ["To compress refrigerant gas to high hot pressure", "To reduce refrigerant pressure by flow restriction", "To store liquid refrigerant in the system receiver", "To separate oil from refrigerant in the suction line"],
    explanation_en: "The capillary tube is a long thin tube that reduces pressure through friction, with no moving parts."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Cuál es la ventaja de una TXV sobre un tubo capilar en un aire acondicionado?",
    options: ["La TXV es más barata y fácil de instalar en campo", "La TXV ajusta el flujo según la carga térmica variable", "La TXV no tiene partes móviles y nunca necesita ajuste", "La TXV funciona sin bulbo sensor ni presión de ecualización"],
    correct: 1,
    explanation: "La TXV modula el flujo de refrigerante según la demanda, mientras el capilar es flujo fijo."
  ,
    question_en: "What is the advantage of a TXV over a capillary tube in an air conditioner?",
    options_en: ["The TXV is cheaper and easier to install in the field", "The TXV adjusts flow according to the variable thermal load", "The TXV has no moving parts and never needs adjustment", "The TXV works without a sensing bulb or equalization pressure"],
    explanation_en: "The TXV modulates refrigerant flow based on demand, while the capillary tube provides fixed flow."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Qué componente en la línea de líquido protege a la TXV de obstrucciones por partículas?",
    options: ["El acumulador de succión del lado de baja presión", "El filtro secador (filter-drier) de la línea de líquido", "El separador de aceite de la línea de descarga alta", "El visor de líquido (sight glass) con indicador color"],
    correct: 1,
    explanation: "El filtro secador atrapa partículas, humedad y ácidos antes de que lleguen a la TXV."
  ,
    question_en: "What component on the liquid line protects the TXV from particle obstruction?",
    options_en: ["The suction accumulator on the low-pressure side", "The filter-drier on the liquid line", "The oil separator on the high-side discharge line", "The sight glass with color indicator"],
    explanation_en: "The filter-drier traps particles, moisture, and acids before they reach the TXV."
  },
  {
    category: "Controles de Fluidos",
    q: "Si el visor de líquido (sight glass) muestra burbujas constantes, ¿qué puede indicar?",
    options: ["El sistema está completamente cargado y funcionando bien", "El sistema tiene carga baja de refrigerante o restricción", "La TXV está completamente abierta dejando pasar todo", "El compresor está funcionando en máxima capacidad ideal"],
    correct: 1,
    explanation: "Burbujas en el sight glass = refrigerante insuficiente en la línea de líquido (flash gas) o restricción."
  ,
    question_en: "If the sight glass shows constant bubbles, what can it indicate?",
    options_en: ["The system is fully charged and working well", "The system has a low refrigerant charge or restriction", "The TXV is fully open letting everything through", "The compressor is running at maximum ideal capacity"],
    explanation_en: "Bubbles in the sight glass = insufficient refrigerant in the liquid line (flash gas) or restriction."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Cuál es la función del acumulador de succión en un sistema con bomba de calor?",
    options: ["Almacenar refrigerante líquido de alta presión caliente", "Atrapar líquido para evitar que llegue al compresor", "Aumentar la presión del gas de succión al compresor", "Filtrar partículas metálicas del aceite del compresor"],
    correct: 1,
    explanation: "El acumulador atrapa refrigerante líquido en la línea de succión protegiendo al compresor de slugging."
  ,
    question_en: "What is the function of the suction accumulator in a heat pump system?",
    options_en: ["To store high-pressure hot liquid refrigerant", "To trap liquid to prevent it from reaching the compressor", "To increase the suction gas pressure to the compressor", "To filter metal particles from the compressor oil"],
    explanation_en: "The accumulator traps liquid refrigerant in the suction line, protecting the compressor from slugging."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Qué válvula se usa en sistemas comerciales para mantener presión mínima en el evaporador?",
    options: ["Válvula de expansión termostática tipo TXV estándar", "Válvula reguladora de presión de evaporador tipo EPR", "Válvula de servicio de succión tipo Rotolock estándar", "Válvula solenoide de cierre de línea de líquido NC"],
    correct: 1,
    explanation: "La EPR (Evaporator Pressure Regulator) mantiene presión mínima evitando congelamiento del evaporador."
  ,
    question_en: "What valve is used in commercial systems to maintain minimum evaporator pressure?",
    options_en: ["Standard TXV thermostatic expansion valve", "EPR-type evaporator pressure regulator valve", "Standard Rotolock-type suction service valve", "NC solenoid valve for liquid line shutoff"],
    explanation_en: "The EPR (Evaporator Pressure Regulator) maintains minimum pressure to prevent evaporator freeze-up."
  },
  {
    category: "Controles de Fluidos",
    q: "¿Qué tipo de válvula se abre y cierra eléctricamente para controlar el flujo de refrigerante líquido?",
    options: ["Válvula de expansión termostática con bulbo sensor", "Válvula solenoide normalmente cerrada en línea líquido", "Válvula de bola manual de un cuarto de vuelta servicio", "Válvula de alivio de presión con resorte calibrado fijo"],
    correct: 1,
    explanation: "La válvula solenoide usa un electroimán para abrir/cerrar, controlando flujo de refrigerante eléctricamente."
  ,
    question_en: "What type of valve opens and closes electrically to control liquid refrigerant flow?",
    options_en: ["Thermostatic expansion valve with sensing bulb", "Normally closed solenoid valve on the liquid line", "Manual quarter-turn ball valve for service", "Pressure relief valve with calibrated fixed spring"],
    explanation_en: "The solenoid valve uses an electromagnet to open/close, controlling refrigerant flow electrically."
  },
  // ── Controles de Temperatura (~35 preguntas) ──
  {
    category: "Controles de Temperatura",
    q: "¿Cuál es el diferencial típico de temperatura de un termostato residencial estándar?",
    options: ["0.5 grados Fahrenheit de diferencial temperatura", "1.0 grados Fahrenheit de diferencial temperatura", "2.0 grados Fahrenheit de diferencial temperatura", "5.0 grados Fahrenheit de diferencial temperatura"],
    correct: 2,
    explanation: "La mayoría de termostatos residenciales tienen un diferencial de ±1°F (2°F total) alrededor del setpoint."
  ,
    question_en: "What is the typical temperature differential of a standard residential thermostat?",
    options_en: ["0.5 degrees Fahrenheit temperature differential", "1.0 degrees Fahrenheit temperature differential", "2.0 degrees Fahrenheit temperature differential", "5.0 degrees Fahrenheit temperature differential"],
    explanation_en: "Most residential thermostats have a differential of +/-1 degree F (2 degrees F total) around the setpoint."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué es el 'heat anticipator' en un termostato mecánico y cuál es su función?",
    options: ["Un sensor que mide la humedad del aire de retorno", "Un pequeño calentador que apaga el horno antes de tiempo", "Un relay que aumenta la velocidad del ventilador interior", "Un fusible que protege el circuito contra cortocircuitos"],
    correct: 1,
    explanation: "El heat anticipator es una resistencia que calienta el bimetal, apagando el horno antes para evitar sobretemperatura."
  ,
    question_en: "What is the 'heat anticipator' in a mechanical thermostat and what is its function?",
    options_en: ["A sensor that measures the return air humidity", "A small heater that shuts off the furnace early", "A relay that increases the indoor fan speed", "A fuse that protects the circuit against short circuits"],
    explanation_en: "The heat anticipator is a resistor that heats the bimetal, shutting off the furnace early to prevent overshoot."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué tipo de sensor de temperatura usa un termostato digital moderno típicamente?",
    options: ["Bimetal de expansión diferencial mecánico curvo", "Termistor NTC de resistencia variable semiconductora", "Mercurio en tubo de vidrio sellado herméticamente", "Termopar tipo K de dos metales diferentes unidos"],
    correct: 1,
    explanation: "Los termostatos digitales usan termistores NTC (Negative Temperature Coefficient) que varían resistencia con temperatura."
  ,
    question_en: "What type of temperature sensor does a modern digital thermostat typically use?",
    options_en: ["Mechanical curved differential expansion bimetal", "NTC variable resistance semiconductor thermistor", "Mercury in a hermetically sealed glass tube", "Type K thermocouple of two different joined metals"],
    explanation_en: "Digital thermostats use NTC (Negative Temperature Coefficient) thermistors that vary resistance with temperature."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué significa 'setpoint' en un termostato programable digital?",
    options: ["La temperatura actual medida en la habitación hoy", "La temperatura deseada programada por el usuario meta", "La temperatura exterior medida por sensor externo hoy", "La diferencia entre temperatura interior y exterior hoy"],
    correct: 1,
    explanation: "Setpoint es la temperatura objetivo que el usuario programa y el sistema intenta mantener."
  ,
    question_en: "What does 'setpoint' mean on a digital programmable thermostat?",
    options_en: ["The current temperature measured in the room today", "The desired temperature programmed by the user as a target", "The outdoor temperature measured by an external sensor today", "The difference between indoor and outdoor temperature today"],
    explanation_en: "Setpoint is the target temperature the user programs and the system tries to maintain."
  },
  {
    category: "Controles de Temperatura",
    q: "Un limit switch (interruptor de límite) en un horno de gas se activa cuando:",
    options: ["La temperatura del aire de retorno es muy baja fría", "La temperatura del plenum excede el límite de seguridad", "La presión del gas natural baja del mínimo requerido", "La llama del quemador se apaga por falta de combustible"],
    correct: 1,
    explanation: "El limit switch abre el circuito del gas si el plenum se sobrecalienta, previniendo incendio."
  ,
    question_en: "A limit switch in a gas furnace activates when:",
    options_en: ["The return air temperature is very low and cold", "The plenum temperature exceeds the safety limit", "The natural gas pressure drops below the minimum required", "The burner flame goes out due to lack of fuel"],
    explanation_en: "The limit switch opens the gas circuit if the plenum overheats, preventing a fire."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué tipo de control de temperatura inicia el ciclo de deshielo en una bomba de calor?",
    options: ["Un termostato de ambiente interior estándar programable", "Un sensor de temperatura en el serpentín exterior o timer", "Un presostato de alta presión del lado de descarga", "Un humidistato que mide la humedad relativa del aire"],
    correct: 1,
    explanation: "El deshielo se inicia por sensor de temperatura en el serpentín exterior o por tiempo + temperatura."
  ,
    question_en: "What type of temperature control initiates the defrost cycle in a heat pump?",
    options_en: ["A standard programmable indoor room thermostat", "A temperature sensor on the outdoor coil or a timer", "A high-pressure switch on the discharge side", "A humidistat that measures relative air humidity"],
    explanation_en: "Defrost is initiated by a temperature sensor on the outdoor coil or by time + temperature."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Cuál es la temperatura típica de corte del limit switch en un horno de gas residencial?",
    options: ["120 grados Fahrenheit de temperatura de corte", "150 grados Fahrenheit de temperatura de corte", "200 grados Fahrenheit de temperatura de corte", "250 grados Fahrenheit de temperatura de corte"],
    correct: 2,
    explanation: "El limit switch típicamente corta entre 180-200°F para proteger el intercambiador de calor."
  ,
    question_en: "What is the typical cutout temperature of the limit switch in a residential gas furnace?",
    options_en: ["120 degrees Fahrenheit cutout temperature", "150 degrees Fahrenheit cutout temperature", "200 degrees Fahrenheit cutout temperature", "250 degrees Fahrenheit cutout temperature"],
    explanation_en: "The limit switch typically cuts out between 180-200 degrees F to protect the heat exchanger."
  },
  {
    category: "Controles de Temperatura",
    q: "Un termostato programable 7-day permite al usuario:",
    options: ["Programar una sola temperatura fija para toda la semana", "Programar temperaturas diferentes para cada día de semana", "Solo encender y apagar el sistema manualmente cada vez", "Controlar la velocidad del ventilador pero no la temperatura"],
    correct: 1,
    explanation: "Un termostato 7-day permite programar horarios y temperaturas individuales para cada día de la semana."
  ,
    question_en: "A 7-day programmable thermostat allows the user to:",
    options_en: ["Program a single fixed temperature for the entire week", "Program different temperatures for each day of the week", "Only turn the system on and off manually each time", "Control the fan speed but not the temperature"],
    explanation_en: "A 7-day thermostat allows programming individual schedules and temperatures for each day of the week."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué terminal del termostato controla el ventilador interior de forma independiente manual?",
    options: ["Terminal Y para enfriamiento del aire acondicionado", "Terminal G para ventilador independiente del interior", "Terminal W para calefacción del horno de gas caliente", "Terminal R para energía de 24 voltios del transformador"],
    correct: 1,
    explanation: "Terminal G (Green) controla el relay del ventilador interior para operación continua o manual."
  ,
    question_en: "Which thermostat terminal controls the indoor fan independently in manual mode?",
    options_en: ["Terminal Y for air conditioning cooling", "Terminal G for independent indoor fan control", "Terminal W for gas furnace heating", "Terminal R for 24-volt transformer power"],
    explanation_en: "Terminal G (Green) controls the indoor fan relay for continuous or manual operation."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué es el 'deadband' en un termostato con modo auto (frío/calor automático)?",
    options: ["El tiempo de espera entre ciclos de frío y calor seguidos", "La zona de temperatura entre setpoints de frío y calor", "La máxima diferencia entre temperatura interior y exterior", "El voltaje mínimo para que el termostato funcione bien"],
    correct: 1,
    explanation: "Deadband es la zona neutral entre setpoints de frío y calor donde ni uno ni otro se activa (típico 2-3°F)."
  ,
    question_en: "What is the 'deadband' on a thermostat with auto mode (automatic heat/cool)?",
    options_en: ["The waiting time between consecutive cooling and heating cycles", "The temperature zone between the cooling and heating setpoints", "The maximum difference between indoor and outdoor temperature", "The minimum voltage for the thermostat to work properly"],
    explanation_en: "Deadband is the neutral zone between cooling and heating setpoints where neither activates (typically 2-3 degrees F)."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Por qué NO se debe instalar un termostato en una pared exterior o cerca de una ventana?",
    options: ["Porque la pared exterior conduce electricidad estática", "Porque las temperaturas falsas causan ciclos incorrectos", "Porque el viento exterior puede dañar el termostato caro", "Porque la lluvia puede entrar y causar cortocircuito malo"],
    correct: 1,
    explanation: "Paredes exteriores y ventanas causan lecturas falsas de temperatura, haciendo que el sistema cicle incorrectamente."
  ,
    question_en: "Why should a thermostat NOT be installed on an exterior wall or near a window?",
    options_en: ["Because the exterior wall conducts static electricity", "Because false temperatures cause incorrect cycling", "Because outdoor wind can damage the expensive thermostat", "Because rain can enter and cause a bad short circuit"],
    explanation_en: "Exterior walls and windows cause false temperature readings, making the system cycle incorrectly."
  },
  {
    category: "Controles de Temperatura",
    q: "Un flame sensor (sensor de llama) en un horno de gas funciona detectando:",
    options: ["La temperatura de la llama con un termopar tipo K", "La corriente de ionización producida por la llama activa", "El color de la llama mediante un sensor óptico de luz", "El sonido de la combustión con un micrófono piezoeléctrico"],
    correct: 1,
    explanation: "El flame sensor detecta la corriente de ionización (microamperios) que produce la llama al quemar gas."
  ,
    question_en: "A flame sensor in a gas furnace works by detecting:",
    options_en: ["The flame temperature with a type K thermocouple", "The ionization current produced by the active flame", "The flame color through an optical light sensor", "The combustion sound with a piezoelectric microphone"],
    explanation_en: "The flame sensor detects the ionization current (microamps) produced by the flame when burning gas."
  },
  {
    category: "Controles de Temperatura",
    q: "Si el flame sensor está sucio con óxido, ¿qué síntoma presenta el horno de gas?",
    options: ["El horno funciona normalmente sin ningún problema", "El horno enciende brevemente y se apaga repetidamente", "El horno no enciende el ventilador de circulación aire", "El horno produce una llama amarilla en vez de azul normal"],
    correct: 1,
    explanation: "Un flame sensor sucio no detecta suficiente corriente de ionización, causando apagado por seguridad."
  ,
    question_en: "If the flame sensor is dirty with oxide, what symptom does the gas furnace present?",
    options_en: ["The furnace works normally without any problem", "The furnace lights briefly and shuts off repeatedly", "The furnace does not turn on the air circulation fan", "The furnace produces a yellow flame instead of normal blue"],
    explanation_en: "A dirty flame sensor does not detect enough ionization current, causing a safety shutdown."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Cómo se limpia correctamente un flame sensor de un horno de gas?",
    options: ["Con agua y jabón frotando suavemente con esponja", "Con lija fina o esponja abrasiva scotch-brite suave", "Con solvente químico y trapo empapado en acetona", "No se limpia, se reemplaza cada vez que falla sucio"],
    correct: 1,
    explanation: "Se limpia con lija fina o scotch-brite para remover el óxido sin dañar la varilla del sensor."
  ,
    question_en: "How is a gas furnace flame sensor correctly cleaned?",
    options_en: ["With soap and water, gently scrubbing with a sponge", "With fine sandpaper or a soft Scotch-Brite abrasive pad", "With chemical solvent and an acetone-soaked rag", "It is not cleaned; replace it each time it fails dirty"],
    explanation_en: "Clean with fine sandpaper or Scotch-Brite to remove oxide without damaging the sensor rod."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Cuántos microamperios debe leer un flame sensor funcionando correctamente?",
    options: ["0.1 a 0.5 microamperios de corriente de ionización", "0.5 a 6.0 microamperios de corriente de ionización", "10 a 20.0 microamperios de corriente de ionización", "50 a 100.0 microamperios de corriente de ionización"],
    correct: 1,
    explanation: "Un flame sensor sano lee entre 0.5 y 6 μA. Por debajo de 0.5 μA, el módulo apaga el gas."
  ,
    question_en: "How many microamps should a properly functioning flame sensor read?",
    options_en: ["0.1 to 0.5 microamps of ionization current", "0.5 to 6.0 microamps of ionization current", "10 to 20.0 microamps of ionization current", "50 to 100.0 microamps of ionization current"],
    explanation_en: "A healthy flame sensor reads between 0.5 and 6 uA. Below 0.5 uA, the module shuts off the gas."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué es un termostato 'smart' WiFi y qué ventaja tiene sobre uno programable básico?",
    options: ["Solo se puede controlar desde el panel frontal manual", "Aprende hábitos y se controla remotamente por teléfono", "Tiene más cables y es más difícil de instalar en la pared", "Funciona sin electricidad usando baterías solares solamente"],
    correct: 1,
    explanation: "Los smart thermostats (Nest, Ecobee) aprenden patrones, se controlan por app y optimizan consumo."
  ,
    question_en: "What is a 'smart' WiFi thermostat and what advantage does it have over a basic programmable one?",
    options_en: ["It can only be controlled from the front panel manually", "It learns habits and can be controlled remotely by phone", "It has more wires and is harder to install on the wall", "It runs without electricity using only solar batteries"],
    explanation_en: "Smart thermostats (Nest, Ecobee) learn patterns, are controlled via app, and optimize energy consumption."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué cable es NECESARIO para que un termostato WiFi funcione sin problemas de energía?",
    options: ["Cable R (24V power) solamente es suficiente", "Cable C (common) para energía continua de 24V AC", "Cable W2 (segunda etapa de calor) para respaldo", "Cable S1 (sensor exterior) para lectura de temperatura"],
    correct: 1,
    explanation: "El cable C (common) proporciona el retorno de 24V AC necesario para alimentar continuamente el WiFi."
  ,
    question_en: "What wire is NECESSARY for a WiFi thermostat to function without power issues?",
    options_en: ["R wire (24V power) alone is sufficient", "C wire (common) for continuous 24V AC power", "W2 wire (second heat stage) for backup", "S1 wire (outdoor sensor) for temperature reading"],
    explanation_en: "The C wire (common) provides the 24V AC return needed to continuously power the WiFi."
  },
  {
    category: "Controles de Temperatura",
    q: "¿A qué temperatura debe ajustarse el termostato para máxima eficiencia en verano según ENERGY STAR?",
    options: ["68 grados Fahrenheit para confort en enfriamiento", "72 grados Fahrenheit para confort en enfriamiento", "75 grados Fahrenheit para confort en enfriamiento", "78 grados Fahrenheit para confort en enfriamiento"],
    correct: 3,
    explanation: "ENERGY STAR recomienda 78°F cuando estás en casa en verano para balance de confort y eficiencia."
  ,
    question_en: "At what temperature should the thermostat be set for maximum summer efficiency per ENERGY STAR?",
    options_en: ["68 degrees Fahrenheit for cooling comfort", "72 degrees Fahrenheit for cooling comfort", "75 degrees Fahrenheit for cooling comfort", "78 degrees Fahrenheit for cooling comfort"],
    explanation_en: "ENERGY STAR recommends 78 degrees F when home in summer for a balance of comfort and efficiency."
  },
  {
    category: "Controles de Temperatura",
    q: "El presostato de baja presión en un sistema de AC se abre cuando la presión de succión cae a:",
    options: ["Aproximadamente 80 psi en un sistema de R-410A AC", "Aproximadamente 60 psi en un sistema de R-410A AC", "Aproximadamente 40 psi en un sistema de R-410A AC", "Aproximadamente 20 psi en un sistema de R-410A AC"],
    correct: 1,
    explanation: "El LPS se abre típicamente a ~60 psi en R-410A, indicando baja carga, restricción o evaporador congelado."
  ,
    question_en: "The low-pressure switch in an AC system opens when the suction pressure drops to:",
    options_en: ["Approximately 80 psi in an R-410A AC system", "Approximately 60 psi in an R-410A AC system", "Approximately 40 psi in an R-410A AC system", "Approximately 20 psi in an R-410A AC system"],
    explanation_en: "The LPS typically opens at ~60 psi on R-410A, indicating low charge, restriction, or frozen evaporator."
  },
  {
    category: "Controles de Temperatura",
    q: "¿Qué controla una válvula reversible de 4 vías en una bomba de calor?",
    options: ["La velocidad del ventilador del condensador exterior", "La dirección del flujo de refrigerante entre frío y calor", "La cantidad de refrigerante que fluye al evaporador AC", "El voltaje que recibe el compresor desde el contactor"],
    correct: 1,
    explanation: "La válvula de 4 vías invierte el flujo de refrigerante para cambiar entre modo enfriamiento y calefacción."
  ,
    question_en: "What does a 4-way reversing valve control in a heat pump?",
    options_en: ["The speed of the outdoor condenser fan", "The direction of refrigerant flow between cooling and heating", "The amount of refrigerant flowing to the AC evaporator", "The voltage the compressor receives from the contactor"],
    explanation_en: "The 4-way valve reverses refrigerant flow to switch between cooling and heating modes."
  },
  {
    category: "Mini Splits",
    q: "¿Cuál es la distancia máxima recomendada entre la unidad interior y exterior de un mini split residencial estándar?",
    options: ["Entre 5 y 10 metros lineales de tubería", "Entre 15 y 25 metros lineales de tubería", "Entre 30 y 40 metros lineales de tubería", "Entre 45 y 60 metros lineales de tubería"],
    correct: 1,
    explanation: "La mayoría de fabricantes recomiendan un máximo de 15 a 25 metros de distancia entre unidades, dependiendo del modelo y la capacidad del equipo."
  ,
    question_en: "What is the maximum recommended distance between the indoor and outdoor units of a standard residential mini split?",
    options_en: ["Between 5 and 10 linear meters of piping", "Between 15 and 25 linear meters of piping", "Between 30 and 40 linear meters of piping", "Between 45 and 60 linear meters of piping"],
    explanation_en: "Most manufacturers recommend a maximum of 15 to 25 meters between units, depending on the model and capacity."
  },
  {
    category: "Mini Splits",
    q: "Al instalar un mini split, ¿qué sucede si el vacío del sistema no alcanza al menos 500 micrones antes de la carga?",
    options: ["El compresor trabaja con mayor eficiencia inicial", "Queda humedad atrapada que genera ácidos internos", "Se incrementa la presión de succión del evaporador", "La válvula de expansión compensa el exceso de aire"],
    correct: 1,
    explanation: "Un vacío insuficiente deja humedad y aire no condensable en el sistema, lo cual genera ácidos que deterioran el aceite y los componentes internos del compresor."
  ,
    question_en: "When installing a mini split, what happens if the system vacuum does not reach at least 500 microns before charging?",
    options_en: ["The compressor works with greater initial efficiency", "Trapped moisture remains that generates internal acids", "The evaporator suction pressure increases", "The expansion valve compensates for the excess air"],
    explanation_en: "Insufficient vacuum leaves moisture and non-condensable air in the system, generating acids that deteriorate oil and internal compressor components."
  },
  {
    category: "Mini Splits",
    q: "¿Qué componente del mini split inverter regula la velocidad del compresor según la demanda térmica?",
    options: ["La tarjeta de control del evaporador interior", "El módulo inverter de la placa de potencia", "El sensor de presión del condensador exterior", "La válvula de servicio de la línea de líquido"],
    correct: 1,
    explanation: "El módulo inverter en la placa de potencia convierte la corriente y varía la frecuencia para ajustar las RPM del compresor según la carga térmica requerida."
  ,
    question_en: "What component of an inverter mini split regulates the compressor speed according to thermal demand?",
    options_en: ["The indoor evaporator control board", "The inverter module on the power board", "The outdoor condenser pressure sensor", "The liquid line service valve"],
    explanation_en: "The inverter module on the power board converts current and varies frequency to adjust compressor RPM according to the required thermal load."
  },
  {
    category: "Mini Splits",
    q: "En un mini split multi-zona, ¿qué problema causa tener una unidad interior sobredimensionada respecto a las demás?",
    options: ["Se reduce el flujo de aire en todas las unidades", "Esa zona roba capacidad y las otras no enfrían bien", "El condensador exterior se congela por baja presión", "La tubería de succión se sobrecalienta excesivamente"],
    correct: 1,
    explanation: "Una unidad interior sobredimensionada consume más capacidad del condensador exterior, dejando a las otras zonas sin suficiente refrigerante y capacidad de enfriamiento."
  ,
    question_en: "In a multi-zone mini split, what problem does having an oversized indoor unit relative to the others cause?",
    options_en: ["Airflow is reduced in all units", "That zone steals capacity and the others do not cool well", "The outdoor condenser freezes from low pressure", "The suction line overheats excessively"],
    explanation_en: "An oversized indoor unit consumes more of the outdoor condenser's capacity, leaving other zones without sufficient refrigerant and cooling capacity."
  },
  {
    category: "Mini Splits",
    q: "¿Cuál es la causa más probable de que un mini split genere escarcha solo en la parte inferior del evaporador?",
    options: ["Exceso de refrigerante que inunda el evaporador", "Filtro de aire sucio que reduce el flujo de aire", "Fuga parcial con carga baja de refrigerante", "Motor del ventilador operando en velocidad alta"],
    correct: 2,
    explanation: "Con carga baja de refrigerante, solo la parte inferior del evaporador recibe líquido suficiente para evaporarse, formando escarcha localizada en esa sección."
  ,
    question_en: "What is the most likely cause of a mini split forming frost only on the bottom part of the evaporator?",
    options_en: ["Excess refrigerant flooding the evaporator", "Dirty air filter reducing airflow", "Partial leak with low refrigerant charge", "Fan motor operating at high speed"],
    explanation_en: "With a low refrigerant charge, only the bottom part of the evaporator receives enough liquid to evaporate, forming localized frost in that section."
  },
  {
    category: "Mini Splits",
    q: "¿Qué herramienta se usa para verificar que el abocardado de la tubería de cobre de un mini split no tiene fugas?",
    options: ["Un manómetro de baja presión conectado al servicio", "Un detector electrónico de fugas o jabón en la unión", "Un termómetro infrarrojo apuntando a la conexión", "Un anemómetro digital midiendo el flujo de descarga"],
    correct: 1,
    explanation: "Se utiliza un detector electrónico de fugas de refrigerante o solución jabonosa aplicada en las conexiones abocardadas para verificar hermeticidad."
  ,
    question_en: "What tool is used to verify that the copper tube flare of a mini split has no leaks?",
    options_en: ["A low-pressure gauge connected to the service port", "An electronic leak detector or soap at the connection", "An infrared thermometer aimed at the connection", "A digital anemometer measuring the discharge flow"],
    explanation_en: "An electronic refrigerant leak detector or soap solution applied to the flare connections is used to verify tightness."
  },
  {
    category: "Mini Splits",
    q: "Al seleccionar un mini split para una habitación de 20 m², ¿qué capacidad en BTU es la más adecuada considerando clima cálido?",
    options: ["Entre 6,000 y 8,000 BTU por la superficie", "Entre 12,000 y 14,000 BTU con carga térmica", "Entre 18,000 y 20,000 BTU para mayor confort", "Entre 24,000 y 28,000 BTU como factor de seguridad"],
    correct: 1,
    explanation: "Para 20 m² en clima cálido se requieren aproximadamente 12,000 BTU considerando la carga térmica por radiación solar, ocupantes y equipos electrónicos."
  ,
    question_en: "When selecting a mini split for a 20 m2 room, what BTU capacity is most appropriate considering hot climate?",
    options_en: ["Between 6,000 and 8,000 BTU for the area", "Between 12,000 and 14,000 BTU with thermal load", "Between 18,000 and 20,000 BTU for greater comfort", "Between 24,000 and 28,000 BTU as a safety factor"],
    explanation_en: "For 20 m2 in a hot climate, approximately 12,000 BTU is needed considering thermal load from solar radiation, occupants, and electronic equipment."
  },
  {
    category: "Mini Splits",
    q: "¿Qué indica un sobrecalentamiento excesivo en la línea de succión de un mini split durante operación normal?",
    options: ["El refrigerante está cargado correctamente en el sistema", "Hay exceso de refrigerante circulando en el evaporador", "Falta refrigerante o la válvula de expansión está restringida", "El ventilador del condensador gira demasiado rápido afuera"],
    correct: 2,
    explanation: "Un sobrecalentamiento alto indica que el refrigerante se evapora demasiado pronto, generalmente por carga baja o restricción en el dispositivo de expansión."
  ,
    question_en: "What does excessive superheat on the suction line of a mini split indicate during normal operation?",
    options_en: ["The refrigerant is correctly charged in the system", "There is excess refrigerant circulating in the evaporator", "There is low refrigerant or the expansion valve is restricted", "The condenser fan is spinning too fast outside"],
    explanation_en: "High superheat indicates the refrigerant evaporates too early, generally due to low charge or restriction in the expansion device."
  },
  {
    category: "Central Air",
    q: "En un sistema central de aire acondicionado, ¿cuál es la función principal del plenum de suministro?",
    options: ["Conectar el retorno con el filtro de aire principal", "Distribuir el aire acondicionado hacia los ductos ramales", "Regular la presión estática del ventilador de retorno", "Condensar la humedad antes de enfriar el aire tratado"],
    correct: 1,
    explanation: "El plenum de suministro es la cámara que recibe el aire tratado del evaporador y lo distribuye hacia los ductos ramales que van a cada zona o habitación."
  ,
    question_en: "In a central air conditioning system, what is the main function of the supply plenum?",
    options_en: ["To connect the return with the main air filter", "To distribute conditioned air to the branch ducts", "To regulate the return fan static pressure", "To condense moisture before cooling the treated air"],
    explanation_en: "The supply plenum is the chamber that receives treated air from the evaporator and distributes it to branch ducts going to each zone or room."
  },
  {
    category: "Central Air",
    q: "¿Qué componente del sistema central protege al compresor contra retorno de refrigerante líquido?",
    options: ["El filtro deshidratador instalado en línea de líquido", "El acumulador de succión antes del compresor exterior", "La válvula de servicio en la línea de alta presión", "El presostato diferencial de aceite del compresor"],
    correct: 1,
    explanation: "El acumulador de succión retiene el refrigerante líquido que no se evaporó completamente, evitando que llegue al compresor y cause daño por golpe de líquido."
  ,
    question_en: "What central system component protects the compressor against liquid refrigerant return?",
    options_en: ["The filter drier installed on the liquid line", "The suction accumulator before the outdoor compressor", "The service valve on the high-pressure line", "The compressor differential oil pressure switch"],
    explanation_en: "The suction accumulator retains liquid refrigerant that did not fully evaporate, preventing it from reaching the compressor and causing liquid slug damage."
  },
  {
    category: "Central Air",
    q: "¿Cuál es el rango normal de presión estática total en un sistema residencial de ductos para aire central?",
    options: ["Entre 0.01 y 0.10 pulgadas de columna de agua", "Entre 0.30 y 0.80 pulgadas de columna de agua", "Entre 1.50 y 2.50 pulgadas de columna de agua", "Entre 3.00 y 4.50 pulgadas de columna de agua"],
    correct: 1,
    explanation: "La presión estática total recomendada para sistemas residenciales es de 0.30 a 0.80 pulgadas de columna de agua, considerando filtros, coil y ductos."
  ,
    question_en: "What is the normal total static pressure range in a residential central air duct system?",
    options_en: ["Between 0.01 and 0.10 inches of water column", "Between 0.30 and 0.80 inches of water column", "Between 1.50 and 2.50 inches of water column", "Between 3.00 and 4.50 inches of water column"],
    explanation_en: "Recommended total static pressure for residential systems is 0.30 to 0.80 inches of water column, considering filters, coil, and ducts."
  },
  {
    category: "Central Air",
    q: "En un sistema central, ¿qué causa que el diferencial de temperatura entre el suministro y retorno sea menor a 14°F?",
    options: ["El refrigerante tiene sobrecalentamiento correcto y opera normal", "El flujo de aire es excesivo o hay fuga de refrigerante presente", "El termostato está calibrado perfectamente en el sistema central", "La válvula de expansión está completamente abierta como debe estar"],
    correct: 1,
    explanation: "Un delta T menor a 14°F indica que hay demasiado flujo de aire sobre el evaporador o que la carga de refrigerante es insuficiente para enfriar adecuadamente."
  ,
    question_en: "In a central system, what causes the temperature differential between supply and return to be less than 14 degrees F?",
    options_en: ["The refrigerant has correct superheat and operates normally", "Airflow is excessive or there is a refrigerant leak present", "The thermostat is perfectly calibrated in the central system", "The expansion valve is fully open as it should be"],
    explanation_en: "A delta T less than 14 degrees F indicates too much airflow over the evaporator or insufficient refrigerant charge for adequate cooling."
  },
  {
    category: "Central Air",
    q: "¿Por qué es importante que el evaporador de un sistema central esté instalado aguas abajo del ventilador en configuración blow-through?",
    options: ["Para que el aire frío se mezcle con el calor del motor", "Para aumentar la velocidad del aire sobre el evaporador", "Para empujar el aire a través del serpentín con presión positiva", "Para reducir la vibración mecánica del ventilador del sistema"],
    correct: 2,
    explanation: "En configuración blow-through, el ventilador empuja el aire a través del evaporador con presión positiva, asegurando distribución uniforme sobre toda la superficie del serpentín."
  ,
    question_en: "Why is it important that the evaporator in a central system be installed downstream of the blower in blow-through configuration?",
    options_en: ["So the cool air mixes with the motor heat", "To increase airflow speed over the evaporator", "To push air through the coil with positive pressure", "To reduce mechanical vibration of the system blower"],
    explanation_en: "In blow-through configuration, the blower pushes air through the evaporator with positive pressure, ensuring uniform distribution over the entire coil surface."
  },
  {
    category: "Central Air",
    q: "¿Qué problema indica cuando el amperaje del compresor de un sistema central está por encima del RLA en placa?",
    options: ["El sistema está operando con máxima eficiencia energética", "Hay una condición de sobrecarga como condensador sucio o carga alta", "El voltaje de alimentación está ligeramente por encima del nominal", "La temperatura ambiente es más baja de lo normal para la estación"],
    correct: 1,
    explanation: "Un amperaje superior al RLA indica sobrecarga, generalmente causada por condensador sucio, carga excesiva de refrigerante, o alta temperatura ambiente."
  ,
    question_en: "What problem is indicated when a central system compressor's amperage is above the nameplate RLA?",
    options_en: ["The system is operating at maximum energy efficiency", "There is an overload condition such as dirty condenser or high load", "The supply voltage is slightly above nominal", "The ambient temperature is lower than normal for the season"],
    explanation_en: "Amperage above RLA indicates overload, typically caused by a dirty condenser, excessive refrigerant charge, or high ambient temperature."
  },
  {
    category: "Central Air",
    q: "En un sistema central con gas furnace, ¿qué dispositivo de seguridad detecta si los gases de combustión no se ventilan correctamente?",
    options: ["El sensor de llama que monitorea la ignición del quemador", "El switch de presión diferencial del inductor de tiro", "El transformador de ignición de alta tensión del piloto", "El límite de temperatura alto del intercambiador de calor"],
    correct: 1,
    explanation: "El switch de presión diferencial verifica que el inductor de tiro esté creando suficiente presión negativa para evacuar correctamente los gases de combustión."
  ,
    question_en: "In a central system with a gas furnace, what safety device detects if combustion gases are not venting properly?",
    options_en: ["The flame sensor that monitors burner ignition", "The differential pressure switch on the inducer draft motor", "The high-voltage ignition transformer for the pilot", "The high-temperature limit on the heat exchanger"],
    explanation_en: "The differential pressure switch verifies that the inducer draft motor is creating sufficient negative pressure to properly evacuate combustion gases."
  },
  {
    category: "Central Air",
    q: "¿Cuál es la consecuencia de un filtro restrictivo en el retorno de un sistema de aire central?",
    options: ["Aumenta la eficiencia del sistema al filtrar más partículas", "Reduce el flujo de aire causando congelamiento del evaporador", "Incrementa la presión de descarga del compresor exterior", "Mejora la distribución del aire en todos los ductos ramales"],
    correct: 1,
    explanation: "Un filtro demasiado restrictivo reduce el flujo de aire sobre el evaporador, baja la presión de succión y puede causar congelamiento del serpentín."
  ,
    question_en: "What is the consequence of a restrictive filter on the return of a central air system?",
    options_en: ["It increases system efficiency by filtering more particles", "It reduces airflow causing evaporator freeze-up", "It increases the outdoor compressor discharge pressure", "It improves air distribution in all branch ducts"],
    explanation_en: "An overly restrictive filter reduces airflow over the evaporator, lowers suction pressure, and can cause coil freeze-up."
  },
  {
    category: "Heat Pumps",
    q: "¿Cuál es la función de la válvula reversible de cuatro vías en una bomba de calor?",
    options: ["Regular la cantidad de refrigerante que circula por el sistema", "Invertir el flujo de refrigerante para cambiar entre frío y calor", "Controlar la presión de descarga del compresor en todo momento", "Desviar el refrigerante al acumulador durante el ciclo de defrost"],
    correct: 1,
    explanation: "La válvula de cuatro vías invierte la dirección del flujo de refrigerante, convirtiendo el evaporador en condensador y viceversa para cambiar entre modo frío y calor."
  ,
    question_en: "What is the function of the four-way reversing valve in a heat pump?",
    options_en: ["To regulate the amount of refrigerant circulating in the system", "To reverse refrigerant flow to switch between cooling and heating", "To control the compressor discharge pressure at all times", "To divert refrigerant to the accumulator during the defrost cycle"],
    explanation_en: "The four-way valve reverses refrigerant flow direction, turning the evaporator into a condenser and vice versa to switch between cooling and heating modes."
  },
  {
    category: "Heat Pumps",
    q: "Durante el ciclo de defrost de una bomba de calor, ¿qué sucede con el ventilador del condensador exterior?",
    options: ["Aumenta su velocidad para derretir el hielo más rápido", "Se apaga para que el gas caliente derrita la escarcha acumulada", "Cambia a rotación inversa para expulsar el hielo hacia afuera", "Reduce su velocidad a la mitad para conservar energía eléctrica"],
    correct: 1,
    explanation: "Durante defrost, el ventilador exterior se apaga y el sistema invierte el ciclo para enviar gas caliente al serpentín exterior, derritiendo la escarcha acumulada."
  ,
    question_en: "During the defrost cycle of a heat pump, what happens with the outdoor condenser fan?",
    options_en: ["It increases speed to melt the ice faster", "It shuts off so hot gas can melt the accumulated frost", "It switches to reverse rotation to expel ice outward", "It reduces speed to half to conserve electrical energy"],
    explanation_en: "During defrost, the outdoor fan shuts off and the system reverses the cycle to send hot gas to the outdoor coil, melting the accumulated frost."
  },
  {
    category: "Heat Pumps",
    q: "¿En qué temperatura exterior aproximada una bomba de calor aire-aire pierde eficiencia y necesita calor auxiliar?",
    options: ["Cuando la temperatura baja de 50°F o 10°C aproximadamente", "Cuando la temperatura baja de 35°F o 2°C aproximadamente", "Cuando la temperatura baja de 15°F o -10°C aproximadamente", "Cuando la temperatura baja de 0°F o -18°C aproximadamente"],
    correct: 1,
    explanation: "Alrededor de 35°F (2°C), la bomba de calor convencional pierde capacidad significativa y el calor auxiliar eléctrico o de gas se activa para complementar."
  ,
    question_en: "At what approximate outdoor temperature does an air-source heat pump lose efficiency and need auxiliary heat?",
    options_en: ["When temperature drops below 50 degrees F or 10 degrees C approximately", "When temperature drops below 35 degrees F or 2 degrees C approximately", "When temperature drops below 15 degrees F or -10 degrees C approximately", "When temperature drops below 0 degrees F or -18 degrees C approximately"],
    explanation_en: "Around 35 degrees F (2 degrees C), a conventional heat pump loses significant capacity and electric or gas auxiliary heat activates to supplement."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué sensor inicia el ciclo de descongelamiento en una bomba de calor con control por demanda?",
    options: ["El termostato interior cuando detecta baja temperatura ambiente", "El sensor de temperatura del serpentín exterior y el temporizador", "El presostato de alta presión del lado de descarga del compresor", "El sensor de humedad relativa ubicado en el retorno del sistema"],
    correct: 1,
    explanation: "El defrost por demanda utiliza un sensor de temperatura en el serpentín exterior combinado con un temporizador para determinar cuándo hay escarcha que requiere descongelamiento."
  ,
    question_en: "What sensor initiates the defrost cycle in a heat pump with demand-based control?",
    options_en: ["The indoor thermostat when it detects low ambient temperature", "The outdoor coil temperature sensor and the timer", "The high-pressure switch on the compressor discharge side", "The relative humidity sensor located in the system return"],
    explanation_en: "Demand defrost uses an outdoor coil temperature sensor combined with a timer to determine when frost requires defrost."
  },
  {
    category: "Heat Pumps",
    q: "¿Cuál es el COP típico de una bomba de calor aire-aire operando a 47°F de temperatura exterior?",
    options: ["Un COP aproximado entre 1.0 y 1.5 de rendimiento", "Un COP aproximado entre 2.5 y 3.5 de rendimiento", "Un COP aproximado entre 5.0 y 6.0 de rendimiento", "Un COP aproximado entre 7.5 y 8.5 de rendimiento"],
    correct: 1,
    explanation: "A 47°F (8°C) una bomba de calor aire-aire típica tiene un COP de 2.5 a 3.5, lo que significa que produce 2.5 a 3.5 veces más calor que la energía eléctrica que consume."
  ,
    question_en: "What is the typical COP of an air-source heat pump operating at 47 degrees F outdoor temperature?",
    options_en: ["An approximate COP between 1.0 and 1.5 performance", "An approximate COP between 2.5 and 3.5 performance", "An approximate COP between 5.0 and 6.0 performance", "An approximate COP between 7.5 and 8.5 performance"],
    explanation_en: "At 47 degrees F (8 degrees C) a typical air-source heat pump has a COP of 2.5 to 3.5, meaning it produces 2.5 to 3.5 times more heat than the electrical energy it consumes."
  },
  {
    category: "Heat Pumps",
    q: "En modo calefacción, ¿por qué el aire que sale de los registros de una bomba de calor se siente más fresco que el de un furnace?",
    options: ["Porque el evaporador interior no está funcionando correctamente", "Porque la temperatura de suministro es menor que la de un furnace de gas", "Porque el ventilador del evaporador gira a una velocidad excesiva", "Porque la válvula reversible no invierte completamente el flujo del gas"],
    correct: 1,
    explanation: "Una bomba de calor suministra aire a unos 90-100°F comparado con 120-140°F de un furnace de gas, sintiéndose más fresco aunque esté calentando efectivamente."
  ,
    question_en: "In heating mode, why does the air from a heat pump's registers feel cooler than from a furnace?",
    options_en: ["Because the indoor evaporator is not working correctly", "Because the supply temperature is lower than that of a gas furnace", "Because the evaporator fan spins at excessive speed", "Because the reversing valve does not fully reverse the gas flow"],
    explanation_en: "A heat pump supplies air at about 90-100 degrees F compared to 120-140 degrees F from a gas furnace, feeling cooler even though it is effectively heating."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué indica una presión de succión anormalmente alta en una bomba de calor operando en modo calefacción?",
    options: ["La carga de refrigerante es insuficiente para la operación", "Posible válvula reversible con fuga interna entre puertos", "El filtro deshidratador está completamente obstruido y tapado", "El motor del ventilador interior está desconectado del sistema"],
    correct: 1,
    explanation: "Una válvula reversible con fuga interna permite que gas caliente de alta presión pase al lado de baja, elevando anormalmente la presión de succión."
  ,
    question_en: "What does abnormally high suction pressure indicate in a heat pump operating in heating mode?",
    options_en: ["The refrigerant charge is insufficient for operation", "Possible reversing valve with internal leak between ports", "The filter drier is completely obstructed and clogged", "The indoor fan motor is disconnected from the system"],
    explanation_en: "A reversing valve with an internal leak allows hot high-pressure gas to pass to the low side, abnormally raising suction pressure."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué componente adicional tiene una bomba de calor que no tiene un sistema de aire acondicionado convencional?",
    options: ["Un compresor scroll de alta eficiencia para el refrigerante", "Una válvula de cuatro vías y una segunda válvula de expansión", "Un condensador de mayor capacidad para rechazar más calor afuera", "Un ventilador de velocidad variable en la unidad interior del sistema"],
    correct: 1,
    explanation: "Las bombas de calor requieren una válvula de cuatro vías para invertir el ciclo y una segunda válvula de expansión para el serpentín que actúa como evaporador en cada modo."
  ,
    question_en: "What additional component does a heat pump have that a conventional air conditioning system does not?",
    options_en: ["A high-efficiency scroll compressor for the refrigerant", "A four-way valve and a second expansion valve", "A larger capacity condenser to reject more heat outdoors", "A variable-speed fan in the system's indoor unit"],
    explanation_en: "Heat pumps require a four-way valve to reverse the cycle and a second expansion valve for the coil that acts as the evaporator in each mode."
  },
  {
    category: "Deshumidificadores",
    q: "¿Cómo funciona un deshumidificador por refrigeración para extraer humedad del aire ambiente?",
    options: ["Calienta el aire para evaporar la humedad y luego la filtra", "Enfría el aire bajo su punto de rocío para condensar la humedad", "Absorbe la humedad con un material desecante y luego la drena", "Ioniza las partículas de agua para separarlas del flujo de aire"],
    correct: 1,
    explanation: "El deshumidificador por refrigeración pasa el aire por un serpentín frío que está por debajo del punto de rocío, condensando la humedad que luego se recolecta."
  ,
    question_en: "How does a refrigerant-based dehumidifier extract moisture from ambient air?",
    options_en: ["It heats the air to evaporate moisture and then filters it", "It cools the air below its dew point to condense the moisture", "It absorbs moisture with a desiccant material and then drains it", "It ionizes water particles to separate them from the airflow"],
    explanation_en: "A refrigerant dehumidifier passes air over a cold coil below the dew point, condensing the moisture which is then collected."
  },
  {
    category: "Deshumidificadores",
    q: "¿Cuántos litros por día debe extraer un deshumidificador para un área de 50 m² con humedad del 80%?",
    options: ["Entre 5 y 8 litros diarios de extracción de humedad", "Entre 12 y 20 litros diarios de extracción de humedad", "Entre 30 y 40 litros diarios de extracción de humedad", "Entre 50 y 65 litros diarios de extracción de humedad"],
    correct: 1,
    explanation: "Para 50 m² con alta humedad se requiere un deshumidificador de 12 a 20 litros por día, dependiendo de la ventilación y las fuentes internas de humedad."
  ,
    question_en: "How many liters per day should a dehumidifier extract for a 50 m2 area with 80% humidity?",
    options_en: ["Between 5 and 8 liters daily moisture extraction", "Between 12 and 20 liters daily moisture extraction", "Between 30 and 40 liters daily moisture extraction", "Between 50 and 65 liters daily moisture extraction"],
    explanation_en: "For 50 m2 with high humidity, a 12 to 20 liter per day dehumidifier is required, depending on ventilation and internal moisture sources."
  },
  {
    category: "Deshumidificadores",
    q: "¿Qué indica cuando el deshumidificador forma escarcha en el serpentín evaporador durante la operación?",
    options: ["Que el equipo está funcionando con máxima eficiencia posible", "Que la temperatura ambiente es demasiado baja para la operación", "Que el nivel de humedad del cuarto ya alcanzó el punto deseado", "Que el filtro de aire fue cambiado recientemente y está limpio"],
    correct: 1,
    explanation: "Cuando la temperatura ambiente es inferior a 18°C (65°F), el serpentín del deshumidificador puede bajar de 0°C y formar escarcha, reduciendo su efectividad."
  ,
    question_en: "What does it indicate when a dehumidifier forms frost on the evaporator coil during operation?",
    options_en: ["The unit is operating at maximum possible efficiency", "The ambient temperature is too low for operation", "The room humidity has already reached the desired point", "The air filter was recently changed and is clean"],
    explanation_en: "When ambient temperature is below 18 degrees C (65 degrees F), the dehumidifier coil can drop below 0 degrees C and form frost, reducing effectiveness."
  },
  {
    category: "Deshumidificadores",
    q: "¿Cuál es el rango de humedad relativa ideal que debe mantener un deshumidificador en un espacio habitado?",
    options: ["Entre 20% y 30% de humedad relativa en el espacio", "Entre 40% y 55% de humedad relativa en el espacio", "Entre 60% y 70% de humedad relativa en el espacio", "Entre 75% y 85% de humedad relativa en el espacio"],
    correct: 1,
    explanation: "ASHRAE recomienda mantener la humedad relativa entre 40% y 55% para confort, salud y prevención de crecimiento de moho en espacios habitados."
  ,
    question_en: "What is the ideal relative humidity range a dehumidifier should maintain in an occupied space?",
    options_en: ["Between 20% and 30% relative humidity in the space", "Between 40% and 55% relative humidity in the space", "Between 60% and 70% relative humidity in the space", "Between 75% and 85% relative humidity in the space"],
    explanation_en: "ASHRAE recommends maintaining relative humidity between 40% and 55% for comfort, health, and mold prevention in occupied spaces."
  },
  {
    category: "Deshumidificadores",
    q: "¿Qué tipo de deshumidificador es más efectivo para operar en ambientes con temperaturas por debajo de 15°C?",
    options: ["El deshumidificador portátil de tipo refrigerativo compacto", "El deshumidificador de rueda desecante o tipo rotativo térmico", "El deshumidificador con serpentín evaporador de gran superficie", "El deshumidificador con compresor inverter de baja temperatura"],
    correct: 1,
    explanation: "Los deshumidificadores desecantes no dependen de enfriar el aire bajo el punto de rocío, por lo que son efectivos a temperaturas bajas donde los refrigerativos forman escarcha."
  ,
    question_en: "What type of dehumidifier is most effective for operating in environments below 15 degrees C?",
    options_en: ["Compact portable refrigerant-type dehumidifier", "Desiccant wheel or thermal rotary type dehumidifier", "Dehumidifier with large-surface evaporator coil", "Dehumidifier with low-temperature inverter compressor"],
    explanation_en: "Desiccant dehumidifiers do not depend on cooling air below the dew point, so they are effective at low temperatures where refrigerant types frost up."
  },
  {
    category: "Deshumidificadores",
    q: "¿Cuál es el mantenimiento más crítico para la eficiencia continua de un deshumidificador por refrigeración?",
    options: ["Reemplazar el compresor cada tres años de operación continua", "Limpiar regularmente el filtro de aire y el serpentín evaporador", "Cambiar el refrigerante del sistema cada temporada de uso nuevo", "Ajustar el presostato de alta presión cada seis meses de servicio"],
    correct: 1,
    explanation: "La limpieza del filtro de aire y el serpentín es esencial porque la acumulación de polvo reduce el flujo de aire y la transferencia de calor, disminuyendo la capacidad de deshumidificación."
  ,
    question_en: "What is the most critical maintenance for the continuous efficiency of a refrigerant dehumidifier?",
    options_en: ["Replace the compressor every three years of continuous operation", "Regularly clean the air filter and the evaporator coil", "Change the system refrigerant each new usage season", "Adjust the high-pressure switch every six months of service"],
    explanation_en: "Cleaning the air filter and coil is essential because dust buildup reduces airflow and heat transfer, decreasing dehumidification capacity."
  },
  {
    category: "Deshumidificadores",
    q: "¿Qué sucede cuando el tanque de recolección de un deshumidificador está lleno y no tiene drenaje continuo?",
    options: ["El compresor incrementa su velocidad para compensar la situación", "El equipo se apaga automáticamente por el interruptor de flotador", "El agua se desborda por la bandeja hacia el piso del espacio", "El ventilador reduce su velocidad para minimizar la condensación"],
    correct: 1,
    explanation: "Los deshumidificadores tienen un interruptor de flotador que detecta cuando el tanque está lleno y apaga el equipo automáticamente para evitar desbordamientos."
  ,
    question_en: "What happens when a dehumidifier's collection tank is full and it has no continuous drain?",
    options_en: ["The compressor increases speed to compensate for the situation", "The unit shuts off automatically by the float switch", "Water overflows from the pan onto the floor of the space", "The fan reduces speed to minimize condensation"],
    explanation_en: "Dehumidifiers have a float switch that detects when the tank is full and automatically shuts off the unit to prevent overflow."
  },
  {
    category: "Deshumidificadores",
    q: "¿Por qué un deshumidificador instalado en un sótano debe tener mayor capacidad que uno para una sala del mismo tamaño?",
    options: ["Porque los sótanos tienen techos más altos que las salas comunes", "Porque los sótanos tienen mayor infiltración de humedad del suelo", "Porque los sótanos reciben más radiación solar durante todo el día", "Porque los sótanos tienen mejor ventilación que las salas del hogar"],
    correct: 1,
    explanation: "Los sótanos están en contacto directo con el suelo, lo que genera infiltración constante de humedad a través de paredes y pisos, requiriendo mayor capacidad de extracción."
  ,
    question_en: "Why must a dehumidifier installed in a basement have greater capacity than one for a living room of the same size?",
    options_en: ["Because basements have higher ceilings than regular living rooms", "Because basements have greater moisture infiltration from the ground", "Because basements receive more solar radiation throughout the day", "Because basements have better ventilation than home living rooms"],
    explanation_en: "Basements are in direct contact with the ground, generating constant moisture infiltration through walls and floors, requiring greater extraction capacity."
  },
  {
    category: "Humidificadores",
    q: "¿Qué tipo de humidificador utiliza una almohadilla de agua evaporativa conectada al ducto de suministro?",
    options: ["El humidificador de tipo ultrasónico de alta frecuencia", "El humidificador de tipo bypass o flujo pasivo de evaporación", "El humidificador de tipo vapor con resistencia eléctrica", "El humidificador de tipo atomización centrífuga de aspersión"],
    correct: 1,
    explanation: "El humidificador bypass utiliza una almohadilla saturada de agua por donde pasa aire del ducto de suministro, evaporando la humedad hacia el flujo de aire."
  ,
    question_en: "What type of humidifier uses an evaporative water pad connected to the supply duct?",
    options_en: ["High-frequency ultrasonic type humidifier", "Bypass or passive evaporative flow type humidifier", "Steam type humidifier with electric resistance element", "Centrifugal atomization spray type humidifier"],
    explanation_en: "The bypass humidifier uses a water-saturated pad through which supply duct air passes, evaporating moisture into the airflow."
  },
  {
    category: "Humidificadores",
    q: "¿Cuál es la principal ventaja de un humidificador de vapor sobre uno evaporativo en un sistema central HVAC?",
    options: ["Consume menos energía eléctrica durante la operación continua", "Produce humedad estéril sin riesgo de dispersar minerales o bacterias", "No requiere conexión de agua para funcionar de manera autónoma", "Es más silencioso porque no tiene partes mecánicas en movimiento"],
    correct: 1,
    explanation: "Los humidificadores de vapor hierven el agua, produciendo vapor estéril que no dispersa minerales ni microorganismos, a diferencia de los evaporativos que pueden generar polvo mineral."
  ,
    question_en: "What is the main advantage of a steam humidifier over an evaporative one in a central HVAC system?",
    options_en: ["It consumes less electrical energy during continuous operation", "It produces sterile moisture with no risk of spreading minerals or bacteria", "It does not require a water connection to operate autonomously", "It is quieter because it has no moving mechanical parts"],
    explanation_en: "Steam humidifiers boil water, producing sterile vapor that does not spread minerals or microorganisms, unlike evaporative types that can generate mineral dust."
  },
  {
    category: "Humidificadores",
    q: "¿Dónde se debe instalar el humidostato que controla un humidificador instalado en un sistema de ductos?",
    options: ["Dentro del ducto de suministro después del humidificador", "En el ducto de retorno o en un área representativa del espacio", "Directamente sobre la almohadilla evaporativa del humidificador", "En la pared exterior más cercana al condensador del sistema HVAC"],
    correct: 1,
    explanation: "El humidostato se instala en el ducto de retorno o en un espacio representativo para medir la humedad real del ambiente y controlar la operación del humidificador."
  ,
    question_en: "Where should the humidistat controlling a duct-installed humidifier be placed?",
    options_en: ["Inside the supply duct after the humidifier", "In the return duct or in a representative area of the space", "Directly on the humidifier's evaporative pad", "On the exterior wall nearest the HVAC system condenser"],
    explanation_en: "The humidistat is installed in the return duct or a representative space to measure actual ambient humidity and control humidifier operation."
  },
  {
    category: "Humidificadores",
    q: "¿Qué problema causa un humidificador sobredimensionado en un sistema de ductos durante el invierno?",
    options: ["El aire se vuelve demasiado seco y causa irritación respiratoria", "Genera condensación en ventanas, ductos y superficies frías del hogar", "Reduce la temperatura del aire de suministro significativamente abajo", "Aumenta el consumo de refrigerante en la bomba de calor del sistema"],
    correct: 1,
    explanation: "Un humidificador sobredimensionado eleva excesivamente la humedad, causando condensación en superficies frías como ventanas y ductos, lo que puede generar moho."
  ,
    question_en: "What problem does an oversized humidifier in a duct system cause during winter?",
    options_en: ["The air becomes too dry and causes respiratory irritation", "It generates condensation on windows, ducts, and cold home surfaces", "It significantly reduces the supply air temperature down", "It increases refrigerant consumption in the system heat pump"],
    explanation_en: "An oversized humidifier raises humidity excessively, causing condensation on cold surfaces like windows and ducts, which can generate mold."
  },
  {
    category: "Humidificadores",
    q: "¿Cada cuánto se debe reemplazar la almohadilla evaporativa de un humidificador de bypass típico?",
    options: ["Cada mes durante la temporada de calefacción de invierno", "Una vez por temporada de calefacción o al inicio de cada invierno", "Cada tres años independientemente del uso y la calidad del agua", "Nunca, solo requiere enjuague periódico con agua corriente limpia"],
    correct: 1,
    explanation: "La almohadilla evaporativa acumula depósitos minerales y debe reemplazarse al inicio de cada temporada de calefacción para mantener eficiencia y calidad de aire."
  ,
    question_en: "How often should the evaporative pad of a typical bypass humidifier be replaced?",
    options_en: ["Every month during the winter heating season", "Once per heating season or at the start of each winter", "Every three years regardless of use and water quality", "Never; it only requires periodic rinsing with clean running water"],
    explanation_en: "The evaporative pad accumulates mineral deposits and should be replaced at the start of each heating season to maintain efficiency and air quality."
  },
  {
    category: "Humidificadores",
    q: "¿Qué sucede si se instala un humidificador de bypass sin el damper de bypass entre suministro y retorno?",
    options: ["El humidificador produce el doble de humedad de lo necesario", "No hay diferencial de presión y el aire no pasa por la almohadilla", "El compresor del sistema trabaja en sobrecarga por exceso de caudal", "La almohadilla evaporativa se seca más rápido y se deteriora pronto"],
    correct: 1,
    explanation: "Sin el ducto de bypass entre suministro y retorno, no existe diferencial de presión para forzar el aire a través de la almohadilla evaporativa del humidificador."
  ,
    question_en: "What happens if a bypass humidifier is installed without the bypass damper between supply and return?",
    options_en: ["The humidifier produces double the necessary moisture", "There is no pressure differential and air does not pass through the pad", "The system compressor overloads from excess airflow", "The evaporative pad dries faster and deteriorates sooner"],
    explanation_en: "Without the bypass duct between supply and return, no pressure differential exists to force air through the humidifier's evaporative pad."
  },
  {
    category: "Humidificadores",
    q: "¿Por qué el agua dura con alto contenido mineral es problemática para los humidificadores evaporativos?",
    options: ["Porque causa corrosión acelerada en el compresor del sistema HVAC", "Porque deposita minerales en la almohadilla reduciendo la evaporación", "Porque incrementa la presión del agua en la válvula de suministro", "Porque genera espuma que bloquea la bandeja de drenaje del equipo"],
    correct: 1,
    explanation: "El agua dura deposita calcio y minerales en la almohadilla evaporativa, reduciendo su capacidad de absorción y evaporación, y acortando su vida útil significativamente."
  ,
    question_en: "Why is hard water with high mineral content problematic for evaporative humidifiers?",
    options_en: ["Because it causes accelerated corrosion in the HVAC system compressor", "Because it deposits minerals on the pad reducing evaporation", "Because it increases water pressure on the supply valve", "Because it generates foam that blocks the equipment drain pan"],
    explanation_en: "Hard water deposits calcium and minerals on the evaporative pad, reducing its absorption and evaporation capacity and significantly shortening its lifespan."
  },
  {
    category: "Humidificadores",
    q: "¿Cuál es el nivel de humedad relativa interior recomendado cuando la temperatura exterior está en -10°C?",
    options: ["Entre 50% y 60% de humedad relativa interior recomendada", "Entre 25% y 30% de humedad relativa interior recomendada", "Entre 10% y 15% de humedad relativa interior recomendada", "Entre 70% y 80% de humedad relativa interior recomendada"],
    correct: 1,
    explanation: "A -10°C exterior, la humedad interior debe mantenerse entre 25% y 30% para evitar condensación en ventanas y superficies frías del envolvente del edificio."
  ,
    question_en: "What is the recommended indoor relative humidity level when the outdoor temperature is at -10 degrees C?",
    options_en: ["Between 50% and 60% recommended indoor relative humidity", "Between 25% and 30% recommended indoor relative humidity", "Between 10% and 15% recommended indoor relative humidity", "Between 70% and 80% recommended indoor relative humidity"],
    explanation_en: "At -10 degrees C outdoor, indoor humidity should be kept between 25% and 30% to avoid condensation on windows and cold building envelope surfaces."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Cuál es el contaminante interior más peligroso que es incoloro e inodoro y proviene de combustión incompleta?",
    options: ["El dióxido de carbono generado por la respiración de personas", "El monóxido de carbono producido por equipos de gas defectuosos", "El dióxido de nitrógeno emitido por las estufas eléctricas de cocina", "El ozono generado por los purificadores iónicos de aire del hogar"],
    correct: 1,
    explanation: "El monóxido de carbono (CO) es incoloro e inodoro, producido por combustión incompleta de gas, y puede ser mortal en concentraciones altas sin ser detectado."
  ,
    question_en: "What is the most dangerous indoor contaminant that is colorless and odorless and comes from incomplete combustion?",
    options_en: ["Carbon dioxide generated by human breathing", "Carbon monoxide produced by defective gas equipment", "Nitrogen dioxide emitted by electric kitchen stoves", "Ozone generated by home ionic air purifiers"],
    explanation_en: "Carbon monoxide (CO) is colorless and odorless, produced by incomplete gas combustion, and can be fatal at high concentrations without being detected."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "Según ASHRAE 62.1, ¿cuántos CFM de aire exterior por persona se requieren como mínimo en una oficina?",
    options: ["Aproximadamente 5 CFM por persona como ventilación mínima", "Aproximadamente 15 a 20 CFM por persona como ventilación mínima", "Aproximadamente 35 a 40 CFM por persona como ventilación mínima", "Aproximadamente 55 a 60 CFM por persona como ventilación mínima"],
    correct: 1,
    explanation: "ASHRAE 62.1 especifica aproximadamente 15-20 CFM por persona en oficinas, combinando la tasa por persona y la tasa por área de piso para ventilación adecuada."
  ,
    question_en: "Per ASHRAE 62.1, how many CFM of outside air per person are required as a minimum in an office?",
    options_en: ["Approximately 5 CFM per person minimum ventilation", "Approximately 15 to 20 CFM per person minimum ventilation", "Approximately 35 to 40 CFM per person minimum ventilation", "Approximately 55 to 60 CFM per person minimum ventilation"],
    explanation_en: "ASHRAE 62.1 specifies approximately 15-20 CFM per person in offices, combining the per-person rate and the per-floor-area rate for adequate ventilation."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Qué dispositivo se utiliza para medir la concentración de CO2 como indicador de calidad del aire interior?",
    options: ["Un higrómetro digital de alta precisión calibrado en campo", "Un sensor NDIR de dióxido de carbono en partes por millón", "Un manómetro diferencial conectado al ducto de retorno del aire", "Un anemómetro de hilo caliente ubicado en la salida de ventilación"],
    correct: 1,
    explanation: "Los sensores NDIR (infrarrojo no dispersivo) miden CO2 en partes por millón y son el estándar para evaluar la ventilación y calidad del aire interior."
  ,
    question_en: "What device is used to measure CO2 concentration as an indicator of indoor air quality?",
    options_en: ["A field-calibrated high-precision digital hygrometer", "An NDIR carbon dioxide sensor in parts per million", "A differential manometer connected to the return air duct", "A hot-wire anemometer located at the ventilation outlet"],
    explanation_en: "NDIR (non-dispersive infrared) sensors measure CO2 in parts per million and are the standard for evaluating ventilation and indoor air quality."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Qué nivel de CO2 en partes por millón indica ventilación inadecuada según los estándares de ASHRAE?",
    options: ["Cuando supera las 400 ppm en el espacio interior monitoreado", "Cuando supera las 1,000 ppm en el espacio interior monitoreado", "Cuando supera las 2,500 ppm en el espacio interior monitoreado", "Cuando supera las 5,000 ppm en el espacio interior monitoreado"],
    correct: 1,
    explanation: "Niveles superiores a 1,000 ppm de CO2 indican ventilación insuficiente. ASHRAE recomienda mantener el CO2 interior por debajo de 700 ppm sobre el nivel exterior."
  ,
    question_en: "What CO2 level in parts per million indicates inadequate ventilation per ASHRAE standards?",
    options_en: ["When it exceeds 400 ppm in the monitored indoor space", "When it exceeds 1,000 ppm in the monitored indoor space", "When it exceeds 2,500 ppm in the monitored indoor space", "When it exceeds 5,000 ppm in the monitored indoor space"],
    explanation_en: "Levels above 1,000 ppm CO2 indicate insufficient ventilation. ASHRAE recommends keeping indoor CO2 below 700 ppm above the outdoor level."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Cuál es la fuente más común de compuestos orgánicos volátiles (VOCs) dentro de un edificio residencial?",
    options: ["Los sistemas de aire acondicionado central con ductos metálicos", "Pinturas, adhesivos, muebles nuevos y productos de limpieza doméstica", "Las ventanas de doble panel con gas argón entre los vidrios de marco", "Los pisos de cerámica y concreto sellado instalados recientemente"],
    correct: 1,
    explanation: "Los VOCs provienen principalmente de pinturas, barnices, adhesivos, muebles nuevos con formaldehído, y productos de limpieza que emiten gases tóxicos por largo tiempo."
  ,
    question_en: "What is the most common source of volatile organic compounds (VOCs) inside a residential building?",
    options_en: ["Central air conditioning systems with metal ductwork", "Paints, adhesives, new furniture, and household cleaning products", "Double-pane windows with argon gas between the frame panes", "Recently installed ceramic and sealed concrete floors"],
    explanation_en: "VOCs come mainly from paints, varnishes, adhesives, new furniture with formaldehyde, and cleaning products that emit toxic gases over a long time."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Qué tecnología de purificación de aire es más efectiva para eliminar virus y bacterias en el flujo de aire?",
    options: ["Los filtros de carbón activado granular en el ducto de retorno", "Las lámparas germicidas ultravioleta UV-C instaladas en el serpentín", "Los generadores de iones negativos colocados en los registros de aire", "Los precipitadores electrostáticos de placas en la entrada del ducto"],
    correct: 1,
    explanation: "Las lámparas UV-C con longitud de onda de 254 nm destruyen el ADN de virus y bacterias, siendo muy efectivas cuando se instalan cerca del serpentín del evaporador."
  ,
    question_en: "What air purification technology is most effective for eliminating viruses and bacteria in the airflow?",
    options_en: ["Granular activated carbon filters in the return duct", "Germicidal UV-C ultraviolet lamps installed at the coil", "Negative ion generators placed at the air registers", "Electrostatic precipitators with plates at the duct entrance"],
    explanation_en: "UV-C lamps with a wavelength of 254 nm destroy the DNA of viruses and bacteria, being very effective when installed near the evaporator coil."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Qué efecto negativo tiene un edificio con excesiva hermeticidad sin ventilación mecánica controlada?",
    options: ["La temperatura interior fluctúa constantemente sin control posible", "Se acumulan contaminantes interiores y la calidad del aire se degrada", "Las paredes exteriores desarrollan grietas por diferencial de presión", "El sistema de aire acondicionado consume más energía de lo estimado"],
    correct: 1,
    explanation: "Un edificio demasiado hermético sin ventilación mecánica atrapa contaminantes como CO2, VOCs, y humedad, degradando significativamente la calidad del aire interior."
  ,
    question_en: "What negative effect does an excessively airtight building have without controlled mechanical ventilation?",
    options_en: ["Indoor temperature fluctuates constantly without possible control", "Indoor contaminants accumulate and air quality degrades", "Exterior walls develop cracks from pressure differential", "The air conditioning system consumes more energy than estimated"],
    explanation_en: "An overly airtight building without mechanical ventilation traps contaminants like CO2, VOCs, and humidity, significantly degrading indoor air quality."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Qué es el síndrome del edificio enfermo y cuál es su causa principal relacionada con HVAC?",
    options: ["Una falla estructural causada por vibraciones del sistema de climatización", "Síntomas de salud en ocupantes por mala ventilación y contaminantes interiores", "Un defecto de diseño donde el edificio no conserva la temperatura deseada", "Una condición donde el sistema HVAC consume energía excesiva sin control"],
    correct: 1,
    explanation: "El síndrome del edificio enfermo se refiere a síntomas como dolor de cabeza, fatiga e irritación en ocupantes, causados por ventilación inadecuada y acumulación de contaminantes."
  ,
    question_en: "What is sick building syndrome and what is its main cause related to HVAC?",
    options_en: ["A structural failure caused by climate system vibrations", "Health symptoms in occupants from poor ventilation and indoor contaminants", "A design defect where the building does not maintain desired temperature", "A condition where the HVAC system consumes excessive uncontrolled energy"],
    explanation_en: "Sick building syndrome refers to symptoms like headache, fatigue, and irritation in occupants, caused by inadequate ventilation and accumulation of contaminants."
  },
  {
    category: "Quality Air Control / IAQ",
    q: "¿Cuál es el propósito de un ERV (Energy Recovery Ventilator) en un sistema de calidad de aire interior?",
    options: ["Enfriar el aire de retorno antes de que llegue al evaporador del sistema", "Intercambiar calor y humedad entre el aire entrante y saliente del edificio", "Filtrar partículas ultrafinas del aire exterior antes de introducirlo adentro", "Recircular el aire interior para mantener presión positiva constante aquí"],
    correct: 1,
    explanation: "Un ERV transfiere tanto calor como humedad entre el aire de escape y el aire fresco entrante, reduciendo la carga energética de acondicionar el aire de ventilación."
  ,
    question_en: "What is the purpose of an ERV (Energy Recovery Ventilator) in an indoor air quality system?",
    options_en: ["To cool the return air before it reaches the system evaporator", "To exchange heat and humidity between incoming and outgoing building air", "To filter ultrafine particles from outdoor air before introducing it inside", "To recirculate indoor air to maintain constant positive pressure here"],
    explanation_en: "An ERV transfers both heat and humidity between exhaust air and fresh incoming air, reducing the energy load of conditioning ventilation air."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Qué indica la clasificación MERV en un filtro de aire para sistemas de climatización?",
    options: ["La velocidad máxima del aire que puede pasar a través del filtro", "La eficiencia del filtro para capturar partículas de diferentes tamaños", "La resistencia del material del filtro a temperaturas altas de operación", "La vida útil estimada del filtro en meses de operación continua total"],
    correct: 1,
    explanation: "MERV (Minimum Efficiency Reporting Value) clasifica la eficiencia del filtro para capturar partículas de 0.3 a 10 micrones, donde mayor MERV significa mayor capacidad de filtrado."
  ,
    question_en: "What does the MERV rating on an HVAC system air filter indicate?",
    options_en: ["The maximum air speed that can pass through the filter", "The filter's efficiency for capturing particles of different sizes", "The filter material's resistance to high operating temperatures", "The filter's estimated lifespan in months of continuous operation"],
    explanation_en: "MERV (Minimum Efficiency Reporting Value) rates filter efficiency for capturing 0.3 to 10 micron particles, where higher MERV means greater filtration capability."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Cuál es el rango MERV recomendado para una residencia con sistema central y personas con alergias?",
    options: ["MERV 1 a 4 que captura polvo grande y fibras textiles", "MERV 8 a 13 que captura polen, moho y partículas finas", "MERV 14 a 16 que es de grado hospitalario de alto flujo", "MERV 17 a 20 que es filtro HEPA de sala limpia industrial"],
    correct: 1,
    explanation: "Para residencias con alergias, MERV 8 a 13 ofrece excelente filtración de polen, esporas de moho y partículas finas sin restricción excesiva del flujo de aire."
  ,
    question_en: "What is the recommended MERV range for a residence with a central system and allergy sufferers?",
    options_en: ["MERV 1 to 4 which captures large dust and textile fibers", "MERV 8 to 13 which captures pollen, mold, and fine particles", "MERV 14 to 16 which is hospital-grade high-flow", "MERV 17 to 20 which is HEPA industrial clean room filter"],
    explanation_en: "For residences with allergies, MERV 8 to 13 provides excellent filtration of pollen, mold spores, and fine particles without excessive airflow restriction."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Qué problema causa instalar un filtro MERV demasiado alto en un sistema residencial no diseñado para ello?",
    options: ["El filtro se ensucia menos frecuentemente y dura más tiempo de uso", "La caída de presión excesiva reduce el flujo de aire y daña el sistema", "La calidad del aire mejora sin ningún efecto negativo en el rendimiento", "El ventilador del sistema aumenta su velocidad para compensar la carga"],
    correct: 1,
    explanation: "Un filtro MERV alto crea una caída de presión excesiva que reduce el flujo de aire, puede congelar el evaporador y sobrecargar el motor del ventilador del sistema."
  ,
    question_en: "What problem does installing a MERV filter that is too high in a residential system not designed for it cause?",
    options_en: ["The filter gets dirty less frequently and lasts longer", "Excessive pressure drop reduces airflow and damages the system", "Air quality improves with no negative effect on performance", "The system fan increases speed to compensate for the load"],
    explanation_en: "A high MERV filter creates excessive pressure drop that reduces airflow, can freeze the evaporator, and overload the system fan motor."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Qué es la infiltración de aire en un edificio y cómo afecta la carga de climatización?",
    options: ["Es el aire filtrado que circula dentro del sistema de ductos instalados", "Es el aire exterior no controlado que entra por grietas aumentando la carga", "Es el flujo de aire que el ventilador empuja a través del serpentín frío", "Es la recirculación del aire interior a través del filtro del ducto retorno"],
    correct: 1,
    explanation: "La infiltración es aire exterior que entra sin control por grietas, puertas y ventanas, aumentando la carga térmica y de humedad que el sistema debe manejar."
  ,
    question_en: "What is air infiltration in a building and how does it affect the conditioning load?",
    options_en: ["It is the filtered air circulating inside the installed duct system", "It is uncontrolled outdoor air entering through cracks, increasing the load", "It is the airflow the fan pushes through the cold coil", "It is the recirculation of indoor air through the return duct filter"],
    explanation_en: "Infiltration is outdoor air entering uncontrolled through cracks, doors, and windows, increasing the thermal and humidity load the system must handle."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Qué diferencia hay entre exfiltración e infiltración en el contexto de un edificio climatizado?",
    options: ["Ambas se refieren al mismo fenómeno de entrada de aire al espacio", "La infiltración es aire entrando y la exfiltración es aire saliendo del edificio", "La exfiltración ocurre solo en verano y la infiltración solo ocurre en invierno", "La infiltración es controlada por el HVAC y la exfiltración es por ventanas abiertas"],
    correct: 1,
    explanation: "La infiltración es aire exterior no controlado entrando al edificio, mientras la exfiltración es aire interior escapando hacia el exterior a través de la envolvente."
  ,
    question_en: "What is the difference between exfiltration and infiltration in the context of a conditioned building?",
    options_en: ["Both refer to the same phenomenon of air entering the space", "Infiltration is air entering and exfiltration is air leaving the building", "Exfiltration occurs only in summer and infiltration only in winter", "Infiltration is controlled by HVAC and exfiltration is through open windows"],
    explanation_en: "Infiltration is uncontrolled outdoor air entering the building, while exfiltration is indoor air escaping to the outside through the building envelope."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Qué prueba se realiza para medir la tasa de infiltración de aire de un edificio residencial?",
    options: ["La prueba de presión estática con manómetro en los ductos del sistema", "La prueba de puerta sopladora o blower door test a 50 Pascales diferencial", "La prueba de velocidad del aire con anemómetro en todas las ventanas", "La prueba de temperatura diferencial con termómetro infrarrojo en paredes"],
    correct: 1,
    explanation: "El blower door test presuriza o despresuriza el edificio a 50 Pascales y mide el flujo de aire necesario, determinando la tasa de infiltración en ACH50."
  ,
    question_en: "What test is performed to measure the air infiltration rate of a residential building?",
    options_en: ["The duct static pressure test with a manometer", "The blower door test at 50 Pascals pressure differential", "The air velocity test with an anemometer at all windows", "The differential temperature test with an infrared thermometer on walls"],
    explanation_en: "The blower door test pressurizes or depressurizes the building to 50 Pascals and measures the airflow needed, determining the infiltration rate in ACH50."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Qué efecto tiene la presión positiva en un edificio sobre la infiltración y exfiltración de aire?",
    options: ["Aumenta la infiltración de aire exterior por todas las aberturas del edificio", "Reduce la infiltración y empuja el aire interior hacia afuera por las grietas", "No tiene ningún efecto medible sobre el movimiento de aire en el edificio", "Equilibra perfectamente la infiltración y exfiltración en todas las zonas"],
    correct: 1,
    explanation: "La presión positiva interior empuja aire hacia afuera (exfiltración), reduciendo la entrada de aire exterior no acondicionado (infiltración) y contaminantes."
  ,
    question_en: "What effect does positive pressure in a building have on air infiltration and exfiltration?",
    options_en: ["It increases infiltration of outdoor air through all building openings", "It reduces infiltration and pushes indoor air outward through cracks", "It has no measurable effect on air movement in the building", "It perfectly balances infiltration and exfiltration in all zones"],
    explanation_en: "Positive indoor pressure pushes air outward (exfiltration), reducing the entry of unconditioned outdoor air (infiltration) and contaminants."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Por qué los filtros plisados son más eficientes que los filtros planos de fibra de vidrio del mismo tamaño?",
    options: ["Porque utilizan materiales sintéticos que repelen las partículas de polvo", "Porque tienen mayor área de superficie de filtración en el mismo marco dado", "Porque generan una carga electrostática que atrae las partículas al material", "Porque permiten mayor velocidad del aire a través de sus pliegues internos"],
    correct: 1,
    explanation: "Los pliegues del filtro plisado aumentan significativamente el área de superficie disponible para capturar partículas, mejorando la eficiencia sin aumentar la restricción proporcionalmente."
  ,
    question_en: "Why are pleated filters more efficient than flat fiberglass filters of the same size?",
    options_en: ["Because flat fiberglass filters have greater structural rigidity", "Because pleats create more surface area without increasing resistance significantly", "Because the fiberglass material captures finer particles overall", "Because pleated filters cost less per unit than flat fiberglass filters"],
    explanation_en: "Pleats create significantly more filter surface area within the same frame size, capturing more particles while maintaining acceptable airflow."
  },
  {
    category: "Filtración y Exfiltración",
    q: "¿Cuál es la velocidad de cara recomendada del aire a través de un filtro en un sistema residencial HVAC?",
    options: ["Entre 50 y 100 pies por minuto como velocidad máxima ideal", "Entre 300 y 500 pies por minuto como velocidad máxima ideal", "Entre 800 y 1,000 pies por minuto como velocidad máxima ideal", "Entre 1,500 y 2,000 pies por minuto como velocidad máxima ideal"],
    correct: 1,
    explanation: "La velocidad de cara recomendada es 300-500 FPM para filtros residenciales. Velocidades mayores causan caída de presión excesiva y menor eficiencia de filtración."
  ,
    question_en: "Why are pleated filters more efficient than flat fiberglass filters of the same size?",
    options_en: ["Because flat fiberglass filters have greater structural rigidity", "Because pleats create more surface area, capturing more particles without significantly increasing resistance", "Because the fiberglass material captures finer particles overall", "Because pleated filters cost less per unit than flat fiberglass filters"],
    explanation_en: "Pleats create significantly more filter surface area within the same frame size, capturing more particles while maintaining acceptable airflow resistance."
  },
  {
    category: "System Design",
    q: "¿Qué método de cálculo de carga térmica es el estándar de la industria HVAC para edificios residenciales?",
    options: ["El método de grados-día de calefacción y enfriamiento combinados anuales", "El Manual J de ACCA para cálculo de carga térmica residencial exacta", "El método de vatios por metro cuadrado según el tipo de construcción usado", "El cálculo simplificado de BTU por pie cuadrado de superficie del espacio"],
    correct: 1,
    explanation: "El Manual J de ACCA (Air Conditioning Contractors of America) es el estándar reconocido para calcular cargas térmicas residenciales considerando todos los factores relevantes."
  ,
    question_en: "What duct design method maintains equal pressure drop per every 100 feet of duct?",
    options_en: ["The constant velocity method in all system sections", "The equal friction or equal friction loss method in each section", "The static regain method at each branch duct junction", "The proportional reduced area method based on flow in each branch"],
    explanation_en: "The equal friction method designs all duct sections with the same pressure drop per 100 feet, simplifying design and ensuring uniform distribution."
  },
  {
    category: "System Design",
    q: "¿Qué consecuencia tiene sobredimensionar un sistema de aire acondicionado para un espacio residencial?",
    options: ["El sistema enfría más rápido y mantiene mejor el confort térmico", "Se producen ciclos cortos que no deshumidifican y desperdician energía", "La factura eléctrica se reduce porque el sistema trabaja menos tiempo", "El compresor dura más años porque opera con menos esfuerzo continuo"],
    correct: 1,
    explanation: "Un sistema sobredimensionado produce ciclos cortos que enfrían rápido sin deshumidificar, causando incomodidad, mayor desgaste y consumo energético elevado."
  ,
    question_en: "Why do flexible ducts generate more pressure loss than rigid sheet metal ducts?",
    options_en: ["Because flexible ducts always have a smaller diameter than rigid ones", "Because the corrugated interior surface creates greater friction with the air fluid", "Because the plastic material of the flexible duct absorbs cold air energy", "Because flexible ducts cannot be properly thermally insulated"],
    explanation_en: "The corrugated interior surface of flexible duct creates significantly more turbulence and friction than the smooth surface of sheet metal duct, increasing pressure loss."
  },
  {
    category: "System Design",
    q: "¿Qué factor tiene el mayor impacto en la carga térmica de enfriamiento de una residencia típica?",
    options: ["La cantidad de ocupantes que habitan el espacio regularmente dentro", "La ganancia solar a través de ventanas y la orientación de la estructura", "El tipo de iluminación artificial instalada dentro del espacio evaluado", "La cantidad de electrodomésticos que operan simultáneamente en la cocina"],
    correct: 1,
    explanation: "La ganancia solar a través de ventanas es típicamente el factor más grande de carga térmica residencial, especialmente en ventanas orientadas al oeste y sur."
  ,
    question_en: "What is the most common material for fabricating ducts in residential central air systems?",
    options_en: ["Rigid fiberglass with smooth aluminum interior coating", "26 to 30 gauge galvanized sheet metal formed and sealed with mastic", "High-density polyethylene with integrated closed-cell foam insulation", "22 gauge anodized aluminum with riveted and welded fixed joints"],
    explanation_en: "26-30 gauge galvanized sheet metal is the standard material for residential ducts due to its durability, ease of fabrication, fire resistance, and low cost."
  },
  {
    category: "System Design",
    q: "¿Qué es el SEER y cómo se utiliza para comparar la eficiencia de sistemas de aire acondicionado?",
    options: ["Es la relación de eficiencia en un punto fijo de operación del equipo", "Es la relación de eficiencia estacional que promedia todo el año de operación", "Es la capacidad máxima de enfriamiento medida en BTU por hora del equipo", "Es el factor de potencia eléctrica del compresor medido en el arranque"],
    correct: 1,
    explanation: "SEER (Seasonal Energy Efficiency Ratio) es el promedio de eficiencia durante toda la temporada de enfriamiento, dividiendo BTU de enfriamiento entre watts-hora consumidos."
  ,
    question_en: "What is the function of a balancing damper installed in a branch duct of the distribution system?",
    options_en: ["To filter dust particles before they reach the register", "To adjust and balance airflow to each zone individually", "To hermetically seal the duct when the system is not operating", "To reduce air velocity to minimize noise at the register"],
    explanation_en: "Balancing dampers allow manual adjustment of airflow in each branch to balance distribution and ensure each zone receives the designed CFM."
  },
  {
    category: "System Design",
    q: "¿Qué es la carga latente en el diseño de un sistema HVAC y por qué es importante considerarla?",
    options: ["Es la carga térmica que se siente directamente como cambio de temperatura", "Es la carga asociada a la humedad que el sistema debe remover del espacio", "Es la pérdida de energía por conducción a través de paredes y ventanas", "Es el calor generado por el funcionamiento del propio equipo de climatización"],
    correct: 1,
    explanation: "La carga latente es la energía necesaria para condensar y remover la humedad del aire. Ignorarla resulta en un espacio frío pero húmedo e incómodo para los ocupantes."
  ,
    question_en: "Why is it important to seal all duct joints with mastic or approved HVAC tape?",
    options_en: ["To improve the aesthetic appearance of the installed duct system", "To prevent air leaks that waste energy and unbalance the system", "To comply with fire protection codes only", "To reduce mechanical vibration transmitted by the equipment fan"],
    explanation_en: "Duct leaks can waste up to 30% of conditioned air, increasing energy costs and causing imbalance in air distribution."
  },
  {
    category: "Ducting",
    q: "¿Cuál es la velocidad máxima recomendada del aire en ductos principales de un sistema residencial?",
    options: ["Entre 200 y 400 pies por minuto en el ducto principal troncal", "Entre 600 y 900 pies por minuto en el ducto principal troncal", "Entre 1,200 y 1,500 pies por minuto en ducto principal troncal", "Entre 1,800 y 2,200 pies por minuto en ducto principal troncal"],
    correct: 1,
    explanation: "La velocidad recomendada en ductos troncales residenciales es 600-900 FPM para minimizar el ruido y las pérdidas por fricción manteniendo un tamaño razonable."
  ,
    question_en: "What factor must be considered when installing ducts in an unconditioned attic to minimize losses?",
    options_en: ["Use the smallest possible diameter ducts to reduce internal volume", "Insulate ducts with a minimum of R-8 and seal all connections against leaks", "Paint the ducts white to reflect solar radiation from the roof", "Install uninsulated ducts but with very high extra air velocity"],
    explanation_en: "Ducts in attics must have minimum R-8 insulation (R-6 in some codes) and be completely sealed to minimize thermal losses in that extreme space."
  },
  {
    category: "Ducting",
    q: "¿Qué método de diseño de ductos mantiene igual caída de presión por cada 100 pies de ducto?",
    options: ["El método de velocidad constante en todos los tramos del sistema", "El método de fricción igual o igual pérdida por fricción en cada tramo", "El método de recuperación estática en cada unión de los ductos ramales", "El método de área reducida proporcional al flujo en cada derivación"],
    correct: 1,
    explanation: "El método de fricción igual diseña todos los tramos de ducto con la misma caída de presión por cada 100 pies, simplificando el diseño y asegurando distribución uniforme."
  ,
    question_en: "In a commercial building with controlled positive pressure, what direct consequence does excessive exfiltration have on the air conditioning system?",
    options_en: ["It reduces the cooling load because it expels hot air from the interior", "It increases the cooling load because the equipment compensates for the conditioned air that is lost", "It improves indoor air quality because it constantly renews the building air", "It decreases relative humidity because the escaping air carries accumulated moisture"],
    explanation_en: "Excessive exfiltration means already conditioned air escapes to the outside, forcing the equipment to work harder to compensate for that constant loss of treated air, directly increasing the cooling load."
  },
  {
    category: "Ducting",
    q: "¿Por qué los ductos flexibles generan más pérdida de presión que los ductos rígidos de chapa metálica?",
    options: ["Porque los ductos flexibles tienen menor diámetro que los rígidos siempre", "Porque la superficie corrugada interior crea mayor fricción con el aire fluido", "Porque el material plástico del ducto flexible absorbe energía del aire frío", "Porque los ductos flexibles no se pueden aislar térmicamente correctamente"],
    correct: 1,
    explanation: "La superficie interior corrugada del ducto flexible crea turbulencia y fricción significativamente mayor que la superficie lisa del ducto de chapa, aumentando la pérdida de presión."
  ,
    question_en: "When designing a duct system, why is the equal friction method NOT ideal for systems with long branches and multiple outlets?",
    options_en: ["Because it generates excessive velocities in all main system sections", "Because it does not guarantee uniform static pressure at the most distant terminals", "Because it requires ducts of the same diameter in all branches without exception", "Because it eliminates the need to use balancing dampers at each branch outlet"],
    explanation_en: "The equal friction method maintains the same pressure drop per unit length but does not compensate for static pressure differences between short and long branches, causing imbalance at distant terminals."
  },
  {
    category: "Ducting",
    q: "¿Cuál es el material más común para fabricar ductos en sistemas residenciales de aire central?",
    options: ["Fibra de vidrio rígida con recubrimiento interior de aluminio liso", "Chapa galvanizada calibre 26 a 30 formada y sellada con masilla", "Polietileno de alta densidad con aislamiento integrado de espuma celda", "Aluminio anodizado calibre 22 con juntas remachadas y soldadas fijas"],
    correct: 1,
    explanation: "La chapa galvanizada calibre 26-30 es el material estándar para ductos residenciales por su durabilidad, facilidad de fabricación, resistencia al fuego y bajo costo."
  ,
    question_en: "What is the main technical reason a rectangular elbow without turning vanes generates more pressure loss than one with vanes?",
    options_en: ["The air compresses against the outer wall creating a localized high static pressure zone", "A flow separation zone forms on the inner wall generating turbulence and recirculation", "Air velocity drops drastically when changing direction causing internal condensation", "The rectangular duct material vibrates with greater intensity generating audible friction losses"],
    explanation_en: "In an elbow without vanes, the airflow separates from the inner wall, creating a low-pressure zone with turbulence and recirculation. Turning vanes guide the flow and prevent that separation, significantly reducing losses."
  },
  {
    category: "Ducting",
    q: "¿Cuál es la función de un damper de balanceo instalado en un ducto ramal del sistema de distribución?",
    options: ["Filtrar las partículas de polvo antes de que lleguen al registro", "Ajustar y equilibrar el flujo de aire hacia cada zona individualmente", "Sellar herméticamente el ducto cuando el sistema no está en operación", "Reducir la velocidad del aire para minimizar el ruido en el registro"],
    correct: 1,
    explanation: "Los dampers de balanceo permiten ajustar manualmente el flujo de aire en cada ramal para equilibrar la distribución y asegurar que cada zona reciba el CFM diseñado."
  ,
    question_en: "In a multi-zone mini split system, if an individual indoor unit is shut off by its thermostat while the others keep operating, what problem can occur in the compressor?",
    options_en: ["The compressor reduces speed proportionally and operates with greater energy efficiency", "The compressor may receive liquid refrigerant return causing damage from liquid slug", "The compressor increases internal temperature and shuts off by the system high pressure sensor", "The compressor momentarily reverses its cycle to redistribute refrigerant between units"],
    explanation_en: "When an indoor unit shuts off but the compressor keeps sending refrigerant to the system, that inactive unit can accumulate liquid that returns to the compressor without evaporating, causing slugging (liquid slug) that can damage internal valves and compressor components."
  },
  {
    category: "Ducting",
    q: "¿Por qué es importante sellar todas las juntas de los ductos con masilla o cinta aprobada para HVAC?",
    options: ["Para mejorar la apariencia estética del sistema de ductos instalado", "Para evitar fugas de aire que desperdician energía y desbalancean el sistema", "Para cumplir con las normas de protección contra incendios solamente", "Para reducir la vibración mecánica transmitida por el ventilador del equipo"],
    correct: 1,
    explanation: "Las fugas en ductos pueden desperdiciar hasta 30% del aire acondicionado, aumentando costos energéticos y causando desbalance en la distribución del aire."
  ,
    question_en: "Why is maintaining indoor relative humidity between 40% and 60% critical for air quality, according to ASHRAE guidelines?",
    options_en: ["Because outside that range HEPA filters lose their ability to capture fine particles", "Because that range simultaneously minimizes the growth of mold, bacteria, mites, and viruses", "Because CO2 sensors only provide accurate readings within that humidity range", "Because occupants cannot perceive contaminant odors when humidity falls outside that range"],
    explanation_en: "The 40%-60% relative humidity range is where most pathogen survival is minimized: below 40% viruses survive longer and mucous membranes dry out; above 60% mold, mites, and bacteria proliferate. This concept is illustrated in the famous Sterling diagram."
  },
  {
    category: "Ducting",
    q: "¿Qué factor se debe considerar al instalar ductos en un ático no acondicionado para minimizar pérdidas?",
    options: ["Usar ductos del menor diámetro posible para reducir el volumen interno", "Aislar los ductos con mínimo R-8 y sellar todas las conexiones contra fugas", "Pintar los ductos de color blanco para reflejar la radiación solar del techo", "Instalar los ductos sin aislamiento pero con velocidad de aire muy alta extra"],
    correct: 1,
    explanation: "Los ductos en áticos deben tener aislamiento mínimo R-8 (R-6 en algunos códigos) y estar completamente sellados para minimizar pérdidas térmicas en ese espacio extremo."
  ,
    question_en: "What factor must be considered when installing ducts in an unconditioned attic to minimize losses?",
    options_en: ["Use the smallest possible diameter ducts to reduce internal volume", "Insulate ducts with a minimum of R-8 and seal all connections against leaks", "Paint the ducts white to reflect solar radiation from the roof", "Install uninsulated ducts but with very high extra air velocity"],
    explanation_en: "Ducts in attics must have minimum R-8 insulation (R-6 in some codes) and be completely sealed to minimize thermal losses in that extreme space."
  },
{
    category: "Filtración y Exfiltración",
    q: "En un edificio comercial con presión positiva controlada, ¿qué consecuencia directa tiene la exfiltración excesiva en el sistema de aire acondicionado?",
    options: ["Reduce la carga de enfriamiento porque expulsa aire caliente del interior", "Aumenta la carga de enfriamiento porque el equipo compensa el aire acondicionado que se pierde", "Mejora la calidad del aire interior porque renueva constantemente el aire del edificio", "Disminuye la humedad relativa porque el aire que sale arrastra la humedad acumulada"],
    correct: 1,
    explanation: "La exfiltración excesiva significa que el aire ya acondicionado se escapa hacia el exterior, obligando al equipo a trabajar más para compensar esa pérdida constante de aire tratado, lo cual aumenta directamente la carga de enfriamiento."
  ,
    question_en: "In a commercial building with controlled positive pressure, what direct consequence does excessive exfiltration have on the air conditioning system?",
    options_en: ["It reduces the cooling load because it expels hot air from the interior", "It increases the cooling load because the equipment compensates for the conditioned air that is lost", "It improves indoor air quality because it constantly renews the building air", "It decreases relative humidity because the escaping air carries accumulated moisture"],
    explanation_en: "Excessive exfiltration means already conditioned air escapes to the outside, forcing the equipment to work harder to compensate for that constant loss of treated air, directly increasing the cooling load."
  },
  {
    category: "Diseño de Sistemas",
    q: "Al diseñar un sistema de conductos, ¿por qué el método de fricción igual NO es ideal para sistemas con ramificaciones largas y múltiples salidas?",
    options: ["Porque genera velocidades excesivas en todos los tramos principales del sistema completo", "Porque no garantiza presión estática uniforme en las terminales más alejadas del equipo", "Porque requiere conductos del mismo diámetro en todas las ramificaciones sin excepción", "Porque elimina la necesidad de usar dámpers de balanceo en las salidas de cada ramal"],
    correct: 1,
    explanation: "El método de fricción igual mantiene la misma caída de presión por unidad de longitud, pero no compensa las diferencias de presión estática entre ramales cortos y largos, lo que causa desbalanceo en terminales alejadas del equipo."
  ,
    question_en: "When designing a duct system, why is the equal friction method NOT ideal for systems with long branches and multiple outlets?",
    options_en: ["Because it generates excessive velocities in all main system sections", "Because it does not guarantee uniform static pressure at the most distant terminals", "Because it requires ducts of the same diameter in all branches without exception", "Because it eliminates the need to use balancing dampers at each branch outlet"],
    explanation_en: "The equal friction method maintains the same pressure drop per unit length but does not compensate for static pressure differences between short and long branches, causing imbalance at distant terminals."
  },
  {
    category: "Ductería",
    q: "¿Cuál es la razón técnica principal por la que un codo rectangular sin álabes directores genera mayor pérdida de presión que uno con álabes?",
    options: ["El aire se comprime contra la pared exterior creando una zona de alta presión estática localizada", "Se forma una zona de separación de flujo en la pared interior que genera turbulencia y recirculación", "La velocidad del aire disminuye drásticamente al cambiar de dirección provocando condensación interna", "El material del conducto rectangular vibra con mayor intensidad generando pérdidas por fricción audible"],
    correct: 1,
    explanation: "En un codo sin álabes, el flujo de aire se separa de la pared interior del codo, creando una zona de baja presión con turbulencia y recirculación. Los álabes directores guían el flujo y evitan esa separación, reduciendo significativamente las pérdidas."
  ,
    question_en: "What is the main technical reason a rectangular elbow without turning vanes generates more pressure loss than one with vanes?",
    options_en: ["The air compresses against the outer wall creating a localized high static pressure zone", "A flow separation zone forms on the inner wall generating turbulence and recirculation", "Air velocity drops drastically when changing direction causing internal condensation", "The rectangular duct material vibrates with greater intensity generating audible friction losses"],
    explanation_en: "In an elbow without vanes, the airflow separates from the inner wall, creating a low-pressure zone with turbulence and recirculation. Turning vanes guide the flow and prevent that separation, significantly reducing losses."
  },
  {
    category: "Mini Splits",
    q: "En un sistema mini split multi-zona, si una evaporadora individual se cierra por termostato mientras las demás siguen operando, ¿qué problema puede ocurrir en el compresor?",
    options: ["El compresor reduce su velocidad proporcionalmente y opera con mayor eficiencia energética", "El compresor puede recibir refrigerante líquido de retorno causando daño por golpe de líquido", "El compresor aumenta su temperatura interna y se apaga por el sensor de alta presión del sistema", "El compresor invierte momentáneamente su ciclo para redistribuir el refrigerante entre las unidades"],
    correct: 1,
    explanation: "Cuando una evaporadora se cierra pero el compresor sigue enviando refrigerante al sistema, esa evaporadora inactiva puede acumular líquido que retorna al compresor sin evaporarse, causando slugging (golpe de líquido) que puede dañar las válvulas y componentes internos del compresor."
  ,
    question_en: "In a multi-zone mini split system, if an individual indoor unit is shut off by its thermostat while the others keep operating, what problem can occur in the compressor?",
    options_en: ["The compressor reduces speed proportionally and operates with greater energy efficiency", "The compressor may receive liquid refrigerant return causing damage from liquid slug", "The compressor increases internal temperature and shuts off by the system high pressure sensor", "The compressor momentarily reverses its cycle to redistribute refrigerant between units"],
    explanation_en: "When an indoor unit shuts off but the compressor keeps sending refrigerant, that inactive unit can accumulate liquid that returns unevaporated, causing slugging that can damage internal valves and compressor components."
  },
  {
    category: "IAQ (Indoor Air Quality)",
    q: "¿Por qué mantener la humedad relativa interior entre 40% y 60% es crítico para la calidad del aire, según las guías de ASHRAE?",
    options: ["Porque fuera de ese rango los filtros HEPA pierden su capacidad de retención de partículas finas", "Porque ese rango minimiza simultáneamente el crecimiento de hongos, bacterias, ácaros y virus", "Porque los sensores de CO2 solo proporcionan lecturas precisas dentro de ese rango de humedad", "Porque los ocupantes no pueden percibir olores contaminantes cuando la humedad sale de ese rango"],
    correct: 1,
    explanation: "El rango de 40%-60% de humedad relativa es donde se minimiza la supervivencia de la mayoría de patógenos: por debajo de 40% los virus sobreviven más y las mucosas se resecan; por encima de 60% proliferan hongos, ácaros y bacterias. Este concepto se ilustra en el famoso diagrama de Sterling."
  ,
    question_en: "Why is maintaining indoor relative humidity between 40% and 60% critical for air quality, according to ASHRAE guidelines?",
    options_en: ["Because outside that range HEPA filters lose their ability to capture fine particles", "Because that range simultaneously minimizes the growth of mold, bacteria, mites, and viruses", "Because CO2 sensors only provide accurate readings within that humidity range", "Because occupants cannot perceive contaminant odors when humidity falls outside that range"],
    explanation_en: "The 40%-60% relative humidity range minimizes most pathogen survival: below 40% viruses survive longer and mucous membranes dry out; above 60% mold, mites, and bacteria proliferate. This is illustrated in the Sterling diagram."
  }
],

// ─── NIVEL 4: Refrigeración, Aceites, Vacío, Recovery, Circuito (200 preguntas) ───
nivel4: [
  // ── Principios de Refrigeración y A/C (~40 preguntas) ──
  {
    category: "Refrigeración",
    q: "¿Cuál es el principio fundamental que hace funcionar un sistema de aire acondicionado?",
    options: ["El aire frío se genera espontáneamente por electricidad", "El calor se transfiere de un área fría a una más caliente", "El refrigerante crea frío al comprimirse a alta presión", "Las moléculas de aire se enfrían al pasar por un filtro"],
    correct: 1,
    explanation: "Un AC no crea frío — mueve calor del interior al exterior usando el ciclo de refrigeración."
  ,
    question_en: "What is the fundamental principle that makes an air conditioning system work?",
    options_en: ["Cold air is generated spontaneously by electricity", "Heat is transferred from a cold area to a warmer one", "Refrigerant creates cold when compressed to high pressure", "Air molecules cool down when passing through a filter"],
    explanation_en: "An AC does not create cold — it moves heat from inside to outside using the refrigeration cycle."
  },
  {
    category: "Refrigeración",
    q: "¿En qué estado se encuentra el refrigerante cuando entra al evaporador después de la TXV?",
    options: ["100% gas a alta presión y alta temperatura caliente", "100% líquido a alta presión y alta temperatura caliente", "Mezcla de líquido y gas a baja presión y baja temperatura", "100% líquido a baja presión y temperatura ambiente normal"],
    correct: 2,
    explanation: "Después de la TXV, el refrigerante es una mezcla líquido/gas a baja presión y temperatura (flash gas)."
  ,
    question_en: "In what state is the refrigerant when it enters the evaporator after the TXV?",
    options_en: ["100% gas at high pressure and high hot temperature", "100% liquid at high pressure and high hot temperature", "A mixture of liquid and gas at low pressure and low temperature", "100% liquid at low pressure and normal ambient temperature"],
    explanation_en: "After the TXV, the refrigerant is a liquid/gas mixture at low pressure and temperature (flash gas)."
  },
  {
    category: "Refrigeración",
    q: "¿Qué sucede con el refrigerante dentro del evaporador mientras absorbe calor del aire?",
    options: ["Se condensa de gas a líquido liberando calor afuera", "Se evapora de líquido a gas absorbiendo calor interior", "Se comprime aumentando su presión y temperatura mucho", "Se expande sin cambiar de estado ni de temperatura nada"],
    correct: 1,
    explanation: "En el evaporador, el refrigerante líquido absorbe calor del aire y se evapora (cambia a gas)."
  ,
    question_en: "What happens to the refrigerant inside the evaporator while it absorbs heat from the air?",
    options_en: ["It condenses from gas to liquid releasing heat outside", "It evaporates from liquid to gas absorbing indoor heat", "It compresses increasing its pressure and temperature greatly", "It expands without changing state or temperature at all"],
    explanation_en: "In the evaporator, liquid refrigerant absorbs heat from the air and evaporates (changes to gas)."
  },
  {
    category: "Refrigeración",
    q: "¿Cuál es la presión típica del lado de succión en un sistema R-410A operando normalmente?",
    options: ["050 a 070 psi en el lado de succión baja presión", "100 a 150 psi en el lado de succión baja presión", "118 a 145 psi en el lado de succión baja presión", "200 a 250 psi en el lado de succión baja presión"],
    correct: 2,
    explanation: "R-410A opera con presiones de succión de ~118-145 psi a condiciones normales de 75°F interior."
  ,
    question_en: "What is the typical suction-side pressure in an R-410A system operating normally?",
    options_en: ["050 to 070 psi on the low-pressure suction side", "100 to 150 psi on the low-pressure suction side", "118 to 145 psi on the low-pressure suction side", "200 to 250 psi on the low-pressure suction side"],
    explanation_en: "R-410A operates with suction pressures of ~118-145 psi under normal conditions at 75 degrees F indoor."
  },
  {
    category: "Refrigeración",
    q: "¿Cuál es la presión típica del lado de descarga en un sistema R-410A en condiciones normales?",
    options: ["150 a 200 psi en el lado de alta presión descarga", "250 a 300 psi en el lado de alta presión descarga", "350 a 425 psi en el lado de alta presión descarga", "500 a 600 psi en el lado de alta presión descarga"],
    correct: 2,
    explanation: "R-410A tiene presiones de descarga de ~350-425 psi a 95°F exterior en condiciones normales."
  ,
    question_en: "What is the typical discharge-side pressure in an R-410A system under normal conditions?",
    options_en: ["150 to 200 psi on the high-pressure discharge side", "250 to 300 psi on the high-pressure discharge side", "350 to 425 psi on the high-pressure discharge side", "500 to 600 psi on the high-pressure discharge side"],
    explanation_en: "R-410A has discharge pressures of ~350-425 psi at 95 degrees F outdoor under normal conditions."
  },
  {
    category: "Refrigeración",
    q: "¿Qué es el subenfriamiento (subcooling) y dónde se mide en el sistema?",
    options: ["La temp del gas sobre su punto de ebullición en succión", "La temp del líquido bajo su punto de condensación en descarga", "La diferencia de presión entre el lado alto y el lado bajo", "La temperatura del aire de retorno menos la del suministro"],
    correct: 1,
    explanation: "Subcooling = temp. condensación - temp. línea de líquido. Se mide en la salida del condensador."
  ,
    question_en: "What is subcooling and where is it measured in the system?",
    options_en: ["The gas temp above its boiling point at suction", "The liquid temp below its condensation point at discharge", "The pressure difference between the high and low side", "The return air temperature minus the supply temperature"],
    explanation_en: "Subcooling = condensing temp - liquid line temp. It is measured at the condenser outlet."
  },
  {
    category: "Refrigeración",
    q: "¿Cuál es el rango normal de subenfriamiento en un sistema con TXV operando correctamente?",
    options: ["02 a 05 grados Fahrenheit de subenfriamiento normal", "08 a 14 grados Fahrenheit de subenfriamiento normal", "18 a 25 grados Fahrenheit de subenfriamiento normal", "30 a 40 grados Fahrenheit de subenfriamiento normal"],
    correct: 1,
    explanation: "Con TXV, el subcooling normal es 8-14°F. Fuera de rango indica problema de carga o restricción."
  ,
    question_en: "What is the normal subcooling range in a system with a TXV operating correctly?",
    options_en: ["02 to 05 degrees Fahrenheit of normal subcooling", "08 to 14 degrees Fahrenheit of normal subcooling", "18 to 25 degrees Fahrenheit of normal subcooling", "30 to 40 degrees Fahrenheit of normal subcooling"],
    explanation_en: "With a TXV, normal subcooling is 8-14 degrees F. Outside range indicates charge or restriction problems."
  },
  {
    category: "Refrigeración",
    q: "Si el subenfriamiento es muy alto (25°F+), ¿qué indica probablemente?",
    options: ["El sistema tiene poca carga de refrigerante bajo nivel", "El sistema tiene exceso de carga o restricción en el flujo", "El condensador está sucio y no rechaza calor al exterior", "El evaporador está congelado y bloqueando flujo de aire"],
    correct: 1,
    explanation: "Subcooling alto = demasiado líquido en el condensador, usualmente por sobrecarga o restricción."
  ,
    question_en: "If subcooling is very high (25 degrees F+), what does it probably indicate?",
    options_en: ["The system has a low refrigerant charge level", "The system has excess charge or a flow restriction", "The condenser is dirty and not rejecting heat outside", "The evaporator is frozen and blocking airflow"],
    explanation_en: "High subcooling = too much liquid in the condenser, usually from overcharge or restriction."
  },
  {
    category: "Refrigeración",
    q: "¿Qué relación hay entre la presión y la temperatura de saturación de un refrigerante?",
    options: ["Mayor presión resulta en menor temperatura de saturación", "Mayor presión resulta en mayor temperatura de saturación", "La presión no tiene relación con la temperatura del todo", "Menor presión resulta en mayor temperatura de saturación"],
    correct: 1,
    explanation: "Relación directa: a mayor presión, mayor temperatura de saturación (ebullición/condensación)."
  ,
    question_en: "What relationship exists between pressure and the saturation temperature of a refrigerant?",
    options_en: ["Higher pressure results in lower saturation temperature", "Higher pressure results in higher saturation temperature", "Pressure has no relation to temperature at all", "Lower pressure results in higher saturation temperature"],
    explanation_en: "Direct relationship: higher pressure = higher saturation temperature (boiling/condensation)."
  },
  {
    category: "Refrigeración",
    q: "¿A qué temperatura hierve el R-410A a presión atmosférica (0 psig)?",
    options: ["-25.7 grados Fahrenheit a presión atmosférica", "-48.5 grados Fahrenheit a presión atmosférica", "-60.0 grados Fahrenheit a presión atmosférica", "-15.3 grados Fahrenheit a presión atmosférica"],
    correct: 1,
    explanation: "El R-410A hierve a -48.5°F a presión atmosférica, lo que permite absorber calor a bajas temperaturas."
  ,
    question_en: "At what temperature does R-410A boil at atmospheric pressure (0 psig)?",
    options_en: ["-25.7 degrees Fahrenheit at atmospheric pressure", "-48.5 degrees Fahrenheit at atmospheric pressure", "-60.0 degrees Fahrenheit at atmospheric pressure", "-15.3 degrees Fahrenheit at atmospheric pressure"],
    explanation_en: "R-410A boils at -48.5 degrees F at atmospheric pressure, which allows it to absorb heat at low temperatures."
  },
  {
    category: "Refrigeración",
    q: "¿Cuáles son los cuatro componentes principales del ciclo básico de refrigeración?",
    options: ["Filtro, bomba, radiador y ventilador del sistema AC", "Compresor, condensador, dispositivo de expansión y evaporador", "Motor, generador, transformador y capacitor del circuito", "Termostato, contactor, relay y fusible del control AC"],
    correct: 1,
    explanation: "Los 4 componentes fundamentales: compresor, condensador, dispositivo de expansión (TXV/capilar), evaporador."
  ,
    question_en: "What are the four main components of the basic refrigeration cycle?",
    options_en: ["Filter, pump, radiator, and AC system fan", "Compressor, condenser, expansion device, and evaporator", "Motor, generator, transformer, and circuit capacitor", "Thermostat, contactor, relay, and AC control fuse"],
    explanation_en: "The 4 fundamental components: compressor, condenser, expansion device (TXV/capillary), evaporator."
  },
  {
    category: "Refrigeración",
    q: "¿Cuál es la función del condensador en el ciclo de refrigeración?",
    options: ["Absorber calor del aire interior de la habitación", "Rechazar calor del refrigerante al aire exterior", "Comprimir el gas refrigerante a alta presión caliente", "Reducir la presión del refrigerante antes del evaporador"],
    correct: 1,
    explanation: "El condensador rechaza el calor absorbido del interior + calor de compresión al aire exterior."
  ,
    question_en: "What is the function of the condenser in the refrigeration cycle?",
    options_en: ["To absorb heat from the indoor room air", "To reject heat from the refrigerant to the outdoor air", "To compress the refrigerant gas to high hot pressure", "To reduce refrigerant pressure before the evaporator"],
    explanation_en: "The condenser rejects heat absorbed from indoors + heat of compression to the outdoor air."
  },
  {
    category: "Refrigeración",
    q: "¿Qué tipo de compresor es el más común en sistemas residenciales de AC modernos?",
    options: ["Compresor reciprocante de pistón simple efecto", "Compresor scroll de espirales fijo y orbital tipo", "Compresor rotativo de paletas deslizantes giratorio", "Compresor centrífugo de impeller de alta velocidad"],
    correct: 1,
    explanation: "Los compresores scroll dominan el mercado residencial por su eficiencia, silencio y confiabilidad."
  ,
    question_en: "What type of compressor is the most common in modern residential AC systems?",
    options_en: ["Single-acting reciprocating piston compressor", "Scroll compressor with fixed and orbiting spiral type", "Sliding vane rotary compressor", "High-speed impeller centrifugal compressor"],
    explanation_en: "Scroll compressors dominate the residential market for their efficiency, quiet operation, and reliability."
  },
  {
    category: "Refrigeración",
    q: "¿Qué sucede si el condensador está sucio y obstruido con suciedad y hojas secas?",
    options: ["La presión de succión sube y el sistema enfría mejor más", "La presión de descarga sube y la eficiencia baja mucho", "El compresor consume menos amperaje y trabaja más fácil", "La temperatura del evaporador sube y no hay condensación"],
    correct: 1,
    explanation: "Condensador sucio = pobre rechazo de calor = presión de descarga alta = eficiencia baja = posible daño."
  ,
    question_en: "What happens if the condenser is dirty and obstructed with dirt and dry leaves?",
    options_en: ["Suction pressure rises and the system cools better more", "Discharge pressure rises and efficiency drops significantly", "The compressor draws less amperage and works easier", "Evaporator temperature rises and there is no condensation"],
    explanation_en: "Dirty condenser = poor heat rejection = high discharge pressure = low efficiency = possible damage."
  },
  {
    category: "Refrigeración",
    q: "¿Qué es el COP (Coefficient of Performance) de un sistema de refrigeración?",
    options: ["La presión máxima que el sistema puede alcanzar seguro", "La relación entre energía de enfriamiento y energía consumida", "La temperatura mínima que el evaporador puede alcanzar", "El número de horas que el compresor puede operar continuo"],
    correct: 1,
    explanation: "COP = energía de enfriamiento producida / energía eléctrica consumida. Mayor COP = más eficiente."
  ,
    question_en: "What is the COP (Coefficient of Performance) of a refrigeration system?",
    options_en: ["The maximum pressure the system can safely reach", "The ratio between cooling energy and energy consumed", "The minimum temperature the evaporator can reach", "The number of hours the compressor can run continuously"],
    explanation_en: "COP = cooling energy produced / electrical energy consumed. Higher COP = more efficient."
  },
  {
    category: "Refrigeración",
    q: "¿Cuántas BTU por hora equivalen a una tonelada de refrigeración?",
    options: ["06,000 BTU por hora equivale a una tonelada", "12,000 BTU por hora equivale a una tonelada", "18,000 BTU por hora equivale a una tonelada", "24,000 BTU por hora equivale a una tonelada"],
    correct: 1,
    explanation: "1 tonelada de refrigeración = 12,000 BTU/h, basado en la energía para derretir 1 ton de hielo en 24 hrs."
  ,
    question_en: "How many BTU per hour equal one ton of refrigeration?",
    options_en: ["06,000 BTU per hour equals one ton", "12,000 BTU per hour equals one ton", "18,000 BTU per hour equals one ton", "24,000 BTU per hour equals one ton"],
    explanation_en: "1 ton of refrigeration = 12,000 BTU/h, based on the energy to melt 1 ton of ice in 24 hours."
  },
  {
    category: "Refrigeración",
    q: "Un sistema split de 3 toneladas tiene una capacidad de enfriamiento de:",
    options: ["18,000 BTU por hora de capacidad de enfriamiento", "24,000 BTU por hora de capacidad de enfriamiento", "30,000 BTU por hora de capacidad de enfriamiento", "36,000 BTU por hora de capacidad de enfriamiento"],
    correct: 3,
    explanation: "3 toneladas × 12,000 BTU/ton = 36,000 BTU/h de capacidad de enfriamiento."
  ,
    question_en: "A 3-ton split system has a cooling capacity of:",
    options_en: ["18,000 BTU per hour cooling capacity", "24,000 BTU per hour cooling capacity", "30,000 BTU per hour cooling capacity", "36,000 BTU per hour cooling capacity"],
    explanation_en: "3 tons x 12,000 BTU/ton = 36,000 BTU/h cooling capacity."
  },
  {
    category: "Refrigeración",
    q: "¿Qué indica una línea de succión escarchada desde el evaporador hasta el compresor?",
    options: ["El sistema está operando perfectamente con buena carga", "El evaporador está sobrealimentado o el flujo de aire es bajo", "El sistema tiene muy poca carga de refrigerante en total", "La TXV está restringida y no deja pasar suficiente flujo"],
    correct: 1,
    explanation: "Línea de succión escarchada = demasiado refrigerante líquido llegando al compresor (floodback)."
  ,
    question_en: "What does a frosted suction line from the evaporator to the compressor indicate?",
    options_en: ["The system is operating perfectly with good charge", "The evaporator is overfed or the airflow is low", "The system has very low total refrigerant charge", "The TXV is restricted and not allowing enough flow"],
    explanation_en: "A frosted suction line = too much liquid refrigerant reaching the compressor (floodback)."
  },
  {
    category: "Refrigeración",
    q: "¿Cuál es la diferencia entre calor sensible y calor latente en un sistema de AC?",
    options: ["No hay diferencia, son el mismo tipo de calor exacto", "Sensible cambia temperatura, latente cambia estado de materia", "Sensible cambia estado de materia, latente cambia temperatura", "Sensible es calor del exterior, latente es calor del interior"],
    correct: 1,
    explanation: "Calor sensible = cambio de temperatura medible. Calor latente = cambio de estado (líquido↔gas) sin cambio de temp."
  ,
    question_en: "What is the difference between sensible heat and latent heat in an AC system?",
    options_en: ["There is no difference; they are the exact same type of heat", "Sensible changes temperature, latent changes state of matter", "Sensible changes state of matter, latent changes temperature", "Sensible is heat from outside, latent is heat from inside"],
    explanation_en: "Sensible heat = measurable temperature change. Latent heat = state change (liquid to gas) without temperature change."
  },
  {
    category: "Refrigeración",
    q: "El SEER (Seasonal Energy Efficiency Ratio) mínimo requerido para AC residencial nuevo en 2023+ es:",
    options: ["10 SEER como mínimo de eficiencia requerida nueva", "13 SEER como mínimo de eficiencia requerida nueva", "14 SEER como mínimo de eficiencia requerida nueva", "15 SEER como mínimo de eficiencia requerida nueva"],
    correct: 2,
    explanation: "Desde 2023, el mínimo federal para AC residencial es 14 SEER (15 en regiones del sur de USA)."
  ,
    question_en: "The minimum SEER (Seasonal Energy Efficiency Ratio) required for new residential AC in 2023+ is:",
    options_en: ["10 SEER as minimum required new efficiency", "13 SEER as minimum required new efficiency", "14 SEER as minimum required new efficiency", "15 SEER as minimum required new efficiency"],
    explanation_en: "Since 2023, the federal minimum for residential AC is 14 SEER (15 in southern US regions)."
  },
  // ── Aceites y Refrigerantes (~40 preguntas) ──
  {
    category: "Aceites y Refrigerantes",
    q: "¿Qué tipo de aceite lubricante se usa en compresores que operan con R-410A?",
    options: ["Aceite mineral estándar para refrigeración vieja", "Aceite POE (Poliol Éster) sintético para R-410A", "Aceite PAG (Polialquilenglicol) para automotriz AC", "Aceite AB (Alquilbenceno) para sistemas de amoniaco"],
    correct: 1,
    explanation: "R-410A requiere aceite POE porque es miscible con refrigerantes HFC y absorbe humedad."
  ,
    question_en: "What type of lubricating oil is used in compressors that operate with R-410A?",
    options_en: ["Standard mineral oil for old refrigeration", "POE (Polyol Ester) synthetic oil for R-410A", "PAG (Polyalkylene Glycol) oil for automotive AC", "AB (Alkylbenzene) oil for ammonia systems"],
    explanation_en: "R-410A requires POE oil because it is miscible with HFC refrigerants and absorbs moisture."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Por qué es crítico mantener el aceite POE protegido de la humedad del aire?",
    options: ["La humedad hace que el aceite se espese demasiado", "La humedad reacciona con POE formando ácidos corrosivos", "La humedad congela el aceite dentro del compresor frío", "La humedad evapora el aceite reduciendo su nivel total"],
    correct: 1,
    explanation: "El aceite POE es higroscópico — absorbe humedad rápidamente, formando ácidos que dañan el compresor."
  ,
    question_en: "Why is it critical to keep POE oil protected from air moisture?",
    options_en: ["Moisture makes the oil thicken too much", "Moisture reacts with POE forming corrosive acids", "Moisture freezes the oil inside the cold compressor", "Moisture evaporates the oil reducing its total level"],
    explanation_en: "POE oil is hygroscopic — it absorbs moisture rapidly, forming acids that damage the compressor."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Cuánto tiempo máximo puede estar abierto un recipiente de aceite POE antes de contaminarse?",
    options: ["24 horas de exposición al aire sin problema alguno", "08 horas de exposición al aire sin problema alguno", "15 minutos de exposición al aire como tiempo máximo", "72 horas de exposición al aire sin problema alguno"],
    correct: 2,
    explanation: "El POE absorbe humedad en minutos. Mantener tapado siempre y minimizar exposición al aire."
  ,
    question_en: "How long can a container of POE oil be open before it becomes contaminated?",
    options_en: ["24 hours of air exposure with no problem", "08 hours of air exposure with no problem", "15 minutes of air exposure as maximum time", "72 hours of air exposure with no problem"],
    explanation_en: "POE absorbs moisture within minutes. Always keep it capped and minimize air exposure."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Qué refrigerante reemplazó al R-22 en sistemas residenciales nuevos por regulación ambiental?",
    options: ["R-134a como reemplazo directo del R-22 viejo", "R-410A como reemplazo estándar del R-22 viejo", "R-404A como reemplazo directo del R-22 viejo", "R-502 como reemplazo directo del R-22 viejo"],
    correct: 1,
    explanation: "El R-410A reemplazó al R-22 en AC residencial desde 2010. No es un drop-in, requiere equipo nuevo."
  ,
    question_en: "What refrigerant replaced R-22 in new residential systems per environmental regulation?",
    options_en: ["R-134a as a direct replacement for old R-22", "R-410A as the standard replacement for old R-22", "R-404A as a direct replacement for old R-22", "R-502 as a direct replacement for old R-22"],
    explanation_en: "R-410A replaced R-22 in residential AC since 2010. It is not a drop-in; it requires new equipment."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Cuál es la razón principal por la que se eliminó gradualmente el R-22 del mercado?",
    options: ["El R-22 era demasiado caro de producir en fábricas", "El R-22 destruye la capa de ozono con su contenido cloro", "El R-22 no enfriaba lo suficiente para climas calientes", "El R-22 causaba demasiado ruido en los compresores AC"],
    correct: 1,
    explanation: "El R-22 es un HCFC que contiene cloro, el cual destruye la capa de ozono estratosférico."
  ,
    question_en: "What is the main reason R-22 was gradually phased out of the market?",
    options_en: ["R-22 was too expensive to produce in factories", "R-22 destroys the ozone layer with its chlorine content", "R-22 did not cool enough for hot climates", "R-22 caused too much noise in AC compressors"],
    explanation_en: "R-22 is an HCFC containing chlorine, which destroys the stratospheric ozone layer."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Qué color de cilindro identifica al refrigerante R-410A según la convención de la industria?",
    options: ["Cilindro de color verde claro identifica al R-410A", "Cilindro de color rosa rosado identifica al R-410A", "Cilindro de color azul oscuro identifica al R-410A", "Cilindro de color amarillo claro identifica al R-410A"],
    correct: 1,
    explanation: "R-410A tradicionalmente usa cilindro rosa/rosado, aunque ARI ahora permite cilindros grises uniformes."
  ,
    question_en: "What cylinder color identifies R-410A refrigerant per industry convention?",
    options_en: ["Light green cylinder identifies R-410A", "Pink/rose-colored cylinder identifies R-410A", "Dark blue cylinder identifies R-410A", "Light yellow cylinder identifies R-410A"],
    explanation_en: "R-410A traditionally uses a pink/rose cylinder, although ARI now allows uniform gray cylinders."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Qué significa que el R-410A es un refrigerante 'zeotropico near-azeotropic'?",
    options: ["Se comporta como un compuesto puro sin fraccionamiento", "Es una mezcla que puede fraccionarse ligeramente al fugar", "No se puede mezclar con ningún otro tipo de refrigerante", "Tiene un solo punto de ebullición fijo a cada presión dada"],
    correct: 1,
    explanation: "R-410A es near-azeotropic (mezcla de R-32 y R-125) con mínimo glide, pero puede fraccionarse en fugas grandes."
  ,
    question_en: "What does it mean that R-410A is a 'near-azeotropic zeotropic' refrigerant?",
    options_en: ["It behaves like a pure compound without fractionation", "It is a mixture that can fractionate slightly when leaking", "It cannot be mixed with any other type of refrigerant", "It has a single fixed boiling point at each given pressure"],
    explanation_en: "R-410A is near-azeotropic (a mixture of R-32 and R-125) with minimal glide, but can fractionate in large leaks."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Por qué NUNCA se debe mezclar R-22 con R-410A en un mismo sistema?",
    options: ["Porque los dos refrigerantes tienen el mismo color de cilindro", "Porque operan a presiones muy diferentes y aceites incompatibles", "Porque ambos tienen el mismo punto de ebullición y no hay efecto", "Porque la mezcla produce un gas más eficiente innecesariamente"],
    correct: 1,
    explanation: "R-410A opera a presiones 60% mayores que R-22 y requiere aceite POE vs mineral. Son totalmente incompatibles."
  ,
    question_en: "Why should R-22 and R-410A NEVER be mixed in the same system?",
    options_en: ["Because both refrigerants have the same cylinder color", "Because they operate at very different pressures and incompatible oils", "Because both have the same boiling point and there is no effect", "Because the mixture produces a more efficient gas unnecessarily"],
    explanation_en: "R-410A operates at pressures 60% higher than R-22 and requires POE vs mineral oil. They are totally incompatible."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Cómo se debe cargar R-410A al sistema: como líquido o como gas?",
    options: ["Siempre como gas por el lado de succión del sistema", "Siempre como líquido por el lado de alta presión caliente", "Como gas en lado de alta y líquido en lado de baja presión", "No importa el estado, se puede cargar de cualquier manera"],
    correct: 1,
    explanation: "R-410A se carga como líquido porque al cargarlo como gas puede fraccionarse la mezcla."
  ,
    question_en: "How should R-410A be charged into the system: as liquid or as gas?",
    options_en: ["Always as gas through the system suction side", "Always as liquid through the high-pressure hot side", "As gas on the high side and liquid on the low-pressure side", "It does not matter; it can be charged either way"],
    explanation_en: "R-410A is charged as liquid because charging as gas can cause the mixture to fractionate."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Qué indica un test de acidez positivo en el aceite de un compresor?",
    options: ["El aceite está en perfecto estado y no necesita cambio", "Hay contaminación por humedad y descomposición del aceite", "El aceite tiene demasiada viscosidad y necesita dilución", "La temperatura del aceite es demasiado baja para operar"],
    correct: 1,
    explanation: "Acidez en el aceite indica descomposición por humedad, sobrecalentamiento o quema del motor. Requiere flush."
  ,
    question_en: "What does a positive acid test in a compressor's oil indicate?",
    options_en: ["The oil is in perfect condition and does not need changing", "There is contamination from moisture and oil decomposition", "The oil has too much viscosity and needs dilution", "The oil temperature is too low for operation"],
    explanation_en: "Acidity in the oil indicates decomposition from moisture, overheating, or motor burnout. Requires a flush."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Cuál es el GWP (Global Warming Potential) aproximado del R-410A?",
    options: ["0675 de potencial de calentamiento global comparado con CO2", "1430 de potencial de calentamiento global comparado con CO2", "2088 de potencial de calentamiento global comparado con CO2", "3922 de potencial de calentamiento global comparado con CO2"],
    correct: 2,
    explanation: "R-410A tiene un GWP de 2088, razón por la que se está migrando a refrigerantes de bajo GWP como R-32 y R-454B."
  ,
    question_en: "What is the approximate GWP (Global Warming Potential) of R-410A?",
    options_en: ["675 global warming potential compared to CO2", "1430 global warming potential compared to CO2", "2088 global warming potential compared to CO2", "3922 global warming potential compared to CO2"],
    explanation_en: "R-410A has a GWP of 2088, which is why migration to low-GWP refrigerants like R-32 and R-454B is underway."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Qué refrigerante de bajo GWP está reemplazando al R-410A en sistemas nuevos a partir de 2025?",
    options: ["R-22 está regresando como refrigerante de bajo impacto", "R-454B (Opteon XL41) es el reemplazo principal nuevo", "R-404A está siendo adoptado como alternativa al R-410A", "R-502 es el nuevo estándar de bajo GWP para residencial"],
    correct: 1,
    explanation: "R-454B tiene GWP de 466, mucho menor que R-410A (2088). Es el principal reemplazo para AC residencial."
  ,
    question_en: "What low-GWP refrigerant is replacing R-410A in new systems starting 2025?",
    options_en: ["R-22 is returning as a low-impact refrigerant", "R-454B (Opteon XL41) is the main new replacement", "R-404A is being adopted as an alternative to R-410A", "R-502 is the new low-GWP standard for residential"],
    explanation_en: "R-454B has a GWP of 466, much lower than R-410A (2088). It is the primary replacement for residential AC."
  },
  {
    category: "Aceites y Refrigerantes",
    q: "¿Cuál es la clasificación de seguridad del R-454B según ASHRAE?",
    options: ["A1: no inflamable y baja toxicidad como el R-410A", "A2L: ligeramente inflamable y baja toxicidad nueva", "B1: no inflamable pero alta toxicidad peligrosa mala", "B2L: ligeramente inflamable y alta toxicidad riesgosa"],
    correct: 1,
    explanation: "R-454B es A2L (mildly flammable, low toxicity). Requiere precauciones adicionales vs R-410A que es A1."
  ,
    question_en: "What is the safety classification of R-454B per ASHRAE?",
    options_en: ["A1: non-flammable and low toxicity like R-410A", "A2L: mildly flammable and low toxicity new", "B1: non-flammable but high dangerous toxicity", "B2L: mildly flammable and high risky toxicity"],
    explanation_en: "R-454B is A2L (mildly flammable, low toxicity). It requires additional precautions vs R-410A which is A1."
  },
  // ── Bombas de Vacío (~40 preguntas) ──
  {
    category: "Vacío",
    q: "¿Hasta qué nivel de vacío se debe evacuar un sistema de R-410A antes de cargar refrigerante?",
    options: ["1,000 micrones de vacío como nivel mínimo aceptable", "0,500 micrones de vacío como nivel mínimo aceptable", "5,000 micrones de vacío como nivel mínimo aceptable", "2,000 micrones de vacío como nivel mínimo aceptable"],
    correct: 1,
    explanation: "500 micrones es el estándar de la industria para R-410A. Garantiza remoción de humedad y no condensables."
  ,
    question_en: "To what vacuum level must an R-410A system be evacuated before charging refrigerant?",
    options_en: ["1,000 microns of vacuum as minimum acceptable level", "500 microns of vacuum as minimum acceptable level", "5,000 microns of vacuum as minimum acceptable level", "2,000 microns of vacuum as minimum acceptable level"],
    explanation_en: "500 microns is the industry standard for R-410A. It ensures removal of moisture and non-condensables."
  },
  {
    category: "Vacío",
    q: "¿Cuántos CFM (pies cúbicos por minuto) debe tener una bomba de vacío para un sistema residencial de 3 toneladas?",
    options: ["1 a 2 CFM de capacidad de bomba es insuficiente", "4 a 6 CFM de capacidad de bomba es el mínimo ideal", "10 a 12 CFM de capacidad de bomba es necesario mínimo", "15 a 20 CFM de capacidad de bomba es el requerido"],
    correct: 1,
    explanation: "Una bomba de 4-6 CFM es adecuada para sistemas residenciales de hasta 5 toneladas."
  ,
    question_en: "How many CFM (cubic feet per minute) should a vacuum pump have for a 3-ton residential system?",
    options_en: ["1 to 2 CFM pump capacity is insufficient", "4 to 6 CFM pump capacity is the ideal minimum", "10 to 12 CFM pump capacity is the minimum needed", "15 to 20 CFM pump capacity is required"],
    explanation_en: "A 4-6 CFM pump is adequate for residential systems up to 5 tons."
  },
  {
    category: "Vacío",
    q: "¿Qué sucede con el agua (humedad) dentro del sistema cuando se aplica vacío profundo?",
    options: ["El agua se congela y queda atrapada como hielo sólido", "El agua hierve a temperatura ambiente y se evapora al vacío", "El agua se comprime y sale por las válvulas de servicio", "El agua se convierte en ácido y corroe las tuberías cobre"],
    correct: 1,
    explanation: "Bajo vacío, el punto de ebullición del agua baja. A 500 micrones, el agua hierve a ~33°F y se evapora."
  ,
    question_en: "What happens to water (moisture) inside the system when deep vacuum is applied?",
    options_en: ["The water freezes and gets trapped as solid ice", "The water boils at ambient temperature and evaporates into the vacuum", "The water compresses and exits through the service valves", "The water turns to acid and corrodes the copper piping"],
    explanation_en: "Under vacuum, water's boiling point drops. At 500 microns, water boils at ~33 degrees F and evaporates."
  },
  {
    category: "Vacío",
    q: "¿Cada cuántas horas de uso se debe cambiar el aceite de la bomba de vacío?",
    options: ["Cada 100 horas de uso continuo de la bomba vacío", "Antes de cada evacuación para máxima eficiencia", "Una vez al año sin importar las horas de uso total", "Solo cuando el aceite se pone completamente negro viejo"],
    correct: 1,
    explanation: "Cambiar aceite antes de cada evacuación garantiza que la bomba alcance el vacío más profundo posible."
  ,
    question_en: "How often should vacuum pump oil be changed?",
    options_en: ["Every 100 hours of continuous pump use", "Before each evacuation for maximum efficiency", "Once per year regardless of total hours of use", "Only when the oil turns completely old and black"],
    explanation_en: "Changing oil before each evacuation ensures the pump achieves the deepest possible vacuum."
  },
  {
    category: "Vacío",
    q: "¿Por qué el aceite de la bomba de vacío se pone blanco lechoso después de evacuar un sistema húmedo?",
    options: ["Porque el aceite se congeló por las bajas temperaturas", "Porque absorbió la humedad que extrajo del sistema HVAC", "Porque el refrigerante contaminó el aceite de la bomba", "Porque el aceite es muy viejo y necesita reemplazo nuevo"],
    correct: 1,
    explanation: "El aceite lechoso indica que absorbió humedad. Se debe cambiar antes de la siguiente evacuación."
  ,
    question_en: "Why does vacuum pump oil turn milky white after evacuating a wet system?",
    options_en: ["Because the oil froze from the low temperatures", "Because it absorbed the moisture extracted from the HVAC system", "Because the refrigerant contaminated the pump oil", "Because the oil is very old and needs new replacement"],
    explanation_en: "Milky oil indicates moisture absorption. It must be changed before the next evacuation."
  },
  {
    category: "Vacío",
    q: "¿Qué instrumento mide con precisión el nivel de vacío en micrones durante la evacuación?",
    options: ["Manómetro compuesto del manifold de servicio azul", "Micron gauge digital conectado al sistema directamente", "Termómetro digital midiendo la temperatura de succión", "Detector electrónico de fugas de refrigerante sensible"],
    correct: 1,
    explanation: "El micron gauge digital es el único instrumento preciso para medir vacío en el rango de micrones."
  ,
    question_en: "What instrument precisely measures the vacuum level in microns during evacuation?",
    options_en: ["The compound gauge on the blue service manifold", "A digital micron gauge connected directly to the system", "A digital thermometer measuring suction temperature", "A sensitive electronic refrigerant leak detector"],
    explanation_en: "The digital micron gauge is the only precise instrument for measuring vacuum in the micron range."
  },
  {
    category: "Vacío",
    q: "Si el vacío sube de 500 a 2,000 micrones después de cerrar la válvula de la bomba, ¿qué indica?",
    options: ["El sistema está perfectamente sellado sin problemas todo", "Hay una fuga o humedad residual dentro del sistema AC", "La bomba de vacío necesita más aceite para funcionar mejor", "El micron gauge está descalibrado y necesita reemplazo ya"],
    correct: 1,
    explanation: "Un rise test que sube >200 micrones indica fuga (sube rápido) o humedad (sube lento pero constante)."
  ,
    question_en: "If the vacuum rises from 500 to 2,000 microns after closing the pump valve, what does it indicate?",
    options_en: ["The system is perfectly sealed with no problems at all", "There is a leak or residual moisture inside the AC system", "The vacuum pump needs more oil to work better", "The micron gauge is out of calibration and needs replacement"],
    explanation_en: "A rise test that goes up >200 microns indicates a leak (rises fast) or moisture (rises slowly but steadily)."
  },
  {
    category: "Vacío",
    q: "¿Cuál es la diferencia entre un rise test rápido y uno lento al cerrar la bomba de vacío?",
    options: ["Rápido indica humedad, lento indica fuga en el sistema", "Rápido indica fuga, lento indica humedad residual dentro", "Ambos indican lo mismo sin diferencia significativa ninguna", "Rápido es normal y lento indica bomba defectuosa rota"],
    correct: 1,
    explanation: "Rise rápido = fuga (gas entra rápido). Rise lento y constante = humedad evaporándose dentro."
  ,
    question_en: "What is the difference between a fast rise test and a slow one when closing the vacuum pump?",
    options_en: ["Fast indicates moisture, slow indicates a system leak", "Fast indicates a leak, slow indicates residual moisture inside", "Both indicate the same thing with no significant difference", "Fast is normal and slow indicates a broken defective pump"],
    explanation_en: "Fast rise = leak (gas enters quickly). Slow and steady rise = moisture evaporating inside."
  },
  {
    category: "Vacío",
    q: "¿Por qué se deben usar mangueras de gran diámetro (3/8\" o 1/2\") para evacuar en vez de 1/4\"?",
    options: ["Las mangueras gruesas son más baratas que las delgadas", "Las mangueras gruesas permiten mayor flujo y vacío rápido", "Las mangueras delgadas no resisten la presión del nitrógeno", "Las mangueras gruesas son requeridas por código local NEC"],
    correct: 1,
    explanation: "Mangueras de mayor diámetro reducen la restricción y permiten alcanzar vacío profundo más rápido."
  ,
    question_en: "Why should large-diameter hoses (3/8 inch or 1/2 inch) be used for evacuation instead of 1/4 inch?",
    options_en: ["Thick hoses are cheaper than thin ones", "Thick hoses allow greater flow and faster vacuum", "Thin hoses cannot withstand nitrogen pressure", "Thick hoses are required by local NEC code"],
    explanation_en: "Larger diameter hoses reduce restriction and allow reaching deep vacuum faster."
  },
  {
    category: "Vacío",
    q: "¿Dónde se debe conectar el micron gauge para obtener la lectura más precisa del vacío?",
    options: ["En la manguera entre la bomba y el manifold servicio", "Directamente en la válvula de servicio del sistema HVAC", "En la salida de escape de la bomba de vacío directamente", "En cualquier punto del manifold da la misma lectura exacta"],
    correct: 1,
    explanation: "Conectar directo al sistema da la lectura real. En la manguera o bomba, la restricción da lecturas falsas."
  ,
    question_en: "Where should the micron gauge be connected for the most accurate vacuum reading?",
    options_en: ["On the hose between the pump and the service manifold", "Directly to the HVAC system service valve", "At the exhaust outlet of the vacuum pump directly", "At any point on the manifold gives the same exact reading"],
    explanation_en: "Connecting directly to the system gives the real reading. On the hose or pump, restriction gives false readings."
  },
  {
    category: "Vacío",
    q: "¿Qué nivel de vacío en micrones equivale aproximadamente a 29.92 pulgadas de mercurio?",
    options: ["10,000 micrones equivalen a 29.92 pulgadas de Hg", "05,000 micrones equivalen a 29.92 pulgadas de Hg", "01,000 micrones equivalen a 29.92 pulgadas de Hg", "00,001 micrones equivalen a 29.92 pulgadas de Hg"],
    correct: 3,
    explanation: "29.92 inHg = 0 micrones (vacío perfecto). En la práctica, 500 micrones es excelente para HVAC."
  ,
    question_en: "What vacuum level in microns approximately equals 29.92 inches of mercury?",
    options_en: ["10,000 microns equals 29.92 inches of Hg", "05,000 microns equals 29.92 inches of Hg", "01,000 microns equals 29.92 inches of Hg", "00,001 microns equals 29.92 inches of Hg"],
    explanation_en: "29.92 inHg = 0 microns (perfect vacuum). In practice, 500 microns is excellent for HVAC."
  },
  {
    category: "Vacío",
    q: "¿Qué tipo de aceite se usa en una bomba de vacío de dos etapas para HVAC?",
    options: ["Aceite de motor 10W-30 convencional automotriz", "Aceite especial para bomba de vacío de alta pureza", "Aceite POE el mismo que se usa en los compresores", "Aceite hidráulico ISO 32 para sistemas de presión"],
    correct: 1,
    explanation: "Las bombas de vacío requieren aceite específico de alta pureza y bajo vapor pressure para alcanzar vacío profundo."
  ,
    question_en: "What type of oil is used in a two-stage vacuum pump for HVAC?",
    options_en: ["Conventional 10W-30 automotive motor oil", "Special high-purity vacuum pump oil", "POE oil the same used in compressors", "ISO 32 hydraulic oil for pressure systems"],
    explanation_en: "Vacuum pumps require specific high-purity oil with low vapor pressure to achieve deep vacuum."
  },
  // ── Recovery, Recycling, Reclaiming (~40 preguntas) ──
  {
    category: "Recovery",
    q: "¿Cuál es la diferencia entre recovery, recycling y reclaiming de refrigerante?",
    options: ["Son tres nombres diferentes para el mismo proceso exacto", "Recovery extrae, recycling limpia básico, reclaim purifica 100%", "Recovery purifica, recycling extrae, reclaim almacena el gas", "Recovery es ilegal, recycling es legal, reclaim es opcional"],
    correct: 1,
    explanation: "Recovery = extraer del sistema. Recycling = limpiar básico en campo. Reclaim = purificar a especificaciones ARI 700."
  ,
    question_en: "What is the difference between recovery, recycling, and reclaiming of refrigerant?",
    options_en: ["They are three different names for the exact same process", "Recovery extracts, recycling cleans basic, reclaim purifies 100%", "Recovery purifies, recycling extracts, reclaim stores the gas", "Recovery is illegal, recycling is legal, reclaim is optional"],
    explanation_en: "Recovery = extract from system. Recycling = basic field cleaning. Reclaim = purify to ARI 700 specifications."
  },
  {
    category: "Recovery",
    q: "¿Qué certificación EPA es OBLIGATORIA para manejar refrigerantes en Estados Unidos?",
    options: ["Certificación OSHA 30 de seguridad en construcción", "Certificación EPA Section 608 para manejo refrigerantes", "Certificación NATE de técnico HVAC avanzado senior", "Certificación ASHRAE de diseño de sistemas térmicos"],
    correct: 1,
    explanation: "EPA Section 608 es obligatoria por ley federal para cualquier persona que maneje refrigerantes."
  ,
    question_en: "What EPA certification is MANDATORY for handling refrigerants in the United States?",
    options_en: ["OSHA 30 construction safety certification", "EPA Section 608 certification for refrigerant handling", "NATE senior advanced HVAC technician certification", "ASHRAE thermal system design certification"],
    explanation_en: "EPA Section 608 is mandatory by federal law for anyone who handles refrigerants."
  },
  {
    category: "Recovery",
    q: "¿Cuántos tipos de certificación EPA 608 existen y cuáles son?",
    options: ["2 tipos: residencial y comercial solamente certificación", "3 tipos: Tipo I, Tipo II y Tipo III más universal", "4 tipos: Tipo I, Tipo II, Tipo III y Universal total", "1 tipo: certificación universal única para todos los casos"],
    correct: 2,
    explanation: "4 tipos: I (pequeñas cargas), II (alta presión), III (baja presión), Universal (todos los anteriores)."
  ,
    question_en: "How many types of EPA 608 certification exist and what are they?",
    options_en: ["2 types: residential and commercial certification only", "3 types: Type I, Type II, and Type III plus universal", "4 types: Type I, Type II, Type III, and Universal total", "1 type: single universal certification for all cases"],
    explanation_en: "4 types: I (small charges), II (high pressure), III (low pressure), Universal (all of the above)."
  },
  {
    category: "Recovery",
    q: "¿A qué nivel de vacío se debe recuperar refrigerante de un sistema de alta presión con carga >200 lbs?",
    options: ["0 psig de presión mínima para sistemas de alta presión", "10 pulgadas Hg de vacío para sistemas con carga grande", "15 pulgadas Hg de vacío para sistemas con carga grande", "25 pulgadas Hg de vacío para sistemas con carga grande"],
    correct: 0,
    explanation: "Para sistemas de alta presión con >200 lbs, EPA requiere recovery hasta 0 psig."
  ,
    question_en: "To what vacuum level must refrigerant be recovered from a high-pressure system with >200 lbs charge?",
    options_en: ["0 psig minimum pressure for high-pressure systems", "10 inches Hg vacuum for systems with large charge", "15 inches Hg vacuum for systems with large charge", "25 inches Hg vacuum for systems with large charge"],
    explanation_en: "For high-pressure systems with >200 lbs, EPA requires recovery to 0 psig."
  },
  {
    category: "Recovery",
    q: "¿Qué debe hacer un técnico con un cilindro de recuperación que está lleno al 80% de su capacidad?",
    options: ["Continuar llenando hasta el 100% de su capacidad total", "Dejar de llenar porque 80% es el límite seguro máximo", "Calentar el cilindro para que quepa más refrigerante gas", "Transferir a un cilindro más grande sin límite de llenado"],
    correct: 1,
    explanation: "NUNCA llenar un cilindro de recuperación más del 80% para dejar espacio para expansión térmica."
  ,
    question_en: "What must a technician do with a recovery cylinder that is 80% full of its capacity?",
    options_en: ["Continue filling to 100% of its total capacity", "Stop filling because 80% is the maximum safe limit", "Heat the cylinder so more refrigerant gas will fit", "Transfer to a larger cylinder without a fill limit"],
    explanation_en: "NEVER fill a recovery cylinder beyond 80% to leave room for thermal expansion."
  },
  {
    category: "Recovery",
    q: "¿Qué sucede si se llena un cilindro de recuperación por encima del 80% de su capacidad?",
    options: ["Nada peligroso, el cilindro aguanta hasta 100% sin riesgo", "El cilindro puede explotar por presión hidrostática al calentarse", "El refrigerante se descompone químicamente dentro del cilindro", "El cilindro se enfría y la presión baja automáticamente sola"],
    correct: 1,
    explanation: "Líquido incompresible + aumento de temperatura = presión hidrostática extrema = explosión potencial."
  ,
    question_en: "What happens if a recovery cylinder is filled above 80% of its capacity?",
    options_en: ["Nothing dangerous, the cylinder can handle up to 100% without risk", "The cylinder can explode due to hydrostatic pressure when it heats up", "The refrigerant chemically decomposes inside the cylinder", "The cylinder cools down and the pressure drops automatically on its own"],
    explanation_en: "Incompressible liquid + temperature increase = extreme hydrostatic pressure = potential explosion."
  },
  {
    category: "Recovery",
    q: "¿De qué color es un cilindro de recuperación estándar aprobado por DOT?",
    options: ["Completamente azul con etiqueta amarilla identificación", "Gris con tapa amarilla como identificación estándar DOT", "Verde con franja blanca como identificación estándar DOT", "Rojo con tapa negra como identificación estándar legal DOT"],
    correct: 1,
    explanation: "Los cilindros de recuperación aprobados DOT son grises con tapa amarilla para fácil identificación."
  ,
    question_en: "What color is a standard DOT-approved recovery cylinder?",
    options_en: ["Completely blue with a yellow identification label", "Gray with a yellow top as standard DOT identification", "Green with a white stripe as standard DOT identification", "Red with a black top as standard legal DOT identification"],
    explanation_en: "DOT-approved recovery cylinders are gray with a yellow top for easy identification."
  },
  {
    category: "Recovery",
    q: "¿Qué método de recovery es más rápido: push-pull o vapor recovery?",
    options: ["Vapor recovery es más rápido para cargas grandes total", "Push-pull es más rápido para cargas grandes de líquido", "Ambos métodos tardan exactamente el mismo tiempo siempre", "Depende de la marca de la máquina de recovery utilizada"],
    correct: 1,
    explanation: "Push-pull usa presión de descarga para empujar líquido, mucho más rápido que extraer solo vapor."
  ,
    question_en: "Which recovery method is faster: push-pull or vapor recovery?",
    options_en: ["Vapor recovery is faster for large total charges", "Push-pull is faster for large liquid charges", "Both methods take exactly the same time always", "It depends on the brand of recovery machine used"],
    explanation_en: "Push-pull uses discharge pressure to push liquid, much faster than extracting vapor only."
  },
  {
    category: "Recovery",
    q: "¿Es legal ventear refrigerante intencionalmente a la atmósfera según la ley federal EPA?",
    options: ["Sí, es legal ventear cualquier refrigerante al aire libre", "No, es ilegal con multas de hasta $44,539 por día de violación", "Solo es legal ventear refrigerantes naturales como R-290 propano", "Es legal si la cantidad es menor a 1 libra de refrigerante"],
    correct: 1,
    explanation: "Es ilegal bajo Clean Air Act Section 608. Multas de hasta $44,539+ por día por venteo intencional."
  ,
    question_en: "Is it legal to intentionally vent refrigerant to the atmosphere under EPA federal law?",
    options_en: ["Yes, it is legal to vent any refrigerant outdoors", "No, it is illegal with fines up to $44,539 per day of violation", "It is only legal to vent natural refrigerants like R-290 propane", "It is legal if the amount is less than 1 pound of refrigerant"],
    explanation_en: "It is illegal under Clean Air Act Section 608. Fines up to $44,539+ per day for intentional venting."
  },
  {
    category: "Recovery",
    q: "¿Cuál es el único refrigerante que legalmente se puede ventear al aire sin recovery?",
    options: ["R-410A en cantidades menores a 2 libras solamente", "R-22 cuando el sistema es muy viejo y no vale la pena", "R-290 (propano) porque es un refrigerante natural orgánico", "Ninguno, todos los refrigerantes requieren recovery obligatorio"],
    correct: 3,
    explanation: "Desde noviembre 2018, EPA prohíbe ventear TODOS los refrigerantes sustitutos, incluyendo HFC."
  ,
    question_en: "What is the only refrigerant that can legally be vented to the air without recovery?",
    options_en: ["R-410A in quantities less than 2 pounds only", "R-22 when the system is very old and not worth the effort", "R-290 (propane) because it is a natural organic refrigerant", "None, all refrigerants require mandatory recovery"],
    explanation_en: "Since November 2018, EPA prohibits venting ALL substitute refrigerants, including HFCs."
  },
  {
    category: "Recovery",
    q: "¿Cada cuánto tiempo se debe certificar la máquina de recovery según EPA?",
    options: ["Cada 6 meses con técnico certificado por el fabricante", "La máquina debe estar certificada por ARI/AHRI al comprarse", "Cada 2 años con inspección por la oficina de EPA local", "No requiere certificación periódica después de la compra"],
    correct: 1,
    explanation: "Las máquinas deben cumplir estándares ARI 740 al fabricarse. No requieren recertificación periódica."
  ,
    question_en: "How often must a recovery machine be certified according to EPA?",
    options_en: ["Every 6 months with a manufacturer-certified technician", "The machine must be ARI/AHRI certified at the time of purchase", "Every 2 years with inspection by the local EPA office", "It does not require periodic certification after purchase"],
    explanation_en: "Machines must meet ARI 740 standards at manufacture. They do not require periodic recertification."
  },
  {
    category: "Recovery",
    q: "¿Qué se debe hacer con refrigerante recuperado que está contaminado y no se puede reutilizar?",
    options: ["Ventearlo al aire porque ya no sirve para nada más", "Enviarlo a un reclaimer certificado EPA para procesamiento", "Mezclarlo con refrigerante nuevo para diluir la contaminación", "Almacenarlo indefinidamente en el cilindro de recuperación"],
    correct: 1,
    explanation: "Refrigerante contaminado debe enviarse a un reclaimer certificado EPA para purificación o destrucción."
  ,
    question_en: "What should be done with recovered refrigerant that is contaminated and cannot be reused?",
    options_en: ["Vent it to the air since it is no longer useful for anything", "Send it to an EPA-certified reclaimer for processing", "Mix it with new refrigerant to dilute the contamination", "Store it indefinitely in the recovery cylinder"],
    explanation_en: "Contaminated refrigerant must be sent to an EPA-certified reclaimer for purification or destruction."
  },
  {
    category: "Recovery",
    q: "¿Cuánto tiempo tiene un técnico para reparar una fuga después de detectarla según EPA?",
    options: ["No hay límite de tiempo para reparar fugas detectadas", "30 días para reparar fugas en equipos comerciales detectadas", "90 días para reparar fugas en equipos comerciales detectadas", "365 días para reparar fugas en equipos comerciales detectadas"],
    correct: 1,
    explanation: "EPA requiere reparar fugas dentro de 30 días de la detección para equipos comerciales."
  ,
    question_en: "How much time does a technician have to repair a leak after detecting it according to EPA?",
    options_en: ["There is no time limit to repair detected leaks", "30 days to repair leaks in detected commercial equipment", "90 days to repair leaks in detected commercial equipment", "365 days to repair leaks in detected commercial equipment"],
    explanation_en: "EPA requires repairing leaks within 30 days of detection for commercial equipment."
  },
  // ── Los 4 Componentes del Circuito de Refrigerante (~40 preguntas) ──
  {
    category: "Circuito Refrigerante",
    q: "¿Cuál es la función específica del compresor en el circuito de refrigeración?",
    options: ["Enfriar el refrigerante bajando su presión y temperatura", "Elevar la presión y temperatura del gas refrigerante succión", "Filtrar impurezas del refrigerante antes del condensador", "Almacenar refrigerante líquido en un tanque de reserva"],
    correct: 1,
    explanation: "El compresor toma gas de baja presión/temperatura y lo comprime a alta presión/temperatura."
  ,
    question_en: "What is the specific function of the compressor in the refrigeration circuit?",
    options_en: ["To cool the refrigerant by lowering its pressure and temperature", "To raise the pressure and temperature of the suction refrigerant gas", "To filter impurities from the refrigerant before the condenser", "To store liquid refrigerant in a reserve tank"],
    explanation_en: "The compressor takes low-pressure/temperature gas and compresses it to high pressure/temperature."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿En qué estado sale el refrigerante del compresor hacia el condensador?",
    options: ["Gas de baja presión y baja temperatura frío húmedo", "Gas de alta presión y alta temperatura caliente seco vapor", "Líquido de alta presión y alta temperatura caliente puro", "Mezcla líquido-gas a presión intermedia y temperatura media"],
    correct: 1,
    explanation: "Del compresor sale gas sobrecalentado a alta presión y alta temperatura hacia el condensador."
  ,
    question_en: "In what state does the refrigerant leave the compressor toward the condenser?",
    options_en: ["Low-pressure, low-temperature cold wet gas", "High-pressure, high-temperature hot dry superheated vapor", "High-pressure, high-temperature pure hot liquid", "Liquid-gas mixture at intermediate pressure and temperature"],
    explanation_en: "Superheated gas at high pressure and high temperature exits the compressor toward the condenser."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Qué ocurre con el refrigerante dentro del condensador exactamente?",
    options: ["Absorbe calor del aire exterior y se evapora a gas rápido", "Rechaza calor al aire exterior y se condensa a líquido", "Se comprime aún más aumentando su presión considerablemente", "Se expande bajando su presión y temperatura drásticamente"],
    correct: 1,
    explanation: "En el condensador, el gas caliente rechaza calor al aire exterior y se condensa a líquido de alta presión."
  ,
    question_en: "What exactly happens to the refrigerant inside the condenser?",
    options_en: ["It absorbs heat from outdoor air and evaporates to gas quickly", "It rejects heat to the outdoor air and condenses to liquid", "It compresses even further increasing its pressure considerably", "It expands, dropping its pressure and temperature drastically"],
    explanation_en: "In the condenser, hot gas rejects heat to outdoor air and condenses to high-pressure liquid."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿En qué estado sale el refrigerante del condensador hacia el dispositivo de expansión?",
    options: ["Gas sobrecalentado a alta presión y alta temperatura", "Líquido subenfriado a alta presión y temperatura media", "Mezcla líquido-gas a baja presión y baja temperatura fría", "Gas saturado a baja presión y temperatura ambiente normal"],
    correct: 1,
    explanation: "Del condensador sale líquido subenfriado a alta presión, listo para entrar al dispositivo de expansión."
  ,
    question_en: "In what state does the refrigerant leave the condenser toward the expansion device?",
    options_en: ["Superheated gas at high pressure and high temperature", "Subcooled liquid at high pressure and medium temperature", "Liquid-gas mixture at low pressure and low cold temperature", "Saturated gas at low pressure and normal ambient temperature"],
    explanation_en: "Subcooled liquid at high pressure exits the condenser, ready to enter the expansion device."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Qué hace el dispositivo de expansión (TXV o capilar) con el refrigerante líquido?",
    options: ["Lo comprime para aumentar su presión antes del evaporador", "Lo expande reduciendo su presión y temperatura drásticamente", "Lo filtra removiendo humedad y partículas contaminantes metal", "Lo calienta para que se evapore antes de entrar al evaporador"],
    correct: 1,
    explanation: "El dispositivo de expansión reduce la presión del líquido, bajando su temperatura para entrar al evaporador."
  ,
    question_en: "What does the expansion device (TXV or capillary) do with the liquid refrigerant?",
    options_en: ["Compresses it to increase pressure before the evaporator", "Expands it, drastically reducing its pressure and temperature", "Filters it, removing moisture and metal contaminant particles", "Heats it so it evaporates before entering the evaporator"],
    explanation_en: "The expansion device reduces liquid pressure, lowering its temperature for entry into the evaporator."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Qué sucede si el compresor falla mecánicamente y no comprime el refrigerante?",
    options: ["El sistema sigue enfriando pero con menor eficiencia total", "El sistema no produce enfriamiento y las presiones se igualan", "Solo el ventilador del evaporador deja de funcionar interior", "La TXV compensa automáticamente la falta de compresión gas"],
    correct: 1,
    explanation: "Sin compresión, las presiones de alta y baja se igualan y no hay movimiento de refrigerante ni enfriamiento."
  ,
    question_en: "What happens if the compressor fails mechanically and does not compress the refrigerant?",
    options_en: ["The system continues cooling but with lower total efficiency", "The system produces no cooling and pressures equalize", "Only the indoor evaporator fan stops working", "The TXV automatically compensates for the lack of gas compression"],
    explanation_en: "Without compression, high and low pressures equalize and there is no refrigerant movement or cooling."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Cuál es la línea más caliente en un sistema de AC en operación normal?",
    options: ["La línea de succión entre evaporador y compresor baja", "La línea de descarga entre compresor y condensador alta", "La línea de líquido entre condensador y dispositivo expansión", "La línea entre dispositivo de expansión y el evaporador"],
    correct: 1,
    explanation: "La línea de descarga lleva gas sobrecalentado recién comprimido — la más caliente del sistema."
  ,
    question_en: "Which is the hottest line in an AC system during normal operation?",
    options_en: ["The suction line between evaporator and compressor low side", "The discharge line between compressor and condenser high side", "The liquid line between condenser and expansion device", "The line between expansion device and the evaporator"],
    explanation_en: "The discharge line carries freshly compressed superheated gas — the hottest line in the system."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Cuál es la línea más fría en un sistema de AC en operación normal?",
    options: ["La línea de descarga entre compresor y condensador alta", "La línea de líquido entre condensador y dispositivo expansión", "La línea de succión entre evaporador y compresor entrada", "La línea entre dispositivo de expansión y el evaporador"],
    correct: 3,
    explanation: "Justo después de la expansión, el refrigerante está a su temperatura más baja antes de absorber calor."
  ,
    question_en: "Which is the coldest line in an AC system during normal operation?",
    options_en: ["The discharge line between compressor and condenser high side", "The liquid line between condenser and expansion device", "The suction line between evaporator and compressor inlet", "The line between expansion device and the evaporator"],
    explanation_en: "Right after expansion, the refrigerant is at its lowest temperature before absorbing heat."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Por qué la línea de succión (tubo grande) tiene aislamiento y la línea de líquido (tubo pequeño) no?",
    options: ["Por estética para que se vea más profesional instalado", "Para evitar condensación y ganancia de calor en la succión", "Porque la línea de líquido no lleva refrigerante normalmente", "Porque el código NEC requiere aislar todos los tubos grandes"],
    correct: 1,
    explanation: "La línea de succión fría se aísla para evitar condensación (goteo) y ganancia de calor que reduce eficiencia."
  ,
    question_en: "Why does the suction line (large tube) have insulation and the liquid line (small tube) does not?",
    options_en: ["For aesthetics to look more professional installed", "To prevent condensation and heat gain on the suction line", "Because the liquid line does not normally carry refrigerant", "Because NEC code requires insulating all large tubes"],
    explanation_en: "The cold suction line is insulated to prevent condensation (dripping) and heat gain that reduces efficiency."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Cuál es el diámetro típico de la línea de succión vs la línea de líquido en un split de 3 toneladas?",
    options: ["Succión 1/4\" y líquido 3/8\" de diámetro estándar", "Succión 3/4\" y líquido 3/8\" de diámetro estándar", "Succión 3/8\" y líquido 3/4\" de diámetro estándar", "Succión 1/2\" y líquido 1/2\" de diámetro estándar"],
    correct: 1,
    explanation: "En 3 toneladas: succión (gas) = 3/4\" (grande para bajo volumen de gas). Líquido = 3/8\" (pequeña, alta presión)."
  ,
    question_en: "What is the typical suction line vs liquid line diameter in a 3-ton split system?",
    options_en: ["Suction 1/4 inch and liquid 3/8 inch standard diameter", "Suction 3/4 inch and liquid 3/8 inch standard diameter", "Suction 3/8 inch and liquid 3/4 inch standard diameter", "Suction 1/2 inch and liquid 1/2 inch standard diameter"],
    explanation_en: "In 3 tons: suction (gas) = 3/4 inch (large for low-density gas). Liquid = 3/8 inch (small, high pressure)."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Qué componente adicional se encuentra en la línea de líquido para proteger el sistema?",
    options: ["Un acumulador de succión para atrapar líquido sobrante", "Un filtro secador para remover humedad y contaminantes", "Un separador de aceite para retornar aceite al compresor", "Un silenciador de descarga para reducir ruido del sistema"],
    correct: 1,
    explanation: "El filtro secador (filter-drier) en la línea de líquido remueve humedad, ácidos y partículas."
  ,
    question_en: "What additional component is found on the liquid line to protect the system?",
    options_en: ["A suction accumulator to trap excess liquid", "A filter-drier to remove moisture and contaminants", "An oil separator to return oil to the compressor", "A discharge muffler to reduce system noise"],
    explanation_en: "The filter-drier on the liquid line removes moisture, acids, and particles."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿En qué dirección debe fluir el refrigerante a través del filtro secador?",
    options: ["En cualquier dirección, el filtro es bidireccional siempre", "En la dirección indicada por la flecha del fabricante marcada", "Siempre de derecha a izquierda sin importar la instalación", "Siempre de abajo hacia arriba para máxima filtración total"],
    correct: 1,
    explanation: "Los filtros secadores tienen flecha de flujo. Instalarlo al revés reduce su efectividad dramáticamente."
  ,
    question_en: "In which direction should refrigerant flow through the filter-drier?",
    options_en: ["In any direction; the filter is always bidirectional", "In the direction indicated by the manufacturer's marked arrow", "Always from right to left regardless of installation", "Always from bottom to top for maximum total filtration"],
    explanation_en: "Filter-driers have a flow arrow. Installing it backwards dramatically reduces its effectiveness."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Qué indica una diferencia de temperatura grande (>5°F) entre la entrada y salida del filtro secador?",
    options: ["El filtro secador está funcionando perfectamente normal ideal", "El filtro secador está restringido y necesita reemplazo pronto", "El filtro secador es demasiado grande para este sistema AC", "La TXV está abierta completamente dejando pasar todo flujo"],
    correct: 1,
    explanation: "Un delta-T >5°F a través del filtro indica restricción — el filtro está tapado y debe reemplazarse."
  ,
    question_en: "What does a large temperature difference (>5 degrees F) between the filter-drier inlet and outlet indicate?",
    options_en: ["The filter-drier is functioning perfectly normally ideal", "The filter-drier is restricted and needs replacement soon", "The filter-drier is too large for this AC system", "The TXV is fully open letting all flow through"],
    explanation_en: "A delta-T >5 degrees F across the filter indicates restriction — the filter is clogged and must be replaced."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Cuál es la función del separador de aceite en un sistema de refrigeración comercial?",
    options: ["Filtrar partículas metálicas del refrigerante contaminado", "Separar y retornar aceite al compresor desde la descarga", "Almacenar refrigerante excedente durante baja demanda fría", "Reducir la presión del gas de descarga antes del condensador"],
    correct: 1,
    explanation: "El separador de aceite intercepta aceite en la línea de descarga y lo retorna al cárter del compresor."
  ,
    question_en: "What is the function of the oil separator in a commercial refrigeration system?",
    options_en: ["To filter metal particles from contaminated refrigerant", "To separate and return oil to the compressor from the discharge", "To store excess refrigerant during low cold demand", "To reduce discharge gas pressure before the condenser"],
    explanation_en: "The oil separator intercepts oil in the discharge line and returns it to the compressor crankcase."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Por qué es importante que el aceite retorne al compresor durante la operación del sistema?",
    options: ["El aceite enfría el refrigerante en la línea de líquido", "Sin aceite el compresor pierde lubricación y se daña rápido", "El aceite aumenta la eficiencia del evaporador absorbiendo calor", "El aceite no es importante, los compresores modernos no lo necesitan"],
    correct: 1,
    explanation: "El aceite lubrica las partes móviles del compresor. Sin retorno de aceite = desgaste y falla mecánica."
  ,
    question_en: "Why is it important that oil returns to the compressor during system operation?",
    options_en: ["Oil cools the refrigerant in the liquid line", "Without oil the compressor loses lubrication and damages quickly", "Oil increases evaporator efficiency by absorbing heat", "Oil is not important; modern compressors do not need it"],
    explanation_en: "Oil lubricates the compressor's moving parts. Without oil return = wear and mechanical failure."
  },
  {
    category: "Circuito Refrigerante",
    q: "¿Qué componente de seguridad protege el compresor si la presión de succión es demasiado baja?",
    options: ["El presostato de alta presión del lado de descarga AC", "El presostato de baja presión del lado de succión entrada", "El capacitor de marcha del motor del compresor hermético", "El termostato de ambiente que controla el setpoint interior"],
    correct: 1,
    explanation: "El LPS (Low Pressure Switch) apaga el compresor si la succión baja demasiado, indicando falta de carga o restricción."
  ,
    question_en: "What safety component protects the compressor if suction pressure is too low?",
    options_en: ["The high-pressure switch on the AC discharge side", "The low-pressure switch on the suction inlet side", "The hermetic compressor motor run capacitor", "The room thermostat that controls the indoor setpoint"],
    explanation_en: "The LPS (Low Pressure Switch) shuts off the compressor if suction drops too low, indicating low charge or restriction."
  },
  {
    category: "Circuito Refrigerante",
    q: "Si ambas presiones (alta y baja) están equalizadas con el compresor encendido, ¿qué indica?",
    options: ["El sistema está operando normalmente con carga correcta", "El compresor no está comprimiendo — posible válvula rota", "El sistema tiene sobrecarga de refrigerante excesiva total", "La TXV está cerrada completamente sin dejar pasar nada"],
    correct: 1,
    explanation: "Presiones equalizadas con compresor en marcha = el compresor no comprime. Válvulas internas dañadas o motor sin girar."
  ,
    question_en: "If both pressures (high and low) are equalized with the compressor running, what does it indicate?",
    options_en: ["The system is operating normally with correct charge", "The compressor is not compressing — possible broken valve", "The system has excessive total refrigerant overcharge", "The TXV is completely closed not letting anything through"],
    explanation_en: "Equalized pressures with the compressor running = the compressor is not compressing. Internal valves are damaged or motor is not turning."
  },
    {
      category: "Manual J de ACCA",
      q: "Al realizar un cálculo de carga térmica con Manual J, ¿qué factor tiene el MAYOR impacto en la carga de enfriamiento de una pared exterior orientada al oeste?",
      options: ["La resistencia térmica del aislamiento instalado en la cavidad del muro", "La ganancia solar transmitida a través del área acristalada adyacente", "El coeficiente de infiltración de aire por las juntas del marco estructural", "La diferencia de temperatura equivalente corregida por masa térmica del muro"],
      correct: 3,
      explanation: "Manual J usa la CLTD (Cooling Load Temperature Difference) corregida por masa térmica para muros opacos, que incorpora radiación solar, orientación y almacenamiento térmico."
    ,
    question_en: "When performing a Manual J load calculation, what factor has the GREATEST impact on the cooling load of a west-facing exterior wall?",
    options_en: ["The thermal resistance of the insulation installed in the wall cavity", "The solar gain transmitted through the adjacent glazed area", "The air infiltration coefficient through the structural frame joints", "The corrected equivalent temperature difference for the wall's thermal mass"],
    explanation_en: "Manual J uses the CLTD (Cooling Load Temperature Difference) corrected for thermal mass for opaque walls, which incorporates solar radiation, orientation, and thermal storage."
  },
    {
      category: "Manual J de ACCA",
      q: "En Manual J, ¿cuál es el propósito principal de aplicar el factor de corrección por latitud y mes de diseño a las ganancias solares?",
      options: ["Compensar la variación de presión barométrica según la altitud de la ubicación", "Ajustar la intensidad de radiación solar según el ángulo de incidencia estacional", "Corregir el efecto de la humedad relativa exterior sobre la transmitancia del vidrio", "Modificar el coeficiente de sombreado interno por el tipo de cortina instalada"],
      correct: 1,
      explanation: "El factor de latitud y mes ajusta la radiación solar porque el ángulo de incidencia del sol varía según la latitud geográfica y la época del año, afectando directamente la ganancia solar."
    ,
    question_en: "In Manual J, what is the main purpose of applying the latitude and design month correction factor to solar gains?",
    options_en: ["To compensate for barometric pressure variation by altitude of location", "To adjust solar radiation intensity based on the seasonal angle of incidence", "To correct the effect of outdoor relative humidity on glass transmittance", "To modify the internal shading coefficient by the type of installed curtain"],
    explanation_en: "The latitude and month factor adjusts solar radiation because the sun's angle of incidence varies by geographic latitude and time of year, directly affecting solar gain."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Qué valor de infiltración utiliza Manual J para una casa con construcción semi-tight en condiciones de diseño de invierno?",
      options: ["Se calcula con 0.50 ACH y se ajusta por la diferencia de temperatura exterior", "Se estima con el método de grietas usando la longitud total de rendijas y juntas", "Se aplica un valor de cambios de aire por hora basado en el volumen y hermeticidad", "Se determina mediante la prueba de puerta sopladora dividida entre factor N regional"],
      correct: 2,
      explanation: "Manual J utiliza el método de cambios de aire naturales (ACHnat) basado en el volumen de la casa y su clasificación de hermeticidad (tight, semi-tight, loose) para estimar infiltración."
    ,
    question_en: "What infiltration value does Manual J use for a semi-tight construction house under winter design conditions?",
    options_en: ["Calculated with 0.50 ACH adjusted for the outdoor temperature difference", "Estimated with the crack method using total length of cracks and joints", "An air changes per hour value applied based on volume and airtightness", "Determined by blower door test divided by regional N factor"],
    explanation_en: "Manual J uses the natural air changes method (ACHnat) based on the home's volume and its airtightness classification (tight, semi-tight, loose) to estimate infiltration."
  },
    {
      category: "Manual J de ACCA",
      q: "Cuando Manual J indica usar condiciones de diseño del 1% para enfriamiento, ¿qué significa exactamente ese porcentaje?",
      options: ["Que el 1% del área total de la envolvente presenta deficiencias de aislamiento térmico", "Que la temperatura exterior excede ese valor solo durante el 1% de las horas anuales", "Que se aplica un margen de seguridad del 1% sobre la carga térmica total calculada", "Que el equipo debe operar al 1% de capacidad mínima durante condiciones parciales"],
      correct: 1,
      explanation: "Las condiciones de diseño del 1% significan que la temperatura exterior de bulbo seco excede ese valor solo durante 1% de las 8,760 horas del año (aproximadamente 88 horas)."
    ,
    question_en: "When Manual J indicates using 1% design conditions for cooling, what exactly does that percentage mean?",
    options_en: ["That 1% of the total envelope area has thermal insulation deficiencies", "That the outdoor temperature exceeds that value only during 1% of annual hours", "That a 1% safety margin is applied over the total calculated thermal load", "That the equipment must operate at 1% minimum capacity during partial conditions"],
    explanation_en: "The 1% design conditions mean the outdoor dry bulb temperature exceeds that value only during 1% of the year's 8,760 hours (approximately 88 hours)."
  },
    {
      category: "Manual J de ACCA",
      q: "En un cálculo de Manual J, ¿cómo afecta un ático con aislamiento R-38 versus R-30 a la carga de enfriamiento del techo?",
      options: ["Reduce la carga del techo aproximadamente un 21% por la mayor resistencia térmica total", "Disminuye la ganancia solar directa a través de la cubierta en proporción exacta al delta-R", "Elimina la necesidad de considerar el factor de ventilación del espacio del ático superior", "Modifica el CLTD del techo reduciendo la diferencia de temperatura equivalente corregida"],
      correct: 0,
      explanation: "Con R-38 vs R-30, el factor U cambia proporcionalmente (1/38 vs 1/30), resultando en aproximadamente 21% menos ganancia de calor a través del ensamblaje del techo."
    ,
    question_en: "In a Manual J calculation, how does an attic with R-38 insulation versus R-30 affect the roof cooling load?",
    options_en: ["Reduces the roof load by approximately 21% due to greater total thermal resistance", "Decreases direct solar gain through the roof covering in exact proportion to the delta-R", "Eliminates the need to consider the attic space ventilation factor", "Modifies the roof CLTD by reducing the corrected equivalent temperature difference"],
    explanation_en: "With R-38 vs R-30, the U-factor changes proportionally (1/38 vs 1/30), resulting in approximately 21% less heat gain through the roof assembly."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Cuál es la razón principal por la que Manual J requiere calcular cargas habitación por habitación en lugar de solo la carga total de la casa?",
      options: ["Para determinar la capacidad máxima del compresor y el tamaño correcto de la línea de succión", "Para dimensionar correctamente los ductos y distribuir el flujo de aire a cada espacio individual", "Para calcular el consumo energético anual y estimar el costo de operación mensual del sistema", "Para verificar que el refrigerante seleccionado es compatible con las temperaturas de cada zona"],
      correct: 1,
      explanation: "El cálculo habitación por habitación es esencial para dimensionar los ductos individuales y asegurar que cada espacio reciba el CFM necesario para mantener la temperatura de diseño."
    ,
    question_en: "What is the main reason Manual J requires calculating loads room by room instead of only the total house load?",
    options_en: ["To determine maximum compressor capacity and correct suction line size", "To correctly size ducts and distribute airflow to each individual space", "To calculate annual energy consumption and estimate monthly operating cost", "To verify the selected refrigerant is compatible with each zone's temperatures"],
    explanation_en: "Room-by-room calculation is essential for sizing individual ducts and ensuring each space receives the CFM needed to maintain design temperature."
  },
    {
      category: "Manual J de ACCA",
      q: "En Manual J, ¿qué componente de la carga de enfriamiento se ve MÁS afectado cuando una casa tiene ventanas con coeficiente SHGC de 0.25 versus 0.40?",
      options: ["La carga por conducción a través del vidrio debido al cambio en el valor U total del ensamblaje", "La carga por infiltración porque ventanas con menor SHGC tienen marcos más herméticos típicamente", "La ganancia solar directa e indirecta que atraviesa el acristalamiento hacia el espacio interior", "La carga latente interior porque el SHGC afecta la evaporación de humedad en superficies cálidas"],
      correct: 2,
      explanation: "El SHGC (Solar Heat Gain Coefficient) afecta directamente la cantidad de radiación solar que penetra el vidrio. Reducir de 0.40 a 0.25 disminuye la ganancia solar en aproximadamente 37%."
    ,
    question_en: "In Manual J, which cooling load component is MOST affected when a house has windows with SHGC of 0.25 versus 0.40?",
    options_en: ["The conduction load through the glass due to the change in total assembly U-value", "The infiltration load because lower SHGC windows typically have more airtight frames", "The direct and indirect solar gain that passes through the glazing into the interior space", "The interior latent load because SHGC affects moisture evaporation on warm surfaces"],
    explanation_en: "SHGC (Solar Heat Gain Coefficient) directly affects the amount of solar radiation penetrating the glass. Reducing from 0.40 to 0.25 decreases solar gain by approximately 37%."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Por qué Manual J considera la orientación de cada pared y ventana al calcular la carga de enfriamiento pero NO al calcular la carga de calefacción?",
      options: ["Porque en invierno la radiación solar es despreciable y no contribuye a la carga térmica del edificio", "Porque la carga de calefacción se calcula en la noche de diseño cuando no existe ganancia solar directa", "Porque los vientos predominantes de invierno son uniformes en todas las orientaciones de la envolvente", "Porque el aislamiento térmico tiene el mismo rendimiento independientemente de la orientación del muro"],
      correct: 1,
      explanation: "Manual J calcula la carga de calefacción para la condición nocturna de diseño (sin sol), por lo que la orientación no importa. En enfriamiento, la ganancia solar varía significativamente según la orientación."
    ,
    question_en: "Why does Manual J consider the orientation of each wall and window when calculating the cooling load but NOT the heating load?",
    options_en: ["Because in winter solar radiation is negligible and does not contribute to the building's thermal load", "Because the heating load is calculated for the design night when there is no direct solar gain", "Because prevailing winter winds are uniform across all building envelope orientations", "Because thermal insulation performs the same regardless of wall orientation"],
    explanation_en: "Manual J calculates the heating load for the nighttime design condition (no sun), so orientation does not matter. In cooling, solar gain varies significantly by orientation."
  },
    {
      category: "Manual J de ACCA",
      q: "Al calcular la carga de calefacción con Manual J, ¿cuál de los siguientes elementos NO se incluye en el cálculo estándar?",
      options: ["La pérdida de calor por conducción a través de paredes, techos, pisos y puertas de la envolvente", "La pérdida de calor debida a la infiltración de aire frío exterior a través de grietas y aberturas", "La ganancia interna generada por personas, iluminación artificial y equipos eléctricos domésticos", "La pérdida de calor por conducción a través de losas de piso en contacto con el terreno perimetral"],
      correct: 2,
      explanation: "Manual J NO incluye ganancias internas (personas, luces, equipos) en el cálculo de calefacción como medida conservadora, ya que estas ganancias son variables e intermitentes."
    ,
    question_en: "When calculating the heating load with Manual J, which of the following elements is NOT included in the standard calculation?",
    options_en: ["Heat loss by conduction through walls, ceilings, floors, and doors of the envelope", "Heat loss due to infiltration of cold outdoor air through cracks and openings", "Internal gains generated by people, artificial lighting, and household electrical equipment", "Heat loss by conduction through floor slabs in contact with the perimeter ground"],
    explanation_en: "Manual J does NOT include internal gains (people, lights, equipment) in the heating calculation as a conservative measure, since these gains are variable and intermittent."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Cuál es el efecto de sobredimensionar un sistema de aire acondicionado según las consecuencias que advierte el procedimiento de Manual J?",
      options: ["Aumenta el consumo eléctrico pero mejora significativamente el control de humedad interior en verano", "Causa ciclos cortos que degradan el control de humedad y reducen la vida útil del compresor", "Genera mayor ruido en los ductos pero mantiene temperaturas más estables en todas las habitaciones", "Reduce la eficiencia del calentador de gas pero no afecta el rendimiento del ciclo de enfriamiento"],
      correct: 1,
      explanation: "Un sistema sobredimensionado causa ciclos cortos (short cycling), lo que impide la deshumidificación adecuada porque el evaporador no opera suficiente tiempo para remover humedad latente."
    ,
    question_en: "What is the effect of oversizing an air conditioning system per the consequences warned by the Manual J procedure?",
    options_en: ["Increases electrical consumption but significantly improves indoor humidity control in summer", "Causes short cycles that degrade humidity control and reduce compressor lifespan", "Generates more noise in ducts but maintains more stable temperatures in all rooms", "Reduces gas heater efficiency but does not affect cooling cycle performance"],
    explanation_en: "An oversized system causes short cycling, which prevents adequate dehumidification because the evaporator does not run long enough to remove latent moisture."
  },
    {
      category: "Manual J de ACCA",
      q: "En Manual J, ¿qué método se recomienda para determinar la pérdida de calor a través de un piso sobre un sótano no acondicionado?",
      options: ["Se usa la diferencia de temperatura entre el espacio y el exterior multiplicada por el área del piso", "Se calcula con la temperatura estimada del sótano como intermedia entre interior y condición exterior", "Se aplica el factor de pérdida perimetral multiplicado por los pies lineales de borde de la losa expuesta", "Se utiliza el mismo procedimiento que para un muro exterior con la resistencia térmica del entrepiso"],
      correct: 1,
      explanation: "Para pisos sobre sótanos no acondicionados, Manual J usa una temperatura intermedia del sótano (buffer space) que está entre la temperatura interior de diseño y la exterior."
    ,
    question_en: "In Manual J, what method is recommended for determining heat loss through a floor over an unconditioned basement?",
    options_en: ["Using the temperature difference between the space and outdoors multiplied by floor area", "Calculating with the estimated basement temperature as intermediate between indoor and outdoor conditions", "Applying the perimeter loss factor multiplied by the linear feet of exposed slab edge", "Using the same procedure as for an exterior wall with the floor assembly thermal resistance"],
    explanation_en: "For floors over unconditioned basements, Manual J uses an intermediate basement temperature (buffer space) that falls between the indoor design temperature and the outdoor."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Qué factor de Manual J se debe ajustar cuando la casa tiene un sistema de ductos ubicado completamente en un ático sin acondicionar?",
      options: ["El coeficiente de rendimiento estacional SEER del equipo seleccionado para compensar pérdidas de ductos", "El multiplicador de carga por ductos que incrementa la carga total según la ubicación y aislamiento de estos", "La temperatura de diseño interior reduciendo 2°F para compensar la ganancia de calor adicional en el ático", "El factor de bypass del evaporador aumentándolo proporcionalmente al largo total del sistema de ductos"],
      correct: 1,
      explanation: "Manual J incluye un multiplicador de carga por ductos (duct load multiplier) que aumenta la carga calculada cuando los ductos están en espacios no acondicionados como áticos."
    ,
    question_en: "What Manual J factor must be adjusted when the house has a duct system located entirely in an unconditioned attic?",
    options_en: ["The seasonal energy efficiency ratio SEER of the selected equipment to compensate for duct losses", "The duct load multiplier that increases the total load based on the location and insulation of the ducts", "The interior design temperature reducing 2°F to compensate for the additional heat gain in the attic", "The evaporator bypass factor increasing it proportionally to the total length of the duct system"],
    explanation_en: "Manual J includes a duct load multiplier that increases the calculated load when ducts are in unconditioned spaces like attics."
  },
    {
      category: "Manual J de ACCA",
      q: "Según Manual J, ¿cuál es la humedad relativa interior de diseño recomendada para el cálculo de la carga latente de enfriamiento?",
      options: ["Se recomienda usar 45% HR como condición de diseño interior para climas secos y templados del suroeste", "Se recomienda usar 50% HR como condición de diseño interior estándar para la mayoría de aplicaciones", "Se recomienda usar 55% HR como condición de diseño interior para zonas con alta carga latente exterior", "Se recomienda usar 60% HR como condición de diseño interior cuando el equipo tiene deshumidificación activa"],
      correct: 1,
      explanation: "Manual J establece 50% de humedad relativa como la condición de diseño interior estándar para cálculos de carga latente de enfriamiento en aplicaciones residenciales."
    ,
    question_en: "According to Manual J, what is the recommended indoor design relative humidity for calculating the latent cooling load?",
    options_en: ["45% RH is recommended as the indoor design condition for dry and temperate climates of the southwest", "50% RH is recommended as the standard indoor design condition for most applications", "55% RH is recommended as the indoor design condition for zones with high outdoor latent load", "60% RH is recommended as the indoor design condition when the equipment has active dehumidification"],
    explanation_en: "Manual J establishes 50% relative humidity as the standard indoor design condition for residential latent cooling load calculations."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Cuántas BTU/h de carga latente aporta cada persona adicional en una residencia según los valores estándar de Manual J?",
      options: ["Aproximadamente 130 BTU/h de calor latente por persona en actividad sedentaria según la tabla estándar", "Aproximadamente 200 BTU/h de calor latente por persona en actividad sedentaria según la tabla estándar", "Aproximadamente 270 BTU/h de calor latente por persona en actividad sedentaria según la tabla estándar", "Aproximadamente 340 BTU/h de calor latente por persona en actividad sedentaria según la tabla estándar"],
      correct: 1,
      explanation: "Manual J usa aproximadamente 200 BTU/h de calor latente por persona en actividad sedentaria residencial. La ganancia sensible es de aproximadamente 230 BTU/h por persona."
    ,
    question_en: "How many BTU/h of latent load does each additional person contribute in a residence according to Manual J standard values?",
    options_en: ["Approximately 130 BTU/h of latent heat per person in sedentary activity according to the standard table", "Approximately 200 BTU/h of latent heat per person in sedentary activity according to the standard table", "Approximately 270 BTU/h of latent heat per person in sedentary activity according to the standard table", "Approximately 340 BTU/h of latent heat per person in sedentary activity according to the standard table"],
    explanation_en: "Manual J uses approximately 200 BTU/h of latent heat per person in sedentary residential activity. The sensible gain is approximately 230 BTU/h per person."
  },
    {
      category: "Manual J de ACCA",
      q: "En un cálculo de Manual J para una casa en Miami, ¿por qué la carga latente puede representar hasta el 30% o más de la carga total de enfriamiento?",
      options: ["Porque la alta temperatura de bulbo seco exterior aumenta la evaporación interna del agua en superficies", "Porque la elevada humedad absoluta exterior genera una gran diferencia de humedad con el espacio interior", "Porque los sistemas en climas tropicales operan con mayor presión de condensación aumentando la latente", "Porque las casas en Miami tienen mayor infiltración debido a códigos de construcción menos restrictivos"],
      correct: 1,
      explanation: "En Miami, la humedad absoluta exterior es muy alta, creando una gran diferencia de humedad (grains) con el interior, lo que genera una carga latente significativa por ventilación e infiltración."
    ,
    question_en: "In a Manual J calculation for a house in Miami, why can the latent load represent up to 30% or more of the total cooling load?",
    options_en: ["Because the high outdoor dry bulb temperature increases internal water evaporation on surfaces", "Because the high outdoor absolute humidity creates a large humidity difference with the indoor space", "Because systems in tropical climates operate with higher condensing pressure increasing the latent load", "Because homes in Miami have greater infiltration due to less restrictive building codes"],
    explanation_en: "In Miami, outdoor absolute humidity is very high, creating a large humidity difference (grains) with the interior, which generates significant latent load from ventilation and infiltration."
  },
    {
      category: "Manual J de ACCA",
      q: "¿Por qué Manual J indica que el número de ocupantes para el cálculo de cargas internas debe basarse en el número de dormitorios más uno?",
      options: ["Porque ese método coincide con los requisitos de ventilación mecánica del código ASHRAE 62.2 vigente", "Porque establece una ocupación estándar conservadora independiente del número real de personas residentes", "Porque los fabricantes de equipos HVAC calibran sus tablas de capacidad usando exactamente esa fórmula", "Porque el código de construcción residencial IRC exige ese método para el dimensionamiento de plomería también"],
      correct: 1,
      explanation: "Manual J usa dormitorios + 1 como método estandarizado para estimar ocupación, proporcionando un valor conservador y consistente independientemente de quién viva realmente en la casa."
    ,
    question_en: "Why does Manual J indicate that the number of occupants for internal load calculation should be based on the number of bedrooms plus one?",
    options_en: ["Because that method matches the mechanical ventilation requirements of the current ASHRAE 62.2 code", "Because it establishes a conservative standard occupancy independent of the actual number of residents", "Because HVAC equipment manufacturers calibrate their capacity tables using exactly that formula", "Because the residential building code IRC requires that method for plumbing sizing as well"],
    explanation_en: "Manual J uses bedrooms + 1 as a standardized method to estimate occupancy, providing a conservative and consistent value regardless of who actually lives in the house."
  },
    {
      category: "Manual D de ACCA",
      q: "Al diseñar un sistema de ductos con Manual D, ¿cuál es el primer paso antes de dimensionar cualquier tramo de ducto?",
      options: ["Seleccionar el tipo de material del ducto y determinar su factor de rugosidad interna correspondiente", "Calcular el flujo de aire total del sistema y la presión estática externa disponible del equipo HVAC", "Medir la longitud total de todos los tramos rectos de ducto y contar el número de codos y transiciones", "Determinar la velocidad máxima permitida en el pleno de suministro según el nivel de ruido aceptable"],
      correct: 1,
      explanation: "Manual D requiere primero conocer el CFM total (de Manual J) y la presión estática externa disponible del equipo (de Manual S) antes de dimensionar cualquier ducto."
    ,
    question_en: "When designing a duct system with Manual D, what is the first step before sizing any duct run?",
    options_en: ["Select the duct material type and determine its corresponding internal roughness factor", "Calculate the total system airflow and the available external static pressure of the HVAC equipment", "Measure the total length of all straight duct runs and count the number of elbows and transitions", "Determine the maximum allowable velocity in the supply plenum based on the acceptable noise level"],
    explanation_en: "Manual D requires first knowing the total CFM (from Manual J) and the available external static pressure of the equipment (from Manual S) before sizing any duct."
  },
    {
      category: "Manual D de ACCA",
      q: "En el método de igual fricción de Manual D, ¿qué se mantiene constante en todos los tramos del sistema de ductos?",
      options: ["La velocidad del aire en pies por minuto para minimizar el nivel de ruido en cada sección del ducto", "La caída de presión por cada 100 pies de longitud equivalente en todos los tramos del recorrido del aire", "El diámetro equivalente del ducto para simplificar la fabricación e instalación de las piezas en campo", "La presión estática total disponible en cada punto de conexión con los difusores de suministro de aire"],
      correct: 1,
      explanation: "El método de igual fricción mantiene una tasa constante de caída de presión (en pulgadas de columna de agua por cada 100 pies de longitud equivalente) en todos los tramos."
    ,
    question_en: "In the equal friction method of Manual D, what is kept constant in all duct runs of the system?",
    options_en: ["The air velocity in feet per minute to minimize the noise level in each duct section", "The pressure drop per every 100 feet of equivalent length in all runs of the air path", "The equivalent duct diameter to simplify the fabrication and installation of pieces in the field", "The total available static pressure at each connection point with the supply air diffusers"],
    explanation_en: "The equal friction method maintains a constant rate of pressure drop (in inches of water column per 100 feet of equivalent length) in all duct runs."
  },
    {
      category: "Manual D de ACCA",
      q: "¿Cuál es la longitud equivalente típica que Manual D asigna a un codo de radio estándar de 90 grados en ducto rectangular sin álabes directores?",
      options: ["Aproximadamente 10 pies de longitud equivalente de ducto recto según las tablas de fitting del manual", "Aproximadamente 25 pies de longitud equivalente de ducto recto según las tablas de fitting del manual", "Aproximadamente 55 pies de longitud equivalente de ducto recto según las tablas de fitting del manual", "Aproximadamente 75 pies de longitud equivalente de ducto recto según las tablas de fitting del manual"],
      correct: 2,
      explanation: "Un codo rectangular de 90° sin álabes tiene una longitud equivalente de aproximadamente 55-60 pies, representando una pérdida significativa. Agregar álabes directores puede reducir esto a 10-15 pies."
    ,
    question_en: "What is the typical equivalent length that Manual D assigns to a standard 90-degree radius elbow in rectangular duct without turning vanes?",
    options_en: ["Approximately 10 feet of equivalent straight duct length according to the fitting tables in the manual", "Approximately 25 feet of equivalent straight duct length according to the fitting tables in the manual", "Approximately 55 feet of equivalent straight duct length according to the fitting tables in the manual", "Approximately 75 feet of equivalent straight duct length according to the fitting tables in the manual"],
    explanation_en: "A 90-degree rectangular elbow without turning vanes has an equivalent length of approximately 55-60 feet, representing a significant loss. Adding turning vanes can reduce this to 10-15 feet."
  },
    {
      category: "Manual D de ACCA",
      q: "Según Manual D, ¿por qué se debe evitar instalar un codo inmediatamente después de la salida del plenum de suministro?",
      options: ["Porque el codo genera una distribución desigual de velocidad que crea turbulencia y aumenta las pérdidas", "Porque la temperatura del aire es más alta cerca del plenum y el codo puede causar condensación interna", "Porque el codo cambia la dirección del flujo de refrigerante en la línea de líquido que corre paralela", "Porque el código mecánico prohíbe específicamente codos dentro de los primeros 5 pies después del equipo"],
      correct: 0,
      explanation: "Un codo cerca del plenum causa distribución desigual de velocidad (perfil de velocidad no desarrollado), generando turbulencia adicional y pérdidas de presión mayores a las tabuladas."
    ,
    question_en: "According to Manual D, why should installing an elbow immediately after the supply plenum outlet be avoided?",
    options_en: ["Because the elbow generates uneven velocity distribution creating turbulence and increased losses", "Because the air temperature is higher near the plenum and the elbow can cause internal condensation", "Because the elbow changes the direction of refrigerant flow in the liquid line running parallel", "Because the mechanical code specifically prohibits elbows within the first 5 feet after the equipment"],
    explanation_en: "An elbow near the plenum causes uneven velocity distribution (undeveloped velocity profile), generating additional turbulence and pressure losses greater than those tabulated."
  },
    {
      category: "Manual D de ACCA",
      q: "En Manual D, ¿cuál es la velocidad máxima recomendada en el ducto troncal de suministro para un sistema residencial típico?",
      options: ["No más de 500 FPM para evitar ruido excesivo y mantener pérdidas de fricción razonables en la troncal", "No más de 700 FPM para evitar ruido excesivo y mantener pérdidas de fricción razonables en la troncal", "No más de 900 FPM para evitar ruido excesivo y mantener pérdidas de fricción razonables en la troncal", "No más de 1200 FPM para evitar ruido excesivo y mantener pérdidas de fricción razonables en la troncal"],
      correct: 2,
      explanation: "Manual D recomienda no exceder 900 FPM en ductos troncales residenciales para mantener niveles de ruido aceptables y pérdidas de presión manejables."
    ,
    question_en: "In Manual D, what is the maximum recommended velocity in the supply trunk duct for a typical residential system?",
    options_en: ["No more than 500 FPM to avoid excessive noise and maintain reasonable friction losses in the trunk", "No more than 700 FPM to avoid excessive noise and maintain reasonable friction losses in the trunk", "No more than 900 FPM to avoid excessive noise and maintain reasonable friction losses in the trunk", "No more than 1200 FPM to avoid excessive noise and maintain reasonable friction losses in the trunk"],
    explanation_en: "Manual D recommends not exceeding 900 FPM in residential trunk ducts to maintain acceptable noise levels and manageable pressure losses."
  },
    {
      category: "Manual D de ACCA",
      q: "¿Cuál es la diferencia principal entre diseñar un sistema de ductos radial versus un sistema de ductos con troncal extendida según Manual D?",
      options: ["El sistema radial usa ductos rígidos y el troncal extendida siempre requiere ducto flexible por norma vigente", "El sistema radial conecta cada ramal directamente al plenum mientras el troncal extiende un ducto principal", "El sistema radial es exclusivo para calefacción y el troncal extendida solo se aplica en sistemas de enfriamiento", "El sistema radial requiere mayor presión estática pero produce menor velocidad que el troncal extendida siempre"],
      correct: 1,
      explanation: "En un sistema radial, cada ramal sale directamente del plenum. En un sistema de troncal extendida, un ducto principal recorre la casa y los ramales se conectan a lo largo de él."
    ,
    question_en: "What is the main difference between designing a radial duct system versus an extended trunk duct system according to Manual D?",
    options_en: ["The radial system uses rigid ducts and the extended trunk always requires flexible duct by current code", "The radial system connects each branch directly to the plenum while the trunk extends a main duct", "The radial system is exclusive for heating and the extended trunk only applies to cooling systems", "The radial system requires higher static pressure but produces lower velocity than the extended trunk always"],
    explanation_en: "In a radial system, each branch exits directly from the plenum. In an extended trunk system, a main duct runs through the house and branches connect along it."
  },
    {
      category: "Manual D de ACCA",
      q: "Según Manual D, ¿qué sucede con el tamaño del ducto troncal cuando se utiliza el método de reducción de troncal después de cada derivación?",
      options: ["El troncal mantiene su tamaño original hasta el punto medio y luego se reduce en un solo escalón final", "El troncal se reduce progresivamente después de cada takeoff para mantener una velocidad relativamente constante", "El troncal aumenta gradualmente de tamaño para compensar la fricción acumulada a lo largo del recorrido total", "El troncal se reduce solo al final del recorrido en una transición única calculada por el flujo del último ramal"],
      correct: 1,
      explanation: "El método de reducción de troncal reduce el ducto principal después de cada derivación (takeoff) conforme disminuye el CFM, manteniendo la velocidad relativamente constante y optimizando material."
    ,
    question_en: "According to Manual D, what happens to the trunk duct size when using the trunk reduction method after each takeoff?",
    options_en: ["The trunk maintains its original size until the midpoint and then reduces in a single final step", "The trunk is progressively reduced after each takeoff to maintain a relatively constant velocity", "The trunk gradually increases in size to compensate for accumulated friction along the total run", "The trunk is reduced only at the end of the run in a single transition calculated by the last branch flow"],
    explanation_en: "The trunk reduction method reduces the main duct after each takeoff as the CFM decreases, maintaining relatively constant velocity and optimizing material."
  },
    {
      category: "Manual D de ACCA",
      q: "En Manual D, ¿cómo se determina el recorrido crítico (critical path) del sistema de ductos para el cálculo de presión?",
      options: ["Es el tramo más corto del sistema porque tiene la velocidad más alta y mayor pérdida por pie de ducto", "Es el recorrido desde el equipo hasta el difusor más alejado con la mayor pérdida total de presión acumulada", "Es el tramo que conecta el retorno principal con el filtro porque ahí ocurre la mayor caída de presión siempre", "Es el ducto con el diámetro más pequeño del sistema porque genera la mayor restricción al flujo de aire total"],
      correct: 1,
      explanation: "El recorrido crítico es la ruta desde el equipo hasta el difusor más lejano que tiene la mayor longitud equivalente total (mayor pérdida de presión acumulada), determinando el presupuesto de presión."
    ,
    question_en: "In Manual D, how is the critical path of the duct system determined for the pressure calculation?",
    options_en: ["It is the shortest run of the system because it has the highest velocity and greatest loss per foot of duct", "It is the path from the equipment to the most distant diffuser with the greatest total accumulated pressure loss", "It is the run connecting the main return to the filter because that is where the greatest pressure drop always occurs", "It is the duct with the smallest diameter in the system because it generates the greatest total airflow restriction"],
    explanation_en: "The critical path is the route from the equipment to the most distant diffuser that has the greatest total equivalent length (greatest accumulated pressure loss), determining the pressure budget."
  },
    {
      category: "Manual D de ACCA",
      q: "¿Por qué Manual D recomienda que la velocidad en los ramales de suministro residenciales no exceda los 600 FPM?",
      options: ["Porque velocidades mayores causan vibración excesiva en las conexiones del ducto flexible con el registro", "Porque a más de 600 FPM el ruido generado por el aire se vuelve audible e inaceptable en espacios habitados", "Porque velocidades superiores crean presión positiva en la habitación que dificulta el cierre de las puertas", "Porque el ducto flexible colapsa internamente cuando la velocidad supera ese límite por la presión negativa"],
      correct: 1,
      explanation: "Manual D limita la velocidad en ramales a 600 FPM principalmente por control de ruido. Velocidades mayores generan ruido aerodinámico audible que afecta el confort acústico residencial."
    ,
    question_en: "Why does Manual D recommend that velocity in residential supply branches not exceed 600 FPM?",
    options_en: ["Because higher velocities cause excessive vibration in the flexible duct connections with the register", "Because above 600 FPM the noise generated by the air becomes audible and unacceptable in occupied spaces", "Because higher velocities create positive pressure in the room that makes it difficult to close doors", "Because flexible duct collapses internally when velocity exceeds that limit due to negative pressure"],
    explanation_en: "Manual D limits branch velocity to 600 FPM primarily for noise control. Higher velocities generate audible aerodynamic noise that affects residential acoustic comfort."
  },
    {
      category: "Manual D de ACCA",
      q: "Según Manual D, ¿cuánta presión estática típicamente consume un filtro estándar de 1 pulgada MERV-8 cuando está limpio?",
      options: ["Aproximadamente 0.05 pulgadas de columna de agua a través del filtro limpio con flujo nominal de diseño", "Aproximadamente 0.10 pulgadas de columna de agua a través del filtro limpio con flujo nominal de diseño", "Aproximadamente 0.25 pulgadas de columna de agua a través del filtro limpio con flujo nominal de diseño", "Aproximadamente 0.40 pulgadas de columna de agua a través del filtro limpio con flujo nominal de diseño"],
      correct: 1,
      explanation: "Un filtro estándar de 1 pulgada MERV-8 limpio consume aproximadamente 0.10 IWC a flujo nominal. Esta caída aumenta significativamente conforme el filtro se ensucia."
    ,
    question_en: "According to Manual D, how much static pressure does a standard 1-inch MERV-8 filter typically consume when clean?",
    options_en: ["Approximately 0.05 inches of water column across the clean filter at nominal design flow", "Approximately 0.10 inches of water column across the clean filter at nominal design flow", "Approximately 0.25 inches of water column across the clean filter at nominal design flow", "Approximately 0.40 inches of water column across the clean filter at nominal design flow"],
    explanation_en: "A standard clean 1-inch MERV-8 filter consumes approximately 0.10 IWC at nominal flow. This pressure drop increases significantly as the filter gets dirty."
  },
    {
      category: "Manual D de ACCA",
      q: "En Manual D, ¿cuál es la consecuencia principal de usar ducto flexible con exceso de longitud y sin estirar completamente?",
      options: ["El ducto se llena de condensación interna porque las ondulaciones atrapan humedad del aire acondicionado", "La resistencia al flujo aumenta drásticamente porque las corrugas comprimidas incrementan la fricción interna", "El aislamiento exterior se degrada prematuramente por el estrés mecánico de las curvas innecesarias creadas", "El aire de suministro se calienta en exceso porque el ducto comprimido tiene menor valor R de aislamiento"],
      correct: 1,
      explanation: "El ducto flexible sin estirar tiene corrugas comprimidas que aumentan enormemente la fricción interna, pudiendo triplicar o cuadruplicar la pérdida de presión respecto al ducto completamente estirado."
    ,
    question_en: "In Manual D, what is the main consequence of using flexible duct with excess length without stretching it completely?",
    options_en: ["The duct fills with internal condensation because the corrugations trap moisture from the conditioned air", "Airflow resistance increases drastically because the compressed corrugations increase internal friction", "The exterior insulation degrades prematurely from the mechanical stress of unnecessary bends created", "The supply air heats up excessively because the compressed duct has a lower insulation R-value"],
    explanation_en: "Unstretched flexible duct has compressed corrugations that enormously increase internal friction, potentially tripling or quadrupling the pressure loss compared to fully stretched duct."
  },
    {
      category: "Manual D de ACCA",
      q: "¿Qué establece Manual D sobre el tamaño mínimo recomendado para el ducto de retorno en relación con el ducto de suministro?",
      options: ["El retorno debe ser exactamente del mismo tamaño que el ducto de suministro principal para equilibrar el flujo", "El retorno debe ser al menos un tamaño comercial mayor que el suministro para compensar la menor cantidad de ductos", "El retorno debe ser exactamente la mitad del tamaño del suministro porque solo maneja recirculación parcial del aire", "El retorno debe ser dos tamaños comerciales menor que el suministro porque opera a mayor presión negativa estática"],
      correct: 1,
      explanation: "Manual D recomienda que el retorno sea al menos un tamaño mayor que el suministro porque típicamente hay menos ductos de retorno, requiriendo mayor área para manejar el mismo volumen de aire."
    ,
    question_en: "What does Manual D establish about the minimum recommended size for the return duct in relation to the supply duct?",
    options_en: ["The return must be exactly the same size as the main supply duct to balance the airflow", "The return must be at least one commercial size larger than the supply to compensate for fewer ducts", "The return must be exactly half the size of the supply because it only handles partial air recirculation", "The return must be two commercial sizes smaller than the supply because it operates at higher negative static pressure"],
    explanation_en: "Manual D recommends that the return be at least one size larger than the supply because there are typically fewer return ducts, requiring more area to handle the same volume of air."
  },
    {
      category: "Manual D de ACCA",
      q: "Según Manual D, ¿cuál es el efecto de instalar un damper de balanceo en cada ramal del sistema de suministro de ductos?",
      options: ["Aumenta la presión estática total del sistema requiriendo un ventilador de mayor capacidad y consumo eléctrico", "Permite ajustar el flujo de aire a cada habitación para lograr el balance correcto según el diseño de cargas", "Reduce la velocidad del aire en todos los ramales de forma uniforme mejorando la eficiencia total del sistema", "Elimina la necesidad de dimensionar correctamente cada ramal porque el damper compensa cualquier error de diseño"],
      correct: 1,
      explanation: "Los dampers de balanceo permiten ajustar el CFM a cada habitación para que coincida con los requisitos calculados por Manual J, compensando variaciones menores del diseño teórico."
    ,
    question_en: "According to Manual D, what is the effect of installing a balancing damper in each branch of the supply duct system?",
    options_en: ["It increases the total system static pressure requiring a higher capacity fan with greater electrical consumption", "It allows adjusting airflow to each room to achieve the correct balance according to the load design", "It reduces air velocity in all branches uniformly improving the total system efficiency", "It eliminates the need to correctly size each branch because the damper compensates for any design error"],
    explanation_en: "Balancing dampers allow adjusting the CFM to each room to match the requirements calculated by Manual J, compensating for minor variations from the theoretical design."
  },
    {
      category: "Manual S de ACCA",
      q: "Según Manual S, ¿cuál es el rango aceptable para dimensionar un equipo de enfriamiento respecto a la carga sensible calculada con Manual J?",
      options: ["El equipo debe tener entre 80% y 100% de la carga sensible total calculada para evitar sobredimensionamiento", "El equipo debe tener entre 90% y 115% de la carga sensible total calculada para un rendimiento correcto balance", "El equipo debe tener entre 100% y 125% de la carga sensible total calculada según las tablas de selección AHRI", "El equipo debe tener entre 115% y 140% de la carga sensible total calculada para garantizar capacidad de reserva"],
      correct: 1,
      explanation: "Manual S establece que la capacidad sensible del equipo debe estar entre 90% y 115% de la carga sensible de Manual J. Exceder 115% causa ciclos cortos y pobre deshumidificación."
    ,
    question_en: "According to Manual S, what is the acceptable range for sizing cooling equipment relative to the sensible load calculated with Manual J?",
    options_en: ["The equipment must have between 80% and 100% of the total calculated sensible load to avoid oversizing", "The equipment must have between 90% and 115% of the total calculated sensible load for correct performance balance", "The equipment must have between 100% and 125% of the total calculated sensible load per AHRI selection tables", "The equipment must have between 115% and 140% of the total calculated sensible load to guarantee reserve capacity"],
    explanation_en: "Manual S establishes that the equipment sensible capacity must be between 90% and 115% of the Manual J sensible load. Exceeding 115% causes short cycling and poor dehumidification."
  },
    {
      category: "Manual S de ACCA",
      q: "¿Por qué Manual S requiere usar datos de rendimiento AHRI expandidos en lugar de solo la capacidad nominal del equipo para la selección?",
      options: ["Porque la capacidad nominal solo es válida a la altitud del nivel del mar y debe corregirse para otras elevaciones", "Porque el rendimiento real varía según las condiciones de temperatura exterior e interior del proyecto específico", "Porque los datos nominales incluyen la capacidad del calentador auxiliar que no debe sumarse al enfriamiento total", "Porque la eficiencia SEER nominal no refleja el consumo eléctrico real del ventilador del evaporador interior"],
      correct: 1,
      explanation: "Los datos AHRI expandidos muestran el rendimiento a múltiples condiciones de temperatura. La capacidad nominal (95°F exterior, 80°F/67°F interior) raramente coincide con las condiciones de diseño reales."
    ,
    question_en: "Why does Manual S require using expanded AHRI performance data instead of just the nominal equipment capacity for selection?",
    options_en: ["Because the nominal capacity is only valid at sea level altitude and must be corrected for other elevations", "Because real performance varies according to the specific outdoor and indoor temperature conditions of the project", "Because nominal data includes auxiliary heater capacity that should not be added to the total cooling", "Because the nominal SEER efficiency does not reflect the actual electrical consumption of the indoor evaporator fan"],
    explanation_en: "Expanded AHRI data shows performance at multiple temperature conditions. The nominal capacity (95°F outdoor, 80°F/67°F indoor) rarely matches actual design conditions."
  },
    {
      category: "Manual S de ACCA",
      q: "En Manual S, ¿qué problema ocurre cuando se selecciona un equipo cuya capacidad latente excede significativamente la carga latente calculada?",
      options: ["El evaporador se congela porque remueve demasiada humedad y la temperatura del refrigerante cae bajo el rocío", "El equipo sobreenfría el espacio generando quejas de frío excesivo y condensación visible en las superficies", "No ocurre ningún problema porque el exceso de capacidad latente simplemente se convierte en enfriamiento sensible", "El compresor se sobrecarga eléctricamente porque la remoción de humedad requiere mayor consumo de amperaje total"],
      correct: 2,
      explanation: "Cuando la capacidad latente excede la carga latente, el exceso no causa problemas directos ya que se redistribuye como enfriamiento sensible. El problema real es cuando la latente es insuficiente."
    ,
    question_en: "In Manual S, what problem occurs when equipment is selected whose latent capacity significantly exceeds the calculated latent load?",
    options_en: ["The evaporator freezes because it removes too much moisture and the refrigerant temperature drops below dew point", "The equipment overcools the space generating complaints of excessive cold and visible condensation on surfaces", "No problem occurs because excess latent capacity simply converts to sensible cooling", "The compressor becomes electrically overloaded because moisture removal requires greater total amperage consumption"],
    explanation_en: "When latent capacity exceeds the latent load, the excess does not cause direct problems as it redistributes as sensible cooling. The real problem is when latent capacity is insufficient."
  },
    {
      category: "Manual S de ACCA",
      q: "Según Manual S, ¿cuál es la importancia de verificar el match entre el condensador exterior y el evaporador interior según las tablas AHRI?",
      options: ["Solo es importante para validar la garantía del fabricante pero no afecta el rendimiento real del sistema", "Determina la capacidad real, eficiencia y rendimiento del sistema que puede diferir mucho de los valores nominales", "Únicamente afecta el nivel de ruido del sistema porque componentes no emparejados vibran a frecuencias diferentes", "Solo importa para sistemas con refrigerante R-410A porque el R-22 es compatible con cualquier combinación de equipos"],
      correct: 1,
      explanation: "El match AHRI entre condensador y evaporador determina la capacidad total, sensible, latente y la eficiencia real del sistema. Combinaciones no listadas pueden rendir muy diferente a lo esperado."
    ,
    question_en: "According to Manual S, what is the importance of verifying the match between the outdoor condenser and indoor evaporator per AHRI tables?",
    options_en: ["It is only important for validating the manufacturer's warranty but does not affect actual system performance", "It determines the actual capacity, efficiency, and system performance which can differ greatly from nominal values", "It only affects the system noise level because unmatched components vibrate at different frequencies", "It only matters for R-410A refrigerant systems because R-22 is compatible with any equipment combination"],
    explanation_en: "The AHRI match between condenser and evaporator determines the actual total, sensible, latent capacity and real system efficiency. Unlisted combinations may perform very differently than expected."
  },
    {
      category: "Manual S de ACCA",
      q: "¿Qué indica Manual S sobre seleccionar un equipo de calefacción con bomba de calor para climas con temperaturas de diseño por debajo de 30°F?",
      options: ["La bomba de calor es inadecuada y debe usarse exclusivamente un sistema de calefacción con horno de combustión", "La bomba de calor necesitará calor suplementario y se debe verificar el punto de balance térmico del sistema", "La bomba de calor debe sobredimensionarse al 150% de la carga para compensar la pérdida de capacidad a baja temp", "La bomba de calor funciona igual que a temperaturas moderadas porque el ciclo de reversa no pierde eficiencia"],
      correct: 1,
      explanation: "Manual S requiere verificar el punto de balance (donde la capacidad de la bomba iguala la carga) y dimensionar el calor suplementario (resistencias eléctricas) para temperaturas por debajo de ese punto."
    ,
    question_en: "What does Manual S indicate about selecting a heat pump heating system for climates with design temperatures below 30°F?",
    options_en: ["The heat pump is inadequate and a combustion furnace heating system must be used exclusively", "The heat pump will need supplemental heat and the system thermal balance point must be verified", "The heat pump must be oversized to 150% of the load to compensate for capacity loss at low temperatures", "The heat pump works the same as at moderate temperatures because the reverse cycle does not lose efficiency"],
    explanation_en: "Manual S requires verifying the balance point (where the pump capacity equals the load) and sizing supplemental heat (electric resistance heaters) for temperatures below that point."
  },
    {
      category: "Manual S de ACCA",
      q: "En Manual S, ¿cómo se ajusta la capacidad de un equipo de aire acondicionado cuando la instalación está a una altitud mayor de 2,500 pies?",
      options: ["La capacidad sensible aumenta porque el aire menos denso se enfría más rápido al pasar por el evaporador", "La capacidad del equipo no cambia con la altitud porque el ciclo de refrigeración es un sistema completamente cerrado", "Se aplica un factor de corrección que reduce la capacidad del lado de aire por la menor densidad del aire exterior", "Se incrementa el tamaño del ducto pero se mantiene la misma capacidad nominal del equipo seleccionado según AHRI"],
      correct: 2,
      explanation: "A mayor altitud, la densidad del aire disminuye, reduciendo la capacidad de transferencia de calor del lado de aire. Manual S aplica factores de corrección por altitud para ajustar la capacidad real."
    ,
    question_en: "In Manual S, how is the capacity of air conditioning equipment adjusted when the installation is at an altitude above 2,500 feet?",
    options_en: ["Sensible capacity increases because less dense air cools faster when passing through the evaporator", "Equipment capacity does not change with altitude because the refrigeration cycle is a completely closed system", "A correction factor is applied that reduces air-side capacity due to the lower density of outdoor air", "The duct size is increased but the same nominal equipment capacity selected per AHRI is maintained"],
    explanation_en: "At higher altitude, air density decreases, reducing air-side heat transfer capacity. Manual S applies altitude correction factors to adjust the actual capacity."
  },
    {
      category: "Manual S de ACCA",
      q: "Según Manual S, ¿cuál es la consecuencia de seleccionar un equipo con una relación sensible-total (S/T) significativamente mayor que la del proyecto?",
      options: ["El equipo proporciona enfriamiento sensible adecuado pero remueve insuficiente humedad del espacio interior", "El equipo consume más electricidad porque necesita operar ciclos más largos para alcanzar la temperatura deseada", "El equipo enfría el espacio demasiado rápido causando estratificación vertical severa de la temperatura interior", "El equipo genera más ruido porque el ventilador debe operar a mayor velocidad para compensar la diferencia"],
      correct: 0,
      explanation: "Un equipo con S/T mayor que la requerida tiene proporcionalmente menos capacidad latente, resultando en control inadecuado de humedad aunque satisfaga la carga sensible."
    ,
    question_en: "According to Manual S, what is the consequence of selecting equipment with a sensible-to-total ratio (S/T) significantly higher than the project requires?",
    options_en: ["The equipment provides adequate sensible cooling but removes insufficient moisture from the indoor space", "The equipment consumes more electricity because it needs to run longer cycles to reach the desired temperature", "The equipment cools the space too quickly causing severe vertical temperature stratification of indoor air", "The equipment generates more noise because the fan must operate at higher speed to compensate for the difference"],
    explanation_en: "Equipment with a higher S/T ratio than required has proportionally less latent capacity, resulting in inadequate humidity control even though it satisfies the sensible load."
  },
    {
      category: "Manual S de ACCA",
      q: "¿Cuál es el procedimiento correcto de Manual S cuando la carga de Manual J cae exactamente entre dos tamaños disponibles de equipo?",
      options: ["Siempre se selecciona el equipo de mayor capacidad para garantizar un margen de seguridad adecuado en diseño", "Se elige el equipo más pequeño si su capacidad sensible cubre al menos el 90% de la carga sensible calculada", "Se promedian las capacidades de ambos equipos y se selecciona el que esté más cerca del promedio obtenido", "Se contacta al fabricante para solicitar un equipo de capacidad intermedia personalizada según la carga exacta"],
      correct: 1,
      explanation: "Manual S favorece el equipo más pequeño siempre que su capacidad sensible cubra al menos el 90% de la carga sensible de Manual J, para evitar los problemas del sobredimensionamiento."
    ,
    question_en: "What is the correct Manual S procedure when the Manual J load falls exactly between two available equipment sizes?",
    options_en: ["Always select the larger capacity equipment to guarantee an adequate design safety margin", "Choose the smaller equipment if its sensible capacity covers at least 90% of the calculated sensible load", "Average the capacities of both units and select the one closest to the calculated average", "Contact the manufacturer to request a custom intermediate capacity unit based on the exact load"],
    explanation_en: "Manual S favors the smaller equipment as long as its sensible capacity covers at least 90% of the Manual J sensible load, to avoid the problems of oversizing."
  },
    {
      category: "Manual S de ACCA",
      q: "En Manual S, ¿por qué es importante considerar el flujo de aire del evaporador (CFM) al seleccionar el equipo y no solo las BTU?",
      options: ["Porque el CFM determina la velocidad del refrigerante en la línea de succión y afecta el retorno de aceite", "Porque el CFM del equipo debe coincidir con el diseño de ductos de Manual D para lograr el balance de flujo", "Porque un CFM mayor siempre produce mejor deshumidificación independientemente de la capacidad del equipo total", "Porque el CFM solo importa para el cálculo de la caída de presión del filtro y no afecta la capacidad real"],
      correct: 1,
      explanation: "El CFM del equipo seleccionado debe ser compatible con el diseño de ductos de Manual D. Un desajuste significativo causa problemas de distribución de aire y rendimiento del sistema."
    ,
    question_en: "In Manual S, why is it important to consider the evaporator airflow (CFM) when selecting equipment and not just the BTUs?",
    options_en: ["Because the CFM determines the refrigerant velocity in the suction line and affects oil return", "Because the equipment CFM must match the Manual D duct design to achieve proper airflow balance", "Because a higher CFM always produces better dehumidification regardless of the total equipment capacity", "Because the CFM only matters for calculating filter pressure drop and does not affect actual capacity"],
    explanation_en: "The selected equipment CFM must be compatible with the Manual D duct design. A significant mismatch causes air distribution problems and system performance issues."
  },
    {
      category: "Manual S de ACCA",
      q: "Según Manual S, ¿qué datos específicos se necesitan del fabricante para seleccionar correctamente un sistema split de dos etapas?",
      options: ["Solo la capacidad nominal en etapa alta porque la etapa baja siempre es exactamente el 67% de la capacidad total", "Las capacidades sensible y latente en ambas etapas a las condiciones de diseño específicas del proyecto evaluado", "Únicamente el SEER combinado de ambas etapas porque ese valor ya incluye el rendimiento en todas las condiciones", "Solo la capacidad en etapa baja porque el equipo operará la mayoría del tiempo en esa etapa para ahorrar energía"],
      correct: 1,
      explanation: "Manual S requiere datos de capacidad sensible y latente para AMBAS etapas a las condiciones de diseño del proyecto, ya que la etapa baja no es siempre un porcentaje fijo de la alta."
    ,
    question_en: "According to Manual S, what specific data is needed from the manufacturer to correctly select a two-stage split system?",
    options_en: ["Only the nominal capacity at high stage because low stage is always exactly 67% of total capacity", "The sensible and latent capacities at both stages at the specific design conditions of the evaluated project", "Only the combined SEER of both stages because that value already includes performance at all conditions", "Only the low-stage capacity because the equipment will operate most of the time at that stage to save energy"],
    explanation_en: "Manual S requires sensible and latent capacity data for BOTH stages at the project's design conditions, since the low stage is not always a fixed percentage of the high stage."
  },
    {
      category: "Manual S de ACCA",
      q: "¿Qué especifica Manual S sobre la selección de la velocidad del ventilador del evaporador para optimizar la deshumidificación?",
      options: ["Aumentar la velocidad del ventilador al máximo para mover más aire a través del serpentín y remover más humedad", "Reducir la velocidad del ventilador baja la temperatura del serpentín y aumenta la remoción de humedad por pasada", "Mantener la velocidad del ventilador exactamente a 400 CFM por tonelada sin importar las condiciones del proyecto", "La velocidad del ventilador no tiene ningún efecto sobre la deshumidificación porque eso depende solo del refrigerante"],
      correct: 1,
      explanation: "Manual S indica que reducir el CFM/tonelada (velocidad más baja) disminuye la temperatura del serpentín, aumentando la deshumidificación porque más humedad condensa en la superficie más fría."
    ,
    question_en: "What does Manual S specify about selecting the evaporator fan speed to optimize dehumidification?",
    options_en: ["Increase fan speed to maximum to move more air through the coil and remove more moisture", "Reducing fan speed lowers the coil temperature and increases moisture removal per pass", "Maintain fan speed at exactly 400 CFM per ton regardless of the project conditions", "Fan speed has no effect on dehumidification because that depends only on the refrigerant"],
    explanation_en: "Manual S indicates that reducing CFM/ton (lower speed) decreases the coil temperature, increasing dehumidification because more moisture condenses on the colder surface."
  },
    {
      category: "Manual S de ACCA",
      q: "En Manual S, ¿cuál es la implicación de seleccionar un equipo cuya capacidad total a condiciones de diseño es un 130% de la carga total?",
      options: ["Es aceptable porque Manual S permite hasta 140% de sobredimensionamiento para compensar degradación futura", "Es inaceptable porque excede el límite de 115% y causará ciclos cortos con pobre control de humedad interior", "Es óptimo porque proporciona suficiente reserva para días extremos que excedan las condiciones de diseño normales", "Es aceptable solo si el sistema tiene velocidad variable que pueda modular la capacidad hasta el nivel necesario"],
      correct: 1,
      explanation: "Manual S limita el sobredimensionamiento a 115% de la carga sensible. Un 130% causa ciclos cortos excesivos, pobre deshumidificación y desgaste prematuro del compresor."
    ,
    question_en: "In Manual S, what is the implication of selecting equipment whose total capacity at design conditions is 130% of the total load?",
    options_en: ["It is acceptable because Manual S allows up to 140% oversizing to compensate for future degradation", "It is unacceptable because it exceeds the 115% limit and will cause short cycling with poor indoor humidity control", "It is optimal because it provides sufficient reserve for extreme days that exceed normal design conditions", "It is acceptable only if the system has variable speed that can modulate capacity to the necessary level"],
    explanation_en: "Manual S limits oversizing to 115% of the sensible load. 130% causes excessive short cycling, poor dehumidification, and premature compressor wear."
  },
    {
      category: "Manual T de ACCA",
      q: "Según Manual T, ¿cuál es el criterio principal para seleccionar el tamaño correcto de un difusor de suministro para una habitación residencial?",
      options: ["El nivel de ruido máximo permitido medido en decibelios a una distancia de tres pies del difusor instalado", "El throw del difusor debe alcanzar la pared opuesta con velocidad terminal adecuada para cubrir la zona ocupada", "El área libre del difusor debe ser al menos el 80% del área del ducto que lo alimenta para reducir la restricción", "La estética del difusor debe complementar el diseño interior según las preferencias del propietario de la casa"],
      correct: 1,
      explanation: "Manual T selecciona difusores primariamente por el throw (alcance), que debe cubrir la zona ocupada con velocidad terminal de 50-75 FPM para asegurar distribución uniforme sin corrientes molestas."
    ,
    question_en: "According to Manual T, what is the primary criterion for selecting the correct size supply diffuser for a residential room?",
    options_en: ["The maximum allowable noise level measured in decibels at a distance of three feet from the installed diffuser", "The diffuser throw must reach the opposite wall with adequate terminal velocity to cover the occupied zone", "The free area of the diffuser must be at least 80% of the duct area feeding it to reduce restriction", "The aesthetics of the diffuser must complement the interior design according to the homeowner's preferences"],
    explanation_en: "Manual T selects diffusers primarily by throw (reach), which must cover the occupied zone with a terminal velocity of 50-75 FPM to ensure uniform distribution without bothersome drafts."
  },
    {
      category: "Manual T de ACCA",
      q: "En Manual T, ¿qué significa la velocidad terminal de un difusor y cuál es el valor recomendado para aplicaciones residenciales?",
      options: ["Es la velocidad del aire al salir del difusor, que debe ser máximo 300 FPM para evitar ruido excesivo en la sala", "Es la velocidad del aire al entrar al ducto del difusor, que debe ser mínimo 500 FPM para mantener flujo turbulento", "Es la velocidad del aire al final del throw donde el chorro pierde energía, recomendada entre 50 y 75 FPM para confort", "Es la velocidad máxima del aire medida en el centro del chorro, que debe ser exactamente 150 FPM en todo momento"],
      correct: 2,
      explanation: "La velocidad terminal es la velocidad del aire al final del throw, donde el chorro se ha desacelerado. Manual T recomienda 50-75 FPM como velocidad terminal para confort en residencias."
    ,
    question_en: "In Manual T, what does the terminal velocity of a diffuser mean and what is the recommended value for residential applications?",
    options_en: ["It is the air velocity leaving the diffuser, which must be maximum 300 FPM to avoid excessive noise in the room", "It is the air velocity entering the diffuser duct, which must be minimum 500 FPM to maintain turbulent flow", "It is the air velocity at the end of the throw where the jet loses energy, recommended between 50 and 75 FPM for comfort", "It is the maximum air velocity measured at the center of the jet, which must be exactly 150 FPM at all times"],
    explanation_en: "Terminal velocity is the air velocity at the end of the throw, where the jet has decelerated. Manual T recommends 50-75 FPM as terminal velocity for residential comfort."
  },
    {
      category: "Manual T de ACCA",
      q: "¿Qué factor de Manual T se debe considerar cuando se instala un difusor de techo para suministro de aire frío en modo de enfriamiento?",
      options: ["El spread del difusor debe ser mínimo para dirigir el aire frío directamente hacia la zona ocupada de la habitación", "El efecto Coanda mantiene el aire pegado al techo, y el throw debe ajustarse para que el aire descienda correctamente", "La distancia entre el difusor y la lámpara más cercana debe ser mayor a 24 pulgadas por código eléctrico vigente", "El difusor debe instalarse con un ángulo de 15 grados hacia la pared norte para compensar la ganancia solar opuesta"],
      correct: 1,
      explanation: "El efecto Coanda hace que el aire se adhiera al techo. Para enfriamiento, el aire frío (más denso) tiende a caer, pero el throw debe ser suficiente para que el chorro se mezcle antes de descender."
    ,
    question_en: "What Manual T factor must be considered when installing a ceiling diffuser for cold air supply in cooling mode?",
    options_en: ["The diffuser spread must be minimal to direct cold air directly toward the occupied zone of the room", "The Coanda effect keeps the air attached to the ceiling, and the throw must be adjusted so the air descends correctly", "The distance between the diffuser and the nearest light fixture must be greater than 24 inches per electrical code", "The diffuser must be installed at a 15-degree angle toward the north wall to compensate for opposing solar gain"],
    explanation_en: "The Coanda effect causes air to adhere to the ceiling. For cooling, cold air (denser) tends to fall, but the throw must be sufficient for the jet to mix before descending."
  },
    {
      category: "Manual T de ACCA",
      q: "Según Manual T, ¿cuál es el nivel de ruido máximo recomendado (NC rating) para difusores instalados en dormitorios residenciales?",
      options: ["NC-35 o menor para dormitorios ya que es un área donde se requiere ambiente silencioso para el descanso", "NC-25 o menor para dormitorios ya que es un área donde se requiere ambiente silencioso para el descanso", "NC-45 o menor para dormitorios ya que el ruido de fondo ambiental enmascara el sonido del difusor de suministro", "NC-15 o menor para dormitorios porque cualquier sonido audible del sistema HVAC perturba la calidad del sueño"],
      correct: 1,
      explanation: "Manual T recomienda NC-25 o menor para dormitorios residenciales. Niveles de ruido superiores pueden perturbar el sueño y causar quejas de los ocupantes sobre el sistema."
    ,
    question_en: "According to Manual T, what is the maximum recommended noise level (NC rating) for diffusers installed in residential bedrooms?",
    options_en: ["NC-35 or lower for bedrooms since it is an area where a quiet environment is required for rest", "NC-25 or lower for bedrooms since it is an area where a quiet environment is required for rest", "NC-45 or lower for bedrooms since ambient background noise masks the sound of the supply diffuser", "NC-15 or lower for bedrooms because any audible sound from the HVAC system disturbs sleep quality"],
    explanation_en: "Manual T recommends NC-25 or lower for residential bedrooms. Higher noise levels can disturb sleep and cause occupant complaints about the system."
  },
    {
      category: "Manual T de ACCA",
      q: "En Manual T, ¿qué es el spread de un difusor y cómo afecta la selección para una habitación larga y angosta?",
      options: ["Es la distancia vertical que el aire desciende desde el difusor; en habitaciones angostas se necesita mayor spread", "Es el ángulo de dispersión lateral del chorro de aire; en habitaciones angostas se prefiere un spread reducido", "Es la velocidad promedio del aire a la mitad del throw; en habitaciones angostas debe ser mayor para mejor alcance", "Es la presión estática mínima necesaria para operar el difusor; en habitaciones angostas se requiere menor presión"],
      correct: 1,
      explanation: "El spread es el ángulo de dispersión lateral del chorro de aire. Para habitaciones angostas, se selecciona un difusor con spread reducido para dirigir el aire a lo largo sin desperdiciar energía lateralmente."
    ,
    question_en: "In Manual T, what is the spread of a diffuser and how does it affect selection for a long narrow room?",
    options_en: ["It is the vertical distance that air descends from the diffuser; in narrow rooms greater spread is needed", "It is the lateral dispersion angle of the air jet; in narrow rooms a reduced spread is preferred", "It is the average air velocity at mid-throw; in narrow rooms it must be greater for better reach", "It is the minimum static pressure needed to operate the diffuser; in narrow rooms less pressure is required"],
    explanation_en: "Spread is the lateral dispersion angle of the air jet. For narrow rooms, a diffuser with reduced spread is selected to direct air along the length without wasting energy laterally."
  },
    {
      category: "Manual T de ACCA",
      q: "¿Por qué Manual T recomienda evitar difusores de suministro que dirijan el aire directamente sobre la zona ocupada en modo de calefacción?",
      options: ["Porque el aire caliente directo causa sequedad excesiva en la piel y mucosas de los ocupantes sentados debajo", "Porque el aire caliente tiende a subir y el chorro directo crea corrientes incómodas con velocidades perceptibles", "Porque la temperatura del aire de suministro puede causar daño al mobiliario si impacta directamente sobre la madera", "Porque el aire caliente directo genera electricidad estática en la ropa y alfombras creando descargas desagradables"],
      correct: 1,
      explanation: "El aire caliente de suministro a alta velocidad sobre ocupantes crea corrientes perceptibles e incómodas. Manual T recomienda que el aire se mezcle con el aire ambiente antes de alcanzar la zona ocupada."
    ,
    question_en: "Why does Manual T recommend avoiding supply diffusers that direct air directly over the occupied zone in heating mode?",
    options_en: ["Because direct hot air causes excessive dryness in the skin and mucous membranes of occupants seated below", "Because hot air tends to rise and the direct jet creates uncomfortable drafts with perceptible velocities", "Because the supply air temperature can cause damage to furniture if it impacts directly on wood surfaces", "Because direct hot air generates static electricity in clothing and carpets creating unpleasant discharges"],
    explanation_en: "High-velocity warm supply air over occupants creates perceptible and uncomfortable drafts. Manual T recommends that air mix with room air before reaching the occupied zone."
  },
    {
      category: "Manual T de ACCA",
      q: "Según Manual T, ¿cuál es la diferencia principal entre un registro (register) y una rejilla (grille) en la terminología de distribución de aire?",
      options: ["El registro tiene un damper integral para control de flujo mientras que la rejilla es simplemente una cubierta fija", "El registro se usa exclusivamente para suministro y la rejilla solamente para retorno en todas las instalaciones", "El registro tiene aletas ajustables para direccionar el flujo y la rejilla tiene aletas fijas en una sola dirección", "El registro es de metal y la rejilla es de plástico según las especificaciones de materiales de Manual T vigente"],
      correct: 0,
      explanation: "La diferencia principal es que un registro incluye un damper (compuerta) integral para regular el flujo de aire, mientras que una rejilla es simplemente una cubierta decorativa sin control de flujo."
    ,
    question_en: "According to Manual T, what is the main difference between a register and a grille in air distribution terminology?",
    options_en: ["A register has an integral damper for flow control while a grille is simply a fixed cover", "A register is used exclusively for supply and a grille only for return in all installations", "A register has adjustable louvers to direct flow and a grille has fixed louvers in a single direction", "A register is made of metal and a grille is made of plastic per Manual T material specifications"],
    explanation_en: "The main difference is that a register includes an integral damper to regulate airflow, while a grille is simply a decorative cover without flow control."
  },
    {
      category: "Manual T de ACCA",
      q: "En Manual T, ¿qué sucede cuando el throw de un difusor de pared lateral es significativamente menor que la distancia a la pared opuesta?",
      options: ["Se genera una zona muerta sin circulación donde la temperatura difiere notablemente del resto de la habitación", "El aire cae al piso inmediatamente creando una alfombra de aire frío que es más eficiente para enfriamiento general", "El exceso de presión estática en la habitación causa que las puertas se abran solas por diferencial de presión", "El retorno absorbe todo el aire de suministro antes de que circule creando un cortocircuito completo del flujo"],
      correct: 0,
      explanation: "Cuando el throw es insuficiente para alcanzar la pared opuesta, se crean zonas muertas sin circulación donde la temperatura no se controla adecuadamente, causando disconfort."
    ,
    question_en: "In Manual T, what happens when the throw of a sidewall diffuser is significantly less than the distance to the opposite wall?",
    options_en: ["A dead zone without circulation is created where the temperature differs noticeably from the rest of the room", "The air falls to the floor immediately creating a cold air carpet that is more efficient for general cooling", "The excess static pressure in the room causes doors to open by themselves due to pressure differential", "The return absorbs all supply air before it circulates creating a complete airflow short circuit"],
    explanation_en: "When the throw is insufficient to reach the opposite wall, dead zones without circulation are created where the temperature is not adequately controlled, causing discomfort."
  },
    {
      category: "Manual T de ACCA",
      q: "¿Qué especifica Manual T sobre la ubicación del difusor de suministro en relación con la ventana exterior de una habitación?",
      options: ["El difusor debe ubicarse lo más lejos posible de la ventana para evitar que el aire acondicionado se desperdicie", "El difusor debe ubicarse cerca de la ventana para contrarrestar la carga térmica y lavar la superficie del vidrio", "El difusor debe ubicarse en el centro exacto del techo para distribuir el aire uniformemente hacia todas las paredes", "El difusor debe ubicarse en la pared interior opuesta a la ventana para empujar el aire caliente hacia el retorno"],
      correct: 1,
      explanation: "Manual T recomienda ubicar difusores de suministro cerca de ventanas exteriores para contrarrestar la ganancia/pérdida de calor y lavar la superficie del vidrio, mejorando el confort térmico."
    ,
    question_en: "What does Manual T specify about the location of the supply diffuser in relation to the exterior window of a room?",
    options_en: ["The diffuser should be located as far as possible from the window to avoid wasting conditioned air", "The diffuser should be located near the window to counteract the thermal load and wash the glass surface", "The diffuser should be located at the exact center of the ceiling to distribute air uniformly to all walls", "The diffuser should be located on the interior wall opposite the window to push warm air toward the return"],
    explanation_en: "Manual T recommends locating supply diffusers near exterior windows to counteract heat gain/loss and wash the glass surface, improving thermal comfort."
  },
    {
      category: "Manual T de ACCA",
      q: "Según Manual T, ¿cuántas caras de throw activo tiene un difusor de techo cuadrado de cuatro vías y cómo afecta la selección?",
      options: ["Tiene cuatro caras activas y el throw se reparte por igual, requiriendo verificar la distancia a cada pared cercana", "Tiene dos caras activas opuestas y las otras dos son decorativas sin flujo, simplificando el cálculo del throw", "Tiene una sola cara activa dirigible y las demás se bloquean con insertos para direccionar todo el flujo de aire", "Tiene tres caras activas porque una siempre se instala contra la pared y esa cara queda automáticamente bloqueada"],
      correct: 0,
      explanation: "Un difusor de techo de 4 vías tiene cuatro caras activas de throw. La selección debe verificar que el throw en cada dirección sea apropiado para la distancia a la pared correspondiente."
    ,
    question_en: "According to Manual T, how many active throw faces does a square four-way ceiling diffuser have and how does it affect selection?",
    options_en: ["It has four active faces and the throw is distributed equally, requiring verification of the distance to each nearby wall", "It has two opposite active faces and the other two are decorative without flow, simplifying the throw calculation", "It has a single directional active face and the others are blocked with inserts to direct all airflow", "It has three active faces because one is always installed against the wall and that face is automatically blocked"],
    explanation_en: "A four-way ceiling diffuser has four active throw faces. Selection must verify that the throw in each direction is appropriate for the distance to the corresponding wall."
  },
    {
      category: "Manual T de ACCA",
      q: "En Manual T, ¿cuál es el efecto de seleccionar un difusor con un área libre demasiado pequeña para el CFM requerido?",
      options: ["El aire sale con mayor velocidad generando más ruido y posiblemente un throw excesivo que impacta las paredes", "El flujo de aire se reduce automáticamente protegiendo al equipo de operar fuera de sus condiciones de diseño", "La presión estática en el ducto disminuye porque el aire escapa más rápido por la apertura reducida del difusor", "El aire sale a menor temperatura porque se comprime al pasar por la apertura pequeña según la ley de Bernoulli"],
      correct: 0,
      explanation: "Un difusor con área libre insuficiente para el CFM requerido fuerza el aire a salir a mayor velocidad, generando ruido excesivo (silbido) y un throw potencialmente demasiado largo."
    ,
    question_en: "In Manual T, what is the effect of selecting a diffuser with too small a free area for the required CFM?",
    options_en: ["Air exits at higher velocity generating more noise and possibly excessive throw that impacts the walls", "Airflow is automatically reduced protecting the equipment from operating outside its design conditions", "Static pressure in the duct decreases because air escapes faster through the reduced diffuser opening", "Air exits at lower temperature because it compresses when passing through the small opening per Bernoulli's law"],
    explanation_en: "A diffuser with insufficient free area for the required CFM forces air to exit at higher velocity, generating excessive noise (whistling) and a potentially too-long throw."
  },
    {
      category: "Manual T de ACCA",
      q: "¿Qué recomienda Manual T para la selección de rejillas de retorno en cuanto a la velocidad máxima del aire a través de la cara?",
      options: ["No exceder 300 FPM en rejillas de retorno ubicadas cerca del nivel del piso para minimizar ruido en espacios", "No exceder 500 FPM en rejillas de retorno ubicadas cerca del nivel del piso para minimizar ruido en espacios", "No exceder 700 FPM en rejillas de retorno ubicadas cerca del nivel del piso para minimizar ruido en espacios", "No exceder 900 FPM en rejillas de retorno ubicadas cerca del nivel del piso para minimizar ruido en espacios"],
      correct: 1,
      explanation: "Manual T recomienda no exceder 500 FPM en la cara de rejillas de retorno, especialmente las ubicadas en espacios habitados, para mantener niveles de ruido aceptables."
    ,
    question_en: "What does Manual T recommend for return grille selection regarding maximum air velocity through the face?",
    options_en: ["Not exceeding 300 FPM at return grilles located near floor level to minimize noise in spaces", "Not exceeding 500 FPM at return grilles located near floor level to minimize noise in spaces", "Not exceeding 700 FPM at return grilles located near floor level to minimize noise in spaces", "Not exceeding 900 FPM at return grilles located near floor level to minimize noise in spaces"],
    explanation_en: "Manual T recommends not exceeding 500 FPM at the face of return grilles, especially those located in occupied spaces, to maintain acceptable noise levels."
  },
    {
      category: "Manual T de ACCA",
      q: "Según Manual T, ¿por qué es preferible usar múltiples difusores pequeños en lugar de un solo difusor grande en una habitación amplia?",
      options: ["Porque los difusores pequeños son más baratos y fáciles de instalar que un difusor grande de capacidad equivalente", "Porque múltiples difusores proporcionan mejor cobertura y distribución más uniforme del aire en toda la zona ocupada", "Porque un solo difusor grande requiere un ducto de mayor diámetro que no cabe en el espacio del cielo raso típico", "Porque los difusores grandes generan vibraciones en la estructura del techo que pueden dañar el acabado de drywall"],
      correct: 1,
      explanation: "Múltiples difusores pequeños distribuyen el aire más uniformemente en la zona ocupada, eliminando zonas muertas que un solo difusor grande no puede cubrir adecuadamente."
    ,
    question_en: "According to Manual T, why is it preferable to use multiple small diffusers instead of a single large diffuser in a spacious room?",
    options_en: ["Because small diffusers are cheaper and easier to install than one large diffuser of equivalent capacity", "Because multiple diffusers provide better coverage and more uniform air distribution throughout the occupied zone", "Because a single large diffuser requires a larger diameter duct that does not fit in the typical ceiling space", "Because large diffusers generate vibrations in the ceiling structure that can damage the drywall finish"],
    explanation_en: "Multiple small diffusers distribute air more uniformly in the occupied zone, eliminating dead zones that a single large diffuser cannot adequately cover."
  },
    {
      category: "Manual T de ACCA",
      q: "En Manual T, ¿cómo afecta la altura del techo a la selección del tipo y ubicación de los difusores de suministro?",
      options: ["Techos más altos requieren difusores con menor throw porque el aire tiene más espacio para mezclarse naturalmente", "Techos más altos requieren difusores con mayor velocidad de descarga para que el aire alcance la zona ocupada abajo", "La altura del techo no afecta la selección porque el throw se mide horizontalmente desde el difusor sin considerar vertical", "Techos más altos siempre requieren difusores de piso en lugar de techo porque el aire frío no puede descender suficiente"],
      correct: 1,
      explanation: "Con techos más altos, los difusores de techo necesitan mayor velocidad de descarga o throw vertical para que el aire acondicionado alcance efectivamente la zona ocupada a nivel de piso."
    ,
    question_en: "In Manual T, how does ceiling height affect the selection of supply diffuser type and location?",
    options_en: ["Higher ceilings require diffusers with less throw because air has more space to mix naturally", "Higher ceilings require diffusers with greater discharge velocity so air reaches the occupied zone below", "Ceiling height does not affect selection because throw is measured horizontally from the diffuser without considering vertical", "Higher ceilings always require floor diffusers instead of ceiling ones because cold air cannot descend sufficiently"],
    explanation_en: "With higher ceilings, ceiling diffusers need greater discharge velocity or vertical throw so that conditioned air effectively reaches the occupied zone at floor level."
  },
    {
      category: "Casa de Bob",
      q: "En el escenario de la Casa de Bob, ¿cuál es el primer problema que un técnico debe investigar si el sistema enfría bien la planta baja pero no el segundo piso?",
      options: ["El refrigerante está bajo de carga porque las fugas siempre afectan primero a los pisos superiores del sistema", "El ducto que sube al segundo piso puede ser demasiado pequeño o tener restricciones que limiten el flujo de aire", "El termostato está ubicado en la planta baja y nunca detecta la temperatura real del segundo nivel de la vivienda", "El filtro del sistema está sucio y reduce el flujo total pero solo afecta a los ductos más largos del segundo piso"],
      correct: 1,
      explanation: "La causa más probable es un ducto subdimensionado o restringido hacia el segundo piso. El aire caliente sube naturalmente, y sin flujo adecuado de suministro, el segundo piso no puede compensar la carga."
    ,
    question_en: "In the scenario of Bob's House, what is the first problem a technician should investigate if the system cools the ground floor well but not the second floor?",
    options_en: ["The refrigerant is low on charge because leaks always affect the upper floors of the system first", "The duct going to the second floor may be too small or have restrictions that limit airflow", "The thermostat is located on the ground floor and never detects the actual temperature of the second level", "The system filter is dirty and reduces total flow but only affects the longer ducts to the second floor"],
    explanation_en: "The most likely cause is an undersized or restricted duct to the second floor. Hot air rises naturally, and without adequate supply airflow, the second floor cannot compensate for the load."
  },
    {
      category: "Casa de Bob",
      q: "Bob se queja de que algunas habitaciones están demasiado frías mientras otras están demasiado calientes. ¿Cuál es la causa MÁS probable?",
      options: ["El refrigerante del sistema está con sobrecarga y esto causa distribución desigual del enfriamiento en cada zona", "El sistema de ductos no fue diseñado correctamente con Manual D y no distribuye el flujo de aire proporcionalmente", "El equipo es demasiado pequeño y no tiene suficiente capacidad para enfriar todas las habitaciones simultáneamente", "Las ventanas de las habitaciones calientes están abiertas permitiendo la entrada de aire caliente del exterior directo"],
      correct: 1,
      explanation: "Distribución desigual de temperatura es típicamente un problema de diseño de ductos (Manual D). Ductos mal dimensionados entregan demasiado CFM a unas habitaciones y muy poco a otras."
    ,
    question_en: "Bob complains that some rooms are too cold while others are too hot. What is the MOST likely cause?",
    options_en: ["The system refrigerant is overcharged and this causes uneven cooling distribution in each zone", "The duct system was not correctly designed with Manual D and does not distribute airflow proportionally", "The equipment is too small and does not have enough capacity to cool all rooms simultaneously", "The windows in the hot rooms are open allowing hot outside air to enter directly"],
    explanation_en: "Uneven temperature distribution is typically a duct design problem (Manual D). Improperly sized ducts deliver too much CFM to some rooms and too little to others."
  },
    {
      category: "Casa de Bob",
      q: "En la Casa de Bob, el técnico mide 350 CFM en el ducto de retorno pero el equipo requiere 400 CFM por tonelada para 3 toneladas. ¿Cuál es la consecuencia?",
      options: ["El compresor funcionará con presión de succión alta causando inundación de líquido al compresor de retorno", "El serpentín del evaporador se congelará porque no hay suficiente aire para absorber el frío del refrigerante del sistema", "El sistema funcionará más eficientemente porque el aire permanece más tiempo en contacto con el serpentín evaporador", "El motor del ventilador se quemará por sobrecarga al intentar compensar la restricción del flujo insuficiente de aire"],
      correct: 1,
      explanation: "Con solo 350 CFM vs los 1,200 CFM necesarios (400x3 toneladas), el flujo de aire insuficiente causa que el serpentín baje de temperatura hasta congelarse, formando hielo que bloquea aún más el flujo."
    ,
    question_en: "In Bob's House, the technician measures 350 CFM in the return duct but the equipment requires 400 CFM per ton for 3 tons. What is the consequence?",
    options_en: ["The compressor will operate with high suction pressure causing liquid flood back to the compressor", "The evaporator coil will freeze because there is not enough air to absorb the cold from the system refrigerant", "The system will operate more efficiently because the air stays longer in contact with the evaporator coil", "The fan motor will burn out from overload trying to compensate for the insufficient airflow restriction"],
    explanation_en: "With only 350 CFM vs the 1,200 CFM needed (400x3 tons), insufficient airflow causes the coil temperature to drop until it freezes, forming ice that blocks airflow even further."
  },
    {
      category: "Casa de Bob",
      q: "Bob nota que su sistema funciona continuamente sin alcanzar la temperatura del termostato en días de calor extremo. ¿Qué debe verificar el técnico PRIMERO?",
      options: ["Verificar que las condiciones exteriores no excedan las condiciones de diseño bajo las cuales se dimensionó el equipo", "Reemplazar inmediatamente el compresor porque la operación continua indica que ha perdido capacidad por desgaste interno", "Agregar dos libras de refrigerante adicional porque la operación continua siempre significa que el sistema tiene una fuga", "Cambiar el termostato por uno digital más preciso porque el termostato mecánico antiguo tiene un diferencial muy amplio"],
      correct: 0,
      explanation: "Si las condiciones exteriores exceden las de diseño (1% de horas anuales), es normal que el sistema opere continuamente. El técnico debe verificar esto antes de buscar fallas mecánicas."
    ,
    question_en: "Bob notices his system runs continuously without reaching the thermostat temperature on extremely hot days. What should the technician check FIRST?",
    options_en: ["Verify that outdoor conditions do not exceed the design conditions under which the equipment was sized", "Immediately replace the compressor because continuous operation indicates it has lost capacity from internal wear", "Add two additional pounds of refrigerant because continuous operation always means the system has a leak", "Change the thermostat to a more precise digital one because the old mechanical thermostat has too wide a differential"],
    explanation_en: "If outdoor conditions exceed design conditions (1% of annual hours), it is normal for the system to operate continuously. The technician should verify this before looking for mechanical failures."
  },
    {
      category: "Casa de Bob",
      q: "En la Casa de Bob, se descubre que el ducto de retorno pasa por el ático sin aislamiento. ¿Cuál es el impacto principal en el rendimiento?",
      options: ["El aire de retorno se calienta en el ático aumentando la carga en el serpentín y reduciendo la capacidad efectiva del equipo", "El ducto sin aislamiento en el ático genera condensación exterior que daña el material del ducto y causa fugas de aire", "El aire de retorno se enfría en invierno y reduce la eficiencia del ciclo de calefacción solamente, sin afectar enfriamiento", "El ducto sin aislamiento no afecta el rendimiento porque el aire de retorno ya está a temperatura ambiente de la casa"],
      correct: 0,
      explanation: "El aire de retorno pasando por un ático caliente (130°F+) se calienta significativamente, aumentando la carga del evaporador y pudiendo reducir la capacidad efectiva del sistema hasta un 25-30%."
    ,
    question_en: "In Bob's House, it is discovered that the return duct passes through the attic without insulation. What is the main impact on performance?",
    options_en: ["The return air heats up in the attic increasing the coil load and reducing the effective equipment capacity", "The uninsulated duct in the attic generates exterior condensation that damages the duct material and causes air leaks", "The return air cools in winter and reduces heating cycle efficiency only, without affecting cooling", "The uninsulated duct does not affect performance because the return air is already at the house ambient temperature"],
    explanation_en: "Return air passing through a hot attic (130°F+) heats up significantly, increasing the evaporator load and potentially reducing the effective system capacity by up to 25-30%."
  },
    {
      category: "Casa de Bob",
      q: "Bob tiene un sistema de 3 toneladas pero el cálculo de Manual J muestra que solo necesita 2 toneladas. ¿Qué problemas experimentará?",
      options: ["El sistema funcionará perfectamente con mayor capacidad de reserva para los días más calurosos del año completo", "El sistema tendrá ciclos cortos con pobre deshumidificación y la casa se sentirá húmeda e incómoda en verano", "El sistema solo desperdiciará electricidad pero mantendrá la temperatura y humedad correctamente en todo momento del año", "El sistema se descompondrá más rápido únicamente porque el compresor es demasiado grande para la línea eléctrica"],
      correct: 1,
      explanation: "Un sistema sobredimensionado (3 ton vs 2 ton necesarias) causa ciclos cortos: satisface el termostato rápidamente sin remover suficiente humedad, dejando la casa húmeda e incómoda."
    ,
    question_en: "Bob has a 3-ton system but the Manual J calculation shows he only needs 2 tons. What problems will he experience?",
    options_en: ["The system will work perfectly with greater reserve capacity for the hottest days of the entire year", "The system will have short cycles with poor dehumidification and the house will feel humid and uncomfortable in summer", "The system will only waste electricity but will maintain temperature and humidity correctly at all times", "The system will break down faster solely because the compressor is too large for the electrical line"],
    explanation_en: "An oversized system (3 tons vs 2 tons needed) causes short cycling: it satisfies the thermostat quickly without removing enough humidity, leaving the house humid and uncomfortable."
  },
    {
      category: "Casa de Bob",
      q: "El técnico descubre que en la Casa de Bob, el filtro de retorno tiene un tamaño de 16x20 para un sistema de 3 toneladas. ¿Es adecuado?",
      options: ["Es adecuado porque un filtro 16x20 proporciona suficiente área libre para hasta 4 toneladas de capacidad instalada", "Es inadecuado porque un sistema de 3 toneladas necesita aproximadamente 600 pulgadas cuadradas de área de filtro mínima", "Es adecuado siempre que el filtro sea de tipo plisado con MERV-13 o superior para compensar el área más reducida", "Es inadecuado porque el filtro debería tener al menos 36x36 pulgadas para un sistema de tres toneladas según código"],
      correct: 1,
      explanation: "Una regla general es 2 pulgadas cuadradas por CFM. Para 3 toneladas (1,200 CFM), se necesitan ~600 in². Un filtro 16x20 tiene solo 320 in² de área total, generando restricción excesiva."
    ,
    question_en: "The technician discovers that in Bob's House, the return filter is 16x20 for a 3-ton system. Is it adequate?",
    options_en: ["It is adequate because a 16x20 filter provides enough free area for up to 4 tons of installed capacity", "It is inadequate because a 3-ton system needs approximately 600 square inches of minimum filter area", "It is adequate as long as the filter is a pleated type with MERV-13 or higher to compensate for the smaller area", "It is inadequate because the filter should be at least 36x36 inches for a three-ton system per code"],
    explanation_en: "A general rule is 2 square inches per CFM. For 3 tons (1,200 CFM), approximately 600 sq in are needed. A 16x20 filter has only 320 sq in of total area, generating excessive restriction."
  },
    {
      category: "Casa de Bob",
      q: "En la Casa de Bob, el técnico mide que la temperatura del aire de suministro es 58°F y la del retorno es 76°F. ¿Qué indica esto?",
      options: ["Un delta-T de 18°F indica que el sistema está funcionando correctamente dentro del rango normal de operación aceptable", "Un delta-T de 18°F indica que el sistema tiene una carga de refrigerante baja y necesita añadir refrigerante de inmediato", "Un delta-T de 18°F indica que el flujo de aire es muy bajo porque el diferencial normal debería ser solo de 10 a 12 grados", "Un delta-T de 18°F indica que el serpentín evaporador está parcialmente bloqueado por suciedad y necesita limpieza urgente"],
      correct: 0,
      explanation: "Un delta-T de 18°F (76-58) está dentro del rango normal de 15-20°F para un sistema de aire acondicionado residencial operando correctamente con flujo de aire adecuado."
    ,
    question_en: "In Bob's House, the technician measures the supply air temperature at 58°F and the return at 76°F. What does this indicate?",
    options_en: ["A delta-T of 18°F indicates the system is operating correctly within the normal acceptable range", "A delta-T of 18°F indicates the system has a low refrigerant charge and needs refrigerant added immediately", "A delta-T of 18°F indicates airflow is very low because the normal differential should only be 10 to 12 degrees", "A delta-T of 18°F indicates the evaporator coil is partially blocked by dirt and needs urgent cleaning"],
    explanation_en: "A delta-T of 18°F (76-58) is within the normal range of 15-20°F for a residential air conditioning system operating correctly with adequate airflow."
  },
    {
      category: "Casa de Bob",
      q: "Bob quiere agregar una habitación de 300 pies cuadrados a su casa y conectarla al sistema existente. ¿Qué debe hacer el técnico ANTES?",
      options: ["Simplemente extender un ducto existente con un ramal adicional y agregar un difusor proporcional al área nueva", "Realizar un nuevo cálculo de Manual J para toda la casa incluyendo la adición y verificar si el equipo tiene capacidad", "Aumentar la velocidad del ventilador al máximo para compensar el flujo adicional necesario para la nueva habitación", "Instalar un segundo equipo independiente exclusivamente para la nueva habitación sin modificar el sistema existente"],
      correct: 1,
      explanation: "Antes de agregar una habitación, se debe recalcular la carga total con Manual J, verificar que el equipo existente tenga capacidad suficiente, y rediseñar los ductos con Manual D."
    ,
    question_en: "Bob wants to add a 300 square foot room to his house and connect it to the existing system. What should the technician do FIRST?",
    options_en: ["Simply extend an existing duct with an additional branch and add a diffuser proportional to the new area", "Perform a new Manual J calculation for the entire house including the addition and verify if the equipment has capacity", "Increase the fan speed to maximum to compensate for the additional flow needed for the new room", "Install a second independent system exclusively for the new room without modifying the existing system"],
    explanation_en: "Before adding a room, the total load must be recalculated with Manual J, verify that the existing equipment has sufficient capacity, and redesign the ducts with Manual D."
  },
    {
      category: "Casa de Bob",
      q: "En la Casa de Bob, la presión estática total del sistema es 0.92 IWC pero el equipo está clasificado para máximo 0.50 IWC. ¿Cuál es el impacto?",
      options: ["El sistema operará con mayor eficiencia porque la presión alta comprime el aire mejorando la transferencia de calor", "El flujo de aire se reduce drásticamente causando bajo rendimiento, posible congelamiento del serpentín y mayor consumo", "La presión alta solo afecta el nivel de ruido del sistema pero no impacta el rendimiento térmico ni la eficiencia real", "El motor del ventilador compensará automáticamente la presión alta aumentando las RPM hasta alcanzar el flujo diseñado"],
      correct: 1,
      explanation: "Una presión estática de 0.92 vs 0.50 IWC máximo reduce severamente el flujo de aire, causando bajo rendimiento, riesgo de congelamiento del serpentín, y mayor consumo del motor del ventilador."
    ,
    question_en: "In Bob's House, the total system static pressure is 0.92 IWC but the equipment is rated for a maximum of 0.50 IWC. What is the impact?",
    options_en: ["The system will operate with greater efficiency because high pressure compresses the air improving heat transfer", "Airflow is drastically reduced causing poor performance, possible coil freezing, and higher consumption", "The high pressure only affects the system noise level but does not impact thermal performance or actual efficiency", "The fan motor will automatically compensate for the high pressure by increasing RPM until reaching the designed flow"],
    explanation_en: "A static pressure of 0.92 vs 0.50 IWC maximum severely reduces airflow, causing poor performance, risk of coil freezing, and higher fan motor consumption."
  },
    {
      category: "Casa de Bob",
      q: "Bob reporta un silbido fuerte cuando el sistema arranca. El técnico identifica que el sonido viene de un registro de suministro. ¿Cuál es la causa más probable?",
      options: ["El registro tiene el damper parcialmente cerrado y la velocidad del aire a través de la apertura reducida genera silbido", "El ducto de suministro tiene una fuga grande antes del registro que succiona aire del ático creando el silbido audible", "El motor del ventilador tiene un rodamiento desgastado y el sonido se transmite por la estructura metálica del ducto", "El compresor está arrancando con presiones desbalanceadas y el sonido viaja por las líneas hasta el interior de la casa"],
      correct: 0,
      explanation: "Un damper parcialmente cerrado fuerza el aire a pasar por una apertura reducida a alta velocidad, generando un silbido característico. Abrir el damper o rebalancear el sistema resuelve el ruido."
    ,
    question_en: "Bob reports a loud whistling when the system starts. The technician identifies the sound is coming from a supply register. What is the most likely cause?",
    options_en: ["The register has the damper partially closed and the air velocity through the reduced opening generates whistling", "The supply duct has a large leak before the register that sucks air from the attic creating the audible whistling", "The fan motor has a worn bearing and the sound is transmitted through the metallic duct structure", "The compressor is starting with unbalanced pressures and the sound travels through the lines to the house interior"],
    explanation_en: "A partially closed damper forces air through a reduced opening at high velocity, generating a characteristic whistling sound. Opening the damper or rebalancing the system resolves the noise."
  },
    {
      category: "Casa de Bob",
      q: "En la Casa de Bob, dos habitaciones tienen registros de suministro pero no hay retorno y las puertas permanecen cerradas. ¿Qué ocurre?",
      options: ["Las habitaciones se presurizan positivamente impidiendo que entre suficiente aire acondicionado y se calientan en exceso", "Las habitaciones se enfrían más rápido porque el aire recircula internamente sin perderse por el sistema de retorno general", "La presión positiva en las habitaciones empuja el aire frío al ático a través de las tomas eléctricas de las paredes", "El equipo aumenta automáticamente el flujo para compensar la falta de retorno en las habitaciones cerradas del hogar"],
      correct: 0,
      explanation: "Sin retorno y con puertas cerradas, las habitaciones se presurizan. El aire de suministro no puede circular de regreso al equipo, reduciendo el flujo efectivo y causando temperaturas desiguales."
    ,
    question_en: "In Bob's House, two rooms have supply registers but no return and the doors remain closed. What happens?",
    options_en: ["The rooms become positively pressurized preventing enough conditioned air from entering and they overheat", "The rooms cool faster because air recirculates internally without being lost through the general return system", "The positive pressure in the rooms pushes cold air into the attic through the electrical outlets in the walls", "The equipment automatically increases flow to compensate for the lack of return in the closed rooms"],
    explanation_en: "Without a return and with closed doors, the rooms become pressurized. Supply air cannot circulate back to the equipment, reducing effective flow and causing uneven temperatures."
  },
    {
      category: "System Airflow",
      q: "¿Cuál es el flujo de aire estándar recomendado por tonelada de refrigeración para un sistema de aire acondicionado residencial típico?",
      options: ["Aproximadamente 300 CFM por tonelada para maximizar la remoción de humedad en climas extremadamente húmedos", "Aproximadamente 400 CFM por tonelada como valor estándar para la mayoría de aplicaciones residenciales de enfriamiento", "Aproximadamente 500 CFM por tonelada para asegurar suficiente flujo de aire y prevenir congelamiento del serpentín", "Aproximadamente 600 CFM por tonelada para mantener la velocidad del aire alta y garantizar distribución uniforme total"],
      correct: 1,
      explanation: "El estándar de la industria es 400 CFM por tonelada de refrigeración. Valores menores mejoran deshumidificación pero arriesgan congelamiento; valores mayores reducen la capacidad latente."
    ,
    question_en: "What is the standard recommended airflow per ton of refrigeration for a typical residential air conditioning system?",
    options_en: ["Approximately 300 CFM per ton to maximize moisture removal in extremely humid climates", "Approximately 400 CFM per ton as the standard value for most residential cooling applications", "Approximately 500 CFM per ton to ensure sufficient airflow and prevent coil freezing", "Approximately 600 CFM per ton to keep air velocity high and guarantee uniform total distribution"],
    explanation_en: "The industry standard is 400 CFM per ton of refrigeration. Lower values improve dehumidification but risk coil freezing; higher values reduce latent capacity."
  },
    {
      category: "System Airflow",
      q: "Si un sistema de 4 toneladas está entregando solo 1,200 CFM en lugar de los 1,600 CFM requeridos, ¿cuál es el efecto en la presión de succión?",
      options: ["La presión de succión sube porque el refrigerante no se evapora completamente y hay más presión en el serpentín", "La presión de succión baja porque hay menos calor disponible para evaporar el refrigerante en el serpentín frío", "La presión de succión se mantiene igual porque el compresor regula automáticamente la presión independientemente del flujo", "La presión de succión oscila entre alta y baja porque el flujo reducido causa inestabilidad en el ciclo de refrigeración"],
      correct: 1,
      explanation: "Con menos flujo de aire, hay menos calor para transferir al refrigerante, causando que la temperatura y presión de succión bajen. Si bajan demasiado, el serpentín se congela."
    ,
    question_en: "If a 4-ton system is delivering only 1,200 CFM instead of the required 1,600 CFM, what is the effect on suction pressure?",
    options_en: ["Suction pressure rises because the refrigerant does not fully evaporate and there is more pressure in the coil", "Suction pressure drops because there is less heat available to evaporate the refrigerant in the cold coil", "Suction pressure stays the same because the compressor automatically regulates pressure regardless of flow", "Suction pressure oscillates between high and low because reduced flow causes instability in the refrigeration cycle"],
    explanation_en: "With less airflow, there is less heat to transfer to the refrigerant, causing suction temperature and pressure to drop. If they drop too much, the coil freezes."
  },
    {
      category: "System Airflow",
      q: "¿Qué componente del sistema tiene el MAYOR impacto en la presión estática total cuando se obstruye o se restringe?",
      options: ["El ducto troncal de suministro cuando acumula polvo interno después de años sin limpieza profesional adecuada", "El serpentín del evaporador cuando se tapa con suciedad reduciendo drásticamente el área libre para paso del aire", "Los difusores de suministro cuando tienen las aletas cerradas al máximo restringiendo la salida del aire a las salas", "El ducto de retorno flexible cuando tiene curvas cerradas que crean turbulencia excesiva y pérdidas por fricción altas"],
      correct: 1,
      explanation: "El serpentín del evaporador sucio es la causa más común y de mayor impacto en la presión estática. Su área libre reducida crea una restricción severa que afecta todo el sistema."
    ,
    question_en: "Which system component has the GREATEST impact on total static pressure when it becomes obstructed or restricted?",
    options_en: ["The supply trunk duct when it accumulates internal dust after years without proper professional cleaning", "The evaporator coil when it gets clogged with dirt drastically reducing the free area for airflow", "The supply diffusers when their louvers are closed to maximum restricting air outlet to the rooms", "The flexible return duct when it has tight bends that create excessive turbulence and high friction losses"],
    explanation_en: "A dirty evaporator coil is the most common cause and has the greatest impact on static pressure. Its reduced free area creates a severe restriction that affects the entire system."
  },
    {
      category: "System Airflow",
      q: "En un sistema de zona única con un solo termostato, ¿cómo se puede verificar si el flujo de aire total del sistema es correcto?",
      options: ["Midiendo la velocidad del aire en cada difusor con un anemómetro y sumando todos los flujos individuales medidos", "Multiplicando la lectura de presión estática por el área del ducto troncal para obtener el flujo volumétrico del sistema", "Verificando que la corriente eléctrica del motor del ventilador coincida con la especificada en la placa de datos", "Comparando la temperatura del aire de suministro con la del retorno y usando el delta-T para estimar eficiencia total"],
      correct: 0,
      explanation: "La forma más directa es medir el CFM en cada difusor con un anemómetro o balómetro y sumar los flujos individuales. También se puede usar el método de entalpía con temperatura y humedad."
    ,
    question_en: "In a single-zone system with one thermostat, how can you verify if the total system airflow is correct?",
    options_en: ["Measuring air velocity at each diffuser with an anemometer and adding all individual measured flows", "Multiplying the static pressure reading by the trunk duct area to obtain the system volumetric flow", "Verifying that the fan motor electrical current matches the one specified on the data plate", "Comparing the supply air temperature with the return and using the delta-T to estimate total efficiency"],
    explanation_en: "The most direct way is to measure the CFM at each diffuser with an anemometer or flow hood and sum the individual flows. The enthalpy method with temperature and humidity can also be used."
  },
    {
      category: "System Airflow",
      q: "¿Cuál es la consecuencia de tener un flujo de aire de retorno significativamente menor que el flujo de suministro en una casa con ductos?",
      options: ["La casa se presuriza positivamente empujando aire acondicionado hacia el exterior a través de la envolvente del edificio", "La casa se presuriza negativamente succionando aire caliente y húmedo del exterior a través de grietas en la envolvente", "El equipo compensa automáticamente reduciendo el flujo de suministro para igualar el retorno deficiente del sistema", "No hay consecuencia porque el aire siempre encuentra una ruta de retorno natural al equipo a través de la estructura"],
      correct: 1,
      explanation: "Retorno insuficiente causa presión negativa en la casa, succionando aire caliente y húmedo del exterior (infiltración) a través de grietas, aumentando la carga del sistema significativamente."
    ,
    question_en: "What is the consequence of having return airflow significantly less than the supply airflow in a house with ducts?",
    options_en: ["The house becomes positively pressurized pushing conditioned air to the outside through the building envelope", "The house becomes negatively pressurized sucking hot and humid outside air through cracks in the envelope", "The equipment automatically compensates by reducing the supply flow to match the deficient system return", "There is no consequence because air always finds a natural return path to the equipment through the structure"],
    explanation_en: "Insufficient return causes negative pressure in the house, sucking hot and humid outside air (infiltration) through cracks, significantly increasing the system load."
  },
    {
      category: "System Airflow",
      q: "Si un técnico mide una presión estática de 0.15 IWC a través del filtro nuevo pero el fabricante especifica máximo 0.08 IWC, ¿qué indica?",
      options: ["El filtro instalado tiene un MERV rating demasiado alto para la aplicación o el área del filtro es insuficiente para el flujo", "El manómetro está descalibrado y necesita calibración profesional antes de tomar mediciones confiables y precisas del sistema", "El filtro es del tamaño correcto pero fue instalado al revés bloqueando parcialmente el flujo de aire por el respaldo sólido", "La velocidad del ventilador es excesiva y debe reducirse para que la caída de presión del filtro entre en especificación"],
      correct: 0,
      explanation: "Una caída de presión excesiva en un filtro nuevo indica que el MERV es demasiado alto para la aplicación o que el área del filtro es insuficiente para el CFM del sistema."
    ,
    question_en: "If a technician measures 0.15 IWC static pressure across a new filter but the manufacturer specifies a maximum of 0.08 IWC, what does this indicate?",
    options_en: ["The installed filter has too high a MERV rating for the application or the filter area is insufficient for the flow", "The manometer is out of calibration and needs professional calibration before taking reliable and precise system measurements", "The filter is the correct size but was installed backwards partially blocking airflow with the solid backing", "The fan speed is excessive and must be reduced so the filter pressure drop falls within specification"],
    explanation_en: "Excessive pressure drop across a new filter indicates that the MERV is too high for the application or that the filter area is insufficient for the system CFM."
  },
    {
      category: "System Airflow",
      q: "¿Qué efecto tiene cerrar los registros de suministro en habitaciones no utilizadas sobre el flujo de aire total del sistema?",
      options: ["Ahorra energía significativamente porque el equipo solo acondiciona las habitaciones que realmente necesitan tratamiento", "Reduce el flujo total del sistema, aumenta la presión estática y puede causar problemas de rendimiento en el equipo", "Redirige eficientemente el flujo extra a las habitaciones abiertas mejorando el confort sin afectar la presión del equipo", "No tiene ningún efecto porque el ventilador del equipo ajusta automáticamente su velocidad según los registros abiertos"],
      correct: 1,
      explanation: "Cerrar registros aumenta la presión estática, reduce el flujo total, y puede causar congelamiento del serpentín, fallas del compresor, y fugas en los ductos por presión excesiva."
    ,
    question_en: "What effect does closing supply registers in unused rooms have on total system airflow?",
    options_en: ["It saves significant energy because the equipment only conditions rooms that actually need treatment", "It reduces total system flow, increases static pressure, and can cause equipment performance problems", "It efficiently redirects extra flow to open rooms improving comfort without affecting equipment pressure", "It has no effect because the equipment fan automatically adjusts its speed according to the open registers"],
    explanation_en: "Closing registers increases static pressure, reduces total flow, and can cause coil freezing, compressor failures, and duct leaks from excessive pressure."
  },
    {
      category: "System Airflow",
      q: "En un sistema residencial, ¿cuál debería ser la velocidad del aire en la cara del serpentín evaporador para un rendimiento óptimo?",
      options: ["Entre 200 y 350 FPM para maximizar el tiempo de contacto del aire con el serpentín y la deshumidificación total", "Entre 350 y 500 FPM para mantener un equilibrio entre transferencia de calor y caída de presión a través del serpentín", "Entre 500 y 700 FPM para maximizar la transferencia de calor por convección forzada y evitar acumulación de escarcha", "Entre 700 y 900 FPM para asegurar que no haya condensación excesiva en la bandeja de drenaje del evaporador del equipo"],
      correct: 1,
      explanation: "La velocidad óptima en la cara del serpentín es 350-500 FPM. Menor velocidad reduce la transferencia pero mejora deshumidificación; mayor velocidad puede arrastrar gotas de agua."
    ,
    question_en: "In a residential system, what should be the air velocity at the evaporator coil face for optimal performance?",
    options_en: ["Between 200 and 350 FPM to maximize air contact time with the coil and total dehumidification", "Between 350 and 500 FPM to maintain a balance between heat transfer and pressure drop across the coil", "Between 500 and 700 FPM to maximize forced convection heat transfer and prevent frost accumulation", "Between 700 and 900 FPM to ensure there is no excessive condensation in the evaporator drain pan"],
    explanation_en: "The optimal coil face velocity is 350-500 FPM. Lower velocity reduces transfer but improves dehumidification; higher velocity may carry water droplets."
  },
    {
      category: "System Airflow",
      q: "Si la temperatura de bulbo seco del aire de suministro es 55°F y el aire de retorno es 75°F con un flujo de 1,200 CFM, ¿cuál es la capacidad sensible?",
      options: ["Aproximadamente 19,440 BTU/h calculada con la fórmula CFM x 1.08 x delta-T del aire a través del serpentín", "Aproximadamente 25,920 BTU/h calculada con la fórmula CFM x 1.08 x delta-T del aire a través del serpentín", "Aproximadamente 32,400 BTU/h calculada con la fórmula CFM x 1.08 x delta-T del aire a través del serpentín", "Aproximadamente 38,880 BTU/h calculada con la fórmula CFM x 1.08 x delta-T del aire a través del serpentín"],
      correct: 1,
      explanation: "Capacidad sensible = 1,200 CFM x 1.08 x (75-55) = 1,200 x 1.08 x 20 = 25,920 BTU/h. La constante 1.08 viene de densidad x calor específico x 60 min/hr."
    ,
    question_en: "If the supply air dry bulb temperature is 55°F and the return air is 75°F with 1,200 CFM flow, what is the sensible capacity?",
    options_en: ["Approximately 19,440 BTU/h calculated with the formula CFM x 1.08 x delta-T of air across the coil", "Approximately 25,920 BTU/h calculated with the formula CFM x 1.08 x delta-T of air across the coil", "Approximately 32,400 BTU/h calculated with the formula CFM x 1.08 x delta-T of air across the coil", "Approximately 38,880 BTU/h calculated with the formula CFM x 1.08 x delta-T of air across the coil"],
    explanation_en: "Sensible capacity = 1,200 CFM x 1.08 x (75-55) = 1,200 x 1.08 x 20 = 25,920 BTU/h. The constant 1.08 comes from density x specific heat x 60 min/hr."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Cuál es la función principal de un balómetro y en qué se diferencia de un anemómetro de paletas para medir flujo de aire?",
      options: ["El balómetro mide la presión del aire en el ducto y el anemómetro mide la velocidad del aire en el mismo punto exacto", "El balómetro mide el flujo total directamente en CFM en un difusor mientras el anemómetro mide velocidad puntual en FPM", "El balómetro solo funciona en ductos de retorno y el anemómetro solamente funciona correctamente en ductos de suministro", "El balómetro es más preciso que el anemómetro pero solo funciona con difusores cuadrados y no con los tipos redondos"],
      correct: 1,
      explanation: "El balómetro captura todo el flujo de un difusor y lee directamente en CFM. El anemómetro mide velocidad puntual (FPM) que debe multiplicarse por área para obtener CFM, introduciendo más error."
    ,
    question_en: "What is the main function of a flow hood (balometer) and how does it differ from a vane anemometer for measuring airflow?",
    options_en: ["The flow hood measures air pressure in the duct and the anemometer measures air velocity at the exact same point", "The flow hood measures total flow directly in CFM at a diffuser while the anemometer measures point velocity in FPM", "The flow hood only works on return ducts and the anemometer only works correctly on supply ducts", "The flow hood is more accurate than the anemometer but only works with square diffusers and not round types"],
    explanation_en: "The flow hood captures all the flow from a diffuser and reads directly in CFM. The anemometer measures point velocity (FPM) which must be multiplied by area to obtain CFM, introducing more error."
  },
    {
      category: "Tools for System Airflow",
      q: "Al usar un manómetro digital para medir presión estática, ¿dónde se deben colocar las sondas para medir la presión estática externa total?",
      options: ["Una sonda en la entrada del filtro y otra en la salida del último difusor de suministro del sistema de distribución", "Una sonda en el plenum de suministro después del serpentín y otra en el plenum de retorno antes del filtro del equipo", "Una sonda en el centro del ducto troncal de suministro y otra en el centro del ducto troncal de retorno del sistema", "Una sonda en la descarga del ventilador y otra en la succión del ventilador, ambas dentro de la unidad evaporadora"],
      correct: 1,
      explanation: "La presión estática externa total se mide con una sonda en el plenum de suministro (después del serpentín) y otra en el plenum de retorno (antes del filtro)."
    ,
    question_en: "When using a digital manometer to measure static pressure, where should the probes be placed to measure total external static pressure?",
    options_en: ["One probe at the filter inlet and another at the last supply diffuser outlet of the distribution system", "One probe in the supply plenum after the coil and another in the return plenum before the equipment filter", "One probe at the center of the supply trunk duct and another at the center of the system return trunk duct", "One probe at the fan discharge and another at the fan suction, both inside the evaporator unit"],
    explanation_en: "Total external static pressure is measured with one probe in the supply plenum (after the coil) and another in the return plenum (before the filter)."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Para qué se utiliza un tubo de Pitot en diagnóstico de sistemas HVAC y qué mide exactamente?",
      options: ["El tubo de Pitot mide la temperatura del aire dentro del ducto con alta precisión usando diferencial térmico", "El tubo de Pitot mide la presión total y estática permitiendo calcular la presión de velocidad y determinar FPM", "El tubo de Pitot mide la humedad relativa del aire y la presión barométrica del ambiente circundante simultáneamente", "El tubo de Pitot mide las fugas del ducto por presurización y la caída de presión del filtro al mismo tiempo"],
      correct: 1,
      explanation: "El tubo de Pitot mide simultáneamente presión total y presión estática. La diferencia es la presión de velocidad, que se convierte a FPM usando tablas o fórmulas."
    ,
    question_en: "What is a Pitot tube used for in HVAC system diagnostics and what does it measure exactly?",
    options_en: ["The Pitot tube measures air temperature inside the duct with high precision using thermal differential", "The Pitot tube measures total and static pressure allowing calculation of velocity pressure and determining FPM", "The Pitot tube measures relative humidity and barometric pressure of the surrounding environment simultaneously", "The Pitot tube measures duct leaks by pressurization and filter pressure drop at the same time"],
    explanation_en: "The Pitot tube simultaneously measures total pressure and static pressure. The difference is velocity pressure, which is converted to FPM using tables or formulas."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Cuál es la herramienta más apropiada para verificar si un sistema de ductos tiene fugas excesivas de aire?",
      options: ["Un manómetro digital conectado a cada junta del ducto para detectar diferencias de presión que indiquen fugas", "Un duct blaster que presuriza el sistema de ductos a 25 Pascales y mide el flujo de aire necesario para mantener presión", "Un anemómetro de hilo caliente colocado cerca de cada conexión del ducto para detectar corrientes de aire por fugas", "Un detector de humo que se inyecta en el sistema de ductos para visualizar las fugas en cada junta y conexión externa"],
      correct: 1,
      explanation: "El duct blaster es el instrumento estándar para pruebas de hermeticidad de ductos. Presuriza el sistema a 25 Pa y mide el CFM de fuga (CFM25)."
    ,
    question_en: "What is the most appropriate tool for verifying if a duct system has excessive air leaks?",
    options_en: ["A digital manometer connected to each duct joint to detect pressure differences indicating leaks", "A duct blaster that pressurizes the duct system to 25 Pascals and measures the airflow needed to maintain pressure", "A hot wire anemometer placed near each duct connection to detect air currents from leaks", "A smoke detector injected into the duct system to visualize leaks at each joint and external connection"],
    explanation_en: "The duct blaster is the standard instrument for duct airtightness testing. It pressurizes the system to 25 Pa and measures the CFM of leakage (CFM25)."
  },
    {
      category: "Tools for System Airflow",
      q: "Al medir velocidad de aire con un anemómetro de paletas en la cara de un difusor, ¿por qué se recomienda tomar múltiples lecturas?",
      options: ["Porque el anemómetro necesita calibrarse con cada lectura para compensar la temperatura ambiente variable del espacio", "Porque la velocidad del aire no es uniforme en toda la cara del difusor y el promedio da una representación más precisa", "Porque el motor del ventilador varía su velocidad constantemente y una sola lectura puede coincidir con un pico o valle", "Porque las paletas del anemómetro se desgastan durante la medición y las lecturas posteriores son más precisas siempre"],
      correct: 1,
      explanation: "La velocidad del aire varía significativamente en diferentes puntos de la cara del difusor. Tomar múltiples lecturas en una cuadrícula y promediarlas proporciona un valor más representativo."
    ,
    question_en: "When measuring air velocity with a vane anemometer at the face of a diffuser, why is it recommended to take multiple readings?",
    options_en: ["Because the anemometer needs to be calibrated with each reading to compensate for the variable ambient temperature", "Because air velocity is not uniform across the entire diffuser face and the average gives a more accurate representation", "Because the fan motor varies its speed constantly and a single reading may coincide with a peak or valley", "Because the anemometer vanes wear during measurement and later readings are always more accurate"],
    explanation_en: "Air velocity varies significantly at different points across the diffuser face. Taking multiple readings in a grid pattern and averaging them provides a more representative value."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Qué precaución especial se debe tener al usar un balómetro para medir el flujo en un difusor de techo de alta velocidad?",
      options: ["Se debe apagar el sistema antes de colocar el balómetro para evitar que la presión del aire dañe el instrumento frágil", "Se debe verificar que el tamaño del captor coincida con el difusor y considerar el efecto de back-pressure en la lectura", "Se debe sostener el balómetro a un ángulo de 45 grados respecto al difusor para evitar que el chorro desvíe la lectura", "Se debe esperar al menos 10 minutos después de encender el sistema para que el flujo se estabilice antes de medición"],
      correct: 1,
      explanation: "El balómetro crea una contra-presión (back-pressure) que puede reducir el flujo medido hasta un 15-20% en difusores de alta velocidad."
    ,
    question_en: "What special precaution should be taken when using a flow hood to measure flow at a high-velocity ceiling diffuser?",
    options_en: ["The system must be turned off before placing the flow hood to prevent air pressure from damaging the fragile instrument", "The capture hood size must match the diffuser and the back-pressure effect on the reading must be considered", "The flow hood must be held at a 45-degree angle to the diffuser to prevent the jet from deflecting the reading", "You must wait at least 10 minutes after turning on the system for the flow to stabilize before measurement"],
    explanation_en: "The flow hood creates back-pressure that can reduce the measured flow by up to 15-20% at high-velocity diffusers."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Para qué se utiliza específicamente un higrómetro o psicrómetro en el diagnóstico de sistemas de aire acondicionado?",
      options: ["Para medir la presión del refrigerante en las líneas de succión y descarga del compresor del sistema de refrigeración", "Para medir la temperatura de bulbo seco y húmedo del aire y determinar la humedad relativa y el contenido de humedad", "Para medir la velocidad del aire en pies por minuto dentro de los ductos del sistema de distribución de aire completo", "Para medir la presión diferencial a través del filtro y determinar cuándo es necesario reemplazarlo por uno limpio nuevo"],
      correct: 1,
      explanation: "El psicrómetro mide las temperaturas de bulbo seco y húmedo, permitiendo determinar la humedad relativa, punto de rocío, y entalpía del aire."
    ,
    question_en: "What is a hygrometer or psychrometer specifically used for in air conditioning system diagnostics?",
    options_en: ["To measure refrigerant pressure in the suction and discharge lines of the refrigeration system compressor", "To measure dry bulb and wet bulb air temperature and determine relative humidity and moisture content", "To measure air velocity in feet per minute inside the ducts of the complete air distribution system", "To measure differential pressure across the filter and determine when it needs to be replaced with a clean new one"],
    explanation_en: "The psychrometer measures dry bulb and wet bulb temperatures, allowing determination of relative humidity, dew point, and air enthalpy."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Cuál es la ventaja principal de usar un anemómetro de hilo caliente sobre uno de paletas para medir velocidades bajas?",
      options: ["El anemómetro de hilo caliente es más económico y fácil de calibrar que el de paletas en condiciones de campo normal", "El anemómetro de hilo caliente tiene mayor precisión a velocidades bajas porque el hilo detecta cambios mínimos de flujo", "El anemómetro de hilo caliente funciona en ambientes húmedos mientras que el de paletas se corroe con la humedad alta", "El anemómetro de hilo caliente puede medir direccionalmente determinando si el flujo es hacia adentro o hacia afuera"],
      correct: 1,
      explanation: "El anemómetro de hilo caliente tiene mayor sensibilidad y precisión a velocidades bajas (menos de 100 FPM) donde las paletas del anemómetro mecánico no responden adecuadamente."
    ,
    question_en: "What is the main advantage of using a hot wire anemometer over a vane anemometer for measuring low velocities?",
    options_en: ["The hot wire anemometer is more economical and easier to calibrate than the vane type under normal field conditions", "The hot wire anemometer has greater accuracy at low velocities because the wire detects minimal flow changes", "The hot wire anemometer works in humid environments while the vane type corrodes with high humidity", "The hot wire anemometer can measure directionally determining if the flow is inward or outward"],
    explanation_en: "The hot wire anemometer has greater sensitivity and accuracy at low velocities (less than 100 FPM) where the vanes of the mechanical anemometer do not respond adequately."
  },
    {
      category: "Tools for System Airflow",
      q: "Al usar un manómetro para medir la caída de presión a través de un serpentín evaporador, ¿cuáles son los puntos correctos de medición?",
      options: ["Se conecta el puerto alto antes del serpentín y el puerto bajo después del serpentín para leer la caída directamente", "Se conecta un puerto al ducto de suministro y otro al de retorno para medir la presión total de todo el sistema de aire", "Se conecta ambos puertos al mismo lado del serpentín para calibrar el manómetro a cero antes de realizar la medición", "Se conecta el puerto alto a la línea de líquido y el bajo a la línea de succión para medir la caída del refrigerante"],
      correct: 0,
      explanation: "Para medir la caída de presión del serpentín, se perforan dos puertos: uno antes (lado de retorno) y otro después (lado de suministro) del serpentín."
    ,
    question_en: "When using a manometer to measure pressure drop across an evaporator coil, what are the correct measurement points?",
    options_en: ["Connect the high port before the coil and the low port after the coil to read the drop directly", "Connect one port to the supply duct and another to the return to measure the total pressure of the entire air system", "Connect both ports to the same side of the coil to calibrate the manometer to zero before taking the measurement", "Connect the high port to the liquid line and the low port to the suction line to measure the refrigerant drop"],
    explanation_en: "To measure the coil pressure drop, two ports are drilled: one before (return side) and one after (supply side) the coil."
  },
    {
      category: "Tools for System Airflow",
      q: "¿Qué herramienta se utiliza para realizar una prueba de puerta sopladora (blower door test) y qué mide específicamente?",
      options: ["Se usa un ventilador calibrado en la puerta principal que mide la tasa de infiltración total de la envolvente del edificio", "Se usa un compresor de aire que inyecta presión positiva y mide la resistencia de los ductos a la presurización forzada", "Se usa una cámara termográfica que detecta fugas de aire por las diferencias de temperatura en la superficie de envolvente", "Se usa un detector de humo portátil que visualiza las corrientes de aire infiltrado en las juntas y penetraciones del muro"],
      correct: 0,
      explanation: "La prueba de blower door usa un ventilador calibrado montado en la puerta principal que presuriza/despresuriza la casa a 50 Pa, midiendo CFM50 para determinar la hermeticidad."
    ,
    question_en: "What tool is used to perform a blower door test and what does it specifically measure?",
    options_en: ["A calibrated fan mounted in the main door that measures the total infiltration rate of the building envelope", "An air compressor that injects positive pressure and measures the resistance of the ducts to forced pressurization", "A thermal imaging camera that detects air leaks by temperature differences on the envelope surface", "A portable smoke detector that visualizes infiltrated air currents at joints and wall penetrations"],
    explanation_en: "The blower door test uses a calibrated fan mounted in the main door that pressurizes/depressurizes the house to 50 Pa, measuring CFM50 to determine airtightness."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "La fórmula CFM = BTU / (1.08 x delta-T) se usa para calcular el flujo de aire sensible. ¿De dónde proviene la constante 1.08?",
      options: ["De multiplicar la densidad del aire (0.075 lb/ft3) por el calor específico (0.24 BTU/lb-F) por 60 minutos por hora", "De dividir las BTU por tonelada de refrigeración (12,000) entre las horas de operación estándar del equipo (11,111 hrs)", "De multiplicar la presión atmosférica estándar (14.7 psi) por el factor de conversión de unidades inglesas (0.0735)", "De dividir el calor latente de vaporización del agua (1,060 BTU/lb) entre el factor de corrección por altitud (982)"],
      correct: 0,
      explanation: "1.08 = 0.075 lb/ft3 (densidad del aire) x 0.24 BTU/lb-F (calor específico) x 60 min/hr. Esta constante convierte CFM y delta-T a BTU/h para cálculos de calor sensible."
    ,
    question_en: "The formula CFM = BTU / (1.08 x delta-T) is used to calculate sensible airflow. Where does the constant 1.08 come from?",
    options_en: ["From multiplying air density (0.075 lb/ft3) by specific heat (0.24 BTU/lb-F) by 60 minutes per hour", "From dividing BTUs per ton of refrigeration (12,000) by the standard equipment operating hours (11,111 hrs)", "From multiplying standard atmospheric pressure (14.7 psi) by the English unit conversion factor (0.0735)", "From dividing the latent heat of water vaporization (1,060 BTU/lb) by the altitude correction factor (982)"],
    explanation_en: "1.08 = 0.075 lb/ft3 (air density) x 0.24 BTU/lb-F (specific heat) x 60 min/hr. This constant converts CFM and delta-T to BTU/h for sensible heat calculations."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "Si un sistema de 36,000 BTU/h tiene un diferencial de temperatura de suministro-retorno de 20°F, ¿cuál es el flujo de aire requerido?",
      options: ["Aproximadamente 1,250 CFM calculado usando la fórmula estándar de flujo de aire sensible con los valores dados", "Aproximadamente 1,667 CFM calculado usando la fórmula estándar de flujo de aire sensible con los valores dados", "Aproximadamente 2,083 CFM calculado usando la fórmula estándar de flujo de aire sensible con los valores dados", "Aproximadamente 2,500 CFM calculado usando la fórmula estándar de flujo de aire sensible con los valores dados"],
      correct: 1,
      explanation: "CFM = BTU / (1.08 x delta-T) = 36,000 / (1.08 x 20) = 36,000 / 21.6 = 1,667 CFM. Esto equivale a 400 CFM/ton para un sistema de 3 toneladas."
    ,
    question_en: "If a 36,000 BTU/h system has a supply-return temperature differential of 20°F, what is the required airflow?",
    options_en: ["Approximately 1,250 CFM calculated using the standard sensible airflow formula with the given values", "Approximately 1,667 CFM calculated using the standard sensible airflow formula with the given values", "Approximately 2,083 CFM calculated using the standard sensible airflow formula with the given values", "Approximately 2,500 CFM calculated using the standard sensible airflow formula with the given values"],
    explanation_en: "CFM = BTU / (1.08 x delta-T) = 36,000 / (1.08 x 20) = 36,000 / 21.6 = 1,667 CFM. This equals 400 CFM/ton for a 3-ton system."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "¿Cuál es la fórmula correcta para calcular el flujo de aire en CFM cuando se conoce la velocidad del aire y el área del ducto?",
      options: ["CFM = Velocidad (FPM) dividida entre el Área (ft2) de la sección transversal del ducto de distribución de aire", "CFM = Velocidad (FPM) multiplicada por el Área (ft2) de la sección transversal del ducto de distribución de aire", "CFM = Velocidad (FPM) multiplicada por el Perímetro (ft) de la sección transversal del ducto de distribución aire", "CFM = Velocidad (FPM) multiplicada por el Diámetro (ft) de la sección transversal del ducto de distribución aire"],
      correct: 1,
      explanation: "CFM = Velocidad (FPM) x Área (ft2). Es la ecuación fundamental de continuidad del flujo."
    ,
    question_en: "What is the correct formula to calculate airflow in CFM when the air velocity and duct area are known?",
    options_en: ["CFM = Velocity (FPM) divided by the Area (ft2) of the duct cross-section", "CFM = Velocity (FPM) multiplied by the Area (ft2) of the duct cross-section", "CFM = Velocity (FPM) multiplied by the Perimeter (ft) of the duct cross-section", "CFM = Velocity (FPM) multiplied by the Diameter (ft) of the duct cross-section"],
    explanation_en: "CFM = Velocity (FPM) x Area (ft2). This is the fundamental continuity equation for flow."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "Un ducto redondo de 10 pulgadas de diámetro tiene aire fluyendo a 900 FPM. ¿Cuál es el flujo de aire en CFM aproximadamente?",
      options: ["Aproximadamente 350 CFM basado en el área del ducto redondo de 10 pulgadas y la velocidad de 900 pies por minuto", "Aproximadamente 490 CFM basado en el área del ducto redondo de 10 pulgadas y la velocidad de 900 pies por minuto", "Aproximadamente 630 CFM basado en el área del ducto redondo de 10 pulgadas y la velocidad de 900 pies por minuto", "Aproximadamente 770 CFM basado en el área del ducto redondo de 10 pulgadas y la velocidad de 900 pies por minuto"],
      correct: 1,
      explanation: "Área = pi x (5/12)2 = pi x 0.1736 = 0.5454 ft2. CFM = 900 x 0.5454 = 491 CFM. El diámetro se convierte a pies (10/12) y se usa el radio para el área circular."
    ,
    question_en: "A 10-inch diameter round duct has air flowing at 900 FPM. What is the approximate airflow in CFM?",
    options_en: ["Approximately 350 CFM based on the 10-inch round duct area and the 900 feet per minute velocity", "Approximately 490 CFM based on the 10-inch round duct area and the 900 feet per minute velocity", "Approximately 630 CFM based on the 10-inch round duct area and the 900 feet per minute velocity", "Approximately 770 CFM based on the 10-inch round duct area and the 900 feet per minute velocity"],
    explanation_en: "Area = pi x (5/12)2 = pi x 0.1736 = 0.5454 ft2. CFM = 900 x 0.5454 = 491 CFM. The diameter is converted to feet (10/12) and the radius is used for the circular area."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "¿Cuál es la fórmula para convertir la presión de velocidad (VP) medida con un tubo de Pitot a velocidad del aire en FPM?",
      options: ["Velocidad (FPM) = 2,005 x raíz cuadrada de la presión de velocidad en pulgadas de columna de agua estándar", "Velocidad (FPM) = 4,005 x raíz cuadrada de la presión de velocidad en pulgadas de columna de agua estándar", "Velocidad (FPM) = 1,096 x raíz cuadrada de la presión de velocidad en pulgadas de columna de agua estándar", "Velocidad (FPM) = 3,160 x raíz cuadrada de la presión de velocidad en pulgadas de columna de agua estándar"],
      correct: 1,
      explanation: "V = 4,005 x raiz(VP) donde VP está en pulgadas de columna de agua (IWC) y la velocidad resulta en FPM a condiciones estándar de densidad del aire (0.075 lb/ft3)."
    ,
    question_en: "What is the formula to convert velocity pressure (VP) measured with a Pitot tube to air velocity in FPM?",
    options_en: ["Velocity (FPM) = 2,005 x square root of velocity pressure in inches of water column standard", "Velocity (FPM) = 4,005 x square root of velocity pressure in inches of water column standard", "Velocity (FPM) = 1,096 x square root of velocity pressure in inches of water column standard", "Velocity (FPM) = 3,160 x square root of velocity pressure in inches of water column standard"],
    explanation_en: "V = 4,005 x sqrt(VP) where VP is in inches of water column (IWC) and velocity results in FPM at standard air density conditions (0.075 lb/ft3)."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "Para calcular la carga latente removida por el sistema, ¿cuál es la fórmula correcta usando CFM y diferencia de humedad?",
      options: ["BTU/h latente = CFM x 0.68 x delta-w, donde delta-w es la diferencia de humedad en grains entre retorno y suministro", "BTU/h latente = CFM x 1.08 x delta-w, donde delta-w es la diferencia de humedad en grains entre retorno y suministro", "BTU/h latente = CFM x 4.50 x delta-w, donde delta-w es la diferencia de humedad en grains entre retorno y suministro", "BTU/h latente = CFM x 2.16 x delta-w, donde delta-w es la diferencia de humedad en grains entre retorno y suministro"],
      correct: 0,
      explanation: "BTU/h latente = CFM x 0.68 x delta-w (grains/lb). La constante 0.68 relaciona el flujo con la remoción de humedad."
    ,
    question_en: "To calculate the latent load removed by the system, what is the correct formula using CFM and humidity difference?",
    options_en: ["Latent BTU/h = CFM x 0.68 x delta-w, where delta-w is the humidity difference in grains between return and supply", "Latent BTU/h = CFM x 1.08 x delta-w, where delta-w is the humidity difference in grains between return and supply", "Latent BTU/h = CFM x 4.50 x delta-w, where delta-w is the humidity difference in grains between return and supply", "Latent BTU/h = CFM x 2.16 x delta-w, where delta-w is the humidity difference in grains between return and supply"],
    explanation_en: "Latent BTU/h = CFM x 0.68 x delta-w (grains/lb). The constant 0.68 relates the flow to moisture removal."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "Si un sistema tiene 1,400 CFM y la temperatura de suministro es 55°F con retorno a 78°F, ¿cuál es la capacidad sensible total?",
      options: ["Aproximadamente 25,870 BTU/h usando la fórmula estándar de capacidad sensible con los valores de flujo y temperatura", "Aproximadamente 29,750 BTU/h usando la fórmula estándar de capacidad sensible con los valores de flujo y temperatura", "Aproximadamente 34,776 BTU/h usando la fórmula estándar de capacidad sensible con los valores de flujo y temperatura", "Aproximadamente 38,640 BTU/h usando la fórmula estándar de capacidad sensible con los valores de flujo y temperatura"],
      correct: 2,
      explanation: "Capacidad sensible = 1,400 x 1.08 x (78-55) = 1,400 x 1.08 x 23 = 34,776 BTU/h. Esto equivale a aproximadamente 2.9 toneladas de enfriamiento sensible."
    ,
    question_en: "If a system has 1,400 CFM and supply temperature is 55°F with return at 78°F, what is the total sensible capacity?",
    options_en: ["Approximately 25,870 BTU/h using the standard sensible capacity formula with the flow and temperature values", "Approximately 29,750 BTU/h using the standard sensible capacity formula with the flow and temperature values", "Approximately 34,776 BTU/h using the standard sensible capacity formula with the flow and temperature values", "Approximately 38,640 BTU/h using the standard sensible capacity formula with the flow and temperature values"],
    explanation_en: "Sensible capacity = 1,400 x 1.08 x (78-55) = 1,400 x 1.08 x 23 = 34,776 BTU/h. This equals approximately 2.9 tons of sensible cooling."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "¿Cómo se convierte un ducto rectangular de 12x8 pulgadas a su diámetro equivalente redondo para usar las tablas de fricción?",
      options: ["El diámetro equivalente se calcula como el promedio simple de ambas dimensiones: (12+8)/2 = 10 pulgadas exacto", "El diámetro equivalente se calcula con la fórmula: De = 1.3 x (axb)^0.625 / (a+b)^0.25 resultando en un ducto similar", "El diámetro equivalente se calcula como la raíz cuadrada del producto de ambas dimensiones: raiz(12x8) = 9.8 pulgadas", "El diámetro equivalente se calcula sumando ambas dimensiones y multiplicando por 0.5: (12+8)x0.5 = 10 pulgadas exacto"],
      correct: 1,
      explanation: "La fórmula de diámetro equivalente es De = 1.3 x (axb)^0.625 / (a+b)^0.25. Para 12x8: aproximadamente 10.4 pulgadas. No es un simple promedio."
    ,
    question_en: "How is a 12x8 inch rectangular duct converted to its round equivalent diameter to use friction tables?",
    options_en: ["The equivalent diameter is calculated as the simple average of both dimensions: (12+8)/2 = 10 inches exactly", "The equivalent diameter is calculated with the formula: De = 1.3 x (axb)^0.625 / (a+b)^0.25 resulting in a similar duct", "The equivalent diameter is calculated as the square root of the product of both dimensions: sqrt(12x8) = 9.8 inches", "The equivalent diameter is calculated by adding both dimensions and multiplying by 0.5: (12+8)x0.5 = 10 inches exactly"],
    explanation_en: "The equivalent diameter formula is De = 1.3 x (axb)^0.625 / (a+b)^0.25. For 12x8: approximately 10.4 inches. It is not a simple average."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "Si la presión de velocidad medida con un tubo de Pitot en un ducto de 14 pulgadas es 0.15 IWC, ¿cuál es el CFM aproximado?",
      options: ["Aproximadamente 860 CFM calculado convirtiendo la presión de velocidad a FPM y multiplicando por el área del ducto", "Aproximadamente 1,050 CFM calculado convirtiendo la presión de velocidad a FPM y multiplicando por el área del ducto", "Aproximadamente 1,250 CFM calculado convirtiendo la presión de velocidad a FPM y multiplicando por el área del ducto", "Aproximadamente 1,450 CFM calculado convirtiendo la presión de velocidad a FPM y multiplicando por el área del ducto"],
      correct: 1,
      explanation: "V = 4,005 x raiz(0.15) = 4,005 x 0.387 = 1,550 FPM. Área = pi x (7/12)2 = 0.6793 ft2. CFM = 1,550 x 0.6793 = 1,053 CFM."
    ,
    question_en: "If the velocity pressure measured with a Pitot tube in a 14-inch duct is 0.15 IWC, what is the approximate CFM?",
    options_en: ["Approximately 860 CFM calculated by converting velocity pressure to FPM and multiplying by the duct area", "Approximately 1,050 CFM calculated by converting velocity pressure to FPM and multiplying by the duct area", "Approximately 1,250 CFM calculated by converting velocity pressure to FPM and multiplying by the duct area", "Approximately 1,450 CFM calculated by converting velocity pressure to FPM and multiplying by the duct area"],
    explanation_en: "V = 4,005 x sqrt(0.15) = 4,005 x 0.387 = 1,550 FPM. Area = pi x (7/12)2 = 0.6793 ft2. CFM = 1,550 x 0.6793 = 1,053 CFM."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "¿Cuál es la fórmula para calcular la capacidad total de enfriamiento del sistema usando la diferencia de entalpía del aire?",
      options: ["BTU/h total = CFM x 4.5 x delta-h, donde delta-h es la diferencia de entalpía en BTU/lb entre retorno y suministro", "BTU/h total = CFM x 1.08 x delta-h, donde delta-h es la diferencia de entalpía en BTU/lb entre retorno y suministro", "BTU/h total = CFM x 0.68 x delta-h, donde delta-h es la diferencia de entalpía en BTU/lb entre retorno y suministro", "BTU/h total = CFM x 2.54 x delta-h, donde delta-h es la diferencia de entalpía en BTU/lb entre retorno y suministro"],
      correct: 0,
      explanation: "BTU/h total = CFM x 4.5 x delta-h. La constante 4.5 = 0.075 lb/ft3 x 60 min/hr. La entalpía captura tanto el calor sensible como latente."
    ,
    question_en: "What is the formula to calculate total system cooling capacity using the air enthalpy difference?",
    options_en: ["Total BTU/h = CFM x 4.5 x delta-h, where delta-h is the enthalpy difference in BTU/lb between return and supply", "Total BTU/h = CFM x 1.08 x delta-h, where delta-h is the enthalpy difference in BTU/lb between return and supply", "Total BTU/h = CFM x 0.68 x delta-h, where delta-h is the enthalpy difference in BTU/lb between return and supply", "Total BTU/h = CFM x 2.54 x delta-h, where delta-h is the enthalpy difference in BTU/lb between return and supply"],
    explanation_en: "Total BTU/h = CFM x 4.5 x delta-h. The constant 4.5 = 0.075 lb/ft3 x 60 min/hr. Enthalpy captures both sensible and latent heat."
  },
    {
      category: "Fórmulas for Calculating Airflow",
      q: "Un técnico necesita calcular el área mínima de retorno para un sistema de 2.5 toneladas. Usando la regla de 2 in2 por CFM, ¿cuánto necesita?",
      options: ["Se necesitan al menos 1,500 pulgadas cuadradas de área libre para el retorno del sistema de dos toneladas y media", "Se necesitan al menos 2,000 pulgadas cuadradas de área libre para el retorno del sistema de dos toneladas y media", "Se necesitan al menos 2,500 pulgadas cuadradas de área libre para el retorno del sistema de dos toneladas y media", "Se necesitan al menos 3,000 pulgadas cuadradas de área libre para el retorno del sistema de dos toneladas y media"],
      correct: 1,
      explanation: "2.5 toneladas x 400 CFM/ton = 1,000 CFM. Área mínima = 1,000 CFM x 2 in2/CFM = 2,000 in2."
    ,
    question_en: "A technician needs to calculate the minimum return area for a 2.5-ton system. Using the rule of 2 sq in per CFM, how much is needed?",
    options_en: ["At least 1,500 square inches of free area for the two and a half ton system return", "At least 2,000 square inches of free area for the two and a half ton system return", "At least 2,500 square inches of free area for the two and a half ton system return", "At least 3,000 square inches of free area for the two and a half ton system return"],
    explanation_en: "2.5 tons x 400 CFM/ton = 1,000 CFM. Minimum area = 1,000 CFM x 2 sq in/CFM = 2,000 sq in."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Cuál es la diferencia fundamental entre calor sensible y calor latente en el contexto de un sistema de aire acondicionado?",
      options: ["El calor sensible se detecta con el oído y el calor latente se detecta con la vista usando instrumentos especiales", "El calor sensible cambia la temperatura del aire sin cambiar de fase y el latente cambia la humedad sin cambiar temperatura", "El calor sensible solo se genera por equipos eléctricos y el latente solo se produce por la respiración de los ocupantes", "El calor sensible se transmite por conducción y el latente se transmite exclusivamente por radiación infrarroja directa"],
      correct: 1,
      explanation: "El calor sensible cambia la temperatura del aire (medible con termómetro). El calor latente está asociado con cambios de fase del agua (evaporación/condensación) sin cambio de temperatura."
    ,
    question_en: "What is the fundamental difference between sensible heat and latent heat in the context of an air conditioning system?",
    options_en: ["Sensible heat is detected by ear and latent heat is detected by sight using special instruments", "Sensible heat changes air temperature without phase change and latent heat changes moisture without temperature change", "Sensible heat is only generated by electrical equipment and latent heat is only produced by occupant respiration", "Sensible heat is transmitted by conduction and latent heat is transmitted exclusively by direct infrared radiation"],
    explanation_en: "Sensible heat changes air temperature (measurable with a thermometer). Latent heat is associated with water phase changes (evaporation/condensation) without temperature change."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Qué es el Sensible Heat Ratio (SHR) y cuál es un valor típico para un sistema de aire acondicionado residencial en un clima húmedo?",
      options: ["Es la proporción de calor sensible entre calor total; un valor típico para clima húmedo es aproximadamente 0.95 a 1.00", "Es la proporción de calor latente entre calor total; un valor típico para clima húmedo es aproximadamente 0.55 a 0.65", "Es la proporción de calor sensible entre calor total; un valor típico para clima húmedo es aproximadamente 0.70 a 0.80", "Es la proporción de calor latente entre calor sensible; un valor típico para clima húmedo es cerca de 0.30 a 0.40"],
      correct: 2,
      explanation: "SHR = Calor Sensible / Calor Total. En climas húmedos, el SHR típico es 0.70-0.80, indicando que 70-80% de la carga es sensible y 20-30% es latente."
    ,
    question_en: "What is the Sensible Heat Ratio (SHR) and what is a typical value for a residential air conditioning system in a humid climate?",
    options_en: ["It is the ratio of sensible heat to total heat; a typical value for humid climates is approximately 0.95 to 1.00", "It is the ratio of latent heat to total heat; a typical value for humid climates is approximately 0.55 to 0.65", "It is the ratio of sensible heat to total heat; a typical value for humid climates is approximately 0.70 to 0.80", "It is the ratio of latent heat to sensible heat; a typical value for humid climates is about 0.30 to 0.40"],
    explanation_en: "SHR = Sensible Heat / Total Heat. In humid climates, the typical SHR is 0.70-0.80, indicating that 70-80% of the load is sensible and 20-30% is latent."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "En un diagrama psicrométrico, ¿qué representa la línea de proceso cuando el aire pasa a través del serpentín del evaporador?",
      options: ["Una línea horizontal moviéndose hacia la izquierda indicando solo enfriamiento sensible sin remoción de humedad", "Una línea diagonal descendente hacia la izquierda indicando enfriamiento sensible y deshumidificación simultánea", "Una línea vertical descendente indicando solo deshumidificación sin ningún cambio en la temperatura del bulbo seco", "Una línea diagonal ascendente hacia la derecha indicando calentamiento sensible con humidificación simultánea"],
      correct: 1,
      explanation: "Cuando el aire pasa por un serpentín frío por debajo del punto de rocío, se enfría (izquierda) Y se deshumidifica (abajo), trazando una línea diagonal en el diagrama."
    ,
    question_en: "On a psychrometric chart, what does the process line represent when air passes through the evaporator coil?",
    options_en: ["A horizontal line moving left indicating sensible cooling only without moisture removal", "A diagonal line descending to the left indicating simultaneous sensible cooling and dehumidification", "A vertical descending line indicating dehumidification only without any change in dry bulb temperature", "A diagonal line ascending to the right indicating sensible heating with simultaneous humidification"],
    explanation_en: "When air passes over a cold coil below the dew point, it cools (left) AND dehumidifies (down), tracing a diagonal line on the psychrometric chart."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Cuántas BTU de energía se requieren para evaporar una libra de agua a presión atmosférica estándar?",
      options: ["Aproximadamente 144 BTU por libra de agua, que es el calor latente de fusión del hielo a presión estándar", "Aproximadamente 540 BTU por libra de agua, que es el calor latente de vaporización a presión atmosférica estándar", "Aproximadamente 970 BTU por libra de agua, que es el calor latente de vaporización a presión atmosférica estándar", "Aproximadamente 1,440 BTU por libra de agua, que es el calor latente total incluyendo fusión y vaporización juntos"],
      correct: 2,
      explanation: "El calor latente de vaporización del agua es aproximadamente 970 BTU/lb a condiciones atmosféricas normales (212°F). A temperaturas más bajas es ligeramente mayor (~1,060 BTU/lb a 60°F)."
    ,
    question_en: "How many BTUs of energy are required to evaporate one pound of water at standard atmospheric pressure?",
    options_en: ["Approximately 144 BTU per pound of water, which is the latent heat of fusion of ice at standard pressure", "Approximately 540 BTU per pound of water, which is the latent heat of vaporization at standard atmospheric pressure", "Approximately 970 BTU per pound of water, which is the latent heat of vaporization at standard atmospheric pressure", "Approximately 1,440 BTU per pound of water, which is the total latent heat including fusion and vaporization together"],
    explanation_en: "The latent heat of water vaporization is approximately 970 BTU/lb at normal atmospheric conditions (212°F). At lower temperatures it is slightly higher (~1,060 BTU/lb at 60°F)."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "Si el aire de retorno tiene 55 grains/lb y el suministro tiene 45 grains/lb, con 1,000 CFM, ¿cuál es la carga latente removida?",
      options: ["Aproximadamente 4,800 BTU/h de carga latente removida por el serpentín evaporador según la fórmula de humedad", "Aproximadamente 6,800 BTU/h de carga latente removida por el serpentín evaporador según la fórmula de humedad", "Aproximadamente 8,800 BTU/h de carga latente removida por el serpentín evaporador según la fórmula de humedad", "Aproximadamente 10,800 BTU/h de carga latente removida por el serpentín evaporador según la fórmula de humedad"],
      correct: 1,
      explanation: "BTU/h latente = CFM x 0.68 x delta-w = 1,000 x 0.68 x (55-45) = 1,000 x 0.68 x 10 = 6,800 BTU/h."
    ,
    question_en: "If the return air has 55 grains/lb and the supply has 45 grains/lb, with 1,000 CFM, what is the latent load removed?",
    options_en: ["Approximately 4,800 BTU/h of latent load removed by the evaporator coil per the humidity formula", "Approximately 6,800 BTU/h of latent load removed by the evaporator coil per the humidity formula", "Approximately 8,800 BTU/h of latent load removed by the evaporator coil per the humidity formula", "Approximately 10,800 BTU/h of latent load removed by the evaporator coil per the humidity formula"],
    explanation_en: "Latent BTU/h = CFM x 0.68 x delta-w = 1,000 x 0.68 x (55-45) = 1,000 x 0.68 x 10 = 6,800 BTU/h."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Qué sucede con el calor latente cuando el aire húmedo pasa sobre un serpentín cuya temperatura está POR ENCIMA del punto de rocío?",
      options: ["Se remueve tanto calor sensible como latente porque cualquier superficie fría condensa humedad del aire de inmediato", "Solo se remueve calor sensible porque no ocurre condensación cuando el serpentín está sobre el punto de rocío del aire", "Se remueve principalmente calor latente porque el serpentín frío atrae las moléculas de agua por presión diferencial", "No se remueve ningún tipo de calor porque el serpentín debe estar bajo cero grados para funcionar correctamente siempre"],
      correct: 1,
      explanation: "Si la temperatura del serpentín está por encima del punto de rocío del aire, no ocurre condensación. Solo se remueve calor sensible (baja la temperatura) sin deshumidificación."
    ,
    question_en: "What happens with latent heat when humid air passes over a coil whose temperature is ABOVE the dew point?",
    options_en: ["Both sensible and latent heat are removed because any cold surface condenses air moisture immediately", "Only sensible heat is removed because no condensation occurs when the coil is above the air dew point", "Mainly latent heat is removed because the cold coil attracts water molecules by differential pressure", "No type of heat is removed because the coil must be below zero degrees to function correctly at all times"],
    explanation_en: "If the coil temperature is above the dew point of the air, no condensation occurs. Only sensible heat is removed (temperature decreases) without dehumidification."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Cuál es la temperatura de punto de rocío del aire cuando está a 75°F de bulbo seco y 50% de humedad relativa?",
      options: ["Aproximadamente 46°F de punto de rocío a las condiciones de bulbo seco y humedad relativa especificadas", "Aproximadamente 55°F de punto de rocío a las condiciones de bulbo seco y humedad relativa especificadas", "Aproximadamente 64°F de punto de rocío a las condiciones de bulbo seco y humedad relativa especificadas", "Aproximadamente 73°F de punto de rocío a las condiciones de bulbo seco y humedad relativa especificadas"],
      correct: 1,
      explanation: "A 75°F y 50% HR, el punto de rocío es aproximadamente 55°F. El serpentín del evaporador debe estar por debajo de esta temperatura para condensar humedad."
    ,
    question_en: "What is the air dew point temperature when it is at 75°F dry bulb and 50% relative humidity?",
    options_en: ["Approximately 46°F dew point at the specified dry bulb and relative humidity conditions", "Approximately 55°F dew point at the specified dry bulb and relative humidity conditions", "Approximately 64°F dew point at the specified dry bulb and relative humidity conditions", "Approximately 73°F dew point at the specified dry bulb and relative humidity conditions"],
    explanation_en: "At 75°F and 50% RH, the dew point is approximately 55°F. The evaporator coil must be below this temperature to condense moisture."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "En un sistema de AC, ¿cómo afecta aumentar la velocidad del ventilador del evaporador al ratio de calor sensible (SHR)?",
      options: ["Mayor velocidad del ventilador disminuye el SHR porque el serpentín opera más frío y condensa más humedad total", "Mayor velocidad del ventilador aumenta el SHR porque el aire pasa más rápido reduciendo el tiempo de deshumidificación", "Mayor velocidad del ventilador no afecta el SHR porque el serpentín mantiene la misma temperatura sin importar flujo", "Mayor velocidad del ventilador disminuye el SHR porque hay más contacto entre el aire húmedo y superficie fría del coil"],
      correct: 1,
      explanation: "Aumentar el CFM del ventilador sube la temperatura del serpentín, reduciendo la condensación. Más calor sensible se remueve proporcionalmente, aumentando el SHR."
    ,
    question_en: "In an AC system, how does increasing the evaporator fan speed affect the sensible heat ratio (SHR)?",
    options_en: ["Higher fan speed decreases the SHR because the coil operates colder and condenses more total moisture", "Higher fan speed increases the SHR because air passes faster reducing the dehumidification time", "Higher fan speed does not affect the SHR because the coil maintains the same temperature regardless of flow", "Higher fan speed decreases the SHR because there is more contact between humid air and the cold coil surface"],
    explanation_en: "Increasing fan CFM raises the coil temperature, reducing condensation. More sensible heat is removed proportionally, increasing the SHR."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Qué es la entalpía del aire y cómo se utiliza para calcular la capacidad TOTAL de un sistema de aire acondicionado?",
      options: ["Es la presión absoluta del aire húmedo; se usa multiplicándola por el volumen del ducto para calcular capacidad", "Es el contenido total de energía por libra de aire seco; incluye calor sensible y latente para calcular capacidad total", "Es la velocidad molecular promedio del aire; se usa dividiendo las BTU totales por la masa para obtener capacidad", "Es la densidad del aire húmedo en condiciones estándar; se multiplica por el flujo y temperatura para capacidad"],
      correct: 1,
      explanation: "La entalpía es el contenido total de energía (sensible + latente) por libra de aire seco, medida en BTU/lb."
    ,
    question_en: "What is air enthalpy and how is it used to calculate the TOTAL capacity of an air conditioning system?",
    options_en: ["It is the absolute pressure of moist air; used by multiplying it by the duct volume to calculate capacity", "It is the total energy content per pound of dry air; includes sensible and latent heat to calculate total capacity", "It is the average molecular velocity of air; used by dividing total BTUs by mass to obtain capacity", "It is the density of moist air at standard conditions; multiplied by flow and temperature for capacity"],
    explanation_en: "Enthalpy is the total energy content (sensible + latent) per pound of dry air, measured in BTU/lb."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Por qué un sistema de AC en Houston, Texas necesita mayor capacidad latente que un sistema idéntico en Phoenix, Arizona?",
      options: ["Porque Houston tiene temperaturas más altas que Phoenix durante el verano y el calor sensible extra se convierte latente", "Porque Houston tiene mucha mayor humedad absoluta exterior que Phoenix, requiriendo más energía para remover humedad", "Porque los códigos de construcción de Houston requieren mayor ventilación que los de Phoenix aumentando la carga latente", "Porque el suelo de Houston libera más humedad hacia las casas que el suelo desértico de Phoenix por capilaridad total"],
      correct: 1,
      explanation: "Houston tiene humedad absoluta mucho mayor que Phoenix (clima desértico). La mayor diferencia de humedad entre exterior e interior genera una carga latente significativamente mayor."
    ,
    question_en: "Why does an AC system in Houston, Texas need greater latent capacity than an identical system in Phoenix, Arizona?",
    options_en: ["Because Houston has higher temperatures than Phoenix during summer and the extra sensible heat converts to latent", "Because Houston has much higher outdoor absolute humidity than Phoenix, requiring more energy to remove moisture", "Because Houston building codes require more ventilation than Phoenix codes increasing the latent load", "Because Houston soil releases more moisture into homes than Phoenix desert soil through capillary action"],
    explanation_en: "Houston has much higher absolute humidity than Phoenix (desert climate). The greater humidity difference between outdoor and indoor generates a significantly higher latent load."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "Si un equipo tiene una capacidad total de 36,000 BTU/h y un SHR de 0.75, ¿cuántas BTU/h de calor latente está removiendo?",
      options: ["El equipo remueve 6,000 BTU/h de calor latente según el SHR y la capacidad total proporcionadas en el problema", "El equipo remueve 9,000 BTU/h de calor latente según el SHR y la capacidad total proporcionadas en el problema", "El equipo remueve 12,000 BTU/h de calor latente según el SHR y la capacidad total proporcionadas en el problema", "El equipo remueve 27,000 BTU/h de calor latente según el SHR y la capacidad total proporcionadas en el problema"],
      correct: 1,
      explanation: "Si SHR = 0.75, la capacidad sensible = 36,000 x 0.75 = 27,000 BTU/h. La capacidad latente = 36,000 - 27,000 = 9,000 BTU/h (25% de la capacidad total)."
    ,
    question_en: "If equipment has a total capacity of 36,000 BTU/h and an SHR of 0.75, how many BTU/h of latent heat is it removing?",
    options_en: ["The equipment removes 6,000 BTU/h of latent heat per the SHR and total capacity provided in the problem", "The equipment removes 9,000 BTU/h of latent heat per the SHR and total capacity provided in the problem", "The equipment removes 12,000 BTU/h of latent heat per the SHR and total capacity provided in the problem", "The equipment removes 27,000 BTU/h of latent heat per the SHR and total capacity provided in the problem"],
    explanation_en: "If SHR = 0.75, sensible capacity = 36,000 x 0.75 = 27,000 BTU/h. Latent capacity = 36,000 - 27,000 = 9,000 BTU/h (25% of total capacity)."
  },
    {
      category: "Latent Heat and Sensible Heat",
      q: "¿Qué indica una diferencia muy pequeña entre la temperatura de bulbo seco y la temperatura de bulbo húmedo del aire en una ubicación?",
      options: ["Indica que el aire está muy seco con baja humedad relativa y hay gran potencial para enfriamiento evaporativo efectivo", "Indica que el aire está muy húmedo con alta humedad relativa y hay poco potencial para enfriamiento evaporativo natural", "Indica que la presión barométrica es anormalmente baja y se deben aplicar factores de corrección por altitud al cálculo", "Indica que la temperatura del aire está cerca del punto de congelación y existe riesgo de formación de escarcha equipo"],
      correct: 1,
      explanation: "Cuando bulbo seco y bulbo húmedo son casi iguales, el aire está cerca de saturación (alta humedad relativa). Esto indica poco potencial de enfriamiento evaporativo y alta carga latente."
    ,
    question_en: "What does a very small difference between the dry bulb and wet bulb temperatures of air at a location indicate?",
    options_en: ["It indicates the air is very dry with low relative humidity and there is great potential for effective evaporative cooling", "It indicates the air is very humid with high relative humidity and there is little potential for natural evaporative cooling", "It indicates the barometric pressure is abnormally low and altitude correction factors must be applied to the calculation", "It indicates the air temperature is near freezing point and there is a risk of frost formation on equipment"],
    explanation_en: "When dry bulb and wet bulb are nearly equal, the air is near saturation (high relative humidity). This indicates little potential for evaporative cooling and high latent load."
  },
{
    category: "Manual J de ACCA",
    q: "Al realizar un cálculo de carga con Manual J, ¿qué factor se aplica primero antes de seleccionar el equipo?",
    options: ["El factor de corrección por altitud sobre el nivel del mar", "El factor de seguridad del 15% que exige el código local", "El factor de diversidad de carga por ocupación simultánea", "Ningún factor adicional; el resultado directo determina el equipo"],
    correct: 3,
    explanation: "Manual J produce la carga real del edificio y ACCA prohíbe agregar factores de seguridad arbitrarios. El resultado directo se usa para seleccionar el equipo sin inflarlo."
  ,
    question_en: "When performing a load calculation with Manual J, what factor is applied first before selecting equipment?",
    options_en: ["The altitude correction factor above sea level", "The 15% safety factor required by local code", "The load diversity factor for simultaneous occupancy", "No additional factor; the direct result determines the equipment"],
    explanation_en: "Manual J produces the actual building load and ACCA prohibits adding arbitrary safety factors. The direct result is used to select equipment without inflating it."
  },
  {
    category: "Manual J de ACCA",
    q: "En Manual J, ¿cómo se manejan las ganancias de calor internas generadas por los ocupantes de la vivienda?",
    options: ["Se calculan según la cantidad real de dormitorios más uno", "Se estiman usando 600 BTU sensible y 400 BTU latente cada uno", "Se ignoran porque no afectan significativamente la carga total", "Se incluyen solo cuando la ocupación supera seis personas fijas"],
    correct: 0,
    explanation: "Manual J establece que el número de ocupantes se calcula como la cantidad de dormitorios más uno. Esto estandariza la ganancia interna sin depender de la ocupación real declarada."
  ,
    question_en: "In Manual J, how are the internal heat gains generated by the dwelling occupants handled?",
    options_en: ["They are calculated based on the actual number of bedrooms plus one", "They are estimated using 600 BTU sensible and 400 BTU latent each", "They are ignored because they do not significantly affect the total load", "They are included only when occupancy exceeds six permanent people"],
    explanation_en: "Manual J establishes that the number of occupants is calculated as the number of bedrooms plus one. This standardizes internal gain without depending on the actual declared occupancy."
  },
  {
    category: "Manual J de ACCA",
    q: "¿Qué sucede si un contratista sobredimensiona el equipo en un 50% respecto al cálculo de Manual J?",
    options: ["El sistema enfría más rápido y mejora notablemente el confort", "El compresor trabaja menos y se extiende la vida útil del equipo", "El sistema hace ciclos cortos y no deshumidifica adecuadamente", "El consumo eléctrico se reduce porque los ciclos son más breves"],
    correct: 2,
    explanation: "Un equipo sobredimensionado realiza ciclos cortos (short cycling), no remueve suficiente humedad latente, causa fluctuaciones de temperatura y reduce el confort interior."
  ,
    question_en: "What happens if a contractor oversizes the equipment by 50% relative to the Manual J calculation?",
    options_en: ["The system cools faster and noticeably improves comfort", "The compressor works less and equipment life is extended", "The system short cycles and does not dehumidify adequately", "Electrical consumption is reduced because cycles are shorter"],
    explanation_en: "Oversized equipment performs short cycling, does not remove enough latent humidity, causes temperature fluctuations, and reduces indoor comfort."
  },
  {
    category: "Manual J de ACCA",
    q: "En el cálculo de carga de enfriamiento de Manual J, ¿qué orientación de ventana produce la mayor ganancia solar en verano?",
    options: ["Las ventanas orientadas al norte por la radiación difusa prolongada", "Las ventanas orientadas al este y oeste por el ángulo solar bajo", "Las ventanas orientadas al sur por la exposición solar más directa", "Todas las orientaciones producen ganancias solares prácticamente iguales"],
    correct: 1,
    explanation: "En verano, el sol tiene un ángulo bajo al amanecer (este) y al atardecer (oeste), lo que produce radiación directa intensa a través de las ventanas. El sur recibe menos ganancia porque el sol está alto."
  ,
    question_en: "In the Manual J cooling load calculation, what window orientation produces the greatest solar gain in summer?",
    options_en: ["North-facing windows due to prolonged diffuse radiation", "East and west-facing windows due to the low solar angle", "South-facing windows due to the most direct solar exposure", "All orientations produce practically equal solar gains"],
    explanation_en: "In summer, the sun has a low angle at sunrise (east) and sunset (west), which produces intense direct radiation through windows. The south receives less gain because the sun is high overhead."
  },
  {
    category: "Manual D de ACCA",
    q: "Según Manual D, ¿cuál es la velocidad máxima recomendada del aire en ductos troncales residenciales para minimizar el ruido?",
    options: ["Aproximadamente 500 pies por minuto en troncales principales", "Aproximadamente 700 pies por minuto en troncales principales", "Aproximadamente 900 pies por minuto en troncales principales", "Aproximadamente 1100 pies por minuto en troncales principales"],
    correct: 2,
    explanation: "Manual D recomienda un máximo de 900 FPM en ductos troncales principales residenciales. Velocidades superiores generan niveles de ruido inaceptables para los ocupantes."
  ,
    question_en: "According to Manual D, what is the maximum recommended air velocity in residential trunk ducts to minimize noise?",
    options_en: ["Approximately 500 feet per minute in main trunks", "Approximately 700 feet per minute in main trunks", "Approximately 900 feet per minute in main trunks", "Approximately 1100 feet per minute in main trunks"],
    explanation_en: "Manual D recommends a maximum of 900 FPM in residential main trunk ducts. Higher velocities generate unacceptable noise levels for occupants."
  },
  {
    category: "Manual D de ACCA",
    q: "En el método de fricción equivalente de Manual D, ¿qué representa la longitud equivalente de un codo de radio estándar?",
    options: ["La longitud de ducto recto que produce la misma caída de presión", "La longitud de ducto recto que produce el mismo nivel de ruido audible", "La longitud de ducto recto que produce la misma velocidad de salida", "La longitud de ducto recto que produce la misma distribución de flujo"],
    correct: 0,
    explanation: "La longitud equivalente convierte la resistencia de un accesorio (codo, transición, etc.) en la longitud de ducto recto que produciría la misma caída de presión estática."
  ,
    question_en: "In the Manual D equivalent friction method, what does the equivalent length of a standard radius elbow represent?",
    options_en: ["The length of straight duct that produces the same pressure drop", "The length of straight duct that produces the same audible noise level", "The length of straight duct that produces the same outlet velocity", "The length of straight duct that produces the same flow distribution"],
    explanation_en: "Equivalent length converts the resistance of a fitting (elbow, transition, etc.) into the length of straight duct that would produce the same static pressure drop."
  },
  {
    category: "Manual D de ACCA",
    q: "Al diseñar ductos con Manual D, ¿qué presión estática disponible se asigna típicamente al sistema de ductos en una unidad residencial estándar?",
    options: ["Toda la presión estática total que genera el ventilador del equipo", "La presión total del ventilador menos las pérdidas del serpentín y filtro", "Solo la presión indicada en la placa del fabricante sin reducciones", "La mitad exacta de la presión total que genera el ventilador del equipo"],
    correct: 1,
    explanation: "La presión estática disponible para los ductos es la presión total del ventilador menos las pérdidas de los componentes internos (serpentín, filtro, etc.). Esto es lo que queda para mover aire por los ductos."
  ,
    question_en: "When designing ducts with Manual D, what available static pressure is typically assigned to the duct system in a standard residential unit?",
    options_en: ["All the total static pressure generated by the equipment fan", "The fan total pressure minus the coil and filter losses", "Only the pressure indicated on the manufacturer's plate without reductions", "Exactly half the total pressure generated by the equipment fan"],
    explanation_en: "The available static pressure for the ducts is the total fan pressure minus the losses of internal components (coil, filter, etc.). This is what remains to move air through the ducts."
  },
  {
    category: "Manual D de ACCA",
    q: "Según Manual D, cuando se usa ducto flexible en una instalación residencial, ¿qué factor crítico aumenta drásticamente la caída de presión?",
    options: ["Instalar el ducto flexible con más de cuatro soportes metálicos", "Instalar el ducto flexible con curvas cerradas y sin estirar completamente", "Instalar el ducto flexible en espacios con temperatura ambiente muy elevada", "Instalar el ducto flexible con aislamiento de espesor superior a R-8 nominal"],
    correct: 1,
    explanation: "El ducto flexible sin estirar completamente y con curvas cerradas genera una superficie interior corrugada y turbulenta que puede multiplicar la caída de presión por tres o más veces."
  ,
    question_en: "According to Manual D, when using flexible duct in a residential installation, what critical factor drastically increases pressure drop?",
    options_en: ["Installing the flexible duct with more than four metal supports", "Installing the flexible duct with tight bends and without stretching it completely", "Installing the flexible duct in spaces with very high ambient temperature", "Installing the flexible duct with insulation thickness exceeding R-8 nominal"],
    explanation_en: "Flexible duct that is not fully stretched and has tight bends creates a corrugated and turbulent interior surface that can multiply pressure drop by three or more times."
  },
  {
    category: "System Airflow",
    q: "En un sistema de aire acondicionado residencial estándar, ¿cuál es el flujo de aire recomendado por tonelada de refrigeración?",
    options: ["Aproximadamente 200 CFM por cada tonelada de refrigeración nominal", "Aproximadamente 300 CFM por cada tonelada de refrigeración nominal", "Aproximadamente 400 CFM por cada tonelada de refrigeración nominal", "Aproximadamente 500 CFM por cada tonelada de refrigeración nominal"],
    correct: 2,
    explanation: "La regla estándar de la industria es 400 CFM por tonelada. Esto asegura una transferencia de calor adecuada en el evaporador y mantiene la temperatura del serpentín por encima del punto de congelación."
  ,
    question_en: "In a standard residential air conditioning system, what is the recommended airflow per ton of refrigeration?",
    options_en: ["Approximately 200 CFM per ton of nominal refrigeration", "Approximately 300 CFM per ton of nominal refrigeration", "Approximately 400 CFM per ton of nominal refrigeration", "Approximately 500 CFM per ton of nominal refrigeration"],
    explanation_en: "The industry standard rule is 400 CFM per ton. This ensures adequate heat transfer in the evaporator and keeps the coil temperature above the freezing point."
  },
  {
    category: "System Airflow",
    q: "Si el flujo de aire a través del evaporador cae muy por debajo de los 400 CFM por tonelada, ¿cuál es la consecuencia más peligrosa?",
    options: ["El compresor se sobrecalienta por exceso de gas caliente en el retorno", "El serpentín del evaporador se congela y puede dañar el compresor por golpe", "El ventilador del condensador se detiene por la señal de baja velocidad", "La válvula de expansión se cierra completamente impidiendo todo el flujo"],
    correct: 1,
    explanation: "Con flujo de aire insuficiente, la temperatura del evaporador cae por debajo de 32°F, se forma hielo y el refrigerante líquido puede regresar al compresor causando un golpe de líquido (slugging)."
  ,
    question_en: "If airflow through the evaporator falls well below 400 CFM per ton, what is the most dangerous consequence?",
    options_en: ["The compressor overheats from excess hot gas in the return", "The evaporator coil freezes and can damage the compressor from slugging", "The condenser fan stops due to the low speed signal", "The expansion valve closes completely preventing all flow"],
    explanation_en: "With insufficient airflow, the evaporator temperature drops below 32°F, ice forms, and liquid refrigerant can return to the compressor causing liquid slugging damage."
  },
  {
    category: "System Airflow",
    q: "¿Qué indica una diferencia de temperatura (delta T) del aire superior a 22°F a través del evaporador en un sistema estándar?",
    options: ["Que el sistema tiene una carga de refrigerante óptima y bien calibrada", "Que el flujo de aire es insuficiente y el serpentín está sobre-enfriando", "Que el flujo de aire es excesivo y el serpentín no enfría lo suficiente", "Que el sistema tiene demasiado refrigerante y necesita recuperar la carga"],
    correct: 1,
    explanation: "Un delta T por encima de 22°F generalmente indica flujo de aire bajo. El aire pasa demasiado lento por el serpentín, se enfría en exceso, y el rango normal es entre 14°F y 22°F."
  ,
    question_en: "What does an air temperature difference (delta T) greater than 22°F across the evaporator indicate in a standard system?",
    options_en: ["That the system has an optimal and well-calibrated refrigerant charge", "That the airflow is insufficient and the coil is overcooling", "That the airflow is excessive and the coil is not cooling enough", "That the system has too much refrigerant and needs charge recovery"],
    explanation_en: "A delta T above 22°F generally indicates low airflow. The air passes too slowly through the coil and gets overcooled; the normal range is between 14°F and 22°F."
  },
  {
    category: "System Airflow",
    q: "En un sistema residencial con ductos, ¿cuál es la consecuencia principal de tener más aire de retorno que de suministro?",
    options: ["Se genera presión positiva en la casa empujando el aire hacia afuera", "Se genera presión negativa en la casa atrayendo aire exterior no tratado", "Se equilibra automáticamente mediante las rejillas de transferencia internas", "Se activa el control de presión del ventilador reduciendo las revoluciones"],
    correct: 1,
    explanation: "Si el retorno mueve más aire que el suministro, se crea presión negativa dentro de la vivienda. Esto succiona aire caliente y húmedo del exterior a través de grietas, aumentando la carga y los costos."
  ,
    question_en: "In a residential system with ducts, what is the main consequence of having more return air than supply air?",
    options_en: ["Positive pressure is generated in the house pushing air outward", "Negative pressure is generated in the house attracting untreated outside air", "It is automatically balanced through internal transfer grilles", "The fan pressure control activates reducing the RPM"],
    explanation_en: "If the return moves more air than the supply, negative pressure is created inside the dwelling. This sucks hot and humid outdoor air through cracks, increasing load and costs."
  },
  {
    category: "Fórmulas for Calculating Airflow",
    q: "En la fórmula CFM = BTU / (1.08 × ΔT), ¿qué representa la constante 1.08 y de dónde se deriva?",
    options: ["Es el calor específico del aire multiplicado por la densidad estándar solamente", "Es el producto de densidad del aire, calor específico y el factor 60 minutos", "Es una constante empírica establecida por ASHRAE sin derivación matemática", "Es el factor de corrección por altitud para ciudades a nivel del mar estándar"],
    correct: 1,
    explanation: "La constante 1.08 = 0.075 lb/ft³ (densidad) × 0.24 BTU/lb·°F (calor específico) × 60 min/hr. Combina estas tres propiedades para convertir CFM y ΔT en BTU/hr de calor sensible."
  ,
    question_en: "In the formula CFM = BTU / (1.08 x delta-T), what does the constant 1.08 represent and where is it derived from?",
    options_en: ["It is the specific heat of air multiplied by the standard density only", "It is the product of air density, specific heat, and the factor of 60 minutes", "It is an empirical constant established by ASHRAE without mathematical derivation", "It is the altitude correction factor for cities at standard sea level"],
    explanation_en: "The constant 1.08 = 0.075 lb/ft3 (density) x 0.24 BTU/lb-F (specific heat) x 60 min/hr. It combines these three properties to convert CFM and delta-T into BTU/hr of sensible heat."
  },
  {
    category: "Fórmulas for Calculating Airflow",
    q: "Para calcular el calor total removido incluyendo la deshumidificación, ¿qué fórmula se utiliza correctamente?",
    options: ["BTU total = 1.08 × CFM × ΔT sumando temperaturas seca y húmeda", "BTU total = 4.5 × CFM × Δh donde Δh es la diferencia de entalpía", "BTU total = 0.68 × CFM × ΔGr donde ΔGr son granos de humedad removidos", "BTU total = CFM × densidad × calor específico × diferencia de presión total"],
    correct: 1,
    explanation: "Para calor total (sensible + latente), se usa Q = 4.5 × CFM × Δh, donde 4.5 es la constante que incluye densidad y conversión, y Δh es la diferencia de entalpía del aire en BTU/lb."
  ,
    question_en: "To calculate total heat removed including dehumidification, what formula is correctly used?",
    options_en: ["Total BTU = 1.08 x CFM x delta-T adding dry and wet bulb temperatures", "Total BTU = 4.5 x CFM x delta-h where delta-h is the enthalpy difference", "Total BTU = 0.68 x CFM x delta-Gr where delta-Gr is grains of moisture removed", "Total BTU = CFM x density x specific heat x total pressure difference"],
    explanation_en: "For total heat (sensible + latent), Q = 4.5 x CFM x delta-h is used, where 4.5 is the constant including density and conversion, and delta-h is the air enthalpy difference in BTU/lb."
  },
  {
    category: "Fórmulas for Calculating Airflow",
    q: "Al medir el flujo de aire con un tubo de Pitot, ¿qué fórmula convierte la presión de velocidad en velocidad del aire?",
    options: ["Velocidad en FPM = 4005 × raíz cuadrada de la presión de velocidad", "Velocidad en FPM = 1096 × raíz cuadrada de la presión de velocidad", "Velocidad en FPM = 2500 × raíz cuadrada de la presión de velocidad", "Velocidad en FPM = 3160 × raíz cuadrada de la presión de velocidad"],
    correct: 0,
    explanation: "La fórmula estándar es V = 4005 × √VP, donde V es la velocidad en pies por minuto y VP es la presión de velocidad en pulgadas de columna de agua medida con el tubo de Pitot."
  ,
    question_en: "When measuring airflow with a Pitot tube, what formula converts velocity pressure to air velocity?",
    options_en: ["Velocity in FPM = 4005 x square root of velocity pressure", "Velocity in FPM = 1096 x square root of velocity pressure", "Velocity in FPM = 2500 x square root of velocity pressure", "Velocity in FPM = 3160 x square root of velocity pressure"],
    explanation_en: "The standard formula is V = 4005 x sqrt(VP), where V is velocity in feet per minute and VP is velocity pressure in inches of water column measured with the Pitot tube."
  },
  {
    category: "Fórmulas for Calculating Airflow",
    q: "Si un sistema de 3 toneladas tiene un delta T de 18°F a través del evaporador, ¿cuántos CFM reales está moviendo según la fórmula sensible?",
    options: ["Aproximadamente 1,852 CFM reales a través del serpentín evaporador", "Aproximadamente 1,200 CFM reales a través del serpentín evaporador", "Aproximadamente 1,543 CFM reales a través del serpentín evaporador", "Aproximadamente 1,389 CFM reales a través del serpentín evaporador"],
    correct: 0,
    explanation: "Usando CFM = BTU / (1.08 × ΔT), con 3 toneladas = 36,000 BTU/hr: CFM = 36,000 / (1.08 × 18) = 36,000 / 19.44 = 1,852 CFM. Esto es más que los 1,200 CFM ideales (400 × 3), confirmando que un delta T bajo indica exceso de flujo de aire."
  ,
    question_en: "If a 3-ton system has a delta T of 18°F across the evaporator, how many actual CFM is it moving according to the sensible formula?",
    options_en: ["Approximately 1,852 actual CFM through the evaporator coil", "Approximately 1,200 actual CFM through the evaporator coil", "Approximately 1,543 actual CFM through the evaporator coil", "Approximately 1,389 actual CFM through the evaporator coil"],
    explanation_en: "Using CFM = BTU / (1.08 x delta-T), with 3 tons = 36,000 BTU/hr: CFM = 36,000 / (1.08 x 18) = 36,000 / 19.44 = 1,852 CFM. This is more than the ideal 1,200 CFM (400 x 3), confirming that a low delta T indicates excess airflow."
  }
],

// ─── NIVEL 5: Ductos, Heat Pumps, Mini Splits, Gas Furnace, Airflow, Diseño (250 preguntas) ───
nivel5: [
  // ── Ductos (~45 preguntas) ──
  {
    category: "Ductos",
    q: "¿Cuál es la velocidad máxima recomendada de aire en ductos principales residenciales?",
    options: ["400 pies por minuto de velocidad máxima de aire", "600 pies por minuto de velocidad máxima de aire", "900 pies por minuto de velocidad máxima de aire", "1200 pies por minuto de velocidad máxima de aire"],
    correct: 2,
    explanation: "En ductos principales residenciales, la velocidad máxima recomendada es ~900 FPM para minimizar ruido."
  ,
    question_en: "What is the maximum recommended air velocity in residential main ducts?",
    options_en: ["400 feet per minute maximum air velocity", "600 feet per minute maximum air velocity", "900 feet per minute maximum air velocity", "1200 feet per minute maximum air velocity"],
    explanation_en: "In residential main ducts, the maximum recommended velocity is ~900 FPM to minimize noise."
  },
  {
    category: "Ductos",
    q: "¿Qué manual de ACCA se usa para calcular el tamaño correcto de ductos residenciales?",
    options: ["Manual J para cálculo de carga térmica del edificio", "Manual D para diseño y dimensionamiento de ductos", "Manual S para selección de equipo HVAC adecuado", "Manual T para diseño de difusores y registros salida"],
    correct: 1,
    explanation: "Manual D de ACCA es el estándar para diseño y dimensionamiento de sistemas de ductos."
  ,
    question_en: "Which ACCA manual is used to calculate the correct size of residential ducts?",
    options_en: ["Manual J for building thermal load calculation", "Manual D for duct design and sizing", "Manual S for proper HVAC equipment selection", "Manual T for diffuser and register outlet design"],
    explanation_en: "ACCA Manual D is the standard for duct system design and sizing."
  },
  {
    category: "Ductos",
    q: "¿Qué tipo de ducto flexible tiene la mayor restricción de flujo de aire comparado con ducto rígido?",
    options: ["El ducto flexible tiene menos restricción que el rígido", "El ducto flexible tiene más restricción por su interior rugoso", "Ambos tipos tienen exactamente la misma restricción de aire", "Solo el ducto de fibra de vidrio tiene restricción de flujo"],
    correct: 1,
    explanation: "El interior corrugado del flex duct crea turbulencia y fricción, con hasta 50% más restricción que rígido."
  ,
    question_en: "What type of flexible duct has the greatest airflow restriction compared to rigid duct?",
    options_en: ["Flexible duct has less restriction than rigid duct", "Flexible duct has more restriction due to its rough interior", "Both types have exactly the same air restriction", "Only fiberglass duct has flow restriction"],
    explanation_en: "The corrugated interior of flex duct creates turbulence and friction, with up to 50% more restriction than rigid."
  },
  {
    category: "Ductos",
    q: "¿Cuántos CFM de aire por tonelada de enfriamiento se requieren como regla general?",
    options: ["200 CFM por tonelada de enfriamiento como regla base", "300 CFM por tonelada de enfriamiento como regla base", "400 CFM por tonelada de enfriamiento como regla base", "500 CFM por tonelada de enfriamiento como regla base"],
    correct: 2,
    explanation: "La regla general es 400 CFM por tonelada. Un sistema de 3 ton necesita ~1,200 CFM."
  ,
    question_en: "How many CFM of air per ton of cooling are required as a general rule?",
    options_en: ["200 CFM per ton of cooling as a base rule", "300 CFM per ton of cooling as a base rule", "400 CFM per ton of cooling as a base rule", "500 CFM per ton of cooling as a base rule"],
    explanation_en: "The general rule is 400 CFM per ton. A 3-ton system needs ~1,200 CFM."
  },
  {
    category: "Ductos",
    q: "¿Qué sucede si el sistema de ductos tiene demasiadas fugas de aire?",
    options: ["El sistema enfría mejor porque el aire se distribuye más", "Se pierde hasta 30% de capacidad y la eficiencia baja mucho", "Las fugas ayudan a ventilar el espacio naturalmente al aire", "No afecta el rendimiento si las fugas son menores a 50%"],
    correct: 1,
    explanation: "Fugas en ductos pueden perder 20-30% del aire acondicionado, desperdiciando energía y reduciendo confort."
  ,
    question_en: "What happens if the duct system has too many air leaks?",
    options_en: ["The system cools better because air distributes more", "Up to 30% of capacity is lost and efficiency drops significantly", "The leaks help naturally ventilate the space", "It does not affect performance if leaks are less than 50%"],
    explanation_en: "Duct leaks can lose 20-30% of conditioned air, wasting energy and reducing comfort."
  },
  {
    category: "Ductos",
    q: "¿Con qué material se sellan las juntas de ductos de lámina galvanizada según código actual?",
    options: ["Con cinta adhesiva tipo duct tape de tela gris común", "Con sellador de ductos (mastic) o cinta metálica UL 181B", "Con silicón transparente de uso general para construcción", "Con pegamento de contacto aplicado en ambas superficies"],
    correct: 1,
    explanation: "Mastic o cinta metálica aprobada UL 181B. La duct tape de tela NO es aceptable para ductos HVAC."
  ,
    question_en: "What material is used to seal galvanized sheet metal duct joints per current code?",
    options_en: ["With common gray cloth duct tape adhesive type", "With duct sealant (mastic) or UL 181B listed metallic tape", "With clear general-purpose construction silicone", "With contact cement applied to both surfaces"],
    explanation_en: "Mastic or UL 181B approved metallic tape. Cloth duct tape is NOT acceptable for HVAC ducts."
  },
  {
    category: "Ductos",
    q: "¿Qué calibre de lámina galvanizada se usa típicamente para ductos principales de 24\" en residencial?",
    options: ["Calibre 30 de lámina galvanizada para ductos grandes", "Calibre 26 de lámina galvanizada para ductos grandes", "Calibre 22 de lámina galvanizada para ductos grandes", "Calibre 18 de lámina galvanizada para ductos grandes"],
    correct: 1,
    explanation: "Calibre 26 es estándar para ductos residenciales principales de hasta 24\". Ductos más grandes usan 24 o 22."
  ,
    question_en: "What gauge of galvanized sheet metal is typically used for 24-inch residential main ducts?",
    options_en: ["30 gauge galvanized sheet metal for large ducts", "26 gauge galvanized sheet metal for large ducts", "22 gauge galvanized sheet metal for large ducts", "18 gauge galvanized sheet metal for large ducts"],
    explanation_en: "26 gauge is standard for residential main ducts up to 24 inches. Larger ducts use 24 or 22 gauge."
  },
  {
    category: "Ductos",
    q: "¿Qué es la presión estática en un sistema de ductos y cómo se mide?",
    options: ["La velocidad del aire medida con anemómetro de paletas", "La presión del aire contra las paredes del ducto en WC pulgadas", "La temperatura del aire dentro del ducto medida con termómetro", "La humedad relativa del aire dentro del ducto con higrómetro"],
    correct: 1,
    explanation: "Presión estática = presión del aire empujando contra las paredes. Se mide en pulgadas de columna de agua (WC)."
  ,
    question_en: "What is static pressure in a duct system and how is it measured?",
    options_en: ["The air velocity measured with a vane anemometer", "The air pressure against the duct walls in inches WC", "The air temperature inside the duct measured with a thermometer", "The relative humidity of air inside the duct with a hygrometer"],
    explanation_en: "Static pressure = pressure of air pushing against the walls. Measured in inches of water column (WC)."
  },
  {
    category: "Ductos",
    q: "¿Cuál es la presión estática externa máxima típica para un air handler residencial estándar?",
    options: ["0.10 pulgadas de columna de agua como máximo normal", "0.25 pulgadas de columna de agua como máximo normal", "0.50 pulgadas de columna de agua como máximo normal", "1.00 pulgadas de columna de agua como máximo normal"],
    correct: 2,
    explanation: "La mayoría de air handlers residenciales están diseñados para máximo 0.50\" WC de presión estática externa."
  ,
    question_en: "What is the typical maximum external static pressure for a standard residential air handler?",
    options_en: ["0.10 inches of water column as normal maximum", "0.25 inches of water column as normal maximum", "0.50 inches of water column as normal maximum", "1.00 inches of water column as normal maximum"],
    explanation_en: "Most residential air handlers are designed for a maximum of 0.50 inches WC of external static pressure."
  },
  {
    category: "Ductos",
    q: "Si la presión estática es muy alta en el sistema de ductos, ¿qué problemas causa?",
    options: ["Mayor flujo de aire y mejor distribución en las habitaciones", "Menor flujo de aire, ruido excesivo y mayor consumo energético", "Mejor filtración porque el aire pasa más lento por el filtro", "No causa problemas si el motor del ventilador es suficiente"],
    correct: 1,
    explanation: "Alta presión estática = restricción = menos CFM, más ruido, motor trabajando más duro, mayor consumo."
  ,
    question_en: "If static pressure is too high in the duct system, what problems does it cause?",
    options_en: ["Greater airflow and better distribution in rooms", "Lower airflow, excessive noise, and higher energy consumption", "Better filtration because air passes more slowly through the filter", "No problems if the fan motor is sufficient"],
    explanation_en: "High static pressure = restriction = less CFM, more noise, motor working harder, higher consumption."
  },
  {
    category: "Ductos",
    q: "¿Cuál es el largo máximo recomendado para una corrida de ducto flexible sin soporte?",
    options: ["04 pies de largo máximo sin soporte intermedio", "08 pies de largo máximo sin soporte intermedio", "15 pies de largo máximo sin soporte intermedio", "25 pies de largo máximo sin soporte intermedio"],
    correct: 3,
    explanation: "El ducto flex no debe exceder 25 pies de largo. Corridas más largas causan restricción excesiva."
  ,
    question_en: "What is the maximum recommended length for a flexible duct run without support?",
    options_en: ["04 feet maximum length without intermediate support", "08 feet maximum length without intermediate support", "15 feet maximum length without intermediate support", "25 feet maximum length without intermediate support"],
    explanation_en: "Flex duct should not exceed 25 feet in length. Longer runs cause excessive restriction."
  },
  {
    category: "Ductos",
    q: "¿A qué distancia máxima deben estar los soportes de ducto flexible colgado?",
    options: ["Cada 2 pies de distancia entre soportes de ducto flex", "Cada 4 pies de distancia entre soportes de ducto flex", "Cada 6 pies de distancia entre soportes de ducto flex", "Cada 8 pies de distancia entre soportes de ducto flex"],
    correct: 1,
    explanation: "Los soportes de ducto flex deben estar cada 4 pies máximo para evitar que se cuelgue y restrinja flujo."
  ,
    question_en: "What is the maximum distance between supports for hanging flexible duct?",
    options_en: ["Every 2 feet between flex duct supports", "Every 4 feet between flex duct supports", "Every 6 feet between flex duct supports", "Every 8 feet between flex duct supports"],
    explanation_en: "Flex duct supports must be every 4 feet maximum to prevent sagging and flow restriction."
  },
  {
    category: "Ductos",
    q: "¿Cuál es la caída máxima permitida (sag) entre soportes de ducto flexible?",
    options: ["1/4 de pulgada por pie de distancia entre soportes", "1/2 de pulgada por pie de distancia entre soportes", "1 pulgada completa por pie de distancia entre soportes", "2 pulgadas completas por pie de distancia entre soportes"],
    correct: 1,
    explanation: "La caída máxima es 1/2\" por pie entre soportes. Exceso de caída crea bolsas que restringen el flujo."
  ,
    question_en: "What is the maximum allowable sag between flexible duct supports?",
    options_en: ["1/4 inch drop per foot of distance between supports", "1/2 inch drop per foot of distance between supports", "1 full inch drop per foot of distance between supports", "2 full inches drop per foot of distance between supports"],
    explanation_en: "Maximum sag is 1/2 inch per foot between supports. Excessive sag creates pockets that restrict flow."
  },
  {
    category: "Ductos",
    q: "¿Qué tipo de registro (register) se usa para suministro de aire en el piso de una habitación?",
    options: ["Registro de retorno con filtro lavable integrado", "Registro de piso con deflectores ajustables direccionales", "Difusor de techo cuadrado de 4 vías para suministro", "Rejilla de transferencia sin marco para pared interior"],
    correct: 1,
    explanation: "Los registros de piso tienen deflectores ajustables para dirigir el aire hacia arriba y alrededor del cuarto."
  ,
    question_en: "What type of register is used for floor-level air supply in a room?",
    options_en: ["Return register with integrated washable filter", "Floor register with adjustable directional deflectors", "Square four-way ceiling diffuser for supply", "Transfer grille without frame for interior wall"],
    explanation_en: "Floor registers have adjustable deflectors to direct air upward and around the room."
  },
  {
    category: "Ductos",
    q: "¿Por qué el ducto de retorno debe ser igual o más grande que el ducto de suministro?",
    options: ["Para que el aire sea más frío al regresar al evaporador", "Para asegurar flujo de aire adecuado sin presión negativa alta", "Para que el filtro de aire dure más tiempo sin reemplazar", "Para reducir el ruido del ventilador en la habitación interior"],
    correct: 1,
    explanation: "Retorno subdimensionado = presión negativa alta = menos flujo, más consumo, posibles fugas de aire."
  ,
    question_en: "Why must the return duct be equal to or larger than the supply duct?",
    options_en: ["So the air is colder when returning to the evaporator", "To ensure adequate airflow without high negative pressure", "So the air filter lasts longer without replacement", "To reduce fan noise in the interior room"],
    explanation_en: "Undersized return = high negative pressure = less flow, more consumption, possible air leaks."
  },
  // ── Heat Pumps (~45 preguntas) ──
  {
    category: "Heat Pumps",
    q: "¿Cuál es la diferencia fundamental entre un aire acondicionado y una bomba de calor?",
    options: ["La bomba de calor solo enfría, no puede calentar nunca", "La bomba de calor puede invertir el ciclo para calentar y enfriar", "El aire acondicionado usa refrigerante y la bomba usa agua", "No hay diferencia, son exactamente el mismo equipo siempre"],
    correct: 1,
    explanation: "La bomba de calor tiene válvula reversible de 4 vías que invierte el flujo para modo calefacción."
  ,
    question_en: "What is the fundamental difference between an air conditioner and a heat pump?",
    options_en: ["A heat pump can only cool, it can never heat", "A heat pump can reverse the cycle to heat and cool", "An air conditioner uses refrigerant and a heat pump uses water", "There is no difference, they are always exactly the same equipment"],
    explanation_en: "A heat pump has a reversing valve (4-way valve) that reverses the flow for heating mode."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué componente permite a la bomba de calor cambiar entre modo frío y modo calor?",
    options: ["El termostato programable con sensor de temperatura", "La válvula reversible de 4 vías del circuito refrigerante", "El capacitor dual de arranque y marcha del compresor", "El transformador reductor de voltaje del circuito control"],
    correct: 1,
    explanation: "La válvula de 4 vías invierte la dirección del flujo de refrigerante entre condensador y evaporador."
  ,
    question_en: "What component allows a heat pump to switch between cooling and heating mode?",
    options_en: ["The programmable thermostat with temperature sensor", "The 4-way reversing valve in the refrigerant circuit", "The dual start and run capacitor of the compressor", "The step-down voltage transformer of the control circuit"],
    explanation_en: "The 4-way valve reverses the direction of refrigerant flow between the condenser and evaporator."
  },
  {
    category: "Heat Pumps",
    q: "En modo calefacción de una bomba de calor, ¿cuál serpentín actúa como evaporador?",
    options: ["El serpentín interior absorbe calor del aire interior", "El serpentín exterior absorbe calor del aire exterior frío", "Ambos serpentines actúan como evaporador al mismo tiempo", "Ningún serpentín actúa como evaporador en modo calefacción"],
    correct: 1,
    explanation: "En calefacción, el serpentín exterior es el evaporador — absorbe calor del aire exterior."
  ,
    question_en: "In heating mode of a heat pump, which coil acts as the evaporator?",
    options_en: ["The indoor coil absorbs heat from the indoor air", "The outdoor coil absorbs heat from the cold outdoor air", "Both coils act as evaporator at the same time", "No coil acts as evaporator in heating mode"],
    explanation_en: "In heating mode, the outdoor coil is the evaporator -- it absorbs heat from the outdoor air."
  },
  {
    category: "Heat Pumps",
    q: "¿Por qué una bomba de calor necesita un ciclo de deshielo (defrost) en invierno?",
    options: ["Para derretir la nieve del techo donde está instalada", "Para remover el hielo que se forma en el serpentín exterior", "Para calentar el refrigerante que se congela dentro del tubo", "Para descongelar el filtro de aire interior que se congela"],
    correct: 1,
    explanation: "En modo calor con aire frío exterior, se forma escarcha en el serpentín exterior que bloquea el flujo de aire."
  ,
    question_en: "Why does a heat pump need a defrost cycle in winter?",
    options_en: ["To melt snow from the roof where it is installed", "To remove ice that forms on the outdoor coil", "To warm the refrigerant that freezes inside the tubing", "To defrost the indoor air filter that freezes"],
    explanation_en: "In heating mode with cold outdoor air, frost forms on the outdoor coil blocking airflow."
  },
  {
    category: "Heat Pumps",
    q: "¿Cómo funciona el ciclo de deshielo en una bomba de calor estándar?",
    options: ["Se apaga el compresor y un calentador derrite el hielo", "La válvula de 4 vías cambia a modo frío temporalmente breve", "El ventilador exterior sopla aire caliente sobre el serpentín", "Se activa un elemento eléctrico en el serpentín exterior solo"],
    correct: 1,
    explanation: "El defrost invierte la válvula de 4 vías — manda gas caliente al serpentín exterior para derretir el hielo."
  ,
    question_en: "How does the defrost cycle work in a standard heat pump?",
    options_en: ["The compressor shuts off and a heater melts the ice", "The 4-way valve temporarily switches to cooling mode briefly", "The outdoor fan blows hot air over the coil", "An electric element activates on the outdoor coil only"],
    explanation_en: "Defrost reverses the 4-way valve -- sends hot gas to the outdoor coil to melt the ice."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué es el calor auxiliar (auxiliary heat) en un sistema de bomba de calor residencial?",
    options: ["Un compresor adicional que ayuda en días muy fríos", "Tiras de calefacción eléctrica que complementan al compresor", "Un horno de gas que se enciende cuando la bomba falla", "Un calentador solar que precalienta el aire de retorno"],
    correct: 1,
    explanation: "El auxiliary heat son resistencias eléctricas (strip heaters) que se activan cuando la bomba no produce suficiente calor."
  ,
    question_en: "What is auxiliary heat in a residential heat pump system?",
    options_en: ["An additional compressor that helps on very cold days", "Electric heating strips that supplement the compressor", "A gas furnace that turns on when the pump fails", "A solar heater that preheats the return air"],
    explanation_en: "Auxiliary heat consists of electric resistance strips (strip heaters) that activate when the pump cannot produce enough heat."
  },
  {
    category: "Heat Pumps",
    q: "¿A qué temperatura exterior aproximada una bomba de calor estándar pierde eficiencia significativamente?",
    options: ["A 50 grados Fahrenheit de temperatura exterior baja", "A 40 grados Fahrenheit de temperatura exterior baja", "A 25 grados Fahrenheit de temperatura exterior baja", "A 10 grados Fahrenheit de temperatura exterior baja"],
    correct: 2,
    explanation: "A ~25°F la bomba de calor estándar pierde capacidad significativa y depende más del auxiliary heat."
  ,
    question_en: "At what approximate outdoor temperature does a standard heat pump lose efficiency significantly?",
    options_en: ["At 50 degrees Fahrenheit outdoor temperature", "At 40 degrees Fahrenheit outdoor temperature", "At 25 degrees Fahrenheit outdoor temperature", "At 10 degrees Fahrenheit outdoor temperature"],
    explanation_en: "At ~25°F a standard heat pump loses significant capacity and depends more on auxiliary heat."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué terminal del termostato se usa para activar la válvula reversible en modo calefacción?",
    options: ["Terminal Y para activar la válvula reversible del sistema", "Terminal O para energizar la válvula reversible a modo frío", "Terminal B para energizar la válvula reversible a modo calor", "Terminal W2 para activar la segunda etapa de calefacción"],
    correct: 2,
    explanation: "Rheem/Ruud usa terminal B (energiza en calor). Trane/Carrier usa O (energiza en frío). Depende del fabricante."
  ,
    question_en: "What thermostat terminal is used to activate the reversing valve in heating mode?",
    options_en: ["Terminal Y to activate the system reversing valve", "Terminal O to energize the reversing valve to cooling mode", "Terminal B to energize the reversing valve to heating mode", "Terminal W2 to activate the second stage of heating"],
    explanation_en: "Rheem/Ruud uses terminal B (energized in heating). Trane/Carrier uses O (energized in cooling). It depends on the manufacturer."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué es el 'balance point' de una bomba de calor?",
    options: ["La presión donde alta y baja se equilibran perfectamente", "La temperatura exterior donde la bomba iguala la pérdida de calor", "El punto donde el refrigerante cambia de líquido a gas exacto", "La velocidad del ventilador donde el flujo es máximo óptimo"],
    correct: 1,
    explanation: "Balance point = temperatura exterior donde la capacidad de la bomba de calor iguala la pérdida de calor del edificio."
  ,
    question_en: "What is the balance point of a heat pump?",
    options_en: ["The pressure where high and low equalize perfectly", "The outdoor temperature where the pump matches the heat loss", "The point where refrigerant changes from liquid to gas exactly", "The fan speed where flow is at maximum optimal"],
    explanation_en: "Balance point = the outdoor temperature where the heat pump capacity equals the building heat loss."
  },
  {
    category: "Heat Pumps",
    q: "¿Cuál es la ventaja principal del HSPF alto en una bomba de calor?",
    options: ["Mayor capacidad de enfriamiento en modo verano caliente", "Mayor eficiencia de calefacción y menor costo de operación", "Menor ruido de operación del compresor durante la noche", "Mayor vida útil del compresor por menos ciclos de trabajo"],
    correct: 1,
    explanation: "HSPF (Heating Seasonal Performance Factor) alto = más eficiente en calefacción = menor costo operativo."
  ,
    question_en: "What is the main advantage of a high HSPF in a heat pump?",
    options_en: ["Greater cooling capacity in hot summer mode", "Greater heating efficiency and lower operating cost", "Lower compressor operating noise during nighttime", "Longer compressor life due to fewer work cycles"],
    explanation_en: "High HSPF (Heating Seasonal Performance Factor) = more heating efficient = lower operating cost."
  },
  {
    category: "Heat Pumps",
    q: "¿Qué componente tiene una bomba de calor que un AC central convencional NO tiene?",
    options: ["Un condensador exterior con ventilador y serpentín", "Un acumulador de succión en la línea de baja presión", "Un compresor hermético scroll de alta eficiencia", "Una TXV bidireccional con filtro secador en línea"],
    correct: 1,
    explanation: "El acumulador protege al compresor del líquido que puede regresar durante cambios de modo y deshielo."
  ,
    question_en: "What component does a heat pump have that a conventional central AC does NOT?",
    options_en: ["An outdoor condenser with fan and coil", "A suction accumulator on the low pressure line", "A high-efficiency hermetic scroll compressor", "A bidirectional TXV with inline filter drier"],
    explanation_en: "The accumulator protects the compressor from liquid that can return during mode changes and defrost."
  },
  // ── Mini Splits (~45 preguntas) ──
  {
    category: "Mini Split",
    q: "¿Cuál es la ventaja principal de un mini split sobre un sistema central con ductos?",
    options: ["El mini split es más potente que un sistema central grande", "El mini split no necesita ductos, evitando pérdidas de energía", "El mini split usa más refrigerante y enfría más rápido", "El mini split no necesita condensadora exterior para funcionar"],
    correct: 1,
    explanation: "Sin ductos = sin pérdidas por fugas (hasta 30%). Instalación más fácil, control por zona individual."
  ,
    question_en: "What is the main advantage of a mini split over a central system with ducts?",
    options_en: ["The mini split is more powerful than a large central system", "The mini split does not need ducts, avoiding energy losses", "The mini split uses more refrigerant and cools faster", "The mini split does not need an outdoor condenser to operate"],
    explanation_en: "No ducts = no duct losses (up to 30%). Easier installation, individual zone control."
  },
  {
    category: "Mini Split",
    q: "¿Cuántas unidades interiores (evaporadoras) puede manejar un mini split multi-zona típico?",
    options: ["Solo 1 unidad interior por cada condensadora exterior", "Hasta 2 a 5 unidades interiores según el modelo marca", "Hasta 10 a 15 unidades interiores en cualquier modelo", "Ilimitadas unidades interiores sin importar la capacidad"],
    correct: 1,
    explanation: "Los multi-zona residenciales manejan típicamente 2-5 evaporadoras con una condensadora exterior."
  ,
    question_en: "How many indoor units (evaporators) can a typical multi-zone mini split handle?",
    options_en: ["Only 1 indoor unit per outdoor condenser", "Up to 2 to 5 indoor units depending on the model brand", "Up to 10 to 15 indoor units on any model", "Unlimited indoor units regardless of capacity"],
    explanation_en: "Residential multi-zone units typically handle 2-5 evaporators with one outdoor condenser."
  },
  {
    category: "Mini Split",
    q: "¿Qué diámetro típico tienen las líneas de refrigerante de un mini split de 12,000 BTU?",
    options: ["Succión 1/2\" y líquido 1/4\" de diámetro estándar", "Succión 3/8\" y líquido 1/4\" de diámetro estándar", "Succión 3/4\" y líquido 3/8\" de diámetro estándar", "Succión 5/8\" y líquido 3/8\" de diámetro estándar"],
    correct: 1,
    explanation: "Un mini split de 12K BTU usa típicamente línea de succión 3/8\" y línea de líquido 1/4\"."
  ,
    question_en: "What typical diameter do the refrigerant lines have on a 12,000 BTU mini split?",
    options_en: ["Suction 1/2 inch and liquid 1/4 inch standard diameter", "Suction 3/8 inch and liquid 1/4 inch standard diameter", "Suction 3/4 inch and liquid 3/8 inch standard diameter", "Suction 5/8 inch and liquid 3/8 inch standard diameter"],
    explanation_en: "A 12K BTU mini split typically uses a 3/8 inch suction line and 1/4 inch liquid line."
  },
  {
    category: "Mini Split",
    q: "¿Qué tipo de compresor usan la mayoría de los mini splits modernos de alta eficiencia?",
    options: ["Compresor reciprocante de pistón velocidad fija AC", "Compresor inverter de velocidad variable continua DC", "Compresor centrífugo de alta velocidad para volumen", "Compresor de tornillo rotativo industrial de gran tamaño"],
    correct: 1,
    explanation: "Los mini splits modernos usan compresores inverter DC que varían velocidad según la demanda."
  ,
    question_en: "What type of compressor do most modern high-efficiency mini splits use?",
    options_en: ["Fixed-speed AC reciprocating piston compressor", "Continuously variable-speed DC inverter compressor", "High-speed centrifugal compressor for volume", "Large industrial rotary screw compressor"],
    explanation_en: "Modern mini splits use DC inverter compressors that vary speed according to demand."
  },
  {
    category: "Mini Split",
    q: "¿Cuál es la ventaja del compresor inverter sobre uno de velocidad fija convencional?",
    options: ["El inverter es más barato de comprar que el convencional", "El inverter ajusta velocidad reduciendo consumo y temperatura", "El inverter no necesita capacitor de arranque ni de marcha", "El inverter opera a mayor presión y produce más frío rápido"],
    correct: 1,
    explanation: "El inverter modula velocidad continuamente, manteniendo temperatura estable con menor consumo energético."
  ,
    question_en: "What is the advantage of an inverter compressor over a conventional fixed-speed one?",
    options_en: ["The inverter is cheaper to buy than the conventional one", "The inverter adjusts speed reducing consumption and temperature variation", "The inverter does not need a start or run capacitor", "The inverter operates at higher pressure and produces cold faster"],
    explanation_en: "The inverter continuously modulates speed, maintaining stable temperature with lower energy consumption."
  },
  {
    category: "Mini Split",
    q: "¿Cuál es el tamaño del agujero en la pared necesario para pasar las líneas de un mini split?",
    options: ["1 y 1/2 pulgadas de diámetro para todas las líneas juntas", "2 y 1/2 a 3 pulgadas de diámetro para las líneas y drenaje", "4 y 1/2 pulgadas de diámetro mínimo para las conexiones", "6 pulgadas de diámetro estándar para todas instalaciones"],
    correct: 1,
    explanation: "Se necesita un agujero de 2.5-3\" para pasar las 2 líneas de refrigerante, cable eléctrico y tubo de drenaje."
  ,
    question_en: "What size hole in the wall is needed to pass the lines of a mini split?",
    options_en: ["1 and 1/2 inches in diameter for all lines together", "2 and 1/2 to 3 inches in diameter for the lines and drain", "4 and 1/2 inches minimum diameter for the connections", "6 inches standard diameter for all installations"],
    explanation_en: "A 2.5-3 inch hole is needed to pass the 2 refrigerant lines, electrical cable, and drain tube."
  },
  {
    category: "Mini Split",
    q: "¿Con qué pendiente mínima se debe instalar el tubo de drenaje de condensado del mini split?",
    options: ["Sin pendiente, el agua drena por gravedad naturalmente sola", "1/4 de pulgada de caída por pie de recorrido hacia afuera", "1 pulgada de caída por pie de recorrido hacia el exterior", "2 pulgadas de caída por pie de recorrido hacia el exterior"],
    correct: 1,
    explanation: "El drenaje necesita 1/4\" por pie de pendiente mínima para que el condensado fluya por gravedad."
  ,
    question_en: "What minimum slope must the condensate drain tube of a mini split be installed at?",
    options_en: ["No slope, water drains by gravity naturally on its own", "1/4 inch drop per foot of run toward the outside", "1 inch drop per foot of run toward the exterior", "2 inches drop per foot of run toward the exterior"],
    explanation_en: "The drain needs a minimum slope of 1/4 inch per foot for the condensate to flow by gravity."
  },
  {
    category: "Mini Split",
    q: "¿Qué error común de instalación causa que un mini split gotee agua dentro de la habitación?",
    options: ["La condensadora exterior está demasiado alta del nivel", "La evaporadora interior no tiene suficiente pendiente al drenaje", "Las líneas de refrigerante son demasiado largas para el equipo", "El control remoto está programado en modo calefacción incorrecto"],
    correct: 1,
    explanation: "Si la unidad interior no tiene pendiente hacia el drenaje o el tubo está obstruido, el agua se desborda."
  ,
    question_en: "What common installation error causes a mini split to drip water inside the room?",
    options_en: ["The outdoor condenser is too high above the level", "The indoor evaporator does not have enough slope to the drain", "The refrigerant lines are too long for the equipment", "The remote control is programmed in incorrect heating mode"],
    explanation_en: "If the indoor unit does not have slope toward the drain or the tube is clogged, water overflows."
  },
  {
    category: "Mini Split",
    q: "¿A qué distancia máxima puede estar la condensadora de la evaporadora en un mini split estándar?",
    options: ["15 pies máximo de distancia entre unidades del sistema", "25 pies máximo de distancia entre unidades del sistema", "50 pies máximo de distancia entre unidades del sistema", "75 pies máximo de distancia entre unidades del sistema"],
    correct: 2,
    explanation: "La mayoría de mini splits permiten hasta 50 pies de distancia máxima entre unidades (verificar manual)."
  ,
    question_en: "What is the maximum distance the condenser can be from the evaporator in a standard mini split?",
    options_en: ["15 feet maximum distance between system units", "25 feet maximum distance between system units", "50 feet maximum distance between system units", "75 feet maximum distance between system units"],
    explanation_en: "Most mini splits allow up to 50 feet maximum distance between units (check the manual)."
  },
  {
    category: "Mini Split",
    q: "¿Qué sucede si las líneas de refrigerante de un mini split exceden la longitud precharged?",
    options: ["No pasa nada, el sistema compensa automáticamente solo", "Se debe agregar refrigerante adicional según tabla del fabricante", "Se deben usar líneas de mayor diámetro para compensar largo", "El sistema no funciona y se debe devolver al fabricante hoy"],
    correct: 1,
    explanation: "Si las líneas exceden la longitud precargada, se agrega refrigerante según la tabla del fabricante (oz/ft)."
  ,
    question_en: "What happens if the refrigerant lines of a mini split exceed the precharged length?",
    options_en: ["Nothing happens, the system compensates automatically on its own", "Additional refrigerant must be added per the manufacturer's table", "Larger diameter lines must be used to compensate for length", "The system does not work and must be returned to the manufacturer"],
    explanation_en: "If lines exceed the precharged length, refrigerant is added per the manufacturer's table (oz/ft)."
  },
  // ── Gas Furnace Equipment (~40 preguntas) ──
  {
    category: "Gas Furnace",
    q: "¿Cuáles son los dos tipos principales de hornos de gas residenciales según su eficiencia?",
    options: ["Horno de piso y horno de pared según ubicación física", "Horno estándar (80% AFUE) y horno de alta eficiencia (90%+)", "Horno de gas natural y horno de gas propano LP diferente", "Horno de una etapa y horno de dos etapas de velocidad"],
    correct: 1,
    explanation: "Estándar = 80% AFUE con tubo de escape metal. Alta eficiencia = 90%+ AFUE con tubo PVC y condensación."
  ,
    question_en: "What are the two main types of residential gas furnaces by efficiency?",
    options_en: ["Floor furnace and wall furnace by physical location", "Standard (80% AFUE) and high efficiency (90%+) furnace", "Natural gas furnace and LP propane gas furnace different", "Single-stage and two-stage speed furnace"],
    explanation_en: "Standard = 80% AFUE with metal exhaust pipe. High efficiency = 90%+ AFUE with PVC pipe and condensation."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué significa AFUE en la clasificación de eficiencia de un horno de gas?",
    options: ["Annual Fan Utilization Efficiency del ventilador de aire", "Annual Fuel Utilization Efficiency del combustible quemado", "Average Furnace Unit Efficiency de la unidad completa", "Adjusted Flame Uniformity Evaluation de la combustión"],
    correct: 1,
    explanation: "AFUE = Annual Fuel Utilization Efficiency. Un 80% AFUE significa que 80% del gas se convierte en calor útil."
  ,
    question_en: "What does AFUE mean in the efficiency rating of a gas furnace?",
    options_en: ["Annual Fan Utilization Efficiency of the air blower", "Annual Fuel Utilization Efficiency of the burned fuel", "Average Furnace Unit Efficiency of the complete unit", "Adjusted Flame Uniformity Evaluation of combustion"],
    explanation_en: "AFUE = Annual Fuel Utilization Efficiency. An 80% AFUE means 80% of the gas converts to useful heat."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué componente enciende el gas en un horno moderno sin piloto permanente?",
    options: ["Una llama piloto permanente que siempre está encendida", "Un encendedor de superficie caliente (hot surface igniter)", "Un fósforo manual que el técnico enciende cada temporada", "Una chispa de alto voltaje de un piezo eléctrico manual"],
    correct: 1,
    explanation: "Los hornos modernos usan hot surface igniter (HSI) de silicón carburo o nitruro que se calienta al rojo."
  ,
    question_en: "What component ignites the gas in a modern furnace without a standing pilot?",
    options_en: ["A permanent standing pilot flame that is always lit", "A hot surface igniter (HSI) made of silicon carbide or nitride", "A manual match that the technician lights each season", "A high-voltage spark from a manual piezoelectric igniter"],
    explanation_en: "Modern furnaces use a hot surface igniter (HSI) of silicon carbide or nitride that glows red hot."
  },
  {
    category: "Gas Furnace",
    q: "¿Cuál es la secuencia correcta de arranque de un horno de gas con encendedor electrónico?",
    options: ["Gas abre → encendedor calienta → ventilador arranca → llama verifica", "Encendedor calienta → gas abre → llama verifica → ventilador arranca", "Ventilador arranca → encendedor calienta → gas abre → llama verifica", "Draft inducer arranca → encendedor calienta → gas abre → llama verifica"],
    correct: 3,
    explanation: "1) Draft inducer, 2) pressure switch cierra, 3) HSI calienta, 4) válvula gas abre, 5) flame sensor verifica."
  ,
    question_en: "What is the correct startup sequence of a gas furnace with electronic ignition?",
    options_en: ["Gas opens -> igniter heats -> blower starts -> flame verifies", "Igniter heats -> gas opens -> flame verifies -> blower starts", "Blower starts -> igniter heats -> gas opens -> flame verifies", "Draft inducer starts -> igniter heats -> gas opens -> flame verifies"],
    explanation_en: "1) Draft inducer, 2) pressure switch closes, 3) HSI heats, 4) gas valve opens, 5) flame sensor verifies."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué componente verifica que el motor inductor de tiro está funcionando antes de abrir el gas?",
    options: ["El termostato de ambiente de la habitación interior casa", "El pressure switch del inductor de tiro del horno gas", "El flame sensor que detecta la presencia de llama activa", "El limit switch de temperatura del plenum de suministro"],
    correct: 1,
    explanation: "El pressure switch cierra cuando el inductor crea suficiente tiro negativo, permitiendo la secuencia de encendido."
  ,
    question_en: "What component verifies that the draft inducer motor is running before opening the gas?",
    options_en: ["The room ambient thermostat of the interior house", "The draft inducer pressure switch of the gas furnace", "The flame sensor that detects the presence of active flame", "The supply plenum temperature limit switch"],
    explanation_en: "The pressure switch closes when the inducer creates sufficient negative draft, allowing the ignition sequence."
  },
  {
    category: "Gas Furnace",
    q: "¿Cuántos intentos de encendido hace un horno moderno antes de entrar en lockout de seguridad?",
    options: ["1 intento y entra en lockout de seguridad del sistema", "3 intentos y entra en lockout de seguridad del sistema", "5 intentos y entra en lockout de seguridad del sistema", "10 intentos y entra en lockout de seguridad del sistema"],
    correct: 1,
    explanation: "La mayoría de hornos intentan 3 ciclos de encendido antes de lockout por seguridad."
  ,
    question_en: "How many ignition attempts does a modern furnace make before entering safety lockout?",
    options_en: ["1 attempt and enters system safety lockout", "3 attempts and enters system safety lockout", "5 attempts and enters system safety lockout", "10 attempts and enters system safety lockout"],
    explanation_en: "Most furnaces attempt 3 ignition cycles before safety lockout."
  },
  {
    category: "Gas Furnace",
    q: "¿Cómo se reinicia un horno que está en lockout por falla de encendido?",
    options: ["Se reemplaza la válvula de gas automáticamente para reset", "Se apaga el termostato o la energía y se espera 1-3 minutos", "Se presiona el botón rojo de reset en la válvula de gas", "Se desconecta el flame sensor y se reconecta nuevamente hoy"],
    correct: 1,
    explanation: "Apagar energía por 1-3 minutos resetea el módulo de control. Luego investigar la causa del lockout."
  ,
    question_en: "How do you reset a furnace that is in lockout due to ignition failure?",
    options_en: ["Replace the gas valve automatically for reset", "Turn off the thermostat or power and wait 1-3 minutes", "Press the red reset button on the gas valve", "Disconnect the flame sensor and reconnect it again"],
    explanation_en: "Turning off power for 1-3 minutes resets the control module. Then investigate the cause of the lockout."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué color de llama indica combustión correcta en los quemadores de un horno de gas?",
    options: ["Llama amarilla brillante con puntas anaranjadas visibles", "Llama azul estable con pequeñas puntas amarillas mínimas", "Llama roja oscura con base morada casi invisible al ojo", "Llama verde con centro blanco brillante intenso luminoso"],
    correct: 1,
    explanation: "Azul = combustión completa. Amarillo excesivo = combustión incompleta, posible monóxido de carbono."
  ,
    question_en: "What flame color indicates correct combustion in gas furnace burners?",
    options_en: ["Bright yellow flame with visible orange tips", "Stable blue flame with minimal small yellow tips", "Dark red flame with almost invisible purple base", "Green flame with bright white intense luminous center"],
    explanation_en: "Blue = complete combustion. Excessive yellow = incomplete combustion, possible carbon monoxide."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué gas mortal puede producir un horno con combustión incompleta o intercambiador agrietado?",
    options: ["Dióxido de carbono CO2 en concentraciones muy bajas", "Monóxido de carbono CO inodoro e indetectable mortal", "Nitrógeno N2 en concentraciones normales del aire ambiente", "Oxígeno O2 en exceso por la combustión del gas natural"],
    correct: 1,
    explanation: "El monóxido de carbono (CO) es inodoro, incoloro y mortal. Causa envenenamiento sin que la víctima lo detecte."
  ,
    question_en: "What deadly gas can a furnace with incomplete combustion or cracked heat exchanger produce?",
    options_en: ["Carbon dioxide CO2 in very low concentrations", "Carbon monoxide CO odorless and undetectable lethal", "Nitrogen N2 in normal ambient air concentrations", "Oxygen O2 in excess from natural gas combustion"],
    explanation_en: "Carbon monoxide (CO) is odorless, colorless, and lethal. It causes poisoning without the victim detecting it."
  },
  {
    category: "Gas Furnace",
    q: "¿Cuál es el nivel máximo de CO permitido en los gases de combustión de un horno operando?",
    options: ["100 ppm de CO como máximo en gases de combustión normal", "400 ppm de CO como máximo en gases de combustión normal", "050 ppm de CO como máximo en gases de combustión normal", "009 ppm de CO como máximo en gases de combustión normal"],
    correct: 2,
    explanation: "El nivel de CO en gases de escape no debe exceder 50 ppm air-free. Niveles mayores indican problema."
  ,
    question_en: "What is the maximum CO level allowed in flue gases of an operating furnace?",
    options_en: ["100 ppm CO maximum in normal flue gases", "400 ppm CO maximum in normal flue gases", "050 ppm CO maximum in normal flue gases", "009 ppm CO maximum in normal flue gases"],
    explanation_en: "CO level in flue gases should not exceed 50 ppm air-free. Higher levels indicate a problem."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué instrumento se usa para detectar monóxido de carbono en el aire ambiente de una casa?",
    options: ["Termómetro infrarrojo apuntando al intercambiador calor", "Analizador de combustión portátil o detector de CO digital", "Manómetro de presión conectado a la línea de gas natural", "Multímetro digital midiendo voltaje en el flame sensor hoy"],
    correct: 1,
    explanation: "Un analizador de combustión o detector de CO mide partes por millón de monóxido de carbono en el aire."
  ,
    question_en: "What instrument is used to detect carbon monoxide in the ambient air of a home?",
    options_en: ["Infrared thermometer aimed at the heat exchanger", "Portable combustion analyzer or digital CO detector", "Pressure manometer connected to the natural gas line", "Digital multimeter measuring voltage on the flame sensor"],
    explanation_en: "A combustion analyzer or CO detector measures parts per million of carbon monoxide in the air."
  },
  {
    category: "Gas Furnace",
    q: "¿Qué presión de gas natural se debe medir en el manifold del horno durante operación?",
    options: ["1.5 pulgadas de columna de agua en el manifold gas", "3.5 pulgadas de columna de agua en el manifold gas", "7.0 pulgadas de columna de agua en el manifold gas", "11.0 pulgadas de columna de agua en el manifold gas"],
    correct: 1,
    explanation: "Gas natural = 3.5\" WC en el manifold. Propano LP = 10-11\" WC. Se mide con manómetro."
  ,
    question_en: "What natural gas pressure should be measured at the furnace manifold during operation?",
    options_en: ["1.5 inches of water column at the gas manifold", "3.5 inches of water column at the gas manifold", "7.0 inches of water column at the gas manifold", "11.0 inches of water column at the gas manifold"],
    explanation_en: "Natural gas = 3.5 inches WC at the manifold. Propane LP = 10-11 inches WC. Measured with a manometer."
  },
  // ── Airflow (~40 preguntas) ──
  {
    category: "Airflow",
    q: "¿Qué instrumento se usa para medir la velocidad del aire en un registro de suministro?",
    options: ["Manómetro de tubo inclinado con tubo pitot conectado", "Anemómetro digital de paletas o hilo caliente portátil", "Psicrómetro giratorio para medir humedad relativa del aire", "Termómetro infrarrojo apuntando al registro de suministro"],
    correct: 1,
    explanation: "El anemómetro de paletas o hilo caliente mide velocidad del aire en FPM directamente en el registro."
  ,
    question_en: "What instrument is used to measure air velocity at a supply register?",
    options_en: ["Inclined tube manometer with connected Pitot tube", "Digital vane or hot wire portable anemometer", "Sling psychrometer for measuring relative air humidity", "Infrared thermometer aimed at the supply register"],
    explanation_en: "A vane or hot wire anemometer measures air velocity in FPM directly at the register."
  },
  {
    category: "Airflow",
    q: "¿Cómo se calcula los CFM de un registro si conoces la velocidad y el área de la cara?",
    options: ["CFM = Velocidad (FPM) menos el área en pies cuadrados", "CFM = Velocidad (FPM) por el área de la cara en sq ft", "CFM = Área de la cara dividida entre velocidad del aire", "CFM = Velocidad más el área multiplicada por la presión"],
    correct: 1,
    explanation: "CFM = FPM × Área (ft²). Si velocidad = 500 FPM y área = 0.5 ft², entonces CFM = 250."
  ,
    question_en: "How do you calculate CFM of a register if you know the velocity and face area?",
    options_en: ["CFM = Velocity (FPM) minus the area in square feet", "CFM = Velocity (FPM) times the face area in sq ft", "CFM = Face area divided by air velocity", "CFM = Velocity plus area multiplied by pressure"],
    explanation_en: "CFM = FPM x Area (ft2). If velocity = 500 FPM and area = 0.5 ft2, then CFM = 250."
  },
  {
    category: "Airflow",
    q: "¿Cuál es la diferencia de temperatura típica (delta T) entre el aire de retorno y suministro en modo frío?",
    options: ["08 a 12 grados Fahrenheit de diferencia temperatura", "14 a 22 grados Fahrenheit de diferencia temperatura", "25 a 35 grados Fahrenheit de diferencia temperatura", "40 a 50 grados Fahrenheit de diferencia temperatura"],
    correct: 1,
    explanation: "El delta T normal en enfriamiento es 14-22°F. Fuera de rango indica problemas de flujo o carga."
  ,
    question_en: "What is the typical temperature difference (delta T) between return and supply air in cooling mode?",
    options_en: ["08 to 12 degrees Fahrenheit temperature difference", "14 to 22 degrees Fahrenheit temperature difference", "25 to 35 degrees Fahrenheit temperature difference", "40 to 50 degrees Fahrenheit temperature difference"],
    explanation_en: "Normal delta T in cooling is 14-22°F. Outside this range indicates airflow or charge problems."
  },
  {
    category: "Airflow",
    q: "Si el delta T es mayor a 22°F en modo enfriamiento, ¿qué puede estar causando esto?",
    options: ["El sistema tiene demasiado flujo de aire por los ductos", "El flujo de aire es bajo por filtro sucio o ductos restringidos", "El sistema tiene exceso de refrigerante en el circuito", "La temperatura exterior es demasiado baja para enfriamiento"],
    correct: 1,
    explanation: "Delta T alto = poco flujo de aire. El aire pasa más tiempo sobre el evaporador y se enfría demasiado."
  ,
    question_en: "If the delta T is greater than 22°F in cooling mode, what could be causing this?",
    options_en: ["The system has too much airflow through the ducts", "Airflow is low due to dirty filter or restricted ducts", "The system has excess refrigerant in the circuit", "The outdoor temperature is too low for cooling"],
    explanation_en: "High delta T = low airflow. Air spends more time over the evaporator and gets overcooled."
  },
  {
    category: "Airflow",
    q: "Si el delta T es menor a 14°F en modo enfriamiento, ¿qué puede indicar?",
    options: ["El sistema está operando perfectamente con carga ideal", "Flujo de aire excesivo, baja carga de refrigerante o TXV mala", "El filtro de aire está completamente tapado sin flujo ninguno", "La condensadora exterior no está funcionando correctamente"],
    correct: 1,
    explanation: "Delta T bajo = demasiado flujo de aire, poca carga de refrigerante, o evaporador no absorbiendo calor."
  ,
    question_en: "If the delta T is less than 14°F in cooling mode, what could it indicate?",
    options_en: ["The system is operating perfectly with ideal charge", "Excessive airflow, low refrigerant charge, or bad TXV", "The air filter is completely clogged with no flow at all", "The outdoor condenser is not functioning correctly"],
    explanation_en: "Low delta T = too much airflow, low refrigerant charge, or evaporator not absorbing heat."
  },
  {
    category: "Airflow",
    q: "¿Cada cuánto tiempo se debe cambiar o limpiar el filtro de aire de un sistema residencial?",
    options: ["Una vez al año durante el mantenimiento de primavera", "Cada 1 a 3 meses según el tipo de filtro y condiciones", "Solo cuando el sistema deja de enfriar o calentar visible", "Cada 5 años según la recomendación del fabricante equipo"],
    correct: 1,
    explanation: "Filtros estándar de 1\" se cambian cada 1-3 meses. Filtros HEPA de 4-5\" duran 6-12 meses."
  ,
    question_en: "How often should the air filter be changed or cleaned in a residential system?",
    options_en: ["Once a year during spring maintenance", "Every 1 to 3 months depending on filter type and conditions", "Only when the system visibly stops cooling or heating", "Every 5 years per equipment manufacturer recommendation"],
    explanation_en: "Standard 1-inch filters are changed every 1-3 months. HEPA filters 4-5 inches last 6-12 months."
  },
  {
    category: "Airflow",
    q: "¿Qué clasificación MERV indica un filtro de alta eficiencia para atrapar partículas finas?",
    options: ["MERV 1 a 4 clasificación de filtro de alta eficiencia", "MERV 5 a 8 clasificación de filtro de alta eficiencia", "MERV 9 a 12 clasificación de filtro de alta eficiencia", "MERV 13 a 16 clasificación de filtro de alta eficiencia"],
    correct: 3,
    explanation: "MERV 13-16 atrapa partículas finas (bacterias, humo, virus). Pero puede restringir flujo si el sistema no lo soporta."
  ,
    question_en: "What MERV rating indicates a high-efficiency filter for trapping fine particles?",
    options_en: ["MERV 1 to 4 high-efficiency filter rating", "MERV 5 to 8 high-efficiency filter rating", "MERV 9 to 12 high-efficiency filter rating", "MERV 13 to 16 high-efficiency filter rating"],
    explanation_en: "MERV 13-16 captures fine particles (bacteria, smoke, viruses). But it can restrict flow if the system is not designed for it."
  },
  {
    category: "Airflow",
    q: "¿Qué problema causa un filtro de aire de MERV muy alto en un sistema no diseñado para ello?",
    options: ["Mejor calidad de aire sin ningún efecto negativo al sistema", "Restricción excesiva de flujo causando congelamiento y fallas", "Mayor ruido del ventilador pero mejor filtración del aire", "El filtro se desintegra y las partículas entran al evaporador"],
    correct: 1,
    explanation: "MERV alto en sistema no diseñado = restricción = baja presión succión = evaporador congelado."
  ,
    question_en: "What problem does a very high MERV air filter cause in a system not designed for it?",
    options_en: ["Better air quality without any negative effect on the system", "Excessive flow restriction causing freezing and failures", "Greater fan noise but better air filtration", "The filter disintegrates and particles enter the evaporator"],
    explanation_en: "High MERV in an undesigned system = restriction = low suction pressure = frozen evaporator."
  },
  {
    category: "Airflow",
    q: "¿Qué sucede cuando el evaporador se congela por falta de flujo de aire?",
    options: ["El sistema enfría mejor porque el evaporador está más frío", "Se forma hielo que bloquea más el flujo creando efecto cascada", "El hielo se derrite automáticamente cuando el compresor para", "La TXV compensa abriendo más para derretir el hielo formado"],
    correct: 1,
    explanation: "Hielo bloquea más flujo → más hielo → efecto cascada hasta bloquear completamente el evaporador."
  ,
    question_en: "What happens when the evaporator freezes due to lack of airflow?",
    options_en: ["The system cools better because the evaporator is colder", "Ice forms blocking more flow creating a cascade effect", "The ice melts automatically when the compressor stops", "The TXV compensates by opening more to melt the ice formed"],
    explanation_en: "Ice blocks more flow -> more ice -> cascade effect until the evaporator is completely blocked."
  },
  {
    category: "Airflow",
    q: "¿Cuál es la primera acción al encontrar un evaporador completamente congelado con hielo?",
    options: ["Agregar refrigerante porque la carga probablemente está baja", "Apagar el compresor y dejar solo el ventilador para descongelar", "Raspar el hielo con herramienta para liberar el flujo de aire", "Encender el modo calor para derretir el hielo más rápido todo"],
    correct: 1,
    explanation: "Apagar compresor + dejar fan ON permite que el aire ambiente derrita el hielo. Luego buscar la causa raíz."
  ,
    question_en: "What is the first action when finding an evaporator completely frozen with ice?",
    options_en: ["Add refrigerant because the charge is probably low", "Turn off the compressor and leave only the fan to defrost", "Scrape the ice with a tool to free the airflow", "Turn on heating mode to melt the ice faster"],
    explanation_en: "Turn off compressor + leave fan ON allows ambient air to melt the ice. Then find the root cause."
  },
  // ── System Design and Selection (~35 preguntas) ──
  {
    category: "Diseño de Sistemas",
    q: "¿Qué manual de ACCA se usa para calcular la carga térmica de una casa residencial?",
    options: ["Manual D para diseño y dimensionamiento de ductos aire", "Manual J para cálculo de carga térmica del edificio casa", "Manual S para selección del equipo HVAC más adecuado", "Manual T para selección de difusores y grillas de registro"],
    correct: 1,
    explanation: "Manual J calcula cuántas BTU necesita la casa para enfriamiento y calefacción."
  ,
    question_en: "Which ACCA manual is used to calculate the thermal load of a residential house?",
    options_en: ["Manual D for duct design and air sizing", "Manual J for building thermal load calculation", "Manual S for selecting the most suitable HVAC equipment", "Manual T for selecting diffusers and register grilles"],
    explanation_en: "Manual J calculates how many BTUs the house needs for cooling and heating."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Qué factores incluye un cálculo de carga Manual J para dimensionar el equipo HVAC?",
    options: ["Solo los pies cuadrados de la casa sin más detalles", "Aislamiento, ventanas, orientación, ocupantes y clima local", "Solo la temperatura exterior promedio del mes más caliente", "Solo el número de habitaciones y baños de la residencia"],
    correct: 1,
    explanation: "Manual J considera: envolvente, aislamiento, ventanas, orientación solar, infiltración, ocupantes, electrodomésticos, clima."
  ,
    question_en: "What factors does a Manual J load calculation include for sizing HVAC equipment?",
    options_en: ["Only the square footage of the house without further details", "Insulation, windows, orientation, occupants, and local climate", "Only the average outdoor temperature of the hottest month", "Only the number of bedrooms and bathrooms in the residence"],
    explanation_en: "Manual J considers: envelope, insulation, windows, solar orientation, infiltration, occupants, appliances, climate."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Qué problema causa instalar un sistema de AC sobredimensionado (demasiado grande) para la casa?",
    options: ["Enfría más rápido sin ningún efecto negativo al confort", "Ciclos cortos, alta humedad, mayor desgaste y desperdicio", "Mejor deshumidificación porque tiene más capacidad de frío", "Las presiones de operación son más estables y balanceadas"],
    correct: 1,
    explanation: "Equipo grande = ciclos cortos = no deshumidifica = alta humedad interior + más desgaste por arranques frecuentes."
  ,
    question_en: "What problem does installing an oversized (too large) AC system for the house cause?",
    options_en: ["Cools faster without any negative comfort effect", "Short cycling, high humidity, more wear and waste", "Better dehumidification because it has more cooling capacity", "Operating pressures are more stable and balanced"],
    explanation_en: "Large equipment = short cycling = no dehumidification = high indoor humidity + more wear from frequent starts."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Qué problema causa instalar un sistema subdimensionado (muy pequeño) para la casa?",
    options: ["El sistema opera más eficientemente en ciclos más largos", "El sistema no alcanza la temperatura y opera continuamente", "El compresor trabaja menos porque la carga es menor total", "Las presiones de operación bajan y el sistema ahorra energía"],
    correct: 1,
    explanation: "Equipo chico = no alcanza setpoint = opera 24/7 = alto consumo, desgaste prematuro, incomodidad."
  ,
    question_en: "What problem does installing an undersized (too small) system for the house cause?",
    options_en: ["The system operates more efficiently in longer cycles", "The system cannot reach temperature and runs continuously", "The compressor works less because the load is less total", "Operating pressures drop and the system saves energy"],
    explanation_en: "Small equipment = cannot reach setpoint = runs 24/7 = high consumption, premature wear, discomfort."
  },
  {
    category: "Diseño de Sistemas",
    q: "Como regla general, ¿cuántas BTU por pie cuadrado se necesitan para un cálculo rápido residencial?",
    options: ["10 BTU por pie cuadrado como estimación rápida general", "20 BTU por pie cuadrado como estimación rápida general", "30 BTU por pie cuadrado como estimación rápida general", "40 BTU por pie cuadrado como estimación rápida general"],
    correct: 1,
    explanation: "~20 BTU/ft² es una estimación rápida. Una casa de 1,500 ft² ≈ 30,000 BTU = 2.5 toneladas. Siempre verificar con Manual J."
  ,
    question_en: "As a general rule, how many BTU per square foot are needed for a quick residential calculation?",
    options_en: ["10 BTU per square foot as a quick general estimate", "20 BTU per square foot as a quick general estimate", "30 BTU per square foot as a quick general estimate", "40 BTU per square foot as a quick general estimate"],
    explanation_en: "~20 BTU/sq ft is a quick estimate. A 1,500 sq ft house is about 30,000 BTU = 2.5 tons. Always verify with Manual J."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Cuál es la importancia de la orientación de las ventanas en el cálculo de carga térmica?",
    options: ["No tiene importancia, todas las ventanas son iguales exacto", "Las ventanas orientadas al sur y oeste reciben más calor solar", "Solo las ventanas del norte afectan la carga de calefacción", "Las ventanas al este reciben más calor que las del oeste"],
    correct: 1,
    explanation: "Ventanas al sur y oeste reciben más radiación solar directa, aumentando significativamente la carga de enfriamiento."
  ,
    question_en: "What is the importance of window orientation in the thermal load calculation?",
    options_en: ["It has no importance, all windows are exactly the same", "South and west-facing windows receive more solar heat", "Only north-facing windows affect the heating load", "East-facing windows receive more heat than west-facing"],
    explanation_en: "South and west windows receive more direct solar radiation, significantly increasing the cooling load."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Qué valor R de aislamiento se recomienda para áticos en zona climática 4 según código?",
    options: ["R-13 de aislamiento mínimo para áticos en zona cuatro", "R-19 de aislamiento mínimo para áticos en zona cuatro", "R-38 de aislamiento mínimo para áticos en zona cuatro", "R-49 de aislamiento mínimo para áticos en zona cuatro"],
    correct: 2,
    explanation: "Zona 4: R-38 mínimo en áticos según código de energía IECC. Zonas más frías requieren R-49 o más."
  ,
    question_en: "What R-value insulation is recommended for attics in climate zone 4 per code?",
    options_en: ["R-13 minimum insulation for attics in zone four", "R-19 minimum insulation for attics in zone four", "R-38 minimum insulation for attics in zone four", "R-49 minimum insulation for attics in zone four"],
    explanation_en: "Zone 4: R-38 minimum in attics per IECC energy code. Colder zones require R-49 or more."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Qué significan las siglas SEER2 en la nueva regulación de eficiencia de equipos desde 2023?",
    options: ["Seasonal Energy Efficiency Ratio segunda generación nueva", "Standard Equipment Efficiency Rating segundo nivel avanzado", "System Electrical Efficiency Report segundo método cálculo", "Supplemental Energy Evaluation Requirement segunda versión"],
    correct: 0,
    explanation: "SEER2 es la versión actualizada que usa condiciones de prueba más realistas (mayor presión estática)."
  ,
    question_en: "What does the acronym SEER2 mean in the new equipment efficiency regulation since 2023?",
    options_en: ["Seasonal Energy Efficiency Ratio second new generation", "Standard Equipment Efficiency Rating second advanced level", "System Electrical Efficiency Report second calculation method", "Supplemental Energy Evaluation Requirement second version"],
    explanation_en: "SEER2 is the updated version that uses more realistic test conditions (higher static pressure)."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Cuál es el SEER2 mínimo requerido para un AC residencial nuevo en la región sur de USA?",
    options: ["13.4 SEER2 como mínimo en la región sur de Estados Unidos", "14.3 SEER2 como mínimo en la región sur de Estados Unidos", "15.2 SEER2 como mínimo en la región sur de Estados Unidos", "16.0 SEER2 como mínimo en la región sur de Estados Unidos"],
    correct: 1,
    explanation: "Desde 2023, la región sur requiere mínimo 14.3 SEER2 (equivalente al antiguo 15 SEER)."
  ,
    question_en: "What is the minimum SEER2 required for a new residential AC in the southern USA region?",
    options_en: ["13.4 SEER2 minimum in the southern United States region", "14.3 SEER2 minimum in the southern United States region", "15.2 SEER2 minimum in the southern United States region", "16.0 SEER2 minimum in the southern United States region"],
    explanation_en: "Since 2023, the southern region requires a minimum of 14.3 SEER2 (equivalent to the former 15 SEER)."
  },
  {
    category: "Diseño de Sistemas",
    q: "Un sistema de dos etapas (two-stage) opera la mayor parte del tiempo en:",
    options: ["La etapa alta para máximo enfriamiento todo el tiempo", "La etapa baja para mayor eficiencia y confort continuo", "Ambas etapas simultáneamente para balance de temperatura", "Alternando entre etapas cada 15 minutos automáticamente"],
    correct: 1,
    explanation: "El two-stage opera 80% del tiempo en etapa baja (más eficiente, mejor deshumidificación, menos ruido)."
  ,
    question_en: "A two-stage system operates most of the time at:",
    options_en: ["High stage for maximum cooling all the time", "Low stage for greater efficiency and continuous comfort", "Both stages simultaneously for temperature balance", "Alternating between stages every 15 minutes automatically"],
    explanation_en: "Two-stage operates 80% of the time at low stage (more efficient, better dehumidification, less noise)."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Qué ventaja tiene un sistema variable (inverter/variable speed) sobre uno de dos etapas?",
    options: ["Es más barato de comprar e instalar que el de dos etapas", "Ajusta capacidad continuamente de 30% a 100% según demanda", "Produce más BTU por hora que cualquier sistema convencional", "No necesita mantenimiento porque no tiene partes mecánicas"],
    correct: 1,
    explanation: "Los sistemas inverter modulan de ~30-100% continuamente, la máxima eficiencia y confort posible."
  ,
    question_en: "What advantage does a variable system (inverter/variable speed) have over a two-stage?",
    options_en: ["It is cheaper to buy and install than the two-stage", "It adjusts capacity continuously from 30% to 100% based on demand", "It produces more BTU per hour than any conventional system", "It needs no maintenance because it has no mechanical parts"],
    explanation_en: "Inverter systems modulate from ~30-100% continuously for maximum efficiency and comfort."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Cuál es la vida útil promedio esperada de un sistema de AC residencial bien mantenido?",
    options: ["05 a 08 años de vida útil promedio con buen mantenimiento", "10 a 15 años de vida útil promedio con buen mantenimiento", "15 a 20 años de vida útil promedio con buen mantenimiento", "25 a 30 años de vida útil promedio con buen mantenimiento"],
    correct: 2,
    explanation: "Un AC residencial bien mantenido dura 15-20 años. Hornos de gas pueden durar 20-25 años."
  ,
    question_en: "What is the expected average lifespan of a well-maintained residential AC system?",
    options_en: ["05 to 08 years average lifespan with good maintenance", "10 to 15 years average lifespan with good maintenance", "15 to 20 years average lifespan with good maintenance", "25 to 30 years average lifespan with good maintenance"],
    explanation_en: "A well-maintained residential AC lasts 15-20 years. Gas furnaces can last 20-25 years."
  },
  {
    category: "Diseño de Sistemas",
    q: "¿Cuál es el factor más importante al seleccionar la ubicación de la condensadora exterior?",
    options: ["Que esté lo más lejos posible de la casa por el ruido", "Que tenga flujo de aire libre y acceso para mantenimiento", "Que esté en la sombra todo el día para mayor eficiencia", "Que esté lo más alto posible del nivel del suelo exterior"],
    correct: 1,
    explanation: "La condensadora necesita flujo de aire libre (no obstruido) y acceso mínimo de 24\" alrededor para servicio."
  ,
    question_en: "What is the most important factor when selecting the location of the outdoor condenser?",
    options_en: ["That it be as far as possible from the house for noise", "That it has free airflow and access for maintenance", "That it be in shade all day for greater efficiency", "That it be as high as possible above ground level"],
    explanation_en: "The condenser needs free (unobstructed) airflow and minimum 24 inches clearance around it for service."
  },
  {
    category: "Electricidad",
    q: "Un circuito tiene 240V y una resistencia de 20 ohmios. ¿Cuál es la corriente que fluye?",
    options: ["6 amperios de corriente fluyen por el circuito completo", "12 amperios de corriente fluyen por el circuito completo", "24 amperios de corriente fluyen por el circuito completo", "48 amperios de corriente fluyen por el circuito completo"],
    correct: 1,
    explanation: "Ley de Ohm: I = V/R = 240/20 = 12 amperios."
  ,
    question_en: "A circuit has 240V and a resistance of 20 ohms. What is the current flowing?",
    options_en: ["6 amps of current flow through the complete circuit", "12 amps of current flow through the complete circuit", "24 amps of current flow through the complete circuit", "48 amps of current flow through the complete circuit"],
    explanation_en: "Ohm's Law: I = V/R = 240/20 = 12 amps."
  },
  {
    category: "Electricidad",
    q: "¿Cuántos watts consume un motor que opera a 240V y jala 10 amperios?",
    options: ["1200 watts de consumo total del motor en operación", "2400 watts de consumo total del motor en operación", "4800 watts de consumo total del motor en operación", "24 watts de consumo total del motor en operación"],
    correct: 1,
    explanation: "P = V × I = 240 × 10 = 2400 watts."
  ,
    question_en: "How many watts does a motor that operates at 240V and draws 10 amps consume?",
    options_en: ["1200 watts total motor consumption in operation", "2400 watts total motor consumption in operation", "4800 watts total motor consumption in operation", "24 watts total motor consumption in operation"],
    explanation_en: "P = V x I = 240 x 10 = 2400 watts."
  },
  {
    category: "Electricidad",
    q: "Dos resistencias de 10 ohmios cada una conectadas en paralelo producen una resistencia total de:",
    options: ["20 ohmios de resistencia total equivalente en el circuito", "10 ohmios de resistencia total equivalente en el circuito", "5 ohmios de resistencia total equivalente en el circuito", "2.5 ohmios de resistencia total equivalente en el circuito"],
    correct: 2,
    explanation: "En paralelo: 1/Rt = 1/R1 + 1/R2 = 1/10 + 1/10 = 2/10, Rt = 5 ohmios."
  ,
    question_en: "Two 10-ohm resistors connected in parallel produce a total resistance of:",
    options_en: ["20 ohms total equivalent resistance in the circuit", "10 ohms total equivalent resistance in the circuit", "5 ohms total equivalent resistance in the circuit", "2.5 ohms total equivalent resistance in the circuit"],
    explanation_en: "In parallel: 1/Rt = 1/R1 + 1/R2 = 1/10 + 1/10 = 2/10, Rt = 5 ohms."
  },
  {
    category: "Electricidad",
    q: "¿Qué sucede con la corriente total cuando agregas otra carga en paralelo a un circuito existente?",
    options: ["La corriente total disminuye porque se divide entre más cargas", "La corriente total aumenta porque cada carga jala su propia corriente", "La corriente total permanece igual sin importar cuántas cargas haya", "La corriente total se reduce a la mitad por cada carga adicional"],
    correct: 1,
    explanation: "En paralelo cada carga crea un camino adicional para la corriente. La corriente total es la suma de todas las corrientes individuales."
  ,
    question_en: "What happens to total current when you add another load in parallel to an existing circuit?",
    options_en: ["Total current decreases because it divides among more loads", "Total current increases because each load draws its own current", "Total current stays the same regardless of how many loads there are", "Total current is reduced by half for each additional load"],
    explanation_en: "In parallel each load creates an additional path for current. Total current is the sum of all individual currents."
  },
  {
    category: "Electricidad",
    q: "¿Qué instrumento se usa para medir la resistencia del aislamiento del bobinado de un motor?",
    options: ["Multímetro digital estándar en escala de ohmios regular", "Megóhmetro que aplica alto voltaje para probar aislamiento", "Amperímetro de gancho midiendo corriente de fuga a tierra", "Osciloscopio digital analizando la forma de onda del motor"],
    correct: 1,
    explanation: "El megóhmetro (Megger) aplica 500V o más para medir la resistencia del aislamiento en megaohmios. Un multímetro normal no puede detectar fallas de aislamiento."
  ,
    question_en: "What instrument is used to measure the insulation resistance of a motor winding?",
    options_en: ["Standard digital multimeter on regular ohm scale", "Megohmmeter that applies high voltage to test insulation", "Clamp ammeter measuring leakage current to ground", "Digital oscilloscope analyzing the motor waveform"],
    explanation_en: "The megohmmeter (Megger) applies 500V or more to measure insulation resistance in megohms. A normal multimeter cannot detect insulation failures."
  },
  {
    category: "Electricidad",
    q: "Un transformador de control tiene primario de 240V y secundario de 24V. Si el circuito de control consume 2A, ¿cuántos VA mínimos necesita?",
    options: ["24 VA mínimos para alimentar el circuito de control", "40 VA mínimos para alimentar el circuito de control", "48 VA mínimos para alimentar el circuito de control", "75 VA mínimos para alimentar el circuito de control"],
    correct: 2,
    explanation: "VA = V × A = 24V × 2A = 48 VA mínimos. En la práctica se usa uno más grande (75 VA) por seguridad."
  ,
    question_en: "A control transformer has a 240V primary and 24V secondary. If the control circuit draws 2A, how many minimum VA are needed?",
    options_en: ["24 VA minimum to power the control circuit", "40 VA minimum to power the control circuit", "48 VA minimum to power the control circuit", "75 VA minimum to power the control circuit"],
    explanation_en: "VA = V x A = 24V x 2A = 48 VA minimum. In practice a larger one (75 VA) is used for safety margin."
  },
  {
    category: "Electricidad",
    q: "¿Cuál es el calibre mínimo de cable requerido por NEC para un circuito de 20 amperios a 240V?",
    options: ["Calibre 14 AWG con capacidad de 15 amperios máximo", "Calibre 12 AWG con capacidad de 20 amperios máximo", "Calibre 10 AWG con capacidad de 30 amperios máximo", "Calibre 8 AWG con capacidad de 40 amperios máximo"],
    correct: 1,
    explanation: "NEC requiere calibre 12 AWG mínimo para circuitos de 20 amperios. El 14 AWG solo es para 15A."
  ,
    question_en: "What is the minimum wire gauge required by NEC for a 20-amp 240V circuit?",
    options_en: ["14 AWG gauge with 15 amp maximum capacity", "12 AWG gauge with 20 amp maximum capacity", "10 AWG gauge with 30 amp maximum capacity", "8 AWG gauge with 40 amp maximum capacity"],
    explanation_en: "NEC requires minimum 12 AWG for 20-amp circuits. 14 AWG is only rated for 15A."
  },
  {
    category: "Electricidad",
    q: "¿Qué efecto tiene una caída de voltaje mayor al 3% en las líneas que alimentan un compresor?",
    options: ["El compresor opera más eficientemente con menos voltaje disponible", "El compresor jala más amperaje compensando el voltaje bajo y sobrecalienta", "No hay ningún efecto notable en el rendimiento del compresor motor", "El compresor gira más rápido intentando compensar la baja tensión"],
    correct: 1,
    explanation: "Con bajo voltaje, el motor jala más corriente para mantener la potencia (P=VI). Esto causa sobrecalentamiento del bobinado y acorta la vida del compresor."
  ,
    question_en: "What effect does a voltage drop greater than 3% have on lines feeding a compressor?",
    options_en: ["The compressor operates more efficiently with less available voltage", "The compressor draws more amperage compensating for low voltage and overheats", "There is no noticeable effect on compressor motor performance", "The compressor spins faster trying to compensate for low voltage"],
    explanation_en: "With low voltage, the motor draws more current to maintain power (P=VI). This causes winding overheating and shortens compressor life."
  },
  {
    category: "Motores",
    q: "¿Cuál es la función del devanado de arranque en un motor monofásico de compresor?",
    options: ["Proporcionar potencia continua durante toda la operación del motor", "Crear un campo magnético desfasado que genera torque inicial de arranque", "Regular la velocidad del motor una vez que alcanza RPM de operación", "Proteger el motor contra sobrecorriente durante condiciones de falla"],
    correct: 1,
    explanation: "El devanado de arranque crea un campo desfasado 90° del devanado principal, generando el torque rotacional necesario para iniciar el giro."
  ,
    question_en: "What is the function of the start winding in a single-phase compressor motor?",
    options_en: ["Provide continuous power during full motor operation", "Create an out-of-phase magnetic field that generates starting torque", "Regulate motor speed once it reaches operating RPM", "Protect the motor against overcurrent during fault conditions"],
    explanation_en: "The start winding creates a field 90 degrees out of phase with the main winding, generating the rotational torque needed to initiate rotation."
  },
  {
    category: "Motores",
    q: "¿Qué componente desconecta el devanado de arranque una vez que el motor alcanza velocidad?",
    options: ["El capacitor de marcha lo desconecta automáticamente por voltaje", "El relay de potencial o de corriente desconecta el arranque", "El termostato interno del motor corta el devanado de arranque", "El contactor principal abre el circuito del devanado de arranque"],
    correct: 1,
    explanation: "El relay de potencial (en compresores CSIR/CSR) o relay de corriente (en RSIR) desconecta el devanado de arranque al ~75% de velocidad."
  ,
    question_en: "What component disconnects the start winding once the motor reaches speed?",
    options_en: ["The run capacitor disconnects it automatically by voltage", "The potential or current relay disconnects the start winding", "The motor internal thermostat cuts the start winding", "The main contactor opens the start winding circuit"],
    explanation_en: "The potential relay (in CSIR/CSR compressors) or current relay (in RSIR) disconnects the start winding at ~75% speed."
  },
  {
    category: "Motores",
    q: "¿Qué lectura de megóhmetro indica que el aislamiento del motor está en buenas condiciones?",
    options: ["Menos de 1 megaohmio entre bobinado y tierra del motor", "Infinito o más de 20 megaohmios entre bobinado y tierra", "Exactamente 0 ohmios entre cualquier terminal y la carcasa", "Entre 100 y 500 ohmios entre los terminales del bobinado"],
    correct: 1,
    explanation: "Una lectura alta (>20 MΩ o infinito) indica buen aislamiento. Menos de 2 MΩ indica degradación y posible corto a tierra."
  ,
    question_en: "What megohmmeter reading indicates the motor insulation is in good condition?",
    options_en: ["Less than 1 megohm between winding and motor ground", "Infinity or more than 20 megohms between winding and ground", "Exactly 0 ohms between any terminal and the housing", "Between 100 and 500 ohms between winding terminals"],
    explanation_en: "A high reading (>20 megohms or infinity) indicates good insulation. Less than 2 megohms indicates degradation and possible ground short."
  },
  {
    category: "Motores",
    q: "¿Cuál es la ventaja principal de un motor ECM sobre un motor PSC para el ventilador evaporador?",
    options: ["El motor ECM es más barato de comprar e instalar inicialmente", "El motor ECM mantiene CFM constante ajustando velocidad contra presión estática", "El motor ECM no requiere capacitor de marcha para operar correctamente", "El motor ECM gira siempre a la misma velocidad fija sin variación"],
    correct: 1,
    explanation: "El ECM ajusta automáticamente sus RPM para mantener el flujo de aire (CFM) constante aunque aumente la presión estática por filtros sucios."
  ,
    question_en: "What is the main advantage of an ECM motor over a PSC motor for the evaporator fan?",
    options_en: ["The ECM motor is cheaper to buy and install initially", "The ECM motor maintains constant CFM by adjusting speed against static pressure", "The ECM motor does not require a run capacitor to operate correctly", "The ECM motor always spins at the same fixed speed without variation"],
    explanation_en: "The ECM automatically adjusts its RPM to maintain constant airflow (CFM) even when static pressure increases from dirty filters."
  },
  {
    category: "Motores",
    q: "Un motor de ventilador condensador gira pero en dirección incorrecta. ¿Cuál es la causa más probable?",
    options: ["El capacitor de marcha tiene demasiados microfaradios de capacitancia", "Los cables del motor fueron reconectados invirtiendo la polaridad del devanado", "El voltaje de alimentación es demasiado alto para el motor instalado", "La temperatura ambiente es muy baja afectando la rotación del motor"],
    correct: 1,
    explanation: "Invertir las conexiones de cualquier devanado (arranque o marcha) cambia la dirección de rotación. Se corrige intercambiando los cables."
  ,
    question_en: "A condenser fan motor spins but in the wrong direction. What is the most likely cause?",
    options_en: ["The run capacitor has too many microfarads of capacitance", "The motor wires were reconnected reversing the winding polarity", "The supply voltage is too high for the installed motor", "The ambient temperature is too low affecting motor rotation"],
    explanation_en: "Reversing the connections of either winding (start or run) changes the direction of rotation. It is corrected by swapping the wires."
  },
  {
    category: "Motores",
    q: "¿Qué significa FLA en la placa de datos de un compresor y por qué es importante?",
    options: ["Fan Load Amperage — corriente máxima del ventilador condensador", "Full Load Amperage — corriente máxima en operación normal continua", "Fuse Limit Amperage — tamaño máximo del fusible permitido", "Factory Listed Amperage — corriente de prueba de fábrica solamente"],
    correct: 1,
    explanation: "FLA (Full Load Amperage) es la corriente máxima que el motor jala en condiciones normales de carga completa. Se usa para dimensionar protecciones."
  ,
    question_en: "What does FLA mean on a compressor data plate and why is it important?",
    options_en: ["Fan Load Amperage -- maximum condenser fan current", "Full Load Amperage -- maximum current in normal continuous operation", "Fuse Limit Amperage -- maximum permitted fuse size", "Factory Listed Amperage -- factory test current only"],
    explanation_en: "FLA (Full Load Amperage) is the maximum current the motor draws under normal full load conditions. Used to size protections."
  },
  {
    category: "Motores",
    q: "Un motor PSC de ventilador tiene 4 cables de velocidad. ¿Cómo se selecciona la velocidad más alta?",
    options: ["Conectando el cable que tiene mayor resistencia al bobinado completo", "Conectando el cable que tiene menor resistencia dando más voltaje efectivo", "Conectando todos los cables juntos para máxima potencia al motor", "La velocidad se controla solo cambiando el voltaje de alimentación principal"],
    correct: 1,
    explanation: "Menor resistencia = mayor corriente = mayor velocidad. Los taps de velocidad son derivaciones del bobinado con diferentes resistencias."
  ,
    question_en: "A PSC fan motor has 4 speed wires. How is the highest speed selected?",
    options_en: ["Connecting the wire with the highest resistance to the full winding", "Connecting the wire with the lowest resistance giving more effective voltage", "Connecting all wires together for maximum motor power", "Speed is controlled only by changing the main supply voltage"],
    explanation_en: "Lower resistance = higher current = higher speed. Speed taps are winding taps with different resistances."
  },
  {
    category: "Motores",
    q: "¿Qué síntoma indica un motor de compresor con bobinado en corto a tierra?",
    options: ["El compresor arranca normalmente pero se apaga después de una hora", "El disyuntor se dispara inmediatamente al energizar el circuito del compresor", "El compresor zumba fuerte pero eventualmente arranca después de varios intentos", "El compresor opera silenciosamente pero no enfría el espacio correctamente"],
    correct: 1,
    explanation: "Un corto a tierra causa corriente masiva instantánea que dispara el breaker inmediatamente. El compresor nunca llega a arrancar."
  ,
    question_en: "What symptom indicates a compressor motor with a winding shorted to ground?",
    options_en: ["The compressor starts normally but shuts off after one hour", "The breaker trips immediately when energizing the compressor circuit", "The compressor buzzes loudly but eventually starts after several attempts", "The compressor operates quietly but does not cool the space correctly"],
    explanation_en: "A ground short causes massive instantaneous current that trips the breaker immediately. The compressor never gets to start."
  },
  {
    category: "Motores",
    q: "¿Qué sucede si el desbalance de voltaje entre fases de un motor trifásico excede el 2%?",
    options: ["El motor opera normalmente sin ningún efecto negativo visible", "El motor sobrecalienta porque una fase carga más corriente que las otras", "El motor gira más rápido compensando la diferencia de voltaje", "El motor invierte su dirección de rotación automáticamente por seguridad"],
    correct: 1,
    explanation: "Un desbalance de voltaje >2% causa desbalance de corriente multiplicado (3-8x). Una fase sobrecarga, generando calor excesivo en el bobinado."
  ,
    question_en: "What happens if the voltage imbalance between phases of a three-phase motor exceeds 2%?",
    options_en: ["The motor operates normally without any visible negative effect", "The motor overheats because one phase carries more current than the others", "The motor spins faster compensating for the voltage difference", "The motor automatically reverses its direction of rotation for safety"],
    explanation_en: "A voltage imbalance >2% causes a multiplied current imbalance (3-8x). One phase overloads, generating excessive heat in the winding."
  },
  {
    category: "Capacitores",
    q: "¿Cómo se prueba un capacitor de marcha con un multímetro digital que tiene función de microfaradios?",
    options: ["Medir voltaje AC con el capacitor conectado al circuito energizado", "Descargar el capacitor, desconectarlo y medir MFD con el multímetro", "Medir la resistencia en ohmios del capacitor mientras está en el circuito", "Conectar el multímetro en serie con el capacitor y medir amperaje"],
    correct: 1,
    explanation: "Se descarga el capacitor (corto entre terminales), se desconecta del circuito, y se mide MFD. Debe estar dentro del ±6% del valor nominal."
  ,
    question_en: "How do you test a run capacitor with a digital multimeter that has a microfarad function?",
    options_en: ["Measure AC voltage with the capacitor connected to the energized circuit", "Discharge the capacitor, disconnect it, and measure MFD with the multimeter", "Measure resistance in ohms of the capacitor while it is in the circuit", "Connect the multimeter in series with the capacitor and measure amperage"],
    explanation_en: "Discharge the capacitor (short between terminals), disconnect from circuit, and measure MFD. Must be within +/-6% of rated value."
  },
  {
    category: "Capacitores",
    q: "¿Cuál es la diferencia funcional entre un capacitor de arranque y uno de marcha?",
    options: ["El de arranque tiene más MFD y solo opera durante el arranque brevemente", "El de marcha tiene más MFD y opera continuamente mientras el motor funciona", "No hay diferencia, son exactamente iguales pero con diferente nombre", "El de arranque opera con AC y el de marcha solo opera con DC"],
    correct: 0,
    explanation: "El capacitor de arranque tiene alto MFD (88-1000+) para torque inicial y se desconecta rápido. El de marcha tiene bajo MFD (5-80) y opera continuamente."
  ,
    question_en: "What is the functional difference between a start capacitor and a run capacitor?",
    options_en: ["The start capacitor has more MFD and only operates briefly during startup", "The run capacitor has more MFD and operates continuously while the motor runs", "There is no difference, they are exactly the same but with different names", "The start capacitor operates with AC and the run capacitor only operates with DC"],
    explanation_en: "The start capacitor has high MFD (88-1000+) for initial torque and disconnects quickly. The run capacitor has low MFD (5-80) and operates continuously."
  },
  {
    category: "Capacitores",
    q: "¿Qué síntoma produce un capacitor de marcha del compresor con microfaradios por debajo del 6% de tolerancia?",
    options: ["El compresor arranca pero jala más amperaje y opera ineficientemente", "El compresor no arranca y hace un zumbido fuerte antes de disparar protección", "El compresor opera normalmente sin ningún síntoma perceptible visible", "El compresor gira en reversa causando presiones de refrigerante invertidas"],
    correct: 0,
    explanation: "Un capacitor de marcha débil reduce la eficiencia del motor. El compresor arranca pero jala más amperios y puede sobrecalentar."
  ,
    question_en: "What symptom does a compressor run capacitor with microfarads below the 6% tolerance produce?",
    options_en: ["The compressor starts but draws more amperage and operates inefficiently", "The compressor does not start and makes a loud buzzing before tripping protection", "The compressor operates normally without any visible perceptible symptom", "The compressor spins in reverse causing inverted refrigerant pressures"],
    explanation_en: "A weak run capacitor reduces motor efficiency. The compressor starts but draws more amps and may overheat."
  },
  {
    category: "Capacitores",
    q: "Un capacitor dual tiene terminales marcadas C, HERM y FAN. ¿Qué terminal es común a ambos?",
    options: ["C es el terminal común compartido entre HERM y FAN", "HERM es el terminal común compartido entre C y FAN", "FAN es el terminal común compartido entre C y HERM", "Ningún terminal es común, los tres son independientes entre sí"],
    correct: 0,
    explanation: "C (Common) es el terminal compartido. HERM va al compresor hermético y FAN va al motor del ventilador condensador."
  ,
    question_en: "A dual capacitor has terminals marked C, HERM, and FAN. Which terminal is common to both?",
    options_en: ["C is the common terminal shared between HERM and FAN", "HERM is the common terminal shared between C and FAN", "FAN is the common terminal shared between C and HERM", "No terminal is common, all three are independent of each other"],
    explanation_en: "C = Common, shared between both capacitors. HERM goes to the compressor. FAN goes to the condenser fan motor."
  },
  {
    category: "Capacitores",
    q: "¿Qué puede pasar si instalas un capacitor de marcha con voltaje nominal menor al del circuito?",
    options: ["El capacitor se infla y puede explotar por sobrevoltaje interno", "El capacitor funciona igual pero con menor eficiencia del motor", "El capacitor reduce automáticamente el voltaje a un nivel seguro", "No pasa nada, el voltaje nominal es solo una sugerencia del fabricante"],
    correct: 0,
    explanation: "Un capacitor con voltaje nominal insuficiente se sobrecalienta, se infla y puede explotar. Siempre usar voltaje igual o mayor al del circuito."
  ,
    question_en: "What can happen if you install a run capacitor with a voltage rating lower than the circuit?",
    options_en: ["The capacitor swells and can explode from internal overvoltage", "The capacitor works the same but with less motor efficiency", "The capacitor automatically reduces voltage to a safe level", "Nothing happens, the voltage rating is just a manufacturer suggestion"],
    explanation_en: "A capacitor with insufficient voltage rating overheats, swells, and can explode. Always use equal or higher voltage than the circuit."
  },
  {
    category: "Capacitores",
    q: "¿Por qué se debe descargar un capacitor antes de manipularlo o medirlo?",
    options: ["Para que la lectura del multímetro sea más precisa y estable", "Para evitar una descarga eléctrica peligrosa al tocar las terminales", "Para resetear el capacitor a su valor de fábrica original de MFD", "Para prolongar la vida útil del capacitor ahorrando ciclos de carga"],
    correct: 1,
    explanation: "Un capacitor almacena carga eléctrica que puede causar descarga peligrosa. Se descarga cortocircuitando las terminales con un resistor."
  ,
    question_en: "Why must a capacitor be discharged before handling or measuring it?",
    options_en: ["So the multimeter reading is more accurate and stable", "To avoid a dangerous electrical shock when touching the terminals", "To reset the capacitor to its original factory MFD value", "To extend the capacitor's lifespan by saving charge cycles"],
    explanation_en: "A capacitor stores electrical charge that can cause a dangerous shock. It is discharged by shorting the terminals with a resistor."
  },
  {
    category: "Capacitores",
    q: "Si un capacitor de arranque de 233 MFD mide 180 MFD, ¿qué acción se debe tomar?",
    options: ["Dejarlo porque todavía está dentro de tolerancia de operación normal", "Reemplazarlo porque está fuera de tolerancia aceptable del capacitor", "Agregar otro capacitor en paralelo para compensar los MFD faltantes", "Subir el voltaje del circuito para compensar la pérdida de capacitancia"],
    correct: 1,
    explanation: "180/233 = 77%, una pérdida del 23%. La tolerancia es ±10% máximo. Este capacitor está muy por debajo y debe reemplazarse."
  ,
    question_en: "If a 233 MFD start capacitor measures 180 MFD, what action should be taken?",
    options_en: ["Leave it because it is still within normal operating tolerance", "Replace it because it is outside acceptable capacitor tolerance", "Add another capacitor in parallel to compensate for the missing MFD", "Increase the circuit voltage to compensate for the capacitance loss"],
    explanation_en: "180/233 = 77%, a 23% loss. Tolerance is +/-10% maximum. This capacitor is well below and must be replaced."
  },
  {
    category: "Capacitores",
    q: "¿Qué indica un capacitor que está visiblemente hinchado o abultado en la parte superior?",
    options: ["Es una característica normal de diseño de capacitores industriales", "El capacitor falló internamente y necesita reemplazo inmediato urgente", "Solo necesita descargarse y se desinflará volviendo a la normalidad", "Está sobrecargado de MFD y se puede usar si no está caliente"],
    correct: 1,
    explanation: "Un capacitor hinchado indica falla interna con generación de gases. Es peligroso y debe reemplazarse inmediatamente sin intentar usarlo."
  ,
    question_en: "What does a capacitor that is visibly swollen or bulging at the top indicate?",
    options_en: ["It is a normal design feature of industrial capacitors", "The capacitor has failed internally and needs immediate replacement", "It only needs to be discharged and it will deflate returning to normal", "It is overcharged with MFD and can be used if it is not hot"],
    explanation_en: "A swollen capacitor indicates internal failure with gas generation. It is dangerous and must be replaced immediately without attempting to use it."
  },
  {
    category: "Contactores",
    q: "¿Qué voltaje típico se aplica a la bobina de un contactor en sistemas residenciales de AC?",
    options: ["120 voltios AC directo de la línea de alimentación principal L1", "24 voltios AC desde el transformador del circuito de control", "240 voltios AC de las dos líneas de alimentación L1 y L2", "12 voltios DC desde una fuente de poder regulada auxiliar"],
    correct: 1,
    explanation: "En sistemas residenciales, la bobina del contactor es de 24VAC, alimentada por el transformador de control a través del termostato."
  ,
    question_en: "What typical voltage is applied to the contactor coil in residential AC systems?",
    options_en: ["120 volts AC direct from the L1 main power line", "24 volts AC from the control circuit transformer", "240 volts AC from both L1 and L2 power lines", "12 volts DC from a regulated auxiliary power supply"],
    explanation_en: "In residential systems, the contactor coil is 24VAC, powered by the control transformer through the thermostat."
  },
  {
    category: "Contactores",
    q: "¿Qué causa que un contactor produzca un zumbido o chattering constante sin cerrar completamente?",
    options: ["Voltaje alto en la bobina que causa exceso de fuerza magnética", "Voltaje bajo en la bobina insuficiente para cerrar los contactos firmemente", "Corriente excesiva pasando por los contactos principales del contactor", "Temperatura ambiente alta que afecta el material de los contactos"],
    correct: 1,
    explanation: "Bajo voltaje en la bobina produce campo magnético débil. Los contactos abren y cierran rápidamente (chattering), causando arco y daño prematuro."
  ,
    question_en: "What causes a contactor to produce a constant buzzing or chattering without fully closing?",
    options_en: ["High voltage on the coil causing excess magnetic force", "Low voltage on the coil insufficient to firmly close the contacts", "Excessive current passing through the main contactor contacts", "High ambient temperature affecting the contact material"],
    explanation_en: "Low coil voltage produces a weak magnetic field. The contacts open and close rapidly (chattering), causing arcing and premature damage."
  },
  {
    category: "Contactores",
    q: "¿Cómo se diagnostican contactos principales erosionados (pitting) en un contactor?",
    options: ["Midiendo el voltaje en la bobina del contactor con el termostato", "Midiendo caída de voltaje a través de los contactos cerrados con carga", "Midiendo la resistencia de la bobina del contactor con multímetro", "Escuchando si el contactor hace un clic fuerte al energizar la bobina"],
    correct: 1,
    explanation: "Contactos erosionados tienen alta resistencia. Se mide caída de voltaje con los contactos cerrados: más de 1-2V indica contactos dañados."
  ,
    question_en: "How are eroded (pitted) main contacts diagnosed in a contactor?",
    options_en: ["Measuring the voltage on the contactor coil with the thermostat", "Measuring voltage drop across the closed contacts under load", "Measuring the resistance of the contactor coil with a multimeter", "Listening for a loud click when the coil is energized"],
    explanation_en: "Eroded contacts have high resistance. Voltage drop is measured with contacts closed: more than 1-2V indicates damaged contacts."
  },
  {
    category: "Contactores",
    q: "¿Qué sucede si los contactos de un contactor quedan soldados (welded) en posición cerrada?",
    options: ["El sistema se apaga completamente y no arranca hasta reparar", "El compresor opera continuamente sin detenerse aunque el termostato corte", "El contactor se abre automáticamente por la protección térmica interna", "Los fusibles se queman inmediatamente cortando toda la energía del sistema"],
    correct: 1,
    explanation: "Contactos soldados mantienen el circuito cerrado permanentemente. El compresor no se apaga cuando el termostato satisface, causando sobreenfriamiento."
  ,
    question_en: "What happens if contactor contacts become welded shut in the closed position?",
    options_en: ["The system shuts off completely and does not start until repaired", "The compressor runs continuously without stopping even when thermostat cuts", "The contactor opens automatically from the internal thermal protection", "The fuses blow immediately cutting all power to the system"],
    explanation_en: "Welded contacts keep the circuit permanently closed. The compressor does not shut off when the thermostat is satisfied, causing overcooling."
  },
  {
    category: "Contactores",
    q: "¿Cuál es el procedimiento correcto para determinar el tamaño de reemplazo de un contactor?",
    options: ["Usar uno del mismo color y tamaño físico que el original instalado", "Verificar amperaje nominal FLA del compresor y voltaje de la bobina", "Escoger el contactor más grande disponible por seguridad y durabilidad", "Cualquier contactor de 24 voltios funciona para todos los compresores"],
    correct: 1,
    explanation: "El contactor debe manejar el FLA del compresor (más ventilador si aplica) y tener bobina del voltaje correcto (24V, 120V, 240V)."
  ,
    question_en: "What is the correct procedure for determining the replacement contactor size?",
    options_en: ["Use one of the same color and physical size as the original installed", "Verify the compressor FLA amperage rating and coil voltage", "Choose the largest available contactor for safety and durability", "Any 24-volt contactor works for all compressors"],
    explanation_en: "The contactor must handle the compressor FLA (plus fan if applicable) and have a coil of the correct voltage (24V, 120V, 240V)."
  },
  {
    category: "Contactores",
    q: "¿Qué indica si mides 240V en un lado del contactor y 0V en el otro con el contactor energizado?",
    options: ["El contactor está funcionando correctamente pasando todo el voltaje", "Un contacto está abierto o dañado impidiendo el paso de corriente", "El transformador de control está enviando voltaje insuficiente al sistema", "La lectura es normal para un contactor bajo carga con compresor operando"],
    correct: 1,
    explanation: "Con contactor cerrado, ambos lados deben tener ~240V. Si un lado tiene 0V, ese contacto está abierto (no cierra) y necesita reemplazo."
  ,
    question_en: "What does it indicate if you measure 240V on one side of the contactor and 0V on the other with the contactor energized?",
    options_en: ["The contactor is functioning correctly passing all the voltage", "A contact is open or damaged preventing current from passing", "The control transformer is sending insufficient voltage to the system", "The reading is normal for a contactor under load with compressor operating"],
    explanation_en: "With a closed contactor, both sides should have ~240V. If one side has 0V, that contact is open (not closing) and needs replacement."
  },
  {
    category: "Contactores",
    q: "¿Por qué es peligroso limar o lijar los contactos erosionados de un contactor para reutilizarlo?",
    options: ["Porque limarlos los deja más brillantes y atractivos visualmente", "Porque se remueve el material conductor especial dejando metal inferior", "Porque el polvo metálico producido es altamente inflamable y explosivo", "No es peligroso, es una práctica recomendada por todos los fabricantes"],
    correct: 1,
    explanation: "Los contactos tienen un recubrimiento de plata u aleación especial. Al limarlos, queda solo el metal base que se erosiona mucho más rápido."
  ,
    question_en: "Why is it dangerous to file or sand eroded contactor contacts to reuse it?",
    options_en: ["Because filing them makes them shinier and more visually attractive", "Because the special conductive coating material is removed leaving inferior metal", "Because the metallic dust produced is highly flammable and explosive", "It is not dangerous, it is a recommended practice by all manufacturers"],
    explanation_en: "Contacts have a silver or special alloy coating. Filing them removes it, leaving only the base metal that erodes much faster."
  },
  {
    category: "Contactores",
    q: "¿Qué problema causa una conexión floja en la terminal de un contactor?",
    options: ["Reduce el consumo de energía del compresor ahorrando electricidad", "Genera calor excesivo por resistencia alta que puede derretir cables", "Aumenta la vida útil del contactor por menor flujo de corriente", "No causa ningún problema mientras el contactor cierre correctamente"],
    correct: 1,
    explanation: "Una conexión floja tiene alta resistencia que genera calor (P=I²R). Puede derretir el aislamiento, quemar terminales y causar incendio."
  ,
    question_en: "What problem does a loose connection at a contactor terminal cause?",
    options_en: ["It reduces the compressor energy consumption saving electricity", "It generates excessive heat from high resistance that can melt wires", "It increases contactor lifespan from lower current flow", "It causes no problem as long as the contactor closes correctly"],
    explanation_en: "A loose connection has high resistance that generates heat (P=I2R). It can melt insulation, burn terminals, and cause a fire."
  },
  {
    category: "Relays",
    q: "¿Cuál es la función de un relay de potencial en un compresor con capacitor de arranque?",
    options: ["Mantener el capacitor de arranque conectado durante toda la operación", "Desconectar el capacitor de arranque cuando el motor alcanza velocidad", "Regular el voltaje que llega al devanado principal del compresor", "Invertir la dirección de rotación del compresor cuando es necesario"],
    correct: 1,
    explanation: "El relay de potencial detecta el back-EMF del devanado de arranque. Cuando el voltaje sube (motor rápido), abre y desconecta el capacitor de arranque."
  ,
    question_en: "What is the function of a potential relay in a compressor with a start capacitor?",
    options_en: ["Keep the start capacitor connected during full operation", "Disconnect the start capacitor when the motor reaches speed", "Regulate the voltage reaching the main compressor winding", "Reverse the compressor rotation direction when needed"],
    explanation_en: "The potential relay detects the back-EMF of the start winding. When voltage rises (motor fast), it opens and disconnects the start capacitor."
  },
  {
    category: "Relays",
    q: "¿Cómo funciona un relay de corriente en un compresor tipo RSIR?",
    options: ["Detecta el voltaje de la línea para decidir cuándo arrancar el motor", "Detecta la corriente alta de arranque y cierra el circuito de arranque", "Mide la temperatura del compresor para proteger contra sobrecalentamiento", "Controla la velocidad del ventilador evaporador según demanda de enfriamiento"],
    correct: 1,
    explanation: "El relay de corriente tiene su bobina en serie con el devanado principal. La alta corriente de arranque cierra el contacto conectando el devanado de arranque."
  ,
    question_en: "How does a current relay work in an RSIR type compressor?",
    options_en: ["It detects line voltage to decide when to start the motor", "It detects the high starting current and closes the start circuit", "It measures compressor temperature to protect against overheating", "It controls evaporator fan speed based on cooling demand"],
    explanation_en: "The current relay has its coil in series with the main winding. The high starting current closes the contact connecting the start winding."
  },
  {
    category: "Relays",
    q: "¿Qué es un PTC (Positive Temperature Coefficient) y cuándo se usa en HVAC?",
    options: ["Un sensor que mide temperatura del refrigerante en el evaporador", "Un dispositivo que reemplaza el relay de arranque en compresores pequeños", "Un control que aumenta la velocidad del ventilador con la temperatura", "Un tipo de fusible que protege el transformador de circuito de control"],
    correct: 1,
    explanation: "El PTC es una resistencia cerámica que aumenta con la temperatura. Al arrancar, conduce y energiza el arranque. Al calentarse, su resistencia sube y lo desconecta."
  ,
    question_en: "What is a PTC (Positive Temperature Coefficient) and when is it used in HVAC?",
    options_en: ["A sensor that measures refrigerant temperature at the evaporator", "A device that replaces the start relay in small compressors", "A control that increases fan speed with temperature", "A type of fuse that protects the control circuit transformer"],
    explanation_en: "The PTC is a ceramic resistance that increases with temperature. On startup it conducts and energizes the start winding. As it heats up, its resistance rises and disconnects it."
  },
  {
    category: "Relays",
    q: "¿Qué tipo de relay de tiempo se usa para prevenir arranque rápido del compresor (short cycling)?",
    options: ["Relay de retardo a la conexión (time delay on make) de 5 minutos", "Relay anti-short-cycle que impide re-arranque por 5 minutos mínimo", "Relay de potencial con bobina de alto voltaje de respuesta lenta", "Relay de corriente con tiempo de respuesta ajustable por tornillo"],
    correct: 1,
    explanation: "El timer anti-short-cycle previene que el compresor arranque dentro de los 5 minutos después de apagarse, protegiendo contra daño por presiones no equalizadas."
  ,
    question_en: "What type of time relay is used to prevent rapid compressor starting (short cycling)?",
    options_en: ["Time delay on make relay of 5 minutes", "Anti-short-cycle relay that prevents restart for 5 minutes minimum", "Potential relay with slow-response high voltage coil", "Current relay with adjustable response time by screw"],
    explanation_en: "The anti-short-cycle timer prevents the compressor from starting within 5 minutes of shutting off, protecting against damage from unequalized pressures."
  },
  {
    category: "Relays",
    q: "Un hard start kit consiste en un capacitor de arranque y un relay de potencial. ¿Cuándo se instala?",
    options: ["En todos los sistemas nuevos como parte de la instalación estándar", "Cuando el compresor tiene dificultad para arrancar por bajo voltaje o desgaste", "Solo en sistemas comerciales grandes de más de 5 toneladas de capacidad", "Cuando el capacitor de marcha está fallando y necesita ayuda extra"],
    correct: 1,
    explanation: "El hard start kit se agrega cuando el compresor no arranca firmemente — por bajo voltaje, TXV que no equaliza, o desgaste. Da torque extra de arranque."
  ,
    question_en: "A hard start kit consists of a start capacitor and potential relay. When is it installed?",
    options_en: ["On all new systems as part of standard installation", "When the compressor has difficulty starting due to low voltage or wear", "Only on large commercial systems over 5 tons capacity", "When the run capacitor is failing and needs extra help"],
    explanation_en: "The hard start kit is added when the compressor does not start firmly -- from low voltage, TXV that does not equalize, or wear. It gives extra starting torque."
  },
  {
    category: "Relays",
    q: "¿Cuál es la diferencia entre un relay normalmente abierto (NO) y normalmente cerrado (NC)?",
    options: ["NO cierra cuando se energiza la bobina y NC abre cuando se energiza", "NO nunca cambia de estado y NC cambia continuamente durante operación", "NO opera con DC solamente y NC opera exclusivamente con corriente AC", "No hay diferencia funcional, solo es nomenclatura del fabricante diferente"],
    correct: 0,
    explanation: "NO (Normally Open) cierra el contacto cuando la bobina se energiza. NC (Normally Closed) abre cuando la bobina se energiza. Estado 'normal' = sin energía."
  ,
    question_en: "What is the difference between a normally open (NO) and normally closed (NC) relay?",
    options_en: ["NO closes when the coil is energized and NC opens when energized", "NO never changes state and NC changes continuously during operation", "NO operates with DC only and NC operates exclusively with AC current", "There is no functional difference, it is just different manufacturer nomenclature"],
    explanation_en: "NO (Normally Open) closes the contact when the coil is energized. NC (Normally Closed) opens when the coil is energized. Normal state = de-energized."
  },
  {
    category: "Relays",
    q: "¿Qué componente detecta la presión de aceite en un compresor semi-hermético y apaga el sistema si falla?",
    options: ["El presostato de alta presión estándar del sistema de refrigeración", "El relay de presión diferencial de aceite con temporizador integrado", "El sensor de temperatura del cárter del compresor semihermético grande", "El relay de corriente que monitorea los amperios del motor continuamente"],
    correct: 1,
    explanation: "El oil pressure safety switch mide la diferencia entre presión de aceite y presión del cárter. Si es insuficiente por ~90 segundos, apaga el compresor."
  ,
    question_en: "What component detects oil pressure in a semi-hermetic compressor and shuts down the system if it fails?",
    options_en: ["The standard high pressure switch of the refrigeration system", "The differential oil pressure relay with integrated timer", "The crankcase temperature sensor of the large semi-hermetic compressor", "The current relay that monitors motor amperage continuously"],
    explanation_en: "The oil pressure safety switch measures the difference between oil pressure and crankcase pressure. If insufficient for ~90 seconds, it shuts off the compressor."
  },
  {
    category: "Termostatos",
    q: "¿Qué terminal del termostato controla el compresor (cooling) en un sistema convencional?",
    options: ["Terminal R que es el voltaje de alimentación de 24 voltios", "Terminal Y que activa el contactor del compresor para enfriamiento", "Terminal G que controla el relay del ventilador evaporador interior", "Terminal W que activa la calefacción por gas o eléctrica auxiliar"],
    correct: 1,
    explanation: "Y = compressor/cooling. R = 24V power, G = fan, W = heat. El termostato conecta R a Y cuando pide enfriamiento."
  ,
    question_en: "What thermostat terminal controls the compressor (cooling) in a conventional system?",
    options_en: ["Terminal R which is the 24-volt power supply", "Terminal Y which activates the compressor contactor for cooling", "Terminal G which controls the indoor evaporator fan relay", "Terminal W which activates gas or auxiliary electric heating"],
    explanation_en: "Y = compressor/cooling. R = 24V power, G = fan, W = heat. The thermostat connects R to Y when calling for cooling."
  },
  {
    category: "Termostatos",
    q: "¿Para qué sirve el terminal C (Common) en un termostato moderno inteligente?",
    options: ["Para conectar el sensor de temperatura exterior del sistema bomba calor", "Para proveer el lado de retorno de 24VAC que alimenta el termostato", "Para activar el modo de emergencia cuando falla el compresor principal", "Para conectar un sensor de humedad externo opcional al termostato digital"],
    correct: 1,
    explanation: "C (Common) es el retorno del 24V del transformador. Los termostatos inteligentes necesitan alimentación continua de 24VAC (R y C) para WiFi y display."
  ,
    question_en: "What is the C (Common) terminal for in a modern smart thermostat?",
    options_en: ["To connect the outdoor temperature sensor of the heat pump system", "To provide the 24VAC return side that powers the thermostat", "To activate emergency mode when the main compressor fails", "To connect an optional external humidity sensor to the digital thermostat"],
    explanation_en: "C (Common) is the return of the transformer 24V. Smart thermostats need continuous 24VAC power (R and C) for WiFi and display."
  },
  {
    category: "Termostatos",
    q: "En un sistema de bomba de calor, ¿qué terminal del termostato controla la válvula reversible?",
    options: ["Terminal Y que también controla el compresor para calentamiento", "Terminal O o B que energiza o desenergiza la válvula de cuatro vías", "Terminal W2 que activa la segunda etapa de calefacción auxiliar", "Terminal E que activa calefacción de emergencia sin compresor bomba"],
    correct: 1,
    explanation: "O (Rheem/Ruud) energiza la válvula en cooling. B (Goodman) energiza en heating. Controla la válvula de 4 vías para cambiar entre modo frío y calor."
  ,
    question_en: "In a heat pump system, what thermostat terminal controls the reversing valve?",
    options_en: ["Terminal Y which also controls the compressor for heating", "Terminal O or B which energizes or de-energizes the four-way valve", "Terminal W2 which activates the second stage of auxiliary heating", "Terminal E which activates emergency heating without compressor pump"],
    explanation_en: "O (Rheem/Ruud) energizes the valve in cooling. B (Goodman) energizes in heating. Controls the 4-way valve to switch between cooling and heating modes."
  },
  {
    category: "Termostatos",
    q: "¿Qué problema causa instalar un termostato en una pared exterior o cerca de una ventana?",
    options: ["El termostato se daña por la exposición directa a luz ultravioleta", "El termostato lee temperatura incorrecta causando ciclos erráticos del sistema", "No hay ningún problema, los termostatos modernos compensan automáticamente", "El termostato consume más batería por la variación de temperatura constante"],
    correct: 1,
    explanation: "Una pared exterior o ventana crea lecturas falsas (más frío o calor que el centro del espacio). El sistema sobretrabaja o subtrabaja."
  ,
    question_en: "What problem does installing a thermostat on an exterior wall or near a window cause?",
    options_en: ["The thermostat gets damaged from direct ultraviolet light exposure", "The thermostat reads incorrect temperature causing erratic system cycles", "There is no problem, modern thermostats compensate automatically", "The thermostat uses more battery due to the constant temperature variation"],
    explanation_en: "An exterior wall or window creates false readings (colder or hotter than the center of the space). The system overworks or underworks."
  },
  {
    category: "Termostatos",
    q: "¿Qué es el diferencial de temperatura en un termostato y cómo afecta el confort?",
    options: ["La diferencia entre temperatura interior y exterior del edificio monitoreado", "La diferencia entre temperatura de encendido y apagado del sistema HVAC", "La diferencia entre temperatura del suministro y retorno del aire acondicionado", "La diferencia entre temperatura del refrigerante y temperatura del aire"],
    correct: 1,
    explanation: "El diferencial (típicamente 1-3°F) es el rango entre cuando el sistema enciende y apaga. Muy amplio = poca comodidad, muy estrecho = short cycling."
  ,
    question_en: "What is the temperature differential in a thermostat and how does it affect comfort?",
    options_en: ["The difference between indoor and outdoor building temperature monitored", "The difference between the system HVAC turn-on and turn-off temperature", "The difference between supply and return air conditioning temperature", "The difference between refrigerant temperature and air temperature"],
    explanation_en: "The differential (typically 1-3°F) is the range between when the system turns on and off. Too wide = poor comfort, too narrow = short cycling."
  },
  {
    category: "Termostatos",
    q: "¿Qué sucede si conectas el cable de 240V de alimentación a la terminal R del termostato de 24V?",
    options: ["El termostato simplemente no enciende y queda apagado sin daño", "El termostato se quema instantáneamente y puede causar un incendio", "El termostato funciona pero con lecturas de temperatura menos precisas", "El termostato reduce el voltaje automáticamente a 24V internamente"],
    correct: 1,
    explanation: "El circuito de control es de 24V. Aplicar 240V destruye instantáneamente el termostato y puede dañar el transformador, bobinas y relays."
  ,
    question_en: "What happens if you connect the 240V power cable to the R terminal of a 24V thermostat?",
    options_en: ["The thermostat simply does not turn on and stays off without damage", "The thermostat burns instantly and can cause a fire", "The thermostat works but with less accurate temperature readings", "The thermostat automatically reduces the voltage to 24V internally"],
    explanation_en: "The control circuit is 24V. Applying 240V instantly destroys the thermostat and can damage the transformer, coils, and relays."
  },
  {
    category: "Termostatos",
    q: "En un termostato de dos etapas, ¿qué sucede cuando Y1 no satisface la demanda de enfriamiento?",
    options: ["El sistema se apaga completamente y espera el siguiente ciclo programado", "El termostato activa Y2 encendiendo la segunda etapa de enfriamiento adicional", "El ventilador aumenta a velocidad máxima para compensar la demanda faltante", "El termostato baja el setpoint automáticamente dos grados más para compensar"],
    correct: 1,
    explanation: "Si Y1 (primera etapa) no satisface después del diferencial/tiempo programado, Y2 activa la segunda etapa para capacidad adicional."
  ,
    question_en: "In a two-stage thermostat, what happens when Y1 does not satisfy the cooling demand?",
    options_en: ["The system shuts off completely and waits for the next programmed cycle", "The thermostat activates Y2 turning on the second additional cooling stage", "The fan increases to maximum speed to compensate for the missing demand", "The thermostat automatically lowers the setpoint two more degrees to compensate"],
    explanation_en: "If Y1 (first stage) does not satisfy after the programmed differential/time, Y2 activates the second stage for additional capacity."
  },
  {
    category: "Termostatos",
    q: "¿Qué terminal activa la calefacción de emergencia en un sistema de bomba de calor?",
    options: ["Terminal W1 que también se usa para calefacción normal primera etapa", "Terminal E que bypasea el compresor y usa solo resistencias eléctricas", "Terminal Y que normalmente controla el compresor de enfriamiento regular", "Terminal G que enciende el ventilador en modo continuo de circulación"],
    correct: 1,
    explanation: "E (Emergency) activa las resistencias eléctricas de respaldo SIN el compresor. Se usa cuando la bomba de calor falla y se necesita calor."
  ,
    question_en: "What terminal activates emergency heating in a heat pump system?",
    options_en: ["Terminal W1 which is also used for normal first stage heating", "Terminal E which bypasses the compressor and uses only electric resistance strips", "Terminal Y which normally controls the regular cooling compressor", "Terminal G which turns on the fan in continuous circulation mode"],
    explanation_en: "E (Emergency) activates the backup electric resistance strips WITHOUT the compressor. Used when the heat pump fails and heat is needed."
  },
  {
    category: "Termostatos",
    q: "¿Cuál es la ubicación ideal para instalar un termostato en una casa residencial?",
    options: ["En la cocina donde hay más actividad y variación de temperatura", "En una pared interior a 5 pies de altura lejos de fuentes de calor", "Junto al return de aire para leer la temperatura más precisa posible", "En el pasillo cerca del baño para captar la humedad del agua caliente"],
    correct: 1,
    explanation: "Pared interior, ~5 pies de altura, lejos de ventanas, ductos, cocina y corrientes de aire. Esto da la lectura más representativa del espacio."
  ,
    question_en: "What is the ideal location to install a thermostat in a residential home?",
    options_en: ["In the kitchen where there is the most activity and temperature variation", "On an interior wall at 5 feet height away from heat sources", "Next to the air return to read the most accurate temperature possible", "In the hallway near the bathroom to capture hot water humidity"],
    explanation_en: "Interior wall, ~5 feet height, away from windows, ducts, kitchen, and drafts. This gives the most representative reading of the space."
  },
  {
    category: "Controles",
    q: "¿A qué presión típica se activa el presostato de alta presión en un sistema de R-410A?",
    options: ["200 psi es el punto de corte típico del presostato de alta", "350 psi es el punto de corte típico del presostato de alta", "610 psi es el punto de corte típico del presostato de alta presión", "800 psi es el punto de corte típico del presostato de alta presión"],
    correct: 2,
    explanation: "Para R-410A, el presostato de alta corta típicamente entre 600-625 psi. R-410A opera a presiones mucho más altas que R-22."
  ,
    question_en: "At what typical pressure does the high pressure switch activate in an R-410A system?",
    options_en: ["200 psi is the typical high pressure switch cutout point", "350 psi is the typical high pressure switch cutout point", "610 psi is the typical high pressure switch cutout point", "800 psi is the typical high pressure switch cutout point"],
    explanation_en: "For R-410A, the high pressure switch typically cuts out between 600-625 psi. R-410A operates at much higher pressures than R-22."
  },
  {
    category: "Controles",
    q: "¿Qué activa el presostato de baja presión y qué condición protege?",
    options: ["Se activa por alta presión protegiendo el condensador contra sobrepresión", "Se activa por baja presión protegiendo el evaporador contra congelamiento", "Se activa por alta temperatura protegiendo el compresor contra sobrecalentamiento", "Se activa por bajo voltaje protegiendo el motor contra daño eléctrico"],
    correct: 1,
    explanation: "El presostato de baja corta cuando la succión baja demasiado (evaporador congelándose, pérdida de refrigerante, flujo de aire restringido)."
  ,
    question_en: "What activates the low pressure switch and what condition does it protect?",
    options_en: ["It activates on high pressure protecting the condenser against overpressure", "It activates on low pressure protecting the evaporator against freezing", "It activates on high temperature protecting the compressor against overheating", "It activates on low voltage protecting the motor against electrical damage"],
    explanation_en: "The low pressure switch cuts out when suction drops too low (evaporator freezing, refrigerant loss, restricted airflow)."
  },
  {
    category: "Controles",
    q: "¿Qué es un pump-down y cómo se logra con el control del sistema?",
    options: ["Es aumentar presión del sistema cerrando válvulas de servicio manualmente", "Es almacenar el refrigerante en el condensador cerrando la válvula solenoide", "Es evacuar todo el refrigerante del sistema para mantenimiento completo", "Es subir la presión de succión abriendo la válvula de expansión completamente"],
    correct: 1,
    explanation: "El pump-down cierra la válvula solenoide de líquido. El compresor bombea refrigerante al condensador hasta que el presostato de baja lo apaga."
  ,
    question_en: "What is a pump-down and how is it achieved with system controls?",
    options_en: ["It is increasing system pressure by manually closing service valves", "It is storing refrigerant in the condenser by closing the liquid solenoid valve", "It is evacuating all refrigerant from the system for complete maintenance", "It is raising suction pressure by fully opening the expansion valve"],
    explanation_en: "Pump-down closes the liquid line solenoid valve. The compressor pumps refrigerant to the condenser until the low pressure switch shuts it off."
  },
  {
    category: "Controles",
    q: "¿Cuál es la función de un humidistato en un sistema HVAC residencial?",
    options: ["Medir la temperatura del aire de retorno para control del termostato", "Controlar la humedad relativa activando humidificador o deshumidificador", "Regular la velocidad del ventilador según la cantidad de personas presentes", "Monitorear la calidad del aire midiendo niveles de CO2 en el espacio"],
    correct: 1,
    explanation: "El humidistato mide la humedad relativa y activa equipos de control de humedad para mantener el nivel dentro del rango confortable (30-60%)."
  ,
    question_en: "What is the function of a humidistat in a residential HVAC system?",
    options_en: ["Measure the return air temperature for thermostat control", "Control relative humidity by activating humidifier or dehumidifier", "Regulate fan speed based on the number of people present", "Monitor air quality by measuring CO2 levels in the space"],
    explanation_en: "The humidistat measures relative humidity and activates humidity control equipment to maintain the level within the comfortable range (30-60%)."
  },
  {
    category: "Controles",
    q: "¿Qué tamaño de fusible se usa típicamente para proteger un circuito de control de 24VAC?",
    options: ["Fusible de 1 amperio para circuitos de control estándar de 24V", "Fusible de 3 o 5 amperios para circuitos de control estándar de 24V", "Fusible de 15 amperios igual que los circuitos de iluminación residencial", "No se usa fusible en circuitos de 24V porque el voltaje es muy bajo"],
    correct: 1,
    explanation: "El fusible del circuito de control es típicamente 3A o 5A. Protege el transformador y componentes de 24V contra cortocircuitos."
  ,
    question_en: "What fuse size is typically used to protect a 24VAC control circuit?",
    options_en: ["1 amp fuse for standard 24V control circuits", "3 or 5 amp fuse for standard 24V control circuits", "15 amp fuse same as residential lighting circuits", "No fuse is used in 24V circuits because voltage is very low"],
    explanation_en: "The control circuit fuse is typically 3A or 5A. It protects the transformer and 24V components against short circuits."
  },
  {
    category: "Controles",
    q: "¿Para qué sirve una válvula solenoide en la línea de líquido de un sistema de refrigeración?",
    options: ["Para regular la cantidad de refrigerante que fluye al evaporador continuamente", "Para cerrar el flujo de líquido durante pump-down o descongelamiento programado", "Para convertir refrigerante líquido a gas antes de entrar al evaporador", "Para medir la presión del lado de alta del sistema de refrigeración"],
    correct: 1,
    explanation: "La válvula solenoide abre/cierra eléctricamente el flujo de líquido. Se usa para pump-down y para detener flujo durante defrost en walk-in coolers."
  ,
    question_en: "What is a solenoid valve in the liquid line of a refrigeration system used for?",
    options_en: ["To regulate the amount of refrigerant flowing to the evaporator continuously", "To close liquid flow during pump-down or scheduled defrost", "To convert liquid refrigerant to gas before entering the evaporator", "To measure the high side pressure of the refrigeration system"],
    explanation_en: "The solenoid valve electrically opens/closes liquid flow. Used for pump-down and to stop flow during defrost in walk-in coolers."
  },
  {
    category: "Controles",
    q: "¿Cómo se determina el tamaño correcto (VA) de un transformador de reemplazo?",
    options: ["Usar siempre el transformador más grande disponible por seguridad total", "Sumar los VA de todas las cargas del circuito de control y agregar 20%", "Usar el mismo VA que el fusible del circuito de alimentación primario", "Cualquier transformador de 24V sirve sin importar los VA de capacidad"],
    correct: 1,
    explanation: "Se suman los VA de todas las cargas (contactor, relay, solenoide, termostato) y se agrega 20% de margen. Típicamente 40VA o 75VA residencial."
  ,
    question_en: "How do you determine the correct size (VA) of a replacement transformer?",
    options_en: ["Always use the largest available transformer for total safety", "Add up the VA of all control circuit loads and add 20%", "Use the same VA as the primary power circuit fuse", "Any 24V transformer works regardless of VA capacity"],
    explanation_en: "Add up the VA of all loads (contactor, relay, solenoid, thermostat) and add 20% margin. Typically 40VA or 75VA residential."
  },
  {
    category: "Controles",
    q: "¿Qué tipo de control de temperatura se usa en un walk-in cooler para mantener 35°F?",
    options: ["Termostato residencial estándar montado en la pared del cuarto frío", "Control de temperatura con bulbo sensor en el aire de retorno del evaporador", "Timer que enciende el compresor 30 minutos cada hora automáticamente", "Presostato de baja presión calibrado para cortar a la temperatura deseada"],
    correct: 1,
    explanation: "Los walk-in coolers usan controles de temperatura con bulbo sensor en el aire de retorno o en la superficie del evaporador para mantener temperatura precisa."
  ,
    question_en: "What type of temperature control is used in a walk-in cooler to maintain 35°F?",
    options_en: ["Standard residential thermostat mounted on the cold room wall", "Temperature control with sensor bulb in the evaporator return air", "Timer that turns the compressor on 30 minutes every hour automatically", "Low pressure switch calibrated to cut off at the desired temperature"],
    explanation_en: "Walk-in coolers use temperature controls with a sensor bulb in the return air or on the evaporator surface to maintain precise temperature."
  },
  {
    category: "Controles",
    q: "¿Cuál es la función del relay de retardo del ventilador (fan delay) en un sistema de calefacción?",
    options: ["Apagar el ventilador inmediatamente cuando el termostato se satisface", "Mantener el ventilador funcionando después de que la calefacción se apaga", "Encender el ventilador antes de que la calefacción comience a operar", "Reducir la velocidad del ventilador gradualmente durante operación normal"],
    correct: 1,
    explanation: "El fan delay mantiene el ventilador operando 60-90 segundos después de apagar la calefacción para extraer el calor residual del intercambiador."
  ,
    question_en: "What is the function of the fan delay relay in a heating system?",
    options_en: ["Turn off the fan immediately when the thermostat is satisfied", "Keep the fan running after the heating shuts off", "Turn on the fan before the heating starts operating", "Gradually reduce fan speed during normal operation"],
    explanation_en: "The fan delay keeps the fan operating 60-90 seconds after heating shuts off to extract residual heat from the heat exchanger."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Cuándo se requiere un GFCI (Ground Fault Circuit Interrupter) para equipo HVAC según NEC?",
    options: ["Solo para equipos instalados en interiores de edificios residenciales", "Para equipos al aire libre y en ubicaciones húmedas o mojadas accesibles", "Nunca se requiere GFCI para equipos de HVAC bajo ninguna circunstancia", "Solo para equipos comerciales de más de 10 toneladas de capacidad total"],
    correct: 1,
    explanation: "NEC requiere GFCI para receptáculos y equipos en ubicaciones mojadas, al aire libre, garajes, sótanos y otras áreas especificadas."
  ,
    question_en: "When is a GFCI (Ground Fault Circuit Interrupter) required for HVAC equipment per NEC?",
    options_en: ["Only for equipment installed indoors in residential buildings", "For equipment outdoors and in wet or damp accessible locations", "GFCI is never required for HVAC equipment under any circumstance", "Only for commercial equipment over 10 tons total capacity"],
    explanation_en: "NEC requires GFCI for receptacles and equipment in wet locations, outdoors, garages, basements, and other specified areas."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Cuál es el procedimiento correcto de lockout-tagout antes de trabajar en un equipo eléctrico?",
    options: ["Simplemente apagar el termostato y comenzar el trabajo inmediatamente", "Desconectar energía, bloquear el interruptor, verificar cero voltaje y etiquetar", "Usar guantes de goma y trabajar con el equipo energizado con cuidado", "Pedirle a otra persona que sostenga el interruptor mientras trabajas rápido"],
    correct: 1,
    explanation: "LOTO: desconectar en el interruptor/disconnect, colocar candado personal, verificar ausencia de voltaje con multímetro, y colocar etiqueta de seguridad."
  ,
    question_en: "What is the correct lockout-tagout procedure before working on electrical equipment?",
    options_en: ["Simply turn off the thermostat and begin work immediately", "Disconnect power, lock the switch, verify zero voltage, and tag", "Wear rubber gloves and work with the equipment energized carefully", "Ask another person to hold the switch while you work quickly"],
    explanation_en: "LOTO: disconnect at the switch/disconnect, place personal lock, verify absence of voltage with multimeter, and place safety tag."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Qué tipo de extintor se debe usar para un incendio eléctrico en un panel de control HVAC?",
    options: ["Extintor tipo A de agua presurizada para materiales combustibles sólidos", "Extintor tipo C o ABC de polvo químico seco para incendios eléctricos", "Extintor tipo B de espuma para líquidos inflamables y combustibles", "Extintor tipo K de químico húmedo diseñado para cocinas comerciales"],
    correct: 1,
    explanation: "Los incendios eléctricos son Clase C. Se usa extintor tipo C, BC, o ABC (polvo químico seco o CO2). NUNCA agua en incendios eléctricos."
  ,
    question_en: "What type of fire extinguisher should be used for an electrical fire in an HVAC control panel?",
    options_en: ["Type A water pressurized extinguisher for solid combustible materials", "Type C or ABC dry chemical powder extinguisher for electrical fires", "Type B foam extinguisher for flammable and combustible liquids", "Type K wet chemical extinguisher designed for commercial kitchens"],
    explanation_en: "Electrical fires are Class C. Use type C, BC, or ABC extinguisher (dry chemical powder or CO2). NEVER water on electrical fires."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Cuál es el propósito del cable de tierra (ground) en la instalación de equipo HVAC?",
    options: ["Proveer un camino de retorno para la corriente de operación normal", "Proveer un camino seguro para corriente de falla a tierra protegiendo personas", "Aumentar la eficiencia del motor reduciendo pérdidas de energía eléctrica", "Proteger el equipo contra daños por rayos durante tormentas eléctricas"],
    correct: 1,
    explanation: "El ground provee un camino de baja resistencia para corriente de falla. Esto dispara el breaker rápidamente, previniendo electrocución."
  ,
    question_en: "What is the purpose of the ground wire in HVAC equipment installation?",
    options_en: ["Provide a return path for normal operating current", "Provide a safe path for fault current to ground protecting people", "Increase motor efficiency by reducing electrical energy losses", "Protect equipment against lightning damage during electrical storms"],
    explanation_en: "The ground provides a low-resistance path for fault current. This trips the breaker quickly, preventing electrocution."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Cuál es la distancia mínima de separación para un disconnect de un equipo de condensación exterior?",
    options: ["El disconnect puede estar en cualquier ubicación sin restricciones de distancia", "Debe estar visible y a no más de 25 pies del equipo y a su vista directa", "Debe estar a mínimo 50 pies del equipo por seguridad contra arco eléctrico", "Solo se necesita disconnect si el equipo opera a más de 480 voltios"],
    correct: 1,
    explanation: "NEC requiere un disconnect a la vista del equipo y a no más de 25 pies (algunos códigos locales más restrictivos). Debe ser visible desde el equipo."
  ,
    question_en: "What is the minimum separation distance for a disconnect from outdoor condensing equipment?",
    options_en: ["The disconnect can be in any location without distance restrictions", "It must be visible and no more than 25 feet from the equipment within line of sight", "It must be at least 50 feet from the equipment for safety against electrical arc", "A disconnect is only needed if the equipment operates at more than 480 volts"],
    explanation_en: "NEC requires a disconnect within sight of the equipment and no more than 25 feet away (some local codes are stricter). It must be visible from the equipment."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Qué significa MCA y MOCP en la placa de datos de una unidad condensadora?",
    options: ["Maximum Current Allowed y Maximum Overcurrent Protection del equipo", "Minimum Circuit Ampacity y Maximum Overcurrent Protection para dimensionar cables", "Motor Current Amperage y Motor Overcurrent Protection del compresor solamente", "Main Circuit Amperage y Main Overcurrent Protection del panel eléctrico"],
    correct: 1,
    explanation: "MCA = tamaño mínimo del cable (ampacidad). MOCP = tamaño máximo del breaker/fusible. MCA dimensiona el cable, MOCP dimensiona la protección."
  ,
    question_en: "What do MCA and MOCP mean on a condensing unit data plate?",
    options_en: ["Maximum Current Allowed and Maximum Overcurrent Protection of the equipment", "Minimum Circuit Ampacity and Maximum Overcurrent Protection for sizing wires", "Motor Current Amperage and Motor Overcurrent Protection of the compressor only", "Main Circuit Amperage and Main Overcurrent Protection of the electrical panel"],
    explanation_en: "MCA = minimum wire size (ampacity). MOCP = maximum breaker/fuse size. MCA sizes the wire, MOCP sizes the protection."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Cuál es el riesgo principal de trabajar en circuitos eléctricos con las manos mojadas o húmedas?",
    options: ["Las manos mojadas hacen que las herramientas se resbalen fácilmente", "El agua reduce la resistencia de la piel permitiendo mayor flujo de corriente", "La humedad causa oxidación inmediata en las conexiones eléctricas del equipo", "No hay riesgo adicional si se usan guantes de algodón sobre las manos"],
    correct: 1,
    explanation: "La piel seca tiene ~100,000Ω de resistencia. Mojada baja a ~1,000Ω. Esto permite corriente peligrosa que puede causar fibrilación cardíaca."
  ,
    question_en: "What is the main risk of working on electrical circuits with wet or damp hands?",
    options_en: ["Wet hands cause tools to slip easily", "Water reduces skin resistance allowing greater current flow", "Moisture causes immediate oxidation on equipment electrical connections", "There is no additional risk if cotton gloves are worn over the hands"],
    explanation_en: "Dry skin has ~100,000 ohms resistance. Wet skin drops to ~1,000 ohms. This allows dangerous current that can cause cardiac fibrillation."
  },
  {
    category: "Seguridad Eléctrica",
    q: "¿Por qué se debe verificar el voltaje con un multímetro ANTES de tocar cualquier cable después del LOTO?",
    options: ["Para asegurarse de que el multímetro funciona correctamente y tiene batería", "Porque puede haber voltaje residual o el circuito incorrecto fue desconectado", "Para registrar el voltaje en el reporte de servicio como documentación oficial", "Para determinar si se necesita usar guantes de goma o no durante trabajo"],
    correct: 1,
    explanation: "Siempre verificar ausencia de voltaje después de LOTO. Puede haberse desconectado el circuito equivocado o existir alimentación de otra fuente."
  ,
    question_en: "Why must you verify voltage with a multimeter BEFORE touching any wire after LOTO?",
    options_en: ["To make sure the multimeter works correctly and has battery", "Because there may be residual voltage or the wrong circuit was disconnected", "To record the voltage in the service report as official documentation", "To determine whether rubber gloves need to be used during work"],
    explanation_en: "Always verify absence of voltage after LOTO. The wrong circuit may have been disconnected or there may be power from another source."
  },
  {
    category: "Controles",
    q: "¿Qué control previene la formación de hielo en el evaporador de un sistema de refrigeración?",
    options: ["El presostato de alta presión que limita la descarga del compresor", "El control de defrost por tiempo o temperatura que descongela periódicamente", "La válvula TXV que regula la cantidad de refrigerante al evaporador", "El relay de ventilador que aumenta velocidad cuando detecta hielo formado"],
    correct: 1,
    explanation: "El defrost control inicia ciclos de descongelamiento por tiempo (8-12 hrs) o al detectar hielo con sensor de temperatura, usando calor eléctrico o gas caliente."
  ,
    question_en: "What control prevents ice formation on the evaporator of a refrigeration system?",
    options_en: ["The high pressure switch that limits compressor discharge", "The defrost control by time or temperature that periodically defrosts", "The TXV valve that regulates the amount of refrigerant to the evaporator", "The fan relay that increases speed when ice formation is detected"],
    explanation_en: "The defrost control initiates defrost cycles by time (8-12 hrs) or when detecting ice with a temperature sensor, using electric heat or hot gas."
  },
  {
    category: "Controles",
    q: "¿Cuál es la función de una válvula check (de retención) en un sistema de bomba de calor?",
    options: ["Regular el flujo de refrigerante según la demanda de enfriamiento actual", "Permitir flujo en una sola dirección para bypass del dispositivo de medición", "Controlar la presión del aceite dentro del cárter del compresor hermético", "Filtrar contaminantes sólidos del refrigerante antes del compresor entrada"],
    correct: 1,
    explanation: "La check valve permite flujo en una dirección y bloquea en la otra. En heat pumps, bypasea un metering device cuando el flujo se invierte."
  ,
    question_en: "What is the function of a check valve in a heat pump system?",
    options_en: ["Regulate refrigerant flow based on current cooling demand", "Allow flow in one direction only to bypass the metering device", "Control oil pressure inside the hermetic compressor crankcase", "Filter solid contaminants from the refrigerant before the compressor inlet"],
    explanation_en: "The check valve allows flow in one direction and blocks it in the other. In heat pumps, it bypasses a metering device when flow reverses."
  },
  {
    category: "Controles",
    q: "¿Para qué sirve el timer de anti-short-cycle en un contactor de compresor?",
    options: ["Para acelerar el arranque del compresor reduciendo el tiempo de espera", "Para prevenir que el compresor arranque antes de que las presiones se equalicen", "Para mantener el compresor operando un tiempo mínimo en cada ciclo", "Para sincronizar el arranque del compresor con el ventilador condensador"],
    correct: 1,
    explanation: "El timer anti-short-cycle impone un retardo de ~5 minutos entre ciclos, dando tiempo a que las presiones se equalicen y previniendo daño al compresor."
  ,
    question_en: "What is the anti-short-cycle timer on a compressor contactor for?",
    options_en: ["To speed up compressor starting by reducing wait time", "To prevent the compressor from starting before pressures equalize", "To keep the compressor running for a minimum time each cycle", "To synchronize compressor startup with the condenser fan"],
    explanation_en: "The anti-short-cycle timer imposes a ~5 minute delay between cycles, allowing time for pressures to equalize and preventing compressor damage."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "Un condensador de 5 toneladas con compresor de 28 RLA opera con cable #10 AWG de cobre a 150 pies. ¿Cuál es el problema más probable?",
  options: ["El cable es adecuado para esa distancia y carga", "La caída de voltaje excede el 3% permitido", "El compresor operará con amperaje reducido", "La protección térmica se activará de inmediato"],
  correct: 1,
  explanation: "A 150 pies con cable #10 y 28 RLA en circuito de 240V, la caída de voltaje supera el 3% máximo recomendado por NEC, causando bajo voltaje en el equipo."
,
    question_en: "A 5-ton condenser with a 28 RLA compressor operates with #10 AWG copper wire at 150 feet. What is the most likely problem?",
    options_en: ["The wire is adequate for that distance and load", "The voltage drop exceeds the allowable 3%", "The compressor will operate with reduced amperage", "The thermal protection will activate immediately"],
    explanation_en: "At 150 feet with #10 wire and 28 RLA on a 240V circuit, the voltage drop exceeds the 3% maximum recommended by NEC, causing low voltage at the equipment."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "En un sistema split de 3 toneladas con alimentación de 208V, el compresor marca 19A en L1 y 22A en L2. ¿Qué indica esta lectura?",
  options: ["Operación normal dentro de tolerancia aceptable", "Desbalance de voltaje entre fases de alimentación", "El compresor tiene un devanado en corto parcial", "La válvula de servicio está parcialmente cerrada"],
  correct: 1,
  explanation: "Un desbalance de corriente mayor al 10% entre líneas generalmente indica desbalance de voltaje en la alimentación, no falla del compresor. El desbalance de corriente es aproximadamente 10x el desbalance de voltaje."
,
    question_en: "In a 3-ton split system with 208V power, the compressor reads 19A on L1 and 22A on L2. What does this reading indicate?",
    options_en: ["Normal operation within acceptable tolerance", "Voltage imbalance between power phases", "The compressor has a partial winding short", "The service valve is partially closed"],
    explanation_en: "A current imbalance greater than 10% between lines generally indicates voltage imbalance in the power supply, not compressor failure. Current imbalance is approximately 10x the voltage imbalance."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "¿Por qué un fusible de acción retardada (time-delay) se especifica para el circuito del compresor en lugar de uno estándar?",
  options: ["Porque el compresor consume menos corriente al arrancar", "Porque tolera el pico de LRA sin abrir el circuito", "Porque protege mejor contra cortocircuitos instantáneos", "Porque reduce el consumo energético durante operación"],
  correct: 1,
  explanation: "El LRA (Locked Rotor Amperage) del compresor puede ser 5-7 veces el RLA durante el arranque. Un fusible time-delay soporta este pico momentáneo sin fundirse, mientras protege contra sobrecargas sostenidas."
,
    question_en: "Why is a time-delay fuse specified for the compressor circuit instead of a standard one?",
    options_en: ["Because the compressor draws less current at startup", "Because it tolerates the LRA peak without opening the circuit", "Because it better protects against instantaneous short circuits", "Because it reduces energy consumption during operation"],
    explanation_en: "Compressor LRA (Locked Rotor Amperage) can be 5-7 times the RLA during startup. A time-delay fuse withstands this momentary peak without blowing, while protecting against sustained overloads."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "Un técnico mide 253V en la desconexión de un condensador que requiere 230V. ¿Cuál es la acción correcta?",
  options: ["Operar el equipo ya que está dentro del rango ±10%", "Reportar a la compañía eléctrica por sobrevoltaje", "Instalar un regulador de voltaje antes del equipo", "Reducir el tamaño del breaker para compensar voltaje"],
  correct: 0,
  explanation: "253V está dentro del rango de ±10% de 230V (207V-253V) que los fabricantes especifican como aceptable. El equipo puede operar normalmente dentro de este rango sin necesidad de acción correctiva."
,
    question_en: "A technician measures 253V at a condenser disconnect that requires 230V. What is the correct action?",
    options_en: ["Operate the equipment as it is within the +/-10% range", "Report to the power company for overvoltage", "Install a voltage regulator before the equipment", "Reduce the breaker size to compensate for voltage"],
    explanation_en: "253V is within the +/-10% range of 230V (207V-253V) that manufacturers specify as acceptable. The equipment can operate normally within this range without corrective action."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "En un circuito de 240V monofásico para un condensador, el breaker es de 40A. ¿Cuál es el MCA máximo del equipo que puede conectarse?",
  options: ["40 amperios según la capacidad del breaker", "32 amperios que es el 80% del breaker de 40A", "35 amperios según cálculo de carga continua", "36 amperios considerando factor de seguridad NEC"],
  correct: 1,
  explanation: "Para cargas continuas, NEC requiere que el breaker se dimensione al 125% del MCA, o inversamente, el MCA no debe exceder el 80% del breaker. 40A × 0.80 = 32A máximo MCA permitido."
,
    question_en: "In a 240V single-phase circuit for a condenser, the breaker is 40A. What is the maximum MCA of equipment that can be connected?",
    options_en: ["40 amps per the breaker capacity", "32 amps which is 80% of the 40A breaker", "35 amps per continuous load calculation", "36 amps considering the NEC safety factor"],
    explanation_en: "For continuous loads, NEC requires the breaker to be sized at 125% of MCA, or inversely, the MCA must not exceed 80% of the breaker. 40A x 0.80 = 32A maximum allowable MCA."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "¿Qué sucede cuando la resistencia de un cable alimentador aumenta debido a conexiones flojas o corrosión?",
  options: ["El voltaje en la carga aumenta proporcionalmente", "Se genera calor excesivo y caída de voltaje en el punto", "La corriente del circuito disminuye automáticamente", "El breaker detecta la falla y abre el circuito rápido"],
  correct: 1,
  explanation: "Una conexión floja o corroída aumenta la resistencia localizada. Por ley de Ohm, esto genera calor (P=I²R) y caída de voltaje en ese punto, reduciendo el voltaje disponible para el equipo."
,
    question_en: "What happens when the resistance of a feeder wire increases due to loose connections or corrosion?",
    options_en: ["The voltage at the load increases proportionally", "Excessive heat is generated and voltage drops at that point", "The circuit current decreases automatically", "The breaker detects the fault and opens the circuit quickly"],
    explanation_en: "A loose or corroded connection increases localized resistance. By Ohm's law, this generates heat (P=I2R) and voltage drop at that point, reducing available voltage for the equipment."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "Un condensador tiene MCA de 26.4A y MOCP de 40A. El técnico instala un breaker de 35A. ¿Es correcto?",
  options: ["No, debe usar exactamente el MOCP de 40 amperios", "Sí, cualquier breaker entre MCA y MOCP es válido", "No, debe usar un breaker de 30A como tamaño estándar", "Sí, siempre que el cable soporte los 35 amperios"],
  correct: 1,
  explanation: "El breaker debe ser igual o menor al MOCP (Maximum Overcurrent Protection) y mayor que el MCA. Un breaker de 35A está entre 26.4A (MCA) y 40A (MOCP), por lo tanto es una selección válida."
,
    question_en: "A condenser has MCA of 26.4A and MOCP of 40A. The technician installs a 35A breaker. Is this correct?",
    options_en: ["No, must use exactly the MOCP of 40 amps", "Yes, any breaker between MCA and MOCP is valid", "No, must use a 30A breaker as the standard size", "Yes, as long as the wire supports 35 amps"],
    explanation_en: "The breaker must be equal to or less than the MOCP (Maximum Overcurrent Protection) and greater than the MCA. A 35A breaker is between 26.4A (MCA) and 40A (MOCP), therefore it is a valid selection."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "¿Por qué la impedancia del cable tiene mayor efecto en circuitos de 208V que en circuitos de 240V para la misma carga?",
  options: ["Porque el cable de 208V tiene mayor resistencia interna", "Porque a menor voltaje se requiere más corriente para igual potencia", "Porque los circuitos de 208V usan cables de menor calibre", "Porque el factor de potencia es peor en sistemas de 208V"],
  correct: 1,
  explanation: "P=V×I, por lo tanto a menor voltaje (208V vs 240V) se necesita mayor corriente para la misma potencia. Mayor corriente causa mayor caída de voltaje (V=I×R) en el mismo cable, haciendo la impedancia más crítica."
,
    question_en: "Why does wire impedance have a greater effect in 208V circuits than in 240V circuits for the same load?",
    options_en: ["Because 208V wire has greater internal resistance", "Because at lower voltage more current is required for equal power", "Because 208V circuits use smaller gauge wires", "Because the power factor is worse in 208V systems"],
    explanation_en: "P=VxI, therefore at lower voltage (208V vs 240V) more current is needed for the same power. Higher current causes greater voltage drop (V=IxR) on the same wire, making impedance more critical."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "Un técnico encuentra que el voltaje entre L1 y tierra es 120V, pero entre L2 y tierra es 96V. ¿Qué significa?",
  options: ["La medición es normal para un sistema monofásico split", "Existe un problema con el neutro o tierra del panel", "El transformador de la compañía eléctrica está fallando", "El medidor del técnico tiene la batería descargada y lee mal"],
  correct: 1,
  explanation: "En un sistema monofásico 240V split-phase, L1-tierra y L2-tierra deben ser aproximadamente iguales (~120V cada uno). Una diferencia significativa indica problema con el conductor neutro, posiblemente abierto o con alta resistencia."
,
    question_en: "A technician finds that voltage between L1 and ground is 120V, but between L2 and ground is 96V. What does this mean?",
    options_en: ["The measurement is normal for a single-phase split system", "There is a problem with the panel neutral or ground", "The power company transformer is failing", "The technician's meter has a dead battery and reads incorrectly"],
    explanation_en: "In a single-phase 240V split-phase system, L1-to-ground and L2-to-ground should be approximately equal (~120V each). A significant difference indicates a problem with the neutral conductor, possibly open or with high resistance."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "¿Cuál es la consecuencia de operar un compresor monofásico de 230V con un voltaje de 195V sostenido?",
  options: ["El compresor operará con menor consumo y mayor eficiencia", "El amperaje aumenta y el devanado puede sobrecalentarse", "El compresor simplemente no arrancará por bajo voltaje", "La válvula de descarga interna se abrirá como protección"],
  correct: 1,
  explanation: "Con bajo voltaje, el compresor debe consumir más amperaje para mantener la misma potencia (P=V×I). Este exceso de corriente genera calor adicional en los devanados, pudiendo causar daño al aislamiento y falla prematura."
,
    question_en: "What is the consequence of operating a single-phase 230V compressor with a sustained 195V voltage?",
    options_en: ["The compressor will operate with less consumption and greater efficiency", "Amperage increases and the winding can overheat", "The compressor simply will not start due to low voltage", "The internal discharge valve will open as protection"],
    explanation_en: "With low voltage, the compressor must draw more amperage to maintain the same power (P=VxI). This excess current generates additional heat in the windings, potentially causing insulation damage and premature failure."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "Un circuito de 20A alimenta un manejadora con motor de ventilador de 8A y calefacción eléctrica de 10A. ¿Es adecuado el circuito?",
  options: ["Sí, la suma de 18A está dentro de los 20A del breaker", "No, la carga continua excede el 80% del circuito de 20A", "Sí, siempre que los componentes no operen simultáneamente", "No, se necesita un circuito dedicado para cada componente"],
  correct: 1,
  explanation: "Para cargas continuas (más de 3 horas), NEC requiere que no excedan el 80% del breaker. 18A es el 90% de 20A, excediendo el límite de 16A (80% de 20A). Se necesita mínimo un circuito de 25A."
,
    question_en: "A 20A circuit feeds an air handler with an 8A fan motor and 10A electric heating. Is the circuit adequate?",
    options_en: ["Yes, the sum of 18A is within the 20A breaker", "No, the continuous load exceeds 80% of the 20A circuit", "Yes, as long as the components do not operate simultaneously", "No, a dedicated circuit is needed for each component"],
    explanation_en: "For continuous loads (over 3 hours), NEC requires they not exceed 80% of the breaker. 18A is 90% of 20A, exceeding the 16A limit (80% of 20A). A minimum 25A circuit is needed."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "¿Por qué se requiere un conductor de puesta a tierra (ground) separado del neutro en el circuito de un condensador?",
  options: ["Para proporcionar un camino de retorno para la corriente operativa", "Para crear un camino de baja impedancia para corrientes de falla", "Para balancear el voltaje entre las dos líneas de alimentación", "Para reducir la interferencia electromagnética del compresor"],
  correct: 1,
  explanation: "El conductor de tierra proporciona un camino de baja impedancia exclusivo para corrientes de falla a tierra, permitiendo que el breaker o fusible opere rápidamente y proteja contra electrocución. No es para corriente operativa normal."
,
    question_en: "Why is a grounding conductor separate from the neutral required in a condenser circuit?",
    options_en: ["To provide a return path for normal operating current", "To create a low-impedance path for fault currents", "To balance the voltage between the two power lines", "To reduce electromagnetic interference from the compressor"],
    explanation_en: "The ground conductor provides a low-impedance path exclusively for ground fault currents, allowing the breaker or fuse to operate quickly and protect against electrocution. It is not for normal operating current."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "Un sistema mini-split inverter de 230V marca 6A en operación normal. Al medir el factor de potencia, lee 0.72. ¿Cuál es la potencia real consumida?",
  options: ["1,380 watts según el cálculo V × A estándar", "993.6 watts aplicando el factor de potencia a la aparente", "1,150 watts considerando pérdidas del inverter interno", "1,656 watts porque el factor corrige hacia arriba"],
  correct: 1,
  explanation: "Potencia real = V × I × FP = 230 × 6 × 0.72 = 993.6W. El factor de potencia reduce la potencia aparente (VA) a potencia real (W), ya que parte de la corriente no realiza trabajo útil debido al desfase."
,
    question_en: "A 230V inverter mini-split system draws 6A during normal operation. When measuring the power factor, it reads 0.72. What is the actual power consumed?",
    options_en: ["1,380 watts based on the standard V × A calculation","993.6 watts applying the power factor to the apparent power","1,150 watts considering internal inverter losses","1,656 watts because the power factor corrects upward"],
    explanation_en: "Real power = V × I × PF = 230 × 6 × 0.72 = 993.6W. The power factor reduces apparent power (VA) to real power (W), since part of the current does no useful work due to phase displacement."
  },
{
  category: "Electricidad Aplicada al AC",
  q: "¿Qué calibre de cable de cobre se requiere para un condensador con MCA de 31A a una distancia de 80 pies en circuito de 240V?",
  options: ["Cable #10 AWG que soporta hasta 30A según tabla NEC", "Cable #8 AWG considerando la distancia y caída de voltaje", "Cable #6 AWG para máxima protección contra sobrecalentamiento", "Cable #12 AWG ya que el MCA no supera los 35 amperios"],
  correct: 1,
  explanation: "Aunque #10 soporta 30A (insuficiente para 31A MCA), #8 AWG soporta 40A y a 80 pies mantiene la caída de voltaje dentro del 3% permitido. La distancia es factor crítico que muchos técnicos ignoran al dimensionar cable."
,
    question_en: "What gauge of copper wire is required for a condenser with an MCA of 31A at a distance of 80 feet on a 240V circuit?",
    options_en: ["#10 AWG wire rated for up to 30A per NEC table","#8 AWG wire considering distance and voltage drop","#6 AWG wire for maximum overheating protection","#12 AWG wire since the MCA does not exceed 35 amps"],
    explanation_en: "Although #10 handles 30A (insufficient for 31A MCA), #8 AWG handles 40A and at 80 feet keeps voltage drop within the allowed 3%. Distance is a critical factor many technicians overlook when sizing wire."
  },
{
  category: "Controles Eléctricos",
  q: "Un contactor de un condensador zumba fuertemente pero no cierra completamente. ¿Cuál es la causa más probable?",
  options: ["El voltaje de la bobina del contactor es demasiado alto", "La bobina está debilitada o tiene espiras en corto parcial", "Los contactos principales están soldados en posición abierta", "El capacitor de marcha está enviando voltaje a la bobina"],
  correct: 1,
  explanation: "Un contactor que zumba sin cerrar completamente indica que la bobina no genera suficiente fuerza magnética. Esto ocurre cuando la bobina tiene espiras en corto, reduciendo su inductancia y fuerza de atracción del núcleo."
,
    question_en: "A condenser contactor buzzes loudly but does not close completely. What is the most likely cause?",
    options_en: ["The contactor coil voltage is too high","The coil is weakened or has partial shorted turns","The main contacts are welded in the open position","The run capacitor is sending voltage to the coil"],
    explanation_en: "A contactor that buzzes without fully closing indicates the coil is not generating enough magnetic force. This occurs when the coil has shorted turns, reducing its inductance and armature attraction force."
  },
{
  category: "Controles Eléctricos",
  q: "¿Qué función cumple el resistor de crank case heater cuando el compresor está apagado en clima frío?",
  options: ["Precalienta el refrigerante para facilitar el arranque inicial", "Mantiene el aceite caliente para evitar migración de refrigerante", "Protege los devanados del compresor contra la humedad ambiental", "Calienta los contactos del contactor para prevenir congelamiento"],
  correct: 1,
  explanation: "El calentador de cárter mantiene el aceite del compresor a temperatura superior al ambiente, evitando que el refrigerante líquido migre y se disuelva en el aceite. Sin él, al arrancar puede ocurrir espumeo y falta de lubricación."
,
    question_en: "What function does the crankcase heater resistor serve when the compressor is off in cold weather?",
    options_en: ["Preheats the refrigerant to facilitate initial startup","Keeps the oil warm to prevent refrigerant migration","Protects compressor windings against ambient moisture","Heats the contactor contacts to prevent freezing"],
    explanation_en: "The crankcase heater keeps compressor oil above ambient temperature, preventing liquid refrigerant from migrating and dissolving into the oil. Without it, foaming and lubrication failure can occur at startup."
  },
{
  category: "Controles Eléctricos",
  q: "Un relé de tiempo retarda el arranque del compresor 5 minutos después de cada ciclo. ¿Qué protege específicamente?",
  options: ["Evita el desgaste prematuro de los contactos del contactor", "Permite la ecualización de presiones antes del rearranque", "Protege el motor del ventilador contra sobrecarga de corriente", "Reduce el consumo eléctrico durante las horas pico de demanda"],
  correct: 1,
  explanation: "El delay-on-make permite que las presiones alta y baja se ecualicen antes del rearranque. Sin ecualización, el compresor arranca contra alta presión diferencial, causando LRA prolongado, sobrecalentamiento y posible daño mecánico."
,
    question_en: "A time-delay relay delays compressor startup for 5 minutes after each cycle. What does it specifically protect?",
    options_en: ["Prevents premature wear of contactor contacts","Allows pressure equalization before restart","Protects the fan motor against current overload","Reduces electrical consumption during peak demand hours"],
    explanation_en: "The delay-on-make allows high and low pressures to equalize before restart. Without equalization, the compressor starts against high differential pressure, causing prolonged LRA, overheating, and possible mechanical damage."
  },
{
  category: "Controles Eléctricos",
  q: "En una tarjeta de control (board) de un sistema, el fusible de 3A en la sección de bajo voltaje se funde repetidamente. ¿Qué se debe verificar primero?",
  options: ["El transformador de 24V por posible salida de voltaje alto", "Un cortocircuito en el cableado del termostato o sus cables", "La bobina del contactor por consumo excesivo de amperaje", "El capacitor de marcha por fuga de corriente a la tarjeta"],
  correct: 1,
  explanation: "Un fusible de bajo voltaje que se funde repetidamente indica cortocircuito en el circuito de 24V. La causa más común es un cable pelado del termostato haciendo contacto con tierra o entre sí, creando un corto en el circuito de control."
,
    question_en: "On a system control board, the 3A fuse in the low-voltage section blows repeatedly. What should be checked first?",
    options_en: ["The 24V transformer for possible high voltage output","A short circuit in the thermostat wiring or its cables","The contactor coil for excessive amperage draw","The run capacitor for current leakage to the board"],
    explanation_en: "A low-voltage fuse that blows repeatedly indicates a short circuit in the 24V circuit. The most common cause is a stripped thermostat wire making contact with ground or with another wire, creating a short in the control circuit."
  },
{
  category: "Controles Eléctricos",
  q: "¿Por qué un interruptor de seguridad de alta presión con reset manual es preferido sobre uno de reset automático en equipos comerciales?",
  options: ["Porque es más económico y fácil de conseguir en el mercado", "Porque obliga al técnico a diagnosticar la causa antes de rearrancar", "Porque soporta presiones más altas que los de reset automático", "Porque consume menos energía al no tener circuito de monitoreo"],
  correct: 1,
  explanation: "El reset manual requiere intervención de un técnico, quien debe investigar la causa de la alta presión antes de rearrancar. Un reset automático podría permitir ciclos repetidos de alta presión, dañando el compresor sin que nadie lo note."
,
    question_en: "Why is a manual-reset high-pressure safety switch preferred over an auto-reset one in commercial equipment?",
    options_en: ["Because it is more economical and easier to find on the market","Because it forces the technician to diagnose the cause before restarting","Because it withstands higher pressures than auto-reset switches","Because it consumes less energy by not having a monitoring circuit"],
    explanation_en: "Manual reset requires technician intervention, who must investigate the cause of high pressure before restarting. An auto-reset could allow repeated high-pressure cycles, damaging the compressor without anyone noticing."
  },
{
  category: "Controles Eléctricos",
  q: "Un secuenciador eléctrico en una manejadora con calefacción eléctrica activa las resistencias en etapas. ¿Cuál es la razón principal?",
  options: ["Para distribuir el calor uniformemente por todo el plenum", "Para limitar la demanda de corriente instantánea al encender", "Para prolongar la vida útil de cada elemento calefactor", "Para permitir control de temperatura más preciso al usuario"],
  correct: 1,
  explanation: "Si todas las resistencias se activaran simultáneamente, la demanda de corriente sería excesiva, pudiendo disparar breakers o sobrecargar el panel. El secuenciador escalona la activación para limitar el pico de corriente inicial."
,
    question_en: "An electric sequencer in an air handler with electric heat activates the heating elements in stages. What is the main reason?",
    options_en: ["To distribute heat evenly throughout the plenum","To limit instantaneous current demand when turning on","To extend the lifespan of each heating element","To allow the user more precise temperature control"],
    explanation_en: "If all heating elements activated simultaneously, current demand would be excessive, potentially tripping breakers or overloading the panel. The sequencer staggers activation to limit the initial current peak."
  },
{
  category: "Controles Eléctricos",
  q: "Un contactor de 2 polos muestra 240V en la línea pero solo 120V en la carga con el contactor energizado. ¿Qué ocurre?",
  options: ["El contactor está funcionando correctamente a medio ciclo", "Uno de los dos polos del contactor no está cerrando contacto", "El voltaje de la bobina es insuficiente para operación completa", "La carga tiene un devanado abierto que altera la lectura"],
  correct: 1,
  explanation: "Con 240V en línea pero solo 120V en carga, un polo del contactor no cierra. Esto permite que solo una fase pase, midiendo 120V entre carga y neutro. El compresor recibe alimentación monofásica incompleta y no operará correctamente."
,
    question_en: "A 2-pole contactor shows 240V on the line side but only 120V on the load side with the contactor energized. What is happening?",
    options_en: ["The contactor is functioning correctly at half cycle","One of the two contactor poles is not making contact","The coil voltage is insufficient for complete operation","The load has an open winding that alters the reading"],
    explanation_en: "With 240V on line but only 120V on load, one contactor pole is not closing. This allows only one phase through, reading 120V between load and neutral. The compressor receives incomplete single-phase power and will not operate correctly."
  },
{
  category: "Controles Eléctricos",
  q: "¿Qué indica una lectura de 27V AC en la salida del transformador de 24V de un sistema de calefacción y aire acondicionado?",
  options: ["El transformador tiene un tap incorrecto seleccionado en primario", "Es una lectura normal ya que los transformadores dan voltaje sin carga algo mayor", "El transformador tiene espiras en corto en el devanado secundario", "El capacitor del sistema está retroalimentando voltaje al transformador"],
  correct: 1,
  explanation: "Los transformadores de control entregan voltaje ligeramente superior sin carga (open circuit voltage). 27V sin carga es normal para un transformador de 24V; bajo carga el voltaje baja a aproximadamente 24V por la impedancia interna."
,
    question_en: "What does a 27V AC reading at the output of a 24V transformer in an HVAC system indicate?",
    options_en: ["The transformer has an incorrect tap selected on the primary","It is a normal reading since transformers deliver slightly higher no-load voltage","The transformer has shorted turns in the secondary winding","The system capacitor is feeding voltage back to the transformer"],
    explanation_en: "Control transformers deliver slightly higher voltage at no load (open circuit voltage). 27V unloaded is normal for a 24V transformer; under load, the voltage drops to approximately 24V due to internal impedance."
  },
{
  category: "Controles Eléctricos",
  q: "Un sensor de presión electrónico envía señal de 0-5V DC a la tarjeta de control. Si la señal marca 0V constante, ¿qué diagnóstico aplica?",
  options: ["El sensor indica que la presión del sistema está en cero absoluto", "El sensor está desconectado, en corto a tierra, o sin alimentación", "La tarjeta de control no está procesando la señal del sensor", "El refrigerante se agotó completamente y la presión es atmosférica"],
  correct: 1,
  explanation: "Una señal de 0V constante indica falla del sensor o del circuito: cable roto, corto a tierra, o falta de alimentación al sensor. Un sistema sin refrigerante aún mostraría presión atmosférica, no 0V de señal."
,
    question_en: "An electronic pressure sensor sends a 0-5V DC signal to the control board. If the signal reads a constant 0V, what diagnosis applies?",
    options_en: ["The sensor indicates system pressure is at absolute zero","The sensor is disconnected, shorted to ground, or has no power supply","The control board is not processing the sensor signal","The refrigerant is completely depleted and pressure is atmospheric"],
    explanation_en: "A constant 0V signal indicates sensor or circuit failure: broken wire, short to ground, or no power to the sensor. A system without refrigerant would still show atmospheric pressure, not a 0V signal."
  },
{
  category: "Controles Eléctricos",
  q: "¿Por qué la bobina de un contactor de 24V AC no debe alimentarse con 24V DC aunque el voltaje sea igual?",
  options: ["Porque el contactor se calentará y puede quemarse la bobina", "Porque el DC no produce vibración y los contactos se soldarán", "Porque la polaridad del DC puede dañar los contactos principales", "Porque el contactor no cerrará ya que necesita corriente alterna"],
  correct: 0,
  explanation: "Una bobina AC tiene impedancia (resistencia + reactancia inductiva) que limita la corriente. Con DC solo actúa la resistencia óhmica, que es mucho menor, permitiendo corriente excesiva que sobrecalienta y quema la bobina."
,
    question_en: "Why should a 24V AC contactor coil not be powered with 24V DC even though the voltage is the same?",
    options_en: ["Because the contactor will overheat and the coil may burn out","Because DC does not produce vibration and the contacts will weld","Because DC polarity can damage the main contacts","Because the contactor will not close since it needs alternating current"],
    explanation_en: "An AC coil has impedance (resistance + inductive reactance) that limits current. With DC, only the ohmic resistance acts, which is much lower, allowing excessive current that overheats and burns the coil."
  },
{
  category: "Controles Eléctricos",
  q: "En un sistema con economizador, el interruptor de entalpía compara la energía del aire exterior con el aire de retorno. ¿Cuándo abre las compuertas?",
  options: ["Cuando la entalpía exterior es mayor que la del aire de retorno", "Cuando la entalpía exterior es menor que la del aire de retorno", "Cuando la temperatura exterior iguala al setpoint del termostato", "Cuando la humedad relativa exterior baja del 50 por ciento"],
  correct: 1,
  explanation: "El economizador abre las compuertas de aire exterior cuando su entalpía (calor total = sensible + latente) es menor que la del retorno, aprovechando aire exterior con menos energía térmica para enfriar gratis, reduciendo uso del compresor."
,
    question_en: "In a system with an economizer, the enthalpy switch compares outdoor air energy with return air. When does it open the dampers?",
    options_en: ["When outdoor enthalpy is greater than return air enthalpy","When outdoor enthalpy is less than return air enthalpy","When outdoor temperature equals the thermostat setpoint","When outdoor relative humidity drops below 50 percent"],
    explanation_en: "The economizer opens outdoor air dampers when their enthalpy (total heat = sensible + latent) is less than return air, using outdoor air with less thermal energy for free cooling, reducing compressor use."
  },
{
  category: "Controles Eléctricos",
  q: "Un sistema dual fuel (bomba de calor + gas) tiene un punto de balance de 35°F. ¿Qué significa operativamente?",
  options: ["A 35°F el gas y la bomba de calor operan simultáneamente", "Debajo de 35°F el gas es más eficiente que la bomba de calor", "Sobre 35°F el sistema solo puede operar en modo enfriamiento", "A 35°F la bomba de calor alcanza su capacidad máxima de BTU"],
  correct: 1,
  explanation: "El punto de balance es donde la bomba de calor pierde eficiencia y el gas es más económico. Debajo de 35°F, el COP de la bomba baja significativamente, haciendo el gas natural más eficiente y económico para calefacción."
,
    question_en: "A dual fuel system (heat pump + gas) has a balance point of 35°F. What does this mean operationally?",
    options_en: ["At 35°F the gas and heat pump operate simultaneously","Below 35°F gas is more efficient than the heat pump","Above 35°F the system can only operate in cooling mode","At 35°F the heat pump reaches its maximum BTU capacity"],
    explanation_en: "The balance point is where the heat pump loses efficiency and gas becomes more economical. Below 35°F, the heat pump COP drops significantly, making natural gas more efficient and economical for heating."
  },
{
  category: "Controles Eléctricos",
  q: "Un técnico puentea R y G en el termostato y el ventilador arranca. Luego puentea R y Y pero el compresor no arranca. ¿Qué descarta esta prueba?",
  options: ["Descarta falla en el contactor del compresor y su bobina", "Descarta falla en el termostato y confirma problema aguas abajo", "Descarta falla en el transformador y el circuito de control 24V", "Descarta falla en el cableado entre termostato y la manejadora"],
  correct: 1,
  explanation: "Si G funciona, el termostato, cables R-C-G y transformador están bien. Si Y no activa el compresor, el problema está aguas abajo: cable Y dañado, bobina del contactor, o protección del compresor abierta. El termostato queda descartado."
,
    question_en: "A technician jumpers R and G at the thermostat and the fan starts. Then jumpers R and Y but the compressor does not start. What does this test rule out?",
    options_en: ["Rules out failure in the compressor contactor and its coil","Rules out thermostat failure and confirms a downstream problem","Rules out transformer and 24V control circuit failure","Rules out wiring failure between thermostat and air handler"],
    explanation_en: "If G works, the thermostat, R-C-G wires, and transformer are fine. If Y does not activate the compressor, the problem is downstream: damaged Y wire, contactor coil, or open compressor protection. The thermostat is ruled out."
  },
{
  category: "Motores Eléctricos",
  q: "Un motor PSC de ventilador del condensador gira lentamente y consume más amperaje del nominal. ¿Cuál es la causa más probable?",
  options: ["El capacitor de marcha tiene capacitancia superior a la especificada", "El devanado auxiliar del motor tiene espiras en corto parcial", "El voltaje de alimentación es ligeramente superior al nominal", "El aspa del ventilador está desbalanceada causando vibración excesiva"],
  correct: 1,
  explanation: "Espiras en corto en el devanado reducen la impedancia del motor, aumentando la corriente y reduciendo el torque y RPM. El motor gira lento y caliente. Es la causa más común de falla gradual en motores PSC de condensador."
,
    question_en: "A PSC condenser fan motor runs slowly and draws more than rated amperage. What is the most likely cause?",
    options_en: ["The run capacitor has higher capacitance than specified","The motor auxiliary winding has partial shorted turns","The supply voltage is slightly above nominal","The fan blade is unbalanced causing excessive vibration"],
    explanation_en: "Shorted turns in the winding reduce the motor impedance, increasing current and reducing torque and RPM. The motor runs slow and hot. This is the most common cause of gradual failure in PSC condenser motors."
  },
{
  category: "Motores Eléctricos",
  q: "¿Cuál es la diferencia fundamental entre un motor ECM y un motor PSC en términos de eficiencia energética?",
  options: ["El ECM usa corriente alterna trifásica para mayor potencia de salida", "El ECM convierte AC a DC internamente y modula velocidad electrónicamente", "El ECM tiene más devanados que el PSC para distribuir mejor la carga", "El ECM utiliza imanes temporales que se ajustan según la velocidad"],
  correct: 1,
  explanation: "El motor ECM (Electronically Commutated Motor) rectifica AC a DC y usa un controlador electrónico para conmutar los devanados, variando la velocidad con alta eficiencia (80%+). El PSC pierde energía como calor en resistencias de velocidad."
,
    question_en: "What is the fundamental difference between an ECM motor and a PSC motor in terms of energy efficiency?",
    options_en: ["The ECM uses three-phase AC for greater power output","The ECM converts AC to DC internally and modulates speed electronically","The ECM has more windings than the PSC to better distribute the load","The ECM uses temporary magnets that adjust according to speed"],
    explanation_en: "The ECM (Electronically Commutated Motor) rectifies AC to DC and uses an electronic controller to commutate the windings, varying speed with high efficiency (80%+). The PSC wastes energy as heat in speed resistances."
  },
{
  category: "Motores Eléctricos",
  q: "Un motor de arranque por capacitor tiene un capacitor de arranque y un relé centrífugo. Si el relé no abre al alcanzar velocidad, ¿qué ocurre?",
  options: ["El motor operará a velocidad reducida permanentemente", "El capacitor de arranque se sobrecalentará y puede explotar", "El motor se detendrá inmediatamente por sobrecarga protectiva", "El motor invertirá su dirección de rotación automáticamente"],
  correct: 1,
  explanation: "El capacitor de arranque está diseñado solo para uso momentáneo (3-5 segundos). Si el relé centrífugo no lo desconecta, la corriente continua lo sobrecalienta rápidamente, causando hinchamiento, fuga de electrolito o explosión."
,
    question_en: "A capacitor-start motor has a start capacitor and a centrifugal relay. If the relay does not open when speed is reached, what happens?",
    options_en: ["The motor will run at permanently reduced speed","The start capacitor will overheat and may explode","The motor will stop immediately due to overload protection","The motor will automatically reverse its rotation direction"],
    explanation_en: "The start capacitor is designed for momentary use only (3-5 seconds). If the centrifugal relay does not disconnect it, continuous current overheats it rapidly, causing swelling, electrolyte leakage, or explosion."
  },
{
  category: "Motores Eléctricos",
  q: "Al medir la resistencia de un motor monofásico, entre C y S lee 5Ω, entre C y R lee 3Ω. ¿Qué lectura espera entre S y R?",
  options: ["8 ohmios ya que los devanados están conectados en serie", "2 ohmios por la diferencia entre ambos devanados medidos", "15 ohmios por la multiplicación de las dos resistencias", "Depende del fabricante y no se puede calcular sin datos"],
  correct: 0,
  explanation: "En un motor monofásico, R(S-R) = R(C-S) + R(C-R) porque al medir entre S y R se miden ambos devanados en serie a través de C. Por lo tanto 5Ω + 3Ω = 8Ω entre los terminales de arranque y marcha."
,
    question_en: "When measuring the resistance of a single-phase motor, C to S reads 5 ohms, C to R reads 3 ohms. What reading do you expect between S and R?",
    options_en: ["8 ohms since the windings are connected in series","2 ohms from the difference between both measured windings","15 ohms from multiplying the two resistances","It depends on the manufacturer and cannot be calculated without data"],
    explanation_en: "In a single-phase motor, R(S-R) = R(C-S) + R(C-R) because measuring between S and R measures both windings in series through C. Therefore 5 ohms + 3 ohms = 8 ohms between start and run terminals."
  },
{
  category: "Motores Eléctricos",
  q: "Un motor de ventilador evaporador de 1/3 HP, 1075 RPM, 208-230V necesita reemplazo. ¿Por qué NO se debe sustituir con uno de 1725 RPM?",
  options: ["Porque el motor de 1725 RPM consume demasiada corriente para el circuito", "Porque la velocidad excesiva genera flujo de aire y presión estática incorrectos", "Porque los motores de 1725 RPM solo funcionan en 460V trifásico", "Porque el diámetro del eje es diferente en motores de mayor velocidad"],
  correct: 1,
  explanation: "Un motor de 1725 RPM moverá excesivo volumen de aire, alterando la presión estática del sistema. Esto causa flujo turbulento, ruido, evaporador congelado por exceso de aire, y puede sobrecargar el motor al operar fuera de su curva."
,
    question_en: "A 1/3 HP, 1075 RPM, 208-230V evaporator fan motor needs replacement. Why should it NOT be replaced with a 1725 RPM motor?",
    options_en: ["Because the 1725 RPM motor draws too much current for the circuit","Because excessive speed generates incorrect airflow and static pressure","Because 1725 RPM motors only work on 460V three-phase","Because the shaft diameter is different in higher speed motors"],
    explanation_en: "A 1725 RPM motor will move excessive air volume, altering system static pressure. This causes turbulent flow, noise, frozen evaporator from excess air, and can overload the motor operating outside its curve."
  },
{
  category: "Motores Eléctricos",
  q: "¿Qué indica una lectura de resistencia de 0.5 megaohmios entre el devanado y la carcasa de un motor de compresor hermético?",
  options: ["El aislamiento del motor está en excelentes condiciones operativas", "El aislamiento está degradado y el compresor debe reemplazarse pronto", "El motor tiene un cortocircuito franco que requiere reemplazo inmediato", "La lectura es irrelevante sin conocer la temperatura del compresor"],
  correct: 1,
  explanation: "El estándar mínimo para aislamiento de motor hermético es generalmente 1 megaohmio o más. Una lectura de 0.5 MΩ indica degradación del aislamiento. Aunque puede seguir operando, el compresor está en riesgo de falla a tierra inminente."
,
    question_en: "What does a resistance reading of 0.5 megohms between the winding and the casing of a hermetic compressor motor indicate?",
    options_en: ["The motor insulation is in excellent operating condition","The insulation is degraded and the compressor should be replaced soon","The motor has a dead short requiring immediate replacement","The reading is irrelevant without knowing the compressor temperature"],
    explanation_en: "The minimum standard for hermetic motor insulation is generally 1 megohm or more. A reading of 0.5 megohms indicates insulation degradation. Although it may continue operating, the compressor is at risk of imminent ground fault failure."
  },
{
  category: "Motores Eléctricos",
  q: "Un motor ECM no arranca pero su módulo electrónico recibe 240V y la señal de control de 24V. ¿Cuál es el paso de diagnóstico más apropiado?",
  options: ["Reemplazar el motor ECM completo incluyendo el módulo de control", "Verificar la señal PWM o de comunicación entre tarjeta y módulo ECM", "Medir la resistencia del devanado del estator para detectar corto", "Verificar que el capacitor de arranque del motor ECM esté bueno"],
  correct: 1,
  explanation: "Los motores ECM reciben señales de control específicas (PWM, 0-10V DC, o comunicación serial) desde la tarjeta de control. Si tiene alimentación pero no arranca, la señal de velocidad/comunicación es el siguiente punto de diagnóstico. Los ECM no usan capacitor."
,
    question_en: "An ECM motor does not start but its electronic module receives 240V and the 24V control signal. What is the most appropriate diagnostic step?",
    options_en: ["Replace the complete ECM motor including the control module","Verify the PWM or communication signal between the board and ECM module","Measure stator winding resistance to detect a short","Verify that the ECM motor start capacitor is good"],
    explanation_en: "ECM motors receive specific control signals (PWM, 0-10V DC, or serial communication) from the control board. If it has power but does not start, the speed/communication signal is the next diagnostic point. ECMs do not use capacitors."
  },
{
  category: "Motores Eléctricos",
  q: "¿Por qué un motor PSC de múltiples velocidades pierde torque significativamente cuando se opera en velocidad baja?",
  options: ["Porque el voltaje aplicado al motor se reduce en velocidad baja", "Porque se añade impedancia al devanado, reduciendo corriente y campo magnético", "Porque el capacitor de marcha no está diseñado para velocidad baja", "Porque el rotor tiene mayor deslizamiento a velocidades más bajas"],
  correct: 1,
  explanation: "En motores PSC multi-velocidad, las velocidades bajas se logran añadiendo secciones de devanado (impedancia) en serie. Esto reduce la corriente y por tanto el campo magnético, resultando en menor torque disponible en velocidades bajas."
,
    question_en: "Why does a multi-speed PSC motor lose significant torque when operated at low speed?",
    options_en: ["Because voltage applied to the motor is reduced at low speed","Because impedance is added to the winding, reducing current and magnetic field","Because the run capacitor is not designed for low speed","Because the rotor has greater slip at lower speeds"],
    explanation_en: "In multi-speed PSC motors, low speeds are achieved by adding winding sections (impedance) in series. This reduces current and therefore the magnetic field, resulting in less available torque at low speeds."
  },
{
  category: "Motores Eléctricos",
  q: "Un compresor hermético monofásico tiene los terminales C, S y R. Si se mide continuidad entre S y la carcasa, ¿qué indica?",
  options: ["Es normal porque el devanado S está conectado internamente a tierra", "El devanado de arranque tiene falla a tierra y el compresor debe reemplazarse", "Indica que el compresor tiene protección térmica interna cerrada", "El técnico tiene las puntas del multímetro conectadas incorrectamente"],
  correct: 1,
  explanation: "Cualquier continuidad entre un terminal del devanado y la carcasa indica falla de aislamiento a tierra (grounded winding). El compresor hermético no puede repararse en campo y debe reemplazarse. Esta falla puede disparar el breaker."
,
    question_en: "A single-phase hermetic compressor has terminals C, S, and R. If continuity is measured between S and the casing, what does it indicate?",
    options_en: ["It is normal because the S winding is internally connected to ground","The start winding has a ground fault and the compressor must be replaced","It indicates the compressor has its internal thermal protection closed","The technician has the multimeter leads connected incorrectly"],
    explanation_en: "Any continuity between a winding terminal and the casing indicates insulation-to-ground failure (grounded winding). A hermetic compressor cannot be field-repaired and must be replaced. This fault can trip the breaker."
  },
{
  category: "Motores Eléctricos",
  q: "En un motor de ventilador con capacitor permanente (PSC), ¿qué efecto tiene instalar un capacitor de menor microfaradios que el especificado?",
  options: ["El motor girará más rápido por menor carga en el devanado auxiliar", "El motor tendrá menor torque de arranque y puede no iniciar consistentemente", "El motor operará con mayor eficiencia al consumir menos corriente total", "El motor invertirá la dirección de rotación por cambio de fase"],
  correct: 1,
  explanation: "Un capacitor de menor valor proporciona menos desfase de corriente al devanado auxiliar, reduciendo el campo magnético rotativo. Esto disminuye el torque de arranque y operación, pudiendo causar arranques fallidos o sobrecalentamiento."
,
    question_en: "In a PSC fan motor with a permanent capacitor, what effect does installing a capacitor with lower microfarads than specified have?",
    options_en: ["The motor will spin faster due to less load on the auxiliary winding","The motor will have less starting torque and may not start consistently","The motor will operate more efficiently by consuming less total current","The motor will reverse its rotation direction due to phase change"],
    explanation_en: "A lower-value capacitor provides less current phase shift to the auxiliary winding, reducing the rotating magnetic field. This decreases starting and running torque, potentially causing failed starts or overheating."
  },
{
  category: "Motores Eléctricos",
  q: "¿Por qué el amperaje de un motor de ventilador de condensador aumenta significativamente en un día extremadamente caluroso?",
  options: ["Porque el motor se expande térmicamente y aumenta la fricción interna", "Porque el aire caliente es menos denso, reduciendo carga pero aumentando deslizamiento", "Porque el aire caliente es más denso, requiriendo más energía para mover el mismo volumen", "Porque la resistencia del devanado disminuye con el calor permitiendo más corriente"],
  correct: 3,
  explanation: "Con temperatura elevada, la resistencia del cobre del devanado disminuye ligeramente, pero más importante, el motor trabaja más caliente, degradando el aislamiento y reduciendo impedancia. Sin embargo, el aire caliente es MENOS denso. El factor dominante es la resistencia del cobre que baja con temperatura, permitiendo más corriente."
,
    question_en: "Why does a condenser fan motor's amperage increase significantly on an extremely hot day?",
    options_en: ["Because the motor thermally expands increasing internal friction","Because hot air is less dense, reducing load but increasing slip","Because hot air is denser, requiring more energy to move the same volume","Because winding resistance decreases with heat allowing more current"],
    explanation_en: "At elevated temperatures, copper winding resistance decreases slightly, but more importantly, the motor runs hotter, degrading insulation and reducing impedance. Hot air is actually LESS dense. The dominant factor is copper resistance dropping with temperature, allowing more current."
  },
{
  category: "Motores Eléctricos",
  q: "Un motor de ventilador evaporador zumba pero no gira. Al girarlo manualmente arranca y opera normal. ¿Cuál es la falla?",
  options: ["El devanado principal del motor está parcialmente abierto por sobrecalentamiento", "El capacitor de marcha está débil o el devanado de arranque tiene alta resistencia", "Los rodamientos del motor están trabados y necesitan lubricación urgente", "El voltaje de alimentación es insuficiente para vencer la inercia inicial"],
  correct: 1,
  explanation: "Si el motor zumba (tiene energía) pero no arranca solo, y funciona al girarlo manualmente, el circuito de arranque es deficiente: capacitor débil (bajo µF) o devanado de arranque con alta resistencia. El motor no genera suficiente torque de arranque."
,
    question_en: "An evaporator fan motor hums but does not spin. When turned manually it starts and runs normally. What is the fault?",
    options_en: ["The main winding is partially open due to overheating","The run capacitor is weak or the start winding has high resistance","The motor bearings are seized and need urgent lubrication","The supply voltage is insufficient to overcome initial inertia"],
    explanation_en: "If the motor hums (has power) but will not start on its own, and works when spun manually, the start circuit is deficient: weak capacitor (low microfarads) or start winding with high resistance. The motor cannot generate enough starting torque."
  },
{
  category: "Motores Eléctricos",
  q: "¿Cuál es la ventaja principal de un motor de reluctancia variable sobre un motor PSC en aplicaciones de HVAC modernas?",
  options: ["Puede operar directamente con corriente continua sin controlador", "Ofrece control de velocidad preciso sin necesidad de capacitores externos", "Es significativamente más económico que cualquier motor PSC equivalente", "Tiene mayor torque de arranque sin requerir devanado auxiliar ni capacitor"],
  correct: 1,
  explanation: "Los motores de reluctancia variable (SRM) no requieren capacitores ni imanes permanentes. Su velocidad se controla electrónicamente con gran precisión, haciéndolos ideales para aplicaciones de velocidad variable en HVAC con alta eficiencia y bajo mantenimiento."
,
    question_en: "What is the main advantage of a variable reluctance motor over a PSC motor in modern HVAC applications?",
    options_en: ["It can operate directly on DC power without a controller","It offers precise speed control without the need for external capacitors","It is significantly more economical than any equivalent PSC motor","It has greater starting torque without requiring an auxiliary winding or capacitor"],
    explanation_en: "Variable reluctance motors (SRM) require no capacitors or permanent magnets. Their speed is controlled electronically with great precision, making them ideal for variable-speed HVAC applications with high efficiency and low maintenance."
  },
{
  category: "Motores Eléctricos",
  q: "Al reemplazar un motor de ventilador condensador, el técnico nota que el nuevo motor gira al revés. ¿Cómo se corrige en un motor PSC?",
  options: ["Se invierten las conexiones de alimentación L1 y L2 del motor", "Se invierten las conexiones del capacitor entre devanados de arranque", "Se intercambian los cables rojo y negro del devanado principal solamente", "Se cambia la posición del soporte del motor a 180 grados de rotación"],
  correct: 1,
  explanation: "En un motor PSC, la dirección de rotación se determina por la relación de fase entre el devanado principal y el auxiliar (capacitor). Invertir las conexiones del capacitor (o el devanado auxiliar) cambia el desfase y revierte la rotación."
,
    question_en: "When replacing a condenser fan motor, the technician notices the new motor spins in reverse. How is this corrected in a PSC motor?",
    options_en: ["Reverse the L1 and L2 power connections to the motor","Reverse the capacitor connections between start windings","Swap only the red and black main winding wires","Change the motor mount position by 180 degrees of rotation"],
    explanation_en: "In a PSC motor, rotation direction is determined by the phase relationship between the main and auxiliary (capacitor) windings. Reversing the capacitor connections (or the auxiliary winding) changes the phase shift and reverses rotation."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Por qué el núcleo de un transformador se construye con láminas delgadas en lugar de una pieza sólida de hierro?",
  options: ["Para facilitar el ensamblaje y reducir los costos de fabricación", "Para reducir las corrientes parásitas (eddy currents) y las pérdidas por calor", "Para aumentar la permeabilidad magnética del material del núcleo", "Para permitir mejor ventilación y enfriamiento entre las láminas"],
  correct: 1,
  explanation: "Las láminas (laminaciones) interrumpen el camino de las corrientes parásitas inducidas en el núcleo. Estas corrientes circulan en el hierro sólido generando calor inútil (pérdidas I²R). Las láminas aisladas entre sí minimizan estas pérdidas significativamente."
,
    question_en: "Why is a transformer core built with thin laminations instead of a solid piece of iron?",
    options_en: ["To facilitate assembly and reduce manufacturing costs","To reduce eddy currents and heat losses","To increase the magnetic permeability of the core material","To allow better ventilation and cooling between laminations"],
    explanation_en: "Laminations interrupt the path of eddy currents induced in the core. These currents circulate in solid iron generating useless heat (I²R losses). Insulated laminations minimize these losses significantly."
  },
{
  category: "Electricidad y Magnetismo",
  q: "En un motor de inducción, ¿qué representa el 'deslizamiento' (slip) y por qué es necesario?",
  options: ["Es la diferencia de velocidad entre rotor y campo magnético, necesaria para inducir corriente", "Es el desgaste mecánico entre rotor y estator que permite la rotación libre", "Es la pérdida de eficiencia por fricción entre el rotor y los rodamientos", "Es la variación de velocidad causada por cambios en la carga del motor"],
  correct: 0,
  explanation: "El deslizamiento es la diferencia entre la velocidad sincrónica del campo magnético y la velocidad real del rotor. Es esencial porque si el rotor girara a la misma velocidad del campo, no habría movimiento relativo y no se induciría corriente en el rotor."
,
    question_en: "In an induction motor, what does 'slip' represent and why is it necessary?",
    options_en: ["It is the speed difference between rotor and magnetic field, necessary to induce current","It is the mechanical wear between rotor and stator that allows free rotation","It is the efficiency loss from friction between the rotor and bearings","It is the speed variation caused by changes in motor load"],
    explanation_en: "Slip is the difference between the synchronous speed of the magnetic field and the actual rotor speed. It is essential because if the rotor spun at the same speed as the field, there would be no relative motion and no current would be induced in the rotor."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Qué ley electromagnética explica por qué un transformador no funciona con corriente continua (DC) en estado estable?",
  options: ["La ley de Coulomb que gobierna las fuerzas entre cargas estáticas", "La ley de Faraday que requiere un campo magnético cambiante para inducir voltaje", "La ley de Ampère que relaciona corriente con campo magnético constante", "La ley de Gauss que describe el flujo eléctrico a través de superficies"],
  correct: 1,
  explanation: "La ley de Faraday establece que el voltaje inducido es proporcional a la tasa de cambio del flujo magnético. Con DC en estado estable, el flujo es constante (no cambia), por lo tanto no se induce voltaje en el secundario."
,
    question_en: "What electromagnetic law explains why a transformer does not work with direct current (DC) in steady state?",
    options_en: ["Coulomb's law governing forces between static charges","Faraday's law which requires a changing magnetic field to induce voltage","Ampere's law relating current to a constant magnetic field","Gauss's law describing electric flux through surfaces"],
    explanation_en: "Faraday's law states that induced voltage is proportional to the rate of change of magnetic flux. With steady-state DC, the flux is constant (not changing), therefore no voltage is induced in the secondary."
  },
{
  category: "Electricidad y Magnetismo",
  q: "Un solenoide de una válvula reversible de 4 vías consume 0.5A a 24V AC. ¿Cuál es su impedancia aproximada?",
  options: ["12 ohmios aplicando la ley de Ohm directamente con valores DC", "48 ohmios considerando que la impedancia es V dividido entre I en AC", "24 ohmios ya que la impedancia siempre iguala al voltaje nominal", "96 ohmios por tratarse de una carga inductiva con factor de potencia"],
  correct: 1,
  explanation: "Impedancia Z = V/I = 24V/0.5A = 48Ω. En AC, la impedancia incluye resistencia e inductancia (Z = √(R² + XL²)). La resistencia DC sola sería menor que 48Ω, pero la reactancia inductiva del solenoide aumenta la impedancia total."
,
    question_en: "A solenoid on a 4-way reversing valve draws 0.5A at 24V AC. What is its approximate impedance?",
    options_en: ["12 ohms applying Ohm's law directly with DC values","48 ohms considering that impedance is V divided by I in AC","24 ohms since impedance always equals the nominal voltage","96 ohms because it is an inductive load with power factor"],
    explanation_en: "Impedance Z = V/I = 24V/0.5A = 48 ohms. In AC, impedance includes resistance and inductance (Z = sqrt(R² + XL²)). DC resistance alone would be less than 48 ohms, but the solenoid's inductive reactance increases the total impedance."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Por qué un motor monofásico necesita un mecanismo de arranque pero un motor trifásico no?",
  options: ["Porque el motor monofásico tiene devanados más pequeños e insuficiente torque", "Porque la corriente monofásica crea un campo pulsante, no rotativo, por sí sola", "Porque los motores trifásicos tienen rodamientos de menor fricción para arranque", "Porque el voltaje trifásico es siempre mayor que el monofásico disponible"],
  correct: 1,
  explanation: "Una sola fase produce un campo magnético que pulsa (crece y decrece) pero no rota. Se necesita un devanado auxiliar desfasado para crear la ilusión de rotación al arranque. Tres fases desfasadas 120° crean naturalmente un campo magnético rotativo."
,
    question_en: "Why does a single-phase motor need a starting mechanism but a three-phase motor does not?",
    options_en: ["Because the single-phase motor has smaller windings and insufficient torque","Because single-phase current creates a pulsating field, not a rotating one, by itself","Because three-phase motors have lower-friction bearings for starting","Because three-phase voltage is always higher than available single-phase"],
    explanation_en: "A single phase produces a magnetic field that pulsates (grows and shrinks) but does not rotate. An auxiliary winding with phase shift is needed to create the illusion of rotation at startup. Three phases offset 120° naturally create a rotating magnetic field."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Qué ocurre con la inductancia de la bobina de un contactor cuando el núcleo de hierro está completamente atraído (cerrado)?",
  options: ["La inductancia disminuye porque el entrehierro se elimina completamente", "La inductancia aumenta significativamente al cerrar el circuito magnético", "La inductancia permanece igual ya que depende solo del número de espiras", "La inductancia se vuelve cero porque el circuito magnético está saturado"],
  correct: 1,
  explanation: "Al cerrar el núcleo, el entrehierro (alta reluctancia) se elimina, completando el circuito magnético. Esto aumenta enormemente la permeabilidad efectiva y por tanto la inductancia. Mayor inductancia significa mayor impedancia y menor corriente de sostenimiento vs arranque."
,
    question_en: "What happens to the inductance of a contactor coil when the iron core is fully attracted (closed)?",
    options_en: ["Inductance decreases because the air gap is completely eliminated","Inductance increases significantly by closing the magnetic circuit","Inductance remains the same since it depends only on the number of turns","Inductance becomes zero because the magnetic circuit is saturated"],
    explanation_en: "When the core closes, the air gap (high reluctance) is eliminated, completing the magnetic circuit. This enormously increases effective permeability and therefore inductance. Higher inductance means higher impedance and lower holding current vs. inrush current."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Por qué la corriente de una bobina de contactor es mayor en el momento de energizarse que cuando ya está cerrado el contactor?",
  options: ["Porque el voltaje de la línea baja cuando el contactor cierra sus contactos", "Porque con el núcleo abierto hay más entrehierro, menor inductancia y menor impedancia", "Porque los contactos principales crean un camino paralelo que desvía corriente", "Porque el fabricante diseña la bobina con dos niveles de potencia internos"],
  correct: 1,
  explanation: "Con el núcleo abierto (entrehierro máximo), la inductancia es baja, la reactancia inductiva es baja, y la impedancia total es menor, permitiendo mayor corriente (inrush). Al cerrarse, la inductancia aumenta, la impedancia sube, y la corriente baja al valor de sostenimiento."
,
    question_en: "Why is the current of a contactor coil higher at the moment of energizing than when the contactor is already closed?",
    options_en: ["Because line voltage drops when the contactor closes its contacts","Because with the core open there is more air gap, lower inductance, and lower impedance","Because the main contacts create a parallel path that diverts current","Because the manufacturer designs the coil with two internal power levels"],
    explanation_en: "With the core open (maximum air gap), inductance is low, inductive reactance is low, and total impedance is lower, allowing higher current (inrush). When closed, inductance increases, impedance rises, and current drops to the holding value."
  },
{
  category: "Electricidad y Magnetismo",
  q: "Un técnico mide 28V AC en los terminales de un termostato que debería tener 24V AC. ¿Cuál efecto electromagnético puede causar esta lectura elevada?",
  options: ["Voltaje fantasma inducido por cables de control junto a cables de alto voltaje", "Resonancia magnética entre el transformador y la bobina del contactor", "Sobrecarga del secundario del transformador que eleva el voltaje de salida", "Interferencia de radiofrecuencia de equipos electrónicos cercanos al cable"],
  correct: 0,
  explanation: "Cables de control de bajo voltaje que corren paralelos a cables de línea (120/240V) pueden captar voltaje inducido por acoplamiento electromagnético. Este 'voltaje fantasma' suma al voltaje real, dando lecturas elevadas falsas que desaparecen bajo carga."
,
    question_en: "A technician measures 28V AC at thermostat terminals that should have 24V AC. What electromagnetic effect can cause this elevated reading?",
    options_en: ["Phantom voltage induced by control wires running alongside high-voltage cables","Magnetic resonance between the transformer and the contactor coil","Secondary overload of the transformer raising the output voltage","Radio frequency interference from nearby electronic equipment"],
    explanation_en: "Low-voltage control wires running parallel to line cables (120/240V) can pick up induced voltage through electromagnetic coupling. This 'phantom voltage' adds to the real voltage, giving falsely elevated readings that disappear under load."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Qué principio electromagnético explica por qué un amperímetro de gancho puede medir corriente sin contacto directo con el conductor?",
  options: ["El efecto Hall que detecta la diferencia de potencial en un semiconductor", "La inducción mutua donde la corriente del conductor induce flujo en el gancho", "La capacitancia entre el conductor y el gancho que transfiere señal eléctrica", "La resistividad del aire que permite conducción parcial a altas corrientes"],
  correct: 1,
  explanation: "El amperímetro de gancho funciona por inducción mutua (transformador): la corriente en el conductor crea un campo magnético que induce una corriente proporcional en el núcleo toroidal del gancho. Para DC, algunos usan efecto Hall adicionalmente."
,
    question_en: "What electromagnetic principle explains why a clamp ammeter can measure current without direct contact with the conductor?",
    options_en: ["The Hall effect that detects potential difference in a semiconductor","Mutual induction where the conductor's current induces flux in the clamp","Capacitance between the conductor and the clamp that transfers an electrical signal","Air resistivity that allows partial conduction at high currents"],
    explanation_en: "The clamp ammeter works by mutual induction (transformer principle): current in the conductor creates a magnetic field that induces a proportional current in the toroidal core of the clamp. For DC, some additionally use the Hall effect."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Por qué un capacitor bloquea la corriente continua pero permite el paso de corriente alterna?",
  options: ["Porque las placas del capacitor se magnetizan y repelen electrones DC", "Porque la corriente AC carga y descarga el capacitor continuamente sin pasar a través", "Porque el dieléctrico del capacitor solo conduce en frecuencias superiores a 50 Hz", "Porque la corriente DC tiene voltaje constante que satura el capacitor rápidamente"],
  correct: 1,
  explanation: "Con AC, el voltaje cambia constantemente, lo que carga y descarga el capacitor cíclicamente. Esta carga/descarga crea un flujo de corriente en el circuito externo aunque ningún electrón cruza el dieléctrico. Con DC, una vez cargado, la corriente cesa."
,
    question_en: "Why does a capacitor block direct current but allow alternating current to pass?",
    options_en: ["Because the capacitor plates magnetize and repel DC electrons","Because AC current continuously charges and discharges the capacitor without passing through","Because the capacitor dielectric only conducts at frequencies above 50 Hz","Because DC has constant voltage that saturates the capacitor rapidly"],
    explanation_en: "With AC, the voltage constantly changes, which cyclically charges and discharges the capacitor. This charge/discharge creates current flow in the external circuit even though no electrons cross the dielectric. With DC, once charged, current ceases."
  },
{
  category: "Electricidad y Magnetismo",
  q: "En un circuito RLC en serie con resonancia, ¿qué sucede con la impedancia total del circuito?",
  options: ["La impedancia se vuelve infinita bloqueando toda la corriente del circuito", "La impedancia se reduce al valor de la resistencia pura del circuito solamente", "La impedancia se duplica por la suma de reactancias inductiva y capacitiva", "La impedancia se vuelve puramente reactiva eliminando la resistencia del circuito"],
  correct: 1,
  explanation: "En resonancia, la reactancia inductiva (XL) iguala a la capacitiva (XC) y se cancelan mutuamente. La impedancia total se reduce a solo la resistencia (Z=R), y la corriente alcanza su valor máximo. Esto es fundamental en filtros y sintonización."
,
    question_en: "In a series RLC circuit at resonance, what happens to the total impedance of the circuit?",
    options_en: ["Impedance becomes infinite, blocking all current in the circuit","Impedance reduces to the value of pure resistance only","Impedance doubles from the sum of inductive and capacitive reactances","Impedance becomes purely reactive, eliminating the circuit resistance"],
    explanation_en: "At resonance, inductive reactance (XL) equals capacitive reactance (XC) and they cancel each other out. Total impedance reduces to just resistance (Z=R), and current reaches its maximum value. This is fundamental in filters and tuning."
  },
{
  category: "Electricidad y Magnetismo",
  q: "Un técnico nota que al desconectar la bobina de un relé, se genera una chispa considerable en el interruptor. ¿Qué fenómeno electromagnético causa esto?",
  options: ["La resistencia de la bobina genera calor que ioniza el aire del contacto", "La bobina genera un voltaje de retorno (back-EMF) al colapsar el campo magnético", "La corriente residual almacenada en el cable busca un camino alternativo a tierra", "El núcleo de hierro mantiene magnetismo residual que genera arco eléctrico"],
  correct: 1,
  explanation: "Al interrumpir la corriente, el campo magnético de la bobina colapsa rápidamente. Por ley de Lenz, este cambio rápido de flujo induce un voltaje opuesto (back-EMF) que puede ser varias veces mayor que el voltaje aplicado, causando arco en los contactos."
,
    question_en: "A technician notices that when disconnecting a relay coil, a considerable spark is generated at the switch. What electromagnetic phenomenon causes this?",
    options_en: ["The coil resistance generates heat that ionizes the air at the contact","The coil generates a back-EMF voltage when the magnetic field collapses","Residual current stored in the wire seeks an alternative path to ground","The iron core maintains residual magnetism that generates an electric arc"],
    explanation_en: "When current is interrupted, the coil's magnetic field collapses rapidly. By Lenz's law, this rapid flux change induces an opposing voltage (back-EMF) that can be several times greater than the applied voltage, causing arcing at the contacts."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Qué efecto tiene la frecuencia de la línea (50Hz vs 60Hz) sobre un motor de inducción diseñado para 60Hz cuando opera a 50Hz?",
  options: ["El motor operará igual ya que la diferencia de frecuencia es insignificante", "El motor girará más lento, se saturará el núcleo y se sobrecalentará notablemente", "El motor girará más rápido compensando automáticamente la menor frecuencia", "El motor no arrancará porque la frecuencia es incompatible con los devanados"],
  correct: 1,
  explanation: "A 50Hz, la velocidad sincrónica baja (ej: de 1800 a 1500 RPM). Además, la reactancia inductiva es menor (XL=2πfL), permitiendo más corriente y saturando el núcleo magnético. Mayor corriente + menor ventilación (menos RPM) = sobrecalentamiento."
,
    question_en: "What effect does line frequency (50Hz vs 60Hz) have on an induction motor designed for 60Hz when operating at 50Hz?",
    options_en: ["The motor will operate the same since the frequency difference is insignificant","The motor will spin slower, the core will saturate, and it will overheat noticeably","The motor will spin faster automatically compensating for the lower frequency","The motor will not start because the frequency is incompatible with the windings"],
    explanation_en: "At 50Hz, synchronous speed drops (e.g., from 1800 to 1500 RPM). Additionally, inductive reactance is lower (XL=2 pi f L), allowing more current and saturating the magnetic core. Higher current + less ventilation (lower RPM) = overheating."
  },
{
  category: "Electricidad y Magnetismo",
  q: "¿Por qué los cables del circuito de control de 24V deben separarse de los cables de alimentación de 240V en una instalación?",
  options: ["Para cumplir con el código estético de la instalación según normas locales", "Para evitar inducción electromagnética que genere señales falsas en el control", "Para prevenir que el calor de los cables de potencia dañe el aislamiento fino", "Para facilitar el acceso durante el mantenimiento y diagnóstico del sistema"],
  correct: 1,
  explanation: "Los cables de 240V generan campos electromagnéticos que pueden inducir voltaje parásito en los cables de 24V cercanos por acoplamiento inductivo. Estas señales falsas pueden causar operación errática del termostato, tarjeta de control y relés."
,
    question_en: "Why must 24V control circuit cables be separated from 240V power cables in an installation?",
    options_en: ["To comply with the aesthetic installation code per local standards","To avoid electromagnetic induction that generates false signals in the controls","To prevent heat from power cables damaging the thin insulation","To facilitate access during system maintenance and diagnostics"],
    explanation_en: "240V cables generate electromagnetic fields that can induce parasitic voltage in nearby 24V cables through inductive coupling. These false signals can cause erratic operation of the thermostat, control board, and relays."
  },
{
  category: "Transformadores",
  q: "Un transformador de control tiene primario de 240V y secundario de 24V con capacidad de 75VA. ¿Cuál es la corriente máxima disponible en el secundario?",
  options: ["3.125 amperios basándose en la relación VA entre voltaje primario", "0.3125 amperios dividiendo 75VA entre el voltaje del primario", "75 amperios ya que los VA equivalen a amperios en transformadores", "7.5 amperios multiplicando el factor de transformación por la potencia"],
  correct: 0,
  explanation: "I = VA/V = 75VA/24V = 3.125A en el secundario. Este es el límite máximo de corriente que puede suministrar sin sobrecalentarse. Si la carga de control (bobinas, termostato, tarjeta) excede 3.125A, el transformador se dañará."
,
    question_en: "A control transformer has a 240V primary and a 24V secondary with a 75VA capacity. What is the maximum current available on the secondary?",
    options_en: ["3.125 amps based on the VA ratio with the primary voltage","0.3125 amps dividing 75VA by the primary voltage","75 amps since VA equals amps in transformers","7.5 amps multiplying the transformation factor by the power"],
    explanation_en: "I = VA/V = 75VA/24V = 3.125A on the secondary. This is the maximum current it can supply without overheating. If the control load (coils, thermostat, board) exceeds 3.125A, the transformer will be damaged."
  },
{
  category: "Transformadores",
  q: "¿Por qué un transformador de 40VA puede no ser suficiente para un sistema con termostato WiFi, humidificador, y economizador?",
  options: ["Porque los termostatos WiFi requieren voltaje superior a 24V para operar", "Porque la suma de cargas de todos los accesorios puede exceder los 40VA disponibles", "Porque los humidificadores operan con voltaje DC incompatible con el transformador", "Porque el economizador necesita un transformador independiente por código NEC"],
  correct: 1,
  explanation: "Cada accesorio consume VA: termostato WiFi (~5VA), humidificador (~20VA), economizador (~15VA), más la bobina del contactor (~20VA). Total ~60VA excede los 40VA del transformador, causando bajo voltaje que produce operación errática o falla."
,
    question_en: "Why might a 40VA transformer be insufficient for a system with a WiFi thermostat, humidifier, and economizer?",
    options_en: ["Because WiFi thermostats require voltage higher than 24V to operate","Because the combined load of all accessories may exceed the available 40VA","Because humidifiers operate on DC voltage incompatible with the transformer","Because the economizer needs an independent transformer per NEC code"],
    explanation_en: "Each accessory consumes VA: WiFi thermostat (~5VA), humidifier (~20VA), economizer (~15VA), plus contactor coil (~20VA). Total ~60VA exceeds the transformer's 40VA, causing low voltage that produces erratic operation or failure."
  },
{
  category: "Transformadores",
  q: "Un técnico mide 0V en el secundario de un transformador, pero el primario tiene 240V. ¿Qué prueba debe realizar para diagnosticar?",
  options: ["Medir la frecuencia del voltaje primario con osciloscopio de precisión", "Medir la resistencia del devanado secundario para verificar si está abierto", "Verificar el voltaje de línea con otro multímetro calibrado recientemente", "Comprobar que el panel de breakers tiene la tierra correctamente instalada"],
  correct: 1,
  explanation: "Con voltaje en el primario y 0V en el secundario, el devanado secundario probablemente está abierto (quemado). Medir resistencia del secundario lo confirma: lectura infinita (OL) indica devanado abierto. Lectura de unos pocos ohmios indicaría secundario bueno."
,
    question_en: "A technician measures 0V on a transformer secondary, but the primary has 240V. What test should be performed to diagnose?",
    options_en: ["Measure primary voltage frequency with a precision oscilloscope","Measure secondary winding resistance to verify if it is open","Verify line voltage with another recently calibrated multimeter","Check that the breaker panel has the ground correctly installed"],
    explanation_en: "With voltage on the primary and 0V on the secondary, the secondary winding is probably open (burned). Measuring secondary resistance confirms it: an infinite reading (OL) indicates an open winding. A few ohms reading would indicate a good secondary."
  },
{
  category: "Transformadores",
  q: "¿Cuál es el propósito del centro-tap (derivación central) en un transformador de 240V/24V usado en sistemas de HVAC?",
  options: ["Proporcionar un punto de referencia de tierra para el circuito de 24V de control", "Reducir el tamaño físico del transformador a la mitad del normal requerido", "Duplicar la capacidad de VA del transformador al dividir la carga en dos mitades", "Permitir conectar cargas de 12V y 24V simultáneamente del mismo transformador"],
  correct: 0,
  explanation: "El centro-tap del secundario proporciona un punto neutro/referencia a 0V, creando dos salidas de 12V respecto al centro o 24V entre extremos. En HVAC se usa principalmente como punto de referencia de tierra para el circuito de control."
,
    question_en: "What is the purpose of the center-tap in a 240V/24V transformer used in HVAC systems?",
    options_en: ["Provide a ground reference point for the 24V control circuit","Reduce the physical size of the transformer to half the normal requirement","Double the transformer VA capacity by dividing the load in two halves","Allow connecting 12V and 24V loads simultaneously from the same transformer"],
    explanation_en: "The secondary center-tap provides a neutral/reference point at 0V, creating two 12V outputs relative to center or 24V between extremes. In HVAC it is mainly used as a ground reference point for the control circuit."
  },
{
  category: "Transformadores",
  q: "Si un transformador de 240V/24V tiene una relación de espiras de 10:1, ¿cuántas espiras tiene el secundario si el primario tiene 500 espiras?",
  options: ["50 espiras según la relación directa de transformación 10 a 1", "5,000 espiras ya que es un transformador reductor de alto voltaje", "100 espiras considerando el factor de pérdidas del núcleo magnético", "250 espiras que es la mitad del devanado primario del transformador"],
  correct: 0,
  explanation: "Relación de espiras Np/Ns = Vp/Vs = 10/1. Si Np = 500, entonces Ns = 500/10 = 50 espiras. La relación de espiras determina directamente la relación de voltaje en un transformador ideal."
,
    question_en: "If a 240V/24V transformer has a turns ratio of 10:1, how many turns does the secondary have if the primary has 500 turns?",
    options_en: ["50 turns per the direct 10:1 transformation ratio","5,000 turns since it is a high-voltage step-down transformer","100 turns considering the magnetic core loss factor","250 turns which is half of the transformer primary winding"],
    explanation_en: "Turns ratio Np/Ns = Vp/Vs = 10/1. If Np = 500, then Ns = 500/10 = 50 turns. The turns ratio directly determines the voltage ratio in an ideal transformer."
  },
{
  category: "Transformadores",
  q: "¿Qué sucede si se conecta un transformador diseñado para primario de 208V a una alimentación de 240V?",
  options: ["El transformador funcionará normalmente sin ningún efecto notable en el sistema", "El voltaje secundario aumentará proporcionalmente y puede dañar componentes de control", "El transformador se quemará instantáneamente por exceso de voltaje en el primario", "La corriente del primario se reducirá compensando automáticamente el mayor voltaje"],
  correct: 1,
  explanation: "Con 240V en primario de 208V, el secundario entregará 24V × (240/208) = 27.7V. Este sobrevoltaje puede dañar tarjetas electrónicas, termostatos digitales y otros componentes de control diseñados para 24V ±10%."
,
    question_en: "What happens if a transformer designed for a 208V primary is connected to a 240V supply?",
    options_en: ["The transformer will function normally with no notable effect on the system","The secondary voltage will increase proportionally and may damage control components","The transformer will burn out instantly from excess primary voltage","The primary current will decrease automatically compensating for the higher voltage"],
    explanation_en: "With 240V on a 208V primary, the secondary will deliver 24V x (240/208) = 27.7V. This overvoltage can damage electronic boards, digital thermostats, and other control components designed for 24V +/-10%."
  },
{
  category: "Transformadores",
  q: "Un transformador de control emite un zumbido fuerte y perceptible desde su instalación. ¿Cuál es la causa más probable?",
  options: ["El transformador está sobrecargado y a punto de fallar por sobrecalentamiento", "Las láminas del núcleo están flojas y vibran con la frecuencia de la línea AC", "El devanado secundario tiene un cortocircuito parcial causando vibración excesiva", "La frecuencia de la alimentación es incorrecta para el diseño del transformador"],
  correct: 1,
  explanation: "El zumbido en transformadores se debe a magnetostricción (expansión/contracción del núcleo con el campo magnético) amplificada por láminas flojas que vibran a 120Hz (doble de 60Hz). Un transformador con láminas bien apretadas zumba mínimamente.",
    question_en: "A control transformer emits a loud, noticeable buzz since installation. What is the most likely cause?",
    options_en: ["The transformer is overloaded and about to fail from overheating", "The core laminations are loose and vibrate at the AC line frequency", "The secondary winding has a partial short circuit causing excessive vibration", "The supply frequency is incorrect for the transformer design"],
    explanation_en: "Transformer buzzing is caused by magnetostriction (expansion/contraction of the core with the magnetic field) amplified by loose laminations vibrating at 120Hz (double of 60Hz). A transformer with tightly clamped laminations buzzes minimally."
},
{
  category: "Transformadores",
  q: "¿Por qué los transformadores de HVAC tienen un fusible o protección en el secundario pero raramente en el primario?",
  options: ["Porque el primario está protegido por el breaker del panel eléctrico principal", "Porque la corriente del primario es siempre menor que la capacidad del cable", "Porque los fusibles de alto voltaje son demasiado costosos para uso en HVAC", "Porque una falla en el primario se manifiesta primero como falla en secundario"],
  correct: 0,
  explanation: "El primario ya está protegido por el breaker del circuito de alimentación. El fusible del secundario protege el transformador y circuito de control contra cortocircuitos en el cableado de bajo voltaje, que el breaker del primario no detectaría por ser corriente muy baja."
,
    question_en: "Why do HVAC transformers have a fuse or protection on the secondary but rarely on the primary?",
    options_en: ["Because the primary is protected by the main electrical panel breaker","Because primary current is always less than the cable capacity","Because high-voltage fuses are too expensive for HVAC use","Because a primary failure manifests first as a secondary failure"],
    explanation_en: "The primary is already protected by the supply circuit breaker. The secondary fuse protects the transformer and control circuit against short circuits in the low-voltage wiring, which the primary breaker would not detect due to the very low current."
  },
{
  category: "Transformadores",
  q: "Un sistema tiene dos transformadores de 24V/40VA cada uno. ¿Pueden conectarse los secundarios en paralelo para obtener 24V/80VA?",
  options: ["Sí, simplemente conectando los secundarios juntos terminal a terminal directamente", "Solo si ambos transformadores tienen idéntico voltaje, fase y regulación de voltaje", "No, nunca se pueden conectar transformadores en paralelo bajo ninguna circunstancia", "Sí, pero se necesita un diodo entre los secundarios para evitar circulación inversa"],
  correct: 1,
  explanation: "Conectar transformadores en paralelo requiere que tengan exactamente el mismo voltaje secundario, misma polaridad/fase, y regulación similar. Sin estas condiciones, circulará corriente entre los secundarios causando sobrecalentamiento y posible daño a ambos."
,
    question_en: "A system has two 24V/40VA transformers. Can the secondaries be connected in parallel to obtain 24V/80VA?",
    options_en: ["Yes, simply connecting the secondaries together terminal to terminal directly","Only if both transformers have identical voltage, phase, and voltage regulation","No, transformers can never be connected in parallel under any circumstances","Yes, but a diode is needed between the secondaries to prevent reverse circulation"],
    explanation_en: "Connecting transformers in parallel requires exactly the same secondary voltage, same polarity/phase, and similar regulation. Without these conditions, current will circulate between the secondaries causing overheating and possible damage to both."
  },
{
  category: "Transformadores",
  q: "¿Qué ocurre con un transformador de 24V cuando un cortocircuito franco ocurre en el secundario y no tiene fusible?",
  options: ["El transformador limita la corriente automáticamente por su impedancia interna", "La corriente del secundario sube drásticamente sobrecalentando y quemando el devanado", "El breaker del primario se dispara inmediatamente protegiendo todo el circuito completo", "El transformador simplemente deja de funcionar sin daños por su diseño protegido"],
  correct: 1,
  explanation: "Sin fusible, un corto en el secundario permite corriente limitada solo por la baja impedancia del devanado. Esta corriente excesiva sobrecalienta el devanado rápidamente, derrite el aislamiento y quema el transformador. El breaker primario puede no dispararse porque la corriente reflejada al primario es pequeña."
,
    question_en: "What happens to a 24V transformer when a dead short occurs on the secondary and it has no fuse?",
    options_en: ["The transformer automatically limits current through its internal impedance","The secondary current rises drastically, overheating and burning the winding","The primary breaker trips immediately protecting the entire circuit","The transformer simply stops working without damage due to its protected design"],
    explanation_en: "Without a fuse, a secondary short allows current limited only by the low winding impedance. This excessive current rapidly overheats the winding, melts the insulation, and burns the transformer. The primary breaker may not trip because the reflected current to the primary is small."
  },
{
  category: "Transformadores",
  q: "¿Por qué se especifica un transformador de mayor VA cuando el cableado de control entre termostato y equipo es muy largo?",
  options: ["Porque el cable largo actúa como antena captando interferencia electromagnética dañina", "Porque la resistencia del cable largo consume parte de los VA causando caída de voltaje", "Porque el código NEC requiere mayor VA para distancias superiores a 50 pies en control", "Porque el cable largo añade capacitancia que el transformador debe compensar continuamente"],
  correct: 1,
  explanation: "Un cable de control largo tiene resistencia significativa que consume VA (P=I²R) y causa caída de voltaje. Un transformador de mayor VA tiene menor impedancia interna y compensa mejor estas pérdidas, manteniendo voltaje adecuado en la carga distante."
,
    question_en: "Why is a higher VA transformer specified when the control wiring between thermostat and equipment is very long?",
    options_en: ["Because the long cable acts as an antenna picking up harmful electromagnetic interference","Because the long cable resistance consumes part of the VA causing voltage drop","Because NEC code requires higher VA for distances over 50 feet in control circuits","Because the long cable adds capacitance that the transformer must continuously compensate"],
    explanation_en: "A long control cable has significant resistance that consumes VA (P=I²R) and causes voltage drop. A higher VA transformer has lower internal impedance and better compensates for these losses, maintaining adequate voltage at the distant load."
  },
{
  category: "Transformadores",
  q: "Al medir un transformador de 240/24V con el multímetro en ohmios, el primario lee 18Ω y el secundario 1.2Ω. ¿Qué indica esto?",
  options: ["El transformador tiene espiras en corto en ambos devanados simultáneamente", "Las lecturas son normales: mayor resistencia en primario por más espiras de alambre más fino", "El secundario está en cortocircuito porque su resistencia debería ser mayor que el primario", "El transformador está dañado porque ambas lecturas deberían ser iguales en valor"],
  correct: 1,
  explanation: "El primario tiene más espiras de alambre más delgado (mayor resistencia: 18Ω). El secundario tiene menos espiras de alambre más grueso (menor resistencia: 1.2Ω). La relación de resistencia es aproximadamente proporcional al cuadrado de la relación de espiras."
,
    question_en: "When measuring a 240/24V transformer with a multimeter in ohms, the primary reads 18 ohms and the secondary reads 1.2 ohms. What does this indicate?",
    options_en: ["The transformer has shorted turns in both windings simultaneously","The readings are normal: higher resistance in primary due to more turns of thinner wire","The secondary is short-circuited because its resistance should be higher than the primary","The transformer is damaged because both readings should be equal in value"],
    explanation_en: "The primary has more turns of thinner wire (higher resistance: 18 ohms). The secondary has fewer turns of thicker wire (lower resistance: 1.2 ohms). The resistance ratio is approximately proportional to the square of the turns ratio."
  },
{
  category: "Transformadores",
  q: "Un técnico encuentra un transformador con taps de primario marcados: 208V, 230V, 240V. ¿Por qué existen estos taps múltiples?",
  options: ["Para permitir seleccionar diferentes voltajes de salida en el devanado secundario", "Para adaptar el transformador al voltaje real de alimentación y mantener 24V en el secundario", "Para conectar el transformador a sistemas monofásicos o trifásicos según la instalación", "Para variar la capacidad de VA del transformador según la carga del sistema conectado"],
  correct: 1,
  explanation: "Los taps del primario permiten ajustar la relación de espiras según el voltaje real de alimentación. Conectar al tap correcto asegura que el secundario entregue exactamente 24V. Un tap incorrecto resultará en sobre o bajo voltaje en el secundario."
,
    question_en: "A technician finds a transformer with primary taps marked: 208V, 230V, 240V. Why do these multiple taps exist?",
    options_en: ["To allow selecting different output voltages on the secondary winding","To adapt the transformer to the actual supply voltage and maintain 24V on the secondary","To connect the transformer to single-phase or three-phase systems as needed","To vary the transformer VA capacity based on the connected system load"],
    explanation_en: "Primary taps allow adjusting the turns ratio based on the actual supply voltage. Connecting to the correct tap ensures the secondary delivers exactly 24V. An incorrect tap will result in over or under voltage on the secondary."
  },
{
  category: "Transformadores",
  q: "¿Qué sucede si un transformador step-down de 240V/24V se conecta al revés, alimentando 24V al devanado de 24V?",
  options: ["El transformador se quema instantáneamente por el voltaje invertido recibido", "El transformador actuará como step-up, entregando aproximadamente 240V en el otro devanado", "No sucede nada porque el transformador solo funciona en una dirección de diseño", "El transformador entregará 24V en ambos devanados debido a la relación de espiras unitaria"],
  correct: 1,
  explanation: "Un transformador es bidireccional. Alimentando 24V al devanado de menor espiras, inducirá 240V en el de mayor espiras (step-up). Esto es peligroso ya que genera alto voltaje inesperado y potencialmente letal en terminales que podrían estar expuestos."
,
    question_en: "What happens if a 240V/24V step-down transformer is connected in reverse, feeding 24V to the 24V winding?",
    options_en: ["The transformer burns out instantly from the reversed voltage","The transformer will act as a step-up, delivering approximately 240V on the other winding","Nothing happens because the transformer only works in one design direction","The transformer will deliver 24V on both windings due to a unity turns ratio"],
    explanation_en: "A transformer is bidirectional. Feeding 24V to the lower-turns winding will induce 240V on the higher-turns winding (step-up). This is dangerous as it generates unexpected and potentially lethal high voltage on terminals that may be exposed."
  },
{
  category: "Controles Eléctricos",
  q: "Un lockout de tarjeta de control muestra código de error por 'limit switch open' en una manejadora con calefacción a gas. ¿Qué debe investigarse primero?",
  options: ["El sensor de flama está sucio y no detecta la llama del quemador correctamente", "El flujo de aire es insuficiente: filtro sucio, motor de ventilador lento, o ductos obstruidos", "La válvula de gas no está abriendo completamente por falta de presión de suministro", "La tarjeta de control tiene un componente defectuoso que envía código de error falso"],
  correct: 1,
  explanation: "El limit switch (interruptor de límite de temperatura) se abre cuando detecta temperatura excesiva en el plenum. La causa más común es flujo de aire insuficiente: filtro sucio, motor de ventilador deficiente, ductos colapsados o registros cerrados que impiden disipar el calor del intercambiador."
,
    question_en: "A control board lockout shows an error code for 'limit switch open' in an air handler with gas heat. What should be investigated first?",
    options_en: ["The flame sensor is dirty and not detecting the burner flame correctly","Airflow is insufficient: dirty filter, slow fan motor, or obstructed ductwork","The gas valve is not opening completely due to lack of supply pressure","The control board has a defective component sending a false error code"],
    explanation_en: "The limit switch (temperature limit switch) opens when it detects excessive temperature in the plenum. The most common cause is insufficient airflow: dirty filter, deficient fan motor, collapsed ducts, or closed registers preventing heat dissipation from the heat exchanger."
  },
{
  category: "Compresores",
  q: "Un compresor scroll presenta un ruido metálico fuerte solo durante los primeros 30 segundos de operación. ¿Cuál es la causa más probable?",
  options: ["Los rodamientos del compresor están desgastados y necesitan reemplazo pronto", "Hay refrigerante líquido retornando al compresor causando slugging al arranque", "Las espirales scroll están desalineadas por daño mecánico durante el transporte", "El aceite del compresor tiene nivel bajo y no lubrica hasta crear presión interna"],
  correct: 1,
  explanation: "Ruido metálico temporal al arranque en un scroll indica flood-back o slugging: refrigerante líquido acumulado en el compresor durante el ciclo apagado. Los primeros 30 segundos el compresor intenta comprimir líquido incompresible, causando el golpeteo hasta que se evapora."
,
    question_en: "A scroll compressor makes a loud metallic noise only during the first 30 seconds of operation. What is the most likely cause?",
    options_en: ["The compressor bearings are worn and need replacement soon","Liquid refrigerant is returning to the compressor causing slugging at startup","The scroll spirals are misaligned from mechanical damage during transport","The compressor oil level is low and does not lubricate until internal pressure builds"],
    explanation_en: "Temporary metallic noise at startup in a scroll indicates flood-back or slugging: liquid refrigerant accumulated in the compressor during the off cycle. For the first 30 seconds, the compressor tries to compress incompressible liquid, causing banging until it evaporates."
  },
{
  category: "Compresores",
  q: "¿Cuál es la ventaja principal de un compresor scroll sobre un reciprocante para aplicaciones residenciales de AC?",
  options: ["El scroll es significativamente más económico de fabricar y reemplazar que el reciprocante", "El scroll tiene menos partes móviles, menor vibración y mayor eficiencia volumétrica", "El scroll puede operar con cualquier tipo de refrigerante sin modificaciones al diseño", "El scroll permite reparación en campo del mecanismo de compresión interno dañado"],
  correct: 1,
  explanation: "El compresor scroll tiene solo dos componentes principales (espiral fija y orbital) vs válvulas, pistones, bielas del reciprocante. Menos partes = menor vibración, menos ruido, y mejor eficiencia volumétrica (menos espacios muertos que reexpanden gas)."
,
    question_en: "What is the main advantage of a scroll compressor over a reciprocating one for residential AC applications?",
    options_en: ["The scroll is significantly cheaper to manufacture and replace than the reciprocating","The scroll has fewer moving parts, less vibration, and higher volumetric efficiency","The scroll can operate with any type of refrigerant without design modifications","The scroll allows field repair of the internal compression mechanism"],
    explanation_en: "The scroll compressor has only two main components (fixed and orbiting scroll) vs. valves, pistons, and connecting rods of the reciprocating. Fewer parts = less vibration, less noise, and better volumetric efficiency (fewer dead spaces that re-expand gas)."
  },
{
  category: "Compresores",
  q: "Un compresor inverter modula su velocidad de 30% a 100%. ¿Qué beneficio principal proporciona esto sobre un compresor de velocidad fija?",
  options: ["Permite usar refrigerantes de mayor presión que un compresor convencional permite", "Ajusta la capacidad a la carga real eliminando el ciclado on-off y mejorando eficiencia", "Reduce el tamaño físico del compresor permitiendo instalaciones en espacios más pequeños", "Elimina la necesidad de usar capacitores de arranque y marcha en el circuito eléctrico"],
  correct: 1,
  explanation: "El inverter modula la velocidad para igualar la capacidad del compresor con la carga térmica real. Esto elimina ciclados frecuentes, mantiene temperatura más estable, reduce picos de corriente de arranque, y puede lograr SEER de 20+ vs 14-16 de velocidad fija."
,
    question_en: "An inverter compressor modulates its speed from 30% to 100%. What main benefit does this provide over a fixed-speed compressor?",
    options_en: ["Allows using higher-pressure refrigerants than a conventional compressor permits","Adjusts capacity to the actual load, eliminating on-off cycling and improving efficiency","Reduces the physical size of the compressor allowing installations in smaller spaces","Eliminates the need for start and run capacitors in the electrical circuit"],
    explanation_en: "The inverter modulates speed to match compressor capacity with the actual thermal load. This eliminates frequent cycling, maintains more stable temperature, reduces startup current peaks, and can achieve SEER of 20+ vs. 14-16 for fixed speed."
  },
{
  category: "Compresores",
  q: "¿Por qué el aceite del compresor puede volverse ácido en un sistema con exceso de humedad interna?",
  options: ["Porque el agua reacciona directamente con el aceite sintético formando ácido orgánico", "Porque la humedad reacciona con el refrigerante a alta temperatura formando ácido clorhídrico o fluorhídrico", "Porque las bacterias en el agua contaminan el aceite creando subproductos ácidos", "Porque la presión elevada del sistema convierte el agua en un ácido por compresión"],
  correct: 1,
  explanation: "La humedad a altas temperaturas de descarga reacciona con refrigerantes halogenados (HFC, HCFC) descomponiéndolos y formando ácidos (HCl, HF). Estos ácidos corroen superficies metálicas internas y degradan el aislamiento del motor del compresor."
,
    question_en: "Why can compressor oil become acidic in a system with excess internal moisture?",
    options_en: ["Because water reacts directly with synthetic oil forming organic acid","Because moisture reacts with refrigerant at high temperature forming hydrochloric or hydrofluoric acid","Because bacteria in the water contaminate the oil creating acidic byproducts","Because the system's elevated pressure converts water into an acid through compression"],
    explanation_en: "Moisture at high discharge temperatures reacts with halogenated refrigerants (HFC, HCFC), decomposing them and forming acids (HCl, HF). These acids corrode internal metal surfaces and degrade the compressor motor insulation."
  },
{
  category: "Compresores",
  q: "Un técnico encuentra que el aceite de un compresor es de color verde oscuro con olor ácido. ¿Qué procedimiento debe seguirse?",
  options: ["Cambiar el aceite del compresor y agregar filtro deshidratador nuevo al sistema", "Reemplazar el compresor, hacer flush al sistema, instalar filtro de ácido y succionar vacío profundo", "Agregar un aditivo neutralizador de ácido al sistema y continuar la operación normal", "Recuperar refrigerante, drenar aceite, recargar aceite nuevo y refrigerante fresco al sistema"],
  correct: 1,
  explanation: "Aceite verde/negro con olor ácido indica descomposición severa (burnout). El ácido contamina todo el sistema. Se requiere: reemplazo del compresor, flush completo de líneas, filtro de succión anti-ácido, deshidratador nuevo, y vacío profundo antes de recargar."
,
    question_en: "A technician finds that compressor oil is dark green with an acidic smell. What procedure should be followed?",
    options_en: ["Change the compressor oil and add a new filter drier to the system","Replace the compressor, flush the system, install an acid filter, and pull a deep vacuum","Add an acid neutralizing additive to the system and continue normal operation","Recover refrigerant, drain oil, recharge with new oil and fresh refrigerant"],
    explanation_en: "Green/black oil with acidic smell indicates severe decomposition (burnout). The acid contaminates the entire system. Required: compressor replacement, complete line flush, suction anti-acid filter, new drier, and deep vacuum before recharging."
  },
{
  category: "Compresores",
  q: "¿Cuál es la diferencia operativa entre un compresor rotativo y un compresor scroll?",
  options: ["El rotativo usa pistones en línea mientras el scroll usa engranajes helicoidales para comprimir", "El rotativo comprime gas en una sola revolución mientras el scroll lo hace gradualmente en múltiples vueltas", "El rotativo requiere aceite especial sintético mientras el scroll funciona con aceite mineral estándar", "El rotativo opera solo con R-22 mientras el scroll es exclusivo para refrigerantes R-410A"],
  correct: 1,
  explanation: "En el compresor rotativo, el gas se atrapa y comprime en una sola revolución del rotor. En el scroll, el gas se atrapa en bolsas entre espirales que se reducen gradualmente a través de varias vueltas, creando compresión más suave y continua."
,
    question_en: "What is the operational difference between a rotary compressor and a scroll compressor?",
    options_en: ["The rotary uses inline pistons while the scroll uses helical gears to compress","The rotary compresses gas in a single revolution while the scroll does it gradually over multiple turns","The rotary requires special synthetic oil while the scroll works with standard mineral oil","The rotary operates only with R-22 while the scroll is exclusive to R-410A refrigerants"],
    explanation_en: "In the rotary compressor, gas is trapped and compressed in a single revolution of the rotor. In the scroll, gas is trapped in pockets between spirals that gradually reduce over several turns, creating smoother, more continuous compression."
  },
{
  category: "Compresores",
  q: "Un compresor hermético arranca y se apaga en 3-5 segundos repetidamente. El amperaje sube a LRA y no baja. ¿Qué indica esto?",
  options: ["El capacitor de arranque no está proporcionando el desfase necesario al motor", "El compresor está mecánicamente trabado o tiene válvulas internas dañadas sin ecualización", "El contactor del compresor tiene contactos oxidados con alta resistencia de paso", "El relé de arranque está pegado manteniendo el devanado de arranque energizado"],
  correct: 1,
  explanation: "Si el amperaje sube a LRA y no baja, el compresor no puede iniciar la compresión: está trabado mecánicamente o las válvulas no sellan, impidiendo que el motor tome velocidad. La protección térmica lo apaga por sobrecorriente repetidamente."
,
    question_en: "A hermetic compressor starts and shuts off in 3-5 seconds repeatedly. Amperage rises to LRA and does not drop. What does this indicate?",
    options_en: ["The start capacitor is not providing the necessary phase shift to the motor","The compressor is mechanically seized or has damaged internal valves without equalization","The compressor contactor has oxidized contacts with high pass-through resistance","The start relay is stuck keeping the start winding energized"],
    explanation_en: "If amperage rises to LRA and does not drop, the compressor cannot begin compression: it is mechanically seized or the valves do not seal, preventing the motor from reaching speed. The thermal protection shuts it off repeatedly due to overcurrent."
  },
{
  category: "Compresores",
  q: "¿Por qué un compresor scroll puede operar silenciosamente al girar en reversa sin comprimir gas?",
  options: ["Porque las espirales no hacen contacto cuando giran en dirección opuesta a la de diseño", "Porque las espirales se separan en reversa, permitiendo que el gas pase libremente sin compresión", "Porque el motor del compresor reduce automáticamente la velocidad al detectar rotación inversa", "Porque el aceite crea una capa de amortiguación que absorbe la vibración del giro invertido"],
  correct: 1,
  explanation: "En un scroll operando en reversa, las espirales se separan ligeramente, el gas fluye sin ser atrapado ni comprimido. El compresor gira libre sin bombear refrigerante, operando silenciosamente pero sin producir diferencia de presión. Consume energía sin hacer trabajo útil."
,
    question_en: "Why can a scroll compressor operate quietly when running in reverse without compressing gas?",
    options_en: ["Because the scrolls do not make contact when spinning in the opposite direction","Because the scrolls separate in reverse, allowing gas to pass freely without compression","Because the compressor motor automatically reduces speed when detecting reverse rotation","Because the oil creates a cushioning layer that absorbs the vibration of reversed spinning"],
    explanation_en: "In a scroll running in reverse, the spirals separate slightly, gas flows without being trapped or compressed. The compressor spins freely without pumping refrigerant, operating quietly but producing no pressure differential. It consumes energy without doing useful work."
  },
{
  category: "Compresores",
  q: "¿Cuál es la función del sensor de descarga (discharge temperature sensor) en un compresor inverter moderno?",
  options: ["Medir la temperatura ambiente para ajustar la velocidad del compresor automáticamente", "Proteger contra sobrecalentamiento extremo que indica baja carga de refrigerante o falla", "Monitorear la eficiencia del condensador para activar limpieza automática del serpentín", "Regular la temperatura del aceite para mantener la viscosidad dentro del rango óptimo"],
  correct: 1,
  explanation: "El sensor de temperatura de descarga monitorea el gas caliente a la salida del compresor. Temperaturas excesivas (>250°F) indican problemas como baja carga de refrigerante, restricción, o pérdida de enfriamiento del compresor. La tarjeta reduce velocidad o apaga el compresor para protegerlo."
,
    question_en: "What is the function of the discharge temperature sensor in a modern inverter compressor?",
    options_en: ["Measure ambient temperature to automatically adjust compressor speed","Protect against extreme overheating indicating low refrigerant charge or failure","Monitor condenser efficiency to activate automatic coil cleaning","Regulate oil temperature to maintain viscosity within the optimal range"],
    explanation_en: "The discharge temperature sensor monitors hot gas at the compressor outlet. Excessive temperatures (>250°F) indicate problems such as low refrigerant charge, restriction, or loss of compressor cooling. The board reduces speed or shuts down the compressor for protection."
  },
{
  category: "Compresores",
  q: "Un compresor reciprocante de 5 toneladas tiene consumo de aceite excesivo. ¿Cuál es la causa más probable?",
  options: ["El refrigerante está diluido en el aceite causando espumeo y pérdida por descarga", "Los anillos del pistón están desgastados permitiendo que aceite pase a la cámara de compresión", "El nivel de aceite es demasiado alto y el compresor lo empuja por las líneas de succión", "La válvula de alivio interna está abierta recirculando aceite dentro del compresor"],
  correct: 1,
  explanation: "Anillos de pistón desgastados permiten que el aceite del cárter suba a la cámara de compresión y sea bombeado con el refrigerante al sistema. Este aceite se acumula en el evaporador y condensador, reduciendo transferencia de calor y nivel de aceite."
,
    question_en: "A 5-ton reciprocating compressor has excessive oil consumption. What is the most likely cause?",
    options_en: ["Refrigerant is diluted in the oil causing foaming and loss through discharge","The piston rings are worn allowing oil to pass into the compression chamber","The oil level is too high and the compressor pushes it through the suction lines","The internal relief valve is open recirculating oil inside the compressor"],
    explanation_en: "Worn piston rings allow crankcase oil to rise into the compression chamber and be pumped with the refrigerant into the system. This oil accumulates in the evaporator and condenser, reducing heat transfer and oil level."
  },
{
  category: "Compresores",
  q: "¿Por qué se recomienda hacer vacío prolongado (500 micrones o menos) antes de cargar un sistema con compresor nuevo?",
  options: ["Para verificar que no haya fugas en las conexiones del sistema recién soldadas", "Para eliminar humedad y gases no condensables que degradan aceite y rendimiento", "Para limpiar las tuberías de residuos de soldadura y flux acumulados durante la instalación", "Para crear presión negativa que facilite la entrada del refrigerante nuevo al sistema"],
  correct: 1,
  explanation: "El vacío profundo (500 micrones o menos) hierve y extrae la humedad atrapada en el sistema a temperatura ambiente. La humedad causa formación de ácidos, corrosión y obstrucción en dispositivos de expansión. Gases no condensables reducen eficiencia y elevan presiones."
,
    question_en: "Why is a prolonged vacuum (500 microns or less) recommended before charging a system with a new compressor?",
    options_en: ["To verify there are no leaks in the newly soldered system connections","To remove moisture and non-condensable gases that degrade oil and performance","To clean the tubing of solder residue and flux accumulated during installation","To create negative pressure that facilitates new refrigerant entry into the system"],
    explanation_en: "A deep vacuum (500 microns or less) boils and extracts moisture trapped in the system at room temperature. Moisture causes acid formation, corrosion, and blockage in expansion devices. Non-condensable gases reduce efficiency and raise pressures."
  },
{
  category: "Compresores",
  q: "Un compresor scroll con tecnología de descarga de vapor (vapor injection) tiene una tercera línea conectada. ¿Cuál es su propósito?",
  options: ["Retornar aceite acumulado en el evaporador de vuelta al cárter del compresor directamente", "Inyectar vapor de refrigerante a presión intermedia para aumentar capacidad en calefacción", "Descargar exceso de presión cuando el sistema opera en condiciones de alta temperatura", "Proporcionar refrigeración adicional al motor del compresor durante operación de alta carga"],
  correct: 1,
  explanation: "La inyección de vapor (EVI - Enhanced Vapor Injection) introduce refrigerante a presión intermedia en la cámara de compresión del scroll. Esto aumenta la capacidad de calefacción a bajas temperaturas exteriores hasta un 30%, extendiendo el rango operativo de bombas de calor."
,
    question_en: "A scroll compressor with vapor injection technology has a third connected line. What is its purpose?",
    options_en: ["Return oil accumulated in the evaporator back to the compressor crankcase directly","Inject refrigerant vapor at intermediate pressure to increase heating capacity","Discharge excess pressure when the system operates under high temperature conditions","Provide additional cooling to the compressor motor during high-load operation"],
    explanation_en: "Vapor injection (EVI - Enhanced Vapor Injection) introduces refrigerant at intermediate pressure into the scroll compression chamber. This increases heating capacity at low outdoor temperatures by up to 30%, extending heat pump operating range."
  },
{
  category: "Compresores",
  q: "¿Por qué un compresor hermético que opera con alta relación de compresión tiene mayor riesgo de falla?",
  options: ["Porque el refrigerante se descompone químicamente a presiones extremadamente altas", "Porque la temperatura de descarga aumenta excesivamente degradando aceite y aislamiento del motor", "Porque los rodamientos no están diseñados para soportar alta presión diferencial", "Porque el gas de succión demasiado frío puede congelar las válvulas del compresor"],
  correct: 1,
  explanation: "Alta relación de compresión (alta descarga / baja succión) genera temperaturas de descarga extremas. Esto carboniza el aceite, degrada el aislamiento del devanado del motor, y puede causar descomposición química del refrigerante. Es común en días muy calientes con filtros sucios."
,
    question_en: "Why does a hermetic compressor operating with a high compression ratio have greater failure risk?",
    options_en: ["Because refrigerant decomposes chemically at extremely high pressures","Because discharge temperature increases excessively degrading oil and motor insulation","Because bearings are not designed to withstand high differential pressure","Because suction gas that is too cold can freeze the compressor valves"],
    explanation_en: "A high compression ratio (high discharge / low suction) generates extreme discharge temperatures. This carbonizes oil, degrades motor winding insulation, and can cause chemical decomposition of the refrigerant. It is common on very hot days with dirty filters."
  },
{
  category: "Compresores",
  q: "Un técnico nota que las líneas de succión y descarga de un compresor scroll están a la misma temperatura. ¿Qué indica esto?",
  options: ["El compresor está operando en modo de eficiencia máxima con compresión perfecta", "El compresor está girando en reversa o tiene válvula de descarga interna fallada", "El sistema tiene la carga de refrigerante exactamente al nivel especificado por fábrica", "La válvula de expansión está completamente abierta equilibrando las presiones del sistema"],
  correct: 1,
  explanation: "Si succión y descarga están a la misma temperatura, no hay compresión: el compresor gira en reversa (scroll desenganado) o la válvula de descarga interna está dañada, permitiendo bypass del gas sin comprimirse. El compresor opera pero no bombea refrigerante efectivamente."
,
    question_en: "A technician notices that the suction and discharge lines of a scroll compressor are at the same temperature. What does this indicate?",
    options_en: ["The compressor is operating at maximum efficiency with perfect compression","The compressor is running in reverse or has a failed internal discharge valve","The system has exactly the factory-specified refrigerant charge level","The expansion valve is completely open equalizing system pressures"],
    explanation_en: "If suction and discharge are at the same temperature, there is no compression: the compressor is running in reverse (scroll disengaged) or the internal discharge valve is damaged, allowing gas to bypass without being compressed. The compressor operates but does not pump refrigerant effectively."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un interruptor de alta presión se abre a 425 psi en un sistema R-410A. ¿Es este ajuste correcto para operación normal?",
  options: ["Sí, 425 psi es el rango normal de operación para alta presión en R-410A", "No, el ajuste es demasiado bajo ya que R-410A opera normalmente entre 350-500 psi", "Sí, pero solo durante los meses de invierno cuando las presiones son menores", "No, el ajuste es demasiado alto y debería ser máximo 350 psi para seguridad"],
  correct: 0,
  explanation: "R-410A opera a presiones significativamente más altas que R-22. La presión normal de descarga en días calientes puede alcanzar 400-450 psi. Un cut-out de 425 psi está dentro del rango razonable, aunque algunos fabricantes lo ajustan a 600-650 psi para evitar disparos innecesarios."
,
    question_en: "A high-pressure switch opens at 425 psi in an R-410A system. Is this setting correct for normal operation?",
    options_en: ["Yes, 425 psi is the normal high-pressure operating range for R-410A","No, the setting is too low since R-410A normally operates between 350-500 psi","Yes, but only during winter months when pressures are lower","No, the setting is too high and should be a maximum of 350 psi for safety"],
    explanation_en: "R-410A operates at significantly higher pressures than R-22. Normal discharge pressure on hot days can reach 400-450 psi. A 425 psi cut-out is within reasonable range, although some manufacturers set it at 600-650 psi to avoid unnecessary trips."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un interruptor de baja presión se dispara repetidamente en un sistema con R-22. La presión de succión cae a 50 psig. ¿Qué NO es causa probable?",
  options: ["Filtro de aire completamente obstruido reduciendo flujo de aire sobre el evaporador", "Ventilador del evaporador operando a velocidad incorrecta demasiado baja para la carga", "Válvula de expansión termostática sobrealimentando exceso de refrigerante al evaporador", "Carga baja de refrigerante causando que la presión de succión caiga excessivamente"],
  correct: 2,
  explanation: "Una TXV sobrealimentando enviaría EXCESO de refrigerante, lo que AUMENTARÍA la presión de succión, no la bajaría. Las otras opciones (filtro sucio, ventilador lento, baja carga) sí reducen la presión de succión al reducir la carga térmica sobre el evaporador o el refrigerante disponible."
,
    question_en: "A low-pressure switch trips repeatedly on an R-22 system. Suction pressure drops to 50 psig. What is NOT a probable cause?",
    options_en: ["Completely clogged air filter reducing airflow over the evaporator","Evaporator fan operating at an incorrect speed that is too low for the load","Thermostatic expansion valve overfeeding excess refrigerant to the evaporator","Low refrigerant charge causing suction pressure to drop excessively"],
    explanation_en: "A TXV overfeeding would send EXCESS refrigerant, which would INCREASE suction pressure, not lower it. The other options (dirty filter, slow fan, low charge) do reduce suction pressure by reducing thermal load on the evaporator or available refrigerant."
  },
{
  category: "HP/LP Pressure Switches",
  q: "¿Cuál es la diferencia entre el 'cut-out' y el 'cut-in' de un interruptor de presión y por qué existe esta diferencia?",
  options: ["Cut-out es cuando activa el compresor y cut-in es cuando lo desactiva al bajar presión", "Cut-out es cuando abre el circuito por presión anormal y cut-in es cuando permite el rearranque", "Son términos intercambiables que describen la misma función del interruptor en diferentes idiomas", "Cut-out es para alta presión únicamente y cut-in aplica solo para interruptores de baja presión"],
  correct: 1,
  explanation: "Cut-out es el punto donde el switch abre (desconecta) el circuito por condición anormal. Cut-in es donde cierra (reconecta) permitiendo rearranque. La diferencia entre ambos es el diferencial, que previene ciclado rápido on/off del compresor."
,
    question_en: "What is the difference between 'cut-out' and 'cut-in' of a pressure switch, and why does this difference exist?",
    options_en: ["Cut-out is when it activates the compressor and cut-in is when it deactivates it as pressure drops","Cut-out is when it opens the circuit due to abnormal pressure and cut-in is when it allows restart","They are interchangeable terms describing the same switch function in different languages","Cut-out is for high pressure only and cut-in applies only to low-pressure switches"],
    explanation_en: "Cut-out is the point where the switch opens (disconnects) the circuit due to an abnormal condition. Cut-in is where it closes (reconnects) allowing restart. The difference between both is the differential, which prevents rapid on/off compressor cycling."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un interruptor de alta presión con reset manual se disparó. Antes de resetear, ¿qué debe verificar el técnico primero?",
  options: ["Que el voltaje de alimentación del compresor sea el correcto según la placa de datos", "Que el condensador esté limpio, el ventilador funcione y no haya restricción en la descarga", "Que el nivel de refrigerante sea el correcto usando el método de pesado por báscula", "Que la válvula de expansión termostática esté ajustada al superheat especificado de fábrica"],
  correct: 1,
  explanation: "Alta presión se debe a incapacidad de rechazar calor. Antes de resetear, verificar: condensador limpio, ventilador operando correctamente, flujo de aire no obstruido, y que la válvula de descarga no esté cerrada. Resetear sin diagnosticar puede causar daño al compresor."
,
    question_en: "A manual-reset high-pressure switch has tripped. Before resetting, what should the technician verify first?",
    options_en: ["That the compressor supply voltage is correct per the data plate","That the condenser is clean, the fan works, and there is no discharge restriction","That the refrigerant level is correct using the weigh-in scale method","That the thermostatic expansion valve is adjusted to factory-specified superheat"],
    explanation_en: "High pressure is caused by inability to reject heat. Before resetting, verify: clean condenser, fan operating correctly, unobstructed airflow, and discharge valve not closed. Resetting without diagnosing can cause compressor damage."
  },
{
  category: "HP/LP Pressure Switches",
  q: "¿Por qué un interruptor de baja presión puede actuar como control de ciclo del compresor en sistemas con carga fija (orificio)?",
  options: ["Porque la baja presión indica que el termostato ha fallado y necesita respaldo automático", "Porque al satisfacerse la carga térmica la presión de succión baja naturalmente cortando el compresor", "Porque el orificio fijo requiere protección adicional que el termostato no puede proporcionar", "Porque la presión de succión sube cuando el ambiente se enfría indicando necesidad de apagar"],
  correct: 1,
  explanation: "En sistemas con orificio fijo, al enfriarse el espacio la carga térmica disminuye, la presión de succión baja, y el low pressure switch corta el compresor. Al calentarse el espacio, la presión sube y el switch reconecta. Funciona como termostato basado en presión/temperatura."
,
    question_en: "Why can a low-pressure switch act as compressor cycle control in fixed-orifice systems?",
    options_en: ["Because low pressure indicates the thermostat has failed and needs automatic backup","Because when the thermal load is satisfied, suction pressure drops naturally cutting the compressor","Because the fixed orifice requires additional protection that the thermostat cannot provide","Because suction pressure rises when the space cools indicating need to shut off"],
    explanation_en: "In fixed-orifice systems, as the space cools the thermal load decreases, suction pressure drops, and the low-pressure switch cuts the compressor. As the space warms, pressure rises and the switch reconnects. It functions as a pressure/temperature-based thermostat."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un sistema R-410A tiene presión de descarga de 600 psi en un día de 95°F. ¿Es esta condición normal?",
  options: ["Sí, R-410A normalmente alcanza 550-650 psi en días de alta temperatura ambiente", "No, indica condensador sucio, sobrecarga de refrigerante o ventilador deficiente", "Sí, siempre y cuando la presión de succión esté entre 150 y 200 psi simultáneamente", "No, 600 psi indica que el interruptor de alta presión está desconectado o puenteado"],
  correct: 1,
  explanation: "Para R-410A a 95°F, la presión de descarga esperada es aproximadamente 420-480 psi. 600 psi es excesivamente alto, indicando condensador sucio, sobrecarga de refrigerante, aire en el sistema, ventilador deficiente, o restricción en la línea de descarga."
,
    question_en: "An R-410A system has a discharge pressure of 600 psi on a 95°F day. Is this condition normal?",
    options_en: ["Yes, R-410A normally reaches 550-650 psi on high ambient temperature days","No, it indicates dirty condenser, refrigerant overcharge, or deficient fan","Yes, as long as suction pressure is between 150 and 200 psi simultaneously","No, 600 psi indicates the high-pressure switch is disconnected or jumped"],
    explanation_en: "For R-410A at 95°F, expected discharge pressure is approximately 420-480 psi. 600 psi is excessively high, indicating dirty condenser, refrigerant overcharge, air in the system, deficient fan, or restriction in the discharge line."
  },
{
  category: "HP/LP Pressure Switches",
  q: "¿Cuál es el riesgo de puentear (bypass) un interruptor de alta presión para mantener el sistema operando?",
  options: ["El compresor consume menos energía al operar sin la resistencia del switch en el circuito", "La presión puede subir sin límite causando falla catastrófica del compresor o ruptura de tuberías", "El sistema operará con mayor eficiencia al eliminar los ciclos cortos de protección frecuentes", "El único riesgo es que la garantía del fabricante se invalida pero el equipo opera normalmente"],
  correct: 1,
  explanation: "Sin protección de alta presión, la presión puede escalar hasta causar: falla mecánica del compresor, ruptura de líneas o serpentín, liberación violenta de refrigerante, e incluso explosión. Es extremadamente peligroso y viola todos los códigos de seguridad."
,
    question_en: "What is the risk of bypassing a high-pressure switch to keep the system operating?",
    options_en: ["The compressor consumes less energy operating without the switch resistance in the circuit","Pressure can rise without limit causing catastrophic compressor failure or pipe rupture","The system will operate more efficiently by eliminating frequent short protection cycles","The only risk is voiding the manufacturer warranty but the equipment operates normally"],
    explanation_en: "Without high-pressure protection, pressure can escalate to cause: mechanical compressor failure, line or coil rupture, violent refrigerant release, and even explosion. It is extremely dangerous and violates all safety codes."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un interruptor de baja presión tiene cut-out de 30 psi y diferencial de 25 psi en un sistema R-22. ¿A qué presión se reconecta?",
  options: ["55 psi sumando el cut-out más el diferencial del interruptor configurado", "5 psi restando el diferencial del punto de cut-out del interruptor de presión", "30 psi ya que el switch se reconecta al mismo punto donde se desconectó inicialmente", "75 psi que es el doble del diferencial más el cut-out del interruptor calibrado"],
  correct: 0,
  explanation: "Cut-in = Cut-out + Diferencial. Para baja presión: 30 psi + 25 psi = 55 psi. El switch abre a 30 psi (bajando) y cierra a 55 psi (subiendo). El diferencial de 25 psi previene ciclado rápido, dando tiempo a que las presiones se estabilicen."
,
    question_en: "A low-pressure switch has a cut-out of 30 psi and a differential of 25 psi on an R-22 system. At what pressure does it reconnect?",
    options_en: ["55 psi adding the cut-out plus the configured switch differential","5 psi subtracting the differential from the switch cut-out point","30 psi since the switch reconnects at the same point where it disconnected","75 psi which is double the differential plus the calibrated switch cut-out"],
    explanation_en: "Cut-in = Cut-out + Differential. For low pressure: 30 psi + 25 psi = 55 psi. The switch opens at 30 psi (dropping) and closes at 55 psi (rising). The 25 psi differential prevents rapid cycling, allowing time for pressures to stabilize."
  },
{
  category: "HP/LP Pressure Switches",
  q: "¿Por qué un sistema con fuga lenta de refrigerante puede operar normalmente durante el día pero disparar el switch de baja presión durante la noche?",
  options: ["Porque la presión de succión nocturna sube por condensación del refrigerante en las líneas", "Porque la temperatura nocturna reduce la carga térmica y presión de succión ya marginal por la fuga", "Porque el voltaje eléctrico baja durante la noche afectando la lectura del switch de presión", "Porque la humedad nocturna congela el evaporador bloqueando el flujo de aire completamente"],
  correct: 1,
  explanation: "Con fuga lenta, la carga es marginalmente baja. De día, la alta carga térmica mantiene presión de succión aceptable. De noche, la menor carga térmica (menor temperatura) reduce la presión de succión lo suficiente para alcanzar el cut-out del switch."
,
    question_en: "Why can a system with a slow refrigerant leak operate normally during the day but trip the low-pressure switch at night?",
    options_en: ["Because nighttime suction pressure rises from refrigerant condensation in the lines","Because nighttime temperature reduces thermal load and suction pressure already marginal from the leak","Because electrical voltage drops at night affecting the pressure switch reading","Because nighttime humidity freezes the evaporator completely blocking airflow"],
    explanation_en: "With a slow leak, the charge is marginally low. During the day, the high thermal load keeps suction pressure acceptable. At night, the lower thermal load (lower temperature) reduces suction pressure enough to reach the switch cut-out point."
  },
{
  category: "HP/LP Pressure Switches",
  q: "En un sistema de bomba de calor en modo calefacción, ¿qué rol juega el interruptor de baja presión comparado con modo enfriamiento?",
  options: ["Funciona exactamente igual porque monitorea el mismo lado de succión del compresor", "Puede necesitar ajuste diferente ya que las presiones de succión en calefacción son menores que en enfriamiento", "No se utiliza en modo calefacción porque se sustituye por el sensor de descongelamiento", "Se invierte automáticamente para monitorear alta presión cuando la válvula reversible cambia"],
  correct: 1,
  explanation: "En modo calefacción, el evaporador es la unidad exterior expuesta a bajas temperaturas, generando presiones de succión significativamente menores que en enfriamiento. El LP switch puede necesitar un ajuste más bajo para evitar disparos innecesarios durante operación normal en frío."
,
    question_en: "In a heat pump in heating mode, what role does the low-pressure switch play compared to cooling mode?",
    options_en: ["It functions exactly the same because it monitors the same suction side of the compressor","It may need a different setting since suction pressures in heating are lower than in cooling","It is not used in heating mode because it is replaced by the defrost sensor","It automatically reverses to monitor high pressure when the reversing valve changes"],
    explanation_en: "In heating mode, the evaporator is the outdoor unit exposed to low temperatures, generating significantly lower suction pressures than in cooling. The LP switch may need a lower setting to avoid unnecessary trips during normal cold-weather operation."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un técnico instala un interruptor de presión dual (HP/LP combinado). ¿Cómo están configurados internamente los contactos?",
  options: ["Los contactos HP y LP están en paralelo para que cualquiera pueda detener el compresor solo", "Los contactos HP y LP están en serie de modo que al abrir cualquiera se corta el circuito completo", "El HP tiene contacto normalmente cerrado y el LP tiene contacto normalmente abierto en paralelo", "Los contactos se alternan automáticamente según el modo de operación del sistema HVAC actual"],
  correct: 1,
  explanation: "En un switch dual, los contactos de HP y LP están en serie en el circuito de control. Si cualquiera de los dos se abre (HP por alta presión o LP por baja presión), el circuito se interrumpe y el compresor se desactiva. Ambas protecciones son independientes pero en serie."
,
    question_en: "A technician installs a dual pressure switch (HP/LP combined). How are the contacts configured internally?",
    options_en: ["The HP and LP contacts are in parallel so that either one can stop the compressor alone","The HP and LP contacts are in series so that opening either one breaks the complete circuit","The HP has a normally closed contact and the LP has a normally open contact in parallel","The contacts alternate automatically according to the current HVAC system operating mode"],
    explanation_en: "In a dual switch, the HP and LP contacts are in series in the control circuit. If either one opens (HP due to high pressure or LP due to low pressure), the circuit is interrupted and the compressor is deactivated. Both protections are independent but wired in series."
  },
{
  category: "HP/LP Pressure Switches",
  q: "¿Qué indica si el interruptor de alta presión de un condensador se dispara inmediatamente después de cada arranque del compresor?",
  options: ["El interruptor de presión está defectuoso y necesita reemplazo por uno nuevo calibrado", "Hay gas no condensable (aire) atrapado en el sistema que eleva la presión instantáneamente", "El compresor tiene una válvula de descarga interna que no está sellando correctamente", "El contactor del compresor tiene contactos que están haciendo rebote eléctrico constante"],
  correct: 1,
  explanation: "Aire u otros gases no condensables atrapados en el lado de alta presión elevan la presión de descarga por encima de lo normal casi instantáneamente al arrancar. Estos gases no se condensan y ocupan espacio, elevando la presión total rápidamente al comenzar la compresión."
,
    question_en: "What does it indicate if a condenser's high-pressure switch trips immediately after each compressor start?",
    options_en: ["The pressure switch is defective and needs replacement with a new calibrated one","There is non-condensable gas (air) trapped in the system that raises pressure instantly","The compressor has an internal discharge valve that is not sealing properly","The compressor contactor has contacts that are constantly bouncing electrically"],
    explanation_en: "Air or other non-condensable gases trapped on the high-pressure side raise discharge pressure above normal almost instantly at startup. These gases do not condense and occupy space, rapidly elevating total pressure as compression begins."
  },
{
  category: "HP/LP Pressure Switches",
  q: "Un sistema comercial tiene un transductor de presión en lugar de un switch mecánico. ¿Cuál es la ventaja del transductor?",
  options: ["Es más económico y fácil de instalar que un interruptor mecánico convencional", "Proporciona lectura continua de presión al controlador permitiendo respuesta proporcional gradual", "No requiere calibración ni mantenimiento durante toda la vida útil del equipo instalado", "Puede medir tanto presión positiva como vacío simultáneamente en el mismo puerto de conexión"],
  correct: 1,
  explanation: "Un transductor envía señal continua (4-20mA o 0-5V DC) proporcional a la presión. Esto permite al controlador monitorear tendencias, ajustar velocidad del compresor gradualmente, anticipar problemas, y registrar datos, versus el switch mecánico que solo tiene dos estados: abierto o cerrado."
,
    question_en: "A commercial system has a pressure transducer instead of a mechanical switch. What is the advantage of the transducer?",
    options_en: ["It is more economical and easier to install than a conventional mechanical switch","It provides continuous pressure reading to the controller allowing gradual proportional response","It requires no calibration or maintenance throughout the equipment's installed lifetime","It can measure both positive pressure and vacuum simultaneously on the same connection port"],
    explanation_en: "A transducer sends a continuous signal (4-20mA or 0-5V DC) proportional to pressure. This allows the controller to monitor trends, gradually adjust compressor speed, anticipate problems, and log data, versus the mechanical switch which only has two states: open or closed."
  },
{
  category: "Refrigeración Avanzada",
  q: "Un sistema R-410A muestra 8°F de subenfriamiento y 3°F de sobrecalentamiento. ¿Qué condición indica esta combinación?",
  options: ["El sistema tiene la carga de refrigerante exactamente al nivel correcto especificado", "El sistema está sobrealimentando: demasiado refrigerante líquido llegando al evaporador", "Indica restricción en la línea de líquido que causa flash gas antes del dispositivo metering", "La válvula de expansión está ajustada perfectamente para máxima eficiencia del sistema"],
  correct: 1,
  explanation: "Subenfriamiento normal es 10-15°F y sobrecalentamiento normal es 8-12°F para R-410A. Subenfriamiento bajo (8°F) con sobrecalentamiento muy bajo (3°F) indica que la TXV o el sistema está sobrealimentando, enviando demasiado refrigerante líquido al evaporador, riesgo de flood-back."
,
    question_en: "An R-410A system shows 8°F of subcooling and 3°F of superheat. What condition does this combination indicate?",
    options_en: ["The system has exactly the correct specified refrigerant charge level","The system is overfeeding: too much liquid refrigerant reaching the evaporator","Indicates a restriction in the liquid line causing flash gas before the metering device","The expansion valve is perfectly adjusted for maximum system efficiency"],
    explanation_en: "Normal subcooling is 10-15°F and normal superheat is 8-12°F for R-410A. Low subcooling (8°F) with very low superheat (3°F) indicates the TXV or system is overfeeding, sending too much liquid refrigerant to the evaporator, risking flood-back."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Qué ocurre si una válvula de expansión termostática (TXV) pierde la carga del bulbo sensor?",
  options: ["La válvula se abre completamente inundando el evaporador con refrigerante líquido", "La válvula se cierra completamente cortando el flujo de refrigerante al evaporador", "La válvula se queda en la posición donde estaba cuando perdió la carga exactamente", "La válvula oscila erráticamente entre abierta y cerrada causando fluctuación de presiones"],
  correct: 1,
  explanation: "La carga del bulbo proporciona la fuerza de apertura contra el resorte de superheat. Sin carga, no hay presión de apertura, y el resorte cierra la válvula completamente. El evaporador se queda sin refrigerante (starved), la presión de succión baja drásticamente y el compresor puede dañarse."
,
    question_en: "What happens if a thermostatic expansion valve (TXV) loses its sensing bulb charge?",
    options_en: ["The valve opens completely flooding the evaporator with liquid refrigerant","The valve closes completely cutting off refrigerant flow to the evaporator","The valve stays in the position it was in when it lost the charge exactly","The valve oscillates erratically between open and closed causing pressure fluctuation"],
    explanation_en: "The bulb charge provides the opening force against the superheat spring. Without charge, there is no opening pressure, and the spring closes the valve completely. The evaporator is starved of refrigerant, suction pressure drops drastically, and the compressor can be damaged."
  },
{
  category: "Refrigeración Avanzada",
  q: "Un sistema R-410A tiene sobrecalentamiento de 25°F en la succión. ¿Qué problema indica y cuál es la consecuencia?",
  options: ["Indica evaporador funcionando eficientemente con todo el refrigerante evaporándose antes de la salida", "Indica restricción de flujo o baja carga, causando que el compresor se sobrecaliente por falta de enfriamiento", "Indica exceso de refrigerante que necesita ser recuperado para alcanzar el superheat correcto", "Indica que el ventilador del evaporador está moviendo demasiado aire sobre el serpentín frío"],
  correct: 1,
  explanation: "25°F de sobrecalentamiento es excesivo (normal 8-12°F). Indica que el refrigerante se evapora completamente muy temprano en el evaporador, y el gas se sobrecalienta excesivamente. El gas caliente no enfría adecuadamente el compresor, arriesgando sobrecalentamiento del motor y falla prematura."
,
    question_en: "An R-410A system has 25°F superheat at suction. What problem does this indicate and what is the consequence?",
    options_en: ["Indicates the evaporator is functioning efficiently with all refrigerant evaporating before the outlet","Indicates flow restriction or low charge, causing the compressor to overheat from lack of cooling","Indicates excess refrigerant that needs to be recovered to reach the correct superheat","Indicates the evaporator fan is moving too much air over the cold coil"],
    explanation_en: "25°F superheat is excessive (normal 8-12°F). It indicates the refrigerant evaporates completely very early in the evaporator, and the gas overheats excessively. The hot gas does not adequately cool the compressor, risking motor overheating and premature failure."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Por qué el subenfriamiento es el método preferido para verificar la carga en sistemas con TXV?",
  options: ["Porque el subenfriamiento es más fácil de medir que el sobrecalentamiento en cualquier sistema", "Porque la TXV controla el sobrecalentamiento automáticamente, haciéndolo inadecuado para verificar carga", "Porque el subenfriamiento no varía con las condiciones ambientales del entorno exterior", "Porque los manómetros de alta presión son más precisos que los de baja presión para medición"],
  correct: 1,
  explanation: "La TXV ajusta automáticamente el flujo para mantener sobrecalentamiento constante (~10-12°F) independientemente de la carga. Por eso el sobrecalentamiento no refleja nivel de carga. El subenfriamiento SÍ cambia con la carga: más refrigerante = más subenfriamiento, menos = menos subenfriamiento."
,
    question_en: "Why is subcooling the preferred method for verifying charge in systems with a TXV?",
    options_en: ["Because subcooling is easier to measure than superheat on any system","Because the TXV automatically controls superheat, making it inadequate for verifying charge","Because subcooling does not vary with outdoor ambient conditions","Because high-pressure gauges are more accurate than low-pressure gauges for measurement"],
    explanation_en: "The TXV automatically adjusts flow to maintain constant superheat (~10-12°F) regardless of charge. That is why superheat does not reflect charge level. Subcooling DOES change with charge: more refrigerant = more subcooling, less = less subcooling."
  },
{
  category: "Refrigeración Avanzada",
  q: "Un sistema con orificio fijo tiene presión de succión normal pero subenfriamiento de 3°F. ¿Qué significa esta lectura?",
  options: ["La carga de refrigerante está exactamente al nivel correcto para la condición operativa", "El sistema tiene baja carga de refrigerante y se debe agregar más para alcanzar subenfriamiento correcto", "El condensador está extremadamente limpio y eficiente, enfriando el refrigerante casi perfectamente", "La temperatura ambiente es demasiado baja para operación normal del equipo de enfriamiento"],
  correct: 1,
  explanation: "En un orificio fijo, subenfriamiento de 3°F (normal es 10-18°F) con presión de succión aparentemente normal puede indicar baja carga. El refrigerante líquido sale del condensador con poco subenfriamiento, indicando que no hay suficiente refrigerante líquido sellando la salida del condensador."
,
    question_en: "A fixed-orifice system has normal suction pressure but subcooling of 3°F. What does this reading mean?",
    options_en: ["The refrigerant charge is exactly at the correct level for the operating condition","The system has low refrigerant charge and more should be added to reach correct subcooling","The condenser is extremely clean and efficient, cooling the refrigerant almost perfectly","The ambient temperature is too low for normal cooling equipment operation"],
    explanation_en: "In a fixed orifice, subcooling of 3°F (normal is 10-18°F) with apparently normal suction pressure may indicate low charge. The liquid refrigerant leaves the condenser with little subcooling, indicating insufficient liquid refrigerant sealing the condenser outlet."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Qué es el 'flash gas' y en qué punto del sistema de refrigeración ocurre indeseablemente?",
  options: ["Gas que se forma en el condensador cuando el ventilador no funciona correctamente", "Evaporación prematura de refrigerante líquido en la línea de líquido antes del dispositivo de expansión", "Gas de alta presión que sale de la válvula de descarga del compresor a gran velocidad", "Refrigerante que se acumula en la parte superior del recibidor de líquido del sistema"],
  correct: 1,
  explanation: "Flash gas es la evaporación prematura de refrigerante en la línea de líquido, antes de llegar al dispositivo de expansión. Ocurre por caída de presión excesiva (línea larga, restricción, elevación vertical) o subenfriamiento insuficiente. Reduce la capacidad del evaporador al llegar menos líquido."
,
    question_en: "What is 'flash gas' and at what point in the refrigeration system does it occur undesirably?",
    options_en: ["Gas that forms in the condenser when the fan does not work correctly","Premature evaporation of liquid refrigerant in the liquid line before the expansion device","High-pressure gas exiting the compressor discharge valve at high velocity","Refrigerant that accumulates at the top of the system liquid receiver"],
    explanation_en: "Flash gas is the premature evaporation of refrigerant in the liquid line before reaching the expansion device. It occurs due to excessive pressure drop (long line, restriction, vertical rise) or insufficient subcooling. It reduces evaporator capacity as less liquid arrives."
  },
{
  category: "Refrigeración Avanzada",
  q: "En una bomba de calor durante el ciclo de descongelamiento, ¿por qué el ventilador del condensador exterior se apaga?",
  options: ["Para reducir el ruido durante el ciclo de descongelamiento que es de corta duración", "Para evitar que el aire frío exterior absorba el calor de la descarga que debe derretir el hielo", "Para proteger el motor del ventilador contra daño por vibración del hielo que se desprende", "Para reducir el consumo eléctrico total del sistema durante el ciclo adicional de descongelamiento"],
  correct: 1,
  explanation: "Durante descongelamiento, la válvula reversible envía gas caliente al serpentín exterior (ahora actúa como condensador). Si el ventilador operara, el aire frío robaría el calor necesario para derretir el hielo. Se apaga para que todo el calor del gas se transfiera al hielo acumulado."
,
    question_en: "In a heat pump during the defrost cycle, why does the outdoor condenser fan turn off?",
    options_en: ["To reduce noise during the defrost cycle which is of short duration","To prevent cold outdoor air from absorbing the discharge heat needed to melt ice","To protect the fan motor against damage from vibration of breaking ice","To reduce total electrical consumption during the additional defrost cycle"],
    explanation_en: "During defrost, the reversing valve sends hot gas to the outdoor coil (now acting as a condenser). If the fan ran, cold air would steal the heat needed to melt the ice. It shuts off so all gas heat transfers to the accumulated ice."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Cuál es el efecto de aire no condensable (NCG) atrapado en el lado de alta presión del sistema de refrigeración?",
  options: ["Reduce la capacidad de enfriamiento al diluir el refrigerante en el lado de baja presión", "Eleva la presión de descarga artificialmente y aumenta la carga del compresor sin agregar capacidad", "Causa congelamiento en el dispositivo de medición bloqueando el flujo de refrigerante líquido", "Reduce la presión de succión porque los gases se acumulan en la entrada del compresor hermético"],
  correct: 1,
  explanation: "El aire y otros NCG no se condensan, ocupando espacio en el condensador y elevando la presión de descarga (presión parcial de Dalton). Esto aumenta la relación de compresión, el trabajo del compresor, la temperatura de descarga, y reduce la eficiencia sin aportar capacidad de enfriamiento."
,
    question_en: "What is the effect of non-condensable gas (NCG) trapped on the high-pressure side of the refrigeration system?",
    options_en: ["Reduces cooling capacity by diluting refrigerant on the low-pressure side","Artificially raises discharge pressure and increases compressor load without adding capacity","Causes freezing at the metering device blocking liquid refrigerant flow","Reduces suction pressure because gases accumulate at the hermetic compressor inlet"],
    explanation_en: "Air and other NCGs do not condense, occupying space in the condenser and raising discharge pressure (Dalton's law of partial pressures). This increases compression ratio, compressor work, discharge temperature, and reduces efficiency without contributing cooling capacity."
  },
{
  category: "Refrigeración Avanzada",
  q: "Un técnico encuentra que la línea de succión de un sistema está sudando hasta la entrada del compresor. ¿Qué condición indica?",
  options: ["Operación perfectamente normal con buena carga de refrigerante en el sistema instalado", "Sobrecalentamiento bajo o flood-back con refrigerante líquido retornando al compresor peligrosamente", "Aislamiento insuficiente en la línea de succión que necesita ser reemplazado inmediatamente", "Alta humedad ambiental causando condensación normal en la superficie de la tubería fría"],
  correct: 1,
  explanation: "Sudoración de la línea de succión hasta el compresor indica que el refrigerante líquido no se evapora completamente en el evaporador y viaja por la succión. Esto es flood-back (sobrecalentamiento bajo/negativo) que puede causar slugging y daño mecánico a las válvulas o espirales del compresor."
,
    question_en: "A technician finds that a system's suction line is sweating all the way to the compressor inlet. What condition does this indicate?",
    options_en: ["Perfectly normal operation with good refrigerant charge in the installed system","Low superheat or flood-back with liquid refrigerant dangerously returning to the compressor","Insufficient insulation on the suction line that needs immediate replacement","High ambient humidity causing normal condensation on the cold pipe surface"],
    explanation_en: "Suction line sweating all the way to the compressor indicates that liquid refrigerant is not completely evaporating in the evaporator and traveling through the suction line. This is flood-back (low/negative superheat) that can cause slugging and mechanical damage to compressor valves or scrolls."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Cuál es la ventaja principal de usar un EEV (válvula de expansión electrónica) sobre una TXV mecánica en un sistema inverter?",
  options: ["Es más económica y simple de instalar que una válvula TXV mecánica convencional", "Puede ajustar el flujo bidireccional y responder a cambios de carga más rápido que la TXV", "No requiere conexión eléctrica ni sensor de temperatura para su operación automática", "Tiene mayor durabilidad porque no tiene partes mecánicas internas que se desgasten"],
  correct: 1,
  explanation: "La EEV es controlada por microprocesador con motor paso a paso, respondiendo en segundos vs minutos de la TXV. Puede operar bidireccionalmente (bomba de calor), ajustar flujo para amplio rango de velocidades del compresor inverter, y optimizar superheat en tiempo real."
,
    question_en: "What is the main advantage of using an EEV (electronic expansion valve) over a mechanical TXV in an inverter system?",
    options_en: ["It is more economical and simpler to install than a conventional mechanical TXV","It can adjust flow bidirectionally and respond to load changes faster than a TXV","It requires no electrical connection or temperature sensor for automatic operation","It has greater durability because it has no internal mechanical parts that wear out"],
    explanation_en: "The EEV is controlled by a microprocessor with a stepper motor, responding in seconds vs. minutes for a TXV. It can operate bidirectionally (heat pump), adjust flow for a wide range of inverter compressor speeds, and optimize superheat in real time."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Por qué una restricción parcial en el filtro deshidratador causa burbujeo en el visor de líquido aunque la carga sea correcta?",
  options: ["Porque las burbujas indican que el refrigerante está correctamente mezclado con el aceite", "Porque la caída de presión a través de la restricción causa flash gas antes del visor de líquido", "Porque el filtro deshidratador saturado libera humedad que aparece como burbujas en el visor", "Porque la restricción acelera el flujo del refrigerante creando turbulencia visible en el visor"],
  correct: 1,
  explanation: "La restricción en el filtro causa caída de presión antes del visor. Esta caída reduce la presión del líquido por debajo de su punto de saturación, causando evaporación parcial (flash gas) que aparece como burbujas. La temperatura en la línea también mostrará diferencia antes y después de la restricción."
,
    question_en: "Why does a partial restriction in the filter drier cause bubbling in the sight glass even though the charge is correct?",
    options_en: ["Because the bubbles indicate the refrigerant is properly mixed with oil","Because the pressure drop across the restriction causes flash gas before the sight glass","Because the saturated filter drier releases moisture that appears as bubbles in the sight glass","Because the restriction accelerates refrigerant flow creating visible turbulence in the sight glass"],
    explanation_en: "The restriction in the filter causes a pressure drop before the sight glass. This drop reduces liquid pressure below its saturation point, causing partial evaporation (flash gas) that appears as bubbles. The line temperature will also show a difference before and after the restriction."
  },
{
  category: "Refrigeración Avanzada",
  q: "Un sistema R-410A tiene subenfriamiento de 22°F y sobrecalentamiento de 15°F. La presión de alta está elevada. ¿Qué condición sugiere?",
  options: ["Sistema perfectamente cargado con excelente rendimiento en condiciones de alta temperatura", "Sistema sobrecargado con exceso de refrigerante acumulándose en el condensador y elevando la presión", "Condensador sucio que impide la transferencia de calor pero con carga de refrigerante correcta", "Válvula de expansión parcialmente cerrada restringiendo flujo y causando acumulación en la alta"],
  correct: 1,
  explanation: "Subenfriamiento alto (22°F vs 10-15°F normal) con presión alta indica sobrecarga. El exceso de refrigerante líquido sella excesivamente la salida del condensador (alto subenfriamiento) y ocupa espacio que reduce el área de condensación, elevando la presión. El sobrecalentamiento alto indica que la TXV no puede compensar totalmente."
,
    question_en: "An R-410A system has 22°F subcooling and 15°F superheat. High-side pressure is elevated. What condition does this suggest?",
    options_en: ["A perfectly charged system with excellent performance under high temperature conditions","An overcharged system with excess refrigerant accumulating in the condenser and raising pressure","A dirty condenser preventing heat transfer but with correct refrigerant charge","A partially closed expansion valve restricting flow and causing accumulation on the high side"],
    explanation_en: "High subcooling (22°F vs. normal 10-15°F) with high pressure indicates overcharge. Excess liquid refrigerant excessively seals the condenser outlet (high subcooling) and occupies space that reduces condensing area, raising pressure. The high superheat indicates the TXV cannot fully compensate."
  },
{
  category: "Refrigeración Avanzada",
  q: "¿Qué método se usa para determinar la carga correcta de refrigerante cuando no hay visor de líquido, ni subenfriamiento/sobrecalentamiento especificados por el fabricante?",
  options: ["Se carga por presión de succión hasta alcanzar la temperatura de evaporación deseada según la aplicación", "Se carga por peso exacto según la especificación de la placa de datos del equipo usando báscula", "Se agrega refrigerante hasta que las líneas de succión y líquido alcancen temperaturas estándar de la industria", "Se carga hasta eliminar burbujas en la línea de líquido y luego se agrega media libra adicional"],
  correct: 1,
  explanation: "El método más preciso cuando no hay otros parámetros es cargar por peso (gravimétrico) según la especificación de fábrica en la placa de datos. Se evacúa el sistema completamente y se carga la cantidad exacta medida con báscula electrónica de refrigerante. Es el único método que no depende de condiciones ambientales."
,
    question_en: "What method is used to determine the correct refrigerant charge when there is no sight glass, and no subcooling/superheat is specified by the manufacturer?",
    options_en: ["Charge by suction pressure until reaching the desired evaporation temperature for the application","Charge by exact weight per the data plate specification using a scale","Add refrigerant until suction and liquid lines reach industry standard temperatures","Charge until bubbles disappear in the liquid line and then add an extra half pound"],
    explanation_en: "The most precise method when no other parameters are available is charging by weight (gravimetric) per the factory specification on the data plate. The system is fully evacuated and the exact amount measured with an electronic refrigerant scale is charged. It is the only method independent of ambient conditions."
  }
]

};
