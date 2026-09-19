import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { AuthLayout, Field } from "@/components/auth-ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const { signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !password) return
    setError(null)
    setLoading(true)
    try {
      const user = await signIn(email.trim(), password)
      if (user.role !== "admin") {
        signOut()
        setError("This account does not have admin access.")
        return
      }
      navigate({ to: "/", replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin sign in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Analyst access"
      title="Admin sign in"
      description="Enter the incident command workspace."
      footer={
        <p>
          Filing a report instead?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Reporter sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="analyst@company.com"
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
          {loading ? "Verifying…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  )
}