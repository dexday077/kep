"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userRole: "customer" | "seller" | "admin"
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userRole: "customer" | "seller" | "admin" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (only used when Supabase is disabled)
const mockUsers: Record<string, { email: string; password: string; role: "customer" | "seller" | "admin"; id: string }> = {
  "test@test.com": { 
    email: "test@test.com", 
    password: "123456", 
    role: "customer",
    id: "mock-user-1"
  },
  "admin@test.com": { 
    email: "admin@test.com", 
    password: "123456", 
    role: "admin",
    id: "mock-admin-1"
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<
    "customer" | "seller" | "admin" | null
  >(null);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      // Mock mode - check localStorage
      const mockSession = localStorage.getItem("mockSession");
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserRole(session.user.id);
      }

      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }

      if (event === "SIGNED_OUT") {
        setUserRole(null);
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
      }

      setLoading(false);
    });

    const checkSession = setInterval(async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.log("Session expired or invalid, logging out...");
        await supabase.auth.signOut();
      }
    }, 5 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(checkSession);
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole("customer");
      } else {
        setUserRole(data?.role || "customer");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("customer");
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      // Mock authentication
      const mockUser = mockUsers[email];
      
      if (!mockUser || mockUser.password !== password) {
        return { 
          error: { 
            message: "Email veya şifre hatalı" 
          } 
        };
      }

      // Create mock session
      const mockSession = {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString()
        },
        role: mockUser.role
      };

      localStorage.setItem("mockSession", JSON.stringify(mockSession));
      setUser(mockSession.user as any);
      setUserRole(mockUser.role);

      return { error: null };
    }

    // Supabase authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    userRole: "customer" | "seller" | "admin"
  ) => {
    if (!isSupabaseEnabled) {
      // Mock registration
      if (mockUsers[email]) {
        return { 
          error: { 
            message: "Bu email adresi zaten kullanılıyor" 
          } 
        };
      }

      // Add to mock users
      const newUserId = `mock-user-${Date.now()}`;
      mockUsers[email] = {
        email,
        password,
        role: userRole,
        id: newUserId
      };

      return { error: null };
    }

    // Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: userRole,
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return { error: profileError };
      }
    }

    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseEnabled) {
      // Mock sign out
      localStorage.removeItem("mockSession");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
