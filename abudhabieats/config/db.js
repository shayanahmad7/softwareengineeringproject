require('dotenv').config();  // This loads the environment variables from .env
const mongoose = require('mongoose');

const uri = process.env.STRING;  // Retrieve the connection string from environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
