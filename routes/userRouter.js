import { Router } from "express";
import multer from "multer"
import { auth } from "../middlewares/authentication.js";
import { getAllUsers, loginUser, registerUser } from "../controller/userController.js";
const upload=multer()
const router = Router();

router.get("/", auth,getAllUsers);
router.post("/register",upload.none(), registerUser);
router.post("/login", loginUser);

export default router;
