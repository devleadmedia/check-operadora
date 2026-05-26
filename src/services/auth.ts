import { api, apiBare } from '@/lib/axios'
import { authStorage } from '@/lib/auth-storage'
import type { IUser } from '@/interfaces/user/IUser.type'
import type { IApiResponse } from '@/interfaces/api/IApiResponse.type'

export interface ISignInPayload {
  email: string
  password: string
}

export interface ISignInResponse {
  access_token: string
  refresh_token: string
  user: IUser
}

export interface IRefreshResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
}

export async function signIn(payload: ISignInPayload): Promise<ISignInResponse> {
  const { data } = await api.post<ISignInResponse>('/auth/login', payload)
  return data
}

export async function refreshAccessToken(refresh_token: string): Promise<IRefreshResponse> {
  const { data } = await apiBare.post<IRefreshResponse>('/auth/refresh-token', {
    refresh_token,
  })
  return data
}

export async function getMe(): Promise<IUser | null> {
  const stored = authStorage.getUser()
  if (!stored?.id) return null

  try {
    const { data } = await api.get<IApiResponse<IUser>>(
      `/api/users/${stored.id}`,
    )
    return data.data
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch {
    // backend pode não ter o endpoint; logout local sempre acontece
  }
}
