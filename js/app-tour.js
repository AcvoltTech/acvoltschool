// Maestro HVACR — Tour guiado bilingüe con voz clonada de Maestro Mario
// Pasos bilingües organizados por capítulos. ES/EN. Audio cacheado en IndexedDB.
(function(){
  'use strict';

  var SB_URL = 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2xzb3dpeWp3c2puYWNudm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjIwMjQsImV4cCI6MjA4NjAzODAyNH0.6A3F7MI4YJEMo98b4Zfzao9p_hMh2T0ha0dRJ4SUhv0';
  var VOICE_URL = SB_URL + '/functions/v1/tutor-ia-voice';
  var DB_NAME = 'maestro_tour_audio_v2';
  var DB_STORE = 'steps';
  var PROGRESS_KEY = 'maestro_tour_step';
  var COMPLETED_KEY = 'maestro_tour_completed';
  var LANG_KEY = 'maestro_lang';

  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

  function getLang() {
    try {
      var l = localStorage.getItem(LANG_KEY);
      if (l === 'en' || l === 'es') return l;
      // First run — detect from phone/browser locale
      var nav = ((navigator.language || navigator.userLanguage || '') + '').toLowerCase();
      return nav.indexOf('en') === 0 ? 'en' : 'es';
    } catch(e) { return 'es'; }
  }
  function setLang(l) {
    try { localStorage.setItem(LANG_KEY, l === 'en' ? 'en' : 'es'); } catch(e) {}
  }

  // ── UI chrome (tour buttons, headers, etc.) ──
  var UI = {
    es: {
      back: '← Atrás', next: 'Siguiente →', finish: 'Terminar ✓',
      skip: 'Saltar', replay: '🔊 Repetir', close: 'Cerrar',
      endTour: '✕ Finalizar Tour',
      step: 'Paso', of: 'de', chapter: 'Capítulo',
      selectTitle: '🎙️ Tour de Maestro HVACR',
      selectSub: 'Escoge cómo quieres conocer tu app',
      completeTour: 'Tour Completo',
      completeSub: 'Todo, en orden — dura como 25 min',
      pickChapter: 'O salta directo a un tema:',
      langLabel: 'Idioma',
      cancelBtn: 'Cancelar',
      tourBtn: 'Tour',
      chLabelMin: 'min',
      chLabelSec: 'seg'
    },
    en: {
      back: '← Back', next: 'Next →', finish: 'Finish ✓',
      skip: 'Skip', replay: '🔊 Replay', close: 'Close',
      endTour: '✕ End Tour',
      step: 'Step', of: 'of', chapter: 'Chapter',
      selectTitle: '🎙️ Maestro HVACR Tour',
      selectSub: 'Pick how you want to learn your app',
      completeTour: 'Full Tour',
      completeSub: 'Everything, in order — about 25 min',
      pickChapter: 'Or jump to a topic:',
      langLabel: 'Language',
      cancelBtn: 'Cancel',
      tourBtn: 'Tour',
      chLabelMin: 'min',
      chLabelSec: 'sec'
    }
  };
  function T(key) { return UI[getLang()][key] || key; }

  // ═══════════════════════════════════════════════════════
  // CHAPTERS & STEPS
  // ═══════════════════════════════════════════════════════
  var CHAPTERS = [
    // ───── 1. BIENVENIDA ─────
    {
      id:'intro', emoji:'👋', mins:0.5,
      titleEs:'Bienvenida', titleEn:'Welcome',
      steps: [{
        id:'welcome', screen:'dashboardScreen', target:null,
        titleEs:'¡Bienvenido, Maestro!',
        titleEn:'Welcome, Maestro!',
        textEs:'Bienvenido a la aplicación más chaka de la industria. Todo lo que vas a ver aquí lo he creado pensando en ti — tus estudios, tus diagnósticos, la radio, el podcast, la bolsa de trabajo, el marketplace, y las clases V I P. Soy Maestro Mario, y te voy a dar un tour completo. Dura como veinticinco minutos si lo haces todo, o puedes saltar al tema que te interese. Échale ganas, Maestro.',
        textEn:'Welcome to the most badass app in the industry. Everything you see here I built with you in mind — your studies, your diagnostics, the radio, the podcast, the job board, the marketplace, and the V I P classes. I am Maestro Mario, and I am going to give you a full tour. It takes about twenty-five minutes if you do the whole thing, or you can jump straight to what interests you. Let us go, Maestro.'
      }]
    },
    // ───── 2. TU DASHBOARD ─────
    {
      id:'dashboard', emoji:'🏠', mins:1,
      titleEs:'Tu Dashboard', titleEn:'Your Dashboard',
      steps:[
        {
          id:'dash-overview', screen:'dashboardScreen', target:'.dashboard-cards, .cards-grid, #dashboardScreen .container',
          titleEs:'Tu Pantalla Principal',
          titleEn:'Your Main Screen',
          textEs:'Este es tu centro de control. Todo lo que haces en la app arranca aquí. Las tarjetas de colores son los accesos rápidos a tus herramientas y zonas. Haz scroll hacia abajo y ve todo lo que tienes. No te agobies, vamos a pasar por cada una.',
          textEn:'This is your control center. Everything you do in the app starts here. The colored cards are quick access to your tools and zones. Scroll down and see everything you have. Do not worry, we are going through each one.'
        },
        {
          id:'bottom-nav', screen:'dashboardScreen', target:'.mobile-bottom-nav',
          titleEs:'Barra de Navegación',
          titleEn:'Bottom Navigation',
          textEs:'Esta barra de abajo siempre te acompaña. Inicio te regresa al dashboard, Estudiar te manda a las preguntas de práctica, En Vivo a las clases V I P, Certs a tus certificaciones, y Facturas a tu C R M. Tap y ya estás.',
          textEn:'This bar at the bottom follows you everywhere. Home brings you back to the dashboard, Study takes you to practice questions, Live to the V I P classes, Certs to your certifications, and Invoices to your C R M. One tap and you are there.'
        }
      ]
    },
    // ───── 3. RUTINA DIARIA — PRE-DEPARTURE & FIELD CARDS ─────
    {
      id:'daily-routine', emoji:'✅', mins:3,
      titleEs:'Tu Rutina Diaria', titleEn:'Your Daily Routine',
      steps:[
        {
          id:'predep-daily', screen:'dashboardScreen', target:'.card[onclick="showScreen(\'preDepartureScreen\')"]',
          titleEs:'Antes de Salir — Checklist Diario',
          titleEn:'Before Leaving — Daily Checklist',
          textEs:'Este es tu primer paso cada mañana. Checklist diario PASS o FAIL antes de arrancar el camión. Revisas cuerpo, uniforme, I D, hidratación, actitud. Un tech profesional nunca sale del shop sin pasar esta lista. Un minuto de disciplina te ahorra un día completo perdido.',
          textEn:'This is your first step every morning. Daily PASS or FAIL checklist before you start the truck. You check body, uniform, I D, hydration, attitude. A professional tech never leaves the shop without running this list. One minute of discipline saves you a whole day lost.'
        },
        {
          id:'predep-tools', screen:'dashboardScreen', target:'.card[onclick*="_pdcToolsOnly"]',
          titleEs:'Herramientas — Inventario del Camión',
          titleEn:'Tools — Truck Inventory',
          textEs:'Tarjeta TOOLS. Aquí revisas tus herramientas de mano y eléctricas antes de arrancar. Multímetro, manómetro, vacuum, recovery, taladro, llaves. Si te falta una herramienta en el job, pierdes el job. Esta lista te asegura que sales completo.',
          textEn:'TOOLS card. Here you check your hand and power tools before starting. Multimeter, manifold, vacuum, recovery, drill, wrenches. If you are missing one tool on the job, you lose the job. This checklist guarantees you leave fully loaded.'
        },
        {
          id:'predep-stock', screen:'dashboardScreen', target:'.card[onclick*="_pdcStockMode"]',
          titleEs:'Stock Truck — Repuestos Residencial y Comercial',
          titleEn:'Stock Truck — Residential & Commercial Parts',
          textEs:'Tarjeta STOCK. Inventario de repuestos en tu camión — capacitors, contactors, fuses, filter driers, thermostats. Un camión bien stockeado cierra el job en una visita y cobra más. Un camión vacío te obliga a dos visitas y pierdes dinero en gas y tiempo.',
          textEn:'STOCK card. Inventory of parts in your truck — capacitors, contactors, fuses, filter driers, thermostats. A well-stocked truck closes the job in one visit and charges more. An empty truck forces you into two visits and you lose money on gas and time.'
        },
        {
          id:'predep-install', screen:'dashboardScreen', target:'.card[onclick*="_pdcInstallMode"]',
          titleEs:'Materiales de Instalación',
          titleEn:'Installation Materials',
          textEs:'Tarjeta INSTALL. Checklist de materiales para instalación residencial, comercial, y ductos. Line set, breakers, whip, disconnect, pad, soldadura, nitrógeno. Antes de salir a una instalación, pasas esta lista y no regresas al supply house a mitad del día.',
          textEn:'INSTALL card. Materials checklist for residential, commercial, and duct installs. Line set, breakers, whip, disconnect, pad, brazing rods, nitrogen. Before heading out to an install, you run this list and you are not driving back to the supply house at lunch.'
        },
        {
          id:'predep-onsite', screen:'dashboardScreen', target:'.card[onclick*="_pdcOnsiteMode"]',
          titleEs:'Antes de Iniciar — Llegada al Job',
          titleEn:'Before Starting — On-site Arrival',
          textEs:'Tarjeta ON-SITE. Llegaste al cliente, esta lista te guía. Saludo al cliente, cubre-zapatos, drop cloth, confirmación del problema, fotos antes. La llegada bien hecha vale más que cualquier diagnóstico. El cliente te juzga en los primeros treinta segundos.',
          textEn:'ON-SITE card. You arrived at the client, this list walks you through. Greeting the client, shoe covers, drop cloth, confirming the problem, before photos. A clean arrival is worth more than any diagnosis. The client judges you in the first thirty seconds.'
        },
        {
          id:'predep-pm', screen:'dashboardScreen', target:'.card[onclick*="_pdcPmMode"]',
          titleEs:'Preventive Maintenance — Residencial y Comercial',
          titleEn:'Preventive Maintenance — Residential & Commercial',
          textEs:'Tarjeta PM. Checklist completo de mantenimiento preventivo — limpieza de serpentines, amperaje del compresor, capacitor, superheat, subcooling, delta T, drene, filtro. Los contratos de P M son el pan de cada mes de un negocio HVAC sano. Esta lista te hace profesional.',
          textEn:'PM card. Complete preventive maintenance checklist — coil cleaning, compressor amps, capacitor, superheat, subcooling, delta T, drain, filter. P M contracts are the monthly bread of a healthy HVAC business. This list makes you look professional.'
        },
        {
          id:'ptchart-direct', screen:'dashboardScreen', target:'.card[onclick="_htDirectTool(\'ptchart\')"]',
          titleEs:'PT Chart — Acceso Rápido',
          titleEn:'PT Chart — Quick Access',
          textEs:'P T Chart de acceso directo. Dieciséis refrigerantes — cuatrocientos diez A, cuatrocientos cincuenta y cuatro B, treinta y dos, veintidós, cuatrocientos cuatro A, y todos los demás. Metes presión, te da temperatura. Metes temperatura, te da presión. Reemplaza esa tarjeta laminada que traes en el bolsillo.',
          textEn:'P T Chart direct access. Sixteen refrigerants — four ten A, four fifty-four B, thirty-two, twenty-two, four oh four A, and all the rest. Enter pressure, get temperature. Enter temperature, get pressure. Replaces the laminated card in your pocket.'
        },
        {
          id:'shsc-direct', screen:'dashboardScreen', target:'.card[onclick="_htDirectTool(\'shsc\')"]',
          titleEs:'Superheat / Subcooling — BLE en Vivo',
          titleEn:'Superheat / Subcooling — Live BLE',
          textEs:'Calculadora de superheat y subcooling con Bluetooth en vivo. Conectas tu J L tres R H, las presiones entran solas, metes las temperaturas, la app calcula S H y S C al instante. Te dice si el sistema está sobrecargado, bajo de carga, T X V pegado, o falta de flujo de aire. Esto define si el cliente paga trescientos o mil quinientos.',
          textEn:'Superheat and subcooling calculator with live Bluetooth. Connect your J L three R H, pressures come in automatically, enter temperatures, the app calculates S H and S C instantly. It tells you if the system is overcharged, undercharged, T X V stuck, or airflow is off. This defines if the client pays three hundred or fifteen hundred.'
        },
        {
          id:'duct-designer', screen:'dashboardScreen', target:'[onclick*="ductDesignerScreen"]',
          titleEs:'Duct Designer — Drag & Drop',
          titleEn:'Duct Designer — Drag & Drop',
          textEs:'Diseñador de ductos con pizarra interactiva. Arrastras el blower, pones supply y return runs, la app te calcula velocidad y C F M en tiempo real. Floor plan digital con drag and drop. Commercial duct design normalmente se paga mil dólares al ingeniero — aquí lo haces tú directo en el camión.',
          textEn:'Interactive duct design whiteboard. You drag the blower, lay out supply and return runs, the app calculates velocity and C F M in real time. Digital floor plan with drag and drop. Commercial duct design normally costs a thousand dollars from an engineer — here you do it yourself from the truck.'
        }
      ]
    },
    // ───── 4. HERRAMIENTAS HVAC ─────
    {
      id:'tools', emoji:'🔧', mins:7,
      titleEs:'Herramientas HVAC Avanzadas', titleEn:'Advanced HVAC Tools',
      steps:[
        {
          id:'tools-intro', screen:'dashboardScreen', target:'.card-herramientas',
          titleEs:'Quince Herramientas Profesionales',
          titleEn:'Fifteen Professional Tools',
          textEs:'Estas herramientas son el corazón de tu app y la razón principal por la que pagaste los cincuenta y nueve noventa y nueve. Cada una reemplaza una tabla, una calculadora, o un software que normalmente cuesta trescientos dólares al año por separado. Todas conectan por Bluetooth a tus Fieldpiece — no escribes números a mano. Y todas tienen inteligencia artificial. Vamos una por una.',
          textEn:'These tools are the heart of your app and the main reason you paid fifty-nine ninety-nine. Each one replaces a chart, a calculator, or software that normally costs three hundred dollars a year separately. All of them connect by Bluetooth to your Fieldpiece instruments — no typing numbers by hand. And they all have artificial intelligence. Let us go one by one.'
        },
        {
          id:'manual-j', screen:'dashboardScreen', target:'[onclick*="carga"]',
          titleEs:'HVAC Equipment Sizing — Manual J con IA',
          titleEn:'HVAC Equipment Sizing — Manual J with AI',
          textEs:'Manual J cuarto por cuarto con inteligencia artificial. Llegas a un job residencial, mides los cuartos, metes las ventanas, la orientación, el aislamiento, y la app te calcula exactamente cuántos B T U necesita cada cuarto y qué unidad le recomiendas al cliente. Lo que un ingeniero cobra quinientos dólares por hacer, aquí lo tienes en quince minutos y con PDF listo para el cliente.',
          textEn:'Room-by-room Manual J with artificial intelligence. You show up to a residential job, measure the rooms, enter windows, orientation, insulation, and the app calculates exactly how many B T U each room needs and what unit to recommend to the client. What an engineer charges five hundred dollars to do, here you have it in fifteen minutes with a PDF ready for the client.'
        },
        {
          id:'walkin', screen:'dashboardScreen', target:'[onclick*="walkin"]',
          titleEs:'Walk-in Cooler Sizing',
          titleEn:'Walk-in Cooler Sizing',
          textEs:'Para cuartos fríos y congeladores comerciales. Restaurantes, supermercados, carnicerías. Metes dimensiones, temperatura objetivo, producto, puertas, y te calcula la carga exacta, la condensadora y evaporadora que necesitas, y hasta el calibre del alambre. El refrigerante comercial se paga mucho mejor — esta herramienta sola te puede conseguir jobs de varios miles de dólares.',
          textEn:'For walk-in coolers and commercial freezers. Restaurants, supermarkets, butcher shops. You enter dimensions, target temperature, product, doors, and it calculates the exact load, the condenser and evaporator you need, and even the wire gauge. Commercial refrigeration pays much better — this tool alone can land you jobs worth thousands of dollars.'
        },
        {
          id:'elec-load', screen:'dashboardScreen', target:'[onclick*="elecload"]',
          titleEs:'Cálculo de Carga Eléctrica',
          titleEn:'Electrical Load Calculation',
          textEs:'Cálculo eléctrico residencial al código N E C. Metes lo que hay en la casa, los circuitos, el servicio, y te dice si el panel aguanta el nuevo equipo o necesitas upgrade de servicio. Si vendes aire acondicionado nuevo y el panel no aguanta, aquí lo ves antes de que te quede mal con el cliente.',
          textEn:'Residential electrical load calculation to N E C code. You enter what is in the house, circuits, service, and it tells you if the panel can handle the new equipment or needs a service upgrade. If you are selling a new A C and the panel cannot handle it, here you see it before the client blames you.'
        },
        {
          id:'parts-finder', screen:'dashboardScreen', target:'[data-nav="partsFinderScreen"]',
          titleEs:'Búsqueda de Partes',
          titleEn:'Parts Search',
          textEs:'Modelos, manuales, partes y especificaciones. Escribes el modelo del equipo del cliente, la app busca la partes originales, los manuales P D F, las specs técnicas. Nunca más te vas a atorar buscando un modelo viejo en Google perdiendo media hora.',
          textEn:'Models, manuals, parts and specs. Type the client equipment model, the app finds original parts, P D F manuals, technical specs. You are never again stuck searching for an old model on Google wasting half an hour.'
        },
        {
          id:'herramientas', screen:'dashboardScreen', target:'.card-herramientas',
          titleEs:'Herramientas HVAC Básicas',
          titleEn:'Basic HVAC Tools',
          textEs:'P T Chart de todos los refrigerantes, cálculo de superheat y subcooling, diagrama P-H, y pruebas eléctricas básicas. El P T Chart digital reemplaza esa tarjetita laminada que cargas en la bolsa. Todo conectado, todo en tu celular.',
          textEn:'P T Chart for all refrigerants, superheat and subcooling calculation, P-H diagram, and basic electrical tests. The digital P T Chart replaces that laminated card you carry in your pocket. All connected, all on your phone.'
        },
        {
          id:'manifold', screen:'dashboardScreen', target:'[data-nav="manifoldScreen"]',
          titleEs:'Diagnóstico HVACR con IA',
          titleEn:'HVACR Diagnostics with AI',
          textEs:'Este es tu diagnóstico. Llegas al job, el cliente te dice que el aire no enfría. Conectas tu manómetro J L 3 R H por Bluetooth, la app lee presiones automáticamente, calcula superheat y subcooling, y te dice: sistema sobrecargado saca media libra, o T X V pegado revisa el bulbo. Lo que te tomaba media hora con tabla y lápiz, aquí lo haces en dos minutos.',
          textEn:'This is your diagnostic. You arrive at the job, client says the A C is not cooling. You connect your J L 3 R H manifold by Bluetooth, the app reads pressures automatically, calculates superheat and subcooling, and tells you: system overcharged pull half a pound, or T X V stuck check the bulb. What took you half an hour with a chart and pencil, here you do in two minutes.'
        },
        {
          id:'multimeter', screen:'dashboardScreen', target:'[data-nav="multimeterScreen"]',
          titleEs:'SC680 Multímetro / Clamp Meter',
          titleEn:'SC680 Multimeter / Clamp Meter',
          textEs:'Conectas tu Fieldpiece S C seis ochenta por Bluetooth y la app te lee voltaje, amperaje, ohms y microfarads en tiempo real. Mides un capacitor, un motor, un contactor, y los valores se guardan en el reporte del cliente. La IA te dice si el capacitor está dentro de especificaciones o hay que reemplazarlo.',
          textEn:'Connect your Fieldpiece S C six eighty by Bluetooth and the app reads voltage, amperage, ohms and microfarads in real time. Measure a capacitor, a motor, a contactor, and the values save to the client report. The AI tells you if the capacitor is within spec or needs replacement.'
        },
        {
          id:'gas-heat', screen:'dashboardScreen', target:'[data-nav="manometerHvacScreen"]',
          titleEs:'Gas Heat Diagnostics',
          titleEn:'Gas Heat Diagnostics',
          textEs:'Diagnóstico de calefacción a gas. Conectas el S D M N seis, mides presión de gas manifold, presión de inductor, static pressure de ductos. La app te calcula si el furnace está quemando limpio, si hay restricción en el venting, si la gas valve está fallando. En invierno esta herramienta sola te llena la agenda.',
          textEn:'Gas heating diagnostics. Connect the S D M N six, measure manifold gas pressure, inducer pressure, duct static pressure. The app calculates if the furnace is burning clean, if there is venting restriction, if the gas valve is failing. In winter this tool alone fills your schedule.'
        },
        {
          id:'heat', screen:'dashboardScreen', target:'[data-nav="heatingScreen"]',
          titleEs:'Commercial Heat Diagnostics',
          titleEn:'Commercial Heat Diagnostics',
          textEs:'Heat pumps, V R F, water heaters, boilers comerciales. Metes las lecturas, la app te calcula C O P, eficiencia real versus rated, y te diagnostica si hay problema de refrigerante, de defrost, de sensor. V R F y heat pump comercial son el futuro — si dominas esto con la app, vas a cobrar triple.',
          textEn:'Heat pumps, V R F, water heaters, commercial boilers. Enter the readings, the app calculates C O P, real efficiency versus rated, and diagnoses refrigerant issues, defrost, or sensor problems. V R F and commercial heat pumps are the future — if you master this with the app, you will charge triple.'
        },
        {
          id:'tab', screen:'dashboardScreen', target:'[data-nav="anemometerHvacScreen"]',
          titleEs:'TAB Testing — Air Balancing',
          titleEn:'TAB Testing — Air Balancing',
          textEs:'Testing, Adjusting, and Balancing. Conectas el anemómetro Fieldpiece, haces la traverse en el ducto, y la app te calcula el C F M real de cada registro, compara con el diseño, y te dice dónde cerrar dampers. Commercial T A B se cobra dos mil, cinco mil dólares por job. Con esto entras a ese mundo.',
          textEn:'Testing, Adjusting, and Balancing. Connect the Fieldpiece anemometer, run the duct traverse, and the app calculates real C F M at each register, compares to design, and tells you where to close dampers. Commercial T A B jobs pay two thousand, five thousand dollars. With this you get into that world.'
        },
        {
          id:'chiller', screen:'dashboardScreen', target:'[data-nav="commercialHvacScreen"]',
          titleEs:'Chiller & Cooling Tower',
          titleEn:'Chiller & Cooling Tower',
          textEs:'Chillers, cooling towers, air handlers, calidad de aire interior, ventilación. Jobs de hospitales, oficinas grandes, plantas industriales. Metes delta T, approach, range, y la app te diagnostica si hay fouling en tubes, si los sensores están bien, si la torre necesita tratamiento de agua. Este sector no tiene casi competencia en español — entra fuerte.',
          textEn:'Chillers, cooling towers, air handlers, indoor air quality, ventilation. Jobs at hospitals, big offices, industrial plants. Enter delta T, approach, range, and the app diagnoses tube fouling, sensor issues, if the tower needs water treatment. This sector has almost no Spanish-speaking competition — go in strong.'
        }
      ]
    },
    // ───── 4. FIELDPIECE BLE ─────
    {
      id:'ble', emoji:'📡', mins:0.75,
      titleEs:'Tus Fieldpiece por Bluetooth', titleEn:'Your Fieldpiece via Bluetooth',
      steps:[{
        id:'ble-intro', screen:'dashboardScreen', target:null,
        titleEs:'Conecta tus Instrumentos',
        titleEn:'Connect Your Instruments',
        textEs:'Todas las herramientas de la app leen tus Fieldpiece por Bluetooth. Multímetro S C seis ochenta, manómetro J L tres R H, anemómetro A N, manómetro de gas S D M N seis, probador de combustión F P cuarenta y dos cincuenta y ocho. Prendes el instrumento, la app lo detecta automáticamente, y los valores se llenan solos. Cero teclear, cero errores.',
        textEn:'All the app tools read your Fieldpiece via Bluetooth. S C six eighty multimeter, J L three R H manifold, A N anemometer, S D M N six gas manometer, F P forty-two fifty-eight combustion analyzer. Turn the instrument on, the app detects it automatically, values fill in by themselves. Zero typing, zero errors.'
      }]
    },
    // ───── 5. ESTUDIO Y CERTIFICACIONES ─────
    {
      id:'study', emoji:'🎓', mins:3,
      titleEs:'Estudio y Certificaciones', titleEn:'Study & Certifications',
      steps:[
        {
          id:'study-sections', screen:'dashboardScreen', target:'.card-classes',
          titleEs:'Desarrollo de Habilidades',
          titleEn:'Skill Development',
          textEs:'Aquí tienes las secciones de estudio por tema. No son solo preguntas — son explicaciones con dibujos, videos cortos, y ejercicios. Si eres nuevo, aquí es donde empiezas para construir tu base. Si eres tech con experiencia, úsalo para repasar antes de un examen o antes de un job raro.',
          textEn:'Here you have study sections by topic. Not just questions — explanations with diagrams, short videos, and exercises. If you are new, this is where you start to build your foundation. If you are an experienced tech, use it to review before an exam or before a tricky job.'
        },
        {
          id:'cert-epa', screen:'certOficialesScreen', target:null,
          titleEs:'EPA 608 Universal',
          titleEn:'EPA 608 Universal',
          textEs:'E P A seiscientos ocho es obligatorio por ley federal para comprar refrigerante. Aquí tienes las cuatro secciones — core, type one, type two, type three — con más de setecientas preguntas de práctica. Pasa el examen con ochenta por ciento y te damos el certificado digital con código Q R verificable. Este solo te ahorra cuatrocientos dólares del curso comercial.',
          textEn:'E P A six oh eight is federally required to buy refrigerant. Here you have the four sections — core, type one, type two, type three — with over seven hundred practice questions. Pass the exam with eighty percent and we give you the digital certificate with a verifiable Q R code. This alone saves you four hundred dollars from the commercial course.'
        },
        {
          id:'cert-osha', screen:'certOficialesScreen', target:null,
          titleEs:'OSHA 30 — Seguridad en el Trabajo',
          titleEn:'OSHA 30 — Workplace Safety',
          textEs:'O S H A treinta horas. Muchos contractors comerciales te piden O S H A treinta antes de mandarte a un job. Aquí tienes el curso completo con quizzes, examen final, y certificado. Si tienes O S H A treinta, tu salario sube inmediatamente entre cinco y ocho dólares por hora. Esa es la realidad.',
          textEn:'O S H A thirty hour. Many commercial contractors require O S H A thirty before sending you to a job. Here you have the full course with quizzes, final exam, and certificate. If you have O S H A thirty, your wage immediately goes up five to eight dollars an hour. That is the reality.'
        },
        {
          id:'cert-nate', screen:'certOficialesScreen', target:null,
          titleEs:'NATE — El Certificado Premium',
          titleEn:'NATE — The Premium Certification',
          textEs:'N A T E es la certificación más respetada de HVAC en Estados Unidos. Tener N A T E te pone en otro nivel — compañías grandes te buscan, contractors te pagan más, clientes confían más en ti. Aquí tienes core, senior, air conditioning, heat pump, gas heating, air distribution. No es fácil — pero si estudias con esta app, pasas.',
          textEn:'N A T E is the most respected HVAC certification in the United States. Having N A T E puts you at another level — big companies seek you out, contractors pay more, clients trust you more. Here you have core, senior, air conditioning, heat pump, gas heating, air distribution. It is not easy — but if you study with this app, you pass.'
        }
      ]
    },
    // ───── 6. VIDEOS ─────
    {
      id:'videos', emoji:'🎥', mins:2,
      titleEs:'Videos y Clases', titleEn:'Videos & Classes',
      steps:[
        {
          id:'acvolt-school', screen:'dashboardScreen', target:'.card-acvolt-cert',
          titleEs:'Videos Maestro HVACR — ACVOLT School',
          titleEn:'Maestro HVACR Videos — ACVOLT School',
          textEs:'Cursos completos de ACVOLT Tech School. Cada curso tiene lecciones en video, quizzes por lección, examen final, y certificado cuando apruebas. Aprende a tu ritmo, desde tu celular, mientras estás en el campo o en tu casa. Todo en español claro, sin rollos, directo al grano.',
          textEn:'Complete courses from ACVOLT Tech School. Each course has video lessons, quiz per lesson, final exam, and certificate when you pass. Learn at your own pace, from your phone, in the field or at home. All in clear Spanish — no fluff, straight to the point.'
        },
        {
          id:'video-tutoriales', screen:'dashboardScreen', target:'.card-tutorials',
          titleEs:'Videos Instruccionales',
          titleEn:'Instructional Videos',
          textEs:'Videos técnicos cortos enfocados en habilidades específicas. Cómo cargar refrigerante, cómo brazing de tubería, cómo leer un gráfico de combustión, cómo diagnosticar un compresor con clamp meter. Videos de tres a diez minutos, vas directo a lo que necesitas saber.',
          textEn:'Short technical videos focused on specific skills. How to charge refrigerant, how to braze tubing, how to read a combustion chart, how to diagnose a compressor with a clamp meter. Videos three to ten minutes each — you go straight to what you need to know.'
        },
        {
          id:'video-certs', screen:'dashboardScreen', target:null,
          titleEs:'Certificados Verificables',
          titleEn:'Verifiable Certificates',
          textEs:'Cada vez que pasas un curso o un examen, te generamos un certificado digital con un ID único. Cualquier empleador o contractor puede verificar el certificado en maestrohvacr.com/verify para confirmar que es real, cuándo lo obtuviste, y tu nombre. Los compartes en LinkedIn, los imprimes, los mandas al email del cliente.',
          textEn:'Every time you pass a course or exam, we generate a digital certificate with a unique Q R code. Any employer or contractor can scan that Q R and verify the certificate is real, when you got it, and your name. Share them on LinkedIn, print them, email them to clients.'
        }
      ]
    },
    // ───── 7. CLASES VIP EN VIVO ─────
    {
      id:'vip', emoji:'🔴', mins:1.5,
      titleEs:'Clases VIP en Vivo', titleEn:'VIP Live Classes',
      steps:[
        {
          id:'live-classes', screen:'dashboardScreen', target:'[data-nav="liveStreamingScreen"]',
          titleEs:'Clases Exclusivas Conmigo',
          titleEn:'Exclusive Classes With Me',
          textEs:'Cuando yo hago una clase en vivo, tú recibes la notificación al instante en tu celular. Son clases V I P, exclusivas para los que tienen la app. Ahí respondo preguntas en vivo, reviso casos reales que ustedes mandan, y enseño técnicas que no salen en libros. Es como tenerme en tu bolsa — no te las pierdas.',
          textEn:'When I do a live class, you get the notification instantly on your phone. These are V I P classes, exclusive to app owners. I answer live questions, review real cases that you send, and teach techniques that are not in books. It is like having me in your pocket — do not miss them.'
        },
        {
          id:'live-recordings', screen:'dashboardScreen', target:'[data-nav="liveStreamingScreen"]',
          titleEs:'Grabaciones de Clases Pasadas',
          titleEn:'Recordings of Past Classes',
          textEs:'Si te pierdes una clase en vivo porque estabas en un job, no hay bronca. Todas se graban y las tienes aquí para verlas cuando quieras. Puedes pausar, regresar, tomar notas. Las clases V I P están siempre disponibles para ti mientras tengas la app.',
          textEn:'If you miss a live class because you were on a job, no problem. They are all recorded and here for you to watch whenever you want. You can pause, rewind, take notes. V I P classes are always available to you while you have the app.'
        }
      ]
    },
    // ───── 8. MAESTRO FACTURAS CRM ─────
    {
      id:'crm', emoji:'💰', mins:2.5,
      titleEs:'Maestro Facturas CRM', titleEn:'Maestro Invoices CRM',
      steps:[
        {
          id:'crm-intro', screen:'dashboardScreen', target:'[onclick*="maestroInvoicesScreen"]',
          titleEs:'Tu Negocio Entero en un Solo Lugar',
          titleEn:'Your Whole Business in One Place',
          textEs:'Maestro Facturas es tu C R M completo de HVAC. Lo que Jobber o Housecall Pro te cobran cincuenta dólares al mes, aquí está incluido. Clientes, jobs, estimados, facturas, cobros, reportes. Si eres independiente o tienes tu propia compañía chica, esto es lo que hace que te la rifes de verdad.',
          textEn:'Maestro Invoices is your full HVAC C R M. What Jobber or Housecall Pro charge fifty dollars a month for, here is included. Clients, jobs, estimates, invoices, payments, reports. If you are a solo tech or run your own small company, this is what lets you really level up.'
        },
        {
          id:'crm-clients', screen:'maestroInvoicesScreen', target:null,
          titleEs:'Clientes y Historial',
          titleEn:'Clients & History',
          textEs:'Cada cliente tiene su tarjeta con todo su historial — cuántas veces lo has visitado, qué equipo tiene, cuánto te pagó, cuánto debe. Cuando vuelves a su casa, abres su tarjeta y ya sabes toda la historia. Nunca más vas a llegar a un cliente sin saber qué le hiciste la última vez.',
          textEn:'Each client has a card with their full history — how many times you visited, what equipment they have, how much they paid you, what they owe. When you go back to their house, you open their card and know the whole story. You will never again show up to a client without knowing what you did last time.'
        },
        {
          id:'crm-signature', screen:'maestroInvoicesScreen', target:null,
          titleEs:'Facturas con Firma Digital',
          titleEn:'Invoices with Digital Signature',
          textEs:'Terminas el job, aquí mismo haces la factura — metes partes, labor, impuestos. El cliente firma con el dedo en tu pantalla. La app manda automáticamente la factura firmada por email o WhatsApp, y guarda copia. Legal, profesional, y rápido. Un tech haciendo diez jobs a la semana se paga la app en el primer día.',
          textEn:'You finish the job, right here you build the invoice — enter parts, labor, tax. Client signs with their finger on your screen. The app automatically sends the signed invoice by email or WhatsApp, and saves a copy. Legal, professional, fast. A tech doing ten jobs a week pays for the app on day one.'
        }
      ]
    },
    // ───── 9. NETWORKING ─────
    {
      id:'network', emoji:'👥', mins:2,
      titleEs:'Networking con Técnicos', titleEn:'Tech Networking',
      steps:[
        {
          id:'tech-chat', screen:'dashboardScreen', target:null,
          titleEs:'Chat con Técnicos',
          titleEn:'Chat with Techs',
          textEs:'Conéctate con otros técnicos HVAC de toda la industria. Pregunta dudas, comparte fotos de jobs difíciles, manda audios. La industria HVAC se mueve por conexiones — el técnico que no pregunta se queda atrás. Aquí tienes la comunidad lista para ayudarte.',
          textEn:'Connect with other HVAC techs across the industry. Ask questions, share pictures of tough jobs, send voice notes. The HVAC industry runs on connections — the tech who does not ask falls behind. Here you have the community ready to help.'
        },
        {
          id:'friends', screen:'dashboardScreen', target:null,
          titleEs:'Amigos y Comunidad',
          titleEn:'Friends & Community',
          textEs:'Agrega a otros Maestros como amigos. Ve lo que publican, comenta, manda mensajes directos. Los mejores jobs llegan por recomendación de otro técnico. Los mejores empleos también. Construye tu red desde aquí.',
          textEn:'Add other Maestros as friends. See what they post, comment, send direct messages. The best jobs come from another tech referring you. The best employment does too. Build your network from here.'
        },
        {
          id:'voice-chat', screen:'dashboardScreen', target:null,
          titleEs:'Mensajes de Voz',
          titleEn:'Voice Messages',
          textEs:'Puedes mandar mensajes de voz dentro del chat. A veces explicar un problema técnico es más fácil hablando que escribiendo. Grabas, mandas, y el otro tech escucha cuando puede. Así como te mando yo audios, tú los mandas a tus amigos de la industria.',
          textEn:'You can send voice messages inside chat. Sometimes explaining a technical issue is easier talking than typing. Record, send, and the other tech listens when they can. Same way I send you audio, you send it to your friends in the industry.'
        }
      ]
    },
    // ───── 10. MARKETPLACE + BOLSA DE TRABAJO ─────
    {
      id:'market', emoji:'🛒', mins:1.5,
      titleEs:'Marketplace y Bolsa de Trabajo', titleEn:'Marketplace & Job Board',
      steps:[
        {
          id:'marketplace', screen:'dashboardScreen', target:null,
          titleEs:'Marketplace P2P — Técnicos Verificados',
          titleEn:'P2P Marketplace — Verified Techs',
          textEs:'Compra y vende herramientas HVAC con otros técnicos verificados. Recuperation machines, manifolds, vacuum pumps, multimetros usados en buen estado. Todos los vendedores están verificados por nosotros. Local, sin engaños, sin Craigslist sketchy. Si tienes herramienta que ya no usas, sácale dinero.',
          textEn:'Buy and sell HVAC tools with other verified techs. Recovery machines, manifolds, vacuum pumps, good-condition used multimeters. All sellers verified by us. Local, no scams, none of that sketchy Craigslist stuff. If you have tools you do not use, turn them into cash.'
        },
        {
          id:'job-board', screen:'dashboardScreen', target:null,
          titleEs:'Bolsa de Trabajo HVAC',
          titleEn:'HVAC Job Board',
          textEs:'Empleos HVAC publicados por compañías de verdad que buscan técnicos. Filtra por tu ciudad, por tipo de trabajo, por experiencia requerida. Si estás buscando cambiar de compañía o buscar tu primer job, aquí está lo disponible cerca de ti. Aplica directo desde la app.',
          textEn:'HVAC jobs posted by real companies looking for techs. Filter by your city, job type, experience required. If you are looking to change companies or find your first job, here is what is available near you. Apply directly from the app.'
        }
      ]
    },
    // ───── 11. RADIO + PODCAST ─────
    {
      id:'radio', emoji:'🎙️', mins:0.75,
      titleEs:'Radio y Podcast 24/7', titleEn:'Radio & Podcast 24/7',
      steps:[{
        id:'radio-podcast', screen:'dashboardScreen', target:'[data-nav="radioPodcastScreen"]',
        titleEs:'Tu Estación HVAC en Español',
        titleEn:'Your Spanish-language HVAC Station',
        textEs:'Radio y podcast de HVAC veinticuatro horas siete días. Nivel Treinta y Tres Podcast, entrevistas con técnicos y contractors exitosos, tips técnicos, consejos de liderazgo y ventas. Conecta tus audífonos mientras trabajas en el campo y sigue aprendiendo. El tech que escucha, crece.',
        textEn:'HVAC radio and podcast twenty-four seven. Nivel Treinta y Tres Podcast, interviews with successful techs and contractors, technical tips, leadership and sales advice. Plug in your headphones while working in the field and keep learning. The tech who listens, grows.'
      }]
    },
    // ───── 12. MAESTRO MARIO AI ─────
    {
      id:'ai', emoji:'🤖', mins:1,
      titleEs:'Maestro Mario AI', titleEn:'Maestro Mario AI',
      steps:[{
        id:'maestro-ai', screen:'dashboardScreen', target:null,
        titleEs:'Yo, Contigo 24/7',
        titleEn:'Me, With You 24/7',
        textEs:'Este soy yo, Maestro Mario pero como inteligencia artificial. Puedes preguntarme cualquier cosa técnica — diagnóstico, teoría, código, seguridad — y te respondo con mi voz, la misma que estás escuchando ahora. Estoy disponible veinticuatro horas, siete días, en inglés y español. No importa qué hora sea ni dónde estés, aquí estoy contigo en cada job difícil.',
        textEn:'This is me, Maestro Mario but as artificial intelligence. You can ask me any technical question — diagnostics, theory, code, safety — and I answer with my voice, the same one you are hearing now. I am available twenty-four hours, seven days, in English and Spanish. No matter what time or where you are, I am with you on every tough job.'
      }]
    },
    // ───── 13. DESAFÍO + TOP 10 ─────
    {
      id:'challenge', emoji:'🏆', mins:0.75,
      titleEs:'Desafío y Ranking', titleEn:'Challenge & Ranking',
      steps:[{
        id:'desafio', screen:'dashboardScreen', target:null,
        titleEs:'Compite y Crece',
        titleEn:'Compete and Grow',
        textEs:'Modo desafío — preguntas técnicas con cronómetro, niveles, y puntos. Cada día que entras a la app y contestas preguntas, subes en el Top Diez de Racha. Los mejores del mes reciben reconocimiento público y algunas veces premios. Si eres competitivo, esto te va a enganchar.',
        textEn:'Challenge mode — technical questions with timer, levels, and points. Every day you log in and answer questions, you climb the Top Ten Streak. The best of the month get public recognition and sometimes prizes. If you are competitive, this will hook you.'
      }]
    },
    // ───── 14. CIERRE ─────
    {
      id:'closing', emoji:'✓', mins:0.5,
      titleEs:'Cierre', titleEn:'Closing',
      steps:[{
        id:'closing', screen:'dashboardScreen', target:null,
        titleEs:'Ya Conoces tu App, Maestro',
        titleEn:'You Know Your App Now, Maestro',
        textEs:'Eso fue todo, Maestro. Ya sabes dónde están tus herramientas, tus videos, tu C R M, las clases V I P, el marketplace, la bolsa de trabajo, y cómo contactarme. Puedes volver a correr este tour cuando quieras desde el botón flotante en el dashboard. Ahora, explora, úsala, y chíngale. Nos vemos en la siguiente clase V I P.',
        textEn:'That is everything, Maestro. You know where your tools are, your videos, your C R M, the V I P classes, marketplace, job board, and how to reach me. You can run this tour again anytime from the floating button on the dashboard. Now, explore, use it, and get to work. See you at the next V I P class.'
      }]
    }
  ];

  // Flatten STEPS
  var STEPS = [];
  CHAPTERS.forEach(function(ch, ci){
    ch.steps.forEach(function(s, si){
      s.chapterId = ch.id;
      s.chapterIdx = ci;
      s.stepInChapter = si;
      STEPS.push(s);
    });
  });

  // ── IndexedDB audio cache ──
  function openDB() {
    return new Promise(function(resolve, reject){
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function(e){
        var db = e.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
      };
      req.onsuccess = function(e){ resolve(e.target.result); };
      req.onerror = function(e){ reject(e.target.error); };
    });
  }
  function cacheGet(key){
    return openDB().then(function(db){
      return new Promise(function(resolve){
        try {
          var tx = db.transaction(DB_STORE,'readonly');
          var req = tx.objectStore(DB_STORE).get(key);
          req.onsuccess = function(){ resolve(req.result || null); };
          req.onerror = function(){ resolve(null); };
        } catch(e){ resolve(null); }
      });
    }).catch(function(){ return null; });
  }
  function cachePut(key, blob){
    return openDB().then(function(db){
      return new Promise(function(resolve){
        try {
          var tx = db.transaction(DB_STORE,'readwrite');
          tx.objectStore(DB_STORE).put(blob, key);
          tx.oncomplete = function(){ resolve(); };
          tx.onerror = function(){ resolve(); };
        } catch(e){ resolve(); }
      });
    }).catch(function(){});
  }

  function fetchStepAudio(stepId, text, lang){
    var key = 'v2_' + stepId + '_' + lang;
    return cacheGet(key).then(function(cached){
      if (cached && cached.size > 100) return cached;
      return fetch(VOICE_URL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+SB_KEY, 'apikey':SB_KEY },
        body: JSON.stringify({ text: text.substring(0,2000), lang: lang })
      }).then(function(r){
        if (!r.ok) throw new Error('voice-fail');
        return r.blob();
      }).then(function(blob){
        if (blob.size < 100 || blob.type.indexOf('json') >= 0) throw new Error('voice-invalid');
        cachePut(key, blob);
        return blob;
      });
    });
  }

  // ── DOM state ──
  var _audio = null;
  var _stepIdx = 0;
  var _active = false;
  var _resizeHandler = null;

  function buildOverlay(){
    if (document.getElementById('tourOverlay')) return;
    var html = ''
      + '<div id="tourOverlay" style="display:none;position:fixed;inset:0;z-index:99998;pointer-events:auto;">'
      +   '<svg id="tourMask" width="100%" height="100%" style="position:absolute;inset:0;" aria-hidden="true">'
      +     '<defs><mask id="tourHoleMask"><rect width="100%" height="100%" fill="white"/><rect id="tourHole" x="0" y="0" width="0" height="0" rx="16" ry="16" fill="black"/></mask></defs>'
      +     '<rect width="100%" height="100%" fill="rgba(5,8,15,0.85)" mask="url(#tourHoleMask)"/>'
      +   '</svg>'
      +   '<div id="tourHoleRing" style="position:absolute;border:3px solid #E8591C;border-radius:18px;box-shadow:0 0 40px rgba(232,89,28,0.6),inset 0 0 12px rgba(232,89,28,0.3);pointer-events:none;transition:all 350ms cubic-bezier(0.32,0.72,0,1);opacity:0;"></div>'
      +   '<button id="tourEndBtn" onclick="window.endAppTour(true)" style="position:fixed;top:max(16px,env(safe-area-inset-top));right:14px;z-index:99999;background:transparent;border:1px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.9);padding:11px 18px;border-radius:24px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,0.4);letter-spacing:0.3px;-webkit-tap-highlight-color:transparent;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),background 200ms cubic-bezier(0.32,0.72,0,1);" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'"></button>'
      +   '<div id="tourTip" style="display:none;position:absolute;max-width:380px;width:calc(100vw - 32px);background:linear-gradient(145deg,#141824,#0f1420);border:1px solid rgba(232,89,28,0.45);border-radius:20px;padding:18px 18px 14px;box-shadow:0 20px 60px rgba(0,0,0,0.65);color:#fff;animation:appTourTipIn 320ms cubic-bezier(0.34,1.56,0.64,1);">'
      +     '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">'
      +       '<div id="tourMarioAvatar" style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E8591C,#c0410e);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 0 16px rgba(232,89,28,0.5);transition:transform 200ms cubic-bezier(0.32,0.72,0,1), box-shadow 200ms cubic-bezier(0.32,0.72,0,1);">🎙️</div>'
      +       '<div style="flex:1;min-width:0;">'
      +         '<div id="tourMeta" style="font-size:11px;color:#E8591C;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;"></div>'
      +         '<h3 id="tourTitle" style="margin:0;font-size:16px;font-weight:900;color:rgba(255,255,255,0.95);letter-spacing:-0.3px;line-height:1.25;"></h3>'
      +       '</div>'
      +       '<button id="tourLangBtn" onclick="window._tourToggleLang()" title="Idioma / Language" style="background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.95);padding:7px 10px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:700;flex-shrink:0;transition:transform 90ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'"></button>'
      +       '<button onclick="window.endAppTour(true)" aria-label="' + _t('tour_close_aria', 'Cerrar tour') + '" style="background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.95);width:32px;height:32px;border-radius:10px;cursor:pointer;font-size:18px;flex-shrink:0;transition:transform 90ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'">×</button>'
      +     '</div>'
      +     '<p id="tourText" style="color:rgba(255,255,255,0.92);font-size:15px;line-height:1.6;margin:0 0 12px;max-height:40vh;overflow-y:auto;font-weight:500;-webkit-font-smoothing:antialiased;"></p>'
      +     '<div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;margin-bottom:12px;">'
      +       '<div id="tourProgress" style="height:100%;background:linear-gradient(90deg,#E8591C,#c0410e);width:0%;transition:width 400ms cubic-bezier(0.32,0.72,0,1);"></div>'
      +     '</div>'
      +     '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">'
      +       '<button id="tourBack" onclick="window._tourPrev()" style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.9);padding:9px 12px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;transition:transform 90ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'"></button>'
      +       '<button id="tourReplay" onclick="window._tourReplay()" style="background:rgba(232,89,28,0.15);border:1px solid rgba(232,89,28,0.35);color:#E8591C;padding:9px 10px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;transition:transform 90ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'"></button>'
      +       '<div style="flex:1;"></div>'
      +       '<button id="tourSkip" onclick="window.endAppTour(true)" style="background:transparent;border:none;color:rgba(255,255,255,0.85);padding:9px 6px;font-size:12px;font-weight:700;cursor:pointer;transition:transform 90ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'"></button>'
      +       '<button id="tourNext" onclick="window._tourNext()" style="background:#E8591C;border:none;color:#fff;padding:10px 16px;border-radius:10px;font-size:12.5px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(232,89,28,0.4);transition:transform 90ms cubic-bezier(0.32,0.72,0,1),box-shadow 200ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'"></button>'
      +     '</div>'
      +   '</div>'
      + '</div>';
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstChild);
    // Inject entry-animation keyframes (once)
    if (!document.getElementById('appTourMotionStyles')) {
      var s = document.createElement('style');
      s.id = 'appTourMotionStyles';
      s.textContent = '@keyframes appTourTipIn{0%{opacity:0;transform:scale(0.92) translateY(8px);}100%{opacity:1;transform:scale(1) translateY(0);}}';
      document.head.appendChild(s);
    }
  }

  function buildSelector(){
    if (document.getElementById('tourSelector')) return;
    var div = document.createElement('div');
    div.id = 'tourSelector';
    div.style.cssText = 'display:none;position:fixed;inset:0;z-index:99997;background:rgba(5,10,20,0.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);overflow-y:auto;padding:20px;';
    document.body.appendChild(div);
  }

  function renderSelector(){
    var host = document.getElementById('tourSelector');
    if (!host) return;
    var lang = getLang();
    var chapterList = CHAPTERS.map(function(ch, idx){
      var title = lang==='en' ? ch.titleEn : ch.titleEs;
      var durLabel;
      if (ch.mins < 1) durLabel = Math.round(ch.mins * 60) + ' ' + T('chLabelSec');
      else durLabel = ch.mins + ' ' + T('chLabelMin');
      var stepCount = ch.steps.length;
      return ''
        + '<button onclick="window._tourStartChapter(' + idx + ')" style="display:flex;align-items:center;gap:12px;width:100%;padding:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:#fff;cursor:pointer;text-align:left;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),background 200ms cubic-bezier(0.32,0.72,0,1);margin-bottom:8px;-webkit-tap-highlight-color:transparent;" onmouseover="this.style.background=\'rgba(232,89,28,0.14)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.06)\'" onmousedown="this.style.transform=\'scale(0.98)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\';this.style.background=\'rgba(255,255,255,0.06)\'" ontouchstart="this.style.transform=\'scale(0.98)\'" ontouchend="this.style.transform=\'scale(1)\'">'
        +   '<div style="font-size:24px;flex-shrink:0;width:40px;height:40px;border-radius:10px;background:rgba(232,89,28,0.18);display:flex;align-items:center;justify-content:center;">' + ch.emoji + '</div>'
        +   '<div style="flex:1;min-width:0;">'
        +     '<div style="font-size:14px;font-weight:800;color:rgba(255,255,255,0.95);margin-bottom:2px;">' + title + '</div>'
        +     '<div style="font-size:11px;color:rgba(255,255,255,0.7);font-weight:600;">' + stepCount + (lang==='en'?' step'+(stepCount>1?'s':''):' paso'+(stepCount>1?'s':'')) + ' · ⏱ ' + durLabel + '</div>'
        +   '</div>'
        +   '<div style="color:#E8591C;font-size:20px;flex-shrink:0;">›</div>'
        + '</button>';
    }).join('');

    host.innerHTML = ''
      + '<div style="max-width:480px;margin:20px auto;background:linear-gradient(145deg,#141824,#0f1420);border:1px solid rgba(232,89,28,0.35);border-radius:24px;padding:24px 20px;box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:appTourTipIn 320ms cubic-bezier(0.34,1.56,0.64,1);">'
      +   '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;">'
      +     '<div style="flex:1;">'
      +       '<h2 style="margin:0 0 4px;color:#E8591C;font-size:20px;font-weight:900;letter-spacing:-0.3px;">' + T('selectTitle') + '</h2>'
      +       '<p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;">' + T('selectSub') + '</p>'
      +     '</div>'
      +     '<button onclick="window._tourCloseSelector()" style="background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.95);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:20px;transition:transform 90ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'">×</button>'
      +   '</div>'
      +   '<div style="display:flex;gap:8px;margin-bottom:18px;background:rgba(255,255,255,0.05);padding:4px;border-radius:12px;">'
      +     '<button onclick="window._tourSetLang(\'es\')" style="flex:1;padding:10px;background:' + (lang==='es'?'#E8591C':'transparent') + ';border:none;color:' + (lang==='es'?'#fff':'rgba(255,255,255,0.85)') + ';border-radius:9px;cursor:pointer;font-size:13px;font-weight:700;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),background 200ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'">🇪🇸 Español</button>'
      +     '<button onclick="window._tourSetLang(\'en\')" style="flex:1;padding:10px;background:' + (lang==='en'?'#E8591C':'transparent') + ';border:none;color:' + (lang==='en'?'#fff':'rgba(255,255,255,0.85)') + ';border-radius:9px;cursor:pointer;font-size:13px;font-weight:700;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),background 200ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'">🇺🇸 English</button>'
      +   '</div>'
      +   '<button onclick="window._tourStartChapter(-1)" style="display:flex;align-items:center;gap:12px;width:100%;padding:16px;background:#E8591C;border:none;border-radius:14px;color:#fff;cursor:pointer;text-align:left;margin-bottom:16px;box-shadow:0 6px 20px rgba(232,89,28,0.4);transition:transform 90ms cubic-bezier(0.32,0.72,0,1),box-shadow 200ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.98)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.98)\'" ontouchend="this.style.transform=\'scale(1)\'">'
      +     '<div style="font-size:28px;flex-shrink:0;">🎙️</div>'
      +     '<div style="flex:1;">'
      +       '<div style="font-size:15px;font-weight:900;color:#fff;">' + T('completeTour') + '</div>'
      +       '<div style="font-size:11px;color:rgba(255,255,255,0.9);margin-top:2px;font-weight:600;">' + T('completeSub') + '</div>'
      +     '</div>'
      +     '<div style="color:#fff;font-size:22px;flex-shrink:0;">▶</div>'
      +   '</button>'
      +   '<p style="color:rgba(255,255,255,0.7);font-size:11px;margin:0 0 10px;text-align:center;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">' + T('pickChapter') + '</p>'
      +   '<div>' + chapterList + '</div>'
      + '</div>';
  }

  function setAvatarSpeaking(on){
    var av = document.getElementById('tourMarioAvatar');
    if (!av) return;
    av.style.transform = on ? 'scale(1.12)' : 'scale(1)';
    av.style.boxShadow = on ? '0 0 32px rgba(243,156,18,0.95),0 0 60px rgba(243,156,18,0.4)' : '0 0 16px rgba(243,156,18,0.5)';
  }

  function positionSpotlight(target){
    var hole = document.getElementById('tourHole');
    var ring = document.getElementById('tourHoleRing');
    var tip = document.getElementById('tourTip');
    if (!hole || !ring || !tip) return;
    if (!target) {
      hole.setAttribute('width','0'); hole.setAttribute('height','0');
      ring.style.opacity = '0';
      tip.style.top = '50%'; tip.style.left = '50%';
      tip.style.transform = 'translate(-50%, -50%)';
      return;
    }
    var rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      hole.setAttribute('width','0'); hole.setAttribute('height','0');
      ring.style.opacity = '0';
      tip.style.top = '50%'; tip.style.left = '50%';
      tip.style.transform = 'translate(-50%, -50%)';
      return;
    }
    var pad = 8;
    var x = rect.left - pad, y = rect.top - pad;
    var w = rect.width + pad*2, h = rect.height + pad*2;
    hole.setAttribute('x', x); hole.setAttribute('y', y);
    hole.setAttribute('width', w); hole.setAttribute('height', h);
    ring.style.opacity = '1';
    ring.style.left = x + 'px'; ring.style.top = y + 'px';
    ring.style.width = w + 'px'; ring.style.height = h + 'px';
    var vh = window.innerHeight;
    var tipH = 320;
    var tipW = Math.min(380, window.innerWidth - 32);
    var spaceBelow = vh - (y + h);
    var tipTop;
    if (spaceBelow > tipH + 20) tipTop = y + h + 16;
    else tipTop = Math.max(16, y - tipH - 16);
    var tipLeft = Math.max(16, Math.min(window.innerWidth - tipW - 16, x + w/2 - tipW/2));
    tip.style.transform = 'none';
    tip.style.top = tipTop + 'px';
    tip.style.left = tipLeft + 'px';
  }

  function scrollIntoViewIfNeeded(target){
    if (!target) return Promise.resolve();
    var rect = target.getBoundingClientRect();
    var vh = window.innerHeight;
    if (rect.top < 80 || rect.bottom > vh - 80) {
      target.scrollIntoView({ behavior:'smooth', block:'center' });
      return new Promise(function(res){ setTimeout(res, 500); });
    }
    return Promise.resolve();
  }

  function stopAudio(){
    if (_audio) {
      try { _audio.pause(); _audio.removeAttribute('src'); _audio.load(); } catch(e){}
    }
    setAvatarSpeaking(false);
  }

  function prefetchNext(curIdx){
    var next = STEPS[curIdx + 1];
    if (!next) return;
    var lang = getLang();
    var txt = lang === 'en' ? next.textEn : next.textEs;
    try { fetchStepAudio(next.id, txt, lang).catch(function(){}); } catch(e){}
  }

  function playStep(stepIdx){
    var step = STEPS[stepIdx];
    if (!step) return;
    var lang = getLang();
    var text = lang === 'en' ? step.textEn : step.textEs;
    // Reuse primed _audio element (keeps iOS user-gesture unlock)
    if (_audio) { try { _audio.pause(); _audio.removeAttribute('src'); _audio.load(); } catch(e){} }
    else { _audio = new Audio(); }
    var myAudio = _audio;
    fetchStepAudio(step.id, text, lang).then(function(blob){
      if (!_active || myAudio !== _audio) return;
      var url = URL.createObjectURL(blob);
      myAudio.src = url;
      myAudio.onended = function(){
        setAvatarSpeaking(false);
        try{URL.revokeObjectURL(url);}catch(e){}
        // Auto-advance when audio finishes
        if (_active && _stepIdx === stepIdx && _stepIdx < STEPS.length - 1) {
          setTimeout(function(){
            if (_active && _stepIdx === stepIdx) window._tourNext();
          }, 700);
        }
      };
      myAudio.onerror = function(){ setAvatarSpeaking(false); try{URL.revokeObjectURL(url);}catch(e){} };
      setAvatarSpeaking(true);
      var p = myAudio.play();
      if (p && p.catch) p.catch(function(err){
        console.log('[tour] play blocked:', err && err.message);
        setAvatarSpeaking(false);
      });
      // Prefetch next step's audio so it's instant
      prefetchNext(stepIdx);
    }).catch(function(e){
      console.log('[tour] voice unavailable:', e && e.message);
      setAvatarSpeaking(false);
      // Still auto-advance so tour completes even if voice fails
      if (_active && _stepIdx === stepIdx && _stepIdx < STEPS.length - 1) {
        setTimeout(function(){
          if (_active && _stepIdx === stepIdx) window._tourNext();
        }, 6000);
      }
    });
  }

  function renderStep(idx){
    var step = STEPS[idx];
    if (!step) { window.endAppTour(true); return; }
    _stepIdx = idx;
    try { localStorage.setItem(PROGRESS_KEY, String(idx)); } catch(e){}

    // Navigate to target screen if needed
    if (step.screen && typeof showScreen === 'function') {
      var curScreen = document.querySelector('.screen[style*="flex"], .screen.active');
      if (!curScreen || curScreen.id !== step.screen) {
        try { showScreen(step.screen); } catch(e){}
      }
    }

    var lang = getLang();
    var titleEl = document.getElementById('tourTitle');
    var textEl = document.getElementById('tourText');
    var metaEl = document.getElementById('tourMeta');
    var progEl = document.getElementById('tourProgress');
    var backEl = document.getElementById('tourBack');
    var nextEl = document.getElementById('tourNext');
    var skipEl = document.getElementById('tourSkip');
    var replayEl = document.getElementById('tourReplay');
    var langEl = document.getElementById('tourLangBtn');

    if (titleEl) titleEl.textContent = lang==='en' ? step.titleEn : step.titleEs;
    if (textEl) {
      var rawText = lang==='en' ? step.textEn : step.textEs;
      // Collapse voice-spaced acronyms for display: "E P A" → "EPA", "O S H A" → "OSHA",
      // "V I P", "C R M", "B T U", "Q R", etc. Voice still reads the spaced version.
      var displayText = rawText.replace(/\b[A-Z](?:\s[A-Z])+\b/g, function(m){ return m.replace(/\s/g, ''); });
      textEl.textContent = displayText;
    }
    var chTitle = lang==='en' ? CHAPTERS[step.chapterIdx].titleEn : CHAPTERS[step.chapterIdx].titleEs;
    if (metaEl) metaEl.textContent = CHAPTERS[step.chapterIdx].emoji + '  ' + chTitle + '  ·  ' + T('step') + ' ' + (idx+1) + ' ' + T('of') + ' ' + STEPS.length;
    if (progEl) progEl.style.width = ((idx+1)/STEPS.length*100) + '%';
    if (backEl) { backEl.textContent = T('back'); backEl.style.visibility = idx===0 ? 'hidden':'visible'; }
    if (nextEl) nextEl.textContent = (idx === STEPS.length - 1) ? T('finish') : T('next');
    if (skipEl) skipEl.textContent = T('skip');
    if (replayEl) replayEl.textContent = T('replay');
    if (langEl) langEl.textContent = lang==='en' ? '🇺🇸 EN' : '🇪🇸 ES';
    var endBtn = document.getElementById('tourEndBtn');
    if (endBtn) endBtn.textContent = T('endTour');

    setTimeout(function(){
      var target = step.target ? document.querySelector(step.target) : null;
      scrollIntoViewIfNeeded(target).then(function(){
        positionSpotlight(target);
        playStep(idx);
      });
    }, step.screen ? 350 : 50);
  }

  // ── Public API ──
  window.startAppTour = function(opts){
    opts = opts || {};
    if (_active) return;
    buildOverlay();
    buildSelector();
    if (opts.chapterIdx != null && opts.chapterIdx >= 0) {
      _beginTour(CHAPTERS[opts.chapterIdx] ? STEPS.indexOf(CHAPTERS[opts.chapterIdx].steps[0]) : 0);
    } else if (opts.resume) {
      var saved = parseInt(localStorage.getItem(PROGRESS_KEY) || '0', 10);
      _beginTour(!isNaN(saved) && saved>=0 && saved<STEPS.length ? saved : 0);
    } else {
      // Show chapter selector
      renderSelector();
      var sel = document.getElementById('tourSelector');
      if (sel) sel.style.display = 'block';
    }
  };

  // 0.4s of silent WAV — primes the <audio> element on iOS so later
  // play() calls after async fetch still work (user-gesture unlock).
  var SILENT_WAV = 'data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

  function _beginTour(startIdx){
    _active = true;
    var sel = document.getElementById('tourSelector');
    if (sel) sel.style.display = 'none';
    var ov = document.getElementById('tourOverlay');
    if (ov) ov.style.display = 'block';
    // Unlock audio on iOS WKWebView while we're still inside the user gesture
    if (!_audio) {
      try {
        _audio = new Audio();
        _audio.preload = 'auto';
        _audio.playsInline = true;
        _audio.src = SILENT_WAV;
        var p = _audio.play();
        if (p && p.catch) p.catch(function(){});
      } catch(e) {}
    }
    _resizeHandler = function(){
      var step = STEPS[_stepIdx];
      var t = step && step.target ? document.querySelector(step.target) : null;
      positionSpotlight(t);
    };
    window.addEventListener('resize', _resizeHandler);
    window.addEventListener('scroll', _resizeHandler, true);
    renderStep(startIdx);
  }

  window._tourStartChapter = function(chapterIdx){
    if (chapterIdx < 0) { _beginTour(0); return; }
    var ch = CHAPTERS[chapterIdx];
    if (!ch) return;
    var firstStep = ch.steps[0];
    var idx = STEPS.indexOf(firstStep);
    if (idx >= 0) _beginTour(idx);
  };

  window._tourCloseSelector = function(){
    var sel = document.getElementById('tourSelector');
    if (sel) sel.style.display = 'none';
  };

  window._tourSetLang = function(l){
    setLang(l);
    renderSelector();
  };

  window._tourToggleLang = function(){
    var cur = getLang();
    setLang(cur === 'en' ? 'es' : 'en');
    renderStep(_stepIdx);
  };

  window.endAppTour = function(markDone){
    _active = false;
    stopAudio();
    _audio = null;
    var ov = document.getElementById('tourOverlay');
    if (ov) ov.style.display = 'none';
    var sel = document.getElementById('tourSelector');
    if (sel) sel.style.display = 'none';
    if (markDone) { try { localStorage.setItem(COMPLETED_KEY, '1'); } catch(e){} }
    if (_resizeHandler) {
      window.removeEventListener('resize', _resizeHandler);
      window.removeEventListener('scroll', _resizeHandler, true);
      _resizeHandler = null;
    }
  };

  window._tourNext = function(){
    if (_stepIdx >= STEPS.length - 1) { window.endAppTour(true); return; }
    renderStep(_stepIdx + 1);
  };
  window._tourPrev = function(){
    if (_stepIdx <= 0) return;
    renderStep(_stepIdx - 1);
  };
  window._tourReplay = function(){ playStep(_stepIdx); };
  window.resetAppTour = function(){
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(COMPLETED_KEY);
    } catch(e){}
  };

  // ── Floating "🎙️ Tour" button — attached to <body> so it shows everywhere ──
  function mountFloatingButton(){
    if (document.getElementById('floatingTourBtn')) return;
    if (!document.body) { setTimeout(mountFloatingButton, 300); return; }
    var btn = document.createElement('button');
    btn.id = 'floatingTourBtn';
    btn.type = 'button';
    btn.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      // Always open the selector so the user picks language + chapter first.
      window.startAppTour();
    };
    btn.style.cssText = 'position:fixed;left:14px;bottom:88px;z-index:99990;background:#E8591C;border:none;color:#fff;padding:12px 16px;border-radius:28px;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 8px 24px rgba(232,89,28,0.5),0 2px 6px rgba(0,0,0,0.25);display:flex;align-items:center;gap:6px;letter-spacing:0.3px;-webkit-tap-highlight-color:transparent;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),box-shadow 200ms cubic-bezier(0.32,0.72,0,1);';
    btn.addEventListener('mousedown', function(){ btn.style.transform = 'scale(0.95)'; });
    btn.addEventListener('mouseup', function(){ btn.style.transform = 'scale(1)'; });
    btn.addEventListener('mouseleave', function(){ btn.style.transform = 'scale(1)'; });
    btn.addEventListener('touchstart', function(){ btn.style.transform = 'scale(0.95)'; }, {passive:true});
    btn.addEventListener('touchend', function(){ btn.style.transform = 'scale(1)'; }, {passive:true});
    btn.innerHTML = '🎙️ <span id="floatingTourLabel">' + T('tourBtn') + '</span>';
    document.body.appendChild(btn);
  }
  // Only show Tour FAB on the dashboard. On tool screens it overlaps
  // the "Diagnóstico IA" CTA at the bottom.
  function updateTourBtnVisibility(){
    var btn = document.getElementById('floatingTourBtn');
    if (!btn) return;
    var dash = document.getElementById('dashboardScreen');
    var onDash = dash && dash.classList.contains('active') && dash.offsetParent !== null;
    btn.style.display = onDash ? 'flex' : 'none';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFloatingButton);
  } else {
    mountFloatingButton();
  }
  // Re-mount if something else in the app removes it (some screens
  // clean up DOM on navigation). Keeps the button persistent.
  setInterval(function(){
    if (!document.getElementById('floatingTourBtn')) mountFloatingButton();
    updateTourBtnVisibility();
  }, 600);
  window.addEventListener('hashchange', updateTourBtnVisibility);
  document.addEventListener('click', function(){ setTimeout(updateTourBtnVisibility, 50); }, true);
})();
