// cta-video-admin.js — CRM panel to manage the dashboard "La Explicación" CTA
// video. Mario 2026-05-31. Reads app_config.cta_video (anon SELECT) and writes
// via the cta-video-save edge function (admin-gated). Open-loop strategy: the
// social hook drives downloads; the payoff video lives in the app dashboard.
(function () {
  if (window.CTAVideoAdmin) return;

  function _sbUrl() { return (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co'; }
  function _sbKey() {
    if (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) return SUPABASE_KEY;
    if (typeof SUPABASE_ANON_KEY !== 'undefined' && SUPABASE_ANON_KEY) return SUPABASE_ANON_KEY;
    try { if (window.supabaseClient && window.supabaseClient.supabaseKey) return window.supabaseClient.supabaseKey; } catch (_) {}
    return '';
  }
  function _adminEmail() {
    try {
      if (typeof getAdminEmail === 'function') { var e = getAdminEmail(); if (e) return e; }
    } catch (_) {}
    try { return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; }
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function _field(label, id, val, ph) {
    return '<div style="margin-bottom:12px;"><label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:4px;">' + esc(label) + '</label>'
      + '<input id="' + id + '" value="' + esc(val || '') + '" placeholder="' + esc(ph) + '" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;color:#0f172a;outline:none;"></div>';
  }
  function _area(label, id, val, ph) {
    return '<div style="margin-bottom:12px;"><label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:4px;">' + esc(label) + '</label>'
      + '<textarea id="' + id + '" placeholder="' + esc(ph) + '" rows="2" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;color:#0f172a;outline:none;resize:vertical;">' + esc(val || '') + '</textarea></div>';
  }

  function formHtml(cfg) {
    cfg = cfg || {};
    return ''
      + '<div style="max-width:660px;margin:0 auto;padding:8px;">'
      + '<h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 4px;">📣 Call to Action — La Explicación</h2>'
      + '<p style="color:#475569;font-size:13px;line-height:1.5;margin:0 0 16px;">Este video aparece en el dashboard de la app, debajo del Daily Video. Tu gancho de redes manda aquí: ellos descargan la app para ver la explicación completa.</p>'
      + '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">'
      + _field('Título (el gancho)', 'ctaTitle', cfg.title, 'Ej: 3 pruebas a un compresor que no sabías')
      + _area('Texto de enganche', 'ctaTeaser', cfg.teaser, 'Ej: Si mides presión y no sabes hacer estas 3 pruebas, solo estás adivinando...')
      + _field('Video — Cloudflare Stream UID o link', 'ctaUid', cfg.stream_uid, 'Pega el Stream UID o el link del video')
      + _field('Texto del botón (opcional)', 'ctaText', cfg.cta_text, 'Ej: No te pierdas la explicación chaka')
      + '<label style="display:flex;align-items:center;gap:8px;margin:12px 0;font-size:14px;color:#0f172a;font-weight:600;cursor:pointer;"><input type="checkbox" id="ctaActive" ' + (cfg.active === false ? '' : 'checked') + ' style="width:18px;height:18px;"> Activo (visible en la app ahora)</label>'
      + '<div id="ctaPreview" style="margin:8px 0 14px;"></div>'
      + '<button id="ctaSaveBtn" style="width:100%;padding:13px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:10px;font-weight:800;font-size:15px;cursor:pointer;">Guardar y publicar</button>'
      + '<div id="ctaMsg" style="margin-top:10px;font-size:13px;text-align:center;min-height:18px;"></div>'
      + '</div></div>';
  }

  function previewHtml(ref) {
    ref = String(ref || '').trim();
    if (!ref) return '';
    var isUrl = /^https?:\/\//i.test(ref);
    var isFile = /\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(ref);
    var inner;
    if (isUrl && isFile) inner = '<video controls style="width:100%;max-height:240px;border-radius:8px;background:#000;" src="' + esc(ref) + '"></video>';
    else {
      var src = isUrl ? ref : 'https://iframe.videodelivery.net/' + encodeURIComponent(ref);
      inner = '<div style="position:relative;padding-top:56.25%;border-radius:8px;overflow:hidden;background:#000;"><iframe src="' + esc(src) + '" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>';
    }
    return '<div style="font-size:12px;color:#64748b;margin-bottom:4px;">Vista previa:</div>' + inner;
  }

  function refreshPreview() {
    var box = document.getElementById('ctaPreview'); if (!box) return;
    box.innerHTML = previewHtml((document.getElementById('ctaUid') || {}).value || '');
  }

  function save() {
    var msg = document.getElementById('ctaMsg');
    var title = ((document.getElementById('ctaTitle') || {}).value || '').trim();
    var stream_uid = ((document.getElementById('ctaUid') || {}).value || '').trim();
    var teaser = ((document.getElementById('ctaTeaser') || {}).value || '').trim();
    var cta_text = ((document.getElementById('ctaText') || {}).value || '').trim();
    var active = !!(document.getElementById('ctaActive') || {}).checked;
    if (!title || !stream_uid) { if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'Título y video son requeridos.'; } return; }
    var btn = document.getElementById('ctaSaveBtn'); if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
    fetch(_sbUrl() + '/functions/v1/cta-video-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': _sbKey(), 'Authorization': 'Bearer ' + _sbKey() },
      body: JSON.stringify({ admin_email: _adminEmail(), title: title, teaser: teaser, stream_uid: stream_uid, cta_text: cta_text, active: active })
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (btn) { btn.disabled = false; btn.textContent = 'Guardar y publicar'; }
      if (res && res.ok) { if (msg) { msg.style.color = '#16a34a'; msg.textContent = active ? '✅ Guardado — ya está visible en la app.' : '✅ Guardado (inactivo).'; } }
      else { if (msg) { msg.style.color = '#dc2626'; msg.textContent = '⚠️ ' + ((res && res.error) || 'No se pudo guardar.'); } }
    }).catch(function (e) {
      if (btn) { btn.disabled = false; btn.textContent = 'Guardar y publicar'; }
      if (msg) { msg.style.color = '#dc2626'; msg.textContent = '⚠️ Error: ' + (e.message || e); }
    });
  }

  function wire() {
    var btn = document.getElementById('ctaSaveBtn'); if (btn) btn.onclick = save;
    var uid = document.getElementById('ctaUid'); if (uid) uid.oninput = refreshPreview;
    refreshPreview();
  }

  window.CTAVideoAdmin = {
    render: function () {
      var panel = document.getElementById('crm-section-ctaVideo');
      if (!panel) return;
      panel.innerHTML = '<div style="padding:24px;color:#64748b;">Cargando...</div>';
      fetch(_sbUrl() + '/rest/v1/app_config?select=value&key=eq.cta_video', { headers: { apikey: _sbKey(), Authorization: 'Bearer ' + _sbKey() } })
        .then(function (r) { return r.json(); }).then(function (rows) {
          var cfg = {};
          try { if (rows && rows[0] && rows[0].value) cfg = JSON.parse(rows[0].value); } catch (_) { cfg = {}; }
          if (cfg && cfg.title === 'placeholder') cfg = {}; // ignore the dev seed
          panel.innerHTML = formHtml(cfg);
          wire();
        }).catch(function () { panel.innerHTML = formHtml({}); wire(); });
    }
  };
})();
