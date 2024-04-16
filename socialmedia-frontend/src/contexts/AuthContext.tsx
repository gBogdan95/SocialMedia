import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface User {
  username: string;
  email: string;
  id: string;
  avatarUrl: string;
  backgroundUrl: string;
  currency: number;
  name: string;
  phoneNumber: string;
  description: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("token") !== null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = (token: string, userDetails: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userDetails));
    setIsAuthenticated(true);
    setUser(userDetails);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: User, newToken: string) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("token", newToken);
    setUser(updatedUser);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
