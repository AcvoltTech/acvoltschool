// ==================== 📈 ANALÍTICOS DE MAESTROHVACR.COM (30-sep-2026, Mario: «el más chaka para ver cómo nos está yendo») ====================
// Todo en una pantalla: cuántos entran, de qué anuncio, dónde se caen (embudo), leads por asesora y ventas.
// Visitas y pasos = medición propia del sitio (landing/pulso.js → sitio_eventos, sin IP ni datos personales).
// Leads y ventas = la verdad del servidor (prospectos_escuela / study_sales, con su anuncio de origen).
// Clics de «Descargar la app» = app_link_clicks (la página /get/ de los anuncios de la app).
// Solo PERSONAL ACTIVO: la RPC crm_sitio_analiticos() revisa es_staff_activo() con el JWT.
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var num = function (n) { return Number(n || 0).toLocaleString('en-US'); };
  var dias = 7;
  var ACCIONES = { chat_abierto: '💬 Abrieron el chat', chat_mensaje: '✍️ Escribieron al chat', chat_audio: '🎤 Mandaron audio', lead_chat: '🧲 Lead desde el chat',
    form_eligio: '👆 Escogieron con quién hablar', form_enviado: '📝 Mandaron el formulario', checkout_inicio: '💳 Abrieron el pago', compra: '✅ Pagaron',
    registro: '👤 Crearon cuenta', video_carrera: '🎬 Vieron un video de carrera', probadita: '🍿 Vieron una probadita' };

  function montar() {
    if (document.getElementById('adminAnaliticosSitio')) return true;
    var ancla = document.getElementById('adminProspectos') || document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full'; sec.id = 'adminAnaliticosSitio';
    sec.style.cssText = 'background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);padding:0;overflow:hidden';
    sec.innerHTML =
      '<div class="as-cab" style="background:linear-gradient(135deg,#071a33,#0f2f63 60%,#7a1020);color:#fff;padding:18px 20px 16px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      '<div><div class="as-azul" style="font-size:12px;letter-spacing:2px;font-weight:800;color:#93c5fd">MAESTROHVACR.COM</div>' +
      '<h3 style="margin:2px 0 0;color:#fff;font-size:22px">📈 ¿Cómo nos está yendo?</h3></div>' +
      '<div id="asPeriodos" style="display:flex;gap:6px"></div></div>' +
      '<div id="asKpis" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:14px"></div></div>' +
      '<div id="asCuerpo" style="padding:16px 20px;display:grid;gap:18px"><p style="color:#64748b">Cargando…</p></div>';
    // En el teléfono la gráfica ancha estiraba la cuadrícula y el embudo/tablas se salían por la derecha:
    // los hijos de una grid necesitan min-width:0 para poder encogerse (la gráfica hace scroll por dentro).
    var st = document.createElement('style');
    st.textContent = '#adminAnaliticosSitio #asCuerpo>*,#adminAnaliticosSitio #asCuerpo section,#adminAnaliticosSitio #asCuerpo>div>*{min-width:0}' +
      '#adminAnaliticosSitio .as-paso{grid-template-columns:minmax(120px,38%) minmax(0,1fr) 64px!important}' +
      // 30-sep (captura de Mario): el tema del panel pintaba el título y las tarjetas de arriba en oscuro sobre el fondo oscuro.
      '#adminAnaliticosSitio .as-cab,#adminAnaliticosSitio .as-cab h3,#adminAnaliticosSitio .as-cab div,#adminAnaliticosSitio .as-cab span:not(.as-ok):not(.as-mal){color:#fff!important;-webkit-text-fill-color:#fff!important;text-shadow:none!important}' +
      '#adminAnaliticosSitio .as-cab button{-webkit-text-fill-color:currentColor!important}' +
      '#adminAnaliticosSitio .as-cab .as-etq{color:#cbd5e1!important;-webkit-text-fill-color:#cbd5e1!important}' +
      '#adminAnaliticosSitio .as-cab .as-ok{color:#86efac!important;-webkit-text-fill-color:#86efac!important}#adminAnaliticosSitio .as-cab .as-mal{color:#fca5a5!important;-webkit-text-fill-color:#fca5a5!important}' +
      '#adminAnaliticosSitio .as-cab .as-azul{color:#93c5fd!important;-webkit-text-fill-color:#93c5fd!important}' +
      '@media(max-width:520px){#adminAnaliticosSitio .as-paso{grid-template-columns:1fr 56px!important}#adminAnaliticosSitio .as-paso>div:nth-child(2){grid-column:1/-1;order:3}}';
    sec.appendChild(st);
    ancla.parentNode.insertBefore(sec, ancla);
    cargar();
    return true;
  }

  function periodos() {
    var c = document.getElementById('asPeriodos'); c.innerHTML = '';
    [[1, 'Hoy'], [7, '7 días'], [30, '30 días']].forEach(function (p) {
      var b = document.createElement('button'); b.textContent = p[1];
      b.style.cssText = 'border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 14px;cursor:pointer;font-weight:800;' + (dias === p[0] ? 'background:#fff;color:#0f2342' : 'background:transparent;color:#fff');
      b.onclick = function () { dias = p[0]; cargar(); };
      c.appendChild(b);
    });
    var r = document.createElement('button'); r.textContent = '🔄'; r.title = 'Actualizar';
    r.style.cssText = 'border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 10px;cursor:pointer;background:transparent;color:#fff';
    r.onclick = cargar; c.appendChild(r);
  }

  function delta(a, b) {
    a = Number(a || 0); b = Number(b || 0);
    if (!b && !a) return '<span style="color:#cbd5e1">—</span>';
    if (!b) return '<span class="as-ok" style="color:#86efac">▲ nuevo</span>';
    var p = Math.round((a - b) / b * 100);
    return p >= 0 ? '<span class="as-ok" style="color:#86efac">▲ ' + p + '%</span>' : '<span class="as-mal" style="color:#fca5a5">▼ ' + Math.abs(p) + '%</span>';
  }
  function kpi(icono, titulo, valor, extra) {
    return '<div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:10px 12px">' +
      '<div class="as-etq" style="font-size:12.5px;color:#cbd5e1;font-weight:700">' + icono + ' ' + titulo + '</div>' +
      '<div style="font-size:28px;font-weight:900;line-height:1.15;margin-top:2px">' + valor + '</div>' +
      '<div style="font-size:12px;font-weight:700;margin-top:2px">' + (extra || '') + '</div></div>';
  }
  function bloque(titulo, html, nota) {
    return '<section><h4 style="margin:0 0 8px;color:#0f2342;font-size:16px">' + titulo + '</h4>' + (nota ? '<p style="margin:-4px 0 8px;color:#64748b;font-size:12.5px">' + nota + '</p>' : '') + html + '</section>';
  }

  async function cargar() {
    periodos();
    var cuerpo = document.getElementById('asCuerpo'), kp = document.getElementById('asKpis');
    if (!window.supabaseClient) { cuerpo.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await supabaseClient.rpc('crm_sitio_analiticos', { p_dias: dias });
    // supabase-js NO lanza: un error no es «cero visitas».
    if (r.error) { cuerpo.innerHTML = '<p style="color:#b91c1c">No se pudieron cargar: ' + esc(r.error.message) + '</p>'; return; }
    var d = r.data || {}, k = d.kpi || {};
    var ant = dias === 1 ? 'vs. ayer' : 'vs. ' + dias + ' días antes';
    kp.innerHTML =
      kpi('👀', 'Visitantes', num(k.visitantes), delta(k.visitantes, k.visitantes_ant) + ' <span class="as-etq" style="color:#cbd5e1">' + ant + '</span>') +
      kpi('💬', 'Conversaciones', num(k.chats), delta(k.chats, k.chats_ant)) +
      kpi('🧲', 'Leads', num(k.leads), delta(k.leads, k.leads_ant)) +
      kpi('💰', 'Ventas web', num(k.ventas), '$' + num(k.ingreso) + ' · ' + delta(k.ventas, k.ventas_ant)) +
      kpi('📲', 'Clics «Descargar la app»', num(k.clics_app), delta(k.clics_app, k.clics_app_ant)) +
      kpi('📱', 'Desde celular', k.visitantes ? Math.round(k.movil / k.visitantes * 100) + '%' : '—', num(k.visitas) + ' visitas · ' + num(k.paginas) + ' páginas');

    var h = '';
    // ── Día por día: barras de visitantes con leads y ventas encima ──
    var serie = d.serie || [], max = Math.max.apply(null, serie.map(function (x) { return x.visitantes; }).concat([1]));
    h += bloque('Día por día', '<div style="display:flex;align-items:flex-end;gap:' + (serie.length > 14 ? 3 : 8) + 'px;height:170px;padding:8px 4px 0;border-bottom:2px solid #e2e8f0;overflow-x:auto">' +
      serie.map(function (x) {
        var alto = Math.max(3, Math.round(x.visitantes / max * 130)), f = new Date(x.dia + 'T12:00:00');
        return '<div title="' + esc(x.dia) + ': ' + x.visitantes + ' visitantes · ' + x.leads + ' leads · ' + x.ventas + ' ventas" style="flex:1;min-width:14px;display:flex;flex-direction:column;align-items:center;gap:2px">' +
          '<div style="font-size:11px;font-weight:800;color:#0f2342">' + (x.visitantes || '') + '</div>' +
          (x.ventas ? '<div style="font-size:12px">💰' + (x.ventas > 1 ? x.ventas : '') + '</div>' : '') +
          (x.leads ? '<div style="font-size:12px">🧲' + (x.leads > 1 ? x.leads : '') + '</div>' : '') +
          '<div style="width:100%;height:' + alto + 'px;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#065cff,#0f2342)"></div>' +
          '<div style="font-size:10.5px;color:#64748b;white-space:nowrap">' + f.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) + '</div></div>';
      }).join('') + '</div>', '🧲 = leads · 💰 = ventas. La medición de visitas empezó el 30 de septiembre de 2026; antes de esa fecha solo hay leads y ventas.');

    // ── Embudo: dos caminos (comprar solo / pasar por una asesora); el % es contra el paso anterior DEL MISMO camino ──
    var emb = d.embudo || [], top = Math.max((emb[0] || {}).n || 0, 1);
    var camino = function (titulo, idx, colores) {
      return '<div style="margin:4px 0 12px"><div style="font-size:12px;font-weight:900;letter-spacing:1px;color:#64748b;margin:6px 0 2px">' + titulo + '</div>' +
        idx.map(function (k, i) {
          var p = emb[k] || { paso: '', n: 0 }, prev = i ? (emb[idx[i - 1]] || {}).n || 0 : 0, pct = Math.round((p.n || 0) / top * 100);
          var paso = i ? (prev ? Math.round((p.n || 0) / prev * 100) + '% del paso anterior' : '') : '';
          return '<div class="as-paso" style="display:grid;grid-template-columns:minmax(150px,280px) 1fr 70px;gap:4px 10px;align-items:center;margin:8px 0">' +
            '<div style="font-size:13.5px;font-weight:700;color:#0f2342">' + esc(p.paso) + '<div style="font-size:11.5px;color:#64748b;font-weight:600">' + paso + '</div></div>' +
            '<div style="background:#f1f5f9;border-radius:8px;height:26px;overflow:hidden"><div style="height:100%;width:' + Math.max(pct, p.n ? 2 : 0) + '%;background:' + colores[i] + ';border-radius:8px"></div></div>' +
            '<div style="font-weight:900;font-size:18px;color:#0f2342;text-align:right">' + num(p.n) + '</div></div>';
        }).join('') + '</div>';
    };
    h += bloque('El embudo: dónde se nos cae la gente',
      camino('💳 CAMINO DE COMPRA EN LÍNEA', [0, 1, 4, 5], ['#0f2342', '#1d4ed8', '#ea580c', '#16a34a']) +
      camino('🧲 CAMINO CON ASESORA (Brenda · Marisol · Maestro AI)', [0, 2, 3], ['#0f2342', '#7c3aed', '#db2777']),
      'Lectura: si una barra cae de golpe respecto a la anterior de su camino, ahí está el problema a arreglar.');

    // ── De dónde vienen ──
    var fu = d.fuentes || [];
    var tabla = function (cols, filas) {
      return '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13.5px"><thead><tr>' +
        cols.map(function (c, i) { return '<th style="text-align:' + (i ? 'right' : 'left') + ';padding:7px 8px;border-bottom:2px solid #e2e8f0;color:#475569;font-size:12px;letter-spacing:.3px">' + c + '</th>'; }).join('') +
        '</tr></thead><tbody>' + (filas.length ? filas.join('') : '<tr><td colspan="' + cols.length + '" style="padding:10px 8px;color:#94a3b8">Todavía sin datos en este periodo.</td></tr>') + '</tbody></table></div>';
    };
    var fila = function (celdas) { return '<tr>' + celdas.map(function (c, i) { return '<td style="padding:7px 8px;border-bottom:1px solid #f1f5f9;text-align:' + (i ? 'right' : 'left') + '">' + c + '</td>'; }).join('') + '</tr>'; };
    var ICON = { facebook: '📘', instagram: '📸', tiktok: '🎵', google: '🔎', youtube: '▶️', directo: '🔗' };
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:18px">' +
      bloque('De dónde vienen (y quién compra)', tabla(['Fuente', 'Visitantes', 'Leads', 'Ventas', 'Lead por cada 100'],
        fu.map(function (x) { return fila([(ICON[x.fuente] || '🌐') + ' <b>' + esc(x.fuente) + '</b>', num(x.visitantes), num(x.leads), num(x.ventas), x.visitantes ? (Math.round(x.leads / x.visitantes * 1000) / 10) : '—']); })),
        'Para que el anuncio se vea aquí, su enlace debe llevar ?utm_source=tiktok (o facebook) y &utm_campaign=nombre.') +
      bloque('Campañas', tabla(['Campaña', 'Fuente', 'Visitantes'], (d.campanas || []).map(function (x) { return fila(['<b>' + esc(x.campana) + '</b>', esc(x.fuente || ''), num(x.visitantes)]); }))) + '</div>';

    // ── Qué hacen + páginas + asesoras ──
    var acc = d.acciones || {};
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:18px">' +
      bloque('Qué hacen en el sitio', tabla(['Acción', 'Personas'], Object.keys(ACCIONES).filter(function (e) { return acc[e]; }).map(function (e) { return fila([ACCIONES[e], num(acc[e])]); }))) +
      bloque('Páginas más vistas', tabla(['Página', 'Visitantes', 'Vistas'], (d.paginas || []).map(function (x) { return fila(['<code>' + esc(x.pagina) + '</code>', num(x.visitantes), num(x.vistas)]); }))) +
      bloque('Leads por asesora', tabla(['Asesora', 'Leads', 'Nuevos', 'Contactados', 'Inscritos', '📝/🤖'], (d.asesoras || []).map(function (x) {
        return fila(['<b>' + esc(String(x.responsable).split(' ')[0]) + '</b>', num(x.leads), num(x.nuevos), num(x.contactados), '<b style="color:#16a34a">' + num(x.inscritos) + '</b>', num(x.formulario) + ' / ' + num(x.chat)]);
      })), '📝 formulario · 🤖 chat. «Nuevos» = todavía nadie los ha llamado.') + '</div>';
    cuerpo.innerHTML = h;
  }

  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.cargarAnaliticosSitio = cargar;
})();
