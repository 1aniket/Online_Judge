import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const DeleteQuestion = () => {
  const [questionId, setQuestionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!questionId) {
      toast.error("Please enter question ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      await axios.delete(`${import.meta.env.VITE_SERVER_URI}/api/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Question deleted successfully");
      setQuestionId("");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl space-y-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur">
        <div className="inline-flex rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3 text-rose-300">
          <Trash2 size={22} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Delete Question</h1>
          <p className="text-sm leading-7 text-slate-300">
            Enter the question identifier exactly as stored in the database. This
            removes the question permanently.
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter Question ID"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-100 outline-none"
        />

        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full rounded-full bg-rose-600 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteQuestion;
