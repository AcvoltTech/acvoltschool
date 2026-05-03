    // showForgotPassword, sendPasswordReset, submitNewPassword, showMagicLinkBox, sendMagicLink
    // moved to js/auth.js (Tier 1) so they're available at login time for all users

    // ============ CREATE USER FUNCTIONS ============
    if (typeof _addTranslations === 'function') _addTranslations({
      cu_fields_required: { es: 'Nombre, email y contrasena son requeridos', en: 'Name, email and password are required' },
      cu_password_min: { es: 'La contrasena debe tener al menos 6 caracteres', en: 'Password must be at least 6 characters' },
      cu_creating: { es: 'Creando usuario...', en: 'Creating user...' },
      cu_created: { es: 'Usuario creado! Correo enviado a', en: 'User created! Email sent to' },
      cu_no_users_session: { es: 'No hay usuarios creados en esta sesion.', en: 'No users created this session.' },
      cu_created_label: { es: 'Creado', en: 'Created' },
      cu_session_reached: { es: '4 horas de sesión alcanzadas — auto check-out', en: '4-hour session reached — auto check-out' },
      cu_minutes_remaining: { es: 'minutos de sesión', en: 'minutes of session' },
    });

    var recentlyCreatedUsers = [];

    function generateRandomPassword() {
      var chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      var password = '';
      for (var i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      document.getElementById('createUserPassword').value = password;
    }

    async function createNewUser() {
      var nombre = document.getElementById('createUserName').value.trim();
      var email = document.getElementById('createUserEmail').value.trim().toLowerCase();
      var telefono = document.getElementById('createUserPhone').value.trim();
      var password = document.getElementById('createUserPassword').value;
      var msgDiv = document.getElementById('createUserMsg');

      if (!nombre || !email || !password) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('cu_fields_required');
        return;
      }

      if (password.length < 6) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = _t('cu_password_min');
        return;
      }

      msgDiv.style.color = '#f39c12';
      msgDiv.textContent = _t('cu_creating');

      try {
        var response = await fetch('https://htklsowiyjwsjnacnvnr.supabase.co/functions/v1/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + SUPABASE_KEY
          },
          body: JSON.stringify({
            email: email,
            password: password,
            nombre: nombre,
            telefono: telefono,
            admin_email: getAdminEmail()
          })
        });

        var result = await response.json();

        if (result.error) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.textContent = 'Error: ' + result.error;
          return;
        }

        msgDiv.style.color = '#27ae60';
        msgDiv.textContent = _t('cu_created') + ' ' + email;

        // Add to recently created list (NEVER store plaintext password in memory)
        recentlyCreatedUsers.unshift({
          nombre: nombre,
          email: email,
          createdAt: new Date().toLocaleTimeString()
        });

        updateRecentCreatedUsers();

        // Clear form
        document.getElementById('createUserName').value = '';
        document.getElementById('createUserEmail').value = '';
        document.getElementById('createUserPhone').value = '';
        document.getElementById('createUserPassword').value = '';

      } catch (err) {
        msgDiv.style.color = '#e74c3c';
        msgDiv.textContent = 'Error: ' + err.message;
      }
    }

    function updateRecentCreatedUsers() {
      var container = document.getElementById('recentCreatedUsers');
      if (recentlyCreatedUsers.length === 0) {
        container.innerHTML = _t('cu_no_users_session');
        return;
      }

      var html = '<div style="display:flex;flex-direction:column;gap:8px;">';
      recentlyCreatedUsers.slice(0, 5).forEach(function(user) {
        html += '<div style="background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:8px;padding:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">';
        html += '<div><strong style="color:#27ae60;">' + _escHtml(user.nombre) + '</strong><br><span style="color:#888;font-size:12px;">' + _escHtml(user.email) + '</span></div>';
        html += '<div style="text-align:right;"><span style="color:#888;font-size:11px;">' + _t('cu_created_label') + '</span><br><span style="color:#666;font-size:11px;">' + user.createdAt + '</span></div>';
        html += '</div>';
      });
      html += '</div>';
      container.innerHTML = html;
    }
    // ============ END CREATE USER FUNCTIONS ============

    // getClassTypeIcon() and selectClassType() moved to class-schedule.js

    function updateTimer() {
      if (!currentCheckInTime) return;
      var now = new Date();
      var diff = Math.floor((now - currentCheckInTime) / 1000);

      // Auto check-out at 4 hours (14400 seconds) during class time
      if (diff >= 14400) {
        console.log('[Attendance] ' + _t('cu_session_reached'));
        doCheckOut();
        return;
      }

      var hrs = Math.floor(diff / 3600);
      var mins = Math.floor((diff % 3600) / 60);
      var secs = diff % 60;
      var timerEl = document.getElementById('attendanceTimer');
      if (timerEl) {
        timerEl.textContent = String(hrs).padStart(2,'0') + ':' + String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
      }

      // Show warning at 3:30 hours (30 min remaining)
      if (diff >= 12600 && diff < 12610) {
        var remainMin = Math.ceil((14400 - diff) / 60);
        addNotification('checkin', '⏰ ' + remainMin + ' ' + _t('cu_minutes_remaining'), '⏰');
      }
    }

