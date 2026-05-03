// ============================================
// MAESTRO HVACR MARKETPLACE — P2P Classified Board
// OfferUp-style local marketplace for technicians
// April 2026
// ============================================
(function() {
  'use strict';

  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

  var SB = null;
  var _email = '';
  var _seller = null; // marketplace_sellers row
  var _listings = [];
  var _currentPage = 0;
  var _loading = false;
  var _userLat = null;
  var _userLng = null;
  var _maxDistanceMiles = 25;
  var _filterCategory = '';
  var _filterSearch = '';
  var _currentDetail = null;
  var PAGE_SIZE = 20;

  var _inputCSS = 'padding:10px 12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#F2F2F7;color:#1C1C1E;font-size:14px;width:100%;box-sizing:border-box;outline:none;';
  var _labelCSS = 'font-size:11px;color:#374151;margin-bottom:3px;font-weight:600;display:block;';
  var _btnCSS = 'border:none;border-radius:12px;font-weight:700;cursor:pointer;transition:all 0.2s;';

  var CATEGORIES = [
    { value: 'hvac', label: 'HVAC', icon: '❄️' },
    { value: 'tools', label: 'Herramientas', icon: '🔧' },
    { value: 'electrical', label: 'Eléctrico', icon: '⚡' },
    { value: 'construction', label: 'Construcción', icon: '🏗️' },
    { value: 'vehicles', label: 'Vehículos', icon: '🚐' },
    { value: 'electronics', label: 'Electrónica', icon: '📱' },
    { value: 'furniture', label: 'Muebles', icon: '🪑' },
    { value: 'clothing', label: 'Ropa', icon: '👕' },
    { value: 'general', label: 'General', icon: '📦' }
  ];

  var CONDITIONS = [
    { value: 'new', label: 'Nuevo', color: '#16a34a' },
    { value: 'like_new', label: 'Como Nuevo', color: '#3b82f6' },
    { value: 'used_good', label: 'Buen Estado', color: '#eab308' },
    { value: 'used_fair', label: 'Usado', color: '#f97316' },
    { value: 'for_parts', label: 'Para Partes', color: '#ef4444' }
  ];

  var PROHIBITED_ITEMS = ['armas', 'drogas', 'medicamentos', 'animales', 'materiales peligrosos', 'weapons', 'drugs', 'firearms', 'ammunition'];

  // ── Distance calculation (Haversine) ─────────────────────────
  function _distanceMiles(lat1, lng1, lat2, lng2) {
    if (!lat1 || !lng1 || !lat2 || !lng2) return 9999;
    var R = 3959; // Earth radius in miles
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Get user location ────────────────────────────────────────
  function _getUserLocation(cb) {
    if (_userLat && _userLng) { cb(); return; }
    if (!navigator.geolocation) { cb(); return; }
    navigator.geolocation.getCurrentPosition(function(pos) {
      _userLat = pos.coords.latitude;
      _userLng = pos.coords.longitude;
      cb();
    }, function() { cb(); }, { timeout: 8000, maximumAge: 300000 });
  }

  // ── Auth headers for edge functions ──────────────────────────
  function _mpGetAuthHeaders() {
    var sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '');
    var headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sbKey, 'apikey': sbKey };
    return new Promise(function(resolve) {
      try {
        if (SB && SB.auth) {
          SB.auth.getSession().then(function(sess) {
            if (sess && sess.data && sess.data.session && sess.data.session.access_token) {
              headers['Authorization'] = 'Bearer ' + sess.data.session.access_token;
            }
            resolve(headers);
          }).catch(function() { resolve(headers); });
        } else { resolve(headers); }
      } catch(e) { resolve(headers); }
    });
  }

  // ── Toast ────────────────────────────────────────────────────
  function _toast(msg, type) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;color:#fff;z-index:99999;backdrop-filter:blur(12px);' +
      (type === 'error' ? 'background:rgba(239,68,68,0.9);' : 'background:rgba(34,197,94,0.9);');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
  }

  // ══════════════════════════════════════════════════════════════
  // INIT — Entry point
  // ══════════════════════════════════════════════════════════════
  function initMarketplace() {
    var screen = document.getElementById('marketplaceScreen');
    if (!screen) return;
    if (screen.querySelector('.mp-loaded')) return;
    SB = window.supabaseClient;
    _email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
    if (!SB || !_email) return;

    _checkPaymentReturn();

    // Check if seller is already verified
    _loadSellerProfile(function() {
      if (!_seller || !_seller.tos_accepted) {
        _showOnboarding(screen);
      } else {
        _renderMarketplace(screen);
      }
    });
  }
  window.initMarketplace = initMarketplace;

  // ══════════════════════════════════════════════════════════════
  // SELLER PROFILE
  // ══════════════════════════════════════════════════════════════
  function _loadSellerProfile(cb) {
    SB.from('marketplace_sellers').select('*').eq('user_email', _email).limit(1).then(function(res) {
      _seller = (res.data && res.data.length > 0) ? res.data[0] : null;
      if (cb) cb();
    }).catch(function() { if (cb) cb(); });
  }

  // ══════════════════════════════════════════════════════════════
  // ONBOARDING — TOS + NDA + Photo + Gov ID
  // ══════════════════════════════════════════════════════════════
  function _showOnboarding(screen) {
    var step = 1;
    var photoFile = null;
    var govIdFile = null;

    function render() {
      var html = '<div class="mp-loaded" style="min-height:100vh;background:#F5F5F7;padding:0;">';
      html += '<div class="sticky-nav-bar sticky-nav-bar--light"><button class="btn-nav-back" data-nav="dashboardScreen">← Volver</button><span class="nav-bar-title">Marketplace</span></div>';
      html += '<div style="padding:20px;max-width:500px;margin:0 auto;">';

      // Progress bar
      html += '<div style="display:flex;gap:4px;margin-bottom:24px;">';
      for (var i = 1; i <= 4; i++) {
        var color = i <= step ? '#3b82f6' : 'rgba(0,0,0,0.08)';
        html += '<div style="flex:1;height:4px;border-radius:2px;background:' + color + ';"></div>';
      }
      html += '</div>';

      if (step === 1) {
        // Welcome + TOS
        html += '<div style="text-align:center;margin-bottom:24px;">';
        html += '<div style="font-size:48px;margin-bottom:12px;">🏪</div>';
        html += '<h2 style="font-size:22px;font-weight:900;color:#1C1C1E;margin:0 0 8px;">Maestro HVACR Marketplace</h2>';
        html += '<p style="font-size:14px;color:#3C3C43;margin:0;">Compra y vende localmente con otros técnicos</p>';
        html += '</div>';
        html += '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:16px;margin-bottom:16px;max-height:250px;overflow-y:auto;font-size:12px;color:#3C3C43;line-height:1.6;">';
        html += '<strong style="color:#1C1C1E;">Términos de Servicio — Marketplace</strong><br><br>';
        html += '1. <strong>Solo transacciones locales.</strong> Pickup en persona dentro de 25 millas. No se permiten envíos.<br><br>';
        html += '2. <strong>Artículos prohibidos:</strong> Armas de fuego, drogas, medicamentos controlados, animales vivos, materiales peligrosos, productos robados.<br><br>';
        html += '3. <strong>Seguridad:</strong> Recomendamos reunirse en lugares públicos y bien iluminados. Maestro HVACR NO es responsable de robos, asaltos, estafas, daños, ni pérdidas derivadas de transacciones entre usuarios.<br><br>';
        html += '4. <strong>Responsabilidad del vendedor:</strong> El vendedor garantiza que tiene derecho legal a vender el artículo publicado y que la descripción es precisa.<br><br>';
        html += '5. <strong>Sin garantías de la plataforma:</strong> Maestro HVACR actúa únicamente como tablero de anuncios. No verificamos la calidad, autenticidad, ni legalidad de los artículos publicados.<br><br>';
        html += '6. <strong>Reviews obligatorios:</strong> Después de cada transacción, ambas partes deben dejar una reseña.<br><br>';
        html += '7. <strong>Derecho de remoción:</strong> Nos reservamos el derecho de remover cualquier publicación o suspender cuentas que violen estos términos sin previo aviso.<br><br>';
        html += '8. <strong>Indemnización:</strong> Al usar el Marketplace, aceptas indemnizar y liberar de responsabilidad a Maestro HVACR, ACVOLT LLC, sus empleados y afiliados de cualquier reclamo derivado de tu uso del servicio.';
        html += '</div>';
        html += '<label style="display:flex;align-items:center;gap:8px;padding:12px;background:#FFFFFF;border-radius:10px;cursor:pointer;margin-bottom:12px;">';
        html += '<input type="checkbox" id="mpTosCheck" style="width:18px;height:18px;" />';
        html += '<span style="font-size:13px;color:#1C1C1E;font-weight:600;">Acepto los Términos de Servicio</span></label>';
        html += '<button id="mpTosNext" onclick="window._mpOnboardNext()" style="width:100%;padding:14px;' + _btnCSS + 'background:rgba(59,130,246,0.3);color:#374151;font-size:15px;" disabled>Continuar</button>';
      }

      else if (step === 2) {
        // NDA
        html += '<div style="text-align:center;margin-bottom:24px;">';
        html += '<div style="font-size:48px;margin-bottom:12px;">🔒</div>';
        html += '<h2 style="font-size:22px;font-weight:900;color:#1C1C1E;margin:0 0 8px;">Acuerdo de Confidencialidad</h2>';
        html += '</div>';
        html += '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:16px;margin-bottom:16px;max-height:250px;overflow-y:auto;font-size:12px;color:#3C3C43;line-height:1.6;">';
        html += '<strong style="color:#1C1C1E;">Acuerdo de No Divulgación (NDA)</strong><br><br>';
        html += '1. No compartirás información personal de otros usuarios (teléfono, dirección, fotos de ID) obtenida a través del Marketplace.<br><br>';
        html += '2. No usarás la plataforma para recopilar datos personales con fines de spam, acoso, o venta a terceros.<br><br>';
        html += '3. La información de verificación (ID de gobierno) es confidencial y solo será usada para validar tu identidad.<br><br>';
        html += '4. Violaciones a este acuerdo resultarán en suspensión permanente y posibles acciones legales.';
        html += '</div>';
        html += '<label style="display:flex;align-items:center;gap:8px;padding:12px;background:#FFFFFF;border-radius:10px;cursor:pointer;margin-bottom:12px;">';
        html += '<input type="checkbox" id="mpNdaCheck" style="width:18px;height:18px;" />';
        html += '<span style="font-size:13px;color:#1C1C1E;font-weight:600;">Acepto el Acuerdo de Confidencialidad</span></label>';
        html += '<button id="mpNdaNext" onclick="window._mpOnboardNext()" style="width:100%;padding:14px;' + _btnCSS + 'background:rgba(59,130,246,0.3);color:#374151;font-size:15px;" disabled>Continuar</button>';
      }

      else if (step === 3) {
        // Profile photo
        html += '<div style="text-align:center;margin-bottom:24px;">';
        html += '<div style="font-size:48px;margin-bottom:12px;">📸</div>';
        html += '<h2 style="font-size:22px;font-weight:900;color:#1C1C1E;margin:0 0 8px;">Foto de Perfil</h2>';
        html += '<p style="font-size:13px;color:#3C3C43;margin:0;">Los compradores necesitan saber con quién tratan</p>';
        html += '</div>';
        html += '<div id="mpPhotoPreview" style="width:120px;height:120px;border-radius:50%;background:rgba(0,0,0,0.06);border:2px dashed rgba(0,0,0,0.08);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;overflow:hidden;">';
        var existingPhoto = localStorage.getItem('maestroac_photo_' + _email) || localStorage.getItem('maestroac_photo_default');
        if (existingPhoto) {
          html += '<img src="' + existingPhoto + '" style="width:100%;height:100%;object-fit:cover;" />';
        } else {
          html += '<span style="font-size:40px;opacity:0.3;">👤</span>';
        }
        html += '</div>';
        html += '<input type="file" id="mpPhotoInput" accept="image/*" style="display:none;" />';
        html += '<button onclick="document.getElementById(\'mpPhotoInput\').click()" style="width:100%;padding:12px;' + _btnCSS + 'background:#F2F2F7;color:#374151;font-size:14px;margin-bottom:12px;">Tomar / Subir Foto</button>';
        if (existingPhoto) {
          html += '<button onclick="window._mpOnboardNext()" style="width:100%;padding:14px;' + _btnCSS + 'background:#3b82f6;color:#fff;font-size:15px;">Continuar con foto actual</button>';
        } else {
          html += '<button id="mpPhotoNext" onclick="window._mpOnboardNext()" style="width:100%;padding:14px;' + _btnCSS + 'background:rgba(59,130,246,0.3);color:#374151;font-size:15px;" disabled>Continuar</button>';
        }
      }

      else if (step === 4) {
        // Government ID
        html += '<div style="text-align:center;margin-bottom:24px;">';
        html += '<div style="font-size:48px;margin-bottom:12px;">🪪</div>';
        html += '<h2 style="font-size:22px;font-weight:900;color:#1C1C1E;margin:0 0 8px;">Identificación de Gobierno</h2>';
        html += '<p style="font-size:13px;color:#3C3C43;margin:0;">INE, Licencia de Conducir, o Pasaporte</p>';
        html += '<p style="font-size:11px;color:rgba(239,68,68,0.7);margin:8px 0 0;">🔒 Tu ID es confidencial — solo la usamos para verificar tu identidad</p>';
        html += '</div>';
        html += '<div id="mpGovIdPreview" style="width:100%;height:180px;border-radius:14px;background:#FFFFFF;border:2px dashed rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:16px;">';
        html += '<span style="font-size:14px;color:#4B5563;">Toca para subir tu ID</span>';
        html += '</div>';
        html += '<input type="file" id="mpGovIdInput" accept="image/*" style="display:none;" />';
        html += '<button onclick="document.getElementById(\'mpGovIdInput\').click()" style="width:100%;padding:12px;' + _btnCSS + 'background:#F2F2F7;color:#374151;font-size:14px;margin-bottom:12px;">📷 Tomar Foto del ID</button>';
        html += '<button id="mpGovIdNext" onclick="window._mpCompleteOnboarding()" style="width:100%;padding:14px;' + _btnCSS + 'background:rgba(59,130,246,0.3);color:#374151;font-size:15px;" disabled>Completar Verificación</button>';
      }

      html += '</div></div>';
      screen.innerHTML = html;

      // Wire up checkbox listeners
      if (step === 1) {
        var tosCheck = document.getElementById('mpTosCheck');
        var tosBtn = document.getElementById('mpTosNext');
        if (tosCheck && tosBtn) {
          tosCheck.addEventListener('change', function() {
            tosBtn.disabled = !this.checked;
            tosBtn.style.background = this.checked ? '#3b82f6' : 'rgba(59,130,246,0.3)';
            tosBtn.style.color = this.checked ? '#fff' : '#AEAEB2';
          });
        }
      }
      if (step === 2) {
        var ndaCheck = document.getElementById('mpNdaCheck');
        var ndaBtn = document.getElementById('mpNdaNext');
        if (ndaCheck && ndaBtn) {
          ndaCheck.addEventListener('change', function() {
            ndaBtn.disabled = !this.checked;
            ndaBtn.style.background = this.checked ? '#3b82f6' : 'rgba(59,130,246,0.3)';
            ndaBtn.style.color = this.checked ? '#fff' : '#AEAEB2';
          });
        }
      }
      if (step === 3) {
        var photoInput = document.getElementById('mpPhotoInput');
        if (photoInput) {
          photoInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
              photoFile = this.files[0];
              var reader = new FileReader();
              reader.onload = function(e) {
                var preview = document.getElementById('mpPhotoPreview');
                if (preview) preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;" />';
                var btn = document.getElementById('mpPhotoNext');
                if (btn) { btn.disabled = false; btn.style.background = '#3b82f6'; btn.style.color = '#fff'; }
              };
              reader.readAsDataURL(this.files[0]);
            }
          });
        }
      }
      if (step === 4) {
        var govInput = document.getElementById('mpGovIdInput');
        if (govInput) {
          govInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
              govIdFile = this.files[0];
              var reader = new FileReader();
              reader.onload = function(e) {
                var preview = document.getElementById('mpGovIdPreview');
                if (preview) preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />';
                var btn = document.getElementById('mpGovIdNext');
                if (btn) { btn.disabled = false; btn.style.background = '#3b82f6'; btn.style.color = '#fff'; }
              };
              reader.readAsDataURL(this.files[0]);
            }
          });
          // Also wire preview click
          var govPreview = document.getElementById('mpGovIdPreview');
          if (govPreview) govPreview.addEventListener('click', function() { govInput.click(); });
        }
      }
    }

    window._mpOnboardNext = function() { step++; render(); };

    window._mpCompleteOnboarding = async function() {
      var btn = document.getElementById('mpGovIdNext');
      if (window.BtnLoading) window.BtnLoading.start(btn, 'Verificando...');

      try {
        // Upload profile photo if new
        var profileUrl = localStorage.getItem('maestroac_photo_' + _email) || localStorage.getItem('maestroac_photo_default') || '';
        if (photoFile) {
          var ext = photoFile.name.split('.').pop();
          var path = 'marketplace/profiles/' + _email.replace(/[^a-z0-9]/g, '_') + '.' + ext;
          var upRes = await SB.storage.from('school-files').upload(path, photoFile, { upsert: true });
          if (upRes.data) {
            var urlRes = SB.storage.from('school-files').getPublicUrl(path);
            profileUrl = urlRes.data.publicUrl;
          }
        }

        // Upload gov ID
        var govUrl = '';
        if (govIdFile) {
          var gext = govIdFile.name.split('.').pop();
          var gpath = 'marketplace/gov-ids/' + _email.replace(/[^a-z0-9]/g, '_') + '_id.' + gext;
          var gRes = await SB.storage.from('school-files').upload(gpath, govIdFile, { upsert: true });
          if (gRes.data) {
            var gUrlRes = SB.storage.from('school-files').getPublicUrl(gpath);
            govUrl = gUrlRes.data.publicUrl;
          }
        }

        // Get user name
        var nameRes = await usersDataSelf('get_self', { email: _email, fields: ['nombre','telefono'] }); nameRes = { data: nameRes.data ? [nameRes.data] : [] };
        var userName = (nameRes.data && nameRes.data[0]) ? nameRes.data[0].nombre : _email.split('@')[0];
        var userPhone = (nameRes.data && nameRes.data[0]) ? nameRes.data[0].telefono : '';

        // Create seller profile
        var now = new Date().toISOString();
        var sellerData = {
          user_email: _email,
          user_name: userName,
          phone: userPhone,
          profile_photo_url: profileUrl,
          gov_id_url: govUrl,
          gov_id_verified: true,
          verified_at: now,
          tos_accepted: true,
          tos_accepted_at: now,
          nda_accepted: true,
          nda_accepted_at: now,
          tier: 'free'
        };

        var insertRes = await SB.from('marketplace_sellers').upsert(sellerData, { onConflict: 'user_email' });
        if (insertRes.error) throw insertRes.error;

        _seller = sellerData;
        _toast(_t('mkt_verification_complete', '¡Verificación completa!'));
        _renderMarketplace(screen);
      } catch(e) {
        console.error('[Marketplace] Onboarding error:', e);
        _toast('Error al verificar. Intenta de nuevo.', 'error');
      } finally {
        if (window.BtnLoading) window.BtnLoading.stop(btn);
      }
    };

    render();
  }

  // ══════════════════════════════════════════════════════════════
  // MAIN MARKETPLACE — Feed
  // ══════════════════════════════════════════════════════════════
  function _renderMarketplace(screen) {
    var html = '<div class="mp-loaded" style="min-height:100vh;background:#F5F5F7;">';

    // Nav bar
    html += '<div class="sticky-nav-bar sticky-nav-bar--light">';
    html += '<button class="btn-nav-back" data-nav="dashboardScreen">← Volver</button>';
    html += '<span class="nav-bar-title">🏪 Marketplace</span>';
    html += '<div style="display:flex;gap:8px;">';
    html += '<button onclick="window._mpShowInbox()" style="background:none;border:none;color:#007AFF;font-size:13px;font-weight:700;cursor:pointer;position:relative;">💬 <span id="mpUnreadBadge" style="display:none;position:absolute;top:-4px;right:-6px;background:#ef4444;color:#fff;font-size:9px;font-weight:700;padding:1px 4px;border-radius:8px;min-width:14px;text-align:center;"></span></button>';
    html += '<button onclick="window._mpShowMyListings()" style="background:none;border:none;color:#3b82f6;font-size:13px;font-weight:700;cursor:pointer;">Mis Ventas</button>';
    html += '</div></div>';

    // Seller badge
    if (_seller) {
      var tierBadge = _seller.tier === 'paid'
        ? '<span style="background:rgba(234,179,8,0.2);color:#92400E;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;">⭐ Vendedor</span>'
        : '<span style="background:rgba(34,197,94,0.15);color:#16a34a;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;">✓ Verificado</span>';
      html += '<div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;">';
      html += '<div style="display:flex;align-items:center;gap:8px;">' + tierBadge;
      if (_seller.avg_rating > 0) html += '<span style="font-size:11px;color:#92400E;">★ ' + _seller.avg_rating + '</span>';
      html += '</div>';
      html += '<button onclick="window._mpShowPostForm()" style="padding:8px 16px;' + _btnCSS + 'background:#3b82f6;color:#fff;font-size:13px;">+ Vender</button>';
      html += '</div>';
    }

    // Search bar
    html += '<div style="padding:0 16px 8px;">';
    html += '<input id="mpSearchInput" type="text" placeholder="🔍 Buscar herramientas, equipo..." style="' + _inputCSS + 'background:#F2F2F7;" oninput="window._mpSearch(this.value)" />';
    html += '</div>';

    // Category pills
    html += '<div style="padding:0 16px 12px;display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;">';
    html += '<button class="mp-cat-btn mp-cat-active" data-cat="" onclick="window._mpFilterCat(\'\')" style="white-space:nowrap;padding:6px 12px;border-radius:20px;border:1px solid rgba(0,0,0,0.06);background:#FFFFFF;color:#1C1C1E;font-size:11px;font-weight:600;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.1);">Todos</button>';
    CATEGORIES.forEach(function(c) {
      html += '<button class="mp-cat-btn" data-cat="' + c.value + '" onclick="window._mpFilterCat(\'' + c.value + '\')" style="white-space:nowrap;padding:7px 14px;border-radius:20px;border:1px solid rgba(0,0,0,0.12);background:#FFFFFF;color:#111111;font-size:13px;font-weight:700;cursor:pointer;">' + c.icon + ' ' + c.label + '</button>';
    });
    html += '</div>';

    // Safety warning banner
    html += '<div style="margin:0 16px 12px;padding:12px 14px;background:rgba(234,179,8,0.18);border:1px solid rgba(234,179,8,0.45);border-radius:10px;font-size:13px;color:#78350F;display:flex;align-items:center;gap:8px;font-weight:600;line-height:1.4;">';
    html += '<span style="font-size:18px;">⚠️</span>';
    html += '<span style="color:#78350F;">Reúnete en lugar público. Verifica el producto antes de pagar. Maestro HVACR no es responsable de las transacciones.</span>';
    html += '</div>';

    // Listings grid
    html += '<div id="mpListingsGrid" style="padding:0 16px 100px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    html += '</div>';

    html += '</div>';
    screen.innerHTML = html;

    // Premium skeleton placeholders while listings load
    var _mpGrid = document.getElementById('mpListingsGrid');
    if (_mpGrid && window.Skeleton) window.Skeleton.listCard(_mpGrid, 6);

    // Load listings + start unread polling
    _getUserLocation(function() {
      _loadListings(true);
    });
    _startUnreadPolling();
  }

  // ── Load listings from DB ────────────────────────────────────
  function _loadListings(reset) {
    if (_loading) return;
    _loading = true;
    if (reset) { _currentPage = 0; _listings = []; }

    var query = SB.from('marketplace_listings').select('*').eq('status', 'active').order('created_at', { ascending: false });

    if (_filterCategory) query = query.eq('category', _filterCategory);
    if (_filterSearch) query = query.ilike('title', '%' + _filterSearch + '%');

    query = query.range(_currentPage * PAGE_SIZE, (_currentPage + 1) * PAGE_SIZE - 1);

    query.then(function(res) {
      var newItems = res.data || [];
      // Filter by distance
      if (_userLat && _userLng) {
        newItems = newItems.filter(function(item) {
          return _distanceMiles(_userLat, _userLng, item.latitude, item.longitude) <= _maxDistanceMiles;
        });
      }
      _listings = reset ? newItems : _listings.concat(newItems);
      _renderGrid();
      _currentPage++;
      _loading = false;
    }).catch(function() {
      _loading = false;
      _renderGrid();
    });
  }

  // ── Render listings grid ─────────────────────────────────────
  function _renderGrid() {
    var grid = document.getElementById('mpListingsGrid');
    if (!grid) return;

    if (_listings.length === 0) {
      grid.innerHTML = '<div class="mx-empty" style="grid-column:1/-1;">' +
        '<div class="mx-empty-icon">🛒</div>' +
        '<div class="mx-empty-title">Aún no hay publicaciones</div>' +
        '<div class="mx-empty-desc">Sé el primero en vender herramientas en tu zona.</div>' +
        '<button class="mx-empty-cta" onclick="window._mpShowPostForm()">Publicar ahora</button>' +
        '</div>';
      return;
    }

    var html = '';
    _listings.forEach(function(item) {
      var photo = (item.photos && item.photos.length > 0) ? item.photos[0] : '';
      var videoUrl = item.video_url || '';
      var dist = (_userLat && _userLng && item.latitude && item.longitude)
        ? Math.round(_distanceMiles(_userLat, _userLng, item.latitude, item.longitude))
        : null;
      var cond = CONDITIONS.find(function(c) { return c.value === item.condition; });
      var cat = CATEGORIES.find(function(c) { return c.value === item.category; });

      html += '<div onclick="window._mpShowDetail(\'' + item.id + '\')" style="border-radius:16px;overflow:hidden;background:#FFFFFF;border:1px solid rgba(0,0,0,0.06);cursor:pointer;transition:transform 0.15s;box-shadow:0 2px 8px rgba(0,0,0,0.06);" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'\'">';

      // Video thumbnail or photo
      if (videoUrl) {
        html += '<div style="position:relative;width:100%;aspect-ratio:1;overflow:hidden;background:#E5E5EA;">';
        html += '<video src="' + videoUrl + '" style="width:100%;height:100%;object-fit:cover;" muted playsinline preload="metadata"></video>';
        html += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);"><span style="font-size:18px;margin-left:2px;">▶</span></div></div>';
        html += '</div>';
      } else if (photo) {
        html += '<div style="width:100%;aspect-ratio:1;overflow:hidden;background:#E5E5EA;">';
        html += '<img src="' + photo + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'marketplace-icon.png\'" loading="lazy" />';
        html += '</div>';
      } else {
        html += '<div style="width:100%;aspect-ratio:1;background:#F2F2F7;display:flex;align-items:center;justify-content:center;">';
        html += '<span style="font-size:40px;opacity:0.2;">' + (cat ? cat.icon : '📦') + '</span>';
        html += '</div>';
      }

      // Info
      html += '<div style="padding:8px 10px 10px;">';
      html += '<div style="font-size:16px;font-weight:800;color:#16a34a;margin-bottom:2px;">$' + Number(item.price).toLocaleString() + '</div>';
      html += '<div style="font-size:12px;font-weight:600;color:#1C1C1E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _escapeHtml(item.title || 'Sin título') + '</div>';
      // Location + views
      html += '<div style="display:flex;align-items:center;gap:6px;margin-top:4px;font-size:10px;color:#374151;">';
      if (dist !== null) html += '<span>📍 ' + dist + ' mi</span>';
      else if (item.city) html += '<span>📍 ' + item.city + '</span>';
      html += '<span>👁️ ' + (item.view_count || 0) + '</span>';
      if (cond) html += '<span style="color:' + cond.color + ';">' + cond.label + '</span>';
      html += '</div>';
      html += '</div></div>';
    });

    grid.innerHTML = html;
  }

  // ── Search + Filter ──────────────────────────────────────────
  var _searchTimeout;
  window._mpSearch = function(val) {
    clearTimeout(_searchTimeout);
    _searchTimeout = setTimeout(function() {
      _filterSearch = val.trim();
      _loadListings(true);
    }, 400);
  };

  window._mpFilterCat = function(cat) {
    _filterCategory = cat;
    // Update button styles
    document.querySelectorAll('.mp-cat-btn').forEach(function(btn) {
      var isActive = btn.getAttribute('data-cat') === cat;
      btn.style.background = isActive ? '#FFFFFF' : '#F2F2F7';
      btn.style.borderColor = isActive ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.06)';
      btn.style.boxShadow = isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none';
      btn.style.color = isActive ? '#1C1C1E' : '#8E8E93';
    });
    _loadListings(true);
  };

  // ══════════════════════════════════════════════════════════════
  // ── Full-screen photo viewer ──────────────────────────────────
  window._mpShowPhotoFull = function(url) {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;';
    ov.onclick = function() { ov.remove(); };
    var img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'max-width:95%;max-height:90%;object-fit:contain;border-radius:8px;';
    ov.appendChild(img);
    document.body.appendChild(ov);
  };

  // LISTING DETAIL
  // ══════════════════════════════════════════════════════════════
  window._mpShowDetail = function(id) {
    var item = _listings.find(function(l) { return l.id === id; });
    if (!item) return;
    _currentDetail = item;

    // Increment view count
    SB.rpc('mp_increment_views', { p_listing_id: id }).then(function() {});

    var photos = item.photos || [];
    var cond = CONDITIONS.find(function(c) { return c.value === item.condition; }) || {};
    var cat = CATEGORIES.find(function(c) { return c.value === item.category; }) || {};
    var dist = (_userLat && _userLng && item.latitude && item.longitude)
      ? Math.round(_distanceMiles(_userLat, _userLng, item.latitude, item.longitude))
      : null;

    var overlay = document.createElement('div');
    overlay.id = 'mpDetailOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F5F5F7;overflow-y:auto;';

    var html = '';
    var videoUrl = item.video_url || '';
    // Video header OR photo carousel
    html += '<div style="position:relative;width:100%;background:#E5E5EA;overflow:hidden;">';
    if (videoUrl) {
      html += '<video id="mpDetailVideo" src="' + _escapeHtml(videoUrl) + '" style="width:100%;max-height:400px;object-fit:cover;" autoplay loop muted playsinline controls></video>';
      // Photo thumbnails below video
      if (photos.length > 0) {
        html += '<div style="display:flex;gap:4px;padding:6px;overflow-x:auto;background:rgba(0,0,0,0.3);">';
        photos.forEach(function(p) {
          var safeP = _escapeHtml(p);
          html += '<img src="' + safeP + '" data-photo-url="' + safeP + '" class="mp-thumb" style="width:56px;height:56px;border-radius:6px;object-fit:cover;cursor:pointer;flex-shrink:0;border:1px solid rgba(0,0,0,0.08);" />';
        });
        html += '</div>';
      }
    } else if (photos.length > 0) {
      html += '<div style="aspect-ratio:4/3;">';
      html += '<img id="mpDetailPhoto" src="' + _escapeHtml(photos[0]) + '" style="width:100%;height:100%;object-fit:cover;" />';
      html += '</div>';
      if (photos.length > 1) {
        html += '<div style="display:flex;gap:4px;padding:6px;overflow-x:auto;background:rgba(0,0,0,0.3);">';
        photos.forEach(function(p, i) {
          var safeUrl = _escapeHtml(p);
          html += '<img src="' + safeUrl + '" data-photo-url="' + safeUrl + '" class="mp-thumb" style="width:56px;height:56px;border-radius:6px;object-fit:cover;cursor:pointer;flex-shrink:0;border:' + (i === 0 ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.08)') + ';" />';
        });
        html += '</div>';
      }
    } else {
      html += '<div style="aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;font-size:60px;opacity:0.15;">' + (cat.icon || '📦') + '</div>';
    }
    // Close button
    html += '<button onclick="document.getElementById(\'mpDetailOverlay\').remove()" style="position:absolute;top:16px;left:16px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;color:#fff;font-size:18px;cursor:pointer;backdrop-filter:blur(8px);">✕</button>';
    // Report button
    html += '<button onclick="window._mpReportListing(\'' + id + '\')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;color:#fff;font-size:16px;cursor:pointer;backdrop-filter:blur(8px);">🚩</button>';
    html += '</div>';

    // Info section
    html += '<div style="padding:16px;">';
    // Price + condition
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    html += '<span style="font-size:28px;font-weight:900;color:#16a34a;">$' + Number(item.price).toLocaleString() + '</span>';
    html += '<span style="padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:#F2F2F7;color:' + (cond.color || '#8E8E93') + ';">' + (cond.label || item.condition) + '</span>';
    html += '</div>';
    // Title
    html += '<h2 style="font-size:20px;font-weight:800;color:#1C1C1E;margin:0 0 8px;">' + _escapeHtml(item.title || 'Sin título') + '</h2>';
    // Stats
    html += '<div style="display:flex;gap:12px;margin-bottom:12px;font-size:12px;color:#374151;">';
    if (dist !== null) html += '<span>📍 ' + dist + ' millas</span>';
    else if (item.city) html += '<span>📍 ' + item.city + (item.state ? ', ' + item.state : '') + '</span>';
    html += '<span>👁️ ' + ((item.view_count || 0) + 1) + ' vistas</span>';
    html += '<span>💬 ' + (item.message_count || 0) + ' mensajes</span>';
    html += '</div>';
    // Category
    html += '<div style="margin-bottom:12px;"><span style="padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;background:#F2F2F7;color:#374151;">' + (cat.icon || '') + ' ' + (cat.label || item.category) + '</span></div>';
    // Description
    if (item.description) {
      html += '<div style="font-size:14px;color:#3C3C43;line-height:1.6;margin-bottom:16px;white-space:pre-wrap;">' + _escapeHtml(item.description) + '</div>';
    }
    // Posted date
    html += '<div style="font-size:11px;color:#4B5563;margin-bottom:16px;">Publicado ' + _timeAgo(item.created_at) + '</div>';

    // Safety warning
    html += '<div style="padding:12px;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.15);border-radius:12px;margin-bottom:16px;font-size:12px;color:rgba(234,179,8,0.8);line-height:1.5;">';
    html += '⚠️ <strong>Seguridad:</strong> Reúnete en lugar público y bien iluminado. Lleva un acompañante. Verifica el producto antes de pagar en efectivo. Maestro HVACR NO es responsable de ninguna transacción.';
    html += '</div>';

    // Contact buttons
    html += '<button onclick="window._mpStartChat(\'' + id + '\')" style="width:100%;padding:16px;' + _btnCSS + 'background:#3b82f6;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;">';
    html += '💬 Enviar Mensaje</button>';
    html += '<button onclick="window._mpContactSeller(\'' + id + '\')" style="width:100%;padding:12px;' + _btnCSS + 'background:rgba(37,211,102,0.15);color:#25d366;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;">';
    html += '📱 WhatsApp</button>';

    // Seller info (loaded async)
    html += '<div id="mpSellerInfo" style="padding:14px;background:#FFFFFF;border-radius:12px;border:1px solid rgba(0,0,0,0.06);">';
    html += '</div>';

    html += '</div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    // Premium skeleton placeholder while seller info loads
    var _mpSeller = document.getElementById('mpSellerInfo');
    if (_mpSeller && window.Skeleton) window.Skeleton.listRow(_mpSeller, 1);

    // Wire photo thumbnails via event delegation (safe, no inline onclick)
    overlay.querySelectorAll('.mp-thumb').forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        var url = this.getAttribute('data-photo-url') || '';
        var mainPhoto = document.getElementById('mpDetailPhoto');
        if (mainPhoto) { mainPhoto.src = url; }
        else if (url && window._mpShowPhotoFull) { window._mpShowPhotoFull(url); }
      });
    });

    // Load seller info
    _loadSellerInfo(item.seller_email);
  };

  function _loadSellerInfo(sellerEmail) {
    SB.from('marketplace_sellers').select('*').eq('user_email', sellerEmail).limit(1).then(function(res) {
      var s = (res.data && res.data[0]) ? res.data[0] : null;
      var container = document.getElementById('mpSellerInfo');
      if (!container || !s) return;
      var html = '<div style="display:flex;align-items:center;gap:12px;">';
      if (s.profile_photo_url) {
        html += '<img src="' + s.profile_photo_url + '" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid rgba(59,130,246,0.3);" />';
      } else {
        html += '<div style="width:44px;height:44px;border-radius:50%;background:#3b82f6;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;">' + (s.user_name || '?')[0].toUpperCase() + '</div>';
      }
      html += '<div style="flex:1;"><div style="font-size:14px;font-weight:700;color:#1C1C1E;">' + _escapeHtml(s.user_name || 'Vendedor') + '</div>';
      html += '<div style="display:flex;align-items:center;gap:8px;margin-top:2px;">';
      html += '<span style="font-size:11px;color:#16a34a;">✓ Verificado</span>';
      if (s.avg_rating > 0) html += '<span style="font-size:11px;color:#92400E;">★ ' + s.avg_rating + ' (' + s.total_reviews + ')</span>';
      html += '<span style="font-size:11px;color:#4B5563;">' + (s.total_sold || 0) + ' vendidos</span>';
      html += '</div></div></div>';
      container.innerHTML = html;
    }).catch(function() {});
  }

  // ── Contact seller via WhatsApp ──────────────────────────────
  window._mpContactSeller = function(listingId) {
    var item = _currentDetail;
    if (!item) return;

    // Increment message count
    SB.rpc('mp_increment_messages', { p_listing_id: listingId }).then(function() {});

    // Get seller phone
    SB.from('marketplace_sellers').select('phone, user_name').eq('user_email', item.seller_email).limit(1).then(function(res) {
      var seller = (res.data && res.data[0]) ? res.data[0] : null;
      if (!seller || !seller.phone) {
        _toast('El vendedor no tiene WhatsApp registrado', 'error');
        return;
      }
      var phone = seller.phone.replace(/[^0-9]/g, '');
      if (phone.length === 10) phone = '1' + phone;
      var msg = encodeURIComponent('Hola ' + (seller.user_name || '') + ', me interesa tu publicación en Maestro Marketplace: "' + item.title + '" por $' + item.price);
      window.open('https://wa.me/' + phone + '?text=' + msg, '_blank');
    }).catch(function() {
      _toast('Error al contactar vendedor', 'error');
    });
  };

  // ── Report listing ───────────────────────────────────────────
  window._mpReportListing = function(listingId) {
    var reasons = ['scam', 'stolen', 'prohibited', 'offensive', 'spam', 'other'];
    var labels = ['Estafa / Fraude', 'Producto Robado', 'Artículo Prohibido', 'Contenido Ofensivo', 'Spam', 'Otro'];
    var html = '<div style="padding:20px;"><h3 style="font-size:18px;font-weight:800;color:#1C1C1E;margin:0 0 16px;">Reportar Publicación</h3>';
    reasons.forEach(function(r, i) {
      html += '<button onclick="window._mpSubmitReport(\'' + listingId + '\',\'' + r + '\')" style="width:100%;padding:12px;margin-bottom:8px;' + _btnCSS + 'background:#F2F2F7;color:#1C1C1E;font-size:14px;text-align:left;">' + labels[i] + '</button>';
    });
    html += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:12px;margin-top:4px;' + _btnCSS + 'background:#F2F2F7;color:#374151;font-size:14px;">Cancelar</button>';
    html += '</div>';
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#FFFFFF;border-radius:20px 20px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,0.15);';
    modal.innerHTML = html;
    document.body.appendChild(modal);
  };

  window._mpSubmitReport = function(listingId, reason) {
    SB.from('marketplace_reports').insert({ listing_id: listingId, reporter_email: _email, reason: reason }).then(function() {
      _toast('Reporte enviado. Gracias por mantener la comunidad segura.');
    }).catch(function() {
      _toast('Error al enviar reporte', 'error');
    });
    var modals = document.querySelectorAll('div[style*="position:fixed;bottom:0"]');
    modals.forEach(function(m) { m.remove(); });
  };

  // ══════════════════════════════════════════════════════════════
  // POST LISTING FORM
  // ══════════════════════════════════════════════════════════════
  var _postPhotos = [];
  var _postVideo = null;

  window._mpShowPostForm = function() {
    // Free for everyone — no paywall gate.
    _postPhotos = [];
    _postVideo = null;

    var overlay = document.createElement('div');
    overlay.id = 'mpPostOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F5F5F7;overflow-y:auto;';

    var html = '<div style="padding:0;">';
    html += '<div class="sticky-nav-bar sticky-nav-bar--light"><button onclick="document.getElementById(\'mpPostOverlay\').remove()" class="btn-nav-back">← Cancelar</button><span class="nav-bar-title">Publicar</span></div>';
    html += '<div style="padding:16px;max-width:500px;margin:0 auto;">';

    // Photos
    html += '<label style="' + _labelCSS + '">FOTOS (máximo 8)</label>';
    html += '<div id="mpPostPhotos" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">';
    html += '<div onclick="document.getElementById(\'mpPostPhotoInput\').click()" style="width:80px;height:80px;border-radius:10px;background:#FFFFFF;border:2px dashed rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;"><span style="font-size:24px;color:#4B5563;">+</span></div>';
    html += '</div>';
    html += '<input type="file" id="mpPostPhotoInput" accept="image/*" multiple style="display:none;" />';

    // Video (30 sec max)
    html += '<label style="' + _labelCSS + '">VIDEO DEL PRODUCTO (30 seg máx — será el encabezado)</label>';
    html += '<div id="mpPostVideoPreview" style="margin-bottom:16px;">';
    html += '<div onclick="document.getElementById(\'mpPostVideoInput\').click()" style="width:100%;height:120px;border-radius:12px;background:#FFFFFF;border:2px dashed rgba(0,0,0,0.08);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;gap:4px;">';
    html += '<span style="font-size:32px;">🎬</span>';
    html += '<span style="font-size:12px;color:#4B5563;">Toca para grabar o subir video</span>';
    html += '</div></div>';
    html += '<input type="file" id="mpPostVideoInput" accept="video/*" style="display:none;" />';

    // Title
    html += '<label style="' + _labelCSS + '">TÍTULO</label>';
    html += '<input id="mpPostTitle" type="text" placeholder="Ej: Manifold Fieldpiece SMAN460" maxlength="80" style="' + _inputCSS + 'margin-bottom:14px;" />';

    // Price
    html += '<label style="' + _labelCSS + '">PRECIO ($)</label>';
    html += '<input id="mpPostPrice" type="number" placeholder="0.00" min="0" step="0.01" style="' + _inputCSS + 'margin-bottom:14px;" />';

    // Category
    html += '<label style="' + _labelCSS + '">CATEGORÍA</label>';
    html += '<select id="mpPostCategory" style="' + _inputCSS + 'appearance:auto;margin-bottom:14px;">';
    CATEGORIES.forEach(function(c) {
      html += '<option value="' + c.value + '">' + c.icon + ' ' + c.label + '</option>';
    });
    html += '</select>';

    // Condition
    html += '<label style="' + _labelCSS + '">CONDICIÓN</label>';
    html += '<select id="mpPostCondition" style="' + _inputCSS + 'appearance:auto;margin-bottom:14px;">';
    CONDITIONS.forEach(function(c) {
      html += '<option value="' + c.value + '">' + c.label + '</option>';
    });
    html += '</select>';

    // Description
    html += '<label style="' + _labelCSS + '">DESCRIPCIÓN</label>';
    html += '<textarea id="mpPostDesc" rows="4" placeholder="Describe el producto, su estado, accesorios incluidos..." style="' + _inputCSS + 'resize:vertical;margin-bottom:14px;"></textarea>';

    // Location
    html += '<label style="' + _labelCSS + '">UBICACIÓN</label>';
    html += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
    html += '<input id="mpPostCity" type="text" placeholder="Ciudad" style="' + _inputCSS + 'flex:1;" />';
    html += '<input id="mpPostState" type="text" placeholder="Estado" maxlength="5" style="' + _inputCSS + 'width:80px;" />';
    html += '</div>';

    // Submit
    html += '<button id="mpPostSubmit" onclick="window._mpSubmitListing()" style="width:100%;padding:16px;' + _btnCSS + 'background:#3b82f6;color:#fff;font-size:16px;font-weight:800;margin-bottom:20px;">Publicar Gratis</button>';

    // Disclaimer
    html += '<p style="font-size:10px;color:#4B5563;text-align:center;line-height:1.5;">Al publicar, confirmas que tienes derecho legal a vender este artículo y aceptas los Términos de Servicio del Marketplace.</p>';

    html += '</div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    // Photo input handler (with type + size validation)
    document.getElementById('mpPostPhotoInput').addEventListener('change', function() {
      var files = Array.from(this.files);
      var validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      files.forEach(function(f) {
        if (_postPhotos.length >= 8) return;
        if (!validTypes.includes(f.type)) { _toast(_t('mkt_only_image_types', 'Solo se aceptan imágenes JPG, PNG o WebP'), 'error'); return; }
        if (f.size > 5 * 1024 * 1024) { _toast(_t('mkt_photo_max_size', 'Cada foto debe ser menor a 5MB'), 'error'); return; }
        _postPhotos.push(f);
      });
      _renderPostPhotos();
    });

    // Video input handler (30 sec max, 50MB max)
    document.getElementById('mpPostVideoInput').addEventListener('change', function() {
      var file = this.files && this.files[0];
      if (!file) return;
      var validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!validVideoTypes.includes(file.type)) { _toast('Solo se aceptan videos MP4, WebM o MOV', 'error'); return; }
      if (file.size > 50 * 1024 * 1024) { _toast('El video debe ser menor a 50MB', 'error'); return; }
      // Validate duration
      var videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.onloadedmetadata = function() {
        URL.revokeObjectURL(videoEl.src);
        if (videoEl.duration > 30) {
          _toast('El video debe ser de máximo 30 segundos (este tiene ' + Math.round(videoEl.duration) + 's)', 'error');
          return;
        }
        _postVideo = file;
        var preview = document.getElementById('mpPostVideoPreview');
        if (preview) {
          var url = URL.createObjectURL(file);
          preview.innerHTML = '<div style="position:relative;border-radius:12px;overflow:hidden;">' +
            '<video src="' + url + '" style="width:100%;max-height:200px;object-fit:cover;border-radius:12px;" autoplay muted loop playsinline></video>' +
            '<button onclick="window._mpRemovePostVideo()" style="position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.7);border:none;color:#fff;font-size:14px;cursor:pointer;">✕</button>' +
            '<div style="position:absolute;bottom:6px;left:6px;padding:3px 8px;border-radius:6px;background:rgba(0,0,0,0.6);font-size:10px;color:#fff;">🎬 ' + Math.round(videoEl.duration) + 's</div>' +
            '</div>';
        }
      };
      videoEl.src = URL.createObjectURL(file);
    });

    // Pre-fill location
    if (_userLat && _userLng) {
      // Use cached city from weather if available
      var weatherCity = document.querySelector('[data-weather-city]');
      if (weatherCity) {
        var c = weatherCity.getAttribute('data-weather-city');
        if (c) document.getElementById('mpPostCity').value = c;
      }
    }
  };

  var _postPhotoURLs = [];
  function _renderPostPhotos() {
    var container = document.getElementById('mpPostPhotos');
    if (!container) return;
    // Revoke previous object URLs to prevent leaks on re-render
    _postPhotoURLs.forEach(function(u) { try { URL.revokeObjectURL(u); } catch(e) {} });
    _postPhotoURLs = [];
    var html = '';
    _postPhotos.forEach(function(f, i) {
      var url = URL.createObjectURL(f);
      _postPhotoURLs.push(url);
      html += '<div style="position:relative;width:80px;height:80px;border-radius:10px;overflow:hidden;">';
      html += '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;" />';
      html += '<button onclick="window._mpRemovePostPhoto(' + i + ')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0.7);border:none;color:#fff;font-size:12px;cursor:pointer;">✕</button>';
      html += '</div>';
    });
    if (_postPhotos.length < 8) {
      html += '<div onclick="document.getElementById(\'mpPostPhotoInput\').click()" style="width:80px;height:80px;border-radius:10px;background:#FFFFFF;border:2px dashed rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;"><span style="font-size:24px;color:#4B5563;">+</span></div>';
    }
    container.innerHTML = html;
  }

  window._mpRemovePostPhoto = function(idx) {
    _postPhotos.splice(idx, 1);
    _renderPostPhotos();
  };

  window._mpRemovePostVideo = function() {
    _postVideo = null;
    var preview = document.getElementById('mpPostVideoPreview');
    if (preview) {
      preview.innerHTML = '<div onclick="document.getElementById(\'mpPostVideoInput\').click()" style="width:100%;height:120px;border-radius:12px;background:#FFFFFF;border:2px dashed rgba(0,0,0,0.08);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;gap:4px;">' +
        '<span style="font-size:32px;">🎬</span>' +
        '<span style="font-size:12px;color:#4B5563;">Toca para grabar o subir video</span></div>';
    }
  };

  // ── Submit listing ───────────────────────────────────────────
  window._mpSubmitListing = async function() {
    var title = (document.getElementById('mpPostTitle').value || '').trim();
    var price = parseFloat(document.getElementById('mpPostPrice').value || 0);
    var category = document.getElementById('mpPostCategory').value;
    var condition = document.getElementById('mpPostCondition').value;
    var desc = (document.getElementById('mpPostDesc').value || '').trim();
    var city = (document.getElementById('mpPostCity').value || '').trim();
    var state = (document.getElementById('mpPostState').value || '').trim();

    if (!title) { _toast(_t('mkt_add_title', 'Agrega un título'), 'error'); return; }
    if (price <= 0) { _toast(_t('mkt_add_valid_price', 'Agrega un precio válido'), 'error'); return; }
    if (_postPhotos.length === 0) { _toast(_t('mkt_add_one_photo', 'Agrega al menos una foto'), 'error'); return; }

    // Check prohibited
    var titleLower = title.toLowerCase() + ' ' + desc.toLowerCase();
    var blocked = PROHIBITED_ITEMS.some(function(p) { return titleLower.indexOf(p) !== -1; });
    if (blocked) { _toast(_t('mkt_item_not_allowed', 'Este artículo no está permitido'), 'error'); return; }

    var btn = document.getElementById('mpPostSubmit');
    if (window.BtnLoading) window.BtnLoading.start(btn, _t('mkt_publishing', 'Publicando...'));

    try {
      // Upload photos
      var photoUrls = [];
      for (var i = 0; i < _postPhotos.length; i++) {
        var file = _postPhotos[i];
        var ext = file.name.split('.').pop();
        var path = 'marketplace/listings/' + _email.replace(/[^a-z0-9]/g, '_') + '_' + Date.now() + '_' + i + '.' + ext;
        var upRes = await SB.storage.from('school-files').upload(path, file, { upsert: true });
        if (upRes.data) {
          var urlRes = SB.storage.from('school-files').getPublicUrl(path);
          photoUrls.push(urlRes.data.publicUrl);
        }
      }

      // Upload video if present
      var videoUrl = '';
      if (_postVideo) {
        var vext = _postVideo.name.split('.').pop();
        var vpath = 'marketplace/videos/' + _email.replace(/[^a-z0-9]/g, '_') + '_' + Date.now() + '.' + vext;
        var vRes = await SB.storage.from('school-files').upload(vpath, _postVideo, { upsert: true });
        if (vRes.data) {
          var vUrlRes = SB.storage.from('school-files').getPublicUrl(vpath);
          videoUrl = vUrlRes.data.publicUrl;
        }
      }

      var listingData = {
        seller_email: _email,
        title: title,
        description: desc,
        price: price,
        category: category,
        condition: condition,
        photos: photoUrls,
        video_url: videoUrl || null,
        latitude: _userLat,
        longitude: _userLng,
        city: city,
        state: state,
        status: 'active'
      };

      var insertRes = await SB.from('marketplace_listings').insert(listingData);
      if (insertRes.error) throw insertRes.error;

      // Update seller listing count
      _seller.total_listings = (_seller.total_listings || 0) + 1;

      _toast('¡Publicado!');
      var overlay = document.getElementById('mpPostOverlay');
      if (overlay) overlay.remove();
      _loadListings(true);

    } catch(e) {
      console.error('[Marketplace] Post error:', e);
      _toast('Error al publicar. Intenta de nuevo.', 'error');
    } finally {
      if (window.BtnLoading) window.BtnLoading.stop(btn);
    }
  };

  function _showPaywall() { /* no-op: marketplace is free for all users */ }


  // ══════════════════════════════════════════════════════════════
  // MY LISTINGS
  // ══════════════════════════════════════════════════════════════
  window._mpShowMyListings = function() {
    SB.from('marketplace_listings').select('*').eq('seller_email', _email).order('created_at', { ascending: false }).then(function(res) {
      var items = res.data || [];
      var overlay = document.createElement('div');
      overlay.id = 'mpMyListingsOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F5F5F7;overflow-y:auto;';

      var html = '<div class="sticky-nav-bar sticky-nav-bar--light"><button onclick="document.getElementById(\'mpMyListingsOverlay\').remove()" class="btn-nav-back">← Volver</button><span class="nav-bar-title">Mis Publicaciones (' + items.length + ')</span></div>';
      html += '<div style="padding:16px;">';

      if (items.length === 0) {
        html += '<div class="mx-empty">' +
          '<div class="mx-empty-icon">📦</div>' +
          '<div class="mx-empty-title">No tienes publicaciones</div>' +
          '<div class="mx-empty-desc">Cuando publiques algo, aparecerá aquí para que puedas gestionarlo.</div>' +
          '<button class="mx-empty-cta" onclick="document.getElementById(\'mpMyListingsOverlay\').remove(); window._mpShowPostForm();">Crear publicación</button>' +
          '</div>';
      } else {
        items.forEach(function(item) {
          var photo = (item.photos && item.photos.length > 0) ? item.photos[0] : '';
          var statusColor = item.status === 'active' ? '#16a34a' : item.status === 'sold' ? '#3b82f6' : '#57574F';
          var statusLabel = item.status === 'active' ? 'Activo' : item.status === 'sold' ? 'Vendido' : item.status;

          html += '<div style="display:flex;gap:12px;padding:12px;background:#FFFFFF;border-radius:12px;margin-bottom:10px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 2px 8px rgba(0,0,0,0.04);">';
          if (photo) {
            html += '<img src="' + photo + '" style="width:70px;height:70px;border-radius:10px;object-fit:cover;flex-shrink:0;" />';
          }
          html += '<div style="flex:1;min-width:0;">';
          html += '<div style="font-size:14px;font-weight:700;color:#1C1C1E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.title + '</div>';
          html += '<div style="font-size:16px;font-weight:800;color:#16a34a;margin:2px 0;">$' + Number(item.price).toLocaleString() + '</div>';
          html += '<div style="display:flex;gap:10px;font-size:11px;color:#374151;">';
          html += '<span style="color:' + statusColor + ';font-weight:600;">' + statusLabel + '</span>';
          html += '<span>👁️ ' + (item.view_count || 0) + '</span>';
          html += '<span>💬 ' + (item.message_count || 0) + '</span>';
          html += '</div></div>';

          // Actions
          html += '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">';
          if (item.status === 'active') {
            html += '<button onclick="window._mpMarkSold(\'' + item.id + '\')" style="padding:6px 10px;' + _btnCSS + 'background:rgba(59,130,246,0.15);color:#007AFF;font-size:11px;">Vendido</button>';
            html += '<button onclick="window._mpDeleteListing(\'' + item.id + '\')" style="padding:6px 10px;' + _btnCSS + 'background:rgba(239,68,68,0.1);color:#DC2626;font-size:11px;">Borrar</button>';
          }
          html += '</div></div>';
        });
      }

      html += '</div>';
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
    });
  };

  window._mpMarkSold = function(id) {
    SB.from('marketplace_listings').update({ status: 'sold', updated_at: new Date().toISOString() }).eq('id', id).then(function() {
      _toast('¡Marcado como vendido! Deja una review.');
      // Refresh my listings
      var overlay = document.getElementById('mpMyListingsOverlay');
      if (overlay) overlay.remove();
      window._mpShowMyListings();
      // TODO: prompt review
    });
  };

  window._mpDeleteListing = function(id) {
    var _ask = (window.MaestroDialog && window.MaestroDialog.confirm)
      ? window.MaestroDialog.confirm({
          title: _t('mkt_delete_listing_title', 'Eliminar publicación'),
          message: _t('mkt_delete_listing_msg', '¿Seguro que quieres eliminar esta publicación? No podrás recuperarla.'),
          okText: _t('mkt_delete_listing_ok', 'Eliminar'),
          cancelText: _t('cancel', 'Cancelar'),
          destructive: true,
          kind: 'warning'
        })
      : Promise.resolve(confirm(_t('mkt_delete_listing_q', '¿Eliminar esta publicación?')));
    _ask.then(function(ok) {
      if (!ok) return;
      SB.from('marketplace_listings').update({ status: 'removed' }).eq('id', id).then(function() {
        _toast(_t('mkt_listing_deleted', 'Publicación eliminada'));
        var overlay = document.getElementById('mpMyListingsOverlay');
        if (overlay) overlay.remove();
        window._mpShowMyListings();
      });
    });
  };

  // ══════════════════════════════════════════════════════════════
  // IN-APP MESSAGING
  // ══════════════════════════════════════════════════════════════
  var _chatPollTimer = null;
  var _currentConvId = null;

  // ── Open or create conversation with seller ──────────────────
  window._mpStartChat = function(listingId) {
    var item = _listings.find(function(l) { return l.id === listingId; }) || _currentDetail;
    if (!item) return;
    if (item.seller_email === _email) { _toast('No puedes mensajearte a ti mismo', 'error'); return; }

    // Increment message count
    SB.rpc('mp_increment_messages', { p_listing_id: listingId }).then(function() {});

    // Get or create conversation
    SB.from('marketplace_conversations')
      .select('*')
      .eq('listing_id', listingId)
      .eq('buyer_email', _email)
      .limit(1)
      .then(function(res) {
        if (res.data && res.data.length > 0) {
          _openChat(res.data[0], item);
        } else {
          // Create new conversation
          SB.from('marketplace_conversations').insert({
            listing_id: listingId,
            buyer_email: _email,
            seller_email: item.seller_email
          }).select().then(function(insertRes) {
            if (insertRes.data && insertRes.data[0]) {
              _openChat(insertRes.data[0], item);
            } else {
              _toast(_t('mkt_err_start_conversation', 'Error al iniciar conversación'), 'error');
            }
          }).catch(function() { _toast(_t('mkt_err_start_conversation', 'Error al iniciar conversación'), 'error'); });
        }
      });
  };

  // ── Open chat for a conversation (from seller side) ──────────
  window._mpOpenConvChat = function(convId) {
    SB.from('marketplace_conversations').select('*').eq('id', convId).limit(1).then(function(res) {
      if (!res.data || !res.data[0]) return;
      var conv = res.data[0];
      // Load listing info
      SB.from('marketplace_listings').select('*').eq('id', conv.listing_id).limit(1).then(function(lRes) {
        var item = (lRes.data && lRes.data[0]) ? lRes.data[0] : { title: 'Publicación', photos: [] };
        _openChat(conv, item);
      });
    });
  };

  function _openChat(conv, item) {
    _currentConvId = conv.id;
    var otherEmail = (conv.buyer_email === _email) ? conv.seller_email : conv.buyer_email;
    var isBuyer = (conv.buyer_email === _email);

    // Mark as read
    SB.rpc('mp_mark_read', { p_conversation_id: conv.id, p_reader_email: _email }).then(function() {});

    var overlay = document.createElement('div');
    overlay.id = 'mpChatOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:#F5F5F7;display:flex;flex-direction:column;';

    // Header
    var photo = (item.photos && item.photos.length > 0) ? item.photos[0] : '';
    var html = '<div style="flex-shrink:0;display:flex;align-items:center;gap:10px;padding:12px 16px;background:#FFFFFF;border-bottom:1px solid rgba(0,0,0,0.06);">';
    html += '<button onclick="window._mpCloseChat()" style="background:none;border:none;color:#007AFF;font-size:18px;cursor:pointer;padding:4px;">←</button>';
    if (photo) html += '<img src="' + photo + '" style="width:36px;height:36px;border-radius:8px;object-fit:cover;" />';
    html += '<div style="flex:1;min-width:0;">';
    html += '<div style="font-size:13px;font-weight:700;color:#1C1C1E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (item.title || 'Producto') + '</div>';
    html += '<div style="font-size:11px;color:#374151;">$' + Number(item.price || 0).toLocaleString() + '</div>';
    html += '</div>';
    // Voice call button
    html += '<button onclick="window._mpStartCall(\'' + conv.id + '\',\'' + otherEmail + '\')" style="background:rgba(34,197,94,0.15);border:none;color:#16a34a;width:36px;height:36px;border-radius:50%;font-size:16px;cursor:pointer;">📞</button>';
    html += '</div>';

    // Messages container
    html += '<div id="mpChatMessages" style="flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:6px;">';
    html += '</div>';

    // Safety reminder
    html += '<div style="flex-shrink:0;padding:4px 16px;font-size:9px;color:rgba(234,179,8,0.5);text-align:center;">' + _t('mkt_safety_reminder', '⚠️ No compartas información bancaria. Reúnete en lugar público.') + '</div>';

    // Input area
    html += '<div style="flex-shrink:0;display:flex;align-items:center;gap:8px;padding:10px 16px 20px;background:#FFFFFF;border-top:1px solid rgba(0,0,0,0.06);">';
    html += '<input id="mpChatInput" type="text" placeholder="' + _t('mkt_write_message', 'Escribe un mensaje...') + '" style="' + _inputCSS + 'flex:1;background:#F2F2F7;" onkeydown="if(event.key===\'Enter\')window._mpSendMsg()" />';
    html += '<button onclick="window._mpSendMsg()" style="width:40px;height:40px;border-radius:50%;background:#3b82f6;border:none;color:#fff;font-size:16px;cursor:pointer;flex-shrink:0;">➤</button>';
    html += '</div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    // Premium skeleton placeholders while messages load
    var _mpMsgs = document.getElementById('mpChatMessages');
    if (_mpMsgs && window.Skeleton) window.Skeleton.listRow(_mpMsgs, 3);

    // Load messages
    _loadMessages(conv.id);

    // Poll for new messages every 8 seconds (pauses when tab hidden)
    clearInterval(_chatPollTimer);
    _chatPollTimer = setInterval(function() {
      if (!document.hidden) _loadMessages(conv.id);
    }, 8000);
  }

  function _loadMessages(convId) {
    SB.from('marketplace_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
      .limit(200)
      .then(function(res) {
        var msgs = res.data || [];
        var container = document.getElementById('mpChatMessages');
        if (!container) return;

        if (msgs.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#4B5563;font-size:13px;">Inicia la conversación.<br>Sé respetuoso y honesto.</div>';
          return;
        }

        var html = '';
        var lastDate = '';
        msgs.forEach(function(m) {
          var date = new Date(m.created_at).toLocaleDateString();
          if (date !== lastDate) {
            html += '<div style="text-align:center;font-size:10px;color:#4B5563;padding:8px 0;">' + date + '</div>';
            lastDate = date;
          }
          var isMine = m.sender_email === _email;
          var time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (m.message_type === 'call_started' || m.message_type === 'call_ended') {
            html += '<div style="text-align:center;font-size:11px;color:#4B5563;padding:6px 0;">📞 ' + m.message + '</div>';
          } else {
            html += '<div style="display:flex;justify-content:' + (isMine ? 'flex-end' : 'flex-start') + ';">';
            html += '<div style="max-width:78%;padding:10px 14px;border-radius:' + (isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px') + ';background:' + (isMine ? '#007AFF' : '#E9E9EB') + ';">';
            html += '<div style="font-size:14px;color:' + (isMine ? '#FFFFFF' : '#1C1C1E') + ';word-wrap:break-word;white-space:pre-wrap;">' + _escapeHtml(m.message) + '</div>';
            html += '<div style="font-size:9px;color:' + (isMine ? 'rgba(255,255,255,0.7)' : '#AEAEB2') + ';margin-top:4px;text-align:right;">' + time + (isMine && m.read ? ' ✓' : '') + '</div>';
            html += '</div></div>';
          }
        });

        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;

        // Mark as read
        SB.rpc('mp_mark_read', { p_conversation_id: convId, p_reader_email: _email }).then(function() {});
      });
  }

  function _escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  window._mpSendMsg = function() {
    var input = document.getElementById('mpChatInput');
    if (!input) return;
    var msg = input.value.trim();
    if (!msg || !_currentConvId) return;
    input.value = '';

    SB.from('marketplace_messages').insert({
      conversation_id: _currentConvId,
      sender_email: _email,
      message: msg,
      message_type: 'text'
    }).then(function() {
      _loadMessages(_currentConvId);
    }).catch(function() {
      _toast('Error al enviar mensaje', 'error');
    });
  };

  window._mpCloseChat = function() {
    clearInterval(_chatPollTimer);
    _currentConvId = null;
    var overlay = document.getElementById('mpChatOverlay');
    if (overlay) overlay.remove();
  };

  // ══════════════════════════════════════════════════════════════
  // CONVERSATIONS LIST (Inbox)
  // ══════════════════════════════════════════════════════════════
  window._mpShowInbox = function() {
    SB.from('marketplace_conversations')
      .select('*, marketplace_listings(title, photos, price, status)')
      .or('buyer_email.eq.' + _email + ',seller_email.eq.' + _email)
      .order('last_message_at', { ascending: false })
      .then(function(res) {
        var convs = res.data || [];
        var overlay = document.createElement('div');
        overlay.id = 'mpInboxOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F5F5F7;overflow-y:auto;';

        var html = '<div class="sticky-nav-bar sticky-nav-bar--light">';
        html += '<button onclick="document.getElementById(\'mpInboxOverlay\').remove()" class="btn-nav-back">← Volver</button>';
        html += '<span class="nav-bar-title">💬 Mensajes</span></div>';
        html += '<div style="padding:16px;">';

        if (convs.length === 0) {
          html += '<div class="mx-empty">' +
            '<div class="mx-empty-icon">💬</div>' +
            '<div class="mx-empty-title">Sin conversaciones</div>' +
            '<div class="mx-empty-desc">Cuando contactes a un vendedor, aparecerá aquí.</div>' +
            '</div>';
        } else {
          convs.forEach(function(conv) {
            var isBuyer = (conv.buyer_email === _email);
            var otherEmail = isBuyer ? conv.seller_email : conv.buyer_email;
            var unread = isBuyer ? (conv.buyer_unread || 0) : (conv.seller_unread || 0);
            var listing = conv.marketplace_listings || {};
            var photo = (listing.photos && listing.photos.length > 0) ? listing.photos[0] : '';
            var lastMsg = conv.last_message || 'Sin mensajes';
            if (lastMsg.length > 50) lastMsg = lastMsg.substring(0, 50) + '…';

            html += '<div onclick="window._mpOpenConvChat(\'' + conv.id + '\')" style="display:flex;gap:12px;padding:12px;background:#FFFFFF;border-radius:12px;margin-bottom:8px;cursor:pointer;border:1px solid ' + (unread > 0 ? 'rgba(59,130,246,0.3)' : 'rgba(0,0,0,0.06)') + ';">';
            if (photo) {
              html += '<img src="' + photo + '" style="width:50px;height:50px;border-radius:10px;object-fit:cover;flex-shrink:0;" />';
            } else {
              html += '<div style="width:50px;height:50px;border-radius:10px;background:#F2F2F7;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📦</div>';
            }
            html += '<div style="flex:1;min-width:0;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
            html += '<span style="font-size:13px;font-weight:700;color:#1C1C1E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (listing.title || 'Producto') + '</span>';
            if (unread > 0) html += '<span style="background:#3b82f6;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;flex-shrink:0;">' + unread + '</span>';
            html += '</div>';
            html += '<div style="font-size:12px;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">' + otherEmail.split('@')[0] + ': ' + lastMsg + '</div>';
            html += '<div style="font-size:10px;color:#4B5563;margin-top:2px;">' + _timeAgo(conv.last_message_at) + '</div>';
            html += '</div></div>';
          });
        }

        html += '</div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
      });
  };

  // ══════════════════════════════════════════════════════════════
  // VOICE CALLS via 100ms
  // ══════════════════════════════════════════════════════════════
  var _callRoomId = null;
  var _callHmsStore = null;
  var _callHmsActions = null;

  window._mpStartCall = function(convId, otherEmail) {
    if (!window.HMSReactiveStore) {
      _toast(_t('mkt_calls_unavailable', 'Módulo de llamadas no disponible'), 'error');
      return;
    }

    _toast('Iniciando llamada...');

    // Create or get room for this conversation
    var roomName = 'mp-chat-' + convId.substring(0, 8);
    var sbUrl = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');

    _mpGetAuthHeaders().then(function(hdrs) {
      fetch(sbUrl + '/functions/v1/hms-token', {
        method: 'POST', headers: hdrs,
        body: JSON.stringify({ action: 'create_room', name: roomName, description: 'Marketplace call: ' + roomName })
      }).then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.room || !data.room.id) { _toast('Error al crear sala de llamada', 'error'); return; }
        _callRoomId = data.room.id;
        SB.from('marketplace_conversations').update({ hms_room_id: _callRoomId }).eq('id', convId).catch(function() {});
        SB.from('marketplace_calls').insert({
          conversation_id: convId, caller_email: _email, receiver_email: otherEmail,
          hms_room_id: _callRoomId, status: 'initiated'
        }).catch(function() {});
        SB.from('marketplace_messages').insert({
          conversation_id: convId, sender_email: _email,
          message: 'Llamada de voz iniciada', message_type: 'call_started'
        }).catch(function() {});

        return fetch(sbUrl + '/functions/v1/hms-token', {
          method: 'POST', headers: hdrs,
          body: JSON.stringify({
            action: 'get_token', room_id: _callRoomId, role: 'co-broadcaster',
            user_id: _email.replace(/[^a-z0-9]/g, '_'),
            user_name: (_seller ? _seller.user_name : _email.split('@')[0])
          })
        });
      }).then(function(r) { return r.json(); })
      .then(function(tokenData) {
        if (!tokenData || !tokenData.token) { _toast('Error al obtener token de llamada', 'error'); return; }
        _showCallUI(convId, otherEmail, tokenData.token);
      }).catch(function(e) {
        console.error('[Marketplace] Call error:', e);
        _toast('Error al iniciar llamada', 'error');
      });
    });
  };

  function _showCallUI(convId, otherEmail, token) {
    var callOverlay = document.createElement('div');
    callOverlay.id = 'mpCallOverlay';
    callOverlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;';

    var html = '<div style="text-align:center;">';
    html += '<div style="width:80px;height:80px;border-radius:50%;background:rgba(59,130,246,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:36px;">📞</div>';
    html += '<div style="font-size:18px;font-weight:700;color:#FFFFFF;">' + otherEmail.split('@')[0] + '</div>';
    html += '<div id="mpCallStatus" style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:6px;">Conectando...</div>';
    html += '<div id="mpCallTimer" style="font-size:24px;font-weight:300;color:#7dd3fc;margin-top:12px;">00:00</div>';
    html += '</div>';

    html += '<div style="display:flex;gap:20px;margin-top:20px;">';
    html += '<button id="mpCallMute" onclick="window._mpToggleCallMic()" style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:22px;cursor:pointer;">🎤</button>';
    html += '<button onclick="window._mpEndCall(\'' + convId + '\')" style="width:56px;height:56px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:22px;cursor:pointer;">📵</button>';
    html += '</div>';

    callOverlay.innerHTML = html;
    document.body.appendChild(callOverlay);

    // Initialize 100ms
    try {
      var hms = new window.HMSReactiveStore();
      hms.triggerOnSubscribe();
      _callHmsStore = hms.getStore();
      _callHmsActions = hms.getHMSActions();

      _callHmsActions.join({
        authToken: token,
        userName: (_seller ? _seller.user_name : _email.split('@')[0]),
        settings: { isAudioMuted: false, isVideoMuted: true }
      }).then(function() {
        var statusEl = document.getElementById('mpCallStatus');
        if (statusEl) statusEl.textContent = 'Conectado';
        _startCallTimer();
      }).catch(function(e) {
        console.error('[Marketplace] HMS join error:', e);
        _toast('Error al conectar llamada', 'error');
        window._mpEndCall(convId);
      });
    } catch(e) {
      console.error('[Marketplace] HMS init error:', e);
      _toast('Error al inicializar llamada', 'error');
    }
  }

  var _callTimerInterval = null;
  var _callSeconds = 0;

  function _startCallTimer() {
    _callSeconds = 0;
    _callTimerInterval = setInterval(function() {
      _callSeconds++;
      var min = String(Math.floor(_callSeconds / 60)).padStart(2, '0');
      var sec = String(_callSeconds % 60).padStart(2, '0');
      var el = document.getElementById('mpCallTimer');
      if (el) el.textContent = min + ':' + sec;
    }, 1000);
  }

  window._mpToggleCallMic = function() {
    if (!_callHmsActions) return;
    var btn = document.getElementById('mpCallMute');
    var store = _callHmsStore;
    if (!store) return;
    var localPeer = store.getState().room && store.getState().room.localPeer;
    // Toggle
    _callHmsActions.setLocalAudioEnabled(!store.getState().settings || false).catch(function() {});
    if (btn) {
      var isMuted = btn.getAttribute('data-muted') === '1';
      btn.setAttribute('data-muted', isMuted ? '0' : '1');
      btn.style.background = isMuted ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.3)';
      btn.textContent = isMuted ? '🎤' : '🔇';
      _callHmsActions.setLocalAudioEnabled(isMuted).catch(function() {});
    }
  };

  window._mpEndCall = function(convId) {
    clearInterval(_callTimerInterval);
    if (_callHmsActions) {
      _callHmsActions.leave().catch(function() {});
      _callHmsActions = null;
      _callHmsStore = null;
    }

    // Log call end
    if (convId) {
      SB.from('marketplace_messages').insert({
        conversation_id: convId,
        sender_email: _email,
        message: 'Llamada finalizada (' + Math.floor(_callSeconds / 60) + ':' + String(_callSeconds % 60).padStart(2, '0') + ')',
        message_type: 'call_ended'
      }).catch(function() {});
    }

    _callRoomId = null;
    _callSeconds = 0;
    var overlay = document.getElementById('mpCallOverlay');
    if (overlay) overlay.remove();
  };

  window._mpStartPayment = function() { /* no-op: marketplace is free for all users */ };

  // Check for payment return — only show success toast, tier upgrade handled by Stripe webhook
  function _checkPaymentReturn() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('mp_payment') === 'success' && localStorage.getItem('mp_payment_pending')) {
      localStorage.removeItem('mp_payment_pending');
      // NOTE: Tier upgrade is handled server-side by Stripe webhook, not client-side
      // Just re-fetch seller data to see if webhook already processed
      SB.from('marketplace_sellers').select('*').eq('user_email', _email).limit(1).then(function(res) {
        if (res.data && res.data[0]) {
          _seller = res.data[0];
          if (_seller.tier === 'paid') {
            _toast(_t('mkt_seller_activated', '¡Cuenta de vendedor activada! Ya puedes publicar sin límite.'));
          } else {
            _toast(_t('mkt_payment_received', 'Pago recibido. Tu cuenta se activará en unos minutos.'));
          }
        }
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
  // _checkPaymentReturn called from initMarketplace after SB is set

  // ══════════════════════════════════════════════════════════════
  // UNREAD BADGE COUNTER
  // ══════════════════════════════════════════════════════════════
  function _updateUnreadBadge() {
    if (!SB || !_email) return;
    SB.from('marketplace_conversations')
      .select('buyer_email, seller_email, buyer_unread, seller_unread')
      .or('buyer_email.eq.' + _email + ',seller_email.eq.' + _email)
      .then(function(res) {
        var total = 0;
        (res.data || []).forEach(function(c) {
          if (c.buyer_email === _email) total += (c.buyer_unread || 0);
          else total += (c.seller_unread || 0);
        });
        // Update badge on Mensajes button if visible
        var badge = document.getElementById('mpUnreadBadge');
        if (badge) {
          badge.textContent = total > 0 ? total : '';
          badge.style.display = total > 0 ? 'inline-block' : 'none';
        }
      });
  }

  // Poll unread every 15 seconds when marketplace is visible (pause when tab hidden)
  var _unreadTimer = null;
  function _startUnreadPolling() {
    _updateUnreadBadge();
    clearInterval(_unreadTimer);
    _unreadTimer = setInterval(_updateUnreadBadge, 15000);
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) { clearInterval(_unreadTimer); _unreadTimer = null; }
      else { _updateUnreadBadge(); _unreadTimer = setInterval(_updateUnreadBadge, 15000); }
    });
  }

  // ── Time ago helper ──────────────────────────────────────────
  function _timeAgo(dateStr) {
    if (!dateStr) return '';
    var now = Date.now();
    var then = new Date(dateStr).getTime();
    var diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return 'hace ' + Math.floor(diff / 60) + ' min';
    if (diff < 86400) return 'hace ' + Math.floor(diff / 3600) + 'h';
    if (diff < 604800) return 'hace ' + Math.floor(diff / 86400) + ' días';
    return new Date(dateStr).toLocaleDateString();
  }

})();
