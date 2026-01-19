import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

console.log('--- Verifying Admin Key ---');
console.log('URL:', url);
console.log('Key Length:', key ? key.length : 0);
console.log('Key Start:', key ? key.substring(0, 10) + '...' : 'NONE');

// Check if it looks like a JWT
if (key && key.split('.').length === 3) {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString());
    console.log('Key Role:', payload.role);
    if (payload.role !== 'service_role') {
        console.error('❌ FATAL: This is NOT a service_role key! It is a "' + payload.role + '" key.');
        console.error('👉 Please get the "service_role" secret from Supabase Settings > API.');
        process.exit(1);
    } else {
        console.log('✅ Key Role is correct (service_role).');
    }
} else {
    console.warn('⚠️ Key does not look like a valid JWT.');
}

const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function testAdmin() {
    try {
        // Try to select count from profiles (requires RLS bypass if no policy allows public read)
        // With service_role key, this ALWAYS works.
        const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Admin Query Failed:', error.message);
            process.exit(1);
        }

        console.log('✅ Admin Query Successful! Profile Count:', count);
    } catch (e) {
        console.error('❌ Connection Error:', e.message);
    }
}

testAdmin();
