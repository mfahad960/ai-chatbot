import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const clientIp = req.socket.remoteAddress ?? "unknown";
  console.log(`Client connected [${clientIp}]`);

  // Send a welcome message on connection
  ws.send(
    JSON.stringify({ type: "bot", text: "Connected! How can I help you?" })
  );

  ws.on("message", (data: Buffer | string) => {
    const raw = data.toString();
    console.log(`Received: ${raw}`);

    let userText: string;
    try {
      const parsed = JSON.parse(raw) as { text: string };
      userText = parsed.text;
    } catch {
      userText = raw;
    }

    //Dialogflow integration will go here later
    //For now, echo the message back so you can verify the WS loop works
    const reply = `You said: "${userText}"`;
    ws.send(JSON.stringify({ type: "bot", text: reply }));
  });

  ws.on("close", () => {
    console.log(`Client disconnected [${clientIp}]`);
  });

  ws.on("error", (err: Error) => {
    console.error(`WebSocket error [${clientIp}]:`, err.message);
  });
});

//Shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down WebSocket server...");
  wss.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});