// Edge Function: translate-video-en  (ASÍNCRONA)
// Convierte un video en español a inglés CON LA VOZ DE MARIO:
//   Deepgram (transcribe ES) → Claude (traduce ES→EN, timestamps) →
//   WebVTT (subtítulos EN) + ElevenLabs (audio EN con la voz clonada).
// Como el pipeline tarda >150s, corre en SEGUNDO PLANO (EdgeRuntime.waitUntil)
// y escribe el resultado en app_config.explicaciones[id]:
//   { en_status:'processing'|'ready'|'error', subtitle_url_en, audio_url_en }.
// El CRM hace polling de ese estado. Generado UNA vez y guardado → reuso GRATIS.
// Mario 2026-06-03. Deploy: supabase functions deploy translate-video-en --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com', 'https://www.maestrohvacr.com',
  'https://acvoltschool.com', 'https://www.acvoltschool.com',
  'https://acvoltschool.pages.dev', 'https://clon-ios-googleplay.pages.dev',
  'https://maestroac-app-clon.pages.dev', 'http://localhost:3000', 'http://127.0.0.1:5500',
];
let corsHeaders: Record<string, string> = {};
function initCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  corsHeaders = { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
}
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
function toVtt(s: number): string { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = (s % 60); return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + sec.toFixed(3).padStart(6, '0'); }
function chunkText(t: string, max: number): string[] { const out: string[] = []; let s = t.trim(); while (s.length > max) { let cut = s.lastIndexOf('. ', max); if (cut < max * 0.5) cut = s.lastIndexOf(' ', max); if (cut <= 0) cut = max; out.push(s.slice(0, cut + 1).trim()); s = s.slice(cut + 1).trim(); } if (s) out.push(s); return out; }

// deno-lint-ignore no-explicit-any
async function patchExplicacion(sb: any, id: string, patch: Record<string, unknown>) {
  const r = await sb.from('app_config').select('value').eq('key', 'explicaciones').limit(1);
  let arr: Record<string, unknown>[] = [];
  try { arr = JSON.parse(r.data?.[0]?.value || '[]'); } catch { arr = []; }
  arr = arr.map((v) => (v.id === id ? { ...v, ...patch } : v));
  await sb.from('app_config').update({ value: JSON.stringify(arr), updated_at: new Date().toISOString() }).eq('key', 'explicaciones');
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const DEEPGRAM = Deno.env.get("DEEPGRAM_API_KEY")!;
    const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY")!;
    const EL_KEY = Deno.env.get("ELEVENLABS_API_KEY")!;
    const EL_VOICE = Deno.env.get("ELEVENLABS_VOICE_ID")!;
    const SB_URL = Deno.env.get("SUPABASE_URL")!;
    const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json();
    const { video_url, video_id, admin_email, subs_only = false } = body;
    if (!admin_email) return json({ error: 'Authentication required' }, 401);
    const emailLower = String(admin_email).toLowerCase().trim();
    const { data: staff } = await sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
    if (!staff || staff.length === 0) {
      const { data: as2 } = await sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
      if (!as2 || as2.length === 0) return json({ error: 'Unauthorized' }, 403);
    }
    if (!video_url || !video_id) return json({ error: 'video_url and video_id required' }, 400);

    // Marca processing y arranca el trabajo en segundo plano.
    await patchExplicacion(sb, video_id, { en_status: 'processing', en_error: null });

    const work = (async () => {
      try {
        // 1. Deepgram (ES)
        const dgParams = new URLSearchParams({ model: "nova-3", language: "es", smart_format: "true", punctuate: "true", utterances: "true" });
        const dg = await fetch("https://api.deepgram.com/v1/listen?" + dgParams, { method: "POST", headers: { Authorization: "Token " + DEEPGRAM, "Content-Type": "application/json" }, body: JSON.stringify({ url: video_url }) });
        if (!dg.ok) throw new Error("Deepgram: " + dg.status + " " + (await dg.text()).slice(0, 200));
        const dgr = await dg.json();
        const utt = dgr?.results?.utterances;
        if (!utt || !utt.length) throw new Error("No se detectó voz en el video.");
        const segments = utt.map((u: { start: number; end: number; transcript: string }) => ({ start: u.start, end: u.end, text: u.transcript.trim() }));

        // 2. Claude (ES→EN) por lotes
        const tr: { start: number; end: number; text: string }[] = [];
        for (let i = 0; i < segments.length; i += 40) {
          const batch = segments.slice(i, i + 40);
          const numbered = batch.map((s: { text: string }, idx: number) => `${i + idx + 1}. ${s.text}`).join("\n");
          const cl = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": ANTHROPIC, "anthropic-version": "2023-06-01", "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4096, messages: [{ role: "user", content: `Translate these HVAC tutorial lines from Spanish to English. Keep the same numbered format, one line each. Preserve technical terms (superheat, subcooling, compressor, etc.). Natural spoken English. Do NOT add or remove lines.\n\n${numbered}` }] }) });
          if (!cl.ok) throw new Error("Claude: " + cl.status + " " + (await cl.text()).slice(0, 200));
          const clr = await cl.json();
          const lines = (clr?.content?.[0]?.text || "").split("\n").filter((l: string) => l.trim());
          for (let j = 0; j < batch.length; j++) { const cleaned = (lines[j] || "").replace(/^\d+\.\s*/, "").trim(); tr.push({ start: batch[j].start, end: batch[j].end, text: cleaned || batch[j].text }); }
        }
        // Corrección de marca: variantes mal oídas → "ACVOLT Tech School".
        const fixBrand = (t: string) => t.replace(/ace[\s-]?bolt\s?tech(\s?school)?/gi, 'ACVOLT Tech School').replace(/aceboltech/gi, 'ACVOLT Tech School').replace(/\bac[\s-]?volt\b/gi, 'ACVOLT');
        tr.forEach((s) => { s.text = fixBrand(s.text); });

        // 3. WebVTT
        let vtt = "WEBVTT\n\n";
        tr.forEach((s, idx) => { vtt += `${idx + 1}\n${toVtt(s.start)} --> ${toVtt(s.end)}\n${s.text}\n\n`; });
        const vttPath = `subtitles/${video_id}_en.vtt`;
        await sb.storage.from("school-files").upload(vttPath, new Blob([vtt], { type: "text/vtt" }), { contentType: "text/vtt", upsert: true });
        const subtitle_url_en = sb.storage.from("school-files").getPublicUrl(vttPath).data.publicUrl;

        const fullEn = tr.map((s) => s.text).join(" ").replace(/\s+/g, " ").trim();

        // 4. ElevenLabs (audio EN con la voz de Mario) — SOLO si no es subs_only.
        // El doblaje de voz no cuadra con la boca en videos largos; subtítulos sí.
        // Mario 2026-06-03 → subs_only = la vía recomendada (rápida, sin gastar voz).
        let audio_url_en: string | null = null;
        if (!subs_only) {
          const chunks = chunkText(fullEn, 2400);
          const parts: Uint8Array[] = [];
          for (const c of chunks) {
            const el = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + EL_VOICE, { method: "POST", headers: { "xi-api-key": EL_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" }, body: JSON.stringify({ text: c, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.8 } }) });
            if (!el.ok) throw new Error("ElevenLabs: " + el.status + " " + (await el.text()).slice(0, 200));
            parts.push(new Uint8Array(await el.arrayBuffer()));
          }
          let total = 0; parts.forEach((p) => total += p.length);
          const audio = new Uint8Array(total); let off = 0; parts.forEach((p) => { audio.set(p, off); off += p.length; });
          const mp3Path = `audio-en/${video_id}_en.mp3`;
          await sb.storage.from("school-files").upload(mp3Path, new Blob([audio], { type: "audio/mpeg" }), { contentType: "audio/mpeg", upsert: true });
          audio_url_en = sb.storage.from("school-files").getPublicUrl(mp3Path).data.publicUrl;
        }

        await patchExplicacion(sb, video_id, { en_status: 'ready', subtitle_url_en, audio_url_en, en_chars: fullEn.length, en_segments: tr.length, en_subs_only: !!subs_only });
      } catch (e) {
        await patchExplicacion(sb, video_id, { en_status: 'error', en_error: String((e as Error)?.message || e).slice(0, 300) });
      }
    })();

    // @ts-ignore EdgeRuntime existe en Supabase
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(work);
    else work; // fallback (no debería pasar en Supabase)

    return json({ status: 'processing', video_id });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
