-- BrickCitySwap — Initial Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 1. TABLES                                                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Schools / college communities
create table if not exists public.schools (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  short_name text not null,
  domain     text not null unique,
  created_at timestamptz not null default now()
);

-- User profiles (linked to Supabase auth.users)
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null,
  full_name         text not null,
  school_id         uuid references public.schools(id),
  avatar_url        text,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'poster', 'premium')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Listings (housing + marketplace in one table)
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  school_id   uuid references public.schools(id),
  type        text not null check (type in ('housing', 'marketplace')),
  title       text not null,
  description text not null,
  price       numeric not null check (price >= 0),
  status      text not null default 'available'
    check (status in ('available', 'pending', 'sold')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- Housing-specific (nullable for marketplace)
  location             text,
  bedrooms             integer,
  bathrooms             numeric,
  available_from       date,
  available_to         date,
  gender_pref          text check (gender_pref in ('any', 'male', 'female') or gender_pref is null),
  housing_type         text,
  distance_from_campus numeric,

  -- Marketplace-specific (nullable for housing)
  category  text,
  condition text check (condition in ('new', 'like-new', 'good', 'fair', 'poor') or condition is null)
);

-- Listing images
create table if not exists public.listing_images (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url        text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

-- Saved / favorited listings
create table if not exists public.saved_listings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 2. INDEXES                                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create index if not exists idx_listings_type on public.listings(type);
create index if not exists idx_listings_user on public.listings(user_id);
create index if not exists idx_listings_school on public.listings(school_id);
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listing_images_listing on public.listing_images(listing_id);
create index if not exists idx_saved_listings_user on public.saved_listings(user_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 3. ROW LEVEL SECURITY                                                  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Enable RLS on all tables
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.saved_listings enable row level security;

-- Schools: readable by everyone
create policy "Schools are viewable by everyone"
  on public.schools for select using (true);

-- Profiles: viewable by everyone, editable by owner
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Listings: viewable by everyone, managed by owner
create policy "Listings are viewable by everyone"
  on public.listings for select using (true);

create policy "Authenticated users can create listings"
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Users can update their own listings"
  on public.listings for update using (auth.uid() = user_id);

create policy "Users can delete their own listings"
  on public.listings for delete using (auth.uid() = user_id);

-- Listing images: viewable by everyone, managed by listing owner
create policy "Listing images are viewable by everyone"
  on public.listing_images for select using (true);

create policy "Users can add images to their listings"
  on public.listing_images for insert
  with check (
    exists (
      select 1 from public.listings
      where id = listing_id and user_id = auth.uid()
    )
  );

create policy "Users can delete images from their listings"
  on public.listing_images for delete
  using (
    exists (
      select 1 from public.listings
      where id = listing_id and user_id = auth.uid()
    )
  );

-- Saved listings: users manage their own
create policy "Users can view their own saved listings"
  on public.saved_listings for select using (auth.uid() = user_id);

create policy "Users can save listings"
  on public.saved_listings for insert with check (auth.uid() = user_id);

create policy "Users can unsave listings"
  on public.saved_listings for delete using (auth.uid() = user_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 4. AUTO-CREATE PROFILE ON SIGNUP (trigger)                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, school_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    (
      select id from public.schools
      where domain = split_part(new.email, '@', 2)
      limit 1
    )
  );
  return new;
end;
$$;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 5. STORAGE BUCKET                                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Create a public bucket for listing images
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Storage policies: anyone can view, authenticated users can upload
create policy "Anyone can view listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

create policy "Users can delete their own listing images"
  on storage.objects for delete
  using (bucket_id = 'listing-images' and auth.role() = 'authenticated');

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 6. SEED DATA                                                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Seed the first school: RIT
insert into public.schools (name, short_name, domain)
values ('Rochester Institute of Technology', 'RIT', 'rit.edu')
on conflict (domain) do nothing;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 7. MESSAGING TABLES                                                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id   uuid not null references public.profiles(id) on delete cascade,
  seller_id  uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, buyer_id, seller_id)
);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  content         text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_conversations_listing on public.conversations(listing_id);
create index if not exists idx_conversations_buyer on public.conversations(buyer_id);
create index if not exists idx_conversations_seller on public.conversations(seller_id);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Users can view their conversations"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Authenticated users can start conversations"
  on public.conversations for insert
  with check (auth.uid() = buyer_id);

create policy "Conversation participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Conversation participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations
      where id = conversation_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Conversation participants can mark messages read"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );
