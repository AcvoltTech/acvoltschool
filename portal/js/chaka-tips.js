// ============================================================
// CHAKA TIPS — Troubleshooting playbook del Maestro Mario Flores
// 85+ tips reales de campo · ES + EN · BLE-integrado
// ============================================================
(function() {
  'use strict';

  function pick(obj) {
    if (!obj) return '';
    var l = window._lang || 'es';
    if (typeof obj === 'string') return obj;
    return obj[l] || obj.es || obj.en || '';
  }

  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function t(k, fb) {
    if (typeof window._t === 'function') return window._t(k, fb);
    return fb || k;
  }

  // ── System color palettes (solid gradients) ────────────────
  var PAL = {
    navy:    { bg: 'linear-gradient(135deg,#1B2845 0%,#2A3A60 55%,#3A4E7C 100%)', border: '#C9A961', accent: '#E8C97A' },
    gold:    { bg: 'linear-gradient(135deg,#8B6B20 0%,#A88A42 55%,#C9A961 100%)', border: '#E8C97A', accent: '#FFF4D6' },
    emerald: { bg: 'linear-gradient(135deg,#065F46 0%,#047857 55%,#10B981 100%)', border: '#34D399', accent: '#BBF7D0' },
    red:     { bg: 'linear-gradient(135deg,#991B1B 0%,#B91C1C 55%,#DC2626 100%)', border: '#F87171', accent: '#FECACA' },
    amber:   { bg: 'linear-gradient(135deg,#78350F 0%,#B45309 55%,#F59E0B 100%)', border: '#FBBF24', accent: '#FEF3C7' },
    teal:    { bg: 'linear-gradient(135deg,#0F766E 0%,#0D9488 55%,#14B8A6 100%)', border: '#2DD4BF', accent: '#CCFBF1' },
    indigo:  { bg: 'linear-gradient(135deg,#312E81 0%,#4338CA 55%,#6366F1 100%)', border: '#818CF8', accent: '#C7D2FE' },
    rose:    { bg: 'linear-gradient(135deg,#881337 0%,#BE123C 55%,#E11D48 100%)', border: '#FB7185', accent: '#FECDD3' },
    slate:   { bg: 'linear-gradient(135deg,#1E293B 0%,#334155 55%,#475569 100%)', border: '#94A3B8', accent: '#CBD5E1' }
  };

  // ── DATA placeholder — populated by chunks below ───────────
  var CHAKA_TIPS = [];

  // ============================================================
  // SYSTEM 1 — SPLIT AC RESIDENCIAL (12 tips)
  // ============================================================
  CHAKA_TIPS.push({
    id: 'split-ac',
    title: { es: 'Split AC Residencial', en: 'Residential Split AC' },
    icon: '❄️',
    color: 'navy',
    tips: [
      {
        id: 'sac-01', level: 1, system: 'split-ac',
        symptom: { es: 'El compresor arranca y para cada 2-3 minutos (short cycling)', en: 'Compressor starts and stops every 2-3 minutes (short cycling)' },
        diagnosis: { es: 'Corto ciclo: el sistema no completa ciclo térmico. Casi siempre es carga, presión o control — raramente el compresor en sí.', en: 'Short cycling: system never completes a thermal cycle. Almost always charge, pressure, or control — rarely the compressor itself.' },
        rootCauses: {
          es: ['Sobrecarga de refrigerante (high-side trip)', 'Filtro sucio → coil congelado → low-pressure trip', 'Condensador sucio → high pressure cutout', 'Termostato mal posicionado (supply air hitting it)', 'Equipo sobredimensionado Manual J mal hecho', 'Capacitor de run débil (<90% µF nominal)'],
          en: ['Refrigerant overcharge (high-side trip)', 'Dirty filter → frozen coil → low-pressure trip', 'Dirty condenser → high-pressure cutout', 'Thermostat mislocated (supply air hitting it)', 'Oversized equipment, bad Manual J', 'Weak run capacitor (<90% rated µF)']
        },
        fix: { es: 'Mide SH y SC con SM480V. Si SC >14°F y SH <5°F → sobrecarga, recupera 2-4 oz. Si SH >20°F y SC <5°F → baja carga, checa fuga con burbujas o nitrógeno. Revisa amps en run cap — si off más del 10% del µF nominal, reemplaza.', en: 'Measure SH and SC with SM480V. If SC >14°F and SH <5°F → overcharge, recover 2-4 oz. If SH >20°F and SC <5°F → undercharge, leak-check with bubbles or nitrogen. Check run cap µF — if >10% off rated, replace.' },
        proTip: { es: 'Antes de tocar refrigerante, limpia el condensador y cambia el filtro. 60% de los "short cycling" se resuelven con limpieza — no con Freón.', en: 'Before touching refrigerant, clean the condenser and change the filter. 60% of "short cycling" calls resolve with cleaning — not Freon.' },
        tools: { es: 'SM480V · SC680 · JL3RH · termómetro pipe clamp', en: 'SM480V · SC680 · JL3RH · pipe clamp thermometer' },
        bleIntegration: { es: 'SM480V vía Job Link App stream live SH/SC; guarda screenshot antes/después de la limpieza.', en: 'SM480V via Job Link App streams live SH/SC; save screenshot before/after cleaning.' }
      },
      {
        id: 'sac-02', level: 2, system: 'split-ac',
        symptom: { es: 'Superheat bajo (<5°F) con SC normal', en: 'Low superheat (<5°F) with normal SC' },
        diagnosis: { es: 'SH bajo = refrigerante líquido regresando al compresor (flooding). Peligro: washout de aceite, slug en próximo arranque, compressor burnout en 2-6 meses.', en: 'Low SH = liquid refrigerant returning to compressor (flooding). Danger: oil washout, next-startup slug, compressor burnout within 2-6 months.' },
        rootCauses: {
          es: ['TXV abierta demasiado o bulbo suelto', 'Sobrecarga de refrigerante', 'Blower de evaporador muerto o lento (low airflow = no boil-off)', 'Filtro 100% tapado', 'Bypass de aire en el return duct'],
          en: ['TXV open too far or loose sensing bulb', 'Refrigerant overcharge', 'Dead/slow evap blower (low airflow = no boil-off)', 'Filter 100% clogged', 'Return duct air bypass']
        },
        fix: { es: 'Verifica CFM: target 400 CFM/ton A/C, 350 CFM/ton bomba de calor. Amarra bien el bulbo de TXV al suction line en posición 10 u 2 en reloj, aislado. Si SH no sube después de CFM correcto, recupera 1 lb y re-pesa la carga por nameplate.', en: 'Verify CFM: target 400 CFM/ton A/C, 350 CFM/ton heat pump. Strap TXV bulb tight to suction at 10 or 2 o\'clock, insulated. If SH stays low after CFM correction, recover 1 lb and reweigh charge per nameplate.' },
        proTip: { es: 'Nunca cargues por SH solo en sistema con TXV — pesa la carga. TXV es auto-regulada; si SH está raro, el problema es airflow, no carga.', en: 'Never charge by SH alone on a TXV system — weigh it in. TXV is self-regulating; weird SH means airflow issue, not charge.' },
        tools: { es: 'SM480V · JL3RH · anemómetro AT850 · báscula de refrigerante', en: 'SM480V · JL3RH · AT850 anemometer · refrigerant scale' },
        bleIntegration: { es: 'JL3RH clamps en suction + liquid line; SM480V calcula SH automático en la app.', en: 'JL3RH clamps on suction + liquid line; SM480V auto-calculates SH in app.' }
      },
      {
        id: 'sac-03', level: 2, system: 'split-ac',
        symptom: { es: 'Subcooling alto (>14°F) con presiones altas en alta', en: 'High subcooling (>14°F) with high head pressure' },
        diagnosis: { es: 'SC alto + head alto = condensador no está rechazando calor o hay exceso de refrigerante acumulado en el condensador.', en: 'High SC + high head = condenser not rejecting heat or excess refrigerant pooling in condenser.' },
        rootCauses: {
          es: ['Sobrecarga de refrigerante (caso más común)', 'Condensador sucio o bloqueado por maleza', 'Fan motor del condensador lento (bearings o capacitor débil)', 'Ambiente caliente + aletas dañadas', 'Non-condensables (aire) en el sistema'],
          en: ['Refrigerant overcharge (most common)', 'Dirty/brush-blocked condenser', 'Slow condenser fan motor (bearings or weak cap)', 'Hot ambient + damaged fins', 'Non-condensables (air) in system']
        },
        fix: { es: 'Limpia condensador con agua a baja presión de adentro hacia afuera. Mide RPM del fan — si <95% nominal, reemplaza cap o motor. Si SC sigue >14°F después de limpiar, recupera refrigerante en incrementos de 2-4 oz hasta llegar a SC del fabricante (usualmente 8-12°F).', en: 'Clean condenser with low-pressure water inside-out. Measure fan RPM — if <95% rated, replace cap or motor. If SC still >14°F after cleaning, recover in 2-4 oz increments until factory SC (usually 8-12°F).' },
        proTip: { es: 'SC es la ventana a la carga en sistemas TXV. Dos reglas: SC alto = exceso, SC bajo = falta. Pero primero limpia y mide CFM por el condensador.', en: 'SC is the charge window on TXV systems. Two rules: high SC = excess, low SC = lack. But clean and measure condenser CFM first.' },
        tools: { es: 'SM480V · hose de lavado low-pressure · tacómetro óptico · SC680 para amps del fan', en: 'SM480V · low-pressure rinse hose · optical tach · SC680 for fan amps' }
      },
      {
        id: 'sac-04', level: 2, system: 'split-ac',
        symptom: { es: 'Evaporador congelado (bloque de hielo en coil interior)', en: 'Frozen evaporator (ice block on indoor coil)' },
        diagnosis: { es: 'Coil a <32°F en operación. Raíz: low airflow o low refrigerant. Nunca cargues un sistema con coil congelado — vas a leer presiones falsas.', en: 'Coil at <32°F in operation. Root: low airflow or low refrigerant. Never charge a system with a frozen coil — false pressure readings.' },
        rootCauses: {
          es: ['Filtro tapado 80-100%', 'Coil sucio por dentro (biogrowth, polvo fino)', 'Blower lento, squirrel cage sucio', 'Ductos muy chicos o colapsados', 'Refrigerante bajo por fuga', 'Termostato set <68°F en noche fría'],
          en: ['Filter 80-100% clogged', 'Internally dirty coil (biogrowth, fine dust)', 'Slow blower, dirty squirrel cage', 'Undersized/collapsed ducts', 'Low refrigerant from leak', 'Thermostat set <68°F on cool night']
        },
        fix: { es: 'Apaga compresor, deja fan ON por 30-60 min para descongelar. Cambia filtro, inspecciona coil con spejo, limpia blower wheel. Después de descongelar, mide static pressure (SDMN6): target <0.5" WC total. Si >0.8" WC, hay problema de ductos. Entonces verifica SH/SC.', en: 'Kill compressor, leave fan ON for 30-60 min to thaw. Change filter, mirror-inspect coil, clean blower wheel. After thaw, measure static (SDMN6): target <0.5" WC total. If >0.8" WC, duct problem. Then verify SH/SC.' },
        proTip: { es: 'Hielo blanco tipo escarcha = airflow. Hielo cristal denso = carga. Aprende a leer el hielo antes de abrir manifold.', en: 'White frost-style ice = airflow. Dense clear ice = charge. Read the ice before you ever connect the manifold.' },
        tools: { es: 'SDMN6 · espejo de inspección · AT850 anemómetro · SM480V', en: 'SDMN6 · inspection mirror · AT850 anemometer · SM480V' }
      },
      {
        id: 'sac-05', level: 2, system: 'split-ac',
        symptom: { es: 'Contactor "chattering" (vibra pero no cierra firme)', en: 'Contactor chattering (vibrates but doesn\'t pull in solid)' },
        diagnosis: { es: 'Contactor está recibiendo voltaje marginal de 24V o el coil está débil/parcialmente abierto. Va a soldar los contactos o quemar el transformer en días.', en: 'Contactor getting marginal 24V or coil is weak/partially open. Will weld contacts or burn transformer within days.' },
        rootCauses: {
          es: ['Transformer 24V con output <22V bajo carga', 'Thermostat wire muy largo o calibre chico (18AWG >100 ft)', 'Coil del contactor burned-in (mide R — debe ser 10-20Ω típico)', 'Low-voltage short a tierra en Y line', 'Control board output débil'],
          en: ['24V transformer output <22V under load', 'Thermostat wire too long/thin (18AWG >100 ft)', 'Burned contactor coil (measure R — should be 10-20Ω typical)', 'Low-voltage short to ground on Y line', 'Weak control board output']
        },
        fix: { es: 'Mide 24V en las terminales del coil del contactor CON compresor comandado. Debe ser ≥22V. Si <22V, checa transformer secundario (debe dar 24-28V vacío, ≥22V bajo carga). Si coil R está fuera de rango o abierto, reemplaza contactor (es $15, no ahorres).', en: 'Measure 24V at contactor coil terminals WITH compressor commanded. Must be ≥22V. If <22V, check transformer secondary (should read 24-28V open, ≥22V loaded). If coil R is out of range or open, replace contactor ($15, don\'t cheap out).' },
        proTip: { es: 'Contactor chattering es la #1 causa de transformer quemado en residencial. Reemplaza el contactor siempre que cambies transformer — si no, quemas el nuevo en 2 semanas.', en: 'Chattering contactor is the #1 cause of burned transformers. Always replace contactor when replacing transformer — else you burn the new one in 2 weeks.' },
        tools: { es: 'SC680 para 24V AC · ohms del coil · termografía IR en los contactos', en: 'SC680 for 24V AC · coil ohms · IR thermography on contacts' }
      },
      {
        id: 'sac-06', level: 2, system: 'split-ac',
        symptom: { es: 'Compresor zumba 3 segundos y tropea por OL', en: 'Compressor hums 3 seconds then trips on OL' },
        diagnosis: { es: 'Start capacitor muerto, hard-start kit muerto, o rotor locked. Compresor no arranca = no mueve gas = OL internal trip por amps.', en: 'Dead start cap, dead hard-start kit, or locked rotor. Compressor not starting = not moving gas = internal OL trip on amps.' },
        rootCauses: {
          es: ['Start cap abierto (mide µF con SC680 — debe estar ±6% nominal)', 'Relay de start potencial quemado', 'Windings del compressor con short o grounded', 'Equalization no completa (arranque contra presión de descarga)', 'Low voltage de la casa (<208V en 240V nominal)'],
          en: ['Open start cap (measure µF with SC680 — within ±6% rated)', 'Burned potential start relay', 'Shorted or grounded compressor windings', 'Incomplete pressure equalization (starting against head)', 'Low house voltage (<208V on 240V nominal)']
        },
        fix: { es: 'Mide µF del start cap con SC680 — si abierto o <85% nominal, reemplaza. Después mide windings: C-S ~3-5Ω, C-R ~1-2Ω, S-R = suma. Si cualquiera a tierra <1MΩ con el compressor, está a tierra — reemplaza. Si todo bien, instala hard-start kit (SPP6 o similar).', en: 'Measure start cap µF with SC680 — if open or <85% rated, replace. Then measure windings: C-S ~3-5Ω, C-R ~1-2Ω, S-R = sum. If any-to-ground <1MΩ with compressor, grounded — replace. If all good, install hard-start kit (SPP6 or similar).' },
        proTip: { es: 'Nunca diagnostiques un compressor como "muerto" sin verificar µF de los capacitors y voltage en las terminales. 1 de cada 3 "compressors muertos" es un cap de $12.', en: 'Never call a compressor "dead" without verifying cap µF and terminal voltage. 1 in 3 "dead compressors" is a $12 cap.' },
        tools: { es: 'SC680 (µF + ohms) · megohmeter para windings-to-ground · pinza amperimétrica', en: 'SC680 (µF + ohms) · megohmmeter for windings-to-ground · clamp meter' }
      },
      {
        id: 'sac-07', level: 3, system: 'split-ac',
        symptom: { es: 'TXV hunting (SH oscila ±5°F cada 60-90 seg)', en: 'TXV hunting (SH swings ±5°F every 60-90 sec)' },
        diagnosis: { es: 'TXV sobre-reaccionando. Típicamente mal tamaño, bulbo mal montado, o carga inestable. No es normal — hay que arreglarlo.', en: 'TXV over-reacting. Typically wrong size, bad bulb mount, or unstable charge. Not normal — fix it.' },
        rootCauses: {
          es: ['Bulbo suelto del suction line o mal aislado', 'TXV mal tamaño (muy grande para la tonelaje real)', 'Carga baja — líquido intermitente al TXV', 'Distribuidor tapado parcialmente', 'Equalizer line doblada o tapada', 'MOP (max operating pressure) charge agotado del bulbo'],
          en: ['Loose/poorly insulated sensing bulb on suction', 'Wrong-size TXV (oversized for actual tonnage)', 'Low charge — intermittent liquid at TXV', 'Partially clogged distributor', 'Kinked or clogged equalizer line', 'MOP charge bled from sensing bulb']
        },
        fix: { es: 'Re-amarra el bulbo con strap de cobre en posición 10 u 2 horas, aislado con Armaflex. Revisa equalizer line — si tapada, reemplaza TXV. Si bulbo tiene MOP charge agotado, reemplaza (TXV completa, no solo bulbo — vienen sellados).', en: 'Re-strap bulb with copper strap at 10 or 2 o\'clock, insulate with Armaflex. Inspect equalizer — if clogged, replace TXV. If bulb lost MOP charge, replace (whole TXV, not just bulb — they come sealed).' },
        proTip: { es: 'TXV hunting después de un cambio de coil = no reutilizaste el bulbo correcto del nuevo kit. Siempre usa el TXV que viene con el coil nuevo, no el viejo.', en: 'TXV hunting after coil change = you reused the wrong bulb. Always use the TXV that ships with the new coil, not the old one.' },
        tools: { es: 'SM480V SH chart · strap de cobre · Armaflex · espejo de inspección', en: 'SM480V SH chart · copper strap · Armaflex · inspection mirror' }
      },
      {
        id: 'sac-08', level: 2, system: 'split-ac',
        symptom: { es: 'Condenser fan sobre-dimensionado: presión de alta muy baja en climas frescos', en: 'Oversized condenser fan: head pressure too low in mild weather' },
        diagnosis: { es: 'Fan moviendo más CFM del que el coil necesita → head drops → TXV starves → coil freezes. Común cuando alguien reemplazó un PSC motor con ECM genérico.', en: 'Fan moving more CFM than coil needs → head drops → TXV starves → coil freezes. Common after someone swapped PSC with generic ECM motor.' },
        rootCauses: {
          es: ['Motor de reemplazo con más HP del spec', 'Blade de reemplazo con más pitch o diámetro', 'Head pressure control (fan cycling switch) faltante en climas fríos', 'Set-up de verano en condiciones de otoño'],
          en: ['Replacement motor with higher HP than spec', 'Replacement blade with more pitch or diameter', 'Missing head pressure control (fan cycling switch) in cold climates', 'Summer setup in fall conditions']
        },
        fix: { es: 'Verifica HP, RPM y diámetro del blade contra nameplate. Si ambient <70°F, instala fan cycling switch (cut-in 275 PSI / cut-out 180 PSI en R-410A) o head master valve en comercial. Para A/C solo (no bomba de calor), nunca operes si ambient <60°F sin control de head.', en: 'Verify motor HP, RPM, and blade diameter vs nameplate. If ambient <70°F, install fan cycling switch (cut-in 275 PSI / cut-out 180 PSI on R-410A) or head master valve on commercial. For cool-only A/C, never run below 60°F ambient without head control.' },
        proTip: { es: 'Low-ambient operation congela evaporadores residenciales en otoño. Si el dueño quiere AC en octubre, vende fan cycling switch — es $40 en parts.', en: 'Low-ambient operation freezes residential coils in fall. If homeowner wants AC in October, sell the fan cycling switch — $40 part.' },
        tools: { es: 'Tacómetro óptico · SM480V · pinza amperimétrica en fan', en: 'Optical tach · SM480V · clamp meter on fan' }
      },
      {
        id: 'sac-09', level: 1, system: 'split-ac',
        symptom: { es: 'Fins del condensador doblados 30-50% — cliente pregunta si importa', en: 'Condenser fins bent 30-50% — homeowner asks if it matters' },
        diagnosis: { es: 'Sí importa. Cada 10% de fin area reducida = ~4-6% capacity loss y 2-3°F más de head. 30% daño = unidad corriendo a 85% capacidad con alta presión.', en: 'Yes it matters. Every 10% fin area loss = ~4-6% capacity loss and 2-3°F higher head. 30% damage = unit running at 85% capacity with high head.' },
        rootCauses: {
          es: ['Weed-eater golpeando el condensador', 'Granizada', 'Perro orinando (corroe aluminio)', 'Servicio anterior con manguera de alta presión'],
          en: ['Weed-eater hits', 'Hail storm', 'Dog urine (corrodes aluminum)', 'Prior service with high-pressure hose']
        },
        fix: { es: 'Usa fin comb del tamaño correcto (FPI: usualmente 14-18 fins por pulgada). Peina de arriba hacia abajo siguiendo el ángulo natural. Si hay corrosión por orina, aplica coil coat. Si el daño es >60%, vende re-core o unidad nueva — no es reparable field-viable.', en: 'Use correct FPI fin comb (usually 14-18 fins/inch). Comb top-down following natural angle. If urine corrosion, apply coil coat. If damage >60%, sell re-core or new unit — not field-repairable.' },
        proTip: { es: 'Enseña al cliente: pon una cerca de 24" alrededor del condensador, 3 ft de clearance, y prohibido el weed-eater. Evita $2,000 en daños al compresor.', en: 'Educate the homeowner: 24" fence around condenser, 3 ft clearance, no weed-eater. Avoids $2,000 compressor damage.' },
        tools: { es: 'Fin comb multi-FPI · spray coil cleaner · coil coat', en: 'Multi-FPI fin comb · coil cleaner spray · coil coat' }
      },
      {
        id: 'sac-10', level: 1, system: 'split-ac',
        symptom: { es: 'Condensador "aparentemente limpio" pero presiones altas', en: 'Condenser "looks clean" but head pressures are high' },
        diagnosis: { es: 'La suciedad de pelusa de álamo, pelo de mascota, polvo fino se mete ENTRE las aletas — no se ve desde afuera. Hay que lavar desde adentro.', en: 'Cottonwood fuzz, pet hair, fine dust packs BETWEEN fins — invisible from outside. Must be washed from inside out.' },
        rootCauses: {
          es: ['Lavado solo superficial con garden hose', 'Nunca se ha lavado desde adentro', 'Coil cleaner no-rinse aplicado sin enjuagar', 'Polvo de construcción cercana'],
          en: ['Only surface-level garden hose rinse', 'Never washed from inside', 'No-rinse coil cleaner applied without rinsing', 'Nearby construction dust']
        },
        fix: { es: 'Apaga disconnect. Remueve top del condensador. Aplica coil cleaner alcalino (no ácido en aluminio). Espera 5 min. Enjuaga DESDE ADENTRO hacia afuera con agua de baja presión (<50 PSI). Re-mide SC — debe bajar 3-6°F.', en: 'Kill disconnect. Remove condenser top. Apply alkaline coil cleaner (no acid on aluminum). Wait 5 min. Rinse FROM INSIDE OUT with low-pressure water (<50 PSI). Re-measure SC — should drop 3-6°F.' },
        proTip: { es: 'Lavado anual en propiedades con álamos, cerca de granjas, o con mascotas grandes. Cobra $149 — ahorras al cliente $400/año en compresor overheat.', en: 'Annual wash on properties with cottonwoods, near farms, or large pets. Charge $149 — saves homeowner $400/yr in compressor overheat.' },
        tools: { es: 'Coil cleaner alcalino · pump sprayer · SM480V para verificación', en: 'Alkaline coil cleaner · pump sprayer · SM480V for verification' }
      },
      {
        id: 'sac-11', level: 3, system: 'split-ac',
        symptom: { es: 'Slug de refrigerante líquido en arranque (golpe hidráulico)', en: 'Liquid refrigerant slug on startup (liquid slugging)' },
        diagnosis: { es: 'Sonido seco "clank" en el compressor al arrancar. Líquido en crankcase. Cada evento desgasta rodamientos — 20 eventos y rebuild. Peligroso.', en: 'Dry "clank" on compressor startup. Liquid in crankcase. Each event wears bearings — 20 events and rebuild. Serious.' },
        rootCauses: {
          es: ['Crankcase heater muerto o desconectado (off-cycle migration)', 'Unidad instalada con condensador en zona fría (garage, sombra norte)', 'Recovery/vacuum incompleto en instalación', 'TXV floodback crónico', 'Suction line muy larga con trampas de aceite mal diseñadas'],
          en: ['Dead or disconnected crankcase heater (off-cycle migration)', 'Unit installed with condenser in cold zone (garage, north shade)', 'Incomplete recovery/vacuum at install', 'Chronic TXV floodback', 'Long suction with bad oil traps']
        },
        fix: { es: 'Verifica crankcase heater: 40-80W, debe estar caliente al tacto después de 2 hrs OFF. Si muerto, reemplaza ($25). En unidades nuevas, exige 24 hrs de crankcase heater ON antes del primer arranque. Instala accumulator en suction si es bomba de calor.', en: 'Check crankcase heater: 40-80W, should be warm after 2 hrs OFF. If dead, replace ($25). On new installs, demand 24 hrs crankcase heater ON before first start. Add suction accumulator if heat pump.' },
        proTip: { es: 'Si escuchas "clank" en arranque, NO arranques otra vez. Corre en heat mode (si es bomba de calor) o conecta crankcase heater y espera 4 hrs. Cada arranque slug = $400 en vida perdida del compresor.', en: 'If you hear "clank" on start, DO NOT start again. Run heat mode (if heat pump) or plug in crankcase heater and wait 4 hrs. Each slug start = $400 in compressor life lost.' },
        tools: { es: 'Termografía IR en crankcase · SC680 para amps del heater · accumulator sizing chart', en: 'IR thermography on crankcase · SC680 for heater amps · accumulator sizing chart' }
      },
      {
        id: 'sac-12', level: 1, system: 'split-ac',
        symptom: { es: 'Drenaje tapado, agua en el closet de la furnace o techo', en: 'Clogged drain, water in furnace closet or ceiling' },
        diagnosis: { es: 'Coil condensa 3-5 galones/hora en día húmedo. Si drain tapa, el pan se desborda y destruye piso o techo. Es la #1 reclamación de seguros en verano.', en: 'Coil produces 3-5 gal/hr on humid day. Clog = pan overflows, destroys floor or ceiling. #1 summer insurance claim.' },
        rootCauses: {
          es: ['Biogrowth (algas, moho) en drain PVC', 'P-trap seco o colapsado', 'Drain line sin slope (mínimo 1/8" por pie)', 'Float switch faltante o bypass', 'Secondary pan tapado o faltante'],
          en: ['Biogrowth (algae, mold) in PVC drain', 'Dry or collapsed P-trap', 'Drain line without slope (min 1/8"/ft)', 'Missing or bypassed float switch', 'Clogged or missing secondary pan']
        },
        fix: { es: 'Sopla el drain con nitrógeno a 50 PSI (NO compressor de shop, lleva aceite). Alternativa: wet/dry vac en la salida exterior, 5 min. Instala float switch SS2 en el drain primary y otro en secondary pan. Vierte 1 taza de vinagre blanco al mes vía el clean-out — no Clorox (oxida PVC).', en: 'Purge drain with nitrogen at 50 PSI (NOT shop air — has oil). Or wet/dry vac at exterior outlet for 5 min. Install SS2 float switch on primary drain + secondary pan. Pour 1 cup white vinegar monthly via cleanout — not bleach (oxidizes PVC).' },
        proTip: { es: 'Vende el float switch SS2 en CADA service call. $35 parts + $125 instalación. Salva techos de $8,000. Tu upsell #1 del verano.', en: 'Sell the SS2 float switch on EVERY service call. $35 parts + $125 install. Saves $8,000 ceilings. Your #1 summer upsell.' },
        tools: { es: 'Nitrógeno portátil con regulador · wet/dry vac · SS2 float switch · vinagre blanco', en: 'Portable nitrogen + regulator · wet/dry vac · SS2 float switch · white vinegar' }
      }
    ]
  });

  // ============================================================
  // SYSTEM 2 — HEAT PUMP (12 tips)
  // ============================================================
  CHAKA_TIPS.push({
    id: 'heat-pump',
    title: { es: 'Bomba de Calor', en: 'Heat Pump' },
    icon: '♨️',
    color: 'emerald',
    tips: [
      {
        id: 'hp-01', level: 3, system: 'heat-pump',
        symptom: { es: 'Reversing valve trabada a mitad de posición', en: 'Reversing valve stuck mid-stroke' },
        diagnosis: { es: 'Slide interna no completó el switch. Parte del gas va a heat y parte a cool. Unidad no calienta ni enfría bien.', en: 'Internal slide didn\'t complete the switch. Part of gas going to heat, part to cool. Unit neither heats nor cools well.' },
        rootCauses: { es: ['Diferencial de presión insuficiente al cambiar modo','Solenoid coil débil o quemada','Contaminación interna (lodo, rebabas de brazing)','Carga baja (no hay diferencial de presión)','Valve mecánicamente dañada (impacto de slug)'], en: ['Insufficient pressure differential on mode change','Weak or burned solenoid coil','Internal contamination (sludge, braze chips)','Low charge (no pressure diff)','Mechanically damaged valve (slug impact)'] },
        fix: { es: 'Mide 24V en solenoid coil — debe tener voltage estable en modo cool. Con un mazo de goma da 3 golpes firmes en el cuerpo de la valve mientras comandas el switch — muchas veces libera. Si no, hay que reemplazar. Nunca desoldadura sin recuperar refrigerante.', en: 'Measure 24V at solenoid coil — must be stable in cool mode. With a rubber mallet, tap the valve body 3 times firmly while commanding the switch — often frees it. If not, replace. Never unsolder without recovering refrigerant.' },
        proTip: { es: 'Si la unidad tiene 12+ años y la valve está trabada, evalúa reemplazo completo del sistema. Brazing la valve nueva al mismo compresor viejo es tirar el dinero.', en: 'If unit is 12+ years old and valve is stuck, evaluate full system replacement. Brazing new valve to old compressor is throwing money away.' },
        tools: { es: 'SC680 para 24V · SM480V presiones · mazo de goma · nitrógeno para purga', en: 'SC680 for 24V · SM480V pressures · rubber mallet · nitrogen for purge' }
      },
      {
        id: 'hp-02', level: 3, system: 'heat-pump',
        symptom: { es: 'Defrost board no inicia ciclo — coil exterior congelado sólido', en: 'Defrost board not initiating cycle — outdoor coil frozen solid' },
        diagnosis: { es: 'Demand-defrost o time/temp defrost no está iniciando. En climas húmedos a 32-38°F, sin defrost la unidad pierde capacidad 60-80% en 30 min.', en: 'Demand-defrost or time/temp defrost not initiating. In humid 32-38°F weather, no defrost = 60-80% capacity loss in 30 min.' },
        rootCauses: { es: ['Defrost sensor (thermistor) abierto o fuera de calibración','Defrost board muerto (capacitor interno reventado)','Jumper de time-interval mal posicionado (30/60/90 min)','Reversing valve no responde al comando de defrost','Aux heat no engrana (cliente siente "aire frío" en defrost sin aux)'], en: ['Open or miscalibrated defrost sensor (thermistor)','Dead defrost board (blown internal cap)','Wrong time-interval jumper position (30/60/90 min)','Reversing valve not responding to defrost command','Aux heat not engaging (homeowner feels "cold air" during defrost without aux)'] },
        fix: { es: 'Mide thermistor con SC680: 30kΩ a 32°F típico (White-Rodgers). Jumper debe estar en 60 min para climas moderados, 30 min para muy húmedos. Fuerza defrost: puentea terminales de test en el board, debes oír reversing valve cambiar y fan exterior parar. Si no, board muerto.', en: 'Measure thermistor with SC680: 30kΩ at 32°F typical (White-Rodgers). Jumper at 60 min for moderate climates, 30 min for humid. Force defrost: jumper test pins on board — reversing valve should switch, outdoor fan stop. If not, board is dead.' },
        proTip: { es: 'SIEMPRE configura aux heat a engrinar durante defrost (W1 = Y + O en la mayoría). Si no, el supply air sale a 45°F y el cliente llama enojado.', en: 'ALWAYS wire aux heat to engage during defrost (W1 = Y + O on most). Else supply blows 45°F and homeowner calls angry.' },
        tools: { es: 'SC680 para thermistor Ω · defrost test pins · IR gun para coil temp', en: 'SC680 for thermistor Ω · defrost test pins · IR gun for coil temp' }
      },
      {
        id: 'hp-03', level: 2, system: 'heat-pump',
        symptom: { es: 'Aux heat engancha todo el tiempo — bill eléctrico $600/mes en invierno', en: 'Aux heat running constantly — $600/mo winter electric bill' },
        diagnosis: { es: 'Aux heat (electric strips 5-20 kW) debe ser backup, no primario. Si engancha >15% del runtime, algo está mal — tu cliente está pagando resistive cost en vez de COP 2.5-3.5 del heat pump.', en: 'Aux heat (5-20 kW electric strips) should be backup, not primary. If engaged >15% of runtime, something\'s wrong — customer paying resistive cost instead of 2.5-3.5 COP of heat pump.' },
        rootCauses: { es: ['Thermostat "emergency heat" accidentalmente activado','Balance point demasiado alto (set a 40°F cuando debería ser 25-30°F)','Outdoor sensor del thermostat drift o desconectado','Stage 2 lockout muy agresivo (2°F droop)','Carga baja de refrigerante (capacity loss)','Filter 90% tapado'], en: ['Thermostat "emergency heat" accidentally on','Balance point set too high (40°F when it should be 25-30°F)','Outdoor sensor drift or disconnected','Stage 2 lockout too aggressive (2°F droop)','Low refrigerant charge (capacity loss)','Filter 90% clogged'] },
        fix: { es: 'Verifica modo thermostat (no EMG). En Ecobee/Nest/Honeywell, set compressor lockout a 25°F y aux lockout a 40°F. Droop entre stages: 3-4°F. Verifica outdoor sensor (1kΩ @77°F típico Ecobee). Limpia filtro. Si balance point correcto y aux sigue enganchando, hay capacity loss — mide SH/SC.', en: 'Verify thermostat mode (not EMG). On Ecobee/Nest/Honeywell, set compressor lockout at 25°F and aux lockout at 40°F. Stage droop: 3-4°F. Verify outdoor sensor (1kΩ @77°F typical Ecobee). Clean filter. If balance point correct and aux still engages, capacity loss — measure SH/SC.' },
        proTip: { es: 'Antes de culpar la unidad, verifica el stat. 40% de los "high bills" son outdoor sensor drift o EMG pegado. 5 minutos de diagnóstico ahorran truck roll.', en: 'Before blaming the unit, check the stat. 40% of "high bills" are outdoor sensor drift or stuck EMG mode. 5 min of diagnostics saves a truck roll.' },
        tools: { es: 'SC680 µA en W1/W2 · outdoor sensor Ω test · SM480V SH/SC', en: 'SC680 µA on W1/W2 · outdoor sensor Ω test · SM480V SH/SC' }
      },
      {
        id: 'hp-04', level: 3, system: 'heat-pump',
        symptom: { es: 'Flash freeze en coil exterior (se congela en 5 min después de defrost)', en: 'Flash freeze on outdoor coil (refreezes 5 min after defrost)' },
        diagnosis: { es: 'Defrost terminó demasiado pronto o con agua aún en el coil. Agua re-congela de inmediato al volver a heat. Ciclo vicioso: defrost cada 20 min.', en: 'Defrost terminated too early or with water still on coil. Water refreezes instantly returning to heat. Vicious cycle: defrost every 20 min.' },
        rootCauses: { es: ['Termination thermistor set a 50°F (debería ser 65-80°F)','Fan del exterior no arrancó después de defrost — agua no se sopló','Drain pan del coil tapado — agua acumulada','Viento directo al coil congela antes de evaporar','Bypass de vapor entre defrost y heat mode muy rápido'], en: ['Termination thermistor set at 50°F (should be 65-80°F)','Outdoor fan didn\'t restart post-defrost — water not blown off','Coil drain pan clogged — pooled water','Direct wind refreezes before evaporation','Too-fast vapor bypass between defrost and heat'] },
        fix: { es: 'Set termination a 70°F en climas fríos. Instala wind baffle si viento >15 mph directo al coil. Limpia drain pan del outdoor coil (muchos técnicos no saben que existe). Agrega tiempo mínimo de heat entre defrosts (10 min en board lógica).', en: 'Set termination at 70°F in cold climates. Install wind baffle if wind >15 mph direct to coil. Clean outdoor coil drain pan (many techs don\'t know it exists). Add minimum heat time between defrosts (10 min in board logic).' },
        proTip: { es: 'En ambient 32-38°F con 80%+ humedad, heat pump va a hacer defrost cada 45-60 min normalmente. Si defrost dura <3 min o termina con hielo, algo está mal.', en: 'At 32-38°F ambient with 80%+ humidity, heat pump defrosts every 45-60 min normally. If defrost <3 min or ends with ice, something\'s wrong.' },
        tools: { es: 'IR gun · thermistor test · wind baffle kit · SM480V', en: 'IR gun · thermistor test · wind baffle kit · SM480V' }
      },
      {
        id: 'hp-05', level: 2, system: 'heat-pump',
        symptom: { es: 'Frost en coil exterior a 35°F ambient con humedad baja', en: 'Frost on outdoor coil at 35°F ambient with low humidity' },
        diagnosis: { es: 'A 35°F con RH <50%, el coil no debería tener frost denso. Si lo tiene, el sistema está sobre-absorbiendo — señal de carga baja o airflow problema.', en: 'At 35°F with RH <50%, coil shouldn\'t have dense frost. If it does, system over-absorbing — sign of low charge or airflow issue.' },
        rootCauses: { es: ['Refrigerante bajo (<90% nameplate)','Coil exterior bloqueado por hojas, nieve, o smog','Fan lento por capacitor débil','TXV (heat mode) starving','Filtro interior tapado reduciendo load y bajando evap temp'], en: ['Low refrigerant (<90% nameplate)','Outdoor coil blocked by leaves, snow, or smog','Slow fan from weak cap','TXV (heat mode) starving','Clogged indoor filter reducing load and dropping evap temp'] },
        fix: { es: 'En heat mode, mide SC del outdoor (actuando como evap es indoor). Para R-410A bomba de calor, outdoor coil temp debe estar 10-15°F debajo de ambient. Si 20°F debajo, sistema starving. Verifica refrigerante por peso — recover todo, vacuum 500 micron, recarga nameplate.', en: 'In heat mode, measure indoor SC (indoor is condenser in heat). R-410A heat pump outdoor coil temp should be 10-15°F below ambient. If 20°F below, system starving. Verify charge by weight — recover, vacuum to 500 micron, recharge nameplate.' },
        proTip: { es: 'Bomba de calor en heat: SC se mide en el indoor coil (que es el condenser en heat mode). Tu manifold manguera azul es el "low" que ahora es HIGH en heat. Cuidado con confundir lecturas.', en: 'Heat pump in heat: SC measured at indoor coil (condenser in heat mode). Your blue manifold hose is "low" which is now HIGH in heat. Don\'t confuse readings.' },
        tools: { es: 'SM480V · JL3RH pipe clamps · IR gun', en: 'SM480V · JL3RH pipe clamps · IR gun' }
      },
      {
        id: 'hp-06', level: 2, system: 'heat-pump',
        symptom: { es: 'Outdoor sensor de thermostat leyendo 52°F cuando afuera está 28°F', en: 'Thermostat outdoor sensor reading 52°F when actual outdoor is 28°F' },
        diagnosis: { es: 'Sensor drift o mal montado. Resultado: balance point wrong = aux heat nunca engrana cuando debería, o engrana toda la noche.', en: 'Sensor drift or bad mount. Result: wrong balance point = aux heat never engages when it should, or runs all night.' },
        rootCauses: { es: ['Sensor montado cerca de ventilación de dryer o plena','Sensor al sol directo (debe estar en norte o sombreado)','Cable del sensor en resistencia alta (corroded splices)','Sensor quemado por transient (rayo cercano)','Software del thermostat con reading offset mal calibrado'], en: ['Sensor near dryer vent or vent stack','Sensor in direct sun (should be north/shaded)','High-resistance sensor wire (corroded splices)','Sensor zapped by transient (lightning nearby)','Thermostat software offset miscalibrated'] },
        fix: { es: 'Re-monta sensor en lado norte de la casa, 6 ft altura, aire libre. Verifica splices con ohm — sensor Ecobee es 10kΩ@77°F. Si sensor lee ±5°F fuera del termómetro real, reemplaza ($35). Configura offset en thermostat si la variación es consistente.', en: 'Remount sensor on north side of house, 6 ft elevation, free air. Verify splices with ohm — Ecobee sensor is 10kΩ@77°F. If sensor reads ±5°F off real thermometer, replace ($35). Set thermostat offset if variation is consistent.' },
        proTip: { es: 'Muchos instaladores tiran el cable con el disconnect — gran error, se calienta. Ruta el cable del outdoor sensor separado, en conduit propio.', en: 'Many installers bundle sensor wire with disconnect — mistake, it gets warm. Route outdoor sensor wire separately, own conduit.' },
        tools: { es: 'SC680 para Ω del sensor · termómetro de referencia · thermostat offset config', en: 'SC680 for sensor Ω · reference thermometer · thermostat offset config' }
      },
      {
        id: 'hp-07', level: 2, system: 'heat-pump',
        symptom: { es: 'Crankcase heater no calienta — compresor con líquido en invierno', en: 'Crankcase heater not warming — compressor with liquid in winter' },
        diagnosis: { es: 'En bomba de calor, crankcase heater es CRÍTICO (no opcional como en A/C). Migración de refrigerante al crankcase durante off-cycle = slug en arranque = compresor muerto en 2-3 años.', en: 'On heat pumps, crankcase heater is CRITICAL (not optional like A/C). Off-cycle refrigerant migration = startup slug = dead compressor in 2-3 yrs.' },
        rootCauses: { es: ['Heater band abierto (mide con SC680 — debe dar 1500-4000Ω)','Alimentación 240V no presente off-cycle (mal cableado al disconnect)','Heater montado con clip suelto — no hace contacto térmico','Heater internal (interno del compressor) quemado — requiere compressor new'], en: ['Open heater band (measure with SC680 — should read 1500-4000Ω)','No 240V off-cycle (miswired at disconnect)','Loose clip — no thermal contact','Internal (compressor-internal) heater burned — compressor replacement required'] },
        fix: { es: 'Verifica 240V en terminales del heater con compressor OFF (muchos sistemas alimentan heater solo off-cycle). Si heater band, mide Ω y reemplaza si abierto. Clip debe estar apretado, contacto metal-metal con body del compressor. Requiere 6-24 hrs energizado antes del primer arranque post-reparación.', en: 'Verify 240V at heater terminals with compressor OFF (many systems power heater only off-cycle). If band heater, measure Ω and replace if open. Clip must be tight, metal-metal contact with compressor body. Require 6-24 hrs energized before first post-repair start.' },
        proTip: { es: 'En invierno, si unidad estuvo sin power >4 hrs, NO arranques compressor hasta que crankcase heater esté caliente al tacto. Un arranque con slug destruye bearings.', en: 'In winter, if unit was without power >4 hrs, DO NOT start compressor until crankcase heater is warm to touch. One slug start destroys bearings.' },
        tools: { es: 'SC680 para Ω y AC voltage · IR gun (crankcase debe estar 20°F+ sobre ambient)', en: 'SC680 for Ω and AC voltage · IR gun (crankcase should be 20°F+ above ambient)' }
      },
      {
        id: 'hp-08', level: 2, system: 'heat-pump',
        symptom: { es: 'Solenoid de reversing valve zumba pero no cambia', en: 'Reversing valve solenoid buzzes but doesn\'t shift' },
        diagnosis: { es: 'Voltage al coil pero la valve no mueve. O coil está dando fuerza insuficiente, o slide atorada por contaminación.', en: 'Voltage at coil but valve won\'t move. Either coil is giving insufficient force, or slide stuck from contamination.' },
        rootCauses: { es: ['24V marginal (<22V bajo carga)','Coil degradada — amp draw alto, fuerza baja','Diferencial de presión muy chico (<75 PSI)','Contaminación interna de la valve (lodo, acid test)','Valve quemada internamente por hot gas durante defrost incorrect'], en: ['Marginal 24V (<22V under load)','Degraded coil — high amp draw, low force','Too-small pressure differential (<75 PSI)','Internal valve contamination (sludge, do acid test)','Valve burned internally by hot gas during incorrect defrost'] },
        fix: { es: 'Mide 24V en coil bajo demanda. Mide Ω del coil (típico 70-100Ω en Ranco/White-Rodgers). Mazo de goma 3 golpes firmes en body puede liberar slide. Acid test con kit Supco — si positivo, sistema contaminado, reemplaza todo.', en: 'Measure 24V at coil on demand. Measure coil Ω (70-100Ω typical Ranco/White-Rodgers). Rubber mallet 3 firm taps on body can free slide. Acid test with Supco kit — if positive, system contaminated, replace all.' },
        proTip: { es: 'Si la valve suena como maracas o vibra con gas pasando en modo cool, slide está al 90% suelta. Es cuestión de tiempo antes de dejar al cliente sin heat en enero.', en: 'If valve sounds like maracas or vibrates with gas flowing in cool mode, slide is 90% loose. Matter of time before leaving customer without heat in January.' },
        tools: { es: 'SC680 Ω + AC voltage · acid test kit · mazo de goma', en: 'SC680 Ω + AC voltage · acid test kit · rubber mallet' }
      },
      {
        id: 'hp-09', level: 2, system: 'heat-pump',
        symptom: { es: 'Fuga en service valve del outdoor (stem leak)', en: 'Outdoor service valve leak (stem leak)' },
        diagnosis: { es: 'Schrader core o packing del stem fuga lento. Sistema pierde 0.5-2 oz/mes. A los 6 meses, cliente llama por capacity loss.', en: 'Schrader core or stem packing slow leak. System loses 0.5-2 oz/month. At 6 months, customer calls for capacity loss.' },
        rootCauses: { es: ['Schrader core degradado (rubber envejecido)','Packing del stem seco después de service','Cap faltante (cap es secondary seal!)','Service tech ejerció torque excesivo dañando stem threads','Braze flux no removido corroyó el brass'], en: ['Degraded Schrader core (aged rubber)','Dry stem packing after service','Missing cap (cap is secondary seal!)','Service tech overtorqued damaging stem threads','Braze flux not removed, corroded brass'] },
        fix: { es: 'Con burbujas de jabón o detector electrónico (Fieldpiece DR82), confirma fuga. Schrader core: $0.50, reemplaza con tool specific — no con pliers. Si fuga por packing, apretar stem packing nut 1/4 vuelta max (más y daña). Siempre reemplaza cap tipo Schrader con O-ring, no caps genéricos.', en: 'With soap bubbles or electronic detector (Fieldpiece DR82), confirm leak. Schrader core: $0.50, replace with core tool — not pliers. If packing leak, tighten stem packing nut 1/4 turn max (more damages). Always replace cap with Schrader O-ring type, not generic caps.' },
        proTip: { es: 'Cada call de "AC perdió carga" checa los caps PRIMERO. 20% de las fugas "fantasma" son caps faltantes. $3 en caps te salva una falsa cotización de coil leak.', en: 'Every "AC lost charge" call: check caps FIRST. 20% of "phantom" leaks are missing caps. $3 in caps saves a false coil leak quote.' },
        tools: { es: 'Schrader core tool · Fieldpiece DR82 · soap bubbles · caps con O-ring', en: 'Schrader core tool · Fieldpiece DR82 · soap bubbles · O-ring caps' }
      },
      {
        id: 'hp-10', level: 3, system: 'heat-pump',
        symptom: { es: 'Heat pump undersized para Minnesota: cliente con 2.5 ton en casa de 1800 sqft frío', en: 'Undersized heat pump for Minnesota: 2.5 ton in 1800 sqft cold-climate home' },
        diagnosis: { es: 'En climas fríos (zona 5-7), bombas de calor convencionales pierden 50-60% capacity a 17°F. Un Manual J hecho para summer cooling queda corto para winter heating.', en: 'In cold climates (zone 5-7), conventional heat pumps lose 50-60% capacity at 17°F. A Manual J sized for summer cooling comes up short for winter heating.' },
        rootCauses: { es: ['Manual J basado en cooling peak (95°F design) ignorando heating design (5°F)','No se usó HSPF2 / COP a design temp para sizing real','Se asumió "aux heat lo compensa" — cliente paga $800/mes','Cold-climate heat pump (Mitsubishi Hyperheat, Trane XR17) no ofrecido','Balance point nunca calculado'], en: ['Manual J based on cooling peak (95°F design) ignoring heating design (5°F)','Didn\'t use HSPF2 / COP at design temp for actual sizing','Assumed "aux heat covers it" — customer pays $800/month','Cold-climate heat pump (Mitsubishi Hyperheat, Trane XR17) not offered','Balance point never calculated'] },
        fix: { es: 'Re-corre Manual J con heating design temp real (ASHRAE 99% winter). Compara capacity at design vs load. Si gap >30%, upsize unit O vende cold-climate heat pump (Mitsubishi Hyperheat hold 100% capacity a 5°F). Calcula balance point: donde capacity = load. Ideal: 20-30°F.', en: 'Re-run Manual J with real heating design temp (ASHRAE 99% winter). Compare capacity-at-design vs load. If gap >30%, upsize OR sell cold-climate heat pump (Mitsubishi Hyperheat holds 100% capacity at 5°F). Calculate balance point: where capacity = load. Target: 20-30°F.' },
        proTip: { es: 'Si cliente está en Minnesota, Wisconsin, upstate NY — no vendas heat pump convencional. Vende Mitsubishi, Fujitsu, or Trane XV20i con refrigerant injection. Cuesta $2K más, pero cliente no te llama enojado en enero.', en: 'Customer in Minnesota, Wisconsin, upstate NY — don\'t sell conventional heat pump. Sell Mitsubishi, Fujitsu, or Trane XV20i with refrigerant injection. $2K more but no angry January calls.' },
        tools: { es: 'Wrightsoft Manual J · performance data sheets del fabricante · balance point calculator', en: 'Wrightsoft Manual J · manufacturer performance data · balance point calc' }
      },
      {
        id: 'hp-11', level: 2, system: 'heat-pump',
        symptom: { es: 'Dual-fuel (heat pump + furnace gas) — gas engancha mal o nunca', en: 'Dual-fuel (heat pump + gas furnace) — gas engages poorly or never' },
        diagnosis: { es: 'Dual-fuel requiere thermostat configurado para dual-fuel mode Y outdoor sensor. Si mal cableado, o gas engancha como aux (pérdida del heat pump ahorro) o nunca engancha (casa fría).', en: 'Dual-fuel needs thermostat in dual-fuel mode AND outdoor sensor. Miswired: either gas runs as aux (losing heat pump savings) or never runs (cold house).' },
        rootCauses: { es: ['Thermostat en modo "heat pump + electric aux" no "dual fuel"','W terminal de furnace cableado en lugar de W2 (conflicto en defrost)','Switchover temp no configurado o mal (debe ser 30-35°F)','Outdoor sensor faltante','Gas valve lockout por pressure switch previo'], en: ['Thermostat in "heat pump + electric aux" not "dual fuel"','Furnace W wired instead of W2 (conflicts during defrost)','Switchover temp unset or wrong (should be 30-35°F)','Missing outdoor sensor','Gas valve lockout from prior pressure switch event'] },
        fix: { es: 'En Ecobee/Honeywell, configura "dual fuel mode" con switchover 30-35°F (ajusta a 5°F sobre balance point). Cableado típico: Y1/Y2 al heat pump, O reversing, W2 al gas valve (W2 bypass heat pump en defrost). Verifica outdoor sensor leyendo correcto.', en: 'On Ecobee/Honeywell, set "dual fuel mode" with switchover 30-35°F (tune to 5°F above balance point). Wiring: Y1/Y2 to heat pump, O reversing, W2 to gas valve (W2 bypasses heat pump during defrost). Verify outdoor sensor reads correctly.' },
        proTip: { es: 'Dual-fuel bien configurado ahorra al cliente $300-600/año vs all-gas o all-electric. Aprende esta lógica — es tu upsell en climas Midwest donde gas es barato.', en: 'Dual-fuel done right saves $300-600/yr vs all-gas or all-electric. Master this logic — your upsell in Midwest where gas is cheap.' },
        tools: { es: 'Thermostat con dual-fuel (Ecobee 4+, Honeywell T6 Pro)', en: 'Dual-fuel capable stat (Ecobee 4+, Honeywell T6 Pro)' }
      },
      {
        id: 'hp-12', level: 2, system: 'heat-pump',
        symptom: { es: 'Stage 2 (Y2) nunca engancha en 2-stage heat pump', en: 'Stage 2 (Y2) never engaging on 2-stage heat pump' },
        diagnosis: { es: 'Stage 2 debe engranar cuando stage 1 no puede mantener setpoint. Si no engrana, cliente está operando con half capacity — casa tarda 2 hrs en calentar.', en: 'Stage 2 must engage when stage 1 can\'t hold setpoint. If not, customer running at half capacity — house takes 2 hrs to warm up.' },
        rootCauses: { es: ['Thermostat no configurado para 2-stage heat pump','Y2 no cableado al outdoor (solo Y1 presente)','Stage 2 droop muy grande (5°F) — casa ya está fría pero stat no pide','Compresor 2-stage físicamente atorado en stage 1 (solenoid)','Outdoor board con jumper "stage" mal posicionado'], en: ['Stat not configured for 2-stage heat pump','Y2 not wired to outdoor (only Y1 present)','Too-large stage 2 droop (5°F) — house already cold but stat doesn\'t call','2-stage compressor physically stuck in stage 1 (solenoid)','Outdoor board "stage" jumper in wrong position'] },
        fix: { es: 'Configura thermostat: compressor stages = 2, stage 2 droop = 2°F. Cablea Y1 y Y2 al outdoor. En compresor Copeland UltraTech, mide 24V en solenoid de stage 2 cuando Y2 llama — si voltage presente pero compresor no sube amps (~30-40% jump), solenoid muerto.', en: 'Configure stat: compressor stages = 2, stage 2 droop = 2°F. Wire Y1 and Y2 to outdoor. On Copeland UltraTech compressor, measure 24V at stage 2 solenoid when Y2 calls — if voltage present but amps don\'t jump (~30-40%), solenoid dead.' },
        proTip: { es: '2-stage funciona bien si está bien configurado. Si el cliente se queja de "AC nunca enfría fuerte", checa Y2 — muy probable que nunca lo cablearon.', en: '2-stage works great if properly set up. If customer says "AC never cools hard", check Y2 — odds are it\'s not wired.' },
        tools: { es: 'SC680 amp clamp · thermostat config tool · fabricante schematic', en: 'SC680 amp clamp · stat config tool · manufacturer schematic' }
      }
    ]
  });

  // ============================================================
  // SYSTEM 3 — MINI-SPLIT & VRF (10 tips)
  // ============================================================
  CHAKA_TIPS.push({
    id: 'mini-split',
    title: { es: 'Mini-Split y VRF', en: 'Mini-Split & VRF' },
    icon: '🌬️',
    color: 'teal',
    tips: [
      {
        id: 'ms-01', level: 3, system: 'mini-split',
        symptom: { es: 'Error "E6" / "CF" / "P4" de comunicación entre indoor y outdoor', en: 'Communication error "E6" / "CF" / "P4" between indoor and outdoor' },
        diagnosis: { es: 'Señal de comm (típicamente en S1-S2 o 3ra línea) perdida. La mayoría son cableado, no tarjetas.', en: 'Comm signal (typically S1-S2 or 3rd wire) lost. Most are wiring, not boards.' },
        rootCauses: { es: ['Wire nut con hilo suelto en lineset del disconnect','Cable interior/exterior cruzado (L2 en S1)','Cable no blindado con interferencia de VFD cercano (Mitsubishi requiere shielded en runs >30 ft)','Polaridad invertida (Daikin es sensible)','Surge de rayo quemó optoacoplador en tarjeta indoor','Distance >100 ft sin repeater'], en: ['Loose wire nut at disconnect lineset','Indoor/outdoor cable crossed (L2 on S1)','Non-shielded wire with nearby VFD interference (Mitsubishi requires shielded on >30 ft runs)','Reversed polarity (Daikin is sensitive)','Lightning surge burned indoor board optocoupler','Distance >100 ft without repeater'] },
        fix: { es: 'Apaga disconnect. Verifica continuidad en cada hilo S1-S2-S3 (Mitsubishi) o 3 wires (Daikin): <1Ω end-to-end. Si >10Ω = splice corroído. Re-secure con wago lever-nut (no wire nut). Verifica polaridad al nameplate. Instala shielded si run >30 ft. Si todo OK y sigue error, mide 24V AC entre S1-S2 — debe ser 15-18V AC pulsante.', en: 'Kill disconnect. Check continuity each S1-S2-S3 wire (Mitsubishi) or 3 wires (Daikin): <1Ω end-to-end. If >10Ω = corroded splice. Re-secure with Wago lever nuts (not wire nuts). Verify polarity vs nameplate. Install shielded if run >30 ft. If OK and still errors, measure 24V AC between S1-S2 — should be 15-18V AC pulsing.' },
        proTip: { es: 'En Mitsubishi, si mides >18V DC entre S1-S2 con power ON, board outdoor tiene optocoupler quemado. Típicamente por rayo. $180 board vs $1200 outdoor — vende el board.', en: 'On Mitsubishi, if you read >18V DC between S1-S2 with power ON, outdoor board has burned optocoupler. Typical lightning damage. $180 board vs $1200 outdoor — sell the board.' },
        tools: { es: 'SC680 AC+DC · continuity tester · service manual del fabricante específico', en: 'SC680 AC+DC · continuity tester · manufacturer-specific service manual' }
      },
      {
        id: 'ms-02', level: 2, system: 'mini-split',
        symptom: { es: 'Mini-split con lineset de 80 ft perdiendo capacity', en: 'Mini-split with 80 ft lineset losing capacity' },
        diagnosis: { es: 'Cada fabricante tiene max lineset length y derate curves. Mitsubishi MSZ: max 65 ft con line de 1/4" + 3/8", más requiere upsize a 1/2" y trap adicional de aceite.', en: 'Each manufacturer has max lineset length and derate curves. Mitsubishi MSZ: max 65 ft with 1/4" + 3/8" lines, beyond requires upsize to 1/2" and extra oil trap.' },
        rootCauses: { es: ['Diámetro del lineset sub-dimensionado para el run','Sin oil trap en vertical lift >15 ft','Carga de refrigerante no ajustada por longitud (usualmente +0.2 oz/ft beyond factory)','Aislamiento del lineset degradado (pérdida de calor al exterior)','Factory charge precargada asume run corto'], en: ['Lineset diameter too small for run','No oil trap on >15 ft vertical lift','Charge not adjusted for length (typically +0.2 oz/ft beyond factory)','Degraded lineset insulation (heat loss to outdoor)','Factory precharge assumes short run'] },
        fix: { es: 'Verifica charge adder per fabricante — Mitsubishi requiere +0.6 oz per ft beyond 25 ft para 3/8" suction. Instala inverted oil trap cada 20 ft vertical. Aislamiento mínimo 1/2" cerrada de célula (Armaflex). Si lineset ya está instalado sub-dimensionado, difícil reparar sin reemplazar — educa al cliente.', en: 'Verify charge adder per manufacturer — Mitsubishi requires +0.6 oz per ft beyond 25 ft on 3/8" suction. Install inverted oil trap every 20 ft of vertical. Minimum 1/2" closed-cell insulation (Armaflex). If undersized lineset already installed, hard to fix without replacement — educate customer.' },
        proTip: { es: 'Pioneer, MrCool y self-install brands no enseñan oil traps ni charge adders. Cuando vas a fix, documenta foto del lineset. No cargues por SH solo — pesa la carga.', en: 'Pioneer, MrCool, and self-install brands don\'t teach oil traps or charge adders. When fixing, photo-document the lineset. Don\'t charge by SH alone — weigh it in.' },
        tools: { es: 'Báscula refrigerante · Armaflex · service manual con derate chart', en: 'Refrigerant scale · Armaflex · service manual with derate chart' }
      },
      {
        id: 'ms-03', level: 3, system: 'mini-split',
        symptom: { es: 'Compresor de mini-split con oil starvation (operación larga sin retorno de aceite)', en: 'Mini-split compressor oil starvation (long runs without oil return)' },
        diagnosis: { es: 'Mini-splits con inverter modulan muy bajo (20-30% capacity). A baja velocidad, gas velocity no es suficiente para arrastrar aceite vuelta al compressor. Resultado: compressor corre con aceite bajo → seize.', en: 'Inverter mini-splits modulate low (20-30% capacity). At low speed, gas velocity too low to return oil to compressor. Result: compressor runs dry → seize.' },
        rootCauses: { es: ['Sistema oversized — modula siempre bajo','Vertical lift >15 ft sin inverted trap','Lineset oversize (diametro muy grande baja velocity)','Anti-short-cycle muy agresivo — no alcanza full speed','Suction line con slope negativo en tramos largos'], en: ['Oversized system — always modulates low','Vertical lift >15 ft without inverted trap','Oversize lineset (too big drops velocity)','Too-aggressive anti-short-cycle — never hits full speed','Negative slope on long suction runs'] },
        fix: { es: 'Tamaño correcto: selecciona por Manual J, no "1 ton a prueba". Agrega inverted oil traps cada 15 ft vertical. Forza full speed 15 min en startup (modo test en control). Slope suction 1/4" per ft hacia el outdoor para drenar aceite por gravedad.', en: 'Right-size: pick by Manual J, not "1 ton to be safe". Add inverted oil traps every 15 ft vertical. Force full speed 15 min on startup (test mode in controller). Slope suction 1/4"/ft toward outdoor to gravity-drain oil.' },
        proTip: { es: 'Multi-zone mini-splits con un indoor apagado: aceite se queda en el branch apagado. Enciende todos los indoors 30 min una vez por semana — prevención.', en: 'Multi-zone mini-splits with one indoor off: oil pools in dead branch. Run all indoors 30 min weekly — preventive.' },
        tools: { es: 'Service manual · nivel de laser para slope · anemómetro para velocity', en: 'Service manual · laser level for slope · anemometer for velocity' }
      },
      {
        id: 'ms-04', level: 3, system: 'mini-split',
        symptom: { es: 'EEV (electronic expansion valve) falla — no modula bien', en: 'EEV (electronic expansion valve) failure — not modulating properly' },
        diagnosis: { es: 'EEV es motor paso a paso (stepper) con 0-480 pulses típico. Falla: coil abierto, stepper atascado mecánicamente, o señal PCB corrupta.', en: 'EEV is stepper motor with typical 0-480 pulses. Failure: open coil, mechanically stuck stepper, or corrupt PCB signal.' },
        rootCauses: { es: ['Coil de 4 wire con un wire abierto (mide Ω — debe dar 40-50Ω en cada par)','Contaminación interna atasca stepper','Board PCB con mosfet de driver quemado','Sensor de suction pressure mal lee → board manda wrong pulse count','Power surge dejó board con pulse count corrupto'], en: ['Open 4-wire coil (measure Ω — 40-50Ω each pair)','Internal contamination jams stepper','Burned driver MOSFET on PCB','Bad suction pressure sensor → board commands wrong pulse count','Power surge left board with corrupt pulse count'] },
        fix: { es: 'Mide cada par del coil EEV con ohm: típico 40-50Ω. Si cualquier abierto, reemplaza coil (separable). Si coil OK, desconecta y re-energiza — muchas PCBs re-inicializan pulse count al power cycle. Si no resuelve, scope del driver output con osciloscopio o reemplaza board.', en: 'Measure each EEV coil pair in ohms: typical 40-50Ω. If any open, replace coil (separable). If coil OK, disconnect power and re-energize — many PCBs reinitialize pulse count on power cycle. If not, scope driver output or replace board.' },
        proTip: { es: 'En Mitsubishi, código P8 típicamente es EEV stuck. Intenta "reinicialización forzada": 10 min sin power, luego arranca en modo test. 50% vuelven a la vida.', en: 'On Mitsubishi, code P8 typically means EEV stuck. Try "forced reset": 10 min unpowered, then test mode start. 50% come back.' },
        tools: { es: 'SC680 para Ω · osciloscopio (avanzado) · service mode del fabricante', en: 'SC680 for Ω · oscilloscope (advanced) · manufacturer service mode' }
      },
      {
        id: 'ms-05', level: 2, system: 'mini-split',
        symptom: { es: 'Drain pump del indoor chilla y no saca condensado', en: 'Indoor drain pump buzzes and doesn\'t pump condensate' },
        diagnosis: { es: 'Drain pump de mini-split es sensible — max lift 18" típico, requiere mantenimiento anual. Falla común en humid climates.', en: 'Mini-split drain pump is picky — typical 18" max lift, needs annual maintenance. Common failure in humid climates.' },
        rootCauses: { es: ['Float switch del drain pan atascado con biogrowth','Impeller del pump seized','Discharge tubing tapada con algae','Check valve del pump roto — water regresa','Lift height excede spec (max usualmente 18-24" sobre unit)'], en: ['Drain pan float switch jammed with biogrowth','Seized pump impeller','Algae-clogged discharge tubing','Broken pump check valve — water backflows','Lift height exceeds spec (typically 18-24" max above unit)'] },
        fix: { es: 'Remueve pump (snap-fit usualmente). Limpia float switch con alcohol isopropílico. Impeller: si gira a mano libremente, OK; si atascado, reemplaza pump ($85). Sopla discharge tubing con nitrógeno. Instala pan tab con Cillit BANG o similar: 1 tab cada 3 meses previene biogrowth.', en: 'Remove pump (usually snap-fit). Clean float switch with isopropyl. Impeller: if turns freely by hand, OK; if seized, replace pump ($85). Purge discharge tubing with nitrogen. Install pan tab (Cillit BANG or similar): 1 tab every 3 months prevents biogrowth.' },
        proTip: { es: 'Cliente pide pump en ubicación alta? Verifica spec. Si lift >24", vende condensate pump externo (Little Giant VCL) con alarm. $180 parts — previene drywall repair de $2K.', en: 'Customer wants pump in high location? Check spec. If lift >24", sell external condensate pump (Little Giant VCL) with alarm. $180 parts — prevents $2K drywall repair.' },
        tools: { es: 'IPA 70% · nitrógeno · pan tabs · Little Giant VCL para lifts altos', en: '70% IPA · nitrogen · pan tabs · Little Giant VCL for high lifts' }
      },
      {
        id: 'ms-06', level: 1, system: 'mini-split',
        symptom: { es: 'Cliente compró Pioneer/MRCOOL self-install en Amazon, no enfría', en: 'Customer bought Pioneer/MRCOOL DIY from Amazon, doesn\'t cool' },
        diagnosis: { es: 'Self-install brands vienen pre-cargadas con quick-connect fittings. Problemas: fugas en fittings, no vacuum hecho, no hay technician accountability.', en: 'Self-install brands come pre-charged with quick-connect fittings. Issues: fitting leaks, no vacuum pulled, no technician accountability.' },
        rootCauses: { es: ['Quick-connect sin torque correcto (típico 30-40 ft-lb)','Fittings cruzados en threading','Valves de servicio nunca abiertas completamente','No vacuum — aire en sistema','Lineset dañado en instalación (bending tight radius)'], en: ['Quick-connect without correct torque (typical 30-40 ft-lb)','Cross-threaded fittings','Service valves never fully opened','No vacuum — air in system','Lineset damaged on install (tight radius bends)'] },
        fix: { es: 'Confirma con cliente quién instaló. Si self-install, cotiza diagnóstico $149. Recover refrigerante (warranty VOID en self-install, no te preocupes). Vacuum 500 micron 30 min. Si holds, recarga nameplate. Si no holds, identifica fuga en quick-connect — usualmente requiere reemplazar fitting con brazed connection.', en: 'Confirm who installed. If DIY, quote $149 diagnostic. Recover refrigerant (warranty VOID on DIY, don\'t worry). Vacuum to 500 micron for 30 min. If holds, recharge nameplate. If not, find leak at quick-connect — usually requires replacing fitting with brazed connection.' },
        proTip: { es: 'NUNCA des warranty en un sistema que tú no instalaste. Ofrece "labor warranty 90 days" en tus reparaciones, pero cliente asume riesgo del equipment.', en: 'NEVER warrant a system you didn\'t install. Offer "90-day labor warranty" on your repairs, but customer owns equipment risk.' },
        tools: { es: 'Torque wrench · vacuum pump + micron gauge · brazing kit para reemplazar fitting', en: 'Torque wrench · vacuum pump + micron gauge · brazing kit to replace fitting' }
      },
      {
        id: 'ms-07', level: 3, system: 'mini-split',
        symptom: { es: 'Multi-zone: un indoor nunca alcanza setpoint, otros OK', en: 'Multi-zone: one indoor never hits setpoint, others OK' },
        diagnosis: { es: 'Multi-zone comparte outdoor. Si capacity total comandada excede outdoor rating, el sistema distribuye mal — indoor más lejos, más grande, o menos demanda se queda corto.', en: 'Multi-zone shares outdoor. If total commanded capacity exceeds outdoor rating, system distributes poorly — indoor farthest, largest, or with lower demand falls short.' },
        rootCauses: { es: ['Oversized indoor units vs outdoor rating','EEV del indoor atascado partial','Refrigerant carga total no ajustada por length de todos los branches','Indoor con filtro tapado — reducido airflow lee wrong temp','Distribuidor manifold del outdoor bloqueado'], en: ['Oversized indoor units vs outdoor rating','Partially stuck indoor EEV','Total charge not adjusted for all branch lengths','Indoor with clogged filter — wrong temp reading','Blocked outdoor distributor manifold'] },
        fix: { es: 'Verifica nameplate: indoor capacity sum ≤ outdoor max (típico 130% OK, 150% no). Mide SH en cada indoor — si uno >15°F mientras otros están 8°F, su EEV está starving. Limpia filtros de TODOS los indoors. Verifica carga total = factory + sumatoria de branch adders.', en: 'Check nameplate: sum of indoor capacities ≤ outdoor max (typical 130% OK, 150% no). Measure SH at each indoor — if one >15°F while others at 8°F, that EEV starving. Clean ALL indoor filters. Verify charge = factory + sum of branch adders.' },
        proTip: { es: 'Multi-zone es complicado. Si cliente tiene 4+ indoors y "no enfría bien", considera si el sistema está over-sold. Single-zone simple pero dedicado por cuarto es más confiable.', en: 'Multi-zone is complex. If customer has 4+ indoors and "doesn\'t cool well", consider if system is over-sold. Single-zone dedicated per room is more reliable.' },
        tools: { es: 'SM480V por indoor · branch balancing manual · báscula para carga total', en: 'SM480V per indoor · branch balancing manual · charge scale' }
      },
      {
        id: 'ms-08', level: 2, system: 'mini-split',
        symptom: { es: 'Condensate pump se desborda — lift height excedida', en: 'Condensate pump overflows — exceeded lift height' },
        diagnosis: { es: 'Pump interno de mini-split tiene max lift 18-24" típico. Pump externo como Little Giant VCL alcanza 20 ft, pero requiere instalación vertical.', en: 'Internal mini-split pump has typical 18-24" max lift. External pump like Little Giant VCL reaches 20 ft, but needs vertical install.' },
        rootCauses: { es: ['Pump interno usado para lift >24"','Discharge tubing con loops que crean air lock','Pump instalado horizontal en vez de vertical','Check valve faltante — flow negativo cuando pump off','Drain tubing dimensionada 3/8" cuando debe ser 1/2"'], en: ['Internal pump used for >24" lift','Discharge tubing with loops creating air lock','Pump mounted horizontal instead of vertical','Missing check valve — negative flow when pump off','3/8" drain tubing instead of 1/2"'] },
        fix: { es: 'Mide lift real desde drain pan hasta discharge point. Si >24", instala Little Giant VCL o similar externo. Tubing sin loops, siempre ascendente. Check valve al outlet del pump. Drain tubing 1/2" OD para runs >10 ft.', en: 'Measure actual lift from drain pan to discharge. If >24", install Little Giant VCL or equivalent external. Loop-free tubing, always ascending. Check valve at pump outlet. 1/2" OD drain tubing for runs >10 ft.' },
        proTip: { es: 'Vende la safety switch (Little Giant PumpTee) — detecta overflow, apaga el AC ANTES del daño. $25 switch vs $5K en techo dañado.', en: 'Sell the safety switch (Little Giant PumpTee) — detects overflow, shuts off AC BEFORE damage. $25 switch vs $5K ruined ceiling.' },
        tools: { es: 'Little Giant VCL · cinta métrica para lift · PumpTee safety', en: 'Little Giant VCL · tape for lift measure · PumpTee safety' }
      },
      {
        id: 'ms-09', level: 3, system: 'mini-split',
        symptom: { es: 'Desbalance eléctrico (phase imbalance) en VRF 3-phase', en: 'Electrical imbalance (phase imbalance) on 3-phase VRF' },
        diagnosis: { es: 'VRF requiere 3-phase balanced <2%. Desbalance causa compressor overheat, board faults, y reducción de efficiency 10-20%.', en: 'VRF needs balanced 3-phase <2%. Imbalance causes compressor overheat, board faults, 10-20% efficiency loss.' },
        rootCauses: { es: ['Utility feed con 1 phase weak (call utility)','Other building loads unbalanced en el panel','Transformer tap mal configurado','Breaker con contacto débil en 1 phase','Long runs sin paralleled conductors balanceados'], en: ['Utility feed weak on 1 phase (call utility)','Unbalanced other building loads on panel','Wrong transformer tap','Breaker with weak contact on 1 phase','Long runs without paralleled conductors balanced'] },
        fix: { es: 'Mide voltage L-L en las 3 combinations (AB, BC, CA) con SC680. Calcula % imbalance: (max deviation / average) × 100. Si >2%, investiga. Mide amps en cada phase del VRF — si imbalance >10% en amps, el compresor está en peligro.', en: 'Measure L-L voltage on all 3 combos (AB, BC, CA) with SC680. Calculate % imbalance: (max deviation / average) × 100. If >2%, investigate. Measure amps each VRF phase — if >10% amp imbalance, compressor is at risk.' },
        proTip: { es: 'NEMA MG-1: cada 1% de voltage imbalance = 7% de amp imbalance. 3% voltage imbalance quema el compressor en 6-12 meses. Documenta y reporta al utility — es su problema.', en: 'NEMA MG-1: each 1% voltage imbalance = 7% amp imbalance. 3% voltage imbalance burns compressor in 6-12 months. Document and report to utility — their problem.' },
        tools: { es: 'SC680 3-phase · phase rotation meter · data logger para utility monitoring', en: 'SC680 3-phase · phase rotation meter · utility data logger' }
      },
      {
        id: 'ms-10', level: 2, system: 'mini-split',
        symptom: { es: 'Lineset con diámetros incorrectos (suction 1/4" en vez de 3/8")', en: 'Lineset with wrong diameters (1/4" suction instead of 3/8")' },
        diagnosis: { es: 'Instalador DIY o handyman usó el lineset que tenía. Resultado: velocity incorrecta, capacity loss, oil return mal.', en: 'DIY or handyman installer used the lineset they had. Result: wrong velocity, capacity loss, bad oil return.' },
        rootCauses: { es: ['Lineset genérico de HVAC supply usado en mini-split','Nameplate no consultado para line sizes','Reuse de lineset de sistema anterior diferente tonelaje','Lineset pre-cargado genérico comprado en Amazon'], en: ['Generic HVAC supply lineset used on mini-split','Nameplate not consulted for line sizes','Reused lineset from different-tonnage prior system','Generic pre-charged lineset from Amazon'] },
        fix: { es: 'Consulta spec sheet del modelo: Mitsubishi MSZ 12K es 1/4" liquid + 3/8" suction, NO 1/4" en ambos. Si lineset está incorrecto y ya instalado, explica al cliente: capacity loss 15-30%, oil return en riesgo. Cotiza reemplazo — no hay band-aid.', en: 'Check model spec sheet: Mitsubishi MSZ 12K is 1/4" liquid + 3/8" suction, NOT 1/4" both. If lineset wrong and installed, explain to customer: 15-30% capacity loss, oil return at risk. Quote replacement — no band-aid.' },
        proTip: { es: 'En cada nuevo job de mini-split, verifica lineset sizes contra spec sheet ANTES de cargar. 10 min de verificación ahorra callback de 6 meses.', en: 'On every new mini-split job, verify lineset sizes against spec sheet BEFORE charging. 10 min of verification saves a 6-month callback.' },
        tools: { es: 'Caliper para medir OD · spec sheet fabricante · carta de velocity', en: 'Caliper for OD · manufacturer spec sheet · velocity chart' }
      }
    ]
  });

  // Expose data
  window.CHAKA_TIPS = CHAKA_TIPS;
  window.__chakaPal = PAL;
  window.__chakaHelpers = { pick: pick, esc: esc, t: t };

  // ═══════════════════════════════════════════════════════════
  // SYSTEM CATALOG (expand as more data arrives)
  // ═══════════════════════════════════════════════════════════
  var SYSTEMS = [
    { id:'split-ac',      label:{ es:'Split A/C',          en:'Split A/C' },          icon:'❄️', pal:'navy' },
    { id:'heat-pump',     label:{ es:'Heat Pump',          en:'Heat Pump' },          icon:'🔁', pal:'emerald' },
    { id:'mini-split',    label:{ es:'Mini-Split',         en:'Mini-Split' },         icon:'🪟', pal:'teal' },
    { id:'gas-furnace',   label:{ es:'Furnace de Gas',     en:'Gas Furnace' },        icon:'🔥', pal:'red',   comingSoon:true },
    { id:'boiler',        label:{ es:'Boiler / Hidrónico', en:'Boiler / Hydronic' },  icon:'♨️', pal:'amber', comingSoon:true },
    { id:'ductwork',      label:{ es:'Ductos / Airflow',   en:'Ductwork / Airflow' }, icon:'🌬️', pal:'indigo',comingSoon:true },
    { id:'electrical',    label:{ es:'Eléctrico',          en:'Electrical' },         icon:'⚡',  pal:'gold',  comingSoon:true },
    { id:'commercial',    label:{ es:'Comercial',          en:'Commercial' },         icon:'🏭', pal:'slate', comingSoon:true },
    { id:'refrigeration', label:{ es:'Refrigeración Com.', en:'Commercial Refrig.' }, icon:'🧊', pal:'rose',  comingSoon:true }
  ];

  // ═══════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════
  var _state = { view:'hub', system:null, tipId:null };

  // ═══════════════════════════════════════════════════════════
  // STYLES — injected once
  // ═══════════════════════════════════════════════════════════
  var _stylesInjected = false;
  function _injectStyles() {
    if (_stylesInjected) return;
    _stylesInjected = true;
    var css = ''
      + '#chakaTipsScreen{background:linear-gradient(180deg,#0a1628 0%,#0F1D32 45%,#142340 100%);min-height:100vh;padding:0 0 60px;color:#FFFFFF;-webkit-tap-highlight-color:transparent;}'
      + '.ck-top{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;position:sticky;top:0;z-index:5;background:linear-gradient(180deg,rgba(10,22,40,0.98) 0%,rgba(15,29,50,0.95) 100%);border-bottom:2px solid rgba(201,169,97,0.35);}'
      + '.ck-back{background:#C9A961;border:2px solid #E8C97A;color:#0a1628;width:40px;height:40px;border-radius:12px;font-size:20px;font-weight:900;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.35);}'
      + '.ck-top-title{font-size:20px;font-weight:900;color:#E8C97A;letter-spacing:0.5px;text-shadow:0 2px 6px rgba(0,0,0,0.6);}'
      + '.ck-hero{margin:14px 16px 8px;padding:18px 16px;background:linear-gradient(135deg,#991B1B 0%,#B91C1C 55%,#DC2626 100%);border:2.5px solid #F87171;border-radius:18px;box-shadow:0 8px 28px rgba(220,38,38,0.35),inset 0 1px 0 rgba(255,255,255,0.18);text-align:center;}'
      + '.ck-hero-label{font-size:10px;font-weight:900;letter-spacing:3px;color:#FECACA;text-shadow:0 1px 3px rgba(0,0,0,0.55);}'
      + '.ck-hero-title{font-size:24px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;margin-top:4px;text-shadow:0 2px 6px rgba(0,0,0,0.65);}'
      + '.ck-hero-sub{font-size:13px;font-weight:700;color:#FFEDD5;margin-top:6px;line-height:1.4;text-shadow:0 1px 3px rgba(0,0,0,0.55);}'
      + '.ck-count{display:inline-block;margin-top:10px;background:#7F1D1D;border:2px solid #FCA5A5;color:#FFFFFF;font-size:12px;font-weight:900;letter-spacing:1px;padding:5px 12px;border-radius:20px;box-shadow:0 2px 6px rgba(0,0,0,0.4);}'
      + '.ck-sec-title{margin:20px 16px 10px;font-size:15px;font-weight:900;color:#E8C97A;letter-spacing:1.5px;text-transform:uppercase;text-shadow:0 1px 3px rgba(0,0,0,0.6);}'
      + '.ck-sys-grid{margin:0 16px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}'
      + '.ck-sys-card{padding:14px 12px;border-radius:14px;border:2px solid;cursor:pointer;display:flex;flex-direction:column;gap:6px;min-height:96px;box-shadow:0 4px 14px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.14);position:relative;overflow:hidden;}'
      + '.ck-sys-icon{font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));}'
      + '.ck-sys-label{font-size:14px;font-weight:900;color:#FFFFFF;letter-spacing:0.2px;text-shadow:0 1px 3px rgba(0,0,0,0.55);line-height:1.2;}'
      + '.ck-sys-count{font-size:11px;font-weight:800;color:#FFFFFF;opacity:0.92;text-shadow:0 1px 2px rgba(0,0,0,0.5);}'
      + '.ck-sys-soon{position:absolute;top:6px;right:6px;background:#1E293B;color:#E8C97A;font-size:8px;font-weight:900;padding:2px 6px;border-radius:5px;letter-spacing:0.5px;border:1px solid #C9A961;}'
      + '.ck-tips-list{margin:8px 14px;display:flex;flex-direction:column;gap:12px;}'
      + '.ck-tip{padding:16px 16px 14px;border-radius:16px;border:2px solid #C9A961;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);box-shadow:0 6px 20px rgba(0,0,0,0.45),inset 0 1px 0 rgba(201,169,97,0.2);cursor:pointer;}'
      + '.ck-tip-head{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;}'
      + '.ck-lvl{flex-shrink:0;min-width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#0a1628;border:2px solid;box-shadow:0 2px 5px rgba(0,0,0,0.4);}'
      + '.ck-lvl-1{background:#BBF7D0;border-color:#10B981;}'
      + '.ck-lvl-2{background:#FDE68A;border-color:#F59E0B;}'
      + '.ck-lvl-3{background:#FECACA;border-color:#DC2626;}'
      + '.ck-symptom{flex:1;font-size:15px;font-weight:900;color:#FFFFFF;line-height:1.3;text-shadow:0 1px 3px rgba(0,0,0,0.55);}'
      + '.ck-tip-row{font-size:13px;line-height:1.5;margin-top:8px;color:#FFFFFF;text-shadow:0 1px 2px rgba(0,0,0,0.45);}'
      + '.ck-row-label{display:inline-block;font-size:10px;font-weight:900;color:#E8C97A;letter-spacing:1.2px;text-transform:uppercase;margin-right:6px;text-shadow:0 1px 2px rgba(0,0,0,0.5);}'
      + '.ck-chevron{color:#E8C97A;font-size:20px;font-weight:900;margin-left:auto;align-self:center;}'
      + '.ck-detail{margin:0 16px 16px;padding:18px;border-radius:18px;border:2.5px solid #E8C97A;background:linear-gradient(180deg,#0F1D32 0%,#1B2845 100%);box-shadow:0 10px 36px rgba(0,0,0,0.55);}'
      + '.ck-detail-sym{font-size:18px;font-weight:900;color:#FFFFFF;line-height:1.25;margin-bottom:10px;text-shadow:0 2px 5px rgba(0,0,0,0.6);}'
      + '.ck-detail-block{margin-top:14px;padding:14px;border-radius:12px;background:rgba(10,22,40,0.6);border-left:4px solid #C9A961;}'
      + '.ck-detail-title{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#E8C97A;text-transform:uppercase;margin-bottom:6px;text-shadow:0 1px 2px rgba(0,0,0,0.55);}'
      + '.ck-detail-body{font-size:14px;font-weight:700;color:#FFFFFF;line-height:1.5;text-shadow:0 1px 2px rgba(0,0,0,0.45);}'
      + '.ck-detail-body ul{margin:6px 0 0 18px;padding:0;}.ck-detail-body li{margin:3px 0;}'
      + '.ck-protip{margin-top:14px;padding:14px;border-radius:12px;background:linear-gradient(135deg,#065F46 0%,#047857 100%);border:2px solid #10B981;box-shadow:0 4px 14px rgba(16,185,129,0.3);}'
      + '.ck-protip-title{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#BBF7D0;text-transform:uppercase;margin-bottom:6px;}'
      + '.ck-protip-body{font-size:14px;font-weight:800;color:#FFFFFF;line-height:1.45;text-shadow:0 1px 2px rgba(0,0,0,0.5);}'
      + '.ck-ble{margin-top:12px;padding:12px 14px;border-radius:12px;background:linear-gradient(135deg,#0284C7 0%,#0EA5E9 100%);border:2px solid #38BDF8;}'
      + '.ck-ble-title{font-size:10px;font-weight:900;color:#E0F2FE;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;}'
      + '.ck-ble-body{font-size:13px;font-weight:800;color:#FFFFFF;line-height:1.4;text-shadow:0 1px 2px rgba(0,0,0,0.5);}'
      + '.ck-empty{margin:30px 20px;padding:24px;text-align:center;background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #C9A961;border-radius:18px;color:#FFFFFF;font-size:15px;font-weight:800;line-height:1.4;text-shadow:0 1px 3px rgba(0,0,0,0.5);}';
    var st = document.createElement('style');
    st.id = 'ck-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  function _byLevel(a, b) { return (a.level || 1) - (b.level || 1); }

  function _tipsForSystem(sysId) {
    var out = [];
    for (var i = 0; i < CHAKA_TIPS.length; i++) {
      if (CHAKA_TIPS[i].system === sysId) out.push(CHAKA_TIPS[i]);
    }
    return out.sort(_byLevel);
  }

  function _renderHub() {
    var h = '';
    h += '<div class="ck-top">';
    h += '<button class="ck-back" onclick="window.showScreen && window.showScreen(\'dashboardScreen\')" aria-label="Volver">‹</button>';
    h += '<div class="ck-top-title">💡 Chaka Tips</div>';
    h += '</div>';
    h += '<div class="ck-hero">';
    h += '<div class="ck-hero-label">MAESTRO MARIO · TROUBLESHOOTING</div>';
    h += '<div class="ck-hero-title">Chaka Tips</div>';
    h += '<div class="ck-hero-sub">Playbook de diagnóstico real del campo · síntoma → causa → fix → pro-tip · con integración BLE</div>';
    h += '<div class="ck-count">' + CHAKA_TIPS.length + ' TIPS · ' + SYSTEMS.filter(function(s){return !s.comingSoon;}).length + ' SISTEMAS ACTIVOS</div>';
    h += '</div>';
    h += '<div class="ck-sec-title">Sistemas</div>';
    h += '<div class="ck-sys-grid">';
    for (var i = 0; i < SYSTEMS.length; i++) {
      var sys = SYSTEMS[i];
      var pal = PAL[sys.pal] || PAL.navy;
      var cnt = _tipsForSystem(sys.id).length;
      var soon = sys.comingSoon || cnt === 0;
      var onclick = soon ? '' : ' onclick="window.__chakaOpen(\'' + sys.id + '\')"';
      h += '<div class="ck-sys-card" style="background:' + pal.bg + ';border-color:' + pal.border + ';opacity:' + (soon ? '0.72' : '1') + ';"' + onclick + '>';
      if (soon) h += '<span class="ck-sys-soon">PRÓXIMO</span>';
      h += '<div class="ck-sys-icon">' + sys.icon + '</div>';
      h += '<div class="ck-sys-label">' + esc(pick(sys.label)) + '</div>';
      h += '<div class="ck-sys-count">' + (cnt > 0 ? cnt + ' tips' : 'Build in progress') + '</div>';
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  function _renderSystem(sysId) {
    var sys = null;
    for (var i = 0; i < SYSTEMS.length; i++) { if (SYSTEMS[i].id === sysId) { sys = SYSTEMS[i]; break; } }
    if (!sys) return _renderHub();
    var tips = _tipsForSystem(sysId);
    var pal = PAL[sys.pal] || PAL.navy;
    var h = '';
    h += '<div class="ck-top">';
    h += '<button class="ck-back" onclick="window.__chakaBack()" aria-label="Volver">‹</button>';
    h += '<div class="ck-top-title">' + sys.icon + ' ' + esc(pick(sys.label)) + '</div>';
    h += '</div>';
    h += '<div class="ck-hero" style="background:' + pal.bg + ';border-color:' + pal.border + ';">';
    h += '<div class="ck-hero-label" style="color:' + pal.accent + ';">' + tips.length + ' TIPS · SÍNTOMA → FIX</div>';
    h += '<div class="ck-hero-title">' + esc(pick(sys.label)) + '</div>';
    h += '<div class="ck-hero-sub" style="color:' + pal.accent + ';">Ordenados por dificultad · tapea para abrir el playbook completo</div>';
    h += '</div>';
    if (tips.length === 0) {
      h += '<div class="ck-empty">🛠️ Próximamente<br/><span style="font-size:13px;font-weight:700;color:#E8C97A;">Este sistema se está construyendo</span></div>';
    } else {
      h += '<div class="ck-tips-list">';
      for (var j = 0; j < tips.length; j++) {
        var tip = tips[j];
        h += '<div class="ck-tip" onclick="window.__chakaTip(\'' + esc(tip.id) + '\')">';
        h += '<div class="ck-tip-head">';
        h += '<span class="ck-lvl ck-lvl-' + (tip.level || 1) + '">L' + (tip.level || 1) + '</span>';
        h += '<div class="ck-symptom">' + esc(pick(tip.symptom)) + '</div>';
        h += '<span class="ck-chevron">›</span>';
        h += '</div>';
        if (tip.diagnosis) {
          h += '<div class="ck-tip-row"><span class="ck-row-label">Diagnóstico</span>' + esc(pick(tip.diagnosis)) + '</div>';
        }
        h += '</div>';
      }
      h += '</div>';
    }
    return h;
  }

  function _renderTip(tipId) {
    var tip = null;
    for (var i = 0; i < CHAKA_TIPS.length; i++) { if (CHAKA_TIPS[i].id === tipId) { tip = CHAKA_TIPS[i]; break; } }
    if (!tip) return _renderHub();
    var h = '';
    h += '<div class="ck-top">';
    h += '<button class="ck-back" onclick="window.__chakaOpen(\'' + esc(tip.system) + '\')" aria-label="Volver">‹</button>';
    h += '<div class="ck-top-title">💡 Tip ' + esc(tip.id).toUpperCase() + '</div>';
    h += '</div>';
    h += '<div class="ck-detail">';
    h += '<div class="ck-detail-sym">';
    h += '<span class="ck-lvl ck-lvl-' + (tip.level || 1) + '" style="display:inline-flex;vertical-align:middle;margin-right:8px;">L' + (tip.level || 1) + '</span>';
    h += esc(pick(tip.symptom));
    h += '</div>';
    if (tip.diagnosis) {
      h += '<div class="ck-detail-block"><div class="ck-detail-title">🔍 Diagnóstico</div><div class="ck-detail-body">' + esc(pick(tip.diagnosis)) + '</div></div>';
    }
    if (tip.rootCauses) {
      var rc = pick(tip.rootCauses);
      var rcHtml = '';
      if (Array.isArray(rc)) {
        rcHtml = '<ul>';
        for (var k = 0; k < rc.length; k++) rcHtml += '<li>' + esc(rc[k]) + '</li>';
        rcHtml += '</ul>';
      } else {
        rcHtml = esc(rc);
      }
      h += '<div class="ck-detail-block"><div class="ck-detail-title">⚠️ Causas Raíz</div><div class="ck-detail-body">' + rcHtml + '</div></div>';
    }
    if (tip.fix) {
      h += '<div class="ck-detail-block" style="border-left-color:#10B981;"><div class="ck-detail-title" style="color:#BBF7D0;">🛠️ Fix</div><div class="ck-detail-body">' + esc(pick(tip.fix)) + '</div></div>';
    }
    if (tip.proTip) {
      h += '<div class="ck-protip"><div class="ck-protip-title">⭐ Pro-Tip Maestro</div><div class="ck-protip-body">' + esc(pick(tip.proTip)) + '</div></div>';
    }
    if (tip.tools) {
      h += '<div class="ck-detail-block" style="border-left-color:#38BDF8;"><div class="ck-detail-title" style="color:#E0F2FE;">🧰 Herramientas</div><div class="ck-detail-body">' + esc(pick(tip.tools)) + '</div></div>';
    }
    if (tip.bleIntegration) {
      h += '<div class="ck-ble"><div class="ck-ble-title">📡 BLE Integration</div><div class="ck-ble-body">' + esc(pick(tip.bleIntegration)) + '</div></div>';
    }
    h += '</div>';
    return h;
  }

  function _render() {
    var el = document.getElementById('chakaTipsScreen');
    if (!el) return;
    var html;
    if (_state.view === 'tip') html = _renderTip(_state.tipId);
    else if (_state.view === 'system') html = _renderSystem(_state.system);
    else html = _renderHub();
    el.innerHTML = html;
    try { el.scrollTop = 0; } catch(e) {}
    if (typeof window._translateDOM === 'function') { try { window._translateDOM(el); } catch(e) {} }
  }

  // ═══════════════════════════════════════════════════════════
  // NAV HANDLERS (exposed globally for onclick)
  // ═══════════════════════════════════════════════════════════
  window.__chakaOpen = function(sysId) { _state.view = 'system'; _state.system = sysId; _state.tipId = null; _render(); };
  window.__chakaTip  = function(tipId) { _state.view = 'tip'; _state.tipId = tipId; _render(); };
  window.__chakaBack = function() {
    if (_state.view === 'tip' && _state.system) { _state.view = 'system'; _state.tipId = null; _render(); return; }
    if (_state.view === 'system') { _state.view = 'hub'; _state.system = null; _render(); return; }
    if (typeof window.showScreen === 'function') window.showScreen('dashboardScreen');
  };

  // ═══════════════════════════════════════════════════════════
  // ENTRY POINT
  // ═══════════════════════════════════════════════════════════
  window.openChakaTips = function() {
    _injectStyles();
    _state = { view:'hub', system:null, tipId:null };
    _render();
    if (typeof window.showScreen === 'function') {
      try { window.showScreen('chakaTipsScreen'); } catch(e) {}
    }
  };
  window.initChakaTips = window.openChakaTips;
})();
