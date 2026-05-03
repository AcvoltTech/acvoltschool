    // ===== CLASS SCHEDULE & ATTENDANCE =====
    if (typeof _addTranslations === 'function') _addTranslations({
      cs_presencial: { es: '🏛️ Presencial', en: '🏛️ In-Person' },
      cs_zoom: { es: '💻 Zoom', en: '💻 Zoom' },
      cs_computer: { es: '🖥️ Computadora', en: '🖥️ Computer' },
      cs_mobile: { es: '📱 Móvil', en: '📱 Mobile' },
      cs_class: { es: 'Clase', en: 'Class' },
      cs_sunday: { es: 'Domingo', en: 'Sunday' },
      cs_monday: { es: 'Lunes', en: 'Monday' },
      cs_tuesday: { es: 'Martes', en: 'Tuesday' },
      cs_wednesday: { es: 'Miércoles', en: 'Wednesday' },
      cs_thursday: { es: 'Jueves', en: 'Thursday' },
      cs_friday: { es: 'Viernes', en: 'Friday' },
      cs_saturday: { es: 'Sábado', en: 'Saturday' },
      cs_now_in_class: { es: '(ahora en clase)', en: '(now in class)' },
      cs_supabase_err: { es: 'Error: Supabase no conectado', en: 'Error: Supabase not connected' },
      cs_login_first: { es: 'Debes iniciar sesion primero', en: 'You must log in first' },
      cs_checkin_registered: { es: '✅ Check-in registrado —', en: '✅ Check-in registered —' },
      cs_in_class: { es: '🟢 En Clase -', en: '🟢 In Class -' },
      cs_checkin_error: { es: 'Error al hacer check-in:', en: 'Error during check-in:' },
      cs_no_checkin: { es: '⭕ Sin Check-in', en: '⭕ No Check-in' },
      cs_checkout_completed: { es: '🚪 Check-out completado — Tiempo:', en: '🚪 Check-out completed — Time:' },
      cs_checkout_success: { es: '✅ Check-out exitoso!\nTiempo registrado:', en: '✅ Check-out successful!\nTime recorded:' },
      cs_checkout_error: { es: 'Error al hacer check-out:', en: 'Error during check-out:' },
      cs_session_auto_closed: { es: '⏰ Sesión anterior cerrada automáticamente', en: '⏰ Previous session auto-closed' },
      cs_sessions: { es: 'sesiones', en: 'sessions' },
      cs_no_records: { es: 'Sin registros', en: 'No records' },
      cs_in_class_label: { es: 'En clase', en: 'In class' },
      cs_minutes_remaining: { es: 'minutos de sesión', en: 'minutes of session' },
    });

    // Global attendance state
    var selectedClassType = 'presencial';

    // selectClassType moved from create-user.js — used by student attendance screen
    function selectClassType(type) {
      selectedClassType = type;
      var el;
      el = document.getElementById('typePresencial'); if (el) el.classList.toggle('selected', type === 'presencial');
      el = document.getElementById('typeZoom'); if (el) el.classList.toggle('selected', type === 'zoom');
      el = document.getElementById('typeComputadora'); if (el) el.classList.toggle('selected', type === 'computadora');
      el = document.getElementById('typeMovil'); if (el) el.classList.toggle('selected', type === 'movil');
    }

    function getClassTypeIcon(type) {
      var icons = { presencial: '🏫', zoom: '📹', computadora: '🖥️', movil: '📱' };
      return icons[type] || '📋';
    }

    // Classes: Tuesday & Wednesday 6:00 PM - 10:00 PM Pacific Time (California)
    function isClassTime() {
      // Get current time in California (America/Los_Angeles)
      var now = new Date();
      var caTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      var day = caTime.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
      var hour = caTime.getHours();
      var minutes = caTime.getMinutes();
      var totalMinutes = hour * 60 + minutes;

      // WEEKDAYS: Mon-Fri (1-5), 6:00 PM (1080) to 10:00 PM (1320)
      var isWeekdayClass = (day >= 1 && day <= 5) && (totalMinutes >= 1080 && totalMinutes <= 1320);

      // WEEKENDS: Sat-Sun (0,6), 7:00 AM (420) to 11:00 AM (660)
      var isWeekendClass = (day === 0 || day === 6) && (totalMinutes >= 420 && totalMinutes <= 660);

      return { allowed: isWeekdayClass || isWeekendClass, day: day, hour: hour, minutes: minutes, caTime: caTime };
    }

    function getClassTypeLabel(type) {
      var labels = { presencial: _t('cs_presencial'), zoom: _t('cs_zoom'), computadora: _t('cs_computer'), movil: _t('cs_mobile') };
      return labels[type] || type || _t('cs_class');
    }

    function getNextClassInfo() {
      var now = new Date();
      var caTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      var day = caTime.getDay();
      var hour = caTime.getHours();
      var days = [_t('cs_sunday'),_t('cs_monday'),_t('cs_tuesday'),_t('cs_wednesday'),_t('cs_thursday'),_t('cs_friday'),_t('cs_saturday')];

      var schedule = isClassTime();
      if (schedule.allowed) return days[day] + ' ' + _t('cs_now_in_class');

      // Weekdays check (Mon-Fri 6-10PM)
      if (day >= 1 && day <= 5 && hour < 18) return days[day] + ' 6:00 PM';
      // Weekend check (Sat-Sun 7-11AM)
      if ((day === 6 || day === 0) && hour < 7) return days[day] + ' 7:00 AM';

      // Find next class day
      if (day === 5 && hour >= 22) return _t('cs_saturday') + ' 7:00 AM';
      if (day === 6 && hour >= 11) return _t('cs_sunday') + ' 7:00 AM';
      if (day === 0 && hour >= 11) return _t('cs_monday') + ' 6:00 PM';

      // Default: next weekday
      var nextDayIdx = day + 1;
      if (nextDayIdx > 6) nextDayIdx = 1;
      return days[nextDayIdx] + (nextDayIdx >= 1 && nextDayIdx <= 5 ? ' 6:00 PM' : ' 7:00 AM');
    }

    // Auto check-out max time removed — unlimited sessions

    async function doCheckIn() {
      try {
        if (!supabaseClient) { alert(_t('cs_supabase_err')); return; }

        var userResp = await supabaseClient.auth.getUser();
        var user = userResp.data.user;
        if (!user) { alert(_t('cs_login_first')); return; }

        // No daily limit — students can check in multiple times
        // Each session auto-checks-out at 4 hours max

        var res = await supabaseClient
          .from('attendance')
          .insert({ student_id: user.id, class_type: selectedClassType, check_in: new Date().toISOString(), status: 'presente' })
          .select().single();
        if (res.error) throw res.error;
        var data = res.data;
        currentAttendanceId = data.id;
        currentCheckInTime = new Date(data.check_in);
        sessionCheckedIn = true;
        lastActivityTime = Date.now(); // Track activity
        addNotification('checkin', _t('cs_checkin_registered') + ' ' + getClassTypeLabel(selectedClassType), '📋');
        var ciBtn1 = document.getElementById('btnCheckIn');
        var ciBtn2 = document.getElementById('btnCheckOut');
        var ciBadge = document.getElementById('attendanceStatusBadge');
        if (ciBtn1) ciBtn1.style.display = 'none';
        if (ciBtn2) ciBtn2.style.display = 'block';
        if (ciBadge) { ciBadge.className = 'attendance-status status-active'; ciBadge.textContent = _t('cs_in_class') + ' ' + getClassTypeLabel(selectedClassType); }
        document.querySelectorAll('.type-option').forEach(function(el) { el.style.pointerEvents = 'none'; });
        attendanceTimerInterval = setInterval(updateTimer, 1000);
        updateTimer();

        // Inactivity monitor removed — check-in obligatorio ya no se usa

      } catch (err) {
        console.error('Error en check-in:', err);
        alert(_t('cs_checkin_error') + ' ' + err.message);
      }
    }

    async function doCheckOut() {
      try {
        if (!currentAttendanceId) return;
        clearInterval(attendanceTimerInterval);
        attendanceTimerInterval = null;
        var checkOutTime = new Date();
        var totalMinutes = Math.round((checkOutTime - currentCheckInTime) / 60000);
        totalMinutes = Math.min(totalMinutes, 240); // Cap session at 4 hours
        var res = await supabaseClient
          .from('attendance')
          .update({ check_out: checkOutTime.toISOString(), total_minutes: totalMinutes })
          .eq('id', currentAttendanceId);
        if (res.error) throw res.error;
        var el1 = document.getElementById('btnCheckIn');
        var el2 = document.getElementById('btnCheckOut');
        var el3 = document.getElementById('attendanceStatusBadge');
        var el4 = document.getElementById('attendanceTimer');
        if (el1) el1.style.display = 'block';
        if (el2) el2.style.display = 'none';
        if (el3) { el3.className = 'attendance-status status-inactive'; el3.textContent = _t('cs_no_checkin'); }
        if (el4) el4.textContent = '00:00:00';
        document.querySelectorAll('.type-option').forEach(function(el) { el.style.pointerEvents = 'auto'; });
        currentAttendanceId = null;
        currentCheckInTime = null;
        sessionCheckedIn = false;
        localStorage.removeItem('attendance_active_session');
        localStorage.removeItem('attendance_last_checkout');
        loadAttendanceData();
        var hrs = Math.floor(totalMinutes / 60);
        var mins = totalMinutes % 60;
        addNotification('checkout', _t('cs_checkout_completed') + ' ' + hrs + 'h ' + mins + 'm', '🚪');
        alert(_t('cs_checkout_success') + ' ' + hrs + 'h ' + mins + 'm');
      } catch (err) {
        console.error('Error en check-out:', err);
        alert(_t('cs_checkout_error') + ' ' + err.message);
      }
    }

    async function loadAttendanceData() {
      try {
        if (!supabaseClient) return;
        var userResp = await supabaseClient.auth.getUser();
        var user = userResp.data.user;
        if (!user) return;
        var activeRes = await supabaseClient.from('attendance').select('*').eq('student_id', user.id).is('check_out', null).order('check_in', { ascending: false }).limit(1);
        var activeSession = activeRes.data;
        if (activeSession && activeSession.length > 0) {
          var session = activeSession[0];
          var sessionAge = (new Date() - new Date(session.check_in)) / (1000 * 60 * 60);

          // If session is older than 24 hours, auto-close it
          if (sessionAge >= 24) {
            var actualMinutes = Math.min(Math.round(sessionAge * 60), 720);
            var autoCloseTime = new Date(new Date(session.check_in).getTime() + actualMinutes * 60 * 1000);
            await supabaseClient.from('attendance')
              .update({ check_out: autoCloseTime.toISOString(), total_minutes: actualMinutes })
              .eq('id', session.id);
            console.log('[Attendance] Auto-closed stale active session:', session.id);
            addNotification('checkout', _t('cs_session_auto_closed'), '⏰');
          } else {
            currentAttendanceId = session.id;
            currentCheckInTime = new Date(session.check_in);
            selectedClassType = session.class_type;
            sessionCheckedIn = true;
            if (typeof selectClassType === 'function') selectClassType(session.class_type);
            var btnIn = document.getElementById('btnCheckIn');
            var btnOut = document.getElementById('btnCheckOut');
            var badge = document.getElementById('attendanceStatusBadge');
            if (btnIn) btnIn.style.display = 'none';
            if (btnOut) btnOut.style.display = 'block';
            if (badge) { badge.className = 'attendance-status status-active'; badge.textContent = _t('cs_in_class') + ' ' + getClassTypeLabel(selectedClassType); }
            document.querySelectorAll('.type-option').forEach(function(el) { el.style.pointerEvents = 'none'; });
            if (!attendanceTimerInterval) {
              attendanceTimerInterval = setInterval(updateTimer, 1000);
            }
            updateTimer();
            lastActivityTime = Date.now();
            if (typeof startInactivityMonitor === 'function') startInactivityMonitor();
          }
        }

        // Load attendance history for stats
        var now = new Date();
        var startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0,0,0,0);

        var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        var weekRes = await supabaseClient.from('attendance').select('*').eq('student_id', user.id).gte('check_in', startOfWeek.toISOString()).not('check_out', 'is', null);
        var monthRes = await supabaseClient.from('attendance').select('*').eq('student_id', user.id).gte('check_in', startOfMonth.toISOString()).not('check_out', 'is', null);

        var weekData = weekRes.data || [];
        var monthData = monthRes.data || [];

        var weekMinutes = weekData.reduce(function(sum, r) { return sum + (r.total_minutes || 0); }, 0);
        var monthMinutes = monthData.reduce(function(sum, r) { return sum + (r.total_minutes || 0); }, 0);

        var weekHrs = Math.floor(weekMinutes / 60);
        var weekMins = weekMinutes % 60;
        var monthHrs = Math.floor(monthMinutes / 60);
        var monthMins = monthMinutes % 60;

        var weekEl = document.getElementById('weeklyHours');
        var monthEl = document.getElementById('monthlyHours');
        var weekSessions = document.getElementById('weeklySessions');
        var monthSessions = document.getElementById('monthlySessions');

        if (weekEl) weekEl.textContent = weekHrs + 'h ' + weekMins + 'm';
        if (monthEl) monthEl.textContent = monthHrs + 'h ' + monthMins + 'm';
        if (weekSessions) weekSessions.textContent = weekData.length + ' ' + _t('cs_sessions');
        if (monthSessions) monthSessions.textContent = monthData.length + ' ' + _t('cs_sessions');

      } catch (err) {
        console.error('Error loading attendance data:', err);
      }
    }

    async function loadAdminAttendance() {
      try {
        if (!supabaseClient) return;
        var filterEl = document.getElementById('adminAttFilter');
        var typeFilterEl = document.getElementById('adminAttTypeFilter');
        if (!filterEl || !typeFilterEl) return;
        var filter = filterEl.value;
        var typeFilter = typeFilterEl.value;
        var query = supabaseClient.from('attendance').select('*').order('check_in', { ascending: false });
        var now = new Date();
        if (filter === 'today') { var d = new Date(now); d.setHours(0,0,0,0); query = query.gte('check_in', d.toISOString()); }
        else if (filter === 'week') { var w = new Date(now); w.setDate(w.getDate() - w.getDay()); w.setHours(0,0,0,0); query = query.gte('check_in', w.toISOString()); }
        else if (filter === 'month') { var m = new Date(now.getFullYear(), now.getMonth(), 1); query = query.gte('check_in', m.toISOString()); }
        if (typeFilter !== 'all') { query = query.eq('class_type', typeFilter); }
        var res = await query;
        var data = res.data || [];
        var liveCount = data.filter(function(r) { return !r.check_out; }).length;
        var todayStart = new Date(); todayStart.setHours(0,0,0,0);
        var todayRecords = data.filter(function(r) { return new Date(r.check_in) >= todayStart; });
        var weekHours = data.reduce(function(sum, r) { return sum + (r.total_minutes || 0); }, 0);
        var elLive = document.getElementById('adminLiveCount');
        var elToday = document.getElementById('adminTodayCount');
        var elWeek = document.getElementById('adminWeekHours');
        if (elLive) elLive.textContent = liveCount;
        if (elToday) elToday.textContent = todayRecords.length;
        if (elWeek) elWeek.textContent = (weekHours / 60).toFixed(1);

        // Build userMap in ONE batch query instead of individual queries per student
        var studentIds = [];
        data.forEach(function(r) { if (studentIds.indexOf(r.student_id) === -1) studentIds.push(r.student_id); });
        var userMap = {};

        if (studentIds.length > 0) {
          try {
            // Batch query - get all users at once (no .single(), no loop)
            var usersRes = await usersDataAdmin('admin_list', { filters: { id_in: studentIds }, fields: ['id','nombre','email'], limit: 5000 });
            if (usersRes.data) {
              usersRes.data.forEach(function(u) {
                userMap[u.id] = u.nombre || (u.email ? u.email.split('@')[0] : u.id.substring(0,8) + '...');
              });
            }
          } catch(e) { console.warn('Error loading user names:', e); }

          // Fallback for IDs not found in users table
          studentIds.forEach(function(id) {
            if (!userMap[id]) userMap[id] = id.substring(0,8) + '...';
          });
        }

        var tbody = document.getElementById('adminAttendanceBody');
        if (data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#888;">' + _t('cs_no_records') + '</td></tr>';
        } else {
          tbody.innerHTML = data.slice(0, 50).map(function(r) {
            var name = _escHtml(userMap[r.student_id] || r.student_id.substring(0,8));
            var timeIn = new Date(r.check_in).toLocaleDateString('es-MX', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
            var timeOut = r.check_out ? new Date(r.check_out).toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'}) : '<span class="live-indicator">' + _t('cs_in_class_label') + '</span>';
            var hours = r.total_minutes ? (r.total_minutes / 60).toFixed(1) + 'h' : '--';
            var safeClassType = _escHtml(r.class_type || '');
            var safeStatus = _escHtml(r.status || 'presente');
            return '<tr><td>' + name + '</td><td><span class="history-type ' + (r.class_type === 'presencial' ? 'type-presencial' : 'type-zoom') + '">' + (r.class_type === 'presencial' ? '\ud83c\udfdb\ufe0f' : '\ud83d\udcbb') + ' ' + safeClassType + '</span></td><td>' + timeIn + '</td><td>' + timeOut + '</td><td>' + hours + '</td><td>' + safeStatus + '</td></tr>';
          }).join('');
        }
      } catch (err) { console.error('Error asistencia admin:', err); }
    }

    setInterval(function() {
      var screen = document.getElementById('adminDashboardScreen');
      if (screen && screen.classList.contains('active')) { loadAdminAttendance(); }
    }, 30000);


