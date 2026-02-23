import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Matiks Monitor | Brand Intelligence",
  description: "Track reviews, sentiment, and keyword trends across platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
