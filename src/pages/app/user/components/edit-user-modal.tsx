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
import { Edit, Loader2, User2 } from "lucide-react";
import { useEditUserController } from "../controller/use-edit-user-controller";
import { IUser } from "@/interfaces/user/IUser.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "@/enums/Roles.enum";

interface IUserDataProps {
  dataUser: IUser;
}

export function EditUser({ dataUser }: IUserDataProps) {
  const { hookForm, mutate, isOpen, setIsOpen } =
    useEditUserController(dataUser);
  const { register, handleSubmit, onSubmit, watch, setValue } = hookForm.edit;
  const { isLoadingEditUser } = mutate.edit;
  const isEditingUserNameButton = isLoadingEditUser ? "Editando..." : "Salvar";
  const isEditingUserIconButton = isLoadingEditUser ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <User2 size={16} />
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar {dataUser?.name || "usuário"}:</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid col-span-2 items-start gap-2">
              <Label htmlFor="name" className="text-start">
                Nome:
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome"
                className="col-span-3"
                defaultValue={dataUser?.name ?? ""}
                {...register("name")}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="email" className="text-start">
                E-mail:
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="E-mail"
                className="col-span-3"
                defaultValue={dataUser?.email || ""}
                {...register("email")}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="password" className="text-start">
                Senha:
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Senha"
                className="col-span-3"
                {...register("password")}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="role" className="text-start">
                Tipo de Usuário:
              </Label>
              <Select
                value={watch("role")}
                onValueChange={(value) => setValue("role", value as Roles)}
              >
                <SelectTrigger>
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
              className={`flex items-center gap-2 ${isLoadingEditUser && "animate-pulse"
                }`}
              type="submit"
              disabled={isLoadingEditUser}
            >
              {isEditingUserIconButton}
              {isEditingUserNameButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
