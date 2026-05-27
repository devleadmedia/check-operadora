import { Roles } from '@/enums/Roles.enum'
import { index as fetchClients } from '@/services/client.service'
import { User } from '@/services/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const createUserSchema = z
  .object({
    name: z.string().min(3, 'Campo nome deve ter no mínimo 3 caracteres!'),
    email: z.email('E-mail invalido!'),
    password: z.string().min(8, 'Campo senha deve ter no mínimo 8 caracteres!'),
    role: z.enum([Roles.admin, Roles.manager, Roles.user]),
    client_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === Roles.admin && !data.client_id) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione um cliente!',
        path: ['client_id'],
      })
    }
  })

type CreateUserForm = z.infer<typeof createUserSchema>

export function useUserController() {
  const user = new User()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: Roles.user,
      client_id: undefined,
    },
  })

  const selectedRole = watch('role')

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
    enabled: isOpen,
    refetchOnWindowFocus: false,
  })

  const { mutateAsync: createUserFn, isPending: isLoadingCreateUser } = useMutation({
    mutationFn: async (payload: CreateUserForm) => {
      if (payload.role === Roles.admin) {
        return user.createAdmin({
          email: payload.email,
          name: payload.name,
          password: payload.password,
          client_id: payload.client_id!,
          role: payload.role,
        })
      }

      return user.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      })
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
    },
    onSuccess: async (response) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success(response.message || 'Usuário criado com sucesso!')
        setIsOpen(false)
        reset()
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar o usuário!'
      toast.error(message)
    },
  })

  const nameButtonCreateNewUser = isLoadingCreateUser ? 'Criando...' : 'Criar'

  async function onSubmit(payload: CreateUserForm) {
    await createUserFn(payload)
  }

  return {
    hookForm: {
      create: {
        register,
        handleSubmit,
        errors,
        onSubmit,
        nameButtonCreateNewUser,
        watch,
        setValue,
      },
    },
    mutate: {
      create: {
        isLoadingCreateUser,
      },
    },
    clients: {
      list: clients,
      isLoading: isLoadingClients,
    },
    selectedRole,
    isOpen,
    setIsOpen,
  }
}
