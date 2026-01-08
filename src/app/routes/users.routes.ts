// src/app/routes/users.routes.ts
import api from "@/app/utils/axiosInstance";
import { authFetch } from "@/app/utils/authFetch";

export const USERS_ENDPOINTS = {
  // perfil
  me: "/users/me",
  update: "/users/update",

  // endereços
  enderecos: "/users/enderecos",
  createEndereco: "/users/create-endereco",
  setPrimary: (id: number | string) => `/users/endereco/${id}/set-primary`,
  deleteEndereco: (id: number | string) => `/endereco/delete/${id}`,

  // buscar 1 endereço por id
  getEnderecoById: (id: number | string) => `/endereco/${id}`,

  // atualizar endereço
  updateEndereco: "/endereco/update",

  // cadastro
  register: "/users/",
} as const;

// =========================
// PERFIL
// =========================

export function me() {
  return authFetch(USERS_ENDPOINTS.me, { method: "GET" });
}

export type UpdateProfilePayload = {
  pessoa: {
    nome_completo: string;
    email: string;
    telefone_celular: string;
  };
  usuario: {
    email: string;
    senha?: string;
  };
};

export function updateProfile(payload: UpdateProfilePayload) {
  return authFetch(USERS_ENDPOINTS.update, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: payload,
  });
}

// =========================
// ENDEREÇOS
// =========================

export function listEnderecos() {
  return authFetch(USERS_ENDPOINTS.enderecos, { method: "GET" });
}

export type CreateEnderecoPayload = {
  cep: string; // ideal: numérico (8 dígitos)
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  nome_cidade: string;
  nome_estado: string;
  endereco_primario: boolean;
};

export function createEndereco(payload: CreateEnderecoPayload) {
  return authFetch(USERS_ENDPOINTS.createEndereco, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload,
  });
}

export function setEnderecoPrimary(id: number | string) {
  return authFetch(USERS_ENDPOINTS.setPrimary(id), { method: "PUT" });
}

export function deleteEndereco(id: number | string) {
  return authFetch(USERS_ENDPOINTS.deleteEndereco(id), { method: "DELETE" });
}

export function getEnderecoById(id: number | string) {
  return authFetch(USERS_ENDPOINTS.getEnderecoById(id), { method: "GET" });
}

export type UpdateEnderecoPayload = {
  id: number; // backend espera number
  cep: string; // numérico (8 dígitos)
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  nome_cidade: string;
  nome_estado: string;
  endereco_primario: boolean;
};

export function updateEndereco(payload: UpdateEnderecoPayload) {
  return authFetch(USERS_ENDPOINTS.updateEndereco, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: payload,
  });
}

// =========================
// CADASTRO (REGISTER)
// =========================

// Ajuste importante:
// - backend está exigindo fantasia/regime (mesmo PF), mas aceita "".
// - tipo_pessoa no seu backend está como "PF" | "PJ" (conforme seu payload que funcionou).
export type RegisterPayload = {
  pessoa: {
    nome_completo: string;
    fantasia?: string;
    cpf_cnpj: string;
    email: string;
    telefone_celular: string;
    data_nascimento: string;
    regime?: string;
    tipo_pessoa: "PF" | "PJ"; // aqui
  };
  usuario: {
    email: string;
    senha: string;
  };
};

export function register(payload: RegisterPayload) {
  // cadastro costuma ser público -> usa axiosInstance direto
  return api.post(USERS_ENDPOINTS.register, payload);
}
