import React, { useState, useEffect } from 'react';
import { MousePointer2, Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrowserStep {
    type: 'navigate' | 'click' | 'type' | 'read' | 'think';
    url?: string;
    selector?: string; // CSS selector of element to interact with
    text?: string;
    coordinates?: { x: number; y: number };
    description: string;
}

interface MockBrowserProps {
    isVisible: boolean;
    onClose: () => void;
    currentStep?: BrowserStep;
    logs?: string[];
}

const BrowserWindow: React.FC<MockBrowserProps> = ({ isVisible, onClose, currentStep, logs = [] }) => {
    const [url, setUrl] = useState('about:blank');
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Percentage based
    const [typedText, setTypedText] = useState('');

    // Simulate typing effect
    useEffect(() => {
        if (currentStep?.type === 'type' && currentStep.text) {
            let i = 0;
            setTypedText('');
            const interval = setInterval(() => {
                setTypedText(prev => prev + (currentStep.text?.[i] || ''));
                i++;
                if (i >= (currentStep.text?.length || 0)) clearInterval(interval);
            }, 50); // Typing speed
            return () => clearInterval(interval);
        } else {
            setTypedText('');
        }
    }, [currentStep]);

    // Simulate navigation address bar update
    useEffect(() => {
        if (currentStep?.url) {
            setUrl(currentStep.url);
        }
    }, [currentStep]);

    // Simulate cursor movement (simplified random movement towards "center" for now if no coords)
    useEffect(() => {
        if (currentStep?.type === 'click' || currentStep?.type === 'type') {
            // Move to a "target" area (simulating an input box or button)
            setCursorPos({ x: 30 + Math.random() * 40, y: 30 + Math.random() * 20 });
        }
    }, [currentStep]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    className="fixed bottom-4 right-4 w-[400px] h-[300px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-50 flex flex-col font-mono text-sm"
                >
                    {/* Browser Toolbar (Address Bar) */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center gap-2 border-b border-gray-700">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-950 rounded px-2 py-1 text-xs text-gray-400 flex items-center gap-2 truncate">
                            {currentStep?.type === 'think' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                            <span className="truncate">{url}</span>
                        </div>
                    </div>

                    {/* Browser Viewport (The "Content") */}
                    <div className="flex-1 relative bg-gray-50 dark:bg-gray-950 p-4 overflow-hidden relative">

                        {/* Mock Content Placeholder */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none">
                            <div className="text-4xl font-bold text-gray-500">WEB</div>
                        </div>

                        {/* Simulated Elements being interacted with */}
                        <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
                            {currentStep?.type === 'type' && (
                                <div className="w-3/4 p-2 border border-blue-500 rounded bg-white dark:bg-gray-800 shadow-sm animate-pulse">
                                    <span className="text-gray-800 dark:text-gray-200">{typedText}<span className="animate-blink border-r-2 border-black dark:border-white ml-0.5 h-4 inline-block align-middle"></span></span>
                                </div>
                            )}

                            {currentStep?.type === 'click' && (
                                <div className="px-4 py-2 bg-blue-600 text-white rounded shadow-lg transform scale-105 transition-transform">
                                    {currentStep.description || "Clicking..."}
                                </div>
                            )}

                            {currentStep?.type === 'read' && (
                                <div className="text-xs text-green-500 font-mono bg-green-900/10 p-2 rounded">
                                    Scanning page content...
                                </div>
                            )}
                        </div>

                        {/* The Ghost Cursor */}
                        <motion.div
                            className="absolute z-50 pointer-events-none"
                            animate={{
                                left: `${cursorPos.x}%`,
                                top: `${cursorPos.y}%`
                            }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            <MousePointer2 className="w-6 h-6 text-black fill-white drop-shadow-md" />
                            {currentStep?.description && (
                                <div className="absolute left-6 top-6 bg-yellow-300 text-black text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-sm border border-yellow-400">
                                    {currentStep.description}
                                </div>
                            )}
                        </motion.div>

                    </div>

                    {/* Status Bar / Logs */}
                    <div className="h-[80px] bg-gray-900 border-t border-gray-800 p-2 overflow-y-auto font-mono text-[10px] text-green-400">
                        {logs.slice().reverse().map((log, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                                <span>{log}</span>
                            </div>
                        ))}
                        {logs.length === 0 && <span className="text-gray-600">Waiting for agent actions...</span>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BrowserWindow;
