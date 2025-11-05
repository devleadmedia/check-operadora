/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checker } from "@/services/checker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFileUpload() {
  const checker = new Checker();
  const queryClient = useQueryClient();

  const {
    mutate: uploadFile,
    isPending: isUploading,
    isError,
    error,
    data,
    reset,
  } = useMutation({
    mutationFn: async ({ file }: { file: File; type: "portabilidade" }) => {
      return checker.importFile(file);
    },
    onSuccess: () => {
      toast.success("Arquivo enviado com sucesso!");
      // Invalidar a query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["get-checker"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Erro ao enviar arquivo";
      toast.error(message);
    },
  });

  return {
    uploadFile,
    isUploading,
    isError,
    error,
    data,
    reset,
  };
}
