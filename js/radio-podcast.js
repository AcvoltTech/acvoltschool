    // ===== RADIO Y PODCAST — Card Grid + Episode Progress =====
    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var podcastSectionIds = ['sectionRadio', 'sectionEpisodios', 'sectionTipsHVAC'];
    var PODCAST_PROGRESS_KEY = 'maestroac_podcast_progress';
    var TOTAL_EPISODES = 12;

    // --- Radio Live Stream Controls ---
    var radioStreamURL = 'https://streaming.live365.com/a08500';
    var _radioPlaying = false;
    var _radioChannel = null;
    var _radioReconnectAttempts = 0;
    var _radioReconnectTimer = null;
    var _radioReconnectMax = 5;
    var _radioToastShown = false;

    function _radioClearReconnect() {
      if (_radioReconnectTimer) { clearTimeout(_radioReconnectTimer); _radioReconnectTimer = null; }
      _radioReconnectAttempts = 0;
      _radioToastShown = false;
    }

    function _radioScheduleReconnect(reason) {
      if (window._radioUserPaused) { _radioClearReconnect(); return; }
      if (_radioReconnectAttempts >= _radioReconnectMax) {
        console.warn('[Radio] Reconnect gave up after ' + _radioReconnectMax + ' attempts (' + reason + ')');
        var offEl = document.getElementById('radioPlayerOff');
        var onEl = document.getElementById('radioPlayerOn');
        if (offEl) offEl.style.display = 'block';
        if (onEl) onEl.style.display = 'none';
        _radioPlaying = false;
        _syncDashRadio();
        if (window.showToast) {
          try { window.showToast(_tc('radio_reconnect_failed', 'Radio desconectada. Toca para reintentar.'), 'warning'); } catch(e) {}
        }
        _radioReconnectAttempts = 0;
        _radioToastShown = false;
        return;
      }
      var delay = Math.min(30000, 1000 * Math.pow(2, _radioReconnectAttempts));
      _radioReconnectAttempts++;
      console.warn('[Radio] Reconnect attempt ' + _radioReconnectAttempts + '/' + _radioReconnectMax + ' in ' + delay + 'ms (' + reason + ')');
      if (!_radioToastShown && _radioReconnectAttempts === 1 && window.showToast) {
        _radioToastShown = true;
        try { window.showToast(_tc('radio_reconnecting', 'Reconectando radio...'), 'info'); } catch(e) {}
      }
      if (_radioReconnectTimer) clearTimeout(_radioReconnectTimer);
      _radioReconnectTimer = setTimeout(function() {
        _radioReconnectTimer = null;
        var audio = document.getElementById('radioAudioPlayer');
        if (!audio || window._radioUserPaused) return;
        try {
          audio.src = radioStreamURL + '?_r=' + Date.now();
          var p = audio.play();
          if (p && typeof p.then === 'function') {
            p.then(function() {
              _radioPlaying = true;
              _radioReconnectAttempts = 0;
              _radioToastShown = false;
              var offSection = document.getElementById('radioPlayerOff');
              var onSection = document.getElementById('radioPlayerOn');
              if (offSection) offSection.style.display = 'none';
              if (onSection) onSection.style.display = 'block';
              _syncDashRadio();
              console.log('[Radio] Reconnect succeeded');
            }).catch(function(err) {
              console.warn('[Radio] Reconnect play() rejected:', err && err.message);
              _radioScheduleReconnect('play-rejected');
            });
          }
        } catch(e) {
          console.warn('[Radio] Reconnect threw:', e && e.message);
          _radioScheduleReconnect('exception');
        }
      }, delay);
    }

    // --- Realtime Listener Count via Supabase Presence ---
    function _joinRadioPresence() {
      if (!window.supabaseClient || _radioChannel) return;
      var email = localStorage.getItem('tecnico_email') || ('anon_' + Math.random().toString(36).slice(2, 8));
      _radioChannel = supabaseClient.channel('radio-listeners');
      _radioChannel.on('presence', { event: 'sync' }, function() {
        var state = _radioChannel.presenceState();
        var count = Object.keys(state).length;
        _updateListenerCount(count);
      });
      _radioChannel.subscribe(function(status) {
        if (status === 'SUBSCRIBED') {
          _radioChannel.track({ email: email, joined: new Date().toISOString() });
        }
      });
    }

    function _leaveRadioPresence() {
      if (_radioChannel) {
        try { _radioChannel.untrack(); } catch(e) {}
        try { _radioChannel.unsubscribe(); } catch(e) {}
        _radioChannel = null;
      }
    }

    function _updateListenerCount(count) {
      var label = count === 1 ? _tc('radio_listener', 'oyente') : _tc('radio_listeners', 'oyentes');
      var el = document.getElementById('radioListenerCount');
      if (el) {
        el.textContent = count + ' ' + label;
        el.style.display = count > 0 ? 'inline-flex' : 'none';
        el.setAttribute('role', 'status');
        el.setAttribute('aria-label', count + ' ' + label + ' en la radio');
      }
      var elDash = document.getElementById('dashRadioListeners');
      if (elDash) {
        elDash.textContent = count > 0 ? count : '';
        elDash.style.display = count > 0 ? 'block' : 'none';
        elDash.setAttribute('role', 'status');
        elDash.setAttribute('aria-label', count + ' ' + label);
      }
    }

    // Dashboard radio widget sync (replaces old floating widget)
    function _syncDashRadio() {
      var w = document.getElementById('dashRadioWidget');
      if (!w) return;
      // Ensure ARIA attributes for interactive radio widget
      w.setAttribute('role', 'button');
      w.setAttribute('tabindex', '0');
      var offEl = document.getElementById('dashRadioOff');
      var onEl = document.getElementById('dashRadioOn');
      var eqEl = document.getElementById('dashRadioEq');
      if (_radioPlaying) {
        w.setAttribute('data-state', 'on');
        w.setAttribute('aria-label', _tc('radio_playing_label', 'Radio en vivo — toca para pausar'));
        if (offEl) offEl.style.display = 'none';
        if (onEl) onEl.style.display = 'flex';
        // Build equalizer bars if empty
        if (eqEl && !eqEl.children.length) {
          var delays = [0, 0.12, 0.06, 0.18];
          var durations = [0.4, 0.55, 0.45, 0.6];
          for (var i = 0; i < 4; i++) {
            var bar = document.createElement('span');
            bar.style.cssText = 'width:3px;background:#4ade80;border-radius:2px;animation:dashRadioEq ' + durations[i] + 's ease infinite ' + delays[i] + 's;';
            eqEl.appendChild(bar);
          }
        }
      } else {
        w.setAttribute('data-state', 'off');
        w.setAttribute('aria-label', _tc('radio_off_label', 'Radio apagada — toca para reproducir'));
        if (offEl) offEl.style.display = 'flex';
        if (onEl) onEl.style.display = 'none';
      }
    }

    window.toggleDashRadio = function() {
      if (_radioPlaying) { window._radioUserPaused = true; stopRadio(); }
      else { window._radioUserPaused = false; startRadio(); }
    };

    window._syncDashRadio = _syncDashRadio;

    function startRadio() {
      if (_radioPlaying) return; // prevent double-play
      _radioPlaying = true;
      _joinRadioPresence();
      var offSection = document.getElementById('radioPlayerOff');
      var onSection = document.getElementById('radioPlayerOn');
      var audio = document.getElementById('radioAudioPlayer');
      if (offSection) offSection.style.display = 'none';
      if (onSection) onSection.style.display = 'block';
      if (audio) {
        audio.src = radioStreamURL;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(function() {
            _radioClearReconnect();
            _syncDashRadio();
          }).catch(function() {
            audio.load();
            _radioPlaying = false;
            _syncDashRadio();
            var offEl = document.getElementById('radioPlayerOff');
            var onEl = document.getElementById('radioPlayerOn');
            if(offEl) offEl.style.display = 'block';
            if(onEl) onEl.style.display = 'none';
          });
        } else {
          _syncDashRadio();
        }
        // Only attach listeners once per audio element
        if (!audio._radioListenersAttached) {
          audio._radioListenersAttached = true;
          audio.addEventListener('error', function() {
            if (window._radioUserPaused) return;
            console.warn('[Radio] Audio error — scheduling reconnect');
            _radioScheduleReconnect('error');
          });
          audio.addEventListener('stalled', function() {
            if (window._radioUserPaused) return;
            console.warn('[Radio] Audio stalled — scheduling reconnect');
            _radioScheduleReconnect('stalled');
          });
          audio.addEventListener('ended', function() {
            if (window._radioUserPaused) return;
            console.warn('[Radio] Live stream ended — scheduling reconnect');
            _radioScheduleReconnect('ended');
          });
          audio.addEventListener('waiting', function() {
            if (window._radioUserPaused) return;
            console.warn('[Radio] Audio waiting (buffer underrun)');
            if (!_radioReconnectTimer) _radioScheduleReconnect('waiting');
          });
          audio.addEventListener('emptied', function() {
            if (window._radioUserPaused) return;
            if (!audio.src) return;
            console.warn('[Radio] Audio emptied');
            _radioScheduleReconnect('emptied');
          });
          audio.addEventListener('suspend', function() {
            console.log('[Radio] Audio suspend');
          });
          audio.addEventListener('playing', function() {
            _radioClearReconnect();
          });
        }
      } else {
        _radioPlaying = false;
        _syncDashRadio();
      }
    }
    function stopRadio() {
      _radioClearReconnect();
      var audio = document.getElementById('radioAudioPlayer');
      if (audio) { audio.pause(); audio.src = ''; }
      _radioPlaying = false;
      _leaveRadioPresence();
      var offSection = document.getElementById('radioPlayerOff');
      var onSection = document.getElementById('radioPlayerOn');
      if (offSection) offSection.style.display = 'block';
      if (onSection) onSection.style.display = 'none';
      _syncDashRadio();
    }

    // Auto-start radio on app open (called from navigation.js)
    var _radioAutoplayPending = false;
    window.autoStartRadio = function() {
      if (_radioPlaying) return;
      // Never auto-start radio during an active broadcast or live stream
      if (window._lsaBroadcastActive) return;
      if (document.getElementById('lsaBrowserModal')) return;
      if (document.getElementById('lsPlayerSection') && document.getElementById('lsPlayerSection').style.display !== 'none') return;
      // If user manually paused, don't auto-start
      if (window._radioUserPaused) return;
      // Try to start — if browser blocks, wait for first user gesture
      var audio = document.getElementById('radioAudioPlayer');
      if (!audio) return;
      audio.src = radioStreamURL;
      var p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(function() {
          _radioPlaying = true;
          _radioAutoplayPending = false;
          _joinRadioPresence();
          var offSection = document.getElementById('radioPlayerOff');
          var onSection = document.getElementById('radioPlayerOn');
          if (offSection) offSection.style.display = 'none';
          if (onSection) onSection.style.display = 'block';
          _syncDashRadio();
        }).catch(function() {
          // Browser blocked autoplay — set up first-tap listener
          audio.load();
          _radioAutoplayPending = true;
          _setupFirstTapRadio();
        });
      }
    };

    function _setupFirstTapRadio() {
      if (window._radioFirstTapSet) return;
      window._radioFirstTapSet = true;
      var handler = function() {
        if (_radioAutoplayPending && !_radioPlaying && !window._radioUserPaused) {
          _radioAutoplayPending = false;
          startRadio();
        }
        document.removeEventListener('click', handler, true);
        document.removeEventListener('touchstart', handler, true);
        window._radioFirstTapSet = false;
      };
      document.addEventListener('click', handler, true);
      document.addEventListener('touchstart', handler, true);
    }
    window.isRadioPlaying = function() { return _radioPlaying; };
    // Expose stop/start globally for cross-module access
    window.stopRadio = stopRadio;
    window.startRadio = startRadio;

    function togglePodcastSection(sectionId) {
      var el = document.getElementById(sectionId);
      if (!el) return;
      var isVisible = el.style.display !== 'none';
      podcastSectionIds.forEach(function(id) {
        var s = document.getElementById(id);
        if (s) s.style.display = 'none';
      });
      if (!isVisible) {
        el.style.display = '';
        setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
      }
      // Show/hide floating button
      var floatBtn = document.getElementById('podcastFloatingBtn');
      if (floatBtn) floatBtn.style.display = (!isVisible) ? '' : 'none';
    }

    function podcastGoHome() {
      podcastSectionIds.forEach(function(id) {
        var s = document.getElementById(id);
        if (s) s.style.display = 'none';
      });
      var screen = document.getElementById('radioPodcastScreen');
      if (screen) screen.scrollTo({ top: 0, behavior: 'smooth' });
      var floatBtn = document.getElementById('podcastFloatingBtn');
      if (floatBtn) floatBtn.style.display = 'none';
    }

    function getEpisodeProgress() {
      try {
        return JSON.parse(localStorage.getItem(PODCAST_PROGRESS_KEY) || '{}');
      } catch(e) { return {}; }
    }

    function toggleEpisodeComplete(epNum) {
      var progress = getEpisodeProgress();
      progress[epNum] = !progress[epNum];
      localStorage.setItem(PODCAST_PROGRESS_KEY, JSON.stringify(progress));
      updateEpisodeUI(epNum, progress[epNum]);
      updateEpisodeGroupCount();
    }

    function updateEpisodeUI(epNum, isComplete) {
      var card = document.getElementById('ep-' + epNum);
      var btn = document.getElementById('epBtn-' + epNum);
      if (card) {
        if (isComplete) { card.classList.add('completed'); } else { card.classList.remove('completed'); }
      }
      if (btn) {
        if (isComplete) {
          btn.textContent = '✅ ' + _tc('pod_completed', 'Completado');
          btn.classList.add('done');
        } else {
          btn.textContent = '⬜ ' + _tc('pod_pending', 'Pendiente');
          btn.classList.remove('done');
        }
      }
    }

    function updateEpisodeGroupCount() {
      var progress = getEpisodeProgress();
      var count = 0;
      for (var i = 1; i <= TOTAL_EPISODES; i++) {
        if (progress[i]) count++;
      }
      var el = document.getElementById('epGroupCount');
      if (el) el.textContent = count + '/' + TOTAL_EPISODES + ' ' + _tc('pod_completed_count', 'completados');
    }

    function initPodcastProgress() {
      var progress = getEpisodeProgress();
      for (var i = 1; i <= TOTAL_EPISODES; i++) {
        updateEpisodeUI(i, !!progress[i]);
      }
      updateEpisodeGroupCount();
      // Hide all sections on init
      podcastSectionIds.forEach(function(id) {
        var s = document.getElementById(id);
        if (s) s.style.display = 'none';
      });
      var floatBtn = document.getElementById('podcastFloatingBtn');
      if (floatBtn) floatBtn.style.display = 'none';
      // Sync radio UI if already playing (from autostart)
      if (_radioPlaying) {
        var offSection = document.getElementById('radioPlayerOff');
        var onSection = document.getElementById('radioPlayerOn');
        if (offSection) offSection.style.display = 'none';
        if (onSection) onSection.style.display = 'block';
      }
    }

    // loadProfileData() and loadProfilePhoto() moved to profile.js (Tier 1)



    // === VERIFY STRIPE PAYMENT BEFORE GENERATING CODE ===
    // Checks for ANY active payment: Membresía ($119/$299/$699) OR App Access ($20/mes, $240/año)
    async function verifyStripeMembership(email) {
      if (!email) return { active: false, plan: null, error: 'No email provided' };
      
      try {
        // Call edge function with check_subscription only
        const response = await fetch(SUPABASE_URL + '/functions/v1/get-stripe-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + (await window.getAdminBearer())
          },
          body: JSON.stringify({ action: 'check_subscription', email: email })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.active || data.has_subscription) {
            return { active: true, plan: data.plan || data.product || _tc('radio_active_subscription', 'Suscripcion Activa'), type: data.type || 'subscription' };
          }
          
          // Check if response has charges/payments data
          if (data.charges || data.payments) {
            const charges = data.charges || data.payments || [];
            const chargeList = Array.isArray(charges) ? charges : [];
            const recentPayment = chargeList.find(c => {
              const cEmail = (c.customer_email || c.email || c.receipt_email || '').toLowerCase();
              const paid = c.paid || c.status === 'succeeded' || c.status === 'paid';
              return cEmail === email.toLowerCase() && paid;
            });
            if (recentPayment) {
              return { active: true, plan: _tc('radio_payment_verified', 'Pago verificado'), type: 'one_time' };
            }
          }
          
          // Check subscriptions in response
          if (data.subscriptions || data.active_subscriptions) {
            const subs = data.subscriptions || data.active_subscriptions || [];
            const activeSubs = Array.isArray(subs) ? subs : [];
            const subMatch = activeSubs.find(s => {
              const subEmail = (s.customer_email || s.email || (s.customer && s.customer.email) || '').toLowerCase();
              return subEmail === email.toLowerCase();
            });
            if (subMatch) {
              const amount = subMatch.amount || subMatch.plan_amount || 0;
              const amountUsd = amount > 100 ? amount / 100 : amount;
              let planName = _tc('radio_active_subscription', 'Suscripcion Activa');
              if (amountUsd >= 600) planName = '\ud83d\udc51 ' + _tc('radio_plan_mentoria', 'Mentoria $699/mes');
              else if (amountUsd >= 250) planName = '\ud83d\udcaa ' + _tc('radio_plan_intermedio', 'Intermedio $299/mes');
              else if (amountUsd >= 200) planName = '\ud83d\udcd6 ' + _tc('radio_plan_annual', 'App Anual $240/año');
              else if (amountUsd >= 90) planName = '\ud83c\udf1f ' + _tc('radio_plan_principiante', 'Principiante $119/mes');
              else if (amountUsd >= 15) planName = '\ud83d\udcf1 ' + _tc('radio_plan_monthly', 'App Mensual $20/mes');
              return { active: true, plan: planName, type: 'subscription' };
            }
          }
        }
        
        // If edge function failed or returned no match, return not found
        return { active: false, plan: null, error: _tc('radio_no_active_payment', 'No se encontro pago activo ($20/mes, $240/año, o Membresia)') };
        
      } catch(e) {
        console.warn('[Stripe Check]', e);
        return { active: false, plan: null, error: _tc('radio_stripe_error', 'Error conectando con Stripe') + ': ' + e.message };
      }
    }

    async function approveAccessCode(index) {
      let requests = [];
      try {
        const { data } = await supabaseClient.from('access_code_requests').select('*').order('requested_at', { ascending: false });
        if (data) requests = data;
      } catch(e) { console.warn('[RadioPodcast]', e.message || e); }
      
      if (requests.length === 0) {
        requests = JSON.parse(localStorage.getItem('maestroac_code_requests') || '[]');
      }
      
      if (requests[index]) {
        const studentEmail = requests[index].student_email;
        
        // Verify Stripe membership
        const stripeCheck = await verifyStripeMembership(studentEmail);
        
        if (!stripeCheck.active) {
          const override = confirm(
            _tc('radio_alert_no_membership', '⚠️ ALERTA') + ': ' + (requests[index].student_name || studentEmail) + ' ' + _tc('radio_no_stripe_membership', 'NO tiene membresía activa en Stripe.') + '\n\n' +
            (stripeCheck.error ? '📋 ' + stripeCheck.error + '\n\n' : '') +
            _tc('radio_generate_anyway', '¿Deseas generar el código de todas formas?') + '\n\n' +
            _tc('radio_yes_generate', '• SÍ = Generar código manualmente (sin verificación de pago)') + '\n' +
            _tc('radio_no_cancel', '• NO = Cancelar y pedir que pague primero')
          );
          if (!override) return;
        } else {
          // Confirmed active — show plan info
          window.showToast(_tc('radio_membership_verified', '✅ Membresía verificada en Stripe') + ' — Plan: ' + (stripeCheck.plan || _tc('radio_active', 'Activa')) + ' — ' + _tc('radio_student', 'Estudiante') + ': ' + (requests[index].student_name || studentEmail) + ' — ' + _tc('radio_generating_code', 'Generando código...'), 'success');
        }

        const code = generateRandomAccessCode();
        requests[index].status = 'approved';
        requests[index].code = code;
        requests[index].approved_at = new Date().toISOString();
        requests[index].stripe_verified = stripeCheck.active;
        
        try {
          await supabaseClient.from('access_code_requests').update({ 
            status: 'approved', code: code, approved_at: new Date().toISOString(),
            stripe_verified: stripeCheck.active
          }).eq('id', requests[index].id);
        } catch(e) { console.warn('[RadioPodcast]', e.message || e); }
        
        localStorage.setItem('maestroac_code_requests', JSON.stringify(requests));
        renderAccessCodes();
        
        var req = requests[index];
        var name = req.student_name || 'Estudiante';
        var email = req.student_email || '';
        var phone = req.student_phone || '';
        
        showCodeSendModal(name, email, phone, code);
      }
    }

    function markCodeSent(sentKey) {
      try {
        localStorage.setItem(sentKey, new Date().toISOString());
        // Refresh the table after a short delay to show "Enviado" badge
        setTimeout(function() { renderAccessCodes(); }, 500);
      } catch(e) { console.warn('[RadioPodcast]', e.message || e); }
    }

    function showCodeSendModal(name, email, phone, code) {
      // Auto-mark this code as sent when modal opens (user initiated send flow)
      try {
        var keys = Object.keys(localStorage).filter(function(k) { return k.startsWith('code_sent_'); });
        // Also set a generic sent marker by code value
        localStorage.setItem('code_sent_code_' + code, new Date().toISOString());
      } catch(e) { console.warn('[RadioPodcast]', e.message || e); }
      
      // Remove existing modal
      var existing = document.getElementById('codeSendModal');
      if (existing) existing.remove();
      
      var emailSubject = encodeURIComponent('🎓 Tu Código de Acceso - ACVOLT Tech School');
      var emailBody = encodeURIComponent(
        'Hola ' + name + ',\n\n' +
        '¡Tu código de acceso para Maestro HVACR ha sido aprobado! 🎉\n\n' +
        '🔑 TU CÓDIGO: ' + code + '\n\n' +
        'Para activarlo:\n' +
        '1. Abre la app Maestro HVACR en maestrohvacr.com\n' +
        '2. Inicia sesión con tu cuenta\n' +
        '3. Ve a "Canjear Código" en el menú\n' +
        '4. Ingresa tu código: ' + code + '\n\n' +
        '¡Éxito en tu camino de certificación HVAC!\n\n' +
        'Maestro Mario\n' +
        'ACVOLT Tech School\n' +
        'www.maestrohvacr.com'
      );
      
      var waMsg = encodeURIComponent(
        '🎓 *ACVOLT Tech School*\n\n' +
        'Hola ' + name + ', tu código de acceso está listo:\n\n' +
        '🔑 *' + code + '*\n\n' +
        'Para activarlo:\n' +
        '1️⃣ Abre maestrohvacr.com\n' +
        '2️⃣ Inicia sesión\n' +
        '3️⃣ Ve a "Canjear Código"\n' +
        '4️⃣ Ingresa: *' + code + '*\n\n' +
        '¡Éxito! 💪🔥'
      );
      
      // Clean phone for WhatsApp (remove spaces, dashes, parentheses)
      var cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
      if (cleanPhone && !cleanPhone.startsWith('1') && cleanPhone.length === 10) cleanPhone = '1' + cleanPhone;
      
      var modal = document.createElement('div');
      modal.id = 'codeSendModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.innerHTML = 
        '<div style="background:#0b1425;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:30px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
          '<div style="text-align:center;margin-bottom:20px;">' +
            '<div style="font-size:48px;margin-bottom:10px;">✅</div>' +
            '<h2 style="color:#f0f4fa;margin:0 0 5px;">' + _tc('radio_code_generated', 'Código Generado') + '</h2>' +
            '<p style="color:rgba(180,200,230,0.6);font-size:14px;margin:0;">Para: <strong style="color:#f0f4fa;">' + name + '</strong></p>' +
          '</div>' +

          '<div style="background:rgba(34,197,94,0.12);border:2px solid rgba(34,197,94,0.4);border-radius:12px;padding:15px;text-align:center;margin-bottom:20px;">' +
            '<div style="color:rgba(180,200,230,0.6);font-size:12px;margin-bottom:4px;">' + _tc('radio_access_code', 'CÓDIGO DE ACCESO') + '</div>' +
            '<div style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#16a34a;font-family:monospace;">' + code + '</div>' +
            '<button onclick="navigator.clipboard.writeText(\'' + code + '\');this.textContent=\'✅ ' + _tc('radio_copied', 'Copiado!').replace(/'/g, "\\'") + '\';setTimeout(()=>this.textContent=\'📋 ' + _tc('radio_copy_code', 'Copiar Código').replace(/'/g, "\\'") + '\',2000)" style="margin-top:8px;background:#22c55e;color:white;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;">📋 ' + _tc('radio_copy_code', 'Copiar Código') + '</button>' +
          '</div>' +
          
          '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:15px;">' +
            '<div style="color:rgba(180,200,230,0.6);font-size:12px;font-weight:bold;text-align:center;">📤 ' + _tc('radio_send_to_student', 'ENVIAR AL ESTUDIANTE') + '</div>' +
            
            // Email button — use encodeURIComponent for all user inputs in onclick to prevent injection
            (email ?
              '<a href="javascript:void(0)" onclick="openEmailComposer(decodeURIComponent(\'' + encodeURIComponent(email) + '\'),decodeURIComponent(\'' + emailSubject + '\'),decodeURIComponent(\'' + emailBody + '\'),\'📧 Enviar Código\')" style="display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:14px;cursor:pointer;">' +
                '<span style="font-size:24px;">📧</span>' +
                '<div><div>' + _tc('radio_send_email', 'Enviar por Email') + '</div><div style="font-size:11px;opacity:0.8;font-weight:normal;">' + _escHtml(email) + '</div></div>' +
              '</a>' : 
              '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:14px 20px;border-radius:12px;color:rgba(180,200,230,0.5);text-align:center;font-size:13px;">📧 ' + _tc('radio_no_email', 'Sin email registrado') + '</div>') +

            // WhatsApp button
            (cleanPhone ?
              '<a href="https://wa.me/' + cleanPhone + '?text=' + waMsg + '" target="_blank" style="display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#25D366,#128C7E);color:white;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:14px;">' +
                '<span style="font-size:24px;">💬</span>' +
                '<div><div>' + _tc('radio_send_whatsapp', 'Enviar por WhatsApp') + '</div><div style="font-size:11px;opacity:0.8;font-weight:normal;">' + phone + '</div></div>' +
              '</a>' :
              '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:14px 20px;border-radius:12px;color:rgba(180,200,230,0.5);text-align:center;font-size:13px;">💬 ' + _tc('radio_no_phone', 'Sin teléfono registrado') + '</div>') +
            
            // SMS button
            (cleanPhone ? 
              '<a href="sms:' + cleanPhone + '?body=' + encodeURIComponent('ACVOLT Tech School - Tu código de acceso: ' + code + ' | Actívalo en maestrohvacr.com') + '" style="display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:14px;">' +
                '<span style="font-size:24px;">💬</span>' +
                '<div><div>' + _tc('radio_send_sms', 'Enviar por SMS') + '</div><div style="font-size:11px;opacity:0.8;font-weight:normal;">' + phone + '</div></div>' +
              '</a>' : '') +
          '</div>' +
          
          '<button onclick="document.getElementById(\'codeSendModal\').remove();try{renderAccessCodes();}catch(e){}" style="width:100%;padding:12px;background:rgba(255,255,255,0.06);color:rgba(200,215,240,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;font-size:14px;font-weight:bold;">✓ ' + _tc('radio_done', 'Listo') + '</button>' +
        '</div>';
      
      document.body.appendChild(modal);
      // Close on backdrop click
      modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    }

    async function rejectAccessCode(index) {
      let requests = [];
      try {
        const { data } = await supabaseClient.from('access_code_requests').select('*').order('requested_at', { ascending: false });
        if (data) requests = data;
      } catch(e) { console.warn('[RadioPodcast]', e.message || e); }
      
      if (requests.length === 0) {
        requests = JSON.parse(localStorage.getItem('maestroac_code_requests') || '[]');
      }
      
      if (requests[index]) {
        requests[index].status = 'rejected';
        
        try {
          await supabaseClient.from('access_code_requests').update({ status: 'rejected' }).eq('id', requests[index].id);
        } catch(e) { console.warn('[RadioPodcast]', e.message || e); }
        
        localStorage.setItem('maestroac_code_requests', JSON.stringify(requests));
        renderAccessCodes();
      }
    }

    function copyCodeToClipboard(code) {
      navigator.clipboard.writeText(code).then(() => {
        window.showToast(_tc('radio_code_copied', 'Código copiado') + ': ' + code, 'success');
      }).catch(() => {
        prompt(_tc('radio_copy_this_code', 'Copia este código') + ':', code);
      });
    }

    // =============== END ACCESS CODE SYSTEM ===============
