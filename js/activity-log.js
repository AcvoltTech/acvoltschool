    // ========== ACTIVITY LOGGING ==========
    function logActivity(type, detail) {
      const email = localStorage.getItem('tecnico_email');
      if (!email) return;
      const key = 'maestroac_activity_' + email;
      const log = JSON.parse(localStorage.getItem(key) || '[]');
      log.push({
        type: type,
        detail: detail || '',
        timestamp: new Date().toISOString()
      });
      // Keep last 500 entries
      if (log.length > 500) log.splice(0, log.length - 500);
      localStorage.setItem(key, JSON.stringify(log));
    }

    function getActivityLog(email) {
      const key = 'maestroac_activity_' + (email || localStorage.getItem('tecnico_email'));
      return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function _calculateStreak(email) {
      var log = getActivityLog(email);
      if (log.length === 0) return 0;
      // Get unique active dates (UTC to match DB timestamps)
      var dates = {};
      log.forEach(function(entry) {
        var key = new Date(entry.timestamp).toISOString().split('T')[0];
        dates[key] = true;
      });
      // Count consecutive days backwards from today
      var today = new Date();
      var streak = 0;
      for (var i = 0; i < 365; i++) {
        var check = new Date(today);
        check.setDate(check.getDate() - i);
        var key = check.toISOString().split('T')[0];
        if (dates[key]) { streak++; }
        else if (i === 0) { continue; } // Allow today to not have activity yet
        else { break; }
      }
      return streak;
    }

    function _updateStreakBadge() {
      var badge = document.getElementById('streakBadge');
      if (!badge) return;
      var streak = _calculateStreak();
      if (streak > 0) {
        document.getElementById('streakCount').textContent = streak;
        var icon = streak >= 30 ? '💎' : streak >= 14 ? '⭐' : streak >= 7 ? '🔥' : '✨';
        document.getElementById('streakIcon').textContent = icon;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
      // Sync streak to Supabase
      if (typeof window.Gamification !== 'undefined' && window.Gamification.syncStreak) {
        window.Gamification.syncStreak(streak);
      }
      // Record today's visit
      logActivity('app_open', 'dashboard');
    }

    function getActivityStats(email) {
      const log = getActivityLog(email);
      if (log.length === 0) return { totalMinutes: 0, totalSessions: 0, quizzes: 0, questionsAnswered: 0, lastActive: null };

      let sessions = 0;
      let quizzes = 0;
      let questionsAnswered = 0;
      let totalMinutes = 0;
      let lastActive = null;

      // Calculate sessions (group activity within 30 min gaps)
      let lastTime = null;
      log.forEach(entry => {
        const t = new Date(entry.timestamp).getTime();
        if (!lastTime || t - lastTime > 30 * 60 * 1000) {
          sessions++;
        }
        lastTime = t;
        if (entry.type === 'quiz_start') quizzes++;
        if (entry.type === 'answer') questionsAnswered++;
      });

      // Estimate total time: sum gaps between consecutive actions (max 5 min per gap)
      for (let i = 1; i < log.length; i++) {
        const gap = (new Date(log[i].timestamp).getTime() - new Date(log[i-1].timestamp).getTime()) / 60000;
        totalMinutes += Math.min(gap, 5);
      }
      totalMinutes = Math.round(totalMinutes);

      if (log.length > 0) {
        lastActive = log[log.length - 1].timestamp;
      }

      return { totalMinutes, totalSessions: sessions, quizzes, questionsAnswered, lastActive };
    }

    function saveCertificates() {
      localStorage.setItem('tecnico_certificates', JSON.stringify(certificates));
      // Backup to second key - NEVER lose certificates!
      localStorage.setItem('tecnico_certificates_backup', JSON.stringify(certificates));
      // Sync certificates to Supabase
      Promise.all(certificates.map(cert => supabaseSaveCertificate(cert)))
        .catch(function(e) { console.warn('[Certificates] sync error:', e); });
    }
    
    // Save partial quiz progress after each answer
    function saveQuizProgressPartial() {
      // Compute integrity hash to detect tampering
      var _pStr = currentLevel + '_' + currentQuestionIndex + '_' + correctAnswers;
      var _ph = 0;
      for (var _pi = 0; _pi < _pStr.length; _pi++) { _ph = ((_ph << 5) - _ph) + _pStr.charCodeAt(_pi); _ph = _ph & _ph; }

      const partialProgress = {
        level: currentLevel,
        questionIndex: currentQuestionIndex,
        correctAnswers: correctAnswers,
        totalQuestions: currentQuestions.length,
        timestamp: Date.now(),
        _ih: _ph
      };
      localStorage.setItem('tecnico_quiz_partial', JSON.stringify(partialProgress));
    }
    
    // Clear partial progress when quiz ends
    function clearPartialProgress() {
      localStorage.removeItem('tecnico_quiz_partial');
    }

    // Save lastActivity to localStorage
    function saveLastActivity() {
      if (lastActivity) {
        localStorage.setItem('tecnico_lastActivity', JSON.stringify(lastActivity));
      }
    }

    // Load lastActivity from localStorage
    function loadLastActivity() {
      const saved = localStorage.getItem('tecnico_lastActivity');
      if (saved) {
        lastActivity = JSON.parse(saved);
      }
    }

    // Update lastActivity with new activity data
    // type: "lesson" | "quiz"
    // moduleId: level identifier (e.g., "principiante")
    // lessonId: category name for study sections (nullable)
    // quizId: quiz identifier (nullable, same as moduleId for quizzes)
    // routePath: current screen/path
    function updateLastActivity(type, moduleId, lessonId, quizId, routePath) {
      lastActivity = {
        type: type,
        moduleId: moduleId,
        lessonId: lessonId || null,
        quizId: quizId || null,
        routePath: routePath,
        updatedAt: new Date().toISOString()
      };
      saveLastActivity();
    }

    // Save lastQuizState to localStorage
    function saveLastQuizState() {
      if (lastQuizState) {
        localStorage.setItem('tecnico_lastQuizState', JSON.stringify(lastQuizState));
      }
    }

    // Load lastQuizState from localStorage
    function loadLastQuizState() {
      const saved = localStorage.getItem('tecnico_lastQuizState');
      if (saved) {
        lastQuizState = JSON.parse(saved);
      }
      return lastQuizState;
    }

    // Clear lastQuizState (called when quiz is completed)
    function clearLastQuizState() {
      lastQuizState = null;
      localStorage.removeItem('tecnico_lastQuizState');
    }

    // Update lastQuizState with current quiz progress
    // Called when: question view loads, user clicks "Siguiente", user answers a question
    function updateLastQuizState() {
      if (!currentLevel || !currentQuestions || currentQuestions.length === 0) {
        return;
      }

      const currentQuestion = currentQuestions[currentQuestionIndex];
      const levelName = levels.find(l => l.id === currentLevel)?.name || currentLevel;

      // Store question IDs to restore exact order on resume
      const shuffledQuestionIds = currentQuestions.map((q, idx) => {
        // Create a unique identifier for each question based on its content
        return q.q.substring(0, 50);
      });

      // Compute integrity hash so tampering with correctAnswers in localStorage is detectable
      var _stateStr = currentLevel + '_' + currentQuestionIndex + '_' + correctAnswers + '_' + currentQuestions.length;
      var _sh = 0;
      for (var _si = 0; _si < _stateStr.length; _si++) { _sh = ((_sh << 5) - _sh) + _stateStr.charCodeAt(_si); _sh = _sh & _sh; }

      lastQuizState = {
        levelId: levelName,
        levelKey: currentLevel,
        category: currentQuestion ? currentQuestion.category : null,
        questionIndex: currentQuestionIndex,
        totalQuestions: currentQuestions.length,
        routePath: 'quizScreen',
        correctAnswers: correctAnswers,
        shuffledQuestionIds: shuffledQuestionIds,
        startTime: startTime,
        _ih: _sh, // integrity hash
        updatedAt: new Date().toISOString()
      };

      saveLastQuizState();
    }

    // Resume quiz from lastQuizState
    // Returns true if resume was successful, false otherwise
    async function resumeQuizFromState() {
      await loadQuestions();
      const state = loadLastQuizState();
      if (!state || !state.levelKey || !questions[state.levelKey]) {
        return false;
      }

      // Restore the quiz state
      currentLevel = state.levelKey;

      // Restore the exact question order using shuffledQuestionIds
      const levelQuestions = questions[state.levelKey];
      if (state.shuffledQuestionIds && state.shuffledQuestionIds.length > 0) {
        // Reconstruct the shuffled array order, stripping correct/explanation for server-side scoring
        currentQuestions = state.shuffledQuestionIds.map(qId => {
          var orig = levelQuestions.find(q => q.q.substring(0, 50) === qId);
          if (!orig) return undefined;
          var origIdx = levelQuestions.indexOf(orig);
          var copy = Object.assign({}, orig);
          copy._originalIndex = origIdx;
          delete copy.correct;
          delete copy.explanation;
          return copy;
        }).filter(q => q !== undefined);

        // If reconstruction failed, fall back to fresh shuffle
        if (currentQuestions.length !== state.totalQuestions) {
          currentQuestions = shuffleArray(levelQuestions.map(function(q, idx) {
            var copy = Object.assign({}, q);
            copy._originalIndex = idx;
            delete copy.correct;
            delete copy.explanation;
            return copy;
          }));
        }
      } else {
        currentQuestions = shuffleArray(levelQuestions.map(function(q, idx) {
          var copy = Object.assign({}, q);
          copy._originalIndex = idx;
          delete copy.correct;
          delete copy.explanation;
          return copy;
        }));
      }

      currentQuestionIndex = state.questionIndex || 0;
      correctAnswers = state.correctAnswers || 0;
      startTime = state.startTime || Date.now();

      // Integrity check: verify saved state hasn't been tampered with
      if (typeof state._ih === 'number') {
        var _vStr = state.levelKey + '_' + state.questionIndex + '_' + state.correctAnswers + '_' + state.totalQuestions;
        var _vh = 0;
        for (var _vi = 0; _vi < _vStr.length; _vi++) { _vh = ((_vh << 5) - _vh) + _vStr.charCodeAt(_vi); _vh = _vh & _vh; }
        if (_vh !== state._ih) {
          console.warn('[MaestroAC] Quiz state integrity check failed — resetting correctAnswers to 0');
          correctAnswers = 0;
        }
      }

      // Ensure question index is valid
      if (currentQuestionIndex >= currentQuestions.length) {
        currentQuestionIndex = 0;
        correctAnswers = 0;
        startTime = Date.now();
      }

      return true;
    }

    // Check if there's a resumable quiz state
    function hasResumableQuizState() {
      const state = loadLastQuizState();
      return state !== null && state.levelKey && (typeof questionsLoaded !== 'undefined' && questionsLoaded) && (typeof questions !== 'undefined' && questions[state.levelKey]);
    }

