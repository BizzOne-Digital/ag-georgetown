interface MonogramProps {
  className?: string;
  variant?: "gold" | "ink" | "cream";
}

/**
 * Recreated brand mark: interlocking "AG" inside a thin circle.
 * Used standalone (nav/footer) and as a low-opacity watermark / badge cutout shape elsewhere.
 */
export function Monogram({ className, variant = "gold" }: MonogramProps) {
  const strokeId = "monogram-gold-gradient";
  const stroke =
    variant === "gold"
      ? `url(#${strokeId})`
      : variant === "cream"
        ? "#FAF8F4"
        : "#1A1A1A";

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9A227" />
          <stop offset="1" stopColor="#F0D98C" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" stroke={stroke} strokeWidth="1.5" />
      {/* A */}
      <path
        d="M42 78 L58 34 L74 78 M48 64 H68"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* G, interlocked and offset to the right of the A */}
      <path
        d="M78 42 A16 16 0 1 0 78 78 A16 15 0 0 0 92 65 H80"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-6 0)"
      />
    </svg>
  );
}

export function MonogramWatermark({ className }: { className?: string }) {
  return (
    <Monogram
      variant="ink"
      className={`pointer-events-none select-none opacity-[0.05] rotate-[-8deg] ${className ?? ""}`}
    />
  );
}
