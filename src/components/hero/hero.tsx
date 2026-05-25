import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { AmbientGlow } from "./ambient-glow";
import { Sixjuly } from "./sixjuly";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });

      tl.from("[data-eyebrow] > *", {
        y: 24, opacity: 0, duration: 1, stagger: 0.05,
      })
        .from(
          "[data-sub]",
          { y: 20, opacity: 0, duration: 1 },
          "-=0.4",
        )
        .from(
          "[data-cta] > *",
          { y: 20, opacity: 0, duration: 0.9, stagger: 0.1 },
          "-=0.7",
        )
        .from(
          "[data-meta]",
          { opacity: 0, y: 12, duration: 0.8, stagger: 0.08 },
          "-=0.6",
        )
        .from(
          "[data-scroll]",
          { opacity: 0, y: -10, duration: 0.8 },
          "-=0.4",
        );

      // Parallax on headline
      gsap.to("[data-parallax]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col overflow-hidden pt-28 md:pt-32"
    >
      <AmbientGlow />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-6 pb-10 md:px-10">
        {/* Eyebrow */}
        <div
          data-eyebrow
          className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary glow-accent" />
            Independent Studio · No. 014
          </span>
          <span className="hidden sm:inline">[ Reel — 2026 ]</span>
        </div>

        {/* Signature interactive wordmark */}
        <div data-parallax className="my-10 md:my-0">
          <Sixjuly />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p
              data-sub
              className="text-pretty text-base text-muted-foreground md:text-lg"
            >
              We build cinematic web experiences for brands that refuse to blend in —
              motion-led, obsessively crafted, end-to-end.
            </p>

            <div data-cta className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton>
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </MagneticButton>
              <MagneticButton variant="ghost">View reel</MagneticButton>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:gap-12">
            {[
              ["072", "Shipped"],
              ["18", "Awards"],
              ["12ms", "Avg. Δ"],
            ].map(([k, v]) => (
              <div key={v} data-meta>
                <div className="font-display text-3xl text-foreground md:text-4xl">{k}</div>
                <div className="mt-2 opacity-70">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          data-scroll
          className="mt-12 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:absolute md:bottom-6 md:left-1/2 md:mt-0 md:-translate-x-1/2"
        >
          <span className="animate-pulse">Scroll</span>
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
