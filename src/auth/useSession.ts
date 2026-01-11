import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login, logout, me, register, SessionUser } from "../api/auth";

interface SessionContextValue {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  doLogin: (email: string, password: string) => Promise<void>;
  doRegister: (email: string, password: string, name: string) => Promise<void>;
  doLogout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const meResponse = await me();
      setUser(meResponse);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const doLogin = useCallback(async (email: string, password: string) => {
    await login(email, password);
    await refresh();
  }, [refresh]);

  const doRegister = useCallback(async (email: string, password: string, name: string) => {
    await register(email, password, name);
    await refresh();
  }, [refresh]);

  const doLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      doLogin,
      doRegister,
      doLogout,
    }),
    [user, loading, refresh, doLogin, doRegister, doLogout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
