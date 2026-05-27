import { Roles } from '@/enums/Roles.enum'
import { IUser } from '@/interfaces/user/IUser.type'
import { api } from '@/lib/axios'
import type { IApiPaginatedResponse, IApiResponse } from '@/interfaces/api/IApiResponse.type'

export type IUserPaginatedResponse = IApiPaginatedResponse<IUser>
export type IUserResponse = Partial<IApiResponse<IUser>> & {
  message?: string
}

export interface IUserRequest {
  id?: string
  name: string
  email: string
  password?: string
  role: Roles
}

export interface IAdminUserCreatePayload {
  email: string
  name: string
  password: string
  client_id: string
  role: Roles
}

export interface IAdminUserUpdatePayload {
  name: string
}

export class User {
  async getAll(page: number, pageSize: number) {
    try {
      const response = await api.get<IUserPaginatedResponse>('/api/users/', {
        params: {
          page,
          page_size: pageSize,
        },
      })

      return response.data
    } catch (err) {
      console.log(err)
    }
  }

  async create({ ...payload }: IUserRequest) {
    try {
      const response = await api.post<IUserResponse>('/api/users/', payload)

      return response.data
    } catch (err) {
      console.log(err)
    }
  }

  async createAdmin(payload: IAdminUserCreatePayload) {
    const response = await api.post<IUserResponse>('/api/admin/users/', payload)
    return response.data
  }

  async updateAdmin(userId: string, payload: IAdminUserUpdatePayload) {
    const response = await api.put<IUserResponse>(`/api/admin/users/${userId}`, payload)
    return response.data
  }

  async deleteAdmin(userId: string) {
    const response = await api.delete<IUserResponse>(`/api/admin/users/${userId}`)
    return response.data
  }

  async delete(id: string) {
    try {
      await api.delete<IUserResponse>(`/api/users/`, {
        params: {
          id,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  async addCredit(userId: string, amount: number, description: string) {
    try {
      await api.post('/api/users/credits', {
        user_id: userId,
        amount: amount * 100,
        description,
      })
    } catch (err) {
      console.log(err)
    }
  }

  async updated(payload: IUserRequest) {
    try {
      const response = await api.put<IUserResponse>(`/api/users/${payload?.id}`, payload)

      return response.data
    } catch (err) {
      console.log(err)
    }
  }

  async getUserById(id: string) {
    try {
      const response = await api.get<IApiResponse<IUser>>(`/api/users/${id}/`)

      return response.data.data
    } catch (err) {
      console.log(err)
    }
  }
}
