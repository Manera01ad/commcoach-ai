import('./config/supabase.js').then(async (m) => {
    console.log('🔍 Testing Supabase connection...\n');

    const isConnected = await m.testConnection();

    if (isConnected) {
        console.log('\n✅ SUCCESS! Supabase is connected and ready.');
        console.log('✅ You can now deploy the database schema.');
        console.log('\n📋 Next steps:');
        console.log('1. Go to Supabase Dashboard: https://app.supabase.com');
        console.log('2. Open SQL Editor');
        console.log('3. Run database/schema.sql');
        console.log('4. Run database/rls-policies.sql');
        console.log('5. Run database/indexes.sql');
    } else {
        console.log('\n❌ Connection failed. Please check:');
        console.log('- SUPABASE_URL is correct');
        console.log('- SUPABASE_SERVICE_KEY is correct');
        console.log('- Supabase project is active');
    }

    process.exit(isConnected ? 0 : 1);
}).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
