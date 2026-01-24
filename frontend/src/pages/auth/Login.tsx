import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginProps {
    onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = async () => {
        setError(null);
        try {
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to sign in. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 md:p-10 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 flex flex-col items-center">
            <div className="text-center mb-8 w-full">
                <h1 className="text-3xl font-black text-blue-600 mb-2">Welcome Back</h1>
                <p className="text-neutral-400 font-medium text-sm">Sign in to access your CommCoach workspace</p>
            </div>

            {/* Google Login - Now Activated */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-neutral-200 hover:bg-neutral-50 transition-all font-bold text-neutral-700 shadow-sm active:scale-[0.98] mb-6"
            >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                <span className="text-[15px]">Continue with Google</span>
            </button>

            {/* Divider - From reference design */}
            <div className="w-full relative flex items-center justify-center py-4 mb-6">
                <div className="w-full border-t border-neutral-100"></div>
                <span className="absolute px-4 bg-white text-[11px] font-black text-neutral-300 uppercase tracking-widest">OR</span>
            </div>

            {/* Tabs - From reference design */}
            <div className="w-full flex p-1.5 bg-neutral-50 rounded-2xl mb-8">
                <button
                    type="button"
                    onClick={() => { }}
                    className="flex-1 py-3 text-sm font-black text-neutral-800 bg-white rounded-xl shadow-sm border border-neutral-100"
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="flex-1 py-3 text-sm font-black text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    Sign Up
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold text-center animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-neutral-600 ml-1 block">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-[15px] font-medium placeholder:text-neutral-300"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[13px] font-bold text-neutral-600">Password</label>
                        <button type="button" className="text-[11px] font-bold text-neutral-400 hover:text-blue-600 transition-colors uppercase tracking-wider">
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-[15px] font-medium placeholder:text-neutral-300"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Primary Button - Reverting to Blue Gradient with new text/icon */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Mail className="w-5 h-5" />
                            <span className="text-[16px]">Sign in with Email</span>
                        </>
                    )}
                </button>
            </form>

            <p className="mt-8 text-[12px] font-medium text-neutral-400 text-center leading-relaxed">
                By signing in, you agree to our <br />
                <a href="#" className="underline decoration-neutral-200 underline-offset-4 hover:text-neutral-800 transition-colors">Terms of Service</a> and <a href="#" className="underline decoration-neutral-200 underline-offset-4 hover:text-neutral-800 transition-colors">Privacy Policy</a>.
            </p>
        </div>
    );
};

export default Login;
