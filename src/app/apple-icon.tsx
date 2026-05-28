import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #17191d 0%, #0f1012 100%)",
          border: "4px solid #2a2d33",
          borderRadius: "36px",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(223, 221, 215, 0.08)",
            borderRadius: "30px",
            inset: "10px",
            position: "absolute",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "92px",
            position: "relative",
            width: "68px",
          }}
        >
          <div
            style={{
              background: "#d2b279",
              bottom: 0,
              height: "84px",
              left: 0,
              position: "absolute",
              transform: "skew(-18deg)",
              transformOrigin: "bottom left",
              width: "12px",
            }}
          />
          <div
            style={{
              background: "#d2b279",
              bottom: 0,
              height: "84px",
              position: "absolute",
              right: 0,
              transform: "skew(18deg)",
              transformOrigin: "bottom right",
              width: "12px",
            }}
          />
          <div
            style={{
              background: "#dfddd7",
              borderRadius: "999px",
              height: "12px",
              left: "14px",
              opacity: 0.72,
              position: "absolute",
              top: "42px",
              width: "40px",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
