import { createContext, useContext, useMemo, useState, useEffect } from "react";

const LowDataContext = createContext({
  lowData: false,
  setLowData: () => {},
  toggleLowData: () => {},
});

const STORAGE_KEY = "cleanlanka_low_data";

export function LowDataProvider({ children }) {
  const [lowData, setLowDataState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lowData ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [lowData]);

  const value = useMemo(
    () => ({
      lowData,
      setLowData: setLowDataState,
      toggleLowData: () => setLowDataState((v) => !v),
    }),
    [lowData]
  );

  return <LowDataContext.Provider value={value}>{children}</LowDataContext.Provider>;
}

export function useLowData() {
  return useContext(LowDataContext);
}
