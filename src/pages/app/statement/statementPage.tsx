import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BreadCrumbRoutes } from '@/components/breadcrumb'
import { useStatementController } from './controller/statement-controller'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CreditMovementType } from '@/enums/CreditMovementType.enum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatementCard } from './components/statement-card'
import { StatementCardSkeleton } from './components/statement-card-skeleton'

const PAGE_SIZE = 10
const SKELETON_COUNT = 6

export function StatementPage(): JSX.Element {
  const { statements, isLoadingStatement } = useStatementController()
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [movementType, setMovementType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredStatements = useMemo(() => {
    let filtered = statements.movements

    if (searchText.trim()) {
      filtered = filtered.filter((statement) =>
        statement.description.toLowerCase().includes(searchText.toLowerCase().trim()),
      )
    }

    if (movementType !== 'all') {
      filtered = filtered.filter((statement) => statement.type === movementType)
    }

    if (startDate) {
      filtered = filtered.filter((statement) => {
        const statementDate = new Date(statement.created_at)
        return statementDate >= new Date(startDate)
      })
    }

    if (endDate) {
      filtered = filtered.filter((statement) => {
        const statementDate = new Date(statement.created_at)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return statementDate <= end
      })
    }

    return filtered
  }, [statements, searchText, startDate, endDate, movementType])

  const totalCount = filteredStatements.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, startDate, endDate, movementType])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedStatements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredStatements.slice(start, start + PAGE_SIZE)
  }, [filteredStatements, currentPage])

  return (
    <div>
      <header className="flex items-center justify-between">
        <BreadCrumbRoutes />
      </header>

      {/* Filtros */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="search-text">Pesquisar por descrição</Label>
            <Input
              id="search-text"
              placeholder="Digite para pesquisar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              disabled={isLoadingStatement}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="movement-type">Tipo de movimentação</Label>
            <Select
              value={movementType}
              onValueChange={setMovementType}
              disabled={isLoadingStatement}
            >
              <SelectTrigger id="movement-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={CreditMovementType.add}>Adição</SelectItem>
                <SelectItem value={CreditMovementType.remove}>Remoção</SelectItem>
                <SelectItem value={CreditMovementType.refund}>Reembolso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="start-date">Data inicial</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoadingStatement}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="end-date">Data final</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoadingStatement}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo / Loading / Empty */}
      {isLoadingStatement ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <StatementCardSkeleton key={idx} />
          ))}
        </div>
      ) : paginatedStatements.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum registro encontrado</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {paginatedStatements.map((statement) => (
            <StatementCard key={statement.id} statement={statement} />
          ))}
        </div>
      )}

      {/* Paginação + contador */}
      {!isLoadingStatement && totalCount > 0 && (
        <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{totalCount}</span> registro
            {totalCount !== 1 ? 's' : ''} encontrado
            {totalCount !== 1 ? 's' : ''}
            {totalCount !== statements.movements.length && (
              <span className="ml-1">
                de <span className="font-medium">{statements.movements.length}</span> total
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Primeira página</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Página anterior</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Próxima página</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Última página</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
