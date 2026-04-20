import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { detectIntent, deleteSession } from "./dialogflow.js";

const PORT = Number(process.env["PORT"] ?? 8080);
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

// Each connection gets a stable ID so Dialogflow can track conversation context
let connectionCounter = 0;

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const clientIp = req.socket.remoteAddress ?? "unknown";
  const connectionId = `conn_${++connectionCounter}`;
  console.log(`Client connected [${clientIp}] → ${connectionId}`);

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

    if (!userText) return;
    console.log(`[${connectionId}] User: ${userText}`);

    // Send a typing indicator so the UI can show a loading state
    ws.send(JSON.stringify({ type: "typing" }));

    try {
      const botReply = await detectIntent(connectionId, userText);
      console.log(`[${connectionId}] Bot: ${botReply}`);
      ws.send(JSON.stringify({ type: "bot", text: botReply }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${connectionId}] Dialogflow error:`, message);
      ws.send(
        JSON.stringify({
          type: "bot",
          text: "Sorry, something went wrong. Please try again.",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected [${connectionId}]`);
    // Clean up the Dialogflow session so memory isn't leaked
    deleteSession(connectionId);
  });

  ws.on("error", (err: Error) => {
    console.error(`WebSocket error [${connectionId}]:`, err.message);
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  wss.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});