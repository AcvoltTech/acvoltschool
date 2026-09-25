/* aula-enlace.js — abre la lección de un enlace directo (?leccion=ID) al cargar o recargar
 * el campus (orden de Codex/Mario 25-sep-2026: "enlace directo que sobreviva a recarga").
 * Espera a que la app termine de arrancar y haya sesión; entonces abre la pantalla de cursos
 * (eso carga js/acvolt-certification.js + js/acvolt-quiz-leccion.js, que abre la lección). */
(function () {
  'use strict';
  if (!/[?&]leccion=\d+/.test(location.search)) return;
  var n = 0, t = setInterval(function () {
    var listo = typeof window.showScreen === 'function' && (localStorage.getItem('tecnico_authenticated') === 'true' || window.currentUser);
    if (listo) { clearInterval(t); try { showScreen('acvoltCertScreen'); } catch (_) {} }
    else if (++n > 60) clearInterval(t);   // sin sesión: el login normal toma el control
  }, 500);
})();
