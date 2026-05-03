window.CONTRACTOR_BLOQUE_3 = {
  number: 3,
  title: 'Contratos y Cobranza',
  tagline: 'Escribe contratos que te protejan — y cobra lo que te deben',
  intro: `
    <p><strong>Un contrato no es papeleo — es tu primera línea de defensa.</strong> El 80% de los contratistas HVAC latinos que pierden dinero en California no lo pierden por mal trabajo: lo pierden porque firmaron (o no firmaron) un contrato malo. Demandas de $50K, clientes que no pagan los últimos $8K, change orders verbales que el cliente "no recuerda", liens presentados fuera de plazo… todo eso se evita con 3 páginas bien escritas.</p>
    <p>En este bloque te voy a enseñar, en español directo y con las citas legales de California exactas, cómo escribir contratos que el CSLB acepta, cómo cobrar usando el Mechanics Lien (el arma legal más poderosa que tienes como contratista), y cómo manejar clientes morosos sin gastar $5,000 en abogado.</p>
    <p>Cubrimos: las <strong>cláusulas obligatorias por ley</strong> (B&P 7159), la diferencia brutal entre contratos residenciales y comerciales, la anatomía de una propuesta a prueba de balas, el límite legal del 10%/$1,000 en down payment, el proceso completo de Preliminary 20-Day Notice → Mechanics Lien → Foreclosure, lien waivers condicionales vs incondicionales (CCP 8132-8138), retention release (SB-293), demand letters, small claims ($10K), arbitration vs litigation, warranties, e integración con financieras como GreenSky y Synchrony.</p>
    <p><strong>Regla #1:</strong> Si no está firmado, no existe. Nunca empieces trabajo con un "luego firmamos." Nunca hagas un change order verbal. Nunca aceptes un 50% down en residencial bajo $1,000 (es ilegal y te pueden suspender la licencia).</p>
    <p><strong>Regla #2:</strong> El Mechanics Lien es el gran igualador. Un contratista solo con una licencia C-20 y un Preliminary Notice bien presentado puede forzar a una corporación millonaria a pagarle. Pero hay que hacerlo dentro de los plazos exactos — este bloque te da esos plazos al día.</p>
  `,
  sections: [
    {
      id: 'cslb-required-clauses',
      heading: 'Cláusulas Obligatorias por CSLB (B&P 7159)',
      body: `
        <p>California <strong>Business & Professions Code Section 7159</strong> es la biblia del contrato residencial de home improvement. Si tu contrato no contiene estas cláusulas, <strong>el contrato es anulable por el cliente</strong> y el CSLB te puede suspender la licencia. Esto aplica a cualquier trabajo residencial de home improvement sobre $500 (mano de obra + material), incluyendo instalación o reemplazo de HVAC, ductos, mini-splits, furnaces, ACs.</p>

        <h4>Las 10 cláusulas obligatorias que tu contrato debe contener:</h4>
        <ol>
          <li><strong>Nombre, dirección y número de licencia del contratista</strong> (CSLB #, classification C-20, C-38, C-10 según aplique). No basta con DBA — tiene que aparecer el <em>legal name</em> de la entidad licenciada.</li>
          <li><strong>Descripción del trabajo y materiales</strong> — específico. "Instalar AC" NO es suficiente. Debe decir: "Instalar 1 condensador Carrier 25VNA424A000 de 2 toneladas SEER 18, 1 evaporador CNPVP3017, 30 ft línea de refrigerante 3/8"+7/8" aislada, breaker 30A, disconnect 60A, drain line PVC 3/4", pad plástico 36x36". Remover y desechar unidad existente."</li>
          <li><strong>Precio total del contrato</strong> en dólares.</li>
          <li><strong>Payment schedule</strong> con cantidades específicas y qué milestone libera cada pago (ver sección 5).</li>
          <li><strong>Down payment NO mayor al 10% del contrato o $1,000, LO QUE SEA MENOS.</strong> Esto es no-negociable (B&P 7159(d)).</li>
          <li><strong>Fecha aproximada de inicio y fecha aproximada de terminación.</strong></li>
          <li><strong>"Notice to Owner"</strong> — la notificación obligatoria sobre Mechanics Lien que DEBE aparecer textualmente (CSLB publica el lenguaje en inglés Y en español).</li>
          <li><strong>3-Day Right to Cancel</strong> (o 5 días si el cliente es senior 65+ o disabled) — con el formulario de cancelación adjunto. Si no incluyes este aviso, el cliente puede cancelar en cualquier momento sin penalidad.</li>
          <li><strong>Commercial General Liability insurance</strong> disclosure — si tienes o no tienes GL, y el carrier.</li>
          <li><strong>Workers' Comp disclosure</strong> — número de póliza o declaración de "no empleados".</li>
        </ol>

        <h4>Lenguaje exacto del "Notice to Owner" (obligatorio palabra por palabra):</h4>
        <p style="background:#f4f4f4;padding:12px;border-left:3px solid #111;font-family:monospace;font-size:12px;"><strong>"Under the California Mechanics Lien Law, any contractor, subcontractor, laborer, supplier, or other person or entity who helps to improve your property, but is not paid for his or her work or supplies, has a right to place a lien on your home, land, or property where the work was performed and to sue you in court to obtain payment..."</strong> (texto completo publicado por CSLB, debe ir textualmente).</p>

        <h4>Lenguaje del 3-Day Right to Cancel:</h4>
        <p style="background:#f4f4f4;padding:12px;border-left:3px solid #111;font-family:monospace;font-size:12px;">"You, the buyer, have the right to cancel this contract within three business days. You may cancel by e-mailing, mailing, faxing, or delivering a written notice to the contractor at the contractor's place of business by midnight of the third business day after you received a signed and dated copy of the contract..."</p>

        <p><strong>Ojo con seniors:</strong> Si el cliente tiene 65 años o más, el derecho a cancelar es de <strong>5 días</strong>, no 3. Muchos contratistas se equivocan en esto y pierden el caso en corte.</p>
      `,
      keyPoints: [
        'B&P 7159 aplica a todo home improvement residencial sobre $500',
        'Down payment MÁXIMO: 10% o $1,000, lo que sea MENOS',
        'Notice to Owner y 3-Day Right to Cancel deben ir TEXTUALMENTE',
        'Seniors 65+ tienen 5 días para cancelar, no 3',
        'Sin estas cláusulas el contrato es anulable y arriesgas la licencia',
        'El contrato completo debe estar en el idioma que se negoció (si negociaste en español, dale versión en español)'
      ],
      realTalk: '"El handshake deal solo funciona hasta el día que te toque un cliente loco. Un contrato de 3 páginas te ahorra $50K en demanda. He visto contratistas perder la licencia no por mal trabajo, sino por cobrar $2,000 de down en un job de $10K. El cliente llama al CSLB y en 90 días te suspenden."',
      checklist: [
        'Licencia CSLB # visible en header del contrato',
        'Scope of work específico por modelo y cantidad',
        'Precio total + payment schedule en dólares',
        'Down payment verificado: ≤ 10% o ≤ $1,000',
        'Notice to Owner copiado textualmente de CSLB',
        '3-Day Right to Cancel form adjunto (5-day si senior)',
        'GL y Workers Comp disclosure',
        'Firma del cliente Y tu firma, con fecha',
        'Cliente se lleva copia firmada antes de que empiece el trabajo'
      ],
      commonMistakes: [
        'Pedir 50% down en residencial bajo — es ilegal, te suspenden',
        'Usar templates de Florida o Texas — no cumplen B&P 7159',
        'Escribir "Install HVAC system" sin modelos — anulable',
        'Olvidar la versión en español si el cliente es hispanohablante',
        'No entregar copia firmada al cliente antes de empezar',
        'Empezar trabajo antes de que pasen los 3 días de rescission — si cancela, pierdes todo el material instalado'
      ]
    },
    {
      id: 'residential-vs-commercial',
      heading: 'Residencial vs Comercial — Dos Mundos Diferentes',
      body: `
        <p>Muchos contratistas HVAC fracasan cuando saltan de residencial a comercial porque usan el mismo contrato. <strong>Son dos universos legales completamente distintos.</strong></p>

        <h4>Residencial (Home Improvement)</h4>
        <ul>
          <li><strong>Ley aplicable:</strong> B&P 7159 (Home Improvement Contract)</li>
          <li><strong>Formato:</strong> CSLB-approved o tu versión custom que cumpla 7159</li>
          <li><strong>Down payment:</strong> ≤ 10% o $1,000, lo que sea menos</li>
          <li><strong>Cancelación:</strong> 3 días (5 si senior)</li>
          <li><strong>Protecciones al consumidor:</strong> MUY fuertes — el CSLB está del lado del homeowner casi siempre</li>
          <li><strong>Pago típico:</strong> Cash, check, tarjeta, o financiera (GreenSky/Synchrony)</li>
          <li><strong>Disputa:</strong> CSLB complaint → mediation → small claims ($10K) o Superior Court</li>
          <li><strong>Mechanics Lien aplicable:</strong> SÍ, siempre</li>
          <li><strong>Preliminary 20-Day Notice:</strong> NO obligatorio si contrataste directo con el homeowner (pero recomendado para subs)</li>
        </ul>

        <h4>Comercial</h4>
        <ul>
          <li><strong>Ley aplicable:</strong> California Commercial Code, B&P 7150+, y términos negociados</li>
          <li><strong>Formato:</strong> AIA A101/A201 (standard en la industria), ConsensusDocs, o contrato custom del GC</li>
          <li><strong>Down payment:</strong> SIN límite legal — negociable (típico 0% en comercial grande, progress billing mensual)</li>
          <li><strong>Cancelación:</strong> Sin derecho automático — según contrato</li>
          <li><strong>Protecciones:</strong> Ambos lados son "sofisticados" — los tribunales asumen que entendiste lo que firmaste</li>
          <li><strong>Pago típico:</strong> Net 30, Net 60, Net 90, con retention 5-10%</li>
          <li><strong>Disputa:</strong> Arbitration (AAA/JAMS) casi siempre, o Superior Court</li>
          <li><strong>Mechanics Lien:</strong> SÍ aplica a privado; en público es Stop Notice + Payment Bond</li>
          <li><strong>Preliminary 20-Day Notice:</strong> OBLIGATORIO para subs y suppliers si quieres preservar lien rights</li>
        </ul>

        <h4>Diferencias clave que te van a joder si no las sabes:</h4>
        <p><strong>1. Retention.</strong> En comercial, el GC o el owner retiene típicamente 5-10% de cada progress payment hasta el final. Esa plata no la ves hasta 30-45 días después de completar el job (California Civil Code permite release en 45 días después de completion notice — Public Contract Code 7107 / Civil Code 8812). Si metes tu AC en un shopping center de $2M y tu parte es $80K, el GC te va a retener $8K que no ves por meses.</p>

        <p><strong>2. AIA Forms.</strong> En comercial serio, el GC te va a pasar un AIA A401 (subcontrator agreement). Ese documento tiene cláusulas de "pay-when-paid" y "flow-down" (todo lo que el GC le debe al owner, te lo debes a ti como sub). LEE TODO. Tacha lo que no acepte. Negocia.</p>

        <p><strong>3. Indemnification.</strong> Los AIA contracts típicos tienen una cláusula donde TÚ indemnizas al GC y al owner. En California, Civil Code 2782 limita qué tan amplia puede ser esa indemnización (no puedes indemnizar por la negligencia sola del otro), pero aún así te pueden cobrar por cualquier defensa legal.</p>

        <p><strong>4. Insurance requirements.</strong> Residencial: $1M GL suficiente. Comercial: $2M-$5M GL, $1M Auto, $1M Workers Comp, Additional Insured Endorsement a favor del GC y owner, Waiver of Subrogation. Si tu póliza no cumple, no te pagan el primer draw.</p>

        <p><strong>5. Prevailing wage.</strong> Si el job es público (escuela, hospital, ciudad), aplica <strong>DIR prevailing wage</strong> — tus techs cobran rate específico por trade, con certified payrolls semanales. Si no lo haces, te ponen $200/día por trabajador de penalidad.</p>

        <h4>¿Cuál conviene más?</h4>
        <p>Residencial: margen 35-50%, cobras rápido, pero volumen bajo y cliente emocional. Comercial: margen 15-25%, cobras lento (60-120 días), pero volumen alto y cliente profesional. La mayoría de contratistas C-20 latinos empiezan residencial, suben a light commercial (restaurantes, oficinas chicas) y eventualmente hacen heavy commercial.</p>
      `,
      keyPoints: [
        'B&P 7159 SOLO aplica a residencial home improvement, NO a comercial',
        'AIA A101/A201/A401 son los contratos estándar comerciales',
        'Retention 5-10% es norma en comercial — planéalo en tu cash flow',
        'Preliminary 20-Day Notice es OBLIGATORIO en comercial para preservar lien',
        'Prevailing wage en public work — certified payrolls o $200/día penalty',
        'Pay-when-paid vs pay-if-paid: NEGOCIA esto antes de firmar'
      ],
      realTalk: '"Mi primer job comercial fue un Taco Bell de $65K. Firmé el AIA sin leerlo, acepté net-60 con 10% retention. Cobré el último $6,500 nueve meses después. Aprendí a las malas: en comercial, el contrato se negocia ANTES de firmar, no después."',
      checklist: [
        'Identifica si el job es residencial (B&P 7159) o comercial (contrato libre)',
        'Si es comercial, pide el contrato maestro antes de cotizar',
        'Verifica requisitos de insurance ANTES de firmar',
        'Calcula cash flow con retention y net terms reales',
        'Si es público, confirma si aplica prevailing wage',
        'Tacha cláusulas abusivas (indemnificación total, pay-if-paid)',
        'Manda todo a tu abogado si el contrato es > $100K'
      ],
      commonMistakes: [
        'Usar contrato residencial en job comercial — pierdes protecciones',
        'Aceptar pay-if-paid (no pay-when-paid) — si el owner no paga al GC, no cobras',
        'No preservar lien rights con Preliminary Notice en comercial',
        'Ignorar prevailing wage en job público — multa brutal',
        'No cotizar retention en tu margen — pierdes el 10% de ganancia por meses'
      ]
    },
    {
      id: 'proposal-anatomy',
      heading: 'La Anatomía de una Propuesta Ganadora',
      body: `
        <p>Tu propuesta es lo que cierra el deal Y lo que te protege si algo sale mal. Una propuesta débil pierde el trabajo o te deja vulnerable. Una propuesta fuerte le da confianza al cliente Y te da munición legal. Aquí está la estructura que uso:</p>

        <h4>1. Header — Credibilidad inmediata</h4>
        <ul>
          <li>Logo y nombre legal de la entidad</li>
          <li>CSLB License # con classification (C-20 HVAC, C-38 Refrigeration, C-10 Electrical)</li>
          <li>Dirección física (no solo P.O. Box)</li>
          <li>Teléfono, email, website</li>
          <li>Insurance carrier y policy # (GL + WC)</li>
          <li>EPA 608 Universal # (si relevante)</li>
        </ul>

        <h4>2. Scope of Work — Específico hasta el tornillo</h4>
        <p>El scope débil es la #1 causa de pleitos. "Instalar sistema HVAC" NO es scope. Esto es scope:</p>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">
        • Instalar 1x Carrier 25VNA424A000 condenser, 2.0 ton, SEER 18, R-410A<br>
        • Instalar 1x Carrier CNPVP3017ALA evaporator coil<br>
        • Instalar 1x Carrier 59TN6B040V17 furnace 40K BTU 96% AFUE<br>
        • 30 ft línea de refrigerante 3/8"+7/8", armaflex 3/8" aislación<br>
        • Breaker 30A 240V, disconnect 60A NEMA 3R, whip flex 4'<br>
        • Drain line PVC 3/4" con P-trap y safety switch<br>
        • Pad plástico Diversitech 36x36x3"<br>
        • Thermostat Honeywell T6 Pro programable<br>
        • Permit Title-24 HERS con city permit fee incluido<br>
        • Startup, vacuum 500 microns, superheat/subcool adjust, combustion analysis</p>

        <h4>3. Exclusions — Igual de importante que inclusions</h4>
        <p>Lo que NO está incluido. Esto evita el "yo pensé que eso estaba incluido":</p>
        <ul>
          <li>Modificaciones a ductos existentes (cotización separada)</li>
          <li>Upgrade de panel eléctrico si no tiene capacidad</li>
          <li>Reparación de daño a drywall/paint</li>
          <li>Remoción de asbesto si presente</li>
          <li>Relocación de gas line (requiere C-36 plumber)</li>
          <li>Trabajo de techado por penetraciones</li>
          <li>Cualquier reparación de problemas pre-existentes descubiertos</li>
        </ul>

        <h4>4. Payment Schedule — Ver sección 5 completa</h4>

        <h4>5. Change Orders — Cláusula CYA</h4>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">"Cualquier cambio al scope de trabajo requiere un Change Order por escrito firmado por ambas partes ANTES de proceder. Work verbal no autorizado por escrito no será facturado pero tampoco ejecutado. Change orders pueden modificar el precio, el cronograma, o ambos."</p>

        <h4>6. Warranty — Clara y en español</h4>
        <ul>
          <li><strong>Equipment:</strong> Warranty del fabricante (10 años parts Carrier/Trane con registro, 1 año compressor)</li>
          <li><strong>Workmanship:</strong> 1 año en instalación desde la fecha de completion</li>
          <li><strong>Exclusions:</strong> Daño por falta de mantenimiento, surge eléctrico, mal uso, acts of God, modificaciones por terceros</li>
          <li><strong>Implied warranty de habitabilidad:</strong> Como requiere California (ver sección 8)</li>
        </ul>

        <h4>7. Dispute Resolution</h4>
        <p>Pon una cláusula específica:</p>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">"Cualquier disputa será resuelta primero por mediation non-binding con mediator del condado. Si no se resuelve en 60 días, las partes acuerdan binding arbitration con AAA bajo Construction Industry Rules. La parte que pierda paga attorney fees. Venue: [tu condado]."</p>

        <h4>8. Firma y disclosures</h4>
        <ul>
          <li>Firma del contratista con fecha</li>
          <li>Firma del homeowner(s) — ambos cónyuges si co-owners</li>
          <li>3-Day Right to Cancel form en página aparte</li>
          <li>Notice to Owner completo</li>
        </ul>
      `,
      keyPoints: [
        'Scope específico por modelo, cantidad y specs',
        'Exclusions tan importantes como inclusions',
        'Cambio = Change Order firmado, SIEMPRE',
        'Warranty separa equipment (fabricante) de workmanship (tú)',
        'Dispute resolution clause ahorra $20K-$50K en pleito',
        'Ambos cónyuges firman si la casa es comunidad conyugal'
      ],
      realTalk: '"Una propuesta de 2 páginas bien escrita cierra más deals que una cotización de 1 línea por $12,500. El cliente ve el detalle, los modelos, las exclusions, y piensa: este tipo sabe lo que hace. Vas a cerrar un 30% más con una propuesta pro que con un número en una hoja."',
      checklist: [
        'Header con licencia, insurance, EPA #',
        'Scope por modelo con número de parte',
        'Lista de exclusions clara',
        'Payment schedule por milestone',
        'Cláusula change order obligatoria',
        'Warranty equipment + workmanship + exclusions',
        'Dispute resolution con AAA/JAMS',
        'Firmas de todos los owners',
        'Disclosures CSLB adjuntos'
      ],
      commonMistakes: [
        'Scope vago "install HVAC" — invitación a pleito',
        'No listar exclusions — cliente asume que todo está incluido',
        'Warranty oral o "lifetime" sin definir qué cubre',
        'Solo firma 1 cónyuge — el otro dice que no autorizó',
        'Olvidar cláusula de change order — se pelean por verbales',
        'No incluir dispute resolution — terminas en Superior Court $30K abogado'
      ]
    },
    {
      id: 'change-orders',
      heading: 'Change Orders — El Asesino Silencioso de Ganancias',
      body: `
        <p>El change order es el punto donde más contratistas pierden dinero en California. El job original estaba bien cotizado, con 30% margen. Pero empezaste a hacer trabajo extra verbal ("ya que estás aquí, ¿puedes también...?") y al final el cliente se niega a pagar. Sin change order firmado, <strong>no hay qué facturar</strong>.</p>

        <h4>Regla de oro: Verbal = Regalo</h4>
        <p>Si no está firmado, no existe. El cliente puede decir "yo nunca autoricé eso" y el juez lo creerá a él, no a ti. Los mensajes de texto son mejor que nada, pero todavía débiles. Un change order formal firmado es el único escudo real.</p>

        <h4>Anatomía de un Change Order</h4>
        <p>Un change order es un mini-contrato. Debe tener:</p>
        <ol>
          <li><strong>Número de change order</strong> (CO-001, CO-002…) y fecha</li>
          <li><strong>Referencia al contrato original</strong> (fecha y monto)</li>
          <li><strong>Descripción específica del cambio</strong> — qué se agrega, qué se quita</li>
          <li><strong>Precio del cambio</strong> en dólares (suma o resta)</li>
          <li><strong>Impacto en cronograma</strong> — cuántos días extra</li>
          <li><strong>Nuevo total del contrato</strong> después del cambio</li>
          <li><strong>Firmas</strong> — cliente y contratista, CON FECHA</li>
        </ol>

        <h4>Ejemplo real</h4>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">
        <strong>CHANGE ORDER CO-001</strong><br>
        Fecha: 4/15/2026<br>
        Contrato original: 3/28/2026 — $8,450.00<br><br>
        Durante la instalación se descubrió que el plenum existente no cumple con el CFM del nuevo sistema de 2.5 ton. Se requiere:<br>
        • Fabricar nuevo plenum sheet metal 20x20x30<br>
        • Agregar return de 20x30 con grille<br>
        • Re-sellar con mastic UL-181<br><br>
        Costo adicional: $1,280.00<br>
        Días adicionales: 1<br>
        Nuevo total: $9,730.00<br><br>
        Firma cliente: _______________ Fecha: _______<br>
        Firma contratista: _______________ Fecha: _______</p>

        <h4>Tipos de Change Orders</h4>
        <ul>
          <li><strong>Owner-initiated:</strong> Cliente pide cambio (upgrade a Wi-Fi thermostat, agregar zona)</li>
          <li><strong>Contractor-initiated:</strong> Descubriste algo (asbesto, panel sin capacidad, ductos colapsados)</li>
          <li><strong>Hidden conditions:</strong> Condiciones no visibles al cotizar (moho en el attic, slab colapsado)</li>
          <li><strong>Regulatory:</strong> Cambio por inspector o code update</li>
          <li><strong>Credit (no-charge):</strong> Si quitas algo que estaba en el scope, también lleva change order</li>
        </ul>

        <h4>Cuánto cobrar por un Change Order</h4>
        <p>Los change orders tienen "captive audience pricing." El cliente ya te contrató y prefiere pagarte extra que traer otro contratista. Markup típico en change orders:</p>
        <ul>
          <li>Material: 20-35% markup (vs 15-20% en contrato original)</li>
          <li>Labor: Full hourly rate (no descuento por volumen)</li>
          <li>Overhead fee: 10-15% adicional por disruption y re-scheduling</li>
        </ul>
        <p>En total, los change orders típicamente llevan 40-50% margen vs 30% del trabajo original. <strong>Pero solo si los firmas antes de hacer el trabajo.</strong></p>

        <h4>La trampa del "Time and Materials" verbal</h4>
        <p>"Hazlo T&M, yo te pago" — frase peligrosa. Si no tienes un rate por hora firmado y un cap máximo, el cliente puede argumentar después que el trabajo vale la mitad. Si vas T&M, manda un change order que diga:</p>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">"Trabajo adicional a realizar en base Time & Materials: Labor a $125/hr por technician, materials a costo + 30% markup, con cap NO-TO-EXCEED de $3,500 sin autorización adicional escrita."</p>

        <h4>Change orders en comercial</h4>
        <p>En AIA contracts, existe el <strong>Construction Change Directive (CCD)</strong> — cuando el owner/GC te ordena hacer el cambio aunque no se haya firmado el CO todavía. Documenta HORAS, material, equipment diariamente en ese caso. Si no documentas, pierdes.</p>
      `,
      keyPoints: [
        'Verbal = no existe — el cliente siempre ganará esa disputa',
        'CO debe tener: número, descripción, precio, cronograma, nuevo total, firmas',
        'Markup en CO es mayor (40-50% margen vs 30%)',
        'T&M sin cap = trampa — siempre incluye NTE (not-to-exceed)',
        'Credit change orders también existen (si quitas trabajo)',
        'En comercial, documenta diariamente si es CCD sin firmar'
      ],
      realTalk: '"Perdí $4,800 en un job de $12K por hacer trabajo extra verbal. El cliente juró que yo había incluido todo y se negó a pagar. No tenía ni un text message. Desde entonces tengo un talonario físico de CO en la troca y NO empiezo nada extra hasta que firma. Cero excepciones."',
      checklist: [
        'Talonario de CO físico o digital en cada troca',
        'CO firmado ANTES de empezar el trabajo extra',
        'Foto del CO firmado subida al CRM/Google Drive',
        'Copia al cliente por email inmediatamente',
        'Markup en CO mayor al job base',
        'T&M siempre con NTE cap',
        'CO también para credits (quitar trabajo)',
        'Email de confirmación después de firmar'
      ],
      commonMistakes: [
        'Trabajo extra verbal "ya lo arreglamos después" — nunca cobras',
        'CO en servilleta o solo texto — débil en corte',
        'T&M sin cap — cliente no quiere pagar el total',
        'Solo 1 firma (la tuya) — cliente dice que no autorizó',
        'No foto del CO firmado — se "pierde" el papel',
        'Empezar el trabajo antes de firmar — ya estás sin leverage'
      ]
    },
    {
      id: 'payment-schedule',
      heading: 'Payment Schedules y Límites CA de Down Payment',
      body: `
        <p>El payment schedule mal estructurado es otra ruta express a la bancarrota. Si cobras muy poco upfront, el cliente te deja colgado al final. Si cobras demasiado, violas B&P 7159 y te suspenden la licencia. Hay un punto justo.</p>

        <h4>La regla del 10%/$1,000 — CA B&P 7159(d)</h4>
        <p>En contratos residenciales de home improvement, el down payment NO puede exceder:</p>
        <ul>
          <li><strong>10% del precio total del contrato, O</strong></li>
          <li><strong>$1,000</strong></li>
          <li><strong>LO QUE SEA MENOS</strong></li>
        </ul>
        <p>Ejemplos:</p>
        <ul>
          <li>Contrato de $5,000 → down MAX = $500 (10% es menos que $1,000)</li>
          <li>Contrato de $12,000 → down MAX = $1,000 ($1,000 es menos que 10%)</li>
          <li>Contrato de $45,000 → down MAX = $1,000 (siempre $1,000, NO 10%)</li>
        </ul>
        <p><strong>Excepción:</strong> Si eres contratista con "blanket performance and payment bond" registrado con CSLB, puedes cobrar más down. Muy pocos contratistas HVAC tienen esto.</p>

        <h4>Progress payments — cómo estructurarlos</h4>
        <p>Después del down, los demás pagos se escalonan por milestones. Un esquema común para un install HVAC residencial de $9,000:</p>
        <ul>
          <li><strong>$900 down payment</strong> al firmar (10%)</li>
          <li><strong>$4,500 al empezar</strong> — equipment entregado en sitio, empezamos demolición (50%)</li>
          <li><strong>$2,700 al rough-in</strong> — refrigerant, electrical, drain instalados pero no cubiertos (30%)</li>
          <li><strong>$900 al completion</strong> — startup completo, pasó inspection, commissioning firmado (10%)</li>
        </ul>
        <p><strong>Clave:</strong> Nunca dejes el último pago menor al 5-10%. Si dejas solo $200 final, el cliente te va a hacer volver 5 veces por "cositas" sin que puedas cobrar. Un final de $900-$1,500 te motiva a cerrar bien Y al cliente le garantiza que vuelvas.</p>

        <h4>Commercial progress billing</h4>
        <p>En comercial NO hay límite de down. El estándar es:</p>
        <ul>
          <li><strong>Schedule of Values (SOV):</strong> Desglose de tu contrato en line items (equipment, labor, permits, startup, etc.)</li>
          <li><strong>Monthly pay applications:</strong> Cada mes mandas AIA G702/G703 con % completado por línea</li>
          <li><strong>Retention:</strong> Owner retiene 5-10% de cada pago</li>
          <li><strong>Lien waivers:</strong> Firmas conditional waiver on progress payment para cada draw</li>
          <li><strong>Final + retention:</strong> 45 días después de completion notice (Civil Code 8812 / Public Contract Code 7107)</li>
        </ul>

        <h4>Payment schedule clauses que te protegen</h4>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">"Todos los pagos son <strong>net 5 days</strong> de la fecha de invoice. Payments atrasados devengan interés al 1.5% mensual (18% anual) hasta el máximo permitido por ley. Trabajo se suspende si cualquier pago está más de 10 días atrasado. Cliente paga todos los legal fees y collection costs."</p>

        <p>En CA, el interés máximo para personas no-exempt es 10% simple, pero para transacciones comerciales es esencialmente ilimitado por contrato. Para residencial pon 1.5% mensual.</p>

        <h4>California Prompt Payment Act (SB-293)</h4>
        <p>Para contratos públicos y privados comerciales, California tiene leyes de prompt payment:</p>
        <ul>
          <li><strong>Public Contract Code 7107:</strong> Retention se libera 60 días después de completion (públicos)</li>
          <li><strong>Civil Code 8812:</strong> Retention se libera 45 días después de completion notice (privados)</li>
          <li><strong>Business & Professions Code 7108.5:</strong> GC debe pagar al sub dentro de 7 días de recibir pago del owner</li>
          <li><strong>Penalidad por violación:</strong> 2% por mes de interés + attorney fees a la parte que gane</li>
        </ul>

        <p><strong>Trick:</strong> Si el GC te retrasa el pago más de 7 días después de que le pagó el owner (y puedes probarlo), le mandas una demand letter citando B&P 7108.5 y el 2%/month penalty. 95% de los GCs pagan rápido para evitar esto.</p>
      `,
      keyPoints: [
        'Down payment residencial: 10% o $1,000, el MENOR (B&P 7159(d))',
        'Progress payments por milestone específico, no arbitrario',
        'Último pago: mínimo 5-10% del total, no "los $200 finales"',
        'Commercial: AIA G702/G703 mensual con SOV',
        'Retention release: 45 días privado (Civil 8812), 60 días público (PCC 7107)',
        'B&P 7108.5: GC debe pagar a sub dentro de 7 días de recibir del owner'
      ],
      realTalk: `"Un contratista me dijo 'yo cobro 50% down siempre, si aguanta aguanta.' 8 meses después le suspendieron la licencia por una queja de CSLB. No lo hagas. El 10%/$1,000 parece poco pero es la ley. Si necesitas más cash, financia el job con GreenSky y el cliente firma para financiera, no para ti."`,
      checklist: [
        'Calcular down: menor entre 10% y $1,000',
        'Progress payments atados a milestones verificables',
        'Final payment 5-10% mínimo',
        'Cláusula de interés por retraso (1.5%/mo)',
        'Cláusula de suspensión por non-payment',
        'En comercial: SOV detallado + G702/G703 mensual',
        'Documentar completion date para gatillar retention release',
        'Saber citar B&P 7108.5 si GC te atrasa'
      ],
      commonMistakes: [
        'Cobrar 30-50% down en residencial — ilegal',
        'Milestones vagos "al avanzar" — cliente discute el %',
        'Final muy pequeño — cliente te hace volver sin pagar',
        'No citar Civil 8812 para forzar retention release',
        'Aceptar net-90 en sub work sin ajustar margen',
        'No tener cláusula de suspension por non-payment'
      ]
    },
    {
      id: 'lien-process',
      heading: 'Preliminary Notice, Mechanics Liens, Stop Notices',
      body: `
        <p>El Mechanics Lien es el arma legal más poderosa de California para contratistas. Te permite poner un gravamen sobre la propiedad del cliente que te debe — y si no te paga, puedes forzar la venta de la propiedad en foreclosure. Pero está regulado al milímetro. Un paso fuera de plazo y pierdes TODO el derecho.</p>

        <h4>Paso 1: Preliminary 20-Day Notice (CCP 8200 et seq.)</h4>
        <p>Es el documento que te mantiene "in the game" para ejercer lien rights después. Requisitos:</p>
        <ul>
          <li><strong>Quién debe mandarlo:</strong> Cualquier contratista que NO tenga contrato directo con el homeowner (subs, suppliers, material vendors). El contratista directo con el homeowner en residencial NO lo necesita técnicamente, pero igual mándalo en comercial.</li>
          <li><strong>Cuándo:</strong> Dentro de los primeros 20 días de entregar material o empezar labor en el sitio.</li>
          <li><strong>A quién:</strong> (1) Owner, (2) GC/prime contractor, (3) Construction lender si existe.</li>
          <li><strong>Cómo:</strong> Certified mail con return receipt, O personal delivery con proof of service.</li>
          <li><strong>Qué contiene:</strong> Descripción del trabajo/material, nombre de quien te contrató, monto estimado, descripción legal de la propiedad, "Notice to Property Owner" en lenguaje estatutario.</li>
        </ul>
        <p>Si no mandaste el Preliminary Notice, <strong>no puedes presentar un Mechanics Lien</strong>. Es un pre-requisito absoluto.</p>

        <h4>Paso 2: Mechanics Lien (CCP 8400 et seq.)</h4>
        <p>Cuando el cliente no paga, presentas el Mechanics Lien en el county recorder donde está la propiedad. Requisitos:</p>
        <ul>
          <li><strong>Timing:</strong> Dentro de <strong>90 días después del último día que trabajaste o entregaste material</strong>. Si el GC presentó un "Notice of Completion" formal, tu ventana se reduce a <strong>60 días</strong>. Si el GC presentó "Notice of Cessation," igual 60 días.</li>
          <li><strong>Contenido:</strong> Nombre del claimant, monto adeudado, descripción del trabajo, nombre del dueño, descripción legal de la propiedad, declaración bajo juramento.</li>
          <li><strong>Grabación:</strong> File en County Recorder's Office con fee (~$100-$150).</li>
          <li><strong>Servicio al owner:</strong> Dentro de <strong>30 días de grabar</strong>, mandas copia al owner por certified mail.</li>
        </ul>

        <h4>Paso 3: Foreclosure del Lien</h4>
        <p>Grabar el lien por sí solo NO te da el dinero. Es solo un gravamen. Para forzar el pago, tienes que foreclosure:</p>
        <ul>
          <li><strong>Timing:</strong> Dentro de <strong>90 días después de grabar el lien</strong>. Si no presentas foreclosure en 90 días, el lien <strong>expira automáticamente</strong> y pierdes todo.</li>
          <li><strong>Court:</strong> Superior Court del condado donde está la propiedad.</li>
          <li><strong>Acción:</strong> Complaint to Foreclose Mechanics Lien.</li>
          <li><strong>Extensión:</strong> Puedes extender hasta 1 año si el owner firma "Extension of Mechanics Lien." Útil si estás en negociación.</li>
        </ul>

        <h4>Timeline completo — grábatelo</h4>
        <p style="background:#fff3cd;padding:12px;border:2px solid #856404;">
        <strong>Día 1:</strong> Empiezas trabajo o entregas material<br>
        <strong>Día 1-20:</strong> Mandar Preliminary 20-Day Notice<br>
        <strong>Día X:</strong> Último día de trabajo (termination/substantial completion)<br>
        <strong>Día X+60 a X+90:</strong> Ventana para grabar Mechanics Lien (60 si hubo Notice of Completion, 90 si no)<br>
        <strong>Lien grabado → +30 días:</strong> Servir copia al owner<br>
        <strong>Lien grabado → +90 días:</strong> DEADLINE para presentar foreclosure complaint<br>
        <strong>Después de foreclosure:</strong> Caso puede tomar 6-18 meses en corte<br>
        </p>

        <h4>Stop Notice — para public works</h4>
        <p>En trabajo público (escuelas, ciudad, DOT), NO puedes poner lien sobre propiedad pública. En su lugar, usas <strong>Stop Notice</strong> (CCP 9350+):</p>
        <ul>
          <li><strong>Bonded Stop Notice (privado):</strong> Mandas al lender para que retenga fondos del owner</li>
          <li><strong>Unbonded Stop Notice (público):</strong> Mandas a la agencia pública para retener fondos del GC</li>
          <li><strong>Timing:</strong> Mismo que Mechanics Lien — 60-90 días de tu último día</li>
          <li><strong>Payment bond claim:</strong> En públicos > $25K el GC tiene payment bond obligatorio — reclamas contra ese bond dentro de 6 meses del último día</li>
        </ul>

        <h4>Lien Waivers (CCP 8132-8138) — lenguaje EXACTO requerido</h4>
        <p>California requiere que los lien waivers usen lenguaje estatutario exacto. Hay 4 tipos:</p>
        <ol>
          <li><strong>Conditional Waiver on Progress Payment (8132):</strong> Firmas para recibir pago PARCIAL — pero no es efectivo hasta que el cheque cobre</li>
          <li><strong>Unconditional Waiver on Progress Payment (8134):</strong> Firmas que YA recibiste pago parcial — efectivo de inmediato</li>
          <li><strong>Conditional Waiver on Final Payment (8136):</strong> Firmas para recibir pago FINAL — no efectivo hasta cheque cobre</li>
          <li><strong>Unconditional Waiver on Final Payment (8138):</strong> Firmas que YA recibiste pago FINAL — efectivo inmediato, pierdes todos los lien rights</li>
        </ol>
        <p><strong>NUNCA firmes un "Unconditional" antes de que el cheque se haya cobrado.</strong> He visto contratistas firmar unconditional, el cheque rebota, y el cliente se queda con el trabajo y sin que tú puedas poner lien.</p>
      `,
      keyPoints: [
        'Preliminary 20-Day Notice: primeros 20 días de start (OBLIGATORIO para subs)',
        'Mechanics Lien: 60-90 días de tu último día en el job',
        'Foreclosure: 90 días de grabar el lien o expira',
        'Public works usa Stop Notice, no Mechanics Lien',
        'Lien waivers tienen lenguaje EXACTO por ley (CCP 8132-8138)',
        'Nunca firmes Unconditional antes de cobrar el cheque'
      ],
      realTalk: '"El Mechanics Lien es tu AK-47 legal. Un lien bien grabado sobre una casa de $800K hace que hasta el cliente más terco pague. Pero el 70% de los contratistas latinos ni siquiera lo conocen, o se pasan del plazo. Graba el Preliminary Notice en los primeros 20 días SIEMPRE — cuesta $50 con un servicio y te protege por $50K."',
      checklist: [
        'Mandar Preliminary 20-Day Notice certified mail en primeros 20 días',
        'Archivar return receipt del USPS',
        'Calendarizar 60 y 90 días post-completion para lien deadline',
        'Verificar si hubo Notice of Completion (reduce a 60 días)',
        'Si no pagan, grabar Mechanics Lien en county recorder',
        'Servir copia al owner en 30 días de grabar',
        'Calendarizar 90 días para foreclosure o extension',
        'Revisar TODO lien waiver antes de firmar — verificar Conditional vs Unconditional',
        'Public work: Stop Notice + Payment Bond claim'
      ],
      commonMistakes: [
        'No mandar Preliminary Notice — pierdes lien rights',
        'Pasarse del plazo 60/90 días — lien inválido',
        'Firmar Unconditional waiver antes de cobrar cheque',
        'Poner lien sobre propiedad pública — no funciona',
        'No foreclosure en 90 días — lien expira, pierdes todo',
        'Grabar lien sin descripción legal correcta — lien inválido'
      ]
    },
    {
      id: 'collections',
      heading: 'Cuando No te Pagan — Demand Letter a Small Claims',
      body: `
        <p>El cliente no paga. ¿Ahora qué? Hay un proceso escalonado que maximiza tus chances de cobrar y minimiza tu gasto. NO empieces con abogado caro. Empieza con presión y sube nivel.</p>

        <h4>Nivel 1: Llamada y email (día 1-15 atraso)</h4>
        <p>Llamada cordial + email confirmando conversation. Muchos clientes "se olvidaron." No seas agresivo todavía.</p>

        <h4>Nivel 2: Formal Demand Letter (día 16-30 atraso)</h4>
        <p>Aquí empiezas la presión real. Una demand letter profesional, certified mail con return receipt, firmada por ti (no necesitas abogado). Estructura:</p>

        <p style="background:#f4f4f4;padding:14px;font-family:monospace;font-size:12px;border-left:4px solid #111;">
        <strong>[Tu Logo y Licencia CSLB]</strong><br><br>
        Fecha: 4/19/2026<br>
        Certified Mail #: 7020 XXXX XXXX<br><br>
        [Nombre Cliente]<br>
        [Dirección]<br><br>
        <strong>RE: DEMAND FOR PAYMENT — Invoice #2026-0342 — $6,850.00</strong><br><br>
        Estimado [Cliente]:<br><br>
        Esta carta es notificación formal de que usted debe $6,850.00 por trabajo HVAC completado en su propiedad en [dirección] bajo el contrato firmado el [fecha]. Esta cantidad ha estado vencida desde [fecha], ahora 35 días.<br><br>
        Bajo los términos de nuestro contrato, intereses al 1.5% mensual han acumulado desde la fecha de vencimiento: $102.75. <strong>Total adeudado: $6,952.75.</strong><br><br>
        Si no recibo pago en full dentro de <strong>10 días calendarios</strong> de la fecha de esta carta, procederé con las siguientes acciones sin aviso adicional:<br>
        1. Grabar un Mechanics Lien bajo California CCP 8400+ contra la propiedad<br>
        2. Presentar demanda en Small Claims Court por el monto total<br>
        3. Reportar la cuenta a collections agency<br>
        4. En el caso de Mechanics Lien foreclosure, usted será responsable por attorney fees y court costs<br><br>
        Pago aceptado: cheque, zelle a [#], o efectivo en mi oficina. Contácteme al [#] para resolver este asunto.<br><br>
        Atentamente,<br>
        [Nombre]<br>
        [Company] — CSLB #[###]<br>
        </p>

        <p><strong>60-70% de los clientes pagan con esta carta sola.</strong> La combinación de (1) monto específico, (2) plazo real de 10 días, (3) amenaza de Mechanics Lien, (4) certified mail, asusta más que cualquier abogado por teléfono.</p>

        <h4>Nivel 3: Mechanics Lien (día 31-60, dentro del plazo legal)</h4>
        <p>Si la demand letter no funciona y todavía estás dentro de los 60-90 días de tu último día de trabajo, graba el Mechanics Lien. Cuesta ~$100-$150 en el county recorder. Una vez grabado:</p>
        <ul>
          <li>Aparece en title report — si el cliente intenta vender o refinanciar, no puede</li>
          <li>Crea urgencia real — muchos clientes pagan en 30 días de ver el lien</li>
          <li>Te da posición para negociar settlement</li>
        </ul>

        <h4>Nivel 4: Small Claims Court (hasta $10,000)</h4>
        <p>California Small Claims sube a <strong>$10,000 para individuos</strong> y <strong>$5,000 para businesses</strong>. Si tu debt es bajo $10K Y tú demandas como individuo (sole proprietor), es tu mejor amigo:</p>
        <ul>
          <li>Filing fee: $30-$75 según el monto</li>
          <li>No se permiten abogados en hearing</li>
          <li>Hearing en 30-70 días</li>
          <li>Juicio típicamente el mismo día</li>
          <li>Si ganas, puedes embargar cuenta bancaria, sueldo, o lien</li>
        </ul>
        <p><strong>Lleva a la hearing:</strong> contrato firmado, invoices, comunicaciones por email/text, fotos del trabajo completado, demand letter con certified mail receipt, schedule of work. El juez decide en minutos si tu documentación está en orden.</p>

        <h4>Nivel 5: Foreclosure del Mechanics Lien (Superior Court)</h4>
        <p>Si el debt es > $10K o quieres forzar la venta de la casa, presentas foreclosure complaint en Superior Court. Necesitas abogado (típico $3K-$8K retainer, $350-$500/hr). Timeline: 6-18 meses. Si ganas, el juez ordena venta de la propiedad y tú cobras del proceeds.</p>

        <h4>Nivel 6: Collections Agency</h4>
        <p>Si ya no tienes opciones legales (te pasaste de plazos), puedes vender la deuda a una agencia de collections. Cobran 25-50% de lo que recuperan. Reportan a credit bureaus. Último recurso.</p>

        <h4>Estrategias que funcionan</h4>
        <ul>
          <li><strong>Divide y vencerás:</strong> Si el job fue $15K y debe $8K, ofrece settlement de $6K pagado en 14 días. 50% del tiempo aceptan.</li>
          <li><strong>Payment plan con pagaré:</strong> Si no tiene cash, firma un Promissory Note con pagos mensuales + interés. Tiene más peso legal que un simple IOU.</li>
          <li><strong>Threat of 1099-C:</strong> Si perdonas deuda > $600, estás legalmente obligado a reportarlo al IRS (Form 1099-C). El cliente ahora debe impuestos sobre esa "ganancia." Mencionarlo a veces los hace pagar.</li>
          <li><strong>Review bomb strategy — NO lo hagas.</strong> Si el cliente te debe y tú pones una review negativa, te puede demandar por defamation. Mantén reviews factuales y deja la presión legal en lo legal.</li>
        </ul>
      `,
      keyPoints: [
        'Demand letter certified mail cobra 60-70% de deudas',
        'Mechanics Lien es más poderoso que cualquier amenaza de abogado',
        'Small Claims límite: $10K individuo, $5K business',
        'No abogados permitidos en Small Claims — tú representas',
        'Promissory Note > IOU para payment plans',
        'Review bomb = demanda por defamation, no hagas'
      ],
      realTalk: '"Nunca gastes $5K en abogado por una deuda de $8K. Manda la demand letter tú mismo, graba el lien tú mismo ($120), ve a Small Claims tú mismo ($75). Tres pasos, $200 total, y cobras el 80% de las deudas. El abogado es solo para foreclosure de lien sobre $10K."',
      checklist: [
        'Day 1 atraso: llamada amistosa + email',
        'Day 15: segunda llamada con tono más serio',
        'Day 20-30: demand letter certified mail con plazo 10 días',
        'Day 45: si no pagan Y dentro de plazo legal → grabar Mechanics Lien',
        'Day 60+: presentar Small Claims (si < $10K) o foreclosure (> $10K)',
        'Documentar TODO: emails, llamadas con fecha, certified receipts',
        'Fotos de todo el trabajo completado antes de entregar',
        'Opción de payment plan con Promissory Note firmado'
      ],
      commonMistakes: [
        'Esperar 90+ días antes de actuar — pierdes Mechanics Lien window',
        'Gritarle al cliente o insultar — puede usarse en corte',
        'Ir directo a abogado en deuda < $10K — gasto innecesario',
        'Olvidar certified mail en demand letter — no tiene peso legal',
        'Review negativa venganza — puedes perder demanda por defamation',
        'No llevar contrato firmado a Small Claims — te pierden el caso'
      ]
    },
    {
      id: 'finance-workflow',
      heading: 'Integrar Financiamiento (GreenSky, Synchrony) al Contrato',
      body: `
        <p>El financiamiento convierte cotizaciones de "déjame pensarlo" en ventas cerradas. Clientes que no tenían $9,500 en cash ahora firman por $135/mes. Pero si no integras bien al contrato, te pueden negar el funding después de haber hecho el trabajo — y ahí perdiste el job.</p>

        <h4>Las 3 grandes financieras HVAC en CA</h4>
        <ul>
          <li><strong>GreenSky (Goldman Sachs):</strong> 0-9.99% rates, aprobación en 2 minutos, $1K-$75K, dealer fees 4-8%</li>
          <li><strong>Synchrony / Optimum Advantage:</strong> 0-17.99%, muy usada por Carrier/Trane/Lennox, dealer fees 5-10%</li>
          <li><strong>Service Finance Company:</strong> Especializada HVAC, rates competitivos, fast approval</li>
        </ul>

        <h4>El dealer fee — cómpralo bien</h4>
        <p>Cuando ofreces "0% financing por 18 meses," la financiera te cobra un "dealer fee" (típico 6-9%) del monto financiado. Ejemplo:</p>
        <ul>
          <li>Contrato $10,000 con 0% 18 meses via GreenSky</li>
          <li>Dealer fee 7% = $700</li>
          <li>Tú recibes $10,000 - $700 = <strong>$9,300 neto</strong></li>
          <li>El cliente paga $555.56/mes × 18 meses = $10,000</li>
        </ul>
        <p><strong>Regla:</strong> Incluye el dealer fee en tu pricing desde el inicio. Si tu job cuesta $10K cash, cuando lo financias a 0% cotízalo a $10,800-$11,000. El cliente paga poquito más por el lujo de 0% y tú mantienes margen.</p>

        <h4>Workflow típico</h4>
        <ol>
          <li><strong>Qualify al cliente:</strong> Pre-approval en 2 min con celular (GreenSky app / Synchrony tablet). Credit score 620+ típicamente aprobado.</li>
          <li><strong>Cliente firma loan docs</strong> directamente con financiera (no contigo).</li>
          <li><strong>Cliente firma contrato HVAC contigo</strong> — incluyendo cláusula de financiamiento.</li>
          <li><strong>Haces el trabajo.</strong></li>
          <li><strong>Completion Certificate</strong> firmado por cliente (muy importante).</li>
          <li><strong>Submit funding request</strong> a la financiera con contrato + completion cert + fotos.</li>
          <li><strong>Financiera ACH-fondea tu cuenta</strong> típicamente en 24-48 horas.</li>
        </ol>

        <h4>Cláusulas obligatorias en tu contrato cuando hay financiamiento</h4>
        <p style="background:#f4f4f4;padding:12px;font-family:monospace;font-size:12px;">
        "El pago total se realizará a través de financiamiento vía [GreenSky/Synchrony] bajo Application #______. El contratista está autorizado a submit funding request después de la completion del trabajo.<br><br>
        Si la aplicación de financiamiento es denegada o retirada por el cliente por cualquier razón después de que el trabajo ha empezado, el cliente será responsable de pagar el monto total del contrato directamente al contratista en términos Net-10.<br><br>
        Cliente autoriza al contratista a firmar Completion Certificate en su nombre si el cliente no responde dentro de 3 días de solicitud.<br><br>
        Cliente reconoce haber leído y entendido los términos del préstamo con [financiera], incluyendo tasa de interés, plazo y pagos mensuales."
        </p>

        <h4>Trampas del financiamiento — lo que puede ir mal</h4>
        <ul>
          <li><strong>Cliente cancela la aplicación después del trabajo:</strong> Sin la cláusula anterior, no puedes cobrar. CON la cláusula, es Net-10 directo.</li>
          <li><strong>Completion Certificate no firmado:</strong> Financiera no libera fondos. Insiste en firma el mismo día de finish.</li>
          <li><strong>Cambio de scope sin update al loan:</strong> Si cotizaste $10K y el change order lo subió a $11.5K, necesitas "Loan Increase" approval — o el cliente paga el delta en cash.</li>
          <li><strong>Rates promocionales expired:</strong> "0% 18 meses" puede convertirse en 27.99% si el cliente no paga en full antes del promo end. Explícaselo bien (tu responsabilidad moral, aunque no legal).</li>
          <li><strong>Credit freeze:</strong> Algunos clientes tienen credit freezes que no pueden destrabar en el momento. Ofrece payment alternativo.</li>
        </ul>

        <h4>Texting/Email como contrato vinculante</h4>
        <p>California reconoce que emails y SMS pueden constituir contratos vinculantes bajo California Uniform Electronic Transactions Act (Civil Code 1633.1+). Si respondes por text "sí incluyo el evaporador coil nuevo por $500," eso es parte del contrato. Si mandas presupuesto por email y el cliente contesta "OK vamos" — contrato formado.</p>

        <p><strong>Reglas de comunicación digital:</strong></p>
        <ul>
          <li>Nunca prometas algo por text que no piensas cumplir</li>
          <li>Si dices "te doy 2 años de warranty" por text, eso es warranty de 2 años</li>
          <li>Captura screenshots de conversaciones importantes</li>
          <li>Si negocias un cambio por text, mándale Change Order formal al día siguiente</li>
          <li>Emojis y "lol" NO invalidan el contrato (aunque parezca)</li>
        </ul>

        <h4>DocuSign / Adobe Sign — legalmente válidos</h4>
        <p>Firmas electrónicas via DocuSign, Adobe Sign, HouseCall Pro, ServiceTitan, etc., son 100% válidas en CA bajo Civil Code 1633.7. No necesitas firma en papel. Ahorra tiempo, tiene audit trail, y es admisible en corte.</p>
      `,
      keyPoints: [
        'Dealer fee 4-9% — súbelo al precio del job',
        'Cláusula de "si cancela loan, Net-10 cash" obligatoria',
        'Completion Certificate firmado el mismo día de finish',
        'Change orders requieren Loan Increase approval',
        'Texts y emails son contratos vinculantes en CA',
        'DocuSign y firmas electrónicas 100% válidas (Civil 1633.7)'
      ],
      realTalk: `"La financiera es tu socio de ventas. Un cliente que dice 'no puedo' a $9,500 dice 'sí' a $155/mes. Pero protege tu backside: sin cláusula de 'si cancela, paga cash Net-10' puedes perder $9,500 si el cliente se arrepiente de la aplicación."`,
      checklist: [
        'Dealer fee incluido en pricing',
        'Pre-qualify antes de emitir contrato',
        'Cláusula de contingencia si loan se cancela',
        'Completion Certificate firmado día de finish',
        'Loan Increase para cualquier change order',
        'Explicar al cliente rate promocional vs post-promo',
        'Usar DocuSign/HouseCall Pro para firmas',
        'Screenshots de texts importantes'
      ],
      commonMistakes: [
        'No incluir dealer fee en pricing — comes margen',
        'Empezar trabajo sin loan aprobado — riesgo total',
        'No firmar Completion Certificate — fondos congelados',
        'Prometer warranty por text sin querer cumplirlo',
        'Ignorar change order en loan — cliente no paga delta',
        'Usar firma en papel — se pierde, no tiene audit trail'
      ]
    }
  ],
  resources: [
    { label: 'CA B&P Code 7159 — Home Improvement Contracts', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=7159.&lawCode=BPC', type: 'link' },
    { label: 'CA B&P Code 7108.5 — Prompt Payment Subs', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=7108.5.&lawCode=BPC', type: 'link' },
    { label: 'CSLB 3-Day Right to Cancel', url: 'https://www.cslb.ca.gov/Consumers/Hire_A_Contractor/Before_You_Hire_A_Contractor/Three_Day_Right_To_Cancel.aspx', type: 'link' },
    { label: 'CSLB Home Improvement Contract Requirements', url: 'https://www.cslb.ca.gov/Resources/GuidesAndPamphlets/HomeImprovementContract.pdf', type: 'link' },
    { label: 'California Civil Code 8000-9566 (Mechanics Lien Law)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=CIV&division=4.&title=&part=6.&chapter=&article=', type: 'link' },
    { label: 'California Civil Code 8132-8138 (Lien Waiver Forms)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=8132.&lawCode=CIV', type: 'link' },
    { label: 'California Civil Code 8812 (Private Retention Release)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=8812.&lawCode=CIV', type: 'link' },
    { label: 'California Public Contract Code 7107 (Public Retention)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=7107.&lawCode=PCC', type: 'link' },
    { label: 'California Code of Civil Procedure 8200+ (Preliminary Notice)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=8200.&lawCode=CIV', type: 'link' },
    { label: 'California Code of Civil Procedure 8400+ (Mechanics Lien)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=8400.&lawCode=CIV', type: 'link' },
    { label: 'California Small Claims Court Guide', url: 'https://www.courts.ca.gov/selfhelp-smallclaims.htm', type: 'link' },
    { label: 'California Uniform Electronic Transactions Act', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=CIV&division=3.&title=2.5.&part=2.&chapter=&article=', type: 'link' },
    { label: 'AIA Contract Documents (A101, A201, A401)', url: 'https://www.aiacontracts.com/', type: 'link' },
    { label: 'AAA Construction Industry Arbitration Rules', url: 'https://www.adr.org/construction', type: 'link' },
    { label: 'JAMS Construction Mediation/Arbitration', url: 'https://www.jamsadr.com/construction/', type: 'link' },
    { label: 'CSLB Complaint Process', url: 'https://www.cslb.ca.gov/Consumers/Filing_A_Complaint/', type: 'link' },
    { label: 'DIR Prevailing Wage Determinations', url: 'https://www.dir.ca.gov/oprl/PWD/index.htm', type: 'link' },
    { label: 'GreenSky Contractor Portal', url: 'https://www.greensky.com/', type: 'link' }
  ],
  glossary: [
    { term: 'Preliminary 20-Day Notice', def: 'Notificación enviada dentro de los primeros 20 días de empezar trabajo o entregar material, obligatoria para subs y suppliers para preservar Mechanics Lien rights (CCP 8200+).' },
    { term: 'Mechanics Lien', def: 'Gravamen legal grabado en el county recorder contra una propiedad por deuda de construction. Debe grabarse dentro de 60-90 días del último día trabajado (CCP 8400+).' },
    { term: 'Notice of Completion', def: 'Documento grabado por el owner declarando que el proyecto está terminado. Reduce la ventana del Mechanics Lien a 60 días en vez de 90.' },
    { term: 'Notice of Cessation', def: 'Documento grabado cuando el trabajo para por más de 30 días continuos. También reduce ventana de lien a 60 días.' },
    { term: 'Conditional Lien Waiver', def: 'Waiver efectivo solo DESPUÉS de que el pago realmente cobre. Formas CCP 8132 (progress) y 8136 (final).' },
    { term: 'Unconditional Lien Waiver', def: 'Waiver efectivo INMEDIATAMENTE — incluso si el cheque rebota. Formas CCP 8134 (progress) y 8138 (final). NO firmes antes de cobrar.' },
    { term: 'Retention', def: 'Porcentaje (5-10%) retenido de cada pago en comercial hasta el final del proyecto. Release en 45 días privado (Civil 8812) o 60 días público (PCC 7107).' },
    { term: 'Change Order (CO)', def: 'Modificación por escrito al contrato original, especificando cambio de scope, precio, y cronograma. Debe ser firmado ANTES de hacer el trabajo extra.' },
    { term: 'Stop Notice', def: 'Equivalente del Mechanics Lien para public works. Se manda al lender (privado) o a la agencia pública para retener fondos (CCP 9350+).' },
    { term: 'Payment Bond', def: 'Bond obligatorio en trabajos públicos > $25K que garantiza pago a subs y suppliers. Reclamo dentro de 6 meses del último día.' },
    { term: 'Schedule of Values (SOV)', def: 'Desglose detallado de tu contrato comercial en line items para facturar progreso mensual (usado con AIA G702/G703).' },
    { term: 'AIA G702/G703', def: 'Formularios estándar American Institute of Architects para aplicación de pago mensual en comercial, mostrando % completado por línea.' },
    { term: 'Pay-when-paid vs Pay-if-paid', def: 'Cláusulas en subcontratos. "Pay-when-paid" = timing condition (te pagan eventualmente). "Pay-if-paid" = risk shift (si owner no paga al GC, tú tampoco cobras). Negocia pay-when-paid.' },
    { term: '3-Day Right to Cancel', def: 'Derecho del homeowner residencial de cancelar el contrato sin penalidad dentro de 3 días (5 si senior 65+). Debe aparecer en lenguaje específico (B&P 7159).' },
    { term: 'Down Payment Limit', def: 'En home improvement residencial CA: máximo 10% del contrato o $1,000, lo que sea MENOS (B&P 7159(d)).' },
    { term: 'Demand Letter', def: 'Carta formal certified mail exigiendo pago dentro de plazo específico (10 días típico), con amenaza de acciones legales. Cobra 60-70% de deudas sin ir a corte.' },
    { term: 'Small Claims Court', def: 'Corte informal para demandas < $10,000 (individuos) o < $5,000 (businesses) en CA. Sin abogados permitidos, hearing rápido, filing fee $30-$75.' },
    { term: 'Promissory Note', def: 'Acuerdo escrito del deudor prometiendo pagar en cierto plazo con interés específico. Más fuerte legalmente que un simple IOU.' },
    { term: 'Dealer Fee', def: 'Comisión (4-9%) que la financiera (GreenSky, Synchrony) cobra al contratista sobre el monto financiado. Debe incluirse en tu pricing.' },
    { term: 'Completion Certificate', def: 'Documento firmado por el cliente certificando que el trabajo está completado satisfactoriamente. Necesario para que la financiera libere fondos al contratista.' },
    { term: 'Prompt Payment Act', def: 'Leyes CA (SB-293, B&P 7108.5, PCC 7107) que obligan a pagar a subs dentro de 7 días de recibir pago del owner. Violación = 2% mes + attorney fees.' },
    { term: 'Implied Warranty', def: 'Warranty que existe por ley aunque no esté escrita. En CA incluye habitabilidad y fitness for purpose. No puedes contratar para eliminarla completamente.' }
  ]
};
