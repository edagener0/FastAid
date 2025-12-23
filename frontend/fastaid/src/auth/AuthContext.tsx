import { createContext, useState, type ReactNode } from "react";
import api from "../api/axios";
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  user_id: string
}

interface User {
    user_id: string
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
  
    const login = async (username: string, password: string) => {
      const res = await api.post("/users/login/", { username, password });
      const token = res.data.access;

      localStorage.setItem("token", token);

      // decodifica o JWT para obter user
      const decoded = jwtDecode<TokenPayload>(token);
      console.log(decoded)
      setUser({
        user_id: decoded.user_id
  });
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