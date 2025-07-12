import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export const useSocket = () => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket;

    const connectSocket = async () => {
      const token = await getToken();
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
