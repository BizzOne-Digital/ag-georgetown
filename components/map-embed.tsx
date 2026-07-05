import { Monogram } from "./monogram";
import { BUSINESS } from "@/lib/site";

/**
 * Styled static map stand-in with a monogram pin marker.
 * TODO: swap for a live Google Maps embed (iframe) once an API key / embed
 * URL is approved by the client.
 */
export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <a
      href={BUSINESS.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get directions to AG Liquidation Georgetown on Google Maps"
      className={`relative block aspect-[4/3] w-full overflow-hidden bg-[repeating-linear-gradient(45deg,#f3efe6_0,#f3efe6_10px,#faf8f4_10px,#faf8f4_20px)] ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Monogram className="h-14 w-14 drop-shadow-md" variant="gold" />
          <span className="h-3 w-3 rotate-45 bg-rose" />
        </div>
      </div>
      <span className="absolute bottom-4 right-4 bg-black/80 px-3 py-1.5 font-body text-xs font-medium text-cream">
        Open in Google Maps
      </span>
    </a>
  );
}
