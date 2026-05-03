// ====== SOPORTE TECNICO — Student-Facing ======
// Renders 6 tabs into #soporteContent: AI Mario (default), Soporte (tickets), Videos, Manuales, Casos Reales, Diagramas
// Depends on: supabaseClient, currentUser, isOnline, isAdminStudent(), checkMembership(),
//             addNotification(), notifyAdmin(), STRIPE_LINKS, _escHtml() (config.js), MaestroMarioAPI (ai-maestro-mario.js)
(function () {
  'use strict';

  // ── Module state ──────────────────────────────────────────────────
  var _ticketsCache = [];
  var _videosCache = [];
  var _manualsCache = [];
  var _activeTab = 'aimario';
  var _sopTimerInterval = null;
  var _sopManualPreviewUrl = null;   // track object URL for manual file preview
  var _sopCasePreviewUrls = [];      // track object URLs for case file previews
  var _sopObserver = null;           // MutationObserver reference for cleanup

  // ── Helpers ───────────────────────────────────────────────────────
  function esc(s) {
    return typeof _escHtml === 'function' ? _escHtml(s) : String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function sopEl(id) { return document.getElementById(id); }

  function sopEmail() {
    return (currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || '';
  }

  function sopName() {
    return (currentUser && currentUser.nombre) || (currentUser && currentUser.email) || 'Estudiante';
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtDuration(sec) {
    if (!sec || sec <= 0) return '';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
  }

  // ── Status badge helper ───────────────────────────────────────────
  function sopStatusBadge(estado) {
    var map = {
      abierto:    { bg: 'rgba(241,196,15,0.15)', color: '#f1c40f', label: _t('st_status_open', 'Abierto') },
      en_proceso: { bg: 'rgba(52,152,219,0.15)',  color: '#3498db', label: _t('st_status_in_progress', 'En Proceso') },
      resuelto:   { bg: 'rgba(46,204,113,0.15)',  color: '#2ecc71', label: _t('st_status_resolved', 'Resuelto') },
      cerrado:    { bg: 'rgba(149,165,166,0.15)', color: '#95a5a6', label: _t('st_status_closed', 'Cerrado') }
    };
    var s = map[estado] || map.abierto;
    return '<span class="sop-status-badge" style="background:' + s.bg + ';color:' + s.color + ';">' + s.label + '</span>';
  }

  // ── Category label helper ─────────────────────────────────────────
  function sopCategoryLabel(cat) {
    var labels = {
      general: _t('st_cat_general', 'General'), equipo: _t('st_cat_equipo', 'Equipo'), diagnostico: _t('st_cat_diagnostico', 'Diagn\u00f3stico'),
      instalacion: _t('st_cat_instalacion', 'Instalaci\u00f3n'), electrico: _t('st_cat_electrico', 'El\u00e9ctrico'), refrigeracion: _t('st_cat_refrigeracion', 'Refrigeraci\u00f3n'),
      service: _t('st_cat_service', 'Servicio'), installation: _t('st_cat_installation', 'Instalaci\u00f3n'), wiring: _t('st_cat_wiring', 'Cableado'),
      parts: _t('st_cat_parts', 'Partes'), troubleshooting: _t('st_cat_troubleshooting', 'Troubleshooting')
    };
    return labels[cat] || cat || _t('st_cat_general', 'General');
  }

  // ====================================================================
  //  RENDER — Main container
  // ====================================================================
  function sopRender() {
    var container = sopEl('soporteContent');
    if (!container) return;

    container.innerHTML =
      '<div class="sop-tabs-bar">' +
        '<button class="sop-tab active" data-soptab="aimario">' + _t('st_tab_ai_mario', 'AI Mario') + '</button>' +
        '<button class="sop-tab" data-soptab="soporte">' + _t('st_tab_soporte', 'Soporte') + '</button>' +
        '<button class="sop-tab" data-soptab="videos">' + _t('st_tab_videos', 'Videos') + '</button>' +
        '<button class="sop-tab" data-soptab="manuales">' + _t('st_tab_manuales', 'Manuales') + '</button>' +
        '<button class="sop-tab" data-soptab="casos">' + _t('st_tab_casos', 'Casos Reales') + '</button>' +
        '<button class="sop-tab" data-soptab="diagramas">' + _t('st_tab_diagramas', 'Diagramas') + '</button>' +
      '</div>' +
      '<div id="sopTabContent"></div>';

    // Tab click delegation
    container.querySelector('.sop-tabs-bar').addEventListener('click', function (e) {
      var btn = e.target.closest('.sop-tab');
      if (!btn) return;
      var tab = btn.getAttribute('data-soptab');
      container.querySelectorAll('.sop-tab').forEach(function (t) { t.classList.remove('active'); });
      btn.classList.add('active');
      _activeTab = tab;
      sopRenderTab(tab);
    });

    // Initial render — AI Mario is the default tab
    sopRenderTab('aimario');

    // Floating button removed — circular avatar header replaces it
  }

  function sopRenderTab(tab) {
    var target = sopEl('sopTabContent');
    if (!target) return;
    if (tab === 'aimario')    return sopRenderAIMario(target);
    if (tab === 'soporte')    return sopRenderTickets(target);
    if (tab === 'videos')     return sopRenderVideos(target);
    if (tab === 'manuales')   return sopRenderManuals(target);
    if (tab === 'casos')      return sopRenderCases(target);
    if (tab === 'diagramas')  return sopRenderDiagramas(target);
  }

  // ====================================================================
  //  TAB 0 — AI Mario (Maestro Mario AI Bilingüe)
  // ====================================================================
  function sopRenderAIMario(el) {
    var badgeClass = 'unlimited';
    var badgeText = _t('st_ai_unlimited', 'Ilimitado');
    var avatarSrc = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect width="56" height="56" rx="14" fill="%236366f1"/><text x="28" y="36" text-anchor="middle" fill="white" font-size="24" font-weight="bold">M</text></svg>');
    // Try to use the real avatar from the widget if available
    var realAvatar = document.getElementById('mAvatarPhoto');
    if (realAvatar && realAvatar.src) avatarSrc = realAvatar.src;

    el.innerHTML =
      // ── Circular Mario avatar header ──
      '<div class="sop-ai-circle-header">' +
        '<div class="sop-ai-circle-avatar">' +
          '<img src="' + esc(avatarSrc) + '" alt="Maestro Mario AI" onerror="this.parentElement.innerHTML=\'👨‍🏫\'">' +
          '<span class="sop-ai-circle-ai-badge">AI</span>' +
        '</div>' +
        '<div class="sop-ai-circle-name">Maestro Mario AI</div>' +
        '<span class="sop-ai-badge ' + badgeClass + '">' + badgeText + '</span>' +
      '</div>' +

      // ── Mini-chat ──
      '<div class="sop-ai-chat-wrap">' +
        '<div class="sop-ai-messages" id="sopAiMessages"></div>' +
        '<div class="sop-ai-input-bar">' +
          '<textarea class="sop-ai-input" id="sopAiInput" placeholder="' + _t('st_ai_placeholder', 'Escribe tu pregunta...') + '" rows="1"></textarea>' +
          '<button class="sop-ai-send-btn" id="sopAiSendBtn">' + _t('st_ai_send', 'Enviar') + '</button>' +
        '</div>' +
      '</div>' +

      // ── Actions ──
      '<div class="sop-ai-actions">' +
        '<button class="sop-ai-fullscreen-btn" id="sopAiFullscreen">' + _t('st_ai_fullscreen', 'Pantalla Completa') + '</button>' +
      '</div>';

    // ── Render existing history ──
    var messagesDiv = sopEl('sopAiMessages');
    if (window.MaestroMarioAPI) {
      var hist = MaestroMarioAPI.getHistory();
      if (hist.length > 0) {
        hist.forEach(function(m) { sopAddAiMsg(messagesDiv, m.role, m.content); });
      } else {
        sopAddAiMsg(messagesDiv, 'assistant', _t('st_ai_welcome', '¿Qué tal Colega! Soy Maestro Mario AI. ¿En qué te puedo ayudar hoy?'));
      }
    } else {
      sopAddAiMsg(messagesDiv, 'assistant', _t('st_ai_welcome', '¿Qué tal Colega! Soy Maestro Mario AI. ¿En qué te puedo ayudar hoy?'));
    }

    // ── Send button ──
    var sendBtn = sopEl('sopAiSendBtn');
    var inputEl = sopEl('sopAiInput');
    function doSend() {
      console.log('[SoporteAI] doSend called, API available:', !!window.MaestroMarioAPI);
      var txt = (inputEl.value || '').trim();
      if (!txt) return;
      if (!window.MaestroMarioAPI) {
        console.error('[SoporteAI] MaestroMarioAPI not available!');
        sopAddAiMsg(messagesDiv, 'assistant', _t('st_ai_not_available', 'Error: El sistema AI no está disponible. Intenta recargar la página.'));
        return;
      }

      inputEl.value = '';
      inputEl.style.height = 'auto';
      sopAddAiMsg(messagesDiv, 'user', txt);
      sendBtn.disabled = true;

      // Show typing indicator
      var typingDiv = document.createElement('div');
      typingDiv.className = 'sop-ai-typing';
      typingDiv.id = 'sopAiTyping';
      typingDiv.innerHTML = '<span></span><span></span><span></span>';
      messagesDiv.appendChild(typingDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      try {
        MaestroMarioAPI.sendChat(txt).then(function(reply) {
          var tp = sopEl('sopAiTyping');
          if (tp) tp.remove();
          if (reply) {
            sopAddAiMsg(messagesDiv, 'assistant', reply);
            // Speak full reply — clean all markdown/symbols first
            try { if (MaestroMarioAPI.speak) { var _sp = reply.replace(/<[^>]*>/g,' ').replace(/```[\s\S]*?```/g,' ').replace(/`[^`]*`/g,' ').replace(/\*{1,3}/g,'').replace(/#{1,6}\s?/g,'').replace(/!\[.*?\]\(.*?\)/g,' ').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/[•\|~>_=\[\]\(\){}]/g,' ').replace(/^\d+\.\s/gm,' ').replace(/\n+/g,'. ').replace(/\s{2,}/g,' ').replace(/\.{2,}/g,'.').replace(/^[\s.]+/,'').trim(); if (_sp) MaestroMarioAPI.speak(_sp); } } catch(e) { console.log('[SoporteAI] speak error:', e); }
          } else {
            sopAddAiMsg(messagesDiv, 'assistant', _t('st_ai_problem', 'Hubo un problema, intenta de nuevo.'));
          }
          sendBtn.disabled = false;
          inputEl.focus();
        }).catch(function(err) {
          console.error('[SoporteAI] sendChat promise rejected:', err);
          var tp = sopEl('sopAiTyping');
          if (tp) tp.remove();
          sopAddAiMsg(messagesDiv, 'assistant', _t('st_ai_comm_error', 'Error al comunicarse con el AI. Intenta de nuevo.'));
          sendBtn.disabled = false;
          inputEl.focus();
        });
      } catch (err) {
        console.error('[SoporteAI] sendChat threw:', err);
        var tp = sopEl('sopAiTyping');
        if (tp) tp.remove();
        sopAddAiMsg(messagesDiv, 'assistant', _t('st_ai_unexpected_error', 'Error inesperado. Intenta recargar la página.'));
        sendBtn.disabled = false;
        inputEl.focus();
      }
    }

    sendBtn.addEventListener('click', doSend);
    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });

    // ── Fullscreen button ──
    sopEl('sopAiFullscreen').addEventListener('click', function() {
      if (typeof openMaestroTutor === 'function') openMaestroTutor();
    });
  }

  function sopAddAiMsg(container, role, content) {
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'sop-ai-msg ' + role;
    // SECURITY: escape HTML first, THEN apply markdown transforms to prevent XSS
    var escaped = esc(content || '');
    var html = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');
    var avatarHtml = '';
    if (role === 'assistant') {
      var src = '';
      var realAv = document.getElementById('mAvatarPhoto');
      if (realAv && realAv.src) src = realAv.src;
      avatarHtml = src
        ? '<div class="sop-ai-msg-avatar"><img src="' + esc(src) + '" alt="M"></div>'
        : '<div class="sop-ai-msg-avatar" style="background:#6366f1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:14px;border-radius:8px;">M</div>';
    } else {
      avatarHtml = '<div class="sop-ai-msg-avatar" style="width:28px;height:28px;background:#2563eb;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">T</div>';
    }
    div.innerHTML = avatarHtml + '<div class="sop-ai-msg-bubble">' + html + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  // ====================================================================
  //  TAB 1 — Soporte (Ticket submission + list)
  // ====================================================================
  function sopRenderTickets(el) {
    el.innerHTML =
      // ── Ticket form ──
      '<div class="sop-section-title">' + _t('st_ticket_title', 'Enviar Ticket de Soporte') + '</div>' +
      '<form id="sopTicketForm" class="sop-ticket-form">' +
        '<div class="sop-field">' +
          '<label>' + _t('st_field_subject', 'Asunto') + ' <span class="sop-req">*</span></label>' +
          '<input type="text" id="sopAsunto" required maxlength="120" placeholder="' + _t('st_field_subject_ph', 'Describe tu problema en una l\u00ednea') + '">' +
        '</div>' +
        '<div class="sop-field-row">' +
          '<div class="sop-field">' +
            '<label>' + _t('st_field_category', 'Categor\u00eda') + '</label>' +
            '<select id="sopCategoria">' +
              '<option value="general">' + _t('st_cat_general', 'General') + '</option>' +
              '<option value="equipo">' + _t('st_cat_equipo', 'Equipo') + '</option>' +
              '<option value="diagnostico">' + _t('st_cat_diagnostico', 'Diagn\u00f3stico') + '</option>' +
              '<option value="instalacion">' + _t('st_cat_instalacion', 'Instalaci\u00f3n') + '</option>' +
              '<option value="electrico">' + _t('st_cat_electrico', 'El\u00e9ctrico') + '</option>' +
              '<option value="refrigeracion">' + _t('st_cat_refrigeracion', 'Refrigeraci\u00f3n') + '</option>' +
            '</select>' +
          '</div>' +
          '<div class="sop-field">' +
            '<label>' + _t('st_field_brand', 'Marca') + '</label>' +
            '<input type="text" id="sopMarca" maxlength="60" placeholder="' + _t('st_field_brand_ph', 'Ej: Carrier, Trane...') + '">' +
          '</div>' +
        '</div>' +
        '<div class="sop-field">' +
          '<label>' + _t('st_field_model', 'Modelo') + '</label>' +
          '<input type="text" id="sopModelo" maxlength="80" placeholder="' + _t('st_field_model_ph', 'N\u00famero de modelo del equipo') + '">' +
        '</div>' +

        // ── Diagnostic readings (collapsible) ──
        '<div class="sop-diag-toggle" id="sopDiagToggle">' +
          '<span>' + _t('st_diag_toggle', 'Lecturas de Diagn\u00f3stico (opcional)') + '</span>' +
          '<span class="sop-diag-arrow" id="sopDiagArrow">&#9660;</span>' +
        '</div>' +
        '<div class="sop-diag-fields" id="sopDiagFields" style="display:none;">' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_system_type', 'Tipo de Sistema') + '</label>' +
              '<select id="sopTipoSistema"><option value="">' + _t('st_select_default', '-- Seleccionar --') + '</option>' +
              '<option value="mini_split">Mini Split</option><option value="central">Central Air</option>' +
              '<option value="heat_pump">Heat Pump</option><option value="package_unit">Package Unit</option>' +
              '<option value="chiller">Chiller</option><option value="ptac">PTAC/PTHP</option>' +
              '<option value="otro">' + _t('st_option_other', 'Otro') + '</option></select></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_refrigerant', 'Refrigerante') + '</label>' +
              '<select id="sopRefrigerante"><option value="">' + _t('st_select_default', '-- Seleccionar --') + '</option>' +
              '<option value="R-410A">R-410A</option><option value="R-22">R-22</option>' +
              '<option value="R-32">R-32</option><option value="R-134a">R-134a</option>' +
              '<option value="R-404A">R-404A</option><option value="R-407C">R-407C</option>' +
              '<option value="R-454B">R-454B</option><option value="otro">' + _t('st_option_other', 'Otro') + '</option></select></div>' +
          '</div>' +
          '<div class="sop-diag-subtitle">' + _t('st_diag_pressures', 'Presiones') + '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_suction_psi', 'Presi\u00f3n de Succi\u00f3n (PSI)') + '</label>' +
              '<input type="number" id="sopPresionSuccion" step="0.1" placeholder="Ej: 118"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_discharge_psi', 'Presi\u00f3n de Descarga (PSI)') + '</label>' +
              '<input type="number" id="sopPresionDescarga" step="0.1" placeholder="Ej: 350"></div>' +
          '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_static_psi', 'Presi\u00f3n Est\u00e1tica (in. WC)') + '</label>' +
              '<input type="number" id="sopPresionEstatica" step="0.01" placeholder="Ej: 0.50"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_gas_psi', 'Presi\u00f3n de Gas (PSI)') + '</label>' +
              '<input type="number" id="sopPresionGas" step="0.1" placeholder="Ej: 70"></div>' +
          '</div>' +
          '<div class="sop-diag-subtitle">' + _t('st_diag_temperatures', 'Temperaturas') + '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_supply_temp', 'Temp. Suministro (\u00b0F)') + '</label>' +
              '<input type="number" id="sopTempSuministro" step="0.1" placeholder="Ej: 55"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_return_temp', 'Temp. Retorno (\u00b0F)') + '</label>' +
              '<input type="number" id="sopTempRetorno" step="0.1" placeholder="Ej: 75"></div>' +
          '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>Superheat (\u00b0F)</label>' +
              '<input type="number" id="sopSuperheat" step="0.1" placeholder="Ej: 10"></div>' +
            '<div class="sop-field"><label>Subcooling (\u00b0F)</label>' +
              '<input type="number" id="sopSubcooling" step="0.1" placeholder="Ej: 12"></div>' +
          '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>Delta T (\u00b0F)</label>' +
              '<input type="number" id="sopDeltaT" step="0.1" placeholder="Ej: 20"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_outdoor_temp', 'Temp. Exterior (\u00b0F)') + '</label>' +
              '<input type="number" id="sopTempExterior" step="0.1" placeholder="Ej: 95"></div>' +
          '</div>' +
          '<div class="sop-diag-subtitle">' + _t('st_diag_electrical', 'El\u00e9ctrico') + '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_voltage', 'Voltaje (V)') + '</label>' +
              '<input type="number" id="sopVoltaje" step="0.1" placeholder="Ej: 230"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_amp_compressor', 'Amp. Compresor (A)') + '</label>' +
              '<input type="number" id="sopAmpCompresor" step="0.1" placeholder="Ej: 12.5"></div>' +
          '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_amp_condenser', 'Amp. Motor Condenser (A)') + '</label>' +
              '<input type="number" id="sopAmpCondenser" step="0.1" placeholder="Ej: 1.8"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_amp_evaporator', 'Amp. Motor Evaporador (A)') + '</label>' +
              '<input type="number" id="sopAmpEvaporador" step="0.1" placeholder="Ej: 2.0"></div>' +
          '</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_cap_compressor', 'Capacitor Compresor (\u00b5F)') + '</label>' +
              '<input type="number" id="sopCapCompresor" step="0.1" placeholder="Ej: 45"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_cap_motor', 'Capacitor Motor (\u00b5F)') + '</label>' +
              '<input type="number" id="sopCapMotor" step="0.1" placeholder="Ej: 5"></div>' +
          '</div>' +
          '<div class="sop-diag-subtitle">Airflow</div>' +
          '<div class="sop-field-row">' +
            '<div class="sop-field"><label>' + _t('st_diag_cfm', 'CFM Medido') + '</label>' +
              '<input type="number" id="sopCFM" step="1" placeholder="Ej: 1200"></div>' +
            '<div class="sop-field"><label>' + _t('st_diag_system_size', 'Tama\u00f1o del Sistema (Tons)') + '</label>' +
              '<input type="number" id="sopToneladas" step="0.5" placeholder="Ej: 3"></div>' +
          '</div>' +
        '</div>' +

        '<div class="sop-field">' +
          '<label>' + _t('st_field_description', 'Descripci\u00f3n') + ' <span class="sop-req">*</span></label>' +
          '<textarea id="sopDescripcion" required rows="4" maxlength="2000" placeholder="' + _t('st_field_desc_ph', 'Explica el s\u00edntoma, lo que ya revisaste, lecturas obtenidas...') + '"></textarea>' +
        '</div>' +
        '<div class="sop-field">' +
          '<label>' + _t('st_field_attach_photo', 'Adjuntar foto') + '</label>' +
          '<input type="file" id="sopAdjunto" accept="image/*">' +
          '<small style="color:var(--text-muted);font-size:11px;">' + _t('st_field_image_hint', 'Solo im\u00e1genes. M\u00e1x 5 MB.') + '</small>' +
        '</div>' +
        '<button type="submit" class="sop-submit-btn" id="sopSubmitBtn">' + _t('st_submit_ticket', 'Enviar Ticket') + '</button>' +
        '<div id="sopFormMsg" class="sop-form-msg"></div>' +
      '</form>' +

      // ── My tickets ──
      '<div class="sop-section-title" style="margin-top:28px;">' + _t('st_my_tickets', 'Mis Tickets') + '</div>' +
      '<div id="sopMyTickets" class="sop-tickets-list"><div class="sop-loading">' + _t('st_loading_tickets', 'Cargando tickets...') + '</div></div>';

    // Form handler
    sopEl('sopTicketForm').addEventListener('submit', function (e) {
      e.preventDefault();
      sopSubmitTicket();
    });

    // Diagnostic toggle
    var _diagOpen = false;
    sopEl('sopDiagToggle').addEventListener('click', function () {
      _diagOpen = !_diagOpen;
      sopEl('sopDiagFields').style.display = _diagOpen ? 'block' : 'none';
      sopEl('sopDiagArrow').innerHTML = _diagOpen ? '&#9650;' : '&#9660;';
    });

    // $300 Live Support payment flow
    var livePayBtn = sopEl('sopLivePayBtn');
    if (livePayBtn) {
      livePayBtn.addEventListener('click', function () {
        sopShowLiveConfirmModal(soporte1on1);
      });
    }

    // Load tickets
    sopLoadMyTickets();
  }

  async function sopSubmitTicket() {
    var btn = sopEl('sopSubmitBtn');
    var msg = sopEl('sopFormMsg');
    var subject = (sopEl('sopAsunto').value || '').trim();
    var desc = (sopEl('sopDescripcion').value || '').trim();
    if (!subject || !desc) { msg.innerHTML = '<span style="color:#e74c3c;">' + _t('st_err_subject_desc_required', 'Asunto y descripci\u00f3n son requeridos.') + '</span>'; return; }

    // Collect diagnostic readings
    var diagFields = [
      {id:'sopTipoSistema', label:'Tipo de Sistema'},
      {id:'sopRefrigerante', label:'Refrigerante'},
      {id:'sopPresionSuccion', label:'Presi\u00f3n Succi\u00f3n', unit:'PSI'},
      {id:'sopPresionDescarga', label:'Presi\u00f3n Descarga', unit:'PSI'},
      {id:'sopPresionEstatica', label:'Presi\u00f3n Est\u00e1tica', unit:'in. WC'},
      {id:'sopPresionGas', label:'Presi\u00f3n de Gas', unit:'PSI'},
      {id:'sopTempSuministro', label:'Temp. Suministro', unit:'\u00b0F'},
      {id:'sopTempRetorno', label:'Temp. Retorno', unit:'\u00b0F'},
      {id:'sopSuperheat', label:'Superheat', unit:'\u00b0F'},
      {id:'sopSubcooling', label:'Subcooling', unit:'\u00b0F'},
      {id:'sopDeltaT', label:'Delta T', unit:'\u00b0F'},
      {id:'sopTempExterior', label:'Temp. Exterior', unit:'\u00b0F'},
      {id:'sopVoltaje', label:'Voltaje', unit:'V'},
      {id:'sopAmpCompresor', label:'Amp. Compresor', unit:'A'},
      {id:'sopAmpCondenser', label:'Amp. Motor Condenser', unit:'A'},
      {id:'sopAmpEvaporador', label:'Amp. Motor Evaporador', unit:'A'},
      {id:'sopCapCompresor', label:'Capacitor Compresor', unit:'\u00b5F'},
      {id:'sopCapMotor', label:'Capacitor Motor', unit:'\u00b5F'},
      {id:'sopCFM', label:'CFM Medido'},
      {id:'sopToneladas', label:'Toneladas', unit:'Tons'}
    ];
    var diagLines = [];
    diagFields.forEach(function(f) {
      var el = sopEl(f.id);
      var val = el ? (el.value || '').trim() : '';
      if (val) diagLines.push(f.label + ': ' + val + (f.unit ? ' ' + f.unit : ''));
    });
    if (diagLines.length > 0) {
      desc += '\n\n--- Lecturas de Diagn\u00f3stico ---\n' + diagLines.join('\n');
    }

    btn.disabled = true;
    btn.textContent = _t('st_sending', 'Enviando...');
    msg.innerHTML = '';

    var email = sopEmail();
    var name = sopName();
    var attachmentUrls = [];

    // Upload attachment if present
    var fileInput = sopEl('sopAdjunto');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      var file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) {
        msg.innerHTML = '<span style="color:#e74c3c;">' + _t('st_err_image_too_large', 'La imagen no puede exceder 5 MB.') + '</span>';
        btn.disabled = false; btn.textContent = _t('st_submit_ticket', 'Enviar Ticket'); return;
      }
      try {
        var ts = Date.now();
        var safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        var path = 'soporte/tickets/' + ts + '_' + safeName;
        var uploadRes = await supabaseClient.storage.from('school-files').upload(path, file);
        if (uploadRes.error) throw uploadRes.error;
        var urlRes = supabaseClient.storage.from('school-files').getPublicUrl(path);
        if (urlRes.data && urlRes.data.publicUrl) {
          attachmentUrls.push(urlRes.data.publicUrl);
        }
      } catch (err) {
        console.warn('[Soporte] upload error:', err);
        // Continue without attachment
      }
    }

    // Insert ticket
    try {
      var insertRes = await supabaseClient.from('soporte_tickets').insert({
        student_email: email,
        student_name: name,
        subject: subject,
        description: desc,
        category: sopEl('sopCategoria').value || 'general',
        equipment_brand: (sopEl('sopMarca').value || '').trim() || null,
        equipment_model: (sopEl('sopModelo').value || '').trim() || null,
        attachment_urls: attachmentUrls
      });

      if (insertRes.error) throw insertRes.error;

      // Notification
      try { addNotification('soporte', _t('st_notif_ticket_sent', 'Ticket enviado: ') + subject); } catch(e) { console.warn('[SoporteTecnico]', e.message || e); }
      try { notifyAdmin('Nuevo ticket de soporte', name + ': ' + subject, 'soporte'); } catch(e) { console.warn('[SoporteTecnico]', e.message || e); }

      msg.innerHTML = '<span style="color:#2ecc71;">' + _t('st_ticket_sent', 'Ticket enviado correctamente.') + '</span>';
      sopEl('sopTicketForm').reset();
      sopLoadMyTickets();
    } catch (err) {
      console.error('[Soporte] insert error:', err);
      msg.innerHTML = '<span style="color:#e74c3c;">' + _t('st_err_sending', 'Error al enviar: ') + esc(err.message || _t('st_err_unknown', 'desconocido')) + '</span>';
    }
    btn.disabled = false;
    btn.textContent = _t('st_submit_ticket', 'Enviar Ticket');
  }

  async function sopLoadMyTickets() {
    var wrap = sopEl('sopMyTickets');
    if (!wrap) return;
    var email = sopEmail();
    if (!email) { wrap.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + _t('st_login_to_see_tickets', 'Inicia sesi\u00f3n para ver tus tickets.') + '</p>'; return; }

    if (!supabaseClient || !isOnline) {
      wrap.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + _t('st_offline_tickets', 'Sin conexi\u00f3n. No se pueden cargar tickets.') + '</p>';
      return;
    }

    try {
      var res = await supabaseClient
        .from('soporte_tickets')
        .select('*')
        .eq('student_email', email)
        .order('created_at', { ascending: false })
        .limit(25);

      if (res.error) throw res.error;
      _ticketsCache = res.data || [];

      if (_ticketsCache.length === 0) {
        wrap.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px 0;">' + _t('st_no_tickets', 'No tienes tickets a\u00fan. Env\u00eda uno arriba.') + '</p>';
        return;
      }

      var html = '';
      _ticketsCache.forEach(function (t) {
        html += '<div class="sop-ticket-card">' +
          '<div class="sop-ticket-top">' +
            '<div class="sop-ticket-subject">' + esc(t.subject) + '</div>' +
            sopStatusBadge(t.estado) +
          '</div>' +
          '<div class="sop-ticket-meta">' +
            '<span>' + sopCategoryLabel(t.category) + '</span>' +
            (t.equipment_brand ? ' <span class="sop-brand-pill">' + esc(t.equipment_brand) + '</span>' : '') +
            ' <span class="sop-ticket-date">' + fmtDate(t.created_at) + '</span>' +
          '</div>' +
          '<div class="sop-ticket-desc">' + esc(truncate(t.description, 200)) + '</div>' +
          (t.attachment_urls && t.attachment_urls.length > 0
            ? '<div class="sop-ticket-attachments">' + t.attachment_urls.map(function (url) {
                return '<a href="' + esc(url) + '" target="_blank" rel="noopener" class="sop-attachment-link">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg> ' + _t('st_photo', 'Foto') + '</a>';
              }).join('') + '</div>'
            : '') +
          (t.admin_response
            ? '<div class="sop-admin-response">' +
                '<div class="sop-admin-response-label">' + _t('st_team_response', 'Respuesta del equipo:') + '</div>' +
                '<div class="sop-admin-response-text">' + esc(t.admin_response) + '</div>' +
                (t.responded_at ? '<div class="sop-admin-response-date">' + fmtDate(t.responded_at) + '</div>' : '') +
              '</div>'
            : '') +
        '</div>';
      });
      wrap.innerHTML = html;

    } catch (err) {
      console.error('[Soporte] load tickets error:', err);
      wrap.innerHTML = '<p style="color:#e74c3c;font-size:13px;">' + _t('st_err_loading_tickets', 'Error al cargar tickets.') + '</p>';
    }
  }

  // ====================================================================
  //  TAB 2 — Videos
  // ====================================================================
  function sopRenderVideos(el) {
    el.innerHTML =
      '<div class="sop-filter-bar" id="sopVideoFilters"></div>' +
      '<div id="sopVideoGrid" class="sop-video-grid"><div class="sop-loading">' + _t('st_loading_videos', 'Cargando videos...') + '</div></div>';
    sopLoadVideos();
  }

  async function sopLoadVideos() {
    var grid = sopEl('sopVideoGrid');
    var filtersWrap = sopEl('sopVideoFilters');
    if (!grid) return;

    if (!supabaseClient || !isOnline) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">' + _t('st_offline', 'Sin conexi\u00f3n.') + '</p>';
      return;
    }

    try {
      var res = await supabaseClient
        .from('soporte_videos')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (res.error) throw res.error;
      _videosCache = res.data || [];

      if (_videosCache.length === 0) {
        grid.innerHTML = '<div class="sop-empty-state">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' +
          '<h3 style="color:var(--text-primary);margin:12px 0 4px;">' + _t('st_videos_coming_soon', 'Videos pr\u00f3ximamente') + '</h3>' +
          '<p style="color:var(--text-muted);font-size:13px;">' + _t('st_videos_coming_desc', 'Videos de campo por marca y modelo') + '</p>' +
        '</div>';
        if (filtersWrap) filtersWrap.innerHTML = '';
        return;
      }

      // Build brand filter pills
      sopBuildFilterBar(filtersWrap, _videosCache, 'video');

      // Render grid
      sopRenderVideoCards(_videosCache, grid);

    } catch (err) {
      console.error('[Soporte] load videos error:', err);
      grid.innerHTML = '<p style="color:#e74c3c;text-align:center;">' + _t('st_err_loading_videos', 'Error al cargar videos.') + '</p>';
    }
  }

  function sopRenderVideoCards(items, grid) {
    if (!items || items.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px 0;">' + _t('st_no_videos_found', 'No se encontraron videos.') + '</p>';
      return;
    }
    var html = '';
    items.forEach(function (v) {
      var dur = fmtDuration(v.duration_seconds);
      var thumb = v.thumbnail_url
        ? '<img src="' + esc(v.thumbnail_url) + '" alt="" class="sop-video-thumb-img">'
        : '<div class="sop-video-thumb-placeholder"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';

      html += '<div class="sop-video-card" data-vid="' + esc(v.id) + '" data-gated="' + (v.requires_membership ? '1' : '0') + '" data-url="' + esc(v.video_url) + '">' +
        '<div class="sop-video-thumb">' + thumb +
          (dur ? '<span class="sop-video-duration">' + dur + '</span>' : '') +
          (v.requires_membership ? '<span class="sop-gated-badge">' + _t('st_members_badge', 'Miembros') + '</span>' : '') +
        '</div>' +
        '<div class="sop-video-info">' +
          '<div class="sop-video-title">' + esc(v.title) + '</div>' +
          (v.brand ? '<span class="sop-brand-pill">' + esc(v.brand) + '</span>' : '') +
          (v.description ? '<p class="sop-video-desc">' + esc(truncate(v.description, 100)) + '</p>' : '') +
        '</div>' +
      '</div>';
    });
    grid.innerHTML = html;

    // Click handlers
    grid.querySelectorAll('.sop-video-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var url = card.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      });
    });
  }

  // ====================================================================
  //  TAB 3 — Manuales (+ "Comparte tu Manual" upload form)
  // ====================================================================
  function sopRenderManuals(el) {
    el.innerHTML =
      '<div class="sop-filter-bar" id="sopManualFilters"></div>' +
      '<div id="sopManualList" class="sop-manual-list"><div class="sop-loading">' + _t('st_loading_manuals', 'Cargando manuales...') + '</div></div>' +
      '<div style="margin-top:24px;">' +
        '<button class="sop-section-toggle" id="sopManualUploadToggle">' +
          '<span class="sop-toggle-icon">&#128214;</span>' +
          '<span class="sop-toggle-label">' + _t('st_share_manual', 'Comparte tu Manual') + '</span>' +
          '<span class="sop-toggle-arrow">&#9660;</span>' +
        '</button>' +
        '<div class="sop-collapse-body" id="sopManualUploadBody">' +
          '<div style="padding:4px 0 16px;">' +
            '<div class="sop-form-row">' +
              '<div class="sop-form-group"><label>' + _t('st_field_title', 'T\u00edtulo') + ' *</label><input type="text" id="sopManUpTitle" placeholder="Ej: Manual Carrier 24ACC636"></div>' +
              '<div class="sop-form-group"><label>' + _t('st_field_brand', 'Marca') + '</label><input type="text" id="sopManUpBrand" placeholder="Ej: Carrier"></div>' +
            '</div>' +
            '<div class="sop-form-group"><label>' + _t('st_field_description', 'Descripci\u00f3n') + '</label><textarea id="sopManUpDesc" rows="2" placeholder="' + _t('st_field_brief_desc_ph', 'Descripci\u00f3n breve (opcional)') + '"></textarea></div>' +
            '<div class="sop-form-group"><label>' + _t('st_field_file_upload', 'Archivo (PDF o imagen, max 10MB)') + '</label>' +
              '<div class="sop-dropzone" id="sopManUpDropzone">' +
                '<div class="sop-dropzone-icon">&#128196;</div>' +
                '<div class="sop-dropzone-text">' + _t('st_dropzone_text', 'Arrastra tu archivo aqu\u00ed o') + ' <strong>' + _t('st_dropzone_click', 'haz clic') + '</strong></div>' +
                '<div class="sop-dropzone-hint">' + _t('st_dropzone_hint_pdf', 'PDF, JPG, PNG &middot; M\u00e1x 10MB') + '</div>' +
              '</div>' +
              '<input type="file" id="sopManUpFile" accept=".pdf,.jpg,.jpeg,.png,.webp" style="display:none">' +
              '<div class="sop-file-previews" id="sopManUpPreviews"></div>' +
            '</div>' +
            '<button class="sop-form-submit" id="sopManUpSubmit">' + _t('st_submit_manual', 'Enviar Manual') + '</button>' +
            '<div id="sopManUpMsg"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    sopLoadManuals();
    sopInitManualUpload();
  }

  function sopInitManualUpload() {
    var toggle = sopEl('sopManualUploadToggle');
    var body = sopEl('sopManualUploadBody');
    if (toggle && body) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        body.classList.toggle('open');
      });
    }
    var dropzone = sopEl('sopManUpDropzone');
    var fileInput = sopEl('sopManUpFile');
    var previews = sopEl('sopManUpPreviews');
    var _manualFile = null;

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', function () { fileInput.click(); });
      dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
      dropzone.addEventListener('drop', function (e) {
        e.preventDefault(); dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) { _manualFile = e.dataTransfer.files[0]; sopShowManualFilePreview(_manualFile, previews); }
      });
      fileInput.addEventListener('change', function () {
        if (fileInput.files.length) { _manualFile = fileInput.files[0]; sopShowManualFilePreview(_manualFile, previews); }
      });
    }

    function sopShowManualFilePreview(file, container) {
      if (file.size > 10 * 1024 * 1024) {
        if (_sopManualPreviewUrl) { URL.revokeObjectURL(_sopManualPreviewUrl); _sopManualPreviewUrl = null; }
        container.innerHTML = '<p style="color:#e74c3c;font-size:12px;">' + _t('st_err_file_too_large', 'Archivo excede 10MB') + '</p>';
        _manualFile = null; return;
      }
      // Revoke previous object URL before creating a new one
      if (_sopManualPreviewUrl) { URL.revokeObjectURL(_sopManualPreviewUrl); _sopManualPreviewUrl = null; }
      var html = '<div class="sop-file-preview">';
      if (file.type.startsWith('image/')) {
        _sopManualPreviewUrl = URL.createObjectURL(file);
        html += '<img src="' + _sopManualPreviewUrl + '" alt="">';
      } else {
        html += '<div style="display:flex;align-items:center;justify-content:center;height:100%;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>';
      }
      html += '<div class="sop-fp-name">' + esc(file.name) + '</div>';
      html += '<button class="sop-fp-remove" title="Quitar">&times;</button></div>';
      container.innerHTML = html;
      container.querySelector('.sop-fp-remove').addEventListener('click', function () {
        if (_sopManualPreviewUrl) { URL.revokeObjectURL(_sopManualPreviewUrl); _sopManualPreviewUrl = null; }
        _manualFile = null; container.innerHTML = ''; fileInput.value = '';
      });
    }

    var submitBtn = sopEl('sopManUpSubmit');
    if (submitBtn) {
      submitBtn.addEventListener('click', async function () {
        var title = (sopEl('sopManUpTitle').value || '').trim();
        if (!title) { sopEl('sopManUpMsg').innerHTML = '<p style="color:#e74c3c;font-size:13px;">' + _t('st_err_title_required', 'T\u00edtulo es requerido.') + '</p>'; return; }
        if (!_manualFile) { sopEl('sopManUpMsg').innerHTML = '<p style="color:#e74c3c;font-size:13px;">' + _t('st_err_select_file', 'Selecciona un archivo.') + '</p>'; return; }
        submitBtn.disabled = true; submitBtn.textContent = _t('st_uploading', 'Subiendo...');
        try {
          var ext = _manualFile.name.split('.').pop().toLowerCase();
          var path = 'soporte/manuales/' + Date.now() + '_' + Math.random().toString(36).substr(2, 6) + '.' + ext;
          var upRes = await supabaseClient.storage.from('school-files').upload(path, _manualFile, { contentType: _manualFile.type, upsert: false });
          if (upRes.error) throw upRes.error;
          var fileUrl = supabaseClient.storage.from('school-files').getPublicUrl(path).data.publicUrl;
          var brand = (sopEl('sopManUpBrand').value || '').trim();
          var desc = (sopEl('sopManUpDesc').value || '').trim();
          var ins = await supabaseClient.from('soporte_manuals').insert({
            title: title, brand: brand || 'Sin marca', description: desc || null,
            file_url: fileUrl, file_size_bytes: _manualFile.size,
            uploaded_by: sopEmail(), active: false, requires_membership: false
          });
          if (ins.error) throw ins.error;
          sopEl('sopManUpMsg').innerHTML = '<div class="sop-success-msg">' + _t('st_manual_sent_review', 'Manual enviado para revisi\u00f3n. Aparecer\u00e1 una vez aprobado.') + '</div>';
          sopEl('sopManUpTitle').value = ''; sopEl('sopManUpBrand').value = ''; sopEl('sopManUpDesc').value = '';
          if (_sopManualPreviewUrl) { URL.revokeObjectURL(_sopManualPreviewUrl); _sopManualPreviewUrl = null; }
          _manualFile = null; previews.innerHTML = ''; fileInput.value = '';
        } catch (err) {
          console.error('[Soporte] manual upload error:', err);
          sopEl('sopManUpMsg').innerHTML = '<p style="color:#e74c3c;font-size:13px;">' + _t('st_err_uploading', 'Error al subir: ') + esc(err.message || _t('st_try_again', 'intenta de nuevo')) + '</p>';
        }
        submitBtn.disabled = false; submitBtn.textContent = _t('st_submit_manual', 'Enviar Manual');
      });
    }
  }

  async function sopLoadManuals() {
    var list = sopEl('sopManualList');
    var filtersWrap = sopEl('sopManualFilters');
    if (!list) return;

    if (!supabaseClient || !isOnline) {
      list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">' + _t('st_offline', 'Sin conexi\u00f3n.') + '</p>';
      return;
    }

    try {
      var res = await supabaseClient
        .from('soporte_manuals')
        .select('*')
        .eq('active', true)
        .order('brand', { ascending: true })
        .order('title', { ascending: true });

      if (res.error) throw res.error;
      _manualsCache = res.data || [];

      if (_manualsCache.length === 0) {
        list.innerHTML = '<div class="sop-empty-state">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
          '<h3 style="color:var(--text-primary);margin:12px 0 4px;">' + _t('st_manuals_coming_soon', 'Manuales pr\u00f3ximamente') + '</h3>' +
          '<p style="color:var(--text-muted);font-size:13px;">' + _t('st_manuals_coming_desc', 'PDFs de instalaci\u00f3n y servicio por marca') + '</p>' +
        '</div>';
        if (filtersWrap) filtersWrap.innerHTML = '';
        return;
      }

      // Build brand filter pills
      sopBuildFilterBar(filtersWrap, _manualsCache, 'manual');

      // Group by brand
      sopRenderManualCards(_manualsCache, list);

    } catch (err) {
      console.error('[Soporte] load manuals error:', err);
      list.innerHTML = '<p style="color:#e74c3c;text-align:center;">' + _t('st_err_loading_manuals', 'Error al cargar manuales.') + '</p>';
    }
  }

  function sopRenderManualCards(items, list) {
    if (!items || items.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px 0;">' + _t('st_no_manuals_found', 'No se encontraron manuales.') + '</p>';
      return;
    }

    // Group by brand
    var groups = {};
    items.forEach(function (m) {
      var brand = m.brand || _t('st_brand_others', 'Otros');
      if (!groups[brand]) groups[brand] = [];
      groups[brand].push(m);
    });

    var html = '';
    Object.keys(groups).sort().forEach(function (brand) {
      html += '<div class="sop-manual-brand-group">' +
        '<div class="sop-manual-brand-header">' + esc(brand) + '</div>';
      groups[brand].forEach(function (m) {
        html += '<div class="sop-manual-card" data-mid="' + esc(m.id) + '" data-gated="' + (m.requires_membership ? '1' : '0') + '" data-url="' + esc(m.file_url) + '">' +
          '<div class="sop-manual-icon">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
          '</div>' +
          '<div class="sop-manual-info">' +
            '<div class="sop-manual-title">' + esc(m.title) + '</div>' +
            (m.description ? '<p class="sop-manual-desc">' + esc(truncate(m.description, 120)) + '</p>' : '') +
            '<div class="sop-manual-badges">' +
              '<span class="sop-cat-badge">' + sopCategoryLabel(m.category) + '</span>' +
              (m.equipment_type ? '<span class="sop-cat-badge">' + esc(m.equipment_type) + '</span>' : '') +
              (m.requires_membership ? '<span class="sop-gated-badge-sm">' + _t('st_members_badge', 'Miembros') + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="sop-manual-arrow">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    });
    list.innerHTML = html;

    // Click handlers
    list.querySelectorAll('.sop-manual-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var url = card.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      });
    });
  }

  // ====================================================================
  //  TAB 4 — Casos Reales (DB-loaded + "Comparte tu caso" form)
  // ====================================================================
  var _casosUploadFiles = [];

  function sopRenderCases(el) {
    el.innerHTML =
      // ── "Comparte tu caso" collapsible form ──
      '<button class="sop-section-toggle" id="sopCaseToggle">' +
        '<span class="sop-toggle-icon">&#128295;</span>' +
        '<span class="sop-toggle-label">' + _t('st_share_case', 'Comparte tu Caso') + '</span>' +
        '<span class="sop-toggle-arrow">&#9660;</span>' +
      '</button>' +
      '<div class="sop-collapse-body" id="sopCaseFormBody">' +
        '<div style="padding:4px 0 16px;">' +
          '<div class="sop-form-row">' +
            '<div class="sop-form-group"><label>' + _t('st_field_brand', 'Marca') + '</label><input type="text" id="sopCaseBrand" placeholder="Ej: Carrier, Trane, Lennox"></div>' +
            '<div class="sop-form-group"><label>' + _t('st_field_model', 'Modelo') + '</label><input type="text" id="sopCaseModel" placeholder="Ej: 24ACC636A003"></div>' +
          '</div>' +
          '<div class="sop-form-group"><label>' + _t('st_field_symptom', 'S\u00edntoma') + ' *</label><textarea id="sopCaseSymptom" rows="2" placeholder="' + _t('st_field_symptom_ph', 'Describe el s\u00edntoma que encontraste...') + '"></textarea></div>' +
          '<div class="sop-form-group"><label>' + _t('st_field_real_cause', 'Causa Real') + ' *</label><textarea id="sopCaseCause" rows="2" placeholder="' + _t('st_field_cause_ph', '&iquest;Cu\u00e1l fue la causa del problema?') + '"></textarea></div>' +
          '<div class="sop-form-group"><label>' + _t('st_field_part_solution', 'Parte / Soluci\u00f3n') + '</label><input type="text" id="sopCasePart" placeholder="Ej: Capacitor 45/5 MFD reemplazado"></div>' +
          '<div class="sop-form-group"><label>' + _t('st_field_tip', 'Tip / Lecci\u00f3n') + '</label><input type="text" id="sopCaseTip" placeholder="' + _t('st_field_tip_ph', 'Ej: Siempre medir antes de cambiar') + '"></div>' +
          '<div class="sop-form-group"><label>' + _t('st_field_photos', 'Fotos (m\u00e1x 5, 5MB c/u)') + '</label>' +
            '<div class="sop-dropzone" id="sopCaseDropzone">' +
              '<div class="sop-dropzone-icon">&#128247;</div>' +
              '<div class="sop-dropzone-text">' + _t('st_dropzone_photos', 'Arrastra fotos aqu\u00ed o') + ' <strong>' + _t('st_dropzone_click', 'haz clic') + '</strong></div>' +
              '<div class="sop-dropzone-hint">' + _t('st_dropzone_hint_img', 'JPG, PNG, WebP &middot; M\u00e1x 5MB por foto') + '</div>' +
            '</div>' +
            '<input type="file" id="sopCaseFileInput" accept="image/*" multiple style="display:none">' +
            '<div class="sop-file-previews" id="sopCasePreviews"></div>' +
          '</div>' +
          '<button class="sop-form-submit" id="sopCaseSubmit">' + _t('st_submit_case', 'Enviar Caso') + '</button>' +
          '<div id="sopCaseMsg"></div>' +
        '</div>' +
      '</div>' +

      // ── Search + cases grid ──
      '<div class="sop-cases-search" style="margin-top:8px;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" id="sopCasesSearch" class="sop-cases-search-input" placeholder="' + _t('st_search_cases_ph', 'Buscar equipo, modelo o s\u00edntoma...') + '">' +
      '</div>' +
      '<div class="soporte-cases-grid" id="sopCasesGrid"><div class="sop-loading">' + _t('st_loading_cases', 'Cargando casos...') + '</div></div>';

    sopInitCaseForm();
    sopLoadCases();
  }

  function sopInitCaseForm() {
    // Toggle
    var toggle = sopEl('sopCaseToggle');
    var body = sopEl('sopCaseFormBody');
    if (toggle && body) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        body.classList.toggle('open');
      });
    }

    // Dropzone
    _casosUploadFiles = [];
    var dropzone = sopEl('sopCaseDropzone');
    var fileInput = sopEl('sopCaseFileInput');
    var previews = sopEl('sopCasePreviews');
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', function () { fileInput.click(); });
      dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
      dropzone.addEventListener('drop', function (e) {
        e.preventDefault(); dropzone.classList.remove('dragover');
        sopAddCaseFiles(Array.from(e.dataTransfer.files), previews);
      });
      fileInput.addEventListener('change', function () {
        sopAddCaseFiles(Array.from(fileInput.files), previews);
        fileInput.value = '';
      });
    }

    // Submit
    var submitBtn = sopEl('sopCaseSubmit');
    if (submitBtn) {
      submitBtn.addEventListener('click', sopSubmitCase);
    }
  }

  function sopAddCaseFiles(files, container) {
    files.forEach(function (f) {
      if (_casosUploadFiles.length >= 5) return;
      if (!f.type.startsWith('image/')) return;
      if (f.size > 5 * 1024 * 1024) return;
      _casosUploadFiles.push(f);
    });
    sopRenderCasePreviews(container);
  }

  function sopRenderCasePreviews(container) {
    if (!container) return;
    // Revoke all previous case preview object URLs before re-rendering
    _sopCasePreviewUrls.forEach(function (u) { URL.revokeObjectURL(u); });
    _sopCasePreviewUrls = [];
    container.innerHTML = '';
    _casosUploadFiles.forEach(function (f, idx) {
      var div = document.createElement('div');
      div.className = 'sop-file-preview';
      var objUrl = URL.createObjectURL(f);
      _sopCasePreviewUrls.push(objUrl);
      div.innerHTML = '<img src="' + objUrl + '" alt="">' +
        '<button class="sop-fp-remove" data-idx="' + idx + '" title="Quitar">&times;</button>';
      container.appendChild(div);
    });
    container.querySelectorAll('.sop-fp-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _casosUploadFiles.splice(parseInt(btn.getAttribute('data-idx')), 1);
        sopRenderCasePreviews(container);
      });
    });
  }

  async function sopSubmitCase() {
    var symptom = (sopEl('sopCaseSymptom').value || '').trim();
    var cause = (sopEl('sopCaseCause').value || '').trim();
    var msgEl = sopEl('sopCaseMsg');
    if (!symptom || !cause) { msgEl.innerHTML = '<p style="color:#e74c3c;font-size:13px;">' + _t('st_err_symptom_cause_required', 'S\u00edntoma y Causa Real son requeridos.') + '</p>'; return; }

    var btn = sopEl('sopCaseSubmit');
    btn.disabled = true; btn.textContent = _t('st_sending', 'Enviando...');
    try {
      // Upload photos
      var photoUrls = [];
      for (var i = 0; i < _casosUploadFiles.length; i++) {
        var f = _casosUploadFiles[i];
        var ext = f.name.split('.').pop().toLowerCase();
        var path = 'soporte/casos/' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 6) + '.' + ext;
        var upRes = await supabaseClient.storage.from('school-files').upload(path, f, { contentType: f.type, upsert: false });
        if (upRes.error) throw upRes.error;
        var url = supabaseClient.storage.from('school-files').getPublicUrl(path).data.publicUrl;
        photoUrls.push(url);
      }
      // Insert case
      var ins = await supabaseClient.from('soporte_casos_reales').insert({
        student_email: sopEmail(),
        student_name: sopName(),
        brand: (sopEl('sopCaseBrand').value || '').trim() || null,
        model: (sopEl('sopCaseModel').value || '').trim() || null,
        symptom: symptom,
        cause: cause,
        part_solution: (sopEl('sopCasePart').value || '').trim() || null,
        tip: (sopEl('sopCaseTip').value || '').trim() || null,
        photo_urls: photoUrls,
        approved: false
      });
      if (ins.error) throw ins.error;
      msgEl.innerHTML = '<div class="sop-success-msg">' + _t('st_case_sent_review', 'Caso enviado para revisi\u00f3n. Aparecer\u00e1 una vez aprobado.') + '</div>';
      // Reset form
      ['sopCaseBrand','sopCaseModel','sopCaseSymptom','sopCaseCause','sopCasePart','sopCaseTip'].forEach(function (id) {
        var el = sopEl(id); if (el) el.value = '';
      });
      _sopCasePreviewUrls.forEach(function (u) { URL.revokeObjectURL(u); });
      _sopCasePreviewUrls = [];
      _casosUploadFiles = [];
      var previews = sopEl('sopCasePreviews');
      if (previews) previews.innerHTML = '';
    } catch (err) {
      console.error('[Soporte] case submit error:', err);
      msgEl.innerHTML = '<p style="color:#e74c3c;font-size:13px;">' + _t('st_err_generic', 'Error: ') + esc(err.message || _t('st_try_again', 'intenta de nuevo')) + '</p>';
    }
    btn.disabled = false; btn.textContent = _t('st_submit_case', 'Enviar Caso');
  }

  async function sopLoadCases() {
    var grid = sopEl('sopCasesGrid');
    if (!grid) return;
    if (!supabaseClient || !isOnline) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">' + _t('st_offline', 'Sin conexi\u00f3n.') + '</p>';
      return;
    }
    try {
      var res = await supabaseClient.from('soporte_casos_reales').select('*').eq('approved', true).order('created_at', { ascending: false });
      if (res.error) throw res.error;
      var cases = res.data || [];
      if (cases.length === 0) {
        grid.innerHTML = '<div class="sop-empty-state">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
          '<h3 style="color:var(--text-primary);margin:12px 0 4px;">' + _t('st_no_cases_yet', 'A\u00fan no hay casos') + '</h3>' +
          '<p style="color:var(--text-muted);font-size:13px;">' + _t('st_be_first_case', 'S\u00e9 el primero en compartir un caso real.') + '</p>' +
        '</div>';
        return;
      }
      var html = '';
      cases.forEach(function (c) {
        var tags = ((c.brand || '') + ' ' + (c.model || '') + ' ' + (c.symptom || '') + ' ' + (c.cause || '')).toLowerCase();
        html += '<div class="soporte-case-card" data-tags="' + esc(tags) + '">';
        if (c.brand) html += '<div class="case-brand-badge">' + esc(c.brand) + '</div>';
        html += '<div class="case-header">' +
            '<div class="case-icon">&#128295;</div>' +
            '<div class="case-info">' +
              '<h3 class="case-title">' + esc(truncate(c.symptom, 60)) + '</h3>' +
              (c.model ? '<p class="case-model">' + esc(c.model) + '</p>' : '') +
            '</div>' +
          '</div>';
        html += '<div class="case-symptom"><span class="label">' + _t('st_label_symptom', 'S\u00edntoma:') + '</span> ' + esc(c.symptom) + '</div>';
        html += '<div class="case-cause"><span class="label">' + _t('st_label_real_cause', 'Causa real:') + '</span> ' + esc(c.cause) + '</div>';
        if (c.part_solution) html += '<div class="case-part"><span class="label">' + _t('st_label_part', 'Parte:') + '</span> ' + esc(c.part_solution) + '</div>';
        if (c.tip) html += '<div class="case-lesson">&#128161; <em>' + esc(c.tip) + '</em></div>';
        // Photos
        if (c.photo_urls && c.photo_urls.length > 0) {
          html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;">';
          c.photo_urls.forEach(function (url) {
            html += '<a href="' + esc(url) + '" target="_blank" rel="noopener" style="display:block;width:64px;height:64px;border-radius:8px;overflow:hidden;border:1px solid var(--border-color);">' +
              '<img src="' + esc(url) + '" style="width:100%;height:100%;object-fit:cover;" alt="Foto caso">' +
            '</a>';
          });
          html += '</div>';
        }
        html += '<div class="case-footer">' +
          '<span class="case-source">&#128241; ' + esc(c.student_name || 'T\u00e9cnico') + ' &middot; ' + fmtDate(c.created_at) + '</span>' +
        '</div></div>';
      });
      grid.innerHTML = html;
    } catch (err) {
      console.error('[Soporte] load cases error:', err);
      grid.innerHTML = '<p style="color:#e74c3c;text-align:center;">' + _t('st_err_loading_cases', 'Error al cargar casos.') + '</p>';
    }

    // Search filter
    var searchInput = sopEl('sopCasesSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var q = searchInput.value.toLowerCase();
        var g = sopEl('sopCasesGrid');
        if (!g) return;
        g.querySelectorAll('.soporte-case-card').forEach(function (card) {
          var text = (card.getAttribute('data-tags') || '') + ' ' + card.textContent.toLowerCase();
          card.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
      });
    }
  }

  // ====================================================================
  //  TAB 5 — Diagramas (DB-loaded grid)
  // ====================================================================
  var _diagramasCache = [];

  function sopRenderDiagramas(el) {
    el.innerHTML =
      '<div class="sop-filter-bar" id="sopDiagramaFilters"></div>' +
      '<div id="sopDiagramaGrid" class="sop-diagrama-grid"><div class="sop-loading">' + _t('st_loading_diagrams', 'Cargando diagramas...') + '</div></div>';
    sopLoadDiagramas();
  }

  async function sopLoadDiagramas() {
    var grid = sopEl('sopDiagramaGrid');
    var filtersWrap = sopEl('sopDiagramaFilters');
    if (!grid) return;
    if (!supabaseClient || !isOnline) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">' + _t('st_offline', 'Sin conexi\u00f3n.') + '</p>';
      return;
    }
    try {
      var res = await supabaseClient.from('soporte_diagramas').select('*').eq('active', true)
        .order('brand', { ascending: true }).order('title', { ascending: true });
      if (res.error) throw res.error;
      _diagramasCache = res.data || [];
      if (_diagramasCache.length === 0) {
        grid.innerHTML = '<div class="sop-empty-state">' +
          '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5">' +
            '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>' +
            '<path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>' +
          '</svg>' +
          '<h3 style="color:var(--text-primary);margin:12px 0 4px;">' + _t('st_diagrams_title', 'Diagramas El\u00e9ctricos') + '</h3>' +
          '<p style="color:var(--text-muted);font-size:14px;max-width:320px;margin:0 auto;">' + _t('st_diagrams_empty_desc', 'Los diagramas se agregan desde el panel de administraci\u00f3n.') + '</p>' +
        '</div>';
        if (filtersWrap) filtersWrap.innerHTML = '';
        return;
      }
      // Build filter pills
      sopBuildDiagramaFilters(filtersWrap, _diagramasCache);
      sopRenderDiagramaCards(_diagramasCache, grid);
    } catch (err) {
      console.error('[Soporte] load diagramas error:', err);
      grid.innerHTML = '<p style="color:#e74c3c;text-align:center;">' + _t('st_err_loading_diagrams', 'Error al cargar diagramas.') + '</p>';
    }
  }

  function sopBuildDiagramaFilters(wrap, data) {
    if (!wrap) return;
    var brandSet = {};
    data.forEach(function (d) { if (d.brand) brandSet[d.brand] = true; });
    var brands = Object.keys(brandSet).sort();
    var html = '<div class="sop-filter-pills">' +
      '<button class="sop-pill active" data-brand="all">' + _t('st_filter_all', 'Todos') + '</button>';
    brands.forEach(function (b) {
      html += '<button class="sop-pill" data-brand="' + esc(b) + '">' + esc(b) + '</button>';
    });
    html += '</div>' +
      '<div class="sop-filter-controls">' +
        '<input type="text" class="sop-filter-search" placeholder="' + _t('st_search_diagram_ph', 'Buscar diagrama...') + '" id="sopDiagramaSearch">' +
      '</div>';
    wrap.innerHTML = html;
    wrap.querySelectorAll('.sop-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        wrap.querySelectorAll('.sop-pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        sopFilterDiagramas();
      });
    });
    var searchInput = wrap.querySelector('.sop-filter-search');
    if (searchInput) searchInput.addEventListener('input', function () { sopFilterDiagramas(); });
  }

  function sopFilterDiagramas() {
    var wrap = sopEl('sopDiagramaFilters');
    if (!wrap) return;
    var activePill = wrap.querySelector('.sop-pill.active');
    var brand = activePill ? activePill.getAttribute('data-brand') : 'all';
    var searchInput = sopEl('sopDiagramaSearch');
    var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var filtered = _diagramasCache.filter(function (d) {
      if (brand !== 'all' && (d.brand || '') !== brand) return false;
      if (q) {
        var text = ((d.title || '') + ' ' + (d.description || '') + ' ' + (d.brand || '') + ' ' + (d.category || '')).toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
    var grid = sopEl('sopDiagramaGrid');
    if (grid) sopRenderDiagramaCards(filtered, grid);
  }

  function sopRenderDiagramaCards(items, grid) {
    if (!items || items.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px 0;grid-column:1/-1;">' + _t('st_no_diagrams_found', 'No se encontraron diagramas.') + '</p>';
      return;
    }
    var html = '';
    items.forEach(function (d) {
      var catClass = (d.category || 'wiring').toLowerCase();
      html += '<div class="sop-diagrama-card" data-did="' + esc(d.id) + '" data-gated="' + (d.requires_membership ? '1' : '0') + '" data-url="' + esc(d.file_url) + '">';
      html += '<div class="sop-diagrama-thumb">';
      if (d.thumbnail_url) {
        html += '<img src="' + esc(d.thumbnail_url) + '" alt="' + esc(d.title) + '">';
      } else {
        html += '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>';
      }
      html += '</div><div class="sop-diagrama-body">';
      html += '<div class="sop-diagrama-title">' + esc(d.title) + '</div>';
      html += '<div class="sop-diagrama-badges">';
      if (d.brand) html += '<span class="sop-cat-badge">' + esc(d.brand) + '</span>';
      html += '<span class="sop-diagrama-cat ' + esc(catClass) + '">' + sopCategoryLabel(d.category) + '</span>';
      if (d.requires_membership) html += '<span class="sop-gated-badge-sm">' + _t('st_members_badge', 'Miembros') + '</span>';
      html += '</div></div></div>';
    });
    grid.innerHTML = html;

    // Click handlers
    grid.querySelectorAll('.sop-diagrama-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var url = card.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      });
    });
  }

  // ====================================================================
  //  Shared filter bar (brand pills + search + category dropdown)
  // ====================================================================
  function sopBuildFilterBar(wrap, data, type) {
    if (!wrap) return;

    // Extract unique brands
    var brandSet = {};
    data.forEach(function (item) { if (item.brand) brandSet[item.brand] = true; });
    var brands = Object.keys(brandSet).sort();

    // Extract unique categories
    var catSet = {};
    data.forEach(function (item) { if (item.category) catSet[item.category] = true; });
    var cats = Object.keys(catSet).sort();

    var html = '<div class="sop-filter-pills">' +
      '<button class="sop-pill active" data-brand="all">' + _t('st_filter_all', 'Todos') + '</button>';
    brands.forEach(function (b) {
      html += '<button class="sop-pill" data-brand="' + esc(b) + '">' + esc(b) + '</button>';
    });
    html += '</div>' +
      '<div class="sop-filter-controls">' +
        '<input type="text" class="sop-filter-search" placeholder="' + _t('st_search_ph', 'Buscar...') + '" data-filtertype="' + type + '">' +
        (cats.length > 1
          ? '<select class="sop-filter-cat" data-filtertype="' + type + '">' +
              '<option value="">' + _t('st_all_categories', 'Todas categor\u00edas') + '</option>' +
              cats.map(function (c) { return '<option value="' + esc(c) + '">' + sopCategoryLabel(c) + '</option>'; }).join('') +
            '</select>'
          : '') +
      '</div>';
    wrap.innerHTML = html;

    // Pill click
    wrap.querySelectorAll('.sop-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        wrap.querySelectorAll('.sop-pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        sopApplyFilters(type);
      });
    });

    // Search input
    var searchInput = wrap.querySelector('.sop-filter-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () { sopApplyFilters(type); });
    }

    // Category dropdown
    var catSelect = wrap.querySelector('.sop-filter-cat');
    if (catSelect) {
      catSelect.addEventListener('change', function () { sopApplyFilters(type); });
    }
  }

  function sopApplyFilters(type) {
    var filtersWrap = type === 'video' ? sopEl('sopVideoFilters') : sopEl('sopManualFilters');
    if (!filtersWrap) return;

    var activePill = filtersWrap.querySelector('.sop-pill.active');
    var brand = activePill ? activePill.getAttribute('data-brand') : 'all';
    var searchInput = filtersWrap.querySelector('.sop-filter-search');
    var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var catSelect = filtersWrap.querySelector('.sop-filter-cat');
    var cat = catSelect ? catSelect.value : '';

    var source = type === 'video' ? _videosCache : _manualsCache;
    var filtered = source.filter(function (item) {
      if (brand !== 'all' && (item.brand || '') !== brand) return false;
      if (cat && (item.category || '') !== cat) return false;
      if (q) {
        var text = ((item.title || '') + ' ' + (item.description || '') + ' ' + (item.brand || '') + ' ' + ((item.tags || []).join(' '))).toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    if (type === 'video') {
      var grid = sopEl('sopVideoGrid');
      if (grid) sopRenderVideoCards(filtered, grid);
    } else {
      var list = sopEl('sopManualList');
      if (list) sopRenderManualCards(filtered, list);
    }
  }

  // ── Quiz launcher (preserved from original) ──────────────────────
  window.startSoporteQuiz = function (tag) {
    var qArr = (typeof questions !== 'undefined' && Array.isArray(questions)) ? questions : [];
    var filtered = qArr.filter(function (q) { return q.tags && q.tags.some(function (t) { return t.includes(tag); }); });
    if (filtered.length && typeof showScreen === 'function') {
      showScreen('studySectionsScreen');
    }
  };

  // ====================================================================
  //  FLOATING MARIO BUTTON — orange circular FAB
  // ====================================================================
  var _sopMarioFloatEl = null;

  function sopInjectFloatingMario() {
    if (_sopMarioFloatEl) { _sopMarioFloatEl.style.display = 'flex'; return; }

    // Inject CSS once
    if (!document.getElementById('sopMarioFloatCSS')) {
      var css = document.createElement('style');
      css.id = 'sopMarioFloatCSS';
      css.textContent =
        '#sopMarioFloat{position:fixed;bottom:20px;right:20px;z-index:9998;display:flex;align-items:center;gap:10px;cursor:pointer;' +
          'animation:sopMfPop 0.4s ease-out;}' +
        '#sopMarioFloat .smf-avatar{width:60px;height:60px;border-radius:50%;overflow:hidden;border:3px solid #f39c12;flex-shrink:0;' +
          'box-shadow:0 4px 20px rgba(243,156,18,0.5),0 0 0 4px rgba(243,156,18,0.15);transition:transform 0.2s,box-shadow 0.2s;}' +
        '#sopMarioFloat:hover .smf-avatar{transform:scale(1.1);box-shadow:0 4px 24px rgba(243,156,18,0.7),0 0 0 6px rgba(243,156,18,0.2);}' +
        '#sopMarioFloat .smf-avatar img{width:100%;height:100%;object-fit:cover;}' +
        '#sopMarioFloat .smf-pulse{position:absolute;width:60px;height:60px;border-radius:50%;border:2px solid rgba(243,156,18,0.5);' +
          'animation:sopMfPulse 2s ease-out infinite;pointer-events:none;}' +
        '#sopMarioFloat .smf-label{background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95));' +
          'border:1px solid rgba(243,156,18,0.4);border-radius:12px;padding:6px 14px;font-size:12px;font-weight:700;color:#fde68a;' +
          'white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.3);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}' +
        '@keyframes sopMfPulse{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.6);opacity:0}}' +
        '@keyframes sopMfPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}';
      document.head.appendChild(css);
    }

    // Avatar source — try real Mario avatar, fallback to emoji
    var avatarSrc = 'mario-black.jpg';
    var realAv = document.getElementById('mAvatarPhoto');
    if (realAv && realAv.src) avatarSrc = realAv.src;

    _sopMarioFloatEl = document.createElement('div');
    _sopMarioFloatEl.id = 'sopMarioFloat';
    _sopMarioFloatEl.innerHTML =
      '<div class="smf-pulse"></div>' +
      '<div class="smf-avatar"><img src="' + esc(avatarSrc) + '" alt="Mario" onerror="this.parentElement.innerHTML=\'👨‍🏫\'"></div>' +
      '<div class="smf-label">Maestro Mario AI</div>';
    document.body.appendChild(_sopMarioFloatEl);

    _sopMarioFloatEl.addEventListener('click', function () {
      if (typeof openMaestroTutor === 'function') openMaestroTutor();
    });

    // Auto-hide label after 4 seconds, show just the avatar
    setTimeout(function () {
      var label = _sopMarioFloatEl && _sopMarioFloatEl.querySelector('.smf-label');
      if (label) label.style.display = 'none';
    }, 4000);
  }

  function sopHideFloatingMario() {
    if (_sopMarioFloatEl) _sopMarioFloatEl.style.display = 'none';
  }

  // ====================================================================
  //  LIVE SUPPORT — $300 confirm modal + timer
  // ====================================================================
  function sopShowLiveConfirmModal(stripeUrl) {
    // Clon $59.99 unlocks everything — skip $300 paywall, go straight to session.
    sopCreateLiveTicket();
    sopShowTimerModal();
  }

  function sopCreateLiveTicket() {
    if (!supabaseClient || !isOnline) return;
    var email = sopEmail();
    var name = sopName();
    supabaseClient.from('soporte_tickets').insert({
      student_email: email,
      student_name: name,
      subject: 'Soporte en Vivo 1-a-1 ($300)',
      description: 'Sesión de soporte en vivo solicitada.',
      category: 'live_support'
    }).then(function () {
      try { addNotification('soporte', _t('st_notif_live_scheduled', 'Sesión en vivo agendada')); } catch(e) { console.warn('[SoporteTecnico]', e.message || e); }
      try { notifyAdmin('Soporte en Vivo', name + ' pagó $300 por sesión 1-a-1', 'soporte'); } catch(e) { console.warn('[SoporteTecnico]', e.message || e); }
    }).catch(function (err) { console.warn('[Soporte] live ticket error:', err); });
  }

  function sopShowTimerModal() {
    var overlay = document.createElement('div');
    overlay.className = 'sop-timer-overlay';
    overlay.id = 'sopTimerOverlay';
    var seconds = 0;
    overlay.innerHTML =
      '<div class="sop-timer-modal">' +
        '<div style="font-size:36px;margin-bottom:8px;">📞</div>' +
        '<h3 style="color:var(--text-primary,#fff);margin:0 0 4px;">' + _t('st_live_session', 'Sesión en Vivo') + '</h3>' +
        '<div class="sop-timer-display" id="sopTimerDisplay">00:00:00</div>' +
        '<div class="sop-timer-min">' + _t('st_live_minimum', 'Mínimo: 2 horas ($300)') + '</div>' +
        '<a class="sop-timer-wa-btn" href="https://wa.me/19096390448" target="_blank" rel="noopener">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.315 0-4.458-.764-6.182-2.054l-.432-.338-2.986 1.002 1.002-2.986-.338-.432A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>' +
          '' + _t('st_live_call_whatsapp', 'Llamar por WhatsApp') + '' +
        '</a>' +
        '<button class="sop-timer-end-btn" id="sopTimerEnd">' + _t('st_live_end_session', 'Finalizar Sesión') + '</button>' +
      '</div>';
    document.body.appendChild(overlay);

    function updateDisplay() {
      seconds++;
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = seconds % 60;
      var disp = sopEl('sopTimerDisplay');
      if (disp) disp.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    _sopTimerInterval = setInterval(updateDisplay, 1000);

    document.getElementById('sopTimerEnd').addEventListener('click', function () {
      if (_sopTimerInterval) { clearInterval(_sopTimerInterval); _sopTimerInterval = null; }
      overlay.remove();
    });
  }

  // ====================================================================
  //  INIT — Single robust pattern: MutationObserver + nav click refresh
  // ====================================================================

  function sopTryRender() {
    var screen = sopEl('soporteTecnicoScreen');
    if (!screen || screen.style.display === 'none') return;
    var container = sopEl('soporteContent');
    if (!container) { console.warn('[Soporte] #soporteContent not found'); return; }
    // Only render once per visit — the nav click handler resets this
    if (container.getAttribute('data-sop-init') === '1') return;
    container.setAttribute('data-sop-init', '1');
    sopRender();
  }

  // Primary: MutationObserver on screen visibility changes
  var sopScreen = sopEl('soporteTecnicoScreen');
  if (sopScreen) {
    _sopObserver = new MutationObserver(function () {
      if (sopScreen.style.display !== 'none') {
        sopTryRender();
      } else {
        // Cleanup when navigating away from soporte screen
        sopHideFloatingMario();
        // Clear live-support timer if running
        if (_sopTimerInterval) { clearInterval(_sopTimerInterval); _sopTimerInterval = null; }
        // Revoke any lingering object URLs
        if (_sopManualPreviewUrl) { URL.revokeObjectURL(_sopManualPreviewUrl); _sopManualPreviewUrl = null; }
        _sopCasePreviewUrls.forEach(function (u) { URL.revokeObjectURL(u); });
        _sopCasePreviewUrls = [];
      }
    });
    _sopObserver.observe(sopScreen, { attributes: true, attributeFilter: ['style'] });
  }

  // Secondary: Nav click resets data-sop-init so MutationObserver re-renders with fresh data
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-screen="soporteTecnicoScreen"]')) {
      var container = sopEl('soporteContent');
      if (container) container.removeAttribute('data-sop-init');
    }
  });

  // Immediate: if script loads while screen is already visible (MaestroLoader on-demand)
  sopTryRender();

})();
// ====== /SOPORTE TECNICO ======
