import { ReactNode, useState } from 'react'
import { Loader2, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

export interface ModalRemoveProps {
  /** Título do modal (ex.: "Deletar cliente") */
  title: string
  /** Texto ou conteúdo da confirmação */
  description?: ReactNode
  /** Ação executada ao confirmar (pode ser async) */
  onConfirm: () => void | Promise<void>
  /** Estado de loading externo (ex.: mutation.isPending) */
  isLoading?: boolean
  /** Controle externo de abertura */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Elemento que abre o modal (botão, ícone, etc.) */
  trigger?: ReactNode
  /** Tooltip no trigger */
  tooltip?: string
  confirmLabel?: string
  cancelLabel?: string
  loadingLabel?: string
  /** Fecha o modal após onConfirm resolver com sucesso (padrão: true) */
  closeOnSuccess?: boolean
  disabled?: boolean
  className?: string
}

export function ModalRemove({
  title,
  description = 'Esta ação não pode ser desfeita.',
  onConfirm,
  isLoading: isLoadingExternal,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  tooltip,
  confirmLabel = 'Deletar',
  cancelLabel = 'Cancelar',
  loadingLabel = 'Deletando...',
  closeOnSuccess = true,
  disabled = false,
  className,
}: ModalRemoveProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const isLoading = isLoadingExternal ?? internalLoading

  async function handleConfirm() {
    try {
      if (isLoadingExternal === undefined) {
        setInternalLoading(true)
      }
      await onConfirm()
      if (closeOnSuccess) {
        setOpen(false)
      }
    } catch {
      // Mantém o modal aberto; erros devem ser tratados em onConfirm (toast, etc.)
    } finally {
      if (isLoadingExternal === undefined) {
        setInternalLoading(false)
      }
    }
  }

  const defaultTrigger = (
    <Button type="button" variant="outline" size="icon" disabled={disabled || isLoading}>
      <Trash size={16} />
      <span className="sr-only">{confirmLabel}</span>
    </Button>
  )

  const triggerElement = trigger ?? defaultTrigger

  const showTrigger = trigger != null || controlledOpen === undefined

  const dialogTrigger = (
    <DialogTrigger asChild disabled={disabled || isLoading}>
      {triggerElement}
    </DialogTrigger>
  )

  const wrappedTrigger = tooltip ? (
    <TooltipProvider delayDuration={0.5}>
      <Tooltip>
        <TooltipTrigger asChild>{dialogTrigger}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    dialogTrigger
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger ? wrappedTrigger : null}

      <DialogContent className={className ?? 'sm:max-w-[500px]'}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Separator />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || disabled}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash size={16} />}
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
