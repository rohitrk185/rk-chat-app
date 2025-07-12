import { Chat, Message } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { SendHorizonal } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@clerk/nextjs";
import { FormEvent, useEffect, useState } from "react";
import { getMessagesForChat } from "@/services/chatApi";

interface ChatWindowProps {
  chat: Chat;
}

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const { otherUser } = chat;
  console.log("otherUser: ", otherUser);

  const socket = useSocket();
  const { getToken, userId: currentUserId } = useAuth();

  const displayName =
    `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
    otherUser.username ||
    "Unknown User";

  const fallback = displayName[0] || "U";

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // Fetch initial message history
  useEffect(() => {
    if (!chat.chatId) {
      return;
    }

    const fetchMessages = async () => {
      const fetchedMessages = await getMessagesForChat(chat.chatId, getToken);
      setMessages(fetchedMessages);
    };

    fetchMessages();
  }, [chat.chatId, getToken]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) {
      return;
    }

    // Join the chat room
    socket.emit("joinRoom", chat.chatId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      // Add the new message to the state if it belongs to the current chat
      if (message.chatId === chat.chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    socket.on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
      // socket.emit("leaveRoom", chat.chatId);
    };
  }, []);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket) {
      return;
    }

    socket.emit("sendMessage", {
      text: newMessage,
      chatId: chat.chatId,
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-slate-700 bg-slate-800">
        <Avatar src={otherUser.imageUrl} fallback={fallback} />
        <div className="ml-4">
          <p className="font-semibold">{displayName}</p>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>

      {/* Message List (Placeholder for now) */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-slate-400">
            This is the beginning of your conversation with {otherUser.username}
            .
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender.clerkId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div>
                {msg.sender.clerkId !== currentUserId && (
                  <Avatar
                    src={msg.sender.imageUrl}
                    fallback={msg.sender.username?.[0] || "U"}
                  />
                )}
              </div>

              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender.clerkId === currentUserId ? "bg-sky-500 text-white" : "bg-slate-700 text-white"}`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-slate-800 border-t border-slate-700"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type={"submit"}
            disabled={!newMessage.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-500 hover:bg-sky-600 transition-colors"
          >
            <SendHorizonal className="h-5 w-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
