window.CONTRACTOR_BLOQUE_4 = {
  number: 4,
  title: 'Finanzas y Cash Flow',
  tagline: 'Del "hago dinero" al "tengo dinero" — la realidad financiera del contratista',
  intro: `
    <p><strong>El 80% de los contratistas HVAC latinos que cierran sus puertas en el año 3 no cierran por falta de trabajo — cierran por falta de CASH.</strong> Tenían la agenda llena, facturaban $40K al mes, pero el viernes no podían hacer payroll. Esa es la diferencia entre <em>profit</em> (lo que dice tu P&L) y <em>cash</em> (lo que dice tu cuenta de banco). Son dos animales completamente distintos, y si no entiendes la diferencia, te vas a quebrar aunque "estés haciendo dinero."</p>
    <p>En este bloque te voy a enseñar la parte financiera real del negocio — la que nadie te enseña en la escuela de HVAC. No es teoría de MBA; es supervivencia de contratista. Cómo llevar los libros sin volverte contador, cómo pronosticar cash flow para que nunca te agarre un enero seco, cómo estructurar payroll para que el IRS no te visite, cómo construir crédito empresarial separado del personal (para que cuando el truck se descomponga no tengas que poner el swipe en tu tarjeta personal), cómo calcular precios que <strong>realmente</strong> dejen margen, cómo elegir S-Corp para ahorrar 15.3% en self-employment tax, y cómo convertir el dinero que generas HOY en wealth que te sostenga a los 65.</p>
    <p>La gran verdad que nadie te dice: un contratista que factura $800K con 5% de margen neto gana LO MISMO que un contratista que factura $400K con 10% de margen — pero con la mitad del estrés, la mitad del payroll y la mitad del riesgo. <strong>No es cuánto facturas; es cuánto te queda.</strong> Y cuánto te queda depende 100% de la disciplina financiera que aprendas en este bloque.</p>
    <p><strong>Regla #1:</strong> Separa el dinero del negocio del dinero personal desde el día 1. EIN, cuenta de cheques de negocio, tarjeta de crédito de negocio. Si sigues mezclando Zelle personal con pagos de clientes, el IRS te va a auditar y el juez va a "piercing the corporate veil" cuando te demanden.</p>
    <p><strong>Regla #2:</strong> Tu meta no es generar ingresos — es generar cash flow libre. Revenue es vanity, profit is sanity, cash is king. Aprende esa frase, tatuátela en el truck si es necesario.</p>
  `,
  sections: [
    {
      id: 'bookkeeping-quickbooks',
      heading: 'Bookkeeping y QuickBooks — Los Libros que te Salvan',
      body: `
        <p>Si tu "bookkeeping" es una caja de zapatos con recibos y un Excel que llena tu esposa los domingos, <strong>estás manejando el negocio a ciegas</strong>. No sabes qué job fue rentable, no sabes cuánto debes en taxes, y cuando el banco te pida estados para una SBA loan vas a llorar. Los libros no son "papeleo" — son el GPS del negocio. Sin libros limpios, cualquier decisión que tomes es un tiro al aire.</p>

        <h4>QuickBooks Online (QBO) vs QuickBooks Desktop (QBDT)</h4>
        <p>Para 95% de contratistas HVAC la respuesta es <strong>QuickBooks Online Plus o Advanced</strong>. QBDT tuvo su época, pero Intuit lo está matando lentamente (ya no venden nuevas licencias de QBDT Pro/Premier a usuarios nuevos desde 2024 — solo renuevas si ya lo tenías). QBO tiene:</p>
        <ul>
          <li><strong>Acceso desde el truck</strong> vía app iPhone/Android — facturas y cobras en el driveway del cliente.</li>
          <li><strong>Bank feeds automáticos</strong> — tu cuenta de Chase Business se sincroniza cada noche, no tienes que digitar transacciones.</li>
          <li><strong>Integración con ServiceTitan, Housecall Pro, Jobber</strong> — las invoices se empujan automáticamente.</li>
          <li><strong>Multi-user</strong> — tu bookkeeper ve lo mismo que tú, sin enviar archivos .QBW por email.</li>
        </ul>
        <p>Precios (2026): QBO Simple Start $35/mo, Essentials $65/mo, <strong>Plus $99/mo</strong> (este es el mínimo para contratistas porque tiene class tracking + job costing), Advanced $235/mo (para +$2M revenue).</p>

        <h4>Chart of Accounts (COA) para HVAC — la estructura correcta</h4>
        <p>El COA es la columna vertebral. Si lo haces mal, todo lo demás es basura. Para HVAC residencial/comercial usa esta estructura:</p>
        <ul>
          <li><strong>Income (4000s):</strong> 4010 Service Calls, 4020 Repairs, 4030 Maintenance Agreements, 4040 Installations Residential, 4050 Installations Commercial, 4060 Duct Work, 4070 IAQ Products.</li>
          <li><strong>COGS (5000s):</strong> 5010 Equipment (condensers, furnaces), 5020 Materials (coils, line sets, drain, breakers), 5030 Subcontractors (electrician, crane), 5040 Direct Labor (tech hours en el job), 5050 Permits & Inspection Fees, 5060 Warranty Claims.</li>
          <li><strong>Expenses (6000s):</strong> 6010 Office Rent, 6020 Truck Lease/Loan, 6030 Fuel, 6040 Insurance (GL + Comp + Auto), 6050 Marketing, 6060 Software (QBO, ServiceTitan), 6070 Office Salaries, 6080 Owner Salary (S-Corp), 6090 Bookkeeping/CPA.</li>
        </ul>

        <h4>Job Costing y Class Tracking — el diferenciador real</h4>
        <p>Aquí es donde los contratistas serios separan jobs rentables de jobs que queman dinero. En QBO Plus activas <strong>Projects</strong> y cada install le asignas un "Project" (ejemplo: "1234 Maple St - Smith AC Install"). Cada hora de labor, cada condenser, cada permit lo codificas a ese project. Al final ves: "Facturé $8,500, costé $5,900, ganancia bruta $2,600 (30.6%)". Sin eso, estás adivinando.</p>
        <p><strong>Class tracking</strong> lo usas para separar divisiones: Class 1 = Residential, Class 2 = Commercial, Class 3 = Service. Así ves cuál división realmente paga las cuentas (pista: usualmente commercial maintenance agreements, aunque sientas que residential installs es donde "está el dinero").</p>

        <h4>¿Bookkeeper o CPA? — no es lo mismo</h4>
        <p><strong>Bookkeeper ($300-500/mes)</strong> = categoriza transacciones, concilia bank feeds, corre payroll básico, emite reportes mensuales (P&L, Balance Sheet). Hire a un bookkeeper cuando facturas $250K+/año o cuando ya no puedes con el papeleo. Busca uno con <strong>QuickBooks ProAdvisor certification</strong> y experiencia en construction/HVAC (no el mismo que lleva el restaurante del tío). Plataformas: Bench, Pilot, Bookkeeper.com, o local vía referrals.</p>
        <p><strong>CPA ($1,500-3,000/año)</strong> = prepara la declaración de taxes, te asesora en S-Corp election, te representa en auditorías IRS, firma estados para loans. NO es el que lleva los libros del día a día — el CPA trabaja CON los libros que el bookkeeper mantiene. Busca un CPA que entienda <strong>construction accounting</strong> (percentage of completion vs completed contract method). Pagas $1,500/año por tax return + $250/hr por consultas estratégicas (S-Corp, Section 179, real estate).</p>
        <p>Regla práctica: bookkeeper es un gasto operativo mensual, CPA es un asesor estratégico anual. Los necesitas a AMBOS — no son intercambiables.</p>
      `,
      keyPoints: [
        'QuickBooks Online Plus ($99/mo) es el mínimo para HVAC con job costing',
        'Chart of Accounts debe separar Income, COGS, y Expenses con códigos 4000/5000/6000',
        'Projects en QBO = job costing por cada install para ver rentabilidad real',
        'Class tracking separa Residential vs Commercial vs Service',
        'Bookkeeper $300-500/mo lleva el día a día; CPA $1,500-3K/año hace taxes',
        'Bookkeeper debe tener QuickBooks ProAdvisor certification',
        'Nunca uses la misma persona para bookkeeping y tax prep — conflicto de interés'
      ],
      realTalk: '"Conocí un contratista en Riverside que facturaba $1.2M al año, todo cash-basis, recibos en caja de zapatos. Vino un IRS audit y no pudo justificar $340K de COGS. Le pegaron $87K en back taxes + penalties. Un bookkeeper de $400/mes hubiera evitado eso. Los libros limpios no son un lujo — son seguro de vida."',
      checklist: [
        'Cuenta de banco business separada (Chase/Bank of America Business)',
        'EIN del IRS (gratis en irs.gov, 10 minutos)',
        'QuickBooks Online Plus activo y conectado a bank feeds',
        'Chart of Accounts customizado para HVAC (no el default de QBO)',
        'Projects activados y cada install tiene su project',
        'Class tracking configurado: Residential / Commercial / Service',
        'Bookkeeper contratado (ProAdvisor cert) o software tipo Bench',
        'CPA contratado para tax return anual + consulta trimestral'
      ],
      commonMistakes: [
        'Mezclar cuenta personal con business — el IRS lo penaliza y el juez rompe el corporate veil',
        'Usar Excel o "la libreta" — pierdes deducciones de $10K+ por falta de tracking',
        'Categorizar todo como "Office Supplies" — CPA no puede defender eso',
        'No hacer bank reconciliation mensual — descubres fraude 8 meses tarde',
        'Contratar un bookkeeper sin experiencia en construction — mete los jobs mal'
      ]
    },
    {
      id: 'cash-flow',
      heading: 'Cash Flow — La Trampa del "Hago Dinero pero No Tengo"',
      body: `
        <p>Pregunta de examen: Un contratista vendió $85,000 en trabajo el mes pasado. Sus COGS + expenses fueron $62,000. Su "profit" en el P&L = $23,000. Pero el viernes no pudo pagar payroll de $9,400. ¿Qué pasó? <strong>Pasó que profit ≠ cash.</strong> Vendió $85K pero cobró $43K (el resto está en Accounts Receivable esperando 45 días). De esos $43K cobrados, pagó materiales del mes anterior ($28K), renta ($3K), insurance ($2.2K), y gas ($800). Le quedaron $9K en la cuenta. El payroll de $9.4K no cupo. <strong>Técnicamente "rentable", técnicamente quebrado.</strong></p>

        <h4>La diferencia entre Profit y Cash</h4>
        <p>Profit es una opinión contable; cash es un hecho bancario. Puedes ser rentable EN PAPEL todo el año y quebrar en diciembre porque:</p>
        <ul>
          <li><strong>Accounts Receivable (AR)</strong> — facturaste pero el cliente no ha pagado. En commercial HVAC el Net 30/Net 60 es la norma; en construction GC paga a Net 90+ (a veces 120 si el proyecto tiene retention).</li>
          <li><strong>Inventory</strong> — compraste 10 condensers Carrier a $2,800 c/u para el verano ($28K cash out), pero están en la bodega. Contablemente no es "gasto" hasta que los instales — pero tu banco ya está $28K más abajo.</li>
          <li><strong>Loan Principal</strong> — cuando pagas el truck loan, el interés es gasto (sale del P&L) pero el principal NO es gasto — sale directo de cash. Tu P&L se ve bonito, tu banco se desangra.</li>
          <li><strong>Deferred Taxes</strong> — los $23K de "profit" deben 15.3% SE tax + income tax. Si no los separas, en abril te vas a morir.</li>
        </ul>

        <h4>AR Aging — el reporte que te salva</h4>
        <p>Abre QBO → Reports → Accounts Receivable Aging Summary. Vas a ver columnas: Current (0-30 días), 31-60, 61-90, 90+. <strong>Tu 90+ debería ser 0.</strong> Si tienes más del 10% de tu AR en 60+, tienes un problema de cobranza, no un problema de ventas. Regla del oficio:</p>
        <ul>
          <li><strong>0-30 días:</strong> normal, deja que respire.</li>
          <li><strong>31-45 días:</strong> email amable de recordatorio + call al accounts payable.</li>
          <li><strong>46-60 días:</strong> demand letter formal, suspende trabajo en curso si hay.</li>
          <li><strong>61-90 días:</strong> empieza el proceso de Mechanics Lien (Preliminary Notice ya debiste haberlo mandado al día 20 — ver Bloque 3).</li>
          <li><strong>90+ días:</strong> file el lien, o vende la deuda a un collection agency (cobran 30-50%, pero algo es mejor que nada).</li>
        </ul>

        <h4>Cash Flow Forecasting — 13-Week Model</h4>
        <p>Lo que los contratistas serios hacen: un <strong>13-week rolling cash forecast</strong> en un spreadsheet simple. Columnas = semanas 1 a 13. Filas = cash in (deposits esperados, cobros de AR), cash out (payroll cada 2 semanas, renta, insurance trimestral, material orders, truck payments, CPA, taxes estimados). Al final de cada semana proyectas el saldo. Si ves una semana en rojo en la semana 7, tienes <strong>7 semanas para conseguir un line of credit, acelerar cobranza, o retrasar una compra</strong>. Si lo descubres el jueves antes del payroll, ya valiste.</p>

        <h4>Regla de los 3-6 Meses de Runway</h4>
        <p>Tu cuenta de business debe tener <strong>3 meses de operating expenses en cash</strong> como mínimo — 6 meses es el objetivo ideal. Si tus expenses mensuales (payroll + overhead) son $45K, debes tener $135K-$270K en el banco intocable. Esto es tu <em>war chest</em>. Te salva de:</p>
        <ul>
          <li>Un enero seco (ver seasonality abajo)</li>
          <li>Un cliente grande que te bailey $30K</li>
          <li>Una demanda que te cueste $15K en abogados antes de resolverse</li>
          <li>Un truck que se funda y necesite $8K de transmisión</li>
        </ul>

        <h4>Seasonality del HVAC — verano cash, invierno dry</h4>
        <p>En California el HVAC tiene 2 peaks: Mayo-Septiembre (AC season — 60% del revenue anual) y Noviembre-Febrero (heating — 25%). Los meses muertos son <strong>Marzo-Abril</strong> (después de heating, antes de AC) y <strong>Octubre</strong>. Si en julio estás haciendo $120K/mes y no reservas cash para marzo ($40K/mes si bien te va), te quiebras en abril. Regla: en summer, separa el 30% del revenue en una savings account separada para winter/spring. Los contratistas que no entienden esto compran un truck nuevo en agosto y venden herramienta en febrero.</p>
      `,
      keyPoints: [
        'Profit es opinión contable, cash es hecho bancario — no son lo mismo',
        'AR aging: si tienes >10% en 60+ días, tienes problema de cobranza',
        '13-week rolling cash forecast te da 7 semanas para reaccionar',
        'Mantén 3-6 meses de operating expenses en cash como runway',
        'HVAC es seasonal: Mayo-Sep = 60% del revenue anual, Marzo-Abril muertos',
        'En summer separa 30% del revenue para sobrevivir spring',
        'Loan principal no es gasto en P&L pero sí sale de cash'
      ],
      realTalk: '"El peor día de mi vida como contratista fue un viernes en marzo, $4K en la cuenta, $11K de payroll al lunes, y $38K en AR que los clientes no contestaban el teléfono. Tuve que pedir prestado $8K a mi suegro. Ese fin de semana aprendí que el cash flow forecast no es opcional — es la diferencia entre dormir y no dormir."',
      checklist: [
        'AR Aging report revisado cada lunes sin falta',
        '13-week cash forecast actualizado semanalmente',
        '3 meses de expenses en business savings (mínimo)',
        'Business Line of Credit aprobado ANTES de necesitarlo ($50K-$150K)',
        'Deposit requerido al 30-50% en residential installs',
        'Net 30 en invoices comerciales con 2% discount si pagan en 10 días',
        'Collections process documentado: 30/45/60/90 day triggers',
        '30% del summer revenue segregado para winter spring'
      ],
      commonMistakes: [
        'Confundir bank balance con disponibilidad real (hay checks outstanding)',
        'Comprar inventory de verano en febrero sin planear el cash',
        'No facturar inmediatamente al terminar el job — pierdes 7-10 días de AR',
        'Aceptar Net 60/90 en residential cuando deberías cobrar al terminar',
        'Pagar el truck nuevo en cash en lugar de financiar al 0% APR'
      ]
    },
    {
      id: 'payroll-taxes',
      heading: 'Payroll y Taxes — Sin Meterte al IRS',
      body: `
        <p>Payroll mal manejado es la manera #1 de terminar en corte con el IRS. No es "hacerle los cheques a los muchachos los viernes" — es un sistema legal con el FTB (California Franchise Tax Board), EDD (Employment Development Department), IRS federal, y Social Security Administration. Un contratista que corre payroll manual en Excel tarde o temprano se equivoca en el SUTA rate o se olvida de un 941 quarterly, y el penalty es 10-15% + interés + posible lien en la licencia CSLB.</p>

        <h4>Gusto vs ADP vs Paychex — la comparación real</h4>
        <p><strong>Gusto ($40/mo base + $6/empleado):</strong> es el ganador para contratistas de 1-25 empleados. Interface moderna, corre payroll en 3 clicks, maneja automáticamente: federal withholding, state withholding CA, SDI, SUTA, FUTA, 941, 940, W2s de fin de año, contractor 1099-NEC. Direct deposit gratis. Health insurance y 401(k) integrados. <strong>Esta es mi recomendación default.</strong></p>
        <p><strong>ADP Run ($79/mo base + $4/empleado):</strong> ADP es el gorila de 800 libras. Mejor para 25+ empleados o cuando operas en multiples estados. Soporte 24/7 por teléfono (Gusto es chat). Más caro, interface más vieja, pero <strong>zero errores</strong> en mi experiencia.</p>
        <p><strong>Paychex ($50/mo base + $5/empleado):</strong> intermedio entre Gusto y ADP. Fuerte en 401(k) administration y HR compliance. Es la opción si creces a 50+ empleados y quieres PEO-lite.</p>
        <p>Lo que NO debes hacer: correr payroll tú mismo en Excel, pagar en cash "bajo la mesa", o clasificar empleados como 1099 cuando son W2 (ver abajo — eso es fraude federal).</p>

        <h4>California EDD — los 4 impuestos que tienes que retener</h4>
        <p>California te pega cuatro veces en cada paycheck:</p>
        <ul>
          <li><strong>UI (Unemployment Insurance):</strong> lo paga el empleador, NO el empleado. Rate nuevo = 3.4% on first $7,000 del salario anual ($238/empleado máximo). Después de 3 años el rate se ajusta según tu "experience" (0.5% a 6.2%). Un contratista que despide mucho sube a 6.2%; uno estable baja a 1%.</li>
          <li><strong>ETT (Employment Training Tax):</strong> 0.1% on first $7,000 ($7/empleado/año). Lo paga el empleador.</li>
          <li><strong>SDI (State Disability Insurance):</strong> 1.2% del salario bruto sin cap (cambió en 2024 — antes tenía cap de $153K; ahora aplica a TODO el sueldo). Lo paga el empleado (se retiene del paycheck).</li>
          <li><strong>PIT (Personal Income Tax CA):</strong> progresivo 1% a 13.3% según ingreso. Se retiene del paycheck del empleado.</li>
        </ul>
        <p>Todos se reportan en el formulario <strong>DE 9 y DE 9C</strong> trimestralmente al EDD. Gusto hace esto automáticamente.</p>

        <h4>Federal — 941, 940, y los quarterlies</h4>
        <ul>
          <li><strong>Form 941 (Quarterly Federal Tax Return):</strong> reportas FICA (Social Security 6.2% + Medicare 1.45%, pagado mitad empleado mitad empleador) + federal income tax withheld. Due: 4/30, 7/31, 10/31, 1/31.</li>
          <li><strong>Form 940 (Annual FUTA):</strong> Federal Unemployment Tax. 6% on first $7,000 pero con crédito de 5.4% si pagaste state UI a tiempo = neto 0.6% ($42/empleado/año). Due: 1/31.</li>
          <li><strong>Form W2:</strong> a cada empleado antes del 1/31, copia al SSA.</li>
          <li><strong>Form 1099-NEC:</strong> a cada contractor (no empleado) que le pagaste $600+ en el año. Due: 1/31.</li>
        </ul>

        <h4>W2 vs 1099 — la trampa que te puede costar $500K</h4>
        <p>El IRS y California (AB 5 + ABC test) asumen que el trabajador es <strong>W2 empleado</strong> a menos que pruebes lo contrario. Para ser 1099 legítimo debe cumplir el ABC test:</p>
        <ul>
          <li><strong>A:</strong> Libre de control y dirección del hiring entity (no le dices qué horario ni cómo hacer el job).</li>
          <li><strong>B:</strong> El trabajo está <em>fuera</em> del curso ordinario de tu negocio. (Un HVAC contratando otro HVAC installer = FALLA la B — están en el mismo negocio.)</li>
          <li><strong>C:</strong> El trabajador tiene su propio negocio independiente establecido (licencia, insurance, otros clientes).</li>
        </ul>
        <p>Un tech que trabaja solo para ti, en tu truck, con tu uniforme, 40 horas a la semana = <strong>W2, no 1099</strong>. Si lo clasificas mal y el EDD te audita, te cobran backwages + UI + SDI + penalties de 3 años atrás. He visto contratistas pagar $200K-$500K en estos back-assessments. No juegues con esto.</p>

        <h4>Payroll calendar — las fechas críticas</h4>
        <p>Semi-monthly (15 y último) o bi-weekly (cada 2 viernes) son los 2 más comunes en HVAC. Bi-weekly es más simple para overtime tracking (26 periods de 2 weeks = alineado con weekly OT de California). Semi-monthly da 24 periods pero complica OT cuando un pay period cruza una semana.</p>
      `,
      keyPoints: [
        'Gusto es el mejor para 1-25 empleados ($40 + $6/emp)',
        'California EDD: UI + ETT (empleador paga), SDI + PIT (empleado paga)',
        'SDI ahora es 1.2% sin cap — afecta a todos los empleados',
        'Form 941 cada trimestre, Form 940 anual, W2 antes del 1/31',
        'FUTA efectiva = 0.6% si pagaste state UI a tiempo',
        'ABC test (AB 5): casi todos los HVAC workers son W2, no 1099',
        'Misclasificar 1099 vs W2 puede costar $500K en back-assessments'
      ],
      realTalk: '"Un amigo en San Bernardino tenía 6 techs que le juraban que querían ser 1099. EDD lo auditó en el año 4. Le cayeron $340K en back UI + SDI + penalties de 3 años. Perdió la casa. Los techs ni siquiera lo apoyaron en corte. Si dudas si es W2 o 1099, ES W2. Simple."',
      checklist: [
        'Gusto/ADP/Paychex contratado y funcionando',
        'EIN federal del IRS',
        'EDD California account registrado (8-digit employer account number)',
        '941 archivado cada trimestre (4/30, 7/31, 10/31, 1/31)',
        '940 archivado anualmente (1/31)',
        'DE 9 / DE 9C archivados trimestralmente al EDD',
        'Workers Comp policy activa (Tipo C-20 requiere por CSLB)',
        'W2s enviados antes del 1/31, 1099-NECs antes del 1/31',
        'Todos los techs correctamente clasificados W2 o 1099 per ABC test'
      ],
      commonMistakes: [
        'Pagar cash "bajo la mesa" — fraude federal + pierdes licencia CSLB',
        'Clasificar techs como 1099 para ahorrar FICA — AB 5 te destroza',
        'Olvidar SDI rate change 2024 (ya no tiene cap)',
        'No pagar el 941 a tiempo — penalty del 10% + interés compuesto',
        'Correr payroll manual en Excel — errores matemáticos = audit'
      ]
    },
    {
      id: 'business-credit',
      heading: 'Crédito Empresarial — Separa tu Personal de tu Business',
      body: `
        <p>Si estás comprando tools, gas, y parts con tu tarjeta Visa personal porque "al final es lo mismo," estás cometiendo un error de $100K. Primero, arruinas tu crédito personal (utilization alto = score baja). Segundo, cuando te demanden un cliente, el juez puede hacer "piercing the corporate veil" porque no respetaste la separación entidad/personal — y tu casa personal queda expuesta. Tercero, el banco nunca te va a dar una SBA loan de $250K si el business no tiene historial crediticio propio.</p>

        <h4>El business es una persona legal separada — trátala así</h4>
        <p>El día que registras tu LLC o S-Corp con el Secretario de Estado, nace una "persona jurídica" con su propio tax ID (EIN), su propia cuenta de banco, y su propio crédito. Pero ese crédito no existe todavía — hay que construirlo, como si fuera un adolescente con Social Security nuevo.</p>

        <h4>Paso 1 — DUNS Number (gratis en Dun & Bradstreet)</h4>
        <p>El DUNS es el "SSN empresarial". Lo emite Dun & Bradstreet gratis en 30 días (dnb.com/duns-number). Es requisito para:</p>
        <ul>
          <li>Reportar tu crédito a las 3 business credit bureaus (D&B, Experian Business, Equifax Business)</li>
          <li>Calificar para lines de crédito con suppliers (Ferguson, Baker, Grainger)</li>
          <li>Aplicar a SBA loans y government contracts</li>
        </ul>

        <h4>Paso 2 — Nav.com (gratis, monitoreo)</h4>
        <p>Nav.com es el "Credit Karma" del business. Te muestra tu Paydex score (D&B), Intelliscore (Experian), FICO SBSS (el score que usan bancos para SBA). Gratis la versión básica. Revísalo mensualmente y dispútalo si hay errores.</p>

        <h4>Paso 3 — Net-30 Tradelines (building blocks)</h4>
        <p>Antes de pedir una tarjeta de crédito, establece 5-6 "tradelines" con suppliers que reporten a D&B:</p>
        <ul>
          <li><strong>Uline</strong> (safety supplies) — Net 30, reporta a D&B</li>
          <li><strong>Grainger</strong> (industrial supply) — Net 30</li>
          <li><strong>Home Depot Commercial Account</strong> — Net 30, reporta</li>
          <li><strong>Ferguson HVAC Pro Account</strong> — Net 30 típico, $5K-$50K de línea</li>
          <li><strong>Quill.com</strong> (office supplies) — Net 30, fácil aprobar</li>
          <li><strong>Amazon Business Prime</strong> — Net 30 disponible</li>
        </ul>
        <p>Úsalos, páguelos EARLY (antes de net 30 = Paydex 80+), y en 6 meses tienes historial crediticio.</p>

        <h4>Paso 4 — Business Credit Cards (el corazón del sistema)</h4>
        <p>Después de 6 meses de tradelines, aplica a:</p>
        <ul>
          <li><strong>Amex Business Platinum ($695/año):</strong> 5x points en flights + hoteles, unlimited credit limit (no es "preset"), $200 Dell credit, $189 CLEAR, Centurion Lounge. Ideal para el contratista que compra $80K/año de equipment — los points pagan vacations familiares.</li>
          <li><strong>Amex Business Gold ($375/año):</strong> 4x points en top 2 categorías (gas, office supplies, etc). Mejor si no viajas.</li>
          <li><strong>Chase Ink Business Preferred ($95/año):</strong> 3x on travel/shipping/advertising hasta $150K/año. El "starter" perfecto — sign-up bonus $900.</li>
          <li><strong>Capital One Spark Cash Plus:</strong> 2% cashback unlimited. El workhorse.</li>
          <li><strong>Home Depot Commercial Revolving:</strong> 0% financing promotions, reporta a business bureaus.</li>
        </ul>
        <p>Regla de oro: <strong>NUNCA uses tu tarjeta personal para compras de business</strong>. Aunque "te den más points". No vale la pena por el veil piercing.</p>

        <h4>Paso 5 — SBA 7(a) Loan vs Business Line of Credit</h4>
        <p><strong>SBA 7(a):</strong> préstamo hasta $5M, term 10 años (working capital) o 25 años (real estate), tasa Prime + 2.75% a 4.75%. El gobierno garantiza el 75-85% al banco, por eso aprueban casos que regular banks rechazan. Ideal para: comprar un competidor, comprar tu propio building, expandir a 2 ubicaciones. Requisitos: 2 años de tax returns, personal credit 680+, 10% down payment. <strong>Lento (60-90 días)</strong> pero el mejor costo de capital.</p>
        <p><strong>Business Line of Credit ($25K-$250K):</strong> pre-approved, pides y pagas como tarjeta. Tasa Prime + 1-5%. Ideal para working capital, cash flow gaps, aprovechar descuentos de supplier. <strong>Rápido (2-7 días)</strong>. Bancos: Chase, BoA, Wells Fargo, Bluevine, Fundbox.</p>
        <p>Estrategia: ten AMBOS. Line of credit para el día a día, SBA 7(a) para expansión estratégica.</p>

        <h4>Por qué NO usar crédito personal para el business</h4>
        <ul>
          <li><strong>Veil piercing:</strong> juez te demanda personalmente por deudas del business</li>
          <li><strong>Personal utilization:</strong> $20K en tu Visa personal mata tu FICO 100 puntos</li>
          <li><strong>Tax mess:</strong> mezclar gastos requiere re-categorizar en QBO — bookkeeper cobra 2x</li>
          <li><strong>No building business credit:</strong> en 5 años sigues sin historial corporativo</li>
        </ul>
      `,
      keyPoints: [
        'DUNS Number gratis en D&B — es el SSN de tu business',
        'Nav.com monitorea Paydex, Intelliscore, FICO SBSS gratis',
        'Construye 5-6 tradelines Net-30 antes de pedir tarjetas',
        'Amex Biz Platinum $695/año se paga solo si compras $80K+/año',
        'SBA 7(a) hasta $5M con Prime + 2.75-4.75% (60-90 días)',
        'Line of Credit $25K-$250K para working capital (2-7 días)',
        'NUNCA mezcles personal y business — veil piercing te expone la casa'
      ],
      realTalk: '"El 90% de los contratistas latinos que conozco todavía compran el condenser de Ferguson con su Visa personal. Y se quejan de que el banco les negó el loan. El banco no te da un loan de $200K a un business sin historia crediticia — le das el loan a una PERSONA, y tu score personal está jodido porque tiene 80% utilization en personal cards. Sepáralo desde el día 1."',
      checklist: [
        'LLC o S-Corp registrada con Secretario de Estado CA',
        'EIN del IRS obtenido',
        'DUNS Number de D&B (gratis, 30 días)',
        'Cuenta Nav.com activa para monitoring',
        '5-6 tradelines Net-30 pagados a tiempo por 6 meses',
        'Business credit card primaria (Amex Biz o Chase Ink)',
        'Business Line of Credit aprobado ($25K-$100K mínimo)',
        'Separación absoluta: cero compras personal con card business y viceversa'
      ],
      commonMistakes: [
        'Usar Visa personal para gas del truck — utilization alto + veil piercing',
        'Aplicar a 10 cards el mismo día — hard pulls matan el score',
        'No pagar el Home Depot Commercial antes de net 30 — Paydex baja',
        'Pensar que LLC registrada = ya tengo crédito (no, hay que construirlo)',
        'Co-signar personal guarantee pensando que se quita después (casi nunca)'
      ]
    },
    {
      id: 'pricing-math',
      heading: 'Pricing Math — Revenue, Gross Profit, Net, y Burden',
      body: `
        <p>La razón #1 por la que contratistas HVAC están quebrados a pesar de "trabajar mucho" es porque <strong>cotizaron mal</strong>. Ponen el precio basado en "lo que cobra el vecino" o "lo que el cliente va a aceptar". Eso no es pricing — eso es adivinar. El pricing real se construye de abajo hacia arriba: costo verdadero + markup + overhead allocation + target margin. Si no sabes la diferencia entre Revenue, Gross Profit y Net Profit, estás volando a ciegas.</p>

        <h4>Los 3 niveles de profit — y por qué importan</h4>
        <ul>
          <li><strong>Revenue (ventas totales):</strong> $800,000 al año. Esto es lo que facturas. Cero mérito — es vanity.</li>
          <li><strong>Gross Profit (revenue − COGS):</strong> $800K − $440K de equipment/materials/direct labor = $360K GP (45% gross margin). Esto es lo que te queda para pagar overhead + profit.</li>
          <li><strong>Net Profit (GP − Overhead):</strong> $360K − $280K (rent, insurance, office salaries, marketing, trucks, CPA, software) = $80K net profit (10% net margin). <strong>Este es el número que importa.</strong></li>
        </ul>
        <p>Benchmarks industria HVAC residencial saludable: Gross margin 40-50%, Net margin 8-15%. Si tu net es menos de 5%, estás trabajando gratis. Si es menos de 3%, estás perdiendo dinero (porque no te pagas a ti mismo un salario de mercado).</p>

        <h4>Labor Burden — el error que mata contratistas</h4>
        <p>Le pagas a tu tech $30/hora. El tech te cuesta $30/hora, ¿verdad? <strong>NO.</strong> Te cuesta mínimo $42-$45/hora cuando le sumas el "burden":</p>
        <ul>
          <li>Workers Comp HVAC (C-20 code 5537): 6-12% del wage = $2.40/hr si está al 8%</li>
          <li>FICA employer portion: 7.65% = $2.30/hr</li>
          <li>FUTA + SUTA: ~1% = $0.30/hr</li>
          <li>Liability insurance alocada: ~$1.50/hr</li>
          <li>Health insurance (si ofreces): $4-6/hr</li>
          <li>Vacaciones + holidays pagadas: ~$2/hr</li>
          <li>Truck, tools, uniforms, phone: $3-5/hr</li>
        </ul>
        <p>Total burden: <strong>1.3x a 1.5x del wage base</strong>. Un tech a $30/hr realmente te cuesta $39-$45/hr. Si cotizaste el job a $30/hr de labor, estás perdiendo $9-$15/hr por cada hora facturada. <strong>Labor en tu estimate SIEMPRE es wage × 1.4 mínimo.</strong></p>

        <h4>Material Markup — 40-50% no es opcional</h4>
        <p>Un condenser Carrier que te cuesta $2,800 en Ferguson NO se vende al cliente a $2,800 + instalación. Se vende a <strong>$3,920-$4,200</strong> (markup del 40-50%). ¿Por qué? Porque tú:</p>
        <ul>
          <li>Financiaste la compra (si pagaste con card = 2% processing fee + potential interest)</li>
          <li>Transportaste el equipo (truck, gas, tiempo)</li>
          <li>Almacenaste el equipo si aplica</li>
          <li>Corres el riesgo de warranty claim</li>
          <li>Lo instalas con 10 años de expertise técnica</li>
        </ul>
        <p>El cliente Googlea "Carrier 25VNA424 price" y encuentra $2,800 y se enoja. Tu respuesta: "Ese es el precio wholesale contractor. El precio instalado con warranty + permit + startup es $X." Punto. El que quiera $2,800 que lo compre online y lo instale solo.</p>

        <h4>Overhead Allocation — cómo distribuir el rent, insurance, office</h4>
        <p>Tus costos fijos (overhead) son $280K/año = $23,333/mes. ¿Cómo los meto en mi pricing? Dos métodos:</p>
        <ul>
          <li><strong>% of revenue method:</strong> Overhead ($280K) / Revenue target ($800K) = 35%. Cada dólar facturado carga 35¢ de overhead. Simple pero impreciso.</li>
          <li><strong>Per-billable-hour method:</strong> Overhead ($280K) / Billable hours totales (4,200 hrs entre 3 techs) = $66.67/hora. Cada hora facturada debe tener $66.67 de overhead embedded + labor burden + profit target = tu rate final.</li>
        </ul>
        <p>Ejemplo de rate calculation: Tech wage $30 × 1.4 burden = $42 + $66.67 overhead + $20 profit target = <strong>$128/hr billing rate</strong>. Si tu competidor cobra $85/hr, está perdiendo dinero — su modelo va a colapsar. No cotices al nivel de un contratista que va a quebrar.</p>

        <h4>Fórmula rápida — Total Cost × Markup</h4>
        <p>Para un install residencial: (Equipment + Materials) × 1.45 + (Labor hours × $128 billing rate) + Permits + 10% contingency = Your quote. Si ese número asusta al cliente, no es tu cliente — es cliente de un contratista barato que va a quebrar en 18 meses.</p>
      `,
      keyPoints: [
        'Net margin saludable HVAC residencial: 8-15% (menos de 5% = trabajar gratis)',
        'Gross margin target: 40-50%',
        'Labor burden = wage × 1.3 a 1.5 (workers comp + FICA + benefits)',
        'Material markup: 40-50% mínimo, no es negociable',
        'Overhead por hora billable = $50-$80 en operation típica',
        'Billing rate = (wage × 1.4) + overhead/hr + profit target',
        'Revenue es vanity, profit is sanity, cash is king'
      ],
      realTalk: '"Un tech a $30/hr no te cuesta $30/hr — te cuesta $42. Si cotizas labor a $30 estás pagándole al cliente para que te deje trabajar. He visto contratistas vender jobs de $8K con costo real de $8,200 y celebrar la "venta". Es matemáticamente imposible hacer dinero con esa lógica. Aprende el burden o muere."',
      checklist: [
        'Gross margin calculado mensualmente en QBO (target 40-50%)',
        'Net margin tracking (target 8-15%)',
        'Labor burden rate documentado (wage × 1.4 mínimo)',
        'Material markup estandarizado (40-50%) en cotizador',
        'Overhead per billable hour calculado anualmente',
        'Billing rate ajustado cada 6 meses por inflation',
        'Benchmark contra industry reports (Service Roundtable, ACCA)',
        'Los 3 números (Rev, GP, Net) en un dashboard visible semanalmente'
      ],
      commonMistakes: [
        'Cotizar labor al wage del tech sin burden (pierdes $12/hr)',
        'Material sin markup porque "el cliente sabe el precio online"',
        'No incluir overhead en el rate — sales en déficit cada job',
        'Copiar el precio del competidor (que a lo mejor está quebrando)',
        'Competir por precio en lugar de valor (warranty, speed, reputation)'
      ]
    },
    {
      id: 'tax-strategy',
      heading: 'Tax Strategy — S-Corp, Section 179, y el Arte de Pagar Menos Legalmente',
      body: `
        <p>Pagar más impuestos de los que legalmente debes es masoquismo fiscal. El código tributario de EE.UU. está diseñado para recompensar a los business owners que usan estructuras correctas. Un contratista HVAC que factura $400K como sole proprietor paga alrededor de $45K-$55K más en impuestos al año que el mismo contratista estructurado como S-Corp con las deducciones correctas. Ese delta — $50K — es la diferencia entre pagarse un Tesla Model 3 en cash cada año o seguir rentando tools.</p>

        <h4>S-Corp Election — la jugada más importante</h4>
        <p>Como sole prop o LLC single-member, TODO tu profit paga <strong>15.3% Self-Employment tax</strong> (Social Security 12.4% + Medicare 2.9%) además del income tax federal y estatal. Ganas $150K profit = pagas $22,950 en SE tax SOLO.</p>
        <p>Con S-Corp election (file Form 2553 al IRS), te divides en dos:</p>
        <ul>
          <li><strong>Salario "razonable":</strong> te pagas $80K/año como W2 (paga FICA 15.3% = $12,240)</li>
          <li><strong>Distribution:</strong> los otros $70K de profit salen como "distribution" — <strong>NO paga SE tax/FICA</strong></li>
        </ul>
        <p>Ahorro: $70K × 15.3% = <strong>$10,710/año en SE tax evitado legalmente</strong>. Y es recurrente — cada año.</p>
        <p><strong>Reasonable salary rule:</strong> el IRS requiere que tu W2 salary sea "razonable" para tu rol. Un master HVAC contractor en California razonablemente gana $70K-$100K como W2. No te pagues $20K y distribuyas $130K — el IRS te audita y re-caracteriza todo como salario (+ penalties). Regla práctica: tu W2 debe ser mínimo 40-50% del profit total, o el equivalente de mercado de tu rol (mira salary.com para "HVAC Service Manager").</p>
        <p>S-Corp tiene costos: tax return es Form 1120-S (más caro que Schedule C — CPA cobra $1,200-$1,800 vs $500). Payroll obligatorio (Gusto $40/mo). Pero la matemática domina: si haces $100K+ profit, S-Corp gana siempre.</p>

        <h4>Section 179 — Depreciación Acelerada de Trucks y Equipment</h4>
        <p>Section 179 del IRS code te permite <strong>depreciar al 100% en el año 1</strong> hasta $1,220,000 en equipment (límite 2026, indexado a inflación). Esto incluye:</p>
        <ul>
          <li><strong>Trucks >6,000 lbs GVWR</strong> (importante — "heavy SUVs y trucks"): Ford F-250, Ram 2500, Silverado 3500, cargo vans como Mercedes Sprinter o Ford Transit 350. Si el GVWR (en la puerta del driver) es ≥ 6,000 lbs, 100% deducible en el año 1, límite $31,300 para SUV/trucks-no-camión, $Unlimited para cargo vans y trucks de trabajo.</li>
          <li><strong>Vehicles <6,000 lbs GVWR</strong> (sedans, compact SUVs): limit de $20,400 year 1 depreciation (reducido).</li>
          <li><strong>Equipment HVAC:</strong> recovery machines, vacuum pumps, manifolds, leak detectors, ladders, tools. 100% deducible hasta el cap.</li>
          <li><strong>Office equipment:</strong> computers, printers, furniture.</li>
          <li><strong>Software:</strong> ServiceTitan, QBO (si annual license).</li>
        </ul>
        <p>Estrategia real: si en diciembre ves que hiciste $180K de profit, compra un Ford Transit cargo van por $52K antes del 12/31. <strong>Todo el $52K deduce en ese año</strong>, bajas tu taxable income a $128K, ahorras ~$18K en impuestos. El van lo pagas en 5 años pero la deducción la tomas AHORA.</p>
        <p><strong>Bonus Depreciation:</strong> En 2026 está al 40% para assets >20 años de vida. Se usa combinado con 179.</p>

        <h4>Home Office Deduction — sí, aplica</h4>
        <p>Si usas un cuarto de tu casa EXCLUSIVAMENTE para negocio (office con desk, dispatch, storage de paperwork), puedes deducir:</p>
        <ul>
          <li><strong>Simplified method:</strong> $5/sq ft hasta 300 sq ft = $1,500 max/año. Fácil, no requires documentation.</li>
          <li><strong>Actual expense method:</strong> % de la casa × (utilities + mortgage interest + property tax + depreciation + repairs). Si tu office es 200 sq ft en casa de 2,000 sq ft = 10%. Si gastos anuales de casa son $40K = $4,000 deduction.</li>
        </ul>
        <p>Ojo: exclusivo significa exclusivo. No puede ser el cuarto donde también duermen los niños. El IRS audita esto.</p>

        <h4>Mileage vs Actual Expenses — elige uno</h4>
        <p><strong>Standard Mileage (2026): $0.70/mile</strong> (ajustado cada año IRS). Simple — tracker con MileIQ o Everlance, fin de año reportas miles. Recomendado si manejas <20K miles/año y el truck es relativamente económico.</p>
        <p><strong>Actual Expense:</strong> tracking de todo — gas, oil, tires, insurance, registration, depreciation o lease. Más trabajo pero gana si manejas truck caro (F-250 Diesel, >30K miles/año). Business use % aplica (si manejas 80% business / 20% personal, deduces 80% de los actuals).</p>
        <p>Regla IRS: elige un método el primer año que pones el vehículo en servicio. No puedes ir y venir entre los dos métodos libremente.</p>

        <h4>R&D Credit — sí, contractores califican</h4>
        <p>La mayoría de contratistas no saben que si <strong>desarrollan procesos propios</strong> (ductwork design software custom, installation procedures documented, energy efficiency modeling), pueden calificar para el R&D Tax Credit (Section 41). Crédito dollar-for-dollar contra income tax — NO deducción. Un contratista que gasta $40K en desarrollo de un sistema de IAQ proprietary puede reclamar $8K-$12K en credit. Requiere un CPA que entienda R&D studies (Alliantgroup, ADP R&D, o boutique).</p>
      `,
      keyPoints: [
        'S-Corp election ahorra $10K+/año en SE tax si haces $100K+ profit',
        'Reasonable salary rule: W2 debe ser 40-50% del total profit mínimo',
        'Section 179: trucks >6,000 lbs GVWR = 100% deducible año 1 (cargo vans)',
        'Trucks <6,000 lbs cap $20,400 year 1 depreciation',
        '$1.22M Section 179 limit en 2026 (total equipment)',
        'Mileage 2026: $0.70/mile standard method',
        'Home office: $5/sq ft simplified hasta $1,500 o actual % method',
        'R&D Credit disponible para contractors con procesos custom'
      ],
      realTalk: '"Un contratista en Fresno me dijo el año pasado: \\"yo pago como $38K de impuestos al año.\\" Le pregunté: \\"¿eres S-Corp?\\". Respuesta: \\"No sé, mi contador me hace Schedule C.\\" El CPA era su tío. Lo puse con un CPA real, hicimos S-Corp election, compramos un Sprinter van en diciembre con Section 179. Ahorró $22K ese año. El tío sigue molesto; el contratista compró otro truck con ese ahorro."',
      checklist: [
        'S-Corp election (Form 2553) filed si profit >$80K/año',
        'Reasonable salary documentado (salary.com benchmark)',
        'Payroll W2 a ti mismo en Gusto',
        'Section 179 estrategia: revisión en octubre para Q4 purchases',
        'Trucks de trabajo ≥6,000 lbs GVWR cuando se puede',
        'Home office medido y documentado con fotos',
        'Mileage tracker (MileIQ/Everlance) activo desde día 1 del año',
        'CPA con experiencia en construction + R&D contratado'
      ],
      commonMistakes: [
        'Seguir como Schedule C cuando ya haces $150K+ profit (desperdiciando $15K/año)',
        'Pagarse salario S-Corp de $20K (unreasonable — IRS audit)',
        'Comprar un BMW X3 pensando que es Section 179 (es <6,000 lbs, cap $20K)',
        'No trackear mileage Jan-Jun y querer "estimarlo" al fin de año',
        'Mezclar home office con cuarto de niños — pierdes la deducción en audit'
      ]
    },
    {
      id: 'retirement-wealth',
      heading: 'Retiro y Wealth — Convierte el Cash de Hoy en Wealth de Mañana',
      body: `
        <p>El contratista típico se mata trabajando 30 años, llega a los 65, y tiene $120K en una IRA que le dura 4 años. No porque no ganó dinero — ganó millones en bruto — sino porque nunca separó sistemáticamente para retirement y nunca aprovechó los vehículos fiscales que el gobierno les da a los business owners. Como self-employed contractor tienes acceso a los mejores retirement plans de EE.UU. — mejores que cualquier W2 employee corporativo. Úsalos.</p>

        <h4>Solo 401(k) — el rey de los self-employed</h4>
        <p>Si eres owner-only (o con spouse trabajando también) sin otros empleados, el <strong>Solo 401(k)</strong> es el vehículo más poderoso. Límites 2026:</p>
        <ul>
          <li><strong>Employee deferral:</strong> $23,500 (o $31,000 si 50+ con catch-up)</li>
          <li><strong>Employer contribution:</strong> 25% del W2 salary (si S-Corp) o 20% del net SE income (si sole prop)</li>
          <li><strong>Total combined cap:</strong> <strong>$70,000</strong> ($77,500 si 50+)</li>
        </ul>
        <p>Ejemplo: S-Corp con $80K W2 salary. Employee deferral $23,500 + Employer 25% × $80K = $20,000 → total $43,500 en el Solo 401(k). Todo pre-tax (o Roth para algunos planes). Setup en Fidelity, Schwab, o E*TRADE — gratis, sin annual fees.</p>
        <p>Bonus: puedes tomar <strong>loan del Solo 401k hasta $50K</strong> para emergencias del negocio (compra de truck, working capital), pagándote a ti mismo el interés.</p>

        <h4>SEP-IRA — simplicidad si tienes empleados</h4>
        <p>Si tienes 1-5 empleados y Solo 401k no funciona (hay que ofrecerlo a empleados también), considera <strong>SEP-IRA</strong>. Contribution: hasta 25% de compensation ($69,000 cap 2025, ~$70K 2026). Más simple — sin 5500 filings, sin vesting, todo contribution del empleador.</p>
        <p>Problema: debes contribuir el MISMO % para todos los empleados elegibles. Si te pones 25% a ti, tienes que poner 25% a cada tech. Eso hace SEP caro una vez que tienes staff.</p>

        <h4>Roth vs Traditional — el debate</h4>
        <ul>
          <li><strong>Traditional (pre-tax):</strong> deduces la contribution HOY de tu income, crece tax-free, pagas income tax al retirar. Mejor si crees que tu tax bracket actual es ALTO y será MENOR en retirement.</li>
          <li><strong>Roth (post-tax):</strong> pagas tax HOY, crece tax-free, retiras TAX-FREE forever. Mejor si crees que tu tax bracket SUBIRÁ en retirement (o si tienes 30+ años de compounding — el tax-free growth es absurdamente poderoso).</li>
        </ul>
        <p>Estrategia híbrida: para la mayoría de contratistas en 22-24% bracket federal ahora, divide 60% Traditional / 40% Roth en el Solo 401k. La diversificación fiscal te protege de cambios futuros en tax law.</p>

        <h4>Cash Balance Pension Plan — para high earners ($300K+)</h4>
        <p>Si eres 45+ años con $300K-$800K de profit anual y ya maxed out Solo 401k, el <strong>Cash Balance Pension Plan</strong> permite contribuciones de <strong>$200K-$350K/año</strong> adicionales (dependiendo de edad y salary). Es un defined benefit plan — actuary calcula la contribución basada en el retirement benefit target.</p>
        <p>Setup cuesta $2,500-$5,000 y requiere administración anual ~$2K. Pero si estás en 37% federal + 13.3% CA = 50% marginal rate, meter $200K pre-tax ahorra $100K en taxes HOY. Se combina con Solo 401k hasta techos de $350K+ combinados.</p>

        <h4>Self-Directed IRA (SDIRA) — Real Estate dentro de IRA</h4>
        <p>SDIRAs te permiten usar los fondos de tu IRA para comprar <strong>real estate, private equity, tax liens, precious metals</strong> — NO solo stocks/bonds. Ejemplo: tienes $150K en una traditional IRA. Abres SDIRA en Equity Trust o Rocket Dollar, transferes los $150K. Compras un duplex de $400K con $100K down (el resto mortgage dentro del SDIRA). El rental income y appreciation crecen tax-deferred dentro de la IRA. Al retirarte a los 65, vendes y pagas income tax solo al retirar.</p>
        <p>Restrictions CRÍTICAS:</p>
        <ul>
          <li>No puedes vivir en la propiedad (prohibited transaction)</li>
          <li>No puedes rentarla a parientes directos (padres, hijos, spouse)</li>
          <li>No puedes "sweat equity" — arreglar la propiedad tú mismo (debes hire contractor)</li>
          <li>Todos los expenses pagados desde el SDIRA, todos los ingresos de vuelta al SDIRA</li>
        </ul>
        <p>Es complejo pero para contratistas con skills de real estate es poderoso. Consulta un CPA especializado en SDIRAs antes de hacerlo.</p>

        <h4>El plan de 10-20-70 para contratistas</h4>
        <p>De cada dólar de profit, la regla práctica:</p>
        <ul>
          <li><strong>10% → Retirement</strong> (Solo 401k contribution)</li>
          <li><strong>20% → Tax reserve</strong> (savings account separada para IRS/FTB en abril)</li>
          <li><strong>70% → Operations + personal lifestyle</strong></li>
        </ul>
        <p>Si haces $200K de profit al año por 25 años con 7% retorno promedio en el Solo 401k, terminas con <strong>$1.35M</strong> en retirement. Eso es un retirement real, no sobrevivir con Social Security.</p>
      `,
      keyPoints: [
        'Solo 401(k) cap 2026: $70,000 total ($77,500 si 50+)',
        'SEP-IRA cap ~$70K pero obliga igual % a empleados',
        'Traditional = tax break hoy; Roth = tax-free forever (mejor para <40 años)',
        'Cash Balance Pension permite $200K-$350K/año adicional para 45+',
        'SDIRA permite real estate dentro de IRA con restricciones estrictas',
        'Regla 10-20-70: 10% retirement, 20% taxes, 70% operations+lifestyle',
        '$200K profit × 25 años × 7% return = $1.35M en Solo 401k'
      ],
      realTalk: '"Mi tío contratista trabajó 38 años, facturó $20M acumulados en su carrera, y se retiró con $180K en una IRA que se le acabó en 5 años. Vive de su casa pagada + Social Security $2,100/mes. No porque no ganó el dinero — lo ganó. No separó. No conocía el Solo 401k. Si hubiera puesto $30K/año pre-tax desde los 30, hoy tendría $3.2M. No repitas esa historia."',
      checklist: [
        'Solo 401(k) abierto en Fidelity/Schwab (gratis, 1 día)',
        'Contribución automática mensual programada (direct deposit)',
        'Mix Traditional/Roth definido (ej: 60/40)',
        'Tax reserve account separada (20% del profit mensual)',
        'SEP-IRA considerado si tienes empleados (después de Solo 401k)',
        'Cash Balance Plan evaluado si profit >$300K y edad 45+',
        'SDIRA considerado si planeas invertir en real estate',
        'Beneficiaries designados en todos los accounts'
      ],
      commonMistakes: [
        'Esperar hasta los 50 para empezar — pierdes 20 años de compounding',
        'Contribuir solo a Roth IRA personal ($7K cap) ignorando Solo 401k ($70K cap)',
        'No separar 20% para taxes — en abril vendes el truck para pagar IRS',
        'Usar SDIRA y "arreglar" la propiedad tú mismo (prohibited transaction)',
        'Pensar que la casa es el retirement plan — cuando la vendes es otra casa'
      ]
    }
  ],
  resources: [
    { label: 'IRS — Form 2553 S-Corp Election', url: 'https://www.irs.gov/forms-pubs/about-form-2553' },
    { label: 'IRS — Section 179 Deduction Overview', url: 'https://www.irs.gov/publications/p946' },
    { label: 'IRS — Form 941 Employer Quarterly', url: 'https://www.irs.gov/forms-pubs/about-form-941' },
    { label: 'IRS — Form 940 FUTA', url: 'https://www.irs.gov/forms-pubs/about-form-940' },
    { label: 'IRS — Standard Mileage Rates', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates' },
    { label: 'IRS — Retirement Plans for Small Business', url: 'https://www.irs.gov/retirement-plans/retirement-plans-for-self-employed-people' },
    { label: 'EDD California — Employer Services', url: 'https://edd.ca.gov/en/Payroll_Taxes/' },
    { label: 'EDD — DE 9 / DE 9C Quarterly Filing', url: 'https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/' },
    { label: 'California AB 5 / ABC Test', url: 'https://www.dir.ca.gov/dlse/faq_independentcontractor.htm' },
    { label: 'QuickBooks Online for Contractors', url: 'https://quickbooks.intuit.com/industry/contractors/' },
    { label: 'Gusto Payroll for HVAC', url: 'https://gusto.com/product/payroll' },
    { label: 'ADP RUN Small Business Payroll', url: 'https://www.adp.com/what-we-offer/products/adp-run.aspx' },
    { label: 'Nav — Business Credit Monitoring', url: 'https://www.nav.com/' },
    { label: 'Dun & Bradstreet — DUNS Number (free)', url: 'https://www.dnb.com/duns-number.html' },
    { label: 'SBA — 7(a) Loan Program', url: 'https://www.sba.gov/funding-programs/loans/7a-loans' },
    { label: 'SBA — Lender Match Tool', url: 'https://www.sba.gov/funding-programs/loans/lender-match' },
    { label: 'Amex Business Cards Comparison', url: 'https://www.americanexpress.com/us/credit-cards/business/' },
    { label: 'Chase Ink Business Preferred', url: 'https://creditcards.chase.com/business-credit-cards/ink/business-preferred' },
    { label: 'Fidelity Solo 401(k)', url: 'https://www.fidelity.com/retirement-ira/small-business/self-employed-401k/overview' },
    { label: 'Equity Trust — Self-Directed IRA', url: 'https://www.trustetc.com/' },
    { label: 'CSLB — Contractor License Home', url: 'https://www.cslb.ca.gov/' },
    { label: 'ACCA — HVAC Contractor Resources', url: 'https://www.acca.org/' }
  ],
  glossary: [
    { term: 'COGS (Cost of Goods Sold)', definition: 'Costos directos de generar revenue: equipment, materials, direct labor, subcontractors, permits. No incluye overhead.' },
    { term: 'Gross Margin', definition: '(Revenue − COGS) / Revenue. Target HVAC residencial: 40-50%. Es el dinero disponible para pagar overhead + profit.' },
    { term: 'Net Margin', definition: '(Revenue − COGS − Overhead) / Revenue. Target HVAC saludable: 8-15%. El número que REALMENTE importa.' },
    { term: 'Accounts Receivable (AR)', definition: 'Dinero que clientes te deben por trabajo ya facturado. "Money on paper" — no está en tu cuenta hasta que cobras.' },
    { term: 'AR Aging', definition: 'Reporte que agrupa AR por edad: 0-30, 31-60, 61-90, 90+ días. Si >10% está en 60+, tienes problema de cobranza.' },
    { term: 'DSO (Days Sales Outstanding)', definition: 'Promedio de días que tardas en cobrar. Fórmula: (AR / Revenue anual) × 365. Target HVAC: <35 días residencial, <50 días commercial.' },
    { term: 'Cash Flow', definition: 'Movimiento real de dinero entrando y saliendo de tu cuenta. Distinto a profit — cash flow es el hecho, profit es la opinión.' },
    { term: 'Labor Burden', definition: 'Costo total de un empleado más allá del wage base: workers comp + FICA + FUTA/SUTA + benefits + truck + tools. Típicamente 1.3x-1.5x wage.' },
    { term: '1099-NEC', definition: 'Formulario para reportar pagos ≥$600/año a independent contractors. Due al IRS y al contractor el 1/31.' },
    { term: 'W2', definition: 'Formulario anual para employees. Reporta wages + taxes retenidos. Due 1/31 al empleado y SSA.' },
    { term: 'FICA', definition: 'Federal Insurance Contributions Act. Social Security (6.2%) + Medicare (1.45%). Empleado y empleador pagan cada uno, total 15.3%.' },
    { term: 'FUTA', definition: 'Federal Unemployment Tax Act. 6% on first $7K por empleado; efectivo 0.6% si pagaste state UI a tiempo.' },
    { term: 'SUTA / UI', definition: 'State Unemployment Tax. En CA: 3.4% nuevo, 0.5-6.2% después de 3 años basado en "experience rating".' },
    { term: 'SDI (California)', definition: 'State Disability Insurance. 1.2% del wage bruto sin cap (desde 2024). Pagado por el EMPLEADO (withheld del paycheck).' },
    { term: 'S-Corp', definition: 'Subchapter S Corporation. Pass-through entity que permite split de profit entre salary (paga FICA) y distribution (no paga SE tax). Ahorra 15.3% SE tax sobre distributions.' },
    { term: 'Section 179', definition: 'IRS code que permite deducir al 100% en el año 1 hasta $1.22M (2026) en equipment. Incluye trucks >6,000 lbs GVWR.' },
    { term: 'Bonus Depreciation', definition: 'Deducción adicional a Section 179, al 40% en 2026 para assets con vida útil >20 años. Se aplica después de Section 179.' },
    { term: 'Self-Employment Tax (SE Tax)', definition: '15.3% total (12.4% SS + 2.9% Medicare) sobre net earnings de self-employed. S-Corp election elimina SE tax sobre distributions.' },
    { term: 'Solo 401(k)', definition: 'Retirement plan para self-employed sin empleados (o solo spouse). Cap 2026: $70K total ($77.5K si 50+).' },
    { term: 'SEP-IRA', definition: 'Simplified Employee Pension IRA. Cap 25% de compensation (~$70K 2026). Obliga mismo % a empleados.' },
    { term: 'DUNS Number', definition: 'Identificador único de 9 dígitos emitido por Dun & Bradstreet. Gratis, 30 días. Requisito para construir business credit.' },
    { term: 'Paydex Score', definition: 'Score de D&B de 0-100 midiendo pago a suppliers. 80+ = excelente. Paga EARLY (antes de Net 30) para subirlo.' },
    { term: 'Chart of Accounts (COA)', definition: 'Estructura de categorías contables. Para HVAC: Income 4000s, COGS 5000s, Expenses 6000s.' },
    { term: 'Job Costing', definition: 'Tracking de revenue y costos por cada job individual. En QBO se hace con "Projects". Revela jobs rentables vs no rentables.' },
    { term: 'ABC Test (AB 5)', definition: 'California test para determinar si trabajador es 1099 o W2. Debe cumplir A (libre de control), B (fuera del negocio del hiring entity), C (business propio establecido). HVAC techs casi siempre fallan B.' }
  ]
};
