import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export const useSocket = () => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket;

    const connectSocket = async () => {
      // We now request a short-lived JWT using a specific template.
      // You can name the template anything you like in your Clerk dashboard.
      // "chat-app-template" is a good example.
      const token = await getToken({ template: "chat-app-template" });
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!token || !apiUrl) {
        return;
      }

      newSocket = io(apiUrl, {
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("Connected to Socket.io server: ", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from Socket.io server: ", newSocket.id);
      });

      setSocket(newSocket);
    };

    connectSocket();

    // Cleanup
    return () => {
      if (!newSocket) {
        return;
      }
      newSocket.disconnect();
    };
  }, [getToken]);

  return socket;
};
