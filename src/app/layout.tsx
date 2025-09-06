import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vanguard Genesis NFT",
  description: "Mint your Vanguard Genesis NFT – limited to 10,000 pieces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">{children}</body>
    </html>
  );
}
