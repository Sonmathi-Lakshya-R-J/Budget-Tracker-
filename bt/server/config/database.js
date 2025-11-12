const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/budget-tracker',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Server will continue to run, but database operations will fail.');
    console.error('Please ensure MongoDB is running and try again.');
    // Don't exit - allow server to start for better error messages
  }
};

module.exports = connectDB;

