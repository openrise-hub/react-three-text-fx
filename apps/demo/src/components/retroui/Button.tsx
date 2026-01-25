import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const base =
  "inline-flex items-center justify-center rounded-md border-2 border-[var(--border)] px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-transform active:translate-y-[2px]";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--primary-hover)]",
  secondary:
    "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[var(--shadow-sm)] hover:opacity-90"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
