// ==================== TABLERO DE VENTAS · reglas del navegador (13-nov-2026) ====================
// Ayudas para la pantalla. NINGUNA decide: el servidor (función ventas-tablero / ventas-voz) vuelve a revisar todo.
// Aquí solo se evita que la asesora pierda tiempo (botones apagados, avisos claros) y se cuida que nunca se pinte
// un teléfono completo aunque llegara por error.
(function (root) {
  'use strict';

  var CONTESTO = [['si', 'Sí contestó'], ['no', 'No contestó'], ['buzon', 'Buzón'], ['equivocado', 'Número equivocado'], ['colgo', 'Colgó luego luego']];
  var OFRECIO = [['12_meses', '12 meses'], ['8_meses', '8 meses'], ['4_meses', '4 meses'], ['en_linea', 'En línea en vivo'], ['intensivo', 'Intensivo 3 días'],
    ['calefaccion', 'Calefacción'], ['membresia', 'Membresía $149'], ['cita', 'Cita en la escuela'], ['cita_virtual', 'Cita virtual (tour)'], ['nada', 'Nada']];
  var CERRO = [['pago', 'Pagó'], ['enlace_mandado', 'Le mandé el enlace'], ['cita', 'Cita en la escuela'], ['cita_virtual', 'Cita virtual'], ['no', 'No le interesa']];
  var MOTIVOS = [['precio', 'Precio'], ['horario', 'Horario o tiempo'], ['lejos', 'Lejos de Colton'], ['ingles', 'Inglés'], ['otra_escuela', 'Ya estudia en otro lado'], ['no_era', 'No era él / ella'], ['otra', 'Otra']];
  var PROGRAMAS = ['12_meses', '8_meses', '4_meses', 'en_linea', 'intensivo', 'calefaccion'];
  var ZONAS = [['America/Los_Angeles', 'Pacífico (California)'], ['America/Phoenix', 'Arizona'], ['America/Denver', 'Montaña'], ['America/Chicago', 'Centro'],
    ['America/New_York', 'Este'], ['America/Tijuana', 'Tijuana'], ['America/Mexico_City', 'Centro de México']];

  /** Nunca se pinta un número con más de 4 dígitos a la vista. */
  function mostrarTelefono(t) {
    var s = String(t == null ? '' : t);
    if (/^\*\*\*-\*\*\*-\d{4}$/.test(s)) return s;
    var d = s.replace(/\D/g, '');
    return d.length >= 4 ? '***-***-' + d.slice(-4) : '';
  }

  /** Candado del guion en pantalla: el botón «Ya lo leí» se prende al llegar al final y cumplir los segundos. */
  function candadoEstado(o) {
    var min = o.minimoSeg == null ? 45 : o.minimoSeg;
    var seg = Math.max(0, Math.floor((o.ahoraMs - o.inicioMs) / 1000));
    var faltan = Math.max(0, min - seg);
    return { listo: !!o.llegoAlFinal && faltan === 0, faltan: faltan, llegoAlFinal: !!o.llegoAlFinal,
      texto: !o.llegoAlFinal ? 'Lee el guion hasta el final' : (faltan ? 'Espera ' + faltan + ' s' : 'Ya lo leí: abrir el lead') };
  }

  /** Lo que le falta a la encuesta (mismas reglas que el servidor, para avisar antes de mandar). */
  function encuestaFaltantes(e, tipo) {
    var f = [];
    if (!e || !e.contesto) return ['¿Contestó?'];
    if (e.contesto !== 'si') return f;
    var of = e.ofrecio || [];
    if (!of.length) f.push('¿Qué le ofreciste?');
    if (of.indexOf('nada') >= 0 && of.length > 1) f.push('«Nada» no va con otra opción');
    if (!e.cerro) f.push('¿Cerró?');
    if ((e.cerro === 'pago' || e.cerro === 'enlace_mandado')) {
      if (!(e.compro || []).length) f.push('¿Qué compró o va a comprar?');
      if ((e.compro || []).some(function (x) { return PROGRAMAS.indexOf(x) >= 0; }) && !e.grupo_id) f.push('¿A qué fecha entra?');
    }
    if ((e.cerro === 'cita' || e.cerro === 'cita_virtual') && !e.cita_fecha) f.push('Fecha y hora de la cita');
    if (e.cerro === 'cita_virtual' && !e.cita_zona) f.push('Zona horaria del cliente');
    if (e.cerro === 'no' && !e.no_llamar) {
      if (!e.no_interesa_motivo) f.push('¿Por qué no le interesa?');
      if (e.no_interesa_motivo === 'otra' && String(e.motivo_texto || '').trim().length < 3) f.push('Escribe la razón');
      if (tipo !== 'fria' && of.indexOf('membresia') < 0 && of.indexOf('cita') < 0 && of.indexOf('cita_virtual') < 0) f.push('Falta una condición de la encuesta (ver el guion: qué se ofrece antes de colgar)');
    }
    return f;
  }

  /** «2027-01-09T10:30» en la hora del CLIENTE → hora universal (ISO). */
  function horaClienteAUtc(local, zona) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local || '');
    if (!m) return null;
    try { new Intl.DateTimeFormat('en-US', { timeZone: zona }); } catch (_) { return null; }
    var objetivo = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]), t = objetivo;
    for (var i = 0; i < 3; i++) {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
      t += objetivo - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
    }
    return new Date(t).toISOString();
  }

  function etiquetaLista(l) {
    if (!l) return '';
    var t = { caliente: '🔥 Caliente', tibia: '🌤️ Tibia', fria: '🧊 Fría' }[l.tipo] || l.tipo;
    return t;
  }

  /** Divide el guion en Markdown en bloques simples (sin HTML): títulos, citas, viñetas y párrafos. */
  function bloquesMarkdown(md) {
    var out = [], lines = String(md || '').split(/\r?\n/), tabla = null;
    lines.forEach(function (ln) {
      if (/^\s*\|/.test(ln)) {
        if (/^\s*\|[\s:|-]+\|\s*$/.test(ln)) return;
        var celdas = ln.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); });
        if (!tabla) { tabla = { tipo: 'tabla', filas: [] }; out.push(tabla); }
        tabla.filas.push(celdas); return;
      }
      tabla = null;
      var m;
      if ((m = /^(#{1,4})\s+(.*)$/.exec(ln))) out.push({ tipo: 'h', nivel: m[1].length, texto: m[2] });
      else if ((m = /^>\s?(.*)$/.exec(ln))) out.push({ tipo: 'cita', texto: m[1] });
      else if ((m = /^\s*(?:[-*]|\d+\.)\s+(.*)$/.exec(ln))) out.push({ tipo: 'li', texto: m[1], sangria: /^\s{2,}/.test(ln) });
      else if (/^\s*---\s*$/.test(ln)) out.push({ tipo: 'hr' });
      else if (ln.trim()) out.push({ tipo: 'p', texto: ln.trim() });
    });
    return out;
  }

  /** «**negritas**» → trozos {texto, b} para pintarlos con textContent (sin innerHTML). */
  function trozosNegrita(s) {
    var partes = String(s || '').split(/(\*\*[^*]+\*\*)/g), out = [];
    partes.forEach(function (p) { if (!p) return; var m = /^\*\*([^*]+)\*\*$/.exec(p); out.push(m ? { texto: m[1], b: true } : { texto: p, b: false }); });
    return out;
  }

  var api = { CONTESTO: CONTESTO, OFRECIO: OFRECIO, CERRO: CERRO, MOTIVOS: MOTIVOS, PROGRAMAS: PROGRAMAS, ZONAS: ZONAS,
    mostrarTelefono: mostrarTelefono, candadoEstado: candadoEstado, encuestaFaltantes: encuestaFaltantes, horaClienteAUtc: horaClienteAUtc,
    etiquetaLista: etiquetaLista, bloquesMarkdown: bloquesMarkdown, trozosNegrita: trozosNegrita };
  root.VentasReglas = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
