create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  employee_name text not null,
  park text not null,
  category text not null,
  priority text default 'Medium',
  asset text,
  description text not null,
  photo_url text,
  photo_path text,
  status text default 'Open',
  gps_lat double precision,
  gps_lng double precision,
  gps_accuracy double precision,
  completed_by text,
  completed_at timestamp with time zone
);

alter table reports enable row level security;

create policy "Anyone can insert reports"
on reports for insert
to anon
with check (true);

create policy "Anyone can read reports"
on reports for select
to anon
using (true);

create policy "Anyone can update reports"
on reports for update
to anon
using (true);

create policy "Anyone can delete reports"
on reports for delete
to anon
using (true);

/*
Create a public storage bucket named:
report-photos

In Supabase:
Storage > New bucket > report-photos > Public bucket ON
*/
