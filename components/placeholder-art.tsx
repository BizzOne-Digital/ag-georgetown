/**
 * Stand-in line-art illustrations for product/category imagery.
 * TODO: replace with real transparent-background product cutouts
 * (client-supplied photography, or a Remove.bg-style cutout pass) composited
 * the same way these are - directly on a color block, no bounding card.
 */

function ArtWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PerfumeBottleArt({ className }: { className?: string }) {
  return (
    <ArtWrap className={className}>
      <rect x="70" y="40" width="20" height="16" rx="3" fill="#0D0D0D" />
      <rect x="76" y="24" width="8" height="18" rx="2" fill="#C9A227" />
      <path
        d="M60 70 Q60 56 80 56 Q100 56 100 70 L108 220 Q108 236 90 236 L70 236 Q52 236 52 220 Z"
        fill="#FAF8F4"
        stroke="#C9A227"
        strokeWidth="2"
      />
      <rect x="58" y="120" width="44" height="50" fill="#E8879E" opacity="0.85" />
    </ArtWrap>
  );
}

export function LipstickArt({ className }: { className?: string }) {
  return (
    <ArtWrap className={className}>
      <path d="M80 40 L120 40 L112 90 L88 90 Z" fill="#E8879E" />
      <path d="M85 90 L115 90 L110 130 L90 130 Z" fill="#0D0D0D" />
      <rect x="82" y="130" width="36" height="90" rx="6" fill="#FAF8F4" stroke="#C9A227" strokeWidth="2" />
      <rect x="82" y="160" width="36" height="60" rx="6" fill="#C9A227" opacity="0.25" />
    </ArtWrap>
  );
}

export function SkincareJarArt({ className }: { className?: string }) {
  return (
    <ArtWrap className={className}>
      <rect x="55" y="90" width="90" height="100" rx="14" fill="#FAF8F4" stroke="#C9A227" strokeWidth="2" />
      <rect x="55" y="90" width="90" height="34" rx="14" fill="#E8879E" opacity="0.85" />
      <ellipse cx="100" cy="80" rx="48" ry="14" fill="#0D0D0D" />
    </ArtWrap>
  );
}

export function GiftSetArt({ className }: { className?: string }) {
  return (
    <ArtWrap className={className}>
      <rect x="40" y="130" width="120" height="90" rx="6" fill="#FAF8F4" stroke="#C9A227" strokeWidth="2" />
      <rect x="40" y="130" width="120" height="24" fill="#E8879E" />
      <rect x="92" y="130" width="16" height="90" fill="#C9A227" />
      <circle cx="100" cy="120" r="16" fill="#C9A227" />
    </ArtWrap>
  );
}

export function BrushArt({ className }: { className?: string }) {
  return (
    <ArtWrap className={className}>
      <ellipse cx="100" cy="60" rx="26" ry="34" fill="#0D0D0D" />
      <rect x="92" y="90" width="16" height="60" fill="#C9A227" />
      <rect x="94" y="150" width="12" height="80" rx="4" fill="#FAF8F4" stroke="#E8879E" strokeWidth="2" />
    </ArtWrap>
  );
}

export function StorefrontArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0" y="60" width="400" height="200" fill="#FAF8F4" />
      <rect x="0" y="60" width="400" height="30" fill="#0D0D0D" />
      <rect x="30" y="110" width="150" height="120" fill="#FFFFFF" stroke="#C9A227" strokeWidth="2" />
      <rect x="220" y="110" width="150" height="120" fill="#FFFFFF" stroke="#C9A227" strokeWidth="2" />
      <rect x="180" y="140" width="40" height="90" fill="#E8879E" />
    </svg>
  );
}
