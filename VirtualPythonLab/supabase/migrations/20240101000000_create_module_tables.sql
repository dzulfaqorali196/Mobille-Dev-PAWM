-- Create modules table
create table public.modules (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  type text not null check (type in ('video', 'quiz', 'practice')),
  duration text not null,
  content text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for modules
alter table public.modules enable row level security;

create policy "Modules are viewable by authenticated users"
  on public.modules for select
  to authenticated
  using (true);

-- Create trigger for modules
create trigger handle_updated_at
  before update on public.modules
  for each row
  execute function public.handle_updated_at(); 