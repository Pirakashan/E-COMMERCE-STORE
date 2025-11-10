// Import mongoose to define schemas and interact with MongoDB
import mongoose from "mongoose";

// Import bcryptjs to hash passwords securely
import bcrypt from "bcryptjs";

// Define the schema for a User collection
const userSchema = new mongoose.Schema({

    // Name field
    name:{
        type: String,                     // Data type: String
        required: [true, "Name is required"] // Validation: must provide a name
    },

    // Email field
    email:{
        type: String,                     // Data type: String
        required: [true, "Email is required"], // Validation: must provide an email
        unique: true,                     // Ensures no two users have the same email
        lowercase: true,                  // Converts email to lowercase before saving
        trim: true                        // Removes extra spaces at start and end
    },

    // Password field
    password:{
        type: String,                     // Data type: String
        required: [true, "Password is required"], // Validation: must provide a password
        minlength: [6, "Password must be at least 6 characters long"] // Minimum length check
    },

    // Cart items for e-commerce functionality
    cardItems:[
        {
            quantity:{
                type: Number,            // Quantity of the product in cart
                default: 1               // Default quantity is 1 if not specified
            },
            product:{
                type: mongoose.Schema.Types.ObjectId, // Reference to a Product document
                ref: "Product"                        // Reference collection name
            }
        }
    ],

    // User role: either customer or admin
    role:{
        type: String,                     // Data type: String
        enum: ["customer", "admin"],      // Allowed values only
        default: "customer"               // Default role is "customer"
    }

},
{
    // Schema options
    timestamps: true // Automatically add createdAt and updatedAt fields
});





//pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error){
      next(error);
    }
});

// john 123456
// 1234567 => invalid credentials
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const user = mongoose.model("User",userSchema);

export default user;


/*
Full Flow When a User Signs Up

Controller (signup) calls User.create({ name, email, password }).

Pre-save hook hashes the password before saving.

Mongoose saves the user document in MongoDB with hashed password.

Password comparison (comparePassword) is used later during login to authenticate the user.
*/ 