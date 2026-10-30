import { useState } from "react";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/useSignUp";
import AuthLayout from "../components/AuthLayout";

const SignUp = () => {
  const [data, setData] = useState({ fullName: "", email: "", password: "" });
  const { isPending, error, signupMutation } = useSignUp();

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(data);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. You'll pick your languages next."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div role="alert" className="alert alert-error rounded-2xl text-sm">
            {error.response?.data?.message || "Could not create your account. Please try again."}
          </div>
        )}
        <label className="form-control">
          <span className="label-text font-semibold mb-1.5">Full name</span>
          <input
            type="text"
            autoComplete="name"
            placeholder="How people will see you"
            className="input input-bordered rounded-2xl"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            required
          />
        </label>
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            minLength={6}
            className="input input-bordered rounded-2xl"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </label>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mt-0.5" required />
          <span className="text-base-content/70">
            I agree to the <span className="text-primary font-semibold">terms of service</span> and{" "}
            <span className="text-primary font-semibold">privacy policy</span>.
          </span>
        </label>
        <button className="btn btn-primary rounded-2xl w-full mt-2" type="submit" disabled={isPending}>
          {isPending ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
