import { Roles } from "@/enums/Roles.enum";
import { User } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const createUserSchema = z.object({
  name: z.string().min(3, "Campo nome deve ter no minimo 3 caracteres!"),
  email: z.email("E-mail invalido!"),
  password: z.string().min(8, "Campo senha deve ter no  minimo 8 caracteres!"),
  role: z.enum([Roles.admin, Roles.user]),
});

type createUserForm = z.infer<typeof createUserSchema>;

export function useUserController() {
  const user = new User();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutateAsync: createUserFn, isPending: isLoadingCreateUser } =
    useMutation({
      mutationFn: async (payload: createUserForm) => user.create(payload),
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["users"] });
      },
      onSuccess: async (response) => {
        if (response) {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          toast.success(response.message || "Usuário criado com sucesso!");
          setIsOpen(false);
          reset();
        }
      },
      onError: async (response) => {
        if (response) {
          toast.error(response.message || "Erro  ao criar o usuário!");
        }
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<createUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Roles.user,
    },
  });

  const nameButtonCreateNewUser = isLoadingCreateUser ? "Criando..." : "Criar";

  async function onSubmit(payload: createUserForm) {
    await createUserFn(payload);
  }

  return {
    hookForm: {
      create: {
        register,
        handleSubmit,
        errors,
        onSubmit,
        nameButtonCreateNewUser,
        watch,
        setValue,
      },
    },
    mutate: {
      create: {
        isLoadingCreateUser,
      },
    },
    isOpen,
    setIsOpen,
  };
}
