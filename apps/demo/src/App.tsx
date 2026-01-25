import React from "react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { ComponentsSection } from "@/components/landing/ComponentsSection";

export default function App() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <ComponentsSection />
    </main>
  );
}
