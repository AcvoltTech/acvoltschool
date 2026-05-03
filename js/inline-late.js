// ============================================
// LATE INIT — Delegated event listeners for all interactive patterns
// Extracted from inline scripts for CSP compliance
// ============================================

// Mobile bottom nav
var _bnav = document.getElementById('mobileBottomNav');
if (_bnav) {
  _bnav.addEventListener('click', function(e) {
    var btn = e.target.closest('.bnav-item');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    if (action === 'global-search') {
      if (typeof window.openGlobalSearchSafe === 'function') { window.openGlobalSearchSafe(e); return; }
      if (typeof openGlobalSearch === 'function') { try { openGlobalSearch(); } catch(_){} return; }
      try { alert('Buscador aún cargando — toca de nuevo en 1 seg'); } catch(_){}
      return;
    }
    var screen = btn.getAttribute('data-screen');
    if (screen && typeof showScreen === 'function') {
      showScreen(screen);
      if (typeof updateBottomNav === 'function') updateBottomNav(screen);
      var allTabs = _bnav.querySelectorAll('[role="tab"]');
      for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].setAttribute('aria-selected', allTabs[i] === btn ? 'true' : 'false');
      }
    }
  });
}

// CRM sidebar
document.addEventListener('click', function(e) {
  var item = e.target.closest('[data-crm-section]');
  if (!item) return;
  var section = item.getAttribute('data-crm-section');
  if (section && typeof showCrmSection === 'function') {
    showCrmSection(section, item);
  }
});

// Zona de Maestro tabs (data-zm-tab)
document.addEventListener('click', function(e) {
  var tab = e.target.closest('[data-zm-tab]');
  if (!tab) return;
  var name = tab.getAttribute('data-zm-tab');
  if (name && typeof showZmTab === 'function') showZmTab(name);
});

// Source filter buttons (data-source)
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.source-filter-btn[data-source]');
  if (!btn) return;
  var src = btn.getAttribute('data-source');
  if (typeof filterBySource === 'function') filterBySource(src);
});

// Profile section scroll (data-scroll-section)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-scroll-section]');
  if (!el) return;
  var section = el.getAttribute('data-scroll-section');
  if (section && typeof scrollToProfileSection === 'function') scrollToProfileSection(section);
});

// Formula toggles (data-formula-id)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-formula-id]');
  if (!el) return;
  var id = el.getAttribute('data-formula-id');
  if (id && typeof toggleFormula === 'function') toggleFormula(id);
});

// Specialty categories (data-specialty)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-specialty]');
  if (!el) return;
  var cat = el.getAttribute('data-specialty');
  if (cat && typeof showSpecialtyCategories === 'function') showSpecialtyCategories(cat);
});

// Inbox filter (data-inbox-filter)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-inbox-filter]');
  if (!el) return;
  var filter = el.getAttribute('data-inbox-filter');
  if (typeof filterInbox === 'function') filterInbox(filter);
});

// Finance tabs (data-fin-tab)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-fin-tab]');
  if (!el) return;
  var tab = el.getAttribute('data-fin-tab');
  if (tab && typeof finShowTab === 'function') finShowTab(tab);
});

// Student Success tabs (data-ss-tab)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-ss-tab]');
  if (!el) return;
  var tab = el.getAttribute('data-ss-tab');
  if (tab && typeof ssShowTab === 'function') ssShowTab(tab);
});

// Student Success time filters (data-ss-time)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-ss-time]');
  if (!el) return;
  var period = el.getAttribute('data-ss-time');
  if (typeof ssFilterTime === 'function') ssFilterTime(period || null);
});

// Dashboard sort columns (data-sort-column)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-sort-column]');
  if (!el) return;
  var col = el.getAttribute('data-sort-column');
  if (col && typeof ssDashSort === 'function') ssDashSort(col);
});

// Podcast sections (data-podcast-section)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-podcast-section]');
  if (!el) return;
  var section = el.getAttribute('data-podcast-section');
  if (section && typeof togglePodcastSection === 'function') togglePodcastSection(section);
});

// Class type selection (data-class-type)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-class-type]');
  if (!el) return;
  var type = el.getAttribute('data-class-type');
  if (type && typeof selectClassType === 'function') selectClassType(type);
});

// Material stat filter (data-material-stat)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-material-stat]');
  if (!el) return;
  var stat = el.getAttribute('data-material-stat');
  if (typeof filterMaterialByStat === 'function') filterMaterialByStat(stat);
});
