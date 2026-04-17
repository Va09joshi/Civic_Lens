"use client";
import { useEffect, useState } from "react";
import { login } from "../../services/auth";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import AuthField from "../../components/auth/AuthField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldRelogin = searchParams.get("reauth") === "1";
    if (shouldRelogin) {
      setError("Your session expired. Please login again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await login({ email, password });
      setSuccess(result.message || "Login successful");
      const next = searchParams.get("next") || "/profile?welcome=1";
      router.push(next);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-xl"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-float">
        <h1 className="text-3xl font-extrabold text-slate-900">Login</h1>
        <p className="mt-2 text-slate-600">Continue reporting and tracking civic updates.</p>
        <motion.form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {success && <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}
          {error && <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">{error}</div>}

          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            icon={<FaEnvelope />}
          />

          <AuthField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<FaShieldAlt />}
            rightAction={
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center rounded-2xl py-3.5 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-200/80 hover:shadow-blue-300/90"
          >
            {loading ? <Loader small /> : "Login"}
          </Button>

          <div className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-700 font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
