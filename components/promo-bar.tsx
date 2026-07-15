import { OffersMarquee } from "./offers-marquee";

const DEFAULT_MESSAGES = ["Celebrating Authentic Beauty", "Proudly Canadian", "Visit Us in Person"];

interface PromoBarProps {
  messages?: string[];
}

// Fixed and stacked above <Navbar> (which is itself fixed top-0) - every
// offset that assumes "navbar starts at y=0" shifts down by this bar's
// height (h-9) accordingly. See components/navbar.tsx and
// app/products/layout.tsx for the matching offsets.
export function PromoBar({ messages = DEFAULT_MESSAGES }: PromoBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-9">
      <OffersMarquee messages={messages} goldText compact />
    </div>
  );
}
