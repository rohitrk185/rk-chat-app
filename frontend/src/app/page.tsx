"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";

import { useChats } from "@/hooks/useChat";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Chat } from "@/types";

export default function Home() {
  const { chats, isLoading, error, refetchChats } = useChats();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // This function will be called by ChatList after a new chat is created
  const handleChatCreated = () => {
    // Refetch the entire chat list to include the new one
    refetchChats();
    // In a more advanced implementation, you might get the new chat object
    // back from the API and add it to the state directly, then select it.
    // For now, refetching is simple and effective.
  };

  return (
    <main className="flex h-screen w-full bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="flex flex-col w-full max-w-xs border-r border-slate-700 bg-slate-800">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-xl font-bold">Chats</h1>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
        <ChatList
          chats={chats}
          isLoading={isLoading}
          error={error}
          onChatSelect={setSelectedChat}
          selectedChatId={selectedChat?.chatId || null}
          onChatCreated={handleChatCreated} // Pass the new handler down
        />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex items-center justify-center">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-slate-500" />
              <h2 className="mt-2 text-xl font-medium text-slate-400">
                Select a chat to start messaging
              </h2>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
