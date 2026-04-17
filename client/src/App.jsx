import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import HomePage from "./pages/HomePage";
import { SecretRoute } from "./components/Routesacsess";
import SecretPage from "./pages/SecretPage";
import { Toaster } from "react-hot-toast";
import ErrorPage from "./pages/ErrorPage";
import Problemspage from "./pages/Problemspage";


const App = () => {
  const location = useLocation();
  return (
    <>
      <Toaster position="top-center" />
      <div className="text-3xl font-semibold">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/*" element={<AuthPage key={location.pathname} />} />
          <Route
            path="/secret"
            element={
              <SecretRoute>
                <SecretPage />
              </SecretRoute>
            }
          />
          <Route path="/getquestions" element={<Problemspage />}/>
          <Route path="/*" element={<ErrorPage />} /> {/* Catch-all route for undefined paths */}
        </Routes>
      </div>
    </>
  );
};

export default App;
