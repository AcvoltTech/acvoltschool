// 2-nov-2026 · Muro web: modo «solo grabaciones» (membresia_119 sin $149).
import { describe, it, expect, beforeEach } from 'vitest';
import { loadScript } from './setup.js';

const tick = () => new Promise((r) => setTimeout(r, 0));
const flush = async () => { for (let i = 0; i < 8; i++) await tick(); };

// Builder "thenable" como el de Supabase (no es Promise real).
const th = (v) => ({ then: (ok) => { ok(v); return th(v); } });

function mockSupabase(accessResp, groups, recs) {
  window.supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: { email: 'Tec@Ejemplo.com' } } } }),
      signOut: () => {},
    },
    rpc: (name) => {
      if (name === 'web_access_check') return th({ data: accessResp });
      if (name === 'crm_mis_grupos') return th({ data: groups });
      return th({ data: null });
    },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: () => th({ data: { data: JSON.stringify(recs) } }) }) }) }),
  };
}

const RECS = [
  { id: 'a', date: '2026-10-31', day_label: 'Sábado', category: 'Manos a la Obra', duration_min: 201, link: 'https://zoom.us/rec/share/a', groups: ['trinidad', 'membresia_119'] },
  { id: 'b', date: '2026-11-01', day_label: 'Domingo', category: 'Manos a la Obra', duration_min: 219, link: 'https://zoom.us/rec/share/b', groups: ['membresia_119'] },
  { id: 'c', date: '2026-11-01', day_label: 'Domingo', category: 'Tarde', duration_min: 221, link: 'https://zoom.us/rec/share/c', groups: ['trinidad_19sep2026'] },
  { id: 'd', date: '2026-10-25', day_label: 'Sábado', link: 'javascript:alert(1)', groups: ['membresia_119'] },
  { id: 'e', date: '2026-10-24', day_label: 'Sábado', link: 'https://zoom.us/rec/share/e', groups: ['membresia_119'], visible: false },
];

describe('web-access-gate · solo grabaciones', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.MaestroWebGate;
  });

  it('membresia_119 ve SOLO sus grabaciones, la más nueva arriba, y la oferta $149.99', async () => {
    mockSupabase({ access: true, reason: 'paid', modo: 'solo_grabaciones' }, ['membresia_119'], RECS);
    loadScript('js/web-access-gate.js');
    window.MaestroWebGate.check(true);
    await flush();
    const modal = document.getElementById('webGrabacionesModal');
    expect(modal).not.toBeNull();
    expect(document.getElementById('webAccessGateModal')).toBeNull();
    const links = [...modal.querySelectorAll('#webGrabList a')].map((a) => a.getAttribute('href'));
    // b (1-nov) antes que a (31-oct); c es de otra cohorte; e está oculta; d no es https → '#'
    expect(links).toEqual(['https://zoom.us/rec/share/b', 'https://zoom.us/rec/share/a', '#']);
    expect(modal.textContent).toContain('$149.99');
    expect(modal.querySelector('a[href="https://maestrohvacr.com/estudiar"]')).not.toBeNull();
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
