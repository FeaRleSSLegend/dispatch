create table if not exists incidents (
  id text primary key,
  category text not null,
  severity text not null,
  status text not null default 'new',
  routed_to text not null,
  report text not null,
  redacted text not null,
  entities jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  duplicate_of text,
  score numeric,
  department text not null
);

create index if not exists incidents_submitted_at_idx on incidents (submitted_at desc);
create index if not exists incidents_severity_idx on incidents (severity);
create index if not exists incidents_status_idx on incidents (status);