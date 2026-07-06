create table if not exists park_reports (
  id uuid primary key default gen_random_uuid(),
  employee_name text not null,
  park_name text not null,
  priority text not null default 'Medium',
  description text not null,
  photo_url text,
  status text not null default 'Open',
  completed_by text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create index if not exists idx_park_reports_status on park_reports(status);
create index if not exists idx_park_reports_created_at on park_reports(created_at desc);
