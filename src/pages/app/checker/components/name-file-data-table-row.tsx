import {
  ArrowDownUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  FileText,
  Loader2,
  Phone,
  Globe,
  Smartphone,
  Upload,
  XCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { formatPhoneNumber } from "@/utils/format-number";

import iconBrasil from "@/assets/icon-brasil.svg";
import { SheetRow } from "@/hooks/use-download-sheet";
import { Statistics, StatsFromAPI } from "./statistics";

interface INameFileDataProps {
  data: SheetRow[];
  stats?: StatsFromAPI | object | null;
  fileName: string;
}

export function NameFileDataTableRow({
  fileName,
  data,
  stats,
}: INameFileDataProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Extrair listas únicas para os selects
  const filterOptions = useMemo(() => {
    const ddds = Array.from(new Set(data.map(row => row.ddd).filter(Boolean))).sort();
    const ufs = Array.from(new Set(data.map(row => row.uf).filter(Boolean))).sort();
    const municipalities = Array.from(new Set(data.map(row => row.municipalityRegion).filter(Boolean))).sort();
    const operatorsOrigem = Array.from(new Set(data.map(row => row.operatorOrigem).filter(Boolean))).sort();
    const operatorsNow = Array.from(new Set(data.map(row => row.operatorNow).filter(Boolean))).sort();
    
    return {
      ddds,
      ufs,
      municipalities,
      operatorsOrigem,
      operatorsNow,
    };
  }, [data]);

  const getStatValue = (key: keyof StatsFromAPI): number => {
    if (!stats || typeof stats !== "object") return 0;

    const value = (stats as StatsFromAPI)[key];

    if (typeof value === "number") return value;

    if (typeof value === "object" && value !== null) {
      return Object.keys(value).length;
    }

    return 0;
  };

  const formatNumberValues = (value: number): string => {
    return value.toLocaleString("pt-BR");
  };

  const getDDDCount = (): number => {
    if (!stats || typeof stats !== "object") return 0;
    const statsTyped = stats as StatsFromAPI;
    if (statsTyped.ddd && typeof statsTyped.ddd === "object") {
      return Object.keys(statsTyped.ddd).length;
    }
    return 0;
  };

  const clearAllFilters = () => {
    table.resetColumnFilters();
  };

  const hasActiveFilters = columnFilters.length > 0;

  const downloadCSV = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Selecione pelo menos uma linha para baixar");
      return;
    }

    const headers = [
      "DDD",
      "Número",
      "Anatel",
      "Tipo",
      "Operadora de Origem",
      "Operadora Atual",
      "Portado",
      "Data Portabilidade",
      "UF",
      "Município de Registro",
    ];

    const csvRows = [
      headers.join(","),
      ...selectedRows.map((row) => {
        const original = row.original;
        return [
          original.ddd || "",
          original.number || "",
          original.anatel || "",
          original.type || "",
          `"${original.operatorOrigem || ""}"`,
          `"${original.operatorNow || ""}"`,
          original.portate ? "Sim" : "Não",
          original.datePortate || "",
          original.uf || "",
          `"${original.municipalityRegion || ""}"`,
        ].join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dados_selecionados_${new Date().getTime()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<SheetRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ddd",
      header: "DDD",
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.getValue("ddd") || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "number",
      header: "Número",
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{formatPhoneNumber(row.getValue("number")) || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "anatel",
      header: "Anatel ",
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.getValue("anatel") || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.getValue("type") || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "operatorOrigem",
      header: "Operadora de origem",
      cell: ({ row }) => (
        <div className="capitalize">
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p className="truncate line-clamp-2 w-20">
                  {row.getValue("operatorOrigem")}
                </p>
              </TooltipTrigger>
              <TooltipContent>{row.getValue("operatorOrigem")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: "operatorNow",
      header: "Operadora atual",
      cell: ({ row }) => (
        <div className="capitalize">
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p className="truncate line-clamp-2 w-20">
                  {row.getValue("operatorNow")}
                </p>
              </TooltipTrigger>
              <TooltipContent>{row.getValue("operatorNow")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: "portate",
      header: "Portado",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            <p>{row.getValue("portate") ? "Sim" : "Não"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "datePortate",
      header: "Data Portabilidade",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            <p>
              {row.original.datePortate === "-"
                ? "-"
                : row.original.datePortate}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "municipalityRegion",
      header: () => {
        return (
          <div className="flex items-center gap-2">Município de Registro</div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p className="truncate line-clamp-2 w-20">
                  {row.original.uf} -{" "}
                  {row.getValue("municipalityRegion") || "-"}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {row.original.uf} - {row.getValue("municipalityRegion") || "-"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: "uf",
      header: () => {
        return <div className="flex items-center gap-2">UFs</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p>{row.original.uf}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fidelidade</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: "M",
      header: () => {
        return <div className="flex items-center gap-2">M</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p>{row.original.M}</p>
              </TooltipTrigger>
              <TooltipContent>{row.original.M}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      enableHiding: false,
      cell: () => {
        return (
          <div className="flex items-center justify-end gap-2">
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant={"outline"} size={"icon"}>
                    <Copy size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (data.length === 0) {
    return (
      <div className="animate-pulse flex items-center justify-center">
        <Loader2 size={16} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full">
        <div className="w-full flex flex-col items-start justify-between gap-4 pb-1">
          {/* Filtros Avançados */}
          <div className="w-full flex flex-wrap items-end gap-3 p-4 rounded-lg">
            {/* Filtro Número */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Número</Label>
              <Input
                placeholder="Filtrar por número..."
                value={
                  (table.getColumn("number")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("number")?.setFilterValue(event.target.value)
                }
                className="w-max max-w-max"
              />
            </div>

            {/* Filtro Anatel */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">Anatel</Label>
              <Select
                value={
                  (table.getColumn("anatel")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table.getColumn("anatel")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-max max-w-max">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="válido">Válido</SelectItem>
                  <SelectItem value="inválido">Inválido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro DDD */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">DDD</Label>
              <Select
                value={
                  (table.getColumn("ddd")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table.getColumn("ddd")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-max max-w-max">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterOptions.ddds.map((ddd) => (
                    <SelectItem key={ddd} value={ddd}>
                      {ddd}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro UF */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">UF</Label>
              <Select
                value={
                  (table.getColumn("uf")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table.getColumn("uf")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-max max-w-max">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterOptions.ufs.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Município */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">Município</Label>
              <Select
                value={
                  (table.getColumn("municipalityRegion")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table.getColumn("municipalityRegion")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-max max-w-max">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterOptions.municipalities.map((municipality) => (
                    <SelectItem key={municipality} value={municipality}>
                      {municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro M (mínimo) */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">M (mínimo)</Label>
              <Input
                type="number"
                placeholder="Valor mínimo..."
                value={
                  (table.getColumn("M")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("M")?.setFilterValue(event.target.value)
                }
                className="w-max max-w-max"
              />
            </div>

            {/* Filtro Data - De */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">Data - De</Label>
              <Input
                type="date"
                value={
                  (table.getColumn("datePortate")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("datePortate")?.setFilterValue(event.target.value)
                }
                className="w-max max-w-max"
              />
            </div>

            {/* Filtro Data - Até */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">Data - Até</Label>
              <Input
                type="date"
                className="w-max max-w-max"
                placeholder="Data final..."
              />
            </div>

            {/* Filtro Operadora Origem */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">Operadora Origem</Label>
              <Select
                value={
                  (table.getColumn("operatorOrigem")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table.getColumn("operatorOrigem")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-max max-w-max">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {filterOptions.operatorsOrigem.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Operadora Atual */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium ">Op. Atual</Label>
              <Select
                value={
                  (table.getColumn("operatorNow")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table.getColumn("operatorNow")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-max max-w-max">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {filterOptions.operatorsNow.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros */}
            {hasActiveFilters && (
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-transparent">.</Label>
                <Button
                  variant="outline"
                  size="default"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-sm"
                >
                  <X size={16} />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>

          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-5 items-center gap-2">
                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Upload size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">OK</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <FileText size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("total"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <CheckCircle size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("valid"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Válidos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <XCircle size={16} className="stroke-red-500" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("invalid"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inválidos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Phone size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("fixo"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fixos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Smartphone size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("movel"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Móveis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <ArrowDownUp size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("portado"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Portados</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <img src={iconBrasil} alt="Icone do Brasil" />
                        <span className="text-xs">
                          {formatNumberValues(getStatValue("uf"))}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>UFs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" />

                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Globe size={16} className="stroke-[#8ac850]" />
                        <span className="text-xs">{getDDDCount()}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>DDDs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Statistics
                stats={stats ? (stats as StatsFromAPI) : undefined}
                fileName={fileName}
              />
              <Button
                type="button"
                variant={"outline"}
                className="flex items-center gap-2 bg-[#8ac850] hover:bg-[#5e8e33] dark:bg-[#8ac850] dark:hover:bg-[#5e8e33]"
                onClick={downloadCSV}
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              >
                <Download size={16} />
                Download Base ({table.getFilteredSelectedRowModel().rows.length}
                )
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Colunas <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanGroup())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {(() => {
                            const headerFromTable = table
                              .getHeaderGroups()
                              .flatMap((headerGroup) => headerGroup.headers)
                              .find((h) => h.column.id === column.id);

                            return column.columnDef.header && headerFromTable
                              ? flexRender(
                                  column.columnDef.header,
                                  headerFromTable.getContext()
                                )
                              : column.id;
                          })()}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`${
                          header.column.columnDef.header === "Ações" &&
                          "text-right"
                        } bg-background/95 backdrop-blur`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 75, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}