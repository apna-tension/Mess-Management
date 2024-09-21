require("dotenv").config();
const mongoose = require("mongoose");
// Correct the access to environment variables
const URI = process.env.MONGO_URI;

// Log the MongoDB URI to debug
// console.log('MongoDB URI:', URI); // Add this line to check if URI is being loaded

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);

    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Server Fail");

    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
