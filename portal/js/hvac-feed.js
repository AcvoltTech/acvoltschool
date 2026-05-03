    // ========== HVAC AI FEED FUNCTIONS ==========
    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var _hvacFeedCache = null;
    var _hvacFeedFilter = 'all';

    async function loadHvacFeedBubble() {
      var bubble = document.getElementById('hvacFeedBubble');
      if (!bubble || !supabaseClient) return;
      try {
        var { data, error } = await supabaseClient
          .from('hvac_daily_feed')
          .select('titulo, contenido, feed_date, icono, fuente, region')
          .order('feed_date', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1);
        if (error || !data || data.length === 0) {
          bubble.style.display = 'none';
          return;
        }
        var item = data[0];
        var preview = document.getElementById('hvacFeedPreview');
        if (preview) preview.textContent = (item.icono || '💡') + ' ' + (item.titulo || _tc('feed_tips_news', 'Tips y noticias HVAC'));
        bubble.style.display = 'block';
        // Show fresh dot if today's content
        var today = new Date().toISOString().split('T')[0];
        var freshDot = document.getElementById('hvacFeedFreshDot');
        if (freshDot) freshDot.style.display = (item.feed_date === today) ? 'inline-block' : 'none';
      } catch(e) {
        console.warn('Error loading HVAC feed bubble:', e);
        bubble.style.display = 'none';
      }
    }

    async function loadHvacFeedScreen(retryCount) {
      var _retryCount = retryCount || 0;
      var MAX_RETRIES = 3;
      var container = document.getElementById('hvacFeedContainer');
      var footer = document.getElementById('hvacFeedFooter');
      var refreshBtn = document.getElementById('hvacRefreshBtn');
      if (refreshBtn) {
        var _isAdmin = typeof isAdminAuthenticated === 'function' && isAdminAuthenticated();
        refreshBtn.style.display = _isAdmin ? 'flex' : 'none';
      }
      if (!container || !supabaseClient) return;
      container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#ffffff;font-size:15px;font-weight:600;"><div style="font-size:40px;margin-bottom:12px;">⏳</div><div>' + _tc('feed_loading', 'Cargando feed...') + (_retryCount > 0 ? ' (intento ' + (_retryCount + 1) + ')' : '') + '</div></div>';
      try {
        var { data, error } = await supabaseClient
          .from('hvac_daily_feed')
          .select('*')
          .order('feed_date', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(35);
        if (error) throw error;
        _hvacFeedCache = data || [];
        _hvacFeedFilter = 'all';
        // Reset tab styles
        document.querySelectorAll('.hvac-tab').forEach(function(t) {
          t.style.background = 'rgba(255,255,255,0.06)';
          t.style.color = t.getAttribute('data-filter') === 'all' ? '#0ea5e9' : (t.getAttribute('data-filter') === 'tip' ? '#fcd34d' : '#93c5fd');
        });
        var allTab = document.querySelector('.hvac-tab[data-filter="all"]');
        if (allTab) { allTab.style.background = '#0ea5e9'; allTab.style.color = '#fff'; }
        renderHvacFeed(_hvacFeedCache);
        if (footer && data && data.length > 0) {
          var d = new Date(data[0].created_at);
          footer.textContent = _tc('feed_last_update', 'Última actualización') + ': ' + d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
      } catch(e) {
        console.warn('Error loading HVAC feed (attempt ' + (_retryCount + 1) + '):', e);
        if (_retryCount < MAX_RETRIES) {
          var delay = Math.pow(2, _retryCount) * 1000; // 1s, 2s, 4s
          setTimeout(function() { loadHvacFeedScreen(_retryCount + 1); }, delay);
          return;
        }
        container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#ef4444;"><div style="font-size:40px;margin-bottom:12px;">⚠️</div><div>' + _tc('feed_error', 'Error cargando el feed') + '</div><div style="font-size:12px;margin-top:6px;">' + _escHtml(e.message || '') + '</div><button onclick="loadHvacFeedScreen()" style="margin-top:12px;padding:8px 18px;background:#3b82f6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">' + _tc('feed_retry', 'Reintentar') + '</button></div>';
      }
    }

    function renderHvacFeed(items) {
      var container = document.getElementById('hvacFeedContainer');
      if (!container) return;
      if (!items || items.length === 0) {
        var _isAdminEmpty = typeof isAdminAuthenticated === 'function' && isAdminAuthenticated();
        var _emptyHint = _isAdminEmpty
          ? _tc('feed_press_refresh', 'Presiona "Actualizar" para generar tips y noticias')
          : _tc('feed_auto_daily', 'El contenido se actualiza automáticamente cada mañana');
        container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#ffffff;"><div style="font-size:40px;margin-bottom:12px;">📭</div><div style="font-size:16px;font-weight:800;color:#ffffff;">' + _tc('feed_no_content', 'No hay contenido aún') + '</div><div style="font-size:14px;margin-top:8px;color:#e2e8f0;font-weight:500;line-height:1.4;">' + _emptyHint + '</div></div>';
        return;
      }
      var html = '';
      var lastDate = '';
      items.forEach(function(item) {
        var date = item.feed_date || '';
        if (date !== lastDate) {
          lastDate = date;
          var d = new Date(date + 'T12:00:00');
          var today = new Date().toISOString().split('T')[0];
          var yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          var label = date === today ? _tc('feed_today', 'Hoy') : (date === yesterday ? _tc('feed_yesterday', 'Ayer') : d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
          html += '<div style="font-size:13px;font-weight:800;color:#e2e8f0;padding:10px 0 4px;text-transform:uppercase;letter-spacing:0.6px;">' + label + '</div>';
        }
        var isTip = item.tipo === 'tip';
        var bg = isTip ? 'rgba(251,191,36,0.10)' : 'rgba(96,165,250,0.10)';
        var border = isTip ? 'rgba(251,191,36,0.55)' : 'rgba(96,165,250,0.55)';
        html += '<div class="hvac-feed-item" data-tipo="' + _escHtml(item.tipo || '') + '" style="background:' + bg + ';border:1px solid rgba(255,255,255,0.12);border-left:4px solid ' + border + ';border-radius:10px;padding:12px 14px;">';
        html += '<div style="display:flex;align-items:flex-start;gap:10px;">';
        html += '<div style="font-size:20px;line-height:1;margin-top:1px;">' + _escHtml(item.icono || (isTip ? '💡' : '📰')) + '</div>';
        html += '<div style="flex:1;min-width:0;">';
        var hasLink = item.fuente_url && /^https?:\/\//i.test(item.fuente_url);
        var titleClickable = hasLink
          ? '<a href="' + _escHtml(item.fuente_url) + '" target="_blank" rel="noopener noreferrer" style="color:#ffffff;text-decoration:none;">' + _escHtml(item.titulo || '') + ' <span style="color:#93c5fd;font-weight:600;">↗</span></a>'
          : _escHtml(item.titulo || '');
        html += '<div style="font-weight:800;color:#ffffff;font-size:16px;margin-bottom:4px;line-height:1.3;">' + titleClickable + '</div>';
        html += '<div style="color:#e2e8f0;font-size:14px;line-height:1.5;font-weight:500;">' + _escHtml(item.contenido || '') + '</div>';
        html += '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap;">';
        if (item.categoria) {
          var catColor = isTip ? '#fcd34d' : '#93c5fd';
          var catBg = isTip ? 'rgba(251,191,36,0.22)' : 'rgba(96,165,250,0.22)';
          html += '<span style="font-size:11px;font-weight:700;color:' + catColor + ';background:' + catBg + ';padding:3px 8px;border-radius:5px;text-transform:uppercase;letter-spacing:0.3px;">' + _escHtml(item.categoria) + '</span>';
        }
        if (item.region) {
          html += '<span style="font-size:11px;font-weight:700;color:#6ee7b7;background:rgba(52,211,153,0.22);padding:3px 8px;border-radius:5px;text-transform:uppercase;letter-spacing:0.3px;">' + _escHtml(item.region) + '</span>';
        }
        if (item.fuente) {
          var fuenteHtml = hasLink
            ? '<a href="' + _escHtml(item.fuente_url) + '" target="_blank" rel="noopener noreferrer" style="color:#cbd5e1;text-decoration:none;border-bottom:1px dotted rgba(203,213,225,0.7);font-weight:600;">' + _escHtml(item.fuente) + '</a>'
            : _escHtml(item.fuente);
          html += '<span style="font-size:12px;color:#cbd5e1;font-weight:500;">' + _tc('feed_source', 'Fuente') + ': ' + fuenteHtml + '</span>';
        } else {
          html += '<span style="font-size:12px;color:#cbd5e1;font-weight:600;">' + (isTip ? _tc('feed_tip', 'Tip') : _tc('feed_news', 'Noticia')) + '</span>';
        }
        html += '</div></div></div></div>';
      });
      container.innerHTML = html;
    }

    function filterHvacFeed(tipo, btn) {
      _hvacFeedFilter = tipo;
      // Update tab styles
      document.querySelectorAll('.hvac-tab').forEach(function(t) {
        var f = t.getAttribute('data-filter');
        var activeBg = f === 'all' ? '#0ea5e9' : (f === 'tip' ? '#f59e0b' : '#3b82f6');
        var idleColor = f === 'all' ? '#0ea5e9' : (f === 'tip' ? '#fcd34d' : '#93c5fd');
        if (t === btn) {
          t.style.background = activeBg;
          t.style.color = '#fff';
        } else {
          t.style.background = 'rgba(255,255,255,0.06)';
          t.style.color = idleColor;
        }
      });
      if (!_hvacFeedCache) return;
      var filtered = tipo === 'all' ? _hvacFeedCache : _hvacFeedCache.filter(function(i) { return i.tipo === tipo; });
      renderHvacFeed(filtered);
    }

    async function generateHvacFeed() {
      var btn = document.getElementById('hvacRefreshBtn');
      var icon = document.getElementById('hvacRefreshIcon');
      if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
      if (icon) icon.style.animation = 'spin 1s linear infinite';
      // Add spin keyframe if not exists
      if (!document.getElementById('hvacSpinStyle')) {
        var s = document.createElement('style');
        s.id = 'hvacSpinStyle';
        s.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
        document.head.appendChild(s);
      }
      try {
        var response = await fetch(SUPABASE_URL + '/functions/v1/generate-hvac-feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'apikey': SUPABASE_KEY
          },
          body: JSON.stringify({})
        });
        var result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error generating feed');
        await loadHvacFeedScreen();
        await loadHvacFeedBubble();
      } catch(e) {
        console.error('Error generating HVAC feed:', e);
        window.MaestroDialog.alert({title: 'Error', message: _tc('feed_gen_error', 'Error generando feed') + ': ' + (e.message || _tc('feed_unknown_error', 'Error desconocido')), kind: 'error'});
      } finally {
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
        if (icon) icon.style.animation = '';
      }
    }
    // ========== END HVAC AI FEED ==========

