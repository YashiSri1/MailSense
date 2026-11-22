const mongoose = require('mongoose');
let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    let isMemory = false;
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.log('Local MongoDB not found. Falling back to in-memory database for Demo Mode...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      isMemory = true;
      console.log(`In-Memory MongoDB Connected`);
    }
    return isMemory;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

