import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, getToken, logoutUser, setToken } from "../services/api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const login = (authPayload) => {
    setToken(authPayload.token);
    setUser(authPayload.user);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, authLoading, login, logout }),
    [user, authLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
