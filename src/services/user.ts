import { Roles } from "@/enums/Roles.enum";
import { IUser } from "@/interfaces/user/IUser.type";
import { api } from "@/lib/axios";

export interface IUserResponse {
  data?: IUser[];
  message?: string;
}

export interface IUserPaginatedResponse {
  data: IUser[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface IUserRequest {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: Roles;
}

export class User {
  async getAll(page: number, pageSize: number) {
    try {
      const response = await api.get<IUserPaginatedResponse>("/api/users/", {
        params: {
          page,
          page_size: pageSize
        }
      });

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async create({ ...payload }: IUserRequest) {
    try {
      const response = await api.post<IUserResponse>("/api/users/", payload);

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number) {
    try {
      await api.delete<IUserResponse>(`/api/users/`,{
        params: {
          id
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addCredit(userId: number, amount: number, description: string) {
    try {
      await api.post('/api/users/credits',{
        user_id: userId,
        amount: amount * 100,
        description
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updated(payload: IUserRequest) {
    console.log(payload);

    try {
      const response = await api.put<IUserResponse>(
        `/api/users/${payload?.id}`,
        payload
      );

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async getUserById(id: number) {
    try {
      const response = await api.get<IUserResponse>(`/api/users/${id}/`);

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async getCreditsByToken(): Promise<number>{
    try {
      const { data } = await api.get(`/api/extrato/creditos`);
      return data?.credit / 100;
    } catch (err) {
      console.log(err);
      return 0
    }
  }
}
