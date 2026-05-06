import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { AdminRoute} from "./components/Routesacsess";
import { Toaster } from "react-hot-toast";
import ErrorPage from "./pages/ErrorPage";
import Problemspage from "./pages/Problemspage";
import CreateQuestion from "./pages/QuestionCreate";
import AdminPage from "./pages/AdminPage";
import DeleteQuestion from "./pages/QuestionDelete";
import ProblemDescPage from "./pages/ProblemDescPage";
import CompilerPage from "./pages/CompilerPage";
import AppShell from "./components/AppShell";


const App = () => {
  const location = useLocation();
  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <AppShell>
                <HomePage />
              </AppShell>
            }
          />
          <Route path="/auth/*" element={<AuthPage key={location.pathname} />} />

          <Route
            path="/getquestions"
            element={
              <AppShell>
                <Problemspage />
              </AppShell>
            }
          />
          <Route
            path="/questions/:slug"
            element={
              <AppShell>
                <ProblemDescPage />
              </AppShell>
            }
          />
          <Route
            path="/compiler"
            element={
              <AppShell>
                <CompilerPage />
              </AppShell>
            }
          />
          <Route
            path="/admin"
            element={
              <AppShell>
                <AdminRoute><AdminPage /></AdminRoute>
              </AppShell>
            }
          />
          <Route
            path="/create-question"
            element={
              <AppShell>
                <AdminRoute><CreateQuestion /></AdminRoute>
              </AppShell>
            }
          />
          <Route
            path="/delete-question"
            element={
              <AppShell>
                <AdminRoute><DeleteQuestion /></AdminRoute>
              </AppShell>
            }
          />
          <Route
            path="/*"
            element={
              <AppShell>
                <ErrorPage />
              </AppShell>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
