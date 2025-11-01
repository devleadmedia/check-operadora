import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { AlignEndHorizontal } from "lucide-react";

interface PieChartData {
  name: string;
  value: number;
}

interface BarChartData {
  [key: string]: string | number;
}

interface StatsFromAPI {
  ddd?: Record<string, number>;
  fixo?: number;
  invalid?: number;
  movel?: number;
  operadora?: Record<string, number>;
  portado?: number;
  total?: number;
  valid?: number;
  uf?: Record<string, number> | number;
  city?: Record<string, number> | number;
  ano_portabilidade?: Record<string, number>;
}

interface PhoneStatsData {
  validosInvalidos: PieChartData[];
  fixosMoveis: PieChartData[];
  portabilidadeMoveis: PieChartData[];
  portabilidadeFixos: PieChartData[];
  ufsFixos: Array<{ uf: string; quantidade: number }>;
  ddds: Array<{ ddd: string; quantidade: number }>;
  operadorasMoveis: PieChartData[];
  operadorasFixos: PieChartData[];
  anoPortabilidade: Array<{ ano: string; quantidade: number }>;
}

interface PhoneStatsModalProps {
  stats?: StatsFromAPI | object | null;
  fileName?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: BarChartData;
  }>;
}

export function Statistics({ stats, fileName }: PhoneStatsModalProps) {
  const [open, setOpen] = useState(false);

  // Processar dados da API para o formato dos gráficos
  const statsData = useMemo((): PhoneStatsData => {
    // Processar dados reais da API
    const statsTyped = stats as StatsFromAPI;

    const validosInvalidos: PieChartData[] = [
      { name: "Válidos", value: statsTyped.valid || 0 },
      { name: "Inválidos", value: statsTyped.invalid || 0 },
    ];

    const fixosMoveis: PieChartData[] = [
      { name: "Fixos", value: statsTyped.fixo || 0 },
      { name: "Móveis", value: statsTyped.movel || 0 },
    ];

    const portabilidadeMoveis: PieChartData[] = [
      { name: "Portados", value: statsTyped.portado || 0 },
      {
        name: "Não Portados",
        value: (statsTyped.movel || 0) - (statsTyped.portado || 0),
      },
    ];

    // Para fixos, assumindo que não há dados de portabilidade separados
    const portabilidadeFixos: PieChartData[] = [
      { name: "Portados", value: 0 },
      { name: "Não Portados", value: statsTyped.fixo || 0 },
    ];

    // Converter objeto ddd para array
    const ddds = statsTyped.ddd
      ? Object.entries(statsTyped.ddd)
          .map(([ddd, quantidade]) => ({ ddd, quantidade: Number(quantidade) }))
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 10)
      : [];

    // Converter objeto uf para array (apenas fixos)
    const ufsFixos =
      statsTyped.uf &&
      typeof statsTyped.uf === "object" &&
      !Array.isArray(statsTyped.uf)
        ? Object.entries(statsTyped.uf)
            .map(([uf, quantidade]) => ({ uf, quantidade: Number(quantidade) }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 10)
        : [];

    // Separar operadoras entre móveis e fixos
    const operadorasMoveis: PieChartData[] = [];
    const operadorasFixos: PieChartData[] = [];

    if (statsTyped.operadora) {
      const temMoveis = (statsTyped.movel || 0) > 0;
      const temFixos = (statsTyped.fixo || 0) > 0;

      Object.entries(statsTyped.operadora).forEach(([name, value]) => {
        const numValue = Number(value);
        if (temMoveis && !temFixos) {
          operadorasMoveis.push({ name, value: numValue });
        } else if (temFixos && !temMoveis) {
          operadorasFixos.push({ name, value: numValue });
        } else if (temMoveis) {
          // Se tem ambos, prioriza móveis
          operadorasMoveis.push({ name, value: numValue });
        }
      });
    }

    // Converter ano_portabilidade para array
    const anoPortabilidade = statsTyped.ano_portabilidade
      ? Object.entries(statsTyped.ano_portabilidade)
          .map(([ano, quantidade]) => ({ ano, quantidade: Number(quantidade) }))
          .sort((a, b) => b.ano.localeCompare(a.ano))
      : [];

    return {
      validosInvalidos,
      fixosMoveis,
      portabilidadeMoveis,
      portabilidadeFixos,
      ufsFixos,
      ddds,
      operadorasMoveis,
      operadorasFixos,
      anoPortabilidade,
    };
  }, [stats]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border-2 border-primary rounded-md shadow-lg p-3">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-foreground">
            Quantidade: {payload[0].value.toLocaleString("pt-BR")}
          </p>
        </div>
      );
    }
    return null;
  };

  // Função customizada para renderizar labels apenas quando a % for maior que 5%
  const renderCustomLabel = ({
    name,
    percent,
  }: {
    name: string;
    percent: number;
  }) => {
    const percentage = percent * 100;
    // Só mostra o label se a porcentagem for maior que 5%
    if (percentage > 1) {
      return `${name}: ${percentage.toFixed(2)}%`;
    }
    return null;
  };

  const LABEL_STYLE = {
    fill: "hsl(var(--foreground))",
    fontSize: "12px",
    fontWeight: 500,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={"outline"} size={"icon"}>
          <AlignEndHorizontal size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <DialogTitle className="text-2xl font-bold">
              Estatísticas do arquivo {fileName && `- ${fileName}`}
            </DialogTitle>
            <div className="text-sm font-normal text-muted-foreground">
              Total:{" "}
              {stats
                ? (stats as StatsFromAPI).total?.toLocaleString("pt-BR")
                : 0}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Gráfico 1: Válidos x Inválidos */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Válidos x Inválidos
            </h3>
            {statsData.validosInvalidos.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsData.validosInvalidos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                  >
                    {statsData.validosInvalidos.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 2: Fixos x Móveis */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Fixos x Móveis
            </h3>
            {statsData.fixosMoveis.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsData.fixosMoveis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                  >
                    {statsData.fixosMoveis.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 3: UFs (Somente Fixos) */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Distribuição por UF (Fixos)
            </h3>
            {statsData.ufsFixos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData.ufsFixos}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="uf" tick={LABEL_STYLE} />
                  <YAxis tick={LABEL_STYLE} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="quantidade"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 4: DDDs */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Distribuição por DDD
            </h3>
            {statsData.ddds.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData.ddds}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="ddd" tick={LABEL_STYLE} />
                  <YAxis tick={LABEL_STYLE} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="quantidade"
                    fill="hsl(var(--chart-2))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 5: Operadoras Móveis */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Operadoras (Móveis)
            </h3>
            {statsData.operadorasMoveis.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsData.operadorasMoveis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                  >
                    {statsData.operadorasMoveis.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 6: Operadoras Fixos */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Operadoras (Fixos)
            </h3>
            {statsData.operadorasFixos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsData.operadorasFixos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                  >
                    {statsData.operadorasFixos.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 7: Portabilidade Móveis */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Portabilidade (Móveis)
            </h3>
            {statsData.portabilidadeMoveis.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsData.portabilidadeMoveis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                  >
                    {statsData.portabilidadeMoveis.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 8: Portabilidade Fixos */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Portabilidade (Fixos)
            </h3>
            {statsData.portabilidadeFixos.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statsData.portabilidadeFixos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                  >
                    {statsData.portabilidadeFixos.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>

          {/* Gráfico 9: Ano de Portabilidade */}
          <div className="bg-card p-4 rounded-lg border-2 border-border md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
              Portabilidade por Ano
            </h3>
            {statsData.anoPortabilidade.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData.anoPortabilidade}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="ano" tick={LABEL_STYLE} />
                  <YAxis tick={LABEL_STYLE} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="quantidade"
                    fill="hsl(var(--chart-3))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma informação disponível
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { StatsFromAPI, PhoneStatsData, PieChartData };
