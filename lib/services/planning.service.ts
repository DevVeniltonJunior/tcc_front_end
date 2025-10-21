import api from '../api';
import { Planning, CreatePlanningRequest, UpdatePlanningRequest, GeneratePlanningRequest, PlanningFilters, PaginatedResponse } from '@/types';

export const planningService = {
  async getPlanning(id: string): Promise<Planning> {
    const response = await api.get<Planning>(`/planning?id=${id}`);
    return response.data;
  },

  async getPlannings(
    filters?: PlanningFilters,    
    page: number = 1,
    limit: number = 20,
    sortBy: string = "createdAt",
    order: string = "desc"
  ): Promise<PaginatedResponse<Planning>> {
    const response = await api.get<PaginatedResponse<Planning>>('/plannings', { params: { ...filters, page, limit, sortBy, order } });
    return response.data;
  },

  async createPlanning(data: CreatePlanningRequest): Promise<Planning> {
    const response = await api.post<Planning>('/plannings', data);
    return response.data;
  },

  async generatePlanning(data: GeneratePlanningRequest): Promise<Planning> {
    const response = await api.post<Planning>('/generate-planning', data);
    return response.data;
  },

  async updatePlanning(data: UpdatePlanningRequest): Promise<Planning> {
    const response = await api.put<Planning>('/plannings', data);
    return response.data;
  },

  async deletePlanning(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/plannings/${id}`);
    return response.data;
  },
};

