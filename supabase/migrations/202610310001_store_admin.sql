-- Shared CMS for two stores. No customer records or secrets in public documents.
begin;
create table if not exists public.store_admins (
  site_id text not null check (site_id in ('paradise','speed-diecast')),
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key(site_id,user_id)
);
create table if not exists public.store_documents (
  site_id text primary key check (site_id in ('paradise','speed-diecast')),
  content jsonb not null check(jsonb_typeof(content) = 'object'),
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
create table if not exists public.store_admin_emails (
  site_id text primary key check(site_id in ('paradise','speed-diecast')),
  email text not null check(email=lower(email))
);
alter table public.store_admins enable row level security;
alter table public.store_documents enable row level security;
alter table public.store_admin_emails enable row level security;
revoke all on public.store_admin_emails from anon,authenticated;
revoke all on public.store_admins, public.store_documents from anon, authenticated;
grant select on public.store_documents to anon, authenticated;
grant select on public.store_admins to authenticated;
create policy store_admins_self on public.store_admins for select to authenticated using (user_id=(select auth.uid()));
create policy store_documents_read on public.store_documents for select to anon, authenticated using (true);

create or replace function public.is_store_admin(p_site_id text)
returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(
   select 1 from auth.users u where u.id=auth.uid() and u.email_confirmed_at is not null
   and (exists(select 1 from public.store_admins a where a.user_id=u.id and a.site_id=p_site_id)
     or exists(select 1 from public.store_admin_emails a where a.email=lower(u.email) and a.site_id=p_site_id))
 );
$$;
revoke all on function public.is_store_admin(text) from public,anon;
grant execute on function public.is_store_admin(text) to authenticated;

create or replace function public.save_store_document(p_site_id text,p_content jsonb,p_revision integer)
returns public.store_documents language plpgsql security definer set search_path = '' as $$
declare result public.store_documents;
begin
  if not public.is_store_admin(p_site_id) then
    raise exception 'Acesso administrativo não autorizado' using errcode='42501';
  end if;
  if jsonb_typeof(p_content) is distinct from 'object'
    or jsonb_typeof(p_content->'loja') is distinct from 'object'
    or jsonb_typeof(p_content->'produtos') is distinct from 'array'
    or jsonb_typeof(p_content->'secoes') is distinct from 'array'
    or octet_length(p_content::text)>1000000 then
    raise exception 'Conteúdo inválido';
  end if;
  if jsonb_array_length(p_content->'produtos')>500 or jsonb_array_length(p_content->'secoes')>50 then raise exception 'Limite de conteúdo excedido'; end if;
  update public.store_documents set content=p_content,revision=revision+1,updated_at=now()
    where site_id=p_site_id and revision=p_revision returning * into result;
  if not found then raise exception 'Outra sessão atualizou o site. Recarregue antes de salvar.' using errcode='40001'; end if;
  return result;
end;
$$;
revoke all on function public.save_store_document(text,jsonb,integer) from public,anon;
grant execute on function public.save_store_document(text,jsonb,integer) to authenticated;
commit;
