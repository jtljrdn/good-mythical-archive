import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "../../../../lib/api-key";

export async function GET(request: NextRequest) {
  const authResult = await verifyApiKey(request);
  if (authResult instanceof NextResponse) return authResult;

  return NextResponse.json({ data: [], total: 0, page: 1, limit: 20 });
}
