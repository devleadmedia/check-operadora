import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Trash } from "lucide-react";
import { useDeleteController } from "../controllers/delete-controller";
import { toast } from "sonner";

interface IFileId {
  fileId: string;
  onOpen: boolean;
  onClose: () => void;
  setOpen: (value: boolean) => void;
}

export function ConfirmedDeleteChecker({
  fileId,
  onClose,
  onOpen,
  setOpen,
}: IFileId) {
  const { deleteFileFn, isPending } = useDeleteController();

  async function handleDeleteFile(userId: string | undefined) {
    if (!userId) {
      toast.error("Arquivo não encontrado!");
      return;
    }

    await deleteFileFn(userId);
    onClose();
  }

  const isLoadingIcon = isPending && (
    <Loader size={16} className="animate-spin" />
  );
  const isLoadingText = isPending ? "Confirmando" : "Confirmar";

  return (
    <Dialog open={onOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"} onClick={() => setOpen(true)}>
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deletar arquivo</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja excluir o arquivo?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => handleDeleteFile(fileId)}
            disabled={isPending}
          >
            {isLoadingIcon}
            {isLoadingText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
