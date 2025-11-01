import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Login } from "@/services/login";

const signInSchema = z.object({
  email: z.string().min(1, "Preencha esse campo.").email("E-mail inválido."),
  password: z.string().min(8, "Campo senha deve ter no mínimo 8 caracteres."),
});

type signInForm = z.infer<typeof signInSchema>;

export function useSignInController() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<signInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const login = new Login();

  const {
    data,
    mutateAsync: signInFn,
    isPending: isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (payload: signInForm) => {
      const response = await login.signIn(payload);

      return response;
    },
    onSuccess: async (response) => {
      if (response) {
        localStorage.setItem(
          "@check_operadora:user",
          JSON.stringify(response.user)
        );
        localStorage.setItem("@check_operadora:token", response.access_token);
        localStorage.setItem(
          "@check_operadora:refresh_token",
          response.refresh_token
        );

        toast.success("Login efetuado com sucesso!");

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 3000);
      }
    },
    onError: async (response) => {
      if (response) {
        toast.error(response.message || "Credênciais invalidas!");
        reset();
      }
    },
  });

  async function onSubmit(payload: signInForm) {
    await signInFn(payload);
  }

  return {
    hookForm: {
      register,
      handleSubmit,
      errors,
    },
    signInResponse: {
      mutate: onSubmit,
      isLoading,
      isSuccess,
      data,
    },
  };
}
