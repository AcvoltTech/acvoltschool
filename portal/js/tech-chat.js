// ============================================================
// Tech Chat — Real-time HVAC technician chat + Sugerencias
// ============================================================

var chatRealtimeSubscription = null;
var chatMessages = [];
var chatPage = 0;
var chatLoading = false;
var chatHasMore = true;
var chatMediaFile = null;
var chatMediaPreviewUrl = null;
const CHAT_PAGE_SIZE = 50;
const CHAT_MAX_IMG_MB = 5;
const CHAT_MAX_VID_MB = 20;

// ── Banned words (payment/pricing topics) ──
var chatBannedPatterns = [
  /\bpago\b/i, /\bpagos\b/i, /\bpagar\b/i, /\bprecio\b/i, /\bprecios\b/i,
  /\bmembres[ií]a\b/i, /\bcu[aá]nto pagas\b/i, /\bcu[aá]nto cobras\b/i,
  /\bcu[aá]nto cuesta\b/i, /\bcu[aá]nto vale\b/i,
  /\bcuota\b/i, /\bcobro\b/i, /\bcobrar\b/i,
  /\bcaro\b/i, /\bbarato\b/i, /\btarifa\b/i, /\btarifas\b/i,
  /\bcosto\b/i, /\bcostos\b/i, /\bdescuento\b/i, /\bdescuentos\b/i,
  /\bstripe\b/i, /\bfactura\b/i, /\bfacturas\b/i,
  /\bsuscripci[oó]n\b/i, /\bgratis\b/i,
  /\bqu[eé] plan\b/i, /\bplan de pago\b/i,
  /\$\s*\d/
];

function chatCheckBannedWords(text) {
  if (!text) return false;
  for (var i = 0; i < chatBannedPatterns.length; i++) {
    if (chatBannedPatterns[i].test(text)) return true;
  }
  return false;
}

// ── Toast helper (ephemeral, chat-specific) ──
function chatShowToast(msg, type) {
  var existing = document.getElementById('chatToast');
  if (existing) existing.remove();
  var bg = type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#f59e0b';
  var toast = document.createElement('div');
  toast.id = 'chatToast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:10px 20px;border-radius:10px;font-size:14px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;max-width:90%;transition:opacity 0.3s;';
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
}

// ============================================================
// INIT TECH CHAT
// ============================================================
function initTechChat() {
  var screen = document.getElementById('techChatScreen');
  if (!screen) return;
  // Only build once
  if (!screen.querySelector('#chatMessageList')) {
    screen.innerHTML = buildChatScreenHTML();
  }
  chatMessages = [];
  chatPage = 0;
  chatHasMore = true;
  loadChatMessages();
  subscribeToChatRealtime();
  setTimeout(chatUpdateMuteIcon, 100);
}

function buildChatScreenHTML() {
  var currentUser = localStorage.getItem('tecnico_user');
  var userName = '';
  try { userName = JSON.parse(currentUser).nombre || _t('tc_technician', 'Técnico'); } catch(e) { userName = _t('tc_technician', 'Técnico'); }

  return '' +
    '<div id="chatHeader" style="background:linear-gradient(135deg,#0ea5e9,#0284c7);padding:12px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;box-shadow:0 2px 10px rgba(0,0,0,0.3);">' +
      '<button onclick="leaveTechChat()" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px;">←</button>' +
      '<div style="flex:1;">' +
        '<div style="color:#fff;font-weight:700;font-size:16px;">' + _t('tc_chat_title', 'Chat de Técnicos HVAC') + '</div>' +
        '<div style="color:rgba(255,255,255,0.7);font-size:12px;">' + _t('tc_chat_subtitle', 'Solo soporte técnico profesional') + '</div>' +
      '</div>' +
      '<button onclick="chatToggleMute()" id="chatMuteBtn" style="background:none;border:none;cursor:pointer;padding:4px;" title="' + _t('tc_mute_notifications', 'Silenciar notificaciones') + '">' +
        '<svg id="chatMuteIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
      '</button>' +
      '<div id="chatOnlineIndicator" style="width:10px;height:10px;background:#22c55e;border-radius:50%;box-shadow:0 0 6px #22c55e;"></div>' +
    '</div>' +

    '<div id="chatMessageList" style="flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch;background:#0f172a;">' +
      '<div id="chatLoadMore" style="text-align:center;padding:8px;display:none;">' +
        '<button onclick="loadChatMessages()" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#94a3b8;padding:6px 16px;border-radius:20px;font-size:12px;cursor:pointer;">' + _t('tc_load_more', 'Cargar más mensajes') + '</button>' +
      '</div>' +

      '<div id="chatWelcomeMsg" style="background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid rgba(14,165,233,0.3);border-radius:16px;padding:16px;margin-bottom:8px;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
          '<img src="mario-black.jpg" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #0ea5e9;">' +
          '<div><div style="color:#0ea5e9;font-weight:700;font-size:14px;">Maestro Mario</div><div style="color:#64748b;font-size:11px;">' + _t('tc_admin_label', 'Administrador') + '</div></div>' +
        '</div>' +
        '<div style="color:#e2e8f0;font-size:13px;line-height:1.6;">' +
          '<div style="font-weight:600;margin-bottom:6px;">' + _t('tc_welcome_title', 'Bienvenido al Chat de Técnicos HVAC') + '</div>' +
          _t('tc_welcome_intro', 'Este es un espacio profesional para compartir conocimiento técnico entre compañeros. Reglas del chat:') +
          '<div style="margin-top:8px;color:#94a3b8;font-size:12px;line-height:1.7;">' +
            '1. ' + _t('tc_rule_1', 'Solo temas de HVAC y soporte técnico') + '<br>' +
            '2. ' + _t('tc_rule_2', 'No se permiten discusiones de pagos, precios o membresías') + '<br>' +
            '3. ' + _t('tc_rule_3', 'Puedes compartir fotos y videos de trabajos e instalaciones') + '<br>' +
            '4. ' + _t('tc_rule_4', 'Contenido inapropiado será bloqueado automáticamente') + '<br>' +
            '5. ' + _t('tc_rule_5', 'Respeta a tus compañeros — 3 reportes eliminan el mensaje') + '<br>' +
            '6. ' + _t('tc_rule_6', 'Usa el botón de silenciar si no deseas recibir notificaciones') +
          '</div>' +
          '<div style="margin-top:10px;color:#0ea5e9;font-size:12px;font-style:italic;">— ' + _t('tc_welcome_closing', 'A darle duro, familia HVAC') + '</div>' +
        '</div>' +
      '</div>' +

      '<div id="chatMessagesContainer"></div>' +
    '</div>' +

    '<div id="chatMediaPreview" style="display:none;padding:8px 16px;background:#1e293b;border-top:1px solid rgba(255,255,255,0.1);flex-shrink:0;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<div id="chatMediaThumb" style="width:60px;height:60px;border-radius:8px;overflow:hidden;background:#334155;display:flex;align-items:center;justify-content:center;"></div>' +
        '<div id="chatMediaName" style="flex:1;color:#94a3b8;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>' +
        '<button onclick="chatClearMedia()" style="background:none;border:none;color:#ef4444;font-size:18px;cursor:pointer;">✕</button>' +
      '</div>' +
    '</div>' +

    '<div id="chatInputBar" style="padding:10px 12px;padding-bottom:calc(10px + env(safe-area-inset-bottom, 0px));background:#1e293b;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:8px;flex-shrink:0;">' +
      '<label style="cursor:pointer;padding:6px;">' +
        '<input type="file" accept="image/*,video/*" onchange="chatFileSelected(event)" style="display:none;" id="chatFileInput">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>' +
      '</label>' +
      '<input id="chatTextInput" type="text" placeholder="' + _t('tc_input_placeholder', 'Escribe tu mensaje...') + '" maxlength="1000" autocomplete="off" style="flex:1;background:#0f172a;border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:10px 16px;color:#e2e8f0;font-size:14px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;">' +
      '<button id="chatSendBtn" onclick="chatSendMessage()" style="background:linear-gradient(135deg,#0ea5e9,#0284c7);border:none;color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.15s;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9z"/></svg>' +
      '</button>' +
    '</div>' +

    '<div id="chatMediaOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:99998;display:none;align-items:center;justify-content:center;flex-direction:column;">' +
      '<button onclick="chatCloseMedia()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;z-index:99999;">✕</button>' +
      '<div id="chatMediaOverlayContent" style="max-width:95vw;max-height:90vh;"></div>' +
    '</div>';
}

// ============================================================
// LOAD MESSAGES (paginated)
// ============================================================
async function loadChatMessages() {
  if (chatLoading || !chatHasMore) return;
  chatLoading = true;

  // Premium skeleton placeholders on first load
  if (chatPage === 0 && chatMessages.length === 0) {
    var _skContainer = document.getElementById('chatMessagesContainer');
    if (_skContainer && window.Skeleton) window.Skeleton.listRow(_skContainer, 4);
  }

  try {
    var from = chatPage * CHAT_PAGE_SIZE;
    var to = from + CHAT_PAGE_SIZE - 1;

    var { data, error } = await supabaseClient
      .from('chat_messages')
      .select('*')
      .is('group_id', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    if (!data || data.length < CHAT_PAGE_SIZE) chatHasMore = false;

    if (data && data.length > 0) {
      // Prepend older messages (data comes newest-first, reverse for display)
      chatMessages = data.reverse().concat(chatMessages);
      chatPage++;
    }

    renderChatMessages();

    // Scroll to bottom only on first load
    if (chatPage === 1) {
      var list = document.getElementById('chatMessageList');
      if (list) setTimeout(function() { list.scrollTop = list.scrollHeight; }, 100);
    }

    // Show/hide load more
    var loadMoreBtn = document.getElementById('chatLoadMore');
    if (loadMoreBtn) loadMoreBtn.style.display = chatHasMore ? '' : 'none';

  } catch(e) {
    console.error('[TechChat] Error loading messages:', e);
    chatShowToast(_t('tc_error_loading_messages', 'Error cargando mensajes'), 'error');
  } finally {
    chatLoading = false;
  }
}

// ============================================================
// RENDER MESSAGES
// ============================================================
function renderChatMessages() {
  var container = document.getElementById('chatMessagesContainer');
  if (!container) return;

  var currentEmail = localStorage.getItem('tecnico_email') || '';
  var isAdmin = (typeof isAdminAuthenticated === 'function') && isAdminAuthenticated();
  var html = '';
  var lastDateStr = '';

  for (var i = 0; i < chatMessages.length; i++) {
    var msg = chatMessages[i];
    var d = new Date(msg.created_at);
    var dateStr = d.toLocaleDateString('es-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Date separator
    if (dateStr !== lastDateStr) {
      html += '<div style="text-align:center;padding:8px 0;"><span style="background:rgba(255,255,255,0.08);color:#64748b;font-size:11px;padding:4px 12px;border-radius:10px;">' + dateStr + '</span></div>';
      lastDateStr = dateStr;
    }

    var isOwn = (msg.user_email === currentEmail);
    var align = isOwn ? 'flex-end' : 'flex-start';
    var bgStyle = isOwn
      ? 'background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;'
      : 'background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);';
    var radius = isOwn ? 'border-radius:16px 16px 4px 16px;' : 'border-radius:16px 16px 16px 4px;';
    var timeStr = d.toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit' });

    html += '<div style="display:flex;flex-direction:column;align-items:' + align + ';" data-msgid="' + msg.id + '">';

    // Sender name (only for others)
    if (!isOwn) {
      html += '<div style="font-size:11px;color:#0ea5e9;margin-bottom:2px;padding-left:4px;font-weight:600;">' + escapeHTML(msg.user_name) + '</div>';
    }

    html += '<div style="' + bgStyle + radius + 'padding:8px 12px;max-width:80%;word-break:break-word;position:relative;" oncontextmenu="chatMessageContext(event,\'' + msg.id + '\')">';

    // Media content
    if (msg.message_type === 'image' && msg.media_url) {
      var _imgUrl = sanitizeMediaUrl(msg.media_url);
      if (_imgUrl) html += '<img src="' + _imgUrl + '" onclick="chatOpenMedia(\'' + _imgUrl + '\',\'image\')" style="max-width:100%;border-radius:8px;cursor:pointer;display:block;margin-bottom:' + (msg.content ? '6px' : '0') + ';" loading="lazy">';
    }
    if (msg.message_type === 'video') {
      var thumb = sanitizeMediaUrl(msg.media_thumbnail_url);
      var _vidUrl = sanitizeMediaUrl(msg.media_url);
      html += '<div onclick="chatOpenMedia(\'' + _vidUrl + '\',\'video\')" style="position:relative;cursor:pointer;margin-bottom:' + (msg.content ? '6px' : '0') + ';">';
      if (thumb) {
        html += '<img src="' + thumb + '" style="max-width:100%;border-radius:8px;display:block;" loading="lazy">';
      } else {
        html += '<div style="width:200px;height:120px;background:#334155;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b;">Video</div>';
      }
      html += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="width:44px;height:44px;background:rgba(0,0,0,0.6);border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg></div></div>';
      html += '</div>';
    }

    // Text content
    if (msg.content) {
      html += '<div style="font-size:14px;line-height:1.4;">' + escapeHTML(msg.content) + '</div>';
    }

    // Timestamp
    html += '<div style="font-size:10px;opacity:0.6;margin-top:4px;text-align:right;">' + timeStr + '</div>';

    html += '</div></div>';
  }

  container.innerHTML = html;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sanitizeMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  var s = url.trim();
  if (/^https?:\/\//i.test(s) || /^blob:/i.test(s) || /^data:image\//i.test(s) || /^data:video\//i.test(s)) {
    return escapeHTML(s).replace(/'/g, '&#39;');
  }
  return '';
}

// ============================================================
// REALTIME SUBSCRIPTION
// ============================================================
function subscribeToChatRealtime() {
  if (chatRealtimeSubscription) {
    supabaseClient.removeChannel(chatRealtimeSubscription);
  }

  chatRealtimeSubscription = supabaseClient
    .channel('tech-chat-realtime')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: 'moderation_status=eq.approved'
    }, function(payload) {
      var newMsg = payload.new;
      // Ignore group chat messages
      if (newMsg.group_id) return;
      // Avoid duplicates
      var exists = chatMessages.some(function(m) { return m.id === newMsg.id; });
      if (!exists && !newMsg.deleted) {
        chatMessages.push(newMsg);
        renderChatMessages();
        var list = document.getElementById('chatMessageList');
        if (list) list.scrollTop = list.scrollHeight;
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'chat_messages'
    }, function(payload) {
      var updated = payload.new;
      // Ignore group chat messages
      if (updated.group_id) return;
      for (var i = 0; i < chatMessages.length; i++) {
        if (chatMessages[i].id === updated.id) {
          if (updated.deleted || updated.moderation_status === 'rejected') {
            chatMessages.splice(i, 1);
          } else {
            chatMessages[i] = updated;
          }
          renderChatMessages();
          break;
        }
      }
      // If it was pending and now approved, add it
      if (updated.moderation_status === 'approved' && !updated.deleted) {
        var exists = chatMessages.some(function(m) { return m.id === updated.id; });
        if (!exists) {
          chatMessages.push(updated);
          renderChatMessages();
          var list = document.getElementById('chatMessageList');
          if (list) list.scrollTop = list.scrollHeight;
        }
      }
    })
    .subscribe();
}

// ============================================================
// SEND TEXT MESSAGE
// ============================================================
var _chatLastSendTime = 0;
var _chatSendCooldownMs = 1000; // 1 second between messages

function chatSendMessage() {
  if (chatMediaFile) {
    sendChatMediaMessage();
    return;
  }

  var input = document.getElementById('chatTextInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text) return;

  // Rate limit: prevent spam
  var now = Date.now();
  if (now - _chatLastSendTime < _chatSendCooldownMs) {
    chatShowToast(_t('tc_rate_limit', 'Espera un momento antes de enviar otro mensaje'), 'warning');
    return;
  }
  _chatLastSendTime = now;

  // Banned words check
  if (chatCheckBannedWords(text)) {
    chatShowToast(_t('tc_banned_words_warning', 'Este chat es solo para soporte técnico HVAC. No se permiten discusiones de pagos o precios.'), 'error');
    return;
  }

  var email = localStorage.getItem('tecnico_email') || '';
  var userName = '';
  try { userName = JSON.parse(localStorage.getItem('tecnico_user')).nombre || _t('tc_technician', 'Técnico'); } catch(e) { userName = _t('tc_technician', 'Técnico'); }

  input.value = '';
  input.focus();

  supabaseClient.from('chat_messages').insert({
    user_email: email,
    user_name: userName,
    message_type: 'text',
    content: text,
    moderation_status: 'approved'
  }).then(function(result) {
    if (result.error) {
      console.error('[TechChat] Send error:', result.error);
      chatShowToast(_t('tc_error_sending_message', 'Error enviando mensaje'), 'error');
    } else {
      notifyChatSubscribers(email, userName, text, 'text');
    }
  });
}

// Enter key to send
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    var input = document.getElementById('chatTextInput');
    if (input && document.activeElement === input) {
      e.preventDefault();
      chatSendMessage();
    }
  }
});

// ============================================================
// SEND MEDIA MESSAGE
// ============================================================
async function sendChatMediaMessage() {
  if (!chatMediaFile) return;

  var file = chatMediaFile;
  var isVideo = file.type.startsWith('video/');
  var isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) {
    chatShowToast(_t('tc_only_images_videos', 'Solo se permiten imágenes y videos'), 'error');
    return;
  }

  var maxMB = isVideo ? CHAT_MAX_VID_MB : CHAT_MAX_IMG_MB;
  if (file.size > maxMB * 1024 * 1024) {
    chatShowToast(_t('tc_file_too_large', 'Archivo muy grande. Máximo') + ' ' + maxMB + 'MB', 'error');
    return;
  }

  // Also check caption for banned words
  var input = document.getElementById('chatTextInput');
  var caption = input ? input.value.trim() : '';
  if (caption && chatCheckBannedWords(caption)) {
    chatShowToast(_t('tc_no_payment_discussions', 'No se permiten discusiones de pagos o precios.'), 'error');
    return;
  }

  var email = localStorage.getItem('tecnico_email') || '';
  var userName = '';
  try { userName = JSON.parse(localStorage.getItem('tecnico_user')).nombre || _t('tc_technician', 'Técnico'); } catch(e) { userName = _t('tc_technician', 'Técnico'); }

  var sendBtn = document.getElementById('chatSendBtn');
  if (sendBtn) sendBtn.disabled = true;
  chatShowToast(_t('tc_uploading_file', 'Subiendo archivo...'), 'warning');

  try {
    var ext = file.name.split('.').pop();
    var filePath = 'chat/' + Date.now() + '_' + Math.random().toString(36).substr(2, 6) + '.' + ext;

    // Upload main file
    var { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('school-files')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    var { data: urlData } = supabaseClient.storage.from('school-files').getPublicUrl(filePath);
    var mediaUrl = urlData.publicUrl;

    // Extract video thumbnail
    var thumbnailUrl = null;
    if (isVideo && typeof extractVideoFrame === 'function') {
      try {
        var thumbFile = await extractVideoFrame(file);
        var thumbPath = 'chat/' + Date.now() + '_thumb.jpg';
        var { error: thumbErr } = await supabaseClient.storage
          .from('school-files')
          .upload(thumbPath, thumbFile, { cacheControl: '3600', upsert: false });
        if (!thumbErr) {
          var { data: thumbUrlData } = supabaseClient.storage.from('school-files').getPublicUrl(thumbPath);
          thumbnailUrl = thumbUrlData.publicUrl;
        }
      } catch(te) {
        console.warn('[TechChat] Thumbnail extraction failed:', te);
      }
    }

    // Insert as pending (will be moderated)
    var { data: insertData, error: insertError } = await supabaseClient
      .from('chat_messages')
      .insert({
        user_email: email,
        user_name: userName,
        message_type: isVideo ? 'video' : 'image',
        content: caption || null,
        media_url: mediaUrl,
        media_thumbnail_url: thumbnailUrl,
        moderation_status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Clear input
    chatClearMedia();
    if (input) input.value = '';

    chatShowToast(_t('tc_file_sent_verifying', 'Archivo enviado. Verificando contenido...'), 'success');

    // Call moderation Edge Function
    var moderationUrl = isVideo ? (thumbnailUrl || mediaUrl) : mediaUrl;
    supabaseClient.functions.invoke('moderate-chat-media', {
      body: {
        media_url: moderationUrl,
        message_id: insertData.id,
        media_type: isVideo ? 'video' : 'image',
        admin_email: getAdminEmail()
      }
    }).then(function(res) {
      if (res.error) console.error('[TechChat] Moderation error:', res.error);
      if (res.data && !res.data.approved) {
        chatShowToast(_t('tc_image_rejected', 'Tu imagen fue rechazada:') + ' ' + (res.data.reason || _t('tc_content_not_allowed', 'Contenido no permitido')), 'error');
      } else if (res.data && res.data.approved) {
        notifyChatSubscribers(email, userName, caption, isVideo ? 'video' : 'image');
      }
    });

  } catch(e) {
    console.error('[TechChat] Media send error:', e);
    chatShowToast(_t('tc_error_uploading_file', 'Error subiendo archivo'), 'error');
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

// ============================================================
// FILE HANDLING
// ============================================================
function chatFileSelected(event) {
  var file = event.target.files[0];
  if (!file) return;

  var isVideo = file.type.startsWith('video/');
  var isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) {
    chatShowToast(_t('tc_only_images_videos_allowed', 'Solo imágenes y videos permitidos'), 'error');
    event.target.value = '';
    return;
  }

  var maxMB = isVideo ? CHAT_MAX_VID_MB : CHAT_MAX_IMG_MB;
  if (file.size > maxMB * 1024 * 1024) {
    chatShowToast(_t('tc_file_too_large', 'Archivo muy grande. Máximo') + ' ' + maxMB + 'MB', 'error');
    event.target.value = '';
    return;
  }

  chatMediaFile = file;
  var preview = document.getElementById('chatMediaPreview');
  var thumb = document.getElementById('chatMediaThumb');
  var name = document.getElementById('chatMediaName');
  if (preview) preview.style.display = '';
  if (name) name.textContent = file.name;

  if (thumb) {
    if (isImage) {
      if (chatMediaPreviewUrl) URL.revokeObjectURL(chatMediaPreviewUrl);
      chatMediaPreviewUrl = URL.createObjectURL(file);
      thumb.innerHTML = '<img src="' + chatMediaPreviewUrl + '" style="width:100%;height:100%;object-fit:cover;">';
    } else {
      thumb.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><polygon points="5,3 19,12 5,21"/></svg>';
    }
  }
}

function chatClearMedia() {
  chatMediaFile = null;
  if (chatMediaPreviewUrl) {
    URL.revokeObjectURL(chatMediaPreviewUrl);
    chatMediaPreviewUrl = null;
  }
  var preview = document.getElementById('chatMediaPreview');
  if (preview) preview.style.display = 'none';
  var fileInput = document.getElementById('chatFileInput');
  if (fileInput) fileInput.value = '';
}

// ============================================================
// MEDIA VIEWER
// ============================================================
function chatOpenMedia(url, type) {
  var overlay = document.getElementById('chatMediaOverlay');
  var content = document.getElementById('chatMediaOverlayContent');
  if (!overlay || !content) return;

  var safeUrl = sanitizeMediaUrl(url);
  if (!safeUrl) return;
  if (type === 'video') {
    content.innerHTML = '<video src="' + safeUrl + '" controls autoplay style="max-width:95vw;max-height:85vh;border-radius:8px;"></video>';
  } else {
    content.innerHTML = '<img src="' + safeUrl + '" style="max-width:95vw;max-height:85vh;border-radius:8px;object-fit:contain;">';
  }
  overlay.style.display = 'flex';
}

function chatCloseMedia() {
  var overlay = document.getElementById('chatMediaOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    var content = document.getElementById('chatMediaOverlayContent');
    if (content) content.innerHTML = '';
  }
}

// ============================================================
// CONTEXT MENU (long-press / right-click) — Report & Delete
// ============================================================
function chatMessageContext(event, msgId) {
  event.preventDefault();
  var currentEmail = localStorage.getItem('tecnico_email') || '';
  var isAdmin = (typeof isAdminAuthenticated === 'function') && isAdminAuthenticated();
  var msg = chatMessages.find(function(m) { return m.id === msgId; });
  if (!msg) return;

  // Remove existing menu
  var old = document.getElementById('chatContextMenu');
  if (old) old.remove();

  var menu = document.createElement('div');
  menu.id = 'chatContextMenu';
  menu.style.cssText = 'position:fixed;z-index:99999;background:#1e293b;border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:4px 0;box-shadow:0 8px 30px rgba(0,0,0,0.5);min-width:160px;';

  // Position near the event
  var x = event.clientX || event.touches?.[0]?.clientX || 100;
  var y = event.clientY || event.touches?.[0]?.clientY || 100;
  menu.style.left = Math.min(x, window.innerWidth - 180) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - 120) + 'px';

  var items = [];

  // Report option (not own messages)
  if (msg.user_email !== currentEmail) {
    items.push({ label: _t('tc_report_message', 'Reportar mensaje'), icon: '⚠️', action: function() { chatReportMessage(msgId); } });
  }

  // Delete (admin or own message)
  if (isAdmin || msg.user_email === currentEmail) {
    items.push({ label: _t('tc_delete_message', 'Eliminar mensaje'), icon: '🗑️', action: function() { chatDeleteMessage(msgId); } });
  }

  if (items.length === 0) {
    menu.remove();
    return;
  }

  items.forEach(function(item) {
    var btn = document.createElement('button');
    btn.style.cssText = 'display:flex;align-items:center;gap:8px;width:100%;padding:10px 16px;background:none;border:none;color:#e2e8f0;font-size:14px;cursor:pointer;text-align:left;';
    btn.innerHTML = '<span>' + item.icon + '</span><span>' + item.label + '</span>';
    btn.onclick = function() { menu.remove(); item.action(); };
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);

  // Close on any tap outside
  setTimeout(function() {
    document.addEventListener('click', function handler() {
      menu.remove();
      document.removeEventListener('click', handler);
    }, { once: true });
  }, 50);
}

// ============================================================
// REPORT MESSAGE
// ============================================================
async function chatReportMessage(msgId) {
  var email = localStorage.getItem('tecnico_email') || '';
  if (!email) return;

  try {
    // Insert report (unique constraint prevents duplicates)
    var { error: reportErr } = await supabaseClient.from('chat_reports').insert({
      message_id: msgId,
      reporter_email: email,
      reason: 'Reported by user'
    });

    if (reportErr) {
      if (reportErr.code === '23505') {
        chatShowToast(_t('tc_already_reported', 'Ya reportaste este mensaje'), 'warning');
        return;
      }
      throw reportErr;
    }

    // Fetch fresh report_count from server to avoid race conditions
    var { data: freshMsg } = await supabaseClient.from('chat_messages').select('report_count').eq('id', msgId).single();
    var newCount = ((freshMsg && freshMsg.report_count) || 0) + 1;

    var updateData = { reported: true, report_count: newCount };

    // Auto-delete at 3+ reports
    if (newCount >= 3) {
      updateData.deleted = true;
      updateData.deleted_by = 'auto-report';
    }

    await supabaseClient.from('chat_messages').update(updateData).eq('id', msgId);

    chatShowToast(newCount >= 3 ? _t('tc_message_deleted_reports', 'Mensaje eliminado por múltiples reportes') : _t('tc_message_reported', 'Mensaje reportado. Gracias.'), 'success');

  } catch(e) {
    console.error('[TechChat] Report error:', e);
    chatShowToast(_t('tc_error_reporting', 'Error al reportar'), 'error');
  }
}

// ============================================================
// DELETE MESSAGE (admin or own)
// ============================================================
async function chatDeleteMessage(msgId) {
  var email = localStorage.getItem('tecnico_email') || '';

  try {
    var { error } = await supabaseClient.from('chat_messages').update({
      deleted: true,
      deleted_by: email
    }).eq('id', msgId);

    if (error) throw error;

    // Remove locally
    chatMessages = chatMessages.filter(function(m) { return m.id !== msgId; });
    renderChatMessages();
    chatShowToast(_t('tc_message_deleted', 'Mensaje eliminado'), 'success');

  } catch(e) {
    console.error('[TechChat] Delete error:', e);
    chatShowToast(_t('tc_error_deleting', 'Error al eliminar'), 'error');
  }
}

// ============================================================
// LEAVE CHAT
// ============================================================
function leaveTechChat() {
  if (chatRealtimeSubscription) {
    supabaseClient.removeChannel(chatRealtimeSubscription);
    chatRealtimeSubscription = null;
  }
  chatClearMedia();
  showScreen('dashboardScreen');
}

// ============================================================
// SUGERENCIAS (Suggestions)
// ============================================================
function initSugerencias() {
  var screen = document.getElementById('sugerenciasScreen');
  if (!screen) return;
  if (!screen.querySelector('#sugerenciasForm')) {
    screen.innerHTML = buildSugerenciasHTML();
  }
}

function buildSugerenciasHTML() {
  return '' +
    '<div style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);padding:12px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;box-shadow:0 2px 10px rgba(0,0,0,0.3);">' +
      '<button onclick="showScreen(\'dashboardScreen\')" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px;">←</button>' +
      '<div style="flex:1;">' +
        '<div style="color:#fff;font-weight:700;font-size:16px;">' + _t('tc_suggestions_title', 'Sugerencias de Mejoras') + '</div>' +
        '<div style="color:rgba(255,255,255,0.7);font-size:12px;">' + _t('tc_suggestions_subtitle', 'Ayúdanos a mejorar la plataforma') + '</div>' +
      '</div>' +
      '<span style="font-size:24px;">💡</span>' +
    '</div>' +

    '<div style="flex:1;overflow-y:auto;padding:20px 16px;">' +
      '<div style="background:#1e293b;border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.08);max-width:500px;margin:0 auto;">' +
        '<div style="text-align:center;margin-bottom:16px;">' +
          '<div style="font-size:40px;margin-bottom:8px;">🛠️</div>' +
          '<div style="color:#e2e8f0;font-size:16px;font-weight:600;">' + _t('tc_have_idea', '¿Tienes una idea?') + '</div>' +
          '<div style="color:#94a3b8;font-size:13px;margin-top:4px;">' + _t('tc_opinion_helps', 'Tu opinión nos ayuda a crecer') + '</div>' +
        '</div>' +

        '<form id="sugerenciasForm" onsubmit="submitSugerencia(event)">' +
          '<textarea id="sugerenciaText" placeholder="' + _t('tc_suggestion_placeholder', 'Escribe tu sugerencia aquí... \n\nEjemplos:\n• Nueva función que te gustaría ver\n• Mejora en una sección existente\n• Contenido que te gustaría aprender') + '" ' +
          'style="width:100%;min-height:150px;background:#0f172a;border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:14px;color:#e2e8f0;font-size:14px;resize:vertical;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color 0.2s;" ' +
          'maxlength="2000" required></textarea>' +

          '<div style="text-align:right;color:#64748b;font-size:11px;margin:4px 4px 12px 0;" id="sugerenciaCharCount">0 / 2000</div>' +

          '<button type="submit" id="sugerenciaSubmitBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:transform 0.15s;">' + _t('tc_send_suggestion', 'Enviar Sugerencia') + '</button>' +
        '</form>' +

        '<div id="sugerenciaSuccess" style="display:none;text-align:center;padding:20px;">' +
          '<div style="font-size:48px;margin-bottom:12px;">✅</div>' +
          '<div style="color:#22c55e;font-size:16px;font-weight:600;">' + _t('tc_thanks_suggestion', '¡Gracias por tu sugerencia!') + '</div>' +
          '<div style="color:#94a3b8;font-size:13px;margin-top:6px;">' + _t('tc_review_soon', 'La revisaremos pronto') + '</div>' +
          '<button onclick="resetSugerenciaForm()" style="margin-top:16px;padding:10px 24px;background:rgba(139,92,246,0.2);color:#a78bfa;border:1px solid rgba(139,92,246,0.3);border-radius:10px;cursor:pointer;font-size:13px;">' + _t('tc_send_another_suggestion', 'Enviar otra sugerencia') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
}

// Character counter
document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'sugerenciaText') {
    var counter = document.getElementById('sugerenciaCharCount');
    if (counter) counter.textContent = e.target.value.length + ' / 2000';
  }
});

async function submitSugerencia(event) {
  event.preventDefault();
  var textarea = document.getElementById('sugerenciaText');
  var btn = document.getElementById('sugerenciaSubmitBtn');
  if (!textarea || !textarea.value.trim()) return;

  var email = localStorage.getItem('tecnico_email') || '';
  var userName = '';
  try { userName = JSON.parse(localStorage.getItem('tecnico_user')).nombre || _t('tc_technician', 'Técnico'); } catch(e) { userName = _t('tc_technician', 'Técnico'); }

  if (window.BtnLoading) window.BtnLoading.start(btn, _t('tc_sending', 'Enviando...'));

  try {
    var { error } = await supabaseClient.from('suggestions').insert({
      user_email: email,
      user_name: userName,
      suggestion_text: textarea.value.trim()
    });

    if (error) throw error;

    var form = document.getElementById('sugerenciasForm');
    var success = document.getElementById('sugerenciaSuccess');
    if (form) form.style.display = 'none';
    if (success) success.style.display = '';

  } catch(e) {
    console.error('[Sugerencias] Error:', e);
    chatShowToast(_t('tc_error_sending_suggestion', 'Error enviando sugerencia'), 'error');
  } finally {
    if (window.BtnLoading) window.BtnLoading.stop(btn);
  }
}

function resetSugerenciaForm() {
  var form = document.getElementById('sugerenciasForm');
  var success = document.getElementById('sugerenciaSuccess');
  var textarea = document.getElementById('sugerenciaText');
  var counter = document.getElementById('sugerenciaCharCount');
  if (form) form.style.display = '';
  if (success) success.style.display = 'none';
  if (textarea) textarea.value = '';
  if (counter) counter.textContent = '0 / 2000';
}

// ============================================================
// MUTE / UNMUTE CHAT NOTIFICATIONS
// ============================================================
function chatToggleMute() {
  var muted = localStorage.getItem('chat_muted') === 'true';
  muted = !muted;
  localStorage.setItem('chat_muted', muted);
  chatUpdateMuteIcon();
  chatShowToast(muted ? _t('tc_notifications_muted', 'Notificaciones del chat silenciadas') : _t('tc_notifications_enabled', 'Notificaciones del chat activadas'), muted ? 'warning' : 'success');
}

function chatUpdateMuteIcon() {
  var muted = localStorage.getItem('chat_muted') === 'true';
  var icon = document.getElementById('chatMuteIcon');
  if (!icon) return;
  if (muted) {
    icon.innerHTML = '<path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><line x1="1" y1="1" x2="23" y2="23" stroke="#ef4444" stroke-width="2"/>';
    icon.setAttribute('stroke', '#ef4444');
  } else {
    icon.innerHTML = '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>';
    icon.setAttribute('stroke', '#fff');
  }
}

// ============================================================
// PUSH NOTIFICATIONS FOR CHAT MESSAGES
// ============================================================
function notifyChatSubscribers(senderEmail, senderName, messageText, messageType) {
  try {
    var title = '\u{1F4AC} ' + senderName;
    var body;
    if (messageType === 'image') {
      body = '\u{1F4F7} ' + _t('tc_sent_image', 'Envió una imagen');
    } else if (messageType === 'video') {
      body = '\u{1F3A5} ' + _t('tc_sent_video', 'Envió un video');
    } else {
      body = (messageText || '').length > 80 ? messageText.substring(0, 80) + '...' : (messageText || '');
    }

    supabaseClient.from('push_subscriptions').select('user_email').eq('active', true).then(function(res) {
      if (res.error || !res.data) return;
      var emailSet = {};
      res.data.forEach(function(r) { if (r.user_email) emailSet[r.user_email] = true; });
      var recipientEmails = Object.keys(emailSet)
        .filter(function(e) { return e !== senderEmail; });

      if (recipientEmails.length === 0) return;

      supabaseClient.functions.invoke('send-push-notification', {
        body: {
          recipient_emails: recipientEmails,
          title: title,
          body: body,
          type: 'tech_chat',
          url: './',
          admin_email: getAdminEmail()
        }
      }).catch(function(err) {
        console.warn('[TechChat] Push notification error:', err);
      });
    });
  } catch(e) {
    console.warn('[TechChat] notifyChatSubscribers error:', e);
  }
}
