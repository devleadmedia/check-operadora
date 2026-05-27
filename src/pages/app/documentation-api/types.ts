export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiParameter {
  name: string
  in: 'path' | 'query' | 'header' | 'body'
  type: string
  required?: boolean
  description: string
}

export interface ApiEndpoint {
  id: string
  method: HttpMethod
  path: string
  title: string
  description: string
  parameters?: ApiParameter[]
  requestExample?: string
  responseExample?: string
}

export interface ApiSection {
  id: string
  title: string
  endpoints: ApiEndpoint[]
}
