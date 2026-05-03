    if (typeof _addTranslations === 'function') _addTranslations({
      adm_ob_welcome: { es: '¡Bienvenido', en: 'Welcome' },
      adm_ob_intro: { es: 'Soy <strong style="color:#f39c12;">Maestro Mario</strong> y esta app te va a llevar de técnico nuevo a <strong style="color:#FFD700;">técnico certificado</strong> paso a paso.', en: 'I\'m <strong style="color:#f39c12;">Maestro Mario</strong> and this app will take you from new technician to <strong style="color:#FFD700;">certified technician</strong> step by step.' },
      adm_ob_path_title: { es: 'Tu camino tiene 5 niveles:', en: 'Your path has 5 levels:' },
      adm_ob_levels: { es: '🔧 Principiante → 📊 Intermedio → ⚡ Avanzado → 🏆 Elite → 💎 Platino', en: '🔧 Beginner → 📊 Intermediate → ⚡ Advanced → 🏆 Elite → 💎 Platinum' },
      adm_ob_next: { es: 'Siguiente →', en: 'Next →' },
      adm_ob_step1_title: { es: 'Paso 1: Completa Tu Perfil', en: 'Step 1: Complete Your Profile' },
      adm_ob_step1_desc: { es: 'Un perfil completo nos ayuda a darte la mejor experiencia. Necesitamos tu nombre, teléfono y ciudad.', en: 'A complete profile helps us give you the best experience. We need your name, phone and city.' },
      adm_ob_full_name: { es: 'Nombre completo', en: 'Full name' },
      adm_ob_phone: { es: 'Teléfono', en: 'Phone' },
      adm_ob_city: { es: 'Ciudad y Estado', en: 'City and State' },
      adm_ob_back: { es: '← Atrás', en: '← Back' },
      adm_ob_step2_title: { es: 'Paso 2: ¡Tu Primera Lección!', en: 'Step 2: Your First Lesson!' },
      adm_ob_step2_desc: { es: 'Empieza con el <strong style="color:#f39c12;">Nivel Principiante</strong>. Toma tu primer quiz y demuestra lo que sabes. ¡Necesitas <strong style="color:#2ecc71;">80%</strong> para certificarte!', en: 'Start with the <strong style="color:#f39c12;">Beginner Level</strong>. Take your first quiz and show what you know. You need <strong style="color:#2ecc71;">80%</strong> to get certified!' },
      adm_ob_first_goal: { es: 'Tu primer objetivo:', en: 'Your first goal:' },
      adm_ob_goal_desc: { es: 'Completar el quiz de <strong>Nivel Principiante</strong> con 80%+ y ganar tu primer certificado verificable.', en: 'Complete the <strong>Beginner Level</strong> quiz with 80%+ and earn your first verifiable certificate.' },
      adm_ob_start_now: { es: '¡Empezar Ahora!', en: 'Start Now!' },
      adm_ob_explore: { es: 'Explorar primero', en: 'Explore first' },
      adm_ob_default_name: { es: 'T\u00E9cnico', en: 'Technician' },
    });

    // ==================== ONBOARDING NUEVOS ESTUDIANTES — AUDITORÍA #5 ====================
    function checkShowOnboarding() {
      if (!currentUser) return;
      var onboardingDone = localStorage.getItem('maestroac_onboarding_done_' + (currentUser.email || ''));
      if (onboardingDone) return;
      
      // Check if user has any progress
      var hasProgress = false;
      if (progress) {
        Object.values(progress).forEach(function(p) { if (p.completed > 0) hasProgress = true; });
      }
      if (hasProgress) {
        localStorage.setItem('maestroac_onboarding_done_' + (currentUser.email || ''), 'true');
        return;
      }
      
      // Show onboarding
      setTimeout(function() { showOnboarding(); }, 800);
    }
    
    function showOnboarding() {
      var userName = currentUser && currentUser.nombre ? _escHtml(String(currentUser.nombre).split(' ')[0]) : _t('adm_ob_default_name', 'T\u00E9cnico');
      var overlay = document.createElement('div');
      overlay.className = 'onboarding-overlay';
      overlay.id = 'onboardingOverlay';
      overlay.innerHTML = 
        '<div class="onboarding-card">' +
          '<div class="onboarding-dots">' +
            '<div class="onboarding-dot active" id="obDot1"></div>' +
            '<div class="onboarding-dot" id="obDot2"></div>' +
            '<div class="onboarding-dot" id="obDot3"></div>' +
          '</div>' +
          
          '<div class="onboarding-step active" id="obStep1">' +
            '<div style="font-size:60px;margin-bottom:10px;">👋</div>' +
            '<h2 style="color:#f39c12;margin-bottom:8px;">' + _t('adm_ob_welcome') + ' ' + userName + '!</h2>' +
            '<p style="color:#e2e8f0;font-size:14px;line-height:1.6;margin-bottom:20px;">' + _t('adm_ob_intro') + '</p>' +
            '<div style="background:rgba(243,156,18,0.1);border:1px solid rgba(243,156,18,0.3);border-radius:12px;padding:15px;margin-bottom:20px;">' +
              '<p style="color:#f39c12;font-size:13px;font-weight:bold;">🎯 ' + _t('adm_ob_path_title') + '</p>' +
              '<p style="color:#94a3b8;font-size:12px;margin-top:5px;">' + _t('adm_ob_levels') + '</p>' +
            '</div>' +
            '<button onclick="onboardingNext(2)" style="width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#f39c12,#e67e22);color:white;">' + _t('adm_ob_next') + '</button>' +
          '</div>' +
          
          '<div class="onboarding-step" id="obStep2">' +
            '<div style="font-size:60px;margin-bottom:10px;">📝</div>' +
            '<h2 style="color:#3498db;margin-bottom:8px;">' + _t('adm_ob_step1_title') + '</h2>' +
            '<p style="color:#e2e8f0;font-size:14px;line-height:1.6;margin-bottom:20px;">' + _t('adm_ob_step1_desc') + '</p>' +
            '<div style="background:rgba(52,152,219,0.1);border:1px solid rgba(52,152,219,0.3);border-radius:12px;padding:15px;margin-bottom:20px;">' +
              '<p style="color:#3498db;font-size:13px;">✅ ' + _t('adm_ob_full_name') + '</p>' +
              '<p style="color:#3498db;font-size:13px;">✅ ' + _t('adm_ob_phone') + '</p>' +
              '<p style="color:#3498db;font-size:13px;">✅ ' + _t('adm_ob_city') + '</p>' +
            '</div>' +
            '<button onclick="onboardingNext(3)" style="width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#3498db,#2980b9);color:white;">' + _t('adm_ob_next') + '</button>' +
            '<button onclick="onboardingNext(1)" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:13px;cursor:pointer;background:transparent;color:#64748b;margin-top:8px;">' + _t('adm_ob_back') + '</button>' +
          '</div>' +
          
          '<div class="onboarding-step" id="obStep3">' +
            '<div style="font-size:60px;margin-bottom:10px;">🚀</div>' +
            '<h2 style="color:#27ae60;margin-bottom:8px;">' + _t('adm_ob_step2_title') + '</h2>' +
            '<p style="color:#e2e8f0;font-size:14px;line-height:1.6;margin-bottom:20px;">' + _t('adm_ob_step2_desc') + '</p>' +
            '<div style="background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:12px;padding:15px;margin-bottom:20px;">' +
              '<p style="color:#27ae60;font-size:13px;font-weight:bold;">🏅 ' + _t('adm_ob_first_goal') + '</p>' +
              '<p style="color:#e2e8f0;font-size:14px;margin-top:5px;">' + _t('adm_ob_goal_desc') + '</p>' +
            '</div>' +
            '<button onclick="finishOnboarding(true)" style="width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#27ae60,#2ecc71);color:white;">🔧 ' + _t('adm_ob_start_now') + '</button>' +
            '<button onclick="finishOnboarding(false)" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:13px;cursor:pointer;background:transparent;color:#64748b;margin-top:8px;">' + _t('adm_ob_explore') + '</button>' +
            '<button onclick="onboardingNext(2)" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:13px;cursor:pointer;background:transparent;color:#64748b;">' + _t('adm_ob_back') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    
    function onboardingNext(step) {
      for (var i = 1; i <= 3; i++) {
        var s = document.getElementById('obStep' + i);
        var d = document.getElementById('obDot' + i);
        if (s) s.classList.remove('active');
        if (d) { d.classList.remove('active'); if (i < step) d.classList.add('completed'); else d.classList.remove('completed'); }
      }
      var target = document.getElementById('obStep' + step);
      var dot = document.getElementById('obDot' + step);
      if (target) target.classList.add('active');
      if (dot) dot.classList.add('active');
    }
    
    function finishOnboarding(goToQuiz) {
      var overlay = document.getElementById('onboardingOverlay');
      if (overlay) overlay.remove();
      if (currentUser && currentUser.email) {
        localStorage.setItem('maestroac_onboarding_done_' + currentUser.email, 'true');
      }
      if (goToQuiz) {
        showScreen('levelsScreen');
      }
    }


