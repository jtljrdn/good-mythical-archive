import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { runSync } from "@/lib/sync";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSync({ updateExisting: true });

    // Revalidate caches after sync
    revalidateTag("episodes", "hours");
    revalidateTag("metadata", "days");
    revalidateTag("seasons", "days");
    revalidateTag("categories", "days");

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error("Cron sync failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
