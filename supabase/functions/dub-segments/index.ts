// Edge Function: dub-segments  (doblaje SINCRONIZADO)
// Transcribe ES con timestamps (Deepgram) → traduce ES→EN (Claude) → genera la VOZ
// DE MARIO en inglés POR SEGMENTO (ElevenLabs) → sube cada clip y devuelve
// [{idx,start,end,text_en,url}]. El cliente coloca cada clip en su segundo exacto
// (ffmpeg adelay+amix) para que el doblaje quede sincronizado con el video.
// Async (waitUntil + job store app_config.dub_jobs). Mario 2026-06-03.
// Deploy: supabase functions deploy dub-segments --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;

const ALLOWED = ['https://acvoltschool.com', 'https://www.acvoltschool.com', 'https://acvoltschool.pages.dev', 'http://localhost:3000', 'http://127.0.0.1:5500'];
let cors: Record<string, string> = {};
function initCors(req: Request) { const o = req.headers.get('origin') || ''; cors = { 'Access-Control-Allow-Origin': ALLOWED.includes(o) ? o : ALLOWED[0], 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' }; }
function json(d: unknown, s = 200) { return new Response(JSON.stringify(d), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } }); }

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const DEEPGRAM = Deno.env.get('DEEPGRAM_API_KEY')!;
    const ANTHROPIC = Deno.env.get('ANTHROPIC_API_KEY')!;
    const EL_KEY = Deno.env.get('ELEVENLABS_API_KEY')!;
    const EL_VOICE = Deno.env.get('ELEVENLABS_VOICE_ID')!;
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json();
    const { audio_b64, audio_mime, job_id, admin_email } = body;
    if (!admin_email) return json({ error: 'Authentication required' }, 401);
    const emailLower = String(admin_email).toLowerCase().trim();
    const { data: staff } = await sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
    if (!staff || staff.length === 0) {
      const { data: as2 } = await sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
      if (!as2 || as2.length === 0) return json({ error: 'Unauthorized' }, 403);
    }
    if (!audio_b64) return json({ error: 'audio_b64 requerido' }, 400);
    const id = String(job_id || ('dub_' + Date.now()));

    async function setJob(patch: Record<string, unknown>) {
      const r = await sb.from('app_config').select('value').eq('key', 'dub_jobs').limit(1);
      let jobs: Record<string, unknown> = {};
      try { jobs = JSON.parse(r.data?.[0]?.value || '{}') || {}; } catch { jobs = {}; }
      jobs[id] = { ...(jobs[id] as object || {}), ...patch, ts: Date.now() };
      const keys = Object.keys(jobs);
      if (keys.length > 20) { keys.sort((a, b) => ((jobs[a] as { ts: number }).ts) - ((jobs[b] as { ts: number }).ts)); keys.slice(0, keys.length - 20).forEach((k) => delete jobs[k]); }
      const ex = await sb.from('app_config').select('key').eq('key', 'dub_jobs').limit(1);
      if (ex.data && ex.data.length) await sb.from('app_config').update({ value: JSON.stringify(jobs), updated_at: new Date().toISOString() }).eq('key', 'dub_jobs');
      else await sb.from('app_config').insert({ key: 'dub_jobs', value: JSON.stringify(jobs), updated_at: new Date().toISOString() });
    }

    // subir el audio para Deepgram
    const bin = atob(String(audio_b64).replace(/^data:[^,]+,/, ''));
    const bytes = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
    const inPath = `dub-input/${id}.wav`;
    await sb.storage.from('school-files').upload(inPath, new Blob([bytes], { type: audio_mime || 'audio/wav' }), { contentType: audio_mime || 'audio/wav', upsert: true });
    const audio_url = sb.storage.from('school-files').getPublicUrl(inPath).data.publicUrl;

    await setJob({ status: 'processing', error: null });

    const work = async () => {
      try {
        // 1. Deepgram (ES, utterances con timestamps)
        const dgp = new URLSearchParams({ model: 'nova-3', language: 'es', smart_format: 'true', punctuate: 'true', utterances: 'true' });
        const dg = await fetch('https://api.deepgram.com/v1/listen?' + dgp, { method: 'POST', headers: { Authorization: 'Token ' + DEEPGRAM, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: audio_url }) });
        if (!dg.ok) throw new Error('Deepgram: ' + dg.status + ' ' + (await dg.text()).slice(0, 160));
        const dgr = await dg.json();
        const utt = dgr?.results?.utterances;
        if (!utt || !utt.length) throw new Error('No se detectó voz.');
        const segs = utt.map((u: { start: number; end: number; transcript: string }) => ({ start: u.start, end: u.end, text: u.transcript.trim() }));

        // 2. Claude traduce por lotes (con corrección de marca)
        const tr: { start: number; end: number; text: string }[] = [];
        for (let i = 0; i < segs.length; i += 40) {
          const batch = segs.slice(i, i + 40);
          const numbered = batch.map((s: { text: string }, idx: number) => `${i + idx + 1}. ${s.text}`).join('\n');
          const cl = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 4096, messages: [{ role: 'user', content: `Translate these HVAC tutorial lines from Spanish to English. Keep the same numbered format, one line each. Preserve technical terms. The brand is exactly "ACVOLT Tech School" (never "Aceboltech"). Natural spoken English, concise so it fits the original timing. Do NOT add or remove lines.\n\n${numbered}` }] }) });
          if (!cl.ok) throw new Error('Claude: ' + cl.status);
          const clr = await cl.json();
          const lines = (clr?.content?.[0]?.text || '').split('\n').filter((l: string) => l.trim());
          for (let j = 0; j < batch.length; j++) { const c = (lines[j] || '').replace(/^\d+\.\s*/, '').replace(/ace[\s-]?bolt\s?tech(\s?school)?/gi, 'ACVOLT Tech School').replace(/aceboltech/gi, 'ACVOLT Tech School').trim(); tr.push({ start: batch[j].start, end: batch[j].end, text: c || batch[j].text }); }
        }

        // 3. TTS por segmento (voz de Mario), en paralelo por lotes
        const out: { idx: number; start: number; end: number; text_en: string; url: string }[] = [];
        const CONC = 6;
        for (let i = 0; i < tr.length; i += CONC) {
          const slice = tr.slice(i, i + CONC);
          await Promise.all(slice.map(async (s, k) => {
            const idx = i + k;
            const el = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + EL_VOICE, { method: 'POST', headers: { 'xi-api-key': EL_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify({ text: s.text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.8 } }) });
            if (!el.ok) throw new Error('ElevenLabs seg ' + idx + ': ' + el.status);
            const buf = new Uint8Array(await el.arrayBuffer());
            const p = `dub-seg/${id}/${String(idx).padStart(3, '0')}.mp3`;
            await sb.storage.from('school-files').upload(p, new Blob([buf], { type: 'audio/mpeg' }), { contentType: 'audio/mpeg', upsert: true });
            out[idx] = { idx, start: s.start, end: s.end, text_en: s.text, url: sb.storage.from('school-files').getPublicUrl(p).data.publicUrl };
          }));
          await setJob({ status: 'processing', progress: Math.min(i + CONC, tr.length), total: tr.length });
        }
        await setJob({ status: 'ready', segments: out, total: out.length, error: null });
      } catch (e) {
        await setJob({ status: 'error', error: String((e as Error)?.message || e).slice(0, 300) });
      }
    };
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(work());
    else work();

    return json({ status: 'processing', job_id: id });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
