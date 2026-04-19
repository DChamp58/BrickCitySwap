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

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 8. LISTING VIEWS TRACKING                                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Add view count to listings for fast reads
alter table public.listings
  add column if not exists view_count bigint not null default 0;

-- Detailed view log table
create table if not exists public.listing_views (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  viewer_id  uuid references public.profiles(id) on delete set null,
  viewed_at  timestamptz not null default now()
);

create index if not exists idx_listing_views_listing on public.listing_views(listing_id);
create index if not exists idx_listing_views_viewer on public.listing_views(viewer_id);

alter table public.listing_views enable row level security;

-- Anyone authenticated can log a view
create policy "Authenticated users can log views"
  on public.listing_views for insert
  with check (auth.uid() = viewer_id);

-- Listing owners can see who viewed their listings
create policy "Listing owners can see views"
  on public.listing_views for select
  using (
    exists (
      select 1 from public.listings
      where id = listing_id and user_id = auth.uid()
    )
  );

-- Auto-increment view_count when a view is logged
create or replace function public.increment_view_on_insert()
returns trigger as $$
begin
  update public.listings
  set view_count = view_count + 1
  where id = NEW.listing_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_increment_view_count
  after insert on public.listing_views
  for each row execute function public.increment_view_on_insert();

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ADD PROFILE FIELDS (run if upgrading an existing database)             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
alter table public.profiles
  add column if not exists year  text check (year in ('Freshman','Sophomore','Junior','Senior','Graduate','Other') or year is null),
  add column if not exists major text,
  add column if not exists bio   text;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ADD HOUSING LISTING FIELDS (run if upgrading an existing database)     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
alter table public.listings
  add column if not exists total_rooms                integer,
  add column if not exists available_rooms            integer,
  add column if not exists roommates                  integer,
  add column if not exists female_roommates           integer,
  add column if not exists male_roommates             integer,
  add column if not exists other_roommates            integer,
  add column if not exists other_roommates_spec       text,
  add column if not exists prefer_not_to_say_roommates integer;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ FIX VIEW RECORDING (run if views are always showing 0)                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- RPC function that records a view bypassing RLS (security definer)
-- This allows any visitor (logged in or not) to record a view.
create or replace function public.record_listing_view(
  p_listing_id uuid,
  p_viewer_id  uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.listing_views (listing_id, viewer_id)
  values (p_listing_id, p_viewer_id);
exception when others then
  null; -- silently ignore duplicates or constraint errors
end;
$$;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ 9. IN-APP NOTIFICATIONS                                                ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('new_message', 'listing_saved')),
  title      text not null,
  body       text not null,
  read       boolean not null default false,
  data       jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read  on public.notifications(user_id, read);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark their own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Service can insert notifications"
  on public.notifications for insert
  with check (true);

-- Trigger: new message → notify the other conversation participant
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_buyer_id          uuid;
  v_seller_id         uuid;
  v_listing_id        uuid;
  v_recipient         uuid;
  v_sender_name       text;
  v_listing_title     text;
  v_listing_image_url text;
  v_listing_location  text;
  v_conv_id           uuid;
begin
  v_conv_id := NEW.conversation_id;

  v_buyer_id      := (select buyer_id   from public.conversations where id = v_conv_id);
  v_seller_id     := (select seller_id  from public.conversations where id = v_conv_id);
  v_listing_id    := (select listing_id from public.conversations where id = v_conv_id);
  v_listing_title    := (select title    from public.listings where id = v_listing_id);
  v_listing_location := (select location from public.listings where id = v_listing_id);

  v_listing_image_url := (
    select url from public.listing_images
    where listing_id = v_listing_id
    order by position asc
    limit 1
  );

  if NEW.sender_id = v_buyer_id then
    v_recipient := v_seller_id;
  else
    v_recipient := v_buyer_id;
  end if;

  v_sender_name := (select full_name from public.profiles where id = NEW.sender_id);

  insert into public.notifications (user_id, type, title, body, data)
  values (
    v_recipient,
    'new_message',
    v_sender_name || ' sent you a message',
    left(NEW.content, 120),
    jsonb_build_object(
      'conversation_id', v_conv_id,
      'listing_title', v_listing_title,
      'listing_image_url', v_listing_image_url,
      'listing_location', v_listing_location
    )
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_new_message on public.messages;
create trigger trg_notify_new_message
  after insert on public.messages
  for each row execute function public.notify_on_new_message();

-- Trigger: listing saved → notify the listing owner
create or replace function public.notify_on_listing_saved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing_owner     uuid;
  v_listing_title     text;
  v_saver_name        text;
  v_listing_image_url text;
begin
  v_listing_owner := (select user_id from public.listings where id = NEW.listing_id);
  v_listing_title := (select title   from public.listings where id = NEW.listing_id);

  -- Don't notify if the owner is saving their own listing
  if NEW.user_id = v_listing_owner then
    return NEW;
  end if;

  v_listing_image_url := (
    select url from public.listing_images
    where listing_id = NEW.listing_id
    order by position asc
    limit 1
  );

  v_saver_name := (select full_name from public.profiles where id = NEW.user_id);

  insert into public.notifications (user_id, type, title, body, data)
  values (
    v_listing_owner,
    'listing_saved',
    v_saver_name || ' saved your listing',
    v_listing_title,
    jsonb_build_object(
      'listing_id', NEW.listing_id,
      'listing_image_url', v_listing_image_url
    )
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_listing_saved on public.saved_listings;
create trigger trg_notify_listing_saved
  after insert on public.saved_listings
  for each row execute function public.notify_on_listing_saved();
