import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { BreadCrumbRoutes } from '@/components/breadcrumb'

import { CreditMovementType } from '@/enums/CreditMovementType.enum'
import { useCredits } from '@/hooks/use-credits'
import { useStatementController } from '@/pages/app/statement/controller/statement-controller'
import { IStatementMovement } from '@/interfaces/statement/IStatement.type'
import { moneyFormat } from '@/utils/money.util'

const HISTORY_LIMIT = 5

function isIncome(movement: IStatementMovement): boolean {
  return movement.type === CreditMovementType.add || movement.type === CreditMovementType.refund
}

function formatRelativeDate(value: string): string {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (isSameDay(date, today)) return `Hoje, ${time}`
  if (isSameDay(date, yesterday)) return `Ontem, ${time}`

  const day = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
  return `${day}, ${time}`
}

export function MyCredits() {
  const navigate = useNavigate()
  const { credits, isLoading: isLoadingCredits } = useCredits()
  const { statements, isLoadingStatement } = useStatementController()

  const sortedMovements = useMemo(() => {
    return [...statements.movements].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  }, [statements.movements])

  const lastSpent = useMemo(
    () => sortedMovements.find((m) => m.type === CreditMovementType.remove) ?? null,
    [sortedMovements],
  )

  const lastIncome = useMemo(
    () => sortedMovements.find((m) => isIncome(m)) ?? null,
    [sortedMovements],
  )

  const recentMovements = useMemo(() => sortedMovements.slice(0, HISTORY_LIMIT), [sortedMovements])

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <BreadCrumbRoutes />
      </header>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Minha carteira
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Créditos</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Saldo disponível */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wallet className="size-4" />
              Saldo disponível
            </CardTitle>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
            >
              Ativo
            </Badge>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-6">
            <div>
              {isLoadingCredits ? (
                <>
                  <Skeleton className="h-12 w-40" />
                  <Skeleton className="mt-2 h-4 w-16" />
                </>
              ) : (
                <>
                  <p className="text-5xl font-bold tracking-tight">{moneyFormat(credits)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">créditos</p>
                </>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="size-4 text-red-500" />
                  Último gasto
                </div>
                {isLoadingStatement ? (
                  <Skeleton className="h-5 w-28" />
                ) : lastSpent ? (
                  <>
                    <p className="text-base font-semibold text-red-500">
                      -{moneyFormat(lastSpent.amount / 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(lastSpent.created_at)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem registros</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="size-4 text-emerald-500" />
                  Última entrada
                </div>
                {isLoadingStatement ? (
                  <Skeleton className="h-5 w-28" />
                ) : lastIncome ? (
                  <>
                    <p className="text-base font-semibold text-emerald-500">
                      +{moneyFormat(lastIncome.amount / 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(lastIncome.created_at)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem registros</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full gap-2" size="lg" onClick={() => navigate('/usuarios')}>
              <Plus className="size-4" />
              Adicionar créditos
            </Button>
          </CardFooter>
        </Card>

        {/* Histórico */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <History className="size-4" />
              Histórico
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => navigate('/extrato')}
            >
              Ver tudo
            </Button>
          </CardHeader>

          <CardContent className="flex-1">
            {isLoadingStatement ? (
              <ul className="divide-y divide-border">
                {Array.from({ length: HISTORY_LIMIT }).map((_, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </li>
                ))}
              </ul>
            ) : recentMovements.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Nenhuma movimentação encontrada</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentMovements.map((movement) => {
                  const incoming = isIncome(movement)
                  const Icon = incoming ? ArrowDownLeft : ArrowUpRight
                  const accent = incoming ? 'text-emerald-500' : 'text-red-500'

                  return (
                    <li
                      key={movement.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-muted ${accent}`}
                      >
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{movement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeDate(movement.created_at)}
                        </p>
                      </div>

                      <span className={`whitespace-nowrap text-sm font-semibold ${accent}`}>
                        {incoming ? '+' : '-'}
                        {moneyFormat(movement.amount / 100)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
