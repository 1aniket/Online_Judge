import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { PublicRoute } from "../components/Routesacsess";

const AuthPage = () => {
  return (
    <div className="bg-slate-200">
      <Routes>
        <Route
          index
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AuthPage;