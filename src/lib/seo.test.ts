import { describe, expect, it } from "vitest";
import { SITE_NAME, SITE_URL } from "./brand";
import {
  PUBLIC_ROUTES,
  absoluteUrl,
  homeJsonLd,
  pageMetadata,
  pagePath,
  toolBreadcrumbJsonLd,
  toolSoftwareJsonLd,
  toolsHubJsonLd,
} from "./seo";

const REQUIRED_ROUTES = [
  "/",
  "/tools",
  "/about",
  "/privacy",
  "/tools/take-home",
  "/tools/budget",
  "/tools/debt",
  "/tools/emergency-fund",
  "/tools/rent-or-buy",
  "/tools/bills",
];

describe("PUBLIC_ROUTES", () => {
  it("covers every required public page without trailing slashes", () => {
    for (const route of REQUIRED_ROUTES) {
      expect(PUBLIC_ROUTES).toContain(route);
      if (route !== "/") {
        expect(route.endsWith("/")).toBe(false);
      }
    }
  });
});

describe("pagePath / absoluteUrl", () => {
  it("keeps the homepage as the origin with no trailing slash", () => {
    expect(pagePath("/")).toBe("/");
    expect(absoluteUrl("/")).toBe(SITE_URL);
  });

  it("strips trailing slashes on other paths", () => {
    expect(pagePath("/tools/take-home/")).toBe("/tools/take-home");
    expect(absoluteUrl("/tools/take-home/")).toBe(
      `${SITE_URL}/tools/take-home`,
    );
  });
});

describe("pageMetadata", () => {
  it("gives each page a self-canonical and matching social tags", () => {
    const meta = pageMetadata({
      path: "/tools/take-home",
      title: "Take-home pay calculator",
      description: "Estimate UK take-home pay.",
    });

    expect(meta.alternates).toEqual({ canonical: "/tools/take-home" });
    expect(meta.openGraph?.url).toBe(`${SITE_URL}/tools/take-home`);
    expect(meta.openGraph?.title).toBe(
      `Take-home pay calculator | ${SITE_NAME}`,
    );
    expect(meta.twitter?.title).toBe(`Take-home pay calculator | ${SITE_NAME}`);
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it("uses an absolute homepage title so the layout template is not applied twice", () => {
    const meta = pageMetadata({
      path: "/",
      title: `${SITE_NAME} — Free UK money tools`,
      description: "Free UK money tools.",
      absoluteTitle: true,
    });

    expect(meta.title).toEqual({
      absolute: `${SITE_NAME} — Free UK money tools`,
    });
    expect(meta.alternates).toEqual({ canonical: "/" });
    expect(meta.openGraph?.url).toBe(SITE_URL);
  });

  it("uses a typographic apostrophe in the site name", () => {
    expect(SITE_NAME).toBe("What’s Left");
    expect(SITE_NAME.includes("\u2019")).toBe(true);
    expect(SITE_NAME.includes("'")).toBe(false);
  });
});

describe("JSON-LD", () => {
  it("describes the homepage as WebSite + Organization without ratings", () => {
    const data = JSON.stringify(homeJsonLd());
    expect(data).toContain("WebSite");
    expect(data).toContain("Organization");
    expect(data).not.toMatch(/aggregateRating|reviewCount|ratingValue/i);
  });

  it("describes a tool as a free SoftwareApplication", () => {
    const json = toolSoftwareJsonLd({
      name: "Take-home pay calculator",
      description: "Estimate UK take-home pay.",
      path: "/tools/take-home",
    });

    expect(json.applicationCategory).toBe("FinanceApplication");
    expect(json.operatingSystem).toBe("Web");
    expect(json.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    });
    expect(JSON.stringify(json)).not.toMatch(
      /aggregateRating|reviewCount|ratingValue/i,
    );
  });

  it("builds Home / Tools / current breadcrumbs", () => {
    const json = toolBreadcrumbJsonLd({
      name: "Take-home pay calculator",
      path: "/tools/take-home",
    });

    expect(json.itemListElement).toHaveLength(3);
    expect(json.itemListElement[2]).toMatchObject({
      name: "Take-home pay calculator",
      item: `${SITE_URL}/tools/take-home`,
    });
  });

  it("lists tools on the hub without invented rankings", () => {
    const json = toolsHubJsonLd();
    expect(json.numberOfItems).toBe(6);
    expect(json.itemListElement[0].url).toBe(`${SITE_URL}/tools/take-home`);
  });
});
