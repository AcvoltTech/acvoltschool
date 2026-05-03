// EPA 608 Study System — Maestro HVACR
// 3 Modes: Estudiar (read all), Practicar (interactive quiz), Simulacro (timed exam)
(function() {
  'use strict';
  var _qf = typeof window._q === 'function' ? window._q : function(q, f) { return q[f]; };

  var _activeTab = 'estudiar';
  var _practiceState = {
    categoria: null, questions: [], currentIndex: 0,
    correctas: 0, incorrectas: 0, streak: 0, bestStreak: 0,
    answered: false, selectedAnswer: -1
  };
  var _simulacroState = {
    questions: [], answers: [], currentIndex: 0,
    startTime: null, timerInterval: null, timeLimit: 90 * 60, finished: false
  };

  function _esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function _catName(c) { return window._lang === 'en' && c.en ? c.en : c.nombre; }
  function _shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function _getByCategory(cat) {
    if (!window.EPA608_QUESTIONS) return [];
    if (cat === 'ALL') return window.EPA608_QUESTIONS.slice();
    return window.EPA608_QUESTIONS.filter(function(q) { return q.categoria === cat; });
  }
  function _loadProgress(cat) {
    try { return JSON.parse(localStorage.getItem('epa608_progress_' + cat)) || { correctas: 0, total: 0 }; }
    catch(e) { return { correctas: 0, total: 0 }; }
  }
  function _saveProgress(cat, correctas, total) {
    try { localStorage.setItem('epa608_progress_' + cat, JSON.stringify({ correctas: correctas, total: total, fecha: new Date().toISOString() })); }
    catch(e) {}
  }
  function _loadSimulacroHistory() {
    try { return JSON.parse(localStorage.getItem('epa608_simulacros')) || []; }
    catch(e) { return []; }
  }
  function _saveSimulacroResult(result) {
    try {
      var hist = _loadSimulacroHistory();
      hist.push(result);
      if (hist.length > 20) hist = hist.slice(-20);
      localStorage.setItem('epa608_simulacros', JSON.stringify(hist));
    } catch(e) {}
  }

  // ── Main Init ──
  window.initEpa608Study = function() {
    var screen = document.getElementById('epa608StudyScreen');
    if (!screen) return;
    _activeTab = 'estudiar';
    _renderMain(screen);
  };

  function _renderMain(screen) {
    var html = '';
    html += '<div style="background:linear-gradient(135deg,#1565C0,#0D47A1);padding:16px 12px 12px;border-radius:0 0 20px 20px;margin:-1px -1px 0;">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
    html += '<button onclick="showScreen(window._studyReturnScreen||\'dashboardScreen\')" style="background:rgba(255,255,255,0.15);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:14px;">\u2190 ' + (typeof _t === 'function' ? _t('study_back', 'Volver') : 'Volver') + '</button>';
    html += '<div style="flex:1;text-align:center;"><h2 style="color:#fff;margin:0;font-size:18px;">EPA 608 Certification</h2>';
    html += '<p style="color:rgba(255,255,255,0.7);margin:2px 0 0;font-size:12px;">' + (typeof _t === 'function' ? _t('epa_500_prep_q', '500 preguntas de preparacion') : '500 preguntas de preparacion') + '</p></div>';
    html += '<div style="width:60px;"></div></div>';

    html += '<div style="display:flex;gap:4px;background:rgba(0,0,0,0.2);border-radius:10px;padding:3px;" id="epa608Tabs">';
    var tabs = [
      { id: 'estudiar', label: (typeof _t === 'function' ? _t('study_tab_study', 'Estudiar') : 'Estudiar'), icon: '\ud83d\udcd6' },
      { id: 'practicar', label: (typeof _t === 'function' ? _t('study_tab_practice', 'Practicar') : 'Practicar'), icon: '\ud83c\udfaf' },
      { id: 'simulacro', label: (typeof _t === 'function' ? _t('study_tab_mock', 'Simulacro') : 'Simulacro'), icon: '\ud83d\udcdd' }
    ];
    tabs.forEach(function(tab) {
      var isActive = tab.id === _activeTab;
      html += '<button onclick="_epa608SwitchTab(\'' + tab.id + '\')" style="flex:1;padding:8px 4px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;' +
        (isActive ? 'background:#fff;color:#1565C0;box-shadow:0 2px 8px rgba(0,0,0,0.15);' : 'background:transparent;color:rgba(255,255,255,0.7);') +
        '">' + tab.icon + ' ' + tab.label + '</button>';
    });
    html += '</div></div>';
    html += '<div id="epa608Content" style="padding:12px;overflow-y:auto;flex:1;"></div>';
    screen.innerHTML = html;
    _renderTabContent();
  }

  window._epa608SwitchTab = async function(tabId) {
    if (_activeTab === 'simulacro' && tabId !== 'simulacro' && _simulacroState.timerInterval) {
      if (_simulacroState.questions.length > 0 && !_simulacroState.finished) {
        var _ok = await window.MaestroDialog.confirm({title:'\u00bfSalir del simulacro?', message:'Perder\u00e1s tu progreso actual si sales ahora.', okText:'Salir', cancelText:'Continuar', destructive:true, kind:'warning'});
        if (!_ok) return;
        clearInterval(_simulacroState.timerInterval);
        _simulacroState.timerInterval = null;
      }
    }
    _activeTab = tabId;
    var tabsDiv = document.getElementById('epa608Tabs');
    if (tabsDiv) {
      var btns = tabsDiv.querySelectorAll('button');
      var tabIds = ['estudiar', 'practicar', 'simulacro'];
      btns.forEach(function(btn, i) {
        if (tabIds[i] === tabId) {
          btn.style.background = '#fff'; btn.style.color = '#1565C0'; btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        } else {
          btn.style.background = 'transparent'; btn.style.color = 'rgba(255,255,255,0.7)'; btn.style.boxShadow = 'none';
        }
      });
    }
    _renderTabContent();
  };

  function _renderTabContent() {
    var container = document.getElementById('epa608Content');
    if (!container) return;
    if (_activeTab === 'estudiar') _renderEstudiar(container);
    else if (_activeTab === 'practicar') _renderPracticar(container);
    else if (_activeTab === 'simulacro') _renderSimulacro(container);
  }

  // ══════════════════════════════════════════════════
  // TAB 1 — ESTUDIAR
  // ══════════════════════════════════════════════════
  function _renderEstudiar(container) {
    var cats = window.EPA608_CATEGORIAS || {};
    var html = '<div style="margin-bottom:12px;"><p style="color:#3D3D3A;font-weight:500;font-size:13px;margin:0;">' + (typeof _t === 'function' ? _t('study_review_desc', 'Revisa todas las preguntas con sus respuestas y explicaciones. Toca una seccion para expandirla.') : 'Revisa todas las preguntas con sus respuestas y explicaciones. Toca una seccion para expandirla.') + '</p></div>';
    var catKeys = ['EPA608_CORE', 'EPA608_TIPO1', 'EPA608_TIPO2', 'EPA608_TIPO3', 'EPA608_UNIVERSAL'];
    var letters = ['A', 'B', 'C', 'D'];

    catKeys.forEach(function(catKey) {
      var catInfo = cats[catKey] || { nombre: catKey, icon: '\ud83d\udccb', color: '#666', count: 0 };
      var questions = _getByCategory(catKey);

      html += '<div class="epa608-cat-section" id="epa608Cat_' + catKey + '">';
      html += '<div onclick="document.getElementById(\'epa608Cat_' + catKey + '\').classList.toggle(\'epa608-cat-open\')" style="background:linear-gradient(135deg,' + catInfo.color + ',' + catInfo.color + 'cc);padding:12px 14px;border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:10px;margin-bottom:2px;transition:all 0.2s;">';
      html += '<span style="font-size:24px;">' + catInfo.icon + '</span>';
      html += '<div style="flex:1;"><div style="color:#fff;font-weight:700;font-size:14px;">' + _esc(_catName(catInfo)) + '</div>';
      html += '<div style="color:rgba(255,255,255,0.8);font-size:12px;">' + questions.length + ' ' + (typeof _t === 'function' ? _t('study_questions', 'preguntas') : 'preguntas') + '</div></div>';
      html += '<span style="color:#fff;font-size:18px;transition:transform 0.3s;" class="epa608-cat-arrow">\u25bc</span>';
      html += '</div>';

      html += '<div class="epa608-cat-body" style="display:none;padding:8px 0;">';
      questions.forEach(function(q, qi) {
        html += '<div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:10px;padding:12px;margin-bottom:8px;">';
        html += '<div style="font-weight:600;color:#0F0F0F;font-size:13px;margin-bottom:8px;">' + (qi + 1) + '. ' + _esc(_qf(q,'pregunta')) + '</div>';
        _qf(q,'opciones').forEach(function(opt, oi) {
          var isCorrect = oi === q.respuesta_correcta;
          html += '<div style="padding:6px 10px;margin:3px 0;border-radius:6px;font-size:12px;' +
            (isCorrect ? 'background:#ECFDF5;border:1px solid #A7F3D0;color:#059669;font-weight:600;' : 'background:#FFFFFF;border:1px solid #E7E5DE;color:#3D3D3A;font-weight:500;') +
            '">' + letters[oi] + ') ' + _esc(opt) + (isCorrect ? ' \u2713' : '') + '</div>';
        });
        if (_qf(q,'explicacion')) {
          html += '<div style="margin-top:8px;padding:8px 10px;background:#FAFAF7;border-left:3px solid #E8591C;border-radius:0 6px 6px 0;font-size:11px;color:#3D3D3A;font-weight:500;font-style:italic;">\ud83d\udca1 ' + _esc(_qf(q,'explicacion')) + '</div>';
        }
        html += '</div>';
      });
      html += '</div></div>';
    });

    container.innerHTML = html;
    _injectStyles();
  }

  function _injectStyles() {
    if (document.getElementById('epa608StudyStyles')) return;
    var style = document.createElement('style');
    style.id = 'epa608StudyStyles';
    style.textContent =
      '.epa608-cat-section .epa608-cat-body{display:none}' +
      '.epa608-cat-section.epa608-cat-open .epa608-cat-body{display:block!important}' +
      '.epa608-cat-section.epa608-cat-open .epa608-cat-arrow{transform:rotate(180deg)}' +
      '.epa608-cat-section{margin-bottom:8px}';
    document.head.appendChild(style);
  }

  // ══════════════════════════════════════════════════
  // TAB 2 — PRACTICAR (25-question quiz chunks)
  // ══════════════════════════════════════════════════
  var _practiceView = 'categories'; // 'categories' | 'quizzes' | 'active'
  var _practiceSelectedCat = null;

  function _loadQuizProgress(cat, quizNum) {
    try { return JSON.parse(localStorage.getItem('epa608_quiz_' + cat + '_' + quizNum)) || null; }
    catch(e) { return null; }
  }
  function _saveQuizProgress(cat, quizNum, correctas, total) {
    try { localStorage.setItem('epa608_quiz_' + cat + '_' + quizNum, JSON.stringify({ correctas: correctas, total: total, fecha: new Date().toISOString() })); }
    catch(e) {}
  }

  function _renderPracticar(container) {
    if (_practiceState.questions.length > 0 && _practiceState.currentIndex < _practiceState.questions.length) {
      _renderPracticeQuestion(container);
      return;
    }
    if (_practiceView === 'quizzes' && _practiceSelectedCat) {
      _renderQuizSelector(container);
      return;
    }
    _practiceView = 'categories';
    var cats = window.EPA608_CATEGORIAS || {};
    var html = '<div style="margin-bottom:14px;"><h3 style="color:#0F0F0F;margin:0 0 4px;font-size:16px;font-weight:800;">\ud83c\udfaf Modo Practica</h3>';
    html += '<p style="color:#3D3D3A;font-weight:500;font-size:13px;margin:0;">' + (typeof _t === 'function' ? _t('study_choose_cat', 'Elige una categoria. Cada una tiene 4 quizzes de 25 preguntas.') : 'Elige una categoria. Cada una tiene 4 quizzes de 25 preguntas.') + '</p></div>';

    var catKeys = ['EPA608_CORE', 'EPA608_TIPO1', 'EPA608_TIPO2', 'EPA608_TIPO3', 'EPA608_UNIVERSAL'];
    catKeys.forEach(function(catKey) {
      var catInfo = cats[catKey] || { nombre: catKey, icon: '\ud83d\udccb', color: '#666', count: 0 };
      var questions = _getByCategory(catKey);
      var numQuizzes = Math.ceil(questions.length / 25);
      var completedQuizzes = 0;
      var totalCorrect = 0, totalAnswered = 0;
      for (var qi = 1; qi <= numQuizzes; qi++) {
        var qp = _loadQuizProgress(catKey, qi);
        if (qp) { completedQuizzes++; totalCorrect += qp.correctas; totalAnswered += qp.total; }
      }
      var pct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      html += '<div onclick="_epa608ShowQuizzes(\'' + catKey + '\')" style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all 0.2s;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
      html += '<span style="font-size:28px;">' + catInfo.icon + '</span>';
      html += '<div style="flex:1;"><div style="font-weight:700;color:#0F0F0F;font-size:14px;">' + _esc(_catName(catInfo)) + '</div>';
      html += '<div style="color:#6B6B66;font-weight:500;font-size:12px;">' + questions.length + ' ' + (typeof _t === 'function' ? _t('study_questions', 'preguntas') : 'preguntas') + ' \u2022 ' + numQuizzes + ' quizzes</div>';
      if (totalAnswered > 0) {
        html += '<div style="margin-top:4px;height:4px;background:#E7E5DE;border-radius:2px;overflow:hidden;"><div style="height:100%;width:' + (completedQuizzes / numQuizzes * 100) + '%;background:' + catInfo.color + ';border-radius:2px;"></div></div>';
        html += '<div style="font-size:10px;color:#6B6B66;font-weight:500;margin-top:2px;">' + completedQuizzes + '/' + numQuizzes + ' quizzes \u2022 ' + pct + '% ' + (typeof _t === 'function' ? _t('study_correct_pct', 'correctas') : 'correctas') + '</div>';
      }
      html += '</div><span style="color:' + catInfo.color + ';font-size:20px;">\u2192</span></div>';
    });

    html += '<div onclick="_epa608StartPractice(\'ALL\',0)" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:12px;">';
    html += '<span style="font-size:28px;">\ud83c\udfb2</span>';
    html += '<div style="flex:1;"><div style="font-weight:700;color:#fff;font-size:14px;">' + (typeof _t === 'function' ? _t('study_random_25','Aleatorio \u2014 25 Preguntas Mezcladas') : 'Aleatorio \u2014 25 Preguntas Mezcladas') + '</div>';
    html += '<div style="color:rgba(255,255,255,0.8);font-size:12px;">' + (typeof _t === 'function' ? _t('study_from_all_cats','De todas las categorias') : 'De todas las categorias') + '</div></div>';
    html += '<span style="color:#fff;font-size:20px;">\u2192</span></div>';

    container.innerHTML = html;
  }

  window._epa608ShowQuizzes = function(cat) {
    _practiceView = 'quizzes';
    _practiceSelectedCat = cat;
    _renderTabContent();
  };

  function _renderQuizSelector(container) {
    var cat = _practiceSelectedCat;
    var cats = window.EPA608_CATEGORIAS || {};
    var catInfo = cats[cat] || { nombre: cat, icon: '\ud83d\udccb', color: '#666' };
    var questions = _getByCategory(cat);
    var numQuizzes = Math.ceil(questions.length / 25);

    var html = '<div style="margin-bottom:14px;">';
    html += '<button onclick="_epa608BackToCategories()" style="background:#FFFFFF;border:1px solid #E7E5DE;color:#0F0F0F;font-weight:600;cursor:pointer;font-size:13px;padding:8px 12px;border-radius:8px;margin-bottom:10px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">\u2190 ' + (typeof _t === 'function' ? _t('study_back_categories', 'Volver a Categorias') : 'Volver a Categorias') + '</button>';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><span style="font-size:28px;">' + catInfo.icon + '</span>';
    html += '<div><h3 style="color:#0F0F0F;margin:0;font-size:16px;font-weight:800;">' + _esc(_catName(catInfo)) + '</h3>';
    html += '<p style="color:#6B6B66;font-weight:500;font-size:12px;margin:2px 0 0;">' + questions.length + ' ' + (typeof _t === 'function' ? _t('study_questions', 'preguntas') : 'preguntas') + ' ' + (typeof _t === 'function' ? _t('study_in', 'en') : 'en') + ' ' + numQuizzes + ' quizzes ' + (typeof _t === 'function' ? _t('study_of_size', 'de') : 'de') + ' 25</p></div></div></div>';

    for (var qi = 1; qi <= numQuizzes; qi++) {
      var qp = _loadQuizProgress(cat, qi);
      var startIdx = (qi - 1) * 25;
      var endIdx = Math.min(qi * 25, questions.length);
      var qCount = endIdx - startIdx;
      var completed = !!qp;
      var pct = qp ? Math.round((qp.correctas / qp.total) * 100) : 0;
      var passed = pct >= 70;

      html += '<div onclick="_epa608StartPractice(\'' + cat + '\',' + qi + ')" style="background:#FFFFFF;border:1px solid ' + (completed ? (passed ? '#A7F3D0' : '#FECACA') : '#E7E5DE') + ';border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
      html += '<div style="width:40px;height:40px;border-radius:50%;background:' + (completed ? (passed ? '#ECFDF5' : '#FEF2F2') : '#FAFAF7') + ';border:1px solid ' + (completed ? (passed ? '#A7F3D0' : '#FECACA') : '#E7E5DE') + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:' + (completed ? (passed ? '#059669' : '#DC2626') : '#0F0F0F') + ';">' + qi + '</div>';
      html += '<div style="flex:1;"><div style="font-weight:700;color:#0F0F0F;font-size:14px;">Quiz ' + qi + '</div>';
      html += '<div style="color:#6B6B66;font-weight:500;font-size:12px;">' + (typeof _t === 'function' ? _t('study_questions_cap', 'Preguntas') : 'Preguntas') + ' ' + (startIdx + 1) + '-' + endIdx + ' (' + qCount + ')</div>';
      if (completed) {
        html += '<div style="margin-top:4px;height:4px;background:#E7E5DE;border-radius:2px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:' + (passed ? '#059669' : '#DC2626') + ';border-radius:2px;"></div></div>';
        html += '<div style="font-size:10px;color:#6B6B66;font-weight:500;margin-top:2px;">' + qp.correctas + '/' + qp.total + ' correctas (' + pct + '%) ' + (passed ? '\u2705' : '\u274c') + '</div>';
      }
      html += '</div>';
      html += '<span style="color:' + catInfo.color + ';font-size:18px;">' + (completed ? '\ud83d\udd04' : '\u25b6') + '</span></div>';
    }
    container.innerHTML = html;
  }

  window._epa608BackToCategories = function() {
    _practiceView = 'categories';
    _practiceSelectedCat = null;
    _renderTabContent();
  };

  window._epa608StartPractice = function(cat, quizNum) {
    var questions = _getByCategory(cat);
    if (questions.length === 0) return;
    var quizQuestions;
    if (cat === 'ALL') {
      quizQuestions = _shuffle(questions).slice(0, 25);
    } else if (quizNum > 0) {
      // BUG FIX: previously sliced fixed 25-question chunks, so retrying
      // "Quiz N" gave the same questions every time. Now random 25 from
      // the full category pool every retry.
      quizQuestions = _shuffle(questions).slice(0, 25);
    } else {
      quizQuestions = _shuffle(questions).slice(0, 25);
    }
    _practiceView = 'active';
    _practiceState = {
      categoria: cat, quizNum: quizNum || 0, questions: quizQuestions, currentIndex: 0,
      correctas: 0, incorrectas: 0, streak: 0, bestStreak: 0,
      answered: false, selectedAnswer: -1
    };
    _renderTabContent();
  };

  function _renderPracticeQuestion(container) {
    var st = _practiceState;
    var q = st.questions[st.currentIndex];
    if (!q) { _renderPracticar(container); return; }
    var catInfo = (window.EPA608_CATEGORIAS || {})[q.categoria] || { nombre: q.categoria, color: '#666' };
    var total = st.questions.length;
    var num = st.currentIndex + 1;
    var letters = ['A', 'B', 'C', 'D'];

    var html = '';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding:8px 12px;background:#FAFAF7;border:1px solid #E7E5DE;border-radius:10px;">';
    html += '<button onclick="_epa608ExitPractice()" style="background:#FFFFFF;border:1px solid #E7E5DE;color:#0F0F0F;font-weight:600;cursor:pointer;font-size:13px;padding:6px 10px;border-radius:8px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">\u2190 Salir</button>';
    html += '<div style="font-size:12px;color:#0F0F0F;font-weight:700;">' + num + ' / ' + total + '</div>';
    html += '<div style="display:flex;gap:8px;font-size:12px;font-weight:600;">';
    html += '<span style="color:#059669;">\u2713 ' + st.correctas + '</span>';
    html += '<span style="color:#DC2626;">\u2717 ' + st.incorrectas + '</span>';
    html += '<span style="color:#E8591C;">\ud83d\udd25 ' + st.streak + '</span>';
    html += '</div></div>';

    html += '<div style="height:4px;background:#E7E5DE;border-radius:2px;margin-bottom:14px;overflow:hidden;"><div style="height:100%;width:' + ((num / total) * 100) + '%;background:linear-gradient(90deg,#E8591C,#C2410C);border-radius:2px;transition:width 0.3s;"></div></div>';
    html += '<div style="display:inline-block;background:' + catInfo.color + '22;color:' + catInfo.color + ';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:10px;">' + _esc(_catName(catInfo)) + '</div>';
    html += '<div style="font-size:15px;font-weight:600;color:#0F0F0F;margin-bottom:14px;line-height:1.5;">' + _esc(_qf(q,'pregunta')) + '</div>';

    _qf(q,'opciones').forEach(function(opt, oi) {
      var btnStyle = 'display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:6px;border-radius:10px;font-size:13px;cursor:pointer;transition:all 0.2s;font-weight:500;';
      if (st.answered) {
        if (oi === q.respuesta_correcta) btnStyle += 'background:#ECFDF5;border:1px solid #A7F3D0;color:#059669;font-weight:700;';
        else if (oi === st.selectedAnswer && oi !== q.respuesta_correcta) btnStyle += 'background:#FEF2F2;border:1px solid #FECACA;color:#DC2626;font-weight:600;';
        else btnStyle += 'background:#FAFAF7;border:1px solid #E7E5DE;color:#6B6B66;';
        btnStyle += 'cursor:default;';
      } else {
        btnStyle += 'background:#FFFFFF;border:1px solid #E7E5DE;color:#0F0F0F;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);';
      }
      html += '<button onclick="_epa608PracticeAnswer(' + oi + ')" style="' + btnStyle + '">';
      html += '<strong>' + letters[oi] + ')</strong> ' + _esc(opt);
      if (st.answered && oi === q.respuesta_correcta) html += ' \u2713';
      html += '</button>';
    });

    if (st.answered) {
      var correct = st.selectedAnswer === q.respuesta_correcta;
      html += '<div style="margin-top:12px;padding:12px;border-radius:10px;' +
        (correct ? 'background:#ECFDF5;border:1px solid #A7F3D0;' : 'background:#FEF2F2;border:1px solid #FECACA;') + '">';
      html += '<div style="font-weight:700;font-size:14px;margin-bottom:4px;' + (correct ? 'color:#059669;">\u2713 \u00a1Correcto!' : 'color:#DC2626;">\u2717 Incorrecto') + '</div>';
      if (_qf(q,'explicacion')) html += '<div style="font-size:12px;color:#3D3D3A;font-weight:500;line-height:1.5;">\ud83d\udca1 ' + _esc(_qf(q,'explicacion')) + '</div>';
      html += '</div>';
      html += '<button onclick="_epa608PracticeNext()" style="display:block;width:100%;margin-top:14px;padding:14px;background:linear-gradient(135deg,#1565C0,#0D47A1);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;">';
      html += (st.currentIndex < st.questions.length - 1) ? (typeof _t === 'function' ? _t('study_next_q', 'Siguiente Pregunta') : 'Siguiente Pregunta') + ' \u2192' : (typeof _t === 'function' ? _t('study_view_results', 'Ver Resultados') : 'Ver Resultados') + ' \ud83d\udcca';
      html += '</button>';
    }
    container.innerHTML = html;
  }

  window._epa608PracticeAnswer = function(idx) {
    if (_practiceState.answered) return;
    _practiceState.answered = true;
    _practiceState.selectedAnswer = idx;
    var q = _practiceState.questions[_practiceState.currentIndex];
    if (idx === q.respuesta_correcta) {
      _practiceState.correctas++;
      _practiceState.streak++;
      if (_practiceState.streak > _practiceState.bestStreak) _practiceState.bestStreak = _practiceState.streak;
      if (window.Gamification) window.Gamification.recordAnswer('epa608', q.categoria || q.category || '', true);
    } else {
      _practiceState.incorrectas++;
      _practiceState.streak = 0;
      if (window.Gamification) window.Gamification.recordAnswer('epa608', q.categoria || q.category || '', false);
    }
    _renderPracticeQuestion(document.getElementById('epa608Content'));
  };

  window._epa608PracticeNext = function() {
    _practiceState.currentIndex++;
    _practiceState.answered = false;
    _practiceState.selectedAnswer = -1;
    var container = document.getElementById('epa608Content');
    if (_practiceState.currentIndex >= _practiceState.questions.length) {
      var cat = _practiceState.categoria;
      var total = _practiceState.correctas + _practiceState.incorrectas;
      if (cat !== 'ALL' && _practiceState.quizNum > 0) {
        _saveQuizProgress(cat, _practiceState.quizNum, _practiceState.correctas, total);
      }
      _renderPracticeResults(container);
    } else {
      _renderPracticeQuestion(container);
    }
  };

  function _renderPracticeResults(container) {
    var st = _practiceState;
    var total = st.correctas + st.incorrectas;
    var pct = total > 0 ? Math.round((st.correctas / total) * 100) : 0;
    var passed = pct >= 70;
    var catInfo = (window.EPA608_CATEGORIAS || {})[st.categoria] || { nombre: st.categoria, color: '#666' };
    var quizLabel = st.quizNum > 0 ? ' — Quiz ' + st.quizNum : '';
    var html = '<div style="text-align:center;padding:20px 0;">';
    html += '<div style="font-size:60px;margin-bottom:10px;">' + (passed ? '\ud83c\udf89' : '\ud83d\udcda') + '</div>';
    html += '<h2 style="color:#0F0F0F;margin:0 0 4px;font-weight:800;">' + (passed ? '\u00a1Excelente!' : 'Sigue Practicando') + '</h2>';
    if (st.categoria !== 'ALL') html += '<p style="color:#6B6B66;font-weight:500;font-size:12px;margin:0 0 8px;">' + _esc(_catName(catInfo)) + quizLabel + '</p>';
    html += '<div style="font-size:48px;font-weight:900;color:' + (passed ? '#059669' : '#DC2626') + ';margin:10px 0;">' + pct + '%</div>';
    html += '<p style="color:#3D3D3A;font-weight:500;font-size:14px;">' + st.correctas + ' ' + (typeof _t === 'function' ? _t('study_correct_of', 'correctas de') : 'correctas de') + ' ' + total + ' ' + (typeof _t === 'function' ? _t('study_questions', 'preguntas') : 'preguntas') + '</p>';
    html += '<p style="color:#E8591C;font-weight:600;font-size:13px;">\ud83d\udd25 ' + (typeof _t === 'function' ? _t('study_best_streak', 'Mejor racha') : 'Mejor racha') + ': ' + st.bestStreak + '</p>';
    html += '<div style="display:flex;gap:8px;margin-top:20px;">';
    html += '<button onclick="_epa608StartPractice(\'' + st.categoria + '\',' + (st.quizNum || 0) + ')" style="flex:1;padding:12px;background:linear-gradient(135deg,#1565C0,#0D47A1);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">' + (typeof _t === 'function' ? _t('study_repeat', '\ud83d\udd04 Repetir') : '\ud83d\udd04 Repetir') + '</button>';
    html += '<button onclick="_epa608ExitPractice()" style="flex:1;padding:12px;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">\u2190 Categorias</button>';
    html += '</div></div>';
    container.innerHTML = html;
  }

  window._epa608ExitPractice = function() {
    var st = _practiceState;
    if (st.categoria && st.categoria !== 'ALL' && st.quizNum > 0 && (st.correctas + st.incorrectas) > 0) {
      _saveQuizProgress(st.categoria, st.quizNum, st.correctas, st.correctas + st.incorrectas);
    }
    _practiceState.questions = [];
    _practiceState.currentIndex = 0;
    _practiceView = 'categories';
    _renderTabContent();
  };

  // ══════════════════════════════════════════════════
  // TAB 3 — SIMULACRO
  // ══════════════════════════════════════════════════
  function _renderSimulacro(container) {
    if (_simulacroState.questions.length > 0 && !_simulacroState.finished) {
      _renderSimulacroQuestion(container);
      return;
    }
    if (_simulacroState.finished) {
      _renderSimulacroResults(container);
      return;
    }

    var history = _loadSimulacroHistory();
    var html = '<div style="text-align:center;padding:16px 0;">';
    html += '<div style="font-size:48px;margin-bottom:8px;">\ud83d\udcdd</div>';
    html += '<h2 style="color:#0F0F0F;margin:0 0 8px;font-size:20px;font-weight:800;">' + (typeof _t === 'function' ? _t('study_tab_mock', 'Simulacro') : 'Simulacro') + ' EPA 608</h2>';
    html += '<p style="color:#3D3D3A;font-weight:500;font-size:13px;max-width:320px;margin:0 auto 20px;">' + (typeof _t === 'function' ? _t('study_mock_desc', 'Examen completo de 100 preguntas con timer de 90 minutos. Necesitas \u226570% en CADA seccion para aprobar.') : 'Examen completo de 100 preguntas con timer de 90 minutos. Necesitas \u226570% en CADA seccion para aprobar.') + '</p>';

    html += '<div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:12px;padding:14px;text-align:left;margin-bottom:16px;">';
    html += '<div style="font-weight:700;color:#0F0F0F;margin-bottom:8px;">\ud83d\udccb ' + (typeof _t === 'function' ? _t('study_mock_rules', 'Reglas del Simulacro') : 'Reglas del Simulacro') + '</div>';
    html += '<ul style="color:#3D3D3A;font-weight:500;font-size:12px;margin:0;padding-left:20px;line-height:1.8;">';
    html += '<li>' + (typeof _t === 'function' ? _t('study_mock_rule_q_mixed', '100 preguntas mezcladas de las 5 secciones') : '100 preguntas mezcladas de las 5 secciones') + '</li>';
    html += '<li>' + (typeof _t === 'function' ? _t('study_mock_rule_time', '90 minutos de tiempo limite') : '90 minutos de tiempo limite') + '</li>';
    html += '<li>' + (typeof _t === 'function' ? _t('study_mock_rule_pass', 'Debes obtener \u226570% en CADA seccion') : 'Debes obtener \u226570% en CADA seccion') + '</li>';
    html += '<li>' + (typeof _t === 'function' ? _t('study_mock_rule_navigate', 'Puedes navegar entre preguntas') : 'Puedes navegar entre preguntas') + '</li>';
    html += '<li>' + (typeof _t === 'function' ? _t('study_mock_rule_results', 'Al terminar veras tu puntaje por seccion') : 'Al terminar veras tu puntaje por seccion') + '</li>';
    html += '</ul></div>';

    html += '<button onclick="_epa608StartSimulacro()" style="width:100%;padding:16px;background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(220,38,38,0.3);">\ud83d\ude80 ' + (typeof _t === 'function' ? _t('study_start_mock', 'Iniciar Simulacro') : 'Iniciar Simulacro') + '</button>';

    if (history.length > 0) {
      html += '<div style="margin-top:20px;text-align:left;">';
      html += '<h3 style="color:#0F0F0F;font-weight:700;font-size:14px;margin-bottom:8px;">\ud83d\udcca ' + (typeof _t === 'function' ? _t('study_history', 'Historial') : 'Historial') + '</h3>';
      history.slice(-5).reverse().forEach(function(h) {
        html += '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:8px;padding:10px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
        html += '<div><div style="font-size:12px;color:#3D3D3A;font-weight:500;">' + new Date(h.fecha).toLocaleDateString() + '</div>';
        html += '<div style="font-size:11px;color:#6B6B66;font-weight:500;">' + h.tiempo + ' min</div></div>';
        html += '<div style="font-size:18px;font-weight:800;color:' + (h.aprobado ? '#059669' : '#DC2626') + ';">' + h.puntaje + '%</div>';
        html += '<div style="font-size:16px;">' + (h.aprobado ? '\u2705' : '\u274c') + '</div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  window._epa608StartSimulacro = function() {
    var allQ = _getByCategory('ALL');
    if (allQ.length < 100) { window.showToast(typeof _t === 'function' ? _t('study_not_enough_q', 'No hay suficientes preguntas.') : 'No hay suficientes preguntas.', 'warning'); return; }
    _simulacroState = {
      questions: _shuffle(allQ).slice(0, 100),
      answers: [],
      currentIndex: 0,
      startTime: Date.now(),
      timerInterval: null,
      timeLimit: 90 * 60,
      finished: false
    };
    for (var i = 0; i < 100; i++) _simulacroState.answers.push(-1);
    _simulacroState.timerInterval = setInterval(function() { _updateSimulacroTimer(); }, 1000);
    _renderTabContent();
  };

  function _updateSimulacroTimer() {
    var elapsed = Math.floor((Date.now() - _simulacroState.startTime) / 1000);
    var remaining = _simulacroState.timeLimit - elapsed;
    if (remaining <= 0) {
      clearInterval(_simulacroState.timerInterval);
      _simulacroState.timerInterval = null;
      _finishSimulacro();
      return;
    }
    var timerEl = document.getElementById('epa608Timer');
    if (timerEl) {
      var mins = Math.floor(remaining / 60);
      var secs = remaining % 60;
      timerEl.textContent = '\u23f1 ' + mins + ':' + (secs < 10 ? '0' : '') + secs;
      timerEl.style.color = remaining < 300 ? '#dc2626' : '#1565C0';
    }
  }

  function _renderSimulacroQuestion(container) {
    var st = _simulacroState;
    var q = st.questions[st.currentIndex];
    var num = st.currentIndex + 1;
    var answered = st.answers.filter(function(a) { return a >= 0; }).length;
    var letters = ['A', 'B', 'C', 'D'];
    var elapsed = Math.floor((Date.now() - st.startTime) / 1000);
    var remaining = st.timeLimit - elapsed;
    var mins = Math.floor(remaining / 60);
    var secs = remaining % 60;

    var html = '';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding:8px 10px;background:#FAFAF7;border:1px solid #E7E5DE;border-radius:10px;">';
    html += '<div id="epa608Timer" style="font-size:18px;font-weight:800;color:' + (remaining < 300 ? '#DC2626' : '#0F0F0F') + ';">\u23f1 ' + mins + ':' + (secs < 10 ? '0' : '') + secs + '</div>';
    html += '<div style="font-size:12px;color:#3D3D3A;font-weight:600;">' + answered + '/100 respondidas</div>';
    html += '<button onclick="_epa608FinishSimulacro()" style="background:#DC2626;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">' + (typeof _t === 'function' ? _t('study_finish', 'Terminar') : 'Terminar') + '</button>';
    html += '</div>';

    html += '<div style="height:4px;background:#E7E5DE;border-radius:2px;margin-bottom:10px;overflow:hidden;"><div style="height:100%;width:' + (num / 100 * 100) + '%;background:linear-gradient(90deg,#DC2626,#991b1b);border-radius:2px;transition:width 0.3s;"></div></div>';

    var catInfo = (window.EPA608_CATEGORIAS || {})[q.categoria] || { nombre: q.categoria, color: '#666' };
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    html += '<span style="font-weight:700;color:#0F0F0F;font-size:14px;">' + (typeof _t === 'function' ? _t('study_question', 'Pregunta') : 'Pregunta') + ' ' + num + ' ' + (typeof _t === 'function' ? _t('study_of', 'de') : 'de') + ' 100</span>';
    html += '<span style="background:' + catInfo.color + '22;color:' + catInfo.color + ';padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;">' + _esc(_catName(catInfo)) + '</span>';
    html += '</div>';
    html += '<div style="font-size:14px;font-weight:600;color:#0F0F0F;margin-bottom:12px;line-height:1.5;">' + _esc(_qf(q,'pregunta')) + '</div>';

    var selected = st.answers[st.currentIndex];
    _qf(q,'opciones').forEach(function(opt, oi) {
      var isSelected = selected === oi;
      var style = 'display:block;width:100%;text-align:left;padding:11px 13px;margin-bottom:5px;border-radius:8px;font-size:13px;cursor:pointer;transition:all 0.15s;font-weight:500;';
      style += isSelected ? 'background:#FFF7ED;border:1px solid #E8591C;color:#0F0F0F;font-weight:700;' : 'background:#FFFFFF;border:1px solid #E7E5DE;color:#0F0F0F;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);';
      html += '<button onclick="_epa608SimulacroAnswer(' + oi + ')" style="' + style + '">' + letters[oi] + ') ' + _esc(opt) + '</button>';
    });

    html += '<div style="display:flex;gap:8px;margin-top:14px;">';
    if (st.currentIndex > 0) html += '<button onclick="_epa608SimulacroNav(-1)" style="flex:1;padding:12px;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">\u2190 Anterior</button>';
    if (st.currentIndex < 99) html += '<button onclick="_epa608SimulacroNav(1)" style="flex:1;padding:12px;background:linear-gradient(135deg,#1565C0,#0D47A1);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">Siguiente \u2192</button>';
    html += '</div>';

    html += '<div style="margin-top:14px;"><div style="font-size:11px;color:#6B6B66;font-weight:500;margin-bottom:6px;">Navegacion rapida:</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
    for (var i = 0; i < 100; i++) {
      var bg = '#FAFAF7', clr = '#6B6B66', bdr = '#E7E5DE';
      if (st.answers[i] >= 0) { bg = '#FFF7ED'; clr = '#E8591C'; bdr = '#FDBA74'; }
      if (i === st.currentIndex) { bg = '#1565C0'; clr = '#fff'; bdr = '#1565C0'; }
      html += '<button onclick="_epa608SimulacroGoTo(' + i + ')" style="width:24px;height:24px;border:1px solid ' + bdr + ';border-radius:4px;font-size:9px;cursor:pointer;background:' + bg + ';color:' + clr + ';font-weight:' + (i === st.currentIndex ? '700' : '600') + ';">' + (i + 1) + '</button>';
    }
    html += '</div></div>';
    container.innerHTML = html;
  }

  window._epa608SimulacroAnswer = function(idx) {
    _simulacroState.answers[_simulacroState.currentIndex] = idx;
    _renderSimulacroQuestion(document.getElementById('epa608Content'));
  };
  window._epa608SimulacroNav = function(dir) {
    _simulacroState.currentIndex = Math.max(0, Math.min(99, _simulacroState.currentIndex + dir));
    _renderSimulacroQuestion(document.getElementById('epa608Content'));
  };
  window._epa608SimulacroGoTo = function(idx) {
    _simulacroState.currentIndex = idx;
    _renderSimulacroQuestion(document.getElementById('epa608Content'));
  };

  window._epa608FinishSimulacro = function() {
    var unanswered = _simulacroState.answers.filter(function(a) { return a < 0; }).length;
    var msg = unanswered > 0 ? (typeof _t === 'function' ? _t('study_finish_mock_unanswered', '\u00bfTerminar el simulacro? Tienes ' + unanswered + ' preguntas sin responder.') : '\u00bfTerminar el simulacro? Tienes ' + unanswered + ' preguntas sin responder.') : (typeof _t === 'function' ? _t('study_finish_mock', '\u00bfTerminar el simulacro?') : '\u00bfTerminar el simulacro?');
    if (!confirm(msg)) return;
    _finishSimulacro();
  };

  function _finishSimulacro() {
    if (_simulacroState.timerInterval) { clearInterval(_simulacroState.timerInterval); _simulacroState.timerInterval = null; }
    _simulacroState.finished = true;
    _renderSimulacroResults(document.getElementById('epa608Content'));
  }

  function _renderSimulacroResults(container) {
    var st = _simulacroState;
    var elapsed = Math.floor((Date.now() - st.startTime) / 1000);
    var tiempoMin = Math.ceil(elapsed / 60);
    var secciones = {};
    var catKeys = ['EPA608_CORE', 'EPA608_TIPO1', 'EPA608_TIPO2', 'EPA608_TIPO3', 'EPA608_UNIVERSAL'];
    catKeys.forEach(function(k) { secciones[k] = { correctas: 0, total: 0 }; });

    var totalCorrectas = 0;
    st.questions.forEach(function(q, i) {
      var cat = q.categoria;
      if (!secciones[cat]) secciones[cat] = { correctas: 0, total: 0 };
      secciones[cat].total++;
      if (st.answers[i] === q.respuesta_correcta) { secciones[cat].correctas++; totalCorrectas++; }
    });

    var pctTotal = Math.round((totalCorrectas / 100) * 100);
    var allPassed = true;
    catKeys.forEach(function(k) {
      var s = secciones[k];
      if (s.total > 0 && (s.correctas / s.total) < 0.70) allPassed = false;
    });

    _saveSimulacroResult({
      fecha: new Date().toISOString(), puntaje: pctTotal, tiempo: tiempoMin, aprobado: allPassed,
      secciones: catKeys.reduce(function(acc, k) { var s = secciones[k]; acc[k] = s.total > 0 ? Math.round((s.correctas / s.total) * 100) : 0; return acc; }, {})
    });

    var cats = window.EPA608_CATEGORIAS || {};
    var html = '<div style="text-align:center;padding:16px 0;">';
    html += '<div style="font-size:56px;margin-bottom:8px;">' + (allPassed ? '\ud83c\udfc6' : '\ud83d\udcda') + '</div>';
    html += '<h2 style="color:#0F0F0F;margin:0 0 4px;font-size:22px;font-weight:800;">' + (allPassed ? (typeof _t === 'function' ? _t('study_passed', '\u00a1APROBASTE!') : '\u00a1APROBASTE!') : (typeof _t === 'function' ? _t('study_failed', 'No Aprobado') : 'No Aprobado')) + '</h2>';
    html += '<p style="color:#3D3D3A;font-weight:500;font-size:13px;margin:0 0 12px;">' + (typeof _t === 'function' ? _t('study_completed_in', 'Completado en') : 'Completado en') + ' ' + tiempoMin + ' ' + (typeof _t === 'function' ? _t('study_minutes', 'minutos') : 'minutos') + '</p>';

    html += '<div style="width:120px;height:120px;border-radius:50%;border:6px solid ' + (allPassed ? '#059669' : '#DC2626') + ';display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">';
    html += '<div><div style="font-size:36px;font-weight:900;color:' + (allPassed ? '#059669' : '#DC2626') + ';">' + pctTotal + '%</div>';
    html += '<div style="font-size:11px;color:#3D3D3A;font-weight:500;">' + totalCorrectas + '/100</div></div></div>';

    html += '<div style="text-align:left;margin-top:16px;">';
    html += '<h3 style="color:#0F0F0F;font-weight:700;font-size:14px;margin-bottom:10px;">' + (typeof _t === 'function' ? _t('study_score_by_section', 'Puntaje por Seccion') : 'Puntaje por Seccion') + ' (minimo 70%)</h3>';
    catKeys.forEach(function(k) {
      var s = secciones[k];
      var catInfo = cats[k] || { nombre: k, icon: '\ud83d\udccb', color: '#666' };
      var pct = s.total > 0 ? Math.round((s.correctas / s.total) * 100) : 0;
      var pass = pct >= 70;
      html += '<div style="background:#FFFFFF;border:1px solid ' + (pass ? '#A7F3D0' : '#FECACA') + ';border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;gap:8px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
      html += '<span style="font-size:20px;">' + catInfo.icon + '</span>';
      html += '<div style="flex:1;"><div style="font-size:12px;font-weight:700;color:#0F0F0F;">' + _esc(_catName(catInfo)) + '</div>';
      html += '<div style="height:4px;background:#E7E5DE;border-radius:2px;margin-top:3px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:' + (pass ? '#059669' : '#DC2626') + ';border-radius:2px;"></div></div></div>';
      html += '<div style="font-size:16px;font-weight:800;color:' + (pass ? '#059669' : '#DC2626') + ';">' + pct + '%</div>';
      html += '<div style="font-size:10px;color:#6B6B66;font-weight:500;">' + s.correctas + '/' + s.total + '</div>';
      html += '<span>' + (pass ? '\u2705' : '\u274c') + '</span></div>';
    });
    html += '</div>';

    html += '<button onclick="_epa608ReviewSimulacro()" style="width:100%;margin-top:14px;padding:14px;background:linear-gradient(135deg,#E8591C,#C2410C);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;">\ud83d\udcd6 ' + (typeof _t === 'function' ? _t('study_review_incorrect', 'Revisar Respuestas Incorrectas') : 'Revisar Respuestas Incorrectas') + '</button>';
    html += '<div style="display:flex;gap:8px;margin-top:8px;">';
    html += '<button onclick="_epa608RetrySimulacro()" style="flex:1;padding:12px;background:linear-gradient(135deg,#DC2626,#991b1b);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">\ud83d\udd04 Reintentar</button>';
    html += '<button onclick="_epa608ExitSimulacro()" style="flex:1;padding:12px;background:#FFFFFF;color:#0F0F0F;border:1px solid #E7E5DE;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">\u2190 Inicio</button>';
    html += '</div></div>';
    container.innerHTML = html;
  }

  window._epa608ReviewSimulacro = function() {
    var container = document.getElementById('epa608Content');
    var st = _simulacroState;
    var letters = ['A', 'B', 'C', 'D'];
    var cats = window.EPA608_CATEGORIAS || {};
    var hasIncorrect = false;

    var html = '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">';
    html += '<h3 style="color:#0F0F0F;margin:0;font-size:16px;font-weight:800;">' + (typeof _t === 'function' ? _t('study_answer_review', 'Revision de Respuestas') : 'Revision de Respuestas') + '</h3>';
    html += '<button onclick="_epa608ShowResults()" style="background:#FFFFFF;border:1px solid #E7E5DE;color:#0F0F0F;font-weight:600;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">\u2190 ' + (typeof _t === 'function' ? _t('study_results', 'Resultados') : 'Resultados') + '</button>';
    html += '</div>';

    st.questions.forEach(function(q, i) {
      var userAns = st.answers[i];
      if (userAns === q.respuesta_correcta) return;
      hasIncorrect = true;
      var catInfo = cats[q.categoria] || { nombre: q.categoria, color: '#666' };
      html += '<div style="background:#FFFFFF;border:1px solid #FECACA;border-radius:10px;padding:12px;margin-bottom:8px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">';
      html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">';
      html += '<span style="font-size:11px;color:#6B6B66;font-weight:600;">#' + (i + 1) + '</span>';
      html += '<span style="background:' + catInfo.color + '22;color:' + catInfo.color + ';padding:1px 6px;border-radius:8px;font-size:9px;font-weight:700;">' + _esc(_catName(catInfo)) + '</span></div>';
      html += '<div style="font-weight:600;color:#0F0F0F;font-size:12px;margin-bottom:6px;">' + _esc(_qf(q,'pregunta')) + '</div>';
      if (userAns >= 0) html += '<div style="padding:4px 8px;background:#FEF2F2;border:1px solid #FECACA;border-radius:4px;font-size:11px;color:#DC2626;font-weight:500;margin-bottom:3px;">' + (typeof _t === 'function' ? _t('study_your_answer', 'Tu respuesta') : 'Tu respuesta') + ': ' + letters[userAns] + ') ' + _esc(_qf(q,'opciones')[userAns]) + ' \u2717</div>';
      else html += '<div style="padding:4px 8px;background:#FEF2F2;border:1px solid #FECACA;border-radius:4px;font-size:11px;color:#DC2626;font-weight:500;margin-bottom:3px;">' + (typeof _t === 'function' ? _t('study_no_answer', 'Sin respuesta') : 'Sin respuesta') + '</div>';
      html += '<div style="padding:4px 8px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:4px;font-size:11px;color:#059669;font-weight:600;">' + (typeof _t === 'function' ? _t('study_correct', 'Correcta') : 'Correcta') + ': ' + letters[q.respuesta_correcta] + ') ' + _esc(_qf(q,'opciones')[q.respuesta_correcta]) + ' \u2713</div>';
      if (_qf(q,'explicacion')) html += '<div style="margin-top:4px;font-size:10px;color:#3D3D3A;font-weight:500;font-style:italic;">\ud83d\udca1 ' + _esc(_qf(q,'explicacion')) + '</div>';
      html += '</div>';
    });

    if (!hasIncorrect) html += '<div style="text-align:center;padding:20px;color:#059669;font-weight:700;font-size:16px;">\ud83c\udf89 ' + (typeof _t === 'function' ? _t('study_all_correct', '\u00a1Todas las respuestas fueron correctas!') : '\u00a1Todas las respuestas fueron correctas!') + '</div>';
    container.innerHTML = html;
  };

  window._epa608ShowResults = function() {
    _renderSimulacroResults(document.getElementById('epa608Content'));
  };

  window._epa608RetrySimulacro = function() {
    _simulacroState = { questions: [], answers: [], currentIndex: 0, startTime: null, timerInterval: null, timeLimit: 90 * 60, finished: false };
    window._epa608StartSimulacro();
  };

  window._epa608ExitSimulacro = function() {
    _simulacroState = { questions: [], answers: [], currentIndex: 0, startTime: null, timerInterval: null, timeLimit: 90 * 60, finished: false };
    _renderTabContent();
  };

})();
