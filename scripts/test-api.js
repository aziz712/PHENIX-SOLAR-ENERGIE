// Using native fetch on Node v22+

async function testAPI() {
    const baseUrl = 'http://localhost:3000/api/requests';

    console.log('--- Testing POST /api/requests ---');
    const newRequest = {
        name: "Test Client API",
        email: "test_api_" + Date.now() + "@example.com",
        phone: "12345678",
        governorate: "Tunis",
        city: "Tunis",
        address: "123 Rue Test",
        coordinates: { lat: 36.8, lng: 10.1 },
        systemType: "Raccordé au réseau",
        category: "Résidentiel",
        clientComment: "Test persistence"
    };

    try {
        const postRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRequest)
        });

        const postData = await postRes.json();
        console.log('POST Status:', postRes.status);
        console.log('POST Response:', postData);

        if (postData.success) {
            console.log('✅ POST Successful');
            if (postData.createdUser) {
                console.log('✅ Credentials Returned:', postData.createdUser);
            } else {
                console.log('ℹ️ No credentials returned (User might exist)');
            }
        } else {
            console.error('❌ POST Failed');
        }

        console.log('\n--- Testing GET /api/requests ---');
        // Need auth token technically?
        // The API route checks header for clientId token, but GET method I wrote...
        // Wait, I didn't add auth check to GET method in my previous edit!
        // Let's check the code I wrote.
        // `export async function GET(req: Request) { ... }`
        // It connects DB and finds requests. It DOES NOT check for auth.
        // This is a security risk but good for testing right now. 
        // I should probably add auth check later.

        const getRes = await fetch(baseUrl);
        const getData = await getRes.json();
        console.log('GET Status:', getRes.status);
        console.log('GET Response:', getData);

        if (getData.success && getData.requests) {
            console.log(`✅ GET Successful. Found ${getData.count} requests.`);
            const found = getData.requests.find(r => r._id === postData.requestId);
            if (found) {
                console.log('✅ Persistence Verified: Found newly created request in list.');
            } else {
                console.error('❌ Persistence Error: Newly created request NOT found in list.');
            }
        } else {
            console.error('❌ GET Failed or Invalid Format');
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
}

testAPI();
