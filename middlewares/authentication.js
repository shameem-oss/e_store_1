import jwt from "jsonwebtoken";
import UsersModel from "../models/userRegister.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer token"

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_CODE);
    console.log("Decoded token:", decoded); // Debugging

    // Look for the user in the database
    const user = await UsersModel.findById(decoded._id);
    console.log("User found:", user); // Debugging

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ success: false, message: err.message });
  }
};
