import type { ApiSection } from './types'

export const API_BASE_URL = 'https://api.checkoperadora.com.br/v1'

export const API_SECTIONS: ApiSection[] = [
  {
    id: 'auth',
    title: 'Autenticação',
    endpoints: [
      {
        id: 'auth-login',
        method: 'POST',
        path: '/auth/login',
        title: 'Login',
        description:
          'Autentica o usuário e retorna os tokens de acesso. Utilize o access_token no header Authorization das demais requisições.',
        parameters: [
          {
            name: 'email',
            in: 'body',
            type: 'string',
            required: true,
            description: 'E-mail do usuário',
          },
          {
            name: 'password',
            in: 'body',
            type: 'string',
            required: true,
            description: 'Senha do usuário',
          },
        ],
        requestExample: `{
  "email": "usuario@empresa.com.br",
  "password": "********"
}`,
        responseExample: `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Usuário",
    "email": "usuario@empresa.com.br",
    "role": "user",
    "client_id": "uuid-do-cliente"
  }
}`,
      },
      {
        id: 'auth-refresh',
        method: 'POST',
        path: '/auth/refresh-token',
        title: 'Renovar token',
        description: 'Gera um novo access_token a partir do refresh_token.',
        parameters: [
          {
            name: 'refresh_token',
            in: 'body',
            type: 'string',
            required: true,
            description: 'Token de renovação obtido no login',
          },
        ],
        requestExample: `{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}`,
        responseExample: `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}`,
      },
    ],
  },
  {
    id: 'checker',
    title: 'Checker',
    endpoints: [
      {
        id: 'check-portability',
        method: 'GET',
        path: '/api/check/portabilidade/{numero}',
        title: 'Consultar portabilidade',
        description:
          'Consulta a operadora atual, portabilidade e metadados de um número de telefone.',
        parameters: [
          {
            name: 'numero',
            in: 'path',
            type: 'string',
            required: true,
            description: 'Número com DDD (somente dígitos)',
          },
          {
            name: 'Authorization',
            in: 'header',
            type: 'string',
            required: true,
            description: 'Bearer {access_token}',
          },
        ],
        responseExample: `{
  "numero": "11999999999",
  "tipo": "movel",
  "operadora_original": "Vivo",
  "operadora_atual": "Claro",
  "portado": true,
  "UF": "SP",
  "M": "São Paulo"
}`,
      },
      {
        id: 'files-list',
        method: 'GET',
        path: '/api/files/',
        title: 'Listar arquivos',
        description: 'Retorna a lista paginada de arquivos enviados para processamento em lote.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            type: 'integer',
            description: 'Número da página (padrão: 1)',
          },
          {
            name: 'page_size',
            in: 'query',
            type: 'integer',
            description: 'Itens por página (padrão: 20)',
          },
        ],
        responseExample: `{
  "data": [],
  "page": 1,
  "page_size": 20,
  "total_items": 0
}`,
      },
      {
        id: 'files-upload',
        method: 'POST',
        path: '/api/files/',
        title: 'Enviar arquivo',
        description: 'Envia um arquivo CSV/TXT para consulta em lote. Content-Type: multipart/form-data.',
        parameters: [
          {
            name: 'file',
            in: 'body',
            type: 'file',
            required: true,
            description: 'Arquivo com lista de números',
          },
        ],
        responseExample: `{
  "id": "uuid",
  "status": "processing",
  "message": "Arquivo recebido com sucesso"
}`,
      },
    ],
  },
  {
    id: 'credits',
    title: 'Créditos',
    endpoints: [
      {
        id: 'credits-balance',
        method: 'GET',
        path: '/api/credits',
        title: 'Saldo de créditos',
        description: 'Retorna o saldo disponível do cliente vinculado ao usuário autenticado.',
        responseExample: `{
  "credits": 27791.94
}`,
      },
      {
        id: 'credits-statement',
        method: 'GET',
        path: '/api/credits/statement',
        title: 'Extrato de movimentações',
        description: 'Lista entradas e saídas de créditos do cliente.',
        responseExample: `{
  "movements": [
    {
      "id": "uuid",
      "type": "add",
      "amount": 10000,
      "description": "Recarga manual",
      "created_at": "2026-05-27T19:38:09.766571Z"
    }
  ]
}`,
      },
    ],
  },
  {
    id: 'clients',
    title: 'Clientes',
    endpoints: [
      {
        id: 'clients-list',
        method: 'GET',
        path: '/api/clients/',
        title: 'Listar clientes',
        description: 'Retorna os clientes cadastrados com saldo de créditos. Requer perfil administrador.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            type: 'integer',
            description: 'Número da página',
          },
          {
            name: 'page_size',
            in: 'query',
            type: 'integer',
            description: 'Itens por página',
          },
        ],
        responseExample: `[
  {
    "id": "uuid",
    "name": "Lead Media",
    "credits": "27791.938",
    "created_at": "2026-04-17T13:24:33.385843Z",
    "updated_at": "2026-05-27T19:38:09.766571Z"
  }
]`,
      },
      {
        id: 'clients-add-credit',
        method: 'POST',
        path: '/api/clients/credits/',
        title: 'Adicionar créditos ao cliente',
        description: 'Credita valor na carteira de um cliente.',
        parameters: [
          {
            name: 'client_id',
            in: 'body',
            type: 'string',
            required: true,
            description: 'ID do cliente',
          },
          {
            name: 'amount',
            in: 'body',
            type: 'number',
            required: true,
            description: 'Valor em reais',
          },
          {
            name: 'description',
            in: 'body',
            type: 'string',
            required: true,
            description: 'Motivo da movimentação',
          },
        ],
        requestExample: `{
  "client_id": "uuid",
  "amount": 500,
  "description": "Recarga mensal"
}`,
        responseExample: `{
  "message": "Créditos adicionados com sucesso"
}`,
      },
    ],
  },
]

export const ALL_ENDPOINTS = API_SECTIONS.flatMap((section) => section.endpoints)
