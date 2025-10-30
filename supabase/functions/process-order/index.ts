import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    const { orderData } = await req.json();

    // Validate order data
    if (!orderData || !orderData.items || !orderData.customer_id) {
      return new Response(JSON.stringify({ error: 'Invalid order data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([
        {
          customer_id: orderData.customer_id,
          seller_id: orderData.seller_id,
          items: orderData.items,
          total_amount: orderData.total_amount,
          status: 'pending',
          delivery_address: orderData.delivery_address,
          notes: orderData.notes || null,
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Update product stock
    for (const item of orderData.items) {
      const { error: stockError } = await supabaseClient
        .from('products')
        .update({ stock: item.current_stock - item.quantity })
        .eq('id', item.product_id);

      if (stockError) {
        console.error('Stock update error:', stockError);
      }
    }

    // Send notification (optional)
    // You can integrate with email services, push notifications, etc.

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        message: 'Order processed successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error processing order:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});









