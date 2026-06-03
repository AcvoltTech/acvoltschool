// Edge Function: translate-audio-en  (SÍNCRONA, audio chico)
// Recibe la URL de un AUDIO (extraído del video en el navegador del CRM con ffmpeg),
// lo transcribe (Deepgram ES) → traduce (Claude ES→EN) → genera la VOZ DE MARIO en
// inglés (ElevenLabs) + subtítulos WebVTT. Devuelve { audio_url_en, subtitle_url_en }.
// Como el audio es pequeño, todo cabe en una sola respuesta (<60s). El navegador
// luego pega ese audio inglés al video → MP4 para redes. Generado una vez = gratis después.
// Mario 2026-06-03. Deploy: supabase functions deploy translate-audio-en --no-verify-jwt
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
    const { audio_url: audioUrlIn, audio_b64, audio_mime, job_id, admin_email } = body;
    let audio_url = audioUrlIn;
    if (!admin_email) return json({ error: 'Authentication required' }, 401);
    const emailLower = String(admin_email).toLowerCase().trim();
    const { data: staff } = await sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
    if (!staff || staff.length === 0) {
      const { data: as2 } = await sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
      if (!as2 || as2.length === 0) return json({ error: 'Unauthorized' }, 403);
    }
    const id = String(job_id || ('job_' + Date.now()));
    // Si el CRM manda el audio en base64, lo subimos a storage (service role) y usamos esa URL.
    if (!audio_url && audio_b64) {
      const b = atob(String(audio_b64).replace(/^data:[^,]+,/, ''));
      const bytes = new Uint8Array(b.length); for (let k = 0; k < b.length; k++) bytes[k] = b.charCodeAt(k);
      const ext = String(audio_mime || '').indexOf('mp3') >= 0 ? 'mp3' : (String(audio_mime || '').indexOf('wav') >= 0 ? 'wav' : 'webm');
      const inPath = `tae-input/${id}.${ext}`;
      await sb.storage.from('school-files').upload(inPath, new Blob([bytes], { type: audio_mime || 'audio/webm' }), { contentType: audio_mime || 'audio/webm', upsert: true });
      audio_url = sb.storage.from('school-files').getPublicUrl(inPath).data.publicUrl;
    }
    if (!audio_url) return json({ error: 'audio_url o audio_b64 requerido' }, 400);

    // Job store en app_config.tae_jobs (el CRM hace polling de este estado).
    // deno-lint-ignore no-explicit-any
    async function setJob(patch: Record<string, unknown>) {
      const r = await sb.from('app_config').select('value').eq('key', 'tae_jobs').limit(1);
      let jobs: Record<string, unknown> = {};
      try { jobs = JSON.parse(r.data?.[0]?.value || '{}') || {}; } catch { jobs = {}; }
      jobs[id] = { ...(jobs[id] as object || {}), ...patch, ts: Date.now() };
      // recortar a los últimos 30 jobs
      const keys = Object.keys(jobs);
      if (keys.length > 30) { keys.sort((a, b) => ((jobs[a] as { ts: number }).ts) - ((jobs[b] as { ts: number }).ts)); keys.slice(0, keys.length - 30).forEach((k) => delete jobs[k]); }
      const ex = await sb.from('app_config').select('key').eq('key', 'tae_jobs').limit(1);
      if (ex.data && ex.data.length) await sb.from('app_config').update({ value: JSON.stringify(jobs), updated_at: new Date().toISOString() }).eq('key', 'tae_jobs');
      else await sb.from('app_config').insert({ key: 'tae_jobs', value: JSON.stringify(jobs), updated_at: new Date().toISOString() });
    }
    await setJob({ status: 'processing', error: null });

    const work = async () => { try {
    // 1. Deepgram (ES)
    const dgParams = new URLSearchParams({ model: "nova-3", language: "es", smart_format: "true", punctuate: "true", utterances: "true" });
    const dg = await fetch("https://api.deepgram.com/v1/listen?" + dgParams, { method: "POST", headers: { Authorization: "Token " + DEEPGRAM, "Content-Type": "application/json" }, body: JSON.stringify({ url: audio_url }) });
    if (!dg.ok) throw new Error("Deepgram: " + dg.status + " " + (await dg.text()).slice(0, 160));
    const dgr = await dg.json();
    const utt = dgr?.results?.utterances;
    if (!utt || !utt.length) throw new Error("No se detectó voz en el audio.");
    const segments = utt.map((u: { start: number; end: number; transcript: string }) => ({ start: u.start, end: u.end, text: u.transcript.trim() }));

    // 2. Claude (ES→EN) por lotes
    const tr: { start: number; end: number; text: string }[] = [];
    for (let i = 0; i < segments.length; i += 40) {
      const batch = segments.slice(i, i + 40);
      const numbered = batch.map((s: { text: string }, idx: number) => `${i + idx + 1}. ${s.text}`).join("\n");
      const cl = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": ANTHROPIC, "anthropic-version": "2023-06-01", "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4096, messages: [{ role: "user", content: `Translate these HVAC tutorial lines from Spanish to English. Keep the same numbered format, one line each. Preserve technical terms (superheat, subcooling, compressor, etc.). The school/brand is exactly "ACVOLT Tech School" — always write it that way, NEVER "Aceboltech", "Ace Volt", "Acebolt" or similar. Natural spoken English. Do NOT add or remove lines.\n\n${numbered}` }] }) });
      if (!cl.ok) throw new Error("Claude: " + cl.status + " " + (await cl.text()).slice(0, 160));
      const clr = await cl.json();
      const lines = (clr?.content?.[0]?.text || "").split("\n").filter((l: string) => l.trim());
      for (let j = 0; j < batch.length; j++) { const cleaned = (lines[j] || "").replace(/^\d+\.\s*/, "").trim(); tr.push({ start: batch[j].start, end: batch[j].end, text: cleaned || batch[j].text }); }
    }

    // Corrección de marca (belt-and-suspenders): variantes mal oídas → "ACVOLT Tech School".
    const fixBrand = (t: string) => t
      .replace(/ace[\s-]?bolt\s?tech(\s?school)?/gi, 'ACVOLT Tech School')
      .replace(/aceboltech/gi, 'ACVOLT Tech School')
      .replace(/ace[\s-]?volt\s?tech(\s?school)?/gi, 'ACVOLT Tech School')
      .replace(/ac[\s-]volt\s?tech(\s?school)?/gi, 'ACVOLT Tech School')
      .replace(/\bac[\s-]?volt\b/gi, 'ACVOLT');
    tr.forEach((s) => { s.text = fixBrand(s.text); });

    // 3. WebVTT
    let vtt = "WEBVTT\n\n";
    tr.forEach((s, idx) => { vtt += `${idx + 1}\n${toVtt(s.start)} --> ${toVtt(s.end)}\n${s.text}\n\n`; });
    const vttPath = `subtitles/${id}_en.vtt`;
    await sb.storage.from("school-files").upload(vttPath, new Blob([vtt], { type: "text/vtt" }), { contentType: "text/vtt", upsert: true });
    const subtitle_url_en = sb.storage.from("school-files").getPublicUrl(vttPath).data.publicUrl;

    // 4. ElevenLabs (voz de Mario en inglés)
    const fullEn = tr.map((s) => s.text).join(" ").replace(/\s+/g, " ").trim();
    const chunks = chunkText(fullEn, 2400);
    const parts: Uint8Array[] = [];
    for (const c of chunks) {
      const el = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + EL_VOICE, { method: "POST", headers: { "xi-api-key": EL_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" }, body: JSON.stringify({ text: c, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.8 } }) });
      if (!el.ok) throw new Error("ElevenLabs: " + el.status + " " + (await el.text()).slice(0, 160));
      parts.push(new Uint8Array(await el.arrayBuffer()));
    }
    let total = 0; parts.forEach((p) => total += p.length);
    const audio = new Uint8Array(total); let off = 0; parts.forEach((p) => { audio.set(p, off); off += p.length; });
    const mp3Path = `audio-en/${id}_en.mp3`;
    await sb.storage.from("school-files").upload(mp3Path, new Blob([audio], { type: "audio/mpeg" }), { contentType: "audio/mpeg", upsert: true });
    const audio_url_en = sb.storage.from("school-files").getPublicUrl(mp3Path).data.publicUrl;

    await setJob({ status: 'ready', audio_url_en, subtitle_url_en, text_en: fullEn, chars: fullEn.length, segments: tr.length, error: null });
    } catch (e) { await setJob({ status: 'error', error: String((e as Error)?.message || e).slice(0, 300) }); } };

    // @ts-ignore EdgeRuntime existe en Supabase
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(work());
    else work();
    return json({ status: 'processing', job_id: id });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
