import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // API interceptor will attach token from localStorage
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials /* { email, password } */) => {
    // Accept either credential object (for internal use) or (userData, token)
    if (credentials?.token && credentials?.user) {
      // direct set
      localStorage.setItem("token", credentials.token);
      setUser(credentials.user);
      return;
    }
    // otherwise perform API login
    const res = await API.post("/auth/login", credentials);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      await fetchProfile();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}