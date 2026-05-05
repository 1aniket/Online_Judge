import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast("Redirecting to Home Page...", {
      icon: "⌛",
    });

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="max-w-xl rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-10 text-center shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-center text-4xl font-semibold tracking-tight text-white">
          This page does not exist.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          You will be redirected to the home page automatically.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Go Home Now
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
