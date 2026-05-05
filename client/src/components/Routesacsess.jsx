import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("token");

  return user ? <Navigate to="/" replace /> : children;
}

const AdminRoute = ({ children }) => {
  const role = JSON.parse(localStorage.getItem("user") || "null");

  return role === "admin" ? children : <Navigate to="/" replace />;
};

export { PublicRoute, AdminRoute };
