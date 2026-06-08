// Global Search — fast navigation across all app destinations.
// Indexed by Spanish keywords students actually use.

var GLOBAL_SEARCH_INDEX = [
  // ===== CORE NAVIGATION =====
  { t:'Inicio', kw:'home dashboard principal pantalla inicial menu', s:'dashboardScreen', i:'🏠' },
  { t:'Estudiar', kw:'estudio materias secciones temas aprender', s:'studySectionsScreen', i:'📚' },
  { t:'Desafío Maestro', kw:'desafio juego reto nivel corrida puntos xp competir', s:'desafioScreen', i:'🏆' },
  { t:'Niveles de Estudiante', kw:'levels nivel progreso rango estudiante rookie experto', s:'levelsScreen', i:'📈' },

  // ===== CERTIFICACIONES =====
  { t:'Certificaciones Oficiales', kw:'cert oficial epa nate osha a2l certificacion', s:'certOficialesScreen', i:'🎓' },
  { t:'Mis Certificados', kw:'certificados diplomas logros descargar pdf credenciales', s:'certificatesScreen', i:'📜' },
  { t:'EPA 608', kw:'epa 608 refrigerante freon recuperacion licencia epa', s:'certOficialesScreen', i:'❄️' },
  { t:'EPA 608 Tipo I', kw:'epa tipo 1 uno universal appliances pequenos small', s:'certOficialesScreen', i:'❄️' },
  { t:'EPA 608 Tipo II', kw:'epa tipo 2 dos alta presion residencial split heat pump', s:'certOficialesScreen', i:'❄️' },
  { t:'EPA 608 Tipo III', kw:'epa tipo 3 tres baja presion chiller comercial', s:'certOficialesScreen', i:'❄️' },
  { t:'EPA 608 Universal', kw:'epa universal todos tipos completo', s:'certOficialesScreen', i:'🌐' },
  { t:'EPA 609', kw:'epa 609 automotive carro auto mvac', s:'certOficialesScreen', i:'🚗' },
  { t:'NATE Core', kw:'nate core basico core icr', s:'certOficialesScreen', i:'🔧' },
  { t:'NATE AC Service', kw:'nate ac service aire acondicionado servicio', s:'certOficialesScreen', i:'❄️' },
  { t:'NATE Heat Pump', kw:'nate heat pump bomba calor', s:'certOficialesScreen', i:'🔥' },
  { t:'NATE Gas Heating', kw:'nate gas heating calefaccion horno furnace', s:'certOficialesScreen', i:'🔥' },
  { t:'NATE Senior', kw:'nate senior avanzado level 2 experto', s:'nateSeniorStudyScreen', i:'⭐' },
  { t:'OSHA 30', kw:'osha 30 seguridad construccion safety 30 horas', s:'certOficialesScreen', i:'🦺' },
  { t:'OSHA 10', kw:'osha 10 seguridad construccion 10 horas basico', s:'certOficialesScreen', i:'🦺' },
  { t:'Certificación A2L', kw:'a2l refrigerante inflamable r454b r32 nuevo', s:'certOficialesScreen', i:'🔥' },
  { t:'Sección 608', kw:'seccion 608 clean air act ley aire limpio', s:'certOficialesScreen', i:'📜' },
  { t:'HVAC Excellence', kw:'hvac excellence certificacion escolar tecnico', s:'certOficialesScreen', i:'🏅' },

  // ===== EXÁMENES =====
  { t:'Mis Exámenes', kw:'examenes pruebas tests calificaciones resultados mis exams', s:'studentExamsScreen', i:'📝' },
  { t:'Tomar Examen', kw:'tomar examen empezar iniciar comenzar nuevo test', s:'studentExamsScreen', i:'✍️' },
  { t:'Examen de Práctica', kw:'practica practice mock simulacion prueba', s:'studentExamsScreen', i:'📋' },
  { t:'Examen Final', kw:'final certificacion oficial ultimo', s:'studentExamsScreen', i:'🎯' },
  { t:'Mi Progreso', kw:'progreso avance estadisticas cuanto llevo score', s:'studentProgressScreen', i:'📊' },
  { t:'Calendario', kw:'calendario eventos clases agenda proximos fechas', s:'studentCalendarScreen', i:'📅' },

  // ===== ESTUDIO POR MATERIA =====
  { t:'Estudiar EPA 608', kw:'epa 608 refrigerante freon recuperacion recovery preguntas', s:'studyCategoryDetailScreen', i:'❄️', q:'epa608' },
  { t:'Estudiar NATE ICR', kw:'nate icr industry competency exam base preguntas', s:'nateStudyScreen', i:'🔧' },
  { t:'NATE AC Specialty', kw:'nate ac specialty aire acondicionado especialidad', s:'nateStudyScreen', i:'❄️' },
  { t:'NATE Gas Furnace', kw:'nate gas furnace horno calefaccion gas', s:'nateStudyScreen', i:'🔥' },
  { t:'NATE Oil Heating', kw:'nate oil heating calefaccion aceite oil', s:'nateStudyScreen', i:'🛢️' },
  { t:'NATE Hydronics', kw:'nate hydronics hidronico boiler caldera agua', s:'nateStudyScreen', i:'💧' },
  { t:'Estudiar OSHA 30', kw:'osha seguridad construccion safety workplace peligros', s:'oshaStudyScreen', i:'🦺' },
  { t:'Estudiar A2L', kw:'a2l refrigerante inflamable r454b r32 nuevo 2025', s:'calefaccionStudyScreen', i:'🔥' },
  { t:'Estudiar Refrigeración', kw:'refri cooling enfriamiento ciclo refrigerante compresor condensador evaporador', s:'refriStudyScreen', i:'❄️' },
  { t:'Estudiar Calefacción', kw:'heating calefaccion furnace horno gas oil combustion', s:'calefaccionStudyScreen', i:'🔥' },
  { t:'Estudiar Electricidad', kw:'electricidad et electrical voltaje amperaje resistencia ohm ley', s:'etStudyScreen', i:'⚡' },
  { t:'Motores Eléctricos', kw:'motores electric motor capacitor contactor compresor', s:'etStudyScreen', i:'⚙️' },
  { t:'Ductos y Ventilación', kw:'ductos ducts ventilacion cfm diseno sheet metal', s:'ductDesignerScreen', i:'📐' },
  { t:'Psicrometría', kw:'psicrometria psychrometrics humedad relativa wet bulb dry bulb', s:'studySectionsScreen', i:'💧' },
  { t:'Termodinámica', kw:'termodinamica thermo leyes ciclo energia calor', s:'refriStudyScreen', i:'🔬' },
  { t:'Compresores', kw:'compresores compressor reciprocante scroll tornillo rotatorio centrifugo', s:'refriStudyScreen', i:'⚙️' },
  { t:'Evaporadores', kw:'evaporador evaporator coil serpentin enfriar', s:'refriStudyScreen', i:'❄️' },
  { t:'Condensadores', kw:'condensador condenser coil serpentin aire agua', s:'refriStudyScreen', i:'🌡️' },
  { t:'Válvulas de Expansión', kw:'valvula expansion txv eev metering device superheat', s:'refriStudyScreen', i:'🔧' },
  { t:'Bombas de Vacío', kw:'bomba vacio vacuum pump micron deshidratacion evacuacion', s:'refriStudyScreen', i:'💨' },
  { t:'Recuperación', kw:'recuperacion recovery maquina bomba freon refrigerante', s:'refriStudyScreen', i:'♻️' },
  { t:'Carga de Refrigerante', kw:'carga refrigerante refrigerant charge sobrecarga undercharge', s:'refriStudyScreen', i:'🔢' },
  { t:'Fugas (Leaks)', kw:'fuga leak detector electronic ultraviolet jabon nitrogeno', s:'refriStudyScreen', i:'🫧' },

  // ===== REFRIGERANTES =====
  { t:'R-410A', kw:'r410a r 410 puron refrigerante hfc', s:'refriStudyScreen', i:'❄️' },
  { t:'R-22', kw:'r22 r 22 freon hcfc phase out prohibido descontinuado', s:'refriStudyScreen', i:'❄️' },
  { t:'R-32', kw:'r32 r 32 a2l baja gwp mildly flammable', s:'refriStudyScreen', i:'🔥' },
  { t:'R-454B', kw:'r454b puron advance a2l nuevo refrigerante', s:'refriStudyScreen', i:'🔥' },
  { t:'R-134a', kw:'r134a r 134 auto carro mvac automotriz', s:'refriStudyScreen', i:'🚗' },
  { t:'R-404A', kw:'r404a comercial low temp refrigeracion supermercado', s:'refriStudyScreen', i:'❄️' },
  { t:'R-290 (Propano)', kw:'r290 propano propane natural hc hidrocarburo', s:'refriStudyScreen', i:'🔥' },
  { t:'R-744 (CO2)', kw:'r744 co2 dioxido carbono natural transcritico', s:'refriStudyScreen', i:'🌿' },

  // ===== HERRAMIENTAS HVAC =====
  { t:'Herramientas HVAC', kw:'herramientas tools instrumentos equipo', s:'herramientasScreen', i:'🔧' },
  { t:'Manómetro (Pressure Gauge)', kw:'manometer presion psi vacuum gauge alta baja', s:'manometerHvacScreen', i:'🔘' },
  { t:'Multímetro', kw:'multimeter voltaje ohm amp voltios resistencia continuidad', s:'multimeterScreen', i:'⚡' },
  { t:'Manifold (Gauges)', kw:'manifold gauges presion carga 4 vias digital analogico', s:'manifoldScreen', i:'🔢' },
  { t:'Anemómetro', kw:'anemometer cfm velocidad aire airflow ventilacion', s:'anemometerHvacScreen', i:'💨' },
  { t:'Maestro Bender', kw:'bender doblar tubing dobladora cobre copper', s:'maestroBenderScreen', i:'🪈' },
  { t:'Diseñador de Ductos', kw:'duct designer ductos diseno calculo sheet metal ashrae', s:'ductDesignerScreen', i:'📐' },
  { t:'Cálculo Delta T', kw:'delta t temperatura diferencial split entrada salida', s:'herramientasScreen', i:'🌡️' },
  { t:'Superheat (Sobrecalentamiento)', kw:'superheat sobrecalentamiento saturacion suction succion', s:'herramientasScreen', i:'🔥' },
  { t:'Subcool (Subenfriamiento)', kw:'subcool subenfriamiento subcooling liquid liquido', s:'herramientasScreen', i:'❄️' },
  { t:'Calculadora Carga BTU', kw:'btu calculadora carga cooling load manual j tonelaje', s:'herramientasScreen', i:'🧮' },
  { t:'Ley de Ohm', kw:'ohm ley voltaje amperaje resistencia calcular', s:'multimeterScreen', i:'⚡' },
  { t:'Tabla PT (Presión-Temp)', kw:'pt tabla presion temperatura saturacion refrigerante chart', s:'manifoldScreen', i:'📊' },
  { t:'Comercial HVAC', kw:'comercial commercial rooftop chiller vrf vrv package', s:'commercialHvacScreen', i:'🏢' },
  { t:'Calefacción (Heating)', kw:'heating furnace horno calefaccion gas electric', s:'heatingScreen', i:'🔥' },
  { t:'Bluetooth Tools', kw:'bluetooth fieldpiece ble sensor sman job link inalambrico', s:'bluetoothToolsScreen', i:'📡' },
  { t:'Fieldpiece SM480V', kw:'fieldpiece sm480v manifold digital bluetooth', s:'bluetoothToolsScreen', i:'📡' },
  { t:'Fieldpiece JL3RH', kw:'fieldpiece jl3rh hygrometer humedad bluetooth', s:'bluetoothToolsScreen', i:'📡' },
  { t:'Fieldpiece SC680', kw:'fieldpiece sc680 clamp meter amperimetro bluetooth', s:'bluetoothToolsScreen', i:'📡' },
  { t:'Fieldpiece SR47 Leak', kw:'fieldpiece sr47 detector fugas leak', s:'bluetoothToolsScreen', i:'🫧' },
  { t:'Fieldpiece FP4258', kw:'fieldpiece fp4258 multimeter bluetooth', s:'bluetoothToolsScreen', i:'📡' },

  // ===== NEGOCIOS =====
  { t:'Maestro Pro', kw:'maestro pro contratista empresa business negocio', s:'maestroProScreen', i:'💼' },
  { t:'Jornal Pro', kw:'jornal pro horas tiempo trabajo timesheet gps clock in out', s:'jornalProScreen', i:'⏱️' },
  { t:'Reloj / Punchar Horas', kw:'reloj punchar clock in out horas trabajo turno', s:'jornalProScreen', i:'⏰' },
  { t:'GPS Ruta Técnico', kw:'gps ruta mapa tracking ubicacion trabajador', s:'jornalProScreen', i:'🗺️' },
  { t:'Zona del Contratista', kw:'contratista zone licencia permits c20 california texas florida', s:'contractorZoneScreen', i:'📋' },
  { t:'Licencia C-20', kw:'c20 licencia contratista california hvac warm-air', s:'contractorZoneScreen', i:'📜' },
  { t:'Empleos / Job Board', kw:'empleos trabajos jobs puestos empleo contratando', s:'jobBoardScreen', i:'💼' },
  { t:'Publicar Empleo', kw:'publicar empleo post job vacante plaza', s:'jobBoardScreen', i:'➕' },
  { t:'Marketplace Técnicos', kw:'marketplace comprar vender herramientas usadas tools second hand', s:'marketplaceScreen', i:'🛒' },
  { t:'Vender Herramienta', kw:'vender sell publicar articulo herramienta usada', s:'marketplaceScreen', i:'💰' },
  { t:'Buscar Partes', kw:'partes repuestos parts finder refacciones oem', s:'partsFinderScreen', i:'🔍' },
  { t:'Facturas / Invoices', kw:'facturas invoices cobrar clientes facturar billing', s:'maestroInvoicesScreen', i:'🧾' },
  { t:'Crear Factura', kw:'crear factura nueva invoice cobrar cliente', s:'maestroInvoicesScreen', i:'➕' },
  { t:'Cotización / Estimate', kw:'cotizacion estimate quote presupuesto propuesta', s:'maestroInvoicesScreen', i:'📄' },
  { t:'Pre-Departure Check', kw:'pre departure antes salir truck camion inventario inspeccion', s:'preDepartureScreen', i:'✅' },
  { t:'Reporte PDF Servicio', kw:'reporte pdf cliente servicio service report orden trabajo', s:'herramientasScreen', i:'📄' },

  // ===== MEDIA & VIVO =====
  { t:'Clases en Vivo', kw:'vivo live zoom streaming clase maestro mario', s:'liveStreamingScreen', i:'🎥' },
  { t:'Clases Zoom', kw:'zoom meeting reunion link sala', s:'zoomClassesScreen', i:'📹' },
  { t:'Grabaciones Zoom', kw:'grabaciones zoom recordings pasadas clases anteriores', s:'zoomClassesScreen', i:'📼' },
  { t:'Radio HVAC', kw:'radio musica stream live365 background trabajando', s:'radioPodcastScreen', i:'📻' },
  { t:'Podcast HVAC', kw:'podcast audio episodio escuchar rato', s:'radioPodcastScreen', i:'🎙️' },
  { t:'Video Lecciones', kw:'video lecciones youtube tutorial curso aprender', s:'videoLessonsScreen', i:'🎬' },
  { t:'Video Tutoriales', kw:'tutorial paso a paso como reparar hacer', s:'videoTutorialesScreen', i:'📹' },

  // ===== SOCIAL & SOPORTE =====
  { t:'Amigos / Red', kw:'amigos friends tecnicos social comunidad network', s:'friendsScreen', i:'👥' },
  { t:'Chat Técnicos', kw:'chat mensajes tecnicos dm conversacion', s:'techChatScreen', i:'💬' },
  { t:'Feed HVAC Noticias', kw:'feed noticias news rss achr acr mundo hvacr', s:'hvacFeedScreen', i:'📰' },
  { t:'Soporte Técnico', kw:'soporte ayuda help support problema bug error reportar', s:'soporteTecnicoScreen', i:'🆘' },
  { t:'Sugerencias', kw:'sugerencias feedback opinion idea mejora', s:'sugerenciasScreen', i:'💭' },
  { t:'Contactar Mario', kw:'contactar mario maestro profesor instructor preguntar', s:'soporteTecnicoScreen', i:'👨‍🏫' },

  // ===== CUENTA =====
  { t:'Mi Perfil', kw:'perfil cuenta profile mi info datos personales', s:'miPerfilScreen', i:'👤' },
  { t:'Editar Perfil', kw:'editar cambiar perfil foto nombre telefono', s:'miPerfilScreen', i:'✏️' },
  { t:'Asistencia', kw:'asistencia attendance check in registro clase presente', s:'attendanceScreen', i:'✔️' },
  { t:'Cambiar Contraseña', kw:'contrasena password cambiar resetear cambio pw', s:'miPerfilScreen', i:'🔐' },
  { t:'Cerrar Sesión', kw:'cerrar sesion logout salir signout', s:'miPerfilScreen', i:'🚪' },
  { t:'Membresías', kw:'membresia suscripcion pagar plan premium upgrade', s:'membresiasScreen', i:'💳', iosHide:true },
  { t:'Planes de Pago', kw:'planes pagos mensual anual monthly yearly', s:'membresiasScreen', i:'💳', iosHide:true },
  { t:'Referidos', kw:'referidos referral codigo invitar comision ganar', s:'referidosScreen', i:'🎁', iosHide:true },

  // ===== ADMIN (staff only) =====
  { t:'Panel Admin', kw:'admin dashboard panel instructor crm staff', s:'adminDashboardScreen', i:'⚙️', adminOnly:true },
  { t:'CRM Estudiantes', kw:'crm estudiantes students gestionar manage', s:'adminDashboardScreen', i:'👥', adminOnly:true },
  { t:'Libros y Exámenes (Admin)', kw:'libros exams examenes admin crear editar', s:'adminDashboardScreen', i:'📚', adminOnly:true }
];

function openGlobalSearch() {
  var overlay = document.getElementById('globalSearchOverlay');
  if (!overlay) overlay = _gsBuild();
  overlay.style.display = 'flex';
  // Inline opacity beats stylesheet — set directly so overlay is actually visible.
  setTimeout(function(){
    overlay.classList.add('gs-active');
    overlay.style.opacity = '1';
    var card = document.getElementById('gsCard');
    if (card) card.style.transform = 'translateY(0)';
  }, 10);
  var input = document.getElementById('globalSearchInput');
  if (input) { input.value = ''; setTimeout(function(){ input.focus(); }, 120); }
  _gsRender(_gsSearch(''));
  try { if (window.Haptics && window.Haptics.selection) window.Haptics.selection(); } catch(e) {}
}

function closeGlobalSearch() {
  var overlay = document.getElementById('globalSearchOverlay');
  if (!overlay) return;
  overlay.classList.remove('gs-active');
  overlay.style.opacity = '0';
  var card = document.getElementById('gsCard');
  if (card) card.style.transform = 'translateY(-12px)';
  setTimeout(function(){ overlay.style.display = 'none'; }, 180);
}

function _gsBuild() {
  var wrap = document.createElement('div');
  wrap.id = 'globalSearchOverlay';
  wrap.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(17,17,17,0.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:2147483647;align-items:flex-start;justify-content:center;padding:60px 16px 16px;opacity:0;transition:opacity 180ms ease;';
  wrap.innerHTML =
    '<div id="gsCard" style="background:#fff;width:100%;max-width:560px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.25);overflow:hidden;transform:translateY(-12px);transition:transform 220ms cubic-bezier(0.32,0.72,0,1);">' +
      '<div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #E7E5DE;">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#8B8A82" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input id="globalSearchInput" type="search" placeholder="Buscar herramientas, exámenes, certificaciones..." autocomplete="off" spellcheck="false" aria-label="Búsqueda global" style="flex:1;border:0;outline:none;font-size:15px;color:#111;background:transparent;font-weight:500;">' +
        '<button type="button" aria-label="Cerrar búsqueda" onclick="closeGlobalSearch()" style="border:0;background:#f4f4f2;color:#8B8A82;width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer;line-height:1;">✕</button>' +
      '</div>' +
      '<div id="gsResults" role="listbox" aria-label="Resultados" style="max-height:56vh;overflow-y:auto;padding:6px 0 8px;"></div>' +
      '<div style="padding:8px 14px 12px;border-top:1px solid #F4F2ED;font-size:11px;color:#8B8A82;display:flex;justify-content:space-between;">' +
        '<span>↑↓ navegar · ↵ abrir · esc cerrar</span>' +
        '<span>' + GLOBAL_SEARCH_INDEX.length + ' destinos</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var style = document.createElement('style');
  style.textContent = '#globalSearchOverlay.gs-active{opacity:1;}#globalSearchOverlay.gs-active #gsCard{transform:translateY(0);}.gs-row{display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;border-left:3px solid transparent;transition:background 120ms ease;}.gs-row:hover,.gs-row.gs-hl{background:#FFF3EC;border-left-color:#E8591C;}.gs-row .gs-icon{font-size:22px;width:32px;text-align:center;flex-shrink:0;}.gs-row .gs-title{font-size:14px;color:#111;font-weight:600;line-height:1.25;}.gs-row .gs-sub{font-size:11px;color:#8B8A82;margin-top:2px;}.gs-empty{padding:32px 16px;text-align:center;color:#8B8A82;font-size:13px;}';
  document.head.appendChild(style);

  wrap.addEventListener('click', function(e){ if (e.target === wrap) closeGlobalSearch(); });

  var input = wrap.querySelector('#globalSearchInput');
  input.addEventListener('input', function(){ _gsRender(_gsSearch(input.value)); });
  input.addEventListener('keydown', function(e){
    if (e.key === 'Escape') { closeGlobalSearch(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); _gsMoveHl(e.key === 'ArrowDown' ? 1 : -1); return; }
    if (e.key === 'Enter') { e.preventDefault(); _gsActivateHl(); }
  });

  return wrap;
}

function _gsNormalize(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .trim();
}

function _gsSearch(q) {
  var query = _gsNormalize(q);
  var isAdmin = !!(window.currentUser && (window.currentUser.is_staff || window.currentUser.is_admin || window.currentUser.rol === 'admin'));
  var isIOS = !!window.isIOSAppStore;
  if (!query) {
    var def = [];
    for (var d = 0; d < GLOBAL_SEARCH_INDEX.length && def.length < 12; d++) {
      var it = GLOBAL_SEARCH_INDEX[d];
      if (it.adminOnly && !isAdmin) continue;
      if (it.iosHide && isIOS) continue;
      def.push(it);
    }
    return def;
  }
  var terms = query.split(/\s+/).filter(Boolean);
  var scored = [];
  for (var i = 0; i < GLOBAL_SEARCH_INDEX.length; i++) {
    var item = GLOBAL_SEARCH_INDEX[i];
    if (item.adminOnly && !isAdmin) continue;
    if (item.iosHide && isIOS) continue;
    var haystack = _gsNormalize(item.t + ' ' + (item.kw || ''));
    var score = 0, matched = true;
    for (var j = 0; j < terms.length; j++) {
      var idx = haystack.indexOf(terms[j]);
      if (idx < 0) { matched = false; break; }
      score += (idx === 0 ? 100 : (idx < 8 ? 40 : 10));
      if (_gsNormalize(item.t).indexOf(terms[j]) >= 0) score += 50;
    }
    if (matched) scored.push({ item: item, score: score });
  }
  scored.sort(function(a,b){ return b.score - a.score; });
  return scored.slice(0, 15).map(function(x){ return x.item; });
}

function _gsRender(results) {
  var box = document.getElementById('gsResults');
  if (!box) return;
  if (!results || !results.length) {
    box.innerHTML = '<div class="gs-empty">Sin resultados. Intenta con otra palabra.</div>';
    return;
  }
  var html = '';
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    html += '<div class="gs-row' + (i === 0 ? ' gs-hl' : '') + '" data-gs-idx="' + i + '" role="option">' +
      '<div class="gs-icon" aria-hidden="true">' + r.i + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div class="gs-title">' + _gsEscape(r.t) + '</div>' +
        '<div class="gs-sub">' + _gsEscape((r.kw || '').split(' ').slice(0,4).join(' · ')) + '</div>' +
      '</div>' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C9C7C0" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</div>';
  }
  box.innerHTML = html;
  box._gsResults = results;
  var rows = box.querySelectorAll('.gs-row');
  for (var k = 0; k < rows.length; k++) {
    (function(row){
      row.addEventListener('click', function(){
        var idx = parseInt(row.getAttribute('data-gs-idx'), 10);
        _gsGoto(box._gsResults[idx]);
      });
    })(rows[k]);
  }
}

function _gsEscape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function _gsMoveHl(dir) {
  var rows = document.querySelectorAll('#gsResults .gs-row');
  if (!rows.length) return;
  var cur = -1;
  for (var i = 0; i < rows.length; i++) if (rows[i].classList.contains('gs-hl')) { cur = i; break; }
  if (cur >= 0) rows[cur].classList.remove('gs-hl');
  var next = cur + dir;
  if (next < 0) next = rows.length - 1;
  if (next >= rows.length) next = 0;
  rows[next].classList.add('gs-hl');
  rows[next].scrollIntoView({ block: 'nearest' });
}

function _gsActivateHl() {
  var box = document.getElementById('gsResults');
  if (!box || !box._gsResults) return;
  var rows = box.querySelectorAll('.gs-row');
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].classList.contains('gs-hl')) { _gsGoto(box._gsResults[i]); return; }
  }
  if (box._gsResults[0]) _gsGoto(box._gsResults[0]);
}

function _gsGoto(item) {
  if (!item) return;
  closeGlobalSearch();
  setTimeout(function(){
    try {
      if (typeof showScreen === 'function') {
        showScreen(item.s);
      } else {
        location.hash = '#' + item.s;
      }
    } catch (e) { console.warn('[GlobalSearch]', e.message || e); }
  }, 100);
}

window.openGlobalSearch = openGlobalSearch;
window.closeGlobalSearch = closeGlobalSearch;

function _gsDbg(msg) {
  try { if (window.MaestroDbg && window.MaestroDbg.log) window.MaestroDbg.log('[gs] ' + msg); } catch(_){}
  try { console.log('[GlobalSearch]', msg); } catch(_){}
}

function _gsSafeOpen(e) {
  _gsDbg('tap received');
  if (e) { try { e.preventDefault(); } catch(_){} }
  try { openGlobalSearch(); _gsDbg('overlay opened'); }
  catch (err) {
    _gsDbg('open failed: ' + (err && err.message ? err.message : err));
    try { if (window.MaestroErrorTracker && window.MaestroErrorTracker.toast) window.MaestroErrorTracker.toast('Búsqueda falló: ' + (err.message || err)); } catch(_){}
  }
}

// Bind directly on every Buscar button (click only — touchend preventDefault was killing iOS synthetic click).
function _gsBindButton() {
  var btns = document.querySelectorAll('[data-action="global-search"]');
  for (var i = 0; i < btns.length; i++) {
    if (btns[i]._gsBound) continue;
    btns[i]._gsBound = true;
    btns[i].style.position = 'relative';
    btns[i].style.zIndex = '2147483640';
    btns[i].addEventListener('click', _gsSafeOpen);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _gsBindButton);
} else {
  _gsBindButton();
}

if (window.MutationObserver) {
  var _gsMo = new MutationObserver(function(){ _gsBindButton(); });
  try { _gsMo.observe(document.body, { childList: true, subtree: true }); } catch(_){}
}

// Window-level capture handler — bulletproof fallback that runs BEFORE any other handler can stopPropagation.
window.addEventListener('click', function(e){
  var btn = e.target && e.target.closest ? e.target.closest('[data-action="global-search"]') : null;
  if (btn) { _gsDbg('window-capture caught tap'); _gsSafeOpen(e); }
}, true);

document.addEventListener('keydown', function(e){
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault(); _gsSafeOpen();
  }
});

// Native-link trigger — the Buscar nav item is an <a href="#globalSearch">.
// hashchange fires regardless of any preventDefault or broken JS — it's the browser's own navigation.
function _gsCheckHash() {
  if (window.location.hash === '#globalSearch') {
    _gsDbg('hashchange → opening');
    _gsSafeOpen();
    setTimeout(function(){
      if (history && history.replaceState) {
        try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch(_){}
      }
    }, 50);
  }
}
window.addEventListener('hashchange', _gsCheckHash);
if (window.location.hash === '#globalSearch') { setTimeout(_gsCheckHash, 200); }

// Expose safe opener for inline onclick / external callers
window.openGlobalSearchSafe = _gsSafeOpen;

_gsDbg('v5.89 loaded (opacity inline fix), ' + GLOBAL_SEARCH_INDEX.length + ' destinos');
