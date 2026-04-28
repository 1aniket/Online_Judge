import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

  // ---------------- HANDLERS ----------------

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
      testCases: [
        ...prev.testCases,
        { input: "", output: "", isHidden: false },
      ],
    }));
    setSelectedCase(formData.testCases.length); // auto-select new one
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

      await axios.post(
        "http://localhost:5000/api/questions/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Question created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="h-[70%] text-sm w-[70%] border-2 p-2 rounded-lg flex flex-col gap-2"
      >
        <h1 className="text-2xl font-semibold">Create Question</h1>

        {/* ---------------- TABS ---------------- */}
        <div className="flex gap-6 border-b">
          {["problem", "examples", "testcases"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ---------------- PROBLEM ---------------- */}
        {activeTab === "problem" && (
          <div className="space-y-4">
            <input
              name="title"
              value={formData.title}
              placeholder="Title"
              className="w-full border-b p-2"
              onChange={handleChange}
            />

            <input
              name="slug"
              value={formData.slug}
              placeholder="Slug"
              className="w-full border-b p-2"
              onChange={handleChange}
            />

            <textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <input
              name="tags"
              value={formData.tags}
              placeholder="Tags (comma separated)"
              className="w-full border-b p-2"
              onChange={handleChange}
            />

            <input
              name="companies"
              value={formData.companies}
              placeholder="Companies (comma separated)"
              className="w-full border-b p-2"
              onChange={handleChange}
            />

            <input
              name="constraints"
              value={formData.constraints}
              placeholder="Constraints"
              className="w-full border-b p-2"
              onChange={handleChange}
            />
          </div>
        )}

        {/* ---------------- EXAMPLES ---------------- */}
        {activeTab === "examples" && (
          <div>
            {formData.examples.map((ex, i) => (
              <div key={i} className="border p-3 rounded mb-3 space-y-2">
                <input
                  value={ex.input}
                  placeholder="Input"
                  onChange={(e) =>
                    handleExampleChange(i, "input", e.target.value)
                  }
                />
                <input
                  value={ex.output}
                  placeholder="Output"
                  onChange={(e) =>
                    handleExampleChange(i, "output", e.target.value)
                  }
                />
                <input
                  value={ex.explanation}
                  placeholder="Explanation"
                  onChange={(e) =>
                    handleExampleChange(i, "explanation", e.target.value)
                  }
                />
              </div>
            ))}
            <button type="button" onClick={addExample}>
              + Add Example
            </button>
          </div>
        )}

        {/* ---------------- TEST CASES ---------------- */}
        {activeTab === "testcases" && (
          <div className="flex gap-4">

            {/* LEFT SIDE */}
            <div className="w-1/2 border p-4 rounded space-y-3">
              <h3 className="font-semibold">Test Case Editor</h3>

              <textarea
                className="w-full border p-2"
                value={formData.testCases[selectedCase]?.input || ""}
                onChange={(e) =>
                  handleTestCaseChange(selectedCase, "input", e.target.value)
                }
                placeholder="Input"
              />

              <input
                className="w-full border p-2"
                value={formData.testCases[selectedCase]?.output || ""}
                onChange={(e) =>
                  handleTestCaseChange(selectedCase, "output", e.target.value)
                }
                placeholder="Output"
              />

              <label>
                <input
                  type="checkbox"
                  checked={
                    formData.testCases[selectedCase]?.isHidden || false
                  }
                  onChange={(e) =>
                    handleTestCaseChange(
                      selectedCase,
                      "isHidden",
                      e.target.checked
                    )
                  }
                />
                Hidden
              </label>

              <button
                type="button"
                onClick={addTestCase}
                className="border px-3 py-1"
              >
                + Add Test Case
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2">
              <div className="flex flex-wrap gap-2">
                {formData.testCases.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCase(i)}
                    className={`px-4 py-2 border rounded-full cursor-pointer ${
                      selectedCase === i ? "bg-black text-white" : ""
                    }`}
                  >
                    TC {i + 1}
                  </div>
                ))}
              </div>

              {/* PREVIEW */}
              <div className="mt-4 border p-3 rounded">
                <h4 className="font-semibold">
                  Test Case {selectedCase + 1}
                </h4>
                <pre className="bg-gray-100 p-2 mt-2">
                  {formData.testCases[selectedCase]?.input}
                </pre>
                <p className="mt-2">
                  Output: {formData.testCases[selectedCase]?.output}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- SUBMIT ---------------- */}
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Create Question
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;