import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { GenerationStage, STEP_DURATION } from "./GenerationStage";
import { useLang } from "../App";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Template {
  id: string;
  label: string;
  image: string;
  accent: string;
}

interface CardVariant {
  template: Template;
  message: string;
  messageIndex: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT_CYCLE = ["#f5c26b", "#f5c26b", "#8ef5c0", "#a8d8ea", "#f5c26b"];

const TEMPLATE_LABELS = [
  "Poson Poya",
  "Blessed Day",
  "Lotus Garden",
  "Dhamma Light",
  "Peaceful Mind",
];

const FALLBACK_TEMPLATES: Template[] = Array.from({ length: 19 }, (_, index) => {
  const idNum = index + 1;
  const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length];
  const label = TEMPLATE_LABELS[index] || `Greeting ${idNum}`;
  return {
    id: `greeting${idNum}`,
    label,
    image: `/greetings/${idNum}.jpeg`,
    accent,
  };
});

// ─── Dynamic template loader ──────────────────────────────────────────────────
function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(FALLBACK_TEMPLATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mapFiles = (files: string[]): Template[] =>
      files.map((filename, i) => ({
        id: `greeting${i + 1}`,
        label:
          filename
            .replace(/\.[^.]+$/, "")
            .replace(/[_-]/g, " ")
            .replace(/\d{12,}/g, "")
            .trim()
            .slice(0, 28) || `Card ${i + 1}`,
        image: `/greetings/${filename}`,
        accent: ACCENT_CYCLE[i % ACCENT_CYCLE.length],
      }));

    fetch("/api/greetings")
      .then((r) => { if (!r.ok) throw new Error("no api"); return r.json(); })
      .then((files: string[]) => {
        if (!Array.isArray(files) || files.length === 0) throw new Error("empty");
        setTemplates(mapFiles(files));
      })
      .catch(() =>
        fetch("/greetings/index.json")
          .then((r) => r.json())
          .then((files: string[]) => {
            if (!Array.isArray(files) || files.length === 0) throw new Error("empty");
            setTemplates(mapFiles(files));
          })
          .catch(() => setTemplates(FALLBACK_TEMPLATES))
      )
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading };
}

// ─── Dharma Wheel SVG ────────────────────────────────────────────────────────
const DharmaWheel = ({ size = 32, color = "#c9923a" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="32" r="6"  stroke={color} strokeWidth="2.5" fill="none" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={32 + 6  * Math.cos(rad)} y1={32 + 6  * Math.sin(rad)}
          x2={32 + 26 * Math.cos(rad)} y2={32 + 26 * Math.sin(rad)}
          stroke={color} strokeWidth="2" strokeLinecap="round"
        />
      );
    })}
  </svg>
);


// ─── Card Preview ─────────────────────────────────────────────────────────────
const CardPreview = ({ template }: { template: Template; message: string }) => (
  <div
    style={{
      width: "100%",
      aspectRatio: "3 / 4",
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#060d1f",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      border: `1px solid ${template.accent}30`,
      userSelect: "none",
    }}
  >
    <img
      src={template.image}
      alt={template.label}
      crossOrigin="anonymous"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "fill",
        objectPosition: "center",
        display: "block",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 16px",
        background: "rgba(6,13,31,0.78)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderTop: `1px solid ${template.accent}22`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <DharmaWheel size={13} color={template.accent} />
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(6px, 2vw, 9px)",
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: template.accent,
          }}
        >
          e-Bix Software Solutions
        </span>
      </div>
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(6px, 2vw, 9px)",
          color: "#f0ede0",
          opacity: 0.45,
          letterSpacing: "0.05em",
        }}
      >
        Poson Poya 2026
      </span>
    </div>
  </div>
);

// ─── Share Button ─────────────────────────────────────────────────────────────
const ShareBtn = ({
  icon, label, onClick, color, disabled = false,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; color: string; disabled?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        padding: "11px 14px", borderRadius: 6,
        background: hovered ? `${color}22` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? color : "rgba(255,255,255,0.1)"}`,
        color: hovered ? color : "#f0ede0",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "clamp(11px, 3vw, 13px)",
        fontFamily: "Inter, sans-serif", fontWeight: 500,
        letterSpacing: "0.04em", transition: "all 0.18s ease",
        whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1,
        minHeight: 44,
        flex: "1 1 auto",
        touchAction: "manipulation",
      }}
    >
      {icon}{label}
    </button>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = "#c9923a" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ animation: "spinFast 0.7s linear infinite", flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3"
      strokeDasharray="40 20" strokeLinecap="round" />
  </svg>
);

// ─── Icons ────────────────────────────────────────────────────────────────────


const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const NativeShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

// ─── Main PosonCard Component ─────────────────────────────────────────────────
export default function PosonCard({ onClose }: { onClose?: () => void }) {
  const { templates, loading: templatesLoading } = useTemplates();
  const { lang, t } = useLang();

  const sinhalaFont = "'Noto Serif Sinhala', serif";
  const headingFont = lang === "si" ? sinhalaFont : "Cinzel, serif";
  const bodyFont = lang === "si" ? sinhalaFont : "Inter, sans-serif";

  const DECK = useMemo<CardVariant[]>(() => {
    const deck: CardVariant[] = [];
    for (const template of templates) {
      t.cardMessages.forEach((message, messageIndex) => {
        deck.push({ template, message, messageIndex });
      });
    }
    return deck;
  }, [templates, t.cardMessages]);

  const [currentCard, setCurrentCard]   = useState<CardVariant | null>(null);
  const [usedIndices, setUsedIndices]   = useState<number[]>([]);
  const [generated,   setGenerated]     = useState(false);
  const [generating,  setGenerating]    = useState(false);
  const [genStep,     setGenStep]       = useState(0);
  const [copied,      setCopied]        = useState(false);
  // Track which share button is loading (whatsapp | facebook | twitter | native | download)
  const [sharingPlatform, setSharingPlatform] = useState<string | null>(null);
  const [toastMsg,    setToastMsg]      = useState("");
  const [toastType,   setToastType]     = useState<"success" | "error">("success");
  const [preRenderedFile, setPreRenderedFile] = useState<File | null>(null);
  const [preRenderedBlob, setPreRenderedBlob] = useState<Blob | null>(null);

  const activeMessage = currentCard 
    ? (t.cardMessages[currentCard.messageIndex] || currentCard.message)
    : "";

  const cardRef    = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 3500);
  }, []);

  const pickRandom = useCallback(
    (currentUsed: number[]): { variant: CardVariant; newUsed: number[] } => {
      let pool = currentUsed;
      if (pool.length >= DECK.length) pool = [];
      const available = DECK.map((_, i) => i).filter(i => !pool.includes(i));
      const idx = available[Math.floor(Math.random() * available.length)];
      return { variant: DECK[idx], newUsed: [...pool, idx] };
    },
    [DECK]
  );

  const startStepTicker = useCallback(() => {
    setGenStep(0);
    let step = 0;
    if (stepTimer.current) clearInterval(stepTimer.current);
    stepTimer.current = setInterval(() => {
      step += 1;
      if (step >= t.genSteps.length) {
        clearInterval(stepTimer.current!);
        return;
      }
      setGenStep(step);
    }, STEP_DURATION);
  }, [t.genSteps.length]);

  const stopStepTicker = useCallback(() => {
    if (stepTimer.current) {
      clearInterval(stepTimer.current);
      stepTimer.current = null;
    }
  }, []);

  useEffect(() => () => { stopStepTicker(); }, [stopStepTicker]);

  useEffect(() => {
    if (templatesLoading || templates.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");
    const msgParam = params.get("msg");
    if (themeParam && msgParam) {
      const template = templates.find(t => t.id === themeParam) || templates[0];
      
      const enMessages = [
        "May the light of the Dhamma guide your path.\n\n https://happy-poson.vercel.app/",
        "Wishing you peace, wisdom & compassion.\n\n https://happy-poson.vercel.app/",
        "Sādhu • Sādhu • Sādhu\n\n https://happy-poson.vercel.app/",
        "May merit flow to all beings.\n\n https://happy-poson.vercel.app/",
      ];
      
      const siMessages = [
        "උතුම් දහම් ආලෝකය ඔබේ ජීවිතය ඒකාලෝක කරත්වා! පින්බර පොසොන් මංගල්‍යයක් වේවා!\n\n https://happy-poson.vercel.app/",
        "ඔබට සාමය, ප්‍රඥාව සහ කරුණාව පිරි වාසනාවන්ත පොසොන් පොහෝ දිනයක් වේවා!\n\n https://happy-poson.vercel.app/",
        "සාදු • සාදු • සාදු! උතුම් පොසොන් මංගල්‍යයේ ආශිර්වාදය ලැබේවා!\n\n https://happy-poson.vercel.app/",
        "සියලු සත්වයෝ සුවපත් වෙත්වා! රැස් කළ පින් සියලු ලෝකයාටම අත්වේවා!\n\n https://happy-poson.vercel.app/",
      ];

      let msgIndex = enMessages.indexOf(msgParam);
      if (msgIndex === -1) {
        msgIndex = siMessages.indexOf(msgParam);
      }

      setCurrentCard({
        template,
        message: msgParam,
        messageIndex: msgIndex !== -1 ? msgIndex : 0,
      });
      setGenerated(true);
    }
  }, [templates, templatesLoading]);

  // Pre-render generated card to avoid asynchronous delay (User Gesture timeout) on mobile sharing
  useEffect(() => {
    if (generated && !generating && currentCard && cardRef.current) {
      setPreRenderedFile(null);
      setPreRenderedBlob(null);

      const timer = setTimeout(async () => {
        try {
          const blob = await captureCard();
          const file = new File([blob], `Poson-Poya-${currentCard.template.id}.png`, { type: "image/png" });
          setPreRenderedBlob(blob);
          setPreRenderedFile(file);
        } catch (err) {
          console.error("Pre-rendering failed:", err);
        }
      }, 600); // Allow DOM elements & images to fully settle

      return () => clearTimeout(timer);
    } else {
      setPreRenderedFile(null);
      setPreRenderedBlob(null);
    }
  }, [currentCard, generated, generating]);

  const handleGenerate = () => {
    if (DECK.length === 0) return;
    setGenerating(true);
    startStepTicker();
    setTimeout(() => {
      const { variant, newUsed } = pickRandom(usedIndices);
      setCurrentCard(variant);
      setUsedIndices(newUsed);
      setGenerated(true);
      setGenerating(false);
      stopStepTicker();
    }, 7000);
  };

  const handleRetry = () => {
    if (DECK.length === 0) return;
    setGenerating(true);
    startStepTicker();
    setToastMsg("");
    setTimeout(() => {
      const { variant, newUsed } = pickRandom(usedIndices);
      setCurrentCard(variant);
      setUsedIndices(newUsed);
      setGenerating(false);
      stopStepTicker();
    }, 7000);
  };

  // ─── Core: capture card to Blob ──────────────────────────────────────────────
  const captureCard = async (): Promise<Blob> => {
    if (!cardRef.current) throw new Error("Card element not found");
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#060d1f",
      logging: false,
      width:  cardRef.current.offsetWidth,
      height: cardRef.current.offsetHeight,
    });
    return new Promise((resolve, reject) =>
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Blob conversion failed")), "image/png")
    );
  };

  // ─── Download ────────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!generated || !currentCard) return;
    setSharingPlatform("download");
    try {
      let blob = preRenderedBlob;
      if (!blob) {
        blob = await captureCard();
      }
      const link = document.createElement("a");
      link.download = `Poson-Greeting-${currentCard.template.id}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      showToast(t.cardDownloadedSuccess);
    } catch {
      showToast(t.cardDownloadFailed, "error");
    } finally {
      setSharingPlatform(null);
    }
  };

  // ─── Native Share (Web Share API) ────────────────────────────────────────────
  const handleNativeShare = async () => {
    if (!currentCard) return;
    setSharingPlatform("native");
    try {
      let file = preRenderedFile;
      let blob = preRenderedBlob;
      if (!file || !blob) {
        blob = await captureCard();
        file = new File([blob], `Poson-Poya-${currentCard.template.id}.png`, { type: "image/png" });
      }

      const isSi = lang === "si";
      const shareTitle = isSi ? "පොසොන් ආශිර්වාද සුබපැතුම් 🪷" : "Poson Poya Greetings 🪷";
      const shareText = `🌕 "${activeMessage}"\n\n${isSi ? "පින්බර පොසොන් පෝයක් වේවා!" : "Wishing you a blessed Poson Poya!"} #PosonPoya #Buddhism #SriLanka`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
        showToast(t.cardSharedSuccess);
      } else if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href,
        });
        showToast(t.cardSharedSuccess);
      } else {
        const link = document.createElement("a");
        link.download = `Poson-Poya-${currentCard.template.id}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        showToast(t.cardShareSaved);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        showToast(t.cardShareFailed, "error");
      }
    } finally {
      setSharingPlatform(null);
    }
  };

  // ─── Copy Link ────────────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    if (!currentCard) return;
    const url = `${window.location.origin}${window.location.pathname}?card=poson&msg=${encodeURIComponent(activeMessage)}&theme=${currentCard.template.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast(t.cardCopiedSuccess);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const isSharing = sharingPlatform !== null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp    { from { opacity:0; transform:translateY(40px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes slideUpMobile { from { opacity:0; transform:translateY(60px); } to { opacity:1; transform:translateY(0); } }
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spinSlow   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes spinFast   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stepFadeIn { from { opacity:0; transform:translateY(10px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes glowPulse  { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
        .modal-anim    { animation: slideUp 0.45s cubic-bezier(.22,.68,0,1.15) both; }
        .backdrop-anim { animation: backdropIn 0.3s ease both; }
        .toast-anim    { animation: fadeInUp 0.22s ease both; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,146,58,0.3); border-radius:99px; }
        .retry-btn:hover    { background:rgba(255,255,255,0.08) !important; border-color:rgba(255,255,255,0.25) !important; }
        .generate-btn:hover { filter:brightness(1.08); }
        .generate-btn:active{ transform:scale(0.99); }

        /* ── Share buttons: 2-col grid ── */
        .share-btn-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        /* ── Primary action buttons stack on mobile ── */
        .primary-actions {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }
        @media (min-width: 420px) {
          .primary-actions {
            flex-direction: row;
          }
        }

        /* ── Modal bottom-sheet on mobile ── */
        @media (max-width: 480px) {
          .poson-backdrop {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .poson-modal {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            max-height: 96dvh !important;
            animation: slideUpMobile 0.4s cubic-bezier(.22,.68,0,1.15) both !important;
            margin: 10px !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="backdrop-anim poson-backdrop"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(6,13,31,0.88)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px 16px 40px", overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Modal */}
        <div
          className="modal-anim poson-modal"
          onClick={e => e.stopPropagation()}
          style={{
            background: "rgba(8,16,36,0.97)",
            border: "1px solid rgba(201,146,58,0.25)",
            borderRadius: 16, width: "100%", maxWidth: 460,
            padding: "clamp(16px,3vw,32px)", position: "relative",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,146,58,0.08)",
            marginTop: "auto", marginBottom: "auto",
            maxHeight: "100dvh",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute", top: 14, right: 14,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f0ede0", cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s", zIndex: 10,
                touchAction: "manipulation",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >✕</button>
          )}

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingRight: 44 }}>
            <div style={{ animation: "spinSlow 18s linear infinite", display: "flex", flexShrink: 0 }}>
              <DharmaWheel size={28} color="#c9923a" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                fontFamily: headingFont, fontWeight: 700,
                fontSize: "clamp(1rem, 4vw, 1.45rem)",
                color: "#f5c26b", lineHeight: 1.1, marginBottom: 3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {t.cardTitle}
              </h2>
              <p style={{
                fontFamily: bodyFont,
                fontSize: "clamp(10px, 2.5vw, 12px)",
                color: "#f0ede0", opacity: 0.45, letterSpacing: "0.05em",
              }}>
                {templatesLoading
                  ? t.cardLoading
                  : t.cardStats
                      .replace("{templates}", String(templates.length))
                      .replace("{combinations}", String(DECK.length))}
              </p>
            </div>
          </div>

          {/* Card Stage */}
          <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              ref={cardRef}
              style={{
                width: "100%",
                maxWidth: "min(400px, 78vw)",
                position: "relative",
              }}
            >
              {generating && <GenerationStage stepIndex={genStep} />}

              {!generating && generated && currentCard && (
                <div style={{ position: "relative" }}>
                  <CardPreview template={currentCard.template} message={activeMessage} />
                </div>
              )}

              {!generating && !generated && (
                <div style={{
                  width: "100%", aspectRatio: "3/4", borderRadius: 12,
                  border: "1px dashed rgba(201,146,58,0.25)",
                  background: "rgba(201,146,58,0.04)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 10,
                }}>
                  {templatesLoading ? (
                    <Spinner color="#f5c26b" />
                  ) : (
                    <>
                      <DharmaWheel size={32} color="rgba(201,146,58,0.3)" />
                      <p style={{
                        fontFamily: bodyFont,
                        fontSize: "clamp(10px, 2.5vw, 12px)",
                        color: "rgba(240,237,224,0.3)", letterSpacing: "0.1em",
                        textTransform: "uppercase", textAlign: "center", padding: "0 20px",
                      }}>
                        {t.cardPlaceholder}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {generated && !generating && currentCard && (
              <p style={{
                fontFamily: bodyFont,
                fontSize: "clamp(9px, 2vw, 11px)",
                color: "rgba(240,237,224,0.35)", letterSpacing: "0.08em", textAlign: "center",
              }}>
                {t.cardIndexInfo
                  .replace("{index}", String(usedIndices.length))
                  .replace("{label}", currentCard.template.label)
                  .replace("{combinations}", String(DECK.length))}
              </p>
            )}
          </div>

          {/* Primary actions */}
          <div className="primary-actions" style={{ marginBottom: 24 }}>
            {generating ? (
              <button
                className="generate-btn"
                disabled
                style={{
                  flex: 1, padding: "14px 24px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                  color: "#1a0a00", fontFamily: bodyFont, fontWeight: 700,
                  fontSize: "clamp(12px, 3.5vw, 14px)", letterSpacing: "0.06em", textTransform: "uppercase",
                  opacity: 0.7,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 20px rgba(201,146,58,0.35)",
                  minHeight: 52, touchAction: "manipulation",
                }}
              >
                <Spinner color="#1a0a00" />
                <span key={genStep} style={{ animation: "stepFadeIn 0.3s ease both" }}>
                  {t.genSteps[genStep]?.headline ?? (lang === "si" ? "සාදමින්..." : "Generating…")}
                </span>
              </button>
            ) : !generated ? (
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={templatesLoading}
                style={{
                  flex: 1, padding: "14px 24px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                  color: "#1a0a00", fontFamily: bodyFont, fontWeight: 700,
                  fontSize: "clamp(12px, 3.5vw, 14px)", letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: templatesLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.15s ease",
                  boxShadow: "0 4px 20px rgba(201,146,58,0.35)",
                  minHeight: 52, touchAction: "manipulation",
                }}
              >
                {templatesLoading ? (
                  <><Spinner color="#1a0a00" /> {t.cardLoadingImages}</>
                ) : (
                  t.cardGenerateBtn
                )}
              </button>
            ) : (
              <>
                <button
                  className="retry-btn"
                  onClick={handleRetry}
                  disabled={isSharing}
                  style={{
                    flex: 1, padding: "13px 18px", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.04)", color: "#f0ede0",
                    fontFamily: bodyFont, fontWeight: 500,
                    fontSize: "clamp(12px, 3vw, 13px)", letterSpacing: "0.04em",
                    cursor: isSharing ? "not-allowed" : "pointer",
                    opacity: isSharing ? 0.6 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s ease",
                    minHeight: 48, touchAction: "manipulation",
                  }}
                >
                  <span style={{ display: "inline-block", fontSize: 16 }}>↺</span>
                  {t.cardTryAgain}
                </button>

                <button
                  className="generate-btn"
                  onClick={handleDownload}
                  disabled={isSharing}
                  style={{
                    flex: 1, padding: "13px 18px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                    color: "#1a0a00", fontFamily: bodyFont, fontWeight: 700,
                    fontSize: "clamp(12px, 3vw, 13px)", letterSpacing: "0.05em", textTransform: "uppercase",
                    cursor: isSharing ? "not-allowed" : "pointer",
                    opacity: isSharing ? 0.7 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s ease",
                    boxShadow: "0 4px 20px rgba(201,146,58,0.3)",
                    minHeight: 48, touchAction: "manipulation",
                  }}
                >
                  {sharingPlatform === "download" ? <Spinner color="#1a0a00" /> : <DownloadIcon />}
                  {sharingPlatform === "download" ? t.cardPreparing : t.cardDownloadBtn}
                </button>
              </>
            )}
          </div>

          {/* Social share row */}
          {generated && (
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", fontFamily: bodyFont,
                fontSize: "clamp(9px, 2.5vw, 11px)",
                fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#c9923a", marginBottom: 10, opacity: 0.8,
              }}>
                {t.cardShareLabel}
              </label>
              <div className="share-btn-row">
                <ShareBtn
                  icon={sharingPlatform === "native" ? <Spinner color="#f5c26b" /> : <NativeShareIcon />}
                  label={sharingPlatform === "native" ? t.cardSharing : t.cardShareImgBtn}
                  onClick={handleNativeShare}
                  color="#f5c26b"
                  disabled={isSharing}
                />

                <ShareBtn
                  icon={copied ? <CheckIcon /> : <LinkIcon />}
                  label={copied ? t.cardCopiedBtn : t.cardCopyLinkBtn}
                  onClick={handleCopyLink}
                  color={copied ? "#8ef5c0" : "#c9923a"}
                  disabled={isSharing}
                />
              </div>

              <p style={{
                marginTop: 10,
                fontFamily: bodyFont,
                fontSize: "clamp(9px, 2.5vw, 11px)",
                color: "rgba(240,237,224,0.3)", letterSpacing: "0.03em", lineHeight: 1.6,
              }}>
                {t.cardTip}
              </p>
            </div>
          )}

          {/* Toast */}
          {toastMsg && (
            <div
              className="toast-anim"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 16px", borderRadius: 8, marginBottom: 4,
                background: toastType === "success" ? "rgba(142,245,192,0.1)" : "rgba(245,100,100,0.1)",
                border: `1px solid ${toastType === "success" ? "rgba(142,245,192,0.3)" : "rgba(245,100,100,0.3)"}`,
                color: toastType === "success" ? "#8ef5c0" : "#f58080",
                fontFamily: bodyFont,
                fontSize: "clamp(11px, 3vw, 13px)",
                fontWeight: 500,
              }}
            >
              <span>{toastType === "success" ? "✓" : "✕"}</span>
              {toastMsg}
            </div>
          )}

          {/* Footer */}
          <p style={{
            marginTop: 24, paddingTop: 18,
            borderTop: "1px solid rgba(201,146,58,0.1)",
            fontFamily: bodyFont,
            fontSize: "clamp(9px, 2.5vw, 11px)",
            color: "#f0ede0", opacity: 0.3, textAlign: "center", letterSpacing: "0.05em",
          }}>
            {t.cardFooter}
          </p>
        </div>
      </div>
    </>
  );
}