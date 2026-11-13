// ==================== TABLERO DE VENTAS · call center de Maestro HVACR (fase 1, 13-nov-2026) ====================
// Brenda y Marisol llaman DESDE SU MAC, en esta pantalla, con audífonos (Twilio Voice en el navegador).
// Flujo de cada lead: abrir → leer el guion (candado) → ver el lead (teléfono tapado) → «Llamar desde aquí» → al colgar,
// encuesta de botones obligatoria → sin encuesta no se abre el siguiente lead.
// El navegador NO decide nada: el servidor (función ventas-tablero) revisa permisos, candados, horario 8–21 en la hora del
// cliente, la lista de no llamar y las listas frías apagadas. Aquí nunca llega el teléfono completo.
// Sin innerHTML con datos: todo se pinta con textContent. La carpeta de ventas va en un iframe con sandbox (sin scripts).
(function () {
  'use strict';
  var R = window.VentasReglas;
  var SB = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) || window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var FN = SB + '/functions/v1/ventas-tablero';
  var TWILIO_SDK = 'https://cdn.jsdelivr.net/npm/@twilio/voice-sdk@2.18.5/dist/twilio.min.js';
  var TWILIO_SRI = 'sha384-LUG7DmzDPWNKRYoqyGpV4d/IByMLiya/oUhMSc/4/6hi0wbzO/8PffM4lzeFEYS8';
  var st = { ini: null, abierto: null, tipo: 'caliente', vista: 'leads', enc: {}, llamada: null, device: null, call: null, candado: null, timer: null, guionInicio: 0, alFinal: false, msg: null };

  // ── pequeño constructor de DOM (sin innerHTML) ──
  function h(tag, a, hijos) {
    var el = document.createElement(tag);
    a = a || {};
    Object.keys(a).forEach(function (k) {
      var v = a[k];
      if (v == null || v === false) return;
      if (k === 'text') el.textContent = v;
      else if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'style') el.style.cssText = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    (hijos || []).forEach(function (c) { if (c == null || c === false) return; el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function vaciar(el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; }
  function fechaCorta(s, zona) { try { return new Date(s).toLocaleString('es-MX', { timeZone: zona || 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' }); } catch (_) { return String(s || ''); } }

  async function api(accion, datos, crudo) {
    var tok = '';
    try { var s = await window.supabaseClient.auth.getSession(); tok = (s && s.data && s.data.session && s.data.session.access_token) || ''; } catch (_) {}
    var r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }, body: JSON.stringify(Object.assign({ accion: accion }, datos || {})) });
    if (crudo && r.ok) return r;
    var j = {}; try { j = await r.json(); } catch (_) {}
    if (!r.ok) { var e = new Error(j.error || ('Error ' + r.status)); e.datos = j; e.status = r.status; throw e; }
    return j;
  }

  // ── estilos (una sola vez) ──
  function estilos() {
    if (document.getElementById('vtEstilos')) return;
    var css = [
      '#vtTablero{position:fixed;inset:0;z-index:10050;background:#f4f6f9;color:#14202e;font:15px/1.45 -apple-system,"Segoe UI",system-ui,sans-serif;display:flex;flex-direction:column}',
      '#vtTablero *{box-sizing:border-box}',
      '#vtTablero button{font:inherit;cursor:pointer}',
      '.vt-top{background:#0f2a47;color:#fff;display:flex;align-items:center;gap:12px;padding:10px 18px;flex-wrap:wrap}',
      '.vt-top h1{font-size:19px;margin:0;font-weight:800;letter-spacing:.01em}.vt-top .yo{opacity:.85;font-size:13.5px}',
      '.vt-top .esp{flex:1}.vt-btn{border:0;border-radius:8px;padding:8px 12px;font-weight:700;background:#e8edf3;color:#0f2a47}',
      '.vt-btn.pri{background:#d9411e;color:#fff}.vt-btn.ok{background:#1f7a4d;color:#fff}.vt-btn.osc{background:#1d3d63;color:#fff}.vt-btn:disabled{opacity:.45;cursor:not-allowed}',
      '.vt-fechas{display:flex;gap:10px;padding:10px 18px;overflow-x:auto;border-bottom:1px solid #dde2e8;background:#fff}',
      '.vt-fecha{flex:none;min-width:190px;border:1px solid #dde2e8;border-radius:10px;padding:8px 10px}',
      '.vt-fecha b{display:block;font-size:14px}.vt-fecha .d{font:700 22px/1 ui-monospace,Menlo,monospace;color:#d9411e}.vt-fecha small{color:#5a6675;display:block}',
      '.vt-cuerpo{flex:1;display:grid;grid-template-columns:340px 1fr;min-height:0}',
      '.vt-izq{border-right:1px solid #dde2e8;background:#fff;display:flex;flex-direction:column;min-height:0}',
      '.vt-tabs{display:flex;gap:6px;padding:10px;border-bottom:1px solid #eef1f4;flex-wrap:wrap}',
      '.vt-tab{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:5px 11px;font-weight:700;font-size:13px}.vt-tab.on{background:#0f2a47;color:#fff;border-color:#0f2a47}',
      '.vt-lista{overflow:auto;flex:1;padding:8px}',
      '.vt-lead{width:100%;text-align:left;border:1px solid #e2e8f0;border-left:4px solid #d9411e;background:#fff;border-radius:10px;padding:9px 11px;margin-bottom:8px}',
      '.vt-lead.sel{outline:3px solid #d9411e33}.vt-lead .n{font-weight:800}.vt-lead .m{color:#5a6675;font-size:12.5px}',
      '.vt-der{overflow:auto;padding:18px 22px;min-height:0}',
      '.vt-card{background:#fff;border:1px solid #dde2e8;border-radius:12px;padding:16px 18px;margin-bottom:14px;max-width:880px}',
      '.vt-card h2{margin:0 0 8px;font-size:20px;color:#0f2a47}.vt-card h3{margin:12px 0 6px;font-size:16px}',
      '.vt-aviso{background:#fff4e0;color:#7a4a05;border-radius:8px;padding:9px 12px;margin:8px 0;font-weight:600}',
      '.vt-error{background:#fde8e8;color:#8a1c1c;border-radius:8px;padding:9px 12px;margin:8px 0;font-weight:600}',
      '.vt-ok{background:#e6f5ec;color:#14532d;border-radius:8px;padding:9px 12px;margin:8px 0;font-weight:600}',
      '.vt-guion{max-height:52vh;overflow:auto;border:1px solid #dde2e8;border-radius:10px;padding:12px 16px;background:#fbfcfd}',
      '.vt-guion blockquote{border-left:4px solid #d9411e;margin:6px 0;padding:6px 10px;background:#fff}',
      '.vt-guion table{border-collapse:collapse;font-size:13px;margin:6px 0}.vt-guion td{border:1px solid #dde2e8;padding:4px 6px;vertical-align:top}',
      '.vt-apertura{border-left:4px solid #1f7a4d;background:#f2faf5;padding:10px 12px;border-radius:6px;white-space:pre-wrap}',
      '.vt-datos{display:grid;grid-template-columns:150px 1fr;gap:4px 12px}.vt-datos dt{color:#5a6675}.vt-datos dd{margin:0;font-weight:600}',
      '.vt-tel{font:700 18px ui-monospace,Menlo,monospace}',
      '.vt-opc{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}',
      '.vt-opc button{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:6px 12px;font-weight:700}.vt-opc button.on{background:#0f2a47;color:#fff;border-color:#0f2a47}',
      '.vt-llamada{display:flex;align-items:center;gap:12px;background:#0f2a47;color:#fff;border-radius:12px;padding:14px 16px}',
      '.vt-llamada .t{font:700 22px ui-monospace,Menlo,monospace}',
      '.vt-modal{position:fixed;inset:0;z-index:10060;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px}',
      '.vt-modal>div{background:#fff;border-radius:12px;width:min(900px,100%);height:min(86vh,900px);display:flex;flex-direction:column;overflow:hidden}',
      '.vt-modal header{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #dde2e8}',
      '.vt-modal iframe{border:0;flex:1;width:100%}.vt-modal .doc{overflow:auto;padding:14px 18px;flex:1}',
      '.vt-mini{font-size:12.5px;color:#5a6675}',
      '.vt-tabla{width:100%;border-collapse:collapse;font-size:13.5px}.vt-tabla td,.vt-tabla th{border-bottom:1px solid #eef1f4;padding:6px;text-align:left}',
      '@media (max-width:900px){.vt-cuerpo{grid-template-columns:1fr}.vt-izq{max-height:40vh}}',
    ].join('\n');
    document.head.appendChild(h('style', { id: 'vtEstilos', text: css }));
  }

  // ── abrir / cerrar ──
  function abrir() {
    estilos();
    var raiz = document.getElementById('vtTablero');
    if (!raiz) { raiz = h('div', { id: 'vtTablero', role: 'dialog', 'aria-label': 'Tablero de ventas' }); document.body.appendChild(raiz); }
    raiz.hidden = false;
    cargar();
  }
  function cerrar() {
    if (st.call) { if (!confirm('Hay una llamada en curso. ¿Colgar y salir?')) return; try { st.call.disconnect(); } catch (_) {} }
    var raiz = document.getElementById('vtTablero'); if (raiz) raiz.hidden = true;
  }

  async function cargar(mensaje) {
    try {
      st.ini = await api('inicio');
      st.msg = mensaje || null;
      var tk = tokenPendiente();
      if (tk) { borrarToken(); try { var c = await api('canjear', { token: tk }); await abrirLead(c.prospecto_id); return; } catch (e) { st.msg = { error: e.message }; } }
      if (st.ini.pendiente) { await abrirLead(st.ini.pendiente.prospecto_id); return; }
      pintar();
    } catch (e) {
      var raiz = vaciar(document.getElementById('vtTablero'));
      raiz.appendChild(h('div', { class: 'vt-top' }, [h('h1', { text: 'Tablero de ventas · Maestro HVACR' }), h('span', { class: 'esp' }), h('button', { class: 'vt-btn', text: 'Cerrar', onclick: cerrar })]));
      raiz.appendChild(h('div', { class: 'vt-der' }, [h('div', { class: 'vt-error', text: e.message })]));
    }
  }

  // ── enlace del SMS: ?ventas_lead=<token> (se canjea con POST y sesión; nunca al abrir el enlace) ──
  function tokenPendiente() {
    try {
      var q = new URLSearchParams(location.search).get('ventas_lead');
      if (q) { sessionStorage.setItem('ventas_lead', q); }
      return sessionStorage.getItem('ventas_lead') || '';
    } catch (_) { return ''; }
  }
  function borrarToken() {
    try { sessionStorage.removeItem('ventas_lead'); var u = new URL(location.href); if (u.searchParams.has('ventas_lead')) { u.searchParams.delete('ventas_lead'); history.replaceState(null, '', u.pathname + u.search + u.hash); } } catch (_) {}
  }

  // ── pintar todo ──
  function pintar() {
    var raiz = vaciar(document.getElementById('vtTablero'));
    var ini = st.ini;
    var top = h('div', { class: 'vt-top' }, [
      h('h1', { text: '📞 Tablero de ventas · Maestro HVACR' }),
      h('span', { class: 'yo', text: ini.staff.nombre + (ini.staff.auditor ? ' · puede auditar' : '') }),
      h('span', { class: 'esp' }),
      ini.enlace_membresia ? h('button', { class: 'vt-btn osc', title: ini.enlace_membresia, text: '🔗 Copiar mi enlace de membresía', onclick: function () { copiar(ini.enlace_membresia, this); } }) : null,
      h('button', { class: 'vt-btn', text: '📁 Carpeta de ventas', disabled: !ini.carpeta && !ini.staff.auditor, onclick: function () { verDoc('carpeta'); } }),
      h('button', { class: 'vt-btn', text: '🖥️ Tour virtual', disabled: !ini.tour && !ini.staff.auditor, onclick: function () { verDoc('tour'); } }),
      ini.staff.auditor ? h('button', { class: 'vt-btn' + (st.vista === 'mario' ? ' pri' : ''), text: '🛠️ Mario', onclick: function () { st.vista = st.vista === 'mario' ? 'leads' : 'mario'; pintar(); } }) : null,
      h('button', { class: 'vt-btn', text: '↻', title: 'Actualizar', onclick: function () { cargar(); } }),
      h('button', { class: 'vt-btn', text: 'Cerrar', onclick: cerrar }),
    ]);
    raiz.appendChild(top);
    raiz.appendChild(barraFechas(ini.lugares || []));
    var cuerpo = h('div', { class: 'vt-cuerpo' });
    cuerpo.appendChild(columnaLeads());
    var der = h('div', { class: 'vt-der', id: 'vtDer' });
    cuerpo.appendChild(der);
    raiz.appendChild(cuerpo);
    if (st.vista === 'mario') pintarMario(der); else pintarPanel(der);
  }

  function barraFechas(lugares) {
    var bar = h('div', { class: 'vt-fechas', 'aria-label': 'Fechas límite' });
    lugares.forEach(function (g) {
      bar.appendChild(h('div', { class: 'vt-fecha' }, [
        h('small', { text: fechaCorta(g.fecha + 'T12:00:00Z').split(',')[0] + ' · ' + (g.horario || '') }),
        h('b', { text: g.nombre }),
        h('span', { class: 'd', text: (g.dias >= 0 ? g.dias : 0) + ' días' }),
        h('small', { text: g.libres == null ? 'Cupo: Mario no lo ha cargado · ' + g.con_deposito + ' con depósito' : 'Quedan ' + g.libres + ' de ' + g.cupo + ' · ' + g.con_deposito + ' con depósito' }),
        g.van_a_pagar ? h('small', { text: g.van_a_pagar + ' van a pagar (enlace o cita)' }) : null,
      ]));
    });
    if (!lugares.length) bar.appendChild(h('span', { class: 'vt-mini', text: 'Sin fechas límite cargadas.' }));
    return bar;
  }

  function columnaLeads() {
    var ini = st.ini;
    var col = h('div', { class: 'vt-izq' });
    var tabs = h('div', { class: 'vt-tabs', role: 'tablist' });
    [['caliente', '🔥 Calientes'], ['tibia', '🌤️ Tibias'], ['fria', '🧊 Frías']].forEach(function (t) {
      var n = ini.leads.filter(function (l) { return l.lista.tipo === t[0]; }).length;
      tabs.appendChild(h('button', { class: 'vt-tab' + (st.tipo === t[0] ? ' on' : ''), role: 'tab', 'aria-selected': st.tipo === t[0] ? 'true' : 'false', text: t[1] + ' (' + n + ')', onclick: function () { st.tipo = t[0]; pintar(); } }));
    });
    col.appendChild(tabs);
    var lista = h('div', { class: 'vt-lista' });
    var listasTipo = (ini.listas || []).filter(function (l) { return l.tipo === st.tipo; });
    var apagadas = listasTipo.filter(function (l) { return !l.usable; });
    if (st.tipo === 'fria' && listasTipo.every(function (l) { return !l.usable; })) lista.appendChild(h('div', { class: 'vt-aviso', text: '🧊 Las listas frías están APAGADAS hasta que Mario cargue y revise el Registro Nacional No Llame.' }));
    else if (apagadas.length) lista.appendChild(h('div', { class: 'vt-mini', text: 'Apagadas: ' + apagadas.map(function (l) { return l.nombre; }).join(' · ') }));
    var bloqueado = !!ini.pendiente;
    ini.leads.filter(function (l) { return l.lista.tipo === st.tipo; }).forEach(function (l) {
      lista.appendChild(h('button', { class: 'vt-lead' + (st.abierto && st.abierto.id === l.id ? ' sel' : ''), disabled: bloqueado && ini.pendiente.prospecto_id !== l.id,
        onclick: function () { abrirLead(l.id); } }, [
        h('div', { class: 'n', text: l.nombre || '(sin nombre)' }),
        h('div', { class: 'm', text: [R.mostrarTelefono(l.telefono), l.interes, l.canal].filter(Boolean).join(' · ') }),
        h('div', { class: 'm', text: (l.estado === 'nuevo' ? '🆕 nuevo' : '📞 contactado') + ' · ' + fechaCorta(l.creado) + (l.horario_ok ? '' : ' · ⏰ fuera de horario') }),
      ]));
    });
    if (!lista.querySelector('.vt-lead')) lista.appendChild(h('p', { class: 'vt-mini', text: 'No hay leads en esta lista.' }));
    col.appendChild(lista);
    return col;
  }

  function mensaje(der) {
    if (!st.msg) return;
    if (st.msg.error) der.appendChild(h('div', { class: 'vt-error', role: 'alert', text: st.msg.error }));
    if (st.msg.ok) der.appendChild(h('div', { class: 'vt-ok', role: 'status', text: st.msg.ok }));
    if (st.msg.aviso) der.appendChild(h('div', { class: 'vt-aviso', text: st.msg.aviso }));
  }

  function pintarPanel(der) {
    vaciar(der); mensaje(der);
    var ini = st.ini;
    if (!ini.guion) der.appendChild(h('div', { class: 'vt-aviso', text: 'Mario todavía no aprueba el guion. Sin guion aprobado no se abre ningún lead ni se llama.' }));
    if (!ini.twilio_listo) der.appendChild(h('div', { class: 'vt-aviso', text: 'La llamada desde el navegador todavía no está conectada (faltan las llaves de Twilio Voice que da Mario).' }));
    var a = st.abierto;
    if (!a) {
      der.appendChild(h('div', { class: 'vt-card' }, [h('h2', { text: 'Escoge un lead de la lista' }),
        h('p', { text: 'Antes de cada lead se lee el guion. Después de colgar, la encuesta es obligatoria: sin encuesta no se abre el siguiente lead.' }),
        h('p', { class: 'vt-mini', text: 'Reglas de ley: un clic = una llamada · solo de 8 a. m. a 9 p. m. en la hora del cliente · si alguien pide que no le llamen, oprime «No volver a llamar».' })]));
      citasCard(der);
      return;
    }
    if (a.sin_guion) { der.appendChild(h('div', { class: 'vt-aviso', text: a.motivo })); return; }
    if (a.necesita_guion) { pintarGuion(der, a); return; }
    if (st.call || st.llamada) { pintarLlamada(der); return; }
    if (a.pendiente) { pintarEncuesta(der, a); return; }
    pintarLead(der, a);
  }

  // ── 1) candado del guion ──
  function pintarGuion(der, a) {
    var card = h('div', { class: 'vt-card' });
    card.appendChild(h('h2', { text: 'Lee el guion antes de abrir a ' + (a.nombre_corto || 'este lead') }));
    card.appendChild(h('p', { class: 'vt-mini', text: 'Guion ' + a.guion.version + ' aprobado por Mario. Llega hasta el final; el botón se prende cuando pasen ' + a.guion.minimo_seg + ' segundos.' }));
    card.appendChild(h('h3', { text: 'Cómo empieza la llamada (' + R.etiquetaLista({ tipo: a.tipo }) + ')' }));
    card.appendChild(h('div', { class: 'vt-apertura', text: a.apertura || '' }));
    card.appendChild(h('h3', { text: 'Guion completo' }));
    var g = h('div', { class: 'vt-guion', id: 'vtGuion', tabindex: '0' });
    pintarMarkdown(g, a.guion.texto);
    g.appendChild(h('div', { id: 'vtFinGuion', class: 'vt-mini', text: '— Fin del guion —' }));
    card.appendChild(g);
    var btn = h('button', { class: 'vt-btn pri', id: 'vtLeido', disabled: true, text: 'Lee el guion hasta el final', style: 'margin-top:10px' });
    card.appendChild(btn);
    der.appendChild(card);
    st.guionInicio = Date.now(); st.alFinal = false;
    var revisar = function () {
      if (g.scrollTop + g.clientHeight >= g.scrollHeight - 8) st.alFinal = true;
      var c = R.candadoEstado({ inicioMs: st.guionInicio, ahoraMs: Date.now(), llegoAlFinal: st.alFinal, minimoSeg: a.guion.minimo_seg });
      btn.disabled = !c.listo; btn.textContent = c.texto;
    };
    g.addEventListener('scroll', revisar);
    clearInterval(st.timer); st.timer = setInterval(function () { if (!document.body.contains(btn)) { clearInterval(st.timer); return; } revisar(); }, 1000);
    setTimeout(revisar, 50);
    btn.onclick = async function () {
      btn.disabled = true;
      try { st.abierto = await api('guion_leido', { prospecto_id: st.abiertoId, llego_al_final: st.alFinal }); st.msg = null; }
      catch (e) { st.msg = { error: e.message }; }
      pintarPanel(document.getElementById('vtDer'));
    };
  }

  function pintarMarkdown(dest, md) {
    var ul = null;
    R.bloquesMarkdown(md).forEach(function (b) {
      if (b.tipo !== 'li') ul = null;
      var conNegritas = function (tag, texto) { var el = h(tag); R.trozosNegrita(texto).forEach(function (t) { el.appendChild(t.b ? h('b', { text: t.texto }) : document.createTextNode(t.texto)); }); return el; };
      if (b.tipo === 'h') dest.appendChild(conNegritas(b.nivel <= 2 ? 'h3' : 'h4', b.texto));
      else if (b.tipo === 'cita') dest.appendChild(conNegritas('blockquote', b.texto));
      else if (b.tipo === 'li') { if (!ul) { ul = h('ul'); dest.appendChild(ul); } ul.appendChild(conNegritas('li', b.texto)); }
      else if (b.tipo === 'hr') dest.appendChild(h('hr'));
      else if (b.tipo === 'tabla') { var t = h('table'); b.filas.forEach(function (f) { var tr = h('tr'); f.forEach(function (c) { tr.appendChild(conNegritas('td', c)); }); t.appendChild(tr); }); dest.appendChild(t); }
      else dest.appendChild(conNegritas('p', b.texto));
    });
  }

  // ── 2) el lead ──
  function pintarLead(der, a) {
    var l = a.lead, ini = st.ini;
    var card = h('div', { class: 'vt-card' });
    card.appendChild(h('h2', { text: l.nombre || '(sin nombre)' }));
    var dl = h('dl', { class: 'vt-datos' });
    [['Teléfono', h('span', { class: 'vt-tel', text: R.mostrarTelefono(l.telefono) || '—' })], ['Lista', R.etiquetaLista(l.lista) + ' · ' + l.lista.nombre], ['Interés', l.interes || '—'],
      ['Modalidad', l.modalidad || '—'], ['Idioma', l.idioma === 'en' ? 'Inglés' : 'Español'], ['Llegó por', [l.canal, l.origen && l.origen.utm_campaign].filter(Boolean).join(' · ') || '—'],
      ['Último mensaje', l.ultimo_mensaje ? '«' + l.ultimo_mensaje + '»' : '—'], ['Correo', l.correo || '—'], ['Resumen', l.resumen || '—'], ['Notas', l.notas || '—'],
      ['Hora del cliente', l.zona ? new Date().toLocaleTimeString('es-MX', { timeZone: l.zona, hour: '2-digit', minute: '2-digit' }) + ' (' + l.zona + ')' : 'No se sabe la zona: solo se llama cuando es buena hora en todo EE. UU.'],
    ].forEach(function (x) { dl.appendChild(h('dt', { text: x[0] })); dl.appendChild(h('dd', {}, [typeof x[1] === 'string' ? x[1] : x[1]])); });
    card.appendChild(dl);
    card.appendChild(h('h3', { text: 'Cómo empieza la llamada' }));
    card.appendChild(h('div', { class: 'vt-apertura', text: a.apertura || '' }));
    var pl = a.puede_llamar || {};
    if (!pl.ok) card.appendChild(h('div', { class: 'vt-aviso', text: pl.motivo || 'No se puede llamar ahorita.' }));
    var fila = h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:12px' });
    fila.appendChild(h('button', { class: 'vt-btn pri', id: 'vtLlamar', disabled: !pl.ok || !ini.twilio_listo, text: '📞 Llamar desde aquí', onclick: llamar }));
    fila.appendChild(h('button', { class: 'vt-btn', text: '🚫 No volver a llamar', onclick: function () { noLlamar(l); } }));
    if (ini.enlace_membresia) fila.appendChild(h('button', { class: 'vt-btn osc', text: '🔗 Copiar mi enlace de membresía', onclick: function () { copiar(ini.enlace_membresia, this); } }));
    if (ini.staff.auditor) fila.appendChild(h('button', { class: 'vt-btn ok', text: '💵 Marcar depósito', onclick: function () { deposito(l); } }));
    card.appendChild(fila);
    card.appendChild(h('div', { class: 'vt-aviso', style: 'background:#eef4ff;color:#0f2a47' }, [h('b', { text: 'Explica la diferencia: ' }),
      'el programa EN LÍNEA (12, 8 o 4 meses, o Calefacción) trae las clases EN VIVO — la misma clase del salón, transmitida — más los cursos 3D. La MEMBRESÍA solo da los cursos, sin clases en vivo, y es UNA sola: si paga en el sitio ($149, tarjeta) entra también a la app; si paga en la app ($149.99, Apple Pay o Google Pay) entra también al sitio.']));
    card.appendChild(h('p', { class: 'vt-mini', text: 'Ponte los audífonos. La llamada sale con el número de la escuela y se graba: al contestar, el cliente oye «Esta llamada se graba para darle mejor servicio y para capacitación».' }));
    der.appendChild(card);
    if ((a.historial || []).length) {
      var t = h('table', { class: 'vt-tabla' }, [h('tr', {}, [h('th', { text: 'Fecha' }), h('th', { text: 'Contestó' }), h('th', { text: 'Ofreció' }), h('th', { text: 'Cerró' }), h('th', { text: 'Min' }), ini.staff.auditor ? h('th', { text: 'Grabación' }) : null])]);
      a.historial.forEach(function (x) {
        t.appendChild(h('tr', {}, [h('td', { text: fechaCorta(x.creado) }), h('td', { text: x.contesto || '—' }), h('td', { text: (x.ofrecio || []).join(', ') || '—' }), h('td', { text: x.cerro || '—' }),
          h('td', { text: x.duracion_seg ? String(Math.round(x.duracion_seg / 60)) : '—' }),
          ini.staff.auditor ? h('td', {}, [x.grabacion ? h('button', { class: 'vt-btn', text: '▶ Oír', onclick: function () { oir(x.id, this); } }) : document.createTextNode('—')]) : null]));
      });
      der.appendChild(h('div', { class: 'vt-card' }, [h('h3', { text: 'Llamadas anteriores' }), t]));
    }
  }

  async function abrirLead(id) {
    st.abiertoId = id; st.llamada = null;
    try {
      st.abierto = await api('abrir', { prospecto_id: id }); st.msg = null;
      // La encuesta pendiente la dice el SERVIDOR: con ella, los demás leads quedan bloqueados en la lista.
      if (st.ini && st.abierto && 'pendiente' in st.abierto) st.ini.pendiente = st.abierto.pendiente || null;
    }
    catch (e) {
      st.abierto = null; st.msg = { error: e.message };
      if (e.datos && e.datos.pendiente) { st.ini.pendiente = e.datos.pendiente; return abrirLead(e.datos.pendiente.prospecto_id); }
    }
    pintar();
  }

  // ── 3) la llamada (Twilio Voice SDK en el navegador) ──
  function cargarTwilio() {
    if (window.VentasTwilioSimulado) return Promise.resolve(window.VentasTwilioSimulado);   // pruebas
    if (window.Twilio && window.Twilio.Device) return Promise.resolve(window.Twilio);
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = TWILIO_SDK; s.integrity = TWILIO_SRI; s.crossOrigin = 'anonymous';
      s.onload = function () { window.Twilio && window.Twilio.Device ? ok(window.Twilio) : mal(new Error('No cargó Twilio')); };
      s.onerror = function () { mal(new Error('No cargó el programa de llamadas (revisa tu internet).')); };
      document.head.appendChild(s);
    });
  }

  async function llamar() {
    var b = document.getElementById('vtLlamar'); if (b) b.disabled = true;
    var prep;
    try { prep = await api('preparar_llamada', { prospecto_id: st.abiertoId }); }
    catch (e) { st.msg = { error: e.message }; return pintarPanel(document.getElementById('vtDer')); }
    st.llamada = { id: prep.llamada_id, estado: 'Conectando…', inicio: 0 };
    pintarPanel(document.getElementById('vtDer'));
    try {
      var T = await cargarTwilio();
      if (!st.device) { st.device = new T.Device(prep.token, { codecPreferences: ['opus', 'pcmu'], closeProtection: true }); }
      else st.device.updateToken(prep.token);
      var call = await st.device.connect({ params: { llamada: prep.llamada_id, ticket: prep.ticket } });
      st.call = call;
      call.on('ringing', function () { st.llamada.estado = 'Sonando…'; pintarLlamada(); });
      call.on('accept', function () { st.llamada.estado = 'Marcando al cliente…'; st.llamada.inicio = Date.now(); pintarLlamada(); });
      call.on('disconnect', function () { terminoLlamada(); });
      call.on('cancel', function () { terminoLlamada(); });
      call.on('reject', function () { terminoLlamada(); });
      call.on('error', function (err) { st.msg = { error: 'La llamada falló: ' + ((err && err.message) || 'error') }; terminoLlamada(); });
    } catch (e) {
      st.msg = { error: e.message || 'No se pudo conectar la llamada.' };
      try { await api('cancelar_llamada', { llamada_id: prep.llamada_id }); } catch (_) {}
      st.call = null; st.llamada = null; pintarPanel(document.getElementById('vtDer'));
    }
  }

  function pintarLlamada() {
    var der = document.getElementById('vtDer'); if (!der) return;
    vaciar(der); mensaje(der);
    var seg = st.llamada && st.llamada.inicio ? Math.floor((Date.now() - st.llamada.inicio) / 1000) : 0;
    var mudo = !!(st.call && st.call.isMuted && st.call.isMuted());
    der.appendChild(h('div', { class: 'vt-card' }, [
      h('div', { class: 'vt-llamada' }, [h('span', { text: '🎧' }), h('span', { class: 't', text: String(Math.floor(seg / 60)).padStart(2, '0') + ':' + String(seg % 60).padStart(2, '0') }),
        h('span', { text: (st.llamada && st.llamada.estado) || '' }), h('span', { style: 'flex:1' }),
        h('button', { class: 'vt-btn', text: mudo ? '🎙️ Quitar silencio' : '🔇 Silencio', onclick: function () { if (st.call) { st.call.mute(!st.call.isMuted()); pintarLlamada(); } } }),
        h('button', { class: 'vt-btn pri', text: '⏹ Colgar', onclick: function () { if (st.call) st.call.disconnect(); else terminoLlamada(); } })]),
      h('p', { class: 'vt-mini', text: 'El cliente oye el aviso de grabación al contestar. Sigue el guion aprobado (botón «Carpeta de ventas»).' }),
      st.abierto && st.abierto.apertura ? h('div', { class: 'vt-apertura', text: st.abierto.apertura }) : null,
    ]));
    clearTimeout(st.relojLlamada);
    if (st.call) st.relojLlamada = setTimeout(pintarLlamada, 1000);
  }

  async function terminoLlamada() {
    clearTimeout(st.relojLlamada);
    st.call = null; st.llamada = null;
    await abrirLead(st.abiertoId);   // el servidor dice si quedó encuesta pendiente
  }

  // ── 4) la encuesta obligatoria ──
  function pintarEncuesta(der, a) {
    var e = st.enc; var tipo = (a.pendiente && a.pendiente.lista_tipo) || (a.lead && a.lead.lista.tipo) || 'caliente';
    if (!e._llamada || e._llamada !== a.pendiente.id) { st.enc = e = { _llamada: a.pendiente.id, ofrecio: [], compro: [], cita_zona: (a.lead && a.lead.zona) || 'America/Los_Angeles' }; }
    var card = h('div', { class: 'vt-card', id: 'vtEncuesta' });
    card.appendChild(h('h2', { text: 'Encuesta de la llamada' + (a.lead ? ' con ' + a.lead.nombre : '') }));
    card.appendChild(h('p', { class: 'vt-mini', text: 'Obligatoria. Hasta que la guardes no se abre el siguiente lead.' }));
    var redibujar = function () { pintarEncuesta(vaciar(der), a); };
    var grupo = function (titulo, opciones, clave, multiple) {
      card.appendChild(h('h3', { text: titulo }));
      var box = h('div', { class: 'vt-opc', role: 'group', 'aria-label': titulo });
      opciones.forEach(function (o) {
        var on = multiple ? (e[clave] || []).indexOf(o[0]) >= 0 : e[clave] === o[0];
        box.appendChild(h('button', { class: on ? 'on' : '', 'aria-pressed': on ? 'true' : 'false', 'data-v': o[0], text: o[1], onclick: function () {
          if (multiple) { var arr = e[clave] || []; var i = arr.indexOf(o[0]); if (i >= 0) arr.splice(i, 1); else arr.push(o[0]); e[clave] = arr; }
          else e[clave] = o[0];
          redibujar();
        } }));
      });
      card.appendChild(box);
    };
    grupo('¿Contestó?', R.CONTESTO, 'contesto', false);
    if (e.contesto === 'si') {
      grupo('¿Qué le ofreciste? (marca todo lo que ofreciste)', R.OFRECIO, 'ofrecio', true);
      grupo('¿Cerró?', R.CERRO, 'cerro', false);
      if (e.cerro === 'pago' || e.cerro === 'enlace_mandado') {
        grupo('¿Qué compró o va a comprar?', R.OFRECIO.filter(function (o) { return ['nada', 'cita', 'cita_virtual'].indexOf(o[0]) < 0; }), 'compro', true);
        if ((e.compro || []).some(function (x) { return R.PROGRAMAS.indexOf(x) >= 0; })) grupo('¿A qué fecha entra?', (st.ini.lugares || []).map(function (g) { return [g.id, g.nombre + ' · ' + g.fecha]; }), 'grupo_id', false);
      }
      if (e.cerro === 'cita' || e.cerro === 'cita_virtual') {
        card.appendChild(h('h3', { text: e.cerro === 'cita_virtual' ? 'Cita virtual (tour por video): día y hora EN LA HORA DEL CLIENTE' : 'Cita: día y hora' }));
        var zona = e.cerro === 'cita_virtual' ? e.cita_zona : 'America/Los_Angeles';
        var inp = h('input', { type: 'datetime-local', value: e._local || '', 'aria-label': 'Fecha y hora de la cita', onchange: function () { e._local = this.value; e.cita_fecha = R.horaClienteAUtc(this.value, zona); } });
        var fila = h('div', { class: 'vt-opc' }, [inp]);
        if (e.cerro === 'cita_virtual') {
          var sel = h('select', { 'aria-label': 'Zona horaria del cliente', onchange: function () { e.cita_zona = this.value; e.cita_fecha = R.horaClienteAUtc(e._local, this.value); } });
          R.ZONAS.forEach(function (z) { var op = h('option', { value: z[0], text: z[1] }); if (z[0] === e.cita_zona) op.selected = true; sel.appendChild(op); });
          fila.appendChild(sel);
          fila.appendChild(h('span', { class: 'vt-mini', text: 'Se crea una sala de 100ms (como las clases en vivo) y al cliente le llega su enlace por correo.' }));
        }
        card.appendChild(fila);
      }
      if (e.cerro === 'no') {
        grupo('¿Por qué no le interesa?', R.MOTIVOS, 'no_interesa_motivo', false);
        if (e.no_interesa_motivo === 'otra') card.appendChild(h('input', { type: 'text', maxlength: '140', placeholder: 'La razón en pocas palabras', value: e.motivo_texto || '', oninput: function () { e.motivo_texto = this.value; } }));
      }
    }
    card.appendChild(h('h3', { text: 'Notas (opcional)' }));
    card.appendChild(h('textarea', { rows: '2', maxlength: '500', style: 'width:100%', oninput: function () { e.notas = this.value; } }, [e.notas || '']));
    card.appendChild(h('label', { style: 'display:flex;gap:8px;align-items:center;margin:10px 0;font-weight:700;color:#8a1c1c' }, [
      h('input', { type: 'checkbox', checked: e.no_llamar ? true : null, onchange: function () { e.no_llamar = this.checked; redibujar(); } }),
      'Pidió que no le llamen (no vuelve a salir nunca)']));
    var faltan = R.encuestaFaltantes(Object.assign({}, e), tipo);
    if (e.contesto && faltan.length) card.appendChild(h('div', { class: 'vt-aviso', text: 'Falta: ' + faltan.join(' · ') }));
    card.appendChild(h('button', { class: 'vt-btn ok', id: 'vtGuardarEncuesta', disabled: !e.contesto || faltan.length > 0, text: 'Guardar encuesta', onclick: async function () {
      this.disabled = true;
      var resp = {}; Object.keys(e).forEach(function (k) { if (k[0] !== '_') resp[k] = e[k]; });
      try {
        var r = await api('encuesta', { llamada_id: a.pendiente.id, respuestas: resp });
        st.enc = {}; st.abierto = null;
        var aviso = r.cita ? (r.cita.aviso || ('Cita virtual agendada.' + (r.cita.correo_enviado ? ' Al cliente le llegó su enlace por correo.' : ''))) : null;
        await cargar({ ok: 'Encuesta guardada. Ya puedes abrir el siguiente lead.', aviso: aviso });
      } catch (err) { st.msg = { error: err.message + (err.datos && err.datos.errores ? ': ' + err.datos.errores.join(' · ') : '') }; pintarPanel(der); }
    } }));
    der.appendChild(card);
  }

  // ── otras acciones ──
  async function noLlamar(l) {
    if (!confirm('¿Marcar a ' + (l.nombre || 'este lead') + ' como «No volver a llamar»? Ya nunca saldrá en el tablero.')) return;
    try { await api('no_llamar', { prospecto_id: l.id, motivo: 'pidió que no le llamen' }); st.abierto = null; await cargar({ ok: 'Listo: ese número ya no se llama nunca.' }); }
    catch (e) { st.msg = { error: e.message }; pintar(); }
  }
  async function deposito(l) {
    var monto = prompt('Monto del depósito pagado (por ejemplo 650):'); if (!monto) return;
    var opciones = (st.ini.lugares || []).map(function (g, i) { return (i + 1) + ') ' + g.nombre + ' · ' + g.fecha; }).join('\n');
    var n = Number(prompt('¿A qué fecha entra?\n' + opciones)); var g = (st.ini.lugares || [])[n - 1]; if (!g) return;
    try { await api('deposito', { prospecto_id: l.id, monto: Number(monto), grupo_id: g.id }); await cargar({ ok: 'Depósito anotado. Ya cuenta como lugar ocupado.' }); }
    catch (e) { st.msg = { error: e.message }; pintar(); }
  }
  function copiar(txt, btn) {
    var hecho = function () { if (btn) { var t = btn.textContent; btn.textContent = '✅ Copiado'; setTimeout(function () { btn.textContent = t; }, 1500); } };
    try { navigator.clipboard.writeText(txt).then(hecho, function () { prompt('Copia tu enlace:', txt); }); } catch (_) { prompt('Copia tu enlace:', txt); }
  }
  async function oir(id, btn) {
    btn.disabled = true;
    try { var r = await api('grabacion', { llamada_id: id }, true); var url = URL.createObjectURL(await r.blob()); btn.replaceWith(h('audio', { controls: true, src: url })); }
    catch (e) { btn.disabled = false; alert(e.message); }
  }
  async function verDoc(clave, version) {
    var d;
    try { d = await api('documento', version ? { clave: clave, version: version } : { clave: clave }); } catch (e) { alert(e.message); return; }
    var cuerpo;
    if (d.formato === 'html') { cuerpo = h('iframe', { sandbox: '', title: 'Carpeta de ventas', referrerpolicy: 'no-referrer' }); cuerpo.srcdoc = d.contenido; }
    else { cuerpo = h('div', { class: 'doc vt-guion', style: 'max-height:none' }); pintarMarkdown(cuerpo, d.contenido); }
    var modal = h('div', { class: 'vt-modal', role: 'dialog', 'aria-label': clave, onclick: function (ev) { if (ev.target === modal) modal.remove(); } }, [
      h('div', {}, [h('header', {}, [h('b', { text: (clave === 'carpeta' ? '📁 Carpeta de ventas' : clave === 'tour' ? '🖥️ Tour virtual' : '📜 Guion') + ' · ' + d.version + (d.activo === false ? ' (SIN APROBAR)' : '') + ' · uso interno' }),
        h('button', { class: 'vt-btn', text: 'Cerrar', onclick: function () { modal.remove(); } })]), cuerpo])]);
    document.body.appendChild(modal);
  }

  function citasCard(der) {
    var cs = st.ini.citas || [];
    if (!cs.length) return;
    var t = h('table', { class: 'vt-tabla' }, [h('tr', {}, [h('th', { text: 'Cita virtual' }), h('th', { text: 'Sala' }), h('th', { text: 'Estado' }), h('th', { text: '' })])]);
    cs.forEach(function (c) {
      var agendada = c.estado === 'agendada';
      t.appendChild(h('tr', {}, [h('td', { text: fechaCorta(c.inicio_at, c.zona_cliente) + ' (hora del cliente)' }),
        h('td', {}, agendada ? [h('button', { class: 'vt-btn pri', text: '🎥 Entrar a la cita', onclick: function () { entrarCita(c); } }),
          h('button', { class: 'vt-btn', text: '🔗 Copiar enlace del cliente', title: 'Enlace nuevo, de un solo uso', onclick: async function () { var b = this; try { var r = await api('cita_enlace_cliente', { cita_id: c.id }); copiar(r.enlace, b); } catch (e) { alert(e.message); } } })] : [document.createTextNode('—')]),
        h('td', { text: c.estado + (c.compro ? ' · compró' : '') }),
        h('td', {}, agendada ? [h('button', { class: 'vt-btn', text: 'Asistió', onclick: function () { citaEstado(c, 'asistio'); } }), h('button', { class: 'vt-btn', text: 'No asistió', onclick: function () { citaEstado(c, 'no_asistio'); } })]
          : (c.estado === 'asistio' && c.compro == null ? [h('button', { class: 'vt-btn ok', text: 'Compró', onclick: function () { citaEstado(c, 'asistio', true); } }), h('button', { class: 'vt-btn', text: 'No compró', onclick: function () { citaEstado(c, 'asistio', false); } })] : []))]));
    });
    der.appendChild(h('div', { class: 'vt-card' }, [h('h3', { text: '🖥️ Mis citas virtuales (tour)' }), h('p', { class: 'vt-mini', text: 'Comparte tu pantalla y sigue el guion del tour (botón «Tour virtual» arriba).' }), t]));
  }
  async function entrarCita(c) {
    var r;
    try { r = await api('cita_entrar', { cita_id: c.id }); } catch (e) { alert(e.message); return; }
    if (!window.CitaVirtual) { alert('No cargó la sala de video. Recarga la página.'); return; }
    var cont = h('div', { class: 'doc' });
    var modal = h('div', { class: 'vt-modal', role: 'dialog', 'aria-label': 'Cita virtual' }, [h('div', {}, [h('header', {}, [h('b', { text: '🎥 Cita virtual · ' + fechaCorta(c.inicio_at, c.zona_cliente) }), h('span', { class: 'vt-mini', text: r.aviso })]), cont])]);
    document.body.appendChild(modal);
    try { await window.CitaVirtual.entrar({ contenedor: cont, token: r.token, nombre: r.nombre, anfitriona: true, alSalir: function () { modal.remove(); } }); }
    catch (e) { cont.appendChild(h('div', { class: 'vt-error', text: e.message })); cont.appendChild(h('button', { class: 'vt-btn', text: 'Cerrar', onclick: function () { modal.remove(); } })); }
  }
  async function citaEstado(c, estado, compro) { try { var r = await api('cita_estado', { cita_id: c.id, estado: estado, compro: compro }); cargar({ ok: 'Cita actualizada.', aviso: r.aviso || null }); } catch (e) { alert(e.message); } }

  // ── pestaña de Mario (solo puede_auditar_ventas; el servidor lo vuelve a revisar) ──
  function pintarMario(der) {
    vaciar(der); mensaje(der);
    var ini = st.ini;
    var docs = h('table', { class: 'vt-tabla' }, [h('tr', {}, [h('th', { text: 'Documento' }), h('th', { text: 'Versión' }), h('th', { text: 'Estado' }), h('th', { text: '' })])]);
    (ini.documentos || []).forEach(function (d) {
      docs.appendChild(h('tr', {}, [h('td', { text: d.clave }), h('td', { text: d.version }), h('td', { text: d.activo ? '✅ activo (aprobado ' + fechaCorta(d.aprobado_at) + ')' : 'sin aprobar' }),
        h('td', {}, [h('button', { class: 'vt-btn', text: 'Ver', onclick: function () { verDoc(d.clave, d.version); } }),
          d.activo ? null : h('button', { class: 'vt-btn ok', text: 'Aprobar y activar', onclick: async function () { if (!confirm('¿Aprobar ' + d.clave + ' ' + d.version + '? Las asesoras lo verán desde ya.')) return; try { await api('aprobar_documento', { clave: d.clave, version: d.version }); st.vista = 'mario'; cargar({ ok: 'Aprobado.' }); } catch (e) { alert(e.message); } } })])]));
    });
    der.appendChild(h('div', { class: 'vt-card' }, [h('h2', { text: 'Guion, carpeta y tour' }), docs]));
    var cup = h('table', { class: 'vt-tabla' });
    (ini.lugares || []).forEach(function (g) {
      var inp = h('input', { type: 'number', min: '1', max: '300', value: g.cupo == null ? '' : String(g.cupo), style: 'width:80px', 'aria-label': 'Cupo de ' + g.nombre });
      cup.appendChild(h('tr', {}, [h('td', { text: g.nombre + ' · ' + g.fecha }), h('td', {}, [inp]), h('td', { text: g.con_deposito + ' con depósito' }),
        h('td', {}, [h('button', { class: 'vt-btn', text: 'Guardar cupo', onclick: async function () { try { await api('grupo_cupo', { grupo_id: g.id, cupo: inp.value === '' ? null : Number(inp.value) }); st.vista = 'mario'; cargar({ ok: 'Cupo guardado.' }); } catch (e) { alert(e.message); } } })])]));
    });
    der.appendChild(h('div', { class: 'vt-card' }, [h('h2', { text: 'Cupo de cada fecha límite' }), h('p', { class: 'vt-mini', text: 'Solo cuenta como lugar ocupado lo que tiene depósito. Vacío = no se dice ningún número.' }), cup]));
    var lis = h('table', { class: 'vt-tabla' });
    (ini.listas || []).forEach(function (l) {
      lis.appendChild(h('tr', {}, [h('td', { text: R.etiquetaLista(l) }), h('td', { text: l.nombre }), h('td', { text: l.usable ? 'encendida' : (l.motivo || 'apagada') }),
        h('td', {}, [h('button', { class: 'vt-btn', text: l.activa ? 'Apagar' : 'Encender', onclick: async function () {
          var datos = { lista_id: l.id, activa: !l.activa };
          if (!l.activa && l.tipo === 'fria') {
            if (!confirm('Lista FRÍA. ¿La revisaste HOY contra el Registro Nacional No Llame (telemarketing.donotcall.gov) y contra la lista interna? La revisión dura 31 días.')) return;
            var nota = prompt('¿Cómo la revisaste? (archivo, fecha, cuántos números quitaste)'); if (!nota) return;
            datos.dnc_revisado = true; datos.dnc_nota = nota;
          }
          try { await api('lista_estado', datos); st.vista = 'mario'; cargar({ ok: 'Lista actualizada.' }); } catch (e) { alert(e.message); }
        } })])]));
    });
    der.appendChild(h('div', { class: 'vt-card' }, [h('h2', { text: 'Listas de llamada' }), h('p', { class: 'vt-mini', text: 'Las listas importadas (respond.io, Bitrix24, TikTok, Facebook) son frías: no tienen consentimiento registrado. Aviso: TCPA y ley de California; que lo revise un abogado antes de encender una fría.' }), lis]));
    var m = ini.citas_medicion || {};
    der.appendChild(h('div', { class: 'vt-card' }, [h('h2', { text: 'Citas virtuales' }), h('p', { text: 'Agendadas: ' + (m.agendadas || 0) + ' · Asistieron: ' + (m.asistieron || 0) + ' · Compraron: ' + (m.compraron || 0) })]));
    if (ini.pendiente) der.appendChild(h('div', { class: 'vt-card' }, [h('button', { class: 'vt-btn', text: 'Quitar MI encuesta pendiente (la llamada falló)', onclick: async function () { var mo = prompt('¿Por qué?'); if (!mo) return; try { await api('quitar_encuesta', { llamada_id: ini.pendiente.id, motivo: mo }); cargar({ ok: 'Encuesta quitada.' }); } catch (e) { alert(e.message); } } })]));
  }

  // ── montar el botón en el panel de admin (mismo patrón que prospectos-escuela.js) ──
  function montar() {
    var ancla = document.getElementById('navProspectos') || document.querySelector('.admin-nav-btn');
    var menu = document.getElementById('crmMenuVentas');
    if (!ancla && !menu) return false;
    if (ancla && ancla.parentNode && !document.getElementById('navVentasTablero')) {
      var b = h('button', { id: 'navVentasTablero', class: 'admin-nav-btn', text: '📞 Tablero de ventas', onclick: abrir });
      ancla.parentNode.insertBefore(b, ancla);
    }
    if (menu && !document.getElementById('crmMenuTablero')) {
      var a = h('a', { id: 'crmMenuTablero', class: 'crm-sidebar-item', href: '#tablero-ventas', onclick: function (e) { e.preventDefault(); abrir(); } }, [h('span', { class: 'crm-icon', text: '📞' }), ' ', h('span', { text: 'Tablero de ventas (llamar)' })]);
      menu.insertBefore(a, menu.children[1] || null);
    }
    if (tokenPendiente() && !st.autoAbierto) { st.autoAbierto = true; abrir(); }
    return !!document.getElementById('navVentasTablero');
  }
  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.VentasTablero = { abrir: abrir, _st: st };
})();
