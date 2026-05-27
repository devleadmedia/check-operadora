import { IClients } from '@/interfaces/clients/clients'
import { updated } from '@/services/client.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const updateClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Campo nome deve ter no mínimo 3 caracteres!')
    .max(120, 'Campo nome deve ter no máximo 120 caracteres!'),
})

type UpdateClientForm = z.infer<typeof updateClientSchema>

interface IUpdateClientResponse {
  message?: string
}

export function useUpdatedClientController(dataClient: IClients) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateClientForm>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: dataClient.name ?? '',
    },
  })

  const { mutateAsync: updateClientFn, isPending: isLoadingUpdateClient } = useMutation({
    mutationFn: async (payload: UpdateClientForm) =>
      updated({
        name: payload.name,
        client_id: dataClient.id,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['clients'] })
    },
    onSuccess: async (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      const data = response as IUpdateClientResponse | undefined
      toast.success(data?.message || 'Cliente atualizado com sucesso!')
      setIsOpen(false)
      reset({ name: variables.name })
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar cliente. Tente novamente.'
      toast.error(message)
    },
  })

  async function onSubmit(payload: UpdateClientForm) {
    await updateClientFn(payload)
  }

  const buttonLabel = isLoadingUpdateClient ? 'Salvando...' : 'Salvar'

  return {
    hookForm: {
      update: {
        register,
        handleSubmit,
        errors,
        onSubmit,
      },
    },
    mutate: {
      update: {
        isLoadingUpdateClient,
        buttonLabel,
      },
    },
    isOpen,
    setIsOpen,
  }
}
