import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    const { period = '30d', user_id } = await req.json();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get sales analytics
    const { data: salesData, error: salesError } = await supabaseClient.from('orders').select('total_amount, status, created_at').eq('seller_id', user_id).gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());

    if (salesError) throw salesError;

    // Calculate metrics
    const totalRevenue = salesData?.reduce((sum, order) => (order.status === 'completed' ? sum + order.total_amount : sum), 0) || 0;

    const totalOrders = salesData?.length || 0;
    const completedOrders = salesData?.filter((order) => order.status === 'completed').length || 0;
    const pendingOrders = salesData?.filter((order) => order.status === 'pending').length || 0;

    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    // Get top products
    const { data: productData, error: productError } = await supabaseClient.from('orders').select('items').eq('seller_id', user_id).gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());

    if (productError) throw productError;

    // Aggregate product sales
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    productData?.forEach((order) => {
      order.items.forEach((item: any) => {
        if (productSales[item.product_id]) {
          productSales[item.product_id].quantity += item.quantity;
          productSales[item.product_id].revenue += item.price * item.quantity;
        } else {
          productSales[item.product_id] = {
            name: item.product_title,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          };
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get daily sales data for chart
    const dailySales: { [key: string]: number } = {};
    salesData?.forEach((order) => {
      if (order.status === 'completed') {
        const date = order.created_at.split('T')[0];
        dailySales[date] = (dailySales[date] || 0) + order.total_amount;
      }
    });

    const chartData = Object.entries(dailySales)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          period,
          totalRevenue,
          totalOrders,
          completedOrders,
          pendingOrders,
          completionRate: Math.round(completionRate * 100) / 100,
          topProducts,
          chartData,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error generating analytics:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate analytics' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});





