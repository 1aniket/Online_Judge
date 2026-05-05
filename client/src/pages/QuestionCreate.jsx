import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

const CreateQuestion = () => {
  const [activeTab, setActiveTab] = useState("problem");
  const [selectedCase, setSelectedCase] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    difficulty: "easy",
    tags: "",
    companies: "",
    constraints: "",
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", output: "", isHidden: false }],
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...formData.examples];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, examples: updated }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...formData.testCases];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, testCases: updated }));
  };

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "", isHidden: false }],
    }));
    setSelectedCase(formData.testCases.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        companies: formData.companies
          ? formData.companies.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
      };

      await axios.post("http://localhost:5000/api/questions/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Question created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-5xl flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 text-sm shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur sm:p-6"
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Create Question
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Compose a new coding problem.</h1>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-3">
          {["problem", "examples", "testcases"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 capitalize transition ${
                activeTab === tab
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "problem" && (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="title"
              value={formData.title}
              placeholder="Title"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
              onChange={handleChange}
            />

            <input
              name="slug"
              value={formData.slug}
              placeholder="Slug"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
              onChange={handleChange}
            />

            <textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              className="min-h-40 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100 md:col-span-2"
              onChange={handleChange}
            />

            <div className="relative">
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[#0b1422] py-3 pl-3 pr-10 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                style={{ colorScheme: "dark" }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <input
              name="tags"
              value={formData.tags}
              placeholder="Tags (comma separated)"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
              onChange={handleChange}
            />

            <input
              name="companies"
              value={formData.companies}
              placeholder="Companies (comma separated)"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
              onChange={handleChange}
            />

            <input
              name="constraints"
              value={formData.constraints}
              placeholder="Constraints"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100 md:col-span-2"
              onChange={handleChange}
            />
          </div>
        )}

        {activeTab === "examples" && (
          <div>
            {formData.examples.map((ex, i) => (
              <div key={i} className="mb-3 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <input
                  value={ex.input}
                  placeholder="Input"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
                  onChange={(e) => handleExampleChange(i, "input", e.target.value)}
                />
                <input
                  value={ex.output}
                  placeholder="Output"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
                  onChange={(e) => handleExampleChange(i, "output", e.target.value)}
                />
                <input
                  value={ex.explanation}
                  placeholder="Explanation"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
                  onChange={(e) => handleExampleChange(i, "explanation", e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addExample}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
            >
              + Add Example
            </button>
          </div>
        )}

        {activeTab === "testcases" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-semibold text-white">Test Case Editor</h3>

              <textarea
                className="min-h-40 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
                value={formData.testCases[selectedCase]?.input || ""}
                onChange={(e) => handleTestCaseChange(selectedCase, "input", e.target.value)}
                placeholder="Input"
              />

              <input
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100"
                value={formData.testCases[selectedCase]?.output || ""}
                onChange={(e) => handleTestCaseChange(selectedCase, "output", e.target.value)}
                placeholder="Output"
              />

              <label className="text-slate-300">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.testCases[selectedCase]?.isHidden || false}
                  onChange={(e) =>
                    handleTestCaseChange(selectedCase, "isHidden", e.target.checked)
                  }
                />
                Hidden
              </label>

              <button
                type="button"
                onClick={addTestCase}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
              >
                + Add Test Case
              </button>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {formData.testCases.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCase(i)}
                    className={`cursor-pointer rounded-full border px-4 py-2 ${
                      selectedCase === i
                        ? "border-cyan-300/30 bg-cyan-400 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-300"
                    }`}
                  >
                    TC {i + 1}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <h4 className="font-semibold text-white">Test Case {selectedCase + 1}</h4>
                <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-[#0a1220] p-3 text-slate-200">
                  {formData.testCases[selectedCase]?.input}
                </pre>
                <p className="mt-2 text-slate-300">Output: {formData.testCases[selectedCase]?.output}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Create Question
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;
