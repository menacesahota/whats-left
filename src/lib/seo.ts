import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./brand";
import { TOOLS } from "./tools";

/** Public, indexable routes. Paths have no trailing slash, matching the live site. */
export const PUBLIC_ROUTES = [
  "/",
  "/tools",
  "/about",
  "/privacy",
  ...TOOLS.map((tool) => tool.href),
] as const;

export function pagePath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function absoluteUrl(path: string): string {
  const normalized = pagePath(path);
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

type PageMetaInput = {
  path: string;
  title: string;
  description: string;
  /** Use the title as-is (no "| What's Left" template). */
  absoluteTitle?: boolean;
};

export function pageMetadata({
  path,
  title,
  description,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const canonical = pagePath(path);
  const url = absoluteUrl(canonical);
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: SITE_NAME,
      url,
      title: socialTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_TAGLINE,
        logo: `${SITE_URL}/icon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: `${SITE_TAGLINE} Take-home pay, budget, debt, emergency fund, rent versus buy, and bills. No bank login.`,
        inLanguage: "en-GB",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function toolsHubJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} tools`,
    url: absoluteUrl("/tools"),
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: absoluteUrl(tool.href),
    })),
  };
}

export function toolSoftwareJsonLd(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
  };
}

export function toolBreadcrumbJsonLd(opts: { name: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: absoluteUrl("/tools"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: opts.name,
        item: absoluteUrl(opts.path),
      },
    ],
  };
}
