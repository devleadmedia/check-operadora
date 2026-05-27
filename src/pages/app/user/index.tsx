/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditUser } from '@/pages/app/user/components/edit-user-modal'
import { CreateUser } from '@/pages/app/user/components/create-user-modal'

import { BreadCrumbRoutes } from '@/components/breadcrumb'
import { useUsers } from '@/hooks/user-users'
import { DeleteUser } from './components/delete-user-modal'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { moneyFormat } from '@/utils/money.util'
import { useAuth } from '@/contexts/auth'
import { Roles } from '@/enums/Roles.enum'
import { Badge } from '@/components/ui/badge'
import { useClients } from '@/hooks/use-clients'
import { findClientById, getCreditsByClientId } from '@/utils/client-credits.util'

export function User() {
  const { listUsers, setPage, pageSize } = useUsers()
  const { user } = useAuth()
  const { listUsersData, isLoadingListUsers } = listUsers
  const { data: clients, isLoading: isLoadingClients } = useClients()

  const currentPage = listUsersData?.page ?? 1
  const totalCount = listUsersData?.total_items ?? 10

  if (isLoadingListUsers) {
    return (
      <>
        <Loader2 size={24} className="flex items-center justify-center mx-auto animate-spin" />
      </>
    )
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <BreadCrumbRoutes />

        {user?.role === Roles.admin && <CreateUser />}
      </header>

      <Table className="mt-20">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Usuário</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Créditos</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listUsersData?.data?.map((item) => {
            const linkedClient = findClientById(item.client_id, clients)
            const clientCredits = getCreditsByClientId(item.client_id, clients)

            return (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                {isLoadingClients ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : linkedClient?.name ? (
                  linkedClient.name
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {isLoadingClients ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : clientCredits != null ? (
                  <Badge variant="default">{moneyFormat(clientCredits)}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
                <TableCell>
                  {item.role === Roles.admin
                    ? 'Administrador'
                    : item.role === Roles.manager
                      ? 'Gerente'
                      : 'Usuário'}
                </TableCell>
                <TableCell>
                  {new Date(String(item.updated_at || item.created_at)).toLocaleString('pt-BR')}
                </TableCell>

                <TableCell className="text-right flex items-center justify-end gap-4">
                  <EditUser dataUser={item} tooltip="Editar usuário" />
                  <DeleteUser dataUser={item} tooltip="Excluir" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">{totalCount} linha(s) no total.</div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Linhas por página
            </Label>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Página {currentPage} de {Math.ceil(totalCount / pageSize) || 1}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPage(1)}
              disabled={currentPage === 1 || isLoadingListUsers}
            >
              <span className="sr-only">Primeira página</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoadingListUsers}
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize) || isLoadingListUsers}
            >
              <span className="sr-only">Próxima página</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPage(Math.ceil(totalCount / pageSize))}
              disabled={currentPage >= Math.ceil(totalCount / pageSize) || isLoadingListUsers}
            >
              <span className="sr-only">Última página</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
