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
import { CircleAlert } from "lucide-react";

export function ShowBulksQuery() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className="flex items-center gap-2"
          >
            <CircleAlert size={16} className="stroke-orange-500" />
            Mostrar informações
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Consulta em massa</DialogTitle>
            <DialogDescription>Siga as informações abaixo:</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/50 p-3 mb-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Clique no botão "Nova Planilha" e faça o upload do arquivo com
                  os números que você deseja checar.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  A plataforma aceita arquivos em XLSX, TXT, XLS e CSV
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  A coluna deve ter o título "Número" ou "Telefone" na linha 1
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Outras colunas serão ignoradas, apenas a primeira com o título
                  correto será processada
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Se estiver com dúvidas, baixe o arquivo de exemplo</span>
              </li>
            </ul>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
