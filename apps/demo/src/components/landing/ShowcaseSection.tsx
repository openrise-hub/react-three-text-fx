import React from "react";
import { Button } from "@/components/retroui/Button";
import { showcaseItems } from "@/components/landing/constants";

export function ShowcaseSection() {
  return (
    <section id="showcase" className="bg-[var(--accent)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase">Showcase</p>
            <h3 className="font-[var(--font-head)] text-3xl">Component gallery</h3>
          </div>
          <Button variant="secondary">Explore components</Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {showcaseItems.map((label) => (
            <div
              key={label}
              className="rounded-md border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)]"
            >
              <p className="text-xs font-semibold uppercase">{label}</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Preview and configure animation props for cinematic typography.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
