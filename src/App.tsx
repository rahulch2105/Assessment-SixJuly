import { Navbar } from "@/components/layout/navbar";
import { IntroWipe } from "@/components/layout/intro-wipe";
import { Hero } from "@/components/hero/hero";
import { Showcase } from "@/components/showcase/showcase";
import { useLenis } from "@/hooks/use-lenis";
import { useCursor } from "@/hooks/use-cursor";

export default function App() {
  useLenis();
  useCursor();

  return (
    <main className="relative grain min-h-svh bg-background text-foreground">
      <IntroWipe />
      <Navbar />
      <Hero />
      <Showcase />
    </main>
  );
}
