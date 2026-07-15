// Format: AG-YYYYMMDD-XXXX (XXXX = 4 random base36 chars). Human-scannable,
// roughly date-sortable, and collision odds are low enough (36^4 ~= 1.68M
// combinations per day) that a cheap retry-on-duplicate-key beats a
// sequential-counter collection for this order volume.
export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AG-${date}-${suffix}`;
}
