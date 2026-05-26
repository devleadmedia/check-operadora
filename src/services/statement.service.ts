import { IStatement } from '@/interfaces/statement/IStatement.type'
import { api } from '@/lib/axios'

type ICreditsResponse = {
  credits: number
}

export async function getAllStatement(): Promise<IStatement> {
  const { data } = await api.get<IStatement>('/api/credits/statement')
  return data
}

export async function getCredits(): Promise<ICreditsResponse> {
  const { data } = await api.get<ICreditsResponse>('/api/credits')
  return data
}
