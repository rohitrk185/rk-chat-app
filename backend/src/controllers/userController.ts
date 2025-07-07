import type { Response, Request } from "express";
import { db } from "../lib/db";
import { AuthenticatedRequest } from "../types";
import { getAuth } from "@clerk/express";

export async function searchUsers(req: Request, res: Response) {
  try {
    // const currentUserId = req.auth.;
    const { userId: currentUserId } = getAuth(req);
    if (!currentUserId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ error: "Email query parameter is required." });
    }

    const users = await db.user.findMany({
      where: {
        email: {
          contains: email,
          mode: "insensitive",
        },
        clerkId: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        username: true,
        imageUrl: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
}
