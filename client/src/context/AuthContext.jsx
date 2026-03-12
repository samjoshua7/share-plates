import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sp_token") || null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from token on mount
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = (data) => {
    localStorage.setItem("sp_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("sp_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
