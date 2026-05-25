import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Premium cursor system:
 *  - core: small glowing orb with tiny lag
 *  - ring: smooth follower, morphs per state
 *  - label: shows action text on cards/images
 *  - trail: lightweight fading particles
 *  - states: default | hover (button) | view (card/image) | link
 */
export function useCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    const core = document.createElement("div");
    core.className = "cur-core";
    core.innerHTML =
      '<svg viewBox="-6 -6 12 12" aria-hidden="true">' +
      '<line x1="-4" y1="0" x2="-1.5" y2="0"/>' +
      '<line x1="1.5" y1="0" x2="4" y2="0"/>' +
      '<line x1="0" y1="-4" x2="0" y2="-1.5"/>' +
      '<line x1="0" y1="1.5" x2="0" y2="4"/>' +
      '<circle cx="0" cy="0" r="1"/>' +
      "</svg>";

    const ring = document.createElement("div");
    ring.className = "cur-ring";
    ring.innerHTML =
      '<svg class="cur-ring__svg" viewBox="-50 -50 100 100" aria-hidden="true">' +
      // rotating dashed hexagon aperture
      '<polygon class="cur-ring__hex" points="40,0 20,34.64 -20,34.64 -40,0 -20,-34.64 20,-34.64" />' +
      // four corner ticks
      '<g class="cur-ring__ticks">' +
      '<line x1="-46" y1="0" x2="-38" y2="0"/>' +
      '<line x1="46" y1="0" x2="38" y2="0"/>' +
      '<line x1="0" y1="-46" x2="0" y2="-38"/>' +
      '<line x1="0" y1="46" x2="0" y2="38"/>' +
      "</g>" +
      "</svg>" +
      '<span class="cur-ring__label"></span>';
    document.body.append(core, ring);

    const label = ring.querySelector(".cur-ring__label") as HTMLSpanElement;

    // Smooth followers — core hugs cursor tightly, ring lags for premium feel
    const coreX = gsap.quickTo(core, "x", { duration: 0.10, ease: "power3.out" });
    const coreY = gsap.quickTo(core, "y", { duration: 0.10, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const ringRot = gsap.quickTo(ring, "rotation", { duration: 0.4, ease: "power3.out" });
    const ringScaleX = gsap.quickTo(ring, "scaleX", { duration: 0.35, ease: "power3.out" });
    const ringScaleY = gsap.quickTo(ring, "scaleY", { duration: 0.35, ease: "power3.out" });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = mouseX, lastY = mouseY, lastT = performance.now();
    let velocity = 0;

    // Particle trail pool
    const TRAIL = 12;
    const trail: HTMLDivElement[] = [];
    for (let i = 0; i < TRAIL; i++) {
      const p = document.createElement("div");
      p.className = "cur-trail";
      document.body.appendChild(p);
      trail.push(p);
    }
    let trailIdx = 0;
    let lastTrailTs = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      velocity = Math.min(120, Math.hypot(dx, dy) / dt * 16); // smoothed px/frame
      lastX = e.clientX; lastY = e.clientY; lastT = now;

      mouseX = e.clientX;
      mouseY = e.clientY;
      coreX(mouseX); coreY(mouseY);
      ringX(mouseX); ringY(mouseY);

      // Velocity-reactive stretch + rotation (only in default state)
      if (state === "default") {
        const stretch = 1 + Math.min(0.45, velocity / 140);
        const squash = 1 - Math.min(0.18, velocity / 320);
        ringScaleX(stretch);
        ringScaleY(squash);
        ringRot((Math.atan2(dy, dx) * 180) / Math.PI);
      } else {
        ringScaleX(1); ringScaleY(1);
      }

      // throttle trail emission
      if (now - lastTrailTs > 28) {
        lastTrailTs = now;
        const p = trail[trailIdx];
        trailIdx = (trailIdx + 1) % TRAIL;
        gsap.killTweensOf(p);
        gsap.set(p, { x: mouseX, y: mouseY, opacity: 0.5, scale: 1 });
        gsap.to(p, { opacity: 0, scale: 0.2, duration: 0.7, ease: "power2.out" });
      }
    };

    type State = "default" | "hover" | "view" | "link";
    let state: State = "default";
    let currentTarget: HTMLElement | null = null;
    const setState = (next: State, text = "") => {
      if (next === state && label.textContent === text) return;
      state = next;
      ring.dataset.state = next;
      label.textContent = text;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      const viewEl = t.closest<HTMLElement>("[data-cursor='view'], img, [data-cursor-text]");
      const hoverEl = t.closest<HTMLElement>("[data-cursor='hover'], button, [role='button']");
      const linkEl = t.closest<HTMLElement>("a");

      if (viewEl) {
        const text = viewEl.dataset.cursorText || "Explore";
        currentTarget = viewEl;
        setState("view", text);
      } else if (hoverEl) {
        currentTarget = hoverEl;
        setState("hover");
      } else if (linkEl) {
        currentTarget = linkEl;
        setState("link");
      } else {
        currentTarget = null;
        setState("default");
      }
    };

    // Magnetic pull for buttons
    const onMagnetic = () => {
      if (!currentTarget || state !== "hover") return;
      const rect = currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 80) {
        const pull = 0.25;
        ringX(cx + dx * (1 - pull));
        ringY(cy + dy * (1 - pull));
      }
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      gsap.to([core, ring, ...trail], { opacity: 0, duration: 0.2 });
    };
    const onEnter = () => {
      gsap.to([core, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const ticker = () => onMagnetic();
    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      gsap.ticker.remove(ticker);
      core.remove();
      ring.remove();
      trail.forEach((p) => p.remove());
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);
}
