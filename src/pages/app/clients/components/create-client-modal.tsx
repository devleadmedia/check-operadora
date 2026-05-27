import { Building2, Loader2, Plus } from 'lucide-react'

import { InputMessage } from '@/components/input-message'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCreateClientController } from '../controllers/use-create-client-controller'

export function CreateClient() {
  const { hookForm, mutate, isOpen, setIsOpen } = useCreateClientController()
  const { register, errors, handleSubmit, onSubmit } = hookForm.create
  const { isLoadingCreateClient, buttonLabel } = mutate.create

  const isCreatingClient = isLoadingCreateClient ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <Building2 size={16} />
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="gap-2" disabled={isLoadingCreateClient}>
          <Plus size={16} />
          Criar novo cliente
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar novo cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid items-start gap-2">
              <Label htmlFor="name" className="text-start flex items-center gap-2">
                Nome:
                {errors.name && <InputMessage message={errors.name.message} />}
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Nome do cliente"
                className={errors.name ? 'border border-red-400 placeholder:text-red-300' : ''}
                disabled={isLoadingCreateClient}
                {...register('name')}
              />
            </div>
          </div>

          <Separator />

          <DialogFooter className="mt-4">
            <Button type="submit" className="flex items-center gap-2" disabled={isLoadingCreateClient}>
              {isCreatingClient}
              {buttonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
