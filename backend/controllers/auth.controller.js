// Import the User model to interact with MongoDB
import User from "../models/user.model.js";

// --------------------------- SIGNUP CONTROLLER ---------------------------
// Handles user registration
export const signup = async (req, res) => {
    // Extract name, email, and password from the request body
    const { email, password, name } = req.body;

    try {
        // Check if a user with the given email already exists in the database
        const userExists = await User.findOne({ email });

        // If user exists, send a 400 Bad Request response
        if(userExists){
            return res.status(400).json({ message: "user already exists" });
        }

        // Create a new user in the database
        // The password will automatically be hashed because of the pre-save hook in user.model.js
        const user = await User.create({ name, email, password });

        // TODO: Authenticate user (e.g., generate JWT token)
        // This is where you would normally log in the user immediately after signup

        // Send a success response to the client
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        // If any error occurs (e.g., DB connection error), send 500 Internal Server Error
        res.status(500).json({ message: error.message });
    }
};

// --------------------------- LOGIN CONTROLLER ---------------------------
// Handles user login
export const login = async (req, res) => {
    // Placeholder for login logic
    // Eventually, this will check user credentials, generate a JWT token, and return it
    res.send("login route called");
};

// --------------------------- LOGOUT CONTROLLER ---------------------------
// Handles user logout
export const logout = async (req, res) => {
    // Placeholder for logout logic
    // Eventually, this will invalidate the user's token or session
    res.send("logout route called");
};





/*
Full Flow for Signup

Client → POST /api/auth/signup with JSON body { name, email, password }.

Server.js → routes request to auth.route.js.

auth.route.js → matches /signup → calls signup controller.

signup controller:

Checks if user exists in DB.

If not, creates a new user (password hashed automatically).

MongoDB → stores new user document.

Controller → sends response { message: "User created successfully" } back to client.
*/ 