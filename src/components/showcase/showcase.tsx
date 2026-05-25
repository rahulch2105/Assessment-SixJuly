import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Card = {
  index: string;
  title: string;
  tag: string;
  blurb: string;
  hue: string;
};

const CARDS: Card[] = [
  {
    index: "01",
    title: "Brand\nSystems",
    tag: "Identity",
    blurb: "Visual languages engineered for scale — typography, tokens, motion principles.",
    hue: "from-[#c4ff3d]/30 to-transparent",
  },
  {
    index: "02",
    title: "Motion\nDesign",
    tag: "Animation",
    blurb: "Choreographed interfaces where every easing curve earns its place.",
    hue: "from-[#7cc7ff]/30 to-transparent",
  },
  {
    index: "03",
    title: "Digital\nStrategy",
    tag: "Direction",
    blurb: "Positioning, narrative, and product thinking that survives the boardroom.",
    hue: "from-[#ff8e7c]/25 to-transparent",
  },
  {
    index: "04",
    title: "Web\nExperiences",
    tag: "Engineering",
    blurb: "Sites that load fast, feel cinematic, and never break on a Tuesday.",
    hue: "from-[#c4ff3d]/30 to-transparent",
  },
  {
    index: "05",
    title: "Interactive\nWorlds",
    tag: "Immersive",
    blurb: "3D, WebGL and gesture-driven surfaces — the new shape of the browser.",
    hue: "from-[#a78bff]/30 to-transparent",
  },
];

export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile) return; // mobile uses native horizontal scroll

      const trackEl = track.current!;
      const getScrollWidth = () => trackEl.scrollWidth - window.innerWidth;

      const tween = gsap.to(trackEl, {
        x: () => -getScrollWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + getScrollWidth(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Per-card entrance as they come into view in the pinned track
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 90%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative bg-background">
      {/* Section header */}
      <div className="relative z-10 flex flex-col gap-6 px-6 pt-24 pb-16 md:flex-row md:items-end md:justify-between md:px-10 md:pt-32">
        <div className="max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            [ 02 — Capabilities ]
          </div>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
            Five disciplines.<br />
            <span className="text-muted-foreground">One obsession.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground md:text-base">
          A vertically integrated studio. Drag, scroll, or just let it run — every
          capability is a doorway into a deeper engagement.
        </p>
      </div>

      {/* Pinned horizontal track (desktop) / native scroll (mobile) */}
      <div className="relative overflow-hidden">
        <div
          ref={track}
          className="flex w-max gap-6 px-6 pb-24 md:gap-10 md:px-10
                     max-md:w-auto max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:no-scrollbar"
        >
          {CARDS.map((c) => (
            <TiltCard
              key={c.index}
              cursorText="View"
              className="h-[70vh] w-[82vw] shrink-0 snap-center md:h-[68vh] md:w-[42vw] lg:w-[36vw]"
            >
              <article
                data-card
                className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card p-8 md:p-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* hover glow */}
                <div
                  className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${c.hue} opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 45%, transparent), transparent)",
                  }}
                />

                <header className="relative flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {c.index} / {String(CARDS.length).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:border-primary/60 group-hover:text-primary">
                    {c.tag}
                  </span>
                </header>

                <div className="relative" style={{ transform: "translateZ(60px)" }}>
                  <h3 className="font-display text-6xl leading-[0.9] tracking-tight whitespace-pre-line md:text-7xl lg:text-8xl">
                    {c.title}
                  </h3>
                  <p className="mt-6 max-w-sm text-sm text-muted-foreground md:text-base">
                    {c.blurb}
                  </p>
                </div>

                <footer className="relative flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Selected work →
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </span>
                </footer>
              </article>
            </TiltCard>
          ))}

          {/* Tail spacer */}
          <div className="hidden w-[10vw] shrink-0 md:block" aria-hidden />
        </div>
      </div>
    </section>
  );
}
