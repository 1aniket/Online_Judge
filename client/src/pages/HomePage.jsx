import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenText,
  Code2,
  Orbit,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import "../index.css";

const chipClass =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300";

const actionPrimary =
  "inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300";

const actionSecondary =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white";

const cardClass =
  "rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_-32px_rgba(8,15,28,0.95)] backdrop-blur";

const HomePage = () => {
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from local storage:", error);
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(8,15,28,0.92))] shadow-[0_32px_90px_-40px_rgba(0,0,0,0.95)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />
                <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-blue-500/12 blur-3xl" />
              </div>

              <div className="relative max-w-3xl">
                <div className="mb-5 flex flex-wrap gap-3">
                  <span className={chipClass}>
                    <Sparkles size={16} className="text-cyan-300" />
                    Futuristic Practice Space
                  </span>
                  <span className={chipClass}>
                    <Orbit size={16} className="text-blue-300" />
                    Real-time coding workflow
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl">
                  Modern coding workspace for problems, execution, and fast iteration.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  Open a problem, write code in Monaco, run it instantly, and keep
                  the loop tight. The interface is designed to stay minimal while
                  still feeling sharp and technical.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/getquestions" className={actionPrimary}>
                    <BookOpenText size={16} />
                    Open Problems
                  </Link>
                  <Link to="/compiler" className={actionSecondary}>
                    <TerminalSquare size={16} />
                    Open Compiler
                  </Link>
                  {user === "admin" && (
                    <Link to="/admin" className={actionSecondary}>
                      <ShieldCheck size={16} />
                      Admin Panel
                    </Link>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className={chipClass}>C++</div>
                  <div className={chipClass}>Java</div>
                  <div className={chipClass}>Python</div>
                  <div className={chipClass}>Problem + IDE workflow</div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-4 lg:border-l lg:border-t-0">
              <div className="h-full rounded-[26px] border border-white/10 bg-[#09111d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Workspace Preview
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-200">Two Sum.cpp</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Code2 size={16} className="text-cyan-300" />
                      C++
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950"
                    >
                      <Zap size={14} />
                      Run
                    </button>
                  </div>

                  <div className="grid min-h-[420px] md:grid-cols-[0.9fr_1.1fr]">
                    <div className="border-b border-white/10 bg-[#0b1322] p-4 md:border-b-0 md:border-r">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Problem
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Return the indices of the two numbers that add up to the target.
                        Each input has exactly one valid solution.
                      </p>

                      <div className="mt-5 rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                          Example
                        </p>
                        <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                          nums = [2, 7, 11, 15]
                          {"\n"}target = 9
                          {"\n"}output = [0, 1]
                        </pre>
                      </div>
                    </div>

                    <div className="bg-[#0a101b] p-4 font-mono text-sm leading-7 text-slate-300">
                      <pre className="whitespace-pre-wrap">{`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }

    return {};
}`}</pre>

                      <div className="mt-5 rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300">
                          Output
                        </p>
                        <p className="mt-2 text-sm text-emerald-200">Accepted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr_0.95fr]">
          <Link to="/getquestions" className={`${cardClass} transition hover:-translate-y-1 hover:border-cyan-300/30`}>
            <div className="inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-cyan-300">
              <BookOpenText size={20} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">Problems</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Move from a concise problem list directly into the full coding workspace.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
              Start solving
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link to="/compiler" className={`${cardClass} transition hover:-translate-y-1 hover:border-cyan-300/30`}>
            <div className="inline-flex rounded-2xl border border-blue-300/20 bg-blue-400/10 p-3 text-blue-300">
              <TerminalSquare size={20} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">Compiler</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use a focused scratch environment when you want to validate an idea fast.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
              Open editor
              <ArrowRight size={16} />
            </span>
          </Link>

          <div className={cardClass}>
            <div className="inline-flex rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3 text-violet-300">
              <Sparkles size={20} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">Workflow</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Read the prompt, switch language when needed, run code, then submit
              against visible and hidden cases without leaving the page.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <div>01. Read</div>
              <div>02. Write</div>
              <div>03. Run</div>
              <div>04. Submit</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
