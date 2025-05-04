import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
  
    if (!user) return <Navigate to="/login" />;
  
    if (role) {
      const allowedRoles = Array.isArray(role) ? role : [role];
      if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
    }
  
    return children;
  };

export default ProtectedRoute;
