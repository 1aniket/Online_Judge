import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions");
        setProblems(res.data.data);
        console.log("Fetched problems:", res.data.data);
      } catch (err) {
        console.error("Error fetching problems", err);
      } finally {
        setLoading(false);
      }

      
    };



    fetchProblems();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 paper-texture">
      <h1 className="text-4xl mb-6 font-sketch">Problems</h1>

      <div className="space-y-4">
        {problems.map((problem , index) => (
              <Link key={problem._id} to={`/questions/${problem._id}`}>
              <div className=" handwriting bg-white-50 p-4 rounded-lg shadow-sm  flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    {index+1 + ". "}
                    {problem.title}
                  </h2>
                </div>

                <span
                  className={`text-sm px-2 py-1 rounded ${
                    problem.difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : problem.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </Link>
          
        ))}
      </div>
    </div>
  );
};

export default Problems;