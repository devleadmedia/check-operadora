import type { IUser } from '@/interfaces/user/IUser.type'

const KEYS = {
  token: '@check_operadora:token',
  refreshToken: '@check_operadora:refresh_token',
  user: '@check_operadora:user',
} as const

const storage: Storage | null =
  typeof window !== 'undefined' ? window.sessionStorage : null

function readString(key: string): string | null {
  if (!storage) return null
  const value = storage.getItem(key)
  if (!value || value === 'undefined' || value === 'null' || value.trim() === '') {
    return null
  }
  return value
}

function readJSON<T>(key: string): T | null {
  const raw = readString(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export const authStorage = {
  getToken(): string | null {
    return readString(KEYS.token)
  },
  setToken(token: string) {
    storage?.setItem(KEYS.token, token)
  },
  getRefreshToken(): string | null {
    return readString(KEYS.refreshToken)
  },
  setRefreshToken(token: string) {
    storage?.setItem(KEYS.refreshToken, token)
  },
  getUser(): IUser | null {
    return readJSON<IUser>(KEYS.user)
  },
  setUser(user: IUser) {
    storage?.setItem(KEYS.user, JSON.stringify(user))
  },
  clearSession() {
    storage?.removeItem(KEYS.token)
    storage?.removeItem(KEYS.refreshToken)
    storage?.removeItem(KEYS.user)
  },
}
