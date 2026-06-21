import { useRef, useState } from 'react';

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
  recipientName,
}: {
  template: typeof TEMPLATES[0];
  message: string;
  recipientName: string;
}) => {
  // Stars scattered across the card
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
        {stars.map((s, i) => (
          <StarDot key={i} {...s} />
        ))}
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
        {['#f5c26b', '#d4849a', '#8da1cd', '#8ef5c0'].map((c, i) => (
          <div key={i} style={{ opacity: 0.7 + i * 0.08 }}>
            <LanternSVG color={c} size={20 + i * 3} />
          </div>
        ))}
      </div>

      {/* Buddhist flag stripe — thin bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          display: 'flex',
          pointerEvents: 'none',
        }}
      >
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
        {/* Wheel + label */}
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

        {/* Main title */}
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

        {/* Sinhala subtitle */}
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

        {/* Recipient */}
        {recipientName && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(8px, 1.6vw, 10px)',
              color: '#f0ede0',
              opacity: 0.6,
              marginBottom: 6,
              letterSpacing: '0.05em',
            }}
          >
            Dear {recipientName},
          </p>
        )}

        {/* Greeting message */}
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
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
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
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.04em',
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  );
};

// ─── Main PosonCard Page ──────────────────────────────────────────────────────
export default function PosonCard({ onClose }: { onClose?: () => void }) {
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [recipientName, setRecipientName] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?card=poson&msg=${encodeURIComponent(message)}&theme=${template.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const text = `🪷 *Poson Poya Greetings* 🌕\n\n"${message}"\n\nLearn about Poson Poya — the sacred full moon that brought the Dhamma to Sri Lanka.\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleTwitter = () => {
    const text = `🌕 Poson Poya — the full moon that brought Buddhism to Sri Lanka.\n\n"${message}"\n\n#PosonPoya #Buddhism #SriLanka`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Poson Poya Greetings',
        text: `"${message}" — Poson Poya · Sri Lanka`,
        url: window.location.href,
      }).then(() => {
        setShareSuccess('Shared!');
        setTimeout(() => setShareSuccess(''), 2500);
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .msg-opt:hover { border-color: rgba(245,194,107,0.6) !important; background: rgba(245,194,107,0.07) !important; }
        .tmpl-btn:hover { border-color: rgba(245,194,107,0.5) !important; }
        textarea:focus { outline: none; border-color: rgba(201,146,58,0.6) !important; }
        input:focus { outline: none; border-color: rgba(201,146,58,0.6) !important; }
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
        .modal-anim { animation: slideUp 0.45s cubic-bezier(.22,.68,0,1.15) both; }
        .backdrop-anim { animation: backdropIn 0.3s ease both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,146,58,0.3); border-radius: 99px; }
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
                Share a Poson Greeting
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#f0ede0', opacity: 0.45, letterSpacing: '0.05em' }}>
                Craft a card · share the Dhamma's light
              </p>
            </div>
          </div>

          {/* Card Preview */}
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 540 }}>
              <CardPreview template={template} message={message} recipientName={recipientName} />
            </div>
          </div>

          {/* ── Customise section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Template picker */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#c9923a',
                  marginBottom: 10,
                }}
              >
                Card Theme
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    className="tmpl-btn"
                    onClick={() => setTemplate(t)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 5,
                      border: `1.5px solid ${template.id === t.id ? t.accent : 'rgba(255,255,255,0.12)'}`,
                      background: template.id === t.id ? `${t.accent}18` : 'rgba(255,255,255,0.03)',
                      color: template.id === t.id ? t.accent : '#f0ede0',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: t.bg,
                        border: `1px solid ${t.accent}55`,
                        flexShrink: 0,
                      }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#c9923a',
                  marginBottom: 8,
                }}
              >
                Recipient's Name <span style={{ opacity: 0.45, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Nimal, Kumari…"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,146,58,0.22)',
                  borderRadius: 6,
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#f0ede0',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Message picker */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#c9923a',
                  marginBottom: 10,
                }}
              >
                Greeting Message
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {MESSAGES.map(m => (
                  <button
                    key={m}
                    className="msg-opt"
                    onClick={() => setMessage(m)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: `1px solid ${message === m ? 'rgba(245,194,107,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      background: message === m ? 'rgba(245,194,107,0.1)' : 'rgba(255,255,255,0.02)',
                      color: message === m ? '#f5c26b' : '#f0ede0',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: 'Cinzel, serif',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    "{m}"
                  </button>
                ))}
              </div>

              {/* Custom message textarea */}
              <textarea
                rows={2}
                placeholder="Or write your own message…"
                value={MESSAGES.includes(message) ? '' : message}
                onChange={e => setMessage(e.target.value || MESSAGES[0])}
                style={{
                  width: '100%',
                  resize: 'vertical',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,146,58,0.22)',
                  borderRadius: 6,
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: '#f0ede0',
                  transition: 'border-color 0.15s',
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Share buttons */}
            <div>
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
                }}
              >
                Share Via
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
                  label={copied ? 'Copied!' : 'Copy Link'}
                  onClick={handleCopyLink}
                  color={copied ? '#8ef5c0' : '#c9923a'}
                />
                {'share' in navigator && (
                  <ShareBtn
                    icon={<ShareIcon />}
                    label={shareSuccess || 'More…'}
                    onClick={handleNativeShare}
                    color="#c9923a"
                  />
                )}
              </div>
            </div>

          </div>

          {/* Footer note */}
          <p
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid rgba(201,146,58,0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              color: '#f0ede0',
              opacity: 0.35,
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