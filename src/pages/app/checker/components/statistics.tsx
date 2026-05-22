import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlignEndHorizontal } from 'lucide-react'

import { buildPhoneStatsData, type StatsFromAPI } from './statistics-data'
import { ChartCard, StatsBarChart, StatsPieChart } from './statistics-charts'

export type { StatsFromAPI, PieChartData, PhoneStatsData } from './statistics-data'

interface PhoneStatsModalProps {
  stats?: StatsFromAPI | object | null
  fileName?: string
  fileSize?: number
}

function formatFileSize(bytes?: number): string {
  const size = Number(bytes)
  if (!size || Number.isNaN(size)) return '—'
  const mb = size / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

export function Statistics({ stats, fileName, fileSize }: PhoneStatsModalProps) {
  const [open, setOpen] = useState(false)

  const statsTyped = stats as StatsFromAPI
  const statsData = useMemo(() => buildPhoneStatsData(stats), [stats])

  const temMoveis = (statsTyped?.movel || 0) > 0
  const temFixos = (statsTyped?.fixo || 0) > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={'outline'} size={'icon'}>
          <AlignEndHorizontal size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-7xl overflow-y-auto">
        <DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <DialogTitle className="text-2xl font-bold">
              Estatísticas do arquivo{fileName && `: ${fileName}`}
            </DialogTitle>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Total: {statsTyped?.total?.toLocaleString('pt-BR') || 0} registros</span>
              <span>Peso: {formatFileSize(fileSize)}</span>
            </div>
          </div>
        </DialogHeader>

        {open && (
          <div className="mt-4 space-y-6">
            <ChartCard
              title="Anatel: Números Válidos x Inválidos"
              subtitle={`Total: ${statsTyped?.total?.toLocaleString('pt-BR') || 0}`}
            >
              <StatsPieChart data={statsData.validosInvalidos} />
            </ChartCard>

            <ChartCard
              title="Tipo: Fixos x Móveis"
              subtitle={`Total: ${statsTyped?.valid?.toLocaleString('pt-BR') || 0} (válidos)`}
            >
              <StatsPieChart data={statsData.fixosMoveis} />
            </ChartCard>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Móveis */}
              <div className="space-y-6">
                <h2 className="text-center text-xl font-bold">Móveis</h2>

                <ChartCard
                  title="Operadoras"
                  subtitle={`Total: ${statsTyped?.movel?.toLocaleString('pt-BR') || 0}`}
                >
                  <StatsPieChart data={statsData.operadorasMoveis} render={temMoveis} />
                </ChartCard>

                <ChartCard
                  title="DDDs"
                  subtitle={`Total: ${statsTyped?.movel?.toLocaleString('pt-BR') || 0}`}
                >
                  <StatsBarChart data={statsData.dddsMoveis} xKey="ddd" render={temMoveis} />
                </ChartCard>

                <ChartCard title="UFs">
                  <StatsBarChart
                    data={statsData.ufsMoveis}
                    xKey="uf"
                    color="hsl(var(--chart-1))"
                    render={temMoveis}
                  />
                </ChartCard>

                <ChartCard title="Portabilidade">
                  <StatsPieChart data={statsData.portabilidadeMoveis} render={temMoveis} />
                </ChartCard>

                <ChartCard title="Ano Portabilidade">
                  <StatsBarChart
                    data={statsData.anoPortabilidadeMoveis}
                    xKey="ano"
                    color="hsl(var(--chart-3))"
                    render={temMoveis}
                  />
                </ChartCard>

                <ChartCard title="Top Operadoras Doadoras">
                  <StatsPieChart data={statsData.operadorasDoadorasMoveis} render={temMoveis} />
                </ChartCard>

                <ChartCard title="Top Operadoras Receptoras">
                  <StatsPieChart data={statsData.operadorasReceptorasMoveis} render={temMoveis} />
                </ChartCard>

                <ChartCard title="Fidelidade">
                  <StatsPieChart data={statsData.fidelidadeMoveis} render={temMoveis} />
                </ChartCard>
              </div>

              {/* Fixos */}
              <div className="space-y-6">
                <h2 className="text-center text-xl font-bold">Fixos</h2>

                <ChartCard
                  title="Operadoras"
                  subtitle={`Total: ${statsTyped?.fixo?.toLocaleString('pt-BR') || 0}`}
                >
                  <StatsPieChart data={statsData.operadorasFixos} render={temFixos} />
                </ChartCard>

                <ChartCard
                  title="DDDs"
                  subtitle={`Total: ${statsTyped?.fixo?.toLocaleString('pt-BR') || 0}`}
                >
                  <StatsBarChart data={statsData.dddsFixos} xKey="ddd" render={temFixos} />
                </ChartCard>

                <ChartCard title="UFs">
                  <StatsBarChart
                    data={statsData.ufsFixos}
                    xKey="uf"
                    color="hsl(var(--chart-1))"
                    render={temFixos}
                  />
                </ChartCard>

                <ChartCard title="Portabilidade">
                  <StatsPieChart data={statsData.portabilidadeFixos} render={temFixos} />
                </ChartCard>

                <ChartCard title="Ano Portabilidade">
                  <StatsBarChart
                    data={statsData.anoPortabilidadeFixos}
                    xKey="ano"
                    color="hsl(var(--chart-3))"
                    render={temFixos}
                  />
                </ChartCard>

                <ChartCard title="Top Operadoras Doadoras">
                  <StatsPieChart data={statsData.operadorasDoadorasFixos} render={temFixos} />
                </ChartCard>

                <ChartCard title="Top Operadoras Receptoras">
                  <StatsPieChart data={statsData.operadorasReceptorasFixos} render={temFixos} />
                </ChartCard>

                <ChartCard title="Fidelidade">
                  <StatsPieChart data={statsData.fidelidadeFixos} render={temFixos} />
                </ChartCard>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
