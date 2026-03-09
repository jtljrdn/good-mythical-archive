import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { adminClient } from "@/src/clients/drizzle-client";
import { user } from "@/src/db/schema";
import { eq } from "drizzle-orm";

const ALLOWED_ORIGIN = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const SYSTEM_EMAIL = "system@good-mythical-archive.internal";

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
        logger.error("Failed to create API key");
        return NextResponse.json({ error: "Something went wrong :(" }, { status: 500 });
    }

    logger.log(`Created API key "${name}"`);

    return NextResponse.json({ key: apiKey.key, name });
}

async function getOrCreateSystemUser() {
    const [existing] = await adminClient
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, SYSTEM_EMAIL))
        .limit(1);

    if (existing) return existing;

    const result = await auth.api.createUser({
        body: {
            email: SYSTEM_EMAIL,
            name: "System",
            role: "admin",
        },
    });

    const created = "user" in result ? result.user : result;
    logger.log("Created system user for API key ownership");
    return created;
}