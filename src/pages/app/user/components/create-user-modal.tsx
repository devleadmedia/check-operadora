import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, UserPlus } from "lucide-react";
import { useUserController } from "../controller/use-create-user-controller";
import { InputMessage } from "@/components/input-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "@/enums/Roles.enum";

export function CreateUser() {
  const { hookForm, mutate, isOpen, setIsOpen } = useUserController();
  const { isLoadingCreateUser } = mutate.create;
  const { register, errors, handleSubmit, onSubmit, nameButtonCreateNewUser, watch, setValue } =
    hookForm.create;

  const isCreatingUser = isLoadingCreateUser ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <User size={16} />
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus size={16} />
          Novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar novo usuário:</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid col-span-2 items-start gap-2">
              <Label
                htmlFor="name"
                className="text-start flex items-center gap-2"
              >
                Nome:
                {errors.name && <InputMessage message={errors.name.message} />}
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome"
                className={`col-span-3 ${errors.name &&
                  "border border-red-400 placeholder:text-red-300"
                  }`}
                {...register("name")}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label
                htmlFor="email"
                className="text-start flex items-center gap-2"
              >
                E-mail:
                {errors.email && (
                  <InputMessage message={errors.email.message} />
                )}
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="E-mail"
                className={`col-span-3 ${errors.email &&
                  "border border-red-400 placeholder:text-red-300"
                  }`}
                {...register("email")}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label
                htmlFor="password"
                className="text-start flex items-center gap-2"
              >
                Senha:
                {errors.password && (
                  <InputMessage message={errors.password.message} />
                )}
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Senha"
                className={`col-span-3 ${errors.password &&
                  "border border-red-400 placeholder:text-red-300"
                  }`}
                {...register("password")}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label
                htmlFor="role"
                className="text-start flex items-center gap-2"
              >
                Tipo de Usuário:
                {errors.role && (
                  <InputMessage message={errors.role.message} />
                )}
              </Label>
              <Select
                value={watch("role")}
                onValueChange={(value) => setValue("role", value as Roles)}
              >
                <SelectTrigger
                  className={errors.role ? "border border-red-400" : ""}
                >
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Roles.user}>Usuário</SelectItem>
                  <SelectItem value={Roles.admin}>Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <DialogFooter className="mt-4">
            <Button
              className="flex items-center gap-1"
              type="submit"
              variant={"default"}
              disabled={isLoadingCreateUser}
            >
              {isCreatingUser}
              {nameButtonCreateNewUser}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
