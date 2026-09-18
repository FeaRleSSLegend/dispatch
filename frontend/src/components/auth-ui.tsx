import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-14">
      <div className="w-full max-w-sm">
        <Link to="/login" className="mb-10 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Shield className="size-4" />
          </span>
          <div>
            <p className="font-display text-base font-semibold tracking-wide">Dispatch</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Incident command</p>
          </div>
        </Link>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-xs text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="section-label">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
      />
    </div>
  );
}
