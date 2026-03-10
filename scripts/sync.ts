#!/usr/bin/env bun

/**
 * Good Mythical Archive — Daily Sync Script (CLI)
 *
 * Usage:
 *   bun run scripts/sync.ts [options]
 *
 * Options:
 *   --dry-run              Show what would be done without writing to DB
 *   --update-existing      Also update descriptions, lengths, and view counts for existing videos
 *   --max-playlist-items N Max playlist items to fetch per channel (default: 200)
 *   --min-duration N       Minimum video duration in seconds to include (default: 300)
 *
 * Requires YOUTUBE_API_KEY and DATABASE_URL in .env.local
 */

import { config } from "dotenv";
import { runSync } from "../lib/sync";

config({ path: ".env.local" });

const args = process.argv.slice(2);

function parseIntArg(flag: string, defaultVal: number, min: number): number {
  const idx = args.indexOf(flag);
  if (idx === -1) return defaultVal;
  const val = parseInt(args[idx + 1]);
  if (!Number.isFinite(val) || val < min) {
    console.error(`Invalid ${flag} value: "${args[idx + 1]}". Must be >= ${min}.`);
    process.exit(1);
  }
  return val;
}

async function main() {
  try {
    await runSync({
      dryRun: args.includes("--dry-run"),
      updateExisting: args.includes("--update-existing"),
      maxPlaylistItems: parseIntArg("--max-playlist-items", 200, 50),
      minDurationSeconds: parseIntArg("--min-duration", 300, 0),
    });
  } catch (err) {
    console.error("\nError:", err);
    process.exitCode = 1;
  }
}

main();
