import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import bcryptjs from "https://esm.sh/bcryptjs@2.4.3";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

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

function getCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Legacy MD5 — only used for migration check
async function md5(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("MD5", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if hash is bcrypt format
function isBcrypt(hash: string): boolean {
  return hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$');
}

serve(async (req) => {
  const cors = getCors(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  // Rate limit: 10 requests per 60 seconds
  const rl = await checkRateLimit(req, { maxRequests: 10, windowSeconds: 60 });
  if (!rl.allowed) return rateLimitResponse(cors);

  try {
    const { action, username, password, email, new_password, user_id } = await req.json();
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ========== LOGIN ==========
    if (action === 'login') {
      if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Usuario y contrasena requeridos' }), { status: 400, headers: cors });
      }

      const input = username.trim().toLowerCase();
      // Sanitize input to prevent PostgREST filter injection
      // Remove characters that could break the filter syntax
      const sanitizedInput = input.replace(/[,.()'"\\\n\r]/g, '');
      if (!sanitizedInput || sanitizedInput.length < 3) {
        return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401, headers: cors });
      }
      const { data: users, error } = await sb
        .from('acvolt_school_users')
        .select('*')
        .or(`username.ilike.${sanitizedInput},email.ilike.${sanitizedInput}`);

      if (error || !users || users.length === 0) {
        // Use generic message to prevent username/email enumeration
        return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401, headers: cors });
      }

      const user = users[0];
      let passwordValid = false;
      let needsMigration = false;

      if (isBcrypt(user.password_hash)) {
        // Already bcrypt — verify directly
        passwordValid = bcryptjs.compareSync(password, user.password_hash);
      } else {
        // Legacy MD5 — verify then auto-migrate
        const hash = await md5(password);
        passwordValid = (hash === user.password_hash);
        if (passwordValid) needsMigration = true;
      }

      if (!passwordValid) {
        // Use same generic message as "user not found" to prevent enumeration
        return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401, headers: cors });
      }

      // Auto-migrate MD5 → bcrypt on successful login
      if (needsMigration) {
        try {
          const bcryptHash = bcryptjs.hashSync(password, 10);
          await sb.from('acvolt_school_users').update({ password_hash: bcryptHash }).eq('id', user.id);
          console.log('[acvolt-school-auth] Auto-migrated password to bcrypt for user:', user.email);
        } catch (e) {
          console.error('[acvolt-school-auth] Migration failed:', e);
        }
      }

      // Get profile
      const { data: profile } = await sb
        .from('acvolt_school_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: checks } = await sb
        .from('acvolt_school_checks')
        .select('course_id, lesson_id, status')
        .eq('profile_id', profile?.id || user.id);

      return new Response(JSON.stringify({
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          type: user.type,
        },
        profile: profile ? {
          name: profile.name,
          lastname: profile.lastname,
          phone: profile.phone,
        } : null,
        lessons_completed: checks?.length || 0,
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // ========== RESET PASSWORD (by email) ==========
    if (action === 'reset_password') {
      if (!email) {
        return new Response(JSON.stringify({ error: 'Email requerido' }), { status: 400, headers: cors });
      }

      // Always return the same success message regardless of whether email exists
      // This prevents email enumeration attacks
      const genericSuccessMsg = 'Si existe una cuenta con ese email, se envio una contrasena temporal';

      const { data: users } = await sb
        .from('acvolt_school_users')
        .select('id, name, email')
        .ilike('email', email.trim());

      if (!users || users.length === 0) {
        // Return same success response to prevent email enumeration
        return new Response(JSON.stringify({
          ok: true,
          message: genericSuccessMsg,
        }), { headers: { ...cors, 'Content-Type': 'application/json' } });
      }

      // Generate temporary password with cryptographic randomness
      const randomBytes = new Uint8Array(12);
      crypto.getRandomValues(randomBytes);
      const tempPass = 'Av' + [...randomBytes].map(b => b.toString(36)).join('').slice(0, 10);
      const tempHash = bcryptjs.hashSync(tempPass, 10);

      const { error: updateErr } = await sb
        .from('acvolt_school_users')
        .update({ password_hash: tempHash })
        .eq('id', users[0].id);

      if (updateErr) {
        return new Response(JSON.stringify({ error: 'Error actualizando contrasena' }), { status: 500, headers: cors });
      }

      // Email the temp password
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Maestro HVACR <noreply@maestrohvacr.com>',
              to: [users[0].email],
              subject: 'Tu contraseña temporal — ACVOLT School',
              html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:20px;">
                <h2 style="color:#f59e0b;">🔑 Contraseña Temporal</h2>
                <p>Hola <strong>${users[0].name}</strong>,</p>
                <p>Tu nueva contraseña temporal es:</p>
                <p style="font-size:24px;font-weight:bold;color:#2563eb;background:#f1f5f9;padding:12px;border-radius:8px;text-align:center;">${tempPass}</p>
                <p>Úsala para entrar y luego cámbiala desde tu perfil.</p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
                <p style="color:#94a3b8;font-size:12px;">Si no solicitaste este cambio, contacta al soporte.</p>
              </div>`,
            }),
          });
        } catch (emailErr) {
          console.error('[acvolt-school-auth] Failed to send reset email:', emailErr);
        }
      }

      return new Response(JSON.stringify({
        ok: true,
        message: genericSuccessMsg,
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // ========== CHANGE PASSWORD ==========
    if (action === 'change_password') {
      if (!user_id || !new_password) {
        return new Response(JSON.stringify({ error: 'user_id y new_password requeridos' }), { status: 400, headers: cors });
      }

      // Require current password for authentication (prevents unauthorized password changes)
      if (!password) {
        return new Response(JSON.stringify({ error: 'Contrasena actual requerida para verificacion' }), { status: 401, headers: cors });
      }

      // Verify the current password before allowing change
      const { data: currentUsers, error: fetchErr } = await sb
        .from('acvolt_school_users')
        .select('id, password_hash')
        .eq('id', user_id);

      if (fetchErr || !currentUsers || currentUsers.length === 0) {
        return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404, headers: cors });
      }

      const currentUser = currentUsers[0];
      let currentPassValid = false;
      if (isBcrypt(currentUser.password_hash)) {
        currentPassValid = bcryptjs.compareSync(password, currentUser.password_hash);
      } else {
        const currentHash = await md5(password);
        currentPassValid = (currentHash === currentUser.password_hash);
      }

      if (!currentPassValid) {
        return new Response(JSON.stringify({ error: 'Contrasena actual incorrecta' }), { status: 401, headers: cors });
      }

      // Validate new password strength
      if (new_password.length < 8) {
        return new Response(JSON.stringify({ error: 'La nueva contrasena debe tener al menos 8 caracteres' }), { status: 400, headers: cors });
      }

      const newHash = bcryptjs.hashSync(new_password, 10);
      const { error: updateErr } = await sb
        .from('acvolt_school_users')
        .update({ password_hash: newHash })
        .eq('id', user_id);

      if (updateErr) {
        return new Response(JSON.stringify({ error: 'Error actualizando contrasena' }), { status: 500, headers: cors });
      }

      return new Response(JSON.stringify({ ok: true, message: 'Contrasena actualizada' }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: cors });

  } catch (e) {
    console.error('[acvolt-school-auth] Error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: getCors(req) });
  }
});
