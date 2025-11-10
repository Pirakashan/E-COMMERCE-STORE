// Import the Express framework to create routes
import express from "express";

// Import the controller functions that contain the logic for signup, login, and logout
import { login, logout, signup } from "../controllers/auth.controller.js";

// Create a new router instance
// Routers allow you to define routes modularly instead of putting all routes in server.js
const router = express.Router();

// Define the POST route for user signup
// When a client sends a POST request to /api/auth/signup, the signup controller handles it
router.post("/signup", signup);

// Define the POST route for user login
// When a client sends a POST request to /api/auth/login, the login controller handles it
router.post("/login", login);

// Define the POST route for user logout
// When a client sends a POST request to /api/auth/logout, the logout controller handles it
router.post("/logout", logout);

// Export the router so it can be used in server.js
// In server.js, it will be mounted on the /api/auth path
export default router;



/*
Full Flow When User Clicks Signup Button

Client sends POST /api/auth/signup with { name, email, password }.

server.js sees /api/auth → forwards request to authroutes.

auth.route.js matches /signup → calls signup controller.

Controller handles database logic → response → client.
*/ 