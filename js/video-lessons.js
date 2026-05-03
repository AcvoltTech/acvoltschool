    // ==== VIDEO LESSONS SYSTEM ====
    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

    // HTML escape helper for video lessons
    function _escVL(str) {
      if (typeof str !== 'string') return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    // Video progress tracking
    let videoProgress = {}; // { videoId: { lastPlaybackTime, duration, completed, watchedPercentage, updatedAt } }
    let currentVideoId = null;
    let videoAutoSaveInterval = null;
    const VIDEO_AUTO_SAVE_INTERVAL = 5000; // Auto-save every 5 seconds
    const VIDEO_COMPLETION_THRESHOLD = 90; // 90% watched = completed

    // YouTube Channel Configuration (API key is server-side in youtube-proxy Edge Function)
    const YOUTUBE_CHANNEL_HANDLE = '@MaestroMarioAc';
    
    // Video lessons will be loaded from YouTube
    let videoLessons = [];
    let youtubeVideosLoaded = false;
    let currentVideoFilter = 'all';
    
    // Video categories for organization
    const videoCategories = [
      { id: 'herramientas', name: _tc('vl_cat_herramientas', 'Herramientas'), icon: '🔧', keywords: ['herramienta', 'tool', 'manometro', 'multimetro', 'vacuometro', 'pinza'] },
      { id: 'tools-usage', name: _tc('vl_cat_tools_usage', 'Tools Usage'), icon: '🧰', keywords: ['tool usage', 'uso de herramienta', 'como usar'] },
      { id: 'instalacion', name: _tc('vl_cat_instalacion', 'Instalación'), icon: '🏠', keywords: ['instala', 'install', 'montaje', 'colocar'] },
      { id: 'refrigeracion', name: _tc('vl_cat_refrigeracion', 'Refrigeración'), icon: '❄️', keywords: ['refrigera', 'refrig', 'freón', 'r410', 'r22', 'carga', 'presion'] },
      { id: 'a2l-refrigerants', name: _tc('vl_cat_a2l_refrigerants', 'A2L Refrigerants'), icon: '🧪', keywords: ['a2l', 'r32', 'r454b', 'r1234', 'flammable refrigerant', 'low gwp'] },
      { id: 'electricidad', name: _tc('vl_cat_electricidad', 'Electricidad'), icon: '⚡', keywords: ['electric', 'voltaje', 'amper', 'cable', 'circuito', 'capacitor', 'contactor', 'transformador'] },
      { id: 'diagnostico', name: _tc('vl_cat_diagnostico', 'Diagnóstico'), icon: '🔍', keywords: ['diagnos', 'falla', 'problema', 'revisar', 'troubleshoot', 'no enfria', 'no enciende'] },
      { id: 'soldadura', name: _tc('vl_cat_soldadura', 'Soldadura'), icon: '🔥', keywords: ['solda', 'brazing', 'tuber', 'cobre', 'nitrogeno'] },
      { id: 'mantenimiento', name: _tc('vl_cat_mantenimiento', 'Mantenimiento'), icon: '🛠️', keywords: ['mantenim', 'limpi', 'servicio', 'maintenance', 'lavado'] },
      { id: 'teoria', name: _tc('vl_cat_teoria', 'Teoría HVAC'), icon: '📚', keywords: ['teoria', 'concepto', 'fundament', 'basic', 'principio', 'ciclo', 'ley'] },
      { id: 'epa', name: 'EPA', icon: '📋', keywords: ['epa', 'section 608', 'certification', 'environmental'] },
      { id: 'osha-safety', name: _tc('vl_cat_osha_safety', 'OSHA Safety'), icon: '🦺', keywords: ['osha', 'safety', 'seguridad', 'ppe', 'lockout', 'tagout'] },
      { id: 'heat-pumps', name: _tc('vl_cat_heat_pumps', 'Heat Pumps'), icon: '🔄', keywords: ['heat pump', 'bomba de calor', 'reversing valve', 'defrost'] },
      { id: 'mini-split', name: 'Mini Split', icon: '🌬️', keywords: ['mini split', 'minisplit', 'ductless', 'split'] },
      { id: 'gas-heating', name: _tc('vl_cat_gas_heating', 'Gas Heating'), icon: '🔥', keywords: ['gas heating', 'furnace', 'calefaccion gas', 'horno', 'gas valve'] },
      { id: 'electric-heating', name: _tc('vl_cat_electric_heating', 'Electric Heating'), icon: '♨️', keywords: ['electric heat', 'calefaccion electrica', 'heat strip', 'sequencer'] },
      { id: 'package-units', name: _tc('vl_cat_package_units', 'Package Units'), icon: '📦', keywords: ['package unit', 'rooftop', 'rtu', 'unidad paquete'] },
      { id: 'vrf', name: _tc('vl_cat_vrf', 'VRF AC Units'), icon: '🏢', keywords: ['vrf', 'vrv', 'variable refrigerant'] },
      { id: 'aircooled-chillers', name: _tc('vl_cat_aircooled_chillers', 'Aircooled Chillers'), icon: '🏭', keywords: ['aircooled chiller', 'air cooled chiller', 'chiller aire'] },
      { id: 'watercooled-chillers', name: _tc('vl_cat_watercooled_chillers', 'Watercooled Chillers'), icon: '💧', keywords: ['watercooled chiller', 'water cooled chiller', 'chiller agua', 'cooling tower'] },
      { id: 'market-refrigeration', name: _tc('vl_cat_market_refrigeration', 'Market Refrigeration'), icon: '🛒', keywords: ['market refrigeration', 'supermarket', 'display case', 'rack system'] },
      { id: 'walk-in-cooler', name: _tc('vl_cat_walk_in_cooler', 'Walk-In Cooler'), icon: '🧊', keywords: ['walk-in cooler', 'walk in cooler', 'cuarto frio'] },
      { id: 'walk-in-freezer', name: _tc('vl_cat_walk_in_freezer', 'Walk-In Freezer'), icon: '🥶', keywords: ['walk-in freezer', 'walk in freezer', 'congelador'] },
      { id: 'domestic-refrigeration', name: _tc('vl_cat_domestic_refrigeration', 'Domestic Refrigeration'), icon: '🏠', keywords: ['domestic', 'doméstico', 'refrigerador casa', 'nevera', 'fridge'] },
      { id: 'commercial-refrigeration', name: _tc('vl_cat_commercial_refrigeration', 'Commercial Refrigeration'), icon: '🏪', keywords: ['commercial refrigeration', 'refrigeracion comercial', 'reach-in'] },
      { id: 'airflow-ducting', name: _tc('vl_cat_airflow_ducting', 'Airflow & Ducting'), icon: '💨', keywords: ['airflow', 'ducting', 'duct', 'ducto', 'cfm', 'static pressure'] },
      { id: 'negocio', name: _tc('vl_cat_negocio', 'Negocio'), icon: '💼', keywords: ['negocio', 'business', 'precio', 'cobrar', 'cliente', 'empresa', 'dinero'] },
      { id: 'otros', name: _tc('vl_cat_otros', 'Otros'), icon: '📹', keywords: [] }
    ];
    
    // Load videos from YouTube API
    async function loadYouTubeVideos() {
      if (youtubeVideosLoaded && videoLessons.length > 0) {
        renderVideoLessonsList();
        return;
      }
      
      const loadingEl = document.getElementById('videoLoadingIndicator');
      const errorEl = document.getElementById('videoErrorMessage');
      const listEl = document.getElementById('videoLessonsList');

      if (loadingEl) loadingEl.style.display = 'block';
      if (errorEl) errorEl.style.display = 'none';
      if (listEl) listEl.innerHTML = '';
      
      try {
        // First, get the channel info using the handle (via server-side proxy)
        const channelResponse = await fetch(
          SUPABASE_URL + '/functions/v1/youtube-proxy',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'channels', params: { part: 'contentDetails,snippet', forHandle: YOUTUBE_CHANNEL_HANDLE } }) }
        );
        const channelData = await channelResponse.json();
        
        if (channelData.error) {
          throw new Error(channelData.error.message || _tc('vl_api_error', 'Error de API'));
        }
        
        if (!channelData.items || channelData.items.length === 0) {
          throw new Error(_tc('vl_channel_not_found', 'Canal no encontrado'));
        }
        
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        
        // Get videos from uploads playlist (get more videos)
        let allVideos = [];
        let nextPageToken = '';
        
        do {
          const videosResponse = await fetch(
            SUPABASE_URL + '/functions/v1/youtube-proxy',
            { method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'playlistItems', params: { part: 'snippet,contentDetails', playlistId: uploadsPlaylistId, maxResults: '50', pageToken: nextPageToken } }) }
          );
          const videosData = await videosResponse.json();
          
          if (videosData.error) {
            throw new Error(videosData.error.message || _tc('vl_error_loading', 'Error al cargar videos'));
          }
          
          if (videosData.items && videosData.items.length > 0) {
            allVideos = allVideos.concat(videosData.items);
          } else {
            break; // No items returned — prevent infinite loop
          }

          nextPageToken = videosData.nextPageToken || '';
        } while (nextPageToken && allVideos.length < 300); // Get up to 300 videos

        if (allVideos.length >= 300) {
          console.warn('Video list truncated at 300. Some videos may not be shown.');
        }

        // Get video durations in batches of 50
        const durationMap = {};
        const viewsMap = {};
        
        for (let i = 0; i < allVideos.length; i += 50) {
          const batch = allVideos.slice(i, i + 50);
          const videoIds = batch.map(v => v.contentDetails.videoId).join(',');
          
          const detailsResponse = await fetch(
            SUPABASE_URL + '/functions/v1/youtube-proxy',
            { method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'videos', params: { part: 'contentDetails,statistics', id: videoIds } }) }
          );
          const detailsData = await detailsResponse.json();
          
          if (detailsData.items) {
            detailsData.items.forEach(item => {
              durationMap[item.id] = parseDuration(item.contentDetails.duration);
              viewsMap[item.id] = parseInt(item.statistics.viewCount) || 0;
            });
          }
        }
        
        // Transform to our video format
        videoLessons = allVideos.map(item => {
          const snippet = item.snippet;
          const videoId = item.contentDetails.videoId;
          const category = categorizeVideo(snippet.title, snippet.description);
          
          return {
            id: videoId,
            youtubeId: videoId,
            title: snippet.title,
            description: snippet.description || _tc('vl_default_description', 'Video de ACVOLT'),
            thumbnail: snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
            duration: durationMap[videoId] || 0,
            views: viewsMap[videoId] || 0,
            category: category,
            publishedAt: snippet.publishedAt,
            isYouTube: true
          };
        });
        
        youtubeVideosLoaded = true;
        if (loadingEl) loadingEl.style.display = 'none';
        renderVideoLessonsList();

      } catch (error) {
        console.error('Error loading YouTube videos:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'block';
        const errorTextEl = document.getElementById('videoErrorText');
        if (errorTextEl) errorTextEl.textContent = _tc('vl_error_loading', 'Error al cargar videos') + ': ' + error.message;
      }
    }
    
    // Parse YouTube duration format (PT1H2M3S) to seconds
    function parseDuration(duration) {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return 0;
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
    
    // Categorize video based on title and description
    function categorizeVideo(title, description) {
      const text = (title + ' ' + description).toLowerCase();
      
      for (const cat of videoCategories) {
        if (cat.keywords.length === 0) continue;
        for (const keyword of cat.keywords) {
          if (text.includes(keyword.toLowerCase())) {
            return cat.id;
          }
        }
      }
      return 'otros';
    }
    
    // Filter videos by level/category
    function filterVideosByLevel(level) {
      currentVideoFilter = level;
      
      // Update tab styles
      document.querySelectorAll('.video-level-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.level === level) {
          tab.classList.add('active');
        }
      });
      
      renderVideoLessonsList();
    }
    
    // Format views count
    function formatViews(views) {
      if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
      if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
      return views.toString();
    }


    // ==================== VIDEO LESSONS SECTION ====================

    // Load video progress from localStorage
    function loadVideoProgress() {
      try {
        const saved = localStorage.getItem('tecnico_videoProgress');
        if (saved) {
          videoProgress = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load video progress from localStorage:', e);
      }
    }

    // Save video progress to localStorage
    function saveVideoProgress() {
      try {
        localStorage.setItem('tecnico_videoProgress', JSON.stringify(videoProgress));
      } catch (e) {
        console.warn('Failed to save video progress to localStorage (quota exceeded?):', e);
      }
    }

    // Format time in MM:SS format
    function formatVideoTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Get video progress for a specific video
    function getVideoProgress(videoId) {
      return videoProgress[videoId] || {
        lastPlaybackTime: 0,
        duration: 0,
        completed: false,
        watchedPercentage: 0,
        updatedAt: null
      };
    }

    // Update video progress
    function updateVideoProgress(videoId, currentTime, duration) {
      const watchedPercentage = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
      const completed = watchedPercentage >= VIDEO_COMPLETION_THRESHOLD;

      videoProgress[videoId] = {
        lastPlaybackTime: currentTime,
        duration: duration,
        completed: completed,
        watchedPercentage: watchedPercentage,
        updatedAt: new Date().toISOString()
      };

      saveVideoProgress();
      updateVideoPlayerUI();
    }

    // Mark video as completed (manual override)
    function markVideoAsWatched() {
      if (!currentVideoId) return;

      const video = document.getElementById('videoPlayer');
      const duration = video.duration || videoLessons.find(v => v.id === currentVideoId)?.duration || 0;

      videoProgress[currentVideoId] = {
        lastPlaybackTime: duration,
        duration: duration,
        completed: true,
        watchedPercentage: 100,
        updatedAt: new Date().toISOString()
      };

      saveVideoProgress();
      updateVideoPlayerUI();

      // Track activity
      updateLastActivity('video', currentVideoId, null, null, 'videoPlayerScreen');
    }

    // Start auto-save interval for video progress
    function startVideoAutoSave() {
      stopVideoAutoSave(); // Clear any existing interval

      videoAutoSaveInterval = setInterval(() => {
        if (!currentVideoId) return;

        const video = document.getElementById('videoPlayer');
        if (video && !video.paused && video.currentTime > 0) {
          updateVideoProgress(currentVideoId, video.currentTime, video.duration);
        }
      }, VIDEO_AUTO_SAVE_INTERVAL);
    }

    // Stop auto-save interval
    function stopVideoAutoSave() {
      if (videoAutoSaveInterval) {
        clearInterval(videoAutoSaveInterval);
        videoAutoSaveInterval = null;
      }
    }

    // Update video player UI (progress bar, status, CTA button)
    function updateVideoPlayerUI() {
      if (!currentVideoId) return;

      const progress = getVideoProgress(currentVideoId);
      const video = document.getElementById('videoPlayer');
      const currentTime = video ? video.currentTime : progress.lastPlaybackTime;
      const duration = video && video.duration ? video.duration : progress.duration;

      // Update progress bar
      const progressFill = document.getElementById('videoProgressFill');
      const progressText = document.getElementById('videoProgressText');

      if (progressFill && duration > 0) {
        const percentage = (currentTime / duration) * 100;
        progressFill.style.width = `${percentage}%`;
      }

      if (progressText) {
        progressText.textContent = `${formatVideoTime(currentTime)} / ${formatVideoTime(duration)}`;
      }

      // Update status badge
      const statusBadge = document.getElementById('videoStatusBadge');
      const statusIcon = document.getElementById('videoStatusIcon');
      const statusTitle = document.getElementById('videoStatusTitle');
      const statusDetail = document.getElementById('videoStatusDetail');

      if (statusBadge && statusIcon && statusTitle && statusDetail) {
        if (progress.completed) {
          statusBadge.className = 'video-status video-completed-badge';
          statusIcon.textContent = '✅';
          statusTitle.textContent = _tc('vl_video_completed', 'Video completado');
          statusDetail.textContent = _tc('vl_fully_watched', '100% visto');
        } else if (progress.lastPlaybackTime > 0) {
          statusBadge.className = 'video-status video-in-progress-badge';
          statusIcon.textContent = '▶️';
          statusTitle.textContent = _tc('vl_in_progress', 'En progreso');
          statusDetail.textContent = `${progress.watchedPercentage}% ${_tc('vl_completed_suffix', 'completado')}`;
        } else {
          statusBadge.className = 'video-status';
          statusIcon.textContent = '🎬';
          statusTitle.textContent = _tc('vl_not_started', 'No iniciado');
          statusDetail.textContent = _tc('vl_start_watching', 'Comienza a ver este video');
        }
      }

      // Update CTA button
      const ctaButton = document.getElementById('videoCTAButton');
      const markAsWatchedBtn = document.getElementById('videoMarkAsWatchedBtn');

      if (ctaButton && markAsWatchedBtn) {
        if (progress.completed) {
          ctaButton.textContent = _tc('vl_video_completed', 'Video completado');
          ctaButton.className = 'btn btn-video-completed';
          ctaButton.disabled = true;
          markAsWatchedBtn.style.display = 'none';
        } else if (progress.lastPlaybackTime > 0) {
          ctaButton.textContent = _tc('vl_continue_video', 'Continuar video');
          ctaButton.className = 'btn btn-video-primary';
          ctaButton.disabled = false;
          markAsWatchedBtn.style.display = 'block';
        } else {
          ctaButton.textContent = _tc('vl_start_video', 'Iniciar video');
          ctaButton.className = 'btn btn-video-primary';
          ctaButton.disabled = false;
          markAsWatchedBtn.style.display = 'block';
        }
      }
    }

    // Handle CTA button click
    function handleVideoCTA() {
      const video = document.getElementById('videoPlayer');
      const progress = getVideoProgress(currentVideoId);

      if (progress.completed) return;

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }

    // Render video lessons list
    function renderVideoLessonsList() {
      loadVideoProgress();

      const container = document.getElementById('videoLessonsList');
      container.innerHTML = '';

      if (videoLessons.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#3D3D3A; padding:20px;">' + _tc('vl_no_lessons', 'No hay video lecciones disponibles.') + '</p>';
        return;
      }
      
      // Filter videos by current filter
      let filteredVideos = videoLessons;
      if (currentVideoFilter !== 'all') {
        filteredVideos = videoLessons.filter(v => v.category === currentVideoFilter);
      }
      
      // Update category tabs
      updateVideoTabs();
      
      // Update progress summary
      updateVideoProgressSummary();
      
      // Group videos by category
      const groupedVideos = {};
      filteredVideos.forEach(video => {
        const cat = video.category || 'otros';
        if (!groupedVideos[cat]) {
          groupedVideos[cat] = [];
        }
        groupedVideos[cat].push(video);
      });
      
      // Render each category
      videoCategories.forEach(category => {
        const videos = groupedVideos[category.id];
        if (!videos || videos.length === 0) return;
        
        const section = document.createElement('div');
        section.className = 'video-category-section';
        
        // Category header
        const header = document.createElement('div');
        header.className = 'video-category-header';
        header.innerHTML = `<span style="font-size:20px;">${category.icon}</span><h3>${category.name}</h3><span style="color:#3D3D3A; font-size:12px; margin-left:auto;">${videos.length} ${_tc('vl_videos_count', 'videos')}</span>`;
        section.appendChild(header);
        
        // Videos in this category
        videos.forEach(video => {
          const progress = getVideoProgress(video.id);
          const card = document.createElement('div');
          
          let statusClass = '';
          if (progress.completed) {
            statusClass = 'completed';
          } else if (progress.lastPlaybackTime > 0) {
            statusClass = 'in-progress';
          }
          
          card.className = `video-card ${statusClass}`;
          
          const durationFormatted = formatVideoTime(video.duration);
          const progressPercentage = progress.watchedPercentage || 0;
          
          let statusBadge = '';
          if (progress.completed) {
            statusBadge = '<span style="color:#27ae60;">✅</span>';
          } else if (progress.lastPlaybackTime > 0) {
            statusBadge = `<span style="color:#f39c12;">${progressPercentage}%</span>`;
          }
          
          var _desc = (video && typeof video.description === 'string') ? video.description : '';
          card.innerHTML = `
            <img class="video-thumbnail" src="${_escVL(video.thumbnail)}" alt="${_escVL(video.title)}" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%2268%22><rect fill=%22%23334155%22 width=%22120%22 height=%2268%22/><rect fill=%22%23475569%22 x=%2245%22 y=%2220%22 width=%2230%22 height=%2228%22 rx=%224%22/></svg>'">
            <div class="video-card-info">
              <h4>${_escVL(video.title)}</h4>
              <p>${_escVL(_desc.substring(0, 80))}${_desc.length > 80 ? '...' : ''}</p>
              <div class="video-card-meta">
                <span>⏱️ ${durationFormatted}</span>
                ${video.views ? `<span>👁️ ${formatViews(video.views)}</span>` : ''}
                ${statusBadge}
              </div>
            </div>
          `;

          card.onclick = () => openVideoPlayer(video.id);
          section.appendChild(card);
        });
        
        container.appendChild(section);
      });
    }
    
    // Update video tabs based on available categories
    function updateVideoTabs() {
      const tabsContainer = document.getElementById('videoLevelTabs');
      tabsContainer.innerHTML = `<button class="video-level-tab ${currentVideoFilter === 'all' ? 'active' : ''}" data-level="all" onclick="filterVideosByLevel('all')">📚 ${_tc('vl_all', 'Todos')} (${videoLessons.length})</button>`;
      
      // Count videos per category
      const categoryCounts = {};
      videoLessons.forEach(v => {
        const cat = v.category || 'otros';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      
      // Add tabs for categories with videos
      videoCategories.forEach(cat => {
        if (categoryCounts[cat.id]) {
          const isActive = currentVideoFilter === cat.id ? 'active' : '';
          tabsContainer.innerHTML += `<button class="video-level-tab ${isActive}" data-level="${cat.id}" onclick="filterVideosByLevel('${cat.id}')">${cat.icon} ${cat.name} (${categoryCounts[cat.id]})</button>`;
        }
      });
    }
    
    // Update progress summary
    function updateVideoProgressSummary() {
      let watchedCount = 0;
      videoLessons.forEach(video => {
        const progress = getVideoProgress(video.id);
        if (progress.completed) watchedCount++;
      });
      
      const total = videoLessons.length;
      const percent = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
      
      document.getElementById('videosWatchedCount').textContent = watchedCount;
      document.getElementById('videosTotalCount').textContent = total;
      document.getElementById('videosCompletionPercent').textContent = percent + '%';
    }

    // Open video player
    function openVideoPlayer(videoId) {
      currentVideoId = videoId;
      loadVideoProgress();

      const lesson = videoLessons.find(v => v.id === videoId);
      if (!lesson) return;

      // Update UI
      var _bc = document.getElementById('videoBreadcrumb');
      var _vt = document.getElementById('videoTitle');
      var _vd = document.getElementById('videoDescription');
      if (_bc) _bc.textContent = `${_tc('vl_breadcrumb', 'Video Lecciones')} > ${lesson.title}`;
      if (_vt) _vt.textContent = lesson.title;
      if (_vd) _vd.textContent = lesson.description;

      const playerContainer = document.getElementById('videoPlayerContainer');
      const youtubeWrapper = document.getElementById('youtubePlayerWrapper');
      const htmlVideo = document.getElementById('videoPlayer');
      const ctaButton = document.getElementById('videoCTAButton');
      const markWatchedBtn = document.getElementById('videoMarkAsWatchedBtn');

      // Check if it's a YouTube video
      if (lesson.isYouTube && lesson.youtubeId) {
        // Hide HTML5 video, show YouTube embed
        if (htmlVideo) htmlVideo.style.display = 'none';

        // Get saved progress
        const progress = getVideoProgress(videoId);
        const startTime = progress.lastPlaybackTime > 0 ? Math.floor(progress.lastPlaybackTime) : 0;

        // Create YouTube embed WITHOUT autoplay - user controls playback
        // Validate youtubeId is alphanumeric + hyphens/underscores only (prevent URL injection)
        const safeYtId = /^[a-zA-Z0-9_-]+$/.test(lesson.youtubeId) ? lesson.youtubeId : '';
        if (safeYtId && youtubeWrapper) {
          youtubeWrapper.innerHTML = `
            <iframe
              class="youtube-embed"
              src="https://www.youtube.com/embed/${safeYtId}?start=${startTime}&rel=0&modestbranding=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          `;
        }

        // Hide the CTA button for YouTube videos (player has its own controls)
        if (ctaButton) ctaButton.style.display = 'none';
        if (markWatchedBtn) markWatchedBtn.style.display = 'block';

        // Update status
        updateYouTubePlayerUI(lesson, progress);

      } else {
        // Regular HTML5 video (fallback)
        if (!lesson.videoUrl) {
          console.warn('No videoUrl for lesson:', lesson.id);
          return;
        }
        if (!htmlVideo) {
          console.warn('No videoPlayer element found');
          return;
        }
        if (youtubeWrapper) youtubeWrapper.innerHTML = '';
        htmlVideo.style.display = 'block';
        htmlVideo.src = lesson.videoUrl;

        // Get saved progress
        const progress = getVideoProgress(videoId);

        // Setup event listeners
        htmlVideo.onloadedmetadata = () => {
          if (progress.lastPlaybackTime > 0 && progress.lastPlaybackTime < htmlVideo.duration) {
            htmlVideo.currentTime = progress.lastPlaybackTime;
          }
          updateVideoPlayerUI();
        };

        htmlVideo.ontimeupdate = () => {
          updateVideoPlayerUI();
        };

        htmlVideo.onplay = () => {
          startVideoAutoSave();
          const ctaButton = document.getElementById('videoCTAButton');
          if (ctaButton && !getVideoProgress(currentVideoId).completed) {
            ctaButton.textContent = _tc('vl_pause_video', 'Pausar video');
          }
        };

        htmlVideo.onpause = () => {
          if (currentVideoId && htmlVideo.currentTime > 0) {
            updateVideoProgress(currentVideoId, htmlVideo.currentTime, htmlVideo.duration);
          }
          const ctaButton = document.getElementById('videoCTAButton');
          const progress = getVideoProgress(currentVideoId);
          if (ctaButton && !progress.completed) {
            ctaButton.textContent = progress.lastPlaybackTime > 0 ? _tc('vl_continue_video', 'Continuar video') : _tc('vl_start_video', 'Iniciar video');
          }
        };

        htmlVideo.onended = () => {
          updateVideoProgress(currentVideoId, htmlVideo.duration, htmlVideo.duration);
          stopVideoAutoSave();
        };

        if (!window._vlListenersAttached) {
          window._vlListenersAttached = true;
          document.addEventListener('visibilitychange', handleVisibilityChange);
          window.addEventListener('beforeunload', saveProgressBeforeUnload);
        }
      }

      // Track activity
      updateLastActivity('video', videoId, null, null, 'videoPlayerScreen');

      // Update UI
      updateVideoPlayerUI();
      showScreen('videoPlayerScreen');
    }
    
    // Update YouTube player UI
    function updateYouTubePlayerUI(lesson, progress) {
      const statusBadge = document.getElementById('videoStatusBadge');
      const statusIcon = document.getElementById('videoStatusIcon');
      const statusTitle = document.getElementById('videoStatusTitle');
      const statusDetail = document.getElementById('videoStatusDetail');
      const progressFill = document.getElementById('videoProgressFill');
      const progressText = document.getElementById('videoProgressText');
      const ctaButton = document.getElementById('videoCTAButton');

      if (!statusBadge || !statusIcon || !statusTitle || !statusDetail) return;

      const percentage = progress.watchedPercentage || 0;

      if (progress.completed) {
        statusBadge.className = 'video-status video-completed-badge';
        statusIcon.textContent = '✅';
        statusTitle.textContent = _tc('vl_completed', 'Completado');
        statusDetail.textContent = _tc('vl_fully_watched', '100% visto');
        if (ctaButton) { ctaButton.textContent = _tc('vl_watch_again', 'Ver de nuevo'); ctaButton.className = 'btn btn-video-completed'; }
      } else if (progress.lastPlaybackTime > 0) {
        statusBadge.className = 'video-status video-in-progress-badge';
        statusIcon.textContent = '▶️';
        statusTitle.textContent = _tc('vl_continuing', 'Continuando...');
        statusDetail.textContent = `${percentage}% ${_tc('vl_watched_suffix', 'visto')}`;
        if (ctaButton) { ctaButton.textContent = _tc('vl_playing', 'Reproduciendo...'); ctaButton.className = 'btn btn-video-primary'; }
      } else {
        statusBadge.className = 'video-status';
        statusIcon.textContent = '▶️';
        statusTitle.textContent = _tc('vl_playing_title', 'Reproduciendo');
        statusDetail.textContent = _tc('vl_video_started', 'Video iniciado');
        if (ctaButton) { ctaButton.textContent = _tc('vl_playing', 'Reproduciendo...'); ctaButton.className = 'btn btn-video-primary'; }
      }

      if (progressFill) progressFill.style.width = `${percentage}%`;
      if (progressText) progressText.textContent = `${_tc('vl_duration', 'Duración')}: ${formatVideoTime(lesson.duration)}`;
    }

    // Handle visibility change (save progress when user switches tabs)
    function handleVisibilityChange() {
      if (document.hidden && currentVideoId) {
        const video = document.getElementById('videoPlayer');
        if (video && video.currentTime > 0) {
          updateVideoProgress(currentVideoId, video.currentTime, video.duration);
        }
      }
    }

    // Save progress before page unload
    function saveProgressBeforeUnload() {
      if (currentVideoId) {
        const video = document.getElementById('videoPlayer');
        if (video && video.currentTime > 0) {
          updateVideoProgress(currentVideoId, video.currentTime, video.duration);
        }
      }
    }

    // Exit video player
    function exitVideoPlayer() {
      // Save progress before exiting
      if (currentVideoId) {
        const video = document.getElementById('videoPlayer');
        if (video && video.currentTime > 0) {
          updateVideoProgress(currentVideoId, video.currentTime, video.duration);
        }
      }

      stopVideoAutoSave();

      // Cleanup event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', saveProgressBeforeUnload);

      // Pause and reset HTML5 video
      const video = document.getElementById('videoPlayer');
      if (video) {
        video.pause();
        video.src = '';
      }
      
      // Clear YouTube embed
      const youtubeWrapper = document.getElementById('youtubePlayerWrapper');
      if (youtubeWrapper) {
        youtubeWrapper.innerHTML = '';
      }
      
      // Restore CTA button visibility
      const ctaButton = document.getElementById('videoCTAButton');
      if (ctaButton) {
        ctaButton.style.display = 'block';
      }

      currentVideoId = null;
      showScreen('videoLessonsScreen');
    }

    // ==================== END VIDEO LESSONS SECTION ====================
