import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentWebhookData {
  id: string;
  object: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      payment_method?: string;
      failure_reason?: string;
      metadata?: Record<string, any>;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    // Get provider from URL path
    const url = new URL(req.url);
    const provider = url.pathname.split('/').pop(); // 'stripe', 'iyzico', 'paytr'

    if (!provider || !['stripe', 'iyzico', 'paytr'].includes(provider)) {
      return new Response(JSON.stringify({ error: 'Invalid provider' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature') || req.headers.get('iyzico-signature') || req.headers.get('paytr-signature');

    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook (implementation depends on provider)
    const isValid = await verifyWebhookSignature(req, provider, signature);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookData = await req.json();
    console.log(`${provider} webhook received:`, webhookData);

    // Process webhook based on provider
    let result;
    switch (provider) {
      case 'stripe':
        result = await processStripeWebhook(supabaseClient, webhookData);
        break;
      case 'iyzico':
        result = await processIyzicoWebhook(supabaseClient, webhookData);
        break;
      case 'paytr':
        result = await processPaytrWebhook(supabaseClient, webhookData);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Verify webhook signature
async function verifyWebhookSignature(req: Request, provider: string, signature: string): Promise<boolean> {
  const body = await req.text();
  const webhookSecret = Deno.env.get(`${provider.toUpperCase()}_WEBHOOK_SECRET`);

  if (!webhookSecret) {
    console.error(`Missing ${provider} webhook secret`);
    return false;
  }

  switch (provider) {
    case 'stripe':
      return await verifyStripeSignature(body, signature, webhookSecret);
    case 'iyzico':
      return await verifyIyzicoSignature(body, signature, webhookSecret);
    case 'paytr':
      return await verifyPaytrSignature(body, signature, webhookSecret);
    default:
      return false;
  }
}

// Stripe signature verification
async function verifyStripeSignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Import Stripe library for signature verification
    const stripe = await import('https://esm.sh/stripe@14.21.0');
    const stripeInstance = stripe.default(secret);

    // This is a simplified version - in production, use proper Stripe webhook verification
    return signature.startsWith('t=') && signature.includes('v1=');
  } catch (error) {
    console.error('Stripe signature verification error:', error);
    return false;
  }
}

// Iyzico signature verification
async function verifyIyzicoSignature(body: string, signature: string, secret: string): Promise<boolean> {
  // Iyzico webhook signature verification logic
  // This is a simplified version - implement according to Iyzico documentation
  return signature.length > 0;
}

// PayTR signature verification
async function verifyPaytrSignature(body: string, signature: string, secret: string): Promise<boolean> {
  // PayTR webhook signature verification logic
  // This is a simplified version - implement according to PayTR documentation
  return signature.length > 0;
}

// Process Stripe webhook
async function processStripeWebhook(supabaseClient: any, webhookData: PaymentWebhookData) {
  const { type, data } = webhookData;

  switch (type) {
    case 'payment_intent.succeeded':
      return await handlePaymentSuccess(supabaseClient, data.object, 'stripe');
    case 'payment_intent.payment_failed':
      return await handlePaymentFailure(supabaseClient, data.object, 'stripe');
    case 'charge.dispute.created':
      return await handleChargeback(supabaseClient, data.object, 'stripe');
    default:
      console.log(`Unhandled Stripe event type: ${type}`);
      return { success: true, message: 'Event not handled' };
  }
}

// Process Iyzico webhook
async function processIyzicoWebhook(supabaseClient: any, webhookData: any) {
  const { eventType, data } = webhookData;

  switch (eventType) {
    case 'PAYMENT_SUCCESS':
      return await handlePaymentSuccess(supabaseClient, data, 'iyzico');
    case 'PAYMENT_FAILURE':
      return await handlePaymentFailure(supabaseClient, data, 'iyzico');
    default:
      console.log(`Unhandled Iyzico event type: ${eventType}`);
      return { success: true, message: 'Event not handled' };
  }
}

// Process PayTR webhook
async function processPaytrWebhook(supabaseClient: any, webhookData: any) {
  const { status, data } = webhookData;

  switch (status) {
    case 'success':
      return await handlePaymentSuccess(supabaseClient, data, 'paytr');
    case 'failed':
      return await handlePaymentFailure(supabaseClient, data, 'paytr');
    default:
      console.log(`Unhandled PayTR status: ${status}`);
      return { success: true, message: 'Event not handled' };
  }
}

// Handle successful payment
async function handlePaymentSuccess(supabaseClient: any, paymentData: any, provider: string) {
  try {
    // Find payment by provider payment ID
    const { data: payment, error: paymentError } = await supabaseClient.from('payments').select('*').eq('provider_payment_id', paymentData.id).eq('provider', provider).single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return { success: false, error: 'Payment not found' };
    }

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status: 'succeeded',
        paid_at: new Date().toISOString(),
        payment_method_details: {
          type: paymentData.payment_method?.type || 'card',
          last4: paymentData.payment_method?.card?.last4,
          brand: paymentData.payment_method?.card?.brand,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Payment update error:', updateError);
      return { success: false, error: 'Payment update failed' };
    }

    // Update order status
    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.order_id);

    if (orderError) {
      console.error('Order update error:', orderError);
    }

    // Send notification to customer
    await supabaseClient.functions.invoke('send-notification', {
      body: {
        type: 'email',
        recipient_id: payment.customer_id,
        title: 'Ödeme Başarılı',
        message: `Siparişiniz için ödeme başarıyla alındı. Sipariş numarası: ${payment.order_id}`,
        data: { order_id: payment.order_id, amount: payment.amount },
      },
    });

    return { success: true, message: 'Payment processed successfully' };
  } catch (error) {
    console.error('Payment success handling error:', error);
    return { success: false, error: 'Payment processing failed' };
  }
}

// Handle failed payment
async function handlePaymentFailure(supabaseClient: any, paymentData: any, provider: string) {
  try {
    // Find payment by provider payment ID
    const { data: payment, error: paymentError } = await supabaseClient.from('payments').select('*').eq('provider_payment_id', paymentData.id).eq('provider', provider).single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return { success: false, error: 'Payment not found' };
    }

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        failure_reason: paymentData.failure_reason || 'Payment failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Payment update error:', updateError);
      return { success: false, error: 'Payment update failed' };
    }

    // Update order status
    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.order_id);

    if (orderError) {
      console.error('Order update error:', orderError);
    }

    // Send notification to customer
    await supabaseClient.functions.invoke('send-notification', {
      body: {
        type: 'email',
        recipient_id: payment.customer_id,
        title: 'Ödeme Başarısız',
        message: `Siparişiniz için ödeme alınamadı. Lütfen tekrar deneyin. Sipariş numarası: ${payment.order_id}`,
        data: { order_id: payment.order_id, failure_reason: paymentData.failure_reason },
      },
    });

    return { success: true, message: 'Payment failure processed' };
  } catch (error) {
    console.error('Payment failure handling error:', error);
    return { success: false, error: 'Payment failure processing failed' };
  }
}

// Handle chargeback
async function handleChargeback(supabaseClient: any, chargebackData: any, provider: string) {
  try {
    // Find payment by provider payment ID
    const { data: payment, error: paymentError } = await supabaseClient.from('payments').select('*').eq('provider_payment_id', chargebackData.payment_intent).eq('provider', provider).single();

    if (paymentError || !payment) {
      console.error('Payment not found for chargeback:', paymentError);
      return { success: false, error: 'Payment not found' };
    }

    // Log chargeback event
    console.log('Chargeback received:', {
      payment_id: payment.id,
      order_id: payment.order_id,
      amount: chargebackData.amount,
      reason: chargebackData.reason,
    });

    // Send notification to admin
    await supabaseClient.functions.invoke('send-notification', {
      body: {
        type: 'email',
        recipient_id: 'admin', // This should be actual admin user ID
        title: 'Chargeback Uyarısı',
        message: `Sipariş ${payment.order_id} için chargeback alındı. Tutar: ${chargebackData.amount}`,
        data: {
          order_id: payment.order_id,
          payment_id: payment.id,
          chargeback_amount: chargebackData.amount,
          reason: chargebackData.reason,
        },
      },
    });

    return { success: true, message: 'Chargeback processed' };
  } catch (error) {
    console.error('Chargeback handling error:', error);
    return { success: false, error: 'Chargeback processing failed' };
  }
}





