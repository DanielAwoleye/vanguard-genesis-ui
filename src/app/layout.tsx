import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Vanguard Genesis NFT",
  description: "Mint your Vanguard Genesis NFT – limited to 10,000 pieces",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
