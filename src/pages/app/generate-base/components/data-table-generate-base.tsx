import {
  ArrowDownUp,
  Building2,
  CheckCircle,
  Copy,
  FileText,
  Loader2,
  Phone,
  Plus,
  RefreshCcw,
  Globe,
  Smartphone,
  Upload,
  XCircle,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPhoneNumber } from "@/utils/format-number";
import { useGenerateBaseController, PhoneData } from "../controller";
import { Controller } from "react-hook-form";

export function GenerateBaseTable() {
  const { hookForm, phoneData, hasGenerated, clearData } =
    useGenerateBaseController();
  const { control, handleSubmit, onSubmit, watch } = hookForm;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Watch tipo para habilitar/desabilitar UF e Cidades
  const tipoSelecionado = watch("type");
  const portate = watch("portate");

  // Calcular estatísticas
  const stats = {
    total: phoneData.length,
    validos: phoneData.length,
    invalidos: 0,
    fixos: phoneData.filter((d) => d.type === "Fixo").length,
    moveis: phoneData.filter((d) => d.type === "Móvel").length,
    portados: phoneData.filter((d) => d.portate).length,
    cidades: new Set(phoneData.map((d) => d.municipalityRegion)).size,
    ddds: new Set(phoneData.map((d) => d.ddd)).size,
  };

  const columns: ColumnDef<PhoneData>[] = [
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
      header: "Anatel",
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
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.getValue("portate") ? "Sim" : "Não"}</p>
        </div>
      ),
    },
    {
      accessorKey: "datePortate",
      header: "Data Portabilidade",
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.getValue("datePortate") || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "municipalityRegion",
      header: "Município de Registro",
      cell: ({ row }) => (
        <div className="capitalize">
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p className="truncate line-clamp-2 w-20">
                  {row.getValue("uf")} -{" "}
                  {row.getValue("municipalityRegion") || "-"}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {row.getValue("municipalityRegion") || "-"}
              </TooltipContent>
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
            <Button type="button" variant={"outline"} size={"icon"}>
              <RefreshCcw size={16} />
            </Button>
            <Button type="button" variant={"outline"} size={"icon"}>
              <Copy size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: phoneData,
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

  return (
    <div className="w-full space-y-4">
      {/* Formulário de Filtros em Linha */}
      <div className="w-full">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex items-end gap-2 flex-wrap">
            {/* Tipo */}
            <div className="space-y-1">
              <Label htmlFor="type" className="text-xs">
                Tipo
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="type" className="max-w-max">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixo">Fixo</SelectItem>
                      <SelectItem value="movel">Móvel</SelectItem>
                      <SelectItem value="indiferente">Indiferente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* UF */}
            <div className="space-y-1">
              <Label htmlFor="uf" className="text-xs">
                UF
              </Label>
              <Controller
                name="uf"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={tipoSelecionado !== "fixo"}
                  >
                    <SelectTrigger id="uf" className="max-w-max">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="lista">Lista</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Cidades */}
            <div className="space-y-1">
              <Label htmlFor="cidades" className="text-xs">
                Cidades
              </Label>
              <Controller
                name="citys"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={tipoSelecionado !== "fixo"}
                  >
                    <SelectTrigger id="cidades" className="max-w-max">
                      <SelectValue placeholder="Cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="lista">Lista</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* DDD */}
            <div className="space-y-1">
              <Label htmlFor="ddd" className="text-xs">
                DDD
              </Label>
              <Controller
                name="ddd"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="ddd" className="max-w-max">
                      <SelectValue placeholder="DDD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="lista">Lista</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Portados */}
            <div className="space-y-1">
              <Label htmlFor="portate" className="text-xs">
                Portados
              </Label>
              <Controller
                name="portate"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="portate" className="max-w-max">
                      <SelectValue placeholder="Portados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="não">Não</SelectItem>
                      <SelectItem value="indiferente">Indiferente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Data Portabilidade - De */}
            <div className="space-y-1">
              <Label htmlFor="date_portability_from" className="text-xs">
                Data Portado (De)
              </Label>
              <Controller
                name="date_portability_from"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    id="date_portability_from"
                    className="max-w-max"
                    {...field}
                    disabled={portate === "não"}
                  />
                )}
              />
            </div>

            {/* Data Portabilidade - Até */}
            <div className="space-y-1">
              <Label htmlFor="date_portability_to" className="text-xs">
                Data Portado (Até)
              </Label>
              <Controller
                name="date_portability_to"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    id="date_portability_to"
                    className="max-w-max"
                    {...field}
                    disabled={portate === "não"}
                  />
                )}
              />
            </div>

            {/* Operadora Origem */}
            <div className="space-y-1">
              <Label htmlFor="operator_origem" className="text-xs">
                Operadora Original
              </Label>
              <Controller
                name="operator_origem"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="operator_origem" className="max-w-max">
                      <SelectValue placeholder="Operadora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lista">Lista</SelectItem>
                      <SelectItem value="indiferente">Indiferente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Operadora Atual */}
            <div className="space-y-1">
              <Label htmlFor="operator_now" className="text-xs">
                Oper. Atual
              </Label>
              <Controller
                name="operator_now"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="operator_now" className="max-w-max">
                      <SelectValue placeholder="Operadora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lista">Lista</SelectItem>
                      <SelectItem value="indiferente">Indiferente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant={"default"}
              className="flex items-center gap-2 h-9 text-white bg-[#8ac850] hover:bg-[#8ac850] dark:bg-[#8ac850] dark:hover:bg-[#8ac850]"
            >
              <Plus size={16} />
              Gerar Base
            </Button>
            {hasGenerated && (
              <>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={clearData}
                  className="flex items-center gap-2 h-9"
                  size={"icon"}
                >
                  <Trash2 size={16} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9">
                      Colunas <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estado vazio - antes de gerar */}
      {!hasGenerated && (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma base gerada</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Selecione os filtros acima e clique em "Gerar Base" para criar uma
            base de dados de exemplo com números de telefone.
          </p>
        </div>
      )}

      {/* Estatísticas e Tabela */}
      {hasGenerated && (
        <>
          {/* Estatísticas */}
          <div className="flex h-5 items-center gap-2 flex-wrap">
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Upload size={16} className="stroke-[#8ac850]" />
                    <span className="text-sm">11</span>
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
                    <Loader2 size={16} className="stroke-[#8ac850]" />
                    <span className="text-sm">11</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" />
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <FileText size={16} className="stroke-[#8ac850]" />
                    <span className="text-sm">{stats.total}</span>
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
                    <span className="text-sm">{stats.validos}</span>
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
                    <span className="text-sm">{stats.invalidos}</span>
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
                    <span className="text-sm">{stats.fixos}</span>
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
                    <span className="text-sm">{stats.moveis}</span>
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
                    <span className="text-sm">{stats.portados}</span>
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
                    <Building2 size={16} className="stroke-[#8ac850]" />
                    <span className="text-sm">{stats.cidades}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cidades</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" />
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Globe size={16} className="stroke-[#8ac850]" />
                    <span className="text-sm">{stats.ddds}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>DDDs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Tabela */}
          <div className="w-full h-80 overflow-y-auto rounded-md border">
            <Table className="w-full border-collapse">
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

          {/* Informações de Seleção e Paginação */}
          <div className="flex items-center justify-end space-x-2 ">
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
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
                  <span className="sr-only">Ir para primeira página</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir para página anterior</span>
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir para próxima página</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir para última página</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
