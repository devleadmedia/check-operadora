import { Checker } from "@/services/checker";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  error?: string;
}

interface ApiResponse {
  data?: {
    message?: string;
  };
  message?: string;
}

export function useDeleteController() {
  const checker = new Checker();

  const { mutateAsync: deleteFileFn, isPending } = useMutation<
    ApiResponse,
    ApiError,
    string
  >({
    mutationFn: (id: string) => checker.delete(id),
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.error ||
        "Não foi possível deletar o arquivo!";
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      const successMessage =
        data?.data?.message || data?.message || "Arquivo deletado com sucesso!";
      toast.success(successMessage);
    },
  });
  return { deleteFileFn, isPending };
}
