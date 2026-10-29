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

export interface AdminProfileData {
  department: string;
  designation: string;
  permissions: string[];
  accessibleOutletIds: string[];
  twoFactorEnabled: boolean;
  workstationTrustUntil?: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STORE_MANAGER";
  avatarUrl?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  adminProfile?: AdminProfileData | null;
}

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenFamilyId: string;
  expiresInSeconds: number;
  user: AdminUser;
}
