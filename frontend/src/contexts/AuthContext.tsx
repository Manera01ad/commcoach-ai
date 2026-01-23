import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);

        if (currentSession) {
          setSession(currentSession);
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            full_name: currentSession.user.user_metadata?.full_name,
          });
        } else {
          setSession(null);
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Check for existing session on mount
   * This restores the user's session if they refresh the page
   */
  const checkSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error checking session:', error);
        setLoading(false);
        return;
      }

      if (currentSession) {
        setSession(currentSession);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          full_name: currentSession.user.user_metadata?.full_name,
        });
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Session and user will be set by onAuthStateChange listener
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with email and password
   */
  const signup = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Please check your email to confirm your account');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Session and user will be cleared by onAuthStateChange listener
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      console.log('Password reset email sent');
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user && !!session,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
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
