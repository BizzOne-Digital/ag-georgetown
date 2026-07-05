import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AG Liquidation Perfume & Cosmetics - Georgetown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F4",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderImage: "linear-gradient(135deg, #C9A227, #F0D98C) 1",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 600,
            color: "#C9A227",
          }}
        >
          AG
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            color: "#0D0D0D",
            letterSpacing: "-0.02em",
          }}
        >
          LIQUIDATION
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "0.3em",
            color: "#1A1A1A",
          }}
        >
          PERFUME &amp; COSMETICS
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "0.2em",
            color: "#E8879E",
          }}
        >
          GEORGETOWN
        </div>
      </div>
    ),
    { ...size }
  );
}
