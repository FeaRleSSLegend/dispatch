import { useNavigate } from "@tanstack/react-router";
import { LogOut, Shield } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/auth";

export function ReporterShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary"><Shield className="size-4" /></span>
          <div>
            <p className="font-display text-sm font-semibold tracking-wide">Dispatch</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Report an incident</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">{session?.email}</span>
          <button
            onClick={() => {
              signOut();
              navigate({ to: "/login", replace: true });
            }}
            className="flex h-9 items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="size-3.5" />Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1100px] p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
