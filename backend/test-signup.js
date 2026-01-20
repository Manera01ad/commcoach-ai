import { supabase, supabaseAdmin, createUserProfile, getUserById } from './config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function testSignup() {
    try {
        console.log('🧪 Testing Signup Flow...\n');

        const testEmail = `test_${Date.now()}@example.com`;
        const testPassword = 'test123456';
        const testFullName = 'Test User';

        console.log('1️⃣ Testing Supabase Auth Signup...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: { full_name: testFullName }
            }
        });

        if (authError) {
            console.error('❌ Auth Error:', authError);
            throw authError;
        }

        if (!authData.user) {
            console.error('❌ No user returned from auth signup');
            throw new Error('No user returned');
        }

        console.log('✅ Auth user created:', authData.user.id);
        console.log('   Email:', authData.user.email);

        console.log('\n2️⃣ Checking if profile exists...');
        const existingProfile = await getUserById(authData.user.id).catch((err) => {
            console.log('   No existing profile (expected):', err.message);
            return null;
        });

        if (existingProfile) {
            console.log('✅ Profile already exists (trigger worked!)');
        } else {
            console.log('📝 Creating profile manually...');
            try {
                const profile = await createUserProfile(authData.user.id, testEmail, testFullName);
                console.log('✅ Profile created:', profile);
            } catch (profileError) {
                console.error('❌ Profile creation error:', profileError);
                throw profileError;
            }
        }

        console.log('\n3️⃣ Verifying profile exists...');
        const finalProfile = await getUserById(authData.user.id);
        console.log('✅ Profile verified:', finalProfile);

        console.log('\n🎉 Signup test completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
    }
}

testSignup();
