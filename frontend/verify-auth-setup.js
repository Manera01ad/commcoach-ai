#!/usr/bin/env node

/**
 * Authentication Setup Verification Script
 * Checks if all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = __dirname;

console.log('🔍 Verifying Authentication Setup...\n');

const checks = [
    {
        name: 'Supabase Client Configuration',
        path: 'src/lib/supabaseClient.ts',
        required: true
    },
    {
        name: 'Updated AuthContext',
        path: 'src/contexts/AuthContext.tsx',
        required: true
    },
    {
        name: 'ProtectedRoute Component',
        path: 'src/components/ProtectedRoute.tsx',
        required: true
    },
    {
        name: 'Updated App.tsx with Router',
        path: 'App.tsx',
        required: true
    },
    {
        name: 'Environment Example File',
        path: '.env.example',
        required: true
    },
    {
        name: 'Production Environment File',
        path: '.env.production',
        required: true
    },
    {
        name: 'Local Environment File',
        path: '.env.local',
        required: false,
        warning: 'Create this file from .env.example for local development'
    },
    {
        name: 'Authentication Setup Documentation',
        path: 'AUTH_SETUP.md',
        required: true
    }
];

let allPassed = true;
let warnings = [];

checks.forEach(check => {
    const filePath = path.join(FRONTEND_DIR, check.path);
    const exists = fs.existsSync(filePath);

    if (exists) {
        console.log(`✅ ${check.name}`);
    } else {
        if (check.required) {
            console.log(`❌ ${check.name} - MISSING`);
            allPassed = false;
        } else {
            console.log(`⚠️  ${check.name} - Not found`);
            if (check.warning) {
                warnings.push(check.warning);
            }
        }
    }
});

console.log('\n📦 Checking Dependencies...\n');

const packageJson = require('./package.json');
const requiredDeps = {
    '@supabase/supabase-js': '2.x',
    'react-router-dom': '7.x'
};

Object.entries(requiredDeps).forEach(([dep, version]) => {
    if (packageJson.dependencies[dep]) {
        console.log(`✅ ${dep} (${packageJson.dependencies[dep]})`);
    } else {
        console.log(`❌ ${dep} - MISSING`);
        allPassed = false;
    }
});

console.log('\n📋 Environment Variables Check...\n');

const envLocal = path.join(FRONTEND_DIR, '.env.local');
if (fs.existsSync(envLocal)) {
    const envContent = fs.readFileSync(envLocal, 'utf-8');
    const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
        'VITE_API_URL'
    ];

    requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
            const hasValue = !envContent.match(new RegExp(`${varName}=\\s*$`, 'm'));
            if (hasValue) {
                console.log(`✅ ${varName} is set`);
            } else {
                console.log(`⚠️  ${varName} is defined but empty`);
                warnings.push(`Set ${varName} in .env.local`);
            }
        } else {
            console.log(`❌ ${varName} - MISSING`);
            warnings.push(`Add ${varName} to .env.local`);
        }
    });
} else {
    console.log('⚠️  .env.local not found - copy from .env.example');
    warnings.push('Create .env.local from .env.example');
}

console.log('\n' + '='.repeat(60) + '\n');

if (allPassed && warnings.length === 0) {
    console.log('✨ All checks passed! Authentication setup is complete.\n');
    console.log('Next steps:');
    console.log('1. Ensure .env.local has correct Supabase credentials');
    console.log('2. Run: npm run dev');
    console.log('3. Test login/signup flow');
    console.log('4. Deploy to Vercel');
    console.log('\nSee AUTH_SETUP.md for detailed instructions.\n');
} else {
    if (!allPassed) {
        console.log('❌ Some required files are missing. Please check the errors above.\n');
    }
    if (warnings.length > 0) {
        console.log('⚠️  Warnings:\n');
        warnings.forEach(warning => console.log(`   - ${warning}`));
        console.log('');
    }
}

process.exit(allPassed ? 0 : 1);
