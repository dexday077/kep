-- ============================================
-- Kepenekİnşaat Marketplace Database Schema
-- Multi-Role System: Customer, Seller, Admin
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (User Management)
-- ============================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  shop_name text, -- For sellers only
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table categories enable row level security;

create policy "Categories are viewable by everyone"
  on categories for select
  using (is_active = true);

create policy "Only admins can manage categories"
  on categories for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
create table products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) on delete cascade not null,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  description text,
  price decimal(10, 2) not null check (price >= 0),
  original_price decimal(10, 2) check (original_price >= price),
  category text not null,
  image text,
  images text[] default array[]::text[],
  rating decimal(3, 2) default 0 check (rating >= 0 and rating <= 5),
  review_count integer default 0,
  badge text,
  stock integer default 0 check (stock >= 0),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

-- Policies for products
create policy "Products are viewable by everyone"
  on products for select
  using (is_active = true);

create policy "Sellers can insert their own products"
  on products for insert
  with check (
    auth.uid() = seller_id and
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('seller', 'admin')
    )
  );

create policy "Sellers can update their own products"
  on products for update
  using (
    auth.uid() = seller_id or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Sellers can delete their own products"
  on products for delete
  using (
    auth.uid() = seller_id or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================
-- 4. RESTAURANTS TABLE
-- ============================================
create table restaurants (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  cuisine text not null,
  description text,
  rating decimal(3, 2) default 0 check (rating >= 0 and rating <= 5),
  review_count integer default 0,
  delivery_fee decimal(10, 2) default 0 check (delivery_fee >= 0),
  min_order decimal(10, 2),
  eta_minutes integer default 30,
  image text,
  promo_text text,
  badges text[] default array[]::text[],
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table restaurants enable row level security;

-- Policies for restaurants (similar to products)
create policy "Restaurants are viewable by everyone"
  on restaurants for select
  using (is_active = true);

create policy "Sellers can manage their restaurants"
  on restaurants for all
  using (
    auth.uid() = seller_id or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================
-- 5. MENU ITEMS TABLE (For Restaurants)
-- ============================================
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  title text not null,
  description text,
  price decimal(10, 2) not null check (price >= 0),
  image text,
  category text,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table menu_items enable row level security;

create policy "Menu items are viewable by everyone"
  on menu_items for select
  using (is_available = true);

-- ============================================
-- 6. ORDERS TABLE
-- ============================================
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references profiles(id) on delete set null not null,
  seller_id uuid references profiles(id) on delete set null not null,
  items jsonb not null,
  total_amount decimal(10, 2) not null check (total_amount >= 0),
  status text not null default 'pending' 
    check (status in ('pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled')),
  delivery_address text not null,
  delivery_phone text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;

-- Policies for orders
create policy "Customers can view their own orders"
  on orders for select
  using (auth.uid() = customer_id);

create policy "Sellers can view their orders"
  on orders for select
  using (auth.uid() = seller_id);

create policy "Admins can view all orders"
  on orders for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Customers can create orders"
  on orders for insert
  with check (auth.uid() = customer_id);

create policy "Sellers can update their orders"
  on orders for update
  using (
    auth.uid() = seller_id or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================
-- 7. REVIEWS TABLE
-- ============================================
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint review_target check (
    (product_id is not null and restaurant_id is null) or
    (product_id is null and restaurant_id is not null)
  )
);

alter table reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

create policy "Customers can create reviews"
  on reviews for insert
  with check (auth.uid() = customer_id);

-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers to all tables
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_products_updated_at before update on products
  for each row execute procedure update_updated_at_column();

create trigger update_restaurants_updated_at before update on restaurants
  for each row execute procedure update_updated_at_column();

create trigger update_orders_updated_at before update on orders
  for each row execute procedure update_updated_at_column();

-- Function to create profile automatically when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 9. SAMPLE DATA (Initial Categories)
-- ============================================
insert into categories (name, slug, description, icon) values
  ('Elektronik', 'elektronik', 'Bilgisayar, telefon ve elektronik ürünler', '💻'),
  ('Moda', 'moda', 'Giyim, ayakkabı ve aksesuar', '👔'),
  ('Ev & Yaşam', 'ev-yasam', 'Mobilya, dekorasyon ve ev eşyaları', '🏠'),
  ('Spor', 'spor', 'Spor malzemeleri ve fitness ürünleri', '⚽'),
  ('Otomotiv', 'otomotiv', 'Araba aksesuar ve yedek parça', '🚗'),
  ('Kitap', 'kitap', 'Kitap, dergi ve eğitim materyalleri', '📚'),
  ('Kozmetik', 'kozmetik', 'Makyaj ve kişisel bakım ürünleri', '💄'),
  ('Oyuncak', 'oyuncak', 'Çocuk oyuncakları ve hobi ürünleri', '🧸');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Copy this SQL and run it in Supabase SQL Editor
-- 2. Set up authentication in Supabase dashboard
-- 3. Get your API keys and add to .env.local
-- 4. Start building admin panel!






