import { createContext, useContext, useEffect, useState } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import PosonCardShare from "./components/PosonCard";

// ─── Language Types & Translations ───────────────────────────────────────────
type Lang = "en" | "si";

const translations = {
  en: {
    // Nav
    navBrand: "Poson Poya",
    navAbout: "About",
    navSignificance: "Significance",
    navObserve: "Observe",
    navShareCard: "Share Card",
    navShareCardFull: "Share a Poson Card",

    // Hero
    heroTitle: "May You Be Blessed This Poson Poya!",
    heroSubtitle: "Poson Poya Day! Keep it glowing 🙏",
    heroScrollHint: "Scroll Down",

    // About section
    aboutLabel: "Sacred History",
    aboutTitle: "The Arrival of the Dhamma",
    aboutP1: (
      <>
        In the 3rd century BCE, the Arahant Mahinda — son of Emperor Ashoka — descended upon the sacred hill of{" "}
        <strong style={{ color: "#f5c26b" }}>Mihintale</strong> and met King Devanampiya Tissa on the first full moon of the month of Poson. That meeting marked the moment Buddhism was established in Sri Lanka, transforming the island nation into the jewel of Theravāda Buddhism.
      </>
    ),
    aboutP2: (
      <>
        Today, Poson Poya is observed island-wide with <em>dansals</em> (food almsgivings), white-clad pilgrims climbing Mihintale by moonlight, sil observances, and the iconic multi-colored <em>atapattam</em> lanterns that illuminate the night sky.
      </>
    ),
    stat1Num: "236 BCE",
    stat1Label: "Year of Mahinda's arrival",
    stat2Num: "1818",
    stat2Label: "Steps to Mihintale summit",
    stat3Num: "2500+",
    stat3Label: "Years of Theravāda tradition",

    // Significance section
    sigLabel: "The Five Buddhist Flag Colors",
    sigTitle: "Symbols of the Poya",
    sig: [
      { color: "#1a4fd4", icon: "☸️", title: "Nīla — Blue", desc: "The compassionate, loving kindness in the Buddha's aura, representing the purity of the Dhamma." },
      { color: "#e6b800", icon: "🌕", title: "Pīta — Gold", desc: "The middle path free of extremes — the golden hue of the full Poya moon blessing Sri Lanka." },
      { color: "#e63c00", icon: "🔥", title: "Lohita — Red", desc: "The blessing of achievement, wisdom, virtue and fortune on the sacred Poson night." },
      { color: "#d4849a", icon: "🪷", title: "Odāta — White", desc: "The purity of the Dhamma — devotees don white on Poya day in observance and reverence." },
      { color: "#e87c2a", icon: "🏮", title: "Mañjeṭṭha — Saffron", desc: "The essence of these colors combined, representing the all-encompassing radiance of the Buddha." },
    ],

    // Observe section
    obsLabel: "Sacred Observances",
    obsTitle: "How Poson is Observed",
    obs: [
      { time: "Dawn", act: "Sil Observance", desc: "Devotees take eight precepts (Attha Sila) at their local temple, dedicating the full moon day to meditation, chanting and Dhamma study.", color: "#8da1cd" },
      { time: "Day", act: "Dansal & Almsgiving", desc: "Temporary pavilions line streets across the country, offering free food, drinks and merit to all passersby — an act of collective dāna.", color: "#f5c26b" },
      { time: "Dusk", act: "Atapattam Lanterns", desc: "Families light and hang the iconic octagonal paper lanterns in Buddhist flag colors, their amber glow painting every street and garden.", color: "#c9923a" },
      { time: "Night", act: "Pilgrimage to Mihintale", desc: "Tens of thousands of white-clad pilgrims ascend the 1818 granite steps of Mihintale by moonlight, reenacting Mahinda's sacred descent.", color: "#d4849a" },
    ],
    obsShareTitle: "Spread the Dhamma 🪷",
    obsShareDesc: "Send a blessed Poson greeting card to your family and friends.",
    obsShareBtn: "Share a Card",

    // Footer
    footerRegion: "ශ්‍රී ලංකා · Sri Lanka",
  },

  si: {
    // Nav
    navBrand: "පොසොන් පොහොය",
    navAbout: "ඉතිහාසය",
    navSignificance: "වැදගත්කම",
    navObserve: "පිළිවෙත්",
    navShareCard: "කාඩ්පතක් යවන්න",
    navShareCardFull: "පොසොන් ආශිර්වාද කාඩ්පතක් යවන්න",

    // Hero
    heroTitle: "පින්බර පොසොන් මංගල්‍යයක් වේවා!",
    heroSubtitle: "පොසොන් පොහොය දිනය! ආලෝකය රකිමු 🙏",
    heroScrollHint: "පහතට අනුරූ කරන්න",

    // About section
    aboutLabel: "ශ්‍රී ලංකා ධර්ම ඉතිහාසය",
    aboutTitle: "ධර්මය ලංකාවට පැමිණීම",
    aboutP1: (
      <>
        ක්‍රි.පූ. 3 වන සියවසේදී, සම්‍රාට් අශෝකගේ පුත් අරහත් මිහිඳු මහ රහතන් වහන්සේ{" "}
        <strong style={{ color: "#f5c26b" }}>මිහිඳු මලා</strong> ශුද්ධ ගිරිය මත ප්‍රථම පොහොය දිනයේ රජ දේවානම්පිය තිස්ස රජතුමා හමු වූහ. එම හමුවීම ශ්‍රී ලංකාවේ බෞද්ධ ශ්‍රාසනය ස්ථාපිත වූ ශ්‍රේෂ්ඨ මොහොත ලෙස ඉතිහාසයේ සටහන් ය.
      </>
    ),
    aboutP2: (
      <>
        අද, ලංකා දිවයින පුරා <em>දාන සාල්</em>, සිල් ගෙවීම, සුදු ඇදුම් ලාල්ලෝ මිහිඳු ගලේ නැඟීම, සහ <em>අෂ්ටාපතම්</em> ලාම්පු දල්වා පොසොන් පොහොය සමරන්නෝ ය.
      </>
    ),
    stat1Num: "ක්‍රි.පූ. 236",
    stat1Label: "මිහිඳු රහතන් ලංකාවට වැඩිය වර්ෂය",
    stat2Num: "1818",
    stat2Label: "මිහිඳු ගල මුදුනේ පියමං ගණන",
    stat3Num: "2500+",
    stat3Label: "ථේරවාද බෞද්ධ සම්ප්‍රදායේ වයස",

    // Significance section
    sigLabel: "බෞද්ධ කොඩියේ වර්ණ පහ",
    sigTitle: "පොහොයේ සංකේත",
    sig: [
      { color: "#1a4fd4", icon: "☸️", title: "නීල — නිල්", desc: "බුද්ධ රශ්මිය නියෝජනය කරන කරුණා, මෛත්‍රී, ධර්ම ශුද්ධතාවය." },
      { color: "#e6b800", icon: "🌕", title: "පීත — රන්", desc: "ශ්‍රේෂ්ඨ මධ්‍යම ප්‍රතිපදාව — ශ්‍රී ලංකාව ආශිර්වාද කරන පොහොය සඳ රන් දීප්තිය." },
      { color: "#e63c00", icon: "🔥", title: "ලෝහිත — රතු", desc: "ශ්‍රේෂ්ඨ පොසොන් රාත්‍රියේ ගුණ, ප්‍රඥා, ශ්‍රේෂ්ඨ ජය." },
      { color: "#d4849a", icon: "🪷", title: "ඔදාත — සුදු", desc: "ධර්ම ශුද්ධතාවය — පොහොය දිනයේ දෙව් ජනයා සුදු ඇදුම් ඇඳ ගෙවීම් කරයි." },
      { color: "#e87c2a", icon: "🏮", title: "මඤ්ජෙෂ්ඨ — කහ", desc: "ඉහත වර්ණ සියල්ලෙහි සාරය — බුදු රජාණන්ගේ සර්වබලගතු ශ්‍රේෂ්ඨ ආලෝකය." },
    ],

    // Observe section
    obsLabel: "ශුද්ධ ආගමික ක්‍රියාමාර්ග",
    obsTitle: "පොසොන් ගෙවීම",
    obs: [
      { time: "උදෑසන", act: "සිල් ගෙවීම", desc: "දෙව් ජනයා ඔවුන්ගේ දේවාලයේ දී අෂ්ට සිල් ගෙන, සමාධිය, ගාථා කීම, ධර්ම අධ්‍යයනය සඳහා දවස කැප කරයි.", color: "#8da1cd" },
      { time: "දහවල්", act: "දාන සාල් හා ආහාර දීම", desc: "රටපුරා ජනතාවට නොමිලේ ආහාරපාන, ජලය, හා කුසල් ලබා දෙමින් ජනයා ගොනු කරන 'දාන' ශාලා පිහිටු වෙයි.", color: "#f5c26b" },
      { time: "සඳාව", act: "අෂ්ටාපතම් ලාම්පු", desc: "පවුල් බෞද්ධ කොඩි වර්ණ ලාම්පු දල්වා, ඒවා ඇසිරූ ලෙස රාත්‍රිය ආලෝකමත් කරයි.", color: "#c9923a" },
      { time: "රාත්‍රිය", act: "මිහිඳු ගල වැඳීම", desc: "දස දහස් ගණනක් සුදු ඇදුම් ගිය ජනතාව සඳ ආලෝකයෙන් මිහිඳු ගල නගා, රහතන් වහන්සේගේ ලංකාගමනය නැවත ස්ඵරණය කරති.", color: "#d4849a" },
    ],
    obsShareTitle: "ධර්මය බෙදා ගන්න 🪷",
    obsShareDesc: "ඔබේ පවුලට හා මිතුරන්ට ආශිර්වාද පොසොන් කාඩ්පතක් යවන්න.",
    obsShareBtn: "කාඩ්පතක් යවන්න",

    // Footer
    footerRegion: "ශ්‍රී ලංකා · Sri Lanka",
  },
} as const;

// ─── Language Context ─────────────────────────────────────────────────────────
const LangContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: typeof translations.si;
}>({
  lang: "si",
  toggle: () => {},
  t: translations.si,
});

const useLang = () => useContext(LangContext);

// ─── Language Toggle Button ───────────────────────────────────────────────────
const LangToggle = ({ compact = false }: { compact?: boolean }) => {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      title={lang === "en" ? "Switch to Sinhala" : "ඉංග්‍රීසි භාෂාවට මාරු වන්න"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: compact ? "5px 10px" : "6px 14px",
        borderRadius: 99,
        background: "rgba(141,161,205,0.12)",
        border: "1px solid rgba(141,161,205,0.35)",
        color: "#8da1cd",
        fontFamily: lang === "si" ? "'Noto Serif Sinhala', serif" : "Cinzel",
        fontSize: compact ? 11 : 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(141,161,205,0.22)";
        e.currentTarget.style.borderColor = "rgba(141,161,205,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(141,161,205,0.12)";
        e.currentTarget.style.borderColor = "rgba(141,161,205,0.35)";
      }}
    >
      <span style={{ fontSize: 13 }}>{lang === "en" ? "LK" : "UK"}</span>
      {lang === "en" ? "සිංහල" : "English"}
    </button>
  );
};

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
  const { t, lang } = useLang();
  const links = [
    { href: "#about", label: t.navAbout },
    { href: "#significance", label: t.navSignificance },
    { href: "#observe", label: t.navObserve },
  ];

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        background: "rgba(6, 13, 31, 0.82)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        borderBottom: "1px solid rgba(201,146,58,0.18)",
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
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px" }}>
        <FlagStripes />
      </div>

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
              fontFamily: lang === "si" ? "'Noto Serif Sinhala', serif" : "Cinzel",
              fontWeight: 600,
              fontSize: "1.1rem",
              letterSpacing: lang === "si" ? "0.05em" : "0.15em",
              textTransform: lang === "si" ? "none" : "uppercase",
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

        {/* Language toggle in mobile menu */}
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.35s 0.36s, transform 0.35s 0.36s",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LangToggle compact />
        </div>

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
            fontFamily: lang === "si" ? "'Noto Serif Sinhala', serif" : "Cinzel",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: lang === "si" ? "0.02em" : "0.12em",
            textTransform: lang === "si" ? "none" : "uppercase",
            cursor: "pointer",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.35s 0.45s, transform 0.35s 0.45s, background 0.2s`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,132,154,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,132,154,0.1)"; }}
        >
          <span style={{ fontSize: 16 }}>🪷</span>
          {t.navShareCardFull}
        </button>
      </nav>

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
          <div key={i} className="lantern-float" style={{ animationDelay: `${i * -1.3}s` }}>
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
  const [lang, setLang] = useState<Lang>("en");

  const toggle = () => setLang((l) => (l === "en" ? "si" : "en"));
  const t = translations[lang];

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
    const timer = setTimeout(() => setLoaded(true), 300);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Font family helpers
  const sinhalaFont = "'Noto Serif Sinhala', serif";
  const headingFont = lang === "si" ? sinhalaFont : "Cinzel";
  const labelFont = lang === "si" ? sinhalaFont : "Inter";
  const heroFont = lang === "si" ? sinhalaFont : "Cinzel";

  const heroOpacity = Math.max(0, 1 - scrollY / 300);

  if (!loaded) return <h1>Loading...</h1>;

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500&family=Noto+Serif+Sinhala:wght@400;700;900&display=swap');

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
          @keyframes langSwitch {
            0%   { opacity: 0; transform: translateY(6px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .fade-up { animation: fadeUp 0.9s cubic-bezier(.22,.68,0,1.2) both; }
          .delay-1 { animation-delay: 0.15s; }
          .delay-2 { animation-delay: 0.3s; }
          .delay-3 { animation-delay: 0.45s; }
          .delay-4 { animation-delay: 0.6s; }
          .delay-5 { animation-delay: 0.75s; }

          .lang-switch { animation: langSwitch 0.3s ease both; }

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

          .nav-link-si {
            color: #f0ede0;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Noto Serif Sinhala', serif;
            opacity: 0.75;
            transition: opacity 0.2s, color 0.2s;
          }
          .nav-link-si:hover { opacity: 1; color: #f5c26b; }

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

          .share-card-btn { animation: sharePulse 2.5s ease-in-out 1.5s 3; }

          .nav-desktop { display: flex; }
          .nav-hamburger { display: none; }

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
        {showShareCard && <PosonCardShare onClose={() => setShowShareCard(false)} />}

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
              top: 0, left: 0, right: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 24px",
              borderTop: "none", borderLeft: "none", borderRight: "none",
              borderBottom: "1px solid rgba(201,146,58,0.18)",
              transition: "background 0.4s",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ animation: "spinSlow 20s linear infinite", display: "flex" }}>
                <DharmaWheel size={26} color="#c9923a" />
              </div>
              <span
                style={{
                  fontFamily: headingFont,
                  fontSize: lang === "si" ? 15 : 14,
                  fontWeight: 700,
                  letterSpacing: lang === "si" ? "0.02em" : "0.1em",
                  color: "#f5c26b",
                }}
                key={lang}
                className="lang-switch"
              >
                {t.navBrand}
              </span>
            </div>

            {/* Desktop nav links */}
            <div className="nav-desktop" style={{ gap: 36 }}>
              {[
                { href: "#about", label: t.navAbout },
                { href: "#significance", label: t.navSignificance },
                { href: "#observe", label: t.navObserve },
              ].map(({ href, label }) => (
                <a key={href} href={href} className={lang === "si" ? "nav-link-si" : "nav-link"}>
                  {label}
                </a>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="nav-desktop" style={{ gap: 8, alignItems: "center" }}>
              {/* Language toggle */}
              <LangToggle />

              <button
                onClick={() => setShowShareCard(true)}
                style={{
                  background: "rgba(212,132,154,0.12)",
                  border: "1px solid rgba(212,132,154,0.3)",
                  borderRadius: 99,
                  color: "#d4849a",
                  fontFamily: headingFont,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: lang === "si" ? "0.02em" : "0.12em",
                  textTransform: lang === "si" ? "none" : "uppercase",
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
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
                🪷 {t.navShareCard}
              </button>

              {[0, 1, 2].map((i) => (
                <div key={i} className="lantern-float" style={{ display: "flex", animationDelay: `${i * -1.3}s` }}>
                  <LanternIcon color={["#f5c26b", "#d4849a", "#8da1cd"][i]} />
                </div>
              ))}
            </div>

            {/* Mobile right: lantern + hamburger */}
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
              transition: "opacity 0.25s ease-out",
              pointerEvents: "none",
            }}
          >
            <h1
              key={`hero-${lang}`}
              className="hero-title fade-up gold-text lang-switch"
              style={{
                fontFamily: heroFont,
                fontWeight: 900,
                fontSize: lang === "si"
                  ? "clamp(2rem, 5.5vw, 4.2rem)"
                  : "clamp(2.2rem, 6vw, 4.8rem)",
                lineHeight: 1.35,
                letterSpacing: lang === "si" ? "0.01em" : "0.02em",
                textShadow: "0 0 15px rgba(245, 194, 107, 0.65), 0 0 30px rgba(245, 194, 107, 0.25)",
                color: "#f5c26b",
                marginBottom: 16,
                maxWidth: "960px",
                pointerEvents: "auto",
              }}
            >
              {t.heroTitle}
            </h1>

            <p
              key={`hero-sub-${lang}`}
              className="fade-up delay-1 lang-switch"
              style={{
                fontFamily: lang === "si" ? sinhalaFont : "'Inter', sans-serif",
                fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
                letterSpacing: lang === "si" ? "0.05em" : "0.25em",
                textTransform: lang === "si" ? "none" : "uppercase",
                color: "#f0ede0",
                opacity: 0.85,
                marginBottom: 40,
                pointerEvents: "auto",
              }}
            >
              {t.heroSubtitle}
            </p>

            <div
              style={{
                position: "absolute",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                animation: "shimmer 2s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.5, color: "#f0ede0" }}>
                {t.heroScrollHint}
              </span>
              <div style={{ width: 1, height: 50, background: "linear-gradient(180deg, #f5c26b 0%, transparent 100%)" }} />
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section id="about" style={{ padding: "100px 24px", display: "flex", justifyContent: "center" }}>
            <div className="glass" style={{ maxWidth: 860, width: "100%", borderRadius: 8, padding: "clamp(32px, 5vw, 60px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <DharmaWheel size={22} color="#c9923a" />
                <span
                  key={`about-label-${lang}`}
                  className="lang-switch"
                  style={{ fontFamily: labelFont, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9923a" }}
                >
                  {t.aboutLabel}
                </span>
              </div>

              <h2
                key={`about-title-${lang}`}
                className="lang-switch"
                style={{ fontFamily: headingFont, fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#f5c26b", marginBottom: 20, lineHeight: 1.35 }}
              >
                {t.aboutTitle}
              </h2>

              <p key={`about-p1-${lang}`} className="lang-switch" style={{ fontFamily: lang === "si" ? sinhalaFont : "inherit", lineHeight: 1.85, opacity: 0.78, fontSize: "1.02rem", marginBottom: 20 }}>
                {t.aboutP1}
              </p>

              <p key={`about-p2-${lang}`} className="lang-switch" style={{ fontFamily: lang === "si" ? sinhalaFont : "inherit", lineHeight: 1.85, opacity: 0.78, fontSize: "1.02rem", marginBottom: 32 }}>
                {t.aboutP2}
              </p>

              <FlagStripes />

              <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 36 }}>
                {[
                  { num: t.stat1Num, label: t.stat1Label },
                  { num: t.stat2Num, label: t.stat2Label },
                  { num: t.stat3Num, label: t.stat3Label },
                ].map(({ num, label }) => (
                  <div key={num} className="glass info-card" style={{ borderRadius: 6, padding: "24px 20px", textAlign: "center", border: "1px solid rgba(201,146,58,0.2)" }}>
                    <div
                      key={`stat-num-${lang}-${num}`}
                      className="lang-switch"
                      style={{ fontFamily: headingFont, fontWeight: 700, fontSize: "clamp(1rem, 3vw, 1.5rem)", color: "#f5c26b", marginBottom: 8 }}
                    >
                      {num}
                    </div>
                    <div
                      key={`stat-label-${lang}-${num}`}
                      className="lang-switch"
                      style={{ fontFamily: lang === "si" ? sinhalaFont : "inherit", fontSize: 12, opacity: 0.6, letterSpacing: "0.05em", lineHeight: 1.4 }}
                    >
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
                <span
                  key={`sig-label-${lang}`}
                  className="lang-switch"
                  style={{ fontFamily: labelFont, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9923a", display: "block", marginBottom: 12 }}
                >
                  {t.sigLabel}
                </span>
                <h2
                  key={`sig-title-${lang}`}
                  className="lang-switch"
                  style={{ fontFamily: headingFont, fontWeight: 700, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: "#f5c26b", lineHeight: 1.2 }}
                >
                  {t.sigTitle}
                </h2>
                <div className="section-divider" />
              </div>

              <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                {t.sig.map(({ color, icon, title, desc }) => (
                  <div key={title} className="glass info-card" style={{ borderRadius: 8, padding: "28px 24px", border: `1px solid ${color}30`, borderTop: `3px solid ${color}` }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                    <h3
                      key={`sig-card-title-${lang}-${title}`}
                      className="lang-switch"
                      style={{ fontFamily: headingFont, fontWeight: 600, fontSize: "1rem", color, marginBottom: 10 }}
                    >
                      {title}
                    </h3>
                    <p
                      key={`sig-card-desc-${lang}-${title}`}
                      className="lang-switch"
                      style={{ fontFamily: lang === "si" ? sinhalaFont : "inherit", fontSize: "0.875rem", lineHeight: 1.75, opacity: 0.7 }}
                    >
                      {desc}
                    </p>
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
                <span
                  key={`obs-label-${lang}`}
                  className="lang-switch"
                  style={{ fontFamily: labelFont, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9923a" }}
                >
                  {t.obsLabel}
                </span>
              </div>

              <h2
                key={`obs-title-${lang}`}
                className="lang-switch"
                style={{ fontFamily: headingFont, fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#f5c26b", marginBottom: 40, lineHeight: 1.2 }}
              >
                {t.obsTitle}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {t.obs.map(({ time, act, desc, color }, i) => (
                  <div key={act} style={{ display: "flex", gap: 24, paddingBottom: i < 3 ? 28 : 0, borderBottom: i < 3 ? "1px solid rgba(201,146,58,0.12)" : "none" }}>
                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: `${color}18`, border: `1.5px solid ${color}55`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span
                          key={`obs-time-${lang}-${act}`}
                          className="lang-switch"
                          style={{ fontFamily: lang === "si" ? sinhalaFont : "Cinzel", fontSize: 9, fontWeight: 700, color, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.3 }}
                        >
                          {time}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3
                        key={`obs-act-${lang}-${act}`}
                        className="lang-switch"
                        style={{ fontFamily: headingFont, fontWeight: 600, fontSize: "1.05rem", color, marginBottom: 8 }}
                      >
                        {act}
                      </h3>
                      <p
                        key={`obs-desc-${lang}-${act}`}
                        className="lang-switch"
                        style={{ fontFamily: lang === "si" ? sinhalaFont : "inherit", lineHeight: 1.8, opacity: 0.75, fontSize: "0.92rem" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share nudge */}
              <div style={{
                marginTop: 48, padding: "20px 24px",
                background: "rgba(212,132,154,0.06)",
                border: "1px solid rgba(212,132,154,0.2)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
              }}>
                <div>
                  <p
                    key={`obs-share-title-${lang}`}
                    className="lang-switch"
                    style={{ fontFamily: headingFont, fontSize: 14, color: "#d4849a", marginBottom: 4 }}
                  >
                    {t.obsShareTitle}
                  </p>
                  <p
                    key={`obs-share-desc-${lang}`}
                    className="lang-switch"
                    style={{ fontFamily: lang === "si" ? sinhalaFont : "Inter, sans-serif", fontSize: 12, opacity: 0.6, lineHeight: 1.5 }}
                  >
                    {t.obsShareDesc}
                  </p>
                </div>
                <button
                  onClick={() => setShowShareCard(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 22px", borderRadius: 4,
                    background: "rgba(212,132,154,0.14)", color: "#d4849a",
                    fontFamily: headingFont, fontWeight: 700, fontSize: 12,
                    letterSpacing: lang === "si" ? "0.02em" : "0.1em",
                    textTransform: lang === "si" ? "none" : "uppercase",
                    border: "1px solid rgba(212,132,154,0.4)",
                    cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                    whiteSpace: "nowrap",
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
                  {t.obsShareBtn}
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
              <span style={{ fontFamily: headingFont, fontSize: 12, color: "#f5c26b", opacity: 0.6 }}>
                {t.navBrand} ·{" "}
              </span>
            </div>
            <FlagStripes />
            <span style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.05em" }}>{t.footerRegion}</span>
          </footer>
        </div>
      </>
    </LangContext.Provider>
  );
}