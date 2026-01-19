import { supabase, supabaseAdmin, createUserProfile, getUserById } from '../config/supabase.js';

/**
 * Register a new user
 * POST /api/auth/signup
 */
export const signup = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        console.log('[SIGNUP] Request received:', { email, fullName });

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if Supabase is configured
        if (!supabase || !supabaseAdmin) {
            console.error('[SIGNUP] Supabase not configured');
            return res.status(500).json({ error: 'Database not configured. Please contact admin.' });
        }

        // 1. Sign up with Supabase Auth
        console.log('[SIGNUP] Creating auth user...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName } // Stored in auth.users metadata
            }
        });

        if (authError) {
            console.error('[SIGNUP] Auth error:', authError);
            throw authError;
        }

        if (!authData.user) {
            return res.status(400).json({ error: 'Signup failed. Please try again.' });
        }

        console.log('[SIGNUP] Auth user created:', authData.user.id);

        // 2. Create Profile in public schema (if not created by trigger)
        // Check if profile exists first
        console.log('[SIGNUP] Checking for existing profile...');
        const existingProfile = await getUserById(authData.user.id).catch((err) => {
            console.log('[SIGNUP] No existing profile found (expected):', err.message);
            return null;
        });

        if (!existingProfile) {
            console.log('[SIGNUP] Creating user profile...');
            try {
                await createUserProfile(authData.user.id, email, fullName);
                console.log('[SIGNUP] Profile created successfully');
            } catch (profileError) {
                console.error('[SIGNUP] Profile creation error:', profileError);
                throw new Error(`Profile creation failed: ${profileError.message}`);
            }
        }

        res.status(201).json({
            message: 'Registration successful! Please verify your email.',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                status: 'pending' // Default status
            }
        });

    } catch (error) {
        console.error('[SIGNUP] Error:', error);
        res.status(500).json({ error: error.message || 'Database error saving new user' });
    }
};

/**
 * Log in a user
 * POST /api/auth/signin
 */
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // 1. Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) throw authError;

        // 2. Check User Status in Profile
        const profile = await getUserById(authData.user.id);

        if (!profile) {
            return res.status(404).json({ error: 'User profile not found.' });
        }

        if (profile.status === 'suspended' || profile.status === 'rejected') {
            return res.status(403).json({ error: `Account is ${profile.status}. Contact support.` });
        }

        // Note: We allow 'pending' users to login, but frontend should restrict access

        res.status(200).json({
            message: 'Login successful',
            session: authData.session,
            user: {
                ...profile,
                auth_id: authData.user.id
            }
        });

    } catch (error) {
        console.error('Signin Error:', error);
        res.status(401).json({ error: error.message });
    }
};

/**
 * Log out a user
 * POST /api/auth/signout
 */
export const signout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get current user session
 * GET /api/auth/me
 */
export const getSession = async (req, res) => {
    try {
        // Typically checked via middleware, but this endpoint verifies token manually if needed
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token provided' });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) throw error;

        const profile = await getUserById(user.id);

        res.status(200).json({ user: profile });
    } catch (error) {
        res.status(401).json({ error: 'Invalid session' });
    }
};
