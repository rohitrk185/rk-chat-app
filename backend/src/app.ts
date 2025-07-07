import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleClerkWebhook } from "./routes/clerkWebhook";
import userRoutes from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";

// Load env vars from .env.local
dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: Allow requests from frontend
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// Webhook Route: Special case for Clerk webhook, needs raw body
app.post(
  "/api/webhooks/clerk/auth",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

// JSON Parser
app.use(express.json());

// --- API Routes ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/users", userRoutes);

// Add your other API routes here in the future
// For example:
// app.use('/api/users', userRoutes);
// app.use('/api/chats', chatRoutes);

// --- Error Handler ---
app.use(errorHandler);

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS is configured to allow origin: ${process.env.CORS_ORIGIN}`);
});
