    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    async function loadStudentProgress() {
      const container = document.getElementById('studentProgressBars');
      if (!container) return;
      const levels = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      const icons = {principiante: '🔧', intermedio: '📊', avanzado: '⚡', elite: '🏆', platino: '💎'};
      const colors = {principiante: '#2ecc71', intermedio: '#3498db', avanzado: '#e67e22', elite: '#e74c3c', platino: '#9b59b6'};
      
      let html = '';
      levels.forEach(level => {
        const email = localStorage.getItem('tecnico_email') || '';
        const key = email ? 'maestroac_progress_' + email : 'tecnico_progress';
        const prog = JSON.parse(localStorage.getItem(key) || '{}');
        const p = prog[level] || {completed: 0, total: 0, score: 0};
        const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
        const scorePct = p.completed > 0 ? Math.round((p.score / p.completed) * 100) : 0;
        
        html += '<div style="display: flex; align-items: center; gap: 10px;">';
        html += '<span style="min-width: 100px; font-weight: bold; color: ' + colors[level] + ';">' + icons[level] + ' ' + level.charAt(0).toUpperCase() + level.slice(1) + '</span>';
        html += '<div style="flex: 1; background: rgba(255,255,255,0.08); border-radius: 10px; height: 20px; overflow: hidden; position: relative;">';
        html += '<div style="height: 100%; width: ' + pct + '%; background: ' + colors[level] + '; border-radius: 10px; transition: width 0.5s;"></div>';
        html += '<span style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 0.7em; color: rgba(220,230,245,0.9); font-weight: bold;">' + p.completed + '/' + p.total + ' (' + pct + '%)</span>';
        html += '</div>';
        html += '<span style="min-width: 50px; text-align: right; font-size: 0.8em; color: ' + (scorePct >= 80 ? '#2ecc71' : scorePct >= 60 ? '#f39c12' : '#e74c3c') + ';">' + scorePct + '% ✅</span>';
        html += '</div>';
      });

      // Fetch graded tasks from DB and show task progress
      try {
        const email = localStorage.getItem('tecnico_email') || '';
        if (email && supabaseClient) {
          const { data: gradedTasks } = await supabaseClient.from('submitted_tasks')
            .select('grade, admin_override_grade')
            .eq('student_email', email)
            .not('grade', 'is', null);
          if (gradedTasks && gradedTasks.length > 0) {
            var totalTasks = gradedTasks.length;
            var passed = 0, scoreSum = 0;
            gradedTasks.forEach(function(t) {
              var g = t.admin_override_grade != null ? t.admin_override_grade : t.grade;
              scoreSum += g;
              if (g >= 70) passed++;
            });
            var avg = Math.round(scoreSum / totalTasks);
            var passPct = Math.round((passed / totalTasks) * 100);
            var barColor = avg >= 80 ? '#2ecc71' : avg >= 70 ? '#f39c12' : '#e74c3c';

            html += '<div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #ddd;">';
            html += '<span style="min-width: 100px; font-weight: bold; color: ' + barColor + ';">📝 ' + _tc('sg_tasks', 'Tareas') + '</span>';
            html += '<div style="flex: 1; background: rgba(255,255,255,0.08); border-radius: 10px; height: 20px; overflow: hidden; position: relative;">';
            html += '<div style="height: 100%; width: ' + passPct + '%; background: ' + barColor + '; border-radius: 10px; transition: width 0.5s;"></div>';
            html += '<span style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 0.7em; color: rgba(220,230,245,0.9); font-weight: bold;">' + passed + '/' + totalTasks + ' ' + _tc('sg_passed', 'aprobadas') + '</span>';
            html += '</div>';
            html += '<span style="min-width: 50px; text-align: right; font-size: 0.8em; color: ' + barColor + ';">' + avg + '% avg</span>';
            html += '</div>';
          }
        }
      } catch(e) { console.log('Task progress error:', e); }

      container.innerHTML = html;
    }

    async function loadStudentTasks() {
      const container = document.getElementById('studentTasksList');
      const select = document.getElementById('taskToSubmit');
      if (!container) return;
      
      const email = localStorage.getItem('tecnico_email') || '';
      try {
        const { data, error } = await supabaseClient.from('student_tasks')
          .select('*').eq('student_email', email).order('created_at', {ascending: false});
        
        if (error) throw error;
        if (!data || data.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('sg_no_tasks_assigned', 'No tienes tareas asignadas') + '</p>';
          return;
        }
        
        let html = '';
        let selectHtml = '<option value="">' + _tc('sg_select_task', 'Seleccionar tarea...') + '</option>';
        data.forEach(task => {
          const statusColor = task.status === 'completada' ? '#2ecc71' : task.status === 'pendiente' ? '#f39c12' : '#e74c3c';
          const statusIcon = task.status === 'completada' ? '✅' : task.status === 'pendiente' ? '⏳' : '📌';
          html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.06);">';
          html += '<div><strong>' + _escHtml(task.title || _tc('sg_task', 'Tarea')) + '</strong><br><span style="font-size: 0.8em; color: #888;">' + _escHtml(task.description || '') + '</span></div>';
          html += '<span style="color: ' + statusColor + '; font-weight: bold; font-size: 0.85em;">' + statusIcon + ' ' + (task.status || 'pendiente') + '</span>';
          html += '</div>';
          if (task.status === 'pendiente') {
            selectHtml += '<option value="' + task.id + '">' + _escHtml(task.title || _tc('sg_task', 'Tarea') + ' ' + task.id) + '</option>';
          }
        });
        container.innerHTML = html;
        if (select) select.innerHTML = selectHtml;
      } catch(e) {
        container.innerHTML = '<p style="text-align: center; color: #aaa;">' + _tc('sg_no_tasks_assigned', 'No tienes tareas asignadas') + '</p>';
      }
    }

    // ===== STUDENT GRADES VIEW =====
    var studySuggestions = {
      cableado: { name: _tc('sg_area_wiring', 'Cableado Eléctrico'), icon: '🔌', book: _tc('sg_book_nec_wiring', 'Manual de Cableado NEC') },
      seguridad: { name: _tc('sg_area_safety', 'Seguridad'), icon: '🛡️', book: _tc('sg_book_osha', 'Guía de Seguridad OSHA') },
      codigo_nec: { name: _tc('sg_area_nec', 'Código NEC'), icon: '📖', book: 'NEC Code Reference' },
      refrigeracion: { name: _tc('sg_area_refrigeration', 'Refrigeración'), icon: '❄️', book: _tc('sg_book_refrigeration', 'Fundamentos de Refrigeración') },
      diagnostico: { name: _tc('sg_area_diagnostics', 'Diagnóstico'), icon: '🔍', book: _tc('sg_book_diagnostics', 'Manual de Diagnóstico HVAC') },
      herramientas: { name: _tc('sg_area_tools', 'Herramientas'), icon: '🔧', book: _tc('sg_book_tools', 'Guía de Herramientas del Técnico') },
      electricidad: { name: _tc('sg_area_electricity', 'Electricidad'), icon: '⚡', book: _tc('sg_book_electricity', 'Electricidad Básica y Avanzada') },
      instalacion: { name: _tc('sg_area_installation', 'Instalación'), icon: '🏗️', book: _tc('sg_book_installation', 'Manual de Instalación AC') },
      mantenimiento: { name: _tc('sg_area_maintenance', 'Mantenimiento'), icon: '🔄', book: _tc('sg_book_maintenance', 'Mantenimiento Preventivo HVAC') },
      epa608: { name: 'EPA 608', icon: '🏅', book: _tc('sg_book_epa608', 'Preparación EPA 608') }
    };

    function buildOverallAnalysis(tasks) {
      var summaryEl = document.getElementById('studentGradesOverallSummary');
      if (!summaryEl || !tasks || tasks.length < 2) { if (summaryEl) summaryEl.style.display = 'none'; return; }

      // Aggregate category scores across all graded tasks
      var catTotals = {};
      var catCounts = {};
      tasks.forEach(function(t) {
        var scores = t.ai_category_scores;
        if (!scores || !scores.categories) return;
        var cats = scores.categories;
        for (var key in cats) {
          if (!catTotals[key]) { catTotals[key] = 0; catCounts[key] = 0; }
          catTotals[key] += cats[key];
          catCounts[key]++;
        }
      });

      var catAvgs = {};
      for (var key in catTotals) {
        catAvgs[key] = Math.round(catTotals[key] / catCounts[key]);
      }

      // Separate weak and strong areas
      var weak = [];
      var strong = [];
      for (var key in catAvgs) {
        if (catAvgs[key] < 75) weak.push({ key: key, avg: catAvgs[key] });
        else strong.push({ key: key, avg: catAvgs[key] });
      }
      weak.sort(function(a, b) { return a.avg - b.avg; });
      strong.sort(function(a, b) { return b.avg - a.avg; });

      if (weak.length === 0 && strong.length === 0) { summaryEl.style.display = 'none'; return; }

      // Compute overall avg
      var sum = 0;
      tasks.forEach(function(t) { sum += (t.admin_override_grade != null ? t.admin_override_grade : t.grade); });
      var avg = Math.round(sum / tasks.length);
      var motiv = getMotivationalMessage(avg);

      var html = '';
      // Overall motivational message
      html += '<div style="text-align:center;padding:10px;background:' + motiv.color + '12;border-radius:10px;margin-bottom:12px;">';
      html += '<span style="font-size:1.5em;">' + motiv.emoji + '</span>';
      html += '<div style="font-size:0.85em;color:' + motiv.color + ';font-weight:600;margin-top:4px;">' + motiv.text + '</div>';
      html += '</div>';

      // Weak areas with study suggestions
      if (weak.length > 0) {
        html += '<div style="margin-bottom:10px;">';
        html += '<div style="font-size:0.8em;font-weight:700;color:#e74c3c;margin-bottom:6px;">📉 ' + _tc('sg_areas_to_improve', 'Áreas para mejorar') + ':</div>';
        weak.forEach(function(w) {
          var info = studySuggestions[w.key] || { name: w.key, icon: '📋', book: '' };
          var barColor = w.avg < 50 ? '#e74c3c' : '#e67e22';
          html += '<div style="margin-bottom:8px;">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">';
          html += '<span style="font-size:0.78em;font-weight:600;color:rgba(220,230,245,0.9);">' + info.icon + ' ' + info.name + '</span>';
          html += '<span style="font-size:0.75em;color:' + barColor + ';font-weight:700;">' + w.avg + '%</span>';
          html += '</div>';
          html += '<div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + w.avg + '%;background:' + barColor + ';border-radius:3px;"></div></div>';
          if (info.book) html += '<div style="font-size:0.7em;color:#888;margin-top:2px;">💡 ' + _tc('sg_review', 'Repasa') + ': ' + info.book + '</div>';
          html += '</div>';
        });
        html += '</div>';
      }

      // Strong areas
      if (strong.length > 0) {
        html += '<div>';
        html += '<div style="font-size:0.8em;font-weight:700;color:#27ae60;margin-bottom:6px;">💚 ' + _tc('sg_your_strengths', 'Tus fortalezas') + ':</div>';
        strong.slice(0, 3).forEach(function(s) {
          var info = studySuggestions[s.key] || { name: s.key, icon: '📋' };
          html += '<div style="margin-bottom:6px;">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">';
          html += '<span style="font-size:0.78em;font-weight:600;color:rgba(220,230,245,0.9);">' + info.icon + ' ' + info.name + '</span>';
          html += '<span style="font-size:0.75em;color:#27ae60;font-weight:700;">' + s.avg + '%</span>';
          html += '</div>';
          html += '<div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + s.avg + '%;background:#27ae60;border-radius:3px;"></div></div>';
          html += '</div>';
        });
        html += '</div>';
      }

      summaryEl.innerHTML = html;
      summaryEl.style.display = 'block';
    }

    async function loadStudentGrades() {
      const container = document.getElementById('studentGradesList');
      const avgContainer = document.getElementById('studentGradesAverage');
      const avgEl = document.getElementById('studentAvgGrade');
      if (!container) return;

      const email = localStorage.getItem('tecnico_email') || '';
      if (!email || !supabaseClient) {
        container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('grades_login_required', 'Inicia sesión para ver tus calificaciones') + '</p>';
        return;
      }

      try {
        const { data, error } = await supabaseClient.from('submitted_tasks')
          .select('id, task_type, grade, ai_feedback, ai_category_scores, ai_graded_at, admin_override_grade, admin_notes, submitted_at')
          .eq('student_email', email)
          .not('grade', 'is', null)
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) {
          container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('grades_no_tasks', 'Aún no tienes tareas calificadas. Envía una tarea con fotos para recibir calificación automática.') + '</p>';
          if (avgContainer) avgContainer.style.display = 'none';
          return;
        }

        // Calculate average
        var sum = 0;
        data.forEach(function(t) {
          sum += (t.admin_override_grade != null ? t.admin_override_grade : t.grade);
        });
        var avg = Math.round(sum / data.length);
        var avgColor = avg >= 90 ? '#2ecc71' : avg >= 80 ? '#27ae60' : avg >= 70 ? '#f39c12' : avg >= 60 ? '#e67e22' : '#e74c3c';
        if (avgEl) { avgEl.textContent = avg; avgEl.style.color = avgColor; }
        if (avgContainer) avgContainer.style.display = 'block';

        var html = '';
        data.forEach(function(t) {
          var finalGrade = t.admin_override_grade != null ? t.admin_override_grade : t.grade;
          var gColor = finalGrade >= 90 ? '#2ecc71' : finalGrade >= 80 ? '#27ae60' : finalGrade >= 70 ? '#f39c12' : finalGrade >= 60 ? '#e67e22' : '#e74c3c';
          var dateStr = t.submitted_at ? new Date(t.submitted_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          var overrideNote = t.admin_override_grade != null ? '<span style="font-size:0.7em;color:#3498db;display:block;">' + _tc('sg_instructor_grade', 'Nota del instructor') + '</span>' : '<span style="font-size:0.7em;color:#888;display:block;">' + _tc('sg_ai_grade', 'Calificación IA') + '</span>';

          html += '<div onclick="showStudentGradeDetail(\'' + t.id + '\')" style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'transparent\'">';
          html += '<div><strong>' + _escHtml(t.task_type || _tc('sg_task', 'Tarea')) + '</strong><br><span style="font-size:0.8em;color:#888;">' + dateStr + '</span></div>';
          html += '<div style="text-align:right;"><span style="font-size:1.4em;font-weight:bold;color:' + gColor + ';">' + finalGrade + '</span><span style="font-size:0.8em;color:#aaa;">/100</span>' + overrideNote + '</div>';
          html += '</div>';
        });
        container.innerHTML = html;
        buildOverallAnalysis(data);
        checkNewContent('student_grades', data, function(item) {
          var grade = item.admin_override_grade != null ? item.admin_override_grade : item.grade;
          return { type: 'grading', message: '🎓 ' + _tc('sg_new_grade', 'Nueva calificación') + ': ' + (item.task_type || _tc('sg_task', 'Tarea')) + ' — ' + grade + '/100', icon: '🎓' };
        });
      } catch(e) {
        console.error('Error loading grades:', e);
        container.innerHTML = '<p style="text-align:center;color:#aaa;">' + (typeof _t === 'function' ? _t('error') : 'Error') + '</p>';
      }
    }

    function getMotivationalMessage(grade) {
      if (grade >= 95) return { emoji: '🌟', text: _tc('sg_motiv_95', '¡Extraordinario! Eres un ejemplo a seguir.'), color: '#2ecc71' };
      if (grade >= 90) return { emoji: '🎉', text: _tc('sg_motiv_90', '¡Excelente trabajo! Sigue así.'), color: '#27ae60' };
      if (grade >= 80) return { emoji: '💪', text: _tc('sg_motiv_80', '¡Muy bien! Estás en buen camino.'), color: '#3498db' };
      if (grade >= 70) return { emoji: '👍', text: _tc('sg_motiv_70', 'Buen trabajo. ¡Puedes mejorar aún más!'), color: '#f39c12' };
      if (grade >= 60) return { emoji: '📚', text: _tc('sg_motiv_60', 'Sigue practicando, vas progresando.'), color: '#e67e22' };
      return { emoji: '🔄', text: _tc('sg_motiv_low', 'No te rindas. Repasa el material y vuelve a intentar.'), color: '#e74c3c' };
    }

    async function loadStudentSubmittedTasks() {
      const container = document.getElementById('studentSubmittedTasksList');
      if (!container) return;
      const email = localStorage.getItem('tecnico_email') || '';
      if (!email) { container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('grades_login_tasks', 'Inicia sesión para ver tus tareas') + '</p>'; return; }

      try {
        const { data, error } = await supabaseClient.from('submitted_tasks')
          .select('id, task_type, notes, status, submitted_at, grade, admin_override_grade, ai_feedback, ai_category_scores, admin_notes')
          .eq('student_email', email)
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) {
          container.innerHTML = '<p style="text-align:center;color:#aaa;">' + _tc('grades_no_submissions', 'No has enviado tareas aún') + '</p>';
          return;
        }

        var typeLabels = { tarea_asignada:_tc('sg_type_assigned','Tarea Asignada'), hoja_trabajo:_tc('sg_type_worksheet','Hoja de Trabajo'), pretest:'Pre-Test', posttest:'Post-Test', examen_practica:_tc('sg_type_practice_exam','Examen Práctica'), proyecto:_tc('sg_type_project','Proyecto'), certificacion:_tc('sg_type_certification','Certificación'), otro:_tc('sg_type_other','Otro') };
        var html = '';
        data.forEach(function(t) {
          var finalGrade = t.admin_override_grade != null ? t.admin_override_grade : t.grade;
          var statusIcon, statusText, statusColor;
          if (finalGrade != null) {
            statusIcon = '✅'; statusText = _tc('sg_status_graded', 'Calificada') + ': ' + finalGrade + '/100';
            statusColor = finalGrade >= 70 ? '#2ecc71' : '#e74c3c';
          } else if (t.status === 'attended') {
            statusIcon = '👁️'; statusText = _tc('sg_status_reviewed', 'Revisada');
            statusColor = '#3498db';
          } else {
            statusIcon = '⏳'; statusText = _tc('sg_status_pending', 'Pendiente');
            statusColor = '#f39c12';
          }
          var dateStr = t.submitted_at ? new Date(t.submitted_at).toLocaleDateString('es-MX', { month:'short', day:'numeric' }) : '';
          var typeLabel = typeLabels[t.task_type] || t.task_type || _tc('sg_task', 'Tarea');
          var isGraded = finalGrade != null;
          var clickAttr = isGraded ? ' onclick="showStudentGradeDetail(\'' + t.id + '\')" style="cursor:pointer;"' : '';

          html += '<div style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.06);' + (isGraded ? 'cursor:pointer;transition:background 0.2s;' : '') + '"' + (isGraded ? ' onclick="showStudentGradeDetail(\'' + t.id + '\')" onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'transparent\'"' : '') + '>';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
          html += '<div><strong>' + _escHtml(typeLabel) + '</strong>';
          if (t.notes) html += '<br><span style="font-size:0.75em;color:#999;">' + _escHtml(t.notes.length > 60 ? t.notes.substring(0,60) + '...' : t.notes) + '</span>';
          html += '<br><span style="font-size:0.75em;color:#bbb;">' + dateStr + '</span></div>';
          html += '<span style="color:' + statusColor + ';font-weight:bold;font-size:0.85em;white-space:nowrap;">' + statusIcon + ' ' + statusText + '</span>';
          html += '</div>';

          // Motivational message for graded tasks
          if (isGraded) {
            var motiv = getMotivationalMessage(finalGrade);
            html += '<div style="margin-top:8px;padding:6px 10px;background:' + motiv.color + '15;border-radius:8px;font-size:0.8em;color:' + motiv.color + ';">' + motiv.emoji + ' ' + motiv.text + '</div>';

            // Strength & improvement pills from ai_category_scores
            var scores = t.ai_category_scores || {};
            var strengths = (scores.strengths || []).slice(0, 2);
            var improvements = (scores.improvements || []).slice(0, 2);
            if (strengths.length > 0 || improvements.length > 0) {
              html += '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">';
              strengths.forEach(function(s) {
                html += '<span style="display:inline-block;padding:3px 8px;background:#d4edda;color:#155724;border-radius:12px;font-size:0.7em;font-weight:600;">✅ ' + _escHtml(s) + '</span>';
              });
              improvements.forEach(function(s) {
                html += '<span style="display:inline-block;padding:3px 8px;background:#fff3cd;color:#856404;border-radius:12px;font-size:0.7em;font-weight:600;">📈 ' + _escHtml(s) + '</span>';
              });
              html += '</div>';
            }

            // Admin notes
            if (t.admin_notes) {
              html += '<div style="margin-top:6px;padding:6px 10px;background:#e8f4fd;border-left:3px solid #3498db;border-radius:4px;font-size:0.75em;color:#2c3e50;">💬 <strong>' + _tc('sg_instructor', 'Instructor') + ':</strong> ' + _escHtml(t.admin_notes) + '</div>';
            }
          }

          html += '</div>';
        });
        container.innerHTML = html;
      } catch(e) {
        container.innerHTML = '<p style="text-align:center;color:#aaa;">' + (typeof _t === 'function' ? _t('error') : 'Error') + '</p>';
      }
    }

    // Show detailed grade feedback for a student's task
    async function showStudentGradeDetail(taskId) {
      try {
        const { data, error } = await supabaseClient.from('submitted_tasks')
          .select('*')
          .eq('id', taskId)
          .single();

        if (error || !data) { window.MaestroDialog.alert({title: 'Error', message: _tc('sg_load_detail_error', 'No se pudo cargar el detalle'), kind: 'error'}); return; }

        var result = {
          grade: data.admin_override_grade != null ? data.admin_override_grade : data.grade,
          feedback: data.ai_feedback || '',
          categories: (data.ai_category_scores && data.ai_category_scores.categories) ? data.ai_category_scores.categories : {},
          strengths: (data.ai_category_scores && data.ai_category_scores.strengths) ? data.ai_category_scores.strengths : [],
          improvements: (data.ai_category_scores && data.ai_category_scores.improvements) ? data.ai_category_scores.improvements : []
        };

        showGradeCard(result);
      } catch(e) {
        window.MaestroDialog.alert({title: 'Error', message: 'Error: ' + e.message, kind: 'error'});
      }
    }

