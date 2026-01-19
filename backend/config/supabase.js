import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('⚠️  Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
}

const isUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Supabase Admin Client (Service Role)
 */
export const supabaseAdmin = (SUPABASE_URL && isUrl(SUPABASE_URL) && SUPABASE_SERVICE_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    })
    : null;

/**
 * Supabase Client (Anon Key)
 */
export const supabase = (SUPABASE_URL && isUrl(SUPABASE_URL) && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: true, persistSession: true }
    })
    : null;

if (!supabase || !supabaseAdmin) {
    console.error('❌ CRITICAL: Supabase clients failed to initialize. Check your URL and keys.');
}


/**
 * Test database connection
 */
export async function testConnection() {
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('count')
            .limit(1);

        if (error) throw error;

        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
    if (!supabaseAdmin) throw new Error('Supabase client not initialized');
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
    if (!supabaseAdmin) throw new Error('Supabase client not initialized');
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
}

/**
 * Create user profile
 */
export async function createUserProfile(userId, email, fullName = null) {
    if (!supabaseAdmin) throw new Error('Supabase client not initialized');
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert({
            id: userId,
            email,
            full_name: fullName,
            status: 'pending', // Requires admin approval
            subscription_tier: 'free'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update user status (for admin approval)
 */
export async function updateUserStatus(userId, status, adminId = null) {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;

    // Log admin action
    if (adminId) {
        await supabaseAdmin.from('admin_actions').insert({
            admin_id: adminId,
            action_type: `user_${status}`,
            target_user_id: userId,
            details: { status }
        });
    }

    return data;
}

/**
 * Get pending users (for admin approval queue)
 */
export async function getPendingUsers() {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

export default supabaseAdmin;
