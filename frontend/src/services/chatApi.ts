import { Chat } from "@/types";

/**
 * Fetches the list of chats for the currently authenticated user.
 *
 * @param getToken - A function that returns a Promise resolving to the
 * authentication token for the current user, or null if the user is not
 * authenticated.
 *
 * @returns A Promise resolving to the list of chats for the user.
 *
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If the API URL is not configured.
 * @throws {Error} If the request to fetch the chats fails.
 */
export const getChats = async (
  getToken: () => Promise<string | null>
): Promise<Chat[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${apiUrl}/api/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }

  return response.json();
};
