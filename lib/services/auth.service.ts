import api from '../api';
import { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/forgot-password?email=${email}`);
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/reset-password?token=${token}`, { password });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  saveAuth(data: AuthResponse) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

