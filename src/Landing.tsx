import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

interface LandingProps {
  onStartCreating: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStartCreating }) => {
  const [activeThemePreview, setActiveThemePreview] = useState<
    "mihintale" | "wewai" | "lotus"
  >("mihintale");

  // Preview data modeling for the interactive visual frame
  const themeImages = {
    mihintale: {
      url: "/Gemini_Generated_Image_b8zftbb8zftbb8zf.png",
      label: "Mihintale Spiritual Night Sky & Stupa Glow",
      tag: "පින්බර පොසොන් මංගල්‍යයක් වේවා",
    },
    wewai: {
      url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80",
      label: "වැවයි දාගැබයි Mirror Lake Ripple",
      tag: "ධර්මයේ ආලෝකය ඔබ සැමට ලැබේවා",
    },
    lotus: {
      url: "https://images.unsplash.com/photo-1560160911-39659b8be92f?auto=format&fit=crop&w=800&q=80",
      label: "Lotus Enlightenment Minimalist Contrast",
      tag: "May the Light of Wisdom Guide Your Path",
    },
  };


  return (
    <div className="min-h-screen bg-[#050913] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">
      {/* 1. CORPORATE HEADER NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center border-b border-slate-900 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-cyan-400 flex items-center justify-center font-black text-black text-base shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-md font-extrabold tracking-widest bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              E-BIX SOLUTIONS
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
              Software Engineering Ecosystem
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm font-medium text-slate-400">
          <a
            href="#heritage"
            className="hover:text-amber-400 transition-colors"
          >
            Heritage Imagery
          </a>
          <a
            href="#features"
            className="hover:text-amber-400 transition-colors"
          >
            App Specs
          </a>
          <a
            href="https://github.com/E-Bix-Software-Solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg hover:text-white transition-colors"
          >
            <span>GitHub</span>
          </a>
        </div>
      </nav>

      {/* 2. DYNAMIC HERO SECTION WITH BUILT-IN TEMPLATE SIMULATOR */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Messaging Block */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-amber-400 font-semibold tracking-wide">
            <span>✨ Project Poson Poya Greeting Deck v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            පින්බර පොසොන් <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent">
              පෝය දිනක් වේවා!
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            Commemorate the historic arrival of Arahat Mahinda to Sri Lanka.
            This open-source compiler by{" "}
            <span className="text-white font-medium">E-BIX Solutions</span>{" "}
            converts local values into modern, scalable vector templates to
            share across your digital pipelines.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a href="/create">
              <button
                type="button"
                onClick={onStartCreating}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              >
                Initialize Card Generator
              </button>
            </a>

            <a
              href="#heritage"
              className="px-8 py-4 bg-slate-900/60 border border-slate-800/80 rounded-xl font-semibold text-center hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            >
              Analyze Symbolic Motifs
            </a>
          </div>

          {/* Social Proof Footer Badges */}
          <div className="pt-6 border-t border-slate-900/60 flex items-center space-x-4 text-xs font-mono text-slate-500">
            <span>TEAM PIPELINE:</span>
            <a
              href="https://www.linkedin.com/in/sahan-dhanujaya-040aa4359/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Sahan D.
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/mahesh-hansaka-1069a3310/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Mahesh H.
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/sherul-dhanushka-204a58202/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Sherul D.
            </a>
          </div>
        </div>

        {/* Right Preview Framework Simulator Column */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          {/* Ambient Glows */}
          <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

          {/* Active Canvas Mock Screen */}
          <div className="w-full max-w-md bg-slate-900/30 border border-slate-800/80 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              </div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                Active_Viewport.png
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden group border border-white/5 shadow-inner">
              <img
                src={themeImages[activeThemePreview].url}
                alt={themeImages[activeThemePreview].label}
                className="w-full h-[320px] object-cover transition-all duration-500 brightness-90 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-center">
                <h4 className="text-amber-400 font-bold tracking-wide text-lg drop-shadow-md">
                  {themeImages[activeThemePreview].tag}
                </h4>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
                  E-Bix Generated Asset Signature Layer
                </p>
              </div>
            </div>

            {/* Interactive Simulator State Toggles */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {(["mihintale", "wewai", "lotus"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveThemePreview(t)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    activeThemePreview === t
                      ? "bg-gradient-to-r from-slate-800 to-slate-900 text-amber-400 border-amber-500/40 shadow-md"
                      : "bg-slate-900/40 text-slate-400 border-transparent hover:border-slate-800 hover:bg-slate-900/80"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 3. SYMBOLIC IMAGERY DEEP-DIVE GRID */}
      <section
        id="heritage"
        className="bg-[#080d1a] border-y border-slate-950/40 py-24 px-6 relative"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Traditional Motifs Rendered with Pure Precision
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Every digital greeting vector template represents foundational
              historical milestones of Sri Lankan civilization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Motif 1 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4 hover:border-slate-700/80 transition-all">
              <div className="text-3xl text-amber-400">🛕</div>
              <h3 className="text-lg font-bold text-white">
                Mihintale Sacred Stupa
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The sacred mountain landscape marking where royal monk Arahath
                Mahinda first established the foundations of peaceful Dhamma on
                the island.
              </p>
            </div>

            {/* Motif 2 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4 hover:border-slate-700/80 transition-all">
              <div className="text-3xl text-amber-400">🦌</div>
              <h3 className="text-lg font-bold text-white">
                The Royal Encounter
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Reflecting the wisdom test given to King Devanampiya Tissa using
                the legendary riddle of the mango tree and the herd of deer.
              </p>
            </div>

            {/* Motif 3 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4 hover:border-slate-700/80 transition-all">
              <div className="text-3xl text-cyan-400">🪷</div>
              <h3 className="text-lg font-bold text-white">
                Lotus Purity Layer
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Geometric graphic layers utilizing lotus nodes to symbolize
                spiritual awakening, clarity, and immaculate structural
                enlightenment.
              </p>
            </div>

            {/* Motif 4 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4 hover:border-slate-700/80 transition-all">
              <div className="text-3xl text-yellow-400">🌕</div>
              <h3 className="text-lg font-bold text-white">Full Moon Aura</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A radiant high-intensity ambient full moon background block
                signifying the June Poya day, clarity, and deep corporate
                mindfulness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. APPLICATION SPECIFICATIONS / BENCHMARKS */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Engineered For High-Performance Sharing
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Built using optimized component cycles. Input customized Sinhala
            translations or English blessings, compile pixel rendering layers,
            and capture high-fidelity templates instantaneously.
          </p>
          <div className="pt-2 space-y-3">
            <div className="flex items-start space-x-3 text-sm text-slate-300">
              <span className="text-cyan-400 font-bold mt-0.5">✓</span>
              <span>Direct HTML5 local storage client caching support.</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-slate-300">
              <span className="text-cyan-400 font-bold mt-0.5">✓</span>
              <span>
                16:9 cinematic widescreen configuration bounds for crisp
                distribution.
              </span>
            </div>
          </div>
        </div>

        {/* Visual Code Artifact Block */}
        <div className="lg:col-span-7 bg-[#03060c] border border-slate-900 rounded-2xl p-6 font-mono text-xs text-slate-400 shadow-2xl overflow-x-auto">
          <p className="text-slate-600 mb-2">
            // Sample Output Node Schema Reference
          </p>
          <p>
            <span className="text-purple-400">const</span> PosonCardMetaData =
            &#123;
          </p>
          <p className="pl-4">
            engine:{" "}
            <span className="text-amber-400">"E-BIX Web Canvas Core"</span>,
          </p>
          <p className="pl-4">
            localization:{" "}
            <span className="text-amber-400">"Sinhala Unicode Supported"</span>,
          </p>
          <p className="pl-4">
            motifs: [<span className="text-cyan-400">"Mihintale_Stupa"</span>,{" "}
            <span className="text-cyan-400">"Deer_Silhouette"</span>,{" "}
            <span className="text-cyan-400">"Full_Moon"</span>],
          </p>
          <p className="pl-4">
            standardGreeting:{" "}
            <span className="text-emerald-400">
              "Pinbara Poson Poya Dinayak Weva"
            </span>
          </p>
          <p>&#125;;</p>
          <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
            <span>READY FOR VIEWPORT EXECUTION</span>
            <span className="text-green-400">● STABLE STATE</span>
          </div>
        </div>
      </section>

      {/* 5. BRAND FOOTER */}
      <footer className="bg-[#02050b] border-t border-slate-950/60 py-12 text-center text-slate-500 text-sm px-6">
        <p className="font-medium">
          © 2026 E-BIX Software Solutions. Blending modern development with
          ancient heritage.
        </p>
        <p className="text-xs text-slate-600 font-mono mt-1">
          Colombo & Central Province, Sri Lanka • www.ebix.lk
        </p>
      </footer>
    </div>
  );
};

export default Landing;
