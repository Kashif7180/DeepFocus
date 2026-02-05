const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/activities';

const testAPI = async () => {
    try {
        console.log('--- Starting API Tests ---\n');

        // 1. Create a new activity
        console.log('1. Testing: Create Activity...');
        const createRes = await axios.post(BASE_URL, {
            title: "Learn MongoDB Native Driver",
            category: "Web",
            expectedTime: 2,
            actualTime: 1.5,
            date: "2026-01-28"
        });
        const newId = createRes.data.activityId;
        console.log('✅ Created! ID:', newId);

        // 2. Get all activities (testing filtering)
        console.log('\n2. Testing: Get Activities for today...');
        const getRes = await axios.get(`${BASE_URL}?date=2026-01-28`);
        console.log('✅ Found:', getRes.data.length, 'activities');

        // 3. Get Insights
        console.log('\n3. Testing: Get Insights...');
        const insightRes = await axios.get(`${BASE_URL}/insights`);
        console.log('✅ Insights Status:', insightRes.data.status);
        console.log('✅ Efficiency:', insightRes.data.totals.efficiency);

        // 4. Update the activity
        console.log('\n4. Testing: Update Activity...');
        await axios.put(`${BASE_URL}/${newId}`, {
            title: "Master MongoDB Native Driver",
            category: "Web",
            expectedTime: 2,
            actualTime: 3, // Increased time to change status
            date: "2026-01-28"
        });
        console.log('✅ Updated successfully!');

        // 5. Delete activity
        console.log('\n5. Testing: Delete Activity...');
        const delRes = await axios.delete(`${BASE_URL}/${newId}`);
        console.log('✅ Deleted!', delRes.data.message);

        console.log('\n--- All Tests Passed! ---');
    } catch (error) {
        console.error('\n❌ Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
        console.log('\nMake sure your server is running (node server.js) before running this test.');
    }
};

testAPI();
