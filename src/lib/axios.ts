import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

import { authStorage } from './auth-storage'

const BASE_URL = 'https://zapchecker.bigdates.com.br'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const apiBare = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }
type WaitingResolver = (token: string | null) => void

let isRefreshing = false
let waitingQueue: WaitingResolver[] = []
let onUnauthorized: (() => void) | null = null

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler
}

function flushQueue(token: string | null) {
  waitingQueue.forEach((resolve) => resolve(token))
  waitingQueue = []
}

function setAuthHeader(config: AxiosRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = new AxiosHeaders()
  }
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', `Bearer ${token}`)
  } else {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }
}

api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    setAuthHeader(config, token)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined
    const status = error.response?.status

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingQueue.push((newToken) => {
          if (!newToken) {
            reject(error)
            return
          }
          setAuthHeader(originalRequest, newToken)
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const refreshToken = authStorage.getRefreshToken()
      if (!refreshToken) {
        throw error
      }

      const { data } = await apiBare.post<{
        access_token: string
        refresh_token?: string
      }>('/auth/refresh-token', { refresh_token: refreshToken })

      authStorage.setToken(data.access_token)
      if (data.refresh_token) {
        authStorage.setRefreshToken(data.refresh_token)
      }

      flushQueue(data.access_token)
      setAuthHeader(originalRequest, data.access_token)
      return api(originalRequest)
    } catch (refreshError) {
      flushQueue(null)
      onUnauthorized?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
