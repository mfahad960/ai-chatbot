# Real-time Chat Application — Dialogflow ES + WebSocket

A real-time chatbot built with **Next.js** (frontend) and **Node.js** (backend), communicating over **WebSocket**, with responses powered by **Google Dialogflow ES**.

---

## Architecture Overview

```
┌─────────────────────┐        WebSocket         ┌──────────────────────────┐
│                     │  ◄───────────────────►   │        BACKEND           │
│  Next.js Frontend   │                          │  Node.js + ws library    │
│                     │    JSON messages         │                          │
│  - Chat UI          │  { type, text }          │  - WebSocket server      │
│  - WebSocket client │                          │  - Session management    │
│  - Message bubbles  │                          │  - Dialogflow connector  │
└─────────────────────┘                          └──────────┬───────────────┘
                                                            │ HTTPS / gRPC
                                                            ▼
                                                 ┌──────────────────────────┐
                                                 │     Dialogflow ES        │
                                                 │  - detectIntent API      │
                                                 │  - Intent matching       │
                                                 │  - Context management    │
                                                 └──────────────────────────┘
```

### Key Design Decisions

- **Separate backend process** — Next.js does not support persistent WebSocket servers natively, so the backend runs as a standalone Node.js process on port `8080`.
- **Per-connection Dialogflow sessions** — each WebSocket connection is assigned a unique `uuid` session ID, so multi-turn conversation context (e.g. remembering departure city across messages) is maintained correctly per user.
- **JSON message protocol** — all WebSocket frames are JSON: `{ type: "user" | "bot" | "typing", text: string }`. The `typing` frame is sent immediately while awaiting the Dialogflow response so the frontend can show a loading indicator.
- **Session cleanup** — Dialogflow session IDs are deleted from memory when the WebSocket connection closes, preventing memory leaks.

---

## Project Structure

```
/                          ← Next.js frontend (root)
├── app/
│   ├── page.tsx           ← Chat UI with WebSocket client
│   ├── layout.tsx         ← Root layout with Sidebar
│   ├── globals.css        ← Global styles & CSS variables
│   └── components/
│       ├── Sidebar.tsx    ← Collapsible chat history sidebar
│       └── Icons.tsx      ← SVG icon components
├── public/                ← Static assets (arrow icons etc.)
├── package.json
├── tailwind.config.ts
└── tsconfig.json

/backend/                  ← Node.js WebSocket + Dialogflow backend
├── src/
│   ├── index.ts           ← WebSocket server entry point
│   └── dialogflow.ts      ← Dialogflow ES detectIntent wrapper
├── secrets/               ← GCP service account key (git-ignored)
├── .env                   ← Environment variables (git-ignored)
├── package.json
└── tsconfig.json
```

---

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9
- **Google Cloud SDK** (for GCP access)
- A **Dialogflow ES** agent with intents configured
- A **GCP service account** with the `Dialogflow API Client` role

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install frontend dependencies

```bash
# From the root directory
pnpm install
```

### 3. Install backend dependencies

```bash
cd backend
pnpm install
```

### 4. Configure Dialogflow credentials

Create a `backend/secrets/` directory and place your GCP service account JSON key file inside it.

```bash
mkdir backend/secrets
# Copy your downloaded JSON key into backend/secrets/
```

Create a `backend/.env` file:

```env
DIALOGFLOW_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=./secrets/your-key-file.json
```

> **Note:** `backend/secrets/` and `backend/.env` are both git-ignored and should never be committed.

### 5. Dialogflow ES Agent Setup

In the [Dialogflow ES Console](https://dialogflow.cloud.google.com):

1. Create a new agent linked to your GCP project
2. Add the following intents (or import the exported agent zip):

| Intent | Example Training Phrases | Response |
|---|---|---|
| `book.flight` | "I want to book a flight" | "Where are you flying from, and where would you like to go?" |
| `book.flight.details` | "From London to Calgary" | "How many passengers, and which class?" |
| `book.flight.passengers` | "1 passenger in economy" | "Let me confirm: [details]. Is that correct?" |
| `book.flight.confirm` | "Yes that's right" | "Great! I'll search for the best available flights." |

3. Click **Train** and wait for training to complete before testing.

---

## Running the Application

You need two terminals running simultaneously.

**Terminal 1 — Backend**

```bash
cd backend
pnpm start
# WebSocket server listening on ws://localhost:8080
```

**Terminal 2 — Frontend**

```bash
# From the root directory
pnpm dev
# Next.js app running on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The status dot in the top-right of the chat panel will turn **green** when the WebSocket connection is established.

---

## How It Works — Message Flow

1. User types a message and submits the form (Enter or button click)
2. Frontend sends `{ type: "user", text: "..." }` over WebSocket to the backend
3. Backend immediately replies with `{ type: "typing" }` to show a loading indicator
4. Backend calls `detectIntent()` on the Dialogflow ES API with the user's text and the connection's session ID
5. Dialogflow matches an intent and returns a fulfillment text response
6. Backend sends `{ type: "bot", text: "..." }` back over WebSocket
7. Frontend renders the bot reply as a chat bubble

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `DIALOGFLOW_PROJECT_ID` | `backend/.env` | Your GCP project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | `backend/.env` | Path to service account JSON key |
| `PORT` | `backend/.env` (optional) | WebSocket server port (default: `8080`) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, TypeScript, `ws`, `tsx` |
| AI / NLP | Google Dialogflow ES |
| Auth | GCP Service Account (JSON key) |
| Transport | WebSocket (JSON framing) |