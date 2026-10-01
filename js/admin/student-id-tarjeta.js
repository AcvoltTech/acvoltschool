/* COPIA de maestroac-app/landing/student-id-tarjeta.js (1-oct-2026): el CSP del panel solo permite scripts propios. Si cambias el diseño, cambia LOS DOS. */
/* 1-oct-2026 · STUDENT ID — dibuja la credencial institucional (tamaño tarjeta CR80: 3.375 × 2.125 in a 300 dpi = 1013 × 638 px).
   Diseño tomado de la tarjeta real de Mario: frente con logo ACVOLT, foto, nombre y título en rojo; reverso con certificaciones y el
   teléfono de verificación. La usan la página del alumno (vista previa) y el panel de la escuela (impresión).
   MaestroStudentId.dibujar(datos, lado) → Promise<canvas>
     datos: { nombre, titulo, numero, foto (URL o Image), expedicion, vence, certificaciones:[{tipo,numero,verificada}], soloVerificadas, logo }
     lado: 'frente' | 'reverso'
   Credencial institucional de Maestro HVACR / ACVOLT Tech School: NO es una licencia del gobierno (lo dice la tarjeta). */
(function (global) {
  'use strict';
  var W = 1013, H = 638, ROJO = '#d0021b', NAVY = '#0f2342';
  function img(src) {
    return new Promise(function (ok) {
      if (!src) return ok(null);
      if (typeof src === 'object' && src.naturalWidth) return ok(src);
      var i = new Image(); i.crossOrigin = 'anonymous'; i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src;
    });
  }
  function base() {
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d');
    x.fillStyle = '#ffffff'; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, W, H, 36); else x.rect(0, 0, W, H); x.fill();
    return { cv: cv, x: x };
  }
  function ajustar(x, texto, max, tam, peso, familia) {
    var t = tam; x.font = peso + ' ' + t + 'px ' + familia;
    while (x.measureText(texto).width > max && t > 16) { t -= 2; x.font = peso + ' ' + t + 'px ' + familia; }
    return t;
  }
  function fecha(s) { if (!s) return '—'; var d = new Date(String(s).length <= 10 ? s + 'T12:00:00' : s); return isNaN(d) ? '—' : (d.getMonth() + 1 + '/' + d.getFullYear()); }

  async function frente(d) {
    var b = base(), x = b.x;
    var logo = await img(d.logo || '/acvolt-school-logo.jpg'), foto = await img(d.foto);
    // Foto (columna izquierda), recortada para llenar 330 × 420
    var fx = 50, fy = 120, fw = 330, fh = 420;
    x.fillStyle = '#eef2f6'; x.fillRect(fx, fy, fw, fh);
    if (foto) { var r = Math.max(fw / foto.naturalWidth, fh / foto.naturalHeight), sw = fw / r, sh = fh / r;
      x.drawImage(foto, (foto.naturalWidth - sw) / 2, (foto.naturalHeight - sh) / 2, sw, sh, fx, fy, fw, fh); }
    else { x.fillStyle = '#94a3b8'; x.font = '700 26px Arial'; x.textAlign = 'center'; x.fillText('FOTO', fx + fw / 2, fy + fh / 2); }
    // Logo arriba a la derecha
    if (logo) { var lw = 560, lh = lw * logo.naturalHeight / logo.naturalWidth; x.drawImage(logo, 420, 20, lw, lh); }
    x.textAlign = 'left'; var tx = 420, tmax = W - tx - 40;
    x.fillStyle = '#111111'; ajustar(x, d.nombre || '', tmax, 56, '800', 'Arial, Helvetica, sans-serif'); x.fillText(d.nombre || '', tx, 410, tmax);
    x.fillStyle = ROJO; ajustar(x, d.titulo || 'STUDENT', tmax, 40, '800', 'Arial, Helvetica, sans-serif'); x.fillText(d.titulo || 'STUDENT', tx, 462, tmax);
    x.fillStyle = NAVY; x.font = '700 24px Arial, Helvetica, sans-serif';
    x.fillText('Tech # ' + (d.numero || '—'), tx, 510);
    x.font = '400 22px Arial, Helvetica, sans-serif';
    x.fillText('Expide ' + fecha(d.expedicion) + '   ·   Vence ' + fecha(d.vence), tx, 545);
    x.fillStyle = '#64748b'; x.font = '400 17px Arial, Helvetica, sans-serif';
    x.fillText('STUDENT ID · Credencial institucional · No es licencia del gobierno', tx, 590, tmax);
    return b.cv;
  }

  async function reverso(d) {
    var b = base(), x = b.x;
    var certs = (d.certificaciones || []).filter(function (c) { return !d.soloVerificadas || c.verificada; });
    x.textAlign = 'left'; x.fillStyle = ROJO;
    var y = 120;
    if (!certs.length) { x.fillStyle = '#64748b'; x.font = '700 28px Arial'; x.fillText('Maestro HVACR · ACVOLT Tech School', 60, y); y += 60; }
    certs.slice(0, 6).forEach(function (c) {
      var t = String(c.tipo || '') + ': ' + String(c.numero || '') + (d.soloVerificadas || c.verificada ? '' : '  (por verificar)');
      x.fillStyle = c.verificada || d.soloVerificadas ? ROJO : '#94a3b8';
      ajustar(x, t, W - 120, 38, '800', 'Arial, Helvetica, sans-serif'); x.fillText(t, 60, y, W - 120); y += 64;
    });
    x.fillStyle = ROJO; ajustar(x, 'ACVOLT VERIFICATION#: (909) 824-4849', W - 120, 40, '800', 'Arial, Helvetica, sans-serif');
    x.fillText('ACVOLT VERIFICATION#: (909) 824-4849', 60, 540, W - 120);
    x.fillStyle = '#64748b'; x.font = '400 17px Arial, Helvetica, sans-serif';
    x.fillText('Credencial institucional de Maestro HVACR / ACVOLT Tech School. No es una licencia del gobierno.', 60, 590, W - 120);
    return b.cv;
  }

  global.MaestroStudentId = { ANCHO: W, ALTO: H, dibujar: function (d, lado) { return lado === 'reverso' ? reverso(d || {}) : frente(d || {}); } };
})(window);
