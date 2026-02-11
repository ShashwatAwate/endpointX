import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_BACKEND_BASE_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/user`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const d = await res.json();
        if (!d.user) {
          console.log("u fucked up")
        }
        const userData: User = d.user;
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (data: LoginPayload) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    // Fetch user after login
    const me = await fetch(`${API_BASE}/auth/user`, {
      credentials: "include",
    });

    const userData: User = await me.json();
    setUser(userData);
  };

  const register = async (data: RegisterPayload) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    const me = await fetch(`${API_BASE}/auth/user`, {
      credentials: "include",
    });

    const d = await me.json();
    if (!d.user) {
      console.log("u fucked up")
    }
    const userData: User = d.user;
    setUser(userData);
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
