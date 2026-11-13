// 13-nov-2026 · Tablero de ventas en un navegador de verdad, con el servidor (ventas-tablero) y Twilio SIMULADOS.
// Recorre: abrir lead → candado del guion (no se prende antes de 45 s) → lead con teléfono tapado → llamar →
// colgar → encuesta obligatoria (bloquea el siguiente lead) → guardar. Toma capturas a 1280 px.
import { test, expect } from '@playwright/test';

const L1 = '11111111-1111-1111-1111-111111111111', L2 = '22222222-2222-2222-2222-222222222222';
function servidorFalso() {
  const s = { pendiente: null, leido: false, llamadas: [] };
  const lead = (id, nombre, tel, interes, canal) => ({ id, nombre, telefono: tel, interes, canal, estado: 'nuevo', creado: '2026-11-12T18:00:00Z', lista: { nombre: 'Leads que dejaron sus datos', tipo: 'caliente' }, horario_ok: true, zona: 'America/Los_Angeles' });
  const inicio = () => ({
    staff: { nombre: 'Brenda Lagunas', auditor: false, codigo: 'brenda' }, enlace_membresia: 'https://maestrohvacr.com/estudiar?comprar=catalog&ref=asesora-brenda&utm_source=asesora&utm_medium=telefono&utm_campaign=brenda',
    guion: { version: 'v0.2', minimo_seg: 45 }, carpeta: true, tour: true, pendiente: s.pendiente, twilio_listo: true, salas_listas: true,
    leads: [lead(L1, 'Juan Pérez', '***-***-1234', 'HVAC y Refrigeración', 'tiktok'), lead(L2, 'Ana Ruiz', '***-***-0000', 'Electricidad', 'formulario')],
    listas: [{ id: 'l1', nombre: 'Leads web', tipo: 'caliente', activa: true, usable: true }, { id: 'l2', nombre: 'VIP sin pagar', tipo: 'tibia', activa: false, usable: false }, { id: 'l3', nombre: 'Llamadas en frío', tipo: 'fria', activa: false, usable: false }],
    lugares: [
      { id: 'g0', nombre: 'Calefacción residencial · 3 meses', fecha: '2027-01-13', horario: 'Miércoles 6–9 p. m.', dias: 62, cupo: null, con_deposito: 0, van_a_pagar: 0, libres: null },
      { id: 'g1', nombre: 'Programa de 8 meses', fecha: '2027-01-16', horario: 'Sáb y dom 12–4 p. m.', dias: 65, cupo: 30, con_deposito: 12, van_a_pagar: 3, libres: 18 },
      { id: 'g2', nombre: 'Intensivo Mini Splits (3 días)', fecha: '2027-02-08', horario: '8–10 de febrero', dias: 88, cupo: null, con_deposito: 0, van_a_pagar: 0, libres: null },
      { id: 'g3', nombre: 'Intensivo Multizona (3 días)', fecha: '2027-02-15', horario: '15–17 de febrero', dias: 95, cupo: null, con_deposito: 0, van_a_pagar: 0, libres: null },
      { id: 'g4', nombre: 'Electricidad 4 meses y Programa de 12 meses', fecha: '2027-03-20', horario: 'Sáb y dom 7–11 a. m.', dias: 128, cupo: null, con_deposito: 0, van_a_pagar: 0, libres: null }],
    citas: [],
  });
  const abierto = () => ({ lead: { ...inicio().leads[0], idioma: 'es', modalidad: 'presencial', resumen: 'Quiere estudiar los fines de semana.', ultimo_mensaje: '¿Cuánto cuesta el de 8 meses?', origen: { utm_campaign: 'tiktok-8meses' } },
    apertura: '«Hola, ¿hablo con Juan? Le habla Brenda, de Maestro HVACR, la escuela de técnicos en HVAC, Refrigeración y Electricidad en Colton…»', historial: [], puede_llamar: { ok: true }, pendiente: s.pendiente });
  const guion = () => ({ necesita_guion: true, guion: { version: 'v0.2', minimo_seg: 45, texto: '# GUION DE PRUEBA\n**Texto ficticio: el guion real lo da el servidor.**\n' + Array.from({ length: 40 }, (_, i) => '- Línea de prueba ' + (i + 1) + '.').join('\n') + '\n> «Fin del texto de prueba.»' }, apertura: abierto().apertura, tipo: 'caliente', nombre_corto: 'Juan' });
  const responder = (b) => {
    s.llamadas.push(b.accion);
    if (b.accion === 'inicio') return inicio();
    if (b.accion === 'abrir') { if (s.pendiente && b.prospecto_id !== s.pendiente.prospecto_id) return { __status: 409, error: 'Tienes una encuesta sin contestar.', pendiente: s.pendiente }; return s.leido ? abierto() : guion(); }
    if (b.accion === 'guion_leido') { if (!b.llego_al_final) return { __status: 425, error: 'Lee el guion hasta el final.' }; s.leido = true; return abierto(); }
    if (b.accion === 'preparar_llamada') return { llamada_id: 'c1', ticket: 'T'.repeat(43), token: 'token-twilio-falso' };
    if (b.accion === 'encuesta') { if (!b.respuestas || !b.respuestas.contesto) return { __status: 422, error: 'Falta' }; s.pendiente = null; return { ok: true }; }
    if (b.accion === 'documento') return { version: '2027-v1', formato: 'html', contenido: '<h1>Carpeta de ventas</h1><p>Uso interno.</p>' };
    return { __status: 400, error: 'acción desconocida' };
  };
  return { s, responder };
}

test('recorrido completo del tablero a 1280 px', async ({ page }) => {
  const f = servidorFalso();
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.route('**/functions/v1/ventas-tablero', async (route) => {
    const b = JSON.parse(route.request().postData() || '{}');
    const r = f.responder(b);
    await route.fulfill({ status: r.__status || 200, contentType: 'application/json', body: JSON.stringify(r) });
  });
  await page.addInitScript(() => {
    window.__llamadas = [];
    const ev = {};
    window.VentasTwilioSimulado = { Device: function () { this.updateToken = () => {}; this.connect = async (o) => { window.__llamadas.push(o); setTimeout(() => ev.accept && ev.accept(), 50); return { on: (e, fn) => { ev[e] = fn; }, disconnect: () => ev.disconnect && ev.disconnect(), mute: () => {}, isMuted: () => false }; }; } };
  });
  await page.clock.install();
  await page.goto('/tests/fixtures/ventas-tablero.html');
  await page.getByRole('button', { name: /Tablero de ventas/ }).click();
  await expect(page.getByText('Escoge un lead de la lista')).toBeVisible();
  await expect(page.locator('#vtTablero')).not.toContainText(/\d{3}-\d{4}(?<!\*\*\*-\d{4})/);
  await page.screenshot({ path: 'capturas/ventas-1-tablero.png' });

  // Frías apagadas
  await page.getByRole('tab', { name: /Frías/ }).click();
  await expect(page.getByText(/APAGADAS hasta que Mario cargue y revise el Registro Nacional No Llame/)).toBeVisible();
  await page.getByRole('tab', { name: /Calientes/ }).click();

  // Candado del guion
  await page.locator('.vt-lead', { hasText: 'Juan Pérez' }).click();
  const leido = page.locator('#vtLeido');
  await expect(leido).toBeDisabled();
  await page.screenshot({ path: 'capturas/ventas-2-guion.png' });
  await page.locator('#vtGuion').evaluate((el) => { el.scrollTop = el.scrollHeight; el.dispatchEvent(new Event('scroll')); });
  await page.clock.fastForward(20000);
  await expect(leido).toBeDisabled();
  await expect(leido).toHaveText(/Espera/);
  await page.clock.fastForward(26000);
  await expect(leido).toBeEnabled();
  await leido.click();

  // Lead con teléfono tapado
  await expect(page.locator('.vt-tel')).toHaveText('***-***-1234');
  await expect(page.getByText(/la misma clase del salón, transmitida/)).toBeVisible();
  await page.screenshot({ path: 'capturas/ventas-3-lead.png', fullPage: false });

  // Llamar (Twilio simulado) → colgar → encuesta obligatoria
  await page.getByRole('button', { name: /Llamar desde aquí/ }).click();
  await expect(page.getByRole('button', { name: /Colgar/ })).toBeVisible();
  expect(await page.evaluate(() => window.__llamadas[0])).toEqual({ params: { llamada: 'c1', ticket: 'T'.repeat(43) } });
  await page.screenshot({ path: 'capturas/ventas-4-llamada.png' });
  f.s.pendiente = { id: 'c1', prospecto_id: L1, lista_tipo: 'caliente' };
  await page.getByRole('button', { name: /Colgar/ }).click();
  await expect(page.locator('#vtEncuesta')).toBeVisible();
  await expect(page.locator('.vt-lead', { hasText: 'Ana Ruiz' })).toBeDisabled();
  await expect(page.locator('#vtGuardarEncuesta')).toBeDisabled();
  const enc = page.locator('#vtEncuesta');
  await enc.getByRole('button', { name: 'Sí contestó', exact: true }).click();
  await enc.getByRole('button', { name: '8 meses', exact: true }).click();
  await enc.getByRole('button', { name: 'No le interesa', exact: true }).click();
  await enc.getByRole('button', { name: 'Precio', exact: true }).click();
  await expect(page.locator('#vtGuardarEncuesta')).toBeDisabled();
  await expect(enc).toContainText(/membresía de \$149/);
  await page.screenshot({ path: 'capturas/ventas-5-encuesta.png' });
  await enc.getByRole('button', { name: 'Membresía $149', exact: true }).click();
  await expect(page.locator('#vtGuardarEncuesta')).toBeEnabled();
  await page.locator('#vtGuardarEncuesta').click();
  await expect(page.getByText(/Encuesta guardada/)).toBeVisible();
  await expect(page.locator('.vt-lead', { hasText: 'Ana Ruiz' })).toBeEnabled();
  expect(f.s.llamadas).toEqual(expect.arrayContaining(['inicio', 'abrir', 'guion_leido', 'preparar_llamada', 'encuesta']));

  // Carpeta de ventas en iframe con sandbox
  await page.getByRole('button', { name: /Carpeta de ventas/ }).click();
  await expect(page.locator('.vt-modal iframe')).toHaveAttribute('sandbox', '');
  await page.screenshot({ path: 'capturas/ventas-6-carpeta.png' });
});
