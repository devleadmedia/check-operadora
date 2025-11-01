import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2, Trash } from "lucide-react"; 
import { useDeleteUserController } from "../controller/use-delete-user-controller";
import { IUser } from "@/interfaces/user/IUser.type";

interface IDeleteUser {
  dataUser: IUser;
}

export function DeleteUser({ dataUser }: IDeleteUser) {
  const { deleteUserFn, isLoadingDeleteUser, isOpen, setIsOpen } =
    useDeleteUserController();

  async function handleDeleteUser() {
    await deleteUserFn(dataUser);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deletar usuário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar <strong>{dataUser.name}</strong>?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoadingDeleteUser}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={isLoadingDeleteUser}
            className="flex items-center gap-2"
          >
            {isLoadingDeleteUser ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash size={16} />
            )}
            {isLoadingDeleteUser ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
