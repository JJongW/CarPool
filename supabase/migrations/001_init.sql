-- 311통신대대 카풀방 초기 스키마
create extension if not exists "uuid-ossp";

create type public.attendance_type as enum ('VACATION', 'OFF', 'PERSONAL_LEAVE', 'BUSINESS_TRIP');
create type public.parity_mode as enum ('ODD_ONLY', 'EVEN_ONLY', 'ALL_ALLOWED', 'NONE_ALLOWED');
create type public.request_status as enum ('WAITING', 'APPROVED', 'REJECTED', 'CANCELLED');
create type public.user_role as enum ('USER', 'ADMIN');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  unit_name text not null default '311통신대대',
  phone text,
  default_commute_time time,
  role public.user_role not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  plate_number text not null unique,
  plate_last_digit smallint not null check (plate_last_digit between 0 and 9),
  seat_capacity smallint not null check (seat_capacity between 1 and 9),
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_exceptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  attendance_type public.attendance_type not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day)
);

create table if not exists public.service_calendar (
  day date primary key,
  parity_mode public.parity_mode not null,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ride_offers (
  id uuid primary key default uuid_generate_v4(),
  day date not null,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  commute_time time not null,
  seat_capacity smallint not null check (seat_capacity between 1 and 9),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (day, driver_id)
);

create table if not exists public.ride_requests (
  id uuid primary key default uuid_generate_v4(),
  offer_id uuid not null references public.ride_offers(id) on delete cascade,
  rider_id uuid not null references public.profiles(id) on delete cascade,
  status public.request_status not null default 'WAITING',
  queue_order integer not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uniq_active_ride_request
  on public.ride_requests (offer_id, rider_id)
  where status in ('WAITING', 'APPROVED');

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_type text not null,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_attendance_exceptions_user_day on public.attendance_exceptions(user_id, day);
create index if not exists idx_ride_offers_day on public.ride_offers(day);
create index if not exists idx_ride_requests_offer_status_queue on public.ride_requests(offer_id, status, queue_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_vehicles_updated_at on public.vehicles;
create trigger trg_vehicles_updated_at before update on public.vehicles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_attendance_exceptions_updated_at on public.attendance_exceptions;
create trigger trg_attendance_exceptions_updated_at before update on public.attendance_exceptions
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_service_calendar_updated_at on public.service_calendar;
create trigger trg_service_calendar_updated_at before update on public.service_calendar
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_ride_offers_updated_at on public.ride_offers;
create trigger trg_ride_offers_updated_at before update on public.ride_offers
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_ride_requests_updated_at on public.ride_requests;
create trigger trg_ride_requests_updated_at before update on public.ride_requests
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.attendance_exceptions enable row level security;
alter table public.service_calendar enable row level security;
alter table public.ride_offers enable row level security;
alter table public.ride_requests enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'ADMIN'
  );
$$ language sql stable;

create policy "Profiles readable by authenticated users"
on public.profiles for select to authenticated using (true);

create policy "Profiles updatable by owner"
on public.profiles for update to authenticated
using (auth.uid() = id) with check (auth.uid() = id);

create policy "Profiles insert by owner"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

create policy "Vehicles CRUD by owner"
on public.vehicles for all to authenticated
using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Attendance exceptions CRUD by owner"
on public.attendance_exceptions for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Service calendar readable"
on public.service_calendar for select to authenticated using (true);

create policy "Service calendar writable by admin"
on public.service_calendar for all to authenticated
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "Ride offers readable"
on public.ride_offers for select to authenticated using (true);

create policy "Ride offers writable by driver"
on public.ride_offers for all to authenticated
using (auth.uid() = driver_id) with check (auth.uid() = driver_id);

create policy "Ride requests readable"
on public.ride_requests for select to authenticated using (true);

create policy "Ride requests insert by rider"
on public.ride_requests for insert to authenticated
with check (auth.uid() = rider_id);

create policy "Ride requests update by rider or driver"
on public.ride_requests for update to authenticated
using (
  auth.uid() = rider_id
  or exists (
    select 1 from public.ride_offers ro
    where ro.id = offer_id and ro.driver_id = auth.uid()
  )
)
with check (
  auth.uid() = rider_id
  or exists (
    select 1 from public.ride_offers ro
    where ro.id = offer_id and ro.driver_id = auth.uid()
  )
);

create policy "Audit logs insert by authenticated"
on public.audit_logs for insert to authenticated
with check (true);

create policy "Audit logs select by admin only"
on public.audit_logs for select to authenticated
using (public.is_admin(auth.uid()));
