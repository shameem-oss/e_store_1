import UserModel from "../models/userRegister.js"; // ✅ Ensure correct file path
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ImageModel from "../models/imageSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({ success: true, message: users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const registerUser = async (req, res) => {
  console.log(req.body)
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    req.body.password = hashedPassword;

    if (req.file) {
      const image = await ImageModel.create({
        filename: Date.now() + "_" + req.file.originalname,
        data: req.file.buffer,
      });
      req.body.profile_avatar = `http://localhost:6100/images/${image.filename}`;
    }
    const newUser = await UserModel.create(req.body);
    res.json({ success: true, message: newUser });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.header("token", token).json({ success: true, data: user });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


