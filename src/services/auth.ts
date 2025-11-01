import { api } from "@/lib/axios";

interface IAuthResponse {
  access_token: string;
  expires_in: number;
}

export class Auth {
  async refreshToken(
    refresh_token: string
  ): Promise<IAuthResponse | undefined> {
    const response = await api.post<IAuthResponse>("/auth/refresh-token", {
      refresh_token,
    });

    return response.data;
  }
}
