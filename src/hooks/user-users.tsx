import { User } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useUsers() {
  const user = new User();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: listUsersData,
    isLoading: isLoadingListUsers,
    refetch,
  } = useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: async () => user.getAll(page, pageSize),
    refetchOnWindowFocus: false,
  });

  return {
    listUsers: {
      listUsersData,
      isLoadingListUsers,
    },
    setPage,
    refetch,
    setPageSize,
    pageSize,
  };
}
