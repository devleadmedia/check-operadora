import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { IAddCredit, IClients } from '@/interfaces/clients/clients'
import { addCredit } from '@/services/client.service'

const addCreditSchema = z.object({
  client_id: z.string(),
  amount: z.number().min(0.01, 'O valor deve ser maior que zero!'),
  description: z.string().min(3, 'A descrição deve ter no mínimo 3 caracteres!'),
})

type addCreditForm = z.infer<typeof addCreditSchema>

export function useAddCreditController(dataClient: IClients) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { mutateAsync: addCreditFn, isPending: isLoadingAddCredit } = useMutation({
    mutationFn: async ({ client_id, amount, description }: IAddCredit) =>
      addCredit({ client_id, amount, description }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Créditos adicionados com sucesso!')
      setIsOpen(false)
      reset()
    },
    onError: async (response) => {
      if (response) toast.error('Erro ao adicionar créditos ao usuário!')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addCreditForm>({
    resolver: zodResolver(addCreditSchema),
    defaultValues: {
      amount: undefined,
      description: '',
    },
  })

  async function onSubmit(data: addCreditForm) {
    await addCreditFn(data)
  }

  return {
    hookForm: {
      addCredit: {
        register,
        handleSubmit,
        onSubmit,
        errors,
      },
    },
    mutate: {
      addCredit: {
        isLoadingAddCredit,
      },
    },
    isOpen,
    setIsOpen,
    dataClient,
  }
}
