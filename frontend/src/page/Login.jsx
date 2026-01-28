import React, { useState } from "react";
import { MdLanguage } from "react-icons/md";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { isPending, error, loginMutation } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(data);
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-1"
      style={{
        backgroundImage: "url('/2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundBlendMode: "darken",
      }}
    >
      <div
        className=" rounded-2xl shadow-lg max-w-lg w-full py-6 px-8"
        data-theme="forest"
      >
        {/* Error Component */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>
              {error.response?.data?.message ||
                "Something went wrong. Please try again."}
            </span>
          </div>
        )}
        <div className="mb-4 flex items-center justify-center gap-2">
          <MdLanguage className="size-9 text-primary animate-spin" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-blue-500 tracking-wider">
            Speak<span className="text-yellow-600">Zen</span>
          </span>
        </div>
        <div className="text-start mb-8">
          <h1 className="text-xl font-bold text-gray-100 mb-2 mt-2">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-xs">Continue SpeakZen community </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="john@gmail.com"
              className="input input-bordered w-full"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>

          

          {/* Sign Up Button */}
          <button className="btn btn-primary w-full" type="submit">
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>


        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
