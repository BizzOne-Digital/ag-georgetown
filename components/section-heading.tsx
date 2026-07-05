interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, align = "center", className = "" }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-h2 font-medium text-ink">{title}</h2>
      <span className="h-[3px] w-16 rounded-full bg-gold" />
    </div>
  );
}
