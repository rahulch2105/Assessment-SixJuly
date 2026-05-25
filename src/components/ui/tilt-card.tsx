import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  cursorText?: string;
  maxTilt?: number;
}

/**
 * 3D tilt wrapper with dynamic light reflection.
 * Uses gsap.quickTo for buttery interpolation, perspective transform,
 * and a CSS spotlight that tracks cursor for layer separation.
 */
export function TiltCard({ children, className = "", cursorText = "Explore", maxTilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  const rxRef = useRef<((v: number) => void) | null>(null);
  const ryRef = useRef<((v: number) => void) | null>(null);

  const ensureTweens = () => {
    if (!rxRef.current && inner.current) {
      rxRef.current = gsap.quickTo(inner.current, "rotationX", { duration: 0.6, ease: "power3.out" });
      ryRef.current = gsap.quickTo(inner.current, "rotationY", { duration: 0.6, ease: "power3.out" });
    }
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    ensureTweens();
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * (maxTilt * 2);
    const ry = (x - 0.5) * (maxTilt * 2);
    rxRef.current?.(rx);
    ryRef.current?.(ry);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const onLeave = () => {
    if (!inner.current) return;
    gsap.to(inner.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="view"
      data-cursor-text={cursorText}
      className={className}
      style={{ perspective: "1100px" }}
    >
      <div
        ref={inner}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
        {/* dynamic spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 50%)",
            mixBlendMode: "overlay",
            transform: "translateZ(40px)",
          }}
        />
      </div>
    </div>
  );
}
