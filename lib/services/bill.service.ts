import api from '../api';
import { Bill, CreateBillRequest, UpdateBillRequest, BillFilters, PaginatedResponse } from '@/types';

export const billService = {
  async getBill(id: string): Promise<Bill> {
    const response = await api.get<Bill>(`/bill?id=${id}`);
    return response.data;
  },

  async getBills(
    filters?: BillFilters,
    page: number = 1,
    limit: number = 20,
    sortBy: string = "createdAt",
    order: string = "desc"
  ): Promise<PaginatedResponse<Bill>> {
    const response = await api.get<PaginatedResponse<Bill>>('/bills', { params: { ...filters, page, limit, sortBy, order } });
    return response.data;
  },

  async createBill(data: CreateBillRequest): Promise<Bill> {
    const response = await api.post<Bill>('/bills', data);
    return response.data;
  },

  async updateBill(data: UpdateBillRequest): Promise<Bill> {
    const response = await api.put<Bill>('/bills', data);
    return response.data;
  },

  async deleteBill(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/bills/${id}`);
    return response.data;
  },
};

