import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu } from "lucide-react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: -40,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, ref);

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-scrolled={scrolled ? "true" : "false"}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 transition-[padding,background-color,backdrop-filter,border-color] duration-500 ease-out md:px-10 md:py-6 data-[scrolled=true]:py-3 data-[scrolled=true]:md:py-3 data-[scrolled=true]:bg-background/55 data-[scrolled=true]:backdrop-blur-xl data-[scrolled=true]:border-b data-[scrolled=true]:border-white/[0.06]"
    >
      <a href="#" data-cursor="hover" className="flex items-center gap-2 text-sm tracking-[0.25em] uppercase">
        <span className="inline-block h-2 w-2 rounded-full bg-primary glow-accent" />
        <span className="font-mono">Sixjuly™</span>
      </a>

      <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 backdrop-blur-md">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            data-cursor="hover"
            className="relative px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Est. 2019 — Earth
        </span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden rounded-full border border-white/10 p-2.5"
        aria-label="Menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute top-full right-6 mt-2 flex flex-col gap-2 rounded-2xl border border-white/10 bg-background/90 p-4 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2 text-sm uppercase tracking-[0.18em]">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
