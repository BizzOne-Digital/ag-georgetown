const DEFAULT_MESSAGES = [
  "UP TO 70% OFF DESIGNER FRAGRANCES",
  "BUNDLE & SAVE ON GIFT SETS",
  "NEW ARRIVALS WEEKLY",
  "IN-STORE THIS WEEK: MAKEUP FROM $5",
];

interface OffersMarqueeProps {
  messages?: string[];
  goldText?: boolean;
  className?: string;
}

export function OffersMarquee({ messages = DEFAULT_MESSAGES, goldText = false, className = "" }: OffersMarqueeProps) {
  const track = [...messages, ...messages];

  return (
    <div className={`group overflow-hidden bg-rose py-3 ${className}`}>
      <div className="flex w-max animate-marquee gap-8 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
        {track.map((msg, i) => (
          <span
            key={i}
            className={`flex shrink-0 items-center gap-8 font-body text-sm font-medium uppercase tracking-label ${
              goldText ? "gold-text" : "text-cream"
            }`}
          >
            {msg}
            <span className={goldText ? "gold-text" : "text-gold-end"}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
