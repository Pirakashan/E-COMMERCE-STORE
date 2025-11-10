// Import the User model to interact with MongoDB
import { redis } from '../lib/redis.js';
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: "7d",
    });

    return { accessToken, refreshToken};
};

const storeRefreshToken = async(userId,refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7*24*60*60); // 7 days
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevents xss attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        samesite:"strict", // prevents CRRF attack, cross-site request forgery attack
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevents xss attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", // prevents CRRF attack, cross-site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
    });
};



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

        //authenticate
       const {accessToken, refreshToken}  = generateTokens(user._id);
       await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        // TODO: Authenticate user (e.g., generate JWT token)
        // This is where you would normally log in the user immediately after signup

        // Send a success response to the client
        res.status(201).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: "User created successfully" });
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
    try{
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refreshtoken:${decoded.userId}`);
        }
        
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message: "Logged out successfully"});
    } catch (error){
        res.status(500).json({message: "Server error", error: error.message});

    }
    
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