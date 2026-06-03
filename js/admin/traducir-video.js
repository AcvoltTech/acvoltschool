// traducir-video.js — Traduce un video de español a INGLÉS con la voz de Mario.
// Flujo (todo en el navegador del admin, compatible con Safari):
//   1) Eliges el video → extrae el AUDIO (Web Audio, rápido, mono 16k).
//   2) Manda el audio al motor translate-audio-en (Deepgram → Claude → voz inglesa de Mario).
//   3) Previsualiza (video + tu voz inglesa + subtítulos) y descarga audio/subtítulos.
// El audio inglés se genera UNA vez y se guarda → reuso gratis. Mario 2026-06-03.
(function () {
  'use strict';
  var SB_URL = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  function SB_KEY() { if (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) return SUPABASE_KEY; try { if (window.supabaseClient && window.supabaseClient.supabaseKey) return window.supabaseClient.supabaseKey; } catch (_) {} return ''; }
  function adminEmail() { try { if (typeof getAdminEmail === 'function') { var e = getAdminEmail(); if (e) return e; } } catch (_) {} try { return sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; } catch (_) { return ''; } }
  function esc(s) { var d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }
  function setStatus(msg, color) { var el = document.getElementById('tvStatus'); if (el) { el.innerHTML = msg; el.style.color = color || '#475569'; } }

  var _file = null, _result = null, _videoUrl = null;

  window.tvOnFile = function (input) {
    var f = input.files && input.files[0]; if (!f) return;
    _file = f; _result = null;
    if (_videoUrl) { try { URL.revokeObjectURL(_videoUrl); } catch (_) {} }
    _videoUrl = URL.createObjectURL(f);
    var vid = document.getElementById('tvVideo'); if (vid) { vid.src = _videoUrl; vid.muted = true; vid.style.display = 'block'; }
    var mb = (f.size / 1048576).toFixed(0);
    setStatus('Video listo (' + mb + ' MB). Dale "Traducir a inglés".', '#16a34a');
    var btn = document.getElementById('tvGoBtn'); if (btn) btn.disabled = false;
    var dl = document.getElementById('tvDownloads'); if (dl) dl.style.display = 'none';
    if (parseInt(mb, 10) > 350) setStatus('⚠️ El video pesa ' + mb + ' MB. Para que sea rápido, usa uno ≤350 MB (comprimido). Puedo intentar, pero puede tardar.', '#b45309');
  };

  // ── Extraer audio mono 16k (Web Audio; rápido, no en tiempo real) ──
  async function extractWav(file) {
    var arr = await file.arrayBuffer();
    var AC = window.AudioContext || window.webkitAudioContext;
    var ac = new AC();
    var decoded = await ac.decodeAudioData(arr);
    try { ac.close(); } catch (_) {}
    var len = Math.max(1, Math.ceil(16000 * decoded.duration));
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var off = new OAC(1, len, 16000);
    var src = off.createBufferSource(); src.buffer = decoded; src.connect(off.destination); src.start(0);
    var rendered = await off.startRendering();
    return encodeWav(rendered.getChannelData(0), 16000);
  }
  function encodeWav(samples, sr) {
    var buf = new ArrayBuffer(44 + samples.length * 2); var v = new DataView(buf);
    function ws(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    ws(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, samples.length * 2, true);
    var o = 44; for (var i = 0; i < samples.length; i++) { var s = Math.max(-1, Math.min(1, samples[i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true); o += 2; }
    return new Blob([buf], { type: 'audio/wav' });
  }
  async function blobToB64(blob) {
    var buf = new Uint8Array(await blob.arrayBuffer());
    var bin = '', CH = 0x8000;
    for (var i = 0; i < buf.length; i += CH) bin += String.fromCharCode.apply(null, buf.subarray(i, i + CH));
    return btoa(bin);
  }

  window.tvTranslate = async function () {
    if (!_file) { setStatus('Primero elige un video.', '#dc2626'); return; }
    var btn = document.getElementById('tvGoBtn'); if (btn) btn.disabled = true;
    try {
      setStatus('① Sacando el audio del video…', '#475569');
      var wav = await extractWav(_file);
      setStatus('② Mandando al motor (transcribe → traduce → tu voz en inglés)…', '#475569');
      var b64 = await blobToB64(wav);
      var job_id = 'tv_' + Date.now();
      var r = await fetch(SB_URL + '/functions/v1/translate-audio-en', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY(), Authorization: 'Bearer ' + SB_KEY() }, body: JSON.stringify({ audio_b64: b64, audio_mime: 'audio/wav', job_id: job_id, admin_email: adminEmail() }) });
      var jr = await r.json();
      if (!jr || jr.status !== 'processing') throw new Error((jr && jr.error) || 'No arrancó el motor.');
      // polling
      setStatus('③ Generando tu voz en inglés… (esto tarda ~1-2 min, no cierres)', '#475569');
      var job = await pollJob(job_id, 80);
      if (!job || job.status !== 'ready') throw new Error((job && job.error) || 'Se agotó el tiempo.');
      _result = job;
      setStatus('✅ ¡Listo! Tu voz en inglés y los subtítulos están generados. (' + (job.chars || '?') + ' caracteres)', '#16a34a');
      showResult(job);
    } catch (e) {
      setStatus('❌ ' + esc(e.message || e), '#dc2626');
    } finally { if (btn) btn.disabled = false; }
  };

  function pollJob(job_id, maxTries) {
    return new Promise(function (resolve) {
      var n = 0;
      function tick() {
        n++;
        fetch(SB_URL + '/rest/v1/app_config?select=value&key=eq.tae_jobs', { headers: { apikey: SB_KEY(), Authorization: 'Bearer ' + SB_KEY() } })
          .then(function (r) { return r.json(); })
          .then(function (rows) {
            var jobs = {}; try { jobs = JSON.parse(rows[0].value); } catch (_) {}
            var j = jobs[job_id];
            if (j && (j.status === 'ready' || j.status === 'error')) return resolve(j);
            if (n >= maxTries) return resolve(j || null);
            setTimeout(tick, 4000);
          })
          .catch(function () { if (n >= maxTries) resolve(null); else setTimeout(tick, 4000); });
      }
      setTimeout(tick, 4000);
    });
  }

  function showResult(job) {
    var dl = document.getElementById('tvDownloads'); if (!dl) return;
    dl.style.display = 'block';
    var vid = document.getElementById('tvVideo');
    // cargar subtítulos como track
    try {
      if (vid) { var old = vid.querySelector('track'); if (old) old.remove(); var t = document.createElement('track'); t.kind = 'subtitles'; t.label = 'English'; t.srclang = 'en'; t.src = job.subtitle_url_en; t.default = true; vid.appendChild(t); }
    } catch (_) {}
    var aud = document.getElementById('tvEnAudio'); if (aud) aud.src = job.audio_url_en;
    var prev = document.getElementById('tvEnText'); if (prev) prev.textContent = job.text_en || '';
    var a1 = document.getElementById('tvDlAudio'); if (a1) a1.href = job.audio_url_en;
    var a2 = document.getElementById('tvDlSubs'); if (a2) a2.href = job.subtitle_url_en;
  }

  // Previsualizar: video silenciado + tu voz inglesa sincronizada + subtítulos.
  window.tvPlayEnglish = function () {
    var vid = document.getElementById('tvVideo'); var aud = document.getElementById('tvEnAudio');
    if (!vid || !aud || !_result) return;
    try { var tr = vid.textTracks && vid.textTracks[0]; if (tr) tr.mode = 'showing'; } catch (_) {}
    vid.muted = true; vid.currentTime = 0; aud.currentTime = 0;
    aud.play(); vid.play();
    aud.onended = function () { try { vid.pause(); } catch (_) {} };
  };
  window.tvStopEnglish = function () { var vid = document.getElementById('tvVideo'); var aud = document.getElementById('tvEnAudio'); try { vid.pause(); aud.pause(); } catch (_) {} };

  window.loadTraducirVideo = function () { setStatus('Elige un video en español y dale "Traducir a inglés".', '#475569'); };
})();
