import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import {
    Sparkles,
    Brain,
    Trophy,
    Zap,
    MessageCircle,
    Mic,
    MicOff,
    Layout,
    ArrowRight,
    Heart,
    Sun,
    Smile,
    Target,
    ChevronRight,
    Play,
    TrendingUp,
    Shield,
    Globe,
    BarChart3,
    CheckCircle2,
    Check,
    Building2,
    Moon,
    Menu,
    X
} from 'lucide-react';

// Pricing Tier Component
const PricingTier = ({
    name,
    price,
    description,
    features,
    highlight = false,
    billingCycle = "monthly",
    popularBadge = false
}: any) => {
    const annualPrice = (price * 0.83).toFixed(2);
    const displayPrice = billingCycle === "annual" ? annualPrice : price.toFixed(2);

    return (
        <div className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 border group bg-white dark:bg-slate-900/50 hover:shadow-2xl ${highlight ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'border-black/5 dark:border-white/10 hover:border-indigo-500/20'
            }`}>
            {popularBadge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-indigo-500/20">
                    Most Popular
                </span>
            )}
            <div className="mb-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">{description}</p>

                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${displayPrice}</span>
                        <span className="text-slate-500 font-bold text-sm">/mo</span>
                    </div>
                    {billingCycle === "annual" && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">Save 17%</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-8"></div>

            <ul className="space-y-4 mb-10 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                        <span className="font-medium">{feature}</span>
                    </li>
                ))}
            </ul>

            <button className="w-full py-4 rounded-2xl font-black transition-all bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 active:scale-[0.98]">
                Choose {name}
            </button>
        </div>
    );
};

// Theme Toggle Component
const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all text-slate-700 dark:text-slate-300 active:scale-95"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
};

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mood, setMood] = useState<'calm' | 'energetic' | 'joyful' | 'focused'>('joyful');
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
    const [isRecording, setIsRecording] = useState(false);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const heroCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!heroCardRef.current) return;
        const rect = heroCardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setRotate({
            x: (centerY - y) / 25,
            y: (x - centerX) / 25
        });
    };

    const moodConfig = {
        calm: { color: 'blue', secondary: 'indigo', icon: <Heart className="w-5 h-5" />, text: 'Peaceful' },
        energetic: { color: 'orange', secondary: 'red', icon: <Zap className="w-5 h-5" />, text: 'Electric' },
        joyful: { color: 'pink', secondary: 'purple', icon: <Sparkles className="w-5 h-5" />, text: 'Happiness' },
        focused: { color: 'indigo', secondary: 'cyan', icon: <Target className="w-5 h-5" />, text: 'Sharp' }
    };

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "VP of Product, TechScale",
            content: "CommSage changed how I deliver board presentations. The real-time pace analysis is a game-changer.",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        {
            name: "James Wilson",
            role: "Founder, GrowthLogic",
            content: "I use it every morning before meetings. It's like having a world-class speech coach in my pocket.",
            avatar: "https://i.pravatar.cc/150?u=james"
        }
    ];

    const features = [
        {
            icon: <Zap className="w-6 h-6 text-indigo-500" />,
            title: "Real-time Feedback",
            description: "Get instant micro-adjustments on your pace, clarity, and tone while you speak."
        },
        {
            icon: <MessageCircle className="w-6 h-6 text-cyan-500" />,
            title: "Advanced Sentiment",
            description: "Understand the emotional impact of your message before you speak it."
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
            title: "Deep Analytics",
            description: "Track your progress over time with detailed charts on vocabulary and delivery."
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-500" />,
            title: "Private & Secure",
            description: "Your recordings are processed locally and never stored without consent."
        }
    ];

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-['Inter'] selection:bg-indigo-500/30 transition-colors duration-700`}>
            {/* Floating Sparkles Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.1, 0.4, 0.1],
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className={`absolute w-1.5 h-1.5 rounded-full bg-indigo-500/20 blur-[1px]`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Logo className="h-16 w-auto object-contain self-center" />
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                        <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-2"></div>
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-black shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Go to Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-black shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>

                    <button className="md:hidden text-slate-900 dark:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient min-h-[90vh]">
                <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-8 mx-auto`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-[12px] font-black uppercase tracking-wider text-indigo-600">Real-time sentiment v2.4</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hero-heading mx-auto mb-8 text-center"
                    >
                        Speak Like It's Your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-500">Native Language</span>
                        —Naturally, Without Second-Guessing
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hero-description mt-8 mb-12 max-w-[650px] mx-auto text-center"
                    >
                        Remember when you stopped translating in your head and just spoke in your native language? That's what confident communication feels like. CommSage helps you break the anxious patterns that make every conversation feel like a performance—so you can finally speak without fear of judgment.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Enter Dashboard <ArrowRight className="w-6 h-6" />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Start Free Trial <ArrowRight className="w-6 h-6" />
                            </button>
                        )}
                        <button className="flex items-center gap-3 text-slate-900 dark:text-white font-black hover:text-indigo-600 transition-colors group">
                            <div className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-indigo-50/50 transition-all">
                                <Play className="w-5 h-5 fill-current" />
                            </div>
                            Watch Demo
                        </button>
                    </motion.div>
                </div>

                {/* Floating Cards System - Positioned Right */}
                <div className="hidden lg:flex items-center gap-8 absolute right-[15%] top-1/2 -translate-y-1/2">
                    {/* CARD 1 - Happiness Loop Card (LEFT) */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="py-6 px-8 rounded-[20px] bg-white dark:bg-slate-800 min-w-[280px] flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
                        style={{
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        {/* Icon Circle */}
                        <div 
                            className="w-[50px] h-[50px] rounded-[15px] flex items-center justify-center flex-shrink-0"
                            style={{
                                background: "linear-gradient(135deg, #ffd4e5 0%, #ffb8d2 100%)"
                            }}
                        >
                            <Heart className="w-6 h-6 text-pink-600 fill-pink-600/30" />
                        </div>
                        {/* Text Content */}
                        <div className="flex flex-col gap-1">
                            <h3 
                                className="text-[1.3rem] font-bold uppercase tracking-[1px]"
                                style={{ color: "#e91e63" }}
                            >
                                Happiness
                            </h3>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400 leading-tight">
                                Loop Active
                            </p>
                        </div>
                    </motion.div>

                    {/* CONNECTOR - Gradient Line with Dots */}
                    <motion.div
                        className="flex items-center gap-0 relative"
                        animate={{ opacity: [0.6, 1, 0.6], scaleX: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Left dot */}
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-pink-500 shadow-lg" />
                        {/* Gradient line */}
                        <div
                            className="h-1 w-[100px] rounded-[10px]"
                            style={{
                                background: "linear-gradient(90deg, #ff69b4 0%, #00d2a0 100%)"
                            }}
                        />
                        {/* Right dot */}
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-lg" />
                    </motion.div>

                    {/* CARD 2 - Confidence Card (RIGHT) */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="py-6 px-8 rounded-[20px] bg-white dark:bg-slate-800 min-w-[280px] hover:-translate-y-0.5 transition-transform"
                        style={{
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            {/* Icon Circle */}
                            <div 
                                className="w-[50px] h-[50px] rounded-[15px] flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, #d4f4dd 0%, #b8f4c8 100%)"
                                }}
                            >
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            {/* Text Content */}
                            <div className="flex flex-col gap-1">
                                <h3 
                                    className="text-[1.3rem] font-bold uppercase tracking-[1px]"
                                    style={{ color: "#00b894" }}
                                >
                                    Confidence
                                </h3>
                                <p className="text-base font-semibold text-slate-600 dark:text-slate-400 leading-tight">
                                    <span className="text-[1.6rem] font-black" style={{ color: "#00b894" }}>+24%</span>{" "}
                                    <span>Improved</span>
                                </p>
                            </div>
                        </div>

                        {/* 3D Progress Bar */}
                        <div 
                            className="relative w-full h-[10px] rounded-[10px] overflow-hidden"
                            style={{
                                background: "#e0e0e0",
                                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                className="relative h-full rounded-[10px]"
                                style={{
                                    background: "linear-gradient(90deg, #00b894 0%, #00d2a0 100%)",
                                    boxShadow: "0 2px 4px rgba(0, 184, 148, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                                }}
                            >
                                {/* 3D Glossy highlight */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-[40%] rounded-t-[10px]"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)"
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Cards (Stacked Vertically) */}
                <div className="flex lg:hidden flex-col items-center gap-6 mt-16 px-6">
                    {/* Happiness Card */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="py-5 px-6 rounded-[20px] bg-white dark:bg-slate-800 w-full max-w-[320px] flex items-center gap-4"
                        style={{
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div 
                            className="w-[45px] h-[45px] rounded-[12px] flex items-center justify-center flex-shrink-0"
                            style={{
                                background: "linear-gradient(135deg, #ffd4e5 0%, #ffb8d2 100%)"
                            }}
                        >
                            <Heart className="w-5 h-5 text-pink-600 fill-pink-600/30" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-bold uppercase tracking-[1px]" style={{ color: "#e91e63" }}>
                                Happiness
                            </h3>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loop Active</p>
                        </div>
                    </motion.div>

                    {/* Vertical Connector */}
                    <motion.div
                        className="flex flex-col items-center gap-0"
                        animate={{ opacity: [0.6, 1, 0.6], scaleY: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-pink-500 shadow-lg" />
                        <div className="w-1 h-[80px] rounded-[10px]" style={{ background: "linear-gradient(180deg, #ff69b4 0%, #00d2a0 100%)" }} />
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-lg" />
                    </motion.div>

                    {/* Confidence Card */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="py-5 px-6 rounded-[20px] bg-white dark:bg-slate-800 w-full max-w-[320px]"
                        style={{
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div 
                                className="w-[45px] h-[45px] rounded-[12px] flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, #d4f4dd 0%, #b8f4c8 100%)"
                                }}
                            >
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-lg font-bold uppercase tracking-[1px]" style={{ color: "#00b894" }}>
                                    Confidence
                                </h3>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    <span className="text-xl font-black" style={{ color: "#00b894" }}>+24%</span> Improved
                                </p>
                            </div>
                        </div>
                        <div 
                            className="relative w-full h-2 rounded-full overflow-hidden"
                            style={{
                                background: "#e0e0e0",
                                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, #00b894 0%, #00d2a0 100%)",
                                    boxShadow: "0 2px 4px rgba(0, 184, 148, 0.3)"
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Happiness Mood Selector (Your Unique Feature) */}
            < section className="py-12 bg-white dark:bg-slate-900 border-y border-black/5" >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Personalize Your Practice Environment</p>
                    <div className="flex items-center justify-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-[2rem] w-fit mx-auto shadow-inner">
                        {(Object.keys(moodConfig) as Array<keyof typeof moodConfig>).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMood(m)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-black transition-all duration-500 ${mood === m ? `bg-indigo-600 text-white shadow-xl shadow-indigo-500/20` : 'text-slate-400 hover:text-slate-600 hover:bg-white'}`}
                            >
                                {moodConfig[m].icon}
                                <span>{moodConfig[m].text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section >

            {/* Feature Grid - Refined to match "Light" version */}
            < section id="features" className="py-32 bg-slate-50 dark:bg-slate-950" >
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-20">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Designed for Daily Growth</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">Why thousands of leaders choose CommSage to start their day.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-white dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all group hover:border-indigo-500/50"
                            >
                                <div className="mb-8 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 shadow-inner inline-block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title mb-4">{feature.title}</h3>
                                <p className="feature-text">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Interactive Voice Demo Section - Refined to be "Lighter" */}
            < section className="py-32 px-6 relative bg-white dark:bg-slate-900 rounded-[3rem] lg:rounded-[10rem] mx-4 lg:mx-20 text-slate-900 dark:text-white overflow-hidden text-center border border-black/5 dark:border-white/10 shadow-2xl shadow-indigo-500/5" >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 via-white to-cyan-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 -z-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white">Try the Magic Now.</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xl mb-12 font-medium max-w-2xl mx-auto">Click the button below and speak. Our AI will analyze your vibe instantly.</p>

                    <div className="relative inline-block">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsRecording(!isRecording)}
                            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-indigo-600 text-white shadow-[0_0_60px_rgba(79,70,229,0.3)]' : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white border-2 border-indigo-100 dark:border-indigo-900/50 shadow-xl'}`}
                        >
                            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                            {isRecording && (
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full bg-indigo-500"
                                />
                            )}
                        </motion.button>
                        <p className="mt-8 font-black uppercase tracking-[0.2em] text-xs text-slate-400 dark:text-slate-500">
                            {isRecording ? "Listening to your greatness..." : "Click to start recording"}
                        </p>
                    </div>

                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-12 flex items-center justify-center gap-1.5 h-12"
                        >
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 40, 10] }}
                                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                                    className="w-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full opacity-60"
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </section >

            {/* Pricing Section */}
            < section id="pricing" className="py-32 bg-white dark:bg-slate-950" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Choose Your Path</h2>

                        <div className="flex items-center justify-center gap-6 mb-12">
                            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === "monthly" ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(prev => prev === "monthly" ? "annual" : "monthly")}
                                className="relative w-16 h-9 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5 transition-all shadow-inner"
                            >
                                <div className={`w-6 h-6 bg-indigo-600 rounded-full transition-transform shadow-lg ${billingCycle === "annual" ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === "annual" ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Annual</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
                        <PricingTier
                            name="Free"
                            price={0}
                            description="For explorers starting their communication journey."
                            billingCycle={billingCycle}
                            features={[
                                "3 AI coaching sessions / month",
                                "Basic transcription",
                                "Community access",
                                "Streak tracking"
                            ]}
                        />
                        <PricingTier
                            name="Pro"
                            price={19}
                            highlight={true}
                            popularBadge={true}
                            description="For professionals who take their growth seriously."
                            billingCycle={billingCycle}
                            features={[
                                "Unlimited AI coaching",
                                "Advanced sentiment analysis",
                                "Real-time voice analysis",
                                "Founder's Circle access",
                                "Custom progress reports"
                            ]}
                        />
                        <PricingTier
                            name="Max"
                            price={39}
                            description="The ultimate coaching experience for elite speakers."
                            billingCycle={billingCycle}
                            features={[
                                "Everything in Pro",
                                "Priority AI processing",
                                "Visual Agent access",
                                "1-on-1 AI Mentor clones",
                                "Enterprise integration"
                            ]}
                        />
                    </div>
                </div>
            </section >

            {/* Testimonials */}
            < section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-black/5" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="p-10 rounded-[3rem] bg-white dark:bg-slate-800 shadow-xl border border-black/5 relative">
                                <div className="absolute -top-6 -right-6 text-indigo-500 opacity-20">
                                    <Heart className="w-20 h-20 fill-current" />
                                </div>
                                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-8 italic leading-relaxed">"{t.content}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-indigo-100" />
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white">{t.name}</h4>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Final CTA */}
            < section className="py-32 overflow-hidden relative" >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Ready to <span className="text-indigo-600">smile?</span></h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 font-medium">Join 50,000+ people mastering their voice with joy.</p>
                    <button
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                        className="px-12 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isAuthenticated ? 'Go to Dashboard' : 'Join CommSage Now — Free.'}
                    </button>
                </div>
            </section >

            <footer className="py-16 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Main Footer Content */}
                    <div className="mb-12">
                        {/* Brand Column */}
                        <div className="max-w-md">
                            <div className="flex items-center gap-2.5 mb-6">
                                <Logo className="h-10" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                AI-powered communication coaching platform to elevate your professional growth.
                            </p>

                            {/* App Store Badges */}
                            <div className="flex flex-col gap-3 mb-6">
                                <a href="#" className="inline-block">
                                    <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" className="h-10" />
                                </a>
                                <a href="#" className="inline-block">
                                    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-14" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <p className="text-slate-400 text-sm">© 2026 CommSage. All rights reserved.</p>
                            <div className="flex items-center gap-4 text-sm">
                                <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookie Policy</a>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="YouTube">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default LandingPage;
