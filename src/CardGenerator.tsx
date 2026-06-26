import React, { useState, useRef, useCallback } from "react";

interface CardGeneratorProps {
  onBackToLanding: () => void;
}

interface GreetingCard {
  file: string;
  name: string;
}

// ─── Update this list with your actual filenames from ./public/greetings ───
const CARDS: GreetingCard[] = [
  { file: "poson-1.jpg", name: "Mihintale Sunrise" },
  { file: "poson-2.jpg", name: "Lantern Festival" },
  { file: "poson-3.jpg", name: "Dhamma Light" },
  { file: "poson-4.jpg", name: "Sacred Bloom" },
  { file: "poson-5.jpg", name: "Moonlit Stupa" },
  { file: "poson-6.jpg", name: "Wisdom Path" },
];

const SHARE_TEXT = "Wishing you a blessed Poson Poya! 🙏✨";
const BASE_PATH = "/greetings/";

type ShareStatus = "idle" | "loading" | "done" | "error";

const CardGenerator: React.FC<CardGeneratorProps> = ({ onBackToLanding }) => {
  const [currentCard, setCurrentCard] = useState<GreetingCard | null>(null);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [toastMsg, setToastMsg] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setShareStatus("done");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShareStatus("idle"), 3500);
  }, []);

  const pickRandom = useCallback(
    (currentUsed: number[]): { card: GreetingCard; idx: number; newUsed: number[] } => {
      let pool = currentUsed;
      if (pool.length >= CARDS.length) pool = [];
      const available = CARDS.map((_, i) => i).filter((i) => !pool.includes(i));
      const idx = available[Math.floor(Math.random() * available.length)];
      return { card: CARDS[idx], idx, newUsed: [...pool, idx] };
    },
    []
  );

  const handleGenerate = () => {
    setGenerating(true);
    setImgLoaded(false);
    setTimeout(() => {
      const { card, idx, newUsed } = pickRandom(usedIndices);
      setCurrentCard(card);
      setCardIndex(idx);
      setUsedIndices(newUsed);
      setGenerated(true);
      setGenerating(false);
    }, 600);
  };

  const handleRetry = () => {
    setRetrying(true);
    setImgLoaded(false);
    setShareStatus("idle");
    setTimeout(() => {
      const { card, idx, newUsed } = pickRandom(usedIndices);
      setCurrentCard(card);
      setCardIndex(idx);
      setUsedIndices(newUsed);
      setRetrying(false);
    }, 400);
  };

  // ─── Capture card image using html2canvas, return blob ───
  const captureCard = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
    });
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
  };

  const handleNativeShare = async () => {
    setShareStatus("loading");
    try {
      const blob = await captureCard();
      if (!blob) throw new Error("Failed to capture card.");
      const file = new File([blob], "Poson-Greeting.png", { type: "image/png" });
      const shareUrl = window.location.origin;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Poson Poya Greeting",
          text: SHARE_TEXT,
          url: shareUrl,
          files: [file],
        });
        showToast("Card shared successfully!");
      } else {
        // fallback: download
        const link = document.createElement("a");
        link.download = "Poson-Greeting.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        showToast("Card downloaded to your device!");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setShareStatus("error");
        setTimeout(() => setShareStatus("idle"), 3000);
      } else {
        setShareStatus("idle");
      }
    }
  };

  const handleSocialShare = (platform: "whatsapp" | "twitter" | "facebook") => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(SHARE_TEXT);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    window.open(links[platform], "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Copy your browser URL to share.");
    }
  };

  const cardNumber = usedIndices.length;

  return (
    <div className="min-h-screen bg-[#050913] text-white font-sans antialiased selection:bg-amber-400 selection:text-black">

      {/* ── NAV ── */}
      <nav className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-900">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Return to hub</span>
        </button>
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
          E-BIX Card Studio
        </span>
      </nav>

      {/* ── MAIN ── */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Poson Poya cards
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Generate a Poson greeting card and share it with family and friends.
          </p>
        </div>

        {/* ── CARD PREVIEW ── */}
        <div className="w-full">
          <div
            ref={cardRef}
            className={`w-full aspect-[16/9] rounded-2xl border border-white/5 overflow-hidden relative transition-all duration-300 ${
              generated ? "shadow-2xl shadow-black/60" : "shadow-none"
            }`}
          >
            {/* Empty state */}
            {!generated && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-3 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-mono uppercase tracking-widest">Your card will appear here</p>
              </div>
            )}

            {/* Generated card image */}
            {generated && currentCard && (
              <>
                {/* Skeleton shimmer while image loads */}
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                )}
                <img
                  src={`${BASE_PATH}${currentCard.file}`}
                  alt={currentCard.name}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                />
                {/* Card label badge */}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                  Poson Poya 2026
                </div>
                {/* Card name badge top-right */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white/70 text-[10px] font-mono px-2.5 py-1 rounded-full">
                  {currentCard.name}
                </div>
              </>
            )}

            {/* Generating overlay */}
            {generating && (
              <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <svg className="w-7 h-7 animate-spin text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-xs font-mono uppercase tracking-widest">Selecting card…</span>
                </div>
              </div>
            )}
          </div>

          {/* Card counter */}
          {generated && (
            <p className="mt-2 text-center text-xs text-slate-500 font-mono">
              Card {cardNumber} of {CARDS.length} — {currentCard?.name}
            </p>
          )}
        </div>

        {/* ── ACTIONS ── */}
        <div className="w-full flex flex-col gap-4">

          {/* Generate button — hidden after first generation */}
          {!generated && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate your Poson card
                </>
              )}
            </button>
          )}

          {/* Retry + Download row — shown after generation */}
          {generated && (
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="flex-1 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={retrying ? "animate-spin inline-block" : ""}>↺</span>
                Try another
              </button>

              <button
                onClick={handleNativeShare}
                disabled={shareStatus === "loading"}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black text-sm font-extrabold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-amber-900/30"
              >
                {shareStatus === "loading" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Preparing…
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    Share card
                  </>
                )}
              </button>
            </div>
          )}

          {/* Social share row */}
          {generated && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 text-center">
                Share on social media
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { platform: "whatsapp", label: "WhatsApp", color: "hover:border-green-500 hover:text-green-400", icon: "📱" },
                    { platform: "twitter",  label: "X / Twitter", color: "hover:border-sky-500 hover:text-sky-400",   icon: "🐦" },
                    { platform: "facebook", label: "Facebook",  color: "hover:border-blue-500 hover:text-blue-400",  icon: "📘" },
                  ] as const
                ).map(({ platform, label, color, icon }) => (
                  <button
                    key={platform}
                    onClick={() => handleSocialShare(platform)}
                    className={`py-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${color} hover:bg-slate-900`}
                  >
                    <span className="text-lg leading-none">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Copy link */}
              <button
                onClick={handleCopyLink}
                className="w-full py-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 text-xs font-medium flex items-center justify-center gap-2 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900 transition-all"
              >
                <span>🔗</span>
                Copy link to share
              </button>
            </div>
          )}

          {/* Toast */}
          {(shareStatus === "done" || shareStatus === "error") && (
            <div
              className={`flex items-start gap-3 px-4 py-3 rounded-xl text-xs font-medium border transition-all ${
                shareStatus === "done"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <span className="mt-0.5">{shareStatus === "done" ? "✓" : "✕"}</span>
              <span>{shareStatus === "done" ? toastMsg : "Something went wrong. Please try again."}</span>
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-950 py-8 text-center text-slate-600 text-xs mt-8">
        © 2026 E-BIX Software Solutions. Designed with reverence for Sri Lankan cultural lineage.
      </footer>
    </div>
  );
};

export default CardGenerator;