import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // show toast
    toast("Redirecting to Home Page...", {
      icon: "⏳",
    });

    const timer = setTimeout(() => {
      navigate("/");
      //toast.success("Redirected to Home Page");
    }, 3000);

    // cleanup (important)
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <h1 className="text-4xl text-red-500 sketch-font text-center">
        404 <br /> Have you lost buddy ?
      </h1>
    </div>
  );
};

export default ErrorPage;