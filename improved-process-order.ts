import { serve } from 'https://deno.land/std@0.201.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.33.0';

// KEP Marketplace Order Processing Function
// Handles order creation with stock management and tenant isolation

if (!Deno.env.get('SUPABASE_URL') || !Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  global: { headers: { 'x-client-info': 'kep-marketplace-process-order' } },
});

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

async function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: { ...corsHeaders() },
  });
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface OrderRequest {
  customer_id: string;
  seller_id: string;
  tenant_id: string;
  items: OrderItem[];
  total_amount: number;
  delivery_address: string;
  notes?: string;
}

function validateRequestBody(body: unknown): string[] {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    errors.push('Empty body');
    return errors;
  }

  const orderBody = body as Partial<OrderRequest>;

  if (!orderBody.customer_id) errors.push('customer_id is required');
  if (!orderBody.seller_id) errors.push('seller_id is required');
  if (!orderBody.tenant_id) errors.push('tenant_id is required'); // Multi-tenant support
  if (!Array.isArray(orderBody.items) || orderBody.items.length === 0) errors.push('items must be a non-empty array');
  else {
    orderBody.items.forEach((it: unknown, idx: number) => {
      const item = it as Partial<OrderItem>;
      if (!item.product_id) errors.push(`items[${idx}].product_id is required`);
      if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity <= 0) errors.push(`items[${idx}].quantity must be a positive integer`);
      if (typeof item.price !== 'number' || item.price < 0) errors.push(`items[${idx}].price must be a non-negative number`);
    });
  }
  if (typeof orderBody.total_amount !== 'number' || orderBody.total_amount < 0) errors.push('total_amount must be a non-negative number');
  if (!orderBody.delivery_address || typeof orderBody.delivery_address !== 'string') errors.push('delivery_address must be a string'); // Our schema uses string
  return errors;
}

serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') return handleOptions();

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...JSON_HEADERS, ...corsHeaders() },
      });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 415,
        headers: { ...JSON_HEADERS, ...corsHeaders() },
      });
    }

    const body = await req.json().catch(() => null);
    const validationErrors = validateRequestBody(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ error: 'Invalid request', details: validationErrors }), {
        status: 400,
        headers: { ...JSON_HEADERS, ...corsHeaders() },
      });
    }

    // Generate order ID
    const orderId = crypto.randomUUID();

    // Insert order with tenant_id
    const { data: insertedOrder, error: insertErr } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_id: body.customer_id,
        seller_id: body.seller_id,
        tenant_id: body.tenant_id, // Multi-tenant support
        items: body.items,
        total_amount: body.total_amount,
        delivery_address: body.delivery_address,
        notes: body.notes || null,
        status: 'pending', // Default status
      })
      .select('id')
      .single();

    if (insertErr || !insertedOrder) {
      console.error('Order insert error', insertErr);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...JSON_HEADERS, ...corsHeaders() },
      });
    }

    // Update stocks with tenant isolation
    for (const item of body.items) {
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .select('stock, title')
        .eq('id', item.product_id)
        .eq('tenant_id', body.tenant_id) // Tenant isolation
        .single();

      if (prodErr || !product) {
        // Rollback: delete the inserted order
        await supabase.from('orders').delete().eq('id', orderId);
        console.error('Product lookup error', prodErr);
        return new Response(
          JSON.stringify({
            error: `Product ${item.product_id} not found or not accessible`,
          }),
          {
            status: 400,
            headers: { ...JSON_HEADERS, ...corsHeaders() },
          },
        );
      }

      if (product.stock < item.quantity) {
        // Rollback: delete the inserted order
        await supabase.from('orders').delete().eq('id', orderId);
        return new Response(
          JSON.stringify({
            error: `Insufficient stock for product "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`,
          }),
          {
            status: 400,
            headers: { ...JSON_HEADERS, ...corsHeaders() },
          },
        );
      }

      const { error: updateErr } = await supabase
        .from('products')
        .update({ stock: product.stock - item.quantity })
        .eq('id', item.product_id)
        .eq('tenant_id', body.tenant_id); // Tenant isolation

      if (updateErr) {
        // Rollback: delete the inserted order
        await supabase.from('orders').delete().eq('id', orderId);
        console.error('Product update error', updateErr);
        return new Response(JSON.stringify({ error: 'Failed to update product stock' }), {
          status: 500,
          headers: { ...JSON_HEADERS, ...corsHeaders() },
        });
      }
    }

    // Send notification to seller (optional)
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'email',
          recipient_id: body.seller_id,
          title: 'Yeni Sipariş Alındı',
          message: `Sipariş #${orderId} için yeni bir sipariş alındı. Toplam tutar: ₺${body.total_amount}`,
          data: { order_id: orderId, total_amount: body.total_amount },
        },
      });
    } catch (notificationError) {
      console.error('Notification error (non-critical):', notificationError);
      // Don't fail the order for notification errors
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderId,
        message: 'Order processed successfully',
      }),
      {
        status: 201,
        headers: { ...JSON_HEADERS, ...corsHeaders() },
      },
    );
  } catch (err) {
    console.error('Unhandled error', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...JSON_HEADERS, ...corsHeaders() },
    });
  }
});
