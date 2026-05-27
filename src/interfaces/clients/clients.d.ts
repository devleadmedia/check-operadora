import { IUser } from '../user/IUser.type'

export interface IClients {
  id: string
  name: string
  credits: string
  users: IUser | null
  movements: IStatementMovement | null
  created_at: string
  updated_at: string
}

export interface IClientsUpdated {
  name: string
  client_id: string
}

export interface IAddCredit {
  client_id: string
  amount: number
  description: string
}
