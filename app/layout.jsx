import "./globals.css";
import { Poppins, Montserrat } from "next/font/google";

// Self-hosted at build time by Next — no runtime external request, no @import,
// no manual <head>. Montserrat stands in for the proprietary Nexa headline face.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Powerline — Powering Progress with Precision",
  description:
    "Powerline is a leading provider of low and medium voltage electrical panels serving industries and infrastructure projects across Egypt and the region since 2012.",
  metadataBase: new URL("https://powerlinei.com"),
  openGraph: {
    title: "Powerline — Powering Progress with Precision",
    description:
      "Low and medium voltage electrical solutions, designed and manufactured to international standards.",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
