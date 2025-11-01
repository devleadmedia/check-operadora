import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSignInController } from "../controller";
import { InputMessage } from "@/components/input-message";

type LoginFormProps = {
  hookForm: ReturnType<typeof useSignInController>["hookForm"];
  signIn: ReturnType<typeof useSignInController>["signInResponse"];
} & React.ComponentPropsWithoutRef<"form">;

export function LoginForm({
  className,
  hookForm,
  signIn,
  ...props
}: LoginFormProps) {
  const { isLoading, mutate } = signIn;
  const { register, errors, handleSubmit } = hookForm;

  const isLoadingIcon = isLoading && (
    <Loader size={16} className="animate-spin" />
  );

  const isLoadingText = isLoading ? "Entrando" : "Entrar";

  return (
    <form
      onSubmit={handleSubmit(mutate)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entre na sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seu e-mail abaixo para acessar sua conta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="flex items-center gap-2">
            E-mail
            {errors.email && <InputMessage message={errors.email.message} />}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="flex items-center gap-2">
              Senha
              {errors.password && (
                <InputMessage message={errors.password.message} />
              )}
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="****"
            {...register("password")}
          />
        </div>
        <Button
          type="submit"
          className="w-full flex items-center gap-2"
          variant={"default"}
          disabled={isLoading}
        >
          {isLoadingIcon}
          {isLoadingText}
        </Button>
      </div>
    </form>
  );
}
