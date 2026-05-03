    // ==================== MEMBRESÍAS SCREEN ====================
    // Renders pricing tiers + Stripe checkout links into #membresiasScreen
    // Lazy-loaded via SCREEN_SCRIPTS when student navigates to membresiasScreen

    (function() {
      var _initialized = false;

      function initMembresiasScreen() {
        if (_initialized) return;
        _initialized = true;

        var container = document.getElementById('membresiasScreen');
        if (!container) return;

        var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

        container.innerHTML = '' +
          '<div class="header" style="padding:8px 0 4px;">' +
            '<h1 style="font-size:22px;margin:0;">' + _t('html_membresias_title', 'Planes y Membres\u00edas') + '</h1>' +
            '<p class="subtitle" style="margin:4px 0 8px;font-size:13px;">' + _t('html_membresias_sub', 'Clases en vivo con Maestro Mario') + '</p>' +
          '</div>' +
          '<button class="btn btn-secondary" data-nav="dashboardScreen" style="margin-bottom:8px;">' + _t('html_back_menu', '\u2190 Volver al Men\u00fa') + '</button>' +

          // Maestro Mario quote
          '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;border:1px solid rgba(243,156,18,0.3);">' +
            '<div style="min-width:50px;width:50px;height:50px;border-radius:50%;overflow:hidden;border:2px solid #f39c12;">' +
              '<img src="mario-black.jpg" alt="Mario" loading="lazy" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'&#x1F468;&#x200D;&#x1F3EB;\';">' +
            '</div>' +
            '<div>' +
              '<div style="color:#f39c12;font-weight:800;font-size:13px;">Maestro Mario</div>' +
              '<div style="color:#e2e8f0;font-size:12px;line-height:1.4;font-style:italic;">"Invierte en tu educaci\u00f3n y tu carrera te lo devuelve 100x. Mis estudiantes est\u00e1n ganando $30-$80/hr en el campo."</div>' +
            '</div>' +
          '</div>' +

          '<div style="display:grid;grid-template-columns:repeat(1,1fr);gap:10px;">' +

            // ── Principiante $119 ──
            '<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:14px;padding:16px;border:2px solid #f59e0b;">' +
              '<div style="text-align:center;">' +
                '<div style="font-size:28px;">\uD83E\uDD49</div>' +
                '<div style="font-size:18px;font-weight:900;color:#92400e;">' + _t('html_plan_principiante', 'Principiante') + '</div>' +
                '<div style="font-size:28px;font-weight:900;color:#d97706;margin:4px 0;">$119<span style="font-size:14px;font-weight:600;">' + _t('html_per_month', '/mes') + '</span></div>' +
              '</div>' +
              '<div style="margin:10px 0;border-top:1px solid rgba(146,64,14,0.2);padding-top:10px;">' +
                '<div style="font-size:12px;color:#78350f;line-height:1.8;">' +
                  _t('html_feat_live_classes', '\u2705 Clases en VIVO Martes y Mi\u00e9rcoles 6-10PM PST') + '<br>' +
                  _t('html_feat_qa_live', '\u2705 Preguntas y Respuestas en VIVO \u2014 Lunes 6-10PM') + '<br>' +
                  _t('html_feat_online_classes', '\u2705 Clases en l\u00ednea por maestrohvacr.com') + '<br>' +
                  _t('html_feat_full_app_access', '\u2705 Acceso TOTAL a la App de entrenamiento') + '<br>' +
                  _t('html_feat_whatsapp_group', '\u2705 Grupo privado de WhatsApp \u2014 Comunidad + Soporte') + '<br>' +
                  _t('html_feat_participation_cert', '\u2705 Certificado de participaci\u00f3n') +
                '</div>' +
              '</div>' +
              '<div style="text-align:center;">' +
                '<div onclick="window.open(STRIPE_LINKS.principiante,\'_blank\')" style="cursor:pointer;background:#f59e0b;color:white;padding:10px 20px;border-radius:10px;display:inline-block;font-weight:800;font-size:14px;">' + _t('html_subscribe_btn', '\uD83D\uDCB3 Suscribirme') + '</div>' +
              '</div>' +
            '</div>' +

            // ── Intermedio $299 ──
            '<div style="background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:14px;padding:16px;border:2px solid #6366f1;">' +
              '<div style="text-align:center;">' +
                '<div style="font-size:14px;font-weight:800;color:#fff;background:#6366f1;border-radius:20px;display:inline-block;padding:2px 12px;margin-bottom:4px;">' + _t('html_most_popular', '\u2B50 M\u00C1S POPULAR') + '</div>' +
                '<div style="font-size:28px;">\uD83E\uDD48</div>' +
                '<div style="font-size:18px;font-weight:900;color:#3730a3;">' + _t('html_plan_intermedio', 'Intermedio') + '</div>' +
                '<div style="font-size:28px;font-weight:900;color:#4f46e5;margin:4px 0;">$299<span style="font-size:14px;font-weight:600;">' + _t('html_per_month', '/mes') + '</span></div>' +
              '</div>' +
              '<div style="margin:10px 0;border-top:1px solid rgba(55,48,163,0.2);padding-top:10px;">' +
                '<div style="font-size:12px;color:#312e81;line-height:1.8;">' +
                  _t('html_feat_all_principiante', '\u2705 <strong>TODO lo del plan Principiante</strong> +') + '<br>' +
                  _t('html_feat_weekend_classes', '\u2705 Clases S\u00e1bado y Domingo 7-11AM PST') + '<br>' +
                  _t('html_trinity_label', '\u2705 \uD83D\uDD25 <strong>La Trinidad del Oficio:</strong>') + '<br>' +
                  '<span style="margin-left:18px;">' + _t('html_trinity_electricidad', '\u26A1 Electricidad Residencial y Comercial') + '</span><br>' +
                  '<span style="margin-left:18px;">' + _t('html_trinity_ac', '\u2744\uFE0F Aire Acondicionado Comercial') + '</span><br>' +
                  '<span style="margin-left:18px;">' + _t('html_trinity_refri', '\uD83E\uDDCA Refrigeraci\u00f3n Comercial') + '</span><br>' +
                  _t('html_feat_cert_prep', '\u2705 Preparaci\u00f3n para certificaciones EPA, OSHA, NATE') + '<br>' +
                  _t('html_feat_direct_support', '\u2705 Soporte directo por WhatsApp con Maestro Mario') +
                '</div>' +
              '</div>' +
              '<div style="text-align:center;">' +
                '<div onclick="window.open(STRIPE_LINKS.intermedio,\'_blank\')" style="cursor:pointer;background:#6366f1;color:white;padding:10px 20px;border-radius:10px;display:inline-block;font-weight:800;font-size:14px;">' + _t('html_subscribe_btn', '\uD83D\uDCB3 Suscribirme') + '</div>' +
              '</div>' +
            '</div>' +

            // ── Mentoría $699 ──
            '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:14px;padding:16px;border:2px solid #ffd700;box-shadow:0 0 20px rgba(255,215,0,0.2);">' +
              '<div style="text-align:center;">' +
                '<div style="font-size:14px;font-weight:800;color:#1a1a2e;background:linear-gradient(135deg,#ffd700,#f59e0b);border-radius:20px;display:inline-block;padding:2px 12px;margin-bottom:4px;">' + _t('html_premium', '\uD83C\uDFC6 PREMIUM') + '</div>' +
                '<div style="font-size:28px;">\uD83E\uDD47</div>' +
                '<div style="font-size:18px;font-weight:900;color:#ffd700;">' + _t('html_plan_mentoria', 'Mentor\u00eda') + '</div>' +
                '<div style="font-size:28px;font-weight:900;color:#fbbf24;margin:4px 0;">$699<span style="font-size:14px;font-weight:600;">' + _t('html_per_month', '/mes') + '</span></div>' +
              '</div>' +
              '<div style="margin:10px 0;border-top:1px solid rgba(255,215,0,0.2);padding-top:10px;">' +
                '<div style="font-size:12px;color:#e2e8f0;line-height:1.8;">' +
                  _t('html_feat_all_intermedio', '\u2705 <strong style="color:#ffd700;">TODO lo del plan Intermedio</strong> +') + '<br>' +
                  _t('html_feat_contractor_mentoring', '\u2705 Mentor\u00eda Profesional de Contratista') + '<br>' +
                  _t('html_feat_prerecorded_access', '\u2705 Clases Pregrabadas \u2014 acceso completo') + '<br>' +
                  _t('html_feat_priority_access', '\u2705 Acceso prioritario \u2014 preguntas respondidas primero') + '<br>' +
                  _t('html_feat_business_help', '\u2705 Ayuda para iniciar tu propio negocio HVAC') +
                '</div>' +
              '</div>' +
              '<div style="text-align:center;">' +
                '<div onclick="window.open(STRIPE_LINKS.avanzado,\'_blank\')" style="cursor:pointer;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;padding:10px 20px;border-radius:10px;display:inline-block;font-weight:800;font-size:14px;">' + _t('html_subscribe_btn', '\uD83D\uDCB3 Suscribirme') + '</div>' +
              '</div>' +
            '</div>' +

          '</div>' +

          // Guarantee
          '<div style="text-align:center;margin-top:12px;padding:10px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">' +
            '<div style="font-size:12px;color:#166534;font-weight:600;">' + _t('html_cancel_anytime', '\uD83D\uDEE1\uFE0F Cancela cuando quieras \u2014 sin contratos ni penalidades') + '</div>' +
          '</div>';

        // Wire up back button
        var backBtn = container.querySelector('[data-nav="dashboardScreen"]');
        if (backBtn) {
          backBtn.addEventListener('click', function() { showScreen('dashboardScreen'); });
        }
      }

      // showMembershipPaywall — opens membresiasScreen (called from various places)
      window.showMembershipPaywall = function() {
        if (typeof showScreen === 'function') showScreen('membresiasScreen');
      };
      window.openMembershipZone = window.showMembershipPaywall;

      // Initialize when screen is shown
      window.initMembresiasScreen = initMembresiasScreen;

      // Auto-init if screen is already visible
      if (document.getElementById('membresiasScreen')) {
        initMembresiasScreen();
      }
    })();
