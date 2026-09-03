import { ImageResponse } from "next/og";

/** iOS home-screen icon. Same mark as icon.svg, rasterised at the size Safari wants. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#101214",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 32 32">
        <path
          d="M4 24 H9 C12 24 12.5 7 16 7 C18 7 18.5 14 20 14 C22 14 22 12.5 24 12.5 H28"
          fill="none"
          stroke="#f0a93c"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
