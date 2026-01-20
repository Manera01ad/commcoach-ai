import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: Omit<ToastMessage, 'id'>) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast Component
const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-white dark:bg-neutral-900 border-green-500/20',
        error: 'bg-white dark:bg-neutral-900 border-red-500/20',
        warning: 'bg-white dark:bg-neutral-900 border-amber-500/20',
        info: 'bg-white dark:bg-neutral-900 border-blue-500/20'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColors[toast.type]} min-w-[320px] max-w-md pointer-events-auto`}
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[toast.type]}
            </div>
            <div className="flex-1 min-w-0">
                {toast.title && <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-0.5">{toast.title}</h4>}
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-snug">{toast.message}</p>
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
        const id = Date.now().toString();
        const newToast = { ...message, id };

        setToasts(prev => [...prev, newToast]);

        if (message.duration !== 0) {
            setTimeout(() => {
                hideToast(id);
            }, message.duration || 5000);
        }
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none p-4">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onDismiss={hideToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
