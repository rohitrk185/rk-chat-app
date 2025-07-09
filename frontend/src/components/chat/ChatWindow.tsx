import { Chat } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { SendHorizonal } from "lucide-react";

interface ChatWindowProps {
  chat: Chat;
}

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const { otherUser } = chat;

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-slate-700 bg-slate-800">
        <Avatar
          src={otherUser.imageUrl}
          fallback={otherUser.username?.[0] || "U"}
        />
        <div className="ml-4">
          <p className="font-semibold">
            {otherUser.username || "Unknown User"}
          </p>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>

      {/* Message List (Placeholder for now) */}
      <div className="flex-1 p-6 overflow-y-auto">
        <p className="text-center text-slate-400">
          This is the beginning of your conversation with {otherUser.username}.
        </p>
        {/* Messages will be rendered here */}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full pr-12 pl-4 py-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-500 hover:bg-sky-600 transition-colors">
            <SendHorizonal className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
