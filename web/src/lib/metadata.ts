import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    keywords: [
      "API testing",
      "HTTP client",
      "stress testing",
      "CLI tool",
      "terminal",
      "curl alternative",
      "API automation",
      "load testing",
      "Go",
      "developer tools",
      "tabby generator",
      "curl generator",
      "tabby",
      "tabby golang",

      ...((override.keywords as string[]) ?? []),
    ],
    authors: [{ name: "nhdfr", url: "https://tabby.nhdfr.com" }],
    creator: "nhdfr",
    publisher: "nhdfr",
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
    openGraph: {
      type: "website",
      locale: "en_US",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://tabby.nhdfr.com",
      images: [
        {
          url: "/banner.png",
          width: 1200,
          height: 630,
          alt: "Tabby - API Stress Testing Made Simple",
        },
      ],
      siteName: "Tabby",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: ["/banner.png"],
      ...override.twitter,
    },
    alternates: {
      canonical: "https://tabby.nhdfr.com",
      types: {
        "application/rss+xml": "/rss.xml",
      },
      ...override.alternates,
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/icon.png",
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}
