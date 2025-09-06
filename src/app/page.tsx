import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wallet2, CheckCircle2, TimerReset, Shield, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";

// TON Connect (UI) — you must provide your manifest URL below.
// Docs: https://github.com/ton-connect/sdk/tree/main/packages/ui-react
import { TonConnectUIProvider, TonConnectButton, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";

// ---- Helper UI bits ----
const NeonText = ({ children, className = "" }) => (
  <span className={`tracking-wide drop-shadow-[0_0_18px_rgba(99,102,241,0.45)] ${className}`}>{children}</span>
);

const Stat = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-2xl bg-white/5 p-4 border border-white/10 min-w-[140px]">
    <div className="text-xs uppercase text-white/60">{label}</div>
    <div className="text-xl font-semibold text-white">{value}</div>
  </div>
);

// ---- Main App ----
export default function VanguardGenesisMintApp() {
  // ------------------ CONFIG ------------------
  const TOTAL_SUPPLY = 10000;
  const PRICE_TON = 1; // 1 TON per mint
  const TON_MANIFEST_URL = "https://YOUR-DOMAIN.com/tonconnect-manifest.json"; // TODO: replace

  // ------------------ STATE ------------------
  const [minted, setMinted] = useState(0);
  const [qty, setQty] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [rarity, setRarity] = useState("Common");
  const [mintStartAt, setMintStartAt] = useState(null);

  // TON connect hooks
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  // Simulated live counter for demo (remove when wired to contract)
  useEffect(() => {
    const base = Math.floor(Math.random() * 300) + 200; // random starting point
    setMinted(base);
  }, []);

  const percent = useMemo(() => Math.min(100, (minted / TOTAL_SUPPLY) * 100), [minted]);
  const isSoldOut = minted >= TOTAL_SUPPLY;

  // Rarity logic (demo): if user keeps the mint dialog open for > 10 seconds, mark Uncommon
  useEffect(() => {
    if (isMinting && mintStartAt == null) setMintStartAt(Date.now());
    if (!isMinting) setMintStartAt(null);
  }, [isMinting]);

  // ------------------ ACTIONS ------------------
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
      // -------- Replace this block with your TON transaction call --------
      // Example using tonConnectUI.sendTransaction
      // const tx = {
      //   validUntil: Math.floor(Date.now() / 1000) + 60,
      //   messages: [
      //     {
      //       address: "YOUR_CONTRACT_ADDRESS",
      //       amount: String(PRICE_TON * qty * 1e9), // nanotons
      //       payload: "base64-ENCODED-PAYLOAD-IF-NEEDED",
      //     },
      //   ],
      // };
      // await tonConnectUI.sendTransaction(tx);
      // -------------------------------------------------------------------

      // DEMO: fake delay
      await new Promise((r) => setTimeout(r, 1600));

      // Determine rarity by how long user was in minting state
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
    <TonConnectUIProvider manifestUrl={TON_MANIFEST_URL} uiPreferences={{ theme: "DARK" }}>
      <div className="min-h-screen w-full bg-[#0a0b10] text-white relative overflow-hidden">
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full blur-[120px] opacity-40 bg-indigo-600/40" />
          <div className="absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full blur-[140px] opacity-30 bg-fuchsia-600/40" />
        </div>

        {/* Navbar */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <span className="font-semibold text-lg">Vanguard Genesis NFT</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
              <a href="#home" className="hover:text-white">Home</a>
              <a href="#mint" className="hover:text-white">Mint</a>
              <a href="#my-nfts" className="hover:text-white">My NFTs</a>
              <a href="#lore" className="hover:text-white">Lore</a>
              <a href="#faq" className="hover:text-white">FAQ</a>
            </nav>
            <div className="flex items-center gap-3">
              <TonConnectButton />
              {!wallet && (
                <Button onClick={handleConnect} className="hidden md:inline-flex bg-indigo-600 hover:bg-indigo-500 rounded-2xl">
                  <Wallet2 className="mr-2 h-4 w-4" /> Connect
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="home" className="relative">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold leading-tight"
              >
                Forge the <NeonText className="text-indigo-400">Genesis</NeonText>
                <br />
                Join the Vanguard
              </motion.h1>
              <p className="mt-4 text-white/70 max-w-xl">
                A one-time-only mint of <span className="font-semibold text-white">10,000</span> pieces. Each mint costs <span className="font-semibold text-white">{PRICE_TON} TON</span>.
                There will never be another Genesis.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Stat label="Minted" value={`${minted} / ${TOTAL_SUPPLY}`} />
                <Stat label="Remaining" value={remaining} />
                <Stat label="Price" value={`${PRICE_TON} TON`} />
              </div>
            </div>

            {/* Mint Card */}
            <motion.div
              id="mint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <Card className="bg-white/5 border-white/10 rounded-3xl shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Mint Vanguard Genesis</div>
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                  </div>

                  <div className="mt-4">
                    <Progress value={percent} className="h-2 bg-white/10" />
                    <div className="mt-2 flex items-center justify-between text-sm text-white/70">
                      <span>{minted} / {TOTAL_SUPPLY} minted</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
                      <div className="text-xs text-white/60">Price</div>
                      <div className="text-xl font-semibold">{PRICE_TON} TON</div>
                    </div>
                    <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
                      <div className="text-xs text-white/60">Quantity</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/20 text-white/80"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          disabled={isMinting}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={qty}
                          onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                          className="w-20 text-center bg-transparent border-white/20"
                          disabled={isMinting}
                        />
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/20 text-white/80"
                          onClick={() => setQty((q) => Math.min(10, q + 1))}
                          disabled={isMinting}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-white/70">
                    <div className="flex items-center gap-2"><Info className="h-4 w-4" /> Rarity reveals as **Common/Uncommon** based on mint timing.</div>
                    <div className="font-semibold">Total: {PRICE_TON * qty} TON</div>
                  </div>

                  <Button
                    disabled={isMinting || isSoldOut}
                    onClick={handleMint}
                    className={`mt-6 w-full h-12 rounded-2xl text-base font-semibold transition-all ${
                      isSoldOut
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 shadow-[0_0_30px_rgba(99,102,241,0.45)]"
                    }`}
                  >
                    {isSoldOut ? "Sold Out" : isMinting ? (
                      <span className="flex items-center gap-2"><TimerReset className="h-4 w-4 animate-spin" /> Processing…</span>
                    ) : (
                      <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Mint for {PRICE_TON} TON</span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Sections anchors (placeholders) */}
        <section id="my-nfts" className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="text-2xl font-semibold mb-3">My NFTs</h2>
          <p className="text-white/70">Connect your TON wallet to view your Vanguard Genesis NFTs and rarity distribution.</p>
        </section>

        <section id="lore" className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="text-2xl font-semibold mb-3">Lore</h2>
          <p className="text-white/70 max-w-3xl">In the shadow of collapsing empires, the Vanguard rose. This Genesis is the first and final forge—10,000 artifacts of initiation. There will never be another Genesis.</p>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-4 pb-24">
          <h2 className="text-2xl font-semibold mb-6">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10 rounded-2xl"><CardContent className="p-6"><div className="font-semibold">How much is the mint?</div><div className="text-white/70 mt-2">Each mint costs {PRICE_TON} TON.</div></CardContent></Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl"><CardContent className="p-6"><div className="font-semibold">Total supply?</div><div className="text-white/70 mt-2">10,000 Genesis NFTs. There will never be another Genesis.</div></CardContent></Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl"><CardContent className="p-6"><div className="font-semibold">Rarity?</div><div className="text-white/70 mt-2">Two tiers at mint reveal: Common / Uncommon (based on mint timing dynamics).</div></CardContent></Card>
            <Card className="bg-white/5 border-white/10 rounded-2xl"><CardContent className="p-6"><div className="font-semibold">Legacy vs Genesis?</div><div className="text-white/70 mt-2">Legacy (100 ultra-rare) is a separate top tier. This page is for Genesis (10,000) only.</div></CardContent></Card>
          </div>
        </section>

        {/* Dramatic Post-Mint Modal */}
        <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
          <DialogContent className="bg-gradient-to-b from-black to-black/90 border-white/20 text-white rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Congratulations, Pioneer!</DialogTitle>
              <DialogDescription className="text-white/80">
                You have forged a <span className="font-semibold">Vanguard Genesis NFT</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <p className="text-white/80">
                This is not just a collectible — it is your mark of being among the first 10,000 who shaped the Vanguard.
                There will never be another Genesis. You are part of history.
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 p-4 bg-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/60">Revealed Rarity</div>
                  <div className={`text-xl font-semibold ${rarity === "Uncommon" ? "text-fuchsia-300" : "text-indigo-300"}`}>{rarity}</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <DialogFooter>
              <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-500" onClick={() => setShowCongrats(false)}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster richColors position="top-center" />

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="mx-auto max-w-7xl px-4 text-xs text-white/60">
            © {new Date().getFullYear()} Vanguard — Genesis will never return.
          </div>
        </footer>
      </div>
    </TonConnectUIProvider>
  );
}

