/* ============================================================================
 * proteccion-contenido.js — protección de clases y exámenes (Mario 24-sep-2026:
 * "el screen recording queda bloqueado, eso lo teníamos implementado").
 * ----------------------------------------------------------------------------
 * La versión vieja (initAntiScreenshot en profile.js) estaba APAGADA: bloqueaba el clic
 * derecho y difuminaba tarjetas a TODOS, incluido el panel de admin desde el que Mario
 * transmite. Esta la reemplaza con alcance correcto:
 *   · Solo alumnos: el personal (admin_staff) no recibe ninguna restricción.
 *   · Marca de agua con el correo del alumno encima de cada video del curso: si alguien
 *     graba la pantalla, la grabación lleva su nombre. Se mueve cada 25 s.
 *   · Atajos de captura (PrtScn, Cmd/Ctrl+Shift+3/4/5/S): pantalla negra + aviso.
 *   · Imprimir: la página sale en blanco.
 *   · Clic derecho bloqueado sobre videos, exámenes y lecciones — NO en cajas de texto.
 *   · En examen, si la ventana pierde el foco, las preguntas se difuminan.
 * 🔴 Ningún navegador permite IMPEDIR al 100% una grabación de pantalla: esto disuade,
 *    detecta y deja rastro. Los términos lo prohíben y es causa de suspensión.
 * ========================================================================== */
(function () {
  'use strict';
  if (window.__proteccionContenido) return; window.__proteccionContenido = true;

  var esStaff = function () {
    try { return (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) || (typeof isAdminStudent === 'function' && isAdminStudent()); }
    catch (_) { return false; }
  };
  var correo = function () {
    try { return (localStorage.getItem('tecnico_email') || '').trim(); } catch (_) { return ''; }
  };
  var ZONAS = 'iframe[src*="videodelivery.net"], iframe[src*="cloudflarestream.com"], iframe[data-vf-uid], video, .question-text, .option, .exam-container, .lesson-content';

  // ── Estilos ──
  var st = document.createElement('style');
  st.textContent =
    '@media print{body.pc-alumno *{visibility:hidden!important}body.pc-alumno:after{content:"Contenido protegido · Acvolt Tech School";visibility:visible;position:fixed;top:40%;left:0;right:0;text-align:center;font:700 22px sans-serif}}' +
    '.pc-marca{position:absolute;z-index:5;pointer-events:none;color:rgba(255,255,255,.42);text-shadow:0 0 3px rgba(0,0,0,.6);font:600 13px/1.2 -apple-system,Segoe UI,sans-serif;transition:top 1.2s,left 1.2s;white-space:nowrap;user-select:none}' +
    'body.pc-alumno.pc-fuera .question-text,body.pc-alumno.pc-fuera .option{filter:blur(6px)}' +
    '#pcNegro{position:fixed;inset:0;background:#000;z-index:2147483646}' +
    '#pcAviso{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#b91c1c;color:#fff;padding:22px 28px;border-radius:14px;text-align:center;font:600 15px/1.4 -apple-system,Segoe UI,sans-serif;max-width:88vw;box-shadow:0 10px 40px rgba(0,0,0,.5)}';
  document.head.appendChild(st);

  function aviso() {
    if (document.getElementById('pcAviso')) return;
    var n = document.createElement('div'); n.id = 'pcNegro'; document.body.appendChild(n);
    var a = document.createElement('div'); a.id = 'pcAviso';
    a.innerHTML = '🚫 <b>Grabar o capturar la pantalla no está permitido.</b><br>El contenido está protegido y lleva tu correo como marca de agua.';
    document.body.appendChild(a);
    setTimeout(function () { n.remove(); }, 1200);
    setTimeout(function () { a.remove(); }, 3500);
  }

  // ── Marca de agua sobre cada video ──
  var marcas = [];
  function marcar(el) {
    if (el.__pcMarca || !el.parentElement) return;
    var cont = el.parentElement;
    if (getComputedStyle(cont).position === 'static') cont.style.position = 'relative';
    var m = document.createElement('div'); m.className = 'pc-marca'; m.textContent = correo() || 'Acvolt Tech School';
    cont.appendChild(m); el.__pcMarca = m; marcas.push(m); mover(m);
  }
  function mover(m) { m.style.top = (8 + Math.random() * 70) + '%'; m.style.left = (4 + Math.random() * 55) + '%'; }
  function barrer() {
    if (!document.body.classList.contains('pc-alumno')) return;
    document.querySelectorAll('iframe[src*="videodelivery.net"], iframe[src*="cloudflarestream.com"], iframe[data-vf-uid]').forEach(marcar);
    marcas = marcas.filter(function (m) { return m.isConnected; });
  }
  setInterval(function () { marcas.forEach(mover); }, 25000);

  function activar() {
    if (esStaff()) { document.body.classList.remove('pc-alumno'); marcas.forEach(function (m) { m.remove(); }); marcas = []; document.querySelectorAll('iframe, video').forEach(function (el) { el.__pcMarca = null; }); return; }
    document.body.classList.add('pc-alumno');
    barrer();
  }

  // ── Eventos (todos revisan que sea alumno en el momento) ──
  document.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('pc-alumno')) return;
    var k = (e.key || '').toLowerCase();
    if (k === 'printscreen' || e.keyCode === 44 || ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 's'].indexOf(k) > -1)) { e.preventDefault(); aviso(); }
  }, true);
  document.addEventListener('keyup', function (e) {
    if (document.body.classList.contains('pc-alumno') && (e.key === 'PrintScreen' || e.keyCode === 44)) aviso();
  }, true);
  document.addEventListener('contextmenu', function (e) {
    if (!document.body.classList.contains('pc-alumno')) return;
    var t = e.target;
    if (t.closest && t.closest('input, textarea, [contenteditable="true"]')) return;   // escribir y pegar siguen funcionando
    if (t.closest && t.closest(ZONAS)) { e.preventDefault(); aviso(); }
  }, true);
  window.addEventListener('blur', function () { document.body.classList.add('pc-fuera'); });
  window.addEventListener('focus', function () { document.body.classList.remove('pc-fuera'); });

  // El login y los videos llegan después de cargar: se revisa al cambiar la página y cada tanto.
  new MutationObserver(function () { clearTimeout(activar._t); activar._t = setTimeout(activar, 300); })
    .observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', activar); else activar();
})();
