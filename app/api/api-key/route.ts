import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const ALLOWED_ORIGIN = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
    const origin = request.headers.get("origin");
    if (!origin || !ALLOWED_ORIGIN.startsWith(origin)) {
        return NextResponse.json(
            { error: "API keys can only be created from the website" },
            { status: 403 },
        );
    }

    const { name } = await request.json();

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const systemUser = await getOrCreateSystemUser();

    const apiKey = await auth.api.createApiKey({
        body: {
            name,
            userId: systemUser.id,
        },
    });

    if (!apiKey) {
        return NextResponse.json({ error: "Something went wrong :(" }, { status: 500 });
    }

    logger.log(`Created API key "${name}"`);

    return NextResponse.json({ key: apiKey.key, name });
}

async function getOrCreateSystemUser() {
    const SYSTEM_EMAIL = "system@good-mythical-archive.internal";

    const existing = await auth.api
        .listUsers({ query: { searchField: "email", searchValue: SYSTEM_EMAIL } })
        .then((res: { users: { id: string }[] }) => res.users[0])
        .catch(() => null);

    if (existing) return existing;

    const result = await auth.api.createUser({
        body: {
            email: SYSTEM_EMAIL,
            name: "System",
            role: "admin",
        },
    });

    const user = "user" in result ? result.user : result;

    logger.log("Created system user for API key ownership");
    return user;
}