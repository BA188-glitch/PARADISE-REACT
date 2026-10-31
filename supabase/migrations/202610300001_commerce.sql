create table public.products (
 id text primary key, name text not null, amount integer not null check(amount > 0),
 currency text not null default 'brl' check(currency = 'brl'), active boolean not null default false
);
create table public.orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 product_id text not null references public.products(id), amount integer not null check(amount > 0),
 currency text not null, status text not null default 'pending' check(status in ('pending','paid')),
 request_id uuid not null, stripe_session text unique, created_at timestamptz not null default now(),
 unique(user_id, request_id)
);
alter table public.products enable row level security;
alter table public.orders enable row level security;
revoke all on public.products, public.orders from anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.orders to authenticated;
create policy catalog on public.products for select using(active);
create policy own_orders on public.orders for select to authenticated using((select auth.uid()) = user_id);
-- Prices must be explicitly configured by the owner; no invented sale prices.
insert into public.products(id,name,amount) values ('barber','PARADISE BARBER',1),('beauty','PARADISE BEAUTY',1),('food','PARADISE FOOD',1);
create function public.reserve_order(uid uuid, pid text, rid uuid) returns public.orders
language plpgsql security definer set search_path = public as $$
declare result public.orders; item public.products;
begin
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select * into result from orders where user_id=uid and request_id=rid;
 if found then
   if result.product_id <> pid then raise exception 'request conflict'; end if;
   return result;
 end if;
 if (select count(*) from orders where user_id=uid and created_at > now()-interval '1 hour') >= 10 then raise exception 'rate limit'; end if;
 select * into strict item from products where id=pid and active;
 insert into orders(user_id,product_id,amount,currency,request_id) values(uid,pid,item.amount,item.currency,rid) returning * into result;
 return result;
end $$;
revoke all on function public.reserve_order(uuid,text,uuid) from public, anon, authenticated;
grant execute on function public.reserve_order(uuid,text,uuid) to service_role;
