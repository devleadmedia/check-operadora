import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import logo from "@/assets/checkoperadora.png";
import { Separator } from "./ui/separator";

export function Versions() {
  const nameLink = "Versão 1.0";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="group flex items-center gap-4 [perspective:1000px] cursor-pointer bg-transparente hover:bg-transparente"
        >
          <span
            data-hover={nameLink}
            className={`
              relative inline-block text-sm font-bold
              transition-transform duration-200 
              [transform-style:preserve-3d] [transform-origin:center_top]
              group-hover:[transform:rotateX(90deg)_translateY(-22px)]
              text-zinc-700 dark:text-white
            `}
          >
            {nameLink}
            <span
              className={`
                absolute top-full left-0 w-full h-full text-center 
                transition-colors duration-200 
                [transform:rotateX(-90deg)] [transform-origin:center_top] 
                content-[attr(data-hover)]
                text-zinc-700 dark:text-white
                group-hover:text-[#37146d] group-hover:dark:text-[#37146d]
              `}
              aria-hidden="true"
            >
              {nameLink}
            </span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="flex flex-col items-start gap-2">
          <img width={200} height={100} src={logo} alt="Logo Check Operadora" />
          <div className="flex flex-col items-start gap-1">
            <DialogTitle>Novidades</DialogTitle>
            <DialogDescription>11/07/2025.</DialogDescription>
          </div>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <div>
          <p className="text-sm">
            Aqui temos listadas as versões desta plataforma, assim como suas
            respectivas descrições de atualizações
          </p>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Versão 1.0</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <small>{new Date().toLocaleDateString("pt-BR")}</small>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                  obcaecati quos ab nemo distinctio sit tenetur ipsam quis
                  veniam excepturi recusandae perferendis in eligendi corporis
                  assumenda ipsa, porro debitis quasi.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
