import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Access",
  description:
    "Generate a free API key to access the Mythidex REST API for Good Mythical Morning episode data.",
};

export default function ApiKeyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
