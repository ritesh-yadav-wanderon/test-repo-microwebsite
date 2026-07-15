import { createContext, useContext, useEffect, useState } from "react";

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

const STORAGE_KEY = "wanderon_user";

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
