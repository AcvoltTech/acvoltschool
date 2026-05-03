    // ===== AUTOMATIC CHECK-IN SYSTEM =====
    if (typeof _addTranslations === 'function') _addTranslations({
      ci_still_studying: { es: '¿Sigues estudiando?', en: 'Still studying?' },
      ci_no_activity_10m: { es: 'No hemos detectado actividad en los últimos 10 minutos.', en: 'No activity detected in the last 10 minutes.' },
      ci_auto_checkout_warn: { es: 'Se hará check-out automático en ~', en: 'Auto check-out in ~' },
      ci_minutes_no_activity: { es: ' minutos si no hay actividad.', en: ' minutes if no activity.' },
      ci_yes_still_here: { es: '✅ ¡Sí, sigo aquí!', en: '✅ Yes, still here!' },
      ci_do_checkout: { es: '🛑 Hacer Check-Out', en: '🛑 Do Check-Out' },
      ci_checkout_inactivity: { es: '⭕ Check-out por inactividad', en: '⭕ Check-out due to inactivity' },
      ci_auto_checkout_inactivity: { es: '⏳ Check-out automático por inactividad — Tiempo real:', en: '⏳ Auto check-out due to inactivity — Actual time:' },
      ci_auto_checkout_title: { es: 'Check-Out Automático', en: 'Automatic Check-Out' },
      ci_inactivity_detected: { es: 'Se detectó inactividad de 15 minutos fuera de horario de clase.', en: '15 minutes of inactivity detected outside class hours.' },
      ci_time_recorded: { es: 'Tiempo registrado:', en: 'Time recorded:' },
      ci_only_real_time: { es: 'Solo se contó el tiempo con actividad real.', en: 'Only time with real activity was counted.' },
      ci_understood: { es: 'Entendido', en: 'Understood' },
      ci_checkin_required: { es: '¡Check-In Requerido!', en: 'Check-In Required!' },
      ci_checkin_required_msg: { es: 'Debes registrar tu asistencia antes de comenzar. Esto es obligatorio para cada sesión de clase.', en: 'You must register your attendance before starting. This is required for each class session.' },
      ci_do_checkin_now: { es: '📋 Hacer Check-In Ahora', en: '📋 Check In Now' },
      ci_cancel: { es: 'Cancelar', en: 'Cancel' },
      ci_presencial: { es: '🏫 Presencial', en: '🏫 In-Person' },
      ci_zoom: { es: '📹 Zoom', en: '📹 Zoom' },
      ci_computer: { es: '🖥️ Computadora', en: '🖥️ Computer' },
      ci_mobile: { es: '📱 Móvil', en: '📱 Mobile' },
    });

    var sessionCheckedIn = false;

    // Process any pending checkout from previous session
    async function _processPendingCheckout() {
      try {
        var pending = localStorage.getItem('attendance_pending_checkout');
        if (!pending || !supabaseClient) return;
        var data = JSON.parse(pending);
        if (data.id) {
          await supabaseClient.from('attendance')
            .update({ check_out: data.checkOut, total_minutes: data.totalMinutes })
            .eq('id', data.id);
        }
        localStorage.removeItem('attendance_pending_checkout');
      } catch(e) { localStorage.removeItem('attendance_pending_checkout'); }
    }

    // Silent auto check-in on login — no modal, no user action
    async function autoCheckIn() {
      await _processPendingCheckout();
      if (sessionCheckedIn || currentAttendanceId) return;
      try {
        if (!supabaseClient) return;
        var userResp = await supabaseClient.auth.getUser();
        var user = userResp && userResp.data && userResp.data.user;
        if (!user) return;
        // Detect device type
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        var classType = isMobile ? 'movil' : 'computadora';
        var res = await supabaseClient
          .from('attendance')
          .insert({ student_id: user.id, class_type: classType, check_in: new Date().toISOString(), status: 'presente' })
          .select().single();
        if (res.error) { console.log('[AutoCheckIn] Insert error:', res.error); return; }
        currentAttendanceId = res.data.id;
        currentCheckInTime = new Date(res.data.check_in);
        sessionCheckedIn = true;
        lastActivityTime = Date.now();
        startInactivityMonitor();
        console.log('[AutoCheckIn] Silent check-in OK — ' + classType);
      } catch(e) { console.log('[AutoCheckIn] Skipped:', e); }
    }

    // (beforeunload handled by class-time-aware listener below ~line 199)

    // ===== INACTIVITY DETECTION SYSTEM =====
    // Track user activity (clicks, scrolls, typing, touches)
    ['click','keydown','scroll','touchstart','mousemove'].forEach(function(ev){
      document.addEventListener(ev, function(){
        if (currentAttendanceId) {
          lastActivityTime = Date.now();
          // If warning was showing, dismiss it
          if (inactivityWarningShown) {
            var warnEl = document.getElementById('inactivityWarningModal');
            if (warnEl) warnEl.remove();
            inactivityWarningShown = false;
            console.log('[Attendance] Activity detected — inactivity timer reset');
          }
        }
      }, {passive:true});
    });

    // Also track visibility changes
    document.addEventListener('visibilitychange', function(){
      if (document.visibilityState === 'visible' && currentAttendanceId) {
        // User came back to the app
        lastActivityTime = Date.now();
        console.log('[Attendance] App visible again — activity updated');
      }
    });

    function startInactivityMonitor() {
      // Clear any existing interval
      if (inactivityCheckInterval) clearInterval(inactivityCheckInterval);

      // Check inactivity every 60 seconds
      inactivityCheckInterval = setInterval(function() {
        if (!currentAttendanceId || !currentCheckInTime) {
          clearInterval(inactivityCheckInterval);
          return;
        }

        // ===== EXCEPTION: During class hours (Tue/Wed 6-10PM California), NO inactivity check =====
        var schedule = isClassTime();
        if (schedule.allowed) {
          // During class time — don't check inactivity, they're in class with Maestro Mario
          return;
        }

        // Outside class hours — check inactivity
        var inactiveMs = Date.now() - lastActivityTime;

        // Show warning at 10 minutes
        if (inactiveMs >= INACTIVITY_WARNING_MS && !inactivityWarningShown) {
          inactivityWarningShown = true;
          var remainSec = Math.ceil((INACTIVITY_LIMIT_MS - inactiveMs) / 1000);
          var remainMin = Math.ceil(remainSec / 60);

          var modal = document.createElement('div');
          modal.id = 'inactivityWarningModal';
          modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
          modal.innerHTML = '<div style="background:#fff;border-radius:20px;padding:30px;max-width:400px;width:100%;text-align:center;">' +
            '<div style="font-size:60px;margin-bottom:15px;">⏳</div>' +
            '<h3 style="color:#f39c12;margin-bottom:10px;font-size:20px;">' + _t('ci_still_studying') + '</h3>' +
            '<p style="color:#64748b;font-size:14px;margin-bottom:8px;">' + _t('ci_no_activity_10m') + '</p>' +
            '<p style="color:#e74c3c;font-size:14px;font-weight:bold;margin-bottom:20px;">' + _t('ci_auto_checkout_warn') + remainMin + _t('ci_minutes_no_activity') + '</p>' +
            '<button onclick="lastActivityTime=Date.now();inactivityWarningShown=false;this.closest(\'div[style*=position]\').remove();" style="width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#27ae60,#2ecc71);color:white;margin-bottom:10px;">' + _t('ci_yes_still_here') + '</button>' +
            '<button onclick="this.closest(\'div[style*=position]\').remove();doCheckOut();" style="width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;cursor:pointer;background:rgba(231,76,60,0.15);color:#dc2626;font-weight:bold;">' + _t('ci_do_checkout') + '</button>' +
            '</div>';
          document.body.appendChild(modal);
        }

        // Auto check-out at 15 minutes of inactivity
        if (inactiveMs >= INACTIVITY_LIMIT_MS) {
          console.log('[Attendance] 15 min inactivity outside class hours — auto check-out');
          // Remove warning modal if showing
          var warnEl = document.getElementById('inactivityWarningModal');
          if (warnEl) warnEl.remove();
          inactivityWarningShown = false;

          // Do the auto check-out
          autoCheckOutInactivity();
        }

      }, 60000); // Check every 60 seconds
    }

    // Auto check-out due to inactivity (different from max time)
    async function autoCheckOutInactivity() {
      if (!currentAttendanceId || !currentCheckInTime) return;
      try {
        // Use lastActivityTime as the real check-out time (when they actually stopped)
        var checkOutTime = new Date(lastActivityTime);
        var totalMinutes = Math.round((checkOutTime - currentCheckInTime) / 60000);
        totalMinutes = Math.min(totalMinutes, 240); // Cap session at 4 hours

        if (supabaseClient) {
          await supabaseClient.from('attendance')
            .update({ check_out: checkOutTime.toISOString(), total_minutes: totalMinutes })
            .eq('id', currentAttendanceId);
        }

        clearInterval(attendanceTimerInterval);
        attendanceTimerInterval = null;
        clearInterval(inactivityCheckInterval);
        inactivityCheckInterval = null;

        document.getElementById('btnCheckIn').style.display = 'block';
        document.getElementById('btnCheckOut').style.display = 'none';
        document.getElementById('attendanceStatusBadge').className = 'attendance-status status-inactive';
        document.getElementById('attendanceStatusBadge').textContent = _t('ci_checkout_inactivity');
        document.getElementById('attendanceTimer').textContent = '00:00:00';
        document.querySelectorAll('.type-option').forEach(function(el) { el.style.pointerEvents = 'auto'; });

        var hrs = Math.floor(totalMinutes / 60);
        var mins = totalMinutes % 60;
        addNotification('checkout', _t('ci_auto_checkout_inactivity') + ' ' + hrs + 'h ' + mins + 'm', '⏳');
        localStorage.removeItem('attendance_active_session');
        localStorage.removeItem('attendance_pending_checkout');

        currentAttendanceId = null;
        currentCheckInTime = null;

        // Show notification modal
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
        modal.innerHTML = '<div style="background:#fff;border-radius:20px;padding:30px;max-width:400px;width:100%;text-align:center;">' +
          '<div style="font-size:60px;margin-bottom:15px;">⏳</div>' +
          '<h3 style="color:#f39c12;margin-bottom:10px;font-size:20px;">' + _t('ci_auto_checkout_title') + '</h3>' +
          '<p style="color:#64748b;font-size:14px;margin-bottom:8px;">' + _t('ci_inactivity_detected') + '</p>' +
          '<p style="color:#1e293b;font-size:16px;font-weight:bold;margin-bottom:5px;">' + _t('ci_time_recorded') + ' ' + hrs + 'h ' + mins + 'm</p>' +
          '<p style="color:#94a3b8;font-size:12px;margin-bottom:20px;">' + _t('ci_only_real_time') + '</p>' +
          '<button onclick="this.closest(\'div[style*=position]\').remove(); loadAttendanceData();" style="width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#f39c12,#e67e22);color:white;">' + _t('ci_understood') + '</button>' +
          '</div>';
        document.body.appendChild(modal);

        loadAttendanceData();
      } catch(e) { console.error('[Attendance] Inactivity check-out error:', e); }
    }

    // ===== AUTO CHECK-OUT ON EXIT =====
    // When technician closes browser/tab, save state for recovery
    window.addEventListener('beforeunload', function() {
      if (currentAttendanceId && currentCheckInTime) {
        var schedule = isClassTime();

        if (schedule.allowed) {
          // ✅ DURING CLASS: Save active session marker, NOT a pending checkout
          // When they reopen the app, the session will resume seamlessly
          localStorage.setItem('attendance_active_session', JSON.stringify({
            id: currentAttendanceId,
            checkIn: currentCheckInTime.toISOString(),
            classType: selectedClassType,
            isClassTime: true
          }));
          localStorage.removeItem('attendance_pending_checkout');
          console.log('[Attendance] Browser closing DURING class — session preserved for resume');
        } else {
          // OUTSIDE CLASS: Save pending checkout
          var checkOutTime = new Date();
          var totalMinutes = Math.round((checkOutTime - currentCheckInTime) / 60000);
          totalMinutes = Math.min(totalMinutes, 240);

          localStorage.setItem('attendance_pending_checkout', JSON.stringify({
            id: currentAttendanceId,
            checkIn: currentCheckInTime.toISOString(),
            checkOut: checkOutTime.toISOString(),
            totalMinutes: totalMinutes,
            classType: selectedClassType
          }));
          console.log('[Attendance] Browser closing OUTSIDE class — pending checkout saved');
        }
      }
    });

    // Also handle visibility change (app backgrounded on mobile)
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden' && currentAttendanceId && currentCheckInTime) {
        var schedule = isClassTime();

        if (schedule.allowed) {
          // ✅ DURING CLASS HOURS: Do NOT save pending checkout
          // Student is in class with Maestro Mario — session stays active
          // Just save a lightweight "session alive" marker for recovery
          localStorage.setItem('attendance_active_session', JSON.stringify({
            id: currentAttendanceId,
            checkIn: currentCheckInTime.toISOString(),
            classType: selectedClassType,
            isClassTime: true
          }));
          // Remove any stale pending checkout
          localStorage.removeItem('attendance_pending_checkout');
          console.log("[Attendance] App hidden DURING class hours — session preserved, NO pending checkout");
        } else {
          // Outside class hours: save pending checkout in case they don't come back
          var checkOutTime = new Date();
          var totalMinutes = Math.round((checkOutTime - currentCheckInTime) / 60000);
          totalMinutes = Math.min(totalMinutes, 240);

          localStorage.setItem('attendance_pending_checkout', JSON.stringify({
            id: currentAttendanceId,
            checkIn: currentCheckInTime.toISOString(),
            checkOut: checkOutTime.toISOString(),
            totalMinutes: totalMinutes,
            classType: selectedClassType,
            wasClassTime: false
          }));
          console.log("[Attendance] App hidden OUTSIDE class hours — pending checkout saved");
        }
      }
      if (document.visibilityState === 'visible' && currentAttendanceId) {
        lastActivityTime = Date.now();
        // Remove pending checkout since user is back
        localStorage.removeItem('attendance_pending_checkout');
        updateTimer();
        console.log("[Attendance] App visible again — pending checkout cleared, timer resumed");
      }
    });

    // Check and auto-close stale sessions on app load
    async function checkStaleAttendance() {
      if (!supabaseClient) return;
      try {
        var userResp = await supabaseClient.auth.getUser();
        var user = userResp.data ? userResp.data.user : null;
        if (!user) return;

        // Process pending checkout from last session close
        var pendingCheckout = localStorage.getItem('attendance_pending_checkout');
        if (pendingCheckout) {
          var pc = JSON.parse(pendingCheckout);

          // ✅ If we're currently in class time, DON'T process the pending checkout
          // The student probably just reopened the app during class
          var scheduleNow = isClassTime();
          if (scheduleNow.allowed) {
            console.log('[Attendance] Pending checkout found but we are IN class time — ignoring, session will resume');
            localStorage.removeItem('attendance_pending_checkout');
            // Don't process — loadAttendanceData() will restore the active session
          } else {
            var checkOutTime = pc.checkOut ? new Date(pc.checkOut) : new Date(pc.closedAt);
            var totalMinutes = pc.totalMinutes || Math.round((checkOutTime - new Date(pc.checkIn)) / 60000);
            totalMinutes = Math.min(totalMinutes, 240); // Cap session at 4 hours

            await supabaseClient.from('attendance')
              .update({ check_out: checkOutTime.toISOString(), total_minutes: totalMinutes })
              .eq('id', pc.id)
              .is('check_out', null); // Only update if still open

            console.log('[Attendance] Auto-checkout from previous session:', pc.id, totalMinutes + 'min');
            localStorage.removeItem('attendance_pending_checkout');
          }
        }

        // Also restore active session marker if present
        var activeSession = localStorage.getItem('attendance_active_session');
        if (activeSession) {
          console.log('[Attendance] Active session marker found — will be restored by loadAttendanceData');
          localStorage.removeItem('attendance_active_session');
        }

        // Find any open sessions older than 24 hours (forgotten checkout)
        var activeRes = await supabaseClient.from('attendance')
          .select('*')
          .eq('student_id', user.id)
          .is('check_out', null)
          .order('check_in', { ascending: false });

        var activeSessions = activeRes.data || [];
        for (var i = 0; i < activeSessions.length; i++) {
          var session = activeSessions[i];
          var sessionCheckIn = new Date(session.check_in);
          var hoursSince = (new Date() - sessionCheckIn) / (1000 * 60 * 60);

          if (hoursSince > 24) {
            // Auto-close forgotten sessions older than 24 hours — record actual time up to 12h max
            var actualMinutes = Math.min(Math.round(hoursSince * 60), 720);
            var autoCloseTime = new Date(sessionCheckIn.getTime() + actualMinutes * 60 * 1000);
            await supabaseClient.from('attendance')
              .update({ check_out: autoCloseTime.toISOString(), total_minutes: actualMinutes })
              .eq('id', session.id);
            console.log('[Attendance] Auto-closed stale session:', session.id);
          }
        }
      } catch(e) { console.log('[Attendance] Stale check error:', e); }
    }

    function requireCheckIn(destination) {
      if (sessionCheckedIn) return true;
      // Prevent stacking multiple check-in modals
      if (document.getElementById('checkInRequiredModal')) return false;
      var modal = document.createElement('div');
      modal.id = 'checkInRequiredModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
      modal.innerHTML = '<div style="background:#0b1425;border:1px solid rgba(39,174,96,0.3);border-radius:20px;padding:30px;max-width:400px;width:100%;text-align:center;">' +
          '<div style="font-size:60px;margin-bottom:15px;">📋</div>' +
          '<h3 style="color:#4ade80;margin-bottom:10px;font-size:20px;">' + _t('ci_checkin_required') + '</h3>' +
          '<p style="color:rgba(180,200,230,0.6);font-size:14px;margin-bottom:20px;">' + _t('ci_checkin_required_msg') + '</p>' +
          '<button onclick="document.getElementById(\'checkInRequiredModal\').remove(); showScreen(\'attendanceScreen\'); loadAttendanceData();" style="width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#27ae60,#2ecc71);color:white;margin-bottom:10px;">' + _t('ci_do_checkin_now') + '</button>' +
          '<button onclick="document.getElementById(\'checkInRequiredModal\').remove();" style="width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;cursor:pointer;background:rgba(255,255,255,0.06);color:rgba(180,200,230,0.5);">' + _t('ci_cancel') + '</button>' +
        '</div>';
      document.body.appendChild(modal);
      return false;
    }

    function getClassTypeLabel(type) {
      var labels = { presencial: _t('ci_presencial'), zoom: _t('ci_zoom'), computadora: _t('ci_computer'), movil: _t('ci_mobile') };
      return labels[type] || type;
    }

