import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(data);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div role="alert" className="alert alert-error rounded-2xl text-sm">
            {error.response?.data?.message || "Could not sign you in. Check your details and try again."}
          </div>
        )}
        <label className="form-control">
          <span className="label-text font-semibold mb-1.5">Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input input-bordered rounded-2xl"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text font-semibold mb-1.5">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            className="input input-bordered rounded-2xl"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </label>
        <button className="btn btn-primary rounded-2xl w-full mt-2" type="submit" disabled={isPending}>
          {isPending ? <span className="loading loading-spinner loading-sm" /> : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
