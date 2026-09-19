import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { api, getToken, setToken, type User } from "@/lib/api"

export type Session = User

type AuthValue = {
  session: Session | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<Session>
  signUp: (email: string, name: string, password: string) => Promise<Session>
  signOut: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  // On boot: if there's a token, verify it against /api/auth/me
  useEffect(() => {
    let cancelled = false
    async function boot() {
      const token = getToken()
      if (!token) {
        if (!cancelled) setReady(true)
        return
      }
      try {
        const user = await api.me()
        if (!cancelled) setSession(user)
      } catch {
        // Token invalid/expired — clear and move on
        setToken(null)
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login(email, password)
    setToken(token)
    setSession(user)
    return user
  }, [])

  const signUp = useCallback(
    async (email: string, name: string, password: string) => {
      const { token, user } = await api.signup(email, name, password)
      setToken(token)
      setSession(user)
      return user
    },
    [],
  )

  const signOut = useCallback(() => {
    setToken(null)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, ready, signIn, signUp, signOut }),
    [session, ready, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}