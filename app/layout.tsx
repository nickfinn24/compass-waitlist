import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compass – Career Clarity & Mentorship",
  description:
    "Career exploration, ROI insights, and mentor exposure for students. Choose your major with conviction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#faf8f5]">
      <body className="antialiased bg-[#faf8f5] text-[#1a2332] min-h-screen">{children}</body>
    </html>
  );
}
