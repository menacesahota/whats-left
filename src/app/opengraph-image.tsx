import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";

export const alt = `${SITE_NAME} — free UK money tools`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: "#f3efe6",
          color: "#1c1917",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 64,
              background: "#d6d0c4",
              display: "flex",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 64,
                height: 64,
                background: "#0f766e",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 32,
                color: "#57534e",
                lineHeight: 1.3,
              }}
            >
              {SITE_TAGLINE}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
