"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wallet2, CheckCircle2, TimerReset, Shield, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";

// TON Connect (UI)
import {
  TonConnectUIProvider,
  TonConnectButton,
  useTonWallet,
  useTonConnectUI,
} from "@tonconnect/ui-react";

// ---- Helper UI bits ----
const NeonText = ({ children, className = "" }) => (
  <span
    className={`tracking-wide drop-shadow-[0_0_18px_rgba(99,102,241,0.45)] ${className}`}
  >
    {children}
  </span>
);

const Stat = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-2xl bg-white/5 p-4 border border-white/10 min-w-[140px]">
    <div className="text-xs uppercase text-white/60">{label}</div>
    <div className="text-xl font-semibold text-white">{value}</div>
  </div>
);

// ---- Main Client Component ----
export default function VanguardMintClient() {
  const TOTAL_SUPPLY = 10000;
  const PRICE_TON = 1;
  const TON_MANIFEST_URL =
    "https://YOUR-DOMAIN.com/tonconnect-manifest.json"; // replace later

  const [minted, setMinted] = useState(0);
  const [qty, setQty] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [rarity, setRarity] = useState("Common");
  const [mintStartAt, setMintStartAt] = useState<number | null>(null);

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const base = Math.floor(Math.random() * 300) + 200;
    setMinted(base);
  }, []);

  const percent = useMemo(
    () => Math.min(100, (minted / TOTAL_SUPPLY) * 100),
    [minted]
  );
  const isSoldOut = minted >= TOTAL_SUPPLY;

  useEffect(() => {
    if (isMinting && mintStartAt == null) setMintStartAt(Date.now());
    if (!isMinting) setMintStartAt(null);
  }, [isMinting]);

  async function handleConnect() {
    try {
      await tonConnectUI.connectWallet();
    } catch (e) {
      console.error(e);
      toast.error("Wallet connect failed");
    }
  }

  async function handleMint() {
    if (!wallet) {
      toast("Connect your TON wallet first");
      return;
    }
    if (isSoldOut) {
      toast("Sold out");
      return;
    }

    setIsMinting(true);

    try {
      await new Promise((r) => setTimeout(r, 1600));

      const duration = mintStartAt ? (Date.now() - mintStartAt) / 1000 : 0;
      const revealedRarity = duration > 10 ? "Uncommon" : "Common";
      setRarity(revealedRarity);

      setMinted((m) => Math.min(TOTAL_SUPPLY, m + qty));
      setShowCongrats(true);
      toast.success(`Minted ${qty} NFT${qty > 1 ? "s" : ""} for ${PRICE_TON * qty} TON`);
    } catch (e) {
      console.error(e);
      toast.error("Transaction failed");
    } finally {
      setIsMinting(false);
    }
  }

  const remaining = Math.max(0, TOTAL_SUPPLY - minted);

  return (
    <TonConnectUIProvider
      manifestUrl={TON_MANIFEST_URL}
      uiPreferences={{ theme: "DARK" }}
    >
      <div className="min-h-screen w-full bg-[#0a0b10] text-white relative overflow-hidden">
        {/* Your full UI goes here (Hero, Mint Card, etc.) */}
        <h1 className="text-3xl font-bold text-center mt-12">
          Vanguard Genesis NFT Mint UI
        </h1>
        {/* … keep the rest of your original UI code here … */}
      </div>
    </TonConnectUIProvider>
  );
}
