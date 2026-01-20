/**
 * Persona Selector Component
 * Allows users to choose their preferred AI persona
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Persona {
    id: string;
    name: string;
    description: string;
    archetype: string;
    directness: number;
    empathy: number;
    formality: number;
    humor: number;
    patience: number;
}

export const PersonaSelector: React.FC = () => {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchPersonas();
        fetchPreferredPersona();
    }, []);

    const fetchPersonas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/personas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setPersonas(data.personas);
            }
        } catch (error) {
            console.error('Error fetching personas:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPreferredPersona = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/personas/preferred', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedPersona(data.persona);
            }
        } catch (error) {
            console.error('Error fetching preferred persona:', error);
        }
    };

    const selectPersona = async (persona: Persona) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/personas/preferred', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personaId: persona.id })
            });

            if (response.ok) {
                setSelectedPersona(persona);
                setShowDetails(false);
            }
        } catch (error) {
            console.error('Error setting preferred persona:', error);
        }
    };

    const getPersonaIcon = (archetype: string) => {
        const icons: Record<string, string> = {
            drill_sergeant: '🎖️',
            empathetic_mirror: '💝',
            analyst: '📊',
            coach: '🏃',
            mentor: '👨‍🏫'
        };
        return icons[archetype] || '🤖';
    };

    const getPersonaColor = (archetype: string) => {
        const colors: Record<string, string> = {
            drill_sergeant: 'from-red-500 to-orange-500',
            empathetic_mirror: 'from-pink-500 to-purple-500',
            analyst: 'from-blue-500 to-cyan-500',
            coach: 'from-green-500 to-emerald-500',
            mentor: 'from-yellow-500 to-amber-500'
        };
        return colors[archetype] || 'from-gray-500 to-gray-600';
    };

    const TraitBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
        <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{label}</span>
                <span>{Math.round(value * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full bg-gradient-to-r ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Choose Your Coach</h2>
                {selectedPersona && (
                    <motion.button
                        className="text-sm text-blue-400 hover:text-blue-300"
                        onClick={() => setShowDetails(!showDetails)}
                        whileHover={{ scale: 1.05 }}
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </motion.button>
                )}
            </div>

            {/* Current Selection */}
            {selectedPersona && !showDetails && (
                <motion.div
                    className={`bg-gradient-to-r ${getPersonaColor(selectedPersona.archetype)} rounded-lg p-4 mb-6`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 text-white">
                        <span className="text-4xl">{getPersonaIcon(selectedPersona.archetype)}</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{selectedPersona.name}</h3>
                            <p className="text-sm opacity-90">{selectedPersona.description}</p>
                        </div>
                        <div className="text-2xl">✓</div>
                    </div>
                </motion.div>
            )}

            {/* Persona Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {personas.map((persona, index) => (
                    <motion.div
                        key={persona.id}
                        className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${selectedPersona?.id === persona.id
                                ? 'ring-2 ring-white'
                                : 'hover:ring-2 hover:ring-gray-600'
                            }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => selectPersona(persona)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`bg-gradient-to-br ${getPersonaColor(persona.archetype)} p-6`}>
                            <div className="text-center mb-4">
                                <div className="text-5xl mb-2">{getPersonaIcon(persona.archetype)}</div>
                                <h3 className="font-bold text-white text-lg mb-1">{persona.name}</h3>
                                <p className="text-white text-sm opacity-90">{persona.description}</p>
                            </div>

                            {showDetails && (
                                <motion.div
                                    className="mt-4 pt-4 border-t border-white/20"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <TraitBar label="Directness" value={persona.directness} color="from-red-400 to-red-600" />
                                    <TraitBar label="Empathy" value={persona.empathy} color="from-pink-400 to-pink-600" />
                                    <TraitBar label="Formality" value={persona.formality} color="from-blue-400 to-blue-600" />
                                    <TraitBar label="Humor" value={persona.humor} color="from-yellow-400 to-yellow-600" />
                                    <TraitBar label="Patience" value={persona.patience} color="from-green-400 to-green-600" />
                                </motion.div>
                            )}

                            {selectedPersona?.id === persona.id && (
                                <motion.div
                                    className="absolute top-2 right-2 bg-white text-green-500 rounded-full p-1"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <h4 className="text-white font-semibold mb-1">Choose Your Style</h4>
                        <p className="text-gray-400 text-sm">
                            Each coach has a unique personality. Pick the one that matches your learning style.
                            You can change this anytime!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonaSelector;
