// cta-video-admin.js — CRM "Call to Action" manager for the app's Explicaciones
// video LIBRARY. Mario 2026-05-31. Manage multiple videos (add/edit/delete) +
// social links. Reads app_config.explicaciones + social_links (anon SELECT),
// writes via cta-video-save (actions save_video / delete_video / save_social).
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
    try { if (typeof getAdminEmail === 'function') { var e = getAdminEmail(); if (e) return e; } } catch (_) {}
    try { return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; }
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmtDate(d) { try { var p = String(d).slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; } catch (_) { return ''; } }
  function todayISO() { try { return new Date().toISOString().slice(0, 10); } catch (_) { return ''; } }

  var STATE = { videos: [], social: {}, editingId: '' };

  function post(payload, cb) {
    payload.admin_email = _adminEmail();
    fetch(_sbUrl() + '/functions/v1/cta-video-save', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': _sbKey(), 'Authorization': 'Bearer ' + _sbKey() },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).then(function (res) { cb(res, null); }, function (e) { cb(null, e); });
  }

  // ── Form (add / edit a video) ──
  function videoFormHtml(v) {
    v = v || {};
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px;">' +
      '<div style="font-size:15px;font-weight:800;color:#0f172a;margin-bottom:10px;">' + (v.id ? '✏️ Editar explicación' : '➕ Agregar explicación') + '</div>' +
      _field('Título (el gancho)', 'ctaTitle', v.title, 'Ej: 3 pruebas a un compresor que no sabías') +
      _area('Texto de enganche', 'ctaTeaser', v.teaser, 'Ej: Si mides presión y no sabes hacer estas 3 pruebas, solo estás adivinando...') +
      '<div style="margin-bottom:12px;">' +
        '<label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:4px;">Video (vertical) de la explicación</label>' +
        '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;line-height:1.4;">💡 Sube <b>vertical en MP4</b> (no .MOV) para que cargue rápido y se vea en TODOS los teléfonos. Ideal: 1-2 min, 30-80 MB.</div>' +
        '<input type="file" id="ctaFile" accept="video/*" style="display:none;">' +
        '<button type="button" id="ctaUploadBtn" style="width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:800;font-size:14px;cursor:pointer;margin-bottom:6px;">⬆️ Subir video de mi dispositivo</button>' +
        '<div style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:6px;">— o pega un link / Stream UID —</div>' +
        '<input id="ctaUid" value="' + esc(v.video || '') + '" placeholder="Se llena solo al subir, o pega un link/UID" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;color:#0f172a;outline:none;">' +
        '<div id="ctaUpStatus" style="font-size:12px;margin-top:6px;min-height:16px;"></div>' +
      '</div>' +
      _field('Texto del botón (opcional)', 'ctaText', v.cta_text, 'Ej: No te pierdas la explicación chaka') +
      '<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:140px;"><label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:4px;">Fecha</label>' +
        '<input id="ctaDate" type="date" value="' + esc(v.date || todayISO()) + '" style="width:100%;box-sizing:border-box;padding:9px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;color:#0f172a;"></div>' +
        '<label style="display:flex;align-items:center;gap:8px;font-size:14px;color:#0f172a;font-weight:600;cursor:pointer;margin-top:18px;"><input type="checkbox" id="ctaActive" ' + (v.active === false ? '' : 'checked') + ' style="width:18px;height:18px;"> Activo</label>' +
      '</div>' +
      '<input type="hidden" id="ctaEditId" value="' + esc(v.id || '') + '">' +
      '<div id="ctaPreview" style="margin:8px 0 14px;"></div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button id="ctaSaveBtn" style="flex:2;padding:13px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:10px;font-weight:800;font-size:15px;cursor:pointer;">' + (v.id ? 'Guardar cambios' : 'Publicar explicación') + '</button>' +
        (v.id ? '<button id="ctaCancelBtn" style="flex:1;padding:13px;background:#e2e8f0;color:#334155;border:none;border-radius:10px;font-weight:800;font-size:14px;cursor:pointer;">Cancelar</button>' : '') +
      '</div>' +
      '<div id="ctaMsg" style="margin-top:10px;font-size:13px;text-align:center;min-height:18px;"></div>' +
    '</div>';
  }
  function _field(label, id, val, ph) {
    return '<div style="margin-bottom:12px;"><label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:4px;">' + esc(label) + '</label>' +
      '<input id="' + id + '" value="' + esc(val || '') + '" placeholder="' + esc(ph) + '" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;color:#0f172a;outline:none;"></div>';
  }
  function _area(label, id, val, ph) {
    return '<div style="margin-bottom:12px;"><label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:4px;">' + esc(label) + '</label>' +
      '<textarea id="' + id + '" placeholder="' + esc(ph) + '" rows="2" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;color:#0f172a;outline:none;resize:vertical;">' + esc(val || '') + '</textarea></div>';
  }

  function listHtml() {
    if (!STATE.videos.length) return '<div style="color:#94a3b8;font-size:13px;padding:12px;text-align:center;">Aún no hay explicaciones. Agrega la primera arriba.</div>';
    var sorted = STATE.videos.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var out = '<div style="font-size:15px;font-weight:800;color:#0f172a;margin:0 0 10px;">📚 Mis explicaciones (' + sorted.length + ')</div>';
    for (var i = 0; i < sorted.length; i++) {
      var v = sorted[i];
      out += '<div style="display:flex;align-items:center;gap:10px;padding:10px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:6px;">' +
        '<div style="font-size:20px;">' + (v.active ? '🟢' : '⚪') + '</div>' +
        '<div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:700;color:#0f172a;line-height:1.3;">' + esc(v.title) + '</div>' +
        '<div style="font-size:11px;color:#64748b;margin-top:2px;">' + fmtDate(v.date) + (v.active ? '' : ' · inactivo') + '</div></div>' +
        '<button onclick="window.CTAVideoAdmin._edit(\'' + esc(v.id) + '\')" style="padding:7px 10px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">Editar</button>' +
        '<button onclick="window.CTAVideoAdmin._del(\'' + esc(v.id) + '\')" style="padding:7px 10px;background:#fff;color:#dc2626;border:1px solid #fecaca;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">Borrar</button>' +
      '</div>';
    }
    return out;
  }

  function socialHtml() {
    var s = STATE.social || {};
    function f(id, label, val, ph) {
      return '<div style="margin-bottom:8px;"><label style="display:block;font-size:12px;font-weight:700;color:#334155;margin-bottom:3px;">' + label + '</label>' +
        '<input id="' + id + '" value="' + esc(val || '') + '" placeholder="' + ph + '" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;color:#0f172a;outline:none;"></div>';
    }
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px;">' +
      '<div style="font-size:15px;font-weight:800;color:#0f172a;margin-bottom:10px;">🔗 Mis redes (botones "Seguir" en cada video)</div>' +
      f('socTiktok', 'TikTok', s.tiktok, 'https://www.tiktok.com/@...') +
      f('socYoutube', 'YouTube', s.youtube, 'https://www.youtube.com/@...') +
      f('socFacebook', 'Facebook', s.facebook, 'https://www.facebook.com/...') +
      f('socInstagram', 'Instagram', s.instagram, 'https://www.instagram.com/...') +
      f('socWhatsapp', 'WhatsApp (link o número)', s.whatsapp, 'https://wa.me/1...') +
      '<button id="socSaveBtn" style="width:100%;padding:11px;background:#0f766e;color:#fff;border:none;border-radius:10px;font-weight:800;font-size:14px;cursor:pointer;margin-top:6px;">Guardar redes</button>' +
      '<div id="socMsg" style="margin-top:8px;font-size:12px;text-align:center;min-height:16px;"></div>' +
    '</div>';
  }

  // ── Preview + upload (same proven path) ──
  function previewHtml(ref) {
    ref = String(ref || '').trim(); if (!ref) return '';
    var isUrl = /^https?:\/\//i.test(ref), isFile = /\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(ref), inner;
    if (isUrl && isFile) inner = '<video controls style="display:block;margin:0 auto;max-width:100%;max-height:55vh;border-radius:8px;background:#000;" src="' + esc(ref) + '"></video>';
    else { var src = isUrl ? ref : 'https://iframe.videodelivery.net/' + encodeURIComponent(ref); inner = '<div style="position:relative;width:100%;max-width:300px;margin:0 auto;padding-top:min(177.78%,55vh);border-radius:8px;overflow:hidden;background:#000;"><iframe src="' + esc(src) + '" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>'; }
    return '<div style="font-size:12px;color:#64748b;margin-bottom:4px;">Vista previa:</div>' + inner;
  }
  function refreshPreview() { var box = document.getElementById('ctaPreview'); if (box) box.innerHTML = previewHtml((document.getElementById('ctaUid') || {}).value || ''); }
  // Robust upload via XHR — real % progress + bar + timeout, so it NEVER looks
  // stuck on big files and a true stall fails cleanly instead of hanging forever.
  // Mario 2026-05-31: "asegúrate que la subida nunca se atore."
  function _getToken(cb) {
    try {
      if (window.supabaseClient && supabaseClient.auth && supabaseClient.auth.getSession) {
        supabaseClient.auth.getSession().then(function (s) { cb((s && s.data && s.data.session) ? s.data.session.access_token : _sbKey()); }, function () { cb(_sbKey()); });
        return;
      }
    } catch (_) {}
    cb(_sbKey());
  }
  function uploadVideo(file) {
    var status = document.getElementById('ctaUpStatus'), btn = document.getElementById('ctaUploadBtn');
    if (!file) return;
    var mb = file.size / (1024 * 1024);
    function fail(m) {
      if (status) { status.style.color = '#dc2626'; status.textContent = '⚠️ ' + m + ' — reintenta o pega un link.'; }
      if (btn) { btn.disabled = false; btn.textContent = '⬆️ Subir video de mi dispositivo'; }
    }
    if (status) {
      status.style.color = '#2563eb';
      status.innerHTML = '⏳ Subiendo (' + mb.toFixed(1) + ' MB)... <b id="ctaUpPct">0%</b><div style="height:7px;background:#e2e8f0;border-radius:4px;margin-top:5px;overflow:hidden;"><div id="ctaUpBar" style="height:100%;width:0;background:#2563eb;transition:width .25s;"></div></div>';
    }
    if (btn) { btn.disabled = true; btn.textContent = 'Subiendo...'; }
    var path = 'cta-videos/' + Date.now() + '_' + String(file.name || 'video.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');
    _getToken(function (token) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', _sbUrl() + '/storage/v1/object/school-files/' + path, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('apikey', _sbKey());
        xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            var pct = Math.round(e.loaded / e.total * 100);
            var p = document.getElementById('ctaUpPct'); if (p) p.textContent = pct + '%';
            var b = document.getElementById('ctaUpBar'); if (b) b.style.width = pct + '%';
          }
        };
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            var pub = supabaseClient.storage.from('school-files').getPublicUrl(path);
            var url = (pub && pub.data) ? pub.data.publicUrl : '';
            var inp = document.getElementById('ctaUid'); if (inp) inp.value = url;
            var isMov = /\.mov($|\?)/i.test(String(file.name || '')) || String(file.type || '').indexOf('quicktime') >= 0;
            if (status) {
              status.style.color = '#16a34a';
              status.innerHTML = '✅ Video subido. Dale "Publicar".' + (isMov ? '<div style="color:#b45309;font-weight:700;margin-top:5px;line-height:1.4;">⚠️ Es .MOV — se ve en iPhone pero <b>NO en Android</b>. Para que jale en los dos, sube <b>MP4</b>.</div>' : '');
            }
            if (btn) { btn.disabled = false; btn.textContent = '⬆️ Subir otro video'; }
            refreshPreview();
          } else {
            var m = 'Error ' + xhr.status; try { var d = JSON.parse(xhr.responseText); m = d.message || d.error || m; } catch (_) {}
            fail(m);
          }
        };
        xhr.onerror = function () { fail('Falló la conexión.'); };
        xhr.timeout = 900000; // 15 min ceiling — true stalls fail cleanly
        xhr.ontimeout = function () { fail('La subida tardó demasiado (señal lenta o archivo muy pesado).'); };
        xhr.send(file);
      } catch (e) { fail((e && e.message) || 'Error inesperado.'); }
    });
  }

  function wire() {
    var up = document.getElementById('ctaUploadBtn'), fi = document.getElementById('ctaFile');
    if (up && fi) { up.onclick = function () { fi.click(); }; fi.onchange = function () { if (fi.files && fi.files[0]) uploadVideo(fi.files[0]); }; }
    var uid = document.getElementById('ctaUid'); if (uid) uid.oninput = refreshPreview;
    var save = document.getElementById('ctaSaveBtn'); if (save) save.onclick = saveVideo;
    var cancel = document.getElementById('ctaCancelBtn'); if (cancel) cancel.onclick = function () { STATE.editingId = ''; rerender(); };
    var soc = document.getElementById('socSaveBtn'); if (soc) soc.onclick = saveSocial;
    refreshPreview();
  }

  function saveVideo() {
    var msg = document.getElementById('ctaMsg');
    var payload = {
      action: 'save_video',
      id: ((document.getElementById('ctaEditId') || {}).value || '').trim(),
      title: ((document.getElementById('ctaTitle') || {}).value || '').trim(),
      teaser: ((document.getElementById('ctaTeaser') || {}).value || '').trim(),
      video: ((document.getElementById('ctaUid') || {}).value || '').trim(),
      cta_text: ((document.getElementById('ctaText') || {}).value || '').trim(),
      date: ((document.getElementById('ctaDate') || {}).value || '').trim(),
      active: !!(document.getElementById('ctaActive') || {}).checked
    };
    if (!payload.title || !payload.video) { if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'Título y video son requeridos.'; } return; }
    var btn = document.getElementById('ctaSaveBtn'); if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
    post(payload, function (res, err) {
      if (res && res.ok) { STATE.videos = res.items || STATE.videos; STATE.editingId = ''; rerender(); }
      else { if (btn) { btn.disabled = false; } if (msg) { msg.style.color = '#dc2626'; msg.textContent = '⚠️ ' + ((res && res.error) || (err && err.message) || 'No se pudo guardar.'); } }
    });
  }
  function saveSocial() {
    var msg = document.getElementById('socMsg');
    var social = {
      tiktok: ((document.getElementById('socTiktok') || {}).value || '').trim(),
      youtube: ((document.getElementById('socYoutube') || {}).value || '').trim(),
      facebook: ((document.getElementById('socFacebook') || {}).value || '').trim(),
      instagram: ((document.getElementById('socInstagram') || {}).value || '').trim(),
      whatsapp: ((document.getElementById('socWhatsapp') || {}).value || '').trim()
    };
    var btn = document.getElementById('socSaveBtn'); if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
    post({ action: 'save_social', social: social }, function (res) {
      if (btn) { btn.disabled = false; btn.textContent = 'Guardar redes'; }
      STATE.social = social;
      if (msg) { msg.style.color = (res && res.ok) ? '#16a34a' : '#dc2626'; msg.textContent = (res && res.ok) ? '✅ Redes guardadas.' : '⚠️ No se pudo guardar.'; }
    });
  }

  window.CTAVideoAdmin = {
    _edit: function (id) { STATE.editingId = id; rerender(); var p = document.getElementById('crm-section-ctaVideo'); if (p) p.scrollTop = 0; },
    _del: function (id) {
      if (!window.confirm('¿Borrar esta explicación?')) return;
      post({ action: 'delete_video', id: id }, function (res) { if (res) { STATE.videos = res.items || STATE.videos.filter(function (v) { return v.id !== id; }); rerender(); } });
    },
    _delPet: function (id) {
      if (!window.supabaseClient || !supabaseClient.from) return;
      supabaseClient.from('suggestions').delete().eq('id', id).then(function () { loadPeticiones(); }, function () {});
    },
    render: function () {
      var panel = document.getElementById('crm-section-ctaVideo');
      if (!panel) return;
      panel.innerHTML = '<div style="padding:24px;color:#64748b;">Cargando...</div>';
      var key = _sbKey(), url = _sbUrl();
      Promise.all([
        fetch(url + '/rest/v1/app_config?select=value&key=eq.explicaciones', { headers: { apikey: key, Authorization: 'Bearer ' + key } }).then(function (r) { return r.json(); }).catch(function () { return null; }),
        fetch(url + '/rest/v1/app_config?select=value&key=eq.social_links', { headers: { apikey: key, Authorization: 'Bearer ' + key } }).then(function (r) { return r.json(); }).catch(function () { return null; })
      ]).then(function (res) {
        try { STATE.videos = (res[0] && res[0][0] && res[0][0].value) ? JSON.parse(res[0][0].value) : []; } catch (_) { STATE.videos = []; }
        try { STATE.social = (res[1] && res[1][0] && res[1][0].value) ? JSON.parse(res[1][0].value) : {}; } catch (_) { STATE.social = {}; }
        if (!Array.isArray(STATE.videos)) STATE.videos = [];
        STATE.editingId = '';
        rerender();
      });
    }
  };

  function rerender() {
    var panel = document.getElementById('crm-section-ctaVideo');
    if (!panel) return;
    var editing = STATE.editingId ? STATE.videos.filter(function (v) { return v.id === STATE.editingId; })[0] : null;
    panel.innerHTML = '<div style="max-width:680px;margin:0 auto;padding:8px;">' +
      '<h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 4px;">📣 Call to Action — Explicaciones</h2>' +
      '<p style="color:#475569;font-size:13px;line-height:1.5;margin:0 0 16px;">Estos videos aparecen en el dashboard de la app (banner → biblioteca por fecha). Tu gancho de redes manda aquí: descargan la app para ver la explicación. Los videos son verticales (TikTok/Reels).</p>' +
      videoFormHtml(editing) +
      socialHtml() +
      '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:16px;">' + listHtml() + '</div>' +
      '<div id="ctaPeticiones" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:14px;"><div style="color:#6b21a8;font-size:14px;">Cargando peticiones...</div></div>' +
      '</div>';
    wire();
    loadPeticiones();
  }

  var PET_MARK = '🎬 PETICIÓN VIDEO: ';
  function loadPeticiones() {
    var box = document.getElementById('ctaPeticiones'); if (!box) return;
    if (!window.supabaseClient || !supabaseClient.from) { box.innerHTML = ''; return; }
    supabaseClient.from('suggestions').select('id,user_name,suggestion_text,created_at').order('created_at', { ascending: false }).limit(150).then(function (res) {
      var rows = (res && res.data) ? res.data.filter(function (r) { return String(r.suggestion_text || '').indexOf('🎬 PETICIÓN VIDEO') === 0; }) : [];
      var h = '<div style="font-size:15px;font-weight:800;color:#6b21a8;margin-bottom:10px;">📋 Peticiones de Videos (' + rows.length + ')</div>';
      if (!rows.length) { box.innerHTML = h + '<div style="color:#a78bfa;font-size:13px;">Aún no hay peticiones. Cuando un técnico pida un video desde la app, aparece aquí.</div>'; return; }
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i]; var txt = String(r.suggestion_text || '').replace(PET_MARK, '').replace('🎬 PETICIÓN VIDEO:', '').trim();
        var d = ''; try { d = new Date(r.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }); } catch (_) {}
        h += '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px;background:#fff;border:1px solid #e9d5ff;border-radius:10px;margin-bottom:6px;">' +
          '<div style="flex:1;min-width:0;"><div style="font-size:14px;color:#0f172a;line-height:1.35;">' + esc(txt) + '</div>' +
          '<div style="font-size:11px;color:#9333ea;margin-top:3px;">' + esc(r.user_name || 'Técnico') + ' · ' + d + '</div></div>' +
          '<button onclick="window.CTAVideoAdmin._delPet(\'' + esc(r.id) + '\')" style="padding:6px 9px;background:#fff;color:#dc2626;border:1px solid #fecaca;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;flex-shrink:0;">✕</button>' +
        '</div>';
      }
      box.innerHTML = h;
    }, function () { box.innerHTML = '<div style="color:#a78bfa;font-size:13px;">No se pudieron cargar las peticiones.</div>'; });
  }
})();
