import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MirrorChyan",
  description: "Next generation of CDN for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
