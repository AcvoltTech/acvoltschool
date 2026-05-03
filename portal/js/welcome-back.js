(function(){
  var INACTIVITY_HOURS = 4;
  var CHECK_INTERVAL_MS = 60000;
  var STORAGE_KEY = 'maestro_last_activity';
  var NOTIF_KEY = 'maestro_notif_sent';
  var SUPABASE_ACTIVITY_URL = 'https://htklsowiyjwsjnacnvnr.supabase.co/rest/v1/rpc/update_user_activity';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2xzb3dpeWp3c2puYWNudm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjIwMjQsImV4cCI6MjA4NjAzODAyNH0.6A3F7MI4YJEMo98b4Zfzao9p_hMh2T0ha0dRJ4SUhv0';
  var lastSyncTime = 0;
  var SYNC_INTERVAL = 300000;

  function syncActivityToSupabase(){
    var now = Date.now();
    if(now - lastSyncTime < SYNC_INTERVAL) return;
    lastSyncTime = now;
    try {
      var u = JSON.parse(localStorage.getItem('tecnico_user')||'{}');
      if(!u.email) return;
      fetch(SUPABASE_ACTIVITY_URL, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'apikey':SUPABASE_ANON_KEY, 'Authorization':'Bearer '+SUPABASE_ANON_KEY },
        body: JSON.stringify({
          p_nombre: u.nombre || 'técnico',
          p_email: u.email,
          p_telefono: u.telefono || null,
          p_lang: 'es',
          p_app: 'v1',
          p_quiz_score: null,
          p_quizzes: null,
          p_premium: !!JSON.parse(localStorage.getItem('ai_premium_data')||'{}').active
        })
      }).catch(function(){});
    } catch(e) { console.warn('[WelcomeBack]', e.message || e); }
  }

  function updateActivity(){
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    localStorage.removeItem(NOTIF_KEY);
    syncActivityToSupabase();
  }

  function getLastActivity(){
    var t = localStorage.getItem(STORAGE_KEY);
    return t ? parseInt(t) : Date.now();
  }

  function getInactiveHours(){
    return (Date.now() - getLastActivity()) / (1000 * 60 * 60);
  }

  ['click','keydown','scroll','touchstart'].forEach(function(ev){
    document.addEventListener(ev, updateActivity, {passive:true});
  });
  updateActivity();

  function requestNotifPermission(){
    // Apple Guideline 5.1.1: no automatic permission requests.
    // Notifications are now requested via an explicit user tap elsewhere
    // (push-notifications.js handles the opt-in flow with a user gesture).
    return;
  }

  function sendBrowserNotification(title, body){
    if('Notification' in window && Notification.permission === 'granted'){
      try {
        var n = new Notification(title, { body: body, tag: 'maestro-reminder', renotify: true });
        n.onclick = function(){ window.focus(); n.close(); };
      } catch(e) { console.warn('[WelcomeBack]', e.message || e); }
    }
  }

  function checkInactivity(){
    var hours = getInactiveHours();
    var alreadySent = localStorage.getItem(NOTIF_KEY);
    if(hours >= INACTIVITY_HOURS && !alreadySent){
      localStorage.setItem(NOTIF_KEY, 'true');
      var nombre = (typeof _t === 'function' ? _t('technician') : 'técnico');
      try { var u = JSON.parse(localStorage.getItem('tecnico_user')||'{}'); nombre = u.nombre ? u.nombre.split(' ')[0] : nombre; } catch(e) { console.warn('[WelcomeBack]', e.message || e); }
      if(document.hidden){
        var _ntTitle = (typeof _t === 'function' ? _t('wb_notification_title') : '¡Hey {name}! 📚').replace('{name}', nombre);
        var _ntBody = (typeof _t === 'function' ? _t('wb_notification_body') : 'Llevas {hours} horas sin estudiar. ¡Maestro HVACR te espera!').replace('{hours}', Math.floor(hours));
        sendBrowserNotification(_ntTitle, _ntBody);
      }
    }
  }
  setInterval(checkInactivity, CHECK_INTERVAL_MS);

  function showWelcomeBack(){
    var hours = getInactiveHours();
    if(hours < INACTIVITY_HOURS) return;
    // Don't overlay the onboarding gate — it blocks Ciudad/Estado inputs
    if(document.getElementById('onboardingGateModal')) return;

    var _tw = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var nombre = _tw('technician', 'técnico');
    try { var u = JSON.parse(localStorage.getItem('tecnico_user')||'{}'); nombre = u.nombre ? u.nombre.split(' ')[0] : nombre; } catch(e) { console.warn('[WelcomeBack]', e.message || e); }

    var hoursAway = Math.floor(hours);
    var daysAway = Math.floor(hours / 24);
    var dayWord = daysAway > 1 ? _tw('wb_days', 'días') : _tw('wb_day', 'día');
    var hourWord = hoursAway > 1 ? _tw('wb_hours', 'horas') : _tw('wb_hour', 'hora');
    var timeText = daysAway >= 1 ? daysAway + ' ' + dayWord : hoursAway + ' ' + hourWord;

    var msgs = [
      _tw('wb_msg_1').replace('{name}', nombre).replace('{time}', timeText),
      _tw('wb_msg_2').replace('{name}', nombre).replace('{time}', timeText),
      _tw('wb_msg_3').replace('{name}', nombre).replace('{time}', timeText),
      _tw('wb_msg_4').replace('{name}', nombre).replace('{time}', timeText)
    ];

    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    var titleEl = document.getElementById('wbTitle');
    var msgEl = document.getElementById('wbMessage');
    var overlay = document.getElementById('welcomeBackOverlay');
    if(!overlay) return;
    if(titleEl) titleEl.textContent = _tw('wb_title_full').replace('{name}', nombre);
    if(msgEl) msgEl.textContent = msg;
    overlay.style.display = 'flex';

    // Inject keyframes once for subtle spring entry (iOS-style)
    if(!document.getElementById('wbMotionStyles')){
      var wbStyle = document.createElement('style');
      wbStyle.id = 'wbMotionStyles';
      wbStyle.textContent = '@keyframes wbCardIn{0%{opacity:0;transform:scale(0.9);}100%{opacity:1;transform:scale(1);}}@keyframes wbBackdropIn{0%{opacity:0;}100%{opacity:1;}}';
      document.head.appendChild(wbStyle);
    }
    overlay.style.animation = 'wbBackdropIn 200ms cubic-bezier(0.32,0.72,0,1)';
    var card = document.getElementById('welcomeBackCard');
    if(card) card.style.animation = 'wbCardIn 320ms cubic-bezier(0.34,1.56,0.64,1)';
  }

  window.closeWelcomeBack = function(){
    var overlay = document.getElementById('welcomeBackOverlay');
    if(overlay) overlay.style.display = 'none';
    updateActivity();
  };

  requestNotifPermission();
  setTimeout(showWelcomeBack, 3000);
})();
