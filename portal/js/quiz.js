    async function loadProgress() {
      await loadQuestions();
      // Load progress with backup fallback
      let saved = localStorage.getItem('tecnico_progress');
      if (!saved) saved = localStorage.getItem('tecnico_progress_backup');
      // Try email-specific backup
      if (!saved) {
        const emailKey = localStorage.getItem('tecnico_email');
        if (emailKey) saved = localStorage.getItem('maestroac_progress_' + emailKey);
      }
      if (saved) {
        try {
          var _parsed = JSON.parse(saved);
          // Integrity check: verify localStorage hasn't been tampered with
          var savedHash = localStorage.getItem('tecnico_progress_hash');
          if (savedHash && typeof _progressHash === 'function') {
            var expectedHash = _progressHash(_parsed);
            if (String(expectedHash) !== savedHash) {
              console.warn('[MaestroAC] Progress integrity check failed — localStorage may have been tampered. Will restore from Supabase.');
              // Don't load tampered progress; let Supabase restore handle it
              saved = null;
            } else {
              progress = _parsed;
            }
          } else {
            progress = _parsed;
          }
        } catch(e) {
          console.error('Error loading progress:', e);
        }
      }
      // If still no progress, try restoring from Supabase (covers cache/update clears)
      if (!saved && supabaseClient && isOnline && supabaseUserId) {
        try {
          console.log('[MaestroAC] No local progress found, restoring from Supabase...');
          const cloudData = await supabaseLoadUserData();
          if (cloudData && cloudData.progress && cloudData.progress.length > 0) {
            cloudData.progress.forEach(p => {
              if (progress[p.nivel]) {
                progress[p.nivel].completed = p.completed;
                progress[p.nivel].score = p.score;
                progress[p.nivel].total = p.total || 700;
              }
            });
            saveProgress();
            console.log('[MaestroAC] Progress restored from Supabase ✅');
            if (typeof showNotification === 'function') showNotification(_t('notif_progress_restored', 'Tu progreso fue restaurado desde la nube'), 'success');
          }
          if (cloudData && cloudData.certificates && cloudData.certificates.length > 0) {
            cloudData.certificates.forEach(c => {
              let exists = certificates.some(lc => lc.level === c.nivel || lc.nivel === c.nivel);
              if (!exists) certificates.push({ level: c.nivel, nivel: c.nivel, score: c.score, totalQuestions: c.total_questions, percentage: c.porcentaje, certificateNumber: c.certificate_number, date: c.fecha_obtenido });
            });
            saveCertificates();
          }
        } catch(e) { console.warn('[MaestroAC] Supabase progress restore failed:', e); }
      }

      // Version migration: sync totals with target question counts
      const APP_QUESTION_VERSION = '1.7.2';
      const savedVersion = localStorage.getItem('maestroac_question_version');
      if (savedVersion !== APP_QUESTION_VERSION) {
        console.log('[MaestroAC] Migrating question totals to v' + APP_QUESTION_VERSION);
        const targetTotals = { principiante: 700, intermedio: 700, avanzado: 700, elite: 700, platino: 700 };
        Object.keys(targetTotals).forEach(key => {
          if (progress[key]) {
            const target = targetTotals[key];
            if (progress[key].total !== target) {
              console.log('[MaestroAC] ' + key + ': ' + progress[key].total + ' -> ' + target);
              progress[key].total = target;
              if (progress[key].completed > target) {
                progress[key].completed = target;
              }
            }
          }
        });
        localStorage.setItem('maestroac_question_version', APP_QUESTION_VERSION);
        saveProgress();
      }

      // Load certificates with backup fallback - NEVER lose certificates!
      let savedCerts = localStorage.getItem('tecnico_certificates');
      if (!savedCerts) savedCerts = localStorage.getItem('tecnico_certificates_backup');
      if (savedCerts) {
        try {
          certificates = JSON.parse(savedCerts);
          // Re-save to ensure both keys have data
          saveCertificates();
        } catch(e) {
          console.error('Error loading certificates:', e);
        }
      }

      let savedUser = localStorage.getItem('tecnico_user');
      if (!savedUser) savedUser = localStorage.getItem('tecnico_user_backup');
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
          // Re-save to ensure both keys have data
          localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
          localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
          var _greetEl = document.getElementById('userGreeting');
          if (_greetEl) _greetEl.textContent = _t('hi_greeting', 'Hola') + ', ' + (currentUser.nombre || _t('student', 'Estudiante')).split(' ')[0];
          showNotifBell();
        } catch(e) {
          console.error('Error loading user:', e);
        }
      }

      // Load lastActivity tracking data
      loadLastActivity();

      // Load lastQuizState for resume functionality
      loadLastQuizState();
      
      // Check for partial quiz progress
      checkPartialQuizProgress();
    
      // Progress totals are already synced by the version migration above (APP_QUESTION_VERSION).
}
    
    // Check if there's partial quiz progress to resume
    function checkPartialQuizProgress() {
      const partial = localStorage.getItem('tecnico_quiz_partial');
      if (partial) {
        try {
          const data = JSON.parse(partial);
          // If partial progress is less than 24 hours old, offer to resume
          if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
            // Integrity check: verify partial progress wasn't tampered
            if (typeof data._ih === 'number') {
              var _vStr = data.level + '_' + data.questionIndex + '_' + data.correctAnswers;
              var _vh = 0;
              for (var _vi = 0; _vi < _vStr.length; _vi++) { _vh = ((_vh << 5) - _vh) + _vStr.charCodeAt(_vi); _vh = _vh & _vh; }
              if (_vh !== data._ih) {
                console.warn('[MaestroAC] Partial quiz progress integrity check failed — discarding');
                clearPartialProgress();
                return;
              }
            }
            window.partialQuizData = data;
          } else {
            clearPartialProgress();
          }
        } catch(e) {
          clearPartialProgress();
        }
      }
    }

    // Simple hash for progress integrity checking
    function _progressHash(p) {
      var s = '';
      var keys = ['principiante','intermedio','avanzado','elite','platino'];
      keys.forEach(function(k) { if (p[k]) s += k + p[k].completed + '.' + p[k].score + '|'; });
      var h = 0;
      for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; }
      return h;
    }

    function saveProgress() {
      localStorage.setItem('tecnico_progress', JSON.stringify(progress));
      localStorage.setItem('tecnico_progress_backup', JSON.stringify(progress));
      // Store integrity hash to detect localStorage tampering
      localStorage.setItem('tecnico_progress_hash', String(_progressHash(progress)));
      // Save per-user progress
      const email = localStorage.getItem('tecnico_email');
      if (email) {
        localStorage.setItem('maestroac_progress_' + email, JSON.stringify(progress));
      }
      // Sync to Supabase
      supabaseSaveProgress(progress);
    }


    function showAnswerReview() {
      var log = window._quizAnswerLog || {};
      if (!currentQuestions || currentQuestions.length === 0) { window.showToast(_t('quiz_no_review_data', 'No hay datos de revisión disponibles.'), 'info'); return; }

      var overlay = document.createElement('div');
      overlay.id = 'answerReviewOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:15px;';
      overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

      var letters = ['A','B','C','D'];
      var wrongOnly = false;
      var html = '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 20px 60px -12px rgba(17,17,17,0.25);">';
      html += '<div style="padding:16px 20px;border-bottom:1px solid #E7E5DE;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#FFFFFF;border-radius:16px 16px 0 0;z-index:1;">';
      html += '<h3 style="margin:0;font-size:16px;color:#0F0F0F;font-weight:800;">' + _t('quiz_review_title', 'Revisión de Respuestas') + '</h3>';
      html += '<button aria-label="' + _t('quiz_close', 'Cerrar') + '" onclick="document.getElementById(\'answerReviewOverlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#6B6B66;">✕</button>';
      html += '</div>';
      html += '<div style="padding:12px 20px;background:#FAFAF7;border-bottom:1px solid #E7E5DE;display:flex;gap:8px;">';
      html += '<button onclick="_filterReview(\'all\')" class="rvwFilter rvwActive" style="padding:6px 14px;border-radius:8px;border:1px solid #E8591C;background:#E8591C;color:#FFFFFF;cursor:pointer;font-size:12px;font-weight:700;">' + _t('quiz_all', 'Todas') + '</button>';
      html += '<button onclick="_filterReview(\'wrong\')" class="rvwFilter" style="padding:6px 14px;border-radius:8px;border:1px solid #E7E5DE;background:#FFFFFF;color:#3D3D3A;cursor:pointer;font-size:12px;font-weight:600;">' + _t('quiz_wrong_only', 'Solo Incorrectas') + '</button>';
      html += '</div>';
      html += '<div id="answerReviewList" style="padding:12px 20px;">';

      currentQuestions.forEach(function(q, idx) {
        var answer = log[idx];
        var wasCorrect = answer && answer.isCorrect;
        var wasSkipped = !answer;
        var borderColor = wasCorrect ? '#A7F3D0' : wasSkipped ? '#E7E5DE' : '#FECACA';
        var bgColor = wasCorrect ? '#ECFDF5' : wasSkipped ? '#FAFAF7' : '#FEF2F2';
        var icon = wasCorrect ? '✅' : wasSkipped ? '⏭️' : '❌';

        html += '<div class="rvwItem' + (wasCorrect ? '' : ' rvwWrong') + '" style="margin-bottom:12px;border:1px solid ' + borderColor + ';border-radius:12px;background:' + bgColor + ';padding:14px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">';
        html += '<div style="font-size:13px;font-weight:700;color:#0F0F0F;line-height:1.5;flex:1;">' + icon + ' <span style="color:#6B6B66;font-weight:600;">#' + (idx + 1) + '</span> ' + _escHtml((q.q || '').substring(0, 150)) + '</div>';
        html += '</div>';

        var opts = q.options || [];
        opts.forEach(function(opt, oi) {
          var isCorrectOpt = oi === q.correct;
          var isSelected = answer && answer.selected === oi;
          var optBg = isCorrectOpt ? '#D1FAE5' : (isSelected && !isCorrectOpt) ? '#FEE2E2' : '#FFFFFF';
          var optBorder = isCorrectOpt ? '#A7F3D0' : (isSelected && !isCorrectOpt) ? '#FECACA' : '#E7E5DE';
          var optColor = isCorrectOpt ? '#065F46' : (isSelected && !isCorrectOpt) ? '#991B1B' : '#0F0F0F';
          html += '<div style="display:flex;align-items:center;gap:6px;padding:7px 10px;margin-top:5px;border-radius:8px;border:1px solid ' + optBorder + ';background:' + optBg + ';font-size:12px;color:' + optColor + ';font-weight:500;">';
          html += '<span style="font-weight:700;">' + letters[oi] + ')</span> ' + _escHtml(opt);
          if (isCorrectOpt) html += ' <span style="margin-left:auto;font-weight:600;">' + _t('quiz_correct_answer', 'Correcta') + '</span>';
          if (isSelected && !isCorrectOpt) html += ' <span style="margin-left:auto;font-weight:600;">' + _t('quiz_your_answer', 'Tu respuesta') + '</span>';
          html += '</div>';
        });

        if (q.explanation) {
          html += '<div style="margin-top:8px;font-size:12px;color:#1E40AF;background:#EEF2FF;border:1px solid #DBEAFE;padding:10px 12px;border-radius:8px;line-height:1.55;font-weight:500;">💡 ' + _escHtml(q.explanation) + '</div>';
        }
        html += '</div>';
      });

      html += '</div></div>';
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
    }

    function _filterReview(mode) {
      var items = document.querySelectorAll('.rvwItem');
      var btns = document.querySelectorAll('.rvwFilter');
      btns.forEach(function(b, i) {
        if ((mode === 'all' && i === 0) || (mode === 'wrong' && i === 1)) {
          b.style.background = '#eef2ff'; b.style.borderColor = '#6366f1'; b.style.color = '#4338ca'; b.style.fontWeight = '600';
        } else {
          b.style.background = 'rgba(255,255,255,0.04)'; b.style.borderColor = 'rgba(255,255,255,0.1)'; b.style.color = '#94a3b8'; b.style.fontWeight = 'normal';
        }
      });
      items.forEach(function(item) {
        if (mode === 'all') { item.style.display = ''; }
        else { item.style.display = item.classList.contains('rvwWrong') ? '' : 'none'; }
      });
    }

    function resumeLastQuiz() {
      try {
        var saved = JSON.parse(localStorage.getItem('tecnico_lastQuizState') || 'null');
        if (saved && saved.levelKey) {
          startQuiz(saved.levelKey);
        } else if (saved && saved.levelId) {
          // Fallback: try to find level key from display name
          var lvl = levels.find(function(l) { return l.name === saved.levelId; });
          startQuiz(lvl ? lvl.id : saved.levelId.toLowerCase());
        }
      } catch(e) { console.warn('[Quiz] resumeLastQuiz failed:', e && e.message || e); showScreen('levelsScreen'); }
    }

    function confirmExit() {
      _showStyledConfirm(
        _t('quiz_exit_title', '← Salir del Quiz'),
        _t('quiz_exit_msg', 'Tu progreso está guardado. Puedes continuar este quiz más tarde desde el dashboard.'),
        _t('quiz_exit_btn', 'Salir'),
        _t('quiz_keep_studying', 'Seguir Estudiando'),
        function() { showScreen('levelsScreen'); }
      );
    }

    function _showStyledConfirm(title, message, confirmText, cancelText, onConfirm) {
      var overlay = document.createElement('div');
      overlay.id = 'styledConfirmOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s;';
      overlay.innerHTML = '<div style="background:#0b1425;border:1px solid rgba(255,255,255,0.1);border-radius:16px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);overflow:hidden;">' +
        '<div style="padding:24px 20px 12px;text-align:center;">' +
          '<div style="font-size:18px;font-weight:700;color:#f0f4fa;margin-bottom:8px;">' + title + '</div>' +
          '<div style="font-size:13px;color:rgba(180,200,230,0.6);line-height:1.5;">' + message + '</div>' +
        '</div>' +
        '<div style="padding:12px 20px 20px;display:flex;gap:8px;">' +
          '<button id="styledConfirmCancel" style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(200,215,240,0.7);cursor:pointer;font-size:13px;font-weight:600;">' + cancelText + '</button>' +
          '<button id="styledConfirmOk" style="flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#0E56D8,#4B8CF5);color:#fff;cursor:pointer;font-size:13px;font-weight:600;">' + confirmText + '</button>' +
        '</div>' +
      '</div>';
      document.body.appendChild(overlay);
      document.getElementById('styledConfirmCancel').onclick = function() { overlay.remove(); };
      document.getElementById('styledConfirmOk').onclick = function() { overlay.remove(); onConfirm(); };
    }

    // Certificates Functions

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Study Sections Functions
    let currentStudyLevel = 'principiante';

    const categoryIcons = {
      'Herramientas': '🔧', 'Herramientas Experto': '🔧',
      'Instalación': '🏠', 'Instalación Experto': '🏠',
      'Tubería': '🔩',
      'Soldadura': '🔥',
      'Vacío': '💨',
      'Recovery': '♻️',
      'Electricidad': '⚡', 'Electricidad Avanzada': '⚡', 'Eléctrico Experto': '⚡',
      'Refrigeración': '❄️', 'Refrigeración Comercial': '❄️',
      'Diagnóstico': '🔍', 'Diagnóstico Avanzado': '🔍', 'Diagnóstico Refrigeración': '🔍', 'Diagnóstico Experto': '🔍',
      'Diagramas Eléctricos': '📐',
      'Componentes': '⚙️',
      'Superheat/Subcooling': '🌡️',
      'Split/Mini-Split': '🌀',
      'Carga Refrigerante': '📊',
      'Válvulas y Controles': '🎛️',
      'Controles': '🎛️', 'Controles Eléctricos': '🔌', 'Controles Experto': '🎛️',
      'Calefacción': '🔥', 'Calefacción Gas': '🔥',
      'Bomba de Calor': '🏠',
      'Sistemas Comerciales': '🏢', 'HVAC Comercial': '🏢', 'Comercial Avanzado': '🏢', 'Comercial Experto': '🏢',
      'Eficiencia': '📈', 'Eficiencia Energética': '📈',
      'Refrigerantes': '🧪', 'Manejo de Refrigerantes': '🧪', 'Refrigerantes Avanzado': '🧪',
      'Seguridad': '⚠️', 'Seguridad Completa': '⚠️',
      'Mantenimiento': '🛠️', 'Mantenimiento Comercial': '🛠️', 'Mantenimiento Experto': '🛠️',
      'EPA 608': '📜', 'EPA Avanzado': '📜',
      'OSHA': '🦺', 'OSHA 30': '🦺', 'OSHA Avanzado': '🦺',
      'Troubleshooting': '🔍',
      'Liderazgo': '👷', 'Leadership': '👷', 'Liderazgo Final': '👷',
      'Soporte Técnico': '📞',
      'Diseño de Sistemas': '📐',
      'Códigos y Permisos': '📋', 'Códigos': '📋', 'Códigos y Estándares': '📋',
      'Clientes y Estimaciones': '🤝', 'Servicio Cliente': '🤝',
      'Industrial': '🏭', 'Industrial Avanzado': '🏭',
      'Finanzas': '💰', 'Finanzas Avanzado': '💰',
      'Marketing': '📢', 'Marketing Experto': '📢',
      'Legal': '⚖️', 'Legal Experto': '⚖️',
      'Ventas Reemplazo': '💵', 'Ventas Experto': '💵',
      'Supervisión': '👔', 'Supervisión Técnica': '👔',
      'Proyectos': '📊', 'Proyectos Experto': '📊',
      'Administración': '🏛️', 'Administración Avanzada': '🏛️',
      'Gestión Personal': '🧠', 'Gestión Avanzada': '🧠',
      'Residencial Avanzado': '🏠', 'Residencial Experto': '🏠',
      'Escenario de Campo': '🎯', 'Escenario Integrado': '🎯', 'Escenario Técnico': '🎯', 'Escenario Final': '🎯',
      'Técnico Avanzado': '🔧', 'Técnico Residencial': '🔧', 'Técnico Comercial': '🏢',
      'Equipos Específicos': '⚙️', 'Tecnología': '💻'
    };

    async function renderStudyLevelTabs() {
      await loadQuestions();
      const container = document.getElementById('studyLevelTabs');
      if (!container) return;
      container.innerHTML = '';

      levels.forEach(level => {
        if (questions[level.id] && questions[level.id].length > 0) {
          const tab = document.createElement('button');
          tab.className = 'study-level-tab' + (level.id === currentStudyLevel ? ' active' : '');
          tab.textContent = `${level.icon} ${level.name}`;
          tab.onclick = () => {
            currentStudyLevel = level.id;
            renderStudyLevelTabs();
            renderStudyCategories();
          };
          container.appendChild(tab);
        }
      });
    }

    function getQuestionsGroupedByCategory(levelId) {
      let levelQuestions = questions[levelId] || [];

      const grouped = {};

      levelQuestions.forEach(q => {
        if (!grouped[q.category]) {
          grouped[q.category] = [];
        }
        grouped[q.category].push(q);
      });

      return grouped;
    }

    function renderStudyCategories() {
      const container = document.getElementById('studyCategoriesList');
      if (!container) return;
      container.innerHTML = '';

      const grouped = getQuestionsGroupedByCategory(currentStudyLevel);
      const categories = Object.keys(grouped);

      if (categories.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#64748b;">' + _t('quiz_no_questions_level', 'No hay preguntas disponibles para este nivel.') + '</p>';
        return;
      }

      categories.forEach(category => {
        const count = grouped[category].length;
        const icon = categoryIcons[category] || '📋';

        const card = document.createElement('div');
        card.className = 'study-category-card';
        card.innerHTML = `
          <div class="study-category-info">
            <h3>${category}</h3>
            <p>${count} ${_t(count !== 1 ? 'quiz_questions_plural' : 'quiz_questions_singular', count !== 1 ? 'preguntas' : 'pregunta')}</p>
          </div>
          <div class="study-category-icon">${icon}</div>
        `;
        card.onclick = () => showStudyCategoryDetail(category);
        container.appendChild(card);
      });
    }

    // Specialty-to-category mapping for the 9-grid view
    const specialtyMap = {
      'electricidad-residencial': {
        name: _t('quiz_specialty_elec_res', '⚡ Electricidad Residencial'),
        keywords: ['Electricidad', 'Eléctric', 'Diagramas Eléctricos', 'Diagramas', 'Controles Eléctricos', 'Controles', 'Circuitos', 'Voltaje', 'Amperaje', 'Resistencia', 'Cableado', 'Wiring', 'Eléctrico']
      },
      'electricidad-comercial': {
        name: _t('quiz_specialty_elec_com', '⚡ Electricidad Comercial'),
        keywords: ['Electricidad Avanzada', 'Controles', 'Controles Experto']
      },
      'electricidad-industrial': {
        name: _t('quiz_specialty_elec_ind', '⚡ Electricidad Industrial'),
        keywords: ['Eléctrico Experto', 'Industrial', 'Industrial Avanzado']
      },
      'ac-residencial': {
        name: _t('quiz_specialty_ac_res', '❄️ Aire Acondicionado Residencial'),
        keywords: ['Instalación', 'Split/Mini-Split', 'Herramientas', 'Herramientas Experto', 'Tubería', 'Soldadura', 'Vacío', 'Carga Refrigerante', 'Superheat/Subcooling', 'Mantenimiento', 'Residencial Avanzado', 'Residencial Experto', 'Técnico Residencial', 'Técnico Avanzado', 'Bomba de Calor', 'Calefacción', 'Calefacción Gas', 'Componentes', 'Válvulas y Controles']
      },
      'ac-comercial': {
        name: _t('quiz_specialty_ac_com', '❄️ Aire Acondicionado Comercial'),
        keywords: ['Sistemas Comerciales', 'HVAC Comercial', 'Comercial Avanzado', 'Comercial Experto', 'Técnico Comercial', 'Mantenimiento Comercial', 'Instalación Experto', 'Mantenimiento Experto']
      },
      'ac-industrial': {
        name: _t('quiz_specialty_ac_ind', '❄️ Aire Acondicionado Industrial'),
        keywords: ['Diseño de Sistemas', 'Eficiencia', 'Eficiencia Energética', 'Equipos Específicos', 'Tecnología']
      },
      'refri-residencial': {
        name: _t('quiz_specialty_refri_res', '🧊 Refrigeración Residencial'),
        keywords: ['Refrigeración', 'Refrigerantes', 'Manejo de Refrigerantes', 'Recovery']
      },
      'refri-comercial': {
        name: _t('quiz_specialty_refri_com', '🧊 Refrigeración Comercial'),
        keywords: ['Refrigeración Comercial', 'Refrigerantes Avanzado', 'Diagnóstico Refrigeración', 'Diagnóstico', 'Diagnóstico Avanzado', 'Diagnóstico Experto', 'Troubleshooting']
      },
      'refri-industrial': {
        name: _t('quiz_specialty_refri_ind', '🧊 Refrigeración Industrial'),
        keywords: ['EPA 608', 'EPA Avanzado', 'OSHA', 'OSHA 30', 'OSHA Avanzado', 'Seguridad', 'Seguridad Completa', 'Códigos y Permisos', 'Códigos', 'Códigos y Estándares', 'Soporte Técnico', 'Liderazgo', 'Leadership', 'Liderazgo Final', 'Clientes y Estimaciones', 'Servicio Cliente', 'Finanzas', 'Finanzas Avanzado', 'Marketing', 'Marketing Experto', 'Legal', 'Legal Experto', 'Ventas Reemplazo', 'Ventas Experto', 'Supervisión', 'Supervisión Técnica', 'Proyectos', 'Proyectos Experto', 'Administración', 'Administración Avanzada', 'Gestión Personal', 'Gestión Avanzada', 'Escenario de Campo', 'Escenario Integrado', 'Escenario Técnico', 'Escenario Final']
      },
      'acca-residencial': {
        name: _t('quiz_specialty_acca_res', '📘 Manuales ACCA — Residencial'),
        keywords: ['ACCA', 'Manual J', 'Manual D', 'Manual S', 'Manual T', 'Carga Térmica', 'Diseño Ductos']
      },
      'acca-comercial': {
        name: _t('quiz_specialty_acca_com', '📘 ACCA — A/C Comercial'),
        keywords: ['ACCA Comercial', 'Manual N', 'Manual CS', 'Manual H', 'Carga Comercial']
      },
      'ashrae': {
        name: _t('quiz_specialty_ashrae', '📗 Manuales ASHRAE'),
        keywords: ['ASHRAE', 'Estándar 62', 'Estándar 90', 'Estándar 55', 'Calidad Aire', 'Ventilación', 'Confort Térmico']
      },
      'nec': {
        name: _t('quiz_specialty_nec', '📕 Código NEC'),
        keywords: ['NEC', 'National Electrical Code', 'Código Eléctrico', 'Artículo 210', 'Artículo 220', 'Artículo 230', 'Artículo 240', 'Artículo 250', 'Artículo 310', 'Artículo 430', 'Artículo 440']
      },
      'nfpa54': {
        name: _t('quiz_specialty_nfpa54', '📙 Código NFPA 54'),
        keywords: ['NFPA 54', 'NFPA', 'Código Gas', 'Gas Natural', 'Gas LP', 'Tubería Gas', 'Venteo', 'Combustión']
      },
      'bpi': {
        name: _t('quiz_specialty_bpi', '🏛️ Certificación BPI'),
        keywords: ['BPI', 'Building Performance', 'Eficiencia Energética', 'Auditoría Energética', 'Envolvente', 'Infiltración', 'Weatherization']
      }
    };

    let currentSpecialty = null;

    async function showSpecialtyCategories(specialtyId) {
      currentSpecialty = specialtyId;
      const specialty = specialtyMap[specialtyId];
      if (!specialty) return;

      // Ensure questions are loaded before accessing them
      await loadQuestions();

      // Hide the grid and level tabs, show subcategories
      document.getElementById('specialtyGrid').style.display = 'none';
      document.getElementById('studyLevelTabs').style.display = 'none';
      document.getElementById('specialtySubcategories').style.display = 'block';
      document.getElementById('specialtyTitle').textContent = specialty.name;

      // Get all questions across all levels, filter by specialty keywords
      const container = document.getElementById('studyCategoriesList');
      if (!container) return;
      container.innerHTML = '';

      const allGrouped = {};
      const levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];

      levelOrder.forEach(levelId => {
        const levelQuestions = questions[levelId] || [];
        levelQuestions.forEach(q => {
          const catNorm = (q.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (specialty.keywords.some(kw => {
            const kwNorm = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return catNorm === kwNorm || catNorm.includes(kwNorm) || kwNorm.includes(catNorm);
          })) {
            const key = q.category;
            if (!allGrouped[key]) allGrouped[key] = { questions: [], level: levelId };
            allGrouped[key].questions.push(q);
          }
        });
      });

      const cats = Object.keys(allGrouped);
      if (cats.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#64748b;padding:20px;">' + _t('quiz_coming_soon', 'Próximamente — estamos preparando las preguntas para esta especialidad.') + '</p>';
        return;
      }

      cats.forEach(cat => {
        const count = allGrouped[cat].questions.length;
        const icon = categoryIcons[cat] || '📋';

        const card = document.createElement('div');
        card.className = 'study-category-card';
        card.innerHTML = `
          <div class="study-category-info">
            <h3>${cat}</h3>
            <p>${count} ${_t(count !== 1 ? 'quiz_questions_plural' : 'quiz_questions_singular', count !== 1 ? 'preguntas' : 'pregunta')}</p>
          </div>
          <div class="study-category-icon">${icon}</div>
        `;
        card.onclick = () => {
          // Set the level for detail view
          currentStudyLevel = allGrouped[cat].level;
          showStudyCategoryDetail(cat);
        };
        container.appendChild(card);
      });

      // Also add unmatched categories under a "Otros" section if this is a broad specialty
    }

    async function showStudyCategoryDetail(category) {
      await loadQuestions();
      const grouped = getQuestionsGroupedByCategory(currentStudyLevel);
      const categoryQuestions = grouped[category] || [];
      const levelName = levels.find(l => l.id === currentStudyLevel)?.name || currentStudyLevel;

      document.getElementById('studyBreadcrumb').textContent = `${levelName} > ${category}`;
      document.getElementById('studyCategoryTitle').textContent = category;
      document.getElementById('studyCategorySubtitle').textContent = categoryQuestions.length + ' ' + _t(categoryQuestions.length !== 1 ? 'quiz_questions_plural' : 'quiz_questions_singular', categoryQuestions.length !== 1 ? 'preguntas' : 'pregunta');

      const container = document.getElementById('studyQuestionsList');
      if (!container) return;
      container.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D'];

      categoryQuestions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'study-question-card';

        let optionsHtml = '';
        (q.options || []).forEach((opt, i) => {
          const isCorrect = i === q.correct;
          optionsHtml += `
            <div class="study-option${isCorrect ? ' correct-answer' : ''}">
              <div class="study-option-letter">${letters[i]}</div>
              <span>${_escHtml(opt)}</span>
              ${isCorrect ? '<span style="margin-left:auto; color:#27ae60;">✓</span>' : ''}
            </div>
          `;
        });

        card.innerHTML = `
          <span class="study-question-number">${_t('quiz_question', 'Pregunta')} ${index + 1}</span>
          <div class="study-question-text">${_escHtml(q.q)}</div>
          <div class="study-options">${optionsHtml}</div>
          <div class="study-explanation">
            <div class="study-explanation-title">💡 ${_t('quiz_explanation', 'Explicación')}</div>
            <div class="study-explanation-text">${_escHtml(q.explanation || '')}</div>
          </div>
        `;

        container.appendChild(card);
      });

      // Track lesson (study category) opened as lastActivity
      updateLastActivity('lesson', currentStudyLevel, category, null, 'studyCategoryDetailScreen');
      showScreen('studyCategoryDetailScreen');
    }

    // Override showScreen to initialize study sections when needed
    const originalShowScreen = showScreen;
    showScreen = function(screenId) {
      originalShowScreen(screenId);
      var cvBtn = document.getElementById('clasesVivoFloatingBtn');
      if (cvBtn) {
        if (screenId === 'dashboardScreen') { if (typeof checkLiveClassNow === 'function') checkLiveClassNow(); } else { cvBtn.style.display = 'none'; }
      }
      if (screenId === 'studySectionsScreen') {
        renderStudyLevelTabs().then(function() { renderStudyCategories(); }).catch(function(e){ console.error('[Quiz] Study tabs error:', e); });
        // Reset to grid view
        document.getElementById('specialtyGrid').style.display = 'grid';
        document.getElementById('specialtySubcategories').style.display = 'none';
        document.getElementById('studyLevelTabs').style.display = 'flex';
      }
      if (screenId === 'videoLessonsScreen') {
        // YouTube videos are public — always load them without paywall
        if (!youtubeVideosLoaded || videoLessons.length === 0) {
          loadYouTubeVideos();
        } else {
          renderVideoLessonsList();
        }
      }
      if (screenId === 'adminDashboardScreen') {
        if (typeof renderAdminDashboard === 'function') { renderAdminDashboard(); }
        else if (window.MaestroLoader) {
          // Wait for admin scripts to finish loading before rendering
          window.addEventListener('maestro:loaded', function _adm(e) {
            if (e.detail && e.detail.indexOf('student-success') > -1) {
              window.removeEventListener('maestro:loaded', _adm);
              try { renderAdminDashboard(); } catch(ex) { console.warn('[Quiz]', ex.message || ex); }
            }
          });
        }
      }
    };

