import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getAndSetUser = async () => {
  //     const data = await getMe();

  //     setUser(data.user);

  //     setLoading(false);
  //   };

  //   getAndSetUser();
  // }, []);

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        // Only set user if data and data.user actually exist
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        // This runs NO MATTER WHAT (success or error)
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
