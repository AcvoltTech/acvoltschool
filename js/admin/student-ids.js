// ==================== STUDENT ID · pedidos (1-oct-2026) ====================
// Credencial institucional de Maestro HVACR / ACVOLT Tech School (US$150). Aquí el personal revisa el pedido pagado (foto, nombre,
// número de técnico, dirección), VERIFICA cada certificación con su comprobante (solo las verificadas se imprimen en el reverso),
// imprime frente y reverso a tamaño tarjeta (CR80, 300 dpi), y lo marca «impreso» (fija expedición y vencimiento a 2 años) y «enviado»
// con la guía del correo. Todo lo decide el servidor (sid_staff_lista / sid_staff_actualizar revisan es_staff_activo()).
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var COLOR = { pendiente_pago: '#94a3b8', pagado: '#d97706', en_revision: '#065cff', impreso: '#7c3aed', enviado: '#16a34a', rechazado: '#dc2626' };
  var NOMBRE = { pendiente_pago: 'Sin pagar', pagado: 'Pagado · por revisar', en_revision: 'En revisión', impreso: 'Impreso', enviado: 'Enviado', rechazado: 'Rechazado' };
  var filtro = 'pagado';

  function montar() {
    if (document.getElementById('adminStudentIds')) return true;
    var ancla = document.getElementById('adminMiembrosWeb') || document.getElementById('adminProspectos') || document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full'; sec.id = 'adminStudentIds';
    sec.style.cssText = 'background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);';
    sec.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
      '<h3 style="margin:0;color:#0f2342">🪪 Student ID · pedidos</h3>' +
      '<button id="sidRecargar" style="background:#065cff;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700">🔄 Actualizar</button></div>' +
      '<p style="margin:0 0 10px;color:#475569;font-size:13px">US$150 · vigencia 2 años desde que se marca <b>Impreso</b> · se manda por correo. En el reverso solo se imprimen las certificaciones que marques como verificadas con su comprobante. Es credencial de la escuela, no licencia del gobierno.</p>' +
      '<div id="sidFiltros" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"></div>' +
      '<div id="sidLista" style="display:grid;gap:10px"><p style="color:#64748b">Cargando…</p></div>';
    ancla.parentNode.insertBefore(sec, ancla.nextSibling);
    var nav = document.getElementById('navMiembrosWeb') || document.getElementById('navProspectos') || document.querySelector('.admin-nav-btn');
    if (nav && nav.parentNode && !document.getElementById('navStudentIds')) {
      var b = document.createElement('button'); b.id = 'navStudentIds'; b.className = 'admin-nav-btn'; b.textContent = '🪪 Student ID';
      b.onclick = function () { sec.scrollIntoView({ behavior: 'smooth' }); };
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
    document.getElementById('sidRecargar').onclick = cargar;
    cargar();
    return true;
  }

  async function firmada(ruta) {
    if (!ruta) return null;
    var r = await supabaseClient.storage.from('student-id').createSignedUrl(ruta, 900);
    return r.error ? null : r.data.signedUrl;
  }

  async function cargar() {
    var lista = document.getElementById('sidLista'); if (!lista) return;
    if (!window.supabaseClient) { lista.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await supabaseClient.rpc('sid_staff_lista');
    if (r.error) { lista.innerHTML = '<p style="color:#b91c1c">No se pudieron cargar: ' + esc(r.error.message) + '</p>'; return; }
    var todos = r.data || [];
    var fil = document.getElementById('sidFiltros'); fil.innerHTML = '';
    ['pagado', 'en_revision', 'impreso', 'enviado', 'pendiente_pago', 'rechazado', 'todos'].forEach(function (e) {
      var n = e === 'todos' ? todos.length : todos.filter(function (p) { return p.estado === e; }).length;
      var b = document.createElement('button'); b.textContent = (e === 'todos' ? 'Todos' : NOMBRE[e]) + ' (' + n + ')';
      b.style.cssText = 'border:1px solid #cbd5e1;border-radius:999px;padding:5px 12px;cursor:pointer;font-weight:700;background:' + (filtro === e ? '#0f2342;color:#fff' : '#fff;color:#0f2342');
      b.onclick = function () { filtro = e; cargar(); }; fil.appendChild(b);
    });
    var ver = filtro === 'todos' ? todos : todos.filter(function (p) { return p.estado === filtro; });
    if (!ver.length) { lista.innerHTML = '<p style="color:#64748b">' + (todos.length ? 'No hay pedidos en este estado.' : 'Todavía no hay pedidos de Student ID.') + '</p>'; return; }
    lista.innerHTML = '';
    for (var i = 0; i < ver.length; i++) lista.appendChild(await tarjeta(ver[i]));
  }

  async function tarjeta(p) {
    var foto = await firmada(p.foto), d = p.direccion || {};
    var card = document.createElement('div');
    card.style.cssText = 'border:1px solid #e2e8f0;border-left:4px solid ' + (COLOR[p.estado] || '#065cff') + ';border-radius:10px;padding:12px 14px;display:grid;grid-template-columns:110px 1fr;gap:12px';
    var certs = p.certificaciones || [];
    card.innerHTML =
      '<div>' + (foto ? '<img src="' + esc(foto) + '" alt="Foto" style="width:110px;height:140px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0">' : '<div style="width:110px;height:140px;background:#f1f5f9;border-radius:8px"></div>') + '</div>' +
      '<div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="font-size:15px;color:#0f2342">' + esc(p.nombre) + '</b>' +
      '<span style="font-weight:800;color:' + (COLOR[p.estado] || '#065cff') + '">' + esc(NOMBRE[p.estado] || p.estado) + '</span></div>' +
      '<div style="font-size:13.5px;margin:4px 0">' + esc(p.titulo) + ' · Tech # ' + esc(p.numero_tecnico || '—') + ' · ' + esc(p.email) + (p.pagado_at ? ' · pagado ' + esc(String(p.pagado_at).slice(0, 10)) : '') + '</div>' +
      '<div style="font-size:13.5px;margin:4px 0">📮 ' + esc([d.linea1, d.linea2, d.ciudad, d.estado, d.zip].filter(Boolean).join(', ')) + '</div>' +
      (p.expedicion ? '<div style="font-size:13.5px;margin:4px 0">Expedición ' + esc(p.expedicion) + ' · vence ' + esc(p.vence) + (p.guia ? ' · guía ' + esc(p.guia) : '') + '</div>' : '') +
      (p.reverso ? '<div data-certs style="margin:6px 0"></div>' : '<div style="font-size:13px;color:#64748b">Sin reverso.</div>') +
      '<div data-acciones style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"></div></div>';
    if (p.reverso) {
      var box = card.querySelector('[data-certs]');
      for (var i = 0; i < certs.length; i++) {
        var c = certs[i], url = await firmada(c.comprobante), row = document.createElement('label');
        row.style.cssText = 'display:flex;gap:8px;align-items:center;font-size:13.5px;margin:3px 0';
        row.innerHTML = '<input type="checkbox" data-i="' + i + '"' + (c.verificada ? ' checked' : '') + '> <b>' + esc(c.tipo) + ':</b> ' + esc(c.numero) +
          (url ? ' · <a href="' + esc(url) + '" target="_blank" rel="noopener">ver comprobante</a>' : ' · <span style="color:#b91c1c">sin comprobante</span>');
        box.appendChild(row);
      }
    }
    var acc = card.querySelector('[data-acciones]');
    function boton(texto, fn, color) { var b = document.createElement('button'); b.textContent = texto; b.style.cssText = 'border:0;border-radius:6px;padding:6px 10px;cursor:pointer;font-weight:700;color:#fff;background:' + (color || '#0f2342'); b.onclick = fn; acc.appendChild(b); }
    var verificadas = function () { return Array.prototype.map.call(card.querySelectorAll('[data-i]:checked'), function (x) { return Number(x.dataset.i); }); };
    async function actualizar(estado, guia) {
      var r = await supabaseClient.rpc('sid_staff_actualizar', { p_id: p.id, p_estado: estado, p_guia: guia || null, p_nota: null, p_verificadas: p.reverso ? verificadas() : null });
      if (r.error) { alert('No se guardó: ' + r.error.message); return; } cargar();
    }
    if (p.estado !== 'pendiente_pago') {
      if (p.reverso) boton('✔️ Guardar verificación', function () { actualizar(null); }, '#065cff');
      boton('🖨️ Imprimir frente y reverso', function () { imprimir(p, foto, verificadas()); });
      if (p.estado === 'pagado') boton('En revisión', function () { actualizar('en_revision'); }, '#065cff');
      if (p.estado === 'pagado' || p.estado === 'en_revision') boton('Marcar IMPRESO (inicia 2 años)', function () { if (confirm('¿Ya imprimiste la credencial? Desde hoy corre la vigencia de 2 años.')) actualizar('impreso'); }, '#7c3aed');
      if (p.estado === 'impreso') boton('📦 Marcar ENVIADO', function () { var g = prompt('Número de guía del correo:'); if (g) actualizar('enviado', g); }, '#16a34a');
      if (p.estado !== 'enviado' && p.estado !== 'rechazado') boton('Rechazar', function () { if (confirm('¿Rechazar este pedido? (el reembolso se hace aparte en Stripe)')) actualizar('rechazado'); }, '#dc2626');
    }
    return card;
  }

  async function imprimir(p, foto, verificadas) {
    if (!window.MaestroStudentId) { alert('No cargó el diseño de la credencial. Recarga la página.'); return; }
    var hoy = new Date(), exp = p.expedicion || hoy.toISOString().slice(0, 10);
    var vence = p.vence || new Date(hoy.getFullYear() + 2, hoy.getMonth(), hoy.getDate()).toISOString().slice(0, 10);
    var certs = (p.certificaciones || []).map(function (c, i) { return { tipo: c.tipo, numero: c.numero, verificada: verificadas.indexOf(i) >= 0 || c.verificada }; });
    var d = { nombre: p.nombre, titulo: p.titulo, numero: p.numero_tecnico, foto: foto, expedicion: exp, vence: vence, certificaciones: p.reverso ? certs : [], soloVerificadas: true };
    var fr = await MaestroStudentId.dibujar(d, 'frente'), rv = await MaestroStudentId.dibujar(d, 'reverso');
    var w = window.open('', '_blank'); if (!w) { alert('Permite ventanas emergentes para imprimir.'); return; }
    w.document.write('<!doctype html><title>Student ID · ' + esc(p.nombre) + '</title><style>@page{size:3.375in 2.125in;margin:0}body{margin:0}img{width:3.375in;height:2.125in;display:block;page-break-after:always}</style>' +
      (p.expedicion ? '' : '<p style="font:14px Arial;padding:8px;background:#fff7e6">Vista previa: la fecha de expedición se fija al marcar IMPRESO.</p>') +
      '<img src="' + fr.toDataURL('image/png') + '" alt="Frente"><img src="' + rv.toDataURL('image/png') + '" alt="Reverso">');
    w.document.close(); setTimeout(function () { try { w.print(); } catch (_) {} }, 400);
  }

  var intentos = 0;
  (function esperar() { if (montar()) return; if (++intentos < 40) setTimeout(esperar, 500); })();
})();
