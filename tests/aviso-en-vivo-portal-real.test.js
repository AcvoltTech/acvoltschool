// 🔴 PORTE DE LAS CORRECCIONES DE EN VIVO A ESTE PORTAL (18-sep-2026).
//    Aquí es donde Mario transmite. El código anterior leía el padrón guardado en SU
//    NAVEGADOR (355 correos, sin filtro VIP): de 31 VIP que pagan se avisó a 1, y 190
//    que no pagan sí recibieron aviso de una clase de paga. Y con la lista vacía,
//    mandaba a TODOS.
// 🔴 CDX-153: el edge responde {sent, failed} SIN `total`. Estas pruebas NO llevan
//    `total` a propósito — las que siempre lo incluían nunca vieron el fallo.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import vm from 'vm';

const src = fs.readFileSync('js/admin/live-stream-admin.js', 'utf8');
const code = src.slice(src.indexOf('function lsaGetEmailsForGroup('), src.indexOf('function _lsaEmailBroadcastOnLive('));

function entorno(respuesta, padron) {
  const pedido = { cuerpo: null };
  const ctx = {
    console: { log() {}, warn() {}, error() {} },
    _t: (k, f) => f || k,
    localStorage: { getItem: () => JSON.stringify(padron || []) },
    _lsaStreams: [],
    _lsaEmailBroadcastOnLive: () => {},
    supabaseClient: {
      functions: {
        invoke: async (_n, opts) => { pedido.cuerpo = opts.body; return respuesta; }
      }
    }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return { ctx, pedido };
}
const esperar = async () => { for (let i = 0; i < 6; i++) await new Promise((r) => setImmediate(r)); };
const ok = { data: { sent: 30, failed: 0 } };

describe('el portal real ya no lee el padrón del navegador', () => {
  it('clase VIP pide __vip__ al servidor, NO la lista del navegador', async () => {
    const padron = Array.from({ length: 355 }, (_, i) => ({ email: `t${i}@x.test`, groups: ['hibridos'] }));
    const { ctx, pedido } = entorno(ok, padron);
    ctx.lsaNotifyGoLive({ id: 'a', class_group: 'todos' });
    await esperar();
    expect(pedido.cuerpo.recipient_emails).toEqual(['__vip__']);
    expect(pedido.cuerpo.solo_vip).toBe(true);
  });

  it('clase abierta pide __all__', async () => {
    const { ctx, pedido } = entorno(ok, []);
    ctx.lsaNotifyGoLive({ id: 'a', class_group: 'abierta' });
    await esperar();
    expect(pedido.cuerpo.recipient_emails).toEqual(['__all__']);
    expect(pedido.cuerpo.solo_vip).toBeUndefined();
  });

  it('sin grupo = VIP, igual que la puerta de entrada', async () => {
    const { ctx, pedido } = entorno(ok, []);
    ctx.lsaNotifyGoLive({ id: 'a', class_group: null });
    await esperar();
    expect(pedido.cuerpo.recipient_emails).toEqual(['__vip__']);
  });

  it('cohorte VACÍA no avisa a nadie — NUNCA a todos', async () => {
    const { ctx, pedido } = entorno(ok, []);
    const s = { id: 'a', class_group: 'mar_mie' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(pedido.cuerpo).toBe(null);
    expect(s._notifSent).not.toBe(true);
  });

  it('cohorte con gente manda SOLO a su gente', async () => {
    const padron = [{ email: 'a@x.test', groups: ['hibridos'] }, { email: 'b@x.test', groups: ['trinidad'] }];
    const { ctx, pedido } = entorno({ data: { sent: 1, failed: 0 } }, padron);
    ctx.lsaNotifyGoLive({ id: 'a', class_group: 'mar_mie' });
    await esperar();
    expect(pedido.cuerpo.recipient_emails).toEqual(['a@x.test']);
  });
});

describe('el recibo no se da por bueno a la ligera', () => {
  it('ya NO marca enviado antes de mandar', async () => {
    const { ctx } = entorno({ error: { message: 'cayó' } }, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).not.toBe(true);
    expect(s._notifPending).toBe(false);   // se libera para reintentar
  });

  it('{sent:1, failed:1} SIN total es PARCIAL, no completo', async () => {
    const { ctx } = entorno({ data: { sent: 1, failed: 1 } }, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).not.toBe(true);
    expect(s._notifPending).toBe(true);    // ni confirmado ni reintentado
  });

  it('{sent:0, failed:5} SIN total: cero, se libera', async () => {
    const { ctx } = entorno({ data: { sent: 0, failed: 5 } }, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).not.toBe(true);
    expect(s._notifPending).toBe(false);
  });

  it('{sent:2, failed:0} SIN total sí confirma', async () => {
    const { ctx } = entorno({ data: { sent: 2, failed: 0 } }, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).toBe(true);
  });

  it('un {data:{error}} con HTTP 200 es fallo de negocio, no éxito', async () => {
    const { ctx } = entorno({ data: { error: 'vip_policy_unavailable' } }, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).not.toBe(true);
  });

  it('segundo plano: aceptado, y no se reintenta', async () => {
    const { ctx } = entorno({ data: { background: true, sending: 5093 } }, []);
    const s = { id: 'a', class_group: 'abierta' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).toBe(true);
  });

  it('recibo sin conteos usables: conserva el pendiente', async () => {
    const { ctx } = entorno({ data: { ok: true } }, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(s._notifSent).not.toBe(true);
    expect(s._notifPending).toBe(true);
  });

  it('no manda dos veces la misma clase', async () => {
    const { ctx, pedido } = entorno(ok, []);
    const s = { id: 'a', class_group: 'todos' };
    ctx.lsaNotifyGoLive(s);
    await esperar();
    const primero = pedido.cuerpo;
    pedido.cuerpo = null;
    ctx.lsaNotifyGoLive(s);
    await esperar();
    expect(primero).not.toBe(null);
    expect(pedido.cuerpo).toBe(null);
  });
});

// 🔍 Botón «Comprobar audiencia» en el portal real: pregunta SIN enviar.
// 🔴 El defecto que evita: `_lsaHmsAuthToken()` cae a la llave ANÓNIMA sin sesión y el
//    servidor la rechaza con 401 — la consulta parecería rota cuando nunca iba firmada.
describe('comprobar audiencia sin enviar (portal real)', () => {
  const codigoBoton = src.slice(src.indexOf('async function _lsaTokenAdminReal('), src.indexOf('function lsaNotifyGoLive('));
  function ctxBoton(o) {
    o = o || {};
    const llamadas = [];
    const avisos = [];
    const ctx = {
      console: { log() {}, warn() {}, error() {} },
      alert: (m) => avisos.push(m),
      document: { getElementById: () => null },
      SUPABASE_URL: 'https://x.test', SUPABASE_KEY: 'llave-anonima',
      supabaseClient: { auth: { getSession: async () => ({ data: { session: o.conSesion ? { access_token: 'jwt-real' } : null } }) } },
      fetch: async (url, init) => {
        llamadas.push({ auth: init.headers.Authorization, cuerpo: JSON.parse(init.body) });
        if (o.status) return { ok: false, status: o.status, json: async () => ({ error: 'nope' }) };
        return { ok: true, status: 200, json: async () => ({ status: 'dry_run', dry_run: true, targeted: 30, group: 'todos' }) };
      }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(codigoBoton, ctx);
    return { ctx, llamadas, avisos };
  }

  it('SIN sesión no manda la llave anónima al servidor', async () => {
    const { ctx, llamadas, avisos } = ctxBoton({ conSesion: false });
    const r = await ctx.lsaComprobarAudiencia('abc');
    expect(llamadas.length).toBe(0);
    expect(r.ok).toBe(false);
    expect(avisos[0]).toContain('sesión');
  });

  it('CON sesión pregunta en seco: dry_run y sin title', async () => {
    const { ctx, llamadas, avisos } = ctxBoton({ conSesion: true });
    const r = await ctx.lsaComprobarAudiencia('abc');
    expect(llamadas[0].auth).toBe('Bearer jwt-real');
    expect(llamadas[0].cuerpo).toEqual({ stream_id: 'abc', dry_run: true });
    expect(r.targeted).toBe(30);
    expect(avisos[0]).toContain('NO se envió');
  });

  it('401 se explica como sesión vencida, no como "no hay nadie"', async () => {
    const { ctx, avisos } = ctxBoton({ conSesion: true, status: 401 });
    const r = await ctx.lsaComprobarAudiencia('abc');
    expect(r.ok).toBe(false);
    expect(r.targeted).toBe(null);
    expect(avisos[0]).toContain('sesión');
  });

  it('503 no inventa un número', async () => {
    const { ctx } = ctxBoton({ conSesion: true, status: 503 });
    const r = await ctx.lsaComprobarAudiencia('abc');
    expect(r.ok).toBe(false);
    expect(r.targeted).toBe(null);
  });
});

// 🔴 EL CORREO MANDABA A LA PÁGINA DE PUBLICIDAD (18-sep-2026). `maestrohvacr.com` es
//    el sitio de marketing: medido, NO contiene `liveStreamingScreen` ni código de app.
//    El técnico leía "entra a la clase", picaba, y aterrizaba en un anuncio.
describe('el enlace de la clase lleva a la clase', () => {
  it('ningún enlace apunta ya a la página de publicidad', () => {
    expect(src).not.toContain('maestrohvacr.com/#liveStreamingScreen');
  });

  it('el push usa ruta RELATIVA (abre en el origen de quien recibe)', async () => {
    const { ctx, pedido } = entorno({ data: { sent: 1, failed: 0 } }, []);
    ctx.lsaNotifyGoLive({ id: 'a', class_group: 'todos' });
    await esperar();
    expect(pedido.cuerpo.url.startsWith('./')).toBe(true);
    expect(pedido.cuerpo.url).toContain('liveStreamingScreen');
  });
});
