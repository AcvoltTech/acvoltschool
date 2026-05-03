// Edge Function: migrate-admin-passwords
// One-time utility: migrates plaintext admin passwords to PBKDF2 hashes.
// Legacy SHA-256 hashes cannot be migrated without the original password — they are logged only.
// Deploy: npx supabase functions deploy migrate-admin-passwords --no-verify-jwt
// Call: POST with Authorization header containing a shared secret or admin token

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// PBKDF2 hash — mirrors the client-side hashPasswordPBKDF2 in hash-passwords.js
async function hashPasswordPBKDF2(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hashArray = Array.from(new Uint8Array(bits));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');

    const supabase = createClient(SB_URL, SB_KEY);

    // Fetch all admin_staff rows
    const { data: allStaff, error: fetchErr } = await supabase
      .from('admin_staff')
      .select('id, email, username, password, password_hash');

    if (fetchErr) throw new Error('Failed to fetch admin_staff: ' + fetchErr.message);
    if (!allStaff || allStaff.length === 0) {
      return new Response(JSON.stringify({
        migrated: 0, legacy_sha256_remaining: 0, already_pbkdf2: 0, total: 0,
        message: 'No admin_staff rows found',
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let migrated = 0;
    let legacySha256Remaining = 0;
    let alreadyPbkdf2 = 0;
    let errors: string[] = [];

    for (const staff of allStaff) {
      const hasPlaintext = staff.password != null && staff.password.length > 0;
      const hasPbkdf2 = staff.password_hash && staff.password_hash.startsWith('pbkdf2:');

      // Already migrated to PBKDF2
      if (hasPbkdf2 && !hasPlaintext) {
        alreadyPbkdf2++;
        continue;
      }

      // Has PBKDF2 hash but still has plaintext column — just clear the plaintext
      if (hasPbkdf2 && hasPlaintext) {
        const { error: clearErr } = await supabase
          .from('admin_staff')
          .update({ password: null })
          .eq('id', staff.id);
        if (clearErr) {
          errors.push(`Failed to clear plaintext for staff id=${staff.id}: ${clearErr.message}`);
        } else {
          migrated++;
        }
        continue;
      }

      // Has plaintext password but no PBKDF2 hash — hash and migrate
      if (hasPlaintext && !hasPbkdf2) {
        const email = (staff.email || staff.username || '').toLowerCase();
        if (!email) {
          errors.push(`Staff id=${staff.id} has plaintext but no email/username — cannot generate PBKDF2 salt`);
          continue;
        }
        const salt = 'acvolt_' + email;
        const pbkdf2Hex = await hashPasswordPBKDF2(staff.password, salt);
        const pbkdf2Hash = 'pbkdf2:' + pbkdf2Hex;

        const { error: updateErr } = await supabase
          .from('admin_staff')
          .update({ password_hash: pbkdf2Hash, password: null })
          .eq('id', staff.id);

        if (updateErr) {
          errors.push(`Failed to migrate staff id=${staff.id}: ${updateErr.message}`);
        } else {
          migrated++;
          console.log(`[migrate] Migrated plaintext to PBKDF2 for staff id=${staff.id} (${email})`);
        }
        continue;
      }

      // Has a password_hash that is NOT pbkdf2 (legacy SHA-256) and no plaintext
      if (staff.password_hash && !hasPbkdf2 && !hasPlaintext) {
        legacySha256Remaining++;
        console.log(`[migrate] Legacy SHA-256 hash for staff id=${staff.id} — requires user login to auto-migrate`);
        continue;
      }

      // No password at all
      if (!hasPlaintext && !staff.password_hash) {
        errors.push(`Staff id=${staff.id} has no password or hash — account may need manual reset`);
      }
    }

    const report = {
      total: allStaff.length,
      migrated,
      legacy_sha256_remaining: legacySha256Remaining,
      already_pbkdf2: alreadyPbkdf2,
      errors: errors.length > 0 ? errors : undefined,
      message: migrated > 0
        ? `Successfully migrated ${migrated} account(s) to PBKDF2.`
        : 'No plaintext passwords found to migrate.',
    };

    return new Response(JSON.stringify(report, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[migrate-admin-passwords] Error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
