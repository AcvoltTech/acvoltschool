// ============================================================
// ACVOLT BUSINESS ACADEMY — BLOQUE 13: PANELES SOLARES Y BACKUP
// Autor: Mario Flores / ACVOLT
// ============================================================

window.CONTRACTOR_BLOQUE_13 = {
  number: 13,
  title: 'Paneles Solares y Backup',
  tagline: 'Cómo agregar PV, baterías y generadores a tu negocio HVAC',

  intro: `
    <p><strong>Escúchame: en California en 2026, el cliente que te paga $18K por un sistema de AC también está pagando $350 al mes a PG&E, y está cansado de que la luz se vaya 4 veces al año por los <em>Public Safety Power Shutoffs</em>.</strong> Ese mismo cliente, el que ya te abrió la puerta, ya confía en ti, y ya firmó un cheque de 5 dígitos — está listo para decirte que sí a un sistema fotovoltaico con batería de $35K-$55K. Si tú no se lo vendes, se lo vende Sunrun, Tesla o el cuate del volante a domicilio. Y ese cuate se va a llevar el mejor cliente de tu vida.</p>

    <p>Solar + storage dejó de ser un nicho hace 5 años. En California es obligatorio en <em>new construction</em> desde 2020 (Title 24), el <em>Investment Tax Credit</em> federal está en 30% hasta 2032, y el <em>Self-Generation Incentive Program</em> (SGIP) paga $150-$1,000/kWh de batería instalada. El contratista HVAC que no agrega PV, <em>battery backup</em> y generadores standby a su oferta en 2026 se está quedando con el 30% del <em>wallet share</em> del cliente. El otro 70% se lo lleva alguien más.</p>

    <p>Este bloque NO es un curso de instalador solar. Es un <strong>manual de referencia para el contratista HVAC</strong> que quiere entender la tecnología, los códigos, la licencia, los incentivos, el <em>pricing</em>, y el modelo de negocio para cerrar el <em>upsell</em> de solar + battery + generador encima del job de AC que ya tiene firmado. Si quieres ser instalador solar full-time, hazte la C-46 y métele 2 años. Si quieres hacer $15K-$40K extra por cliente usando <em>referral fees</em>, <em>sub-contracts</em> y partnerships — este bloque es para ti.</p>

    <p><strong>Regla #1:</strong> Con NEM 3.0 en California, PV solo (sin batería) ya NO es un buen <em>deal</em> financiero para el cliente. La <em>payback</em> saltó de 6-7 años a 12-15 años. <strong>El <em>deal</em> ahora es PV + batería</strong>. Si un competidor te anda ofreciendo "solo paneles", está vendiendo basura.</p>

    <p><strong>Regla #2:</strong> Nunca, <em>nunca</em>, conectes un generador a una casa sin <em>transfer switch</em> o <em>interlock kit</em>. NEC 702.4 es claro — el <em>backfeed</em> por el meter mata lineros. Un <em>interlock</em> de $120 es la diferencia entre un cliente feliz y un juicio de $2M contra tu compañía.</p>

    <p><strong>Regla #3:</strong> El sol en So-Cal da 5.5-6.0 <em>peak sun hours</em> al día. En Norte-Cal, 4.5-5.0. Un panel de 400W en San Diego produce ~2.2 kWh/día promedio anual. Memorízalo — cuando el cliente te pregunte "cuánto voy a ahorrar", necesitas ese número en la cabeza.</p>

    <p><strong>Regla #4:</strong> La <em>trifecta</em> del contratista HVAC moderno es AC + Solar + Battery + Generador. Mismo cliente, mismo truck, 3x el <em>revenue</em> anual por hogar. El cuate que solo vende AC en 2026 se va a comer los <em>scraps</em> del cuate que vende las 4.</p>

    <p><em>Si terminas este bloque y no puedes explicarle a un cliente la diferencia entre NEM 2.0 y NEM 3.0, entre AC-coupled y DC-coupled, y entre interlock y transfer switch, regresa al principio. Este es dinero serio y códigos serios — no se improvisa.</em></p>
  `,

  sections: [

    // ========================================================
    // SECCION 1: PV FUNDAMENTALS
    // ========================================================
    {
      id: 'pv-fundamentals',
      heading: 'Fundamentos Fotovoltaicos — célula, módulo, string, array',
      body: `
        <p><strong>Un panel solar no es una caja mágica.</strong> Es un sánduche de silicio cristalino dopado con boro y fósforo, encapsulado en EVA entre vidrio templado y un <em>backsheet</em> de polímero, con 60 o 72 <em>cells</em> soldadas en serie y un marco de aluminio anodizado. Entender de qué está hecho te permite vender con autoridad y detectar basura cuando un <em>vendor</em> intenta meterte panel genérico Tier 3 pasándolo por Tier 1.</p>

        <p><strong>Jerarquía eléctrica:</strong></p>
        <ul>
          <li><strong>Célula (cell):</strong> unidad básica de silicio. ~0.5V, ~10W. Mono-PERC o TOPCon o HJT (heterojunction) son las tecnologías modernas. Polycrystalline ya casi no se vende.</li>
          <li><strong>Módulo (módule / panel):</strong> 60-72 células en serie. Residencial típico: 400-450W, 40V nominal, 10-11A. Comercial: 550-700W con células <em>half-cut</em>.</li>
          <li><strong>String:</strong> varios módulos en serie. Sube el voltaje (8 paneles × 40V = 320V DC). Debe quedar dentro del rango MPPT del inversor.</li>
          <li><strong>Array:</strong> uno o varios strings en paralelo, conectados al inversor central o microinversores individuales.</li>
        </ul>

        <p><strong>STC vs NOCT — por qué el número grande en la caja es mentira parcial.</strong> El <em>wattage</em> impreso en el panel (400W, 440W, etc.) se mide en <em>Standard Test Conditions</em>: 1000 W/m² de irradiancia, temperatura de célula 25°C, masa de aire 1.5. <em>Esas condiciones casi nunca existen en un techo real</em>. El número honesto es NOCT (<em>Nominal Operating Cell Temperature</em>): 800 W/m², ambiente 20°C, viento 1 m/s — lo que genera típicamente 43-48°C en la célula. En NOCT, un panel de 400W real entrega ~295-310W. Cuando cotices generación, <strong>usa NOCT o usa un software tipo PVWatts / Aurora / Helioscope que aplique <em>derating</em> por temperatura</strong>, no STC.</p>

        <p><strong>Coeficiente de temperatura — el enemigo silencioso en So-Cal.</strong> Por cada grado Celsius por encima de 25°C, el panel pierde eficiencia. <em>Temp coefficient Pmax</em> típico: -0.29%/°C (Tier 1 moderno) a -0.40%/°C (paneles genéricos). En un techo de Fresno a 45°C en julio, la célula puede estar a 65-70°C. Eso es 40-45°C encima de STC × 0.35% = <strong>14-16% de pérdida de producción en verano</strong>. Por eso SunPower / Maxeon con coeficiente -0.27%/°C producen 8-10% más al año que un panel genérico en climas calientes, aunque el <em>wattage</em> nominal sea parecido.</p>

        <p><strong>Degradación anual y vida útil.</strong> Los paneles no son eternos. Tier 1 moderno degrada <em>0.4-0.5% al año</em> tras el primer año (que puede ser hasta 2%). Warranty típica de producto: 12-25 años. Warranty de potencia: 25-30 años garantizando 84-92% de producción original en año 25. Un panel genérico Tier 3 degrada 0.8-1.2%/año — a los 15 años está al 80% y el cliente ya te está demandando.</p>

        <p><strong>Tier 1 vs Tier 2 vs Tier 3 — qué significa realmente.</strong> La clasificación Tier viene de BloombergNEF y mide <em>bankability</em> (si un banco prestará dinero para un proyecto con ese panel), no calidad absoluta. Pero en la práctica:</p>
        <ul>
          <li><strong>Tier 1 residencial USA (2026):</strong> REC Alpha Pure-R, Q-Cells Q.Peak DUO BLK, Panasonic EVERVOLT, SunPower Maxeon, LG NeON (descontinuado pero todavía en stock), Silfab Elite, LONGi Hi-MO 6, Jinko Tiger Neo, Canadian Solar HiKu7, Trina Solar Vertex S. Precio wholesale: $0.38-$0.55/W.</li>
          <li><strong>Tier 2:</strong> JA Solar, Risen, Phono Solar, ZNShine. Calidad decente, warranty respetable, pero marca menos reconocida. Precio: $0.30-$0.40/W.</li>
          <li><strong>Tier 3:</strong> fábricas chinas sin historial, marcas que aparecen y desaparecen. <em>No los toques ni aunque te regalen margen</em>. En 5 años la warranty es papel mojado.</li>
        </ul>

        <p><strong>W vs Wh, kW vs kWh — la confusión que mata <em>sales</em>.</strong> Watt (W) y kilowatt (kW) son <em>potencia instantánea</em> — cuánto genera AHORA. Watt-hora (Wh) y kilowatt-hora (kWh) son <em>energía acumulada</em> — cuánto generó en un período de tiempo. Un sistema de <em>8 kW</em> (potencia) en So-Cal genera ~<em>12,000 kWh/año</em> (energía). La factura de PG&E viene en kWh — por eso el cliente te va a preguntar "cuántos kWh produce" no "cuántos kW". Si no sabes la diferencia, el cliente ya no te respeta.</p>

        <p><strong>Peak sun hours en California.</strong> No es "cuántas horas hay sol" — es cuántas horas equivalentes a 1000 W/m² (STC) recibes al día en promedio anual. Valores reales:</p>
        <ul>
          <li><strong>San Diego / LA Basin:</strong> 5.5-6.0 PSH/día.</li>
          <li><strong>Inland Empire / Riverside / San Bernardino:</strong> 5.8-6.2 PSH (más sol, pero más calor = más <em>derating</em>).</li>
          <li><strong>Central Valley (Fresno, Bakersfield):</strong> 5.5-5.9 PSH.</li>
          <li><strong>Bay Area:</strong> 5.0-5.4 PSH.</li>
          <li><strong>North Coast (Eureka, Arcata):</strong> 4.0-4.5 PSH. Solar marginal.</li>
          <li><strong>Sierra / Tahoe:</strong> 5.0-5.5 PSH pero nieve en invierno = pérdida estacional.</li>
        </ul>

        <p><strong>Tilt y azimuth óptimo.</strong> Para producción anual máxima en California (latitud 32-42°N), el <em>tilt</em> óptimo es igual a la latitud del sitio: 32-42°. El <em>azimuth</em> óptimo es 180° (sur verdadero, no magnético — en CA la declinación magnética es ~12-14°E). Techos típicos residenciales están a 18-30° de tilt — pierden 3-6% vs óptimo. Si el techo mira sur-este (150°) o sur-oeste (210°), pierdes 4-7% vs sur. Oeste puro (270°) pierde 15-20% en producción anual PERO <em>con NEM 3.0 produce más en las horas pico de la tarde cuando la energía vale más</em> — revísalo con cuidado.</p>

        <p><strong>Shading — por qué 10% de sombra te cuesta 50% de producción.</strong> En un string tradicional con inversor central, las células están en serie — la producción de TODO el string baja al nivel de la célula más sombreada (efecto <em>Christmas lights</em>). Una sombra de chimenea sobre una esquina de un panel puede tirar el output del string completo 40-60%. Soluciones:</p>
        <ul>
          <li><strong>Microinversores (Enphase IQ8+, IQ8M, IQ8A):</strong> un microinversor por panel. Cada panel es independiente. Sombra sobre 1 panel solo baja ese panel. Precio extra: $0.20-$0.30/W. En So-Cal es el estándar de facto.</li>
          <li><strong>Power optimizers (SolarEdge, Tigo):</strong> un optimizador por panel + inversor central string. Similar efecto a microinversores, precio similar.</li>
          <li><strong>Mitigación física:</strong> cortar ramas, reubicar antena, evitar panel en zona sombreada. Siempre hazlo primero.</li>
        </ul>

        <p>Si el techo tiene sombra parcial significativa (chimenea, plumbing vent, árboles del vecino), <em>microinversor o optimizer no es opcional — es obligatorio</em>. Un inversor string central en techo sombreado es malpráctica y el cliente va a notar la baja producción en 6 meses.</p>
      `,
      keyPoints: [
        'STC (nominal) vs NOCT (real) — paneles producen 20-30% menos que el número en la caja',
        'Coeficiente de temperatura: -0.29%/°C (Tier 1) vs -0.40%/°C (genérico) = 8-10% diferencia anual en CA',
        'Degradación Tier 1: 0.4-0.5%/año; warranty de potencia 25-30 años al 84-92%',
        'Tier 1 USA 2026: REC, Q-Cells, Panasonic, SunPower/Maxeon, Silfab, LONGi, Jinko, Canadian, Trina',
        'Peak sun hours: So-Cal 5.5-6.0 PSH/día; Bay Area 5.0-5.4; North Coast 4.0-4.5',
        'Tilt óptimo = latitud del sitio; azimuth óptimo = 180° sur verdadero (no magnético)',
        'Sombra parcial + string inversor = catástrofe; usa microinversores Enphase o optimizers SolarEdge'
      ],
      realTalk: 'El cliente no sabe qué es NOCT, coeficiente de temperatura, ni Tier 1. Pero sabe cuánto le llegó el bill. Si le prometes 1,400 kWh/mes y le llegan 1,050 porque usaste STC y paneles genéricos, te va a demandar en corte de <em>small claims</em> y va a poner reviews de 1 estrella por toda el internet. Cotiza honesto o no cotices.',
      checklist: [
        'Verificar marca Tier 1 BloombergNEF (no aceptar "equivalente" de un supplier desconocido)',
        'Obtener datasheet oficial con Pmax, Voc, Isc, Vmp, Imp, coef. temp, NOCT',
        'Correr PVWatts (gratis, NREL) para proyección honesta con derating por temperatura',
        'Medir shading con Solar Pathfinder o Solmetric SunEye — no "a ojo"',
        'Calcular tilt y azimuth reales del techo (inclinómetro + brújula corregida por declinación)',
        'Seleccionar microinversor Enphase IQ8 o SolarEdge optimizer si hay sombra parcial',
        'Verificar warranty de producto (mínimo 15 años) y de potencia (mínimo 25 años al 84%)',
        'Confirmar certificación UL 1703 / UL 61730 y listing en CEC eligible equipment list',
        'Validar stock del distribuidor antes de cotizar (CED Greentech, Soligent, Krannich, Greentech Renewables)',
        'Incluir cláusula en contrato: producción estimada ±10% de PVWatts simulation'
      ],
      commonMistakes: [
        'Cotizar kWh usando STC en lugar de NOCT — overpromise 20-30%',
        'Confundir kW con kWh en conversación con cliente — pierdes credibilidad instantánea',
        'Usar panel Tier 3 por márgen extra — en 10 años warranty es papel mojado',
        'Ignorar sombra parcial pensando que "no es tan grave" — mata 40-60% del string',
        'Instalar en techo que mira norte "porque no había otro espacio" — producción 50% menos',
        'No verificar CEC eligible list — el sistema no califica para rebates ni NEM',
        'Usar inversor string central en techo con obstrucciones en lugar de microinversores'
      ]
    },

    // ========================================================
    // SECCION 2: GRID-TIE NEM
    // ========================================================
    {
      id: 'grid-tie-nem',
      heading: 'Grid-Tie con NEM 3.0 — cómo cambió el juego en California',
      body: `
        <p><strong>El 15 de abril de 2023 California mató el modelo de solar residencial que había funcionado por 20 años.</strong> Ese día entró en vigor NEM 3.0 (<em>Net Billing Tariff</em>, o NBT), que reemplazó al <em>Net Energy Metering</em> 2.0 para todos los sistemas nuevos interconectados en PG&E, SCE y SDG&E. El cliente que instaló NEM 2.0 antes del 14 de abril 2023 está <em>grandfathered</em> por 20 años — sigue recibiendo crédito 1:1. El cliente que instala después, NO. Y la diferencia financiera es brutal.</p>

        <p><strong>NEM 1.0 y 2.0 — el modelo viejo:</strong> por cada kWh que exportabas a la red, recibías crédito equivalente a la tarifa <em>retail</em> — típicamente 25-40¢/kWh en peak y 18-25¢ en off-peak. El medidor literalmente corría hacia atrás. <em>Payback</em> de un sistema 8 kW: 5-7 años. Gran <em>deal</em>.</p>

        <p><strong>NEM 3.0 / NBT — el modelo nuevo:</strong> el cliente ya NO recibe crédito <em>retail</em> por exportación. Recibe el <em>Avoided Cost Calculator</em> rate — una tarifa basada en el valor mayorista de la energía en el momento exacto que exportas. Números reales 2024-2026:</p>
        <ul>
          <li><strong>Exportación 10am-3pm (sol alto, red saturada):</strong> 3-8¢/kWh.</li>
          <li><strong>Exportación 4pm-9pm (peak demand):</strong> 25-65¢/kWh (a veces más).</li>
          <li><strong>Importación cliente (lo que pagas a PG&E):</strong> 28-52¢/kWh en peak, 20-32¢ off-peak con TOU-D-PRIME.</li>
        </ul>

        <p>Traducción: <em>si generas al mediodía y exportas, te pagan centavos. Si importas en la tarde, pagas quarter por kWh</em>. Ese spread es lo que cambió todo.</p>

        <p><strong>Por qué la batería ahora es casi obligatoria.</strong> Sin batería, tu sistema PV exporta el mediodía (cuando nadie está en casa y vale 5¢), y el cliente importa en la tarde (cuando llega a poner el AC a 72°F y vale 45¢). El cliente <em>paga PG&E aunque tenga solar</em>. Con batería, el sistema almacena la generación del mediodía y la descarga 4pm-9pm, evitando importación cara. El <em>payback</em> de PV+battery bajo NEM 3.0 queda en 8-11 años — todavía rentable, pero ya no es el 5-7 del NEM 2.0.</p>

        <p><strong>Peak shaving vs self-consumption — las dos estrategias de diseño.</strong></p>
        <ul>
          <li><strong>Self-consumption maximization:</strong> dimensionar PV + batería para cubrir TODO el consumo nocturno 4pm-9pm. Batería grande (15-20 kWh), PV dimensionado al 110-120% del consumo anual. Factura PG&E queda en $10-$20/mes mínimo (solo cargo fijo). Cliente paranóico de blackouts ama esto.</li>
          <li><strong>Peak shaving únicamente:</strong> batería pequeña (10-13 kWh) descarga solo durante peak 4pm-9pm. Sistema PV más pequeño. <em>Payback</em> más rápido, pero factura no llega a cero.</li>
        </ul>

        <p>Para mayoría de clientes residenciales en CA 2026, <em>self-consumption con Powerwall 3 / IQ Battery 10C y PV 8-12 kW</em> es el <em>sweet spot</em>. Paga el Powerwall en 7-9 años solo con el ahorro de TOU.</p>

        <p><strong>Time-of-Use plans que debes conocer.</strong> Todo cliente con solar en CA está forzado a un plan TOU (no flat rate). Los principales:</p>
        <ul>
          <li><strong>PG&E E-ELEC:</strong> plan solar + battery moderno. Peak 4pm-9pm ($0.45-$0.52/kWh). Off-peak noche + día hasta 4pm ($0.30-$0.34). Cargo fijo $15/mes.</li>
          <li><strong>PG&E EV2-A:</strong> si tiene carro eléctrico. Super off-peak 12am-3pm ($0.22). Peak 4pm-9pm ($0.55). Ideal para casa con EV + solar + battery.</li>
          <li><strong>SCE TOU-D-PRIME:</strong> similar a E-ELEC. Peak 4pm-9pm ($0.44). Off-peak ($0.28).</li>
          <li><strong>SDG&E EV-TOU-5:</strong> peak 4pm-9pm ($0.52). Super off-peak 12am-6am ($0.20).</li>
        </ul>

        <p><strong>Interconnect paperwork — el dolor administrativo.</strong> Antes de que el sistema pueda operar legalmente, el cliente necesita <em>Permission to Operate</em> (PTO) de la utilidad. El proceso:</p>
        <ul>
          <li><strong>1. Building permit</strong> del <em>Building Department</em> local (ciudad o condado). $200-$800 típico, plan check 2-4 semanas.</li>
          <li><strong>2. Interconnect application</strong> a la utility (PG&E, SCE, SDG&E). Online portal. Incluye single-line diagram, spec sheets, site plan. 2-6 semanas de review.</li>
          <li><strong>3. Final inspection</strong> por el <em>Building Dept</em>. Verifica installation, labeling, grounding, rapid shutdown, AFCI, GFCI.</li>
          <li><strong>4. Utility meter swap</strong> (la PG&E instala net meter bidireccional). 1-4 semanas de espera.</li>
          <li><strong>5. PTO letter</strong> — el email que le da al cliente permiso legal de activar el inversor.</li>
        </ul>

        <p>Tiempo total desde firma del contrato a PTO: <strong>8-16 semanas en CA, típicamente 10-12</strong>. Si algún contratista te promete "2 semanas", está mintiendo o haciendo algo ilegal.</p>

        <p><strong>Export limits y curtailment.</strong> Algunos circuitos distribucionales ya están saturados de solar. PG&E puede requerir <em>export limiting</em> (el inversor corta exportación cuando la red está sobrecargada) o negarte interconnect en el circuito. Enphase IQ8 y Tesla Inverter soportan <em>export control</em> nativo. Si vives en una zona de "solar ya saturado" (partes de San Diego County, parts of Fresno), revísalo en el <em>ICA map</em> (Integration Capacity Analysis) de tu utility antes de cotizar.</p>
      `,
      keyPoints: [
        'NEM 3.0 entró 4/15/2023 — exportación paga 3-8¢, importación cobra 28-52¢/kWh',
        'Sin batería bajo NEM 3.0, payback saltó de 5-7 años a 12-15 años — el modelo ya no funciona',
        'Con PV + Powerwall/IQ Battery, payback vuelve a 8-11 años — sweet spot del mercado actual',
        'Plan TOU obligatorio: E-ELEC (PG&E), TOU-D-PRIME (SCE), EV-TOU-5 (SDG&E)',
        'PTO process: permit + interconnect app + inspección + meter swap = 8-16 semanas',
        'NEM 2.0 grandfathered 20 años — sistemas pre-abril 2023 mantienen crédito 1:1',
        'Revisa ICA map de utility antes de cotizar — algunos circuitos ya están saturados'
      ],
      realTalk: 'Si alguien te dice que "solar en CA ya no sirve", no entendió NEM 3.0. Solar sin batería ya no sirve, eso es cierto. Pero PV + battery bajo NEM 3.0 todavía regresa 10-12% IRR con ITC federal + SGIP. El problema no es el modelo — es el vendedor que sigue cotizando como si fuera 2019.',
      checklist: [
        'Pull 12 meses de bills PG&E/SCE/SDG&E del cliente ANTES de diseñar',
        'Confirmar schedule actual (E-TOU-C, E-1) y cambio obligatorio a E-ELEC/TOU-D-PRIME',
        'Correr análisis en HelioScope / Aurora / Energy Toolbase con NEM 3.0 export rates',
        'Dimensionar batería mínimo 10-13 kWh para peak shaving, 15-20 kWh para near-zero bill',
        'Verificar ICA map de utility para export limits en el circuito del cliente',
        'Preparar single-line diagram firmado por EE (Electrical Engineer) si sistema > 30 kW',
        'Submit interconnect application online en utility portal (PG&E Interconnection, SCE Connected)',
        'Coordinate inspection del Building Dept ANTES de solicitar meter swap',
        'Entregar al cliente PTO letter archivada + net meter reading inicial',
        'Programar check-in 30 días post-PTO para validar producción vs simulación'
      ],
      commonMistakes: [
        'Cotizar PV-only bajo NEM 3.0 pensando que todavía es rentable — cliente va a demandar a los 2 años',
        'Usar simulación con NEM 2.0 rates en cotización post-abril 2023 — ilegal misrepresentation',
        'Olvidar cambio obligatorio a TOU — cliente con schedule E-1 no puede mantenerlo con solar',
        'Prometer "2 semanas a PTO" — el cliente te odia cuando tarda 12 semanas reales',
        'No coordinar final inspection + meter swap — sistema listo pero sin PTO 4 semanas extra',
        'Ignorar ICA map — te aprueban pero con export limiting severo que mata producción',
        'No entregar copia de PTO al cliente — si PG&E le cobra mal, no tiene defensa legal'
      ]
    },

    // ========================================================
    // SECCION 3: OFF-GRID SIZING
    // ========================================================
    {
      id: 'off-grid-sizing',
      heading: 'Off-Grid — cuándo sí y cuándo no, y cómo se dimensiona',
      body: `
        <p><strong>Off-grid NO es para la casa suburbia promedio.</strong> La casa en Riverside con AC central, 2 refrigeradores, pool pump y EV NO debe ser off-grid — económicamente es un desastre ($80K-$150K para replicar la red). Off-grid tiene sentido en casos específicos donde extender grid cuesta más que generar: <em>remote cabin</em> a 1 mile del poste más cercano ($15K-$50K de <em>line extension</em>), <em>well pump</em> en rancho agrícola, <em>off-grid tiny home</em> o ADU en terreno sin servicio, agricultura remota (pivotes de riego), RV / <em>van life</em>. Si te llega un lead off-grid, primero pregunta: <strong>¿cuánto cobra la utility por line extension?</strong> Si es menos de $25K, que se conecte a la red.</p>

        <p><strong>El proceso de dimensionamiento off-grid — 5 pasos en orden:</strong></p>

        <p><strong>Paso 1: Load calc diario en Wh.</strong> Lista TODO electrodoméstico, multiplica watts × horas uso diario. Ejemplo cabin remota:</p>
        <ul>
          <li>Refrigerador 12V (120W run, 30% duty cycle, 24h) = 864 Wh/día</li>
          <li>Luces LED (80W × 4h) = 320 Wh/día</li>
          <li>Bomba de agua (500W × 0.5h) = 250 Wh/día</li>
          <li>TV + wifi (80W × 4h) = 320 Wh/día</li>
          <li>Laptop + cargadores (60W × 6h) = 360 Wh/día</li>
          <li>Microondas ocasional (1200W × 10min) = 200 Wh/día</li>
          <li>Bomba calor mini-split 9kBTU (600W × 4h) = 2,400 Wh/día</li>
          <li><strong>Total: ~4,700 Wh/día = 4.7 kWh/día</strong></li>
        </ul>

        <p>Suma 15-25% para <em>phantom loads</em> y pérdidas del inversor: <strong>~5.8 kWh/día de demanda real</strong>.</p>

        <p><strong>Paso 2: Peor mes de producción (no promedio anual).</strong> En Sierra Nevada, enero tiene 2.5-3.5 PSH (vs 6.5 en julio). Dimensionar al promedio anual te deja sin energía en invierno. Off-grid <em>siempre se diseña al peor mes</em>.</p>

        <p><strong>Paso 3: Autonomía (días de reserva sin sol).</strong> California inland: 3 días típico. Costa foggy (Mendocino, Humboldt): 4-5 días. Sierra con tormentas: 5-7 días. Multiplica: demanda diaria × días autonomía = energía total del banco de baterías.</p>
        <p>Ejemplo: 5.8 kWh/día × 3 días = <strong>17.4 kWh</strong> de batería útil mínima.</p>

        <p><strong>Paso 4: Ajuste por Depth of Discharge (DoD).</strong> No puedes descargar 100% de una batería — la destruye. Factores típicos:</p>
        <ul>
          <li><strong>Plomo-ácido inundada (<em>flooded lead-acid</em>):</strong> DoD 50% max. Económicas pero voluminosas, requieren ventilación, ácido sulfúrico, mantenimiento mensual. Trojan L16 es clásica.</li>
          <li><strong>AGM / Gel:</strong> DoD 50-60%. Sealed, sin mantenimiento. 8-10 años vida útil. Discover AGM.</li>
          <li><strong>Litio LFP (LiFePO₄):</strong> DoD 80-90%. 6,000-10,000 ciclos. Sin mantenimiento. Más caras upfront pero 3x vida útil. Victron, Battle Born, EG4, SOK, Fortress eFlex, Pytes. <em>El estándar moderno off-grid</em>.</li>
        </ul>

        <p>Con LFP al 90% DoD: 17.4 kWh / 0.90 = <strong>19.3 kWh nominales</strong>. Con lead-acid al 50%: 17.4 / 0.50 = <strong>34.8 kWh nominales</strong>. Por eso ya casi nadie usa plomo en instalaciones serias.</p>

        <p><strong>Paso 5: Array PV dimensionado al peor mes.</strong> Con 2.8 PSH en enero, array debe generar 5.8 kWh × 1.25 (eficiencia sistema 80%) = 7.25 kWh / 2.8 PSH = <strong>2.6 kW de array mínimo</strong>. En realidad, subes a 3.5-4 kW para recuperar el banco tras día nublado. <em>Off-grid siempre se sobredimensiona el array</em> — es más barato que una batería más grande.</p>

        <p><strong>Paso 6: Inversor off-grid y charge controller.</strong> El inversor off-grid (Schneider XW Pro, Victron Quattro, Outback Radian, EG4 18kPV, Sol-Ark 15K) maneja conversión DC→AC + charge del banco + generator input. Sizing: continuous rating debe cubrir <em>surge</em> de arranque — motor de 1HP jala 3-5x nominal en el arranque. Un inversor 6kW continuous / 12kW surge cubre cabin típica.</p>
        <p>MPPT <em>charge controller</em> (si el inversor no lo trae integrado): Victron SmartSolar, Midnite Classic, Magnum. Dimensiona al Voc del string × 1.25 (factor frío) y al Isc × 1.25. Controller 150V/60A cubre string residencial típico.</p>

        <p><strong>Costo típico de kit off-grid instalado CA 2026:</strong></p>
        <ul>
          <li><strong>Cabin pequeña 3-5 kWh/día:</strong> $18K-$28K (3kW PV + 15 kWh LFP + Sol-Ark 8K + balance of system).</li>
          <li><strong>Casa off-grid 10-15 kWh/día:</strong> $45K-$70K (8kW PV + 30 kWh LFP + inversor 12kW + generador backup diesel/LP).</li>
          <li><strong>Rancho / agricultural off-grid:</strong> $80K-$200K+ según carga.</li>
        </ul>

        <p><strong>Generator backup — obligatorio off-grid.</strong> Ningún sistema off-grid debe operar sin generator de respaldo. 5-7 días de clima nublado agotan el banco. LP (propano) 10-14kW Generac o Kohler, integrado al inversor vía <em>auto-start</em> cuando batería baja a 30-40% SOC.</p>
      `,
      keyPoints: [
        'Off-grid solo tiene sentido si line extension cuesta >$25K — si no, conéctate a la red',
        'Load calc diario en Wh, peor mes de producción (no promedio), autonomía 3-5 días típico CA',
        'LFP (LiFePO₄) es el estándar moderno: DoD 90%, 6,000-10,000 ciclos, vs plomo 50% DoD',
        'Off-grid siempre sobredimensiona el array PV — más barato que más batería',
        'Inversor debe cubrir surge 2-3x continuous (motor start): Sol-Ark, Schneider XW, Victron Quattro',
        'Generator backup obligatorio (LP/diesel) — 5+ días nublados agotan banco',
        'Costo: cabin 3-5 kWh/día $18-28K; casa 10-15 kWh/día $45-70K; rancho $80K+'
      ],
      realTalk: 'El cliente que te dice "quiero ser off-grid para no depender de PG&E" en una casa suburbia de Riverside no quiere off-grid — quiere battery backup con grid-tie. Off-grid es 3-5x más caro y tiene fallas. Si le sales con $80K cuando un Powerwall + PV le resuelve por $35K, estás vendiendo mal.',
      checklist: [
        'Validar que line extension utility cueste más que sistema off-grid — si no, descartar off-grid',
        'Load calc detallado por electrodoméstico con duty cycle realista, no nameplate',
        'Seleccionar peor mes de PSH del sitio (no promedio anual) usando NREL PVWatts monthly',
        'Dimensionar batería LFP con 3-5 días autonomía y 85-90% DoD usable',
        'Sobredimensionar array PV 25-40% sobre cálculo mínimo para recuperación post-nublado',
        'Especificar inversor con surge mínimo 2x continuous + auto-start de generator',
        'Incluir generator LP/diesel 10-14kW con auto-transfer al inversor',
        'Ventilación adecuada del banco (aun LFP produce calor en carga rápida)',
        'Sistema de monitoreo remoto (Victron Cerbo GX, Sol-Ark app) — cliente DEBE ver SOC',
        'Contrato con disclaimer claro: "sistema requiere generator backup para 100% uptime"'
      ],
      commonMistakes: [
        'Dimensionar al promedio anual en lugar de peor mes — cliente sin luz en enero',
        'Usar plomo-ácido para ahorrar $3K upfront — cliente reemplaza banco a los 5 años',
        'Olvidar el surge del inversor — bomba de pozo no arranca, cliente enojado',
        'No incluir generator backup — sistema falla la primera semana nublada',
        'Subestimar phantom loads (chargers, standby) — 15-25% extra que nadie calcula',
        'Instalar en zona costa foggy sin considerar 4-5 días autonomía — banco chico muere rápido',
        'No entrenar al cliente en SOC monitoring — descarga total mata la batería'
      ]
    },

    // ========================================================
    // SECCION 4: BATTERY BACKUP HYBRID
    // ========================================================
    {
      id: 'battery-backup-hybrid',
      heading: 'Battery Backup / Hybrid — el mercado #1 de 2026',
      body: `
        <p><strong>Battery backup con grid-tie (hybrid) es el producto más caliente de California en 2026.</strong> El combo perfecto de 3 drivers: (1) NEM 3.0 hace la batería financieramente necesaria, (2) PSPS de PG&E deja a clientes sin luz 2-5 días al año y ya están hartos, (3) SGIP + ITC federal pagan 30-70% del costo del equipo. Un Powerwall 3 que costaba $15,000 instalado en 2022 sale al cliente a $6,500-$9,500 post-incentivos en 2026. <em>Ese es tu upsell</em>.</p>

        <p><strong>Las plataformas que DEBES conocer en 2026:</strong></p>

        <p><strong>Tesla Powerwall 3</strong> — lanzado 2023, ahora el <em>market leader</em>. 13.5 kWh útiles, 11.5 kW continuous, 185A LRA de motor start. Inversor hybrid integrado 11.5 kW AC — puede hacer DC-coupled con paneles directamente (ya no necesita inversor PV separado). Precio wholesale instalador: $9,500-$11,000. Precio cliente instalado: $13,500-$16,000 pre-incentivos. App Tesla es el estándar de la industria. Warranty 10 años, 70% capacity retention.</p>

        <p><strong>Enphase IQ Battery 5P / 10C</strong> — modular 5 kWh / 10 kWh unidades. IQ8H-BAT microinversores integrados, AC-coupled nativo. Diseñado para integrarse perfectamente con Enphase IQ8+ / IQ8M microinversores PV (misma plataforma Enlighten). Precio: IQ Battery 5P ~$4,800 wholesale / $7,200 cliente. 10C ~$8,500 / $12,500. <em>El mejor match si el cliente ya tiene Enphase en los paneles</em>.</p>

        <p><strong>FranklinWH aPower 2</strong> — sistema 15 kWh con <em>aGate</em> management unit. 12 kW continuous, 22 kW surge 10 sec. Soporta <em>stacking</em> hasta 8 unidades (120 kWh). Growth 2024-2025 rápida. Precio: $9,800-$11,500 wholesale, $14K-$17K cliente. Buen contender contra Powerwall cuando cliente quiere scalability.</p>

        <p><strong>SolarEdge Home Battery (Energy Bank)</strong> — 9.7 kWh modular, pairs con SolarEdge HD-Wave / Energy Hub inverter. DC-coupled. Precio más bajo ($6,500 wholesale) pero ecosistema más pequeño que Tesla/Enphase. Bueno para sistemas SolarEdge existentes.</p>

        <p><strong>LG ESS (RESU FLEX / Prime)</strong> — LG salió del residential USA en 2023-2024 por problemas de warranty masivos (incendios en modelo RH). <em>No recomiendo instalar LG nuevo en 2026</em> hasta que estabilicen la línea.</p>

        <p><strong>SunVault (SunPower)</strong> — descontinuado tras bancarrota SunPower 2024. Warranty en cuestión.</p>

        <p><strong>Emporia / BigBattery / EG4 / Fortress</strong> — categoría <em>value</em> (bajo costo). EG4 PowerPro 14.3 kWh a $5,500 wholesale — 40% más barato que Powerwall. <em>Trade-off:</em> soporte técnico más débil, warranty más corta, UI menos pulida. Buenos para cliente consciente de precio si el contratista tiene capacidad de autoreparar.</p>

        <p><strong>AC-coupled vs DC-coupled — la decisión arquitectónica.</strong></p>
        <ul>
          <li><strong>AC-coupled:</strong> batería tiene su propio inversor. PV produce DC → inversor PV → AC → batería inversor → AC → casa/grid. Dos conversiones, ~92% eficiencia round-trip. Ventaja: se retrofitea a sistema PV existente sin tocar los paneles. <strong>Enphase IQ Battery, Tesla Powerwall 2 eran AC-coupled</strong>.</li>
          <li><strong>DC-coupled:</strong> batería comparte inversor con PV. DC → batería directamente o → inversor hybrid → AC. Una sola conversión, ~96% eficiencia. Mejor para sistemas nuevos. <strong>Tesla Powerwall 3, SolarEdge Home Battery, FranklinWH son DC-coupled / hybrid</strong>.</li>
        </ul>

        <p>Retrofit a casa con PV existente = AC-coupled (más fácil). Construcción nueva PV+battery = DC-coupled (más eficiente, más barato). Si el cliente tiene Enphase microinversores, <em>obligatorio IQ Battery</em> (ecosistema integrado).</p>

        <p><strong>Whole-home backup vs critical-loads panel.</strong> Dos arquitecturas según el budget y el load del cliente:</p>
        <ul>
          <li><strong>Whole-home backup:</strong> la batería + inversor tiene capacidad para correr TODA la casa durante outage (AC central incluido). Requiere 1-2 Powerwalls o aPower 2 o 2 IQ Battery 10C. Costo: $25K-$40K. Cliente no siente el apagón.</li>
          <li><strong>Critical-loads backup (sub-panel):</strong> instalas un sub-panel con solo cargas críticas (fridge, freezer, luces, wifi, 1 room AC mini-split, puerta de garage, seguridad). 1 batería de 10-13 kWh es suficiente. Costo: $15K-$22K. Cliente vive "básico" durante outage.</li>
        </ul>

        <p>Para mayoría de clientes CA 2026, <em>critical loads con 1 Powerwall 3 o IQ 10C es el sweet spot financiero</em>. Whole-home full AC requiere 2+ baterías y cliente de $200K+ ingresos.</p>

        <p><strong>SGIP — dinero que no todos los contratistas saben cobrar.</strong> El <em>Self-Generation Incentive Program</em> de California paga por kWh de batería instalada. Tiers 2024-2026:</p>
        <ul>
          <li><strong>General Market:</strong> $150-$200/kWh. Powerwall 3 (13.5 kWh) = $2,025-$2,700.</li>
          <li><strong>Equity Resiliency (cliente en zona de alto riesgo de fuego + ingresos calificados):</strong> $850-$1,000/kWh. Powerwall 3 = $11,475-$13,500 — <em>la batería prácticamente gratis</em>.</li>
          <li><strong>Equity budget (low-income):</strong> $350-$500/kWh.</li>
        </ul>

        <p>SGIP se aplica PRE-incentivo al cliente. El contratista somete la aplicación en nombre del cliente vía el program administrator (PG&E, SCE, SoCalGas, CSE). Si no sabes aplicar al SGIP, estás dejando $2K-$13K en la mesa en cada instalación.</p>

        <p><strong>ITC federal 30%.</strong> El <em>Investment Tax Credit</em> paga 30% del costo TOTAL del sistema (PV + battery + labor + permits) como crédito fiscal federal. Vigente 30% hasta 2032, 26% en 2033, 22% en 2034, elimina 2035. <em>Battery standalone (sin PV) también califica desde 2023 si es ≥3 kWh</em> — IRA 2022. El cliente debe tener <em>tax liability</em> para consumir el crédito (si no paga impuestos federales, no aplica). <em>Carryforward</em> disponible hasta 20 años.</p>

        <p><strong>Payback analysis real — ejemplo cliente PG&E en 2026:</strong></p>
        <ul>
          <li>Bill actual PG&E: $380/mes = $4,560/año</li>
          <li>Sistema: 9 kW PV (Enphase IQ8M) + IQ Battery 10C = $38,500 cliente pre-incentivos</li>
          <li>SGIP General Market ($170/kWh × 10.08 kWh) = -$1,714</li>
          <li>ITC federal 30% = -$11,036</li>
          <li><strong>Costo neto cliente: ~$25,750</strong></li>
          <li>Ahorro anual año 1: ~$3,800 (reduce bill a $60/mes)</li>
          <li><strong>Payback: ~6.8 años. IRR 25 años: 11-13%.</strong></li>
        </ul>

        <p>Ese es el <em>pitch</em> que cierra. "Cliente, en 7 años ya pagaste el sistema, y tienes 23 años más de energía prácticamente gratis + blackout protection."</p>
      `,
      keyPoints: [
        'Tesla Powerwall 3 (13.5 kWh, hybrid DC-coupled) = market leader 2026; $13-16K cliente pre-incentivos',
        'Enphase IQ Battery 5P/10C — obligatorio si sistema PV ya tiene microinversores Enphase',
        'FranklinWH aPower 2 — scalable, 15 kWh, surge 22 kW; buen contender vs Powerwall',
        'SGIP CA: $150-200/kWh General, $850-1000/kWh Equity Resiliency (zonas alto riesgo fuego)',
        'ITC federal 30% hasta 2032 — aplica a battery standalone desde IRA 2022',
        'AC-coupled para retrofit a PV existente; DC-coupled (hybrid) para sistema nuevo',
        'Critical-loads sub-panel ($15-22K) vs whole-home backup ($25-40K) según budget cliente'
      ],
      realTalk: 'El cliente que tiene AC central, piscina y $250K ingreso quiere whole-home con 2 Powerwalls. El cliente promedio de $120K quiere critical loads con 1 Powerwall. Si cotizas lo mismo para los dos, pierdes al de abajo por precio y al de arriba por falta de ambición. Clasifica al cliente primero.',
      checklist: [
        'Verificar zona Tier 2/3 fire map para elegibilidad SGIP Equity Resiliency',
        'Pull tax liability estimada con cliente para validar uso de ITC 30%',
        'Seleccionar AC-coupled vs DC-coupled según PV existente (retrofit) o nuevo',
        'Calcular critical-loads sub-panel vs whole-home según budget y consumo nocturno',
        'Submit SGIP application vía program administrator ANTES de interconnect',
        'Especificar UL 9540 / UL 9540A listing para cumplir código NEC 706',
        'Coordinar labeling del ESS (NEC 706.15): arc-flash, disconnect, emergency shutoff',
        'Entrenar cliente en app (Tesla, Enlighten, FranklinWH) — SOC monitoring daily',
        'Entregar documentación para IRS Form 5695 (Residential Energy Credit)',
        'Follow-up 30 días post-PTO: validar SOC cycling + app alerts configurados'
      ],
      commonMistakes: [
        'Cotizar Powerwall 3 a casa con Enphase — perder integración Enlighten y app fragmentada',
        'No aplicar SGIP Equity Resiliency en zona Tier 3 — dejar $10K+ en la mesa',
        'Prometer ITC sin verificar tax liability — cliente no puede consumir crédito, se enoja',
        'Whole-home backup sin hacer load calc — batería chica no arranca AC central',
        'AC-coupled en construcción nueva cuando DC-coupled (hybrid) es 6-8% más eficiente',
        'Ignorar labeling NEC 706 — fail en inspección, retraso de 2-4 semanas',
        'No configurar app para el cliente — reviews 1-estrella por "no sé cómo funciona"'
      ]
    },

    // ========================================================
    // SECCION 5: EMERGENCY TRANSFER
    // ========================================================
    {
      id: 'emergency-transfer',
      heading: 'Emergency Connections y Transfer Switches — NEC 702 no es opcional',
      body: `
        <p><strong>El error que mata lineros — literal.</strong> Cliente compra generador portátil de $800 en Home Depot tras un PSPS. Lo conecta a la casa usando un "suicide cord" (macho-macho) por el receptáculo de la dryer. Cuando PG&E restaura el servicio, el generador backfeedea por el meter a la red de baja tensión (240V), sube al transformador (al revés: 240V → 7.2kV), y mata al técnico de PG&E que está trabajando en el poste pensando que la línea está desenergizada. Esto NO es teoría — pasa todos los años. <strong>NEC 702.4 y NEC 702.5 exigen separación física entre generator y utility feed</strong>. El mecanismo que garantiza esa separación es el <em>transfer switch</em> o <em>interlock kit</em>.</p>

        <p><strong>Las 3 opciones de código-compliant, en orden de precio:</strong></p>

        <p><strong>1. Interlock Kit ($100-$300 material + $400-$800 labor) — la opción económica y legítima.</strong> Es una placa metálica deslizante que se instala en el breaker panel. Bloquea físicamente la posibilidad de tener el <em>main breaker</em> (utility) y el <em>generator breaker</em> ambos cerrados al mismo tiempo. Para activar el generador, cliente: (a) baja el main breaker, (b) desliza el interlock, (c) sube el generator breaker. La separación física es mecánica — es imposible electrificar ambas fuentes a la vez. <strong>UL listed, NEC 702.5(B) compliant</strong>.</p>
        <p>Fabricantes que aprueban el interlock en sus paneles: Square D QO, Siemens, Eaton BR/CH, GE. <em>Nunca instales un interlock genérico de $30 de Amazon en un panel Siemens — eso es violación de código y la warranty del panel se cancela</em>. Usa el kit OEM específico ($120-$250).</p>

        <p>Ideal para: cliente con generator portátil 5-10kW, budget ajustado, dispuesto a operar manualmente durante outage.</p>

        <p><strong>2. Manual Transfer Switch ($300-$800 material + $600-$1200 labor).</strong> Es una caja separada (6-10 circuitos típico) que se instala al lado del panel principal. Cada circuito crítico se "mueve" al transfer switch. Durante operación normal, los switches están en "Line" (utility). Durante outage, cliente: (a) arranca generator, (b) mueve cada switch individual a "Gen". Fabricantes: Reliance Controls (30310A, 31410B), Generac (6375, 6376), GE.</p>
        <p>Ventaja vs interlock: <em>cliente puede seleccionar qué circuitos energizar</em> — no prende TODO, solo los críticos, para no exceder la capacidad del generator. Desventaja: mueves un panel secundario con solo 6-10 circuitos (no whole-home).</p>

        <p>Ideal para: cliente que quiere respaldo de circuitos específicos (fridge + freezer + luces + wifi + bomba de sump + bomba de pozo) con generator 7-10 kW.</p>

        <p><strong>3. Automatic Transfer Switch (ATS) ($800-$2,500 material + $1,200-$2,500 labor).</strong> Switch motorizado que detecta outage, arranca el generator, transfiere la carga en 10-30 segundos, y revierte automáticamente cuando vuelve la luz. Fabricantes: Generac RXSW, Kohler RXT, Cummins RA, ASCO, Eaton.</p>
        <p>Pairing obligatorio con <em>standby generator</em> permanente (Generac Guardian, Kohler, Cummins, Briggs). Cliente NO hace nada durante outage — transición invisible excepto el "tick" del transfer (2-30 segundos de blackout típico). Service entrance ATS (whole-home) o critical-loads ATS (sub-panel).</p>

        <p>Ideal para: cliente con standby generator fijo ($8K-$15K), casa con refrigeradores, <em>home office</em>, sistema médico dependiente, budget $$$. Producto <em>premium</em> = margen alto.</p>

        <p><strong>Generator inlet box — el complemento obligatorio del interlock/manual switch.</strong> Para conectar generator portátil, NO usas una extensión normal. Instalas un <em>power inlet box</em> exterior (NEMA L14-30 para 30A/240V o L14-50 para 50A/240V) en la pared de la casa, cerca del generator. Del inlet box → cable SOOW #10 o #6 → breaker en el panel (protegido por interlock/MTS). Fabricantes: Reliance Controls PB30, PB50. Precio: $80-$180.</p>

        <p><strong>Sub-panel transfer (critical loads panel).</strong> Arquitectura de facto en CA 2026 para standby + battery: panel principal queda conectado a utility; un <em>sub-panel de cargas críticas</em> (fridge, freezer, luces, 1-2 outlets de TV/wifi, bomba de sump, mini-split de un cuarto) se alimenta vía ATS desde el standby generator O desde Tesla Gateway / IQ System Controller. Sizing típico: sub-panel 60-100A, 12-20 circuitos.</p>

        <p>Ventaja: durante outage, el inversor batería o el generator solo tiene que alimentar 15-30A en lugar de 200A — extiende <em>runtime</em> significativamente.</p>

        <p><strong>Ejemplo instalación típica casa 2,200 sq ft — generator portátil Honda EU7000iS (7kW) + interlock:</strong></p>
        <ul>
          <li>Generator portátil Honda EU7000iS: $4,500 (cliente aporta o cotizas)</li>
          <li>Interlock kit Square D QO HOMPLK (OEM): $150</li>
          <li>Power inlet box Reliance PB50: $140</li>
          <li>Breaker Square D QO 250A: $95 (o tamaño apropiado)</li>
          <li>Cable SOOW #6/4 10 ft con L14-30P ambos extremos: $180</li>
          <li>Labor 6-8 horas (incluye pull permit): $750-$1,100</li>
          <li><strong>Total instalado sin generator: $1,300-$1,700</strong></li>
          <li><strong>Con generator Honda: $5,800-$6,200 instalado</strong></li>
        </ul>

        <p><strong>Permit requerido.</strong> Todo trabajo en el breaker panel de casa habitada requiere <em>electrical permit</em> del Building Dept local. $80-$180. Inspector verifica: labeling ("Generator Power — Disconnect Utility Before Operating"), torque en breaker, cable sizing, grounding, interlock operation. Hacer el trabajo sin permit = violation + fine + te quitan la licencia C-10/C-46 si te reportan.</p>
      `,
      keyPoints: [
        'NEC 702.4 / 702.5 exigen separación física entre generator y utility — backfeed mata lineros',
        'Interlock Kit OEM ($100-300) es código-compliant para generator portátil + panel existente',
        'Manual Transfer Switch ($300-800) = 6-10 circuitos específicos, selección manual',
        'Automatic Transfer Switch ($800-2500) = standby generator, transferencia 10-30 seg',
        'Power inlet box NEMA L14-30 (30A) o L14-50 (50A) obligatorio — no extensión regular',
        'Sub-panel de cargas críticas extiende runtime del battery/generator significativamente',
        'Electrical permit SIEMPRE requerido — inspector verifica labeling, torque, grounding'
      ],
      realTalk: 'Si ves a un cliente con un "suicide cord" enchufado de la dryer al generator, no te voltees. Dile que eso mata a los técnicos de PG&E, que es federal violation, y que por $1,500 instalado le dejas un interlock kit legal. 9 de 10 firman ahí mismo. Ese es un upsell que salva vidas literalmente.',
      checklist: [
        'Pull electrical permit en Building Dept local ANTES de abrir el panel',
        'Verificar que interlock sea OEM del fabricante del panel (Square D, Siemens, Eaton, GE)',
        'Validar sizing del breaker generator = capacidad del inlet box (30A o 50A típico)',
        'Instalar power inlet box NEMA L14-30 o L14-50 en pared exterior, mínimo 18 in del suelo',
        'Labeling código NEC 702.7: "Generator Power Source — Disconnect Utility Before Operating"',
        'Grounding del generator portátil al sistema de grounding de la casa (NEC 250)',
        'Demostrar al cliente la secuencia de operación: (1) main off, (2) interlock slide, (3) gen on',
        'Probar interlock físicamente frente al inspector — mecanismo no permite ambos cerrados',
        'Entregar al cliente manual impreso de operación + video corto en teléfono',
        'Inspección final + sign-off del Building Dept antes de energizar el sistema'
      ],
      commonMistakes: [
        'Usar "suicide cord" macho-macho — federal violation + mata lineros',
        'Instalar interlock genérico de Amazon en panel que no lo aprueba — cancela warranty',
        'Olvidar power inlet box y correr extensión por la ventana — violación código',
        'No entrenar al cliente en la secuencia — el primer outage arranca el gen mal',
        'Trabajar sin permit — CSLB te suspende la licencia si te reportan',
        'Subestimar el breaker generator — breaker 30A con generator de 7kW overcargado',
        'No grounding del generator — riesgo de shock + falla GFCI'
      ]
    },

    // ========================================================
    // SECCION 6: GENERADORES STANDBY
    // ========================================================
    {
      id: 'generadores-standby',
      heading: 'Generadores — portátil vs standby, sizing, y el upsell post-PSPS',
      body: `
        <p><strong>En California en 2026, los generadores standby son el mejor upsell oportunístico del año.</strong> Después del PSPS de septiembre 2024 que dejó a 80,000 hogares sin luz 3-5 días, la demanda de standby generators subió 180% en So-Cal y 240% en el Bay Area. Cliente llega con AC roto, tú llegas, ves que también quiere respaldo, cierras gen + ATS + upsell de $10K-$16K encima del AC. Ese es el mercado.</p>

        <p><strong>Portátil vs Standby — la decisión primaria.</strong></p>
        <ul>
          <li><strong>Portátil (3-10kW):</strong> $500-$5,000. Gasolina (runtime 8-12h por tanque), propano opcional. Cliente arranca manual, mueve a backyard, conecta a inlet box. Honda EU7000iS, Westinghouse WGen9500, Generac GP7500E, Champion 7500. Ruido: 65-76 dB a 23 ft. Almacenamiento: garage + stabilizer en gasolina.</li>
          <li><strong>Standby permanente (8-26kW):</strong> $3,500-$12,000 equipment + $4K-$8K instalación + ATS + gas line. Fijo en concrete pad exterior. Auto-start en outage 10-30 seg. NG (natural gas) o LP (propano). Runtime: <em>ilimitado</em> con NG, 8-40 horas con tanque LP 250-500 gal. Ruido: 58-66 dB (más quiet que portátil).</li>
        </ul>

        <p>Cliente casual con budget bajo y acepta operar manual = portátil. Cliente premium, home office, ancianos, CPAP, seguridad, dispuesto a invertir $15K = standby.</p>

        <p><strong>Sizing — managed loads vs whole-home.</strong> Aquí es donde la mayoría de los contratistas cotizan mal. <em>Un standby 14kW NO corre una casa típica con AC central de 4-5 ton sin management</em>. Fórmula:</p>
        <ul>
          <li><strong>Whole-home UNmanaged:</strong> suma TODOS los running watts + LRA del motor más grande (AC típico 4 ton: running 4kW, LRA 25-35kW). Casa típica 2,200 sq ft con AC central = 22-30 kW requeridos. Eso es un generator 22-26kW = $8,500-$12,000 equipment.</li>
          <li><strong>Whole-home MANAGED:</strong> con <em>load management module</em> (Generac Power Manager, Kohler Load Shed), el gen shed cargas no-críticas durante motor start. Permite gen 14-18 kW para casa 2,200 sq ft. Ahorra $2K-$4K en equipment.</li>
          <li><strong>Critical-loads only (con sub-panel):</strong> gen 10-12 kW maneja fridge + luces + wifi + 1 room mini-split + microwave (no simultáneo). $4,500-$6,500 equipment.</li>
        </ul>

        <p><strong>Para sizing correcto:</strong> usa Generac Sizing Calculator online o Kohler Power Calculator. Input: AC tonnage, electric range Y/N, well pump Y/N, electric dryer Y/N, EV charger Y/N. El tool te da el kW recommended con y sin load management.</p>

        <p><strong>Running watts vs starting watts (LRA) — la trampa del sizing.</strong> Todo motor jala 3-5x el <em>running</em> durante arranque. Un AC de 4 ton con <em>running</em> 4kW puede jalar 22-35kW durante 2-5 segundos. Si tu generator es 14kW continuous y 17.5kW surge, el AC no arranca. Cliente ve luces bajar, gen hace "bzzzt", breaker trip. Por eso los generators se miden en <em>running</em> kW y <em>surge</em> kW — siempre verifica ambos. Un Generac Guardian 22kW tiene 100A LRA interno suficiente para AC 5 ton.</p>

        <p><strong>Gas natural vs LP vs Diesel — trade-offs duros.</strong></p>
        <ul>
          <li><strong>Natural Gas (NG):</strong> línea de la utility. Runtime ilimitado. <em>Requiere gas line upgrade en la mayoría de casas</em> — el gen jala 200-350 CF/hr, y un meter estándar residencial da 250-400 CF/hr total. Si la casa también tiene furnace + water heater + stove a gas, necesitas meter upgrade ($800-$2,500 PG&E). Presión: 7" WC típico residencial, pero gens grandes requieren 11-14" WC — <em>high-pressure regulator + line upgrade</em>. Emisiones más limpias que LP o diesel.</li>
          <li><strong>Liquid Propane (LP):</strong> tanque propietario. 250 gal almacena ~210 gal usables = ~40 horas de runtime a carga completa. 500 gal = ~80 horas. 1000 gal = ~160 horas. Tank rental: $80-$150/año + delivery ($4-$6/gal). Sin línea utility = independiente. <em>Ideal para rural/rancho</em> o casas sin NG.</li>
          <li><strong>Diesel:</strong> comercial / industrial. Runtime largo, fuel storage grande (500-5000 gal). No típico residencial. Más eficiente que gas en emergencias largas. Kohler y Cummins dominan comercial diesel. Ruido más alto.</li>
        </ul>

        <p><strong>Marcas dominantes 2026:</strong></p>
        <ul>
          <li><strong>Generac Guardian (9kW, 14kW, 18kW, 22kW, 24kW, 26kW):</strong> #1 market share USA ~70%. Parts disponibles, network autorizado amplio. Mobile Link monitoring app. Precio wholesale: 14kW ~$3,800, 22kW ~$5,500, 26kW ~$7,200.</li>
          <li><strong>Kohler (14RESAL, 20RESCL, 26RCAL, 30RCL):</strong> premium alternative. Mejor warranty (5 yrs std), Command Controller robust. 25% más caro que Generac equivalent pero mejor reliability en long-term. OnCue Plus monitoring.</li>
          <li><strong>Cummins QuietConnect (13kW, 20kW, 22kW, 25kW):</strong> PowerCommand, Wi-Fi monitoring. 20kW ~$6,200 wholesale. Excelente en load management. Competidor directo a Kohler.</li>
          <li><strong>Briggs & Stratton Fortress:</strong> valor más bajo, residential budget. Warranty más corta. Uso: clientes <em>value-conscious</em>.</li>
          <li><strong>Champion:</strong> portátiles + inverter gens. No compete en standby residencial serio.</li>
        </ul>

        <p><strong>Break-in procedure (primera 25 horas) — paso que casi nadie explica al cliente.</strong> Generador nuevo requiere <em>break-in</em>: operación a 50-75% carga durante las primeras 25 horas (no full load, no idle). Aceite mineral non-synthetic en el break-in; cambio a synthetic 5W-30 post-25h. Saltar break-in = glazing de los cilindros, consumo de aceite a largo plazo, pérdida de compresión.</p>

        <p><strong>Mantenimiento anual obligatorio:</strong></p>
        <ul>
          <li>Cambio de aceite + filtro: anual o cada 100 horas, el que ocurra primero.</li>
          <li>Filtro de aire: anual.</li>
          <li>Bujías: cada 200 horas o 2 años.</li>
          <li>Battery del arranque: 3-5 años vida útil, test con multímetro anual.</li>
          <li>Coolant flush (motores liquid-cooled): cada 3 años.</li>
          <li>Gas line test pressure: anual si tienes licencia C-36 gas.</li>
          <li><strong>Exercise weekly:</strong> 5-10 min semanal (programado en el controller) para circular aceite, cargar battery, validar operación.</li>
        </ul>

        <p>Vende <em>annual maintenance agreement</em> $250-$450/año — margen 60%+, retención de cliente, oportunidad para upsell cada visita.</p>

        <p><strong>Warranty típica:</strong> Generac Guardian 5 años parts + 2 años labor (cuando instalado por <em>authorized dealer</em>). Kohler 5 años comprehensive. Cummins 5 años. <em>Si cliente compra en Costco/Home Depot e instala por su cuenta, warranty baja a 2-3 años</em>. Por eso el <em>authorized dealer pathway</em> es premium — warranty extendida es valor real al cliente.</p>

        <p><strong>Permits requeridos CA:</strong></p>
        <ul>
          <li><strong>Electrical permit:</strong> Building Dept. $150-$400.</li>
          <li><strong>Gas permit:</strong> Building Dept + gas line inspection. $100-$250.</li>
          <li><strong>Building permit:</strong> concrete pad + setback (mínimo 5 ft de casa, 3 ft de property line típico). $200-$500.</li>
          <li><strong>Air Quality Management District (AQMD)</strong> notice en algunos condados (SCAQMD, BAAQMD) para standby > 50 hrs/yr. Residencial típico OK.</li>
          <li><strong>HOA approval</strong> si aplica — muchas HOAs limitan dB levels o location.</li>
        </ul>

        <p><strong>Instalación típica CA 2026 — casa 2,200 sq ft, Generac Guardian 22kW NG:</strong></p>
        <ul>
          <li>Generac Guardian 22kW: $5,500 wholesale / $7,500 cliente</li>
          <li>ATS 200A Generac RTSW200A3: $850 wholesale / $1,200 cliente</li>
          <li>Concrete pad 4x5 ft: $350 labor</li>
          <li>Gas line 3/4" + regulator upgrade 20 ft: $750-$1,200</li>
          <li>Electrical conduit + wire (4/0 AWG) a ATS: $650</li>
          <li>Labor install (2 días, 2 técnicos): $2,400-$3,200</li>
          <li>Permits: $450-$900</li>
          <li>Start-up + first exercise cycle: $250</li>
          <li><strong>Total instalado cliente: $13,500-$16,500</strong></li>
        </ul>
      `,
      keyPoints: [
        'Portátil 3-10kW ($500-5K) = manual operation; Standby 8-26kW ($13-17K instalado) = auto',
        'Sizing: whole-home unmanaged requiere 22-26kW, managed 14-18kW, critical-loads 10-12kW',
        'Running watts vs LRA: AC 4 ton = 4kW running / 25-35kW surge — verifica ambos en gen spec',
        'NG ilimitado pero requiere gas line upgrade ($800-2.5K); LP tank 250gal = ~40h runtime',
        'Generac (70% share USA), Kohler (premium), Cummins (load mgmt), Briggs (budget)',
        'Break-in 25h obligatorio + exercise semanal + maintenance anual ($250-450/año upsell)',
        'Warranty 5 yrs con authorized dealer install; 2-3 yrs si compra Costco/HD self-install'
      ],
      realTalk: 'El cliente que te llama post-PSPS está emocional y firma lo que le pongas enfrente. No abuses — cotiza justo, pero NO hagas el "sizing conservador de $6K" cuando la casa necesita 22kW. En 2 años con otro PSPS va a prender el AC y el gen se va a trip. El cliente va a contar que TU gen falló. Sizing correcto o no vendas.',
      checklist: [
        'Correr Generac/Kohler sizing calculator con all loads — no "a ojo"',
        'Verificar capacidad del gas meter + línea — upgrade si insuficiente',
        'Pull electrical + gas + building permits en Building Dept local',
        'Verificar setbacks HOA + código (5 ft de casa, 3 ft property line típico)',
        'Concrete pad 4x5 ft mínimo, level, con conduits embebidos',
        'Instalar con authorized dealer credentials para warranty extendida',
        'ATS sizing = main breaker rating de la casa (100A / 200A / 400A)',
        'Break-in 25h con aceite mineral antes de synthetic',
        'Programar weekly exercise en controller (5-10 min, típico martes 12:00pm)',
        'Vender annual maintenance agreement $250-450/yr en el cierre — 60%+ margen'
      ],
      commonMistakes: [
        'Sizing a running watts solamente — AC no arranca en el primer outage',
        'Instalar NG sin verificar capacidad del meter — line pressure colapsa con gen + furnace corriendo',
        'Saltar break-in — cliente quema aceite a los 500 horas, reclama warranty, te demanda',
        'No programar weekly exercise — battery muere, gen no arranca el día del outage',
        'Instalar como unauthorized dealer — warranty del cliente queda en 2 años vs 5',
        'Ignorar setback HOA — vecino queja, multa, mover gen $2K+',
        'No vender maintenance agreement — pierdes retención + upsell recurrente'
      ]
    },

    // ========================================================
    // SECCION 7: NEC CODES SOLAR
    // ========================================================
    {
      id: 'nec-codes-solar',
      heading: 'Código NEC 690 / 705 / 706 / 480 — lo que el inspector va a revisar',
      body: `
        <p><strong>Los códigos NEC aplicables a PV, ESS y generator son densos pero específicos.</strong> El inspector del Building Dept no va a hacer el sistema por ti, pero sí te va a reprobar si no cumples. Y reprobar = retrabajo + re-inspección fee + 2-4 semanas de retraso + cliente furioso. Dominar NEC 690, 705, 706 y 480 es la diferencia entre un contratista que pasa inspección la primera vez y uno que vive regresando.</p>

        <p><strong>NEC 690 — Solar Photovoltaic (PV) Systems.</strong> Es el capítulo madre para todo sistema fotovoltaico. Los artículos que más te van a aplicar:</p>
        <ul>
          <li><strong>690.4 — Installation requirements.</strong> Circuitos PV se clasifican como "PV source circuits" (entre módulos y combiner), "PV output circuits" (del combiner al inversor) y "Inverter output circuits" (del inversor a la casa).</li>
          <li><strong>690.7 — Maximum voltage.</strong> Voltaje máximo del string calculado con Voc × <em>temperature correction factor</em> (NEC Table 690.7) para la temperatura mínima histórica del sitio. En So-Cal mínima -5°C, factor 1.10. String Voc nominal 500V × 1.10 = 550V real — debe quedar ≤ 600V residencial (UL) o 1000V commercial.</li>
          <li><strong>690.8 — Ampacity and overcurrent protection.</strong> Conductor sizing = Isc × 1.25 (irradiance factor) × 1.25 (continuous load factor) = Isc × 1.56. Un módulo con Isc 11A requiere conductor de 17.2A mínimo (típicamente #10 AWG PV wire).</li>
          <li><strong>690.12 — Rapid Shutdown (RSD).</strong> <em>El requisito más importante desde NEC 2017</em>. Todo PV residencial en rooftop DEBE tener Rapid Shutdown compliance: dentro de 10 segundos tras activar el disconnect, todos los conductores en el array/rooftop bajan a ≤ 30V (conductor dentro del array) y ≤ 80V (conductor de salida del array). Conseguido vía <em>module-level power electronics</em>:
            <ul>
              <li>Enphase microinversores IQ8+/IQ8M/IQ8A (nativamente RSD compliant)</li>
              <li>SolarEdge optimizers P370/P400/P505 + inverter</li>
              <li>Tigo TS4 + compatible inverter</li>
              <li>AP Systems microinversores</li>
            </ul>
          </li>
          <li><strong>690.31 — Wiring methods.</strong> DC wire en rooftop = <em>PV wire</em> (NEC listed, UV-resistant, TC-ER rated) o USE-2. NO usar THHN en exposición solar — se degrada en 3-5 años.</li>
          <li><strong>690.41 — System grounding.</strong> PV array grounded via equipment grounding conductor (EGC) + bonding de frames metálicos. Ground rod típico + bond al service ground.</li>
          <li><strong>690.43 — Grounding conductors + WEEBs</strong> (Washer Electrical Equipment Bond) entre panel + rail de aluminio.</li>
          <li><strong>690.47 — Grounding electrode system.</strong> Array grounded al mismo sistema que la casa (no separate ground rod).</li>
          <li><strong>690.53 — Labeling.</strong> Placard de "Photovoltaic System Disconnect" con max voltage, max current, fault current. Texto blanco sobre fondo rojo, 3/8" character height mínimo.</li>
        </ul>

        <p><strong>NEC 705 — Interconnected Electric Power Production Sources.</strong> Aplica cuando dos o más fuentes (utility + PV + battery + generator) se conectan al mismo sistema.</p>
        <ul>
          <li><strong>705.12 — Load side connection ("120% rule").</strong> Cuando metes el PV breaker en el panel principal <em>load-side</em> del main breaker, la suma del <em>main breaker + PV breaker</em> no puede exceder 120% del bus rating. Panel 200A bus con main 200A permite breaker PV de 40A máximo (200 + 40 = 240 = 120% de 200). Si el sistema es más grande, requieres <em>line-side tap</em> (antes del main) o <em>supply-side connection</em>.</li>
          <li><strong>705.40 — Disconnect lockable en posición OFF.</strong> AC disconnect visible + lockable exterior de la casa, accesible al utility lineman.</li>
          <li><strong>705.45 — System labeling + one-line diagram</strong> visible en el panel indicando todas las fuentes.</li>
        </ul>

        <p><strong>NEC 706 — Energy Storage Systems (ESS).</strong> Capítulo relativamente nuevo (2017), expandido en 2020 y 2023. Aplica a todo battery storage residencial y comercial.</p>
        <ul>
          <li><strong>706.5 — Listing.</strong> ESS DEBE estar listado UL 9540 (system level) y celdas UL 9540A (thermal runaway propagation test). Tesla Powerwall 3, Enphase IQ Battery, FranklinWH, SolarEdge Home Battery — todos cumplen. Si el equipo NO tiene UL 9540A, el inspector <em>puede</em> reprobar.</li>
          <li><strong>706.7 — Maintenance + commissioning records.</strong> Cliente debe tener documento con specs, commissioning test results, emergency shutdown procedure.</li>
          <li><strong>706.10 — Disconnecting means.</strong> Disconnect exterior para cada ESS, accesible al bombero (labeled "Energy Storage Disconnect").</li>
          <li><strong>706.15 — Labeling extenso.</strong> Voltage, capacity (kWh), chemistry, emergency shutdown steps, location of other ESS. Fire-responsive placard.</li>
          <li><strong>706.20 — Ubicación.</strong> Restrictions on garage (attached) installation — algunos jurisdictions requieren 3 ft de clearance a ventanas/puertas de casa, 5 ft de property line.</li>
          <li><strong>706.30 — Overcurrent protection</strong> en cada battery circuit + fuses en DC combiners.</li>
        </ul>

        <p><strong>NEC 480 — Stationary Standby Batteries.</strong> Applies a banco de baterías (no pre-packaged ESS). Menos relevante en 2026 porque la mayoría de storage es pre-packaged (Powerwall, IQ Battery). Sigue aplicable en DIY residential o off-grid con banco de celdas separadas. Ventilación, bonding, disconnect, overcurrent.</p>

        <p><strong>Arc-Fault (AFCI) — NEC 690.11.</strong> Todo DC PV system > 80V Voc debe tener <em>DC arc-fault circuit interrupter</em> que detecte arco paralelo en el conductor DC y trip en < 2.5 segundos. Integrado en la mayoría de inversores modernos (Enphase IQ8 nativamente, SolarEdge HD-Wave). <em>No es opcional</em>. Si usas inversor viejo sin AFCI, reprobado.</p>

        <p><strong>Ground-Fault (GFCI/GFDI) — NEC 690.5.</strong> Ground-fault detection interrupter para circuitos DC. Detecta leakage de corriente a ground y trip. Integrado en inverters modernos.</p>

        <p><strong>DC conductors — NEC 690.31(G) "Embedded" rules.</strong> Conductor DC dentro del edificio (atrás de drywall, en attic, en crawl space) debe estar en <em>metallic raceway</em> (EMT conduit) o <em>metal-clad cable</em>. Esto es para proteger al bombero — si corta drywall durante fire, no corta un conductor DC energizado. Enphase no aplica (conductores DC solo dentro del panel, AC sale al edificio).</p>

        <p><strong>Labeling obligatorio — lo que el inspector cuenta con linterna:</strong></p>
        <ul>
          <li>AC Disconnect PV system — texto rojo/blanco, Voltage, Max Current, Fault Current (NEC 690.53)</li>
          <li>Utility Main Disconnect indicando "WARNING: MULTIPLE SOURCES — UTILITY + PV + ESS" (NEC 705.10)</li>
          <li>One-line diagram en el panel</li>
          <li>ESS emergency shutdown procedure (NEC 706.15)</li>
          <li>Battery chemistry + capacity (NEC 706.15)</li>
          <li>Rapid Shutdown placard en meter enclosure (NEC 690.56(C))</li>
        </ul>

        <p>Usa Enphase Labels, Tesla Labels oficiales, o HellermannTyton placards impresas — NO Sharpie sobre tape. Inspector lo rechaza.</p>

        <p><strong>HCD vs Building Dept jurisdictions — CA specific.</strong> California tiene una rareza: <em>manufactured homes</em> y <em>mobile homes</em> caen bajo <em>HCD</em> (Housing and Community Development) state agency, NO Building Dept local. Permit process diferente, fees diferentes, inspector diferente. Si tu cliente vive en un <em>mobilehome park</em>, verificar si es HCD-jurisdiction. Casa tradicional = Building Dept del city/county.</p>
      `,
      keyPoints: [
        'NEC 690.12 Rapid Shutdown: obligatorio desde 2017, ≤30V en array dentro de 10 seg',
        'Enphase IQ8 y SolarEdge optimizers/Tigo TS4 son las soluciones RSD compliant residencial',
        '705.12 "120% rule": main breaker + PV breaker ≤ 120% del bus rating del panel',
        'NEC 706 ESS: UL 9540 listing + UL 9540A thermal runaway test obligatorio',
        'DC conductors embebidos requieren metallic raceway (EMT) — NEC 690.31(G)',
        'AFCI (690.11) + GFCI (690.5) integrados en inversores modernos — verificar spec',
        'Labeling: AC disconnect, one-line diagram, ESS emergency shutdown, RSD placard'
      ],
      realTalk: 'El inspector no tiene que saber más que tú — tiene que saber CÓDIGO. Si llegas sin labeling, sin one-line diagram, con conductor DC en romex detrás de drywall, te reprueba en 5 minutos y cobra otra inspección de $180. Pasar inspección la primera vez es skill — no suerte.',
      checklist: [
        'Calcular Voc máximo con factor de temperatura (Table 690.7) — verificar ≤600V residencial',
        'Dimensionar conductores a Isc × 1.56 (irradiance × continuous) — típicamente #10 PV wire',
        'Seleccionar microinversor Enphase IQ8 o SolarEdge optimizers para RSD 690.12',
        'Aplicar 120% rule (705.12) o line-side tap si sistema excede',
        'Confirmar ESS es UL 9540 + UL 9540A listed',
        'Instalar AFCI + GFCI integrados en inverter (no añadir módulo externo si ya está)',
        'DC conductor embebido en metallic raceway (EMT) — no romex',
        'Instalar AC PV Disconnect exterior lockable (705.40) accesible a utility',
        'Labels oficiales (Enphase, Tesla, HellermannTyton) — no Sharpie sobre tape',
        'One-line diagram pegado en interior del panel + copia entregada al cliente'
      ],
      commonMistakes: [
        'Ignorar Rapid Shutdown — sistema sin optimizer/micro reprobado al instante post-2017',
        'Exceder 120% rule en panel 200A con PV >40A breaker — requiere line-side tap',
        'Usar THHN en rooftop en lugar de PV wire — degradación UV en 3-5 años',
        'No calcular Voc con factor temperatura — string excede 600V en día frío',
        'Instalar ESS no-UL 9540 — inspector reprueba + cliente sin seguro en caso de fuego',
        'Conductor DC en romex detrás de drywall — violación 690.31(G)',
        'Labeling en Sharpie o tape — inspector rechaza como no-permanente'
      ]
    },

    // ========================================================
    // SECCION 8: BUSINESS MODEL SOLAR
    // ========================================================
    {
      id: 'business-model-solar',
      heading: 'Cómo Meter Solar a tu Empresa HVAC — revenue model y la trifecta',
      body: `
        <p><strong>La trifecta del contratista moderno 2026: HVAC + Solar + Battery + Generador.</strong> Mismo cliente, mismo truck, mismo <em>trust capital</em> que ya construiste cambiando su AC. El cliente que te dio $18K por un AC-install es 4x más probable de darte $35K por PV+battery y $14K por standby gen. Ese es el <em>upsell</em> que explica por qué las top HVAC companies de California (Service Champions, ARS, Western Heating & AC) ya son solar contractors también. No es coincidencia — es estrategia.</p>

        <p><strong>Los 3 caminos para entrar a solar:</strong></p>

        <p><strong>Camino 1: Sub-contract a solar contractor licenciado.</strong> El más rápido, el menos <em>capital-intensive</em>. Firmas un <em>referral + sub-contract agreement</em> con un solar contractor C-46 existente. El flujo:</p>
        <ul>
          <li>Tú vendes al cliente HVAC, cierras PV+battery a precio retail del solar contractor + 15-25% markup tuyo.</li>
          <li>Solar contractor hace design, permits, install, interconnect. Tu truck NO va al solar install.</li>
          <li>Tú te llevas 15-25% del contrato por <em>referral + sales</em>.</li>
          <li>Tu compañía figura en contrato como <em>sales agent</em>, no contractor. Solar C-46 figura como prime contractor.</li>
        </ul>
        <p>Márgen típico: $5,000-$12,000 por referral en sistema $35K-$55K. Riesgo: bajo. Barrera: cero. <em>Donde empezar si nunca has tocado solar</em>.</p>

        <p><strong>Camino 2: Licencia C-46 propia + in-house team.</strong> El más rentable a largo plazo. Tu compañía saca la C-46 (o expande la C-10 electricista agregando solar). Entrenas o contratas a un <em>solar lead installer</em> + 2 instaladores. Inviertes en herramientas ($8K-$15K: Solar Pathfinder, torque wrenches, fall-protection, MC4 crimper, IR camera, insulation meter).</p>
        <p>Costo inicial: $40K-$80K incluyendo equipment, training, primer truck outfit. Break-even: 8-15 installs. Revenue anual por install crew: $800K-$1.4M con margen neto 18-25%.</p>
        <p>Cuándo tiene sentido: cuando ya cerraste 20+ referrals via Camino 1 y validaste el flujo de leads. No empieces in-house sin demand validada.</p>

        <p><strong>Camino 3: Partnership / JV con solar contractor.</strong> Híbrido. Creas una <em>joint venture</em> 50/50 con un solar contractor establecido. Tú pones leads + sales, él pone instalación + licencia. Pool de ganancia compartido.</p>
        <p>Riesgo: mayor que Camino 1 (shared financial exposure), menor que Camino 2 (no equipment investment). Típico 20-30% de tu net revenue flows to partner. Funciona bien cuando encuentras un solar contractor de confianza, complementario geográficamente.</p>

        <p><strong>C-46 Solar License (CSLB).</strong> La <em>Solar Contractor</em> classification de CSLB — <em>C-46</em>. Requisitos:</p>
        <ul>
          <li>4+ años experiencia verificable en solar installation O licensed solar journeyman</li>
          <li>Pasar examen Law & Business + C-46 Trade Exam</li>
          <li>Bond $25,000 + proof of Workers Comp</li>
          <li>Fees: $330 application + $200 exam + license fee</li>
        </ul>
        <p>Alternativa común: <em>C-10 Electrical Contractor</em> puede instalar PV bajo ciertos límites (el sistema es "parte del electrical system"). Muchos contractors de HVAC que tienen <em>C-20 HVAC</em> también sacan <em>C-10 Electrical</em> como secondary para cubrir solar install.</p>
        <p>Si ya tienes C-20 y quieres solar full legal, saca C-46 adicional. CSLB permite múltiples classifications bajo la misma Corporation/LLC — solo pagas los exams separados.</p>

        <p><strong>Costo típico instalado CA 2026 (PV + battery):</strong></p>
        <ul>
          <li><strong>PV-only (sin battery):</strong> $3.20-$3.80/W. Sistema 8 kW = $25,600-$30,400.</li>
          <li><strong>PV + battery (Powerwall 3 / IQ 10C):</strong> $4.20-$5.00/W equivalent. Sistema 9 kW + 13.5 kWh = $37,800-$45,000.</li>
          <li><strong>Premium (SunPower Maxeon, microinversores Enphase, 2 Powerwalls):</strong> $5.50-$6.50/W. Sistema 10 kW + 27 kWh = $55,000-$65,000.</li>
        </ul>

        <p><strong>Breakdown típico sistema 9 kW + Powerwall 3 = $42K cliente:</strong></p>
        <ul>
          <li>Paneles 22 × 410W (REC / Q-Cells): $3,850 (wholesale $0.43/W)</li>
          <li>Microinversores Enphase IQ8M × 22: $4,400 (wholesale $200/unit)</li>
          <li>Tesla Powerwall 3: $9,500 wholesale</li>
          <li>Racking (IronRidge XR Rail / SnapNRack): $1,800</li>
          <li>Balance of system (wire, conduit, breakers, labels, disconnects): $1,200</li>
          <li>Permits + plan check + inspection: $1,100</li>
          <li>Interconnect application + PTO admin: $300</li>
          <li>Design + engineer stamp (if required): $800</li>
          <li>Labor install (3 días, 3 personas): $6,500</li>
          <li><strong>Total costo contractor: ~$29,450</strong></li>
          <li>Markup @ 43%: <strong>Precio cliente $42,000</strong></li>
          <li><strong>Gross profit: $12,550 (30%)</strong></li>
        </ul>

        <p><strong>Labor rates solar CA 2026:</strong></p>
        <ul>
          <li>Solar lead installer: $38-$55/hr</li>
          <li>Solar installer: $26-$38/hr</li>
          <li>Solar helper/apprentice: $20-$28/hr</li>
          <li>Roofer prep (tile removal/replacement): $55-$85/hr</li>
          <li>Master electrician (interconnect, panel work): $65-$95/hr</li>
        </ul>

        <p>Labor burden típico solar: 28-32% (más alto que HVAC por fall-protection insurance, higher WC rate para rooftop work — code 5552 vs 5538).</p>

        <p><strong>Financing partners que cierran deals.</strong> 75%+ de clientes solar CA financian — cash-buyer es minoría. Los <em>lenders</em> dominantes:</p>
        <ul>
          <li><strong>GoodLeap (antes Loanpal):</strong> #1 en residential solar USA 2026. 12-25 años, APR 2.99-9.99%. Dealer fee 10-22% (out of loan amount). Fast approval (minutes), online flow.</li>
          <li><strong>Sunnova Easy Plan:</strong> PPA, lease, loan. Dominio en lease/PPA model. Cliente no owns el sistema pero no tiene upfront cost.</li>
          <li><strong>Mosaic:</strong> home improvement loans incluye solar. 15-20 años, 3.99-7.99%. Dealer fee 8-18%.</li>
          <li><strong>Sunrun:</strong> lease / PPA model. $0 down, ~20 año contract. Cliente paga renta mensual $80-$180. Sunrun owns el sistema. Genera leads pero contrata to contractors.</li>
          <li><strong>Enphase Home Energy Loan:</strong> integrado con Enphase Installer Platform. 15-25 años, 4.99-9.99%. Bueno para sistemas Enphase-native.</li>
          <li><strong>Service Finance Company / Synchrony:</strong> HVAC-traditional lenders con producto solar. APR más alto (6.99-15%) pero más fácil approval para credit 620-680.</li>
        </ul>

        <p><em>Dealer fee</em> — el truco que cliente no ve. Si cotizas $42K cash y cliente escoge GoodLeap @ 4.99% APR, el <em>dealer fee</em> del lender puede ser 18% ($7,560). Ese fee se paga de TU <em>gross profit</em>. Si tu margen era $12,550, financiamiento te deja $4,990. Por eso cash-buyers son tan queridos — el margen se mantiene. Algunos contractors suben el precio financiado (<em>fee absorption</em>) — cotizan $49K para la versión financiada del mismo sistema.</p>

        <p><strong>Referral fees entre contractors.</strong> Cuando pasas un lead HVAC a un solar contractor (Camino 1), estructura estándar:</p>
        <ul>
          <li><strong>Referral fee fijo:</strong> $500-$2,000 por sistema vendido. Simple, sin complicar.</li>
          <li><strong>% de contrato:</strong> 5-10% del total signed contract. Más grande upside si venden $60K.</li>
          <li><strong>Sales partner model:</strong> 15-25% del contrato, pero TÚ haces el sale meeting, design consult, financing application. Solar contractor solo hace el install.</li>
        </ul>

        <p>Formaliza con <em>Referral Agreement</em> firmado. Incluye: fee structure, payment terms (net 30 típico tras PTO), non-compete (no robar al cliente post-venta), responsibility carve-out (ellos warranty el equipment, tú warranty el referral/sale promise).</p>

        <p><strong>Por qué HVAC + Solar + Battery es la trifecta ganadora.</strong></p>
        <ul>
          <li><strong>Trust capital:</strong> ya abriste la puerta de la casa. El cliente confía. Solar salesmen pasan 2-4 visitas para construir trust — tú ya lo tienes.</li>
          <li><strong>Same truck, same crew partially:</strong> electrical overlap + rooftop overlap.</li>
          <li><strong>Revenue multiplier:</strong> cliente AC $18K → + solar $38K → + battery $13K → + gen $14K = <strong>$83K total wallet share</strong>. Sin solar + battery + gen, te vas con los $18K y lo dejas.</li>
          <li><strong>Recurrent maintenance:</strong> AC maintenance plan $220/yr + solar performance check $180/yr + generator maintenance $350/yr = <strong>$750/yr recurrent</strong> por hogar. Retention + referral engine.</li>
          <li><strong>Upsell psychológico:</strong> cliente que invierte $80K+ en su casa en 2 años quiere "el contratista todo-en-uno" — se vuelve loyal de por vida.</li>
        </ul>

        <p><strong>El único motivo para NO entrar a solar:</strong> si tu operación HVAC está trending sub-$600K/yr revenue, enfócate primero en estabilizar HVAC (Bloque 10-12) antes de diversificar. Solar añade complejidad técnica, regulatoria y operacional. Estabilidad en HVAC primero → diversificación después.</p>
      `,
      keyPoints: [
        'Trifecta HVAC + Solar + Battery + Gen: wallet share por cliente salta de $18K a $80K+',
        'Camino 1 (sub-contract): referral 15-25% sin capex — donde empezar',
        'Camino 2 (C-46 in-house): $40-80K setup, break-even 8-15 installs, net 18-25%',
        'CA 2026 pricing: PV-only $3.20-3.80/W; PV+battery $4.20-5.00/W; premium $5.50-6.50/W',
        'C-46 Solar o C-10 Electrical como secondary a C-20 HVAC — múltiples bajo misma entidad',
        'Financing dominado por GoodLeap, Sunnova, Mosaic — dealer fee 8-22% sale de tu margen',
        'Trust capital del cliente HVAC es el arma #1 vs solar salesmen cold-calling'
      ],
      realTalk: 'El cuate que te dice "yo solo hago AC, no me meto con solar" en 2026 está dejando 4x su revenue en la mesa. Solar salesmen ya están tocando la puerta de TU cliente. Si no lo vendes tú, te lo quita uno de esos canvassers agresivos — y de paso pierde confianza en ti cuando le dicen "tu contratista no entiende solar". Mueve fichas.',
      checklist: [
        'Decidir Camino 1 (sub-contract) vs 2 (C-46 in-house) vs 3 (JV) según revenue actual',
        'Si Camino 1: firmar Referral Agreement con solar contractor local reconocido',
        'Si Camino 2: aplicar C-46 o C-10 secondary en CSLB + ampliar bond',
        'Entrenar sales team en solar basics + NEM 3.0 + ITC/SGIP conversation',
        'Set up financing partners: GoodLeap + Mosaic + Enphase minimum (diversify)',
        'Script de presentación solar integrado al flow HVAC (post-AC close, misma visita)',
        'Pricing matrix interna: PV-only / PV+battery / PV+battery+gen con dealer fee absorbed',
        'Proposal tool: Aurora Solar / OpenSolar / HelioScope para simulation en vivo',
        'Warranty stack documentada: equipment (25yr panels, 10yr Powerwall) + labor (10yr) + performance',
        'Maintenance agreement multi-systema: $750/yr bundle HVAC + Solar + Gen'
      ],
      commonMistakes: [
        'Entrar a solar sin validar demand — $80K invertidos, 6 meses sin ventas',
        'Firmar referral agreement sin non-compete — solar partner te roba al cliente',
        'No absorber dealer fee en cotización financiada — margen evaporado post-close',
        'Prometer producción al cliente sin simulation seria — reclamo a los 2 años',
        'Usar Camino 1 forever — nunca construyes capacity propia, siempre dependiente',
        'Cotizar PV-only bajo NEM 3.0 — cliente con payback 15 años te reclama',
        'No entrenar sales team en códigos NEC básicos — cliente técnico pierde confianza'
      ]
    }

  ],

  resources: [
    { label: 'CSLB — California State License Board (C-46 Solar)', url: 'https://www.cslb.ca.gov/', type: 'link' },
    { label: 'CSLB License Classifications (C-46 / C-10 / C-20)', url: 'https://www.cslb.ca.gov/About_Us/Library/Licensing_Classifications/', type: 'link' },
    { label: 'CSLB License Lookup', url: 'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/', type: 'link' },
    { label: 'California Energy Commission — SGIP', url: 'https://www.energy.ca.gov/programs-and-topics/programs/self-generation-incentive-program', type: 'link' },
    { label: 'SGIP Program Administrator (PG&E)', url: 'https://www.pge.com/en_US/residential/save-energy-money/savings-solutions-and-rebates/self-generation-incentive-program/self-generation-incentive-program.page', type: 'link' },
    { label: 'Go Solar California', url: 'https://www.gosolarcalifornia.ca.gov/', type: 'link' },
    { label: 'NFPA — National Electrical Code (NEC)', url: 'https://www.nfpa.org/NEC', type: 'link' },
    { label: 'DSIRE — Database of State Incentives for Renewables & Efficiency', url: 'https://www.dsireusa.org/', type: 'link' },
    { label: 'IRS Form 5695 (Residential Energy Credit / ITC)', url: 'https://www.irs.gov/forms-pubs/about-form-5695', type: 'link' },
    { label: 'NREL PVWatts Calculator', url: 'https://pvwatts.nrel.gov/', type: 'software' },
    { label: 'Enphase Installer Platform + IQ Battery Docs', url: 'https://enphase.com/installers', type: 'manufacturer' },
    { label: 'Tesla Powerwall — Installer Resources', url: 'https://www.tesla.com/support/energy/powerwall', type: 'manufacturer' },
    { label: 'FranklinWH aPower 2 — Installer', url: 'https://www.franklinwh.com/', type: 'manufacturer' },
    { label: 'SolarEdge Home Battery + Energy Hub', url: 'https://www.solaredge.com/us/products/residential/home-battery', type: 'manufacturer' },
    { label: 'Generac Guardian Standby — Installer Zone', url: 'https://www.generac.com/for-professionals', type: 'manufacturer' },
    { label: 'Kohler Generators — Dealer Locator + Docs', url: 'https://kohlerhomeenergy.com/', type: 'manufacturer' },
    { label: 'Cummins QuietConnect Residential', url: 'https://www.cummins.com/generators/home-standby', type: 'manufacturer' },
    { label: 'Reliance Controls — Transfer Switches + Interlocks', url: 'https://www.reliancecontrols.com/', type: 'manufacturer' },
    { label: 'Aurora Solar — Design + Proposal Software', url: 'https://aurorasolar.com/', type: 'software' },
    { label: 'OpenSolar — Design + CRM', url: 'https://www.opensolar.com/', type: 'software' },
    { label: 'HelioScope — Commercial Solar Design', url: 'https://www.helioscope.com/', type: 'software' },
    { label: 'Energy Toolbase — Financial Analysis NEM 3.0', url: 'https://www.energytoolbase.com/', type: 'software' },
    { label: 'CED Greentech — Solar Distributor', url: 'https://www.cedgreentech.com/', type: 'distributor' },
    { label: 'Soligent — Solar Distributor', url: 'https://www.soligent.net/', type: 'distributor' },
    { label: 'Greentech Renewables (Rexel)', url: 'https://www.greentechrenewables.com/', type: 'distributor' },
    { label: 'GoodLeap — Solar Financing', url: 'https://www.goodleap.com/', type: 'financing' },
    { label: 'Mosaic — Solar Loan', url: 'https://joinmosaic.com/', type: 'financing' },
    { label: 'Sunnova Easy Plan', url: 'https://www.sunnova.com/', type: 'financing' },
    { label: 'PG&E Interconnection (PTO) Portal', url: 'https://www.pge.com/en_US/residential/solar-and-vehicles/green-energy-incentives/solar-and-renewable-metering-and-billing/solar-and-renewable-metering-and-billing.page', type: 'utility' },
    { label: 'SCE Solar + Battery Interconnection', url: 'https://www.sce.com/residential/generating-your-own-power', type: 'utility' },
    { label: 'SDG&E Net Energy Metering', url: 'https://www.sdge.com/more-information/net-energy-metering', type: 'utility' },
    { label: 'CA ISO — Wholesale Electricity Market', url: 'https://www.caiso.com/', type: 'link' },
    { label: 'PG&E ICA Map (Integration Capacity Analysis)', url: 'https://www.pge.com/en_US/for-our-business-partners/distribution-resource-planning/distribution-resource-planning-data-portal.page', type: 'utility' },
    { label: 'UL 9540 / UL 9540A ESS Listing Info', url: 'https://www.ul.com/services/ul-9540a-test-method', type: 'link' },
    { label: 'NABCEP — Solar Professional Certification', url: 'https://www.nabcep.org/', type: 'training' },
    { label: 'Solar Energy International (SEI) Training', url: 'https://www.solarenergy.org/', type: 'training' }
  ],

  glossary: [
    { term: 'PV (Photovoltaic)', def: 'Tecnología que convierte luz solar directamente en electricidad mediante efecto fotoeléctrico en células de silicio. PV ≠ solar thermal (agua caliente).' },
    { term: 'kW vs kWh', def: 'kW = potencia instantánea (cuánto genera AHORA). kWh = energía acumulada (cuánto generó en un período). Sistema 8 kW produce ~12,000 kWh/año en So-Cal. La bill de PG&E cobra kWh.' },
    { term: 'STC (Standard Test Conditions)', def: '1000 W/m² irradiancia, 25°C célula, masa de aire 1.5. Condiciones de laboratorio. El wattage impreso en el panel (400W) se mide en STC — raramente ocurre en techo real.' },
    { term: 'NOCT (Nominal Operating Cell Temp)', def: '800 W/m², 20°C ambiente, 1 m/s viento. Condiciones más realistas — panel de 400W STC produce ~295-310W en NOCT. Usa NOCT para cotizar producción honesta.' },
    { term: 'NEM 3.0 / NBT (Net Billing Tariff)', def: 'Esquema actual CA desde 4/15/2023. Exportación a red paga 3-8¢/kWh (mediodía) o 25-65¢/kWh (peak). Importación 28-52¢/kWh. Obliga batería para que PV tenga sentido financiero.' },
    { term: 'MPPT (Maximum Power Point Tracking)', def: 'Algoritmo del inversor/charge controller que ajusta voltaje/corriente para extraer potencia máxima del panel bajo condiciones variables. Inversor moderno con MPPT gana 15-30% vs PWM.' },
    { term: 'DoD (Depth of Discharge)', def: 'Porcentaje de la capacidad nominal de batería que se descarga en cada ciclo. Lead-acid típico 50% max; LiFePO₄ 80-90%. Ciclar a DoD alto acorta vida útil.' },
    { term: 'SGIP (Self-Generation Incentive Program)', def: 'Incentivo CA para battery storage. General Market $150-200/kWh. Equity Resiliency (zona alto riesgo fuego + income qualified) $850-1000/kWh. Administrado por PG&E/SCE/SoCalGas/CSE.' },
    { term: 'ITC (Investment Tax Credit)', def: 'Crédito fiscal federal 30% del costo total del sistema PV/ESS/labor, vigente hasta 2032. Aplica a battery standalone desde IRA 2022. Requiere tax liability del cliente para ser consumido.' },
    { term: 'RSD (Rapid Shutdown)', def: 'Requisito NEC 690.12 desde 2017. Todo PV en rooftop debe bajar a ≤30V dentro de 10 seg tras disconnect. Cumplido con microinversores Enphase IQ8 o optimizers SolarEdge/Tigo.' },
    { term: 'AC-coupled', def: 'Arquitectura donde batería tiene inversor propio. PV y batería conectan en AC side. Mejor para retrofit a PV existente. Eficiencia round-trip ~92%.' },
    { term: 'DC-coupled / Hybrid', def: 'Arquitectura donde batería y PV comparten inversor. Una sola conversión DC→AC. Eficiencia ~96%. Mejor para sistema nuevo. Tesla Powerwall 3, FranklinWH, SolarEdge Home Battery.' },
    { term: 'Transfer Switch', def: 'Dispositivo que transfiere carga entre utility y generator/battery. Manual (cliente mueve switches) o Automatic (ATS detecta outage). Obligatorio NEC 702 para evitar backfeed.' },
    { term: 'Interlock Kit', def: 'Placa mecánica en breaker panel que impide físicamente tener main breaker y generator breaker cerrados simultáneamente. $100-300. Alternativa código-compliant más barata vs transfer switch.' },
    { term: 'Standby Generator', def: 'Generador permanente exterior con auto-start via ATS. 8-26kW residencial. NG o LP. Generac Guardian, Kohler, Cummins dominan el mercado. $8K-17K instalado.' },
    { term: 'Inverter', def: 'Dispositivo que convierte DC (del panel/batería) a AC (de la casa). Tipos: string central, microinversores (Enphase), hybrid (con battery integrada). MPPT + grid-tie compliant UL 1741.' },
    { term: 'String', def: 'Serie de paneles conectados en serie para sumar voltaje. 8 paneles × 40V = 320V. El string completo entra a un inversor central o conecta vía optimizers.' },
    { term: 'ESS (Energy Storage System)', def: 'Sistema de almacenamiento de energía. Pre-packaged (Powerwall, IQ Battery) o site-built. NEC 706. Requiere UL 9540 system-level + UL 9540A cell-level thermal runaway test.' },
    { term: 'PTO (Permission to Operate)', def: 'Carta oficial de la utility (PG&E/SCE/SDG&E) autorizando al cliente a energizar el sistema solar. Emitida tras final inspection + meter swap. 8-16 semanas típico desde firma de contrato.' },
    { term: 'PSH (Peak Sun Hours)', def: 'Horas equivalentes a 1000 W/m² recibidas por día en promedio anual. So-Cal 5.5-6.0; Bay Area 5.0-5.4; North Coast 4.0-4.5. Base para sizing de array PV.' },
    { term: 'Power Inlet Box', def: 'Receptáculo exterior NEMA L14-30 (30A/240V) o L14-50 (50A) donde conecta generator portátil. Requiere instalación código-compliant con conductor a breaker del panel + interlock.' },
    { term: 'Critical-Loads Panel', def: 'Sub-panel con solo circuitos esenciales (fridge, luces, wifi, 1 AC zone, seguridad) alimentado por ATS/ESS durante outage. Reduce demanda vs whole-home backup.' }
  ]
};
