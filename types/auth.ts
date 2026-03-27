// Auth-related types for Acadivon login

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export type AuthProvider = "google" | "apple" | "email";

export type AuthStatus = "idle" | "loading" | "success" | "error";

export interface AuthState {
  status: AuthStatus;
  provider: AuthProvider | null;
  error: string | null;
}
