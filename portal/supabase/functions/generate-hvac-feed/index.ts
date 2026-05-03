// Edge Function: generate-hvac-feed
// Deploy: supabase functions deploy generate-hvac-feed
// Set secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// Supabase Project: htklsowiyjwsjnacnvnr
//
// Fetches REAL HVACR news from RSS feeds worldwide (USA, LATAM, Europe),
// translates/summarizes to Spanish via Claude, and stores with source
// attribution + link back to original article.
// Called by pg_cron daily at 7 AM CST or manually via admin dashboard.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
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
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

// ── Real HVACR news sources (global) ──
type RssSource = { name: string; url: string; region: string; lang: 'en' | 'es' };
const RSS_SOURCES: RssSource[] = [
  { name: 'ACHR News',            url: 'https://www.achrnews.com/rss/topic/2671-latest-news',     region: 'USA',    lang: 'en' },
  { name: 'Contracting Business', url: 'https://www.contractingbusiness.com/rss.xml',             region: 'USA',    lang: 'en' },
  { name: 'ACR News',             url: 'https://www.acr-news.com/rss',                            region: 'UK',     lang: 'en' },
  { name: 'Cooling Post',         url: 'https://www.coolingpost.com/feed/',                       region: 'Europe', lang: 'en' },
  { name: 'Mundo HVACR',          url: 'https://www.mundohvacr.com.mx/feed/',                     region: 'LATAM',  lang: 'es' },
  { name: 'Climatización',        url: 'https://www.climatizacion.com/feed/',                     region: 'España', lang: 'es' },
];

type FetchedItem = {
  fuente: string;
  region: string;
  lang: 'en' | 'es';
  titulo_original: string;
  resumen_original: string;
  link: string;
  pubDate: string;
};

function stripHtml(s: string): string {
  return (s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(xml: string, tag: string): string {
  // Handles <tag>...</tag> and <tag ...>...</tag> and <![CDATA[...]]>
  const re = new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + tag + '>', 'i');
  const m = xml.match(re);
  if (!m) return '';
  let v = m[1];
  const cdata = v.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  if (cdata) v = cdata[1];
  return stripHtml(v);
}

function extractLink(xml: string): string {
  // Atom: <link href="..."/>  |  RSS: <link>...</link>
  const atom = xml.match(/<link[^>]*href="([^"]+)"/i);
  if (atom) return atom[1];
  const rss = xml.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
  return rss ? stripHtml(rss[1]) : '';
}

async function fetchRss(src: RssSource, max: number): Promise<FetchedItem[]> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'MaestroHVACR/1.0 (+https://maestrohvacr.com)' },
      signal: ctrl.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    // Match both <item>...</item> (RSS) and <entry>...</entry> (Atom)
    const blocks = xml.match(/<(?:item|entry)(?:\s[^>]*)?>[\s\S]*?<\/(?:item|entry)>/gi) || [];
    const items: FetchedItem[] = [];
    for (const block of blocks.slice(0, max)) {
      const titulo = extractTag(block, 'title');
      const resumen = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content:encoded');
      const link = extractLink(block);
      const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
      if (!titulo || !link) continue;
      items.push({
        fuente: src.name,
        region: src.region,
        lang: src.lang,
        titulo_original: titulo.substring(0, 300),
        resumen_original: resumen.substring(0, 800),
        link,
        pubDate,
      });
    }
    return items;
  } catch (e) {
    console.warn('RSS fetch failed:', src.name, (e as Error).message);
    return [];
  }
}

function pickRecent(items: FetchedItem[], count: number): FetchedItem[] {
  // Sort by pubDate desc, fall back to fetched order
  const withDate = items.map((it) => ({ it, t: Date.parse(it.pubDate) || 0 }));
  withDate.sort((a, b) => b.t - a.t);
  // Round-robin across sources so no single outlet dominates
  const bySource = new Map<string, FetchedItem[]>();
  for (const { it } of withDate) {
    if (!bySource.has(it.fuente)) bySource.set(it.fuente, []);
    bySource.get(it.fuente)!.push(it);
  }
  const picked: FetchedItem[] = [];
  const queues = Array.from(bySource.values());
  while (picked.length < count && queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      if (picked.length >= count) break;
      const next = q.shift();
      if (next) picked.push(next);
    }
  }
  return picked;
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // ── Admin / pg_cron verification ──
    let bodyEmail: string | undefined;
    if (req.method === 'POST') {
      try {
        const body = await req.clone().json();
        bodyEmail = body.admin_email;
      } catch (_) { /* empty body OK */ }
    }
    const authHeader = req.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const isServiceRole = bearerToken === supabaseServiceKey;
    if (!isServiceRole) {
      const auth = await verifyAdminAuth(req, supabase, bodyEmail);
      if (!auth.verified) {
        return new Response(
          JSON.stringify({ error: auth.error || 'Unauthorized' }),
          { status: auth.status || 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const today = new Date().toISOString().split('T')[0];

    // Clear today's entries (idempotent)
    await supabase.from('hvac_daily_feed').delete().eq('feed_date', today);

    // ── Fetch all RSS sources in parallel ──
    const fetched = (await Promise.all(RSS_SOURCES.map((s) => fetchRss(s, 8)))).flat();
    if (fetched.length === 0) {
      throw new Error('No RSS items fetched from any source');
    }

    // Pick top 6 freshest, balanced across sources
    const picked = pickRecent(fetched, 6);

    // ── Claude translates + summarizes to Spanish ──
    const itemsForAI = picked.map((it, i) => ({
      id: i,
      fuente: it.fuente,
      region: it.region,
      lang: it.lang,
      titulo: it.titulo_original,
      resumen: it.resumen_original,
    }));

    const prompt = `Eres editor HVAC para "Maestro HVACR", una app para técnicos hispanos en USA y LATAM.

Te paso ${itemsForAI.length} artículos reales de noticias HVACR globales (USA, Europa, LATAM). Para cada uno:
1. Traduce el título al español (máx 70 caracteres, atractivo pero preciso)
2. Escribe un resumen de 2 frases en español (máx 240 caracteres) con lo MÁS RELEVANTE para un técnico de campo
3. Asigna categoría y emoji
4. NO inventes datos que no estén en el texto. Si falta contexto, mantén el resumen genérico pero fiel.

Artículos:
${JSON.stringify(itemsForAI, null, 2)}

Responde SOLO con un JSON array. Cada objeto:
{
  "id": <mismo id del input>,
  "titulo": "título en español, máx 70 chars",
  "contenido": "resumen 2 frases en español, máx 240 chars",
  "categoria": "una de: Regulaciones, Refrigerantes, Tecnología, Seguridad, Eficiencia, Mercado, Herramientas, Innovación, Código",
  "icono": "un emoji relevante"
}

Solo el JSON array, nada más.`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      throw new Error('Anthropic API error: ' + anthropicResponse.status + ' - ' + errText);
    }

    const aiResult = await anthropicResponse.json();
    const aiText = aiResult.content[0].text;

    let aiItems: Array<{ id: number; titulo: string; contenido: string; categoria: string; icono: string }>;
    try {
      const cleaned = aiText.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '');
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      aiItems = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch (parseError) {
      throw new Error('Failed to parse AI response: ' + (parseError as Error).message);
    }
    if (!Array.isArray(aiItems) || aiItems.length === 0) {
      throw new Error('AI did not return valid items array');
    }

    function sanitizeText(s: string, maxLen: number): string {
      if (!s || typeof s !== 'string') return '';
      return s.replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').substring(0, maxLen).trim();
    }
    function sanitizeEmoji(s: string): string {
      if (!s || typeof s !== 'string') return '';
      return s.replace(/<[^>]*>/g, '').replace(/[a-zA-Z0-9]{3,}/g, '').substring(0, 8).trim();
    }
    function sanitizeUrl(s: string): string {
      if (!s || typeof s !== 'string') return '';
      const trimmed = s.trim();
      if (!/^https?:\/\//i.test(trimmed)) return '';
      return trimmed.substring(0, 500);
    }

    // Merge AI output with original source metadata (fuente, link, region)
    const rowsToInsert = aiItems
      .map((ai) => {
        const src = picked[ai.id];
        if (!src) return null;
        return {
          feed_date: today,
          tipo: 'noticia',
          titulo: sanitizeText(ai.titulo, 100) || sanitizeText(src.titulo_original, 100) || 'Sin título',
          contenido: sanitizeText(ai.contenido, 500) || sanitizeText(src.resumen_original, 500),
          categoria: sanitizeText(ai.categoria, 50) || 'Industria',
          icono: sanitizeEmoji(ai.icono) || '📰',
          fuente: sanitizeText(src.fuente, 80),
          fuente_url: sanitizeUrl(src.link),
          region: sanitizeText(src.region, 40),
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (rowsToInsert.length === 0) {
      throw new Error('No valid rows to insert after AI merge');
    }

    const { data: inserted, error: insertError } = await supabase
      .from('hvac_daily_feed')
      .insert(rowsToInsert)
      .select();

    if (insertError) {
      throw new Error('Failed to insert feed items: ' + insertError.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        date: today,
        itemsGenerated: inserted?.length || 0,
        sourcesFetched: RSS_SOURCES.length,
        items: inserted
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
