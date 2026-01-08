// src/app/routes/localidades.routes.ts
import { authFetch } from "@/app/utils/authFetch";

export const LOCALIDADES_ENDPOINTS = {
  paises: "/localidades/paises",
  estados: "/localidades/estados", // ?pais_id=
  cidades: "/localidades/cidades", // ?estado_id=
} as const;

export function listPaises() {
  return authFetch(LOCALIDADES_ENDPOINTS.paises, { method: "GET" });
}

export function listEstadosByPais(paisId: string | number) {
  const qs = new URLSearchParams({ pais_id: String(paisId) });
  return authFetch(`${LOCALIDADES_ENDPOINTS.estados}?${qs.toString()}`, {
    method: "GET",
  });
}

export function listCidadesByEstado(estadoId: string | number) {
  const qs = new URLSearchParams({ estado_id: String(estadoId) });
  return authFetch(`${LOCALIDADES_ENDPOINTS.cidades}?${qs.toString()}`, {
    method: "GET",
  });
}
