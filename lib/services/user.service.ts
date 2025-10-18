import api from '../api';
import { User, UpdateUserRequest, UserFilters } from '@/types';

export const userService = {
  async getUser(params?: { id?: string; email?: string }): Promise<User> {
    const response = await api.get<User>('/user', { params });
    return response.data;
  },

  async getUsers(filters?: UserFilters): Promise<User[]> {
    const response = await api.get<User[]>('/users', { params: filters });
    return response.data;
  },

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async updateUser(data: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>('/users', data);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
};

