import React from 'react';

interface TherapyMessageProps {
    content: string;
    section: 'mirror' | 'prescription';
}

export const TherapyMessage: React.FC<TherapyMessageProps> = ({ content, section }) => (
    <div className="relative my-6 animate-in slide-in-from-left duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl" />

        <div className="relative bg-gradient-to-br from-purple-900/15 to-indigo-900/15 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl shadow-purple-900/20">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30 flex items-center justify-center">
                    <span className="text-2xl">
                        {section === 'mirror' ? '🪞' : '💊'}
                    </span>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-3">
                        {section === 'mirror' ? 'The Mirror' : 'The Prescription'}
                    </h3>
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                        {content}
                    </p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-b-2xl opacity-50" />
        </div>
    </div>
);
