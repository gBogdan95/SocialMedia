import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthListener: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();
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
