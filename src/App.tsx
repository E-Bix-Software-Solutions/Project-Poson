import { useEffect, useState } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import PosonCardShare from "./components/PosonCard";

// ─── Dharma Wheel SVG ────────────────────────────────────────────────────────
const DharmaWheel = ({
  size = 32,
  color = "#c9923a",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="2.5" fill="none" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 32 + 6 * Math.cos(rad);
      const y1 = 32 + 6 * Math.sin(rad);
      const x2 = 32 + 26 * Math.cos(rad);
      const y2 = 32 + 26 * Math.sin(rad);
      return (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="2" strokeLinecap="round"
        />
      );
    })}
  </svg>
);

// ─── Buddhist Flag Colors Bar ─────────────────────────────────────────────────
const FlagStripes = () => (
  <div style={{ display: "flex", width: "100%", height: "4px", borderRadius: "2px", overflow: "hidden" }}>
    {["#1a4fd4", "#e6b800", "#e63c00", "#ffffff", "#e87c2a"].map((c, i) => (
      <div key={i} style={{ flex: 1, background: c }} />
    ))}
  </div>
);

// ─── Lantern SVG ─────────────────────────────────────────────────────────────
const LanternIcon = ({ color = "#f5c26b" }: { color?: string }) => (
  <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
    <rect x="6" y="0" width="6" height="3" rx="1" fill={color} opacity="0.7" />
    <rect x="2" y="3" width="14" height="18" rx="5" fill={color} opacity="0.5" stroke={color} strokeWidth="1.5" />
    <ellipse cx="9" cy="12" rx="4" ry="5" fill={color} opacity="0.35" />
    <line x1="7" y1="21" x2="6" y2="28" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="9" y1="21" x2="9" y2="28" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="11" y1="21" x2="12" y2="28" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ─── Hamburger Button ─────────────────────────────────────────────────────────
const HamburgerBtn = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-label={open ? "Close menu" : "Open menu"}
    aria-expanded={open}
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
      width: 40,
      height: 40,
      background: "rgba(201,146,58,0.08)",
      border: "1px solid rgba(201,146,58,0.25)",
      borderRadius: 6,
      cursor: "pointer",
      padding: 0,
      flexShrink: 0,
      transition: "background 0.2s, border-color 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(201,146,58,0.18)";
      e.currentTarget.style.borderColor = "rgba(201,146,58,0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(201,146,58,0.08)";
      e.currentTarget.style.borderColor = "rgba(201,146,58,0.25)";
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          display: "block",
          width: 20,
          height: 1.5,
          background: "#f5c26b",
          borderRadius: 2,
          transformOrigin: "center",
          transition: "transform 0.3s cubic-bezier(.22,.68,0,1.2), opacity 0.2s",
          transform:
            open
              ? i === 0
                ? "translateY(6.5px) rotate(45deg)"
                : i === 2
                ? "translateY(-6.5px) rotate(-45deg)"
                : "scaleX(0)"
              : "none",
          opacity: open && i === 1 ? 0 : 1,
        }}
      />
    ))}
  </button>
);

// ─── Mobile Menu Overlay ──────────────────────────────────────────────────────
const MobileMenu = ({
  open,
  onClose,
  onShareCard,
}: {
  open: boolean;
  onClose: () => void;
  onShareCard: () => void;
}) => {
  const links = [
    { href: "#about", label: "About" },
    { href: "#significance", label: "Significance" },
    { href: "#observe", label: "Observe" },
  ];

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        // Glass backdrop
        background: "rgba(6, 13, 31, 0.82)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        borderBottom: "1px solid rgba(201,146,58,0.18)",
        // Slide-down reveal
        clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 0.45s cubic-bezier(.22,.68,0,1.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px 40px",
        gap: 0,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Decorative top border line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
        }}
      >
        <FlagStripes />
      </div>

      {/* Spinning wheel decoration */}
      <div
        style={{
          marginBottom: 40,
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.6)",
          transition: "opacity 0.4s 0.15s, transform 0.4s 0.15s",
          animation: "spinSlow 20s linear infinite",
        }}
      >
        <DharmaWheel size={48} color="#c9923a55" />
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", maxWidth: 320 }}>
        {links.map(({ href, label }, idx) => (
          <a
            key={href}
            href={href}
            onClick={onClose}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              padding: "16px 24px",
              fontFamily: "Cinzel",
              fontWeight: 600,
              fontSize: "1.1rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#f0ede0",
              textDecoration: "none",
              borderRadius: 6,
              border: "1px solid rgba(201,146,58,0.12)",
              background: "rgba(201,146,58,0.04)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.35s ${0.18 + idx * 0.07}s, transform 0.35s ${0.18 + idx * 0.07}s, background 0.2s, color 0.2s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,146,58,0.12)";
              e.currentTarget.style.color = "#f5c26b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(201,146,58,0.04)";
              e.currentTarget.style.color = "#f0ede0";
            }}
          >
            {label}
          </a>
        ))}

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(201,146,58,0.3), transparent)",
            margin: "12px 0",
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s 0.42s",
          }}
        />

        {/* Share card CTA */}
        <button
          onClick={() => { onClose(); onShareCard(); }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "16px 24px",
            borderRadius: 6,
            background: "rgba(212,132,154,0.1)",
            border: "1px solid rgba(212,132,154,0.4)",
            color: "#d4849a",
            fontFamily: "Cinzel",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.35s 0.39s, transform 0.35s 0.39s, background 0.2s`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,132,154,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,132,154,0.1)"; }}
        >
          <span style={{ fontSize: 16 }}>🪷</span>
          Share a Poson Card
        </button>
      </nav>

      {/* Floating lanterns at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          display: "flex",
          gap: 24,
          opacity: open ? 0.7 : 0,
          transition: "opacity 0.4s 0.5s",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="lantern-float"
            style={{ animationDelay: `${i * -1.3}s` }}
          >
            <LanternIcon color={["#f5c26b", "#d4849a", "#8da1cd"][i]} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on Escape; lock scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 300);

  if (!loaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #060d1f;
          color: #f0ede0;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #060d1f; }
        ::-webkit-scrollbar-thumb { background: #c9923a55; border-radius: 99px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes floatLantern {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px #c9923a55, 0 0 40px #c9923a22; }
          50%       { text-shadow: 0 0 30px #c9923a99, 0 0 60px #c9923a44; }
        }
        @keyframes sharePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 132, 154, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(212, 132, 154, 0); }
        }

        .fade-up { animation: fadeUp 0.9s cubic-bezier(.22,.68,0,1.2) both; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
        .delay-4 { animation-delay: 0.6s; }
        .delay-5 { animation-delay: 0.75s; }

        .glass {
          background: rgba(6, 13, 31, 0.55);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border: 1px solid rgba(201, 146, 58, 0.22);
        }

        .gold-text {
          color: #c9923a;
          animation: glow 3s ease-in-out infinite;
        }

        .nav-link {
          color: #f0ede0;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.75;
          transition: opacity 0.2s, color 0.2s;
        }
        .nav-link:hover { opacity: 1; color: #f5c26b; }

        .info-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201, 146, 58, 0.5) !important;
        }

        .section-divider {
          width: 60px; height: 2px;
          background: linear-gradient(90deg, #c9923a, transparent);
          margin: 16px auto 0;
        }

        .lantern-float { animation: floatLantern 4s ease-in-out infinite; }
        .lantern-float:nth-child(2) { animation-delay: -1.3s; }
        .lantern-float:nth-child(3) { animation-delay: -2.6s; }

        .share-card-btn {
          animation: sharePulse 2.5s ease-in-out 1.5s 3;
        }

        /* ── Desktop nav items ── */
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }

        /* ── Responsive breakpoints ── */
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .hero-title { font-size: clamp(2rem, 10vw, 3.5rem) !important; }
          .info-grid { grid-template-columns: 1fr !important; }
          .hero-cta-row { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta-row a, .hero-cta-row button { justify-content: center !important; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: clamp(1.75rem, 9vw, 3rem) !important; }
        }
      `}</style>

      {/* ── Fixed 3D Canvas ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <ThreeCanvas />
      </div>

      {/* ── Share Card Modal ── */}
      {showShareCard && (
        <PosonCardShare onClose={() => setShowShareCard(false)} />
      )}

      {/* ── Mobile Menu Overlay ── */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onShareCard={() => setShowShareCard(true)}
      />

      {/* ── Scrollable Content ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── NAV ── */}
        <nav
          className="glass"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "1px solid rgba(201,146,58,0.18)",
            transition: "background 0.4s",
          }}
        >
          {/* ── Logo / Brand ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ animation: "spinSlow 20s linear infinite", display: "flex" }}>
              <DharmaWheel size={26} color="#c9923a" />
            </div>
            <span
              style={{
                fontFamily: "Cinzel",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#f5c26b",
              }}
            >
              Poson Poya
            </span>
          </div>

          {/* ── Desktop nav links ── */}
          <div className="nav-desktop" style={{ gap: 36 }}>
            <a href="#about" className="nav-link">About</a>
            <a href="#significance" className="nav-link">Significance</a>
            <a href="#observe" className="nav-link">Observe</a>
          </div>

          {/* ── Desktop right actions ── */}
          <div className="nav-desktop" style={{ gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setShowShareCard(true)}
              style={{
                background: "rgba(212,132,154,0.12)",
                border: "1px solid rgba(212,132,154,0.3)",
                borderRadius: 99,
                color: "#d4849a",
                fontFamily: "Cinzel",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,132,154,0.2)";
                e.currentTarget.style.borderColor = "rgba(212,132,154,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212,132,154,0.12)";
                e.currentTarget.style.borderColor = "rgba(212,132,154,0.3)";
              }}
            >
              🪷 Share Card
            </button>

            {[0, 1, 2].map((i) => (
              <div key={i} className="lantern-float" style={{ display: "flex", animationDelay: `${i * -1.3}s` }}>
                <LanternIcon color={["#f5c26b", "#d4849a", "#8da1cd"][i]} />
              </div>
            ))}
          </div>

          {/* ── Mobile right: lantern + hamburger ── */}
          <div className="nav-hamburger" style={{ alignItems: "center", gap: 12 }}>
            <div className="lantern-float" style={{ display: "flex" }}>
              <LanternIcon color="#f5c26b" />
            </div>
            <HamburgerBtn
              open={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            />
          </div>
        </nav>

        {/* ── HERO ── */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "80px 24px 40px",
            opacity: heroOpacity,
            transition: "opacity 0.1s linear",
          }}
        >
          {/* Eyebrow */}
          <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, transparent, #c9923a)" }} />
            <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f5c26b", opacity: 0.85 }}>
              June Full Moon · 2026
            </span>
            <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, #c9923a, transparent)" }} />
          </div>

          {/* Main Title */}
          <h1
            className="hero-title fade-up delay-1 gold-text"
            style={{
              fontFamily: "Cinzel",
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow: "0 0 6px #c9923a55",
              color: "#f5c26b",
              marginBottom: 8,
            }}
          >
            Poson Poya
          </h1>

          {/* Sinhala / Pali subtitle */}
          <p
            className="fade-up delay-2"
            style={{
              fontFamily: "Cinzel",
              fontWeight: 400,
              fontSize: "clamp(0.95rem, 2.5vw, 1.35rem)",
              letterSpacing: "0.18em",
              color: "#f0ede0",
              opacity: 0.6,
              marginBottom: 28,
            }}
          >
            පොසොන් පෝය &nbsp;·&nbsp; ධර්මය ශ්‍රී ලංකාවට පැමිණේ
          </p>

          {/* Buddhist flag stripe */}
          <div className="fade-up delay-2" style={{ width: 220, marginBottom: 32 }}>
            <FlagStripes />
          </div>

          {/* Description */}
          <p
            className="fade-up delay-3"
            style={{
              maxWidth: 540,
              lineHeight: 1.75,
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              color: "#f0ede0",
              opacity: 0.72,
              marginBottom: 44,
            }}
          >
            The second most sacred full moon in the Buddhist calendar —
            commemorating the arrival of the Dhamma in Sri Lanka through the
            Arahant Mahinda at the sacred rock of Mihintale.
          </p>

          {/* CTA row */}
          <div
            className="fade-up delay-4 hero-cta-row"
            style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
          >
            <a
              href="#about"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 3,
                background: "linear-gradient(135deg, #c9923a, #f5c26b)",
                color: "#060d1f", fontFamily: "Cinzel", fontWeight: 700,
                fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(201,146,58,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(201,146,58,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(201,146,58,0.35)";
              }}
            >
              Explore the Festival
            </a>

            <a
              href="#observe"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 3,
                background: "transparent", color: "#f5c26b",
                fontFamily: "Cinzel", fontWeight: 600, fontSize: 13,
                letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid rgba(245,194,107,0.4)",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#f5c26b";
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,194,107,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,194,107,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              How to Observe
            </a>

            <button
              className="share-card-btn"
              onClick={() => setShowShareCard(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "13px 28px", borderRadius: 3,
                background: "rgba(212,132,154,0.1)", color: "#d4849a",
                fontFamily: "Cinzel", fontWeight: 700, fontSize: 13,
                letterSpacing: "0.1em", textTransform: "uppercase",
                border: "1px solid rgba(212,132,154,0.45)",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,132,154,0.18)";
                e.currentTarget.style.borderColor = "rgba(212,132,154,0.75)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(212,132,154,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212,132,154,0.1)";
                e.currentTarget.style.borderColor = "rgba(212,132,154,0.45)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span style={{ fontSize: 15 }}>🪷</span>
              Share a Poson Card
            </button>
          </div>

          {/* Scroll hint */}
          <div
            style={{
              position: "absolute", bottom: 32, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              animation: "shimmer 2s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4, color: "#f0ede0" }}>
              Scroll
            </span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, rgba(201,146,58,0.6) 0%, transparent 100%)" }} />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ padding: "100px 24px", display: "flex", justifyContent: "center" }}>
          <div className="glass" style={{ maxWidth: 860, width: "100%", borderRadius: 8, padding: "clamp(32px, 5vw, 60px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <DharmaWheel size={22} color="#c9923a" />
              <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9923a" }}>
                Sacred History
              </span>
            </div>

            <h2 style={{ fontFamily: "Cinzel", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#f5c26b", marginBottom: 20, lineHeight: 1.2 }}>
              The Arrival of the Dhamma
            </h2>

            <p style={{ lineHeight: 1.85, opacity: 0.78, fontSize: "1.02rem", marginBottom: 20 }}>
              In the 3rd century BCE, the Arahant Mahinda — son of Emperor Ashoka — descended upon the sacred hill of{" "}
              <strong style={{ color: "#f5c26b" }}>Mihintale</strong> and met King Devanampiya Tissa on the first full moon of the month of Poson. That meeting marked the moment Buddhism was established in Sri Lanka, transforming the island nation into the jewel of Theravāda Buddhism.
            </p>

            <p style={{ lineHeight: 1.85, opacity: 0.78, fontSize: "1.02rem", marginBottom: 32 }}>
              Today, Poson Poya is observed island-wide with <em>dansals</em> (food almsgivings), white-clad pilgrims climbing Mihintale by moonlight, sil observances, and the iconic multi-colored <em>atapattam</em> lanterns that illuminate the night sky.
            </p>

            <FlagStripes />

            <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 36 }}>
              {[
                { num: "236 BCE", label: "Year of Mahinda's arrival" },
                { num: "1818", label: "Steps to Mihintale summit" },
                { num: "2500+", label: "Years of Theravāda tradition" },
              ].map(({ num, label }) => (
                <div key={num} className="glass info-card" style={{ borderRadius: 6, padding: "24px 20px", textAlign: "center", border: "1px solid rgba(201,146,58,0.2)" }}>
                  <div style={{ fontFamily: "Cinzel", fontWeight: 700, fontSize: "clamp(1.2rem, 3vw, 1.7rem)", color: "#f5c26b", marginBottom: 8 }}>
                    {num}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: "0.05em", lineHeight: 1.4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SIGNIFICANCE ── */}
        <section id="significance" style={{ padding: "60px 24px 100px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: 860, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9923a", display: "block", marginBottom: 12 }}>
                The Five Buddhist Flag Colors
              </span>
              <h2 style={{ fontFamily: "Cinzel", fontWeight: 700, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: "#f5c26b", lineHeight: 1.2 }}>
                Symbols of the Poya
              </h2>
              <div className="section-divider" />
            </div>

            <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {[
                { color: "#1a4fd4", icon: "☸️", title: "Nīla — Blue", desc: "The compassionate, loving kindness in the Buddha's aura, representing the purity of the Dhamma." },
                { color: "#e6b800", icon: "🌕", title: "Pīta — Gold", desc: "The middle path free of extremes — the golden hue of the full Poya moon blessing Sri Lanka." },
                { color: "#e63c00", icon: "🔥", title: "Lohita — Red", desc: "The blessing of achievement, wisdom, virtue and fortune on the sacred Poson night." },
                { color: "#d4849a", icon: "🪷", title: "Odāta — White", desc: "The purity of the Dhamma — devotees don white on Poya day in observance and reverence." },
                { color: "#e87c2a", icon: "🏮", title: "Mañjeṭṭha — Saffron", desc: "The essence of these colors combined, representing the all-encompassing radiance of the Buddha." },
              ].map(({ color, icon, title, desc }) => (
                <div key={title} className="glass info-card" style={{ borderRadius: 8, padding: "28px 24px", border: `1px solid ${color}30`, borderTop: `3px solid ${color}` }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <h3 style={{ fontFamily: "Cinzel", fontWeight: 600, fontSize: "1rem", color, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.75, opacity: 0.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OBSERVE ── */}
        <section id="observe" style={{ padding: "60px 24px 120px", display: "flex", justifyContent: "center" }}>
          <div className="glass" style={{ maxWidth: 860, width: "100%", borderRadius: 8, padding: "clamp(32px, 5vw, 60px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <DharmaWheel size={22} color="#c9923a" />
              <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9923a" }}>
                Sacred Observances
              </span>
            </div>

            <h2 style={{ fontFamily: "Cinzel", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#f5c26b", marginBottom: 40, lineHeight: 1.2 }}>
              How Poson is Observed
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { time: "Dawn", act: "Sil Observance", desc: "Devotees take eight precepts (Attha Sila) at their local temple, dedicating the full moon day to meditation, chanting and Dhamma study.", color: "#8da1cd" },
                { time: "Day", act: "Dansal & Almsgiving", desc: "Temporary pavilions line streets across the country, offering free food, drinks and merit to all passersby — an act of collective dāna.", color: "#f5c26b" },
                { time: "Dusk", act: "Atapattam Lanterns", desc: "Families light and hang the iconic octagonal paper lanterns in Buddhist flag colors, their amber glow painting every street and garden.", color: "#c9923a" },
                { time: "Night", act: "Pilgrimage to Mihintale", desc: "Tens of thousands of white-clad pilgrims ascend the 1818 granite steps of Mihintale by moonlight, reenacting Mahinda's sacred descent.", color: "#d4849a" },
              ].map(({ time, act, desc, color }, i) => (
                <div key={act} style={{ display: "flex", gap: 24, paddingBottom: i < 3 ? 28 : 0, borderBottom: i < 3 ? "1px solid rgba(201,146,58,0.12)" : "none" }}>
                  <div style={{ flexShrink: 0, paddingTop: 2 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${color}18`, border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "Cinzel", fontSize: 9, fontWeight: 700, color, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.3 }}>
                        {time}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Cinzel", fontWeight: 600, fontSize: "1.05rem", color, marginBottom: 8 }}>{act}</h3>
                    <p style={{ lineHeight: 1.8, opacity: 0.75, fontSize: "0.92rem" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share nudge */}
            <div style={{ marginTop: 48, padding: "20px 24px", background: "rgba(212,132,154,0.06)", border: "1px solid rgba(212,132,154,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontFamily: "Cinzel", fontSize: 14, color: "#d4849a", marginBottom: 4 }}>Spread the Dhamma 🪷</p>
                <p style={{ fontSize: 12, opacity: 0.6, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                  Send a blessed Poson greeting card to your family and friends.
                </p>
              </div>
              <button
                onClick={() => setShowShareCard(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 4,
                  background: "rgba(212,132,154,0.14)", color: "#d4849a",
                  fontFamily: "Cinzel", fontWeight: 700, fontSize: 12,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  border: "1px solid rgba(212,132,154,0.4)",
                  cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(212,132,154,0.22)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(212,132,154,0.14)";
                  e.currentTarget.style.transform = "";
                }}
              >
                Share a Card
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="glass"
          style={{
            padding: "28px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "none", borderLeft: "none", borderRight: "none",
            flexWrap: "wrap", gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <DharmaWheel size={18} color="#c9923a88" />
            <span style={{ fontFamily: "Cinzel", fontSize: 12, color: "#f5c26b", opacity: 0.6 }}>
              Poson Poya · Sādhu Sādhu Sādhu
            </span>
          </div>
          <FlagStripes />
          <span style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.05em" }}>ශ්‍රී ලංකා · Sri Lanka</span>
        </footer>
      </div>
    </>
  );
}