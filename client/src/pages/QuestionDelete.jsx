import { useState } from "react";
import axios from "axios";

const DeleteQuestion = () => {
  const [questionId, setQuestionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!questionId) {
      alert("Please enter question ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.delete(
        `http://localhost:5000/api/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Deleted:", res.data);
      alert("Question deleted successfully");

      setQuestionId("");
    } catch (error) {
      console.error("Delete Error:", error);
      alert(
        error.response?.data?.message || "Failed to delete question"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl p-8 shadow-sm space-y-6 text-center">

        <h1 className="text-2xl font-semibold">Delete Question</h1>

        <input
          type="text"
          placeholder="Enter Question ID"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          className="w-full border-b p-2 outline-none text-center"
        />

        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full border py-2 rounded hover:bg-red-500 hover:text-white transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>

      </div>
    </div>
  );
};

export default DeleteQuestion;