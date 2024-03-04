import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth, AuthContextType } from "../contexts/AuthContext";

const AuthListener: React.FC = () => {
  const { logout, isAuthenticated } = useAuth() as AuthContextType;
  const location = useLocation();

  useEffect(() => {
    if (
      (location.pathname === "/" || location.pathname === "/register") &&
      isAuthenticated
    ) {
      logout();
    }
  }, [location, logout, isAuthenticated]);
  return null;
};

export default AuthListener;
