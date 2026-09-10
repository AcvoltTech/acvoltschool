// Edge Function: admin-data
// Returns full admin data (users, progress, certificates, quiz_attempts) using service role key (bypasses RLS)
// Deploy: npx supabase functions deploy admin-data --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
  'https://www.maestrohvacr.com',
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvolttech.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];
let corsHeaders: Record<string, string> = {};
function initCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 15 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');

    const sb = createClient(SB_URL, SB_KEY);

    const { admin_email, action } = await req.json();

    // Verify admin via JWT (primary) or fallback (body email + apikey)
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) {
      return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }
    const emailLower = auth.email;
    const adminRole = auth.role;
    // Role-based read access: editor and tecnico_video cannot access full data
    const DATA_READ_ROLES = new Set(['master', 'student_success']);
    if (!DATA_READ_ROLES.has(adminRole)) {
      console.warn('[admin-data] Role "' + adminRole + '" not authorized for action "' + action + '" by:', emailLower);
      return json({ error: 'Insufficient role for data access' }, 403);
    }

    // ── Paginated fetch helper (bypasses 1000-row default) ──
    // 🪤 Tres fugas que tenía este ayudante (arregladas 10-sep-2026):
    //  1) NO leía `error`. supabase-js NUNCA lanza: una página rechazada devolvía
    //     `data:null` → `batch = []` → `more = false`, y la función regresaba una
    //     lista CORTA como si ya no hubiera filas. Un fallo se veía idéntico a
    //     "se acabaron los datos". Ahora truena con el nombre de la tabla.
    //  2) Sin `orderCol` paginaba SIN ORDER BY. Postgres no garantiza el mismo orden
    //     entre consultas, así que las páginas se traslapan: unas filas salían dos
    //     veces y otras nunca. `user_progress` y `certificates` se piden justo así.
    //     Ahora SIEMPRE se desempata por `id`, que es único.
    //  3) Sin freno: una tabla que crece durante el barrido daba bucle infinito.
    async function fetchAllRows(table: string, selectCols: string, orderCol?: string, asc = false) {
      const all: any[] = [];
      let offset = 0;
      const PAGE = 1000;
      const MAX_PAGES = 500;   // freno: 500k filas
      for (let page = 0; page < MAX_PAGES; page++) {
        let q = sb.from(table).select(selectCols);
        if (orderCol) q = q.order(orderCol, { ascending: asc });
        // 🔑 Desempate estable. Sin esto el paginado repite y salta filas.
        q = q.order('id', { ascending: true });
        const { data, error } = await q.range(offset, offset + PAGE - 1);
        if (error) {
          throw new Error('fetchAllRows(' + table + ') falló en la fila ' + offset + ': ' + (error.message || 'consulta rechazada'));
        }
        const batch = data || [];
        all.push(...batch);
        if (batch.length < PAGE) return all;
        offset += PAGE;
      }
      console.warn('[admin-data] ' + table + ': se alcanzó el tope de ' + (MAX_PAGES * PAGE) + ' filas; la lista va INCOMPLETA.');
      return all;
    }

    // ── Action: technicians (full admin data load) ──
    if (action === 'technicians') {
      const [users, progress, certs, attempts] = await Promise.all([
        fetchAllRows('users', 'id, nombre, email, telefono, fecha_registro, ultimo_acceso, nivel_actual, technician_number, technician_number_date', 'fecha_registro'),
        fetchAllRows('user_progress', '*'),
        fetchAllRows('certificates', '*'),
        // 🔴 `.limit(5000)` era DECORATIVO: el tope de 1,000 filas lo pone el servidor
        // (max_rows), no el cliente. Hoy no se notaba porque `quiz_attempts` tenía 44
        // filas —congeladas desde el 2026-03-19 porque cada insert moría con un 400
        // silencioso (columna `server_verified` inexistente, ver js/supabase-init.js).
        // Ese insert YA quedó arreglado hoy, así que la tabla vuelve a crecer y este
        // tope se convierte en bomba de tiempo: al pasar de 1,000 intentos el panel de
        // técnicos empezaría a perder exámenes sin decir nada. Se pagina desde ahora.
        fetchAllRows('quiz_attempts', '*', 'fecha'),
      ]);

      console.log('[admin-data] technicians:', {
        users: users.length,
        progress: progress.length,
        certs: certs.length,
        attempts: attempts.length,
      });

      return json({
        users,
        user_progress: progress,
        certificates: certs,
        quiz_attempts: attempts,
      });
    }

    // ── Action: memberships ──
    if (action === 'memberships') {
      const memberships = await fetchAllRows('memberships', '*');
      console.log('[admin-data] memberships:', memberships.length);
      return json({ memberships });
    }

    // ── Action: activity_log ──
    if (action === 'activity_log') {
      const { data, error } = await sb.from('activity_log').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return json({ activity_log: data || [] });
    }

    return json({ error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    console.error('[admin-data] Error:', err);
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
