import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LETTERS = ["S", "I", "X", "J", "U", "L", "Y"];

export function Sixjuly() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const stageEl = stage.current!;
    const letters = lettersRef.current.filter(Boolean);

    // Intro reveal
    gsap.set(letters, { yPercent: 110, opacity: 0 });
    gsap.to(letters, {
      yPercent: 0,
      opacity: 1,
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.35,
    });
    gsap.from(hintRef.current, { opacity: 0, y: 8, duration: 1, delay: 1.4, ease: "power2.out" });

    // Per-letter quick setters
    const setters = letters.map((l) => ({
      x: gsap.quickTo(l, "x", { duration: 0.9, ease: "expo.out" }),
      y: gsap.quickTo(l, "y", { duration: 0.9, ease: "expo.out" }),
      rx: gsap.quickTo(l, "rotationY", { duration: 1.0, ease: "expo.out" }),
      ry: gsap.quickTo(l, "rotationX", { duration: 1.0, ease: "expo.out" }),
      sc: gsap.quickTo(l, "scale", { duration: 0.8, ease: "expo.out" }),
      sx: gsap.quickTo(l, "scaleX", { duration: 0.7, ease: "expo.out" }),
      sy: gsap.quickTo(l, "scaleY", { duration: 0.7, ease: "expo.out" }),
    }));

    const glowSet = {
      x: gsap.quickTo(glowRef.current, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(glowRef.current, "y", { duration: 0.5, ease: "power3.out" }),
      o: gsap.quickTo(glowRef.current, "opacity", { duration: 0.6, ease: "power2.out" }),
    };
    const ringSet = {
      x: gsap.quickTo(ringRef.current, "x", { duration: 0.25, ease: "power3.out" }),
      y: gsap.quickTo(ringRef.current, "y", { duration: 0.25, ease: "power3.out" }),
      o: gsap.quickTo(ringRef.current, "opacity", { duration: 0.4, ease: "power2.out" }),
    };

    let pointerInside = false;

    const onMove = (e: PointerEvent) => {
      const rect = stageEl.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      glowSet.x(mx);
      glowSet.y(my);
      glowSet.o(pointerInside ? 1 : 0.45);
      ringSet.x(e.clientX - el.getBoundingClientRect().left);
      ringSet.y(e.clientY - el.getBoundingClientRect().top);
      ringSet.o(pointerInside ? 1 : 0);

      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const cx = r.left + r.width / 2 - rect.left;
        const cy = r.top + r.height / 2 - rect.top;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = 320;
        const power = Math.max(0, 1 - dist / radius);
        const pull = 46 * power;
        // magnetic translate
        setters[i].x((dx / dist) * pull);
        setters[i].y((dy / dist) * pull * 0.85);
        // 3d tilt away from cursor
        setters[i].rx((-dx / radius) * 26 * power);
        setters[i].ry((dy / radius) * 26 * power);
        // liquid stretch along cursor vector
        const stretch = 1 + power * 0.14;
        const squash = 1 - power * 0.06;
        const angleHoriz = Math.abs(dx) > Math.abs(dy);
        setters[i].sx(angleHoriz ? stretch : squash);
        setters[i].sy(angleHoriz ? squash : stretch);
        setters[i].sc(1 + power * 0.04);
      });
    };

    const onEnter = () => {
      pointerInside = true;
    };
    const onLeave = () => {
      pointerInside = false;
      setters.forEach((s) => {
        s.x(0);
        s.y(0);
        s.rx(0);
        s.ry(0);
        s.sc(1);
        s.sx(1);
        s.sy(1);
      });
      glowSet.o(0.35);
      ringSet.o(0);
    };

    // Heat-wave / liquid ripple on click
    const onClick = () => {
      gsap.killTweensOf([dispRef.current, turbRef.current]);
      gsap.fromTo(
        dispRef.current,
        { attr: { scale: 0 } },
        {
          attr: { scale: 120 },
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(dispRef.current, { attr: { scale: 0 }, duration: 1.6, ease: "expo.out" });
          },
        },
      );
      gsap.fromTo(
        turbRef.current,
        { attr: { baseFrequency: 0.005 } },
        { attr: { baseFrequency: 0.055 }, duration: 0.6, ease: "power2.out", yoyo: true, repeat: 1 },
      );
      // pulse glow
      gsap.fromTo(
        glowRef.current,
        { scale: 1 },
        { scale: 1.6, duration: 0.7, ease: "expo.out", yoyo: true, repeat: 1 },
      );
    };

    // Ambient turbulence drift
    const seed = { v: 1 };
    const amb = gsap.to(seed, {
      v: 100,
      duration: 18,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        if (turbRef.current) turbRef.current.setAttribute("seed", String(Math.floor(seed.v)));
      },
    });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
      amb.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative w-full select-none"
      style={{ perspective: "1400px" }}
      data-cursor="hover"
    >
      {/* Cursor-following soft glow (behind text) */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Thin reactive ring (above text) */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          border: "1px solid color-mix(in oklab, var(--primary) 80%, transparent)",
          boxShadow:
            "0 0 24px color-mix(in oklab, var(--primary) 40%, transparent), inset 0 0 24px color-mix(in oklab, var(--primary) 20%, transparent)",
        }}
      />

      {/* Distortion filter for the heat-wave ripple */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="sixjuly-ripple" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="2"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <h1
        ref={stage}
        aria-label="Sixjuly"
        className="relative z-10 flex justify-center font-display leading-[0.82] tracking-[-0.05em] text-[clamp(96px,22vw,360px)]"
        style={{
          filter: "url(#sixjuly-ripple)",
          transformStyle: "preserve-3d",
          textShadow:
            "0 0 0.04em color-mix(in oklab, var(--primary) 12%, transparent), 0 0 1.2em color-mix(in oklab, var(--primary) 14%, transparent)",
        }}
      >
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            ref={(node) => {
              if (node) lettersRef.current[i] = node;
            }}
            className="inline-block will-change-transform"
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 60%" }}
          >
            {ch}
          </span>
        ))}
      </h1>

      <div
        ref={hintRef}
        className="pointer-events-none mt-6 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
      >
        <span className="h-px w-8 bg-current opacity-40" />
        Move · Hover · Click
        <span className="h-px w-8 bg-current opacity-40" />
      </div>
    </div>
  );
}
