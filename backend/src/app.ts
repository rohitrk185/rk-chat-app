import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { clerkMiddleware } from "@clerk/express";
import { createServer } from "http";
import { Server } from "socket.io";

import { handleClerkWebhook } from "./routes/clerkWebhook";
import userRoutes from "./routes/users";
import chatRoutes from "./routes/chats";

// Load env vars from .env.local
dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// --- Middleware ---
// CORS: Allow requests from frontend
app.use(cors({ origin: process.env.CORS_ORIGIN }));
// JSON Parser
app.use(express.json());
app.use(clerkMiddleware());

// --- Webhooks ---
// Webhook Route: Special case for Clerk webhook, needs raw body
app.post(
  "/api/webhooks/clerk/auth",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

// --- API Routes ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// --- Error Handler ---
app.use(errorHandler);

// --- Socket.io ---
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
  });
});

// --- Server Startup ---
// Start http server instead of Express app
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`CORS is configured to allow origin: ${process.env.CORS_ORIGIN}`);
// });
