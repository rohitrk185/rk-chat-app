// import { clerkClient } from "@clerk/express";
import { Clerk } from "@clerk/clerk-sdk-node";
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { db } from "../lib/db";

type IncomingMessage = {
  chatId: string;
  text: string;
};

// Initialize the Clerk client with your secret key
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Initializes the Socket.io service.
 * @param httpServer - The HTTP server instance to attach the socket service to.
 * @returns The Socket.io server instance.
 * @remarks
 * This function initializes the Socket.io service and enables real-time
 * communication between the client and the server. It sets up the Socket.io
 * server to listen for incoming connections, and defines event handlers for
 * various events such as "connection", "joinRoom", "sendMessage", "typing",
 * and "disconnect".
 */
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  // Socket Auth Middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      // const session = await clerkClient.sessions.verifySession(
      //   socket.id,
      //   token
      // );
      // (socket as any).userId = session.userId;
      // next();
      // Use the modern, networkless JWT verification method.
      const claims = await clerk.verifyToken(token);

      // The user's ID is in the 'sub' (subject) claim of the JWT.
      (socket as any).userId = claims.sub;
      next();
    } catch (error) {
      console.error("Error authenticating socket:", error);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Main Socket Connection Handler
  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    console.log(
      `Authenticated client connected: ${socket.id}, UserID: ${userId}`
    );

    // Join Chat Room
    socket.on("joinRoom", async (chatId: string) => {
      try {
        // verify the user is a memeber of the chat they are trying to join
        const chat = await db.chat.findUnique({
          where: {
            id: chatId,
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    clerkId: true,
                  },
                },
              },
            },
          },
        });

        if (
          !chat ||
          !chat.participants.some((p) => p.user.clerkId === userId)
        ) {
          socket.emit("error", "Unauthorized");
          return;
        }

        socket.join(chatId);
        console.log(
          `User ${userId} (${socket.id}) joined chat room: ${chatId}`
        );
      } catch (error) {
        console.error("Error joining chat room:", error);
        socket.emit("error", "Internal Server Error");
        return;
      }
    });

    // Handle incoming messages
    socket.on("sendMessage", async (data: IncomingMessage) => {
      const { chatId, text } = data;
      console.log(`User ${userId} (${socket.id}) sent message: ${text}`);

      try {
        const sender = await db.user.findUnique({
          where: {
            clerkId: userId,
          },
        });
        if (!sender) {
          socket.emit("error", "User not found");
          return;
        }

        const [newMessage] = await db.$transaction([
          db.message.create({
            data: {
              text,
              chatId,
              senderId: sender.id,
            },
            include: {
              sender: {
                select: {
                  clerkId: true,
                  username: true,
                  imageUrl: true,
                },
              },
            },
          }),
          db.chat.update({
            where: {
              id: chatId,
            },
            data: {
              updatedAt: new Date(),
            },
          }),
        ]);

        io.to(chatId).emit("message", newMessage);
        console.log(
          `Message from user ${userId} (${socket.id}) sent to chat room: ${chatId}`
        );
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Handle typing indicator
    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("typing", { userId });
    });

    // Handle stop typing indicator
    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping", { userId });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });

  console.log("Socket.io service initialized");
  return io;
};
