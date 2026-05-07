import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import toast from "react-hot-toast";
import "../index.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await signupUser({ firstName, lastName, email, password });
      toast.success("Signup successful ");
      navigate("..");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#07111d]/90 shadow-[0_36px_100px_-46px_rgba(0,0,0,1)] backdrop-blur xl:grid-cols-[0.88fr_1.12fr]">
        <div className="hidden border-r border-white/10 bg-[linear-gradient(180deg,rgba(8,18,32,0.92),rgba(5,12,22,0.98))] p-10 xl:flex xl:flex-col xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              B.Engine
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white">
              Create an account and start coding.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Set up your profile once, then move directly into problems, editor,
              and submissions.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              Minimal account flow with direct access to the coding workspace.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              Built for people who want to solve, test, and iterate quickly.
            </div>
          </div>
        </div>

        <form
          className="flex w-full flex-col gap-6 bg-[linear-gradient(180deg,rgba(13,23,40,0.96),rgba(8,14,25,0.98))] px-6 py-8 text-left sm:px-10 sm:py-10"
          onSubmit={handleFormSubmit}
        >
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Create Account
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Join the Community
            </h1>
            <p className="text-base leading-7 text-slate-400">
              Register once and move straight into the product workflow.
            </p>
          </div>

          <div className="grid w-full gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="inputFirstName" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              First Name
            </label>
            <input
              type="text"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              placeholder="First name"
              name="inputFirstName"
              id="inputFirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="inputLastName" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Last Name
            </label>
            <input
              type="text"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              placeholder="Last name"
              name="inputLastName"
              id="inputLastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="inputEmail" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Email
            </label>
            <input
              type="email"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              placeholder="Email address"
              name="inputEmail"
              id="inputEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="inputPassword" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Password
            </label>
            <input
              type="password"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cyan-400 px-4 py-3 text-lg font-bold text-slate-950 transition hover:bg-cyan-300 sm:w-56"
            type="submit"
          >
            Sign up
          </button>

          <div className="flex items-center justify-start w-full">
            <p className="text-base font-medium text-slate-300">
              Already have an account?{" "}
              <Link to="/auth" className="text-cyan-300 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
