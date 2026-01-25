// Native fetch used

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function verify() {
    console.log('--- CommCoach AI System Verification ---');
    console.log(`Target: ${BACKEND_URL}\n`);

    const checks = [
        { name: 'Health Check', path: '/health' },
        { name: 'API Info', path: '/api' },
        { name: 'Missions API', path: '/api/missions/today' },
        { name: 'Streak API', path: '/api/streak/stats' },
        { name: 'Agent Models', path: '/api/gemini/models' }
    ];

    for (const check of checks) {
        try {
            const start = Date.now();
            const res = await fetch(`${BACKEND_URL}${check.path}`);
            const duration = Date.now() - start;

            if (res.ok || res.status === 401) { // 401 is okay because it means auth is working but we lack a token
                console.log(`✅ ${check.name.padEnd(15)}: [${res.status}] ${duration}ms`);
            } else {
                console.log(`❌ ${check.name.padEnd(15)}: [${res.status}] ${duration}ms`);
            }
        } catch (e) {
            console.log(`❌ ${check.name.padEnd(15)}: FAILED (${e.message})`);
        }
    }

    console.log('\nVerification Complete.');
}

verify();
