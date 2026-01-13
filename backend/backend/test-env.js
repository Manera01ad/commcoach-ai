import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing environment variables...\n');
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ?
    `${process.env.GEMINI_API_KEY.substring(0, 10)}...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 5)}` :
    'NOT SET');
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);

console.log('\n---');
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('❌ GEMINI_API_KEY is not properly set!');
    console.log('Please check backend/.env file');
} else {
    console.log('✅ GEMINI_API_KEY is set correctly!');
    console.log('Length:', process.env.GEMINI_API_KEY.length, 'characters');
}
