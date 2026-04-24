import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import "../index.css";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="paper-texture h-[100vh]  ">
      <div className="navbar flex mx-3 sketch-border mt-1 p-2 flex items-center justify-between">
        <h1 className="sketch-font text-red-700 text-4xl flex">CodeYukti</h1>
       <div className="flex gap-2">
        <div className="sketch-border text-center justify-center items-center p-1 sketch-font hover:bg-gray-700 hover:text-white transition">
          <Link to={"/getquestions"}>Problem</Link>
        </div>
         <div className="sketch-border text-center justify-center items-center p-1 sketch-font hover:bg-gray-700 hover:text-white transition">
          <Link to={"/compiler"}>Compiler</Link>
        </div>
        {user === "admin" && (
          <button className="sketch-border p-2 sketch-font hover:bg-gray-700 hover:text-white transition">
            <Link to={"/admin"}>Admin Panel</Link>
          </button>
        )}
        </div>
        {!localStorage.getItem("token") ? (
          <Link
            to="/auth"
            className="flex text-green-500 sketch-border sketch-font text-xl p-2"
          >
            Login/Signup
          </Link>
        ) : (
          <a
            href="/"
            className="flex text-green-500 sketch-border sketch-font text-xl p-2"
            onClick={() => {
              toast.success("Logged out successfully");
              localStorage.removeItem("token");
              localStorage.removeItem("user");

            }}
          >
            Logout
          </a>
        )}
      </div>
      <div className="hero-section flex flex-row">
        <div className="hero-section_left mt-10 ml-10 w-[50%] text-wrap text-7xl">
          <h1 className="sketch-font">
            Master DSA with Real-Time Code Execution
          </h1>
          <p className="text-left mt-5 w-[80%] sketch-font text-xl text-blue-700">
            Practice, compete, and improve with an interactive coding platform
          </p>
          <button className="text-green-500 sketch-border sketch-font text-3xl p-2">
            Explore {" ->"}
          </button>
        </div>
        <div className="hero-section_left mt-10 ml-10 w-[50%] text-wrap text-7xl"></div>
      </div>
    </div>
  );
};

export default HomePage;
