// ==================== PROSPECTOS DE LA PÁGINA (24-sep-2026) ====================
// Los interesados que deja Maestro HVACR AI en maestrohvacr.com (tabla prospectos_escuela).
// Solo PERSONAL ACTIVO: las RPC crm_prospectos_escuela / crm_prospecto_conversacion /
// crm_prospecto_actualizar revisan es_staff_activo() con el JWT; el navegador no decide nada.
// Se agrega solo al tablero de admin (no toca index.html, que tiene cambios de otra sesión).
(function () {
  'use strict';
  var ESTADOS = [['nuevo', '🆕 Nuevo'], ['contactado', '📞 Contactado'], ['inscrito', '✅ Inscrito'], ['descartado', '🗂️ Descartado']];
  var filtro = 'nuevo';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fecha = function (s) { try { return new Date(s).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }); } catch (_) { return s; } };
  var tel = function (t) { return String(t || '').replace(/\D/g, '').replace(/^(\d{10})$/, '1$1'); };

  function montar() {
    if (document.getElementById('adminProspectos')) return true;
    var ancla = document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full';
    sec.id = 'adminProspectos';
    sec.style.cssText = 'background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);';
    sec.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
      '<h3 style="margin:0;color:#0f2342">🧲 Prospectos de la página (Maestro HVACR AI)</h3>' +
      '<button id="prospRecargar" style="background:#065cff;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700">🔄 Actualizar</button></div>' +
      '<div id="prospFiltros" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"></div>' +
      '<div id="prospLista" style="display:grid;gap:10px"><p style="color:#64748b">Cargando…</p></div>';
    ancla.parentNode.insertBefore(sec, ancla);
    var nav = document.querySelector('.admin-nav-btn');
    if (nav && nav.parentNode && !document.getElementById('navProspectos')) {
      var b = document.createElement('button');
      b.id = 'navProspectos'; b.className = 'admin-nav-btn'; b.textContent = '🧲 Prospectos';
      b.onclick = function () { sec.scrollIntoView({ behavior: 'smooth' }); };
      nav.parentNode.insertBefore(b, nav);
    }
    document.getElementById('prospRecargar').onclick = cargar;
    cargar();
    return true;
  }

  async function cargar() {
    var lista = document.getElementById('prospLista'); if (!lista) return;
    if (!window.supabaseClient) { lista.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await supabaseClient.rpc('crm_prospectos_escuela', { p_estado: null });
    // supabase-js NO lanza: se revisa `error` (un error no es "cero prospectos").
    if (r.error) { lista.innerHTML = '<p style="color:#b91c1c">No se pudieron cargar: ' + esc(r.error.message) + '</p>'; return; }
    var todos = r.data || [];
    var filtros = document.getElementById('prospFiltros');
    filtros.innerHTML = '';
    ESTADOS.concat([['todos', 'Todos']]).forEach(function (e) {
      var n = e[0] === 'todos' ? todos.length : todos.filter(function (p) { return p.estado === e[0]; }).length;
      var b = document.createElement('button');
      b.textContent = e[1] + ' (' + n + ')';
      b.style.cssText = 'border:1px solid #cbd5e1;border-radius:999px;padding:5px 12px;cursor:pointer;font-weight:700;background:' + (filtro === e[0] ? '#0f2342;color:#fff' : '#fff;color:#0f2342');
      b.onclick = function () { filtro = e[0]; cargar(); };
      filtros.appendChild(b);
    });
    var ver = filtro === 'todos' ? todos : todos.filter(function (p) { return p.estado === filtro; });
    if (!ver.length) { lista.innerHTML = '<p style="color:#64748b">No hay prospectos en este estado.</p>'; return; }
    lista.innerHTML = '';
    ver.forEach(function (p) {
      var o = p.origen || {};
      var card = document.createElement('div');
      card.style.cssText = 'border:1px solid #e2e8f0;border-left:4px solid ' + (p.estado === 'nuevo' ? '#ed342b' : p.estado === 'inscrito' ? '#16a34a' : '#065cff') + ';border-radius:10px;padding:12px 14px';
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b style="font-size:15px;color:#0f2342">' + esc(p.nombre) + '</b>' +
        '<span style="color:#64748b;font-size:12px">' + esc(fecha(p.created_at)) + ' · ' + esc(p.idioma || '') + '</span></div>' +
        '<div style="margin:6px 0;font-size:13.5px">🎯 <b>' + esc(p.interes || '—') + '</b> · ' + esc((p.modalidad || 'sin_definir').replace('_', ' ')) +
        (o.utm_source || o.utm_campaign ? ' · 📣 ' + esc([o.utm_source, o.utm_campaign].filter(Boolean).join(' / ')) : '') + '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">' +
        (p.telefono ? '<a href="tel:+' + tel(p.telefono) + '" style="text-decoration:none">📞 ' + esc(p.telefono) + '</a><a target="_blank" rel="noopener" href="https://wa.me/' + tel(p.telefono) + '" style="text-decoration:none">💬 WhatsApp</a>' : '') +
        (p.correo ? '<a href="mailto:' + esc(p.correo) + '" style="text-decoration:none">✉️ ' + esc(p.correo) + '</a>' : '') + '</div>' +
        '<p style="margin:6px 0;color:#334155;font-size:13.5px">' + esc(p.resumen || '') + '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
        '<select data-f="estado">' + ESTADOS.map(function (e) { return '<option value="' + e[0] + '"' + (p.estado === e[0] ? ' selected' : '') + '>' + e[1] + '</option>'; }).join('') + '</select>' +
        '<input data-f="responsable" placeholder="Responsable" value="' + esc(p.responsable || '') + '" style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:6px;width:140px">' +
        '<input data-f="notas" placeholder="Notas" value="' + esc(p.notas || '') + '" style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:6px;flex:1;min-width:160px">' +
        '<button data-a="guardar" style="background:#16a34a;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700">Guardar</button>' +
        '<button data-a="chat" style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;padding:6px 12px;cursor:pointer">💬 Conversación (' + (p.mensajes || 0) + ')</button>' +
        '<span data-f="msg" style="font-size:12.5px"></span></div><div data-f="conv" hidden style="margin-top:8px;background:#f8fafc;border-radius:8px;padding:8px 10px;font-size:13px"></div>';
      card.querySelector('[data-a="guardar"]').onclick = async function () {
        var m = card.querySelector('[data-f="msg"]'); m.textContent = 'Guardando…'; m.style.color = '#64748b';
        var u = await supabaseClient.rpc('crm_prospecto_actualizar', { p_id: p.id, p_estado: card.querySelector('[data-f="estado"]').value,
          p_responsable: card.querySelector('[data-f="responsable"]').value, p_notas: card.querySelector('[data-f="notas"]').value });
        // Solo se dice "guardado" si la base lo confirmó.
        if (u.error || u.data !== true) { m.textContent = 'No se guardó: ' + ((u.error && u.error.message) || 'sin cambios'); m.style.color = '#b91c1c'; return; }
        m.textContent = '✅ Guardado'; m.style.color = '#16a34a'; setTimeout(cargar, 700);
      };
      card.querySelector('[data-a="chat"]').onclick = async function () {
        var c = card.querySelector('[data-f="conv"]');
        if (!c.hidden) { c.hidden = true; return; }
        c.hidden = false; c.textContent = 'Cargando…';
        var h = await supabaseClient.rpc('crm_prospecto_conversacion', { p_id: p.id });
        if (h.error) { c.textContent = 'No se pudo cargar: ' + h.error.message; return; }
        c.innerHTML = (h.data || []).map(function (x) { return '<p style="margin:4px 0"><b>' + (x.rol === 'user' ? '🧑 Visitante' : '🤖 Asistente') + ':</b> ' + esc(x.texto) + '</p>'; }).join('') || 'Sin mensajes.';
      };
      lista.appendChild(card);
    });
  }

  // El tablero de admin se pinta después de iniciar sesión: se intenta montar hasta que exista.
  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.cargarProspectosEscuela = cargar;
})();
