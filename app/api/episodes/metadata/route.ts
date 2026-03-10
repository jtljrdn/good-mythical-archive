import { NextResponse } from "next/server";
import { getDistinctSeasons, getDistinctCategories, getTotalEpisodeCount } from "@/lib/queries/episodes";

export async function GET() {
  try {
    const [seasons, categories, totalEpisodes] = await Promise.all([
      getDistinctSeasons(),
      getDistinctCategories(),
      getTotalEpisodeCount(),
    ]);

    return NextResponse.json({ seasons, categories, totalEpisodes }, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/episodes/metadata failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
