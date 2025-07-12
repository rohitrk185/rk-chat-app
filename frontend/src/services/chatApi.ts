import { Chat, UserProfile } from "@/types";

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
/**
 * Fetches the list of messages for a given chat.
 *
 * @param chatId - The unique identifier of the chat to fetch messages for.
 * @param getToken - A function that returns a Promise resolving to the
 * authentication token for the current user, or null if the user is not
 * authenticated.
 *
 * @returns A Promise resolving to the list of messages for the chat.
 *
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If the API URL is not configured.
 * @throws {Error} If the request to fetch the messages fails.
 */
export async function getMessagesForChat(
  chatId: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${apiUrl}/api/chats/${chatId}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return await response.json();
}

/**
 * Searches for users by email.
 *
 * This function requires the authenticated user to provide the email address
 * of the user(s) they want to search for. If the authenticated user is not
 * provided, a 401 error is returned.
 *
 * This function first checks if the API URL is configured. If it is not, a
 * 500 error is returned with a relevant error message.
 *
 * This function then sends a GET request to the API URL with the email query
 * parameter. The response is expected to be a JSON array of user profiles.
 *
 * If the request fails, a 500 error is returned with a relevant error message.
 *
 * @param email - The email address of the user(s) to search for.
 * @param getToken - A function that returns a Promise resolving to the
 * authentication token for the current user, or null if the user is not
 * authenticated.
 *
 * @returns A Promise resolving to an array of user profiles matching the
 * email query.
 *
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If the API URL is not configured.
 * @throws {Error} If the request to search for users fails.
 */
export async function searchUsersByEmail(
  email: string,
  getToken: () => Promise<string | null>
): Promise<UserProfile[]> {
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated.");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("API URL is not configured.");

  // Use URLSearchParams to safely encode the email query
  const params = new URLSearchParams({ email });
  const response = await fetch(
    `${apiUrl}/api/users/search?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search for users");
  }

  return response.json();
}

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
 * @param otherUserClerkId - The clerkId of the other user to create a chat
 * with.
 * @param getToken - A function that returns a Promise resolving to the
 * authentication token for the current user, or null if the user is not
 * authenticated.
 *
 * @returns A Promise resolving to the chat object.
 *
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If the API URL is not configured.
 * @throws {Error} If the request to get or create a chat fails.
 */
export async function getOrCreateChat(
  otherUserClerkId: string,
  getToken: () => Promise<string | null>
): Promise<Chat> {
  // Assuming the backend returns the full chat object
  const token = await getToken();
  if (!token) throw new Error("User is not authenticated.");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("API URL is not configured.");

  const response = await fetch(`${apiUrl}/api/chats`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otherUserId: otherUserClerkId }),
  });

  if (!response.ok) {
    throw new Error("Failed to get or create chat");
  }

  return response.json();
}
