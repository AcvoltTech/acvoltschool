/**
 * fixes-workbooks-exams-calendar.js
 * ===================================
 * Fixes for: Workbooks tab, Exam student search, Calendar attendance view
 * This file is independent and does NOT modify index.html or other files.
 * Safe to run alongside other development work.
 *
 * Issues fixed:
 * 1. Libros de Trabajo (Workbooks) - tab not opening in Zona de Maestro
 * 2. Asignar Examenes - Enhanced student search by name/tech number with membership & class filters
 * 3. Calendario de Clases - no attendance view when clicking a class
 */

(function() {
    'use strict';

    // Wait for DOM and Supabase to be ready
    function waitForReady(cb) {
        var attempts = 0;
        var check = setInterval(function() {
            attempts++;
            if (window.supabaseClient && document.getElementById('adminDashboardScreen')) {
                clearInterval(check);
                cb();
            }
            if (attempts > 100) clearInterval(check);
        }, 300);
    }

    waitForReady(function() {
        console.log('[Fixes] Initializing workbooks, exams, calendar fixes...');
        initWorkbooksFix();
        initExamStudentSearch();
        initCalendarAttendance();
    });

    // ============================================================
    // FIX 1: WORKBOOKS TAB IN ZONA DE MAESTRO
    // ============================================================
    function initWorkbooksFix() {
        var tabBar = document.querySelector('[data-zm-tab="secciones"]');
        if (!tabBar) {
            console.warn('[Fixes] Zona de Maestro tab bar not found');
            return;
        }
        var tabContainer = tabBar.parentElement;
        if (document.querySelector('[data-zm-tab="libros"]')) return;

        var librosTab = document.createElement('button');
        librosTab.className = 'zm-tab';
        librosTab.setAttribute('data-zm-tab', 'libros');
        librosTab.style.cssText = 'padding:8px 18px;border-radius:20px;border:none;cursor:pointer;font-size:13px;font-weight:600;background:#f8fafc;color:#475569;margin:2px;';
        librosTab.innerHTML = '\uD83D\uDCDA Libros de Trabajo';
        librosTab.onclick = function() { showZmTab('libros'); };

        var desempenoTab = document.querySelector('[data-zm-tab="desempeno"]');
        if (desempenoTab) {
            tabContainer.insertBefore(librosTab, desempenoTab);
        } else {
            tabContainer.appendChild(librosTab);
        }

        var librosPanel = document.createElement('div');
        librosPanel.id = 'zmTabLibros';
        librosPanel.className = 'zm-tab-content';
        librosPanel.style.display = 'none';
        librosPanel.innerHTML = buildLibrosPanel();

        var lastPanel = document.getElementById('zmTabDesempeno') || document.getElementById('zmTabExamenes');
        if (lastPanel) {
            lastPanel.parentElement.insertBefore(librosPanel, lastPanel.nextSibling);
        }

        var origShowZmTab = window.showZmTab;
        window.showZmTab = function(tabName) {
            if (tabName === 'libros') {
                document.querySelectorAll('.zm-tab-content').forEach(function(el) { el.style.display = 'none'; });
                document.querySelectorAll('.zm-tab').forEach(function(btn) {
                    btn.style.background = '#f8fafc'; btn.style.color = '#475569';
                });
                var targetEl = document.getElementById('zmTabLibros');
                if (targetEl) targetEl.style.display = '';
                var activeBtn = document.querySelector('[data-zm-tab="libros"]');
                if (activeBtn) { activeBtn.style.background = '#f39c12'; activeBtn.style.color = '#fff'; }
                loadZmWorkbooks();
                return;
            }
            origShowZmTab(tabName);
        };
        console.log('[Fixes] Workbooks tab added to Zona de Maestro');
    }

    function buildLibrosPanel() {
        return '<div style="margin-bottom:12px;">' +
            '<h4 style="margin:0;color:#1e293b;font-size:14px;">\uD83D\uDCDA Libros de Trabajo / Material Educativo</h4>' +
            '</div>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;align-items:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<input type="text" id="zmBookSearch" placeholder="\uD83D\uDD0D Buscar por titulo, categoria..." ' +
            'style="width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#1a1a2e;color:#fff;font-size:13px;" ' +
            'oninput="filterZmBooks()">' +
            '</div>' +
            '<select id="zmBookCatFilter" onchange="filterZmBooks()" ' +
            'style="padding:10px;border-radius:8px;border:1px solid #444;background:#1a1a2e;color:#fff;">' +
            '<option value="">Todas las categorias</option>' +
            '<option value="General">General</option><option value="HVAC">HVAC</option>' +
            '<option value="Refrigeracion">Refrigeracion</option><option value="Electrico">Electrico</option>' +
            '<option value="EPA">EPA</option><option value="NATE">NATE</option>' +
            '</select>' +
            '<button onclick="loadZmWorkbooks()" style="padding:8px 16px;background:#2ecc71;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">\uD83D\uDD04 Actualizar</button>' +
            '</div>' +
            '<div id="zmBooksList" style="max-height:500px;overflow-y:auto;">' +
            '<div style="text-align:center;color:#94a3b8;padding:20px;">Cargando libros...</div>' +
            '</div>';
    }

    window.loadZmWorkbooks = async function() {
        var container = document.getElementById('zmBooksList');
        if (!container) return;
        try {
            var res = await supabaseClient.from('student_books').select('*').eq('activo', true).order('created_at', { ascending: false });
            var data = res.data || [];
            window._zmBooksData = data;
            renderZmBooks(data);
        } catch(e) {
            container.innerHTML = '<div style="color:#e74c3c;text-align:center;padding:20px;">Error cargando libros: ' + e.message + '</div>';
        }
    };

    window.filterZmBooks = function() {
        var search = (document.getElementById('zmBookSearch').value || '').toLowerCase();
        var cat = document.getElementById('zmBookCatFilter').value;
        var data = window._zmBooksData || [];
        var filtered = data.filter(function(b) {
            var matchSearch = !search || (b.titulo || '').toLowerCase().includes(search) || (b.descripcion || '').toLowerCase().includes(search) || (b.categoria || '').toLowerCase().includes(search);
            var matchCat = !cat || b.categoria === cat;
            return matchSearch && matchCat;
        });
        renderZmBooks(filtered);
    };

    function renderZmBooks(books) {
        var container = document.getElementById('zmBooksList');
        if (!container) return;
        if (books.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;font-size:13px;">No hay libros disponibles.</div>';
            return;
        }
        var html = '';
        books.forEach(function(b) {
            var catColors = {HVAC:'#3498db',EPA:'#27ae60',NATE:'#9b59b6',Electrico:'#f39c12',Refrigeracion:'#1abc9c',General:'#95a5a6'};
            var color = catColors[b.categoria] || '#95a5a6';
            html += '<div style="background:#f8fafc;border-radius:10px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;border:1px solid #eee;">' +
                '<div style="flex:1;"><div style="font-weight:bold;color:#1e293b;font-size:0.95em;">' + (b.titulo || 'Sin titulo') + '</div>' +
                '<div style="font-size:0.8em;color:#64748b;margin-top:2px;"><span style="background:' + color + ';color:#fff;padding:2px 8px;border-radius:10px;font-size:0.75em;">' + (b.categoria || 'General') + '</span>' +
                (b.asignado_a && b.asignado_a !== 'todos' ? ' \uD83D\uDCE7 ' + b.asignado_a : ' \uD83D\uDC65 Todos') + '</div>' +
                (b.descripcion ? '<div style="font-size:0.78em;color:#94a3b8;margin-top:4px;">' + b.descripcion + '</div>' : '') +
                '</div><div style="display:flex;gap:6px;align-items:center;">' +
                (b.file_url ? '<a href="' + b.file_url + '" target="_blank" style="padding:6px 14px;background:#3498db;color:#fff;border-radius:6px;text-decoration:none;font-size:0.8em;font-weight:bold;">\uD83D\uDCC1 Ver</a>' : '') +
                '</div></div>';
        });
        container.innerHTML = html;
    }

    // ============================================================
    // FIX 2: ENHANCED EXAM STUDENT SEARCH
    // ============================================================
    function initExamStudentSearch() {
        // Replace the exam section with enhanced version
        replaceExamSection();
        // Load student data
        loadExamStudentsData();
        // Override openCreateExamModal only if new exam system not loaded
        if (!window._zmExamSystemLoaded) {
            window.openCreateExamModal = function(type) {
                showExamCreationModal(type);
            };
        }
        console.log('[Fixes] Enhanced exam student search initialized');
    }

    function replaceExamSection() {
        var allH3 = document.querySelectorAll('h3');
        var examSection = null;
        for (var i = 0; i < allH3.length; i++) {
            if (allH3[i].textContent.indexOf('Asignar Ex\u00e1menes') !== -1) {
                examSection = allH3[i].parentElement;
                break;
            }
        }
        if (!examSection) {
            // Expected on student view — exam section only exists in admin CRM
            return;
        }

        examSection.innerHTML = '<h3 style="color:#2d3748;font-size:1.3em;margin-bottom:15px;">\uD83D\uDCDD Asignar Ex\u00e1menes</h3>' +
            '<div style="background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:20px;">' +
            '<h4 style="margin:0 0 15px 0;color:#166534;font-size:1em;">\u2795 Nuevo Examen</h4>' +
            '<div style="margin-bottom:15px;">' +
            '<label style="display:block;font-size:12px;color:#475569;font-weight:600;margin-bottom:6px;">\uD83D\uDD0D Buscar Estudiante (por nombre o n\u00famero de t\u00e9cnico)</label>' +
            '<div style="position:relative;">' +
            '<input type="text" id="examStudentSearchInput" placeholder="Escribir nombre del estudiante o n\u00famero de t\u00e9cnico..." autocomplete="off" ' +
            'style="width:100%;padding:12px 14px;border:2px solid #d1d5db;border-radius:10px;font-size:14px;box-sizing:border-box;transition:border-color 0.3s;outline:none;" ' +
            'onfocus="this.style.borderColor=\'#3b82f6\'" onblur="setTimeout(function(){document.getElementById(\'examStudentSearchInput\').style.borderColor=\'#d1d5db\'},200)">' +
            '<div id="examStudentSearchResults" style="position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;max-height:280px;overflow-y:auto;z-index:1000;display:none;box-shadow:0 10px 25px rgba(0,0,0,0.15);margin-top:4px;"></div>' +
            '</div></div>' +
            '<div id="examSelectedStudentCard" style="display:none;margin-bottom:15px;"></div>' +
            '<input type="hidden" id="examSelectedStudentEmail">' +
            '<input type="hidden" id="examSelectedStudentName">' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;">' +
            '<div style="flex:1;min-width:150px;">' +
            '<label style="display:block;font-size:11px;color:#64748b;font-weight:600;margin-bottom:4px;">\uD83C\uDFF7\uFE0F Filtrar por Tipo</label>' +
            '<select id="examFilterType" onchange="filterExamStudentSearch()" style="width:100%;padding:8px 10px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;">' +
            '<option value="">Todos los estudiantes</option>' +
            '<option value="premium">\uD83D\uDC8E Membres\u00edas (Premium)</option>' +
            '<option value="presencial">\uD83C\uDFEB Presencial</option>' +
            '<option value="free">\uD83C\uDD93 Gratuito</option>' +
            '</select></div>' +
            '<div style="flex:1;min-width:150px;">' +
            '<label style="display:block;font-size:11px;color:#64748b;font-weight:600;margin-bottom:4px;">\uD83D\uDCDA Filtrar por Clase</label>' +
            '<select id="examFilterClass" onchange="filterExamStudentSearch()" style="width:100%;padding:8px 10px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;">' +
            '<option value="">Todas las clases</option>' +
            '<option value="presencial">\uD83C\uDFEB Presencial</option>' +
            '<option value="zoom">\uD83D\uDCBB Zoom</option>' +
            '<option value="computadora">\uD83D\uDDA5\uFE0F Computadora</option>' +
            '<option value="movil">\uD83D\uDCF1 M\u00f3vil</option>' +
            '</select></div></div>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">' +
            '<div style="flex:2;min-width:200px;">' +
            '<label style="display:block;font-size:11px;color:#64748b;font-weight:600;margin-bottom:4px;">\uD83D\uDCDD T\u00edtulo del Examen</label>' +
            '<input type="text" id="examTitle" placeholder="Ej: Examen Semanal - Refrigeraci\u00f3n" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;box-sizing:border-box;">' +
            '</div><div style="flex:1;min-width:150px;">' +
            '<label style="display:block;font-size:11px;color:#64748b;font-weight:600;margin-bottom:4px;">\uD83D\uDCC5 Fecha L\u00edmite</label>' +
            '<input type="date" id="examDeadline" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;box-sizing:border-box;">' +
            '</div></div>' +
            '<div style="margin-bottom:15px;">' +
            '<label style="display:block;font-size:11px;color:#64748b;font-weight:600;margin-bottom:4px;">\uD83D\uDCCB Instrucciones / Descripci\u00f3n</label>' +
            '<textarea id="examDescription" rows="2" placeholder="Instrucciones o descripci\u00f3n del examen..." style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;resize:vertical;box-sizing:border-box;"></textarea>' +
            '</div>' +
            '<button onclick="assignExamNew()" style="padding:12px 28px;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(22,163,74,0.3);">\uD83D\uDCDD ASIGNAR EXAMEN</button>' +
            '</div>' +
            '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">' +
            '<h4 style="margin:0;color:#1e293b;font-size:1em;">\uD83D\uDCCB Ex\u00e1menes Asignados</h4>' +
            '<button onclick="loadAdminExamsNew()" style="padding:6px 16px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">\uD83D\uDD04 Actualizar</button>' +
            '</div><div id="adminExamsList">Cargando ex\u00e1menes...</div></div>';

        // Setup search event listener
        setTimeout(function() {
            var searchInput = document.getElementById('examStudentSearchInput');
            if (searchInput) {
                var searchTimer = null;
                searchInput.addEventListener('input', function() {
                    clearTimeout(searchTimer);
                    var query = this.value.trim();
                    if (query.length < 2) {
                        document.getElementById('examStudentSearchResults').style.display = 'none';
                        return;
                    }
                    searchTimer = setTimeout(function() {
                        performExamStudentSearch(query);
                    }, 200);
                });
            }
            // Close results on outside click
            document.addEventListener('click', function(e) {
                if (!e.target.closest('#examStudentSearchInput') && !e.target.closest('#examStudentSearchResults')) {
                    var rd = document.getElementById('examStudentSearchResults');
                    if (rd) rd.style.display = 'none';
                }
            });
            // Load exams list
            loadAdminExamsNew();
        }, 500);
    }

    // Load students data with class types and premium status
    async function loadExamStudentsData() {
        try {
            var usersRes = await usersDataAdmin('admin_list', { fields: ['id','nombre','email','technician_number','premium','telefono','auth_id'], order_by: 'nombre', ascending: true, limit: 5000 });
            var users = usersRes.data || [];

            var attRes = await supabaseClient.from('attendance')
                .select('student_id, class_type')
                .order('check_in', { ascending: false });
            var attData = attRes.data || [];

            var classMap = {};
            attData.forEach(function(a) {
                if (a.student_id && !classMap[a.student_id]) {
                    classMap[a.student_id] = a.class_type;
                }
            });

            window._examStudentsData = users.map(function(u) {
                return {
                    id: u.id,
                    nombre: u.nombre || '',
                    email: u.email || '',
                    technician_number: u.technician_number || '',
                    premium: u.premium || false,
                    telefono: u.telefono || '',
                    class_type: classMap[u.id] || classMap[u.auth_id] || ''
                };
            });
            window._examStudentsLoaded = true;
            console.log('[Fixes] Loaded ' + window._examStudentsData.length + ' students for exam search');
        } catch(e) {
            console.error('[Fixes] Error loading exam students:', e);
            window._examStudentsData = [];
        }
    }

    // Perform search on students
    window.performExamStudentSearch = function(query) {
        var resultsDiv = document.getElementById('examStudentSearchResults');
        if (!resultsDiv) return;
        var q = query.toLowerCase();
        var filterType = (document.getElementById('examFilterType') || {}).value || '';
        var filterClass = (document.getElementById('examFilterClass') || {}).value || '';

        var students = (window._examStudentsData || []).filter(function(s) {
            var matchText = (s.nombre && s.nombre.toLowerCase().indexOf(q) !== -1) ||
                (s.email && s.email.toLowerCase().indexOf(q) !== -1) ||
                (s.technician_number && String(s.technician_number).indexOf(q) !== -1);
            if (!matchText) return false;
            if (filterType === 'premium' && !s.premium) return false;
            if (filterType === 'presencial' && s.class_type !== 'presencial') return false;
            if (filterType === 'free' && s.premium) return false;
            if (filterClass && s.class_type !== filterClass) return false;
            return true;
        }).slice(0, 20);

        if (students.length === 0) {
            resultsDiv.innerHTML = '<div style="padding:16px;text-align:center;color:#94a3b8;">' +
                '<div style="font-size:24px;margin-bottom:6px;">\uD83D\uDD0D</div>' +
                '<div style="font-size:13px;">No se encontraron estudiantes</div>' +
                '<div style="font-size:11px;color:#cbd5e1;margin-top:4px;">Intenta con otro nombre o n\u00famero de t\u00e9cnico</div></div>';
            resultsDiv.style.display = 'block';
            return;
        }

        var classIcons = { presencial: '\uD83C\uDFEB', zoom: '\uD83D\uDCBB', computadora: '\uD83D\uDDA5\uFE0F', movil: '\uD83D\uDCF1' };
        var html = '';
        students.forEach(function(s) {
            var premiumBadge = s.premium
                ? '<span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;">\uD83D\uDC8E MEMBRES\u00cdA</span>'
                : '<span style="background:#e2e8f0;color:#64748b;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;">\uD83C\uDD93 Gratuito</span>';
            var classBadge = s.class_type
                ? '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;">' + (classIcons[s.class_type] || '\uD83D\uDCDA') + ' ' + s.class_type.charAt(0).toUpperCase() + s.class_type.slice(1) + '</span>'
                : '<span style="background:#f1f5f9;color:#94a3b8;padding:2px 8px;border-radius:12px;font-size:10px;">Sin clase asignada</span>';
            var techNum = s.technician_number
                ? '<span style="color:#7c3aed;font-weight:700;font-size:12px;">\uD83D\uDD22 #' + s.technician_number + '</span>'
                : '<span style="color:#cbd5e1;font-size:11px;">Sin # t\u00e9cnico</span>';

            var safeEmail = (s.email || '').replace(/'/g, "\\'");
            var safeName = (s.nombre || '').replace(/'/g, "\\'");

            html += '<div onclick="selectExamStudentNew(\'' + safeEmail + '\', \'' + safeName + '\', \'' + (s.technician_number || '') + '\', ' + (s.premium ? 'true' : 'false') + ', \'' + (s.class_type || '') + '\')" ' +
                'style="padding:12px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;transition:all 0.2s;" ' +
                'onmouseover="this.style.background=\'#f0f9ff\'" onmouseout="this.style.background=\'#fff\'">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
                '<span style="font-weight:700;color:#1e293b;font-size:13px;">\uD83D\uDC64 ' + (s.nombre || 'Sin nombre') + '</span>' + techNum + '</div>' +
                '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">' +
                '<span style="color:#64748b;font-size:11px;">\uD83D\uDCE7 ' + (s.email || '') + '</span>' + premiumBadge + classBadge + '</div></div>';
        });
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    };

    window.filterExamStudentSearch = function() {
        var query = (document.getElementById('examStudentSearchInput') || {}).value || '';
        if (query.trim().length >= 2) {
            performExamStudentSearch(query.trim());
        }
    };

    // Select a student from search results
    window.selectExamStudentNew = function(email, nombre, techNum, premium, classType) {
        document.getElementById('examSelectedStudentEmail').value = email;
        document.getElementById('examSelectedStudentName').value = nombre;
        document.getElementById('examStudentSearchInput').value = nombre;
        document.getElementById('examStudentSearchResults').style.display = 'none';

        var card = document.getElementById('examSelectedStudentCard');
        var premiumBadge = premium
            ? '<span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:3px 12px;border-radius:16px;font-size:11px;font-weight:700;">\uD83D\uDC8E MEMBRES\u00cdA ACTIVA</span>'
            : '<span style="background:#e2e8f0;color:#64748b;padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;">\uD83C\uDD93 Plan Gratuito</span>';
        var classLabels = { presencial: '\uD83C\uDFEB Presencial', zoom: '\uD83D\uDCBB Zoom', computadora: '\uD83D\uDDA5\uFE0F Computadora', movil: '\uD83D\uDCF1 M\u00f3vil' };
        var classBadge = classType
            ? '<span style="background:#dbeafe;color:#1d4ed8;padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;">' + (classLabels[classType] || classType) + '</span>'
            : '<span style="background:#f1f5f9;color:#94a3b8;padding:3px 12px;border-radius:16px;font-size:11px;">Sin clase asignada</span>';
        var techBadge = techNum
            ? '<span style="background:#ede9fe;color:#7c3aed;padding:3px 12px;border-radius:16px;font-size:11px;font-weight:700;">\uD83D\uDD22 T\u00e9cnico #' + techNum + '</span>'
            : '';

        card.innerHTML = '<div style="background:linear-gradient(135deg,#eff6ff,#f0f9ff);border:2px solid #93c5fd;border-radius:12px;padding:14px;position:relative;">' +
            '<button onclick="clearExamStudentSelection()" style="position:absolute;top:8px;right:10px;background:none;border:none;font-size:16px;cursor:pointer;color:#94a3b8;line-height:1;" title="Quitar selecci\u00f3n">\u2715</button>' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
            '<div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#2563eb);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;">' +
            nombre.charAt(0).toUpperCase() + '</div>' +
            '<div><div style="font-weight:700;color:#1e293b;font-size:15px;">' + nombre + '</div>' +
            '<div style="color:#64748b;font-size:12px;">\uD83D\uDCE7 ' + email + '</div></div></div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + premiumBadge + classBadge + techBadge + '</div></div>';
        card.style.display = 'block';
    };

    window.clearExamStudentSelection = function() {
        document.getElementById('examSelectedStudentEmail').value = '';
        document.getElementById('examSelectedStudentName').value = '';
        document.getElementById('examStudentSearchInput').value = '';
        document.getElementById('examSelectedStudentCard').style.display = 'none';
    };

    // Assign exam to selected student
    window.assignExamNew = async function() {
        var email = document.getElementById('examSelectedStudentEmail').value;
        var studentName = document.getElementById('examSelectedStudentName').value;
        var title = (document.getElementById('examTitle').value || '').trim();
        var description = (document.getElementById('examDescription').value || '').trim();
        var deadline = document.getElementById('examDeadline').value;

        if (!email) { alert('\u26A0\uFE0F Selecciona un estudiante primero usando el buscador'); return; }
        if (!title) { alert('\u26A0\uFE0F Escribe un t\u00edtulo para el examen'); return; }

        try {
            var res = await supabaseClient.from('assigned_exams').insert({
                student_email: email,
                student_name: studentName,
                titulo: title,
                descripcion: description || null,
                fecha_limite: deadline ? new Date(deadline).toISOString() : null,
                estado: 'pendiente'
            });
            if (res.error) throw res.error;
            alert('\u2705 Examen "' + title + '" asignado exitosamente a ' + studentName);
            clearExamStudentSelection();
            document.getElementById('examTitle').value = '';
            document.getElementById('examDescription').value = '';
            document.getElementById('examDeadline').value = '';
            loadAdminExamsNew();
        } catch(e) {
            alert('\u274C Error al asignar examen: ' + (e.message || e));
        }
    };

    // Also override the old assignExam
    window.assignExam = window.assignExamNew;

    // Load and display assigned exams
    window.loadAdminExamsNew = async function() {
        var container = document.getElementById('adminExamsList');
        if (!container) return;
        container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:20px;">\u23F3 Cargando ex\u00e1menes...</div>';
        try {
            var res = await supabaseClient.from('assigned_exams').select('*').order('created_at', { ascending: false }).limit(50);
            var exams = res.data || [];
            if (exams.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:30px;">' +
                    '<div style="font-size:40px;margin-bottom:10px;">\uD83D\uDCED</div>' +
                    '<div style="color:#94a3b8;font-size:14px;">No hay ex\u00e1menes asignados todav\u00eda.</div>' +
                    '<div style="color:#cbd5e1;font-size:12px;margin-top:6px;">Usa el formulario de arriba para asignar un examen a un estudiante.</div></div>';
                return;
            }
            var html = '<div style="display:flex;flex-direction:column;gap:8px;">';
            exams.forEach(function(ex) {
                var statusColors = {
                    pendiente: { bg: '#fef3c7', color: '#92400e', icon: '\u23F3' },
                    en_progreso: { bg: '#dbeafe', color: '#1e40af', icon: '\uD83D\uDCDD' },
                    completado: { bg: '#dcfce7', color: '#166534', icon: '\u2705' },
                    vencido: { bg: '#fee2e2', color: '#991b1b', icon: '\u26A0\uFE0F' }
                };
                var status = statusColors[ex.estado] || statusColors.pendiente;
                var fechaLimite = ex.fecha_limite ? new Date(ex.fecha_limite).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha l\u00edmite';
                var createdAt = ex.created_at ? new Date(ex.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : '';

                html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;">' +
                    '<div style="flex:1;"><div style="font-weight:700;color:#1e293b;font-size:13px;">' + (ex.titulo || 'Sin t\u00edtulo') + '</div>' +
                    '<div style="font-size:12px;color:#64748b;margin-top:3px;">\uD83D\uDC64 ' + (ex.student_name || ex.student_email || 'Desconocido') +
                    (ex.student_email ? ' | \uD83D\uDCE7 ' + ex.student_email : '') + '</div>' +
                    (ex.descripcion ? '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">' + (ex.descripcion.length > 80 ? ex.descripcion.substring(0, 80) + '...' : ex.descripcion) + '</div>' : '') +
                    '</div><div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">' +
                    '<div style="text-align:right;"><div style="font-size:11px;color:#94a3b8;">\uD83D\uDCC5 ' + fechaLimite + '</div>' +
                    '<div style="font-size:10px;color:#cbd5e1;">Creado: ' + createdAt + '</div></div>' +
                    '<span style="background:' + status.bg + ';color:' + status.color + ';padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap;">' +
                    status.icon + ' ' + (ex.estado || 'pendiente') + '</span>' +
                    (ex.calificacion !== null && ex.calificacion !== undefined ? '<span style="background:#ede9fe;color:#7c3aed;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;">\uD83C\uDFAF ' + ex.calificacion + '%</span>' : '') +
                    '</div></div>';
            });
            html += '</div>';
            container.innerHTML = html;
        } catch(e) {
            container.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;">\u274C Error al cargar ex\u00e1menes: ' + e.message + '</div>';
        }
    };

    // Override old loadAdminExams
    window.loadAdminExams = window.loadAdminExamsNew;

    // Exam creation modal for Zona de Maestro
    function showExamCreationModal(type) {
        var existing = document.getElementById('examCreationModal');
        if (existing) existing.remove();
        var typeLabel = type === 'semanal' ? '\uD83D\uDCCB Examen Semanal' : '\uD83D\uDCDA Examen Mensual';
        var typeColor = type === 'semanal' ? '#27ae60' : '#e74c3c';

        var modal = document.createElement('div');
        modal.id = 'examCreationModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;display:flex;justify-content:center;align-items:center;';
        modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
            '<h3 style="margin:0;color:#1e293b;">' + typeLabel + '</h3>' +
            '<button onclick="document.getElementById(\'examCreationModal\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;">\u2715</button></div>' +
            '<div style="margin-bottom:12px;">' +
            '<label style="display:block;font-size:12px;color:#64748b;margin-bottom:4px;font-weight:600;">\uD83D\uDC64 Buscar Estudiante (nombre o # tecnico)</label>' +
            '<input type="text" id="modalExamStudentSearch" placeholder="Escribir nombre o numero de tecnico..." ' +
            'style="width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;font-size:13px;box-sizing:border-box;" oninput="searchExamStudents(this.value)">' +
            '<div id="modalExamStudentResults" style="max-height:150px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-top:4px;display:none;"></div>' +
            '<input type="hidden" id="modalExamStudentEmail">' +
            '<div id="modalExamSelectedStudent" style="margin-top:6px;display:none;padding:8px;background:#e8f5e9;border-radius:8px;font-size:13px;"></div></div>' +
            '<div style="margin-bottom:12px;"><label style="display:block;font-size:12px;color:#64748b;margin-bottom:4px;font-weight:600;">\uD83D\uDCDD Titulo del Examen</label>' +
            '<input type="text" id="modalExamTitle" placeholder="Ej: Examen Semanal - Refrigeracion" style="width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;font-size:13px;box-sizing:border-box;"></div>' +
            '<div style="margin-bottom:12px;"><label style="display:block;font-size:12px;color:#64748b;margin-bottom:4px;font-weight:600;">\uD83D\uDCCB Descripcion (opcional)</label>' +
            '<textarea id="modalExamDesc" rows="2" placeholder="Instrucciones o detalles del examen..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;font-size:13px;resize:vertical;box-sizing:border-box;"></textarea></div>' +
            '<div style="display:flex;gap:10px;margin-bottom:16px;"><div style="flex:1;">' +
            '<label style="display:block;font-size:12px;color:#64748b;margin-bottom:4px;font-weight:600;">\uD83D\uDCC5 Fecha Limite</label>' +
            '<input type="date" id="modalExamDeadline" style="width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;font-size:13px;box-sizing:border-box;"></div>' +
            '<div style="flex:1;"><label style="display:block;font-size:12px;color:#64748b;margin-bottom:4px;font-weight:600;">\u2753 # Preguntas</label>' +
            '<input type="number" id="modalExamQuestions" value="20" min="5" max="100" style="width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;font-size:13px;box-sizing:border-box;"></div></div>' +
            '<div style="display:flex;gap:10px;">' +
            '<button onclick="submitNewExam(\'' + type + '\')" style="flex:1;padding:12px;background:' + typeColor + ';color:#fff;border:none;border-radius:8px;font-weight:bold;cursor:pointer;font-size:14px;">\u2705 Crear y Asignar Examen</button>' +
            '<button onclick="document.getElementById(\'examCreationModal\').remove()" style="padding:12px 20px;background:#e2e8f0;color:#475569;border:none;border-radius:8px;cursor:pointer;font-size:14px;">Cancelar</button></div></div>';
        document.body.appendChild(modal);
        setTimeout(function() { var si = document.getElementById('modalExamStudentSearch'); if (si) si.focus(); }, 200);
    }

    window.searchExamStudents = function(query) {
        var resultsDiv = document.getElementById('modalExamStudentResults');
        if (!resultsDiv) return;
        if (!query || query.length < 2) { resultsDiv.style.display = 'none'; return; }
        var q = query.toLowerCase();
        var students = (window._examStudentsData || []).filter(function(s) {
            return (s.nombre && s.nombre.toLowerCase().indexOf(q) !== -1) ||
                (s.email && s.email.toLowerCase().indexOf(q) !== -1) ||
                (s.technician_number && String(s.technician_number).indexOf(q) !== -1);
        }).slice(0, 15);
        if (students.length === 0) {
            resultsDiv.innerHTML = '<div style="padding:10px;color:#94a3b8;text-align:center;font-size:12px;">No se encontraron estudiantes</div>';
            resultsDiv.style.display = 'block';
            return;
        }
        var html = '';
        students.forEach(function(s) {
            var safeEmail = (s.email || '').replace(/'/g, "\\'");
            var safeName = (s.nombre || '').replace(/'/g, "\\'");
            html += '<div onclick="selectExamStudent(\'' + safeEmail + '\', \'' + safeName + '\', \'' + (s.technician_number || '') + '\')" ' +
                'style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f1f5f9;font-size:12px;transition:background 0.2s;" ' +
                'onmouseover="this.style.background=\'#f0f9ff\'" onmouseout="this.style.background=\'#fff\'">' +
                '<div style="font-weight:600;color:#1e293b;">' + (s.nombre || 'Sin nombre') + '</div>' +
                '<div style="color:#64748b;font-size:11px;">\uD83D\uDCE7 ' + (s.email || '') +
                (s.technician_number ? ' | \uD83D\uDD22 #' + s.technician_number : '') + '</div></div>';
        });
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    };

    window.selectExamStudent = function(email, nombre, techNum) {
        document.getElementById('modalExamStudentEmail').value = email;
        document.getElementById('modalExamStudentSearch').value = nombre;
        document.getElementById('modalExamStudentResults').style.display = 'none';
        var selected = document.getElementById('modalExamSelectedStudent');
        selected.style.display = 'block';
        selected.innerHTML = '\u2705 <strong>' + nombre + '</strong> | ' + email + (techNum ? ' | #' + techNum : '');
    };

    window.submitNewExam = async function(type) {
        var email = document.getElementById('modalExamStudentEmail').value;
        var title = (document.getElementById('modalExamTitle').value || '').trim();
        var desc = (document.getElementById('modalExamDesc').value || '').trim();
        var deadline = document.getElementById('modalExamDeadline').value;
        var numQuestions = parseInt(document.getElementById('modalExamQuestions').value) || 20;
        if (!email) { alert('Selecciona un estudiante'); return; }
        if (!title) { alert('Escribe un titulo para el examen'); return; }
        var studentName = document.getElementById('modalExamStudentSearch').value;
        try {
            var res = await supabaseClient.from('assigned_exams').insert({
                student_email: email, student_name: studentName, titulo: title,
                descripcion: desc || null, fecha_limite: deadline ? new Date(deadline).toISOString() : null, estado: 'pendiente'
            });
            if (res.error) throw res.error;
            var zmRes = await supabaseClient.from('zm_exams').insert({
                title: title, type: type === 'semanal' ? 'semanal' : 'mensual',
                question_count: numQuestions, status: 'active', open_date: new Date().toISOString(),
                close_date: deadline ? new Date(deadline).toISOString() : null
            });
            alert('\u2705 Examen asignado a ' + studentName);
            document.getElementById('examCreationModal').remove();
            if (typeof loadAdminExamsNew === 'function') loadAdminExamsNew();
            if (typeof loadExams === 'function') loadExams();
        } catch(e) {
            alert('Error: ' + (e.message || e));
        }
    };

    // ============================================================
    // FIX 3: CALENDAR ATTENDANCE VIEW
    // ============================================================
    function initCalendarAttendance() {
        var origRenderCalendar = window.renderCalendar;
        window.renderCalendar = function() {
            var container = document.getElementById('calendarClassList');
            if (!container) return;
            var now = new Date();
            var thisWeek = (window.liveClasses || []).filter(function(c) {
                var d = new Date(c.fecha);
                var weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
                var weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7);
                return d >= weekStart && d <= weekEnd;
            });
            var completed = (window.liveClasses || []).filter(function(c) { return c.estado === 'completada'; });
            var calThisWeek = document.getElementById('calThisWeek');
            var calCompleted = document.getElementById('calCompleted');
            var calAvg = document.getElementById('calAvgAttendance');
            if (calThisWeek) calThisWeek.textContent = thisWeek.length;
            if (calCompleted) calCompleted.textContent = completed.length;
            if (calAvg) calAvg.textContent = '\u2014';
            if ((window.liveClasses || []).length === 0) {
                container.innerHTML = '<div style="text-align:center;color:#64748b;padding:20px;">No hay clases programadas</div>';
                return;
            }
            var html = (window.liveClasses || []).map(function(c) {
                var d = new Date(c.fecha);
                var dayName = d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
                var isPast = c.estado === 'completada';
                var isToday = d.toDateString() === now.toDateString();
                var borderColor = isToday ? '#00d4ff' : (isPast ? '#27ae60' : '#f39c12');
                var statusIcon = isPast ? '\u2705 ' : (isToday ? '\uD83D\uDD34 EN VIVO' : '\uD83D\uDCC5');
                var horaInicio = c.hora_inicio || ''; var horaFin = c.hora_fin || '';
                var timeStr = horaInicio && horaFin ? horaInicio + ' - ' + horaFin : '';
                var safeTitle = (c.titulo || '').replace(/'/g, "\\'");
                return '<div onclick="showClassAttendance(\'' + c.id + '\', \'' + safeTitle + '\', \'' + dayName + '\')" ' +
                    'style="display:flex;gap:12px;padding:10px;border-left:3px solid ' + borderColor + ';background:rgba(255,255,255,0.03);border-radius:0 8px 8px 0;margin:4px 0;cursor:pointer;transition:background 0.2s;" ' +
                    'onmouseover="this.style.background=\'rgba(59,130,246,0.1)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.03)\'">' +
                    '<div style="min-width:100px;"><div style="font-size:0.85em;color:#94a3b8;">' + dayName + '</div>' +
                    '<div style="font-size:0.75em;color:#64748b;">' + timeStr + '</div></div>' +
                    '<div style="flex:1;"><div style="font-size:0.85em;color:#e2e8f0;">' + (c.titulo || 'Clase') + '</div>' +
                    '<div style="font-size:0.7em;color:#64748b;">' + statusIcon + ' | \uD83C\uDDFA\uD83C\uDDF8 ' + (c.instructor || 'Instructor') + '</div></div>' +
                    '<div style="display:flex;align-items:center;"><span style="font-size:18px;color:#64748b;" title="Ver asistencia">\uD83D\uDCCB</span></div></div>';
            }).join('');
            container.innerHTML = html;
        };

        window.showClassAttendance = async function(classId, classTitle, classDate) {
            var existing = document.getElementById('classAttendanceModal');
            if (existing) existing.remove();
            var modal = document.createElement('div');
            modal.id = 'classAttendanceModal';
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;display:flex;justify-content:center;align-items:center;';
            modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:650px;width:95%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><div>' +
                '<h3 style="margin:0;color:#1e293b;">\uD83D\uDCCB Asistencia - ' + classTitle + '</h3>' +
                '<div style="font-size:12px;color:#64748b;margin-top:4px;">\uD83D\uDCC5 ' + classDate + '</div></div>' +
                '<button onclick="document.getElementById(\'classAttendanceModal\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;">\u2715</button></div>' +
                '<div id="classAttendanceContent" style="min-height:100px;">' +
                '<div style="text-align:center;color:#94a3b8;padding:30px;">\u23F3 Cargando asistencia...</div></div></div>';
            document.body.appendChild(modal);

            try {
                var classData = (window.liveClasses || []).find(function(c) { return c.id === classId; });
                if (!classData) {
                    document.getElementById('classAttendanceContent').innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;">Clase no encontrada</div>';
                    return;
                }
                var classDateObj = new Date(classData.fecha);
                var startOfDay = new Date(classDateObj); startOfDay.setHours(0,0,0,0);
                var endOfDay = new Date(classDateObj); endOfDay.setHours(23,59,59,999);

                var attRes = await supabaseClient.from('attendance').select('*')
                    .gte('check_in', startOfDay.toISOString()).lte('check_in', endOfDay.toISOString())
                    .order('check_in', { ascending: true });
                var attData = attRes.data || [];

                if (attData.length === 0) {
                    document.getElementById('classAttendanceContent').innerHTML = '<div style="text-align:center;padding:30px;">' +
                        '<div style="font-size:40px;margin-bottom:10px;">\uD83D\uDCED</div>' +
                        '<div style="color:#94a3b8;font-size:14px;">No hay registros de asistencia para esta clase.</div>' +
                        '<div style="color:#cbd5e1;font-size:12px;margin-top:6px;">Los estudiantes apareceran aqui cuando hagan check-in.</div></div>';
                    return;
                }

                var studentIds = [];
                attData.forEach(function(r) { if (studentIds.indexOf(r.student_id) === -1) studentIds.push(r.student_id); });
                var userMap = {};
                if (studentIds.length > 0) {
                    try {
                        var usersRes = await usersDataAdmin('admin_list', { filters: { auth_id_in: studentIds }, fields: ['id','auth_id','nombre','email','technician_number'], limit: 5000 });
                        if (usersRes.data) {
                            usersRes.data.forEach(function(u) {
                                userMap[u.auth_id] = { nombre: u.nombre || (u.email ? u.email.split('@')[0] : 'Desconocido'), email: u.email || '', techNum: u.technician_number || '' };
                            });
                        }
                    } catch(e) { console.warn('[Fixes] Error loading user names:', e); }
                }

                var html = '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
                    '<span style="font-size:13px;color:#475569;font-weight:600;">\uD83D\uDC65 ' + attData.length + ' estudiante(s) registrados</span>' +
                    '<span style="font-size:12px;color:#94a3b8;">Check-in del dia</span></div>' +
                    '<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:#f8fafc;">' +
                    '<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0;color:#475569;">\uD83D\uDC64 Estudiante</th>' +
                    '<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0;color:#475569;">\uD83D\uDD22 # Tecnico</th>' +
                    '<th style="padding:10px;text-align:center;border-bottom:2px solid #e2e8f0;color:#475569;">\u23F0 Check-in</th>' +
                    '<th style="padding:10px;text-align:center;border-bottom:2px solid #e2e8f0;color:#475569;">\u23F1 Check-out</th>' +
                    '<th style="padding:10px;text-align:center;border-bottom:2px solid #e2e8f0;color:#475569;">\u23F3 Tiempo</th>' +
                    '<th style="padding:10px;text-align:center;border-bottom:2px solid #e2e8f0;color:#475569;">Estado</th></tr></thead><tbody>';

                attData.forEach(function(r) {
                    var user = userMap[r.student_id] || { nombre: (r.student_id || '').substring(0, 8) + '...', techNum: '', email: '' };
                    var timeIn = new Date(r.check_in).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                    var timeOut = r.check_out ? new Date(r.check_out).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '<span style="color:#f39c12;">\uD83D\uDFE2 En clase</span>';
                    var minutes = r.total_minutes ? (r.total_minutes / 60).toFixed(1) + 'h' : '\u2014';
                    var statusColor = r.status === 'presente' ? '#27ae60' : '#f39c12';
                    html += '<tr style="border-bottom:1px solid #f1f5f9;">' +
                        '<td style="padding:10px;"><div style="font-weight:600;color:#1e293b;">' + user.nombre + '</div>' +
                        '<div style="font-size:11px;color:#94a3b8;">' + user.email + '</div></td>' +
                        '<td style="padding:10px;color:#6366f1;font-weight:600;">' + (user.techNum ? '#' + user.techNum : '\u2014') + '</td>' +
                        '<td style="padding:10px;text-align:center;color:#475569;">' + timeIn + '</td>' +
                        '<td style="padding:10px;text-align:center;">' + timeOut + '</td>' +
                        '<td style="padding:10px;text-align:center;color:#475569;">' + minutes + '</td>' +
                        '<td style="padding:10px;text-align:center;"><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;background:' + statusColor + '22;color:' + statusColor + ';">' + (r.status || 'presente') + '</span></td></tr>';
                });
                html += '</tbody></table>';
                document.getElementById('classAttendanceContent').innerHTML = html;
            } catch(e) {
                document.getElementById('classAttendanceContent').innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;">Error: ' + e.message + '</div>';
            }
        };

        if (typeof window.renderCalendar === 'function' && window.liveClasses) {
            window.renderCalendar();
        }
        console.log('[Fixes] Calendar attendance view initialized');
    }

})();
