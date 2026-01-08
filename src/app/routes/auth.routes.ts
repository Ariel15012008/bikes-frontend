// src/app/routes/auth.routes.ts
import api from "@/app/utils/axiosInstance";

export const AUTH_ENDPOINTS = {
  login: "/auth/login/",
  me: "/auth/me/",
  logout: "/auth/logout/",
  refresh: "/auth/refresh-token",

  requestPasswordReset: "/auth/request-password-reset",

  // NOVO
  resetPassword: "/auth/reset-password",
} as const;

export type LoginPayload = {
  email: string;
  senha: string;
};

export async function login(payload: LoginPayload) {
  return api.post(AUTH_ENDPOINTS.login, payload);
}

export async function me() {
  return api.get(AUTH_ENDPOINTS.me);
}

export async function logout() {
  return api.post(AUTH_ENDPOINTS.logout);
}

export async function refresh() {
  return api.post(AUTH_ENDPOINTS.refresh);
}

export type RequestPasswordResetPayload = {
  email: string;
};

export async function requestPasswordReset(payload: RequestPasswordResetPayload) {
  return api.post(AUTH_ENDPOINTS.requestPasswordReset, payload);
}

// NOVO
export type ResetPasswordPayload = {
  token: string;
  nova_senha: string;
};

export async function resetPassword(payload: ResetPasswordPayload) {
  return api.post(AUTH_ENDPOINTS.resetPassword, payload);
}
