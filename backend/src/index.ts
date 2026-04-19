import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { detectIntent } from "./dialogflow.js";

const PORT = Number(process.env["PORT"] ?? 8080);
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const clientIp = req.socket.remoteAddress ?? "unknown";
  console.log(`New client connected: ${clientIp}`);

  // Let the frontend know it's live
  ws.send(
    JSON.stringify({ type: "bot", text: "Hi! How can I help you today?" })
  );

  ws.on("message", async (data: Buffer | string) => {
    const raw = data.toString();

    // Parse the message sent from the frontend
    let userText: string;
    try {
      const parsed = JSON.parse(raw) as { text: string };
      userText = parsed.text?.trim() ?? "";
    } catch {
      userText = raw.trim();
    }

    try {
      const botReply = await detectIntent("1", userText);
      ws.send(JSON.stringify({ type: "bot", text: botReply }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Dialogflow error:", message);
      ws.send(
        JSON.stringify({
          type: "bot",
          text: "Sorry, something went wrong. Please try again.",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected!");
  });

  ws.on("error", (err: Error) => {
    console.error("WebSocket error :", err.message);
  });
});

process.on("SIGINT", () => {
  console.log("\nShutting down...");
  wss.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});