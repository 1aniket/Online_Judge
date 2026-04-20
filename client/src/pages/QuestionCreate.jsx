import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateQuestion = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "",
    companies: "",
    constraints: "",
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", output: "", isHidden: false }],
  });

  // Generic change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Example change
  const handleExampleChange = (index, field, value) => {
    const updated = [...formData.examples];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, examples: updated }));
  };

  // Testcase change
  const handleTestCaseChange = (index, field, value) => {
    const updated = [...formData.testCases];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, testCases: updated }));
  };

  // Add new example
  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  // Add new test case
  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: "", output: "", isHidden: false },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
      companies: formData.companies.split(",").map((c) => c.trim()),
    };

    console.log("Final Payload:", payload);

    try {
      const token = localStorage.getItem("token"); 

      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        companies: formData.companies
          ? formData.companies
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
      };

      const response = await axios.post(
        "http://localhost:5000/api/questions/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        },
      );

      toast.success("Question created successfully!");
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-2 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 rounded-xl border shadow-sm space-y-6"
      >
        <h1 className="text-2xl font-semibold">Create Question</h1>

        {/* Basic Info */}
        <input
          name="title"
          placeholder="Title"
          className="w-full border-b p-2 outline-none"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
          onChange={handleChange}
        />

        <select
          name="difficulty"
          className="border p-2 rounded"
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Metadata */}
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full border-b p-2 outline-none"
          onChange={handleChange}
        />

        <input
          name="companies"
          placeholder="Companies (comma separated)"
          className="w-full border-b p-2 outline-none"
          onChange={handleChange}
        />

        <input
          name="constraints"
          placeholder="Constraints"
          className="w-full border-b p-2 outline-none"
          onChange={handleChange}
        />

        {/* Examples */}
        <div>
          <h2 className="font-medium">Examples</h2>
          {formData.examples.map((ex, i) => (
            <div key={i} className="border p-3 rounded mt-2 space-y-2">
              <input
                placeholder="Input"
                className="w-full border-b"
                onChange={(e) =>
                  handleExampleChange(i, "input", e.target.value)
                }
              />
              <input
                placeholder="Output"
                className="w-full border-b"
                onChange={(e) =>
                  handleExampleChange(i, "output", e.target.value)
                }
              />
              <input
                placeholder="Explanation"
                className="w-full border-b"
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

        {/* Test Cases */}
        <div>
          <h2 className="font-medium">Test Cases</h2>
          {formData.testCases.map((tc, i) => (
            <div key={i} className="border p-3 rounded mt-2 space-y-2">
              <input
                placeholder="Input"
                className="w-full border-b"
                onChange={(e) =>
                  handleTestCaseChange(i, "input", e.target.value)
                }
              />
              <input
                placeholder="Output"
                className="w-full border-b"
                onChange={(e) =>
                  handleTestCaseChange(i, "output", e.target.value)
                }
              />
              <label className="text-sm">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleTestCaseChange(i, "isHidden", e.target.checked)
                  }
                />{" "}
                Hidden
              </label>
            </div>
          ))}
          <button type="button" onClick={addTestCase}>
            + Add Test Case
          </button>
        </div>

        {/* Submit */}
        <button className="w-full bg-black text-white py-2 rounded">
          Create Question
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;
