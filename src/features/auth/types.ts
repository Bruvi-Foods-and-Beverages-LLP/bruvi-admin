import type { AdminUser, AdminProfileData, UserRole } from "@/types/auth";

export type { AdminUser, AdminProfileData, UserRole };

export interface SignInFormData {
  email: string;
  password: string;
  rememberDevice: boolean;
}

export type AuthChannel = "GOOGLE_WORKSPACE" | "CREDENTIALS";

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  channel: AuthChannel | null;
}

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenFamilyId: string;
  expiresInSeconds: number;
  user: AdminUser;
}
