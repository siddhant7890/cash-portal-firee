import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, loginCashier, logoutCashier } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setReady(true);
  }, []);

  async function login(mobile, loginCode) {
    const session = await loginCashier(mobile, loginCode);
    setUser(session);
    return session;
  }

  function logout() {
    logoutCashier();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Drop this into any protected page. Since auth now lives entirely in
// localStorage (no server-side cookie/session to check during SSR), the
// redirect has to happen client-side, after mount.
export function useRequireAuth() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  return { user, ready };
}
