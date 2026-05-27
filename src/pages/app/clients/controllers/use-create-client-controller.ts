import { create } from '@/services/client.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Campo nome deve ter no mínimo 3 caracteres!')
    .max(120, 'Campo nome deve ter no máximo 120 caracteres!'),
})

type CreateClientForm = z.infer<typeof createClientSchema>

interface ICreateClientResponse {
  message?: string
}

export function useCreateClientController() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateClientForm>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: '',
    },
  })

  const { mutateAsync: createClientFn, isPending: isLoadingCreateClient } = useMutation({
    mutationFn: async (payload: CreateClientForm) => create(payload.name),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['clients'] })
    },
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      const data = response as ICreateClientResponse | undefined
      toast.success(data?.message || 'Cliente criado com sucesso!')
      setIsOpen(false)
      reset()
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar cliente. Tente novamente.'
      toast.error(message)
    },
  })

  async function onSubmit(payload: CreateClientForm) {
    await createClientFn(payload)
  }

  const buttonLabel = isLoadingCreateClient ? 'Criando...' : 'Criar cliente'

  return {
    hookForm: {
      create: {
        register,
        handleSubmit,
        errors,
        onSubmit,
      },
    },
    mutate: {
      create: {
        isLoadingCreateClient,
        buttonLabel,
      },
    },
    isOpen,
    setIsOpen,
  }
}
