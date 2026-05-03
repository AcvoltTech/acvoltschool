    // ===== NOTIFICATION SYSTEM =====
    const NOTIF_STORAGE_KEY = 'maestroac_notifications';
    const NOTIF_MAX = 50;
    
    function getNotifications() {
      try {
        return JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY) || '[]');
      } catch(e) { return []; }
    }
    
    function saveNotifications(notifs) {
      // Keep only last NOTIF_MAX
      if (notifs.length > NOTIF_MAX) notifs = notifs.slice(-NOTIF_MAX);
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
    }
    
    var _lastAddedNotif = {};
    function addNotification(type, message, icon) {
      // Dedup: skip if identical notification was added in last 10 seconds
      var dedupKey = type + '|' + message;
      var now = Date.now();
      if (_lastAddedNotif[dedupKey] && (now - _lastAddedNotif[dedupKey]) < 10000) return;
      _lastAddedNotif[dedupKey] = now;

      const icons = { checkin: '📋', checkout: '🚪', quiz: '🏆', payment: '💳', register: '👤', level: '⭐', cert: '🏅', clase: '📅', examen: '📝', material: '📚', grabacion: '🎥', grading: '🎓', task: '📤', taxform: '📄', renewal: '🔄' };
      const notif = {
        id: now,
        type: type,
        message: message,
        icon: icon || icons[type] || '🔔',
        time: new Date().toISOString(),
        read: false
      };
      const notifs = getNotifications();
      notifs.push(notif);
      saveNotifications(notifs);
      updateNotifBadge();
      renderNotifications();
    }

    // === PUSH NOTIFICATION HELPERS ===
    const ADMIN_PUSH_EMAIL = 'Techschoolacvolt@gmail.com';

    // Deduplication: prevent identical notifications within a short window
    var _notifSentCache = {};
    var _NOTIF_DEDUP_WINDOW_MS = 30000; // 30 seconds

    async function notifyStudents(title, body, type, recipientEmails) {
      if (!supabaseClient) return;
      try {
        // Dedup: skip if same title+type was sent within the dedup window
        var dedupKey = (type || 'general') + '|' + title;
        var now = Date.now();
        if (_notifSentCache[dedupKey] && (now - _notifSentCache[dedupKey]) < _NOTIF_DEDUP_WINDOW_MS) {
          console.log('[Push] Dedup: skipping duplicate notification "' + title + '"');
          return;
        }
        _notifSentCache[dedupKey] = now;

        // Validate recipientEmails — must be 'all' or a non-empty array of strings
        if (recipientEmails !== 'all') {
          if (!Array.isArray(recipientEmails) || recipientEmails.length === 0) return;
          // Filter to valid email-like strings only
          recipientEmails = recipientEmails.filter(function(e) {
            return typeof e === 'string' && e.indexOf('@') !== -1;
          });
          if (recipientEmails.length === 0) return;
        }

        var payload = { title: title, body: body, type: type || 'general', admin_email: typeof getAdminEmail === 'function' ? getAdminEmail() : '' };
        if (recipientEmails === 'all') {
          // Let the edge function query all active subscriptions server-side
          payload.send_to_all = true;
          payload.recipient_emails = ['__all__'];
        } else {
          payload.recipient_emails = recipientEmails;
        }
        if (!payload.recipient_emails || payload.recipient_emails.length === 0) return;
        console.log('[Push] Sending push notification:', payload.send_to_all ? 'ALL' : payload.recipient_emails.length + ' recipients');
        supabaseClient.functions.invoke('send-push-notification', {
          body: payload
        }).then(function(res) {
          if (res.error) console.error('[Push] Edge function error:', res.error);
          else console.log('[Push] Result:', res.data);
        }).catch(function(e) { console.error('[Push] notifyStudents error:', e); });
      } catch(e) { console.warn('[Push] notifyStudents error:', e); }
    }

    async function notifyAdmin(title, body, type) {
      if (!supabaseClient) return;
      try {
        supabaseClient.functions.invoke('send-push-notification', {
          body: { recipient_emails: [ADMIN_PUSH_EMAIL], title: title, body: body, type: type || 'admin_alert', admin_email: getAdminEmail() }
        }).catch(function(e) { console.warn('[Push] notifyAdmin error:', e); });
      } catch(e) { console.warn('[Push] notifyAdmin error:', e); }
    }

    // === BROADCAST PUSH MODAL (admin only) ===
    function showBroadcastPushModal() {
      if (document.getElementById('broadcastPushModal')) return;
      var modal = document.createElement('div');
      modal.id = 'broadcastPushModal';
      modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.innerHTML =
        '<div style="background:#FFFFFF;border-radius:16px;max-width:480px;width:100%;padding:24px;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
            '<h3 style="margin:0;color:#0F0F0F;font-size:18px;">' + (typeof _t === 'function' ? _t('bcast_title') : 'Enviar Push a Todos') + '</h3>' +
            '<button onclick="document.getElementById(\'broadcastPushModal\').remove()" style="background:none;border:none;color:#6B6B66;font-size:22px;cursor:pointer;">✕</button>' +
          '</div>' +
          '<div style="margin-bottom:12px;">' +
            '<label style="color:#6B6B66;font-weight:500;font-size:12px;display:block;margin-bottom:4px;">Titulo</label>' +
            '<input id="bcastTitle" type="text" placeholder="Ej: Nueva clase disponible" maxlength="100" style="width:100%;box-sizing:border-box;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:8px;padding:10px 12px;font-size:14px;">' +
          '</div>' +
          '<div style="margin-bottom:12px;">' +
            '<label style="color:#6B6B66;font-weight:500;font-size:12px;display:block;margin-bottom:4px;">Mensaje</label>' +
            '<textarea id="bcastBody" rows="3" placeholder="Ej: Entra a ver la clase de hoy..." maxlength="300" style="width:100%;box-sizing:border-box;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:8px;padding:10px 12px;font-size:14px;resize:vertical;"></textarea>' +
          '</div>' +
          '<div style="margin-bottom:16px;">' +
            '<label style="color:#6B6B66;font-weight:500;font-size:12px;display:block;margin-bottom:4px;">URL destino (opcional)</label>' +
            '<input id="bcastUrl" type="text" placeholder="Ej: ./live-streaming" style="width:100%;box-sizing:border-box;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:8px;padding:10px 12px;font-size:14px;">' +
          '</div>' +
          '<div id="bcastResult" style="display:none;margin-bottom:12px;padding:10px;border-radius:8px;font-size:13px;"></div>' +
          '<button id="bcastSendBtn" onclick="sendBroadcastPush()" style="width:100%;background:#3b82f6;color:#fff;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:600;cursor:pointer;">' + (typeof _t === 'function' ? _t('bcast_send_btn') : 'Enviar a Todos los Usuarios') + '</button>' +
        '</div>';
      document.body.appendChild(modal);
      modal.querySelector('input').focus();
    }

    async function sendBroadcastPush() {
      var title = (document.getElementById('bcastTitle') || {}).value || '';
      var body = (document.getElementById('bcastBody') || {}).value || '';
      var url = (document.getElementById('bcastUrl') || {}).value || '';
      if (!title.trim() || !body.trim()) { window.showToast(typeof _t === 'function' ? _t('bcast_title_required') : 'Titulo y mensaje son requeridos', 'warning'); return; }

      var btn = document.getElementById('bcastSendBtn');
      var result = document.getElementById('bcastResult');
      if (btn) { btn.disabled = true; btn.textContent = (typeof _t === 'function' ? _t('bcast_sending') : 'Enviando...'); }

      try {
        // Send to all active push subscribers (server-side query)
        var payload = {
          send_to_all: true,
          recipient_emails: ['__all__'],
          title: title,
          body: body,
          type: 'general',
          admin_email: typeof getAdminEmail === 'function' ? getAdminEmail() : ''
        };
        if (url) payload.url = url;

        var resp = await supabaseClient.functions.invoke('send-push-notification', { body: payload });
        var data = resp.data || {};

        if (result) {
          result.style.display = '';
          result.style.background = 'rgba(34,197,94,0.15)';
          result.style.color = '#22c55e';
          result.textContent = (typeof _t === 'function' ? _t('notif_sent_to') : 'Enviado a') + ' ' + (data.sent || 0) + ' ' + (typeof _t === 'function' ? _t('notif_devices') : 'dispositivos') + '. ' + (typeof _t === 'function' ? _t('notif_failed') : 'Fallidos') + ': ' + (data.failed || 0);
        }
      } catch(e) {
        if (result) { result.style.display = ''; result.style.background = 'rgba(239,68,68,0.15)'; result.style.color = '#ef4444'; result.textContent = 'Error: ' + e.message; }
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = (typeof _t === 'function' ? _t('bcast_send_btn') : 'Enviar a Todos los Usuarios'); }
      }
    }

    function checkNewContent(storageKey, items, labelFn) {
      if (!items || items.length === 0) return;
      var lastChecked = localStorage.getItem('lastChecked_' + storageKey);
      if (!lastChecked) {
        // First visit — set baseline, no spam
        localStorage.setItem('lastChecked_' + storageKey, new Date().toISOString());
        return;
      }
      var lastDate = new Date(lastChecked);
      var newItems = items.filter(function(item) {
        var ts = item.created_at || item.published_at || item.added || item.fecha;
        return ts && new Date(ts) > lastDate;
      });
      if (newItems.length === 0) return;
      // Show max 3 notifications
      var toShow = newItems.slice(0, 3);
      toShow.forEach(function(item) {
        var label = labelFn(item);
        addNotification(label.type, label.message, label.icon);
      });
      if (newItems.length > 3) {
        addNotification('general', (typeof _t === 'function' ? _t('notif_and_more') : '...y {count} más nuevos').replace('{count}', newItems.length - 3), '🔔');
      }
      localStorage.setItem('lastChecked_' + storageKey, new Date().toISOString());
    }

    function updateNotifBadge() {
      const notifs = getNotifications();
      const unread = notifs.filter(n => !n.read).length;
      const badge = document.getElementById('notifBadge');
      if (!badge) return;
      if (unread > 0) {
        badge.textContent = unread > 9 ? '9+' : unread;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
    
    function toggleNotifPanel(e) {
      if (e) e.stopPropagation();
      try { if (window.Haptics && typeof window.Haptics.light === 'function') window.Haptics.light(); } catch(_) {}
      const panel = document.getElementById('notifPanel');
      const isOpen = panel.classList.contains('open');
      if (isOpen) {
        panel.classList.remove('open');
      } else {
        panel.classList.add('open');
        // Mark all as read
        const notifs = getNotifications();
        notifs.forEach(n => n.read = true);
        saveNotifications(notifs);
        updateNotifBadge();
        renderNotifications();
      }
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
      const panel = document.getElementById('notifPanel');
      const bellContainer = document.getElementById('notifBellContainer');
      if (panel && panel.classList.contains('open') && !panel.contains(e.target) && bellContainer && !bellContainer.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
    
    function renderNotifications() {
      const list = document.getElementById('notifList');
      if (!list) return;
      const notifs = getNotifications();
      
      if (notifs.length === 0) {
        list.innerHTML = '<div class="notif-empty mx-empty">' +
          '<div class="notif-empty-icon mx-empty-icon">🔕</div>' +
          '<div class="mx-empty-title">' + (typeof _t === 'function' ? _t('notif_no_notifications_title', 'Sin notificaciones') : 'Sin notificaciones') + '</div>' +
          '<div class="mx-empty-desc">' + (typeof _t === 'function' ? _t('notif_no_notifications_desc', 'Te avisaremos cuando haya algo nuevo.') : 'Te avisaremos cuando haya algo nuevo.') + '</div>' +
          '</div>';
        return;
      }
      
      // Show newest first
      const sorted = [...notifs].reverse();
      list.innerHTML = sorted.map(n => {
        const typeClass = _escHtml(n.type === 'checkin' || n.type === 'checkout' ? 'checkin' :
                          n.type === 'quiz' || n.type === 'level' || n.type === 'cert' ? 'quiz' :
                          n.type === 'payment' ? 'payment' : 'register');
        const timeAgo = _escHtml(getTimeAgo(n.time));
        return `
          <div class="notif-item ${n.read ? '' : 'unread'}">
            <div class="notif-icon ${typeClass}">${_escHtml(n.icon)}</div>
            <div class="notif-content">
              <div class="notif-text">${_escHtml(n.message)}</div>
              <div class="notif-time">${timeAgo}</div>
            </div>
          </div>
        `;
      }).join('');
    }
    
    function getTimeAgo(isoTime) {
      const now = new Date();
      const then = new Date(isoTime);
      const diff = Math.floor((now - then) / 1000);
      if (diff < 60) return (typeof _t === 'function' ? _t('notif_now') : 'Ahora mismo');
      if (diff < 3600) return Math.floor(diff / 60) + ' min';
      if (diff < 86400) return Math.floor(diff / 3600) + 'h';
      if (diff < 604800) return Math.floor(diff / 86400) + 'd';
      return then.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    }
    
    function clearNotifications() {
      localStorage.removeItem(NOTIF_STORAGE_KEY);
      updateNotifBadge();
      renderNotifications();
    }
    
    // Show bell after user is logged in
    function showNotifBell() {
      const bell = document.getElementById('notifBellContainer');
      if (bell) bell.style.display = 'block';
      updateNotifBadge();
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
      updateNotifBadge();
      renderNotifications();
      
      // Check if user was in the app before (show "back to app" button on welcome/login screens)
      const lastScreen = localStorage.getItem('maestroac_last_screen');
      const savedUser = localStorage.getItem('tecnico_user') || localStorage.getItem('tecnico_user_backup');
      if (lastScreen && savedUser && lastScreen !== 'loginScreen' && lastScreen !== 'registerScreen' && lastScreen !== 'welcomeScreen') {
        const backBtn = document.getElementById('backToAppBtn');
        if (backBtn) backBtn.style.display = 'block';
      }
    });
    
    function returnToApp() {
      const lastScreen = localStorage.getItem('maestroac_last_screen');
      const backBtn = document.getElementById('backToAppBtn');
      if (backBtn) backBtn.style.display = 'none';
      
      // Load user data first
      let savedUser = localStorage.getItem('tecnico_user') || localStorage.getItem('tecnico_user_backup');
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
          document.getElementById('userGreeting').textContent = (typeof _t === 'function' ? _t('hi_greeting') : 'Hola') + ', ' + (currentUser.nombre || (typeof _t === 'function' ? _t('student') : 'Estudiante')).split(' ')[0];
          showNotifBell();
        } catch(e) {}
      }

      // Navigate to last screen or levels
      const safeScreens = ['levelsScreen', 'studySectionsScreen', 'videoLessonsScreen', 'certificatesScreen', 'attendanceScreen', 'dashboardScreen', 'welcomeScreen', 'studentCalendarScreen', 'referidosScreen'];
      const target = safeScreens.includes(lastScreen) ? lastScreen : 'dashboardScreen';
      
      // If going to protected screen, need check-in first
      showScreen(target);
    }

    // ============================================
    // BATCH EMAIL SYSTEM - Envío Masivo de Códigos
    // ============================================
    let batchStudents = [];
    let batchSelectedStudents = new Set();
    let batchGeneratedCodes = [];

    // Load all students for batch selection
    async function loadStudentsForBatch() {
      const container = document.getElementById('batchStudentList');
      container.innerHTML = '<div style="color: #9b59b6; text-align: center; padding: 20px;">' + (typeof _t === 'function' ? _t('notif_loading_students') : '⏳ Cargando estudiantes...') + '</div>';
      
      try {
        // First try to load from Supabase
        if (supabaseClient && isOnline) {
          const _ud_users = await usersDataAdmin('admin_list', { fields: ['id','nombre','email','telefono','fecha_registro','nivel_actual'], order_by: 'fecha_registro', ascending: false, limit: 5000 });
          const users = _ud_users.data; const error = _ud_users.error;
          
          if (!error && users && users.length > 0) {
            batchStudents = users.map(u => ({
              id: u.id,
              nombre: u.nombre || 'Sin nombre',
              email: u.email || '',
              telefono: u.telefono || '',
              fecha: u.fecha_registro,
              nivel: u.nivel_actual || 'principiante'
            }));
          }
        }
        
        // (Removed: duplicate query to same users table -- was leftover from old technicians table)
        
        // Also get from allTechnicians array (localStorage)
        if (typeof allTechnicians !== 'undefined' && allTechnicians.length > 0) {
          const existingEmails = batchStudents.map(s => s.email);
          allTechnicians.forEach(t => {
            if (t.email && !existingEmails.includes(t.email)) {
              batchStudents.push({
                id: t.supabaseId || t.email,
                nombre: t.nombre || 'Sin nombre',
                email: t.email,
                telefono: t.telefono || '',
                fecha: t.registrationDate,
                nivel: t.nivel_actual || 'local'
              });
            }
          });
        }
        
        // Render the list
        renderBatchStudentList();
        
      } catch(e) {
        console.error('Error loading students for batch:', e);
        container.innerHTML = '<div style="color: #e74c3c; text-align: center; padding: 20px;">' + (typeof _t === 'function' ? _t('notif_error_loading') : '❌ Error cargando estudiantes') + ': ' + _escHtml(e.message) + '</div>';
      }
    }

    // Render the student list with checkboxes
    function renderBatchStudentList(filter = '') {
      const container = document.getElementById('batchStudentList');
      
      let filtered = batchStudents;
      if (filter) {
        const f = filter.toLowerCase();
        filtered = batchStudents.filter(s => 
          (s.nombre && s.nombre.toLowerCase().includes(f)) || 
          (s.email && s.email.toLowerCase().includes(f)) ||
          (s.telefono && s.telefono.includes(f))
        );
      }
      
      if (filtered.length === 0) {
        container.innerHTML = '<div class="mx-empty">' +
          '<div class="mx-empty-icon">📭</div>' +
          '<div class="mx-empty-title">' + _t('notif_no_students', 'No se encontraron estudiantes') + '</div>' +
          (filter ? '<div class="mx-empty-desc">' + _t('notif_with_filter', 'con ese filtro') + '</div>' : '') +
          '</div>';
        return;
      }
      
      let html = '<div style="color: #9b59b6; font-size: 0.85em; margin-bottom: 10px; padding: 5px 10px; background: rgba(155,89,182,0.2); border-radius: 6px;">' +
        '👥 Total: <strong>' + batchStudents.length + '</strong> ' + _t('notif_students', 'estudiantes') +
        (filter ? ' | Mostrando: <strong>' + filtered.length + '</strong>' : '') +
        '</div>';
      
      filtered.forEach((student, idx) => {
        const isSelected = batchSelectedStudents.has(student.email || student.id);
        const bgColor = isSelected ? 'rgba(155,89,182,0.3)' : 'rgba(255,255,255,0.05)';
        const borderColor = isSelected ? '#9b59b6' : 'transparent';
        
        html += `
          <div onclick="toggleBatchStudent('${_escHtml(student.email || student.id)}')"
               style="display: flex; align-items: center; gap: 12px; padding: 12px; margin: 6px 0; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
            <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); toggleBatchStudent('${_escHtml(student.email || student.id)}')"
                   style="width: 20px; height: 20px; accent-color: #9b59b6; cursor: pointer;">
            <div style="flex: 1; min-width: 0;">
              <div style="color: #fff; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${_escHtml(student.nombre)}</div>
              <div style="color: #aaa; font-size: 0.85em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">📧 ${_escHtml(student.email || 'Sin email')}</div>
              ${student.telefono ? `<div style="color: #888; font-size: 0.8em;">📱 ${_escHtml(student.telefono)}</div>` : ''}
            </div>
            <div style="text-align: right; font-size: 0.75em; color: #666;">
              ${student.fecha ? new Date(student.fecha).toLocaleDateString('es-MX', {month: 'short', day: 'numeric'}) : ''}
            </div>
          </div>
        `;
      });
      
      container.innerHTML = html;
      updateBatchSelectedCount();
    }

    // Toggle student selection
    function toggleBatchStudent(identifier) {
      if (batchSelectedStudents.has(identifier)) {
        batchSelectedStudents.delete(identifier);
      } else {
        batchSelectedStudents.add(identifier);
      }
      renderBatchStudentList(document.getElementById('batchSearchStudent')?.value || '');
    }

    // Filter students by search
    function filterBatchStudents() {
      const filter = document.getElementById('batchSearchStudent')?.value || '';
      renderBatchStudentList(filter);
    }

    // Select N students
    function selectBatchStudents(count) {
      batchSelectedStudents.clear();
      const toSelect = batchStudents.slice(0, count);
      toSelect.forEach(s => {
        if (s.email) batchSelectedStudents.add(s.email);
        else if (s.id) batchSelectedStudents.add(s.id);
      });
      renderBatchStudentList(document.getElementById('batchSearchStudent')?.value || '');
    }

    // Select all students
    function selectAllBatchStudents() {
      batchStudents.forEach(s => {
        if (s.email) batchSelectedStudents.add(s.email);
        else if (s.id) batchSelectedStudents.add(s.id);
      });
      renderBatchStudentList(document.getElementById('batchSearchStudent')?.value || '');
    }

    // Deselect all students
    function deselectAllBatchStudents() {
      batchSelectedStudents.clear();
      renderBatchStudentList(document.getElementById('batchSearchStudent')?.value || '');
    }

    // Update selected count display
    function updateBatchSelectedCount() {
      const countEl = document.getElementById('batchSelectedCount');
      if (countEl) {
        const count = batchSelectedStudents.size;
        countEl.textContent = count + ' ' + (typeof _t === 'function' ? (count !== 1 ? _t('gc_selected_plural') : _t('gc_selected')) : (count !== 1 ? 'seleccionados' : 'seleccionado'));
        countEl.style.color = count > 0 ? '#2ecc71' : '#9b59b6';
      }
    }

    // Generate codes for all selected students
    async function generateBatchCodes() {
      if (batchSelectedStudents.size === 0) {
        window.showToast(_t('notif_select_student', 'Selecciona al menos un estudiante'), 'warning');
        return;
      }
      
      const level = document.getElementById('batchCodeLevel')?.value || 'clases_vivo';
      const duration = document.getElementById('batchCodeDuration')?.value || '30';
      
      batchGeneratedCodes = [];
      const prefix = level === 'full_app' ? 'FULL' : (level === 'clases_vivo' ? 'ZOOM' : level.substring(0, 4).toUpperCase());
      
      // Get selected student details
      const selectedStudents = batchStudents.filter(s => 
        batchSelectedStudents.has(s.email) || batchSelectedStudents.has(s.id)
      );
      
      for (const student of selectedStudents) {
        const code = prefix + '-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).toUpperCase().slice(-4);
        
        // Calculate expiration
        let expiresAt = null;
        if (duration !== 'lifetime') {
          const d = new Date();
          d.setDate(d.getDate() + parseInt(duration));
          expiresAt = d.toISOString();
        }
        
        batchGeneratedCodes.push({
          nombre: student.nombre,
          email: student.email,
          telefono: student.telefono,
          code: code,
          level: level,
          duration: duration,
          expiresAt: expiresAt
        });
        
        // Save to Supabase
        try {
          if (supabaseClient && isOnline) {
            await supabaseClient.from('access_code_requests').insert([{
              student_name: student.nombre,
              student_email: student.email || null,
              student_phone: student.telefono || '',
              access_level: level,
              duration_days: duration === 'lifetime' ? 'lifetime' : duration,
              code: code,
              status: 'approved',
              requested_at: new Date().toISOString(),
              approved_at: new Date().toISOString()
            }]);
          }
        } catch(e) {
          console.log('Error saving code to Supabase:', e);
        }
      }
      
      // Display results
      displayBatchCodesResult();
      
      // Refresh active codes
      if (typeof loadActiveCodes === 'function') loadActiveCodes();
    }

    // Display generated codes
    function displayBatchCodesResult() {
      const container = document.getElementById('batchCodesResult');
      const content = document.getElementById('batchCodesContent');
      
      if (!container || !content) return;
      
      let html = '<table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">' +
        '<tr style="background: rgba(46,204,113,0.2);">' +
        '<th style="padding: 8px; text-align: left; border-bottom: 1px solid #2ecc71;">' + _t('notif_name_label', 'Nombre') + '</th>' +
        '<th style="padding: 8px; text-align: left; border-bottom: 1px solid #2ecc71;">Email</th>' +
        '<th style="padding: 8px; text-align: left; border-bottom: 1px solid #2ecc71;">' + _t('notif_code_label', 'Código') + '</th>' +
        '</tr>';
      
      batchGeneratedCodes.forEach(item => {
        html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
          <td style="padding: 8px; color: #fff;">${item.nombre}</td>
          <td style="padding: 8px; color: #aaa;">${item.email || '-'}</td>
          <td style="padding: 8px; color: #2ecc71; font-family: monospace; font-weight: bold;">${item.code}</td>
        </tr>`;
      });
      
      html += '</table>';
      html += '<div style="margin-top: 10px; padding: 10px; background: rgba(243,156,18,0.15); border-radius: 6px; color: #f39c12; font-size: 0.85em;">' +
        '✅ ' + _t('notif_codes_generated', 'Se generaron') + ' <strong>' + batchGeneratedCodes.length + '</strong> ' + _t('notif_codes_success', 'códigos exitosamente') + '</div>';
      
      content.innerHTML = html;
      container.style.display = 'block';
    }

    // Copy all codes to clipboard
    function copyAllBatchCodes() {
      let text = _t('notif_codes_header', 'CÓDIGOS DE ACCESO GENERADOS') + '\n';
      text += '===========================\n\n';

      batchGeneratedCodes.forEach(item => {
        text += _t('notif_name_label', 'Nombre') + ': ' + item.nombre + '\n';
        text += 'Email: ' + (item.email || 'N/A') + '\n';
        text += _t('notif_code_label', 'Código') + ': ' + item.code + '\n';
        text += _t('notif_level_label', 'Nivel') + ': ' + item.level + '\n';
        text += _t('notif_duration_label', 'Duración') + ': ' + item.duration + ' ' + _t('notif_days', 'días') + '\n';
        text += '----------------------------\n';
      });
      
      navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) { window.showToast('✅ ' + batchGeneratedCodes.length + ' ' + _t('notif_codes_copied', 'códigos copiados al portapapeles'), 'success'); } else { window.MaestroDialog.alert({title: '', message: '✅ ' + batchGeneratedCodes.length + ' ' + _t('notif_codes_copied', 'códigos copiados al portapapeles'), kind: 'success'}); }
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (window.showToast) { window.showToast('✅ ' + batchGeneratedCodes.length + ' ' + _t('notif_codes_copied', 'códigos copiados al portapapeles'), 'success'); } else { window.MaestroDialog.alert({title: '', message: '✅ ' + batchGeneratedCodes.length + ' ' + _t('notif_codes_copied', 'códigos copiados al portapapeles'), kind: 'success'}); }
      });
    }

    // Export to CSV
    function exportBatchToCSV() {
      let csv = _t('notif_csv_header', 'Nombre,Email,Teléfono,Código,Nivel,Duración,Expira') + '\n';
      
      batchGeneratedCodes.forEach(item => {
        csv += '"' + item.nombre + '","' + (item.email || '') + '","' + (item.telefono || '') + '","' + item.code + '","' + item.level + '","' + item.duration + ' ' + _t('notif_days', 'días') + '","' + (item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : _t('notif_never', 'Nunca')) + '"\n';
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codigos_acceso_' + new Date().toISOString().slice(0,10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Open email client with all recipients
    function openBatchEmailClient() {
      const emails = batchGeneratedCodes.filter(c => c.email).map(c => c.email);
      
      if (emails.length === 0) {
        window.showToast(_t('notif_no_email', 'Ningún estudiante seleccionado tiene email'), 'warning');
        return;
      }
      
      // Build email body
      let body = _t('notif_email_greeting', 'Hola,') + '\n\n' + _t('notif_email_intro', 'Aquí está tu código de acceso para las clases de ACVOLT Tech School:') + '\n\n';
      body += '🔑 ' + _t('notif_email_code_attached', 'Tu código personal está adjunto en este correo.') + '\n\n';
      body += _t('notif_email_howto', 'Para usarlo:') + '\n';
      body += '1. ' + _t('notif_email_step1', 'Abre la app Maestro HVACR en maestrohvacr.com') + '\n';
      body += '2. ' + _t('notif_email_step2', 'Ve a la sección de Clases en Vivo') + '\n';
      body += '3. ' + _t('notif_email_step3', 'Ingresa tu código cuando se solicite') + '\n\n';
      body += _t('notif_email_bye', '¡Nos vemos en clase!') + '\n';
      body += 'Maestro Mario - Nivel 33\n';
      body += 'ACVOLT Tech School';
      
      // Use BCC for batch emails (privacy)
      const bccEmails = emails.join(',');
      const subject = encodeURIComponent('🔑 Tu Código de Acceso - ACVOLT Tech School');
      const bodyEncoded = encodeURIComponent(body);
      
      // Open mail client
      // Open in-app email modal for batch emails
      openEmailComposer(bccEmails, decodeURIComponent(subject), decodeURIComponent(bodyEncoded), '📧 ' + _t('notif_batch_email', 'Email Masivo') + ' (' + emails.length + ' ' + _t('notif_students', 'estudiantes') + ')');
      
      // Also show a message with individual codes
      let codesMessage = '📧 ' + _t('notif_email_opened', 'Email abierto con') + ' ' + emails.length + ' ' + _t('notif_recipients', 'destinatarios') + '\n\n';
      codesMessage += _t('notif_individual_codes', 'CÓDIGOS INDIVIDUALES PARA COPIAR:') + '\n\n';
      batchGeneratedCodes.forEach(c => {
        if (c.email) {
          codesMessage += c.nombre + ': ' + c.code + '\n';
        }
      });
      
      window.MaestroDialog.alert({title: '', message: codesMessage, kind: 'info'});
    }
    // ============================================
    // END BATCH EMAIL SYSTEM
    // ============================================

    // Service Worker controllerchange + install prompt handled in index.html and push-notifications.js
    // Do not duplicate here to avoid double-reload and lost install prompts
