// 22-nov-2026 · Antes de eliminar la cuenta en la WEB se enseña cómo cancelar el cobro (Stripe no se cancela solo).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadScript } from './setup.js';

const th = (v) => ({ then: (ok) => { ok(v); return th(v); } });
const falla = () => ({ then: (_ok, err) => { err(new Error('red')); } });

function preparar(rpcResp, respuestaDialogo) {
  window.supabaseClient = { rpc: vi.fn((n) => (n === 'web_access_check' ? rpcResp : th({ data: null }))) };
  window.MaestroDialog = { confirm: vi.fn(() => Promise.resolve(respuestaDialogo)) };
  window.open = vi.fn();
  loadScript('js/cuenta-aviso-cobro.js');
}

describe('aviso de cobro antes de eliminar la cuenta (web)', () => {
  beforeEach(() => {
    delete window.MaestroAvisoCobro;
    delete window.isIOSAppStore; delete window.isAndroidPlayStore; delete window.isAndroidApp;
    delete window.__IS_NATIVE_APP; delete window.AndroidIAP; delete window.RevenueCatBridge;
  });

  it('membresía web activa: avisa que el cobro sigue y «Ir a cancelar» abre Mi cuenta SIN borrar', async () => {
    preparar(th({ data: { access: true, reason: 'web_membership' } }), true);
    const seguir = await window.MaestroAvisoCobro.antesDeBorrar();
    expect(seguir).toBe(false);
    expect(window.open).toHaveBeenCalledWith('https://maestrohvacr.com/estudiar#cuenta', '_blank', 'noopener');
    const o = window.MaestroDialog.confirm.mock.calls[0][0];
    expect(o.message).toContain('Tienes un pago activo');
    expect(o.message).toContain('NO cancela el cobro');
    expect(o.message).toContain('Administrar pagos o cancelar membresía');
    expect(o.message).toContain('soporte@maestrohvacr.com');
  });

  it.each([{ reason: 'paid' }, { reason: 'paid', modo: 'solo_grabaciones' }])('pago por otra vía (%o) también se trata como activo', async (extra) => {
    preparar(th({ data: { access: true, ...extra } }), false);
    const seguir = await window.MaestroAvisoCobro.antesDeBorrar();
    expect(seguir).toBe(true); // «Ya cancelé, continuar»
    expect(window.open).not.toHaveBeenCalled();
    expect(window.MaestroDialog.confirm.mock.calls[0][0].message).toContain('Tienes un pago activo');
  });

  it.each([
    ['fallo de red', falla()],
    ['respuesta con error', th({ data: null, error: { message: 'x' } })],
    ['admin (puede pagar además)', th({ data: { access: true, reason: 'admin' } })],
    ['sin pago', th({ data: { access: false, reason: 'no_payment' } })],
  ])('%s: igual enseña cómo cancelar (nunca borra en silencio)', async (_n, resp) => {
    preparar(resp, false);
    const seguir = await window.MaestroAvisoCobro.antesDeBorrar();
    expect(seguir).toBe(true);
    const o = window.MaestroDialog.confirm.mock.calls[0][0];
    expect(o.message).toContain('NO cancela el cobro');
    expect(o.message).toContain('maestrohvacr.com/estudiar');
  });

  it('dentro de la app de tienda no se mete (su aviso es el de auth.js)', async () => {
    window.isIOSAppStore = true;
    preparar(th({ data: { access: true, reason: 'paid' } }), true);
    expect(await window.MaestroAvisoCobro.antesDeBorrar()).toBe(true);
    expect(window.MaestroDialog.confirm).not.toHaveBeenCalled();
  });
});
