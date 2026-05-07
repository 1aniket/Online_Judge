import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { BarLoader } from "react-spinners";
import { GoogleGenAI } from "@google/genai";
import { CheckCircle2, ChevronDown, CircleAlert, Lock, Play, Send, Bot, X } from "lucide-react";
import AIInsightsPanel from "../components/AIInsightsPanel";
import ReactMarkdown from "react-markdown";
import Confetti from "react-confetti";

const difficultyTone = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const template = {
  cpp: `// Write your code here
#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  python: `import sys

def main():
    data = sys.stdin.read().strip()

    # TODO: process input
    print(data)

if __name__ == "__main__":
    main()`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Example input
        String input = sc.nextLine();

        // Example output
        System.out.println(input);
    }
}`,
};

const ProblemPage = () => {
  const { slug } = useParams();
  console.log("ProblemPage slug:", slug);
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState(template.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isAiOutput, setIsAiOutput] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const publicTestCases = testCases
    .map((tc, index) => ({ ...tc, originalIndex: index }))
    .filter((tc) => tc.isHidden === false);
  const hiddenTestCases = testCases
    .map((tc, index) => ({ ...tc, originalIndex: index }))
    .filter((tc) => tc.isHidden !== false);

  async function aiResponse(data) {
    const responseAI = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"I am a beginner. Look at my code and the terminal error below. Please explain the mistake in 1-2 simple sentences and highlight the line number where that issue might be . Keep it very short."

My Code:
${data.code}

Terminal Error:
${data.terminal}`,
    });
    setOutput(responseAI.text);
  }

  useEffect(() => {
    setCode(template[language] || template.cpp);
  }, [language]);

  useEffect(() => {
    const fetchProblem = async () => {
      
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/questions/${slug}`);
        const data = res.data.data;
        setProblem(data);
        setTestCases(data?.testCases || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  const handleRun = async () => {
    try {
      setRun(true);
      setIsAiOutput(false);
      setShowConfetti(false);
      setOutput("Running...");
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/run`, {
        language,
        code,
        testCases: [{ input, output: "" }],
      });

      const result = res.data;

      if (result.success) {
        setOutput(result.results?.[0]?.actual || "No output");
      } else {
        setIsAiOutput(true);
        setOutput("AI is analyzing the error...");
        await aiResponse({
          code,
          terminal: result.error,
        });
      }
    } catch (err) {
      console.error(err);
      setOutput("Execution error");
    } finally {
      setRun(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmit(true);
      setIsAiOutput(false);
      setShowConfetti(false);
      setOutput("Submitting...");
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to submit");
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/run`, {
        language,
        code,
        testCases: problem?.testCases,
      });

      const result = res.data;
      if (!result.success) {
        setTestCases((prev) =>
          prev.map((tc) => ({
            ...tc,
            output: result.error || "Error",
            status: "Failed",
          })),
        );
        setOutput(result.error || "Execution Error");
        return;
      }

      const updated = (problem?.testCases || []).map((tc, index) => ({
        ...tc,
        output: result.results[index]?.actual || "",
        status: result.results[index]?.passed ? "Passed" : "Failed",
      }));

      setTestCases(updated);
      setOutput(result.status);
      
      if (result.status === "Accepted") {
        setShowConfetti(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setSubmit(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiFeedback("");
    try {
      const responseAI = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert programming tutor. Analyze the following ${language} code for the problem "${problem?.title || "Coding Problem"}". Provide the Time Complexity, Space Complexity, and point out any potential bugs or edge cases. Do NOT provide the direct solution, but give hints to guide the user. Format the response using Markdown.\n\nCode:\n${code}`,
      });
      setAiFeedback(responseAI.text);
    } catch (err) {
      console.error("AI Analysis error:", err);
      setAiFeedback("Failed to analyze code. Please check your API key or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!problem) return <div className="p-4">Problem not found</div>;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
        />
      )}
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur sm:p-6">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{problem.title}</h1>
            <p
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${difficultyTone[problem.difficulty] || difficultyTone.hard}`}
            >
              {problem.difficulty}
            </p>
          </div>

          <p className="mb-6 whitespace-pre-line text-base leading-7 text-slate-300">
            {problem.description}
          </p>

          {problem.examples?.map((ex, index) => (
            <div
              key={index}
              className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_36px_-24px_rgba(0,0,0,0.9)]"
            >
              <h6 className="text-lg font-semibold text-white">Example {index + 1}</h6>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                <div>
                  <p className="mb-1 font-semibold text-slate-100">Input</p>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-xl bg-[#0a1220] p-3 text-slate-200">
                    {ex.input.replace(/\\n/g, "\n")}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-slate-100">Output</p>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-xl bg-[#0a1220] p-3 text-slate-200">
                    {ex.output.replace(/\\n/g, "\n")}
                  </pre>
                </div>
                {ex.explanation && (
                  <div>
                    <p className="mb-1 font-semibold text-slate-100">Explanation</p>
                    <pre className="whitespace-pre-wrap rounded-xl bg-[#0a1220] p-3 text-slate-200">
                      {ex.explanation.replace(/\\n/g, "\n")}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}

          {problem.constraints && (
            <div className="mt-6">
              <h3 className="font-semibold text-white">Constraints</h3>
              <pre className="mt-2 overflow-auto rounded-2xl bg-[#0a1220] p-4 text-sm leading-7 text-slate-200 shadow-sm">
                {problem.constraints.replace(/\\n/g, "\n")}
              </pre>
            </div>
          )}
        </section>

        <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Workspace
              </p>
              <h2 className="text-xl font-semibold text-white">Write and test your solution</h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Language</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none rounded-full border border-white/10 bg-[#0b1422] py-2 pl-4 pr-10 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="min-h-[360px] flex-1">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          </div>

          <div className="grid gap-0 border-t border-white/10 lg:grid-cols-2">
            <div className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
              <h3 className="mb-2 text-lg font-semibold text-white">Input</h3>
              <textarea
                className="min-h-40 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-100"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste custom input here"
              />
            </div>

            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-white">Output</h3>
              {isAiOutput ? (
                <div className="min-h-40 w-full overflow-auto rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                  <div className="mb-3 flex items-center gap-2 font-semibold text-rose-300">
                    <Bot size={16} />
                    <span>AI Error Explanation</span>
                  </div>
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-rose-300" {...props} />,
                      code: ({ node, inline, children, ...props }) =>
                        inline ? (
                          <code className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-xs text-rose-200" {...props}>{children}</code>
                        ) : (
                          <pre className="my-2 overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-sm text-rose-200"><code {...props}>{children}</code></pre>
                        ),
                    }}
                  >
                    {output}
                  </ReactMarkdown>
                </div>
              ) : (
                <div
                  className={`flex min-h-40 w-full flex-col overflow-auto rounded-2xl bg-slate-950 p-4 text-sm ${
                    output === "Accepted"
                      ? "text-emerald-400"
                      : output === "Wrong Answer" || output.includes("Failed") || output.includes("Error") || output === "Execution Error"
                        ? "text-rose-400"
                        : "text-slate-100"
                  }`}
                >
                  {output === "Accepted" || output === "Wrong Answer" ? (
                    <div className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider">
                      {output === "Accepted" ? <CheckCircle2 size={24} /> : <CircleAlert size={24} />}
                      {output}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono">{output}</pre>
                  )}
                </div>
              )}
            </div>
          </div>

          {testCases.length > 0 && (
            <div className="border-t border-white/10 px-4 py-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Test Cases
              </h3>
              {publicTestCases.length > 0 && (
                <div className="mb-4 grid gap-2 sm:grid-cols-2">
                  {publicTestCases.map((tc, index) => (
                    <div
                      key={`public-${index}-${tc.input}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-semibold text-white">
                          Visible Case {tc.originalIndex + 1}
                        </p>
                        {tc.status === "Passed" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 size={16} />
                            Passed
                          </span>
                        ) : tc.status === "Failed" ? (
                          <span className="inline-flex items-center gap-1 text-rose-600">
                            <CircleAlert size={16} />
                            Failed
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </div>
                      <pre className="whitespace-pre-wrap rounded-xl bg-[#0a1220] p-2 text-xs text-slate-300">
                        {tc.input || "No input"}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {hiddenTestCases.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[88px_120px_1fr_auto] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span>Case</span>
                    <span>Type</span>
                    <span>Preview</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-white/10">
                    {hiddenTestCases.map((tc, index) => (
                      <div
                        key={`hidden-${index}`}
                        className="grid grid-cols-[88px_120px_1fr_auto] items-center gap-3 bg-white/[0.02] px-4 py-3 text-sm text-slate-300"
                      >
                        <span className="font-semibold text-white">
                          Case {tc.originalIndex + 1}
                        </span>
                        <span className="text-slate-500">Hidden</span>
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <Lock size={16} />
                          Locked
                        </span>
                        {tc.status === "Passed" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 size={16} />
                            Passed
                          </span>
                        ) : tc.status === "Failed" ? (
                          <span className="inline-flex items-center gap-1 text-rose-600">
                            <CircleAlert size={16} />
                            Failed
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-white/10 p-4">
            <button
              onClick={handleRun}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
            >
              <Play size={16} />
              {run ? <BarLoader color="orange" /> : "Run Code"}
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <Send size={16} />
              {submit ? <BarLoader color="orange" /> : "Submit"}
            </button>
          </div>
        </section>

        {/* AI Floating Action Button */}
        <button
          onClick={() => setIsAIPanelOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_8px_30px_-8px_rgba(124,58,237,0.8)] transition-transform hover:scale-110 hover:bg-violet-500"
          title="Ask AI"
        >
          <Bot size={24} />
        </button>

        {/* AI Modal Popup */}
        {isAIPanelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg">
              <button
                onClick={() => setIsAIPanelOpen(false)}
                className="absolute -top-10 right-0 z-10 flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                <X size={20} />
                Close
              </button>
              <div className="h-[600px] max-h-[80vh] w-full overflow-hidden rounded-[22px] shadow-2xl">
                <AIInsightsPanel
                  isAnalyzing={isAnalyzing}
                  feedback={aiFeedback}
                  onAnalyze={handleAnalyze}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
