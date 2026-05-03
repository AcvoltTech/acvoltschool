// Edge Function: send-weekly-progress
// Sends weekly progress report emails to students via Resend
// Deploy: supabase functions deploy send-weekly-progress --no-verify-jwt

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
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 5 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing Supabase credentials');

    const bodyData = await req.json();
    const { students, subject, html_template, admin_email } = bodyData;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return jsonResponse({ error: 'students array is required' }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── Admin verification via JWT (primary) or fallback (body email + apikey) ──
    const auth = await verifyAdminAuth(req, supabase, admin_email);
    if (!auth.verified) {
      return jsonResponse({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Sanitize HTML template: strip script tags and event handlers to prevent XSS
    let safeTemplate = html_template || '<p>Hola {nombre}, aquí está tu progreso semanal.</p>';
    safeTemplate = safeTemplate
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    for (const student of students) {
      if (!student.email) { failed++; continue; }

      try {
        // Build personalized HTML — use first name only, omit email from body for privacy
        const firstName = (student.nombre || 'Estudiante').split(' ')[0];
        let personalizedHtml = safeTemplate
          .replace(/{nombre}/g, firstName)
          .replace(/{email}/g, '') // Don't embed email in HTML body for privacy
          .replace(/{progress}/g, student.progress || '—')
          .replace(/{level}/g, student.level || '—');

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + RESEND_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Maestro HVACR <noreply@maestrohvacr.com>',
            to: [student.email],
            subject: subject || '📊 Tu Progreso Semanal — ACVOLT',
            html: personalizedHtml,
          }),
        });

        if (emailRes.ok) {
          sent++;
        } else {
          failed++;
          const errText = await emailRes.text();
          errors.push(student.email + ': ' + errText);
        }
      } catch (e) {
        failed++;
        errors.push(student.email + ': ' + e.message);
      }
    }

    // Log batch result
    try {
      await supabase.from('email_logs').insert({
        type: 'weekly_progress',
        total: students.length,
        sent,
        failed,
        errors: errors.length > 0 ? errors.slice(0, 10) : null,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Could not log email batch:', e);
    }

    console.log('Weekly progress emails: sent=' + sent + ' failed=' + failed);
    // Return sanitized errors — strip email addresses to avoid leaking PII to the client
    const sanitizedErrors = errors.slice(0, 5).map(e => e.replace(/[^@\s]+@[^@\s]+/g, '[email]'));
    return jsonResponse({ success: true, sent, failed, total: students.length, errors: sanitizedErrors });
  } catch (error) {
    console.error('send-weekly-progress error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});
