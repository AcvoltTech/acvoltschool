// ============================================================
// MaestroMemberships — la ÚNICA puerta del CRM a la tabla del dinero
// Mario 2026-08-08
//
// POR QUÉ: `memberships` estaba abierta a `anon` (SELECT/INSERT/UPDATE con USING true).
// Con la llave pública que va dentro del app, cualquiera podía bajarse las 697 filas con
// correos y montos, darse VIP a sí mismo, o quitarle el acceso a un cliente que pagó
// (verificado con peticiones reales). Esas políticas existían porque el CRM y el panel de
// Student Success leen y escriben la tabla DIRECTO con la llave anónima — el login de admin
// no abre sesión de Supabase.
//
// Este módulo manda todo por la edge function `admin-memberships`, que corre con
// service_role pero exige que el correo esté en `admin_staff` y activo. Con esto se puede
// cerrar la tabla sin dejar a Mario y a Marisol sin herramientas.
//
// USO (reemplaza a supabaseClient.from('memberships')):
//   await MaestroMemberships.list('email,activa')          // todas
//   await MaestroMemberships.byEmail(correo, {activa:true}) // una persona
//   await MaestroMemberships.setActiva(correo, false)       // bloquear / desbloquear
//   await MaestroMemberships.upsert({email, activa, ...})   // alta o actualización
// Todas devuelven { data: [...], error: null } — la MISMA forma que supabase-js, para que
// el código que las llama no tenga que cambiar de estilo.
// ============================================================
(function (global) {
  'use strict';

  var ENDPOINT = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co')
    + '/functions/v1/admin-memberships';

  // 🔴 La sesión de admin vive en DOS lados (js/admin/hash-passwords.js la escribe en ambos):
  // `sessionStorage` muere al cerrar la pestaña, `localStorage` persiste. Leer solo el primero
  // dejaba el roster VACÍO ("No technicians registered yet") a un admin con sesión válida —
  // pasó en cuanto Mario lo abrió. Se leen los dos, y de último `window._adminSession`.
  function _adminEmail() {
    var e = '';
    try { e = sessionStorage.getItem('admin_email') || ''; } catch (_) {}
    if (!e) { try { e = localStorage.getItem('admin_email') || ''; } catch (_) {} }
    if (!e) { try { e = (window._adminSession && window._adminSession.email) || ''; } catch (_) {} }
    if (!e) { try { e = localStorage.getItem('tecnico_email') || ''; } catch (_) {} }
    return String(e).toLowerCase().trim();
  }

  // La llave anónima NO es global (vive dentro de un scope en js/config.js), así que se
  // toma del cliente de Supabase ya inicializado, que es lo único garantizado a esta altura.
  function _key() {
    try { if (global.supabaseClient && global.supabaseClient.supabaseKey) return global.supabaseClient.supabaseKey; } catch (_) {}
    try { if (global.SUPABASE_KEY) return global.SUPABASE_KEY; } catch (_) {}
    try { if (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) return SUPABASE_KEY; } catch (_) {}
    return '';
  }

  function _post(payload) {
    var correo = _adminEmail();
    if (!correo) {
      // Sin sesión de admin no se pregunta siquiera. Se devuelve la MISMA forma que
      // supabase-js para que quien llama no truene.
      return Promise.resolve({ data: null, error: { message: 'Sin sesión de administrador' } });
    }
    var k = _key();
    var body = {};
    for (var p in payload) if (Object.prototype.hasOwnProperty.call(payload, p)) body[p] = payload[p];
    body.admin_email = correo;

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': k, 'Authorization': 'Bearer ' + k },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || j.error) return { data: null, error: { message: j.error || ('HTTP ' + r.status) } };
        return { data: j.data || [], error: null };
      });
    }).catch(function (e) {
      return { data: null, error: { message: (e && e.message) || 'red' } };
    });
  }

  global.MaestroMemberships = {
    list: function (select) { return _post({ action: 'list', select: select || '*' }); },
    byEmail: function (email, opts) {
      var o = opts || {};
      return _post({ action: 'by_email', email: email, select: o.select || '*', activa: o.activa, limit: o.limit });
    },
    setActiva: function (email, activa) { return _post({ action: 'set_activa', email: email, activa: !!activa }); },
    upsert: function (fila) { return _post({ action: 'upsert', fila: fila }); }
  };
})(window);
