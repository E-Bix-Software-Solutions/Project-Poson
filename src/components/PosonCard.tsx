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


// 1. Define your custom labels in order (add more or let them fallback)
const TEMPLATE_LABELS = [
  "Poson Poya",
  "Blessed Day",
  "Lotus Garden",
  "Dhamma Light",
  "Peaceful Mind",
  // You can add unique labels up to 19 here. 
  // If there are fewer labels than images, the code below will provide a fallback.
];

// 2. Dynamically generate the 19 templates
const FALLBACK_TEMPLATES: Template[] = Array.from({ length: 19 }, (_, index) => {
  const idNum = index + 1;
  
  // Cycle through your accent colors safely
  const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length];
  
  // Pick a label if defined, otherwise fallback to a generic one
  const label = TEMPLATE_LABELS[index] || `Greeting ${idNum}`;

  return {
    id: `greeting${idNum}`,
    label: label,
    image: `/greetings/${idNum}.jpeg`,
    accent: accent,
  };
});

const MESSAGES = [
  "May the light of the Dhamma guide your path.",
  "Wishing you peace, wisdom & compassion.",
  "Sādhu • Sādhu • Sādhu",
  "May merit flow to all beings.",
];

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
// Uses a real <img> tag so the image fills 100% width/height with no gaps,
// and html2canvas can capture it correctly for download.
const CardPreview = ({ template }: { template: Template; message: string }) => (
  <div
    style={{
      width: "100%",
      aspectRatio: "3 / 4",        // matches 896×1200 portrait images exactly
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#060d1f",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      border: `1px solid ${template.accent}30`,
      userSelect: "none",
    }}
  >
    {/* Full-bleed image — fills entire card, no gaps, no letterbox */}
    <img
      src={template.image}
      alt={template.label}
      crossOrigin="anonymous"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "fill",       // fills card completely
        objectPosition: "center",
        display: "block",
      }}
    />

    {/* Company name bar — pinned to bottom, over the image */}
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
            fontSize: "clamp(8px, 1.8vw, 11px)",
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
          fontSize: "clamp(7px, 1.4vw, 9px)",
          color: "#f0ede0",
          opacity: 0.45,
          letterSpacing: "0.05em",
        }}
      >
        Poson Poya 2025
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
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 18px", borderRadius: 6,
        background: hovered ? `${color}22` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? color : "rgba(255,255,255,0.1)"}`,
        color: hovered ? color : "#f0ede0",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 500,
        letterSpacing: "0.04em", transition: "all 0.18s ease",
        whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}{label}
    </button>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = "#c9923a" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ animation: "spinFast 0.7s linear infinite" }}>
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

  const [currentCard, setCurrentCard] = useState<CardVariant | null>(null);
  const [usedIndices, setUsedIndices]   = useState<number[]>([]);
  const [generated,   setGenerated]     = useState(false);
  const [generating,  setGenerating]    = useState(false);
  const [retrying,    setRetrying]      = useState(false);
  const [copied,      setCopied]        = useState(false);
  const [capturing,   setCapturing]     = useState(false);
  const [toastMsg,    setToastMsg]      = useState("");
  const [toastType,   setToastType]     = useState<"success" | "error">("success");

  const cardRef   = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleGenerate = () => {
    if (DECK.length === 0) return;
    setGenerating(true);
    setTimeout(() => {
      const { variant, newUsed } = pickRandom(usedIndices);
      setCurrentCard(variant);
      setUsedIndices(newUsed);
      setGenerated(true);
      setGenerating(false);
    }, 550);
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
    }, 380);
  };

  // Capture the card div as a PNG blob using html2canvas
  const captureCard = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#060d1f",
      logging: false,
      // Make canvas match the exact rendered size of the card element
      width:  cardRef.current.offsetWidth,
      height: cardRef.current.offsetHeight,
    });
    return new Promise(resolve => canvas.toBlob(b => resolve(b), "image/png"));
  };

  const handleDownload = async () => {
    if (!generated || !currentCard) return;
    setCapturing(true);
    try {
      const blob = await captureCard();
      if (!blob) throw new Error("Capture failed");
      const link = document.createElement("a");
      link.download = `Poson-Greeting-${currentCard.template.id}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      showToast("Card downloaded successfully!");
    } catch {
      showToast("Download failed. Please try again.", "error");
    } finally {
      setCapturing(false);
    }
  };

  const handleWhatsApp = () => {
    if (!currentCard) return;
    const text = `🪷 *Poson Poya Greetings* 🌕\n\n"${currentCard.message}"\n\nLearn about Poson Poya — the sacred full moon that brought the Dhamma to Sri Lanka.\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const handleTwitter = () => {
    if (!currentCard) return;
    const text = `🌕 Poson Poya — the full moon that brought Buddhism to Sri Lanka.\n\n"${currentCard.message}"\n\n#PosonPoya #Buddhism #SriLanka`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const handleCopyLink = () => {
    if (!currentCard) return;
    const url = `${window.location.origin}${window.location.pathname}?card=poson&msg=${encodeURIComponent(currentCard.message)}&theme=${currentCard.template.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp    { from { opacity:0; transform:translateY(40px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spinSlow   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes spinFast   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .modal-anim    { animation: slideUp 0.45s cubic-bezier(.22,.68,0,1.15) both; }
        .backdrop-anim { animation: backdropIn 0.3s ease both; }
        .toast-anim    { animation: fadeInUp 0.22s ease both; }
        .share-btn-row { display:flex; gap:10px; flex-wrap:wrap; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,146,58,0.3); border-radius:99px; }
        .retry-btn:hover    { background:rgba(255,255,255,0.08) !important; border-color:rgba(255,255,255,0.25) !important; }
        .generate-btn:hover { filter:brightness(1.08); }
        .generate-btn:active{ transform:scale(0.99); }
      `}</style>

      {/* Backdrop */}
      <div
        className="backdrop-anim"
        onClick={onClose}
        style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(6,13,31,0.88)",
          backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"24px 16px 40px", overflowY:"auto",
        }}
      >
        {/* Modal */}
        <div
          className="modal-anim"
          onClick={e => e.stopPropagation()}
          style={{
            background:"rgba(8,16,36,0.97)",
            border:"1px solid rgba(201,146,58,0.25)",
            borderRadius:16, width:"100%", maxWidth:680,
            padding:"clamp(24px,4vw,44px)", position:"relative",
            boxShadow:"0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,146,58,0.08)",
            marginTop:"auto", marginBottom:"auto",
          }}
        >
          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position:"absolute", top:16, right:16,
                width:32, height:32, borderRadius:"50%",
                background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.1)",
                color:"#f0ede0", cursor:"pointer", fontSize:16,
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >✕</button>
          )}

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <div style={{ animation:"spinSlow 18s linear infinite", display:"flex" }}>
              <DharmaWheel size={28} color="#c9923a" />
            </div>
            <div>
              <h2 style={{ fontFamily:"Cinzel,serif", fontWeight:700, fontSize:"clamp(1.1rem,3vw,1.45rem)", color:"#f5c26b", lineHeight:1.1, marginBottom:3 }}>
                Poson Poya Greeting Card
              </h2>
              <p style={{ fontFamily:"Inter,sans-serif", fontSize:12, color:"#f0ede0", opacity:0.45, letterSpacing:"0.05em" }}>
                {templatesLoading
                  ? "Loading cards…"
                  : `${templates.length} images · ${DECK.length} combinations · share the Dhamma's light`}
              </p>
            </div>
          </div>

          {/* Card Stage */}
          <div style={{ marginBottom:28, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            {/* cardRef wraps ONLY the CardPreview so html2canvas captures just the card */}
            <div ref={cardRef} style={{ width:"100%", maxWidth:400, position:"relative" }}>
              {generated && currentCard ? (
                <div style={{ position:"relative" }}>
                  <CardPreview template={currentCard.template} message={currentCard.message} />
                  {retrying && (
                    <div style={{
                      position:"absolute", inset:0, borderRadius:12,
                      background:"rgba(6,13,31,0.75)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      backdropFilter:"blur(2px)",
                    }}>
                      <Spinner color="#f5c26b" />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  width:"100%", aspectRatio:"3/4", borderRadius:12,
                  border:"1px dashed rgba(201,146,58,0.25)",
                  background:"rgba(201,146,58,0.04)",
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center", gap:10,
                }}>
                  {generating || templatesLoading ? (
                    <Spinner color="#f5c26b" />
                  ) : (
                    <>
                      <DharmaWheel size={32} color="rgba(201,146,58,0.3)" />
                      <p style={{ fontFamily:"Inter,sans-serif", fontSize:12, color:"rgba(240,237,224,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", textAlign:"center", padding:"0 20px" }}>
                        Your card will appear here
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {generated && currentCard && (
              <p style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:"rgba(240,237,224,0.35)", letterSpacing:"0.08em", textAlign:"center" }}>
                Card {usedIndices.length} · {currentCard.template.label} · {DECK.length} combinations
              </p>
            )}
          </div>

          {/* Primary actions */}
          <div style={{ display:"flex", gap:12, marginBottom:24 }}>
            {!generated && (
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating || templatesLoading}
                style={{
                  flex:1, padding:"14px 24px", borderRadius:8, border:"none",
                  background:"linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                  color:"#1a0a00", fontFamily:"Inter,sans-serif", fontWeight:700,
                  fontSize:14, letterSpacing:"0.06em", textTransform:"uppercase",
                  cursor: generating || templatesLoading ? "not-allowed" : "pointer",
                  opacity: generating || templatesLoading ? 0.7 : 1,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"all 0.15s ease",
                  boxShadow:"0 4px 20px rgba(201,146,58,0.35)",
                }}
              >
                {generating || templatesLoading ? <Spinner color="#1a0a00" /> : "✨"}
                {templatesLoading ? "Loading images…" : generating ? "Generating…" : "Generate your Poson card"}
              </button>
            )}

            {generated && (
              <>
                <button
                  className="retry-btn"
                  onClick={handleRetry}
                  disabled={retrying}
                  style={{
                    flex:1, padding:"13px 18px", borderRadius:8,
                    border:"1px solid rgba(255,255,255,0.15)",
                    background:"rgba(255,255,255,0.04)", color:"#f0ede0",
                    fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:13,
                    letterSpacing:"0.04em",
                    cursor: retrying ? "not-allowed" : "pointer",
                    opacity: retrying ? 0.6 : 1,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    transition:"all 0.15s ease",
                  }}
                >
                  <span style={{ display:"inline-block", animation: retrying ? "spinFast 0.6s linear infinite" : "none", fontSize:16 }}>↺</span>
                  Try another
                </button>

                <button
                  className="generate-btn"
                  onClick={handleDownload}
                  disabled={capturing}
                  style={{
                    flex:1, padding:"13px 18px", borderRadius:8, border:"none",
                    background:"linear-gradient(135deg,#c9923a 0%,#f5c26b 50%,#c9923a 100%)",
                    color:"#1a0a00", fontFamily:"Inter,sans-serif", fontWeight:700,
                    fontSize:13, letterSpacing:"0.05em", textTransform:"uppercase",
                    cursor: capturing ? "not-allowed" : "pointer",
                    opacity: capturing ? 0.7 : 1,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    transition:"all 0.15s ease",
                    boxShadow:"0 4px 20px rgba(201,146,58,0.3)",
                  }}
                >
                  {capturing ? <Spinner color="#1a0a00" /> : <DownloadIcon />}
                  {capturing ? "Preparing…" : "Download card"}
                </button>
              </>
            )}
          </div>

          {/* Social share row */}
          {generated && (
            <div style={{ marginBottom:24 }}>
              <label style={{
                display:"block", fontFamily:"Inter,sans-serif", fontSize:11,
                fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase",
                color:"#c9923a", marginBottom:12, opacity:0.8,
              }}>
                Share via
              </label>
              <div className="share-btn-row">
                <ShareBtn icon={<WhatsAppIcon />} label="WhatsApp"   onClick={handleWhatsApp}  color="#25d366" />
                <ShareBtn icon={<FacebookIcon />} label="Facebook"   onClick={handleFacebook}  color="#1877f2" />
                <ShareBtn icon={<TwitterIcon />}  label="X / Twitter" onClick={handleTwitter}  color="#1da1f2" />
                <ShareBtn
                  icon={copied ? <CheckIcon /> : <LinkIcon />}
                  label={copied ? "Copied!" : "Copy link"}
                  onClick={handleCopyLink}
                  color={copied ? "#8ef5c0" : "#c9923a"}
                />
                <ShareBtn
                  icon={capturing ? <Spinner color="#c9923a" /> : <DownloadIcon />}
                  label={capturing ? "Saving…" : "Download"}
                  onClick={handleDownload}
                  color="#c9923a"
                  disabled={capturing}
                />
              </div>
            </div>
          )}

          {/* Toast */}
          {toastMsg && (
            <div
              className="toast-anim"
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"11px 16px", borderRadius:8, marginBottom:4,
                background: toastType === "success" ? "rgba(142,245,192,0.1)" : "rgba(245,100,100,0.1)",
                border: `1px solid ${toastType === "success" ? "rgba(142,245,192,0.3)" : "rgba(245,100,100,0.3)"}`,
                color: toastType === "success" ? "#8ef5c0" : "#f58080",
                fontFamily:"Inter,sans-serif", fontSize:13, fontWeight:500,
              }}
            >
              <span>{toastType === "success" ? "✓" : "✕"}</span>
              {toastMsg}
            </div>
          )}

          {/* Footer */}
          <p style={{
            marginTop:24, paddingTop:18,
            borderTop:"1px solid rgba(201,146,58,0.1)",
            fontFamily:"Inter,sans-serif", fontSize:11,
            color:"#f0ede0", opacity:0.3, textAlign:"center", letterSpacing:"0.05em",
          }}>
            Poson Poya · ශ්‍රී ලංකා · Sādhu Sādhu Sādhu 🙏
          </p>
        </div>
      </div>
    </>
  );
}