import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("token");

  return user ? <Navigate to="/" replace /> : children;
}

const SecretRoute = ({ children }) => {
  const user = localStorage.getItem("token");

  return user ? children : <Navigate to="/auth" replace />;
};

export { SecretRoute, PublicRoute };