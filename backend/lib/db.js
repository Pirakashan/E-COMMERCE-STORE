// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Export an asynchronous function to connect to the MongoDB database
export const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string stored in environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log a success message with the host name
    // The backticks allow us to use template literals for easy string interpolation
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during connection, log the error message
    console.error("❌ Error connecting to MongoDB:", error.message);

    // Exit the process with a failure code (1) to prevent the server from running without a database
    process.exit(1);
  }
};




/*
Full Flow in the App

server.js calls connectDB() when starting the server.

connectDB attempts to connect to MongoDB using Mongoose.

If successful → prints success message → app continues running.

If failed → prints error → exits process → server does not start.

*/
