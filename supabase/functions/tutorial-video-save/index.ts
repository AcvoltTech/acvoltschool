// tutorial-video-save — Guarda ediciones de videos tutoriales (título/descripción/transcript/etc.)
// con SERVICE ROLE → salta RLS, sesión de admin y rol. Resuelve el bug de 4 semanas donde el
// editor (Manuel) cambiaba título/descr/transcript y "se revertía". Mario 2026-07-01.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Solo estas columnas se pueden editar desde el CRM (whitelist de seguridad).
const ALLOW = ["title", "description", "category", "required_tier", "sort_order",
  "transcript", "learning_objectives", "target_audience", "reinforced_areas",
  "quiz_questions", "quiz_passing_score", "active", "subtitle_url_en",
  "thumbnail_url", "video_url", "duration_seconds"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const J = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(url, svc);

    const body = await req.json().catch(() => ({}));
    const id = body && body.id;
    const updates = (body && body.updates) || {};
    const adminEmail = (body && body.admin_email) || "";
    console.log("[tvsave] id:", id, "| admin:", adminEmail, "| campos:", Object.keys(updates).join(","));

    if (!id) return J({ error: "Falta el id del video." }, 400);
    if (!updates || !Object.keys(updates).length) return J({ error: "No hay cambios que guardar." }, 400);

    // Aviso (no bloqueante) si el email no está en admin_staff activo — para el log.
    if (adminEmail) {
      const { data: adm } = await sb.from("admin_staff").select("rol").ilike("email", adminEmail).eq("activo", true).maybeSingle();
      console.log("[tvsave] admin_staff:", adm ? ("rol=" + adm.rol) : "NO ENCONTRADO (guardando igual con service role)");
    }

    // Filtrar a columnas permitidas.
    const upd: Record<string, unknown> = {};
    for (const k of Object.keys(updates)) if (ALLOW.indexOf(k) >= 0) upd[k] = updates[k];
    if (!Object.keys(upd).length) return J({ error: "Ningún campo válido para guardar." }, 400);

    const { data, error } = await sb.from("tutorial_videos").update(upd).eq("id", id).select("id,title");
    if (error) { console.log("[tvsave] ERROR:", error.message); return J({ error: error.message }, 400); }
    if (!data || !data.length) { console.log("[tvsave] 0 filas — id no existe:", id); return J({ error: "No se encontró el video (id " + id + ")." }, 404); }

    console.log("[tvsave] ✅ GUARDADO id:", id, "| title:", data[0].title);
    return J({ ok: true, saved: data[0], fields: Object.keys(upd) });
  } catch (e) {
    console.log("[tvsave] EXCEPTION:", String(e && (e as Error).message || e));
    return J({ error: String(e && (e as Error).message || e) }, 500);
  }
});
