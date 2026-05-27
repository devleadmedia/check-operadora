import { Roles } from '@/enums/Roles.enum'
import { IClients } from '../clients/clients'

export interface IUser {
  id: string
  name: string
  email: string
  role: Roles
  created_at: string
  updated_at: string
  client_id?: string
  client?: IClients
  credit?: number
}
