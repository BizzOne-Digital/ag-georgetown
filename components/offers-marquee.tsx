const MESSAGES = [
  "UP TO 70% OFF DESIGNER FRAGRANCES",
  "BUNDLE & SAVE ON GIFT SETS",
  "NEW ARRIVALS WEEKLY",
  "IN-STORE THIS WEEK: MAKEUP FROM $5",
];

export function OffersMarquee() {
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="group overflow-hidden bg-rose py-3">
      <div className="flex w-max animate-marquee gap-8 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
        {track.map((msg, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-8 font-body text-sm font-medium uppercase tracking-label text-cream"
          >
            {msg}
            <span className="text-gold-end">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
