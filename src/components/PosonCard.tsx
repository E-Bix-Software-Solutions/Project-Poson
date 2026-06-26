import { useState, useRef, useCallback } from 'react';

// ─── Dharma Wheel SVG ────────────────────────────────────────────────────────
const DharmaWheel = ({ size = 32, color = '#c9923a' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="2.5" fill="none" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 32 + 6 * Math.cos(rad);
      const y1 = 32 + 6 * Math.sin(rad);
      const x2 = 32 + 26 * Math.cos(rad);
      const y2 = 32 + 26 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />;
    })}
  </svg>
);

// ─── Lantern SVG ─────────────────────────────────────────────────────────────
const LanternSVG = ({ color = '#f5c26b', size = 36 }: { color?: string; size?: number }) => (
  <svg width={size} height={size * 1.55} viewBox="0 0 18 28" fill="none">
    <rect x="6" y="0" width="6" height="3" rx="1" fill={color} opacity="0.7" />
    <rect x="2" y="3" width="14" height="18" rx="5" fill={color} opacity="0.5" stroke={color} strokeWidth="1.5" />
    <ellipse cx="9" cy="12" rx="4" ry="5" fill={color} opacity="0.35" />
    <line x1="7" y1="21" x2="6" y2="28" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="9" y1="21" x2="9" y2="28" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="11" y1="21" x2="12" y2="28" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ─── Star / Sparkle ───────────────────────────────────────────────────────────
const StarDot = ({ cx, cy, r, opacity }: { cx: number; cy: number; r: number; opacity: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="#f0ede0" opacity={opacity} />
);

// ─── Card Templates ───────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'moonlit',
    label: 'Moonlit Night',
    bg: 'linear-gradient(160deg, #060d1f 0%, #0e1d3a 55%, #1a2d55 100%)',
    accent: '#f5c26b',
  },
  {
    id: 'saffron',
    label: 'Saffron Dawn',
    bg: 'linear-gradient(160deg, #1a0a00 0%, #3d1a00 50%, #6b2e00 100%)',
    accent: '#f5c26b',
  },
  {
    id: 'lotus',
    label: 'Lotus Garden',
    bg: 'linear-gradient(160deg, #0d1a18 0%, #0f2920 55%, #1a3d2e 100%)',
    accent: '#8ef5c0',
  },
];

const MESSAGES = [
  'May the light of the Dhamma guide your path.',
  'Wishing you peace, wisdom & compassion.',
  'Sādhu · Sādhu · Sādhu',
  'May merit flow to all beings.',
];

// ─── Card Preview ─────────────────────────────────────────────────────────────
const CardPreview = ({
  template,
  message,
}: {
  template: typeof TEMPLATES[0];
  message: string;
}) => {
  const stars = [
    { cx: 40, cy: 30, r: 1.2, opacity: 0.7 },
    { cx: 90, cy: 55, r: 0.8, opacity: 0.5 },
    { cx: 160, cy: 20, r: 1, opacity: 0.6 },
    { cx: 220, cy: 48, r: 1.4, opacity: 0.8 },
    { cx: 280, cy: 18, r: 0.9, opacity: 0.55 },
    { cx: 310, cy: 65, r: 1.1, opacity: 0.65 },
    { cx: 350, cy: 28, r: 0.7, opacity: 0.45 },
    { cx: 60, cy: 100, r: 0.8, opacity: 0.4 },
    { cx: 330, cy: 110, r: 1, opacity: 0.5 },
    { cx: 190, cy: 90, r: 0.6, opacity: 0.35 },
    { cx: 130, cy: 72, r: 1.2, opacity: 0.6 },
    { cx: 260, cy: 85, r: 0.9, opacity: 0.5 },
  ];

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16/9',
        maxWidth: 540,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        background: template.bg,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        border: `1px solid ${template.accent}30`,
        userSelect: 'none',
      }}
    >
      {/* Stars layer */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 380 215"
        preserveAspectRatio="xMidYMid slice"
      >
        {stars.map((s, i) => <StarDot key={i} {...s} />)}
      </svg>

      {/* Moon glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-5%',
          width: '55%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${template.accent}26 0%, ${template.accent}0a 55%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Full moon circle */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          right: '8%',
          width: '18%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: `radial-gradient(circle, #fff9e8 30%, ${template.accent}cc 75%, ${template.accent}44 100%)`,
          boxShadow: `0 0 24px 8px ${template.accent}55`,
          pointerEvents: 'none',
        }}
      />

      {/* Lanterns row */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '4%',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      >
        {(['#f5c26b', '#d4849a', '#8da1cd', '#8ef5c0'] as string[]).map((c, i) => (
          <div key={i} style={{ opacity: 0.7 + i * 0.08 }}>
            <LanternSVG color={c} size={20 + i * 3} />
          </div>
        ))}
      </div>

      {/* Buddhist flag stripe */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, display: 'flex', pointerEvents: 'none' }}>
        {['#1a4fd4', '#e6b800', '#e63c00', '#ffffff', '#e87c2a'].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(18px, 5%, 36px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, opacity: 0.75 }}>
          <DharmaWheel size={16} color={template.accent} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(7px, 1.8vw, 10px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: template.accent,
              fontWeight: 500,
            }}
          >
            Poson Poya · June Full Moon
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 900,
            fontSize: 'clamp(20px, 6vw, 42px)',
            color: template.accent,
            lineHeight: 1.05,
            marginBottom: 6,
            textShadow: `0 0 30px ${template.accent}66`,
          }}
        >
          Poson Poya
        </h2>

        <p
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(8px, 1.8vw, 11px)',
            letterSpacing: '0.15em',
            color: '#f0ede0',
            opacity: 0.55,
            marginBottom: 14,
          }}
        >
          පොසොන් පෝය &nbsp;·&nbsp; ශ්‍රී ලංකා
        </p>

        <p
          style={{
            fontFamily: 'Cinzel, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(9px, 2vw, 13px)',
            color: '#f0ede0',
            opacity: 0.85,
            lineHeight: 1.6,
            maxWidth: '70%',
          }}
        >
          "{message}"
        </p>
      </div>
    </div>
  );
};

// ─── Share Button ─────────────────────────────────────────────────────────────
const ShareBtn = ({
  icon,
  label,
  onClick,
  color,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 6,
        background: hovered ? `${color}22` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? color : 'rgba(255,255,255,0.1)'}`,
        color: hovered ? color : '#f0ede0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.04em',
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {label}
    </button>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#c9923a' }: { color?: string }) => (
  <svg
    width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ animation: 'spinFast 0.7s linear infinite' }}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeDasharray="40 20" strokeLinecap="round" />
  </svg>
);

// ─── Inline Icons ─────────────────────────────────────────────────────────────
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

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

// ─── Combination of all card variants: template × message ────────────────────
interface CardVariant {
  template: typeof TEMPLATES[0];
  message: string;
}

function buildDeck(): CardVariant[] {
  const deck: CardVariant[] = [];
  for (const template of TEMPLATES) {
    for (const message of MESSAGES) {
      deck.push({ template, message });
    }
  }
  return deck;
}

const DECK = buildDeck(); // 12 unique combinations

// ─── Main PosonCard Page ──────────────────────────────────────────────────────
export default function PosonCard({ onClose }: { onClose?: () => void }) {
  const [currentCard, setCurrentCard] = useState<CardVariant | null>(null);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const cardRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 3500);
  }, []);

  const pickRandom = useCallback((currentUsed: number[]): { variant: CardVariant; idx: number; newUsed: number[] } => {
    let pool = currentUsed;
    if (pool.length >= DECK.length) pool = [];
    const available = DECK.map((_, i) => i).filter(i => !pool.includes(i));
    const idx = available[Math.floor(Math.random() * available.length)];
    return { variant: DECK[idx], idx, newUsed: [...pool, idx] };
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const { variant, idx, newUsed } = pickRandom(usedIndices);
      setCurrentCard(variant);
      setUsedIndices(newUsed);
      setGenerated(true);
      setGenerating(false);
    }, 550);
  };

  const handleRetry = () => {
    setRetrying(true);
    setToastMsg('');
    setTimeout(() => {
      const { variant, idx, newUsed } = pickRandom(usedIndices);
      setCurrentCard(variant);
      setUsedIndices(newUsed);
      setRetrying(false);
    }, 380);
  };

  // ─── Capture card to blob via html2canvas ───
  const captureCard = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
    });
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'));
  };

  // ─── Native share (image + link) ───
  const handleNativeShare = async () => {
    if (!generated) return;
    setCapturing(true);
    try {
      const blob = await captureCard();
      if (!blob) throw new Error('Capture failed');
      const file = new File([blob], 'Poson-Greeting.png', { type: 'image/png' });
      const shareUrl = window.location.href;
      const shareText = `🪷 Poson Poya Greetings 🌕\n\n"${currentCard?.message}"\n\nLearn about Poson Poya — the sacred full moon that brought the Dhamma to Sri Lanka.`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'Poson Poya Greeting', text: shareText, url: shareUrl, files: [file] });
        setShareSuccess('Shared!');
        setTimeout(() => setShareSuccess(''), 2500);
      } else {
        // fallback: download image
        const link = document.createElement('a');
        link.download = 'Poson-Greeting.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        showToast('Card downloaded to your device!');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        showToast('Something went wrong. Please try again.', 'error');
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleWhatsApp = () => {
    if (!currentCard) return;
    const text = `🪷 *Poson Poya Greetings* 🌕\n\n"${currentCard.message}"\n\nLearn about Poson Poya — the sacred full moon that brought the Dhamma to Sri Lanka.\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleTwitter = () => {
    if (!currentCard) return;
    const text = `🌕 Poson Poya — the full moon that brought Buddhism to Sri Lanka.\n\n"${currentCard.message}"\n\n#PosonPoya #Buddhism #SriLanka`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleCopyLink = () => {
    if (!currentCard) return;
    const url = `${window.location.origin}${window.location.pathname}?card=poson&msg=${encodeURIComponent(currentCard.message)}&theme=${currentCard.template.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const cardCount = usedIndices.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinFast {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .modal-anim { animation: slideUp 0.45s cubic-bezier(.22,.68,0,1.15) both; }
        .backdrop-anim { animation: backdropIn 0.3s ease both; }
        .toast-anim { animation: fadeInUp 0.22s ease both; }
        .share-btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,146,58,0.3); border-radius: 99px; }
        .retry-btn:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.25) !important; }
        .generate-btn:hover { filter: brightness(1.08); }
        .generate-btn:active { transform: scale(0.99); }
      `}</style>

      {/* Backdrop */}
      <div
        className="backdrop-anim"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(6, 13, 31, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '24px 16px 40px',
          overflowY: 'auto',
        }}
      >
        {/* Modal */}
        <div
          className="modal-anim"
          onClick={e => e.stopPropagation()}
          style={{
            background: 'rgba(8, 16, 36, 0.97)',
            border: '1px solid rgba(201,146,58,0.25)',
            borderRadius: 16,
            width: '100%',
            maxWidth: 680,
            padding: 'clamp(24px, 4vw, 44px)',
            position: 'relative',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,146,58,0.08)',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0ede0',
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              ✕
            </button>
          )}

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ animation: 'spinSlow 18s linear infinite', display: 'flex' }}>
              <DharmaWheel size={28} color="#c9923a" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.1rem, 3vw, 1.45rem)',
                  color: '#f5c26b',
                  lineHeight: 1.1,
                  marginBottom: 3,
                }}
              >
                Poson Poya Greeting Card
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#f0ede0', opacity: 0.45, letterSpacing: '0.05em' }}>
                Generate a card · share the Dhamma's light
              </p>
            </div>
          </div>

          {/* ── Card Stage ── */}
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>

            {/* Card preview or empty state */}
            <div ref={cardRef} style={{ width: '100%', maxWidth: 540, position: 'relative' }}>
              {generated && currentCard ? (
                <div style={{ position: 'relative' }}>
                  <CardPreview template={currentCard.template} message={currentCard.message} />
                  {/* Retrying overlay */}
                  {retrying && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 12,
                        background: 'rgba(6,13,31,0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      <Spinner color="#f5c26b" />
                    </div>
                  )}
                </div>
              ) : (
                /* Empty placeholder */
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: 12,
                    border: '1px dashed rgba(201,146,58,0.25)',
                    background: 'rgba(201,146,58,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {generating ? (
                    <Spinner color="#f5c26b" />
                  ) : (
                    <>
                      <DharmaWheel size={32} color="rgba(201,146,58,0.3)" />
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(240,237,224,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Your card will appear here
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Card counter */}
            {generated && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(240,237,224,0.35)', letterSpacing: '0.08em' }}>
                Card {cardCount} · {currentCard?.template.label} · {DECK.length} combinations available
              </p>
            )}
          </div>

          {/* ── Primary actions ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {/* Generate / hidden after first press */}
            {!generated && (
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(135deg, #c9923a 0%, #f5c26b 50%, #c9923a 100%)',
                  color: '#1a0a00',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  opacity: generating ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 20px rgba(201,146,58,0.35)',
                }}
              >
                {generating ? <Spinner color="#1a0a00" /> : '✨'}
                {generating ? 'Generating…' : 'Generate your Poson card'}
              </button>
            )}

            {/* Retry + Share row — shown after generation */}
            {generated && (
              <>
                <button
                  className="retry-btn"
                  onClick={handleRetry}
                  disabled={retrying}
                  style={{
                    flex: 1,
                    padding: '13px 18px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#f0ede0',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: '0.04em',
                    cursor: retrying ? 'not-allowed' : 'pointer',
                    opacity: retrying ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      animation: retrying ? 'spinFast 0.6s linear infinite' : 'none',
                      fontSize: 16,
                    }}
                  >
                    ↺
                  </span>
                  Try another
                </button>

                <button
                  className="generate-btn"
                  onClick={handleNativeShare}
                  disabled={capturing}
                  style={{
                    flex: 1,
                    padding: '13px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #c9923a 0%, #f5c26b 50%, #c9923a 100%)',
                    color: '#1a0a00',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    cursor: capturing ? 'not-allowed' : 'pointer',
                    opacity: capturing ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.15s ease',
                    boxShadow: '0 4px 20px rgba(201,146,58,0.3)',
                  }}
                >
                  {capturing ? <Spinner color="#1a0a00" /> : '🔗'}
                  {capturing ? 'Preparing…' : 'Share card'}
                </button>
              </>
            )}
          </div>

          {/* ── Social share row ── */}
          {generated && (
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#c9923a',
                  marginBottom: 12,
                  opacity: 0.8,
                }}
              >
                Share via
              </label>
              <div className="share-btn-row">
                <ShareBtn
                  icon={<WhatsAppIcon />}
                  label="WhatsApp"
                  onClick={handleWhatsApp}
                  color="#25d366"
                />
                <ShareBtn
                  icon={<FacebookIcon />}
                  label="Facebook"
                  onClick={handleFacebook}
                  color="#1877f2"
                />
                <ShareBtn
                  icon={<TwitterIcon />}
                  label="X / Twitter"
                  onClick={handleTwitter}
                  color="#1da1f2"
                />
                <ShareBtn
                  icon={copied ? <CheckIcon /> : <LinkIcon />}
                  label={copied ? 'Copied!' : 'Copy link'}
                  onClick={handleCopyLink}
                  color={copied ? '#8ef5c0' : '#c9923a'}
                />
                {'share' in navigator && (
                  <ShareBtn
                    icon={capturing ? <Spinner color="#c9923a" /> : <ShareIcon />}
                    label={shareSuccess || 'More…'}
                    onClick={handleNativeShare}
                    color="#c9923a"
                    disabled={capturing}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Toast ── */}
          {toastMsg && (
            <div
              className="toast-anim"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 16px',
                borderRadius: 8,
                background: toastType === 'success' ? 'rgba(142,245,192,0.1)' : 'rgba(245,100,100,0.1)',
                border: `1px solid ${toastType === 'success' ? 'rgba(142,245,192,0.3)' : 'rgba(245,100,100,0.3)'}`,
                color: toastType === 'success' ? '#8ef5c0' : '#f58080',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              <span>{toastType === 'success' ? '✓' : '✕'}</span>
              {toastMsg}
            </div>
          )}

          {/* Footer note */}
          <p
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid rgba(201,146,58,0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              color: '#f0ede0',
              opacity: 0.3,
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            Poson Poya · ශ්‍රී ලංකා · Sādhu Sādhu Sādhu 🙏
          </p>
        </div>
      </div>
    </>
  );
}