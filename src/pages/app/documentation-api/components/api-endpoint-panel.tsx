import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { API_BASE_URL } from '../api-reference.data'
import type { ApiEndpoint } from '../types'
import { CodeBlock } from './code-block'
import { MethodBadge } from './method-badge'

interface ApiEndpointPanelProps {
  endpoint: ApiEndpoint
}

function buildCurlExample(endpoint: ApiEndpoint): string {
  const url = `${API_BASE_URL}${endpoint.path.replace('{numero}', '11999999999')}`
  const hasBody = endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH'

  let curl = `curl -X ${endpoint.method} '${url}' \\
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \\
  -H 'Content-Type: application/json'`

  if (hasBody && endpoint.requestExample) {
    curl += ` \\
  -d '${endpoint.requestExample.replace(/\n/g, '').replace(/\s+/g, ' ')}'`
  }

  return curl
}

export function ApiEndpointPanel({ endpoint }: ApiEndpointPanelProps) {
  const fullPath = `${API_BASE_URL}${endpoint.path}`

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={endpoint.method} className="text-sm" />
          <code className="break-all rounded-md bg-muted px-3 py-1.5 text-sm font-mono">
            {endpoint.path}
          </code>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{endpoint.title}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground leading-relaxed">
            {endpoint.description}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          URL completa
        </h2>
        <CodeBlock code={fullPath} language="url" />
      </section>

      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Parâmetros</h2>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead>Em</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoint.parameters.map((param) => (
                  <TableRow key={`${param.name}-${param.in}`}>
                    <TableCell className="font-mono text-sm">{param.name}</TableCell>
                    <TableCell className="capitalize">{param.in}</TableCell>
                    <TableCell>{param.type}</TableCell>
                    <TableCell>{param.required ? 'Sim' : 'Não'}</TableCell>
                    <TableCell className="text-muted-foreground">{param.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Exemplo de requisição</h2>
        <CodeBlock code={buildCurlExample(endpoint)} language="cURL" />
      </section>

      {endpoint.requestExample && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Corpo da requisição</h2>
          <CodeBlock code={endpoint.requestExample} />
        </section>
      )}

      {endpoint.responseExample && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Exemplo de resposta</h2>
          <CodeBlock code={endpoint.responseExample} />
        </section>
      )}
    </article>
  )
}
