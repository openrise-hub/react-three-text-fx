import React from "react";
import { featureCards } from "@/components/landing/constants";

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-6 py-16">
      <h3 className="font-[var(--font-head)] text-3xl">Why it stands out</h3>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {featureCards.map((item) => (
          <div
            key={item.title}
            className="rounded-md border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)]"
          >
            <p className="text-xs font-semibold uppercase">{item.title}</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
