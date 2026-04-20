import React from 'react'
import CreateQuestion from './QuestionCreate'
import { Link } from 'react-router-dom'

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl p-8 shadow-sm text-center space-y-6">

        <h1 className="text-2xl font-semibold">Admin Panel</h1>

        <div className="space-y-4">

          <Link
            to="/create-question"
            className="block w-full border py-2 rounded hover:bg-black hover:text-white transition"
          >
            Create Question
          </Link>

          <Link
            to="/delete-question"
            className="block w-full border py-2 rounded hover:bg-red-500 hover:text-white transition"
          >
            Delete Question
          </Link>

        </div>
      </div>
    </div>
  );
};

export default AdminPage