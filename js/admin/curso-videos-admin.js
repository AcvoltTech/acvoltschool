// curso-videos-admin.js — Clasificador de "Videos del Curso de Refrigeración".
// Staff (Manuel) recorre TODO el catálogo (acvolt_lessons + tutorial_videos) y
// asigna cada video a su zona correcta (o "No es del curso"). Se guarda el mapa
// en app_config.curso_videos_map (edge fn cta-video-save action save_curso_map)
// y la app muestra SOLO lo clasificado. Mario 2026-06-02.
(function () {
  'use strict';
  var SB_URL = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  function SB_KEY() { if (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) return SUPABASE_KEY; try { if (window.supabaseClient && window.supabaseClient.supabaseKey) return window.supabaseClient.supabaseKey; } catch (_) {} return ''; }
  function adminEmail() { try { if (typeof getAdminEmail === 'function') { var e = getAdminEmail(); if (e) return e; } } catch (_) {} try { return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; } }
  var ZLABELS = { compresores: 'Compresores', condensadores: 'Condensadores', evaporadores: 'Evaporadores', metering: 'Medición', accesorios: 'Accesorios', controles: 'Controles', 'maquinas-hielo': 'Máquinas de Hielo', refrigerantes: 'Refrigerantes' };
  function esc(s) { var d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }

  var _all = [];     // [{src,title,thumb,kind,uid?,url?,cat}]
  var _assign = {};  // src -> zona ('' | zona | 'calefaccion')

  window.loadCursoVideosAdmin = async function () {
    var box = document.getElementById('cvAdminList'); if (!box) return;
    if (!window.supabaseClient) { box.innerHTML = '<div style="color:#dc2626;">Supabase no disponible.</div>'; return; }
    box.innerHTML = '<div style="color:#64748b;padding:20px;">Cargando catálogo de videos…</div>';
    try {
      var acv = await supabaseClient.from('acvolt_lessons').select('id,title,stream_uid').eq('lesson_type', 0).eq('status', 1).not('stream_uid', 'is', null).order('id');
      var tut = await supabaseClient.from('tutorial_videos').select('title,video_url,thumbnail_url,category');
      _all = [];
      (acv.data || []).forEach(function (v) { if (!v.stream_uid) return; _all.push({ src: v.stream_uid, uid: v.stream_uid, kind: 'uid', title: v.title || '(sin título)', thumb: 'https://iframe.videodelivery.net/' + v.stream_uid + '/thumbnails/thumbnail.jpg?time=4s&height=120', cat: 'acvolt_lessons' }); });
      (tut.data || []).forEach(function (v) { if (!v.video_url) return; _all.push({ src: v.video_url, url: v.video_url, kind: 'url', title: v.title || '(sin título)', thumb: v.thumbnail_url || '', cat: v.category || 'tutorial_videos' }); });
      var mres = await supabaseClient.from('app_config').select('value').eq('key', 'curso_videos_map').limit(1);
      _assign = {};
      var mv = mres.data && mres.data[0] && mres.data[0].value;
      if (mv) { var map; try { map = (typeof mv === 'string') ? JSON.parse(mv) : mv; } catch (_) { map = {}; } Object.keys(map || {}).forEach(function (z) { (map[z] || []).forEach(function (v) { var s = v.uid || v.url; if (s) _assign[s] = z; }); }); }
      renderList();
    } catch (e) { box.innerHTML = '<div style="color:#dc2626;">Error: ' + esc(e.message || e) + '</div>'; }
  };

  function counts() { var n = { total: _all.length, asignados: 0 }; Object.keys(ZLABELS).forEach(function (z) { n[z] = 0; }); _all.forEach(function (v) { var z = _assign[v.src]; if (z && ZLABELS[z]) { n.asignados++; n[z]++; } }); return n; }
  function updateSummary() { var c = counts(); var s = document.getElementById('cvAdminSummary'); if (s) s.innerHTML = '<b>' + c.asignados + '</b> asignados de ' + c.total + ' · ' + Object.keys(ZLABELS).map(function (z) { return ZLABELS[z] + ': <b>' + c[z] + '</b>'; }).join(' · '); }

  function renderList() {
    var box = document.getElementById('cvAdminList'); if (!box) return;
    updateSummary();
    var f = ((document.getElementById('cvAdminSearch') || {}).value || '').toLowerCase();
    var onlyU = (document.getElementById('cvAdminOnlyUnassigned') || {}).checked;
    var rows = '', shown = 0;
    _all.forEach(function (v) {
      if (f && v.title.toLowerCase().indexOf(f) < 0) return;
      var z = _assign[v.src] || '';
      if (onlyU && z) return;
      shown++;
      var brd = z ? (z === 'calefaccion' ? '#f0c9b8' : '#bbf7d0') : '#e2e8f0';
      var bg = z ? (z === 'calefaccion' ? '#fff3ee' : '#f0fdf4') : '#fff';
      rows += '<div style="display:flex;align-items:center;gap:10px;padding:8px 6px;border-bottom:1px solid #eef2f7;">';
      rows += '<div style="width:78px;height:44px;border-radius:6px;overflow:hidden;background:#0b1426;flex-shrink:0;">' + (v.thumb ? '<img src="' + esc(v.thumb) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.opacity=0">' : '') + '</div>';
      rows += '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:700;color:#1f2937;line-height:1.3;">' + esc(v.title) + '</div><div style="font-size:10px;color:#94a3b8;">' + esc(v.cat) + '</div></div>';
      rows += '<select onchange="window.cvSetAssign(\'' + esc(v.src).replace(/'/g, '&#39;') + '\',this.value,this)" style="flex-shrink:0;padding:7px;border:1px solid ' + brd + ';border-radius:8px;background:' + bg + ';font-size:12px;font-weight:700;color:#13294a;max-width:160px;">';
      rows += '<option value="">— Sin asignar —</option>';
      Object.keys(ZLABELS).forEach(function (zz) { rows += '<option value="' + zz + '"' + (z === zz ? ' selected' : '') + '>' + ZLABELS[zz] + '</option>'; });
      rows += '<option value="calefaccion"' + (z === 'calefaccion' ? ' selected' : '') + '>🔥 No es del curso</option>';
      rows += '</select></div>';
    });
    box.innerHTML = (rows || '<div style="color:#94a3b8;padding:20px;">Sin resultados.</div>') + (shown ? '<div style="text-align:center;color:#94a3b8;font-size:11px;padding:10px;">' + shown + ' videos mostrados</div>' : '');
  }

  window.cvSetAssign = function (src, zone, sel) {
    _assign[src] = zone;
    if (sel) { var on = !!zone; sel.style.borderColor = on ? (zone === 'calefaccion' ? '#f0c9b8' : '#bbf7d0') : '#e2e8f0'; sel.style.background = on ? (zone === 'calefaccion' ? '#fff3ee' : '#f0fdf4') : '#fff'; }
    updateSummary();
    var sv = document.getElementById('cvSaveBtn'); if (sv) { sv.textContent = '💾 Guardar cambios *'; sv.style.background = '#c9a14a'; }
  };
  window.cvFilter = function () { renderList(); };

  window.cvSaveCursoVideos = function () {
    var map = {}; Object.keys(ZLABELS).forEach(function (z) { map[z] = []; });
    _all.forEach(function (v) { var z = _assign[v.src]; if (z && ZLABELS[z]) { map[z].push(v.kind === 'uid' ? { uid: v.uid, title: v.title } : { url: v.url, thumb: v.thumb, title: v.title }); } });
    var msg = document.getElementById('cvSaveMsg'); if (msg) { msg.style.color = '#64748b'; msg.textContent = 'Guardando…'; }
    fetch(SB_URL + '/functions/v1/cta-video-save', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY(), Authorization: 'Bearer ' + SB_KEY() }, body: JSON.stringify({ action: 'save_curso_map', admin_email: adminEmail(), map: map }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) { if (msg) { msg.style.color = '#16a34a'; msg.textContent = '✅ Guardado. Los videos ya aparecen en sus zonas en la app.'; } var sv = document.getElementById('cvSaveBtn'); if (sv) { sv.textContent = '💾 Guardar cambios'; sv.style.background = '#13294a'; } }
        else { if (msg) { msg.style.color = '#dc2626'; msg.textContent = (res && res.error) || 'No se pudo guardar.'; } }
      })
      .catch(function () { if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'Error de conexión.'; } });
  };
})();
