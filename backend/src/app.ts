import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleClerkWebhook } from "./routes/clerkWebhook";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// 1. CORS: Allow requests from your frontend
app.use(cors({ origin: process.env.CORS_ORIGIN }));

//  Webhook Route: Special case for Clerk webhook, needs raw body
// This route must be defined *before* express.json()
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

// JSON Parser
app.use(express.json());

// --- API Routes ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Add your other API routes here in the future
// For example:
// app.use('/api/users', userRoutes);
// app.use('/api/chats', chatRoutes);

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS is configured to allow origin: ${process.env.CORS_ORIGIN}`);
});
