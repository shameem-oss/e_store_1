import express from 'express';
import { createProducts, getAllProducts } from "../controller/productController.js"
const router = express.Router();


router.get("/",getAllProducts)
router.post("/add",createProducts)


export default router; // Default export
