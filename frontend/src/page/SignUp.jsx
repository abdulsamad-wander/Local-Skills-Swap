import React, { useState } from "react";
import { MdLanguage } from "react-icons/md";
import useSignUp from "../hooks/useSignup";
import { Link } from "react-router";

const SignUp = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { isPending, error, signupMutation } = useSignUp();

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(data);
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
            Create Account
          </h1>
          <p className="text-gray-300 text-xs">Join SpeakZen community today</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
              required
            />
          </div>

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
            <p className="text-xs opacity-70 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Terms Checkbox */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                required
              />
              <span className="text-xs leading-tight">
                I agree to the{" "}
                <span className="text-primary hover:underline">
                  terms of service
                </span>{" "}
                and{" "}
                <span className="text-primary hover:underline">
                  privacy policy
                </span>
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button className="btn btn-primary w-full" type="submit">
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}

        {/* Social Buttons */}
        {/* <div className="flex gap-4 mb-6"> */}
        {/* <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span>Google</span>
          </button> */}
        {/* <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button> */}
        {/* </div> */}

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
