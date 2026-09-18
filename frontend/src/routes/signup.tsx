import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout, Field } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [
    { title: "Reporter Sign Up — Dispatch" },
    { name: "description", content: "Create a reporter account to submit security incidents." },
    { property: "og:title", content: "Reporter Sign Up — Dispatch" },
    { property: "og:description", content: "Create a reporter account to submit security incidents." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: SignupPage,
});

function SignupPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    signIn(email.trim(), "user", name);
    navigate({ to: "/report", replace: true });
  };

  return (
    <AuthLayout
      eyebrow="Reporter access"
      title="Create account"
      description="Set up access so you can file incident reports."
      footer={<p>Already registered? <Link to="/login" className="font-semibold text-primary hover:text-primary/80">Sign in</Link></p>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" value={name} onChange={setName} placeholder="Maria Adeyemi" autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="new-password" />
        <Button type="submit" className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  );
}
