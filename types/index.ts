// Tipos de dados baseados na API

export interface User {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  salary?: number | null;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  value: number;
  description?: string | null;
  installmentsNumber?: number | null;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface Planning {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  goal: string;
  goalValue: number;
  plan: string;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

// Tipos de requisição
export interface RegisterRequest {
  name: string;
  email: string;
  birthdate: string;
  password: string;
  salary?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateBillRequest {
  name: string;
  value: number;
  description?: string;
  installmentsNumber?: number;
}

export interface UpdateBillRequest {
  id: string;
  name?: string;
  value?: number;
  description?: string;
  installmentsNumber?: number;
}

export interface CreatePlanningRequest {
  name: string;
  description?: string;
  goal: string;
  goalValue: number;
  plan: string;
}

export interface GeneratePlanningRequest {
  goal: string;
  goalValue: number;
  description?: string;
}

export interface UpdatePlanningRequest {
  id: string;
  name?: string;
  description?: string;
  goal?: string;
  goalValue?: number;
  plan?: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  birthdate?: string;
  salary?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Tipos de filtro
export interface BillFilters {
  id?: string | null;
  userId?: string | null;
  name?: string | null;
  value?: number | null;
  description?: string | null;
  installmentsNumber?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface PlanningFilters {
  id?: string | null;
  userId?: string | null;
  name?: string | null;
  description?: string | null;
  goal?: string | null;
  goalValue?: number | null;
  plan?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface UserFilters {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  birthdate?: string | null;
  salary?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface UserSummary {
  billsActiveCount: number;
  totalBillAmount: number;
  totalValue: number;
  totalInstallmentValue: number;
  totalFixedBillsValue: number;
  totalMonthlyMiscBillsValue: number;
  partialValueNextMonth: number;
  partialValue2MonthsLater: number;
  partialValue3MonthsLater: number;
  fixesBillsNames: string;
  monthlyMiscBillsNames: string;
  installmentBillsNames: string;
}

