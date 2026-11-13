// 13-nov-2026 · Tablero de ventas (call center fase 1): candados de pantalla. El servidor vuelve a revisar todo;
// aquí se prueba que la pantalla nunca pinte un teléfono completo, que el guion y la encuesta bloqueen, y que las
// listas frías salgan apagadas.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadScript } from './setup.js';

loadScript('js/admin/ventas-reglas.js');
const R = window.VentasReglas;

describe('reglas de pantalla', () => {
  it('teléfono tapado: nunca más de 4 dígitos, aunque el servidor mandara el número completo', () => {
    expect(R.mostrarTelefono('***-***-4849')).toBe('***-***-4849');
    expect(R.mostrarTelefono('(909) 824-4849')).toBe('***-***-4849');
    expect(R.mostrarTelefono('+19098244849')).toBe('***-***-4849');
    expect(R.mostrarTelefono('')).toBe('');
  });
  it('candado del guion: final + segundos', () => {
    expect(R.candadoEstado({ inicioMs: 0, ahoraMs: 60000, llegoAlFinal: false, minimoSeg: 45 }).listo).toBe(false);
    const c = R.candadoEstado({ inicioMs: 0, ahoraMs: 20000, llegoAlFinal: true, minimoSeg: 45 });
    expect(c.listo).toBe(false); expect(c.texto).toBe('Espera 25 s');
    expect(R.candadoEstado({ inicioMs: 0, ahoraMs: 45000, llegoAlFinal: true, minimoSeg: 45 }).listo).toBe(true);
  });
  it('encuesta: dice lo que falta', () => {
    expect(R.encuestaFaltantes({}, 'caliente')).toEqual(['¿Contestó?']);
    expect(R.encuestaFaltantes({ contesto: 'buzon' }, 'caliente')).toEqual([]);
    expect(R.encuestaFaltantes({ contesto: 'si', ofrecio: ['12_meses'], cerro: 'no', no_interesa_motivo: 'precio' }, 'caliente').join()).toMatch(/antes de colgar/);
    expect(R.encuestaFaltantes({ contesto: 'si', ofrecio: ['12_meses', 'membresia'], cerro: 'no', no_interesa_motivo: 'precio' }, 'caliente')).toEqual([]);
    expect(R.encuestaFaltantes({ contesto: 'si', ofrecio: ['cita_virtual'], cerro: 'cita_virtual' }, 'caliente').join()).toMatch(/Fecha/);
  });
  it('hora del cliente → hora universal', () => {
    expect(R.horaClienteAUtc('2026-11-20T10:30', 'America/Los_Angeles')).toBe('2026-11-20T18:30:00.000Z');
    expect(R.horaClienteAUtc('2026-11-20T10:30', 'America/New_York')).toBe('2026-11-20T15:30:00.000Z');
  });
  it('el guion en Markdown se convierte en bloques sin HTML', () => {
    const b = R.bloquesMarkdown('# Título\n> «Hola <script>»\n- uno\n| a | b |\n|---|---|\n| 1 | 2 |');
    expect(b.map((x) => x.tipo)).toEqual(['h', 'cita', 'li', 'tabla']);
    expect(b[3].filas).toEqual([['a', 'b'], ['1', '2']]);
    expect(R.trozosNegrita('hola **mundo**')).toEqual([{ texto: 'hola ', b: false }, { texto: 'mundo', b: true }]);
  });
});

// ── la pantalla, con el servidor simulado ──
const INICIO = (extra = {}) => ({
  staff: { nombre: 'Brenda Lagunas', auditor: false, codigo: 'brenda' }, enlace_membresia: 'https://maestrohvacr.com/estudiar?comprar=catalog&ref=asesora-brenda',
  guion: { version: 'v0.2', minimo_seg: 45 }, carpeta: true, tour: true, pendiente: null, twilio_listo: true, zoom_listo: true,
  leads: [
    { id: '11111111-1111-1111-1111-111111111111', nombre: 'Juan Pérez', telefono: '(909) 555-1234', interes: 'HVAC', canal: 'tiktok', estado: 'nuevo', creado: '2026-11-12T18:00:00Z', lista: { nombre: 'Leads web', tipo: 'caliente' }, horario_ok: true },
    { id: '22222222-2222-2222-2222-222222222222', nombre: 'Ana Ruiz', telefono: '***-***-0000', interes: 'Electricidad', canal: 'formulario', estado: 'nuevo', creado: '2026-11-12T19:00:00Z', lista: { nombre: 'Leads web', tipo: 'caliente' }, horario_ok: true },
  ],
  listas: [{ id: 'l1', clave: 'leads_web', nombre: 'Leads web', tipo: 'caliente', activa: true, usable: true }, { id: 'l2', clave: 'fria_general', nombre: 'Frías', tipo: 'fria', activa: false, usable: false, motivo: 'apagada' }],
  lugares: [{ id: 'g1', nombre: 'Programa de 8 meses', fecha: '2027-01-16', horario: 'Sáb y dom 12–4', dias: 65, cupo: null, con_deposito: 0, van_a_pagar: 0, libres: null }],
  citas: [], ...extra,
});
const GUION = { necesita_guion: true, guion: { version: 'v0.2', texto: '# Guion\nTexto largo.', minimo_seg: 45 }, apertura: '«Hola, le habla…»', tipo: 'caliente', nombre_corto: 'Juan' };
const LEAD = { lead: { id: '11111111-1111-1111-1111-111111111111', nombre: 'Juan Pérez', telefono: '***-***-1234', lista: { nombre: 'Leads web', tipo: 'caliente' }, idioma: 'es', zona: 'America/Los_Angeles' }, apertura: '«Hola»', historial: [], puede_llamar: { ok: true }, pendiente: null };

let respuestas; let llamadas;
function servidor(mapa) {
  respuestas = mapa; llamadas = [];
  global.fetch = vi.fn(async (_url, op) => {
    const b = JSON.parse(op.body); llamadas.push(b);
    const r = typeof respuestas[b.accion] === 'function' ? respuestas[b.accion](b) : respuestas[b.accion];
    const status = r && r.__status ? r.__status : 200;
    return { ok: status < 400, status, json: async () => r || {} };
  });
}
const esperar = async (n = 6) => { for (let i = 0; i < n; i++) await Promise.resolve(); await new Promise((r) => setTimeout(r, 0)); };

describe('tablero en pantalla', () => {
  beforeEach(async () => {
    document.body.innerHTML = '<div><button class="admin-nav-btn">Inicio</button></div>';
    window.supabaseClient = { auth: { getSession: async () => ({ data: { session: { access_token: 'jwt' } } }) } };
    delete window.VentasTablero;
    loadScript('js/admin/ventas-tablero.js');
    await esperar();
  });

  it('pone el botón «Tablero de ventas» en el panel', () => {
    expect(document.getElementById('navVentasTablero').textContent).toMatch(/Tablero de ventas/);
  });

  it('la lista nunca enseña un teléfono completo', async () => {
    servidor({ inicio: INICIO() });
    window.VentasTablero.abrir(); await esperar();
    const txt = document.getElementById('vtTablero').textContent;
    expect(txt).toContain('***-***-1234');
    expect(txt).not.toMatch(/555-1234|9095551234/);
  });

  it('las frías salen APAGADAS hasta que Mario revise el DNC', async () => {
    servidor({ inicio: INICIO() });
    window.VentasTablero.abrir(); await esperar();
    [...document.querySelectorAll('.vt-tab')].find((b) => /Frías/.test(b.textContent)).click(); await esperar();
    expect(document.getElementById('vtTablero').textContent).toMatch(/APAGADAS hasta que Mario cargue y revise el Registro Nacional No Llame/);
  });

  it('candado del guion: el botón no se prende antes de tiempo y el servidor recibe «llegó al final»', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'Date'] });
    try {
      servidor({ inicio: INICIO(), abrir: GUION, guion_leido: LEAD });
      window.VentasTablero.abrir(); await esperar();
      document.querySelector('.vt-lead').click(); await esperar();
      const btn = document.getElementById('vtLeido');
      expect(btn.disabled).toBe(true);
      document.getElementById('vtGuion').dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(20000);
      expect(btn.disabled).toBe(true);
      expect(btn.textContent).toMatch(/Espera/);
      vi.advanceTimersByTime(26000);
      expect(btn.disabled).toBe(false);
      btn.click(); await esperar();
      expect(llamadas.find((x) => x.accion === 'guion_leido')).toMatchObject({ llego_al_final: true });
      expect(document.getElementById('vtLlamar')).not.toBeNull();
      expect(document.getElementById('vtTablero').textContent).not.toMatch(/555-1234/);
    } finally { vi.useRealTimers(); }
  });

  it('lista apagada o número en no llamar con encuesta pendiente: la encuesta sale igual (Codex, vuelta 9)', async () => {
    for (const status of [423, 410]) {
      const pend = { id: 'c8', prospecto_id: '11111111-1111-1111-1111-111111111111', lista_tipo: 'caliente' };
      servidor({ inicio: INICIO({ pendiente: pend }), abrir: { __status: status, error: 'No se puede abrir.' } });
      window.VentasTablero.abrir(); await esperar(10);
      expect(document.getElementById('vtEncuesta')).not.toBeNull();
    }
  });

  it('lead reasignado con encuesta pendiente: la encuesta sale igual (Codex, vuelta 8)', async () => {
    const pend = { id: 'c7', prospecto_id: '11111111-1111-1111-1111-111111111111', lista_tipo: 'caliente' };
    servidor({ inicio: INICIO({ pendiente: pend }), abrir: { __status: 403, error: 'Este lead no es tuyo.' } });
    window.VentasTablero.abrir(); await esperar(10);
    expect(document.getElementById('vtEncuesta')).not.toBeNull();
    expect(document.body.textContent).toMatch(/ya es de otra asesora/);
  });

  it('con encuesta pendiente: abre directo la encuesta y los otros leads quedan bloqueados', async () => {
    servidor({ inicio: INICIO({ pendiente: { id: 'c1', prospecto_id: '11111111-1111-1111-1111-111111111111', lista_tipo: 'caliente' } }), abrir: { ...LEAD, pendiente: { id: 'c1', prospecto_id: '11111111-1111-1111-1111-111111111111', lista_tipo: 'caliente' } } });
    window.VentasTablero.abrir(); await esperar(10);
    expect(document.getElementById('vtEncuesta')).not.toBeNull();
    const otros = [...document.querySelectorAll('.vt-lead')].filter((b) => /Ana/.test(b.textContent));
    expect(otros[0].disabled).toBe(true);
    const guardar = document.getElementById('vtGuardarEncuesta');
    expect(guardar.disabled).toBe(true);
    // Contestó → sí, ofreció 12 meses, no le interesa por precio: sigue bloqueado (falta membresía o cita)
    const clic = (txt) => [...document.querySelectorAll('#vtEncuesta .vt-opc button')].find((b) => b.textContent === txt).click();
    clic('Sí contestó'); clic('12 meses'); clic('No le interesa'); clic('Precio');
    expect(document.getElementById('vtGuardarEncuesta').disabled).toBe(true);
    expect(document.getElementById('vtEncuesta').textContent).toMatch(/antes de colgar/);
    clic('Membresía $149');
    expect(document.getElementById('vtGuardarEncuesta').disabled).toBe(false);
  });

  it('llamar con Twilio simulado: manda llamada y ticket, y al colgar pide la encuesta', async () => {
    const eventos = {};
    const call = { on: (e, f) => { eventos[e] = f; }, disconnect: () => eventos.disconnect(), mute: vi.fn(), isMuted: () => false };
    const connect = vi.fn(async () => call);
    window.VentasTwilioSimulado = { Device: function () { this.connect = connect; this.updateToken = vi.fn(); } };
    let pend = null;
    servidor({ inicio: () => INICIO({ pendiente: pend }), abrir: () => ({ ...LEAD, pendiente: pend }), preparar_llamada: { llamada_id: 'c9', ticket: 'T'.repeat(43), token: 'jwt-twilio' } });
    window.VentasTablero._st.abiertoId = null;
    window.VentasTablero.abrir(); await esperar();
    window.VentasTablero._st.abierto = LEAD; window.VentasTablero._st.abiertoId = LEAD.lead.id;
    document.querySelector('.vt-lead').click(); await esperar();
    document.getElementById('vtLlamar').click(); await esperar(10);
    expect(connect).toHaveBeenCalledWith({ params: { llamada: 'c9', ticket: 'T'.repeat(43) } });
    expect(document.getElementById('vtTablero').textContent).toMatch(/Colgar/);
    pend = { id: 'c9', prospecto_id: LEAD.lead.id, lista_tipo: 'caliente' };
    [...document.querySelectorAll('button')].find((b) => /Colgar/.test(b.textContent)).click(); await esperar(10);
    expect(document.getElementById('vtEncuesta')).not.toBeNull();
    delete window.VentasTwilioSimulado;
  });

  it('la carpeta de ventas se abre en un iframe con sandbox vacío (sin scripts)', async () => {
    servidor({ inicio: INICIO(), documento: { version: '2027-v1', formato: 'html', contenido: '<h1>Carpeta</h1><script>alert(1)</script>' } });
    window.VentasTablero.abrir(); await esperar();
    [...document.querySelectorAll('button')].find((b) => /Carpeta de ventas/.test(b.textContent)).click(); await esperar();
    const f = document.querySelector('.vt-modal iframe');
    expect(f.getAttribute('sandbox')).toBe('');
  });
});
