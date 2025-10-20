// Tipos de dados baseados na API

export interface User {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  salary?: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  value: number;
  description?: string;
  installmentsNumber?: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Planning {
  id: string;
  userId: string;
  name: string;
  description?: string;
  goal: string;
  goalValue: number;
  plan: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
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
  userId: string;
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
  userId: string;
  name: string;
  description?: string;
  goal: string;
  goalValue: number;
  plan: string;
}

export interface GeneratePlanningRequest {
  userId: string;
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
  id?: string;
  userId?: string;
  name?: string;
  value?: number;
  description?: string;
  installmentsNumber?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface PlanningFilters {
  id?: string;
  userId?: string;
  name?: string;
  description?: string;
  goal?: string;
  goalValue?: number;
  plan?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface UserFilters {
  id?: string;
  name?: string;
  email?: string;
  birthdate?: string;
  salary?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
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

