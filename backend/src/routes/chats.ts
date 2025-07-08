import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getOrCreateChat, getUserChats } from "../controllers/chatController";

const router = Router();

router.get("/", requireAuth(), asyncHandler(getUserChats));

router.post("/", requireAuth(), asyncHandler(getOrCreateChat));

export default router;
