import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { searchUsers } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/search", requireAuth(), asyncHandler(searchUsers));

export default router;
