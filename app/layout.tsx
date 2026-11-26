import type { Metadata } from "next";
import { ViewTransition } from "react";
// Self-hosted variable fonts (no runtime request to Google Fonts).
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/source-serif-4/opsz.css";
import "./globals.css";
import { site, siteUrl } from "@/lib/site";
import ChatBar, { type ChatCase } from "./components/ChatBar";
import { getCaseStudies } from "@/sanity/lib/caseStudies";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Analytics from "./components/Analytics";
import { jsonLd, siteSchema } from "@/lib/structuredData";
import TrackClicks from "./components/TrackClicks";
import SiteLogo from "./components/SiteLogo";
import SiteNav from "./components/SiteNav";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { siteName: site.name, type: "website", title: site.title, description: site.description },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(siteSchema())} />
        <SiteLogo />
        <SiteNav />
        <ViewTransition>
          <div className="flex-1">{children}</div>
        </ViewTransition>
        <footer className="mx-auto w-full max-w-6xl px-6 pb-32">
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
                <Link className="text-ink underline decoration-rule underline-offset-4 hover:decoration-accent" href="/resume">
                  Resume
                </Link>
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
        <ChatBar cases={await chatCases()} />
        <TrackClicks />
        <Analytics />
      </body>
    </html>
  );
}

/** The cases the chat can show as cards. */
async function chatCases(): Promise<ChatCase[]> {
  const all = await getCaseStudies().catch(() => [])
  return all.map((cs) => {
    const image = cs.cardImage?.asset ? cs.cardImage : cs.coverImage
    return {
      slug: cs.slug,
      client: cs.client ?? cs.title,
      title: cs.headline ?? cs.title,
      skills: cs.skills ?? [],
      thumb: image?.asset ? urlFor(image).width(480).height(270).fit('crop').auto('format').url() : null,
    }
  })
}
