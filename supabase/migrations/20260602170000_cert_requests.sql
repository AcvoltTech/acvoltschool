-- Examen Final de Certificación HVACR — solicitudes de certificado pendientes de firma.
-- Mario 2026-06-02. El técnico pasa el examen final (>=80%) → solicitud 'pending'
-- → el Director la firma en el CRM (edge fn cert-request) → 'signed'.
-- RLS habilitada SIN policies: nadie (anon/authenticated) accede; solo el service
-- role (la edge function cert-request) lee/escribe. Protege el PII (emails).

create table if not exists public.cert_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  cert_id text unique not null,
  name text not null,
  email text,
  score int,
  lang text default 'es',
  exam text default 'final',
  title text,
  zones jsonb,
  status text default 'pending',   -- pending | signed
  signed_at timestamptz,
  signed_by text
);

alter table public.cert_requests enable row level security;
