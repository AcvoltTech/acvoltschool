// Edge Function: manage-appointments
// Handles appointment scheduling with round-robin sales rep assignment
// Deploy: supabase functions deploy manage-appointments --no-verify-jwt
//
// Required tables (run in Supabase SQL Editor):
// CREATE TABLE IF NOT EXISTS acvolt_sales_reps (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   name text NOT NULL,
//   phone text,
//   email text,
//   active boolean DEFAULT true,
//   last_assigned_at timestamptz DEFAULT '2000-01-01',
//   created_at timestamptz DEFAULT now()
// );
// CREATE TABLE IF NOT EXISTS acvolt_appointments (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   visitor_name text NOT NULL,
//   visitor_phone text NOT NULL,
//   visitor_email text,
//   preferred_date date NOT NULL,
//   preferred_time text NOT NULL,
//   notes text,
//   assigned_rep_id uuid REFERENCES acvolt_sales_reps(id),
//   assigned_rep_name text,
//   status text DEFAULT 'pendiente' CHECK (status IN ('pendiente','confirmada','completada','cancelada')),
//   created_at timestamptz DEFAULT now()
// );

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

function getCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  const cors = getCors(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { action, admin_email } = body;

    // ========== Admin auth helper ==========
    async function verifyAdmin(): Promise<boolean> {
      if (!admin_email || typeof admin_email !== 'string') return false;
      const emailLower = admin_email.toLowerCase().trim();
      const { data: staff } = await sb
        .from('admin_staff')
        .select('id')
        .eq('activo', true)
        .ilike('email', emailLower)
        .limit(1);
      return !!(staff && staff.length > 0);
    }

    // ========== CREATE APPOINTMENT (public) ==========
    if (action === 'create') {
      const { visitor_name, visitor_phone, visitor_email, preferred_date, preferred_time, notes } = body;

      if (!visitor_name || !visitor_phone || !preferred_date || !preferred_time) {
        return new Response(
          JSON.stringify({ error: 'Nombre, teléfono, fecha y hora son requeridos' }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      // Round-robin: get the rep who was least recently assigned
      const { data: reps } = await sb
        .from('acvolt_sales_reps')
        .select('id, name, phone, email')
        .eq('active', true)
        .order('last_assigned_at', { ascending: true })
        .limit(1);

      let assignedRepId = null;
      let assignedRepName = 'Sin asignar';

      if (reps && reps.length > 0) {
        assignedRepId = reps[0].id;
        assignedRepName = reps[0].name;

        // Update last_assigned_at for round-robin
        await sb
          .from('acvolt_sales_reps')
          .update({ last_assigned_at: new Date().toISOString() })
          .eq('id', assignedRepId);
      }

      // Create the appointment
      const { data: appt, error } = await sb
        .from('acvolt_appointments')
        .insert({
          visitor_name,
          visitor_phone,
          visitor_email: visitor_email || null,
          preferred_date,
          preferred_time,
          notes: notes || null,
          assigned_rep_id: assignedRepId,
          assigned_rep_name: assignedRepName,
          status: 'pendiente',
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Send email notification to assigned rep
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (RESEND_API_KEY && reps && reps.length > 0 && reps[0].email) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Maestro HVACR <noreply@maestrohvacr.com>',
              to: [reps[0].email],
              subject: '📅 Nueva Cita Programada — ' + visitor_name,
              html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:20px;">
                <h2 style="color:#2563eb;">📅 Nueva Cita Asignada</h2>
                <p>Hola <strong>${assignedRepName}</strong>,</p>
                <p>Se te ha asignado una nueva cita:</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                  <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#475569;">Visitante</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${visitor_name}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#475569;">Teléfono</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${visitor_phone}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#475569;">Email</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${visitor_email || 'N/A'}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#475569;">Fecha</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${preferred_date}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#475569;">Hora</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${preferred_time}</td></tr>
                  ${notes ? `<tr><td style="padding:8px;font-weight:600;color:#475569;">Notas</td><td style="padding:8px;">${notes}</td></tr>` : ''}
                </table>
                <p style="color:#64748b;font-size:12px;">— ACVOLT Tech School</p>
              </div>`,
            }),
          });
        } catch (emailErr) {
          console.error('[manage-appointments] Email failed:', emailErr);
        }
      }

      return new Response(
        JSON.stringify({ ok: true, appointment: appt, assigned_to: assignedRepName }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // ========== LIST APPOINTMENTS (admin) ==========
    if (action === 'list') {
      if (!(await verifyAdmin())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: admin_email required' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
      const { status, limit: lim } = body;
      let query = sb
        .from('acvolt_appointments')
        .select('*')
        .order('preferred_date', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(lim || 50);

      if (status && status !== 'todas') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ ok: true, appointments: data || [] }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // ========== UPDATE APPOINTMENT STATUS (admin) ==========
    if (action === 'update') {
      if (!(await verifyAdmin())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: admin_email required' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
      const { id, status } = body;
      if (!id || !status) {
        return new Response(
          JSON.stringify({ error: 'id y status requeridos' }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await sb
        .from('acvolt_appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // ========== ADD SALES REP (admin) ==========
    if (action === 'add_rep') {
      if (!(await verifyAdmin())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: admin_email required' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
      const { name, phone, email } = body;
      if (!name) {
        return new Response(
          JSON.stringify({ error: 'Nombre del vendedor requerido' }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await sb
        .from('acvolt_sales_reps')
        .insert({ name, phone: phone || null, email: email || null })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ ok: true, rep: data }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // ========== LIST SALES REPS (admin) ==========
    if (action === 'list_reps') {
      if (!(await verifyAdmin())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: admin_email required' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
      const { data, error } = await sb
        .from('acvolt_sales_reps')
        .select('*')
        .order('name');

      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ ok: true, reps: data || [] }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // ========== TOGGLE SALES REP ACTIVE (admin) ==========
    if (action === 'toggle_rep') {
      if (!(await verifyAdmin())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: admin_email required' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
      const { id, active } = body;
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'id requerido' }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await sb
        .from('acvolt_sales_reps')
        .update({ active: !!active })
        .eq('id', id);

      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // ========== DELETE SALES REP (admin) ==========
    if (action === 'delete_rep') {
      if (!(await verifyAdmin())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: admin_email required' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
      const { id } = body;
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'id requerido' }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await sb
        .from('acvolt_sales_reps')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('[manage-appointments] Error:', e);
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: getCors(req) }
    );
  }
});
