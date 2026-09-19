import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

/** All authentication screens share one image-and-form layout. */
export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="auth-screen">
      <aside className="auth-aside" aria-hidden="true">
        <img
          className="auth-aside-image"
          src="/incident-map.svg"
          alt=""
          decoding="async"
        />
      </aside>
      <main className="auth-main">
        <Link to="/login" className="auth-mobile-brand" aria-label="Dispatch sign in">
          dispatch<span aria-hidden="true">.</span>
        </Link>
        <div className="auth-form-wrap page-enter">
          <h1 className="auth-title">{title}</h1>
          {description && <p className="auth-description">{description}</p>}
          <div className="auth-fields">{children}</div>
          <div className="auth-footer">{footer}</div>
        </div>
      </main>
    </div>
  )
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-")
  return (
    <div>
      <label htmlFor={id} className="section-label block">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        minLength={autoComplete === "new-password" ? 8 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="app-field mt-2"
      />
    </div>
  )
}
