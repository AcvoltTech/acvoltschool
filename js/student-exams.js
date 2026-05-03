    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

    async function loadStudentExams() {
      const container = document.getElementById('studentExamsList');
      if (!container) return;
      const email = localStorage.getItem('tecnico_email') || '';
      if(!email){ container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('se_no_exams_assigned', 'No tienes exámenes asignados') + '</p>'; return; }
      try {
        const { data, error } = await supabaseClient.from('assigned_exams')
          .select('*').eq('student_email', email).order('created_at', {ascending: false});
        if (error) throw error;
        if (!data || data.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('se_no_exams_assigned', 'No tienes exámenes asignados') + '</p>';
          return;
        }
        let html = '';
        data.forEach(exam => {
          const estadoColors = {pendiente:'#f39c12', completado:'#2ecc71', vencido:'#e74c3c'};
          const color = estadoColors[exam.estado] || '#57574F';
          html += '<div style="padding: 12px; border-bottom: 1px solid #eee; display:flex; justify-content:space-between; align-items:center;">';
          html += '<div><strong>' + _escHtml(exam.titulo || '') + '</strong>';
          if(exam.descripcion) html += '<br><span style="font-size:0.8em;color:#888;">' + _escHtml(exam.descripcion) + '</span>';
          if(exam.calificacion !== null && exam.calificacion !== undefined && exam.estado === 'completado') html += '<br><span style="font-size:0.9em;color:#16a34a;font-weight:bold;">' + _tc('se_grade', 'Calificación') + ': ' + _escHtml(String(exam.calificacion)) + '/100</span>';
          html += '</div>';
          html += '<span style="padding:3px 10px;background:' + color + ';color:#fff;border-radius:12px;font-size:0.75em;font-weight:bold;">' + _escHtml(String(exam.estado || '').toUpperCase()) + '</span>';
          html += '</div>';
        });
        container.innerHTML = html;
        checkNewContent('assigned_exams', data, function(item) {
          return { type: 'examen', message: '📝 ' + _tc('se_new_exam_assigned', 'Nuevo examen asignado') + ': ' + (item.titulo || _tc('se_exam', 'Examen')), icon: '📝' };
        });
      } catch(e) {
        console.warn('[StudentExams] loadStudentExams failed:', e && e.message || e);
        container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('se_no_exams_assigned', 'No tienes exámenes asignados') + '</p>';
      }
    }

    async function loadStudentExamResults() {
      var container = document.getElementById('studentExamResults');
      if (!container) return;
      var email = localStorage.getItem('tecnico_email') || '';
      if (!email) { container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_exam_results', 'No hay resultados de exámenes') + '</p>'; return; }
      try {
        var attRes = await supabaseClient.from('zm_exam_attempts').select('*').eq('student_email', email).eq('status', 'completed').order('completed_at', { ascending: false });
        if (attRes.error) throw attRes.error;
        var attempts = attRes.data || [];
        if (attempts.length === 0) { container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_completed_exams', 'No has completado exámenes aún') + '</p>'; return; }
        // Fetch exam titles (uses IDs from attempts)
        var examIds = [...new Set(attempts.map(function(a) { return a.exam_id; }))];
        var exRes = await supabaseClient.from('zm_exams').select('id, title').in('id', examIds);
        var exams = exRes.data || [];
        var examMap = {};
        exams.forEach(function(e) { examMap[e.id] = e.title; });
        var html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.9em;">';
        html += '<thead><tr style="border-bottom:2px solid #E7E5DE;text-align:left;">';
        html += '<th style="padding:8px 6px;color:#3D3D3A;">' + _tc('se_exam', 'Examen') + '</th>';
        html += '<th style="padding:8px 6px;color:#3D3D3A;">' + _tc('se_grade_header', 'Calificación') + '</th>';
        html += '<th style="padding:8px 6px;color:#3D3D3A;">' + _tc('se_correct', 'Correctas') + '</th>';
        html += '<th style="padding:8px 6px;color:#3D3D3A;">' + _tc('se_time', 'Tiempo') + '</th>';
        html += '<th style="padding:8px 6px;color:#3D3D3A;">' + _tc('se_date', 'Fecha') + '</th>';
        html += '</tr></thead><tbody>';
        attempts.forEach(function(a) {
          var _pctRaw = parseFloat(a.percentage);
          var pct = isFinite(_pctRaw) ? _pctRaw : 0;
          var scoreColor = pct >= 80 ? '#16a34a' : pct >= 70 ? '#d97706' : '#dc2626';
          var title = examMap[a.exam_id] || 'Examen';
          var mins = Math.floor((a.time_taken || 0) / 60);
          var secs = (a.time_taken || 0) % 60;
          var timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;
          var dateStr = a.completed_at ? new Date(a.completed_at).toLocaleDateString('es-MX') : '-';
          html += '<tr style="border-bottom:1px solid #E7E5DE;">';
          html += '<td style="padding:8px 6px;">' + _escHtml(title) + '</td>';
          html += '<td style="padding:8px 6px;font-weight:bold;color:' + scoreColor + ';">' + pct.toFixed(0) + '%</td>';
          html += '<td style="padding:8px 6px;">' + (a.correct_answers || 0) + '/' + (a.total_questions || 0) + '</td>';
          html += '<td style="padding:8px 6px;">' + timeStr + '</td>';
          html += '<td style="padding:8px 6px;color:#57574F;font-size:0.85em;">' + dateStr + '</td>';
          html += '</tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
      } catch(e) {
        console.error('[MaestroAC] Error loading exam results:', e);
        container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_exam_results', 'No hay resultados de exámenes') + '</p>';
      }
    }

    async function loadStudentPerfEvals() {
      var container = document.getElementById('studentPerfEvals');
      if (!container) return;
      var email = localStorage.getItem('tecnico_email') || '';
      if (!email) { container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_perf_evals', 'No hay evaluaciones de desempeño') + '</p>'; return; }
      try {
        var grRes = await supabaseClient.from('zm_perf_grades').select('*').eq('student_email', email).not('score', 'is', null).order('graded_at', { ascending: false });
        if (grRes.error) throw grRes.error;
        var grades = grRes.data || [];
        if (grades.length === 0) { container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_perf_evals_yet', 'No tienes evaluaciones de desempeño aún') + '</p>'; return; }
        // Fetch session info for area/title (depends on grade IDs)
        var sessionIds = [...new Set(grades.map(function(g) { return g.session_id; }))];
        var sesRes = await supabaseClient.from('zm_perf_sessions').select('id, area, title').in('id', sessionIds);
        var sessions = sesRes.data || [];
        var sesMap = {};
        sessions.forEach(function(s) { sesMap[s.id] = s; });
        var html = '';
        grades.forEach(function(g) {
          var _gsRaw = parseFloat(g.score);
          var score = isFinite(_gsRaw) ? _gsRaw : 0;
          var scoreColor = score >= 80 ? '#16a34a' : score >= 70 ? '#d97706' : '#dc2626';
          var scoreBg = score >= 80 ? '#f0fdf4' : score >= 70 ? '#fffbeb' : '#fef2f2';
          var ses = sesMap[g.session_id] || {};
          var area = ses.area || 'General';
          var title = ses.title || '';
          var dateStr = g.graded_at ? new Date(g.graded_at).toLocaleDateString('es-MX') : '-';
          html += '<div style="padding:12px;border-bottom:1px solid #E7E5DE;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">';
          html += '<div>';
          html += '<strong style="color:#f0f4fa;">' + _escHtml(area) + '</strong>';
          if (title) html += '<br><span style="font-size:0.8em;color:#888;">' + _escHtml(title) + '</span>';
          html += '<br><span style="font-size:0.8em;color:#57574F;">' + dateStr + '</span>';
          if (g.notes) html += '<br><span style="font-size:0.8em;color:#3D3D3A;font-style:italic;">' + _escHtml(g.notes) + '</span>';
          html += '</div>';
          html += '<div style="background:' + scoreBg + ';color:' + scoreColor + ';padding:6px 14px;border-radius:12px;font-weight:bold;font-size:1.1em;min-width:60px;text-align:center;">' + score.toFixed(0) + '</div>';
          html += '</div>';
        });
        container.innerHTML = html;
      } catch(e) {
        console.error('[MaestroAC] Error loading perf evals:', e);
        container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_perf_evals', 'No hay evaluaciones de desempeño') + '</p>';
      }
    }

    // ===== STUDENT EXAMS & PERFORMANCE SCREEN =====
    async function loadStudentExamsScreen() {
      var email = localStorage.getItem('tecnico_email') || '';
      var examsContainer = document.getElementById('studentExamsListScreen');
      var historyContainer = document.getElementById('studentExamHistory');

      // Load published exams from zm_exams + check attempts
      if (examsContainer) {
        if (!email) {
          examsContainer.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_login_to_see_exams', 'Inicia sesión para ver tus exámenes') + '</p>';
        } else {
          try {
            // Fetch published exams + student attempts in parallel
            var [examsRes, attRes] = await Promise.all([
              supabaseClient.from('zm_exams').select('*').eq('status', 'published').order('published_at', { ascending: false }),
              supabaseClient.from('zm_exam_attempts').select('*').eq('student_email', email)
            ]);
            if (examsRes.error) throw examsRes.error;
            var exams = examsRes.data || [];
            var attempts = attRes.data || [];
            var attemptMap = {};
            attempts.forEach(function(a) { attemptMap[a.exam_id] = a; });

            // Filter by target_groups — admin sees ALL exams, students filtered by group
            var isAdmin = (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) || (typeof isAdminStudent === 'function' && isAdminStudent());
            if (!isAdmin) {
              var studentGroups = [];
              try {
                var sgRes = await supabaseClient.from('zoom_recordings').select('data').eq('id', 'student_groups').single();
                if (sgRes.data && sgRes.data.data) {
                  var allGroups = JSON.parse(sgRes.data.data);
                  var lowerEmail = email.toLowerCase();
                  var studentEntry = allGroups.find(function(s) { return (s.email || '').toLowerCase() === lowerEmail; });
                  studentGroups = studentEntry ? (studentEntry.groups || []) : [];
                }
              } catch(sgErr) { console.log('Could not fetch student groups:', sgErr); }
              exams = exams.filter(function(exam) {
                if (!exam.target_groups || exam.target_groups.length === 0) return true;
                return exam.target_groups.some(function(g) { return studentGroups.indexOf(g) !== -1; });
              });
            }

            if (exams.length === 0) {
              examsContainer.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_exams_available', 'No hay exámenes disponibles en este momento') + '</p>';
            } else {
              var html = '';
              var completed = 0, totalScore = 0, bestScore = 0;
              exams.forEach(function(exam) {
                var qCount = (exam.questions && Array.isArray(exam.questions)) ? exam.questions.length : 0;
                var attempt = attemptMap[exam.id];
                var isCompleted = attempt && attempt.status === 'completed';

                html += '<div style="padding:14px;border:1px solid #E7E5DE;border-radius:12px;margin-bottom:10px;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">';
                html += '<div style="flex:1;"><div style="font-weight:700;color:#f0f4fa;font-size:14px;">' + (isCompleted ? '✅' : '📝') + ' ' + _escHtml(exam.title || 'Examen') + '</div>';
                if (exam.description) html += '<div style="font-size:12px;color:#3D3D3A;margin-top:2px;">' + _escHtml(exam.description) + '</div>';
                html += '<div style="font-size:11px;color:#57574F;margin-top:4px;">❓ ' + qCount + ' ' + _tc('se_questions', 'preguntas') + ' · ⏱️ ' + (exam.time_limit || 30) + ' min · ✅ ' + (exam.passing_score || 70) + '% ' + _tc('se_to_pass', 'para aprobar') + '</div>';

                if (isCompleted) {
                  var pct = attempt.percentage || attempt.score || 0;
                  completed++;
                  totalScore += pct;
                  if (pct > bestScore) bestScore = pct;
                  var passed = pct >= (exam.passing_score || 70);
                  var scoreColor = passed ? '#16a34a' : '#dc2626';
                  html += '<div style="margin-top:8px;display:flex;align-items:center;gap:8px;">';
                  html += '<span style="font-size:18px;font-weight:800;color:' + scoreColor + ';">' + pct + '%</span>';
                  html += '<span style="padding:3px 10px;background:' + (passed ? '#f0fdf4' : '#fef2f2') + ';color:' + scoreColor + ';border-radius:8px;font-size:11px;font-weight:700;">' + (passed ? _tc('se_passed', 'APROBADO') : _tc('se_not_passed', 'NO APROBADO')) + '</span>';
                  html += '<span style="font-size:11px;color:#57574F;">· ' + (attempt.correct_answers || 0) + '/' + (attempt.total_questions || qCount) + ' ' + _tc('se_correct_answers', 'correctas') + '</span>';
                  html += '</div>';
                }

                html += '</div>';

                if (isCompleted) {
                  var _pct = attempt.percentage || attempt.score || 0;
                  var _passed = _pct >= (exam.passing_score || 70);
                  html += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">';
                  html += '<span style="padding:4px 12px;background:' + (_passed ? '#f0fdf4' : '#fef2f2') + ';color:' + (_passed ? '#16a34a' : '#dc2626') + ';border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;">' + (_passed ? '✅ ' + _tc('se_passed', 'APROBADO') : '❌ ' + _tc('se_not_passed', 'NO APROBADO')) + '</span>';
                  if (!_passed) {
                    html += '<button onclick="startStudentExam(\'' + exam.id + '\')" style="padding:6px 12px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">🔄 ' + _tc('se_retry', 'Reintentar') + '</button>';
                  }
                  html += '</div>';
                } else {
                  html += '<button onclick="startStudentExam(\'' + exam.id + '\')" style="padding:8px 16px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(59,130,246,0.3);">' + _tc('se_start_exam', 'Iniciar Examen') + '</button>';
                }

                html += '</div></div>';
              });
              examsContainer.innerHTML = html;
              checkNewContent('published_exams', exams, function(item) {
                return { type: 'examen', message: '📝 ' + _tc('se_new_exam_available', 'Nuevo examen disponible') + ': ' + (item.title || _tc('se_exam', 'Examen')), icon: '📝' };
              });

              // Update stats
              var el1 = document.getElementById('spExamsCompleted');
              var el2 = document.getElementById('spAvgScore');
              var el3 = document.getElementById('spBestScore');
              if (el1) el1.textContent = completed;
              if (el2) el2.textContent = completed > 0 ? Math.round(totalScore / completed) + '%' : '0%';
              if (el3) el3.textContent = bestScore > 0 ? bestScore + '%' : '0%';
            }
          } catch(e) {
            console.warn('[MaestroAC] Error loading student exams:', e);
            examsContainer.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_error_loading', 'Error cargando exámenes') + '</p>';
          }
        }
      }

      // Load exam history from quiz results
      if (historyContainer) {
        if (!email) {
          historyContainer.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_login_for_history', 'Inicia sesión para ver tu historial') + '</p>';
        } else {
          try {
            var histRes = await supabaseClient.from('quiz_results')
              .select('*').eq('email', email).order('created_at', {ascending: false}).limit(20);
            if (histRes.error) throw histRes.error;
            var histData = histRes.data || [];
            if (histData.length === 0) {
              historyContainer.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_history_yet', 'Aún no tienes resultados de exámenes') + '</p>';
            } else {
              var html = '';
              histData.forEach(function(r) {
                var pct = r.score || r.percentage || 0;
                var color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#f39c12' : '#e74c3c';
                var fecha = r.created_at ? new Date(r.created_at).toLocaleDateString('es-MX') : '';
                html += '<div style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;">';
                html += '<div><span style="font-weight:600;color:#d0d8e8;">' + _escHtml(r.nivel || r.level || 'Quiz') + '</span>';
                if (fecha) html += ' <span style="font-size:11px;color:#57574F;">· ' + fecha + '</span>';
                html += '</div>';
                html += '<span style="font-weight:800;color:' + color + ';">' + pct + '%</span>';
                html += '</div>';
              });
              historyContainer.innerHTML = html;
            }
          } catch(e) {
            historyContainer.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('se_no_history_available', 'Sin historial disponible aún') + '</p>';
          }
        }
      }

      // Load exam results and perf evals on this screen
      try { loadStudentExamResults(); } catch(e) { console.warn('[StudentExams]', e.message || e); }
      try { loadStudentPerfEvals(); } catch(e) { console.warn('[StudentExams]', e.message || e); }
    }

    // ===== EXAM-TAKING FLOW =====
    var _examState = null;

    async function startStudentExam(examId) {
      var email = localStorage.getItem('tecnico_email') || '';
      var userName = '';
      try {
        var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        userName = u.nombre || u.name || email;
      } catch(e) { userName = email; }

      if (!email) { window.MaestroDialog.alert({title: 'Atención', message: _tc('se_login_for_exams', 'Inicia sesión para presentar exámenes.'), kind: 'warning'}); return; }

      try {
        // Fetch exam + check attempts in parallel
        var [examRes, attRes] = await Promise.all([
          supabaseClient.from('zm_exams').select('*').eq('id', examId).single(),
          supabaseClient.from('zm_exam_attempts').select('id,status').eq('exam_id', examId).eq('student_email', email)
        ]);
        if (examRes.error) throw examRes.error;
        var exam = examRes.data;
        if (!exam || exam.status !== 'published') { window.MaestroDialog.alert({title: 'Atención', message: _tc('se_exam_not_available', 'Este examen ya no está disponible.'), kind: 'warning'}); return; }

        // Group-based access check (admins bypass)
        var targetGroups = exam.target_groups || [];
        var _isAdmin = (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) || (typeof isAdminStudent === 'function' && isAdminStudent());
        if (targetGroups.length > 0 && !_isAdmin) {
          var studentGroups = [];
          if (typeof getStudentGroupsForEmail === 'function') {
            studentGroups = getStudentGroupsForEmail(email);
          } else {
            // Fallback: fetch student groups from Supabase (zoom-recordings.js not loaded for non-admin)
            try {
              var sgRes = await supabaseClient.from('zoom_recordings').select('data').eq('id', 'student_groups').maybeSingle();
              if (sgRes.data && sgRes.data.data) {
                var allGroups = JSON.parse(sgRes.data.data);
                var lowerEmail = email.toLowerCase();
                var found = allGroups.find(function(s) { return s.email && s.email.toLowerCase() === lowerEmail; });
                studentGroups = found ? (found.groups || []) : [];
              }
            } catch(e) { console.warn('Could not fetch student groups:', e); }
          }
          var hasAccess = targetGroups.some(function(g) { return studentGroups.indexOf(g) !== -1; });
          if (!hasAccess) { window.MaestroDialog.alert({title: 'Atención', message: _tc('se_no_access', 'No tienes acceso a este examen.'), kind: 'warning'}); return; }
        }

        // Clean up any in_progress attempts so student can start fresh
        var existingInProgress = (attRes.data || []).filter(function(a) { return a.status === 'in_progress'; });
        for (var ip = 0; ip < existingInProgress.length; ip++) {
          try { await supabaseClient.from('zm_exam_attempts').delete().eq('id', existingInProgress[ip].id); } catch(e) { console.warn('[StudentExams]', e.message || e); }
        }

        // Show rules acceptance screen before starting
        _showExamRulesScreen(examId, exam, email, userName);
      } catch(e) {
        console.error('[MaestroAC] Error starting exam:', e);
        window.MaestroDialog.alert({title: 'Error', message: _tc('se_error_starting_exam', 'Error al iniciar examen') + ': ' + e.message, kind: 'error'});
      }
    }

    function _showExamRulesScreen(examId, exam, email, userName) {
      var old = document.getElementById('examRulesOverlay');
      if (old) old.remove();

      var overlay = document.createElement('div');
      overlay.id = 'examRulesOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#FAFAF7;z-index:10001;overflow-y:auto;color:#0F0F0F;font-family:"Plus Jakarta Sans",sans-serif;';

      overlay.innerHTML =
        '<div style="max-width:520px;margin:0 auto;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;">' +
          '<div style="font-size:48px;margin-bottom:12px;">📋</div>' +
          '<h2 style="color:#0F0F0F;margin:0 0 4px 0;font-size:20px;text-align:center;">' + _tc('se_exam_rules', 'Reglas del Examen') + '</h2>' +
          '<p style="color:#6B6B66;font-size:13px;font-weight:500;margin:0 0 20px 0;text-align:center;">' + _escHtml(exam.title || 'Examen') + '</p>' +
          '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:14px;padding:20px;width:100%;box-sizing:border-box;margin-bottom:20px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
            '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">' +
              '<span style="background:#DC2626;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">1</span>' +
              '<span style="font-size:13px;color:#3D3D3A;line-height:1.5;">' + _tc('se_rule_1', 'No puedes salir de la pantalla del examen ni cambiar de pestaña.') + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">' +
              '<span style="background:#DC2626;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">2</span>' +
              '<span style="font-size:13px;color:#3D3D3A;line-height:1.5;">' + _tc('se_rule_2', 'Si sales o cambias de pestaña, se registra como') + ' <b style="color:#E8591C;">' + _tc('se_rule_2_penalty', 'penalizacion de -2%') + '</b> ' + _tc('se_rule_2_per_exit', 'por cada salida.') + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">' +
              '<span style="background:#3b82f6;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">3</span>' +
              '<span style="font-size:13px;color:#3D3D3A;line-height:1.5;">' + _tc('se_rule_3_pre', 'Puedes cambiar tu respuesta') + ' <b>' + _tc('se_rule_3_before', 'antes') + '</b> ' + _tc('se_rule_3_post', 'de confirmarla.') + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">' +
              '<span style="background:#3b82f6;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">4</span>' +
              '<span style="font-size:13px;color:#3D3D3A;line-height:1.5;">' + _tc('se_rule_4', 'No puedes regresar a preguntas anteriores una vez confirmadas.') + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:flex-start;gap:10px;">' +
              '<span style="background:#E8591C;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">5</span>' +
              '<span style="font-size:13px;color:#3D3D3A;line-height:1.5;">' + _tc('se_rule_5', 'El examen tiene tiempo limite — al agotarse, se envia automaticamente.') + '</span>' +
            '</div>' +
          '</div>' +
          '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:16px;padding:12px 16px;background:#FFFFFF;border:1px solid #E7E5DE;border-radius:10px;width:100%;box-sizing:border-box;">' +
            '<input type="checkbox" id="examRulesAcceptCb" onchange="document.getElementById(\'examRulesStartBtn\').disabled=!this.checked;document.getElementById(\'examRulesStartBtn\').style.opacity=this.checked?\'1\':\'0.4\';" style="width:18px;height:18px;cursor:pointer;">' +
            '<span style="font-size:13px;color:#0F0F0F;font-weight:600;">' + _tc('se_accept_rules', 'He leido y acepto las reglas del examen') + '</span>' +
          '</label>' +
          '<button id="examRulesStartBtn" disabled onclick="_beginExamAfterAccept()" style="padding:14px 40px;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(22,163,74,0.3);opacity:0.4;width:100%;">' + _tc('se_start_exam', 'Iniciar Examen') + '</button>' +
          '<button onclick="document.getElementById(\'examRulesOverlay\').remove()" style="margin-top:10px;padding:10px 24px;background:transparent;color:#6B6B66;border:1px solid #E7E5DE;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;">' + _tc('se_cancel', 'Cancelar') + '</button>' +
        '</div>';

      // Store params for _beginExamAfterAccept
      overlay._examParams = { examId: examId, exam: exam, email: email, userName: userName };
      document.body.appendChild(overlay);
    }

    async function _beginExamAfterAccept() {
      var overlay = document.getElementById('examRulesOverlay');
      if (!overlay || !overlay._examParams) return;
      var p = overlay._examParams;
      overlay.remove();

      try {
        // Prepare questions — tag each with its original index, then shuffle
        var rawQuestions = (p.exam.questions || []).slice();
        if (rawQuestions.length === 0) { _toast('Este examen no tiene preguntas disponibles.', 'error'); return; }
        // Validate individual question structure
        rawQuestions = rawQuestions.filter(function(q) {
          return q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2;
        });
        if (rawQuestions.length === 0) { _toast(_tc('se_no_valid_questions', 'Este examen no tiene preguntas válidas.'), 'error'); return; }
        for (var qi = 0; qi < rawQuestions.length; qi++) {
          rawQuestions[qi]._originalExamIndex = qi;
        }
        // Shuffle question order
        for (var i = rawQuestions.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = rawQuestions[i]; rawQuestions[i] = rawQuestions[j]; rawQuestions[j] = tmp;
        }
        // Strip correct/explanation from questions for client (server-side scoring)
        var questions = rawQuestions.map(function(q) {
          var copy = Object.assign({}, q);
          copy.options = (q.options || []).slice(); // shallow copy options array
          delete copy.correct;
          delete copy.explanation;
          return copy;
        });

        // Create in_progress attempt
        var attemptRes = await supabaseClient.from('zm_exam_attempts').insert([{
          exam_id: p.examId,
          exam_title: p.exam.title || 'Examen',
          student_email: p.email,
          student_name: p.userName,
          status: 'in_progress',
          total_questions: questions.length,
          correct_answers: 0,
          score: 0,
          percentage: 0,
          answers: [],
          time_taken: 0,
          tab_violations: 0,
          violations: [],
          penalty_applied: 0
        }]).select();
        if (attemptRes.error) throw attemptRes.error;
        var attemptId = attemptRes.data && attemptRes.data[0] ? attemptRes.data[0].id : null;

        _examState = {
          examId: p.examId,
          attemptId: attemptId,
          examData: p.exam,
          questions: questions,
          currentIndex: 0,
          answers: [],
          correctCount: 0,
          startTime: Date.now(),
          timeLimit: (p.exam.time_limit || 30) * 60, // seconds
          timerId: null,
          answered: false, // whether current question has been answered
          pendingAnswer: null, // selected but not confirmed answer
          tabViolations: 0,
          violations: [],
          _visibilityHandler: null
        };

        _showExamOverlay();
        _startExamTimer();
        _startAntiCheatMonitor();
        showExamQuestion();
      } catch(e) {
        console.error('[MaestroAC] Error starting exam:', e);
        window.MaestroDialog.alert({title: 'Error', message: _tc('se_error_starting_exam', 'Error al iniciar examen') + ': ' + e.message, kind: 'error'});
      }
    }

    function _showExamOverlay() {
      var old = document.getElementById('examTakingOverlay');
      if (old) old.remove();

      var overlay = document.createElement('div');
      overlay.id = 'examTakingOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#FAFAF7;z-index:10001;overflow-y:auto;color:#0F0F0F;font-family:"Plus Jakarta Sans",sans-serif;';

      // Build question tracker dots
      var trackerHtml = '<div id="examTrackerBar" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;">';
      for (var t = 0; t < _examState.questions.length; t++) {
        trackerHtml += '<div id="examDot' + t + '" style="width:12px;height:12px;border-radius:50%;border:2px solid #E7E5DE;background:transparent;transition:all 0.3s;' + (t === 0 ? 'border-color:#3b82f6;background:#3b82f6;' : '') + '"></div>';
      }
      trackerHtml += '</div>';

      overlay.innerHTML =
        '<div id="examAntiCheatBanner" style="display:none;position:fixed;top:0;left:0;right:0;z-index:10002;padding:10px 16px;background:#DC2626;color:#fff;text-align:center;font-size:13px;font-weight:700;"></div>' +
        '<div style="max-width:600px;margin:0 auto;padding:16px;">' +
          '<div id="examHeader" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<div>' +
              '<div style="font-weight:700;font-size:14px;color:#0F0F0F;" id="examOverlayTitle">' + _escHtml(_examState.examData.title || 'Examen') + '</div>' +
              '<div style="font-size:11px;color:#6B6B66;font-weight:500;" id="examOverlayProgress">' + _tc('se_question', 'Pregunta') + ' 1 ' + _tc('se_of', 'de') + ' ' + _examState.questions.length + '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              '<div id="examViolationBadge" style="display:none;background:#FEE2E2;border:1px solid #DC2626;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;color:#991B1B;">0</div>' +
              '<div id="examTimerDisplay" style="background:#FFFFFF;border:1px solid #E7E5DE;padding:6px 14px;border-radius:10px;font-size:14px;font-weight:700;color:#E8591C;font-variant-numeric:tabular-nums;">00:00</div>' +
            '</div>' +
          '</div>' +
          trackerHtml +
          '<div id="examProgressBar" style="width:100%;height:4px;background:#E7E5DE;border-radius:2px;margin-bottom:20px;overflow:hidden;">' +
            '<div id="examProgressFill" style="width:0%;height:100%;background:linear-gradient(90deg,#3b82f6,#8b5cf6);transition:width 0.3s;border-radius:2px;"></div>' +
          '</div>' +
          '<div id="examQuestionArea"></div>' +
          '<div id="examFeedback" style="display:none;padding:14px;border-radius:12px;margin-top:12px;"></div>' +
          '<div style="display:flex;justify-content:center;gap:10px;margin-top:16px;">' +
            '<button id="examConfirmBtn" onclick="confirmExamAnswer()" style="display:none;padding:12px 32px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.3);">' + _tc('se_confirm_answer', 'Confirmar Respuesta') + '</button>' +
            '<button id="examNextBtn" onclick="nextExamQuestion()" style="display:none;padding:12px 32px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(59,130,246,0.3);">' + _tc('next', 'Siguiente') + '</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);
    }

    function _startAntiCheatMonitor() {
      if (!_examState) return;
      var handler = function() {
        if (!_examState || !document.hidden) return;
        _examState.tabViolations++;
        _examState.violations.push({ timestamp: new Date().toISOString(), count: _examState.tabViolations });
        // Show red banner
        var banner = document.getElementById('examAntiCheatBanner');
        if (banner) {
          banner.textContent = '⚠️ ' + _tc('se_left_screen', 'Saliste de la pantalla. Penalizacion') + ' #' + _examState.tabViolations + ' ' + _tc('se_recorded', 'registrada.');
          banner.style.display = 'block';
          setTimeout(function() { if (banner) banner.style.display = 'none'; }, 4000);
        }
        // Update violation badge
        var badge = document.getElementById('examViolationBadge');
        if (badge) {
          badge.style.display = 'inline-block';
          badge.textContent = '⚠️ ' + _examState.tabViolations;
        }
      };
      _examState._visibilityHandler = handler;
      document.addEventListener('visibilitychange', handler);
    }

    function _stopAntiCheatMonitor() {
      if (_examState && _examState._visibilityHandler) {
        document.removeEventListener('visibilitychange', _examState._visibilityHandler);
        _examState._visibilityHandler = null;
      }
    }

    function _updateExamTracker() {
      if (!_examState) return;
      for (var i = 0; i < _examState.questions.length; i++) {
        var dot = document.getElementById('examDot' + i);
        if (!dot) continue;
        if (i === _examState.currentIndex) {
          dot.style.borderColor = '#3b82f6';
          dot.style.background = '#3b82f6';
        } else if (i < _examState.currentIndex) {
          dot.style.borderColor = '#16a34a';
          dot.style.background = '#16a34a';
        } else {
          dot.style.borderColor = '#E7E5DE';
          dot.style.background = 'transparent';
        }
      }
    }

    function _startExamTimer() {
      if (!_examState) return;
      _updateExamTimerDisplay();
      _examState.timerId = setInterval(function() {
        if (!_examState) return;
        var elapsed = Math.floor((Date.now() - _examState.startTime) / 1000);
        var remaining = _examState.timeLimit - elapsed;
        if (remaining <= 0) {
          finishExam();
          return;
        }
        _updateExamTimerDisplay();
      }, 1000);
    }

    function _updateExamTimerDisplay() {
      if (!_examState) return;
      var el = document.getElementById('examTimerDisplay');
      if (!el) return;
      var elapsed = Math.floor((Date.now() - _examState.startTime) / 1000);
      var remaining = Math.max(0, _examState.timeLimit - elapsed);
      var min = Math.floor(remaining / 60);
      var sec = remaining % 60;
      el.textContent = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
      if (remaining < 60) {
        el.style.color = '#DC2626';
        el.style.animation = 'none'; // reset
        el.offsetHeight; // trigger reflow
      } else if (remaining < 300) {
        el.style.color = '#D97706';
      } else {
        el.style.color = '#E8591C';
      }
    }

    function showExamQuestion() {
      if (!_examState) return;
      var q = _examState.questions[_examState.currentIndex];
      var area = document.getElementById('examQuestionArea');
      var progressEl = document.getElementById('examOverlayProgress');
      var progressFill = document.getElementById('examProgressFill');
      var feedbackEl = document.getElementById('examFeedback');
      var nextBtn = document.getElementById('examNextBtn');
      var confirmBtn = document.getElementById('examConfirmBtn');
      if (!area) return;

      _examState.answered = false;
      _examState.pendingAnswer = null;
      if (feedbackEl) { feedbackEl.style.display = 'none'; feedbackEl.innerHTML = ''; }
      if (nextBtn) nextBtn.style.display = 'none';
      if (confirmBtn) confirmBtn.style.display = 'none';
      if (progressEl) progressEl.textContent = _tc('se_question', 'Pregunta') + ' ' + (_examState.currentIndex + 1) + ' ' + _tc('se_of', 'de') + ' ' + _examState.questions.length;
      if (progressFill) progressFill.style.width = ((_examState.currentIndex / _examState.questions.length) * 100) + '%';
      _updateExamTracker();

      // Shuffle options
      var indices = [];
      var opts = q.options || [];
      for (var i = 0; i < opts.length; i++) indices.push(i);
      for (var i2 = indices.length - 1; i2 > 0; i2--) {
        var j2 = Math.floor(Math.random() * (i2 + 1));
        var t = indices[i2]; indices[i2] = indices[j2]; indices[j2] = t;
      }
      q._shuffledIndices = indices;

      var letters = ['A', 'B', 'C', 'D'];
      var html = '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:14px;padding:20px;margin-bottom:12px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
        '<div style="font-size:15px;color:#0F0F0F;line-height:1.6;font-weight:500;">' + _escHtml(q.question || '') + '</div>' +
        (q.image_url ? '<div style="margin-top:12px;text-align:center;"><img src="' + _escHtml(q.image_url) + '" style="max-width:100%;max-height:300px;border-radius:10px;border:1px solid #E7E5DE;" onerror="this.parentElement.style.display=\'none\'"></div>' : '') +
        (q.category ? '<div style="margin-top:8px;"><span style="background:#FAFAF7;color:#6B6B66;padding:2px 10px;border-radius:6px;font-size:10px;font-weight:600;">' + _escHtml(q.category) + '</span></div>' : '') +
      '</div>';

      html += '<div id="examOptionsContainer">';
      indices.forEach(function(origIdx, displayIdx) {
        html += '<div class="exam-option" id="examOpt' + displayIdx + '" onclick="selectExamAnswer(' + displayIdx + ')" style="background:#FFFFFF;border:2px solid #E7E5DE;border-radius:12px;padding:14px 16px;margin-bottom:8px;cursor:pointer;display:flex;align-items:flex-start;gap:12px;transition:all 0.2s;" ' +
          'onmouseover="if(!this.classList.contains(\'exam-answered\')&&!this.classList.contains(\'exam-selected\'))this.style.borderColor=\'#3b82f6\'" ' +
          'onmouseout="if(!this.classList.contains(\'exam-answered\')&&!this.classList.contains(\'exam-selected\'))this.style.borderColor=\'#E7E5DE\'">' +
          '<div style="width:28px;height:28px;border-radius:50%;background:#FAFAF7;border:1px solid #E7E5DE;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#6B6B66;flex-shrink:0;" id="examOptCircle' + displayIdx + '">' + letters[displayIdx] + '</div>' +
          '<div style="font-size:13px;color:#0F0F0F;line-height:1.5;flex:1;">' + _escHtml(opts[origIdx] || '') + '</div>' +
        '</div>';
      });
      html += '</div>';

      area.innerHTML = html;
    }

    function selectExamAnswer(displayIndex) {
      if (!_examState || _examState.answered) return;

      var q = _examState.questions[_examState.currentIndex];
      var indices = q._shuffledIndices;

      // Reset all options to default style
      indices.forEach(function(origIdx, dispIdx) {
        var el = document.getElementById('examOpt' + dispIdx);
        var circle = document.getElementById('examOptCircle' + dispIdx);
        if (!el) return;
        el.classList.remove('exam-selected');
        el.style.borderColor = '#E7E5DE';
        el.style.background = '#FFFFFF';
        if (circle) { circle.style.background = '#FAFAF7'; circle.style.color = '#6B6B66'; }
      });

      // Highlight selected option (blue)
      var selEl = document.getElementById('examOpt' + displayIndex);
      var selCircle = document.getElementById('examOptCircle' + displayIndex);
      if (selEl) {
        selEl.classList.add('exam-selected');
        selEl.style.borderColor = '#3b82f6';
        selEl.style.background = 'rgba(59,130,246,0.1)';
      }
      if (selCircle) { selCircle.style.background = '#3b82f6'; selCircle.style.color = '#fff'; }

      _examState.pendingAnswer = displayIndex;

      // Show confirm button
      var confirmBtn = document.getElementById('examConfirmBtn');
      if (confirmBtn) confirmBtn.style.display = 'inline-block';
    }

    async function confirmExamAnswer() {
      if (!_examState || _examState.answered || _examState.pendingAnswer === null) return;
      _examState.answered = true;
      var displayIndex = _examState.pendingAnswer;

      var q = _examState.questions[_examState.currentIndex];
      var indices = q._shuffledIndices;
      var originalIndex = indices[displayIndex];

      // Hide confirm button immediately and disable all options
      var confirmBtn = document.getElementById('examConfirmBtn');
      if (confirmBtn) { confirmBtn.style.display = 'none'; }
      indices.forEach(function(origIdx, dispIdx) {
        var el = document.getElementById('examOpt' + dispIdx);
        if (el) { el.onclick = null; el.onmouseover = null; el.onmouseout = null; el.style.cursor = 'default'; }
      });

      // Show loading indicator in feedback area
      var feedbackEl = document.getElementById('examFeedback');
      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.background = 'rgba(59,130,246,0.1)';
        feedbackEl.style.border = '1px solid rgba(59,130,246,0.3)';
        feedbackEl.innerHTML = '<div style="font-weight:600;color:#1E40AF;">' + _tc('se_verifying', 'Verificando respuesta...') + '</div>';
      }

      // Server-side verification (no client-side fallback for exams)
      var isCorrect = false;
      var correctOriginal = null;
      var explanation = '';
      var retries = 0;
      var maxRetries = 1;
      var verified = false;
      var _abortTimer = null;

      // Lock UI during verification: disable next button and option clicks
      var nextBtnLock = document.getElementById('examNextBtn');
      if (nextBtnLock) nextBtnLock.disabled = true;

      while (retries <= maxRetries && !verified) {
        try {
          var SB_BASE = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
          var SB_KEY_VAL = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
          var examOriginalIndex = typeof q._originalExamIndex === 'number' ? q._originalExamIndex : _examState.currentIndex;
          // AbortController with 10s timeout to prevent hanging fetch
          var _abortCtrl = new AbortController();
          _abortTimer = setTimeout(function() { _abortCtrl.abort(); }, 10000);
          var res = await fetch(SB_BASE + '/functions/v1/verify-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_KEY_VAL },
            body: JSON.stringify({
              system: 'exam',
              examId: _examState.examId,
              questionIndex: examOriginalIndex,
              selectedAnswer: originalIndex
            }),
            signal: _abortCtrl.signal
          });
          clearTimeout(_abortTimer);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          var result = await res.json();
          isCorrect = !!result.isCorrect;
          correctOriginal = typeof result.correctIndex === 'number' ? result.correctIndex : null;
          explanation = result.explanation || '';
          verified = true;
        } catch(e) {
          if (_abortTimer) clearTimeout(_abortTimer);
          console.warn('[MaestroAC] verify-answer exam attempt ' + (retries + 1) + ' failed:', e);
          retries++;
          if (retries <= maxRetries) {
            if (feedbackEl) {
              feedbackEl.innerHTML = '<div style="font-weight:600;color:#E8591C;">' + _tc('se_verify_retry', 'Error verificando respuesta, reintentando...') + '</div>';
            }
            await new Promise(function(resolve) { setTimeout(resolve, 1500); });
          }
        }
      }

      // Unlock UI after verification completes
      if (nextBtnLock) nextBtnLock.disabled = false;

      if (!verified) {
        // Both attempts failed — show error, allow user to retry by re-enabling
        if (feedbackEl) {
          feedbackEl.style.background = 'rgba(220,38,38,0.1)';
          feedbackEl.style.border = '1px solid rgba(220,38,38,0.3)';
          feedbackEl.innerHTML = '<div style="font-weight:700;color:#DC2626;">' + _tc('se_connection_error', 'Error de conexion. Verifica tu internet e intenta de nuevo.') + '</div>' +
            '<button onclick="retryExamConfirm()" style="margin-top:8px;padding:8px 20px;background:#3b82f6;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">' + _tc('ht_retry', 'Reintentar') + '</button>';
        }
        // Reset state so user can retry
        _examState.answered = false;
        return;
      }

      // Store correct answer back on question for results display
      q.correct = correctOriginal;
      q.explanation = explanation;

      var correctDisplayIndex = correctOriginal !== null ? indices.indexOf(correctOriginal) : -1;

      if (isCorrect) _examState.correctCount++;

      _examState.answers.push({
        questionIndex: _examState.currentIndex,
        selectedOriginal: originalIndex,
        correctOriginal: correctOriginal,
        correct: isCorrect
      });

      // Highlight options with correct/incorrect feedback
      indices.forEach(function(origIdx, dispIdx) {
        var el = document.getElementById('examOpt' + dispIdx);
        if (!el) return;
        el.classList.add('exam-answered');
        el.classList.remove('exam-selected');
        if (dispIdx === correctDisplayIndex) {
          el.style.borderColor = '#16a34a';
          el.style.background = 'rgba(22,163,74,0.15)';
        } else if (dispIdx === displayIndex && !isCorrect) {
          el.style.borderColor = '#dc2626';
          el.style.background = 'rgba(220,38,38,0.15)';
        } else {
          el.style.opacity = '0.5';
        }
      });

      // Show feedback
      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        if (isCorrect) {
          feedbackEl.style.background = 'rgba(22,163,74,0.15)';
          feedbackEl.style.border = '1px solid rgba(22,163,74,0.3)';
          feedbackEl.innerHTML = '<div style="font-weight:700;color:#059669;margin-bottom:4px;">✓ ' + _tc('se_correct_label', 'Correcto!') + '</div>' +
            (explanation ? '<div style="font-size:12px;color:#3D3D3A;line-height:1.5;">' + _escHtml(explanation) + '</div>' : '');
        } else {
          feedbackEl.style.background = 'rgba(220,38,38,0.15)';
          feedbackEl.style.border = '1px solid rgba(220,38,38,0.3)';
          feedbackEl.innerHTML = '<div style="font-weight:700;color:#DC2626;margin-bottom:4px;">✗ ' + _tc('se_incorrect_label', 'Incorrecto') + '</div>' +
            (explanation ? '<div style="font-size:12px;color:#3D3D3A;line-height:1.5;">' + _escHtml(explanation) + '</div>' : '');
        }
      }

      // Show next button
      var nextBtn = document.getElementById('examNextBtn');
      if (nextBtn) {
        if (_examState.currentIndex >= _examState.questions.length - 1) {
          nextBtn.textContent = _tc('se_view_results', 'Ver Resultados');
        } else {
          nextBtn.textContent = _tc('next', 'Siguiente');
        }
        nextBtn.style.display = 'inline-block';
      }
    }

    // Retry handler for failed exam answer verification
    function retryExamConfirm() {
      if (!_examState) return;
      _examState.answered = false;
      confirmExamAnswer();
    }

    function nextExamQuestion() {
      if (!_examState) return;
      _examState.currentIndex++;
      if (_examState.currentIndex >= _examState.questions.length) {
        finishExam();
      } else {
        showExamQuestion();
      }
    }

    function _buildCategoryBreakdown() {
      if (!_examState || !_examState.answers || _examState.answers.length === 0) return '';
      var cats = {};
      _examState.answers.forEach(function(ans) {
        var q = _examState.questions[ans.questionIndex];
        var cat = (q && q.category) ? q.category : 'General';
        if (!cats[cat]) cats[cat] = { total: 0, correct: 0 };
        cats[cat].total++;
        if (ans.correct) cats[cat].correct++;
      });
      var catKeys = Object.keys(cats);
      if (catKeys.length <= 1 && catKeys[0] === 'General') return '';
      // Sort: worst categories first
      catKeys.sort(function(a, b) {
        var pctA = cats[a].total > 0 ? cats[a].correct / cats[a].total : 0;
        var pctB = cats[b].total > 0 ? cats[b].correct / cats[b].total : 0;
        return pctA - pctB;
      });
      var html = '<div style="width:100%;margin-bottom:24px;text-align:left;">' +
        '<h3 style="color:#0F0F0F;font-size:14px;margin:0 0 10px;text-align:center;">📊 ' + _tc('se_breakdown_by_area', 'Desglose por Área') + '</h3>';
      catKeys.forEach(function(cat) {
        var c = cats[cat];
        var pct = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
        var barColor = pct >= 80 ? '#059669' : pct >= 50 ? '#E8591C' : '#DC2626';
        var icon = pct >= 80 ? '✅' : pct >= 50 ? '⚠️' : '❌';
        html += '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:10px;padding:10px 14px;margin-bottom:6px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
            '<span style="color:#0F0F0F;font-size:13px;font-weight:600;">' + icon + ' ' + _escHtml(cat) + '</span>' +
            '<span style="color:' + barColor + ';font-size:13px;font-weight:700;">' + c.correct + '/' + c.total + ' (' + pct + '%)</span>' +
          '</div>' +
          '<div style="width:100%;height:6px;background:#E7E5DE;border-radius:3px;overflow:hidden;">' +
            '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:3px;transition:width 0.5s;"></div>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
      return html;
    }

    async function finishExam() {
      if (!_examState || _examState._finishing) return;
      _examState._finishing = true; // Prevent double execution

      // Stop timer & anti-cheat
      if (_examState.timerId) { clearInterval(_examState.timerId); _examState.timerId = null; }
      _stopAntiCheatMonitor();

      var total = _examState.questions.length;
      var correct = _examState.correctCount;
      var rawPercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
      var violations = _examState.tabViolations || 0;
      var penaltyPct = Math.min(violations * 2, rawPercentage); // -2% per violation, capped at raw score
      var percentage = Math.max(0, rawPercentage - penaltyPct);
      var elapsedSec = Math.floor((Date.now() - _examState.startTime) / 1000);
      var passingScore = _examState.examData.passing_score || 70;
      var passed = percentage >= passingScore;
      // Capture title before any await — _examState will be nulled at end of function
      var examTitle = _examState.examData.title || 'Examen';

      // Update attempt in DB
      try {
        if (_examState.attemptId) {
          await supabaseClient.from('zm_exam_attempts').update({
            status: 'completed',
            score: percentage,
            percentage: percentage,
            correct_answers: correct,
            total_questions: total,
            answers: _examState.answers,
            time_taken: elapsedSec,
            completed_at: new Date().toISOString(),
            tab_violations: violations,
            violations: _examState.violations || [],
            penalty_applied: penaltyPct
          }).eq('id', _examState.attemptId);
        }
      } catch(e) {
        console.error('[MaestroAC] Error saving exam attempt:', e);
      }

      // Show results in the overlay
      var overlay = document.getElementById('examTakingOverlay');
      if (!overlay) return;

      var min = Math.floor(elapsedSec / 60);
      var sec = elapsedSec % 60;
      var timeStr = min + ':' + (sec < 10 ? '0' : '') + sec;
      var scoreColor = passed ? '#059669' : '#DC2626';
      var scoreGradient = passed ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#DC2626,#b91c1c)';

      var penaltyHtml = '';
      if (violations > 0) {
        penaltyHtml = '<div style="background:#FEE2E2;border:1px solid #DC2626;border-radius:10px;padding:10px 16px;margin-bottom:16px;width:100%;box-sizing:border-box;text-align:center;">' +
          '<div style="font-weight:700;color:#991B1B;font-size:13px;">⚠️ ' + _tc('se_penalty', 'Penalizacion') + ': -' + penaltyPct + '% (' + violations + ' ' + _tc('se_screen_exit', 'salida') + (violations !== 1 ? 's' : '') + ' ' + _tc('se_from_screen', 'de pantalla') + ')</div>' +
          '<div style="font-size:11px;color:#DC2626;margin-top:2px;">' + _tc('se_base_score', 'Puntaje base') + ': ' + rawPercentage + '% → ' + _tc('se_final', 'Final') + ': ' + percentage + '%</div>' +
        '</div>';
      }

      overlay.innerHTML =
        '<div style="max-width:500px;margin:0 auto;padding:24px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;">' +
          '<div style="font-size:48px;margin-bottom:12px;">' + (passed ? '🎉' : '📚') + '</div>' +
          '<h2 style="color:#0F0F0F;margin:0 0 6px 0;font-size:20px;">' + (passed ? _tc('se_congratulations', 'Felicidades!') : _tc('se_keep_practicing', 'Sigue Practicando')) + '</h2>' +
          '<p style="color:#6B6B66;font-size:13px;font-weight:500;margin:0 0 24px 0;">' + _escHtml(examTitle) + '</p>' +

          '<div style="width:120px;height:120px;border-radius:50%;background:' + scoreGradient + ';display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 8px 24px rgba(17,17,17,0.12);">' +
            '<div style="font-size:32px;font-weight:900;color:#fff;">' + percentage + '%</div>' +
          '</div>' +

          penaltyHtml +

          '<div style="padding:6px 20px;background:' + (passed ? '#D1FAE5' : '#FEE2E2') + ';color:' + scoreColor + ';border-radius:20px;font-size:13px;font-weight:700;margin-bottom:24px;">' + (passed ? _tc('se_passed', 'APROBADO') : _tc('se_not_passed', 'NO APROBADO')) + ' (' + _tc('se_minimum', 'minimo') + ' ' + passingScore + '%)</div>' +

          '<div style="display:flex;gap:16px;margin-bottom:24px;">' +
            '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:14px 20px;text-align:center;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
              '<div style="font-size:20px;font-weight:800;color:#3b82f6;">' + correct + '/' + total + '</div>' +
              '<div style="font-size:10px;color:#6B6B66;font-weight:500;">' + _tc('se_correct', 'Correctas') + '</div>' +
            '</div>' +
            '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:14px 20px;text-align:center;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
              '<div style="font-size:20px;font-weight:800;color:#E8591C;">' + timeStr + '</div>' +
              '<div style="font-size:10px;color:#6B6B66;font-weight:500;">' + _tc('se_time', 'Tiempo') + '</div>' +
            '</div>' +
            '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:14px 20px;text-align:center;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
              '<div style="font-size:20px;font-weight:800;color:#8b5cf6;">' + total + '</div>' +
              '<div style="font-size:10px;color:#6B6B66;font-weight:500;">' + _tc('se_questions', 'Preguntas') + '</div>' +
            '</div>' +
          '</div>' +

          _buildCategoryBreakdown() +

          '<button onclick="exitExamOverlay()" style="padding:14px 40px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(59,130,246,0.3);">' + _tc('se_back_to_exams', 'Volver a Examenes') + '</button>' +
        '</div>';

      _examState = null;
    }

    function exitExamOverlay() {
      var overlay = document.getElementById('examTakingOverlay');
      if (overlay) overlay.remove();
      if (_examState && _examState.timerId) { clearInterval(_examState.timerId); }
      _stopAntiCheatMonitor();
      _examState = null;
      // Reload the student exams screen
      try { loadStudentExamsScreen(); } catch(e) { console.warn('[StudentExams]', e.message || e); }
    }

    async function loadStudentWorkbooks() {
      const container = document.getElementById('studentWorkbooks');
      if (!container) return;
      const email = localStorage.getItem('tecnico_email') || '';
      try {
        let query = supabaseClient.from('student_books').select('*').eq('activo', true).order('created_at', {ascending: false});
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: #aaa; grid-column: 1/-1;">' + _tc('se_no_books', 'No hay libros disponibles aún') + '</p>';
          return;
        }
        // Filter: show if asignado_a is 'todos' or matches student email
        const filtered = data.filter(b => b.asignado_a === 'todos' || b.asignado_a === email);
        if(filtered.length === 0){
          container.innerHTML = '<p style="text-align: center; color: #aaa; grid-column: 1/-1;">' + _tc('se_no_books', 'No hay libros disponibles aún') + '</p>';
          return;
        }
        let html = '';
        filtered.forEach(book => {
          html += '<div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 15px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">';
          html += '<div style="font-size: 2em; margin-bottom: 8px;">📖</div>';
          html += '<div style="font-weight: bold; color: #f0f4fa; font-size: 0.9em;">' + _escHtml(book.titulo || '') + '</div>';
          html += '<div style="color: rgba(180,200,230,0.5); font-size: 0.75em; margin: 4px 0;">' + _escHtml(book.categoria || '') + '</div>';
          if(book.descripcion) html += '<div style="color: rgba(180,200,230,0.4); font-size: 0.7em; margin: 4px 0;">' + _escHtml(book.descripcion || '') + '</div>';
          html += '<a href="' + _escHtml(book.file_url || '') + '" target="_blank" rel="noopener" style="display: inline-block; margin-top: 8px; padding: 5px 12px; background: #3498db; color: #fff; border-radius: 6px; text-decoration: none; font-size: 0.8em;">📥 ' + _tc('se_download', 'Descargar') + '</a>';
          html += '</div>';
        });
        container.innerHTML = html;
      } catch(e) {
        console.warn('[StudentExams] loadStudentWorkbooks failed:', e && e.message || e);
        container.innerHTML = '<p style="text-align: center; color: #aaa; grid-column: 1/-1;">' + _tc('se_no_books', 'No hay libros disponibles aún') + '</p>';
      }
    }

    async function loadStudentPayments() {
      const container = document.getElementById('studentPaymentRecords');
      if (!container) return;
      const email = localStorage.getItem('tecnico_email') || '';
      if(!email){ container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('se_no_payments', 'No hay records de pagos') + '</p>'; return; }
      try {
        const _sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
        const _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
        const _resp = await fetch(_sbUrl + '/functions/v1/admin-payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey },
          body: JSON.stringify({ action: 'student_my_payments', student_email: email }),
        });
        const _json = await _resp.json();
        if (!_resp.ok) throw new Error(_json.error || 'Failed');
        const data = _json.data || [];
        const error = null;
        if (!data || data.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('se_no_payments', 'No hay records de pagos') + '</p>';
          return;
        }
        let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">';
        html += '<tr style="background: rgba(255,255,255,0.06);"><th style="padding: 8px; text-align: left; color: #d0d8e8;">' + _tc('se_date', 'Fecha') + '</th><th style="padding: 8px; text-align: left; color: #d0d8e8;">' + _tc('se_concept', 'Concepto') + '</th><th style="padding: 8px; text-align: right; color: #d0d8e8;">' + _tc('se_amount', 'Monto') + '</th><th style="padding: 8px; text-align: center; color: #d0d8e8;">' + _tc('se_method', 'Método') + '</th></tr>';
        data.forEach(p => {
          html += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">';
          var _fpDate = p.fecha_pago ? new Date(p.fecha_pago) : null;
          html += '<td style="padding: 8px;">' + (_fpDate && !isNaN(_fpDate.getTime()) ? _fpDate.toLocaleDateString('es-MX') : '-') + '</td>';
          html += '<td style="padding: 8px;">' + _escHtml(p.concepto || '') + '</td>';
          html += '<td style="padding: 8px; text-align: right; font-weight: bold; color: #2ecc71;">$' + (isFinite(parseFloat(p.monto)) ? parseFloat(p.monto) : 0).toFixed(2) + '</td>';
          html += '<td style="padding: 8px; text-align: center;">' + _escHtml(p.metodo_pago || '') + '</td>';
          html += '</tr>';
        });
        html += '</table></div>';
        container.innerHTML = html;
      } catch(e) {
        console.warn('[StudentExams] loadStudentPayments failed:', e && e.message || e);
        container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('se_no_payments', 'No hay records de pagos') + '</p>';
      }
    }

    async function requestTaxForm() {
      const email = localStorage.getItem('tecnico_email') || '';
      const name = localStorage.getItem('tecnico_name') || '';
      const statusEl = document.getElementById('taxFormStatus');
      
      try {
        await supabaseClient.from('tax_form_requests').insert([{
          student_name: name,
          student_email: email,
          requested_at: new Date().toISOString(),
          status: 'pending',
          year: new Date().getFullYear()
        }]);
        
        if (statusEl) statusEl.innerHTML = '✅ ' + _tc('se_request_sent', 'Solicitud enviada. Te contactaremos pronto.');
        if (typeof window.showToast === 'function') window.showToast(_tc('se_tax_request_sent', 'Solicitud de forma de taxes enviada exitosamente'), 'success'); else window.MaestroDialog.alert({title: '', message: '✅ ' + _tc('se_tax_request_sent', 'Solicitud de forma de taxes enviada exitosamente'), kind: 'success'});
        notifyAdmin(_tc('se_tax_form_request_title', 'Solicitud Tax Form'), name + ' ' + _tc('se_tax_form_request_body', 'solicita forma de taxes'), 'taxform');
      } catch(e) {
        if (statusEl) statusEl.innerHTML = '✅ ' + _tc('se_request_registered', 'Solicitud registrada.');
        if (typeof window.showToast === 'function') window.showToast(_tc('se_request_registered_full', 'Solicitud registrada. El instructor te contactará pronto.'), 'success'); else window.MaestroDialog.alert({title: '', message: '✅ ' + _tc('se_request_registered_full', 'Solicitud registrada. El instructor te contactará pronto.'), kind: 'success'});
      }
    }

    // ============================================
