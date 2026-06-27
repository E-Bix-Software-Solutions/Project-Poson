// ─── Constants ────────────────────────────────────────────────────────────────
export const GENERATION_STEPS = [
  {
    icon: "☸️",
    headline: "Invoking the Dhamma…",
    sub: "Reaching into 2,500 years of sacred tradition",
  },
  {
    icon: "🎇",
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

export const STEP_DURATION = 900;

// ─── Generation Stage ─────────────────────────────────────────────────────────
interface GenerationStageProps {
  stepIndex: number;
}

export function GenerationStage({ stepIndex }: GenerationStageProps) {
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
}
