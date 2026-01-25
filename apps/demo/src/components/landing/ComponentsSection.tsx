import React from "react";
import { Button } from "@/components/retroui/Button";
import { componentCards } from "@/components/landing/constants";

export function ComponentsSection() {
  return (
    <section id="components" className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase">Toolkit</p>
          <h3 className="font-[var(--font-head)] text-3xl">API-first primitives</h3>
        </div>
        <div className="flex gap-3">
          <Button>View API</Button>
          <Button variant="secondary">Download</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {componentCards.map((card) => (
          <div
            key={card.title}
            className="rounded-md border-2 border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]"
          >
            <h4 className="font-semibold uppercase">{card.title}</h4>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{card.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
