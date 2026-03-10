import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "../../../../lib/api-key";
import { searchEpisodes } from "@/lib/queries/episodes";

const MAX_FILTER_ITEMS = 50;
const MAX_FILTER_STRING_LENGTH = 100;
const MAX_SEARCH_LENGTH = 200;

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyApiKey(request);
    if (authResult instanceof NextResponse) return authResult;

    const params = request.nextUrl.searchParams;

    const rawSearch = params.get("search") || undefined;
    const search = rawSearch ? rawSearch.slice(0, MAX_SEARCH_LENGTH) : undefined;
    const fuzzy = params.get("fuzzy") === "true";
    const seasons = params.get("seasons")
      ? params.get("seasons")!.split(",").slice(0, MAX_FILTER_ITEMS).map(Number).filter((n) => !isNaN(n) && n !== 0)
      : undefined;
    const categories = params.get("categories")
      ? params.get("categories")!.split(",").slice(0, MAX_FILTER_ITEMS).map((s) => s.slice(0, MAX_FILTER_STRING_LENGTH)).filter(Boolean)
      : undefined;
    const sortOrder = params.get("sort") === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") || "20", 10) || 20));

    const result = await searchEpisodes({
      search,
      fuzzy,
      seasons,
      categories,
      sortOrder,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/gmm/videos failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
