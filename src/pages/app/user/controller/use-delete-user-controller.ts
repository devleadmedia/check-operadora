import { toast } from 'sonner'
import { User } from '@/services/user'
import { IUser } from '@/interfaces/user/IUser.type'
import { Roles } from '@/enums/Roles.enum'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function useDeleteUserController() {
  const user = new User()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { mutateAsync: deleteUserFn, isPending: isLoadingDeleteUser } =
    useMutation({
      mutationFn: async (dataUser: IUser) => {
        if (!dataUser?.id) {
          throw new Error('ID do usuário não encontrado')
        }

        if (dataUser.role === Roles.admin) {
          return user.deleteAdmin(dataUser.id)
        }

        return user.delete(dataUser.id)
      },
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ['users'] })
      },
      onSuccess: async (response) => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success(response?.message || 'Usuário deletado com sucesso!')
        setIsOpen(false)
      },
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Erro ao deletar o usuário!'
        toast.error(message)
      },
    })

  return {
    isOpen,
    setIsOpen,
    isLoadingDeleteUser,
    deleteUserFn,
  }
}
