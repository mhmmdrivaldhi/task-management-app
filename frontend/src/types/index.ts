export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface LoginResponse {
  token: string;
  user: User;
}
export interface TaskFormData {
  title: string;
  description: string;
  completed: boolean;
}