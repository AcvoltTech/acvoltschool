// 2-nov-2026 · Muro web: modo «solo grabaciones» (membresia_119 sin $149).
// 12-nov-2026 · Grabaciones SIN enlaces: zoom_mis_grabaciones() → reproductor en la página o «Disponible pronto».
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadScript } from './setup.js';

const tick = () => new Promise((r) => setTimeout(r, 0));
const flush = async () => { for (let i = 0; i < 12; i++) await tick(); };

// Builder "thenable" como el de Supabase (no es Promise real).
const th = (v) => ({ then: (ok) => { ok(v); return th(v); } });

const SESION = { data: { session: { access_token: 'jwt-123', user: { email: 'Tec@Ejemplo.com', user_metadata: { full_name: 'Juan Técnico' } } } } };
const NO_EXISTE = { data: null, error: { code: 'PGRST202', message: 'Could not find the function public.zoom_mis_grabaciones' }, status: 404 };

// misResp: respuesta de la RPC nueva (función o valor). Por defecto: «no existe» (base vieja).
function mockSupabase(accessResp, groups, recs, misResp = NO_EXISTE) {
  const llamadas = { from: 0, mis: 0 };
  window.supabaseClient = {
    auth: {
      getSession: () => Promise.resolve(SESION),
      signOut: () => {},
    },
    rpc: (name) => {
      if (name === 'web_access_check') return th({ data: accessResp });
      if (name === 'crm_mis_grupos') return th({ data: groups });
      if (name === 'zoom_mis_grabaciones') { llamadas.mis++; return th(typeof misResp === 'function' ? misResp() : misResp); }
      return th({ data: null });
    },
    from: () => { llamadas.from++; return { select: () => ({ eq: () => ({ maybeSingle: () => th({ data: { data: JSON.stringify(recs) } }) }) }) }; },
  };
  return llamadas;
}

const RECS = [
  { id: 'a', date: '2026-10-31', day_label: 'Sábado', category: 'Manos a la Obra', duration_min: 201, link: 'https://zoom.us/rec/share/a', groups: ['trinidad', 'membresia_119'] },
  { id: 'b', date: '2026-11-01', day_label: 'Domingo', category: 'Manos a la Obra', duration_min: 219, link: 'https://zoom.us/rec/share/b', groups: ['membresia_119'] },
  { id: 'c', date: '2026-11-01', day_label: 'Domingo', category: 'Tarde', duration_min: 221, link: 'https://zoom.us/rec/share/c', groups: ['trinidad_19sep2026'] },
  { id: 'd', date: '2026-10-25', day_label: 'Sábado', link: 'javascript:alert(1)', groups: ['membresia_119'] },
  { id: 'e', date: '2026-10-24', day_label: 'Sábado', link: 'https://zoom.us/rec/share/e', groups: ['membresia_119'], visible: false },
];

// Lo que devuelve zoom_mis_grabaciones() (paso A aplicado): sin enlace, ya filtrado.
const NUEVA = {
  sesion: true, staff: false, grupos: ['membresia_119'],
  grabaciones: [
    { id: 'a', fecha: '2026-10-31', titulo: 'Clase sáb', categoria: 'Manos a la Obra', dia: 'Sábado', minutos: 201, stream: 'abc123def456abc123def456abc123de', pronto: false },
    { id: 'b', fecha: '2026-11-01', titulo: 'Clase dom', categoria: 'Manos a la Obra', dia: 'Domingo', minutos: 219, stream: null, pronto: true },
  ],
};

const ACCESO = { access: true, reason: 'paid', modo: 'solo_grabaciones' };

async function abrirMuro() {
  loadScript('js/web-access-gate.js');
  window.MaestroWebGate.check(true);
  await flush();
  return document.getElementById('webGrabacionesModal');
}

describe('web-access-gate · solo grabaciones', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.MaestroWebGate;
    delete window.MaestroZoomSeguro;
    delete window.fetch;
    Object.defineProperty(navigator, 'language', { value: 'es-MX', configurable: true });
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('(c) RPC inexistente → camino viejo: membresia_119 ve SOLO sus grabaciones, la más nueva arriba, y la oferta $149.99', async () => {
    const ll = mockSupabase(ACCESO, ['membresia_119'], RECS);
    const modal = await abrirMuro();
    expect(modal).not.toBeNull();
    expect(ll.mis).toBe(1);
    expect(document.getElementById('webAccessGateModal')).toBeNull();
    const links = [...modal.querySelectorAll('#webGrabList a')].map((a) => a.getAttribute('href'));
    // b (1-nov) antes que a (31-oct); c es de otra cohorte; e está oculta; d no es https → '#'
    expect(links).toEqual(['https://zoom.us/rec/share/b', 'https://zoom.us/rec/share/a', '#']);
    expect(modal.textContent).toContain('$149.99');
    expect(modal.querySelector('a[href="https://maestrohvacr.com/estudiar"]')).not.toBeNull();
  });

  it('(a) con la RPC nueva NO se pinta ningún href a zoom.us ni se lee la tabla', async () => {
    const ll = mockSupabase(ACCESO, ['membresia_119'], RECS, { data: NUEVA, error: null });
    const modal = await abrirMuro();
    expect(modal).not.toBeNull();
    expect(ll.from).toBe(0);                                   // jamás la tabla con la RPC viva
    expect(modal.innerHTML).not.toMatch(/zoom\.us/i);
    expect(modal.querySelectorAll('#webGrabList a').length).toBe(0);
    const filas = modal.querySelectorAll('#webGrabList .web-grab-fila');
    expect(filas.length).toBe(2);
    expect(filas[0].textContent).toContain('2026-11-01');      // la más nueva arriba
    expect(modal.querySelectorAll('#webGrabList .web-grab-ver').length).toBe(1);
  });

  it('(a) «Ver clase» reproduce EN LA PÁGINA: video-token con la sesión + iframe de Stream + marca de agua', async () => {
    mockSupabase(ACCESO, ['membresia_119'], RECS, { data: NUEVA, error: null });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ token: 'tok.EN-firma_1' }) });
    window.fetch = fetchMock;
    const modal = await abrirMuro();
    modal.querySelector('#webGrabList .web-grab-ver').click();
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://htklsowiyjwsjnacnvnr.supabase.co/functions/v1/video-token');
    expect(init.headers.Authorization).toBe('Bearer jwt-123');
    expect(JSON.parse(init.body)).toEqual({ uid: 'abc123def456abc123def456abc123de' });
    const player = document.getElementById('webGrabPlayer');
    expect(player.hidden).toBe(false);
    const f = player.querySelector('iframe');
    expect(f).not.toBeNull();
    expect(f.src.indexOf('https://customer-ehgr1pt7ma9kf78k.cloudflarestream.com/tok.EN-firma_1/iframe?')).toBe(0);
    const marca = player.querySelector('.mh-zoom-marca');
    expect(marca).not.toBeNull();
    expect(marca.textContent).toContain('Tec@Ejemplo.com');
    expect(marca.style.pointerEvents).toBe('none');
    expect(modal.innerHTML).not.toMatch(/zoom\.us/i);
    // cerrar quita el video
    document.getElementById('webGrabPlayerCerrar').click();
    expect(player.hidden).toBe(true);
    expect(player.querySelector('iframe')).toBeNull();
  });

  it('error de video-token → mensaje del servidor + reintentar (nunca «no pagaste»)', async () => {
    mockSupabase(ACCESO, ['membresia_119'], RECS, { data: NUEVA, error: null });
    window.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({ error: 'Servicio ocupado, intenta de nuevo' }) });
    const modal = await abrirMuro();
    modal.querySelector('#webGrabList .web-grab-ver').click();
    await flush();
    const player = document.getElementById('webGrabPlayer');
    expect(player.querySelector('iframe')).toBeNull();
    expect(player.textContent).toContain('Servicio ocupado');
    expect(player.textContent).toContain('Intentar de nuevo');
  });

  it('(b) pronto → «⏳ Disponible pronto» sin botón ni enlace', async () => {
    mockSupabase(ACCESO, ['membresia_119'], RECS, { data: NUEVA, error: null });
    const modal = await abrirMuro();
    const pronto = modal.querySelectorAll('#webGrabList .web-grab-pronto');
    expect(pronto.length).toBe(1);
    expect(pronto[0].textContent).toBe('⏳ Disponible pronto');
    const filaPronto = pronto[0].closest('.web-grab-fila');
    expect(filaPronto.querySelector('button, a')).toBeNull();
  });

  it('(b) en inglés: «⏳ Available soon»', async () => {
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
    mockSupabase(ACCESO, ['membresia_119'], RECS, { data: NUEVA, error: null });
    const modal = await abrirMuro();
    expect(modal.querySelector('#webGrabList .web-grab-pronto').textContent).toBe('⏳ Available soon');
  });

  it('un enlace que llegara para quien NO es personal se descarta; el personal sí ve «Abrir en Zoom»', async () => {
    const conLink = JSON.parse(JSON.stringify(NUEVA));
    conLink.grabaciones[0].link = 'https://us02web.zoom.us/rec/share/xyz';
    mockSupabase(ACCESO, [], RECS, { data: conLink, error: null });
    let modal = await abrirMuro();
    expect(modal.innerHTML).not.toMatch(/zoom\.us/i);

    document.body.innerHTML = '';
    delete window.MaestroWebGate;
    mockSupabase(ACCESO, [], RECS, { data: Object.assign({}, conLink, { staff: true }), error: null });
    modal = await abrirMuro();
    const a = modal.querySelectorAll('#webGrabList a');
    expect(a.length).toBe(1);
    expect(a[0].getAttribute('href')).toBe('https://us02web.zoom.us/rec/share/xyz');
  });

  it('(d) cualquier otro error → «No pudimos cargar tus grabaciones» + reintentar (no lista vacía, no tabla)', async () => {
    let n = 0;
    const ll = mockSupabase(ACCESO, ['membresia_119'], RECS, () => (++n === 1
      ? { data: null, error: { code: '57014', message: 'canceling statement due to statement timeout' }, status: 500 }
      : { data: NUEVA, error: null }));
    const modal = await abrirMuro();
    expect(modal.textContent).toContain('No pudimos cargar tus grabaciones');
    expect(ll.from).toBe(0);
    const btn = document.getElementById('webGrabRetry');
    expect(btn).not.toBeNull();
    btn.click();
    await flush();
    expect(ll.mis).toBe(2);
    expect(modal.querySelectorAll('#webGrabList .web-grab-fila').length).toBe(2);
  });

  it('(d) el 2º argumento de then() (rechazo) también da reintentar', async () => {
    mockSupabase(ACCESO, ['membresia_119'], RECS);
    window.supabaseClient.rpc = (name) => (name === 'web_access_check'
      ? th({ data: ACCESO })
      : { then: (ok, err) => { err(new Error('Failed to fetch')); } });
    const modal = await abrirMuro();
    expect(modal.textContent).toContain('No pudimos cargar tus grabaciones');
    expect(document.getElementById('webGrabRetry')).not.toBeNull();
  });

  it('quien paga normal NO ve la pantalla de grabaciones', async () => {
    mockSupabase({ access: true, reason: 'paid' }, ['membresia_119'], RECS);
    loadScript('js/web-access-gate.js');
    window.MaestroWebGate.check(true);
    await flush();
    expect(document.getElementById('webGrabacionesModal')).toBeNull();
    expect(document.getElementById('webAccessGateModal')).toBeNull();
  });

  it('sin pago sigue viendo el muro de siempre', async () => {
    mockSupabase({ access: false, reason: 'no_payment' }, [], RECS);
    loadScript('js/web-access-gate.js');
    window.MaestroWebGate.check(true);
    await flush();
    expect(document.getElementById('webAccessGateModal')).not.toBeNull();
    expect(document.getElementById('webGrabacionesModal')).toBeNull();
  });
});
