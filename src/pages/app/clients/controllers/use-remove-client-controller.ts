import { isAxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { remove } from '@/services/client.service'

interface IRemoveClientResponse {
  message?: string
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  if (error instanceof Error) return error.message
  return 'Erro ao remover cliente. Tente novamente.'
}

export function useRemoveClientController() {
  const queryClient = useQueryClient()

  const {
    mutateAsync: removeClient,
    isPending: isRemovingClient,
    variables: removingClientId,
  } = useMutation({
    mutationFn: async (clientId: string) => {
      if (!clientId) {
        throw new Error('ID do cliente não encontrado')
      }
      return remove(clientId)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['clients'] })
    },
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      const data = response as IRemoveClientResponse | undefined
      toast.success(data?.message || 'Cliente removido com sucesso!')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })

  return {
    removeClient,
    isRemovingClient,
    removingClientId,
  }
}
