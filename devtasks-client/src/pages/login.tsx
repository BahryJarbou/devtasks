import { useState } from "react";
import { motion } from "motion/react";
import { Terminal, Lock, Mail, ArrowRight } from "lucide-react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("testuser@test.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
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
            <Terminal className="text-white w-5 h-5" />
          </div>
          <h1 className="font-mono text-xl font-bold tracking-tighter uppercase">
            DevTasks // Auth
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-muted">
              Identify :: Email
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
              Protocol :: Password
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

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs font-mono"
            >
              ERROR: {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? "Authenticating..." : "Authorize Access"}
            {!isLoading && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/signup"
            className="text-[10px] font-mono text-muted uppercase hover:text-accent transition-colors underline underline-offset-4"
          >
            New Entity? Request Access (Register)
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex justify-between items-center opacity-40 grayscale">
          <span className="text-[10px] font-mono uppercase">
            Version 1.0.4a
          </span>
          <span className="text-[10px] font-mono uppercase">
            Secure Link Established
          </span>
        </div>
      </motion.div>
    </div>
  );
}
