import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github';
  isContributor?: boolean;
  contributorType?: 'developer' | 'designer' | 'sponsor' | 'community';
  twoFactorEnabled?: boolean;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns QR code URL
  verifyTwoFactor: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('commcoach_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // Mock authentication (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        provider: 'email',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('commcoach_user', JSON.stringify(mockUser));
      localStorage.setItem('commcoach_token', 'mock_jwt_token');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        provider: 'email',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('commcoach_user', JSON.stringify(mockUser));
      localStorage.setItem('commcoach_token', 'mock_jwt_token');
    } catch (error) {
      console.error('Sign up failed:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/40',
        provider: 'google',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('commcoach_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement GitHub OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email: 'user@github.com',
        name: 'GitHub User',
        avatar: 'https://via.placeholder.com/40',
        provider: 'github',
        isContributor: true,
        contributorType: 'developer',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('commcoach_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('GitHub sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // TODO: Call backend logout endpoint
      setUser(null);
      localStorage.removeItem('commcoach_user');
      localStorage.removeItem('commcoach_token');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // TODO: Implement password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('commcoach_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const enableTwoFactor = async (): Promise<string> => {
    try {
      // TODO: Generate 2FA secret and QR code
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'https://via.placeholder.com/200x200?text=QR+Code';
    } catch (error) {
      console.error('2FA setup failed:', error);
      throw error;
    }
  };

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    try {
      // TODO: Verify 2FA code with backend
      await new Promise(resolve => setTimeout(resolve, 500));
      return code === '123456'; // Mock verification
    } catch (error) {
      console.error('2FA verification failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updateProfile,
    enableTwoFactor,
    verifyTwoFactor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
