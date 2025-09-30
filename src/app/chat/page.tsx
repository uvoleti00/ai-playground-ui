"use client";

import { streamModelReply } from "@/shared/lib/stream.model.reply";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChatColumn } from "./chatcolumn";

export type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  // Separate message lists for each model
  const [messagesA, setMessagesA] = useState<Message[]>([]);
  const [messagesB, setMessagesB] = useState<Message[]>([]);

  const containerRefA = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const containerRefB = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (containerRefA.current) {
      containerRefA.current.scrollTop = containerRefA.current.scrollHeight;
    }
  }, [messagesA]);

  useEffect(() => {
    if (containerRefB.current) {
      containerRefB.current.scrollTop = containerRefB.current.scrollHeight;
    }
  }, [messagesB]);

  const handleSend = async () => {
    if (loading) return;
    const text = input.trim();
    if (!text) return;

    setLoading(true);

    // Add user message to both threads
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setMessagesA((m) => [...m, userMsg]);
    setMessagesB((m) => [...m, userMsg]);

    setInput("");
    inputRef.current?.focus();

    // Stream both models in parallel
    const addMessageA = (id: string, chunk: string) => {
      setMessagesA((m) => {
        const exists = m.find((msg) => msg.id === id);
        if (!exists) return [...m, { id, role: "ai", text: chunk }];
        return m.map((msg) =>
          msg.id === id ? { ...msg, text: msg.text + chunk } : msg
        );
      });
    };

    const addMessageB = (id: string, chunk: string) => {
      setMessagesB((m) => {
        const exists = m.find((msg) => msg.id === id);
        if (!exists) return [...m, { id, role: "ai", text: chunk }];
        return m.map((msg) =>
          msg.id === id ? { ...msg, text: msg.text + chunk } : msg
        );
      });
    };

    const token = await getToken();

    await Promise.all([
      streamModelReply("GPT5", text, addMessageA, token ?? ""),
      streamModelReply("GPT5mini", text, addMessageB, token ?? ""),
    ]);

    setLoading(false);
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="flex flex-col h-full max-h-screen border border-gray-200 bg-white rounded-xl w-full max-w-300 overflow-hidden">
        <div className="flex flex-row flex-1 overflow-hidden">
          <ChatColumn
            model="GPT5"
            messages={messagesA}
            containerRef={containerRefA}
          />
          <ChatColumn
            model="GPT5mini"
            messages={messagesB}
            containerRef={containerRefB}
          />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <form
            id="composer"
            className="flex gap-3 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 resize-none p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Type a message... (Shift+Enter for newline)"
            ></textarea>

            <button
              type="submit"
              disabled={loading || input.trim() === ""}
              className={`px-4 py-2 rounded-md ${
                loading || input.trim() === ""
                  ? "bg-gray-300 text-gray-600 cursor-progress"
                  : "bg-indigo-600 text-white cursor-pointer"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
