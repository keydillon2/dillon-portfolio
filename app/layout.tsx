import type { Metadata } from "next";
// Self-hosted variable fonts (no runtime request to Google Fonts).
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/source-serif-4/opsz.css";
import "./globals.css";
import { site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `${site.name} — Strategy Portfolio`,
  description: `${site.summary} Case studies: Fetch, Hackensack Meridian Health, American Express, Diageo, Apollo Global Management.`,
  openGraph: { siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="mx-auto w-full max-w-5xl px-6 pb-12">
          <div className="flex flex-col gap-2 border-t border-rule pt-8 text-meta text-muted sm:flex-row sm:justify-between">
            <p>
              {site.name}, {site.role}, New York
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a className="text-ink underline decoration-rule underline-offset-4 hover:decoration-accent" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  className="text-ink underline decoration-rule underline-offset-4 hover:decoration-accent"
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}
