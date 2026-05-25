import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/contexts/auth'

const signInSchema = z.object({
  email: z.string().min(1, 'Preencha esse campo.').email('E-mail inválido.'),
  password: z.string().min(8, 'Campo senha deve ter no mínimo 8 caracteres.'),
})

type SignInForm = z.infer<typeof signInSchema>

export function useSignInController() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutateAsync: signInFn, isPending: isLoading } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate('/', { replace: true })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Credenciais inválidas!'
      toast.error(message)
      resetField('password')
    },
  })

  async function onSubmit(payload: SignInForm) {
    await signInFn(payload)
  }

  return {
    hookForm: {
      register,
      handleSubmit,
      errors,
    },
    signInResponse: {
      mutate: onSubmit,
      isLoading,
    },
  }
}
