import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BreadCrumbRoutes } from "@/components/breadcrumb";
import { useStatementController } from "./controller/statement-controller";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditMovementType } from "@/enums/CreditMovementType.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatementCard } from "./components/statement-card";

export function StatementPage(): JSX.Element {
  const { statements, isLoadingStatement } = useStatementController();
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [movementType, setMovementType] = useState<string>("all");

  const filteredStatements = useMemo(() => {
    let filtered = [...statements];

    // Filtro por texto (busca em description)
    if (searchText.trim()) {
      filtered = filtered.filter((statement) =>
        statement.description
          .toLowerCase()
          .includes(searchText.toLowerCase().trim())
      );
    }

    // Filtro por tipo de movimentação
    if (movementType !== "all") {
      filtered = filtered.filter(
        (statement) => statement.type === movementType
      );
    }

    // Filtro por range de datas
    if (startDate) {
      filtered = filtered.filter((statement) => {
        const statementDate = new Date(statement.created_at);
        return statementDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter((statement) => {
        const statementDate = new Date(statement.created_at);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Inclui o dia inteiro
        return statementDate <= end;
      });
    }

    return filtered;
  }, [statements, searchText, startDate, endDate, movementType]);


  if (isLoadingStatement) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <BreadCrumbRoutes />
      </header>

      {/* Filtros */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Campo de pesquisa por texto */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="search-text">Pesquisar por descrição</Label>
            <Input
              id="search-text"
              placeholder="Digite para pesquisar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Select de tipo de movimentação */}
          <div className="space-y-1">
            <Label htmlFor="movement-type">Tipo de movimentação</Label>
            <Select value={movementType} onValueChange={setMovementType}>
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

          {/* Campo de data inicial */}
          <div className="space-y-1">
            <Label htmlFor="start-date">Data inicial</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Campo de data final */}
          <div className="space-y-1">
            <Label htmlFor="end-date">Data final</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      {filteredStatements.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum registro encontrado
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filteredStatements.map((statement) => (
            <StatementCard key={statement.id} statement={statement} />
          ))}
        </div>
      )}

      {/* Contador de registros */}
      {filteredStatements.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredStatements.length}
            </span>{" "}
            registro{filteredStatements.length !== 1 ? "s" : ""} encontrado
            {filteredStatements.length !== 1 ? "s" : ""}
            {filteredStatements.length !== statements.length && (
              <span className="ml-1">
                de <span className="font-medium">{statements.length}</span>{" "}
                total
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
