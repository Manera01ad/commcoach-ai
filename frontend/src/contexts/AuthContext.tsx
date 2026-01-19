import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  email: string;
  full_name?: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  subscription_tier: 'free' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage token check on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (token) {
        const userData = await authService.getSession();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Session check failed', error);
      localStorage.removeItem('supabase.auth.token'); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await authService.signin(email, password);
    if (data.session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      setUser(data.user);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    await authService.signup(email, password, fullName);
    // After signup, we generally direct them to login or verify email
  };

  const logout = async () => {
    await authService.signout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
