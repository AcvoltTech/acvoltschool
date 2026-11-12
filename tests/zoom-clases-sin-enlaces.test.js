// 12-nov-2026 · Pantalla «Clases de Zoom» (zoomClassesScreen) sin enlaces para quien no es personal.
// js/crm/zoom-recordings.js + js/crm/zm-navigation.js usan MaestroZoomSeguro (js/web-access-gate.js).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadScript } from './setup.js';

const tick = () => new Promise((r) => setTimeout(r, 0));
const flush = async () => { for (let i = 0; i < 12; i++) await tick(); };
const th = (v) => ({ then: (ok) => { ok(v); return th(v); } });

const SESION = { data: { session: { access_token: 'jwt-9', user: { email: 'alumno@ejemplo.com', user_metadata: {} } } } };
const NO_EXISTE = { data: null, error: { code: 'PGRST202', message: 'not found' }, status: 404 };
const NUEVA = {
  sesion: true, staff: false,
  grabaciones: [
    { id: 'zr_1', fecha: '2026-11-08', titulo: 'Sábado 7 AM', categoria: 'Teoría', dia: 'Sábado', minutos: 240, stream: 'aaaabbbbccccddddaaaabbbbccccdddd', pronto: false },
    { id: 'zr_2', fecha: '2026-11-09', titulo: 'Domingo 7 AM', categoria: 'Teoría', dia: 'Domingo', minutos: 230, stream: null, pronto: true },
  ],
};
const MASTER = [
  { id: 'zr_1', date: '2026-11-08', title: 'Sábado 7 AM', link: 'https://us02web.zoom.us/rec/share/uno', groups: ['membresia_119'] },
  { id: 'zr_3', date: '2026-11-01', title: 'Todos', link: 'https://us02web.zoom.us/rec/share/tres', groups: [] },
];

function mockSb(misResp) {
  const ll = { from: 0 };
  window.supabaseClient = {
    auth: { getSession: () => Promise.resolve(SESION), signOut: () => {} },
    rpc: (name) => {
      if (name === 'zoom_mis_grabaciones') return th(typeof misResp === 'function' ? misResp() : misResp);
      if (name === 'web_access_check') return th({ data: { access: true } });
      return th({ data: null });
    },
    from: () => {
      ll.from++;
      return { select: () => ({ eq: (c, id) => {
        const r = { data: id === 'master' ? { data: JSON.stringify(MASTER) } : null, error: null };
        return { single: () => Promise.resolve(r), maybeSingle: () => Promise.resolve(r) };
      } }) };
    },
  };
  return ll;
}

function pantalla() {
  document.body.innerHTML =
    '<div id="zoomClassesScreen"><div id="zoomVerifyGate"></div><div id="zoomRecordingsList">' +
    '<input id="zoomSearchInput"><div id="zoomRecordingsContainer"></div><span id="zoomTotalCount"></span></div></div>';
}

function cargar() {
  globalThis._t = (k, f) => (f !== undefined ? f : k);
  globalThis._escHtml = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  globalThis.showScreen = () => {};
  loadScript('js/web-access-gate.js');
  loadScript('js/crm/zoom-recordings.js');
  loadScript('js/crm/zm-navigation.js');
}

describe('zoomClassesScreen · sin enlaces', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval'] });
    localStorage.clear();
    sessionStorage.clear();
    delete globalThis.isAdminAuthenticated;
    delete globalThis.isAdminStudent;
    delete window.MaestroZoomSeguro;
    pantalla();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it('alumno con RPC nueva: no lee la tabla, borra la caché con enlaces, no pinta zoom.us y muestra «Disponible pronto»', async () => {
    localStorage.setItem('maestroac_zoom_recs', JSON.stringify(MASTER));
    localStorage.setItem('maestroac_zoom_verified', JSON.stringify([{ email: 'otro@x.com' }]));
    const ll = mockSb({ data: NUEVA, error: null });
    cargar();
    await refreshZoomFromSupabase();
    expect(ll.from).toBe(0);
    expect(localStorage.getItem('maestroac_zoom_recs')).toBeNull();
    expect(localStorage.getItem('maestroac_zoom_verified')).toBeNull();
    updateZoomCardCounts();
    expect(document.getElementById('zoomTotalCount').textContent).toBe('2');
    renderZoomRecordings();
    const html = document.getElementById('zoomRecordingsContainer').innerHTML;
    expect(html).not.toMatch(/zoom\.us/i);
    expect(html).toContain('⏳ Disponible pronto');
    expect(html).toContain("openZoomRec('zr_1')");
    expect(html).not.toContain("openZoomRec('zr_2')");
  });

  it('openZoomRec reproduce EN LA PÁGINA (nunca window.open) y la que no tiene copia dice «Disponible pronto»', async () => {
    mockSb({ data: NUEVA, error: null });
    window.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ token: 'tokABC' }) });
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => null);
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    cargar();
    await refreshZoomFromSupabase();
    openZoomRec('zr_1');
    await flush();
    const ov = document.getElementById('zoomPlayerOverlay');
    expect(ov).not.toBeNull();
    expect(ov.querySelector('iframe').src.indexOf('https://customer-ehgr1pt7ma9kf78k.cloudflarestream.com/tokABC/iframe?')).toBe(0);
    expect(ov.querySelector('.mh-zoom-marca').textContent).toContain('alumno@ejemplo.com');
    openZoomRec('zr_2');
    expect(alerta).toHaveBeenCalledWith('⏳ Disponible pronto');
    expect(abrir).not.toHaveBeenCalled();
  });

  it('RPC inexistente → camino viejo (tabla + filtro por grupos), como hoy', async () => {
    const ll = mockSb(NO_EXISTE);
    cargar();
    await refreshZoomFromSupabase();
    expect(ll.from).toBeGreaterThan(0);
    renderZoomRecordings();
    const html = document.getElementById('zoomRecordingsContainer').innerHTML;
    // sin grupos en este aparato → solo la de «todos» (zr_3)
    expect(html).toContain("openZoomRec('zr_3')");
    expect(html).not.toContain("openZoomRec('zr_1')");
  });

  it('error de la RPC → aviso + reintentar (ni lista vacía muda ni tabla)', async () => {
    let n = 0;
    const ll = mockSb(() => (++n === 1 ? { data: null, error: { code: '57014', message: 'timeout' }, status: 500 } : { data: NUEVA, error: null }));
    cargar();
    await refreshZoomFromSupabase();
    expect(ll.from).toBe(0);
    updateZoomCardCounts();
    const cont = document.getElementById('zoomRecordingsContainer');
    expect(cont.textContent).toContain('No pudimos cargar tus grabaciones');
    expect(cont.querySelector('button').getAttribute('onclick')).toBe('_zoomReintentar()');
    _zoomReintentar();
    await flush();
    expect(cont.innerHTML).toContain("openZoomRec('zr_1')");
  });

  it('admin del CRM sigue igual: lee la tabla y su caché no se borra', async () => {
    globalThis.isAdminAuthenticated = () => true;
    localStorage.setItem('maestroac_zoom_recs', JSON.stringify(MASTER));
    const ll = mockSb({ data: Object.assign({}, NUEVA, { staff: false }), error: null });
    cargar();
    await refreshZoomFromSupabase();
    expect(ll.from).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem('maestroac_zoom_recs')).length).toBe(2);
  });
});
