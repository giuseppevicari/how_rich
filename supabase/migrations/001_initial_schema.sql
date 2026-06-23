-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Billionaires
create table billionaires (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  image_url  text,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- Daily wealth snapshots
create table wealth_snapshots (
  id              uuid primary key default gen_random_uuid(),
  billionaire_id  uuid not null references billionaires(id) on delete cascade,
  date            date not null,
  net_worth       numeric not null,          -- USD
  rank            integer not null,
  source          text,
  created_at      timestamptz not null default now(),
  unique(billionaire_id, date)
);

create index on wealth_snapshots(billionaire_id, date desc);

-- Comparison units
create table comparison_units (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  category    text not null check (category in ('consumer', 'asset', 'benchmark')),
  value       numeric not null,              -- USD
  icon_url    text,
  description text,
  source_url  text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Refresh job logs
create table refresh_logs (
  id           uuid primary key default gen_random_uuid(),
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  status       text not null check (status in ('success', 'failure', 'partial')),
  message      text
);
