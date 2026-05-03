window.CONTRACTOR_BLOQUE_9 = {
  number: 9,
  title: 'EPA, Código, y Drogas',
  tagline: 'Tres reguladores diferentes — zero excusas',
  intro: `
    <p><strong>Ignorancia no es defensa.</strong> Ni ante la EPA, ni ante Cal/OSHA, ni ante ICE, ni ante el DOT, ni ante el Building Department. Cuando un inspector federal te toca la puerta — y tarde o temprano toca — el juez no quiere saber si "nadie te dijo". Quiere ver tu certificación 608 vigente, tu leak repair log del año pasado, tu disconnect a la vista del condensador, tu hoja I-9 archivada, y tu policy de drug-free workplace firmada por cada empleado.</p>
    <p>Este bloque cubre la trifecta regulatoria que TODO contratista HVAC en Estados Unidos — y especialmente en California — tiene que dominar: (1) <strong>regulación federal de refrigerantes</strong> (EPA Section 608 bajo 40 CFR Part 82, AIM Act para el phasedown de HFCs, Section 609 para vehículos); (2) <strong>códigos eléctricos y mecánicos</strong> (NEC 2023 Article 440 para equipo HVAC, California Mechanical Code vs Uniform Mechanical Code, Title 24 para duct sealing); y (3) <strong>compliance laboral</strong> (drug testing con CDL y DOT, marijuana medicinal bajo AB-2188, I-9 / E-Verify / inmigración).</p>
    <p>Las multas son brutales y se aplican <strong>por día y por violación</strong>. EPA Section 608 cobra <strong>$52,639 por día por violación</strong> (ajustada anualmente por inflación). Immigration I-9 paperwork violations van de $281 a $2,789 por formulario. Cal/OSHA por un disconnect mal instalado son $15,000+ por violación seria. No es opcional — es la diferencia entre tener un negocio y perder todo.</p>
    <p><strong>Regla #1:</strong> Cada técnico que toca un refrigerante debe tener 608 vigente (no expira, pero tu empresa DEBE tener copia física o digital en el archivo). Cada empleado detrás del volante de un van con pressure tank de 1,000+ lbs GVWR debe cumplir DOT. Cada persona que cobras W-2 tiene que tener I-9 completado dentro de 3 días.</p>
    <p><strong>Regla #2:</strong> La inspección sorpresa existe. Cal/OSHA entra sin cita. ICE entra con Notice of Inspection de 3 días. EPA no te llama antes. Si tu sistema de compliance depende de "preparar cuando llegue la carta", ya perdiste. El compliance es diario — los archivos están al día o no están.</p>
  `,
  sections: [
    {
      id: 'epa-608-compliance',
      heading: 'EPA Section 608 — El Core del Compliance Federal',
      body: `
        <p><strong>Section 608 del Clean Air Act</strong>, implementado bajo <strong>40 CFR Part 82, Subpart F</strong>, es la piedra angular del compliance federal para cualquier persona que abre un sistema de refrigeración comercial. No es estatal, no es opcional, no es negociable. Si un técnico tuyo recupera un Schrader, rompe un lineset, o evacua un equipo sin certificación vigente, la EPA te puede multar — aunque el técnico tenga 20 años de experiencia.</p>

        <h4>Los 4 tipos de certificación 608 (40 CFR §82.161)</h4>
        <ul>
          <li><strong>Type I — Small Appliances:</strong> equipos con 5 lbs o menos de refrigerante, factory-sealed (refrigeradores domésticos, window ACs, deshumidificadores, fuentes de agua). Examen de 25 preguntas + core.</li>
          <li><strong>Type II — High-Pressure Appliances:</strong> equipos con refrigerante presurizado mayor a 44 psig a 68°F — esto incluye casi todo el split residencial y comercial (R-410A, R-22, R-454B, R-32, R-407C). Examen de 25 preguntas + core.</li>
          <li><strong>Type III — Low-Pressure Appliances:</strong> chillers centrífugos con R-11, R-123, R-1233zd — equipos con saturated vapor pressure menor a 15 psia a 68°F. Examen especializado para chiller mechanics.</li>
          <li><strong>Universal:</strong> aprueba Type I + II + III + Core. Esto es lo que todo técnico HVAC-R comercial serio debe tener. El examen universal es 100 preguntas.</li>
        </ul>
        <p>El <strong>Core Section</strong> (25 preguntas) es obligatorio para todos y cubre: ozone depletion, Montreal Protocol, recovery equipment, leak detection, safety, recordkeeping. <strong>La certificación NO expira</strong> — es de por vida — pero tu empresa debe mantener evidencia física o digital de la tarjeta de cada técnico.</p>

        <h4>Leak Repair Thresholds (40 CFR §82.157) — Lo que TIENES que saber</h4>
        <p>Para equipos con <strong>carga de refrigerante de 50 lbs o más</strong> (full charge), EPA exige reparación de fugas cuando la pérdida anualizada excede el threshold:</p>
        <ul>
          <li><strong>Comercial refrigeration (supermercados, walk-ins, rack systems):</strong> <strong>20%</strong> annualized leak rate.</li>
          <li><strong>Industrial process refrigeration:</strong> <strong>30%</strong> annualized leak rate.</li>
          <li><strong>Comfort cooling y otros equipos (chillers, VRF grandes):</strong> <strong>10%</strong> annualized leak rate (bajó de 15% desde 2019).</li>
        </ul>
        <p>Si el sistema pasa el threshold: tienes <strong>30 días para reparar</strong> la fuga (o desarrollar un plan de retirement), y después de reparar debes hacer <strong>verification test</strong> (initial verification) y <strong>follow-up verification</strong>. Si no puedes reparar en 30 días, tienes que presentar un <strong>retrofit/retirement plan</strong> de 1 año al EPA. Se aplica solo a equipos con appliance-specific leak rate definido por EPA.</p>

        <h4>Recovery es obligatoria — no "venting" jamás</h4>
        <p><strong>40 CFR §82.154</strong> prohibe explícitamente el <strong>venting</strong> de refrigerantes clase I, II, y ahora (bajo AIM Act) también los substitutes HFC/HFO. Los niveles de recovery requeridos por EPA:</p>
        <ul>
          <li><strong>High-pressure equipment &lt;200 lbs:</strong> recuperar a 0 psig (para recovery)</li>
          <li><strong>High-pressure &gt;200 lbs:</strong> 10 inches Hg vacuum</li>
          <li><strong>Very-high-pressure (R-503, R-13):</strong> 0 psig</li>
          <li><strong>Low-pressure chillers:</strong> 29 inches Hg vacuum para major service; 25 mm Hg para disposal</li>
        </ul>
        <p>Tu <strong>recovery machine debe estar certificada EPA/UL</strong> con placa visible, y para venderla o usarla el comprador debe tener 608.</p>

        <h4>Recordkeeping — 3 años mínimo (40 CFR §82.166)</h4>
        <p>Debes mantener por <strong>3 años mínimo</strong>:</p>
        <ul>
          <li>Nombre, dirección y tipo de certificación de cada técnico que trabaja para ti</li>
          <li>Para cada equipo 50+ lbs: service records con fecha, tipo de refrigerante, cantidad added/recovered, leak repairs, verification tests</li>
          <li>Refrigerant purchase records (vendedor, cantidad, tipo) — los distribuidores solo venden a 608-certified</li>
          <li>Disposal records (quién, cuándo, cuánto, documento de reclaimer certificado EPA)</li>
          <li>Si eres wholesaler: records de a quién vendiste refrigerante</li>
        </ul>

        <h4>Penalidades — $52,639 por día por violación</h4>
        <p>La multa máxima federal bajo <strong>Clean Air Act §113(d)</strong> para violaciones Section 608 es <strong>$52,639 por día por violación</strong> (ajustada por inflación anualmente — era $44,539 hace unos años). EPA publica los settlements en epa.gov/enforcement — hay casos de contratistas residenciales con $100K–$500K en multas por venting R-22 durante recovery mala, o por vender refrigerante a personas sin 608. El whistleblower program paga hasta <strong>$10,000 de recompensa</strong> al que reporte venting — tu empleado despedido te puede denunciar.</p>
      `,
      keyPoints: [
        '608 tiene 4 tipos: I (small), II (high-pressure), III (low-pressure), Universal',
        'Certificación NO expira — pero empresa debe archivar copia de cada técnico',
        'Leak repair: 20% comercial refrig, 30% industrial, 10% comfort cooling',
        '30 días para reparar fuga + verification test inicial y follow-up',
        'Venting prohibido — recovery a vacuum/psig específico según equipo',
        'Recordkeeping 3 años: técnicos, equipos 50+ lbs, compras, disposal',
        '$52,639 por día por violación — whistleblower paga $10K por denuncia'
      ],
      realTalk: '"Una vez un técnico mío venteo media libra de 410A porque el Schrader se atascó y le dio flojera traer la recovery del truck. Un vecino lo vio y llamó a EPA. $27,000 de multa a la empresa, no al técnico. La EPA no juega — tratan refrigerantes como tratan lead paint. Y en California, CARB lo refuerza doble."',
      checklist: [
        'Cada técnico tiene 608 vigente (tarjeta física o PDF en archivo)',
        'Recovery machine EPA/UL con placa visible',
        'Micron gauge y manifold calibrados',
        'Service log template para equipos 50+ lbs con leak repair tracking',
        'Refrigerant purchase records archivados 3 años',
        'Disposal receipts de reclaimer certificado EPA',
        'SDS de cada refrigerante en el truck (A2L requiere especial)',
        'Empleados entrenados en que venting = despido inmediato'
      ],
      commonMistakes: [
        'Asumir que certificación 608 "del técnico anterior" protege a tu empresa — NO, debe estar en TU archivo',
        'No tracking leak rate en equipos supermercado — multa por recordkeeping solo',
        'Vender Schrader de 10 lbs de 410A a persona sin 608 (te cae en ti como vendedor)',
        'Venting "pequeño" durante quick repair — no existe "pequeño" para EPA',
        'Comprar refrigerante de gray market de Mexico/Amazon sin reclamer cert',
        'No hacer initial + follow-up verification test después de leak repair'
      ]
    },
    {
      id: 'aim-act-hfc-phasedown',
      heading: 'AIM Act y el Phasedown de HFCs — R-410A se va',
      body: `
        <p>El <strong>American Innovation and Manufacturing Act of 2020 (AIM Act)</strong>, firmado en diciembre 2020 como parte del Consolidated Appropriations Act, le dio a la EPA autoridad explícita para regular los <strong>hydrofluorocarbons (HFCs)</strong> — refrigerantes como R-410A, R-134a, R-404A, R-407C, R-32. El objetivo: <strong>reducir el consumo y producción de HFCs en 85% para 2036</strong>, alineando a USA con el <strong>Kigali Amendment del Montreal Protocol</strong>.</p>
        <p>Para contratistas, esto no es teoría climática — es realidad operacional. R-410A, que ha sido el refrigerante residencial dominante desde 2010, <strong>desaparece de sistemas nuevos a partir del 1 de enero de 2025</strong> bajo la regla de Technology Transitions del AIM Act. Si no estás preparado para A2L, vas a perder trabajos.</p>

        <h4>El Calendario del Phasedown — allocation system</h4>
        <p>La EPA implementó un <strong>cap-and-allocation system</strong> bajo AIM Act. Productores e importadores de HFCs reciben <strong>allowances</strong> (cuotas) que declinan:</p>
        <ul>
          <li><strong>2022–2023:</strong> baseline — 90% del consumo histórico (-10%)</li>
          <li><strong>2024–2028:</strong> 60% del baseline (-40%)</li>
          <li><strong>2029–2033:</strong> 30% (-70%)</li>
          <li><strong>2034–2035:</strong> 20% (-80%)</li>
          <li><strong>2036+:</strong> 15% (-85%)</li>
        </ul>
        <p>El efecto de mercado ya se ve: R-410A subió de ~$100 por 25 lb jug en 2020 a <strong>$400–$700+ por jug</strong> en 2024–2025 en temporada alta. Para 2030 el R-410A va a estar a <strong>$1,500+ por jug</strong> o no lo vas a encontrar. Tu servicio legacy a sistemas 410A se vuelve premium business — si tienes inventario guardado.</p>

        <h4>Technology Transitions Rule — prohíbe equipo nuevo con alto GWP</h4>
        <p>La <strong>Technology Transitions Final Rule</strong> (octubre 2023) bajo AIM Act Section (i) prohíbe la fabricación e importación de equipo nuevo usando refrigerantes de alto GWP en sectores específicos:</p>
        <ul>
          <li><strong>Residential/light commercial AC y heat pumps:</strong> GWP &lt;700 a partir del 1 enero 2025 — R-410A (GWP 2088) prohibido en sistemas nuevos</li>
          <li><strong>Supermercado comercial refrigeration nuevo:</strong> GWP caps específicos desde 2025–2027</li>
          <li><strong>Chillers nuevos:</strong> transición escalonada hacia low-GWP</li>
          <li><strong>Service de equipo existente:</strong> <strong>permitido</strong> con R-410A virgen o reclamado — pero cada año más caro</li>
        </ul>

        <h4>A2L — Mildly Flammable Refrigerants (R-32, R-454B)</h4>
        <p>Los reemplazos para R-410A son principalmente refrigerantes <strong>A2L — mildly flammable con baja toxicidad</strong> por ASHRAE 34:</p>
        <ul>
          <li><strong>R-32 (difluoromethane):</strong> GWP 675, single-component, ya usado en Japón/Europa desde 2012. Daikin lo introdujo al mercado USA.</li>
          <li><strong>R-454B (Opteon XL41):</strong> GWP 466, blend de R-32 + R-1234yf. Carrier, Trane, Lennox lo adoptaron como successor de 410A.</li>
          <li><strong>R-452B:</strong> GWP 698, similar uso comercial</li>
          <li><strong>R-1234yf:</strong> automotive (Section 609), GWP menor a 1</li>
        </ul>
        <p>Características A2L que afectan instalación:</p>
        <ul>
          <li><strong>Flammability:</strong> requiere ignition source mayor y mezcla específica con aire — menos flamable que propano (A3), pero NO zero. Sparks eléctricos normales generalmente no encienden.</li>
          <li><strong>Leak detection:</strong> sensores específicos requeridos en equipos indoor de cierto tonelaje</li>
          <li><strong>Herramientas:</strong> recovery machine, vacuum pump, manifold <strong>deben ser rated para A2L</strong> (spark-free o sealed motor). Machines viejas de R-410A no son legales.</li>
          <li><strong>Brazing:</strong> purge con nitrógeno OBLIGATORIO, evacuación completa antes de soldar — riesgo de combustion si hay mezcla residual</li>
          <li><strong>Storage:</strong> cilindros deben estar en área ventilada, no en van cerrada al sol</li>
        </ul>

        <h4>Section 608 ahora APLICA a A2Ls</h4>
        <p>Originalmente, EPA Section 608 aplicaba solo a ODS (CFCs, HCFCs) y después se extendió a HFCs como "substitutes". Bajo AIM Act, EPA emitió la <strong>Refrigerant Management Rule</strong> (octubre 2024, 40 CFR Part 84) que <strong>extiende Section 608 requirements a todos los refrigerantes regulados bajo AIM</strong> — incluyendo R-32, R-454B, y otros A2Ls:</p>
        <ul>
          <li>Venting prohibido — mismas reglas que R-410A</li>
          <li>608 Technician certification requerida para manejo</li>
          <li>Recovery machine certificada requerida</li>
          <li>Leak repair thresholds aplican igual a 50+ lbs equipos</li>
          <li>Recordkeeping 3 años extendido a A2Ls</li>
        </ul>
        <p>También hay nueva regla: <strong>reclaimed refrigerant requirements</strong> — para ciertos sectores a partir de 2029, tienes que usar reclaimed (no virgin) para servicing, para forzar la circular economy.</p>

        <h4>Training adicional — ASHRAE 15-2022 y UL 60335-2-40</h4>
        <p>Si tu empresa instala equipo A2L, tus técnicos deben estar entrenados en <strong>ASHRAE Standard 15-2022</strong> (Safety Standard for Refrigeration Systems) y <strong>UL 60335-2-40</strong> (Safety of Heat Pumps y AC con refrigerantes flamables). Muchos manufacturers requieren training certification de su brand (Carrier Factory Authorized, Daikin FIT, etc.) antes de venderte equipo A2L y honrar warranty.</p>
      `,
      keyPoints: [
        'AIM Act 2020: phasedown HFCs 85% para 2036',
        'R-410A prohibido en equipo residencial NUEVO desde enero 2025 (service sigue legal)',
        'Reemplazos: R-32 (GWP 675), R-454B (GWP 466) — ambos A2L mildly flammable',
        'Recovery machine, vacuum, manifold deben ser rated A2L',
        'Section 608 AHORA aplica a A2Ls — venting prohibido, 608 cert requerida',
        'R-410A sube de precio agresivo: $400–$700+ por jug en 2025, $1,500+ esperado para 2030',
        'Training ASHRAE 15 + UL 60335-2-40 requerido para A2L work'
      ],
      realTalk: '"El contratista que en 2025 todavía no tiene herramienta A2L y training ya está out of the game. Los wholesalers (Ferguson, Johnstone) solo te venden A2L si muestras la factory training cert. Y el que siga vendiendo 410A new systems está violando el reg federal — multa directa. Esto no es el año 2024, esto ya pasó."',
      checklist: [
        'Técnicos certificados en factory training A2L (Carrier/Daikin/Trane/Lennox)',
        'Recovery machine rated A2L (spark-free motor)',
        'Vacuum pump compatible A2L',
        'Manifold / core tools listed para A2L',
        'Leak detector UV o electronic sensitive a HFOs',
        'Nitrogen purge en cada brazing (OBLIGATORIO con A2L)',
        'Inventario de R-410A para servicing sistemas legacy',
        'SDS actualizado para cada A2L en el truck',
        'Cilindros A2L en rack ventilado, no en cabina cerrada'
      ],
      commonMistakes: [
        'Usar recovery machine vieja no rated para A2L — ignition risk',
        'Brazing A2L sin purga de nitrógeno completa',
        'Asumir que R-32 y R-454B son "igual que 410A" — no lo son, tienen pressure/temperature diferente',
        'Cargar R-32 en un sistema designed for 410A (cross-charging prohibido)',
        'No factory training y tratar de warranty claim — denegado',
        'Guardar R-410A recuperado sin verificar purity (bad charge = warranty call gratis)'
      ]
    },
    {
      id: 'section-609-mvac',
      heading: 'Section 609 — MVAC (Motor Vehicle Air Conditioning)',
      body: `
        <p>Un error costoso de contratistas HVAC: asumir que su certificación 608 les permite trabajar en sistemas de AC vehicular. <strong>No es así.</strong> El Clean Air Act tiene una sección completamente separada — <strong>Section 609</strong>, implementada bajo <strong>40 CFR Part 82, Subpart B</strong> — que regula Motor Vehicle Air Conditioners (MVAC). Si tu empresa da service a AC de vans, pickups, SUVs, fleet vehicles o RVs para terceros, CADA técnico que toque esos sistemas necesita certificación 609.</p>

        <h4>Cuándo aplica Section 609</h4>
        <p>MVAC definido como: sistema de AC en vehículos con GVWR (Gross Vehicle Weight Rating) <strong>hasta ~8,500 lbs</strong> (light-duty vehicles). Esto incluye:</p>
        <ul>
          <li>Cars, pickup trucks, vans, SUVs residenciales</li>
          <li>Fleet vehicles (los vans de tu propia empresa, si los servicearas para alguien más)</li>
          <li>RVs y motorhomes</li>
          <li>Vehículos comerciales light-duty</li>
        </ul>
        <p><strong>Excepciones:</strong> heavy-duty trucks (&gt;8,500 lbs GVWR) y off-road equipment <strong>caen bajo Section 608</strong> (específicamente "MVAC-Like Appliance"). Los yellow-iron equipment (excavadoras, loaders) usan sus propias reglas.</p>

        <h4>Diferencias clave vs Section 608</h4>
        <ul>
          <li><strong>Certificación separada:</strong> 609 se saca aparte. Algunos proveedores (MACS Worldwide, Snap-on, ESCO) dan el examen online por ~$20–$40.</li>
          <li><strong>Refrigerantes cubiertos:</strong> históricamente R-134a; ahora también <strong>R-1234yf (HFO-1234yf)</strong> que es el refrigerante automotriz moderno desde 2013 en adelante (casi todos los vehículos nuevos).</li>
          <li><strong>Equipment requirements:</strong> recovery/recycling equipment debe cumplir <strong>SAE J2788, J2810, J2843, J2851</strong> — NO puedes usar tu recovery machine de 608 para MVAC legalmente (mezclarías oils y refrigerants).</li>
          <li><strong>No hay Core exam:</strong> 609 es un examen único, más corto.</li>
          <li><strong>Certificación NO expira</strong> (igual que 608).</li>
        </ul>

        <h4>R-1234yf — el nuevo automotive refrigerant</h4>
        <p><strong>R-1234yf</strong> reemplaza R-134a en casi todos los vehículos OEM desde 2014–2021 (rollout escalonado por brand). GWP de 4 (comparado con 1,430 de R-134a). Es <strong>A2L — mildly flammable</strong>, igual que sus primos residenciales. Características:</p>
        <ul>
          <li>$60–$120 por lb retail en parts store (vs R-134a a $15–$30/lb)</li>
          <li>Requiere recovery/recycle machine <strong>específica SAE J2843 o J2851</strong> — NO se mezcla con machine de R-134a</li>
          <li>Fittings diferentes — los quick-connects son únicos para 1234yf</li>
          <li>Identifier tool obligatorio antes de servicear — un shop puede cross-contaminar y dañar el compresor del siguiente vehículo</li>
        </ul>

        <h4>Wholesaler / retail restrictions</h4>
        <p>Section 609 tiene restricciones de venta:</p>
        <ul>
          <li>R-134a en <strong>containers mayores a 2 lbs</strong> solo se vende a 609-certified (desde 2018)</li>
          <li>Small cans (menores a 2 lbs) pueden venderse al público — <strong>excepto en California</strong>, donde CARB prohibió la venta retail de small cans desde 2010</li>
          <li>R-1234yf solo a 609-certified desde día 1</li>
        </ul>

        <h4>Cuándo un contratista HVAC necesita 609</h4>
        <p>Escenarios comunes:</p>
        <ul>
          <li>Tu fleet de 15 vans y tú haces el AC repair internamente — <strong>no necesitas 609</strong> para tus propios vehículos (exemption para "self-service"), PERO si facturas a alguien más, sí.</li>
          <li>Tu sobrino tiene un car repair shop y te pide que le soples AC de un Ford F-150 — <strong>necesitas 609</strong>.</li>
          <li>Haces service a RVs y motorhomes para clientes — <strong>necesitas 609</strong>.</li>
          <li>Instalas aftermarket AC en camiones viejos — <strong>necesitas 609</strong>.</li>
          <li>Trabajas en heavy truck reefer units (&gt;8,500 GVWR) — necesitas 608 Type II (MVAC-Like).</li>
        </ul>

        <h4>Penalidades</h4>
        <p>Mismas que Section 608: <strong>$52,639 por día por violación</strong> bajo Clean Air Act §113(d). Y si una recovery machine tuya no cumple SAE, es violación per se — no necesitan probar venting.</p>
      `,
      keyPoints: [
        '609 es separada de 608 — certificación aparte para MVAC',
        'Aplica a vehículos hasta ~8,500 lbs GVWR (cars, light trucks, vans)',
        'Heavy trucks >8,500 lbs GVWR caen bajo 608 MVAC-Like',
        'R-134a phasing out; R-1234yf es el standard desde 2014+',
        'Recovery machines SAE J2788/J2810/J2843 — distintas a las de 608',
        'Examen ~$20–$40, online, no expira',
        'Self-service de tu propio fleet está exento, pero tocar car de cliente requiere 609'
      ],
      realTalk: '"Mi primo tenía un shop de electrical y empezó a hacer AC jobs de F-150s sin 609. Un cliente enojado llamó a EPA. $8,000 de multa a su LLC, más reporte a DMV que le paró el BAR license. El examen cuesta $25. Es estúpido no tenerlo si tienes fleet."',
      checklist: [
        'Si haces MVAC para terceros: 609 certification por técnico',
        'Recovery/recycle machine SAE-approved separada',
        'R-1234yf identifier tool para evitar cross-contamination',
        'R-134a solo a 609-certified (containers >2 lbs)',
        'En CA: no vender small cans R-134a retail (CARB)',
        'Fittings y adapters específicos para 1234yf',
        'Archivo de certificaciones por técnico, igual que 608'
      ],
      commonMistakes: [
        'Asumir que 608 te cubre MVAC — no, son reglas separadas',
        'Usar la misma recovery machine para sistemas residenciales y MVAC',
        'No identificar refrigerante antes de conectar — contamina máquina y cliente',
        'Servicear RVs sin 609 asumiendo que es "igual que casa"',
        'Vender small cans R-134a en California (CARB prohibido)',
        'Pensar que tu 609 de 1995 todavía aplica a R-1234yf — el training nuevo es crítico'
      ]
    },
    {
      id: 'nec-2023-hvac',
      heading: 'NEC 2023 Article 440 — Código Eléctrico para HVAC',
      body: `
        <p>El <strong>National Electrical Code (NEC)</strong>, publicado por NFPA y actualizado cada 3 años, es el código eléctrico base adoptado por casi todos los estados (California adopta como California Electrical Code / Title 24 Part 3 con amendments locales). La edición <strong>NEC 2023</strong> es la vigente — y si tu work eléctrico no cumple, el inspector te lo reprueba y pierdes dinero cada día que no puedas energizar.</p>
        <p>Para HVAC, el article crítico es <strong>Article 440 — Air-Conditioning and Refrigerating Equipment</strong>. Es obligatorio conocerlo si eres C-20 en California o tienes un electrician subcontratista que dice "yo sé de AC" — tienes que auditarlo.</p>

        <h4>Article 440.14 — Disconnect within sight</h4>
        <p>La regla más violada en inspecciones residenciales: <strong>NEC 440.14 exige un disconnect readily accessible y "within sight" del equipo</strong>. "Within sight" se define como <strong>visible y no más de 50 pies de distancia</strong> del equipo.</p>
        <ul>
          <li>Condensador outdoor: disconnect debe estar pegado a la pared del condensador o cerca, visible desde el equipo</li>
          <li>Air handler indoor: disconnect puede ser el breaker del panel si el panel está within sight; si no, se requiere disconnect local</li>
          <li>Package unit rooftop: disconnect al lado del unit, en la azotea</li>
          <li>Mini-split: outdoor unit necesita disconnect; indoor heads generalmente no</li>
        </ul>
        <p>Failures comunes: disconnect en el garage 30 ft adentro de la pared, condensador al otro lado — invisible = fail. Disconnect con key lock en posición "off" — si necesitas llave es "not readily accessible" = fail.</p>

        <h4>Article 440.32 — Branch Circuit Conductor Sizing (125% FLA)</h4>
        <p>Los conductores del branch circuit a equipo AC motor-compressor deben tener <strong>ampacity &ge; 125% de la mayor motor load (FLA)</strong> del equipo. La fórmula:</p>
        <p><strong>Conductor size &ge; 1.25 × RLA (Rated Load Amps) del compressor MÁS 1.0 × FLA de otros motors (condenser fan, blower)</strong></p>
        <p>Esto coincide con el <strong>Minimum Circuit Ampacity (MCA)</strong> en la nameplate del equipo. Siempre usa el MCA de la placa como source of truth — los fabricantes ya hicieron la math. Ejemplo: placa dice MCA 23A → usa #10 AWG copper THHN (rated 30A en 75°C column de NEC Table 310.16) o mejor.</p>

        <h4>Article 440.22 — Overcurrent Protection (MOCP)</h4>
        <p>El breaker o fuse no se dimensiona como conductor — se usa <strong>Maximum Overcurrent Protection (MOCP)</strong> de la nameplate:</p>
        <ul>
          <li>MOCP generalmente es <strong>175% del RLA del compresor + 100% de otros motors</strong>, o a veces <strong>225%</strong> para compressors con ciertas características</li>
          <li>La placa dice "Max Fuse/HACR Breaker: 40A" — eso es el límite máximo, NO lo que tienes que usar. Puedes usar menor</li>
          <li>Debe ser <strong>HACR-rated breaker</strong> (Heating, Air-Conditioning, Refrigeration) — un breaker normal puede nuisance-trip con compressor inrush</li>
        </ul>
        <p>Common failure: contratista pone 50A breaker en equipo con MOCP 40A — inspector reprueba. O pone 20A cuando MCA es 23A — trip en primera hot day.</p>

        <h4>Article 210.8(F) — GFCI para outdoor outlets y equipment</h4>
        <p>NEC 2023 expandió GFCI requirements significativamente. <strong>210.8(F)</strong> ahora requiere GFCI protection para outdoor outlets que supply HVAC equipment hasta 250V. Aplicación específica:</p>
        <ul>
          <li><strong>Outdoor receptacle para service (típicamente 125V):</strong> GFCI obligatorio — 210.8(A)(3)</li>
          <li><strong>Packaged unit 240V rooftop/ground-mount hasta 50A:</strong> GFCI requerido bajo 210.8(F) en NEC 2020 y 2023</li>
          <li><strong>Residential splits con condenser outdoor:</strong> discussion activa — algunas jurisdictions lo exigen ya, otras no</li>
        </ul>
        <p>Problem real: algunos condensing units residenciales tienen <strong>nuisance trips con GFCI</strong> por current leakage normal de VFDs, SCR soft-starts y electronic components. La industria (AHRI) empujó el NMX 2026 para dar relief a residential condensers con label UL 1995 compliant. Mientras tanto, si el AHJ pide GFCI, es GFCI. Usa breakers GFCI de clase apropiada (Class A o equipment-protective según local amendment).</p>

        <h4>Otros puntos clave de Article 440</h4>
        <ul>
          <li><strong>440.65 — Leakage Current Detection and Interruption (LCDI) o AFCI:</strong> room air conditioners cord-and-plug requieren protección de leakage</li>
          <li><strong>440.52 — Overload Protection:</strong> el compressor debe tener overload protector built-in (generalmente internal del fabricante)</li>
          <li><strong>440.14 — Locking provision:</strong> si el disconnect no es within sight del equipo, debe ser lockable en posición off (para lockout-tagout)</li>
          <li><strong>100°C temperature rating:</strong> conductors cerca de condensers que calientan deben ser temperature-rated apropiadamente</li>
          <li><strong>Working space:</strong> NEC 110.26 — 30" width, 3 ft depth, 6.5 ft height en frente de disconnect</li>
        </ul>

        <h4>California amendments — Title 24 Part 3</h4>
        <p>California adopta NEC con amendments. Títulos relevantes:</p>
        <ul>
          <li>CEC (California Electrical Code) sigue NEC con pequeños ajustes locales</li>
          <li>Title 24 Part 6 (Energy Code) tiene requirements adicionales: duct sealing, refrigerant charge verification, economizer</li>
          <li>CALGreen tiene requirements adicionales de efficiency</li>
          <li>Coastal / high-fire severity zones pueden tener amendments extra</li>
        </ul>
      `,
      keyPoints: [
        'NEC Article 440 es el artículo base para HVAC electrical',
        '440.14: disconnect within sight — visible + ≤50 ft del equipo',
        '440.32: conductor sizing = MCA de la placa (125% de motor loads)',
        '440.22: overcurrent = MOCP de placa — breaker HACR-rated',
        'GFCI 210.8(F) expandido a 240V outdoor packaged equipment',
        'Working space NEC 110.26: 30" x 3ft x 6.5ft frente al disconnect',
        'California: Title 24 + CEC añade requirements de efficiency'
      ],
      realTalk: '"El inspector más estricto es el eléctrico. He visto jobs reprobados 3 veces por el disconnect 55 ft del condensador. Regresar, mover junction box, re-inspection, $400 por visit. Y el cliente pensando que eres incompetente. Con una foto de la placa y un checklist NEC 440 a mano, te evitas todo eso."',
      checklist: [
        'Disconnect within sight del condensador (visible + ≤50 ft)',
        'Disconnect lockable si no within sight (OSHA LOTO)',
        'Conductor AWG match MCA de nameplate',
        'Breaker HACR-rated, ampacity ≤ MOCP de placa',
        'GFCI en outdoor outlets 120V y 240V packaged si AHJ requiere',
        'Working space 30x36x78 inches mínimo frente al disconnect',
        'Grounding/bonding del equipo a ground rod o service',
        'Whip flex conduit listed, con strain relief en ambos lados',
        'Plate covers selladas waterproof en outdoor disconnects'
      ],
      commonMistakes: [
        'Disconnect muy lejos o detrás de pared sin visibilidad',
        'Usar breaker no-HACR — nuisance trips en hot days',
        'Overkill el breaker (50A en MOCP 40A) — inspector falla',
        'No GFCI donde ahora lo exige 210.8(F) 2023',
        'Whip conduit sin strain relief o mal sellado',
        'No grounding del condenser — shock hazard + fail inspection',
        'Working space bloqueado por HVAC pad — fail 110.26'
      ]
    },
    {
      id: 'cmc-umc',
      heading: 'CMC vs UMC — Códigos Mecánicos y Title 24',
      body: `
        <p>El código mecánico regula ducts, venting, combustion air, refrigerant piping, y todo el physical installation del HVAC non-electrical. A nivel nacional existen <strong>dos familias de mechanical codes</strong>, y dependiendo del estado/condado aplica uno u otro:</p>
        <ul>
          <li><strong>Uniform Mechanical Code (UMC)</strong> — publicado por IAPMO. Adoptado por California (California Mechanical Code CMC es basado en UMC), Washington, Oregon en partes, algunos counties del Midwest.</li>
          <li><strong>International Mechanical Code (IMC)</strong> — publicado por ICC. Adoptado por la mayoría de estados USA (Florida, Texas, Georgia, New York state, etc.).</li>
        </ul>

        <h4>California Mechanical Code (CMC) — Title 24 Part 4</h4>
        <p>El <strong>CMC</strong> es la versión California del UMC, con amendments de la Housing & Community Development (HCD) y California Building Standards Commission. Re-publicado cada 3 años (CMC 2022 vigente hasta que salga CMC 2025). Se aplica junto con:</p>
        <ul>
          <li><strong>Title 24 Part 4 (CMC):</strong> mechanical code propiamente</li>
          <li><strong>Title 24 Part 6 (CEC — Energy Code):</strong> efficiency requirements — duct sealing, refrigerant charge, economizer</li>
          <li><strong>Title 24 Part 11 (CALGreen):</strong> green building standards</li>
          <li><strong>Title 24 Part 9 (Fire Code):</strong> commercial kitchen hoods, grease ducts</li>
        </ul>

        <h4>Gas Venting — Categorías I, II, III, IV</h4>
        <p>Para furnaces, water heaters con gas, y equipos con combustion, la categoría del venting determina el material y diseño del vent:</p>
        <ul>
          <li><strong>Category I:</strong> non-condensing, negative vent pressure, flue gas &gt;275°F. Vents con <strong>B-vent</strong> metal (natural draft / induced draft). Ejemplo: furnace 80% AFUE.</li>
          <li><strong>Category II:</strong> non-condensing, negative vent pressure, flue &lt;275°F (con condensate possible). Uso raro, principalmente equipo especial.</li>
          <li><strong>Category III:</strong> non-condensing, <strong>positive vent pressure</strong>, flue &gt;275°F. Requires <strong>single-wall or special Category III vent material</strong> con sealed joints (power-vented water heaters).</li>
          <li><strong>Category IV:</strong> <strong>condensing</strong>, positive pressure, flue &lt;275°F. Vent de <strong>PVC/CPVC/polypropylene schedule 40</strong> con primer y cement específico. Pendiente hacia el furnace para drain condensate. Ejemplo: modulating furnace 95%+ AFUE.</li>
        </ul>
        <p><strong>Error más común:</strong> mezclar category venting. Nunca conectes Category I (furnace 80%) al mismo chimney que Category IV (water heater condensing). Y nunca uses PVC en un Category I flue — se derrite.</p>

        <h4>Combustion Air — UMC/CMC Chapter 7</h4>
        <p>Todo equipo gas en indoor necesita combustion air adecuado. Métodos permitidos:</p>
        <ul>
          <li><strong>Outdoor air direct:</strong> 2 permanent openings — one high (top 12" of room), one low (bottom 12"). Each opening: 1 sq inch per 4,000 BTU/h total input de todos los gas appliances (metodos opuestos: one-opening method tiene cálculo diferente).</li>
          <li><strong>Indoor air only:</strong> room volume must be &ge; 50 ft³ per 1,000 BTU/h total input. Ejemplo: furnace 80,000 BTU + water heater 40,000 BTU = 120,000 total → necesita 6,000 ft³ de volumen.</li>
          <li><strong>Direct vent (sealed combustion):</strong> toma aire directo del exterior — no requiere openings en room. Equipo 90%+ condensing generalmente es direct vent.</li>
        </ul>
        <p>Failure común: closet con water heater y furnace juntos, solo louver de 50 sq inches — fallas de combustion air y CO backdraft.</p>

        <h4>Duct Sealing — Title 24 Part 6 (Energy Code)</h4>
        <p>California Title 24 requiere <strong>duct leakage testing</strong> en muchos scenarios:</p>
        <ul>
          <li><strong>Duct replacement ≥40% of ductwork:</strong> leakage test obligatorio a 25 Pa, target ≤15% de fan CFM (existing ducts) o ≤6% (new ducts)</li>
          <li><strong>System replacement (new furnace/AC sobre ducts existentes):</strong> duct test obligatorio en climate zones 2, 9–16 (la mayoría del estado)</li>
          <li><strong>Whole-house new construction:</strong> leakage ≤5% fan CFM</li>
          <li>Testing requiere <strong>HERS rater certificado</strong> — tú como contratista no puedes firmar tu propio test, necesitas tercero</li>
        </ul>
        <p>Penalidades Title 24: un job sin HERS verification no se puede finalizar con el city, y el cliente puede negarse a pagar. Es norma desde 2008.</p>

        <h4>Make-Up Air — commercial kitchens y exhaust &gt;400 CFM</h4>
        <p>Cuando un sistema de exhaust (kitchen hood, fume hood, bathroom exhaust commercial) extrae más de cierto CFM, hay que reponer ese aire:</p>
        <ul>
          <li><strong>Commercial kitchen hood Type I (grease):</strong> make-up air requerido bajo <strong>UMC/CMC Chapter 5 y NFPA 96</strong>. Balance al menos 80% del exhaust airflow.</li>
          <li><strong>Make-up air must be tempered</strong> (calentado en invierno) si &gt;60 CFM per square foot del edificio en climates fríos</li>
          <li><strong>Interlock obligatorio:</strong> make-up air unit y exhaust fan deben arrancar/parar juntos (electrical interlock)</li>
          <li><strong>Residential range hoods &gt;400 CFM:</strong> make-up air requerido por CMC Section 504.5.5 — muchos contratistas se olvidan de esto en remodels de kitchens lujosas</li>
        </ul>

        <h4>Refrigerant piping — CMC Chapter 11</h4>
        <p>CMC Chapter 11 regula refrigerant piping: size, support, protection, testing. Destacados:</p>
        <ul>
          <li>Pressure test a <strong>150% del design pressure</strong> antes de pulling vacuum</li>
          <li>Refrigerant concentration limits per room volume — important for A2L (R-32, R-454B) en small indoor spaces</li>
          <li>Penetration sealing (firestop) cuando crosses rated wall/floor</li>
          <li>Support spacing por pipe size (tabla CMC 1115.1)</li>
        </ul>
      `,
      keyPoints: [
        'California usa CMC (basado en UMC); mayoría de USA usa IMC',
        'Gas vent categories I/II/III/IV determinan material y diseño',
        'Nunca mezclar Category I (B-vent) con Category IV (PVC)',
        'Combustion air: outdoor 2 openings, 1 sq in / 4,000 BTU',
        'Title 24 duct leakage: ≤15% replacement, ≤6% new, ≤5% whole-house',
        'HERS rater certificado obligatorio — no self-certification',
        'Kitchen hood Type I + residential >400 CFM requieren make-up air'
      ],
      realTalk: '"Un furnace 80% y water heater condensing en el mismo closet, conectados al mismo chimney de B-vent — el homeowner me llamó 6 meses después porque el water heater rotted el B-vent con condensate. $4,000 de reparación, al contratista original lo demandaron. El code existe por eso. Respétalo."',
      checklist: [
        'Vent material match category del equipo (B-vent, PVC, CPVC, polypro)',
        'Combustion air calculado: outdoor o indoor volume adecuado',
        'Nunca mezclar Cat I y Cat IV en mismo flue',
        'Title 24 HERS test scheduled si aplica (CZ 2, 9–16 mayormente)',
        'Make-up air para commercial kitchen o >400 CFM residential',
        'Interlock MAU + exhaust fan si commercial',
        'Refrigerant piping pressure-tested 150% design',
        'Penetrations fire-stopped en rated assemblies',
        'Condensate drain con trap + secondary pan si attic'
      ],
      commonMistakes: [
        'Conectar PVC a furnace 80% Category I — funde',
        'Closet sin combustion air openings adequate',
        'Skip HERS test — city no cierra permit',
        'Range hood 600 CFM sin make-up air — negative pressure, backdrafts',
        'Flex duct con kink o compresión — fail duct leakage + low airflow',
        'Refrigerant line set sin support cada X pies — code violation',
        'No primer en cemento PVC — joint fails, condensate leak'
      ]
    },
    {
      id: 'drug-testing-compliance',
      heading: 'Drug Testing — CA vs Federal, DOT y Marijuana',
      body: `
        <p>El drug testing en California HVAC es un campo minado legal: <strong>marijuana es legal a nivel estatal</strong> bajo Prop 64 (2016) pero <strong>sigue illegal a nivel federal</strong> bajo Schedule I del Controlled Substances Act. Cuando tu empleado maneja un van con equipment de 1,000+ lbs GVWR, cuando tiene CDL, cuando trabaja con refrigerantes regulados por EPA — entras en territorio federal, y federal gana a estatal.</p>

        <h4>DOT Drug Testing — obligatorio para CDL y ciertos vehículos</h4>
        <p>El <strong>Department of Transportation (DOT)</strong>, bajo <strong>49 CFR Part 40</strong>, exige drug + alcohol testing para "safety-sensitive employees" — incluyendo drivers que requieren <strong>Commercial Driver's License (CDL)</strong>:</p>
        <ul>
          <li><strong>Class A CDL:</strong> combination vehicles &ge;26,001 lbs GVWR</li>
          <li><strong>Class B CDL:</strong> single vehicle &ge;26,001 lbs</li>
          <li><strong>Class C CDL:</strong> passenger vehicles (no aplica HVAC típicamente)</li>
        </ul>
        <p>Muchos vans HVAC regulares <strong>NO requieren CDL</strong> (están bajo 26,000 lbs GVWR), pero si tienes:</p>
        <ul>
          <li>Box truck grande con crane</li>
          <li>Fleet service truck con compressor grande, trailers</li>
          <li>Transportas hazmat (refrigerante en ciertas cantidades requiere hazmat endorsement)</li>
        </ul>
        <p>...entonces cae en DOT testing program. Los 6 test scenarios obligatorios DOT:</p>
        <ol>
          <li><strong>Pre-employment:</strong> antes del primer día safety-sensitive</li>
          <li><strong>Random:</strong> 50% annual rate for drugs, 10% for alcohol (FMCSA)</li>
          <li><strong>Post-accident:</strong> después de fatal accident o cuando driver recibe citation</li>
          <li><strong>Reasonable suspicion:</strong> trained supervisor observa comportamiento</li>
          <li><strong>Return-to-duty:</strong> después de violation resolved</li>
          <li><strong>Follow-up:</strong> testing por hasta 5 años después de return-to-duty</li>
        </ol>
        <p>Panel de 5 drogas (DOT 5-panel): marijuana (THC), cocaine, opiates (including oxycodone, hydrocodone since 2018), PCP, amphetamines (including MDMA). <strong>THC positive = falla, no hay exception "legal in CA"</strong> — DOT specifically prohibits medical marijuana as defense (49 CFR §40.151).</p>

        <h4>California AB-2188 (2024) — Off-Duty Marijuana Protection</h4>
        <p><strong>AB-2188</strong>, efectivo desde <strong>1 de enero 2024</strong>, amendo el California Fair Employment and Housing Act (FEHA) para prohibir a employers discriminar contra empleados por:</p>
        <ol>
          <li>Uso de marijuana <strong>off-the-job y off-the-premises</strong></li>
          <li>Test results que detectan <strong>metabolitos no-psicoactivos</strong> de THC (el típico urine test detecta metabolitos que persisten 2–30 días después de uso, mucho después del efecto)</li>
        </ol>
        <p><strong>Exempciones críticas:</strong></p>
        <ul>
          <li><strong>Federal law/contracts:</strong> si tu posición requiere DOT testing, DOD clearance, o federal contractor drug-free workplace — AB-2188 NO aplica. Puedes fallar empleados por THC si cae bajo federal</li>
          <li><strong>Safety-sensitive construction:</strong> Building & Construction Trades esta específicamente exempt en la ley final</li>
          <li><strong>Impairment testing:</strong> si puedes probar impairment <em>on the job</em> (saliva swab detectando active THC, behavioral signs documented), todavía puedes acción</li>
        </ul>
        <p>Para HVAC contractors en California: un técnico residencial que solo maneja van 6,000 lbs, sin CDL, <strong>NO puedes firearlo por THC positive en urine random si el uso fue off-duty</strong> (AB-2188 lo protege). Pero si ese mismo técnico se accidenta, tu zero-tolerance policy bajo impairment testing con saliva (detecta active THC) sigue defendible.</p>

        <h4>AB-1288 (2024) — pre-employment testing restrictions</h4>
        <p>Complementa AB-2188: prohibe inquirir sobre <strong>past marijuana use</strong> en employment applications, y prohibe denial of employment basado solo en marijuana metabolitos. Again, federal-preempted positions están exempt.</p>

        <h4>Zero-Tolerance Policy Defensible en CA</h4>
        <p>Para que tu drug-free workplace policy sea defensible en California post-AB-2188:</p>
        <ol>
          <li><strong>Documenta federal nexus:</strong> CDL requirement, DOT regulation, federal contract, EPA Section 608 safety-sensitive — todos aceptables</li>
          <li><strong>Use impairment-detection testing:</strong> saliva swab (detecta THC activo, no metabolitos viejos) es mejor que urine para on-the-job impairment</li>
          <li><strong>Policy escrita + firmada:</strong> cada empleado firma acuse recibo en onboarding</li>
          <li><strong>Training supervisors</strong> en reasonable suspicion observations (DOT tiene 60-minute training module)</li>
          <li><strong>Random testing con third-party administrator (TPA):</strong> evita claims de selective enforcement</li>
          <li><strong>Medical Review Officer (MRO)</strong> obligatorio para DOT testing — licensed MD que revisa positivos</li>
        </ol>

        <h4>Accommodation for Medical Marijuana — límites</h4>
        <p>Bajo AB-2188, empleado con medical marijuana recommendation puede pedir accommodation — pero:</p>
        <ul>
          <li>Accommodation NO significa permitir impairment on the job</li>
          <li>Para safety-sensitive (CDL driver, elevated work, live electrical), impairment risk &gt; accommodation duty → employer puede rechazar</li>
          <li>Process igual que ADA accommodation: interactive process, document denials con specific safety concerns</li>
        </ul>

        <h4>Alcohol testing</h4>
        <p>Más sencillo legalmente. DOT aplica 0.04 BAC límite para CDL (vs 0.08 regular DUI). Cal/OSHA general: reasonable suspicion basada en observation documentada. Post-accident alcohol testing generalmente defendible en cualquier industria.</p>

        <h4>Costos y logística</h4>
        <p>Testing program típico con TPA (DISA, Quest, LabCorp drug testing):</p>
        <ul>
          <li>Setup: $200–$500</li>
          <li>Per test: $35–$75 urine 5-panel; $45–$90 saliva; $60–$120 hair</li>
          <li>MRO review: $15–$30 per positive</li>
          <li>Consortium membership para random selection: $150–$400/año per CDL driver</li>
        </ul>
      `,
      keyPoints: [
        'CDL drivers y otros safety-sensitive caen bajo DOT 49 CFR Part 40',
        'DOT 5-panel: THC, cocaine, opiates, PCP, amphetamines — THC positive falla',
        'California AB-2188 (2024): no puedes discriminar por off-duty marijuana metabolitos',
        'Federal-preempted (DOT, DOD, federal contractors) exempt de AB-2188',
        'Construction trades también exempt en la ley final',
        'Impairment testing (saliva) mejor que urine metabolitos post-AB-2188',
        'Policy escrita + firmada + MRO + TPA = defensible program'
      ],
      realTalk: '"AB-2188 cambió el juego. Antes, urine positive = despido. Ahora, si tu técnico no tiene CDL y el uso fue el fin de semana, tienes que probar impairment on the job o comerte el caso. Compra saliva swabs, documenta behavioral signs, y entrena a tus supervisors. La ley no te protege si documentas mal."',
      checklist: [
        'Identificar qué posiciones son DOT-covered (CDL, hazmat, etc)',
        'Written drug-free workplace policy firmada por cada empleado',
        'TPA (third-party administrator) para random selection',
        'MRO (Medical Review Officer) contratado para review de positivos',
        'Saliva swab testing para reasonable suspicion (detecta active impairment)',
        'Supervisor training en reasonable suspicion (60-min DOT module o Cal-OSHA equivalent)',
        'Consortium membership si tienes CDL drivers',
        'Chain of custody procedures documented',
        'Return-to-duty agreement template si aplica'
      ],
      commonMistakes: [
        'Firing CA empleado no-CDL por THC positive sin documentar impairment — AB-2188 lawsuit',
        'Usar urine test cuando saliva sería más defendible post-AB-2188',
        'No TPA — selective enforcement claim del empleado',
        'Ignorar DOT random rate (50%/year drugs) — FMCSA audit fails',
        'No MRO review — positive result inadmissible',
        'Asking about past marijuana use en application — AB-1288 violation',
        'Asumir que CDL rules aplican a van 15,000 lbs — no, CDL es 26,001+'
      ]
    },
    {
      id: 'e-verify-immigration',
      heading: 'E-Verify e I-9 — Immigration Compliance',
      body: `
        <p>Cada persona que cobras W-2 genera una obligación federal de verificar autorización para trabajar en USA. La base legal es <strong>Immigration Reform and Control Act of 1986 (IRCA)</strong>, codificado como <strong>8 USC §1324a</strong> ("unlawful employment of aliens"). El form obligatorio es el <strong>I-9 (Employment Eligibility Verification)</strong>, y el programa complementario voluntario (obligatorio en algunos estados/contratos) es <strong>E-Verify</strong>.</p>
        <p>Para HVAC contractors, esto es crítico por dos razones: (1) workforce latino con papeles variables; (2) ICE está activo en construction/trades audits — los inspectors saben que HVAC es industria target.</p>

        <h4>I-9 — el form base, obligatorio para TODOS</h4>
        <p>Cada empleado nuevo (incluyendo citizens nacidos aquí) debe completar I-9 dentro de <strong>3 business days</strong> de su start date:</p>
        <ul>
          <li><strong>Section 1:</strong> empleado completa — nombre, DOB, status (citizen, permanent resident, authorized alien, with expiration)</li>
          <li><strong>Section 2:</strong> employer completa dentro de 3 días — inspecciona documents de <strong>List A</strong> (establish identity + work authorization, ejemplo passport) O <strong>List B</strong> (identity, ejemplo driver's license) + <strong>List C</strong> (work authorization, ejemplo SSN card)</li>
          <li><strong>Section 3:</strong> re-verification si work authorization expira, or employee change nombre</li>
        </ul>
        <p><strong>Documents que NO puedes pedir:</strong> cualquier document específico — tienes que dejar que el empleado te muestre lo que quiera de las listas. Pedir "quiero tu Social Security card y driver's license" específicamente puede ser <strong>document abuse</strong> bajo 8 USC §1324b — multa de $230–$2,292 por violación.</p>

        <h4>Retention — la regla 3 & 1 (Section 1324a(b)(3))</h4>
        <p>Debes mantener I-9 por el <strong>mayor de</strong>:</p>
        <ul>
          <li><strong>3 años después de la fecha de hire</strong></li>
          <li><strong>1 año después de la fecha de termination</strong></li>
        </ul>
        <p>Ejemplo: contrataste a alguien el 1 de enero 2020, lo despediste el 1 de enero 2023. Retention = mayor de (2023 - 3yr hire retroactivo) y (2024 - 1yr post-term) = debes guardarlo hasta 2024. Empleado contratado y retenido 10 años: hire + 3 = año 3, retain until term+1. Lo mejor: archivalo por 5 años como práctica estándar.</p>
        <p><strong>Separate de otros records:</strong> I-9s NO deben estar en el personnel file regular — el inspector de DOL o ICE tiene derecho a los I-9s pero NO a tu personnel file. Keep it separate.</p>

        <h4>E-Verify — voluntario, pero recomendado</h4>
        <p><strong>E-Verify</strong> es el sistema online (gratuito) del DHS para verificar automáticamente que el SSN y document info del empleado matches government databases:</p>
        <ul>
          <li><strong>Gratis</strong> — no cuesta nada enrollarse o usarlo</li>
          <li><strong>Voluntario federal</strong>, pero <strong>mandatory</strong> en: Arizona, Alabama, Georgia, Mississippi, North Carolina, South Carolina, Tennessee, Utah, Florida (2023+); y para <strong>federal contractors</strong> bajo Executive Order 12989</li>
          <li><strong>California: NO mandatory en general</strong> — de hecho AB 450 (2017) prohibe mandatory E-Verify por política estatal, pero puedes usarlo voluntariamente</li>
          <li><strong>Federal contractors con contracts &gt;$150K:</strong> mandatory via FAR clause 52.222-54</li>
        </ul>
        <p>Beneficio práctico: E-Verify te da una "good faith" affirmative defense si ICE audit y encuentra un empleado no autorizado — probaste que verificaste.</p>

        <h4>Section 1324a — Unlawful Employment Penalties</h4>
        <p>Dos tipos de violaciones:</p>
        <p><strong>1. Paperwork violations (8 USC §1324a(e)(5)):</strong> errores en I-9 (missing signatures, dates, boxes no checked). Multas 2024 (ajustadas anualmente):</p>
        <ul>
          <li>$281 – $2,789 por form con error</li>
        </ul>
        <p><strong>2. Knowingly hire/continue employ unauthorized alien (8 USC §1324a(e)(4)):</strong></p>
        <ul>
          <li>1st offense: $698 – $5,579 per unauthorized alien</li>
          <li>2nd offense: $5,579 – $13,946</li>
          <li>3rd+: $8,369 – $27,894</li>
          <li>Pattern/practice: criminal liability — multa $3,000 per + <strong>6 meses prisión</strong> (employer/owner)</li>
        </ul>
        <p><strong>Document fraud (8 USC §1324c):</strong> usar fake documents o ayudar — $498 – $3,989 per document primer offense, más alto subsequent.</p>

        <h4>ICE Audit — Notice of Inspection (NOI)</h4>
        <p>ICE inicia audit via <strong>Notice of Inspection (NOI)</strong>. Los pasos:</p>
        <ol>
          <li>ICE entrega NOI (in person o by mail) dando <strong>3 business days</strong> para producir I-9s</li>
          <li>Puedes negociar extension pero ellos no están obligados</li>
          <li>Produces copies (no originales) de todos los I-9 + supporting docs + payroll records</li>
          <li>ICE revisa por 60–90 días típicamente</li>
          <li>Resultado posible: <strong>Notice of Suspect Documents</strong> (empleados cuyos docs no matchan), <strong>Notice of Discrepancy</strong>, o <strong>Warning Notice</strong> (errors menores)</li>
          <li>Puedes negociar settlement o contest en corte</li>
        </ol>
        <p><strong>Regla de oro:</strong> cuando NOI llega, llama abogado <strong>inmediatamente</strong>. El tiempo es crítico y errors en response pueden doblar multas.</p>

        <h4>H-2B Visa — temporary seasonal workers</h4>
        <p>Para trabajadores que necesitas temporalmente (más allá de tus empleados regulares), el <strong>H-2B visa</strong> permite non-agricultural temporary workers:</p>
        <ul>
          <li><strong>Cap anual:</strong> 66,000 a nivel nacional (33K first half, 33K second half del fiscal year)</li>
          <li><strong>Duration:</strong> hasta 1 año, extendible hasta 3 años total</li>
          <li><strong>Requirement:</strong> probar que necesidad es "temporary" (seasonal, peak load, one-time, intermittent)</li>
          <li><strong>Process:</strong> DOL labor certification (2 stages) → USCIS petition → consular processing</li>
          <li><strong>Cost:</strong> ~$3,000–$5,000 per worker en legal + filing fees + transportation. Employer paga.</li>
          <li><strong>Prevailing wage:</strong> debe pagar wages igual o mayor al DOL prevailing wage rate para la occupation/area</li>
        </ul>
        <p>Para HVAC específicamente: H-2B se ha usado en Arizona/Florida para summer peak demand. En California es menos común porque workforce local es grande. Pero para contractors en mountain resort areas (Tahoe, Mammoth), sí se usa.</p>

        <h4>Form I-9 Version — always current</h4>
        <p>USCIS actualiza el I-9 periódicamente. La versión <strong>efectiva actual (2023): edition August 1, 2023</strong>, con compliance window hasta October 31, 2023, y luego versión new-only. Siempre descarga de uscis.gov/i-9 — versiones viejas son violaciones técnicas.</p>

        <h4>AB 450 (California) — Protecting Workers from ICE</h4>
        <p>California AB 450 (2017) prohibe employers en California:</p>
        <ul>
          <li>Dar consentimiento a ICE para <strong>enter non-public areas</strong> sin judicial warrant</li>
          <li>Dar consentimiento a ICE para <strong>review records</strong> (no sea NOI judicialmente enforced)</li>
          <li>Failure to comply: multas de $2,000–$10,000 primer violación, hasta $10,000 subsequent</li>
        </ul>
        <p>Train a tu front desk / receptionist: si ICE appears, pedir warrant, llamar abogado, no firmar nada voluntariamente.</p>
      `,
      keyPoints: [
        'I-9 dentro de 3 business days de start date — TODOS los empleados',
        'Retention: mayor de 3 años post-hire O 1 año post-termination',
        'I-9s separados del personnel file regular',
        'E-Verify gratis, voluntario federal; CA AB 450 prohibe mandatory',
        'Paperwork violations: $281–$2,789 per form',
        'Hiring unauthorized: $698–$27,894 per alien, prison para pattern',
        'ICE NOI: 3 días response — llama abogado inmediatamente',
        'AB 450: no consent a ICE sin warrant, entrena recepción'
      ],
      realTalk: '"Conozco 2 contratistas que perdieron todo por I-9 audit. Uno tenía 40 empleados y 12 con papers fake que él no verificó bien. $180K en multas + el business cerrado. El otro usaba E-Verify y aunque tenía 3 no-match, la good faith defense le salvó. El form es 2 páginas y toma 10 minutos. No hay excusa para no hacerlo bien."',
      checklist: [
        'I-9 completado dentro de 3 business days — cada empleado',
        'Document inspection física (o authorized remote con E-Verify Plus)',
        'Archivo I-9 separate del personnel file',
        'Retention calendar: review annually para purge old I-9s correctly',
        'E-Verify enrolled (especialmente si federal contract)',
        'Re-verification tracker para temporary work authorization expirations',
        'ICE response protocol escrito + training para recepcionista (CA AB 450)',
        'Abogado de inmigración en speed dial',
        'Form I-9 version actual siempre (descargar uscis.gov cada 6 meses)'
      ],
      commonMistakes: [
        'I-9 incomplete — Section 2 sin signature o date',
        'Pedir documentos específicos (document abuse) — §1324b violation',
        'Archivar I-9 con personnel file — mezcla privacy issues',
        'No re-verify cuando Employment Authorization Document (EAD) expira',
        'Firmar consent para ICE sin warrant en California — AB 450 violation',
        'Usar versión vieja del I-9 — technical violation por form',
        'Throwing out I-9 de ex-empleado before retention expires',
        'H-2B sin DOL labor cert — petition denegada'
      ]
    }
  ],
  resources: [
    {
      title: 'EPA Section 608 Program — Stationary Refrigeration',
      url: 'https://www.epa.gov/section608',
      type: 'federal',
      description: 'EPA official page for Section 608 — certification, leak repair, recordkeeping, penalties'
    },
    {
      title: '40 CFR Part 82 — Protection of Stratospheric Ozone',
      url: 'https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-82',
      type: 'federal regulation',
      description: 'Full Code of Federal Regulations text for Parts 82 (Section 608 rules, Subpart F)'
    },
    {
      title: 'EPA Leak Repair Requirements Summary',
      url: 'https://www.epa.gov/section608/stationary-refrigeration-leak-repair-requirements',
      type: 'federal',
      description: 'EPA summary of 10%/20%/30% thresholds by equipment type'
    },
    {
      title: 'EPA 608 Technician Certification Exam Providers',
      url: 'https://www.epa.gov/section608/section-608-technician-certification-0',
      type: 'federal',
      description: 'List of approved 608 exam providers (ESCO Institute, RSES, MSC, etc.)'
    },
    {
      title: 'AIM Act of 2020 — EPA Implementation',
      url: 'https://www.epa.gov/climate-hfcs-reduction',
      type: 'federal',
      description: 'EPA hub for AIM Act implementation, HFC phasedown, Technology Transitions Rule'
    },
    {
      title: '40 CFR Part 84 — Refrigerant Management Rule',
      url: 'https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-84',
      type: 'federal regulation',
      description: 'New Part 84 extending 608-like requirements to AIM Act substances (A2Ls)'
    },
    {
      title: 'EPA SNAP — Significant New Alternatives Policy',
      url: 'https://www.epa.gov/snap',
      type: 'federal',
      description: 'SNAP list of acceptable/unacceptable refrigerants by end-use'
    },
    {
      title: 'EPA Section 609 MVAC Certification',
      url: 'https://www.epa.gov/mvac',
      type: 'federal',
      description: 'EPA Motor Vehicle AC certification info, approved training programs'
    },
    {
      title: 'NFPA 70 — National Electrical Code (NEC 2023)',
      url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70',
      type: 'code',
      description: 'Official NEC 2023 — Article 440 for HVAC electrical requirements'
    },
    {
      title: 'NEC Article 440 Overview (IAEI)',
      url: 'https://iaei.org/',
      type: 'training',
      description: 'International Association of Electrical Inspectors — guidance on Article 440'
    },
    {
      title: 'California Mechanical Code (CMC) — Title 24 Part 4',
      url: 'https://www.dgs.ca.gov/BSC/Codes',
      type: 'state code',
      description: 'California Building Standards Commission — access to Title 24 Parts including CMC'
    },
    {
      title: 'California Energy Code Title 24 Part 6',
      url: 'https://www.energy.ca.gov/programs-and-topics/programs/building-energy-efficiency-standards',
      type: 'state code',
      description: 'California Energy Commission — Title 24 duct sealing, HERS, efficiency requirements'
    },
    {
      title: 'CEC HERS Provider Directory',
      url: 'https://www.energy.ca.gov/programs-and-topics/programs/home-energy-rating-system-hers-program',
      type: 'state',
      description: 'Find HERS raters certified for Title 24 verification'
    },
    {
      title: 'DOT 49 CFR Part 40 — Drug and Alcohol Testing',
      url: 'https://www.transportation.gov/odapc/part40',
      type: 'federal regulation',
      description: 'DOT Office of Drug and Alcohol Policy — complete regulation text'
    },
    {
      title: 'FMCSA Drug and Alcohol Clearinghouse',
      url: 'https://clearinghouse.fmcsa.dot.gov/',
      type: 'federal',
      description: 'Mandatory database for CDL drug testing violations (required since 2020)'
    },
    {
      title: 'California AB-2188 (Off-Duty Marijuana)',
      url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220AB2188',
      type: 'state law',
      description: 'Full text of AB-2188 amending FEHA — effective Jan 1, 2024'
    },
    {
      title: 'California DFEH Guidance on Marijuana',
      url: 'https://calcivilrights.ca.gov/',
      type: 'state',
      description: 'California Civil Rights Department — employer guidance on AB-2188 compliance'
    },
    {
      title: 'USCIS Form I-9 Employment Eligibility Verification',
      url: 'https://www.uscis.gov/i-9',
      type: 'federal',
      description: 'Current Form I-9, instructions, handbook (M-274) — always download latest version'
    },
    {
      title: 'USCIS E-Verify Enrollment',
      url: 'https://www.e-verify.gov/',
      type: 'federal',
      description: 'Enroll in E-Verify (free), view tutorials, check status'
    },
    {
      title: '8 USC §1324a — Unlawful Employment of Aliens',
      url: 'https://www.law.cornell.edu/uscode/text/8/1324a',
      type: 'federal statute',
      description: 'Cornell LII — full statute text with current amendments'
    },
    {
      title: 'ICE I-9 Inspection Overview',
      url: 'https://www.ice.gov/factsheets/i9-inspection',
      type: 'federal',
      description: 'ICE factsheet explaining the I-9 audit process and employer obligations'
    },
    {
      title: 'DOL H-2B Visa Program',
      url: 'https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b',
      type: 'federal',
      description: 'Department of Labor H-2B temporary non-agricultural worker program'
    },
    {
      title: 'California AB 450 — Worker Protection from Immigration Enforcement',
      url: 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201720180AB450',
      type: 'state law',
      description: 'CA AB 450 — limits on employer cooperation with ICE without warrant'
    },
    {
      title: 'ASHRAE Standard 15 (Refrigeration Safety)',
      url: 'https://www.ashrae.org/technical-resources/standards-and-guidelines',
      type: 'standard',
      description: 'ASHRAE 15-2022 Safety Standard — A2L requirements for charge limits and detection'
    },
    {
      title: 'UL 60335-2-40 (Heat Pump / AC with Flammable Refrigerants)',
      url: 'https://www.ul.com/',
      type: 'standard',
      description: 'UL standard for equipment using A2L refrigerants — certification basis for new units'
    }
  ],
  glossary: [
    {
      term: '608 Certification',
      definition: 'EPA certification required under Section 608 of the Clean Air Act (40 CFR Part 82) for any technician who opens or services stationary refrigeration equipment with ODS or HFC refrigerants. Four types: I, II, III, Universal. Does not expire.'
    },
    {
      term: '609 Certification',
      definition: 'Separate EPA certification under Section 609 for Motor Vehicle Air Conditioning (MVAC) service on vehicles up to ~8,500 lbs GVWR. Distinct from 608 — separate exam and equipment.'
    },
    {
      term: 'A2L Refrigerant',
      definition: 'ASHRAE 34 classification for mildly flammable, low-toxicity refrigerants. Examples: R-32, R-454B, R-452B, R-1234yf. Replacements for R-410A under AIM Act phasedown.'
    },
    {
      term: 'AIM Act',
      definition: 'American Innovation and Manufacturing Act of 2020. Federal law authorizing EPA to phase down HFCs by 85% by 2036 via allocation system.'
    },
    {
      term: 'Allowance (HFC)',
      definition: 'Tradeable quota allocated by EPA to HFC producers and importers under AIM Act. Total cap declines annually on the phasedown schedule.'
    },
    {
      term: 'B-Vent',
      definition: 'Type B gas vent — double-wall metal vent pipe used for Category I (non-condensing, negative pressure) appliances like 80% AFUE furnaces. Cannot be used for Category IV condensing equipment.'
    },
    {
      term: 'Category IV Appliance',
      definition: 'Condensing gas appliance with positive vent pressure and flue gas below 275°F. Requires PVC, CPVC, or polypropylene vent with sealed joints. Modulating 95%+ furnaces are Category IV.'
    },
    {
      term: 'CDL (Commercial Driver License)',
      definition: 'License required for vehicles 26,001 lbs GVWR or more (Class A/B), or vehicles carrying hazmat or 16+ passengers (Class C). Triggers DOT drug testing requirements.'
    },
    {
      term: 'CFR (Code of Federal Regulations)',
      definition: 'Codification of federal regulations. Title 40 = EPA, Title 49 = Transportation, Title 29 = Labor. Cited as "40 CFR §82.156" etc.'
    },
    {
      term: 'CMC (California Mechanical Code)',
      definition: 'Title 24 Part 4 of California Code of Regulations. State mechanical code based on Uniform Mechanical Code (UMC) with California amendments.'
    },
    {
      term: 'Core Section',
      definition: 'Mandatory 25-question portion of EPA 608 exam covering ozone depletion, safety, recovery, recordkeeping. Required for all 608 certifications.'
    },
    {
      term: 'Disconnect Within Sight (NEC 440.14)',
      definition: 'Disconnecting means must be visible and not more than 50 ft from the HVAC equipment it controls. Most commonly violated NEC requirement in residential HVAC installs.'
    },
    {
      term: 'DOT 5-Panel',
      definition: 'Standard drug test under 49 CFR Part 40 testing for: marijuana (THC), cocaine, opiates, PCP, amphetamines. Required for CDL and other safety-sensitive positions.'
    },
    {
      term: 'E-Verify',
      definition: 'Free online DHS/USCIS system to verify employee work authorization against government databases. Voluntary federally; mandatory in some states; mandatory for federal contractors ≥$150K.'
    },
    {
      term: 'FLA (Full Load Amps)',
      definition: 'Nameplate amperage rating of a motor at rated load. Used in NEC 440.32 conductor sizing (125% of largest motor load).'
    },
    {
      term: 'GWP (Global Warming Potential)',
      definition: 'Measure of refrigerant climate impact relative to CO₂ (GWP=1). R-410A = 2088, R-32 = 675, R-454B = 466, R-1234yf = 4. AIM Act drives movement to low-GWP.'
    },
    {
      term: 'HACR Breaker',
      definition: 'Heating, Air-Conditioning, Refrigeration rated circuit breaker. Designed for motor-compressor inrush current without nuisance tripping. Required for HVAC branch circuits per NEC 440.22.'
    },
    {
      term: 'HERS Rater',
      definition: 'Home Energy Rating System certified third-party verifier. Required by California Title 24 to sign off on duct leakage, refrigerant charge, and other performance measurements.'
    },
    {
      term: 'I-9 Form',
      definition: 'USCIS Employment Eligibility Verification form. Required within 3 business days of hire for every W-2 employee. Retention: greater of 3 years post-hire OR 1 year post-termination.'
    },
    {
      term: 'Leak Rate Threshold',
      definition: 'EPA leak repair trigger under 40 CFR §82.157. Comfort cooling: 10%. Commercial refrigeration: 20%. Industrial process: 30%. Based on annualized leak rate of equipment ≥50 lbs charge.'
    },
    {
      term: 'MCA (Minimum Circuit Ampacity)',
      definition: 'Minimum conductor ampacity specified on HVAC nameplate. Per NEC 440.32 = 125% of largest motor load. Use MCA as source of truth for conductor sizing.'
    },
    {
      term: 'MOCP (Maximum Overcurrent Protection)',
      definition: 'Maximum fuse or HACR breaker size specified on HVAC nameplate. Typically 175%–225% of RLA. Cannot exceed MOCP, but can use smaller.'
    },
    {
      term: 'MRO (Medical Review Officer)',
      definition: 'Licensed physician required under DOT 49 CFR Part 40 to review positive drug test results, interview the employee, and confirm final results. Program is not compliant without MRO.'
    },
    {
      term: 'MVAC (Motor Vehicle Air Conditioning)',
      definition: 'AC systems in light-duty vehicles up to 8,500 lbs GVWR. Regulated separately from stationary refrigeration under EPA Section 609.'
    },
    {
      term: 'NEC Article 440',
      definition: 'National Electrical Code article covering Air-Conditioning and Refrigerating Equipment. Contains disconnect, conductor, overcurrent protection, and grounding rules specific to HVAC.'
    },
    {
      term: 'NOI (Notice of Inspection)',
      definition: 'ICE document initiating an I-9 audit. Gives employer 3 business days to produce I-9 records. Immediate legal counsel recommended.'
    },
    {
      term: 'Prop 64 (California)',
      definition: 'Adult Use of Marijuana Act (2016). Legalized recreational marijuana in California for adults 21+. Creates conflict with federal Schedule I status — AB-2188 addresses employer impact.'
    },
    {
      term: 'Recovery Machine',
      definition: 'EPA/UL certified equipment used to remove and capture refrigerant from HVAC systems. Must be rated for specific refrigerant class — A2L-rated machines have spark-free motors.'
    },
    {
      term: 'Reasonable Suspicion Testing',
      definition: 'Drug test conducted when trained supervisor observes specific objective signs (speech, demeanor, behavior) indicating impairment. Must be documented. DOT requires supervisor training.'
    },
    {
      term: 'Technology Transitions Rule',
      definition: 'EPA rule under AIM Act Section (i), finalized October 2023, prohibiting new HVAC equipment with GWP above specified limits in sectors like residential AC (GWP <700 from Jan 2025).'
    },
    {
      term: 'Title 24',
      definition: 'California Code of Regulations, Part of Title 24, governing building standards. Part 4 = CMC, Part 6 = Energy Code (duct sealing, HERS), Part 11 = CALGreen.'
    },
    {
      term: 'Type I/II/III 608 Certifications',
      definition: 'Type I = small appliances ≤5 lbs factory-sealed; Type II = high-pressure (most split systems, R-410A, R-22, R-32, R-454B); Type III = low-pressure chillers (R-11, R-123, R-1233zd).'
    },
    {
      term: 'Venting (Refrigerant)',
      definition: 'Intentional release of refrigerant to atmosphere. Prohibited by 40 CFR §82.154 for all regulated refrigerants including HFCs and A2Ls. Penalties up to $52,639/day/violation.'
    },
    {
      term: 'Working Space (NEC 110.26)',
      definition: 'Required clear space in front of electrical equipment: 30" wide, 36"–48" deep (depending on voltage), 78" high. Often violated by HVAC pads or storage in front of disconnect.'
    }
  ]
};
