"use client";
import { useState } from "react";
import { signup } from "../../services/auth";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEnvelope, FaEye, FaEyeSlash, FaUserCircle, FaShieldAlt } from "react-icons/fa";
import AuthShell from "../../components/auth/AuthShell";
import AuthField from "../../components/auth/AuthField";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ email, password, name });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className=""
    >
      <AuthShell
        title="Create account"
        subtitle="Start posting civic issues and local updates in minutes."
        sideLabel="Welcome to CivicLens"
        sideTitle="Join a community improving cities with trusted local reporting."
        sidePoints={[
          "AI credibility indicators on posts",
          "Faster issue escalation with public visibility",
          "Track impact from report to resolution"
        ]}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
          className="mt-5"
        >
          {error && (
            <motion.div variants={{ hidden: { y: 8, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <motion.div variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
              <AuthField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                icon={<FaUserCircle />}
              />
            </motion.div>

            <motion.div variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
              <AuthField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                icon={<FaEnvelope />}
              />
            </motion.div>

            <motion.div variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
              <AuthField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
            </motion.div>
          </div>

          <motion.div variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="mt-6">
            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? <Loader small /> : "Create Account"}
            </Button>
          </motion.div>

          <motion.div variants={{ hidden: { y: 8, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="text-sm mt-4 text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-700 font-semibold hover:underline">
              Login
            </Link>
          </motion.div>
        </motion.form>
      </AuthShell>
    </motion.div>
  );
}
