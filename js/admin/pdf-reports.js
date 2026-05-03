    if (typeof _addTranslations === 'function') _addTranslations({
      adm_pdf_load_first: { es: 'Carga los datos primero', en: 'Load data first' },
      adm_pdf_title: { es: 'Reporte Mensual Maestro HVACR', en: 'Monthly Report Maestro HVACR' },
      adm_pdf_students: { es: 'Estudiantes', en: 'Students' },
      adm_pdf_with_progress: { es: 'Con Progreso', en: 'With Progress' },
      adm_pdf_quizzes_taken: { es: 'Quizzes Tomados', en: 'Quizzes Taken' },
      adm_pdf_avg_score: { es: 'Score Promedio', en: 'Average Score' },
      adm_pdf_level_dist: { es: 'Distribución por Nivel', en: 'Distribution by Level' },
      adm_pdf_level: { es: 'Nivel', en: 'Level' },
      adm_pdf_pct_total: { es: '% del Total', en: '% of Total' },
      adm_pdf_top20: { es: 'Top 20 Estudiantes', en: 'Top 20 Students' },
      adm_pdf_name: { es: 'Nombre', en: 'Name' },
      adm_pdf_quizzes: { es: 'Quizzes', en: 'Quizzes' },
      adm_pdf_generated: { es: 'Generado el', en: 'Generated on' },
      adm_pdf_print: { es: 'Imprimir / Guardar como PDF', en: 'Print / Save as PDF' },
      adm_pdf_popup_blocked: { es: 'No se pudo abrir la ventana del reporte. Verifica que tu navegador no esté bloqueando popups.', en: 'Could not open report window. Check that your browser is not blocking popups.' },
    });

    // ==================== #12 REPORTES PDF MENSUALES ====================
    async function generatePDFReport() {
      if (!window.allTechnicians) { alert(_t('adm_pdf_load_first')); return; }

      var techs = window.allTechnicians || [];
      var now = new Date();
      var monthName = now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
      
      // Build HTML report
      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte Maestro HVACR - ' + monthName + '</title>';
      html += '<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#333;}';
      html += 'h1{color:#1a1a2e;border-bottom:3px solid #f39c12;padding-bottom:10px;}';
      html += 'h2{color:#2c3e50;margin-top:30px;}';
      html += '.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:20px 0;}';
      html += '.stat-card{background:#f8f9fa;border-radius:10px;padding:15px;text-align:center;border:1px solid #e2e8f0;}';
      html += '.stat-card .num{font-size:28px;font-weight:bold;color:#1a1a2e;}';
      html += '.stat-card .label{font-size:11px;color:#64748b;margin-top:4px;}';
      html += 'table{width:100%;border-collapse:collapse;margin:15px 0;font-size:13px;}';
      html += 'th{background:#1a1a2e;color:white;padding:8px 12px;text-align:left;}';
      html += 'td{padding:6px 12px;border-bottom:1px solid #eee;}';
      html += 'tr:nth-child(even){background:#f8f9fa;}';
      html += '.footer{margin-top:40px;text-align:center;color:#94a3b8;font-size:11px;border-top:1px solid #eee;padding-top:15px;}';
      html += '@media print{body{padding:0;}.no-print{display:none!important;}}';
      html += '</style></head><body>';
      
      // Header
      html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html += '<div><h1>📊 ' + _t('adm_pdf_title') + '</h1><p style="color:#64748b;">' + monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' | ACVOLT Tech School</p></div>';
      html += '<div style="text-align:right;"><strong style="color:#f39c12;font-size:18px;">Nivel 33</strong><br><span style="color:#94a3b8;font-size:11px;">Maestro Mario</span></div>';
      html += '</div>';
      
      // Stats
      var totalStudents = techs.length;
      var withProgress = techs.filter(function(t) { return t.progress && Object.values(t.progress).some(function(p) { return p.completed > 0; }); }).length;
      var totalQuizzes = 0, totalScore = 0;
      techs.forEach(function(t) { if (t.progress) Object.values(t.progress).forEach(function(p) { totalQuizzes += p.completed; totalScore += p.score; }); });
      var avgScore = totalQuizzes > 0 ? Math.round(totalScore/totalQuizzes*100) : 0;
      
      html += '<div class="stat-grid">';
      html += '<div class="stat-card"><div class="num">' + totalStudents + '</div><div class="label">' + _t('adm_pdf_students') + '</div></div>';
      html += '<div class="stat-card"><div class="num">' + withProgress + '</div><div class="label">' + _t('adm_pdf_with_progress') + '</div></div>';
      html += '<div class="stat-card"><div class="num">' + totalQuizzes + '</div><div class="label">' + _t('adm_pdf_quizzes_taken') + '</div></div>';
      html += '<div class="stat-card"><div class="num">' + avgScore + '%</div><div class="label">' + _t('adm_pdf_avg_score') + '</div></div>';
      html += '</div>';
      
      // Level distribution
      html += '<h2>📚 ' + _t('adm_pdf_level_dist') + '</h2>';
      html += '<table><tr><th>' + _t('adm_pdf_level') + '</th><th>' + _t('adm_pdf_students') + '</th><th>' + _t('adm_pdf_pct_total') + '</th></tr>';
      var levels = {principiante:0,intermedio:0,avanzado:0,elite:0,platino:0};
      techs.forEach(function(t) { if (t.progress) Object.entries(t.progress).forEach(function(e) { if (e[1].completed > 0 && levels.hasOwnProperty(e[0])) levels[e[0]]++; }); });
      Object.entries(levels).forEach(function(e) {
        var pct = totalStudents > 0 ? Math.round(e[1]/totalStudents*100) : 0;
        html += '<tr><td style="text-transform:capitalize;">' + e[0] + '</td><td>' + e[1] + '</td><td>' + pct + '%</td></tr>';
      });
      html += '</table>';
      
      // Top 20 students
      html += '<h2>🏆 ' + _t('adm_pdf_top20') + '</h2>';
      html += '<table><tr><th>#</th><th>' + _t('adm_pdf_name') + '</th><th>Email</th><th>' + _t('adm_pdf_quizzes') + '</th><th>Score Avg</th></tr>';
      var ranked = [];
      techs.forEach(function(t) {
        if (!t.progress) return;
        var tS = 0, tQ = 0;
        Object.values(t.progress).forEach(function(p) { tS += p.score; tQ += p.completed; });
        if (tQ > 0) ranked.push({name:t.nombre||'', email:t.email||'', score:tS, q:tQ, avg:Math.round(tS/tQ*100)});
      });
      ranked.sort(function(a,b) { return b.avg - a.avg; });
      ranked.slice(0,20).forEach(function(r,i) {
        html += '<tr><td>' + (i+1) + '</td><td>' + _escHtml(r.name) + '</td><td>' + _escHtml(r.email) + '</td><td>' + r.q + '</td><td><strong>' + r.avg + '%</strong></td></tr>';
      });
      html += '</table>';
      
      // Footer
      html += '<div class="footer">' + _t('adm_pdf_generated') + ' ' + now.toLocaleDateString('es-MX', {day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) + ' | Maestro HVACR | ACVOLT Tech School | maestrohvacr.com</div>';
      
      // Print button
      html += '<div class="no-print" style="text-align:center;margin:30px 0;"><button onclick="window.print()" style="padding:12px 30px;background:#f39c12;color:#333;border:none;border-radius:8px;font-weight:bold;font-size:15px;cursor:pointer;">🖨️ ' + _t('adm_pdf_print') + '</button></div>';
      
      html += '</body></html>';
      
      var win = window.open('', '_blank');
      if (!win) { alert(_t('adm_pdf_popup_blocked')); return; }
      win.document.write(html);
      win.document.close();
    }

