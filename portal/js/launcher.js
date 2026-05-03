function closeLauncher(){
  var lo=document.getElementById('launcherOverlay');
  lo.style.transition='opacity 0.5s ease';lo.style.opacity='0';
  setTimeout(function(){lo.style.display='none';},500);
  sessionStorage.setItem('launcher_seen','1');
  stopLauncherMusic();
}
function showLauncher(){
  var lo=document.getElementById('launcherOverlay');
  lo.style.display='flex';
  lo.style.opacity='0';
  lo.style.transition='opacity 0.4s ease';
  setTimeout(function(){lo.style.opacity='1';},10);
  sessionStorage.removeItem('launcher_seen');
  try{playLauncherJingle();}catch(e) { console.warn('[Launcher]', e.message || e); }
}

// === LOOPING MOTIVATIONAL LAUNCHER THEME ===
window._launcherLoop=false;
function playLauncherJingle(){
  try{
    // Only create AudioContext after user interaction to avoid browser warning
    if(navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    if(window._launcherAudioCtx)try{window._launcherAudioCtx.close();}catch(e) { console.warn('[Launcher]', e.message || e); }
    var ctx=new(window.AudioContext||window.webkitAudioContext)();
    window._launcherAudioCtx=ctx;
    window._launcherLoop=true;
    var master=ctx.createGain();
    master.gain.value=0.15;
    master.connect(ctx.destination);
    var loopN=0;

    function n(freq,start,dur,type,vol){
      if(!window._launcherLoop)return;
      var o=ctx.createOscillator(),g=ctx.createGain();
      o.type=type||'triangle';o.frequency.value=freq;
      var t=ctx.currentTime+start;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(vol||0.2,t+0.04);
      g.gain.setValueAtTime((vol||0.2)*0.7,t+dur*0.6);
      g.gain.linearRampToValueAtTime(0,t+dur);
      o.connect(g);g.connect(master);
      o.start(t);o.stop(t+dur+0.02);
    }
    function p(freq,start,dur,vol){
      if(!window._launcherLoop)return;
      var o=ctx.createOscillator(),g=ctx.createGain();
      o.type='sine';o.frequency.value=freq;
      var t=ctx.currentTime+start;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(vol||0.055,t+0.6);
      g.gain.setValueAtTime((vol||0.055)*0.85,t+dur-0.8);
      g.gain.linearRampToValueAtTime(0,t+dur);
      o.connect(g);g.connect(master);
      o.start(t);o.stop(t+dur+0.1);
    }

    function loop(){
      if(!window._launcherLoop)return;
      var b=0.44,L=b*16,v=loopN%4;loopN++;
      // PADS - chord progression Eb Ab Bb Cm
      if(v===0){p(155.56,0,L/2);p(196,0,L/2);p(233.08,0,L/2);p(207.65,L/2,L/2);p(261.63,L/2,L/2);p(311.13,L/2,L/2);}
      else if(v===1){p(116.54,0,L/2);p(146.83,0,L/2);p(174.61,0,L/2);p(130.81,L/2,L/2);p(155.56,L/2,L/2);p(196,L/2,L/2);}
      else if(v===2){p(174.61,0,L/2);p(207.65,0,L/2);p(261.63,0,L/2);p(155.56,L/2,L/2);p(196,L/2,L/2);p(233.08,L/2,L/2);}
      else{p(130.81,0,L/2);p(164.81,0,L/2);p(196,0,L/2);p(155.56,L/2,L/2);p(196,L/2,L/2);p(233.08,L/2,L/2);}
      // BASS
      if(v===0){n(77.78,0,b*2,'triangle',0.25);n(77.78,b*4,b*1.5,'triangle',0.2);n(103.83,b*8,b*2,'triangle',0.25);n(103.83,b*12,b*1.5,'triangle',0.2);}
      else if(v===1){n(58.27,0,b*2,'triangle',0.25);n(58.27,b*4,b*1.5,'triangle',0.2);n(65.41,b*8,b*2,'triangle',0.25);n(65.41,b*12,b*1.5,'triangle',0.2);}
      else if(v===2){n(87.31,0,b*2,'triangle',0.25);n(87.31,b*4,b*1.5,'triangle',0.2);n(77.78,b*8,b*2,'triangle',0.25);n(77.78,b*12,b*1.5,'triangle',0.2);}
      else{n(65.41,0,b*2,'triangle',0.25);n(65.41,b*4,b*1.5,'triangle',0.2);n(77.78,b*8,b*2,'triangle',0.25);n(77.78,b*12,b*1.5,'triangle',0.2);}
      // MELODY - 4 variations
      if(v===0){
        n(311.13,b*0,b*1.3,'triangle',0.22);n(349.23,b*1.5,b*1.3,'triangle',0.22);
        n(392,b*3,b*2,'triangle',0.26);n(466.16,b*5.5,b*1,'triangle',0.22);
        n(523.25,b*7,b*2.5,'triangle',0.28);n(466.16,b*10,b*1,'triangle',0.2);
        n(392,b*11.5,b*1,'triangle',0.2);n(349.23,b*13,b*2.5,'triangle',0.22);
      }else if(v===1){
        n(466.16,b*0,b*1,'triangle',0.24);n(392,b*1.5,b*1,'triangle',0.22);
        n(466.16,b*3,b*1,'triangle',0.24);n(523.25,b*4.5,b*2.5,'triangle',0.28);
        n(587.33,b*7.5,b*2,'triangle',0.26);n(523.25,b*10,b*1.2,'triangle',0.24);
        n(466.16,b*11.5,b*1.2,'triangle',0.22);n(392,b*13,b*2.5,'triangle',0.24);
      }else if(v===2){
        n(523.25,b*0,b*2,'triangle',0.26);n(466.16,b*2.5,b*1,'triangle',0.22);
        n(392,b*4,b*1.5,'triangle',0.24);n(349.23,b*6,b*1,'triangle',0.2);
        n(311.13,b*7.5,b*2.5,'triangle',0.24);n(392,b*10.5,b*1,'triangle',0.22);
        n(466.16,b*12,b*1,'triangle',0.24);n(523.25,b*13.5,b*2,'triangle',0.26);
      }else{
        n(392,b*0,b*1.5,'triangle',0.24);n(311.13,b*2,b*1,'triangle',0.2);
        n(349.23,b*3.5,b*1.5,'triangle',0.22);n(392,b*5.5,b*1,'triangle',0.22);
        n(466.16,b*7,b*3,'triangle',0.28);n(523.25,b*10.5,b*1.2,'triangle',0.26);
        n(466.16,b*12,b*1,'triangle',0.22);n(392,b*13.5,b*2,'triangle',0.24);
      }
      // HARMONY accent every other loop
      if(loopN%2===0){n(392,b*7,b*2,'sine',0.05);n(311.13,b*13,b*2,'sine',0.05);}
      // Schedule next
      window._launcherTimer=setTimeout(function(){if(window._launcherLoop)loop();},L*1000-50);
    }
    loop();
  }catch(e){console.log('Music:',e);}
}
function stopLauncherMusic(){
  window._launcherLoop=false;
  clearTimeout(window._launcherTimer);
  if(window._launcherAudioCtx){try{window._launcherAudioCtx.close();window._launcherAudioCtx=null;}catch(e) { console.warn('[Launcher]', e.message || e); }}
}

try{
  var u=JSON.parse(localStorage.getItem('tecnico_user')||'{}');
  if(u&&u.nombre){
    var g=document.getElementById('loGreeting');
    g.textContent=(typeof _t==='function'?_t('launcher_welcome'):'Bienvenido')+', '+u.nombre.split(' ')[0];
    g.style.display='block';
  }
}catch(e) { console.warn('[Launcher]', e.message || e); }
if(sessionStorage.getItem('launcher_seen')==='1' || localStorage.getItem('maestroac_goto_screen') || localStorage.getItem('tecnico_authenticated')==='true'){
  document.getElementById('launcherOverlay').style.display='none';
}else{
  document.getElementById('launcherOverlay').addEventListener('click',function _lf(){
    closeLauncher();
  },{once:true,capture:true});
  // Auto-close after 3 seconds if user doesn't click
  setTimeout(function(){
    var lo=document.getElementById('launcherOverlay');
    if(lo && lo.style.display!=='none'){
      closeLauncher();
    }
  },3000);
}
