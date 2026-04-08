import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/lib/database.types';

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: string;
  schoolId: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateProfile: (profile: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function profileToUser(profile: Profile): User {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    subscriptionTier: profile.subscription_tier,
    schoolId: profile.school_id,
    avatarUrl: profile.avatar_url,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setAccessToken(null);
      return;
    }

    setAccessToken(session.access_token);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      // Profile may not exist yet if trigger hasn't fired — use auth metadata
      setUser({
        id: session.user.id,
        email: session.user.email ?? '',
        name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? '',
        subscriptionTier: 'free',
        schoolId: null,
        avatarUrl: null,
      });
      return;
    }

    setUser(profileToUser(profile));
  };

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session).finally(() => setLoading(false));
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        loadProfile(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    trackEvent('sign_up', { method: 'email' });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setAccessToken(null);
  };

  const updateProfile = (profile: User) => {
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, signIn, signUp, signOut, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
