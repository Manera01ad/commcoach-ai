import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client with auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Auto-detect the current URL for redirects (works in both dev and production)
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Storage defaults to localStorage which is what we want
        storage: window.localStorage,
    },
});

/**
 * Get the current redirect URL based on environment
 * This ensures OAuth and Magic Links work in both localhost and production
 */
export const getRedirectUrl = (): string => {
    // In production (Vercel), use the production URL
    if (window.location.hostname === 'commcoach-ai.vercel.app') {
        return 'https://commcoach-ai.vercel.app';
    }

    // In development, use localhost with the current port
    return window.location.origin;
};

/**
 * Helper to get auth redirect options
 */
export const getAuthRedirectOptions = () => ({
    redirectTo: getRedirectUrl(),
});
