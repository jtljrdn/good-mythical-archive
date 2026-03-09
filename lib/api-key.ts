import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

/**
 * Verify the API key from the request's Authorization header.
 * Expects: `Authorization: Bearer <api-key>`
 *
 * Returns the verified key data on success, or a 401 NextResponse on failure.
 */
export async function verifyApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const key = authHeader?.replace(/^Bearer\s+/i, "");

  if (!key) {
    return NextResponse.json(
      { error: "Missing API key. Provide an Authorization: Bearer <key> header." },
      { status: 401 },
    );
  }

  const result = await auth.api.verifyApiKey({
    body: { key },
  });

  if (!result.valid) {
    return NextResponse.json(
      { error: result.error ?? "Invalid API key" },
      { status: 401 },
    );
  }

  return result;
}
