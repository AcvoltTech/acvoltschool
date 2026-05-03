// ============================================================
// ACVOLT BUSINESS ACADEMY — BLOQUE 1: FUNDAMENTOS TECNICOS
// Curriculum de 52 semanas, Semanas 1-8
// Autor: Mario Flores / ACVOLT
// ============================================================

window.CONTRACTOR_BLOQUE_1 = {
  number: 1,
  title: 'Fundamentos Tecnicos',
  tagline: 'Dominar Manual J/S/D antes de firmar tu primer contrato',

  intro: `
    <p><strong>Escuchame bien porque esto te va a ahorrar $50,000 en errores.</strong> El 90% de los contratistas latinos que empiezan en HVAC en Estados Unidos fracasan en los primeros 3 anos — no por falta de trabajo, sino porque nadie les ensenio los <em>fundamentos tecnicos</em> antes de ensenarles a vender. Instalan sistemas de 4 toneladas donde necesitaban 2.5, cablean ductos de 14 pulgadas donde pedian 18, y cuando el cliente llama por humedad, ruido o facturas altisimas, el contratista no sabe diagnosticar porque nunca entendio el diseno.</p>

    <p>Bloque 1 es el <strong>piso minimo</strong>. Aqui vas a aprender Manual J (carga), Manual S (seleccion) y Manual D (ductos) — las tres normas ACCA que rigen el diseno residencial en USA y que <em>la mayoria de contratistas mexicanos, centroamericanos y sudamericanos nunca estudian formalmente</em>. Tambien vas a entender como funcionan los dealer programs de Carrier, Trane, Lennox y Rheem — y por que firmar con ellos sin saber lo que estas haciendo te puede costar $20-50K al ano en cuotas y restricciones.</p>

    <p>No es contenido de YouTube. Es lo que un contratista de 20 anos de experiencia le ensena a su hijo antes de heredarle el negocio. Leelo, subraya, y vuelve. Cada seccion tiene <strong>checklist de campo</strong>, <strong>errores comunes</strong> que ya cometiste o vas a cometer, y <strong>real talk</strong> — lo que no te dicen en los seminarios de los dealers.</p>

    <p><em>Si terminas Bloque 1 y no puedes explicarle Manual J a un cliente en 3 minutos, no estas listo para Bloque 2. Punto.</em></p>
  `,

  sections: [

    // ========================================================
    // SECCION 1: MANUAL J
    // ========================================================
    {
      id: 'manual-j',
      heading: 'Manual J — Calculo de Carga Real',
      body: `
        <p><strong>Manual J</strong> es la norma ACCA (Air Conditioning Contractors of America) que define como calcular la <em>heat load</em> (carga termica) de una casa residencial. La octava edicion (Manual J 8th Edition, ACCA/ANSI 310) es el estandar que exige el codigo IECC en casi todos los estados y que piden los building departments cuando sacas permiso.</p>

        <p>La idea es simple de decir, dificil de hacer bien: <strong>calcular cuantos BTU/hora pierde cada habitacion en invierno (heating load) y cuantos gana en verano (cooling load)</strong>, considerando orientacion solar, tipo de ventanas, infiltracion, aislamiento, cielo raso, ductos en atico, numero de ocupantes y gadgets electricos. El resultado te dice <em>exactamente</em> que tonelaje necesita el sistema — no 3 toneladas porque "la casa se ve de 3 toneladas", sino <strong>2.73 toneladas reales</strong> y tu decides si subes a 3 ton o bajas a 2.5 ton segun Manual S.</p>

        <p>El calculo se hace <strong>habitacion por habitacion</strong> (room-by-room), no por totales de casa. ?Por que? Porque si solo calculas el total, no sabes cuanto CFM mandar a cada cuarto — y sin CFM por cuarto no puedes hacer Manual D. Es la cadena: <strong>Manual J → Manual S → Manual D</strong>. Si brincas uno, los otros dos estan mal.</p>

        <p><strong>Variables clave que tienes que medir en campo:</strong></p>
        <ul>
          <li><strong>Area exterior por habitacion</strong> — paredes que dan al exterior, no paredes internas</li>
          <li><strong>U-factor de ventanas</strong> — ventana doble Low-E tiene U=0.30, ventana sencilla de 1970 tiene U=1.10. Diferencia: 3.6x mas perdida</li>
          <li><strong>Orientacion</strong> — ventana oeste en Texas gana 2.5x mas calor que ventana norte a las 4pm</li>
          <li><strong>Infiltracion (ACH50)</strong> — mide con blower door; casa nueva codigo 2021 = 3 ACH50, casa 1960 sin sellar = 15+ ACH50</li>
          <li><strong>R-value del atico y paredes</strong> — R-38 vs R-19 es el doble de perdida</li>
          <li><strong>Ubicacion de ductos</strong> — ducto en atico no aislado pierde 20-30% de capacidad</li>
          <li><strong>Infiltracion por duct leakage</strong> — Duct Blaster test, objetivo <6% total leakage</li>
        </ul>

        <p><strong>Formula basica de sensible cooling load</strong> (resumida, no para examen):</p>
        <p><em>Q_sensible = U · A · CLTD + SHGC · A · SC · CLF + infiltracion_CFM · 1.08 · ΔT + ganancia_interna</em></p>

        <p>No necesitas memorizar la ecuacion — necesitas <strong>software que la corra bien</strong>: Wrightsoft Right-J, Elite RHVAC, Cool Calc, o al menos una hoja de Excel basada en Manual J 8. Nunca calcules a mano en produccion, pero si debes entender <em>que variables maneja el software</em> para no confiar ciegamente.</p>

        <p>Un Manual J bien hecho toma <strong>2-4 horas</strong> para una casa de 2,000 sqft. Si lo vendes a $250-500, es rentable y te separa del contratista de "regla del pulgar" que cotiza gratis en 10 minutos y despues pone el tonelaje equivocado. El <em>builder inteligente</em> ya sabe que el contratista que cobra por Manual J es el que no le va a traer problemas de garantia despues.</p>
      `,
      keyPoints: [
        'Manual J 8th Edition es el estandar ACCA/ANSI 310 y lo exigen los building departments',
        'Calculo es room-by-room, no por totales — sin CFM por cuarto no puedes disenar ductos',
        'Las tres variables que mas mueven el resultado: ventanas (U-factor + SHGC + orientacion), infiltracion (ACH50) y ubicacion de ductos',
        'Software obligatorio: Wrightsoft Right-J, Elite RHVAC, o Cool Calc (este ultimo tiene plan gratis para casas pequenas)',
        'Un Manual J bien hecho toma 2-4 horas y se cobra $250-500 al cliente o builder',
        'Nunca uses "regla del pulgar" (ton por cada 500-600 sqft) — es un error de 30-50% tipicamente',
        'El Manual J debe entregarse impreso, firmado, con sello del software y guardarse 10 anos para garantias'
      ],
      realTalk: 'Si cotizas por "pulgar" y pones 4 toneladas donde Manual J pedia 2.5, acabas de regalar $1,500 en equipo sobredimensionado, humedad alta que te va a generar 3 callbacks, y el cliente va a pagar $60-80 mensuales de mas en luz. Y lo peor: el dealer te va a echar la culpa.',
      checklist: [
        { item: 'Medir area exterior por habitacion con laser (Bosch GLM 50)', note: 'Nunca confies en los planos del builder — estan mal el 40% del tiempo' },
        { item: 'Identificar U-factor y SHGC de cada ventana', note: 'Busca la etiqueta NFRC en el marco, o pregunta al builder el modelo' },
        { item: 'Medir orientacion con brujula o Google Maps satelital', note: 'Norte/Sur/Este/Oeste cambia cooling load hasta 30%' },
        { item: 'Hacer blower door test si es retrofit', note: 'Retell ACH50 real, no el "asumido" del software' },
        { item: 'Verificar R-value del atico fisicamente', note: 'Sube al atico con regla — no creas al inspector' },
        { item: 'Contar ocupantes y electronica', note: 'Cada persona = 230 BTU/h sensible; TV 55" = 150W' },
        { item: 'Documentar ubicacion y condicion de ductos existentes', note: 'Si estan en atico sin aislar, ya perdiste 20% de capacidad' },
        { item: 'Correr software y revisar que CFM por cuarto cuadre', note: 'Si el master bedroom pide 180 CFM pero tiene un solo supply de 6" redondo, ya tienes problema de Manual D' },
        { item: 'Imprimir reporte, firmar y archivar', note: 'Building department lo pide; garantia tambien' }
      ],
      commonMistakes: [
        'Usar la regla del pulgar ("1 ton por 500 sqft") — error promedio del 30-50%, casi siempre oversizing',
        'No medir orientacion — pones el mismo tonelaje en una recamara norte que en una oeste con ventana gigante',
        'Asumir ACH50 = 7 cuando la casa tiene 15+ — infiltration real se duplica y el sistema queda corto en los dias mas frios',
        'No incluir ductos en atico sin aislar como "gain" extra — pierdes 20-30% de capacidad que el software no ve si no lo declaras',
        'Calcular solo el total de la casa, no room-by-room — no puedes disenar ductos asi y terminas con cuartos calientes/frios'
      ]
    },

    // ========================================================
    // SECCION 2: MANUAL S
    // ========================================================
    {
      id: 'manual-s',
      heading: 'Manual S — Seleccion de Equipo',
      body: `
        <p>Ya tienes Manual J. Sabes que la casa pide, digamos, <strong>32,800 BTU/h sensible y 7,200 BTU/h latente</strong> a 95°F exterior / 75°F interior. Ahora: ?que equipo pones? Aqui entra <strong>Manual S</strong> (ACCA/ANSI 710), que te dice como <em>matchear</em> el equipo al load calculado sin sobredimensionar ni quedarte corto.</p>

        <p>El error mas comun: "pues la casa pide 2.73 toneladas, le pongo un 3 ton y ya". <strong>Mal.</strong> Manual S te obliga a verificar que el equipo seleccionado entregue la capacidad <em>sensible</em> correcta a tus condiciones de diseno — no a las condiciones ARI/AHRI de laboratorio.</p>

        <p>Cada condensador/evaporador tiene una <strong>expanded performance table</strong> (a veces llamada "detailed performance data") publicada en el submittal. Ahi viene, para cada combinacion de outdoor temp, indoor wet bulb y CFM, <em>cuantos BTU totales, sensibles y latentes</em> entrega. Un Carrier 24ACC636 (3 ton) a 95°F OD / 75°F DB / 63°F WB indoor / 1200 CFM entrega:</p>
        <ul>
          <li>Total capacity: 33,500 BTU/h</li>
          <li>Sensible capacity: <strong>25,200 BTU/h</strong> ← este es el numero que compara contra Manual J</li>
          <li>Latent capacity: 8,300 BTU/h</li>
          <li>Sensible Heat Ratio (SHR): 0.75</li>
        </ul>

        <p>Si Manual J pidio 32,800 sensible y el 3 ton solo entrega 25,200 sensible en tus condiciones reales, <strong>el 3 ton se queda corto</strong> — aunque en el sticker diga "36,000 BTU". Las condiciones de catalogo (80°F DB indoor, 67°F WB) son irreales en una casa con buena humedad.</p>

        <p><strong>Reglas de oro de Manual S:</strong></p>
        <ul>
          <li><strong>Cooling sensible capacity</strong> debe estar entre <em>95% y 115%</em> del Manual J sensible load. No menos, no mas.</li>
          <li><strong>Total cooling capacity</strong> no debe exceder <em>115% del Manual J total load</em> en climas humedos, o <em>125%</em> en climas secos.</li>
          <li><strong>Heating capacity</strong> en bombas de calor debe cubrir al menos el load a <em>la temperatura de balance point</em> (usualmente 30-35°F) — si no, anades strips electricas.</li>
          <li><strong>Nunca selecciones por nombre comercial</strong> ("pues es un 3 ton") — siempre por expanded performance data en tus condiciones de diseno.</li>
          <li><strong>Verifica el match AHRI</strong> — condensador + coil + handler deben aparecer en el AHRI Certificate o pierdes garantia y rebates.</li>
        </ul>

        <p>Hay dos trampas brutales: (1) <strong>oversizing</strong> — 4 ton en una casa de 2.7 ton load significa que el sistema prende 4-6 min, apaga, prende 4-6 min — nunca corre lo suficiente para quitar humedad latente. Resultado: casa a 74°F pero con 65% humedad, gente se queja, tu pierdes reputacion. (2) <strong>Undersizing</strong> — pones un 2.5 ton donde pedia 2.73, sistema corre 24/7 en julio, no alcanza setpoint, cliente llama enojado.</p>

        <p>Manual S tambien aplica a <strong>mini-splits y VRF</strong> — solo que la tabla de performance es mas compleja porque varia con modulacion del compresor. Para Mitsubishi, Fujitsu, Daikin, etc., busca el "Engineering Manual" del modelo — ahi viene la expanded data.</p>

        <p>Un Manual S bien hecho se entrega como documento de 2-3 paginas con: (a) las condiciones de diseno, (b) el match AHRI, (c) la tabla de performance expanded con el punto de operacion marcado, (d) verificacion de que esta dentro de 95-115%. Es lo que te cubre legalmente si el cliente demanda por humedad o por no alcanzar setpoint.</p>
      `,
      keyPoints: [
        'Manual S te dice como seleccionar equipo que ENTREGA lo que Manual J pidio, en tus condiciones de diseno reales',
        'Usa expanded performance data del submittal — NUNCA las condiciones ARI/AHRI de sticker',
        'Sensible capacity debe estar entre 95-115% del Manual J sensible load',
        'Total capacity no debe pasar 115% en clima humedo o 125% en clima seco',
        'Verifica match AHRI de condensador + coil + air handler — sin match, no hay garantia ni rebate',
        'Mini-splits y VRF tambien necesitan Manual S — busca Engineering Manual del fabricante',
        'Oversizing causa humedad alta (no dehumidifica); undersizing causa quejas de no enfriar en pico de verano'
      ],
      realTalk: 'Cuando un distribuidor te dice "dale 3 ton, se ve de 3 ton", esta usando tu licencia para mover inventario. No es tu amigo — es el que te va a echar la culpa cuando el cliente llame porque la casa esta a 74°F con 68% de humedad.',
      checklist: [
        { item: 'Tener expanded performance data del condensador y coil', note: 'Baja del sitio del fabricante, no del catalogo de distribuidor' },
        { item: 'Verificar condiciones de diseno locales (ACCA Manual J Table 1A)', note: 'Houston 95°F/77°F WB; Miami 91°F/79°F WB; Phoenix 108°F/71°F WB' },
        { item: 'Entrar a la tabla con OD dry bulb, ID wet bulb, CFM del diseno', note: 'CFM viene de Manual J (usualmente 400 CFM/ton, 350 en climas humedos)' },
        { item: 'Leer sensible, latent y total del punto exacto', note: 'Si el punto no esta en tabla, interpola linealmente' },
        { item: 'Comparar con Manual J y verificar 95-115% sensible', note: 'Fuera de rango = reselecciona tamano o cambia CFM' },
        { item: 'Confirmar AHRI Certificate', note: 'ahridirectory.org — busca por modelo combinacion' },
        { item: 'Documentar todo en PDF de 2-3 paginas firmado', note: 'Anexa al contrato y al permit' }
      ],
      commonMistakes: [
        'Seleccionar por "toneladas nominales" sin mirar expanded data — en clima humedo el 3 ton puede dar 2.6 ton sensible real',
        'Ignorar el CFM — si el air handler corre a 1050 CFM en lugar de 1200, la capacidad sensible baja 8-10%',
        'No verificar match AHRI — pones un condensador Goodman con coil Daikin y el cliente pierde garantia',
        'Oversizing "por si acaso" — el "safety factor" de 20% que te ensenaron en Mexico aqui te cuesta problemas de humedad',
        'No considerar balance point en heat pumps — cliente se queda sin calefaccion a 25°F porque no pusiste strips'
      ]
    },

    // ========================================================
    // SECCION 3: MANUAL D
    // ========================================================
    {
      id: 'manual-d',
      heading: 'Manual D — Diseno de Ductos',
      body: `
        <p><strong>Manual D</strong> (ACCA/ANSI 310 complementario) es donde se gana o se pierde la guerra. Puedes tener Manual J perfecto, Manual S perfecto, y si los ductos estan mal disenados, el sistema no funciona. Literal: un condensador de 3 ton con un ductwork de 2 ton solo entrega 2 ton porque <em>no puede mover el aire</em>.</p>

        <p>Manual D calcula: (a) el <strong>static pressure total</strong> del sistema (external static pressure, ESP), (b) el <strong>friction rate</strong> disponible por cada 100 ft de ducto, (c) el <strong>diametro o tamano</strong> de cada tramo de supply y return, y (d) el <strong>balanceo</strong> de CFM por cuarto.</p>

        <p><strong>Concepto #1: Static Pressure.</strong> Cada air handler tiene una <em>maximum external static pressure</em> — tipicamente 0.50" w.c. (inches water column) en residencial. Ese es el "presupuesto de presion" que tienes para TODO lo que esta fuera del handler: supply trunk, supply branches, returns, filtro, serpentin (si es split), registros, dampers. Si tu ductwork requiere 0.85" w.c. y el handler solo empuja 0.50", el blower no entrega el CFM nominal — entrega 70-80% — y la capacidad sensible cae proporcionalmente.</p>

        <p><strong>Concepto #2: Friction Rate.</strong> Es cuantos inches w.c. se pierden por cada 100 ft equivalentes de ducto. Formula:</p>
        <p><em>FR = (ESP disponible - perdidas componentes) / (TEL / 100)</em></p>
        <p>Donde TEL = Total Equivalent Length (longitud real + equivalentes de codos, tees, reducciones). Un codo de 90° en ducto de 10" redondo = ~25 ft equivalentes. Un filtro MERV-13 nuevo = 0.10-0.15" w.c. Un coil mojado = 0.20-0.30" w.c. Un damper = 0.03" w.c.</p>

        <p><strong>Ejemplo real:</strong> Handler con 0.50" w.c. ESP. Filtro MERV-11 = 0.12", coil = 0.22", registros = 0.03", grille de return = 0.05". Total componentes: 0.42". Te quedan 0.08" para TODO el ducto. Si tu TEL es 150 ft, FR = 0.08 / 1.5 = 0.053" per 100 ft. <em>Eso es un friction rate ridiculamente bajo</em> que te obliga a ductos gigantes. Conclusion: tu sistema no cabe asi, necesitas reducir filtro (MERV-8), poner return mas grande, o un handler con ESP mas alto.</p>

        <p><strong>Concepto #3: Tamano de ducto.</strong> Una vez que tienes FR, usas el <strong>ductulator</strong> (regla circular) o software (Wrightsoft Right-D) para encontrar el diametro. Para 400 CFM a FR=0.08: 10" redondo o 8x12 rectangular. Para 1200 CFM trunk a FR=0.08: 16" redondo o 10x20 rectangular. Flex duct tiene ~15-20% mas friction que metal — si usas flex, sube un tamano.</p>

        <p><strong>Concepto #4: Returns.</strong> El return es donde los contratistas latinos mas fallan. <em>El return debe mover el mismo CFM que el supply</em>. Si tu sistema es 1200 CFM, necesitas returns que sumen 1200 CFM. Regla: <strong>2 sq in de free area por CFM</strong>. Para 1200 CFM: 2400 sq in de free area total, o sea un return de 20x25 (500 sq in neto tras grille). Si pones uno solo de 14x20 (280 sq in neto), el sistema tiene que "chupar" con el doble de presion, el blower se esfuerza, el static sube, el CFM baja, la capacidad baja. Y el cliente escucha el "shhhhhh" constante del return estrangulado.</p>

        <p><strong>Leakage.</strong> El codigo IECC 2021 exige <em>total duct leakage ≤ 4 CFM25 por 100 sqft de area conditioned</em>. Se mide con Duct Blaster. Si tu ductwork tiene juntas sin mastic, leakage se va a 10-15 CFM25 — pierdes 20% de capacidad al atico. Sella TODAS las juntas con mastic UL-181, no con tape plateado (ese se despega en 18 meses).</p>
      `,
      keyPoints: [
        'El handler solo tiene 0.50" w.c. de ESP — ese es tu presupuesto TOTAL para ductwork, filtro, coil, registros',
        'Friction Rate objetivo: 0.08-0.10" w.c. por 100 ft — mas bajo y los ductos son gigantes, mas alto y el sistema se ahoga',
        'Returns deben sumar el mismo CFM que supply — 2 sq in free area por CFM es la regla',
        'Flex duct tiene 15-20% mas friction que metal — siempre sube un tamano si usas flex',
        'Codos y tees cuentan como 20-30 ft equivalentes cada uno — el TEL real es 2-3x la longitud fisica',
        'Total duct leakage maximo: 4 CFM25 por 100 sqft conditioned (IECC 2021) — sella con mastic UL-181',
        'Si el ductwork existente esta mal, NO lo reutilices — o cobra para rehacerlo. Reusar ductos malos te hace dueno del problema'
      ],
      realTalk: 'El 70% de los callbacks de "el A/C no enfria bien" no son de capacidad — son de ductwork. Pero como no mides static pressure con manometro, no lo ves, y terminas cambiando compresores o cargando Freon sin sentido. Compra un Fieldpiece SDMN6 y mide ESP en cada instalacion. Si pasa 0.80", tienes un problema de Manual D.',
      checklist: [
        { item: 'Medir external static pressure con manometro en cada job', note: 'Fieldpiece SDMN6 o SMAN460 con hose kit; sonda antes y despues del handler' },
        { item: 'Calcular TEL usando Manual D Appendix 3 (equivalent lengths)', note: 'Codo 90° 10" redondo = 25 ft; tee = 40 ft; reduccion = 10 ft' },
        { item: 'Verificar return sizing: 2 sq in free area por CFM', note: 'Grille manufacturers publican free area ratio — tipicamente 65-75% del area total' },
        { item: 'Seleccionar ductwork en ductulator con FR calculado', note: 'Round metal > rectangular metal > flex; 15-20% penalty por flex' },
        { item: 'Usar mastic UL-181 en todas las juntas', note: 'Aerosol sealant (Aeroseal) si la casa es un desastre — $2-3K pero queda perfecto' },
        { item: 'Hacer Duct Blaster test pre-closeout', note: 'Si falla >4 CFM25/100sqft, ubica la fuga con smoke pencil' },
        { item: 'Balancear con dampers y medir CFM por registro', note: 'TrueFlow grid o flow hood Alnor — registra el CFM vs Manual J' }
      ],
      commonMistakes: [
        'Reusar ductwork viejo sin verificar — el ducto de 1985 flex sin aislar te mata la eficiencia y tu eres el responsable',
        'Return unico subdimensionado ("pues hay un return grande en el pasillo") — sistema se ahoga, ESP sube a 1.0"+, blower muere en 3 anos',
        'Flex duct mal instalado con curvas cerradas y compresion — cada vuelta cerrada duplica la friction',
        'No medir ESP con manometro — asumes que el sistema mueve 1200 CFM y en realidad mueve 850',
        'Sellar con tape plateado en lugar de mastic — se despega en climas calurosos, leakage regresa en 2 anos'
      ]
    },

    // ========================================================
    // SECCION 4: HERS y BPI
    // ========================================================
    {
      id: 'hers-bpi',
      heading: 'HERS y BPI — que debe saber un contratista',
      body: `
        <p><strong>HERS</strong> (Home Energy Rating System) y <strong>BPI</strong> (Building Performance Institute) son los dos sistemas de certificacion que rigen la <em>eficiencia energetica</em> de casas residenciales en USA. Si vas a trabajar retrofits, casas nuevas bajo codigo IECC 2018+, rebates de utility, o cualquier programa federal (25C tax credit, IRA Home Energy Rebates), <strong>debes entender ambos</strong>.</p>

        <p><strong>HERS Index.</strong> Es un numero. Casa de referencia del codigo 2006 = <em>HERS 100</em>. Cada punto menos es 1% mas eficiente. Casa Passive House = HERS 20-30. Casa Net-Zero = HERS 0. Casa energia-hog de los anos 80 = HERS 140+. El HERS lo calcula un <em>HERS Rater</em> certificado por RESNET usando software (REM/Rate, Ekotrope) que integra: envelope (aislamiento, ventanas, infiltration), HVAC (SEER, AFUE, HSPF, ductwork leakage), water heating, lighting y appliances.</p>

        <p><strong>Por que te importa como contratista HVAC:</strong> el HVAC representa <em>40-60% del HERS score</em>. Si instalas un sistema SEER 14 con ductos 15% leaky, el HERS sube (peor). Si instalas SEER 18 con ductos 3% leaky y ductos adentro del thermal envelope, el HERS baja drasticamente. Builders de casas nuevas necesitan HERS ≤ 65 en Texas 2021 IECC; si no, no pasan codigo. <em>El contratista que puede bajar HERS 5 puntos con un upgrade HVAC es oro para los builders.</em></p>

        <p><strong>Blower Door + Duct Blaster.</strong> Son los dos tests obligatorios del HERS Rater:</p>
        <ul>
          <li><strong>Blower Door:</strong> puerta con ventilador que despresuriza la casa a -50 Pa (Pascal). Mide ACH50 (air changes per hour at 50 Pa). Codigo 2021 exige ≤3 ACH50 en climate zones 3-8. Casa vieja tipica: 10-20 ACH50.</li>
          <li><strong>Duct Blaster:</strong> mismo concepto pero para ductos. Mide leakage en CFM25. Codigo exige ≤4 CFM25 por 100 sqft conditioned.</li>
        </ul>

        <p><strong>BPI</strong> es diferente: es el sistema que domina en <em>retrofits y weatherization</em> (casas existentes). BPI Building Analyst certifica al tecnico para hacer audits energeticos completos — combustion safety, draft test, CO testing, worst-case depressurization, ASHRAE 62.2 ventilation. Si vas a trabajar programas como <em>LIHEAP, Weatherization Assistance Program (WAP), o utility rebate programs de casas existentes</em>, BPI Building Analyst es el ticket.</p>

        <p><strong>ASHRAE 62.2 Ventilation.</strong> Esta parte la ignoran el 95% de contratistas. Casa con ≤3 ACH50 <em>ya no ventila sola</em> — no respira. Necesitas ventilacion mecanica (ERV, HRV, o exhaust-only) segun formula:</p>
        <p><em>Qtot = 0.03 · Afloor + 7.5 · (Nbr + 1)</em> <strong>CFM</strong></p>
        <p>Para casa 2,000 sqft, 3 recamaras: Qtot = 0.03·2000 + 7.5·4 = 60 + 30 = <strong>90 CFM</strong> continuos. Si no los entregas, la casa acumula CO2, humedad, VOC, y el cliente se enferma o tienes moho en 18 meses. Panasonic WhisperGreen, Broan AI Series, Zehnder ComfoAir, o Fantech SHR son los equipos tipicos.</p>

        <p><strong>Combustion Safety.</strong> Si vas a trabajar en casa con furnace gas, calentador de agua atmosferico o fireplace, <em>siempre</em> haces worst-case depressurization test: cierras casa, prendes exhausts (secadora, cocina hood, bathrooms), mides si el CAZ (Combustion Appliance Zone) se despresuriza mas de -5 Pa. Si si, hay riesgo de backdrafting → CO al interior → muerte del cliente → tu pierdes licencia. BPI te ensena protocolo.</p>

        <p><strong>25C Federal Tax Credit (Inflation Reduction Act).</strong> Actualizado 2023-2032: 30% del costo hasta $2,000 por heat pump (SEER2 ≥16, HSPF2 ≥9 para climate zone south; requisitos mas altos para norte). El cliente <em>solo</em> recibe el credito si el equipo califica — y la calificacion la verifica con el AHRI certificate + manufacturer statement. Educalos: muchos contratistas no mencionan el credito y pierden ventas.</p>
      `,
      keyPoints: [
        'HERS Index 100 = casa codigo 2006; menos = mejor; HVAC es 40-60% del score',
        'Codigo IECC 2021: maximo 3 ACH50 infiltration, 4 CFM25/100sqft duct leakage',
        'BPI Building Analyst es la certificacion para retrofits, weatherization, y programas utility',
        'ASHRAE 62.2: Qtot = 0.03·sqft + 7.5·(Nbr+1) CFM de ventilacion mecanica obligatoria en casas tight',
        'Worst-case depressurization test obligatorio si hay combustion appliances — protege la vida del cliente y tu licencia',
        'IRA 25C tax credit: 30% hasta $2,000 por heat pump calificada; educa al cliente y cierra la venta',
        'Coordina con HERS Rater desde el inicio del proyecto — no al final cuando ya no se puede cambiar nada'
      ],
      realTalk: 'Si instalas un sistema SEER 18 con ductos leaky 12% en el atico de Houston, el HERS Rater te va a quemar en el reporte y el builder no te vuelve a llamar. Todo el extra SEER que cobraste se fuga por los ductos. Aprende a sellar o aprende a trabajar de empleado.',
      checklist: [
        { item: 'Tener contacto directo con 2-3 HERS Raters locales', note: 'Busca en resnet.us/directory por codigo postal' },
        { item: 'Ofrecer Blower Door + Duct Blaster como servicio ($300-500)', note: 'Retrotec 5000 o Minneapolis Blower Door — ~$3K de inversion inicial' },
        { item: 'Sacar certificacion BPI Building Analyst', note: '~$1,500, curso 5 dias, examen escrito + practico; abre puertas en retrofits' },
        { item: 'Calcular ASHRAE 62.2 en cada casa tight y cotizar ERV/HRV', note: 'Panasonic FV-10VE2 (ERV 100 CFM) $800; Zehnder $4-6K para casa nueva' },
        { item: 'Hacer worst-case depressurization en toda casa con gas', note: 'Bacharach Fyrite Pro o Testo 330 para CO/draft' },
        { item: 'Entregar al cliente docu del 25C tax credit con AHRI cert', note: 'Form 5695 del IRS; guarda copia 3 anos por si audit' }
      ],
      commonMistakes: [
        'No coordinar con HERS Rater antes de instalar — ductos en atico no aislado te matan el score y no hay forma de arreglar despues',
        'Instalar sistema en casa Passive House sin ERV — cliente tiene moho en 12 meses y te demanda',
        'Ignorar combustion safety en reemplazo de furnace — un backdrafting mata al cliente, tu vas a juicio',
        'No mencionar el 25C tax credit al cotizar — pierdes ventas contra contratistas que si lo explican',
        'Confundir SEER con SEER2 — desde enero 2023 es SEER2 (5% menor); si cotizas SEER viejo no califica al credito'
      ]
    },

    // ========================================================
    // SECCION 5: DEALER PROGRAMS
    // ========================================================
    {
      id: 'dealer-programs',
      heading: 'Programas de Dealer — como las marcas te atrapan',
      body: `
        <p>En algun momento del primer ano un distribuidor (Ferguson, Gemaire, Carrier Enterprise, Johnstone, etc.) te va a ofrecer "ser dealer autorizado" de Carrier, Trane, Lennox, Rheem, Goodman/Daikin, Bryant, American Standard, Mitsubishi, etc. Suena espectacular. <em>Es una trampa si no sabes lo que estas firmando.</em></p>

        <p>Entender la jerarquia: <strong>Manufacturer → Regional Distributor → Dealer (tu)</strong>. El distribuidor tiene un contrato con el manufacturer que lo obliga a mover X unidades por ano. El distribuidor te recluta a ti para mover ese inventario. Tu cobras comision "de ser dealer" — acceso a precios un poco mejores, soporte tecnico, rebates de clientes, co-op advertising. A cambio de: cuotas de compra, minimos de instalaciones, entrenamientos obligatorios, exclusividad (a veces), y compartir tu data de ventas.</p>

        <p><strong>Niveles tipicos de dealer (ejemplo Carrier):</strong></p>
        <ul>
          <li><strong>Authorized Dealer:</strong> basico, descuentos modestos, acceso a material de marketing. Entrada ~$0-500.</li>
          <li><strong>President's Award / Factory Authorized:</strong> tier alto, marketing co-op agresivo, entrenamientos, requisitos de CSI (customer satisfaction index) >90%. Cuotas: $300-500K al ano en compras.</li>
          <li><strong>Infinity Dealer (Carrier) / ComfortMaster (Rheem) / Comfort Specialist (Trane):</strong> top, acceso a extended warranties de 10 anos, rebates maximos al cliente, co-op hasta 50%. Cuotas: $500K-1M+.</li>
        </ul>

        <p><strong>Lo bueno:</strong></p>
        <ul>
          <li>Descuentos reales de 3-8% sobre street price (pero ojo: el competidor Goodman/Daikin/Amana ya esta 15-25% abajo del Carrier, asi que tu descuento no compensa)</li>
          <li>Extended warranty de fabricante (10 anos parts, 1-2 labor) que puedes usar como cierre</li>
          <li>Rebates al cliente (ej. $500-1,500 en SEER 18+) que tu capturas como intermediario</li>
          <li>Co-op advertising: la marca paga 30-50% de tu Google Ads, Facebook, yard signs</li>
          <li>Capacitacion tecnica real — Carrier University, Trane Technical Institute</li>
          <li>Priority access a inventario cuando hay shortage (como 2021-2023)</li>
        </ul>

        <p><strong>Lo malo (y lo feo):</strong></p>
        <ul>
          <li><strong>Cuotas de compra:</strong> "debes comprar $400K este ano". Si no llegas, pierdes el tier. Si compras mas de lo que vendes, se te queda el inventario en la bodega — y las unidades de 2023 en 2025 son obsoletas (SEER2 cambio todo).</li>
          <li><strong>Precios no son tan buenos:</strong> un Trane XV18 cuesta $4,200 al dealer y $3,100 un Goodman GSZC18 equivalente. Tu cliente no nota la diferencia en rendimiento real — pero si nota los $1,500 menos.</li>
          <li><strong>CSI surveys:</strong> Carrier llama a cada cliente. Si un cliente te da <90%, afecta tu tier. Un cliente irracional te puede tirar un ano de esfuerzo.</li>
          <li><strong>Lock-in:</strong> "no puedes vender Goodman si eres Carrier Infinity". Te fuerzan exclusividad. Pierdes flexibilidad de mercado.</li>
          <li><strong>Territorios:</strong> a veces el distribuidor te asigna un territorio; no puedes cruzar zonas o te pelean.</li>
          <li><strong>Share your data:</strong> debes reportar instalaciones, clientes, revenue. El distribuidor sabe mas de tu negocio que tu contador.</li>
          <li><strong>Seminarios gratis que no son gratis:</strong> te llevan a Las Vegas 3 dias con familia — suena espectacular, pero estas regalando 3 dias de produccion y "debes" a la marca.</li>
        </ul>

        <p><strong>Mi recomendacion (Mario):</strong> el primer ano, NO firmes con ningun dealer program serio. Compra al spot, precio directo de distribuidor. Aprende quien es quien. En tu ano 2-3, cuando ya facturas $500K-1M, firma <em>uno solo</em> tier medio (no Infinity, no ComfortMaster) y usa los rebates como tool de venta, no como razon de existir. <strong>Nunca seas monogamo con una marca en los primeros 5 anos</strong> — necesitas flexibilidad para cotizar Goodman al cliente frugal y Carrier al cliente premium.</p>

        <p><strong>El secreto:</strong> el equipo de $3,500 que compras de Goodman funciona igual que el Carrier de $4,500 para el 90% de las casas. La diferencia esta en <em>quien lo instala</em>, no en la marca. Pero el cliente no sabe eso, asi que Carrier/Trane tienen "brand premium" que puedes capturar. La jugada inteligente: <em>ten ambas</em>, ofrece Goodman como "good", Carrier como "best", y el cliente elige.</p>
      `,
      keyPoints: [
        'Dealer program te da descuentos 3-8% pero te impone cuotas de compra $300K-1M al ano',
        'Carrier Infinity, Trane Comfort Specialist, Rheem ComfortMaster son los tiers top — requisitos altos',
        'CSI (Customer Satisfaction Index) <90% te puede costar el tier — un cliente malo tira tu ano',
        'Goodman/Daikin/Amana estan 15-25% abajo de Carrier/Trane con performance equivalente en el 90% de casos',
        'Exclusividad te amarra: no puedes vender competidor si eres tier top de una marca',
        'Co-op advertising real: la marca paga 30-50% de tu Google Ads y Facebook si cumples cuotas',
        'Estrategia: ano 1-2 sin dealer program; ano 3+ firma uno tier medio; nunca monogamia temprana'
      ],
      realTalk: 'Cuando el rep de Carrier te invita a Las Vegas con tu senora 3 dias, no es regalo. Es anzuelo. Calcula: 3 dias sin trabajar = $6-10K perdidos. Y sales con la conciencia de que "les debes". Mejor paga tu propio vuelo a AHR Expo y aprende sin ataduras.',
      checklist: [
        { item: 'Pedir por escrito: cuota anual, CSI minimo, exclusividad, penalidades', note: 'Si el rep no te lo manda, es red flag — estan escondiendo terminos' },
        { item: 'Calcular punto de equilibrio: cuanto tienes que instalar para que los rebates paguen las cuotas', note: 'Tipicamente 40-60 instalaciones al ano para justificar Infinity tier' },
        { item: 'Comparar precios dealer vs Goodman/Daikin vs street price en distribuidor independiente', note: 'Goodman GSZC18 vs Carrier 24VNA8: $1,200-1,500 diferencia real en equipo' },
        { item: 'Preguntar a otros dealers (no del mismo territorio) su experiencia real', note: 'Foros HVAC-Talk, Reddit r/HVAC, Facebook groups latinos' },
        { item: 'Negociar territorio antes de firmar', note: 'Si hay otro dealer en tu ZIP, tu vas a pelear contra el y ambos pierden' },
        { item: 'Revisar clausula de cancelacion', note: 'Algunos contratos te amarran 3 anos; otros son anuales' },
        { item: 'Consultar con abogado antes de firmar multi-year', note: 'Inversion $300-500 — te puede ahorrar $50K' }
      ],
      commonMistakes: [
        'Firmar Infinity/ComfortMaster en el ano 1 sin saber si vas a vender 60 sistemas — terminas pagando cuotas sin beneficio',
        'Creer que Carrier es "mejor" que Goodman tecnicamente — los dos usan compresores Copeland, serpentines iguales, para el 90% de casas no hay diferencia',
        'No leer clausula de exclusividad — firmas y despues descubres que no puedes vender un Mitsubishi mini-split al cliente de lujo',
        'Olvidar que las CSI surveys afectan tu tier — un cliente extorsionador te puede bajar de Infinity a Authorized con 2 reviews malas',
        'Comprar inventario de fin de ano "para llegar a cuota" — el inventario se queda en la bodega y al ano siguiente vale 20% menos'
      ]
    },

    // ========================================================
    // SECCION 6: TIPOS DE SISTEMAS
    // ========================================================
    {
      id: 'system-types',
      heading: 'Tipos de Sistemas — cuando recomendar que',
      body: `
        <p>Hay 5 tipos de sistemas HVAC residenciales que vas a encontrar en USA. Cada uno tiene su lugar. El error del novato es tratar de meter el mismo tipo en toda casa — el maestro recomienda el correcto segun geometria, clima, budget y expectativas del cliente.</p>

        <p><strong>1. Split System (Condensador + Furnace/Air Handler + Coil + Ductwork).</strong></p>
        <p>Es el caballo de batalla. 80% de casas en USA lo tienen. Condensador afuera, furnace de gas (o air handler electrico) en atico/closet, coil evaporador arriba del furnace, ductwork a todos los cuartos.</p>
        <ul>
          <li><strong>Cuando recomendar:</strong> casa con ductwork existente o espacio para ductwork, clima mixto (gas para calefaccion, A/C para verano), cliente quiere comfort zonificado con dampers.</li>
          <li><strong>Precio instalado:</strong> $7,500-14,000 segun tonelaje y SEER.</li>
          <li><strong>Ventajas:</strong> capacidad grande (1.5-5 ton), gas heat barato en el norte, repuestos universales, mano de obra conocida.</li>
          <li><strong>Desventajas:</strong> requiere ductwork (pierdes 20-30% si esta mal), gas line necesaria, zonificacion cara.</li>
        </ul>

        <p><strong>2. Package Unit (todo-en-uno exterior).</strong></p>
        <p>Toda la maquina (compresor, coils, blower, furnace) en una sola caja afuera — en el techo (rooftop) o al lado de la casa (ground pad). Ductos cortos entran a la casa.</p>
        <ul>
          <li><strong>Cuando recomendar:</strong> casa sin atico utilizable, mobile home, comercial ligero, casa costera donde gas no esta disponible.</li>
          <li><strong>Precio instalado:</strong> $6,500-11,000.</li>
          <li><strong>Ventajas:</strong> instalacion rapida (1 dia), no ocupa espacio interior, facil de mantener, menos puntos de fuga de refrigerante.</li>
          <li><strong>Desventajas:</strong> menos eficiente (SEER tope ~16), rooftop sufre mas con sol y lluvia, reemplazo completo si falla algo grande.</li>
        </ul>

        <p><strong>3. Ductless Mini-Split (1:1).</strong></p>
        <p>Un condensador afuera, una cassette/wall-mount adentro. Lineset de refrigerante entre los dos. Sin ductos.</p>
        <ul>
          <li><strong>Cuando recomendar:</strong> agregar A/C a cuarto unico (garage, attic conversion, master suite), casa sin ductwork donde meterlos sale $15K, zona con solo 1-2 habitaciones que se usan.</li>
          <li><strong>Precio instalado:</strong> $3,500-6,500 por zona.</li>
          <li><strong>Ventajas:</strong> SEER 20-30+ (alta eficiencia), zonificacion perfecta, silencioso, ideal para retrofits.</li>
          <li><strong>Desventajas:</strong> estetica (cassette visible en pared), limitado a 1 zona, no maneja casa entera sin multi-zone.</li>
          <li><strong>Marcas serias:</strong> Mitsubishi M-Series, Fujitsu Halcyon, Daikin Aurora, LG Art Cool.</li>
        </ul>

        <p><strong>4. Multi-Zone Mini-Split (1:N).</strong></p>
        <p>Un condensador exterior que sirve 2-8 evaporadores interiores con lineset individual a cada uno.</p>
        <ul>
          <li><strong>Cuando recomendar:</strong> casa sin ductos donde el cliente quiere A/C en toda la casa y no quiere invertir $20K en ductwork, casa vieja de ladrillo sin atico.</li>
          <li><strong>Precio instalado:</strong> $12,000-25,000 segun numero de zonas.</li>
          <li><strong>Ventajas:</strong> SEER 18-22, zonificacion individual (master a 72°F, nino a 74°F), no pierdes espacio con ductos.</li>
          <li><strong>Desventajas:</strong> si el condensador falla, toda la casa sin A/C; multiple cassettes = estetica cargada; mas caro que split tradicional.</li>
        </ul>

        <p><strong>5. VRF / VRV (Variable Refrigerant Flow).</strong></p>
        <p>Version comercial/residencial lujo del mini-split multizona. Un condensador inverter modulante que sirve 8-30 unidades interiores con control digital preciso y recuperacion de calor (heat recovery) simultanea — puede enfriar unos cuartos y calentar otros al mismo tiempo.</p>
        <ul>
          <li><strong>Cuando recomendar:</strong> casa de lujo 4,000+ sqft, edificio comercial, hotel boutique, cliente que paga por tecnologia de punta.</li>
          <li><strong>Precio instalado:</strong> $30,000-80,000 residencial; comercial ilimitado.</li>
          <li><strong>Ventajas:</strong> eficiencia maxima (IEER 20+), control zona por zona, diseno arquitectonico limpio, modulacion 10-100%.</li>
          <li><strong>Desventajas:</strong> carisimo, requiere entrenamiento especifico del fabricante (Mitsubishi City Multi, Daikin VRV, LG Multi V), pocos tecnicos certificados para repararlo.</li>
        </ul>

        <p><strong>Geothermal (Ground Source Heat Pump).</strong> Nota aparte: usa el subsuelo como fuente/sumidero de calor con tuberia enterrada en loops. Eficiencia brutal (COP 4-5, SEER equivalente 40+) pero instalacion $30-60K extra por el drilling. Recomendar solo si el cliente planea quedarse 15+ anos y tiene terreno. IRA 25D credit: 30% del costo sin limite hasta 2032.</p>

        <p><strong>Guia rapida de decision:</strong> ?hay ductwork y gas disponible? → Split system. ?Casa pequena sin atico? → Package. ?Agregar A/C a 1 cuarto? → Mini-split 1:1. ?Casa sin ductos, 3-5 zonas? → Multi-zone. ?Casa de lujo 4K+ sqft con budget? → VRF. ?Cliente eco-conscious con terreno y 15 anos de permanencia? → Geothermal.</p>
      `,
      keyPoints: [
        'Split system: 80% del mercado; mejor opcion cuando hay ductwork y gas natural',
        'Package unit: 1-day install, ideal para mobile homes, comercial ligero, casas sin atico',
        'Mini-split 1:1: SEER 20-30, perfecto para agregar A/C a un cuarto o retrofit sin ductos',
        'Multi-zone mini-split: 2-8 zonas sin ductos; $12-25K pero ideal para casas viejas de ladrillo',
        'VRF/VRV: casa lujo 4K+ sqft o comercial; $30-80K residencial; requiere tecnicos certificados',
        'Geothermal: SEER equiv 40+ pero $30-60K extra; solo si cliente se queda 15+ anos; IRA 25D credit 30% sin limite',
        'La mejor venta no es siempre el sistema mas caro — es el que encaja a la casa, clima, y budget del cliente'
      ],
      realTalk: 'El contratista que solo vende split system porque "es lo que sabe" pierde ventas grandes. El cliente de casa vieja de ladrillo sin ductos NO quiere pagar $15K en ductwork — quiere mini-splits. Si tu no los ofreces, el competidor si, y te roba el job.',
      checklist: [
        { item: 'Caminar la casa antes de cotizar — medir atico, ver ductwork, verificar gas line', note: '30 minutos de inspeccion = cotizacion correcta; sin eso solo adivinas' },
        { item: 'Preguntar al cliente expectativas de zonificacion y budget', note: 'Si quiere master a 70°F y sala a 74°F, zonificacion no es lujo, es requisito' },
        { item: 'Preguntar cuanto tiempo planea quedarse', note: '<5 anos = split basico; 5-15 anos = SEER 16-18; 15+ anos = geothermal viable' },
        { item: 'Evaluar ductwork existente con manometro y camara', note: 'Si ductos estan en atico no aislado con leakage 15%, ductless multi-zone puede ser mejor opcion' },
        { item: 'Cotizar 2-3 opciones (good, better, best)', note: 'Ej. Goodman split 16 SEER, Carrier split 18 SEER, Mitsubishi multi-zone 22 SEER' }
      ],
      commonMistakes: [
        'Vender split system en casa de ladrillo 1940 sin atico — terminas rompiendo paredes y el job se convierte en pesadilla',
        'Vender mini-split multizona donde un split tradicional funcionaba mejor — pagas $8K mas y la casa se puede ver peor',
        'Recomendar VRF a cliente middle-class — precio lo asusta y pierdes el job; VRF es para casa $2M+',
        'Ofrecer un solo tipo de sistema por ignorancia — limitas tu mercado al 60% de casas cuando podrias servir 100%',
        'No verificar disponibilidad de tecnicos certificados antes de vender VRF/Mitsubishi City Multi — instalas, falla, nadie sabe repararlo'
      ]
    }
  ],

  resources: [
    { label: 'ACCA Manual J 8th Edition (compra oficial)', url: 'https://www.acca.org/standards/technical-manuals', type: 'pdf' },
    { label: 'ACCA Manual S — Equipment Selection', url: 'https://www.acca.org/standards/technical-manuals', type: 'pdf' },
    { label: 'ACCA Manual D — Residential Duct Systems', url: 'https://www.acca.org/standards/technical-manuals', type: 'pdf' },
    { label: 'RESNET HERS Rater Directory', url: 'https://www.resnet.us/professional/directory/', type: 'tool' },
    { label: 'BPI Certification (Building Analyst)', url: 'https://www.bpi.org/certified-professionals/', type: 'certification' },
    { label: 'AHRI Directory (verify matched systems)', url: 'https://www.ahridirectory.org/', type: 'tool' },
    { label: 'Wrightsoft Right-Suite (Manual J/S/D software)', url: 'https://www.wrightsoft.com/', type: 'software' },
    { label: 'Cool Calc — Manual J online gratis (casas pequenas)', url: 'https://www.coolcalc.com/', type: 'software' },
    { label: 'Energy Star Homes program (HERS requirements)', url: 'https://www.energystar.gov/newhomes', type: 'program' },
    { label: 'IRA 25C Tax Credit official (IRS Form 5695)', url: 'https://www.irs.gov/credits-deductions/home-energy-tax-credits', type: 'tax' }
  ],

  glossary: [
    { term: 'Static Pressure (ESP)', def: 'La resistencia que ofrece el sistema de ductos al paso del aire, medida en inches water column (" w.c."). Tipico handler residencial tiene 0.50" w.c. de maximo ESP disponible.' },
    { term: 'Friction Rate (FR)', def: 'Cuantos inches de water column se pierden por cada 100 ft equivalentes de ducto. Objetivo de diseno residencial: 0.08-0.10" w.c. per 100 ft.' },
    { term: 'TEL (Total Equivalent Length)', def: 'Longitud real del ducto mas longitudes equivalentes de codos, tees y reducciones. Un codo 90° en ducto de 10" = ~25 ft equivalentes.' },
    { term: 'CFM (Cubic Feet per Minute)', def: 'Volumen de aire movido por minuto. Regla tipica: 400 CFM por tonelada en clima seco, 350 CFM por tonelada en clima humedo.' },
    { term: 'SEER / SEER2', def: 'Seasonal Energy Efficiency Ratio. Mide eficiencia estacional de A/C. SEER2 (vigente 2023) es ~5% menor que SEER bajo la misma eficiencia real — nuevo test protocol M1.' },
    { term: 'HSPF / HSPF2', def: 'Heating Seasonal Performance Factor. Mide eficiencia en modo heating de heat pumps. HSPF2 vigente 2023 tambien.' },
    { term: 'SHR (Sensible Heat Ratio)', def: 'Proporcion entre capacidad sensible y total (SHR = sensible/total). Tipico: 0.75-0.80. SHR alto = menos dehumidificacion.' },
    { term: 'ACH50', def: 'Air Changes per Hour at 50 Pascals. Medida de infiltracion de aire en una casa bajo presion negativa de blower door. Codigo 2021 exige ≤3 ACH50.' },
    { term: 'HERS Index', def: 'Home Energy Rating System — numero 0-150+. Casa codigo 2006 = HERS 100. Menor = mas eficiente. Passive House = HERS 20-30. Net-Zero = HERS 0.' },
    { term: 'Manual J / S / D', def: 'Las tres normas ACCA: J calcula carga termica, S selecciona equipo, D disena ductos. Son secuenciales: no puedes hacer D sin haber hecho J primero.' },
    { term: 'U-factor', def: 'Conductividad termica de un material (ventana, pared). Menor = mejor. Ventana doble Low-E moderna: U=0.30. Ventana sencilla vieja: U=1.10.' },
    { term: 'SHGC (Solar Heat Gain Coefficient)', def: 'Fraccion de calor solar que pasa por una ventana. 0.25 (bueno) a 0.80 (malo). Ventanas oeste en Texas necesitan SHGC<0.30.' },
    { term: 'CLTD (Cooling Load Temperature Difference)', def: 'Diferencia efectiva de temperatura usada en calculos de cooling load que incluye conduccion + almacenamiento termico. Varia por hora del dia y orientacion.' },
    { term: 'AHRI Certificate', def: 'Documento oficial que certifica que un condensador + coil + air handler especifico forman un sistema matched con performance validada. Sin AHRI match, no hay garantia ni rebate.' },
    { term: 'Balance Point', def: 'Temperatura exterior en la que un heat pump entrega exactamente el heating load de la casa. Debajo de ese punto se necesitan strips electricas o furnace auxiliar.' },
    { term: 'ERV / HRV', def: 'Energy/Heat Recovery Ventilator. Sistema de ventilacion mecanica balanceada que recupera 60-80% del calor (y humedad en ERV) del aire extrado. Obligatorio en casas con ≤3 ACH50 segun ASHRAE 62.2.' },
    { term: 'Duct Blaster', def: 'Test que despresuriza el ductwork para medir leakage en CFM25. Codigo IECC 2021 exige ≤4 CFM25 por 100 sqft conditioned.' },
    { term: 'CAZ (Combustion Appliance Zone)', def: 'Espacio donde estan instalados equipos de combustion (furnace gas, water heater atmosferico). Debe mantenerse sobre -5 Pa en worst-case depressurization para evitar backdrafting.' },
    { term: 'VRF / VRV', def: 'Variable Refrigerant Flow / Volume. Sistema modulante que sirve multiples zonas desde un condensador con control digital preciso. Brands: Mitsubishi City Multi, Daikin VRV, LG Multi V.' },
    { term: 'Infinity / Comfort Specialist / ComfortMaster', def: 'Tiers premium de dealer programs (Carrier / Trane / Rheem respectivamente). Exigen cuotas $500K+/ano, CSI >90%, exclusividad parcial. Ofrecen rebates altos y extended warranties.' }
  ]
};
