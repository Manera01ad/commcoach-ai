import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Mic, Save, BrainCircuit } from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../constants';

interface CommDNAAssessmentProps {
    onComplete: (results: any) => void;
    onCancel: () => void;
}

const CommDNAAssessment: React.FC<CommDNAAssessmentProps> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>(new Array(ASSESSMENT_QUESTIONS.length).fill(''));
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAnswers = [...answers];
        newAnswers[step] = e.target.value;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (step < ASSESSMENT_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setAnalyzing(true);
        try {
            const token = localStorage.getItem('supabase.auth.token')
                ? JSON.parse(localStorage.getItem('supabase.auth.token')!).access_token
                : null;

            const structuredAnswers = ASSESSMENT_QUESTIONS.map((q, i) => ({
                question: q,
                answer: answers[i]
            }));

            const response = await fetch('/api/assessment/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers: structuredAnswers })
            });

            if (response.ok) {
                const result = await response.json();
                onComplete(result);
            } else {
                console.error('Failed to submit assessment');
            }
        } catch (error) {
            console.error('Error submitting assessment:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <BrainCircuit className="w-16 h-16 text-indigo-500 animate-spin-slow" />
                </div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                    Analyzing your CommDNA...
                </h3>
                <p className="text-neutral-500 max-w-md">
                    Our AI is decoding your communication patterns, identifying your strengths, and mapping your unique archetype.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        🧬 CommDNA Assessment
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Step {step + 1} of {ASSESSMENT_QUESTIONS.length}
                    </p>
                </div>
                <button onClick={onCancel} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300">
                    Cancel
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-neutral-100 dark:bg-neutral-800 w-full">
                <motion.div
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 p-8 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed">
                            {ASSESSMENT_QUESTIONS[step]}
                        </h3>

                        <div className="relative">
                            <textarea
                                value={answers[step]}
                                onChange={handleAnswerChange}
                                placeholder="Type your response here... (Be honest and detailed)"
                                className="w-full h-40 p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-lg"
                                autoFocus
                            />
                            {/* Analyze Hint */}
                            {answers[step].length < 20 && (
                                <p className="absolute bottom-4 right-4 text-xs text-amber-500 animate-pulse">
                                    More detail needed
                                </p>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${step === 0
                            ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" /> Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={answers[step].length < 10}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                    {step === ASSESSMENT_QUESTIONS.length - 1 ? (
                        <>Complete <Save className="w-5 h-5" /></>
                    ) : (
                        <>Next <ChevronRight className="w-5 h-5" /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CommDNAAssessment;
