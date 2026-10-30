-- Ejecuta este script en Supabase: SQL Editor → New query → Run.

-- Lotes: el sitio lee estado, precio y superficie de aquí.
-- La forma de cada lote en el plano vive en el código (src/lib/lotes.ts).
create table if not exists public.lotes (
  numero text primary key,
  estado text not null default 'disponible'
    check (estado in ('disponible', 'apartado', 'vendido')),
  precio numeric not null,
  area numeric not null,
  actualizado_en timestamptz not null default now()
);

-- Prospectos: lo que llena la gente en el formulario de contacto.
create table if not exists public.prospectos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  correo text,
  lote text,
  mensaje text,
  creado_en timestamptz not null default now()
);

alter table public.lotes enable row level security;
alter table public.prospectos enable row level security;

-- Cualquier visitante puede ver los lotes.
create policy "lotes_lectura_publica" on public.lotes
  for select using (true);

-- Cualquier visitante puede enviar un prospecto, pero no leerlos.
create policy "prospectos_insertar_publico" on public.prospectos
  for insert with check (true);

-- Solo administradores autenticados editan lotes y leen prospectos.
create policy "lotes_admin_escritura" on public.lotes
  for all to authenticated using (true) with check (true);

create policy "prospectos_admin_lectura" on public.prospectos
  for select to authenticated using (true);
