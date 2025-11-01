import { IStatement } from "@/interfaces/statement/IStatement.type";
import { getAllStatement } from "@/services/statement.service";
import { useQuery } from "@tanstack/react-query";

export const STATEMENT_QUERY_KEY = "get-statement";

export interface UseStatementControllerReturn {
    statements: IStatement[];
    isLoadingStatement: boolean;
    refetch: () => void;
    status: "error" | "success" | "pending";
    queryKey: string[];
}

export function useStatementController(): UseStatementControllerReturn {
    const { data, isLoading, refetch, status } = useQuery({
        queryKey: [STATEMENT_QUERY_KEY],
        queryFn: async () => getAllStatement(),
        refetchOnWindowFocus: false,
    });

    return {
        statements: data ?? [],
        isLoadingStatement: isLoading,
        refetch,
        status,
        queryKey: [STATEMENT_QUERY_KEY],
    };
}

