import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

// ─── Client ───────────────────────────────────────────────────────────────────
// Credentials are picked up automatically from GOOGLE_APPLICATION_CREDENTIALS
const sessionClient = new dialogflow.SessionsClient();

const PROJECT_ID = process.env["DIALOGFLOW_PROJECT_ID"];
if (!PROJECT_ID) {
  throw new Error("Missing env var: DIALOGFLOW_PROJECT_ID");
}

// ─── Session store ────────────────────────────────────────────────────────────
// Each WebSocket connection gets its own Dialogflow session so context is
// preserved per user across multiple turns of conversation.
const sessions = new Map<string, string>();

export function getOrCreateSession(connectionId: string): string {
  if (!sessions.has(connectionId)) {
    sessions.set(connectionId, uuidv4());
  }
  return sessions.get(connectionId)!;
}

export function deleteSession(connectionId: string): void {
  sessions.delete(connectionId);
}

// ─── detectIntent ─────────────────────────────────────────────────────────────
export async function detectIntent(
  connectionId: string,
  userMessage: string,
  languageCode = "en"
): Promise<string> {
  const sessionId = getOrCreateSession(connectionId);
  const sessionPath = sessionClient.projectAgentSessionPath(
    PROJECT_ID!,
    sessionId
  );

  const [response] = await sessionClient.detectIntent({
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode,
      },
    },
  });

  // Pull the fulfillment text out of the response
  const fulfillment =
    response.queryResult?.fulfillmentText?.trim() ?? "";

  if (!fulfillment) {
    return "Sorry, I didn't understand that.";
  }

  return fulfillment;
}