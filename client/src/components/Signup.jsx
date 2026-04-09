import React, { useState } from "react";
import { Link,  useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import toast from "react-hot-toast";
import Loader from "./Loader";
import "../index.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    

    if (!firstName || !lastName || !email || !password) {
      toast.error("All fields are required");
      
      return;
    }

    try {
      await signupUser({ firstName, lastName, email, password });

      toast.success("Signup successful ");
      navigate("..");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } 
  };
  const handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleChangeLastName = (e) => {
    setLastName(e.target.value);
  };

  return (
    <div className="wrapper text-center flex flex-col items-center justify-center h-[100vh]">
      <form
        className=" handwriting paper-texture sketch-border flex flex-col gap-5 w-[50%] items-center justify-center p-5 rounded-lg "
        onSubmit={handleFormSubmit}
      >
        <h1 className=" text-blue-500 text-4xl sketch-font ">
          Join the Community
        </h1>

        <div className="flex flex-row w-[100%] justify-between">
          <div className="w-[50%]">
            <label
              htmlFor="inputFirstName"
              className="font-light text-xl flex align-left text-gray-500"
            >
              First Name:
            </label>
            <input
              type="text"
              className="form-control text-xl font-light py-2 text-blue-700"
              placeholder="Aniket"
              name="inputFirstName"
              id="inputFirstName"
              value={firstName}
              onChange={handleChangeFirstName}
              required
              autoFocus
            />
          </div>
          <div className="w-[50%]">
            <label
              htmlFor="inputLastName"
              className="font-medium text-xl flex align-left text-gray-500"
            >
              Last Name:{" "}
            </label>
            <input
              type="text"
              className="form-control text-xl font-light py-2 text-blue-700"
              placeholder="Bhogawar"
              name="inputLastName"
              id="inputLastName"
              value={lastName}
              onChange={handleChangeLastName}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="flex flex-col w-[100%]">
          <label
            htmlFor="inputEmail"
            className="font-medium text-xl flex align-left text-gray-500"
          >
            Email
          </label>
          <input
            type="email"
            className="form-control text-xl font-light py-2 text-blue-700"
            placeholder="Email address"
            name="inputEmail"
            id="inputEmail"
            value={email}
            onChange={handleChangeEmail}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col w-[100%]">
          <label
            htmlFor="inputPassword"
            className="font-medium text-xl flex align-left text-gray-500"
          >
            Password
          </label>
          <input
            type="password"
            className="form-control text-xl font-light py-2 text-blue-700"
            placeholder="Password"
            value={password}
            onChange={handleChangePassword}
            required
          />
        </div>

        <button
          className="text-gray-500 w-[40%] sketch-font font-bold py-2 px-4 border-2 sketch-border rounded-full hover:bg-gray-500 hover:text-white"
          type="submit"
        >
          Sign up
        </button>
        <div className="flex items-center justify-center w-[100%]">
          <p className="font-medium text-lg">
            Already have an account ?{" "}
            <Link to="/auth" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
