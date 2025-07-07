import { RequestHandler, Response, Router } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { searchUsers } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/search",
  ClerkExpressWithAuth() as unknown as RequestHandler,
  asyncHandler(searchUsers)
);

export default router;
