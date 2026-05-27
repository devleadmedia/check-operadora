import { useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { BreadCrumbRoutes } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { ALL_ENDPOINTS, API_BASE_URL, API_SECTIONS } from './api-reference.data'
import { ApiDocSidebar } from './components/api-doc-sidebar'
import { ApiEndpointPanel } from './components/api-endpoint-panel'
import { ApiIntroPanel } from './components/api-intro-panel'

export function DocumentationApi() {
  const [selectedId, setSelectedId] = useState('intro')

  const selectedEndpoint = useMemo(
    () => ALL_ENDPOINTS.find((endpoint) => endpoint.id === selectedId),
    [selectedId],
  )

  return (
    <div className="space-y-6">
      <BreadCrumbRoutes />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-72 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Navegação
            </p>
            <p className="mb-4 font-mono text-xs text-primary break-all">{API_BASE_URL}</p>
            <ApiDocSidebar
              sections={API_SECTIONS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-xl border bg-card p-6 shadow-sm lg:p-8">
          {selectedId === 'intro' || !selectedEndpoint ? (
            <ApiIntroPanel />
          ) : (
            <ApiEndpointPanel endpoint={selectedEndpoint} />
          )}

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
            <p className="text-xs text-muted-foreground">
              Documentação fictícia — inspirada na estrutura da{' '}
              <a
                href="https://www.mercadopago.com.br/developers/pt/reference"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Referência API do Mercado Pago
              </a>
              .
            </p>
            <Button type="button" variant="outline" size="sm" asChild>
              <a
                href="https://www.mercadopago.com.br/developers/pt/reference"
                target="_blank"
                rel="noreferrer"
              >
                Ver referência externa
                <ExternalLink size={14} className="ml-2" />
              </a>
            </Button>
          </footer>
        </main>
      </div>
    </div>
  )
}
