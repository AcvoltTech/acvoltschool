    // ===== STUDENT ACCESS SYSTEM =====
    
    function checkStudentAccess() {
      const params = new URLSearchParams(window.location.search);

      // ====== REFERRAL CODE CAPTURE ======
      const refParam = params.get('ref');
      if (refParam) {
        localStorage.setItem('maestroac_referral_code', refParam);
        localStorage.setItem('maestroac_referral_date', new Date().toISOString());
        console.log('🎁 Referral code captured: ' + refParam);
        const cleanRefUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanRefUrl);
      }
    }
    
    // Run on page load
    checkStudentAccess();

    // Check if a level is locked
    function isLevelLocked(levelId) {
      // Principiante is ALWAYS unlocked for ALL users
      if (levelId === 'principiante') return false;

      // Progression check
      const levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      const currentIndex = levelOrder.indexOf(levelId);
      if (currentIndex <= 0) return false;

      const previousLevel = levelOrder[currentIndex - 1];
      const p = progress[previousLevel];
      if (!p || p.completed === 0) return true;

      const percentage = Math.round((p.score / p.completed) * 100);
      const allCompleted = p.completed >= p.total;
      return !(allCompleted && percentage >= 100);
    }

    function renderLevels() {
      const container = document.getElementById('levelsList');
      container.innerHTML = '';

      levels.forEach(level => {
        const p = progress[level.id];
        const percentage = p.completed > 0 ? Math.round((p.score / p.completed) * 100) : 0;
        const completedPct = Math.round((p.completed / p.total) * 100);
        const locked = isLevelLocked(level.id);

        const card = document.createElement('div');
        card.className = 'level-card' + (locked ? ' locked' : '');

        if (locked) {
          // Needs to complete previous level
          const levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
          const prevIdx = levelOrder.indexOf(level.id) - 1;
          const prevName = prevIdx >= 0 ? levels[prevIdx].name : '';
          const prevProgress = prevIdx >= 0 ? progress[levelOrder[prevIdx]] : null;
          const prevCompleted = prevProgress ? prevProgress.completed : 0;
          const prevTotal = prevProgress ? prevProgress.total : 0;

          card.innerHTML = `
            <div class="level-info">
              <h3>${level.name}</h3>
              <div class="progress-bar"><div class="progress-fill" style="width:0%; background:${level.color}"></div></div>
              <div class="progress-text">🔒 Completa ${prevName} (${prevCompleted}/${prevTotal} con 100%)</div>
            </div>
            <div class="level-icon">${level.icon}</div>
            <div class="level-locked-overlay">
              <span class="level-locked-icon">🔐</span>
            </div>
          `;
          card.onclick = () => showUnlockInstructions(level.name, level.icon, 'progress', prevName, prevCompleted, prevTotal);
        } else {
          card.innerHTML = `
            <div class="level-info">
              <h3>${level.name}</h3>
              <div class="progress-bar"><div class="progress-fill" style="width:${completedPct}%; background:${level.color}"></div></div>
              <div class="progress-text">${p.completed}/${p.total} completadas • ${percentage}% aciertos</div>
            </div>
            <div class="level-icon">${level.icon}</div>
          `;
          card.onclick = () => startQuiz(level.id);
        }
        container.appendChild(card);
      });
    }

    function startQuiz(levelId) {
      // Check if user is on mandatory break
      if (isOnBreak) {
        showBreakScreen();
        return;
      }
      
      // Start study session timer
      if (!startStudySession()) {
        return; // User is on break
      }
      
      // Check-in obligatorio removed — students can start quizzes without check-in
      // Check if there's a resumable quiz state for this level
      const savedState = loadLastQuizState();
      if (savedState && savedState.levelKey === levelId && savedState.questionIndex > 0) {
        // Offer to resume or start fresh
        showResumePrompt(levelId, savedState);
        return;
      }

      // Start fresh quiz
      startFreshQuiz(levelId);
    }

    // Show resume prompt modal
    function showResumePrompt(levelId, savedState) {
      const levelName = levels.find(l => l.id === levelId)?.name || levelId;
      const progressText = `${savedState.questionIndex + 1}/${savedState.totalQuestions}`;

      _showStyledConfirm(
        '📝 Quiz en Progreso',
        _t('lvl_resume_quiz_1','Tienes un quiz en <b>') + levelName + _t('lvl_resume_quiz_2','</b> (pregunta ') + progressText + _t('lvl_resume_quiz_3','). ¿Deseas continuar donde lo dejaste?'),
        'Continuar',
        'Empezar Nuevo',
        function() { resumeQuiz(); }
      );
      // Override cancel to start fresh instead of just closing
      var cancelBtn = document.getElementById('styledConfirmCancel');
      if (cancelBtn) {
        cancelBtn.onclick = function() {
          document.getElementById('styledConfirmOverlay').remove();
          clearLastQuizState();
          startFreshQuiz(levelId);
        };
      }
    }

    // Start a fresh quiz (no resume)
    async function startFreshQuiz(levelId) {
      await loadQuestions();
      currentLevel = levelId;
      let quizPool = [...questions[levelId]];
      // Strip correct/explanation from quiz questions (server-side scoring handles verification)
      currentQuestions = shuffleArray(quizPool.map(function(q, idx) {
        var copy = Object.assign({}, q);
        copy._originalIndex = idx; // track original index for server verification
        delete copy.correct;
        delete copy.explanation;
        return copy;
      }));
      currentQuestionIndex = 0;
      correctAnswers = 0;
      questionStatus = {}; // Reset estado de preguntas
      window._quizAnswerLog = {}; // Reset answer log for review
      _quizAnswerHashes = []; // Reset integrity tracker
      startTime = Date.now();
      // Track quiz opened as lastActivity
      updateLastActivity('quiz', levelId, null, levelId, 'quizScreen');
      logActivity('quiz_start', levelId);
      var _lvlName = levels.find(function(l) { return l.id === levelId; });
      addNotification('quiz', '📝 Quiz iniciado — Nivel ' + (_lvlName ? _lvlName.name : levelId) + ' (' + currentQuestions.length + ' preguntas)', '📝');
      showScreen('quizScreen');
      showQuestion();
    }

    // Resume quiz from saved state
    async function resumeQuiz() {
      if (typeof resumeQuizFromState === 'function' && await resumeQuizFromState()) {
        // Track quiz resumed as lastActivity
        updateLastActivity('quiz', currentLevel, null, currentLevel, 'quizScreen');
        showScreen('quizScreen');
        showQuestion();
      } else {
        // If resume fails, fallback to level selection
        window.showToast(_t('lvl_restore_failed', 'No se pudo restaurar el progreso. Por favor, selecciona un nivel.'));
        showScreen('levelsScreen');
      }
    }

