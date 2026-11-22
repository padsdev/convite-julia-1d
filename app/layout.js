import { Cinzel, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Cinzel({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Outfit({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Backstage Pass VIP • Julia 25",
  description: "Where We Are Tour · Pizza Hut · 26/11 19h",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
