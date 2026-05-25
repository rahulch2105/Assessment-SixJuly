import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Brief cinematic intro: a vertical curtain wipes up while a hairline
 * loader bar runs. ~1.2s, plays once per session. Client-only mount to
 * avoid SSR/CSR hydration mismatch on sessionStorage.
 */
export function IntroWipe() {
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (sessionStorage.getItem("sj-intro")) {
      root.current?.remove();
      return;
    }
    sessionStorage.setItem("sj-intro", "1");

    const el = root.current!;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        el.remove();
      },
    });

    tl.to(el.querySelector("[data-bar]"), {
      scaleX: 1,
      duration: 0.9,
      ease: "expo.inOut",
    })
      .to(
        el.querySelectorAll("[data-label]"),
        { opacity: 0, y: -6, duration: 0.4, ease: "power2.in" },
        "-=0.15",
      )
      .to(el, {
        yPercent: -100,
        duration: 1.05,
        ease: "expo.inOut",
      }, "-=0.1");
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex items-end justify-between px-6 pb-8 md:px-10"
      style={{ background: "var(--color-background)" }}
    >
      <span
        data-label
        className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        Sixjuly™ · Loading reel
      </span>
      <span
        data-label
        className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        2026 ©
      </span>
      <div className="pointer-events-none absolute inset-x-6 bottom-6 md:inset-x-10">
        <div
          data-bar
          className="h-px w-full origin-left scale-x-0 bg-primary"
          style={{ boxShadow: "0 0 18px color-mix(in oklab, var(--primary) 70%, transparent)" }}
        />
      </div>
    </div>
  );
}
