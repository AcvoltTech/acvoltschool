// ============================================
// CSLB APPLICATION KIT — Data module
// Paso a paso: de aplicación a licencia en mano
// Loaded by contractor-zone module (cslbKit mode)
// ============================================

window.CONTRACTOR_CSLB_KIT = {
  title: "CSLB Application Kit",
  subtitle: "De aplicación a licencia en mano — paso a paso",
  totalWeeks: "8-16 semanas típico",
  totalCost: "$675 app + license + bond ≈ $925 + fingerprints (~$60-$100)",
  phases: [
    // ─────────────────────────────────────────────
    // PHASE 1 — QUALIFY
    // ─────────────────────────────────────────────
    {
      id: "qualify",
      title: "1. Verifica que calificas",
      icon: "✓",
      timeline: "día 1",
      color: "#34d399",
      steps: [
        {
          id: "q_age",
          label: "Tener 18 años o más",
          details: "<p>El CSLB requiere que el aplicante tenga al menos <b>18 años cumplidos</b> al momento de firmar la aplicación. No hay excepciones. Se verifica con ID oficial (driver's license, CA ID o pasaporte).</p>",
          links: []
        },
        {
          id: "q_ssn_itin",
          label: "SSN válido o ITIN",
          details: "<p>Necesitas un <b>Social Security Number</b> o un <b>Individual Taxpayer Identification Number (ITIN)</b>. Ambos son aceptados por CSLB desde 2016 (SB 1159). Si no tienes SSN, solicita ITIN con el Form W-7 del IRS.</p><p><b>Importante:</b> No necesitas ser ciudadano ni tener green card — solo capacidad legal de trabajar y reportar impuestos.</p>",
          links: [
            { label: "IRS — Solicitar ITIN (W-7)", url: "https://www.irs.gov/individuals/international-taxpayers/individual-taxpayer-identification-number" }
          ]
        },
        {
          id: "q_experience",
          label: "4+ años de experiencia journeyman en la clasificación",
          details: "<p>Debes comprobar <b>mínimo 4 años de experiencia full-time</b> en los últimos 10 años en la clasificación que aplicas (C-20 HVAC, C-38 Refrigeration, C-10 Electrical, B General, etc.) a nivel <b>journeyman, foreman, supervisor, contratista u owner-builder</b>.</p><p>Se acepta sustitución parcial por <b>educación</b> (hasta 3 años) o <b>apprenticeship completion</b> (1.5 años automáticos).</p>",
          links: [
            { label: "CSLB — Experience Requirements", url: "https://www.cslb.ca.gov/Contractors/Applicants/Experience_Requirements/" }
          ]
        },
        {
          id: "q_probation",
          label: "No estar en probation por felony ni suspendido de otro estado",
          details: "<p>CSLB revisa:</p><ul><li>Convicciones criminales (felonies y algunos misdemeanors) — debes disclosarlas en la aplicación</li><li>Suspensiones o revocaciones en otros state contractor boards</li><li>Estado actual de probation o parole</li></ul><p><b>Una felony no es automáticamente descalificante</b>, pero debe ser disclosed. Mentir en la aplicación = denegación permanente + posible cargo criminal.</p>",
          links: []
        },
        {
          id: "q_work_auth",
          label: "Autorización legal para trabajar en USA",
          details: "<p>Debes tener <b>work authorization válida</b>: ciudadano, residente permanente, work permit (EAD), o status que permita self-employment. CSLB <b>NO</b> verifica inmigración directamente pero el IRS sí requiere que reportes ingresos, y tu bond company puede pedir verificación.</p>",
          links: []
        }
      ]
    },

    // ─────────────────────────────────────────────
    // PHASE 2 — EXPERIENCE VERIFICATION
    // ─────────────────────────────────────────────
    {
      id: "experience",
      title: "2. Verificación de experiencia",
      icon: "🛠️",
      timeline: "2-3 semanas",
      color: "#C9A961",
      steps: [
        {
          id: "e_qualifier",
          label: "Identifica tu qualifier (tú mismo, RME o RMO)",
          details: "<p>Un <b>qualifier</b> es la persona con experiencia que respalda la licencia. Opciones:</p><ul><li><b>Tú mismo</b> — si tienes los 4 años de experiencia (lo más común)</li><li><b>RME (Responsible Managing Employee)</b> — empleado con experiencia que trabaja full-time (32+ hrs/sem)</li><li><b>RMO (Responsible Managing Officer)</b> — oficial/socio de la empresa (corp/LLC)</li></ul><p>El qualifier es quien toma el examen y asume responsabilidad legal de la licencia.</p>",
          links: []
        },
        {
          id: "e_form_13a2",
          label: "Obtener Certification of Work Experience (Form 13A-2)",
          details: "<p>El <b>Form 13A-2</b> es el formulario clave para comprobar experiencia. Debe ser firmado por alguien que pueda atestiguar tu trabajo bajo juramento:</p><ul><li>Contratista licenciado (ideal)</li><li>Supervisor, foreman o journeyman en la trade</li><li>Representante de unión (IUEC, UA, Sheet Metal)</li><li>Homeowner (owner-builder, limitado)</li></ul><p>Describe <b>tareas específicas</b> (no solo \"helper\"), fechas exactas, y horas semanales. Mentir = perjury.</p>",
          links: [
            { label: "CSLB — Formularios (buscar 13A-2)", url: "https://www.cslb.ca.gov/Resources/Forms.aspx" }
          ]
        },
        {
          id: "e_form_13e",
          label: "Sustitución por educación (Form 13E)",
          details: "<p>Puedes sustituir <b>hasta 3 años</b> de experiencia con educación:</p><ul><li><b>AA en trade relacionada</b>: 1.5 años</li><li><b>BS en ingeniería/construcción</b>: 2 años</li><li><b>Vocational certificate</b>: varía (6 mes – 1.5 años)</li><li><b>Community college courses</b>: 1 crédito = 1 mes hasta el máximo</li></ul><p>Adjunta transcripts oficiales sellados directamente de la escuela al Form 13E.</p>",
          links: [
            { label: "CSLB — Education substitution info", url: "https://www.cslb.ca.gov/Contractors/Applicants/Experience_Requirements/" }
          ]
        },
        {
          id: "e_apprenticeship",
          label: "Apprenticeship completion certificate",
          details: "<p>Completar un <b>apprenticeship program DAS-registered</b> te da <b>1.5 años automáticos</b>. Programas típicos HVAC/Refri/Electrical:</p><ul><li><b>Sheet Metal Local 104 / 105</b> (Norte / Sur CA)</li><li><b>UA Local 250 / 342 / 393</b> (pipefitters, refrigeration)</li><li><b>IUEC Local 8 / 18</b> (elevator)</li><li><b>IBEW Local 11 / 234 / 569</b> (electrical)</li></ul><p>Adjunta copia del certificate of completion de DAS (Division of Apprenticeship Standards).</p>",
          links: [
            { label: "CA DAS — Apprenticeship", url: "https://www.dir.ca.gov/das/" }
          ]
        },
        {
          id: "e_military",
          label: "Servicio militar (Form 13M)",
          details: "<p>Si serviste en el U.S. military en una MOS/rating relacionado (Seabees, HVAC tech, electrician, elevator mech, etc.), puedes sustituir experiencia con el <b>Form 13M</b>. Adjunta <b>DD-214</b> y records del rating. Veterans tienen fee waivers disponibles.</p>",
          links: [
            { label: "CSLB — Veterans", url: "https://www.cslb.ca.gov/Contractors/Applicants/" }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // PHASE 3 — PREP FORMS
    // ─────────────────────────────────────────────
    {
      id: "prep",
      title: "3. Preparar formularios",
      icon: "📋",
      timeline: "1 semana",
      color: "#38bdf8",
      steps: [
        {
          id: "p_form_13a1",
          label: "Form 13A-1 — Original Application ($450 fee)",
          details: "<p>El <b>Form 13A-1</b> es la aplicación principal. Fee: <b>$450 no reembolsable</b> (cheque o money order a <i>\"Contractors State License Board\"</i>).</p><p>Información que pide:</p><ul><li>Personal info (nombre legal exacto, SSN/ITIN, DOB, address)</li><li>Business info (nombre, tipo de entity, address, phone)</li><li>Classification solicitada (B, C-20, etc.)</li><li>Qualifier info</li><li>Disclosure de convicciones y licencias previas</li></ul><p><b>Firma bajo juramento</b> — errores u omisiones = denegación.</p>",
          links: [
            { label: "Form 13A-1 (PDF)", url: "https://www.cslb.ca.gov/Resources/Forms.aspx" }
          ]
        },
        {
          id: "p_classification",
          label: "Elegir clasificación (B, C-20, C-36, C-38, C-10, etc.)",
          details: "<p>Clasificaciones más comunes en HVAC/Refri/Construction:</p><ul><li><b>B — General Building</b>: proyectos que involucran 2+ trades (framing + plumbing + electrical). Requiere 4 años journeyman-level.</li><li><b>C-20 — HVAC</b>: warm-air heating, ventilating, air-conditioning. La más común para tecs HVAC residencial.</li><li><b>C-36 — Plumbing</b>: gas, water, drain, venting.</li><li><b>C-38 — Refrigeration</b>: commercial refrigeration, walk-ins, ice machines.</li><li><b>C-10 — Electrical</b>: wiring, panels, service upgrades.</li><li><b>C-46 — Solar</b>: PV + thermal.</li></ul><p>Puedes aplicar a <b>múltiples classifications</b> al mismo tiempo ($150 extra por cada additional classification).</p>",
          links: [
            { label: "CSLB — Classifications list", url: "https://www.cslb.ca.gov/About_Us/Library/Licensing_Classifications/" }
          ]
        },
        {
          id: "p_business_name",
          label: "Nombre del negocio / DBA / Fictitious Business Name",
          details: "<p>Si usas nombre distinto al legal tuyo, necesitas <b>FBN (Fictitious Business Name)</b> registrado en el county donde operas ($26-$60 según county, renovable cada 5 años). Publicación en periódico local también requerida en la mayoría de counties (~$40-$150).</p><p><b>Tips:</b></p><ul><li>Busca disponibilidad en CSLB database antes (evita confusión)</li><li>Evita nombres con \"Inc\" / \"LLC\" si no eres ese entity type (ilegal)</li><li>Reserva el domain + social handles antes</li></ul>",
          links: [
            { label: "CSLB — Business Name Rules", url: "https://www.cslb.ca.gov/Contractors/Applicants/Business_Name.aspx" }
          ]
        },
        {
          id: "p_entity",
          label: "Elegir entity: sole prop / LLC / corp / partnership",
          details: "<p><b>Comparación rápida:</b></p><ul><li><b>Sole Proprietor</b> — más barato, sin protección personal, taxes en Schedule C. Bueno para empezar solo.</li><li><b>LLC</b> — protección personal, requiere <b>$100K Employee/Worker Bond extra</b> si tiene empleados (AB 2190). Flexibilidad fiscal (S-corp election).</li><li><b>S-Corp / C-Corp</b> — protección, payroll propio, CA Franchise Tax $800/año mínimo, más paperwork.</li><li><b>Partnership</b> — 2+ socios, no recomendable sin partnership agreement sólido.</li></ul><p><b>Recomendación del Maestro:</b> Empieza Sole Prop, upgrade a LLC o S-Corp cuando factures $250K+/año o contrates empleados.</p>",
          links: [
            { label: "CA Sec of State — Business Filings", url: "https://www.sos.ca.gov/business-programs/business-entities" }
          ]
        },
        {
          id: "p_ein",
          label: "Federal EIN (IRS — gratis, 10 min online)",
          details: "<p>El <b>Employer Identification Number (EIN)</b> es tu Tax ID del negocio. Es <b>gratis, online, instantáneo</b> en IRS.gov. Lo necesitas para:</p><ul><li>Abrir cuenta bancaria del negocio</li><li>Contratar empleados / W-2s / 1099s</li><li>Aplicar seller's permit CA</li><li>Bonds e insurance</li></ul><p><b>Cuidado:</b> Hay sitios tipo \"EIN service\" que cobran $150 por algo gratis. Ve directo a IRS.gov.</p>",
          links: [
            { label: "IRS — Apply for EIN (free)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" }
          ]
        },
        {
          id: "p_sellers_permit",
          label: "CA Seller's Permit (si vendes equipos/parts)",
          details: "<p>Si vendes <b>tangible goods</b> (equipos, thermostats, parts, installations con material), necesitas <b>Seller's Permit</b> del CDTFA. <b>Gratis</b>, online, ~15 min. Te da cuenta para colectar/remitir sales tax (CA 7.25% base + local).</p><p>Si solo haces labor/service puro, <b>NO</b> lo necesitas — pero la mayoría de HVAC jobs incluyen materials, así que sí.</p>",
          links: [
            { label: "CDTFA — Permits & Licenses", url: "https://www.cdtfa.ca.gov/services/permits-licenses.htm" }
          ]
        },
        {
          id: "p_statement",
          label: "Statement of Experience (narrativa)",
          details: "<p>Escribe un <b>resumen narrativo</b> de tu experiencia: empleadores, fechas, tipos de proyectos, tu rol específico, equipos manejados. Esto acompaña el Form 13A-2 y le da contexto al CSLB evaluator.</p><p><b>Ejemplo de párrafo fuerte:</b><br><i>\"From 2019-2023, worked as journeyman HVAC installer at ACE Mechanical (Lic. #1012345), installing 3-5 ton residential split systems (Trane XR14, Carrier Comfort 24), brazing refrigerant lines, pulling vacuums to 500 microns, charging by weight and superheat/subcool, running line voltage and low voltage thermostats, ducting with flex and sheet metal, and performing Manual J load calculations.\"</i></p><p>Evita: \"helper\", \"did some HVAC work\", fechas vagas.</p>",
          links: []
        }
      ]
    },

    // ─────────────────────────────────────────────
    // PHASE 4 — SUBMIT APPLICATION
    // ─────────────────────────────────────────────
    {
      id: "apply",
      title: "4. Enviar aplicación",
      icon: "📬",
      timeline: "2-6 semanas procesamiento",
      color: "#a78bfa",
      steps: [
        {
          id: "a_mail",
          label: "Enviar el paquete completo por correo",
          details: "<p><b>Lista del paquete:</b></p><ul><li>Form 13A-1 firmado y notarizado (si aplica)</li><li>Cheque/money order $450 a \"Contractors State License Board\"</li><li>Form 13A-2 Certification of Work Experience (firmado por qualifier/supervisor)</li><li>Form 13E Education substitution (si aplica) + transcripts sellados</li><li>Copia de ID oficial (DL, CA ID o passport)</li><li>Foto 2x2 estilo passport (reciente)</li><li>Copia del apprenticeship certificate o DD-214 (si aplica)</li></ul><p><b>Dirección:</b><br>Contractors State License Board<br>P.O. Box 26000<br>Sacramento, CA 95826</p><p><b>Envía certified mail con return receipt</b> — tienes proof de delivery.</p>",
          links: [
            { label: "CSLB — Mailing Addresses", url: "https://www.cslb.ca.gov/About_Us/Contact_Us.aspx" }
          ]
        },
        {
          id: "a_track",
          label: "Trackear en \"Check License\" portal",
          details: "<p>Aproximadamente <b>2 semanas</b> después de enviar, tu application number aparece en el CSLB portal. Usa el portal \"Check License\" para ver:</p><ul><li>Status (Under Review / Approved for Exam / Deficient / Denied)</li><li>Exam eligibility letter</li><li>Fechas de exam disponibles</li></ul><p>También recibes notificaciones por mail postal. <b>No hay email notifications</b> por default.</p>",
          links: [
            { label: "CSLB — Check License Portal", url: "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" }
          ]
        },
        {
          id: "a_deficiency",
          label: "Responder deficiency letters en 90 días",
          details: "<p>Si falta algo, CSLB envía una <b>deficiency letter</b> con lista específica. Tienes <b>90 días calendario</b> para responder o la aplicación se <b>void</b> (y pierdes los $450).</p><p><b>Deficiencies típicas:</b></p><ul><li>Firma del qualifier falta o incorrecta</li><li>Fechas de experiencia con gap</li><li>Transcripts no sellados directamente de la escuela</li><li>Foto no estilo passport</li><li>Criminal disclosure incompleta</li></ul>",
          links: []
        },
        {
          id: "a_livescan",
          label: "Live Scan fingerprinting ($17 DOJ + $17 FBI + vendor)",
          details: "<p>Una vez que la aplicación es <b>approved for exam</b>, CSLB envía el <b>Request for Live Scan Service (BCIA 8016)</b> pre-llenado con tu ATI # y ORI #.</p><p><b>Costos:</b></p><ul><li>DOJ fee: $17</li><li>FBI fee: $17</li><li>Vendor rolling fee: $20-$40 (varía)</li><li><b>Total típico: $54-$74</b></li></ul><p>Lleva el form y ID a cualquier vendor certificado Live Scan (UPS Store, police stations, private agencies). Resultados van directo a CSLB electrónicamente.</p>",
          links: [
            { label: "CA DOJ — Find Live Scan location", url: "https://oag.ca.gov/fingerprints" }
          ]
        },
        {
          id: "a_background",
          label: "Background check clears (4-8 semanas)",
          details: "<p>Después de Live Scan, DOJ + FBI procesan el background check. Tiempo típico: <b>4-8 semanas</b>. Si tienes criminal history disclosed, puede tomar más — CSLB puede pedir rehabilitation evidence (certificates, references, probation records).</p><p><b>Tip:</b> Si llevas >8 semanas sin update, llama al CSLB (800-321-2752) con tu application #.</p>",
          links: []
        }
      ]
    },

    // ─────────────────────────────────────────────
    // PHASE 5 — EXAM
    // ─────────────────────────────────────────────
    {
      id: "exam",
      title: "5. Exámenes (Law + Trade)",
      icon: "📝",
      timeline: "se programa al aprobar",
      color: "#fbbf24",
      steps: [
        {
          id: "x_locations",
          label: "Locaciones del examen",
          details: "<p>CSLB opera <b>7 testing centers</b>:</p><ul><li><b>Sacramento</b> — HQ, más fechas disponibles</li><li><b>Oakland</b> (East Bay)</li><li><b>Berkeley</b></li><li><b>Fresno</b> (Central Valley)</li><li><b>San Bernardino</b> (Inland Empire)</li><li><b>Norwalk</b> (SE LA County)</li><li><b>San Diego</b></li></ul><p>Al aprobar la aplicación, recibes letter con código para agendar online. Elige fecha + locación. <b>No se puede cancelar</b> sin perder el fee.</p>",
          links: []
        },
        {
          id: "x_whatbring",
          label: "Qué llevar al examen",
          details: "<p><b>LLEVAR:</b></p><ul><li>Confirmation letter de CSLB</li><li>ID oficial con foto (DL, passport, military ID)</li><li>Ropa cómoda (3.5 hrs sentado)</li></ul><p><b>NO PERMITIDO:</b></p><ul><li>Celular / smartwatch / cualquier electrónico</li><li>Calculadora propia (CSLB provee una básica)</li><li>Libros / notas / papel</li><li>Comida / bebida (lockers afuera)</li><li>Chamarra con bolsillos grandes</li></ul><p>Llegar <b>30 min antes</b> — tarde = forfeit del exam.</p>",
          links: []
        },
        {
          id: "x_law",
          label: "Law & Business Exam (115 Qs · 3.5 hrs · 73%)",
          details: "<p>El <b>Law & Business exam</b> es el mismo para todas las clasificaciones. 115 preguntas multiple choice, 3.5 horas, <b>73% para pasar</b> (~84 correctas).</p><p><b>Áreas cubiertas:</b></p><ul><li>Business organization (entities, DBA, EIN)</li><li>Licensing requirements & classifications</li><li>Contracts (home improvement, residential, commercial)</li><li>Employment (hiring, W-2 vs 1099, wage orders)</li><li>Public works & prevailing wage</li><li>Safety (Cal/OSHA, IIPP, T8)</li><li>Insurance & bonds</li><li>Financial management & taxes</li><li>Mechanics liens & disputes</li></ul><p>Usa el <b>banco de preguntas Law</b> del Maestro Zone + CSLB Study Guide oficial.</p>",
          links: [
            { label: "CSLB — Law Study Guide", url: "https://www.cslb.ca.gov/Contractors/Applicants/Exam_Study_Guides/" }
          ]
        },
        {
          id: "x_trade",
          label: "Trade Exam (C-20, C-38, C-10, etc.)",
          details: "<p>El <b>Trade exam</b> es específico a tu clasificación. Mismo formato: <b>115 Qs / 3.5 hrs / 73% pasar</b>.</p><ul><li><b>C-20 HVAC</b>: load calc (Manual J/S/D), refrigerant charging, ductwork, combustion, venting, Title 24, controls</li><li><b>C-38 Refrigeration</b>: commercial systems, walk-ins, reach-ins, ice machines, pressure-temp, EPA 608</li><li><b>C-10 Electrical</b>: NEC, service sizing, grounding, motors, controls, solar</li><li><b>B General</b>: framing, concrete, roofing, plumbing basics, mecánico basics, overall management</li></ul><p>El trade es <b>igual o MÁS duro que el Law</b> — no lo subestimes.</p>",
          links: [
            { label: "CSLB — Trade Study Guides", url: "https://www.cslb.ca.gov/Contractors/Applicants/Exam_Study_Guides/" }
          ]
        },
        {
          id: "x_retake",
          label: "Política de retake ($100 · 21 días espera)",
          details: "<p>Si <b>repruebas</b>, puedes retomar:</p><ul><li><b>Wait period:</b> 21 días calendario</li><li><b>Retake fee:</b> $100 (cada exam, cada intento)</li><li><b>Límite:</b> 5 años desde aplicación original — si no pasas en ese período, la aplicación expira</li></ul><p>Si solo apruebas uno de los dos (Law o Trade), solo retomas el que fallaste. El pasado queda registrado 5 años.</p>",
          links: []
        },
        {
          id: "x_results",
          label: "Resultados mismo día (pass/fail)",
          details: "<p>Pass/fail se entrega <b>al terminar el exam</b> (score sheet en la ventanilla). Detailed score report con breakdown por área llega por correo en <b>1-2 semanas</b> — útil para saber qué estudiar si fallaste.</p><p>Si <b>pasas ambos</b>, CSLB envía <b>Initial License Package</b> (fee $200 + bond requirement) por correo en 1-2 semanas. Tienes <b>1 año</b> para completar y activar la licencia.</p>",
          links: []
        }
      ]
    },

    // ─────────────────────────────────────────────
    // PHASE 6 — FINALIZE
    // ─────────────────────────────────────────────
    {
      id: "finalize",
      title: "6. Finalizar y activar",
      icon: "🏁",
      timeline: "2-4 semanas",
      color: "#f472b6",
      steps: [
        {
          id: "f_bond",
          label: "Contractor Bond $25,000 (costo anual $150-$500)",
          details: "<p>Todos los contratistas CA deben postear un <b>$25,000 Contractor License Bond</b>. No es el costo del bond — es el <b>surety premium</b> anual:</p><ul><li>Credit 700+ : $150-$250/año</li><li>Credit 650-699 : $250-$400/año</li><li>Credit <650 : $400-$700/año (o collateral)</li><li>No credit : puede requerir cash collateral</li></ul><p>Surety companies populares: <b>Surety Bonds Direct, Lance Surety, Bonds Express, Old Republic</b>. Shop alrededor — el pricing varía ~40%.</p>",
          links: [
            { label: "CSLB — Bond Requirements", url: "https://www.cslb.ca.gov/Contractors/Applicants/Bonds.aspx" }
          ]
        },
        {
          id: "f_llc_bond",
          label: "LLC Employee/Worker Bond $100,000 (si LLC + empleados)",
          details: "<p>Si tu entity es <b>LLC</b> y tienes empleados, AB 2190 requiere un <b>$100,000 LLC Employee/Worker Bond</b> adicional. Esto protege wages + benefits de los empleados. Premium anual típico <b>$500-$1,500</b>.</p><p>Sole Prop, Corp, Partnership <b>NO</b> necesitan este bond extra.</p>",
          links: []
        },
        {
          id: "f_workers_comp",
          label: "Workers Comp Insurance (si tienes empleados)",
          details: "<p>CA requiere <b>Workers Compensation Insurance</b> desde el primer empleado (incluye W-2 part-time). El CSLB verifica esto activamente — sin WC = suspensión automática.</p><p>Opciones:</p><ul><li><b>State Fund</b> (StateFundCA.com) — garantizado accept, pricing medio</li><li>Privadas (Employers, AmTrust, ICW, Pie) — mejor pricing para clean records</li></ul><p>Si eres <b>solo owner sin empleados</b>, presenta <b>Exemption from Workers Comp (form on CSLB site)</b> — certificas bajo perjury que no tienes employees.</p>",
          links: [
            { label: "CA DLSE — Labor Standards", url: "https://www.dir.ca.gov/dlse/" }
          ]
        },
        {
          id: "f_fee",
          label: "Pagar Initial License Fee ($200)",
          details: "<p>El <b>Initial License Fee</b> es <b>$200</b> — pagado con el Initial License Package que CSLB envía después de pasar ambos exams. Si aplicaste a <b>multiple classifications</b>, paga fee completo por la primera y $150 por cada adicional.</p><p>Válido por <b>2 años</b>. Renovación es $450 cada 2 años después.</p>",
          links: []
        },
        {
          id: "f_receive",
          label: "Recibir pocket license + wall license",
          details: "<p>Una vez CSLB recibe el Initial License Fee + bond + WC (o exemption), la licencia se <b>activa</b> y envía por correo:</p><ul><li><b>Wall license</b> — certificate grande para oficina</li><li><b>Pocket license</b> — card tamaño wallet</li></ul><p>Tu número aparece instantáneamente en <b>CheckTheLicense.com</b> y clientes pueden verificar live. ¡Felicidades, ya eres contratista licenciado!</p>",
          links: [
            { label: "CSLB — Check License Portal", url: "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" }
          ]
        },
        {
          id: "f_cards",
          label: "Business cards + vehicles con license # (B&P §7030.5)",
          details: "<p><b>Business & Professions Code §7030.5</b> obliga que el número de licencia aparezca en:</p><ul><li>Business cards</li><li>Contracts & invoices</li><li>Ads (prensa, web, TikTok, Facebook)</li><li>Vehículos comerciales (letras 3/4\" mínimo, ambos lados)</li><li>Signage del negocio</li><li>Yelp / Google Business / Thumbtack profiles</li></ul><p>Multa típica por no tenerlo: <b>$200-$1,000</b> por ofensa. Citations se emiten por inspectors CSLB en el field.</p>",
          links: [
            { label: "B&P §7030.5 — Full text", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7030.5." }
          ]
        }
      ]
    }
  ]
};
