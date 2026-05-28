import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #17191d 0%, #0f1012 100%)",
          border: "1.5px solid #2a2d33",
          borderRadius: "16px",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(223, 221, 215, 0.08)",
            borderRadius: "12px",
            inset: "4px",
            position: "absolute",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "30px",
            position: "relative",
            width: "24px",
          }}
        >
          <div
            style={{
              background: "#d2b279",
              bottom: 0,
              height: "28px",
              left: 0,
              position: "absolute",
              transform: "skew(-18deg)",
              transformOrigin: "bottom left",
              width: "4px",
            }}
          />
          <div
            style={{
              background: "#d2b279",
              bottom: 0,
              height: "28px",
              position: "absolute",
              right: 0,
              transform: "skew(18deg)",
              transformOrigin: "bottom right",
              width: "4px",
            }}
          />
          <div
            style={{
              background: "#dfddd7",
              borderRadius: "999px",
              height: "4px",
              left: "5px",
              opacity: 0.72,
              position: "absolute",
              top: "14px",
              width: "14px",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
