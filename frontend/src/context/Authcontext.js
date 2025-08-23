import { createContext, useState, useEffect } from "react";
import { getUserDetails } from "../utils/GetUser";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserDetails());
  }, []);

  const login = (userData) => {
    localStorage.setItem("todoAppUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("todoAppUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
