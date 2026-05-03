    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var profilePreviousScreen = 'dashboardScreen';

    // ============================================
    // PROFILE PHOTO
    function handleProfilePhoto(i){
      if(!i.files || !i.files[0]){
        window.showToast(typeof _t === 'function' ? _t('profile_no_file', 'No se selecciono ningun archivo') : 'No se selecciono ningun archivo', 'warning');
        return;
      }
      var file=i.files[0];
      
      // Validate file type
      if(!file.type.startsWith('image/')){
        window.showToast(typeof _t === 'function' ? _t('profile_invalid_image', 'Por favor selecciona una imagen valida') : 'Por favor selecciona una imagen valida', 'warning');
        return;
      }
      
      // Validate file size (max 10MB)
      if(file.size > 10 * 1024 * 1024){
        window.showToast(typeof _t === 'function' ? _t('profile_image_too_large', 'La imagen es muy grande. Maximo 10MB') : 'La imagen es muy grande. Maximo 10MB', 'warning');
        return;
      }
      
      var reader=new FileReader();
      reader.onload=function(e){
        var img=new Image();
        img.onload=function(){
          try{
            var canvas=document.createElement('canvas');
            var maxSize=300;
            var w=img.width, h=img.height;
            if(w>h){h=Math.round(h*maxSize/w);w=maxSize;}
            else{w=Math.round(w*maxSize/h);h=maxSize;}
            canvas.width=w;canvas.height=h;
            var ctx=canvas.getContext('2d');
            ctx.drawImage(img,0,0,w,h);
            var compressed=canvas.toDataURL('image/jpeg',0.7);
            
            // Show photo on profile and dashboard
            _applyProfilePhoto(compressed);

            // Guardar con múltiples keys para asegurar persistencia
            var emailKey = (currentUser && currentUser.email) ? currentUser.email : 'default';
            localStorage.setItem('maestroac_photo_' + emailKey, compressed);
            localStorage.setItem('maestroac_photo_default', compressed);
            
            // También guardar el email para referencia
            if (currentUser && currentUser.email) {
              localStorage.setItem('maestroac_email', currentUser.email);
              localStorage.setItem('tecnico_email', currentUser.email);
              
              // Guardar foto en Supabase para que admin la vea
              if (supabaseClient) {
                usersDataSelf('upsert_self', {
                  email: currentUser.email,
                  data: {
                    photo_url: compressed,
                    photo_updated: new Date().toISOString()
                  }
                })
                  .then(function(result) {
                    if (result.error) {
                      console.error('[Profile] Photo save error:', result.error);
                    } else {
                      console.log('[Profile] Photo saved to Supabase');
                    }
                  }).catch(function(e) { console.error('[Profile] Photo save exception:', e); });
              }
            }
            
            if (window.showToast) { window.showToast(typeof _t === 'function' ? _t('profile_photo_updated', '¡Foto actualizada correctamente!') : '¡Foto actualizada correctamente!', 'success'); } else { window.MaestroDialog.alert({title: '', message: typeof _t === 'function' ? _t('profile_photo_updated', '¡Foto actualizada correctamente!') : '¡Foto actualizada correctamente!', kind: 'success'}); }
          }catch(x){
            window.MaestroDialog.alert({title: 'Error', message: (typeof _t === 'function' ? _t('profile_photo_error', 'Error guardando foto: ') : 'Error guardando foto: ')+x.message, kind: 'error'});
          }
        };
        img.onerror=function(){window.MaestroDialog.alert({title: 'Error', message: typeof _t === 'function' ? _t('profile_image_read_error', 'No se pudo leer la imagen. Intenta con otra.') : 'No se pudo leer la imagen. Intenta con otra.', kind: 'error'});};
        img.src=e.target.result;
      };
      reader.onerror=function(){window.MaestroDialog.alert({title: 'Error', message: typeof _t === 'function' ? _t('profile_file_read_error', 'Error leyendo el archivo. Intenta de nuevo.') : 'Error leyendo el archivo. Intenta de nuevo.', kind: 'error'});};
      reader.readAsDataURL(file);
      
      // Reset input for next selection
      i.value = '';
    }
    // Helper to apply profile photo to all avatar elements
    function _applyProfilePhoto(dataUrl) {
      if (!dataUrl) return;
      var img = document.getElementById('profilePhotoImg');
      var emoji = document.getElementById('profileAvatarEmoji');
      if (img) { img.src = dataUrl; img.style.display = 'block'; }
      if (emoji) { emoji.style.display = 'none'; }
      // Also update dashboard avatar
      var dashImg = document.getElementById('dashProfilePhoto');
      var dashInit = document.getElementById('dashProfileInitial');
      if (dashImg) { dashImg.src = dataUrl; dashImg.style.display = 'block'; }
      if (dashInit) { dashInit.style.display = 'none'; }
    }

    document.addEventListener("DOMContentLoaded",function(){
      setTimeout(function(){
        // Cargar foto de perfil al iniciar
        var emailKey = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || 'default';
        var p = localStorage.getItem('maestroac_photo_' + emailKey);
        if (!p) p = localStorage.getItem('maestroac_photo_default');
        if (p) {
          _applyProfilePhoto(p);
        } else if (typeof supabaseClient !== 'undefined' && supabaseClient && emailKey && emailKey !== 'default') {
          // Fallback: load photo from Supabase if not in localStorage
          usersDataSelf('get_self', { email: emailKey, fields: ['photo_url'] })
            .then(function(res) {
              if (res.data && res.data.photo_url) {
                var photoUrl = res.data.photo_url;
                _applyProfilePhoto(photoUrl);
                // Cache locally for next time
                localStorage.setItem('maestroac_photo_' + emailKey, photoUrl);
                localStorage.setItem('maestroac_photo_default', photoUrl);
                console.log('[Profile] Photo restored from Supabase');
              }
            }).catch(function(e) { console.log('[Profile] Photo load from Supabase error:', e); });
        }
      }, 500);
      
      // Initialize study limit system
      // initStudyLimitSystem(); // DISABLED - break timer was activating without activity
      // Clean up any existing break data
      localStorage.removeItem('maestroac_break_until');
      localStorage.removeItem('maestroac_study_start');
      localStorage.removeItem('maestroac_warned_50');
      localStorage.removeItem('maestroac_warned_55');
      
      // Initialize anti-screenshot protection
      // initAntiScreenshot(); // DESACTIVADO
    });

    // ============================================
    // STUDY LIMIT SYSTEM - 1 hour study, 1 hour break
    // ============================================
    let studyStartTime = null;
    let studyTimerInterval = null;
    let isOnBreak = false;
    let breakEndTime = null;
    const STUDY_LIMIT_MINUTES = 240; // 4 hour study session limit
    const BREAK_DURATION_MINUTES = 15; // 15 minute break

    function initStudyLimitSystem() {
      // Check if user is currently on break
      var breakData = localStorage.getItem('maestroac_break_until');
      if (breakData) {
        var breakUntil = new Date(breakData);
        if (new Date() < breakUntil) {
          isOnBreak = true;
          breakEndTime = breakUntil;
          showBreakScreen();
        } else {
          // Break is over, clear it
          localStorage.removeItem('maestroac_break_until');
          localStorage.removeItem('maestroac_study_start');
        }
      }
      
      // Load study start time if exists
      var savedStart = localStorage.getItem('maestroac_study_start');
      if (savedStart && !isOnBreak) {
        studyStartTime = new Date(savedStart);
        startStudyTimer();
      }
    }

    function startStudySession() {
      // DISABLED - break timer was activating without user activity
      return true;
      /*
      if (isOnBreak) {
        showBreakScreen();
        return false;
      }
      
      if (!studyStartTime) {
        studyStartTime = new Date();
        localStorage.setItem('maestroac_study_start', studyStartTime.toISOString());
        startStudyTimer();
      }
      return true;
      */
    }

    function startStudyTimer() {
      if (studyTimerInterval) clearInterval(studyTimerInterval);
      
      studyTimerInterval = setInterval(function() {
        if (!studyStartTime || isOnBreak) return;
        
        var now = new Date();
        var minutesStudied = Math.floor((now - studyStartTime) / 60000);
        
        // Update study time indicator if exists
        var indicator = document.getElementById('studyTimeIndicator');
        if (indicator) {
          var remaining = STUDY_LIMIT_MINUTES - minutesStudied;
          if (remaining > 0) {
            indicator.textContent = remaining + ' ' + (typeof _t === 'function' ? _t('profile_min_remaining', 'min restantes') : 'min restantes');
            indicator.style.color = remaining <= 10 ? '#e74c3c' : '#27ae60';
          }
        }
        
        // Check if limit reached
        if (minutesStudied >= STUDY_LIMIT_MINUTES) {
          enforceBreak();
        }
        
        // Warning at 50 minutes
        if (minutesStudied === 50 && !localStorage.getItem('maestroac_warned_50')) {
          localStorage.setItem('maestroac_warned_50', 'true');
          showStudyWarning(10);
        }
        
        // Warning at 55 minutes
        if (minutesStudied === 55 && !localStorage.getItem('maestroac_warned_55')) {
          localStorage.setItem('maestroac_warned_55', 'true');
          showStudyWarning(5);
        }
      }, 30000); // Check every 30 seconds
    }

    function showStudyWarning(minutesLeft) {
      var warning = document.createElement('div');
      warning.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#f39c12,#e67e22);color:white;padding:15px 25px;border-radius:12px;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;animation:slideDown 0.3s cubic-bezier(0.32,0.72,0,1);';
      warning.innerHTML = '<strong>⏰ ' + (typeof _t === 'function' ? _t('profile_break_notice', 'Aviso de Descanso') : 'Aviso de Descanso') + '</strong><br><span style="font-size:14px;">' + (typeof _t === 'function' ? _t('profile_minutes_left', 'Te quedan ') : 'Te quedan ') + minutesLeft + (typeof _t === 'function' ? _t('profile_before_break', ' minutos antes del descanso obligatorio') : ' minutos antes del descanso obligatorio') + '</span>';
      document.body.appendChild(warning);
      
      setTimeout(function() {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.5s';
        setTimeout(function() { warning.remove(); }, 500);
      }, 5000);
    }

    function enforceBreak() {
      isOnBreak = true;
      breakEndTime = new Date(Date.now() + BREAK_DURATION_MINUTES * 60000);
      localStorage.setItem('maestroac_break_until', breakEndTime.toISOString());
      localStorage.removeItem('maestroac_study_start');
      localStorage.removeItem('maestroac_warned_50');
      localStorage.removeItem('maestroac_warned_55');
      studyStartTime = null;
      
      if (studyTimerInterval) {
        clearInterval(studyTimerInterval);
        studyTimerInterval = null;
      }
      
      showBreakScreen();
    }

    function showBreakScreen() {
      // Remove existing break screen if any
      var existing = document.getElementById('breakScreen');
      if (existing) existing.remove();
      
      var breakScreen = document.createElement('div');
      breakScreen.id = 'breakScreen';
      breakScreen.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;padding:20px;text-align:center;';
      
      breakScreen.innerHTML = '<div style="max-width:400px;"><div style="font-size:80px;margin-bottom:20px;">☕</div><h1 style="color:#f39c12;font-size:28px;margin-bottom:15px;">' + _tc('profile_break_title', 'Tiempo de Descanso') + '</h1><p style="color:#94a3b8;font-size:16px;margin-bottom:30px;">' + _tc('profile_break_message', 'Has estudiado por un buen rato. Tu cerebro necesita descansar para absorber mejor la informacion.') + '</p><div style="background:rgba(243,156,18,0.1);border:2px solid #f39c12;border-radius:15px;padding:25px;margin-bottom:25px;"><p style="color:#f39c12;font-size:14px;margin-bottom:10px;">' + _tc('profile_time_remaining', 'Tiempo restante de descanso:') + '</p><div id="breakCountdown" style="color:white;font-size:48px;font-weight:bold;">60:00</div></div><div style="color:#64748b;font-size:14px;"><p style="margin-bottom:10px;">' + _tc('profile_break_suggestions', '💡 Sugerencias durante tu descanso:') + '</p><ul style="text-align:left;list-style:none;padding:0;"><li style="margin:8px 0;">' + _tc('profile_suggestion_walk', '🚶 Camina un poco') + '</li><li style="margin:8px 0;">' + _tc('profile_suggestion_water', '💧 Toma agua') + '</li><li style="margin:8px 0;">' + _tc('profile_suggestion_eyes', '👀 Descansa la vista') + '</li><li style="margin:8px 0;">' + _tc('profile_suggestion_food', '🍎 Come algo saludable') + '</li></ul></div><p style="color:#4a5568;font-size:12px;margin-top:25px;">' + _tc('profile_measure_quote', 'Si no mides, estas adivinando 📏') + '<br>- Maestro Mario</p></div>';
      
      document.body.appendChild(breakScreen);
      
      // Start countdown
      updateBreakCountdown();
      var countdownInterval = setInterval(function() {
        if (!isOnBreak || !breakEndTime) {
          clearInterval(countdownInterval);
          return;
        }
        
        var now = new Date();
        if (now >= breakEndTime) {
          // Break is over
          isOnBreak = false;
          localStorage.removeItem('maestroac_break_until');
          breakScreen.remove();
          clearInterval(countdownInterval);
          
          // Show welcome back message
          if (window.showToast) { window.showToast(typeof _t === 'function' ? _t('profile_welcome_back', '¡Bienvenido de vuelta! 🎉 Tu descanso ha terminado.') : '¡Bienvenido de vuelta! 🎉 Tu descanso ha terminado.', 'success'); } else { window.MaestroDialog.alert({title: '', message: typeof _t === 'function' ? _t('profile_welcome_back', '¡Bienvenido de vuelta! 🎉\n\nTu descanso ha terminado. Puedes continuar estudiando.') : '¡Bienvenido de vuelta! 🎉\n\nTu descanso ha terminado. Puedes continuar estudiando.', kind: 'success'}); }
        } else {
          updateBreakCountdown();
        }
      }, 1000);
    }

    function updateBreakCountdown() {
      var countdown = document.getElementById('breakCountdown');
      if (!countdown || !breakEndTime) return;
      
      var now = new Date();
      var remaining = Math.max(0, breakEndTime - now);
      var minutes = Math.floor(remaining / 60000);
      var seconds = Math.floor((remaining % 60000) / 1000);
      
      countdown.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    // ============================================
    // ANTI-SCREENSHOT PROTECTION
    // ============================================
    function initAntiScreenshot() {
      // CSS to prevent screenshots - hide content during capture
      var style = document.createElement('style');
      style.textContent = '@media print { body { display: none !important; } } .protected-content { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }';
      document.head.appendChild(style);
      
      // Detect PrintScreen key
      document.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
          blackoutScreen();
          showScreenshotWarning();
        }
      });
      
      // Detect keyboard shortcuts for screenshots
      document.addEventListener('keydown', function(e) {
        // Windows: Win+Shift+S, Win+PrtScn
        // Mac: Cmd+Shift+3, Cmd+Shift+4
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === 's' || e.key === 'S')) {
          e.preventDefault();
          blackoutScreen();
          showScreenshotWarning();
        }
        // PrtScn variations
        if (e.keyCode === 44 || e.key === 'PrintScreen') {
          e.preventDefault();
          blackoutScreen();
          showScreenshotWarning();
        }
      });
      
      // Detect visibility change (some screenshot tools trigger this)
      var lastHidden = 0;
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          lastHidden = Date.now();
        } else {
          // If hidden for very short time (< 500ms), might be screenshot
          if (Date.now() - lastHidden < 500) {
            // Possibly a screenshot, but don't be too aggressive
          }
        }
      });
      
      // Blur sensitive content when window loses focus (helps with some tools)
      window.addEventListener('blur', function() {
        document.body.classList.add('window-blurred');
      });
      
      window.addEventListener('focus', function() {
        document.body.classList.remove('window-blurred');
      });
      
      // Add blur style
      var blurStyle = document.createElement('style');
      blurStyle.textContent = '.window-blurred .card, .window-blurred .question-text, .window-blurred .option { filter: blur(5px); transition: filter 0.2s; }';
      document.head.appendChild(blurStyle);
      
      // Disable right-click context menu
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showScreenshotWarning();
      });
      
      // Disable drag
      document.addEventListener('dragstart', function(e) {
        e.preventDefault();
      });
    }

    function blackoutScreen() {
      var blackout = document.createElement('div');
      blackout.id = 'screenshotBlackout';
      blackout.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:999999;';
      document.body.appendChild(blackout);
      
      // Remove after short delay
      setTimeout(function() {
        var el = document.getElementById('screenshotBlackout');
        if (el) el.remove();
      }, 1000);
      
      // Also clear clipboard if possible
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('Screenshots no permitidos - ACVOLT Tech School').catch(function() {});
      }
    }

    function showScreenshotWarning() {
      var warning = document.createElement('div');
      warning.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#e74c3c,#c0392b);color:white;padding:30px 40px;border-radius:15px;z-index:1000000;box-shadow:0 10px 40px rgba(0,0,0,0.5);text-align:center;animation:shake 0.5s ease;';
      warning.innerHTML = '<div style="font-size:50px;margin-bottom:15px;">🚫</div><h2 style="margin-bottom:10px;">' + _tc('profile_screenshots_title', 'Screenshots No Permitidos') + '</h2><p style="font-size:14px;opacity:0.9;">' + _tc('profile_content_protected', 'El contenido de esta app esta protegido.<br>Por favor estudia directamente en la aplicacion.') + '</p>';
      document.body.appendChild(warning);
      
      // Add shake animation
      var shakeStyle = document.createElement('style');
      shakeStyle.textContent = '@keyframes shake { 0%, 100% { transform: translate(-50%,-50%) rotate(0); } 25% { transform: translate(-50%,-50%) rotate(-5deg); } 75% { transform: translate(-50%,-50%) rotate(5deg); } }';
      document.head.appendChild(shakeStyle);
      
      setTimeout(function() {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.5s';
        setTimeout(function() { warning.remove(); }, 500);
      }, 3000);
    }


    function showProfile(fromScreen) {
      profilePreviousScreen = fromScreen;
      renderProfile();
      showScreen('miPerfilScreen');
    }

    function goBackFromProfile() {
      showScreen(profilePreviousScreen);
    }

    function renderProfile() {
      const profileContent = document.getElementById('profileContent');
      const noProfileContent = document.getElementById('noProfileContent');

      if (!currentUser) {
        profileContent.style.display = 'none';
        noProfileContent.style.display = 'block';
        return;
      }

      profileContent.style.display = 'block';
      noProfileContent.style.display = 'none';

      // Update profile fields (with null checks)
      var _pf = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
      _pf('profileNombre', currentUser.nombre || '-');
      _pf('profileEmail', currentUser.email || '-');
      _pf('profileTelefono', currentUser.telefono || '-');
      _pf('profileCiudad', currentUser.ciudad || '-');
      _pf('profileEstado', currentUser.estado || '-');
      _pf('profileExperiencia', currentUser.experiencia || '-');
      _pf('profileEPA', currentUser.epa || (typeof _t === 'function' ? _t('profile_not_registered', 'No registrado') : 'No registrado'));
      _pf('profileOSHA', currentUser.osha || (typeof _t === 'function' ? _t('profile_not_registered', 'No registrado') : 'No registrado'));
      _pf('profileHVACE', currentUser.hvace || (typeof _t === 'function' ? _t('profile_not_registered', 'No registrado') : 'No registrado'));

      // Update technician number section
      updateTechnicianNumberDisplay();
      
      // Update credential section
      renderCredentialSection();
      
      // Update avatar and badge based on completed levels
      updateProfileAvatarAndBadge();
    }

    // Calculate user's level based on completed quizzes (80% or higher)
    // ===== EDIT PROFILE FUNCTIONS =====
    function toggleEditProfile() {
      var viewMode = document.getElementById('profileViewMode');
      var editMode = document.getElementById('profileEditMode');
      var btn = document.getElementById('btnEditProfile');
      
      if (editMode.style.display === 'none') {
        // Switch to edit mode - populate fields
        var user = currentUser || JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        document.getElementById('editNombre').value = user.nombre || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editTelefono').value = user.telefono || '';
        document.getElementById('editCiudad').value = user.ciudad || '';
        document.getElementById('editEstado').value = user.estado || '';
        document.getElementById('editExperiencia').value = user.experiencia || '';
        document.getElementById('editEPA').value = user.epa || '';
        document.getElementById('editOSHA').value = user.osha || '';
        document.getElementById('editHVACE').value = user.hvace || '';
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
        btn.innerHTML = '👁️ Ver';
        btn.style.background = 'linear-gradient(135deg,#e67e22,#d35400)';
        // Focus first empty required field
        var fields = ['editNombre','editEmail','editTelefono','editCiudad','editEstado'];
        for (var i = 0; i < fields.length; i++) {
          if (!document.getElementById(fields[i]).value.trim()) {
            document.getElementById(fields[i]).focus();
            break;
          }
        }
      } else {
        cancelEditProfile();
      }
    }

    function saveProfileEdits() {
      var nombre = document.getElementById('editNombre').value.trim();
      var email = document.getElementById('editEmail').value.trim();
      var telefono = document.getElementById('editTelefono').value.trim();
      var ciudad = document.getElementById('editCiudad').value.trim();
      var estado = document.getElementById('editEstado').value.trim();
      var experiencia = document.getElementById('editExperiencia').value;
      var epa = document.getElementById('editEPA').value.trim();
      var osha = document.getElementById('editOSHA').value.trim();
      var hvace = document.getElementById('editHVACE').value.trim();
      var msgDiv = document.getElementById('editProfileMsg');

      // Validate
      var errors = [];
      if (!nombre || nombre.length < 3) errors.push(typeof _t === 'function' ? _t('profile_val_name', 'Nombre (mínimo 3 caracteres)') : 'Nombre (mínimo 3 caracteres)');
      if (!email || !email.includes('@')) errors.push(typeof _t === 'function' ? _t('profile_val_email', 'Email válido') : 'Email válido');
      if (!telefono || telefono.length < 7) errors.push(typeof _t === 'function' ? _t('profile_val_phone', 'Teléfono (mínimo 7 dígitos)') : 'Teléfono (mínimo 7 dígitos)');
      if (!ciudad || ciudad.length < 2) errors.push(typeof _t === 'function' ? _t('profile_val_city', 'Ciudad') : 'Ciudad');
      if (!estado || estado.length < 2) errors.push(typeof _t === 'function' ? _t('profile_val_state', 'Estado') : 'Estado');

      if (errors.length > 0) {
        msgDiv.style.display = 'block';
        msgDiv.style.background = 'rgba(231,76,60,0.15)';
        msgDiv.style.color = '#e74c3c';
        msgDiv.innerHTML = '⚠️ Completa: <strong>' + _escHtml(errors.join(', ')) + '</strong>';
        return;
      }

      // Update currentUser
      if (!currentUser) currentUser = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      currentUser.nombre = nombre;
      currentUser.email = email;
      currentUser.telefono = telefono;
      currentUser.ciudad = ciudad;
      currentUser.estado = estado;
      currentUser.experiencia = experiencia;
      currentUser.epa = epa;
      currentUser.osha = osha;
      currentUser.hvace = hvace;

      // Save to localStorage
      localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
      localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));

      // Save all profile fields to Supabase
      try {
        if (supabaseClient) {
          usersDataSelf('upsert_self', {
            email: email,
            data: {
              nombre: nombre,
              telefono: telefono,
              ciudad: ciudad,
              estado: estado,
              experiencia: experiencia,
              ultimo_acceso: new Date().toISOString()
            }
          }).then(function(result) {
            if (result && result.error) {
              console.error('[MaestroAC] Profile save error:', result.error.message || result.error);
              var _pT = (typeof window._t === 'function') ? window._t : function(k, fb) { return fb || k; };
              window.MaestroDialog.alert({title: _pT('err_generic', 'Error'), message: _pT('profile_save_error', 'Error guardando perfil') + ': ' + (result.error.message || _pT('err_unknown', 'Error desconocido')), kind: 'error'});
            } else {
              console.log('[MaestroAC] Profile saved to Supabase successfully');
            }
          }).catch(function(e) { console.error('[MaestroAC] Profile upsert failed:', e); });
        }
      } catch(e) {
        console.warn('Profile save failed:', e);
      }

      // Update greeting
      var greetingEl = document.getElementById('userGreeting');
      if (greetingEl) greetingEl.textContent = (typeof _t === 'function' ? _t('hi_greeting') : 'Hola') + ', ' + (currentUser.nombre || (typeof _t === 'function' ? _t('student') : 'Estudiante')).split(' ')[0];

      // Update dashboard avatar initial with new name
      var dashInitial = document.getElementById('dashProfileInitial');
      var dashPhoto = document.getElementById('dashProfilePhoto');
      if (dashInitial && (!dashPhoto || dashPhoto.style.display === 'none')) {
        dashInitial.textContent = nombre ? nombre.charAt(0).toUpperCase() : '👤';
      }

      // Show success message
      msgDiv.style.display = 'block';
      msgDiv.style.background = 'rgba(39,174,96,0.15)';
      msgDiv.style.color = '#27ae60';
      msgDiv.innerHTML = '✅ ' + (typeof _t === 'function' ? _t('profile_updated', '¡Perfil actualizado exitosamente!') : '¡Perfil actualizado exitosamente!');

      // Check if this is a new user completing profile
      var isNewUser = localStorage.getItem('maestroac_new_user') === 'true';

      // Switch back to view mode after a moment
      setTimeout(function() {
        cancelEditProfile();
        renderProfile();
        addNotification('profile_update', '✅ Perfil actualizado correctamente', '👤');
        showNotifBell();

        // Show check-in prompt for new users
        if (isNewUser) {
          localStorage.removeItem('maestroac_new_user');
          showNewUserCheckinPrompt();
        }
      }, 1200);
    }

    function cancelEditProfile() {
      document.getElementById('profileViewMode').style.display = 'block';
      document.getElementById('profileEditMode').style.display = 'none';
      document.getElementById('editProfileMsg').style.display = 'none';
      var btn = document.getElementById('btnEditProfile');
      btn.innerHTML = '✏️ Editar';
      btn.style.background = 'linear-gradient(135deg,#3498db,#2980b9)';
    }

    // Open profile in edit mode directly (called from requestAccessCode)
    function openProfileForEdit() {
      showProfile('levelsScreen');
      setTimeout(function() {
        toggleEditProfile();
      }, 300);
    }
    // ===== NEW USER CHECK-IN PROMPT =====
    function showNewUserCheckinPrompt() {
      var modal = document.createElement('div');
      modal.id = 'newUserCheckinModal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.4s cubic-bezier(0.32,0.72,0,1);';
      modal.innerHTML = '<div style="background:linear-gradient(135deg,#0d1117,#1a1a2e);border-radius:24px;padding:35px 25px;max-width:400px;width:100%;text-align:center;border:2px solid #27ae60;box-shadow:0 0 40px rgba(39,174,96,0.3);">' +
        '<div style="font-size:60px;margin-bottom:15px;">🎉</div>' +
        '<h2 style="color:#27ae60;margin-bottom:8px;font-size:24px;font-weight:800;">' + (typeof _t === 'function' ? _t('profile_complete', '¡Perfil Completo!') : '¡Perfil Completo!') + '</h2>' +
        '<p style="color:#94a3b8;font-size:14px;margin-bottom:25px;">' + (typeof _t === 'function' ? _t('profile_checkin_prompt', 'Tu cuenta está lista. Haz tu primer check-in para registrar tu asistencia.') : 'Tu cuenta está lista. Haz tu primer check-in para registrar tu asistencia.') + '</p>' +
        '<button onclick="document.getElementById(\'newUserCheckinModal\').remove();showScreen(\'attendanceScreen\');" style="background:linear-gradient(135deg,#27ae60,#2ecc71);color:white;border:none;padding:18px 30px;border-radius:14px;font-size:18px;font-weight:bold;cursor:pointer;width:100%;margin-bottom:12px;box-shadow:0 4px 20px rgba(39,174,96,0.4);transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.03)\'" onmouseout="this.style.transform=\'none\'">HACER CHECK-IN AHORA</button>' +
        '<button onclick="document.getElementById(\'newUserCheckinModal\').remove();showScreen(\'dashboardScreen\');" style="background:transparent;color:#64748b;border:1px solid #334155;padding:12px 20px;border-radius:10px;font-size:14px;cursor:pointer;width:100%;">Ir al Menú Principal</button>' +
        '</div>';
      document.body.appendChild(modal);
    }
    // ===== END EDIT PROFILE FUNCTIONS =====

    function getUserCompletedLevels() {
      const levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      const completedLevels = [];

      levelOrder.forEach(levelId => {
        if (!progress[levelId]) return;
        const levelProgress = progress[levelId];
        if (levelProgress.completed > 0) {
          const percentage = Math.round((levelProgress.score / levelProgress.completed) * 100);
          if (percentage >= 80) {
            completedLevels.push(levelId);
          }
        }
      });

      return completedLevels;
    }

    // Get user's highest completed level
    function getUserHighestLevel() {
      const levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      const completedLevels = getUserCompletedLevels();
      
      if (completedLevels.length === 0) return 'nuevo';
      
      // Return the highest level completed
      for (let i = levelOrder.length - 1; i >= 0; i--) {
        if (completedLevels.includes(levelOrder[i])) {
          return levelOrder[i];
        }
      }
      
      return 'nuevo';
    }

    // Update avatar and badge display
    function updateProfileAvatarAndBadge() {
      var _pt = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
      const levelData = {
        nuevo: {
          avatar: '👤',
          badge: '🔰',
          title: _pt('profile_level_nuevo', 'Técnico Nuevo'),
          subtitle: _pt('profile_level_nuevo_sub', 'Completa tu primer nivel para avanzar'),
          avatarClass: 'nivel-nuevo',
          badgeClass: 'badge-nuevo',
          titleClass: 'titulo-nuevo',
          progressClass: 'progress-nuevo'
        },
        principiante: {
          avatar: '🔧',
          badge: '🌱',
          title: _pt('profile_level_principiante', 'Técnico Principiante'),
          subtitle: _pt('profile_level_principiante_sub', 'Dominaste los fundamentos HVAC'),
          avatarClass: 'nivel-principiante',
          badgeClass: 'badge-principiante',
          titleClass: 'titulo-principiante',
          progressClass: 'progress-principiante'
        },
        intermedio: {
          avatar: '⚙️',
          badge: '📘',
          title: _pt('profile_level_intermedio', 'Técnico Intermedio'),
          subtitle: _pt('profile_level_intermedio_sub', 'Conocimientos sólidos en diagnóstico'),
          avatarClass: 'nivel-intermedio',
          badgeClass: 'badge-intermedio',
          titleClass: 'titulo-intermedio',
          progressClass: 'progress-intermedio'
        },
        avanzado: {
          avatar: '🛠️',
          badge: '⚡',
          title: _pt('profile_level_avanzado', 'Técnico Avanzado'),
          subtitle: _pt('profile_level_avanzado_sub', 'Experto en sistemas complejos'),
          avatarClass: 'nivel-avanzado',
          badgeClass: 'badge-avanzado',
          titleClass: 'titulo-avanzado',
          progressClass: 'progress-avanzado'
        },
        elite: {
          avatar: '🏆',
          badge: '🏆',
          title: _pt('profile_level_elite', 'Técnico Elite'),
          subtitle: _pt('profile_level_elite_sub', 'Maestro supervisor con 10+ años de experiencia'),
          avatarClass: 'nivel-elite',
          badgeClass: 'badge-elite',
          titleClass: 'titulo-elite',
          progressClass: 'progress-elite'
        },
        platino: {
          avatar: '💎',
          badge: '💎',
          title: _pt('profile_level_platino', 'Técnico Platino'),
          subtitle: _pt('profile_level_platino_sub', '¡Máximo nivel alcanzado! Maestro Total HVACR'),
          avatarClass: 'nivel-platino',
          badgeClass: 'badge-platino',
          titleClass: 'titulo-platino',
          progressClass: 'progress-platino'
        }
      };

      const highestLevel = getUserHighestLevel();
      const completedLevels = getUserCompletedLevels();
      const data = levelData[highestLevel];
      
      // Update avatar - preserve photo if exists
      const avatar = document.getElementById('profileAvatar');
      avatar.className = 'profile-avatar ' + data.avatarClass;
      
      // Only update emoji, don't replace entire content (preserve photo img)
      const emojiSpan = document.getElementById('profileAvatarEmoji');
      if (emojiSpan) {
        emojiSpan.textContent = data.avatar;
      }
      
      // Check if user has photo and show/hide emoji accordingly
      var emailKey = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || 'default';
      var savedPhoto = localStorage.getItem('maestroac_photo_' + emailKey);
      if (!savedPhoto) savedPhoto = localStorage.getItem('maestroac_photo_default');
      
      var photoImg = document.getElementById('profilePhotoImg');
      if (savedPhoto && photoImg) {
        photoImg.src = savedPhoto;
        photoImg.style.display = 'block';
        if (emojiSpan) emojiSpan.style.display = 'none';
      } else {
        if (photoImg) photoImg.style.display = 'none';
        if (emojiSpan) emojiSpan.style.display = 'block';
      }
      
      // Update badge
      const badge = document.getElementById('profileBadge');
      badge.className = 'profile-badge ' + data.badgeClass;
      badge.textContent = data.badge;
      
      // Update title
      const title = document.getElementById('profileLevelTitle');
      title.className = 'profile-level-title ' + data.titleClass;
      title.textContent = data.title;
      
      // Update subtitle
      document.getElementById('profileLevelSubtitle').textContent = data.subtitle;
      
      // Update progress bar
      const progressPercent = (completedLevels.length / 5) * 100;
      const progressFill = document.getElementById('profileProgressFill');
      progressFill.className = 'profile-progress-fill ' + data.progressClass;
      progressFill.style.width = progressPercent + '%';
      
      // Update progress text
      document.getElementById('profileProgressText').textContent =
        completedLevels.length + '/5 ' + (typeof _t === 'function' ? _t('profile_levels_completed', 'niveles completados') : 'niveles completados');
      
      // Update mini badges
      const badgeMap = {
        principiante: 'miniBadgePrincipiante',
        intermedio: 'miniBadgeIntermedio',
        avanzado: 'miniBadgeAvanzado',
        elite: 'miniBadgeElite',
        platino: 'miniBadgePlatino'
      };
      
      Object.keys(badgeMap).forEach(level => {
        const miniBadge = document.getElementById(badgeMap[level]);
        if (completedLevels.includes(level)) {
          miniBadge.classList.add('earned');
        } else {
          miniBadge.classList.remove('earned');
        }
      });
    }

    async function updateTechnicianNumberDisplay() {
      const displaySection = document.getElementById('technicianNumberDisplay');
      const generatorSection = document.getElementById('technicianNumberGenerator');

      // Restore technicianNumber from multiple sources
      if (currentUser && !currentUser.technicianNumber) {
        // Try email-specific key first
        if (currentUser.email) {
          var emailNumber = localStorage.getItem('tecnico_number_' + currentUser.email);
          if (emailNumber) {
            currentUser.technicianNumber = emailNumber;
            currentUser.technicianNumberDate = localStorage.getItem('tecnico_number_date_' + currentUser.email) || 'Fecha guardada';
          }
        }
        // Try general key
        if (!currentUser.technicianNumber) {
          var generalNumber = localStorage.getItem('tecnico_number');
          if (generalNumber) {
            currentUser.technicianNumber = generalNumber;
            currentUser.technicianNumberDate = localStorage.getItem('tecnico_number_date') || 'Fecha guardada';
          }
        }
        // Try tecnico_user
        if (!currentUser.technicianNumber) {
          try {
            var saved = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
            if (saved.technicianNumber) {
              currentUser.technicianNumber = saved.technicianNumber;
              currentUser.technicianNumberDate = saved.technicianNumberDate;
            }
          } catch(e) { console.warn('[Profile]', e.message || e); }
        }
        // Try backup
        if (!currentUser.technicianNumber) {
          try {
            var backup = JSON.parse(localStorage.getItem('tecnico_user_backup') || '{}');
            if (backup.technicianNumber) {
              currentUser.technicianNumber = backup.technicianNumber;
              currentUser.technicianNumberDate = backup.technicianNumberDate;
            }
          } catch(e) { console.warn('[Profile]', e.message || e); }
        }
        // Try loading from Supabase if still not found
        if (!currentUser.technicianNumber && supabaseClient && currentUser.email) {
          try {
            var _ud_techRows = await usersDataSelf('get_self', { email: currentUser.email, fields: ['technician_number','technician_number_date'] }); var techRows = _ud_techRows.data ? [_ud_techRows.data] : [];
            var techData = techRows && techRows.length > 0 ? techRows[0] : null;
            if (techData && techData.technician_number) {
              currentUser.technicianNumber = techData.technician_number;
              currentUser.technicianNumberDate = techData.technician_number_date || 'Fecha de Supabase';
              // Save locally for faster access next time
              localStorage.setItem('tecnico_number_' + currentUser.email, techData.technician_number);
              localStorage.setItem('tecnico_number_date_' + currentUser.email, currentUser.technicianNumberDate);
              localStorage.setItem('tecnico_number', techData.technician_number);
            }
          } catch(e) { console.log('Error loading tech number from Supabase:', e); }
        }
      }

      if (currentUser && currentUser.technicianNumber) {
        displaySection.style.display = 'block';
        generatorSection.style.display = 'none';
        document.getElementById('technicianNumberValue').textContent = currentUser.technicianNumber;
        document.getElementById('technicianNumberDate').textContent = (typeof _t === 'function' ? _t('profile_generated', 'Generado: ') : 'Generado: ') + (currentUser.technicianNumberDate || (typeof _t === 'function' ? _t('profile_date_saved', 'Fecha guardada') : 'Fecha guardada'));
        // Ensure it stays saved
        if (currentUser.email) {
          localStorage.setItem('tecnico_number_' + currentUser.email, currentUser.technicianNumber);
        }
      } else {
        displaySection.style.display = 'none';
        generatorSection.style.display = 'block';
      }
    }

    // ===== STUDENT ID SYSTEM =====
    function generateStudentId() {
      const year = new Date().getFullYear();
      const seq = Math.floor(1000 + Math.random() * 9000); // 4-digit random
      return 'ACVOLT-' + year + '-' + seq;
    }
    
    async function ensureStudentId() {
      if (currentUser && !currentUser.studentId) {
        // Try to restore from localStorage before generating new
        try {
          var saved = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
          if (saved.studentId) {
            currentUser.studentId = saved.studentId;
            currentUser.studentIdDate = saved.studentIdDate;
            return;
          }
          saved = JSON.parse(localStorage.getItem('tecnico_user_backup') || '{}');
          if (saved.studentId) {
            currentUser.studentId = saved.studentId;
            currentUser.studentIdDate = saved.studentIdDate;
            return;
          }
        } catch(e) { console.warn('[Profile]', e.message || e); }
        // Try Supabase before generating new
        if (typeof supabaseClient !== 'undefined' && supabaseClient && currentUser.email) {
          try {
            var _sidRes = await usersDataSelf('get_self', { email: currentUser.email, fields: ['student_id','student_id_date'] }); _sidRes = { data: _sidRes.data ? [_sidRes.data] : [] };
            if (_sidRes.data && _sidRes.data[0] && _sidRes.data[0].student_id) {
              currentUser.studentId = _sidRes.data[0].student_id;
              currentUser.studentIdDate = _sidRes.data[0].student_id_date || '';
              localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
              localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
              return;
            }
          } catch(e) { console.log('[Profile] Student ID Supabase load:', e); }
        }
        // Only generate new if truly not saved anywhere
        currentUser.studentId = generateStudentId();
        currentUser.studentIdDate = new Date().toISOString();
        localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
        localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
        // Save to Supabase so it persists across devices/reinstalls
        if (typeof supabaseClient !== 'undefined' && supabaseClient && currentUser.email) {
          usersDataSelf('upsert_self', {
            email: currentUser.email,
            data: { student_id: currentUser.studentId, student_id_date: currentUser.studentIdDate }
          }).then(function(r) {
            if (r.error) console.error('[Profile] Student ID save error:', r.error.message);
            else console.log('[Profile] Student ID saved to Supabase:', currentUser.studentId);
          }).catch(function(e) { console.error('[Profile] Student ID save exception:', e); });
        }
      }
    }
    
    function renderCredentialSection() {
      const container = document.getElementById('credentialSection');
      if (!container || !currentUser) return;
      
      ensureStudentId();
      const idPurchased = _isAppStore() ? 'true' : localStorage.getItem('maestroac_id_purchased_' + (currentUser.email || ''));
      const nombre = _escHtml(currentUser.nombre || 'Técnico HVAC');
      const studentId = _escHtml(currentUser.studentId || 'N/A');
      const techNumber = _escHtml(currentUser.technicianNumber || localStorage.getItem('tecnico_number') || (typeof _t === 'function' ? _t('profile_not_assigned', 'No asignado') : 'No asignado'));
      const registroDate = _escHtml(currentUser.studentIdDate ? new Date(currentUser.studentIdDate).toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' }) : new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' }));
      
      container.innerHTML = `
        <!-- ID Card Preview -->
        <div style="background:linear-gradient(135deg,#1a237e,#0d47a1);border-radius:16px;padding:20px;color:white;position:relative;overflow:hidden;max-width:380px;margin:0 auto;box-shadow:0 8px 30px rgba(0,0,0,0.3);">
          <!-- Header -->
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;border-bottom:2px solid rgba(255,215,0,0.4);padding-bottom:12px;">
            <img src="logo.png" alt="ACVOLT" style="width:50px;height:auto;background:white;border-radius:8px;padding:4px;">
            <div>
              <div style="font-size:14px;font-weight:bold;letter-spacing:1px;color:#FFD700;">ACVOLT TECHNICAL SCHOOL</div>
              <div style="font-size:10px;color:rgba(255,255,255,0.7);letter-spacing:1px;">CREDENCIAL DE ESTUDIANTE</div>
            </div>
          </div>
          
          <!-- Photo + Info -->
          <div style="display:flex;gap:15px;align-items:flex-start;">
            <div style="width:80px;height:100px;background:rgba(255,255,255,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0;border:2px solid rgba(255,215,0,0.3);" id="credentialPhotoBox">
              ${getCredentialPhoto()}
            </div>
            <div style="flex:1;">
              <div style="font-size:18px;font-weight:bold;margin-bottom:6px;">${nombre}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:3px;">ID: <span style="color:#FFD700;font-family:monospace;font-weight:bold;font-size:13px;">${studentId}</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:3px;">Técnico #: <span style="color:#2ecc71;font-family:monospace;font-weight:bold;font-size:11px;">${techNumber}</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:3px;">Registro: ${registroDate}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);">San Bernardino, CA</div>
            </div>
          </div>
          
          <!-- Signature -->
          <div style="margin-top:15px;border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;display:flex;justify-content:space-between;align-items:flex-end;">
            <div style="text-align:center;">
              <div id="credentialSignature" style="font-family:'Brush Script MT',cursive;font-size:18px;color:#FFD700;font-style:italic;margin-bottom:2px;">Mario Flores Corona</div>
              <div style="width:140px;border-top:1px solid rgba(255,215,0,0.5);padding-top:3px;font-size:11px;color:rgba(255,255,255,0.92);font-weight:600;">Master Instructor / Director</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;color:rgba(255,255,255,0.88);font-weight:600;">maestrohvacr.com</div>
            </div>
          </div>
          
          ${!idPurchased ? '<div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;border-radius:16px;"><div style="background:rgba(255,215,0,0.15);border:2px solid #FFD700;border-radius:12px;padding:12px 20px;text-align:center;"><div style="font-size:24px;margin-bottom:5px;">🔒</div><div style="color:#FFD700;font-size:13px;font-weight:bold;">Vista Previa</div></div></div>' : ''}
        </div>
        
        <!-- Student ID Display -->
        <div style="text-align:center;margin:15px 0;">
          <p style="color:#57574F;font-size:12px;margin-bottom:5px;">Tu ID de Estudiante:</p>
          <div style="background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(243,156,18,0.1));border:2px solid rgba(255,215,0,0.3);border-radius:12px;padding:12px;display:inline-block;">
            <span style="font-family:monospace;font-size:20px;font-weight:bold;color:#f39c12;letter-spacing:2px;">${studentId}</span>
          </div>
          ${techNumber !== 'No asignado' ? `
          <p style="color:#57574F;font-size:12px;margin-top:10px;margin-bottom:5px;">Tu Número de Técnico:</p>
          <div style="background:linear-gradient(135deg,rgba(46,204,113,0.1),rgba(39,174,96,0.1));border:2px solid rgba(46,204,113,0.3);border-radius:12px;padding:12px;display:inline-block;">
            <span style="font-family:monospace;font-size:16px;font-weight:bold;color:#2ecc71;letter-spacing:1px;">${techNumber}</span>
          </div>
          ` : ''}
        </div>
        
        ${!idPurchased ? `
        <!-- Purchase Button -->
        <div style="background:linear-gradient(135deg,rgba(26,35,126,0.1),rgba(13,71,161,0.1));border:2px solid rgba(99,102,241,0.3);border-radius:16px;padding:20px;text-align:center;margin-top:15px;">
          <p style="color:#6366f1;font-size:15px;font-weight:bold;margin-bottom:5px;">🪪 Obtén tu Credencial Oficial</p>
          <p style="color:#3D3D3A;font-size:13px;margin-bottom:5px;">Credencial física o digital firmada por Mario Flores Corona</p>
          <p style="color:#57574F;font-size:13px;margin-bottom:10px;">${window._lang==='en' ? 'The credential is produced and signed manually by the instructor.' : 'La credencial es producida y firmada manualmente por el instructor.'}</p>
          <a href="https://wa.me/19096390448?text=${encodeURIComponent('Hola, quiero solicitar mi Credencial Oficial de Maestro HVACR. Mi correo: ' + (currentUser ? currentUser.email : ''))}" target="_blank" rel="noopener" style="display:block;width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-align:center;text-decoration:none;margin-bottom:10px;">📱 ${window._lang==='en' ? 'Request via WhatsApp' : 'Solicitar por WhatsApp'}</a>
          <div style="margin-top:10px;">
            <p style="color:#9b59b6;font-size:12px;font-weight:bold;margin-bottom:6px;">🎫 ${window._lang==='en' ? 'Already paid? Enter your code:' : '¿Ya pagaste? Ingresa tu código:'}</p>
            <div style="display:flex;gap:8px;max-width:300px;margin:0 auto;">
              <input type="text" id="idCodeInput" placeholder="${window._lang==='en' ? 'Code' : 'Código'}" maxlength="15" style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);background:#FFFFFF;color:#111111;font-size:16px;text-align:center;letter-spacing:2px;text-transform:uppercase;font-family:monospace;">
              <button onclick="redeemIdCode()" style="padding:10px 16px;border:none;border-radius:10px;font-size:13px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#9b59b6,#8e44ad);color:white;">${window._lang==='en' ? 'Activate' : 'Activar'}</button>
            </div>
            <p id="idCodeMsg" style="color:#e74c3c;font-size:11px;margin-top:4px;display:none;"></p>
          </div>
        </div>
        ` : `
        <div style="text-align:center;margin-top:15px;">
          <div style="background:linear-gradient(135deg,rgba(39,174,96,0.1),rgba(46,204,113,0.1));border:2px solid rgba(39,174,96,0.3);border-radius:12px;padding:15px;">
            <p style="color:#27ae60;font-size:15px;font-weight:bold;">✅ Credencial Oficial Activada</p>
            <p style="color:#57574F;font-size:12px;margin-top:5px;">Tu credencial firmada está lista</p>
          </div>
        </div>
        `}
      `;
    }
    
    function getCredentialPhoto() {
      // Buscar foto en múltiples keys
      let photo = null;
      
      if (currentUser && currentUser.email) {
        photo = localStorage.getItem('maestroac_photo_' + currentUser.email);
      }
      if (!photo) {
        photo = localStorage.getItem('maestroac_photo_' + localStorage.getItem('tecnico_email'));
      }
      if (!photo) {
        photo = localStorage.getItem('maestroac_photo_' + localStorage.getItem('maestroac_email'));
      }
      if (!photo) {
        photo = localStorage.getItem('maestroac_photo_default');
      }
      
      if (photo) {
        return '<img src="' + photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
      }
      return '👤';
    }
    
    async function redeemIdCode() {
      const input = document.getElementById('idCodeInput');
      const msg = document.getElementById('idCodeMsg');
      if (!input || !msg) return;
      const code = input.value.trim().toUpperCase();
      if (!code || code.length < 4) {
        msg.style.display = 'block';
        msg.style.color = '#e74c3c';
        msg.textContent = '❌ ' + (typeof _t === 'function' ? _t('profile_enter_valid_code', 'Ingresa un código válido') : 'Ingresa un código válido');
        return;
      }
      if (!currentUser || !currentUser.email) return;
      // Validate code against Supabase access_codes table
      if (supabaseClient) {
        try {
          var { data, error } = await supabaseClient
            .from('access_codes')
            .select('*')
            .eq('code', code)
            .eq('used', false)
            .limit(1);
          if (!data || data.length === 0) {
            msg.style.display = 'block';
            msg.style.color = '#e74c3c';
            msg.textContent = '❌ ' + (typeof _t === 'function' ? _t('profile_invalid_code', 'Código inválido o ya utilizado') : 'Código inválido o ya utilizado');
            return;
          }
          await supabaseClient.from('access_codes').update({
            used: true, used_at: new Date().toISOString(), used_by: currentUser.email
          }).eq('code', code);
        } catch(e) {
          console.warn('[Profile] access_codes check:', e);
        }
      }
      localStorage.setItem('maestroac_id_purchased_' + currentUser.email, 'true');
      msg.style.display = 'block';
      msg.style.color = '#2ecc71';
      msg.textContent = '✅ ' + (typeof _t === 'function' ? _t('profile_credential_activated', '¡Credencial activada!') : '¡Credencial activada!');
      if (typeof addNotification === 'function') addNotification('payment', _t('prof_credential_activated','🪪 ¡Credencial de estudiante activada! ID: ') + (currentUser.studentId || ''), '🪪');
      setTimeout(() => { renderCredentialSection(); }, 1500);
    }

    function generateTechnicianNumber() {
      if (!currentUser) {
        window.MaestroDialog.alert({title: 'Atención', message: typeof _t === 'function' ? _t('profile_create_first', 'Debes crear un perfil primero para generar tu número de técnico.') : 'Debes crear un perfil primero para generar tu número de técnico.', kind: 'warning'});
        return;
      }

      // Check if already has a technician number (from any storage)
      var existingNumber = currentUser.technicianNumber;
      if (!existingNumber && currentUser.email) {
        existingNumber = localStorage.getItem('tecnico_number_' + currentUser.email);
      }
      if (!existingNumber) {
        existingNumber = localStorage.getItem('tecnico_number');
      }
      
      if (existingNumber) {
        // Restore it to currentUser and display
        currentUser.technicianNumber = existingNumber;
        currentUser.technicianNumberDate = localStorage.getItem('tecnico_number_date_' + (currentUser.email || '')) || localStorage.getItem('tecnico_number_date') || 'Fecha no disponible';
        localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
        updateTechnicianNumberDisplay();
        if (window.showToast) { window.showToast((typeof _t === 'function' ? _t('profile_tech_exists', 'Ya tienes un número de técnico asignado: ') : 'Ya tienes un número de técnico asignado: ') + existingNumber); } else { window.MaestroDialog.alert({title: '', message: (typeof _t === 'function' ? _t('profile_tech_exists', 'Ya tienes un número de técnico asignado: ') : 'Ya tienes un número de técnico asignado: ') + existingNumber, kind: 'info'}); }
        return;
      }

      // Generate unique technician number
      const now = new Date();
      const year = now.getFullYear();

      // Create unique ID based on timestamp and random characters
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

      // Format: TECH-YEAR-N33-RANDOM (e.g., TECH-2026-N33-A1B2C3)
      const technicianNumber = 'TECH-' + year + '-N33-' + timestamp.slice(-4) + randomPart;

      const dateStr = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

      // Save to user object
      currentUser.technicianNumber = technicianNumber;
      currentUser.technicianNumberDate = dateStr;

      // Persist to localStorage with MULTIPLE keys to prevent data loss
      localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
      localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
      localStorage.setItem('tecnico_number', technicianNumber);
      localStorage.setItem('tecnico_number_date', dateStr);
      if (currentUser.email) {
        localStorage.setItem('tecnico_number_' + currentUser.email, technicianNumber);
        localStorage.setItem('tecnico_number_date_' + currentUser.email, dateStr);
      }
      
      // Sync technician number to Supabase
      supabaseSaveTechnicianNumber(technicianNumber, dateStr);

      // Update display
      updateTechnicianNumberDisplay();

      // Show success message
      if (window.showToast) { window.showToast((typeof _t === 'function' ? _t('profile_tech_generated', '¡Felicidades! Tu número de técnico: ') : '¡Felicidades! Tu número de técnico: ') + technicianNumber, 'success'); } else { window.MaestroDialog.alert({title: '', message: (typeof _t === 'function' ? _t('profile_tech_generated', '¡Felicidades! Tu número de técnico ha sido generado:\n\n') : '¡Felicidades! Tu número de técnico ha sido generado:\n\n') + technicianNumber + (typeof _t === 'function' ? _t('profile_tech_permanent', '\n\nGuarda este número, es permanente.') : '\n\nGuarda este número, es permanente.'), kind: 'success'}); }
    }

    // ============ FORMULA TOGGLE (was in old app.js, now restored) ============
    function toggleFormula(id) {
      var el = document.getElementById(id);
      var arrow = document.getElementById(id + '_arrow');
      if (!el) return;
      if (el.style.display === 'none') {
        el.style.display = 'block';
        if (arrow) arrow.textContent = '\u25BC';
      } else {
        el.style.display = 'none';
        if (arrow) arrow.textContent = '\u25B6';
      }
    }

    // ============ PROFILE DATA LOADER (moved from radio-podcast.js for Tier 1 availability) ============
    function loadProfileData() {
      if (!currentUser || !currentUser.technicianNumber) {
        try {
          var saved = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
          if (!saved.technicianNumber) {
            saved = JSON.parse(localStorage.getItem('tecnico_user_backup') || '{}');
          }
          if (saved && currentUser) {
            if (saved.technicianNumber) {
              currentUser.technicianNumber = saved.technicianNumber;
              currentUser.technicianNumberDate = saved.technicianNumberDate;
            }
            if (saved.studentId) {
              currentUser.studentId = saved.studentId;
              currentUser.studentIdDate = saved.studentIdDate;
            }
          }
        } catch(e) { console.log('Error loading saved user data:', e); }
      }
      try { updateTechnicianNumberDisplay(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadProfilePhoto(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { renderStudentCredential(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentProgress(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentTasks(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentSubmittedTasks(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentGrades(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentExams(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentWorkbooks(); } catch(e) { console.warn('[Profile]', e.message || e); }
      try { loadStudentPayments(); } catch(e) { console.warn('[Profile]', e.message || e); }
    }

    function loadProfilePhoto() {
      if (!currentUser) return;
      var emailKey = currentUser.email || localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || 'default';
      var photo = localStorage.getItem('maestroac_photo_' + emailKey);
      if (!photo) { photo = localStorage.getItem('maestroac_photo_' + (currentUser.email || '')); }
      if (!photo) { photo = localStorage.getItem('maestroac_photo_default'); }
      if (currentUser.email) {
        localStorage.setItem('maestroac_email', currentUser.email);
        localStorage.setItem('tecnico_email', currentUser.email);
      }
      var img = document.getElementById('profilePhotoImg');
      if (photo && img) {
        img.src = photo;
        img.style.display = 'block';
      }
      // Also update dashboard avatar
      var dashImg = document.getElementById('dashProfilePhoto');
      var dashInitial = document.getElementById('dashProfileInitial');
      if (photo && dashImg) {
        dashImg.src = photo;
        dashImg.style.display = 'block';
        if (dashInitial) dashInitial.style.display = 'none';
      } else if (currentUser && currentUser.nombre && dashInitial) {
        dashInitial.textContent = currentUser.nombre.charAt(0).toUpperCase();
        dashInitial.style.display = '';
        if (dashImg) dashImg.style.display = 'none';
      }
    }

    // ============ PROFILE SECTION NAV (moved from admin-inbox.js) ============
    var profileSectionIds = ['sectionCredencial','sectionClasesVivo','sectionProgreso','sectionTareas','sectionCalificaciones','sectionLibros','sectionPagos','sectionHacerPago','sectionCreditos','sectionFormulas'];
    function scrollToProfileSection(sectionId) {
      var el = document.getElementById(sectionId);
      if (!el) return;
      var isVisible = el.style.display !== 'none';
      profileSectionIds.forEach(function(id) {
        var s = document.getElementById(id);
        if (s) s.style.display = 'none';
      });
      if (!isVisible) {
        el.style.display = '';
        setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
      }
    }

    // ============ ID UPLOAD SYSTEM ============
    var _idUploadEndpoint = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co') + '/functions/v1/device-guard';

    // Check ID status — DISABLED (removed by Mario 2026-04-06)
    function checkIdUploadStatus() {
      return; // ID verification disabled

      fetch(_idUploadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_id_status', user_email: email }),
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        var status = res.id_status || 'none';
        // Cache locally for navigation gate
        localStorage.setItem('maestroac_id_status', status);

        if (status === 'approved') return; // All good
        if (status === 'pending') {
          _showIdBanner('Tu identificaci\u00f3n est\u00e1 pendiente de revisi\u00f3n. Te notificaremos cuando sea aprobada.', '#f59e0b');
          return;
        }
        if (status === 'rejected') {
          _showIdUploadModal('Tu identificaci\u00f3n fue rechazada. Por favor sube una foto clara de tu ID.');
          return;
        }
        // status === 'none'
        _showIdBanner('Sube tu identificaci\u00f3n para mantener acceso completo a tu membres\u00eda.', '#3b82f6', true);
      })
      .catch(function(e) { console.warn('[ID Upload] Status check failed:', e); });
    }

    function _showIdBanner(msg, color, showUploadBtn) {
      // Remove existing banner
      var existing = document.getElementById('idUploadBanner');
      if (existing) existing.remove();

      var banner = document.createElement('div');
      banner.id = 'idUploadBanner';
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9998;padding:12px 16px;background:' + color + ';color:white;font-size:13px;font-weight:600;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;';
      banner.innerHTML = '<span>' + msg + '</span>';
      if (showUploadBtn) {
        banner.innerHTML += '<button onclick="_showIdUploadModal()" style="padding:6px 14px;border:none;border-radius:6px;background:white;color:' + color + ';font-size:12px;cursor:pointer;font-weight:700;">Subir ID</button>';
      }
      banner.innerHTML += '<button onclick="this.parentElement.remove()" style="padding:4px 8px;border:none;background:transparent;color:white;font-size:18px;cursor:pointer;margin-left:8px;">\u00d7</button>';
      document.body.appendChild(banner);
    }

    function _showIdUploadModal(customMsg) {
      // Remove existing
      var existing = document.getElementById('idUploadModal');
      if (existing) existing.remove();

      var overlay = document.createElement('div');
      overlay.id = 'idUploadModal';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
      overlay.innerHTML =
        '<div style="background:#FFFFFF;border-radius:16px;padding:32px;max-width:420px;width:100%;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
          '<h3 style="color:#0F0F0F;margin:0 0 8px;font-size:20px;">\uD83E\uDEAA Verificaci\u00f3n de Identidad</h3>' +
          '<p style="color:#6B6B66;font-weight:500;font-size:13px;margin:0 0 20px;">' + (customMsg || 'Sube una foto de tu licencia de manejar o identificaci\u00f3n con fotograf\u00eda para verificar tu cuenta.') + '</p>' +
          '<div id="idUploadPreview" style="margin-bottom:16px;display:none;text-align:center;">' +
            '<img id="idUploadPreviewImg" style="max-width:100%;max-height:200px;border-radius:8px;border:1px solid #E7E5DE;" />' +
          '</div>' +
          '<label style="display:block;padding:40px 20px;border:2px dashed #E7E5DE;border-radius:12px;text-align:center;cursor:pointer;margin-bottom:16px;transition:border-color 0.2s;" onmouseover="this.style.borderColor=\'#E8591C\'" onmouseout="this.style.borderColor=\'#E7E5DE\'">' +
            '<input type="file" accept="image/*" id="idUploadInput" style="display:none;" onchange="_handleIdFileSelect(this)" />' +
            '<div style="color:#6B6B66;font-weight:500;font-size:14px;" id="idUploadLabel">\uD83D\uDCF7 Toca para seleccionar foto</div>' +
          '</label>' +
          '<button id="idUploadBtn" onclick="_submitIdUpload()" disabled style="width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;font-weight:700;font-size:15px;cursor:pointer;opacity:0.5;transition:opacity 0.2s;">Subir Identificaci\u00f3n</button>' +
          '<div id="idUploadStatus" style="margin-top:12px;text-align:center;color:#6B6B66;font-weight:500;font-size:12px;display:none;"></div>' +
          '<button onclick="document.getElementById(\'idUploadModal\').remove()" style="width:100%;padding:10px;border:none;background:transparent;color:#6B6B66;font-size:13px;cursor:pointer;margin-top:8px;">Cerrar</button>' +
        '</div>';
      document.body.appendChild(overlay);
    }

    var _idSelectedBase64 = null;

    function _handleIdFileSelect(input) {
      if (!input.files || !input.files[0]) return;
      var file = input.files[0];
      if (!file.type.startsWith('image/')) { window.showToast(_tc('profile_select_valid_image', 'Por favor selecciona una imagen válida'), 'warning'); return; }
      if (file.size > 10 * 1024 * 1024) { window.showToast(_tc('profile_image_too_large', 'La imagen es muy grande. Máximo 10MB'), 'warning'); return; }

      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          // Compress to max 800px wide
          var canvas = document.createElement('canvas');
          var maxW = 800;
          var w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
          canvas.width = w; canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          _idSelectedBase64 = canvas.toDataURL('image/jpeg', 0.8);

          // Show preview
          var preview = document.getElementById('idUploadPreview');
          var previewImg = document.getElementById('idUploadPreviewImg');
          if (preview && previewImg) {
            previewImg.src = _idSelectedBase64;
            preview.style.display = 'block';
          }
          var label = document.getElementById('idUploadLabel');
          if (label) label.textContent = '\u2705 ' + file.name;
          var btn = document.getElementById('idUploadBtn');
          if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function _submitIdUpload() {
      if (!_idSelectedBase64) return;
      var email = (localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
      if (!email) { window.MaestroDialog.alert({title: 'Atención', message: _tc('profile_no_email', 'No se encontró tu email. Inicia sesión de nuevo.'), kind: 'warning'}); return; }

      var btn = document.getElementById('idUploadBtn');
      var statusDiv = document.getElementById('idUploadStatus');
      if (btn) { btn.disabled = true; btn.textContent = _tc('profile_uploading', 'Subiendo...'); btn.style.opacity = '0.5'; }
      if (statusDiv) { statusDiv.style.display = 'block'; statusDiv.textContent = _tc('profile_uploading_id', 'Subiendo tu identificación...'); statusDiv.style.color = '#57574F'; }

      fetch(_idUploadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload_id', user_email: email, image_base64: _idSelectedBase64 }),
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.ok) {
          localStorage.setItem('maestroac_id_status', 'pending');
          if (statusDiv) { statusDiv.textContent = '\u2705 ' + _tc('profile_id_sent', 'Identificación enviada. Pendiente de revisión.'); statusDiv.style.color = '#22c55e'; }
          if (btn) btn.style.display = 'none';
          // Remove banner if exists
          var banner = document.getElementById('idUploadBanner');
          if (banner) banner.remove();
          // Auto-close after 3s
          setTimeout(function() {
            var modal = document.getElementById('idUploadModal');
            if (modal) modal.remove();
            _showIdBanner(_tc('profile_id_pending', 'Tu ID está pendiente de revisión. Te notificaremos cuando sea aprobada.'), '#f59e0b');
          }, 3000);
        } else {
          if (statusDiv) { statusDiv.textContent = 'Error: ' + (res.error || _tc('profile_upload_failed', 'Fallo al subir')); statusDiv.style.color = '#e74c3c'; }
          if (btn) { btn.disabled = false; btn.textContent = _tc('profile_retry', 'Reintentar'); btn.style.opacity = '1'; }
        }
      })
      .catch(function(e) {
        if (statusDiv) { statusDiv.textContent = _tc('profile_connection_error', 'Error de conexión:') + ' ' + (e.message || _tc('profile_try_again', 'Intenta de nuevo')); statusDiv.style.color = '#e74c3c'; }
        if (btn) { btn.disabled = false; btn.textContent = _tc('profile_retry', 'Reintentar'); btn.style.opacity = '1'; }
      });
    }

    // ── Social Profile Enhancement ────────────────────────────
    // Renders a social section on the profile screen: friend count, EN VIVO badge, add friend button
    function renderSocialProfile(targetEmail) {
      var container = document.getElementById('socialProfileSection');
      if (!container) {
        // Create container if not exists — append to profileContent
        var pc = document.getElementById('profileContent');
        if (!pc) return;
        container = document.createElement('div');
        container.id = 'socialProfileSection';
        container.style.cssText = 'margin:16px 0;padding:14px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.06);';
        // Insert after the first card or at the end
        var firstCard = pc.querySelector('.card, .profile-card');
        if (firstCard && firstCard.nextSibling) {
          pc.insertBefore(container, firstCard.nextSibling);
        } else {
          pc.appendChild(container);
        }
      }

      var email = targetEmail || (localStorage.getItem('tecnico_email') || '').toLowerCase();
      var isOwnProfile = !targetEmail || targetEmail === (localStorage.getItem('tecnico_email') || '').toLowerCase();

      // Check if they're online
      var isOnline = window.SocialSystem && window.SocialSystem.getLiveNow().some(function(u) { return u.email === email; });
      var onlineBadge = isOnline ? '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(34,197,94,0.2);color:#4ade80;font-size:11px;font-weight:700;padding:3px 10px;border-radius:8px;"><span style="width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;animation:liveDot 1s ease-in-out infinite;"></span>EN VIVO</span>' : '';

      var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
      html += '<span style="font-size:14px;font-weight:800;color:#111111;">👥 Social</span>';
      html += onlineBadge;
      html += '</div>';

      if (!isOwnProfile && window.SocialSystem) {
        // Add Friend button
        html += '<div style="display:flex;gap:8px;margin-top:10px;">';
        html += '<button onclick="window.SocialSystem.sendFriendRequest(\'' + email + '\').then(function(){this.textContent=\'Enviada\';this.disabled=true;}.bind(this))" style="flex:1;padding:8px;border:none;border-radius:8px;background:#007AFF;color:#FFFFFF;font-size:13px;font-weight:700;cursor:pointer;">🤝 Agregar Amigo</button>';
        if (isOnline) {
          html += '<button onclick="showScreen(\'friendsScreen\')" style="flex:1;padding:8px;border:none;border-radius:8px;background:#22c55e;color:#FFFFFF;font-size:13px;font-weight:700;cursor:pointer;">Unirse</button>';
        }
        html += '</div>';
      }

      // Friend count (async)
      if (window.SocialSystem) {
        SocialSystem.getFriends().then(function(friends) {
          var countEl = container.querySelector('.social-friend-count');
          if (countEl) countEl.textContent = friends.length + ' amigos';
        });
        html += '<div style="margin-top:8px;font-size:13px;color:#111111;"><span class="social-friend-count">Cargando...</span></div>';
      }

      // "Ver tour otra vez" button (own profile only)
      if (isOwnProfile) {
        html += '<div style="margin-top:12px;text-align:center;"><button onclick="if(window.OnboardingTour){OnboardingTour.restart();}else if(window.MaestroLoader){MaestroLoader.load([\'js/onboarding-tour.js\']).then(function(){if(window.OnboardingTour)OnboardingTour.restart();});}" style="padding:6px 16px;border:1px solid rgba(0,0,0,0.12);border-radius:8px;background:#FFFFFF;color:#111111;font-size:13px;font-weight:600;cursor:pointer;">Ver tour otra vez</button></div>';
      }

      container.innerHTML = html;
    }

    // Global: view another user's profile
    window.viewProfile = function(email) {
      if (!email) return;
      window._socialViewEmail = email;
      showScreen('miPerfilScreen');
      // After screen shows, render social section for that user
      setTimeout(function() { renderSocialProfile(email); }, 300);
    };

    // Hook into existing renderProfile to add social section
    var _origRenderProfile = typeof renderProfile === 'function' ? renderProfile : null;
    var _patchedRender = false;
    function _patchRenderProfile() {
      if (_patchedRender) return;
      // On profile screen open, render social section for own profile
      setTimeout(function() {
        var viewEmail = window._socialViewEmail;
        renderSocialProfile(viewEmail || null);
        window._socialViewEmail = null;
      }, 500);
    }
    // Listen for profile screen becoming active
    var _profileObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.target.id === 'miPerfilScreen' && m.target.classList.contains('active')) {
          _patchRenderProfile();
        }
      });
    });
    var _profileScreen = document.getElementById('miPerfilScreen');
    if (_profileScreen) {
      _profileObserver.observe(_profileScreen, { attributes: true, attributeFilter: ['class'] });
    }

    // Explicitly bind profile entry points to window so inline onclick handlers
    // always resolve them, even when scripts load out of expected order.
    try {
      window.showProfile = showProfile;
      window.goBackFromProfile = goBackFromProfile;
      window.renderProfile = renderProfile;
      window.loadProfileData = loadProfileData;
      window.handleProfilePhoto = handleProfilePhoto;
      if (typeof toggleEditProfile === 'function') window.toggleEditProfile = toggleEditProfile;
      if (typeof saveProfileEdits === 'function') window.saveProfileEdits = saveProfileEdits;
      if (typeof cancelProfileEdits === 'function') window.cancelProfileEdits = cancelProfileEdits;
    } catch(_e) {}

