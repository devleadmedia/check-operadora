import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authStorage } from '@/lib/auth-storage'
import { setOnUnauthorized } from '@/lib/axios'
import {
  getMe,
  logout as logoutRequest,
  signIn as signInRequest,
  type ISignInPayload,
} from '@/services/auth'
import type { IUser } from '@/interfaces/user/IUser.type'

interface AuthContextValue {
  user: IUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  signIn: (payload: ISignInPayload) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(() => authStorage.getUser())
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(
    () => !!authStorage.getToken(),
  )
  const queryClient = useQueryClient()

  const signOut = useCallback(async () => {
    await logoutRequest()
    authStorage.clearSession()
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    setOnUnauthorized(() => {
      toast.warning('Sessão expirada...')
      authStorage.clearSession()
      setUser(null)
      queryClient.clear()
    })
    return () => setOnUnauthorized(null)
  }, [queryClient])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const token = authStorage.getToken()
      if (!token) {
        setIsBootstrapping(false)
        return
      }

      const fresh = await getMe()
      if (cancelled) return

      if (fresh) {
        authStorage.setUser(fresh)
        setUser(fresh)
      }
      setIsBootstrapping(false)
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (payload: ISignInPayload) => {
    const response = await signInRequest(payload)
    authStorage.setToken(response.access_token)
    authStorage.setRefreshToken(response.refresh_token)
    authStorage.setUser(response.user)
    setUser(response.user)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isBootstrapping,
      signIn,
      signOut,
    }),
    [user, isBootstrapping, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return ctx
}
