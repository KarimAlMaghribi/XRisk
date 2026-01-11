import { apiFetch } from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export const login = (email: string, password: string) =>
  apiFetch<void>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password } satisfies LoginPayload),
  });

export const register = (email: string, password: string, name: string) =>
  apiFetch<void>("/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name } satisfies RegisterPayload),
  });

export const me = () => apiFetch<SessionUser>("/api/user/me");

export const logout = () => apiFetch<void>("/logout", { method: "GET" });
