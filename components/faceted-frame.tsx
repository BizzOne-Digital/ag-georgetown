interface FacetedFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Faceted frame: a 5-6 edge angled clip-path (echoes a cut glass bottle
 * stopper), used for the hero image and page-header banners. Simplifies to a
 * plain rounded crop below `md`, where the facet math reads as visually
 * noisy at small sizes.
 */
export function FacetedFrame({ children, className = "" }: FacetedFrameProps) {
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:rounded-none md:clip-facet ${className}`}
    >
      {children}
    </div>
  );
}
