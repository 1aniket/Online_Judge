import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";



const CompilerPage = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("//Code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  // 🔥 Handle Run
  const handleRun = async () => {
    try {
        setRunning(true);
      const res = await axios.post("http://localhost:5000/api/run", {
        language,
        code,
        testCases: [{ input, output: "" }]
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
    }
    finally {
        setRunning(false);
    }
  };

  // 🔁 Change language
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode("");
  };

  return (
    <div className="h-screen flex flex-col">

      {/* Top Bar */}
      <div className="flex justify-between items-center p-1 border-b">
        <h1 className="text-lg font-semibold">CodeYukti Compiler</h1>

        <select
          value={language}
          onChange={handleLanguageChange}
          className="border p-2 rounded text-sm"
        >
          <option value="cpp">C++</option>
          
        </select>
      </div>

      {/* Editor */}
      <div className="h-[70%]">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* Input / Output */}
      <div className="h-[30%] flex overflow-auto ">

        {/* Input */}
        <div className="w-1/2 p-3">
          <h3 className="font-semibold mb-2 text-sm">Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-full border text-sm p-2 rounded"
            placeholder="Enter input..."
          />
        </div>

        {/* Output */}
        <div className="w-1/2 p-3 ">
          <h3 className="font-semibold mb-2 text-sm">Output</h3>
          <pre className="w-full h-full text-sm bg-gray-100 p-2 rounded overflow-auto">
            {output}
          </pre>
        </div>

      </div>

      {/* Run Button */}
      <div className="p-3">
        <button
          onClick={handleRun}
          className="text-sm px-6 py-2 border rounded hover:bg-black hover:text-white transition"
        >
          {running ? "Running..." : "Run Code"}
        </button>
      </div>

    </div>
  );
};

export default CompilerPage;