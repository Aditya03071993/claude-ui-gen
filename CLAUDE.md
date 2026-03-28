# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # First-time setup: install deps, generate Prisma client, run migrations
npm run dev         # Start dev server with Turbopack
npm test            # Run Vitest test suite
npm run lint        # Run ESLint
npm run build       # Production build
npm run db:reset    # Force reset database and migrations
```

To run a single test file: `npx vitest run <path/to/test.ts>`

## Architecture

**UIGen** is an AI-powered React component generator. Users describe components in chat; Claude generates React code with live preview.

### Key data flow

1. User message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Server streams response via Vercel AI SDK using `streamText` with Claude
3. Claude uses two tools: `str_replace_editor` (edit files) and `file_manager` (create/delete files)
4. Tool calls mutate the **virtual file system** (`src/lib/file-system.ts`) — an in-memory store, no disk writes
5. Updated files are sent back to the client via streaming, then rendered in the preview panel

### Core layers

| Path | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | Streaming chat endpoint; persists project state to DB after each turn |
| `src/lib/file-system.ts` | `VirtualFileSystem` class — in-memory file store shared via React context |
| `src/lib/contexts/` | React Context providers for file system and chat state |
| `src/lib/tools/` | AI tool definitions (`str-replace-editor`, `file-manager`) |
| `src/lib/prompts/` | System prompts sent to Claude |
| `src/lib/transform/jsx-transformer.ts` | Babel-based runtime JSX transform for live preview |
| `src/lib/provider.ts` | Initializes Claude or Mock language model (mock used when no API key) |
| `src/components/preview/PreviewFrame.tsx` | Renders transformed component code in an iframe |
| `src/actions/` | Next.js server actions for project CRUD |
| `prisma/schema.prisma` | SQLite DB with `User` and `Project` models; messages and files stored as JSON |

### Authentication

JWT sessions stored in httpOnly cookies (7-day expiry). Anonymous users are supported — projects have a nullable `userId`. `src/lib/auth.ts` is server-only.

### Environment

Set `ANTHROPIC_API_KEY` in `.env` to enable real AI generation. Without it, the app falls back to a mock provider that returns static code.

### Tech stack highlights

- Next.js 15 App Router, React 19
- Vercel AI SDK (`ai` package) for streaming + tool use
- Prisma + SQLite
- shadcn/ui + Tailwind CSS v4
- Monaco Editor for code editing
- `@babel/standalone` for runtime JSX transformation in the browser
- Vitest + Testing Library for tests
