import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout, Field } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/signup")({
  head: () => ({ meta: [
    { title: "Admin Sign Up — Dispatch" },
    { name: "description", content: "Register an analyst account for Dispatch incident command." },
    { property: "og:title", content: "Admin Sign Up — Dispatch" },
    { property: "og:description", content: "Register an analyst account for Dispatch incident command." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AdminSignupPage,
});

function AdminSignupPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !code.trim() || !password.trim()) return;
    signIn(email.trim(), "admin", name);
    navigate({ to: "/", replace: true });
  };

  return (
    <AuthLayout
      eyebrow="Analyst access"
      title="Admin registration"
      description="Create an analyst account with your team access code."
      footer={<p>Already have access? <Link to="/admin/login" className="font-semibold text-primary hover:text-primary/80">Admin sign in</Link></p>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" value={name} onChange={setName} placeholder="Ada Okafor" autoComplete="name" />
        <Field label="Work email" type="email" value={email} onChange={setEmail} placeholder="analyst@company.com" autoComplete="email" />
        <Field label="Access code" value={code} onChange={setCode} placeholder="SOC-XXXX" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="new-password" />
        <Button type="submit" className="w-full">Create analyst account</Button>
      </form>
    </AuthLayout>
  );
}
