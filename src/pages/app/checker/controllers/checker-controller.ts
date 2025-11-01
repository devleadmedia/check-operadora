import { INameFileDataTableRowProps } from "@/interfaces/name-file-data-table-row";
import { Checker, CheckerFile } from "@/services/checker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const CHECKER_QUERY_KEY = "get-checker";

export interface UseCheckerControllerParams {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UseCheckerControllerReturn {
  listCheckers: CheckerFile[];
  totalCount: number;
  totalPages: number;
  isLoadingChecker: boolean;
  currentPage: number;
  currentPageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refetch: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  dataNameFileDataTableRow: INameFileDataTableRowProps[];
  status: "error" | "success" | "pending";
  queryKey: (string | number)[];
}

export function useCheckerController(
  params: UseCheckerControllerParams = {}
): UseCheckerControllerReturn {
  const checker = new Checker();

  const [page, setPage] = useState(params.initialPage ?? 1);
  const [pageSize, setPageSize] = useState(params.initialPageSize ?? 10);

  const dataNameFileDataTableRow: INameFileDataTableRowProps[] = [
    {
      id: "1",
      ddd: "11",
      number: "11900000001",
      anatel: "valid",
      datePortate: new Date().toLocaleString("pt-BR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
      }),
      municipality: "São Paulo",
      municipalityRegion: "São Paulo",
      operatorNow: "Claro aaaaaaaaaaaaaaaaaaaa",
      operatorOrigem: "Vivo aaaaaaaaaaaaaaaaaaaa",
      portate: true,
      type: "fixos",
      uf: "SP",
    },
    {
      id: "2",
      ddd: "11",
      number: "11900000002",
      anatel: "valid",
      datePortate: new Date().toLocaleString("pt-BR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
      }),
      municipality: "São Paulo",
      municipalityRegion: "São Paulo",
      operatorNow: "Claro aaaaaaaaaaaaaaaaaaaa",
      operatorOrigem: "Vivo aaaaaaaaaaaaaaaaaaaa",
      portate: true,
      type: "fixos",
      uf: "SP",
    },
    {
      id: "3",
      ddd: "11",
      number: "11900000003",
      anatel: "valid",
      datePortate: new Date().toLocaleString("pt-BR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
      }),
      municipality: "São Paulo",
      municipalityRegion: "São Paulo",
      operatorNow: "Claro aaaaaaaaaaaaaaaaaaaa",
      operatorOrigem: "Vivo aaaaaaaaaaaaaaaaaaaa",
      portate: true,
      type: "fixos",
      uf: "SP",
    },
  ];

  const { data, isLoading, refetch, status } = useQuery({
    queryKey: [CHECKER_QUERY_KEY, page, pageSize],
    queryFn: async () =>
      checker.getAll({
        page,
        page_size: pageSize,
      }),
  });

  return {
    // Dados
    listCheckers: data?.data ?? [],
    totalCount: data?.total_items ?? 0,
    totalPages: data?.total_pages ?? 0,
    isLoadingChecker: isLoading,
    status,

    // Estado atual

    currentPage: data?.page ?? page,
    currentPageSize: data?.page_size ?? pageSize,

    // Ações
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    refetch,
    dataNameFileDataTableRow,

    // Helpers
    hasNextPage: data ? data.page < data.total_pages : false,
    hasPreviousPage: data ? data.page > 1 : false,

    queryKey: [CHECKER_QUERY_KEY, page, pageSize],
  };
}
