if (typeof _addTranslations === 'function') _addTranslations({
  aqr_not_found: { es: 'Pregunta no encontrada', en: 'Question not found' },
  aqr_ai_title: { es: 'Consulta IA — Revisión de Pregunta', en: 'AI Consultation — Question Review' },
  aqr_correct_answer: { es: '¿Respuesta correcta?', en: 'Correct answer?' },
  aqr_difficulty_ok: { es: '¿Dificultad OK?', en: 'Difficulty OK?' },
  aqr_suggest: { es: 'Sugerir mejoras', en: 'Suggest improvements' },
  aqr_click_or_type: { es: 'Haz clic en un botón o escribe tu consulta', en: 'Click a button or type your question' },
  aqr_apply_btn: { es: 'Aplicar Sugerencia IA → Abrir en Editor', en: 'Apply AI Suggestion → Open in Editor' },
  aqr_input_ph: { es: 'Escribe tu consulta...', en: 'Type your question...' },
  aqr_send: { es: 'Enviar', en: 'Send' },
  aqr_thinking: { es: 'Pensando...', en: 'Thinking...' },
  aqr_no_response: { es: 'Sin respuesta', en: 'No response' },
  aqr_no_suggestion: { es: 'No hay sugerencia de IA', en: 'No AI suggestion available' },
  aqr_no_ai_response: { es: 'No hay respuesta de IA para aplicar', en: 'No AI response to apply' },
  aqr_no_explanation: { es: 'Sin explicación', en: 'No explanation' },
  aqr_apply_title: { es: 'Aplicar Sugerencia IA', en: 'Apply AI Suggestion' },
  aqr_correct_q: { es: '¿La respuesta marcada como correcta es realmente la correcta? Explica por qué.', en: 'Is the answer marked as correct actually correct? Explain why.' },
  aqr_difficulty_q: { es: '¿La dificultad asignada es apropiada para esta pregunta? ¿Debería ser mayor o menor?', en: 'Is the assigned difficulty appropriate for this question? Should it be higher or lower?' },
  aqr_improve_q: { es: 'Sugiere mejoras para esta pregunta: redacción, opciones de respuesta, y explicación.', en: 'Suggest improvements for this question: wording, answer options, and explanation.' },
  aqr_correct_label: { es: 'CORRECTA', en: 'CORRECT' },
});

// ===== AI QUESTION REVIEW CHAT =====
function openQuestionAIChat(id) {
  var chatDiv = document.getElementById('zmQChat-' + id);
  if (!chatDiv) return;
  if (chatDiv.style.display !== 'none') { chatDiv.style.display = 'none'; return; }
  chatDiv.style.display = 'block';

  var q = _zmQuestionsCache[id];
  if (!q) { chatDiv.innerHTML = '<div style="color:#e74c3c;font-size:12px;">' + _t('aqr_not_found') + '</div>'; return; }

  if (!_questionChats[id]) {
    var letters = ['A','B','C','D'];
    var opts = Array.isArray(q.options) ? q.options : [];
    var correctIdx = typeof q.correct === 'number' ? q.correct : -1;
    var contextMsg = 'Revisa esta pregunta de examen HVAC:\n\n' +
      'PREGUNTA: ' + q.question + '\n' +
      opts.map(function(o, i) { return letters[i] + ') ' + o + (i === correctIdx ? ' ← ' + _t('aqr_correct_label') : ''); }).join('\n') + '\n' +
      'EXPLICACIÓN: ' + (q.explanation || _t('aqr_no_explanation')) + '\n' +
      'CATEGORÍA: ' + (q.category || 'N/A') + '\n' +
      'DIFICULTAD: ' + (q.difficulty || 'N/A');
    _questionChats[id] = { history: [], busy: false, context: contextMsg };
  }

  var chat = _questionChats[id];
  chatDiv.innerHTML =
    '<div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:10px;padding:10px;">' +
      '<div style="font-size:11px;font-weight:600;color:#6366f1;margin-bottom:8px;">🤖 ' + _t('aqr_ai_title') + '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">' +
        '<button onclick="sendQuestionAIChat(\'' + id + '\',_t(\'aqr_correct_q\'))" style="padding:4px 10px;border-radius:6px;border:1px solid #c7d2fe;background:#eef2ff;color:#4338ca;cursor:pointer;font-size:10px;">' + _t('aqr_correct_answer') + '</button>' +
        '<button onclick="sendQuestionAIChat(\'' + id + '\',_t(\'aqr_difficulty_q\'))" style="padding:4px 10px;border-radius:6px;border:1px solid #c7d2fe;background:#eef2ff;color:#4338ca;cursor:pointer;font-size:10px;">' + _t('aqr_difficulty_ok') + '</button>' +
        '<button onclick="sendQuestionAIChat(\'' + id + '\',_t(\'aqr_improve_q\'))" style="padding:4px 10px;border-radius:6px;border:1px solid #c7d2fe;background:#eef2ff;color:#4338ca;cursor:pointer;font-size:10px;">' + _t('aqr_suggest') + '</button>' +
      '</div>' +
      '<div id="zmQChatMsgs-' + id + '" style="max-height:200px;overflow-y:auto;margin-bottom:8px;">' +
        (chat.history.length === 0 ? '<div style="font-size:11px;color:#94a3b8;text-align:center;padding:10px;">' + _t('aqr_click_or_type') + '</div>' : _renderChatHistory(id)) +
      '</div>' +
      '<div id="zmQChatApply-' + id + '" style="display:' + (chat.history.some(function(m){return m.role==='assistant';}) ? 'block' : 'none') + ';margin-bottom:8px;">' +
        '<button onclick="applyAISuggestion(\'' + id + '\')" style="padding:5px 12px;border-radius:6px;border:1px solid #22c55e;background:#f0fdf4;color:#15803d;cursor:pointer;font-size:11px;font-weight:600;width:100%;">📝 ' + _t('aqr_apply_btn') + '</button>' +
      '</div>' +
      '<div style="display:flex;gap:6px;">' +
        '<input id="zmQChatInput-' + id + '" placeholder="' + _t('aqr_input_ph') + '" onkeydown="if(event.key===\'Enter\')sendQuestionAIChat(\'' + id + '\')" style="flex:1;padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;" />' +
        '<button onclick="sendQuestionAIChat(\'' + id + '\')" style="padding:6px 12px;border-radius:6px;border:none;background:#6366f1;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + _t('aqr_send') + '</button>' +
      '</div>' +
    '</div>';
}

function _renderChatHistory(id) {
  var chat = _questionChats[id];
  if (!chat) return '';
  var html = '';
  chat.history.forEach(function(msg) {
    if (msg.role === 'user') {
      html += '<div style="text-align:right;margin-bottom:6px;"><span style="display:inline-block;background:#6366f1;color:#fff;padding:5px 10px;border-radius:8px 8px 2px 8px;font-size:11px;max-width:85%;text-align:left;">' + _escHtml(msg.content) + '</span></div>';
    } else {
      html += '<div style="text-align:left;margin-bottom:6px;"><span style="display:inline-block;background:#fff;border:1px solid #e2e8f0;color:#334155;padding:5px 10px;border-radius:8px 8px 8px 2px;font-size:11px;max-width:85%;text-align:left;line-height:1.4;">' + _escHtml(msg.content) + '</span></div>';
    }
  });
  return html;
}

async function sendQuestionAIChat(id, presetMsg) {
  var chat = _questionChats[id];
  if (!chat || chat.busy) return;
  var userMsg = presetMsg || (document.getElementById('zmQChatInput-' + id) || {}).value || '';
  userMsg = userMsg.trim();
  if (!userMsg) return;

  // Clear input
  var input = document.getElementById('zmQChatInput-' + id);
  if (input) input.value = '';

  chat.busy = true;
  chat.history.push({ role: 'user', content: userMsg });
  var msgsDiv = document.getElementById('zmQChatMsgs-' + id);
  if (msgsDiv) {
    msgsDiv.innerHTML = _renderChatHistory(id) + '<div style="text-align:left;margin-bottom:6px;"><span style="display:inline-block;background:#f1f5f9;color:#94a3b8;padding:5px 10px;border-radius:8px;font-size:11px;">' + _t('aqr_thinking') + '</span></div>';
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
  }

  try {
    // Build messages for the API: merge context with first user message to keep alternating roles
    var apiMessages = [];
    for (var i = 0; i < chat.history.length; i++) {
      var m = chat.history[i];
      if (i === 0) {
        // First user message gets the question context prepended
        apiMessages.push({ role: 'user', content: chat.context + '\n\nCONSULTA: ' + m.content });
      } else {
        apiMessages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content });
      }
    }

    var response = await fetch(INSTRUCTOR_AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (SUPABASE_KEY) },
      body: JSON.stringify({
        messages: apiMessages,
        system: INSTRUCTOR_AI_SYSTEM,
        max_tokens: 500,
        admin_email: getAdminEmail()
      })
    });

    if (!response.ok) {
      var errText = await response.text();
      throw new Error('Error ' + response.status + ': ' + errText);
    }
    var result = await response.json();
    var aiReply = (result.reply || result.content || _t('aqr_no_response')).trim();
    chat.history.push({ role: 'assistant', content: aiReply });
  } catch(e) {
    chat.history.push({ role: 'assistant', content: 'Error: ' + e.message });
  }
  chat.busy = false;
  if (msgsDiv) {
    msgsDiv.innerHTML = _renderChatHistory(id);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
  }
  // Show "Aplicar Sugerencia" button after AI responds
  var applyBtn = document.getElementById('zmQChatApply-' + id);
  if (applyBtn) applyBtn.style.display = 'block';
}

function applyAISuggestion(id) {
  var chat = _questionChats[id];
  if (!chat || chat.history.length === 0) { alert(_t('aqr_no_suggestion')); return; }
  // Get last assistant message
  var lastAI = '';
  for (var i = chat.history.length - 1; i >= 0; i--) {
    if (chat.history[i].role === 'assistant') { lastAI = chat.history[i].content; break; }
  }
  if (!lastAI) { alert(_t('aqr_no_ai_response')); return; }

  // Parse AI suggestion — extract structured data from the response
  var original = _zmQuestionsCache[id] || {};
  var parsed = {
    id: id,
    question: original.question || '',
    options: Array.isArray(original.options) ? original.options.slice() : ['','','',''],
    correct: typeof original.correct === 'number' ? original.correct : 0,
    explanation: original.explanation || '',
    category: original.category || 'HVAC',
    difficulty: original.difficulty || 'intermedio',
    instructor_notes: original.instructor_notes || ''
  };

  // Try to extract improved question
  var qMatch = lastAI.match(/\*?\*?PREGUNTA:?\*?\*?\s*(.+?)(?:\n|$)/i) || lastAI.match(/pregunta mejorada:?\*?\*?\s*(.+?)(?:\n|$)/i);
  if (qMatch) parsed.question = qMatch[1].replace(/\*+/g, '').trim();

  // Try to extract options A-D
  var letters = ['A', 'B', 'C', 'D'];
  for (var li = 0; li < 4; li++) {
    var nextLetter = letters[li + 1];
    var terminator = nextLetter ? '(?:\\s*[' + nextLetter + nextLetter.toLowerCase() + ']\\)|\\n\\n|$)' : '(?:\\n\\n|\\n[A-Z]{3,}|$)';
    var re = new RegExp('[' + letters[li] + letters[li].toLowerCase() + ']\\)\\s*(.+?)' + terminator, 's');
    var optMatch = lastAI.match(re);
    if (optMatch) parsed.options[li] = optMatch[1].replace(/\*+/g, '').trim();
  }

  // Try to extract correct answer
  var correctMatch = lastAI.match(/\*?\*?CORRECTA\*?\*?\s*([A-Da-d])/i);
  if (correctMatch) {
    var idx = 'ABCD'.indexOf(correctMatch[1].toUpperCase());
    if (idx !== -1) parsed.correct = idx;
  }

  // Try to extract explanation
  var expMatch = lastAI.match(/\*?\*?EXPLICACI[ÓO]N(?:\s+MEJORADA)?:?\*?\*?\s*(.+?)(?:\*\*[A-Z]|\n\n|$)/is);
  if (expMatch) parsed.explanation = expMatch[1].replace(/\*+/g, '').trim();

  // Try to extract category
  var catMatch = lastAI.match(/\*?\*?CATEGOR[ÍI]A:?\*?\*?\s*(.+?)(?:\n|$)/i);
  if (catMatch) parsed.category = catMatch[1].replace(/\*+/g, '').trim();

  // Try to extract difficulty
  var diffMatch = lastAI.match(/\*?\*?DIFICULTAD:?\*?\*?\s*(.+?)(?:\n|$)/i);
  if (diffMatch) parsed.difficulty = diffMatch[1].replace(/\*+/g, '').trim().toLowerCase();

  // Add note about AI origin
  parsed.instructor_notes = (parsed.instructor_notes ? parsed.instructor_notes + '\n' : '') + '[IA] Sugerencia aplicada el ' + new Date().toLocaleDateString('es-MX');

  _showQuestionModal(parsed, '📝 ' + _t('aqr_apply_title'));
}

