import { Search } from "lucide-react";
import ChatListItem from "@/components/chat/ChatListItem";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { Chat, UserProfile } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getOrCreateChat, searchUsersByEmail } from "@/services/chatApi";
import Avatar from "../ui/Avatar";

// Define a more specific type for our chat object for better type safety

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  onChatSelect: (chat: Chat) => void;
  selectedChatId?: string | null;
  onChatCreated: () => void; // Add a callback for when a new chat is made
}

const ChatList = ({
  chats,
  isLoading,
  error,
  onChatSelect,
  selectedChatId,
  onChatCreated,
}: ChatListProps) => {
  const { getToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      try {
        const users = await searchUsersByEmail(searchQuery, getToken);
        setSearchResults(users);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(search, 300); // Wait 300ms after user stops typing
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, getToken]);

  const handleSelectSearchResult = async (user: UserProfile) => {
    try {
      await getOrCreateChat(user.clerkId, getToken);
      setSearchQuery("");
      setSearchResults([]);
      onChatCreated(); // Tell the parent page to refetch the chat list
    } catch (error) {
      console.error("Failed to create chat:", error);
      // You could show an error toast here
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {/* Search Results Dropdown */}
          {searchQuery ? (
            <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg z-10 shadow-lg">
              {isSearching ? (
                <p className="p-4 text-slate-400">Searching...</p>
              ) : null}
              {!isSearching && searchResults.length === 0 ? (
                <p className="p-4 text-slate-400">No users found.</p>
              ) : null}
              {searchResults.map((user) => (
                <div
                  key={user.clerkId}
                  onClick={() => handleSelectSearchResult(user)}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-700"
                >
                  <Avatar
                    src={user.imageUrl}
                    fallback={user.username?.[0] || "U"}
                  />
                  <div>
                    <p className="font-semibold">
                      {user.username || user.email}
                    </p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : null}
        {error ? (
          <div className="p-4 text-center text-red-400">
            <p>Error loading chats:</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}
        {!isLoading && !error ? (
          <nav className="p-2 space-y-1">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.chatId}
                chat={chat}
                isSelected={chat.chatId === selectedChatId}
                onSelect={() => onChatSelect(chat)}
              />
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
};

export default ChatList;
