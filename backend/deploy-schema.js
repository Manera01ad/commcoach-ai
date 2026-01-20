import { supabaseAdmin } from './config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploySchema() {
    try {
        console.log('🚀 Starting schema deployment...\n');

        if (!supabaseAdmin) {
            console.error('❌ Supabase Admin client not initialized. Check your .env file.');
            process.exit(1);
        }

        // Read schema file
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        console.log('📄 Reading schema from:', schemaPath);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split SQL into individual statements (basic splitting by semicolon)
        // Note: This is a simple approach and may not work for all SQL
        const statements = schemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📊 Found ${statements.length} SQL statements\n`);

        // Execute each statement
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i] + ';'; // Add semicolon back
            
            // Skip comments and empty lines
            if (stmt.trim().startsWith('--') || stmt.trim() === ';') {
                continue;
            }

            try {
                // Get statement preview
                const preview = stmt.substring(0, 80).replace(/\s+/g, ' ');
                process.stdout.write(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

                const { error } = await supabaseAdmin.rpc('exec_sql', { sql: stmt });

                if (error) {
                    console.log(' ❌');
                    console.error('Error:', error.message);
                    errorCount++;
                } else {
                    console.log(' ✅');
                    successCount++;
                }
            } catch (err) {
                console.log(' ❌');
                console.error('Exception:', err.message);
                errorCount++;
            }
        }

        console.log('\n📊 Deployment Summary:');
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);

        if (errorCount === 0) {
            console.log('\n🎉 Schema deployment completed successfully!');
        } else {
            console.log('\n⚠️  Schema deployment completed with errors. Please check the logs.');
        }

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

deploySchema();
