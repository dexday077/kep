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

    const { type, recipient_id, title, message, data } = await req.json();

    // Get recipient profile
    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('email, full_name').eq('id', recipient_id).single();

    if (profileError) {
      throw profileError;
    }

    // Send email notification (using Supabase Edge Function with email service)
    if (type === 'email') {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@kepmarketplace.com',
          to: [profile.email],
          subject: title,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">${title}</h2>
              <p>Merhaba ${profile.full_name || 'Değerli Müşterimiz'},</p>
              <p>${message}</p>
              ${data ? `<p><strong>Detaylar:</strong> ${JSON.stringify(data)}</p>` : ''}
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">
                Bu e-posta Kep Marketplace tarafından gönderilmiştir.
              </p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }
    }

    // Store notification in database
    const { error: notificationError } = await supabaseClient.from('notifications').insert([
      {
        recipient_id,
        type,
        title,
        message,
        data: data || null,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    if (notificationError) {
      console.error('Notification storage error:', notificationError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification sent successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});





