import { Building2, Edit, Loader2 } from 'lucide-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { IClients } from '@/interfaces/clients/clients'
import { useUpdatedClientController } from '../controllers/use-updated-client-controller'

interface IEditClientProps {
  dataClient: IClients
  tooltip?: string
}

export function EditClient({ dataClient, tooltip }: IEditClientProps) {
  const { hookForm, mutate, isOpen, setIsOpen } = useUpdatedClientController(dataClient)
  const { register, errors, handleSubmit, onSubmit } = hookForm.update
  const { isLoadingUpdateClient, buttonLabel } = mutate.update

  const isUpdatingClient = isLoadingUpdateClient ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <Building2 size={16} />
  )

  const triggerButton = (
    <Button type="button" size="icon" variant="outline" title="Editar">
      <Edit size={16} />
      <span className="sr-only">Editar</span>
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {tooltip ? (
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar {dataClient.name || 'cliente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid items-start gap-2">
              <Label htmlFor={`name-${dataClient.id}`} className="text-start flex items-center gap-2">
                Nome:
                {errors.name && <InputMessage message={errors.name.message} />}
              </Label>

              <Input
                id={`name-${dataClient.id}`}
                type="text"
                placeholder="Nome do cliente"
                className={errors.name ? 'border border-red-400 placeholder:text-red-300' : ''}
                disabled={isLoadingUpdateClient}
                {...register('name')}
              />
            </div>
          </div>

          <Separator />

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={isLoadingUpdateClient}
            >
              {isUpdatingClient}
              {buttonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
