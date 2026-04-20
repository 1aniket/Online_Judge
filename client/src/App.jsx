import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import HomePage from "./pages/HomePage";
import { AdminRoute} from "./components/Routesacsess";
import { Toaster } from "react-hot-toast";
import ErrorPage from "./pages/ErrorPage";
import Problemspage from "./pages/Problemspage";
import CreateQuestion from "./pages/QuestionCreate";
import AdminPage from "./pages/AdminPage";
import DeleteQuestion from "./pages/QuestionDelete";


const App = () => {
  const location = useLocation();
  return (
    <>
      <Toaster position="top-center" />
      <div className="text-3xl font-semibold">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/*" element={<AuthPage key={location.pathname} />} />
        
          <Route path="/getquestions" element={<Problemspage />}/>
          <Route path="/admin" element={<AdminRoute><AdminPage/></AdminRoute>} />
          <Route path="/create-question" element={<AdminRoute><CreateQuestion/></AdminRoute>} />
          <Route path="/delete-question" element={<AdminRoute><DeleteQuestion/></AdminRoute>} />
          <Route path="/*" element={<ErrorPage />} /> {/* Catch-all route for undefined paths */}
        </Routes>
      </div>
    </>
  );
};

export default App;
