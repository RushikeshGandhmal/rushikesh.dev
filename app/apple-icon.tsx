import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Render the R-monogram as an 180x180 apple-touch-icon that matches
// the nav badge: dark circle, serif R, accent dot at the bottom-right.
export default async function AppleIcon() {
  // Fetch the Instrument Serif TTF directly from the Google Fonts repo
  // (the fonts.gstatic.com CDN only serves woff2 which Satori cannot parse).
  const fontData = await fetch(
    new URL(
      "https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 90,
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "Instrument Serif",
            fontSize: 132,
            color: "#F0EBE2",
            lineHeight: 1,
            // Optical nudge up so the R sits visually centered in the circle
            marginTop: -8,
          }}
        >
          R
        </div>
        {/* accent dot bottom-right with paper-ring effect */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            right: 22,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: "#E85D2D",
            border: "5px solid #0A0A0A",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
