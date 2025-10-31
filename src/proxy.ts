import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Admin routes that require authentication
    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    // Auth routes that should redirect if already logged in
    const authRoutes = ['/auth/login', '/auth/register'];
    const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    // If accessing admin routes without session, redirect to login
    if (isAdminRoute && !session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If accessing admin routes with session, check user role
    if (isAdminRoute && session) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();

      // Only admin and seller can access admin panel
      if (profile?.role === 'customer') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // If accessing auth routes with session, redirect to home or admin
    if (isAuthRoute && session) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();

      // Redirect based on role
      if (profile?.role === 'admin' || profile?.role === 'seller') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (e) {
    console.error('Middleware error:', e);
    // If error, continue without redirect
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
