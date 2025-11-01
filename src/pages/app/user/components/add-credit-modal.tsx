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
import { Loader2, Plus } from "lucide-react";
import { useAddCreditController } from "../controller/use-add-credit-controller";
import { IUser } from "@/interfaces/user/IUser.type";
import { InputMessage } from "@/components/input-message";

interface IAddCreditProps {
    dataUser: IUser;
}

export function AddCredit({ dataUser }: IAddCreditProps) {
    const { hookForm, mutate, isOpen, setIsOpen } = useAddCreditController(dataUser);
    const { isLoadingAddCredit } = mutate.addCredit;
    const { register, errors, handleSubmit, onSubmit } = hookForm.addCredit;

    const isAddingCredit = isLoadingAddCredit ? (
        <Loader2 size={16} className="animate-spin" />
    ) : (
        <Plus size={16} />
    );

    const nameButtonAddCredit = isLoadingAddCredit ? "Adicionando..." : "Adicionar créditos";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Plus size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Adicionar créditos</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid items-start gap-2">
                            <Label htmlFor="userName" className="text-start">
                                Usuário:
                            </Label>
                            <Input
                                type="text"
                                id="userName"
                                value={dataUser?.name || ""}
                                readOnly
                                className="bg-muted"
                            />
                        </div>
                        <div className="grid items-start gap-2">
                            <Label
                                htmlFor="amount"
                                className="text-start flex items-center gap-2"
                            >
                                Valor do crédito:
                                {errors.amount && <InputMessage message={errors.amount.message} />}
                            </Label>
                            <Input
                                type="number"
                                id="amount"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`${errors.amount &&
                                    "border border-red-400 placeholder:text-red-300"
                                    }`}
                                {...register("amount", {
                                    valueAsNumber: true
                                })}
                            />
                        </div>
                        <div className="grid items-start gap-2">
                            <Label
                                htmlFor="description"
                                className="text-start flex items-center gap-2"
                            >
                                Descrição:
                                {errors.description && (
                                    <InputMessage message={errors.description.message} />
                                )}
                            </Label>
                            <Input
                                type="text"
                                id="description"
                                placeholder="Descrição do crédito"
                                className={`${errors.description &&
                                    "border border-red-400 placeholder:text-red-300"
                                    }`}
                                {...register("description")}
                            />
                        </div>
                    </div>

                    <Separator />

                    <DialogFooter className="mt-4">
                        <Button
                            className="flex items-center gap-1"
                            type="submit"
                            variant={"default"}
                            disabled={isLoadingAddCredit}
                        >
                            {isAddingCredit}
                            {nameButtonAddCredit}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
