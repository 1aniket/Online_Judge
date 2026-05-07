import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";

const difficultyStyles = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/questions`);
        setProblems(res.data.data);
      } catch (err) {
        console.error("Error fetching problems", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 shadow-[0_16px_36px_-24px_rgba(0,0,0,0.95)]">
          <LoaderCircle className="animate-spin" size={18} />
          Loading problems
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Problem Set
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Choose a problem and start solving.</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300">
            This list is currently simple and direct. Each row takes you into the
            full coding workspace with the prompt, examples, editor, and run flow.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur">
          <div className="grid grid-cols-[72px_1fr_auto_auto] gap-3 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>No.</span>
            <span>Problem</span>
            <span className="hidden sm:block">Difficulty</span>
            <span className="text-right">Open</span>
          </div>

          <div className="divide-y divide-white/10">
            {problems?.map((problem, index) => (
              <Link
                key={problem.slug}
                to={`/questions/${problem.slug}`}
                className="grid grid-cols-[72px_1fr_auto] items-center gap-3 px-6 py-5 transition hover:bg-white/[0.03] sm:grid-cols-[72px_1fr_auto_auto]"
              >
                <span className="text-sm font-semibold text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-100 sm:text-lg">
                    {problem.title}
                  </h2>
                </div>
                <span
                  className={`hidden rounded-full px-3 py-1 text-xs font-semibold uppercase sm:inline-flex ${difficultyStyles[problem.difficulty] || difficultyStyles.hard}`}
                >
                  {problem.difficulty}
                </span>
                <span className="inline-flex justify-end text-cyan-300">
                  <ArrowRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
