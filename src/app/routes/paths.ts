// src/app/routes/paths.ts
export const paths = {
  login: () => "/login",
  home: () => "/home",
  user: () => "/user", // NOVO (pra parar de hardcode)
  search: (queryString: string) => `/busca?${queryString}`,
  editAddress: (id: number | string) => `/editAddress/${id}`,
} as const;
