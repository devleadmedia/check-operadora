import { api } from "@/lib/axios";
import { Auth } from "./auth";

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  user: IUserResponse;
}

const auth = new Auth();

export class Login {
  async signIn({
    ...payload
  }: ILoginRequest): Promise<ILoginResponse | undefined> {
    try {
      const response = await api.post<ILoginResponse>("/auth/login", payload);

      const { refresh_token } = response.data;

      await auth.refreshToken(refresh_token);

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
}
