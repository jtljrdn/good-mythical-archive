import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "../../../../lib/api-key";
import { searchEpisodes } from "@/lib/queries/episodes";

export async function GET(request: NextRequest) {
  const authResult = await verifyApiKey(request);
  if (authResult instanceof NextResponse) return authResult;

  const params = request.nextUrl.searchParams;

  const search = params.get("search") || undefined;
  const season = params.get("season") ? Number(params.get("season")) : undefined;
  const category = params.get("category") || undefined;
  const page = Math.max(1, parseInt(params.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") || "20", 10)));

  const result = await searchEpisodes({
    search,
    seasons: season && !isNaN(season) ? [season] : undefined,
    categories: category ? [category] : undefined,
    sortOrder: "desc",
    page,
    limit,
  });

  return NextResponse.json(result);
}
