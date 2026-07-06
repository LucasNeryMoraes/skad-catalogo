import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Manrope({
  variable: "--font-sans-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skad-catalogo.vercel.app"),
  title: "SKAD | Bolsas e Necessaires",
  description:
    "Bolsas e necessaires que unem elegância, qualidade e estilo para o dia a dia. Conheça o catálogo SKAD.",
  keywords: ["SKAD", "bolsas", "necessaires", "acessórios", "moda"],
  openGraph: {
    title: "SKAD | Elegância em cada detalhe",
    description:
      "Bolsas que unem elegância, qualidade e estilo para o dia a dia.",
    type: "website",
    locale: "pt_BR",
    siteName: "SKAD",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f7f5f1" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
