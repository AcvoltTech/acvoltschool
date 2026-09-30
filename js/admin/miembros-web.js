// ==================== MIEMBROS WEB (30-sep-2026, antes de lanzar anuncios) ====================
// Quién compró la membresía WEB en maestrohvacr.com ($149 catálogo / $750 programa acompañado): plan, estado,
// pagado hasta, anuncio de origen y avance en el aula. Solo PERSONAL ACTIVO: la RPC crm_miembros_web() revisa
// es_staff_activo() con el JWT; el navegador no decide nada. Se monta junto al panel de Prospectos.
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fecha = function (s) { try { return s ? new Date(s).toLocaleDateString('es-MX', { dateStyle: 'medium' }) : '—'; } catch (_) { return s; } };
  var tel = function (t) { return String(t || '').replace(/\D/g, '').replace(/^(\d{10})$/, '1$1'); };
  var COLOR = { 'activa': '#16a34a', 'pago fallido': '#dc2626', 'cancelada': '#64748b', 'pago incompleto': '#d97706' };
  var filtro = 'activa';

  function montar() {
    if (document.getElementById('adminMiembrosWeb')) return true;
    var ancla = document.getElementById('adminProspectos') || document.getElementById('adminFinanzas');
    if (!ancla || !ancla.parentNode) return false;
    var sec = document.createElement('div');
    sec.className = 'admin-section admin-grid-full';
    sec.id = 'adminMiembrosWeb';
    sec.style.cssText = 'background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);';
    sec.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
      '<h3 style="margin:0;color:#0f2342">💳 Miembros web (maestrohvacr.com)</h3>' +
      '<button id="mwRecargar" style="background:#065cff;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700">🔄 Actualizar</button></div>' +
      '<p style="margin:0 0 10px;color:#475569;font-size:13px">Cada venta nueva manda SMS a Mario; pagos fallidos, cancelaciones, reembolsos y contracargos, a Marisol. Los de <b>$750</b> hay que contactarlos para Telegram y soporte.</p>' +
      '<div id="mwResumen" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"></div>' +
      '<div id="mwLista" style="display:grid;gap:10px"><p style="color:#64748b">Cargando…</p></div>';
    ancla.parentNode.insertBefore(sec, ancla.nextSibling);
    var nav = document.getElementById('navProspectos') || document.querySelector('.admin-nav-btn');
    if (nav && nav.parentNode && !document.getElementById('navMiembrosWeb')) {
      var b = document.createElement('button');
      b.id = 'navMiembrosWeb'; b.className = 'admin-nav-btn'; b.textContent = '💳 Miembros web';
      b.onclick = function () { sec.scrollIntoView({ behavior: 'smooth' }); };
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
    document.getElementById('mwRecargar').onclick = cargar;
    cargar();
    return true;
  }

  async function cargar() {
    var lista = document.getElementById('mwLista'); if (!lista) return;
    if (!window.supabaseClient) { lista.innerHTML = '<p style="color:#b91c1c">Sin conexión a la base.</p>'; return; }
    var r = await supabaseClient.rpc('crm_miembros_web');
    // supabase-js NO lanza: un error no es "cero miembros".
    if (r.error) { lista.innerHTML = '<p style="color:#b91c1c">No se pudieron cargar: ' + esc(r.error.message) + '</p>'; return; }
    var todos = r.data || [];
    var activos = todos.filter(function (m) { return m.estado === 'activa'; });
    var mrr = activos.reduce(function (t, m) { return t + (/750/.test(m.plan) ? 750 : 149); }, 0);
    var res = document.getElementById('mwResumen'); res.innerHTML = '';
    [['activa', '✅ Activos'], ['pago fallido', '⚠️ Pago fallido'], ['cancelada', '🗂️ Cancelados'], ['todos', 'Todos']].forEach(function (e) {
      var n = e[0] === 'todos' ? todos.length : todos.filter(function (m) { return m.estado === e[0]; }).length;
      var b = document.createElement('button'); b.textContent = e[1] + ' (' + n + ')';
      b.style.cssText = 'border:1px solid #cbd5e1;border-radius:999px;padding:5px 12px;cursor:pointer;font-weight:700;background:' + (filtro === e[0] ? '#0f2342;color:#fff' : '#fff;color:#0f2342');
      b.onclick = function () { filtro = e[0]; cargar(); };
      res.appendChild(b);
    });
    var tot = document.createElement('span'); tot.style.cssText = 'margin-left:auto;font-weight:800;color:#16a34a;align-self:center';
    tot.textContent = 'Ingreso mensual activo: $' + mrr.toLocaleString('en-US'); res.appendChild(tot);
    var ver = filtro === 'todos' ? todos : todos.filter(function (m) { return m.estado === filtro; });
    if (!ver.length) { lista.innerHTML = '<p style="color:#64748b">' + (todos.length ? 'No hay miembros en este estado.' : 'Todavía no hay compras de la membresía web.') + '</p>'; return; }
    lista.innerHTML = '';
    ver.forEach(function (m) {
      var o = m.origen || {}, es750 = /750/.test(m.plan);
      var fuente = [o.utm_source || o.source || (o.fbclid ? 'facebook' : ''), o.utm_campaign, o.utm_content].filter(Boolean).join(' / ') || 'directo (sin anuncio)';
      var card = document.createElement('div');
      card.style.cssText = 'border:1px solid #e2e8f0;border-left:4px solid ' + (COLOR[m.estado] || '#065cff') + ';border-radius:10px;padding:12px 14px';
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b style="font-size:15px;color:#0f2342">' + esc(m.nombre || m.email) + '</b>' +
        '<span style="font-weight:800;color:' + (COLOR[m.estado] || '#065cff') + '">' + esc(m.estado) + '</span></div>' +
        '<div style="margin:6px 0;font-size:13.5px">' + (es750 ? '⭐ ' : '') + '<b>' + esc(m.plan) + '</b> · desde ' + esc(fecha(m.desde)) + ' · pagado hasta <b>' + esc(fecha(m.pagado_hasta)) + '</b></div>' +
        '<div style="margin:6px 0;font-size:13.5px">📣 ' + esc(fuente) + ' · 📚 ' + (m.clases_aprobadas || 0) + ' clases aprobadas · última actividad ' + esc(fecha(m.ultima_actividad)) + '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">' +
        '<a href="mailto:' + esc(m.email) + '" style="text-decoration:none">✉️ ' + esc(m.email) + '</a>' +
        (m.telefono ? '<a href="tel:+' + tel(m.telefono) + '" style="text-decoration:none">📞 ' + esc(m.telefono) + '</a><a target="_blank" rel="noopener" href="https://wa.me/' + tel(m.telefono) + '" style="text-decoration:none">💬 WhatsApp</a>' : '') +
        '</div>' +
        (es750 && m.estado === 'activa' ? '<p style="margin:8px 0 0;padding:6px 10px;border-radius:8px;background:#fff7e6;color:#78350f;font-size:13px;font-weight:700">Programa acompañado: agrégalo al grupo de Telegram y dale la bienvenida de soporte.</p>' : '') +
        (m.estado === 'pago fallido' ? '<p style="margin:8px 0 0;padding:6px 10px;border-radius:8px;background:#fff1f0;color:#7f1d1d;font-size:13px;font-weight:700">Su pago no pasó: el acceso está en pausa hasta que pague. Llámale para ayudarle a actualizar la tarjeta.</p>' : '');
      lista.appendChild(card);
    });
  }

  var intentos = 0;
  (function probar() { if (montar() || ++intentos > 120) return; setTimeout(probar, 500); })();
  window.cargarMiembrosWeb = cargar;
})();
