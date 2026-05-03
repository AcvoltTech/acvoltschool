// ============================================================
// ACVOLT BUSINESS ACADEMY — BLOQUE 10: PRICING Y VENTAS
// Autor: Mario Flores / ACVOLT
// ============================================================

window.CONTRACTOR_BLOQUE_10 = {
  number: 10,
  title: 'Pricing y Ventas',
  tagline: '¿Estás haciendo dinero o trabajando gratis?',

  intro: `
    <p><strong>Escúchame bien: el 70% de los contratistas latinos en HVAC trabajan con márgenes negativos y ni siquiera lo saben.</strong> Cotizan un cambio de compressor a $1,200 porque "el competidor cobra eso", nunca calculan cuánto les cuesta rodar el truck, y al final del año ven que facturaron $400K pero el banco solo tiene $8K. La diferencia entre un contratista que vive y uno que hace dinero de verdad no es el trabajo — es el <em>pricing</em> y la <em>venta</em>.</p>

    <p>Este bloque te va a doler porque te va a mostrar los números reales. Vas a entender que <strong>markup 40% NO es margen 40%</strong> — es 28.6% y probablemente te quedas en rojo. Vas a ver que un truck cuesta $8-$12 por milla operada, que un truck roll para cambiar un capacitor de $75 es una pérdida garantizada, y que el contratista que cobra $129 de diagnostic fee vende 3x más que el que "va gratis a revisar".</p>

    <p>También vas a aprender el <strong>proceso de venta en 7 pasos</strong> que usan Nexstar, Service Roundtable y las top 100 companies de HVAC en USA. Cómo presentar 3 opciones (good/better/best) para subir el ticket promedio 40%. Cómo manejar las 10 objeciones más comunes con el framework Feel-Felt-Found. Y cómo pagarle a tus técnicos por comisión sin que te roben clientes en side jobs.</p>

    <p><strong>Regla #1:</strong> Nunca cotices sin conocer tu overhead real. Si no sabes cuánto te cuesta abrir la puerta de tu shop cada mañana, estás regalando trabajo.</p>

    <p><strong>Regla #2:</strong> Nunca regales el diagnostic. Waivear el fee te pone en la misma caja del plomero gratis de Craigslist — pierdes autoridad antes de entrar a la casa.</p>

    <p><strong>Regla #3:</strong> Siempre presenta 3 opciones. El cliente NO va a escoger la más barata — va a escoger la del medio. Sube el piso del medio y sube tu ticket promedio.</p>

    <p><strong>Regla #4:</strong> El técnico que vende es más valioso que el técnico que repara. Pagar 8-12% de comisión sobre sold revenue transforma a tu crew de "labor cost" en "revenue generator".</p>

    <p><em>Si terminas Bloque 10 y no puedes recitar tu break-even por hora, tu markup objetivo y tu close rate, no estás listo para abrir un segundo truck. Punto.</em></p>
  `,

  sections: [

    // ========================================================
    // SECCION 1: MARKUP VS MARGIN
    // ========================================================
    {
      id: 'markup-vs-margin',
      heading: 'Markup vs Margin — la matemática que te está desangrando',
      body: `
        <p><strong>Este es el error #1 de contratistas latinos en USA.</strong> Piensan que "markup 40%" y "margin 40%" son la misma cosa. No lo son. Y esa confusión les cuesta $20K-$50K al año en ganancia perdida sin saberlo.</p>

        <p><strong>Definiciones duras:</strong></p>
        <ul>
          <li><strong>Markup:</strong> cuánto <em>le sumas</em> al costo. Fórmula: <em>Markup % = (Precio - Costo) / Costo × 100</em>.</li>
          <li><strong>Margin (gross margin):</strong> qué porcentaje <em>del precio</em> es ganancia. Fórmula: <em>Margin % = (Precio - Costo) / Precio × 100</em>.</li>
        </ul>

        <p><strong>Ejemplo que te va a doler:</strong> compraste un condensador Goodman 3 ton en $2,500. Le pones "40% markup" pensando que vas a ganar 40%. Precio al cliente: $2,500 × 1.40 = <strong>$3,500</strong>. Ganancia bruta: $1,000. Margin real: $1,000 / $3,500 = <strong>28.6%</strong>. Ya perdiste 11.4 puntos respecto a lo que creías ganar.</p>

        <p><strong>Tabla de conversión que debes memorizar:</strong></p>
        <ul>
          <li>Markup 20% = Margin 16.7%</li>
          <li>Markup 30% = Margin 23.1%</li>
          <li>Markup 40% = Margin 28.6%</li>
          <li>Markup 50% = Margin 33.3%</li>
          <li>Markup 67% = Margin 40%</li>
          <li>Markup 100% = Margin 50%</li>
          <li>Markup 150% = Margin 60%</li>
          <li>Markup 233% = Margin 70%</li>
        </ul>

        <p><strong>¿Cuál es el target real?</strong> En HVAC residencial establecido, el benchmark de Service Nation / Nexstar / BDR es:</p>
        <ul>
          <li><strong>Gross margin 50-55%</strong> sobre service calls y repairs (markup 100-122%).</li>
          <li><strong>Gross margin 35-45%</strong> sobre installs de equipo (markup 54-82%).</li>
          <li><strong>Net profit 10-15%</strong> después de payroll, overhead, marketing, seguros, etc.</li>
        </ul>

        <p><strong>Fórmula del precio de venta a partir de margin objetivo:</strong></p>
        <p><em>Precio = Costo / (1 - Margin %)</em></p>
        <p>Ejemplo: quieres 45% margin en un install. Costo total (equipo + labor + materials) = $6,200. Precio = $6,200 / (1 - 0.45) = $6,200 / 0.55 = <strong>$11,273</strong>. Si cotizas $8,500, tu margin real es 27% y ya estás en zona de pérdida después de overhead.</p>

        <p><strong>Overhead — el asesino silencioso.</strong> Gross margin NO es net profit. De ese 45% gross, restas: rent, utilities, seguros (GL + workers comp + auto), gas del truck, teléfono, software (ServiceTitan $400/mes, QuickBooks $90/mes), marketing, accountant, licencias, CSLB bond, payroll taxes, training. Un contratista de 3 empleados típicamente tiene <strong>25-32% de overhead rate</strong>. Entonces: 45% gross - 30% overhead = <strong>15% net profit</strong>. Si tu gross es 35%, tu net es 5% — y con un callback te vas a cero.</p>

        <p><strong>Break-even por hora facturable.</strong> Fórmula simple: suma todos tus costos fijos mensuales (rent + seguros + software + salary del owner + depreciación del truck). Divide entre horas facturables reales (no worked — facturables, que típicamente son 55-65% de horas trabajadas). Un contratista solo con truck + $8K gastos fijos / 110 horas facturables al mes = <strong>$73/hora de break-even puro</strong>. Por eso un capacitor replacement a $85 te mata — no alcanza ni a pagar la hora del técnico.</p>

        <p><strong>Labor rate vs billing rate.</strong> Le pagas $32/hora a tu lead technician. Su labor burden (payroll tax 8%, workers comp 6%, insurance 3%, benefits 10%) suma 27% = <strong>$40.64 costo real</strong>. Para ganar 50% margin en labor necesitas billearlo a <em>$40.64 / 0.50 = $81.28/hora</em> mínimo. La mayoría factura $85-$125/hora residencial — pero si le sumas el overhead ya descrito, el billing rate sano está en <strong>$135-$185/hora</strong> en mercados establecidos.</p>

        <p>Si no haces esta matemática mensualmente con tu P&L en la mano, estás manejando a ciegas. QuickBooks Online + un bookkeeper part-time ($300/mes) te salva la vida.</p>
      `,
      keyPoints: [
        'Markup 40% NO es margin 40% — es margin 28.6%; memoriza la tabla de conversión',
        'Gross margin target HVAC: 50-55% en service/repair, 35-45% en install',
        'Net profit sano: 10-15% después de overhead (típicamente 25-32%)',
        'Fórmula precio: Costo / (1 - Margin objetivo) — NO Costo × (1 + Markup)',
        'Labor burden real: +25-30% sobre el wage nominal (payroll tax, WC, insurance, benefits)',
        'Billing rate sano en mercados establecidos: $135-$185/hora residencial, no $85',
        'Sin QuickBooks + P&L mensual estás manejando a ciegas — contrata bookkeeper'
      ],
      realTalk: 'El cuate que te dice "yo cobro 30% markup y me va bien" está trabajando gratis y no lo sabe. Sus trucks se están pagando con la tarjeta de crédito. En 3 años va a cerrar el negocio y a volver de empleado. No seas ese cuate.',
      checklist: [
        'Calcular overhead rate mensual (fixed costs / revenue objetivo) — actualizar cada trimestre',
        'Establecer billing rate mínimo por servicio basado en margin 50% + overhead',
        'Memorizar tabla markup-to-margin (20/30/40/50/67/100) para cotizar en campo',
        'Usar fórmula Precio = Costo / (1 - Margin) en TODAS las cotizaciones',
        'Revisar P&L mensual con bookkeeper — no "al final del año"',
        'Calcular labor burden real de cada técnico (wage × 1.27 mínimo)',
        'Separar cuentas: operating account, tax savings (25% del net), owner pay',
        'Establecer break-even hora facturable y nunca vender debajo',
        'Trackear close rate, average ticket, gross margin por tipo de job mensualmente',
        'Pricebook actualizado mínimo 2x al año con nuevos costos de equipo'
      ],
      commonMistakes: [
        'Usar markup como si fuera margin — cobrar 40% menos de lo que crees',
        'No incluir labor burden — subestimar costo del técnico en 25-30%',
        'Olvidar overhead al cotizar — gross se ve bonito, net es cero',
        'Cotizar "como el competidor" sin conocer los números propios — sigues a un ahogado',
        'No actualizar pricebook cuando sube el costo del equipo — margen desaparece en 6 meses',
        'Trabajar sin bookkeeper — P&L hecho "de memoria" siempre miente a favor',
        'No separar cuenta de impuestos — al IRS debes 25-30% y gastas ese dinero'
      ]
    },

    // ========================================================
    // SECCION 2: FLAT RATE BOOKS
    // ========================================================
    {
      id: 'flat-rate-books',
      heading: 'Flat Rate Pricing — pricebooks, options, y por qué T&M te está matando',
      body: `
        <p><strong>Tiempo y materiales (T&M) es el modelo viejo que todavía usan el 60% de contratistas latinos.</strong> "Te cobro $95 la hora más piezas". Suena justo. Es un desastre. El cliente pelea cada minuto, tu técnico trabaja lento porque cobra por hora, y tu gross margin nunca supera 30%. Flat rate pricing — precio fijo por tarea — es el estándar de la industria desde hace 25 años por una razón: <em>gana más, cierra más, y elimina discusiones</em>.</p>

        <p><strong>Cómo funciona el flat rate.</strong> En lugar de cobrar "$95/hora + piezas", cobras una tarifa fija por cada tarea: "Reemplazo de capacitor dual 45/5 mfd = $289 instalado". Incluye el diagnostic, la pieza, labor, y warranty. El cliente firma ANTES de que empieces. No hay sorpresas. Tu técnico está motivado a hacerlo rápido y bien — si tarda 45 minutos en lugar de 1.5 horas, tu margin sube (y si tienes comisión, él también gana).</p>

        <p><strong>Las bibliotecas de pricing (pricebooks) comerciales:</strong></p>
        <ul>
          <li><strong>ServiceTitan Pricebook Pro ($2,500-$5,000/año):</strong> la biblia del industrio. 15,000+ tasks residencial + comercial. Actualizaciones de precio automáticas por mercado. Se integra con ServiceTitan CRM. Si facturas $1M+, es no-brainer.</li>
          <li><strong>Profit Rhino ($99-$299/mes):</strong> app independiente. iPad-friendly. Pricing por ZIP code. Imágenes en cada task. Ideal para contratistas 1-10 trucks.</li>
          <li><strong>Callahan Roach ($1,500-$3,000 one-time + updates):</strong> clásico. Libro impreso + digital. Muchos viejos de la industria juran por él.</li>
          <li><strong>The New Flat Rate ($1,200-$2,500/año):</strong> enfoque en options presentation (good/better/best). Más caro pero sube ticket promedio 40%.</li>
          <li><strong>Coolfront ($89/mes):</strong> opción económica. Menos profundo pero buena entrada para contratistas pequeños.</li>
        </ul>

        <p><strong>Pros vs T&M:</strong></p>
        <ul>
          <li><strong>Close rate:</strong> flat rate sube close rate 15-25% vs T&M. El cliente firma un número fijo, no un "depende".</li>
          <li><strong>Gross margin:</strong> sube de 25-30% (T&M típico) a 45-55% (flat rate con pricebook correcto).</li>
          <li><strong>Productividad técnico:</strong> sube 20-30% porque el técnico quiere terminar rápido (gana igual).</li>
          <li><strong>Disputas:</strong> caen 80%. El cliente firmó el número antes.</li>
          <li><strong>Profesionalismo:</strong> entregar un iPad con opciones, fotos y precios te hace ver como compañía de $10M, no como handyman.</li>
        </ul>

        <p><strong>Contras de flat rate (que debes manejar):</strong></p>
        <ul>
          <li><strong>Inversión inicial:</strong> $100-$400/mes de subscripción + 20-40 horas de configuración por mercado.</li>
          <li><strong>Training del equipo:</strong> tus técnicos necesitan aprender a presentar opciones, no solo a reparar.</li>
          <li><strong>Shock de precio:</strong> el primer cliente al que le digas "$389 por cambio de capacitor" te va a decir "en YouTube cuesta $15". Tienes que manejar esa conversación con confianza.</li>
        </ul>

        <p><strong>Presentación de 3 opciones (good/better/best) — el multiplicador #1 de ticket.</strong> Regla de oro: <em>siempre presenta 3 opciones, nunca una, nunca dos, nunca cuatro</em>. La psicología del consumidor dice que:</p>
        <ul>
          <li>El <strong>15%</strong> escoge la barata (good).</li>
          <li>El <strong>65%</strong> escoge la del medio (better). <em>Aquí está tu ticket promedio</em>.</li>
          <li>El <strong>20%</strong> escoge la premium (best) — especialmente si la presentas con confianza.</li>
        </ul>

        <p><strong>Ejemplo concreto para cambio de blower motor:</strong></p>
        <ul>
          <li><strong>Good ($589):</strong> OEM generic motor, warranty 1 año, labor estándar.</li>
          <li><strong>Better ($789):</strong> Genteq/US Motors OEM, warranty 3 años, labor con balanceo + capacitor nuevo incluido.</li>
          <li><strong>Best ($1,189):</strong> ECM variable speed upgrade, warranty 5 años, incluye blower wheel cleaning + static pressure test + 1 tune-up.</li>
        </ul>

        <p>Si solo ofreces "el motor cuesta $650", el cliente pelea por $50. Si ofreces 3 opciones, el cliente NO pelea el precio — decide entre opciones. Cambiaste la conversación.</p>

        <p><strong>Comisiones por flat rate.</strong> El técnico que vende en flat rate típicamente gana <strong>8-12% de sold revenue</strong> sobre servicios y repairs, <strong>3-5% sobre installs</strong>. En un día bueno, un senior tech vende $3,500 de repairs y gana $280-$420 de comisión encima de su wage base. Eso lo retiene. Sin comisión, tu mejor técnico se va al competidor que sí paga, y te deja con los juniors.</p>
      `,
      keyPoints: [
        'Flat rate sube gross margin de 25-30% (T&M) a 45-55% — es el estándar de la industria',
        'ServiceTitan Pricebook Pro / Profit Rhino / Callahan Roach / The New Flat Rate son las bibliotecas serias',
        'Presentar 3 opciones (good/better/best) sube ticket promedio 40% — NUNCA 1 o 2',
        'Distribución típica: 15% good, 65% better, 20% best — sube el piso del "better"',
        'Close rate flat rate 15-25% mayor que T&M; disputas caen 80%',
        'Comisión técnico 8-12% sold revenue en repairs retiene al senior tech',
        'Inversión: $100-$400/mes de pricebook + 20-40 horas de setup inicial'
      ],
      realTalk: 'Si todavía cotizas "$95 la hora más piezas", estás compitiendo contra Craigslist. El cuate con iPad y 3 opciones firmadas te gana el job cada vez, aunque cobre 40% más. El cliente no compra precio — compra confianza. Y nada da más confianza que un iPad con fotos y opciones.',
      checklist: [
        'Escoger pricebook (ServiceTitan / Profit Rhino / Callahan Roach / The New Flat Rate / Coolfront)',
        'Configurar pricing por ZIP code con costos reales de equipo + labor burden + 50% margin',
        'Cargar pricebook en iPad de cada técnico (Profit Rhino funciona offline)',
        'Entrenar técnicos en presentación 3-opciones — role-play mínimo 10 veces',
        'Script memorizado para objeción "en YouTube cuesta menos"',
        'Firmar autorización ANTES de cualquier trabajo (digital signature en iPad)',
        'Warranty claramente impreso en cada opción — 1/3/5 años según tier',
        'Revisar pricebook trimestralmente con costos actualizados de supplier',
        'Trackear close rate y average ticket por técnico semanalmente',
        'Actualizar comisión de técnicos a % de sold revenue — NO de completed jobs'
      ],
      commonMistakes: [
        'Seguir con T&M "porque así he trabajado siempre" — pierdes 20 puntos de margin',
        'Ofrecer solo 1 opción — cliente pelea el precio en lugar de elegir',
        'Ofrecer 4+ opciones — cliente se paraliza y dice "déjame pensar"',
        'No entrenar al técnico en presentación — le entregas el iPad y no sabe usarlo',
        'Configurar pricebook con margin 30% "para ser competitivo" — quiebras en 18 meses',
        'No incluir warranty en las opciones — pierdes el diferenciador del tier premium',
        'No actualizar pricing cuando sube el equipo — tu "better" ya es "breakeven"'
      ]
    },

    // ========================================================
    // SECCION 3: DIAGNOSTIC FEE
    // ========================================================
    {
      id: 'diagnostic-fee',
      heading: 'Diagnostic Fee — nunca regales el diagnóstico',
      body: `
        <p><strong>El diagnostic fee (service call fee) es la prueba de fuego del contratista serio.</strong> Los que cobran $89-$159 por llegar a la casa son profesionales. Los que "van gratis a revisar" son handymen compitiendo con Craigslist y OfferUp. No hay zona gris. Cuál eres tú depende 100% de esta decisión.</p>

        <p><strong>Tarifas típicas en USA 2024-2026:</strong></p>
        <ul>
          <li><strong>Mercados rurales / Midwest:</strong> $69-$95 diagnostic fee estándar.</li>
          <li><strong>Mercados suburbanos / Southeast:</strong> $89-$119 estándar, $129-$149 after-hours.</li>
          <li><strong>Metros tier 2 (Houston, Phoenix, Dallas):</strong> $99-$139 estándar, $189-$249 after-hours.</li>
          <li><strong>Metros tier 1 (LA, SF, NY, Miami, Seattle):</strong> $129-$199 estándar, $249-$399 after-hours / weekends.</li>
          <li><strong>Premium / luxury market:</strong> $199-$299 con garantía de "diagnóstico experto".</li>
        </ul>

        <p><strong>¿Por qué waivear el fee "si haces la reparación" te sabotea?</strong></p>
        <ul>
          <li><strong>Comunica que el diagnóstico NO vale nada</strong> — solo las piezas. El cliente aprende que el conocimiento es gratis. Después pelea el precio de la reparación.</li>
          <li><strong>Invita a shoppers</strong> — gente que llama a 5 contratistas para diagnósticos gratis, compara notas, y contrata al más barato. Tú trabajaste, el otro cerró.</li>
          <li><strong>Baja tu close rate</strong> — contraintuitivo pero real. Cuando el cliente ya pagó $129, tiene "skin in the game" y es 40% más probable que apruebe la reparación contigo (sunk cost bias).</li>
          <li><strong>Mata tu promedio por truck roll</strong> — si ruedas por $0 y el cliente no aprueba, perdiste $200+ en costo de truck + labor + opportunity.</li>
        </ul>

        <p><strong>El script correcto (memorízalo):</strong></p>
        <p><em>"Nuestra tarifa de diagnóstico técnico es $129. Esto incluye hasta una hora de diagnóstico profesional por un técnico certificado con equipo de prueba — medición de presiones, superheat/subcool, amperajes, static pressure y componentes eléctricos. Al final, recibe un reporte por escrito con el estado del sistema y opciones de reparación con precio fijo. Este fee NO se waivea — representa el valor del diagnóstico, que es un servicio aparte de la reparación. Si decide proceder con la reparación hoy mismo, tenemos descuento de membership plan. ¿Confirmamos la visita para hoy a las 3pm o mañana a las 10am?"</em></p>

        <p><strong>Waivers aceptables (con estrategia):</strong></p>
        <ul>
          <li><strong>Membership plan members ($15-25/mes):</strong> diagnostic waived como benefit. Esto SÍ funciona — están pre-pagando anualmente.</li>
          <li><strong>Estimate de install (equipo nuevo):</strong> quote de reemplazo completo de sistema puede ser gratis — es presale, no diagnóstico de falla.</li>
          <li><strong>Second opinion formal:</strong> algunos contratistas cobran 50% (e.g. $64) para second opinion competitiva.</li>
          <li><strong>Warranty calls dentro del período:</strong> obviamente gratis si es callback tuyo dentro de warranty.</li>
        </ul>

        <p><strong>Objeción clásica: "Pero mi competidor va gratis".</strong> Respuesta:</p>
        <p><em>"Entiendo. La diferencia es que nosotros usamos equipo de diagnóstico calibrado — manifold digital Fieldpiece, amp clamp, hygrómetro, manómetro de static pressure — y le entregamos un reporte escrito con fotos. El técnico que va gratis está apurado por venderle la reparación, porque no le pagan por ir. Nosotros le pagamos al técnico por diagnosticar bien. Preferimos tener razón sobre la falla que acertar por suerte."</em></p>

        <p>Si el cliente insiste en "gratis", <strong>déjelo ir</strong>. No es tu cliente. Está buscando el más barato, no el mejor. Va a ser la pesadilla que genera 2 callbacks y 1 review negativa por $0 de ganancia.</p>

        <p><strong>Tracking del diagnostic fee.</strong> Métricas que debes medir mensualmente:</p>
        <ul>
          <li><strong>Diagnostic-to-close conversion:</strong> % de diagnostics que se convierten en reparación. Target: 75-85%.</li>
          <li><strong>Average ticket after diagnostic:</strong> incluye diagnostic fee + reparación. Benchmark: $450-$750 residencial promedio.</li>
          <li><strong>Diagnostic-only count:</strong> diagnósticos que NO convirtieron. Si es >25%, hay problema en presentación de opciones.</li>
          <li><strong>Diagnostic fee collected rate:</strong> % de veces que efectivamente cobraste. Debe ser 100%. Si el técnico "olvida" cobrar, es problema de comisión/training.</li>
        </ul>

        <p><strong>After-hours pricing.</strong> Si vas después de 6pm, sábado, domingo o feriado: <strong>1.5x-2x el fee normal</strong>. Cliente llama el domingo a las 8pm porque "no enfría": $249 fee (no waiveable), más reparación a precio after-hours. Si el cliente no acepta, mañana lunes a precio normal. Tú decides si trabajas 24/7 o no — pero si lo haces, cóbralo.</p>
      `,
      keyPoints: [
        'Diagnostic fee estándar 2026: $89-$159 regular, $189-$399 after-hours según mercado',
        'NUNCA waivear el fee "si haces la reparación" — baja autoridad y sube shopping',
        'Script obligatorio: "$129 incluye 1 hora de diagnóstico técnico certificado"',
        'Waivers aceptables: membership members, installs nuevos, warranty callbacks',
        'Diagnostic-to-close conversion target: 75-85%; si está bajo, hay problema de ventas',
        'After-hours: 1.5x-2x el fee normal — domingo a las 8pm = $249 mínimo',
        'Cliente que insiste en "gratis" no es tu cliente — déjalo ir al competidor'
      ],
      realTalk: 'El contratista que cobra $129 de fee facturó $480K el año pasado. El cuate que "va gratis a revisar" facturó $190K y quebró en marzo. No es coincidencia — es que el cliente que paga $129 ya decidió contratar antes de que llegues. El gratis todavía está comparando 4 cotizaciones.',
      checklist: [
        'Fijar diagnostic fee según mercado (mínimo $89 rural, $129 suburbano, $159+ metro)',
        'Script de cobro memorizado por cada técnico + dispatcher',
        'Cobrar el fee ANTES de bajar del truck (signed authorization)',
        'After-hours rate 1.5x-2x configurado en pricebook + anunciado al agendar',
        'Reporte escrito entregado al cliente al terminar diagnóstico (impreso o PDF por email)',
        'Descuento de membership plan comunicado como incentivo para upgrade',
        'Warranty policy escrita: diagnostic gratis en callbacks dentro de warranty',
        'Trackear diagnostic-to-close conversion mensual por técnico',
        'Equipo de diagnóstico calibrado en cada truck (Fieldpiece manifold, clamp, manómetro)',
        'Política escrita de NO waiver excepto casos documentados'
      ],
      commonMistakes: [
        'Waivear diagnostic "para cerrar la venta" — comunicas que tu conocimiento no vale',
        'No cobrar el fee al llegar — técnico "olvida" y cliente lo usa de excusa al final',
        'Fee muy bajo ($39-$59) — te posiciona como handyman, no como contratista',
        'No cobrar after-hours extra — regalas domingo noche a precio de martes 10am',
        'Escribir "diagnostic free with repair" en el ad — atraes shoppers, no clientes',
        'No entregar reporte escrito — el cliente no percibe el valor del diagnóstico',
        'Pelear con cliente que insiste en gratis — pierdes tiempo y energía por cliente que no es tuyo'
      ]
    },

    // ========================================================
    // SECCION 4: TRUCK ROLL MATH
    // ========================================================
    {
      id: 'truck-roll-math',
      heading: 'Truck Roll Math — cuánto cuesta de verdad rodar el truck',
      body: `
        <p><strong>La mayoría de contratistas latinos no tiene idea de cuánto cuesta mover el truck.</strong> Piensan: "gasolina $30, ya". Están ignorando $200-$400 de costos reales que tragan su ganancia en cada visita. Este es el cálculo que el ingeniero financiero de cualquier HVAC grande te mostraría — y que te va a enseñar por qué un service call de $75 NO es rentable.</p>

        <p><strong>Los 7 costos de un truck roll (por hora de operación):</strong></p>
        <ul>
          <li><strong>1. Combustible:</strong> truck de trabajo F-250/Ram 2500 rinde 12-15 mpg. A $4.00/galón: <em>$0.27-$0.33 por milla</em>.</li>
          <li><strong>2. Depreciación:</strong> truck $55K amortizado en 7 años / 150K millas: <em>$0.37/milla</em>.</li>
          <li><strong>3. Mantenimiento (oil, frenos, llantas, reparaciones):</strong> promedio <em>$0.18-$0.22/milla</em>.</li>
          <li><strong>4. Seguro comercial auto:</strong> $2,400-$4,200/año por truck. Con 15K millas/año: <em>$0.16-$0.28/milla</em>.</li>
          <li><strong>5. Registration, DOT (si >10K lbs), inspecciones:</strong> <em>$0.04-$0.08/milla</em>.</li>
          <li><strong>6. Labor del técnico en ruta:</strong> si tarda 30 min entre jobs, son $20-$40 de labor productiva perdida.</li>
          <li><strong>7. Inventory de repuestos cargado:</strong> $8K-$15K de stock que "vive" en el truck. Costo de capital ~8-12% anual = <em>$0.05-$0.10/milla</em>.</li>
        </ul>

        <p><strong>Costo total por milla operada: $8-$12 en promedio para un truck HVAC residencial cargado.</strong> Incluye todo arriba. Esto NO es teoría — es la cifra que BDR, Nexstar y Service Roundtable publican en sus benchmarks anuales.</p>

        <p><strong>Costo fully-loaded por día por truck: $250-$400.</strong> Esto asume 8 horas de operación, 50-80 millas rodadas, técnico con su labor burden, truck + inventory. Si tu truck no factura mínimo $800-$1,200 en el día (para un gross margin objetivo 50%), ese truck está en pérdida.</p>

        <p><strong>Fórmula mínima de precio por job (para no trabajar gratis):</strong></p>
        <p><em>Precio mínimo = (Truck cost/hora × horas totales) + (Labor técnico burden × horas) + Costo de partes + Overhead allocated + Target gross margin</em></p>

        <p><strong>Ejemplo real: reemplazo de capacitor dual 45/5 mfd.</strong></p>
        <ul>
          <li>Tiempo total (drive time + diagnóstico + reemplazo + cleanup): 1.25 horas.</li>
          <li>Truck cost/hora operada (10 millas redondas a $10/milla): $100.</li>
          <li>Labor técnico + burden: $40.64 × 1.25 = $50.80.</li>
          <li>Costo del capacitor OEM: $14.</li>
          <li>Overhead allocated (30% del labor + truck): $45.24.</li>
          <li>Costo total: <strong>$210.04</strong>.</li>
          <li>Para 50% gross margin: precio = $210.04 / 0.50 = <strong>$420</strong>.</li>
          <li>Típico pricebook flat rate: <strong>$289-$389</strong>.</li>
        </ul>

        <p><strong>Conclusión: un "$75 capacitor replacement" NO es barato — es una pérdida garantizada de $135.</strong> Por eso el handyman de Craigslist que cobra $75 eventualmente desaparece. No puede durar. Tú no quieres competir ahí.</p>

        <p><strong>Mínimo de dispatch (call-out minimum).</strong> Muchos contratistas serios establecen un <strong>"minimum job price" de $249-$399</strong>. Si ruedas el truck, el mínimo es ese, punto. No hay "solo un capacitor $89". Si el cliente pelea, le explicas: "nuestro mínimo de dispatch incluye truck roll, diagnóstico certificado, labor hasta 1 hora, hasta $50 de partes. Si el job es más grande, cobramos por encima". Esto elimina el 40% de llamadas basura y concentra el schedule en jobs que sí son rentables.</p>

        <p><strong>Route optimization.</strong> Por cada 10 millas que le ahorras al truck por día, ganas $80-$120 de margin. Herramientas:</p>
        <ul>
          <li><strong>ServiceTitan Dispatch Pro:</strong> optimiza rutas con AI. Enterprise.</li>
          <li><strong>Housecall Pro / Jobber routing:</strong> básico pero funcional para 1-5 trucks.</li>
          <li><strong>Route4Me ($39-$79/mes):</strong> standalone, integra con cualquier CRM.</li>
          <li><strong>OptimoRoute ($35-$79/truck/mes):</strong> muy usado en HVAC mid-market.</li>
          <li><strong>Clustering geográfico:</strong> asigna ZIPs específicos a cada truck — reduce crisscrossing.</li>
        </ul>

        <p><strong>Idle time es dinero perdido.</strong> Un técnico parado en el shop 30 min esperando el next job = $20-$40 de costo. Si tienes 3 técnicos con 1 hora de idle/día promedio = $180-$360/día = <strong>$45K-$90K/año en payroll muerto</strong>. Dispatch tight + route optimization + membership plans (que pre-agendan visitas) eliminan el idle.</p>

        <p><strong>Fuel costs management.</strong> En 2022-2023 el combustible subió 40%. Muchos contratistas no ajustaron pricing y comieron la pérdida. Regla: <em>revisa precios cada vez que el combustible se mueva ±15%</em>. Algunos contratistas añaden "fuel surcharge" de $9-$19 por job cuando el combustible está alto — es común y aceptado en muchos mercados.</p>
      `,
      keyPoints: [
        'Truck roll real cuesta $8-$12 por milla operada (no "gasolina y ya")',
        'Truck fully-loaded por día: $250-$400 — debe facturar $800-$1,200 para ser rentable',
        'Capacitor a $75 = pérdida de $135 garantizada; el flat rate mínimo es $289-$389',
        'Minimum job price $249-$399 elimina llamadas basura y protege el schedule',
        'Route optimization ahorra 10-20% de millas = $80-$120/día de margin por truck',
        'Idle time 1 hora/técnico/día = $45K-$90K/año en payroll muerto',
        'Fuel surcharge $9-$19/job es aceptado cuando combustible sube ±15%'
      ],
      realTalk: 'Cuando tu vecino contratista te dice "yo cobro $75 el capacitor para agarrar clientela", le estás viendo la tumba en slow motion. Ese hombre está pagando $135 de su bolsillo cada vez. En 2 años cierra. No imites perdedores solo porque gritan más fuerte.',
      checklist: [
        'Calcular costo real por milla de cada truck (fuel + depreciation + maintenance + insurance)',
        'Establecer minimum job price ($249-$399 según mercado) y aplicar sin excepciones',
        'Implementar route optimization (OptimoRoute / Route4Me / CRM nativo)',
        'Trackear millas por día por truck y optimizar clustering ZIP',
        'Ajustar pricing cada vez que combustible suba ±15%',
        'Fuel surcharge opcional $9-$19/job durante picos de combustible',
        'Medir idle time por técnico semanalmente — target <15 min/día',
        'Pre-agendar visitas de membership members en ventanas específicas',
        'Monitorear cost-per-mile actual vs target mensualmente',
        'Dispatch tight: técnico sale del job anterior con el próximo ya asignado'
      ],
      commonMistakes: [
        'Solo contar gasolina al calcular costo del truck — ignoras 7 categorías más',
        'Aceptar jobs de $75-$150 "para mantener al técnico ocupado" — pierdes dinero',
        'No tener minimum job price — cliente llama por tornillo y tu truck rueda 20 millas',
        'Rutas ineficientes (Zip 1 → Zip 5 → Zip 2 → Zip 4) — doble de millas',
        'No ajustar precios cuando combustible sube — cada galón es margin perdido',
        'Idle time tolerado "porque el técnico tiene su hora de almuerzo" — $40K/año',
        'No medir cost-per-mile — decisiones ciegas sobre trucks, rutas, pricing'
      ]
    },

    // ========================================================
    // SECCION 5: SALES PROCESS 7 STEPS
    // ========================================================
    {
      id: 'sales-process-7-steps',
      heading: 'El Proceso de Venta en 7 Pasos — vender sin ser vendedor',
      body: `
        <p><strong>El mejor técnico vendedor NO es el que "presiona" al cliente.</strong> Es el que ejecuta un proceso disciplinado de 7 pasos que convierte al homeowner nervioso en un cliente firmado y contento. Este proceso es lo que enseñan Nexstar, Service Nation, EGIA y BDR — las top training companies de HVAC residencial en USA.</p>

        <p>Tiempo total típico en la casa: <strong>60-90 minutos</strong> para un install sale, 30-45 minutos para repair sale. Distribución aproximada abajo. Si acabas en 20 minutos, no vendiste — cotizaste. Hay diferencia.</p>

        <p><strong>Paso 1 — Greet / Saludo inicial (3-5 minutos)</strong></p>
        <ul>
          <li>Llega 5 minutos temprano, nunca tarde. Texto al cliente "en camino" con tiempo exacto de llegada.</li>
          <li>Uniforme limpio, camisa metida, botas presentables. Badge con foto visible.</li>
          <li>Saluda por nombre: "Hola Sr. García, soy Mario de ACVOLT, ¿tiene los 5 minutos para que nos presentemos?"</li>
          <li>Ofrece tu business card con 2 manos. Pide permiso de entrar ("¿podemos pasar?").</li>
          <li>Shoe covers (booties) obligatorios — incluso si el cliente dice "no hace falta". Es un tell de profesionalismo.</li>
          <li>Small talk genuino de 60 segundos — ¿cuánto tiempo llevan en la casa? ¿equipo actual funciona o no? Construye rapport.</li>
        </ul>

        <p><strong>Paso 2 — Discovery / Descubrimiento (10-15 minutos)</strong></p>
        <ul>
          <li>Este paso lo skipean el 80% de técnicos latinos — y es DONDE SE GANA LA VENTA.</li>
          <li>Preguntas abiertas: "¿qué los trajo a llamarnos hoy?" "¿qué problemas han tenido con el sistema actual?" "¿cuáles cuartos son más incómodos?" "¿qué les gustaría diferente de lo que tienen?"</li>
          <li>Preguntas de futuro: "¿cuánto tiempo planean quedarse en esta casa?" "¿tienen niños / alguien con alergias / alguien trabajando desde casa?"</li>
          <li>Preguntas financieras suaves: "¿tienen presupuesto establecido o están abiertos a opciones?" "¿prefieren pagar al contado o financiar?"</li>
          <li>Anota TODO en tu tablet/iPad. El cliente nota que escribes sus preferencias — se siente escuchado.</li>
          <li>Espejo (mirror back): "entonces lo más importante para ustedes es [repite sus palabras], ¿correcto?"</li>
        </ul>

        <p><strong>Paso 3 — Inspect / Inspección técnica (15-25 minutos)</strong></p>
        <ul>
          <li>Aquí es donde ganas autoridad. Muestra que sabes lo que haces.</li>
          <li>Mide static pressure del sistema (Fieldpiece SDMN6). Explica que el 70% de sistemas operan fuera de spec.</li>
          <li>Check superheat/subcool en el condensador. Toma fotos.</li>
          <li>Inspecciona ductos, returns, filtros, thermostat, condición del equipo.</li>
          <li>Toma fotos de TODO lo que encuentres — corrosión, leaks, fallas eléctricas, ductos rotos.</li>
          <li>Haz load calc rápido (Cool Calc app) si es install quote.</li>
          <li>Regresa al cliente con tablet: "permitanme mostrarles lo que encontré" — enseñas fotos + mediciones.</li>
          <li>Traduce jargon técnico a lenguaje de cliente: "el static pressure de su sistema está a 1.1, el máximo es 0.5. Eso significa que el blower está trabajando el doble y la vida útil del sistema se reduce 50%".</li>
        </ul>

        <p><strong>Paso 4 — Educate / Educación (10-15 minutos)</strong></p>
        <ul>
          <li>No vendas. Educa. El cliente que entiende compra.</li>
          <li>Explica las 3-5 causas del problema que encontraste.</li>
          <li>Muestra el impacto: cuánto les está costando en bills, en reparaciones, en confort.</li>
          <li>Usa analogías del mundo real: "un sistema con static pressure alto es como correr una milla con una mochila de 50 libras — puedes, pero te mata".</li>
          <li>Muestra 1-2 videos cortos (2-3 min) en tu tablet — YouTube HVAC School de Bryan Orr tiene perfectos.</li>
          <li>Pregunta: "¿tiene sentido lo que les explico?" antes de seguir.</li>
        </ul>

        <p><strong>Paso 5 — Present Options / Presentar Opciones (10-15 minutos)</strong></p>
        <ul>
          <li>Siempre 3 opciones: good / better / best (ver sección Flat Rate).</li>
          <li>Presenta de MAYOR a MENOR. Empieza por el best: "esta es la opción premium que recomiendo si quieren resolver el problema por 15 años". Después better, después good.</li>
          <li>Anchor pricing: al empezar con $18,500 (best), el $13,200 (better) se siente razonable.</li>
          <li>Muestra financing al mismo tiempo que el precio: "$18,500 al contado, o $247/mes por 84 meses con 0% APR hasta 12 meses".</li>
          <li>Silencio después de presentar. NO hables hasta que el cliente hable. Los técnicos nuevos rompen el silencio y pierden la venta.</li>
          <li>Incluye warranty claramente: 5/10 años parts, 1-2 años labor. Upgradeable.</li>
        </ul>

        <p><strong>Paso 6 — Close / Cerrar (5-10 minutos)</strong></p>
        <ul>
          <li>Pregunta asumiendo: "¿cuál de las 3 opciones les acomoda mejor?" NO "¿quieren hacerlo?".</li>
          <li>Si eligen: "perfecto, ¿comenzamos mañana o el jueves?" — close de elección alternativa.</li>
          <li>Si objetan precio: framework Feel-Felt-Found (ver sección Objeciones).</li>
          <li>Si dicen "déjame pensarlo": "totalmente, ¿qué parte específica necesitan pensar? ¿el precio, el equipo, el tiempo?" — descubres la objeción real.</li>
          <li>Si cierran: firma autorización digital en tablet, toma depósito (30-50% típico install, 100% repair), agenda.</li>
          <li>Celebra con el cliente: "felicidades, tomaron una gran decisión" — reduce buyer's remorse.</li>
        </ul>

        <p><strong>Paso 7 — Schedule / Agendar y despedida (5 minutos)</strong></p>
        <ul>
          <li>Agenda en calendario vivo (ServiceTitan / Housecall Pro) enfrente del cliente.</li>
          <li>Entrega copia firmada del contrato + project scope + warranty info.</li>
          <li>Explica qué esperar el día de install: tiempo, crew, cleanup, permit inspection.</li>
          <li>Deja 2 business cards: una para refrigerador, una para referir a amigos.</li>
          <li>Thank-you handwritten card por mail al día siguiente.</li>
          <li>Happy call 24 horas después del install para confirmar satisfacción + pedir review.</li>
        </ul>

        <p><strong>Métricas por técnico vendedor:</strong> close rate target 60-75% en installs (si discovery + inspect se hacen bien), 85%+ en repairs. Average ticket install $12K-$22K residencial. Tiempo en casa 60-90 min promedio. Si está debajo de 45 min, skipeó discovery o inspect — retraining obligatorio.</p>
      `,
      keyPoints: [
        '7 pasos: Greet → Discovery → Inspect → Educate → Options → Close → Schedule',
        'Tiempo total 60-90 min install, 30-45 min repair — menos de 45 min = no hubo proceso',
        'Discovery (10-15 min) es donde se gana la venta — 80% de técnicos lo skipean',
        'Inspect con mediciones reales (static, superheat, subcool) gana autoridad técnica',
        'Presentar opciones de MAYOR a MENOR — anchor pricing funciona',
        'Silencio post-precio es obligatorio — el primero que habla pierde',
        'Close rate target: 60-75% installs, 85%+ repairs; average ticket install $12K-$22K'
      ],
      realTalk: 'Tu mejor técnico vendedor no es el que sabe más de refrigeración — es el que sabe callarse después de decir el precio. Los técnicos latinos se ponen nerviosos con el silencio y sueltan "pero podemos hacerle descuento". Ahí acabaste de regalar $2,000. Aguanta el silencio, 15 segundos se sienten como 5 minutos — y te hacen ganar la venta.',
      checklist: [
        'Uniforme + badge + shoe covers listos en cada truck',
        'Script memorizado de los 7 pasos + bullets clave de cada uno',
        'Tablet/iPad con pricebook + app de fotos + financing calculator',
        'Fieldpiece SDMN6 para medir static pressure (demuestra autoridad)',
        'Plantilla digital de discovery questions para anotar respuestas',
        'Videos cortos de HVAC School (Bryan Orr) para educate step',
        '3 opciones pre-calculadas antes de presentar (nunca improvisar)',
        'Financing pre-aprobado con GreenSky/Synchrony/Service Finance',
        'Firma digital + toma de depósito integrada en app',
        'Thank-you cards + business cards siempre en el truck'
      ],
      commonMistakes: [
        'Skipear discovery — llegar y cotizar sin saber qué quiere el cliente',
        'Inspect superficial sin mediciones reales — pierdes autoridad',
        'Solo 1 opción o "precio único" — cliente pelea en lugar de elegir',
        'Presentar de menor a mayor — anchor al revés mata ticket',
        'Romper silencio después del precio — regalas descuento no pedido',
        'No mostrar financing — cliente escucha "$18K" y dice no sin saber que son $247/mes',
        'Despedida fría — pierdes momento de máximo goodwill para referrals y review'
      ]
    },

    // ========================================================
    // SECCION 6: OBJECTIONS HANDLING
    // ========================================================
    {
      id: 'objections-handling',
      heading: 'Manejo de Objeciones — los 10 "no" que se convierten en "sí"',
      body: `
        <p><strong>Una objeción NO es un rechazo — es una pregunta disfrazada.</strong> El cliente que dice "está muy caro" realmente dice "ayúdame a entender por qué vale tanto". Los técnicos nuevos oyen "no" y se retiran. Los técnicos senior oyen la pregunta escondida y contestan. Esa diferencia es lo que separa $200K de $500K al año en ventas personales.</p>

        <p><strong>Framework universal: Feel-Felt-Found.</strong> Regla de oro, memorízala:</p>
        <p><em>"Entiendo cómo se siente (feel). Muchos de mis clientes se han sentido igual (felt). Lo que encontraron fue que (found) [beneficio concreto]."</em></p>

        <p>Ejemplo: "entiendo que $13,200 se siente mucho. Muchos clientes míos se sintieron igual al principio. Lo que encontraron fue que al mes 6 el ahorro en electricidad era $80-$120, el confort cambió su casa, y el financiamiento a $174/mes era menos de lo que estaban gastando en reparaciones del viejo."</p>

        <p><strong>Las 10 objeciones más comunes (con respuesta):</strong></p>

        <p><strong>1. "Está muy caro" / "No tengo ese dinero"</strong></p>
        <p><em>Respuesta:</em> "Entiendo. Déjeme preguntarle algo — ¿es que el precio total les asusta, o es que no encaja con su presupuesto mensual? Porque si son $247 al mes con 0% APR, capaz encaja. ¿Lo vemos?" (redirige a payment position, no al total).</p>

        <p><strong>2. "Déjame pensarlo" / "Te llamo mañana"</strong></p>
        <p><em>Respuesta:</em> "Por supuesto, es una decisión importante. Ayúdeme a entender — ¿qué específicamente necesitan pensar? ¿El equipo, el precio, el tiempo? Así puedo contestar su pregunta real ahorita y no dejarlos con dudas." (flushea la objeción real).</p>

        <p><strong>3. "Mi vecino me dijo que le cobraron $X menos"</strong></p>
        <p><em>Respuesta:</em> "Qué bueno que tengan esa referencia. Lo que aprendí en 20 años es que los precios en HVAC varían según el equipo, el tamaño del sistema, el estado de los ductos, y la calidad del trabajo. Sin ver qué le instalaron a su vecino — marca, modelo, warranty — no puedo decir si es manzanas con manzanas. Lo que yo le garantizo es [tu warranty y tu brand]. ¿Le muestro la comparación por escrito?"</p>

        <p><strong>4. "¿Me lo puede hacer por cash / sin impuestos?"</strong></p>
        <p><em>Respuesta:</em> "Lo entiendo pero nuestra política no lo permite. Cobrar sin impuestos nos pondría en riesgo con la CSLB y el IRS — y si algo pasa con el sistema, su warranty no aplicaría porque no hay contrato documentado. Lo que SÍ puedo hacer es aplicar [discount legítimo] si firma hoy. ¿Lo vemos?" (nunca trabajes off-the-books — es ilegal y pierdes la licencia).</p>

        <p><strong>5. "El equipo viejo todavía funciona, ¿para qué cambiar?"</strong></p>
        <p><em>Respuesta:</em> "Correcto, todavía funciona — pero miren [muestra fotos]: el compresor está a 18 amps cuando el spec es 14, el freon está bajo, los ductos pierden 25% de capacidad. Su sistema trabajando al 70% les está costando $80-$120 extra cada mes en luz. En 12 meses pagan $1,440 extra. ¿Preferirían invertir eso en un sistema nuevo que les ahorra y da warranty?"</p>

        <p><strong>6. "Necesito hablar con mi esposa/esposo primero"</strong></p>
        <p><em>Respuesta:</em> "Por supuesto, las decisiones importantes se toman en pareja. ¿Tiene un momento para llamarla ahorita? Puedo contestar cualquier pregunta técnica que ella tenga — así no tiene que explicarlo usted después. O si prefiere, podemos agendar una segunda visita mañana con ambos presentes, sin obligación." (nunca dejar sin agendar la reunificación).</p>

        <p><strong>7. "Voy a pedir más cotizaciones"</strong></p>
        <p><em>Respuesta:</em> "Excelente idea, siempre recomiendo comparar. Déjeme darle la lista de qué verificar en cada cotización — que sea Manual J, warranty de labor mínimo 2 años, brand AHRI-matched, y license + insurance. El 80% de las cotizaciones bajas están faltando alguno de esos elementos. Mi cotización ya los incluye todos. Si encuentra una cotización apples-to-apples más barata, respetamos precio. ¿Le parece?" (controla la comparación).</p>

        <p><strong>8. "Conozco a alguien que me lo hace más barato"</strong></p>
        <p><em>Respuesta:</em> "Seguramente es buena gente. La pregunta es: ¿tiene licencia C-20 activa? ¿Workers comp? ¿General liability de $1M+? ¿Warranty por escrito de 10 años? Si todos son sí, probablemente les cobra similar. Si alguno es no, un accidente en su casa les cae a ustedes como propietarios. No es miedo, es realidad legal." (educa sobre riesgo).</p>

        <p><strong>9. "¿Y si se descompone en 2 años?"</strong></p>
        <p><em>Respuesta:</em> "Pregunta perfecta. Nuestro warranty cubre parts 10 años (manufacturer) + labor 2 años (nuestro). Si algo falla en ese período, cero costo. Después de 2 años, tenemos membership plans que extienden labor warranty por $19/mes. Su sistema actual no tiene ninguno de los dos — por eso cada reparación cuesta full precio ahora."</p>

        <p><strong>10. "No confío en tantos contratistas que he visto"</strong></p>
        <p><em>Respuesta:</em> "Los entiendo completamente — hay mucho contratista malo en la industria. Por eso nosotros [credenciales: CSLB # visible, BBB rating, Google reviews, años en negocio, cuántos installs al año]. Nuestros clientes vuelven 87% cuando necesitan algo — ahí está la diferencia. ¿Quiere que le conecte con 3 clientes nuestros en su zona para que les pregunten directo?" (ofrece social proof verificable).</p>

        <p><strong>Silent close.</strong> Después de manejar la objeción, haz la pregunta de cierre y <strong>cállate</strong>. No elabores, no expliques más, no añadas descuento. El primer que habla acepta la posición del otro. En training de Sandler Selling, se cuenta de 30 segundos de silencio post-cierre — se siente como eternidad pero cierra ventas.</p>

        <p><strong>Cuándo dejar ir al cliente.</strong> Si después de 3 objeciones manejadas el cliente sigue sin firmar, es mejor decir: "parece que este no es el momento correcto. Le dejo la cotización válida por 30 días. Si cambian de opinión, llámenos. Gracias por su tiempo". Algunos llaman 2 semanas después y firman. Otros no — y están bien. No desgastes al cliente y no te desgastes tú.</p>
      `,
      keyPoints: [
        'Feel-Felt-Found es el framework universal — memorízalo y úsalo siempre',
        '"Está muy caro" = "convénceme del valor"; redirige a monthly payment',
        '"Déjame pensarlo" = objeción escondida; flushea con "¿qué específicamente?"',
        'Nunca aceptes cash off-the-books — pierdes licencia y cliente pierde warranty',
        'Controla comparación: "le doy la lista de qué verificar" evita race to the bottom',
        'Social proof (reviews, referrals, años) gana confianza más que specs técnicos',
        'Silent close post-cierre — primer que habla pierde; aguanta 30 segundos'
      ],
      realTalk: 'Cuando el cliente dice "no", escucha la pregunta escondida. "Muy caro" = "no me convenciste del valor". "Déjame pensarlo" = "algo específico me hace dudar". "Mi vecino cobra menos" = "dame razón para pagarte más". Si solo escuchas la palabra superficial, pierdes. Si escuchas la pregunta, cierras.',
      checklist: [
        'Memorizar script Feel-Felt-Found + 10 objeciones más comunes con respuesta',
        'Role-play semanal con equipo: técnico cotiza, dueño objeta, técnico maneja',
        'Lista de "qué verificar en cada cotización" preparada para entregar',
        'Warranty claramente comunicado en cada cotización (parts 10 años, labor 2 años)',
        '3-5 testimonios de clientes locales dispuestos a ser referencia telefónica',
        'Política escrita: NO cash off-the-books bajo ninguna circunstancia',
        'Financing pre-aprobado para redirigir "muy caro" a payment mensual',
        'Tracker de objeciones por técnico — identifica dónde se pierden ventas',
        'Follow-up call 48 horas después de "déjame pensarlo" con valor nuevo',
        'Cotización válida 30 días por escrito — algunos llaman después'
      ],
      commonMistakes: [
        'Responder a objeción con descuento inmediato — regalas margin sin razón',
        'Discutir con el cliente ("no es caro, es justo") — pierdes la venta y el respeto',
        'No flushear "déjame pensarlo" — pierdes la objeción real y pierdes la venta',
        'Aceptar cash off-the-books "para cerrar" — ilegal, pierdes licencia',
        'No preparar social proof — "somos buenos" sin pruebas no convence',
        'Romper silent close con descuento auto-ofrecido — el cliente no lo había pedido',
        'Insistir después de 3 objeciones manejadas — desgasta relación y mata referral'
      ]
    },

    // ========================================================
    // SECCION 7: COMMISSION STRUCTURES
    // ========================================================
    {
      id: 'commission-structures',
      heading: 'Estructuras de Comisión — pagarle a los técnicos para que vendan',
      body: `
        <p><strong>El técnico que solo repara te cuesta labor. El técnico que vende te genera revenue.</strong> La diferencia entre un shop de $300K/año y uno de $1.5M/año casi siempre está en cómo se paga al personal técnico. Hourly puro te da loyalty mínima y zero iniciativa de venta. Commission/hybrid transforma a tus técnicos en profit centers.</p>

        <p><strong>Los 4 modelos principales de pago:</strong></p>

        <p><strong>1. Hourly only (puro)</strong></p>
        <ul>
          <li>$22-$38/hora según skill level. Lead tech/senior: $35-$50/hora.</li>
          <li><em>Pros:</em> simple, predecible, cumple wage laws sin complicación, técnico no "sobrevende".</li>
          <li><em>Contras:</em> zero incentivo a cerrar ventas, técnico es indiferente al revenue, productividad baja 20-30%.</li>
          <li><em>Cuándo usarlo:</em> empleados nuevos en training, apprentices, install crews (no sales).</li>
        </ul>

        <p><strong>2. Commission puro (spiff / 100% comisión)</strong></p>
        <ul>
          <li>Técnico gana 15-25% de gross revenue generado, sin hourly.</li>
          <li><em>Pros:</em> alineación total de intereses, top performers ganan $80K-$180K.</li>
          <li><em>Contras:</em> <strong>problema legal MAYOR</strong> — en CA y muchos estados, técnicos son non-exempt y DEBES pagarles mínimo hourly + overtime. Commission puro viola FLSA y CA wage order 4. Riesgo de class action.</li>
          <li><em>Cuándo usarlo:</em> prácticamente nunca en HVAC residencial. Algunos comisionistas independientes 1099 pueden hacerlo, pero si lo tratas como empleado, es misclassification.</li>
        </ul>

        <p><strong>3. Hybrid hourly + commission (el estándar industria)</strong></p>
        <ul>
          <li>Base hourly $22-$35/hora (cubre minimum wage + overtime).</li>
          <li>Plus commission 8-12% de sold revenue en service/repairs.</li>
          <li>Plus commission 3-5% de sold revenue en installs (menor % pero tickets más altos).</li>
          <li>Plus SPIFFs específicos (ver abajo).</li>
          <li><em>Total take-home lead tech con hybrid:</em> $75K-$140K/año típico.</li>
          <li><em>Pros:</em> legal compliance + strong incentivo + retención de talent.</li>
          <li><em>Contras:</em> más complejo de trackear, requiere CRM con commission tracking (ServiceTitan, Housecall Pro Pro plan).</li>
          <li><strong>Esto es lo que recomiendo para 99% de contratistas HVAC residenciales.</strong></li>
        </ul>

        <p><strong>4. Installer team pay (flat rate per install)</strong></p>
        <ul>
          <li>Lead installer: $500-$900 por sistema instalado (depende de complejidad).</li>
          <li>Helper: $250-$450 por install.</li>
          <li>Plus hourly base para legal compliance.</li>
          <li><em>Pros:</em> motiva a terminar rápido y bien, productividad sube 25-35%.</li>
          <li><em>Contras:</em> riesgo de shortcuts si no hay QC + commission claw-back por callbacks.</li>
        </ul>

        <p><strong>Claw-back y callbacks.</strong> Regla crítica: <em>si hay callback de warranty dentro de 90 días, se claw-backea 50% de la comisión</em>. Esto alinea al técnico con calidad, no solo volumen. Sin claw-back, el técnico vende cualquier cosa con tal de ganar, y tú comes los callbacks.</p>

        <p><strong>SPIFFs (Sales Performance Incentive Fund) — bonos específicos de producto o conducta.</strong> Ejemplos:</p>
        <ul>
          <li><strong>$50-$150 por cada venta de membership plan</strong> firmada — retention directa.</li>
          <li><strong>$100-$250 por install de IAQ product</strong> (UV light, media filter, humidifier).</li>
          <li><strong>$200-$400 por upgrade de SEER14 a SEER18+</strong> en install.</li>
          <li><strong>$25-$75 por review Google 5 estrellas</strong> generada post-job.</li>
          <li><strong>$500-$1,500 mensual para técnico que alcance average ticket $X</strong>.</li>
          <li><strong>Trip incentives:</strong> top performer del año gana viaje a Vegas/Cabo con familia — costo $3-5K, retention value $50K+.</li>
        </ul>

        <p><strong>Preventing side jobs / stealing clients.</strong> Este es el peor enemigo del contratista mediano — el técnico que le dice al cliente "yo te lo hago por fuera de horario a mitad de precio". Estrategias:</p>
        <ul>
          <li><strong>Non-compete + non-solicitation agreement:</strong> firmado al hire. Cubre 12-24 meses post-employment en radio de 50-100 millas. (OJO: CA hace non-competes muy difíciles de enforcer, pero non-solicitation es válido).</li>
          <li><strong>Commission estructura atractiva:</strong> si tu técnico gana $1,800 comisión en el job, el $500 cash del side job no vale el riesgo.</li>
          <li><strong>GPS tracking en trucks:</strong> Verizon Connect, Samsara, Azuga. $30-60/truck/mes. Ves si el truck paró 2 horas en una casa que no estaba en el schedule.</li>
          <li><strong>Customer ownership:</strong> CRM guarda TODA la interacción. El cliente es de la empresa, no del técnico. Thank-you cards + membership plan + follow-up vienen de HQ, no del técnico personal.</li>
          <li><strong>Referral program al cliente:</strong> cliente que refiere a amigo gana $50-$100. Incentiva a reportarte directo si otro técnico le ofreció algo raro.</li>
          <li><strong>Consequences claras:</strong> side job documentado = firing + demanda civil por daños. Publica la política. Haz una vez ejemplo público (discreto) y el resto se alinea.</li>
        </ul>

        <p><strong>Commission tracking tools.</strong></p>
        <ul>
          <li><strong>ServiceTitan Compensation:</strong> integrado, automático, top-tier. Enterprise.</li>
          <li><strong>Housecall Pro Pro plan:</strong> commission tracking nativo.</li>
          <li><strong>FieldEdge:</strong> commission + payroll integration.</li>
          <li><strong>Commission tracking manual en Excel:</strong> funciona para shops de 1-3 técnicos pero error-prone en scale.</li>
        </ul>

        <p><strong>Transparency con los técnicos.</strong> El mejor retention tool es que el técnico VEA su comisión tracked en tiempo real. Dashboard en su iPad mostrando "hoy vendiste $1,850, comisión $148, promedio diario $125". Esto transforma la psicología — ya no es "trabajo 8 horas", es "genero $148 de income hoy".</p>
      `,
      keyPoints: [
        'Hybrid hourly + commission (8-12% service, 3-5% install) es el estándar industria',
        'Commission puro es ilegal en CA y mayoría de estados — misclassification riesgoso',
        'Claw-back 50% en callbacks 90 días alinea técnico con calidad',
        'SPIFFs específicos: membership plans ($50-$150), IAQ ($100-$250), SEER upgrade ($200-$400)',
        'Side jobs se previenen con: non-solicitation + comisión atractiva + GPS + customer ownership',
        'Total take-home lead tech hybrid: $75K-$140K/año típico — retention fuerte',
        'Transparency real-time de comisión en iPad transforma psicología de técnico'
      ],
      realTalk: 'Si le pagas $32/hora hourly puro a tu mejor técnico, en 6 meses se va con el competidor que le ofreció 10% de comisión. Y se lleva 5 de tus clientes. Pagar comisión NO es gasto — es retention. El técnico de $140K te genera $800K de revenue. El de $65K hourly te genera $280K. Haz la matemática.',
      checklist: [
        'Escoger modelo: hybrid hourly+commission para service, flat-rate per install para install crews',
        'Calcular % de comisión que soporta tu gross margin (típico 8-12% service, 3-5% install)',
        'Claw-back 50% por callbacks 90 días documentado en employment agreement',
        'SPIFFs mensuales claros: membership, IAQ, SEER upgrade, reviews',
        'Non-solicitation agreement firmado al hire — revisado por abogado local',
        'GPS tracking en cada truck (Samsara/Verizon Connect) — $30-60/truck/mes',
        'CRM con commission tracking (ServiceTitan/Housecall Pro/FieldEdge)',
        'Dashboard real-time en iPad del técnico con earnings del día/semana',
        'Política escrita de side jobs = termination + civil damages',
        'Trip incentive anual para top performer con familia',
        'Review mensual 1-on-1 con cada técnico sobre comisión + performance'
      ],
      commonMistakes: [
        'Pagar commission puro sin base hourly — ilegal, lawsuit waiting to happen',
        'No tener claw-back por callbacks — técnico vende basura con tal de ganar',
        'Commission rate muy baja (3-5% service) — técnico indiferente, se va al competidor',
        'No tener non-solicitation — técnico se va y lleva tus clientes legalmente',
        'No GPS en trucks — side jobs invisibles hasta que ya perdiste 15 clientes',
        'Commission tracking en Excel manual — errores, disputas, técnicos desconfían',
        'No transparency de earnings — técnico no ve impacto de su venta, pierde motivación'
      ]
    }

  ],

  resources: [
    { label: 'ServiceTitan (CRM + Pricebook Pro)', url: 'https://www.servicetitan.com/', type: 'software' },
    { label: 'ServiceTitan Pricebook Pro', url: 'https://www.servicetitan.com/products/pricebook', type: 'software' },
    { label: 'Profit Rhino (flat rate pricebook)', url: 'https://www.profitrhino.com/', type: 'software' },
    { label: 'Callahan Roach (flat rate book)', url: 'https://www.callahanroach.com/', type: 'software' },
    { label: 'The New Flat Rate (options-based pricing)', url: 'https://thenewflatrate.com/', type: 'software' },
    { label: 'Coolfront (mobile flat rate)', url: 'https://coolfront.com/', type: 'software' },
    { label: 'Housecall Pro (CRM mid-market)', url: 'https://www.housecallpro.com/', type: 'software' },
    { label: 'FieldEdge (CRM HVAC especializado)', url: 'https://fieldedge.com/', type: 'software' },
    { label: 'Jobber (CRM small business)', url: 'https://getjobber.com/', type: 'software' },
    { label: 'HVAC School — Bryan Orr (training gratis)', url: 'https://www.hvacrschool.com/', type: 'training' },
    { label: 'HVAC School YouTube (videos técnicos)', url: 'https://www.youtube.com/c/HVACSchool', type: 'training' },
    { label: 'Nexstar Network (training + coaching)', url: 'https://www.nexstarnetwork.com/', type: 'training' },
    { label: 'Service Nation / Service Roundtable', url: 'https://www.serviceroundtable.com/', type: 'training' },
    { label: 'EGIA Contractor University', url: 'https://www.egia.org/contractor-university/', type: 'training' },
    { label: 'BDR (Business Development Resources)', url: 'https://www.bdrco.com/', type: 'training' },
    { label: 'ACCA MSCA Training', url: 'https://www.acca.org/msca', type: 'training' },
    { label: 'Wrightsoft Right-Suite (Manual J/S/D)', url: 'https://www.wrightsoft.com/', type: 'software' },
    { label: 'Cool Calc (load calc mobile)', url: 'https://www.coolcalc.com/', type: 'software' },
    { label: 'Contractor Commerce (ecommerce addon)', url: 'https://contractorcommerce.com/', type: 'software' },
    { label: 'Samsara GPS / Fleet tracking', url: 'https://www.samsara.com/', type: 'software' },
    { label: 'Verizon Connect (fleet GPS)', url: 'https://www.verizonconnect.com/', type: 'software' },
    { label: 'OptimoRoute (route optimization)', url: 'https://optimoroute.com/', type: 'software' },
    { label: 'Route4Me', url: 'https://www.route4me.com/', type: 'software' },
    { label: 'QuickBooks Online (accounting)', url: 'https://quickbooks.intuit.com/', type: 'software' },
    { label: 'GreenSky (financing)', url: 'https://www.greensky.com/', type: 'software' },
    { label: 'Synchrony Business', url: 'https://www.synchronybusiness.com/', type: 'software' },
    { label: 'Service Finance Company', url: 'https://www.svcfin.com/', type: 'software' },
    { label: 'Sandler Selling System', url: 'https://www.sandler.com/', type: 'training' },
    { label: 'Fieldpiece SDMN6 (static pressure manómetro)', url: 'https://www.fieldpiece.com/products/sdmn6/', type: 'tool' },
    { label: 'CSLB License lookup', url: 'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/', type: 'link' }
  ],

  glossary: [
    { term: 'Markup', def: 'Cuánto le sumas al costo para fijar precio. Fórmula: (Precio - Costo) / Costo × 100. Markup 40% = precio 1.40x el costo.' },
    { term: 'Margin (Gross Margin)', def: 'Qué porcentaje del precio final es ganancia bruta. Fórmula: (Precio - Costo) / Precio × 100. Markup 40% = margin 28.6%.' },
    { term: 'Gross Profit', def: 'Revenue menos COGS (cost of goods sold: equipo, materiales, labor directo). Todavía falta restar overhead.' },
    { term: 'Net Profit', def: 'Gross profit menos overhead (rent, seguros, marketing, software, owner pay, taxes). El número que importa para acumular patrimonio.' },
    { term: 'Overhead', def: 'Todos los gastos fijos que existen haya o no trabajo: rent, utilities, seguros, software, admin. Típicamente 25-32% de revenue en HVAC.' },
    { term: 'Breakeven', def: 'Punto donde revenue = total costs (fijos + variables). Debajo de breakeven estás perdiendo dinero.' },
    { term: 'T&M (Time and Materials)', def: 'Modelo viejo donde cobras "X por hora más piezas". Genera disputas con cliente, baja productividad, gross margin típico 25-30%.' },
    { term: 'Flat Rate', def: 'Precio fijo por tarea (no por hora). Estándar de la industria. Gross margin típico 45-55%, close rate 15-25% mayor que T&M.' },
    { term: 'Service Call Fee / Diagnostic Fee', def: 'Tarifa por llegar a la casa y diagnosticar. $89-$159 estándar, $189-$399 after-hours. NUNCA waivear "si hace la reparación".' },
    { term: 'Callback', def: 'Cliente que llama de regreso por problema con trabajo reciente. Target industry: <5% de jobs. Mata margin porque no factura y claw-back de comisión.' },
    { term: 'Truck Roll', def: 'Cada vez que sale un truck a un job. Costo real $8-$12/milla operada + $250-$400/día fully loaded.' },
    { term: 'CAC (Customer Acquisition Cost)', def: 'Costo total para conseguir un cliente nuevo: marketing + sales labor + operations dedicadas. Target HVAC: $200-$500.' },
    { term: 'LTV (Lifetime Value)', def: 'Revenue total que te generará un cliente durante toda la relación. Membership plan + repeat jobs + referrals. Sano: LTV/CAC > 3.' },
    { term: 'AOV (Average Order Value / Average Ticket)', def: 'Ticket promedio por transacción. HVAC residencial benchmarks: $450-$750 repair, $12K-$22K install.' },
    { term: 'Close Rate', def: 'Porcentaje de leads/estimates que se convierten en venta firmada. Target: 60-75% installs, 85%+ repairs con proceso completo.' },
    { term: 'Conversion', def: 'Genérico: % que pasa de una etapa a la siguiente en funnel (call → estimate → sale → review). Cada etapa tiene su conversion rate propio.' },
    { term: 'Upsell', def: 'Subir al cliente a un tier superior (e.g., SEER14 → SEER18, standard → premium warranty). Crítico en presentación 3-opciones.' },
    { term: 'Cross-sell', def: 'Vender producto/servicio complementario (e.g., install + IAQ + membership). Sube AOV 20-40% sin más trucks rolls.' },
    { term: 'Option Sheet', def: 'Hoja/pantalla con 3 opciones (good/better/best) presentadas al cliente. Base del flat rate selling moderno.' },
    { term: 'Good / Better / Best', def: 'Framework de 3 opciones en orden de precio. 15% escoge good, 65% better, 20% best. Sube ticket promedio 40% vs cotización única.' },
    { term: 'SPIFF (Sales Performance Incentive Fund)', def: 'Bonos específicos para técnico por vender productos/servicios particulares (membership, IAQ, SEER upgrade). $25-$400 típicos.' },
    { term: 'Commission', def: 'Porcentaje de sold revenue que gana el técnico. HVAC benchmark: 8-12% service/repair, 3-5% install. Hybrid con hourly para compliance legal.' },
    { term: 'PLR (Profit and Loss Report)', def: 'Reporte financiero que muestra revenue, COGS, gross profit, overhead, net profit. Debe revisarse mensual, no anual.' },
    { term: 'EBITDA', def: 'Earnings Before Interest, Taxes, Depreciation, Amortization. Mide profit operativo puro. Valor de venta de empresas HVAC típicamente 3-5x EBITDA.' },
    { term: 'Feel-Felt-Found', def: 'Framework universal para manejar objeciones: "entiendo cómo se siente (feel), muchos se han sentido igual (felt), lo que encontraron fue (found)". Memorízalo.' }
  ]
};
