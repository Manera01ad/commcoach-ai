import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('Testing connection to:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('subscription_plans').select('count');
        if (error) throw error;
        console.log('✅ Connection Successful!');
        console.log('✅ Data retrieved:', data);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    }
}

testConnection();
