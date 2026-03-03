# Good Mythical Archive

A searchable archive for all Good Mythical Morning content. Browse, search, and filter videos by series, season, tags, and more.

Includes a free, public-facing website and an free, but authenticated, API.

## Tech Stack

- **Runtime** — Bun
- **Framework** — Next.js 16 (App Router), React 19
- **Database** — PostgreSQL (Supabase) + Drizzle ORM
- **Auth** — Better Auth (API key authentication)
- **UI** — Tailwind CSS 4, shadcn/ui

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- PostgreSQL database (local or [Neon](https://neon.tech))

### Install & Run

```bash
# Install dependencies
bun install

# Start the dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── api/          # REST API route handlers
├── layout.tsx    # Root layout
├── page.tsx      # Homepage
└── globals.css   # Global styles
```

## API

The REST API is built into Next.js via Route Handlers (`app/api/`). The frontend is public with no authentication required. API access requires an API key obtained through Better Auth.

## License

MIT
