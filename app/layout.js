import { IBM_Plex_Mono, Libre_Barcode_39, Staatliches } from "next/font/google";
import "./globals.css";

const display = Staatliches({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const barcode = Libre_Barcode_39({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-barcode",
});

export const metadata = {
  title: "Julia 25 — Where We Are Tour",
  description: "Convite de aniversário · Pizza Hut · 26/11 19h",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${mono.variable} ${barcode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
