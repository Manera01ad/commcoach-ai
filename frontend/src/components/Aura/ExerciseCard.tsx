import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ExerciseCardProps {
    exercise: string;
    onComplete?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onComplete }) => {
    const [completed, setCompleted] = useState(false);

    const handleComplete = () => {
        setCompleted(true);
        if (onComplete) onComplete();
    };

    return (
        <div className={`relative p-6 aura-card transition-all duration-500 ${completed ? 'opacity-75 grayscale' : ''}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full blur-2xl" />

            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-xl">
                        💊
                    </div>
                    <h3 className="text-lg font-bold text-white">Daily Prescription</h3>
                </div>

                <div className="bg-neutral-950/40 rounded-xl p-4 mb-4 border border-purple-500/10">
                    <p className="text-neutral-200 text-sm leading-relaxed italic">
                        "{exercise}"
                    </p>
                </div>

                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${completed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                        }`}
                >
                    {completed ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                        </>
                    ) : (
                        'Complete Exercise'
                    )}
                </button>
            </div>
        </div>
    );
};
