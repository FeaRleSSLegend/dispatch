import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { AuthLayout, Field } from "@/components/auth-ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) return
    setError(null)
    setLoading(true)
    try {
      const user = await signIn(email.trim(), password)
      navigate({ to: user.role === "admin" ? "/" : "/report", replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Report a security concern to the incident response team."
      footer={
        <>
          <p>
            No account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">
              Create one
            </Link>
          </p>
          <p className="mt-2">
            Analyst or responder?{" "}
            <Link
              to="/admin/login"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Admin sign in
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  )
}