import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../api/axios";
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  user_id: string;
  username: string;
}

interface User {
  user_id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Ler token do localStorage quando o app carrega
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUser({ user_id: decoded.user_id, username: decoded.username});
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post("/users/login/", { username, password });
    const token = res.data.access;

    localStorage.setItem("token", token);

    // decodifica o JWT para obter user
    const decoded = jwtDecode<TokenPayload>(token);
    setUser({ user_id: decoded.user_id, username: decoded.username});
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
