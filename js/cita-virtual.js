// ==================== CITA VIRTUAL · sala de 100ms para el tour de Maestro HVACR (13-nov-2026) ====================
// La usan dos pantallas: cita.html (el cliente, sin cuenta) y el Tablero de ventas (la asesora, anfitriona que comparte
// pantalla). Es el mismo 100ms de las clases en vivo (js/vendor/hms-sdk-bundle.min.js → window.HMSReactiveStore).
// El token lo da el servidor (ventas-cita para el cliente, ventas-tablero para la asesora) con el rol ya fijo.
// Sin innerHTML: todo con textContent.
(function (root) {
  'use strict';
  function h(tag, a, hijos) {
    var el = document.createElement(tag); a = a || {};
    Object.keys(a).forEach(function (k) { var v = a[k]; if (v == null || v === false) return;
      if (k === 'text') el.textContent = v; else if (k === 'class') el.className = v; else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'style') el.style.cssText = v; else el.setAttribute(k, v === true ? '' : v); });
    (hijos || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }

  /** Entra a la sala. o = { contenedor, token, nombre, anfitriona, alSalir } */
  async function entrar(o) {
    var Store = root.HMSReactiveStore;
    if (!Store) throw new Error('No cargó el programa de video. Revise su internet y recargue la página.');
    var hms = new Store();
    try { hms.triggerOnSubscribe(); } catch (_) {}
    var acc = hms.getActions ? hms.getActions() : hms.getHMSActions();
    var store = hms.getStore();
    var cont = o.contenedor;
    while (cont.firstChild) cont.removeChild(cont.firstChild);
    var estado = h('p', { class: 'cv-estado', role: 'status', text: 'Conectando…' });
    var rejilla = h('div', { class: 'cv-rejilla' });
    var micOn = true, camOn = true, pantalla = false;
    var bMic = h('button', { class: 'cv-btn', text: '🎙️ Micrófono: sí', onclick: async function () { micOn = !micOn; await acc.setLocalAudioEnabled(micOn); bMic.textContent = micOn ? '🎙️ Micrófono: sí' : '🔇 Micrófono: no'; } });
    var bCam = h('button', { class: 'cv-btn', text: '📷 Cámara: sí', onclick: async function () { camOn = !camOn; await acc.setLocalVideoEnabled(camOn); bCam.textContent = camOn ? '📷 Cámara: sí' : '🚫 Cámara: no'; } });
    var bPan = o.anfitriona ? h('button', { class: 'cv-btn pri', text: '🖥️ Compartir pantalla', onclick: async function () {
      try { pantalla = !pantalla; await acc.setScreenShareEnabled(pantalla); bPan.textContent = pantalla ? '⏹ Dejar de compartir' : '🖥️ Compartir pantalla'; }
      catch (e) { pantalla = false; estado.textContent = 'No se pudo compartir la pantalla: ' + ((e && e.message) || ''); }
    } }) : null;
    var bSal = h('button', { class: 'cv-btn sal', text: 'Salir', onclick: async function () { try { await acc.leave(); } catch (_) {} if (o.alSalir) o.alSalir(); } });
    cont.appendChild(estado);
    cont.appendChild(rejilla);
    cont.appendChild(h('div', { class: 'cv-controles' }, [bMic, bCam, bPan, bSal]));

    var pegados = {};   // trackId → <video>
    function pintar(s) {
      var conectado = s && s.room && s.room.isConnected;
      var peers = s && s.peers ? Object.keys(s.peers).map(function (k) { return s.peers[k]; }) : [];
      estado.textContent = conectado ? (peers.length > 1 ? 'En la reunión' : (o.anfitriona ? 'Esperando al cliente…' : 'Esperando a su asesora…')) : 'Conectando…';
      var vivos = {};
      peers.forEach(function (p) {
        var pistas = [p.videoTrack].concat(p.auxiliaryTracks || []).filter(Boolean);
        pistas.forEach(function (id) {
          var t = s.tracks && s.tracks[id];
          if (!t || t.type !== 'video') return;
          vivos[id] = true;
          if (!pegados[id]) {
            var v = h('video', { autoplay: true, playsinline: true, muted: true });
            var caja = h('figure', { class: 'cv-caja' + (t.source === 'screen' ? ' pantalla' : '') }, [v, h('figcaption', { text: (p.name || '') + (t.source === 'screen' ? ' · pantalla' : '') + (p.isLocal ? ' (usted)' : '') })]);
            rejilla.appendChild(caja);
            pegados[id] = { video: v, caja: caja };
            try { acc.attachVideo(id, v); } catch (_) {}
          }
        });
      });
      Object.keys(pegados).forEach(function (id) { if (!vivos[id]) { try { acc.detachVideo(id, pegados[id].video); } catch (_) {} pegados[id].caja.remove(); delete pegados[id]; } });
    }
    store.subscribe(pintar, function (s) { return s; });
    await acc.join({ userName: o.nombre || 'Invitado', authToken: o.token, settings: { isAudioMuted: false, isVideoMuted: false }, rememberDeviceSelection: true });
    return { salir: function () { return acc.leave(); }, acciones: acc };
  }

  var CSS = '.cv-rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin:10px 0}' +
    '.cv-caja{margin:0;background:#0b1622;border-radius:10px;overflow:hidden;position:relative;aspect-ratio:16/9}.cv-caja.pantalla{grid-column:1/-1}' +
    '.cv-caja video{width:100%;height:100%;object-fit:contain;background:#0b1622}.cv-caja figcaption{position:absolute;left:8px;bottom:6px;color:#fff;font-size:13px;background:rgba(0,0,0,.5);padding:2px 8px;border-radius:6px}' +
    '.cv-controles{display:flex;gap:8px;flex-wrap:wrap}.cv-btn{border:0;border-radius:8px;padding:9px 14px;font:700 15px system-ui,sans-serif;background:#e8edf3;color:#0f2a47;cursor:pointer}' +
    '.cv-btn.pri{background:#d9411e;color:#fff}.cv-btn.sal{background:#8a1c1c;color:#fff}.cv-estado{font-weight:700}';
  function estilos() { if (document.getElementById('cvEstilos')) return; var s = document.createElement('style'); s.id = 'cvEstilos'; s.textContent = CSS; document.head.appendChild(s); }

  root.CitaVirtual = { entrar: function (o) { estilos(); return entrar(o); }, _h: h };
})(typeof window !== 'undefined' ? window : globalThis);
