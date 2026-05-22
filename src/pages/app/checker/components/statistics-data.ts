export interface StatsFromAPI {
  ddd?: Record<string, number>
  ddd_fixo?: Record<string, number>
  ddd_movel?: Record<string, number>
  fixo?: number
  invalid?: number
  movel?: number
  operadora?: Record<string, number>
  operadora_fixo?: Record<string, number>
  operadora_movel?: Record<string, number>
  operadora_ganho?: Record<string, number>
  operadora_perda?: Record<string, number>
  portado?: number
  portado_fixo?: number
  portado_movel?: number
  total?: number
  valid?: number
  uf?: Record<string, number>
  uf_fixo?: Record<string, number>
  uf_movel?: Record<string, number>
  ano_portabilidade?: Record<string, number>
  ano_portabilidade_fixo?: Record<string, number>
  ano_portabilidade_movel?: Record<string, number>
  fidelidade?: Record<string, number>
}

export interface PieChartData {
  name: string
  value: number
}

export interface BarChartItem {
  quantidade: number
  [key: string]: string | number
}

export interface PhoneStatsData {
  validosInvalidos: PieChartData[]
  fixosMoveis: PieChartData[]
  portabilidadeMoveis: PieChartData[]
  portabilidadeFixos: PieChartData[]
  ufsFixos: BarChartItem[]
  ufsMoveis: BarChartItem[]
  dddsFixos: BarChartItem[]
  dddsMoveis: BarChartItem[]
  operadorasMoveis: PieChartData[]
  operadorasFixos: PieChartData[]
  operadorasDoadorasMoveis: PieChartData[]
  operadorasReceptorasMoveis: PieChartData[]
  operadorasDoadorasFixos: PieChartData[]
  operadorasReceptorasFixos: PieChartData[]
  anoPortabilidadeMoveis: BarChartItem[]
  anoPortabilidadeFixos: BarChartItem[]
  fidelidadeMoveis: PieChartData[]
  fidelidadeFixos: PieChartData[]
}

function isRecord(value: unknown): value is Record<string, number> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/** Usa dados segmentados (*_movel / *_fixo) ou o campo agregado quando a API não separa. */
export function resolveStatsRecord(
  split: Record<string, number> | undefined,
  shared: Record<string, number> | undefined,
  active: boolean
): Record<string, number> | null {
  if (!active) return null
  if (isRecord(split) && Object.keys(split).length > 0) return split
  if (isRecord(shared) && Object.keys(shared).length > 0) return shared
  return null
}

export function recordToPieData(record: Record<string, number> | null): PieChartData[] {
  if (!record) return []

  return Object.entries(record)
    .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
}

export function recordToBarData(
  record: Record<string, number> | null,
  labelKey: string
): BarChartItem[] {
  if (!record) return []

  return Object.entries(record)
    .map(([label, quantidade]) => ({
      [labelKey]: label,
      quantidade: Number(quantidade) || 0,
    }))
    .filter((item) => item.quantidade > 0)
    .sort((a, b) => b.quantidade - a.quantidade) as BarChartItem[]
}

export function groupSmallValues(data: PieChartData[]): PieChartData[] {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0 || data.length === 0) return data

  const threshold = total * 0.05
  const mainItems = data.filter((item) => item.value >= threshold)
  const smallItems = data.filter((item) => item.value < threshold)

  if (smallItems.length === 0) return data

  const othersValue = smallItems.reduce((sum, item) => sum + item.value, 0)
  const othersNames = smallItems
    .map((item) => `${item.name}: ${((item.value / total) * 100).toFixed(2)}%`)
    .join(', ')

  return [
    ...mainItems.sort((a, b) => b.value - a.value),
    { name: `Outros (${othersNames})`, value: othersValue },
  ]
}

export function limitBarData<T extends BarChartItem>(data: T[], labelKey: keyof T): T[] {
  if (data.length <= 10) return data

  const top10 = data.slice(0, 10)
  const others = data.slice(10)
  const othersSum = others.reduce((sum, item) => sum + item.quantidade, 0)

  if (othersSum > 0) {
    return [...top10, { [labelKey]: 'Outros', quantidade: othersSum } as T]
  }

  return top10
}

export function hasPieData(data: PieChartData[]): boolean {
  return data.some((item) => item.value > 0)
}

export function hasBarData(data: BarChartItem[]): boolean {
  return data.length > 0 && data.some((item) => item.quantidade > 0)
}

export function buildPhoneStatsData(stats: StatsFromAPI | object | null | undefined): PhoneStatsData {
  const s = (stats ?? {}) as StatsFromAPI
  const temMoveis = (s.movel || 0) > 0
  const temFixos = (s.fixo || 0) > 0

  const dddsMoveis = limitBarData(
    recordToBarData(
      resolveStatsRecord(s.ddd_movel, s.ddd, temMoveis),
      'ddd'
    ),
    'ddd'
  )

  const dddsFixos = limitBarData(
    recordToBarData(resolveStatsRecord(s.ddd_fixo, s.ddd, temFixos), 'ddd'),
    'ddd'
  )

  const ufsMoveis = limitBarData(
    recordToBarData(resolveStatsRecord(s.uf_movel, s.uf, temMoveis), 'uf'),
    'uf'
  )

  const ufsFixos = limitBarData(
    recordToBarData(resolveStatsRecord(s.uf_fixo, s.uf, temFixos), 'uf'),
    'uf'
  )

  const operadorasMoveis = groupSmallValues(
    recordToPieData(
      resolveStatsRecord(s.operadora_movel, s.operadora, temMoveis)
    )
  )

  const operadorasFixos = groupSmallValues(
    recordToPieData(resolveStatsRecord(s.operadora_fixo, s.operadora, temFixos))
  )

  const anoPortabilidadeMoveis = limitBarData(
    recordToBarData(
      resolveStatsRecord(s.ano_portabilidade_movel, s.ano_portabilidade, temMoveis),
      'ano'
    ).sort((a, b) => String(a.ano).localeCompare(String(b.ano))),
    'ano'
  )

  const anoPortabilidadeFixos = limitBarData(
    recordToBarData(
      resolveStatsRecord(s.ano_portabilidade_fixo, s.ano_portabilidade, temFixos),
      'ano'
    ).sort((a, b) => String(a.ano).localeCompare(String(b.ano))),
    'ano'
  )

  return {
    validosInvalidos: [
      { name: 'Válidos', value: s.valid || 0 },
      { name: 'Inválidos', value: s.invalid || 0 },
    ],
    fixosMoveis: [
      { name: 'Fixos', value: s.fixo || 0 },
      { name: 'Móveis', value: s.movel || 0 },
    ],
    portabilidadeMoveis: [
      { name: 'Portados', value: s.portado_movel ?? s.portado ?? 0 },
      {
        name: 'Não Portados',
        value: Math.max(0, (s.movel || 0) - (s.portado_movel ?? s.portado ?? 0)),
      },
    ],
    portabilidadeFixos: [
      { name: 'Portados', value: s.portado_fixo || 0 },
      {
        name: 'Não Portados',
        value: Math.max(0, (s.fixo || 0) - (s.portado_fixo || 0)),
      },
    ],
    ufsFixos,
    ufsMoveis,
    dddsFixos,
    dddsMoveis,
    operadorasMoveis,
    operadorasFixos,
    operadorasDoadorasMoveis: groupSmallValues(recordToPieData(s.operadora_perda ?? null)),
    operadorasReceptorasMoveis: groupSmallValues(recordToPieData(s.operadora_ganho ?? null)),
    operadorasDoadorasFixos: [],
    operadorasReceptorasFixos: [],
    anoPortabilidadeMoveis,
    anoPortabilidadeFixos,
    fidelidadeMoveis: groupSmallValues(
      temMoveis && s.fidelidade ? recordToPieData(s.fidelidade) : []
    ),
    fidelidadeFixos: [],
  }
}
