// ============================================================
// ACVOLT Business Academy — Bloque 2: Legal y Compliance
// California HVAC Contractor Legal Foundation
// ============================================================

window.CONTRACTOR_BLOQUE_2 = {
  number: 2,
  title: 'Legal y Compliance',
  tagline: 'CSLB, seguros, permits — los no-negociables',
  intro: `
    <p><strong>Compa, escucha bien:</strong> en California, trabajar sin licencia de contratista cuando el job pasa de <strong>$500</strong> (labor + materiales combinados) es un <em>misdemeanor criminal</em> bajo el <strong>Business &amp; Professions Code §7028</strong>. Primera ofensa: hasta <strong>$5,000 de multa</strong> y/o <strong>6 meses de cárcel</strong>. Segunda ofensa: mínimo <strong>$5,000 y 90 días de cárcel obligatorios</strong>. Tercera: <strong>$10,000+ y hasta 1 año</strong>. El CSLB tiene una unidad de investigación llamada <strong>SWIFT</strong> (Statewide Investigative Fraud Team) que hace stings como clientes falsos en Craigslist y Facebook Marketplace.</p>

    <p>Pero la parte más cabr*na no es la cárcel — es que <strong>si no tienes licencia y el cliente no te paga, no puedes demandarlo</strong>. B&amp;P §7031 dice que un contratista sin licencia <em>no tiene derecho a cobrar ni un centavo en corte</em>, y peor: el cliente puede demandarte para <strong>recuperar todo lo que ya te pagó</strong>, aunque el trabajo esté perfecto. He visto plomeros perder $80,000 de jobs completados porque no tenían la C-36 al día.</p>

    <p>Este bloque te enseña lo que <strong>nadie</strong> te dice en YouTube ni en las clases de $2,000 que venden en Santa Ana. Vamos a cubrir: cómo funciona el CSLB de verdad, cuál clasificación aplicar (C-20 vs C-38 vs B — la respuesta no es la que crees), el proceso exacto de la aplicación con forma 7065 y 7197, el LiveScan de huellas, el <strong>bond de $25,000</strong> que protege al cliente pero no a ti, la diferencia entre <strong>General Liability</strong> y <strong>Workers Comp</strong>, por qué tu LLC te exenta de WC pero tu primer empleado te obliga a comprarla al día 1, la trampa de la reciprocidad con Arizona/Nevada/Utah/Louisiana, permits y Title 24 con sus formas CF-2R/CF-3R, mechanics liens con el preliminary notice de 20 días, y el contrato obligatorio con el 3-day right to rescission.</p>

    <p class="warn"><strong>Real talk:</strong> puedes perder tu business antes de abrirlo si firmas un contrato mal redactado, si no pagas el bond, si te brincas el permit, o si tu primer empleado se cae del roof y no tenías Workers Comp. Un solo error aquí = $50K-$500K de pérdida. Léete este bloque dos veces. Luego léelo otra vez.</p>
  `,

  sections: [
    // ================================================================
    // SECTION 1 — CSLB BASICS
    // ================================================================
    {
      id: 'cslb-basics',
      heading: 'CSLB — Lo que Nadie te Dice',
      body: `
        <p>El <strong>Contractors State License Board (CSLB)</strong> es la agencia estatal bajo el <strong>Department of Consumer Affairs (DCA)</strong> que regula a los ~290,000 contratistas licenciados en California. Fue creado en 1929 bajo el <strong>Business &amp; Professions Code §7000-7191</strong>. Su oficina principal está en <strong>Sacramento (9821 Business Park Drive)</strong>, pero opera investigadores en todo el estado. El Registrar actual maneja un budget de ~$75M al año financiado 100% por <em>tus</em> cuotas — no con impuestos generales.</p>

        <p>Lo que la mayoría no entiende: <strong>el CSLB no es tu aliado — es un regulador con dientes</strong>. Tienen 4 poderes principales: (1) <strong>emitir licencias</strong>, (2) <strong>investigar quejas</strong> (reciben ~20,000 al año), (3) <strong>suspender/revocar</strong> licencias vía el Attorney General, y (4) <strong>referir casos criminales</strong> al DA local. Un citation promedio del CSLB es <strong>$1,000-$5,000</strong>, pero las multas civiles por trabajar sin licencia pueden llegar a <strong>$15,000 por ofensa</strong> bajo B&amp;P §7028.7.</p>

        <p><strong>El Examen — donde 60% reprueba la primera vez.</strong> Son dos exámenes: <strong>Law &amp; Business</strong> (115 preguntas, 3.5 horas, cubre contratos, mechanics liens, OSHA, payroll, taxes) y <strong>Trade Exam</strong> (100-115 preguntas específicas de tu clasificación — C-20 HVAC, C-38 refrigeration, C-10 electrical, etc.). Necesitas <strong>72% en ambos</strong> para pasar. El costo es <strong>$330</strong> (application) + <strong>$200</strong> (initial license fee cuando pasas) + <strong>$450</strong> (renewal cada 2 años). Se toma en centros PSI en <strong>Ontario, Sacramento, Oakland, Fresno, San Diego, Santa Rosa, Norwalk, y Glendale</strong>.</p>

        <p><strong>Las "trap questions" del Law &amp; Business:</strong></p>
        <ul>
          <li>Preguntan sobre el <strong>down payment máximo legal</strong>. La respuesta es <strong>$1,000 o 10% del total, lo que sea MENOR</strong> (B&amp;P §7159). Si el cliente te da más, es ilegal aunque él insista.</li>
          <li><strong>Right to cancel:</strong> home improvement contracts dan <strong>3 días hábiles</strong> para cancelar (federal + CA §1689.6). Senior (65+): <strong>5 días</strong>. Disaster-area: <strong>7 días</strong>. El contrato DEBE incluir el Notice of Cancellation en letra de 10pt o más o el contrato es nulo.</li>
          <li><strong>Mechanics Lien:</strong> preliminary notice se manda en <strong>20 días</strong> desde que empiezas. Si te pasas, pierdes derecho a lien por todo lo anterior.</li>
          <li><strong>Workers Comp:</strong> aunque seas dueño solo, si tienes <em>cualquier</em> W-2 empleado (incluso part-time, incluso familia), <strong>WC es obligatorio desde el día 1</strong>. No hay exemption de "1 empleado".</li>
        </ul>

        <p><strong>RMO vs Sole Owner.</strong> Si no tienes los 4 años de experiencia journeyman-level, puedes usar un <strong>Responsible Managing Officer (RMO)</strong> o <strong>Responsible Managing Employee (RME)</strong> — alguien con licencia activa que "presta" su experiencia. El RMO debe ser <strong>empleado permanente 32+ horas/semana</strong> Y tiene responsabilidad legal. Alquilar licencias (el famoso "broker de license") es <strong>criminal</strong> bajo B&amp;P §7114 — <strong>$5,000+ multa y revocación para ambos</strong>.</p>

        <p><strong>Cómo el CSLB verifica tu experiencia.</strong> Necesitas 4 años full-time de experiencia <em>journeyman</em> en los últimos 10 años. Cuentas journeyman trabajando para un licenciado, training militar, apprenticeships formales, o educación técnica (max 3 años). <strong>Self-employed unlicensed NO cuenta</strong>. El certificador (tu ex-patrón) firma bajo perjury en el Form 13A-11 — si miente y lo cachan, pierde su licencia también.</p>
      `,
      keyPoints: [
        'CSLB regula a ~290,000 contratistas bajo B&P §7000-7191; budget financiado por cuotas, no impuestos',
        'Trabajar sin licencia en job >$500 = misdemeanor + hasta $15,000 multa civil bajo §7028.7',
        'Dos exámenes (Law & Business + Trade), 72% para pasar, $330 aplicación + $200 licencia',
        'Down payment máximo legal: $1,000 o 10% del total, el MENOR — no más',
        'Home improvement tiene 3-day right to rescission (5 para seniors 65+, 7 disaster)',
        'RMO/RME debe ser empleado 32+ horas/semana — alquilar licencia es criminal §7114',
        '4 años journeyman experience verified via Form 13A-11 firmado bajo perjury'
      ],
      realTalk: '"El CSLB no es tu amigo ni tu enemigo — es un regulador que responde a quejas. Si haces las cosas bien, jamás sabrás que existen. Si haces un solo job mal, conocerás a su investigador. Y ese güey tiene badge y autoridad de arresto."',
      checklist: [
        { item: 'Documentar 4+ años de experiencia con fechas, supervisores, y tipo de trabajo', note: 'Hoja de Excel desde hoy — vas a necesitar todo cuando apliques' },
        { item: 'Conseguir 2 W-2s o 1099s por año de cada empleador previo', note: 'IRS transcripts sirven si no tienes las copias' },
        { item: 'Identificar tu clasificación primaria (C-20 HVAC más común)', note: 'Puedes agregar más classifications después' },
        { item: 'Estudiar Law & Business con Contractor\'s Guide (libro oficial CSLB)', note: '~$80, en Amazon o directo del CSLB' },
        { item: 'Reservar examen en PSI (ontario o la location más cerca)', note: 'Se agenda online después de aprobar la application' },
        { item: 'Tener tu SSN o ITIN listo + DL o matrícula consular', note: 'ITIN funciona — no necesitas ser ciudadano' },
        { item: 'Decidir structure: Sole Prop, LLC, o Corp ANTES de aplicar', note: 'Cambiar después = nueva aplicación + nueva licencia' },
        { item: 'Presupuestar $2,500-$4,000 para todo el proceso completo', note: 'Incluye bond, fees, fingerprints, study materials, exam retakes' }
      ],
      commonMistakes: [
        'Aplicar sin los 4 años documentados — rechazan y pierdes los $330',
        'Usar un "license broker" que cobra $5K/mes por prestarte la licencia — criminal para los dos',
        'Dar un down payment mayor al 10%/$1,000 porque "el cliente insistió" — te multan aunque él te demande por otra cosa',
        'Olvidar poner el Notice of Cancellation en 10pt letra — contrato entero se vuelve unenforceable',
        'Asumir que "small jobs under $500" no requieren licencia si la frase incluye "labor only" — NO, incluye labor + materiales'
      ]
    },

    // ================================================================
    // SECTION 2 — CLASSIFICATIONS
    // ================================================================
    {
      id: 'classifications',
      heading: 'Clasificaciones de Licencia — Cuál Aplicar',
      body: `
        <p>California tiene <strong>3 classes principales</strong> y <strong>44 sub-classifications</strong> bajo B&amp;P §7056-7058. Elegir la wrong classification = trabajar fuera de tu scope = queja del cliente = revocación. Vamos a revisar las que te interesan como HVAC technician:</p>

        <p><strong>Class A — General Engineering Contractor.</strong> Para proyectos de <em>infraestructura</em>: highways, pipelines industriales, dams, estructuras pesadas. Requiere conocimiento de engineering specialized. <strong>NO es para ti</strong> como HVAC — overkill y el exam es brutal (civil engineering-level).</p>

        <p><strong>Class B — General Building Contractor.</strong> Para construcción de structures (casas, commercial buildings). Un B puede contratar subs de cualquier C-classification. <strong>Pero ojo:</strong> un B NO puede hacer trabajo que requiera SOLO una specialty classification (ej. un B puro no puede hacer un change-out de AC unit si el job es solo el AC — necesita C-20 o subcontratar). <strong>Cuándo te sirve:</strong> si haces remodels completos con HVAC + electrical + drywall.</p>

        <p><strong>C-4 — Boiler, Hot-Water Heating &amp; Steam Fitting.</strong> Instalas boilers, piping de steam, hydronic heating systems (radiant floor, baseboard). Mucho en Bay Area y commercial. <strong>NO cubre refrigeration ni AC central.</strong></p>

        <p><strong>C-10 — Electrical Contractor.</strong> Wiring, panels, sub-panels, todo lo eléctrico. <strong>Importante:</strong> un C-20 HVAC puede hacer el <em>low-voltage thermostat wiring</em> (24V control) y el <em>disconnect/whip</em> del unit como parte del install, pero NO puede hacer el branch circuit del panel al disconnect — eso requiere C-10. Muchos HVAC pros sacan C-20 + C-10 para no depender de un sub eléctrico.</p>

        <p><strong>C-20 — Warm-Air Heating, Ventilating &amp; Air-Conditioning.</strong> <strong>Esta es LA classification HVAC residential/light commercial.</strong> Cubre: forced-air furnaces (gas, electric, oil), split AC systems, heat pumps, ductwork, ventilation, thermostats, condensate pumps, economizers, package units rooftop hasta cierto tamaño. <strong>No cubre:</strong> commercial refrigeration (walk-in coolers, reach-ins), ice machines, freezers — eso es C-38. Tampoco cubre hydronic/boiler heating — ese es C-4.</p>

        <p><strong>C-38 — Refrigeration Contractor.</strong> Commercial refrigeration: walk-in coolers/freezers, ice machines, display cases de supermercados, condensing units comerciales, ammonia y CO2 systems (con certificaciones extra). <strong>Si tu target es restaurants, supermercados, grow facilities, cold storage — necesitas C-38.</strong> Muchos veteranos sacan C-20 + C-38 para cubrir residential AC + commercial refrigeration. Los jobs de C-38 pagan 2-3x más por hora que residential AC.</p>

        <p><strong>C-46 — Solar Contractor.</strong> Solar PV, solar thermal (pool heating, water heating). Con el boom de heat pump + solar + battery, muchos HVAC están agregando C-46. <strong>Nota:</strong> para solar PV grid-tie necesitas C-10 O C-46 (el C-46 tiene scope limitado para electrical — solo lo del solar system).</p>

        <p><strong>Combinaciones recomendadas:</strong></p>
        <ul>
          <li><strong>Residential HVAC puro:</strong> C-20 solito. $330 examen adicional si agregas C-10 después.</li>
          <li><strong>Residential + poder hacer su propia electrical:</strong> C-20 + C-10. Te ahorra sub costs.</li>
          <li><strong>Light commercial + restaurants:</strong> C-20 + C-38. El pan de cada día bien pagado.</li>
          <li><strong>Heat pump especialista moderno:</strong> C-20 + C-46 + C-10. Todo-en-uno.</li>
          <li><strong>Grandes remodels:</strong> B + C-20. Puedes ser GC y self-perform el HVAC.</li>
        </ul>

        <p><strong>Cómo agregar classifications.</strong> Una vez que tienes tu primera licencia, agregas otras con <strong>Form 13A-16 (Application for Additional Classification)</strong>, $330 por cada una, y presentas <strong>solo el trade exam</strong> (no repites Law &amp; Business). Necesitas demostrar experiencia en la nueva classification también.</p>

        <p><strong>La trampa: "Incidental &amp; Supplemental" work.</strong> B&amp;P §7059 dice que puedes hacer trabajo de otra classification si es <em>incidental y supplemental</em> al job principal. Ejemplo: tu C-20 instala un AC y como parte del job corres el 240V desde el disconnect existente — OK. Pero si el homeowner te pide "ya que andas aquí, instálame un ceiling fan" — NO, eso es C-10 scope standalone. CSLB cacha esto vía quejas de homeowners cuando algo falla.</p>
      `,
      keyPoints: [
        'C-20 = HVAC residential + light commercial (la más común para AC/heat pump/furnace)',
        'C-38 = commercial refrigeration (walk-ins, ice machines) — paga 2-3x más que residential',
        'C-10 = electrical completo; C-20 solo puede hacer low-volt thermostat + disconnect whip',
        'C-46 = solar PV/thermal — útil con el boom de heat pump + battery',
        'Class B permite GC pero NO puede hacer standalone HVAC sin C-20 o subcontratar',
        'Additional classifications vía Form 13A-16, $330 c/u, solo trade exam (no Law & Business)',
        'Incidental & Supplemental (§7059) — puedes cruzar scopes SI es parte integral del job principal'
      ],
      realTalk: '"El 80% de los homeboys HVAC sacan solo C-20 y se quedan en residential forever. El 20% que agrega C-38 o C-10 termina facturando $500K/año porque cierra el ciclo completo — no depende de subs que se atrasan o cobran el triple."',
      checklist: [
        { item: 'Decidir clasificación primaria basada en TU target market', note: 'Residential AC = C-20, commercial fridge = C-38' },
        { item: 'Verificar que tu experiencia de 4 años cuadra con la classification elegida', note: 'Ex: no puedes aplicar C-38 si solo has hecho residential splits' },
        { item: 'Planear qué additionals sacar en año 2-3', note: 'Roadmap: C-20 primero → C-38 o C-10 después' },
        { item: 'Leer el Scope of Work oficial de CSLB para tu classification', note: 'cslb.ca.gov/About_Us/Library/Licensing_Classifications/' },
        { item: 'Evitar B (General Building) si no vas a hacer remodels completos', note: 'Exam más duro, bond más alto, scope que no usas' },
        { item: 'Si vas a hacer solar, considerar C-46 early', note: 'NEM 3.0 está empujando heat pump + solar + battery stacks' }
      ],
      commonMistakes: [
        'Sacar B pensando "me cubre todo" — te obliga a conocer framing, concrete, roofing que no vas a tocar',
        'Hacer boiler/hydronic work con C-20 solo — necesitas C-4 y CSLB te cita',
        'Creer que C-20 cubre walk-in coolers — NO, eso es C-38 strictly',
        'Agregar classifications que no usas solo "por si acaso" — $330 + renewal fees desperdiciados',
        'Hacer electrical panel upgrades como C-20 — scope violation, queja segura del inspector'
      ]
    },

    // ================================================================
    // SECTION 3 — APPLICATION PROCESS
    // ================================================================
    {
      id: 'application-process',
      heading: 'El Proceso de Aplicación CSLB',
      body: `
        <p>El proceso completo toma <strong>3-6 meses</strong> desde que mandas la aplicación hasta que tienes la licencia en la mano. No es un proceso rápido y no se acelera pagando más. Vamos paso por paso con <em>forms exactos</em>, <em>costos reales</em>, y <em>timelines</em>:</p>

        <p><strong>Paso 1 — Form 7065 (Application for Original Contractor License).</strong> Esta es la aplicación principal. Tiene 15 páginas y te pregunta:</p>
        <ul>
          <li>Business structure (Sole Owner, Partnership, LLC, Corporation, Joint Venture)</li>
          <li>Classification(s) que solicitas</li>
          <li>Nombre legal del business y DBA si aplica</li>
          <li>Dirección física (NO PO Box — rechazan inmediatamente)</li>
          <li>Qualifier (tú mismo si tienes experiencia, o RMO/RME)</li>
          <li>Declaración bajo perjury de que no has sido convicto de felony relacionado a construction/fraud</li>
        </ul>

        <p><strong>Si aplicas como LLC (cada vez más común):</strong> necesitas también <strong>Form 7076 (LLC Liability Insurance / Employee Bond)</strong>. La LLC requiere una <strong>liability policy de mínimo $1,000,000 agregado</strong> específicamente registrada con CSLB, O un <strong>LLC Employee/Worker Bond</strong> adicional al bond regular. Esto <em>no aplica</em> para Sole Props o Corporations.</p>

        <p><strong>Paso 2 — Form 13A-11 (Certification of Work Experience).</strong> Este form lo llena <em>tu empleador(es) previos</em>, bajo perjury, certificando que trabajaste journeyman-level. Necesitas <strong>4 años full-time (8,000 horas) en los últimos 10 años</strong>. Puedes partir los 4 años entre hasta 3 empleadores. El certificador debe incluir:</p>
        <ul>
          <li>Fechas exactas de employment</li>
          <li>Description del trabajo (debe mapear al scope de la classification)</li>
          <li>Su license number (si el certificador es contratista licenciado — preferred)</li>
          <li>Firma bajo penalty of perjury</li>
        </ul>

        <p>Si tu empleador ya no existe o no quiere firmar, puedes usar <strong>Form 13A-17 (Experience Verification)</strong> con W-2s, 1099s, tax returns, pay stubs, y declaración propia. El CSLB puede llamar a tus references — <em>sí llaman</em>, especialmente si tu experience se ve dudosa.</p>

        <p><strong>Paso 3 — Fingerprint LiveScan.</strong> Una vez que CSLB acepta tu application (te mandan carta de "Application Fee Paid"), te piden fingerprints vía <strong>Form BCIA 8016 (Request for LiveScan Service)</strong>. LiveScan es electronic fingerprinting — se hace en locations certificadas por el DOJ (oficinas de UPS Store, FedEx, locations independientes, police stations). Costo: <strong>~$49 DOJ + $32 FBI + $15-$25 fee del operador = $96-$106 total</strong>. Los resultados llegan al CSLB en 3-10 días. Si tienes felony record por construction fraud, drug trafficking, o violence — auto-rejection usualmente, aunque puedes apelar con rehabilitation evidence bajo B&amp;P §480.</p>

        <p><strong>Paso 4 — Examination.</strong> Después de fingerprint clearance, CSLB te manda carta con tu <strong>Notice to Appear</strong>. Tienes <strong>18 meses</strong> para pasar ambos exámenes. Se reserva online en <strong>PSI Exams (candidate.psiexams.com)</strong>. Locations: Ontario, Sacramento, Oakland, Fresno, San Diego, Santa Rosa, Norwalk, Glendale, San Bernardino. <strong>Trae:</strong> government ID con foto + notice to appear. <strong>NO trae:</strong> calculadora (te dan una), teléfono, papel, ni notas. Tiempo: 3.5h cada exam. Resultado inmediato (pass/fail, no te dicen el score exacto). Costo de retake si repruebas: <strong>$100 por intento adicional</strong>.</p>

        <p><strong>Paso 5 — Posting Bond + Initial License Fee.</strong> Cuando pasas ambos exámenes, CSLB manda el <strong>"Notice of Conditional Approval"</strong>. Tienes <strong>90 días</strong> para:</p>
        <ol>
          <li>Conseguir el <strong>Contractor's Bond de $25,000</strong> (veremos detalles en Sección 4)</li>
          <li>Si tienes empleados: comprar Workers Comp o presentar Exemption</li>
          <li>Si LLC: comprar la GL policy de $1M registrada con CSLB</li>
          <li>Pagar el <strong>Initial License Fee de $200</strong></li>
        </ol>
        <p>Si no cumples en 90 días, toda la aplicación se cancela y empiezas de cero.</p>

        <p><strong>Paso 6 — License Issued.</strong> Recibes tu <strong>license number</strong> (formato: 8 dígitos, ej. "1087654") y tu <strong>pocket card</strong>. También tu business sale en el public registry buscable en <strong>cslb.ca.gov/OnlineServices</strong>. Desde ahora, <strong>tu license number debe aparecer en todo:</strong> trucks, business cards, contratos, ads, website, estimates (B&amp;P §7030). Olvidarlo = citation de $1,000+.</p>

        <p><strong>Renewal:</strong> cada 2 años, $450, online vía <strong>CSLB Self-Service</strong>. Si te atrasas, hay grace period de 90 días con late fee de $225. Después de 90 días, tu licencia está <strong>expired</strong> y no puedes trabajar legalmente hasta renovar (o reinstatement si pasa >3 años).</p>
      `,
      keyPoints: [
        'Proceso completo: 3-6 meses desde application hasta license en mano',
        'Form 7065 principal; Form 7076 adicional si eres LLC (con GL $1M)',
        'Form 13A-11 firmado por ex-empleador bajo perjury (4 años/8,000 horas)',
        'LiveScan fingerprints = ~$96-$106 en location certificada DOJ',
        'PSI Exams: 18 meses para pasar después de approval, $100 por retake',
        '90 días post-exam para conseguir bond + WC + pagar $200 initial fee',
        'License number OBLIGATORIO en trucks, contratos, ads — §7030',
        'Renewal cada 2 años $450; expired >90 días = no puedes trabajar'
      ],
      realTalk: '"Te van a rechazar la primera application por algo tonto — dirección mal escrita, forma 13A-11 sin fecha, algo. Es parte del proceso. Mándalas certified mail con return receipt, guarda copias de TODO, y prepárate para una re-submission. No es personal."',
      checklist: [
        { item: 'Descargar Form 7065 de cslb.ca.gov/forms (última versión)', note: 'No uses forms viejos — los rechazan' },
        { item: 'Llenar Form 7065 con TYPEWRITER o black pen — no pencil', note: 'Digitales en PDF fillable son preferidas' },
        { item: 'Conseguir Form 13A-11 firmado por ex-patrón bajo perjury', note: 'Si es licenciado, incluir su license # — acelera aprobación' },
        { item: 'Agendar LiveScan en UPS Store o certified location cercana', note: 'Traer Form BCIA 8016 pre-filled con info del CSLB (ORI number A0724)' },
        { item: 'Comprar el Contractor\'s Guide oficial + practice exams de CSLB', note: 'Amazon ~$80 combo. Los practice exams valen cada centavo' },
        { item: 'Reservar PSI exam con 4-6 semanas de estudio planeado', note: 'candidate.psiexams.com, agenda morning slot (menos cansancio mental)' },
        { item: 'Pre-shop el Contractor\'s Bond con 3 brokers antes del notice', note: 'Para tener quotes listos al día 1 del 90-day window' },
        { item: 'Presupuestar $3,500-$5,000 total (fees + bond + insurance primer año)', note: 'Incluye: $330 app + $96 LiveScan + $200 license + $150-$500 bond + $600-$2000 GL + materiales de estudio' }
      ],
      commonMistakes: [
        'Poner PO Box como business address — rechazo automático, necesitas physical',
        'No incluir el ORI number (A0724) en el LiveScan form — fingerprints van al lugar equivocado',
        'Dejar pasar los 18 meses post-approval sin tomar el exam — empiezas desde cero',
        'Presentar Form 13A-11 firmado por alguien que no era tu direct supervisor',
        'Olvidar mandar el bond en los 90 días post-exam — application cancelada, pierdes $330+'
      ]
    },

    // ================================================================
    // SECTION 4 — BOND, GL, WORKERS COMP
    // ================================================================
    {
      id: 'bond-insurance',
      heading: 'Bond, GL, Workers Comp — Los Seguros Reales',
      body: `
        <p>Aquí es donde se pierde más dinero en California. Contractors confunden <strong>bond</strong> con <strong>insurance</strong>, no compran Workers Comp "porque soy yo solo", y terminan demandados por $250K sin poder dormir. Vamos a desenredar esto:</p>

        <p><strong>CONTRACTOR'S BOND — $25,000 (B&amp;P §7071.6).</strong> Obligatorio para TODAS las licencias desde Enero 2023 (antes era $15K). <strong>IMPORTANTE:</strong> un bond NO es insurance. Un bond es una <em>garantía financiera a favor del cliente/estado</em> — si tú la riegas (incumples contrato, dañas al cliente, no pagas a subs/empleados), el cliente le reclama al <strong>surety company</strong>, la surety le paga (hasta $25K), y luego <strong>la surety te cobra a TI</strong> el monto completo más legal fees. Es anti-contratista, no pro-contratista.</p>

        <p><strong>Costo real del bond:</strong> con buen credit score (720+): <strong>$125-$200/año</strong>. Credit score OK (650-720): <strong>$250-$500/año</strong>. Credit score malo (<650): <strong>$500-$1,500/año</strong> o requieren collateral (cash en escrow). Brokers recomendados: <strong>Brunswick Companies, SuretyBonds.com, JW Surety, Lance Surety</strong>. El bond se filea vía <strong>Form 13BQ-36 (Contractor's Bond)</strong>, el broker lo manda directo al CSLB.</p>

        <p><strong>Bond of Qualifying Individual — $12,500 adicional.</strong> Si tienes un <strong>RMO o RME</strong>, necesitas un segundo bond de $12,500 bajo B&amp;P §7071.9. Total entonces: $37,500 en bonds. Costo adicional: ~$75-$150/año.</p>

        <p><strong>GENERAL LIABILITY INSURANCE (GL).</strong> Esto SÍ es insurance real — te protege a TI. Cubre: daño a propiedad del cliente (causas fuego en attic instalando furnace = GL paga), bodily injury a third parties (homeowner tropieza con tu ladder = GL paga), completed operations (unit falla 6 meses después y causa daño = GL paga). <strong>California NO requiere GL para obtener licencia</strong> (excepto LLC que es $1M mínimo). PERO: ningún commercial job te deja entrar al site sin Certificate of Insurance (COI) mostrando $1M per occurrence / $2M aggregate.</p>

        <p><strong>Costo real de GL para HVAC:</strong></p>
        <ul>
          <li>Sole Owner, sin empleados, <$150K revenue: <strong>$600-$1,200/año</strong></li>
          <li>2-5 empleados, $300K-$500K revenue: <strong>$1,500-$3,000/año</strong></li>
          <li>Commercial focus, $1M+ revenue: <strong>$3,500-$8,000/año</strong></li>
          <li>Con subs regulares: add 15-25%</li>
        </ul>
        <p>Carriers recomendados para HVAC: <strong>The Hartford, Next Insurance, Thimble, Hiscox, Farmers, State Farm</strong>. Cuidado con <em>exclusions</em>: muchas policies excluyen "pollution" (refrigerant leaks!), "faulty workmanship" (defectos de instalación), y "subsidence". Lee antes de firmar.</p>

        <p><strong>LLC WORKERS COMP EXEMPTION.</strong> Si tu business es <strong>LLC con solo los managing members trabajando (no W-2 empleados)</strong>, los members están <strong>automáticamente exentos</strong> de Workers Comp bajo <strong>Labor Code §3351(c)</strong>. Pero el momento que contratas UN empleado W-2, aunque sea part-time 10 hours/week, <strong>WC es obligatorio desde el día 1</strong>. No hay exemption de "<5 empleados" en California (eso existe en otros estados, no aquí).</p>

        <p>Si eres <strong>Sole Owner</strong>: automáticamente exento de WC para ti mismo. <strong>Corporation</strong>: officers pueden aplicar para exemption vía <strong>Form DIR-E (Waiver of Workers Comp)</strong>. <strong>Partnership</strong>: partners exentos.</p>

        <p><strong>WORKERS COMPENSATION — COSTO REAL.</strong> California tiene las tarifas más altas del país. Para HVAC (class code <strong>5183 — Plumbing NOC</strong> o <strong>5190 — Electrical Wiring Within Buildings</strong>, depende del insurer), rates corren <strong>$8-$15 por cada $100 de payroll</strong>. Ejemplo: 1 empleado a $30/hora × 2,080 horas = $62,400 payroll. WC = $62,400 × 0.12 = <strong>$7,488/año SOLO por ese empleado</strong>. Por eso muchos contractors usan 1099 subcontractors (pero cuidado con AB5 misclassification — veremos eso en Bloque 4).</p>

        <p><strong>Carriers:</strong> <strong>State Compensation Insurance Fund (SCIF)</strong> — el "lender of last resort" estatal, acepta a todos. <strong>ICW Group, Zenith, Employers, AmTrust</strong> — comerciales, mejores rates si tienes experience modifier bueno (X-Mod <1.0).</p>

        <p><strong>Fraud penalties por no tener WC:</strong> <strong>Labor Code §3700.5</strong> — misdemeanor, hasta $10,000 multa Y 1 año cárcel. <strong>PLUS:</strong> stop-work order inmediato, $1,500/empleado × día sin cobertura. Un HVAC con 3 empleados sin WC que los cacha un empleado que se accidentó está viendo $100K+ de multas en una sola inspección. SCIF audita random.</p>

        <p><strong>COMMERCIAL AUTO INSURANCE.</strong> Tu póliza personal de auto <em>específicamente excluye</em> uso comercial. Si tu truck tiene tu logo o transporta tools/equipment, necesitas commercial auto. Costo: <strong>$1,500-$3,500/año por vehículo</strong> dependiendo de driving record y cobertura. Mínimo recomendado: $1M combined single limit. Carriers: <strong>Progressive Commercial, Geico Commercial, The Hartford, Nationwide</strong>. <em>Non-owned auto</em> coverage es importante si usas trucks de empleados.</p>
      `,
      keyPoints: [
        'Contractor Bond $25K obligatorio (§7071.6); protege al CLIENTE, no a ti',
        'Bond cuesta $125-$1,500/año según credit score; NO es insurance',
        'Bond of Qualifying Individual +$12,500 si tienes RMO/RME (§7071.9)',
        'GL NO obligatoria (excepto LLC $1M); costos reales $600-$8,000/año',
        'LLC members exentos de WC; Sole Owner exento; primer W-2 = WC obligatoria día 1',
        'WC para HVAC: $8-$15 por $100 payroll; class codes 5183 o 5190',
        'No tener WC: $10K multa + $1,500/día/empleado + cárcel + stop-work (§3700.5)',
        'Commercial auto $1,500-$3,500/año; personal policy NO cubre uso comercial'
      ],
      realTalk: '"El bond no te cubre a TI — cubre al cliente que te demande. Si te reclaman al bond, la surety te manda factura por los $25K al día siguiente. Y si no pagas, suspenden tu licencia. El bond es un instrumento para pagar al cliente con tu dinero, operado por un intermediario. Cómprate GL real aparte."',
      checklist: [
        { item: 'Shopear 3 surety companies para el bond ANTES de los 90 días post-exam', note: 'Brunswick, SuretyBonds, JW Surety — cotizar con FICO en mano' },
        { item: 'Comprar GL $1M/$2M mínimo aunque no sea requerida', note: 'Cualquier commercial GC te lo va a pedir antes de firmar sub-contract' },
        { item: 'Si LLC: obtener Certificate of GL específicamente para CSLB registration', note: 'El carrier te manda COI con CSLB como Certificate Holder' },
        { item: 'Si contrataras empleados: cotizar WC con SCIF + 2 privados', note: 'SCIF approval toma 30-60 días; empieza antes de necesitarla' },
        { item: 'Convertir auto personal a commercial si usas truck para work', note: 'Mención al agent: "business use, tools, signage" — no mientas' },
        { item: 'Leer exclusiones de GL — especialmente pollution (refrigerant) y faulty work', note: 'Si el carrier excluye refrigerant leaks, busca otro o compra endorsement' },
        { item: 'Guardar COIs en PDF para mandar a clientes en <5 minutos', note: 'Commercial clients los piden antes del job start — tenlo listo' },
        { item: 'Renew bond y GL 30 días antes del expiration', note: 'Lapso de cobertura = licencia suspended automáticamente' }
      ],
      commonMistakes: [
        'Pensar "tengo bond, estoy cubierto" — el bond te cobra a TI si alguien reclama',
        'Clasificar a empleados como "1099 contractors" para evitar WC — AB5 = $10K+ per worker misclassification',
        'Comprar GL mínima ($300K) y luego perder un commercial bid por no tener $1M/$2M',
        'Dejar lapse la renovación del bond — licencia auto-suspended, jobs en progreso se paran',
        'Usar auto personal para jobs comerciales — claim denial garantizado si hay accidente'
      ]
    },

    // ================================================================
    // SECTION 5 — RECIPROCITY
    // ================================================================
    {
      id: 'reciprocity',
      heading: 'Reciprocidad — Estados que Aceptan tu CA License',
      body: `
        <p>California tiene <strong>reciprocity agreements</strong> con 4 estados: <strong>Arizona (AZ), Nevada (NV), Utah (UT), y Louisiana (LA)</strong>. Pero <em>reciprocity no significa lo que crees</em>. Vamos a romper el mito:</p>

        <p><strong>Lo que reciprocity SÍ hace:</strong> te exenta del <strong>trade exam</strong> en el otro estado si tienes <strong>mínimo 5 años activos</strong> de tu classification equivalente en CA, <strong>sin suspensiones o revocations</strong> en los últimos 5 años, y tu licencia está <strong>active y en good standing</strong>. El trade exam es el que cubre específicamente HVAC, refrigeration, electrical, etc.</p>

        <p><strong>Lo que reciprocity NO hace:</strong></p>
        <ul>
          <li><strong>NO te exenta del Business/Law exam</strong> del otro estado. Cada estado tiene su propio law exam con sus propias reglas locales. Esto es donde el 70% tropieza porque piensan "ya pasé Law & Business en CA, estoy covered" — NO.</li>
          <li><strong>NO te exenta del bond</strong> local. Arizona requiere bond de $15K-$50K dependiendo de class. Nevada $15K+. Utah $3K-$50K. Louisiana $10K.</li>
          <li><strong>NO te exenta de residencia/physical address</strong>. La mayoría requieren que tengas un physical business address en el estado (o P.O. Box designated agent).</li>
          <li><strong>NO te exenta de Workers Comp/GL</strong> local — cada estado tiene sus propios requirements.</li>
          <li><strong>NO aplica a todas las classifications</strong> — algunas especialidades no están en el reciprocity agreement.</li>
        </ul>

        <p><strong>ARIZONA — ROC (Registrar of Contractors).</strong> Reciprocity aplica si tienes CA C-20, C-38, C-10, o B con 5+ años activos. Tomas solo el AZ Business Management exam (60 preguntas, 75% para pasar). Costo: <strong>$80 application + $30 exam + $480 license fee</strong>. Bond: <strong>$15,000 residential</strong> hasta <strong>$70,000 commercial</strong>. Puede que pidas tu Residential Recovery Fund fee ($370 one-time). AZ tiene <strong>dual license system</strong> — Residential license (KA) y Commercial (CR). Si trabajas ambos, dos licencias.</p>

        <p><strong>NEVADA — NSCB (State Contractors Board).</strong> Considerado el más strict del país. Reciprocity desde CA es para C-21 (HVAC) y algunos otros. Requisitos adicionales: <strong>Financial statement audited por CPA mostrando net worth mínimo</strong> (ej. $15K para tier 1). <strong>Law exam NV obligatorio</strong>. Bond: $1K-$500K según monetary limit. License fee: <strong>$300 examination + $600 license</strong>. NV también te pide <strong>fingerprint + background check por segunda vez</strong> aunque ya lo hiciste en CA.</p>

        <p><strong>UTAH — DOPL (Division of Occupational & Professional Licensing).</strong> Reciprocity para General Engineering, General Building, Electrical, Mechanical, Plumbing. HVAC cae bajo <strong>S-350 Mechanical Contractor</strong>. Requirements: CA license 5+ años activos, no disciplina, y pasar el <strong>Utah Business & Law exam</strong>. Bond NO se requiere state-level (algunos municipios sí). License fee: <strong>$195 + $55 exam</strong>. Utah es el más barato pero menos market (menos población).</p>

        <p><strong>LOUISIANA — LSLBC (State Licensing Board for Contractors).</strong> Reciprocity para commercial ($50K+) y residential ($75K+ new construction, $7.5K+ home improvement). HVAC bajo <strong>Mechanical Work</strong> classification. Requirements: CA license 5+ años, pass LA Business &amp; Law exam, financial statement mostrando net worth. License fee varies <strong>$100-$500+</strong>. Bond NO required state-level para la mayoría de classes.</p>

        <p><strong>ESTADOS QUE NO TIENEN RECIPROCITY CON CA:</strong> Oregon, Washington, Texas, Florida, New York, etc. En estos tienes que tomar AMBOS exámenes desde cero. Texas técnicamente no tiene state HVAC license — es handled por <strong>TDLR (Texas Department of Licensing and Regulation)</strong> con su propio sistema, pero no reconoce CA. Oregon requiere <strong>CCB (Construction Contractors Board)</strong> + <strong>Oregon-specific HVAC license</strong>.</p>

        <p><strong>El truco del multi-state contractor:</strong> algunos HVAC veteranos californianos sacan licencia en AZ o NV para expandir a Las Vegas, Phoenix, o Reno durante el shoulder season (cuando CA está slow en AC installs pero NV/AZ todavía calientes). Es legal, pero requiere <strong>dos juegos de insurance, dos bonds, dos sets de tax filings</strong>. Solo vale la pena si proyectas $200K+ revenue del segundo estado.</p>

        <p><strong>Interstate Work sin licencia local.</strong> Si vives en CA y te contratan para un emergency job en Reno, NV por 2 días — técnicamente necesitas NV license. Algunos estados tienen <strong>"temporary" o "emergency" permits</strong>, pero son raros. Mejor declina jobs fuera de estado a menos que estés licenciado ahí.</p>
      `,
      keyPoints: [
        'Reciprocity states: AZ, NV, UT, LA — exenta trade exam SI 5+ años CA license',
        'Reciprocity NO exenta Business/Law exam local — cada estado el suyo',
        'AZ ROC: dual license residential/commercial, bond $15K-$70K, $480 license fee',
        'NV NSCB: más strict, audited financials, fingerprint round 2, $900 total fees',
        'UT DOPL: S-350 Mechanical, el más barato ($250 total), menor market',
        'LA LSLBC: thresholds $75K residential/$50K commercial, varies $100-$500',
        'Texas, Oregon, Florida NO tienen reciprocity con CA — exámenes completos',
        'Multi-state solo vale pena si proyectas $200K+ revenue del segundo estado'
      ],
      realTalk: '"Muchos se emocionan con la reciprocity pensando que van a brincarse el proceso. Te brincas UN examen. Tienes que seguir haciendo aplicación nueva, pagar fees nuevos, pasar background check nuevo, comprar bond nuevo, conseguir insurance local. Es 60% del trabajo, no 10%."',
      checklist: [
        { item: 'Verificar que tu CA license tenga 5+ años activos SIN suspensiones', note: 'cslb.ca.gov/OnlineServices/CheckLicenseII para confirmar' },
        { item: 'Descargar reciprocity application específica del estado target', note: 'AZ: azroc.gov — NV: nscb.nv.gov — UT: dopl.utah.gov — LA: lslbc.louisiana.gov' },
        { item: 'Pre-pagar prep materials para Business/Law del estado target', note: 'NASCLA contractors guide cubre varios estados — ~$100' },
        { item: 'Cotizar bond y insurance en el estado target antes de aplicar', note: 'Tu CA bond NO cuenta para otro estado' },
        { item: 'Verificar que tu classification específica esté en el agreement', note: 'C-20 → AZ KA-38 o K-39, C-38 → AZ KB-38, etc. mapping varies' },
        { item: 'Calcular si el revenue proyectado justifica los costos duales', note: 'Rule of thumb: $150K+ annual revenue del nuevo estado' },
        { item: 'Establecer physical address o registered agent en el estado nuevo', note: 'Mail forwarding services + virtual office funcionan' }
      ],
      commonMistakes: [
        'Asumir que reciprocity = transfer automático — NO, es waiver de un solo exam',
        'Dejar que la CA license caiga a suspended — pierdes reciprocity el mismo día',
        'No leer scope de la classification equivalente — AZ KA-38 ≠ CA C-20 exactamente',
        'Aplicar sin los 5 años exactos — si vas a 4 años 10 meses, automatic denial',
        'Ignorar que necesitas cumplir con Workers Comp del estado nuevo si tienes crews locales'
      ]
    },

    // ================================================================
    // SECTION 6 — PERMITS AND TITLE 24
    // ================================================================
    {
      id: 'permits-title24',
      heading: 'Permits, Title 24, HERS — Compliance Real',
      body: `
        <p>Aquí es donde se pierde mucho dinero en California por ignorancia. El <strong>California Energy Code (Title 24, Part 6)</strong> es el más strict del país y se updatea cada 3 años (2022, 2025 next). Si instalas un AC change-out sin permit o sin HERS verification, te pueden <strong>forzar a demoler e instalar de nuevo</strong> a tu costo.</p>

        <p><strong>CUÁNDO NECESITAS PERMIT.</strong> Casi todo HVAC work en CA requiere permit. Specifically:</p>
        <ul>
          <li><strong>Replacement de furnace, AC condenser, heat pump, coil</strong> — permit requerido (mechanical permit)</li>
          <li><strong>Cualquier ductwork nuevo o modificación >10 feet</strong> — permit</li>
          <li><strong>Gas line work (furnace, water heater)</strong> — permit + plumbing trade</li>
          <li><strong>Electrical work sobre 240V (AC disconnect, panel tie-in)</strong> — permit eléctrico separado</li>
          <li><strong>Mini-split install</strong> — permit</li>
          <li><strong>Thermostat swap solo</strong> — usualmente NO permit (low-voltage only)</li>
          <li><strong>Freon recharge / leak repair same unit</strong> — usualmente NO permit</li>
          <li><strong>Filter change, blower motor replace</strong> — NO permit</li>
        </ul>

        <p><strong>QUIÉN PULLS THE PERMIT.</strong> En California, <em>el contratista licenciado</em> normalmente pulls the permit — no el homeowner. Si el homeowner pulls it, la ley los trata como <em>owner-builder</em> y ellos asumen toda la responsabilidad legal. <strong>Truco viejo:</strong> contractors sin licencia le dicen al homeowner "pull tú el permit para ahorrar" — eso es ilegal bajo B&amp;P §7044.1. El homeowner solo puede pull owner-builder permit si va a vivir en la casa 1+ año Y no la vendió en los últimos 3 años.</p>

        <p><strong>PENALIDADES POR TRABAJAR SIN PERMIT.</strong> Cada city tiene su propia schedule, pero típicamente:</p>
        <ul>
          <li><strong>Investigation fee:</strong> <strong>2x a 4x el permit fee normal</strong> (ej. permit normal $300 → $600-$1,200 investigation fee)</li>
          <li><strong>Stop-work order</strong> hasta que se obtain permit retroactivo</li>
          <li><strong>Demo order</strong> si el trabajo no cumple code — hay que re-instalar</li>
          <li><strong>CSLB citation</strong> adicional $1,000-$5,000</li>
          <li><strong>Civil liability</strong> al homeowner (si venden la casa y el comprador descubre unpermitted work, te demandan)</li>
        </ul>

        <p><strong>TITLE 24 PART 6 — ENERGY CODE.</strong> Esta es la biblia energética. Para HVAC, las reglas clave son:</p>
        <ul>
          <li><strong>SEER2/EER2 minimums:</strong> AC residential mínimo 14.3 SEER2 (antes 14 SEER). Heat pumps 14.3 SEER2 / 7.5 HSPF2</li>
          <li><strong>AFUE furnaces:</strong> 80% AFUE mínimo (Los nuevos codes empujan 92%+ condensing)</li>
          <li><strong>Duct sealing y testing</strong> — obligatorio en replacement. Leakage máx 15% del nominal airflow (antes 6% en alterations significativas)</li>
          <li><strong>Refrigerant charge verification</strong> — en climate zones 2, 8-15</li>
          <li><strong>Airflow verification</strong> — 350 CFM/ton mínimo, 400 CFM/ton preferred</li>
          <li><strong>Fan efficacy:</strong> ≤0.45 W/CFM (condensing furnace), ≤0.58 W/CFM (otros)</li>
        </ul>

        <p><strong>HERS RATER (Home Energy Rating System).</strong> Un <strong>HERS rater</strong> es un third-party inspector certificado por <strong>CalCERTS o CHEERS</strong> que verifica in-field que cumpliste el código. Tú como contratista HVAC <em>no puedes self-verify</em> la mayoría de los tests. El HERS rater:</p>
        <ul>
          <li>Mide <strong>duct leakage</strong> con blower door / duct tester</li>
          <li>Verifica <strong>refrigerant charge</strong> (weigh-in o sub-cooling/superheat)</li>
          <li>Mide <strong>airflow</strong> con flow grid o plenum pressure</li>
          <li>Verifica <strong>fan efficacy</strong> con amp clamp</li>
          <li>Emite el <strong>CF-3R certificate</strong> (Certificate of Field Verification &amp; Diagnostic Testing)</li>
        </ul>
        <p>Costo HERS testing: <strong>$300-$600 por job</strong>. Pass-through al cliente en el contrato.</p>

        <p><strong>LAS 3 FORMAS CRÍTICAS DE TITLE 24:</strong></p>
        <ul>
          <li><strong>CF-1R (Certificate of Compliance):</strong> lo llena <em>el designer o contratista</em> ANTES del permit. Dice "esto es lo que voy a instalar y cumple código". Se somete con el permit application.</li>
          <li><strong>CF-2R (Certificate of Installation):</strong> lo firma <em>el contratista</em> AL TERMINAR el job. Dice "instalé lo que dice el CF-1R, con estos specs exactos, de esta marca/modelo". Under penalty of perjury.</li>
          <li><strong>CF-3R (Certificate of Verification):</strong> lo llena <em>el HERS rater</em> después del testing. Dice "verifiqué que todo pasó y estos son los resultados de testing". Sin esto, el permit no cierra.</li>
        </ul>

        <p><strong>QII (Quality Insulation Installation).</strong> Opcional pero da compliance credit. Requiere HERS rater inspeccionar la instalación de insulation antes de cerrar walls. Si tu plan usa QII para comply, es mandatory en ese proyecto.</p>

        <p><strong>BUILDING DEPARTMENTS — CÓMO HABLAR CON PLAN CHECK.</strong> Cada city/county tiene su <em>building department</em>. Para HVAC replacements pequeños, muchos aceptan <strong>over-the-counter permits</strong> (mismo día, no plan check). Para jobs grandes (new construction, commercial, additions), necesitas <strong>plan check</strong> — review de 2-6 semanas.</p>

        <p><strong>Rejections más comunes de plan check:</strong></p>
        <ul>
          <li>Load calcs no attached o incorrectas (ACCA Manual J requerida para residential)</li>
          <li>Duct design sin Manual D submitted</li>
          <li>Equipment specs no match Title 24 minimums</li>
          <li>Electrical disconnect no dimensionado (60A minimum para AC standard)</li>
          <li>Combustion air calcs missing para furnace en closet</li>
          <li>Condensate drain routing a drainage aprobada (no a dirt)</li>
          <li>Seismic strapping missing para water heater o large equipment</li>
        </ul>

        <p><strong>SB-721 / SB-326 (Balcony Inspections).</strong> No son directamente HVAC, pero: si trabajas en <strong>multifamily buildings 3+ units con balconies/decks elevados</strong>, hay inspecciones obligatorias cada 6 (SB-326 condos) o 9 años (SB-721 apartments) por deterioration. Relevante porque penetraciones de HVAC ductwork en balconies cuentan para structural integrity assessment — document carefully.</p>
      `,
      keyPoints: [
        'Permit obligatorio para ~90% de HVAC work en CA (change-outs, ductwork, gas, electrical)',
        'Contractor pulls permit (no homeowner) bajo B&P §7044.1',
        'Trabajar sin permit = 2-4x investigation fee + stop-work + posible demo order',
        'Title 24 Part 6: 14.3 SEER2 AC, 80% AFUE furnace mínimo, duct leakage ≤15%',
        'HERS Rater (CalCERTS/CHEERS) verifica duct, refrigerant, airflow — $300-$600/job',
        'CF-1R (design), CF-2R (installer), CF-3R (HERS verification) — las 3 críticas',
        'Plan check rejections: Manual J missing, specs no match, disconnect sizing, combustion air',
        'SB-326 (condo 6yr) / SB-721 (apt 9yr) balcony inspections — affect HVAC penetrations'
      ],
      realTalk: '"El homeowner te dice: compa, no saques permit que ya pagué el AC al cash. Tú le dices: si no saco permit, pierdo mi licencia y tú no puedes vender la casa en 5 años sin disclosing unpermitted work. El permit cuesta $400 y te ahorra un litigio de $50K."',
      checklist: [
        { item: 'Pull mechanical permit ANTES de ordenar equipment', note: 'Si plan check rechaza specs, evitas comprar unit wrong' },
        { item: 'Llenar CF-1R con specs exactos (marca/modelo/SEER2/AFUE)', note: 'Cambios después = revision permit + new review' },
        { item: 'Run Manual J antes del permit submission', note: 'Wrightsoft Right-Suite o CoolCalc — $100/job' },
        { item: 'Agendar HERS rater al mismo tiempo que programs install', note: 'Raters tienen waits de 1-3 semanas en temporada' },
        { item: 'Firmar y entregar CF-2R al rater cuando termines install', note: 'Sin CF-2R, el rater no puede hacer CF-3R' },
        { item: 'Confirmar que HERS rater es certified en CalCERTS o CHEERS', note: 'calcerts.com / cheers.org tienen buscadores' },
        { item: 'Agendar final inspection con building inspector', note: 'Green tag = permit cerrado, job oficialmente completo' },
        { item: 'Archivar permit docs + CF-1R + CF-2R + CF-3R por 10 años', note: 'Statute of limitations constructive defect = 10 años' }
      ],
      commonMistakes: [
        'Instalar sin permit "porque el cliente no quiere pagar" — liability personal por 10 años',
        'Usar HERS rater no-certified o cuñado con "experience" — CF-3R no válido',
        'Olvidar el CF-2R y pensar que el rater lo hace — NO, es tu responsabilidad firmarlo',
        'Subir SEER de lo que puso el CF-1R sin submit revision — inspector cacha el mismatch',
        'Copy-paste Manual J de otro proyecto con squarefootage similar — inspector pide house-specific'
      ]
    },

    // ================================================================
    // SECTION 7 — CONTRACTS, LIENS, STATUTE
    // ================================================================
    {
      id: 'contracts-liens',
      heading: 'Contratos, Mechanics Liens, Estatuto de Limitaciones',
      body: `
        <p>Un contrato mal hecho te puede costar más que el job entero. Un lien mal filed y pierdes $50K. Vamos a lo específico de California:</p>

        <p><strong>CONTRATOS OBLIGATORIOS PARA HOME IMPROVEMENT.</strong> B&amp;P §7159 es tu biblia. Para TODO job residencial sobre <strong>$500</strong>, el contrato DEBE tener (en escrito, firmado antes de empezar):</p>
        <ul>
          <li><strong>Nombre, dirección, license number del contratista</strong> (en cada página del contrato ideally)</li>
          <li><strong>Approximate start date y completion date</strong></li>
          <li><strong>Description detallada del trabajo</strong> (no vago como "install AC" — debe decir marca, modelo, tonelaje, SEER, scope)</li>
          <li><strong>Total contract price</strong> y breakdown de payment schedule</li>
          <li><strong>Down payment disclosure:</strong> "El down payment no puede exceder $1,000 o 10% del total, lo que sea menor" (verbatim requerido por código)</li>
          <li><strong>Notice of Cancellation</strong> — 2 copias al cliente, en letra <strong>mínimo 10pt bold</strong>, con el idioma exacto del CA Civil Code §1689.7</li>
          <li><strong>Right to Cancel:</strong> 3 días hábiles standard; 5 días si el cliente es <strong>65+ años</strong>; 7 días si el job es en un <strong>disaster area</strong> declared</li>
          <li><strong>Mechanics Lien Warning</strong> — párrafo específico en letra 10pt bold explicando que subs pueden filear lien contra la casa</li>
          <li><strong>Commercial General Liability statement</strong> — si tienes o no tienes GL (no obligatorio tenerla, pero obligatorio disclose)</li>
          <li><strong>Workers Comp statement</strong> — similar disclosure</li>
          <li><strong>Arbitration clause</strong> — si la incluyes, debe ser clearly marked y el cliente debe iniciar además de firmar</li>
        </ul>

        <p><strong>PROGRESS PAYMENTS.</strong> Bajo §7159, no puedes cobrar progress payments que excedan el <em>value of work performed</em>. Ejemplo: si completaste 30% del job, no puedes pedir 70%. Los milestones más usados:</p>
        <ul>
          <li>Down payment: 10% ($1,000 max)</li>
          <li>Material delivery a site: 25-30%</li>
          <li>Rough-in completed: 25-30%</li>
          <li>Final inspection passed + all CFs submitted: 25-35%</li>
          <li>Retention (opcional): 5-10% held 30 días</li>
        </ul>

        <p><strong>3-DAY RIGHT OF RESCISSION.</strong> El cliente tiene derecho federal (Cooling-Off Rule) Y estatal (§1689.6) de cancelar el contrato sin penalty dentro de <strong>3 días hábiles después de firmar</strong>. Si trabajas antes de los 3 días y ellos cancelan, <strong>tienes que deshacer el trabajo a tu costo</strong> Y regresar cualquier pago. Solo cobras si hay <strong>"emergency waiver"</strong> firmado por el cliente renunciando al right to cancel (ej. AC broken in heat wave).</p>

        <p><strong>MECHANICS LIENS — EL SUPERPODER DEL CONTRATISTA.</strong> Bajo <strong>California Civil Code §8000-8848</strong>, si trabajas en una propiedad y no te pagan, puedes fichar un <strong>mechanics lien</strong> contra la propiedad. El lien es un encumbrance en el título — el dueño no puede vender/refinanciar sin satisfacer el lien.</p>

        <p><strong>PASO 1 — PRELIMINARY NOTICE (20-DAY NOTICE).</strong> Antes de poder filear lien, TIENES que mandar un <strong>Preliminary Notice</strong> dentro de <strong>20 días de empezar trabajo o delivery de materiales</strong>. Esta notice va a: (1) el owner, (2) el general contractor (si tú eres sub), (3) el construction lender si hay uno. Contenido obligatorio bajo §8202:</p>
        <ul>
          <li>Tu nombre + address + license number</li>
          <li>Description del trabajo/material</li>
          <li>Estimate del total (puede ser approximate)</li>
          <li>Legal description de la propiedad O la street address</li>
          <li>Statement que explica el lien right (verbatim required)</li>
        </ul>

        <p>Se manda <strong>certified mail return receipt requested</strong> o personal service. <strong>SI NO MANDAS el preliminary notice en 20 días, pierdes el right to lien todo lo anterior.</strong> Puedes mandarlo tarde, pero solo cubrirá trabajo hecho desde 20 días antes de la notice.</p>

        <p><strong>PASO 2 — MECHANICS LIEN CLAIM.</strong> Si no te pagan, fileas el lien claim en el <strong>County Recorder's Office</strong> del condado donde está la propiedad. Timelines:</p>
        <ul>
          <li><strong>Si el GC firmó notice of completion:</strong> 60 días</li>
          <li><strong>Si no hay notice of completion:</strong> 90 días desde cessation of labor</li>
        </ul>

        <p>Costo de filear: <strong>~$95 recording fee</strong>. El lien debe incluir: amount owed, labor/materials description, address de la propiedad, y proof of service del preliminary notice.</p>

        <p><strong>PASO 3 — FORECLOSURE.</strong> Tienes <strong>90 días desde el lien filing</strong> para filear lawsuit de lien foreclosure en Superior Court. Si no fileas en 90 días, el lien expires automáticamente y pierdes todo. Una vez en court, puedes obtener <strong>order of sale</strong> forzando que la casa se venda para pagarte.</p>

        <p><strong>STOP-PAYMENT NOTICE (alternative al lien).</strong> Si hay <em>construction lender</em>, puedes mandar <strong>stop-payment notice</strong> al lender en vez de lien. El lender debe hold funds suficientes para cubrir tu claim. Se usa especialmente en commercial new construction.</p>

        <p><strong>10-YEAR STATUTE OF LIMITATIONS — CONSTRUCTION DEFECTS.</strong> Bajo <strong>CCP §337.15</strong>, el cliente puede demandarte por <strong>latent defects</strong> (defectos ocultos) hasta <strong>10 años después de substantial completion</strong>. "Patent defects" (obvios) son 4 años. Ejemplos de latent HVAC defects:</p>
        <ul>
          <li>Refrigerant line que pinchaste durante install, leak slow, falla a año 3</li>
          <li>Duct joint mal sealed, causa mold growth, descubierto año 5</li>
          <li>Combustion air inadecuado, CO buildup, descubierto año 6</li>
          <li>Condensate drain blocked improperly, causa water damage, año 4</li>
        </ul>

        <p>Por eso <strong>guarda tus records</strong> (permits, CFs, photos, sign-offs) por <strong>mínimo 10 años</strong> — idealmente 12 para seguridad. Si el cliente demanda año 9, tus records de año 1 salvan tu licencia.</p>

        <p><strong>SB 800 (Right to Repair Act) — Civil Code §895-945.5.</strong> Para homes construidas/major renovated post-2003, establece un pre-litigation process. El cliente debe dar notice de defecto, darte oportunidad de inspect y reparar, antes de demandar. Te protege SI respondes dentro de los timeframes (14 días acknowledge, 14 días después propose inspection, etc.).</p>

        <p><strong>ARBITRATION vs LITIGATION.</strong> Si tu contrato tiene arbitration clause válida, disputes van a arbitration (AAA o JAMS usually) en vez de corte. <strong>Ventajas arbitration:</strong> más rápido (6-12 meses vs 2-3 años), más privado, menos costly si ganas. <strong>Desventajas:</strong> no hay appeal, arbitrator fees pueden ser $300-$500/hora split entre partes, limited discovery.</p>
      `,
      keyPoints: [
        'Contrato obligatorio >$500 bajo §7159 con license #, scope, payment schedule, cancel notice',
        'Down payment máximo $1,000 o 10% (el menor); 3-day cancel standard, 5 para 65+, 7 disaster',
        'Preliminary Notice 20-day obligatorio para preservar lien rights (§8202)',
        'Mechanics lien filed en County Recorder: 60 días post-NOC o 90 días cessation',
        '90 días post-lien para filear foreclosure lawsuit — expires si no lo haces',
        'Stop-payment notice al construction lender como alternativa al lien',
        'Statute of limitations: 10 años latent defects, 4 años patent (CCP §337.15)',
        'SB 800 right to repair: pre-litigation process para homes post-2003',
        'Arbitration clause útil pero requiere iniciales separadas del cliente'
      ],
      realTalk: '"El preliminary notice de 20 días es el tatuaje del contratista serio. Lo mandas el día 1, certified mail, aunque sientas que el cliente es tu amigo. Cuando el amigo no paga al mes 3, ese papelito es la diferencia entre $30K cobrados o $30K perdidos. Papelito mata amistad."',
      checklist: [
        { item: 'Usar template de contrato CSLB-compliant ($100-$300 una vez al abogado)', note: 'NO uses template random de internet — puede faltar clauses' },
        { item: 'Incluir Notice of Cancellation en 10pt bold, 2 copias, separate page', note: 'Si falta, contrato entero void bajo §7159' },
        { item: 'Mandar Preliminary 20-day Notice DÍA 1 de cada job', note: 'LevelSet o SunRay Construction Solutions automatizan esto' },
        { item: 'Foto-documentar el job diariamente (before/during/after)', note: 'JobNimbus, CompanyCam, o Google Photos con location tag' },
        { item: 'Guardar copia de TODOS los permits y CFs por 10+ años', note: 'Cloud backup (Dropbox/Google Drive) organizado por address' },
        { item: 'Include arbitration clause con initial required separadamente', note: 'JAMS o AAA como arbitrator, venue en tu county' },
        { item: 'Stop-work inmediato si cliente no hace progress payment', note: 'Documenta el stop via email/text con reason' },
        { item: 'Si lien es necessary, filear dentro de 60/90 día window estricto', note: 'Attorney consultation $300-$500 vale cada centavo' }
      ],
      commonMistakes: [
        'Empezar trabajo sin contrato firmado — imposible enforce anything',
        'Cobrar "down payment" de 30% porque "así siempre lo hago" — violación §7159 = citation',
        'Olvidar mandar preliminary notice — pierdes lien rights completos',
        'Filear lien después del 60/90 día window — void, cero recovery',
        'Botar los records del job a los 3 años — defensa contra demanda año 7 = imposible'
      ]
    }
  ],

  resources: [
    { label: 'CSLB License Application Portal', url: 'https://www.cslb.ca.gov/Contractors/Applicants/', type: 'link' },
    { label: 'CSLB Forms Library (7065, 7076, 13A-11, etc.)', url: 'https://www.cslb.ca.gov/Resources/Forms.aspx', type: 'link' },
    { label: 'CSLB License Classifications Scope of Work', url: 'https://www.cslb.ca.gov/About_Us/Library/Licensing_Classifications/', type: 'link' },
    { label: 'CA DIR Workers Compensation', url: 'https://www.dir.ca.gov/dwc/', type: 'link' },
    { label: 'State Compensation Insurance Fund (SCIF)', url: 'https://www.scif.com/', type: 'link' },
    { label: 'California Energy Code Title 24 (2022)', url: 'https://www.energy.ca.gov/programs-and-topics/programs/building-energy-efficiency-standards', type: 'link' },
    { label: 'CalCERTS HERS Rater Registry', url: 'https://www.calcerts.com/', type: 'link' },
    { label: 'CHEERS HERS Rater Registry', url: 'https://cheers.org/', type: 'link' },
    { label: 'PSI Exams (CSLB Testing)', url: 'https://candidate.psiexams.com/', type: 'link' },
    { label: 'CA Business & Professions Code §7000-7191', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=BPC&division=3.&title=&part=&chapter=9.&article=', type: 'link' },
    { label: 'AZ Registrar of Contractors (Reciprocity)', url: 'https://roc.az.gov/', type: 'link' },
    { label: 'Nevada State Contractors Board', url: 'https://nscb.nv.gov/', type: 'link' },
    { label: 'Utah DOPL (Contractors)', url: 'https://dopl.utah.gov/contractor/', type: 'link' },
    { label: 'Louisiana State Licensing Board', url: 'https://lslbc.louisiana.gov/', type: 'link' },
    { label: 'California Mechanics Lien Statutes (CC §8000-8848)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=CIV&division=4.&title=&part=6.&chapter=&article=', type: 'link' },
    { label: 'IRS EIN Application (Online)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online', type: 'link' },
    { label: 'CA CDTFA Seller\'s Permit', url: 'https://www.cdtfa.ca.gov/services/permits-licenses.htm', type: 'link' },
    { label: 'Dun & Bradstreet DUNS Number Application', url: 'https://www.dnb.com/duns.html', type: 'link' }
  ],

  glossary: [
    { term: 'CSLB', def: 'Contractors State License Board — agencia reguladora de contratistas en California bajo el Department of Consumer Affairs. Regula ~290,000 licencias, emite citations, investiga quejas.' },
    { term: 'B&P Code §7000-7191', def: 'Business & Professions Code, la ley principal de contratistas en CA. Define license requirements, scope of work, penalidades. Leerla completa toma 2 horas y te ahorra $50K.' },
    { term: 'Bond (Contractor\'s Bond)', def: 'Fianza de $25,000 obligatoria que protege al CLIENTE (no al contratista) si la riegas. La surety paga al cliente, luego te cobra a ti el monto completo. No es insurance.' },
    { term: 'Bond of Qualifying Individual', def: 'Bond adicional de $12,500 si usas un RMO/RME en tu licencia (§7071.9). Protege contra malfeasance del qualifier.' },
    { term: 'RMO / RME', def: 'Responsible Managing Officer/Employee. Persona licenciada que "presta" experiencia a un business que no califica por sí solo. Debe ser empleado 32+ hrs/semana.' },
    { term: 'Qualifier', def: 'La persona física cuya experiencia califica la licencia — puede ser el owner (si tiene 4 años) o un RMO/RME.' },
    { term: 'LiveScan', def: 'Electronic fingerprinting obligatorio para CSLB licensing. Resultados al DOJ+FBI en 3-10 días. Costo ~$96-$106 en location certificada.' },
    { term: 'Form 7065', def: 'CSLB Application for Original Contractor License — la aplicación principal de 15 páginas. Describe tu business, classifications, qualifier.' },
    { term: 'Form 13A-11', def: 'Certification of Work Experience — firmado bajo perjury por tu ex-empleador certificando 4 años journeyman.' },
    { term: 'Form 7076', def: 'LLC Liability Insurance form — requerido solo si aplicas como LLC. Registra tu GL de $1M con CSLB.' },
    { term: 'GL (General Liability)', def: 'Insurance que cubre property damage y bodily injury a third parties causados por tu trabajo. $1M/$2M standard. No obligatoria en CA excepto LLC.' },
    { term: 'Workers Comp (WC)', def: 'Insurance obligatoria si tienes ANY W-2 empleado. Cubre lesiones en el trabajo. Class code 5183/5190 para HVAC, $8-$15 por cada $100 payroll.' },
    { term: 'LLC Exemption', def: 'Members de una LLC están automáticamente exentos de WC bajo Labor Code §3351(c). Solo aplica si NO hay W-2 empleados.' },
    { term: 'SCIF', def: 'State Compensation Insurance Fund — carrier estatal de WC, lender of last resort que acepta a todos los contractors. Sus rates son baseline.' },
    { term: 'X-Mod / Experience Modifier', def: 'Factor multiplicador en tu WC premium basado en historial de claims. <1.0 = descuento, >1.0 = recargo. Affects tus rates por 3 años.' },
    { term: 'Reciprocity', def: 'Acuerdo entre estados que exenta el TRADE exam (no el Business/Law exam) para contractors licenciados. CA tiene con AZ, NV, UT, LA.' },
    { term: 'Title 24 Part 6', def: 'California Energy Code — el más strict del país. Define minimums de SEER2, AFUE, duct leakage, fan efficacy. Updates cada 3 años.' },
    { term: 'HERS Rater', def: 'Home Energy Rating System rater — third-party inspector certificado por CalCERTS o CHEERS que verifica compliance de Title 24. Costo $300-$600/job.' },
    { term: 'CF-1R', def: 'Certificate of Compliance — lo llena designer/contractor ANTES del permit. "Aquí está lo que voy a instalar y cumple código."' },
    { term: 'CF-2R', def: 'Certificate of Installation — firmado por el contratista AL TERMINAR, bajo perjury. "Instalé exactamente lo del CF-1R."' },
    { term: 'CF-3R', def: 'Certificate of Verification — firmado por el HERS rater después de testing. Sin esto, permit no cierra.' },
    { term: 'QII', def: 'Quality Insulation Installation — opcional en Title 24, da compliance credit. Requiere HERS rater inspect insulation pre-drywall.' },
    { term: 'Manual J', def: 'ACCA Manual J — load calculation residencial obligatoria en plan check. Calcula BTU/hr heating y cooling basado en envelope.' },
    { term: 'Preliminary Notice (20-day)', def: 'Notice obligatoria mandada en 20 días de empezar trabajo para preservar mechanics lien rights. Sin esta, pierdes derecho a lien lo anterior (§8202).' },
    { term: 'Mechanics Lien', def: 'Encumbrance contra título de propiedad si el contratista no recibió pago. Se filea en County Recorder. Poder fuerte de cobro.' },
    { term: 'Stop-Payment Notice', def: 'Alternativa al lien — notice al construction lender forzándolo a hold funds para tu claim. Común en commercial.' },
    { term: 'Notice of Completion (NOC)', def: 'Documento filed por owner cuando job sustancialmente termina. Dispara 60-day lien deadline.' },
    { term: 'Right of Rescission (3-day)', def: 'Derecho del cliente residencial de cancelar contrato sin penalty en 3 días hábiles (5 seniors, 7 disaster). Required notice en contrato.' },
    { term: 'Statute of Limitations (10-year)', def: 'CCP §337.15 — cliente puede demandar por latent defects hasta 10 años post-completion. Guarda records mínimo 10 años.' },
    { term: 'SB 800 (Right to Repair)', def: 'Civil Code §895-945.5, homes post-2003. Pre-litigation process con notice-to-repair obligatorio antes de lawsuit.' },
    { term: 'Owner-Builder', def: 'Homeowner que pulls su propio permit bajo §7044. Solo legal si vive en casa 1+ año y no vendió en 3 años.' },
    { term: 'EIN', def: 'Employer Identification Number — federal tax ID del IRS. Obligatorio si tienes empleados, LLC multi-member, o corporation. Gratis online.' },
    { term: 'Seller\'s Permit', def: 'Permit de la CA CDTFA para colectar sales tax cuando vendes equipment al cliente. Free pero obligatorio si resells material.' },
    { term: 'DUNS Number', def: 'Dun & Bradstreet unique 9-digit identifier. Obligatorio para federal contracts y muchos commercial bids. Gratis pero lento (~30 días).' },
    { term: 'SB-721 / SB-326', def: 'Balcony inspection laws para multifamily 3+ units. SB-326 condos (6yr cycle), SB-721 apartments (9yr cycle). Affect HVAC penetraciones.' }
  ]
};
