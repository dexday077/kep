import { createClient } from "@supabase/supabase-js";

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = USE_SUPABASE 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Mock mode

export const isSupabaseEnabled = USE_SUPABASE;

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "customer" | "seller" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: "customer" | "seller" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "customer" | "seller" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category_id: number | null;
          seller_id: string;
          stock: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category_id?: number | null;
          seller_id: string;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category_id?: number | null;
          seller_id?: string;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          image_url: string | null;
          address: string | null;
          phone: string | null;
          seller_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          image_url?: string | null;
          address?: string | null;
          phone?: string | null;
          seller_id: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          address?: string | null;
          phone?: string | null;
          seller_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: number;
          restaurant_id: number;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          restaurant_id: number;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          restaurant_id?: number;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          customer_id: string;
          seller_id: string;
          items: any;
          total_amount: number;
          status:
            | "pending"
            | "confirmed"
            | "preparing"
            | "delivering"
            | "completed"
            | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_id: string;
          seller_id: string;
          items: any;
          total_amount: number;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "delivering"
            | "completed"
            | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: string;
          seller_id?: string;
          items?: any;
          total_amount?: number;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "delivering"
            | "completed"
            | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          customer_id: string;
          product_id: number | null;
          restaurant_id: number | null;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_id: string;
          product_id?: number | null;
          restaurant_id?: number | null;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: string;
          product_id?: number | null;
          restaurant_id?: number | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}




