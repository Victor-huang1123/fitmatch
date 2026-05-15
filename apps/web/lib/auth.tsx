"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  token: string;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: { name: string; phone: string; email?: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("fitmatch.token") || "";
    setAuthToken(stored);
    if (stored) api.me().then((res) => setUser(res.user)).catch(() => localStorage.removeItem("fitmatch.token"));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token: authToken,
    async login(phone, password) {
      const res = await api.login({ phone, password });
      localStorage.setItem("fitmatch.token", res.token);
      setAuthToken(res.token);
      setUser(res.user);
    },
    async register(data) {
      const res = await api.register(data);
      localStorage.setItem("fitmatch.token", res.token);
      setAuthToken(res.token);
      setUser(res.user);
    },
    logout() {
      localStorage.removeItem("fitmatch.token");
      setAuthToken("");
      setUser(null);
    },
  }), [authToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
