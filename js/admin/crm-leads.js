// ==================== 📋 CRM DE LEADS (30-sep-2026, Mario: «un CRM para los leads, así como Bitrix24») ====================
// Tablero por etapas (arrastrar en compu · «Mover a» en el teléfono), tarjeta con historial, botones 📞 💬 que se
// registran solos, siguiente tarea con fecha (crm-recordatorios manda el SMS cuando se vence) y alta manual.
// Todo por RPC de personal activo: crm_pipeline / crm_lead_historial / crm_lead_mover / crm_lead_actividad /
// crm_lead_tarea / crm_lead_asignar / crm_lead_crear (es_staff_activo() con el JWT). Etapa 'descartado' = «Perdido».
(function () {
  'use strict';
  var ETAPAS = [
    ['nuevo', '🆕 Nuevo', '#ed342b'], ['contactado', '📞 Contactado', '#d97706'], ['cita', '📅 Cita / visita', '#7c3aed'],
    ['interesado', '🔥 Interesado', '#db2777'], ['inscrito', '✅ Inscrito', '#16a34a'], ['descartado', '🗂️ Perdido', '#64748b']
  ];
  var ASESORAS = ['Brenda Lagunas', 'Marisol Flores Lagunas'];
  var FUENTE = { formulario: '📝 Formulario', chat: '🤖 Chat', manual: '✍️ Manual' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tel = function (t) { var d = String(t || '').replace(/\D/g, ''); return d.length === 10 ? '1' + d : d; };
  var hace = function (iso) {
    if (!iso) return ''; var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return 'ahora'; if (m < 60) return 'hace ' + m + ' min'; var h = Math.round(m / 60); if (h < 24) return 'hace ' + h + ' h'; return 'hace ' + Math.round(h / 24) + ' d';
  };
  var fechaCorta = function (iso) { try { return new Date(iso).toLocaleString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (_) { return iso; } };
  var leads = [], filtro = '', busca = '', abierto = null;

  function montar() {
    if (document.getElementById('adminCrmLeads')) return true;
    var ancla = document.getElementById('adminAnaliticosSitio') || document.getElementById('adminProspectos') || document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var st = document.createElement('style');
    st.textContent =
      '#adminCrmLeads{background:#fff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}' +
      '#crmTablero{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(250px,1fr);gap:10px;overflow-x:auto;padding:4px 2px 10px;scroll-snap-type:x mandatory}' +
      '.crm-col{background:#f1f5f9;border-radius:12px;padding:8px;min-height:180px;scroll-snap-align:start;display:flex;flex-direction:column;gap:8px}' +
      '.crm-col.sobre{outline:3px dashed #065cff;outline-offset:-3px;background:#eef4ff}' +
      '.crm-col h4{margin:2px 4px 2px;font-size:14px;display:flex;justify-content:space-between;align-items:center}' +
      '.crm-card{background:#fff;border:1px solid #e2e8f0;border-left:4px solid var(--c);border-radius:10px;padding:9px 10px;cursor:pointer;font-size:13px;line-height:1.35}' +
      '.crm-card:hover{box-shadow:0 2px 8px rgba(15,35,66,.12)}.crm-card b{font-size:14.5px;color:#0f2342}' +
      '.crm-chip{display:inline-block;border-radius:999px;padding:1px 8px;font-size:11.5px;font-weight:800;margin:3px 4px 0 0}' +
      '#crmFondo{position:fixed;inset:0;background:rgba(2,14,32,.55);z-index:9998;display:flex;justify-content:flex-end}' +
      '#crmFicha{background:#fff;width:min(560px,100%);height:100%;overflow-y:auto;padding:16px 18px 30px;box-sizing:border-box}' +
      '#crmFicha button,#adminCrmLeads button{font:inherit;cursor:pointer}' +
      '.crm-btn{border:0;border-radius:10px;padding:9px 12px;font-weight:800;color:#fff}' +
      '.crm-etapa{border:2px solid #cbd5e1;background:#fff;border-radius:999px;padding:5px 10px;font-weight:800;font-size:12.5px}' +
      '.crm-campo{display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:9px 10px;border:1px solid #94a3b8;border-radius:9px;font:inherit;font-size:15px}';
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full'; sec.id = 'adminCrmLeads';
    sec.appendChild(st);
    var cab = document.createElement('div');
    cab.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">' +
      '<h3 style="margin:0;color:#0f2342">📋 CRM de leads</h3>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap"><button id="crmNuevo" class="crm-btn" style="background:#16a34a">＋ Nuevo lead</button>' +
      '<button id="crmRecargar" class="crm-btn" style="background:#065cff">🔄</button></div></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px"><div id="crmFiltros" style="display:flex;gap:6px;flex-wrap:wrap"></div>' +
      '<input id="crmBusca" placeholder="Buscar nombre, teléfono, correo…" style="flex:1;min-width:180px;padding:7px 10px;border:1px solid #cbd5e1;border-radius:999px;font:inherit"></div>' +
      '<p id="crmResumen" style="margin:0 0 8px;color:#475569;font-size:13px"></p>' +
      '<div id="crmTablero"><p style="color:#64748b">Cargando…</p></div>' +
      '<p style="margin:6px 0 0;color:#64748b;font-size:12px">En la compu arrastra la tarjeta a otra columna; en el teléfono ábrela y toca la etapa. 📞 y 💬 quedan registrados solos en el historial.</p>';
    sec.appendChild(cab);
    ancla.parentNode.insertBefore(sec, ancla);
    document.getElementById('crmRecargar').onclick = cargar;
    document.getElementById('crmNuevo').onclick = altaManual;
    document.getElementById('crmBusca').oninput = function (e) { busca = e.target.value.toLowerCase(); pintar(); };
    cargar();
    setInterval(function () { if (!document.getElementById('crmFondo')) cargar(); }, 120000);   // llegan leads nuevos solos
    return true;
  }

  async function cargar() {
    var tab = document.getElementById('crmTablero'); if (!tab) return;
    if (!window.supabaseClient) { tab.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await supabaseClient.rpc('crm_pipeline', { p_responsable: null });
    // supabase-js NO lanza: un error no es «cero leads».
    if (r.error) { tab.innerHTML = '<p style="color:#b91c1c">No se pudo cargar: ' + esc(r.error.message) + '</p>'; return; }
    leads = r.data || [];
    pintar();
    if (abierto) { var l = leads.find(function (x) { return x.id === abierto; }); if (l) ficha(l); }
  }

  function visibles() {
    return leads.filter(function (l) {
      if (filtro && l.responsable !== filtro) return false;
      if (busca && (l.nombre + ' ' + (l.telefono || '') + ' ' + (l.correo || '') + ' ' + (l.interes || '')).toLowerCase().indexOf(busca) === -1) return false;
      return true;
    });
  }

  function pintar() {
    var f = document.getElementById('crmFiltros'); f.innerHTML = '';
    [['', 'Todas'], ['Brenda Lagunas', 'Brenda'], ['Marisol Flores Lagunas', 'Marisol']].forEach(function (o) {
      var n = o[0] ? leads.filter(function (l) { return l.responsable === o[0]; }).length : leads.length;
      var b = document.createElement('button'); b.textContent = o[1] + ' (' + n + ')';
      b.style.cssText = 'border:1px solid #cbd5e1;border-radius:999px;padding:5px 12px;font-weight:800;background:' + (filtro === o[0] ? '#0f2342;color:#fff' : '#fff;color:#0f2342');
      b.onclick = function () { filtro = o[0]; pintar(); };
      f.appendChild(b);
    });
    var vis = visibles(), ahora = Date.now();
    var vencidas = vis.filter(function (l) { return l.siguiente_fecha && new Date(l.siguiente_fecha).getTime() <= ahora; }).length;
    var sinLlamar = vis.filter(function (l) { return l.estado === 'nuevo' && !l.ultimo_contacto; }).length;
    document.getElementById('crmResumen').innerHTML = '<b>' + vis.length + '</b> leads · ' +
      (sinLlamar ? '<b style="color:#b91c1c">' + sinLlamar + ' sin llamar</b> · ' : '') +
      (vencidas ? '<b style="color:#b91c1c">⏰ ' + vencidas + ' tareas vencidas</b>' : 'sin tareas vencidas');
    var tab = document.getElementById('crmTablero'); tab.innerHTML = '';
    ETAPAS.forEach(function (e) {
      var col = document.createElement('div'); col.className = 'crm-col'; col.dataset.etapa = e[0];
      var suyos = vis.filter(function (l) { return (l.estado || 'nuevo') === e[0]; });
      col.innerHTML = '<h4 style="color:' + e[2] + '"><span>' + e[1] + '</span><span style="background:' + e[2] + ';color:#fff;border-radius:999px;padding:0 9px;font-size:12px">' + suyos.length + '</span></h4>';
      suyos.forEach(function (l) { col.appendChild(tarjeta(l, e[2])); });
      col.addEventListener('dragover', function (ev) { ev.preventDefault(); col.classList.add('sobre'); });
      col.addEventListener('dragleave', function () { col.classList.remove('sobre'); });
      col.addEventListener('drop', function (ev) { ev.preventDefault(); col.classList.remove('sobre'); var id = ev.dataTransfer.getData('text/plain'); if (id) mover(id, e[0]); });
      tab.appendChild(col);
    });
  }

  function tarjeta(l, color) {
    var c = document.createElement('div'); c.className = 'crm-card'; c.draggable = true; c.style.setProperty('--c', color);
    var vencida = l.siguiente_fecha && new Date(l.siguiente_fecha).getTime() <= Date.now();
    c.innerHTML = '<b>' + esc(l.nombre) + '</b>' +
      '<div style="color:#334155">' + esc(l.interes || '—') + '</div>' +
      '<div><span class="crm-chip" style="background:#eef4ff;color:#065cff">' + (FUENTE[l.fuente] || esc(l.fuente)) + '</span>' +
      (l.responsable ? '<span class="crm-chip" style="background:#f3e8ff;color:#7c3aed">👤 ' + esc(String(l.responsable).split(' ')[0]) + '</span>' : '<span class="crm-chip" style="background:#fee2e2;color:#b91c1c">sin asignar</span>') + '</div>' +
      (l.siguiente_tarea ? '<div class="crm-chip" style="background:' + (vencida ? '#fee2e2;color:#b91c1c' : '#fef9c3;color:#854d0e') + '">⏰ ' + esc(l.siguiente_tarea).slice(0, 40) + ' · ' + esc(fechaCorta(l.siguiente_fecha)) + '</div>' : '') +
      '<div style="color:#64748b;font-size:11.5px;margin-top:3px">Llegó ' + hace(l.created_at) + (l.ultimo_contacto ? ' · contacto ' + hace(l.ultimo_contacto) : (l.estado === 'nuevo' ? ' · <b style="color:#b91c1c">sin llamar</b>' : '')) + '</div>';
    c.addEventListener('dragstart', function (ev) { ev.dataTransfer.setData('text/plain', l.id); });
    c.onclick = function () { ficha(l); };
    return c;
  }

  async function mover(id, etapa) {
    var l = leads.find(function (x) { return x.id === id; }); if (!l || l.estado === etapa) return;
    l.estado = etapa; pintar();                                   // se ve al instante; la base confirma
    var r = await supabaseClient.rpc('crm_lead_mover', { p_id: id, p_estado: etapa });
    if (r.error || r.data !== true) alert('No se pudo mover: ' + ((r.error && r.error.message) || 'sin cambios'));
    cargar();
  }

  async function registrar(id, tipo, texto) {
    var r = await supabaseClient.rpc('crm_lead_actividad', { p_id: id, p_tipo: tipo, p_texto: texto || null });
    if (r.error) alert('No se registró: ' + r.error.message);
    await cargar();
  }

  function ficha(l) {
    abierto = l.id;
    var fondo = document.getElementById('crmFondo');
    if (!fondo) { fondo = document.createElement('div'); fondo.id = 'crmFondo'; fondo.onclick = function (e) { if (e.target === fondo) cerrar(); }; document.body.appendChild(fondo); }
    var o = l.origen || {}, anuncio = [o.utm_source || (o.fbclid ? 'facebook' : o.ttclid ? 'tiktok' : ''), o.utm_campaign].filter(Boolean).join(' / ');
    fondo.innerHTML = '<div id="crmFicha">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div><h3 style="margin:0;color:#0f2342">' + esc(l.nombre) + '</h3>' +
      '<div style="color:#475569;font-size:13.5px">' + esc(l.interes || '') + (l.modalidad ? ' · ' + esc(l.modalidad) : '') + '</div>' +
      '<div style="color:#64748b;font-size:12.5px">' + (FUENTE[l.fuente] || esc(l.fuente)) + (anuncio ? ' · 📣 ' + esc(anuncio) : '') + ' · llegó ' + hace(l.created_at) + '</div></div>' +
      '<button data-a="cerrar" style="border:0;background:#f1f5f9;border-radius:50%;width:36px;height:36px;font-size:18px">✕</button></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">' +
      (l.telefono ? '<a data-a="llamar" href="tel:+' + tel(l.telefono) + '" class="crm-btn" style="background:#065cff;text-decoration:none">📞 Llamar ' + esc(l.telefono) + '</a>' +
        '<a data-a="whatsapp" target="_blank" rel="noopener" href="https://wa.me/' + tel(l.telefono) + '" class="crm-btn" style="background:#16a34a;text-decoration:none">💬 WhatsApp</a>' : '') +
      (l.correo ? '<a href="mailto:' + esc(l.correo) + '" class="crm-btn" style="background:#475569;text-decoration:none">✉️ ' + esc(l.correo) + '</a>' : '') + '</div>' +
      '<div style="font-weight:800;font-size:13px;color:#475569;margin-top:6px">ETAPA</div><div data-etapas style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 12px"></div>' +
      '<div style="font-weight:800;font-size:13px;color:#475569">ASESORA</div><select data-a="asesora" class="crm-campo" style="margin-bottom:12px"><option value="">Sin asignar</option>' +
      ASESORAS.map(function (a) { return '<option' + (l.responsable === a ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select>' +
      '<div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:10px 12px;margin-bottom:12px">' +
      '<div style="font-weight:800;color:#854d0e">⏰ Siguiente paso</div>' +
      (l.siguiente_tarea ? '<p style="margin:6px 0">' + esc(l.siguiente_tarea) + ' · <b>' + esc(fechaCorta(l.siguiente_fecha)) + '</b> <button data-a="hecha" class="crm-btn" style="background:#16a34a;padding:4px 10px;margin-left:6px">✓ Hecho</button></p>' : '<p style="margin:6px 0;color:#92400e">Sin tarea. Ponle una para que no se enfríe.</p>') +
      '<input data-a="tareaTxt" class="crm-campo" placeholder="Ej. Llamar para confirmar la visita" value="">' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;align-items:center"><input data-a="tareaFecha" type="datetime-local" class="crm-campo" style="flex:1;min-width:190px;margin:0">' +
      '<button data-rapido="60" class="crm-etapa">En 1 h</button><button data-rapido="manana" class="crm-etapa">Mañana 10 AM</button>' +
      '<button data-a="tarea" class="crm-btn" style="background:#d97706">Guardar tarea</button></div>' +
      '<p style="margin:6px 0 0;font-size:12px;color:#92400e">A la hora, le llega un SMS a la asesora.</p></div>' +
      '<div style="font-weight:800;font-size:13px;color:#475569">NOTA</div><textarea data-a="notaTxt" rows="2" class="crm-campo" placeholder="Qué dijo, qué necesita, cuándo puede…"></textarea>' +
      '<button data-a="nota" class="crm-btn" style="background:#0f2342;margin:6px 0 14px">Guardar nota</button>' +
      (l.resumen ? '<details style="margin-bottom:12px"><summary style="cursor:pointer;font-weight:800;color:#475569">Lo que contó al llegar</summary><p style="font-size:13.5px;color:#334155">' + esc(l.resumen) + '</p></details>' : '') +
      '<div style="font-weight:800;font-size:13px;color:#475569">HISTORIAL</div><div data-historial style="font-size:13px;color:#334155">Cargando…</div></div>';
    var F = document.getElementById('crmFicha');
    var et = F.querySelector('[data-etapas]');
    ETAPAS.forEach(function (e) {
      var b = document.createElement('button'); b.className = 'crm-etapa'; b.textContent = e[1];
      if ((l.estado || 'nuevo') === e[0]) { b.style.background = e[2]; b.style.color = '#fff'; b.style.borderColor = e[2]; }
      b.onclick = function () { mover(l.id, e[0]); };
      et.appendChild(b);
    });
    F.querySelector('[data-a="cerrar"]').onclick = cerrar;
    var ll = F.querySelector('[data-a="llamar"]'); if (ll) ll.addEventListener('click', function () { setTimeout(function () { var n = prompt('¿Cómo fue la llamada? (opcional)', ''); registrar(l.id, 'llamada', n); }, 600); });
    var wa = F.querySelector('[data-a="whatsapp"]'); if (wa) wa.addEventListener('click', function () { registrar(l.id, 'whatsapp', 'Abrió WhatsApp'); });
    F.querySelector('[data-a="asesora"]').onchange = async function (e) { var r = await supabaseClient.rpc('crm_lead_asignar', { p_id: l.id, p_responsable: e.target.value }); if (r.error) alert(r.error.message); cargar(); };
    F.querySelector('[data-a="nota"]').onclick = function () { var t = F.querySelector('[data-a="notaTxt"]').value.trim(); if (t) registrar(l.id, 'nota', t); };
    var fechaIn = F.querySelector('[data-a="tareaFecha"]');
    var local = function (d) { var z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 16); };
    F.querySelectorAll('[data-rapido]').forEach(function (b) {
      b.onclick = function () { var d = new Date(); if (b.dataset.rapido === 'manana') { d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); } else d = new Date(Date.now() + 3600e3); fechaIn.value = local(d); };
    });
    F.querySelector('[data-a="tarea"]').onclick = async function () {
      var t = F.querySelector('[data-a="tareaTxt"]').value.trim() || 'Dar seguimiento';
      if (!fechaIn.value) { alert('Escoge la fecha y hora.'); return; }
      var r = await supabaseClient.rpc('crm_lead_tarea', { p_id: l.id, p_texto: t, p_fecha: new Date(fechaIn.value).toISOString() });
      if (r.error) alert(r.error.message); cargar();
    };
    var hecha = F.querySelector('[data-a="hecha"]'); if (hecha) hecha.onclick = async function () { var r = await supabaseClient.rpc('crm_lead_tarea', { p_id: l.id, p_texto: '', p_fecha: null }); if (r.error) alert(r.error.message); cargar(); };
    historial(l.id);
  }

  async function historial(id) {
    var h = document.querySelector('#crmFicha [data-historial]'); if (!h) return;
    var r = await supabaseClient.rpc('crm_lead_historial', { p_id: id });
    if (r.error) { h.textContent = 'No se pudo cargar: ' + r.error.message; return; }
    var ICON = { creado: '🆕', etapa: '➡️', llamada: '📞', whatsapp: '💬', nota: '📝', tarea: '⏰', tarea_hecha: '✅', sms: '📲', asignado: '👤' };
    h.innerHTML = (r.data || []).map(function (a) {
      return '<div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid #f1f5f9"><span>' + (ICON[a.tipo] || '•') + '</span><div><div>' + esc(a.texto || a.tipo) + '</div>' +
        '<div style="color:#94a3b8;font-size:11.5px">' + esc(String(a.quien || '').split(' ')[0]) + ' · ' + esc(fechaCorta(a.creado)) + '</div></div></div>';
    }).join('') || '<p style="color:#94a3b8">Sin actividad todavía.</p>';
  }

  function cerrar() { abierto = null; var f = document.getElementById('crmFondo'); if (f) f.remove(); }

  function altaManual() {
    var fondo = document.createElement('div'); fondo.id = 'crmFondo'; fondo.onclick = function (e) { if (e.target === fondo) fondo.remove(); };
    fondo.innerHTML = '<form id="crmFicha" novalidate><h3 style="margin:0 0 10px;color:#0f2342">＋ Nuevo lead</h3>' +
      '<label>Nombre completo<input name="nombre" class="crm-campo" required></label>' +
      '<label>Teléfono / WhatsApp<input name="telefono" type="tel" class="crm-campo"></label>' +
      '<label>Correo<input name="correo" type="email" class="crm-campo"></label>' +
      '<label>¿Qué le interesa?<select name="interes" class="crm-campo"><option>Carrera de HVAC</option><option>Carrera de Refrigeración</option><option>Carrera de Electricidad</option><option>Membresía web $149</option><option>Programa en línea $750</option><option>Certificaciones</option><option>Empresa</option><option>Otro</option></select></label>' +
      '<label>¿De dónde llegó?<select name="fuente" class="crm-campo"><option>visita a la oficina</option><option>llamada</option><option>WhatsApp</option><option>referido</option><option>cliente que ya tenía</option><option>evento</option><option>redes sociales</option><option>otro</option></select></label>' +
      '<label>Asesora<select name="responsable" class="crm-campo">' + ASESORAS.map(function (a) { return '<option>' + a + '</option>'; }).join('') + '</select></label>' +
      '<label>Nota<textarea name="notas" rows="2" class="crm-campo"></textarea></label>' +
      '<div style="display:flex;gap:8px;margin-top:12px"><button type="submit" class="crm-btn" style="background:#16a34a">Guardar</button><button type="button" data-a="cerrar" class="crm-btn" style="background:#64748b">Cancelar</button></div>' +
      '<p data-msg style="color:#b91c1c;font-weight:700"></p></form>';
    document.body.appendChild(fondo);
    var f = document.getElementById('crmFicha');
    f.querySelector('[data-a="cerrar"]').onclick = function () { fondo.remove(); };
    f.onsubmit = async function (e) {
      e.preventDefault(); var m = f.querySelector('[data-msg]');
      if (f.nombre.value.trim().length < 2) { m.textContent = 'Escribe el nombre.'; return; }
      if (!f.telefono.value.trim() && !f.correo.value.trim()) { m.textContent = 'Pon teléfono o correo.'; return; }
      var r = await supabaseClient.rpc('crm_lead_crear', { p_nombre: f.nombre.value, p_telefono: f.telefono.value, p_correo: f.correo.value, p_interes: f.interes.value, p_responsable: f.responsable.value, p_fuente: f.fuente.value, p_notas: f.notas.value || null });
      if (r.error) { m.textContent = 'No se guardó: ' + r.error.message; return; }
      fondo.remove(); cargar();
    };
  }

  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.cargarCrmLeads = cargar;
})();
