# Good Mythical Archive

Archive website for all Good Mythical Morning content with a searchable database and RESTful API.

## Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Auth**: Better Auth (API key auth for REST API; frontend is public)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui — always use shadcn components for UI. Install new components with `bunx shadcn@latest add <component>`.

## Guidelines

- Use Next.js Route Handlers (`app/api/`) for the REST API — no separate backend.
- Use shadcn/ui components instead of building custom UI primitives.
- When modifying frontend components, use /frontend-design skill and keep with current design scheme.

