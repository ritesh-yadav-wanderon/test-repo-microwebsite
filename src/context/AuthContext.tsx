import { createContext, useContext, useEffect, useState } from "react";
import { readJSON, removeKey, STORAGE_KEYS, writeJSON } from "@/repositories";

interface User {
  name?: string;
  phone: string;
  countryCode: string;
}

interface AuthCtx {
  user: User | null;
  isLoggedIn: boolean;
  /** True once the auth status has been read/verified from storage. */
  authReady: boolean;
  login: (phone: string, countryCode: string) => void;
  logout: () => void;
}

function readStoredUser(): User | null {
  return readJSON<User | null>(STORAGE_KEYS.user, null);
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  isLoggedIn: false,
  authReady: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [authReady, setAuthReady] = useState(false);

  // Confirm the persisted status once mounted, then mark auth as verified.
  useEffect(() => {
    setUser(readStoredUser());
    setAuthReady(true);
  }, []);

  function login(phone: string, countryCode: string) {
    const u: User = { phone, countryCode };
    setUser(u);
    writeJSON(STORAGE_KEYS.user, u);
  }

  function logout() {
    setUser(null);
    removeKey(STORAGE_KEYS.user);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, authReady, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
