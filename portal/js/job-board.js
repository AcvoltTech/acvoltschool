// ============================================
// JOB BOARD — Bolsa de Trabajo HVACR
// Maestro HVACR — April 2026
// ============================================
(function() {
  'use strict';

  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };
  function _esc(s) { return s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  var _currentTab = 'seeking_work';
  var _currentPage = 0;
  var _loading = false;
  var _jobsMap = {}; // id → job object for detail view
  var _jbResumeFile = null; // pending resume file
  var _jbWorkPhotos = [];   // pending work photo files (max 4)
  var _jbFavorites = {};    // id → true
  var _jbFilters = { specialty: '', has_tools: '', location: '' };

  // Load favorites from localStorage
  try { _jbFavorites = JSON.parse(localStorage.getItem('jb_favorites') || '{}'); } catch(e) {}

  function _saveFavorites() {
    try { localStorage.setItem('jb_favorites', JSON.stringify(_jbFavorites)); } catch(e) {}
  }

  // ── Shared input style ──────────────────────────────────────
  var _inputCSS = 'padding:10px;border:1px solid rgba(0,0,0,0.08);border-radius:8px;background:#F2F2F7;color:#1C1C1E;font-size:14px;width:100%;box-sizing:border-box;';
  var _selectCSS = _inputCSS + 'appearance:auto;';
  var _labelCSS = 'font-size:11px;color:#374151;margin-bottom:2px;font-weight:600;';

  // ── Specialty options ────────────────────────────────────────
  var SPECIALTIES = [
    'HVAC Residencial', 'HVAC Comercial', 'Refrigeración', 'Calefacción / Heating',
    'Electricidad', 'Sheet Metal / Ductwork', 'Controls / BAS', 'Chillers',
    'Ventilación / IAQ', 'General HVACR'
  ];

  function initJobBoard() {
    var screen = document.getElementById('jobBoardScreen');
    if (!screen) return;
    if (screen.querySelector('.job-board-loaded')) return;

    var html = '<div class="sticky-nav-bar sticky-nav-bar--light">' +
      '<button class="btn-nav-back" data-nav="dashboardScreen">← Volver</button>' +
      '<span class="nav-bar-title"><img src="bolsa-trabajo-icon.png?v=3" alt="" style="width:28px;height:28px;border-radius:6px;vertical-align:middle;margin-right:6px;" />Bolsa de Trabajo HVACR</span>' +
    '</div>';
    html += '<div style="padding:16px;">';
    // Tabs
    html += '<div id="jobTabs" style="display:flex;gap:4px;margin-bottom:16px;">';
    html += '<button class="job-tab active" data-tab="seeking_work" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;background:#FFFFFF;color:#1C1C1E;box-shadow:0 1px 4px rgba(0,0,0,0.1);">🔍 Busco Trabajo</button>';
    html += '<button class="job-tab" data-tab="hiring" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;background:#F2F2F7;color:#111111;">👷 Busco Técnico</button>';
    html += '</div>';
    // Job search banner
    html += '<div id="jbSearchBanner" onclick="window._jbShowSearchModal()" style="padding:14px;margin-bottom:14px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.06);border-radius:14px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">';
    html += '<div style="font-size:28px;">🌐</div>';
    html += '<div style="flex:1;"><div style="font-size:13px;font-weight:800;color:#007AFF;">Buscar Trabajo HVAC en Internet</div><div style="font-size:11px;color:#374151;margin-top:2px;">Indeed, LinkedIn, ZipRecruiter, Facebook y más</div></div>';
    html += '<div style="color:#4B5563;font-size:18px;">→</div>';
    html += '</div>';
    // Filter bar
    html += '<div id="jbFilterBar" style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">';
    html += '<select id="jbFilterSpecialty" onchange="window._jbApplyFilters()" style="flex:1;min-width:100px;padding:8px;border:1px solid rgba(0,0,0,0.12);border-radius:8px;background:#FFFFFF;color:#111111;font-size:13px;font-weight:600;appearance:auto;"><option value="">Especialidad</option>';
    SPECIALTIES.forEach(function(s) { html += '<option value="' + s + '">' + s + '</option>'; });
    html += '</select>';
    html += '<select id="jbFilterTools" onchange="window._jbApplyFilters()" style="min-width:80px;padding:8px;border:1px solid rgba(0,0,0,0.12);border-radius:8px;background:#FFFFFF;color:#111111;font-size:13px;font-weight:600;appearance:auto;"><option value="">Herramienta</option><option value="yes">Con herramienta</option></select>';
    html += '<input id="jbFilterLocation" oninput="window._jbApplyFilters()" type="text" placeholder="📍 Filtrar ciudad..." style="flex:1;min-width:100px;padding:8px;border:1px solid rgba(0,0,0,0.12);border-radius:8px;background:#FFFFFF;color:#111111;font-size:13px;font-weight:600;" />';
    html += '</div>';
    html += '<div id="jobListContainer"></div>';
    html += '<div id="jobLoadMore" style="text-align:center;padding:12px;display:none;"><button onclick="window._jbLoadMore()" style="padding:8px 24px;border:none;border-radius:8px;background:rgba(59,130,246,0.08);color:#007AFF;font-size:12px;font-weight:700;cursor:pointer;">Cargar más</button></div>';
    html += '</div>';
    // FAB
    html += '<button id="jobFab" onclick="window._jbShowPostModal()" style="position:fixed;bottom:80px;right:20px;width:56px;height:56px;border-radius:50%;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:28px;font-weight:700;box-shadow:0 4px 20px rgba(245,158,11,0.3);cursor:pointer;z-index:100;display:flex;align-items:center;justify-content:center;">+</button>';
    html += '<div class="job-board-loaded" style="display:none;"></div>';

    screen.innerHTML = html;

    // Tab handlers
    screen.querySelectorAll('.job-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        screen.querySelectorAll('.job-tab').forEach(function(b) {
          b.style.background = '#F2F2F7';
          b.style.color = '#8E8E93';
          b.style.boxShadow = 'none';
          b.classList.remove('active');
        });
        btn.classList.add('active');
        btn.style.background = '#FFFFFF';
        btn.style.color = '#1C1C1E';
        btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
        _currentTab = btn.dataset.tab;
        _currentPage = 0;
        _loadJobs();
      });
    });

    _loadJobs();
  }

  function _loadJobs() {
    if (_loading || !window.SocialSystem) return;
    var container = document.getElementById('jobListContainer');
    if (!container) { _loading = false; return; }
    _loading = true;
    if (_currentPage === 0) {
      if (window.Skeleton) window.Skeleton.listCard(container, 5);
      else container.innerHTML = '';
    }

    SocialSystem.getJobs(_currentTab, _currentPage).then(function(jobs) {
      _loading = false;
      if (_currentPage === 0 && jobs.length === 0) {
        var _emptyIcon = _currentTab === 'seeking_work' ? '🔍' : '🧰';
        var _emptyTitle = _currentTab === 'seeking_work' ? 'No hay técnicos buscando trabajo' : 'No hay trabajos disponibles';
        var _emptyDesc = _currentTab === 'seeking_work'
          ? 'Cuando un técnico publique su disponibilidad, aparecerá aquí.'
          : 'Activa las alertas para saber cuándo aparezcan oportunidades cerca de ti.';
        container.innerHTML = '<div class="mx-empty">' +
          '<div class="mx-empty-icon">' + _emptyIcon + '</div>' +
          '<div class="mx-empty-title">' + _emptyTitle + '</div>' +
          '<div class="mx-empty-desc">' + _emptyDesc + '</div>' +
          '</div>';
        return;
      }
      // Fetch profile photos before rendering
      var emails = jobs.map(function(j) { return j.poster_email; }).filter(Boolean);
      var renderCards = function() {
        var html = _currentPage === 0 ? '' : container.innerHTML;
        jobs.forEach(function(job) {
          html += _renderJobCard(job);
        });
        container.innerHTML = html;
        var loadMore = document.getElementById('jobLoadMore');
        if (loadMore) loadMore.style.display = jobs.length >= 20 ? 'block' : 'none';
      };
      if (SocialSystem.fetchPhotos && emails.length > 0) {
        SocialSystem.fetchPhotos(emails, renderCards);
      } else {
        renderCards();
      }
    }).catch(function() {
      _loading = false;
      if (container && _currentPage === 0) container.innerHTML = '<div style="text-align:center;color:rgba(239,68,68,0.7);padding:20px;">Error cargando trabajos</div>';
    });
  }

  // ── Render card ────────────────────────────────────────────
  function _renderJobCard(job) {
    var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
    var isMine = job.poster_email === email;
    var typeLabel = job.type === 'seeking_work' ? '🔍 Busca Trabajo' : '👷 Contratando';
    var typeColor = job.type === 'seeking_work' ? '#16a34a' : '#007AFF';
    var m = job.metadata || {};
    var certsHtml = '';
    if (job.certifications && job.certifications.length > 0) {
      job.certifications.forEach(function(c) {
        certsHtml += '<span style="display:inline-block;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.08);color:#007AFF;font-size:10px;padding:2px 6px;border-radius:6px;margin:2px 2px 0 0;">' + c + '</span>';
      });
    }
    var daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24));
    var timeLabel = daysAgo === 0 ? 'Hoy' : daysAgo === 1 ? 'Ayer' : daysAgo + ' días';

    _jobsMap[job.id] = job;
    var posterName = m.poster_name || job.poster_email.split('@')[0];
    var posterAvatar = (window.SocialSystem && typeof SocialSystem.renderAvatar === 'function')
      ? SocialSystem.renderAvatar(job.poster_email, posterName, 42)
      : '<div style="width:42px;height:42px;border-radius:50%;background:#E5E5EA;display:flex;align-items:center;justify-content:center;color:#374151;font-weight:700;font-size:14px;flex-shrink:0;">' + (posterName.substring(0,2).toUpperCase()) + '</div>';
    var userTypeBadge = '';
    if (m.user_type === 'Estudiante ACVOLT') {
      userTypeBadge = '<span style="font-size:9px;font-weight:700;color:#16a34a;background:rgba(34,197,94,0.15);padding:1px 6px;border-radius:4px;">🎓 Estudiante ACVOLT</span>';
    } else if (m.user_type) {
      userTypeBadge = '<span style="font-size:9px;font-weight:700;color:#374151;background:rgba(0,0,0,0.06);padding:1px 6px;border-radius:4px;">📱 App User</span>';
    }

    var html = '<div data-job-id="' + job.id + '" style="padding:14px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.06);border-radius:16px;margin-bottom:10px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.06);" onclick="window._jbShowDetail(\'' + job.id + '\')">';
    // Poster profile header
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(0,0,0,0.05);">';
    html += posterAvatar;
    html += '<div style="flex:1;min-width:0;">';
    html += '<div style="font-size:13px;font-weight:800;color:#1C1C1E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + posterName + '</div>';
    if (m.poster_tech_number) html += '<div style="font-size:10px;color:#6B21A8;font-weight:600;">#' + m.poster_tech_number + '</div>';
    html += '<div style="display:flex;gap:4px;align-items:center;margin-top:2px;">' + userTypeBadge + '</div>';
    html += '</div>';
    html += '<div style="text-align:right;flex-shrink:0;">';
    html += '<span style="font-size:10px;color:#4B5563;display:block;">' + timeLabel + '</span>';
    html += '<span style="font-size:10px;font-weight:700;color:' + typeColor + ';">' + typeLabel + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div style="font-size:15px;font-weight:800;color:#1C1C1E;margin-bottom:6px;">' + _esc(job.title || 'Sin título') + '</div>';

    // Quick info pills
    var pills = '';
    if (m.specialty) pills += _pill(m.specialty, '#581C87', 'rgba(139,92,246,0.14)');
    if (m.experience) pills += _pill('⏱️ ' + m.experience, '#111111', 'rgba(0,0,0,0.08)');
    if (m.has_tools === 'yes') pills += _pill('🔧 Con herramienta', '#14532D', 'rgba(34,197,94,0.18)');
    if (m.has_transport === 'yes') pills += _pill('🚗 Con transporte', '#1E3A8A', 'rgba(59,130,246,0.15)');
    if (m.availability) pills += _pill('📅 ' + m.availability, '#78350F', 'rgba(245,158,11,0.18)');
    if (m.job_type) pills += _pill(m.job_type, '#9D174D', 'rgba(244,114,182,0.15)');
    if (pills) html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">' + pills + '</div>';

    if (job.description) {
      html += '<div style="font-size:12px;color:#3C3C43;margin-bottom:8px;line-height:1.4;">' + _esc(job.description.substring(0, 200)) + (job.description.length > 200 ? '...' : '') + '</div>';
    }
    if (job.location) html += '<div style="font-size:11px;color:#374151;margin-bottom:4px;">📍 ' + _esc(job.location) + '</div>';
    if (job.pay_range) html += '<div style="font-size:11px;color:#16a34a;margin-bottom:4px;">💰 ' + _esc(job.pay_range) + '</div>';
    if (certsHtml) html += '<div style="margin-top:6px;">' + certsHtml + '</div>';
    if (job.contact_method) html += '<div style="font-size:11px;color:#374151;margin-top:6px;">📞 ' + _esc(job.contact_method) + '</div>';
    // Work photos thumbnails
    if (m.work_photos && m.work_photos.length > 0) {
      html += '<div style="display:flex;gap:6px;margin-top:8px;overflow-x:auto;">';
      m.work_photos.forEach(function(url) {
        html += '<img src="' + url + '" style="width:60px;height:60px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid rgba(0,0,0,0.06);" />';
      });
      html += '</div>';
    }
    // Resume indicator
    if (m.resume_url) {
      html += '<div style="font-size:10px;color:#6B21A8;margin-top:6px;">📄 Resume adjunto</div>';
    }
    // Footer: views + favorite + deactivate
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:8px;border-top:1px solid rgba(0,0,0,0.04);">';
    html += '<span style="font-size:10px;color:#4B5563;">👁️ ' + (job.views || 0) + ' ' + _t('jb_views', 'vistas') + '</span>';
    var isFav = _jbFavorites[job.id];
    html += '<div style="display:flex;gap:8px;align-items:center;">';
    html += '<button onclick="event.stopPropagation();window._jbToggleFav(\'' + job.id + '\',this)" style="background:none;border:none;font-size:18px;cursor:pointer;padding:2px;">' + (isFav ? '❤️' : '🤍') + '</button>';
    if (isMine) {
      html += '<button onclick="event.stopPropagation();window._jbDeactivate(\'' + job.id + '\')" style="padding:4px 12px;border:none;border-radius:6px;background:rgba(239,68,68,0.2);color:#991B1B;font-size:11px;font-weight:700;cursor:pointer;">' + _t('jb_deactivate_ok', 'Desactivar') + '</button>';
    }
    html += '</div></div>';
    html += '</div>';
    return html;
  }

  function _pill(text, color, bg) {
    return '<span style="font-size:12px;font-weight:700;color:' + color + ';background:' + bg + ';padding:4px 10px;border-radius:8px;white-space:nowrap;border:1px solid ' + color + '33;">' + text + '</span>';
  }

  // ── Post modal — dynamic form based on type ─────────────────
  function _showPostModal() {
    var existing = document.getElementById('jobPostModal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'jobPostModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;padding:20px;';

    modal.innerHTML = '<div style="background:#FFFFFF;border:1px solid rgba(245,158,11,0.3);border-radius:20px;padding:24px;max-width:420px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<span style="font-size:18px;font-weight:900;color:#92400E;">🔧 Nueva Publicación</span>' +
        '<button onclick="document.getElementById(\'jobPostModal\').remove()" style="background:none;border:none;color:#374151;font-size:24px;cursor:pointer;">✕</button>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<select id="jbType" onchange="window._jbToggleFormType()" style="' + _selectCSS + '">' +
          '<option value="seeking_work">🔍 Busco Trabajo</option>' +
          '<option value="hiring">👷 Ofrezco Trabajo / Busco Técnico</option>' +
        '</select>' +
        '<div id="jbFormFields"></div>' +
        '<button id="jbSubmitBtn" onclick="window._jbSubmit()" style="padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">Publicar</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(modal);
    _toggleFormType(); // Render initial form
  }

  function _toggleFormType() {
    var type = (document.getElementById('jbType') || {}).value || 'seeking_work';
    var container = document.getElementById('jbFormFields');
    if (!container) return;

    // Get user profile for auto-fill
    var u = {};
    try { u = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}

    var specOpts = SPECIALTIES.map(function(s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');

    if (type === 'seeking_work') {
      container.innerHTML =
        '<input id="jbTitle" type="text" placeholder="Tu título profesional (ej: Técnico HVAC)" maxlength="100" style="' + _inputCSS + '" value="' + (u.titulo_profesional || '') + '" />' +
        '<select id="jbSpecialty" style="' + _selectCSS + '"><option value="">-- Especialidad --</option>' + specOpts + '</select>' +
        '<select id="jbExperience" style="' + _selectCSS + '">' +
          '<option value="">-- Años de experiencia --</option>' +
          '<option value="Menos de 1 año">Menos de 1 año</option>' +
          '<option value="1-3 años">1-3 años</option>' +
          '<option value="3-5 años">3-5 años</option>' +
          '<option value="5-10 años">5-10 años</option>' +
          '<option value="10-20 años">10-20 años</option>' +
          '<option value="20+ años">20+ años</option>' +
        '</select>' +
        '<textarea id="jbDesc" placeholder="Describe tu experiencia, qué tipo de trabajo buscas..." rows="3" maxlength="1000" style="' + _inputCSS + 'resize:vertical;"></textarea>' +
        '<input id="jbLocation" type="text" placeholder="📍 Ciudad, Estado" maxlength="100" style="' + _inputCSS + '" value="' + ((u.ciudad || '') + (u.estado ? ', ' + u.estado : '')) + '" />' +
        '<input id="jbPay" type="text" placeholder="💰 Salario esperado (ej: $25-35/hr)" maxlength="50" style="' + _inputCSS + '" />' +
        '<input id="jbCerts" type="text" placeholder="Certificaciones (EPA 608, NATE, OSHA...)" maxlength="200" style="' + _inputCSS + '" />' +
        '<input id="jbSchool" type="text" placeholder="🎓 Escuela / Capacitación" maxlength="200" style="' + _inputCSS + '" />' +
        '<input id="jbReferences" type="text" placeholder="🏢 Empresas donde has trabajado" maxlength="300" style="' + _inputCSS + '" />' +
        '<div style="display:flex;gap:8px;">' +
          '<select id="jbTools" style="' + _selectCSS + 'flex:1;">' +
            '<option value="">🔧 Herramienta?</option>' +
            '<option value="yes">Sí, tengo herramienta</option>' +
            '<option value="no">No tengo herramienta</option>' +
          '</select>' +
          '<select id="jbTransport" style="' + _selectCSS + 'flex:1;">' +
            '<option value="">🚗 Transporte?</option>' +
            '<option value="yes">Sí, tengo transporte</option>' +
            '<option value="no">No tengo transporte</option>' +
          '</select>' +
        '</div>' +
        '<select id="jbAvailability" style="' + _selectCSS + '">' +
          '<option value="">📅 Disponibilidad para empezar</option>' +
          '<option value="Inmediata">Inmediata</option>' +
          '<option value="1 semana">En 1 semana</option>' +
          '<option value="2 semanas">En 2 semanas</option>' +
          '<option value="1 mes">En 1 mes</option>' +
        '</select>' +
        '<input id="jbContact" type="text" placeholder="📞 Teléfono, email o WhatsApp" maxlength="100" style="' + _inputCSS + '" value="' + (u.telefono || '') + '" />' +
        // Resume upload
        '<div style="border:1px dashed rgba(0,0,0,0.08);border-radius:10px;padding:12px;text-align:center;cursor:pointer;" onclick="document.getElementById(\'jbResumeInput\').click()">' +
          '<input id="jbResumeInput" type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none;" onchange="window._jbResumeSelected(this)" />' +
          '<div id="jbResumeLabel" style="color:#374151;font-size:12px;">📄 Subir Resume / CV (PDF o foto)</div>' +
        '</div>' +
        // Work photos
        '<div style="border:1px dashed rgba(0,0,0,0.08);border-radius:10px;padding:12px;text-align:center;cursor:pointer;" onclick="document.getElementById(\'jbPhotosInput\').click()">' +
          '<input id="jbPhotosInput" type="file" accept="image/*" multiple style="display:none;" onchange="window._jbPhotosSelected(this)" />' +
          '<div id="jbPhotosLabel" style="color:#374151;font-size:12px;">📸 Fotos de trabajos anteriores (máx 4)</div>' +
          '<div id="jbPhotosPreview" style="display:flex;gap:6px;margin-top:8px;justify-content:center;flex-wrap:wrap;"></div>' +
        '</div>';
    } else {
      // HIRING form — contractor/employer posting
      container.innerHTML =
        '<input id="jbTitle" type="text" placeholder="Título del puesto (ej: Técnico HVAC Comercial)" maxlength="100" style="' + _inputCSS + '" />' +
        '<select id="jbJobType" style="' + _selectCSS + '">' +
          '<option value="">-- Tipo de empleo --</option>' +
          '<option value="Full-time">Full-time</option>' +
          '<option value="Part-time">Part-time</option>' +
          '<option value="Contrato">Contrato</option>' +
          '<option value="Temporal / Seasonal">Temporal / Seasonal</option>' +
          '<option value="Subcontratista">Subcontratista</option>' +
        '</select>' +
        '<select id="jbSpecialty" style="' + _selectCSS + '"><option value="">-- Especialidad requerida --</option>' + specOpts + '</select>' +
        '<select id="jbExperienceReq" style="' + _selectCSS + '">' +
          '<option value="">-- Experiencia mínima --</option>' +
          '<option value="No requerida">No requerida</option>' +
          '<option value="1+ años">1+ años</option>' +
          '<option value="3+ años">3+ años</option>' +
          '<option value="5+ años">5+ años</option>' +
          '<option value="10+ años">10+ años</option>' +
        '</select>' +
        '<textarea id="jbDesc" placeholder="Describe el trabajo, responsabilidades, lo que ofreces como contratista o empresa..." rows="4" maxlength="1500" style="' + _inputCSS + 'resize:vertical;"></textarea>' +
        '<input id="jbCompany" type="text" placeholder="🏢 Nombre de la empresa" maxlength="100" style="' + _inputCSS + '" />' +
        '<input id="jbLocation" type="text" placeholder="📍 Ubicación del trabajo" maxlength="100" style="' + _inputCSS + '" />' +
        '<input id="jbPay" type="text" placeholder="💰 Rango salarial ofrecido (ej: $28-40/hr)" maxlength="50" style="' + _inputCSS + '" />' +
        '<input id="jbCerts" type="text" placeholder="Certificaciones requeridas (EPA 608, NATE...)" maxlength="200" style="' + _inputCSS + '" />' +
        '<textarea id="jbBenefits" placeholder="Beneficios (seguro médico, vacaciones, herramienta, vehículo...)" rows="2" maxlength="500" style="' + _inputCSS + 'resize:vertical;"></textarea>' +
        '<input id="jbContact" type="text" placeholder="📞 Contacto para aplicar" maxlength="100" style="' + _inputCSS + '" />' +
        // Work photos for hiring
        '<div style="border:1px dashed rgba(0,0,0,0.08);border-radius:10px;padding:12px;text-align:center;cursor:pointer;" onclick="document.getElementById(\'jbPhotosInput\').click()">' +
          '<input id="jbPhotosInput" type="file" accept="image/*" multiple style="display:none;" onchange="window._jbPhotosSelected(this)" />' +
          '<div id="jbPhotosLabel" style="color:#374151;font-size:12px;">📸 Fotos del lugar de trabajo (máx 4)</div>' +
          '<div id="jbPhotosPreview" style="display:flex;gap:6px;margin-top:8px;justify-content:center;flex-wrap:wrap;"></div>' +
        '</div>';
    }

    // Auto-fill certs from profile
    try {
      var certs = localStorage.getItem('maestroac_certs');
      var certsField = document.getElementById('jbCerts');
      if (certs && certsField && !certsField.value) certsField.value = certs;
    } catch(e) {}

    // Auto-fill experience from profile
    try {
      if (type === 'seeking_work' && u.experiencia) {
        var expSel = document.getElementById('jbExperience');
        if (expSel) {
          for (var i = 0; i < expSel.options.length; i++) {
            if (expSel.options[i].value.toLowerCase().indexOf(u.experiencia.toLowerCase().replace('+', '')) !== -1) {
              expSel.selectedIndex = i; break;
            }
          }
        }
      }
    } catch(e) {}
  }

  function _submitJob() {
    if (!window.SocialSystem) { window.showToast(_t('jb_loading_retry', 'Cargando... intenta de nuevo'), 'info'); return; }
    var title = (document.getElementById('jbTitle') || {}).value;
    var type = (document.getElementById('jbType') || {}).value;
    if (!title || !title.trim()) { window.showToast(_t('jb_write_title', 'Escribe un título'), 'warning'); return; }

    var btn = document.getElementById('jbSubmitBtn');
    if (window.BtnLoading) window.BtnLoading.start(btn, _t('jb_publishing', 'Publicando...'));

    var certsRaw = (document.getElementById('jbCerts') || {}).value || '';
    var certs = certsRaw.split(',').map(function(c) { return c.trim(); }).filter(function(c) { return c; });

    var metadata = {};

    // Auto-include poster profile
    try {
      var _u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      metadata.poster_name = _u.nombre || '';
      metadata.poster_tech_number = _u.technicianNumber || localStorage.getItem('tecnico_number_' + (_u.email || '')) || localStorage.getItem('tecnico_number') || '';
      // Determine if student (enrolled) or outside app user
      var _isStudent = false;
      try {
        if (localStorage.getItem('tecnico_authenticated') === 'true') {
          _isStudent = true;
        }
      } catch(e2) {}
      metadata.user_type = _isStudent ? 'Estudiante ACVOLT' : 'App User';
    } catch(e) {}

    var specEl = document.getElementById('jbSpecialty');
    if (specEl && specEl.value) metadata.specialty = specEl.value;

    if (type === 'seeking_work') {
      var expEl = document.getElementById('jbExperience');
      if (expEl && expEl.value) metadata.experience = expEl.value;
      var schoolEl = document.getElementById('jbSchool');
      if (schoolEl && schoolEl.value.trim()) metadata.school = schoolEl.value.trim();
      var refsEl = document.getElementById('jbReferences');
      if (refsEl && refsEl.value.trim()) metadata.references = refsEl.value.trim();
      var toolsEl = document.getElementById('jbTools');
      if (toolsEl && toolsEl.value) metadata.has_tools = toolsEl.value;
      var transEl = document.getElementById('jbTransport');
      if (transEl && transEl.value) metadata.has_transport = transEl.value;
      var availEl = document.getElementById('jbAvailability');
      if (availEl && availEl.value) metadata.availability = availEl.value;
    } else {
      var jtEl = document.getElementById('jbJobType');
      if (jtEl && jtEl.value) metadata.job_type = jtEl.value;
      var expReqEl = document.getElementById('jbExperienceReq');
      if (expReqEl && expReqEl.value) metadata.experience_required = expReqEl.value;
      var compEl = document.getElementById('jbCompany');
      if (compEl && compEl.value.trim()) metadata.company = compEl.value.trim();
      var benEl = document.getElementById('jbBenefits');
      if (benEl && benEl.value.trim()) metadata.benefits = benEl.value.trim();
    }

    var data = {
      type: type,
      title: title.trim(),
      description: ((document.getElementById('jbDesc') || {}).value || '').trim(),
      location: ((document.getElementById('jbLocation') || {}).value || '').trim(),
      pay_range: ((document.getElementById('jbPay') || {}).value || '').trim(),
      certifications: certs,
      contact_method: ((document.getElementById('jbContact') || {}).value || '').trim(),
      metadata: metadata
    };

    // Upload files first, then post
    var uploads = [];
    if (_jbResumeFile) uploads.push(_uploadFile(_jbResumeFile, 'resumes').then(function(url) { if (url) metadata.resume_url = url; }));
    if (_jbWorkPhotos.length > 0) {
      _jbWorkPhotos.forEach(function(f) {
        uploads.push(_uploadFile(f, 'work-photos').then(function(url) {
          if (url) {
            if (!metadata.work_photos) metadata.work_photos = [];
            metadata.work_photos.push(url);
          }
        }));
      });
    }

    Promise.all(uploads).then(function() {
      data.metadata = metadata;
      return SocialSystem.postJob(data);
    }).then(function() {
      var modal = document.getElementById('jobPostModal');
      if (modal) modal.remove();
      _jbResumeFile = null;
      _jbWorkPhotos = [];
      _currentPage = 0;
      _loadJobs();
      if (window.Gamification) {
        try { window.Gamification.awardXP(25, 'social'); } catch(e) {}
      }
      // Notify technicians/employers with matching profiles
      _notifyMatchingUsers(data);
    }).catch(function(e) {
      window.MaestroDialog.alert({title: _t('err_generic', 'Error'), message: _t('jb_err_publishing', 'Error publicando') + ': ' + (e.message || _t('err_retry', 'Intenta de nuevo')), kind: 'error'});
    }).finally(function() {
      if (window.BtnLoading) window.BtnLoading.stop(btn);
    });
  }

  // ── Push notifications for matching jobs ──────────────────
  function _notifyMatchingUsers(postedJob) {
    if (!window.supabaseClient || typeof notifyStudents !== 'function') return;
    try {
      var oppositeType = postedJob.type === 'seeking_work' ? 'hiring' : 'seeking_work';
      var specialty = (postedJob.metadata && postedJob.metadata.specialty) || '';
      var location = (postedJob.location || '').toLowerCase().trim();
      var posterEmail = '';
      try { posterEmail = JSON.parse(localStorage.getItem('tecnico_user') || '{}').email || ''; } catch(e) {}

      // Query active listings of the opposite type
      supabaseClient.from('job_listings')
        .select('poster_email, location, metadata')
        .eq('active', true)
        .eq('type', oppositeType)
        .then(function(res) {
          if (!res.data || res.data.length === 0) return;
          var emails = [];
          var seen = {};
          res.data.forEach(function(listing) {
            var email = listing.poster_email;
            if (!email || seen[email] || email === posterEmail) return;
            // Match by specialty or location
            var listSpec = (listing.metadata && listing.metadata.specialty) || '';
            var listLoc = (listing.location || '').toLowerCase().trim();
            var specMatch = specialty && listSpec && specialty === listSpec;
            var locMatch = location && listLoc && (listLoc.indexOf(location) !== -1 || location.indexOf(listLoc) !== -1);
            if (specMatch || locMatch) {
              seen[email] = true;
              emails.push(email);
            }
          });
          if (emails.length === 0) return;

          var isHiring = postedJob.type === 'hiring';
          var title = isHiring
            ? '👷 Nueva oferta de trabajo HVAC'
            : '🔍 Nuevo técnico disponible';
          var body = isHiring
            ? (postedJob.title + (specialty ? ' — ' + specialty : '') + (location ? ' en ' + location : ''))
            : (postedJob.title + (specialty ? ' — ' + specialty : '') + (location ? ' en ' + location : ''));
          notifyStudents(title, body, 'job_match', emails);
        }).catch(function() {});
    } catch(e) { console.warn('[JobBoard] notify error:', e); }
  }

  function _deactivate(id) {
    var _ask = (window.MaestroDialog && window.MaestroDialog.confirm)
      ? window.MaestroDialog.confirm({
          title: _t('jb_deactivate_title', 'Desactivar publicación'),
          message: _t('jb_deactivate_msg', '¿Quieres desactivar esta publicación? Dejará de aparecer en la lista.'),
          okText: _t('jb_deactivate_ok', 'Desactivar'),
          cancelText: _t('cancel', 'Cancelar'),
          destructive: true,
          kind: 'warning'
        })
      : Promise.resolve(confirm(_t('jb_deactivate_q', '¿Desactivar esta publicación?')));
    _ask.then(function(ok) {
      if (!ok) return;
      SocialSystem.deactivateListing(id).then(function() {
        _currentPage = 0;
        _loadJobs();
      });
    });
  }

  // ── Detail modal ─────────────────────────────────────────────
  function _showDetail(jobId) {
    var job = _jobsMap[jobId];
    if (!job) return;
    var existing = document.getElementById('jobDetailModal');
    if (existing) existing.remove();

    var typeLabel = job.type === 'seeking_work' ? '🔍 Busca Trabajo' : '👷 Contratando';
    var typeColor = job.type === 'seeking_work' ? '#16a34a' : '#007AFF';
    var daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24));
    var timeLabel = daysAgo === 0 ? 'Hoy' : daysAgo === 1 ? 'Ayer' : 'Hace ' + daysAgo + ' días';
    var m = job.metadata || {};

    var certsHtml = '';
    if (job.certifications && job.certifications.length > 0) {
      job.certifications.forEach(function(c) {
        certsHtml += '<span style="display:inline-block;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.08);color:#007AFF;font-size:12px;padding:4px 10px;border-radius:8px;margin:3px 3px 0 0;">' + c + '</span>';
      });
    }

    // Build metadata section
    var infoRows = '';
    function _row(icon, label, val) {
      if (!val) return '';
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);"><span style="font-size:14px;">' + icon + '</span><span style="font-size:11px;color:#374151;min-width:80px;">' + label + '</span><span style="font-size:13px;color:#1C1C1E;font-weight:600;">' + val + '</span></div>';
    }

    if (job.type === 'seeking_work') {
      infoRows += _row('🛠️', 'Especialidad', m.specialty);
      infoRows += _row('⏱️', 'Experiencia', m.experience);
      infoRows += _row('🎓', 'Escuela', m.school);
      infoRows += _row('🏢', 'Empresas', m.references);
      infoRows += _row('🔧', 'Herramienta', m.has_tools === 'yes' ? 'Sí' : m.has_tools === 'no' ? 'No' : '');
      infoRows += _row('🚗', 'Transporte', m.has_transport === 'yes' ? 'Sí' : m.has_transport === 'no' ? 'No' : '');
      infoRows += _row('📅', 'Disponible', m.availability);
    } else {
      infoRows += _row('🏢', 'Empresa', m.company);
      infoRows += _row('📋', 'Tipo', m.job_type);
      infoRows += _row('🛠️', 'Especialidad', m.specialty);
      infoRows += _row('⏱️', 'Exp. requerida', m.experience_required);
      if (m.benefits) infoRows += '<div style="margin-top:8px;padding:10px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.15);border-radius:10px;"><div style="font-size:11px;color:#16a34a;font-weight:700;margin-bottom:4px;">✨ Beneficios</div><div style="font-size:12px;color:#3C3C43;line-height:1.5;">' + m.benefits + '</div></div>';
    }

    // Contact buttons
    var contactBtns = '';
    var contact = job.contact_method || '';
    var phone = contact.match(/\d{7,}/);
    if (phone) {
      contactBtns += '<a href="tel:' + phone[0] + '" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;border:none;border-radius:10px;background:rgba(34,197,94,0.1);color:#16a34a;font-size:13px;font-weight:700;text-decoration:none;">📞 Llamar</a>';
      contactBtns += '<a href="https://wa.me/' + phone[0] + '" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;border:none;border-radius:10px;background:rgba(37,211,102,0.2);color:#25d366;font-size:13px;font-weight:700;text-decoration:none;">💬 WhatsApp</a>';
    }
    var emailMatch = contact.match(/[\w.-]+@[\w.-]+/);
    if (emailMatch) {
      contactBtns += '<a href="mailto:' + emailMatch[0] + '" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;border:none;border-radius:10px;background:rgba(59,130,246,0.08);color:#007AFF;font-size:13px;font-weight:700;text-decoration:none;">✉️ Email</a>';
    }
    if (!contactBtns && contact) {
      contactBtns = '<div style="padding:12px;background:rgba(0,0,0,0.06);border-radius:10px;color:#374151;font-size:13px;text-align:center;">📞 ' + contact + '</div>';
    }

    // Poster profile for detail view
    var dPosterName = m.poster_name || job.poster_email.split('@')[0];
    var dPosterAvatar = (window.SocialSystem && typeof SocialSystem.renderAvatar === 'function')
      ? SocialSystem.renderAvatar(job.poster_email, dPosterName, 56)
      : '<div style="width:56px;height:56px;border-radius:50%;background:#E5E5EA;display:flex;align-items:center;justify-content:center;color:#374151;font-weight:700;font-size:18px;flex-shrink:0;">' + dPosterName.substring(0,2).toUpperCase() + '</div>';
    var dUserTypeBadge = '';
    if (m.user_type === 'Estudiante ACVOLT') {
      dUserTypeBadge = '<span style="font-size:10px;font-weight:700;color:#16a34a;background:rgba(34,197,94,0.15);padding:2px 8px;border-radius:6px;">🎓 Estudiante ACVOLT</span>';
    } else if (m.user_type) {
      dUserTypeBadge = '<span style="font-size:10px;font-weight:700;color:#374151;background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:6px;">📱 App User</span>';
    }

    var modal = document.createElement('div');
    modal.id = 'jobDetailModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:20px;padding:24px;max-width:420px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);">' +
      // Close button
      '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;">' +
        '<button onclick="document.getElementById(\'jobDetailModal\').remove()" style="background:none;border:none;color:#374151;font-size:24px;cursor:pointer;padding:0 4px;">✕</button>' +
      '</div>' +
      // Poster profile card
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding:14px;background:#F2F2F7;border:1px solid rgba(0,0,0,0.06);border-radius:14px;">' +
        dPosterAvatar +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:16px;font-weight:900;color:#1C1C1E;">' + dPosterName + '</div>' +
          (m.poster_tech_number ? '<div style="font-size:11px;color:#6B21A8;font-weight:600;margin-top:2px;">🔖 #' + m.poster_tech_number + '</div>' : '') +
          '<div style="display:flex;gap:6px;align-items:center;margin-top:4px;">' +
            dUserTypeBadge +
            '<span style="font-size:10px;font-weight:700;color:' + typeColor + ';background:' + (job.type === 'seeking_work' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.08)') + ';padding:2px 8px;border-radius:6px;">' + typeLabel + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:20px;font-weight:900;color:#1C1C1E;margin-bottom:6px;">' + _esc(job.title || 'Sin título') + '</div>' +
      '<div style="font-size:11px;color:#4B5563;margin-bottom:16px;">📅 ' + timeLabel + '</div>' +
      (infoRows ? '<div style="margin-bottom:16px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:12px;">' + infoRows + '</div>' : '') +
      (job.description ? '<div style="font-size:13px;color:#3C3C43;margin-bottom:16px;line-height:1.6;white-space:pre-wrap;">' + _esc(job.description) + '</div>' : '') +
      (job.location ? '<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#374151;margin-bottom:8px;">📍 ' + _esc(job.location) + '</div>' : '') +
      (job.pay_range ? '<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#16a34a;margin-bottom:8px;">💰 ' + _esc(job.pay_range) + '</div>' : '') +
      (certsHtml ? '<div style="margin-bottom:16px;">' + certsHtml + '</div>' : '') +
      // Work photos gallery
      (m.work_photos && m.work_photos.length > 0 ? '<div style="margin-bottom:16px;"><div style="font-size:11px;color:#374151;font-weight:700;margin-bottom:8px;">📸 Fotos de trabajo</div><div style="display:flex;gap:8px;overflow-x:auto;">' + m.work_photos.map(function(url) { return '<img src="' + url + '" onclick="event.stopPropagation();window.open(\'' + url + '\',\'_blank\')" style="width:100px;height:100px;border-radius:10px;object-fit:cover;flex-shrink:0;cursor:pointer;border:1px solid rgba(0,0,0,0.06);" />'; }).join('') + '</div></div>' : '') +
      // Resume link
      (m.resume_url ? '<a href="' + m.resume_url + '" target="_blank" rel="noopener" style="display:block;padding:12px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:10px;color:#6B21A8;font-size:13px;font-weight:700;text-decoration:none;text-align:center;margin-bottom:16px;">📄 Ver Resume / CV</a>' : '') +
      // View count
      '<div style="font-size:10px;color:#4B5563;text-align:center;margin-bottom:12px;">👁️ ' + (job.views || 0) + ' vistas</div>' +
      (contactBtns ? '<div style="display:flex;gap:8px;margin-top:8px;">' + contactBtns + '</div>' : '') +
    '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    // Track view
    _trackView(jobId);
  }

  // ── Job Search Modal — use <a> tags for reliable external links ──
  function _getSearchPlatforms(lang) {
    var kw = lang === 'en' ? 'HVAC+technician' : 'tecnico+HVAC';
    var kwEnc = lang === 'en' ? 'HVAC%20technician' : 'tecnico%20HVAC';
    var kwFb = lang === 'en' ? 'HVAC%2520technician' : 'tecnico%2520HVAC';
    return [
      { name: 'Google Jobs', url: 'https://www.google.com/search?q=' + kw + '+jobs+near+', color: '#ea4335', icon: '🔍' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?keywords=' + kwEnc + '&location=', color: '#0a66c2', icon: '🔗' },
      { name: 'Indeed', url: 'https://www.indeed.com/jobs?q=' + kw + '&l=', color: '#2164f3', icon: '💼' },
      { name: 'Jooble', url: 'https://jooble.org/SearchResult?ukw=' + kw + '&loc=', color: '#f57c00', icon: '🌐' },
      { name: 'Talent.com', url: 'https://www.talent.com/jobs?k=' + kw + '&l=', color: '#1abf73', icon: '⚡' },
      { name: 'Glassdoor', url: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=' + kw + '&locT=C&locKeyword=', color: '#0caa41', icon: '🏢' },
      { name: 'Facebook', url: 'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fjobs%2Fsearch%2F%3Fq%3D' + kwFb + '%2520', color: '#1877f2', icon: '📘' },
      { name: 'Craigslist (USA)', url: 'https://www.google.com/search?q=site%3Acraigslist.org+' + kw + '+jobs+', color: '#5a0e99', icon: '📋' }
    ];
  }

  function _showSearchModal() {
    var existing = document.getElementById('jobSearchModal');
    if (existing) existing.remove();

    var _lang = (typeof window._lang !== 'undefined' && window._lang === 'en') ? 'en' : 'es';
    var _platforms = _getSearchPlatforms(_lang);
    var userCity = '';
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      userCity = (u.ciudad || '') + (u.estado ? ', ' + u.estado : '');
    } catch(e) {}

    var linksHtml = '';
    _platforms.forEach(function(p, idx) {
      linksHtml += '<a id="jbSearchLink' + idx + '" href="' + p.url + encodeURIComponent(userCity) + '" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:12px;padding:14px;border:none;border-radius:12px;background:#F2F2F7;text-decoration:none;cursor:pointer;">' +
        '<span style="font-size:22px;">' + p.icon + '</span>' +
        '<span style="flex:1;font-size:14px;font-weight:700;color:' + p.color + ';">' + p.name + '</span>' +
        '<span style="color:#4B5563;font-size:16px;">→</span>' +
      '</a>';
    });

    var modal = document.createElement('div');
    modal.id = 'jobSearchModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = '<div style="background:#FFFFFF;border:1px solid rgba(59,130,246,0.15);border-radius:20px;padding:24px;max-width:420px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<span style="font-size:18px;font-weight:900;color:#007AFF;">🌐 ' + (_lang === 'en' ? 'Search HVAC Jobs' : 'Buscar Trabajo HVAC') + '</span>' +
        '<button onclick="document.getElementById(\'jobSearchModal\').remove()" style="background:none;border:none;color:#374151;font-size:24px;cursor:pointer;">✕</button>' +
      '</div>' +
      '<div style="margin-bottom:16px;">' +
        '<input id="jbSearchLocation" type="text" placeholder="' + (_lang === 'en' ? 'City, State (e.g. Los Angeles, CA)' : 'Ciudad, Estado (ej: Los Angeles, CA)') + '" value="' + userCity + '" oninput="window._jbUpdateSearchLinks()" style="width:100%;padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:10px;background:#F2F2F7;color:#1C1C1E;font-size:14px;box-sizing:border-box;" />' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;">' + linksHtml + '</div>' +
      '<div style="margin-top:16px;padding:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:10px;">' +
        '<div style="font-size:11px;color:#92400E;line-height:1.5;">💡 ' + (_lang === 'en' ? 'Tip: Enter your city above, then tap any platform to search.' : 'Tip: Escribe tu ciudad arriba, luego toca cualquier plataforma para buscar.') + '</div>' +
      '</div>' +
    '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
  }

  function _updateSearchLinks() {
    var loc = (document.getElementById('jbSearchLocation') || {}).value || '';
    var encoded = encodeURIComponent(loc.trim());
    var _lang = (typeof window._lang !== 'undefined' && window._lang === 'en') ? 'en' : 'es';
    var _platforms = _getSearchPlatforms(_lang);
    _platforms.forEach(function(p, idx) {
      var link = document.getElementById('jbSearchLink' + idx);
      if (link) link.href = p.url + encoded;
    });
  }

  // ── File upload helpers ────────────────────────────────────
  function _resumeSelected(input) {
    if (!input.files || !input.files[0]) return;
    var f = input.files[0];
    if (f.size > 10 * 1024 * 1024) { window.showToast(_t('jb_max_resume_size', 'Máximo 10MB para resume'), 'warning'); input.value = ''; return; }
    _jbResumeFile = f;
    var label = document.getElementById('jbResumeLabel');
    if (label) label.innerHTML = '📄 <strong style="color:#16a34a;">' + f.name + '</strong> (' + (f.size / 1024).toFixed(0) + 'KB)';
  }

  function _photosSelected(input) {
    if (!input.files) return;
    _jbWorkPhotos = Array.from(input.files).slice(0, 4);
    var preview = document.getElementById('jbPhotosPreview');
    var label = document.getElementById('jbPhotosLabel');
    if (label) label.innerHTML = '📸 <strong style="color:#16a34a;">' + _jbWorkPhotos.length + ' foto(s) seleccionadas</strong>';
    if (preview) {
      preview.innerHTML = '';
      _jbWorkPhotos.forEach(function(f) {
        var url = URL.createObjectURL(f);
        var img = document.createElement('img');
        img.src = url;
        img.style.cssText = 'width:50px;height:50px;border-radius:6px;object-fit:cover;';
        img.onload = function() { try { URL.revokeObjectURL(url); } catch(e) {} };
        preview.appendChild(img);
      });
    }
  }

  function _uploadFile(file, folder) {
    if (!window.supabaseClient) return Promise.resolve(null);
    var ext = file.name.split('.').pop().toLowerCase();
    var path = 'job-board/' + folder + '/' + Date.now() + '_' + Math.random().toString(36).substr(2, 6) + '.' + ext;
    return supabaseClient.storage.from('school-files').upload(path, file, { contentType: file.type, upsert: false }).then(function(res) {
      if (res.error) { console.warn('[JB] Upload error:', res.error.message); return null; }
      var urlRes = supabaseClient.storage.from('school-files').getPublicUrl(path);
      return (urlRes.data && urlRes.data.publicUrl) || null;
    }).catch(function() { return null; });
  }

  // ── Favorites ────────────────────────────────────────────
  function _toggleFav(jobId, btn) {
    if (_jbFavorites[jobId]) {
      delete _jbFavorites[jobId];
      if (btn) btn.textContent = '🤍';
    } else {
      _jbFavorites[jobId] = true;
      if (btn) btn.textContent = '❤️';
    }
    _saveFavorites();
  }

  // ── View counter ─────────────────────────────────────────
  function _trackView(jobId) {
    if (!window.supabaseClient) return;
    var key = 'jb_viewed_' + jobId;
    if (sessionStorage.getItem(key)) return; // only count once per session
    sessionStorage.setItem(key, '1');
    supabaseClient.rpc('increment_job_views', { job_id: jobId }).then(function() {});
  }

  // ── Filters ──────────────────────────────────────────────
  function _applyFilters() {
    _jbFilters.specialty = (document.getElementById('jbFilterSpecialty') || {}).value || '';
    _jbFilters.has_tools = (document.getElementById('jbFilterTools') || {}).value || '';
    _jbFilters.location = ((document.getElementById('jbFilterLocation') || {}).value || '').toLowerCase().trim();
    // Re-render with filters
    var container = document.getElementById('jobListContainer');
    if (!container) return;
    var html = '';
    var ids = Object.keys(_jobsMap);
    var shown = 0;
    ids.forEach(function(id) {
      var job = _jobsMap[id];
      if (job.type !== _currentTab) return;
      var m = job.metadata || {};
      if (_jbFilters.specialty && m.specialty !== _jbFilters.specialty) return;
      if (_jbFilters.has_tools && m.has_tools !== _jbFilters.has_tools) return;
      if (_jbFilters.location && (job.location || '').toLowerCase().indexOf(_jbFilters.location) === -1) return;
      html += _renderJobCard(job);
      shown++;
    });
    if (shown === 0) {
      html = '<div class="mx-empty">' +
        '<div class="mx-empty-icon">🔎</div>' +
        '<div class="mx-empty-title">Sin resultados</div>' +
        '<div class="mx-empty-desc">Ningún trabajo coincide con estos filtros. Ajusta los criterios e inténtalo de nuevo.</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // Global handlers
  window._jbLoadMore = function() { _currentPage++; _loadJobs(); };
  window._jbShowPostModal = _showPostModal;
  window._jbToggleFormType = _toggleFormType;
  window._jbSubmit = _submitJob;
  window._jbDeactivate = _deactivate;
  window._jbShowDetail = _showDetail;
  window._jbShowSearchModal = _showSearchModal;
  window._jbUpdateSearchLinks = _updateSearchLinks;
  window._jbResumeSelected = _resumeSelected;
  window._jbPhotosSelected = _photosSelected;
  window._jbToggleFav = _toggleFav;
  window._jbApplyFilters = _applyFilters;
  window.initJobBoard = initJobBoard;

})();
