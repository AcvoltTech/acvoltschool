    // ==================== FINANZAS DASHBOARD — AUDITORÍA #3 ====================
    if (typeof _addTranslations === 'function') _addTranslations({
      fin_offline: { es: '⚠️ Sin conexión', en: '⚠️ Offline' },
      fin_pct_of_total: { es: '% del total', en: '% of total' },
      fin_paying: { es: '✅ Pagando:', en: '✅ Paying:' },
      fin_canceled_30d: { es: '❌ Cancelados (30d):', en: '❌ Canceled (30d):' },
      fin_conversion: { es: '📊 Conversión:', en: '📊 Conversion:' },
      fin_price_month: { es: '💰 Precio/mes:', en: '💰 Price/month:' },
      fin_churn_high: { es: '⚠️ Churn alto', en: '⚠️ High churn' },
      fin_churn_msg: { es: 'Considera activar alertas de inactividad para retener estudiantes.', en: 'Consider enabling inactivity alerts to retain students.' },
      fin_error_loading: { es: 'Error cargando datos:', en: 'Error loading data:' },
      fin_no_email: { es: 'No hay email para este cobro', en: 'No email for this charge' },
      fin_table_unavailable: { es: 'Tabla student_success_tickets no disponible', en: 'student_success_tickets table not available' },
      fin_importing: { es: '⏳ Importando cobros fallidos a Student Success...', en: '⏳ Importing failed charges to Student Success...' },
      fin_no_failed: { es: '❌ No hay cobros fallidos para importar. Carga datos de Stripe primero.', en: '❌ No failed charges to import. Load Stripe data first.' },
      fin_table_missing: { es: '❌ La tabla student_success_tickets no existe en Supabase. Créala primero.', en: '❌ The student_success_tickets table does not exist in Supabase. Create it first.' },
      fin_importing_progress: { es: '⏳ Importando...', en: '⏳ Importing...' },
      fin_new: { es: 'nuevos', en: 'new' },
      fin_existing: { es: 'ya existentes', en: 'already existing' },
      fin_import_complete: { es: '✅ Importación completa:', en: '✅ Import complete:' },
      fin_tickets_created: { es: 'tickets creados', en: 'tickets created' },
      fin_existed: { es: 'ya existían', en: 'already existed' },
      fin_errors: { es: 'errores', en: 'errors' },
      fin_go_to_ss: { es: 'Ve a 🎫 Student Success → 🔴 Cobros Fallidos para dar seguimiento.', en: 'Go to 🎫 Student Success → 🔴 Failed Charges for follow-up.' },
      fin_no_new_tickets: { es: '⚠️ No se importaron tickets nuevos.', en: '⚠️ No new tickets were imported.' },
      fin_existed_in_ss: { es: 'ya existían en Student Success.', en: 'already existed in Student Success.' },
    });

    // Cache populated by loadFinanzasStripe; consumed by failed-charge import flows below.
    var stripeDataCache = null;

    async function loadFinanzasStripe() {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { console.warn('[Finanzas] Unauthorized'); return; }
      var statusEl = document.getElementById('stripeConnStatus');
      try {
        if (statusEl) statusEl.textContent = '⏳ Cargando datos de Stripe...';
        var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
        var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
        var adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
        var res = await fetch(sbUrl + '/functions/v1/get-stripe-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + (await window.getAdminBearer()) },
          // FIX 2026-06-25: NO mandamos admin_email — verifyAdminAuth da 403 si no coincide con
          // el email del JWT (tu sesion es gmail pero el panel guardaba hotmail). La funcion te
          // identifica por tu JWT; ambos correos son master. (get-stripe-data solo lo usaba para ese check.)
          body: JSON.stringify({ action: 'dashboard' })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var data = await res.json();
        if (data.error) throw new Error(data.error);

        var charges = Array.isArray(data.charges) ? data.charges : [];
        var subs = (data.subscriptions && data.subscriptions.active) ? data.subscriptions.active : [];
        var balance = data.balance || {};

        var succeeded = charges.filter(function(c) { return c.status === 'succeeded' && c.paid; });
        var failedList = charges.filter(function(c) { return c.status === 'failed' || c.paid === false; });
        var refunded = charges.filter(function(c) { return c.refunded; });
        var disputed = charges.filter(function(c) { return c.disputed; });

        var mrr = subs.reduce(function(sum, s) {
          var item = s.items && s.items.data && s.items.data[0];
          var amt = item && item.price && item.price.unit_amount ? item.price.unit_amount : 0;
          return sum + amt;
        }, 0) / 100;
        var failedAmount = failedList.reduce(function(sum, c) { return sum + (c.amount || 0); }, 0) / 100;
        var available = (balance.available && balance.available[0] && balance.available[0].amount) ? balance.available[0].amount / 100 : 0;

        stripeDataCache = { charges: charges, subscriptions: subs, failed_charges_list: failedList, balance: balance };

        var setText = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
        setText('stripeMRR', '$' + Math.round(mrr).toLocaleString());
        setText('stripeActiveSubs', subs.length);
        setText('stripeFailedCharges', failedList.length);
        setText('stripeFailedAmount', '$' + failedAmount.toFixed(2) + ' perdido');
        setText('stripeBalance', '$' + Math.round(available).toLocaleString());
        setText('stripeTotalTrans', charges.length);
        setText('stripeSuccessTrans', succeeded.length);
        setText('stripeFailedTrans', failedList.length);
        setText('stripeRefundTrans', refunded.length);
        setText('stripeDisputeTrans', disputed.length);
        if (statusEl) statusEl.textContent = '✅ Conectado — ' + succeeded.length + ' cobros exitosos';
      } catch (e) {
        console.error('[Finanzas] loadFinanzasStripe error:', e);
        if (statusEl) statusEl.textContent = '❌ Error: ' + (e.message || e);
      }
    }

    async function loadFinanzasData() {
      if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { console.warn('[Finanzas] Unauthorized access attempt'); return; }
      if (!isOnline) { document.getElementById('finBreakdown').textContent = _t('fin_offline'); return; }
      try {
        // Get membership data via edge function (bypasses RLS)
        var adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
        var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
        var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
        var res = await fetch(sbUrl + '/functions/v1/admin-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + (await window.getAdminBearer()) },
          // FIX 2026-06-25: sin admin_email (evita el 403 por mismatch gmail/hotmail; te identifica por JWT).
          body: JSON.stringify({ action: 'memberships' }),
        });
        var resData = await res.json();
        if (resData.error) { console.error('[Finanzas] Edge function error:', resData.error); }
        var memberships = resData.memberships || [];

        var totalUsers = window.allTechnicians ? window.allTechnicians.length : 0;
        var now = new Date();
        var thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate metrics
        var activeMemberships = memberships.filter(function(m) { return m.activa === true; });
        var canceledRecent = memberships.filter(function(m) {
          return m.activa === false &&
                 m.updated_at && new Date(m.updated_at) >= thirtyDaysAgo;
        });
        var payingCount = activeMemberships.length;
        var canceledCount = canceledRecent.length;

        // Calculate REAL average price from all active memberships
        var avgPrice = 0;
        var membershipsWithAmount = activeMemberships.filter(function(m) { return m.amount && m.amount > 0; });
        if (membershipsWithAmount.length > 0) {
          var totalAmount = membershipsWithAmount.reduce(function(sum, m) { return sum + m.amount; }, 0);
          avgPrice = Math.round(totalAmount / membershipsWithAmount.length);
        }

        var mrr = membershipsWithAmount.length > 0
          ? membershipsWithAmount.reduce(function(sum, m) { return sum + m.amount; }, 0)
          : payingCount * avgPrice;
        var churnRate = payingCount > 0 ? ((canceledCount / (payingCount + canceledCount)) * 100).toFixed(1) : 0;
        var ltv = churnRate > 0 ? Math.round(avgPrice / (parseFloat(churnRate) / 100)) : avgPrice * 12;
        var totalRevenue = memberships.filter(function(m) { return m.activa === true; }).length * avgPrice;
        var freeUsers = Math.max(0, totalUsers - payingCount);

        // Update UI
        document.getElementById('finMRR').textContent = '$' + mrr.toLocaleString();
        document.getElementById('finPaying').textContent = payingCount;
        document.getElementById('finPayingPct').textContent = (totalUsers > 0 ? Math.round((payingCount/totalUsers)*100) : 0) + _t('fin_pct_of_total') + ' (' + totalUsers + ')';
        document.getElementById('finChurn').textContent = churnRate + '%';
        document.getElementById('finLTV').textContent = '$' + ltv.toLocaleString();
        document.getElementById('finTotal').textContent = '$' + totalRevenue.toLocaleString();
        document.getElementById('finActive').textContent = payingCount;
        document.getElementById('finCanceled').textContent = canceledCount;
        document.getElementById('finFree').textContent = freeUsers;

        // Breakdown
        var breakdown = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        breakdown += '<div style="color:#2ecc71;">' + _t('fin_paying') + ' <strong>' + payingCount + '</strong></div>';
        breakdown += '<div style="color:#e74c3c;">' + _t('fin_canceled_30d') + ' <strong>' + canceledCount + '</strong></div>';
        breakdown += '<div style="color:#3498db;">' + _t('fin_conversion') + ' <strong>' + (totalUsers > 0 ? Math.round((payingCount/totalUsers)*100) : 0) + '%</strong></div>';
        breakdown += '<div style="color:#f39c12;">' + _t('fin_price_month') + ' <strong>$' + avgPrice + '</strong></div>';
        breakdown += '</div>';
        if (churnRate > 5) {
          breakdown += '<div style="margin-top:10px;padding:8px;background:rgba(231,76,60,0.2);border-radius:8px;color:#e74c3c;font-size:11px;">' + _t('fin_churn_high') + ' (' + churnRate + '%). ' + _t('fin_churn_msg') + '</div>';
        }
        document.getElementById('finBreakdown').innerHTML = breakdown;

        console.log('[Finanzas] MRR: $' + mrr + ' | Paying: ' + payingCount + ' | Churn: ' + churnRate + '%');
      } catch(e) {
        console.error('[Finanzas] Error:', e);
        document.getElementById('finBreakdown').innerHTML = '<span style="color:#e74c3c;">' + _t('fin_error_loading') + ' ' + _escHtml(e.message) + '</span>';
      }
    }

    // ---- IMPORT FAILED CHARGES TO STUDENT SUCCESS ----

    async function createSingleFailedTicket(email, amount, failMsg, stripeId, btn) {
      if (!email) { alert(_t('fin_no_email')); return; }
      btn.disabled = true;
      btn.textContent = '⏳';
      try {
        var { data: existing, error: checkErr } = await supabaseClient.from('student_success_tickets')
          .select('id').eq('student_email', email).eq('tipo', 'pago_fallido')
          .ilike('descripcion', '%' + stripeId + '%').limit(1);
        if (checkErr) { console.warn('[Ticket] Table not available:', checkErr.message); btn.textContent = '⚠️'; btn.title = _t('fin_table_unavailable'); return; }
        if (existing && existing.length > 0) {
          btn.textContent = '✓';
          btn.style.background = '#94a3b8';
          return;
        }
        var studentName = '';
        var studentPhone = '';
        var _ud_userData = await usersDataAdmin('admin_get', { email: email, fields: ["nombre","telefono"] }); var userData = _ud_userData.data ? [_ud_userData.data] : [];
        if (userData && userData[0]) { studentName = userData[0].nombre || ''; studentPhone = userData[0].telefono || ''; }

        var { error: insertErr } = await supabaseClient.from('student_success_tickets').insert({
          student_email: email,
          student_name: studentName || email,
          student_phone: studentPhone || '',
          tipo: 'pago_fallido',
          estado: 'abierto',
          prioridad: 'alta',
          descripcion: 'COBRO FALLIDO $' + (amount/100).toFixed(2) + ' | ' + failMsg + ' | Stripe: ' + stripeId + ' | LLAMAR para actualizar metodo de pago.',
          monto: amount/100,
          email_enviado_estudiante: false
        });
        if (insertErr) { console.error('[Ticket] Insert error:', insertErr.message); btn.textContent = '❌'; btn.style.background = '#dc2626'; btn.title = insertErr.message; return; }
        btn.textContent = '✅';
        btn.style.background = '#16a34a';
        try { loadSSTickets('abierto'); } catch(e) { console.warn('[Finanzas]', e.message || e); }
      } catch(e) {
        btn.textContent = '❌';
        btn.style.background = '#dc2626';
        console.error('[Ticket]', e);
      }
    }

    // ===== AUTO-IMPORT FAILED CHARGES TO STUDENT SUCCESS =====
    async function autoImportFailedToSS() {
      if (!stripeDataCache || !stripeDataCache.failed_charges_list || !stripeDataCache.failed_charges_list.length) return;
      if (!supabaseClient) return;

      var failedList = stripeDataCache.failed_charges_list;
      var imported = 0;

      // Quick check: verify the table exists before looping
      var { error: tableCheck } = await supabaseClient.from('student_success_tickets').select('id').limit(1);
      if (tableCheck) { console.warn('[AutoImport] student_success_tickets table not available:', tableCheck.message); return; }

      for (var i = 0; i < failedList.length; i++) {
        var fc = failedList[i];
        var email = fc.customer_email || '';
        if (!email) continue;

        try {
          // Check if ticket already exists
          var { data: existing, error: existErr } = await supabaseClient.from('student_success_tickets')
            .select('id')
            .eq('student_email', email)
            .eq('tipo', 'pago_fallido')
            .ilike('descripcion', '%' + fc.id + '%')
            .limit(1);

          if (existErr) { console.warn('[AutoImport] Query error:', existErr.message); continue; }
          if (existing && existing.length > 0) continue;

          // Get student info
          var studentName = fc.customer_name || '';
          var studentPhone = '';
          if (email) {
            try {
              var _ud_userData = await usersDataAdmin('admin_get', { email: email, fields: ["nombre","telefono"] });
              var userData = _ud_userData.data ? [_ud_userData.data] : [];
              if (userData && userData[0]) {
                studentName = studentName || userData[0].nombre || '';
                studentPhone = userData[0].telefono || '';
              }
            } catch(e) { console.warn('[Finanzas]', e.message || e); }
          }

          var amount = (fc.amount / 100).toFixed(2);
          var failDate = new Date(fc.created * 1000);
          var fecha = failDate.toLocaleDateString('es-MX');
          var ageHours = (Date.now() - failDate.getTime()) / 3600000;

          // Auto-assign priority based on age
          var prioridad = 'alta';
          var fechaLimite = new Date();
          if (ageHours < 24) {
            prioridad = 'alta';
            fechaLimite.setDate(fechaLimite.getDate() + 1);
          } else if (ageHours < 72) {
            prioridad = 'alta';
            fechaLimite.setDate(fechaLimite.getDate() + 2);
          } else if (ageHours < 168) {
            prioridad = 'media';
            fechaLimite.setDate(fechaLimite.getDate() + 3);
          } else {
            prioridad = 'baja';
            fechaLimite.setDate(fechaLimite.getDate() + 7);
          }

          var { error: insErr } = await supabaseClient.from('student_success_tickets').insert({
            student_email: email,
            student_name: studentName || email,
            student_phone: studentPhone || '',
            tipo: 'pago_fallido',
            estado: 'abierto',
            prioridad: prioridad,
            descripcion: 'COBRO FALLIDO $' + amount + ' | Fecha: ' + fecha + ' | ' + (fc.failure_message || 'Declined') + ' | Stripe: ' + fc.id + ' | LLAMAR para actualizar metodo de pago.',
            monto: parseFloat(amount),
            fecha_limite: fechaLimite.toISOString(),
            email_enviado_estudiante: false
          });
          if (insErr) { console.warn('[AutoImport] Insert error for ' + email + ':', insErr.message); continue; }
          imported++;
        } catch(e) {
          console.warn('[AutoImport] Skip:', email, e.message || e);
        }
      }

      if (imported > 0) {
        console.log('[AutoImport] ' + imported + ' new failed charges imported to Student Success');
        // Refresh Student Success view
        try { loadSSTicketsFiltered(); loadSSStats(); } catch(e) { console.warn('[Finanzas]', e.message || e); }
      }
    }
    // ===== END AUTO-IMPORT =====

    var _importFailedRunning = false;
    async function importFailedToStudentSuccess() {
      if (_importFailedRunning) return;
      _importFailedRunning = true;
      var statusEl = document.getElementById('stripeImportStatus');
      statusEl.style.display = 'block';
      statusEl.style.background = 'rgba(99,91,255,0.1)';
      statusEl.style.color = '#635bff';
      statusEl.innerHTML = _t('fin_importing');

      if (!stripeDataCache || !stripeDataCache.failed_charges_list || !stripeDataCache.failed_charges_list.length) {
        statusEl.style.background = 'rgba(231,76,60,0.1)';
        statusEl.style.color = '#dc2626';
        statusEl.innerHTML = _t('fin_no_failed');
        return;
      }

      // Verify table exists before proceeding
      var { error: tableCheck } = await supabaseClient.from('student_success_tickets').select('id').limit(1);
      if (tableCheck) {
        statusEl.style.background = 'rgba(231,76,60,0.1)';
        statusEl.style.color = '#dc2626';
        statusEl.innerHTML = _t('fin_table_missing');
        console.error('[Import] Table not available:', tableCheck.message);
        return;
      }

      var failedList = stripeDataCache.failed_charges_list;
      var imported = 0;
      var skipped = 0;
      var errors = 0;

      for (var i = 0; i < failedList.length; i++) {
        var fc = failedList[i];
        var email = fc.customer_email || '';
        if (!email) { skipped++; continue; }

        try {
          // Check if ticket already exists for this charge
          var { data: existing, error: existErr } = await supabaseClient.from('student_success_tickets')
            .select('id')
            .eq('student_email', email)
            .eq('tipo', 'pago_fallido')
            .ilike('descripcion', '%' + fc.id + '%')
            .limit(1);
          if (existErr) { console.warn('[Import] Check error:', existErr.message); errors++; continue; }

          if (existing && existing.length > 0) {
            skipped++;
            continue;
          }

          // Get student name and phone from users table
          var studentName = fc.customer_name || '';
          var studentPhone = '';
          if (email) {
            var _ud_userData = await usersDataAdmin('admin_get', { email: email, fields: ["nombre","telefono"] });
              var userData = _ud_userData.data ? [_ud_userData.data] : [];
            if (userData && userData[0]) {
              studentName = studentName || userData[0].nombre || '';
              studentPhone = userData[0].telefono || '';
            }
          }

          var amount = (fc.amount / 100).toFixed(2);
          var fecha = new Date(fc.created * 1000).toLocaleDateString('es-MX');
          var failDate = new Date(fc.created * 1000);
          var ageHours = (Date.now() - failDate.getTime()) / 3600000;

          // Auto-assign priority and deadline based on age
          var prioridad = 'alta';
          var fechaLimite = new Date();
          if (ageHours < 24) {
            prioridad = 'alta';
            fechaLimite.setDate(fechaLimite.getDate() + 1);
          } else if (ageHours < 72) {
            prioridad = 'alta';
            fechaLimite.setDate(fechaLimite.getDate() + 2);
          } else if (ageHours < 168) {
            prioridad = 'media';
            fechaLimite.setDate(fechaLimite.getDate() + 3);
          } else {
            prioridad = 'baja';
            fechaLimite.setDate(fechaLimite.getDate() + 7);
          }

          var { error: insertErr } = await supabaseClient.from('student_success_tickets').insert({
            student_email: email,
            student_name: studentName || email,
            student_phone: studentPhone || '',
            tipo: 'pago_fallido',
            estado: 'abierto',
            prioridad: prioridad,
            descripcion: 'COBRO FALLIDO $' + amount + ' | Fecha: ' + fecha + ' | ' + (fc.failure_message || 'Declined') + ' | Stripe: ' + fc.id + ' | LLAMAR para actualizar metodo de pago.',
            monto: parseFloat(amount),
            fecha_limite: fechaLimite.toISOString(),
            email_enviado_estudiante: false
          });

          if (insertErr) {
            console.error('[Import] Error for ' + email + ':', insertErr);
            errors++;
          } else {
            imported++;
          }
        } catch(e) {
          console.error('[Import] Error:', e);
          errors++;
        }

        // Update progress
        statusEl.innerHTML = _t('fin_importing_progress') + ' ' + (i + 1) + '/' + failedList.length + ' (' + imported + ' ' + _t('fin_new') + ', ' + skipped + ' ' + _t('fin_existing') + ')';
      }

      // Final status
      if (imported > 0) {
        statusEl.style.background = 'rgba(22,163,74,0.1)';
        statusEl.style.color = '#16a34a';
        statusEl.innerHTML = _t('fin_import_complete') + ' <strong>' + imported + ' ' + _t('fin_tickets_created') + '</strong> | ' + skipped + ' ' + _t('fin_existed') + ' | ' + errors + ' ' + _t('fin_errors') + '<br><span style="font-size:11px;">' + _t('fin_go_to_ss') + '</span>';
      } else {
        statusEl.style.background = 'rgba(243,156,18,0.1)';
        statusEl.style.color = '#d97706';
        statusEl.innerHTML = _t('fin_no_new_tickets') + ' ' + skipped + ' ' + _t('fin_existed_in_ss');
      }

      // Reload Student Success tickets if function exists
      try { loadSSTickets('abierto'); } catch(e) { console.warn('[Finanzas]', e.message || e); }
      _importFailedRunning = false;
    }

