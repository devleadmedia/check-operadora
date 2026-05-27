import { IAddCredit, IClients, IClientsUpdated } from '@/interfaces/clients/clients'
import { api } from '@/lib/axios'

export async function index() {
  const res = await api.get<IClients[]>('/api/clients/', {
    params: {
      page: 1,
      page_size: 50,
    },
  })
  return res.data
}

export async function create(name: string) {
  const res = await api.post('/api/clients/', { name })
  return res.data
}

export async function show(client_id: string) {
  const res = await api.get(`/api/clients/${client_id}/`)
  return res.data
}

export async function remove(client_id: string) {
  const res = await api.delete(`/api/clients/${client_id}`)
  return res.data
}

export async function updated({ name, client_id }: IClientsUpdated) {
  const res = await api.put(`/api/clients/${client_id}`, { name })
  return res.data
}

export async function addCredit({ client_id, amount, description }: IAddCredit) {
  const res = await api.post('/api/clients/credits/', { client_id, amount, description })
  return res.data
}
