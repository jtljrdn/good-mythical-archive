import { NextResponse } from "next/server";
import { getDistinctSeasons, getDistinctCategories, getTotalEpisodeCount } from "@/lib/queries/episodes";

export async function GET() {
  try {
    const [seasons, categories, totalEpisodes] = await Promise.all([
      getDistinctSeasons(),
      getDistinctCategories(),
      getTotalEpisodeCount(),
    ]);

    return NextResponse.json({ seasons, categories, totalEpisodes });
  } catch (error) {
    console.error("GET /api/episodes/metadata failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
