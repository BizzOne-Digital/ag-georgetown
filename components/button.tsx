import Link from "next/link";
import { FoilSweep } from "./foil-sweep";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
  fullWidth?: boolean;
  invert?: boolean;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
  fullWidth,
  invert,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] text-sm font-medium tracking-[0.02em] transition-all duration-300 active:scale-[1.02] ${
    fullWidth ? "w-full" : ""
  }`;

  const styles =
    variant === "primary"
      ? "bg-rose text-cream hover:bg-rose-deep"
      : invert
        ? "bg-transparent text-cream border-[1.5px] border-cream hover:bg-cream/10"
        : "bg-transparent text-ink border-[1.5px] gold-border hover:bg-cream";

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <FoilSweep className={`${fullWidth ? "block w-full" : "inline-block"} ${className}`}>
      <Link href={href} {...linkProps} className={`${base} ${styles}`}>
        {children}
      </Link>
    </FoilSweep>
  );
}
