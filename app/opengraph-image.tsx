import { ImageResponse } from "next/og";

export const alt = "Mythidex — Good Mythical Morning Episode Database";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(145deg, #0a0a0a 0%, #1a1210 50%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,98,26,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,98,26,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Mythi
            <span style={{ color: "#d4621a" }}>dex</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a1a1aa",
              letterSpacing: 0.5,
            }}
          >
            Good Mythical Morning Episode Database
          </div>

          {/* Divider */}
          <div
            style={{
              width: 80,
              height: 3,
              background: "#d4621a",
              borderRadius: 2,
              marginTop: 12,
            }}
          />

          <div
            style={{
              fontSize: 20,
              color: "#71717a",
              marginTop: 8,
            }}
          >
            mythidex.dev
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
