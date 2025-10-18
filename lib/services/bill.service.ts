import api from '../api';
import { Bill, CreateBillRequest, UpdateBillRequest, BillFilters } from '@/types';

export const billService = {
  async getBill(id: string): Promise<Bill> {
    const response = await api.get<Bill>(`/bill?id=${id}`);
    return response.data;
  },

  async getBills(filters?: BillFilters): Promise<Bill[]> {
    const response = await api.get<Bill[]>('/bills', { params: filters });
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

