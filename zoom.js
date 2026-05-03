// ============================================
// ACVOLT MaestroAC - zoom.js
// Zoom recordings, verification, admin zoom
// Extracted from monolithic index.html
// Generated: 2026-02-25
// ============================================

// ==================== ZOOM RECORDINGS SYSTEM ====================



// --- Data helpers ---

// === ZOOM RECORDINGS: Supabase + localStorage sync ===

var _zoomRecsCache = null;

var _zoomVerifiedCache = null;



function getZoomRecs() { 

  try { return JSON.parse(localStorage.getItem('maestroac_zoom_recs') || '[]'); } catch(e) { return []; } 

}

function saveZoomRecs(r) { 

  localStorage.setItem('maestroac_zoom_recs', JSON.stringify(r)); 

  // Sync to Supabase

  syncZoomRecsToSupabase(r);

}



function getZoomVerified() { 

  try { return JSON.parse(localStorage.getItem('maestroac_zoom_verified') || '[]'); } catch(e) { return []; } 

}

function saveZoomVerified(v) { 

  localStorage.setItem('maestroac_zoom_verified', JSON.stringify(v)); 

  // Sync to Supabase

  syncZoomVerifiedToSupabase(v);

}



// Sync recordings TO Supabase (admin saves)

async function syncZoomRecsToSupabase(recs) {

  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  try {

    await supabaseClient.from('zoom_recordings').upsert({ 

      id: 'master', 

      data: JSON.stringify(recs), 

      updated_at: new Date().toISOString() 

    });

  } catch(e) { console.warn('Zoom recs sync failed:', e); }

}



// Sync verified list TO Supabase (admin saves)

async function syncZoomVerifiedToSupabase(verified) {

  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  try {

    await supabaseClient.from('zoom_recordings').upsert({ 

      id: 'verified', 

      data: JSON.stringify(verified), 

      updated_at: new Date().toISOString() 

    });

  } catch(e) { console.warn('Zoom verified sync failed:', e); }

}



// Load recordings FROM Supabase (all devices)

async function loadZoomRecsFromSupabase() {

  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  try {

    var { data, error } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'master').single();

    if (data && data.data && !error) {

      var recs = JSON.parse(data.data);

      if (recs.length > 0) {

        var local = getZoomRecs();

        // Use Supabase data if it has more or equal recordings (source of truth)

        if (recs.length >= local.length) {

          localStorage.setItem('maestroac_zoom_recs', JSON.stringify(recs));

          console.log('Zoom recs synced from Supabase:', recs.length, 'recordings');

        }

      }

    }

  } catch(e) { console.warn('Load zoom recs from Supabase failed:', e); }

  

  // Also load verified list

  try {

    var { data: vData, error: vErr } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'verified').single();

    if (vData && vData.data && !vErr) {

      var verified = JSON.parse(vData.data);

      if (verified.length > 0) {

        var localV = getZoomVerified();

        if (verified.length >= localV.length) {

          localStorage.setItem('maestroac_zoom_verified', JSON.stringify(verified));

          console.log('Zoom verified synced from Supabase:', verified.length, 'technicians');

        }

      }

    }

  } catch(e) { console.warn('Load zoom verified from Supabase failed:', e); }

}



// Auto-load on app start

setTimeout(function() { loadZoomRecsFromSupabase(); }, 2000);



// Reload zoom data fresh from Supabase when entering zoom screens

async function refreshZoomFromSupabase() {

  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  try {

    var { data, error } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'master').single();

    if (data && data.data && !error) {

      var recs = JSON.parse(data.data);

      if (recs.length > 0) {

        localStorage.setItem('maestroac_zoom_recs', JSON.stringify(recs));

      }

    }

    var { data: vData, error: vErr } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'verified').single();

    if (vData && vData.data && !vErr) {

      var verified = JSON.parse(vData.data);

      if (verified.length > 0) {

        localStorage.setItem('maestroac_zoom_verified', JSON.stringify(verified));

      }

    }

  } catch(e) { console.warn('Refresh zoom from Supabase failed:', e); }

}

function getZoomSession() { try { return JSON.parse(sessionStorage.getItem('zoom_verified_user') || 'null'); } catch(e) { return null; } }

function setZoomSession(u) { sessionStorage.setItem('zoom_verified_user', JSON.stringify(u)); }

function getZoomWatched() { try { return JSON.parse(localStorage.getItem('maestroac_zoom_watched') || '[]'); } catch(e) { return []; } }

function saveZoomWatched(w) { localStorage.setItem('maestroac_zoom_watched', JSON.stringify(w)); }



// --- Verification ---

function verifyZoomAccess() {

  var name = (document.getElementById('zoomVerifyName').value || '').trim();

  var email = (document.getElementById('zoomVerifyEmail').value || '').trim().toLowerCase();

  var errDiv = document.getElementById('zoomVerifyError');

  if (!name || !email) { errDiv.style.display = 'block'; errDiv.textContent = 'Por favor ingresa tu nombre y email'; return; }

  // If user is logged into the app, auto-verify (no need to be in verified list)

  if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {

    errDiv.style.display = 'none';

    setZoomSession({ name: name || currentUser.nombre, email: email || currentUser.email, ts: Date.now() });

    showZoomRecordings();

    return;

  }

  var verified = getZoomVerified();

  var found = verified.find(function(v) { return v.email.toLowerCase() === email; });

  if (!found) { errDiv.style.display = 'block'; errDiv.textContent = '❌ Email no registrado. Contacta a Maestro Mario para obtener acceso.'; return; }

  errDiv.style.display = 'none';

  setZoomSession({ name: name, email: email, ts: Date.now() });

  showZoomRecordings();

}



// Auto-verify if user is already logged in when entering Zoom screen

function autoVerifyZoomIfLoggedIn() {

  if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {

    var session = getZoomSession();

    if (!session) {

      setZoomSession({ name: currentUser.nombre || currentUser.email, email: currentUser.email, ts: Date.now() });

    }

    showZoomRecordings();

    return true;

  }

  return false;

}



function showZoomRecordings() {

  document.getElementById('zoomVerifyGate').style.display = 'none';

  document.getElementById('zoomRecordingsList').style.display = 'block';

  var session = getZoomSession();

  document.getElementById('zoomWelcomeName').textContent = session ? session.name : '';

  // Reset card filter state on screen show
  zoomCardFilter = 'none';
  document.getElementById('zoomRecordingsContainer').style.display = 'none';
  document.getElementById('zoomSearchInput').style.display = 'none';
  var cards = document.querySelectorAll('#zoomCardsGrid .zoom-nav-card');
  cards.forEach(function(c) { c.classList.remove('active'); });
  var floatBtn = document.getElementById('zoomFloatingBtn');
  if (floatBtn) floatBtn.style.display = 'none';

  updateZoomCardCounts();

}



// === RADIO Y PODCAST ===

var radioStreamURL = 'https://stream.live365.com/a08500';

var radioPageURL = 'https://live365.com/station/a08500';

function openRadioStream() {

  var container = document.getElementById('radioPlayerContainer');

  var audio = document.getElementById('radioAudioPlayer');

  container.style.display = 'block';

  audio.src = radioStreamURL;

  audio.play().catch(function(e) { 

    console.warn('Radio play error:', e);

    // Fallback: open in browser

    container.innerHTML = '<p style="color:#1e40af;font-weight:700;font-size:13px;margin-bottom:8px;">📻 Abriendo Radio en Live365...</p><p style="color:#64748b;font-size:12px;">Si no se reproduce automáticamente, dale click abajo:</p><a href="' + radioPageURL + '" target="_blank" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#dc2626;color:white;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">🔊 Abrir Radio en Live365</a>';

  });

}

function stopRadio() {

  var audio = document.getElementById('radioAudioPlayer');

  if (audio) { audio.pause(); audio.src = ''; }

  document.getElementById('radioPlayerContainer').style.display = 'none';

}



function zoomLogout() {

  sessionStorage.removeItem('zoom_verified_user');

  document.getElementById('zoomVerifyGate').style.display = 'block';

  document.getElementById('zoomRecordingsList').style.display = 'none';

  document.getElementById('zoomVerifyName').value = '';

  document.getElementById('zoomVerifyEmail').value = '';

}



// --- Render Recordings ---

var zoomCardFilter = 'none';


function toggleZoomCardFilter(mode) {
  // If same card tapped again, close
  if (zoomCardFilter === mode) {
    zoomCardFilter = 'none';
    document.getElementById('zoomRecordingsContainer').style.display = 'none';
    document.getElementById('zoomSearchInput').style.display = 'none';
    // Remove active class from all cards
    var cards = document.querySelectorAll('#zoomCardsGrid .zoom-nav-card');
    cards.forEach(function(c) { c.classList.remove('active'); });
    // Hide floating button
    var floatBtn = document.getElementById('zoomFloatingBtn');
    if (floatBtn) floatBtn.style.display = 'none';
    return;
  }
  zoomCardFilter = mode;
  // Clear search when switching filter
  var searchInput = document.getElementById('zoomSearchInput');
  if (searchInput) { searchInput.value = ''; searchInput.style.display = ''; }
  document.getElementById('zoomRecordingsContainer').style.display = '';
  // Set active class on tapped card
  var cards = document.querySelectorAll('#zoomCardsGrid .zoom-nav-card');
  cards.forEach(function(c) { c.classList.remove('active'); });
  var activeCard = document.getElementById('zoomCard_' + mode);
  if (activeCard) activeCard.classList.add('active');
  renderZoomRecordings();
  // Scroll to recordings
  var container = document.getElementById('zoomRecordingsContainer');
  if (container) setTimeout(function() { container.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  // Show floating button
  var floatBtn = document.getElementById('zoomFloatingBtn');
  if (floatBtn) floatBtn.style.display = '';
}


function updateZoomCardCounts() {
  var recs = getZoomRecs();
  var watched = getZoomWatched();
  var now = new Date();

  // Monday of current week
  var dayOfWeek = now.getDay();
  var diffToMon = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
  var startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMon);
  startOfWeek.setHours(0,0,0,0);

  var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  var startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  var endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  var counts = { thisWeek: 0, thisMonth: 0, lastMonth: 0, older: 0, unwatched: 0, watched: 0 };

  recs.forEach(function(r) {
    var d = new Date(r.date);
    var isWatched = watched.indexOf(r.id) !== -1;

    if (d >= startOfWeek) counts.thisWeek++;
    else if (d >= startOfMonth && d < startOfWeek) counts.thisMonth++;
    else if (d >= startOfLastMonth && d <= endOfLastMonth) counts.lastMonth++;
    else if (d < startOfLastMonth) counts.older++;

    if (isWatched) counts.watched++;
    else counts.unwatched++;
  });

  var el;
  el = document.getElementById('zoomCount_thisWeek');
  if (el) el.textContent = counts.thisWeek + ' clase' + (counts.thisWeek !== 1 ? 's' : '');
  el = document.getElementById('zoomCount_thisMonth');
  if (el) el.textContent = counts.thisMonth + ' clase' + (counts.thisMonth !== 1 ? 's' : '');
  el = document.getElementById('zoomCount_lastMonth');
  if (el) el.textContent = counts.lastMonth + ' clase' + (counts.lastMonth !== 1 ? 's' : '');
  el = document.getElementById('zoomCount_older');
  if (el) el.textContent = counts.older + ' clase' + (counts.older !== 1 ? 's' : '');
  el = document.getElementById('zoomCount_unwatched');
  if (el) el.textContent = counts.unwatched + ' sin ver';
  el = document.getElementById('zoomCount_watched');
  if (el) el.textContent = counts.watched + ' vista' + (counts.watched !== 1 ? 's' : '');

  // Also update the global stats (total across ALL recordings)
  var totalMin = 0;
  recs.forEach(function(r) { totalMin += (r.duration_min || 0); });
  var totalCountEl = document.getElementById('zoomTotalCount');
  if (totalCountEl) totalCountEl.textContent = recs.length;
  var totalHoursEl = document.getElementById('zoomTotalHours');
  if (totalHoursEl) totalHoursEl.textContent = Math.round(totalMin / 60);
  var watchedCountEl = document.getElementById('zoomWatchedCount');
  if (watchedCountEl) watchedCountEl.textContent = counts.watched;
}


function zoomGoHome() {
  zoomCardFilter = 'none';
  document.getElementById('zoomRecordingsContainer').style.display = 'none';
  document.getElementById('zoomSearchInput').style.display = 'none';
  var cards = document.querySelectorAll('#zoomCardsGrid .zoom-nav-card');
  cards.forEach(function(c) { c.classList.remove('active'); });
  var floatBtn = document.getElementById('zoomFloatingBtn');
  if (floatBtn) floatBtn.style.display = 'none';
  var screen = document.getElementById('zoomClassesScreen');
  if (screen) screen.scrollTo({ top: 0, behavior: 'smooth' });
}



function renderZoomRecordings() {

  var recs = getZoomRecs().sort(function(a,b) { return new Date(b.date) - new Date(a.date); });

  var search = (document.getElementById('zoomSearchInput').value || '').toLowerCase();

  var watched = getZoomWatched();

  var now = new Date();

  // Monday of current week
  var dayOfWeek = now.getDay();
  var diffToMon = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
  var startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMon);
  startOfWeek.setHours(0,0,0,0);

  var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  var startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  var endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  var filtered = recs.filter(function(r) {
    var d = new Date(r.date);
    var isWatched = watched.indexOf(r.id) !== -1;

    switch (zoomCardFilter) {
      case 'thisWeek': if (!(d >= startOfWeek)) return false; break;
      case 'thisMonth': if (!(d >= startOfMonth && d < startOfWeek)) return false; break;
      case 'lastMonth': if (!(d >= startOfLastMonth && d <= endOfLastMonth)) return false; break;
      case 'older': if (!(d < startOfLastMonth)) return false; break;
      case 'unwatched': if (isWatched) return false; break;
      case 'watched': if (!isWatched) return false; break;
    }

    if (search && r.title.toLowerCase().indexOf(search) === -1) return false;

    return true;

  });



  if (filtered.length === 0) {

    document.getElementById('zoomRecordingsContainer').innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;"><div style="font-size:40px;margin-bottom:10px;">📹</div><p>No hay clases disponibles' + (search ? ' para "' + search + '"' : '') + '</p></div>';

    return;

  }



  var html = '';

  var lastDate = '';

  filtered.forEach(function(r) {

    var d = new Date(r.date);

    var dateStr = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    if (dateStr !== lastDate) {

      html += '<div style="font-size:11px;font-weight:700;color:#64748b;margin:15px 0 6px;padding:4px 0;border-bottom:1px solid #e2e8f0;">' + dateStr + '</div>';

      lastDate = dateStr;

    }

    var isWatched = watched.indexOf(r.id) !== -1;

    var durText = r.duration_min ? Math.floor(r.duration_min/60) + 'h ' + (r.duration_min%60) + 'min' : '';

    html += '<div style="background:#fff;border:1px solid ' + (isWatched ? '#bbf7d0' : '#e2e8f0') + ';border-radius:12px;padding:12px;margin-bottom:8px;' + (isWatched ? 'opacity:0.7;' : '') + '">';

    html += '<div style="display:flex;align-items:center;gap:10px;">';

    html += '<div style="width:42px;height:42px;background:' + (isWatched ? 'linear-gradient(135deg,#27ae60,#2ecc71)' : 'linear-gradient(135deg,#2D8CFF,#0B5CFF)') + ';border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + (isWatched ? '✅' : '📹') + '</div>';

    html += '<div style="flex:1;min-width:0;">';

    html += '<div style="font-size:13px;font-weight:700;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + r.title + '</div>';

    html += '<div style="font-size:10px;color:#94a3b8;margin-top:2px;">' + (r.day_label || '') + (durText ? ' · ' + durText : '') + '</div>';

    html += '</div>';

    html += '</div>';

    html += '<div style="display:flex;gap:6px;margin-top:8px;">';

    html += '<button onclick="openZoomRec(\'' + r.id + '\')" style="flex:1;padding:8px;background:linear-gradient(135deg,#2D8CFF,#0B5CFF);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">▶️ Ver Clase</button>';

    if (!isWatched) {

      html += '<button onclick="markZoomWatched(\'' + r.id + '\')" style="padding:8px 12px;background:#f0fdf4;color:#27ae60;border:1px solid #bbf7d0;border-radius:8px;font-size:11px;cursor:pointer;">✅</button>';

    }

    html += '</div></div>';

  });

  document.getElementById('zoomRecordingsContainer').innerHTML = html;

}



function openZoomRec(id) {

  var recs = getZoomRecs();

  var rec = recs.find(function(r) { return r.id === id; });

  if (rec && rec.link) {

    // Log view

    var session = getZoomSession();

    var log = JSON.parse(localStorage.getItem('zoom_view_log') || '[]');

    log.push({ id: id, user: session ? session.email : '', ts: Date.now() });

    localStorage.setItem('zoom_view_log', JSON.stringify(log));

    window.open(rec.link, '_blank');

  }

}



function markZoomWatched(id) {

  var w = getZoomWatched();

  if (w.indexOf(id) === -1) { w.push(id); saveZoomWatched(w); }

  renderZoomRecordings();

  updateZoomCardCounts();

}



// --- ADMIN: Add/Edit Zoom Recording ---

function showAddZoomRecModal() {

  var modal = document.createElement('div');

  modal.id = 'zoomRecModal';

  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';

  modal.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">' +

    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;"><h3 style="margin:0;color:#1e293b;">📹 Agregar Grabación de Zoom</h3><button onclick="document.getElementById(\'zoomRecModal\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;">✕</button></div>' +

    '<div style="margin-bottom:12px;"><label style="display:block;color:#64748b;font-size:12px;margin-bottom:4px;">Título de la Clase *</label><input id="zrTitle" type="text" placeholder="Ej: Ley de OHM - Unidad 12" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;"></div>' +

    '<div style="margin-bottom:12px;"><label style="display:block;color:#64748b;font-size:12px;margin-bottom:4px;">Link de Zoom (shareable) *</label><input id="zrLink" type="url" placeholder="https://zoom.us/rec/share/..." style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;"></div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">' +

    '<div><label style="display:block;color:#64748b;font-size:12px;margin-bottom:4px;">Fecha *</label><input id="zrDate" type="date" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;"></div>' +

    '<div><label style="display:block;color:#64748b;font-size:12px;margin-bottom:4px;">Duración (min)</label><input id="zrDuration" type="number" placeholder="180" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;"></div>' +

    '</div>' +

    '<div style="margin-bottom:12px;"><label style="display:block;color:#64748b;font-size:12px;margin-bottom:4px;">Día de la semana</label><select id="zrDay" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;"><option value="Lunes">Lunes</option><option value="Martes">Martes</option><option value="Miércoles">Miércoles</option><option value="Jueves">Jueves</option><option value="Viernes">Viernes</option><option value="Sábado">Sábado</option><option value="Domingo">Domingo</option></select></div>' +

    '<div style="margin-bottom:15px;"><label style="display:block;color:#64748b;font-size:12px;margin-bottom:4px;">Categoría</label><select id="zrCategory" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;"><option value="Electricidad">⚡ Electricidad</option><option value="Refrigeración">❄️ Refrigeración</option><option value="HVAC">🌡️ HVAC</option><option value="Teoría">📖 Teoría</option><option value="Manos a la Obra">🔧 Manos a la Obra</option><option value="Examen">📝 Examen Review</option><option value="General">📚 General</option></select></div>' +

    '<button onclick="saveZoomRec()" style="width:100%;padding:12px;background:linear-gradient(135deg,#2D8CFF,#0B5CFF);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;">💾 Guardar Grabación</button>' +

    '</div>';

  document.body.appendChild(modal);

  document.getElementById('zrDate').value = new Date().toISOString().split('T')[0];

}



function saveZoomRec(editId) {

  var title = document.getElementById('zrTitle').value.trim();

  var link = document.getElementById('zrLink').value.trim();

  var date = document.getElementById('zrDate').value;

  var duration = parseInt(document.getElementById('zrDuration').value) || 0;

  var day = document.getElementById('zrDay').value;

  var category = document.getElementById('zrCategory').value;

  if (!title || !link || !date) { alert('Título, link y fecha son requeridos'); return; }

  var recs = getZoomRecs();

  var rec = {

    id: editId || 'zr_' + Date.now(),

    title: title,

    link: link,

    date: date,

    duration_min: duration,

    day_label: day,

    category: category,

    added: new Date().toISOString()

  };

  if (editId) {

    var idx = recs.findIndex(function(r) { return r.id === editId; });

    if (idx !== -1) recs[idx] = rec;

  } else {

    recs.push(rec);

  }

  saveZoomRecs(recs);

  document.getElementById('zoomRecModal').remove();

  renderAdminZoomRecs();

  if (typeof showNotification === 'function') showNotification('✅ Grabación guardada', 'success');

}



function deleteZoomRec(id) {

  if (!confirm('¿Eliminar esta grabación?')) return;

  var recs = getZoomRecs().filter(function(r) { return r.id !== id; });

  saveZoomRecs(recs);

  renderAdminZoomRecs();

}



function editZoomRec(id) {

  var recs = getZoomRecs();

  var rec = recs.find(function(r) { return r.id === id; });

  if (!rec) return;

  showAddZoomRecModal();

  setTimeout(function() {

    document.getElementById('zrTitle').value = rec.title;

    document.getElementById('zrLink').value = rec.link;

    document.getElementById('zrDate').value = rec.date;

    document.getElementById('zrDuration').value = rec.duration_min || '';

    document.getElementById('zrDay').value = rec.day_label || 'Lunes';

    document.getElementById('zrCategory').value = rec.category || 'General';

    // Change save button to edit mode

    var btn = document.querySelector('#zoomRecModal button[onclick="saveZoomRec()"]');

    if (btn) { btn.setAttribute('onclick', 'saveZoomRec("' + id + '")'); btn.textContent = '💾 Actualizar Grabación'; }

  }, 100);

}



function renderAdminZoomRecs() {

  var recs = getZoomRecs().sort(function(a,b) { return new Date(b.date) - new Date(a.date); });

  var verified = getZoomVerified();

  document.getElementById('azrTotal').textContent = recs.length;

  document.getElementById('azrVerified').textContent = verified.length;

  var totalMin = 0;

  recs.forEach(function(r) { totalMin += (r.duration_min || 0); });

  document.getElementById('azrHours').textContent = Math.round(totalMin / 60);



  if (recs.length === 0) {

    document.getElementById('adminZoomRecsList').innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:13px;">No hay grabaciones. Haz clic en ➕ Agregar para subir tu primera clase.</div>';

    return;

  }

  var html = '<div style="display:flex;flex-direction:column;gap:6px;">';

  recs.slice(0, 20).forEach(function(r) {

    var d = new Date(r.date);

    var dateStr = d.toLocaleDateString('es-MX', { day:'numeric', month:'short', year:'numeric' });

    var durText = r.duration_min ? Math.floor(r.duration_min/60) + 'h' + (r.duration_min%60 ? r.duration_min%60 + 'm' : '') : '';

    html += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">';

    html += '<div style="width:32px;height:32px;background:linear-gradient(135deg,#2D8CFF,#0B5CFF);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">📹</div>';

    html += '<div style="flex:1;min-width:0;">';

    html += '<div style="font-size:12px;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + r.title + '</div>';

    html += '<div style="font-size:10px;color:#94a3b8;">' + (r.day_label || '') + ' · ' + dateStr + (durText ? ' · ' + durText : '') + ' · ' + (r.category || '') + '</div>';

    html += '</div>';

    html += '<button onclick="editZoomRec(\'' + r.id + '\')" style="background:#eff6ff;border:1px solid #bfdbfe;color:#2D8CFF;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;">✏️</button>';

    html += '<button onclick="deleteZoomRec(\'' + r.id + '\')" style="background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;">🗑️</button>';

    html += '</div>';

  });

  if (recs.length > 20) html += '<div style="text-align:center;color:#94a3b8;font-size:11px;padding:8px;">... y ' + (recs.length - 20) + ' más</div>';

  html += '</div>';

  document.getElementById('adminZoomRecsList').innerHTML = html;

}



// --- ADMIN: Verified Technicians ---

function showZoomVerifiedModal() {

  var verified = getZoomVerified();

  var modal = document.createElement('div');

  modal.id = 'zoomVerifiedModal';

  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';

  var html = '<div style="background:#fff;border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">';

  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;"><h3 style="margin:0;color:#1e293b;">👥 Técnicos Verificados (' + verified.length + ')</h3><button onclick="document.getElementById(\'zoomVerifiedModal\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;">✕</button></div>';



  // Tabs: Individual | Masivo | Supabase

  html += '<div style="display:flex;gap:4px;margin-bottom:12px;">';

  html += '<button onclick="zvShowTab(\'individual\')" id="zvTabInd" style="flex:1;padding:8px;border:2px solid #2D8CFF;background:#eff6ff;color:#2D8CFF;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">➕ Individual</button>';

  html += '<button onclick="zvShowTab(\'bulk\')" id="zvTabBulk" style="flex:1;padding:8px;border:1px solid #e2e8f0;background:#fff;color:#64748b;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">📋 Importar Masivo</button>';

  html += '<button onclick="zvShowTab(\'supabase\')" id="zvTabSupa" style="flex:1;padding:8px;border:1px solid #e2e8f0;background:#fff;color:#64748b;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">🔄 Desde Supabase</button>';

  html += '</div>';



  // Individual tab

  html += '<div id="zvPanelInd">';

  html += '<div style="display:flex;gap:6px;margin-bottom:12px;">';

  html += '<input id="zvName" type="text" placeholder="Nombre" style="flex:1;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;">';

  html += '<input id="zvEmail" type="email" placeholder="Email" style="flex:1;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;">';

  html += '<button onclick="addZoomVerified()" style="background:#27ae60;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;white-space:nowrap;">➕</button>';

  html += '</div></div>';



  // Bulk tab

  html += '<div id="zvPanelBulk" style="display:none;">';

  html += '<p style="color:#64748b;font-size:11px;margin-bottom:8px;">Pega una lista de técnicos. Un técnico por línea en formato: <strong>Nombre, Email</strong></p>';

  html += '<textarea id="zvBulkText" placeholder="Juan Pérez, juan@email.com\nMaría López, maria@email.com\nCarlos García, carlos@email.com" style="width:100%;height:150px;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;font-family:monospace;resize:vertical;box-sizing:border-box;"></textarea>';

  html += '<div style="display:flex;gap:8px;margin-top:8px;">';

  html += '<button onclick="zvBulkImport()" style="flex:1;padding:10px;background:linear-gradient(135deg,#27ae60,#2ecc71);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">📥 Importar Todos</button>';

  html += '<div id="zvBulkResult" style="flex:1;display:flex;align-items:center;justify-content:center;font-size:12px;color:#64748b;"></div>';

  html += '</div></div>';



  // Supabase tab

  html += '<div id="zvPanelSupa" style="display:none;">';

  html += '<p style="color:#64748b;font-size:11px;margin-bottom:8px;">Importa automáticamente todos los estudiantes registrados en Supabase</p>';

  html += '<button onclick="zvImportFromSupabase()" style="width:100%;padding:12px;background:linear-gradient(135deg,#2D8CFF,#0B5CFF);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">🔄 Importar Estudiantes de Supabase</button>';

  html += '<div id="zvSupaResult" style="margin-top:8px;font-size:12px;color:#64748b;text-align:center;"></div>';

  html += '</div>';



  // Search

  html += '<div style="margin:12px 0 8px;"><input id="zvSearch" oninput="zvFilterList()" type="text" placeholder="🔍 Buscar técnico..." style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;"></div>';



  // Actions

  html += '<div style="display:flex;gap:6px;margin-bottom:8px;">';

  html += '<button onclick="zvSelectAll()" style="padding:5px 10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;font-size:10px;cursor:pointer;color:#64748b;">☑️ Seleccionar Todos</button>';

  html += '<button onclick="zvDeleteSelected()" style="padding:5px 10px;background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;font-size:10px;cursor:pointer;color:#dc2626;">🗑️ Eliminar Seleccionados</button>';

  html += '<div style="flex:1;"></div>';

  html += '<span id="zvCount" style="font-size:11px;color:#94a3b8;display:flex;align-items:center;">' + verified.length + ' técnicos</span>';

  html += '</div>';



  // List

  html += '<div id="zvList" style="max-height:300px;overflow-y:auto;">';

  html += zvRenderList(verified, '');

  html += '</div></div>';

  modal.innerHTML = html;

  document.body.appendChild(modal);

}



function zvRenderList(verified, search) {

  if (verified.length === 0) return '<div style="text-align:center;color:#94a3b8;padding:20px;font-size:13px;">No hay técnicos verificados aún</div>';

  var html = '';

  var s = search.toLowerCase();

  verified.forEach(function(v, i) {

    if (s && v.name.toLowerCase().indexOf(s) === -1 && v.email.toLowerCase().indexOf(s) === -1) return;

    html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#f8fafc;border-radius:8px;margin-bottom:3px;border:1px solid #e2e8f0;">';

    html += '<input type="checkbox" class="zv-check" data-idx="' + i + '" style="cursor:pointer;">';

    html += '<div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + v.name + '</div><div style="font-size:10px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + v.email + '</div></div>';

    html += '<button onclick="removeZoomVerified(' + i + ')" style="background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;padding:3px 6px;border-radius:6px;font-size:9px;cursor:pointer;">✕</button>';

    html += '</div>';

  });

  return html;

}



function zvShowTab(tab) {

  document.getElementById('zvPanelInd').style.display = tab === 'individual' ? 'block' : 'none';

  document.getElementById('zvPanelBulk').style.display = tab === 'bulk' ? 'block' : 'none';

  document.getElementById('zvPanelSupa').style.display = tab === 'supabase' ? 'block' : 'none';

  document.getElementById('zvTabInd').style.cssText = 'flex:1;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;' + (tab==='individual' ? 'border:2px solid #2D8CFF;background:#eff6ff;color:#2D8CFF;' : 'border:1px solid #e2e8f0;background:#fff;color:#64748b;');

  document.getElementById('zvTabBulk').style.cssText = 'flex:1;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;' + (tab==='bulk' ? 'border:2px solid #2D8CFF;background:#eff6ff;color:#2D8CFF;' : 'border:1px solid #e2e8f0;background:#fff;color:#64748b;');

  document.getElementById('zvTabSupa').style.cssText = 'flex:1;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;' + (tab==='supabase' ? 'border:2px solid #2D8CFF;background:#eff6ff;color:#2D8CFF;' : 'border:1px solid #e2e8f0;background:#fff;color:#64748b;');

}



function zvFilterList() {

  var search = (document.getElementById('zvSearch').value || '').trim();

  var verified = getZoomVerified();

  document.getElementById('zvList').innerHTML = zvRenderList(verified, search);

}



function zvBulkImport() {

  var text = (document.getElementById('zvBulkText').value || '').trim();

  if (!text) { alert('Pega la lista de técnicos'); return; }

  var lines = text.split('\n').filter(function(l) { return l.trim(); });

  var verified = getZoomVerified();

  var added = 0, skipped = 0;

  lines.forEach(function(line) {

    var parts = line.split(',');

    if (parts.length < 2) { parts = line.split('\t'); }

    if (parts.length < 2) { skipped++; return; }

    var name = parts[0].trim();

    var email = parts[1].trim().toLowerCase();

    if (!name || !email || !email.includes('@')) { skipped++; return; }

    if (verified.find(function(v) { return v.email.toLowerCase() === email; })) { skipped++; return; }

    verified.push({ name: name, email: email, added: new Date().toISOString() });

    added++;

  });

  saveZoomVerified(verified);

  document.getElementById('zvBulkResult').innerHTML = '<span style="color:#27ae60;">✅ ' + added + ' agregados</span>' + (skipped ? '<span style="color:#f39c12;margin-left:6px;">⚠️ ' + skipped + ' omitidos</span>' : '');

  document.getElementById('zvList').innerHTML = zvRenderList(verified, '');

  document.getElementById('zvCount').textContent = verified.length + ' técnicos';

  document.getElementById('zvBulkText').value = '';

  renderAdminZoomRecs();

}



function zvImportFromSupabase() {

  var result = document.getElementById('zvSupaResult');

  result.innerHTML = '⏳ Importando desde Supabase...';

  if (typeof supabaseClient === 'undefined' || !supabaseClient) {

    result.innerHTML = '❌ Supabase no está conectado';

    return;

  }

  usersDataAdmin('admin_list', { fields: ['nombre','email'], limit: 5000 }).then(function(resp) {

    if (resp.error) { result.innerHTML = '❌ Error: ' + resp.error.message; return; }

    var users = resp.data || [];

    if (users.length === 0) { result.innerHTML = '⚠️ No se encontraron estudiantes en Supabase'; return; }

    var verified = getZoomVerified();

    var added = 0, skipped = 0;

    users.forEach(function(u) {

      if (!u.email) { skipped++; return; }

      var email = u.email.trim().toLowerCase();

      var name = u.nombre || u.email.split('@')[0];

      if (verified.find(function(v) { return v.email.toLowerCase() === email; })) { skipped++; return; }

      verified.push({ name: name, email: email, added: new Date().toISOString(), source: 'supabase' });

      added++;

    });

    saveZoomVerified(verified);

    result.innerHTML = '✅ <strong>' + added + '</strong> importados de ' + users.length + ' estudiantes' + (skipped ? ' · ' + skipped + ' ya existían' : '');

    document.getElementById('zvList').innerHTML = zvRenderList(verified, '');

    document.getElementById('zvCount').textContent = verified.length + ' técnicos';

    renderAdminZoomRecs();

  }).catch(function(e) {

    result.innerHTML = '❌ Error: ' + e.message;

  });

}



function zvSelectAll() {

  var checks = document.querySelectorAll('.zv-check');

  var allChecked = Array.from(checks).every(function(c) { return c.checked; });

  checks.forEach(function(c) { c.checked = !allChecked; });

}



function zvDeleteSelected() {

  var checks = document.querySelectorAll('.zv-check:checked');

  if (checks.length === 0) { alert('Selecciona técnicos primero'); return; }

  if (!confirm('¿Eliminar ' + checks.length + ' técnico(s) seleccionado(s)?')) return;

  var indices = Array.from(checks).map(function(c) { return parseInt(c.dataset.idx); }).sort(function(a,b) { return b - a; });

  var verified = getZoomVerified();

  indices.forEach(function(i) { verified.splice(i, 1); });

  saveZoomVerified(verified);

  document.getElementById('zvList').innerHTML = zvRenderList(verified, '');

  document.getElementById('zvCount').textContent = verified.length + ' técnicos';

  renderAdminZoomRecs();

}



function addZoomVerified() {

  var name = document.getElementById('zvName').value.trim();

  var email = document.getElementById('zvEmail').value.trim().toLowerCase();

  if (!name || !email) { alert('Nombre y email requeridos'); return; }

  var verified = getZoomVerified();

  if (verified.find(function(v) { return v.email.toLowerCase() === email; })) { alert('Este email ya está registrado'); return; }

  verified.push({ name: name, email: email, added: new Date().toISOString() });

  saveZoomVerified(verified);

  document.getElementById('zoomVerifiedModal').remove();

  showZoomVerifiedModal();

  renderAdminZoomRecs();

}



function removeZoomVerified(idx) {

  if (!confirm('¿Eliminar este técnico verificado?')) return;

  var verified = getZoomVerified();

  verified.splice(idx, 1);

  saveZoomVerified(verified);

  document.getElementById('zoomVerifiedModal').remove();

  showZoomVerifiedModal();

  renderAdminZoomRecs();

}



// --- Init on screen show ---

var origShowScreen = showScreen;

showScreen = function(screenId) {

  origShowScreen(screenId);

  if (screenId === 'zoomClassesScreen') {

    // Refresh data from Supabase first (for mobile devices that don't have local data)

    if (typeof refreshZoomFromSupabase === 'function') {

      refreshZoomFromSupabase().then(function() {

        // Auto-verify if user is already logged into the app

        if (typeof autoVerifyZoomIfLoggedIn === 'function' && autoVerifyZoomIfLoggedIn()) {

          // Already verified and showing recordings

        } else {

          var session = getZoomSession();

          if (session) { showZoomRecordings(); } else {

            document.getElementById('zoomVerifyGate').style.display = 'block';

            document.getElementById('zoomRecordingsList').style.display = 'none';

            if (typeof currentUser !== 'undefined' && currentUser) {

              var zn = document.getElementById('zoomVerifyName');

              var ze = document.getElementById('zoomVerifyEmail');

              if (zn && !zn.value && currentUser.nombre) zn.value = currentUser.nombre;

              if (ze && !ze.value && currentUser.email) ze.value = currentUser.email;

            }

          }

        }

      }).catch(function() {

        // Fallback if Supabase fails

        if (typeof autoVerifyZoomIfLoggedIn === 'function' && autoVerifyZoomIfLoggedIn()) {} else {

          var session = getZoomSession();

          if (session) { showZoomRecordings(); } else {

            document.getElementById('zoomVerifyGate').style.display = 'block';

            document.getElementById('zoomRecordingsList').style.display = 'none';

          }

        }

      });

    } else {

      // No refresh function, use existing flow

      if (typeof autoVerifyZoomIfLoggedIn === 'function' && autoVerifyZoomIfLoggedIn()) {} else {

        var session = getZoomSession();

        if (session) { showZoomRecordings(); } else {

          document.getElementById('zoomVerifyGate').style.display = 'block';

          document.getElementById('zoomRecordingsList').style.display = 'none';

        }

      }

    }

  }

  if (screenId === 'adminDashboardScreen') {

    try { renderAdminZoomRecs(); } catch(e) {}

  }

};



// Quick send email (for inline buttons that don't need the full modal)

function quickSendEmail(to, subject, body) {

  openEmailComposer(to, subject, body, 'Enviar Email a ' + to);

}

