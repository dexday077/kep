import { createClient } from 'npm:@supabase/supabase-js@2.28.0';

interface NotificationPayload {
  type: 'email' | 'push' | 'in-app';
  recipient_id: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  tenant_id: string; // Multi-tenant support ekledik
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'noreply@kepmarketplace.com';

if (!SUPABASE_URL || !SUPABASE_KEY) console.error('Missing Supabase env vars');
if (!RESEND_API_KEY) console.warn('RESEND_API_KEY not set - email sending will fail');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('Resend API key not configured');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }

  return await res.json();
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return json({ error: 'Invalid content-type' }, 400);

    const body = await req.json();
    const payload = body as Partial<NotificationPayload>;

    const errors: string[] = [];
    if (!payload.type || !['email', 'push', 'in-app'].includes(payload.type)) errors.push('Invalid or missing type');
    if (!payload.recipient_id || typeof payload.recipient_id !== 'string') errors.push('recipient_id is required and must be a string');
    if (!payload.tenant_id || typeof payload.tenant_id !== 'string') errors.push('tenant_id is required and must be a string'); // Multi-tenant
    if (!payload.title || typeof payload.title !== 'string') errors.push('title is required and must be a string');
    if (!payload.message || typeof payload.message !== 'string') errors.push('message is required and must be a string');

    if (errors.length) return json({ errors }, 400);

    // Store notification
    const insert = {
      tenant_id: payload.tenant_id, // Multi-tenant support
      type: payload.type,
      recipient_id: payload.recipient_id,
      title: payload.title,
      message: payload.message,
      data: payload.data || null,
      is_read: false,
    } as any;

    const { data: notifData, error: insertErr } = await supabase.from('notifications').insert(insert).select('id').single();
    if (insertErr || !notifData) {
      console.error('DB insert error', insertErr);
      return json({ error: 'Failed to store notification' }, 500);
    }

    const notificationId = notifData.id;

    // If email, send via Resend
    if (payload.type === 'email') {
      try {
        // ✅ Düzeltildi: profiles tablosunu kullan
        const { data: user, error: userErr } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', payload.recipient_id)
          .eq('tenant_id', payload.tenant_id) // Multi-tenant isolation
          .single();

        if (userErr || !user || !user.email) {
          console.error('Failed to resolve user email', userErr);
          return json({ error: 'Recipient email not found' }, 400);
        }

        // Daha güzel email template
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">${escapeHtml(payload.title)}</h2>
            <p>Merhaba ${escapeHtml(user.full_name || 'Değerli Müşterimiz')},</p>
            <p>${escapeHtml(payload.message)}</p>
            ${payload.data ? `<p><strong>Detaylar:</strong> ${escapeHtml(JSON.stringify(payload.data))}</p>` : ''}
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Bu e-posta Kep Marketplace tarafından gönderilmiştir.
            </p>
          </div>
        `;

        await sendEmail(user.email, payload.title, emailHtml);

        // Email gönderildi olarak işaretle
        await supabase.from('notifications').update({ sent_at: new Date().toISOString() }).eq('id', notificationId);
      } catch (e) {
        console.error('Email send error', e);
        // Update notification record with error info
        await supabase
          .from('notifications')
          .update({ send_error: String(e) })
          .eq('id', notificationId);
        return json({ error: 'Failed to send email', details: String(e) }, 500);
      }
    }

    return json(
      {
        success: true,
        notification_id: notificationId,
        message: 'Notification sent successfully',
      },
      201,
    );
  } catch (err) {
    console.error('Unexpected error', err);
    return json({ error: 'Internal server error' }, 500);
  }
});

function escapeHtml(str: string) {
  return str.replace(/[&<>"]+/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s] || s));
}





