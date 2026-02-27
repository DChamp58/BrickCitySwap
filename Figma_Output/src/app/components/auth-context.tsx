import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken] = useState<string | null>(null);
  const loading = false;

  const signUp = async (email: string, _password: string, name: string) => {
    // TODO: implement real auth
    setUser({ id: '1', email, name, subscriptionTier: 'free' });
  };

  const signIn = async (email: string, _password: string) => {
    // TODO: implement real auth
    setUser({ id: '1', email, name: email.split('@')[0], subscriptionTier: 'free' });
  };

  const signOut = async () => {
    setUser(null);
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
