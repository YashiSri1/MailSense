require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async (isMemory) => {
  const shouldSeedDemoData = isMemory || (process.env.NODE_ENV !== 'production' && await User.countDocuments() === 0);

  if (shouldSeedDemoData) {
    console.log(isMemory ? 'Seeding in-memory database...' : 'Empty development database detected. Seeding demo data...');
    const seedData = require('./src/utils/seed');
    await seedData();
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});
