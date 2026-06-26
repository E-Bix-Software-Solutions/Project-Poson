import { useState, useRef, useCallback, useEffect, useMemo } from "react";

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

const MESSAGES = [
  "May the light of the Dhamma guide your path.\n\n https://happy-poson.vercel.app/",
  "Wishing you peace, wisdom & compassion.\n\n https://happy-poson.vercel.app/",
  "Sādhu • Sādhu • Sādhu\n\n https://happy-poson.vercel.app/",
  "May merit flow to all beings.\n\n https://happy-poson.vercel.app/",
];

const GENERATION_STEPS = [
  {
    icon: "☸️",
    headline: "Invoking the Dhamma…",
    sub: "Reaching into 2,500 years of sacred tradition",
  },
  {
    icon: "🪷",
    headline: "Gathering lotus light…",
    sub: "Selecting the blessing meant for you",
  },
  {
    icon: "🌕",
    headline: "Aligning with the Poya moon…",
    sub: "As Mahinda descended upon Mihintale",
  },
  {
    icon: "🏮",
    headline: "Lighting your lantern…",
    sub: "Atapattam colors warming the night sky",
  },
  {
    icon: "🙏",
    headline: "Your card is almost ready…",
    sub: "May this greeting carry merit to all who receive it",
  },
];

const STEP_DURATION = 900;

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

// ─── Generation Stage ─────────────────────────────────────────────────────────
const GenerationStage = ({ stepIndex }: { stepIndex: number }) => {
  const step = GENERATION_STEPS[Math.min(stepIndex, GENERATION_STEPS.length - 1)];
  const progress = Math.round(((stepIndex + 1) / GENERATION_STEPS.length) * 100);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 12,
        border: "1px solid rgba(201,146,58,0.25)",
        background: "rgba(6,13,31,0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "32px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,146,58,0.12) 0%, transparent 70%)",
          animation: "glowPulse 1.8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        key={`icon-${stepIndex}`}
        style={{
          fontSize: 44,
          marginBottom: 20,
          animation: "stepFadeIn 0.4s ease both",
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0 0 12px rgba(201,146,58,0.5))",
        }}
      >
        {step.icon}
      </div>
      <p
        key={`hl-${stepIndex}`}
        style={{
          fontFamily: "Cinzel, serif",
          fontWeight: 600,
          fontSize: "clamp(0.75rem, 4vw, 1rem)",
          color: "#f5c26b",
          textAlign: "center",
          marginBottom: 10,
          letterSpacing: "0.03em",
          lineHeight: 1.35,
          animation: "stepFadeIn 0.4s ease both",
          position: "relative",
          zIndex: 1,
        }}
      >
        {step.headline}
      </p>
      <p
        key={`sub-${stepIndex}`}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(0.65rem, 3vw, 0.8rem)",
          color: "#f0ede0",
          opacity: 0.45,
          textAlign: "center",
          lineHeight: 1.6,
          letterSpacing: "0.04em",
          marginBottom: 32,
          maxWidth: 260,
          animation: "stepFadeIn 0.5s 0.08s ease both",
          position: "relative",
          zIndex: 1,
        }}
      >
        {step.sub}
      </p>
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 28,
          right: 28,
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
          {GENERATION_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stepIndex ? 18 : 6,
                height: 6,
                borderRadius: 99,
                background: i <= stepIndex ? "#f5c26b" : "rgba(245,194,107,0.2)",
                transition: "width 0.35s ease, background 0.35s ease",
              }}
            />
          ))}
        </div>
        <div style={{ height: 2, borderRadius: 99, background: "rgba(201,146,58,0.15)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c9923a, #f5c26b)",
              boxShadow: "0 0 8px rgba(245,194,107,0.6)",
              borderRadius: 99,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
};

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
            fontSize: "clamp(7px, 2.5vw, 11px)",
            fontWeight: 600,
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
const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

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

  const DECK = useMemo<CardVariant[]>(() => {
    const deck: CardVariant[] = [];
    for (const template of templates)
      for (const message of MESSAGES)
        deck.push({ template, message });
    return deck;
  }, [templates]);

  const [currentCard, setCurrentCard]   = useState<CardVariant | null>(null);
  const [usedIndices, setUsedIndices]   = useState<number[]>([]);
  const [generated,   setGenerated]     = useState(false);
  const [generating,  setGenerating]    = useState(false);
  const [genStep,     setGenStep]       = useState(0);
  const [retrying,    setRetrying]      = useState(false);
  const [copied,      setCopied]        = useState(false);
  // Track which share button is loading (whatsapp | facebook | twitter | native | download)
  const [sharingPlatform, setSharingPlatform] = useState<string | null>(null);
  const [toastMsg,    setToastMsg]      = useState("");
  const [toastType,   setToastType]     = useState<"success" | "error">("success");

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
      if (step >= GENERATION_STEPS.length) {
        clearInterval(stepTimer.current!);
        return;
      }
      setGenStep(step);
    }, STEP_DURATION);
  }, []);

  const stopStepTicker = useCallback(() => {
    if (stepTimer.current) {
      clearInterval(stepTimer.current);
      stepTimer.current = null;
    }
  }, []);

  useEffect(() => () => { stopStepTicker(); }, [stopStepTicker]);

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
    setRetrying(true);
    setToastMsg("");
    setTimeout(() => {
      const { variant, newUsed } = pickRandom(usedIndices);
      setCurrentCard(variant);
      setUsedIndices(newUsed);
      setRetrying(false);
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
      const blob = await captureCard();
      const link = document.createElement("a");
      link.download = `Poson-Greeting-${currentCard.template.id}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      showToast("Card downloaded successfully!");
    } catch {
      showToast("Download failed. Please try again.", "error");
    } finally {
      setSharingPlatform(null);
    }
  };

  // ─── Native Share (Web Share API) ────────────────────────────────────────────
  const handleNativeShare = async () => {
    if (!currentCard) return;
    setSharingPlatform("native");
    try {
      const blob = await captureCard();
      const file = new File([blob], `Poson-Poya-${currentCard.template.id}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Poson Poya Greetings 🪷",
          text: `🌕 "${currentCard.message}"\n\nWishing you a blessed Poson Poya! #PosonPoya #Buddhism #SriLanka`,
        });
        showToast("Shared successfully!");
      } else if (navigator.share) {
        await navigator.share({
          title: "Poson Poya Greetings 🪷",
          text: `🌕 "${currentCard.message}"\n\nWishing you a blessed Poson Poya! #PosonPoya #Buddhism #SriLanka`,
          url: window.location.href,
        });
        showToast("Shared successfully!");
      } else {
        const link = document.createElement("a");
        link.download = `Poson-Poya-${currentCard.template.id}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        showToast("Image saved — share it from your files!");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        showToast("Sharing failed. Try downloading instead.", "error");
      }
    } finally {
      setSharingPlatform(null);
    }
  };

  // ─── WhatsApp ────────────────────────────────────────────────────────────────
  const handleWhatsApp = async () => {
    if (!currentCard) return;
    setSharingPlatform("whatsapp");
    try {
      const blob = await captureCard();
      const file = new File([blob], "Poson-Poya.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Poson Poya Greetings",
          text: `🪷 *Poson Poya Greetings* 🌕\n\n"${currentCard.message}"\n\n${window.location.href}\n\n#PosonPoya #Buddhism #SriLanka`,
        });
        showToast("Opened share sheet!");
      } else {
        const text = `🪷 *Poson Poya Greetings* 🌕\n\n"${currentCard.message}"\n\n ${window.location.href}\n\n#PosonPoya #Buddhism #SriLanka`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        showToast("Tip: Download the image and attach it in WhatsApp!");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        const text = `🪷 *Poson Poya Greetings* 🌕\n\n"${currentCard.message}"\n\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }
    } finally {
      setSharingPlatform(null);
    }
  };

  // ─── Facebook ────────────────────────────────────────────────────────────────
  const handleFacebook = () => {
    if (!currentCard) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?card=poson&theme=${currentCard.template.id}&msg=${encodeURIComponent(currentCard.message)}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
    showToast("Tip: Download the image and post it directly for best results!");
  };

  // ─── Twitter / X ─────────────────────────────────────────────────────────────
  const handleTwitter = async () => {
    if (!currentCard) return;

    if (navigator.canShare) {
      setSharingPlatform("twitter");
      try {
        const blob = await captureCard();
        const file = new File([blob], "Poson-Poya.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Poson Poya Greetings",
            text: `🌕 Poson Poya — the full moon that brought Buddhism to Sri Lanka.\n\n"${currentCard.message}"\n\n#PosonPoya #Buddhism #SriLanka`,
          });
          setSharingPlatform(null);
          return;
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          setSharingPlatform(null);
          return;
        }
      } finally {
        setSharingPlatform(null);
      }
    }

    const text = `🌕 Poson Poya — the full moon that brought Buddhism to Sri Lanka.\n\n"${currentCard.message}"\n\n#PosonPoya #Buddhism #SriLanka`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  // ─── Copy Link ────────────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    if (!currentCard) return;
    const url = `${window.location.origin}${window.location.pathname}?card=poson&msg=${encodeURIComponent(currentCard.message)}&theme=${currentCard.template.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isSharing = sharingPlatform !== null;
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

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

        /* ── Share buttons: 2-col grid on mobile, wrap naturally on desktop ── */
        .share-btn-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (min-width: 480px) {
          .share-btn-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
        }

        /* ── Native share spans full width on mobile ── */
        .share-btn-native {
          grid-column: 1 / -1;
        }
        @media (min-width: 480px) {
          .share-btn-native {
            grid-column: auto;
          }
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
            borderRadius: 16, width: "100%", maxWidth: 680,
            padding: "clamp(20px,4vw,44px)", position: "relative",
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
                fontFamily: "Cinzel,serif", fontWeight: 700,
                fontSize: "clamp(1rem, 4vw, 1.45rem)",
                color: "#f5c26b", lineHeight: 1.1, marginBottom: 3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                Poson Poya Greeting Card
              </h2>
              <p style={{
                fontFamily: "Inter,sans-serif",
                fontSize: "clamp(10px, 2.5vw, 12px)",
                color: "#f0ede0", opacity: 0.45, letterSpacing: "0.05em",
              }}>
                {templatesLoading
                  ? "Loading cards…"
                  : `${templates.length} images · ${DECK.length} combinations · share the Dhamma's light`}
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
                  <CardPreview template={currentCard.template} message={currentCard.message} />
                  {retrying && (
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: 12,
                      background: "rgba(6,13,31,0.75)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backdropFilter: "blur(2px)",
                    }}>
                      <Spinner color="#f5c26b" />
                    </div>
                  )}
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
                        fontFamily: "Inter,sans-serif",
                        fontSize: "clamp(10px, 2.5vw, 12px)",
                        color: "rgba(240,237,224,0.3)", letterSpacing: "0.1em",
                        textTransform: "uppercase", textAlign: "center", padding: "0 20px",
                      }}>
                        Your card will appear here
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {generated && !generating && currentCard && (
              <p style={{
                fontFamily: "Inter,sans-serif",
                fontSize: "clamp(9px, 2vw, 11px)",
                color: "rgba(240,237,224,0.35)", letterSpacing: "0.08em", textAlign: "center",
              }}>
                Card {usedIndices.length} · {currentCard.template.label} · {DECK.length} combinations
              </p>
            )}
          </div>

          {/* Primary actions */}
          <div className="primary-actions" style={{ marginBottom: 24 }}>
            {!generated && (
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating || templatesLoading}
                style={{
                  flex: 1, padding: "14px 24px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                  color: "#1a0a00", fontFamily: "Inter,sans-serif", fontWeight: 700,
                  fontSize: "clamp(12px, 3.5vw, 14px)", letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: generating || templatesLoading ? "not-allowed" : "pointer",
                  opacity: generating || templatesLoading ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.15s ease",
                  boxShadow: "0 4px 20px rgba(201,146,58,0.35)",
                  minHeight: 52, touchAction: "manipulation",
                }}
              >
                {generating ? (
                  <>
                    <Spinner color="#1a0a00" />
                    <span key={genStep} style={{ animation: "stepFadeIn 0.3s ease both" }}>
                      {GENERATION_STEPS[genStep]?.headline ?? "Generating…"}
                    </span>
                  </>
                ) : templatesLoading ? (
                  <><Spinner color="#1a0a00" /> Loading images…</>
                ) : (
                  "✨ Generate your Poson card"
                )}
              </button>
            )}

            {generated && (
              <>
                <button
                  className="retry-btn"
                  onClick={handleRetry}
                  disabled={retrying || isSharing}
                  style={{
                    flex: 1, padding: "13px 18px", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.04)", color: "#f0ede0",
                    fontFamily: "Inter,sans-serif", fontWeight: 500,
                    fontSize: "clamp(12px, 3vw, 13px)", letterSpacing: "0.04em",
                    cursor: retrying || isSharing ? "not-allowed" : "pointer",
                    opacity: retrying || isSharing ? 0.6 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s ease",
                    minHeight: 48, touchAction: "manipulation",
                  }}
                >
                  <span style={{ display: "inline-block", animation: retrying ? "spinFast 0.6s linear infinite" : "none", fontSize: 16 }}>↺</span>
                  Try another
                </button>

                <button
                  className="generate-btn"
                  onClick={handleDownload}
                  disabled={isSharing}
                  style={{
                    flex: 1, padding: "13px 18px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                    color: "#1a0a00", fontFamily: "Inter,sans-serif", fontWeight: 700,
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
                  {sharingPlatform === "download" ? "Preparing…" : "Download card"}
                </button>
              </>
            )}
          </div>

          {/* Social share row */}
          {generated && (
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontFamily: "Inter,sans-serif",
                fontSize: "clamp(9px, 2.5vw, 11px)",
                fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#c9923a", marginBottom: 12, opacity: 0.8,
              }}>
                Share via
              </label>
              <div className="share-btn-row">

                {canNativeShare && (
                  <div className="share-btn-native">
                    <ShareBtn
                      icon={sharingPlatform === "native" ? <Spinner color="#f5c26b" /> : <NativeShareIcon />}
                      label={sharingPlatform === "native" ? "Sharing…" : "Share image"}
                      onClick={handleNativeShare}
                      color="#f5c26b"
                      disabled={isSharing}
                    />
                  </div>
                )}

                <ShareBtn
                  icon={sharingPlatform === "whatsapp" ? <Spinner color="#25d366" /> : <WhatsAppIcon />}
                  label="WhatsApp"
                  onClick={handleWhatsApp}
                  color="#25d366"
                  disabled={isSharing}
                />

                <ShareBtn
                  icon={<FacebookIcon />}
                  label="Facebook"
                  onClick={handleFacebook}
                  color="#1877f2"
                  disabled={isSharing}
                />

                <ShareBtn
                  icon={sharingPlatform === "twitter" ? <Spinner color="#1da1f2" /> : <TwitterIcon />}
                  label="X / Twitter"
                  onClick={handleTwitter}
                  color="#1da1f2"
                  disabled={isSharing}
                />

                <ShareBtn
                  icon={copied ? <CheckIcon /> : <LinkIcon />}
                  label={copied ? "Copied!" : "Copy link"}
                  onClick={handleCopyLink}
                  color={copied ? "#8ef5c0" : "#c9923a"}
                  disabled={isSharing}
                />

              </div>

              <p style={{
                marginTop: 10,
                fontFamily: "Inter,sans-serif",
                fontSize: "clamp(9px, 2.5vw, 11px)",
                color: "rgba(240,237,224,0.3)", letterSpacing: "0.03em", lineHeight: 1.6,
              }}>
                💡 For Facebook & X, download the image first and attach it manually for full image sharing.
                {canNativeShare ? " Use Share image on mobile to send the actual image file." : ""}
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
                fontFamily: "Inter,sans-serif",
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
            fontFamily: "Inter,sans-serif",
            fontSize: "clamp(9px, 2.5vw, 11px)",
            color: "#f0ede0", opacity: 0.3, textAlign: "center", letterSpacing: "0.05em",
          }}>
            Poson Poya · ශ්‍රී ලංකා · Sādhu Sādhu Sādhu 🙏
          </p>
        </div>
      </div>
    </>
  );
}