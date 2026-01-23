// Using built-in fetch (available in Node 18+)

const BASE_URL = 'http://127.0.0.1:3001/api/ai';

async function testEndpoints() {
    console.log('🚀 Starting AI Routing Tests...\n');

    try {
        // 1. Test Status
        console.log('--- Testing /status ---');
        const statusRes = await fetch(`${BASE_URL}/status`);
        const statusData = await statusRes.json();
        console.log('Status:', statusData.success ? '✅ Operational' : '❌ Failed');
        console.log('Providers:', Object.keys(statusData.providers).join(', '));
        console.log('');

        // 2. Test Providers
        console.log('--- Testing /providers ---');
        const providersRes = await fetch(`${BASE_URL}/providers`);
        const providersData = await providersRes.json();
        console.log('Available Tiers:', Object.keys(providersData.providers).join(', '));
        console.log('');

        // 3. Test Text Generation
        console.log('--- Testing /generate ---');
        const genRes = await fetch(`${BASE_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: 'Say "AI Routing is working" in 5 words.',
                config: { temperature: 0.7 }
            })
        });
        const genData = await genRes.json();
        if (genData.success) {
            console.log('Response:', genData.text);
            console.log('Provider used:', genData.provider);
            console.log('Fallback used:', genData.fallbackUsed);
        } else {
            console.log('❌ Generation failed:', genData.error);
        }
        console.log('');

        // 4. Test Costs
        console.log('--- Testing /costs ---');
        const costsRes = await fetch(`${BASE_URL}/costs`);
        const costsData = await costsRes.json();
        console.log('Total Requests:', costsData.totals.requests);
        console.log('Total Cost:', costsData.totals.cost);
        console.log('');

        console.log('🎉 Tests completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.log('\nMake sure the server is running on http://localhost:3001');
    }
}

testEndpoints();
