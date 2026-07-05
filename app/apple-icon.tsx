import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F4",
          borderRadius: "50%",
          border: "6px solid #C9A227",
          fontSize: 72,
          fontWeight: 700,
          color: "#C9A227",
        }}
      >
        AG
      </div>
    ),
    { ...size }
  );
}
