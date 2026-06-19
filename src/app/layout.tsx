import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BookFlow — ระบบจองคิวออนไลน์",
  description:
    "ระบบจองคิวออนไลน์สำหรับร้าน SME ขนาดเล็ก — ร้านทำเล็บ ตัดผม คลินิกความงาม",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geist.variable} ${plexThai.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
