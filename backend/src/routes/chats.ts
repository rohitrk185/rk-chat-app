import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getChatMessages,
  getOrCreateChat,
  getUserChats,
} from "../controllers/chatController";

const router = Router();

// GET /api/chats - Fetches all chats for the logged-in user
router.get("/", requireAuth(), asyncHandler(getUserChats));

// POST /api/chats - Gets an existing chat or creates a new one
router.post("/", requireAuth(), asyncHandler(getOrCreateChat));

// GET /api/chats/:chatId/messages - Fetches messages for a sepcific chat
router.get("/:chatId/messages", requireAuth(), asyncHandler(getChatMessages));

export default router;
