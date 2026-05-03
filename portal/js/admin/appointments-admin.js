// ============================================
// APPOINTMENTS ADMIN — Citas Programadas
// ============================================
if (typeof _addTranslations === 'function') _addTranslations({
  appt_title: { es: '📅 Citas Programadas', en: '📅 Scheduled Appointments' },
  appt_all: { es: 'Todas', en: 'All' },
  appt_pending: { es: 'Pendientes', en: 'Pending' },
  appt_confirmed: { es: 'Confirmadas', en: 'Confirmed' },
  appt_completed: { es: 'Completadas', en: 'Completed' },
  appt_canceled: { es: 'Canceladas', en: 'Canceled' },
  appt_refresh: { es: 'Actualizar', en: 'Refresh' },
  appt_tab_appts: { es: 'Citas', en: 'Appointments' },
  appt_tab_reps: { es: 'Vendedores', en: 'Sales Reps' },
  appt_loading: { es: 'Cargando citas...', en: 'Loading appointments...' },
  appt_no_appts: { es: 'No hay citas', en: 'No appointments' },
  appt_attends: { es: 'Atiende:', en: 'Attended by:' },
  appt_unassigned: { es: 'Sin asignar', en: 'Unassigned' },
  appt_confirm_btn: { es: 'Confirmar', en: 'Confirm' },
  appt_cancel_btn: { es: 'Cancelar', en: 'Cancel' },
  appt_completed_btn: { es: 'Completada', en: 'Completed' },
  appt_loading_reps: { es: 'Cargando vendedores...', en: 'Loading sales reps...' },
  appt_add_rep: { es: 'Agregar Vendedor', en: 'Add Sales Rep' },
  appt_name: { es: 'Nombre*', en: 'Name*' },
  appt_phone: { es: 'Teléfono', en: 'Phone' },
  appt_name_placeholder: { es: 'Nombre', en: 'Name' },
  appt_add_btn: { es: '+ Agregar', en: '+ Add' },
  appt_no_reps: { es: 'No hay vendedores registrados. Agrega uno arriba.', en: 'No sales reps registered. Add one above.' },
  appt_active: { es: 'Activo', en: 'Active' },
  appt_inactive: { es: 'Inactivo', en: 'Inactive' },
  appt_deactivate: { es: 'Desactivar', en: 'Deactivate' },
  appt_activate: { es: 'Activar', en: 'Activate' },
  appt_delete: { es: 'Eliminar', en: 'Delete' },
  appt_name_required: { es: 'Nombre requerido', en: 'Name is required' },
  appt_confirm_delete_rep: { es: '¿Eliminar al vendedor "', en: 'Delete sales rep "' },
});

(function() {
  'use strict';

  // Local HTML escape helper
  function _esc(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

  var SB_URL = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var ENDPOINT = SB_URL + '/functions/v1/manage-appointments';

  async function apiCall(body) {
    var res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  }

  // ========== LOAD ADMIN PANEL ==========
  window.loadAppointmentsAdmin = async function() {
    var container = document.getElementById('crm-section-citas');
    if (!container) return;

    container.innerHTML =
      '<div style="padding:16px;">' +
        // Header
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">' +
          '<h2 style="color:#e2e8f0;margin:0;font-size:18px;">' + _t('appt_title') + '</h2>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<select id="citasFilterStatus" onchange="filterAppointments()" style="background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 10px;font-size:12px;">' +
              '<option value="todas">' + _t('appt_all') + '</option>' +
              '<option value="pendiente" selected>' + _t('appt_pending') + '</option>' +
              '<option value="confirmada">' + _t('appt_confirmed') + '</option>' +
              '<option value="completada">' + _t('appt_completed') + '</option>' +
              '<option value="cancelada">' + _t('appt_canceled') + '</option>' +
            '</select>' +
            '<button onclick="loadAppointmentsAdmin()" style="background:#2563eb;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;">' + _t('appt_refresh') + '</button>' +
          '</div>' +
        '</div>' +

        // Tabs
        '<div style="display:flex;gap:0;margin-bottom:16px;border-bottom:2px solid #334155;">' +
          '<button id="citasTabCitas" onclick="switchCitasTab(\'citas\')" style="background:#2563eb;color:white;border:none;padding:10px 20px;cursor:pointer;font-size:13px;font-weight:600;border-radius:8px 8px 0 0;">' + _t('appt_tab_appts') + '</button>' +
          '<button id="citasTabReps" onclick="switchCitasTab(\'reps\')" style="background:transparent;color:#94a3b8;border:none;padding:10px 20px;cursor:pointer;font-size:13px;font-weight:600;border-radius:8px 8px 0 0;">' + _t('appt_tab_reps') + '</button>' +
        '</div>' +

        // Content areas
        '<div id="citasContent"></div>' +
        '<div id="repsContent" style="display:none;"></div>' +
      '</div>';

    // Load appointments by default
    filterAppointments();
  };

  // ========== TAB SWITCHING ==========
  window.switchCitasTab = function(tab) {
    var citasBtn = document.getElementById('citasTabCitas');
    var repsBtn = document.getElementById('citasTabReps');
    var citasDiv = document.getElementById('citasContent');
    var repsDiv = document.getElementById('repsContent');
    if (!citasBtn || !repsBtn) return;

    if (tab === 'citas') {
      citasBtn.style.background = '#2563eb'; citasBtn.style.color = 'white';
      repsBtn.style.background = 'transparent'; repsBtn.style.color = '#94a3b8';
      citasDiv.style.display = ''; repsDiv.style.display = 'none';
      filterAppointments();
    } else {
      repsBtn.style.background = '#2563eb'; repsBtn.style.color = 'white';
      citasBtn.style.background = 'transparent'; citasBtn.style.color = '#94a3b8';
      repsDiv.style.display = ''; citasDiv.style.display = 'none';
      loadReps();
    }
  };

  // ========== FILTER & LOAD APPOINTMENTS ==========
  window.filterAppointments = async function() {
    var container = document.getElementById('citasContent');
    if (!container) return;
    container.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:20px;">' + _t('appt_loading') + '</p>';

    var statusFilter = document.getElementById('citasFilterStatus');
    var status = statusFilter ? statusFilter.value : 'pendiente';

    try {
      var data = await apiCall({ action: 'list', status: status, limit: 100 });
      if (!data.ok) throw new Error(data.error);

      if (!data.appointments || data.appointments.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#64748b;"><div style="font-size:40px;margin-bottom:8px;">📅</div><p>' + _t('appt_no_appts') + (status === 'todas' ? '' : ' ' + status + 's') + '</p></div>';
        return;
      }

      var statusColors = {
        pendiente: '#f59e0b',
        confirmada: '#22c55e',
        completada: '#3b82f6',
        cancelada: '#ef4444'
      };

      var html = '<div style="display:flex;flex-direction:column;gap:8px;">';
      data.appointments.forEach(function(a) {
        var date = new Date(a.preferred_date + 'T12:00:00');
        var dateStr = date.toLocaleDateString('es-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        var color = statusColors[a.status] || '#94a3b8';

        html += '<div style="background:#1e293b;border:1px solid #334155;border-left:4px solid ' + color + ';border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">' +
          '<div style="flex:1;min-width:200px;">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
              '<span style="color:#e2e8f0;font-size:14px;font-weight:700;">' + _esc(a.visitor_name) + '</span>' +
              '<span style="background:' + color + '22;color:' + color + ';font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;text-transform:uppercase;">' + _esc(a.status) + '</span>' +
            '</div>' +
            '<div style="color:#94a3b8;font-size:12px;line-height:1.6;">' +
              '📞 ' + _esc(a.visitor_phone) +
              (a.visitor_email ? ' &nbsp;|&nbsp; ✉️ ' + _esc(a.visitor_email) : '') + '<br>' +
              '📅 ' + _esc(dateStr) + ' &nbsp;|&nbsp; 🕐 ' + _esc(a.preferred_time) + '<br>' +
              '👔 ' + _t('appt_attends') + ' <strong style="color:#60a5fa;">' + _esc(a.assigned_rep_name || _t('appt_unassigned')) + '</strong>' +
              (a.notes ? '<br>📝 ' + _esc(a.notes) : '') +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;">';

        if (a.status === 'pendiente') {
          html += '<button onclick="updateAppointmentStatus(\'' + a.id + '\',\'confirmada\')" style="background:#22c55e;color:white;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:11px;">' + _t('appt_confirm_btn') + '</button>';
          html += '<button onclick="updateAppointmentStatus(\'' + a.id + '\',\'cancelada\')" style="background:#ef4444;color:white;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:11px;">' + _t('appt_cancel_btn') + '</button>';
        } else if (a.status === 'confirmada') {
          html += '<button onclick="updateAppointmentStatus(\'' + a.id + '\',\'completada\')" style="background:#3b82f6;color:white;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:11px;">' + _t('appt_completed_btn') + '</button>';
          html += '<button onclick="updateAppointmentStatus(\'' + a.id + '\',\'cancelada\')" style="background:#ef4444;color:white;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:11px;">' + _t('appt_cancel_btn') + '</button>';
        }

        html += '</div></div>';
      });
      html += '</div>';
      container.innerHTML = html;

    } catch(e) {
      container.innerHTML = '<p style="color:#ef4444;text-align:center;padding:20px;">Error: ' + _esc(e.message) + '</p>';
    }
  };

  // ========== UPDATE APPOINTMENT STATUS ==========
  window.updateAppointmentStatus = async function(id, status) {
    try {
      var data = await apiCall({ action: 'update', id: id, status: status });
      if (!data.ok) throw new Error(data.error);
      filterAppointments(); // Refresh
    } catch(e) {
      alert('Error: ' + e.message);
    }
  };

  // ========== LOAD SALES REPS ==========
  async function loadReps() {
    var container = document.getElementById('repsContent');
    if (!container) return;
    container.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:20px;">' + _t('appt_loading_reps') + '</p>';

    try {
      var data = await apiCall({ action: 'list_reps' });
      if (!data.ok) throw new Error(data.error);

      var html =
        // Add rep form
        '<div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;margin-bottom:16px;">' +
          '<h3 style="color:#e2e8f0;margin:0 0 10px;font-size:14px;">' + _t('appt_add_rep') + '</h3>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end;">' +
            '<div><label style="color:#94a3b8;font-size:10px;">' + _t('appt_name') + '</label><input id="repName" placeholder="' + _t('appt_name_placeholder') + '" style="width:100%;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:8px;font-size:12px;box-sizing:border-box;"></div>' +
            '<div><label style="color:#94a3b8;font-size:10px;">' + _t('appt_phone') + '</label><input id="repPhone" placeholder="(714) 555-0000" style="width:100%;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:8px;font-size:12px;box-sizing:border-box;"></div>' +
            '<div><label style="color:#94a3b8;font-size:10px;">Email</label><input id="repEmail" placeholder="email@acvolt.com" style="width:100%;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:8px;font-size:12px;box-sizing:border-box;"></div>' +
            '<button onclick="addSalesRep()" style="background:#22c55e;color:white;border:none;border-radius:6px;padding:8px 14px;cursor:pointer;font-size:12px;font-weight:600;white-space:nowrap;">' + _t('appt_add_btn') + '</button>' +
          '</div>' +
        '</div>';

      if (!data.reps || data.reps.length === 0) {
        html += '<div style="text-align:center;padding:30px;color:#64748b;"><div style="font-size:36px;margin-bottom:8px;">👔</div><p>' + _t('appt_no_reps') + '</p></div>';
      } else {
        html += '<div style="display:flex;flex-direction:column;gap:6px;">';
        data.reps.forEach(function(r) {
          var activeColor = r.active ? '#22c55e' : '#ef4444';
          var activeText = r.active ? _t('appt_active') : _t('appt_inactive');
          html += '<div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
            '<div>' +
              '<span style="color:#e2e8f0;font-size:14px;font-weight:600;">' + _esc(r.name) + '</span>' +
              '<span style="background:' + activeColor + '22;color:' + activeColor + ';font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;margin-left:8px;">' + activeText + '</span>' +
              '<div style="color:#94a3b8;font-size:11px;margin-top:2px;">' +
                (r.phone ? '📞 ' + _esc(r.phone) + ' ' : '') +
                (r.email ? '✉️ ' + _esc(r.email) : '') +
              '</div>' +
            '</div>' +
            '<div style="display:flex;gap:6px;">' +
              '<button onclick="toggleRep(\'' + _esc(r.id) + '\',' + !r.active + ')" style="background:' + (r.active ? '#f59e0b' : '#22c55e') + ';color:white;border:none;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:11px;">' + (r.active ? _t('appt_deactivate') : _t('appt_activate')) + '</button>' +
              '<button onclick="deleteRep(\'' + _esc(r.id) + '\',\'' + _esc(r.name) + '\')" style="background:#ef4444;color:white;border:none;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:11px;">' + _t('appt_delete') + '</button>' +
            '</div>' +
          '</div>';
        });
        html += '</div>';
      }

      container.innerHTML = html;

    } catch(e) {
      container.innerHTML = '<p style="color:#ef4444;text-align:center;padding:20px;">Error: ' + _esc(e.message) + '</p>';
    }
  }

  // ========== ADD SALES REP ==========
  window.addSalesRep = async function() {
    var name = document.getElementById('repName').value.trim();
    var phone = document.getElementById('repPhone').value.trim();
    var email = document.getElementById('repEmail').value.trim();
    if (!name) { alert(_t('appt_name_required')); return; }

    try {
      var data = await apiCall({ action: 'add_rep', name: name, phone: phone, email: email });
      if (!data.ok) throw new Error(data.error);
      loadReps(); // Refresh
    } catch(e) {
      alert('Error: ' + e.message);
    }
  };

  // ========== TOGGLE REP ACTIVE ==========
  window.toggleRep = async function(id, active) {
    try {
      var data = await apiCall({ action: 'toggle_rep', id: id, active: active });
      if (!data.ok) throw new Error(data.error);
      loadReps();
    } catch(e) {
      alert('Error: ' + e.message);
    }
  };

  // ========== DELETE REP ==========
  window.deleteRep = async function(id, name) {
    if (!confirm(_t('appt_confirm_delete_rep') + name + '"?')) return;
    try {
      var data = await apiCall({ action: 'delete_rep', id: id });
      if (!data.ok) throw new Error(data.error);
      loadReps();
    } catch(e) {
      alert('Error: ' + e.message);
    }
  };

})();
