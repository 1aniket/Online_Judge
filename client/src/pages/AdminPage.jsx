import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FilePlus2, Trash2 } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Question management</h1>
          <p className="text-base leading-7 text-slate-300">
            Create new problems, add examples and hidden test cases, or remove an
            existing question.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/create-question"
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <div className="mb-4 inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-cyan-300">
              <FilePlus2 size={22} />
            </div>
            <h2 className="text-xl font-semibold text-white">Create Question</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Build the prompt, examples, difficulty, and hidden evaluation cases.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
              Open editor
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/delete-question"
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur transition hover:-translate-y-1 hover:border-rose-300/30"
          >
            <div className="mb-4 inline-flex rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3 text-rose-300">
              <Trash2 size={22} />
            </div>
            <h2 className="text-xl font-semibold text-white">Delete Question</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Remove a question by identifier. This action is destructive.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-300">
              Open delete flow
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
