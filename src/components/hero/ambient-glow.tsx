import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      xTo((e.clientX - cx) * 0.12);
      yTo((e.clientY - cy) * 0.12);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* primary glow */}
      <div
        ref={ref}
        className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 38%, transparent), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* secondary halo */}
      <div
        className="absolute -bottom-40 -right-40 h-[50vmin] w-[50vmin] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,200,255,.18), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
