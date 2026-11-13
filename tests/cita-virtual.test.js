// 13-nov-2026 · Cita virtual en 100ms: la asesora comparte pantalla; el cliente (sin cuenta) no puede.
import { describe, it, expect, vi } from 'vitest';
import { loadScript } from './setup.js';

function hmsFalso() {
  const acc = { join: vi.fn(async () => {}), leave: vi.fn(async () => {}), setLocalAudioEnabled: vi.fn(), setLocalVideoEnabled: vi.fn(), setScreenShareEnabled: vi.fn(async () => {}), attachVideo: vi.fn(), detachVideo: vi.fn() };
  let oyente = null;
  window.HMSReactiveStore = function () { this.triggerOnSubscribe = () => {}; this.getActions = () => acc; this.getStore = () => ({ subscribe: (f) => { oyente = f; } }); };
  return { acc, emitir: (s) => oyente(s) };
}

describe('cita virtual (100ms)', () => {
  it('la asesora entra con su token, ve el botón de compartir pantalla y se pegan los videos', async () => {
    const f = hmsFalso(); loadScript('js/cita-virtual.js');
    const cont = document.createElement('div'); document.body.appendChild(cont);
    await window.CitaVirtual.entrar({ contenedor: cont, token: 'tok-asesora', nombre: 'Brenda', anfitriona: true });
    expect(f.acc.join).toHaveBeenCalledWith(expect.objectContaining({ authToken: 'tok-asesora', userName: 'Brenda' }));
    const pan = [...cont.querySelectorAll('button')].find((b) => /Compartir pantalla/.test(b.textContent));
    expect(pan).toBeTruthy();
    pan.click(); await Promise.resolve();
    expect(f.acc.setScreenShareEnabled).toHaveBeenCalledWith(true);
    f.emitir({ room: { isConnected: true }, peers: { a: { id: 'a', name: 'Brenda', isLocal: true, videoTrack: 'v1', auxiliaryTracks: ['s1'] }, b: { id: 'b', name: 'Juan', videoTrack: 'v2' } },
      tracks: { v1: { id: 'v1', type: 'video', source: 'regular' }, s1: { id: 's1', type: 'video', source: 'screen' }, v2: { id: 'v2', type: 'video', source: 'regular' } } });
    expect(f.acc.attachVideo).toHaveBeenCalledTimes(3);
    expect(cont.querySelector('.cv-caja.pantalla')).not.toBeNull();
    expect(cont.textContent).toMatch(/En la reunión/);
  });
  it('el cliente no tiene botón de compartir pantalla', async () => {
    hmsFalso(); loadScript('js/cita-virtual.js');
    const cont = document.createElement('div');
    await window.CitaVirtual.entrar({ contenedor: cont, token: 'tok-invitado', nombre: 'Juan', anfitriona: false });
    expect([...cont.querySelectorAll('button')].some((b) => /Compartir pantalla/.test(b.textContent))).toBe(false);
    expect(cont.textContent).toMatch(/Conectando|Esperando/);
  });
  it('sin el programa de 100ms avisa claro', async () => {
    delete window.HMSReactiveStore; loadScript('js/cita-virtual.js');
    await expect(window.CitaVirtual.entrar({ contenedor: document.createElement('div'), token: 'x' })).rejects.toThrow(/programa de video/);
  });
});
