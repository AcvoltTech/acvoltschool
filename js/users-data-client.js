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
  window.usersDataAdmin = function(action, params) {
    var body = Object.assign({ action: action, admin_email: adminEmail() }, params || {});
    return call(body);
  };
  window.usersDataSelf = function(action, params) {
    var body = Object.assign({ action: action }, params || {});
    return call(body);
  };
})();
