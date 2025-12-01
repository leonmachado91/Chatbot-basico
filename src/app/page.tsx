"use client";

import { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add error handling UI here
      const errorMessage: Message = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Chatbot Grok
          </h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto pb-4 pt-4">
        <div className="mx-auto max-w-3xl space-y-4 px-4">
          {messages.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center text-zinc-500">
              <Sparkles className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-lg font-medium">Como posso ajudar você hoje?</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))
          )}
          {isLoading && (
            <div className="flex justify-start px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-1 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 z-10 bg-white dark:bg-black">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </main>
  );
}
