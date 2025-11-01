import { Roles } from "@/enums/Roles.enum";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Roles;
  credit: number;
  created_at: string;
  updated_at: string;
} 