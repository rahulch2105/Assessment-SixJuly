import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Cinematic holographic centerpiece.
 * Layered CSS/SVG — no WebGL — for guaranteed 60fps.
 * Reacts to cursor with subtle 3D tilt + parallax depth layers.
 */
export function Centerpiece() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ringA = useRef<HTMLDivElement>(null);
  const ringB = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.from(stage.current, {
        scale: 0.6,
        opacity: 0,
        duration: 1.8,
        ease: "expo.out",
        delay: 0.4,
      });

      // Idle rotation — different speeds, opposing
      gsap.to(ringA.current, { rotation: 360, duration: 32, ease: "none", repeat: -1 });
      gsap.to(ringB.current, { rotation: -360, duration: 48, ease: "none", repeat: -1 });
      gsap.to(orb.current, {
        y: -12,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Mouse parallax (camera-like)
      const rxTo = gsap.quickTo(stage.current, "rotationY", { duration: 0.9, ease: "power3.out" });
      const ryTo = gsap.quickTo(stage.current, "rotationX", { duration: 0.9, ease: "power3.out" });
      const glowX = gsap.quickTo(glow.current, "x", { duration: 0.6, ease: "power3.out" });
      const glowY = gsap.quickTo(glow.current, "y", { duration: 0.6, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const r = root.current!.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / window.innerWidth;
        const dy = (e.clientY - cy) / window.innerHeight;
        rxTo(dx * 28);
        ryTo(-dy * 22);
        glowX(dx * 60);
        glowY(dy * 60);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      return () => window.removeEventListener("mousemove", onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={stage}
        className="relative h-[68vmin] w-[68vmin] md:h-[58vmin] md:w-[58vmin]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Soft moving halo */}
        <div
          ref={glow}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
            filter: "blur(60px)",
            transform: "translateZ(-200px)",
          }}
        />

        {/* Outer dashed ring */}
        <div
          ref={ringA}
          className="absolute inset-0"
          style={{ transform: "translateZ(40px) rotateX(72deg)" }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <circle
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke="color-mix(in oklab, var(--primary) 60%, transparent)"
              strokeWidth="0.4"
              strokeDasharray="1 3"
              opacity="0.7"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.3"
            />
          </svg>
        </div>

        {/* Inner solid ring */}
        <div
          ref={ringB}
          className="absolute inset-[8%]"
          style={{ transform: "translateZ(80px) rotateX(68deg) rotateY(20deg)" }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="color-mix(in oklab, var(--primary) 90%, white)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="color-mix(in oklab, var(--primary) 90%, white)" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="0.8"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Glass orb core */}
        <div
          ref={orb}
          className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            transform: "translate(-50%, -50%) translateZ(140px)",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, color-mix(in oklab, var(--primary) 70%, white) 18%, color-mix(in oklab, var(--primary) 50%, transparent) 45%, transparent 70%), radial-gradient(circle at 70% 80%, rgba(120,200,255,0.55), transparent 55%)",
            boxShadow:
              "0 30px 80px -10px color-mix(in oklab, var(--primary) 55%, transparent), inset 0 -20px 40px rgba(0,0,0,0.4), inset 0 10px 30px rgba(255,255,255,0.2)",
            backdropFilter: "blur(2px)",
            filter: "saturate(1.1)",
          }}
        >
          {/* Specular highlight */}
          <div
            className="absolute left-[18%] top-[14%] h-[28%] w-[36%] rounded-full opacity-80"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.95), transparent 70%)",
              filter: "blur(4px)",
            }}
          />
        </div>

        {/* Orbiting particle dot */}
        <div
          className="absolute inset-0"
          style={{ transform: "translateZ(120px)" }}
        >
          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite]">
            <span
              className="absolute left-1/2 top-0 block h-2 w-2 -translate-x-1/2 rounded-full bg-primary"
              style={{ boxShadow: "0 0 16px 4px color-mix(in oklab, var(--primary) 80%, transparent)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
