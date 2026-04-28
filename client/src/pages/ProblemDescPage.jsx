import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { BarLoader } from "react-spinners";

const ProblemPage = () => {
  const { id } = useParams();
  const template = {
    cpp: `// Write your code here \n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
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
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [testCases, setTestCases] = useState([]);

  const [code, setCode] = useState(template[language]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Update code template when language changes
  useEffect(() => {
    setCode(template[language] || template["cpp"]);
  }, [language]);

  // 🔥 Fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/questions/${id}`,
        );
        console.log("Fetched problem details:", res.data.data);
        setProblem(res.data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // 🔥 Run Code
  const handleRun = async () => {
    try {
      setRun(true);
      const res = await axios.post("http://localhost:5000/api/run", {
        language,
        code,
        testCases: [{ input, output: "" }],
      });
      console.log("Run Details:", { code, input, response: res.data });

      const result = res.data;

      if (result.success) {
        setOutput(result.results?.[0]?.actual || "No output");
      } else {
        setOutput(result.error);
      }
      setRun(false);
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
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to submit");

        return;
      }
      const res = await axios.post("http://localhost:5000/api/run", {
        language,
        code,
        testCases: problem?.testCases, // 👈 IMPORTANT (instead of testCases)
      });

      const result = res.data;
      console.log("Submission Details:", {
        code,
        testCases: problem?.testCases,
        response: result,
      });
      if (!result.success) {
        setTestCases((prev) =>
          prev.map((tc) => ({
            ...tc,
            output: result.error || "Error",
          })),
        );
        return;
      }

      // 🔥 Update UI with results
      const updated = testCases.map((tc, index) => ({
        ...tc,
        output: result.results[index]?.actual || "",
        status: result.results[index]?.passed ? "Passed" : "Failed",
      }));

      setTestCases(updated);

      // Optional: show final verdict
      setOutput(result.status);
      //alert(result.status); // Accepted / Wrong Answer
      setSubmit(false);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setSubmit(false);
    }
  };

  // Loading states
  if (loading) return <div className="p-4">Loading...</div>;
  if (!problem) return <div className="p-4">Problem not found</div>;

  return (
    <div className="h-screen flex">
      {/* LEFT - Problem Description */}
      <div className="w-1/2 border-r p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>

        <p
          className={`mb-4 text-sm font-bold  rounded-full flex p-2 w-max text-${problem.difficulty === "easy" ? "green" : problem.difficulty === "medium" ? "yellow" : "red"}-700`}
        >
          {problem.difficulty}
        </p>

        <p className="mb-4 text-sm whitespace-pre-line">
          {problem.description}
        </p>

        {/* Examples */}
        {problem.examples?.map((ex, index) => (
          <div key={index} className="mb-4">
            <h6 className="font-semibold text-xl">Example {index + 1}</h6>
            <pre className="bg-gray-100 p-2 rounded text-xl font-light overflow-auto">
              <p className="flex font-bold ">Input:</p>
              {ex.input.replace(/\\n/g, "\n")}
              <p className="flex font-bold ">Output:</p>
              {ex.output.replace(/\\n/g, "\n")}
              {ex.explanation && (
                <p className="flex font-bold ">Explanation:</p>
              )}
              {ex.explanation && (
                <pre className="whitespace-pre-wrap">
                  {ex.explanation.replace(/\\n/g, "\n")}
                </pre>
              )}
            </pre>
          </div>
        ))}

        {/* Constraints */}
        {problem.constraints && (
          <div className="mt-4 text-xl">
            <h3 className="font-semibold">Constraints</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {problem.constraints.replace(/\\n/g, "\n")}
            </pre>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex flex-col">
        {/* Editor (70%) */}
        <div className="flex items-center justify-end gap-2 mb-2 px-2 py-1">
          <label className="text-sm font-medium">Language:</label>

          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value;
              setLanguage(lang);
              setCode(template[lang]); // 🔥 switch template
            }}
            className="border text-sm text-center p-1 rounded"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className="h-[60%]">
          <Editor
            height="100%"
            language={
              ["cpp", "python", "javascript"].includes(problem.language)
                ? problem.language
                : "cpp"
            }
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
          />
        </div>

        {/* Input / Output (30%) */}
        <div className="h-[30%] flex ">
          {/* Input */}
          <div className="w-1/2 p-2">
            <h3 className="font-semibold text-xl mb-2">Input</h3>
            <textarea
              className="w-full h-[80%] text-lg bg-gray-100 p-2 rounded overflow-auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Output */}
          <div className="w-1/2 p-2 border-l">
            <h3 className="font-semibold mb-2 text-xl">Output</h3>
            <pre className="w-full h-[80%] text-lg bg-gray-100 p-2 rounded overflow-auto">
              {output}
            </pre>
          </div>
        </div>

        {/* Run Button */}
        <div className="p-2 flex gap-2">
          <button
            onClick={handleRun}
            className="px-4 py-2 flex  text-xl border items-center rounded hover:bg-black hover:text-white transition"
          >
            {run ? <BarLoader color="orange" /> : "Run Code"}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 flex  items-center py-2  text-xl border rounded hover:bg-black hover:text-white transition"
          >
            {submit ? <BarLoader color="orange" /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
