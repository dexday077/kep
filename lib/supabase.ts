import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export type UserRole = "customer" | "seller" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  shop_name?: string; // For sellers
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  image?: string;
  images?: string[];
  rating?: number;
  badge?: string;
  seller_id: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  delivery_fee: number;
  min_order?: number;
  eta_minutes: number;
  image?: string;
  seller_id: string;
  is_active: boolean;
  promo_text?: string;
  badges?: string[];
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  seller_id: string;
  items: OrderItem[];
  total_amount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "completed"
    | "cancelled";
  delivery_address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_title: string;
  quantity: number;
  price: number;
  image?: string;
}














