import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors"; // ✅ Added CORS
import userRoutes from "./routes/userRouter.js"; 
import productRoutes from "./routes/productRouter.js"; // ✅ Consistent naming
import orderRoutes from "./routes/orderRoutes.js";
import { auth } from "./middlewares/authentication.js";
import Stripe from "stripe";
// ✅ Load environment variables first
config();

const app = express();
const PORT = 6100;

// ✅ Initialize Stripe AFTER loading env variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Use CORS to prevent fetch errors (Customize origins if needed)
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend app running on port 5173
}));
app.use(express.static("./views"))
app.use(express.json());

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "2_e-store",
    });
    console.log("✅ Successfully connected to database");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
}

// Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { carts } = req.body;
    if (!carts || !Array.isArray(carts) || carts.length === 0) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    console.log(carts); // ✅ Debugging log

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: carts.map((item) => {
        if (!item.title) {
          throw new Error(`Missing title for item: ${JSON.stringify(item)}`);
        }
        
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.title, // ✅ Fixed from item.name to item.title
              images: item.image && Array.isArray(item.image) ? item.image.slice(0, 2) : [], // Ensure images is an array
            },
            unit_amount: Math.round((item.price || 0) * 100), // Prevent errors if price is missing
          },
          quantity: item.quantity || 1, // Default to 1 if quantity is missing
        };
      }),
      mode: "payment",
      success_url: `http://localhost:5173?success=true`,
      cancel_url: `http://localhost:5173/?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// ✅ Routes
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", auth, orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

connectDB();
