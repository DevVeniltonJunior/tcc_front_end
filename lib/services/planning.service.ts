import api from '../api';
import { Planning, CreatePlanningRequest, UpdatePlanningRequest, GeneratePlanningRequest, PlanningFilters } from '@/types';

export const planningService = {
  async getPlanning(id: string): Promise<Planning> {
    const response = await api.get<Planning>(`/planning?id=${id}`);
    return response.data;
  },

  async getPlannings(filters?: PlanningFilters): Promise<Planning[]> {
    const response = await api.get<Planning[]>('/plannings', { params: filters });
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

