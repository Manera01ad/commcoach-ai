import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';
import Signup from './Signup';
import { Sparkles, Brain } from 'lucide-react';

const AuthRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState<'login' | 'signup'>('login');

  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 dark:bg-neutral-950 font-['Inter']">

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0f] border-r border-white/5 p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        {/* Deep Aura Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              CommCoach AI
            </span>
            <div className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 tracking-wider">
              BETA
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold text-white leading-tight mb-8">
            Master the art of <br />
            <span className="text-blue-400">communication</span> with AI
          </h2>
          <p className="text-xl text-neutral-400 leading-relaxed mb-12">
            Get real-time feedback, practice with realistic personas, and track your progress with our advanced multi-modal AI coaching platform.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
              <div className="font-bold text-white mb-2">Real-time Analysis</div>
              <div className="text-sm text-neutral-500 leading-relaxed">Instant feedback on pacing and clarity</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
              <div className="font-bold text-white mb-2">Adaptive Drill</div>
              <div className="text-sm text-neutral-500 leading-relaxed">Personalized exercises for your gaps</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm font-medium text-neutral-600">
          © 2026 CommCoach AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Mobile Branding (Visible only on small screens) */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-900 dark:text-white">CommCoach AI</span>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          {view === 'login' ? (
            <Login onSwitchToSignup={() => setView('signup')} />
          ) : (
            <Signup onSwitchToLogin={() => setView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
