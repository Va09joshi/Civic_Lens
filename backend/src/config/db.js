const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/civiclens';

    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connected successfully');

    // Enable indexes in production
    if (process.env.NODE_ENV === 'production') {
      await mongoose.connection.db.collection('users').ensureIndex({ email: 1 }, { unique: true });
      await mongoose.connection.db.collection('posts').ensureIndex({ createdAt: -1 });
      await mongoose.connection.db.collection('posts').ensureIndex({ location: '2dsphere' });
      console.log('✅ Indexes created');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
