export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: string;
  name: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date | null;
  gender: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

