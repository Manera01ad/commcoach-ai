import React, { useState } from 'react';
import { SessionPhase } from '../types';
import { Target, Users, Mic2, Briefcase, Eye, Moon, Sun, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';

interface HeaderProps {
  phase: SessionPhase;
  isVoiceMode: boolean;
  onReset: () => void;
  onSwitchPhase: (phase: SessionPhase) => void;
}

const Header: React.FC<HeaderProps> = ({ phase, isVoiceMode, onReset, onSwitchPhase }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserInitials = () => {
    if (!user || !user.full_name) return 'U';
    return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 lg:h-20 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 lg:px-8 shadow-sm z-40 relative transition-colors duration-300">
      <div className="flex items-center space-x-4 lg:space-x-12">
        <button onClick={onReset} className="flex items-center space-x-2 group shrink-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-600 dark:bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Target className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="font-black text-base lg:text-xl text-neutral-800 dark:text-white tracking-tighter italic hidden xs:block">CommCoach.</h1>
        </button>

        <nav className="flex items-center bg-neutral-50 dark:bg-neutral-800 p-1 rounded-xl lg:rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-x-auto no-scrollbar max-w-[180px] sm:max-w-none">
          {[
            { id: SessionPhase.CHAT, label: 'Mastery', icon: <Target className="w-3 h-3" /> },
            { id: SessionPhase.MENTORS, label: 'Ment', icon: <Users className="w-3 h-3" /> },
            { id: SessionPhase.AGENT, label: 'Meet', icon: <Briefcase className="w-3 h-3" /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onSwitchPhase(item.id)}
              className={`px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-1 lg:space-x-2 shrink-0 ${phase === item.id
                ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border border-neutral-200 dark:border-neutral-700'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`group flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-xl lg:rounded-2xl transition-all ${phase === SessionPhase.PROFILE || showUserMenu
              ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-transparent'
              }`}
          >
            <div className="hidden sm:block text-right">
              <div className="text-[8px] lg:text-[9px] font-black text-neutral-800 dark:text-white uppercase tracking-widest leading-none">
                {user?.full_name || 'User'}
              </div>
            </div>
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-[9px] lg:text-[11px] font-black text-white">
              {getUserInitials()}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-strong z-50 overflow-hidden">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="font-semibold text-neutral-900 dark:text-white">{user?.full_name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSwitchPhase(SessionPhase.PROFILE);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // TODO: Open settings modal
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
