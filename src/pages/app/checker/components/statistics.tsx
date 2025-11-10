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
  ddd_fixo?: Record<string, number>;
  ddd_movel?: Record<string, number>;
  fixo?: number;
  invalid?: number;
  movel?: number;
  operadora?: Record<string, number>;
  operadora_ganho?: Record<string, number>;
  operadora_perda?: Record<string, number>;
  portado?: number;
  portado_fixo?: number;
  portado_movel?: number;
  total?: number;
  valid?: number;
  uf?: Record<string, number>;
  uf_fixo?: Record<string, number>;
  uf_movel?: Record<string, number>;
  ano_portabilidade?: Record<string, number>;
  ano_portabilidade_fixo?: Record<string, number>;
  ano_portabilidade_movel?: Record<string, number>;
  fidelidade?: Record<string, number>;
}

interface PhoneStatsData {
  validosInvalidos: PieChartData[];
  fixosMoveis: PieChartData[];
  portabilidadeMoveis: PieChartData[];
  portabilidadeFixos: PieChartData[];
  ufsFixos: Array<{ uf: string; quantidade: number }>;
  ufsMoveis: Array<{ uf: string; quantidade: number }>;
  dddsFixos: Array<{ ddd: string; quantidade: number }>;
  dddsMoveis: Array<{ ddd: string; quantidade: number }>;
  operadorasMoveis: PieChartData[];
  operadorasFixos: PieChartData[];
  operadorasDoadorasMoveis: PieChartData[];
  operadorasReceptorasMoveis: PieChartData[];
  operadorasDoadorasFixos: PieChartData[];
  operadorasReceptorasFixos: PieChartData[];
  anoPortabilidadeMoveis: Array<{ ano: string; quantidade: number }>;
  anoPortabilidadeFixos: Array<{ ano: string; quantidade: number }>;
  fidelidadeMoveis: PieChartData[];
  fidelidadeFixos: PieChartData[];
}

interface PhoneStatsModalProps {
  stats?: StatsFromAPI | object | null;
  fileName?: string;
  fileSize?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: BarChartData;
  }>;
}

export function Statistics({
  stats,
  fileName,
  fileSize,
}: PhoneStatsModalProps) {
  const [open, setOpen] = useState(false);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const groupSmallValues = (data: PieChartData[]): PieChartData[] => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return data;

    const threshold = total * 0.05;
    const mainItems = data.filter((item) => item.value >= threshold);
    const smallItems = data.filter((item) => item.value < threshold);

    if (smallItems.length === 0) return data;

    const othersValue = smallItems.reduce((sum, item) => sum + item.value, 0);
    const othersNames = smallItems
      .map(
        (item) => `${item.name}: ${((item.value / total) * 100).toFixed(2)}%`
      )
      .join(", ");

    return [
      ...mainItems.sort((a, b) => b.value - a.value),
      {
        name: `Outros (${othersNames})`,
        value: othersValue,
      },
    ];
  };

  const limitBarData = <T extends { quantidade: number }>(
    data: T[],
    labelKey: keyof T
  ): T[] => {
    if (data.length <= 10) return data;

    const top10 = data.slice(0, 10);
    const others = data.slice(10);
    const othersSum = others.reduce((sum, item) => sum + item.quantidade, 0);

    if (othersSum > 0) {
      return [...top10, { [labelKey]: "Outros", quantidade: othersSum } as T];
    }

    return top10;
  };

  const statsData = useMemo((): PhoneStatsData => {
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
      {
        name: "Portados",
        value: statsTyped.portado_movel || statsTyped.portado || 0,
      },
      {
        name: "Não Portados",
        value:
          (statsTyped.movel || 0) -
          (statsTyped.portado_movel || statsTyped.portado || 0),
      },
    ];

    const portabilidadeFixos: PieChartData[] = [
      { name: "Portados", value: statsTyped.portado_fixo || 0 },
      {
        name: "Não Portados",
        value: (statsTyped.fixo || 0) - (statsTyped.portado_fixo || 0),
      },
    ];

    const dddsMovelData =
      statsTyped.ddd_movel ||
      (statsTyped.movel && !statsTyped.fixo ? statsTyped.ddd : null);
    const dddsMoveis = dddsMovelData
      ? Object.entries(dddsMovelData)
          .map(([ddd, quantidade]) => ({ ddd, quantidade: Number(quantidade) }))
          .sort((a, b) => b.quantidade - a.quantidade)
      : [];

    const dddsFixoData =
      statsTyped.ddd_fixo ||
      (statsTyped.fixo && !statsTyped.movel ? statsTyped.ddd : null);
    const dddsFixos = dddsFixoData
      ? Object.entries(dddsFixoData)
          .map(([ddd, quantidade]) => ({ ddd, quantidade: Number(quantidade) }))
          .sort((a, b) => b.quantidade - a.quantidade)
      : [];

    const ufsMovelData =
      statsTyped.uf_movel ||
      (statsTyped.movel && !statsTyped.fixo ? statsTyped.uf : null);
    const ufsMoveis = ufsMovelData
      ? Object.entries(ufsMovelData)
          .map(([uf, quantidade]) => ({ uf, quantidade: Number(quantidade) }))
          .sort((a, b) => b.quantidade - a.quantidade)
      : [];

    const ufsFixoData =
      statsTyped.uf_fixo ||
      (statsTyped.fixo && !statsTyped.movel ? statsTyped.uf : null);
    const ufsFixos = ufsFixoData
      ? Object.entries(ufsFixoData)
          .map(([uf, quantidade]) => ({ uf, quantidade: Number(quantidade) }))
          .sort((a, b) => b.quantidade - a.quantidade)
      : [];

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
        } else if (temMoveis && temFixos) {
          operadorasMoveis.push({ name, value: numValue });
        }
      });
    }

    const operadorasReceptorasMoveis = statsTyped.operadora_ganho
      ? Object.entries(statsTyped.operadora_ganho)
          .map(([name, value]) => ({ name, value: Number(value) }))
          .sort((a, b) => b.value - a.value)
      : [];

    const operadorasDoadorasMoveis = statsTyped.operadora_perda
      ? Object.entries(statsTyped.operadora_perda)
          .map(([name, value]) => ({ name, value: Number(value) }))
          .sort((a, b) => b.value - a.value)
      : [];

    const operadorasReceptorasFixos: PieChartData[] = [];
    const operadorasDoadorasFixos: PieChartData[] = [];

    const anoPortabilidadeMovelData =
      statsTyped.ano_portabilidade_movel ||
      (statsTyped.movel && !statsTyped.fixo
        ? statsTyped.ano_portabilidade
        : null);
    const anoPortabilidadeMoveis = anoPortabilidadeMovelData
      ? Object.entries(anoPortabilidadeMovelData)
          .map(([ano, quantidade]) => ({ ano, quantidade: Number(quantidade) }))
          .sort((a, b) => a.ano.localeCompare(b.ano))
      : [];

    const anoPortabilidadeFixos = statsTyped.ano_portabilidade_fixo
      ? Object.entries(statsTyped.ano_portabilidade_fixo)
          .map(([ano, quantidade]) => ({ ano, quantidade: Number(quantidade) }))
          .sort((a, b) => a.ano.localeCompare(b.ano))
      : [];

    const fidelidadeMoveis =
      statsTyped.fidelidade && (statsTyped.movel || 0) > 0
        ? Object.entries(statsTyped.fidelidade).map(([name, value]) => ({
            name,
            value: Number(value),
          }))
        : [];

    const fidelidadeFixos: PieChartData[] = [];

    return {
      validosInvalidos,
      fixosMoveis,
      portabilidadeMoveis,
      portabilidadeFixos,
      ufsFixos,
      ufsMoveis,
      dddsFixos: limitBarData(dddsFixos, "ddd"),
      dddsMoveis: limitBarData(dddsMoveis, "ddd"),
      operadorasMoveis: groupSmallValues(operadorasMoveis),
      operadorasFixos: groupSmallValues(operadorasFixos),
      operadorasDoadorasMoveis: groupSmallValues(operadorasDoadorasMoveis),
      operadorasReceptorasMoveis: groupSmallValues(operadorasReceptorasMoveis),
      operadorasDoadorasFixos,
      operadorasReceptorasFixos,
      anoPortabilidadeMoveis: limitBarData(anoPortabilidadeMoveis, "ano"),
      anoPortabilidadeFixos: limitBarData(anoPortabilidadeFixos, "ano"),
      fidelidadeMoveis: groupSmallValues(fidelidadeMoveis),
      fidelidadeFixos,
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

  const renderCustomLabel = ({
    name,
    percent,
  }: {
    name: string;
    percent: number;
  }) => {
    const percentage = percent * 100;
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

  const statsTyped = stats as StatsFromAPI;
  const temMoveis = (statsTyped?.movel || 0) > 0;
  const temFixos = (statsTyped?.fixo || 0) > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={"outline"} size={"icon"}>
          <AlignEndHorizontal size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <DialogTitle className="text-2xl font-bold">
              Estatísticas do arquivo{fileName && `: ${fileName}`}
            </DialogTitle>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                Total: {statsTyped?.total?.toLocaleString("pt-BR") || 0}{" "}
                registros
              </span>
              <span>Peso: {formatFileSize(fileSize)}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Seção 1: Anatel - Válidos x Inválidos */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-2 text-center text-card-foreground">
              Anatel: Números Válidos x Inválidos
            </h3>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Total: {statsTyped?.total?.toLocaleString("pt-BR") || 0}
            </p>
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

          {/* Seção 2: Tipo - Fixos x Móveis */}
          <div className="bg-card p-4 rounded-lg border-2 border-border">
            <h3 className="text-lg font-semibold mb-2 text-center text-card-foreground">
              Tipo: Fixos x Móveis
            </h3>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Total: {statsTyped?.valid?.toLocaleString("pt-BR") || 0} (válidos)
            </p>
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

          {/* Seção 3: Divisão Móveis e Fixos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* COLUNA ESQUERDA - MÓVEIS */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">Móveis</h2>

              {/* Operadoras Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-2 text-center text-card-foreground">
                  Operadoras
                </h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Total: {statsTyped?.movel?.toLocaleString("pt-BR") || 0}
                </p>
                {temMoveis && statsData.operadorasMoveis.length > 0 ? (
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

              {/* DDDs Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-2 text-center text-card-foreground">
                  DDDs
                </h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Total: {statsTyped?.movel?.toLocaleString("pt-BR") || 0}
                </p>
                {temMoveis && statsData.dddsMoveis.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.dddsMoveis}>
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

              {/* UFs Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  UFs
                </h3>
                {temMoveis && statsData.ufsMoveis.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={limitBarData(statsData.ufsMoveis, "uf")}>
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

              {/* Portabilidade Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Portabilidade
                </h3>
                {temMoveis &&
                statsData.portabilidadeMoveis.some((d) => d.value > 0) ? (
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
                      >
                        {statsData.portabilidadeMoveis.map((_entry, index) => (
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

              {/* Ano Portabilidade Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Ano Portabilidade
                </h3>
                {temMoveis && statsData.anoPortabilidadeMoveis.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.anoPortabilidadeMoveis}>
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

              {/* Top Operadoras Doadoras Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Top Operadoras Doadoras
                </h3>
                {temMoveis && statsData.operadorasDoadorasMoveis.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.operadorasDoadorasMoveis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statsData.operadorasDoadorasMoveis.map(
                          (_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                            />
                          )
                        )}
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

              {/* Top Operadoras Receptoras Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Top Operadoras Receptoras
                </h3>
                {temMoveis &&
                statsData.operadorasReceptorasMoveis.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.operadorasReceptorasMoveis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statsData.operadorasReceptorasMoveis.map(
                          (_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                            />
                          )
                        )}
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

              {/* Fidelidade Móveis */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Fidelidade
                </h3>
                {temMoveis && statsData.fidelidadeMoveis.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.fidelidadeMoveis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statsData.fidelidadeMoveis.map((_entry, index) => (
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
            </div>

            {/* COLUNA DIREITA - FIXOS */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">Fixos</h2>

              {/* Operadoras Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-2 text-center text-card-foreground">
                  Operadoras
                </h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Total: {statsTyped?.fixo?.toLocaleString("pt-BR") || 0}
                </p>
                {temFixos && statsData.operadorasFixos.length > 0 ? (
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

              {/* DDDs Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-2 text-center text-card-foreground">
                  DDDs
                </h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Total: {statsTyped?.fixo?.toLocaleString("pt-BR") || 0}
                </p>
                {temFixos && statsData.dddsFixos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.dddsFixos}>
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

              {/* UFs Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  UFs
                </h3>
                {temFixos && statsData.ufsFixos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={limitBarData(statsData.ufsFixos, "uf")}>
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

              {/* Portabilidade Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Portabilidade
                </h3>
                {temFixos &&
                statsData.portabilidadeFixos.some((d) => d.value > 0) ? (
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
                      >
                        {statsData.portabilidadeFixos.map((_entry, index) => (
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

              {/* Ano Portabilidade Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Ano Portabilidade
                </h3>
                {temFixos && statsData.anoPortabilidadeFixos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.anoPortabilidadeFixos}>
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

              {/* Top Operadoras Doadoras Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Top Operadoras Doadoras
                </h3>
                {temFixos && statsData.operadorasDoadorasFixos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.operadorasDoadorasFixos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statsData.operadorasDoadorasFixos.map(
                          (_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                            />
                          )
                        )}
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

              {/* Top Operadoras Receptoras Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Top Operadoras Receptoras
                </h3>
                {temFixos && statsData.operadorasReceptorasFixos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.operadorasReceptorasFixos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statsData.operadorasReceptorasFixos.map(
                          (_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                            />
                          )
                        )}
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

              {/* Fidelidade Fixos */}
              <div className="bg-card p-4 rounded-lg border-2 border-border">
                <h3 className="text-lg font-semibold mb-4 text-center text-card-foreground">
                  Fidelidade
                </h3>
                {temFixos && statsData.fidelidadeFixos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.fidelidadeFixos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statsData.fidelidadeFixos.map((_entry, index) => (
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { StatsFromAPI, PhoneStatsData, PieChartData };
