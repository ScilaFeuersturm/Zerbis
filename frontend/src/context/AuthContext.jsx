import { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

function decodeJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return {}; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const userId = token ? (decodeJwt(token).id ?? null) : null;

  const login = ({ token, role }) => {
    setToken(token); setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setToken(null); setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const value = useMemo(() => ({ token, role, userId, login, logout }), [token, role]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);