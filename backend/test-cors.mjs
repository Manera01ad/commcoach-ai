import fetch from 'node-fetch';

async function testOptions() {
    const url = 'http://localhost:3001/api/auth/signin';
    try {
        const response = await fetch(url, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://commcoach-ai.vercel.app',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });

        console.log('Status:', response.status);
        console.log('Headers:', JSON.stringify([...response.headers.entries()], null, 2));
        const body = await response.text();
        console.log('Body:', body);
    } catch (error) {
        console.error('Error:', error);
    }
}

testOptions();
