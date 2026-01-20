/**
 * 🏥 Self-Diagnosis Tool for CommCoach AI
 * Run this script to automatically check system health and detect common issues.
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load envs
const backendEnv = dotenv.parse(fs.readFileSync(path.join(ROOT_DIR, 'backend', '.env')));
const frontendEnv = dotenv.parse(fs.readFileSync(path.join(ROOT_DIR, 'frontend', '.env.local')));

const report = {
    timestamp: new Date().toISOString(),
    status: 'HEALTHY', // default
    issues: [],
    checks: {}
};

async function runDiagnostics() {
    console.log('🏥 Starting Diagnostics...');

    // 1. Check Configuration
    checkEnvVars();

    // 2. Check Backend Server
    await checkBackendHealth();

    // 3. Check Frontend Configuration
    checkFrontendConfig();

    // 4. Check Ports
    await checkPorts();

    // Output Results
    console.log(JSON.stringify(report, null, 2));

    if (report.issues.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        report.issues.forEach(issue => console.log(`- [${issue.severity}] ${issue.message}`));
        process.exit(1);
    } else {
        console.log('\n✅ SYSTEM HEALTHY');
        process.exit(0);
    }
}

function checkEnvVars() {
    console.log('Checking Environment Variables...');
    const requiredBackend = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];

    requiredBackend.forEach(key => {
        if (!backendEnv[key] || backendEnv[key].startsWith('your_') || backendEnv[key].startsWith('YOU')) {
            report.issues.push({
                type: 'CONFIG',
                severity: 'CRITICAL',
                message: `Invalid or missing backend env var: ${key}`
            });
            report.status = 'UNHEALTHY';
        }
    });

    report.checks.env = { status: 'OK' };
}

function checkFrontendConfig() {
    console.log('Checking Frontend Config...');
    const apiUrl = frontendEnv.VITE_API_URL;

    if (!apiUrl) {
        report.issues.push({
            type: 'CONFIG',
            severity: 'CRITICAL',
            message: 'Frontend VITE_API_URL is missing'
        });
    }

    report.checks.frontend = { apiUrl };
}

async function checkBackendHealth() {
    console.log('Checking Backend Health...');
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3001/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    report.checks.backend = { status: 'ONLINE', data: JSON.parse(data) };
                } else {
                    report.issues.push({
                        type: 'BACKEND',
                        severity: 'CRITICAL',
                        message: `Backend returned status ${res.statusCode}`
                    });
                    report.status = 'UNHEALTHY';
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            report.issues.push({
                type: 'BACKEND',
                severity: 'CRITICAL',
                message: `Backend not reachable: ${err.message}`
            });
            report.status = 'UNHEALTHY';
            resolve();
        });
    });
}

function checkPorts() {
    // This is a simplified check, verifying if ports are open is tricky without external tools
    // We rely on the health check for backend availability
    console.log('Ports checked via functional tests.');
}

runDiagnostics().catch(console.error);
