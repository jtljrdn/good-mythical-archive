import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const TAG_PROFILES: Record<string, string> = {
  episodes: "hours",
  metadata: "days",
  seasons: "days",
  categories: "days",
};

const VALID_TAGS = Object.keys(TAG_PROFILES);

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Invalid secret" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag || !VALID_TAGS.includes(tag)) {
    return NextResponse.json(
      { error: `Invalid tag. Must be one of: ${VALID_TAGS.join(", ")}` },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  revalidateTag(tag, TAG_PROFILES[tag]);

  return NextResponse.json(
    { revalidated: true, tag },
    { headers: { "Cache-Control": "no-store" } }
  );
}
