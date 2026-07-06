import { ImageResponse } from "next/og";

export const alt = "SKAD — Elegância em cada detalhe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#171714", color: "white" }}><div style={{ color: "#c8a45d", fontSize: 22, letterSpacing: 12, textTransform: "uppercase", marginBottom: 24 }}>Elegância em cada detalhe</div><div style={{ fontSize: 128, letterSpacing: 30, fontFamily: "serif" }}>SKAD</div><div style={{ width: 90, height: 2, background: "#c8a45d", marginTop: 30 }} /></div>, size);
}
