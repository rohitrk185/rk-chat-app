import { Request, Response } from "express";
import { clerkAuthWebhook } from "../controllers/clerkWebhook";

export async function handleClerkWebhook(req: Request, res: Response) {
  try {
    await clerkAuthWebhook(req, res);
    return;
  } catch (error) {
    console.error("Error handling Clerk Auth webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}
