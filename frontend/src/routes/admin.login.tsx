import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout, Field } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [
    { title: "Admin Sign In — Dispatch" },
    { name: "description", content: "Analyst sign in for the Dispatch incident command dashboard." },
    { property: "og:title", content: "Admin Sign In — Dispatch" },
    { property: "og:description", content: "Analyst sign in for the Dispatch incident command dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    signIn(email.trim(), "admin");
    navigate({ to: "/", replace: true });
  };

  return (
    <AuthLayout
      eyebrow="Analyst access"
      title="Admin sign in"
      description="Enter the incident command workspace."
      footer={<>
        <p>Need an analyst account? <Link to="/admin/signup" className="font-semibold text-primary hover:text-primary/80">Register</Link></p>
        <p className="mt-2">Filing a report instead? <Link to="/login" className="font-semibold text-primary hover:text-primary/80">Reporter sign in</Link></p>
      </>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Work email" type="email" value={email} onChange={setEmail} placeholder="analyst@company.com" autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
