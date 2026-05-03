// ============================================================
// ACVOLT Business Academy — Bloque 5: Contratacion y Filtrado
// Como contratar y filtrar tecnicos HVAC sin perder $50K
// Autor: Mario Flores / ACVOLT
// ============================================================

window.CONTRACTOR_BLOQUE_5 = {
  number: 5,
  title: 'Contratacion y Filtrado',
  tagline: 'Contratar mal te cuesta $50K — aprende a filtrar',

  intro: `
    <p><strong>Compa, escucha bien:</strong> un <em>mal hire</em> en HVAC no es como un mal hire en una oficina. En oficina el tipo copia-pega mal un Excel y lo regañas. En HVAC, un tecnico malo te <strong>quema un compresor de $2,800</strong> en el primer service call, te <strong>recarga un sistema con el refrigerante equivocado</strong> (R-410A en un sistema R-22 = lawsuit), te <strong>olvida de asegurar un disconnect</strong> y el cliente se lleva un shock de 240V, o peor — se cae de un roof porque no sabe usar harness y tu <em>Workers Comp</em> te sube de $8,000 a $40,000 al ano.</p>

    <p>El costo verdadero de un mal hire en HVAC no es el sueldo que le pagaste. Es la <strong>suma de: ($45/hr × 160 horas al mes × labor burden 1.3-1.5x = $9,360-$10,800/mes) + callbacks ($400-$1,200 cada uno) + trucks destruidos + clientes perdidos + demanda en corte + CSLB complaint + upside perdido</strong>. El SHRM calcula que un mal hire cuesta <strong>30% del salario anual minimo</strong> — en HVAC yo he visto casos de $50K-$150K de perdida por un solo tecnico que escondio su DUI y choco el truck, o que mintio sobre su EPA 608 y ventilo 20 lbs de R-410A a la atmosfera (multa federal $2,500+ por violacion).</p>

    <p>Este bloque te ensena a <strong>filtrar antes de contratar</strong>, no despues. Vamos a cubrir: como escribir un job description honesto que cumpla California SB-1162 (pay range obligatorio), donde encontrar techs de verdad (Indeed vs ZipRecruiter vs trade schools vs union vs AcvoltSchool vs H-2B), como entrevistar con <strong>technical deep-dive</strong> (PT chart, wiring diagram, superheat), background checks con Checkr ($35-50/report) y E-Verify (gratis), drug testing legal en CA (marijuana es un dolor de cabeza), DOT medical card para trucks sobre 10,001 lbs GVWR, un plan de onboarding 30-60-90 dias que retiene tu talento, y 10 <em>red flags</em> que te van a ahorrar el proximo disaster.</p>

    <p><strong>Regla #1:</strong> Entrevista lento, despide rapido. "Hire slow, fire fast" no es un cliche — es matematica de cashflow. Un tecnico malo por 90 dias = $30K perdidos. Un puesto vacante por 90 dias = $15K perdidos. La ecuacion siempre favorece esperar al tech correcto.</p>

    <p><strong>Regla #2:</strong> Todo lo que diga el candidato, <em>verificalo</em>. EPA 608 se verifica en epa.gov. CSLB del employer anterior se verifica en cslb.ca.gov. DMV record se verifica con Checkr. Referencias se verifican llamando al <strong>supervisor directo</strong>, no al HR — y la pregunta magica es "<em>would you rehire him tomorrow?</em>" Si el supervisor titubea mas de 2 segundos, ya tienes tu respuesta.</p>

    <p class="warn"><strong>Real talk:</strong> En California las demandas de wrongful termination son una industria. Si despides sin documentacion escrita, sin performance improvement plan (PIP), sin warnings por escrito, el ex-empleado te puede demandar por $50K-$250K. Por eso el filtrado de entrada es el momento mas barato de decir "no" — todo lo que viene despues es caro.</p>
  `,

  sections: [

    // ========================================================
    // SECCION 1: JOB DESCRIPTION
    // ========================================================
    {
      id: 'job-description',
      heading: 'Job Description — Honestidad Legal y Estrategica',
      body: `
        <p>El <em>job description</em> no es un adorno — es un <strong>documento legal</strong> que define lo que el empleado va a hacer, cuanto le vas a pagar, que certificaciones necesita, y es la base contra la que se miden <strong>performance reviews, disciplinary actions, ADA accommodation requests y wrongful termination defenses</strong>. Un job description malo = abogado del otro lado te come vivo.</p>

        <p><strong>California SB-1162 (Pay Transparency Act, vigente desde 1 enero 2023):</strong> si tienes <strong>15 o mas empleados</strong>, estas <em>obligado por ley</em> a publicar el <strong>pay range</strong> (salary o hourly, con rango real) en cada job posting. Violacion: <strong>$100 a $10,000 por job posting</strong>, enforced por CA Labor Commissioner. Aunque tengas menos de 15 empleados, si un candidato te lo pide, debes proporcionarlo. <em>Ya no puedes decir "competitive pay" en el anuncio</em> — pon "$28-$42/hr DOE" o enfrenta la multa.</p>

        <h4>Anatomia de un job description que filtra y protege:</h4>
        <ol>
          <li><strong>Job title especifico:</strong> "HVAC Service Technician Level II" NO "HVAC Technician" a secas. El level comunica seniority y expectativas.</li>
          <li><strong>Company pitch de 2 lineas:</strong> quien eres, cuantos anos, cuantos trucks, que territorio cubres. Los tecnicos buenos comparan employers — vendete.</li>
          <li><strong>Essential functions:</strong> 8-12 bullets de lo que <em>esencialmente</em> va a hacer (install, service, diagnose, brazing, vacuum/charge, customer communication, paperwork). La palabra "essential" es clave legal — ADA solo obliga accommodation de <em>non-essential</em> functions.</li>
          <li><strong>Physical requirements:</strong> "lift 50 lbs, climb ladders to 20 ft, work in attics 120°F, kneel/crawl in crawl spaces." Sin esto pierdes defenses en ADA claims.</li>
          <li><strong>Minimum qualifications (must-haves):</strong> EPA 608 Universal o Type II minimo, CA driver license + clean record, 2+ anos service residential, habla ingles basico para manuals y wiring diagrams.</li>
          <li><strong>Preferred qualifications (nice-to-haves):</strong> NATE certification (North American Technician Excellence), R-410A especifico, brazing certification (AWS D10.10), bilingue espanol-ingles, experiencia con mini-splits inverter (Mitsubishi/Daikin/Fujitsu), HousecallPro/ServiceTitan, OSHA 10 o OSHA 30.</li>
          <li><strong>Pay range (SB-1162):</strong> "$28-$42/hr DOE + spiffs + overtime." Si ofreces commission o performance pay, tambien lo declaras.</li>
          <li><strong>Benefits:</strong> medical (Kaiser/Blue Cross), dental, 401k match %, PTO dias/ano, company truck, gas card, company phone, tool allowance anual, boot allowance, uniform.</li>
          <li><strong>Schedule:</strong> "M-F 7am-4pm, on-call rotation 1 semana de cada 4, overtime voluntario pagado time-and-a-half."</li>
          <li><strong>EEO statement:</strong> "Equal Opportunity Employer — no discriminamos por race, color, religion, sex, national origin, age, disability, genetic info, o veteran status." Obligatorio legal y te protege de claims.</li>
        </ol>

        <h4>Must-haves reales en California 2026 (no-negociables):</h4>
        <ul>
          <li><strong>EPA 608 Section 608 Technician Certification</strong> — federal, obligatoria para cualquiera que toque refrigerante. Universal preferred; minimo Type II (high-pressure). Verificas en <em>epa.gov/section608</em>.</li>
          <li><strong>California driver license clase C al minimo</strong> — con abstract DMV limpio (max 1 minor infraction en 3 anos). Tu seguro comercial lo exige.</li>
          <li><strong>OSHA 10 Construction</strong> — $49-$89, online, 10 horas. Muchos GCs y builders ya lo piden antes de dejarte entrar al jobsite.</li>
          <li><strong>Right-to-work docs I-9</strong> — SSN + photo ID, o green card, o EAD. Sin esto no puedes emplearlo legalmente bajo IRCA (Immigration Reform and Control Act 1986).</li>
        </ul>

        <h4>Nice-to-haves que valen pay bump:</h4>
        <ul>
          <li><strong>NATE certification</strong> — gold standard de la industria, examen de 4+ horas, renueva cada 2 anos. Paga +$2-$4/hr.</li>
          <li><strong>R-410A handling</strong> y experiencia con refrigerantes A2L (R-454B, R-32) — la transicion 2025-2026 los hace valiosos. Paga +$3-$5/hr.</li>
          <li><strong>Brazing AWS D10.10</strong> — certificacion formal de nitrogen-purged brazing. Separa el tech de $25/hr del tech de $38/hr.</li>
          <li><strong>Controls / BAS / IoT</strong> — Honeywell, Ecobee Pro, ConnectComfort, smart thermostats, Fieldpiece BLE tools (Job Link). +$3-$6/hr.</li>
          <li><strong>OSHA 30 General Industry</strong> — 30 horas vs 10, preferred para leads/foremen.</li>
        </ul>
      `,
      keyPoints: [
        'CA SB-1162 obliga pay range publicado en todo job posting si tienes 15+ empleados — multa $100-$10K por anuncio',
        'Labor burden real en CA es 1.3-1.5x del hourly rate (WC, FICA, FUTA, SUI, health, 401k, PTO)',
        'Essential functions es terminologia legal — define que debes accommodate bajo ADA y que no',
        'EPA 608 se verifica GRATIS en epa.gov/section608/608certified — ningun candidato deberia decir "lo perdi"',
        'Physical requirements escritos (50 lbs lift, ladders 20 ft, attics 120°F) te protegen en claims de disability',
        'Nunca uses "competitive pay" en CA — es automaticamente violacion SB-1162',
        'Un posting con pay range aumenta applicants qualified 40-60% segun LinkedIn data'
      ],
      realTalk: '"El tecnico que ve un anuncio de $28-$42/hr DOE y aplica es el que YA sabe cuanto vale y esta comparando. El que aplica a un anuncio sin pay range muchas veces es el que no tiene opciones. Piensalo — a quien quieres atraer?"',
      checklist: [
        { item: 'Job title con nivel especifico (Level I/II/III o Apprentice/Journey/Lead)', note: 'Define seniority y pay band' },
        { item: 'Pay range en formato "$X-$Y/hr DOE" publicado', note: 'SB-1162 obligatorio 15+ empleados' },
        { item: 'Essential functions separados de preferred', note: 'Terminologia ADA legal' },
        { item: 'Physical requirements escritos (lift, climb, attic temp)', note: 'Defensa en disability claims' },
        { item: 'Must-haves vs nice-to-haves claros', note: 'Acelera screening' },
        { item: 'EEO statement al final', note: 'Protege contra discrimination claims' },
        { item: 'Benefits detallados con porcentajes reales', note: '401k match %, PTO dias, tool allowance $' },
        { item: 'Schedule + on-call rotation + OT policy', note: 'Filtra a los que no quieren on-call' },
        { item: 'Reviewed por labor attorney o Gusto/Rippling HR template CA-compliant', note: 'No uses templates de Florida' }
      ],
      commonMistakes: [
        'Escribir "competitive pay" — violacion SB-1162 instant',
        'Omitir EPA 608 como must-have — luego le pides que se certifique en tu tiempo ($95 examen + $300 prep)',
        'Confundir essential con preferred — luego no puedes negar accommodation de algo "no esencial"',
        'Copy-paste de job description de otro estado — California tiene 40+ requisitos unicos',
        'No mencionar labor burden en tu pricing interno — contratas a $35/hr creyendo que cuesta $35/hr (cuesta $52.50)',
        'Omitir EEO statement — abogado del plaintiff lo usa como evidencia de intent discriminatorio'
      ]
    },

    // ========================================================
    // SECCION 2: WHERE TO FIND
    // ========================================================
    {
      id: 'where-to-find',
      heading: 'Donde Encontrar Tecnicos Reales (no curriculums inflados)',
      body: `
        <p>El 80% de los contratistas latinos en California <strong>solo postean en Indeed, se frustran con los applicants, y contratan al primero que llega</strong>. Eso es como pescar en un kiddie pool y quejarte de no agarrar atun. Los tecnicos buenos <em>ya tienen trabajo</em> — tienes que ir a <strong>varios pozos</strong> y construir un pipeline que te alimente constantemente.</p>

        <h4>1. Indeed — volumen alto, calidad media</h4>
        <p>Indeed tiene ~250M visitas al mes, es el 800-lb gorilla. Post gratis, pero <strong>sponsored posts</strong> ($0.10-$5.00 por click, tipico $150-$500/mes por puesto activo) suben al top. Resume database access ~$100-$250/mes para subscription Indeed Resume. <strong>Problema:</strong> 40-60% de applicants son "spray and pray" — aplican a 50 jobs por dia sin leer. Filtras rapido con <em>screening questions</em> ("Do you hold an active EPA 608 certification? Yes/No," "Do you have a clean CA driver license? Yes/No," "Are you willing to work on-call rotation? Yes/No"). Un "No" en cualquiera te ahorra 20 minutos de entrevista.</p>

        <h4>2. ZipRecruiter — AI matching, candidatos mas curados</h4>
        <p>ZipRecruiter usa AI para empujar tu posting a candidatos que ya tienen match de skills en su base. <strong>Costo:</strong> $299-$719/mes por job slot (2026), pero suele tener 30-50% menos spam que Indeed. Bueno para leads/senior techs.</p>

        <h4>3. Trade schools locales — el pipeline nadie usa</h4>
        <p>En California tienes mas de 40 HVAC trade schools acreditadas. <strong>Santa Ana College (Orange County)</strong>, <strong>Cypress College</strong>, <strong>Los Angeles Trade-Technical College</strong>, <strong>San Diego City College</strong>, <strong>Fresno City College</strong>, <strong>Modesto Junior College</strong>, <strong>Bay Valley Tech (Modesto)</strong>. Llama al Career Services office, ofrece <em>$500 de tool kit sponsorship</em> al graduating class, y te mandan resumes de students filtrados. Los apprentices cuestan $18-$22/hr pero tu los <em>moldeas</em> — despues de 2 anos te dan un tech leal por $30/hr en lugar de competir por uno de $42/hr.</p>

        <h4>4. HVAC trade unions (si eres union shop)</h4>
        <p>En California dominan: <strong>Sheet Metal Workers Local 104</strong> (Norte-CA), <strong>Local 105</strong> (Sur-CA), y <strong>UA Local 250</strong> (plumbers/pipefitters con HVAC cross-training). Los union halls tienen <em>out-of-work lists</em> y te mandan journeymen con certification verificada. <strong>Downside:</strong> prevailing wage (typico $55-$80/hr all-in en commercial), trust fund contributions, CBA rules. Solo hace sentido si compites en public works o grandes comerciales que pagan prevailing wage por ley (DIR Prevailing Wage Determinations).</p>

        <h4>5. AcvoltSchool pipeline — tu ventaja injusta</h4>
        <p>AcvoltSchool gradua tecnicos latinos bilingues con EPA 608 + fundamentos Manual J/S/D + troubleshooting real. Como contratista registrado en AcvoltSchool, tienes acceso a <strong>placement list</strong> pre-graduacion. Muchos graduates ya vienen pre-testeados en BLE tools (Fieldpiece Job Link), conocen tu marca, y estan dispuestos a empezar como <em>install helper</em> a $22-$26/hr con path claro a journeyman en 18-24 meses. Es el <em>single best pipeline</em> para contratistas latinos.</p>

        <h4>6. Referral bonuses a tus techs actuales — el mas rentable</h4>
        <p><strong>Formula:</strong> $500 al firmar + $500 a los 90 dias + $500 al ano. Total $1,500 per referred hire que se queda 1 ano. Esto te cuesta <strong>5-10x menos</strong> que un recruiter ($5K-$15K por placement) y los referrals tienen retencion 45% mas alta segun SHRM. Anuncialo formalmente cada Monday morning meeting, postealo en la <em>break room</em>, y pagalo en forma de bonus W-2 (no cash under the table — eso es labor violation).</p>

        <h4>7. H-2B visa (complicado pero real)</h4>
        <p><strong>H-2B</strong> permite traer trabajadores mexicanos para trabajo temporal <em>no-agricola</em> hasta 10 meses (renovable 3 anos max). En HVAC aplica para <em>seasonal peaks</em> (verano Inland Empire, Central Valley, Phoenix). Proceso: (1) DOL Prevailing Wage Determination ~30 dias, (2) Job Order con CA EDD 14-21 dias, (3) Recruitment US workers obligatorio ~30 dias, (4) ETA 9142B filing DOL ~60 dias, (5) USCIS I-129 $460+$150 fraud fee, (6) Consular interview en Ciudad Juarez/Monterrey + $190 visa fee. <strong>Costo realista:</strong> $3,500-$6,500 por trabajador con immigration attorney ($2K-$4K). <strong>Cap nacional:</strong> 66K visas (33K por semestre), agotado en semanas. Usa attorney <em>especializada en H-2B</em>, no general — errores cuestan $10K y 6 meses.</p>
      `,
      keyPoints: [
        'Indeed sponsored $150-$500/mes + screening questions filtran 60% del spam',
        'ZipRecruiter $299-$719/mes con AI matching = menos candidatos pero mas calificados',
        'Trade schools en CA (Santa Ana College, Cypress, LATTC, SDCC) = apprentices $18-$22/hr leales a largo plazo',
        'Union halls (Sheet Metal 104/105, UA 250) para prevailing wage en public works',
        'AcvoltSchool placement list = tecnicos latinos bilingues pre-testeados en BLE tools',
        'Referral bonuses $500+$500+$500 = mejor ROI de todos los canales (5-10x cheaper que recruiter)',
        'H-2B visa es real pero complicado — $3,500-$6,500/trabajador, cap de 66K nacional agotado en semanas'
      ],
      realTalk: '"El contratista que solo pone en Indeed y se enoja porque \'nadie quiere trabajar\' es el mismo que no ha llamado a Santa Ana College en 5 anos. Los techs buenos estan ahi — tu no los estas buscando donde estan. Construye 3-4 pipelines y nunca mas vas a tener una vacancy de 60+ dias."',
      checklist: [
        'Indeed con sponsored post + screening questions activos',
        'ZipRecruiter suscripcion activa para senior roles',
        'Contacto directo con Career Services de 2-3 trade schools locales',
        'Programa formal de referral bonus ($500+$500+$500) anunciado',
        'Registro activo en AcvoltSchool employer portal',
        'Relacion con union hall si haces public works',
        'Immigration attorney H-2B identificada si aplica tu temporada',
        'Pipeline tracking en CRM (HubSpot/Airtable) con source attribution',
        'Review mensual de source effectiveness — $ por hire y retencion por canal'
      ],
      commonMistakes: [
        'Depender solo de Indeed — pool demasiado general, mucho spam',
        'Ignorar trade schools locales — pipeline gratis que nadie usa',
        'Pagar referral bonus en cash — labor code violation (debe ser W-2)',
        'No hacer screening questions en Indeed — pierdes 15-20 min por entrevista spam',
        'Contratar immigration attorney general para H-2B — errores de $10K+',
        'Prometer H-2B en mayo para empezar en junio — el proceso toma 4-6 meses'
      ]
    },

    // ========================================================
    // SECCION 3: INTERVIEW PROCESS
    // ========================================================
    {
      id: 'interview-process',
      heading: 'Entrevista — Technical Deep-Dive, Job Simulation, Behavioral',
      body: `
        <p>La entrevista tipica "cuentame de ti, donde te ves en 5 anos" es <strong>basura</strong> para HVAC. Cualquier tecnico con pasaporte de BS te va a dar respuestas enlatadas. La unica forma de saber si sabe HVAC es <strong>ponerlo a hacer HVAC</strong> en tu oficina, en tu shop, o en un ride-along. Aqui va el proceso de 3 rondas que yo uso:</p>

        <h4>Ronda 1: Phone screen (15 minutos)</h4>
        <p>Quien la hace: tu, el dueno, o tu office manager entrenada. Objetivos: verificar must-haves basicos, filtrar red flags temprano.</p>
        <ul>
          <li>"Dime tu EPA 608 certification number y ano" — luego verificas en epa.gov/section608</li>
          <li>"En que companias has trabajado los ultimos 3 anos y por que saliste de cada una?" — escucha por patrones</li>
          <li>"Cual es tu expectativa de pago?" — si pide $50/hr y tu posting dice $28-$42, waste of time</li>
          <li>"Tienes tus propias herramientas basicas? Manifold, vacuum pump, multimeter?" — tech serio SI las tiene</li>
          <li>"Disponibilidad para on-call rotation, overtime y start date?" — filtra los que quieren 9-5 Lunes-Viernes</li>
          <li>"Tienes algo en tu driving record o criminal record que aparezca en background check?" — los honestos lo confiesan aqui, los deshonestos esconden y te ahorran tiempo cuando Checkr los pesca</li>
        </ul>

        <h4>Ronda 2: Technical interview en shop (45-60 minutos)</h4>
        <p>Aqui separas al <em>bullshitter</em> del tech real. Tienes que tener materiales listos en la mesa:</p>

        <p><strong>Ejercicio 1 — PT chart reading (5 min):</strong> Le pones enfrente una <em>pressure-temperature chart</em> de R-410A y le preguntas: "Si veo 118 psig en la suction line, cual es mi saturation temperature?" Respuesta correcta: ~40°F. Si se queda viendo el papel mas de 20 segundos, red flag. Luego subes: "Y si el sensor clamped dice 50°F en la suction line, que es mi superheat?" Respuesta: 50 - 40 = 10°F superheat. <em>Cualquier tech con 2+ anos real debe resolver esto en 30 segundos.</em></p>

        <p><strong>Ejercicio 2 — Wiring diagram read (10 min):</strong> Le das el wiring diagram de una furnace tipica (Carrier/Trane/Goodman 2-stage) y le preguntas: "Explicame el camino de control cuando el thermostat llama por W1. Que contactor se energiza? Que senial confirma que el inducer draft esta OK? Que pasa si el rollout switch abre?" Si no puede seguir el 24V logic sequence, no sabe troubleshooting — solo sabe cambiar capacitores.</p>

        <p><strong>Ejercicio 3 — Superheat / Subcool calculation (10 min):</strong> Le das estos numeros: R-410A system, suction pressure 118 psig, suction line temp 52°F, liquid pressure 385 psig, liquid line temp 105°F. Preguntas: "Que es superheat? Que es subcool? Esta el sistema en charge correcto segun estos numeros?" Respuestas: SH = 52 - 40 = 12°F, SC = 105 - 110 = -5°F (subcool negativo = undercharged). Tech bueno resuelve en 2 minutos y ya esta diagnosticando.</p>

        <p><strong>Ejercicio 4 — Behavioral con STAR (15 min):</strong> "Cuentame de una vez que diagnosticaste mal. Que paso, que hiciste, que aprendiste?" Buenos tecnicos admiten errores especificos; los malos dicen "nunca he diagnosticado mal." Red flag enorme.</p>

        <h4>Ronda 3: Ride-along dia pagado (8 horas)</h4>
        <p><strong>Filtro definitivo.</strong> Paga el dia a $25/hr flat (~$200) como "paid trial day" — legal en CA si se paga como training time. Lo pones con tu mejor senior tech en 3-4 service calls reales. El senior observa: apariencia + comunicacion con cliente, uniform + boots, manifold technique, amp clamp usage, safety awareness (LOTO, ladder, PPE), cleanliness (booties, drop cloths), curiosidad tecnica vs checks boxes, y actitud en problemas inesperados (customer upset, wrong part, truck stuck). Al final del dia, el senior tech te llama: "<em>yes / no / maybe</em>" con detalles. <strong>Si el senior dice NO, no contratas</strong> — va a trabajar con el nuevo 40 hrs/semana, su voto pesa mas que tu gut.</p>

        <p><strong>Debrief con el candidato:</strong> "Que cambiarias del proceso? Tienes pregunta tecnica?" Buenos tecnicos tienen preguntas especificas de flujo (donde guardamos R-410A, CRM, callback tracking). Malos dicen "todo bien, cuando empiezo?"</p>
      `,
      keyPoints: [
        'Phone screen 15 min filtra must-haves y red flags obvios',
        'Technical interview en shop con PT chart, wiring diagram, superheat/subcool = separa bullshitters de tecnicos reales',
        'Ride-along dia pagado ($200 flat) = filtro definitivo, el senior tech vota',
        'Superheat R-410A: 52°F suction temp @ 118 psig = 12°F SH (debe resolver en 30 seg)',
        'Subcool R-410A: 105°F liquid @ 385 psig = -5°F SC (undercharged, tech bueno lo diagnostica)',
        'Behavioral question clave: "cuentame de una vez que diagnosticaste mal" — honestos dan detalle, mentirosos dicen "nunca"',
        'Ride-along paid trial day es legal en CA si pagas como training time (sujeto a minimum wage)'
      ],
      realTalk: '"El curriculum dice 8 anos de experiencia. La entrevista de PT chart dice que nunca ha usado un manifold de verdad. Cree-me siempre al PT chart. El resume miente 40% del tiempo, el manifold no miente nunca."',
      checklist: [
        { item: 'Phone screen script preparado con 6 preguntas estandar', note: 'Consistencia entre candidatos' },
        { item: 'PT chart R-410A impresa y laminada en shop', note: 'Ejercicio rapido y visual' },
        { item: 'Wiring diagram furnace 2-stage listo para imprimir', note: 'Mismo diagrama para todos' },
        { item: 'Hoja de scoring 1-5 para cada ejercicio tecnico', note: 'Comparacion objetiva' },
        { item: 'Ride-along day agendado con senior tech briefed', note: 'El senior tech es tu filtro mas importante' },
        { item: 'Paid trial day documentado como training time (W-2 o 1099 temp)', note: 'CA labor law compliance' },
        { item: 'Debrief form post ride-along (candidate + senior + tu)', note: 'Triangulacion de decisiones' },
        { item: 'Reference call al supervisor directo antes de offer', note: 'Pregunta "would you rehire"' }
      ],
      commonMistakes: [
        'Entrevistar solo hablando — 0 technical deep-dive',
        'Brincarse el ride-along — contratas en ciego',
        'Dejar el ride-along unpaid — CA Labor Code violation ($100-$10K)',
        'Ignorar el voto del senior tech — el senior va a convivir con el nuevo 40 hrs/semana',
        'Preguntas hipoteticas "que harias si..." en vez de past-behavior "cuentame de cuando..."',
        'No tener PT chart en mano — pierdes la prueba mas rapida del mundo'
      ]
    },

    // ========================================================
    // SECCION 4: BACKGROUND CHECKS
    // ========================================================
    {
      id: 'background-checks',
      heading: 'Background Checks — E-Verify, Checkr, CSLB y Referencias',
      body: `
        <p>Background check <em>post-offer</em> (no pre-offer — ban-the-box en CA bajo Fair Chance Act AB-1008) es tu <strong>ultima linea de defensa</strong> antes del Day 1. No lo hagas y te arriesgas a contratar un DUI habitual que te quema el seguro, un felon con violent history que asusta clientes, o alguien sin work authorization que te genera $10K+ de multas por empleado bajo IRCA.</p>

        <h4>1. E-Verify — gratis, obligatorio en tu mindset</h4>
        <p>E-Verify es el sistema federal <strong>gratis</strong> de DHS+SSA para verificar work authorization en <em>e-verify.gov</em>. En CA no es obligatorio estatal (AZ, GA, AL si lo exigen), pero el <strong>I-9 Form federal SI es obligatorio</strong> — completar dentro de <strong>3 dias habiles</strong> del hire con IDs (List A, B, C). E-Verify es strongly recommended: te protege en ICE audit (good faith defense), tarda 24-48 hrs, gratis. <strong>Warning:</strong> usalo universal o no lo uses — discriminatorio si aplica a algunos y otros no (National Origin Discrimination claim).</p>

        <h4>2. Checkr — criminal + driving record ($35-$50/report)</h4>
        <p><strong>Checkr</strong> (o Sterling, HireRight, GoodHire) son <em>Consumer Reporting Agencies</em> bajo FCRA. Tienes que obtener <strong>consent escrito separado</strong> del candidato ANTES de correr el check. Packages tipicos para HVAC:</p>
        <ul>
          <li><strong>Checkr Basic+ package</strong> (~$35): SSN trace, national criminal, sex offender registry, federal criminal</li>
          <li><strong>Checkr Complete package</strong> (~$50-$65): agrega motor vehicle record (MVR), county criminal search, education verification</li>
          <li><strong>MVR:</strong> driving record de los ultimos 3 anos — DUIs, reckless driving, at-fault accidents. <em>Crucial</em> en HVAC porque todos manejan trucks.</li>
        </ul>
        <p>En California bajo <strong>AB-1008 (Fair Chance Act / Ban the Box)</strong>: no puedes preguntar sobre conviction history antes de hacer <em>conditional offer</em>. Despues del offer si Checkr te regresa conviction, debes hacer <strong>individualized assessment</strong> considerando: (1) naturaleza del crime, (2) tiempo transcurrido, (3) relacion al job. Debes mandar <strong>pre-adverse action notice</strong> por escrito, dar <strong>5 dias habiles</strong> de response, y luego <strong>adverse action notice</strong> final si rescindes el offer. Skippear este proceso = EEOC lawsuit en $50K-$250K.</p>

        <h4>3. CSLB check del employer anterior</h4>
        <p>Cuando el candidato dice "trabaje 3 anos en ACME HVAC," <strong>verificas en cslb.ca.gov</strong>:</p>
        <ul>
          <li>ACME HVAC existe? Licencia activa o revoked?</li>
          <li>Classifications (C-20, C-38, C-10)?</li>
          <li>Citations o complaints historia?</li>
          <li>Workers Comp policy activa durante periodo del candidato?</li>
        </ul>
        <p>Si el candidato dice "trabaje de 2020-2023 en ACME" pero CSLB muestra que la licencia de ACME fue <em>revocada en 2021</em>, entonces o esta mintiendo, o ACME operaba sin licencia esos 2 anos (y el candidato estaba en on illegal operation). Cualquiera de las dos es red flag.</p>

        <h4>4. Reference checks que REALMENTE funcionan</h4>
        <p>La mayoria pide 3 referencias y llama al HR. <strong>Error.</strong> HR solo confirma dates + titulo (legal liability policy). La info <em>real</em> viene del <strong>supervisor directo</strong>.</p>

        <p><strong>Script al supervisor (5 min):</strong> (1) "Cuanto tiempo fue tu empleado directo?" (2) "Service, install, o ambos?" (3) "Escala 1-10 tecnicamente?" (si &lt;7 pide detalle). (4) "Como se llevo con el equipo?" (5) "Como manejo clientes dificiles?" (6) "Tuviste que disciplinarlo?" (7) <strong>"Si tuvieras budget, lo rehire manana?"</strong> ← <em>PREGUNTA MAGICA</em>. Titubeo &gt;2 seg o "bueno, depende..." = red flag enorme. (8) "Algo que no te pregunte?"</p>

        <p><strong>Pide 3 supervisores, no 3 amigos.</strong> Si solo da 1 supervisor + 2 coworkers, red flag. Verifica telefonos llamando al main line de la compania y pidiendo transferencia — asi confirmas que el supervisor trabajo ahi real.</p>
      `,
      keyPoints: [
        'I-9 Form federal obligatorio en 3 dias habiles del hire, E-Verify recomendado (gratis en e-verify.gov)',
        'Checkr Basic+ ~$35, Complete ~$50-$65 (agrega MVR y county criminal) — obligatorio consent escrito',
        'CA AB-1008 Ban the Box: no preguntar convictions antes del conditional offer, individualized assessment requerido',
        'Pre-adverse action notice + 5 dias response + adverse action notice = proceso FCRA para rescindir offer',
        'CSLB verification confirma employer history y licencia status — cslb.ca.gov gratis',
        'Pregunta magica en reference check: "would you rehire him tomorrow?" — titubeo >2 seg = red flag',
        'Pide 3 SUPERVISORES, no 3 amigos — HR solo confirma dates, supervisor directo da informacion real'
      ],
      realTalk: '"El candidato que te dice \'no tengo nada en mi record\' pero rechaza firmar el consent de Checkr, YA TE DIJO QUE SI TIENE ALGO. No hay excusa valida para rechazar un background check si tienes nada que esconder. Y el que te da 3 referencias que son todos ex-coworkers, no supervisors — te esta escondiendo un supervisor que lo va a hundir."',
      checklist: [
        'I-9 Form completado en 3 dias habiles con copia de IDs',
        'E-Verify corrido universal (o ninguno)',
        'Consent escrito FCRA firmado ANTES de correr Checkr',
        'Checkr Complete package para HVAC (criminal + MVR + SSN trace)',
        'CSLB lookup de employers anteriores confirmando licencia',
        'EPA 608 verification en epa.gov/section608',
        '3 reference calls a supervisores directos con pregunta "would you rehire"',
        'Pre-adverse action + adverse action notices si hay issue',
        'File de todo el proceso archivado 4 anos minimo (CA retention)'
      ],
      commonMistakes: [
        'Correr Checkr sin consent escrito = FCRA violation ($1K+ por persona)',
        'Preguntar convictions en la aplicacion = AB-1008 violation',
        'Skippear individualized assessment cuando aparece record = EEOC lawsuit',
        'Llamar solo al HR del ex-employer — info inutil',
        'Aceptar 3 referencias que son todas coworkers',
        'No verificar EPA 608 en epa.gov — candidato miente, pierdes $2,500+ por violacion EPA si opera sin cert'
      ]
    },

    // ========================================================
    // SECCION 5: DRUG TESTING
    // ========================================================
    {
      id: 'drug-testing',
      heading: 'Drug Testing — Marijuana en CA, DOT, y Politicas Random',
      body: `
        <p>Drug testing en California es un <strong>campo minado legal</strong> desde que AB-2188 entro en vigor el 1 enero 2024. Si lo haces mal, te demandan por FEHA discrimination claim ($50K-$500K). Si no lo haces, contratas a alguien impaired y te demandan cuando causa un accidente. Hay que hacerlo bien.</p>

        <h4>1. Pre-employment 5-panel test — estandar minimo</h4>
        <p>El <strong>5-panel</strong> testea: marijuana (THC), cocaine, opiates (codeine, morphine, heroin), PCP, amphetamines (meth). Costo ~$35-$75 por test en Quest Diagnostics, LabCorp, o tu occupational clinic local (Concentra, US HealthWorks). <strong>Tu consent form</strong> tiene que incluir:</p>
        <ul>
          <li>Lista de substances testeadas</li>
          <li>Proceso de Medical Review Officer (MRO) review</li>
          <li>Right to contest resultado positive</li>
          <li>Consequences de positive (rescinded offer)</li>
        </ul>
        <p>Pre-employment testing en CA es legal generalmente, <strong>PERO</strong>: bajo <strong>AB-2188 (effective Jan 2024)</strong>, ya <strong>NO puedes descalificar a un candidato solo por THC metabolites</strong> en un test pre-employment, porque el THC metabolite se queda en el cuerpo 30+ dias despues del uso off-duty (legal recreationalmente en CA). La ley dice que solo puedes descalificar por <em>active psychoactive impairment</em> — lo cual un urine test estandar no puede medir. Solucion: usa <strong>oral fluid (saliva) test</strong> que detecta uso en las ultimas 24 horas, o asegurate que tu posicion caiga en la excepcion de <em>safety-sensitive / federal oversight</em>.</p>

        <h4>2. Marijuana en California — la trampa</h4>
        <p>Recreational cannabis es legal en CA desde Prop 64 (2016) para adultos 21+. Pero <strong>federal law</strong> (Controlled Substances Act, Schedule I) todavia lo clasifica como illegal. Esta friccion crea reglas distintas:</p>
        <ul>
          <li><strong>Non-safety-sensitive positions:</strong> AB-2188 aplica — NO puedes descalificar por off-duty THC use</li>
          <li><strong>Safety-sensitive positions (HVAC tech con truck, ladder work, electrical):</strong> muchos employers argumentan que la excepcion de <em>"building trades" y "federal contract"</em> aplica. Zona gris legal, consulta labor attorney.</li>
          <li><strong>Federal DOT-regulated positions (CDL drivers):</strong> 100% exempt de AB-2188 — federal DOT testing gana, marijuana es causa de descalificacion automatica</li>
        </ul>
        <p><strong>Best practice 2026 para HVAC en CA:</strong> haz tu job description explicito que el trabajo es <em>safety-sensitive</em> (elevated work, electrical hazards, pressure systems, DOT commercial vehicle), documenta las razones, y usa <strong>oral fluid testing</strong> (saliva) que mide ventana de 6-24 horas — suficiente para detectar uso on-duty o recent enough to impair work.</p>

        <h4>3. Random drug testing policy</h4>
        <p>Para ser legal en CA: (1) <strong>por escrito en handbook</strong> firmado day 1, (2) <strong>verdaderamente random</strong> via software (DISA, Formula), no "pick the guy who looks high," (3) <strong>aplicado uniformemente</strong> — si testeas a Juan y nunca a Greg = discrimination claim, (4) <strong>reasonable suspicion</strong> requires observables documentadas por supervisor <em>antes</em> del test (slurred speech, red eyes, smell, erratic behavior), (5) <strong>post-accident testing</strong> si hay lesion o property damage &gt;$1K.</p>

        <h4>4. DOT testing — trucks 10,001+ lbs GVWR</h4>
        <p>Si tu truck (F-350, F-450, dually con trailer, o service truck) pasa de <strong>10,001 lbs GVWR</strong> y cruza state lines, el conductor necesita:</p>
        <ul>
          <li><strong>DOT medical card</strong> — examen NRCME certified, valido 1-2 anos ($80-$150)</li>
          <li><strong>Pre-employment DOT drug test</strong> — urine 5-panel con MRO review</li>
          <li><strong>Random DOT testing</strong> — rate FMCSA 2026: 50% drugs, 10% alcohol anualmente del driver pool</li>
          <li><strong>Post-accident testing</strong> — 8 horas alcohol / 32 horas drugs si hay fatality, injury que requiere transport, o disabling damage</li>
          <li><strong>FMCSA Clearinghouse</strong> — mandatory desde 2020, queries $1.25 c/u en clearinghouse.fmcsa.dot.gov</li>
        </ul>
        <p><strong>Warning:</strong> trucks 10,001+ lbs sin estos programas = FMCSA audit sorpresa, multas $3K-$30K, out-of-service orders. CSLB bond y GL no te cubren federal DOT violations.</p>

        <h4>5. CDL medical card</h4>
        <p><strong>Medical Examiner Certificate (MEC Form MCSA-5876)</strong> emitido por examiner NRCME. Valido 1-2 anos dependiendo de medical conditions (diabetes, hypertension, vision). Tech con CDL carga el <em>yellow card</em> en cartera. DMV suspende CDL si expira.</p>
      `,
      keyPoints: [
        'CA AB-2188 (Jan 2024): no puedes descalificar por THC metabolites en off-duty use salvo safety-sensitive/DOT',
        '5-panel test pre-employment $35-$75 via Quest/LabCorp/Concentra',
        'Oral fluid (saliva) testing detecta ventana 6-24 horas = mejor proxy de impairment que urine',
        'DOT federal regs 100% exempt de AB-2188 — marijuana = automatic disqualification',
        'Trucks 10,001+ lbs GVWR requieren DOT medical card + pre-employment drug + random testing',
        'FMCSA Clearinghouse queries obligatorias pre-employment + annual para CDL drivers',
        'Random drug policy debe ser por escrito, software-driven, uniformemente aplicado'
      ],
      realTalk: '"Compa, si tu tecnico se sube a un roof de 2-stories high on marijuana y se cae, tu Workers Comp sube 400% el ano siguiente y tu GL carrier puede subrogarte si pruebas \'willful violation.\' AB-2188 no te quita el derecho a tener un workplace safe — te obliga a usar tests que midan impairment de verdad. Saliva test es tu amigo."',
      checklist: [
        'Drug testing policy escrita en handbook, firmada day 1',
        'Job description explicito como safety-sensitive con razones documentadas',
        'Acuerdo con Quest/LabCorp/Concentra para pre-employment + random',
        'Oral fluid testing option establecida (no solo urine)',
        'MRO review process para todos los positives',
        'Random selection via software (DISA, Formula, Compliance Navigator)',
        'DOT Clearinghouse registrado para drivers CDL',
        'DOT medical card vigente en archivo para cada CDL driver',
        'Post-accident testing protocol documentado (8hr alcohol / 32hr drug)'
      ],
      commonMistakes: [
        'Descalificar por urine THC pre-employment en non-safety role — AB-2188 lawsuit $50K+',
        'No tener policy escrita — random testing es indefendible sin handbook firmado',
        '"Random" tests que siempre caen en el mismo empleado — discrimination evidence',
        'Ignorar FMCSA Clearinghouse para CDL drivers — federal violation $3K-$30K',
        'No hacer DOT medical card renewal tracking — empleado conduce con card expired, insurance voided',
        'Mixing CA law con federal DOT law creyendo que marijuana es "fine" — federal gana en DOT positions'
      ]
    },

    // ========================================================
    // SECCION 6: ONBOARDING
    // ========================================================
    {
      id: 'onboarding',
      heading: 'Onboarding — Day 1, 30-60-90, y Probation',
      body: `
        <p>El <em>onboarding</em> es donde se define si tu nuevo hire dura 3 anos o 3 meses. Segun Glassdoor, las companias con proceso de onboarding formal retienen empleados <strong>82% mas</strong> y aceleran productividad <strong>70%</strong>. Sin proceso, el tech se siente perdido en semana 2, te da notice en semana 8, y te toca recontratar por el mismo puesto desperdiciando $8K-$15K.</p>

        <h4>Day 1 Checklist — no dejes nada al azar</h4>
        <p>Ten un <strong>paquete pre-armado</strong> para que el tech llegue a las 7am y no pierda el dia firmando papeles sueltos. Items obligatorios:</p>

        <ul>
          <li><strong>W-4 federal</strong> (version 2020+) + <strong>DE-4 California</strong> (state withholding)</li>
          <li><strong>I-9 USCIS</strong> — work authorization dentro de 3 dias habiles con copia de IDs (List A, o List B+C)</li>
          <li><strong>Direct Deposit</strong> + voided check + <strong>emergency contact form</strong> (2 contactos)</li>
          <li><strong>Employee handbook</strong> firmado (drug, harassment, code of conduct, PTO, safety)</li>
          <li><strong>CA Harassment Prevention Training (SB-1343)</strong> — 1 hora employees / 2 horas supervisors, dentro de 6 meses, renewable cada 2 anos. HRAnswerLink, EasyLlama ~$10-$20/seat</li>
          <li><strong>Safety orientation</strong> OSHA: ladders (1926.1053), LOTO (1910.147), confined spaces (1910.146), PPE, fall protection (6+ ft), heat illness (CA Title 8 §3395)</li>
          <li><strong>Workers Comp notice</strong> (AB-749) + <strong>Paid Sick Leave pamphlet</strong> (AB-1522) + <strong>At-Will acknowledgment</strong></li>
          <li><strong>Tool inventory form</strong> — serial numbers, modelo, condition (protege contra theft claims)</li>
          <li><strong>Company phone + Housecall Pro/ServiceTitan login + Google Workspace email</strong></li>
          <li><strong>Truck assignment + fuel card + FasTrak + odometer + walk-around inspection</strong></li>
          <li><strong>Uniform</strong> — 5 sets minimo + boot allowance $150-$300</li>
        </ul>

        <h4>30-60-90 day milestones — el framework que retiene</h4>

        <p><strong>Day 30 "Learning":</strong> ride-along con senior en 30+ service calls, memoriza supply houses (Ferguson, Johnstone, HD Supply, Hercules), CA Harassment Training completa, Housecall Pro/ServiceTitan con confianza (work order, photos, invoice, signature), 30-day review 30 min.</p>

        <p><strong>Day 60 "Contributing":</strong> solo en calls baja complejidad (tuneups, filter, basic diag), primer callback/warranty resuelto sin escalar, customer reviews 4.5+ estrellas en 15 calls, tool inventory audit, 60-day review con KPIs (revenue per call, avg ticket, close rate).</p>

        <p><strong>Day 90 "Independent":</strong> install jobs lead 2-4 ton, diagnostic complex (superheat/subcool, low-side leaks, control board), primera call 100% solo (customer → diag → pricing → close → install → invoice → review). <strong>Fork in the road:</strong> pass probation o cut loose, documentado por escrito. Si pasa: pay review (+5-10%), PTO activate, benefits enroll. Si no pasa: separation meeting documentada + final paycheck <em>mismo dia</em> (CA Labor Code 201 — failure = waiting time penalty hasta 30 dias pay).</p>

        <h4>Ride-along probation period</h4>
        <p>El probation 90 dias es estandar pero <strong>no te protege legalmente</strong> en CA — at-will desde day 1. Lo que protege: <strong>documentacion escrita</strong>. Cada coaching = note en HR file. Cada warning = firmado. PIP = 30-60 dias con metrics. Sin esto, wrongful termination lawsuit cuesta $50K-$250K.</p>

        <p><strong>Pay schedule realista CA (Bay Area/LA 2026):</strong> Day 1-90 probation $26-$30/hr + OT; Post-90 journey $32-$38/hr + spiffs $100-$300/sale; Year 2 $38-$45/hr + quarterly bonus; Year 3+ lead $48-$58/hr + truck + phone allowance.</p>

        <p><strong>Labor burden verdad en CA:</strong> $35/hr base × 1.35-1.50 = <strong>$47-$52/hr true cost</strong>. Incluye: FICA 7.65%, FUTA 0.6%, SUI 3.4-6.2%, Workers Comp 8-10% HVAC, health $500-$900/mes, 401k match 3-4%, PTO 80-120 hrs/ano, payroll service, training, uniforms.</p>
      `,
      keyPoints: [
        'Day 1 package: W-4, DE-4, I-9, handbook, harassment training, safety orientation, tool inventory, truck + fuel card',
        'CA SB-1343 harassment training obligatorio 1 hora employees / 2 horas supervisors, dentro de 6 meses',
        '30-60-90 framework: Day 30 Learning, Day 60 Contributing, Day 90 Independent o cut',
        'Employee handbook debe ser firmado day 1 — contiene drug, harassment, at-will policies',
        'Probation NO te protege de wrongful termination en CA — documentacion escrita si',
        'Labor burden real CA: $35/hr base = $47-$52/hr true cost (1.35-1.50x multiplier)',
        'CA Labor Code 201: final paycheck mismo dia del termination involuntario (or 30 dias waiting time penalty)'
      ],
      realTalk: '"El tecnico que se va en 90 dias no es culpa del tecnico — es culpa tuya. Le diste un truck sin walk-around, lo mandaste solo a llamadas sin ride-along, nunca le diste feedback hasta el dia que lo despediste. El onboarding formal cuesta $500 en forms y 10 horas de tiempo. Contratar uno nuevo cuesta $8K-$15K. Haz la matematica."',
      checklist: [
        'Paquete Day 1 pre-armado: W-4, DE-4, I-9, DE-4, handbook, direct deposit',
        'CA Harassment Prevention Training agendado dentro de 6 meses',
        'Safety orientation documentado (OSHA topics + CA Title 8)',
        'Tool inventory form firmado con serial numbers',
        'Truck walk-around + odometer + fuel card setup',
        'Housecall Pro/ServiceTitan + email + phone activos',
        'Uniform issue con boot allowance',
        'Ride-along schedule 30 calls primer 30 dias',
        '30-60-90 day review forms en calendario',
        'Pay review + benefits enrollment post-90 documentado'
      ],
      commonMistakes: [
        'No firmar handbook day 1 — policies indefendibles',
        'Skippear harassment training — SB-1343 violation $10K+',
        'No tool inventory — luego dispute "ese drill era mio" al firing',
        'Truck sin walk-around inspection — dents pre-existentes atribuidos al nuevo',
        'No documentar performance issues por escrito — wrongful termination lawsuit',
        'Final paycheck dia siguiente en vez del mismo dia — 30 dias waiting time penalty'
      ]
    },

    // ========================================================
    // SECCION 7: RED FLAGS
    // ========================================================
    {
      id: 'red-flags',
      heading: 'Red Flags — 10 Senales que te Salvan $50K',
      body: `
        <p>Despues de 20 anos de contratar y ver a otros contratistas contratar mal, identifiquе patrones que se repiten. Cada una de estas <em>red flags</em> individualmente puede no ser descalificante — pero cuando ves 2 o mas juntas, es un <strong>no automatico</strong>. Internaliza estas y te ahorras el 80% de los malos hires.</p>

        <h4>Red Flag 1: Job-hopper (5 jobs en 3 anos)</h4>
        <p>Los buenos techs se quedan 3-5 anos en una compania. 5 empleadores en 3 anos (promedio 6-8 meses) = patron: no lleva bien autoridad, fue despedido multiple veces, o brinca por 50 centavos mas. <strong>Excepciones validas:</strong> seasonal work (Arizona summer, ski resort), relocation, o transicion planned (helper → apprentice → journey). Pregunta directamente: "por que saliste de cada una?" Las historias coherentes suenan coherentes; las mentiras tienen agujeros.</p>

        <h4>Red Flag 2: "Yo era el mejor tech de ahi"</h4>
        <p>Tecnicos reales no dicen esto — <strong>saben cuanto no saben</strong>. HVAC tiene 40+ anos de curva: furnaces de 1975, heat pumps cold-climate, VRF, commercial rooftops 25-ton, refrigeration. El tech que dice "era el mejor" es (a) el mejor de un shop de 2 personas, (b) confunde confidence con competence, o (c) narcisista que va a tener conflicto con tu senior en 30 dias. El tech real dice "soy solido en residential service, me complican los inverter mini-splits, quiero aprender commercial." Esa humildad + self-awareness es oro.</p>

        <h4>Red Flag 3: No posee herramientas propias</h4>
        <p>Un journey-level con 5+ anos tiene <strong>$3,000-$8,000 en herramientas</strong>: manifold (Yellow Jacket/CPS/Fieldpiece), vacuum pump, Fluke 116/117, amp clamp, temp probes, scale, leak detector. Si dice "no tengo tools, me las prestaban" — o (a) nunca fue journey real, (b) las empeno, o (c) fue fired y se quedaron con su tool credit. Apprentices si es valido no tener todo — pero apprentices cuestan $18-$22/hr, no $38/hr.</p>

        <h4>Red Flag 4: DUI en los ultimos 5 anos</h4>
        <p>Un DUI no te hace mala persona — pero te hace <strong>caro de asegurar</strong>. Commercial auto insurance clean: $2,500-$5,000/ano por truck. Con DUI: <strong>$5,000-$12,000/ano</strong>. Multi DUIs = uninsurable comercialmente. Pregunta directa: "Has tenido DUI, reckless, o at-fault en los ultimos 5 anos?" Los honestos confiesan; los mentirosos Checkr los atrapa. Los que mienten aqui mienten en otros lados — pass.</p>

        <h4>Red Flag 5: Miente sobre EPA 608</h4>
        <p>La EPA 608 database es <strong>publica y gratis</strong> en <em>epa.gov/section608/608certified</em>. Si dice "Universal desde 2015" y la base muestra "Type II desde 2020" o nada, miente. No-negociable — un tech que miente sobre EPA 608 va a mentir sobre recovery, venting, leak checks, generando EPA violations en <strong>$2,500+ por infraction</strong> (Clean Air Act Section 608). Auto-descalificacion, documenta en file por si reclama despues.</p>

        <h4>Red Flag 6: No puede explicar superheat/subcool</h4>
        <p>Si en la technical interview no puede explicar superheat, subcool, y como se usan para diagnosticar charge, <strong>no sabe HVAC fundamental</strong>. No importa cuantos anos diga tener — es como un plomero que no sabe static pressure. Puedes entrenar apprentice que no lo sabe pagandole apprentice wage, no journey wage.</p>

        <h4>Red Flag 7: Muy dispuesto a empezar "manana"</h4>
        <p>Los tecnicos buenos dan 2 semanas de notice a su actual employer. "Yo empiezo manana, no me importa avisar" — asi te va a dejar a ti. Si propone empezar sin background check ni drug test ni paperwork, no es urgency honest — es <em>something to hide</em>.</p>

        <h4>Red Flag 8: Se presenta mal (appearance + hygiene)</h4>
        <p>HVAC es customer-facing. Si llega a la entrevista con ropa arrugada, olor fuerte, unas sucias, boots deshechos — tu cliente va a ver eso en su casa. Un tecnico que no cuida apariencia genera 2-3x mas complaints de clientes women/seniors. Si viene asi a la ENTREVISTA (su mejor version), day 200 es peor.</p>

        <h4>Red Flag 9: Habla mal del employer anterior</h4>
        <p>"Mi ultimo boss era un pendejo," "la compania era un fraude." Puede ser verdad — pero si <em>lidera</em> con eso, te dice: (a) no maneja conflict profesionalmente, (b) va a hablar mal de ti en 18 meses, (c) posts Glassdoor reviews destructivas. Tecnicos maduros dicen "la cultura no era para mi, aprendi mucho, quiero crecer en X." Misma historia, tono diferente.</p>

        <h4>Red Flag 10: Resiste background check o drug test</h4>
        <p>"Prefiero no firmar Checkr." "No creo en drug testing." "Mi privacidad es importante." Un candidato con <em>nada que esconder</em> firma en 30 segundos. Titubeo, negociacion, o pedir "saltarse ese paso" = <strong>YA TE DIJO que tiene algo</strong>. Pass automatic.</p>

        <h4>Bonus Red Flag 11: Pide pago cash "off the books"</h4>
        <p>"Prefiero cash, nos ahorramos taxes." En CA = <strong>misclassification fraud + tax evasion</strong>. EDD audit $10K-$50K + back payroll + interest. Si se cae del roof sin WC reportado, criminal liability (felony) Labor Code 3700.5. Auto pass.</p>
      `,
      keyPoints: [
        '5 empleos en 3 anos (6-8 meses cada uno) = patron de job hopping a menos que seasonal/relocation',
        '"Yo era el mejor" = confidence sin competence, futuro conflicto con senior tech',
        'No tener herramientas propias en journey-level role = nunca fue journey real',
        'DUI en ultimos 5 anos = auto insurance $5K-$12K/ano vs $2.5K clean',
        'EPA 608 verificable en epa.gov/section608 — mentir = auto-disqualify, EPA violations $2,500+',
        'No puede explicar superheat/subcool = no sabe HVAC fundamental, no importa cuantos anos claimed',
        'Resistir background check o drug test = "te esta diciendo que tiene algo"'
      ],
      realTalk: '"El instinto existe por una razon. Si despues de la entrevista tu gut dice \'algo raro con este tipo\' — escucha. Tu gut esta procesando senales que tu brain consciente todavia no articula. He contratado contra mi gut 3 veces en 20 anos — las 3 veces termine despidiendo dentro de 6 meses. Nunca mas. Si dudas, pasa."',
      checklist: [
        'Cronologia de empleos analizada — jobs <12 meses flagged',
        'Pregunta directa "por que saliste de cada empleo" con respuestas coherentes',
        'Tool inventory verificado in-person day 1',
        'Checkr MVR driving record pre-offer',
        'EPA 608 verificado en epa.gov (no solo su palabra)',
        'Technical interview verifica fundamentals (superheat, subcool, PT chart)',
        'Appearance + punctuality noted en entrevista',
        'Tono al hablar de employers anteriores',
        'Consent firmado para ALL background + drug testing sin resistencia',
        'Gut check post-interview — si hay duda, pass'
      ],
      commonMistakes: [
        'Ignorar job-hopping pensando "a lo mejor este se queda" — history repeats',
        'Excusar DUI reciente porque "fue hace 3 anos" — insurance dice no',
        'Creer el EPA 608 sin verificar — $2,500 por violacion cuando lo cachen',
        'Contratar al que necesita empezar "manana" sin due diligence — shortcuts cost later',
        'Negociar lo del drug test "solo esta vez" — sets precedent peligroso',
        'Aceptar cash payment request "solo al principio" — EDD audit nightmare'
      ]
    }

  ],

  resources: [
    { label: 'E-Verify (DHS/SSA) — work authorization gratis', url: 'https://www.e-verify.gov/', type: 'link' },
    { label: 'Form I-9 (USCIS) — descarga oficial', url: 'https://www.uscis.gov/i-9', type: 'link' },
    { label: 'Checkr — background check platform HVAC', url: 'https://checkr.com/', type: 'link' },
    { label: 'CA SB-1162 Pay Transparency (official)', url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220SB1162', type: 'link' },
    { label: 'CA AB-1008 Fair Chance Act (Ban the Box)', url: 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201720180AB1008', type: 'link' },
    { label: 'CA AB-2188 Cannabis Off-Duty Protection', url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220AB2188', type: 'link' },
    { label: 'EPA 608 Certified Technician Verification', url: 'https://www.epa.gov/section608/section-608-technician-certification-0', type: 'link' },
    { label: 'EPA 608 Certifying Programs Directory', url: 'https://www.epa.gov/section608/stationary-refrigeration-and-air-conditioning', type: 'link' },
    { label: 'NATE Certification (North American Technician Excellence)', url: 'https://www.natex.org/', type: 'link' },
    { label: 'CSLB License Lookup (verify employer history)', url: 'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx', type: 'link' },
    { label: 'FMCSA Drug & Alcohol Clearinghouse', url: 'https://clearinghouse.fmcsa.dot.gov/', type: 'link' },
    { label: 'FMCSA DOT Medical Examiner Registry', url: 'https://nationalregistry.fmcsa.dot.gov/', type: 'link' },
    { label: 'CA SB-1343 Harassment Prevention Training Requirements', url: 'https://calcivilrights.ca.gov/shpt/', type: 'link' },
    { label: 'OSHA 10 Construction Online (safety cert)', url: 'https://www.osha.com/courses/10-hour-construction.html', type: 'link' },
    { label: 'USCIS H-2B Temporary Non-Agricultural Workers', url: 'https://www.uscis.gov/working-in-the-united-states/temporary-nonimmigrant-workers/h-2b-temporary-non-agricultural-workers', type: 'link' },
    { label: 'DOL H-2B Program (Office of Foreign Labor Cert)', url: 'https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b', type: 'link' },
    { label: 'AcvoltSchool — graduates pipeline HVAC', url: 'https://acvoltschool.com/', type: 'link' },
    { label: 'Indeed for Employers', url: 'https://www.indeed.com/hire', type: 'link' },
    { label: 'ZipRecruiter for Employers', url: 'https://www.ziprecruiter.com/hire', type: 'link' },
    { label: 'Sheet Metal Workers Local 104 (Northern CA)', url: 'https://smw104.org/', type: 'link' },
    { label: 'Sheet Metal Workers Local 105 (Southern CA)', url: 'https://smwlu105.org/', type: 'link' },
    { label: 'CA Labor Code 201 (Final Paycheck Rules)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=201.&lawCode=LAB', type: 'link' },
    { label: 'CA Fair Employment and Housing Act (FEHA)', url: 'https://calcivilrights.ca.gov/', type: 'link' },
    { label: 'FCRA (Fair Credit Reporting Act) — background check compliance', url: 'https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-employers-need-know', type: 'link' }
  ],

  glossary: [
    { term: 'SB-1162 (Pay Transparency)', def: 'Ley CA efectiva 1/2023 obligando pay range publicado en job postings para employers con 15+ empleados. Multas $100-$10K por posting violator. Code Labor 432.3.' },
    { term: 'AB-1008 (Ban the Box)', def: 'Fair Chance Act CA. Prohibe preguntar conviction history antes del conditional job offer. Exige individualized assessment si aparece record. Multa $25K+.' },
    { term: 'AB-2188 (Cannabis Off-Duty)', def: 'Ley CA efectiva 1/2024 prohibiendo discrimination por off-duty marijuana use detectado en THC metabolites (non-psychoactive). Exempta safety-sensitive federal DOT.' },
    { term: 'SB-1343 (Harassment Training)', def: 'CA requiere 1 hora training empleados / 2 horas supervisors dentro de 6 meses del hire, renovar cada 2 anos. Plataformas: HRAnswerLink, EasyLlama, $10-$20/seat.' },
    { term: 'EPA 608', def: 'Certificacion federal obligatoria para tecnicos que manejan refrigerante (Clean Air Act Section 608). Tipos: I (small appliance), II (high-pressure), III (low-pressure), Universal. Verificable en epa.gov.' },
    { term: 'NATE', def: 'North American Technician Excellence — certificacion industria premium, examen 4+ horas, renovacion cada 2 anos. Gold standard, paga +$2-$4/hr.' },
    { term: 'OSHA 10 / OSHA 30', def: 'Safety training OSHA-authorized. 10 hrs (construction basics $49-$89) o 30 hrs (supervisor level $179-$279). Muchos GCs lo exigen para site access.' },
    { term: 'I-9 Form', def: 'USCIS Employment Eligibility Verification. Debe completarse dentro de 3 dias habiles del hire con ID verification (List A, B, C). Retain 3 anos del hire o 1 ano del termination (el mas largo).' },
    { term: 'E-Verify', def: 'Sistema federal gratis DHS+SSA para confirmar work authorization. No obligatorio en CA pero recomendado. Audit trail = good faith defense en ICE audits.' },
    { term: 'Checkr', def: 'Consumer Reporting Agency bajo FCRA. Packages HVAC: Basic+ $35 (criminal + SSN), Complete $50-$65 (agrega MVR + county). Require consent escrito separado.' },
    { term: 'FCRA', def: 'Fair Credit Reporting Act federal. Governa background check process: consent escrito, pre-adverse notice, 5 dias response, adverse action notice. Violacion $1K+ por persona.' },
    { term: 'MRO (Medical Review Officer)', def: 'Medico licenciado que revisa drug test positives antes de reportar al employer. Valida prescripciones legales (opiates prescritos, Adderall). Obligatorio para DOT testing.' },
    { term: 'DOT Clearinghouse (FMCSA)', def: 'Base de datos federal desde 2020 trackeando drug/alcohol violations de CDL drivers. Pre-employment + annual queries $1.25 c/u. Registro en clearinghouse.fmcsa.dot.gov.' },
    { term: 'DOT Medical Card', def: 'Medical Examiner Certificate (MCSA-5876) emitido por certified examiner de NRCME. Valido 1-2 anos, obligatorio para CDL drivers y trucks 10,001+ lbs GVWR.' },
    { term: 'GVWR', def: 'Gross Vehicle Weight Rating — peso maximo del vehiculo + cargo segun fabricante. Trucks sobre 10,001 lbs GVWR caen bajo federal DOT rules (medical card, drug testing, HOS).' },
    { term: 'H-2B Visa', def: 'Visa temporal para trabajadores non-agricolas hasta 10 meses, renovable 3 anos max. Cap nacional 66K/ano. Proceso: DOL PWD → SWA Job Order → recruitment → ETA 9142B → USCIS I-129.' },
    { term: 'Prevailing Wage', def: 'Salario obligatorio por DIR en public works CA, determinado por county + trade + classification. HVAC service tech $55-$80/hr all-in tipico 2026. Violacion = back wages + penalties + debarment.' },
    { term: 'Labor Burden', def: 'Multiplicador de true cost sobre hourly base: FICA 7.65%, FUTA 0.6%, SUI 3.4-6.2%, WC 8-10% HVAC, health, 401k, PTO. CA tipico 1.35-1.50x. $35/hr = $47-$52 true cost.' },
    { term: 'At-Will Employment', def: 'Doctrina default CA: employer o employee pueden terminar sin causa sin notice. PERO excepciones: discrimination, retaliation, public policy violations. Documentacion escrita es defensa clave.' },
    { term: 'PIP (Performance Improvement Plan)', def: 'Plan formal 30-60 dias con metrics especificos para empleado underperforming. Documenta escalation antes de termination, reduce wrongful termination lawsuit risk.' }
  ]
};
