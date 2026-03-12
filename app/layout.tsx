import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/navbar";
import { PageSkeleton } from "@/components/page-skeleton";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteDescription =
  "Searchable database and API for every Good Mythical Morning episode — browse by season, category, and more.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mythidex.dev"),
  title: {
    default: "Mythidex",
    template: "%s | Mythidex",
  },
  description: siteDescription,
  keywords: [
    "Good Mythical Morning",
    "GMM",
    "Rhett and Link",
    "episode guide",
    "episode database",
    "archive",
    "Mythidex",
  ],
  authors: [{ name: "Jordan Lee" }, { url: "https://jtlee.dev" }],
  creator: "Mythidex",
  openGraph: {
    type: "website",
    siteName: "Mythidex",
    title: "Mythidex",
    description: siteDescription,
    url: "https://mythidex.dev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mythidex",
    description: siteDescription,
  },
  alternates: {
    canonical: "https://mythidex.dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* JSON-LD WebSite schema for Google sitelinks search box — static data, no user input */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Mythidex",
              url: "https://mythidex.dev",
              description: siteDescription,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://mythidex.dev/?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Suspense fallback={<div className="pt-14"><PageSkeleton /></div>}>
            <div className="pt-14">{children}</div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
