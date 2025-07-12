import Avatar from "@/components/ui/Avatar";

// Define the type for a single chat, matching the props for this component
type Chat = {
  chatId: string;
  otherUser: {
    username: string | null;
    imageUrl: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  lastMessage: {
    text: string;
    createdAt: string;
  } | null;
};

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
}

const ChatListItem = ({ chat, isSelected, onSelect }: ChatListItemProps) => {
  const lastMessageText = chat.lastMessage?.text || "No messages yet";
  const truncatedText =
    lastMessageText.length > 25
      ? `${lastMessageText.substring(0, 25)}...`
      : lastMessageText;

  const displayName =
    `${chat.otherUser.firstName || ""} ${chat.otherUser.lastName || ""}`.trim() ||
    chat.otherUser.username ||
    "Unknown User";

  const fallback = displayName[0] || "U";

  // Use a dynamic class for the background color
  const itemClasses = `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
    isSelected ? "bg-sky-500/30" : "hover:bg-slate-700"
  }`;

  return (
    <div onClick={onSelect} className={itemClasses}>
      <Avatar src={chat.otherUser.imageUrl} fallback={fallback} />
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold truncate">{displayName}</p>
        <p className="text-sm text-slate-400 truncate">{truncatedText}</p>
      </div>
      {/* We can add a timestamp or notification dot here later */}
    </div>
  );
};

export default ChatListItem;
