import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { IUserRequest, User } from '@/services/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Roles } from '@/enums/Roles.enum'
import { IUser } from '@/interfaces/user/IUser.type'

const editUserSchema = z.object({
  name: z.string().min(3, 'Campo nome deve ter no mínimo 3 caracteres!'),
  email: z.string().email('E-mail invalido!'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, 'Senha deve ter no mínimo 8 caracteres'),
  role: z.enum([Roles.admin, Roles.manager, Roles.user]),
})

const editAdminUserSchema = z.object({
  name: z.string().min(3, 'Campo nome deve ter no mínimo 3 caracteres!'),
})

type EditUserForm = z.infer<typeof editUserSchema>
type EditAdminUserForm = z.infer<typeof editAdminUserSchema>

export function useEditUserController(dataUser: IUser) {
  const user = new User()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isAdminUser = dataUser.role === Roles.admin

  const { mutateAsync: editUserFn, isPending: isLoadingEditUser } = useMutation({
    mutationFn: async (payload: EditUserForm | EditAdminUserForm) => {
      if (!dataUser.id) {
        throw new Error('ID do usuário não encontrado')
      }

      if (isAdminUser) {
        return user.updateAdmin(dataUser.id, { name: payload.name })
      }

      const dataToSend: IUserRequest = {
        id: dataUser.id,
        name: payload.name,
        email: (payload as EditUserForm).email,
        role: (payload as EditUserForm).role,
      }

      const password = (payload as EditUserForm).password
      if (password?.trim()) {
        dataToSend.password = password
      }

      return user.updated(dataToSend)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
    },
    onSuccess: async (response) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success(response.message || 'Usuário editado com sucesso!')
        setIsOpen(false)
        reset()
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro ao editar o usuário!'
      toast.error(message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EditUserForm | EditAdminUserForm>({
    resolver: zodResolver(isAdminUser ? editAdminUserSchema : editUserSchema),
    defaultValues: isAdminUser
      ? { name: dataUser.name ?? '' }
      : {
          name: dataUser.name ?? '',
          email: dataUser.email ?? '',
          password: '',
          role: dataUser.role ?? Roles.user,
        },
  })

  const selectedRole = (watch as (name: 'role') => Roles)('role')

  async function onSubmit(data: EditUserForm | EditAdminUserForm) {
    await editUserFn(data)
  }

  return {
    hookForm: {
      edit: {
        register,
        handleSubmit,
        onSubmit,
        errors,
        watch,
        setValue,
        selectedRole,
      },
    },
    mutate: {
      edit: {
        isLoadingEditUser,
      },
    },
    isAdminUser,
    isOpen,
    setIsOpen,
  }
}
