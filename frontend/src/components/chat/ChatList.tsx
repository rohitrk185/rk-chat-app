import { Search } from "lucide-react";
import ChatListItem from "@/components/chat/ChatListItem";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { Chat } from "@/types";

// Define a more specific type for our chat object for better type safety

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}

const ChatList = ({ chats, isLoading, error }: ChatListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="p-4 space-y-3">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-red-400">
            <p>Error loading chats:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <nav className="p-2 space-y-1">
            {chats.map((chat) => (
              <ChatListItem key={chat.chatId} chat={chat} />
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default ChatList;
