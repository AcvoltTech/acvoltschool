window.CONTRACTOR_BLOQUE_13={number:13,title:"Paneles Solares y Backup",tagline:"C\xF3mo agregar PV, bater\xEDas y generadores a tu negocio HVAC",intro:`
    <p><strong>Esc\xFAchame: en California en 2026, el cliente que te paga $18K por un sistema de AC tambi\xE9n est\xE1 pagando $350 al mes a PG&E, y est\xE1 cansado de que la luz se vaya 4 veces al a\xF1o por los <em>Public Safety Power Shutoffs</em>.</strong> Ese mismo cliente, el que ya te abri\xF3 la puerta, ya conf\xEDa en ti, y ya firm\xF3 un cheque de 5 d\xEDgitos \u2014 est\xE1 listo para decirte que s\xED a un sistema fotovoltaico con bater\xEDa de $35K-$55K. Si t\xFA no se lo vendes, se lo vende Sunrun, Tesla o el cuate del volante a domicilio. Y ese cuate se va a llevar el mejor cliente de tu vida.</p>

    <p>Solar + storage dej\xF3 de ser un nicho hace 5 a\xF1os. En California es obligatorio en <em>new construction</em> desde 2020 (Title 24), el <em>Investment Tax Credit</em> federal est\xE1 en 30% hasta 2032, y el <em>Self-Generation Incentive Program</em> (SGIP) paga $150-$1,000/kWh de bater\xEDa instalada. El contratista HVAC que no agrega PV, <em>battery backup</em> y generadores standby a su oferta en 2026 se est\xE1 quedando con el 30% del <em>wallet share</em> del cliente. El otro 70% se lo lleva alguien m\xE1s.</p>

    <p>Este bloque NO es un curso de instalador solar. Es un <strong>manual de referencia para el contratista HVAC</strong> que quiere entender la tecnolog\xEDa, los c\xF3digos, la licencia, los incentivos, el <em>pricing</em>, y el modelo de negocio para cerrar el <em>upsell</em> de solar + battery + generador encima del job de AC que ya tiene firmado. Si quieres ser instalador solar full-time, hazte la C-46 y m\xE9tele 2 a\xF1os. Si quieres hacer $15K-$40K extra por cliente usando <em>referral fees</em>, <em>sub-contracts</em> y partnerships \u2014 este bloque es para ti.</p>

    <p><strong>Regla #1:</strong> Con NEM 3.0 en California, PV solo (sin bater\xEDa) ya NO es un buen <em>deal</em> financiero para el cliente. La <em>payback</em> salt\xF3 de 6-7 a\xF1os a 12-15 a\xF1os. <strong>El <em>deal</em> ahora es PV + bater\xEDa</strong>. Si un competidor te anda ofreciendo "solo paneles", est\xE1 vendiendo basura.</p>

    <p><strong>Regla #2:</strong> Nunca, <em>nunca</em>, conectes un generador a una casa sin <em>transfer switch</em> o <em>interlock kit</em>. NEC 702.4 es claro \u2014 el <em>backfeed</em> por el meter mata lineros. Un <em>interlock</em> de $120 es la diferencia entre un cliente feliz y un juicio de $2M contra tu compa\xF1\xEDa.</p>

    <p><strong>Regla #3:</strong> El sol en So-Cal da 5.5-6.0 <em>peak sun hours</em> al d\xEDa. En Norte-Cal, 4.5-5.0. Un panel de 400W en San Diego produce ~2.2 kWh/d\xEDa promedio anual. Memor\xEDzalo \u2014 cuando el cliente te pregunte "cu\xE1nto voy a ahorrar", necesitas ese n\xFAmero en la cabeza.</p>

    <p><strong>Regla #4:</strong> La <em>trifecta</em> del contratista HVAC moderno es AC + Solar + Battery + Generador. Mismo cliente, mismo truck, 3x el <em>revenue</em> anual por hogar. El cuate que solo vende AC en 2026 se va a comer los <em>scraps</em> del cuate que vende las 4.</p>

    <p><em>Si terminas este bloque y no puedes explicarle a un cliente la diferencia entre NEM 2.0 y NEM 3.0, entre AC-coupled y DC-coupled, y entre interlock y transfer switch, regresa al principio. Este es dinero serio y c\xF3digos serios \u2014 no se improvisa.</em></p>
  `,sections:[{id:"pv-fundamentals",heading:"Fundamentos Fotovoltaicos \u2014 c\xE9lula, m\xF3dulo, string, array",body:`
        <p><strong>Un panel solar no es una caja m\xE1gica.</strong> Es un s\xE1nduche de silicio cristalino dopado con boro y f\xF3sforo, encapsulado en EVA entre vidrio templado y un <em>backsheet</em> de pol\xEDmero, con 60 o 72 <em>cells</em> soldadas en serie y un marco de aluminio anodizado. Entender de qu\xE9 est\xE1 hecho te permite vender con autoridad y detectar basura cuando un <em>vendor</em> intenta meterte panel gen\xE9rico Tier 3 pas\xE1ndolo por Tier 1.</p>

        <p><strong>Jerarqu\xEDa el\xE9ctrica:</strong></p>
        <ul>
          <li><strong>C\xE9lula (cell):</strong> unidad b\xE1sica de silicio. ~0.5V, ~10W. Mono-PERC o TOPCon o HJT (heterojunction) son las tecnolog\xEDas modernas. Polycrystalline ya casi no se vende.</li>
          <li><strong>M\xF3dulo (m\xF3dule / panel):</strong> 60-72 c\xE9lulas en serie. Residencial t\xEDpico: 400-450W, 40V nominal, 10-11A. Comercial: 550-700W con c\xE9lulas <em>half-cut</em>.</li>
          <li><strong>String:</strong> varios m\xF3dulos en serie. Sube el voltaje (8 paneles \xD7 40V = 320V DC). Debe quedar dentro del rango MPPT del inversor.</li>
          <li><strong>Array:</strong> uno o varios strings en paralelo, conectados al inversor central o microinversores individuales.</li>
        </ul>

        <p><strong>STC vs NOCT \u2014 por qu\xE9 el n\xFAmero grande en la caja es mentira parcial.</strong> El <em>wattage</em> impreso en el panel (400W, 440W, etc.) se mide en <em>Standard Test Conditions</em>: 1000 W/m\xB2 de irradiancia, temperatura de c\xE9lula 25\xB0C, masa de aire 1.5. <em>Esas condiciones casi nunca existen en un techo real</em>. El n\xFAmero honesto es NOCT (<em>Nominal Operating Cell Temperature</em>): 800 W/m\xB2, ambiente 20\xB0C, viento 1 m/s \u2014 lo que genera t\xEDpicamente 43-48\xB0C en la c\xE9lula. En NOCT, un panel de 400W real entrega ~295-310W. Cuando cotices generaci\xF3n, <strong>usa NOCT o usa un software tipo PVWatts / Aurora / Helioscope que aplique <em>derating</em> por temperatura</strong>, no STC.</p>

        <p><strong>Coeficiente de temperatura \u2014 el enemigo silencioso en So-Cal.</strong> Por cada grado Celsius por encima de 25\xB0C, el panel pierde eficiencia. <em>Temp coefficient Pmax</em> t\xEDpico: -0.29%/\xB0C (Tier 1 moderno) a -0.40%/\xB0C (paneles gen\xE9ricos). En un techo de Fresno a 45\xB0C en julio, la c\xE9lula puede estar a 65-70\xB0C. Eso es 40-45\xB0C encima de STC \xD7 0.35% = <strong>14-16% de p\xE9rdida de producci\xF3n en verano</strong>. Por eso SunPower / Maxeon con coeficiente -0.27%/\xB0C producen 8-10% m\xE1s al a\xF1o que un panel gen\xE9rico en climas calientes, aunque el <em>wattage</em> nominal sea parecido.</p>

        <p><strong>Degradaci\xF3n anual y vida \xFAtil.</strong> Los paneles no son eternos. Tier 1 moderno degrada <em>0.4-0.5% al a\xF1o</em> tras el primer a\xF1o (que puede ser hasta 2%). Warranty t\xEDpica de producto: 12-25 a\xF1os. Warranty de potencia: 25-30 a\xF1os garantizando 84-92% de producci\xF3n original en a\xF1o 25. Un panel gen\xE9rico Tier 3 degrada 0.8-1.2%/a\xF1o \u2014 a los 15 a\xF1os est\xE1 al 80% y el cliente ya te est\xE1 demandando.</p>

        <p><strong>Tier 1 vs Tier 2 vs Tier 3 \u2014 qu\xE9 significa realmente.</strong> La clasificaci\xF3n Tier viene de BloombergNEF y mide <em>bankability</em> (si un banco prestar\xE1 dinero para un proyecto con ese panel), no calidad absoluta. Pero en la pr\xE1ctica:</p>
        <ul>
          <li><strong>Tier 1 residencial USA (2026):</strong> REC Alpha Pure-R, Q-Cells Q.Peak DUO BLK, Panasonic EVERVOLT, SunPower Maxeon, LG NeON (descontinuado pero todav\xEDa en stock), Silfab Elite, LONGi Hi-MO 6, Jinko Tiger Neo, Canadian Solar HiKu7, Trina Solar Vertex S. Precio wholesale: $0.38-$0.55/W.</li>
          <li><strong>Tier 2:</strong> JA Solar, Risen, Phono Solar, ZNShine. Calidad decente, warranty respetable, pero marca menos reconocida. Precio: $0.30-$0.40/W.</li>
          <li><strong>Tier 3:</strong> f\xE1bricas chinas sin historial, marcas que aparecen y desaparecen. <em>No los toques ni aunque te regalen margen</em>. En 5 a\xF1os la warranty es papel mojado.</li>
        </ul>

        <p><strong>W vs Wh, kW vs kWh \u2014 la confusi\xF3n que mata <em>sales</em>.</strong> Watt (W) y kilowatt (kW) son <em>potencia instant\xE1nea</em> \u2014 cu\xE1nto genera AHORA. Watt-hora (Wh) y kilowatt-hora (kWh) son <em>energ\xEDa acumulada</em> \u2014 cu\xE1nto gener\xF3 en un per\xEDodo de tiempo. Un sistema de <em>8 kW</em> (potencia) en So-Cal genera ~<em>12,000 kWh/a\xF1o</em> (energ\xEDa). La factura de PG&E viene en kWh \u2014 por eso el cliente te va a preguntar "cu\xE1ntos kWh produce" no "cu\xE1ntos kW". Si no sabes la diferencia, el cliente ya no te respeta.</p>

        <p><strong>Peak sun hours en California.</strong> No es "cu\xE1ntas horas hay sol" \u2014 es cu\xE1ntas horas equivalentes a 1000 W/m\xB2 (STC) recibes al d\xEDa en promedio anual. Valores reales:</p>
        <ul>
          <li><strong>San Diego / LA Basin:</strong> 5.5-6.0 PSH/d\xEDa.</li>
          <li><strong>Inland Empire / Riverside / San Bernardino:</strong> 5.8-6.2 PSH (m\xE1s sol, pero m\xE1s calor = m\xE1s <em>derating</em>).</li>
          <li><strong>Central Valley (Fresno, Bakersfield):</strong> 5.5-5.9 PSH.</li>
          <li><strong>Bay Area:</strong> 5.0-5.4 PSH.</li>
          <li><strong>North Coast (Eureka, Arcata):</strong> 4.0-4.5 PSH. Solar marginal.</li>
          <li><strong>Sierra / Tahoe:</strong> 5.0-5.5 PSH pero nieve en invierno = p\xE9rdida estacional.</li>
        </ul>

        <p><strong>Tilt y azimuth \xF3ptimo.</strong> Para producci\xF3n anual m\xE1xima en California (latitud 32-42\xB0N), el <em>tilt</em> \xF3ptimo es igual a la latitud del sitio: 32-42\xB0. El <em>azimuth</em> \xF3ptimo es 180\xB0 (sur verdadero, no magn\xE9tico \u2014 en CA la declinaci\xF3n magn\xE9tica es ~12-14\xB0E). Techos t\xEDpicos residenciales est\xE1n a 18-30\xB0 de tilt \u2014 pierden 3-6% vs \xF3ptimo. Si el techo mira sur-este (150\xB0) o sur-oeste (210\xB0), pierdes 4-7% vs sur. Oeste puro (270\xB0) pierde 15-20% en producci\xF3n anual PERO <em>con NEM 3.0 produce m\xE1s en las horas pico de la tarde cuando la energ\xEDa vale m\xE1s</em> \u2014 rev\xEDsalo con cuidado.</p>

        <p><strong>Shading \u2014 por qu\xE9 10% de sombra te cuesta 50% de producci\xF3n.</strong> En un string tradicional con inversor central, las c\xE9lulas est\xE1n en serie \u2014 la producci\xF3n de TODO el string baja al nivel de la c\xE9lula m\xE1s sombreada (efecto <em>Christmas lights</em>). Una sombra de chimenea sobre una esquina de un panel puede tirar el output del string completo 40-60%. Soluciones:</p>
        <ul>
          <li><strong>Microinversores (Enphase IQ8+, IQ8M, IQ8A):</strong> un microinversor por panel. Cada panel es independiente. Sombra sobre 1 panel solo baja ese panel. Precio extra: $0.20-$0.30/W. En So-Cal es el est\xE1ndar de facto.</li>
          <li><strong>Power optimizers (SolarEdge, Tigo):</strong> un optimizador por panel + inversor central string. Similar efecto a microinversores, precio similar.</li>
          <li><strong>Mitigaci\xF3n f\xEDsica:</strong> cortar ramas, reubicar antena, evitar panel en zona sombreada. Siempre hazlo primero.</li>
        </ul>

        <p>Si el techo tiene sombra parcial significativa (chimenea, plumbing vent, \xE1rboles del vecino), <em>microinversor o optimizer no es opcional \u2014 es obligatorio</em>. Un inversor string central en techo sombreado es malpr\xE1ctica y el cliente va a notar la baja producci\xF3n en 6 meses.</p>
      `,keyPoints:["STC (nominal) vs NOCT (real) \u2014 paneles producen 20-30% menos que el n\xFAmero en la caja","Coeficiente de temperatura: -0.29%/\xB0C (Tier 1) vs -0.40%/\xB0C (gen\xE9rico) = 8-10% diferencia anual en CA","Degradaci\xF3n Tier 1: 0.4-0.5%/a\xF1o; warranty de potencia 25-30 a\xF1os al 84-92%","Tier 1 USA 2026: REC, Q-Cells, Panasonic, SunPower/Maxeon, Silfab, LONGi, Jinko, Canadian, Trina","Peak sun hours: So-Cal 5.5-6.0 PSH/d\xEDa; Bay Area 5.0-5.4; North Coast 4.0-4.5","Tilt \xF3ptimo = latitud del sitio; azimuth \xF3ptimo = 180\xB0 sur verdadero (no magn\xE9tico)","Sombra parcial + string inversor = cat\xE1strofe; usa microinversores Enphase o optimizers SolarEdge"],realTalk:"El cliente no sabe qu\xE9 es NOCT, coeficiente de temperatura, ni Tier 1. Pero sabe cu\xE1nto le lleg\xF3 el bill. Si le prometes 1,400 kWh/mes y le llegan 1,050 porque usaste STC y paneles gen\xE9ricos, te va a demandar en corte de <em>small claims</em> y va a poner reviews de 1 estrella por toda el internet. Cotiza honesto o no cotices.",checklist:['Verificar marca Tier 1 BloombergNEF (no aceptar "equivalente" de un supplier desconocido)',"Obtener datasheet oficial con Pmax, Voc, Isc, Vmp, Imp, coef. temp, NOCT","Correr PVWatts (gratis, NREL) para proyecci\xF3n honesta con derating por temperatura",'Medir shading con Solar Pathfinder o Solmetric SunEye \u2014 no "a ojo"',"Calcular tilt y azimuth reales del techo (inclin\xF3metro + br\xFAjula corregida por declinaci\xF3n)","Seleccionar microinversor Enphase IQ8 o SolarEdge optimizer si hay sombra parcial","Verificar warranty de producto (m\xEDnimo 15 a\xF1os) y de potencia (m\xEDnimo 25 a\xF1os al 84%)","Confirmar certificaci\xF3n UL 1703 / UL 61730 y listing en CEC eligible equipment list","Validar stock del distribuidor antes de cotizar (CED Greentech, Soligent, Krannich, Greentech Renewables)","Incluir cl\xE1usula en contrato: producci\xF3n estimada \xB110% de PVWatts simulation"],commonMistakes:["Cotizar kWh usando STC en lugar de NOCT \u2014 overpromise 20-30%","Confundir kW con kWh en conversaci\xF3n con cliente \u2014 pierdes credibilidad instant\xE1nea","Usar panel Tier 3 por m\xE1rgen extra \u2014 en 10 a\xF1os warranty es papel mojado",'Ignorar sombra parcial pensando que "no es tan grave" \u2014 mata 40-60% del string','Instalar en techo que mira norte "porque no hab\xEDa otro espacio" \u2014 producci\xF3n 50% menos',"No verificar CEC eligible list \u2014 el sistema no califica para rebates ni NEM","Usar inversor string central en techo con obstrucciones en lugar de microinversores"]},{id:"grid-tie-nem",heading:"Grid-Tie con NEM 3.0 \u2014 c\xF3mo cambi\xF3 el juego en California",body:`
        <p><strong>El 15 de abril de 2023 California mat\xF3 el modelo de solar residencial que hab\xEDa funcionado por 20 a\xF1os.</strong> Ese d\xEDa entr\xF3 en vigor NEM 3.0 (<em>Net Billing Tariff</em>, o NBT), que reemplaz\xF3 al <em>Net Energy Metering</em> 2.0 para todos los sistemas nuevos interconectados en PG&E, SCE y SDG&E. El cliente que instal\xF3 NEM 2.0 antes del 14 de abril 2023 est\xE1 <em>grandfathered</em> por 20 a\xF1os \u2014 sigue recibiendo cr\xE9dito 1:1. El cliente que instala despu\xE9s, NO. Y la diferencia financiera es brutal.</p>

        <p><strong>NEM 1.0 y 2.0 \u2014 el modelo viejo:</strong> por cada kWh que exportabas a la red, recib\xEDas cr\xE9dito equivalente a la tarifa <em>retail</em> \u2014 t\xEDpicamente 25-40\xA2/kWh en peak y 18-25\xA2 en off-peak. El medidor literalmente corr\xEDa hacia atr\xE1s. <em>Payback</em> de un sistema 8 kW: 5-7 a\xF1os. Gran <em>deal</em>.</p>

        <p><strong>NEM 3.0 / NBT \u2014 el modelo nuevo:</strong> el cliente ya NO recibe cr\xE9dito <em>retail</em> por exportaci\xF3n. Recibe el <em>Avoided Cost Calculator</em> rate \u2014 una tarifa basada en el valor mayorista de la energ\xEDa en el momento exacto que exportas. N\xFAmeros reales 2024-2026:</p>
        <ul>
          <li><strong>Exportaci\xF3n 10am-3pm (sol alto, red saturada):</strong> 3-8\xA2/kWh.</li>
          <li><strong>Exportaci\xF3n 4pm-9pm (peak demand):</strong> 25-65\xA2/kWh (a veces m\xE1s).</li>
          <li><strong>Importaci\xF3n cliente (lo que pagas a PG&E):</strong> 28-52\xA2/kWh en peak, 20-32\xA2 off-peak con TOU-D-PRIME.</li>
        </ul>

        <p>Traducci\xF3n: <em>si generas al mediod\xEDa y exportas, te pagan centavos. Si importas en la tarde, pagas quarter por kWh</em>. Ese spread es lo que cambi\xF3 todo.</p>

        <p><strong>Por qu\xE9 la bater\xEDa ahora es casi obligatoria.</strong> Sin bater\xEDa, tu sistema PV exporta el mediod\xEDa (cuando nadie est\xE1 en casa y vale 5\xA2), y el cliente importa en la tarde (cuando llega a poner el AC a 72\xB0F y vale 45\xA2). El cliente <em>paga PG&E aunque tenga solar</em>. Con bater\xEDa, el sistema almacena la generaci\xF3n del mediod\xEDa y la descarga 4pm-9pm, evitando importaci\xF3n cara. El <em>payback</em> de PV+battery bajo NEM 3.0 queda en 8-11 a\xF1os \u2014 todav\xEDa rentable, pero ya no es el 5-7 del NEM 2.0.</p>

        <p><strong>Peak shaving vs self-consumption \u2014 las dos estrategias de dise\xF1o.</strong></p>
        <ul>
          <li><strong>Self-consumption maximization:</strong> dimensionar PV + bater\xEDa para cubrir TODO el consumo nocturno 4pm-9pm. Bater\xEDa grande (15-20 kWh), PV dimensionado al 110-120% del consumo anual. Factura PG&E queda en $10-$20/mes m\xEDnimo (solo cargo fijo). Cliente paran\xF3ico de blackouts ama esto.</li>
          <li><strong>Peak shaving \xFAnicamente:</strong> bater\xEDa peque\xF1a (10-13 kWh) descarga solo durante peak 4pm-9pm. Sistema PV m\xE1s peque\xF1o. <em>Payback</em> m\xE1s r\xE1pido, pero factura no llega a cero.</li>
        </ul>

        <p>Para mayor\xEDa de clientes residenciales en CA 2026, <em>self-consumption con Powerwall 3 / IQ Battery 10C y PV 8-12 kW</em> es el <em>sweet spot</em>. Paga el Powerwall en 7-9 a\xF1os solo con el ahorro de TOU.</p>

        <p><strong>Time-of-Use plans que debes conocer.</strong> Todo cliente con solar en CA est\xE1 forzado a un plan TOU (no flat rate). Los principales:</p>
        <ul>
          <li><strong>PG&E E-ELEC:</strong> plan solar + battery moderno. Peak 4pm-9pm ($0.45-$0.52/kWh). Off-peak noche + d\xEDa hasta 4pm ($0.30-$0.34). Cargo fijo $15/mes.</li>
          <li><strong>PG&E EV2-A:</strong> si tiene carro el\xE9ctrico. Super off-peak 12am-3pm ($0.22). Peak 4pm-9pm ($0.55). Ideal para casa con EV + solar + battery.</li>
          <li><strong>SCE TOU-D-PRIME:</strong> similar a E-ELEC. Peak 4pm-9pm ($0.44). Off-peak ($0.28).</li>
          <li><strong>SDG&E EV-TOU-5:</strong> peak 4pm-9pm ($0.52). Super off-peak 12am-6am ($0.20).</li>
        </ul>

        <p><strong>Interconnect paperwork \u2014 el dolor administrativo.</strong> Antes de que el sistema pueda operar legalmente, el cliente necesita <em>Permission to Operate</em> (PTO) de la utilidad. El proceso:</p>
        <ul>
          <li><strong>1. Building permit</strong> del <em>Building Department</em> local (ciudad o condado). $200-$800 t\xEDpico, plan check 2-4 semanas.</li>
          <li><strong>2. Interconnect application</strong> a la utility (PG&E, SCE, SDG&E). Online portal. Incluye single-line diagram, spec sheets, site plan. 2-6 semanas de review.</li>
          <li><strong>3. Final inspection</strong> por el <em>Building Dept</em>. Verifica installation, labeling, grounding, rapid shutdown, AFCI, GFCI.</li>
          <li><strong>4. Utility meter swap</strong> (la PG&E instala net meter bidireccional). 1-4 semanas de espera.</li>
          <li><strong>5. PTO letter</strong> \u2014 el email que le da al cliente permiso legal de activar el inversor.</li>
        </ul>

        <p>Tiempo total desde firma del contrato a PTO: <strong>8-16 semanas en CA, t\xEDpicamente 10-12</strong>. Si alg\xFAn contratista te promete "2 semanas", est\xE1 mintiendo o haciendo algo ilegal.</p>

        <p><strong>Export limits y curtailment.</strong> Algunos circuitos distribucionales ya est\xE1n saturados de solar. PG&E puede requerir <em>export limiting</em> (el inversor corta exportaci\xF3n cuando la red est\xE1 sobrecargada) o negarte interconnect en el circuito. Enphase IQ8 y Tesla Inverter soportan <em>export control</em> nativo. Si vives en una zona de "solar ya saturado" (partes de San Diego County, parts of Fresno), rev\xEDsalo en el <em>ICA map</em> (Integration Capacity Analysis) de tu utility antes de cotizar.</p>
      `,keyPoints:["NEM 3.0 entr\xF3 4/15/2023 \u2014 exportaci\xF3n paga 3-8\xA2, importaci\xF3n cobra 28-52\xA2/kWh","Sin bater\xEDa bajo NEM 3.0, payback salt\xF3 de 5-7 a\xF1os a 12-15 a\xF1os \u2014 el modelo ya no funciona","Con PV + Powerwall/IQ Battery, payback vuelve a 8-11 a\xF1os \u2014 sweet spot del mercado actual","Plan TOU obligatorio: E-ELEC (PG&E), TOU-D-PRIME (SCE), EV-TOU-5 (SDG&E)","PTO process: permit + interconnect app + inspecci\xF3n + meter swap = 8-16 semanas","NEM 2.0 grandfathered 20 a\xF1os \u2014 sistemas pre-abril 2023 mantienen cr\xE9dito 1:1","Revisa ICA map de utility antes de cotizar \u2014 algunos circuitos ya est\xE1n saturados"],realTalk:'Si alguien te dice que "solar en CA ya no sirve", no entendi\xF3 NEM 3.0. Solar sin bater\xEDa ya no sirve, eso es cierto. Pero PV + battery bajo NEM 3.0 todav\xEDa regresa 10-12% IRR con ITC federal + SGIP. El problema no es el modelo \u2014 es el vendedor que sigue cotizando como si fuera 2019.',checklist:["Pull 12 meses de bills PG&E/SCE/SDG&E del cliente ANTES de dise\xF1ar","Confirmar schedule actual (E-TOU-C, E-1) y cambio obligatorio a E-ELEC/TOU-D-PRIME","Correr an\xE1lisis en HelioScope / Aurora / Energy Toolbase con NEM 3.0 export rates","Dimensionar bater\xEDa m\xEDnimo 10-13 kWh para peak shaving, 15-20 kWh para near-zero bill","Verificar ICA map de utility para export limits en el circuito del cliente","Preparar single-line diagram firmado por EE (Electrical Engineer) si sistema > 30 kW","Submit interconnect application online en utility portal (PG&E Interconnection, SCE Connected)","Coordinate inspection del Building Dept ANTES de solicitar meter swap","Entregar al cliente PTO letter archivada + net meter reading inicial","Programar check-in 30 d\xEDas post-PTO para validar producci\xF3n vs simulaci\xF3n"],commonMistakes:["Cotizar PV-only bajo NEM 3.0 pensando que todav\xEDa es rentable \u2014 cliente va a demandar a los 2 a\xF1os","Usar simulaci\xF3n con NEM 2.0 rates en cotizaci\xF3n post-abril 2023 \u2014 ilegal misrepresentation","Olvidar cambio obligatorio a TOU \u2014 cliente con schedule E-1 no puede mantenerlo con solar",'Prometer "2 semanas a PTO" \u2014 el cliente te odia cuando tarda 12 semanas reales',"No coordinar final inspection + meter swap \u2014 sistema listo pero sin PTO 4 semanas extra","Ignorar ICA map \u2014 te aprueban pero con export limiting severo que mata producci\xF3n","No entregar copia de PTO al cliente \u2014 si PG&E le cobra mal, no tiene defensa legal"]},{id:"off-grid-sizing",heading:"Off-Grid \u2014 cu\xE1ndo s\xED y cu\xE1ndo no, y c\xF3mo se dimensiona",body:`
        <p><strong>Off-grid NO es para la casa suburbia promedio.</strong> La casa en Riverside con AC central, 2 refrigeradores, pool pump y EV NO debe ser off-grid \u2014 econ\xF3micamente es un desastre ($80K-$150K para replicar la red). Off-grid tiene sentido en casos espec\xEDficos donde extender grid cuesta m\xE1s que generar: <em>remote cabin</em> a 1 mile del poste m\xE1s cercano ($15K-$50K de <em>line extension</em>), <em>well pump</em> en rancho agr\xEDcola, <em>off-grid tiny home</em> o ADU en terreno sin servicio, agricultura remota (pivotes de riego), RV / <em>van life</em>. Si te llega un lead off-grid, primero pregunta: <strong>\xBFcu\xE1nto cobra la utility por line extension?</strong> Si es menos de $25K, que se conecte a la red.</p>

        <p><strong>El proceso de dimensionamiento off-grid \u2014 5 pasos en orden:</strong></p>

        <p><strong>Paso 1: Load calc diario en Wh.</strong> Lista TODO electrodom\xE9stico, multiplica watts \xD7 horas uso diario. Ejemplo cabin remota:</p>
        <ul>
          <li>Refrigerador 12V (120W run, 30% duty cycle, 24h) = 864 Wh/d\xEDa</li>
          <li>Luces LED (80W \xD7 4h) = 320 Wh/d\xEDa</li>
          <li>Bomba de agua (500W \xD7 0.5h) = 250 Wh/d\xEDa</li>
          <li>TV + wifi (80W \xD7 4h) = 320 Wh/d\xEDa</li>
          <li>Laptop + cargadores (60W \xD7 6h) = 360 Wh/d\xEDa</li>
          <li>Microondas ocasional (1200W \xD7 10min) = 200 Wh/d\xEDa</li>
          <li>Bomba calor mini-split 9kBTU (600W \xD7 4h) = 2,400 Wh/d\xEDa</li>
          <li><strong>Total: ~4,700 Wh/d\xEDa = 4.7 kWh/d\xEDa</strong></li>
        </ul>

        <p>Suma 15-25% para <em>phantom loads</em> y p\xE9rdidas del inversor: <strong>~5.8 kWh/d\xEDa de demanda real</strong>.</p>

        <p><strong>Paso 2: Peor mes de producci\xF3n (no promedio anual).</strong> En Sierra Nevada, enero tiene 2.5-3.5 PSH (vs 6.5 en julio). Dimensionar al promedio anual te deja sin energ\xEDa en invierno. Off-grid <em>siempre se dise\xF1a al peor mes</em>.</p>

        <p><strong>Paso 3: Autonom\xEDa (d\xEDas de reserva sin sol).</strong> California inland: 3 d\xEDas t\xEDpico. Costa foggy (Mendocino, Humboldt): 4-5 d\xEDas. Sierra con tormentas: 5-7 d\xEDas. Multiplica: demanda diaria \xD7 d\xEDas autonom\xEDa = energ\xEDa total del banco de bater\xEDas.</p>
        <p>Ejemplo: 5.8 kWh/d\xEDa \xD7 3 d\xEDas = <strong>17.4 kWh</strong> de bater\xEDa \xFAtil m\xEDnima.</p>

        <p><strong>Paso 4: Ajuste por Depth of Discharge (DoD).</strong> No puedes descargar 100% de una bater\xEDa \u2014 la destruye. Factores t\xEDpicos:</p>
        <ul>
          <li><strong>Plomo-\xE1cido inundada (<em>flooded lead-acid</em>):</strong> DoD 50% max. Econ\xF3micas pero voluminosas, requieren ventilaci\xF3n, \xE1cido sulf\xFArico, mantenimiento mensual. Trojan L16 es cl\xE1sica.</li>
          <li><strong>AGM / Gel:</strong> DoD 50-60%. Sealed, sin mantenimiento. 8-10 a\xF1os vida \xFAtil. Discover AGM.</li>
          <li><strong>Litio LFP (LiFePO\u2084):</strong> DoD 80-90%. 6,000-10,000 ciclos. Sin mantenimiento. M\xE1s caras upfront pero 3x vida \xFAtil. Victron, Battle Born, EG4, SOK, Fortress eFlex, Pytes. <em>El est\xE1ndar moderno off-grid</em>.</li>
        </ul>

        <p>Con LFP al 90% DoD: 17.4 kWh / 0.90 = <strong>19.3 kWh nominales</strong>. Con lead-acid al 50%: 17.4 / 0.50 = <strong>34.8 kWh nominales</strong>. Por eso ya casi nadie usa plomo en instalaciones serias.</p>

        <p><strong>Paso 5: Array PV dimensionado al peor mes.</strong> Con 2.8 PSH en enero, array debe generar 5.8 kWh \xD7 1.25 (eficiencia sistema 80%) = 7.25 kWh / 2.8 PSH = <strong>2.6 kW de array m\xEDnimo</strong>. En realidad, subes a 3.5-4 kW para recuperar el banco tras d\xEDa nublado. <em>Off-grid siempre se sobredimensiona el array</em> \u2014 es m\xE1s barato que una bater\xEDa m\xE1s grande.</p>

        <p><strong>Paso 6: Inversor off-grid y charge controller.</strong> El inversor off-grid (Schneider XW Pro, Victron Quattro, Outback Radian, EG4 18kPV, Sol-Ark 15K) maneja conversi\xF3n DC\u2192AC + charge del banco + generator input. Sizing: continuous rating debe cubrir <em>surge</em> de arranque \u2014 motor de 1HP jala 3-5x nominal en el arranque. Un inversor 6kW continuous / 12kW surge cubre cabin t\xEDpica.</p>
        <p>MPPT <em>charge controller</em> (si el inversor no lo trae integrado): Victron SmartSolar, Midnite Classic, Magnum. Dimensiona al Voc del string \xD7 1.25 (factor fr\xEDo) y al Isc \xD7 1.25. Controller 150V/60A cubre string residencial t\xEDpico.</p>

        <p><strong>Costo t\xEDpico de kit off-grid instalado CA 2026:</strong></p>
        <ul>
          <li><strong>Cabin peque\xF1a 3-5 kWh/d\xEDa:</strong> $18K-$28K (3kW PV + 15 kWh LFP + Sol-Ark 8K + balance of system).</li>
          <li><strong>Casa off-grid 10-15 kWh/d\xEDa:</strong> $45K-$70K (8kW PV + 30 kWh LFP + inversor 12kW + generador backup diesel/LP).</li>
          <li><strong>Rancho / agricultural off-grid:</strong> $80K-$200K+ seg\xFAn carga.</li>
        </ul>

        <p><strong>Generator backup \u2014 obligatorio off-grid.</strong> Ning\xFAn sistema off-grid debe operar sin generator de respaldo. 5-7 d\xEDas de clima nublado agotan el banco. LP (propano) 10-14kW Generac o Kohler, integrado al inversor v\xEDa <em>auto-start</em> cuando bater\xEDa baja a 30-40% SOC.</p>
      `,keyPoints:["Off-grid solo tiene sentido si line extension cuesta >$25K \u2014 si no, con\xE9ctate a la red","Load calc diario en Wh, peor mes de producci\xF3n (no promedio), autonom\xEDa 3-5 d\xEDas t\xEDpico CA","LFP (LiFePO\u2084) es el est\xE1ndar moderno: DoD 90%, 6,000-10,000 ciclos, vs plomo 50% DoD","Off-grid siempre sobredimensiona el array PV \u2014 m\xE1s barato que m\xE1s bater\xEDa","Inversor debe cubrir surge 2-3x continuous (motor start): Sol-Ark, Schneider XW, Victron Quattro","Generator backup obligatorio (LP/diesel) \u2014 5+ d\xEDas nublados agotan banco","Costo: cabin 3-5 kWh/d\xEDa $18-28K; casa 10-15 kWh/d\xEDa $45-70K; rancho $80K+"],realTalk:'El cliente que te dice "quiero ser off-grid para no depender de PG&E" en una casa suburbia de Riverside no quiere off-grid \u2014 quiere battery backup con grid-tie. Off-grid es 3-5x m\xE1s caro y tiene fallas. Si le sales con $80K cuando un Powerwall + PV le resuelve por $35K, est\xE1s vendiendo mal.',checklist:["Validar que line extension utility cueste m\xE1s que sistema off-grid \u2014 si no, descartar off-grid","Load calc detallado por electrodom\xE9stico con duty cycle realista, no nameplate","Seleccionar peor mes de PSH del sitio (no promedio anual) usando NREL PVWatts monthly","Dimensionar bater\xEDa LFP con 3-5 d\xEDas autonom\xEDa y 85-90% DoD usable","Sobredimensionar array PV 25-40% sobre c\xE1lculo m\xEDnimo para recuperaci\xF3n post-nublado","Especificar inversor con surge m\xEDnimo 2x continuous + auto-start de generator","Incluir generator LP/diesel 10-14kW con auto-transfer al inversor","Ventilaci\xF3n adecuada del banco (aun LFP produce calor en carga r\xE1pida)","Sistema de monitoreo remoto (Victron Cerbo GX, Sol-Ark app) \u2014 cliente DEBE ver SOC",'Contrato con disclaimer claro: "sistema requiere generator backup para 100% uptime"'],commonMistakes:["Dimensionar al promedio anual en lugar de peor mes \u2014 cliente sin luz en enero","Usar plomo-\xE1cido para ahorrar $3K upfront \u2014 cliente reemplaza banco a los 5 a\xF1os","Olvidar el surge del inversor \u2014 bomba de pozo no arranca, cliente enojado","No incluir generator backup \u2014 sistema falla la primera semana nublada","Subestimar phantom loads (chargers, standby) \u2014 15-25% extra que nadie calcula","Instalar en zona costa foggy sin considerar 4-5 d\xEDas autonom\xEDa \u2014 banco chico muere r\xE1pido","No entrenar al cliente en SOC monitoring \u2014 descarga total mata la bater\xEDa"]},{id:"battery-backup-hybrid",heading:"Battery Backup / Hybrid \u2014 el mercado #1 de 2026",body:`
        <p><strong>Battery backup con grid-tie (hybrid) es el producto m\xE1s caliente de California en 2026.</strong> El combo perfecto de 3 drivers: (1) NEM 3.0 hace la bater\xEDa financieramente necesaria, (2) PSPS de PG&E deja a clientes sin luz 2-5 d\xEDas al a\xF1o y ya est\xE1n hartos, (3) SGIP + ITC federal pagan 30-70% del costo del equipo. Un Powerwall 3 que costaba $15,000 instalado en 2022 sale al cliente a $6,500-$9,500 post-incentivos en 2026. <em>Ese es tu upsell</em>.</p>

        <p><strong>Las plataformas que DEBES conocer en 2026:</strong></p>

        <p><strong>Tesla Powerwall 3</strong> \u2014 lanzado 2023, ahora el <em>market leader</em>. 13.5 kWh \xFAtiles, 11.5 kW continuous, 185A LRA de motor start. Inversor hybrid integrado 11.5 kW AC \u2014 puede hacer DC-coupled con paneles directamente (ya no necesita inversor PV separado). Precio wholesale instalador: $9,500-$11,000. Precio cliente instalado: $13,500-$16,000 pre-incentivos. App Tesla es el est\xE1ndar de la industria. Warranty 10 a\xF1os, 70% capacity retention.</p>

        <p><strong>Enphase IQ Battery 5P / 10C</strong> \u2014 modular 5 kWh / 10 kWh unidades. IQ8H-BAT microinversores integrados, AC-coupled nativo. Dise\xF1ado para integrarse perfectamente con Enphase IQ8+ / IQ8M microinversores PV (misma plataforma Enlighten). Precio: IQ Battery 5P ~$4,800 wholesale / $7,200 cliente. 10C ~$8,500 / $12,500. <em>El mejor match si el cliente ya tiene Enphase en los paneles</em>.</p>

        <p><strong>FranklinWH aPower 2</strong> \u2014 sistema 15 kWh con <em>aGate</em> management unit. 12 kW continuous, 22 kW surge 10 sec. Soporta <em>stacking</em> hasta 8 unidades (120 kWh). Growth 2024-2025 r\xE1pida. Precio: $9,800-$11,500 wholesale, $14K-$17K cliente. Buen contender contra Powerwall cuando cliente quiere scalability.</p>

        <p><strong>SolarEdge Home Battery (Energy Bank)</strong> \u2014 9.7 kWh modular, pairs con SolarEdge HD-Wave / Energy Hub inverter. DC-coupled. Precio m\xE1s bajo ($6,500 wholesale) pero ecosistema m\xE1s peque\xF1o que Tesla/Enphase. Bueno para sistemas SolarEdge existentes.</p>

        <p><strong>LG ESS (RESU FLEX / Prime)</strong> \u2014 LG sali\xF3 del residential USA en 2023-2024 por problemas de warranty masivos (incendios en modelo RH). <em>No recomiendo instalar LG nuevo en 2026</em> hasta que estabilicen la l\xEDnea.</p>

        <p><strong>SunVault (SunPower)</strong> \u2014 descontinuado tras bancarrota SunPower 2024. Warranty en cuesti\xF3n.</p>

        <p><strong>Emporia / BigBattery / EG4 / Fortress</strong> \u2014 categor\xEDa <em>value</em> (bajo costo). EG4 PowerPro 14.3 kWh a $5,500 wholesale \u2014 40% m\xE1s barato que Powerwall. <em>Trade-off:</em> soporte t\xE9cnico m\xE1s d\xE9bil, warranty m\xE1s corta, UI menos pulida. Buenos para cliente consciente de precio si el contratista tiene capacidad de autoreparar.</p>

        <p><strong>AC-coupled vs DC-coupled \u2014 la decisi\xF3n arquitect\xF3nica.</strong></p>
        <ul>
          <li><strong>AC-coupled:</strong> bater\xEDa tiene su propio inversor. PV produce DC \u2192 inversor PV \u2192 AC \u2192 bater\xEDa inversor \u2192 AC \u2192 casa/grid. Dos conversiones, ~92% eficiencia round-trip. Ventaja: se retrofitea a sistema PV existente sin tocar los paneles. <strong>Enphase IQ Battery, Tesla Powerwall 2 eran AC-coupled</strong>.</li>
          <li><strong>DC-coupled:</strong> bater\xEDa comparte inversor con PV. DC \u2192 bater\xEDa directamente o \u2192 inversor hybrid \u2192 AC. Una sola conversi\xF3n, ~96% eficiencia. Mejor para sistemas nuevos. <strong>Tesla Powerwall 3, SolarEdge Home Battery, FranklinWH son DC-coupled / hybrid</strong>.</li>
        </ul>

        <p>Retrofit a casa con PV existente = AC-coupled (m\xE1s f\xE1cil). Construcci\xF3n nueva PV+battery = DC-coupled (m\xE1s eficiente, m\xE1s barato). Si el cliente tiene Enphase microinversores, <em>obligatorio IQ Battery</em> (ecosistema integrado).</p>

        <p><strong>Whole-home backup vs critical-loads panel.</strong> Dos arquitecturas seg\xFAn el budget y el load del cliente:</p>
        <ul>
          <li><strong>Whole-home backup:</strong> la bater\xEDa + inversor tiene capacidad para correr TODA la casa durante outage (AC central incluido). Requiere 1-2 Powerwalls o aPower 2 o 2 IQ Battery 10C. Costo: $25K-$40K. Cliente no siente el apag\xF3n.</li>
          <li><strong>Critical-loads backup (sub-panel):</strong> instalas un sub-panel con solo cargas cr\xEDticas (fridge, freezer, luces, wifi, 1 room AC mini-split, puerta de garage, seguridad). 1 bater\xEDa de 10-13 kWh es suficiente. Costo: $15K-$22K. Cliente vive "b\xE1sico" durante outage.</li>
        </ul>

        <p>Para mayor\xEDa de clientes CA 2026, <em>critical loads con 1 Powerwall 3 o IQ 10C es el sweet spot financiero</em>. Whole-home full AC requiere 2+ bater\xEDas y cliente de $200K+ ingresos.</p>

        <p><strong>SGIP \u2014 dinero que no todos los contratistas saben cobrar.</strong> El <em>Self-Generation Incentive Program</em> de California paga por kWh de bater\xEDa instalada. Tiers 2024-2026:</p>
        <ul>
          <li><strong>General Market:</strong> $150-$200/kWh. Powerwall 3 (13.5 kWh) = $2,025-$2,700.</li>
          <li><strong>Equity Resiliency (cliente en zona de alto riesgo de fuego + ingresos calificados):</strong> $850-$1,000/kWh. Powerwall 3 = $11,475-$13,500 \u2014 <em>la bater\xEDa pr\xE1cticamente gratis</em>.</li>
          <li><strong>Equity budget (low-income):</strong> $350-$500/kWh.</li>
        </ul>

        <p>SGIP se aplica PRE-incentivo al cliente. El contratista somete la aplicaci\xF3n en nombre del cliente v\xEDa el program administrator (PG&E, SCE, SoCalGas, CSE). Si no sabes aplicar al SGIP, est\xE1s dejando $2K-$13K en la mesa en cada instalaci\xF3n.</p>

        <p><strong>ITC federal 30%.</strong> El <em>Investment Tax Credit</em> paga 30% del costo TOTAL del sistema (PV + battery + labor + permits) como cr\xE9dito fiscal federal. Vigente 30% hasta 2032, 26% en 2033, 22% en 2034, elimina 2035. <em>Battery standalone (sin PV) tambi\xE9n califica desde 2023 si es \u22653 kWh</em> \u2014 IRA 2022. El cliente debe tener <em>tax liability</em> para consumir el cr\xE9dito (si no paga impuestos federales, no aplica). <em>Carryforward</em> disponible hasta 20 a\xF1os.</p>

        <p><strong>Payback analysis real \u2014 ejemplo cliente PG&E en 2026:</strong></p>
        <ul>
          <li>Bill actual PG&E: $380/mes = $4,560/a\xF1o</li>
          <li>Sistema: 9 kW PV (Enphase IQ8M) + IQ Battery 10C = $38,500 cliente pre-incentivos</li>
          <li>SGIP General Market ($170/kWh \xD7 10.08 kWh) = -$1,714</li>
          <li>ITC federal 30% = -$11,036</li>
          <li><strong>Costo neto cliente: ~$25,750</strong></li>
          <li>Ahorro anual a\xF1o 1: ~$3,800 (reduce bill a $60/mes)</li>
          <li><strong>Payback: ~6.8 a\xF1os. IRR 25 a\xF1os: 11-13%.</strong></li>
        </ul>

        <p>Ese es el <em>pitch</em> que cierra. "Cliente, en 7 a\xF1os ya pagaste el sistema, y tienes 23 a\xF1os m\xE1s de energ\xEDa pr\xE1cticamente gratis + blackout protection."</p>
      `,keyPoints:["Tesla Powerwall 3 (13.5 kWh, hybrid DC-coupled) = market leader 2026; $13-16K cliente pre-incentivos","Enphase IQ Battery 5P/10C \u2014 obligatorio si sistema PV ya tiene microinversores Enphase","FranklinWH aPower 2 \u2014 scalable, 15 kWh, surge 22 kW; buen contender vs Powerwall","SGIP CA: $150-200/kWh General, $850-1000/kWh Equity Resiliency (zonas alto riesgo fuego)","ITC federal 30% hasta 2032 \u2014 aplica a battery standalone desde IRA 2022","AC-coupled para retrofit a PV existente; DC-coupled (hybrid) para sistema nuevo","Critical-loads sub-panel ($15-22K) vs whole-home backup ($25-40K) seg\xFAn budget cliente"],realTalk:"El cliente que tiene AC central, piscina y $250K ingreso quiere whole-home con 2 Powerwalls. El cliente promedio de $120K quiere critical loads con 1 Powerwall. Si cotizas lo mismo para los dos, pierdes al de abajo por precio y al de arriba por falta de ambici\xF3n. Clasifica al cliente primero.",checklist:["Verificar zona Tier 2/3 fire map para elegibilidad SGIP Equity Resiliency","Pull tax liability estimada con cliente para validar uso de ITC 30%","Seleccionar AC-coupled vs DC-coupled seg\xFAn PV existente (retrofit) o nuevo","Calcular critical-loads sub-panel vs whole-home seg\xFAn budget y consumo nocturno","Submit SGIP application v\xEDa program administrator ANTES de interconnect","Especificar UL 9540 / UL 9540A listing para cumplir c\xF3digo NEC 706","Coordinar labeling del ESS (NEC 706.15): arc-flash, disconnect, emergency shutoff","Entrenar cliente en app (Tesla, Enlighten, FranklinWH) \u2014 SOC monitoring daily","Entregar documentaci\xF3n para IRS Form 5695 (Residential Energy Credit)","Follow-up 30 d\xEDas post-PTO: validar SOC cycling + app alerts configurados"],commonMistakes:["Cotizar Powerwall 3 a casa con Enphase \u2014 perder integraci\xF3n Enlighten y app fragmentada","No aplicar SGIP Equity Resiliency en zona Tier 3 \u2014 dejar $10K+ en la mesa","Prometer ITC sin verificar tax liability \u2014 cliente no puede consumir cr\xE9dito, se enoja","Whole-home backup sin hacer load calc \u2014 bater\xEDa chica no arranca AC central","AC-coupled en construcci\xF3n nueva cuando DC-coupled (hybrid) es 6-8% m\xE1s eficiente","Ignorar labeling NEC 706 \u2014 fail en inspecci\xF3n, retraso de 2-4 semanas",'No configurar app para el cliente \u2014 reviews 1-estrella por "no s\xE9 c\xF3mo funciona"']},{id:"emergency-transfer",heading:"Emergency Connections y Transfer Switches \u2014 NEC 702 no es opcional",body:`
        <p><strong>El error que mata lineros \u2014 literal.</strong> Cliente compra generador port\xE1til de $800 en Home Depot tras un PSPS. Lo conecta a la casa usando un "suicide cord" (macho-macho) por el recept\xE1culo de la dryer. Cuando PG&E restaura el servicio, el generador backfeedea por el meter a la red de baja tensi\xF3n (240V), sube al transformador (al rev\xE9s: 240V \u2192 7.2kV), y mata al t\xE9cnico de PG&E que est\xE1 trabajando en el poste pensando que la l\xEDnea est\xE1 desenergizada. Esto NO es teor\xEDa \u2014 pasa todos los a\xF1os. <strong>NEC 702.4 y NEC 702.5 exigen separaci\xF3n f\xEDsica entre generator y utility feed</strong>. El mecanismo que garantiza esa separaci\xF3n es el <em>transfer switch</em> o <em>interlock kit</em>.</p>

        <p><strong>Las 3 opciones de c\xF3digo-compliant, en orden de precio:</strong></p>

        <p><strong>1. Interlock Kit ($100-$300 material + $400-$800 labor) \u2014 la opci\xF3n econ\xF3mica y leg\xEDtima.</strong> Es una placa met\xE1lica deslizante que se instala en el breaker panel. Bloquea f\xEDsicamente la posibilidad de tener el <em>main breaker</em> (utility) y el <em>generator breaker</em> ambos cerrados al mismo tiempo. Para activar el generador, cliente: (a) baja el main breaker, (b) desliza el interlock, (c) sube el generator breaker. La separaci\xF3n f\xEDsica es mec\xE1nica \u2014 es imposible electrificar ambas fuentes a la vez. <strong>UL listed, NEC 702.5(B) compliant</strong>.</p>
        <p>Fabricantes que aprueban el interlock en sus paneles: Square D QO, Siemens, Eaton BR/CH, GE. <em>Nunca instales un interlock gen\xE9rico de $30 de Amazon en un panel Siemens \u2014 eso es violaci\xF3n de c\xF3digo y la warranty del panel se cancela</em>. Usa el kit OEM espec\xEDfico ($120-$250).</p>

        <p>Ideal para: cliente con generator port\xE1til 5-10kW, budget ajustado, dispuesto a operar manualmente durante outage.</p>

        <p><strong>2. Manual Transfer Switch ($300-$800 material + $600-$1200 labor).</strong> Es una caja separada (6-10 circuitos t\xEDpico) que se instala al lado del panel principal. Cada circuito cr\xEDtico se "mueve" al transfer switch. Durante operaci\xF3n normal, los switches est\xE1n en "Line" (utility). Durante outage, cliente: (a) arranca generator, (b) mueve cada switch individual a "Gen". Fabricantes: Reliance Controls (30310A, 31410B), Generac (6375, 6376), GE.</p>
        <p>Ventaja vs interlock: <em>cliente puede seleccionar qu\xE9 circuitos energizar</em> \u2014 no prende TODO, solo los cr\xEDticos, para no exceder la capacidad del generator. Desventaja: mueves un panel secundario con solo 6-10 circuitos (no whole-home).</p>

        <p>Ideal para: cliente que quiere respaldo de circuitos espec\xEDficos (fridge + freezer + luces + wifi + bomba de sump + bomba de pozo) con generator 7-10 kW.</p>

        <p><strong>3. Automatic Transfer Switch (ATS) ($800-$2,500 material + $1,200-$2,500 labor).</strong> Switch motorizado que detecta outage, arranca el generator, transfiere la carga en 10-30 segundos, y revierte autom\xE1ticamente cuando vuelve la luz. Fabricantes: Generac RXSW, Kohler RXT, Cummins RA, ASCO, Eaton.</p>
        <p>Pairing obligatorio con <em>standby generator</em> permanente (Generac Guardian, Kohler, Cummins, Briggs). Cliente NO hace nada durante outage \u2014 transici\xF3n invisible excepto el "tick" del transfer (2-30 segundos de blackout t\xEDpico). Service entrance ATS (whole-home) o critical-loads ATS (sub-panel).</p>

        <p>Ideal para: cliente con standby generator fijo ($8K-$15K), casa con refrigeradores, <em>home office</em>, sistema m\xE9dico dependiente, budget $$$. Producto <em>premium</em> = margen alto.</p>

        <p><strong>Generator inlet box \u2014 el complemento obligatorio del interlock/manual switch.</strong> Para conectar generator port\xE1til, NO usas una extensi\xF3n normal. Instalas un <em>power inlet box</em> exterior (NEMA L14-30 para 30A/240V o L14-50 para 50A/240V) en la pared de la casa, cerca del generator. Del inlet box \u2192 cable SOOW #10 o #6 \u2192 breaker en el panel (protegido por interlock/MTS). Fabricantes: Reliance Controls PB30, PB50. Precio: $80-$180.</p>

        <p><strong>Sub-panel transfer (critical loads panel).</strong> Arquitectura de facto en CA 2026 para standby + battery: panel principal queda conectado a utility; un <em>sub-panel de cargas cr\xEDticas</em> (fridge, freezer, luces, 1-2 outlets de TV/wifi, bomba de sump, mini-split de un cuarto) se alimenta v\xEDa ATS desde el standby generator O desde Tesla Gateway / IQ System Controller. Sizing t\xEDpico: sub-panel 60-100A, 12-20 circuitos.</p>

        <p>Ventaja: durante outage, el inversor bater\xEDa o el generator solo tiene que alimentar 15-30A en lugar de 200A \u2014 extiende <em>runtime</em> significativamente.</p>

        <p><strong>Ejemplo instalaci\xF3n t\xEDpica casa 2,200 sq ft \u2014 generator port\xE1til Honda EU7000iS (7kW) + interlock:</strong></p>
        <ul>
          <li>Generator port\xE1til Honda EU7000iS: $4,500 (cliente aporta o cotizas)</li>
          <li>Interlock kit Square D QO HOMPLK (OEM): $150</li>
          <li>Power inlet box Reliance PB50: $140</li>
          <li>Breaker Square D QO 250A: $95 (o tama\xF1o apropiado)</li>
          <li>Cable SOOW #6/4 10 ft con L14-30P ambos extremos: $180</li>
          <li>Labor 6-8 horas (incluye pull permit): $750-$1,100</li>
          <li><strong>Total instalado sin generator: $1,300-$1,700</strong></li>
          <li><strong>Con generator Honda: $5,800-$6,200 instalado</strong></li>
        </ul>

        <p><strong>Permit requerido.</strong> Todo trabajo en el breaker panel de casa habitada requiere <em>electrical permit</em> del Building Dept local. $80-$180. Inspector verifica: labeling ("Generator Power \u2014 Disconnect Utility Before Operating"), torque en breaker, cable sizing, grounding, interlock operation. Hacer el trabajo sin permit = violation + fine + te quitan la licencia C-10/C-46 si te reportan.</p>
      `,keyPoints:["NEC 702.4 / 702.5 exigen separaci\xF3n f\xEDsica entre generator y utility \u2014 backfeed mata lineros","Interlock Kit OEM ($100-300) es c\xF3digo-compliant para generator port\xE1til + panel existente","Manual Transfer Switch ($300-800) = 6-10 circuitos espec\xEDficos, selecci\xF3n manual","Automatic Transfer Switch ($800-2500) = standby generator, transferencia 10-30 seg","Power inlet box NEMA L14-30 (30A) o L14-50 (50A) obligatorio \u2014 no extensi\xF3n regular","Sub-panel de cargas cr\xEDticas extiende runtime del battery/generator significativamente","Electrical permit SIEMPRE requerido \u2014 inspector verifica labeling, torque, grounding"],realTalk:'Si ves a un cliente con un "suicide cord" enchufado de la dryer al generator, no te voltees. Dile que eso mata a los t\xE9cnicos de PG&E, que es federal violation, y que por $1,500 instalado le dejas un interlock kit legal. 9 de 10 firman ah\xED mismo. Ese es un upsell que salva vidas literalmente.',checklist:["Pull electrical permit en Building Dept local ANTES de abrir el panel","Verificar que interlock sea OEM del fabricante del panel (Square D, Siemens, Eaton, GE)","Validar sizing del breaker generator = capacidad del inlet box (30A o 50A t\xEDpico)","Instalar power inlet box NEMA L14-30 o L14-50 en pared exterior, m\xEDnimo 18 in del suelo",'Labeling c\xF3digo NEC 702.7: "Generator Power Source \u2014 Disconnect Utility Before Operating"',"Grounding del generator port\xE1til al sistema de grounding de la casa (NEC 250)","Demostrar al cliente la secuencia de operaci\xF3n: (1) main off, (2) interlock slide, (3) gen on","Probar interlock f\xEDsicamente frente al inspector \u2014 mecanismo no permite ambos cerrados","Entregar al cliente manual impreso de operaci\xF3n + video corto en tel\xE9fono","Inspecci\xF3n final + sign-off del Building Dept antes de energizar el sistema"],commonMistakes:['Usar "suicide cord" macho-macho \u2014 federal violation + mata lineros',"Instalar interlock gen\xE9rico de Amazon en panel que no lo aprueba \u2014 cancela warranty","Olvidar power inlet box y correr extensi\xF3n por la ventana \u2014 violaci\xF3n c\xF3digo","No entrenar al cliente en la secuencia \u2014 el primer outage arranca el gen mal","Trabajar sin permit \u2014 CSLB te suspende la licencia si te reportan","Subestimar el breaker generator \u2014 breaker 30A con generator de 7kW overcargado","No grounding del generator \u2014 riesgo de shock + falla GFCI"]},{id:"generadores-standby",heading:"Generadores \u2014 port\xE1til vs standby, sizing, y el upsell post-PSPS",body:`
        <p><strong>En California en 2026, los generadores standby son el mejor upsell oportun\xEDstico del a\xF1o.</strong> Despu\xE9s del PSPS de septiembre 2024 que dej\xF3 a 80,000 hogares sin luz 3-5 d\xEDas, la demanda de standby generators subi\xF3 180% en So-Cal y 240% en el Bay Area. Cliente llega con AC roto, t\xFA llegas, ves que tambi\xE9n quiere respaldo, cierras gen + ATS + upsell de $10K-$16K encima del AC. Ese es el mercado.</p>

        <p><strong>Port\xE1til vs Standby \u2014 la decisi\xF3n primaria.</strong></p>
        <ul>
          <li><strong>Port\xE1til (3-10kW):</strong> $500-$5,000. Gasolina (runtime 8-12h por tanque), propano opcional. Cliente arranca manual, mueve a backyard, conecta a inlet box. Honda EU7000iS, Westinghouse WGen9500, Generac GP7500E, Champion 7500. Ruido: 65-76 dB a 23 ft. Almacenamiento: garage + stabilizer en gasolina.</li>
          <li><strong>Standby permanente (8-26kW):</strong> $3,500-$12,000 equipment + $4K-$8K instalaci\xF3n + ATS + gas line. Fijo en concrete pad exterior. Auto-start en outage 10-30 seg. NG (natural gas) o LP (propano). Runtime: <em>ilimitado</em> con NG, 8-40 horas con tanque LP 250-500 gal. Ruido: 58-66 dB (m\xE1s quiet que port\xE1til).</li>
        </ul>

        <p>Cliente casual con budget bajo y acepta operar manual = port\xE1til. Cliente premium, home office, ancianos, CPAP, seguridad, dispuesto a invertir $15K = standby.</p>

        <p><strong>Sizing \u2014 managed loads vs whole-home.</strong> Aqu\xED es donde la mayor\xEDa de los contratistas cotizan mal. <em>Un standby 14kW NO corre una casa t\xEDpica con AC central de 4-5 ton sin management</em>. F\xF3rmula:</p>
        <ul>
          <li><strong>Whole-home UNmanaged:</strong> suma TODOS los running watts + LRA del motor m\xE1s grande (AC t\xEDpico 4 ton: running 4kW, LRA 25-35kW). Casa t\xEDpica 2,200 sq ft con AC central = 22-30 kW requeridos. Eso es un generator 22-26kW = $8,500-$12,000 equipment.</li>
          <li><strong>Whole-home MANAGED:</strong> con <em>load management module</em> (Generac Power Manager, Kohler Load Shed), el gen shed cargas no-cr\xEDticas durante motor start. Permite gen 14-18 kW para casa 2,200 sq ft. Ahorra $2K-$4K en equipment.</li>
          <li><strong>Critical-loads only (con sub-panel):</strong> gen 10-12 kW maneja fridge + luces + wifi + 1 room mini-split + microwave (no simult\xE1neo). $4,500-$6,500 equipment.</li>
        </ul>

        <p><strong>Para sizing correcto:</strong> usa Generac Sizing Calculator online o Kohler Power Calculator. Input: AC tonnage, electric range Y/N, well pump Y/N, electric dryer Y/N, EV charger Y/N. El tool te da el kW recommended con y sin load management.</p>

        <p><strong>Running watts vs starting watts (LRA) \u2014 la trampa del sizing.</strong> Todo motor jala 3-5x el <em>running</em> durante arranque. Un AC de 4 ton con <em>running</em> 4kW puede jalar 22-35kW durante 2-5 segundos. Si tu generator es 14kW continuous y 17.5kW surge, el AC no arranca. Cliente ve luces bajar, gen hace "bzzzt", breaker trip. Por eso los generators se miden en <em>running</em> kW y <em>surge</em> kW \u2014 siempre verifica ambos. Un Generac Guardian 22kW tiene 100A LRA interno suficiente para AC 5 ton.</p>

        <p><strong>Gas natural vs LP vs Diesel \u2014 trade-offs duros.</strong></p>
        <ul>
          <li><strong>Natural Gas (NG):</strong> l\xEDnea de la utility. Runtime ilimitado. <em>Requiere gas line upgrade en la mayor\xEDa de casas</em> \u2014 el gen jala 200-350 CF/hr, y un meter est\xE1ndar residencial da 250-400 CF/hr total. Si la casa tambi\xE9n tiene furnace + water heater + stove a gas, necesitas meter upgrade ($800-$2,500 PG&E). Presi\xF3n: 7" WC t\xEDpico residencial, pero gens grandes requieren 11-14" WC \u2014 <em>high-pressure regulator + line upgrade</em>. Emisiones m\xE1s limpias que LP o diesel.</li>
          <li><strong>Liquid Propane (LP):</strong> tanque propietario. 250 gal almacena ~210 gal usables = ~40 horas de runtime a carga completa. 500 gal = ~80 horas. 1000 gal = ~160 horas. Tank rental: $80-$150/a\xF1o + delivery ($4-$6/gal). Sin l\xEDnea utility = independiente. <em>Ideal para rural/rancho</em> o casas sin NG.</li>
          <li><strong>Diesel:</strong> comercial / industrial. Runtime largo, fuel storage grande (500-5000 gal). No t\xEDpico residencial. M\xE1s eficiente que gas en emergencias largas. Kohler y Cummins dominan comercial diesel. Ruido m\xE1s alto.</li>
        </ul>

        <p><strong>Marcas dominantes 2026:</strong></p>
        <ul>
          <li><strong>Generac Guardian (9kW, 14kW, 18kW, 22kW, 24kW, 26kW):</strong> #1 market share USA ~70%. Parts disponibles, network autorizado amplio. Mobile Link monitoring app. Precio wholesale: 14kW ~$3,800, 22kW ~$5,500, 26kW ~$7,200.</li>
          <li><strong>Kohler (14RESAL, 20RESCL, 26RCAL, 30RCL):</strong> premium alternative. Mejor warranty (5 yrs std), Command Controller robust. 25% m\xE1s caro que Generac equivalent pero mejor reliability en long-term. OnCue Plus monitoring.</li>
          <li><strong>Cummins QuietConnect (13kW, 20kW, 22kW, 25kW):</strong> PowerCommand, Wi-Fi monitoring. 20kW ~$6,200 wholesale. Excelente en load management. Competidor directo a Kohler.</li>
          <li><strong>Briggs & Stratton Fortress:</strong> valor m\xE1s bajo, residential budget. Warranty m\xE1s corta. Uso: clientes <em>value-conscious</em>.</li>
          <li><strong>Champion:</strong> port\xE1tiles + inverter gens. No compete en standby residencial serio.</li>
        </ul>

        <p><strong>Break-in procedure (primera 25 horas) \u2014 paso que casi nadie explica al cliente.</strong> Generador nuevo requiere <em>break-in</em>: operaci\xF3n a 50-75% carga durante las primeras 25 horas (no full load, no idle). Aceite mineral non-synthetic en el break-in; cambio a synthetic 5W-30 post-25h. Saltar break-in = glazing de los cilindros, consumo de aceite a largo plazo, p\xE9rdida de compresi\xF3n.</p>

        <p><strong>Mantenimiento anual obligatorio:</strong></p>
        <ul>
          <li>Cambio de aceite + filtro: anual o cada 100 horas, el que ocurra primero.</li>
          <li>Filtro de aire: anual.</li>
          <li>Buj\xEDas: cada 200 horas o 2 a\xF1os.</li>
          <li>Battery del arranque: 3-5 a\xF1os vida \xFAtil, test con mult\xEDmetro anual.</li>
          <li>Coolant flush (motores liquid-cooled): cada 3 a\xF1os.</li>
          <li>Gas line test pressure: anual si tienes licencia C-36 gas.</li>
          <li><strong>Exercise weekly:</strong> 5-10 min semanal (programado en el controller) para circular aceite, cargar battery, validar operaci\xF3n.</li>
        </ul>

        <p>Vende <em>annual maintenance agreement</em> $250-$450/a\xF1o \u2014 margen 60%+, retenci\xF3n de cliente, oportunidad para upsell cada visita.</p>

        <p><strong>Warranty t\xEDpica:</strong> Generac Guardian 5 a\xF1os parts + 2 a\xF1os labor (cuando instalado por <em>authorized dealer</em>). Kohler 5 a\xF1os comprehensive. Cummins 5 a\xF1os. <em>Si cliente compra en Costco/Home Depot e instala por su cuenta, warranty baja a 2-3 a\xF1os</em>. Por eso el <em>authorized dealer pathway</em> es premium \u2014 warranty extendida es valor real al cliente.</p>

        <p><strong>Permits requeridos CA:</strong></p>
        <ul>
          <li><strong>Electrical permit:</strong> Building Dept. $150-$400.</li>
          <li><strong>Gas permit:</strong> Building Dept + gas line inspection. $100-$250.</li>
          <li><strong>Building permit:</strong> concrete pad + setback (m\xEDnimo 5 ft de casa, 3 ft de property line t\xEDpico). $200-$500.</li>
          <li><strong>Air Quality Management District (AQMD)</strong> notice en algunos condados (SCAQMD, BAAQMD) para standby > 50 hrs/yr. Residencial t\xEDpico OK.</li>
          <li><strong>HOA approval</strong> si aplica \u2014 muchas HOAs limitan dB levels o location.</li>
        </ul>

        <p><strong>Instalaci\xF3n t\xEDpica CA 2026 \u2014 casa 2,200 sq ft, Generac Guardian 22kW NG:</strong></p>
        <ul>
          <li>Generac Guardian 22kW: $5,500 wholesale / $7,500 cliente</li>
          <li>ATS 200A Generac RTSW200A3: $850 wholesale / $1,200 cliente</li>
          <li>Concrete pad 4x5 ft: $350 labor</li>
          <li>Gas line 3/4" + regulator upgrade 20 ft: $750-$1,200</li>
          <li>Electrical conduit + wire (4/0 AWG) a ATS: $650</li>
          <li>Labor install (2 d\xEDas, 2 t\xE9cnicos): $2,400-$3,200</li>
          <li>Permits: $450-$900</li>
          <li>Start-up + first exercise cycle: $250</li>
          <li><strong>Total instalado cliente: $13,500-$16,500</strong></li>
        </ul>
      `,keyPoints:["Port\xE1til 3-10kW ($500-5K) = manual operation; Standby 8-26kW ($13-17K instalado) = auto","Sizing: whole-home unmanaged requiere 22-26kW, managed 14-18kW, critical-loads 10-12kW","Running watts vs LRA: AC 4 ton = 4kW running / 25-35kW surge \u2014 verifica ambos en gen spec","NG ilimitado pero requiere gas line upgrade ($800-2.5K); LP tank 250gal = ~40h runtime","Generac (70% share USA), Kohler (premium), Cummins (load mgmt), Briggs (budget)","Break-in 25h obligatorio + exercise semanal + maintenance anual ($250-450/a\xF1o upsell)","Warranty 5 yrs con authorized dealer install; 2-3 yrs si compra Costco/HD self-install"],realTalk:'El cliente que te llama post-PSPS est\xE1 emocional y firma lo que le pongas enfrente. No abuses \u2014 cotiza justo, pero NO hagas el "sizing conservador de $6K" cuando la casa necesita 22kW. En 2 a\xF1os con otro PSPS va a prender el AC y el gen se va a trip. El cliente va a contar que TU gen fall\xF3. Sizing correcto o no vendas.',checklist:['Correr Generac/Kohler sizing calculator con all loads \u2014 no "a ojo"',"Verificar capacidad del gas meter + l\xEDnea \u2014 upgrade si insuficiente","Pull electrical + gas + building permits en Building Dept local","Verificar setbacks HOA + c\xF3digo (5 ft de casa, 3 ft property line t\xEDpico)","Concrete pad 4x5 ft m\xEDnimo, level, con conduits embebidos","Instalar con authorized dealer credentials para warranty extendida","ATS sizing = main breaker rating de la casa (100A / 200A / 400A)","Break-in 25h con aceite mineral antes de synthetic","Programar weekly exercise en controller (5-10 min, t\xEDpico martes 12:00pm)","Vender annual maintenance agreement $250-450/yr en el cierre \u2014 60%+ margen"],commonMistakes:["Sizing a running watts solamente \u2014 AC no arranca en el primer outage","Instalar NG sin verificar capacidad del meter \u2014 line pressure colapsa con gen + furnace corriendo","Saltar break-in \u2014 cliente quema aceite a los 500 horas, reclama warranty, te demanda","No programar weekly exercise \u2014 battery muere, gen no arranca el d\xEDa del outage","Instalar como unauthorized dealer \u2014 warranty del cliente queda en 2 a\xF1os vs 5","Ignorar setback HOA \u2014 vecino queja, multa, mover gen $2K+","No vender maintenance agreement \u2014 pierdes retenci\xF3n + upsell recurrente"]},{id:"nec-codes-solar",heading:"C\xF3digo NEC 690 / 705 / 706 / 480 \u2014 lo que el inspector va a revisar",body:`
        <p><strong>Los c\xF3digos NEC aplicables a PV, ESS y generator son densos pero espec\xEDficos.</strong> El inspector del Building Dept no va a hacer el sistema por ti, pero s\xED te va a reprobar si no cumples. Y reprobar = retrabajo + re-inspecci\xF3n fee + 2-4 semanas de retraso + cliente furioso. Dominar NEC 690, 705, 706 y 480 es la diferencia entre un contratista que pasa inspecci\xF3n la primera vez y uno que vive regresando.</p>

        <p><strong>NEC 690 \u2014 Solar Photovoltaic (PV) Systems.</strong> Es el cap\xEDtulo madre para todo sistema fotovoltaico. Los art\xEDculos que m\xE1s te van a aplicar:</p>
        <ul>
          <li><strong>690.4 \u2014 Installation requirements.</strong> Circuitos PV se clasifican como "PV source circuits" (entre m\xF3dulos y combiner), "PV output circuits" (del combiner al inversor) y "Inverter output circuits" (del inversor a la casa).</li>
          <li><strong>690.7 \u2014 Maximum voltage.</strong> Voltaje m\xE1ximo del string calculado con Voc \xD7 <em>temperature correction factor</em> (NEC Table 690.7) para la temperatura m\xEDnima hist\xF3rica del sitio. En So-Cal m\xEDnima -5\xB0C, factor 1.10. String Voc nominal 500V \xD7 1.10 = 550V real \u2014 debe quedar \u2264 600V residencial (UL) o 1000V commercial.</li>
          <li><strong>690.8 \u2014 Ampacity and overcurrent protection.</strong> Conductor sizing = Isc \xD7 1.25 (irradiance factor) \xD7 1.25 (continuous load factor) = Isc \xD7 1.56. Un m\xF3dulo con Isc 11A requiere conductor de 17.2A m\xEDnimo (t\xEDpicamente #10 AWG PV wire).</li>
          <li><strong>690.12 \u2014 Rapid Shutdown (RSD).</strong> <em>El requisito m\xE1s importante desde NEC 2017</em>. Todo PV residencial en rooftop DEBE tener Rapid Shutdown compliance: dentro de 10 segundos tras activar el disconnect, todos los conductores en el array/rooftop bajan a \u2264 30V (conductor dentro del array) y \u2264 80V (conductor de salida del array). Conseguido v\xEDa <em>module-level power electronics</em>:
            <ul>
              <li>Enphase microinversores IQ8+/IQ8M/IQ8A (nativamente RSD compliant)</li>
              <li>SolarEdge optimizers P370/P400/P505 + inverter</li>
              <li>Tigo TS4 + compatible inverter</li>
              <li>AP Systems microinversores</li>
            </ul>
          </li>
          <li><strong>690.31 \u2014 Wiring methods.</strong> DC wire en rooftop = <em>PV wire</em> (NEC listed, UV-resistant, TC-ER rated) o USE-2. NO usar THHN en exposici\xF3n solar \u2014 se degrada en 3-5 a\xF1os.</li>
          <li><strong>690.41 \u2014 System grounding.</strong> PV array grounded via equipment grounding conductor (EGC) + bonding de frames met\xE1licos. Ground rod t\xEDpico + bond al service ground.</li>
          <li><strong>690.43 \u2014 Grounding conductors + WEEBs</strong> (Washer Electrical Equipment Bond) entre panel + rail de aluminio.</li>
          <li><strong>690.47 \u2014 Grounding electrode system.</strong> Array grounded al mismo sistema que la casa (no separate ground rod).</li>
          <li><strong>690.53 \u2014 Labeling.</strong> Placard de "Photovoltaic System Disconnect" con max voltage, max current, fault current. Texto blanco sobre fondo rojo, 3/8" character height m\xEDnimo.</li>
        </ul>

        <p><strong>NEC 705 \u2014 Interconnected Electric Power Production Sources.</strong> Aplica cuando dos o m\xE1s fuentes (utility + PV + battery + generator) se conectan al mismo sistema.</p>
        <ul>
          <li><strong>705.12 \u2014 Load side connection ("120% rule").</strong> Cuando metes el PV breaker en el panel principal <em>load-side</em> del main breaker, la suma del <em>main breaker + PV breaker</em> no puede exceder 120% del bus rating. Panel 200A bus con main 200A permite breaker PV de 40A m\xE1ximo (200 + 40 = 240 = 120% de 200). Si el sistema es m\xE1s grande, requieres <em>line-side tap</em> (antes del main) o <em>supply-side connection</em>.</li>
          <li><strong>705.40 \u2014 Disconnect lockable en posici\xF3n OFF.</strong> AC disconnect visible + lockable exterior de la casa, accesible al utility lineman.</li>
          <li><strong>705.45 \u2014 System labeling + one-line diagram</strong> visible en el panel indicando todas las fuentes.</li>
        </ul>

        <p><strong>NEC 706 \u2014 Energy Storage Systems (ESS).</strong> Cap\xEDtulo relativamente nuevo (2017), expandido en 2020 y 2023. Aplica a todo battery storage residencial y comercial.</p>
        <ul>
          <li><strong>706.5 \u2014 Listing.</strong> ESS DEBE estar listado UL 9540 (system level) y celdas UL 9540A (thermal runaway propagation test). Tesla Powerwall 3, Enphase IQ Battery, FranklinWH, SolarEdge Home Battery \u2014 todos cumplen. Si el equipo NO tiene UL 9540A, el inspector <em>puede</em> reprobar.</li>
          <li><strong>706.7 \u2014 Maintenance + commissioning records.</strong> Cliente debe tener documento con specs, commissioning test results, emergency shutdown procedure.</li>
          <li><strong>706.10 \u2014 Disconnecting means.</strong> Disconnect exterior para cada ESS, accesible al bombero (labeled "Energy Storage Disconnect").</li>
          <li><strong>706.15 \u2014 Labeling extenso.</strong> Voltage, capacity (kWh), chemistry, emergency shutdown steps, location of other ESS. Fire-responsive placard.</li>
          <li><strong>706.20 \u2014 Ubicaci\xF3n.</strong> Restrictions on garage (attached) installation \u2014 algunos jurisdictions requieren 3 ft de clearance a ventanas/puertas de casa, 5 ft de property line.</li>
          <li><strong>706.30 \u2014 Overcurrent protection</strong> en cada battery circuit + fuses en DC combiners.</li>
        </ul>

        <p><strong>NEC 480 \u2014 Stationary Standby Batteries.</strong> Applies a banco de bater\xEDas (no pre-packaged ESS). Menos relevante en 2026 porque la mayor\xEDa de storage es pre-packaged (Powerwall, IQ Battery). Sigue aplicable en DIY residential o off-grid con banco de celdas separadas. Ventilaci\xF3n, bonding, disconnect, overcurrent.</p>

        <p><strong>Arc-Fault (AFCI) \u2014 NEC 690.11.</strong> Todo DC PV system > 80V Voc debe tener <em>DC arc-fault circuit interrupter</em> que detecte arco paralelo en el conductor DC y trip en < 2.5 segundos. Integrado en la mayor\xEDa de inversores modernos (Enphase IQ8 nativamente, SolarEdge HD-Wave). <em>No es opcional</em>. Si usas inversor viejo sin AFCI, reprobado.</p>

        <p><strong>Ground-Fault (GFCI/GFDI) \u2014 NEC 690.5.</strong> Ground-fault detection interrupter para circuitos DC. Detecta leakage de corriente a ground y trip. Integrado en inverters modernos.</p>

        <p><strong>DC conductors \u2014 NEC 690.31(G) "Embedded" rules.</strong> Conductor DC dentro del edificio (atr\xE1s de drywall, en attic, en crawl space) debe estar en <em>metallic raceway</em> (EMT conduit) o <em>metal-clad cable</em>. Esto es para proteger al bombero \u2014 si corta drywall durante fire, no corta un conductor DC energizado. Enphase no aplica (conductores DC solo dentro del panel, AC sale al edificio).</p>

        <p><strong>Labeling obligatorio \u2014 lo que el inspector cuenta con linterna:</strong></p>
        <ul>
          <li>AC Disconnect PV system \u2014 texto rojo/blanco, Voltage, Max Current, Fault Current (NEC 690.53)</li>
          <li>Utility Main Disconnect indicando "WARNING: MULTIPLE SOURCES \u2014 UTILITY + PV + ESS" (NEC 705.10)</li>
          <li>One-line diagram en el panel</li>
          <li>ESS emergency shutdown procedure (NEC 706.15)</li>
          <li>Battery chemistry + capacity (NEC 706.15)</li>
          <li>Rapid Shutdown placard en meter enclosure (NEC 690.56(C))</li>
        </ul>

        <p>Usa Enphase Labels, Tesla Labels oficiales, o HellermannTyton placards impresas \u2014 NO Sharpie sobre tape. Inspector lo rechaza.</p>

        <p><strong>HCD vs Building Dept jurisdictions \u2014 CA specific.</strong> California tiene una rareza: <em>manufactured homes</em> y <em>mobile homes</em> caen bajo <em>HCD</em> (Housing and Community Development) state agency, NO Building Dept local. Permit process diferente, fees diferentes, inspector diferente. Si tu cliente vive en un <em>mobilehome park</em>, verificar si es HCD-jurisdiction. Casa tradicional = Building Dept del city/county.</p>
      `,keyPoints:["NEC 690.12 Rapid Shutdown: obligatorio desde 2017, \u226430V en array dentro de 10 seg","Enphase IQ8 y SolarEdge optimizers/Tigo TS4 son las soluciones RSD compliant residencial",'705.12 "120% rule": main breaker + PV breaker \u2264 120% del bus rating del panel',"NEC 706 ESS: UL 9540 listing + UL 9540A thermal runaway test obligatorio","DC conductors embebidos requieren metallic raceway (EMT) \u2014 NEC 690.31(G)","AFCI (690.11) + GFCI (690.5) integrados en inversores modernos \u2014 verificar spec","Labeling: AC disconnect, one-line diagram, ESS emergency shutdown, RSD placard"],realTalk:"El inspector no tiene que saber m\xE1s que t\xFA \u2014 tiene que saber C\xD3DIGO. Si llegas sin labeling, sin one-line diagram, con conductor DC en romex detr\xE1s de drywall, te reprueba en 5 minutos y cobra otra inspecci\xF3n de $180. Pasar inspecci\xF3n la primera vez es skill \u2014 no suerte.",checklist:["Calcular Voc m\xE1ximo con factor de temperatura (Table 690.7) \u2014 verificar \u2264600V residencial","Dimensionar conductores a Isc \xD7 1.56 (irradiance \xD7 continuous) \u2014 t\xEDpicamente #10 PV wire","Seleccionar microinversor Enphase IQ8 o SolarEdge optimizers para RSD 690.12","Aplicar 120% rule (705.12) o line-side tap si sistema excede","Confirmar ESS es UL 9540 + UL 9540A listed","Instalar AFCI + GFCI integrados en inverter (no a\xF1adir m\xF3dulo externo si ya est\xE1)","DC conductor embebido en metallic raceway (EMT) \u2014 no romex","Instalar AC PV Disconnect exterior lockable (705.40) accesible a utility","Labels oficiales (Enphase, Tesla, HellermannTyton) \u2014 no Sharpie sobre tape","One-line diagram pegado en interior del panel + copia entregada al cliente"],commonMistakes:["Ignorar Rapid Shutdown \u2014 sistema sin optimizer/micro reprobado al instante post-2017","Exceder 120% rule en panel 200A con PV >40A breaker \u2014 requiere line-side tap","Usar THHN en rooftop en lugar de PV wire \u2014 degradaci\xF3n UV en 3-5 a\xF1os","No calcular Voc con factor temperatura \u2014 string excede 600V en d\xEDa fr\xEDo","Instalar ESS no-UL 9540 \u2014 inspector reprueba + cliente sin seguro en caso de fuego","Conductor DC en romex detr\xE1s de drywall \u2014 violaci\xF3n 690.31(G)","Labeling en Sharpie o tape \u2014 inspector rechaza como no-permanente"]},{id:"business-model-solar",heading:"C\xF3mo Meter Solar a tu Empresa HVAC \u2014 revenue model y la trifecta",body:`
        <p><strong>La trifecta del contratista moderno 2026: HVAC + Solar + Battery + Generador.</strong> Mismo cliente, mismo truck, mismo <em>trust capital</em> que ya construiste cambiando su AC. El cliente que te dio $18K por un AC-install es 4x m\xE1s probable de darte $35K por PV+battery y $14K por standby gen. Ese es el <em>upsell</em> que explica por qu\xE9 las top HVAC companies de California (Service Champions, ARS, Western Heating & AC) ya son solar contractors tambi\xE9n. No es coincidencia \u2014 es estrategia.</p>

        <p><strong>Los 3 caminos para entrar a solar:</strong></p>

        <p><strong>Camino 1: Sub-contract a solar contractor licenciado.</strong> El m\xE1s r\xE1pido, el menos <em>capital-intensive</em>. Firmas un <em>referral + sub-contract agreement</em> con un solar contractor C-46 existente. El flujo:</p>
        <ul>
          <li>T\xFA vendes al cliente HVAC, cierras PV+battery a precio retail del solar contractor + 15-25% markup tuyo.</li>
          <li>Solar contractor hace design, permits, install, interconnect. Tu truck NO va al solar install.</li>
          <li>T\xFA te llevas 15-25% del contrato por <em>referral + sales</em>.</li>
          <li>Tu compa\xF1\xEDa figura en contrato como <em>sales agent</em>, no contractor. Solar C-46 figura como prime contractor.</li>
        </ul>
        <p>M\xE1rgen t\xEDpico: $5,000-$12,000 por referral en sistema $35K-$55K. Riesgo: bajo. Barrera: cero. <em>Donde empezar si nunca has tocado solar</em>.</p>

        <p><strong>Camino 2: Licencia C-46 propia + in-house team.</strong> El m\xE1s rentable a largo plazo. Tu compa\xF1\xEDa saca la C-46 (o expande la C-10 electricista agregando solar). Entrenas o contratas a un <em>solar lead installer</em> + 2 instaladores. Inviertes en herramientas ($8K-$15K: Solar Pathfinder, torque wrenches, fall-protection, MC4 crimper, IR camera, insulation meter).</p>
        <p>Costo inicial: $40K-$80K incluyendo equipment, training, primer truck outfit. Break-even: 8-15 installs. Revenue anual por install crew: $800K-$1.4M con margen neto 18-25%.</p>
        <p>Cu\xE1ndo tiene sentido: cuando ya cerraste 20+ referrals via Camino 1 y validaste el flujo de leads. No empieces in-house sin demand validada.</p>

        <p><strong>Camino 3: Partnership / JV con solar contractor.</strong> H\xEDbrido. Creas una <em>joint venture</em> 50/50 con un solar contractor establecido. T\xFA pones leads + sales, \xE9l pone instalaci\xF3n + licencia. Pool de ganancia compartido.</p>
        <p>Riesgo: mayor que Camino 1 (shared financial exposure), menor que Camino 2 (no equipment investment). T\xEDpico 20-30% de tu net revenue flows to partner. Funciona bien cuando encuentras un solar contractor de confianza, complementario geogr\xE1ficamente.</p>

        <p><strong>C-46 Solar License (CSLB).</strong> La <em>Solar Contractor</em> classification de CSLB \u2014 <em>C-46</em>. Requisitos:</p>
        <ul>
          <li>4+ a\xF1os experiencia verificable en solar installation O licensed solar journeyman</li>
          <li>Pasar examen Law & Business + C-46 Trade Exam</li>
          <li>Bond $25,000 + proof of Workers Comp</li>
          <li>Fees: $330 application + $200 exam + license fee</li>
        </ul>
        <p>Alternativa com\xFAn: <em>C-10 Electrical Contractor</em> puede instalar PV bajo ciertos l\xEDmites (el sistema es "parte del electrical system"). Muchos contractors de HVAC que tienen <em>C-20 HVAC</em> tambi\xE9n sacan <em>C-10 Electrical</em> como secondary para cubrir solar install.</p>
        <p>Si ya tienes C-20 y quieres solar full legal, saca C-46 adicional. CSLB permite m\xFAltiples classifications bajo la misma Corporation/LLC \u2014 solo pagas los exams separados.</p>

        <p><strong>Costo t\xEDpico instalado CA 2026 (PV + battery):</strong></p>
        <ul>
          <li><strong>PV-only (sin battery):</strong> $3.20-$3.80/W. Sistema 8 kW = $25,600-$30,400.</li>
          <li><strong>PV + battery (Powerwall 3 / IQ 10C):</strong> $4.20-$5.00/W equivalent. Sistema 9 kW + 13.5 kWh = $37,800-$45,000.</li>
          <li><strong>Premium (SunPower Maxeon, microinversores Enphase, 2 Powerwalls):</strong> $5.50-$6.50/W. Sistema 10 kW + 27 kWh = $55,000-$65,000.</li>
        </ul>

        <p><strong>Breakdown t\xEDpico sistema 9 kW + Powerwall 3 = $42K cliente:</strong></p>
        <ul>
          <li>Paneles 22 \xD7 410W (REC / Q-Cells): $3,850 (wholesale $0.43/W)</li>
          <li>Microinversores Enphase IQ8M \xD7 22: $4,400 (wholesale $200/unit)</li>
          <li>Tesla Powerwall 3: $9,500 wholesale</li>
          <li>Racking (IronRidge XR Rail / SnapNRack): $1,800</li>
          <li>Balance of system (wire, conduit, breakers, labels, disconnects): $1,200</li>
          <li>Permits + plan check + inspection: $1,100</li>
          <li>Interconnect application + PTO admin: $300</li>
          <li>Design + engineer stamp (if required): $800</li>
          <li>Labor install (3 d\xEDas, 3 personas): $6,500</li>
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

        <p>Labor burden t\xEDpico solar: 28-32% (m\xE1s alto que HVAC por fall-protection insurance, higher WC rate para rooftop work \u2014 code 5552 vs 5538).</p>

        <p><strong>Financing partners que cierran deals.</strong> 75%+ de clientes solar CA financian \u2014 cash-buyer es minor\xEDa. Los <em>lenders</em> dominantes:</p>
        <ul>
          <li><strong>GoodLeap (antes Loanpal):</strong> #1 en residential solar USA 2026. 12-25 a\xF1os, APR 2.99-9.99%. Dealer fee 10-22% (out of loan amount). Fast approval (minutes), online flow.</li>
          <li><strong>Sunnova Easy Plan:</strong> PPA, lease, loan. Dominio en lease/PPA model. Cliente no owns el sistema pero no tiene upfront cost.</li>
          <li><strong>Mosaic:</strong> home improvement loans incluye solar. 15-20 a\xF1os, 3.99-7.99%. Dealer fee 8-18%.</li>
          <li><strong>Sunrun:</strong> lease / PPA model. $0 down, ~20 a\xF1o contract. Cliente paga renta mensual $80-$180. Sunrun owns el sistema. Genera leads pero contrata to contractors.</li>
          <li><strong>Enphase Home Energy Loan:</strong> integrado con Enphase Installer Platform. 15-25 a\xF1os, 4.99-9.99%. Bueno para sistemas Enphase-native.</li>
          <li><strong>Service Finance Company / Synchrony:</strong> HVAC-traditional lenders con producto solar. APR m\xE1s alto (6.99-15%) pero m\xE1s f\xE1cil approval para credit 620-680.</li>
        </ul>

        <p><em>Dealer fee</em> \u2014 el truco que cliente no ve. Si cotizas $42K cash y cliente escoge GoodLeap @ 4.99% APR, el <em>dealer fee</em> del lender puede ser 18% ($7,560). Ese fee se paga de TU <em>gross profit</em>. Si tu margen era $12,550, financiamiento te deja $4,990. Por eso cash-buyers son tan queridos \u2014 el margen se mantiene. Algunos contractors suben el precio financiado (<em>fee absorption</em>) \u2014 cotizan $49K para la versi\xF3n financiada del mismo sistema.</p>

        <p><strong>Referral fees entre contractors.</strong> Cuando pasas un lead HVAC a un solar contractor (Camino 1), estructura est\xE1ndar:</p>
        <ul>
          <li><strong>Referral fee fijo:</strong> $500-$2,000 por sistema vendido. Simple, sin complicar.</li>
          <li><strong>% de contrato:</strong> 5-10% del total signed contract. M\xE1s grande upside si venden $60K.</li>
          <li><strong>Sales partner model:</strong> 15-25% del contrato, pero T\xDA haces el sale meeting, design consult, financing application. Solar contractor solo hace el install.</li>
        </ul>

        <p>Formaliza con <em>Referral Agreement</em> firmado. Incluye: fee structure, payment terms (net 30 t\xEDpico tras PTO), non-compete (no robar al cliente post-venta), responsibility carve-out (ellos warranty el equipment, t\xFA warranty el referral/sale promise).</p>

        <p><strong>Por qu\xE9 HVAC + Solar + Battery es la trifecta ganadora.</strong></p>
        <ul>
          <li><strong>Trust capital:</strong> ya abriste la puerta de la casa. El cliente conf\xEDa. Solar salesmen pasan 2-4 visitas para construir trust \u2014 t\xFA ya lo tienes.</li>
          <li><strong>Same truck, same crew partially:</strong> electrical overlap + rooftop overlap.</li>
          <li><strong>Revenue multiplier:</strong> cliente AC $18K \u2192 + solar $38K \u2192 + battery $13K \u2192 + gen $14K = <strong>$83K total wallet share</strong>. Sin solar + battery + gen, te vas con los $18K y lo dejas.</li>
          <li><strong>Recurrent maintenance:</strong> AC maintenance plan $220/yr + solar performance check $180/yr + generator maintenance $350/yr = <strong>$750/yr recurrent</strong> por hogar. Retention + referral engine.</li>
          <li><strong>Upsell psychol\xF3gico:</strong> cliente que invierte $80K+ en su casa en 2 a\xF1os quiere "el contratista todo-en-uno" \u2014 se vuelve loyal de por vida.</li>
        </ul>

        <p><strong>El \xFAnico motivo para NO entrar a solar:</strong> si tu operaci\xF3n HVAC est\xE1 trending sub-$600K/yr revenue, enf\xF3cate primero en estabilizar HVAC (Bloque 10-12) antes de diversificar. Solar a\xF1ade complejidad t\xE9cnica, regulatoria y operacional. Estabilidad en HVAC primero \u2192 diversificaci\xF3n despu\xE9s.</p>
      `,keyPoints:["Trifecta HVAC + Solar + Battery + Gen: wallet share por cliente salta de $18K a $80K+","Camino 1 (sub-contract): referral 15-25% sin capex \u2014 donde empezar","Camino 2 (C-46 in-house): $40-80K setup, break-even 8-15 installs, net 18-25%","CA 2026 pricing: PV-only $3.20-3.80/W; PV+battery $4.20-5.00/W; premium $5.50-6.50/W","C-46 Solar o C-10 Electrical como secondary a C-20 HVAC \u2014 m\xFAltiples bajo misma entidad","Financing dominado por GoodLeap, Sunnova, Mosaic \u2014 dealer fee 8-22% sale de tu margen","Trust capital del cliente HVAC es el arma #1 vs solar salesmen cold-calling"],realTalk:'El cuate que te dice "yo solo hago AC, no me meto con solar" en 2026 est\xE1 dejando 4x su revenue en la mesa. Solar salesmen ya est\xE1n tocando la puerta de TU cliente. Si no lo vendes t\xFA, te lo quita uno de esos canvassers agresivos \u2014 y de paso pierde confianza en ti cuando le dicen "tu contratista no entiende solar". Mueve fichas.',checklist:["Decidir Camino 1 (sub-contract) vs 2 (C-46 in-house) vs 3 (JV) seg\xFAn revenue actual","Si Camino 1: firmar Referral Agreement con solar contractor local reconocido","Si Camino 2: aplicar C-46 o C-10 secondary en CSLB + ampliar bond","Entrenar sales team en solar basics + NEM 3.0 + ITC/SGIP conversation","Set up financing partners: GoodLeap + Mosaic + Enphase minimum (diversify)","Script de presentaci\xF3n solar integrado al flow HVAC (post-AC close, misma visita)","Pricing matrix interna: PV-only / PV+battery / PV+battery+gen con dealer fee absorbed","Proposal tool: Aurora Solar / OpenSolar / HelioScope para simulation en vivo","Warranty stack documentada: equipment (25yr panels, 10yr Powerwall) + labor (10yr) + performance","Maintenance agreement multi-systema: $750/yr bundle HVAC + Solar + Gen"],commonMistakes:["Entrar a solar sin validar demand \u2014 $80K invertidos, 6 meses sin ventas","Firmar referral agreement sin non-compete \u2014 solar partner te roba al cliente","No absorber dealer fee en cotizaci\xF3n financiada \u2014 margen evaporado post-close","Prometer producci\xF3n al cliente sin simulation seria \u2014 reclamo a los 2 a\xF1os","Usar Camino 1 forever \u2014 nunca construyes capacity propia, siempre dependiente","Cotizar PV-only bajo NEM 3.0 \u2014 cliente con payback 15 a\xF1os te reclama","No entrenar sales team en c\xF3digos NEC b\xE1sicos \u2014 cliente t\xE9cnico pierde confianza"]}],resources:[{label:"CSLB \u2014 California State License Board (C-46 Solar)",url:"https://www.cslb.ca.gov/",type:"link"},{label:"CSLB License Classifications (C-46 / C-10 / C-20)",url:"https://www.cslb.ca.gov/About_Us/Library/Licensing_Classifications/",type:"link"},{label:"CSLB License Lookup",url:"https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/",type:"link"},{label:"California Energy Commission \u2014 SGIP",url:"https://www.energy.ca.gov/programs-and-topics/programs/self-generation-incentive-program",type:"link"},{label:"SGIP Program Administrator (PG&E)",url:"https://www.pge.com/en_US/residential/save-energy-money/savings-solutions-and-rebates/self-generation-incentive-program/self-generation-incentive-program.page",type:"link"},{label:"Go Solar California",url:"https://www.gosolarcalifornia.ca.gov/",type:"link"},{label:"NFPA \u2014 National Electrical Code (NEC)",url:"https://www.nfpa.org/NEC",type:"link"},{label:"DSIRE \u2014 Database of State Incentives for Renewables & Efficiency",url:"https://www.dsireusa.org/",type:"link"},{label:"IRS Form 5695 (Residential Energy Credit / ITC)",url:"https://www.irs.gov/forms-pubs/about-form-5695",type:"link"},{label:"NREL PVWatts Calculator",url:"https://pvwatts.nrel.gov/",type:"software"},{label:"Enphase Installer Platform + IQ Battery Docs",url:"https://enphase.com/installers",type:"manufacturer"},{label:"Tesla Powerwall \u2014 Installer Resources",url:"https://www.tesla.com/support/energy/powerwall",type:"manufacturer"},{label:"FranklinWH aPower 2 \u2014 Installer",url:"https://www.franklinwh.com/",type:"manufacturer"},{label:"SolarEdge Home Battery + Energy Hub",url:"https://www.solaredge.com/us/products/residential/home-battery",type:"manufacturer"},{label:"Generac Guardian Standby \u2014 Installer Zone",url:"https://www.generac.com/for-professionals",type:"manufacturer"},{label:"Kohler Generators \u2014 Dealer Locator + Docs",url:"https://kohlerhomeenergy.com/",type:"manufacturer"},{label:"Cummins QuietConnect Residential",url:"https://www.cummins.com/generators/home-standby",type:"manufacturer"},{label:"Reliance Controls \u2014 Transfer Switches + Interlocks",url:"https://www.reliancecontrols.com/",type:"manufacturer"},{label:"Aurora Solar \u2014 Design + Proposal Software",url:"https://aurorasolar.com/",type:"software"},{label:"OpenSolar \u2014 Design + CRM",url:"https://www.opensolar.com/",type:"software"},{label:"HelioScope \u2014 Commercial Solar Design",url:"https://www.helioscope.com/",type:"software"},{label:"Energy Toolbase \u2014 Financial Analysis NEM 3.0",url:"https://www.energytoolbase.com/",type:"software"},{label:"CED Greentech \u2014 Solar Distributor",url:"https://www.cedgreentech.com/",type:"distributor"},{label:"Soligent \u2014 Solar Distributor",url:"https://www.soligent.net/",type:"distributor"},{label:"Greentech Renewables (Rexel)",url:"https://www.greentechrenewables.com/",type:"distributor"},{label:"GoodLeap \u2014 Solar Financing",url:"https://www.goodleap.com/",type:"financing"},{label:"Mosaic \u2014 Solar Loan",url:"https://joinmosaic.com/",type:"financing"},{label:"Sunnova Easy Plan",url:"https://www.sunnova.com/",type:"financing"},{label:"PG&E Interconnection (PTO) Portal",url:"https://www.pge.com/en_US/residential/solar-and-vehicles/green-energy-incentives/solar-and-renewable-metering-and-billing/solar-and-renewable-metering-and-billing.page",type:"utility"},{label:"SCE Solar + Battery Interconnection",url:"https://www.sce.com/residential/generating-your-own-power",type:"utility"},{label:"SDG&E Net Energy Metering",url:"https://www.sdge.com/more-information/net-energy-metering",type:"utility"},{label:"CA ISO \u2014 Wholesale Electricity Market",url:"https://www.caiso.com/",type:"link"},{label:"PG&E ICA Map (Integration Capacity Analysis)",url:"https://www.pge.com/en_US/for-our-business-partners/distribution-resource-planning/distribution-resource-planning-data-portal.page",type:"utility"},{label:"UL 9540 / UL 9540A ESS Listing Info",url:"https://www.ul.com/services/ul-9540a-test-method",type:"link"},{label:"NABCEP \u2014 Solar Professional Certification",url:"https://www.nabcep.org/",type:"training"},{label:"Solar Energy International (SEI) Training",url:"https://www.solarenergy.org/",type:"training"}],glossary:[{term:"PV (Photovoltaic)",def:"Tecnolog\xEDa que convierte luz solar directamente en electricidad mediante efecto fotoel\xE9ctrico en c\xE9lulas de silicio. PV \u2260 solar thermal (agua caliente)."},{term:"kW vs kWh",def:"kW = potencia instant\xE1nea (cu\xE1nto genera AHORA). kWh = energ\xEDa acumulada (cu\xE1nto gener\xF3 en un per\xEDodo). Sistema 8 kW produce ~12,000 kWh/a\xF1o en So-Cal. La bill de PG&E cobra kWh."},{term:"STC (Standard Test Conditions)",def:"1000 W/m\xB2 irradiancia, 25\xB0C c\xE9lula, masa de aire 1.5. Condiciones de laboratorio. El wattage impreso en el panel (400W) se mide en STC \u2014 raramente ocurre en techo real."},{term:"NOCT (Nominal Operating Cell Temp)",def:"800 W/m\xB2, 20\xB0C ambiente, 1 m/s viento. Condiciones m\xE1s realistas \u2014 panel de 400W STC produce ~295-310W en NOCT. Usa NOCT para cotizar producci\xF3n honesta."},{term:"NEM 3.0 / NBT (Net Billing Tariff)",def:"Esquema actual CA desde 4/15/2023. Exportaci\xF3n a red paga 3-8\xA2/kWh (mediod\xEDa) o 25-65\xA2/kWh (peak). Importaci\xF3n 28-52\xA2/kWh. Obliga bater\xEDa para que PV tenga sentido financiero."},{term:"MPPT (Maximum Power Point Tracking)",def:"Algoritmo del inversor/charge controller que ajusta voltaje/corriente para extraer potencia m\xE1xima del panel bajo condiciones variables. Inversor moderno con MPPT gana 15-30% vs PWM."},{term:"DoD (Depth of Discharge)",def:"Porcentaje de la capacidad nominal de bater\xEDa que se descarga en cada ciclo. Lead-acid t\xEDpico 50% max; LiFePO\u2084 80-90%. Ciclar a DoD alto acorta vida \xFAtil."},{term:"SGIP (Self-Generation Incentive Program)",def:"Incentivo CA para battery storage. General Market $150-200/kWh. Equity Resiliency (zona alto riesgo fuego + income qualified) $850-1000/kWh. Administrado por PG&E/SCE/SoCalGas/CSE."},{term:"ITC (Investment Tax Credit)",def:"Cr\xE9dito fiscal federal 30% del costo total del sistema PV/ESS/labor, vigente hasta 2032. Aplica a battery standalone desde IRA 2022. Requiere tax liability del cliente para ser consumido."},{term:"RSD (Rapid Shutdown)",def:"Requisito NEC 690.12 desde 2017. Todo PV en rooftop debe bajar a \u226430V dentro de 10 seg tras disconnect. Cumplido con microinversores Enphase IQ8 o optimizers SolarEdge/Tigo."},{term:"AC-coupled",def:"Arquitectura donde bater\xEDa tiene inversor propio. PV y bater\xEDa conectan en AC side. Mejor para retrofit a PV existente. Eficiencia round-trip ~92%."},{term:"DC-coupled / Hybrid",def:"Arquitectura donde bater\xEDa y PV comparten inversor. Una sola conversi\xF3n DC\u2192AC. Eficiencia ~96%. Mejor para sistema nuevo. Tesla Powerwall 3, FranklinWH, SolarEdge Home Battery."},{term:"Transfer Switch",def:"Dispositivo que transfiere carga entre utility y generator/battery. Manual (cliente mueve switches) o Automatic (ATS detecta outage). Obligatorio NEC 702 para evitar backfeed."},{term:"Interlock Kit",def:"Placa mec\xE1nica en breaker panel que impide f\xEDsicamente tener main breaker y generator breaker cerrados simult\xE1neamente. $100-300. Alternativa c\xF3digo-compliant m\xE1s barata vs transfer switch."},{term:"Standby Generator",def:"Generador permanente exterior con auto-start via ATS. 8-26kW residencial. NG o LP. Generac Guardian, Kohler, Cummins dominan el mercado. $8K-17K instalado."},{term:"Inverter",def:"Dispositivo que convierte DC (del panel/bater\xEDa) a AC (de la casa). Tipos: string central, microinversores (Enphase), hybrid (con battery integrada). MPPT + grid-tie compliant UL 1741."},{term:"String",def:"Serie de paneles conectados en serie para sumar voltaje. 8 paneles \xD7 40V = 320V. El string completo entra a un inversor central o conecta v\xEDa optimizers."},{term:"ESS (Energy Storage System)",def:"Sistema de almacenamiento de energ\xEDa. Pre-packaged (Powerwall, IQ Battery) o site-built. NEC 706. Requiere UL 9540 system-level + UL 9540A cell-level thermal runaway test."},{term:"PTO (Permission to Operate)",def:"Carta oficial de la utility (PG&E/SCE/SDG&E) autorizando al cliente a energizar el sistema solar. Emitida tras final inspection + meter swap. 8-16 semanas t\xEDpico desde firma de contrato."},{term:"PSH (Peak Sun Hours)",def:"Horas equivalentes a 1000 W/m\xB2 recibidas por d\xEDa en promedio anual. So-Cal 5.5-6.0; Bay Area 5.0-5.4; North Coast 4.0-4.5. Base para sizing de array PV."},{term:"Power Inlet Box",def:"Recept\xE1culo exterior NEMA L14-30 (30A/240V) o L14-50 (50A) donde conecta generator port\xE1til. Requiere instalaci\xF3n c\xF3digo-compliant con conductor a breaker del panel + interlock."},{term:"Critical-Loads Panel",def:"Sub-panel con solo circuitos esenciales (fridge, luces, wifi, 1 AC zone, seguridad) alimentado por ATS/ESS durante outage. Reduce demanda vs whole-home backup."}]};
