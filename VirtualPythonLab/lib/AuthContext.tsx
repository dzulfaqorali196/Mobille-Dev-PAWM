import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, getCurrentUser } from './supabase';
import type { User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const AUTH_KEY = 'auth_store';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function saveSession(session: any) {
  try {
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

async function loadSession() {
  try {
    const sessionStr = await SecureStore.getItemAsync(AUTH_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

async function removeSession() {
  try {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  } catch (error) {
    console.error('Error removing session:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek session yang tersimpan saat startup
    checkStoredSession();

    // Subscribe ke perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await saveSession(session);
      } else {
        await removeSession();
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkStoredSession() {
    try {
      const session = await loadSession();
      if (session) {
        const { data: { session: newSession }, error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        
        if (error) {
          await removeSession();
          setUser(null);
        } else {
          setUser(newSession?.user ?? null);
        }
      }
    } catch (error) {
      console.error('Error checking stored session:', error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          await saveSession(data.session);
        }
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          await saveSession(data.session);
        }
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        await removeSession();
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    resetPassword: async (email: string) => {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
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