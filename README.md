# AI Model Playground UI

A small Next.js app that demonstrates a two-column chat UI with streaming AI responses. The app shows user messages and streaming AI replies (left/right alignment), supports Enter to send (Shift+Enter for newline), and triggers multiple API calls per send (streaming + secondary).

## Features
- Next.js (App Router) client component chat UI
- Two chat columns (e.g. GPT5 and GPT5mini)
- Streaming API support (append chunks progressively)
- Disabled Send button + loader while requests are in flight
- Responsive layout that keeps the composer fixed at the bottom
- Simple componentized structure (Chat, ChatColumn, MessageList, Composer)

## Prerequisites
- Node.js 18+ or compatible
- npm, yarn, or pnpm
- (Optional) An AI streaming backend or mock that supports HTTP streaming

## Quick start (development)
1. Install dependencies
   - npm:
     ```bash
     npm install
     ```
   - pnpm:
     ```bash
     pnpm install
     ```
   - yarn:
     ```bash
     yarn
     ```

2. Configure environment (if needed)
   - Create a `.env.local` at project root for any environment variables your API needs.
   - Example:
     ```
     NEXT_PUBLIC_API_BASE=http://localhost:3001
     ```
   - The app expects endpoints like `/ai/stream` and `/ai/extra` (adjust code or env as required).

3. Run dev server
   - npm:
     ```bash
     npm run dev
     ```
   - pnpm:
     ```bash
     pnpm dev
     ```
   - yarn:
     ```bash
     yarn dev
     ```

4. Open the app
   - Visit http://localhost:3000 in your browser.

## Build & production
- Build:
  ```bash
  npm run build
  ```