import { createContext, useContext, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/repositories";
import { usePersistentState } from "@/hooks/usePersistentState";

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

const AuthContext = createContext<AuthCtx>({
  user: null,
  isLoggedIn: false,
  authReady: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { value: user, setValue: setUser, ready: authReady } = usePersistentState<User | null>(
    STORAGE_KEYS.user,
    null
  );

  function login(phone: string, countryCode: string) {
    setUser({ phone, countryCode });
  }

  function logout() {
    setUser(null);
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
