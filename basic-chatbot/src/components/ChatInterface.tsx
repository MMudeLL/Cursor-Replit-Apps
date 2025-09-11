"use client";
import { useChat } from "ai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { InputField } from "./InputField";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorDisplay } from "./ErrorDisplay";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const MODELS = [
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5" },
];

export function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("ai:model") || "gpt-4o" : "gpt-4o"
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    setMessages,
    reload,
  } = useChat({
    api: "/api/openai/chat",
    body: { model: selectedModel },
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("ai:model", selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai:history");
      if (raw) {
        const parsed: ChatMessage[] = JSON.parse(raw);
        setMessages(parsed);
      }
    } catch {}
  }, [setMessages]);

  useEffect(() => {
    try {
      localStorage.setItem("ai:history", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[80vh] border rounded-md shadow-sm bg-white dark:bg-neutral-900 text-black dark:text-white flex flex-col">
        <header className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-base font-semibold text-center">OpenAI Chatbot</h1>
        </header>

        <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4">
          {!hasMessages && (
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Start the conversation by typing below.</div>
          )}
          <MessageList messages={messages as ChatMessage[]} />
          {isLoading && <div className="mt-2"><LoadingIndicator text="Assistant is typing…" /></div>}
          {error && <div className="mt-2"><ErrorDisplay message={(error as any)?.message || "Something went wrong."} /></div>}
        </div>

        <div className="px-4 pt-2 pb-3 border-t border-neutral-200 dark:border-neutral-800">
          <InputField
            value={input}
            onChange={handleInputChange}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e as any, { body: { model: selectedModel } });
            }}
            disabled={isLoading}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <select
              className="border rounded px-2 py-1 text-sm bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            {isLoading ? (
              <button className="text-sm px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700" onClick={stop}>Stop generating</button>
            ) : (
              <button className="text-sm px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700" onClick={() => reload()}>Retry last</button>
            )}
            <button
              className="text-sm px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700"
              onClick={() => {
                setMessages([]);
                localStorage.removeItem("ai:history");
              }}
            >
              New chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;


