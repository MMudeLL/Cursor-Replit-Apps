"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "./ChatInterface";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} />)
      )}
    </div>
  );
}

function MessageBubble({ role, content }: { role: ChatMessage["role"]; content: string }) {
  const isAssistant = role === "assistant";
  return (
    <div className={`max-w-3xl ${isAssistant ? "self-start" : "self-end"}`}>
      <div className={`border rounded p-3 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700`}>
        <div className="text-xs mb-1 text-neutral-600 dark:text-neutral-300">{isAssistant ? "Assistant" : role === "user" ? "You" : "System"}</div>
        <div className="prose prose-sm max-w-none prose-invert:dark">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            className="text-xs text-neutral-600 dark:text-neutral-300 hover:underline"
            onClick={() => navigator.clipboard.writeText(content)}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}


