import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("token");

  return user ? <Navigate to="/" replace /> : children;
}

const AdminRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  const role = JSON.parse(user); // Parse the user role from localStorage

  return role === "admin" ? children : <Navigate to="/" replace />;
};

export { PublicRoute, AdminRoute };
