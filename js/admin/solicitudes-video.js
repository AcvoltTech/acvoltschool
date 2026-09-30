// ==================== VIDEOS PARA EL EDITOR (30-sep-2026, Mario) ====================
// El equipo pide un video → le llega SMS a Manuel Saldaña (editor) → Manuel lo marca «en edición» / «entregado»
// con el enlace. Pedir pasa por la función solicitud-video (valida personal activo y manda el SMS); listar y
// actualizar por RPC que revisan es_staff_activo(). Se monta junto a Miembros web / Prospectos.
(function () {
  'use strict';
  var URL_ = 'https://htklsowiyjwsjnacnvnr.supabase.co/functions/v1/solicitud-video';
  var ESTADOS = [['pendiente', '🆕 Pendiente'], ['en_edicion', '✂️ En edición'], ['entregado', '✅ Entregado'], ['cancelado', '🗂️ Cancelado']];
  var PARA = ['Anuncio', 'Redes sociales', 'Clase / curso', 'Video de refuerzo', 'Otro'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var campo = 'padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit';

  function montar() {
    if (document.getElementById('adminVideosEditor')) return true;
    var ancla = document.getElementById('adminMiembrosWeb') || document.getElementById('adminProspectos') || document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full'; sec.id = 'adminVideosEditor';
    sec.style.cssText = 'background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);';
    sec.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">' +
      '<h3 style="margin:0;color:#0f2342">🎬 Videos para el editor (Manuel)</h3>' +
      '<button id="vedRecargar" style="background:#065cff;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700">🔄 Actualizar</button></div>' +
      '<form id="vedForm" style="display:grid;gap:8px;margin-bottom:12px;padding:12px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0">' +
      '<input name="titulo" placeholder="¿Qué video necesitas? (ej. Anuncio 30 s: clases en vivo)" style="' + campo + '">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><select name="para" style="' + campo + '">' + PARA.map(function (p) { return '<option>' + p + '</option>'; }).join('') + '</select>' +
      '<label style="display:flex;gap:6px;align-items:center;font-size:13px;color:#334155">Para cuándo <input name="fecha_limite" type="date" style="' + campo + '"></label></div>' +
      '<textarea name="detalle" rows="2" placeholder="Detalles: material a usar, duración, texto en pantalla, enlace a la clase…" style="' + campo + '"></textarea>' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button type="submit" style="background:#16a34a;color:#fff;border:0;border-radius:8px;padding:9px 16px;cursor:pointer;font-weight:800">Pedir video (le llega SMS a Manuel)</button>' +
      '<span id="vedMsg" style="font-size:13px;font-weight:700"></span></div></form>' +
      '<div id="vedLista" style="display:grid;gap:10px"><p style="color:#64748b">Cargando…</p></div>';
    ancla.parentNode.insertBefore(sec, ancla.nextSibling);
    var nav = document.getElementById('navMiembrosWeb') || document.getElementById('navProspectos') || document.querySelector('.admin-nav-btn');
    if (nav && nav.parentNode && !document.getElementById('navVideosEditor')) {
      var b = document.createElement('button'); b.id = 'navVideosEditor'; b.className = 'admin-nav-btn'; b.textContent = '🎬 Videos';
      b.onclick = function () { sec.scrollIntoView({ behavior: 'smooth' }); };
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
    document.getElementById('vedRecargar').onclick = cargar;
    document.getElementById('vedForm').onsubmit = pedir;
    cargar();
    return true;
  }

  async function pedir(e) {
    e.preventDefault();
    var f = e.target, msg = document.getElementById('vedMsg'), btn = f.querySelector('button');
    if (String(f.titulo.value).trim().length < 3) { msg.style.color = '#b91c1c'; msg.textContent = 'Escribe qué video necesitas.'; return; }
    btn.disabled = true; msg.style.color = '#64748b'; msg.textContent = 'Enviando…';
    try {
      var s = window.supabaseClient && (await supabaseClient.auth.getSession()).data.session;
      if (!s) throw Error('Inicia sesión otra vez.');
      var r = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.access_token },
        body: JSON.stringify({ titulo: f.titulo.value, para: f.para.value, fecha_limite: f.fecha_limite.value, detalle: f.detalle.value }) });
      var j = await r.json().catch(function () { return {}; });
      if (!r.ok || !j.ok) throw Error(j.error || 'No se guardó.');
      msg.style.color = '#16a34a'; msg.textContent = j.aviso_enviado ? '✅ Pedido. Manuel ya recibió el SMS.' : '✅ Guardado, pero el SMS a Manuel no salió: avísale por WhatsApp.';
      f.reset(); cargar();
    } catch (err) { msg.style.color = '#b91c1c'; msg.textContent = (err && err.message) || 'No se guardó.'; }
    finally { btn.disabled = false; }
  }

  async function cargar() {
    var lista = document.getElementById('vedLista'); if (!lista) return;
    if (!window.supabaseClient) { lista.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await supabaseClient.rpc('crm_solicitudes_video');
    if (r.error) { lista.innerHTML = '<p style="color:#b91c1c">No se pudieron cargar: ' + esc(r.error.message) + '</p>'; return; }
    var todos = r.data || [];
    if (!todos.length) { lista.innerHTML = '<p style="color:#64748b">No hay videos pedidos todavía.</p>'; return; }
    lista.innerHTML = '';
    todos.forEach(function (v) {
      var card = document.createElement('div');
      var color = { pendiente: '#ed342b', en_edicion: '#d97706', entregado: '#16a34a', cancelado: '#94a3b8' }[v.estado] || '#065cff';
      card.style.cssText = 'border:1px solid #e2e8f0;border-left:4px solid ' + color + ';border-radius:10px;padding:10px 14px';
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b style="color:#0f2342">' + esc(v.titulo) + '</b>' +
        '<span style="color:#64748b;font-size:12px">' + esc(v.para || '') + (v.fecha_limite ? ' · para el ' + esc(v.fecha_limite) : '') + ' · pidió ' + esc(v.solicitado_por || '—') + '</span></div>' +
        (v.detalle ? '<p style="margin:6px 0;font-size:13.5px;color:#334155">' + esc(v.detalle) + '</p>' : '') +
        (v.enlace_entrega ? '<p style="margin:4px 0;font-size:13.5px">📎 <a target="_blank" rel="noopener" href="' + esc(v.enlace_entrega) + '">Video entregado</a></p>' : '') +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px">' +
        '<select data-f="estado">' + ESTADOS.map(function (e) { return '<option value="' + e[0] + '"' + (v.estado === e[0] ? ' selected' : '') + '>' + e[1] + '</option>'; }).join('') + '</select>' +
        '<input data-f="enlace" placeholder="Enlace del video entregado" value="' + esc(v.enlace_entrega || '') + '" style="' + campo + ';flex:1;min-width:160px">' +
        '<input data-f="notas" placeholder="Notas del editor" value="' + esc(v.notas_editor || '') + '" style="' + campo + ';flex:1;min-width:160px">' +
        '<button data-a="guardar" style="background:#16a34a;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700">Guardar</button>' +
        '<span data-f="msg" style="font-size:12.5px"></span></div>';
      card.querySelector('[data-a="guardar"]').onclick = async function () {
        var m = card.querySelector('[data-f="msg"]'); m.textContent = 'Guardando…'; m.style.color = '#64748b';
        var u = await supabaseClient.rpc('crm_solicitud_video_actualizar', { p_id: v.id, p_estado: card.querySelector('[data-f="estado"]').value,
          p_notas: card.querySelector('[data-f="notas"]').value, p_enlace: card.querySelector('[data-f="enlace"]').value });
        if (u.error || u.data !== true) { m.textContent = 'No se guardó: ' + ((u.error && u.error.message) || 'sin cambios'); m.style.color = '#b91c1c'; return; }
        m.textContent = '✅ Guardado'; m.style.color = '#16a34a'; setTimeout(cargar, 600);
      };
      lista.appendChild(card);
    });
  }

  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.cargarSolicitudesVideo = cargar;
})();
