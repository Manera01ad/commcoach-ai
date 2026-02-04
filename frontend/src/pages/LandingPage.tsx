import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
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
                        <img
                            src="/commsage-logo.png?v=3"
                            alt="CommSage"
                            className="h-28 object-contain bg-white rounded-xl p-2 shadow-sm"
                        />
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
            <section className="relative pt-40 pb-24 overflow-hidden mesh-gradient">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-8`}
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
                            className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.95]"
                        >
                            Master the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-500">Art of Voice.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-xl leading-relaxed font-medium"
                        >
                            Empower your professional growth with AI-driven communication coaching.
                            Feel confident, charismatic, and happy about your progress.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
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

                    {/* 3D Visual Refined */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                        className="relative perspective-[2000px] cursor-pointer"
                        onMouseMove={handleHeroMouseMove}
                        onMouseLeave={() => setRotate({ x: 0, y: 0 })}
                        ref={heroCardRef}
                    >
                        <div
                            className="relative p-4 rounded-[3rem] glass-card shadow-2xl border border-white/20 transform-gpu transition-all duration-200"
                            style={{
                                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=1200"
                                alt="AI Dashboard"
                                className="rounded-[2rem] w-full shadow-2xl"
                            />

                            {/* Floating Stat Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 -right-6 lg:right-4 p-6 rounded-[2rem] glass-card shadow-2xl border border-white/30 backdrop-blur-2xl"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                        <TrendingUp className="text-emerald-500 w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Confidence</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">+24% Improved</p>
                                    </div>
                                </div>
                                <div className="h-2.5 w-48 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "85%" }}
                                        transition={{ delay: 1, duration: 1.5 }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </motion.div>

                            {/* Floating Mood Bubble */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -left-6 p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-indigo-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-pink-600 fill-pink-600/20" />
                                    </div>
                                    <p className="font-black text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">Happiness Loop</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Happiness Mood Selector (Your Unique Feature) */}
            <section className="py-12 bg-white dark:bg-slate-900 border-y border-black/5">
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
            </section>

            {/* Feature Grid - Refined to match "Light" version */}
            <section id="features" className="py-32 bg-slate-50 dark:bg-slate-950">
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
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed font-medium">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Voice Demo Section - Refined to be "Lighter" */}
            <section className="py-32 px-6 relative bg-white dark:bg-slate-900 rounded-[3rem] lg:rounded-[10rem] mx-4 lg:mx-20 text-slate-900 dark:text-white overflow-hidden text-center border border-black/5 dark:border-white/10 shadow-2xl shadow-indigo-500/5">
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
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 bg-white dark:bg-slate-950">
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
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-black/5">
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
            </section>

            {/* Final CTA */}
            <section className="py-32 overflow-hidden relative">
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
            </section>

            <footer className="py-12 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2.5">
                        <img src="/commsage-logo.png?v=3" alt="CommSage" className="h-24 object-contain bg-white rounded-xl p-2 shadow-sm" />
                    </div>
                    <p className="text-slate-400 text-sm font-bold tracking-wider">© 2026 MADE WITH ❤️ BY GOOGLE DEEPMIND TEAM</p>
                    <div className="flex gap-6 text-sm font-bold text-slate-400">
                        <a href="#" className="hover:text-indigo-600">Privacy</a>
                        <a href="#" className="hover:text-indigo-600">Terms</a>
                        <a href="#" className="hover:text-indigo-600">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
