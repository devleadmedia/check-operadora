/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowDownUp,
  Building2,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  File,
  FileText,
  Loader2,
  Phone,
  Globe,
  Smartphone,
  Upload,
  XCircle,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { useState } from "react";
import { Label } from "@/components/ui/label";

import { UploadFile } from "./upload-file";
import { ConfirmedDeleteChecker } from "./confirmed-delete-checker";

import iconBrasil from "@/assets/icon-brasil.svg";
import { CheckerFile } from "@/services/checker";

import { getStatsValue, formatNumber } from "@/utils/stats-helpers";

import { Status } from "./status";
import { Statistics, StatsFromAPI } from "./statistics";
import { toast } from "sonner";

interface ICheckerDataProps {
  data: CheckerFile[];
  onViewDetails?: (item: CheckerFile) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
  status: "error" | "success" | "pending";
  queryKey?: any[];
}

export function DataTableChecker({
  data,
  status,
  onViewDetails,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  queryKey,
}: ICheckerDataProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  function bytesToMB(bytes: number): string {
    if (!bytes || bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  function isFileExpired(expiresAt: string): boolean {
    if (!expiresAt) return false;
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    return now >= expirationDate;
  }

  function countDDDs(stats: any): number {
    if (!stats || typeof stats !== "object") return 0;
    if (stats.ddd && typeof stats.ddd === "object") {
      return Object.keys(stats.ddd).length;
    }
    return 0;
  }

  function countUFs(stats: any): number {
    if (!stats || typeof stats !== "object") return 0;
    if (stats.uf && typeof stats.uf === "object") {
      return Object.keys(stats.uf).length;
    }
    return 0;
  }

  function handleDownload(fileUrl: string, fileName: string, expiresAt: string) {
    if (!fileUrl) return;
    
    if (isFileExpired(expiresAt)) {
      toast.error("O prazo para download deste arquivo expirou.");
      return;
    }
    
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
  }

  const columns: ColumnDef<CheckerFile>[] = [
    {
      accessorKey: "original_file_name",
      header: () => {
        return (
          <div className="flex items-center gap-2 w-20">
            <File size={16} className="stroke-[#8ac850]" />
            Arquivo
          </div>
        );
      },
      cell: ({ row }) => {
        const fileUrl = row.original.s3_url;
        const fileName = row.getValue("original_file_name") as string;
        const expiresAt = row.original.expires_at;
        const expired = isFileExpired(expiresAt);
        
        return (
          <div className="w-16">
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={"link"}
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(fileUrl, fileName, expiresAt)}
                    disabled={expired}
                  >
                    <p className="truncate line-clamp-2 w-20">{fileName}</p>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{expired ? "Arquivo expirado" : `Baixar ${fileName || "Arquivo"}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "file_size",
      header: () => {
        return (
          <div className="flex items-center gap-2 w-14">
            <Ruler size={16} className="stroke-[#8ac850]" />
            MB
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{bytesToMB(row.getValue("file_size"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <div className="flex items-center gap-2 w-14">
            <Calendar size={16} className="stroke-[#8ac850]" />
            Data
          </div>
        );
      },
      cell: ({ row }) => (
        <div>
          <p>
            {new Date(row.getValue("created_at")).toLocaleString("pt-BR", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: undefined,
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "upload",
      header: () => {
        return (
          <div className="flex items-center gap-2 w-20">
            <Upload size={16} className="stroke-[#8ac850]" />
            Upload
          </div>
        );
      },
      cell: () => (
        <div className="text-center">
          <p>{status === "success" ? "ok" : "erro"}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => {
        return (
          <div className="flex items-center gap-2 w-16">
            <Loader2 size={16} className="stroke-[#8ac850]" />
            Status
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const fileId = row.original.id;

        return <Status status={status} fileId={fileId} queryKey={queryKey} />;
      },
    },

    {
      accessorKey: "total",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <FileText size={16} className="stroke-[#8ac850]" />
            Total
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "total"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "invalid",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <XCircle size={16} className="stroke-red-500" />
            Inválidos
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "invalid"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "valid",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="stroke-[#8ac850]" />
            Válidos
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "valid"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "fixs",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <Phone size={16} className="stroke-[#8ac850]" />
            Fixos
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "fixo"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "moveis",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="stroke-[#8ac850]" />
            Móveis
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "movel"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "portate",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <ArrowDownUp size={16} className="stroke-[#8ac850]" />
            Portados
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "portado"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "uf",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <img src={iconBrasil} alt="Icone do Brasil" />
            UFs
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{countUFs(row.original?.stats)}</p>
        </div>
      ),
    },
    {
      accessorKey: "city",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <Building2 size={16} className="stroke-[#8ac850]" />
            Cidades
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{formatNumber(getStatsValue(row.original?.stats, "city"))}</p>
        </div>
      ),
    },
    {
      accessorKey: "ddds",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <Globe size={16} className="stroke-[#8ac850]" />
            DDDs
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <p>{countDDDs(row.original?.stats)}</p>
        </div>
      ),
    },

    {
      id: "actions",
      header: "Ações",
      enableHiding: false,
      cell: ({ row }) => {
        const expired = isFileExpired(row.original.expires_at);
        
        return (
          <div className="flex items-center justify-end gap-2">
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant={"outline"}
                    size={"icon"}
                    disabled={row.original.s3_url === ""}
                    onClick={() => onViewDetails?.(row.original)}
                  >
                    <Eye size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Detalhes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger>
                  <Statistics
                    stats={
                      row.original?.stats
                        ? (row.original.stats as StatsFromAPI)
                        : undefined
                    }
                    fileName={row.original.original_file_name}
                  />
                </TooltipTrigger>
                <TooltipContent>Estatísticas</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant={"outline"}
                    size={"icon"}
                    className="bg-[#8ac850] hover:bg-[#5e8e33] dark:bg-[#8ac850] dark:hover:bg-[#5e8e33]"
                    disabled={!row.original.s3_url || expired}
                    onClick={() =>
                      handleDownload(
                        row.original.s3_url,
                        row.original.original_file_name,
                        row.original.expires_at
                      )
                    }
                  >
                    <Download size={16} className="stroke-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {expired ? "Download expirado" : "Baixar planilha"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0.5}>
              <Tooltip>
                <TooltipTrigger>
                  <ConfirmedDeleteChecker
                    onClose={() => setOpenDeleteModal(false)}
                    onOpen={openDeleteModal}
                    setOpen={setOpenDeleteModal}
                    fileId={row.original.id}
                  />
                </TooltipTrigger>
                <TooltipContent>Excluir</TooltipContent>
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
    pageCount: Math.ceil(totalCount / pageSize),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Filtrar por arquivo..."
            value={
              (table
                .getColumn("original_file_name")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("original_file_name")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-[250px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <UploadFile />

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
                      className=""
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
          {table.getFilteredSelectedRowModel().rows.length} de {totalCount}{" "}
          linha(s) no total.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Linhas por página
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange?.(Number(value));
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50, 75, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Página {currentPage} de {Math.ceil(totalCount / pageSize) || 1}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1 || isLoading}
            >
              <span className="sr-only">Primeira página</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={
                currentPage >= Math.ceil(totalCount / pageSize) || isLoading
              }
            >
              <span className="sr-only">Próxima página</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => onPageChange?.(Math.ceil(totalCount / pageSize))}
              disabled={
                currentPage >= Math.ceil(totalCount / pageSize) || isLoading
              }
            >
              <span className="sr-only">Última página</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}