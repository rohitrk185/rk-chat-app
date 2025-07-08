"use client";

import { useChats } from "@/hooks/useChat";
import ChatList from "@/components/chat/ChatList";
import { UserButton } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const { chats, isLoading, error } = useChats();

  return (
    <main className="flex h-screen w-full bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="flex flex-col w-full max-w-xs border-r border-slate-700 bg-slate-800">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-xl font-bold">Chats</h1>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
        <ChatList chats={chats} isLoading={isLoading} error={error} />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-slate-500" />
          <h2 className="mt-2 text-xl font-medium text-slate-400">
            Select a chat to start messaging
          </h2>
          <p className="text-slate-500">
            Or search for a user to begin a new conversation.
          </p>
        </div>
      </div>
    </main>
  );
}
