// Import the Express framework to create the server
import express from "express";

// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";

// Import your authentication routes from the routes folder
import authroutes from "./routes/auth.route.js";

// Import the function to connect to MongoDB from the db file
import { connectDB } from "./lib/db.js";

// Load environment variables from .env into process.env
dotenv.config();

// Create an instance of an Express application
const app = express();

// Get the port number from environment variables, default to 5000 if not set
const PORT = process.env.PORT || 5000;

// Middleware: Parse incoming JSON requests automatically
app.use(express.json());

// Mount authentication routes on the /api/auth path
// Any request to /api/auth will be handled by authroutes
app.use("/api/auth", authroutes);

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);

    // Connect to the MongoDB database once the server starts
    connectDB();
});
