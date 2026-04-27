import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { signup } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signup(email, password);
      navigate("/");
      window.location.href = "/";
    } catch (err: unknown) {
      console.error("Signup component error:", err);
      let message = "Something went wrong";

      const isObject = (val: unknown): val is Record<string, unknown> =>
        typeof val === "object" && val !== null;

      if (err instanceof Error) {
        message = err.message;
        const errObj = err as unknown as Record<string, unknown>;
        if (isObject(errObj.response)) {
          const resp = errObj.response as Record<string, unknown>;
          if (isObject(resp.data)) {
            const data = resp.data as Record<string, unknown>;
            if (typeof data.message === "string") {
              message = data.message;
            }
          }
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg p-4 technical-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-line p-8 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
            <UserPlus className="text-white w-5 h-5" />
          </div>
          <h1 className="font-mono text-xl font-bold tracking-tighter uppercase">
            DevTasks // Register
          </h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-muted">
              Initialize :: Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-line px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors font-mono"
                placeholder="developer@task.io"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-muted">
              Create :: Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-line px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors font-mono"
                placeholder="********"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-muted">
              Confirm :: Protocol
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-bg border border-line px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors font-mono"
                placeholder="********"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs font-mono"
            >
              FAILURE: {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? "Processing..." : "Deploy Profile"}
            {!isLoading && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-[10px] font-mono text-muted uppercase hover:text-accent transition-colors underline underline-offset-4"
          >
            Existing Account? Authenticate Here
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex justify-between items-center opacity-40 grayscale">
          <span className="text-[10px] font-mono uppercase">Node v20.x</span>
          <span className="text-[10px] font-mono uppercase">
            Registry: AES-256
          </span>
        </div>
      </motion.div>
    </div>
  );
}
