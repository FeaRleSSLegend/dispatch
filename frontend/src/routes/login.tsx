import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout, Field } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Reporter Sign In — Dispatch" },
    { name: "description", content: "Sign in to submit a security incident report." },
    { property: "og:title", content: "Reporter Sign In — Dispatch" },
    { property: "og:description", content: "Sign in to submit a security incident report." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    signIn(email.trim(), "user");
    navigate({ to: "/report", replace: true });
  };

  return (
    <AuthLayout
      eyebrow="Reporter access"
      title="Sign in"
      description="Report a security concern to the incident response team."
      footer={<>
        <p>No account? <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">Create one</Link></p>
        <p className="mt-2">Analyst or responder? <Link to="/admin/login" className="font-semibold text-primary hover:text-primary/80">Admin sign in</Link></p>
      </>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
