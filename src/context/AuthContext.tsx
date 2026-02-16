import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { setLogoutHandler } from "@/api/axiosConfig";


interface DecodedToken {
  sub: string;
  role?: string;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const decoded: DecodedToken = jwtDecode(newToken);
    setRole(decoded.role || null);
  };

  // Register logout handler for axios
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  // Decode token + expiration check
  useEffect(() => {
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setRole(decoded.role || null);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext missing");
  return context;
};
