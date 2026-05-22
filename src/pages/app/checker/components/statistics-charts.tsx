import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BarChartItem, PieChartData } from './statistics-data'

const LABEL_STYLE = {
  fill: 'hsl(var(--foreground))',
  fontSize: '12px',
  fontWeight: 500,
}

const CHART_HEIGHT = 300

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    payload?: PieChartData | BarChartItem
  }>
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const item = payload[0]
  const raw = item.payload
  const label =
    item.name ??
    (raw && 'name' in raw ? String(raw.name) : undefined) ??
    (raw && 'ddd' in raw ? String(raw.ddd) : undefined) ??
    (raw && 'uf' in raw ? String(raw.uf) : undefined) ??
    (raw && 'ano' in raw ? String(raw.ano) : undefined) ??
    ''

  const quantity =
    typeof item.value === 'number'
      ? item.value
      : raw && 'quantidade' in raw
        ? Number(raw.quantidade)
        : raw && 'value' in raw
          ? Number(raw.value)
          : 0

  return (
    <div className="rounded-md border-2 border-primary bg-background p-3 shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-sm text-foreground">Quantidade: {quantity.toLocaleString('pt-BR')}</p>
    </div>
  )
}

function renderPieLabel({ name, percent }: { name: string; percent: number }) {
  const percentage = percent * 100
  if (percentage > 1) {
    return `${name}: ${percentage.toFixed(2)}%`
  }
  return null
}

function EmptyChart() {
  return (
    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
      Nenhuma informação disponível
    </div>
  )
}

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="rounded-lg border-2 border-border bg-card p-4">
      <h3 className="mb-2 text-center text-lg font-semibold text-card-foreground">{title}</h3>
      {subtitle && (
        <p className="mb-4 text-center text-sm text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </div>
  )
}

interface StatsPieChartProps {
  data: PieChartData[]
  render?: boolean
}

export function StatsPieChart({ data, render = true }: StatsPieChartProps) {
  if (!render || !data.some((d) => d.value > 0)) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderPieLabel}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface StatsBarChartProps {
  data: BarChartItem[]
  xKey: string
  color?: string
  render?: boolean
}

export function StatsBarChart({
  data,
  xKey,
  color = 'hsl(var(--chart-2))',
  render = true,
}: StatsBarChartProps) {
  if (!render || !data.length || !data.some((d) => d.quantidade > 0)) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={LABEL_STYLE} />
        <YAxis tick={LABEL_STYLE} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="quantidade" fill={color} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
