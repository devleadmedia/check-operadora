import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, Loader2, User, UserPlus } from 'lucide-react'
import { useUserController } from '../controller/use-create-user-controller'
import { InputMessage } from '@/components/input-message'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Roles } from '@/enums/Roles.enum'
import { useState } from 'react'
import { EyeClosedIcon } from '@radix-ui/react-icons'

export function CreateUser() {
  const [showPassword, setShowPassword] = useState<'show' | 'hide'>('hide')
  const { hookForm, mutate, clients, selectedRole, isOpen, setIsOpen } = useUserController()
  const { isLoadingCreateUser } = mutate.create
  const { register, errors, handleSubmit, onSubmit, nameButtonCreateNewUser, watch, setValue } =
    hookForm.create
  const { list: clientsList, isLoading: isLoadingClients } = clients

  const isCreatingUser = isLoadingCreateUser ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <User size={16} />
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus size={16} />
          Novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar novo usuário:</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid col-span-2 items-start gap-2">
              <Label htmlFor="name" className="text-start flex items-center gap-2">
                Nome:
                {errors.name && <InputMessage message={errors.name.message} />}
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome"
                className={`col-span-3 ${
                  errors.name && 'border border-red-400 placeholder:text-red-300'
                }`}
                {...register('name')}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="email" className="text-start flex items-center gap-2">
                E-mail:
                {errors.email && <InputMessage message={errors.email.message} />}
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="E-mail"
                className={`col-span-3 ${
                  errors.email && 'border border-red-400 placeholder:text-red-300'
                }`}
                {...register('email')}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <Label htmlFor="password" className="text-start flex items-center gap-2">
                Senha:
                {errors.password && <InputMessage message={errors.password.message} />}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type={showPassword === 'hide' ? 'password' : 'text'}
                  id="password"
                  placeholder="Senha"
                  className={`col-span-3 ${
                    errors.password && 'border border-red-400 placeholder:text-red-300'
                  }`}
                  {...register('password')}
                />
                {showPassword === 'hide' ? (
                  <Button
                    type="button"
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => setShowPassword('show')}
                  >
                    <Eye />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => setShowPassword('hide')}
                  >
                    <EyeClosedIcon />
                  </Button>
                )}
              </div>
            </div>
            <div
              className={`col-span-2 grid grid-cols-1 gap-4 ${
                selectedRole === Roles.admin ? 'sm:grid-cols-2' : ''
              }`}
            >
              <div className="grid items-center gap-2">
                <Label htmlFor="role" className="text-start flex items-center gap-2">
                  Tipo de Usuário:
                  {errors.role && <InputMessage message={errors.role.message} />}
                </Label>
                <Select
                  value={watch('role')}
                  onValueChange={(value) => {
                    const role = value as Roles
                    setValue('role', role)
                    if (role !== Roles.admin) {
                      setValue('client_id', undefined)
                    }
                  }}
                >
                  <SelectTrigger className={errors.role ? 'border border-red-400' : ''}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Roles.user}>Usuário</SelectItem>
                    <SelectItem value={Roles.manager}>Gerente</SelectItem>
                    <SelectItem value={Roles.admin}>Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRole === Roles.admin && (
                <div className="grid items-center gap-2">
                  <Label htmlFor="client_id" className="text-start flex items-center gap-2">
                    Cliente:
                    {errors.client_id && <InputMessage message={errors.client_id.message} />}
                  </Label>
                  <Select
                    value={watch('client_id') ?? ''}
                    onValueChange={(value) =>
                      setValue('client_id', value, { shouldValidate: true })
                    }
                    disabled={isLoadingClients || isLoadingCreateUser}
                  >
                    <SelectTrigger
                      id="client_id"
                      className={errors.client_id ? 'border border-red-400' : ''}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingClients ? 'Carregando clientes...' : 'Selecione o cliente'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsList.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <DialogFooter className="mt-4">
            <Button
              className="flex items-center gap-1"
              type="submit"
              variant={'default'}
              disabled={isLoadingCreateUser}
            >
              {isCreatingUser}
              {nameButtonCreateNewUser}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
