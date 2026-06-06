    // ========== CERTIFICATION COURSES ==========
    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

    const certCourses = {
      epa608: {
        icon: '🌍', name: 'EPA 608 Certification',
        desc: _tc('cert_epa608_desc', 'Paquete completo: 700 preguntas de preparación, examen oficial, y honorarios del proctor (4 hrs máx). Si no aprueba, paga el costo total nuevamente.'),
        price: '$599', examPrice: '$599 USD',
        sections: ['Core', _tc('cert_epa608_sec_tipo1', 'Tipo I - Small'), _tc('cert_epa608_sec_tipo2', 'Tipo II - High Pressure'), _tc('cert_epa608_sec_tipo3', 'Tipo III - Low Pressure'), _tc('cert_epa608_sec_recovery', 'Recuperación'), _tc('cert_epa608_sec_regulations', 'Regulaciones'), _tc('cert_epa608_sec_refrigerants', 'Refrigerantes'), _tc('cert_epa608_sec_safety', 'Seguridad')]
      },
      osha: {
        icon: '⛑️', name: 'OSHA 30 Hours Safety',
        desc: _tc('cert_osha_desc', 'Certificación OSHA 30 Horas. Incluye 700 preguntas de preparación y acceso al sitio web oficial para completar el curso y examen a tu propio ritmo.'),
        price: '$599', examPrice: '$599 USD',
        sections: ['PPE', _tc('cert_osha_sec_electrical', 'Riesgo Eléctrico'), _tc('cert_osha_sec_falls', 'Caídas'), _tc('cert_osha_sec_confined', 'Espacios Confinados'), _tc('cert_osha_sec_ladders', 'Escaleras'), 'LOTO', _tc('cert_osha_sec_hazcom', 'Comunicación de Riesgos'), _tc('cert_osha_sec_firstaid', 'Primeros Auxilios')]
      },
      a2l: {
        icon: '🧊', name: 'A2L Refrigerants Safety',
        desc: _tc('cert_a2l_desc', 'Paquete completo: 700 preguntas de preparación, examen oficial, y honorarios del proctor (4 hrs máx). Cubre R-32, R-454B, detección de fugas y regulaciones.'),
        price: '$299', examPrice: '$299 USD',
        sections: [_tc('cert_a2l_sec_classification', 'Clasificación A2L'), 'R-32', 'R-454B', _tc('cert_a2l_sec_leaks', 'Detección de Fugas'), _tc('cert_a2l_sec_ventilation', 'Ventilación'), _tc('cert_a2l_sec_charge', 'Límites de Carga'), _tc('cert_a2l_sec_tools', 'Herramientas Seguras'), _tc('cert_a2l_sec_regulations', 'Regulaciones')]
      },
      calefaccion: {
        icon: '🔥', name: 'Heating Technician',
        desc: _tc('cert_heating_desc', 'Paquete completo: 700 preguntas de preparación, examen oficial, y honorarios del proctor (4 hrs máx). Cubre gas, furnaces, combustión y controles de seguridad.'),
        price: '$599', examPrice: '$599 USD',
        sections: ['Gas Natural/LP', 'Furnace 80%', 'Furnace 90%+', _tc('cert_heating_sec_combustion', 'Combustión'), _tc('cert_heating_sec_exchanger', 'Intercambiador'), _tc('cert_heating_sec_safety', 'Controles de Seguridad'), _tc('cert_heating_sec_ignition', 'Ignición'), _tc('cert_heating_sec_ventilation', 'Ventilación')]
      },
      hvaccore: {
        icon: '❄️', name: _tc('cert_hvaccore_name', 'Refrigeración Comercial e Industrial'),
        desc: _tc('cert_hvaccore_desc', 'Paquete completo: 700 preguntas de preparación, examen oficial, y honorarios del proctor (4 hrs máx). Cubre refrigeración doméstica, comercial, industrial, controles y diagnóstico.'),
        price: '$599', examPrice: '$599 USD',
        sections: [_tc('cert_hvaccore_sec_domestic', 'Refrigeración Doméstica'), _tc('cert_hvaccore_sec_commercial', 'Refrigeración Comercial'), _tc('cert_hvaccore_sec_industrial', 'Refrigeración Industrial y Rack'), _tc('cert_hvaccore_sec_controls', 'Controles y Electricidad'), _tc('cert_hvaccore_sec_diagnostics', 'Diagnóstico y Herramientas')]
      },
      hvacr: {
        icon: '🏆', name: 'NATE & HVAC Excellence',
        desc: _tc('cert_hvacr_desc', 'Paquete completo: 749 preguntas de preparación de alto nivel. Cubre fundamentos, electricidad, heat pumps, sistemas comerciales, chillers, diagnóstico e industrial avanzado.'),
        price: '$599', examPrice: '$599 USD',
        sections: [_tc('cert_hvacr_sec_fundamentals', 'Fundamentos y Electricidad'), _tc('cert_hvacr_sec_air', 'Aire, Psicrometría y Heat Pumps'), _tc('cert_hvacr_sec_commercial', 'Sistemas Comerciales y Chillers'), _tc('cert_hvacr_sec_diagnostics', 'Diagnóstico y Diseño'), _tc('cert_hvacr_sec_industrial', 'Industrial Avanzado')]
      },
      etcard: {
        icon: '🔌', name: 'ET Card — Electrician Trainee',
        desc: _tc('cert_etcard_desc', 'Paquete completo: 694 preguntas de preparación para la tarjeta ET. Cubre Ley de Ohm, NEC, conductores, canalizaciones, circuitos, motores, transformadores, grounding y seguridad eléctrica.'),
        price: '$599', examPrice: '$599 USD',
        sections: [_tc('cert_etcard_sec_ohm', 'Ley de Ohm y Potencia'), _tc('cert_etcard_sec_nec', 'Código Eléctrico Nacional'), _tc('cert_etcard_sec_conductors', 'Conductores'), _tc('cert_etcard_sec_raceways', 'Canalizaciones'), _tc('cert_etcard_sec_branch', 'Circuitos Derivados'), _tc('cert_etcard_sec_service', 'Servicio y Acometida'), _tc('cert_etcard_sec_overcurrent', 'Sobrecorriente'), _tc('cert_etcard_sec_motors', 'Motores'), _tc('cert_etcard_sec_grounding', 'Puesta a Tierra'), _tc('cert_etcard_sec_transformers', 'Transformadores'), _tc('cert_etcard_sec_lighting', 'Iluminación'), _tc('cert_etcard_sec_hazardous', 'Áreas Peligrosas'), _tc('cert_etcard_sec_lowvoltage', 'Baja Tensión'), _tc('cert_etcard_sec_safety', 'Seguridad Eléctrica')]
      },
      natesenior: {
        icon: '🎖️', name: 'NATE Senior Technician',
        desc: _tc('cert_natesenior_desc', 'Paquete completo: 700 preguntas de nivel senior. Cubre AC avanzado, heat pumps, gas furnace, electricidad avanzada, airflow, comercial y diagnóstico avanzado.'),
        price: '$599', examPrice: '$599 USD',
        sections: [_tc('cert_natesenior_sec_ac', 'AC Avanzado'), _tc('cert_natesenior_sec_heatpumps', 'Heat Pumps Avanzado'), _tc('cert_natesenior_sec_furnace', 'Gas Furnace Avanzado'), _tc('cert_natesenior_sec_electrical', 'Electricidad Avanzada'), 'Air Distribution', _tc('cert_natesenior_sec_commercial', 'Comercial/Refrigeración'), _tc('cert_natesenior_sec_diagnostics', 'Diagnóstico Avanzado')]
      }
    };

    let currentCertCourse = null;

    function openCertCourse(courseId) {
      try {
        var course = certCourses[courseId];
        if (!course) { console.error('[Cert] Course not found:', courseId); return; }
        currentCertCourse = courseId;

        var elIcon = document.getElementById('certCourseIcon');
        var elName = document.getElementById('certCourseName');
        var elTitle = document.getElementById('certCourseTitle');
        var elDesc = document.getElementById('certCourseDesc');
        var elPrice = document.getElementById('certExamPrice');
        if (elIcon) elIcon.textContent = course.icon;
        if (elName) elName.textContent = course.name;
        if (elTitle) elTitle.textContent = course.name;
        if (elDesc) {
          var sectionCount = course.sections ? course.sections.length : 8;
          elDesc.textContent = sectionCount + ' secciones de estudio con preguntas de práctica para prepararte a nivel profesional.';
        }
        // Free app — always hide exam request section and pricing
        if (elPrice) elPrice.style.display = 'none';
        var examBtn = document.getElementById('certExamBtn');
        if (examBtn && examBtn.parentElement) examBtn.parentElement.style.display = 'none';
        var examSection = document.getElementById('certExamSection');
        if (examSection) examSection.style.display = 'none';

        var sectionsDiv = document.getElementById('certStudySections');
        if (sectionsDiv) {
          sectionsDiv.innerHTML = course.sections.map(function(s, i) {
            return '<div style="background:rgba(46,204,113,0.15); border:1px solid rgba(46,204,113,0.3); border-radius:8px; padding:8px; font-size:14px; color:#111111;"><span style="color:#2ecc71; font-weight:bold;">' + (i+1) + '.</span> ' + _escHtml(s) + '</div>';
          }).join('');
        }

        if (typeof showScreen === 'function') {
          showScreen('certCourseScreen');
        } else {
          // Fallback: manually show the screen
          document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); s.style.display = 'none'; });
          var target = document.getElementById('certCourseScreen');
          if (target) { target.classList.add('active'); target.style.display = 'flex'; target.style.flexDirection = 'column'; }
        }
      } catch(e) {
        console.error('[Cert] Error opening course:', e);
        window.MaestroDialog.alert({title: 'Error', message: _tc('cert_error_opening', 'Error abriendo certificado. Por favor recarga la pagina.'), kind: 'error'});
      }
    }

    function startCertStudy() {
      // EPA 608 has its own dedicated study system
      if (currentCertCourse === 'epa608') {
        showScreen('epa608StudyScreen');
        return;
      }
      // A2L Safety has its own dedicated study system
      if (currentCertCourse === 'a2l') {
        showScreen('a2lStudyScreen');
        return;
      }
      // OSHA 30 has its own dedicated study system
      if (currentCertCourse === 'osha') {
        showScreen('oshaStudyScreen');
        return;
      }
      // Calefaccion has its own dedicated study system
      if (currentCertCourse === 'calefaccion') {
        showScreen('calefaccionStudyScreen');
        return;
      }
      // Refrigeracion has its own dedicated study system
      if (currentCertCourse === 'hvaccore') {
        showScreen('refriStudyScreen');
        return;
      }
      // NATE & HVAC Excellence has its own dedicated study system
      if (currentCertCourse === 'hvacr') {
        showScreen('nateStudyScreen');
        return;
      }
      // ET Card — Electrician Trainee has its own dedicated study system
      if (currentCertCourse === 'etcard') {
        showScreen('etStudyScreen');
        return;
      }
      // NATE Senior Technician has its own dedicated study system
      if (currentCertCourse === 'natesenior') {
        showScreen('nateSeniorStudyScreen');
        return;
      }
      // Map cert courses to their study specialty in Desarrollo de Habilidades
      var certToSpecialty = {
        epa608: 'refri-industrial',
        osha: 'refri-industrial',
        a2l: 'refri-residencial',
        calefaccion: 'ac-residencial',
        hvaccore: 'ac-residencial',
        hvacr: 'refri-comercial'
      };
      var specialtyId = certToSpecialty[currentCertCourse] || null;
      if (specialtyId) {
        showScreen('studySectionsScreen');
        setTimeout(function() { showSpecialtyCategories(specialtyId); }, 300);
      } else {
        showScreen('studySectionsScreen');
      }
    }

    function requestCertExam() {
      const course = certCourses[currentCertCourse];
      const userName = currentUser ? currentUser.nombre : _tc('cert_student_default', 'Estudiante');
      const userEmail = currentUser ? currentUser.email : '';

      var membershipType = localStorage.getItem('maestroac_membership_type_' + userEmail) || '';
      var membershipDate = localStorage.getItem('maestroac_membership_date_' + userEmail) || '';
      var hasAppPurchase = localStorage.getItem('maestroac_app_purchased_' + userEmail) === 'true';

      // Also check Stripe membership from Supabase
      if (!membershipType && currentMembership && currentMembership.activa) {
        membershipType = currentMembership.tipo;
        membershipDate = currentMembership.fecha_inicio || '';
      }

      // === VALIDATION 2: Minimum membership time ===
      if (membershipDate) {
        var startDate = new Date(membershipDate);
        var now = new Date();
        var monthsActive = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
        
        var requiredMonths = 6;
        if (membershipType === 'basica' || membershipType === '119') {
          requiredMonths = 12;
        }

        if (monthsActive < requiredMonths) {
          var remaining = requiredMonths - monthsActive;
          var _memType = requiredMonths === 12 ? 'Básica ($119)' : _t('cert_current', 'actual');
          window.MaestroDialog.alert({title: 'Atención', message: _t('cert_time_required', 'Tu membresía {type} requiere {months} meses de antigüedad para solicitar examen.').replace('{type}', _memType).replace('{months}', requiredMonths) + '\n\n' + _t('cert_active_time', 'Tiempo activo: {months} meses').replace('{months}', monthsActive) + '\n' + _t('cert_remaining', 'Faltan: {months} meses').replace('{months}', remaining) + '\n\n' + _t('cert_keep_studying', 'Sigue estudiando y preparándote. ¡Tú puedes!'), kind: 'warning'});
          return;
        }
      }

      // === VALIDATION 3: 100% score on ALL levels ===
      var levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      var allPassed = true;
      var failedLevels = [];
      levelOrder.forEach(function(lvl) {
        var lvlProgress = progress[lvl];
        if (!lvlProgress || lvlProgress.completed === 0) {
          allPassed = false;
          failedLevels.push(lvl.charAt(0).toUpperCase() + lvl.slice(1) + ' (' + _tc('cert_not_completed', 'no completado') + ')');
        } else {
          var pct = Math.round((lvlProgress.score / lvlProgress.completed) * 100);
          if (pct < 100) {
            allPassed = false;
            failedLevels.push(lvl.charAt(0).toUpperCase() + lvl.slice(1) + ' (' + pct + '%)');
          }
        }
      });

      if (!allPassed) {
        window.MaestroDialog.alert({title: 'Atención', message: '⚠️ ' + _t('cert_all_levels_required', 'Para solicitar el examen necesitas 100% de aprobación en TODOS los niveles.') + '\n\n' + _t('cert_pending_levels', 'Niveles pendientes:') + '\n• ' + failedLevels.join('\n• ') + '\n\n' + _t('cert_complete_all', 'Completa todos los niveles con 100% antes de solicitar tu examen.'), kind: 'warning'});
        return;
      }

      // === CAPTURE USER INFO ===
      var regDate = currentUser.registrationDate || currentUser.studentIdDate || _t('cert_not_available', 'No disponible');
      var _dateLoc = (typeof _lang !== 'undefined' && _lang === 'en') ? 'en-US' : 'es-MX';
      var regDateFormatted = regDate !== _t('cert_not_available', 'No disponible') ? new Date(regDate).toLocaleDateString(_dateLoc, {year:'numeric',month:'long',day:'numeric'}) : regDate;
      var techNumber = currentUser.technicianNumber || _t('cert_not_assigned', 'No asignado');
      var studentId = currentUser.studentId || _t('cert_not_assigned', 'No asignado');
      var progressSummary = levelOrder.map(function(lvl) {
        var p = progress[lvl];
        return lvl.charAt(0).toUpperCase() + lvl.slice(1) + ': ' + ((p && p.completed > 0) ? Math.round((p.score/p.completed)*100) + '%' : '0%');
      }).join(' | ');

      var subject = encodeURIComponent(_t('cert_exam_subject', 'Solicitud de Examen') + ': ' + course.name);
      var body = encodeURIComponent(
        _t('cert_exam_header', 'SOLICITUD DE EXAMEN DE CERTIFICACIÓN') + '\n' +
        '=====================================\n\n' +
        '👤 ' + _t('cert_name_label', 'Nombre') + ': ' + userName + '\n' +
        '📧 Email: ' + userEmail + '\n' +
        '📞 ' + _t('cert_phone_label', 'Teléfono') + ': ' + (currentUser.telefono || _t('cert_not_registered', 'No registrado')) + '\n' +
        '🏙️ ' + _t('cert_city_label', 'Ciudad') + ': ' + (currentUser.ciudad || _t('cert_not_registered_f', 'No registrada')) + '\n' +
        '🔢 ' + _t('cert_tech_number', 'No. Técnico') + ': ' + techNumber + '\n' +
        '🪪 ' + _t('cert_student_id', 'ID Estudiante') + ': ' + studentId + '\n' +
        '📅 ' + _t('cert_reg_date', 'Fecha de Registro en App') + ': ' + regDateFormatted + '\n' +
        '📊 ' + _t('cert_results', 'Resultados') + ': ' + progressSummary + '\n' +
        '💼 ' + _t('cert_membership_label', 'Membresía') + ': ' + (membershipType || _t('cert_full_app', 'App Completa')) + '\n\n' +
        '📜 ' + _t('cert_exam_requested', 'Examen Solicitado') + ': ' + course.name + '\n' +
        '💰 ' + _t('cert_price', 'Precio') + ': ' + course.examPrice + '\n\n' +
        _t('cert_accept_terms', 'Confirmo que he leído y acepto los términos y condiciones del examen.') + '\n\n' + _t('cert_thanks', 'Gracias.')
      );
      var whatsappMsg = encodeURIComponent(
        'SOLICITUD DE EXAMEN\n' +
        'Nombre: ' + userName + '\n' +
        'Email: ' + userEmail + '\n' +
        'Teléfono: ' + (currentUser.telefono || 'N/A') + '\n' +
        'No. Técnico: ' + techNumber + '\n' +
        'Examen: *' + course.name + '* (' + course.examPrice + ')\n' +
        'Resultados: ' + progressSummary + '\n' +
        'Acepto términos y condiciones.'
      );

      // Stripe payment links per course (from centralized config)
      var payLink = (typeof STRIPE_LINKS !== 'undefined' && STRIPE_LINKS[currentCertCourse]) || '';

      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(17,17,17,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
      modal.innerHTML = `
        <div style="background:#FFFFFF;border-radius:20px;padding:25px;max-width:420px;width:100%;text-align:center;border:1px solid #E7E5DE;max-height:90vh;overflow-y:auto;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">
          <div style="font-size:50px;margin-bottom:10px;">🎓</div>
          <h3 style="color:#0F0F0F;margin-bottom:8px;font-weight:800;">${_tc('cert_request_exam_title', 'Solicitar Examen de Certificación')}</h3>
          <p style="color:#3D3D3A;font-size:15px;font-weight:500;margin-bottom:15px;">${course.name}</p>

          <!-- DISCLAIMER -->
          <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:15px;margin-bottom:15px;text-align:left;">
            <p style="color:#DC2626;font-size:14px;font-weight:700;margin-bottom:8px;">${_tc('cert_terms_title', '⚠️ TÉRMINOS Y CONDICIONES DEL EXAMEN')}</p>
            <p style="color:#3D3D3A;font-size:12px;font-weight:500;line-height:1.6;margin-bottom:8px;">
              ${_tc('cert_terms_intro', 'Al solicitar este examen, confirmo que:')}
            </p>
            <ul style="color:#3D3D3A;font-size:12px;font-weight:500;line-height:1.7;margin:0;padding-left:18px;">
              <li>${_tc('cert_terms_studied', 'He estudiado y completado todos los niveles de la plataforma con un <strong style="color:#059669;">score de 100%</strong> en cada nivel.')}</li>
              <li>${_tc('cert_terms_fail', 'Si <strong style="color:#DC2626;">repruebo</strong> el examen, deberé volver a tomarlo y pagar el <strong>monto total</strong> que cubre los honorarios del Proctor y el costo del examen.')}</li>
              <li>${_tc('cert_terms_pass', 'Una vez <strong style="color:#059669;">aprobado</strong> el examen, mi certificación llegará en <strong>30 días hábiles</strong> a mi domicilio o residencia registrada.')}</li>
              <li>${_tc('cert_terms_membership', 'Cuento con una membresía activa con la antigüedad mínima requerida')}.</li>
            </ul>
          </div>

          <!-- User Info Summary -->
          <div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:12px;padding:12px;margin-bottom:15px;text-align:left;">
            <p style="color:#0F0F0F;font-size:14px;font-weight:700;margin-bottom:8px;">${_tc('cert_your_info', '📋 Tu Información')}</p>
            <p style="color:#0F0F0F;font-size:13px;line-height:1.8;margin:0;font-weight:500;">
              👤 <strong>${_escHtml(userName)}</strong><br>
              📧 ${_escHtml(userEmail)}<br>
              📞 ${_escHtml(currentUser.telefono || _tc('cert_not_registered', 'No registrado'))}<br>
              🔢 ${_escHtml(techNumber)}<br>
              📅 ${_tc('cert_start_label', 'Inicio')}: ${regDateFormatted}<br>
              📊 ${progressSummary}
            </p>
          </div>

          <div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:12px;padding:12px;margin-bottom:15px;">
            <p style="color:#E8591C;font-size:13px;font-weight:700;margin-bottom:8px;">${_tc('cert_step1_title_app', '📋 PASO 1: Confirmar y Programar')}</p>
            <button onclick="window.open('https://wa.me/19096390448?text=${whatsappMsg}','_blank');" style="width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px;background:linear-gradient(135deg,#25D366,#128C7E);color:white;">📱 ${_tc('cert_confirm_whatsapp', 'Confirmar por WhatsApp')}</button>
            <button onclick="openEmailComposer('Techschoolacvolt@gmail.com',decodeURIComponent('${subject}'),decodeURIComponent('${body}'),'📧 ${_tc('cert_confirm_exam', 'Confirmar Examen')}');" style="width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#3498db,#2980b9);color:white;">📧 ${_tc('cert_confirm_email', 'Confirmar por Correo')}</button>
          </div>

          <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:12px;margin-bottom:15px;">
            <p style="color:#059669;font-size:13px;font-weight:700;margin-bottom:8px;">${_tc('cert_step3_title', '📲 PASO 3: Contacta a Soporte por WhatsApp')}</p>
            <p style="color:#3D3D3A;font-size:11px;font-weight:500;margin-bottom:8px;">${_tc('cert_step3_desc', 'Recibe actualizaciones sobre tu examen y conecta con otros estudiantes.')}</p>
            <a href="${typeof WHATSAPP_GROUP!=='undefined'?WHATSAPP_GROUP:'#'}" target="_blank" rel="noopener" style="display:block;width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#25D366,#128C7E);color:white;text-decoration:none;text-align:center;">📱 ${_tc('cert_contact_support', 'Contactar Soporte')}</a>
          </div>

          <p style="color:#6B6B66;font-size:11px;font-weight:500;margin-bottom:15px;">${_tc('cert_exam_schedule_msg', 'Te contactaremos para programar tu examen.')}</p>
          <button onclick="this.closest('div').parentElement.remove();" style="width:100%;padding:12px;border:1px solid #E7E5DE;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;background:#FFFFFF;color:#0F0F0F;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">${_tc('cert_cancel', 'Cancelar')}</button>
        </div>
      `;
      document.body.appendChild(modal);
      // Log exam request to Supabase
      logExamRequest(course.name, course.examPrice, userName, userEmail, techNumber, studentId, progressSummary);
    }

    // Quiz integrity: track answer hashes to detect DevTools manipulation
    var _quizAnswerHashes = [];
    function _hashAnswer(qIdx, sel, correct, ts) {
      var s = '' + qIdx + '_' + sel + '_' + correct + '_' + ts;
      var h = 0;
      for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; }
      return h;
    }

    function startQuickQuiz() {
      // Check if there's a resumable quiz state for principiante
      const savedState = loadLastQuizState();
      if (savedState && savedState.levelKey === 'principiante' && savedState.questionIndex > 0) {
        showResumePrompt('principiante', savedState);
        return;
      }

      currentLevel = 'principiante';
      var quizPool = [...questions.principiante];
      // Strip correct/explanation from quiz questions (server-side scoring handles verification)
      currentQuestions = shuffleArray(quizPool.map(function(q, idx) {
        var copy = Object.assign({}, q);
        copy._originalIndex = idx;
        delete copy.correct;
        delete copy.explanation;
        return copy;
      }));
      currentQuestionIndex = 0;
      correctAnswers = 0;
      serverVerifiedCount = 0; // Track how many answers were verified server-side
      _quizAnswerHashes = []; // Reset integrity tracker
      startTime = Date.now();
      // Track quiz opened as lastActivity
      updateLastActivity('quiz', 'principiante', null, 'principiante', 'quizScreen');
      showScreen('quizScreen');
      showQuestion();
    }

    function showQuestion() {
      const q = currentQuestions[currentQuestionIndex];
      document.getElementById('questionCount').textContent = `${currentQuestionIndex + 1}/${currentQuestions.length}`;
      document.getElementById('questionCategory').textContent = q.category;
      document.getElementById('questionText').textContent = q.q;

      // Update study time indicator
      updateStudyTimeIndicator();
      
      // Actualizar contadores de estado
      updateQuizStatusCounters();

      const container = document.getElementById('optionsContainer');
      container.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      // Shuffle options only once — reuse cached order when revisiting
      if (!q._shuffledIndices) {
        const indices = [0, 1, 2, 3];
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        q._shuffledIndices = indices;
      }
      const indices = q._shuffledIndices;

      indices.forEach((origIdx, displayIdx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `<div class="option-letter">${letters[displayIdx]}</div><span>${_escHtml(q.options[origIdx])}</span>`;
        div.onclick = () => selectAnswer(displayIdx);
        container.appendChild(div);
      });

      document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
      
      // Mostrar botones de navegación siempre
      var _nb = document.getElementById('nextBtn');
      if (_nb) _nb.style.display = 'block';
      // Anterior solo si no es la primera pregunta
      var _pb = document.getElementById('prevBtn');
      if (_pb) _pb.style.display = currentQuestionIndex > 0 ? 'block' : 'none';

      // Update lastQuizState when question view loads
      updateLastQuizState();
    }

    function updateStudyTimeIndicator() {
      // Create indicator if not exists
      var indicator = document.getElementById('studyTimeIndicator');
      if (!indicator) {
        var header = document.querySelector('.question-header');
        if (header) {
          indicator = document.createElement('div');
          indicator.id = 'studyTimeIndicator';
          indicator.style.cssText = 'font-size:13px;padding:4px 10px;border-radius:12px;background:rgba(39,174,96,0.2);color:#27ae60;';
          header.appendChild(indicator);
        }
      }
      
      if (indicator && studyStartTime) {
        var now = new Date();
        var minutesStudied = Math.floor((now - studyStartTime) / 60000);
        var remaining = STUDY_LIMIT_MINUTES - minutesStudied;
        
        if (remaining > 10) {
          indicator.textContent = '⏱️ ' + remaining + ' min';
          indicator.style.background = 'rgba(39,174,96,0.2)';
          indicator.style.color = '#27ae60';
        } else if (remaining > 0) {
          indicator.textContent = '⚠️ ' + remaining + ' min';
          indicator.style.background = 'rgba(231,76,60,0.2)';
          indicator.style.color = '#e74c3c';
        } else {
          indicator.textContent = '🛑 Break';
          indicator.style.background = 'rgba(231,76,60,0.3)';
          indicator.style.color = '#e74c3c';
        }
      }
    }

    async function selectAnswer(displayIndex) {
      const q = currentQuestions[currentQuestionIndex];
      const options = document.querySelectorAll('.option');
      const originalIndex = q._shuffledIndices[displayIndex];

      // Disable all options immediately while verifying
      options.forEach(function(opt) {
        opt.classList.add('disabled');
        opt.onclick = null;
      });

      // Server-side verification
      var isCorrect = false;
      var correctOriginal = null;
      var explanation = '';
      var serverVerified = false;

      try {
        var SB_BASE = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
        var SB_KEY_VAL = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
        var res = await fetch(SB_BASE + '/functions/v1/verify-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_KEY_VAL },
          body: JSON.stringify({
            system: 'quiz',
            level: currentLevel,
            questionIndex: typeof q._originalIndex === 'number' ? q._originalIndex : currentQuestionIndex,
            selectedAnswer: originalIndex
          })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var result = await res.json();
        isCorrect = !!result.isCorrect;
        correctOriginal = typeof result.correctIndex === 'number' ? result.correctIndex : null;
        explanation = result.explanation || '';
        serverVerified = true;
      } catch(e) {
        console.warn('[MaestroAC] verify-answer failed, falling back to client-side:', e);
        // Fallback: use original question bank for offline verification
        var origQ = null;
        if (questions && questions[currentLevel] && typeof q._originalIndex === 'number') {
          origQ = questions[currentLevel][q._originalIndex];
        }
        if (origQ && typeof origQ.correct === 'number') {
          isCorrect = (originalIndex === origQ.correct);
          correctOriginal = origQ.correct;
          explanation = origQ.explanation || '';
        } else {
          // Last resort: cannot verify — treat as incorrect
          isCorrect = false;
          correctOriginal = null;
          explanation = '';
        }
      }

      // Store correctIndex back on the question object for review screen
      q.correct = correctOriginal;
      q.explanation = explanation;

      var correctDisplayIndex = correctOriginal !== null ? q._shuffledIndices.indexOf(correctOriginal) : -1;

      // Marcar pregunta como contestada, guardar respuesta seleccionada
      questionStatus[currentQuestionIndex] = 'answered';
      if (!window._quizAnswerLog) window._quizAnswerLog = {};
      window._quizAnswerLog[currentQuestionIndex] = { selected: originalIndex, correct: correctOriginal, isCorrect: isCorrect };
      updateQuizStatusCounters();

      options.forEach(function(opt, i) {
        if (i === correctDisplayIndex) opt.classList.add('correct');
        else if (i === displayIndex && !isCorrect) opt.classList.add('incorrect');
      });

      const feedback = document.getElementById('feedback');
      if (isCorrect) {
        correctAnswers++;
        if (serverVerified) serverVerifiedCount++;
        feedback.classList.add('correct');
        document.getElementById('feedbackTitle').textContent = '✓ ' + _tc('cert_correct', '¡Correcto!');
      } else {
        feedback.classList.add('incorrect');
        document.getElementById('feedbackTitle').textContent = '✗ ' + _tc('cert_incorrect', 'Incorrecto');
      }
      // Record integrity hash for this answer
      _quizAnswerHashes.push(_hashAnswer(currentQuestionIndex, originalIndex, isCorrect ? 1 : 0, Date.now()));

      document.getElementById('feedbackText').textContent = explanation;
      feedback.classList.add('show');
      var _nb2 = document.getElementById('nextBtn');
      if (_nb2) _nb2.style.display = 'block';
      // Track quiz question answered as lastActivity
      updateLastActivity('quiz', currentLevel, null, currentLevel, 'quizScreen');
      logActivity('answer', currentLevel + ' - ' + (isCorrect ? 'correct' : 'incorrect'));
      // Update lastQuizState when user answers a question
      updateLastQuizState();

      // SAVE PROGRESS AFTER EACH ANSWER - Never lose progress!
      saveQuizProgressPartial();
    }

    function nextQuestion() {
      // Si no contestó, marcar como flagged
      if (!questionStatus[currentQuestionIndex] || questionStatus[currentQuestionIndex] === 'unanswered') {
        questionStatus[currentQuestionIndex] = 'flagged';
      }
      
      currentQuestionIndex++;
      if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
      } else {
        // Update lastQuizState when user clicks "Siguiente"
        updateLastQuizState();
        showQuestion();
      }
    }
    
    function prevQuestion() {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateLastQuizState();
        showQuestion();
      }
    }
    
    function updateQuizStatusCounters() {
      let answered = 0;
      let flagged = 0;
      
      for (let key in questionStatus) {
        if (questionStatus[key] === 'answered') {
          answered++;
        } else if (questionStatus[key] === 'flagged') {
          flagged++;
        }
      }
      
      document.getElementById('answeredCount').textContent = answered;
      document.getElementById('flaggedCount').textContent = flagged;
    }

    function endQuiz() {
      const total = currentQuestions.length;

      // INTEGRITY CHECK: Verify answer count matches tracked hashes
      // Prevents DevTools manipulation of correctAnswers/serverVerifiedCount
      var _answeredCount = _quizAnswerHashes.length;
      if (_answeredCount > 0 && correctAnswers > _answeredCount) {
        console.warn('[Cert] Integrity check failed: correctAnswers (' + correctAnswers + ') > tracked answers (' + _answeredCount + '). Clamping.');
        correctAnswers = Math.min(correctAnswers, _answeredCount);
      }
      if (serverVerifiedCount > _answeredCount) {
        serverVerifiedCount = Math.min(serverVerifiedCount, _answeredCount);
      }

      // INTEGRITY CHECK: Verify elapsed time is reasonable (min 2 seconds per question)
      var _elapsedMs = Date.now() - startTime;
      if (_elapsedMs < total * 2000 && total > 5) {
        console.warn('[Cert] Integrity check: quiz completed too fast (' + Math.floor(_elapsedMs/1000) + 's for ' + total + ' questions)');
        // Don't block results display, but downgrade server verified count
        serverVerifiedCount = 0;
      }

      const percentage = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
      const elapsed = Math.floor(_elapsedMs / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;

      // Update progress (ensure object exists)
      if (!progress[currentLevel]) progress[currentLevel] = { score: 0, completed: 0, total: 0 };
      progress[currentLevel].completed = total;
      progress[currentLevel].score = correctAnswers;
      saveProgress();
      renderLevels();

      // Generate certificate if passed (80% or higher)
      // Server verification: confirm score with server before issuing certificate
      if (percentage >= 80 && serverVerifiedCount >= Math.floor(total * 0.8)) {
        generateCertificate(currentLevel, percentage);
      } else if (percentage >= 80) {
        console.warn('[Cert] Score qualifies but insufficient server-verified answers (' + serverVerifiedCount + '/' + total + ')');
      }

      // Show results
      let icon, title, subtitle;
      if (percentage >= 90) { icon = '🏆'; title = _tc('cert_excellent', '¡Excelente!'); subtitle = _tc('cert_mastered', 'Dominas este nivel'); }
      else if (percentage >= 80) { icon = '⭐'; title = _tc('cert_very_good', '¡Muy Bien!'); subtitle = _tc('cert_passed_quiz', 'Aprobaste el quiz — ¡Certificado obtenido!'); }
      else if (percentage >= 60) { icon = '📚'; title = _tc('cert_keep_practicing', 'Sigue Practicando'); subtitle = _tc('cert_need_80', 'Necesitas 80% para certificarte'); }
      else { icon = '💪'; title = _tc('cert_dont_give_up', 'No Te Rindas'); subtitle = _tc('cert_review_material', 'Repasa el material'); }

      document.getElementById('resultsIcon').textContent = icon;
      document.getElementById('resultsTitle').textContent = title;
      document.getElementById('resultsSubtitle').textContent = subtitle;
      document.getElementById('scoreValue').textContent = percentage + '%';
      document.getElementById('correctCount').textContent = correctAnswers;
      document.getElementById('incorrectCount').textContent = total - correctAnswers;
      document.getElementById('timeSpent').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Animate circle
      const circle = document.getElementById('scoreCircle');
      const offset = 490 - (percentage / 100) * 490;
      if (circle) {
        circle.style.stroke = percentage >= 70 ? '#27ae60' : percentage >= 50 ? '#f39c12' : '#e74c3c';
        setTimeout(() => circle.style.strokeDashoffset = offset, 100);
      }

      // Record quiz completion time for retake cooldown
      localStorage.setItem('maestroac_quiz_last_' + currentLevel, String(Date.now()));

      // Clear lastQuizState since quiz is completed
      clearLastQuizState();

      // Clear partial progress since quiz is completed
      clearPartialProgress();

      // Save quiz attempt to Supabase (includes server-verified count for audit trail)
      supabaseSaveQuizAttempt({
        nivel: currentLevel,
        totalQuestions: total,
        correctAnswers: correctAnswers,
        wrongAnswers: total - correctAnswers,
        porcentaje: percentage,
        tiempoSegundos: elapsed,
        aprobado: percentage >= 80,
        serverVerified: serverVerifiedCount
      });

      // Update user nivel in Supabase
      const nivelOrder = ['nuevo', 'principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      const currentIdx = nivelOrder.indexOf(currentLevel);
      if (percentage >= 80 && currentIdx > 0) {
        supabaseUpdateNivel(currentLevel);
      }

      showScreen('resultsScreen');
    }

    function generateCertificate(levelId, score) {
      const level = levels.find(l => l.id === levelId);
      if (!level) { console.error('[Cert] Level not found:', levelId); return; }
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

      // Check if certificate already exists for this level
      const existingIndex = certificates.findIndex(c => c.levelId === levelId);

      // Reuse existing certId if updating, generate new one only for first cert
      let certId;
      if (existingIndex >= 0) {
        certId = certificates[existingIndex].certificateId;
      } else {
        const randBytes = new Uint8Array(4);
        crypto.getRandomValues(randBytes);
        const randHex = Array.from(randBytes, function(b) { return b.toString(16).padStart(2, '0'); }).join('').toUpperCase();
        certId = `CERT-${levelId.toUpperCase().substring(0,3)}-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${randHex}`;
      }

      if (existingIndex >= 0) {
        // Update existing certificate only if new score is higher
        if (score > certificates[existingIndex].score) {
          certificates[existingIndex] = {
            levelId: levelId,
            levelName: level.name,
            levelIcon: level.icon,
            levelColor: level.color,
            score: score,
            date: dateStr,
            dateRaw: now.toISOString(),
            certificateId: certId,
            userName: currentUser ? currentUser.nombre : _tc('cert_technician_default', 'Técnico HVAC')
          };
        } else {
          // Score not higher — no update needed, skip save/notification
          return;
        }
      } else {
        // Add new certificate
        certificates.push({
          levelId: levelId,
          levelName: level.name,
          levelIcon: level.icon,
          levelColor: level.color,
          score: score,
          date: dateStr,
          dateRaw: now.toISOString(),
          certificateId: certId,
          userName: currentUser ? currentUser.nombre : _tc('cert_technician_default', 'Técnico HVAC')
        });
      }

      saveCertificates();

      // Get totalQuestions from progress if available
      const totalQuestions = (progress[levelId] && progress[levelId].completed) ? progress[levelId].completed : 0;

      // Save to Supabase cloud
      supabaseSaveCertificate({
        nivel: levelId, score: score, percentage: score,
        totalQuestions: totalQuestions, certificateNumber: certId, date: now.toISOString()
      });
      
      // Notification: Level completed
      const _userName = (currentUser && currentUser.nombre) ? String(currentUser.nombre).split(' ')[0] : _tc('cert_technician_short', 'Técnico');
      const _lvlNames = { principiante: _tc('level_principiante', 'Principiante'), intermedio: _tc('level_intermedio', 'Intermedio'), avanzado: _tc('level_avanzado', 'Avanzado'), elite: _tc('level_elite', 'Elite'), platino: _tc('level_platino', 'Platino') };
      addNotification('level', '⭐ ' + _tc('cert_notif_completed_prefix', '¡') + _userName + ' ' + _tc('cert_notif_completed', 'completó Nivel') + ' ' + (_lvlNames[levelId] || levelId) + ' ' + _tc('cert_with', 'con') + ' ' + score + '%!', '🏆');
      
      // Show congratulations modal with confetti & QR
      showCertCongratsModal(levelId, level.name, level.icon, score, certId);
    }

    // ===== CERTIFICATE CONGRATULATIONS MODAL =====
    function showCertCongratsModal(levelId, levelName, levelIcon, score, certId) {
      var userName = (currentUser && currentUser.nombre) ? currentUser.nombre : _tc('cert_technician_default', 'Técnico HVAC');
      var firstName = (currentUser && currentUser.nombre) ? String(currentUser.nombre).split(' ')[0].toUpperCase() : _tc('cert_technician_upper', 'TÉCNICO');
      var verifyUrl = 'https://maestrohvacr.com/verify/' + certId;
      var shareText = encodeURIComponent('🏆 ' + _tc('cert_share_text', '¡Obtuve mi Certificado HVAC Nivel') + ' ' + levelName + ' ' + _tc('cert_with', 'con') + ' ' + score + '%! ' + _tc('cert_share_verifiable', 'Verificable en maestrohvacr.com') + ' | @nivel33podcast #HVAC #MaestroACVOLT #Nivel33');
      var shareUrl = encodeURIComponent(verifyUrl);
      var confettiHTML = '';
      var colors = ['#f39c12','#e74c3c','#27ae60','#3498db','#9b59b6','#FFD700'];
      for (var i = 0; i < 30; i++) {
        confettiHTML += '<div class="confetti-piece" style="left:'+Math.round(Math.random()*100)+'%;animation-delay:'+Math.round(Math.random()*20)/10+'s;background:'+colors[i%6]+';width:'+(6+Math.round(Math.random()*8))+'px;height:'+(6+Math.round(Math.random()*8))+'px;border-radius:'+(Math.random()>0.5?'50%':'2px')+';"></div>';
      }
      var modal = document.createElement('div');
      modal.className = 'cert-congrats-modal';
      modal.id = 'certCongratsModal';
      modal.innerHTML = confettiHTML +
        '<div style="background:#FFFFFF;border-radius:20px;padding:30px;max-width:420px;width:100%;text-align:center;border:2px solid #FFD700;max-height:90vh;overflow-y:auto;position:relative;z-index:1;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
          '<div style="font-size:70px;margin-bottom:5px;">🎉</div>' +
          '<h2 style="color:#0F0F0F;margin-bottom:5px;font-size:24px;font-weight:800;">' + _tc('cert_congrats_prefix', '¡FELICIDADES') + ' ' + _escHtml(firstName) + '!</h2>' +
          '<p style="color:#3D3D3A;font-size:15px;font-weight:500;margin-bottom:15px;">' + _tc('cert_you_completed', 'Completaste') + ' <strong style="color:#E8591C;font-weight:700;">' + _tc('cert_level', 'Nivel') + ' ' + _escHtml(levelName) + '</strong> ' + _tc('cert_with', 'con') + ' <strong style="color:#059669;font-weight:700;">' + score + '%</strong></p>' +
          '<div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:15px;padding:15px;margin-bottom:15px;">' +
            '<p style="color:#0F0F0F;font-size:13px;font-weight:700;margin-bottom:8px;">🏆 Certificado Verificable</p>' +
            '<p style="color:#3D3D3A;font-size:13px;font-weight:500;margin-top:6px;">ID: ' + certId + '</p>' +
            '<p style="color:#6B6B66;font-size:13px;font-weight:500;">Verificar en: maestrohvacr.com/verify/' + certId + '</p>' +
          '</div>' +
          '<p style="color:#E8591C;font-size:14px;font-weight:700;margin-bottom:10px;">🔥 ' + _tc('cert_share_achievement', '¡Comparte tu logro!') + '</p>' +
          '<div class="share-cert-btns">' +
            '<button class="share-cert-btn whatsapp" onclick="shareCert(' + "'" + 'whatsapp' + "'" + ',' + "'" + shareText + "'" + ',' + "'" + shareUrl + "'" + ')">📱 WhatsApp</button>' +
            '<button class="share-cert-btn facebook" onclick="shareCert(' + "'" + 'facebook' + "'" + ',' + "'" + shareText + "'" + ',' + "'" + shareUrl + "'" + ')">📘 Facebook</button>' +
            '<button class="share-cert-btn twitter" onclick="shareCert(' + "'" + 'twitter' + "'" + ',' + "'" + shareText + "'" + ',' + "'" + shareUrl + "'" + ')">🐦 Twitter</button>' +
            '<button class="share-cert-btn copy-link" onclick="copyCertLink(' + "'" + verifyUrl + "'" + ')">🔗 Copiar</button>' +
          '</div>' +
          '<button onclick="closeCertCongratsModal()" style="width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;margin-top:15px;">🏅 ' + _tc('cert_view_my_certs', 'Ver Mis Certificados') + '</button>' +
          '<button onclick="document.getElementById(' + "'" + 'certCongratsModal' + "'" + ').remove();" style="width:100%;padding:10px;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#6B6B66;margin-top:8px;">' + _tc('cert_continue', 'Continuar') + ' →</button>' +
        '</div>';
      document.body.appendChild(modal);
      setTimeout(function() { var ps = modal.querySelectorAll('.confetti-piece'); ps.forEach(function(p){p.remove();}); }, 4000);
    }
    function closeCertCongratsModal() { var m = document.getElementById('certCongratsModal'); if(m) m.remove(); showCertificates('resultsScreen'); }
    function shareCert(platform, encodedText, encodedUrl) {
      var text = decodeURIComponent(encodedText), url = decodeURIComponent(encodedUrl), shareUrl = '';
      if (platform==='whatsapp') shareUrl='https://wa.me/?text='+encodeURIComponent(text+'\n'+url);
      else if (platform==='facebook') shareUrl='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);
      else if (platform==='twitter') shareUrl='https://twitter.com/intent/tweet?text='+encodedText+'&url='+encodedUrl;
      else if (platform==='linkedin') shareUrl='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url);
      if (shareUrl) window.open(shareUrl, '_blank');
    }
    function copyCertLink(url) { if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){window.showToast('✅ ' + _tc('cert_link_copied', 'Link copiado') + ': '+url, 'success');});}else{prompt(_tc('cert_copy_link', 'Copia este link') + ':',url);} }

    function retryQuiz() {
      // Enforce retake cooldown: 2-minute wait between quiz attempts on same level
      var _retakeKey = 'maestroac_quiz_last_' + currentLevel;
      var _lastAttempt = parseInt(localStorage.getItem(_retakeKey) || '0', 10);
      var _cooldownMs = 2 * 60 * 1000; // 2 minutes
      var _elapsed = Date.now() - _lastAttempt;
      if (_lastAttempt && _elapsed < _cooldownMs) {
        var _remaining = Math.ceil((_cooldownMs - _elapsed) / 1000);
        window.showToast(_tc('cert_retake_wait', 'Espera') + ' ' + _remaining + ' ' + _tc('cert_seconds', 'segundos') + ' ' + _tc('cert_before_retry', 'antes de reintentar el quiz.'), 'warning');
        return;
      }
      localStorage.setItem(_retakeKey, String(Date.now()));
      startQuiz(currentLevel);
    }

    function _checkResumeQuizCard() {
      var card = document.getElementById('resumeQuizCard');
      if (!card) return;
      try {
        var saved = JSON.parse(localStorage.getItem('tecnico_lastQuizState') || 'null');
        if (saved && (saved.levelKey || saved.levelId) && saved.questionIndex < saved.totalQuestions) {
          var lvl = levels.find(function(l) { return l.id === (saved.levelKey || saved.levelId); }) || levels.find(function(l) { return l.name === saved.levelId; });
          var name = lvl ? lvl.name : (saved.levelId || saved.levelKey);
          var info = document.getElementById('resumeQuizInfo');
          if (info) info.textContent = name + ' — ' + _tc('cert_question', 'Pregunta') + ' ' + (saved.questionIndex + 1) + '/' + saved.totalQuestions;
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      } catch(e) { card.style.display = 'none'; }
    }


    function showCertificates(fromScreen) {
      previousScreen = fromScreen;
      renderCertificates();
      showScreen('certificatesScreen');
    }

    function goBackFromCertificates() {
      showScreen(previousScreen);
    }

    // Mi Perfil Functions — profilePreviousScreen already declared in profile.js


    function renderCertificates() {
      const container = document.getElementById('certificatesList');
      if (!container) return;
      container.innerHTML = '';

      // Sincroniza con el servidor una vez por sesión: sube los del teléfono
      // (respaldo) y baja los del servidor → reaparecen y quedan seguros. Al
      // terminar re-renderiza. Mario 2026-06-05 (sync rota desde marzo por RLS).
      if (!window._certSyncDone && typeof window.maestroSyncCerts === 'function') {
        window._certSyncDone = true;
        window.maestroSyncCerts().then(function () { try { renderCertificates(); } catch (_) {} });
      }

      if (certificates.length === 0) {
        container.innerHTML = '<div class="no-certificates"><div class="no-certificates-icon">🎓</div><p class="no-certificates-text">' + _tc('cert_no_certs', 'Aún no tienes certificados.') + '<br><br>' + _tc('cert_complete_quizzes', 'Completa los quizzes con un 80% o más para obtener tu certificado de cada nivel.') + '</p></div>';
        return;
      }

      // Sort certificates by level order
      const levelOrder = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
      const sortedCerts = [...certificates].sort((a, b) => {
        return levelOrder.indexOf(a.levelId) - levelOrder.indexOf(b.levelId);
      });

      // Check approval status from Supabase for each cert
      var approvalCache = {};
      var hasMembership = true;
      var checkPromises = [];

      if (supabaseClient && supabaseUserId) {
        checkPromises.push(
          supabaseClient.from('certificates').select('nivel,cert_status,certificate_number').eq('user_id', supabaseUserId)
          .then(function(res) {
            (res.data || []).forEach(function(c) {
              approvalCache[c.nivel] = c.cert_status || 'pending';
            });
          }).catch(function() {})
        );
      }

      Promise.all(checkPromises).then(function() {
        sortedCerts.forEach(cert => {
          var certApproval = hasMembership ? 'approved' : (approvalCache[cert.levelId] || 'pending');
          var isApproved = certApproval === 'approved';
          var isDenied = certApproval === 'denied';
          
          var statusBadge = '';
          var lockOverlay = '';
          var shareButtons = '';
          var printButton = '';
          
          if (isApproved) {
            statusBadge = '<span style="position:absolute;top:10px;right:10px;background:#27ae60;color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;">✅ ' + _tc('cert_approved', 'APROBADO') + '</span>';
            shareButtons = '<div class="share-cert-btns" style="margin-bottom:10px;">' +
              '<button aria-label="Compartir en WhatsApp" class="share-cert-btn whatsapp" onclick="shareCert(\'whatsapp\',\'' + encodeURIComponent('🏆 Certificado HVAC Nivel ' + cert.levelName + ' - ' + cert.score + '% | #HVAC #Nivel33') + '\',\'' + encodeURIComponent('https://maestrohvacr.com/verify/' + cert.certificateId) + '\')">📱</button>' +
              '<button aria-label="Compartir en Facebook" class="share-cert-btn facebook" onclick="shareCert(\'facebook\',\'\',\'' + encodeURIComponent('https://maestrohvacr.com/verify/' + cert.certificateId) + '\')">📘</button>' +
              '<button aria-label="Compartir en Twitter" class="share-cert-btn twitter" onclick="shareCert(\'twitter\',\'' + encodeURIComponent('🏆 Certificado HVAC Nivel ' + cert.levelName + ' - ' + cert.score + '% | @nivel33podcast #HVAC') + '\',\'' + encodeURIComponent('https://maestrohvacr.com/verify/' + cert.certificateId) + '\')">🐦</button>' +
              '<button aria-label="Copiar enlace" class="share-cert-btn copy-link" onclick="copyCertLink(\'https://maestrohvacr.com/verify/' + cert.certificateId + '\')">🔗</button>' +
            '</div>';
            var _esqJs = function(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n'); };
            printButton = '<button class="btn btn-print-cert" onclick="printCertificate(\'' + _esqJs(cert.levelId) + '\', \'' + _esqJs(cert.levelName) + '\', \'' + _esqJs(cert.levelIcon) + '\', \'' + _esqJs(cert.userName) + '\', ' + (isFinite(Number(cert.score)) ? Number(cert.score) : 0) + ', \'' + _esqJs(cert.date) + '\', \'' + _esqJs(cert.certificateId) + '\')">🖨️ ' + _tc('cert_print', 'Imprimir Certificado') + '</button>';
          } else if (isDenied) {
            statusBadge = '<span style="position:absolute;top:10px;right:10px;background:#e74c3c;color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;">❌ ' + _tc('cert_not_approved', 'NO APROBADO') + '</span>';
            lockOverlay = '<div style="background:rgba(231,76,60,0.08);border:1px solid rgba(231,76,60,0.2);border-radius:10px;padding:12px;margin:10px 0;text-align:center;">' +
              '<p style="color:#e74c3c;font-size:13px;font-weight:bold;">' + _tc('cert_denied', 'Certificado no aprobado') + '</p>' +
              '<p style="color:#111111;font-size:14px;">' + _tc('cert_contact_maestro', 'Contacta al Maestro Mario para más información.') + '</p></div>';
          } else {
            statusBadge = '<span style="position:absolute;top:10px;right:10px;background:#f39c12;color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;">⏳ ' + _tc('cert_pending', 'PENDIENTE') + '</span>';
            lockOverlay = '<div style="background:rgba(243,156,18,0.08);border:1px solid rgba(243,156,18,0.2);border-radius:10px;padding:12px;margin:10px 0;text-align:center;">' +
              '<p style="color:#f39c12;font-size:13px;font-weight:bold;">🔒 ' + _tc('cert_pending_approval', 'Certificado pendiente de aprobación') + '</p>' +
              '<p style="color:#111111;font-size:14px;">' + _tc('cert_pending_desc', 'El Maestro Mario debe aprobar tu certificado para que puedas compartirlo e imprimirlo.') + '</p>' +
              '<p style="color:#111111;font-size:13px;margin-top:6px;">' + _tc('cert_send_proof', 'Si ya pagaste, envía tu comprobante por WhatsApp o correo.') + '</p></div>';
          }

          const card = document.createElement('div');
          card.className = 'certificate-card';
          card.style.position = 'relative';
          card.innerHTML = statusBadge +
            '<span class="certificate-earned-badge">' + _tc('cert_approved', 'APROBADO') + '</span>' +
            '<div class="certificate-badge">' + _escHtml(cert.levelIcon) + '</div>' +
            '<div class="certificate-level">' + _tc('cert_level', 'Nivel') + ' ' + _escHtml(cert.levelName) + '</div>' +
            '<div class="certificate-title">' + _tc('cert_competence_title', 'Certificado de Competencia HVAC') + '</div>' +
            '<div style="text-align:center; font-size:14px; color:#3D3D3A; font-weight:500; margin-bottom:10px;">' + _tc('cert_awarded_to', 'Otorgado a') + ': <strong style="color:#0F0F0F; font-weight:700;">' + _escHtml(cert.userName) + '</strong></div>' +
            '<div class="certificate-details">' +
              '<div class="certificate-detail"><div class="certificate-detail-label">' + _tc('cert_score', 'Puntuación') + '</div><div class="certificate-detail-value" style="color:' + (cert.score >= 90 ? '#ffd700' : '#27ae60') + '">' + _escHtml(String(cert.score)) + '%</div></div>' +
              '<div class="certificate-detail"><div class="certificate-detail-label">' + _tc('cert_date', 'Fecha') + '</div><div class="certificate-detail-value" style="font-size:13px;">' + _escHtml(cert.date) + '</div></div>' +
            '</div>' +
            '<div class="certificate-id">ID: ' + _escHtml(cert.certificateId) + '</div>' +
            (isApproved ? '<div style="margin:10px auto;font-size:11px;color:#6B6B66;">Verificar en: maestrohvacr.com/verify/' + _escHtml(cert.certificateId) + '</div>' : '') +
            lockOverlay +
            shareButtons +
            printButton;
          container.appendChild(card);
        });
      });
    }

    function printCertificate(levelId, levelName, levelIcon, userName, score, date, certId) {
      executeCertPrint(levelId, levelName, levelIcon, userName, score, date, certId);
    }

    async function redeemCertCode() {
      const input = document.getElementById('certCodeInput');
      const msg = document.getElementById('certCodeMsg');
      if (!input || !msg) return;
      const code = input.value.trim().toUpperCase();
      if (!code || code.length < 4) {
        msg.style.display = 'block';
        msg.style.color = '#e74c3c';
        msg.textContent = '❌ ' + _tc('cert_enter_valid_code', 'Ingresa un código válido');
        return;
      }
      if (!currentUser || !currentUser.email) return;
      // Validate code against Supabase access_codes table
      if (supabaseClient) {
        try {
          var { data, error } = await supabaseClient
            .from('access_codes')
            .select('*')
            .eq('code', code)
            .eq('used', false)
            .limit(1);
          if (!data || data.length === 0) {
            msg.style.display = 'block';
            msg.style.color = '#e74c3c';
            msg.textContent = '❌ ' + _tc('cert_code_invalid', 'Código inválido o ya utilizado');
            return;
          }
          // Mark code as used
          await supabaseClient.from('access_codes').update({
            used: true, used_at: new Date().toISOString(), used_by: currentUser.email
          }).eq('code', code);
        } catch(e) {
          // If access_codes table doesn't exist yet, fall through
          console.warn('[Certs] access_codes check:', e);
        }
      }
      localStorage.setItem('maestroac_cert_purchased_' + currentUser.email, 'true');
      msg.style.display = 'block';
      msg.style.color = '#2ecc71';
      msg.textContent = '✅ ' + _tc('cert_unlocked', '¡Certificados desbloqueados!');
      if (typeof addNotification === 'function') addNotification('payment', '💳 ' + _tc('cert_unlocked_notif', '¡Certificados desbloqueados! Ya puedes imprimir todos tus certificados.'), '🏅');
      setTimeout(() => {
        const modal = input.closest('div[style*="position:fixed"]');
        if (modal) modal.remove();
      }, 1500);
    }

    // ── Nombre real para el certificado (port del fix de la app) ──────────
    // Estudiantes de acvoltschool.com con username/correo numérico imprimían su
    // NÚMERO de usuario en vez del nombre. Resolvemos: nombre real → server →
    // formulario. Mario 2026-06-05 (Jose Manuel Doroteo, Jose Manuel Bouchot).
    function _isRealName(s) {
      if (!s) return false;
      s = String(s).trim();
      if (!s || /@/.test(s)) return false;
      // Debe ser nombre + apellido (con espacio). Un token de una palabra como
      // "lozanojuanmartinez74" es el USERNAME/correo, NO nombre real. Mario 2026-06-05.
      if (s.indexOf(' ') === -1) return false;
      var letters = (s.match(/[A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g) || []).length;
      var digits = (s.match(/\d/g) || []).length;
      if (letters < 3) return false;      // números puros / "0001"
      if (digits > letters) return false; // códigos id como "USR-9999"
      return true;
    }
    function _certEmail() {
      try { return (typeof currentUser !== 'undefined' && currentUser && currentUser.email) || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; }
    }
    function _certRealName() {
      var n = '';
      try { var tu = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); n = (tu.nombre || '').trim(); } catch (_) {}
      if (!_isRealName(n)) return '';
      return n;
    }
    function _resolveCertName(rawName, cb) {
      if (_isRealName(rawName)) return cb(rawName);
      var localN = '';
      try { var tu = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); localN = tu.nombre || ''; } catch (_) {}
      if (_isRealName(localN)) return cb(localN);
      var email = _certEmail();
      if (!email || !/@/.test(email) || typeof supabaseClient === 'undefined' || !supabaseClient || !supabaseClient.from) { return cb(''); }
      try {
        supabaseClient.from('users').select('nombre').eq('email', email).limit(1).then(function (res) {
          var rows = res && res.data;
          var n = (rows && rows[0] && rows[0].nombre) ? rows[0].nombre : '';
          if (_isRealName(n)) {
            try { var tu2 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); tu2.nombre = n; localStorage.setItem('tecnico_user', JSON.stringify(tu2)); } catch (_) {}
            cb(n);
          } else { cb(''); }
        }, function () { cb(''); });
      } catch (_) { cb(''); }
    }
    var _certReqOnComplete = null;
    function _openCertRequestForm(onComplete) {
      _certReqOnComplete = onComplete || null;
      var ex = document.getElementById('certReqOverlay'); if (ex) ex.remove();
      var prefill = _certRealName();
      var ov = document.createElement('div');
      ov.id = 'certReqOverlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(8,11,20,0.96);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow:auto;-webkit-overflow-scrolling:touch;';
      var h = '<div style="background:#fff;color:#0f172a;max-width:460px;width:100%;border-radius:16px;padding:20px;margin:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);">';
      h += '<div style="font-size:19px;font-weight:900;margin-bottom:4px;">📋 Tu nombre para el certificado</div>';
      h += '<div style="font-size:12.5px;color:#64748b;margin-bottom:16px;line-height:1.5;">Escribe tu <b>nombre y apellido completos</b> tal como quieres que aparezcan en el certificado.</div>';
      h += '<input id="certReqName" type="text" value="' + _escHtml(prefill) + '" placeholder="Ej. Juan Pérez García" autocomplete="name" style="width:100%;box-sizing:border-box;margin:0 0 12px;padding:13px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:16px;font-weight:700;color:#0f172a;outline:none;">';
      h += '<button onclick="window.submitCertRequest()" style="width:100%;padding:14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;">Guardar y continuar →</button>';
      h += '<div id="certReqErr" style="color:#dc2626;font-size:12px;font-weight:700;margin-top:8px;min-height:14px;text-align:center;"></div>';
      h += '<button onclick="(function(){var o=document.getElementById(\'certReqOverlay\');if(o)o.remove();})()" style="width:100%;margin-top:8px;padding:10px;background:none;border:none;color:#94a3b8;font-size:13px;font-weight:700;cursor:pointer;">Cancelar</button>';
      h += '</div>';
      ov.innerHTML = h;
      document.body.appendChild(ov);
      try { var inp = document.getElementById('certReqName'); if (inp) inp.focus(); } catch (_) {}
    }
    window.submitCertRequest = function () {
      var nameEl = document.getElementById('certReqName');
      var errEl = document.getElementById('certReqErr');
      var name = ((nameEl && nameEl.value) || '').trim().replace(/\s+/g, ' ');
      if (name.length < 3 || /@/.test(name) || name.indexOf(' ') === -1) {
        if (errEl) errEl.textContent = 'Escribe tu nombre y apellido completos.';
        return;
      }
      try { var tu = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); tu.nombre = name; localStorage.setItem('tecnico_user', JSON.stringify(tu)); } catch (_) {}
      try { if (typeof currentUser !== 'undefined' && currentUser) currentUser.nombre = name; } catch (_) {}
      var em = _certEmail();
      if (em && typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.from) {
        try { supabaseClient.from('users').update({ nombre: name }).eq('email', em).then(function () {}, function () {}); } catch (_) {}
      }
      var o = document.getElementById('certReqOverlay'); if (o) o.remove();
      var cb = _certReqOnComplete; _certReqOnComplete = null;
      if (typeof cb === 'function') cb();
    };

    // Gate: garantiza un nombre real antes de imprimir; si no hay, pide el form.
    function executeCertPrint(levelId, levelName, levelIcon, userName, score, date, certId) {
      _resolveCertName(userName, function (finalName) {
        var nameOut = _isRealName(finalName) ? finalName : _certRealName();
        if (!_isRealName(nameOut)) {
          _openCertRequestForm(function () {
            executeCertPrint(levelId, levelName, levelIcon, _certRealName() || userName, score, date, certId);
          });
          return;
        }
        _doCertPrint(levelId, levelName, levelIcon, nameOut, score, date, certId);
      });
    }

    function _doCertPrint(levelId, levelName, levelIcon, userName, score, date, certId) {
      // Calculate expiry date (2 years from issue)
      const dateStr = String(date || '');
      const dateParts = dateStr.split(' de ');
      const months = { 'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
                       'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11 };
      const parsedYear = parseInt(dateParts[2], 10);
      let expiryDate;
      if (dateParts.length === 3 && isFinite(parsedYear)) {
        expiryDate = `${dateParts[0]} de ${dateParts[1]} de ${parsedYear + 2}`;
      } else {
        expiryDate = dateStr;
      }

      // Update certificate content
      var _setTxt = function(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
      _setTxt('certLevelBadge', 'NIVEL ' + String(levelName || '').toUpperCase());
      _setTxt('certRecipientName', userName || '');
      _setTxt('certLevelText', levelName || '');
      _setTxt('certScore', (score != null ? score : 0) + '%');
      _setTxt('certDate', dateStr);
      _setTxt('certExpiry', expiryDate);
      _setTxt('certIdText', certId || '');
      // Show plain-text verification URL on printable certificate
      var verifyContainer = document.getElementById('certVerifyCode');
      if (verifyContainer) { verifyContainer.innerHTML = '<div style="font-size:11px;color:#6B6B66;text-align:center;">Verificar en:<br><strong>maestrohvacr.com/verify/' + (certId || '') + '</strong></div>'; }
      
      // Set level color
      const levelColors = {
        'principiante': '#27ae60',
        'intermedio': '#3498db',
        'avanzado': '#9b59b6',
        'elite': '#e74c3c',
        'platino': '#f39c12'
      };
      var _lvlBadge = document.getElementById('certLevelBadge');
      if (_lvlBadge) _lvlBadge.style.background = `linear-gradient(135deg, ${levelColors[levelId] || '#FFD700'}, ${levelColors[levelId] || '#FFA500'})`;

      // Show and print
      const printDiv = document.getElementById('printableCertificate');
      if (!printDiv) { console.warn('[Cert] printableCertificate element missing'); return; }

      // Estampa la firma del Director (guardada en app_config.director_signature
      // desde el CRM) ANTES de imprimir. Mario 2026-06-05: "yo ya lo firmé".
      _fetchDirectorSignature(function (sig) {
        var img = document.getElementById('certSignatureImg');
        var disc = document.getElementById('certDisclaimer');
        if (img) { if (sig) { img.src = sig; img.style.display = 'block'; } else { img.style.display = 'none'; } }
        if (disc) {
          if (sig) {
            disc.textContent = 'Certificado válido con la firma del Director. Verifica su autenticidad por el folio (ID) en maestrohvacr.com/verify.';
            disc.style.color = '#475569'; disc.style.fontWeight = '600';
          } else {
            disc.textContent = '⚠️ ESTE CERTIFICADO NO ES VÁLIDO hasta que el Director lo firme.';
            disc.style.color = '#dc2626'; disc.style.fontWeight = '800';
          }
        }
        printDiv.style.display = 'block';
        setTimeout(() => {
          try { window.print(); } catch (e) { console.warn('[Cert] print failed:', e); }
          setTimeout(() => { printDiv.style.display = 'none'; }, 500);
        }, 300);
      });
    }

    // Lee la firma del Director (cacheada) desde app_config. La firma se CAPTURA en
    // el CRM (admin-certs.js → dirSigSaveCrm); la app/web solo la LEEN.
    var _certSignatureCache = null;
    function _fetchDirectorSignature(cb) {
      if (_certSignatureCache !== null) return cb(_certSignatureCache || null);
      if (typeof supabaseClient === 'undefined' || !supabaseClient || !supabaseClient.from) return cb(null);
      try {
        supabaseClient.from('app_config').select('value').eq('key', 'director_signature').maybeSingle().then(function (res) {
          var v = (res && res.data && res.data.value) ? res.data.value : '';
          _certSignatureCache = v || '';
          cb(_certSignatureCache || null);
        }, function () { cb(null); });
      } catch (_) { cb(null); }
    }

    // Patch certOficialesScreen title
    var _certTitle = document.querySelector('#certOficialesScreen h1[data-i18n="html_get_certs"]');
    if (_certTitle) _certTitle.textContent = '📚 Certificaciones Profesionales';
    var _certSub = document.querySelector('#certOficialesScreen .subtitle[data-i18n="html_prepare_certs"]');
    if (_certSub) _certSub.textContent = 'Material de estudio para certificaciones HVAC';

