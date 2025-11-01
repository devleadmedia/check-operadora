import {
  ArrowDownUp,
  Building2,
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
import { useState } from "react";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { formatPhoneNumber } from "@/utils/format-number";
import { INameFileDataTableRowProps } from "@/interfaces/name-file-data-table-row";

import iconBrasil from "@/assets/icon-brasil.svg";

interface INameFileDataProps {
  data: INameFileDataTableRowProps[];
}

export function DataTableApi({ data }: INameFileDataProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<INameFileDataTableRowProps>[] = [
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
      accessorKey: "dateAndHour",
      header: "Data/Hora",
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.getValue("dateAndHour") || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "origen",
      header: "Origem",
      cell: ({ row }) => (
        <div>
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger>
                <p className="truncate line-clamp-2 w-20">
                  {row.getValue("origen")}
                </p>
              </TooltipTrigger>
              <TooltipContent>{row.getValue("origen")}</TooltipContent>
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

  return (
    <div>
      <div className="w-full">
        <div className="w-full flex flex-col items-start justify-between gap-2 py-4">
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filtrar por número..."
                value={
                  (table.getColumn("number")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("number")?.setFilterValue(event.target.value)
                }
                className="w-[200px]"
              />

              <div className="flex h-5 items-center gap-2">
                <TooltipProvider delayDuration={0.5}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Upload size={16} className="stroke-green-500" />
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
                        <Loader2 size={16} className="stroke-green-500" />
                        <span className="text-xs">14</span>
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
                        <FileText size={16} className="stroke-green-500" />
                        <span className="text-xs">142</span>
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
                        <CheckCircle size={16} className="stroke-green-500" />
                        <span className="text-xs">22</span>
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
                        <span className="text-xs">10</span>
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
                        <Phone size={16} className="stroke-green-500" />
                        <span className="text-xs">92</span>
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
                        <Smartphone size={16} className="stroke-green-500" />
                        <span className="text-xs">10</span>
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
                        <ArrowDownUp size={16} className="stroke-green-500" />
                        <span className="text-xs">162</span>
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
                        <span className="text-xs">162</span>
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
                        <Building2 size={16} className="stroke-green-500" />
                        <span className="text-xs">162</span>
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
                        <Globe size={16} className="stroke-green-500" />
                        <span className="text-xs">162</span>
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
              <Button
                type="button"
                variant={"outline"}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download Base
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
                  {[10, 20, 30, 40, 50].map((pageSize) => (
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
