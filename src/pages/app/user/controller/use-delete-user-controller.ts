import { toast } from "sonner";
import { IUserRequest, User } from "@/services/user";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteUserController() {
  const user = new User();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutateAsync: deleteUserFn, isPending: isLoadingDeleteUser } =
    useMutation({
      mutationFn: async (dataUser: IUserRequest) => {
        if (!dataUser?.id) {
          throw new Error("ID do usuário não encontrado");
        }

        return user.delete(dataUser?.id);
      },
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["users"] });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("Usuário deletado com sucesso!");
        setIsOpen(false);
      },
      onError: async (response) => {
        if (response) {
          toast.error("Erro ao deletar o usuário!");
        }
      },
    });

  return {
    isOpen,
    setIsOpen,
    isLoadingDeleteUser,
    deleteUserFn,
  };
}
