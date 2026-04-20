'use client';

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

type WsStatus = "connecting" | "open" | "closed" | "error";

const WS_URL = "ws://localhost:8080";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [wsStatus, setWsStatus] = useState<WsStatus>("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const msgIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect WebSocket on mount, clean up on unmount
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setWsStatus("open");
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as { type: string; text: string };
        addMessage("bot", data.text);
      } catch {
        addMessage("bot", event.data);
      }
    };

    ws.onerror = () => {
      console.error("WebSocket error");
      setWsStatus("error");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setWsStatus("closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  function addMessage(sender: "user" | "bot", text: string) {
    msgIdRef.current += 1;
    setMessages((prev) => [
      ...prev,
      { id: msgIdRef.current, sender, text },
    ]);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addMessage("bot", "⚠️ Not connected to server. Please refresh.");
      return;
    }

    // Show user message in chat immediately
    addMessage("user", trimmed);

    // Send to backend
    wsRef.current.send(JSON.stringify({ text: trimmed }));

    setMessage("");
  }

  const statusColour: Record<WsStatus, string> = {
    connecting: "bg-yellow-500",
    open: "bg-green-500",
    closed: "bg-gray-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Header / status ── */}
      <div className="flex items-center justify-between max-w-3xl w-full mx-auto px-4 py-2">
        <h2 className="text-white font-semibold text-sm">Dialogflow Chat</h2>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span
            className={`inline-block w-2 h-2 rounded-full ${statusColour[wsStatus]}`}
          />
          {wsStatus}
        </span>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto max-w-3xl w-full mx-auto px-4 py-2 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8 select-none">
            Send a message to start chatting.
          </p>
        )}

        {messages.map((msg) => (
          msg !== undefined && msg.text !== undefined && (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm break-words ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-700 text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        )))}

        {/* Anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input form ── */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto mb-2 px-4"
      >
        <div className="relative w-full flex flex-col">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              // Submit on Enter (without Shift)
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
            className="flex block w-full rounded-lg textarea px-3 py-3 text-base"
            placeholder="Ask anything"
            rows={2}
          />
          <button
            disabled={message.trim().length === 0 || wsStatus !== "open"}
            type="submit"
            className="button inline-flex absolute end-2.5 bottom-2.5 rounded-full"
          >
            <Image
              className="invert"
              src="/up-arrow.png"
              alt="send"
              width={15}
              height={15}
            />
          </button>
        </div>
      </form>

      {/* ── Footer ── */}
      <div className="bottom-line">
        <p>AI-generated, for reference only</p>
      </div>
    </div>
  );
}