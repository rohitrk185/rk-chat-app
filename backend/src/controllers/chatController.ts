import type { Request, Response } from "express";
import { db } from "../lib/db";
import { getAuth } from "@clerk/express";

/**
 * Retrieves and returns a list of chats for the authenticated user.
 *
 * This function extracts the user ID from the request's authentication token.
 * It queries the database to find all chats involving the authenticated user,
 * ordered by the most recent update time. Each chat includes the details of
 * the other participant and the last message sent in the chat.
 *
 * The response is formatted to be frontend-friendly and includes:
 * - chatId: The unique identifier of the chat.
 * - otherUser: The details of the other user in the chat, including their
 *   clerkId, username, and imageUrl.
 * - lastMessage: The most recent message sent in the chat.
 *
 * If the user is not authenticated, a 401 error is returned.
 * If an error occurs during the process, a 500 error is returned with a
 * relevant error message.
 *
 * @param req - The request object containing authentication and query info.
 * @param res - The response object used to send the result or error.
 */

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const { userId: currentUserId } = getAuth(req);
    if (!currentUserId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Find all the chats, current user is in
    const chats = await db.chat.findMany({
      where: {
        participants: {
          some: {
            user: {
              clerkId: currentUserId,
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        // Include participants and their details
        participants: {
          include: {
            user: {
              select: {
                clerkId: true,
                // email: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
        // Include the last message sent in the chat
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Format the data to be more frontend-friendly
    const formattedChats = chats.map((chat) => {
      // Find the other participant in the chat
      const otherUser = chat.participants.find(
        (p) => p.user.clerkId !== currentUserId
      )?.user;

      const lastMessage = chat.messages[0];

      return {
        chatId: chat.id,
        otherUser: otherUser,
        lastMessage,
      };
    });

    res.status(200).json(formattedChats);
    return;
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

/**
 * Creates a new chat between the authenticated user and another user or
 * returns an existing one.
 *
 * This function requires the authenticated user to provide the ID of the
 * other user they want to chat with. If the authenticated user is not
 * provided, a 401 error is returned.
 *
 * This function first checks if a chat already exists between the two users.
 * If it does, the existing chat is returned.
 *
 * If no chat exists, a new chat is created in a transaction and the new chat
 * is returned.
 *
 * If an error occurs during the process, a 500 error is returned with a
 * relevant error message.
 *
 * @param req - The request object containing authentication and body info.
 * @param res - The response object used to send the result or error.
 */
export const getOrCreateChat = async (req: Request, res: Response) => {
  try {
    const { userId: currentUserId } = getAuth(req);
    if (!currentUserId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { otherUserId } = req.body;
    if (!otherUserId) {
      res.status(400).json({ error: "Missing otherUserId" });
      return;
    }

    // Find both users
    const currentUser = await db.user.findUnique({
      where: {
        clerkId: currentUserId,
      },
    });
    const otherUser = await db.user.findUnique({
      where: {
        clerkId: otherUserId,
      },
    });

    if (!currentUser || !otherUser) {
      res.status(404).json({ error: "User(s) not found" });
      return;
    }

    // Check if a chat already exists
    const existingChat = await db.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: currentUser.id } } },
          { participants: { some: { userId: otherUser.id } } },
        ],
        // Ensure it's a 1:1 chat
        participants: {
          every: {
            userId: {
              in: [currentUser.id, otherUser.id],
            },
          },
        },
      },
    });

    if (existingChat) {
      res.status(200).json(existingChat);
      return;
    }

    // Create new chat in a transaction
    const newChat = await db.$transaction(async (prisma) => {
      const createdChat = await prisma.chat.create({
        data: {},
      });

      await prisma.participant.createMany({
        data: [
          {
            chatId: createdChat.id,
            userId: currentUser.id,
          },
          {
            chatId: createdChat.id,
            userId: otherUser.id,
          },
        ],
      });

      return createdChat;
    });

    res.status(200).json(newChat);
    return;
  } catch (error) {
    console.error("Error getting or creating chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
