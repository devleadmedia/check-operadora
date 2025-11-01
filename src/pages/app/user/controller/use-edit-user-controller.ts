import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { IUserRequest, User } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Roles } from "@/enums/Roles.enum";

const editUserSchema = z.object({
  name: z.string(),
  email: z.string().email("E-mail invalido!"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 8,
      "Senha deve ter no mínimo 8 caracteres"
    ),
  role: z.enum([Roles.admin, Roles.user]),
});

type editUserForm = z.infer<typeof editUserSchema>;

export function useEditUserController(dataUser: IUserRequest) {
  const user = new User();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutateAsync: editUserFn, isPending: isLoadingEditUser } = useMutation(
    {
      mutationFn: async (payload: IUserRequest) => {
        const dataToSend = {
          id: dataUser.id,
          ...payload,
        };

        if (!dataToSend.password || dataToSend.password.trim() === "") {
          delete dataToSend.password;
        }

        return user.updated(dataToSend);
      },
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["users"] });
      },
      onSuccess: async (response) => {
        if (response) {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          toast.success(response.message || "Usuário editado com sucesso!");
          setIsOpen(false);
          reset();
        }
      },
      onError: async (response) => {
        if (response) {
          toast.error(response.message || "Erro  ao editar o usuário!");
        }
      },
    }
  );

  async function onSubmit(data: editUserForm) {
    await editUserFn(data);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<editUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: dataUser.name ?? "",
      email: dataUser.email ?? "",
      password: "",
      role: dataUser.role ?? Roles.user,
    },
  });

  return {
    hookForm: {
      edit: {
        register,
        handleSubmit,
        onSubmit,
        errors,
        watch,
        setValue,
      },
    },
    mutate: {
      edit: {
        isLoadingEditUser,
      },
    },
    isOpen,
    setIsOpen,
  };
}
