import { ScrollSnapRow, ScrollSnapItem } from "./scroll-snap-row";
import { FoilSweep } from "./foil-sweep";

interface PairedItem {
  Art: React.ComponentType<{ className?: string }>;
  name: string;
  note: string;
}

export function FrequentlyPaired({ items, dark = false }: { items: PairedItem[]; dark?: boolean }) {
  return (
    <div className="mt-10">
      <span
        className={`font-body text-caption font-medium uppercase tracking-label ${dark ? "text-cream/60" : "text-ink/50"}`}
      >
        Often Bought Together
      </span>
      <ScrollSnapRow className="mt-4">
        {items.map((item) => (
          <ScrollSnapItem key={item.name} className="w-60">
            <FoilSweep className="block h-full w-full">
              <div className="flex h-full flex-col border border-ink/10 bg-cream p-4">
                <div className="flex h-20 items-center justify-center">
                  <item.Art className="h-16 w-16" />
                </div>
                <span className="mt-3 font-body text-sm font-medium text-ink">{item.name}</span>
                <span className="mt-1 font-body text-xs text-ink/60">{item.note}</span>
              </div>
            </FoilSweep>
          </ScrollSnapItem>
        ))}
      </ScrollSnapRow>
    </div>
  );
}
