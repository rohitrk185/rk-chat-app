import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { getChats } from "@/services/chatApi";
import { Chat } from "@/types";

export function useChats() {
  const { getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedChats = await getChats(getToken);
      setChats(fetchedChats);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [getToken]);

  return { chats, isLoading, error, refetchChats: fetchChats };
}
