    // ==================== ADMIN: CERTIFICADOS ====================
    if (typeof _addTranslations === 'function') _addTranslations({
      adm_cert_student: { es: 'Estudiante', en: 'Student' },
      adm_cert_approved: { es: 'Aprobado', en: 'Approved' },
      adm_cert_denied: { es: 'Denegado', en: 'Denied' },
      adm_cert_pending: { es: 'Pendiente', en: 'Pending' },
      adm_cert_payment_q: { es: 'Pago?', en: 'Payment?' },
      adm_cert_approve_title: { es: 'Aprobar', en: 'Approve' },
      adm_cert_deny_title: { es: 'Denegar', en: 'Deny' },
      adm_cert_no_certs: { es: 'Sin certificados a\u00FAn. Se guardan cuando un estudiante completa un nivel con 80%+', en: 'No certificates yet. They are saved when a student completes a level with 80%+' },
      adm_cert_confirm_approve: { es: '\u00BFAprobar certificado de ', en: 'Approve certificate for ' },
      adm_cert_confirm_approve2: { es: ' para este estudiante? Podr\u00E1 compartirlo e imprimirlo.', en: ' for this student? They will be able to share and print it.' },
      adm_cert_approved_msg: { es: 'Certificado aprobado', en: 'Certificate approved' },
      adm_cert_confirm_deny: { es: '\u00BFDenegar certificado de ', en: 'Deny certificate for ' },
      adm_cert_confirm_deny2: { es: '? El estudiante NO podr\u00E1 compartirlo ni imprimirlo.', en: '? The student will NOT be able to share or print it.' },
      adm_cert_denied_msg: { es: 'Certificado denegado', en: 'Certificate denied' },
      adm_cert_save_payment_error: { es: 'Error guardando m\u00E9todo de pago: ', en: 'Error saving payment method: ' },
      adm_cert_bulk_approve: { es: '\u00BFAprobar TODOS los certificados pendientes? Esta acci\u00F3n no se puede deshacer.', en: 'Approve ALL pending certificates? This action cannot be undone.' },
      adm_cert_bulk_approved: { es: ' certificados aprobados masivamente', en: ' certificates bulk approved' },
      adm_cert_bulk_approve_error: { es: 'Error en aprobaci\u00F3n masiva: ', en: 'Error in bulk approval: ' },
      adm_cert_bulk_payment: { es: '\u00BFMarcar TODOS los certificados sin m\u00E9todo de pago como ', en: 'Mark ALL certificates without payment method as ' },
      adm_cert_bulk_payment_done: { es: ' certificados marcados como ', en: ' certificates marked as ' },
      adm_cert_bulk_payment_error: { es: 'Error en pago masivo: ', en: 'Error in bulk payment: ' },
      adm_cert_principiante: { es: 'Principiante', en: 'Beginner' },
      adm_cert_intermedio: { es: 'Intermedio', en: 'Intermediate' },
      adm_cert_avanzado: { es: 'Avanzado', en: 'Advanced' },
      adm_cert_elite: { es: 'Elite', en: 'Elite' },
      adm_cert_platino: { es: 'Platino', en: 'Platinum' },
    });
    async function loadAdminCertificates() {
      try { dirSigInitCrm(); } catch (_) {}
      if (!supabaseClient) return;
      try {
        // Try fetching certificates with user name join
        var certs = [];
        try {
          var { data: certsJoin } = await supabaseClient.from('certificates').select('*, users(nombre, email)').order('fecha_obtenido', { ascending: false }).limit(500);
          certs = certsJoin || [];
        } catch(joinErr) {
          // Fallback: no FK relationship, fetch separately
          var { data: certsPlain } = await supabaseClient.from('certificates').select('*').order('fecha_obtenido', { ascending: false }).limit(500);
          certs = certsPlain || [];
        }
        // If join returned data but users is null, fetch users separately for name lookup
        var _certUsersMap = {};
        if (certs.length > 0 && !certs[0].users) {
          try {
            var userIds = [...new Set(certs.map(function(c) { return c.user_id; }).filter(Boolean))];
            var _ud_usersData = await usersDataAdmin('admin_list', { filters: { id_in: userIds }, fields: ['id','nombre','email'], limit: 5000 }); var usersData = _ud_usersData.data || [];
            (usersData || []).forEach(function(u) { _certUsersMap[u.id] = u; });
          } catch(e) { console.log('[Admin Certs] Users lookup fallback error:', e); }
        }

        var totalCerts = certs.length;
        var uniqueStudents = [...new Set(certs.map(function(c) { return c.user_id; }))].length;
        // Fix Bug #5: Get actual total students from Supabase instead of allTechnicians
        var totalStudentsCount = 0;
        try {
          var _ud_studCount = await usersDataAdmin('admin_count', {}); var studCount = _ud_studCount.count;
          totalStudentsCount = studCount || 0;
        } catch(e) { totalStudentsCount = 0; }
        var totalStudents = totalStudentsCount || (typeof allTechnicians !== 'undefined' && allTechnicians && allTechnicians.length) || 1;
        var certRate = Math.round((uniqueStudents / totalStudents) * 100);

        var _acEl1 = document.getElementById('acTotalCerts');
        var _acEl2 = document.getElementById('acStudentsWithCert');
        var _acEl3 = document.getElementById('acCertRate');
        if (_acEl1) _acEl1.textContent = totalCerts;
        if (_acEl2) _acEl2.textContent = uniqueStudents;
        if (_acEl3) _acEl3.textContent = certRate + '%';

        // By level
        var byLevel = {};
        var levelNames = {principiante:_t('adm_cert_principiante','Principiante'),intermedio:_t('adm_cert_intermedio','Intermedio'),avanzado:_t('adm_cert_avanzado','Avanzado'),elite:_t('adm_cert_elite','Elite'),platino:_t('adm_cert_platino','Platino')};
        var levelColors = {principiante:'#3498db',intermedio:'#27ae60',avanzado:'#f39c12',elite:'#e74c3c',platino:'#9b59b6'};
        certs.forEach(function(c) {
          if (!byLevel[c.nivel]) byLevel[c.nivel] = 0;
          byLevel[c.nivel]++;
        });

        var levelHtml = '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
        Object.entries(levelNames).forEach(function(e) {
          var nivel = e[0], name = e[1];
          var count = byLevel[nivel] || 0;
          var color = levelColors[nivel] || '#64748b';
          levelHtml += '<div style="background:rgba(' + (nivel==='principiante'?'52,152,219':nivel==='intermedio'?'39,174,96':nivel==='avanzado'?'243,156,18':nivel==='elite'?'231,76,60':'155,89,182') + ',0.1);border:1px solid ' + color + '33;border-radius:8px;padding:8px 14px;text-align:center;min-width:80px;">' +
            '<div style="font-size:18px;font-weight:bold;color:' + color + ';">' + count + '</div>' +
            '<div style="font-size:9px;color:#64748b;">' + name + '</div></div>';
        });
        levelHtml += '</div>';
        var _acByLvl = document.getElementById('acByLevel');
        if (_acByLvl) _acByLvl.innerHTML = levelHtml;

        // Recent certificates with approval controls + payment method
        var recentHtml = certs.slice(0, 30).map(function(c) {
          // Get name from join data, users map, or allTechnicians lookup
          var name = _t('adm_cert_student', 'Estudiante');
          if (c.users && (c.users.nombre || c.users.email)) {
            name = c.users.nombre || c.users.email;
          } else if (_certUsersMap[c.user_id]) {
            name = _certUsersMap[c.user_id].nombre || _certUsersMap[c.user_id].email;
          } else {
            var userInfo = (window.allTechnicians || []).find(function(t) { return t.supabaseId === c.user_id || t.id === c.user_id; });
            if (userInfo) name = userInfo.nombre || userInfo.email || _t('adm_cert_student', 'Estudiante');
          }
          var nivel = c.nivel ? c.nivel.charAt(0).toUpperCase() + c.nivel.slice(1) : '?';
          var fecha = c.fecha_obtenido ? new Date(c.fecha_obtenido).toLocaleDateString('es-MX') : '—';
          var score = c.porcentaje || c.score || '—';
          var code = c.certificate_number || '—';
          var certStatus = c.cert_status || 'pending';
          var payMethod = c.payment_method || '';

          var statusHtml = '';
          if (certStatus === 'approved') {
            statusHtml = '<span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">\u2705 ' + _t('adm_cert_approved', 'Aprobado') + '</span>';
          } else if (certStatus === 'denied') {
            statusHtml = '<span style="background:#fef2f2;color:#dc2626;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">\u274C ' + _t('adm_cert_denied', 'Denegado') + '</span>';
          } else {
            statusHtml = '<span style="background:#fffbeb;color:#d97706;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">\u23F3 ' + _t('adm_cert_pending', 'Pendiente') + '</span>';
          }

          // Payment method badge
          var payBadge = '';
          var payIcons = { stripe: '💳 Stripe', zelle: '🏦 Zelle', cash: '💵 Cash' };
          var payColors = { stripe: 'background:#ede9fe;color:#7c3aed;border:1px solid #c4b5fd', zelle: 'background:#ecfdf5;color:#059669;border:1px solid #6ee7b7', cash: 'background:#fef9c3;color:#a16207;border:1px solid #fde047' };
          if (payMethod && payIcons[payMethod]) {
            payBadge = '<span style="' + payColors[payMethod] + ';padding:2px 6px;border-radius:8px;font-size:9px;font-weight:600;">' + payIcons[payMethod] + '</span>';
          } else {
            payBadge = '<select onchange="adminSetPaymentMethod(\'' + c.user_id + '\',\'' + c.nivel + '\',this.value)" style="padding:2px 4px;border-radius:6px;border:1px solid #cbd5e1;font-size:9px;background:#f8fafc;color:#475569;cursor:pointer;">' +
              '<option value="">\uD83D\uDCB0 ' + _t('adm_cert_payment_q', 'Pago?') + '</option>' +
              '<option value="stripe">💳 Stripe</option>' +
              '<option value="zelle">🏦 Zelle</option>' +
              '<option value="cash">💵 Cash</option>' +
            '</select>';
          }

          var actionBtns = '';
          if (certStatus !== 'approved') {
            actionBtns += '<button onclick="adminApproveCert(\'' + c.user_id + '\',\'' + c.nivel + '\')" style="padding:3px 8px;border-radius:5px;border:none;background:#27ae60;color:#fff;cursor:pointer;font-size:10px;" title="' + _t('adm_cert_approve_title', 'Aprobar') + '">\u2705</button> ';
          }
          if (certStatus !== 'denied') {
            actionBtns += '<button onclick="adminDenyCert(\'' + c.user_id + '\',\'' + c.nivel + '\')" style="padding:3px 8px;border-radius:5px;border:none;background:#e74c3c;color:#fff;cursor:pointer;font-size:10px;" title="' + _t('adm_cert_deny_title', 'Denegar') + '">\u274C</button>';
          }

          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;gap:8px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:130px;"><span style="font-weight:600;color:#1e293b;">' + _escHtml(name) + '</span><br><span style="font-size:10px;color:#94a3b8;">' + _escHtml(code) + '</span></div>' +
            '<div style="text-align:center;">' + statusHtml + '</div>' +
            '<div style="text-align:center;">' + payBadge + '</div>' +
            '<div style="text-align:center;min-width:60px;">' + actionBtns + '</div>' +
            '<div style="text-align:right;min-width:80px;"><span style="color:' + (levelColors[c.nivel]||'#64748b') + ';font-weight:600;font-size:12px;">' + _escHtml(nivel) + '</span><br><span style="font-size:10px;color:#94a3b8;">' + _escHtml(String(fecha)) + ' · ' + _escHtml(String(score)) + '%</span></div>' +
          '</div>';
        }).join('');
        document.getElementById('acRecentCerts').innerHTML = recentHtml || '<div style="text-align:center;padding:15px;color:#94a3b8;">' + _t('adm_cert_no_certs', 'Sin certificados a\u00FAn. Se guardan cuando un estudiante completa un nivel con 80%+') + '</div>';

      } catch(e) { console.error('[Admin Certs]', e); }
    }

    // ==================== ADMIN CERTIFICATE APPROVAL ====================
    async function adminApproveCert(userId, nivel) {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert('Acceso denegado'); return; }
      if (!confirm(_t('adm_cert_confirm_approve', '\u00BFAprobar certificado de ') + nivel + _t('adm_cert_confirm_approve2', ' para este estudiante? Podr\u00E1 compartirlo e imprimirlo.'))) return;
      try {
        await supabaseClient.from('certificates').update({ cert_status: 'approved' }).eq('user_id', userId).eq('nivel', nivel);
        alert('\u2705 ' + _t('adm_cert_approved_msg', 'Certificado aprobado'));
        loadAdminCertificates();
      } catch(e) { alert('Error: ' + e.message); }
    }

    async function adminDenyCert(userId, nivel) {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert('Acceso denegado'); return; }
      if (!confirm(_t('adm_cert_confirm_deny', '\u00BFDenegar certificado de ') + nivel + _t('adm_cert_confirm_deny2', '? El estudiante NO podr\u00E1 compartirlo ni imprimirlo.'))) return;
      try {
        await supabaseClient.from('certificates').update({ cert_status: 'denied' }).eq('user_id', userId).eq('nivel', nivel);
        alert('\u274C ' + _t('adm_cert_denied_msg', 'Certificado denegado'));
        loadAdminCertificates();
      } catch(e) { alert('Error: ' + e.message); }
    }

    async function adminSetPaymentMethod(userId, nivel, method) {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert('Acceso denegado'); return; }
      if (!method) return;
      try {
        await supabaseClient.from('certificates').update({ payment_method: method }).eq('user_id', userId).eq('nivel', nivel);
        console.log('[Admin] Payment method set:', method, 'for', userId, nivel);
        loadAdminCertificates();
      } catch(e) { alert(_t('adm_cert_save_payment_error', 'Error guardando m\u00E9todo de pago: ') + e.message); }
    }

    // ==================== BULK CERTIFICATE OPERATIONS ====================
    async function adminBulkApproveCerts() {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert('Acceso denegado'); return; }
      if (!confirm(_t('adm_cert_bulk_approve', '\u00BFAprobar TODOS los certificados pendientes? Esta acci\u00F3n no se puede deshacer.'))) return;
      try {
        var { data, error } = await supabaseClient.from('certificates').update({ cert_status: 'approved' }).eq('cert_status', 'pending').select();
        if (error) throw error;
        var count = data ? data.length : 0;
        alert('\u2705 ' + count + _t('adm_cert_bulk_approved', ' certificados aprobados masivamente'));
        loadAdminCertificates();
      } catch(e) { alert(_t('adm_cert_bulk_approve_error', 'Error en aprobaci\u00F3n masiva: ') + e.message); }
    }

    async function adminBulkSetPayment(method) {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert('Acceso denegado'); return; }
      var methodNames = { stripe: 'Stripe', zelle: 'Zelle', cash: 'Cash' };
      if (!confirm(_t('adm_cert_bulk_payment', '\u00BFMarcar TODOS los certificados sin m\u00E9todo de pago como ') + (methodNames[method] || method) + '?')) return;
      try {
        var { data: data1, error: error1 } = await supabaseClient.from('certificates').update({ payment_method: method }).is('payment_method', null).select();
        if (error1) throw error1;
        var { data: data2, error: error2 } = await supabaseClient.from('certificates').update({ payment_method: method }).eq('payment_method', '').select();
        if (error2) throw error2;
        var count = (data1 ? data1.length : 0) + (data2 ? data2.length : 0);
        alert('\uD83D\uDCB0 ' + count + _t('adm_cert_bulk_payment_done', ' certificados marcados como ') + (methodNames[method] || method));
        loadAdminCertificates();
      } catch(e) { alert(_t('adm_cert_bulk_payment_error', 'Error en pago masivo: ') + e.message); }
    }

    // ==================== FIRMA DEL DIRECTOR ====================
    // Mario 2026-06-02. Se dibuja una vez aquí (CRM, master verificado contra
    // admin_staff vía la edge function cta-video-save → app_config.director_signature).
    // La app la lee y la estampa en todos los certificados válidos del Desafío.
    var _dscSbUrl = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
    function _dscSbKey() {
      if (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) return SUPABASE_KEY;
      if (typeof SUPABASE_ANON_KEY !== 'undefined' && SUPABASE_ANON_KEY) return SUPABASE_ANON_KEY;
      try { if (window.supabaseClient && window.supabaseClient.supabaseKey) return window.supabaseClient.supabaseKey; } catch (_) {}
      return '';
    }
    function _dscAdminEmail() {
      try { if (typeof getAdminEmail === 'function') { var e = getAdminEmail(); if (e) return e; } } catch (_) {}
      try { return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; }
    }
    var _dscDrawing = false, _dscHasInk = false;
    function dirSigInitCrm() {
      var cv = document.getElementById('dirSigCanvasCrm'); if (!cv) return;
      // Load + preview the current saved signature (anon SELECT allowed on app_config)
      try {
        fetch(_dscSbUrl + '/rest/v1/app_config?select=value&key=eq.director_signature', { headers: { apikey: _dscSbKey(), Authorization: 'Bearer ' + _dscSbKey() } })
          .then(function (r) { return r.json(); })
          .then(function (rows) {
            var v = (rows && rows[0] && rows[0].value) ? rows[0].value : '';
            var wrap = document.getElementById('dirSigCurrentWrap');
            if (wrap) wrap.innerHTML = v ? '<div style="font-size:11px;color:#16a34a;font-weight:700;margin-bottom:4px;">✅ Firma actual guardada:</div><img src="' + v + '" style="max-height:48px;max-width:180px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:4px;">' : '<div style="font-size:11px;color:#dc2626;font-weight:700;">⚠️ Aún no hay firma. Los certificados saldrán marcados como NO válidos hasta que firmes.</div>';
          }).catch(function () {});
      } catch (_) {}
      // Set up the drawing canvas
      var ratio = window.devicePixelRatio || 1;
      var rect = cv.getBoundingClientRect();
      cv.width = Math.round((rect.width || 320) * ratio);
      cv.height = Math.round(160 * ratio);
      var ctx = cv.getContext('2d');
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0f172a';
      _dscHasInk = false;
      function pos(e) {
        var r = cv.getBoundingClientRect();
        var t = (e.touches && e.touches[0]) ? e.touches[0] : e;
        return { x: t.clientX - r.left, y: t.clientY - r.top };
      }
      function start(e) { e.preventDefault(); _dscDrawing = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
      function move(e) { if (!_dscDrawing) return; e.preventDefault(); var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); _dscHasInk = true; }
      function end() { _dscDrawing = false; }
      cv.onmousedown = start; cv.onmousemove = move; cv.onmouseup = end; cv.onmouseleave = end;
      cv.ontouchstart = start; cv.ontouchmove = move; cv.ontouchend = end;
    }
    function dirSigClearCrm() {
      var cv = document.getElementById('dirSigCanvasCrm'); if (!cv) return;
      cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); _dscHasInk = false;
      var m = document.getElementById('dirSigMsgCrm'); if (m) m.textContent = '';
    }
    function dirSigSaveCrm() {
      var cv = document.getElementById('dirSigCanvasCrm'); var msg = document.getElementById('dirSigMsgCrm');
      if (!cv || !_dscHasInk) { if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'Dibuja tu firma primero.'; } return; }
      var dataUrl; try { dataUrl = cv.toDataURL('image/png'); } catch (_) { dataUrl = null; }
      if (!dataUrl) { if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'No se pudo capturar la firma.'; } return; }
      if (msg) { msg.style.color = '#334155'; msg.textContent = 'Guardando...'; }
      fetch(_dscSbUrl + '/functions/v1/cta-video-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': _dscSbKey(), 'Authorization': 'Bearer ' + _dscSbKey() },
        body: JSON.stringify({ action: 'save_director_signature', signature: dataUrl, admin_email: _dscAdminEmail() })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && res.ok) {
          if (msg) { msg.style.color = '#16a34a'; msg.textContent = '✅ Firma guardada. Ya se estampa en todos los certificados válidos.'; }
          try { dirSigInitCrm(); } catch (_) {}
        } else {
          if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'Error: ' + ((res && res.error) || 'no se pudo guardar') + '. ¿Estás logueado como master?'; }
        }
      }, function () { if (msg) { msg.style.color = '#dc2626'; msg.textContent = 'Error de red al guardar.'; } });
    }
    window.dirSigInitCrm = dirSigInitCrm;
    window.dirSigClearCrm = dirSigClearCrm;
    window.dirSigSaveCrm = dirSigSaveCrm;

    // ==================== END ADMIN SECTION ====================
