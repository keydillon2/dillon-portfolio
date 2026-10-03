import type { Metadata } from "next";
// Self-hosted variable fonts (no runtime request to Google Fonts).
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/source-serif-4/opsz.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dillon Key — Strategy Portfolio",
  description: "Brand strategy case studies: Apollo, American Express, Diageo, Fetch, Hackensack Meridian Health.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
