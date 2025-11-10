import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authroutes from "./routes/auth.route.js";


import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());// allows you to parse the body of the request
app.use(cookieParser());
app.use("/api/auth", authroutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
