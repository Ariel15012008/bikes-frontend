// src/app/utils/authFetch.ts
import api from "@/app/utils/axiosInstance";
import type { AxiosError, AxiosRequestConfig, Method } from "axios";

type AuthFetchConfig = AxiosRequestConfig & {
  method?: Method;
};

export type AuthFetchResponse<T = any> = {
  text(): unknown;
  ok: boolean;
  status: number;
  data: T;
  headers: any;
  json: () => Promise<T>;
};

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && (error as any).isAxiosError;
}

function toResponseLike<T>(res: { status: number; data: T; headers: any }): AuthFetchResponse<T> {
  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    data: res.data,
    headers: res.headers,
    text: () => JSON.stringify(res.data),
    json: async () => res.data,
  };
}

export async function authFetch<T = any>(
  url: string,
  config: AuthFetchConfig = {}
): Promise<AuthFetchResponse<T>> {
  const alreadyRetried = (config as any).__authfetch_retried === true;

  const requestOnce = async (cfg: AuthFetchConfig) => {
    // Remove flag interna antes de enviar ao axios
    const { __authfetch_retried, ...safeCfg } = (cfg as any) || {};
    const res = await api.request<T>({ url, ...safeCfg });
    return toResponseLike<T>({ status: res.status, data: res.data, headers: res.headers });
  };

  try {
    return await requestOnce(config);
  } catch (err: unknown) {
    if (!isAxiosError(err)) throw err;

    const status = err.response?.status;

    if (status !== 401) throw err;
    if (alreadyRetried) throw err;
    if (String(url).includes("/auth/refresh-token")) throw err;

    // tenta refresh
    const refresh = await api.request({
      url: "/auth/refresh-token",
      method: "POST",
    });

    if (refresh.status < 200 || refresh.status >= 300) {
      // devolve o erro original
      throw err;
    }

    const retryConfig: any = { ...config, __authfetch_retried: true };
    return await requestOnce(retryConfig);
  }
}
