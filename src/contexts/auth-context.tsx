"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/app/utils/authFetch";

type User = { name: string; email: string };

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  setUserLocal: (u: User | null) => void;
  refreshMe: () => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const CACHE_KEY = "auth.user.cache.v1";

function readCache(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeCache(user: User | null) {
  if (typeof window === "undefined") return;
  try {
    if (!user) sessionStorage.removeItem(CACHE_KEY);
    else sessionStorage.setItem(CACHE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => readCache());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!readCache());

  const setUserLocal = useCallback((u: User | null) => {
    setUser(u);
    setIsAuthenticated(!!u);
    writeCache(u);
  }, []);

  // Busca /users/me (sem redirect aqui; quem protege rota é o middleware)
  const refreshMe = useCallback(async (): Promise<User | null> => {
    try {
      const res = await authFetch("http://localhost:8000/users/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("unauthorized");

      const data = await res.json();
      const u: User = { name: data.nome, email: data.email };
      setUserLocal(u);
      return u;
    } catch {
      setUserLocal(null);
      return null;
    }
  }, [setUserLocal]);

  const logout = useCallback(async () => {
    try {
      await authFetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      setUserLocal(null);
      router.replace("/login");
    }
  }, [router, setUserLocal]);

  // IMPORTANTE: valida UMA vez ao montar.
  // Isso deixa a navegação rápida (não tem fetch a cada click de Link).
  useEffect(() => {
    // hidrata do cache (já está no initial state)
    // valida em background
    void refreshMe();
  }, [refreshMe]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      setUserLocal,
      refreshMe,
      logout,
    }),
    [user, isAuthenticated, setUserLocal, refreshMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
