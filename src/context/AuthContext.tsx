'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userRole: 'customer' | 'seller', additionalData?: { fullName?: string; phone?: string; shopName?: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userRole: 'customer' | 'seller' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (only used when Supabase is disabled)
const mockUsers: Record<string, { email: string; password: string; role: 'customer' | 'seller' | 'admin'; id: string }> = {
  'test@test.com': {
    email: 'test@test.com',
    password: '123456',
    role: 'customer',
    id: 'mock-user-1',
  },
  'admin@test.com': {
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
    id: 'mock-admin-1',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'customer' | 'seller' | 'admin' | null>(null);

  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) {
      // Mock mode - check localStorage
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        const sessionData = JSON.parse(mockSession);
        setUser(sessionData.user as any);
        setUserRole(sessionData.role);
      }
      setLoading(false);
      return;
    }

    // Supabase mode
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event);

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }

        // Handle session expiry
        if (event === 'SIGNED_OUT') {
          setUserRole(null);
        }

        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }

        setLoading(false);
      });

      subscription = sub;
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
    }

    const checkSession = setInterval(async () => {
      if (!supabase) return;

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.log('Session expired or invalid, logging out...');
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    }, 5 * 60 * 1000);

    return () => {
      subscription?.unsubscribe();
      clearInterval(checkSession);
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase.from('profiles').select('role, tenant_id').eq('id', userId).single();

      if (error) {
        // Profile henüz oluşturulmamış olabilir, bu normal
        if (error.code === 'PGRST116') {
          // No rows returned - profile doesn't exist yet
          console.log('Profile not found yet, will be created by trigger');
          setUserRole('customer'); // Default role
          return;
        }
        // Diğer hatalar için sadece console'da logla
        console.warn('Error fetching user role:', error.message || error);
        setUserRole('customer'); // Default role
      } else {
        setUserRole(data?.role || 'customer');
      }
    } catch (error: any) {
      // Genel hatalar için
      console.warn('Error fetching user role:', error?.message || 'Unknown error');
      setUserRole('customer'); // Default role
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      // Mock authentication
      const mockUser = mockUsers[email];

      if (!mockUser || mockUser.password !== password) {
        return {
          error: {
            message: 'Email veya şifre hatalı',
          },
        };
      }

      // Create mock session
      const mockSession = {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        },
        role: mockUser.role,
      };

      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      setUser(mockSession.user as any);
      setUserRole(mockUser.role);

      return { error: null };
    }

    // Supabase authentication
    if (!supabase) {
      return {
        error: {
          message: 'Supabase is not configured',
        },
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userRole: 'customer' | 'seller', additionalData?: { fullName?: string; phone?: string; shopName?: string }) => {
    if (!supabase) {
      return {
        error: {
          message: 'Supabase is not configured',
        },
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: additionalData?.fullName || '',
            role: userRole,
          },
        },
      });

      if (error) {
        console.error('Auth signup error:', error);
        return { error };
      }

      if (data.user) {
        // Wait a bit for the trigger to potentially create the profile
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if profile already exists (might be created by trigger)
        const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', data.user.id).single();

        // Only insert if profile doesn't exist
        if (!existingProfile) {
          const profileData: any = {
            id: data.user.id,
            email: data.user.email,
            role: userRole,
            tenant_id: '00000000-0000-0000-0000-000000000001', // Default tenant
            created_at: new Date().toISOString(),
          };

          // Add optional fields
          if (additionalData?.fullName) {
            profileData.full_name = additionalData.fullName;
          }
          if (additionalData?.phone) {
            profileData.phone = additionalData.phone;
          }
          if (userRole === 'seller' && additionalData?.shopName) {
            profileData.shop_name = additionalData.shopName;
          }

          const { error: profileError } = await supabase.from('profiles').insert([profileData]);

          if (profileError) {
            console.warn('Error creating profile:', profileError.message || profileError);
            // Don't return error here - user is already created in auth
            // Profile will be created by trigger or can be updated later
          }
        } else {
          // Profile exists, update it with additional data if needed
          const updateData: any = {};
          if (additionalData?.fullName) updateData.full_name = additionalData.fullName;
          if (additionalData?.phone) updateData.phone = additionalData.phone;
          if (userRole === 'seller' && additionalData?.shopName) updateData.shop_name = additionalData.shopName;

          if (Object.keys(updateData).length > 0) {
            await supabase.from('profiles').update(updateData).eq('id', data.user.id);
          }
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    if (!isSupabaseEnabled || !supabase) {
      // Mock sign out
      localStorage.removeItem('mockSession');
      setUser(null);
      setUserRole(null);
      return;
    }

    // Supabase sign out
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
