/**
 * Simple connection test script to verify Frontend-Backend connection
 * Run this script: node test-connection.js
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function testConnection() {
    console.log('🔍 Testing Frontend-Backend Connection...\n');
    console.log(`Backend URL: ${BACKEND_URL}\n`);

    try {
        // Test 1: Health Check
        console.log('Test 1: Health Check');
        const healthResponse = await fetch(`${BACKEND_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health Check:', healthData);
        console.log('');

        // Test 2: Root Endpoint
        console.log('Test 2: Root Endpoint');
        const rootResponse = await fetch(`${BACKEND_URL}/`);
        const rootData = await rootResponse.json();
        console.log('✅ Root Endpoint:', rootData.message);
        console.log('Available endpoints:', Object.keys(rootData.endpoints || {}));
        console.log('');

        // Test 3: Get Next Form No (requires branch parameter)
        console.log('Test 3: Get Next Form No');
        try {
            const formNoResponse = await fetch(`${BACKEND_URL}/api/getNextFormNo?branch=Karamveer nagar satara`);
            const formNoData = await formNoResponse.json();
            if (formNoResponse.ok) {
                console.log('✅ Get Next Form No:', formNoData);
            } else {
                console.log('⚠️  Get Next Form No:', formNoData.error || 'Failed');
            }
        } catch (error) {
            console.log('⚠️  Get Next Form No: Endpoint may require database setup');
        }
        console.log('');

        console.log('✅ Connection test completed!');
        console.log('\n📝 Next Steps:');
        console.log('1. Ensure MySQL database is running and configured');
        console.log('2. Create .env files for both Frontend and Backend');
        console.log('3. Start backend server: cd Nad_Dhyas_Backend-main && npm start');
        console.log('4. Start frontend server: cd Nad_Dhyas_Frantend-main && npm run dev');
        
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure backend server is running on', BACKEND_URL);
        console.log('2. Check if backend is accessible in browser:', `${BACKEND_URL}/health`);
        console.log('3. Verify BACKEND_URL environment variable is correct');
    }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ This script requires Node.js 18+ or install node-fetch');
    console.log('Alternative: Test connection in browser console or use curl/Postman');
} else {
    testConnection();
}
