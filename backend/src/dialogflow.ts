import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

const sessionClient = new dialogflow.SessionsClient();
const PROJECT_ID = process.env["DIALOGFLOW_PROJECT_ID"];
const sessions = new Map<string, string>();

export async function detectIntent(
  connectionId: string,
  userMessage: string,
  languageCode = "en"
): Promise<string> {

  if (!sessions.has(connectionId)) {
    sessions.set(connectionId, uuidv4());
  }
  const sessionId = sessions.get(connectionId)!;
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