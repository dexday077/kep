import { supabase } from './supabase';

// Type definitions
interface DatabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  category?: string;
  image?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  seller_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  profiles?: {
    full_name?: string;
    shop_name?: string;
  };
  categories?: {
    name?: string;
    slug?: string;
  };
}

// Type definitions for API responses
interface Profile {
  id: string;
  full_name?: string;
  shop_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Review {
  id: string;
  customer_id: string;
  product_id?: string;
  restaurant_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  profiles?: Profile;
}

interface ShippingAddress {
  id: string;
  customer_id: string;
  title: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  address_data?: unknown;
  is_default?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// API Service for Supabase Backend Integration
export class ApiService {
  // Products API
  static async getProducts(filters?: { category?: string; minPrice?: number; maxPrice?: number; search?: string; sort?: string; limit?: number; offset?: number }) {
    try {
      // Supabase bağlantısını kontrol et
      if (!supabase) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase not initialized, returning empty products');
        }
        return { data: [], count: 0 };
      }

      let query = supabase
        .from('products')
        .select(
          `
          *,
          profiles!products_seller_id_fkey(full_name, shop_name),
          categories(name, slug)
        `,
        )
        .eq('is_active', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters?.sort) {
        switch (filters.sort) {
          case 'priceAsc':
            query = query.order('price', { ascending: true });
            break;
          case 'priceDesc':
            query = query.order('price', { ascending: false });
            break;
          case 'popularity':
            query = query.order('rating', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Products table does not exist yet:', error.message);
          }
          return { data: [], count: 0 };
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase products error:', error);
        }
        return { data: [], count: 0 };
      }

      return { data: data || [], count: count || 0 };
    } catch (error: unknown) {
      // For any error, return empty array instead of throwing
      if (process.env.NODE_ENV === 'development') {
        console.warn('Products API error:', error);
      }
      return { data: [], count: 0 };
    }
  }

  static async getProduct(id: string) {
    try {
      // Supabase bağlantısını kontrol et
      if (!supabase) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase not initialized, returning null product');
        }
        return null;
      }

      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          profiles!products_seller_id_fkey(full_name, shop_name),
          categories(name, slug),
          reviews(rating, comment, created_at, profiles!reviews_customer_id_fkey(full_name))
        `,
        )
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase product error:', error);
        }
        return null;
      }
      return data;
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Product API error:', error);
      }
      return null;
    }
  }

  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('products').insert([productData]).select().single();

    if (error) throw error;
    return data;
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();

    if (error) throw error;
    return data;
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
  }

  // Categories API
  static async getCategories() {
    try {
      // Supabase bağlantısını kontrol et
      if (!supabase) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase not initialized, returning empty categories');
        }
        return [];
      }

      const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('name');

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Categories table does not exist yet:', error.message);
          }
          return [];
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase categories error:', error);
        }
        return [];
      }
      return data || [];
    } catch (error: unknown) {
      // For any error, return empty array instead of throwing
      if (process.env.NODE_ENV === 'development') {
        console.warn('Categories API error:', error);
      }
      return [];
    }
  }

  // Profile API
  static async getProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) throw error;
    return { data };
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();

    if (error) throw error;
    return data;
  }

  // Orders API
  static async createOrder(orderData: { customer_id: string; seller_id: string; items: unknown[]; total_amount: number; delivery_address: string; notes?: string }) {
    // Use Edge Function for order processing
    const { data, error } = await supabase.functions.invoke('process-order', {
      body: { orderData },
    });

    if (error) throw error;
    return data;
  }

  static async getOrders(userId: string, userRole: 'customer' | 'seller' | 'admin') {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (userRole === 'customer') {
        query = query.eq('customer_id', userId);
      } else if (userRole === 'seller') {
        query = query.eq('seller_id', userId);
      }
      // Admin can see all orders

      const { data, error } = await query;

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          return [];
        }
        throw error;
      }

      return data || [];
    } catch (error: unknown) {
      // For missing table errors, return empty array
      const dbError = error as DatabaseError;
      if (dbError?.code === 'PGRST116' || dbError?.message?.includes('does not exist')) {
        return [];
      }
      throw error;
    }
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();

    if (error) throw error;
    return data;
  }

  // Reviews API
  static async createReview(reviewData: Omit<Review, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();

    if (error) throw error;
    return data;
  }

  static async getReviews(productId?: string, restaurantId?: string) {
    try {
      // Supabase bağlantısını kontrol et
      if (!supabase) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase not initialized, returning empty reviews');
        }
        return [];
      }

      let query = supabase
        .from('reviews')
        .select(
          `
          *,
          profiles!reviews_customer_id_fkey(full_name, avatar_url)
        `,
        )
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query;

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase reviews error:', error);
        }
        return [];
      }
      return data || [];
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Reviews API error:', error);
      }
      return [];
    }
  }

  // Analytics API
  static async getAnalytics(userId: string, period: string = '30d') {
    const { data, error } = await supabase.functions.invoke('generate-analytics', {
      body: { period, user_id: userId },
    });

    if (error) throw error;
    return data;
  }

  // Notifications API
  static async sendNotification(notificationData: { type: 'email' | 'push' | 'sms'; recipient_id: string; title: string; message: string; data?: unknown }) {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: notificationData,
    });

    if (error) throw error;
    return data;
  }

  static async getNotifications(userId: string) {
    const { data, error } = await supabase.from('notifications').select('*').eq('recipient_id', userId).order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);

    if (error) throw error;
  }

  // Cart API
  static async getCart(customerId?: string, sessionId?: string) {
    const { data, error } = await supabase.rpc('get_or_create_cart', {
      customer_uuid: customerId || null,
      session_uuid: sessionId || null,
    });

    if (error) throw error;
    return data;
  }

  static async addToCart(cartId: string, productId?: string, menuItemId?: string, quantity: number = 1, notes?: string) {
    const { data, error } = await supabase.rpc('add_to_cart', {
      cart_uuid: cartId,
      product_uuid: productId || null,
      menu_item_uuid: menuItemId || null,
      item_quantity: quantity,
      item_notes: notes || null,
    });

    if (error) throw error;
    return data;
  }

  static async removeFromCart(cartId: string, itemId: string) {
    const { data, error } = await supabase.rpc('remove_from_cart', {
      cart_uuid: cartId,
      item_uuid: itemId,
    });

    if (error) throw error;
    return data;
  }

  static async getCartItems(cartId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        products(*),
        menu_items(*),
        restaurants(*)
      `,
      )
      .eq('cart_id', cartId);

    if (error) throw error;
    return data;
  }

  static async clearCart(cartId: string) {
    const { data, error } = await supabase.rpc('clear_cart', {
      cart_uuid: cartId,
    });

    if (error) throw error;
    return data;
  }

  // Payment API
  static async createPayment(orderId: string, provider: string, amount: number, currency: string = 'TRY', sessionId?: string) {
    const { data, error } = await supabase.rpc('create_payment', {
      order_uuid: orderId,
      provider_name: provider,
      payment_amount: amount,
      payment_currency: currency,
      provider_session_id: sessionId || null,
    });

    if (error) throw error;
    return data;
  }

  static async getPayments(orderId?: string, customerId?: string) {
    let query = supabase.from('payments').select('*');

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getPaymentMethods(customerId: string) {
    const { data, error } = await supabase.from('payment_methods').select('*').eq('customer_id', customerId).eq('is_active', true).order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addPaymentMethod(customerId: string, provider: string, methodId: string, type: string, details: unknown) {
    const { data, error } = await supabase.rpc('add_payment_method', {
      customer_uuid: customerId,
      provider_name: provider,
      provider_method_id: methodId,
      method_type: type,
      method_details: details,
    });

    if (error) throw error;
    return data;
  }

  // Shipping API
  static async createShipment(orderId: string, provider: string, method: string = 'standard', trackingNumber?: string) {
    const { data, error } = await supabase.rpc('create_shipment', {
      order_uuid: orderId,
      provider_name: provider,
      shipping_method_name: method,
      tracking_num: trackingNumber || null,
    });

    if (error) throw error;
    return data;
  }

  static async getShipments(orderId?: string) {
    let query = supabase.from('shipments').select('*');

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateShipmentStatus(shipmentId: string, status: string, notes?: string) {
    const { data, error } = await supabase.rpc('update_shipment_status', {
      shipment_uuid: shipmentId,
      new_status: status,
      status_notes: notes || null,
    });

    if (error) throw error;
    return data;
  }

  static async calculateShippingCost(tenantId: string, orderAmount: number, weight: number = 1.0, city?: string, district?: string) {
    const { data, error } = await supabase.rpc('calculate_shipping_cost', {
      tenant_uuid: tenantId,
      order_amount: orderAmount,
      package_weight: weight,
      city_name: city || null,
      district_name: district || null,
    });

    if (error) throw error;
    return data;
  }

  static async getShippingRates(tenantId: string) {
    const { data, error } = await supabase.from('shipping_rates').select('*').eq('tenant_id', tenantId).eq('is_active', true).order('priority', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Shipping Addresses API
  static async getShippingAddresses(customerId: string) {
    try {
      const { data, error } = await supabase.from('shipping_addresses').select('*').eq('customer_id', customerId).eq('is_active', true).order('is_default', { ascending: false });

      if (error) {
        // Check if it's a missing table error - this is acceptable for new setups
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          // Return empty array for missing table instead of throwing
          return [];
        }

        // For other errors, preserve full error object
        const enhancedError = new Error(error.message || 'Failed to get shipping addresses') as Error & DatabaseError;
        enhancedError.details = error.details;
        enhancedError.hint = error.hint;
        enhancedError.code = error.code;
        throw enhancedError;
      }
      return data || [];
    } catch (error: unknown) {
      // If it's already an enhanced error, re-throw it
      const dbError = error as Error & { error?: unknown; code?: string };
      if (dbError?.error && dbError.code !== 'PGRST116') throw error;

      // For missing table errors, return empty array
      if (dbError?.code === 'PGRST116' || (error as Error)?.message?.includes('does not exist')) {
        return [];
      }

      // Otherwise, create a proper error object
      const enhancedError = new Error((error as Error)?.message || 'Failed to get shipping addresses') as Error & { originalError: unknown };
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  static async addShippingAddress(customerId: string, title: string, addressData: unknown) {
    try {
      // Use RPC function to add shipping address
      const { data, error } = await supabase.rpc('add_shipping_address', {
        customer_uuid: customerId,
        address_title: title,
        address_data: addressData,
      });

      if (error) {
        const enhancedError = new Error(error.message || 'Failed to add shipping address') as Error & DatabaseError;
        enhancedError.details = error.details;
        enhancedError.hint = error.hint;
        enhancedError.code = error.code;
        throw enhancedError;
      }

      // RPC function returns a table, get first row
      if (data && Array.isArray(data) && data.length > 0) {
        return data[0];
      }

      return data;
    } catch (error: unknown) {
      // If it's already an enhanced error, re-throw it
      const dbError = error as Error & { error?: unknown };
      if (dbError?.error) throw error;

      // Otherwise, create a proper error object
      const enhancedError = new Error((error as Error)?.message || 'Failed to add shipping address') as Error & { originalError: unknown };
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  static async updateShippingAddress(addressId: string, updates: Partial<ShippingAddress>) {
    const { data, error } = await supabase.from('shipping_addresses').update(updates).eq('id', addressId).select().single();

    if (error) throw error;
    return data;
  }

  static async deleteShippingAddress(addressId: string) {
    const { error } = await supabase.from('shipping_addresses').delete().eq('id', addressId);

    if (error) throw error;
  }

  // Coupons API
  static async getCoupons() {
    const { data, error } = await supabase.from('coupons').select('*').eq('is_active', true).gt('valid_until', new Date().toISOString()).order('discount_value', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getUserCoupons(userId: string) {
    const { data, error } = await supabase
      .from('user_coupons')
      .select(
        `
        *,
        coupon:coupons(*)
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async claimCoupon(userId: string, couponCode: string) {
    const { data, error } = await supabase.rpc('claim_coupon', {
      p_code: couponCode,
      p_user_id: userId,
    });

    if (error) throw error;
    return data;
  }

  // Favorites API
  static async getFavorites(userId: string) {
    try {
      const { data, error } = await supabase.from('favorites').select('*, product:products(*)').eq('user_id', userId).order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === 'PGRST116') {
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError?.code === 'PGRST116') return [];
      throw error;
    }
  }

  static async addToFavorites(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .select()
      .single();

    if (error) {
      // If already exists, return success
      if (error.code === '23505') {
        return { success: true, message: 'Ürün zaten favorilerinizde' };
      }
      throw error;
    }
    return data;
  }

  static async removeFromFavorites(userId: string, productId: string) {
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);

    if (error) throw error;
  }

  static async isFavorite(userId: string, productId: string) {
    try {
      const { data, error } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('product_id', productId).single();

      if (error && error.code !== 'PGRST116') {
        return false;
      }
      return !!data;
    } catch {
      return false;
    }
  }

  // File Upload API
  static async uploadFile(file: File, bucket: string = 'products') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  }

  static async deleteFile(path: string, bucket: string = 'products') {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  }

  // Multi-tenant API
  static async getTenants() {
    const { data, error } = await supabase.from('tenants').select('*').eq('is_active', true);

    if (error) throw error;
    return data;
  }

  static async getCurrentTenant() {
    const { data, error } = await supabase.rpc('auth_tenant');

    if (error) throw error;
    return data;
  }
}
