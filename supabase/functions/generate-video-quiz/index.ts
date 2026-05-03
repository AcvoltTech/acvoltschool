// Edge Function: generate-video-quiz
// Generates 5 AI quiz questions for Acvolt.school video lessons
// Deploy: cd maestroac-app && npx supabase functions deploy generate-video-quiz --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 10 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');

    const { title, description, courseName } = await req.json();
    if (!title) return jsonResponse({ error: 'title is required' }, 400);

    const context = [
      `Título de la lección: ${title}`,
      courseName ? `Curso: ${courseName}` : '',
      description ? `Descripción: ${description}` : '',
    ].filter(Boolean).join('\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: `Eres un experto en HVAC/Refrigeración/Aire Acondicionado. Genera exactamente 5 preguntas de opción múltiple en español basadas en el tema de la lección. Cada pregunta debe tener 4 opciones y solo 1 correcta. Las preguntas deben ser técnicas y educativas — que el estudiante aprenda algo al contestarlas.

REGLAS:
- Preguntas 100% en español
- Relacionadas directamente al tema de la lección
- Nivel técnico apropiado para estudiantes de HVAC
- Las opciones incorrectas deben ser plausibles (no obviamente mal)
- Incluye una explicación breve de por qué la respuesta es correcta

Responde SOLO con un JSON array válido, sin texto adicional ni markdown:
[{"q":"pregunta","opts":["A","B","C","D"],"ans":0,"exp":"explicación"}]

Donde "ans" es el índice (0-3) de la opción correcta.`,
        messages: [{ role: 'user', content: context }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error('Anthropic API error: ' + response.status + ' - ' + errText);
    }

    const result = await response.json();
    const text = result.content?.[0]?.text || '';

    // Parse JSON from response (handle possible markdown wrapping)
    let questions;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return jsonResponse({ error: 'Failed to parse AI response', raw: text }, 500);
    }

    // Validate structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return jsonResponse({ error: 'No questions generated' }, 500);
    }

    return jsonResponse({ questions });
  } catch (error) {
    console.error('generate-video-quiz error:', error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});
