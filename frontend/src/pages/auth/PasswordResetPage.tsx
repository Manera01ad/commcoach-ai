import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface PasswordResetPageProps {
  onBack: () => void;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ onBack }) => {
  const { resetPassword, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900/20 rounded-full mb-2">
              <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Check your email
            </h2>
            
            <p className="text-neutral-600 dark:text-neutral-400">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="pt-4 space-y-2">
              <button
                onClick={onBack}
                className="btn btn-primary w-full"
              >
                Back to Sign In
              </button>
              
              <button
                onClick={() => setSuccess(false)}
                className="btn btn-ghost w-full"
              >
                Try another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-glow">
            <span className="text-2xl font-bold text-white">CC</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Reset your password
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        {/* Main Card */}
        <div className="card">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700 dark:text-danger-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input pl-10 ${error ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner w-4 h-4"></div>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
