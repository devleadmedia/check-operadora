import { AlertCircle, Building2, Eye, RefreshCw } from 'lucide-react'
import { isAxiosError } from 'axios'

import { BreadCrumbRoutes } from '@/components/breadcrumb'
import { ModalRemove } from '@/components/modal-remove'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { moneyFormat } from '@/utils/money.util'
import { AddCredit } from './components/add-credit-modal'
import { ClientsTableSkeleton } from './components/clients-table-skeleton'
import { CreateClient } from './components/create-client-modal'
import { EditClient } from './components/updated-client-modal'
import { useListClientsController } from './controllers/use-list-clients-controller'
import { useRemoveClientController } from './controllers/use-remove-client-controller'
import { Badge } from '@/components/ui/badge'

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  if (error instanceof Error) return error.message
  return 'Não foi possível carregar os clientes. Tente novamente.'
}

export function Clients() {
  const { listDataClients, isLoadingClients, errorClients, refetchClients } =
    useListClientsController()
  const { removeClient, isRemovingClient, removingClientId } = useRemoveClientController()

  const clients = listDataClients ?? []
  const hasError = Boolean(errorClients)
  const isEmpty = !isLoadingClients && !hasError && clients.length === 0

  return (
    <div>
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <BreadCrumbRoutes />

        <div className="flex flex-wrap items-center gap-2">
          <CreateClient />
        </div>
      </header>

      {hasError && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="size-4" />
          <AlertTitle>Erro ao carregar clientes</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{getErrorMessage(errorClients)}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit shrink-0 border-destructive/50 bg-background hover:bg-destructive/10"
              onClick={() => refetchClients()}
            >
              <RefreshCw className="mr-2 size-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Table className="mt-8">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Nome</TableHead>
            <TableHead>Créditos</TableHead>
            <TableHead>Data criação</TableHead>
            <TableHead>Data atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        {isLoadingClients ? (
          <ClientsTableSkeleton />
        ) : isEmpty ? (
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="p-0">
                <Card className="border-0 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="mb-3 size-10 text-muted-foreground" />
                    <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ainda não há clientes cadastrados ou a busca não retornou resultados.
                    </p>
                  </CardContent>
                </Card>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-muted-foreground" />
                    <span>{client.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{moneyFormat(Number(client.credits))}</Badge>
                </TableCell>
                <TableCell>{formatDate(client.created_at)}</TableCell>
                <TableCell>{formatDate(client.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button type="button" size="icon" variant="outline" title="Detalhes">
                      <Eye size={16} />
                      <span className="sr-only">Detalhes</span>
                    </Button>
                    <AddCredit dataClient={client} tooltip="Adicionar créditos" />
                    <ModalRemove
                      title="Deletar cliente"
                      description={
                        <>
                          Tem certeza que deseja deletar <strong>{client.name}</strong>? Esta ação
                          não pode ser desfeita.
                        </>
                      }
                      onConfirm={() => removeClient(client.id)}
                      isLoading={isRemovingClient && removingClientId === client.id}
                      tooltip="Excluir"
                    />
                    <EditClient dataClient={client} tooltip="Editar cliente" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  )
}
