import Avatar from "@/components/ui/Avatar";

// Define the type for a single chat, matching the props for this component
type Chat = {
  chatId: string;
  otherUser: {
    username: string | null;
    imageUrl: string | null;
  };
  lastMessage: {
    text: string;
    createdAt: string;
  } | null;
};

interface ChatListItemProps {
  chat: Chat;
  // We'll use this later to highlight the selected chat
  // isSelected?: boolean;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  const lastMessageText = chat.lastMessage?.text || "No messages yet";
  const truncatedText =
    lastMessageText.length > 25
      ? `${lastMessageText.substring(0, 25)}...`
      : lastMessageText;

  return (
    <a
      href="#" // We will replace this with routing logic later
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200"
    >
      <Avatar
        src={chat.otherUser.imageUrl}
        fallback={chat.otherUser.username?.[0] || "U"}
      />
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold truncate">
          {chat.otherUser.username || "Unknown User"}
        </p>
        <p className="text-sm text-slate-400 truncate">{truncatedText}</p>
      </div>
      {/* We can add a timestamp or notification dot here later */}
    </a>
  );
};

export default ChatListItem;
