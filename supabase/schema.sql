-- JARK Market production schema for Supabase Postgres.
-- Run this in the Supabase SQL Editor.
create extension if not exists pgcrypto;
create type public.user_role as enum ('customer','provider','admin');
create type public.order_status as enum ('pending','confirmed','in_progress','completed','cancelled');
create type public.payment_status as enum ('unpaid','pending','paid','failed','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  role public.user_role not null default 'customer',
  avatar_url text,
  bio text,
  location text,
  phone text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null,
  location text not null,
  price numeric(12,2) not null check(price>=0),
  unit text not null default 'project',
  description text not null default '',
  delivery text not null default '',
  tag text not null default 'New',
  verified boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,listing_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  provider_id uuid not null references public.profiles(id) on delete restrict,
  listing_id uuid not null references public.listings(id) on delete restrict,
  amount numeric(12,2) not null check(amount>=0),
  status public.order_status not null default 'pending',
  payment_method text,
  payment_status public.payment_status not null default 'unpaid',
  transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check(char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check(rating between 1 and 5),
  body text not null default '',
  created_at timestamptz not null default now()
);

create index listings_provider_idx on public.listings(provider_id);
create index listings_category_idx on public.listings(category);
create index listings_active_idx on public.listings(active);
create index orders_buyer_idx on public.orders(buyer_id);
create index orders_provider_idx on public.orders(provider_id);
create index messages_recipient_idx on public.messages(recipient_id);
create index reviews_listing_idx on public.reviews(listing_id);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$
declare requested_role text;
begin
  requested_role:=coalesce(new.raw_user_meta_data->>'role','customer');
  if requested_role not in ('customer','provider') then requested_role:='customer'; end if;
  insert into public.profiles(id,name,email,role)
  values(new.id,coalesce(new.raw_user_meta_data->>'name',split_part(coalesce(new.email,''),'@',1)),new.email,requested_role);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Safe public view: no email, phone or other private fields.
drop view if exists public.provider_public_profiles;
create view public.provider_public_profiles as
select id,name,avatar_url,bio,location,verified
from public.profiles
where role='provider';

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;

create policy "own profile read" on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update to authenticated using(id=auth.uid() or public.is_admin()) with check(id=auth.uid() or public.is_admin());

create policy "active listings readable" on public.listings for select using(active=true or provider_id=auth.uid() or public.is_admin());
create policy "providers create listings" on public.listings for insert to authenticated
with check(provider_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('provider','admin')));
create policy "owners update listings" on public.listings for update to authenticated using(provider_id=auth.uid() or public.is_admin()) with check(provider_id=auth.uid() or public.is_admin());
create policy "owners delete listings" on public.listings for delete to authenticated using(provider_id=auth.uid() or public.is_admin());

create policy "own favorites" on public.favorites for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

create policy "participants read orders" on public.orders for select to authenticated
using(buyer_id=auth.uid() or provider_id=auth.uid() or public.is_admin());

create or replace function public.create_order(p_listing_id uuid,p_payment_method text)
returns public.orders
language plpgsql security definer set search_path=public
as $$
declare l public.listings; created public.orders; public_code text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into l from public.listings where id=p_listing_id and active=true;
  if not found then raise exception 'Listing unavailable'; end if;
  if l.provider_id=auth.uid() then raise exception 'Providers cannot order their own listing'; end if;
  public_code:='JM-'||floor(extract(epoch from clock_timestamp()))::bigint;
  insert into public.orders(public_id,buyer_id,provider_id,listing_id,amount,payment_method)
  values(public_code,auth.uid(),l.provider_id,l.id,l.price,p_payment_method)
  returning * into created;
  return created;
end;
$$;

create or replace function public.update_order_status(p_order_id uuid,p_status public.order_status,p_payment_status public.payment_status default null)
returns public.orders
language plpgsql security definer set search_path=public
as $$
declare o public.orders; changed public.orders;
begin
  select * into o from public.orders where id=p_order_id;
  if not found then raise exception 'Order not found'; end if;
  if auth.uid() is null or (auth.uid()<>o.provider_id and auth.uid()<>o.buyer_id and not public.is_admin()) then
    raise exception 'Not authorized';
  end if;
  if auth.uid()=o.buyer_id and p_status not in ('cancelled','completed') then
    raise exception 'Buyer cannot set this status';
  end if;
  update public.orders set status=p_status,payment_status=coalesce(p_payment_status,payment_status),updated_at=now()
  where id=p_order_id returning * into changed;
  return changed;
end;
$$;

create policy "participants read messages" on public.messages for select to authenticated
using(sender_id=auth.uid() or recipient_id=auth.uid() or public.is_admin());
create policy "send messages" on public.messages for insert to authenticated with check(sender_id=auth.uid());
create policy "recipients update messages" on public.messages for update to authenticated
using(recipient_id=auth.uid() or public.is_admin()) with check(recipient_id=auth.uid() or public.is_admin());

create policy "reviews readable" on public.reviews for select using(true);
create policy "buyers create reviews" on public.reviews for insert to authenticated
with check(author_id=auth.uid() and exists(select 1 from public.orders o where o.id=order_id and o.buyer_id=auth.uid() and o.status='completed'));
create policy "authors update reviews" on public.reviews for update to authenticated
using(author_id=auth.uid() or public.is_admin()) with check(author_id=auth.uid() or public.is_admin());

grant select on public.provider_public_profiles to anon,authenticated;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
grant select,insert,update,delete on public.listings,public.favorites,public.messages,public.reviews to authenticated;
grant select on public.orders to authenticated;
grant execute on function public.create_order(uuid,text) to authenticated;
grant execute on function public.update_order_status(uuid,public.order_status,public.payment_status) to authenticated;
