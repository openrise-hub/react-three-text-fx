import React from "react";
import { Button } from "@/components/retroui/Button";
import { PreviewDialog } from "@/components/landing/PreviewDialog";

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-16 pt-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]">Procedural type</p>
        <h2 className="font-[var(--font-head)] text-4xl leading-tight md:text-5xl">
          Neon-brutalist 3D text effects built for R3F
        </h2>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
          Drop expressive 3D typography into any React Three Fiber scene. Animate explosions,
          glitch cuts, and cinematic motion with a clean, prop-driven API.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Get started</Button>
          <Button variant="secondary">View docs</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-md border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
            <p className="font-semibold uppercase">R3F-first</p>
            <p className="text-[var(--muted-foreground)]">Pure components, no manual scene.</p>
          </div>
          <div className="rounded-md border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
            <p className="font-semibold uppercase">Type-safe</p>
            <p className="text-[var(--muted-foreground)]">Strict TypeScript out of the box.</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-md)]">
        <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase">Live preview</p>
          <span className="text-xs text-[var(--muted-foreground)]">R3F Canvas</span>
        </div>
        <PreviewDialog text="REACT THREE TEXT" />
      </div>
    </section>
  );
}
