import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export function MagneticButton({ children, className, variant = "primary", ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.6, ease: "power3.out" });
    gsap.to(inner.current, { x: x * 0.12, y: y * 0.18, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    gsap.to(inner.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm uppercase tracking-[0.18em] font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-accent"
      : "border border-white/15 text-foreground hover:border-white/40";

  return (
    <button
      ref={ref}
      data-cursor="hover"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(base, styles, className)}
      {...props}
    >
      <span ref={inner} className="inline-flex items-center gap-3">
        {children}
      </span>
    </button>
  );
}
