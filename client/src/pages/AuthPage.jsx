import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { PublicRoute } from "../components/Routesacsess";
import ErrorPage from "./ErrorPage";


const AuthPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-cyan-400/14 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] h-80 w-80 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
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
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default AuthPage;
