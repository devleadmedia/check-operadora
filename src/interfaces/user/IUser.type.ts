import { Roles } from '@/enums/Roles.enum'

export interface IClient {
  id: string
  name: string
  /** Pode vir como string ("28066.119") ou número, dependendo do endpoint. */
  credits: string | number
  users?: unknown[] | null
  movements?: unknown[] | null
  created_at: string
  updated_at: string
}

export interface IUser {
  id: string
  name: string
  email: string
  role: Roles
  created_at: string
  updated_at: string
  client_id?: string
  client?: IClient
  /**
   * Saldo do usuário em centavos quando vem da listagem `/api/users/`.
   * No `/auth/me` o saldo aparece em `client.credits` (string em reais).
   */
  credit?: number
}
