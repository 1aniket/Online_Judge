import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { ChevronDown, LoaderCircle, Play } from "lucide-react";
import AIInsightsPanel from "../components/AIInsightsPanel";

const CompilerPage = () => {
  const templateCode = {
    cpp: `#include <iostream>
using namespace std; 
int main(){
// Your code here

}`,
    java: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
} `,
    python: `# Your code here  
`,
  };

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(templateCode.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  const handleRun = async () => {
    try {
      setRunning(true);
      const res = await axios.post("http://localhost:5000/api/run", {
        language,
        code,
        testCases: [{ input, output: "" }],
      });

      const result = res.data;

      if (result.success) {
        setOutput(result.results?.[0]?.actual || "No output");
      } else {
        setOutput(result.error || "Error");
      }
    } catch (err) {
      console.error(err);
      setOutput("Execution failed");
    } finally {
      setRunning(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiFeedback("");

    // TODO: Replace this simulated timeout with an actual API call to your backend
    // e.g., const res = await axios.post("http://localhost:5000/api/analyze", { code, language });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiFeedback("### Complexity Analysis\n\n**Time Complexity:** O(N)\n\n**Space Complexity:** O(1)\n\n**Hint:**\nMake sure to handle edge cases where the input is completely empty or null.");
    }, 2500);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    setCode(templateCode[language]);
  }, [language]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Compiler
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Run code without opening a problem.</h1>
          </div>

          <div className="relative">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none rounded-full border border-white/10 bg-[#0b1422] py-2 pl-4 pr-10 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              style={{ colorScheme: "dark" }}
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="h-[420px] border-b border-white/10 md:h-[520px] lg:col-span-2 lg:border-b-0 lg:border-r">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          </div>
          
          <div className="h-[460px] bg-black/20 p-4 md:h-[520px] lg:col-span-1">
            <AIInsightsPanel
              isAnalyzing={isAnalyzing}
              feedback={aiFeedback}
              onAnalyze={handleAnalyze}
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-white/10 lg:grid-cols-2">
          <div className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-40 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-100"
              placeholder="Enter input..."
            />
          </div>

          <div className="p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Output</h3>
            <pre className="min-h-40 w-full overflow-auto rounded-2xl bg-slate-950 p-3 text-sm text-slate-100">
              {output}
            </pre>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleRun}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-400 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {running ? <LoaderCircle className="animate-spin" size={16} /> : <Play size={16} />}
            {running ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
