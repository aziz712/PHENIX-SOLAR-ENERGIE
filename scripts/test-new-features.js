// Using native fetch on Node v22+
async function testNewFeatures() {
    const baseUrl = 'http://localhost:3000/api/requests';
    console.log('--- Testing New Features ---');

    // 1. Fetch all requests to get an ID
    console.log('Fetching all requests to get an ID...');
    const listRes = await fetch(baseUrl);
    const listData = await listRes.json();

    if (!listData.success || listData.requests.length === 0) {
        console.error('❌ No requests found to test with. Run create-admin or make a request first.');
        return;
    }

    const testId = listData.requests[0]._id;
    console.log(`Using Request ID: ${testId}`);

    // 2. Fetch Single Request Details
    console.log(`\nFetching details for ${testId}...`);
    const detailRes = await fetch(`${baseUrl}/${testId}`);
    const detailData = await detailRes.json();

    if (detailData.success && detailData.request) {
        console.log('✅ GET /api/requests/[id] successful');
        console.log('Current Status:', detailData.request.status);
    } else {
        console.error('❌ GET /api/requests/[id] failed', detailData);
    }

    // 3. Update Status
    const newStatus = 'Étude du projet';
    console.log(`\nUpdating status to "${newStatus}"...`);

    const updateRes = await fetch(`${baseUrl}/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    const updateData = await updateRes.json();

    if (updateData.success && updateData.request.status === newStatus) {
        console.log('✅ PATCH /api/requests/[id] successful');
        console.log('New Status:', updateData.request.status);
    } else {
        console.error('❌ PATCH /api/requests/[id] failed', updateData);
    }
}

testNewFeatures();
