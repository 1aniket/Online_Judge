import { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  //Email two way binding
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  //password two way binding
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  //Form submit handler
const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("All fields are required");
    return;
  }

  try {
    const res = await loginUser({ email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user.role));

    toast.success("Login successful");

    navigate("/", { replace: true });

  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="wrapper text-center flex flex-col items-center justify-center h-[100vh]">
      <form
        className="handwriting paper-texture sketch-border flex flex-col gap-5 w-[40%] items-center justify-center p-5 rounded-lg "
        onSubmit={handleFormSubmit}
      >
        <h1 className=" text-blue-500 text-4xl sketch-font">
          Login to Community
        </h1>

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
          className="text-gray-500 w-[50%] sketch-font font-bold py-2 px-4 border-2 sketch-border rounded-full hover:bg-gray-500 hover:text-white"
          type="submit"
        >
          Login
        </button>
        <div className="flex items-center justify-center w-[100%]">
          <p className="font-medium text-lg">
            Don't have an account ?{" "}
            <Link to="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;
