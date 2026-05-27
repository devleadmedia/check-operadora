import { AlertCircle, BookOpen, KeyRound, Server } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { API_BASE_URL } from '../api-reference.data'
import { CodeBlock } from './code-block'

export function ApiIntroPanel() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen size={22} />
          <span className="text-sm font-semibold uppercase tracking-wide">Referência da API</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Check Operadora API</h1>
        <p className="max-w-3xl text-muted-foreground leading-relaxed">
          A API do Check Operadora permite integrar consultas de portabilidade, envio de arquivos em
          lote e gestão de créditos ao seu sistema. Esta documentação utiliza uma URL base fictícia
          enquanto a API oficial está em desenvolvimento.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Base URL
        </h2>
        <CodeBlock code={API_BASE_URL} language="url" />
      </section>

      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Ambiente de desenvolvimento</AlertTitle>
        <AlertDescription>
          Os endpoints e exemplos abaixo são referências planejadas. Contratos finais podem mudar
          antes da publicação da API.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound size={18} className="text-primary" />
              Autenticação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Todas as requisições autenticadas devem usar HTTPS e incluir o token no header{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Authorization: Bearer</code>.
            Nunca exponha suas credenciais no front-end público.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Server size={18} className="text-primary" />
              Formato
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Envie e receba dados em JSON, exceto upload de arquivos (multipart/form-data). Datas
            seguem ISO 8601 em UTC.
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Exemplo de autenticação</h2>
        <CodeBlock
          language="cURL"
          code={`curl -X POST '${API_BASE_URL}/auth/login' \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"usuario@empresa.com.br","password":"********"}'`}
        />
      </section>
    </article>
  )
}
