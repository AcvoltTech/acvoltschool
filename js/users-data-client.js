// js/users-data-client.js — tier 0 helper for the users-data edge function.
// Exposes 2 globals:
//   window.usersDataAdmin(action, params)  — for admin_* actions (auto-injects admin_email)
//   window.usersDataSelf(action, params)   — for get_self / upsert_self / etc.
// Returns the full edge-function JSON response: { data, error?, ok? }.
// Used by Phase 2 RLS Sprint B refactor — every direct from('users') call is
// migrated to one of these so anon SELECT on users can be locked down at the
// end of the sprint.

(function() {
  var SB_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) || 'https://htklsowiyjwsjnacnvnr.supabase.co';
  function key() {
    return (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
  }
  function adminEmail() {
    try {
      return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
    } catch (_) { return ''; }
  }
  async function call(body) {
    var k = key();
    var resp = await fetch(SB_URL + '/functions/v1/users-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': k,
        'Authorization': 'Bearer ' + (await window.getAdminBearer()),
      },
      body: JSON.stringify(body || {}),
    });
    var json;
    try { json = await resp.json(); } catch (_) { json = { error: 'invalid response' }; }
    if (!resp.ok && !json.error) json.error = 'HTTP ' + resp.status;
    return json;
  }
  // admin_list solía capar en 1000 filas (default de PostgREST): pedir limit:5000 era
  // mentira, la edge devolvía a lo mucho 1000 → el CRM sólo veía ~1000 de 7000+ técnicos
  // (Mario 2026-07-12: "mis registros de usuarios no aparecen en el CRM"). Cuando el caller
  // pide la lista COMPLETA (limit grande/ausente y sin offset propio), paginamos solo de
  // 1000 en 1000 hasta vaciar y devolvemos TODO. Los que piden pocos (limit<2000) o ya
  // paginan a mano (offset presente) NO se tocan — mismo shape { data: [...] }.
  async function callAllPages(action, params) {
    var PAGE = 1000;
    var all = [];
    var seen = Object.create(null);
    var offset = 0;
    var guard = 0;
    while (guard++ < 100) { // tope de seguridad = 100k filas
      var pageBody = Object.assign({ action: action, admin_email: adminEmail() }, params, { offset: offset, limit: PAGE });
      var resp = await call(pageBody);
      if (resp && resp.error) {
        // Error en la 1ª página → propaga. En una página posterior → devuelve lo ya traído
        // (mejor mostrar 6000 que romper toda la lista por una página que falló).
        if (all.length === 0) return resp;
        try { console.warn('[usersDataAdmin] paginado corto en offset', offset, resp.error); } catch (_) {}
        break;
      }
      var batch = (resp && resp.data) || [];
      var added = 0;
      for (var i = 0; i < batch.length; i++) {
        var row = batch[i];
        // dedup por id/email — si la edge ignorara offset, added=0 en la 2ª página → corta.
        var kk = row && (row.id != null ? 'i' + row.id : (row.email ? 'e' + String(row.email).toLowerCase() : null));
        if (kk == null) { all.push(row); added++; continue; }
        if (!seen[kk]) { seen[kk] = 1; all.push(row); added++; }
      }
      if (batch.length < PAGE) break;
      if (added === 0) break;
      offset += PAGE;
    }
    return { data: all, ok: true };
  }
  window.usersDataAdmin = function(action, params) {
    params = params || {};
    var lim = params.limit;
    var wantsAll = (action === 'admin_list') && (params.offset == null) && (lim == null || lim >= 1000);
    if (wantsAll) return callAllPages(action, params);
    var body = Object.assign({ action: action, admin_email: adminEmail() }, params);
    return call(body);
  };
  window.usersDataSelf = function(action, params) {
    var body = Object.assign({ action: action }, params || {});
    return call(body);
  };
})();
