import type {
  Category,
  Entities,
  Incident,
  IncidentStatus,
  Severity,
} from "@/lib/incidents"

// In development, same-origin /api is forwarded by Vite. This avoids browser
// CORS failures and keeps working if Vite selects a port other than 5173.
// Production uses same-origin /api unless VITE_API_URL is explicitly supplied.
const configuredApiUrl = (import.meta.env["VITE_API_URL"] as string | undefined)?.trim()
const API_URL = import.meta.env.DEV ? "" : (configuredApiUrl ?? "").replace(/\/+$/, "")

const TOKEN_KEY = "dispatch.token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) window.localStorage.setItem(TOKEN_KEY, token)
  else window.localStorage.removeItem(TOKEN_KEY)
}

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) ?? {}),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch (error) {
    // Network/CORS failures happen before the server can check credentials.
    // Never report them as an invalid password.
    if (error instanceof TypeError) {
      throw new ApiError(
        "Unable to connect to the Dispatch API. Check that the backend is running and the API address is configured.",
        0,
      )
    }
    throw error
  }

  if (!res.ok) {
    let message = res.status === 502 || res.status === 503 || res.status === 504
      ? "The Dispatch API is unavailable. Check that the backend is running."
      : res.status >= 500
        ? `The server encountered an error (${res.status}). Check the backend logs.`
        : `Request failed: ${res.status}`
    try {
      const body = await res.json()
      if (body?.detail) {
        message =
          typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail)
      }
    } catch {
      /* ignore */
    }
    if (res.status === 401) setToken(null)
    throw new ApiError(message, res.status)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// --- Types ---------------------------------------------------------------

export type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

export type AuthResponse = {
  token: string
  user: User
}

export type IncidentListResponse = {
  items: Incident[]
  total: number
  limit: number
  offset: number
}

export type AnalyzeResponse = {
  category: Category
  severity: Severity
  score: number | null
  entities: Entities
  redacted: string
  routed_to: string
  duplicate_of: string | null
}

export type AnalyticsSummary = {
  volume_by_day: Array<{ date: string; count: number }>
  severity_distribution: Record<string, number>
  category_distribution: Record<string, number>
  kpis: { total_incidents: number; active: number }
}

export type ListIncidentsParams = {
  severity?: Severity | undefined
  status?: IncidentStatus | undefined
  category?: Category | undefined
  department?: string | undefined
  q?: string | undefined
  limit?: number | undefined
  offset?: number | undefined
}

// --- API client ----------------------------------------------------------

export const api = {
  // Auth
  async signup(email: string, name: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    })
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  async me(): Promise<User> {
    return request<User>("/api/auth/me")
  },

  // Incidents
  async listIncidents(params: ListIncidentsParams = {}): Promise<IncidentListResponse> {
    const search = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") search.set(k, String(v))
    }
    const qs = search.toString()
    return request<IncidentListResponse>(`/api/incidents${qs ? `?${qs}` : ""}`)
  },

  async getIncident(id: string): Promise<Incident> {
    return request<Incident>(`/api/incidents/${encodeURIComponent(id)}`)
  },

  // Reports
  async analyze(text: string): Promise<AnalyzeResponse> {
    return request<AnalyzeResponse>("/api/reports/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  },

  async submit(text: string, department: string): Promise<Incident> {
    return request<Incident>("/api/reports/submit", {
      method: "POST",
      body: JSON.stringify({ text, department }),
    })
  },

  // Analytics
  async analyticsSummary(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>("/api/analytics/summary")
  },

  // Meta
  async health(): Promise<{ status: string }> {
    return request<{ status: string }>("/api/health")
  },
}

export { ApiError }