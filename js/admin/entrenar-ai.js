// ==================== 🧠 ENTRENAR AL MAESTRO HVACR AI (30-sep-2026, Mario, etapa 3) ====================
// El asistente de maestrohvacr.com aprende del EQUIPO: aquí se ven (1) las preguntas que NO supo contestar,
// (2) las conversaciones reales de los últimos días y (3) lo que ya le enseñamos. Cada enseñanza entra en la
// siguiente conversación del sitio (la función asistente-escuela la lee siempre). Solo PERSONAL ACTIVO: todas las
// RPC revisan es_staff_activo() con el JWT; el navegador no decide nada. Cada mañana llega a Mario un SMS con el resumen.
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var hora = function (s) { try { return new Date(s).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }); } catch (_) { return s; } };
  var campo = 'padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit;width:100%;box-sizing:border-box';
  var btn = function (color) { return 'background:' + color + ';color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700'; };
  var pestana = 'dudas', dias = 3;

  function montar() {
    if (document.getElementById('adminEntrenarAI')) return true;
    var ancla = document.getElementById('adminProspectos') || document.getElementById('adminMiembrosWeb') || document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full'; sec.id = 'adminEntrenarAI';
    sec.style.cssText = 'background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);';
    sec.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px">' +
      '<h3 style="margin:0;color:#0f2342">🧠 Entrenar al Maestro HVACR AI (chat de maestrohvacr.com)</h3>' +
      '<button id="eaiRecargar" style="' + btn('#065cff') + '">🔄 Actualizar</button></div>' +
      '<p style="margin:0 0 10px;color:#475569;font-size:13px">Lo que le enseñes aquí lo usa desde la <b>siguiente</b> conversación. Escribe la respuesta como se la dirías al cliente: solo datos verdaderos de la escuela (precios, fechas, promesas). Cada mañana le llega a Mario un SMS con lo que no supo contestar.</p>' +
      '<div id="eaiTabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"></div>' +
      '<form id="eaiForm" style="display:none;gap:8px;margin-bottom:12px;padding:12px;border-radius:10px;background:#f0f7ff;border:1px solid #bfdbfe">' +
      '<b id="eaiFormTitulo" style="color:#0f2342">Enseñarle algo nuevo</b>' +
      '<input name="pregunta" placeholder="Cuando pregunten… (ej. ¿Tienen estacionamiento?)" style="' + campo + '">' +
      '<textarea name="respuesta" rows="3" placeholder="Responde así… (ej. Sí, hay estacionamiento gratis enfrente de la escuela.)" style="' + campo + '"></textarea>' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button type="submit" style="' + btn('#16a34a') + '">Guardar enseñanza</button>' +
      '<button type="button" id="eaiCancelar" style="' + btn('#64748b') + '">Cancelar</button><span id="eaiMsg" style="font-size:13px;font-weight:700"></span></div></form>' +
      '<div id="eaiLista" style="display:grid;gap:10px"><p style="color:#64748b">Cargando…</p></div>';
    ancla.parentNode.insertBefore(sec, ancla.nextSibling);
    var nav = document.getElementById('navProspectos') || document.querySelector('.admin-nav-btn');
    if (nav && nav.parentNode && !document.getElementById('navEntrenarAI')) {
      var b = document.createElement('button'); b.id = 'navEntrenarAI'; b.className = 'admin-nav-btn'; b.textContent = '🧠 Entrenar AI';
      b.onclick = function () { sec.scrollIntoView({ behavior: 'smooth' }); };
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
    document.getElementById('eaiRecargar').onclick = cargar;
    document.getElementById('eaiCancelar').onclick = cerrarForm;
    document.getElementById('eaiForm').onsubmit = guardar;
    cargar();
    return true;
  }

  // El formulario sirve para las tres cosas: enseñar algo nuevo, contestar una duda o corregir una respuesta.
  var editando = { id: null, duda: null, activo: true };
  function abrirForm(titulo, pregunta, respuesta, id, duda, activo) {
    editando = { id: id || null, duda: duda || null, activo: activo !== false };
    var f = document.getElementById('eaiForm');
    document.getElementById('eaiFormTitulo').textContent = titulo;
    f.pregunta.value = pregunta || ''; f.respuesta.value = respuesta || '';
    document.getElementById('eaiMsg').textContent = '';
    f.style.display = 'grid'; f.scrollIntoView({ behavior: 'smooth', block: 'center' }); (pregunta ? f.respuesta : f.pregunta).focus();
  }
  function cerrarForm() { document.getElementById('eaiForm').style.display = 'none'; }

  async function guardar(e) {
    e.preventDefault();
    var f = e.target, msg = document.getElementById('eaiMsg');
    var p = f.pregunta.value.trim(), r = f.respuesta.value.trim();
    if (p.length < 3 || r.length < 3) { msg.style.color = '#b91c1c'; msg.textContent = 'Escribe la pregunta y la respuesta.'; return; }
    msg.style.color = '#64748b'; msg.textContent = 'Guardando…';
    var res = await supabaseClient.rpc('crm_conocimiento_guardar', { p_id: editando.id, p_pregunta: p, p_respuesta: r, p_activo: editando.activo, p_duda: editando.duda });
    // supabase-js NO lanza: hay que leer .error.
    if (res.error || !res.data) { msg.style.color = '#b91c1c'; msg.textContent = 'No se guardó: ' + ((res.error && res.error.message) || 'sin cambios'); return; }
    msg.style.color = '#16a34a'; msg.textContent = '✅ Aprendido. Lo usa desde la siguiente conversación.';
    setTimeout(function () { cerrarForm(); cargar(); }, 900);
  }

  async function cargar() {
    var lista = document.getElementById('eaiLista'); if (!lista) return;
    if (!window.supabaseClient) { lista.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await Promise.all([supabaseClient.rpc('crm_asistente_dudas'), supabaseClient.rpc('crm_asistente_charlas', { p_dias: dias }), supabaseClient.rpc('crm_asistente_conocimiento')]);
    var fallo = r.find(function (x) { return x.error; });
    if (fallo) { lista.innerHTML = '<p style="color:#b91c1c">No se pudo cargar: ' + esc(fallo.error.message) + '</p>'; return; }
    var dudas = r[0].data || [], charlas = r[1].data || [], saber = r[2].data || [];
    var tabs = document.getElementById('eaiTabs'); tabs.innerHTML = '';
    [['dudas', '❓ No supo contestar (' + dudas.length + ')'], ['charlas', '💬 Conversaciones (' + charlas.length + ')'], ['saber', '📘 Lo que ya sabe (' + saber.filter(function (k) { return k.activo; }).length + ')']].forEach(function (t) {
      var b = document.createElement('button'); b.textContent = t[1];
      b.style.cssText = 'border:1px solid #cbd5e1;border-radius:999px;padding:5px 12px;cursor:pointer;font-weight:700;background:' + (pestana === t[0] ? '#0f2342;color:#fff' : '#fff;color:#0f2342');
      b.onclick = function () { pestana = t[0]; cargar(); };
      tabs.appendChild(b);
    });
    var nuevo = document.createElement('button'); nuevo.textContent = '＋ Enseñarle algo'; nuevo.style.cssText = btn('#16a34a') + ';margin-left:auto';
    nuevo.onclick = function () { abrirForm('Enseñarle algo nuevo'); }; tabs.appendChild(nuevo);
    lista.innerHTML = '';
    if (pestana === 'dudas') pintarDudas(lista, dudas);
    else if (pestana === 'charlas') pintarCharlas(lista, charlas);
    else pintarSaber(lista, saber);
  }

  function tarjeta(color) {
    var c = document.createElement('div');
    c.style.cssText = 'border:1px solid #e2e8f0;border-left:4px solid ' + color + ';border-radius:10px;padding:10px 14px';
    return c;
  }

  function pintarDudas(lista, dudas) {
    if (!dudas.length) { lista.innerHTML = '<p style="color:#16a34a;font-weight:700">✅ No hay preguntas pendientes: contestó todo lo que le preguntaron.</p>'; return; }
    dudas.forEach(function (d) {
      var c = tarjeta('#d97706');
      c.innerHTML = '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="color:#0f2342">' + esc(d.pregunta) + '</b><span style="color:#64748b;font-size:12px">' + esc(hora(d.created_at)) + '</span></div>' +
        (d.motivo ? '<p style="margin:4px 0;color:#64748b;font-size:13px">Por qué no supo: ' + esc(d.motivo) + '</p>' : '') +
        '<div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap"><button data-a="ensenar" style="' + btn('#16a34a') + '">✍️ Enseñarle la respuesta</button>' +
        '<button data-a="descartar" style="' + btn('#64748b') + '">Descartar</button></div>';
      c.querySelector('[data-a="ensenar"]').onclick = function () { abrirForm('Contestar: ' + d.pregunta, d.pregunta, '', null, d.id); };
      c.querySelector('[data-a="descartar"]').onclick = async function () {
        var u = await supabaseClient.rpc('crm_duda_descartar', { p_id: d.id });
        if (u.error) { alertar(c, u.error.message); return; } cargar();
      };
      lista.appendChild(c);
    });
  }

  function pintarCharlas(lista, charlas) {
    var sel = document.createElement('div');
    sel.innerHTML = '<label style="font-size:13px;color:#334155">Mostrar los últimos <select>' + [1, 3, 7, 14, 30].map(function (n) { return '<option' + (n === dias ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select> días</label>';
    sel.querySelector('select').onchange = function (e) { dias = +e.target.value; cargar(); };
    lista.appendChild(sel);
    if (!charlas.length) { lista.insertAdjacentHTML('beforeend', '<p style="color:#64748b">No hubo conversaciones en esos días.</p>'); return; }
    charlas.forEach(function (ch) {
      var msgs = ch.mensajes || [];
      var primera = (msgs.find(function (m) { return m.rol === 'user'; }) || {}).texto || '';
      var c = tarjeta(ch.prospecto ? '#16a34a' : '#065cff');
      c.innerHTML = '<details><summary style="cursor:pointer;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="color:#0f2342">' + esc(primera.slice(0, 110)) + '</b>' +
        '<span style="color:#64748b;font-size:12px">' + msgs.length + ' mensajes · ' + esc(hora(ch.fin)) + (ch.prospecto ? ' · 🧲 dejó sus datos' : '') + '</span></summary><div data-m style="display:grid;gap:6px;margin-top:8px"></div></details>';
      var cont = c.querySelector('[data-m]');
      msgs.forEach(function (m, i) {
        var yo = m.rol === 'user', div = document.createElement('div');
        div.style.cssText = 'padding:8px 10px;border-radius:10px;font-size:13.5px;white-space:pre-wrap;' + (yo ? 'background:#f1f5f9;color:#0f172a' : 'background:#eef6ff;color:#0f2342');
        div.innerHTML = '<b>' + (yo ? '👤 Visitante' : '🤖 Maestro AI') + ':</b> ' + esc(m.texto);
        if (!yo) {
          var previa = ''; for (var j = i - 1; j >= 0; j--) if (msgs[j].rol === 'user') { previa = msgs[j].texto; break; }
          var b = document.createElement('button'); b.textContent = '✏️ Corregir esta respuesta';
          b.style.cssText = 'display:block;margin-top:6px;background:#fff;border:1px solid #065cff;color:#065cff;border-radius:6px;padding:3px 10px;cursor:pointer;font-weight:700;font-size:12.5px';
          b.onclick = function () { abrirForm('Corregir: así debió contestar', previa.slice(0, 500), m.texto.slice(0, 2000)); };
          div.appendChild(b);
        }
        cont.appendChild(div);
      });
      lista.appendChild(c);
    });
  }

  function pintarSaber(lista, saber) {
    if (!saber.length) { lista.innerHTML = '<p style="color:#64748b">Todavía no le han enseñado nada: por ahora contesta solo con la ficha de la escuela.</p>'; return; }
    saber.forEach(function (k) {
      var c = tarjeta(k.activo ? '#16a34a' : '#94a3b8');
      c.innerHTML = '<b style="color:#0f2342">' + esc(k.pregunta) + '</b><p style="margin:4px 0;font-size:13.5px;color:#334155;white-space:pre-wrap">' + esc(k.respuesta) + '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span style="color:#64748b;font-size:12px">' + (k.activo ? '✅ Activa' : '⏸️ Apagada') + ' · ' + esc(k.creado_por || '—') + ' · ' + esc(hora(k.actualizado)) + '</span>' +
        '<button data-a="editar" style="' + btn('#065cff') + '">Editar</button><button data-a="activo" style="' + btn(k.activo ? '#64748b' : '#16a34a') + '">' + (k.activo ? 'Apagar' : 'Encender') + '</button></div>';
      c.querySelector('[data-a="editar"]').onclick = function () { abrirForm('Editar enseñanza', k.pregunta, k.respuesta, k.id, null, k.activo); };
      c.querySelector('[data-a="activo"]').onclick = async function () {
        var u = await supabaseClient.rpc('crm_conocimiento_guardar', { p_id: k.id, p_pregunta: k.pregunta, p_respuesta: k.respuesta, p_activo: !k.activo, p_duda: null });
        if (u.error) { alertar(c, u.error.message); return; } cargar();
      };
      lista.appendChild(c);
    });
  }

  function alertar(c, texto) { c.insertAdjacentHTML('beforeend', '<p style="margin:6px 0 0;color:#b91c1c;font-size:13px">No se pudo: ' + esc(texto) + '</p>'); }

  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.cargarEntrenarAI = cargar;
})();
