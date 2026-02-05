const { MongoClient } = require('mongodb');

let db;
let client;

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in .env file');
        }
        client = new MongoClient(uri);
        // Connect the client to the server
        await client.connect();

        // Select the database by name (from URI or explicitly)
        db = client.db('productivity_db');

        console.log('MongoDB Connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};

module.exports = { connectDB, getDB };
