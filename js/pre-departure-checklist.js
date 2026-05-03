// ============================================
// PRE-DEPARTURE CHECKLIST — "Antes de Salir a Trabajar"
// Daily PASS/FAIL checklist for HVAC technicians
// Saves to Supabase, shows history, driver vs passenger mode
// ============================================

(function() {
  'use strict';

  // i18n helper for centralized dictionary keys (key, fallback) — coexists with local _t(obj)
  var _ti = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

  var CHECKLIST_SECTIONS = [
    {
      id: 'checkin',
      title: { es: '📍 Check In', en: '📍 Check In' },
      items: [
        { id: 'checkin_time', es: 'Hacer Check In (hora de llegada)', en: 'Check In (arrival time)' }
      ]
    },
    {
      id: 'vehiculo',
      title: { es: '🚐 Vehículo', en: '🚐 Vehicle' },
      driverOnly: true,
      items: [
        { id: 'fluidos', es: 'Revisar fluidos del vehículo', en: 'Check vehicle fluids' },
        { id: 'gasolina', es: 'Revisar nivel de gasolina', en: 'Check fuel level' },
        { id: 'seguro_reg', es: 'Revisar aseguranzas y registraciones', en: 'Check insurance & registration' },
        { id: 'espejos', es: 'Revisar espejos', en: 'Check mirrors' },
        { id: 'llantas', es: 'Revisar llantas', en: 'Check tires' },
        { id: 'placas', es: 'Revisar placas', en: 'Check license plates' },
        { id: 'luces', es: 'Luces funcionando (headlights, brake, signals)', en: 'Lights working (headlights, brake, signals)' },
        { id: 'escalera', es: 'Escalera asegurada', en: 'Ladder secured' }
      ]
    },
    {
      id: 'ppe',
      title: { es: '🦺 PPE (Equipo de Protección Personal)', en: '🦺 PPE (Personal Protective Equipment)' },
      items: [
        { id: 'casco', es: 'Casco / Hard Hat', en: 'Hard Hat' },
        { id: 'lentes', es: 'Lentes de seguridad Anti-Fog', en: 'Anti-Fog Safety Glasses' },
        { id: 'guantes', es: 'Guantes de trabajo', en: 'Work Gloves' },
        { id: 'botas', es: 'Botas de seguridad / Steel Toe', en: 'Steel Toe Boots' },
        { id: 'auditiva', es: 'Protección auditiva / Ear Protection', en: 'Ear Protection' },
        { id: 'chaleco', es: 'Chaleco reflectante / Hi-Vis Vest', en: 'Hi-Vis Vest' },
        { id: 'respirador', es: 'Mascarilla / Respirador', en: 'Mask / Respirator' },
        { id: 'rodilleras', es: 'Rodilleras / Knee Pads', en: 'Knee Pads' }
      ]
    },
    {
      id: 'personal',
      title: { es: '👤 Personal', en: '👤 Personal' },
      items: [
        { id: 'limpieza', es: 'Limpieza del técnico', en: 'Technician cleanliness' },
        { id: 'licencia', es: 'Licencia de conducir vigente', en: 'Valid driver\'s license' },
        { id: 'epa608', es: 'Tarjeta EPA 608 / Certificaciones', en: 'EPA 608 Card / Certifications' },
        { id: 'celular', es: 'Celular cargado', en: 'Phone charged' },
        { id: 'bluetooth', es: 'Manos libres / Bluetooth listo', en: 'Hands-free / Bluetooth ready' },
        { id: 'protector_solar', es: 'Protector solar', en: 'Sunscreen' }
      ]
    },
    {
      id: 'comida',
      title: { es: '🍱 Comida / Hidratación', en: '🍱 Food / Hydration' },
      items: [
        { id: 'lonche', es: 'Lonche / Comida', en: 'Lunch / Food' },
        { id: 'bebidas', es: 'Bebidas', en: 'Drinks' },
        { id: 'hielera', es: 'Hielera con hielo', en: 'Cooler with ice' }
      ]
    },
    {
      id: 'seguridad',
      title: { es: '🛡️ Seguridad', en: '🛡️ Safety' },
      items: [
        { id: 'botiquin', es: 'Botiquín de primeros auxilios', en: 'First aid kit' },
        { id: 'extintor', es: 'Extintor de incendios', en: 'Fire extinguisher' },
        { id: 'conos', es: 'Conos / Señalización de seguridad', en: 'Cones / Safety signage' }
      ]
    },
    {
      id: 'orden',
      title: { es: '📋 Orden de Servicio', en: '📋 Work Order' },
      items: [
        { id: 'tipo_llamada', es: 'Revisar tipo de llamada (Residencial / Comercial / Instalación)', en: 'Review call type (Residential / Commercial / Install)' },
        { id: 'cliente_casa', es: '¿El cliente está en casa? Confirmar', en: 'Is the customer home? Confirm' },
        { id: 'llamar_cliente', es: 'Llamar al cliente antes de salir', en: 'Call customer before leaving' },
        { id: 'mascotas', es: '¿Tiene perros / mascotas? Precaución', en: 'Dogs / pets? Caution' },
        { id: 'electricidad', es: '¿Hay electricidad en la propiedad?', en: 'Is there electricity at the property?' },
        { id: 'banos', es: '¿Hay baños disponibles?', en: 'Are restrooms available?' },
        { id: 'ciudad_ruta', es: 'Identificar la ciudad con anticipación (ruta / GPS)', en: 'Identify city in advance (route / GPS)' },
        { id: 'permisos', es: '¿El proyecto ocupa permisos?', en: 'Does the project require permits?' },
        { id: 'llevo_permiso', es: '¿Llevo el permiso conmigo?', en: 'Do I have the permit with me?' },
        { id: 'tipo_visita', es: '¿Es call back / warranty / primera visita?', en: 'Is it callback / warranty / first visit?' },
        { id: 'clima', es: 'Revisar clima / pronóstico del día', en: 'Check weather forecast' }
      ]
    },
    // ══════════════════════════════════════════════════════
    // ANTES DE INICIAR — Al llegar al sitio (Residencial)
    // ══════════════════════════════════════════════════════
    {
      id: 'onsite_arrival',
      title: { es: '🏠 Llegada al Sitio (Residencial)', en: '🏠 Arrival at Job Site (Residential)' },
      items: [
        { id: 'on_gated', es: 'Verificar si es gated community — ¿necesito código de acceso?', en: 'Check if gated community — do I need an access code?' },
        { id: 'on_no_driveway', es: 'NO estacionarse en el driveway del cliente', en: 'Do NOT park in the customer\'s driveway' },
        { id: 'on_watch_dogs', es: 'Cuidado con perros / mascotas al llegar', en: 'Watch for dogs / pets on arrival' },
        { id: 'on_watch_conduit', es: 'Watch for conduit — cuidado con conducto y cables existentes', en: 'Watch for conduit — be careful with existing conduit & wiring' },
        { id: 'on_shoe_covers', es: 'Ponerse shoe covers antes de entrar a la casa', en: 'Put on shoe covers before entering the home' },
        { id: 'on_floor_blankets', es: 'Colocar mantas / protectores en el piso', en: 'Lay down floor protection blankets' },
        { id: 'on_shop_vac', es: 'Shop Vacuum listo para uso inmediato', en: 'Shop Vacuum ready for immediate use' },
        { id: 'on_door_closed', es: 'NO dejar la puerta abierta (AC / calefacción / insectos)', en: 'Do NOT leave the door open (AC / heat / bugs)' },
        { id: 'on_no_lawn', es: 'NO caminar sobre el césped / jardín del cliente', en: 'Do NOT walk on the customer\'s lawn / yard' }
      ]
    },
    {
      id: 'onsite_conduct',
      title: { es: '🤝 Conducta Profesional', en: '🤝 Professional Conduct' },
      items: [
        { id: 'on_no_smoke', es: 'NO fumar ni tirar colillas en la propiedad', en: 'Do NOT smoke or leave cigarette butts on property' },
        { id: 'on_no_bathroom', es: 'NO usar el baño del cliente (salvo emergencia)', en: 'Do NOT use the customer\'s bathroom (unless emergency)' },
        { id: 'on_housekeeping', es: 'Housekeeping — mantener limpio DURANTE todo el trabajo', en: 'Housekeeping — keep clean DURING the entire job' },
        { id: 'on_no_music', es: 'NO música fuerte / No loud music', en: 'No loud music' },
        { id: 'on_no_language', es: 'NO lenguaje vulgar / No foul language', en: 'No foul language' },
        { id: 'on_no_screaming', es: 'NO gritar / No screaming', en: 'No screaming' },
        { id: 'on_no_prices', es: 'NO hablar de precios al cliente (a menos que seas vendedor)', en: 'Do NOT discuss prices with customer (unless you are the seller)' },
        { id: 'on_no_politics', es: 'NO hablar de política con el cliente', en: 'Do NOT discuss politics with the customer' },
        { id: 'on_no_sports_religion', es: 'NO hablar de deportes ni religión con el cliente', en: 'Do NOT discuss sports or religion with the customer' },
        { id: 'on_no_sex_homophobia', es: 'NO comentarios sexuales ni homofóbicos — CERO TOLERANCIA', en: 'No sexual or homophobic comments — ZERO TOLERANCE' },
        { id: 'on_no_comment_home', es: 'NO comentar sobre la limpieza o desorden de la casa', en: 'Do NOT comment on the home\'s cleanliness or messiness' },
        { id: 'on_no_comment_hood', es: 'NO comentar sobre el vecindario / barrio', en: 'Do NOT comment on the neighborhood' },
        { id: 'on_professional', es: 'Mantener actitud profesional y respetuosa en todo momento', en: 'Maintain a professional and respectful attitude at all times' }
      ]
    },
    {
      id: 'onsite_pm',
      title: { es: '🔧 Preventive Maintenance — Listo para PM', en: '🔧 Preventive Maintenance — PM Ready' },
      items: [
        { id: 'on_pm_coil_cleaner', es: 'Coil cleaner (evaporador + condensador)', en: 'Coil cleaner (evaporator + condenser)' },
        { id: 'on_pm_drain_tablets', es: 'Tabletas para drain pan / tratamiento de condensado', en: 'Drain pan tablets / condensate treatment' },
        { id: 'on_pm_filters', es: 'Filtros de reemplazo (verificar tamaño antes)', en: 'Replacement filters (verify size beforehand)' },
        { id: 'on_pm_tstat_batt', es: 'Baterías de termostato (AA / AAA)', en: 'Thermostat batteries (AA / AAA)' },
        { id: 'on_pm_amp_readings', es: 'Preparado para lecturas de amperaje (compresor + motores)', en: 'Ready for amp readings (compressor + fan motors)' },
        { id: 'on_pm_temp_diff', es: 'Sondas de temperatura para ΔT (supply vs return)', en: 'Temperature probes for ΔT (supply vs return)' },
        { id: 'on_pm_static', es: 'Manómetro listo para presión estática', en: 'Manometer ready for static pressure readings' },
        { id: 'on_pm_electrical', es: 'Revisar y apretar conexiones eléctricas', en: 'Check and tighten electrical connections' },
        { id: 'on_pm_capacitor', es: 'Probar capacitor(es)', en: 'Test capacitor(s)' },
        { id: 'on_pm_contactor', es: 'Inspeccionar contactor (pitting / arcing)', en: 'Inspect contactor (pitting / arcing)' },
        { id: 'on_pm_charge', es: 'Verificar carga de refrigerante (SH/SC)', en: 'Verify refrigerant charge (SH/SC)' },
        { id: 'on_pm_drain', es: 'Limpiar línea de condensado / drain line', en: 'Clean condensate drain line' },
        { id: 'on_pm_ductwork', es: 'Inspeccionar ductos (fugas / daño)', en: 'Inspect ductwork (leaks / damage)' },
        { id: 'on_pm_hx', es: 'Inspeccionar heat exchanger (temporada de calefacción)', en: 'Inspect heat exchanger (heating season)' },
        { id: 'on_pm_co', es: 'Prueba de CO (temporada de calefacción)', en: 'CO test (heating season)' },
        { id: 'on_pm_disconnect', es: 'Inspeccionar disconnect eléctrico y whip', en: 'Inspect electrical disconnect and whip' },
        { id: 'on_pm_visual', es: 'Inspección visual general del equipo', en: 'General visual inspection of equipment' }
      ]
    },
    {
      id: 'onsite_install',
      title: { es: '🏗️ Instalación — Listo para Instalar', en: '🏗️ Installation — Ready to Install' },
      items: [
        { id: 'on_inst_permits', es: 'Permisos en mano (si aplica)', en: 'Permits in hand (if applicable)' },
        { id: 'on_inst_equipment', es: 'Equipo verificado (modelo / serial coincide con la orden)', en: 'Equipment verified (model / serial matches order)' },
        { id: 'on_inst_lineset', es: 'Line set dimensionado correctamente', en: 'Line set sized correctly' },
        { id: 'on_inst_tstat_wire', es: 'Cable de termostato tendido / listo', en: 'Thermostat wire run / ready' },
        { id: 'on_inst_disconnect', es: 'Disconnect eléctrico instalado / listo', en: 'Electrical disconnect installed / ready' },
        { id: 'on_inst_pad', es: 'Pad / stand / base listo', en: 'Pad / stand / base ready' },
        { id: 'on_inst_condensate', es: 'Drenaje de condensado planeado / ruteado', en: 'Condensate drain planned / routed' },
        { id: 'on_inst_ductwork', es: 'Modificaciones de ducto / sheet metal planeadas', en: 'Ductwork / sheet metal modifications planned' },
        { id: 'on_inst_insulation', es: 'Líneas de refrigerante aisladas', en: 'Refrigerant lines insulated' },
        { id: 'on_inst_startup', es: 'Procedimiento de startup / arranque listo', en: 'System startup procedure ready' },
        { id: 'on_inst_commission', es: 'Commissioning checklist (carga, airflow, temps)', en: 'Commissioning checklist (charge, airflow, temps)' },
        { id: 'on_inst_walkthrough', es: 'Walkthrough con el cliente planeado', en: 'Customer walkthrough planned' },
        { id: 'on_inst_debris', es: 'Plan de limpieza de escombros / basura', en: 'Debris cleanup plan' },
        { id: 'on_inst_old_equip', es: 'Plan de remoción de equipo viejo', en: 'Old equipment removal plan' }
      ]
    },
    // ══════════════════════════════════════════════════════
    // HERRAMIENTAS — Solo herramientas, NO materiales ni repuestos
    // ══════════════════════════════════════════════════════
    {
      id: 'tools_electrical',
      title: { es: '🔧 Herramientas Eléctricas / Mano', en: '🔧 Electrical / Hand Tools' },
      items: [
        { id: 't_phillips1', es: 'Desarmador Phillips #1', en: 'Phillips Screwdriver #1' },
        { id: 't_phillips2', es: 'Desarmador Phillips #2', en: 'Phillips Screwdriver #2' },
        { id: 't_flat14', es: 'Desarmador Plano 1/4"', en: 'Flat Screwdriver 1/4"' },
        { id: 't_flat516', es: 'Desarmador Plano 5/16"', en: 'Flat Screwdriver 5/16"' },
        { id: 't_6in1', es: 'Desarmador 6-en-1 / Multi-bit', en: '6-in-1 / Multi-bit Screwdriver' },
        { id: 't_insulated_set', es: 'Desarmadores aislados (1000V)', en: 'Insulated Screwdrivers (1000V)' },
        { id: 't_lineman', es: 'Lineman Pliers', en: 'Lineman Pliers' },
        { id: 't_needle', es: 'Needle Nose Pliers', en: 'Needle Nose Pliers' },
        { id: 't_side_cutters', es: 'Side Cutters / Diagonal Cutters', en: 'Side Cutters / Diagonal Cutters' },
        { id: 't_strippers', es: 'Wire Strippers', en: 'Wire Strippers' },
        { id: 't_crimpers', es: 'Crimpers para terminales', en: 'Terminal Crimpers' },
        { id: 't_channel_locks', es: 'Channel Locks (10" y 12")', en: 'Channel Locks (10" & 12")' },
        { id: 't_adj_wrench', es: 'Llave ajustable / Crescent Wrench (8", 10")', en: 'Adjustable Wrench (8", 10")' },
        { id: 't_nut_drivers', es: 'Nut Drivers (1/4", 5/16", 3/8", 7/16", 1/2")', en: 'Nut Drivers (1/4", 5/16", 3/8", 7/16", 1/2")' },
        { id: 't_allen_keys', es: 'Allen Keys / Hex Set (SAE + Metric)', en: 'Allen Keys / Hex Set (SAE + Metric)' },
        { id: 't_socket_set', es: 'Juego de dados / Socket Set', en: 'Socket Set' },
        { id: 't_hammer', es: 'Martillo', en: 'Hammer' },
        { id: 't_tape_measure', es: 'Tape Measure (25 ft)', en: 'Tape Measure (25 ft)' },
        { id: 't_square', es: 'Escuadra / Square', en: 'Square' },
        { id: 't_level', es: 'Nivel / Level (torpedo + 24")', en: 'Level (torpedo + 24")' },
        { id: 't_markers', es: 'Marcadores / Sharpies / Lápiz', en: 'Markers / Sharpies / Pencil' },
        { id: 't_utility_knife', es: 'Navaja / Utility Knife', en: 'Utility Knife' },
        { id: 't_flashlight', es: 'Linterna / Flashlight + Headlamp', en: 'Flashlight + Headlamp' },
        { id: 't_screw_gun', es: 'Hand Screw Gun (taladro inalámbrico)', en: 'Cordless Drill / Screw Gun' },
        { id: 't_impact', es: 'Impact Driver', en: 'Impact Driver' },
        { id: 't_roto_hammer', es: 'Roto Martillo / Hammer Drill (chuck 1/2")', en: 'Rotary Hammer / Hammer Drill (1/2" chuck)' },
        { id: 't_drill_bits', es: 'Brocas / Drill Bits (set completo)', en: 'Drill Bit Set (complete)' },
        { id: 't_step_bit', es: 'Step Bit / Unibit', en: 'Step Bit / Unibit' },
        { id: 't_hole_saw', es: 'Hole Saw Kit', en: 'Hole Saw Kit' },
        { id: 't_batteries', es: 'Baterías cargadas (drill, impact)', en: 'Charged batteries (drill, impact)' },
        { id: 't_circular_saw', es: 'Circular Saw / Sierra circular', en: 'Circular Saw' },
        { id: 't_band_saw', es: 'Band Saw / Sierra de cinta portátil', en: 'Portable Band Saw' },
        { id: 't_sawzall', es: 'Reciprocating Saw / Sawzall', en: 'Reciprocating Saw / Sawzall' },
        { id: 't_saw_blades', es: 'Hojas de sierra (metal + madera)', en: 'Saw Blades (metal + wood)' },
        { id: 't_jab_saw', es: 'Jab Saw / Drywall Saw', en: 'Jab Saw / Drywall Saw' }
      ]
    },
    {
      id: 'tools_electrical_install',
      title: { es: '⚡ Instalación Eléctrica / Conduit', en: '⚡ Electrical Installation / Conduit' },
      items: [
        { id: 't_emt_bender_12', es: 'Hand Pipe Bender 1/2" EMT', en: 'Hand Pipe Bender 1/2" EMT' },
        { id: 't_emt_bender_34', es: 'Hand Pipe Bender 3/4" EMT', en: 'Hand Pipe Bender 3/4" EMT' },
        { id: 't_emt_bender_1', es: 'Hand Pipe Bender 1" EMT', en: 'Hand Pipe Bender 1" EMT' },
        { id: 't_fish_tape', es: 'Fish Tape (acero o fibra de vidrio)', en: 'Fish Tape (steel or fiberglass)' },
        { id: 't_fish_sticks', es: 'Fish Sticks / Glow Rods', en: 'Fish Sticks / Glow Rods' },
        { id: 't_conduit_reamer', es: 'Conduit Reamer / Escariador de conduit', en: 'Conduit Reamer' },
        { id: 't_knockout_punch', es: 'Knockout Punch Set', en: 'Knockout Punch Set' },
        { id: 't_cable_puller', es: 'Cable Puller / Wire Puller', en: 'Cable Puller / Wire Puller' },
        { id: 't_pvc_cutter', es: 'PVC Cutter / Cortador de PVC', en: 'PVC Cutter' },
        { id: 't_wire_lube', es: 'Wire Pulling Lubricant', en: 'Wire Pulling Lubricant' },
        { id: 't_work_light', es: 'Lámpara de trabajo / Work Light', en: 'Work Light' },
        { id: 't_headlamp_extra', es: 'Headlamp extra (para attics y crawl spaces)', en: 'Extra Headlamp (for attics & crawl spaces)' },
        { id: 't_drop_light', es: 'Drop Light / Trouble Light', en: 'Drop Light / Trouble Light' }
      ]
    },
    {
      id: 'tools_carry',
      title: { es: '🎒 Bolsas y Portaherramientas', en: '🎒 Bags & Tool Carriers' },
      items: [
        { id: 't_tool_bag', es: 'Mochila / Tool Bag (Milwaukee, Veto, Klein, Knava)', en: 'Tool Bag / Backpack (Milwaukee, Veto, Klein, Knava)' },
        { id: 't_tool_tote', es: 'Tool Tote / Caja de herramientas abierta', en: 'Tool Tote / Open Tool Box' },
        { id: 't_waist_pouch', es: 'Waist Pouch / Cinturón de herramientas', en: 'Waist Pouch / Tool Belt' },
        { id: 't_nail_pouch', es: 'Nail Pouch / Bolsa de tornillos', en: 'Nail Pouch / Screw Pouch' },
        { id: 't_meter_case', es: 'Estuche para instrumentos (multímetro, manifold)', en: 'Instrument Case (multimeter, manifold)' },
        { id: 't_refrig_bag', es: 'Bolsa de refrigeración (hoses, manifold, gauges)', en: 'Refrigeration Bag (hoses, manifold, gauges)' },
        { id: 't_drill_bag', es: 'Bolsa para drill / impact + baterías', en: 'Drill / Impact Bag + batteries' }
      ]
    },
    {
      id: 'tools_electrical_test',
      title: { es: '⚡ Instrumentos Eléctricos Básicos', en: '⚡ Basic Electrical Instruments' },
      items: [
        { id: 't_tick_tracer', es: 'Voltage Tick Tracer / Non-contact Tester', en: 'Voltage Tick Tracer / Non-contact Tester' },
        { id: 't_outlet_tester', es: 'Outlet Tester / Receptacle Tester', en: 'Outlet Tester / Receptacle Tester' },
        { id: 't_circuit_tracer', es: 'Circuit Tracer / Breaker Finder', en: 'Circuit Tracer / Breaker Finder' }
      ]
    },
    {
      id: 'tools_refrig_cutting',
      title: { es: '❄️ Refrigeración — Corte, Doblaje y Conexiones', en: '❄️ Refrigeration — Cutting, Bending & Connections' },
      items: [
        { id: 't_tube_cutter_lg', es: 'Cortador de tubo grande (1/4" - 1-5/8")', en: 'Tube Cutter Large (1/4" - 1-5/8")' },
        { id: 't_tube_cutter_sm', es: 'Cortador de tubo pequeño (1/8" - 5/8")', en: 'Tube Cutter Small (1/8" - 5/8")' },
        { id: 't_mini_cutter', es: 'Mini Tube Cutter (espacios reducidos)', en: 'Mini Tube Cutter (tight spaces)' },
        { id: 't_deburr_inner', es: 'Escariador interior / Inner Reamer', en: 'Inner Reamer / Deburring Tool' },
        { id: 't_deburr_outer', es: 'Escariador exterior / Outer Deburrer', en: 'Outer Deburrer' },
        { id: 't_tube_bender_14', es: 'Doblador de tubo 1/4"', en: 'Tube Bender 1/4"' },
        { id: 't_tube_bender_38', es: 'Doblador de tubo 3/8"', en: 'Tube Bender 3/8"' },
        { id: 't_tube_bender_12', es: 'Doblador de tubo 1/2"', en: 'Tube Bender 1/2"' },
        { id: 't_tube_bender_58', es: 'Doblador de tubo 5/8"', en: 'Tube Bender 5/8"' },
        { id: 't_tube_bender_34', es: 'Doblador de tubo 3/4"', en: 'Tube Bender 3/4"' },
        { id: 't_tube_bender_78', es: 'Doblador de tubo 7/8"', en: 'Tube Bender 7/8"' },
        { id: 't_flaring_tool', es: 'Flaring Tool (45°)', en: 'Flaring Tool (45°)' },
        { id: 't_flaring_block', es: 'Flaring Block / Flaring Bar', en: 'Flaring Block / Flaring Bar' },
        { id: 't_eccentric_flare', es: 'Eccentric Flaring Tool (spin flare)', en: 'Eccentric Flaring Tool (spin flare)' },
        { id: 't_swaging_set', es: 'Swaging Tool Set (completo)', en: 'Swaging Tool Set (complete)' },
        { id: 't_swage_punch', es: 'Swage Punch / Expansor de tubo', en: 'Swage Punch / Tube Expander' },
        { id: 't_tube_spring_bender', es: 'Spring Tube Bender (interno/externo)', en: 'Spring Tube Bender (internal/external)' }
      ]
    },
    {
      id: 'tools_refrig_pressure',
      title: { es: '❄️ Refrigeración — Presión, Vacío y Carga', en: '❄️ Refrigeration — Pressure, Vacuum & Charging' },
      items: [
        { id: 't_manifold', es: 'Manifold Gauge Set / Manómetros', en: 'Manifold Gauge Set / Pressure Gauges' },
        { id: 't_digital_manifold', es: 'Digital Manifold (si aplica)', en: 'Digital Manifold (if applicable)' },
        { id: 't_hoses', es: 'Mangueras de refrigeración (set)', en: 'Refrigerant Hoses (set)' },
        { id: 't_low_loss_fittings', es: 'Low-Loss Fittings / Ball Valve Fittings', en: 'Low-Loss Fittings / Ball Valve Fittings' },
        { id: 't_vacuum_pump', es: 'Bomba de vacío / Vacuum Pump', en: 'Vacuum Pump' },
        { id: 't_vacuum_hose', es: 'Manguera de vacío (core-less)', en: 'Vacuum Hose (core-less)' },
        { id: 't_micron_gauge', es: 'Micron Gauge', en: 'Micron Gauge' },
        { id: 't_refrig_scale', es: 'Báscula de refrigerante / Charging Scale', en: 'Refrigerant Charging Scale' },
        { id: 't_charging_cylinder', es: 'Cilindro de carga (graduated)', en: 'Charging Cylinder (graduated)' },
        { id: 't_valve_core', es: 'Valve Core Remover Tool', en: 'Valve Core Remover Tool' },
        { id: 't_valve_core_depressor', es: 'Valve Core Depressor / Schrader Tool', en: 'Valve Core Depressor / Schrader Tool' },
        { id: 't_service_wrench', es: 'Service Wrench / Ratchet Wrench (refrigeración)', en: 'Service Wrench / Ratchet Wrench (refrigeration)' },
        { id: 't_service_valve_wrench', es: 'Service Valve Wrench (cuadrada, para válvulas de servicio)', en: 'Service Valve Wrench (square, for service valves)' },
        { id: 't_torque_wrench', es: 'Torque Wrench (conexiones de refrigeración)', en: 'Torque Wrench (refrigerant fittings)' },
        { id: 't_refrigerant_tank', es: 'Tanque de refrigerante (R-410A, R-22, R-404A, según trabajo)', en: 'Refrigerant Tank (R-410A, R-22, R-404A, per job)' }
      ]
    },
    {
      id: 'tools_refrig_leak',
      title: { es: '🔍 Detección de Fugas', en: '🔍 Leak Detection' },
      items: [
        { id: 't_elec_leak', es: 'Detector de fugas electrónico (Fieldpiece SRL2 / Testo 316)', en: 'Electronic Leak Detector (Fieldpiece SRL2 / Testo 316)' },
        { id: 't_ultrasonic_leak', es: 'Detector de fugas ultrasónico', en: 'Ultrasonic Leak Detector' },
        { id: 't_uv_kit', es: 'Kit UV de detección de fugas (lámpara UV + tinte)', en: 'UV Leak Detection Kit (UV lamp + dye)' },
        { id: 't_uv_glasses', es: 'Lentes UV para detección', en: 'UV Detection Glasses' },
        { id: 't_micro_foaming', es: 'Micro Foaming / Solución de burbujas (spray)', en: 'Micro Foaming / Bubble Solution (spray)' },
        { id: 't_nitrogen_leak', es: 'Regulador de nitrógeno (para prueba de presión)', en: 'Nitrogen Regulator (for pressure test)' },
        { id: 't_nitrogen_tank', es: 'Tanque de nitrógeno', en: 'Nitrogen Tank' }
      ]
    },
    {
      id: 'tools_refrig_adapters',
      title: { es: '🔌 Adaptadores y Llaves Especiales', en: '🔌 Adapters & Specialty Wrenches' },
      items: [
        { id: 't_mini_split_adapter', es: 'Adaptadores para Mini Split (5/16" a 1/4")', en: 'Mini Split Adapters (5/16" to 1/4")' },
        { id: 't_a2l_adapter', es: 'Adaptadores para A2L (R-32, R-454B — low-loss requerido)', en: 'A2L Adapters (R-32, R-454B — low-loss required)' },
        { id: 't_a2l_recovery_adapter', es: 'Adaptador de recuperación A2L', en: 'A2L Recovery Adapter' },
        { id: 't_locking_cap_key', es: 'Llaves para Locking Refrigerant Caps (R-410A, R-32)', en: 'Locking Refrigerant Cap Keys (R-410A, R-32)' },
        { id: 't_tamper_proof_key', es: 'Tamper-Proof Cap Key Set', en: 'Tamper-Proof Cap Key Set' },
        { id: 't_piercing_valve', es: 'Piercing Valve / Bullet Valve', en: 'Piercing Valve / Bullet Valve' },
        { id: 't_access_fitting', es: 'Access Fitting Tool (para soldar access valves)', en: 'Access Fitting Tool (for brazing access valves)' },
        { id: 't_reducer_couplings', es: 'Reducer Couplings / Adaptadores de manguera', en: 'Reducer Couplings / Hose Adapters' },
        { id: 't_vacuum_adapter', es: 'Adaptador de vacío (3/8" a 1/4")', en: 'Vacuum Adapter (3/8" to 1/4")' },
        { id: 't_flare_adapter', es: 'Flare Nut Adapter Set (SAE)', en: 'Flare Nut Adapter Set (SAE)' }
      ]
    },
    {
      id: 'tools_brazing',
      title: { es: '🔥 Brazing / Soldadura', en: '🔥 Brazing / Soldering' },
      items: [
        { id: 't_torch_oxy', es: 'Antorcha Oxy-Acetylene (con reguladores)', en: 'Oxy-Acetylene Torch (with regulators)' },
        { id: 't_torch_air', es: 'Antorcha Air-Acetylene / Turbo Torch', en: 'Air-Acetylene / Turbo Torch' },
        { id: 't_torch_tips', es: 'Puntas de antorcha (A-3, A-5, A-11, A-14)', en: 'Torch Tips (A-3, A-5, A-11, A-14)' },
        { id: 't_striker', es: 'Striker / Encendedor de chispa', en: 'Striker / Spark Igniter' },
        { id: 't_oxy_regulator', es: 'Regulador de oxígeno', en: 'Oxygen Regulator' },
        { id: 't_acet_regulator', es: 'Regulador de acetileno', en: 'Acetylene Regulator' },
        { id: 't_oxy_tank', es: 'Tanque de oxígeno (nivel OK)', en: 'Oxygen Tank (level OK)' },
        { id: 't_acet_tank', es: 'Tanque de acetileno (nivel OK)', en: 'Acetylene Tank (level OK)' },
        { id: 't_heat_shield', es: 'Heat Shield / Manta protectora de flama', en: 'Heat Shield / Flame Protector Blanket' },
        { id: 't_heat_blanket', es: 'Heat Blanket / Welding Blanket', en: 'Heat Blanket / Welding Blanket' },
        { id: 't_heat_paste', es: 'Pasta protectora para válvulas y componentes sensibles', en: 'Heat Block Paste for valves & sensitive components' },
        { id: 't_nitrogen_flow', es: 'Regulador de flujo de nitrógeno (purga durante soldadura)', en: 'Nitrogen Flow Regulator (purge while brazing)' },
        { id: 't_nitrogen_tank_brz', es: 'Tanque de nitrógeno (para purga)', en: 'Nitrogen Tank (for purge)' },
        { id: 't_brazing_rods', es: 'Varillas de soldadura (Silfos-15, Silver Solder)', en: 'Brazing Rods (Silfos-15, Silver Solder)' },
        { id: 't_flux', es: 'Flux / Fundente (para cobre a bronce)', en: 'Flux (for copper to brass)' },
        { id: 't_torch_hose', es: 'Mangueras de antorcha (sin fugas)', en: 'Torch Hoses (no leaks)' },
        { id: 't_check_valve', es: 'Flashback Arrestor / Check Valves (seguridad)', en: 'Flashback Arrestor / Check Valves (safety)' }
      ]
    },
    {
      id: 'tools_recovery',
      title: { es: '♻️ Recuperación de Refrigerante', en: '♻️ Refrigerant Recovery' },
      items: [
        { id: 't_recovery_machine', es: 'Recovery Machine / Máquina de recuperación', en: 'Recovery Machine' },
        { id: 't_recovery_tank_30', es: 'Tanque de recuperación 30 lb', en: 'Recovery Tank 30 lb' },
        { id: 't_recovery_tank_50', es: 'Tanque de recuperación 50 lb', en: 'Recovery Tank 50 lb' },
        { id: 't_recovery_hoses', es: 'Mangueras de recuperación (high-side rated)', en: 'Recovery Hoses (high-side rated)' },
        { id: 't_recovery_filter', es: 'Filtro de recuperación (inline)', en: 'Recovery Filter (inline)' },
        { id: 't_recovery_scale', es: 'Báscula para pesar tanque de recuperación', en: 'Scale for weighing recovery tank' },
        { id: 't_refrigerant_log', es: 'Refrigerant Tracking Log / Bitácora EPA (formulario)', en: 'Refrigerant Tracking Log / EPA Log (form)' },
        { id: 't_recovery_adapter_a2l', es: 'Adaptador de recuperación A2L (R-32, R-454B)', en: 'A2L Recovery Adapter (R-32, R-454B)' }
      ]
    },
    {
      id: 'tools_performance',
      title: { es: '📊 Instrumentos de Desempeño — Fieldpiece / Testo', en: '📊 Performance Instruments — Fieldpiece / Testo' },
      items: [
        // Temperature
        { id: 't_fp_temp_probe', es: 'Sonda de temperatura / Pipe Clamp Thermocouple', en: 'Temperature Probe / Pipe Clamp Thermocouple' },
        { id: 't_fp_dual_temp', es: 'Dual Temperature Probe (supply + return / ΔT)', en: 'Dual Temperature Probe (supply + return / ΔT)' },
        { id: 't_fp_ir_thermo', es: 'Termómetro Infrarrojo / IR Gun', en: 'Infrared Thermometer / IR Gun' },
        { id: 't_fp_wet_bulb', es: 'Psychrometer / Wet Bulb + Dry Bulb', en: 'Psychrometer / Wet Bulb + Dry Bulb' },
        // Pressure & Refrigeration
        { id: 't_fp_digital_manifold', es: 'Digital Manifold (Fieldpiece SM380V / Testo 557s)', en: 'Digital Manifold (Fieldpiece SM380V / Testo 557s)' },
        { id: 't_fp_wireless_probes', es: 'Wireless Pressure Probes (Job Link / Testo 549i)', en: 'Wireless Pressure Probes (Job Link / Testo 549i)' },
        { id: 't_fp_vacuum_gauge', es: 'Digital Vacuum Gauge (Fieldpiece SVG3 / Testo 552i)', en: 'Digital Vacuum Gauge (Fieldpiece SVG3 / Testo 552i)' },
        { id: 't_fp_wireless_scale', es: 'Wireless Refrigerant Scale (Fieldpiece SRS3)', en: 'Wireless Refrigerant Scale (Fieldpiece SRS3)' },
        // Airflow & Static Pressure
        { id: 't_fp_manometer', es: 'Manómetro Dual (presión estática — Fieldpiece SDMN6)', en: 'Dual Port Manometer (static pressure — Fieldpiece SDMN6)' },
        { id: 't_fp_static_tips', es: 'Static Pressure Tips / Pitot Tubes', en: 'Static Pressure Tips / Pitot Tubes' },
        { id: 't_fp_anemometer', es: 'Anemómetro (Fieldpiece AAT3 / Hot Wire)', en: 'Anemometer (Fieldpiece AAT3 / Hot Wire)' },
        { id: 't_fp_psychrometer_duct', es: 'In-Duct Psychrometer (Fieldpiece SDP2)', en: 'In-Duct Psychrometer (Fieldpiece SDP2)' },
        { id: 't_fp_flow_hood', es: 'Flow Hood / Balometer (si aplica)', en: 'Flow Hood / Balometer (if applicable)' },
        // Electrical Performance
        { id: 't_fp_multimeter', es: 'Multímetro Digital (Fieldpiece SC680 / SC480)', en: 'Digital Multimeter (Fieldpiece SC680 / SC480)' },
        { id: 't_fp_clamp_meter', es: 'Clamp Meter / Amperímetro (Fieldpiece SC260)', en: 'Clamp Meter (Fieldpiece SC260)' },
        { id: 't_fp_kw_meter', es: 'Amp/kW Meter (Fieldpiece AKM5 — watts reales)', en: 'Amp/kW Meter (Fieldpiece AKM5 — true watts)' },
        { id: 't_fp_capacitor', es: 'Probador de capacitores (en multímetro o separado)', en: 'Capacitor Tester (in multimeter or standalone)' },
        { id: 't_fp_megger', es: 'Megóhmetro / Megger (aislamiento de compresor)', en: 'Megohmmeter / Megger (compressor insulation)' },
        // Combustion & Gas
        { id: 't_fp_combustion', es: 'Analizador de combustión (Fieldpiece SOX3 / Testo 320)', en: 'Combustion Analyzer (Fieldpiece SOX3 / Testo 320)' },
        { id: 't_fp_co_detector', es: 'Detector de CO (monóxido de carbono)', en: 'CO Detector (carbon monoxide)' },
        { id: 't_fp_gas_leak', es: 'Gas Leak Detector (combustible gas)', en: 'Gas Leak Detector (combustible gas)' },
        // Leak Detection
        { id: 't_fp_refrig_leak', es: 'Refrigerant Leak Detector (Fieldpiece SRL2 / Testo 316)', en: 'Refrigerant Leak Detector (Fieldpiece SRL2 / Testo 316)' },
        { id: 't_fp_ultrasonic', es: 'Ultrasonic Leak Detector', en: 'Ultrasonic Leak Detector' },
        // Identification
        { id: 't_fp_refrig_id', es: 'Identificador de refrigerante / Refrigerant Identifier', en: 'Refrigerant Identifier' },
        // Smartphone/App
        { id: 't_fp_job_link', es: 'Fieldpiece Job Link App (conectado + cargado)', en: 'Fieldpiece Job Link App (connected + charged)' },
        { id: 't_fp_measurequick', es: 'MeasureQuick App (reportes de desempeño)', en: 'MeasureQuick App (performance reports)' }
      ]
    },
    {
      id: 'tools_sheetmetal',
      title: { es: '🪚 Herramientas de Sheet Metal / Ductos', en: '🪚 Sheet Metal / Ductwork Tools' },
      items: [
        { id: 't_snips_left', es: 'Aviation Snips — Izquierda (Roja)', en: 'Aviation Snips — Left (Red)' },
        { id: 't_snips_right', es: 'Aviation Snips — Derecha (Verde)', en: 'Aviation Snips — Right (Green)' },
        { id: 't_snips_straight', es: 'Aviation Snips — Recta (Amarilla)', en: 'Aviation Snips — Straight (Yellow)' },
        { id: 't_crimper', es: 'Crimpers para ducto', en: 'Duct Crimpers' },
        { id: 't_seamer', es: 'Hand Seamer / Doblador de lámina', en: 'Hand Seamer' },
        { id: 't_folding_tool', es: 'Folding Tool / Brake de mano', en: 'Folding Tool / Hand Brake' },
        { id: 't_duct_knife', es: 'Duct Knife / Cuchillo para ducto', en: 'Duct Knife' },
        { id: 't_scratch_awl', es: 'Scratch Awl / Punzón', en: 'Scratch Awl' },
        { id: 't_pop_rivet', es: 'Pop Rivet Gun', en: 'Pop Rivet Gun' },
        { id: 't_flex_knife', es: 'Flex Duct Knife / Navaja para flex', en: 'Flex Duct Knife' },
        { id: 't_duct_board_knife', es: 'Duct Board Knife', en: 'Duct Board Knife' },
        { id: 't_cleco_pliers', es: 'Cleco Pliers', en: 'Cleco Pliers' },
        { id: 't_metal_snips_offset', es: 'Offset Snips', en: 'Offset Snips' }
      ]
    },
    {
      id: 'tools_gas',
      title: { es: '🔴 Herramientas de Gas Piping', en: '🔴 Gas Piping Tools' },
      items: [
        { id: 't_pipe_wrench_10', es: 'Pipe Wrench 10"', en: 'Pipe Wrench 10"' },
        { id: 't_pipe_wrench_14', es: 'Pipe Wrench 14"', en: 'Pipe Wrench 14"' },
        { id: 't_pipe_wrench_18', es: 'Pipe Wrench 18"', en: 'Pipe Wrench 18"' },
        { id: 't_pipe_cutter', es: 'Cortador de tubo de hierro / Pipe Cutter', en: 'Iron Pipe Cutter' },
        { id: 't_pipe_threader', es: 'Terraja / Pipe Threader', en: 'Pipe Threader / Die Set' },
        { id: 't_pipe_reamer', es: 'Escariador de tubo / Pipe Reamer', en: 'Pipe Reamer' },
        { id: 't_pipe_vise', es: 'Prensa de tubo / Pipe Vise', en: 'Pipe Vise' },
        { id: 't_gas_manometer', es: 'Manómetro de presión de gas', en: 'Gas Pressure Manometer' },
        { id: 't_csst_tool', es: 'CSST Fitting Tool', en: 'CSST Fitting Tool' }
      ]
    },
    {
      id: 'tools_heating',
      title: { es: '🔥 Herramientas de Calefacción / Heating', en: '🔥 Heating Tools' },
      items: [
        { id: 't_personal_co', es: 'Detector de CO personal (clip-on)', en: 'Personal CO Detector (clip-on)' },
        { id: 't_combustion_analyzer', es: 'Analizador de combustión (Fieldpiece SOX3 / Testo 320)', en: 'Combustion Analyzer (Fieldpiece SOX3 / Testo 320)' },
        { id: 't_combustion_probe', es: 'Sonda de gases de combustión / Flue Probe', en: 'Combustion / Flue Gas Probe' },
        { id: 't_co_ambient', es: 'Detector de CO ambiental', en: 'Ambient CO Detector' },
        { id: 't_draft_gauge', es: 'Draft Gauge / Medidor de tiro', en: 'Draft Gauge' },
        { id: 't_gas_leak_detector', es: 'Detector de fugas de gas combustible', en: 'Combustible Gas Leak Detector' },
        { id: 't_gas_manometer_h', es: 'Manómetro de presión de gas (WC / inches)', en: 'Gas Pressure Manometer (WC / inches)' },
        { id: 't_temp_rise_probes', es: 'Sondas de temperatura rise (supply + return aire)', en: 'Temperature Rise Probes (supply + return air)' },
        { id: 't_flame_sensor_tool', es: 'Herramienta para flame sensor (lija fina + multímetro)', en: 'Flame Sensor Tool (fine sandpaper + multimeter)' },
        { id: 't_hx_mirror', es: 'Espejo de inspección de heat exchanger', en: 'Heat Exchanger Inspection Mirror' },
        { id: 't_hx_camera', es: 'Cámara de inspección para heat exchanger', en: 'Heat Exchanger Inspection Camera' },
        { id: 't_igniter_tester', es: 'Probador de igniter (Hot Surface / Spark)', en: 'Igniter Tester (Hot Surface / Spark)' },
        { id: 't_thermocouple_tools', es: 'Thermocouple / Thermopile (herramientas + repuesto)', en: 'Thermocouple / Thermopile (tools + spare)' },
        { id: 't_gas_valve_manometer', es: 'Manómetro para gas valve (inlet + outlet pressure)', en: 'Gas Valve Manometer (inlet + outlet pressure)' },
        { id: 't_pressure_switch_kit', es: 'Kit de prueba de pressure switch (tubo + tee)', en: 'Pressure Switch Test Kit (tubing + tee)' },
        { id: 't_limit_switch_bypass', es: 'Jumper wire para prueba de limit switch', en: 'Jumper Wire for Limit Switch Testing' },
        { id: 't_vent_pipe_tools', es: 'Herramientas para vent pipe / B-Vent / PVC', en: 'Vent Pipe Tools (B-Vent / PVC)' },
        { id: 't_heat_tape', es: 'Heat Tape / Cinta térmica para tubería', en: 'Heat Tape for Piping' },
        { id: 't_combustion_air_test', es: 'Kit de prueba de combustion air (smoke pencil / match)', en: 'Combustion Air Test Kit (smoke pencil / match)' }
      ]
    },
    {
      id: 'tools_cleaning',
      title: { es: '🧹 Herramientas de Limpieza / Servicio', en: '🧹 Cleaning / Service Tools' },
      items: [
        { id: 't_coil_cleaner_pump', es: 'Bomba de limpieza de coils / Coil Cleaning Pump', en: 'Coil Cleaning Pump / Sprayer' },
        { id: 't_fin_comb', es: 'Fin Comb / Peine de aletas', en: 'Fin Comb' },
        { id: 't_coil_brush', es: 'Cepillo para coils', en: 'Coil Brush' },
        { id: 't_condensate_pump', es: 'Condensate Drain Pump / Wet-Dry Vac', en: 'Condensate Drain Pump / Wet-Dry Vac' },
        { id: 't_drain_gun', es: 'Drain Gun / CO2 Drain Cleaner', en: 'Drain Gun / CO2 Drain Cleaner' },
        { id: 't_shop_vac', es: 'Shop Vac / Aspiradora', en: 'Shop Vac' },
        { id: 't_inspection_mirror', es: 'Espejo de inspección', en: 'Inspection Mirror' },
        { id: 't_inspection_camera', es: 'Cámara de inspección / Borescope', en: 'Inspection Camera / Borescope' }
      ]
    },
    // ══════════════════════════════════════════════════════
    // STOCK TRUCK — Repuestos para llamadas de servicio
    // Residencial + Comercial
    // ══════════════════════════════════════════════════════
    {
      id: 'stock_capacitors',
      title: { es: '⚡ Capacitores (Run & Start)', en: '⚡ Capacitors (Run & Start)' },
      items: [
        { id: 's_cap_5', es: 'Capacitor Run 5 MFD / 370-440V', en: 'Run Capacitor 5 MFD / 370-440V' },
        { id: 's_cap_7_5', es: 'Capacitor Run 7.5 MFD / 370-440V', en: 'Run Capacitor 7.5 MFD / 370-440V' },
        { id: 's_cap_10', es: 'Capacitor Run 10 MFD / 370-440V', en: 'Run Capacitor 10 MFD / 370-440V' },
        { id: 's_cap_15', es: 'Capacitor Run 15 MFD / 370-440V', en: 'Run Capacitor 15 MFD / 370-440V' },
        { id: 's_cap_20', es: 'Capacitor Run 20 MFD / 370-440V', en: 'Run Capacitor 20 MFD / 370-440V' },
        { id: 's_cap_25', es: 'Capacitor Run 25 MFD / 370-440V', en: 'Run Capacitor 25 MFD / 370-440V' },
        { id: 's_cap_30', es: 'Capacitor Run 30 MFD / 370-440V', en: 'Run Capacitor 30 MFD / 370-440V' },
        { id: 's_cap_35', es: 'Capacitor Run 35 MFD / 370-440V', en: 'Run Capacitor 35 MFD / 370-440V' },
        { id: 's_cap_40', es: 'Capacitor Run 40 MFD / 370-440V', en: 'Run Capacitor 40 MFD / 370-440V' },
        { id: 's_cap_45', es: 'Capacitor Run 45 MFD / 370-440V', en: 'Run Capacitor 45 MFD / 370-440V' },
        { id: 's_cap_50', es: 'Capacitor Run 50 MFD / 370-440V', en: 'Run Capacitor 50 MFD / 370-440V' },
        { id: 's_cap_55', es: 'Capacitor Run 55 MFD / 370-440V', en: 'Run Capacitor 55 MFD / 370-440V' },
        { id: 's_cap_60', es: 'Capacitor Run 60 MFD / 370-440V', en: 'Run Capacitor 60 MFD / 370-440V' },
        { id: 's_cap_dual_35_5', es: 'Dual Capacitor 35/5 MFD / 370-440V', en: 'Dual Capacitor 35/5 MFD / 370-440V' },
        { id: 's_cap_dual_40_5', es: 'Dual Capacitor 40/5 MFD / 370-440V', en: 'Dual Capacitor 40/5 MFD / 370-440V' },
        { id: 's_cap_dual_45_5', es: 'Dual Capacitor 45/5 MFD / 370-440V', en: 'Dual Capacitor 45/5 MFD / 370-440V' },
        { id: 's_cap_dual_50_5', es: 'Dual Capacitor 50/5 MFD / 370-440V', en: 'Dual Capacitor 50/5 MFD / 370-440V' },
        { id: 's_cap_dual_55_5', es: 'Dual Capacitor 55/5 MFD / 370-440V', en: 'Dual Capacitor 55/5 MFD / 370-440V' },
        { id: 's_cap_dual_60_5', es: 'Dual Capacitor 60/5 MFD / 370-440V', en: 'Dual Capacitor 60/5 MFD / 370-440V' },
        { id: 's_cap_dual_80_5', es: 'Dual Capacitor 80/5 MFD / 370-440V', en: 'Dual Capacitor 80/5 MFD / 370-440V' },
        { id: 's_cap_start_88_108', es: 'Start Capacitor 88-108 MFD / 250V', en: 'Start Capacitor 88-108 MFD / 250V' },
        { id: 's_cap_start_145_175', es: 'Start Capacitor 145-175 MFD / 250V', en: 'Start Capacitor 145-175 MFD / 250V' },
        { id: 's_cap_start_189_227', es: 'Start Capacitor 189-227 MFD / 250V', en: 'Start Capacitor 189-227 MFD / 250V' },
        { id: 's_cap_start_233_280', es: 'Start Capacitor 233-280 MFD / 250V', en: 'Start Capacitor 233-280 MFD / 250V' },
        { id: 's_cap_start_270_324', es: 'Start Capacitor 270-324 MFD / 250V', en: 'Start Capacitor 270-324 MFD / 250V' },
        { id: 's_cap_turbo_200', es: 'Turbo 200 (capacitor universal)', en: 'Turbo 200 (universal capacitor)' }
      ]
    },
    {
      id: 'stock_contactors_relays',
      title: { es: '🔌 Contactores y Relays', en: '🔌 Contactors & Relays' },
      items: [
        { id: 's_contactor_1p_24v_25a', es: 'Contactor 1-Pole 24V coil / 25A', en: 'Contactor 1-Pole 24V coil / 25A' },
        { id: 's_contactor_1p_24v_30a', es: 'Contactor 1-Pole 24V coil / 30A', en: 'Contactor 1-Pole 24V coil / 30A' },
        { id: 's_contactor_1p_24v_40a', es: 'Contactor 1-Pole 24V coil / 40A', en: 'Contactor 1-Pole 24V coil / 40A' },
        { id: 's_contactor_2p_24v_25a', es: 'Contactor 2-Pole 24V coil / 25A', en: 'Contactor 2-Pole 24V coil / 25A' },
        { id: 's_contactor_2p_24v_30a', es: 'Contactor 2-Pole 24V coil / 30A', en: 'Contactor 2-Pole 24V coil / 30A' },
        { id: 's_contactor_2p_24v_40a', es: 'Contactor 2-Pole 24V coil / 40A', en: 'Contactor 2-Pole 24V coil / 40A' },
        { id: 's_contactor_3p_24v_40a', es: 'Contactor 3-Pole 24V coil / 40A (comercial)', en: 'Contactor 3-Pole 24V coil / 40A (commercial)' },
        { id: 's_relay_spdt', es: 'Relay SPDT (fan relay / time delay)', en: 'Relay SPDT (fan relay / time delay)' },
        { id: 's_relay_dpdt', es: 'Relay DPDT', en: 'Relay DPDT' },
        { id: 's_relay_sequencer', es: 'Sequencer Relay (calefacción eléctrica)', en: 'Sequencer Relay (electric heat)' },
        { id: 's_relay_potential', es: 'Potential Relay (compressor start)', en: 'Potential Relay (compressor start)' },
        { id: 's_relay_current', es: 'Current Relay (fractional HP compressors)', en: 'Current Relay (fractional HP compressors)' },
        { id: 's_hard_start_kit', es: 'Hard Start Kit / 5-2-1 Compressor Saver', en: 'Hard Start Kit / 5-2-1 Compressor Saver' },
        { id: 's_time_delay', es: 'Time Delay Relay (anti-short cycle)', en: 'Time Delay Relay (anti-short cycle)' }
      ]
    },
    {
      id: 'stock_motors',
      title: { es: '🔄 Motores', en: '🔄 Motors' },
      items: [
        { id: 's_motor_cond_1_6', es: 'Motor condensador 1/6 HP 208-230V', en: 'Condenser Motor 1/6 HP 208-230V' },
        { id: 's_motor_cond_1_4', es: 'Motor condensador 1/4 HP 208-230V', en: 'Condenser Motor 1/4 HP 208-230V' },
        { id: 's_motor_cond_1_3', es: 'Motor condensador 1/3 HP 208-230V', en: 'Condenser Motor 1/3 HP 208-230V' },
        { id: 's_motor_cond_1_2', es: 'Motor condensador 1/2 HP 208-230V', en: 'Condenser Motor 1/2 HP 208-230V' },
        { id: 's_motor_blower_1_4', es: 'Motor blower 1/4 HP (direct drive)', en: 'Blower Motor 1/4 HP (direct drive)' },
        { id: 's_motor_blower_1_3', es: 'Motor blower 1/3 HP (direct drive)', en: 'Blower Motor 1/3 HP (direct drive)' },
        { id: 's_motor_blower_1_2', es: 'Motor blower 1/2 HP (direct drive)', en: 'Blower Motor 1/2 HP (direct drive)' },
        { id: 's_motor_blower_3_4', es: 'Motor blower 3/4 HP (direct drive)', en: 'Blower Motor 3/4 HP (direct drive)' },
        { id: 's_motor_blower_1', es: 'Motor blower 1 HP (direct drive)', en: 'Blower Motor 1 HP (direct drive)' },
        { id: 's_motor_ecm', es: 'Motor ECM (módulo / motor — según modelo)', en: 'ECM Motor (module / motor — per model)' },
        { id: 's_motor_induc_draft', es: 'Inducer Draft Motor (universal o por modelo)', en: 'Inducer Draft Motor (universal or per model)' },
        { id: 's_motor_evap_fan', es: 'Motor evaporador / Fan Motor (walk-in / reach-in)', en: 'Evaporator Fan Motor (walk-in / reach-in)' },
        { id: 's_motor_shaft_bushing', es: 'Motor Shaft Bushings / Adaptadores de eje', en: 'Motor Shaft Bushings / Adapters' },
        { id: 's_motor_mounts', es: 'Motor Mounts / Mounting Brackets (universal)', en: 'Motor Mounts / Mounting Brackets (universal)' },
        { id: 's_fan_blade_cond', es: 'Fan Blade condensador (18", 20", 22", 24")', en: 'Condenser Fan Blade (18", 20", 22", 24")' },
        { id: 's_blower_wheel', es: 'Blower Wheel (verificar tamaño por modelo)', en: 'Blower Wheel (verify size per model)' },
        { id: 's_motor_run_cap', es: 'Motor run capacitors sueltos (ver sección Capacitores)', en: 'Motor run capacitors (see Capacitors section)' }
      ]
    },
    {
      id: 'stock_thermostats',
      title: { es: '🌡️ Termostatos', en: '🌡️ Thermostats' },
      items: [
        { id: 's_tstat_basic_np', es: 'Termostato no-programable (Heat/Cool)', en: 'Non-Programmable Thermostat (Heat/Cool)' },
        { id: 's_tstat_prog', es: 'Termostato programable (5-2 / 7-day)', en: 'Programmable Thermostat (5-2 / 7-day)' },
        { id: 's_tstat_wifi', es: 'Termostato WiFi (Honeywell T6 / Emerson Sensi)', en: 'WiFi Thermostat (Honeywell T6 / Emerson Sensi)' },
        { id: 's_tstat_smart', es: 'Smart Thermostat (Ecobee / Nest / Honeywell)', en: 'Smart Thermostat (Ecobee / Nest / Honeywell)' },
        { id: 's_tstat_hp', es: 'Termostato Heat Pump (con O/B reversing valve)', en: 'Heat Pump Thermostat (with O/B reversing valve)' },
        { id: 's_tstat_comm', es: 'Termostato comercial (Honeywell TB6980 / similar)', en: 'Commercial Thermostat (Honeywell TB6980 / similar)' },
        { id: 's_tstat_line_v', es: 'Termostato Line Voltage (baseboard / heater 240V)', en: 'Line Voltage Thermostat (baseboard / heater 240V)' },
        { id: 's_tstat_wire', es: 'Cable de termostato 18/5 y 18/8 (rollo)', en: 'Thermostat Wire 18/5 and 18/8 (roll)' },
        { id: 's_tstat_batteries', es: 'Baterías para termostatos (AA / AAA)', en: 'Thermostat Batteries (AA / AAA)' },
        { id: 's_tstat_wall_plate', es: 'Wall Plates / Sub-bases (Honeywell, Emerson)', en: 'Wall Plates / Sub-bases (Honeywell, Emerson)' }
      ]
    },
    {
      id: 'stock_filters',
      title: { es: '🔲 Filtros', en: '🔲 Filters' },
      items: [
        { id: 's_filter_16x20x1', es: 'Filtro 16x20x1', en: 'Filter 16x20x1' },
        { id: 's_filter_16x25x1', es: 'Filtro 16x25x1', en: 'Filter 16x25x1' },
        { id: 's_filter_20x20x1', es: 'Filtro 20x20x1', en: 'Filter 20x20x1' },
        { id: 's_filter_20x25x1', es: 'Filtro 20x25x1', en: 'Filter 20x25x1' },
        { id: 's_filter_20x25x4', es: 'Filtro 20x25x4 (media filter)', en: 'Filter 20x25x4 (media filter)' },
        { id: 's_filter_16x25x4', es: 'Filtro 16x25x4 (media filter)', en: 'Filter 16x25x4 (media filter)' },
        { id: 's_filter_20x20x4', es: 'Filtro 20x20x4 (media filter)', en: 'Filter 20x20x4 (media filter)' },
        { id: 's_filter_14x25x1', es: 'Filtro 14x25x1', en: 'Filter 14x25x1' },
        { id: 's_filter_24x24x1', es: 'Filtro 24x24x1', en: 'Filter 24x24x1' },
        { id: 's_filter_25x25x1', es: 'Filtro 25x25x1', en: 'Filter 25x25x1' },
        { id: 's_filter_bulk', es: 'Rollo de filtro / Cut-to-fit (comercial)', en: 'Filter Roll / Cut-to-fit (commercial)' },
        { id: 's_filter_drier_core', es: 'Filter Drier (core o soldable — 1/4" a 7/8")', en: 'Filter Drier (core or sweat — 1/4" to 7/8")' },
        { id: 's_filter_drier_suction', es: 'Suction Line Filter Drier (bi-flow para heat pump)', en: 'Suction Line Filter Drier (bi-flow for heat pump)' }
      ]
    },
    {
      id: 'stock_electrical',
      title: { es: '🔌 Repuestos Eléctricos', en: '🔌 Electrical Parts' },
      items: [
        { id: 's_disconnect_60a', es: 'Disconnect 60A (fusible y non-fusible)', en: 'Disconnect 60A (fused & non-fused)' },
        { id: 's_disconnect_30a', es: 'Disconnect 30A', en: 'Disconnect 30A' },
        { id: 's_fuses_15', es: 'Fusibles 15A (HACR rated)', en: 'Fuses 15A (HACR rated)' },
        { id: 's_fuses_20', es: 'Fusibles 20A', en: 'Fuses 20A' },
        { id: 's_fuses_25', es: 'Fusibles 25A', en: 'Fuses 25A' },
        { id: 's_fuses_30', es: 'Fusibles 30A', en: 'Fuses 30A' },
        { id: 's_fuses_40', es: 'Fusibles 40A', en: 'Fuses 40A' },
        { id: 's_fuses_50', es: 'Fusibles 50A', en: 'Fuses 50A' },
        { id: 's_fuses_60', es: 'Fusibles 60A', en: 'Fuses 60A' },
        { id: 's_whip_6ft', es: 'Whip / Liquidtight 6ft (1/2" y 3/4")', en: 'Whip / Liquidtight 6ft (1/2" & 3/4")' },
        { id: 's_whip_10ft', es: 'Whip / Liquidtight 10ft', en: 'Whip / Liquidtight 10ft' },
        { id: 's_wire_nuts', es: 'Wire Nuts surtidos (yellow, red, tan)', en: 'Wire Nuts assorted (yellow, red, tan)' },
        { id: 's_wire_14', es: 'Alambre THHN #14 (negro, blanco, verde)', en: 'THHN Wire #14 (black, white, green)' },
        { id: 's_wire_12', es: 'Alambre THHN #12 (negro, blanco, verde)', en: 'THHN Wire #12 (black, white, green)' },
        { id: 's_wire_10', es: 'Alambre THHN #10', en: 'THHN Wire #10' },
        { id: 's_zip_ties', es: 'Zip Ties / Cinchos (surtidos)', en: 'Zip Ties (assorted)' },
        { id: 's_elec_tape', es: 'Cinta eléctrica / Electrical Tape', en: 'Electrical Tape' },
        { id: 's_butt_splices', es: 'Butt Splices / Crimp Connectors (surtidos)', en: 'Butt Splices / Crimp Connectors (assorted)' },
        { id: 's_spade_terminals', es: 'Spade Terminals / Ring Terminals (surtidos)', en: 'Spade / Ring Terminals (assorted)' },
        { id: 's_heat_shrink', es: 'Heat Shrink Tubing (surtido)', en: 'Heat Shrink Tubing (assorted)' },
        { id: 's_contactor_tips', es: 'Juego de puntas de contactor (si aplica)', en: 'Contactor Tip Set (if applicable)' }
      ]
    },
    {
      id: 'stock_refrigerant',
      title: { es: '❄️ Refrigerantes y Aceites', en: '❄️ Refrigerants & Oils' },
      items: [
        { id: 's_r410a', es: 'R-410A (cilindro de 25 lb)', en: 'R-410A (25 lb cylinder)' },
        { id: 's_r22', es: 'R-22 (si aún hace servicio a equipos viejos)', en: 'R-22 (if still servicing old equipment)' },
        { id: 's_r404a', es: 'R-404A (comercial — walk-in coolers)', en: 'R-404A (commercial — walk-in coolers)' },
        { id: 's_r134a', es: 'R-134A (comercial — reach-in, vending)', en: 'R-134A (commercial — reach-in, vending)' },
        { id: 's_r407c', es: 'R-407C', en: 'R-407C' },
        { id: 's_r32', es: 'R-32 (mini splits nuevos / A2L)', en: 'R-32 (new mini splits / A2L)' },
        { id: 's_r454b', es: 'R-454B (reemplazo de R-410A / A2L)', en: 'R-454B (R-410A replacement / A2L)' },
        { id: 's_r290', es: 'R-290 / Propane (reach-in / dehumidifiers)', en: 'R-290 / Propane (reach-in / dehumidifiers)' },
        { id: 's_poe_oil', es: 'Aceite POE (para R-410A / R-404A)', en: 'POE Oil (for R-410A / R-404A)' },
        { id: 's_mineral_oil', es: 'Aceite mineral (para R-22)', en: 'Mineral Oil (for R-22)' },
        { id: 's_pag_oil', es: 'PAG Oil (si aplica)', en: 'PAG Oil (if applicable)' },
        { id: 's_nitrogen', es: 'Tanque de nitrógeno (lleno / nivel OK)', en: 'Nitrogen Tank (full / level OK)' }
      ]
    },
    {
      id: 'stock_controls',
      title: { es: '🎛️ Controles y Switches', en: '🎛️ Controls & Switches' },
      items: [
        { id: 's_transformer_40va', es: 'Transformador 40VA (24V)', en: 'Transformer 40VA (24V)' },
        { id: 's_transformer_75va', es: 'Transformador 75VA (24V — comercial)', en: 'Transformer 75VA (24V — commercial)' },
        { id: 's_pressure_sw_high', es: 'High Pressure Switch (auto-reset + manual)', en: 'High Pressure Switch (auto-reset + manual)' },
        { id: 's_pressure_sw_low', es: 'Low Pressure Switch (auto-reset + manual)', en: 'Low Pressure Switch (auto-reset + manual)' },
        { id: 's_pressure_sw_dual', es: 'Dual Pressure Switch (comercial)', en: 'Dual Pressure Switch (commercial)' },
        { id: 's_limit_switch', es: 'Limit Switch / Rollout Switch (universal)', en: 'Limit Switch / Rollout Switch (universal)' },
        { id: 's_flame_sensor', es: 'Flame Sensor (universal)', en: 'Flame Sensor (universal)' },
        { id: 's_igniter_hsi', es: 'Hot Surface Igniter (universal — Honeywell / White-Rodgers)', en: 'Hot Surface Igniter (universal — Honeywell / White-Rodgers)' },
        { id: 's_igniter_silicon_nitride', es: 'Silicon Nitride Igniter (universal)', en: 'Silicon Nitride Igniter (universal)' },
        { id: 's_spark_igniter', es: 'Spark Igniter / Pilot Assembly (piloto)', en: 'Spark Igniter / Pilot Assembly' },
        { id: 's_gas_valve_combo', es: 'Gas Valve (universal — Honeywell / White-Rodgers)', en: 'Gas Valve (universal — Honeywell / White-Rodgers)' },
        { id: 's_thermocouple_24', es: 'Thermocouple 24" (universal)', en: 'Thermocouple 24" (universal)' },
        { id: 's_thermocouple_30', es: 'Thermocouple 30" (universal)', en: 'Thermocouple 30" (universal)' },
        { id: 's_thermopile', es: 'Thermopile (750mV — para boilers/heaters)', en: 'Thermopile (750mV — for boilers/heaters)' },
        { id: 's_control_board', es: 'Control Board universal (ICM2801 o similar)', en: 'Universal Control Board (ICM2801 or similar)' },
        { id: 's_defrost_board', es: 'Defrost Board / Timer (heat pump)', en: 'Defrost Board / Timer (heat pump)' },
        { id: 's_reversing_valve_coil', es: 'Reversing Valve Solenoid Coil (24V)', en: 'Reversing Valve Solenoid Coil (24V)' },
        { id: 's_crankcase_heater', es: 'Crankcase Heater (universal)', en: 'Crankcase Heater (universal)' },
        { id: 's_head_pressure_ctrl', es: 'Head Pressure Control (fan cycling — comercial)', en: 'Head Pressure Control (fan cycling — commercial)' }
      ]
    },
    {
      id: 'stock_valves',
      title: { es: '🔧 Válvulas y Componentes de Refrigeración', en: '🔧 Valves & Refrigeration Components' },
      items: [
        { id: 's_txv_residential', es: 'TXV / TEV residencial (por tonelaje y refrigerante)', en: 'TXV / TEV residential (per tonnage & refrigerant)' },
        { id: 's_txv_commercial', es: 'TXV / TEV comercial (por tonelaje y refrigerante)', en: 'TXV / TEV commercial (per tonnage & refrigerant)' },
        { id: 's_cap_tube', es: 'Tubo capilar / Cap Tube (surtido de tamaños)', en: 'Capillary Tube (assorted sizes)' },
        { id: 's_check_valve', es: 'Check Valve (1/4" a 7/8")', en: 'Check Valve (1/4" to 7/8")' },
        { id: 's_solenoid_valve', es: 'Solenoid Valve (refrigeración comercial)', en: 'Solenoid Valve (commercial refrigeration)' },
        { id: 's_service_valve', es: 'Service Valve / Access Valve (1/4" braze-on)', en: 'Service Valve / Access Valve (1/4" braze-on)' },
        { id: 's_schrader_cores', es: 'Schrader Valve Cores (surtidos)', en: 'Schrader Valve Cores (assorted)' },
        { id: 's_schrader_caps', es: 'Schrader Valve Caps (plástico + bronce)', en: 'Schrader Valve Caps (plastic + brass)' },
        { id: 's_copper_couplings', es: 'Couplings de cobre (1/4" a 7/8" — surtidos)', en: 'Copper Couplings (1/4" to 7/8" — assorted)' },
        { id: 's_copper_elbows', es: 'Codos de cobre 90° (1/4" a 7/8" — surtidos)', en: 'Copper Elbows 90° (1/4" to 7/8" — assorted)' },
        { id: 's_copper_tees', es: 'Tees de cobre (surtidos)', en: 'Copper Tees (assorted)' },
        { id: 's_copper_tubing', es: 'Tubo de cobre (rolls — 1/4", 3/8", 1/2", 5/8", 3/4")', en: 'Copper Tubing (rolls — 1/4", 3/8", 1/2", 5/8", 3/4")' },
        { id: 's_insulation_tube', es: 'Aislamiento de tubo (Armaflex — 3/8" a 7/8")', en: 'Tube Insulation (Armaflex — 3/8" to 7/8")' }
      ]
    },
    {
      id: 'stock_drain_condensate',
      title: { es: '💧 Drenaje y Condensado', en: '💧 Drainage & Condensate' },
      items: [
        { id: 's_pvc_34', es: 'PVC 3/4" (tubo + codos + tees)', en: 'PVC 3/4" (pipe + elbows + tees)' },
        { id: 's_pvc_1', es: 'PVC 1" (tubo + codos + tees)', en: 'PVC 1" (pipe + elbows + tees)' },
        { id: 's_pvc_primer_glue', es: 'PVC Primer + Cement (morado + transparente)', en: 'PVC Primer + Cement (purple + clear)' },
        { id: 's_drain_pan_tabs', es: 'Tabletas de drain pan / Pan Tabs', en: 'Drain Pan Tablets / Pan Tabs' },
        { id: 's_condensate_pump', es: 'Condensate Pump (Little Giant / Diversitech)', en: 'Condensate Pump (Little Giant / Diversitech)' },
        { id: 's_float_switch', es: 'Float Switch / Safety Switch (EZ-Trap / SS1)', en: 'Float Switch / Safety Switch (EZ-Trap / SS1)' },
        { id: 's_drain_hose', es: 'Drain Hose (vinilo transparente 3/4")', en: 'Drain Hose (clear vinyl 3/4")' },
        { id: 's_p_trap', es: 'P-Trap para condensado', en: 'Condensate P-Trap' },
        { id: 's_ez_trap', es: 'EZ-Trap (todo en uno — trap + switch)', en: 'EZ-Trap (all-in-one — trap + switch)' }
      ]
    },
    {
      id: 'stock_ductwork',
      title: { es: '🌀 Ductos y Materiales de Aire', en: '🌀 Ductwork & Air Materials' },
      items: [
        { id: 's_flex_6', es: 'Flex Duct 6" (caja)', en: 'Flex Duct 6" (box)' },
        { id: 's_flex_8', es: 'Flex Duct 8" (caja)', en: 'Flex Duct 8" (box)' },
        { id: 's_flex_10', es: 'Flex Duct 10" (caja)', en: 'Flex Duct 10" (box)' },
        { id: 's_flex_12', es: 'Flex Duct 12" (caja)', en: 'Flex Duct 12" (box)' },
        { id: 's_duct_tape_foil', es: 'Foil Tape (UL 181 rated)', en: 'Foil Tape (UL 181 rated)' },
        { id: 's_mastic', es: 'Mastic / Duct Sealant', en: 'Mastic / Duct Sealant' },
        { id: 's_duct_board', es: 'Duct Board (si aplica)', en: 'Duct Board (if applicable)' },
        { id: 's_register_boot', es: 'Register Boots (surtidos)', en: 'Register Boots (assorted)' },
        { id: 's_start_collars', es: 'Start Collars (6", 8", 10", 12")', en: 'Start Collars (6", 8", 10", 12")' },
        { id: 's_duct_strap', es: 'Duct Strap / Hanger Strap (rollo)', en: 'Duct Strap / Hanger Strap (roll)' },
        { id: 's_sheet_metal_screws', es: 'Tornillos de sheet metal (zip screws, TEK screws)', en: 'Sheet Metal Screws (zip screws, TEK screws)' },
        { id: 's_dampers', es: 'Dampers manuales (6", 8", 10")', en: 'Manual Dampers (6", 8", 10")' }
      ]
    },
    {
      id: 'stock_gas_piping',
      title: { es: '🔴 Repuestos de Gas', en: '🔴 Gas Piping Parts' },
      items: [
        { id: 's_gas_flex', es: 'Gas Flex Connector (1/2" y 3/4" — surtidos)', en: 'Gas Flex Connector (1/2" & 3/4" — assorted)' },
        { id: 's_gas_valve_shutoff', es: 'Gas Shut-Off Valve (1/2" y 3/4")', en: 'Gas Shut-Off Valve (1/2" & 3/4")' },
        { id: 's_gas_nipples', es: 'Gas Nipples (negro — 1/2" y 3/4" surtidos)', en: 'Gas Nipples (black — 1/2" & 3/4" assorted)' },
        { id: 's_gas_elbows', es: 'Codos de gas (1/2" y 3/4")', en: 'Gas Elbows (1/2" & 3/4")' },
        { id: 's_gas_tees', es: 'Tees de gas (1/2" y 3/4")', en: 'Gas Tees (1/2" & 3/4")' },
        { id: 's_gas_unions', es: 'Uniones de gas (1/2" y 3/4")', en: 'Gas Unions (1/2" & 3/4")' },
        { id: 's_gas_reducer', es: 'Reducer Bushings gas (3/4" a 1/2")', en: 'Gas Reducer Bushings (3/4" to 1/2")' },
        { id: 's_gas_pipe_dope', es: 'Pipe Dope / Thread Sealant (gas rated — amarillo)', en: 'Pipe Dope / Thread Sealant (gas rated — yellow)' },
        { id: 's_gas_teflon', es: 'Teflon Tape para gas (amarillo)', en: 'Teflon Tape for Gas (yellow)' },
        { id: 's_gas_leak_solution', es: 'Solución para prueba de fugas de gas', en: 'Gas Leak Test Solution' },
        { id: 's_csst_fittings', es: 'CSST Fittings (si aplica)', en: 'CSST Fittings (if applicable)' },
        { id: 's_sediment_trap', es: 'Sediment Trap / Drip Leg (1/2" nipple + cap)', en: 'Sediment Trap / Drip Leg (1/2" nipple + cap)' }
      ]
    },
    {
      id: 'stock_hardware',
      title: { es: '🔩 Tornillería y Hardware General', en: '🔩 Fasteners & General Hardware' },
      items: [
        { id: 's_screws_sm_hex', es: 'Tornillos sheet metal 1/4" hex head (surtidos)', en: 'Sheet Metal Screws 1/4" hex head (assorted)' },
        { id: 's_screws_sm_phil', es: 'Tornillos sheet metal Phillips (surtidos)', en: 'Sheet Metal Screws Phillips (assorted)' },
        { id: 's_tek_screws', es: 'TEK Screws / Self-drilling screws', en: 'TEK Screws / Self-drilling screws' },
        { id: 's_lag_bolts', es: 'Lag Bolts (1/4" x 2", 5/16" x 3")', en: 'Lag Bolts (1/4" x 2", 5/16" x 3")' },
        { id: 's_concrete_anchors', es: 'Concrete Anchors / Tapcon screws', en: 'Concrete Anchors / Tapcon screws' },
        { id: 's_toggle_bolts', es: 'Toggle Bolts (para drywall)', en: 'Toggle Bolts (for drywall)' },
        { id: 's_threaded_rod', es: 'Threaded Rod + Nuts (3/8" — para colgar equipos)', en: 'Threaded Rod + Nuts (3/8" — for hanging equipment)' },
        { id: 's_unistrut_clamps', es: 'Unistrut Clamps / Beam Clamps (comercial)', en: 'Unistrut Clamps / Beam Clamps (commercial)' },
        { id: 's_vibration_pads', es: 'Anti-Vibration Pads / Cork Pads', en: 'Anti-Vibration Pads / Cork Pads' },
        { id: 's_hanger_straps', es: 'Hanger Straps / Pipe Straps (surtidos)', en: 'Hanger Straps / Pipe Straps (assorted)' },
        { id: 's_silicone', es: 'Silicón / Caulk (para sellar penetraciones)', en: 'Silicone / Caulk (for sealing penetrations)' },
        { id: 's_duct_putty', es: 'Duct Seal Putty / Thumb Gum', en: 'Duct Seal Putty / Thumb Gum' }
      ]
    },
    {
      id: 'stock_chemicals',
      title: { es: '🧪 Químicos y Limpiadores', en: '🧪 Chemicals & Cleaners' },
      items: [
        { id: 's_coil_cleaner_acid', es: 'Coil Cleaner ácido (condensador — exterior)', en: 'Acid Coil Cleaner (condenser — outdoor)' },
        { id: 's_coil_cleaner_alkaline', es: 'Coil Cleaner alcalino (evaporador — interior)', en: 'Alkaline Coil Cleaner (evaporator — indoor)' },
        { id: 's_coil_cleaner_no_rinse', es: 'Coil Cleaner no-rinse (evaporador)', en: 'No-Rinse Coil Cleaner (evaporator)' },
        { id: 's_contact_cleaner', es: 'Contact Cleaner / Electrical Cleaner (spray)', en: 'Contact Cleaner / Electrical Cleaner (spray)' },
        { id: 's_leak_seal', es: 'Leak Sealant (AC Leak Freeze — emergencia)', en: 'Leak Sealant (AC Leak Freeze — emergency)' },
        { id: 's_condensate_treatment', es: 'Condensate Line Treatment / Algae Tabs', en: 'Condensate Line Treatment / Algae Tabs' },
        { id: 's_rust_penetrant', es: 'Rust Penetrant / PB Blaster', en: 'Rust Penetrant / PB Blaster' },
        { id: 's_degreaser', es: 'Degreaser / Purple Power', en: 'Degreaser / Purple Power' },
        { id: 's_uv_dye', es: 'UV Dye para detección de fugas', en: 'UV Dye for leak detection' },
        { id: 's_brazing_flux', es: 'Flux / Fundente para soldadura', en: 'Brazing Flux' },
        { id: 's_heat_block_paste', es: 'Heat Block Paste (proteger componentes al soldar)', en: 'Heat Block Paste (protect components while brazing)' }
      ]
    },
    {
      id: 'stock_commercial',
      title: { es: '🏢 Repuestos Comerciales Específicos', en: '🏢 Commercial-Specific Parts' },
      items: [
        { id: 's_comm_belt_a', es: 'Belts tipo A (surtido — A26 a A68)', en: 'A-Type Belts (assorted — A26 to A68)' },
        { id: 's_comm_belt_b', es: 'Belts tipo B (surtido — comercial grande)', en: 'B-Type Belts (assorted — large commercial)' },
        { id: 's_comm_pulleys', es: 'Pulleys / Sheaves (ajustables)', en: 'Pulleys / Sheaves (adjustable)' },
        { id: 's_comm_bearings', es: 'Bearings / Pillow Block Bearings (surtidos)', en: 'Bearings / Pillow Block Bearings (assorted)' },
        { id: 's_comm_evap_fan_motor', es: 'Evaporator Fan Motor (walk-in — surtidos)', en: 'Evaporator Fan Motor (walk-in — assorted)' },
        { id: 's_comm_defrost_timer', es: 'Defrost Timer / Clock (comercial)', en: 'Defrost Timer / Clock (commercial)' },
        { id: 's_comm_defrost_heater', es: 'Defrost Heaters (walk-in — por tamaño de evaporador)', en: 'Defrost Heaters (walk-in — per evaporator size)' },
        { id: 's_comm_defrost_term', es: 'Defrost Termination Switch (bi-metal)', en: 'Defrost Termination Switch (bi-metal)' },
        { id: 's_comm_door_gasket', es: 'Walk-In Door Gasket (universal, cortar a medida)', en: 'Walk-In Door Gasket (universal, cut to size)' },
        { id: 's_comm_door_closer', es: 'Walk-In Door Closer / Hinge (spring loaded)', en: 'Walk-In Door Closer / Hinge (spring loaded)' },
        { id: 's_comm_strip_curtain', es: 'Strip Curtain para walk-in', en: 'Strip Curtain for walk-in' },
        { id: 's_comm_head_master', es: 'Head Master / Head Pressure Valve', en: 'Head Master / Head Pressure Valve' },
        { id: 's_comm_oil_trap', es: 'Oil Trap / Oil Separator (comercial)', en: 'Oil Trap / Oil Separator (commercial)' },
        { id: 's_comm_sight_glass', es: 'Sight Glass / Moisture Indicator', en: 'Sight Glass / Moisture Indicator' },
        { id: 's_comm_receiver', es: 'Liquid Receiver (si aplica)', en: 'Liquid Receiver (if applicable)' },
        { id: 's_comm_suction_accum', es: 'Suction Accumulator', en: 'Suction Accumulator' }
      ]
    },
    {
      id: 'stock_misc',
      title: { es: '📦 Misceláneos / General', en: '📦 Miscellaneous / General' },
      items: [
        { id: 's_misc_shoe_covers', es: 'Shoe Covers / Fundas para zapatos (caja)', en: 'Shoe Covers (box)' },
        { id: 's_misc_drop_cloths', es: 'Drop Cloths / Mantas protectoras', en: 'Drop Cloths / Floor Protectors' },
        { id: 's_misc_trash_bags', es: 'Bolsas de basura (heavy duty)', en: 'Trash Bags (heavy duty)' },
        { id: 's_misc_rags', es: 'Trapos / Shop Towels', en: 'Rags / Shop Towels' },
        { id: 's_misc_hand_cleaner', es: 'Limpiador de manos (Orange / GoJo)', en: 'Hand Cleaner (Orange / GoJo)' },
        { id: 's_misc_first_aid', es: 'Botiquín de primeros auxilios (restocked)', en: 'First Aid Kit (restocked)' },
        { id: 's_misc_safety_glasses', es: 'Safety Glasses extra', en: 'Extra Safety Glasses' },
        { id: 's_misc_gloves_box', es: 'Caja de guantes desechables (nitrilo)', en: 'Box of Disposable Gloves (nitrile)' },
        { id: 's_misc_labels', es: 'Etiquetas de servicio / Service Stickers', en: 'Service Labels / Service Stickers' },
        { id: 's_misc_business_cards', es: 'Tarjetas de presentación', en: 'Business Cards' },
        { id: 's_misc_invoice_forms', es: 'Facturas / Invoice Forms (si aplica)', en: 'Invoice Forms (if applicable)' },
        { id: 's_misc_magnets', es: 'Magnets / Imanes para la van (publicidad)', en: 'Vehicle Magnets (advertising)' }
      ]
    },
    // ══════════════════════════════════════════════════════
    // INSTALACIÓN — Materiales para instalación completa
    // Residencial + Comercial + Ductos
    // ══════════════════════════════════════════════════════
    {
      id: 'install_lineset',
      title: { es: '❄️ Line Set y Refrigeración', en: '❄️ Line Set & Refrigeration' },
      items: [
        { id: 'i_lineset_38_34', es: 'Line Set 3/8" x 3/4" (1.5-2.5 ton — residencial)', en: 'Line Set 3/8" x 3/4" (1.5-2.5 ton — residential)' },
        { id: 'i_lineset_38_78', es: 'Line Set 3/8" x 7/8" (3-5 ton — residencial)', en: 'Line Set 3/8" x 7/8" (3-5 ton — residential)' },
        { id: 'i_lineset_38_118', es: 'Line Set 3/8" x 1-1/8" (5+ ton — comercial)', en: 'Line Set 3/8" x 1-1/8" (5+ ton — commercial)' },
        { id: 'i_lineset_custom', es: 'Tubo de cobre suelto (roll — si line set no alcanza)', en: 'Loose Copper Tubing (roll — if line set not long enough)' },
        { id: 'i_insulation_38', es: 'Aislamiento Armaflex 3/8" (suction line)', en: 'Armaflex Insulation 3/8" (suction line)' },
        { id: 'i_insulation_34', es: 'Aislamiento Armaflex 3/4"', en: 'Armaflex Insulation 3/4"' },
        { id: 'i_insulation_78', es: 'Aislamiento Armaflex 7/8"', en: 'Armaflex Insulation 7/8"' },
        { id: 'i_insulation_118', es: 'Aislamiento Armaflex 1-1/8"', en: 'Armaflex Insulation 1-1/8"' },
        { id: 'i_insulation_tape', es: 'Cinta de aislamiento / Insulation Tape (Armaflex)', en: 'Insulation Tape (Armaflex)' },
        { id: 'i_insulation_glue', es: 'Pegamento de aislamiento / Armaflex Glue', en: 'Insulation Glue / Armaflex Glue' },
        { id: 'i_filter_drier', es: 'Filter Drier (liquid line — tamaño según tonelaje)', en: 'Filter Drier (liquid line — size per tonnage)' },
        { id: 'i_filter_drier_suction', es: 'Suction Line Filter Drier (bi-flow heat pump)', en: 'Suction Line Filter Drier (bi-flow heat pump)' },
        { id: 'i_refrigerant', es: 'Refrigerante correcto (R-410A / R-454B / R-32 — según equipo)', en: 'Correct Refrigerant (R-410A / R-454B / R-32 — per equipment)' },
        { id: 'i_nitrogen', es: 'Tanque de nitrógeno (purga + prueba de presión)', en: 'Nitrogen Tank (purge + pressure test)' },
        { id: 'i_brazing_rods', es: 'Varillas de soldadura (Silfos-15 / Silver Solder)', en: 'Brazing Rods (Silfos-15 / Silver Solder)' },
        { id: 'i_flux', es: 'Flux / Fundente', en: 'Flux' },
        { id: 'i_copper_fittings', es: 'Fittings de cobre (couplings, codos, tees — surtidos)', en: 'Copper Fittings (couplings, elbows, tees — assorted)' },
        { id: 'i_line_cover', es: 'Line Set Cover / Slim Duct Cover (si aplica — estético)', en: 'Line Set Cover / Slim Duct Cover (if applicable — aesthetic)' },
        { id: 'i_lineset_clamps', es: 'Clamps / Abrazaderas para line set', en: 'Line Set Clamps / Hangers' },
        { id: 'i_uv_rated_tape', es: 'UV Rated Tape (exterior — proteger aislamiento)', en: 'UV Rated Tape (outdoor — protect insulation)' }
      ]
    },
    {
      id: 'install_electrical',
      title: { es: '⚡ Instalación Eléctrica', en: '⚡ Electrical Installation' },
      items: [
        { id: 'i_disconnect', es: 'Disconnect (30A o 60A — según MCA del equipo)', en: 'Disconnect (30A or 60A — per equipment MCA)' },
        { id: 'i_fuses', es: 'Fusibles correctos (según MOP del equipo)', en: 'Correct Fuses (per equipment MOP)' },
        { id: 'i_whip', es: 'Whip / Liquidtight + Connectors (6ft o 10ft)', en: 'Whip / Liquidtight + Connectors (6ft or 10ft)' },
        { id: 'i_wire_10_2', es: 'Cable 10/2 NM-B (para circuito de 30A)', en: 'Wire 10/2 NM-B (for 30A circuit)' },
        { id: 'i_wire_8_2', es: 'Cable 8/2 NM-B (para circuito de 40A)', en: 'Wire 8/2 NM-B (for 40A circuit)' },
        { id: 'i_wire_6_2', es: 'Cable 6/2 NM-B (para circuito de 50-60A)', en: 'Wire 6/2 NM-B (for 50-60A circuit)' },
        { id: 'i_breaker', es: 'Breaker correcto (verificar panel y amperaje)', en: 'Correct Breaker (verify panel and amperage)' },
        { id: 'i_emt_conduit', es: 'EMT Conduit 1/2" y 3/4" (si se requiere)', en: 'EMT Conduit 1/2" & 3/4" (if required)' },
        { id: 'i_emt_fittings', es: 'EMT Fittings (connectors, couplings, straps)', en: 'EMT Fittings (connectors, couplings, straps)' },
        { id: 'i_ground_wire', es: 'Cable de tierra / Ground Wire #10 o #8', en: 'Ground Wire #10 or #8' },
        { id: 'i_ground_rod', es: 'Ground Rod + Clamp (si no hay grounding)', en: 'Ground Rod + Clamp (if no grounding exists)' },
        { id: 'i_wire_nuts', es: 'Wire Nuts (surtidos)', en: 'Wire Nuts (assorted)' },
        { id: 'i_elec_tape', es: 'Cinta eléctrica', en: 'Electrical Tape' },
        { id: 'i_zip_ties', es: 'Zip Ties (surtidos)', en: 'Zip Ties (assorted)' },
        { id: 'i_cable_staples', es: 'Cable Staples / Grapas para cable NM', en: 'Cable Staples / NM Cable Staples' },
        { id: 'i_junction_box', es: 'Junction Box + Cover (si se requiere)', en: 'Junction Box + Cover (if required)' },
        { id: 'i_tstat_wire', es: 'Cable de termostato 18/5 o 18/8 (rollo de 50-100ft)', en: 'Thermostat Wire 18/5 or 18/8 (50-100ft roll)' },
        { id: 'i_low_voltage_staples', es: 'Grapas para cable low voltage', en: 'Low Voltage Cable Staples' }
      ]
    },
    {
      id: 'install_thermostat',
      title: { es: '🌡️ Termostato e Instalación de Control', en: '🌡️ Thermostat & Control Installation' },
      items: [
        { id: 'i_tstat_unit', es: 'Termostato nuevo (modelo correcto — WiFi / Smart / básico)', en: 'New Thermostat (correct model — WiFi / Smart / basic)' },
        { id: 'i_tstat_subbase', es: 'Sub-base / Wall Plate (si aplica)', en: 'Sub-base / Wall Plate (if applicable)' },
        { id: 'i_tstat_batteries', es: 'Baterías (AA / AAA)', en: 'Batteries (AA / AAA)' },
        { id: 'i_tstat_wall_anchors', es: 'Wall Anchors + Screws para termostato', en: 'Wall Anchors + Screws for thermostat' },
        { id: 'i_tstat_patch', es: 'Patch de drywall / Wall Patch (si se mueve ubicación)', en: 'Drywall Patch / Wall Patch (if relocating)' },
        { id: 'i_tstat_label', es: 'Etiquetas para identificar cables (R, G, Y, W, C, O/B)', en: 'Wire Labels (R, G, Y, W, C, O/B)' }
      ]
    },
    {
      id: 'install_gas',
      title: { es: '🔴 Gas Piping — Instalación', en: '🔴 Gas Piping — Installation' },
      items: [
        { id: 'i_gas_pipe_black', es: 'Tubo de gas negro (1/2" y 3/4" — cortes según medida)', en: 'Black Gas Pipe (1/2" & 3/4" — cut to measure)' },
        { id: 'i_gas_flex', es: 'Gas Flex Connector (1/2" o 3/4" — largo correcto)', en: 'Gas Flex Connector (1/2" or 3/4" — correct length)' },
        { id: 'i_gas_shutoff', es: 'Gas Shut-Off Valve (1/2" o 3/4")', en: 'Gas Shut-Off Valve (1/2" or 3/4")' },
        { id: 'i_gas_nipples', es: 'Gas Nipples negro (surtido — close, 2", 4", 6")', en: 'Black Gas Nipples (assorted — close, 2", 4", 6")' },
        { id: 'i_gas_fittings', es: 'Gas Fittings (codos, tees, uniones, reducers)', en: 'Gas Fittings (elbows, tees, unions, reducers)' },
        { id: 'i_gas_sediment', es: 'Sediment Trap / Drip Leg (nipple + cap)', en: 'Sediment Trap / Drip Leg (nipple + cap)' },
        { id: 'i_gas_pipe_dope', es: 'Pipe Dope / Thread Sealant (amarillo — gas rated)', en: 'Pipe Dope / Thread Sealant (yellow — gas rated)' },
        { id: 'i_gas_teflon', es: 'Teflon amarillo para gas', en: 'Yellow Teflon for Gas' },
        { id: 'i_gas_leak_solution', es: 'Solución de prueba de fugas de gas', en: 'Gas Leak Test Solution' },
        { id: 'i_csst', es: 'CSST / Gastite + Fittings (si aplica)', en: 'CSST / Gastite + Fittings (if applicable)' },
        { id: 'i_gas_support', es: 'Soportes / Pipe Hangers para gas line', en: 'Gas Pipe Supports / Hangers' }
      ]
    },
    {
      id: 'install_condensate',
      title: { es: '💧 Drenaje y Condensado — Instalación', en: '💧 Drainage & Condensate — Installation' },
      items: [
        { id: 'i_pvc_34', es: 'PVC 3/4" (tubo — 10ft sticks)', en: 'PVC 3/4" (pipe — 10ft sticks)' },
        { id: 'i_pvc_1', es: 'PVC 1" (tubo — comercial)', en: 'PVC 1" (pipe — commercial)' },
        { id: 'i_pvc_fittings', es: 'PVC Fittings (codos, tees, couplings, traps)', en: 'PVC Fittings (elbows, tees, couplings, traps)' },
        { id: 'i_pvc_primer', es: 'PVC Primer + Cement (morado + transparente)', en: 'PVC Primer + Cement (purple + clear)' },
        { id: 'i_condensate_pump', es: 'Condensate Pump (si no hay gravedad — Little Giant)', en: 'Condensate Pump (if no gravity drain — Little Giant)' },
        { id: 'i_float_switch', es: 'Float Switch / Safety Switch (EZ-Trap / SS1)', en: 'Float Switch / Safety Switch (EZ-Trap / SS1)' },
        { id: 'i_drain_pan', es: 'Secondary Drain Pan (código en attics)', en: 'Secondary Drain Pan (code in attics)' },
        { id: 'i_drain_pan_tabs', es: 'Drain Pan Tablets / Pan Tabs', en: 'Drain Pan Tablets / Pan Tabs' },
        { id: 'i_vinyl_hose', es: 'Vinyl Hose 3/4" (para drenaje exterior)', en: 'Vinyl Hose 3/4" (for exterior drain)' },
        { id: 'i_p_trap', es: 'P-Trap para condensado', en: 'Condensate P-Trap' },
        { id: 'i_pipe_hangers', es: 'Pipe Hangers / Clamps para PVC', en: 'Pipe Hangers / Clamps for PVC' }
      ]
    },
    {
      id: 'install_mounting',
      title: { es: '🏗️ Montaje y Estructura', en: '🏗️ Mounting & Structure' },
      items: [
        { id: 'i_condenser_pad', es: 'Condenser Pad (plástico o concreto)', en: 'Condenser Pad (plastic or concrete)' },
        { id: 'i_condenser_stand', es: 'Condenser Stand / Risers (si aplica — zonas de nieve)', en: 'Condenser Stand / Risers (if applicable — snow areas)' },
        { id: 'i_wall_brackets', es: 'Wall Brackets (mini split — si aplica)', en: 'Wall Brackets (mini split — if applicable)' },
        { id: 'i_rooftop_stand', es: 'Rooftop Stand / Curb (comercial — RTU)', en: 'Rooftop Stand / Curb (commercial — RTU)' },
        { id: 'i_vibration_pads', es: 'Anti-Vibration Pads / Rubber Isolation Pads', en: 'Anti-Vibration Pads / Rubber Isolation Pads' },
        { id: 'i_unistrut', es: 'Unistrut + Clamps (comercial — soporte)', en: 'Unistrut + Clamps (commercial — support)' },
        { id: 'i_threaded_rod', es: 'Threaded Rod 3/8" + Nuts + Washers (colgar equipos)', en: 'Threaded Rod 3/8" + Nuts + Washers (hang equipment)' },
        { id: 'i_concrete_anchors', es: 'Concrete Anchors / Tapcon Screws', en: 'Concrete Anchors / Tapcon Screws' },
        { id: 'i_lag_bolts', es: 'Lag Bolts (para bases de madera)', en: 'Lag Bolts (for wood bases)' },
        { id: 'i_seismic_bracket', es: 'Seismic Brackets (si código lo requiere)', en: 'Seismic Brackets (if code requires)' },
        { id: 'i_lineset_wall_sleeve', es: 'Wall Sleeve / Line Set Sleeve (para penetración de pared)', en: 'Wall Sleeve / Line Set Sleeve (for wall penetration)' },
        { id: 'i_sealant_exterior', es: 'Sellador exterior / Weatherproof Sealant (penetraciones)', en: 'Exterior Sealant / Weatherproof Sealant (penetrations)' }
      ]
    },
    {
      id: 'install_ductwork_materials',
      title: { es: '🌀 Materiales de Ductos — Residencial', en: '🌀 Ductwork Materials — Residential' },
      items: [
        { id: 'i_flex_6', es: 'Flex Duct 6" (cajas — verificar cantidad)', en: 'Flex Duct 6" (boxes — verify quantity)' },
        { id: 'i_flex_7', es: 'Flex Duct 7"', en: 'Flex Duct 7"' },
        { id: 'i_flex_8', es: 'Flex Duct 8"', en: 'Flex Duct 8"' },
        { id: 'i_flex_10', es: 'Flex Duct 10"', en: 'Flex Duct 10"' },
        { id: 'i_flex_12', es: 'Flex Duct 12"', en: 'Flex Duct 12"' },
        { id: 'i_flex_14', es: 'Flex Duct 14" (return / comercial)', en: 'Flex Duct 14" (return / commercial)' },
        { id: 'i_start_collars', es: 'Start Collars (6", 7", 8", 10", 12" — según diseño)', en: 'Start Collars (6", 7", 8", 10", 12" — per design)' },
        { id: 'i_register_boots', es: 'Register Boots (surtidos — 6x10, 6x12, 8x10, etc.)', en: 'Register Boots (assorted — 6x10, 6x12, 8x10, etc.)' },
        { id: 'i_supply_plenum', es: 'Supply Plenum (fabricar o prefab — según equipo)', en: 'Supply Plenum (fabricate or prefab — per equipment)' },
        { id: 'i_return_plenum', es: 'Return Plenum / Return Box', en: 'Return Plenum / Return Box' },
        { id: 'i_return_grille', es: 'Return Air Grille (tamaño según CFM)', en: 'Return Air Grille (size per CFM)' },
        { id: 'i_supply_registers', es: 'Supply Registers / Grilles (surtidos — según habitaciones)', en: 'Supply Registers / Grilles (assorted — per rooms)' },
        { id: 'i_duct_transitions', es: 'Transitions / Reducers (sheet metal)', en: 'Transitions / Reducers (sheet metal)' },
        { id: 'i_duct_elbows', es: 'Duct Elbows (sheet metal — surtidos)', en: 'Duct Elbows (sheet metal — assorted)' },
        { id: 'i_foil_tape', es: 'Foil Tape UL 181 (rollos)', en: 'Foil Tape UL 181 (rolls)' },
        { id: 'i_mastic', es: 'Mastic / Duct Sealant (galón)', en: 'Mastic / Duct Sealant (gallon)' },
        { id: 'i_duct_strap', es: 'Duct Strap / Hanger Strap (rollos)', en: 'Duct Strap / Hanger Strap (rolls)' },
        { id: 'i_zip_screws', es: 'Zip Screws / TEK Screws (libras)', en: 'Zip Screws / TEK Screws (pounds)' },
        { id: 'i_duct_board', es: 'Duct Board (R-4.2 o R-6 — si se fabrica ducto)', en: 'Duct Board (R-4.2 or R-6 — if fabricating duct)' },
        { id: 'i_dampers', es: 'Dampers manuales (balanceo de aire)', en: 'Manual Dampers (air balancing)' },
        { id: 'i_filter_grille', es: 'Filter Grille / Return con filtro integrado', en: 'Filter Grille / Return with integrated filter' },
        { id: 'i_filter_install', es: 'Filtro nuevo (tamaño correcto para equipo nuevo)', en: 'New Filter (correct size for new equipment)' }
      ]
    },
    {
      id: 'install_ductwork_commercial',
      title: { es: '🏢 Ductos — Comercial / Sheet Metal', en: '🏢 Ductwork — Commercial / Sheet Metal' },
      items: [
        { id: 'i_sm_gauge_26', es: 'Sheet Metal 26 gauge (para ducto residencial/comercial ligero)', en: 'Sheet Metal 26 gauge (for residential/light commercial duct)' },
        { id: 'i_sm_gauge_24', es: 'Sheet Metal 24 gauge (para ducto comercial)', en: 'Sheet Metal 24 gauge (for commercial duct)' },
        { id: 'i_sm_gauge_22', es: 'Sheet Metal 22 gauge (comercial pesado)', en: 'Sheet Metal 22 gauge (heavy commercial)' },
        { id: 'i_sm_drive_cleats', es: 'Drive Cleats (1" — para unir secciones)', en: 'Drive Cleats (1" — for joining sections)' },
        { id: 'i_sm_s_cleats', es: 'S-Cleats (para unir ducto rectangular)', en: 'S-Cleats (for joining rectangular duct)' },
        { id: 'i_sm_standing_s', es: 'Standing S / Pittsburgh Lock (si aplica)', en: 'Standing S / Pittsburgh Lock (if applicable)' },
        { id: 'i_sm_corners', es: 'Duct Corners / L-Angles', en: 'Duct Corners / L-Angles' },
        { id: 'i_sm_turning_vanes', es: 'Turning Vanes (para codos rectangulares)', en: 'Turning Vanes (for rectangular elbows)' },
        { id: 'i_sm_round_pipe', es: 'Round Pipe (spiral — 6" a 14")', en: 'Round Pipe (spiral — 6" to 14")' },
        { id: 'i_sm_round_fittings', es: 'Round Fittings (codos, tees, reducers, wyes)', en: 'Round Fittings (elbows, tees, reducers, wyes)' },
        { id: 'i_sm_flex_connector', es: 'Flexible Connector (canvas — vibration isolation)', en: 'Flexible Connector (canvas — vibration isolation)' },
        { id: 'i_sm_fire_damper', es: 'Fire Damper (si código lo requiere)', en: 'Fire Damper (if code requires)' },
        { id: 'i_sm_access_door', es: 'Access Door / Panel de acceso para ducto', en: 'Access Door / Duct Access Panel' },
        { id: 'i_sm_insulation_wrap', es: 'Duct Insulation Wrap (R-6 o R-8 — exterior)', en: 'Duct Insulation Wrap (R-6 or R-8 — exterior)' },
        { id: 'i_sm_duct_liner', es: 'Duct Liner (interior — acústico y térmico)', en: 'Duct Liner (interior — acoustic & thermal)' },
        { id: 'i_sm_pop_rivets', es: 'Pop Rivets (libras — para sheet metal)', en: 'Pop Rivets (pounds — for sheet metal)' },
        { id: 'i_sm_hangers', es: 'Duct Hangers / Trapeze Hangers (threaded rod + angle iron)', en: 'Duct Hangers / Trapeze Hangers (threaded rod + angle iron)' }
      ]
    },
    {
      id: 'install_sealing',
      title: { es: '🔒 Sellado y Acabado', en: '🔒 Sealing & Finishing' },
      items: [
        { id: 'i_seal_penetrations', es: 'Sellador para penetraciones de pared / techo', en: 'Wall / Roof Penetration Sealant' },
        { id: 'i_seal_firestop', es: 'Firestop Caulk (penetraciones en fire-rated walls)', en: 'Firestop Caulk (penetrations in fire-rated walls)' },
        { id: 'i_seal_foam', es: 'Spray Foam (Great Stuff — para sellar huecos)', en: 'Spray Foam (Great Stuff — for sealing gaps)' },
        { id: 'i_seal_silicone', es: 'Silicón exterior (para base de condensador y penetraciones)', en: 'Exterior Silicone (for condenser base and penetrations)' },
        { id: 'i_seal_duct_putty', es: 'Duct Seal Putty (penetraciones eléctricas)', en: 'Duct Seal Putty (electrical penetrations)' },
        { id: 'i_seal_flashing', es: 'Flashing / Roof Jack (si penetra el techo)', en: 'Flashing / Roof Jack (if penetrating roof)' },
        { id: 'i_seal_escutcheon', es: 'Escutcheon Plates / Cover Plates (estético)', en: 'Escutcheon Plates / Cover Plates (aesthetic)' },
        { id: 'i_seal_touch_up', es: 'Pintura touch-up / Wall Patch (reparar drywall)', en: 'Touch-up Paint / Wall Patch (repair drywall)' }
      ]
    },
    {
      id: 'install_startup',
      title: { es: '🚀 Startup y Commissioning', en: '🚀 Startup & Commissioning' },
      items: [
        { id: 'i_start_manual', es: 'Manual de instalación del equipo (impreso o digital)', en: 'Equipment Installation Manual (printed or digital)' },
        { id: 'i_start_wiring_diag', es: 'Diagrama de cableado del equipo', en: 'Equipment Wiring Diagram' },
        { id: 'i_start_charge_chart', es: 'Charging Chart / Tabla de carga (SH / SC / factory charge)', en: 'Charging Chart (SH / SC / factory charge)' },
        { id: 'i_start_permits', es: 'Permisos y papelería para inspección', en: 'Permits and inspection paperwork' },
        { id: 'i_start_stickers', es: 'Stickers de servicio / Etiquetas de instalación', en: 'Service Stickers / Installation Labels' },
        { id: 'i_start_co_detect', es: 'CO Detector personal (para gas / calefacción)', en: 'Personal CO Detector (for gas / heating)' },
        { id: 'i_start_combustion', es: 'Analizador de combustión (si aplica — gas furnace)', en: 'Combustion Analyzer (if applicable — gas furnace)' },
        { id: 'i_start_warranty', es: 'Formularios de garantía / Warranty Registration', en: 'Warranty Registration Forms' },
        { id: 'i_start_customer_info', es: 'Información para el cliente (manual, filtros, mantenimiento)', en: 'Customer Information (manual, filters, maintenance)' },
        { id: 'i_start_photos', es: 'Tomar fotos del antes y después (documentación)', en: 'Take before/after photos (documentation)' }
      ]
    },
    {
      id: 'install_removal',
      title: { es: '🗑️ Remoción de Equipo Viejo', en: '🗑️ Old Equipment Removal' },
      items: [
        { id: 'i_rem_recovery', es: 'Recovery Machine lista (recuperar refrigerante antes)', en: 'Recovery Machine ready (recover refrigerant first)' },
        { id: 'i_rem_recovery_tank', es: 'Tanque de recuperación (con espacio)', en: 'Recovery Tank (with space)' },
        { id: 'i_rem_epa_log', es: 'EPA Refrigerant Log / Bitácora de recuperación', en: 'EPA Refrigerant Log / Recovery Log' },
        { id: 'i_rem_dolly', es: 'Dolly / Diablito para mover equipo pesado', en: 'Dolly / Hand Truck for moving heavy equipment' },
        { id: 'i_rem_straps', es: 'Ratchet Straps / Cintas para asegurar equipo', en: 'Ratchet Straps for securing equipment' },
        { id: 'i_rem_trash_bags', es: 'Bolsas de basura heavy duty', en: 'Heavy Duty Trash Bags' },
        { id: 'i_rem_drop_cloths', es: 'Mantas protectoras / Drop Cloths', en: 'Drop Cloths / Floor Protection' },
        { id: 'i_rem_disposal', es: 'Plan de disposición (dump, reciclaje, scrap yard)', en: 'Disposal Plan (dump, recycling, scrap yard)' }
      ]
    },
    {
      id: 'install_minisplit',
      title: { es: '🧊 Mini Split — Materiales Específicos', en: '🧊 Mini Split — Specific Materials' },
      items: [
        { id: 'i_ms_mounting_plate', es: 'Mounting Plate / Back Plate (indoor unit)', en: 'Mounting Plate / Back Plate (indoor unit)' },
        { id: 'i_ms_wall_bracket', es: 'Wall Bracket condensador (si no va en piso)', en: 'Wall Bracket condenser (if not on ground)' },
        { id: 'i_ms_line_cover', es: 'Line Set Cover / Decorative Cover (Slim Duct)', en: 'Line Set Cover / Decorative Cover (Slim Duct)' },
        { id: 'i_ms_hole_saw', es: 'Hole Saw 3" (para penetración de pared)', en: 'Hole Saw 3" (for wall penetration)' },
        { id: 'i_ms_wall_sleeve', es: 'Wall Sleeve / Grommet', en: 'Wall Sleeve / Grommet' },
        { id: 'i_ms_putty', es: 'Putty Seal / Sealing Putty (para sellar agujero)', en: 'Putty Seal / Sealing Putty (for sealing hole)' },
        { id: 'i_ms_drain_hose', es: 'Drain Hose para indoor unit', en: 'Drain Hose for indoor unit' },
        { id: 'i_ms_communication', es: 'Cable de comunicación (14/4 o según modelo)', en: 'Communication Wire (14/4 or per model)' },
        { id: 'i_ms_flare_nuts', es: 'Flare Nuts (si no vienen con el line set)', en: 'Flare Nuts (if not included with line set)' },
        { id: 'i_ms_torque_wrench', es: 'Torque Wrench para conexiones flare (verificar specs)', en: 'Torque Wrench for flare connections (verify specs)' },
        { id: 'i_ms_multi_head', es: 'Branch Box / Distributor (multi-zone — si aplica)', en: 'Branch Box / Distributor (multi-zone — if applicable)' }
      ]
    }
  ];

  // State
  var _checkStates = {}; // { itemId: 'pass' | 'fail' | null }
  var _isDriver = true;
  var _checklistDate = new Date().toISOString().split('T')[0];

  function _lang() {
    return (typeof window._lang !== 'undefined' && window._lang === 'en') ? 'en' : 'es';
  }

  function _t(obj) {
    return obj[_lang()] || obj.es;
  }

  // Tool-only section IDs (all sections that start with 'tools_')
  var TOOL_SECTION_IDS = [];
  for (var _s = 0; _s < CHECKLIST_SECTIONS.length; _s++) {
    if (CHECKLIST_SECTIONS[_s].id.indexOf('tools_') === 0) TOOL_SECTION_IDS.push(CHECKLIST_SECTIONS[_s].id);
  }

  // Pre-departure section IDs (everything that is NOT a tool section)
  var PRE_DEPARTURE_IDS = [];
  for (var _p = 0; _p < CHECKLIST_SECTIONS.length; _p++) {
    if (CHECKLIST_SECTIONS[_p].id.indexOf('tools_') !== 0) PRE_DEPARTURE_IDS.push(CHECKLIST_SECTIONS[_p].id);
  }

  // Current mode: 'full' | 'tools' | 'onsite' | 'stock' | 'install'
  var _currentMode = 'full';
  var _activeSections = CHECKLIST_SECTIONS;

  // ── Render ─────────────────────────────────────────────────────
  window.initPreDepartureChecklist = function(mode) {
    var screen = document.getElementById('preDepartureScreen');
    if (!screen) return;

    // Set mode from parameter
    if (mode === 'tools' || mode === 'onsite' || mode === 'full' || mode === 'stock' || mode === 'install') _currentMode = mode;
    // else keep current mode (for re-renders from _pdcMark)

    // Also check global flags
    if (window._pdcToolsOnly) {
      _currentMode = 'tools';
      window._pdcToolsOnly = false;
    }
    if (window._pdcOnsiteMode) {
      _currentMode = 'onsite';
      window._pdcOnsiteMode = false;
    }
    if (window._pdcStockMode) {
      _currentMode = 'stock';
      window._pdcStockMode = false;
    }
    if (window._pdcInstallMode) {
      _currentMode = 'install';
      window._pdcInstallMode = false;
    }

    var lang = _lang();
    var isEN = lang === 'en';

    // Reset state for today
    _checkStates = {};
    _checklistDate = new Date().toISOString().split('T')[0];

    // Load saved state from localStorage
    _loadLocalState();

    // Filter sections based on mode
    _activeSections = CHECKLIST_SECTIONS.filter(function(sec) {
      if (_currentMode === 'tools') return sec.id.indexOf('tools_') === 0;
      if (_currentMode === 'onsite') return sec.id.indexOf('onsite_') === 0;
      if (_currentMode === 'stock') return sec.id.indexOf('stock_') === 0;
      if (_currentMode === 'install') return sec.id.indexOf('install_') === 0;
      return true; // full mode — everything
    });

    var html = '';

    // Header
    html += '<div style="padding:20px 16px 0;max-width:600px;margin:0 auto;">';
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">';
    html += '<div onclick="showScreen(\'dashboardScreen\')" style="width:36px;height:36px;border-radius:10px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></div>';
    html += '<div style="flex:1;">';
    if (_currentMode === 'tools') {
      html += '<h2 style="color:#111827;font-size:18px;font-weight:800;margin:0;">' + _ti('pdc_title_tools', 'Herramientas de Mano y Eléctricas') + '</h2>';
      html += '<div style="color:#6b7280;font-size:12px;margin-top:2px;">' + _ti('pdc_sub_tools', 'Inventario · PASS o FAIL') + '</div>';
    } else if (_currentMode === 'onsite') {
      html += '<h2 style="color:#111827;font-size:18px;font-weight:800;margin:0;">' + _ti('pdc_title_onsite', 'Antes de Iniciar') + '</h2>';
      html += '<div style="color:#6b7280;font-size:12px;margin-top:2px;">' + _ti('pdc_sub_onsite', 'Checklist en Sitio · Residencial') + '</div>';
    } else if (_currentMode === 'stock') {
      html += '<h2 style="color:#111827;font-size:18px;font-weight:800;margin:0;">' + _ti('pdc_title_stock', 'Stock Truck — Repuestos de Servicio') + '</h2>';
      html += '<div style="color:#6b7280;font-size:12px;margin-top:2px;">' + _ti('pdc_sub_stock', 'Residencial y Comercial · Verificar Inventario') + '</div>';
    } else if (_currentMode === 'install') {
      html += '<h2 style="color:#111827;font-size:18px;font-weight:800;margin:0;">' + _ti('pdc_title_install', 'Materiales de Instalación') + '</h2>';
      html += '<div style="color:#6b7280;font-size:12px;margin-top:2px;">' + _ti('pdc_sub_install', 'Residencial y Comercial · Instalación Completa') + '</div>';
    } else {
      html += '<h2 style="color:#111827;font-size:18px;font-weight:800;margin:0;">' + _ti('pdc_title_full', 'Antes de Salir a Trabajar') + '</h2>';
      html += '<div style="color:#6b7280;font-size:12px;margin-top:2px;">' + _ti('pdc_sub_full', 'Revisa y Marca · PASS o FAIL') + '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Date display
    var today = new Date();
    var dateStr = today.toLocaleDateString(isEN ? 'en-US' : 'es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    html += '<div style="text-align:center;padding:10px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;margin-bottom:16px;">';
    html += '<div style="font-size:13px;color:#374151;font-weight:600;">📅 ' + dateStr + '</div>';
    html += '</div>';

    // Driver / Passenger toggle — only show in full mode
    if (_currentMode === 'full') {
    html += '<div style="display:flex;gap:8px;margin-bottom:20px;">';
    html += '<button id="pdcDriverBtn" onclick="window._pdcSetRole(true)" style="flex:1;padding:12px;border-radius:12px;border:2px solid ' + (_isDriver ? '#3b82f6' : '#d1d5db') + ';background:' + (_isDriver ? 'rgba(59,130,246,0.08)' : '#FFFFFF') + ';color:' + (_isDriver ? '#1e40af' : '#6b7280') + ';font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;">';
    html += '🚐 ' + _ti('pdc_driver', 'Conductor');
    html += '</button>';
    html += '<button id="pdcPassengerBtn" onclick="window._pdcSetRole(false)" style="flex:1;padding:12px;border-radius:12px;border:2px solid ' + (!_isDriver ? '#f59e0b' : '#d1d5db') + ';background:' + (!_isDriver ? 'rgba(245,158,11,0.08)' : '#FFFFFF') + ';color:' + (!_isDriver ? '#92400e' : '#6b7280') + ';font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;">';
    html += '👤 ' + _ti('pdc_passenger', 'Pasajero');
    html += '</button>';
    html += '</div>';
    }

    if (!_isDriver && _currentMode === 'full') {
      html += '<div style="padding:12px 16px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.3);border-radius:12px;margin-bottom:16px;font-size:13px;color:#92400e;font-weight:600;text-align:center;">';
      html += '👤 ' + _ti('pdc_passenger_note', 'Modo pasajero — solo haz Check In cuando llegues al trabajo');
      html += '</div>';
    }

    // Equipment info panel — install mode only
    if (_currentMode === 'install') {
      var eqModel = '';
      var eqSerial = '';
      var eqTonnage = '';
      var eqType = '';
      var eqNotes = '';
      try {
        var eqData = JSON.parse(localStorage.getItem('pdc_equip_' + _checklistDate) || '{}');
        eqModel = eqData.model || '';
        eqSerial = eqData.serial || '';
        eqTonnage = eqData.tonnage || '';
        eqType = eqData.type || '';
        eqNotes = eqData.notes || '';
      } catch(e) {}

      var inputStyle = 'width:100%;padding:10px 12px;border-radius:10px;border:1.5px solid #d1d5db;background:#FFFFFF;color:#111827;font-size:14px;font-weight:600;font-family:inherit;outline:none;';
      var labelStyle = 'font-size:11px;font-weight:700;color:#6b7280;margin-bottom:4px;display:block;';
      html += '<div style="padding:16px;background:linear-gradient(135deg,rgba(14,165,233,0.08),rgba(59,130,246,0.05));border:1.5px solid rgba(14,165,233,0.25);border-radius:14px;margin-bottom:20px;">';
      html += '<div style="font-size:15px;font-weight:800;color:#0369a1;margin-bottom:14px;display:flex;align-items:center;gap:8px;">🏭 ' + _ti('pdc_equipment_header', 'Equipo a Instalar') + '</div>';

      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">';
      html += '<div><label style="' + labelStyle + '">' + _ti('pdc_model_number', 'Número de Modelo') + '</label>';
      html += '<input id="pdcEqModel" type="text" placeholder="' + _ti('pdc_model_ph', 'ej. GSX140361') + '" value="' + eqModel.replace(/"/g, '&quot;') + '" oninput="window._pdcSaveEquip()" style="' + inputStyle + '" /></div>';
      html += '<div><label style="' + labelStyle + '">' + _ti('pdc_serial_number', 'Número de Serie') + '</label>';
      html += '<input id="pdcEqSerial" type="text" placeholder="' + _ti('pdc_serial_ph', 'ej. 1234567890') + '" value="' + eqSerial.replace(/"/g, '&quot;') + '" oninput="window._pdcSaveEquip()" style="' + inputStyle + '" /></div>';
      html += '</div>';

      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">';
      html += '<div><label style="' + labelStyle + '">' + _ti('pdc_tonnage', 'Tonelaje / BTU') + '</label>';
      html += '<input id="pdcEqTonnage" type="text" placeholder="' + _ti('pdc_tonnage_ph', 'ej. 3 Ton / 36,000 BTU') + '" value="' + eqTonnage.replace(/"/g, '&quot;') + '" oninput="window._pdcSaveEquip()" style="' + inputStyle + '" /></div>';
      html += '<div><label style="' + labelStyle + '">' + _ti('pdc_type', 'Tipo de Equipo') + '</label>';
      html += '<select id="pdcEqType" onchange="window._pdcSaveEquip()" style="' + inputStyle + 'appearance:auto;">';
      var eqTypes = [
        { v: '', es: '— Seleccionar —', en: '— Select —' },
        { v: 'split_ac', es: 'Split System A/C', en: 'Split System A/C' },
        { v: 'split_hp', es: 'Split System Heat Pump', en: 'Split System Heat Pump' },
        { v: 'package_unit', es: 'Package Unit', en: 'Package Unit' },
        { v: 'gas_furnace', es: 'Gas Furnace', en: 'Gas Furnace' },
        { v: 'mini_split', es: 'Mini Split / Ductless', en: 'Mini Split / Ductless' },
        { v: 'mini_split_multi', es: 'Mini Split Multi-Zone', en: 'Mini Split Multi-Zone' },
        { v: 'rtu', es: 'RTU (Rooftop Unit) — Comercial', en: 'RTU (Rooftop Unit) — Commercial' },
        { v: 'walkin', es: 'Walk-In Cooler / Freezer', en: 'Walk-In Cooler / Freezer' },
        { v: 'reachin', es: 'Reach-In / Display Case', en: 'Reach-In / Display Case' },
        { v: 'boiler', es: 'Boiler / Caldera', en: 'Boiler' },
        { v: 'air_handler', es: 'Air Handler Only', en: 'Air Handler Only' },
        { v: 'condenser_only', es: 'Condensador Only', en: 'Condenser Only' }
      ];
      for (var _eq = 0; _eq < eqTypes.length; _eq++) {
        html += '<option value="' + eqTypes[_eq].v + '"' + (eqType === eqTypes[_eq].v ? ' selected' : '') + '>' + (isEN ? eqTypes[_eq].en : eqTypes[_eq].es) + '</option>';
      }
      html += '</select></div>';
      html += '</div>';

      html += '<div><label style="' + labelStyle + '">' + _ti('pdc_notes_label', 'Notas / Detalles del Trabajo') + '</label>';
      html += '<textarea id="pdcEqNotes" rows="2" placeholder="' + _ti('pdc_notes_ph', 'Dirección, instrucciones especiales...') + '" oninput="window._pdcSaveEquip()" style="' + inputStyle + 'resize:vertical;">' + eqNotes.replace(/</g, '&lt;') + '</textarea></div>';

      html += '</div>';
    }

    // Progress bar
    var totalItems = 0;
    var checkedItems = 0;
    _activeSections.forEach(function(sec) {
      if (sec.driverOnly && !_isDriver) return;
      sec.items.forEach(function(item) {
        totalItems++;
        if (_checkStates[item.id]) checkedItems++;
      });
    });
    var pct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    var barColor = pct === 100 ? '#22c55e' : pct > 50 ? '#f59e0b' : '#ef4444';

    html += '<div style="margin-bottom:20px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html += '<span style="font-size:13px;font-weight:700;color:#6b7280;">' + _ti('pdc_progress', 'Progreso') + '</span>';
    html += '<span style="font-size:13px;font-weight:800;color:' + barColor + ';">' + checkedItems + '/' + totalItems + ' (' + pct + '%)</span>';
    html += '</div>';
    html += '<div style="width:100%;height:8px;background:#e5e7eb;border-radius:8px;overflow:hidden;">';
    html += '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:8px;transition:width 0.3s;"></div>';
    html += '</div>';
    html += '</div>';

    // Sections
    _activeSections.forEach(function(sec) {
      if (sec.driverOnly && !_isDriver) return;

      html += '<div style="margin-bottom:16px;">';
      html += '<div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:10px;padding:10px 14px;background:#f9fafb;border-radius:10px;border-left:3px solid #3b82f6;">' + _t(sec.title) + '</div>';

      sec.items.forEach(function(item) {
        var state = _checkStates[item.id] || null;
        var passActive = state === 'pass';
        var failActive = state === 'fail';

        html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:4px;background:' + (failActive ? 'rgba(239,68,68,0.04)' : passActive ? 'rgba(34,197,94,0.04)' : '#FFFFFF') + ';border-radius:10px;border:1px solid ' + (failActive ? 'rgba(239,68,68,0.3)' : passActive ? 'rgba(34,197,94,0.2)' : '#e5e7eb') + ';">';

        // Item label
        html += '<div style="flex:1;font-size:13px;color:' + (failActive ? '#991b1b' : passActive ? '#166534' : '#374151') + ';font-weight:600;line-height:1.4;">' + _t(item) + '</div>';

        // PASS button
        html += '<button onclick="window._pdcMark(\'' + item.id + '\',\'pass\')" style="min-width:52px;padding:6px 10px;border-radius:8px;border:1.5px solid ' + (passActive ? '#22c55e' : '#d1d5db') + ';background:' + (passActive ? 'rgba(34,197,94,0.1)' : '#FFFFFF') + ';color:' + (passActive ? '#166534' : '#6b7280') + ';font-size:11px;font-weight:800;cursor:pointer;transition:all 0.15s;">✓ PASS</button>';

        // FAIL button
        html += '<button onclick="window._pdcMark(\'' + item.id + '\',\'fail\')" style="min-width:52px;padding:6px 10px;border-radius:8px;border:1.5px solid ' + (failActive ? '#ef4444' : '#d1d5db') + ';background:' + (failActive ? 'rgba(239,68,68,0.1)' : '#FFFFFF') + ';color:' + (failActive ? '#991b1b' : '#6b7280') + ';font-size:11px;font-weight:800;cursor:pointer;transition:all 0.15s;">✗ FAIL</button>';

        html += '</div>';
      });

      html += '</div>';
    });

    // Submit button
    html += '<div style="margin-top:10px;margin-bottom:40px;">';
    if (pct === 100) {
      html += '<button onclick="window._pdcSubmit()" style="width:100%;padding:16px;border-radius:14px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(34,197,94,0.4);letter-spacing:0.5px;">';
      html += '✅ ' + _ti('pdc_submit_btn', '¡Enviar Checklist — Listo para Trabajar!');
      html += '</button>';
    } else {
      html += '<div style="padding:14px;border-radius:14px;background:#f9fafb;border:1px solid #e5e7eb;text-align:center;color:#57574F;font-size:13px;font-weight:600;">';
      html += _ti('pdc_complete_all', 'Completa todos los items para enviar');
      html += '</div>';
    }
    html += '</div>';

    // History link
    html += '<div style="text-align:center;margin-bottom:60px;">';
    html += '<button onclick="window._pdcShowHistory()" style="background:#FFFFFF;border:1px solid #d1d5db;border-radius:10px;padding:10px 20px;color:#6b7280;font-size:12px;font-weight:600;cursor:pointer;">';
    html += '📊 ' + _ti('pdc_view_history', 'Ver Mi Historial');
    html += '</button>';
    html += '</div>';

    html += '</div>';

    screen.innerHTML = html;
  };

  // ── Mark item ──────────────────────────────────────────────────
  window._pdcMark = function(itemId, state) {
    if (_checkStates[itemId] === state) {
      _checkStates[itemId] = null; // toggle off
    } else {
      _checkStates[itemId] = state;
    }
    _saveLocalState();
    initPreDepartureChecklist(); // re-render
  };

  // ── Role toggle ────────────────────────────────────────────────
  window._pdcSetRole = function(isDriver) {
    _isDriver = isDriver;
    initPreDepartureChecklist();
  };

  // ── Equipment info persistence (install mode) ──────────────────
  window._pdcSaveEquip = function() {
    try {
      var data = {
        model: (document.getElementById('pdcEqModel') || {}).value || '',
        serial: (document.getElementById('pdcEqSerial') || {}).value || '',
        tonnage: (document.getElementById('pdcEqTonnage') || {}).value || '',
        type: (document.getElementById('pdcEqType') || {}).value || '',
        notes: (document.getElementById('pdcEqNotes') || {}).value || ''
      };
      localStorage.setItem('pdc_equip_' + _checklistDate, JSON.stringify(data));
    } catch(e) {}
  };

  // ── Local persistence ──────────────────────────────────────────
  function _saveLocalState() {
    try {
      localStorage.setItem('pdc_state_' + _checklistDate, JSON.stringify(_checkStates));
      localStorage.setItem('pdc_driver_' + _checklistDate, _isDriver ? '1' : '0');
    } catch(e) {}
  }

  function _loadLocalState() {
    try {
      var saved = localStorage.getItem('pdc_state_' + _checklistDate);
      if (saved) _checkStates = JSON.parse(saved);
      var driver = localStorage.getItem('pdc_driver_' + _checklistDate);
      if (driver !== null) _isDriver = driver === '1';
    } catch(e) {}
  }

  // ── Submit to Supabase ─────────────────────────────────────────
  window._pdcSubmit = function() {
    var isEN = _lang() === 'en';

    // Count pass/fail
    var passes = 0;
    var fails = 0;
    var failItems = [];
    _activeSections.forEach(function(sec) {
      if (sec.driverOnly && !_isDriver) return;
      sec.items.forEach(function(item) {
        if (_checkStates[item.id] === 'pass') passes++;
        if (_checkStates[item.id] === 'fail') {
          fails++;
          failItems.push(_t(item));
        }
      });
    });

    var email = '';
    var name = '';
    try {
      email = (typeof currentUser !== 'undefined' && currentUser && currentUser.email) ? currentUser.email : (localStorage.getItem('tecnico_email') || '');
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      name = u.nombre || '';
    } catch(e) {}

    var record = {
      email: email,
      technician_name: name,
      checklist_date: _checklistDate,
      role: _isDriver ? 'driver' : 'passenger',
      total_items: passes + fails,
      passed: passes,
      failed: fails,
      fail_details: failItems.join(', '),
      checklist_data: JSON.stringify({ checks: _checkStates, mode: _currentMode, equipment: _currentMode === 'install' ? (function() { try { return JSON.parse(localStorage.getItem('pdc_equip_' + _checklistDate) || '{}'); } catch(e) { return {}; } })() : undefined }),
      submitted_at: new Date().toISOString()
    };

    // Save to Supabase
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      supabaseClient.from('pre_departure_checklists').upsert(record, { onConflict: 'email,checklist_date' }).then(function(res) {
        if (res.error) console.warn('[PDC] Save error:', res.error.message);
      });
    }

    // Mark submitted locally
    try { localStorage.setItem('pdc_submitted_' + _checklistDate, '1'); } catch(e) {}

    // Show confirmation
    var screen = document.getElementById('preDepartureScreen');
    if (!screen) return;

    var resultColor = fails > 0 ? '#f59e0b' : '#22c55e';
    var resultIcon = fails > 0 ? '⚠️' : '✅';
    var resultMsg = fails > 0
      ? _ti('pdc_result_fail_msg', 'Checklist enviado con ' + fails + ' item(s) FAIL. Revisa antes de salir.').replace('{n}', fails)
      : _ti('pdc_result_pass_msg', '¡Todos los items PASSED! ¡Listo para trabajar!');

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML = '<div style="background:#FFFFFF;border-radius:20px;padding:30px;max-width:400px;width:100%;text-align:center;border:2px solid ' + resultColor + ';box-shadow:0 20px 60px rgba(0,0,0,0.15);">' +
      '<div style="font-size:60px;margin-bottom:15px;">' + resultIcon + '</div>' +
      '<h2 style="color:' + resultColor + ';margin-bottom:10px;font-size:22px;font-weight:800;">' + (fails > 0 ? _ti('pdc_review_required', 'Revisión Necesaria') : _ti('pdc_ready_to_work', '¡Listo para Trabajar!')) + '</h2>' +
      '<p style="color:#4b5563;font-size:14px;margin-bottom:8px;line-height:1.6;">' + resultMsg + '</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;margin:16px 0;"><div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:10px 16px;"><div style="font-size:22px;font-weight:800;color:#166534;">' + passes + '</div><div style="font-size:10px;color:#166534;font-weight:700;">PASS</div></div><div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:10px 16px;"><div style="font-size:22px;font-weight:800;color:#991b1b;">' + fails + '</div><div style="font-size:10px;color:#991b1b;font-weight:700;">FAIL</div></div></div>' +
      (failItems.length > 0 ? '<div style="text-align:left;margin-top:12px;padding:12px;background:#FFFFFF;border-radius:10px;border:1px solid rgba(239,68,68,0.2);"><div style="font-size:11px;font-weight:700;color:#991b1b;margin-bottom:6px;">FAIL ITEMS:</div>' + failItems.map(function(fi) { return '<div style="font-size:12px;color:#991b1b;padding:3px 0;">• ' + fi + '</div>'; }).join('') + '</div>' : '') +
      '<button onclick="this.closest(\'div[style*=fixed]\').remove();showScreen(\'dashboardScreen\');" style="margin-top:20px;width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,' + resultColor + ',' + resultColor + 'cc);color:white;">👍 ' + _ti('pdc_ok_dashboard', 'OK — Ir al Dashboard') + '</button>' +
    '</div>';
    document.body.appendChild(overlay);
  };

  // ── History ────────────────────────────────────────────────────
  window._pdcShowHistory = function() {
    var isEN = _lang() === 'en';
    var email = '';
    try {
      email = (typeof currentUser !== 'undefined' && currentUser && currentUser.email) ? currentUser.email : (localStorage.getItem('tecnico_email') || '');
    } catch(e) {}

    if (!email || typeof supabaseClient === 'undefined' || !supabaseClient) {
      var _msg = _ti('pdc_no_history', 'No hay historial disponible'); if (typeof window.showToast === 'function') window.showToast(_msg); else window.MaestroDialog.alert({title: '', message: _msg, kind: 'info'});
      return;
    }

    supabaseClient.from('pre_departure_checklists')
      .select('*')
      .eq('email', email)
      .order('checklist_date', { ascending: false })
      .limit(30)
      .then(function(res) {
        if (!res.data || res.data.length === 0) {
          var _msg2 = _ti('pdc_no_submissions', 'Aún no has enviado checklists'); if (typeof window.showToast === 'function') window.showToast(_msg2); else window.MaestroDialog.alert({title: '', message: _msg2, kind: 'info'});
          return;
        }

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99998;overflow-y:auto;padding:20px;';

        var inner = '<div style="max-width:500px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,0.15);">';
        inner += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
        inner += '<h2 style="color:#111827;font-size:18px;font-weight:800;margin:0;">📊 ' + _ti('pdc_history_title', 'Historial de Checklists') + '</h2>';
        inner += '<button onclick="this.closest(\'div[style*=fixed]\').remove();" style="background:#f3f4f6;border:none;border-radius:8px;padding:8px 14px;color:#374151;font-size:13px;font-weight:700;cursor:pointer;">✕</button>';
        inner += '</div>';

        res.data.forEach(function(row) {
          var d = new Date(row.checklist_date + 'T12:00:00');
          var dateLabel = d.toLocaleDateString(isEN ? 'en-US' : 'es-MX', { weekday: 'short', month: 'short', day: 'numeric' });
          var allPass = row.failed === 0;
          var borderC = allPass ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';

          inner += '<div style="padding:14px;margin-bottom:8px;background:#f9fafb;border-radius:12px;border:1px solid ' + borderC + ';">';
          inner += '<div style="display:flex;justify-content:space-between;align-items:center;">';
          inner += '<div><div style="font-size:14px;font-weight:700;color:#111827;">' + dateLabel + '</div><div style="font-size:11px;color:#6b7280;margin-top:2px;">' + (row.role === 'driver' ? '🚐 ' + _ti('pdc_driver', 'Conductor') : '👤 ' + _ti('pdc_passenger', 'Pasajero')) + '</div></div>';
          inner += '<div style="display:flex;gap:8px;align-items:center;">';
          inner += '<span style="color:#166534;font-weight:800;font-size:14px;">✓' + row.passed + '</span>';
          if (row.failed > 0) inner += '<span style="color:#991b1b;font-weight:800;font-size:14px;">✗' + row.failed + '</span>';
          inner += '</div></div>';
          if (row.fail_details) {
            inner += '<div style="margin-top:8px;font-size:11px;color:#991b1b;">FAIL: ' + row.fail_details + '</div>';
          }
          inner += '</div>';
        });

        inner += '</div>';
        overlay.innerHTML = inner;
        document.body.appendChild(overlay);
      });
  };

})();
