import { useNavigate } from "react-router-dom";
import {
  LogOut as IconLogOut,
  User,
  Settings,
  CreditCard,
  List,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/mode-toggle";
import { IUserResponse } from "@/services/login";

import { LogOut } from "@/components/log-out";
import { Roles } from "@/enums/Roles.enum";
import { role } from "@/utils/data-user";

interface IUserDataProps {
  userData: IUserResponse;
}

export function Profile({ userData }: IUserDataProps) {
  const navigate = useNavigate();

  function handleLogOut() {
    navigate("/");
    LogOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-full justify-start px-3 py-2 dark:hover:bg-white/10"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {userData?.name ?? "Usuário"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {userData?.email ?? "example@email.com"}
              </span>
            </div>

            <Settings className="h-4 w-4 text-muted-foreground ml-auto" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {userData?.name ?? "Usuário"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userData?.email ?? "example@email.com"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/perfil")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          {role == Roles.admin && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/usuarios")}
            >
              <List className="mr-2 h-4 w-4" />
              <span>Usuários</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Meus créditos</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/extrato")}
          >
            <Landmark className="mr-2 h-4 w-4" />
            <span>Meu Extrato</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ModeToggle />
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogOut}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <IconLogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
