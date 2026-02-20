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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
