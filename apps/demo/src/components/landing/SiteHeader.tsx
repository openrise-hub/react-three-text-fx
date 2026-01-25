import React from "react";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md border-2 border-[var(--border)] bg-[var(--primary)] shadow-[var(--shadow-sm)]" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em]">react-three-text-fx</p>
          <h1 className="font-[var(--font-head)] text-xl">Retro 3D Text</h1>
        </div>
      </div>
      <nav className="hidden items-center gap-4 md:flex">
        <a className="text-sm font-semibold uppercase" href="#features">
          Features
        </a>
        <a className="text-sm font-semibold uppercase" href="#showcase">
          Showcase
        </a>
        <a className="text-sm font-semibold uppercase" href="#components">
          Components
        </a>
      </nav>
    </header>
  );
}
