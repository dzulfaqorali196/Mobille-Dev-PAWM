-- Create quiz table
create table public.quizzes (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  module_id bigint references public.modules(id) on delete cascade,
  questions jsonb not null,
  total_points integer not null default 0,
  passing_score integer not null default 0,
  time_limit integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create quiz progress table
create table public.quiz_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id bigint references public.quizzes(id) on delete cascade not null,
  score integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, quiz_id)
);

-- Create RLS policies
alter table public.quizzes enable row level security;
alter table public.quiz_progress enable row level security;

-- Quizzes policies
create policy "Quizzes are viewable by authenticated users"
  on public.quizzes for select
  to authenticated
  using (true);

-- Quiz progress policies
create policy "Users can view their own quiz progress"
  on public.quiz_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own quiz progress"
  on public.quiz_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own quiz progress"
  on public.quiz_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for quizzes
create trigger handle_updated_at
  before update on public.quizzes
  for each row
  execute function public.handle_updated_at(); 