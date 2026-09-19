import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { AuthLayout, Field } from "@/components/auth-ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export const Route = createFileRoute("/signup")({
  component: SignupPage,
})

function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !password) return
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await signUp(email.trim(), name.trim(), password)
      navigate({ to: "/report", replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Reporter access"
      title="Create account"
      description="Set up access so you can file incident reports."
      footer={
        <p>
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Maria Adeyemi"
          autoComplete="name"
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  )
}