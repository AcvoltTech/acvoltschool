if (typeof _addTranslations === 'function') _addTranslations({
  email_send_title: { es: 'Enviar Email', en: 'Send Email' },
  email_send_btn: { es: 'Enviar Email', en: 'Send Email' },
  email_fill_all: { es: 'Completa todos los campos', en: 'Fill in all fields' },
  email_sending: { es: 'Enviando...', en: 'Sending...' },
  email_sending_msg: { es: 'Enviando email...', en: 'Sending email...' },
  email_sent_ok: { es: '¡Email enviado exitosamente!', en: 'Email sent successfully!' },
  email_sent_label: { es: 'Enviado', en: 'Sent' },
  email_not_configured: { es: 'Servicio de email no configurado. Usa "Abrir Gmail" para enviar.', en: 'Email service not configured. Use "Open Gmail" to send.' },
  email_retry: { es: 'Reintentar', en: 'Retry' },
  email_gmail_opened: { es: 'Gmail abierto en nueva pestaña', en: 'Gmail opened in new tab' },
  email_how_unlock: { es: '¿Cómo Desbloquear ', en: 'How to Unlock ' },
  email_your_progress: { es: 'Tu Progreso Actual en ', en: 'Your Current Progress in ' },
  email_questions: { es: 'preguntas', en: 'questions' },
  email_complete_all: { es: 'Completa TODAS las preguntas de ', en: 'Complete ALL questions in ' },
  email_must_answer: { es: 'Debes contestar las ', en: 'You must answer all ' },
  email_questions_carry: { es: ' preguntas. Llevas ', en: ' questions. You have completed ' },
  email_100pct: { es: 'Obtén 100% de aciertos', en: 'Get 100% correct' },
  email_100pct_desc: { es: 'Todas las respuestas deben ser correctas. Si te equivocas, repasa y vuelve a intentar.', en: 'All answers must be correct. If you make a mistake, review and try again.' },
  email_auto_unlock: { es: 'El nivel se desbloquea automáticamente', en: 'The level unlocks automatically' },
  email_auto_desc: { es: 'Al completar ', en: 'Upon completing ' },
  email_auto_desc2: { es: ' al 100%, ', en: ' at 100%, ' },
  email_auto_desc3: { es: ' se abrirá de inmediato.', en: ' will open immediately.' },
  email_tip: { es: 'Consejo', en: 'Tip' },
  email_tip_desc: { es: 'Estudia cada categoría por separado. Ve a Estudiar → ', en: 'Study each category separately. Go to Study → ' },
  email_tip_desc2: { es: ' → elige una categoría y repasa bien antes del examen.', en: ' → choose a category and review well before the exam.' },
  email_go_complete: { es: 'Ir a Completar ', en: 'Go Complete ' },
  email_need_membership: { es: 'Necesitas membresía activa', en: 'You need an active membership' },
  email_beginner_free: { es: 'Solo el nivel Principiante es gratuito. Los demás niveles requieren membresía activa.', en: 'Only the Beginner level is free. Other levels require an active membership.' },
  email_buy_membership: { es: 'Compra la membresía', en: 'Buy the membership' },
  email_plans_desc: { es: '$20/mes o $240/año. Te da acceso a los 5 niveles + 3,500 preguntas + certificaciones.', en: '$20/month or $240/year. Gives you access to 5 levels + 3,500 questions + certifications.' },
  email_view_plans: { es: 'Ver Planes y Pagar', en: 'View Plans & Pay' },
  email_need_help: { es: '¿Necesitas ayuda?', en: 'Need help?' },
  email_contact_desc: { es: 'Contacta a Maestro Mario por WhatsApp o Email.', en: 'Contact Maestro Mario by WhatsApp or Email.' },
  email_close: { es: 'Cerrar', en: 'Close' },
});

// ============================================
// IN-APP EMAIL SYSTEM - Techschoolacvolt@gmail.com
// ============================================
var APP_EMAIL_FROM = 'Techschoolacvolt@gmail.com';
var APP_EMAIL_SENDER_NAME = 'ACVOLT Tech School';

// Open the in-app email compose modal
function openEmailComposer(to, subject, body, title) {
  document.getElementById('emailModalTo').value = to || '';
  document.getElementById('emailModalSubject').value = subject || '';
  document.getElementById('emailModalBody').value = body || '';
  document.getElementById('emailModalTitle').textContent = title || _t('email_send_title');
  document.getElementById('emailModalStatus').style.display = 'none';
  document.getElementById('emailModalSendBtn').disabled = false;
  document.getElementById('emailModalSendBtn').innerHTML = '🚀 ' + _t('email_send_btn');
  document.getElementById('appEmailModal').style.display = 'flex';
}

// Close email modal
function closeEmailModal() {
  document.getElementById('appEmailModal').style.display = 'none';
}

// Send email via Supabase Edge Function
async function sendEmailFromModal() {
  var toEmail = document.getElementById('emailModalTo').value.trim();
  var subject = document.getElementById('emailModalSubject').value.trim();
  var body = document.getElementById('emailModalBody').value.trim();
  var statusEl = document.getElementById('emailModalStatus');
  var sendBtn = document.getElementById('emailModalSendBtn');

  if (!toEmail || !subject || !body) {
    statusEl.style.display = 'block';
    statusEl.style.background = '#fef2f2';
    statusEl.style.color = '#dc2626';
    statusEl.textContent = '⚠️ ' + _t('email_fill_all');
    return;
  }

  // Show sending state
  sendBtn.disabled = true;
  sendBtn.innerHTML = '⏳ ' + _t('email_sending');
  statusEl.style.display = 'block';
  statusEl.style.background = '#eff6ff';
  statusEl.style.color = '#2563eb';
  statusEl.textContent = '📤 ' + _t('email_sending_msg');

  try {
    // Try Supabase Edge Function first
    var response = await fetch(SUPABASE_URL + '/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      },
      body: JSON.stringify({
        to: toEmail,
        subject: subject,
        body: body,
        from_name: APP_EMAIL_SENDER_NAME,
        admin_email: getAdminEmail()
      })
    });

    if (response.ok) {
      var result = await response.json();
      statusEl.style.background = '#f0fdf4';
      statusEl.style.color = '#16a34a';
      statusEl.textContent = '✅ ' + _t('email_sent_ok');
      sendBtn.innerHTML = '✅ ' + _t('email_sent_label');
      // Auto-close after 2 seconds
      setTimeout(function() { closeEmailModal(); }, 2000);
      return;
    } else {
      throw new Error('Edge Function responded with ' + response.status);
    }
  } catch (err) {
    console.log('[Email] Edge Function not available, offering fallback:', err.message);
    statusEl.style.background = '#fffbeb';
    statusEl.style.color = '#d97706';
    statusEl.textContent = '⚠️ ' + _t('email_not_configured');
    sendBtn.disabled = false;
    sendBtn.innerHTML = '🚀 ' + _t('email_retry');
  }
}

// Gmail web fallback - opens Gmail compose in browser
function openGmailFallback() {
  var to = document.getElementById('emailModalTo').value.trim();
  var subject = encodeURIComponent(document.getElementById('emailModalSubject').value.trim());
  var body = encodeURIComponent(document.getElementById('emailModalBody').value.trim());
  
  // Gmail compose URL works in all browsers and PWAs
  var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + subject + '&body=' + body;
  window.open(gmailUrl, '_blank');
  
  var statusEl = document.getElementById('emailModalStatus');
  statusEl.style.display = 'block';
  statusEl.style.background = '#f0fdf4';
  statusEl.style.color = '#16a34a';
  statusEl.textContent = '✅ ' + _t('email_gmail_opened');
}


// ==================== UNLOCK INSTRUCTIONS MODAL ====================
function showUnlockInstructions(levelName, levelIcon, reason, prevName, prevCompleted, prevTotal) {
  // iOS App Store: block purchase prompts (no external payments allowed)
  if (window.isIOSAppStore && reason === 'purchase') return;

  var existing = document.getElementById('unlockInstructionsModal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'unlockInstructionsModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:15px;';

  var html = '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:22px;max-width:420px;width:100%;border:2px solid #f39c12;max-height:90vh;overflow-y:auto;">';
  
  // Header
  html += '<div style="text-align:center;margin-bottom:15px;">';
  html += '<div style="font-size:50px;margin-bottom:8px;">' + (levelIcon || '🔐') + '</div>';
  html += '<h3 style="color:#f39c12;margin:0 0 4px;font-size:20px;">' + _t('email_how_unlock', '¿Cómo Desbloquear ') + levelName + '?</h3>';
  html += '</div>';

  if (reason === 'progress') {
    // Has membership but needs to complete previous level
    var pct = prevTotal > 0 ? Math.round((prevCompleted/prevTotal)*100) : 0;
    html += '<div style="background:rgba(243,156,18,0.15);border:1px solid rgba(243,156,18,0.3);border-radius:12px;padding:14px;margin-bottom:15px;">';
    html += '<div style="color:#fbbf24;font-size:13px;font-weight:700;margin-bottom:6px;">📊 ' + _t('email_your_progress', 'Tu Progreso Actual en ') + prevName + '</div>';
    html += '<div style="background:rgba(0,0,0,0.3);border-radius:10px;height:20px;overflow:hidden;margin-bottom:6px;">';
    html += '<div style="height:100%;background:linear-gradient(90deg,#f39c12,#e67e22);width:' + pct + '%;border-radius:10px;transition:width 0.5s;"></div>';
    html += '</div>';
    html += '<div style="color:#e2e8f0;font-size:12px;text-align:center;">' + prevCompleted + ' / ' + prevTotal + ' ' + _t('email_questions') + ' (' + pct + '%)</div>';
    html += '</div>';

    html += '<div style="color:#e2e8f0;font-size:14px;">';
    html += '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;padding:12px;background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">1️⃣</div>';
    html += '<div><strong style="color:#2ecc71;">' + _t('email_complete_all', 'Completa TODAS las preguntas de ') + prevName + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('email_must_answer', 'Debes contestar las ') + prevTotal + ' ' + _t('email_questions', 'preguntas') + '. ' + _t('esys_carry', 'Llevas ') + prevCompleted + '.</span></div>';
    html += '</div>';

    html += '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;padding:12px;background:rgba(52,152,219,0.1);border:1px solid rgba(52,152,219,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">2️⃣</div>';
    html += '<div><strong style="color:#3498db;">' + _t('email_100pct', 'Obtén 100% de aciertos') + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('email_100pct_desc', 'Todas las respuestas deben ser correctas. Si te equivocas, repasa y vuelve a intentar.') + '</span></div>';
    html += '</div>';

    html += '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;padding:12px;background:rgba(155,89,182,0.1);border:1px solid rgba(155,89,182,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">3️⃣</div>';
    html += '<div><strong style="color:#9b59b6;">' + _t('email_auto_unlock', 'El nivel se desbloquea automáticamente') + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('email_auto_desc', 'Al completar ') + prevName + _t('email_auto_desc2', ' al 100%, ') + levelName + _t('email_auto_desc3', ' se abrirá de inmediato.') + '</span></div>';
    html += '</div>';

    html += '<div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:rgba(243,156,18,0.1);border:1px solid rgba(243,156,18,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">💡</div>';
    html += '<div><strong style="color:#f39c12;">' + _t('email_tip', 'Consejo') + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('email_tip_desc', 'Estudia cada categoría por separado. Ve a Estudiar → ') + prevName + _t('email_tip_desc2', ' → elige una categoría y repasa bien antes del examen.') + '</span></div>';
    html += '</div>';
    html += '</div>';

    // CTA button
    html += '<button onclick="document.getElementById(\'unlockInstructionsModal\').remove();showScreen(\'levelsScreen\');" style="width:100%;padding:14px;margin-top:15px;background:linear-gradient(135deg,#27ae60,#2ecc71);color:white;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;">📚 ' + _t('email_go_complete', 'Ir a Completar ') + prevName + '</button>';

  } else {
    // No membership - needs to purchase
    html += '<div style="color:#e2e8f0;font-size:14px;">';

    html += '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;padding:12px;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">⚠️</div>';
    html += '<div><strong style="color:#e74c3c;">' + _t('email_need_membership', 'Necesitas membresía activa') + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('email_beginner_free', 'Solo el nivel Principiante es gratuito. Los demás niveles requieren membresía activa.') + '</span></div>';
    html += '</div>';

    html += '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;padding:12px;background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">💳</div>';
    html += '<div><strong style="color:#2ecc71;">' + _t('email_buy_membership', 'Compra la membresía') + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('esys_plans_desc', '$20/mes o $240/año. Te da acceso a los 5 niveles + 3,500 preguntas + certificaciones.') + '</span><br>';
    html += '<button onclick="document.getElementById(\'unlockInstructionsModal\').remove();showPurchaseModal();" style="margin-top:8px;padding:8px 16px;background:linear-gradient(135deg,#2ecc71,#27ae60);color:white;border:none;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">💳 ' + _t('email_view_plans', 'Ver Planes y Pagar') + '</button>';
    html += '</div></div>';

    html += '<div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:rgba(52,152,219,0.1);border:1px solid rgba(52,152,219,0.3);border-radius:10px;">';
    html += '<div style="font-size:24px;min-width:32px;text-align:center;">💬</div>';
    html += '<div><strong style="color:#3498db;">' + _t('email_need_help', '¿Necesitas ayuda?') + '</strong><br><span style="font-size:12px;color:#94a3b8;">' + _t('email_contact_desc', 'Contacta a Maestro Mario por WhatsApp o Email.') + '</span><br>';
    html += '<div style="display:flex;gap:6px;margin-top:8px;">';
    html += '<button onclick="window.open(\'https://wa.me/19096390448?text=' + encodeURIComponent('Hola Maestro Mario, necesito ayuda con mi membresía en Maestro HVACR. Mi email es: ' + (typeof currentUser !== 'undefined' && currentUser ? currentUser.email : '')) + '\',\'_blank\')" style="padding:8px 12px;background:linear-gradient(135deg,#25D366,#128C7E);color:white;border:none;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">💬 WhatsApp</button>';
    html += '<button onclick="openEmailComposer(\'Techschoolacvolt@gmail.com\',\'Ayuda con Membresía\',\'Hola Maestro Mario, necesito ayuda con mi membresía en Maestro HVACR.\\nMi email es: ' + (typeof currentUser !== 'undefined' && currentUser ? currentUser.email : '') + '\',\'📧 Soporte\')" style="padding:8px 12px;background:linear-gradient(135deg,#3498db,#2980b9);color:white;border:none;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">📧 Email</button>';
    html += '</div></div></div>';

    html += '</div>';
  }

  // Close button
  html += '<button onclick="document.getElementById(\'unlockInstructionsModal\').remove();" style="width:100%;padding:12px;margin-top:10px;background:rgba(255,255,255,0.1);color:#94a3b8;border:1px solid rgba(255,255,255,0.15);border-radius:12px;font-size:13px;cursor:pointer;">✕ ' + _t('email_close', 'Cerrar') + '</button>';
  html += '</div>';

  modal.innerHTML = html;
  document.body.appendChild(modal);
}


