import { NextResponse } from 'next/server';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      USE_SUPABASE: process.env.NEXT_PUBLIC_USE_SUPABASE,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
    },
    client: {
      enabled: isSupabaseEnabled,
      initialized: !!supabase,
    }
  };

  try {
    if (!isSupabaseEnabled) {
      results.connection = { status: 'disabled', message: 'Supabase is disabled' };
    } else if (!supabase) {
      results.connection = { status: 'error', message: 'Supabase client not initialized' };
    } else {
      // Test basic connection
      const { data, error } = await supabase.from('categories').select('count').limit(1);
      
      if (error) {
        results.connection = {
          status: 'error',
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        };
      } else {
        results.connection = {
          status: 'success',
          message: 'Successfully connected to Supabase',
          data: data
        };
      }
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    results.connection = {
      status: 'error',
      message: error.message,
      type: 'Network or Auth Error'
    };
    
    return NextResponse.json(results, { status: 500 });
  }
}



