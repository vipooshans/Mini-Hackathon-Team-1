import { createContext, useState, useEffect, useContext } from "react";
import { getProfile } from "../services/authService.js";

const AuthContext = createContext(null);

/**
 * Provides auth state (user, token) and methods (login, logout) to the app.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("cleanlanka_token"));
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error("Auth context load failed:", err);
        // Token invalid or expired — clear it
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = (newToken, newUser) => {
    localStorage.setItem("cleanlanka_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("cleanlanka_token");
    setToken(null);
    setUser(null);
  };

  const setUserProfile = (profile) => {
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
