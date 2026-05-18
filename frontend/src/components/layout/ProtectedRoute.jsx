import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token, initialized } = useSelector((state) => state.auth);

  if (!initialized && token) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Restoring your room...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
