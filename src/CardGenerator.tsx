import React, { useState, useRef } from "react";

interface CardGeneratorProps {
  onBackToLanding: () => void;
}

interface CardTemplate {
  id: string;
  name: string;
  className: string;
  textColor: string;
  accentColor: string;
}

const CardGenerator: React.FC<CardGeneratorProps> = ({ onBackToLanding }) => {
  // Preset traditional blessings configuration
  const presetMessages = [
    { label: "Sinhala Classic", text: "පින්බර පොසොන් පෝය දිනක් වේවා!" },
    {
      label: "Dhamma Wisdom",
      text: "ධර්මයේ ආලෝකය ඔබ සැමට නිවන් මඟ පාදයි විදහා පෙන්වනු ඇත. පින්බර පොසොන් මංගල්‍යයක් වේවා!",
    },
    {
      label: "English Spiritual",
      text: "May the light of wisdom guide your path and the peace of the Dhamma fill your heart.",
    },
    {
      label: "Mindfulness & Peace",
      text: "Wishing you a blessed Poson Poya filled with harmony, pure mindfulness, and compassion.",
    },
  ];

  // Visual Theme Presets mimicking high-end digital styling
  const themes: CardTemplate[] = [
    {
      id: "mihintale-dawn",
      name: "Mihintale Dawn (Deep Indigo & Violet)",
      className: "bg-gradient-to-br from-[#060b19] via-[#0f172a] to-[#1e1145]",
      textColor: "text-slate-100",
      accentColor: "text-amber-400",
    },
    {
      id: "wewai-blue",
      name: "Dhamma Cyan (Serene River & Sky)",
      className: "bg-gradient-to-br from-[#020617] via-[#071e3d] to-[#0f3460]",
      textColor: "text-cyan-50",
      accentColor: "text-cyan-400",
    },
    {
      id: "golden-aura",
      name: "Auspicious Glow (Charcoal & Amber)",
      className: "bg-gradient-to-br from-[#0a0a0a] via-[#171717] to-[#2d1a04]",
      textColor: "text-neutral-100",
      accentColor: "text-yellow-400",
    },
  ];

  // State Management for the Card Customizer Engine
  const [selectedTheme, setSelectedTheme] = useState<CardTemplate>(themes[0]);
  const [customText, setCustomText] = useState<string>(presetMessages[0].text);
  const [fontSize, setFontSize] = useState<number>(24);
  const [paddingSize, setPaddingSize] = useState<number>(40);
  const [showStupa, setShowStupa] = useState<boolean>(true);
  const [showDeer, setShowDeer] = useState<boolean>(true);
  const [showLotus, setShowLotus] = useState<boolean>(true);
  const [showBranding, setShowBranding] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const cardPreviewRef = useRef<HTMLDivElement>(null);

  // Fallback simulation framework for client-side raster download loops
  const handleExportCard = () => {
  if (!cardPreviewRef.current) return;

  setIsExporting(true);
  setExportSuccess(false);

  // download the image after a simulated processing delay to provide UI feedback
  setTimeout(async () => {
    try {
      const cardElement = cardPreviewRef.current!;
      
      // Dynamically import html2canvas for code-splitting efficiency
      const { default: html2canvas } = await import("html2canvas");

      // Generate the canvas directly from html2canvas with optimum rendering rules
      const canvas = await html2canvas(cardElement, {
        scale: 2,               // Captures the component at double resolution (Retina/High-Res)
        useCORS: true,          // Permissive asset loading for external icons or avatars
        allowTaint: false,      // Protects canvas cross-origin integrity
        backgroundColor: null,  // Respects the container's built-in rounded corners and gradients
        logging: false,         // Disables console debugging noise
      });

      // Directly convert html2canvas output into high-quality image format
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      
      // Generate immediate trigger link for local download
      const link = document.createElement("a");
      link.download = "E-BIX-Poson-Greeting-Card.png";
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
    } catch (error) {
      console.error("Canvas collection system pipeline error:", error);
    } finally {
      setIsExporting(false);
    }
  }, 500);
};

  return (
    <div className="min-h-screen bg-[#050913] text-white font-sans antialiased selection:bg-amber-400 selection:text-black">
      {/* APP INTERFACE NAVIGATION HEADER */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-900">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 text-sm text-slate-400 hover:text-amber-400 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span>Return to Hub</span>
        </button>
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono tracking-widest text-cyan-400">
            E-BIX CANVAS ENGINE v2.0
          </span>
          <span className="text-[10px] text-slate-500">
            STABLE NODE PIPELINE
          </span>
        </div>
      </nav>

      {/* CORE BUILDER GRAPHICAL WORKSPACE */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: CONTROL PARAMETERS INTERFACE PANEL (5 COLUMNS) */}
        <section className="lg:col-span-5 space-y-6 bg-slate-900/20 border border-slate-900 p-6 rounded-2xl h-fit">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>⚙️</span> Configuration Node
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust vector constraints, cultural parameters, and typography
              strings.
            </p>
          </div>

          {/* 1. SELECT PRESSED GREETING STRING */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider">
              Select Preset Blessing String
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomText(msg.text)}
                  className="px-3 py-2 bg-slate-900/60 border border-slate-800 text-left text-xs rounded-lg hover:border-slate-700 hover:bg-slate-900 transition-all truncate text-slate-300"
                >
                  {msg.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. REALTIME TEXTAREA INJECTOR */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider">
              Edit Customized Greeting (Unicode Supported)
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={4}
              className="w-full bg-[#03060c] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none font-sans leading-relaxed"
              placeholder="Enter your custom Poson Poya blessing message here..."
            />
          </div>

          {/* 3. VISUAL THEME SELECTION DROPDOWN */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider">
              Background Vector Matrix Theme
            </label>
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    selectedTheme.id === theme.id
                      ? "bg-slate-900 border-amber-500/40 text-amber-400 font-semibold"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/80"
                  }`}
                >
                  <span>{theme.name}</span>
                  <div
                    className={`w-3 h-3 rounded-full ${theme.className.split(" ")[1]}`}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. HERITAGE SYMBOLIC CAROUSEL TOGGLES */}
          <div className="space-y-3 pt-2 border-t border-slate-900">
            <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider">
              Traditional Heritage Motif Controls
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Toggle 1: Stupa */}
              <button
                onClick={() => setShowStupa(!showStupa)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  showStupa
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-slate-900/40 border-transparent text-slate-500"
                }`}
              >
                <span>🛕 Mihintale Stupa</span>
                <span className="font-mono text-[10px]">
                  {showStupa ? "ON" : "OFF"}
                </span>
              </button>

              {/* Toggle 2: Deer */}
              <button
                onClick={() => setShowDeer(!showDeer)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  showDeer
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-slate-900/40 border-transparent text-slate-500"
                }`}
              >
                <span>🦌 Wisdom Deer</span>
                <span className="font-mono text-[10px]">
                  {showDeer ? "ON" : "OFF"}
                </span>
              </button>

              {/* Toggle 3: Lotus Bloom */}
              <button
                onClick={() => setShowLotus(!showLotus)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  showLotus
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-slate-900/40 border-transparent text-slate-500"
                }`}
              >
                <span>🪷 Lotus Purity</span>
                <span className="font-mono text-[10px]">
                  {showLotus ? "ON" : "OFF"}
                </span>
              </button>

              {/* Toggle 4: Corporate Metadata Branding Signature */}
              <button
                onClick={() => setShowBranding(!showBranding)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  showBranding
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-900/40 border-transparent text-slate-500"
                }`}
              >
                <span>🛡️ E-BIX Signature</span>
                <span className="font-mono text-[10px]">
                  {showBranding ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </div>

          {/* 5. TYPOGRAPHIC RENDERING DIMENSIONS (SLIDERS) */}
          <div className="space-y-4 pt-2 border-t border-slate-900">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>FONT SCALING LAYER</span>
                <span className="text-amber-400">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="36"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>VIEWPORT PADDING</span>
                <span className="text-amber-400">{paddingSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={paddingSize}
                onChange={(e) => setPaddingSize(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: REALTIME WYSIWYG PREVIEW VIEWPORT FRAME (7 COLUMNS) */}
        <section className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* VIEWPORT TOP CONTAINER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400">
                Active Canvas Viewport (16:9 Scale Bound)
              </h3>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Hot-Reload Enabled</span>
              </div>
            </div>

            {/* REAL GREETING CARD PREVIEW CONTAINER BOX */}
            <div
              ref={cardPreviewRef}
              style={{ padding: `${paddingSize}px` }}
              className={`w-full aspect-[16/10] sm:aspect-[16/9] ${selectedTheme.className} rounded-2xl border border-white/5 relative flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 group`}
            >
              {/* BACKDROP HIGH INTENSITY FULL MOON VECTOR SOURCE */}
              <div className="absolute top-8 right-12 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-yellow-100 via-white to-amber-200 rounded-full opacity-80 blur-[2px] shadow-[0_0_50px_rgba(254,243,199,0.4)] flex items-center justify-center -z-0">
                {/* Internal Moon surface shadow detail mock */}
                <div className="w-full h-full bg-black/5 rounded-full filter contrast-125 mix-blend-multiply opacity-30"></div>
              </div>

              {/* WATER ripple/lantern ambient background highlights */}
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              {/* CARD PREVIEW TOP META BAND */}
              <div className="w-full flex justify-between items-start z-10 relative">
                <div>
                  {showLotus && (
                    <div className="text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse">
                      🪷
                    </div>
                  )}
                </div>
                <div className="text-right font-mono text-[9px] uppercase tracking-widest text-white/30">
                  June Full Moon Festival
                </div>
              </div>

              {/* MIDDLE HERO CUSTOM COMPILATION BODY TEXT DISPLAY */}
              <div className="w-full max-w-xl my-auto z-10 relative py-4">
                <p
                  style={{ fontSize: `${fontSize}px` }}
                  className={`font-sans font-bold leading-relaxed tracking-wide drop-shadow-xl text-balance ${selectedTheme.textColor}`}
                >
                  {customText || "..."}
                </p>
              </div>

              {/* PREVIEW BOTTOM ALIGNMENT LAYER: HOUSES SILHOUETTES & COMPANY BRANDING LOGOS */}
              <div className="w-full flex justify-between items-end pt-4 border-t border-white/10 z-10 relative">
                {/* Left Side Group: Traditional Silhouettes Simulation */}
                <div className="flex items-end space-x-4 min-h-[36px]">
                  {showStupa && (
                    <div className="flex flex-col items-center select-none text-white/80 filter drop-shadow-md">
                      <span className="text-2xl leading-none">🛕</span>
                      <span className="text-[8px] font-mono tracking-tighter uppercase opacity-40 mt-0.5">
                        Mihintale
                      </span>
                    </div>
                  )}
                  {showDeer && (
                    <div className="flex flex-col items-center select-none text-amber-400/90 filter drop-shadow-md">
                      <span className="text-2xl leading-none">🦌</span>
                      <span className="text-[8px] font-mono tracking-tighter uppercase opacity-40 mt-0.5">
                        Wisdom
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Side Group: E-BIX Software Signature Node Rendering */}
                {showBranding ? (
                  <div className="text-right flex flex-col items-end opacity-90">
                    <span
                      className={`text-[10px] font-extrabold tracking-widest uppercase ${selectedTheme.accentColor}`}
                    >
                      E-BIX Solutions
                    </span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-tighter">
                      Software Ecosystem Pipeline
                    </span>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded bg-white/5"></div>
                )}
              </div>

              {/* Ambient Buddhist Flag Aspect Gradient Border Bar Accent */}
              <div className="absolute top-0 inset-x-0 h-1 grid grid-cols-5 opacity-40">
                <div className="bg-blue-600"></div>
                <div className="bg-yellow-400"></div>
                <div className="bg-red-600"></div>
                <div className="bg-white"></div>
                <div className="bg-orange-500"></div>
              </div>
            </div>
          </div>

          {/* VIEWPORT BOTTOM ACTION BAR TRUMPETS */}
          <div className="bg-slate-900/40 border border-slate-900/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <p className="font-mono text-[11px] text-slate-300 uppercase font-semibold">
                Ready to compile deployment asset?
              </p>
              <p className="text-[10px]">
                Outputs high-fidelity web canvas distribution packages optimized
                for mobile messaging frames.
              </p>
            </div>

            <button
              onClick={handleExportCard}
              disabled={isExporting}
              className={`w-full sm:w-auto px-6 py-3 font-bold rounded-xl text-xs tracking-wide transition-all uppercase flex items-center justify-center space-x-2 ${
                isExporting
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black hover:scale-[1.01] font-extrabold shadow-md"
              }`}
            >
              {isExporting ? (
                <>
                  <span className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                  <span>Compiling Asset...</span>
                </>
              ) : (
                <span>Download Greeting Card Asset</span>
              )}
            </button>
          </div>

          {/* STATUS TOAST ANNOUNCEMENT BLOCK */}
          {exportSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-3 text-xs text-emerald-400 animate-fadeIn">
              <span className="mt-0.5">🚀</span>
              <div>
                <p className="font-bold uppercase tracking-wide">
                  Compilation Successful!
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  The compiled E-Poson Card bundle matrix signature layer was
                  captured correctly. Ready to be sent to your team, colleagues,
                  and community.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* CORE STRUCTURAL FOOTER HUB */}
      <footer className="bg-[#02050b] border-t border-slate-950/60 py-8 text-center text-slate-600 text-xs mt-16">
        <p>
          © 2026 E-BIX Software Solutions Engine Deck. Designed with reverence
          for Sri Lankan cultural lineage.
        </p>
      </footer>
    </div>
  );
};

export default CardGenerator;
