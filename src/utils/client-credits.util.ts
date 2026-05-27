import { IClients } from '@/interfaces/clients/clients'

export function parseCreditsValue(raw: string | number | null | undefined): number | null {
  if (raw === '' || raw == null) return null

  const value = Number(raw)
  return Number.isNaN(value) ? null : value
}

export function getClientCreditsAmount(client?: IClients | null): number | null {
  if (!client) return null
  return parseCreditsValue(client.credits)
}

export function findClientById(
  clientId: string | undefined | null,
  clients: IClients[] | undefined,
): IClients | null {
  if (!clientId || !clients?.length) return null

  return clients.find((item) => item.id === clientId) ?? null
}

export function getCreditsByClientId(
  clientId: string | undefined | null,
  clients: IClients[] | undefined,
): number | null {
  const client = findClientById(clientId, clients)
  if (!client) return null

  return parseCreditsValue(client.credits)
}
