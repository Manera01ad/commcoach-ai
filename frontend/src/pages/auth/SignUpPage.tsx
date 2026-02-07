import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Github, AlertCircle, Shield, Code, DollarSign, Users } from 'lucide-react';

interface SignUpPageProps {
  onSwitchToSignIn: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToSignIn }) => {
  const { signUp, signInWithGoogle, signInWithGitHub, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [contributorType, setContributorType] = useState<string>('');
  const [showContributorOptions, setShowContributorOptions] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await signUp(formData.email, formData.password, formData.name);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Sign up failed' });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrors({ submit: 'Google sign in failed' });
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      setErrors({ submit: 'GitHub sign in failed' });
    }
  };

  const contributorOptions = [
    { value: 'developer', label: 'Developer', icon: Code, description: 'Contribute code & features' },
    { value: 'designer', label: 'Designer', icon: Shield, description: 'Design & UX improvements' },
    { value: 'sponsor', label: 'Sponsor', icon: DollarSign, description: 'Financial support' },
    { value: 'community', label: 'Community', icon: Users, description: 'Help & feedback' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-glow">
            <span className="text-2xl font-bold text-white">CC</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Join CommCoach AI and elevate your communication skills
          </p>
        </div>

        {/* Main Card */}
        <div className="card space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-start gap-3 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700 dark:text-danger-300">{errors.submit}</p>
            </div>
          )}

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn btn-social"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <button
              type="button"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="btn btn-social"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
              <p className="form-hint">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            {/* Contributor Section */}
            <div className="form-group">
              <button
                type="button"
                onClick={() => setShowContributorOptions(!showContributorOptions)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showContributorOptions ? '− ' : '+ '}
                I want to contribute to CommCoach AI
              </button>
              
              {showContributorOptions && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {contributorOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setContributorType(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          contributorType === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1 text-primary-600 dark:text-primary-400" />
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {option.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="form-group">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && <p className="form-error">{errors.terms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner w-4 h-4"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
